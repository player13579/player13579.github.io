(async function () {
  'use strict';
  const WIDTH = 930, HEIGHT = 860;
  const SOURCE_PATH = 'assets/generated/cafeteria-review-source-v1.png';
  const SLOT_MS = 1800, AMBIENT_AT_MS = 6000, LOOP_MS = 9000;
  const ROOM_ORIGIN = Object.freeze({ x: 1120, y: 2420 });
  const canvas = document.getElementById('cafeteria');
  const status = document.getElementById('status');
  const params = new URLSearchParams(location.search);
  const verify = params.has('verify');
  const modules = Object.freeze({ renderer: window.DvaWebGPURenderer,
    effect: window.DvaWebGPUMapCafeteriaE, audio: window.DvaWebGPUMapCafeteriaESfx });
  const pixelRatio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const eventToken = globalThis.crypto?.randomUUID?.() || String(Date.now());
  let renderer, targetHandle, roomTexture, effectPass, audioContext, audioMaster;
  let audioEnabled = false, frameId = 0, rafId = 0;
  const sfxPlanner = modules.audio?.createPlanner?.();
  const fixtures = modules.effect?.OBJECTS ? Object.values(modules.effect.OBJECTS) : [];
  const map = Object.freeze({ id: 'station', objects: Object.freeze(fixtures.map(item => Object.freeze({
    id: item.id, type: item.type, effectKind: item.effectKind, x: item.x, y: item.y, room: 'cafeteria'
  }))) });

  function dependencies() {
    if (!navigator.gpu) return 'WebGPU 非対応: このプレビューは WebGPU 対応環境が必要です。';
    if (!modules.renderer?.create) return '共有 WebGPU renderer が未読込です。';
    if (!modules.effect?.create || fixtures.length !== 3) return '食堂 E モジュールが未読込です。';
    if (!modules.audio?.createPlanner || !modules.audio?.play) return '食堂 SFX モジュールが未読込です。';
    return '';
  }

  async function loadRoomTexture() {
    const response = await fetch(SOURCE_PATH, { cache: 'no-store' });
    if (!response.ok) return null;
    const blob = await response.blob();
    const header = new DataView(await blob.slice(0, 26).arrayBuffer());
    const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
    const isPng = pngSignature.every((byte, index) => header.getUint8(index) === byte);
    if (!isPng || header.getUint32(16) !== WIDTH || header.getUint32(20) !== HEIGHT ||
        header.getUint8(25) !== 6 || ![8, 16].includes(header.getUint8(24)))
      throw new Error('原画は930×860・8/16 bit RGBA PNG が必要です');
    const image = new Image();
    image.src = URL.createObjectURL(blob);
    try { await image.decode(); } catch (_) { URL.revokeObjectURL(image.src); return null; }
    if (image.naturalWidth !== WIDTH || image.naturalHeight !== HEIGHT) {
      URL.revokeObjectURL(image.src);
      throw new Error(`原画サイズ不一致: ${image.naturalWidth}×${image.naturalHeight} (930×860 必須)`);
    }
    const texture = renderer.own(renderer.device.createTexture({ label: 'Original cafeteria room RGBA',
      size: [WIDTH, HEIGHT], format: 'rgba8unorm', usage: GPUTextureUsage.COPY_DST |
        GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT }));
    renderer.device.queue.copyExternalImageToTexture({ source: image },
      { texture, premultipliedAlpha: true }, [WIDTH, HEIGHT]);
    URL.revokeObjectURL(image.src);
    return texture;
  }

  function fixtureEvent(index, elapsedMs, loopIndex) {
    const spec = fixtures[index], start = loopIndex * LOOP_MS + index * SLOT_MS;
    return { id: `${eventToken}:fixture:${loopIndex}:${spec.id}`, type: modules.effect.TYPE,
      accepted: true, objectId: spec.id, objectType: spec.type, effectKind: spec.effectKind,
      playerId: `${eventToken}:preview-player`, startedAt: start, duration: spec.durationMs,
      roomId: 'cafeteria-preview', roomGeneration: 0, nowMs: elapsedMs, volume: 0.58 };
  }

  function ambientEvent(elapsedMs, loopIndex) {
    const start = loopIndex * LOOP_MS + AMBIENT_AT_MS;
    return { id: `${eventToken}:ambient:${loopIndex}`, type: modules.effect.AMBIENT_TYPE,
      accepted: true, revision: `${eventToken}:service:${loopIndex}`, startedAt: start,
      duration: modules.effect.AMBIENT.durationMs, roomId: 'cafeteria-preview',
      roomGeneration: 0, nowMs: elapsedMs, volume: 0.44 };
  }

  async function enableAudio() {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor || !modules.audio) return;
    try {
      if (!audioContext) {
        audioContext = new AudioContextCtor();
        audioMaster = audioContext.createGain();
        audioMaster.gain.value = 1;
        audioMaster.connect(audioContext.destination);
      }
      if (audioContext.state === 'suspended') await audioContext.resume();
      audioEnabled = audioContext.state === 'running';
      if (audioEnabled) status.textContent = roomTexture
        ? '原画 930×860 · 3設備E＋環境E 自動ループ · 効果音 有効'
        : `原画待ち: ${SOURCE_PATH} · E単体プレビュー・未完成 · 効果音 有効`;
    } catch (_) { audioEnabled = false; }
  }

  function processSound(event, ambient = false) {
    if (!audioEnabled || !audioContext || audioContext.state !== 'running') return;
    const policy = { nowMs: event.nowMs, roomId: event.roomId,
      roomGeneration: event.roomGeneration, volume: event.volume, muted: false,
      pageHidden: document.visibilityState !== 'visible', audible: true };
    const plan = sfxPlanner.admit(event, policy);
    if (plan.status === 'candidate') modules.audio.play(plan,
      { context: audioContext, master: audioMaster, muted: false, volume: 1 });
  }

  function draw(now) {
    const elapsedMs = Math.max(0, now - startTime);
    const loopIndex = Math.floor(elapsedMs / LOOP_MS);
    const withinLoop = elapsedMs % LOOP_MS;
    const dpr = targetHandle.width / WIDTH;
    const viewport = { kind: 'main', width: WIDTH, height: HEIGHT,
      pixelWidth: targetHandle.width, pixelHeight: targetHandle.height };
    const camera = ROOM_ORIGIN;
    const events = [];
    const fixtureIndex = Math.floor(withinLoop / SLOT_MS);
    if (fixtureIndex >= 0 && fixtureIndex < fixtures.length) {
      const event = fixtureEvent(fixtureIndex, elapsedMs, loopIndex);
      events.push(event);
      processSound(event);
    }
    if (withinLoop >= AMBIENT_AT_MS && withinLoop < AMBIENT_AT_MS + modules.effect.AMBIENT.durationMs) {
      const event = ambientEvent(elapsedMs, loopIndex);
      events.push(event);
      processSound(event, true);
    }
    const planned = modules.effect.planAll({ map, events, now: elapsedMs, phase: 'playing',
      roomVisible: true, camera, zoom: 1, viewport });
    const frame = renderer.beginFrame(`Cafeteria preview ${++frameId}`);
    try {
      frame.clear('cafeteria-preview', [0.11, 0.14, 0.12, 1]);
      if (roomTexture) frame.sprite('cafeteria-preview', { x: 0, y: 0, w: WIDTH, h: HEIGHT,
        texture: roomTexture, tint: [1, 1, 1, 1], order: 0 });
      for (const effect of planned) effectPass.record({ frame, target: 'cafeteria-preview', viewport, planned: effect });
      frame.submit();
      window.__cafeteriaPreviewSnapshot = Object.freeze({ ready: true, frameId, loopIndex,
        elapsedMs, dpr, sourceLoaded: Boolean(roomTexture), source: roomTexture ? SOURCE_PATH : null,
      sourceWidth: roomTexture ? WIDTH : 0, sourceHeight: roomTexture ? HEIGHT : 0,
        effects: Object.freeze(planned.map(item => Object.freeze({ type: item.type,
          eventId: item.eventId, design: item.design, phase: item.phase, progress: item.progress }))),
        audioEnabled, verify });
      if (roomTexture && !audioEnabled) status.textContent = '原画 930×860 · 3設備E＋環境E 自動ループ · 画面をタップすると効果音が有効になります';
      else if (!roomTexture && !audioEnabled) status.textContent = `原画待ち: ${SOURCE_PATH} · E単体プレビュー・未完成 · 画面をタップすると効果音が有効になります`;
      rafId = requestAnimationFrame(draw);
    } catch (error) {
      try { frame.discard(); } catch (_) {}
      throw error;
    }
  }

  let startTime = 0;
  async function start() {
    const missing = dependencies();
    if (missing) { status.textContent = missing; window.__cafeteriaPreviewReady = false; return; }
    renderer = await modules.renderer.create({ gpu: navigator.gpu });
    targetHandle = renderer.registerTarget('cafeteria-preview', canvas,
      { width: Math.round(WIDTH * pixelRatio), height: Math.round(HEIGHT * pixelRatio),
        logicalWidth: WIDTH, logicalHeight: HEIGHT });
    effectPass = modules.effect.create({ renderer, frameOwner: renderer });
    if (typeof effectPass.ready === 'function') await effectPass.ready();
    roomTexture = await loadRoomTexture();
    if (!roomTexture) status.textContent = `原画待ち: ${SOURCE_PATH} · E単体プレビュー・未完成`;
    startTime = performance.now();
    window.__cafeteriaPreviewReady = true;
    draw(startTime);
  }

  canvas.addEventListener('pointerdown', () => { void enableAudio(); }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && audioEnabled && audioContext?.state === 'suspended') void audioContext.resume();
  });
  window.addEventListener('beforeunload', () => {
    if (rafId) cancelAnimationFrame(rafId);
    try { effectPass?.destroy(); } catch (_) {}
    try { targetHandle?.unregister(); } catch (_) {}
    try { renderer?.destroy(); } catch (_) {}
    if (audioContext && audioContext.state !== 'closed') void audioContext.close();
  }, { once: true });

  try { await start(); }
  catch (error) {
    try { effectPass?.destroy(); } catch (_) {}
    try { targetHandle?.unregister(); } catch (_) {}
    try { renderer?.destroy(); } catch (_) {}
    window.__cafeteriaPreviewReady = false;
    window.__cafeteriaPreviewError = String(error?.stack || error);
    status.textContent = `プレビュー初期化失敗: ${String(error?.message || error)}`;
  }
})();
