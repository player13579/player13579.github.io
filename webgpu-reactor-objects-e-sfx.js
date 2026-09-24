(function (root) {
  'use strict';

  // Candidate one-shots for the three individually authored reactor fixtures.
  // Callers must suppress the existing generic `object` sound before using a
  // cue; this module never schedules audio itself.
  const TARGETS = Object.freeze({
    'v302-reactor-reactorGauge-1': Object.freeze({
      type: 'reactorGauge', effectKind: 'luckBoost', cue: 'reactor-gauge-calibration',
      layers: Object.freeze([
        Object.freeze({ shape: 'sine', frequencyHz: 196, endFrequencyHz: 294, amplitude: 0.085, offsetMs: 0, durationMs: 180, layer: 'instrument-low' }),
        Object.freeze({ shape: 'triangle', frequencyHz: 587, endFrequencyHz: 880, amplitude: 0.045, offsetMs: 38, durationMs: 145, layer: 'dial-glass' }),
        Object.freeze({ shape: 'sine', frequencyHz: 1175, endFrequencyHz: 988, amplitude: 0.018, offsetMs: 8, durationMs: 58, layer: 'needle-tick' })
      ])
    }),
    'v302-reactor-coolingUnit-2': Object.freeze({
      type: 'coolingUnit', effectKind: 'stamina', cue: 'cooling-basin-flow',
      layers: Object.freeze([
        Object.freeze({ shape: 'sine', frequencyHz: 164, endFrequencyHz: 123, amplitude: 0.075, offsetMs: 0, durationMs: 210, layer: 'basin-low' }),
        Object.freeze({ shape: 'triangle', frequencyHz: 392, endFrequencyHz: 523, amplitude: 0.042, offsetMs: 26, durationMs: 175, layer: 'water-resonance' }),
        Object.freeze({ shape: 'noise', frequencyHz: 1450, endFrequencyHz: 820, amplitude: 0.016, offsetMs: 0, durationMs: 82, layer: 'short-water-rush' })
      ])
    }),
    'v302-reactor-powerCabinet-3': Object.freeze({
      type: 'powerCabinet', effectKind: 'stamina', cue: 'stone-lantern-power-release',
      layers: Object.freeze([
        Object.freeze({ shape: 'sine', frequencyHz: 220, endFrequencyHz: 330, amplitude: 0.078, offsetMs: 0, durationMs: 190, layer: 'cabinet-low' }),
        Object.freeze({ shape: 'triangle', frequencyHz: 440, endFrequencyHz: 660, amplitude: 0.04, offsetMs: 24, durationMs: 145, layer: 'stone-chime' }),
        Object.freeze({ shape: 'noise', frequencyHz: 2100, endFrequencyHz: 1200, amplitude: 0.014, offsetMs: 0, durationMs: 48, layer: 'switch-contact' })
      ])
    })
  });
  const MAX_ENTRIES = 2048;
  const RETENTION_MS = 30000;
  const MAX_LAYERS = 3;
  const MAX_CUE_MS = 220;
  const MAX_EVENT_RATE = 8;

  function createPlanner({ maxEntries = MAX_ENTRIES, retentionMs = RETENTION_MS } = {}) {
    if (!Number.isInteger(maxEntries) || maxEntries < 16 ||
        !Number.isFinite(retentionMs) || retentionMs < MAX_CUE_MS)
      throw new TypeError('Invalid reactor object E ledger limits');
    let roomKey = '', watermark = 0;
    const consumed = new Map();
    const admittedAt = [];

    function enterRoom(roomId, roomGeneration) {
      if (typeof roomId !== 'string' || !roomId || !Number.isInteger(roomGeneration) || roomGeneration < 0)
        throw new TypeError('Reactor object E needs room ID and generation');
      const next = `${roomId}:${roomGeneration}`;
      if (next !== roomKey) { roomKey = next; watermark = 0; consumed.clear(); admittedAt.length = 0; }
    }
    function prune(nowMs) {
      watermark = Math.max(watermark, nowMs);
      for (const [id, expiresAt] of consumed) if (expiresAt <= nowMs) consumed.delete(id);
      while (admittedAt.length && admittedAt[0] <= nowMs - 1000) admittedAt.shift();
    }
    function admit(event, { muted = false, verify = false, reducedMotion = false,
      genericSoundSuppressed = false, volume = 1 } = {}) {
      if (!event || typeof event.eventId !== 'string' || !event.eventId ||
          typeof event.roomId !== 'string' || !event.roomId ||
          !Number.isInteger(event.roomGeneration) || event.roomGeneration < 0 ||
          !Number.isFinite(event.eventAtMs) || !Number.isFinite(event.nowMs))
        throw new TypeError('Reactor object E needs an event identity, room generation and finite times');
      if (!Number.isFinite(volume)) throw new TypeError('Reactor object E volume must be finite');
      enterRoom(event.roomId, event.roomGeneration);
      prune(event.nowMs);
      const identity = `reactor-object:${event.eventId}`;
      if (consumed.has(identity)) return null;
      if (consumed.size >= maxEntries) return Object.freeze({ status: 'suppressed', reason: 'ledger-capacity', eventId: event.eventId });
      consumed.set(identity, Math.max(event.nowMs, event.eventAtMs) + retentionMs);

      const target = TARGETS[event.objectId];
      if (!target || event.type !== `object-${target.type}` || event.objectType !== target.type ||
          event.effectKind !== target.effectKind || event.success !== true ||
          event.submittedReceipt !== true || event.visibleToListener !== true ||
          event.roomId !== 'reactor' || genericSoundSuppressed !== true)
        return Object.freeze({ status: 'suppressed', reason: 'scope-or-receipt', eventId: event.eventId });
      if (watermark - event.eventAtMs > 30000 || event.nowMs < event.eventAtMs ||
          event.nowMs - event.eventAtMs > 180)
        return Object.freeze({ status: 'suppressed', reason: 'late', eventId: event.eventId });
      if (muted || verify || volume <= 0)
        return Object.freeze({ status: 'suppressed', reason: 'audio-policy', eventId: event.eventId });
      if (admittedAt.length >= MAX_EVENT_RATE)
        return Object.freeze({ status: 'suppressed', reason: 'rate-limit', eventId: event.eventId });
      admittedAt.push(event.nowMs);

      const layers = target.layers.map(layer => Object.freeze({ ...layer,
        amplitude: Math.min(layer.amplitude, 0.085) * Math.min(1, Math.max(0, volume)),
        offsetMs: reducedMotion ? Math.round(layer.offsetMs * 0.5) : layer.offsetMs,
        durationMs: reducedMotion ? Math.max(36, Math.round(layer.durationMs * 0.65)) : layer.durationMs
      }));
      const durationMs = Math.max(...layers.map(layer => layer.offsetMs + layer.durationMs));
      if (layers.length > MAX_LAYERS || durationMs > MAX_CUE_MS)
        throw new Error('Reactor object E profile exceeds finite cue limits');
      return Object.freeze({ status: 'candidate', replacesGenericSound: true,
        eventId: event.eventId, roomId: event.roomId, roomGeneration: event.roomGeneration,
        objectId: event.objectId, objectType: target.type, cue: target.cue,
        startsAtMs: event.eventAtMs, endsAtMs: event.eventAtMs + durationMs,
        layers: Object.freeze(layers) });
    }
    return Object.freeze({ admit, enterRoom, has: id => consumed.has(`reactor-object:${id}`), size: () => consumed.size });
  }

  const api = Object.freeze({ TARGETS, createPlanner });
  root.DvaWebGPUReactorObjectsESfx = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
