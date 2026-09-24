(function (root) {
  'use strict';

  // Finite one-shot plans keyed to authoritative alchemy magic-effect IDs.
  // World position, target position, and source IDs are intentionally omitted.
  const PROFILES = Object.freeze({
    'alchemy-human-transmutation:': Object.freeze({ cue: 'human-transmutation', layers: [
      ['sine', 92, 69, .070, 0, 205, 'transmutation-low-bind'],
      ['triangle', 276, 207, .034, 24, 158, 'transmutation-mid-turn'],
      ['noise', 440, 270, .012, 9, 48, 'brief-transmutation-air']
    ] }),
    'alchemy-particle-beam:continuous': Object.freeze({ cue: 'particle-beam-pulse', layers: [
      ['sine', 118, 82, .045, 0, 115, 'beam-pulse-low'],
      ['triangle', 354, 246, .024, 8, 88, 'beam-pulse-mid'],
      ['noise', 520, 310, .009, 0, 34, 'brief-beam-pulse-air']
    ] }),
    'alchemy-particle-beam:gbo-tenfold': Object.freeze({ cue: 'particle-beam-pulse-tenfold', layers: [
      ['sine', 146, 98, .070, 0, 148, 'beam-tenfold-low'],
      ['triangle', 438, 294, .038, 6, 112, 'beam-tenfold-mid'],
      ['noise', 610, 350, .014, 0, 40, 'brief-beam-tenfold-air']
    ] })
  });
  // These three use events submit a server world sound (`invention`). The
  // current app has no `invention` playback mapping; preserve that event as
  // owner rather than layering a second effect-owned sound on top.
  const SHARED = Object.freeze({
    'alchemy-excalibur:gbo-tenfold': 'invention-world-sound',
    'alchemy-excalibur:forward-half-map': 'invention-world-sound',
    'alchemy-railgun:normal': 'invention-world-sound',
    'alchemy-railgun:gbo': 'invention-world-sound',
    'alchemy-particle-cannon:continuous': 'invention-world-sound',
    'alchemy-particle-cannon:gbo-tenfold': 'invention-world-sound'
  });

  function createLedger({ maxEntries = 2048, retentionMs = 30000, maxLateMs = 180 } = {}) {
    if (!Number.isInteger(maxEntries) || maxEntries < 16 || !Number.isFinite(retentionMs) ||
        !Number.isFinite(maxLateMs) || maxLateMs < 0 || retentionMs < maxLateMs)
      throw new TypeError('Invalid alchemy E SFX ledger limits');
    let roomKey = '';
    let watermark = 0;
    const consumed = new Map();
    function enterRoom(roomId, roomGeneration) {
      if (typeof roomId !== 'string' || !roomId || !Number.isInteger(roomGeneration) || roomGeneration < 0)
        throw new TypeError('Alchemy E SFX needs a room ID and generation');
      const key = `${roomId}:${roomGeneration}`;
      if (roomKey !== key) { roomKey = key; watermark = 0; consumed.clear(); }
    }
    function prune(nowMs) {
      watermark = Math.max(watermark, nowMs);
      for (const [id, expiry] of consumed) if (expiry <= nowMs) consumed.delete(id);
    }
    function admit(event, { audible = true, verify = false, reducedMotion = false } = {}) {
      if (!event || typeof event.eventId !== 'string' || !event.eventId || typeof event.type !== 'string' ||
          typeof event.variant !== 'string' || typeof event.roomId !== 'string' ||
          !Number.isInteger(event.roomGeneration) || event.roomGeneration < 0 ||
          !Number.isFinite(event.eventAtMs) || event.eventAtMs < 0 ||
          !Number.isFinite(event.nowMs) || event.nowMs < 0)
        throw new TypeError('Alchemy E SFX requires event identity, variant, room generation and time');
      enterRoom(event.roomId, event.roomGeneration);
      prune(event.nowMs);
      const identity = `alchemy:${event.eventId}`;
      if (watermark - event.eventAtMs > retentionMs || consumed.has(identity) || consumed.size >= maxEntries)
        return null;
      // Consume before listener/mute/verification/late gates; never catch up.
      consumed.set(identity, Math.max(event.nowMs, event.eventAtMs + maxLateMs) + retentionMs);
      const key = `${event.type}:${event.variant}`;
      const meta = { eventId: event.eventId, type: event.type, variant: event.variant,
        roomId: event.roomId, roomGeneration: event.roomGeneration };
      if (SHARED[key]) return Object.freeze({ ...meta, suppressed: true,
        reason: 'shared-existing-world-sound-owner', sharedSfxKind: SHARED[key] });
      const profile = PROFILES[key];
      if (!profile) throw new TypeError(`Unsupported alchemy E SFX event: ${key}`);
      if (event.visibleToListener !== true)
        return Object.freeze({ ...meta, suppressed: true, reason: 'outside-observation-scope' });
      if (!audible || verify || event.nowMs > event.eventAtMs + maxLateMs) return null;
      const scale = reducedMotion ? .72 : 1;
      const layers = profile.layers.map(([shape, frequencyHz, endFrequencyHz, amplitude, offsetMs, durationMs, layer]) => {
        const offset = Math.round(offsetMs * scale), duration = Math.max(28, Math.round(durationMs * scale));
        return Object.freeze({ shape, frequencyHz, endFrequencyHz, amplitude, layer,
          offsetMs: offset, durationMs: duration, startAtMs: event.eventAtMs + offset,
          endAtMs: event.eventAtMs + offset + duration });
      });
      const endsAtMs = Math.max(...layers.map(layer => layer.endAtMs));
      return Object.freeze({ family: 'alchemy-e', cue: profile.cue, ...meta,
        startsAtMs: event.eventAtMs, endsAtMs, layers: Object.freeze(layers),
        completionReceipt: Object.freeze({ eventId: event.eventId, roomId: event.roomId,
          roomGeneration: event.roomGeneration, endsAtMs }) });
    }
    return Object.freeze({ admit, enterRoom, has: id => consumed.has(`alchemy:${id}`), size: () => consumed.size });
  }
  const api = Object.freeze({ PROFILES, SHARED, createLedger });
  root.DvaWebGPUAlchemyESfx = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
