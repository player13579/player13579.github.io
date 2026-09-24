(async function () {
  'use strict';
  const params = new URLSearchParams(location.search);
  const verify = params.has('verify');
  const canvas = document.getElementById('heal');
  const status = document.getElementById('status');
  const WIDTH = 980, HEIGHT = 620, DURATION = 12000;
  const player = Object.freeze({ id: 'heal-preview-caster', x: WIDTH / 2, y: HEIGHT / 2 + 28 });
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const fixedPhase = verify && params.has('phase')
    ? Math.max(0, Math.min(DURATION - 1, Number(params.get('phase')) * 1000)) : null;
  const reducedMotion = params.get('reduced') === '1';
  const previewId = globalThis.crypto?.randomUUID?.() || String(Date.now());
  let renderer, targetHandle, healPass, audioContext, audioPlayer;
  let phaseMs = fixedPhase ?? 0, lastFrame = 0, rafId = 0, frameId = 0;
  function render() {
    const viewport = { kind: 'main', width: WIDTH, height: HEIGHT,
      pixelWidth: targetHandle.width, pixelHeight: targetHandle.height };
    const effect = { id: `heal-preview:${previewId}`, type: 'flora', playerId: player.id,
      startedAt: 0, duration: DURATION };
    const planned = window.DvaWebGPUHealE.plan({ effect, player, now: phaseMs,
      camera: { x: 0, y: 0 }, zoom: 1, viewport, reducedMotion,
      accelerationUntil: DURATION });
    const frame = renderer.beginFrame(`Heal preview ${++frameId}`);
    try {
      frame.clear('heal-preview', [0.028, 0.072, 0.095, 1]);
      const outcome = healPass.record({ frame, target: 'heal-preview', viewport, planned });
      frame.submit();
      window.__healPreviewSnapshot = Object.freeze({ ready: true, frameId,
        phaseMs, drawn: outcome.drawn, effectId: planned?.effectId || '',
        accelerationActive: Boolean(planned?.accelerationActive), verify });
      status.textContent = '';
    } catch (error) {
      try { frame.discard(); } catch (_) {}
      throw error;
    }
  }
  function tick(now) {
    rafId = 0;
    phaseMs = (phaseMs + Math.min(50, Math.max(0, now - lastFrame))) % DURATION;
    lastFrame = now;
    render();
    rafId = requestAnimationFrame(tick);
  }
  async function playPreviewSound() {
    try {
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextCtor || !window.DvaHealESfx) throw new Error('Heal audio unavailable');
      if (!audioContext) {
        audioContext = new AudioContextCtor();
        const master = audioContext.createGain();
        master.gain.value = 0.58;
        master.connect(audioContext.destination);
        audioPlayer = window.DvaHealESfx.createPlayer({
          getAudioContext: () => audioContext, getMasterGain: () => master,
          nowMs: () => performance.now() });
      }
      if (audioContext.state === 'suspended') await audioContext.resume();
      const nowMs = performance.now();
      const event = { kind: 'self-restoration', self: true,
        eventId: `heal-preview-sound:${previewId}`, roomId: 'heal-preview',
        roomGeneration: 0, eventAtMs: nowMs };
      const cue = audioPlayer.play(event, { nowMs, verify, volume: 0.58 });
      window.__healPreviewAudio = Object.freeze({ status: cue ? 'scheduled' : 'suppressed',
        verify, cue: cue?.sourceEventId || '' });
    } catch (error) {
      window.__healPreviewAudio = Object.freeze({ status: 'error', error: String(error) });
    }
  }
  try {
    if (!window.DvaWebGPURenderer?.create || !window.DvaWebGPUHealE?.create)
      throw new Error('Shared WebGPU renderer or Heal E unavailable');
    renderer = await window.DvaWebGPURenderer.create({ gpu: navigator.gpu });
    targetHandle = renderer.registerTarget('heal-preview', canvas,
      { width: Math.round(WIDTH * dpr), height: Math.round(HEIGHT * dpr),
        logicalWidth: WIDTH, logicalHeight: HEIGHT });
    healPass = window.DvaWebGPUHealE.create({ renderer, frameOwner: renderer });
    await healPass.ready;
    render();
    window.__healPreviewReady = true;
    if (fixedPhase === null) {
      lastFrame = performance.now();
      rafId = requestAnimationFrame(tick);
    }
  } catch (error) {
    try { healPass?.destroy(); } catch (_) {}
    try { targetHandle?.unregister(); } catch (_) {}
    try { renderer?.destroy(); } catch (_) {}
    window.__healPreviewReady = false;
    window.__healPreviewError = String(error?.stack || error);
    status.textContent = `WebGPU unavailable: ${String(error)}`;
  }
  canvas.addEventListener('pointerdown', () => { void playPreviewSound(); }, { once: true });
  window.addEventListener('beforeunload', () => {
    if (rafId) cancelAnimationFrame(rafId);
    healPass?.destroy(); renderer?.destroy();
    if (audioContext && audioContext.state !== 'closed') void audioContext.close();
  }, { once: true });
})();
