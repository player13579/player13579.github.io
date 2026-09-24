(function (root) {
  'use strict';

  const PROFILES = Object.freeze({
    'action-warp:arrival': Object.freeze({ cue: 'warp-arrival', layers: [
      ['sine', 196, 98, .052, 0, 176, 'warp-low-fold'],
      ['triangle', 392, 294, .027, 20, 132, 'warp-mid-arrival'],
      ['noise', 540, 310, .009, 0, 38, 'brief-warp-air']
    ] }),
    'hacker-status-recover:cleared': Object.freeze({ cue: 'hacker-status-cleared', layers: [
      ['sine', 147, 220, .044, 0, 156, 'recovery-low-release'],
      ['triangle', 294, 440, .025, 24, 120, 'recovery-mid-clear']
    ] }),
    'gbo-overdrive:throw': Object.freeze({ cue: 'gbo-throw-overdrive', layers: [
      ['sine', 73, 110, .058, 0, 190, 'gbo-throw-low-rise'],
      ['triangle', 220, 330, .03, 18, 146, 'gbo-throw-mid-rise'],
      ['noise', 450, 290, .009, 0, 40, 'brief-throw-air']
    ] }),
    'gbo-overdrive:heavy-use': Object.freeze({ cue: 'gbo-heavy-overdrive', layers: [
      ['sine', 58, 82, .064, 0, 205, 'gbo-heavy-low-rise'],
      ['triangle', 174, 246, .031, 24, 158, 'gbo-heavy-mid-rise'],
      ['noise', 390, 250, .01, 6, 42, 'brief-heavy-air']
    ] }),
    'gbo-overdrive:destroyed': Object.freeze({ cue: 'gbo-weapon-destruction', layers: [
      ['sine', 110, 55, .058, 0, 210, 'gbo-break-low-fall'],
      ['triangle', 330, 165, .03, 7, 154, 'gbo-break-mid-fall'],
      ['noise', 520, 300, .009, 0, 40, 'brief-break-air']
    ] })
  });
  const SHARED_TYPES = Object.freeze({
    'transfer-in': 'webgpu-e-event-acquisition-cue',
    'transfer-out': 'paired-transfer-in-event',
    'hacker-root': 'webgpu-operator-e-sfx-owner',
    flora: 'flora-heal-body-gain-sfx',
    'flora-sunbeam': 'webgpu-operator-e-sfx-owner'
  });
  const SHARED_GBO_PREFIXES = Object.freeze({
    'invention-use:invention:': 'invention-world-sfx',
    'magazine-commit:weapon:': 'gunshot-world-sfx',
    'slash:orichalcum-sword': 'fighter-slash-world-sfx'
  });
  const REJECTED = Object.freeze({
    'action-warp:': 'warp-origin-effect-paired-with-arrival',
    'hacker-status-recover:unchanged': 'recovery-made-no-change'
  });
  const LIMITS = Object.freeze({ maxLayers: 3, maxDurationMs: 220,
    maxAmplitudePerLayer: .065, maxAmplitudePerCue: .11, maxCuesPerSecond: 8 });

  function profileFor(event) {
    const key = `${event.type}:${event.variant}`;
    if (Object.hasOwn(PROFILES, key)) return PROFILES[key];
    if (event.type === 'gbo-overdrive') {
      const variant = event.variant;
      if (/^throw:(?:[a-z0-9-]+|(?:invention|weapon|heavy):[a-z0-9-]+)$/.test(variant))
        return PROFILES['gbo-overdrive:throw'];
      if (/^heavy-use:heavy:[a-z0-9-]+$/.test(variant)) return PROFILES['gbo-overdrive:heavy-use'];
      if (/^destroyed:weapon:[a-z0-9-]+$/.test(variant)) return PROFILES['gbo-overdrive:destroyed'];
      for (const [prefix, owner] of Object.entries(SHARED_GBO_PREFIXES)) {
        if (variant.startsWith(prefix)) return { sharedSfxKind: owner };
      }
      if (variant.startsWith('destroyed:')) return { suppressed: true,
        reason: 'unsupported-gbo-destruction-source' };
    }
    if (REJECTED[key]) return { suppressed: true, reason: REJECTED[key] };
    if (event.type === 'action-warp') return { suppressed: true,
      reason: REJECTED['action-warp:'] };
    return null;
  }

  function createLedger({ maxEntries = 2048, retentionMs = 30000, maxLateMs = 180,
    maxCuesPerSecond = LIMITS.maxCuesPerSecond } = {}) {
    if (!Number.isInteger(maxEntries) || maxEntries < 16 || !Number.isFinite(retentionMs) ||
        !Number.isFinite(maxLateMs) || maxLateMs < 0 || retentionMs < maxLateMs ||
        !Number.isInteger(maxCuesPerSecond) || maxCuesPerSecond < 1 || maxCuesPerSecond > 16)
      throw new TypeError('Invalid transfer/operator E SFX limits');
    let roomKey = '';
    let watermark = 0;
    const consumed = new Map();
    const recentCues = [];
    function enterRoom(roomId, roomGeneration) {
      if (typeof roomId !== 'string' || !roomId || !Number.isInteger(roomGeneration) || roomGeneration < 0)
        throw new TypeError('Transfer/operator E SFX needs room ID and generation');
      const key = `${roomId}:${roomGeneration}`;
      if (roomKey !== key) { roomKey = key; watermark = 0; consumed.clear(); recentCues.length = 0; }
    }
    function prune(nowMs) {
      watermark = Math.max(watermark, nowMs);
      for (const [id, expiry] of consumed) if (expiry <= nowMs) consumed.delete(id);
      while (recentCues.length && recentCues[0] <= nowMs - 1000) recentCues.shift();
    }
    function admit(event, { audible = true, verify = false, reducedMotion = false } = {}) {
      if (!event || typeof event.eventId !== 'string' || !event.eventId || typeof event.type !== 'string' ||
          typeof event.variant !== 'string' || typeof event.roomId !== 'string' || !event.roomId ||
          !Number.isInteger(event.roomGeneration) || event.roomGeneration < 0 ||
          !Number.isFinite(event.eventAtMs) || event.eventAtMs < 0 ||
          !Number.isFinite(event.nowMs) || event.nowMs < 0)
        throw new TypeError('Transfer/operator E SFX requires event ID, variant, room and time');
      enterRoom(event.roomId, event.roomGeneration);
      prune(event.nowMs);
      const id = `transfer-operator:${event.eventId}`;
      if (watermark - event.eventAtMs > retentionMs || consumed.has(id) || consumed.size >= maxEntries) return null;
      consumed.set(id, Math.max(event.nowMs, event.eventAtMs + maxLateMs) + retentionMs);
      const meta = { eventId: event.eventId, type: event.type, variant: event.variant,
        roomId: event.roomId, roomGeneration: event.roomGeneration };
      if (event.submittedReceipt !== true)
        return Object.freeze({ ...meta, suppressed: true, reason: 'missing-server-submission-receipt' });
      if (SHARED_TYPES[event.type]) return Object.freeze({ ...meta, suppressed: true,
        reason: 'shared-existing-cue-owner', sharedSfxKind: SHARED_TYPES[event.type] });
      const selected = profileFor(event);
      if (selected?.sharedSfxKind) return Object.freeze({ ...meta, suppressed: true,
        reason: 'shared-existing-world-sfx-owner', sharedSfxKind: selected.sharedSfxKind });
      if (selected?.suppressed) return Object.freeze({ ...meta, suppressed: true, reason: selected.reason });
      if (!selected) throw new TypeError(`Unsupported transfer/operator E SFX event: ${event.type}:${event.variant}`);
      if (event.visibleToListener !== true)
        return Object.freeze({ ...meta, suppressed: true, reason: 'outside-visible-observation-scope' });
      if (!audible || event.nowMs > event.eventAtMs + maxLateMs) return null;
      if (recentCues.length >= maxCuesPerSecond) return null;
      const scale = reducedMotion ? .72 : 1;
      const layers = selected.layers.map(([shape, frequencyHz, endFrequencyHz, amplitude, offsetMs, durationMs, layer]) => {
        const offset = Math.round(offsetMs * scale), duration = Math.max(28, Math.round(durationMs * scale));
        return Object.freeze({ shape, frequencyHz, endFrequencyHz, amplitude, layer,
          offsetMs: offset, durationMs: duration, startAtMs: event.eventAtMs + offset,
          endAtMs: event.eventAtMs + offset + duration });
      });
      if (layers.length > LIMITS.maxLayers || layers.some(layer => layer.amplitude > LIMITS.maxAmplitudePerLayer ||
          layer.durationMs > LIMITS.maxDurationMs) ||
          layers.reduce((sum, layer) => sum + layer.amplitude, 0) > LIMITS.maxAmplitudePerCue)
        throw new RangeError('Transfer/operator E SFX profile exceeds finite audio limits');
      recentCues.push(event.nowMs);
      const endsAtMs = Math.max(...layers.map(layer => layer.endAtMs));
      return Object.freeze({ family: 'transfer-operator-e', cue: selected.cue, ...meta,
        startsAtMs: event.eventAtMs, endsAtMs, layers: Object.freeze(layers),
        completionReceipt: Object.freeze({ eventId: event.eventId, roomId: event.roomId,
          roomGeneration: event.roomGeneration, endsAtMs }) });
    }
    return Object.freeze({ admit, enterRoom, has: id => consumed.has(`transfer-operator:${id}`),
      size: () => consumed.size, activeCuesInWindow: () => recentCues.length });
  }
  const api = Object.freeze({ PROFILES, SHARED_TYPES, SHARED_GBO_PREFIXES, REJECTED,
    LIMITS, createLedger });
  root.DvaWebGPUTransferOperatorESfx = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
