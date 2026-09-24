/* Heal E candidate: self body restoration, SP refill, status release, timed acceleration.
 * Procedural WebGPU only. The caller owns authoritative event admission and SFX. */
(function (root) {
  'use strict';
  const TYPE = 'flora';
  const CAST_MS = 1860;
  const ACCEL_MS = 12000;
  const BODY = Object.freeze({ width: 112, height: 118, centerYOffset: -28, pad: 18 });
  const finite = Number.isFinite;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  function plan({ effect, player, now, camera, zoom, viewport, reducedMotion = false,
    accelerationUntil } = {}) {
    if (effect?.type !== TYPE || !effect.id ||
        String(effect.playerId) !== String(player?.id)) return null;
    if (![player?.x, player?.y, now, effect.startedAt, camera?.x, camera?.y,
      zoom, viewport?.width, viewport?.height].every(finite) || zoom <= 0 ||
      viewport.width <= 0 || viewport.height <= 0) return null;
    const elapsed = now - effect.startedAt;
    if (elapsed < 0 || elapsed >= ACCEL_MS ||
        (finite(effect.duration) && elapsed >= effect.duration)) return null;
    const accelerationActive = finite(accelerationUntil) && now < accelerationUntil;
    if (elapsed >= CAST_MS && !accelerationActive) return null;
    const cx = (player.x - camera.x) * zoom;
    const cy = (player.y + BODY.centerYOffset - camera.y) * zoom;
    const width = BODY.width * zoom, height = BODY.height * zoom, pad = BODY.pad * zoom;
    const rect = { x: cx - width / 2 - pad, y: cy - height / 2 - pad,
      width: width + 2 * pad, height: height + 2 * pad };
    if (rect.x + rect.width < 0 || rect.y + rect.height < 0 ||
        rect.x > viewport.width || rect.y > viewport.height) return null;
    return Object.freeze({ effectId: String(effect.id), ownerId: String(player.id),
      sourceKind: 'flora-heal', soundCauseId: String(effect.id),
      elapsedMs: elapsed, castProgress: clamp(elapsed / CAST_MS, 0, 1),
      accelerationActive, reducedMotion: Boolean(reducedMotion), rect,
      worldCenter: { x: player.x, y: player.y + BODY.centerYOffset } });
  }

  const shader = String.raw`struct Uniforms {
  rect: vec4f,
  screen: vec4f, // viewport width, height, seconds since casting, reduced-motion flag
  state: vec4f, // acceleration active, casting seconds, acceleration seconds, reserved
  reserved: vec4f,
};
@group(0) @binding(0) var<uniform> u: Uniforms;

struct VertexOut { @builtin(position) position: vec4f, @location(0) uv: vec2f };
@vertex fn vs_main(@builtin(vertex_index) index: u32) -> VertexOut {
  let corners = array<vec2f, 6>(vec2f(0.0,0.0), vec2f(1.0,0.0), vec2f(0.0,1.0),
    vec2f(0.0,1.0), vec2f(1.0,0.0), vec2f(1.0,1.0));
  let q = corners[index];
  let pixel = u.rect.xy + q * u.rect.zw;
  var out: VertexOut;
  out.position = vec4f(pixel.x / u.screen.x * 2.0 - 1.0, 1.0 - pixel.y / u.screen.y * 2.0, 0.0, 1.0);
  out.uv = q;
  return out;
}

fn window(t: f32, start: f32, peak: f32, end: f32) -> f32 {
  return smoothstep(start, peak, t) * (1.0 - smoothstep(peak, end, t));
}
fn band(d: f32, halfWidth: f32, feather: f32) -> f32 {
  return 1.0 - smoothstep(halfWidth, halfWidth + feather, abs(d));
}
fn over(back: vec4f, front: vec4f) -> vec4f {
  return front + back * (1.0 - front.a);
}
fn ink(color: vec3f, opacity: f32, emission: f32) -> vec4f {
  let a = clamp(opacity, 0.0, 0.90);
  // The E must emit light. Allow the lit core above its alpha while keeping
  // the wide halo translucent, so its source is visible at gameplay size.
  return vec4f(color * min(a + emission, 1.35), a);
}
fn capsule(p: vec2f, a: vec2f, b: vec2f) -> f32 {
  let q = p - a;
  let v = b - a;
  return length(q - v * clamp(dot(q, v) / max(dot(v,v), 0.0001), 0.0, 1.0));
}
@fragment fn fs_main(in: VertexOut) -> @location(0) vec4f {
  // Local body space: unit torso width, y grows downward; the centre remains open.
  let p = (in.uv - vec2f(0.5,0.5)) * vec2f(2.18, 2.04);
  let t = u.screen.z;
  let reduced = u.screen.w > 0.5;
  let casting = t < u.state.y;
  var result = vec4f(0.0);

  // PH-H1: two opposing tissue seams contract to the sternum, then close.
  // Meso geometry has a cut centre and staggered upper/lower branches.
  let contraction = 1.0 - smoothstep(0.08, 0.82, t);
  let seamX = 0.19 * contraction;
  let torso = 1.0 - smoothstep(0.68, 0.76, abs(p.y + 0.02));
  let lateral = 1.0 - smoothstep(0.43, 0.48, abs(p.x));
  let branch = 0.055 * sin((p.y + 0.52) * 7.0 + 1.2);
  let seam = band(abs(p.x - branch) - seamX, 0.020, 0.013) * torso * lateral;
  let seamPhase = window(t, 0.0, 0.34, 0.94);
  let seamA = seam * seamPhase * (1.0 - 0.23 * smoothstep(0.6, 0.9, t));
  if (casting) { result = over(result, ink(vec3f(0.24,0.94,0.68), seamA * 0.82, seamA * 0.30)); }

  // Two broad, staggered contour currents visibly wrap the healing body.
  let currentA = abs(p.x - (0.56 + 0.09 * sin(p.y * 2.8 + t * 4.0)));
  let currentB = abs(p.x + (0.56 + 0.09 * sin(p.y * 2.8 - t * 3.4 + 1.0)));
  let currents = (1.0 - smoothstep(0.032, 0.073, min(currentA, currentB))) *
    (1.0 - smoothstep(0.70, 0.82, abs(p.y))) * window(t, 0.04, 0.56, 1.48);
  if (casting) {
    result = over(result, ink(vec3f(0.07,0.49,0.36), currents * 0.35, currents * 0.11));
    let currentCore = (1.0 - smoothstep(0.009, 0.028, min(currentA, currentB))) *
      (1.0 - smoothstep(0.65, 0.78, abs(p.y))) * window(t, 0.08, 0.55, 1.38);
    result = over(result, ink(vec3f(0.30,1.0,0.78), currentCore * 0.67, currentCore * 0.42));
  }

  // PH-H2: broad replenishment front climbs from the abdomen to the chest.
  // The filled column is thin in alpha, while the leading meniscus carries light.
  let front = 0.63 - clamp((t - 0.19) / 0.71, 0.0, 1.0) * 1.18;
  let waist = 0.28 + 0.08 * (1.0 - abs(p.y));
  let inside = 1.0 - smoothstep(waist, waist + 0.05, abs(p.x));
  let fill = inside * smoothstep(front - 0.04, front + 0.05, p.y);
  let frontEdge = band(p.y - front, 0.025, 0.027) * inside;
  let refillPhase = window(t, 0.16, 0.51, 1.07);
  if (casting) {
    result = over(result, ink(vec3f(0.055,0.43,0.49), fill * refillPhase * 0.17, fill * refillPhase * 0.025));
    result = over(result, ink(vec3f(0.34,1.0,0.83), frontEdge * refillPhase * 0.82, frontEdge * refillPhase * 0.38));
  }

  // PH-H3: adverse status leaves the body as two finite, broken side slivers.
  // They travel outward once and disappear; they are not a permanent halo.
  let clearTravel = clamp((t - 0.46) / 0.50, 0.0, 1.0);
  let clearX = 0.35 + 0.31 * clearTravel;
  let clearY = -0.32 + 0.06 * clearTravel;
  let sliverL = capsule(p, vec2f(-clearX, clearY-0.11), vec2f(-clearX-0.055, clearY+0.10));
  let sliverR = capsule(p, vec2f(clearX, clearY-0.11), vec2f(clearX+0.055, clearY+0.10));
  let sliver = (1.0 - smoothstep(0.013,0.029,min(sliverL,sliverR))) *
    window(t,0.42,0.63,1.12);
  if (casting) { result = over(result, ink(vec3f(0.66,0.88,1.0), sliver * 0.68, sliver * 0.24)); }

  // PH-H4: acceleration is a narrow pair of body-side flow guides. Their
  // direction follows world motion only through the caller's player position;
  // no invented impact, target, or screen-space afterimage is drawn.
  if (u.state.x > 0.5) {
    let longFade = 1.0 - smoothstep(10.8, 12.0, t);
    let side = abs(p.x);
    let guide = band(side - (0.43 + 0.025 * sin(t * 3.0)), 0.012, 0.018) *
      (1.0 - smoothstep(0.54,0.75,abs(p.y))) * longFade;
    let accent = select(0.64 + 0.18 * sin(t * 4.4 - p.y * 3.2), 0.72, reduced);
    result = over(result, ink(vec3f(0.20,0.86,0.76), guide * 0.55 * accent,
      guide * 0.22 * accent));
  }

  // OBS-H1: source-bound, close bloom only where the seam/front already emits.
  // It cannot invent a ring or wash the sprite centre into an opaque white mass.
  if (casting) {
    let glowSeam = band(abs(p.x - branch) - seamX, 0.055, 0.070) * torso * lateral * seamPhase;
    let glowFront = band(p.y - front, 0.075, 0.085) * inside * refillPhase;
    let glowCurrents = (1.0 - smoothstep(0.03, 0.13, min(currentA,currentB))) *
      (1.0 - smoothstep(0.62, 0.84, abs(p.y))) * window(t,0.05,0.58,1.45);
    let nearGlow = clamp(glowSeam + glowFront + glowCurrents, 0.0, 1.0) * 0.22;
    result = over(result, ink(vec3f(0.13,0.72,0.54), nearGlow, nearGlow * 0.36));
  }
  return result;
}
`;

  function create({ renderer, frameOwner = renderer } = {}) {
    if (frameOwner?.state !== 'ready' || !frameOwner.device?.createShaderModule ||
        !frameOwner.device?.queue?.writeBuffer || !frameOwner.own || !frameOwner.release)
      throw new TypeError('Heal E requires the shared WebGPU frame owner');
    const device = frameOwner.device, format = frameOwner.format;
    const module = device.createShaderModule({ label: 'DVA Heal E WGSL', code: shader });
    const bindGroupLayout = device.createBindGroupLayout({ entries: [{ binding: 0,
      visibility: 0x1 | 0x2, buffer: { type: 'uniform' } }] });
    const layout = device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] });
    const blend = { color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
      alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' } };
    const pipeline = device.createRenderPipeline({ label: 'DVA Heal E', layout,
      vertex: { module, entryPoint: 'vs_main' },
      fragment: { module, entryPoint: 'fs_main', targets: [{ format, blend }] },
      primitive: { topology: 'triangle-list' } });
    let compileState = module.getCompilationInfo ? 'pending' : 'ready';
    const ready = module.getCompilationInfo ? Promise.resolve().then(() => module.getCompilationInfo())
      .then(info => {
        const errors = info.messages?.filter(item => item.type === 'error') || [];
        if (errors.length) throw new Error(`Heal WGSL compilation failed: ${errors.map(x => x.message).join(' | ')}`);
        compileState = 'ready';
      }).catch(error => { compileState = 'failed'; throw error; }) : Promise.resolve();
    void ready.catch(() => {});
    const slots = [], indices = new WeakMap();
    let destroyed = false;
    function slot(index) {
      if (slots[index]) return slots[index];
      const uniform = frameOwner.own(device.createBuffer({
        label: `DVA Heal E parameters ${index}`, size: 64, usage: 0x40 | 0x08 }));
      const bindGroup = device.createBindGroup({ layout: bindGroupLayout,
        entries: [{ binding: 0, resource: { buffer: uniform } }] });
      return (slots[index] = { uniform, bindGroup });
    }
    function record({ frame, target, viewport, planned } = {}) {
      if (destroyed || frameOwner.state !== 'ready') throw new Error('Heal E pass destroyed or unavailable');
      if (compileState !== 'ready') throw new Error('Heal WGSL shader is not ready');
      if (!frame || typeof frame.stage !== 'function' || typeof frame.add !== 'function' ||
          typeof target !== 'string' || !target || !viewport ||
          ![viewport.width, viewport.height, viewport.pixelWidth, viewport.pixelHeight].every(finite) ||
          viewport.width <= 0 || viewport.height <= 0 ||
          !Number.isInteger(viewport.pixelWidth) || !Number.isInteger(viewport.pixelHeight) ||
          viewport.pixelWidth <= 0 || viewport.pixelHeight <= 0)
        throw new TypeError('Heal E needs ordered frame, target, and logical/physical viewport');
      const effects = (Array.isArray(planned) ? planned : [planned]).filter(Boolean);
      if (!effects.length) return { drawn: 0, effects, passes: 0 };
      if (effects.length > 16) throw new RangeError('Heal E supports at most 16 simultaneous instances');
      const sx = viewport.pixelWidth / viewport.width, sy = viewport.pixelHeight / viewport.height;
      const base = indices.get(frame) || 0;
      if (base + effects.length > 16) throw new RangeError('Heal E frame exceeds 16 instances');
      frame.stage('flora-heal-e');
      effects.forEach((effect, offset) => {
        if (!finite(effect.elapsedMs) || !effect.rect ||
            ![effect.rect.x, effect.rect.y, effect.rect.width, effect.rect.height].every(finite))
          throw new TypeError('Heal E needs a valid planned effect');
        const { uniform, bindGroup } = slot(base + offset);
        const left = effect.rect.x * sx, top = effect.rect.y * sy;
        const width = effect.rect.width * sx, height = effect.rect.height * sy;
        const values = new Float32Array(16);
        values.set([left, top, width, height], 0);
        values.set([viewport.pixelWidth, viewport.pixelHeight, effect.elapsedMs / 1000,
          effect.reducedMotion ? 1 : 0], 4);
        values.set([effect.accelerationActive ? 1 : 0, CAST_MS / 1000,
          ACCEL_MS / 1000, 1], 8);
        device.queue.writeBuffer(uniform, 0, values);
        const x = clamp(Math.floor(left), 0, viewport.pixelWidth);
        const y = clamp(Math.floor(top), 0, viewport.pixelHeight);
        const right = clamp(Math.ceil(left + width), 0, viewport.pixelWidth);
        const bottom = clamp(Math.ceil(top + height), 0, viewport.pixelHeight);
        if (right <= x || bottom <= y) throw new Error('Heal E has no visible target footprint');
        frame.add({ target, label: `DVA Heal E ${effect.effectId}`,
          encode(pass, info) {
            if (info.device !== device || info.format !== format ||
                info.width !== viewport.pixelWidth || info.height !== viewport.pixelHeight)
              throw new Error('Heal E target device, format or backing size mismatch');
            pass.setScissorRect(x, y, right - x, bottom - y);
            pass.setPipeline(pipeline);
            pass.setBindGroup(0, bindGroup);
            pass.draw(6);
          } });
      });
      indices.set(frame, base + effects.length);
      return { drawn: effects.length, effects, passes: effects.length };
    }
    return Object.freeze({ device, shader, ready, record,
      get state() { return destroyed ? 'destroyed' : compileState; },
      destroy() {
        if (destroyed) return;
        destroyed = true;
        for (const { uniform } of slots) if (frameOwner.release(uniform)) uniform.destroy();
      } });
  }
  const api = Object.freeze({ TYPE, CAST_MS, ACCEL_MS, BODY, shader, plan, create });
  root.DvaWebGPUHealE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
