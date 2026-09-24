(function (root) {
  'use strict';
  // Data-only finite cue candidates. The app owns audio playback and must call
  // this planner only after a same-frame visible WebGPU event receipt exists.
  const MAX_GAIN = 0.12;
  const MAX_LATE_MS = 180;
  const RETENTION_MS = 30000;
  const MAX_EVENTS = 256;
  const MAX_CUES_PER_SECOND = 6;
  const PROFILES = Object.freeze({
    'action-item-pickup:*': Object.freeze({ cue: 'successful-item-pickup', layers: [
      ['triangle', 420, 560, .070, 0, 92, 'pickup-soft-lift'],
      ['sine', 680, 820, .042, 18, 74, 'pickup-clear-confirm'],
      ['noise', 920, 620, .014, 4, 28, 'pickup-brief-air']
    ] }),
    'quantum-electric-discharge:dielectric-breakdown:slow': Object.freeze({ cue: 'quantum-dielectric-snap', layers: [
      ['sine', 94, 68, .076, 0, 128, 'discharge-low-transient'],
      ['triangle', 410, 690, .062, 0, 86, 'discharge-conduction-edge'],
      ['noise', 1450, 720, .026, 0, 42, 'discharge-short-arc-noise'],
      ['triangle', 620, 390, .032, 54, 102, 'discharge-path-decay']
    ] })
  });
  const SHARED = Object.freeze({
    'alchemy-human-transmutation:': Object.freeze({
      reason: 'existing-exact-alchemy-sfx-plan', module: 'DvaWebGPUAlchemyESfx',
      profileKey: 'alchemy-human-transmutation:'
    })
  });

  function createPlanner({ maxEvents = MAX_EVENTS, retentionMs = RETENTION_MS,
    maxLateMs = MAX_LATE_MS, maxCuesPerSecond = MAX_CUES_PER_SECOND } = {}) {
    if (!Number.isInteger(maxEvents) || maxEvents < 4 || maxEvents > MAX_EVENTS ||
        !Number.isFinite(retentionMs) || retentionMs < 1000 || retentionMs > RETENTION_MS ||
        !Number.isFinite(maxLateMs) || maxLateMs < 0 || maxLateMs > MAX_LATE_MS ||
        !Number.isInteger(maxCuesPerSecond) || maxCuesPerSecond < 1 || maxCuesPerSecond > MAX_CUES_PER_SECOND)
      throw new TypeError('Invalid transmutation/pickup/quantum E SFX bounds');
    let roomKey = '';
    let watermark = 0;
    const consumed = new Map();
    const admittedTimes = [];
    function enterRoom(roomId, roomGeneration) {
      if (typeof roomId !== 'string' || !roomId || !Number.isInteger(roomGeneration) || roomGeneration < 0)
        throw new TypeError('SFX planner requires room ID and generation');
      const key = `${roomId}:${roomGeneration}`;
      if (roomKey !== key) {
        roomKey = key; watermark = 0; consumed.clear(); admittedTimes.length = 0;
      }
    }
    function prune(nowMs) {
      watermark = Math.max(watermark, nowMs);
      for (const [id, expiry] of consumed) if (expiry <= nowMs) consumed.delete(id);
      while (admittedTimes.length && admittedTimes[0] <= nowMs - 1000) admittedTimes.shift();
    }
    function admit(event, policy = {}) {
      if (!event || typeof event.eventId !== 'string' || !event.eventId ||
          typeof event.type !== 'string' || typeof event.variant !== 'string' ||
          typeof event.roomId !== 'string' || !Number.isInteger(event.roomGeneration) || event.roomGeneration < 0 ||
          !Number.isSafeInteger(event.frameId) || event.frameId < 0 ||
          !Number.isFinite(event.eventAtMs) || event.eventAtMs < 0 ||
          !Number.isFinite(event.nowMs) || event.nowMs < 0 ||
          !Number.isFinite(event.spatialVolume) || event.spatialVolume < 0 || event.spatialVolume > 1)
        throw new TypeError('SFX needs event identity, frame, room generation, timestamps and spatial volume');
      enterRoom(event.roomId, event.roomGeneration);
      prune(event.nowMs);
      const identity = `transmutation-pickup-quantum:${event.eventId}`;
      if (consumed.has(identity)) return Object.freeze({ eventId: event.eventId, suppressed: true, reason: 'duplicate-event' });
      if (watermark - event.eventAtMs > retentionMs || consumed.size >= maxEvents)
        return Object.freeze({ eventId: event.eventId, suppressed: true, reason: 'event-expired-or-capacity' });
      // Consume before any visibility, mute, verification, lateness or rate gate.
      consumed.set(identity, Math.max(event.nowMs, event.eventAtMs + maxLateMs) + retentionMs);
      const meta = Object.freeze({ eventId: event.eventId, type: event.type, variant: event.variant,
        roomId: event.roomId, roomGeneration: event.roomGeneration, frameId: event.frameId });
      const key = `${event.type}:${event.variant}`;
      if (SHARED[key]) return Object.freeze({ ...meta, suppressed: true,
        reason: SHARED[key].reason, sharedPlanner: SHARED[key].module });
      const profile = event.type === 'action-item-pickup' && event.variant
        ? PROFILES['action-item-pickup:*'] : PROFILES[key];
      if (!profile) return Object.freeze({ ...meta, suppressed: true, reason: 'unsupported-event-variant' });
      const receipt = event.submittedReceipt;
      if (receipt?.eventId !== event.eventId || receipt?.frameId !== event.frameId ||
          receipt?.type !== event.type || receipt?.variant !== event.variant ||
          receipt?.submitted !== true || receipt?.mainFrameVisible !== true ||
          receipt?.drawn !== true || receipt?.visibleToListener !== true ||
          receipt?.sourcePlayerId !== event.sourcePlayerId || typeof event.sourcePlayerId !== 'string' || !event.sourcePlayerId)
        return Object.freeze({ ...meta, suppressed: true, reason: 'no-matching-visible-submitted-receipt' });
      if (policy.pageHidden === true || policy.muted === true || policy.verify === true ||
          policy.sensoryBlocked === true || policy.audible === false || event.spatialVolume <= 0)
        return Object.freeze({ ...meta, suppressed: true, reason: 'audio-policy-or-out-of-range' });
      if (event.nowMs < event.eventAtMs || event.nowMs - event.eventAtMs > maxLateMs)
        return Object.freeze({ ...meta, suppressed: true, reason: 'late-event' });
      if (admittedTimes.length >= maxCuesPerSecond)
        return Object.freeze({ ...meta, suppressed: true, reason: 'rate-limit' });
      admittedTimes.push(event.nowMs);
      const reduced = policy.reducedMotion === true;
      const gainScale = Math.min(1, event.spatialVolume) * (reduced ? .72 : 1);
      const timeScale = reduced ? .86 : 1;
      const layers = profile.layers.map(([shape, frequencyHz, endFrequencyHz, amplitude, offsetMs, durationMs, layer]) => {
        const offset = Math.round(offsetMs * timeScale), duration = Math.max(24, Math.round(durationMs * timeScale));
        return Object.freeze({ shape, frequencyHz, endFrequencyHz,
          amplitude: Math.min(MAX_GAIN, amplitude * gainScale), layer,
          offsetMs: offset, durationMs: duration,
          startAtMs: event.eventAtMs + offset, endAtMs: event.eventAtMs + offset + duration });
      });
      return Object.freeze({ family: 'transmutation-pickup-quantum-e', cue: profile.cue,
        ...meta, maxGain: MAX_GAIN, loop: false, reducedMotion: reduced,
        startsAtMs: event.eventAtMs,
        endsAtMs: Math.max(...layers.map(layer => layer.endAtMs)),
        layers: Object.freeze(layers) });
    }
    return Object.freeze({ admit, enterRoom, has: id => consumed.has(`transmutation-pickup-quantum:${id}`),
      size: () => consumed.size, rateSize: () => admittedTimes.length });
  }
  const api = Object.freeze({ MAX_GAIN, MAX_LATE_MS, RETENTION_MS, MAX_EVENTS,
    MAX_CUES_PER_SECOND, PROFILES, SHARED, createPlanner });
  root.DvaWebGPUTransmutationPickupQuantumESfx = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);


