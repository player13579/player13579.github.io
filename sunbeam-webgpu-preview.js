(async function () {
  'use strict';
  const params = new URLSearchParams(location.search);
  const verify = params.has('verify');
  window.__sunbeamAudioGain = 0;
  window.__sunbeamVerifyMode = verify;
  const canvas = document.getElementById('sunbeam');
  const status = document.getElementById('status');
  const WIDTH = 980, HEIGHT = 620, SOURCE = Object.freeze({ x: 2000, y: 1600 });
  const PHILIA_RELEASE_HANDS = Object.freeze({
    front: Object.freeze([{ x: -10.49, y: -27.47 }, { x: 14.12, y: -27.47 }]),
    right: Object.freeze([{ x: 31.08, y: -29.76 }]),
    back: Object.freeze([{ x: -19.61, y: -57.82 }, { x: 19.61, y: -57.82 }]),
    left: Object.freeze([{ x: -26.51, y: -31.81 }])
  });
  const bounded = (name, fallback, min, max) => {
    const value = Number(params.get(name));
    return params.has(name) && Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
  };
  const pose = Object.hasOwn(PHILIA_RELEASE_HANDS, params.get('pose')) ? params.get('pose') : 'right';
  const range = bounded('range', 520, 80, 950);
  const angle = bounded('angle', 0, 0, 359) * Math.PI / 180;
  const zoom = bounded('zoom', .75, .35, 1.65);
  const dpr = bounded('dpr', Math.min(2, window.devicePixelRatio || 1), 1, 2);
  const reducedMotion = params.get('reduced') === '1';
  const idSeed = globalThis.crypto?.randomUUID?.() || String(Date.now());
  let renderer, targetHandle, sunbeamPass, audioContext, cueAdapter;
  let elapsed = bounded('phase', .3, 0, 1.199) * 1000;
  const freezeFrame = verify && params.has('phase');
  let lastFrame = 0, rafId = 0, frameId = 0;

  function render() {
    if (!renderer || !sunbeamPass || renderer.state !== 'ready') return;
    const direction = { x: Math.cos(angle), y: Math.sin(angle) };
    const targetWorld = { x: SOURCE.x + direction.x * range, y: SOURCE.y + direction.y * range };
    const camera = { x: SOURCE.x - WIDTH / (2 * zoom), y: SOURCE.y - HEIGHT / (2 * zoom) };
    const viewport = { kind: 'main', width: WIDTH, height: HEIGHT,
      pixelWidth: Math.round(WIDTH * dpr), pixelHeight: Math.round(HEIGHT * dpr) };
    const handWorlds = PHILIA_RELEASE_HANDS[pose].map(offset => ({
      x: SOURCE.x + offset.x, y: SOURCE.y + offset.y
    }));
    const scene = { nowMs: elapsed, reducedMotion,
      effects: [{ id: `sunbeam-preview:${idSeed}`, type: 'flora-sunbeam', playerId: 'preview-flora',
        startedAt: 0, duration: 1200, sourceWorld: SOURCE, handWorlds,
        facing: direction, targetWorld }] };
    const frame = renderer.beginFrame(`Sunbeam preview ${++frameId}`);
    try {
      frame.clear('sunbeam-preview', [0.025, 0.052, 0.075, 1]);
      frame.stage('world:sunbeam-preview-e');
      const outcome = sunbeamPass.record({ frame, target: 'sunbeam-preview', viewport,
        scene, camera, zoom });
      frame.submit();
      const plan = outcome.effects[0];
      window.__sunbeamPreviewSnapshot = Object.freeze({ ready: true, frameId,
        phaseMs: elapsed, zoom, dpr, pose, emitterCount: handWorlds.length,
        sourceWorld: SOURCE, serverRangeWorld: range, targetWorld,
        rayCount: plan.rays.length, shaderPassCount: outcome.passes,
        hands: handWorlds.map((hand, index) => ({ sourceId: scene.effects[0].id, index,
          logical: { x: (hand.x - camera.x) * zoom, y: (hand.y - camera.y) * zoom }, world: hand })),
        reducedMotion, clippedByCanvas: plan.rays.some(ray => ray.target.x < 0 || ray.target.x > WIDTH ||
          ray.target.y < 0 || ray.target.y > HEIGHT) });
      status.textContent = '';
    } catch (error) {
      try { frame.discard(); } catch (_) {}
      throw error;
    }
  }

  function tick(now) {
    rafId = 0;
    elapsed = (elapsed + Math.min(50, Math.max(0, now - lastFrame))) % 1200;
    lastFrame = now;
    render();
    rafId = requestAnimationFrame(tick);
  }

  async function playPreviewSound() {
    if (verify) {
      window.__sunbeamPreviewAudio = Object.freeze({ status: 'suppressed', verify: true, scheduledNodes: 0 });
      return;
    }
    try {
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextCtor) throw new Error('Web Audio unavailable');
      if (!audioContext) {
        audioContext = new AudioContextCtor();
        const audioMaster = audioContext.createGain();
        audioMaster.gain.value = 1;
        audioMaster.connect(audioContext.destination);
        const player = window.DvaWebGPUECuePlayer.createPlayer({
          getContext: () => audioContext, getMaster: () => audioMaster,
          isMuted: () => false, isVerify: () => verify
        });
        cueAdapter = window.DvaWebGPUSunbeamCueAdapter.createAdapter({
          planner: window.DvaWebGPUSunbeamESfx.createPlanner(), player,
          isVerify: () => verify
        });
      }
      if (audioContext.state === 'suspended') await audioContext.resume();
      window.__sunbeamPreviewAudio = cueAdapter.playPreview({ userGesture: true,
        previewId: idSeed, roomId: 'sunbeam-preview', roomGeneration: 0,
        nowMs: performance.now(), verify, muted: false, volume: .58, reducedMotion });
    } catch (error) {
      window.__sunbeamPreviewAudio = Object.freeze({ status: 'error', error: String(error) });
    }
  }

  try {
    if (!window.DvaWebGPUFrameCore?.create || !window.DvaWebGPUPrimitives?.create ||
        !window.DvaWebGPUCompositing?.create || !window.DvaWebGPURenderer?.create ||
        !window.DvaWebGPUSunbeamE?.create)
      throw new Error('Shared WebGPU frame or Sunbeam E module unavailable');
    renderer = await window.DvaWebGPURenderer.create({ gpu: navigator.gpu });
    targetHandle = renderer.registerTarget('sunbeam-preview', canvas,
      { width: WIDTH, height: HEIGHT, logicalWidth: WIDTH, logicalHeight: HEIGHT });
    sunbeamPass = window.DvaWebGPUSunbeamE.create({ renderer, frameOwner: renderer });
    await sunbeamPass.ready;
    targetHandle.resize(Math.round(WIDTH * dpr), Math.round(HEIGHT * dpr),
      { width: WIDTH, height: HEIGHT });
    render();
    window.__sunbeamPreviewReady = true;
    if (!freezeFrame) {
      lastFrame = performance.now();
      rafId = requestAnimationFrame(tick);
    }
  } catch (error) {
    try { sunbeamPass?.destroy(); } catch (_) {}
    try { targetHandle?.unregister(); } catch (_) {}
    try { renderer?.destroy(); } catch (_) {}
    window.__sunbeamPreviewReady = false;
    window.__sunbeamPreviewError = String(error?.stack || error);
    status.textContent = `WebGPU unavailable: ${String(error)}`;
  }

  canvas.addEventListener('pointerdown', () => { void playPreviewSound(); }, { once: true });
  window.addEventListener('beforeunload', () => {
    if (rafId) cancelAnimationFrame(rafId);
    sunbeamPass?.destroy(); renderer?.destroy();
    if (audioContext && audioContext.state !== 'closed') void audioContext.close();
  }, { once: true });
})();
