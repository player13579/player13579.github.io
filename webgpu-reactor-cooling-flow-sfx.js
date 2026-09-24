(function (root) {
  'use strict';

  // Candidate only: this module returns loop data and finite gain operations.
  // The app owns the AudioContext/source, schedules lease/fades, and calls
  // stop() for pagehide/device teardown. No RAF, timer, fetch, or context is made.
  const MAP_ID = 'station';
  const MAP_ROOM_ID = 'reactor';
  const SOURCE_ID = 'reactor-water-caustic-floor';
  const SOURCE_OBJECT_ID = 'v302-reactor-coolingUnit-2';
  const SOURCE_TYPE = 'coolingUnit';
  const LOOP_MS = 2400;
  const MIN_SAMPLE_RATE = 22050;
  const MAX_SAMPLE_RATE = 48000;
  const MAX_GAIN = 0.026;
  const MAX_FRAME_AGE_MS = 180;
  const MAX_FRAME_GAP_MS = 320;
  const ATTACK_MS = 520;
  const RELEASE_MS = 440;
  const MAX_ENTRIES = 2048;

  // Water circulation has a quiet 65–950 Hz body with a soft, non-tonal
  // filtered-noise band. Every partial is an integer cycle in LOOP_MS, making
  // the buffer periodic without a discontinuous loop splice.
  const LOOP_PROFILE = Object.freeze({
    owner: 'reactorCoolingFlow',
    sourceId: SOURCE_ID,
    sourceObjectId: SOURCE_OBJECT_ID,
    loop: true,
    durationMs: LOOP_MS,
    minimumHz: 65,
    maximumHz: 950,
    targetGain: MAX_GAIN,
    maxFrameAgeMs: MAX_FRAME_AGE_MS,
    maxFrameGapMs: MAX_FRAME_GAP_MS,
    loopSeam: 'periodic-fourier-partials'
  });

  function renderLoop(sampleRate = 24000, { reducedMotion = false } = {}) {
    if (!Number.isInteger(sampleRate) || sampleRate < MIN_SAMPLE_RATE || sampleRate > MAX_SAMPLE_RATE)
      throw new RangeError('reactorCoolingFlow sample rate must be 22050–48000 Hz');
    const countFloat = sampleRate * LOOP_MS / 1000;
    if (!Number.isInteger(countFloat)) throw new RangeError('reactorCoolingFlow loop must contain an integer number of samples');
    const count = countFloat;
    const data = new Float32Array(count);
    const periodSeconds = LOOP_MS / 1000;
    const depth = reducedMotion ? 0.06 : 0.18;
    const bands = [];
    // Damped low circulation and an evenly weighted, deterministic band of
    // integer-cycle partials create soft liquid noise without a sharp hiss.
    for (const [hz, amplitude, phase] of [[65, .095, .31], [82.5, .074, 1.27],
      [110, .055, 2.14], [165, .032, .62], [247.5, .018, 2.71]])
      bands.push({ hz, amplitude, phase });
    for (let hz = 110; hz <= 950; hz += 11) {
      const cycles = Math.round(hz * periodSeconds);
      if (cycles < 1) continue;
      let seed = (cycles * 2654435761 + 0x9e3779b9) >>> 0;
      seed = (1664525 * seed + 1013904223) >>> 0;
      const phase = (seed / 4294967296) * Math.PI * 2;
      const weight = hz < 330 ? .0041 : hz < 660 ? .0030 : .00165;
      bands.push({ hz: cycles / periodSeconds, amplitude: weight, phase });
    }
    for (let i = 0; i < count; i += 1) {
      const t = i / sampleRate;
      const slow = 1 + depth * Math.sin(2 * Math.PI * t / periodSeconds);
      let value = 0;
      for (const partial of bands)
        value += Math.sin(2 * Math.PI * partial.hz * t + partial.phase) * partial.amplitude;
      data[i] = value * slow;
    }
    let peak = 0;
    for (const sample of data) peak = Math.max(peak, Math.abs(sample));
    if (peak > .28) {
      const scale = .28 / peak;
      for (let i = 0; i < data.length; i += 1) data[i] *= scale;
    }
    return data;
  }

  function createPlanner({ maxEntries = MAX_ENTRIES, maxFrameAgeMs = MAX_FRAME_AGE_MS,
    maxFrameGapMs = MAX_FRAME_GAP_MS } = {}) {
    if (!Number.isInteger(maxEntries) || maxEntries < 4 || maxEntries > MAX_ENTRIES ||
        !Number.isFinite(maxFrameAgeMs) || maxFrameAgeMs < 0 ||
        !Number.isFinite(maxFrameGapMs) || maxFrameGapMs < ATTACK_MS / 2)
      throw new TypeError('Invalid reactor cooling-flow planner bounds');
    let activeKey = '';
    let lastSessionKey = '', lastFrameId = -1, lastPresentedAtMs = -1, lastGain = 0;
    const receipts = new Map();
    let watermark = 0;

    function prune(nowMs) {
      watermark = Math.max(watermark, nowMs);
      for (const [id, expiry] of receipts) if (expiry <= nowMs) receipts.delete(id);
    }
    function emitStop(reason, nowMs) {
      if (!activeKey) return null;
      const stop = Object.freeze({ action: 'stop', owner: LOOP_PROFILE.owner,
        sourceId: SOURCE_ID, sourceObjectId: SOURCE_OBJECT_ID, ownerKey: activeKey,
        reason, atMs: nowMs, fromGain: lastGain, targetGain: 0,
        releaseMs: RELEASE_MS, releaseDeadlineMs: nowMs + RELEASE_MS,
        finite: true, loop: true });
      activeKey = ''; lastGain = 0;
      return stop;
    }
    function validFrame(frame) {
      const r = frame?.sourceReceipt;
      return frame && Number.isSafeInteger(frame.frameId) && frame.frameId >= 0 &&
        frame.submittedFrame === true && frame.mainFrameVisible === true &&
        frame.mapId === MAP_ID && frame.mapRoomId === MAP_ROOM_ID &&
        typeof frame.roomId === 'string' && frame.roomId.length > 0 &&
        typeof frame.sessionId === 'string' && frame.sessionId.length > 0 &&
        Number.isInteger(frame.roomGeneration) && frame.roomGeneration >= 0 &&
        Number.isFinite(frame.submittedAtMs) && Number.isFinite(frame.nowMs) &&
        frame.submittedAtMs >= 0 && frame.nowMs >= frame.submittedAtMs &&
        r?.submitted === true && r?.visible === true && r?.drawn === true &&
        r.frameId === frame.frameId && r.sourceId === SOURCE_ID &&
        r.sourceObjectId === SOURCE_OBJECT_ID && r.sourceType === SOURCE_TYPE &&
        Number.isFinite(frame.spatialVolume) && frame.spatialVolume > 0 && frame.spatialVolume <= 1;
    }
    function observeFrame(frame, policy = {}) {
      if (!frame || !Number.isFinite(frame.nowMs) || frame.nowMs < 0)
        throw new TypeError('reactorCoolingFlow requires a current submitted-frame observation');
      prune(frame.nowMs);
      const actions = [];
      // Key by the submitted frame identity even when the source receipt is
      // absent on its first observation; a later poll cannot backfill that frame.
      const receiptId = `${frame.roomId || ''}:${frame.roomGeneration ?? ''}:${frame.sessionId || ''}:${frame.frameId ?? ''}:${SOURCE_ID}`;
      if (receipts.has(receiptId))
        return Object.freeze({ actions: Object.freeze([]), ignored: 'duplicate-receipt', owner: LOOP_PROFILE.owner });
      if (receipts.size >= maxEntries)
        return Object.freeze({ actions: Object.freeze([]), ignored: 'receipt-capacity', owner: LOOP_PROFILE.owner });
      receipts.set(receiptId, frame.nowMs + maxFrameGapMs + RELEASE_MS + maxFrameAgeMs);

      const policyBlocked = policy.pageHidden === true || policy.muted === true ||
        policy.sensoryBlocked === true;
      const identityValid = validFrame(frame);
      const nextKey = identityValid
        ? `${frame.roomId}:${frame.roomGeneration}:${frame.sessionId}:${frame.mapId}:${frame.mapRoomId}:${SOURCE_ID}`
        : '';
      if (!identityValid || policyBlocked || frame.nowMs - frame.submittedAtMs > maxFrameAgeMs) {
        const stop = emitStop(policyBlocked ? 'audio-policy' : identityValid ? 'stale-frame' : 'receipt-invalid', frame.nowMs);
        if (stop) actions.push(stop);
        return Object.freeze({ actions: Object.freeze(actions), ignored: stop ? '' :
          (policyBlocked ? 'audio-policy' : identityValid ? 'stale-frame' : 'receipt-invalid'), owner: LOOP_PROFILE.owner });
      }

      const replay = nextKey === lastSessionKey &&
        (frame.frameId <= lastFrameId || frame.submittedAtMs < lastPresentedAtMs);
      const staleGap = Boolean(activeKey) && frame.nowMs - lastPresentedAtMs > maxFrameGapMs;
      if (activeKey && (activeKey !== nextKey || replay || staleGap)) {
        const stop = emitStop(activeKey !== nextKey ? 'session-or-room-change' : replay ? 'stale-frame-order' : 'frame-lease-expired', frame.nowMs);
        if (stop) actions.push(stop);
      }
      if (replay) return Object.freeze({ actions: Object.freeze(actions), ignored: 'stale-frame-order', owner: LOOP_PROFILE.owner });

      const targetGain = Math.min(MAX_GAIN, MAX_GAIN * frame.spatialVolume);
      if (!activeKey) {
        activeKey = nextKey;
        actions.push(Object.freeze({ action: 'start', owner: LOOP_PROFILE.owner,
          sourceId: SOURCE_ID, sourceObjectId: SOURCE_OBJECT_ID, sourceType: SOURCE_TYPE,
          ownerKey: activeKey, loop: true, loopMs: LOOP_MS, loopProfile: LOOP_PROFILE,
          atMs: frame.nowMs, targetGain, attackMs: ATTACK_MS,
          leaseMs: maxFrameGapMs, leaseDeadlineMs: frame.nowMs + maxFrameGapMs,
          reducedMotion: Boolean(frame.reducedMotion), modulationScale: frame.reducedMotion ? .33 : 1,
          stopOnLeaseExpiry: true, contextOwner: 'app-shared-audio-context' }));
      } else {
        actions.push(Object.freeze({ action: 'maintain', owner: LOOP_PROFILE.owner,
          sourceId: SOURCE_ID, ownerKey: activeKey, atMs: frame.nowMs,
          targetGain, rampMs: 180, leaseMs: maxFrameGapMs,
          leaseDeadlineMs: frame.nowMs + maxFrameGapMs,
          reducedMotion: Boolean(frame.reducedMotion), modulationScale: frame.reducedMotion ? .33 : 1,
          restartLoop: false }));
      }
      lastSessionKey = nextKey;
      lastFrameId = frame.frameId;
      lastPresentedAtMs = frame.submittedAtMs;
      lastGain = targetGain;
      return Object.freeze({ actions: Object.freeze(actions), ignored: '', owner: LOOP_PROFILE.owner });
    }
    function stop(reason = 'explicit-stop', nowMs = watermark) {
      if (!Number.isFinite(nowMs) || nowMs < 0) throw new TypeError('Stop requires finite current time');
      prune(nowMs);
      const action = emitStop(String(reason || 'explicit-stop'), nowMs);
      return Object.freeze({ actions: Object.freeze(action ? [action] : []), owner: LOOP_PROFILE.owner });
    }
    return Object.freeze({ observeFrame, stop, loopProfile: LOOP_PROFILE,
      renderLoop, isActive: () => Boolean(activeKey), receiptCount: () => receipts.size });
  }

  const api = Object.freeze({ MAP_ID, MAP_ROOM_ID, SOURCE_ID, SOURCE_OBJECT_ID, SOURCE_TYPE,
    LOOP_MS, MAX_GAIN, MAX_FRAME_AGE_MS, MAX_FRAME_GAP_MS, ATTACK_MS, RELEASE_MS,
    LOOP_PROFILE, renderLoop, createPlanner });
  root.DvaWebGPUReactorCoolingFlowSfx = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
