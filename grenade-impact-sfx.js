/* Finite, deterministic grenade landing sounds. The app owns the server event:
 * call play once when a new impact id is accepted, never from a render frame.
 * No context creation, resume, timer, asset fetch, or loop is performed here. */
(function (root) {
  'use strict';
  const TAU = Math.PI * 2;
  const KINDS = Object.freeze({
    'grenade-frag-impact': Object.freeze({ duration: .78, gain: .48, seed: 0x6d2b79f5 }),
    'grenade-stun-impact': Object.freeze({ duration: .62, gain: .38, seed: 0x2f831a47 })
  });
  const buffers = new WeakMap();
  const clamp = (x, min, max) => Math.max(min, Math.min(max, x));

  function render(kind, sampleRate = 48000) {
    const profile = KINDS[kind];
    if (!profile) throw new RangeError(`Unknown grenade impact SFX: ${kind}`);
    if (!Number.isFinite(sampleRate) || sampleRate < 22050 || sampleRate > 192000) {
      throw new RangeError('Grenade impact sample rate must be 22050–192000 Hz');
    }
    const count = Math.round(sampleRate * profile.duration);
    const pcm = new Float32Array(count);
    let seed = profile.seed, low = 0, mid = 0, previous = 0, dc = 0;
    const lowStep = 1 - Math.exp(-TAU * 190 / sampleRate);
    const midStep = 1 - Math.exp(-TAU * 2300 / sampleRate);
    for (let i = 0; i < count; i += 1) {
      const t = i / sampleRate;
      seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
      const noise = (seed >>> 0) / 2147483648 - 1;
      low += lowStep * (noise - low);
      mid += midStep * (noise - mid);
      const band = mid - low, bright = noise - mid;
      let value;
      if (kind === 'grenade-frag-impact') {
        // A hard shell rupture, heavy pressure wave, then sparse metal/earth
        // debris. The sub-bass sweep carries force without extending the tail.
        const crack = Math.exp(-t * 69) * (.51 * bright + .29 * band);
        const thump = Math.exp(-t * 13) * (.43 * Math.sin(TAU * (115 * t - 83 * t * t))
          + .17 * Math.sin(TAU * (58 * t - 35 * t * t)));
        const dust = Math.exp(-t * 9.5) * (.13 * band + .035 * bright);
        let debris = 0;
        for (const hit of [.075, .139, .224, .318]) {
          const dt = t - hit;
          if (dt >= 0) debris += Math.exp(-dt * 77) *
            (.075 * bright + .036 * Math.sin(TAU * (580 + hit * 1040) * dt));
        }
        value = crack + thump + dust + debris;
      } else {
        // Stun has a dry electric snap and a bright, rapidly falling charge
        // ring. Its thin low pulse and intermittent arcs differ from frag.
        const snap = Math.exp(-t * 88) * (.32 * bright + .17 * band);
        const phase = TAU * (1620 * t - 1170 * t * t);
        const charge = Math.exp(-t * 11.5) *
          (.21 * Math.sin(phase + .34 * Math.sin(TAU * 107 * t))
            + .095 * Math.sin(phase * 1.98) + .075 * band);
        const pulse = Math.exp(-t * 23) * .095 * Math.sin(TAU * (185 * t - 44 * t * t));
        let arcs = 0;
        for (const hit of [.048, .102, .174, .258]) {
          const dt = t - hit;
          if (dt >= 0) arcs += Math.exp(-dt * 115) * (.105 * bright + .04 * band);
        }
        value = snap + charge + pulse + arcs;
      }
      // Sub-millisecond onset and a smooth finite tail avoid waveform clicks.
      const attack = Math.min(1, t / .0008);
      const release = Math.min(1, (count - 1 - i) / Math.max(1, sampleRate * .045));
      value *= attack * release;
      // A 24 Hz DC blocker prevents low-frequency bias from asymmetric noise.
      const highPassed = value - previous + Math.exp(-TAU * 24 / sampleRate) * dc;
      previous = value; dc = highPassed;
      pcm[i] = highPassed;
    }
    // Stable headroom across rates without changing the authored envelope.
    let peak = 0;
    for (const sample of pcm) peak = Math.max(peak, Math.abs(sample));
    const scale = peak > 0 ? .72 / peak : 0;
    for (let i = 0; i < count; i += 1) pcm[i] *= scale;
    pcm[0] = 0; pcm[count - 1] = 0;
    return pcm;
  }

  function play(context, master, kind, options = {}) {
    if (!KINDS[kind]) throw new RangeError(`Unknown grenade impact SFX: ${kind}`);
    const volume = options.volume === undefined ? 1 : Number(options.volume);
    const panValue = options.pan === undefined ? 0 : Number(options.pan);
    if (!Number.isFinite(volume) || !Number.isFinite(panValue)) return null;
    if (options.muted || options.sensoryBlocked ||
        !context || !master || context.state !== 'running' ||
        !(Number(master.gain?.value) > 0) || volume <= 0 ||
        !Number.isFinite(context.sampleRate) || context.sampleRate < 22050 ||
        context.sampleRate > 192000) return null;
    let cache = buffers.get(context);
    if (!cache) { cache = new Map(); buffers.set(context, cache); }
    let buffer = cache.get(kind);
    if (!buffer) {
      const pcm = render(kind, context.sampleRate);
      buffer = context.createBuffer(1, pcm.length, context.sampleRate);
      buffer.getChannelData(0).set(pcm);
      cache.set(kind, buffer);
    }
    const source = context.createBufferSource();
    const gain = context.createGain();
    const panner = typeof context.createStereoPanner === 'function'
      ? context.createStereoPanner() : null;
    let ended = false;
    const cleanup = () => {
      if (ended) return;
      ended = true;
      source.onended = null;
      source.disconnect(); gain.disconnect();
      if (panner) panner.disconnect();
    };
    try {
      source.buffer = buffer;
      source.loop = false;
      gain.gain.setValueAtTime(KINDS[kind].gain * clamp(volume, 0, 1), context.currentTime);
      source.connect(gain);
      if (panner) {
        panner.pan.value = clamp(panValue, -1, 1);
        gain.connect(panner); panner.connect(master);
      } else gain.connect(master);
      source.onended = cleanup;
      source.start(context.currentTime);
    } catch (error) {
      cleanup();
      throw error;
    }
    return Object.freeze({ kind, stop() {
      if (ended) return;
      try { source.stop(context.currentTime); } catch (_) { cleanup(); }
    } });
  }

  const api = Object.freeze({ render, play });
  root.DvaGrenadeImpactSfx = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
