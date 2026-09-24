/* Cafeteria room E one-shot sound prototypes.
 * Synthesized locally with Web Audio; no audio/image assets. This module does
 * not loop and does not replace a generic object sound without causal proof. */
(function (root) {
  'use strict';
  const MAX_GAIN = 0.075;
  const MAX_CUE_MS = 1500;
  const RETENTION_MS = 30000;
  const MAX_EVENTS_PER_SECOND = 6;
  const FIXTURES = Object.freeze({
    'v302-cafeteria-nutritionStation-1': Object.freeze({
      type: 'healthyMealTable', effectKind: 'healthyMeal', cue: 'four-bay-service-sequence', durationMs: 1320,
      design: 'Four separated, smooth carrier sweeps across the service rail, followed by a broad inharmonic tray seat; no pitched chime sequence.',
      layers: Object.freeze([
        Object.freeze({ shape: 'bandNoise', startHz: 430, endHz: 570, gain: .024, delayMs: 0, durationMs: 152, role: 'bay-one carrier movement' }),
        Object.freeze({ shape: 'bandNoise', startHz: 540, endHz: 690, gain: .022, delayMs: 248, durationMs: 158, role: 'bay-two carrier movement' }),
        Object.freeze({ shape: 'bandNoise', startHz: 665, endHz: 835, gain: .021, delayMs: 526, durationMs: 164, role: 'bay-three carrier movement' }),
        Object.freeze({ shape: 'bandNoise', startHz: 790, endHz: 1010, gain: .020, delayMs: 810, durationMs: 172, role: 'bay-four carrier movement' }),
        Object.freeze({ shape: 'inharmonic', startHz: 278, endHz: 205, gain: .031, delayMs: 1015, durationMs: 265,
          partials: Object.freeze([[1, 1], [2.31, .38], [3.82, .17]]), role: 'wide tray seats after portions arrive' })
      ])
    }),
    'v302-cafeteria-hydration-2': Object.freeze({
      type: 'mineralWaterBar', effectKind: 'stamina', cue: 'culture-dose-calibration', durationMs: 820,
      design: 'One descending, nonharmonic sensor scan resolves at a single measured-level detent; no liquid stream or glass note.',
      layers: Object.freeze([
        Object.freeze({ shape: 'inharmonic', startHz: 1260, endHz: 730, gain: .020, delayMs: 28, durationMs: 455,
          partials: Object.freeze([[1, 1], [1.414, .24], [2.37, .09]]), role: 'one descending level-calibration sweep' }),
        Object.freeze({ shape: 'bandNoise', startHz: 1630, endHz: 1080, gain: .013, delayMs: 75, durationMs: 280, role: 'narrow sensor scan texture, no liquid flow' }),
        Object.freeze({ shape: 'inharmonic', startHz: 570, endHz: 440, gain: .018, delayMs: 552, durationMs: 226,
          partials: Object.freeze([[1, 1], [1.77, .20]]), role: 'single measured-level stop' })
      ])
    }),
    'v302-cafeteria-sofa-3': Object.freeze({
      type: 'relaxationSalon', effectKind: 'acceleration', cue: 'communal-platter-settle', durationMs: 1060,
      design: 'A single cushioned center contact unfolds into a broad low inharmonic tabletop response; no edge scrape or repeated impact.',
      layers: Object.freeze([
        Object.freeze({ shape: 'bandNoise', startHz: 960, endHz: 370, gain: .018, delayMs: 0, durationMs: 126, role: 'muted centered platter contact' }),
        Object.freeze({ shape: 'inharmonic', startHz: 236, endHz: 146, gain: .031, delayMs: 18, durationMs: 325,
          partials: Object.freeze([[1, 1], [1.63, .25], [2.41, .12]]), role: 'round tabletop body response' }),
        Object.freeze({ shape: 'inharmonic', startHz: 347, endHz: 268, gain: .016, delayMs: 238, durationMs: 752,
          partials: Object.freeze([[1, 1], [2.08, .16]]), role: 'broad centered radial settle, no perimeter scrape' })
      ])
    })
  });
  const AMBIENT = Object.freeze({
    type: 'cafeteria-service-transition', cue: 'upper-louver-servos', durationMs: 1460,
    design: 'Three low servo travels move the upper louvers in order, then stop into a dry inharmonic hold; silent at steady state.',
    layers: Object.freeze([
      Object.freeze({ shape: 'bandNoise', startHz: 365, endHz: 270, gain: .012, delayMs: 0, durationMs: 328, role: 'first upper-louver servo travel' }),
      Object.freeze({ shape: 'bandNoise', startHz: 420, endHz: 312, gain: .011, delayMs: 365, durationMs: 346, role: 'second upper-louver servo travel' }),
      Object.freeze({ shape: 'bandNoise', startHz: 492, endHz: 354, gain: .010, delayMs: 755, durationMs: 365, role: 'third upper-louver servo travel' }),
      Object.freeze({ shape: 'inharmonic', startHz: 320, endHz: 244, gain: .014, delayMs: 1124, durationMs: 292,
        partials: Object.freeze([[1, 1], [2.28, .22]]), role: 'upper aperture holds at new state' })
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
        maxGain: MAX_GAIN, reducedMotion: reduced, design: spec.design, layers: Object.freeze(layers),
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
    const cue = typeof planOrCue === 'string' ? planOrCue : planOrCue.cue;
    const states = layers.map((layer, index) => ({
      seed: hash(`${cue}:${layer.role}:${index}`) || 1,
      lower: 0,
      upper: 0,
      phases: layer.partials?.map(() => 0) || [0]
    }));
    for (let i = 0; i < pcm.length; i++) {
      const tMs = i * 1000 / sampleRate;
      let value = 0;
      for (let j = 0; j < layers.length; j++) {
        const layer = layers[j], state = states[j];
        const localMs = tMs - layer.delayMs;
        if (localMs < 0 || localMs >= layer.durationMs) continue;
        const p = localMs / layer.durationMs;
        const env = smooth(localMs / Math.min(14, layer.durationMs * .25)) * smooth((1 - p) / .22);
        const hz = layer.startHz + (layer.endHz - layer.startHz) * smooth(p);
        let sample;
        if (layer.shape === 'bandNoise' || layer.shape === 'noise') {
          state.seed = (Math.imul(state.seed, 1664525) + 1013904223) >>> 0;
          const white = state.seed / 2147483648 - 1;
          const lowerHz = Math.max(45, hz * .68), upperHz = Math.min(sampleRate * .44, hz * 1.48);
          const lowerA = 1 - Math.exp(-2 * Math.PI * lowerHz / sampleRate);
          const upperA = 1 - Math.exp(-2 * Math.PI * upperHz / sampleRate);
          state.lower += lowerA * (white - state.lower);
          state.upper += upperA * (white - state.upper);
          sample = (state.upper - state.lower) * 2.1;
        } else if (layer.shape === 'inharmonic') {
          const partials = layer.partials || [[1, 1], [1.73, .24], [2.67, .08]];
          let totalWeight = 0;
          sample = 0;
          for (let k = 0; k < partials.length; k++) {
            const [ratio, weight] = partials[k];
            state.phases[k] += 2 * Math.PI * Math.min(sampleRate * .42, hz * ratio) / sampleRate;
            sample += Math.sin(state.phases[k]) * weight;
            totalWeight += Math.abs(weight);
          }
          sample /= Math.max(.001, totalWeight);
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
