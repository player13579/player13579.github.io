(function (root) {
  'use strict';
  // Data-only per-fixture one-shot candidates. App integration must admit a cue
  // only from a same-frame submitted visual receipt and suppress its paired
  // generic `object` sound only when the cue player accepts the plan.
  const MAX_GAIN = 0.085;
  const MAX_CUE_MS = 260;
  const MAX_LATE_MS = 180;
  const RETENTION_MS = 30000;
  const MAX_ENTRIES = 2048;
  const MAX_EVENTS_PER_SECOND = 8;
  const TARGETS = Object.freeze({
    'v302-observatory-holoProjector-1': Object.freeze({ type: 'holoProjector', effectKind: 'luckBoost',
      cue: 'observatory-twin-lens-alignment', layers: Object.freeze([
        Object.freeze({ shape: 'triangle', frequencyHz: 720, endFrequencyHz: 940, amplitude: .050, offsetMs: 0, durationMs: 72, layer: 'first-lens-tap' }),
        Object.freeze({ shape: 'sine', frequencyHz: 1080, endFrequencyHz: 840, amplitude: .038, offsetMs: 34, durationMs: 96, layer: 'second-lens-tap' }),
        Object.freeze({ shape: 'sine', frequencyHz: 660, endFrequencyHz: 880, amplitude: .042, offsetMs: 82, durationMs: 145, layer: 'alignment-note' })
      ])
    }),
    'v302-observatory-readingLamp-2': Object.freeze({ type: 'readingLamp', effectKind: 'mana',
      cue: 'observatory-reading-lamp-glass-tap', layers: Object.freeze([
        Object.freeze({ shape: 'sine', frequencyHz: 392, endFrequencyHz: 330, amplitude: .060, offsetMs: 0, durationMs: 104, layer: 'warm-lamp-body' }),
        Object.freeze({ shape: 'triangle', frequencyHz: 784, endFrequencyHz: 588, amplitude: .043, offsetMs: 12, durationMs: 84, layer: 'glass-shade-tap' }),
        Object.freeze({ shape: 'noise', frequencyHz: 1180, endFrequencyHz: 690, amplitude: .012, offsetMs: 4, durationMs: 26, layer: 'brief-glass-contact' })
      ])
    }),
    'v302-observatory-commandDesk-3': Object.freeze({ type: 'commandDesk', effectKind: 'luckBoost',
      cue: 'observatory-command-ceramic-focus', layers: Object.freeze([
        Object.freeze({ shape: 'triangle', frequencyHz: 184, endFrequencyHz: 172, amplitude: .043, offsetMs: 0, durationMs: 38, layer: 'ceramic-blade-click-1' }),
        Object.freeze({ shape: 'triangle', frequencyHz: 207, endFrequencyHz: 194, amplitude: .040, offsetMs: 34, durationMs: 36, layer: 'ceramic-blade-click-2' }),
        Object.freeze({ shape: 'triangle', frequencyHz: 191, endFrequencyHz: 178, amplitude: .037, offsetMs: 68, durationMs: 36, layer: 'ceramic-blade-click-3' }),
        Object.freeze({ shape: 'triangle', frequencyHz: 226, endFrequencyHz: 210, amplitude: .035, offsetMs: 102, durationMs: 35, layer: 'ceramic-blade-click-4' }),
        Object.freeze({ shape: 'triangle', frequencyHz: 198, endFrequencyHz: 184, amplitude: .033, offsetMs: 136, durationMs: 35, layer: 'ceramic-blade-click-5' }),
        Object.freeze({ shape: 'sine', frequencyHz: 520, endFrequencyHz: 390, amplitude: .045, offsetMs: 178, durationMs: 72, layer: 'dry-focus-tap' })
      ])
    })
  });

  function createPlanner({ maxEntries = MAX_ENTRIES, retentionMs = RETENTION_MS,
    maxLateMs = MAX_LATE_MS, maxEventsPerSecond = MAX_EVENTS_PER_SECOND } = {}) {
    if (!Number.isInteger(maxEntries) || maxEntries < 16 || maxEntries > MAX_ENTRIES ||
        !Number.isFinite(retentionMs) || retentionMs < MAX_CUE_MS || retentionMs > RETENTION_MS ||
        !Number.isFinite(maxLateMs) || maxLateMs < 0 || maxLateMs > MAX_LATE_MS ||
        !Number.isInteger(maxEventsPerSecond) || maxEventsPerSecond < 1 || maxEventsPerSecond > MAX_EVENTS_PER_SECOND)
      throw new TypeError('Invalid observatory fixture SFX ledger limits');
    let roomKey = '', watermark = 0;
    const consumed = new Map(), admittedAt = [];
    function enterRoom(roomId, roomGeneration) {
      if (typeof roomId !== 'string' || !roomId || !Number.isInteger(roomGeneration) || roomGeneration < 0)
        throw new TypeError('Observatory fixture SFX requires room ID and generation');
      const next = `${roomId}:${roomGeneration}`;
      if (next !== roomKey) { roomKey = next; watermark = 0; consumed.clear(); admittedAt.length = 0; }
    }
    function prune(nowMs) {
      watermark = Math.max(watermark, nowMs);
      for (const [id, expiresAt] of consumed) if (expiresAt <= nowMs) consumed.delete(id);
      while (admittedAt.length && admittedAt[0] <= nowMs - 1000) admittedAt.shift();
    }
    function admit(event, policy = {}) {
      if (!event || typeof event.eventId !== 'string' || !event.eventId ||
          typeof event.objectCausalId !== 'string' || !event.objectCausalId ||
          typeof event.roomId !== 'string' || !event.roomId ||
          !Number.isInteger(event.roomGeneration) || event.roomGeneration < 0 ||
          !Number.isSafeInteger(event.frameId) || event.frameId < 0 ||
          !Number.isFinite(event.eventAtMs) || event.eventAtMs < 0 ||
          !Number.isFinite(event.nowMs) || event.nowMs < 0 ||
          !Number.isFinite(event.volume) || event.volume < 0 || event.volume > 1)
        throw new TypeError('Observatory fixture SFX requires exact event/cause/frame identity, generation, time and mix');
      enterRoom(event.roomId, event.roomGeneration);
      prune(event.nowMs);
      const identity = `observatory-object:${event.eventId}`;
      if (consumed.has(identity)) return Object.freeze({ status: 'suppressed', eventId: event.eventId, reason: 'duplicate-event' });
      if (watermark - event.eventAtMs > retentionMs || consumed.size >= maxEntries)
        return Object.freeze({ status: 'suppressed', eventId: event.eventId, reason: 'event-expired-or-ledger-capacity' });
      // Consume before receipt, generic-suppression, mute and rate gates.
      consumed.set(identity, Math.max(event.nowMs, event.eventAtMs + maxLateMs) + retentionMs);
      const spec = TARGETS[event.objectId];
      if (!spec || event.mapId !== 'station' || event.mapRoomId !== 'observatory' ||
          event.type !== `object-${spec.type}` || event.objectType !== spec.type ||
          event.effectKind !== spec.effectKind || event.success !== true)
        return Object.freeze({ status: 'suppressed', eventId: event.eventId, reason: 'object-scope-or-success-mismatch' });
      const visual = event.visualReceipt, sound = event.genericSoundReceipt;
      if (visual?.eventId !== event.eventId || visual?.objectCausalId !== event.objectCausalId ||
          visual?.objectId !== event.objectId || visual?.type !== event.type ||
          visual?.effectKind !== event.effectKind || visual?.frameId !== event.frameId ||
          visual?.submitted !== true || visual?.mainFrameVisible !== true || visual?.drawn !== true ||
          visual?.visibleToListener !== true ||
          sound?.objectCausalId !== event.objectCausalId || sound?.type !== 'object' ||
          sound?.ownerId !== event.playerId || sound?.sourceKind !== 'facility' ||
          typeof sound?.soundId !== 'string' || !sound.soundId ||
          typeof event.playerId !== 'string' || !event.playerId)
        return Object.freeze({ status: 'suppressed', eventId: event.eventId, reason: 'cause-or-submitted-receipt-mismatch' });
      if (policy.pageHidden === true || policy.muted === true ||
          policy.sensoryBlocked === true || policy.audible === false || event.volume <= 0)
        return Object.freeze({ status: 'suppressed', eventId: event.eventId, reason: 'audio-policy-or-out-of-range' });
      if (event.nowMs < event.eventAtMs || event.nowMs - event.eventAtMs > maxLateMs)
        return Object.freeze({ status: 'suppressed', eventId: event.eventId, reason: 'late-event' });
      if (admittedAt.length >= maxEventsPerSecond)
        return Object.freeze({ status: 'suppressed', eventId: event.eventId, reason: 'rate-limit' });
      admittedAt.push(event.nowMs);
      const reduced = policy.reducedMotion === true;
      const layers = spec.layers.map(layer => Object.freeze({ ...layer,
        amplitude: Math.min(MAX_GAIN, layer.amplitude * event.volume * (reduced ? .78 : 1)),
        offsetMs: reduced ? Math.round(layer.offsetMs * .78) : layer.offsetMs,
        durationMs: reduced ? Math.max(24, Math.round(layer.durationMs * .82)) : layer.durationMs
      }));
      const durationMs = Math.max(...layers.map(layer => layer.offsetMs + layer.durationMs));
      if (durationMs > MAX_CUE_MS) throw new Error('Observatory fixture cue exceeds finite duration limit');
      return Object.freeze({ status: 'candidate', cue: spec.cue, eventId: event.eventId,
        objectCausalId: event.objectCausalId, roomId: event.roomId,
        roomGeneration: event.roomGeneration, frameId: event.frameId, objectId: event.objectId,
        objectType: spec.type, effectKind: spec.effectKind, loop: false,
        replaceGenericSound: true,
        replacement: Object.freeze({ soundId: sound.soundId, objectCausalId: event.objectCausalId }),
        startsAtMs: event.eventAtMs, endsAtMs: event.eventAtMs + durationMs,
        maxGain: MAX_GAIN, reducedMotion: reduced, layers: Object.freeze(layers) });
    }
    return Object.freeze({ admit, enterRoom,
      has: id => consumed.has(`observatory-object:${id}`),
      size: () => consumed.size, rateSize: () => admittedAt.length });
  }
  const api = Object.freeze({ MAX_GAIN, MAX_CUE_MS, MAX_LATE_MS, RETENTION_MS,
    MAX_ENTRIES, MAX_EVENTS_PER_SECOND, TARGETS, createPlanner });
  root.DvaWebGPUObservatoryObjectsESfx = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
