(function (root) {
  'use strict';

  const BOTTLE_ITEMS = new Set(['mercury', 'lead', 'mineral-water', 'seawater',
    'antidote', 'molotov', 'ice', 'heated-water']);
  const BOTTLE_PROFILES = Object.freeze({
    mercury: ['bottle-shard-mercury', [
      ['sine', 146, 82, .042, 0, 165, 'low-container-crack'],
      ['triangle', 294, 220, .021, 10, 112, 'metal-glass-body'],
      ['noise', 520, 320, .008, 0, 38, 'brief-shard-scatter']]],
    lead: ['bottle-shard-lead', [
      ['sine', 98, 62, .052, 0, 180, 'heavy-low-crack'],
      ['triangle', 196, 147, .021, 18, 125, 'heavy-container-body']]],
    'mineral-water': ['bottle-shard-mineral-water', [
      ['sine', 164, 110, .038, 0, 150, 'water-container-crack'],
      ['triangle', 328, 246, .022, 13, 115, 'water-glass-body'],
      ['noise', 480, 280, .008, 0, 34, 'brief-liquid-shard']]],
    seawater: ['bottle-shard-seawater', [
      ['sine', 131, 87, .042, 0, 158, 'saltwater-low-crack'],
      ['triangle', 262, 196, .021, 12, 110, 'saltwater-glass-body']]],
    antidote: ['bottle-shard-antidote', [
      ['sine', 185, 123, .037, 0, 145, 'antidote-low-crack'],
      ['triangle', 370, 277, .022, 12, 108, 'antidote-glass-body']]],
    molotov: ['bottle-shard-molotov', [
      ['sine', 110, 73, .05, 0, 175, 'molotov-low-crack'],
      ['triangle', 220, 165, .022, 10, 120, 'molotov-glass-body'],
      ['noise', 550, 310, .01, 0, 44, 'brief-fuse-glass-scatter']]],
    ice: ['bottle-shard-ice', [
      ['sine', 220, 147, .038, 0, 138, 'ice-low-fracture'],
      ['triangle', 440, 330, .022, 12, 104, 'ice-fracture-body'],
      ['noise', 590, 350, .008, 0, 31, 'brief-ice-grit']]],
    'heated-water': ['bottle-shard-heated-water', [
      ['sine', 156, 104, .04, 0, 150, 'heated-water-low-crack'],
      ['triangle', 312, 234, .022, 12, 108, 'heated-water-glass-body']]]
  });
  const RIGID_PROFILES = Object.freeze({
    sword: ['rigid-sword-impact', [
      ['sine', 110, 72, .053, 0, 190, 'sword-low-contact'],
      ['triangle', 440, 294, .025, 5, 132, 'short-metal-contact'],
      ['noise', 620, 360, .008, 0, 34, 'brief-blade-air']]],
    firearm: ['rigid-firearm-impact', [
      ['sine', 98, 65, .05, 0, 178, 'firearm-low-contact'],
      ['triangle', 294, 220, .024, 7, 124, 'firearm-body-contact']]],
    invention: ['rigid-invention-impact', [
      ['sine', 123, 82, .048, 0, 170, 'invention-low-contact'],
      ['triangle', 369, 277, .024, 8, 126, 'invention-body-contact']]],
    heavy: ['rigid-heavy-impact', [
      ['sine', 82, 55, .058, 0, 205, 'heavy-low-contact'],
      ['triangle', 246, 184, .025, 10, 142, 'heavy-body-contact']]],
    rigid: ['rigid-item-impact', [
      ['sine', 131, 87, .046, 0, 162, 'rigid-low-contact'],
      ['triangle', 262, 196, .023, 9, 118, 'rigid-body-contact']]]
  });
  const SHARED_TYPES = Object.freeze({
    'grenade-frag-impact': 'dedicated-grenade-impact-sfx',
    'grenade-stun-impact': 'dedicated-grenade-impact-sfx',
    // Every ice landing also submits bottle-shards at the same location; that
    // event owns the single ice-container shatter cue.
    'quantum-ice-impact': 'paired-bottle-shards-impact-cue'
  });
  const LIMITS = Object.freeze({ maxLayers: 3, maxDurationMs: 210,
    maxAmplitudePerLayer: .06, maxAmplitudePerCue: .11, maxCuesPerSecond: 8 });

  function profileFor(type, variant) {
    if (type === 'bottle-shards') {
      const match = /^(mercury|lead|mineral-water|seawater|antidote|molotov|ice|heated-water):\d+$/.exec(variant);
      return match ? BOTTLE_PROFILES[match[1]] : null;
    }
    if (type === 'rigid-item-impact') {
      const match = /^(?:gbo:)?(sword|firearm|invention|heavy|rigid):(blade|safe-side|body):\d+\.\d{2}:luck-\d+\.\d{2}$/.exec(variant);
      if (!match) return null;
      return RIGID_PROFILES[match[1]];
    }
    return null;
  }

  function createLedger({ maxEntries = 2048, retentionMs = 30000, maxLateMs = 180,
    maxCuesPerSecond = LIMITS.maxCuesPerSecond } = {}) {
    if (!Number.isInteger(maxEntries) || maxEntries < 16 || !Number.isFinite(retentionMs) ||
        !Number.isFinite(maxLateMs) || maxLateMs < 0 || retentionMs < maxLateMs ||
        !Number.isInteger(maxCuesPerSecond) || maxCuesPerSecond < 1 || maxCuesPerSecond > 16)
      throw new TypeError('Invalid projectile impact E SFX limits');
    let roomKey = '';
    let watermark = 0;
    const consumed = new Map();
    const recentCues = [];
    function enterRoom(roomId, roomGeneration) {
      if (typeof roomId !== 'string' || !roomId || !Number.isInteger(roomGeneration) || roomGeneration < 0)
        throw new TypeError('Projectile impact E SFX needs room ID and generation');
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
        throw new TypeError('Projectile impact E SFX requires event identity, variant, room generation and time');
      enterRoom(event.roomId, event.roomGeneration);
      prune(event.nowMs);
      const identity = `projectile-impact:${event.eventId}`;
      if (watermark - event.eventAtMs > retentionMs || consumed.has(identity) || consumed.size >= maxEntries)
        return null;
      consumed.set(identity, Math.max(event.nowMs, event.eventAtMs + maxLateMs) + retentionMs);
      const sharedKind = SHARED_TYPES[event.type];
      const meta = { eventId: event.eventId, type: event.type, variant: event.variant,
        roomId: event.roomId, roomGeneration: event.roomGeneration };
      if (sharedKind) return Object.freeze({ ...meta, suppressed: true,
        reason: 'shared-existing-impact-owner', sharedSfxKind: sharedKind });
      const profile = profileFor(event.type, event.variant);
      if (!profile) throw new TypeError(`Unsupported projectile impact E SFX event: ${event.type}:${event.variant}`);
      if (event.visibleToListener !== true)
        return Object.freeze({ ...meta, suppressed: true, reason: 'outside-impact-observation-scope' });
      // The app already plays its generic impact.wav for the local target.
      // The new world cue is reserved for other observers of this same event.
      if (alreadyHeardImpact || (event.type === 'rigid-item-impact' && event.listenerId &&
          String(event.listenerId) === String(event.targetId || '')))
        return Object.freeze({ ...meta, suppressed: true,
          reason: 'shared-local-hit-impact', sharedSfxKind: 'impact-wav' });
      if (!audible || verify || event.nowMs > event.eventAtMs + maxLateMs) return null;
      if (recentCues.length >= maxCuesPerSecond) return null;
      const scale = reducedMotion ? .72 : 1;
      const layers = profile[1].map(([shape, frequencyHz, endFrequencyHz, amplitude, offsetMs, durationMs, layer]) => {
        const offset = Math.round(offsetMs * scale), duration = Math.max(28, Math.round(durationMs * scale));
        return Object.freeze({ shape, frequencyHz, endFrequencyHz,
          amplitude: Math.min(LIMITS.maxAmplitudePerLayer, amplitude), layer,
          offsetMs: offset, durationMs: duration, startAtMs: event.eventAtMs + offset,
          endAtMs: event.eventAtMs + offset + duration });
      });
      if (layers.length > LIMITS.maxLayers || layers.some(layer => layer.durationMs > LIMITS.maxDurationMs) ||
          layers.reduce((sum, layer) => sum + layer.amplitude, 0) > LIMITS.maxAmplitudePerCue)
        throw new RangeError('Projectile impact E SFX profile exceeds audio load limits');
      recentCues.push(event.nowMs);
      const endsAtMs = Math.max(...layers.map(layer => layer.endAtMs));
      return Object.freeze({ family: 'projectile-impact-e', cue: profile[0], ...meta,
        startsAtMs: event.eventAtMs, endsAtMs, layers: Object.freeze(layers),
        // Never echo source, target, or world coordinates in the audio receipt.
        completionReceipt: Object.freeze({ eventId: event.eventId, roomId: event.roomId,
          roomGeneration: event.roomGeneration, endsAtMs }) });
    }
    return Object.freeze({ admit, enterRoom, has: id => consumed.has(`projectile-impact:${id}`),
      size: () => consumed.size, activeCuesInWindow: () => recentCues.length });
  }
  const api = Object.freeze({ BOTTLE_ITEMS, BOTTLE_PROFILES, RIGID_PROFILES,
    SHARED_TYPES, LIMITS, createLedger });
  root.DvaWebGPUProjectileImpactESfx = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
