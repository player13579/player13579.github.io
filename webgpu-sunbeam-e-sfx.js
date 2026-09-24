(function (root) {
  'use strict';
  const MAX_GAIN = 0.085, MAX_CUE_MS = 600, MAX_LATE_MS = 180;
  const RETENTION_MS = 30000, MAX_ENTRIES = 1024, MAX_CUES_PER_SECOND = 5;
  const VARIANTS = Object.freeze(['refraction:piercing', 'scattering:piercing', 'diffraction:piercing']);
  // The 1200ms visual model is represented in a compressed 600ms sound
  // envelope: supply 0-114ms, arrival 114-186ms, carrier 186-516ms, and
  // non-impact dissipation/supply-stop 516-600ms. Nothing asserts a hit.
  const ENVELOPE = Object.freeze({ supplyEndMs: 114, arrivalEndMs: 186,
    carrierEndMs: 516, dissipationEndMs: 600 });
  const LAYERS = Object.freeze([
    { shape: 'sine', frequencyHz: 118, endFrequencyHz: 164, amplitude: .040, offsetMs: 0, durationMs: 88, layer: 'hand-charge-low' },
    { shape: 'triangle', frequencyHz: 354, endFrequencyHz: 528, amplitude: .027, offsetMs: 18, durationMs: 84, layer: 'hand-supply-rise' },
    { shape: 'noise', frequencyHz: 1100, endFrequencyHz: 700, amplitude: .009, offsetMs: 32, durationMs: 30, layer: 'carrier-front-soft-edge' },
    { shape: 'noise', frequencyHz: 1480, endFrequencyHz: 980, amplitude: .014, offsetMs: 94, durationMs: 34, layer: 'single-emission-edge' },
    { shape: 'sine', frequencyHz: 196, endFrequencyHz: 247, amplitude: .025, offsetMs: 114, durationMs: 72, layer: 'carrier-arrival-tone' },
    { shape: 'triangle', frequencyHz: 588, endFrequencyHz: 392, amplitude: .028, offsetMs: 186, durationMs: 330, layer: 'finite-carrier-body' },
    { shape: 'sine', frequencyHz: 988, endFrequencyHz: 620, amplitude: .012, offsetMs: 516, durationMs: 84, layer: 'terminal-dissipation-tail' },
    { shape: 'triangle', frequencyHz: 494, endFrequencyHz: 392, amplitude: .018, offsetMs: 522, durationMs: 78, layer: 'source-supply-stop' }
  ].map(Object.freeze));
  function createPlanner({ maxEntries = MAX_ENTRIES, retentionMs = RETENTION_MS,
    maxLateMs = MAX_LATE_MS, maxCuesPerSecond = MAX_CUES_PER_SECOND } = {}) {
    if (!Number.isInteger(maxEntries) || maxEntries < 16 || maxEntries > MAX_ENTRIES ||
        !Number.isFinite(retentionMs) || retentionMs < MAX_CUE_MS || retentionMs > RETENTION_MS ||
        !Number.isFinite(maxLateMs) || maxLateMs < 0 || maxLateMs > MAX_LATE_MS ||
        !Number.isInteger(maxCuesPerSecond) || maxCuesPerSecond < 1 || maxCuesPerSecond > MAX_CUES_PER_SECOND)
      throw new TypeError('Invalid Sunbeam E SFX planner bounds');
    let roomKey = '', watermark = 0;
    const consumed = new Map(), admittedAt = [];
    function enterRoom(roomId, roomGeneration) {
      if (typeof roomId !== 'string' || !roomId || !Number.isInteger(roomGeneration) || roomGeneration < 0)
        throw new TypeError('Sunbeam E SFX requires room ID and generation');
      const next = `${roomId}:${roomGeneration}`;
      if (next !== roomKey) { roomKey = next; watermark = 0; consumed.clear(); admittedAt.length = 0; }
    }
    function prune(nowMs) {
      watermark = Math.max(watermark, nowMs);
      for (const [id, expiresAt] of consumed) if (expiresAt <= nowMs) consumed.delete(id);
      while (admittedAt.length && admittedAt[0] <= nowMs - 1000) admittedAt.shift();
    }
    function suppressed(eventId, reason, fallbackSoundId = '') {
      return Object.freeze({ status: 'suppressed', eventId, reason, preserveFallback: true, fallbackSoundId });
    }
    function admit(event, policy = {}) {
      if (!event || typeof event.eventId !== 'string' || !event.eventId ||
          typeof event.roomId !== 'string' || !event.roomId ||
          !Number.isInteger(event.roomGeneration) || event.roomGeneration < 0 ||
          !Number.isSafeInteger(event.frameId) || event.frameId < 0 ||
          !Number.isFinite(event.eventAtMs) || event.eventAtMs < 0 ||
          !Number.isFinite(event.nowMs) || event.nowMs < 0 ||
          !Number.isFinite(event.volume) || event.volume < 0 || event.volume > 1)
        throw new TypeError('Sunbeam SFX requires source event/frame, generation, timing and spatial volume');
      enterRoom(event.roomId, event.roomGeneration);
      prune(event.nowMs);
      const identity = `sunbeam:${event.eventId}`;
      const sound = event.soundReceipt;
      const fallbackSoundId = typeof sound?.soundId === 'string' ? sound.soundId : '';
      if (consumed.has(identity)) return suppressed(event.eventId, 'duplicate-event', fallbackSoundId);
      if (watermark - event.eventAtMs > retentionMs || consumed.size >= maxEntries)
        return suppressed(event.eventId, 'event-expired-or-ledger-capacity', fallbackSoundId);
      consumed.set(identity, Math.max(event.nowMs, event.eventAtMs + maxLateMs) + retentionMs);
      const effect = event.effectReceipt, frame = event.visibleSubmittedReceipt;
      if (event.type !== 'flora-sunbeam' || !VARIANTS.includes(event.variant) ||
          typeof event.sunbeamCausalId !== 'string' || !event.sunbeamCausalId ||
          typeof event.sourcePlayerId !== 'string' || !event.sourcePlayerId || event.phase !== 'playing')
        return suppressed(event.eventId, 'source-or-variant-invalid', fallbackSoundId);
      if (effect?.eventId !== event.eventId || effect?.type !== 'flora-sunbeam' ||
          effect?.variant !== event.variant || effect?.sunbeamCausalId !== event.sunbeamCausalId ||
          effect?.sourcePlayerId !== event.sourcePlayerId ||
          frame?.eventId !== event.eventId || frame?.sunbeamCausalId !== event.sunbeamCausalId ||
          frame?.frameId !== event.frameId || frame?.roomGeneration !== event.roomGeneration ||
          frame?.submitted !== true || frame?.mainFrameVisible !== true || frame?.drawn !== true ||
          frame?.visibleToListener !== true || !Number.isInteger(frame?.handCount) ||
          frame.handCount < 1 || frame.handCount > 2)
        return suppressed(event.eventId, 'no-matching-causal-visible-submission', fallbackSoundId);
      if (sound?.type !== 'sunbeam' || sound?.sunbeamCausalId !== event.sunbeamCausalId ||
          sound?.ownerId !== event.sourcePlayerId || sound?.sourceKind !== 'magic' || !fallbackSoundId)
        return suppressed(event.eventId, 'fallback-causal-id-missing-or-mismatched', fallbackSoundId);
      const listenerId = String(event.listenerId || '');
      if (!listenerId || frame?.listenerId !== listenerId || frame?.sourcePlayerId !== event.sourcePlayerId ||
          frame?.sourceVisibleToListener !== true ||
          (event.sourceInvisible === true && listenerId !== event.sourcePlayerId))
        return suppressed(event.eventId, 'source-not-visible-to-listener', fallbackSoundId);
      if (policy.pageHidden === true || policy.muted === true ||
          policy.sensoryBlocked === true || policy.audible === false || event.volume <= 0)
        return suppressed(event.eventId, 'audio-policy-or-out-of-range', fallbackSoundId);
      if (event.nowMs < event.eventAtMs || event.nowMs - event.eventAtMs > maxLateMs)
        return suppressed(event.eventId, 'late-event', fallbackSoundId);
      if (admittedAt.length >= maxCuesPerSecond)
        return suppressed(event.eventId, 'rate-limit', fallbackSoundId);
      admittedAt.push(event.nowMs);
      const reduced = policy.reducedMotion === true;
      const gainScale = Math.min(1, event.volume) * (reduced ? .76 : 1), timeScale = reduced ? .86 : 1;
      const layers = LAYERS.map(layer => {
        const offsetMs = Math.round(layer.offsetMs * timeScale);
        const durationMs = Math.max(28, Math.round(layer.durationMs * timeScale));
        return Object.freeze({ ...layer, amplitude: Math.min(MAX_GAIN, layer.amplitude * gainScale),
          offsetMs, durationMs, startAtMs: event.eventAtMs + offsetMs,
          endAtMs: event.eventAtMs + offsetMs + durationMs });
      });
      const durationMs = Math.max(...layers.map(layer => layer.offsetMs + layer.durationMs));
      if (durationMs > MAX_CUE_MS) throw new Error('Sunbeam E SFX exceeded finite cue bound');
      return Object.freeze({ status: 'candidate', family: 'flora-sunbeam-e', cue: 'sunbeam-gather-illuminate-converge',
        eventId: event.eventId, sunbeamCausalId: event.sunbeamCausalId, roomId: event.roomId,
        roomGeneration: event.roomGeneration, frameId: event.frameId, sourcePlayerId: event.sourcePlayerId,
        variant: event.variant, handCount: frame.handCount, loop: false, maxGain: MAX_GAIN,
        reducedMotion: reduced, startsAtMs: event.eventAtMs, endsAtMs: event.eventAtMs + durationMs,
        replaceFallback: true,
        fallbackReceipt: Object.freeze({ soundId: fallbackSoundId, sunbeamCausalId: event.sunbeamCausalId }),
        layers: Object.freeze(layers) });
    }
    return Object.freeze({ admit, enterRoom, has: id => consumed.has(`sunbeam:${id}`),
      size: () => consumed.size, rateSize: () => admittedAt.length });
  }
  const api = Object.freeze({ MAX_GAIN, MAX_CUE_MS, MAX_LATE_MS, RETENTION_MS, ENVELOPE,
    MAX_ENTRIES, MAX_CUES_PER_SECOND, VARIANTS, LAYERS, createPlanner });
  root.DvaWebGPUSunbeamESfx = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
