import * as LuckV1 from './experiments/luck-e-v1.mjs';
import * as LuckV2 from './experiments/luck-e-v2.mjs';
import * as LuckV3 from './experiments/luck-e-v3-revision.mjs';

(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const version = params.get('version');
  const canvas = document.getElementById('stage');
  const error = document.getElementById('error');
  let disposed = false;
  let animation = 0;
  let reportTimer = 0;
  let candidate;
  const formatError = value => String(value?.stack || value?.message || value);

  function showError(value) {
    error.textContent = `WebGPU candidate error: ${formatError(value)}`;
    error.hidden = false;
    window.__luckCandidateSnapshot = { ready: false, version, error: error.textContent };
  }

  function startV1() {
    return LuckV1.mountTest(canvas, { rate: 2, volume: 0, onError: showError }).then(controls => {
      candidate = controls;
      canvas.style.setProperty('width', '100%', 'important');
      canvas.style.setProperty('height', '100%', 'important');
      window.__luckCandidateSnapshot = { ready: true, version: LuckV1.VERSION,
        source: 'ChatGPT Pro Luck v1', renderer: 'WebGPU', audioEnabled: false };
      reportTimer = setInterval(() => {
        if (!disposed && controls.lastError) showError(controls.lastError);
      }, 200);
    });
  }

  function startV2OrV3(module, label) {
    if (!navigator.gpu) throw new Error('WebGPU is unavailable');
    const devicePromise = navigator.gpu.requestAdapter({ powerPreference: 'high-performance' })
      .then(adapter => {
        if (!adapter) throw new Error('No WebGPU adapter was returned');
        return adapter.requestDevice();
      });
    return devicePromise.then(async device => {
      const context = canvas.getContext('webgpu');
      if (!context) throw new Error('Could not acquire a WebGPU canvas context');
      const format = navigator.gpu.getPreferredCanvasFormat();
      const sessionId = `luck-gallery-${version}`;
      const frameOwner = module.createFrameOwner({ device });
      const pass = module.create({ renderer: { device, format, outputTransfer: 'srgb' }, frameOwner });
      candidate = { device, context, format, frameOwner, pass, sessionId };
      context.configure({ device, format, alphaMode: 'opaque' });
      await pass.ready;
      const origin = performance.now();
      let frameId = 0;
      window.__luckCandidateSnapshot = { ready: true, version: module.VERSION,
        source: label, renderer: 'WebGPU', audioEnabled: false };

      const draw = now => {
        animation = 0;
        if (disposed || document.hidden) return;
        try {
          const dpr = Math.min(2, Math.max(1, devicePixelRatio || 1));
          const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
          const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
          if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
          }
          const view = context.getCurrentTexture().createView();
          const elapsed = Math.max(0, (now - origin) * 2);
          const lifetime = 1680;
          const cycle = Math.floor(elapsed / lifetime);
          const age = elapsed % lifetime;
          const roomEpoch = `room-${cycle}`;
          const input = {
            sessionId, roomEpoch, viewport: { x: 0, y: 0, width: canvas.clientWidth, height: canvas.clientHeight },
            dpr, zoom: 1,
            camera: { viewProjection: [
              .02,0,0,0, 0,.02,0,0, 0,0,-.01,0, 0,0,.5,1
            ], reverseZ: false, audit: { projectionType: 'orthographic',
              view: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,-50,1],
              projection: [.02,0,0,0,0,.02,0,0,0,0,-.01,0,0,0,0,1],
              pose: { position_m: [0,0,50], forward: [0,0,-1], up: [0,1,0] },
              FOV_or_scale: { vertical: 100, unit: 'm' } } },
            surfaceVisible: true, reducedMotion: false,
            world: { gravity: { condition: 'normal', vector: [0,-1,0], strength: 'host fixture' },
              medium: { state: 'air', density: 'host fixture', viscosity: 'host fixture' } },
            actors: [{ id: 'recipient', position: [0,0,0],
              body: { right: [1,0,0], up: [0,1,0], halfWidth: 3, halfHeight: 6 },
              display: { visible: true, opacity: 1 }, human: true, poseType: 'standing',
              declaredAttributes: { role: 'synthetic preview recipient' },
              poseMechanics: { intent: 'Maintain a static standing preview pose.',
                primary_axis: 'Head, thorax, pelvis above existing support.', gaze_or_orientation: 'Host forward',
                contact_points: ['left foot','right foot'], COM_or_support_center: 'within support polygon',
                reaction_or_propulsion: 'Host support; E adds zero force.',
                limb_or_appendage_roles: 'Both feet support; arms retain host pose.',
                recovery: 'No E perturbation.', mode: 'static_balance' } }],
            events: [{ id: `acquisition-${cycle}`, type: 'benefit-acquired', playerId: 'recipient',
              effectKind: 'luckBoost', variant: 'donation-rational', durationMs: lifetime,
              elapsedActorMs: age, actorRate: 2 }]
          };
          const planned = module.plan(input);
          const encoder = device.createCommandEncoder({ label: `${label} preview frame` });
          const clear = encoder.beginRenderPass({ colorAttachments: [{ view,
            clearValue: { r: .025, g: .035, b: .055, a: 1 }, loadOp: 'clear', storeOp: 'store' }] });
          clear.end();
          const frame = { id: ++frameId, encoder };
          const target = { view, width: canvas.width, height: canvas.height, sampleCount: 1 };
          pass.record({ frame, target, viewport: planned.viewport, planned });
          device.queue.submit([encoder.finish()]);
          void frameOwner.submitted(frame, { sessionId, roomEpoch, surfaceVisible: true })
            .then(receipts => {
              if (!disposed) window.__luckCandidateSnapshot = { ready: true, version: module.VERSION,
                source: label, renderer: 'WebGPU', audioEnabled: false, frame: frameId,
                ageActorMs: age, visibleReceipts: receipts.length };
            }).catch(showError);
          animation = requestAnimationFrame(draw);
        } catch (failure) { showError(failure); }
      };
      candidate.draw = draw;
      animation = requestAnimationFrame(draw);
    });
  }

  async function cleanup() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(animation);
    clearInterval(reportTimer);
    if (candidate?.destroy) await candidate.destroy();
    else if (candidate?.pass) {
      await candidate.pass.destroy();
      candidate.frameOwner.destroy();
      candidate.context.unconfigure();
      candidate.device.destroy();
    }
  }

  window.addEventListener('pagehide', () => { void cleanup(); }, { once: true });
  window.addEventListener('beforeunload', () => { void cleanup(); }, { once: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(animation); animation = 0; }
    else if (!disposed && candidate?.draw && !animation)
      animation = requestAnimationFrame(candidate.draw);
  });
  if (version === 'v1') void startV1().catch(showError);
  else if (version === 'v2') void startV2OrV3(LuckV2, 'ChatGPT Pro Luck v2').catch(showError);
  else if (version === 'v3') void startV2OrV3(LuckV3, 'ChatGPT Pro Luck revision').catch(showError);
  else showError(new Error(`Unknown Luck E version: ${version}`));
})();
