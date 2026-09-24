(async function () {
  'use strict';
  const params = new URLSearchParams(location.search);
  const verify = params.has('verify');
  window.__sunbeamAudioGain = 0;
  window.__sunbeamVerifyMode = verify;
  const el = id => document.getElementById(id);
  const ui = Object.fromEntries(['sunbeam','status','phase','phaseText','angle','angleText',
    'range','rangeText','zoom','zoomText','dpr','dprText','hands','handsText','pose','poseText',
    'reduced','motionText','animate','sound','reset'].map(id => [id, el(id)]));
  const WIDTH = 980, HEIGHT = 620, SOURCE = Object.freeze({ x: 2000, y: 1600 });
  const PHILIA_RELEASE_HANDS = Object.freeze({
    front: Object.freeze([{ x: -10.49, y: -27.47 }, { x: 14.12, y: -27.47 }]),
    right: Object.freeze([{ x: 31.08, y: -29.76 }]),
    back: Object.freeze([{ x: -19.61, y: -57.82 }, { x: 19.61, y: -57.82 }]),
    left: Object.freeze([{ x: -26.51, y: -31.81 }])
  });
  const idSeed = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  let renderer, targetHandle, sunbeamPass, audioContext, audioMaster, cueAdapter;
  let elapsed = params.has('phase') ? Number(params.get('phase')) * 1000 : 300;
  if (!Number.isFinite(elapsed)) elapsed = 300;
  elapsed = Math.max(0, Math.min(1200, elapsed));
  let animated = false, lastFrame = performance.now(), rafId = 0, frameId = 0;

  const pointForHand = (offset, source = SOURCE) => ({ x: source.x + offset.x, y: source.y + offset.y });
  function displayLabels() {
    ui.phase.value = String(elapsed / 1000);
    ui.phaseText.textContent = `${(elapsed / 1000).toFixed(2)} s / 1.20 s`;
    ui.angleText.textContent = `${Math.round(Number(ui.angle.value))}°`;
    ui.rangeText.textContent = `${ui.range.value} world units`;
    ui.zoomText.textContent = `${Number(ui.zoom.value).toFixed(2)}×`;
    ui.dprText.textContent = `${ui.dpr.value}×`;
    ui.handsText.textContent = `${PHILIA_RELEASE_HANDS[ui.pose.value].length} registered point(s)`;
    ui.poseText.textContent = `${ui.pose.value} / release`;
    ui.motionText.textContent = ui.reduced.value === '1' ? 'on' : 'off';
    ui.animate.textContent = animated ? '時間を止める' : '時間を進める';
  }
  function resizeTarget() {
    if (!renderer || !targetHandle) return;
    const dpr = Number(ui.dpr.value);
    const physicalWidth = Math.round(WIDTH * dpr), physicalHeight = Math.round(HEIGHT * dpr);
    targetHandle.resize(physicalWidth, physicalHeight, { width: WIDTH, height: HEIGHT });
  }
  function rect(frame, targetName, x, y, w, h, rgba) {
    frame.rect(targetName, { x, y, w, h, color: rgba, mode: 'source-over' });
  }
  function render() {
    if (!renderer || !targetHandle || !sunbeamPass || renderer.state !== 'ready') return;
    const phaseMs = elapsed;
    const radians = Number(ui.angle.value) * Math.PI / 180;
    const distance = Number(ui.range.value);
    const direction = { x: Math.cos(radians), y: Math.sin(radians) };
    const targetWorld = { x: SOURCE.x + direction.x * distance,
      y: SOURCE.y + direction.y * distance };
    const zoom = Number(ui.zoom.value);
    const camera = { x: SOURCE.x - WIDTH / (2 * zoom), y: SOURCE.y - HEIGHT / (2 * zoom) };
    const backing = Number(ui.dpr.value);
    const viewport = { kind: 'main', width: WIDTH, height: HEIGHT,
      pixelWidth: Math.round(WIDTH * backing), pixelHeight: Math.round(HEIGHT * backing) };
    const offsets = PHILIA_RELEASE_HANDS[ui.pose.value].slice(0, Number(ui.hands.value));
    const handWorlds = offsets.map(offset => pointForHand(offset));
    const scene = { nowMs: phaseMs, reducedMotion: ui.reduced.value === '1',
      effects: [{ id: `sunbeam-preview:${idSeed}`, type: 'flora-sunbeam', playerId: 'preview-flora',
        startedAt: 0, duration: 1200, sourceWorld: SOURCE, handWorlds,
        facing: direction, targetWorld }] };
    const frame = renderer.beginFrame(`Sunbeam preview ${++frameId}`);
    try {
      frame.clear('sunbeam-preview', [0.025, 0.052, 0.075, 1]);
      frame.stage('preview:calibration');
      for (let x = 40; x < WIDTH; x += 80)
        rect(frame, 'sunbeam-preview', x, 50, 1, HEIGHT - 100, [0.10, 0.21, 0.28, .16]);
      for (let y = 70; y < HEIGHT; y += 80)
        rect(frame, 'sunbeam-preview', 40, y, WIDTH - 80, 1, [0.10, 0.21, 0.28, .16]);
      // This cross marks the actual preview receipt point (not an actor-center fallback).
      const screenSource = { x: (SOURCE.x - camera.x) * zoom, y: (SOURCE.y - camera.y) * zoom };
      rect(frame, 'sunbeam-preview', screenSource.x - 7, screenSource.y - 1, 14, 2, [0.69, .83, .90, .78]);
      rect(frame, 'sunbeam-preview', screenSource.x - 1, screenSource.y - 7, 2, 14, [0.69, .83, .90, .78]);
      frame.stage('world:sunbeam-preview-e');
      const outcome = sunbeamPass.record({ frame, target: 'sunbeam-preview', viewport,
        scene, camera, zoom });
      frame.submit();
      const plan = outcome.effects[0];
      const handPoints = handWorlds.map((hand, index) => ({
        sourceId: scene.effects[0].id, index,
        logical: { x: (hand.x - camera.x) * zoom, y: (hand.y - camera.y) * zoom },
        world: hand
      }));
      window.__sunbeamPreviewSnapshot = Object.freeze({ ready: true, frameId,
        phaseMs, zoom, dpr: backing, pose: ui.pose.value, emitterCount: handPoints.length,
        sourceWorld: SOURCE, serverRangeWorld: distance, targetWorld,
        rayCount: plan.rays.length, rectangleCount: outcome.commands.length,
        hands: handPoints, reducedMotion: scene.reducedMotion,
        clippedByCanvas: plan.rays.some(ray => ray.target.x < 0 || ray.target.x > WIDTH ||
          ray.target.y < 0 || ray.target.y > HEIGHT) });
      ui.status.textContent = `WebGPU · 同一 Sunbeam E · ${ui.pose.value} release · ${handPoints.length} hand point(s) · ${distance} / 950 world · ${phaseMs.toFixed(0)} ms`;
    } catch (error) {
      try { frame.discard(); } catch (_) {}
      throw error;
    }
    displayLabels();
  }
  function schedule() {
    if (!animated || rafId) return;
    rafId = requestAnimationFrame(tick);
  }
  function tick(now) {
    rafId = 0;
    if (!animated) return;
    elapsed = (elapsed + Math.min(50, Math.max(0, now - lastFrame))) % 1200;
    lastFrame = now;
    render();
    schedule();
  }
  function invalidateAnimation() {
    animated = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    displayLabels();
  }
  async function playPreviewSound() {
    if (verify) {
      ui.status.textContent = 'verify mode · audio forced to zero';
      window.__sunbeamPreviewAudio = Object.freeze({ status: 'suppressed', verify: true, scheduledNodes: 0 });
      return;
    }
    try {
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextCtor) throw new Error('Web Audio unavailable');
      if (!audioContext) {
        audioContext = new AudioContextCtor();
        audioMaster = audioContext.createGain();
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
      const result = cueAdapter.playPreview({ userGesture: true,
        previewId: idSeed, roomId: 'sunbeam-preview', roomGeneration: 0,
        nowMs: performance.now(), verify, muted: false, volume: .58,
        reducedMotion: ui.reduced.value === '1' });
      window.__sunbeamPreviewAudio = result;
      ui.status.textContent = result.status === 'scheduled'
        ? 'WebGPU · Sunbeam cue scheduled once · finite layers · volume 58%'
        : `audio ${result.status}: ${result.reason || 'not scheduled'}`;
    } catch (error) {
      window.__sunbeamPreviewAudio = Object.freeze({ status: 'error', error: String(error) });
      ui.status.textContent = `audio unavailable: ${String(error)}`;
    }
  }

  try {
    if (!window.DvaWebGPUFrameCore?.create || !window.DvaWebGPUPrimitives?.create ||
        !window.DvaWebGPUCompositing?.create || !window.DvaWebGPURenderer?.create ||
        !window.DvaWebGPUSunbeamE?.create)
      throw new Error('Shared WebGPU frame or Sunbeam E module unavailable');
    renderer = await window.DvaWebGPURenderer.create({ gpu: navigator.gpu });
    targetHandle = renderer.registerTarget('sunbeam-preview', ui.sunbeam,
      { width: WIDTH, height: HEIGHT, logicalWidth: WIDTH, logicalHeight: HEIGHT });
    sunbeamPass = window.DvaWebGPUSunbeamE.create();
    resizeTarget();
    render();
    window.__sunbeamPreviewReady = true;
  } catch (error) {
    window.__sunbeamPreviewReady = false;
    window.__sunbeamPreviewError = String(error?.stack || error);
    ui.status.textContent = `WebGPU unavailable: ${String(error)}`;
  }

  ui.phase.addEventListener('input', () => { invalidateAnimation(); elapsed = Number(ui.phase.value) * 1000; render(); });
  for (const control of [ui.angle, ui.range, ui.zoom, ui.dpr, ui.hands, ui.pose, ui.reduced])
    control.addEventListener('input', control === ui.dpr || control === ui.pose || control === ui.hands || control === ui.reduced ? () => {
      invalidateAnimation(); resizeTarget(); render(); displayLabels();
    } : () => { invalidateAnimation(); render(); displayLabels(); });
  ui.dpr.addEventListener('change', () => { resizeTarget(); render(); });
  ui.pose.addEventListener('change', render);
  ui.hands.addEventListener('change', render);
  ui.reduced.addEventListener('change', render);
  ui.animate.addEventListener('click', () => {
    animated = !animated; lastFrame = performance.now(); displayLabels(); schedule();
  });
  ui.sound.addEventListener('click', playPreviewSound);
  ui.reset.addEventListener('click', () => { invalidateAnimation(); elapsed = 300; render(); });
  window.addEventListener('beforeunload', () => {
    invalidateAnimation(); sunbeamPass?.destroy(); renderer?.destroy();
    if (audioContext && audioContext.state !== 'closed') void audioContext.close();
  }, { once: true });
  displayLabels();
})();
