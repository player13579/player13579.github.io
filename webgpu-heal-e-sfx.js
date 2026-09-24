(function (root) {
  'use strict';

  const MAX_LATE_MS = 180;
  const MAX_VOICES = 5;
  const MAX_GAIN = 0.075;
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

  function makePlan(event, startAtMs) {
    const phases = [
      { id: 'reconstruction-intake', startOffsetMs: 0, endOffsetMs: 140,
        sound: 'soft-filtered-reverse-air', amplitude: 0.027 },
      { id: 'warm-rising-body', startOffsetMs: 110, endOffsetMs: 560,
        sound: 'warm-rising-harmonics-granular', amplitude: 0.075 },
      { id: 'resolving-shimmer', startOffsetMs: 500, endOffsetMs: 900,
        sound: 'clean-resolving-shimmer-tail', amplitude: 0.032 }
    ].map(phase => Object.freeze({ ...phase,
      startAtMs: startAtMs + phase.startOffsetMs,
      endAtMs: startAtMs + phase.endOffsetMs }));
    return Object.freeze({ kind: EVENT_KIND, eventId: identity(event), sourceEventId: event.eventId,
      roomId: event.roomId, roomGeneration: event.roomGeneration, startsAtMs: startAtMs,
      endsAtMs: startAtMs + 900, phases: Object.freeze(phases) });
  }

  function plan(event, policy = {}) {
    if (!validEvent(event)) throw new TypeError('Heal E SFX needs an identified self-restoration event');
    const nowMs = policy.nowMs;
    if (!Number.isFinite(nowMs) || nowMs < 0) throw new TypeError('Heal E SFX needs current event time');
    if (policy.nowVisible === false || policy.hidden === true || policy.muted === true ||
        policy.sensory === true || policy.available === false || Number(policy.volume ?? 1) <= 0)
      return null;
    if (nowMs < event.eventAtMs || nowMs - event.eventAtMs > MAX_LATE_MS) return null;
    // verify marks a route; it is intentionally not an audio suppression policy.
    return makePlan(event, event.eventAtMs);
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
      const tone = (frequency, endFrequency, amplitude, duration, type = 'sine', offset = 0) => {
        if (scheduledVoices >= MAX_VOICES) return;
        const osc = context.createOscillator(); osc.type = type;
        const gain = context.createGain();
        const at = start + offset / 1000;
        osc.frequency.setValueAtTime(frequency, at);
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), at + duration);
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(amplitude, at + Math.min(0.05, duration * 0.22));
        // Gentle, uneven 24 ms amplitude grains keep the body fluid rather than beep-like.
        const grainStep = 0.024;
        for (let t = grainStep; t < duration - 0.035; t += grainStep) {
          const grain = ((Math.floor(t / grainStep) % 3) === 1) ? 0.86 : 1;
          gain.gain.setValueAtTime(Math.max(0.0001, amplitude * grain), at + t);
        }
        gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
        osc.connect(gain); gain.connect(master); osc.start(at); osc.stop(at + duration + 0.01);
        graphNodes.push(osc, gain); trackSource(osc);
      };
      // Intake: noise swells toward the listener through a rising, narrowing band.
      const bufferSize = Math.max(128, Math.floor(context.sampleRate * 0.12));
      const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
      const samples = buffer.getChannelData(0);
      let seed = (event.eventId.length * 2654435761) >>> 0;
      for (let i = 0; i < bufferSize; i += 1) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        samples[i] = ((seed / 4294967296) * 2 - 1) * (i / bufferSize);
      }
      const air = context.createBufferSource(); air.buffer = buffer;
      const filter = context.createBiquadFilter(); filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, start);
      filter.frequency.exponentialRampToValueAtTime(1750, start + 0.105);
      filter.frequency.exponentialRampToValueAtTime(980, start + 0.14);
      const airGain = context.createGain(); airGain.gain.setValueAtTime(0.0001, start);
      airGain.gain.exponentialRampToValueAtTime(0.027, start + 0.07);
      airGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);
      air.connect(filter); filter.connect(airGain); airGain.connect(master);
      air.start(start); air.stop(start + 0.145);
      graphNodes.push(air, filter, airGain); trackSource(air);
      // Warm rising harmonic body with a restrained, low-level grain pulse.
      tone(196, 392, 0.075, 0.45, 'sine', 110);
      tone(293.66, 587.33, 0.026, 0.38, 'triangle', 110);
      // Resolving upper partials form a brief, clear shimmer and decay.
      tone(783.99, 1046.5, 0.022, 0.31, 'sine', 500);
      tone(1174.66, 1567.98, 0.01, 0.26, 'sine', 540);
      if (scheduledVoices > MAX_VOICES) throw new Error('Heal E SFX voice budget exceeded');
      return cue;
    }
    return Object.freeze({ plan: admit, play, has(event) { return validEvent(event) && consumed.has(identity(event)); },
      size() { return consumed.size; } });
  }

  const api = Object.freeze({ MAX_LATE_MS, MAX_VOICES, EVENT_KIND, plan, createPlayer });
  root.DvaHealESfx = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
