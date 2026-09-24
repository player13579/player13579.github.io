(function (root) {
  'use strict';
  // Bridges one shared finite profile to the game's existing cue player. It
  // owns neither Web Audio nodes nor the AudioContext and never resumes it.
  function createAdapter({ planner = root.DvaWebGPUSunbeamESfx?.createPlanner?.(),
    player, isVerify = () => false } = {}) {
    if (!planner || typeof planner.admit !== 'function' || typeof player?.play !== 'function' ||
        typeof isVerify !== 'function')
      throw new TypeError('Sunbeam cue adapter requires its planner, existing E cue player and verify gate');
    let previewUsed = false;
    function submitGameplay(event, policy = {}) {
      const plan = planner.admit(event, policy);
      if (plan?.status !== 'candidate')
        return Object.freeze({ plan, playback: null, replaceFallback: false,
          fallbackSoundId: plan?.fallbackSoundId || '' });
      const playback = player.play(plan, { nowMs: event.nowMs,
        muted: policy.muted === true, verify: policy.verify === true || isVerify(), volume: 1 });
      const exactFallback = plan.replaceFallback === true &&
        plan.fallbackReceipt?.soundId === event.soundReceipt?.soundId &&
        plan.fallbackReceipt?.sunbeamCausalId === event.sunbeamCausalId &&
        playback?.eventId === plan.eventId && playback?.roomId === plan.roomId &&
        playback?.roomGeneration === plan.roomGeneration;
      const replaceFallback = exactFallback && playback?.status === 'scheduled';
      return Object.freeze({ plan, playback, replaceFallback,
        fallbackSoundId: replaceFallback ? plan.fallbackReceipt.soundId : '' });
    }
    function playPreview({ userGesture = false, previewId = '', roomId = '',
      roomGeneration = 0, nowMs, verify = false, muted = false, volume = .58,
      reducedMotion = false } = {}) {
      if (!userGesture) return Object.freeze({ status: 'suppressed', reason: 'user-gesture-required' });
      if (previewUsed) return Object.freeze({ status: 'suppressed', reason: 'preview-already-consumed' });
      previewUsed = true;
      if (typeof previewId !== 'string' || !previewId || typeof roomId !== 'string' || !roomId ||
          !Number.isInteger(roomGeneration) || roomGeneration < 0 ||
          !Number.isFinite(nowMs) || nowMs < 0 || !Number.isFinite(volume) || volume < 0 || volume > 1)
        throw new TypeError('Sunbeam preview needs identity, room generation, current time and bounded volume');
      const profile = root.DvaWebGPUSunbeamESfx;
      if (!Array.isArray(profile?.LAYERS) || !profile.LAYERS.length)
        throw new Error('Sunbeam E profile is unavailable');
      const gain = Math.min(1, volume) * (reducedMotion ? .76 : 1);
      const scale = reducedMotion ? .86 : 1;
      const layers = profile.LAYERS.map(layer => {
        const offsetMs = Math.round(layer.offsetMs * scale);
        const durationMs = Math.max(28, Math.round(layer.durationMs * scale));
        return Object.freeze({ ...layer, amplitude: Math.min(profile.MAX_GAIN, layer.amplitude * gain),
          offsetMs, durationMs, startAtMs: nowMs + offsetMs, endAtMs: nowMs + offsetMs + durationMs });
      });
      const endsAtMs = Math.max(...layers.map(layer => layer.endAtMs));
      const cue = Object.freeze({ status: 'candidate', family: 'flora-sunbeam-e',
        cue: 'sunbeam-gather-illuminate-converge', eventId: `sunbeam-preview:${previewId}`,
        roomId, roomGeneration, startsAtMs: nowMs, endsAtMs, loop: false,
        maxGain: profile.MAX_GAIN, reducedMotion, preview: true, layers: Object.freeze(layers) });
      const forcedVerify = verify === true || isVerify();
      const playback = player.play(cue, { nowMs, muted: muted === true, verify: forcedVerify, volume: 1 });
      return Object.freeze({ status: playback?.status || 'suppressed', reason: playback?.reason || '',
        cue, playback, preview: true, verify: forcedVerify, replaceFallback: false });
    }
    return Object.freeze({ submitGameplay, playPreview, hasPreview: () => previewUsed });
  }
  const api = Object.freeze({ createAdapter });
  root.DvaWebGPUSunbeamCueAdapter = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
