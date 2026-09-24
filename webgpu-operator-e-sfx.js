(function (root) {
  'use strict';

  // Event-only plans for operator E phenomena without an existing sound owner.
  // Audio playback belongs to the shared WebGPU E cue player.
  const PROFILES = Object.freeze({
    'hacker-root:release': Object.freeze({ cue: 'root-release', layers: [
      ['sine', 82, 61, .065, 0, 190, 'root-low-release'],
      ['triangle', 246, 183, .033, 18, 145, 'root-mid-release'],
      ['noise', 420, 250, .012, 8, 42, 'short-root-air']
    ] }),
    'flora-invisible:': Object.freeze({ cue: 'flora-invisible-self', layers: [
      ['sine', 164, 123, .038, 0, 160, 'private-low-softening'],
      ['triangle', 328, 246, .023, 24, 132, 'private-mid-softening'],
      ['sine', 492, 369, .012, 48, 88, 'private-high-softening']
    ] }),
    'idea-truth:': Object.freeze({ cue: 'idea-truth', layers: [
      ['sine', 196, 294, .055, 0, 175, 'truth-low-rise'],
      ['triangle', 392, 588, .031, 28, 138, 'truth-mid-rise']
    ] }),
    'idea-beauty:': Object.freeze({ cue: 'idea-beauty', layers: [
      ['sine', 220, 165, .052, 0, 175, 'beauty-low-settle'],
      ['triangle', 440, 330, .032, 26, 140, 'beauty-mid-settle']
    ] }),
    'idea-ascension:': Object.freeze({ cue: 'idea-ascension', layers: [
      ['sine', 110, 165, .062, 0, 230, 'ascension-low-rise'],
      ['triangle', 330, 495, .037, 38, 185, 'ascension-mid-rise'],
      ['sine', 495, 660, .018, 82, 112, 'ascension-upper-glint']
    ] })
  });
  const SHARED = Object.freeze({
    'hacker-root:all-operators': 'root-health-impact',
    'flora:': 'flora-heal-body-gain',
    'idea-good:': 'idea-good-stamina-gain',
    'action-renki:': 'defense-movement-e-sfx',
    'action-renki:tenfold': 'defense-movement-e-sfx'
  });
  const REJECTED = Object.freeze({
    'action-renki:desire-recovery': 'desire-recovery-has-no-e',
    'action-renki:desire-recovery-start': 'desire-recovery-has-no-e',
    'flora-sunbeam:': 'existing-world-sound-owner'
  });

  function createLedger({ maxEntries = 2048, retentionMs = 30000, maxLateMs = 180 } = {}) {
    if (!Number.isInteger(maxEntries) || maxEntries < 16 || !Number.isFinite(retentionMs) ||
        !Number.isFinite(maxLateMs) || retentionMs < maxLateMs || maxLateMs < 0)
      throw new TypeError('Invalid operator E SFX ledger limits');
    let roomKey = '';
    let watermark = 0;
    const consumed = new Map();
    function enterRoom(roomId, roomGeneration) {
      if (typeof roomId !== 'string' || !roomId || !Number.isInteger(roomGeneration) || roomGeneration < 0)
        throw new TypeError('Operator E SFX needs a room ID and generation');
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
          !Number.isInteger(event.roomGeneration) || !Number.isFinite(event.eventAtMs) ||
          !Number.isFinite(event.nowMs) || event.eventAtMs < 0 || event.nowMs < 0)
        throw new TypeError('Operator E SFX requires event identity, variant, room generation and time');
      enterRoom(event.roomId, event.roomGeneration);
      prune(event.nowMs);
      const identity = `operator:${event.eventId}`;
      if (watermark - event.eventAtMs > retentionMs || consumed.has(identity) || consumed.size >= maxEntries) return null;
      // Consume before mute, private-view denial or lateness.
      consumed.set(identity, Math.max(event.nowMs, event.eventAtMs + maxLateMs) + retentionMs);
      const key = `${event.type}:${event.variant}`;
      const meta = { eventId: event.eventId, type: event.type, variant: event.variant,
        roomId: event.roomId, roomGeneration: event.roomGeneration };
      if (SHARED[key]) return Object.freeze({ ...meta, suppressed: true,
        reason: 'shared-existing-sfx', sharedSfxKind: SHARED[key] });
      if (REJECTED[key]) return Object.freeze({ ...meta, suppressed: true, reason: REJECTED[key] });
      const profile = PROFILES[key];
      if (!profile) throw new TypeError(`Unsupported operator E SFX event: ${key}`);
      if (key === 'flora-invisible:') {
        const viewer = String(event.listenerId || '');
        const subject = String(event.playerId || '');
        if (!viewer || viewer !== subject || String(event.viewerId || '') !== viewer || event.visibleToListener !== true)
          return Object.freeze({ ...meta, suppressed: true, reason: 'flora-invisible-private-listener-only' });
      }
      if (!audible || event.nowMs > event.eventAtMs + maxLateMs) return null;
      const scale = reducedMotion ? .72 : 1;
      const layers = profile.layers.map(([shape, frequencyHz, endFrequencyHz, amplitude, offsetMs, durationMs, layer]) => {
        const offset = Math.round(offsetMs * scale), duration = Math.max(28, Math.round(durationMs * scale));
        return Object.freeze({ shape, frequencyHz, endFrequencyHz, amplitude, layer,
          offsetMs: offset, durationMs: duration, startAtMs: event.eventAtMs + offset,
          endAtMs: event.eventAtMs + offset + duration });
      });
      const endsAtMs = Math.max(...layers.map(layer => layer.endAtMs));
      return Object.freeze({ family: 'operator-e', cue: profile.cue, ...meta,
        startsAtMs: event.eventAtMs, endsAtMs, layers: Object.freeze(layers),
        // Deliberately no spatial fields: private invisibility must reveal no position.
        completionReceipt: Object.freeze({ eventId: event.eventId, roomId: event.roomId,
          roomGeneration: event.roomGeneration, endsAtMs }) });
    }
    return Object.freeze({ admit, enterRoom, has: id => consumed.has(`operator:${id}`), size: () => consumed.size });
  }
  const api = Object.freeze({ PROFILES, SHARED, REJECTED, createLedger });
  root.DvaWebGPUOperatorESfx = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
