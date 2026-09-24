(function (root) {
  'use strict';

  const finite = Number.isFinite;
  const PROFILES = Object.freeze({
    marker: Object.freeze([
      Object.freeze({ shape: 'sine', frequencyHz: 220, endFrequencyHz: 330,
        amplitude: 0.12, offsetMs: 0, durationMs: 150, layer: 'low' }),
      Object.freeze({ shape: 'triangle', frequencyHz: 740, endFrequencyHz: 1110,
        amplitude: 0.055, offsetMs: 24, durationMs: 105, layer: 'upper' }),
      Object.freeze({ shape: 'noise', frequencyHz: 2600, endFrequencyHz: 1300,
        amplitude: 0.018, offsetMs: 8, durationMs: 48, layer: 'short-noise' })
    ]),
    summon: Object.freeze([
      Object.freeze({ shape: 'sine', frequencyHz: 196, endFrequencyHz: 392,
        amplitude: 0.10, offsetMs: 0, durationMs: 260, layer: 'low' }),
      Object.freeze({ shape: 'sine', frequencyHz: 523, endFrequencyHz: 784,
        amplitude: 0.052, offsetMs: 58, durationMs: 205, layer: 'upper' }),
      Object.freeze({ shape: 'noise', frequencyHz: 1800, endFrequencyHz: 900,
        amplitude: 0.014, offsetMs: 18, durationMs: 70, layer: 'short-noise' })
    ]),
    acquisition: Object.freeze([
      Object.freeze({ shape: 'sine', frequencyHz: 262, endFrequencyHz: 392,
        amplitude: 0.10, offsetMs: 0, durationMs: 170, layer: 'low' }),
      Object.freeze({ shape: 'triangle', frequencyHz: 659, endFrequencyHz: 988,
        amplitude: 0.06, offsetMs: 28, durationMs: 145, layer: 'upper' }),
      Object.freeze({ shape: 'noise', frequencyHz: 3200, endFrequencyHz: 1700,
        amplitude: 0.016, offsetMs: 0, durationMs: 42, layer: 'short-noise' })
    ])
  });

  function validCommon(event) {
    return event && typeof event.roomId === 'string' && event.roomId.length > 0 &&
      Number.isInteger(event.roomGeneration) && event.roomGeneration >= 0 &&
      typeof event.eventId === 'string' && event.eventId.length > 0 &&
      finite(event.eventAtMs) && event.eventAtMs >= 0;
  }

  function freezeCue(kind, event, identity, startAtMs) {
    const layers = PROFILES[kind].map(layer => Object.freeze({
      ...layer,
      startAtMs: startAtMs + layer.offsetMs,
      endAtMs: startAtMs + layer.offsetMs + layer.durationMs
    }));
    const endsAtMs = Math.max(...layers.map(layer => layer.endAtMs));
    return Object.freeze({
      kind,
      eventId: identity,
      sourceEventId: event.eventId,
      roomId: event.roomId,
      roomGeneration: event.roomGeneration,
      sourceId: event.sourceId || '',
      startsAtMs: startAtMs,
      endsAtMs,
      layers: Object.freeze(layers),
      completionReceipt: Object.freeze({
        eventId: identity, roomId: event.roomId,
        roomGeneration: event.roomGeneration, endsAtMs
      })
    });
  }

  function createLedger({ maxEntries = 2048, retentionMs = 30000 } = {}) {
    if (!Number.isInteger(maxEntries) || maxEntries < 16 || !finite(retentionMs) || retentionMs < 1)
      throw new TypeError('Invalid E event SFX ledger limits');
    let roomKey = '';
    const consumed = new Map();
    let watermark = 0;

    function prune(nowMs) {
      watermark = Math.max(watermark, nowMs);
      for (const [id, expiresAt] of consumed) if (expiresAt <= nowMs) consumed.delete(id);
    }
    function consume(id, nowMs, eventAtMs) {
      if (consumed.has(id)) return false;
      // Reject at capacity instead of evicting still-live IDs; this preserves
      // exact-once receipt semantics during a pathological burst.
      if (consumed.size >= maxEntries) return false;
      consumed.set(id, Math.max(nowMs, eventAtMs) + retentionMs);
      return true;
    }

    function enterRoom(roomId, roomGeneration) {
      if (typeof roomId !== 'string' || !roomId ||
          !Number.isInteger(roomGeneration) || roomGeneration < 0)
        throw new TypeError('E event SFX ledger needs a room ID and generation');
      const next = `${roomId}:${roomGeneration}`;
      if (next !== roomKey) {
        roomKey = next;
        consumed.clear();
        watermark = 0;
      }
    }

    function admit(event, { audible = true } = {}) {
      if (!validCommon(event)) throw new TypeError('E event SFX needs an explicit event identity and event time');
      const kind = event.kind;
      if (!Object.hasOwn(PROFILES, kind)) throw new TypeError(`Unsupported E event SFX kind: ${String(kind)}`);
      if (kind === 'summon' && (event.isBot || typeof event.playerId !== 'string' || !event.playerId))
        return null;
      if (kind === 'acquisition' &&
          (!['mystery-box', 'transfer-in'].includes(event.effectType) ||
           typeof event.acquisitionKind !== 'string' || !event.acquisitionKind))
        throw new TypeError('Acquisition E SFX needs a supported effect type and explicit acquisition kind');
      if (kind === 'acquisition' &&
          (!finite(event.nowMs) || event.nowMs < 0 ||
           !finite(event.startedAtMs) || event.startedAtMs < 0))
        throw new TypeError('Acquisition E SFX needs its effect start and current time');
      if (kind === 'marker' &&
          !['persistent-status', 'enhance-activation', 'fighter-energy-charge'].includes(event.markerType))
        throw new TypeError('Marker E SFX needs a current supported marker family');

      enterRoom(event.roomId, event.roomGeneration);
      const identity = `${kind}:${event.eventId}`;
      const observedNow = finite(event.nowMs) ? event.nowMs : event.eventAtMs;
      prune(observedNow);
      if (watermark - event.eventAtMs > retentionMs || consumed.has(identity)) return null;
      // Admission is consumed before mute/verification gates. Returning later
      // with audio enabled can never replay this event.
      if (!consume(identity, observedNow, event.eventAtMs)) return null;
      if (!audible) return null;

      let startAtMs = event.eventAtMs;
      if (kind === 'acquisition') {
        const nowMs = event.nowMs;
        const arrivalOffset = event.effectType === 'mystery-box'
          ? 980 + (event.reducedMotion ? 680 : 900)
          : (event.reducedMotion ? 680 : 900);
        startAtMs = event.startedAtMs + arrivalOffset;
        const durationMs = finite(event.durationMs) && event.durationMs > 0
          ? event.durationMs : event.effectType === 'mystery-box' ? 2600 : 1800;
        if (startAtMs >= event.startedAtMs + durationMs || nowMs > startAtMs + 80)
          return null;
      }
      return freezeCue(kind, event, identity, startAtMs);
    }

    return Object.freeze({ admit, enterRoom,
      has(eventId, kind) { return consumed.has(`${kind}:${eventId}`); },
      size() { return consumed.size; }
    });
  }

  const api = Object.freeze({ PROFILES, createLedger });
  root.DvaWebGPEEventSfx = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
