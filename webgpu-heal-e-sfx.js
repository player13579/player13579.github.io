(function (root) {
  'use strict';

  const MAX_LATE_MS = 180;
  const MAX_VOICES = 5;
  const MAX_GAIN = 0.075;
  const CUE_DURATION_MS = 900;
  const LAST_VOICE_END_MS = 810;
  const MIN_AUDIBLE_TAIL_MS = 30;
  const EVENT_KIND = 'self-restoration';

  function validEvent(event) {
    return event && event.kind === EVENT_KIND && event.self === true &&
      typeof event.eventId === 'string' && event.eventId.length > 0 &&
      typeof event.roomId === 'string' && event.roomId.length > 0 &&
      Number.isInteger(event.roomGeneration) && event.roomGeneration >= 0 &&
      Number.isFinite(event.eventAtMs) && event.eventAtMs >= 0;
  }

  function identity(event) {
    return `${event.roomId}:${event.roomGeneration}:${event.eventId}`;
  }

  function makePlan(event, startAtMs, actorTimeScale = 1, visualElapsedMs = 0) {
    const wallProgressMs = visualElapsedMs / actorTimeScale;
    const wallTime = visualMs => visualMs / actorTimeScale;
    const rawPhases = [
      { id: 'reconstruction-intake', startOffsetMs: 0, endOffsetMs: 140,
        sound: 'soft-filtered-reverse-air', amplitude: 0.027 },
      { id: 'warm-rising-body', startOffsetMs: 110, endOffsetMs: 560,
        sound: 'warm-rising-harmonics-granular', amplitude: 0.075 },
      { id: 'resolving-shimmer', startOffsetMs: 500, endOffsetMs: CUE_DURATION_MS,
        sound: 'clean-resolving-shimmer-tail', amplitude: 0.032 }
    ];
    const phases = rawPhases.flatMap(phase => {
      const phaseStart = wallTime(phase.startOffsetMs);
      const phaseEnd = wallTime(phase.endOffsetMs);
      if (phaseEnd <= wallProgressMs) return [];
      const absoluteStart = Math.max(phaseStart, wallProgressMs);
      return [Object.freeze({ ...phase,
        // At elapsed zero these retain the original offsets exactly. For a
        // progressed cast, only the current/future parts of the envelope remain.
        startOffsetMs: Math.max(0, absoluteStart - wallProgressMs),
        endOffsetMs: phaseEnd - wallProgressMs,
        elapsedAtStartMs: Math.max(0, visualElapsedMs - phase.startOffsetMs),
        startAtMs: startAtMs + Math.max(0, absoluteStart - wallProgressMs),
        endAtMs: startAtMs + phaseEnd - wallProgressMs })];
    });
    const endsAtMs = startAtMs + wallTime(CUE_DURATION_MS) - wallProgressMs;
    return Object.freeze({ kind: EVENT_KIND, eventId: identity(event), sourceEventId: event.eventId,
      roomId: event.roomId, roomGeneration: event.roomGeneration, startsAtMs: startAtMs,
      endsAtMs, actorTimeScale, visualElapsedMs, phases: Object.freeze(phases) });
  }

  function plan(event, policy = {}) {
    if (!validEvent(event)) throw new TypeError('Heal E SFX needs an identified self-restoration event');
    const nowMs = policy.nowMs;
    if (!Number.isFinite(nowMs) || nowMs < 0) throw new TypeError('Heal E SFX needs current event time');
    if (policy.nowVisible === false || policy.hidden === true || policy.muted === true ||
        policy.sensory === true || policy.available === false || Number(policy.volume ?? 1) <= 0)
      return null;
    const synchronized = Number.isFinite(policy.visualElapsedMs) && policy.visualElapsedMs >= 0;
    if (Number.isFinite(policy.actorTimeScale) && policy.actorTimeScale <= 0) return null;
    const actorTimeScale = Number.isFinite(policy.actorTimeScale) && policy.actorTimeScale > 0
      ? Math.min(8, Math.max(0.125, policy.actorTimeScale)) : 1;
    const visualElapsedMs = synchronized ? policy.visualElapsedMs : 0;
    // Avoid firing a residual fragment too short to hear at the current wall rate.
    if (synchronized && (LAST_VOICE_END_MS - visualElapsedMs) / actorTimeScale < MIN_AUDIBLE_TAIL_MS) return null;
    if (nowMs < event.eventAtMs || (!synchronized && nowMs - event.eventAtMs > MAX_LATE_MS)) return null;
    // verify marks a route; it is intentionally not an audio suppression policy.
    return makePlan(event, synchronized ? nowMs : event.eventAtMs, actorTimeScale, visualElapsedMs);
  }

  function createPlayer({ getAudioContext, getMasterGain, nowMs = () => 0,
    maxEntries = 2048, retentionMs = 30000 } = {}) {
    if (typeof getAudioContext !== 'function' || typeof getMasterGain !== 'function' ||
        typeof nowMs !== 'function' || !Number.isInteger(maxEntries) || maxEntries < 16 ||
        !Number.isFinite(retentionMs) || retentionMs <= MAX_LATE_MS)
      throw new TypeError('Heal E SFX player requires getters and valid ledger limits');
    const consumed = new Map();
    let roomKey = '';

    function prune(now) {
      for (const [key, expiry] of consumed) if (expiry <= now) consumed.delete(key);
    }
    function admit(event, policy = {}) {
      if (!validEvent(event)) throw new TypeError('Heal E SFX needs an identified self-restoration event');
      const key = `${event.roomId}:${event.roomGeneration}`;
      if (roomKey !== key) { roomKey = key; consumed.clear(); }
      const now = Number.isFinite(policy.nowMs) ? policy.nowMs : nowMs();
      prune(now);
      const id = identity(event);
      if (consumed.has(id)) return null;
      if (consumed.size >= maxEntries) return null;
      // Consume every first observation, even muted/hidden/sensory/late/unavailable.
      consumed.set(id, Math.max(now, event.eventAtMs) + retentionMs);
      return plan(event, { ...policy, nowMs: now,
        available: policy.available !== false && Boolean(getAudioContext()) && Boolean(getMasterGain()) });
    }
    function play(event, policy = {}) {
      const cue = admit(event, policy);
      if (!cue) return null;
      const context = getAudioContext();
      const master = getMasterGain();
      if (!context || !master || context.state !== 'running') return null;
      const current = Number.isFinite(policy.nowMs) ? policy.nowMs : nowMs();
      const lateMs = Math.max(0, current - cue.startsAtMs);
      if (lateMs > MAX_LATE_MS) return null;
      const start = context.currentTime + Math.max(0, cue.startsAtMs - current) / 1000;
      const graphNodes = [];
      const sources = [];
      let scheduledVoices = 0;
      let endedVoices = 0;
      let cleaned = false;
      const cleanGraph = () => {
        if (cleaned || endedVoices < scheduledVoices) return;
        cleaned = true;
        for (const node of graphNodes) {
          try { node.disconnect(); } catch (_) { /* already disconnected by host */ }
        }
      };
      const trackSource = source => {
        scheduledVoices += 1;
        sources.push(source);
        source.onended = () => { endedVoices += 1; cleanGraph(); };
      };
      const tone = (frequency, endFrequency, amplitude, duration, type = 'sine', offset = 0,
        elapsedAtStartMs = 0, visualDurationMs = duration * cue.actorTimeScale) => {
        if (scheduledVoices >= MAX_VOICES) return;
        const progress = Math.min(1, Math.max(0, elapsedAtStartMs / visualDurationMs));
        const startFrequency = frequency * Math.pow(endFrequency / frequency, progress);
        const osc = context.createOscillator(); osc.type = type;
        const gain = context.createGain();
        const at = start + offset / 1000;
        osc.frequency.setValueAtTime(startFrequency, at);
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), at + duration);
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(amplitude,
          at + Math.min(0.05 / cue.actorTimeScale, duration * 0.22));
        // Gentle, uneven 24 ms amplitude grains keep the body fluid rather than beep-like.
        const grainStep = 0.024 / cue.actorTimeScale;
        for (let t = grainStep; t < duration - 0.035; t += grainStep) {
          const grain = ((Math.floor(t / grainStep) % 3) === 1) ? 0.86 : 1;
          gain.gain.setValueAtTime(Math.max(0.0001, amplitude * grain), at + t);
        }
        gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
        osc.connect(gain); gain.connect(master); osc.start(at); osc.stop(at + duration + 0.01);
        graphNodes.push(osc, gain); trackSource(osc);
      };
      // Intake: noise swells toward the listener through a rising, narrowing band.
      const intake = cue.phases.find(phase => phase.id === 'reconstruction-intake');
      if (intake) {
      const bufferSize = Math.max(128, Math.floor(context.sampleRate * 0.14));
      const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
      const samples = buffer.getChannelData(0);
      let seed = (event.eventId.length * 2654435761) >>> 0;
      for (let i = 0; i < bufferSize; i += 1) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        samples[i] = ((seed / 4294967296) * 2 - 1) * (i / bufferSize);
      }
      const air = context.createBufferSource(); air.buffer = buffer;
      air.playbackRate.value = cue.actorTimeScale;
      const filter = context.createBiquadFilter(); filter.type = 'lowpass';
      const airProgress = Math.min(1, intake.elapsedAtStartMs / 140);
      const remaining = (intake.endOffsetMs - intake.startOffsetMs) / 1000;
      const at = start + intake.startOffsetMs / 1000;
      const filterStart = 420 * Math.pow(1750 / 420, Math.min(1, airProgress / 0.75));
      filter.frequency.setValueAtTime(filterStart, at);
      filter.frequency.exponentialRampToValueAtTime(1750, at + Math.max(0.001, remaining * 0.75));
      filter.frequency.exponentialRampToValueAtTime(980, at + remaining);
      const airGain = context.createGain(); airGain.gain.setValueAtTime(0.0001, at);
      airGain.gain.exponentialRampToValueAtTime(0.027, at + Math.min(0.07, remaining * 0.5));
      airGain.gain.exponentialRampToValueAtTime(0.0001, at + remaining);
      air.connect(filter); filter.connect(airGain); airGain.connect(master);
      // Natural buffer completion now aligns with the 140 ms actor-time gain fade.
      air.start(at, Math.min(0.139, intake.elapsedAtStartMs / 1000));
      graphNodes.push(air, filter, airGain); trackSource(air);
      }
      // Warm rising harmonic body with a restrained, low-level grain pulse.
      const body = cue.phases.find(phase => phase.id === 'warm-rising-body');
      if (body) {
        const offset = body.startOffsetMs / 1000;
        if (body.elapsedAtStartMs < 450) {
          tone(196, 392, 0.075, (450 - body.elapsedAtStartMs) / cue.actorTimeScale / 1000,
            'sine', offset, body.elapsedAtStartMs, 450);
        }
        if (body.elapsedAtStartMs < 380) {
          tone(293.66, 587.33, 0.026, (380 - body.elapsedAtStartMs) / cue.actorTimeScale / 1000,
            'triangle', offset, body.elapsedAtStartMs, 380);
        }
      }
      // Resolving upper partials form a brief, clear shimmer and decay.
      const shimmer = cue.phases.find(phase => phase.id === 'resolving-shimmer');
      if (shimmer) {
        const elapsed = shimmer.elapsedAtStartMs;
        const offset = shimmer.startOffsetMs / 1000;
        if (elapsed < 310) {
          tone(783.99, 1046.5, 0.022, (310 - elapsed) / cue.actorTimeScale / 1000,
            'sine', offset, elapsed, 310);
        }
        const secondElapsed = Math.max(0, elapsed - 40);
        const secondOffset = offset + Math.max(0, (40 - elapsed) / cue.actorTimeScale) / 1000;
        if (secondElapsed < 260) {
          tone(1174.66, 1567.98, 0.01, (260 - secondElapsed) / cue.actorTimeScale / 1000,
            'sine', secondOffset, secondElapsed, 260);
        }
      }
      if (scheduledVoices > MAX_VOICES) throw new Error('Heal E SFX voice budget exceeded');
      return cue;
    }
    return Object.freeze({ plan: admit, play, has(event) { return validEvent(event) && consumed.has(identity(event)); },
      size() { return consumed.size; } });
  }

  const api = Object.freeze({ MAX_LATE_MS, MAX_VOICES, MIN_AUDIBLE_TAIL_MS,
    LAST_VOICE_END_MS, EVENT_KIND, plan, createPlayer });
  root.DvaHealESfx = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
