(function (root) {
  'use strict';

  const PROFILES = Object.freeze({
    'gravity-storm:debris-dent': Object.freeze({ cue: 'gravity-field-onset', layers: [
      ['sine', 62, 46, .064, 0, 225, 'gravity-low-field-form'],
      ['triangle', 186, 124, .031, 28, 174, 'gravity-mid-fold'],
      ['noise', 310, 185, .011, 8, 48, 'brief-field-air']
    ] }),
    'gravity-time-keeper:total-stop': Object.freeze({ cue: 'gravity-time-lock', layers: [
      ['sine', 98, 73, .054, 0, 205, 'time-lock-low'],
      ['triangle', 294, 196, .028, 36, 148, 'time-lock-mid'],
      ['sine', 392, 294, .012, 68, 92, 'brief-time-seal']
    ] }),
    'idea-truth:': Object.freeze({ cue: 'idea-truth-onset', layers: [
      ['sine', 147, 220, .046, 0, 155, 'truth-low-rise'],
      ['triangle', 294, 440, .026, 28, 125, 'truth-mid-rise']
    ] }),
    'idea-beauty:': Object.freeze({ cue: 'idea-beauty-onset', layers: [
      ['sine', 196, 147, .046, 0, 160, 'beauty-low-settle'],
      ['triangle', 392, 294, .027, 25, 126, 'beauty-mid-settle']
    ] }),
    'idea-ascension:': Object.freeze({ cue: 'idea-ascension-onset', layers: [
      ['sine', 110, 165, .056, 0, 230, 'ascension-low-rise'],
      ['triangle', 330, 495, .032, 36, 183, 'ascension-mid-rise'],
      ['sine', 495, 620, .014, 78, 112, 'short-ascension-glint']
    ] }),
    'fighter-energy-release:throw': Object.freeze({ cue: 'fighter-energy-release', layers: [
      ['sine', 82, 123, .052, 0, 178, 'energy-release-low'],
      ['triangle', 246, 369, .028, 20, 140, 'energy-release-mid'],
      ['noise', 430, 280, .009, 0, 40, 'brief-release-air']
    ] }),
    'fighter-energy-impact:one-body-damage': Object.freeze({ cue: 'fighter-energy-impact', layers: [
      ['sine', 110, 58, .062, 0, 198, 'energy-impact-low'],
      ['triangle', 330, 165, .032, 8, 152, 'energy-impact-mid'],
      ['noise', 520, 290, .01, 0, 44, 'brief-impact-air']
    ] })
  });
  const SHARED_TYPES = Object.freeze({
    'gravity-levitation-onset': 'gravity-levitation-onset-world-sfx',
    'gravity-levitation-end': 'gravity-levitation-end-world-sfx',
    'fighter-energy-charge': 'invention-world-sfx',
    'fighter-energy-destruction-milestone': 'invention-world-sfx',
    'fighter-energy-destruction-slash': 'fighter-slash-and-kill-sfx',
    'idea-good': 'stamina-gain-sfx'
  });
  const REJECTED = Object.freeze({
    'gravity-storm-child': 'persistent-gravity-field-child-not-an-onset'
  });

  function profileFor(event) {
    const key = `${event.type}:${event.variant}`;
    if (Object.hasOwn(PROFILES, key)) return PROFILES[key];
    if (event.type === 'fighter-energy-release' && /^throw:remaining-ec-\d+$/.test(event.variant))
      return PROFILES['fighter-energy-release:throw'];
    if (event.type.startsWith('gravity-storm-')) return REJECTED['gravity-storm-child'];
    return null;
  }

  function createLedger({ maxEntries = 2048, retentionMs = 30000, maxLateMs = 180,
    maxCuesPerSecond = 8 } = {}) {
    if (!Number.isInteger(maxEntries) || maxEntries < 16 || !Number.isFinite(retentionMs) ||
        !Number.isFinite(maxLateMs) || maxLateMs < 0 || retentionMs < maxLateMs ||
        !Number.isInteger(maxCuesPerSecond) || maxCuesPerSecond < 1 || maxCuesPerSecond > 16)
      throw new TypeError('Invalid gravity/idea/fighter E SFX ledger limits');
    let roomKey = '';
    let watermark = 0;
    const consumed = new Map();
    const recentCues = [];
    function enterRoom(roomId, roomGeneration) {
      if (typeof roomId !== 'string' || !roomId || !Number.isInteger(roomGeneration) || roomGeneration < 0)
        throw new TypeError('Gravity/idea/fighter E SFX needs room ID and generation');
      const key = `${roomId}:${roomGeneration}`;
      if (roomKey !== key) { roomKey = key; watermark = 0; consumed.clear(); recentCues.length = 0; }
    }
    function prune(nowMs) {
      watermark = Math.max(watermark, nowMs);
      for (const [id, expiry] of consumed) if (expiry <= nowMs) consumed.delete(id);
      while (recentCues.length && recentCues[0] <= nowMs - 1000) recentCues.shift();
    }
    function admit(event, { audible = true, verify = false, reducedMotion = false,
      alreadyHeardImpact = false } = {}) {
      if (!event || typeof event.eventId !== 'string' || !event.eventId || typeof event.type !== 'string' ||
          typeof event.variant !== 'string' || typeof event.roomId !== 'string' || !event.roomId ||
          !Number.isInteger(event.roomGeneration) || event.roomGeneration < 0 ||
          !Number.isFinite(event.eventAtMs) || event.eventAtMs < 0 ||
          !Number.isFinite(event.nowMs) || event.nowMs < 0)
        throw new TypeError('Gravity/idea/fighter E SFX requires event identity, variant, room and time');
      enterRoom(event.roomId, event.roomGeneration);
      prune(event.nowMs);
      const id = `gravity-idea-fighter:${event.eventId}`;
      if (watermark - event.eventAtMs > retentionMs || consumed.has(id) || consumed.size >= maxEntries) return null;
      // Server submission receipt is consumed before visibility/audio policy:
      // re-poll, late delivery, mute and verify cannot cause delayed playback.
      consumed.set(id, Math.max(event.nowMs, event.eventAtMs + maxLateMs) + retentionMs);
      const meta = { eventId: event.eventId, type: event.type, variant: event.variant,
        roomId: event.roomId, roomGeneration: event.roomGeneration };
      if (event.submittedReceipt !== true)
        return Object.freeze({ ...meta, suppressed: true, reason: 'missing-server-submission-receipt' });
      if (SHARED_TYPES[event.type]) return Object.freeze({ ...meta, suppressed: true,
        reason: 'shared-existing-sfx-owner', sharedSfxKind: SHARED_TYPES[event.type] });
      const selected = profileFor(event);
      if (typeof selected === 'string') return Object.freeze({ ...meta, suppressed: true, reason: selected });
      if (!selected) throw new TypeError(`Unsupported gravity/idea/fighter E SFX event: ${event.type}:${event.variant}`);
      if (event.visibleToListener !== true)
        return Object.freeze({ ...meta, suppressed: true, reason: 'outside-onset-observation-scope' });
      if (event.type === 'fighter-energy-impact' && alreadyHeardImpact)
        return Object.freeze({ ...meta, suppressed: true, reason: 'shared-local-hit-impact', sharedSfxKind: 'impact-wav' });
      if (!audible || verify || event.nowMs > event.eventAtMs + maxLateMs) return null;
      if (recentCues.length >= maxCuesPerSecond) return null;
      const scale = reducedMotion ? .72 : 1;
      const layers = selected.layers.map(([shape, frequencyHz, endFrequencyHz, amplitude, offsetMs, durationMs, layer]) => {
        const offset = Math.round(offsetMs * scale), duration = Math.max(28, Math.round(durationMs * scale));
        return Object.freeze({ shape, frequencyHz, endFrequencyHz, amplitude, layer,
          offsetMs: offset, durationMs: duration, startAtMs: event.eventAtMs + offset,
          endAtMs: event.eventAtMs + offset + duration });
      });
      if (layers.length > 3 || layers.some(layer => layer.durationMs > 240) ||
          layers.reduce((sum, layer) => sum + layer.amplitude, 0) > .11)
        throw new RangeError('Gravity/idea/fighter cue exceeds finite audio limits');
      recentCues.push(event.nowMs);
      const endsAtMs = Math.max(...layers.map(layer => layer.endAtMs));
      return Object.freeze({ family: 'gravity-idea-fighter-e', cue: selected.cue, ...meta,
        startsAtMs: event.eventAtMs, endsAtMs, layers: Object.freeze(layers),
        completionReceipt: Object.freeze({ eventId: event.eventId, roomId: event.roomId,
          roomGeneration: event.roomGeneration, endsAtMs }) });
    }
    return Object.freeze({ admit, enterRoom, has: id => consumed.has(`gravity-idea-fighter:${id}`),
      size: () => consumed.size, activeCuesInWindow: () => recentCues.length });
  }
  const api = Object.freeze({ PROFILES, SHARED_TYPES, REJECTED, createLedger });
  root.DvaWebGPUGravityIdeaFighterESfx = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
