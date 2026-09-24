(function (root) {
  'use strict';

  const finite = Number.isFinite;
  const SOURCES = Object.freeze({
    environment: Object.freeze({ owner: 'tickMedicalRoomWebGPUSfx', radius: 660, periodic: true }),
    fixture: Object.freeze({ owner: 'tickMedicalRoomWebGPUSfx', radius: 550, periodic: true }),
    'upload-d': Object.freeze({ owner: 'tickMedicalRoomWebGPUSfx', radius: 600, periodic: false }),
    'diagnostic-bed': Object.freeze({ owner: 'server-pushSound-playSound-medicalBedUse', radius: 600, periodic: false }),
    'herbal-cabinet': Object.freeze({ owner: 'server-pushSound-playSound-medicalCabinetUse', radius: 600, periodic: false }),
    'footbath-use': Object.freeze({ owner: 'server-pushSound-playSound-medicalFootBathUse', radius: 600, periodic: false })
  });
  const ENV_PERIODS = Object.freeze({ 'medical:bath': 8000, 'medical:daylight': 13000 });
  const FIXTURE_RE = /^medical:fixture:([^:]+):(\d+)$/;
  const PREFIX = Object.freeze({ 'diagnostic-bed': 'medical:diagnostic-bed:',
    'herbal-cabinet': 'medical:herbal-cabinet:', 'footbath-use': 'medical:footbath-use:',
    'upload-d': 'medical:upload-d:' });

  function createAdapter({ maxLateMs = 250, maxReceipts = 512 } = {}) {
    if (!finite(maxLateMs) || maxLateMs < 0 || !Number.isInteger(maxReceipts) || maxReceipts < 16)
      throw new TypeError('Invalid medical E cue adapter limits');
    let roomKey = '';
    const oneShots = new Set(), periodic = new Set();
    const order = [];
    function enterRoom(roomId, roomGeneration) {
      if (typeof roomId !== 'string' || !roomId || !Number.isInteger(roomGeneration) || roomGeneration < 0)
        throw new TypeError('Medical E cue adapter needs room ID and generation');
      const next = `${roomId}:${roomGeneration}`;
      if (next !== roomKey) { roomKey = next; oneShots.clear(); periodic.clear(); order.length = 0; }
    }
    function convert({ source, cue, roomId, roomGeneration, previousNow, now,
      eventAtMs, listener, audible = true, muted = false, verify = false,
      visible = true, sensoryBlocked = false, phase = 'playing', mapId = 'station',
      maxDistance, replaceExistingOwner = '' } = {}) {
      if (!Object.hasOwn(SOURCES, source) || !cue || typeof cue.id !== 'string' || !cue.id ||
          typeof roomId !== 'string' || !roomId || !Number.isInteger(roomGeneration) || roomGeneration < 0 ||
          ![previousNow, now].every(finite) || previousNow < 0 || now < previousNow ||
          (listener && ![listener.x, listener.y].every(finite)))
        throw new TypeError('Medical E cue adapter needs source, planned cue, room generation, interval and listener');
      enterRoom(roomId, roomGeneration);
      const config = SOURCES[source];
      if (replaceExistingOwner !== config.owner)
        return receipt(cue, roomId, roomGeneration, 'owned-elsewhere', config.owner, 0);
      if (mapId !== 'station' || !['playing', 'meeting'].includes(phase))
        return receipt(cue, roomId, roomGeneration, 'suppressed', 'not-active-medical-room', 0);

      const coordinates = cue.x != null && cue.y != null && finite(cue.x) && finite(cue.y);
      const distanceLimit = maxDistance === undefined ? config.radius : maxDistance;
      if (!finite(distanceLimit) || distanceLimit <= 0) throw new TypeError('Invalid medical E cue distance');
      if (!coordinates || !listener || !finite(listener.x) || !finite(listener.y))
        return receipt(cue, roomId, roomGeneration, 'suppressed', 'missing-world-position', 0);
      const dx = cue.x - listener.x, dy = cue.y - listener.y;
      const distance = Math.hypot(dx, dy);
      if (distance >= distanceLimit)
        return receipt(cue, roomId, roomGeneration, 'suppressed', 'outside-audible-radius', 0);
      if (now === previousNow || now - previousNow > 250)
        return receipt(cue, roomId, roomGeneration, 'suppressed', 'stale-or-empty-poll', 0);

      const keyInfo = config.periodic ? periodicIdentity(source, cue, previousNow, now) : null;
      let identity, startsAtMs;
      if (config.periodic) {
        if (!keyInfo) return receipt(cue, roomId, roomGeneration, 'suppressed', 'missing-period-occurrence', 0);
        identity = `${source}:${cue.id}:${keyInfo.at}`;
        startsAtMs = keyInfo.at;
        if (startsAtMs <= previousNow || startsAtMs > now)
          return receipt(cue, roomId, roomGeneration, 'suppressed', 'outside-current-poll-window', 0);
        if (periodic.has(identity)) return null;
        periodic.add(identity);
      } else {
        if (!startsWithSource(source, cue.id)) return receipt(cue, roomId, roomGeneration, 'suppressed', 'cue-source-mismatch', 0);
        if (!finite(eventAtMs) || eventAtMs < 0)
          return receipt(cue, roomId, roomGeneration, 'suppressed', 'missing-event-time', 0);
        identity = `${source}:${cue.id}`;
        startsAtMs = eventAtMs;
        if (!(previousNow < eventAtMs && eventAtMs <= now))
          return receipt(cue, roomId, roomGeneration, 'suppressed', 'outside-current-poll-window', 0);
        if (oneShots.has(identity)) return null;
        oneShots.add(identity);
      }
      remember(identity);
      const suppressed = !audible || muted || verify || !visible || sensoryBlocked || now - previousNow > 250;
      if (suppressed) return receipt(cue, roomId, roomGeneration, 'suppressed', 'audio-policy-or-stale-poll', 0, identity);
      if (now > startsAtMs + maxLateMs)
        return receipt(cue, roomId, roomGeneration, 'suppressed', 'event-too-late', 0, identity);

      const from = Number(cue.frequencyFrom ?? cue.frequency);
      const to = Number(cue.frequencyTo ?? cue.frequency);
      const durationMs = Number(cue.duration) * 1000;
      const rawGain = Number(cue.gain);
      if (![from, to, durationMs, rawGain].every(finite) || from <= 0 || to <= 0 ||
          from > 12000 || to > 12000 || durationMs <= 0 || durationMs > 700 || rawGain <= 0 || rawGain > .025)
        return receipt(cue, roomId, roomGeneration, 'suppressed', 'invalid-finite-cue', 0, identity);
      const proximityGain = (1 - distance / distanceLimit) ** 2;
      const baseAmplitude = Math.min(.025, rawGain) * proximityGain;
      const layers = [Object.freeze({ shape: cue.waveform === 'triangle' ? 'triangle' : 'sine',
        frequencyHz: from, endFrequencyHz: to, amplitude: baseAmplitude,
        offsetMs: 0, durationMs, startAtMs: startsAtMs, endAtMs: startsAtMs + durationMs })];
      const character = String(cue.character || cue.kind || '');
      const noiseMix = finite(cue.noiseMix) ? cue.noiseMix : cue.noise ? .32 :
        character === 'linen-herbal-rustle' ? .28 : 0;
      if (noiseMix > 0) layers.push(Object.freeze({ shape: 'noise', frequencyHz: from,
        endFrequencyHz: to, amplitude: baseAmplitude * Math.min(.6, noiseMix),
        offsetMs: 0, durationMs: Math.min(durationMs, 250),
        startAtMs: startsAtMs, endAtMs: startsAtMs + Math.min(durationMs, 250) }));
      const endsAtMs = Math.max(...layers.map(layer => layer.endAtMs));
      return Object.freeze({ family: 'medical', eventId: identity, sourceEventId: cue.id,
        source, owner: config.owner, roomId, roomGeneration, x: cue.x, y: cue.y,
        spatial: Object.freeze({ x: cue.x, y: cue.y, distance, pan: clamp(dx / distanceLimit, -1, 1) }),
        startsAtMs, endsAtMs, layers: Object.freeze(layers),
        completionReceipt: Object.freeze({ eventId: identity, roomId, roomGeneration, endsAtMs }) });
    }
    function remember(identity) {
      order.push(identity);
      while (order.length > maxReceipts) {
        const old = order.shift(); oneShots.delete(old); periodic.delete(old);
      }
    }
    return Object.freeze({ convert, enterRoom,
      has(identity) { return oneShots.has(identity) || periodic.has(identity); },
      sizes() { return Object.freeze({ oneShot: oneShots.size, periodic: periodic.size }); }
    });
  }

  function periodicIdentity(source, cue, previousNow, now) {
    if (source === 'environment') {
      const period = ENV_PERIODS[cue.id];
      if (!period) return null;
      return { at: Math.floor(now / period) * period };
    }
    const match = FIXTURE_RE.exec(cue.id);
    if (source === 'fixture' && match) {
      const at = Number(match[2]);
      return finite(at) ? { at } : null;
    }
    return null;
  }
  function startsWithSource(source, id) {
    const prefix = PREFIX[source];
    return Boolean(prefix && id.startsWith(prefix));
  }
  function receipt(cue, roomId, roomGeneration, status, reason, layerCount, eventId = cue.id) {
    return Object.freeze({ eventId, sourceEventId: cue.id, roomId, roomGeneration,
      status, reason, layerCount, endsAtMs: null });
  }
  function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }
  const api = Object.freeze({ SOURCES, ENV_PERIODS, createAdapter });
  root.DvaWebGPUMedicalECueAdapter = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
