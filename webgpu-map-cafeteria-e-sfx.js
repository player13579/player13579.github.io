/* Cafeteria room E one-shot sound prototypes.
 * Synthesized locally with Web Audio; no audio/image assets. This module does
 * not loop and does not replace a generic object sound without causal proof. */
(function (root) {
  'use strict';
  const MAX_GAIN = 0.075;
  const MAX_CUE_MS = 1200;
  const RETENTION_MS = 30000;
  const MAX_EVENTS_PER_SECOND = 6;
  const FIXTURES = Object.freeze({
    'v302-cafeteria-nutritionStation-1': Object.freeze({
      type: 'healthyMealTable', effectKind: 'healthyMeal', cue: 'ceramic-slide-contact', durationMs: 900,
      layers: Object.freeze([
        Object.freeze({ shape: 'noise', startHz: 1650, endHz: 620, gain: .012, delayMs: 0, durationMs: 190, role: 'soft ceramic tray contact' }),
        Object.freeze({ shape: 'sine', startHz: 392, endHz: 349, gain: .034, delayMs: 35, durationMs: 260, role: 'warm table resonance' }),
        Object.freeze({ shape: 'triangle', startHz: 784, endHz: 587, gain: .019, delayMs: 70, durationMs: 185, role: 'thin glazed rim response' }),
        Object.freeze({ shape: 'sine', startHz: 523, endHz: 440, gain: .015, delayMs: 420, durationMs: 430, role: 'settled nourishment tone' })
      ])
    }),
    'v302-cafeteria-hydration-2': Object.freeze({
      type: 'mineralWaterBar', effectKind: 'stamina', cue: 'measured-pour-glass-contact', durationMs: 1150,
      layers: Object.freeze([
        Object.freeze({ shape: 'noise', startHz: 1180, endHz: 410, gain: .018, delayMs: 0, durationMs: 310, role: 'narrow water pour' }),
        Object.freeze({ shape: 'sine', startHz: 494, endHz: 659, gain: .026, delayMs: 35, durationMs: 410, role: 'clear glass fill resonance' }),
        Object.freeze({ shape: 'triangle', startHz: 988, endHz: 784, gain: .016, delayMs: 330, durationMs: 150, role: 'single glass lip touch' }),
        Object.freeze({ shape: 'sine', startHz: 659, endHz: 523, gain: .014, delayMs: 600, durationMs: 500, role: 'short liquid settle' })
      ])
    }),
    'v302-cafeteria-sofa-3': Object.freeze({
      type: 'relaxationSalon', effectKind: 'acceleration', cue: 'quiet-cutlery-settle', durationMs: 950,
      layers: Object.freeze([
        Object.freeze({ shape: 'triangle', startHz: 246, endHz: 220, gain: .028, delayMs: 0, durationMs: 105, role: 'muted seat cushion contact' }),
        Object.freeze({ shape: 'sine', startHz: 330, endHz: 392, gain: .020, delayMs: 55, durationMs: 310, role: 'soft lounge resonance' }),
        Object.freeze({ shape: 'triangle', startHz: 1174, endHz: 880, gain: .010, delayMs: 135, durationMs: 54, role: 'distant cutlery settle' }),
        Object.freeze({ shape: 'sine', startHz: 392, endHz: 330, gain: .012, delayMs: 390, durationMs: 520, role: 'calm rest tone' })
      ])
    })
  });
  const AMBIENT = Object.freeze({
    type: 'cafeteria-service-transition', cue: 'ceiling-baffle-shift', durationMs: 750,
    layers: Object.freeze([
      Object.freeze({ shape: 'noise', startHz: 760, endHz: 290, gain: .008, delayMs: 0, durationMs: 230, role: 'brief diffused air movement' }),
      Object.freeze({ shape: 'sine', startHz: 294, endHz: 330, gain: .011, delayMs: 300, durationMs: 400, role: 'quiet room resonance change' })
    ])
  });
  const finite = Number.isFinite;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const smooth = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };

  function createPlanner({ retentionMs = RETENTION_MS, maxEventsPerSecond = MAX_EVENTS_PER_SECOND } = {}) {
    if (!finite(retentionMs) || retentionMs < MAX_CUE_MS || retentionMs > RETENTION_MS ||
        !Number.isInteger(maxEventsPerSecond) || maxEventsPerSecond < 1 || maxEventsPerSecond > MAX_EVENTS_PER_SECOND)
      throw new TypeError('Invalid cafeteria E SFX limits');
    let roomKey = '';
    const consumed = new Map();
    const admitted = [];
    function enterRoom(roomId, generation = 0) {
      if (typeof roomId !== 'string' || !roomId || !Number.isInteger(generation) || generation < 0)
        throw new TypeError('Cafeteria E SFX needs a room identity and generation');
      const key = `${roomId}:${generation}`;
      if (roomKey !== key) { roomKey = key; consumed.clear(); admitted.length = 0; }
    }
    function admit(event, policy = {}) {
      const roomId = policy.roomId ?? 'station';
      const roomGeneration = policy.roomGeneration ?? 0;
      const nowMs = policy.nowMs ?? event?.startedAt;
      const volume = policy.volume ?? 1;
      if (!event || typeof event.id !== 'string' || !event.id || typeof roomId !== 'string' || !roomId ||
          !Number.isInteger(roomGeneration) || roomGeneration < 0 ||
          !finite(event.startedAt) || event.startedAt < 0 || !finite(event.duration) || event.duration <= 0 ||
          !finite(nowMs) || nowMs < 0 || !finite(volume) || volume < 0 || volume > 1)
        throw new TypeError('Cafeteria E SFX event needs identity and duration; policy supplies room, clock and mix');
      enterRoom(roomId, roomGeneration);
      for (const [key, expiry] of consumed) if (expiry <= nowMs) consumed.delete(key);
      while (admitted.length && admitted[0] <= nowMs - 1000) admitted.shift();

      const isAmbient = event.type === AMBIENT.type;
      const fixture = FIXTURES[event.objectId];
      const spec = isAmbient ? AMBIENT : fixture;
      const identity = isAmbient ? `ambient:${event.revision}` : `fixture:${event.id}`;
      if (!spec || event.accepted !== true || !identity || identity.endsWith('undefined') ||
          (isAmbient && (typeof event.revision !== 'string' || !event.revision)) ||
          (!isAmbient && (event.type !== 'cafeteria-object-e' ||
            (event.objectType !== undefined && event.objectType !== fixture.type) ||
            (event.effectKind !== undefined && event.effectKind !== fixture.effectKind))) ||
          event.duration !== spec.durationMs)
        return Object.freeze({ status: 'suppressed', id: event.id, reason: 'event-scope-or-duration-mismatch' });
      if (consumed.has(identity)) return Object.freeze({ status: 'suppressed', id: event.id, reason: 'duplicate-event' });
      // Consume a valid event before mute/visibility/rate policy so replaying a
      // snapshot cannot unexpectedly speak later when the policy changes.
      consumed.set(identity, nowMs + retentionMs);
      if (policy.pageHidden === true || policy.muted === true || policy.sensoryBlocked === true ||
          policy.audible === false || volume <= 0)
        return Object.freeze({ status: 'suppressed', id: event.id, reason: 'audio-policy-or-silence' });
      if (nowMs < event.startedAt || nowMs - event.startedAt > Math.min(180, spec.durationMs))
        return Object.freeze({ status: 'suppressed', id: event.id, reason: 'late-event' });
      if (admitted.length >= maxEventsPerSecond)
        return Object.freeze({ status: 'suppressed', id: event.id, reason: 'rate-limit' });
      admitted.push(nowMs);
      const reduced = policy.reducedMotion === true;
      const layers = spec.layers.map(layer => Object.freeze({ ...layer,
        gain: Math.min(MAX_GAIN, layer.gain * volume * (reduced ? .82 : 1)),
        delayMs: reduced ? Math.round(layer.delayMs * .8) : layer.delayMs,
        durationMs: reduced ? Math.max(24, Math.round(layer.durationMs * .85)) : layer.durationMs
      }));
      return Object.freeze({ status: 'candidate', id: event.id, revision: isAmbient ? event.revision : null,
        roomId, roomGeneration, objectId: isAmbient ? null : event.objectId,
        cue: spec.cue, loop: false, startsAtMs: event.startedAt, durationMs: spec.durationMs,
        maxGain: MAX_GAIN, reducedMotion: reduced, layers: Object.freeze(layers),
        replaceGenericSound: false });
    }
    return Object.freeze({ admit, enterRoom, has: (id, ambient = false) => consumed.has(`${ambient ? 'ambient' : 'fixture'}:${id}`),
      size: () => consumed.size, rateSize: () => admitted.length });
  }

  function renderPcm(planOrCue, sampleRate = 48000) {
    const durationMs = typeof planOrCue === 'string' ? profileByCue(planOrCue).durationMs : planOrCue?.durationMs;
    const layers = typeof planOrCue === 'string' ? profileByCue(planOrCue).layers : planOrCue?.layers;
    if (!finite(sampleRate) || sampleRate < 22050 || sampleRate > 96000) throw new RangeError('Sample rate must be 22050–96000 Hz');
    if (!finite(durationMs) || durationMs <= 0 || durationMs > MAX_CUE_MS || !Array.isArray(layers)) throw new TypeError('Unknown cafeteria sound profile');
    const pcm = new Float32Array(Math.ceil(sampleRate * durationMs / 1000));
    let seed = hash(typeof planOrCue === 'string' ? planOrCue : planOrCue.cue) || 1;
    let low = 0;
    for (let i = 0; i < pcm.length; i++) {
      const tMs = i * 1000 / sampleRate;
      let value = 0;
      for (const layer of layers) {
        const localMs = tMs - layer.delayMs;
        if (localMs < 0 || localMs >= layer.durationMs) continue;
        const p = localMs / layer.durationMs;
        const env = smooth(localMs / Math.min(14, layer.durationMs * .25)) * smooth((1 - p) / .22);
        const hz = layer.startHz + (layer.endHz - layer.startHz) * smooth(p);
        let sample;
        if (layer.shape === 'noise') {
          seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
          const white = seed / 2147483648 - 1;
          low += .13 * (white - low);
          sample = low * .72 + (white - low) * .28;
        } else {
          sample = Math.sin(2 * Math.PI * hz * localMs / 1000);
          if (layer.shape === 'triangle') sample = (2 / Math.PI) * Math.asin(sample);
        }
        value += sample * env * layer.gain;
      }
      pcm[i] = clamp(value, -.22, .22);
    }
    if (pcm.length) { pcm[0] = 0; pcm[pcm.length - 1] = 0; }
    return pcm;
  }
  function play(plan, { context, master, muted = false, volume = 1 } = {}) {
    if (plan?.status !== 'candidate' || plan.loop !== false || muted || !context || !master || context.state !== 'running' ||
        typeof context.createBuffer !== 'function' || typeof context.createBufferSource !== 'function' || typeof context.createGain !== 'function') return null;
    const gainValue = finite(volume) ? clamp(volume, 0, 1) : 0;
    if (gainValue <= 0) return null;
    const seen = playedByContext.get(context) || new Set();
    const identity = `${plan.roomId}:${plan.roomGeneration}:${plan.revision ?? plan.id}`;
    if (seen.has(identity)) return null;
    try {
      const pcm = renderPcm(plan, context.sampleRate);
      const buffer = context.createBuffer(1, pcm.length, context.sampleRate);
      buffer.getChannelData(0).set(pcm);
      const now = context.currentTime;
      const cueGain = context.createGain(); cueGain.gain.setValueAtTime(gainValue, now);
      cueGain.connect(master);
      const src = context.createBufferSource(); src.buffer = buffer; src.connect(cueGain); src.start(now);
      seen.add(identity); playedByContext.set(context, seen);
      return Object.freeze({ status: 'started', id: plan.id, revision: plan.revision, cue: plan.cue, startedAt: now, durationMs: plan.durationMs });
    } catch (_) { return null; }
  }
  function profileByCue(cue) {
    for (const profile of Object.values(FIXTURES)) if (profile.cue === cue) return profile;
    if (AMBIENT.cue === cue) return AMBIENT;
    throw new RangeError('Unknown cafeteria E SFX cue');
  }
  function hash(value) { let h = 2166136261; for (let i = 0; i < value.length; i++) h = Math.imul(h ^ value.charCodeAt(i), 16777619); return h >>> 0; }
  const playedByContext = new WeakMap();
  const api = Object.freeze({ MAX_GAIN, MAX_CUE_MS, RETENTION_MS, MAX_EVENTS_PER_SECOND, FIXTURES, AMBIENT,
    createPlanner, renderPcm, play });
  root.DvaWebGPUMapCafeteriaESfx = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
