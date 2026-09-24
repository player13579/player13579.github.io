(function (root) {
  'use strict';

  // Finite candidates for cueEdges emitted by webgpu-hazard-status-e. This is
  // data planning only; a caller must provide the exact submitted-frame receipt.
  const PROFILES = Object.freeze({
    'hazard-fire:start': Object.freeze({ cue: 'hazard-fire-entry', layers: [
      ['sine', 92, 69, .060, 0, 165, 'field-low-ember'],
      ['triangle', 184, 138, .030, 22, 128, 'field-mid-heat'],
      ['noise', 520, 340, .014, 0, 48, 'short-ember-air']
    ] }),
    'hazard-fire:stop': Object.freeze({ cue: 'hazard-fire-expiry', layers: [
      ['sine', 110, 73, .052, 0, 180, 'field-low-cooldown'],
      ['triangle', 330, 220, .024, 25, 130, 'field-mid-fade']
    ] }),
    'hazard-poison:start': Object.freeze({ cue: 'hazard-poison-release', layers: [
      ['sine', 146, 110, .052, 0, 165, 'field-low-gas'],
      ['triangle', 293, 440, .029, 26, 132, 'field-mid-bubble'],
      ['noise', 1050, 680, .012, 0, 52, 'short-vapor']
    ] }),
    'hazard-poison:stop': Object.freeze({ cue: 'hazard-poison-expiry', layers: [
      ['sine', 174, 131, .048, 0, 175, 'field-low-settle'],
      ['triangle', 392, 262, .026, 28, 130, 'field-mid-dissolve']
    ] }),
    'hazard-water:start': Object.freeze({ cue: 'hazard-water-release', layers: [
      ['sine', 196, 147, .050, 0, 170, 'field-low-water'],
      ['triangle', 523, 392, .032, 18, 145, 'field-mid-surface'],
      ['noise', 1450, 880, .014, 0, 55, 'short-splash']
    ] }),
    'hazard-water:stop': Object.freeze({ cue: 'hazard-water-expiry', layers: [
      ['sine', 220, 165, .045, 0, 165, 'field-low-drain'],
      ['triangle', 440, 330, .025, 24, 128, 'field-mid-drip']
    ] }),
    'status-burning:start': Object.freeze({ cue: 'status-burning-onset', layers: [
      ['sine', 164, 123, .054, 0, 160, 'body-low-flare'],
      ['triangle', 392, 587, .032, 24, 138, 'body-mid-ignition'],
      ['noise', 1250, 780, .012, 0, 46, 'short-ignition-air']
    ] }),
    'status-burning:stop': Object.freeze({ cue: 'status-burning-cleared', layers: [
      ['sine', 196, 147, .050, 0, 175, 'body-low-cool'],
      ['triangle', 494, 330, .027, 28, 135, 'body-mid-cooling']
    ] }),
    'status-poison:start': Object.freeze({ cue: 'status-poison-onset', layers: [
      ['sine', 138, 103, .050, 0, 170, 'body-low-poison'],
      ['triangle', 277, 415, .028, 26, 138, 'body-mid-symptom'],
      ['noise', 920, 600, .011, 0, 48, 'short-body-vapor']
    ] }),
    'status-poison:stop': Object.freeze({ cue: 'status-poison-cleared', layers: [
      ['sine', 165, 220, .048, 0, 175, 'body-low-recovery'],
      ['triangle', 330, 494, .029, 24, 140, 'body-mid-release']
    ] })
  });
  const MAX_ENTRIES = 2048, RETENTION_MS = 30000, MAX_LATE_MS = 180;
  const MAX_EVENT_RATE = 8, MAX_DURATION_MS = 220, MAX_LAYER_AMPLITUDE = .06;

  function createPlanner({ maxEntries = MAX_ENTRIES, retentionMs = RETENTION_MS,
    maxLateMs = MAX_LATE_MS } = {}) {
    if (!Number.isInteger(maxEntries) || maxEntries < 16 || !Number.isFinite(retentionMs) ||
        !Number.isFinite(maxLateMs) || maxLateMs < 0 || retentionMs < maxLateMs)
      throw new TypeError('Invalid hazard/status E SFX ledger limits');
    let roomKey = '', watermark = 0;
    const consumed = new Map(), admittedAt = [];
    function enterRoom(roomId, generation) {
      if (typeof roomId !== 'string' || !roomId || !Number.isInteger(generation) || generation < 0)
        throw new TypeError('Hazard/status E SFX needs room ID and generation');
      const next = `${roomId}:${generation}`;
      if (roomKey !== next) { roomKey = next; watermark = 0; consumed.clear(); admittedAt.length = 0; }
    }
    function prune(nowMs) {
      watermark = Math.max(watermark, nowMs);
      for (const [id, expiry] of consumed) if (expiry <= nowMs) consumed.delete(id);
      while (admittedAt.length && admittedAt[0] <= nowMs - 1000) admittedAt.shift();
    }
    function admit(edge, evidence = {}) {
      if (!edge || typeof edge.edgeId !== 'string' || !edge.edgeId ||
          !['start', 'stop'].includes(edge.action) || typeof edge.cue !== 'string' ||
          typeof evidence.roomId !== 'string' || !evidence.roomId ||
          !Number.isInteger(evidence.roomGeneration) || evidence.roomGeneration < 0 ||
          !Number.isFinite(evidence.eventAtMs) || !Number.isFinite(evidence.nowMs) ||
          typeof evidence.sourceId !== 'string' || !evidence.sourceId)
        throw new TypeError('Hazard/status E SFX requires exact edge, source, generation and times');
      enterRoom(evidence.roomId, evidence.roomGeneration);
      prune(evidence.nowMs);
      const identity = `hazard-status:${edge.edgeId}`;
      if (consumed.has(identity)) return null;
      if (consumed.size >= maxEntries) return Object.freeze({ suppressed: true, reason: 'ledger-capacity', edgeId: edge.edgeId });
      // Consume all first observations, including muted, hidden, unsubmitted and late edges.
      consumed.set(identity, Math.max(evidence.nowMs, evidence.eventAtMs) + retentionMs);

      const field = /^hazard:([^:]+):(start|stop)$/.exec(edge.edgeId);
      const status = /^status:(.+):(start|stop)$/.exec(edge.edgeId);
      const family = edge.cue;
      const action = edge.action;
      let category = '';
      if (field && field[2] === action && family === `hazard-${evidence.kind}` &&
          field[1] === evidence.fieldId && ['fire', 'poison', 'water'].includes(evidence.kind)) {
        category = `hazard-${evidence.kind}`;
        if (action === 'stop' && evidence.authoritativeLifecycle !== true)
          return Object.freeze({ suppressed: true, reason: 'unconfirmed-field-expiry', edgeId: edge.edgeId });
        if (evidence.kind === 'fire' && action === 'start' && evidence.fireJutsuSoundOwned !== false)
          return Object.freeze({ suppressed: true, reason: evidence.fireJutsuSoundOwned === true ? 'fire-jutsu-sound-owner' : 'fire-sound-owner-unknown', edgeId: edge.edgeId });
      } else if (status && status[2] === action && family === `status-${evidence.kind}` &&
          status[1] === evidence.statusEventId && ['poison', 'burning'].includes(evidence.kind)) {
        category = `status-${evidence.kind}`;
        if (action === 'stop' && evidence.stateTransitionConfirmed !== true)
          return Object.freeze({ suppressed: true, reason: 'unconfirmed-status-transition', edgeId: edge.edgeId });
        if (action === 'start' && evidence.persistentMarkerSoundOwned !== false)
          return Object.freeze({ suppressed: true, reason: evidence.persistentMarkerSoundOwned === true ? 'persistent-marker-sound-owner' : 'marker-sound-owner-unknown', edgeId: edge.edgeId });
      } else {
        return Object.freeze({ suppressed: true, reason: 'edge-scope-mismatch', edgeId: edge.edgeId });
      }
      if (evidence.submittedReceipt !== true || evidence.visibleToListener !== true)
        return Object.freeze({ suppressed: true, reason: 'receipt-not-visible', edgeId: edge.edgeId });
      if (evidence.nowMs < evidence.eventAtMs || evidence.nowMs - evidence.eventAtMs > maxLateMs ||
          watermark - evidence.eventAtMs > retentionMs)
        return Object.freeze({ suppressed: true, reason: 'late', edgeId: edge.edgeId });
      if (evidence.muted || !(Number(evidence.volume) > 0))
        return Object.freeze({ suppressed: true, reason: 'audio-policy', edgeId: edge.edgeId });
      if (admittedAt.length >= MAX_EVENT_RATE)
        return Object.freeze({ suppressed: true, reason: 'rate-limit', edgeId: edge.edgeId });

      const spec = PROFILES[`${category}:${action}`];
      const scale = evidence.reducedMotion ? .72 : 1;
      const volume = Math.min(1, Math.max(0, evidence.volume));
      const layers = spec.layers.map(([shape, frequencyHz, endFrequencyHz, amplitude, offsetMs, durationMs, layer]) => {
        const offset = Math.round(offsetMs * scale), duration = Math.max(28, Math.round(durationMs * scale));
        return Object.freeze({ shape, frequencyHz, endFrequencyHz,
          amplitude: Math.min(MAX_LAYER_AMPLITUDE, amplitude) * volume,
          offsetMs: offset, durationMs: duration, layer });
      });
      const durationMs = Math.max(...layers.map(layer => layer.offsetMs + layer.durationMs));
      if (durationMs > MAX_DURATION_MS || layers.length > 3 ||
          layers.some(layer => layer.amplitude > MAX_LAYER_AMPLITUDE))
        throw new Error('Hazard/status E SFX profile exceeds bounded cue limits');
      admittedAt.push(evidence.nowMs);
      return Object.freeze({ family: 'hazard-status-e', cue: spec.cue, edgeId: edge.edgeId,
        action, kind: evidence.kind, roomId: evidence.roomId, roomGeneration: evidence.roomGeneration,
        sourceId: evidence.sourceId, fieldId: field ? evidence.fieldId : '',
        eventId: edge.edgeId, startsAtMs: evidence.eventAtMs,
        endsAtMs: evidence.eventAtMs + durationMs, layers: Object.freeze(layers),
        completionReceipt: Object.freeze({ eventId: edge.edgeId, roomId: evidence.roomId,
          roomGeneration: evidence.roomGeneration, endsAtMs: evidence.eventAtMs + durationMs }) });
    }
    return Object.freeze({ admit, enterRoom, has: edgeId => consumed.has(`hazard-status:${edgeId}`), size: () => consumed.size });
  }
  const api = Object.freeze({ PROFILES, createPlanner });
  root.DvaWebGPUHazardStatusESfx = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
