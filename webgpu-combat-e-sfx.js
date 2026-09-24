(function (root) {
  'use strict';

  const finite = Number.isFinite;
  const EMP = Object.freeze({
    emp: Object.freeze({ positive: 'discharge', negative: 'discharge' }),
    'emp-charge': Object.freeze({ positive: 'charge', negative: 'charge' }),
    'emp-resonance': Object.freeze({ positive: 'resonance', negative: 'resonance' }),
    'emp-cancel': Object.freeze({ opposite: 'cancel' }),
    'emp-storage-lock': Object.freeze({ storage: 'storage-lock' })
  });
  const AMMO = Object.freeze(['weak', 'penetrate', 'shock']);
  const WEAPONS = Object.freeze(['handgun', 'smg', 'assault', 'sniper', 'taser']);

  const LAYERS = Object.freeze({
    'emp:discharge': [
      ['sine', 82, 48, .14, 0, 235, 'low-impact'],
      ['triangle', 310, 155, .055, 18, 155, 'body'],
      ['noise', 520, 240, .025, 4, 72, 'filtered-air']
    ],
    'emp-charge:charge': [
      ['sine', 104, 156, .09, 0, 260, 'low-rise'],
      ['sine', 196, 294, .052, 38, 205, 'harmonic-rise'],
      ['noise', 780, 420, .018, 24, 75, 'filtered-charge']
    ],
    'emp-resonance:resonance': [
      ['sine', 73, 116, .12, 0, 300, 'low-resonance'],
      ['triangle', 292, 584, .075, 24, 230, 'rising-partial'],
      ['sine', 438, 659, .035, 68, 180, 'upper-partial']
    ],
    'emp-cancel:cancel': [
      ['sine', 164, 65, .095, 0, 225, 'descending-low'],
      ['triangle', 328, 131, .046, 18, 170, 'descending-body'],
      ['noise', 460, 220, .018, 8, 58, 'short-dissipation']
    ],
    'emp-storage-lock:storage-lock': [
      ['sine', 98, 49, .105, 0, 280, 'low-lock'],
      ['triangle', 196, 147, .05, 22, 205, 'closed-body'],
      ['sine', 247, 196, .025, 72, 95, 'muted-latch']
    ],
    'action-special-ammo-load:weak': [
      ['sine', 116, 174, .065, 0, 155, 'low-load'],
      ['triangle', 232, 348, .035, 34, 115, 'loaded-body']
    ],
    'action-special-ammo-load:penetrate': [
      ['sine', 146, 220, .06, 0, 145, 'low-load'],
      ['triangle', 293, 440, .032, 30, 110, 'loaded-body']
    ],
    'action-special-ammo-load:shock': [
      ['sine', 98, 147, .06, 0, 155, 'low-load'],
      ['triangle', 196, 294, .038, 28, 120, 'charged-body']
    ],
    'action-special-ammo-shot:weak': [
      ['sine', 92, 58, .075, 0, 110, 'low-release'],
      ['triangle', 184, 110, .03, 8, 82, 'damped-body']
    ],
    'action-special-ammo-shot:penetrate': [
      ['sine', 138, 82, .065, 0, 100, 'low-release'],
      ['triangle', 276, 165, .032, 12, 75, 'narrow-body']
    ],
    'action-special-ammo-shot:shock': [
      ['sine', 104, 62, .065, 0, 112, 'low-release'],
      ['triangle', 208, 312, .035, 10, 78, 'charged-body']
    ],
    'action-special-ammo-impact:weak': [
      ['sine', 96, 46, .11, 0, 210, 'low-impact'],
      ['triangle', 192, 88, .055, 12, 150, 'body-collapse'],
      ['noise', 430, 210, .018, 0, 46, 'short-friction']
    ],
    'action-special-ammo-impact:penetrate': [
      ['sine', 128, 74, .085, 0, 185, 'low-contact'],
      ['triangle', 256, 170, .045, 14, 138, 'through-body'],
      ['noise', 520, 280, .014, 4, 42, 'short-friction']
    ],
    'action-special-ammo-impact:shock': [
      ['sine', 88, 66, .085, 0, 200, 'low-contact'],
      ['triangle', 176, 352, .05, 16, 160, 'charged-body'],
      ['sine', 264, 198, .025, 52, 105, 'settling-partial']
    ]
  });

  function parseVariant(event) {
    if (Object.hasOwn(EMP, event.type)) {
      const mode = EMP[event.type][event.variant];
      return mode ? { family: 'emp', variant: mode,
        profileKey: `${event.type}:${mode}` } : null;
    }
    if (!['action-special-ammo-load', 'action-special-ammo-shot',
      'action-special-ammo-impact'].includes(event.type)) return null;
    const [ammo, detail] = String(event.variant).split(':');
    if (!AMMO.includes(ammo)) return null;
    if (event.type !== 'action-special-ammo-impact') {
      if (!detail || !WEAPONS.includes(detail)) return null;
    } else if (!detail) return null;
    const profileKey = `${event.type}:${ammo}`;
    return Object.hasOwn(LAYERS, profileKey)
      ? { family: 'special-ammo', variant: ammo, detail, profileKey } : null;
  }

  function createLedger({ maxLateMs = 100, maxEntries = 2048, retentionMs = 30000 } = {}) {
    if (!finite(maxLateMs) || maxLateMs < 0 || !Number.isInteger(maxEntries) || maxEntries < 16 ||
        !finite(retentionMs) || retentionMs < maxLateMs)
      throw new TypeError('Invalid combat E SFX ledger limits');
    let roomKey = '';
    const consumed = new Map();
    let watermark = 0;
    function prune(nowMs) {
      watermark = Math.max(watermark, nowMs);
      for (const [id, expiresAt] of consumed) if (expiresAt <= nowMs) consumed.delete(id);
    }
    function consume(id, nowMs, eventAtMs) {
      if (consumed.has(id)) return false;
      if (consumed.size >= maxEntries) return false;
      consumed.set(id, Math.max(nowMs, eventAtMs + maxLateMs) + retentionMs);
      return true;
    }

    function enterRoom(roomId, roomGeneration) {
      if (typeof roomId !== 'string' || !roomId ||
          !Number.isInteger(roomGeneration) || roomGeneration < 0)
        throw new TypeError('Combat E SFX ledger needs a room ID and generation');
      const next = `${roomId}:${roomGeneration}`;
      if (next !== roomKey) { roomKey = next; consumed.clear(); watermark = 0; }
    }

    function admit(event, { audible = true, reducedMotion = false } = {}) {
      if (!event || typeof event.eventId !== 'string' || !event.eventId ||
          typeof event.type !== 'string' || !event.type ||
          typeof event.variant !== 'string' || !event.variant ||
          typeof event.roomId !== 'string' || !event.roomId ||
          !Number.isInteger(event.roomGeneration) || event.roomGeneration < 0 ||
          !finite(event.eventAtMs) || event.eventAtMs < 0 ||
          !finite(event.nowMs) || event.nowMs < 0)
        throw new TypeError('Combat E SFX requires eventId, type, variant, room generation and event time');
      const parsed = parseVariant(event);
      if (!parsed) throw new TypeError(`Unsupported combat E SFX event: ${event.type}:${event.variant}`);

      enterRoom(event.roomId, event.roomGeneration);
      const identity = event.eventId;
      prune(event.nowMs);
      if (watermark - event.eventAtMs > retentionMs) return null;
      if (consumed.has(identity)) return null;
      // The event is consumed before mute/reduced-device gates; later frames
      // cannot replay it after audio becomes available or the viewport returns.
      if (!consume(identity, event.nowMs, event.eventAtMs)) return null;
      if (!audible || event.nowMs > event.eventAtMs + maxLateMs) return null;

      const timeScale = reducedMotion ? .72 : 1;
      const layers = LAYERS[parsed.profileKey].map(([shape, frequencyHz,
        endFrequencyHz, amplitude, offsetMs, durationMs, layer]) => {
        const offset = Math.round(offsetMs * timeScale);
        const duration = Math.max(28, Math.round(durationMs * timeScale));
        return Object.freeze({ shape, frequencyHz, endFrequencyHz, amplitude,
          layer, offsetMs: offset, durationMs: duration,
          startAtMs: event.eventAtMs + offset,
          endAtMs: event.eventAtMs + offset + duration });
      });
      const endsAtMs = Math.max(...layers.map(layer => layer.endAtMs));
      return Object.freeze({ family: parsed.family, eventId: identity,
        type: event.type, variant: event.variant,
        semanticVariant: parsed.variant, detail: parsed.detail || '',
        roomId: event.roomId, roomGeneration: event.roomGeneration,
        startsAtMs: event.eventAtMs, endsAtMs,
        layers: Object.freeze(layers),
        completionReceipt: Object.freeze({ eventId: identity,
          roomId: event.roomId, roomGeneration: event.roomGeneration, endsAtMs }) });
    }

    return Object.freeze({ admit, enterRoom,
      has(eventId) { return consumed.has(eventId); },
      size() { return consumed.size; }
    });
  }

  const api = Object.freeze({ EMP, AMMO, LAYERS, createLedger });
  root.DvaWebGPUCombatESfx = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
