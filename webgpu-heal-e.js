/* Heal E candidate: self body restoration, SP refill, status release, timed acceleration.
 * Procedural WebGPU only. The caller owns authoritative event admission and SFX. */
(function (root) {
  'use strict';
  const TYPE = 'flora';
  const CAST_MS = 1860;
  const ACCEL_MS = 12000;
  // Authored Heal poses occupy about 45 x 71 world units around the actor's feet.
  // Keep the restoration field on the body; its currents may extend outside it.
  const BODY = Object.freeze({ width: 52, height: 55, centerYOffset: -4, pad: 18 });
  const finite = Number.isFinite;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  function plan({ effect, player, now, camera, zoom, viewport, reducedMotion = false,
    accelerationUntil, visualElapsedMs } = {}) {
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
    if (rect.x + rect.width <= 0 || rect.y + rect.height <= 0 ||
        rect.x >= viewport.width || rect.y >= viewport.height) return null;
    return Object.freeze({ effectId: String(effect.id), ownerId: String(player.id),
      sourceKind: 'flora-heal', soundCauseId: String(effect.id),
      elapsedMs: elapsed, visualElapsedMs: finite(visualElapsedMs) ? Math.max(0, visualElapsedMs) : elapsed,
      castProgress: clamp((finite(visualElapsedMs) ? visualElapsedMs : elapsed) / CAST_MS, 0, 1),
      accelerationActive, reducedMotion: Boolean(reducedMotion), rect,
      worldCenter: { x: player.x, y: player.y + BODY.centerYOffset } });
  }

  const shader = String.raw`struct Uniforms {
  rect: vec4f,
  screen: vec4f, // viewport width, height, actor seconds since casting, reduced-motion flag
  state: vec4f, // acceleration active, casting seconds, wall seconds, reserved
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
  let a = clamp(opacity, 0.0, 1.0);
  // Density, coverage, and emitted radiance are deliberately independent.
  // A bright local source may exceed alpha without dimming every E layer.
  return vec4f(color * (a + max(emission, 0.0)), a);
}
fn capsule(p: vec2f, a: vec2f, b: vec2f) -> f32 {
  let q = p - a;
  let v = b - a;
  return length(q - v * clamp(dot(q, v) / max(dot(v,v), 0.0001), 0.0, 1.0));
}
@fragment fn fs_main(in: VertexOut) -> @location(0) vec4f {
  let p = (in.uv - vec2f(0.5)) * vec2f(2.18, 2.04);
  let t = u.screen.z;
  let wall = u.state.z;
  let reduced = u.screen.w > 0.5;
  let castFade = 1.0 - smoothstep(1.28, 1.86, t);
  var result = vec4f(0.0);

  // PH-H1: a translucent restoration field grows within a body-shaped domain.
  // Shoulder and waist changes in width keep it spatial, never a square gauge.
  let bodyWidth = 0.40 + 0.15 * (1.0 - smoothstep(-0.48, 0.72, p.y));
  // The top follows the raised center of the shoulders instead of cutting a
  // horizontal edge across the actor. A softer curved hem keeps the flow on
  // the body without exposing the scissored quad's rectangular footprint.
  let shoulderRise = 0.58 + 0.18 *
    (1.0 - smoothstep(0.16, 0.52, abs(p.x)));
  let hemDrop = 0.61 + 0.10 *
    (1.0 - smoothstep(0.18, 0.55, abs(p.x)));
  let bodyHeight = (1.0 - smoothstep(shoulderRise - 0.10,
    shoulderRise + 0.08, -p.y)) *
    (1.0 - smoothstep(hemDrop - 0.12, hemDrop + 0.08, p.y));
  let bodyMask = (1.0 - smoothstep(bodyWidth - 0.08, bodyWidth + 0.08, abs(p.x))) * bodyHeight;
  // Keep the restored body present while the front climbs. The earlier bell
  // window erased the whole field halfway through the cast.
  let fieldRise = smoothstep(0.0, 0.28, t) * castFade;

  // PH-H2: the active boundary travels from pelvis toward shoulders.
  // Its curved front is spatially uneven, so no horizontal level bar appears.
  let climb = smoothstep(0.09, 1.25, t);
  let frontY = 0.71 - 1.36 * climb + 0.31 * p.x + 0.17 * sin(5.1 * p.x);
  let reached = smoothstep(frontY - 0.09, frontY + 0.13, p.y) * bodyMask;
  let coreDist = abs(p.y - frontY);
  let frontBody = (1.0 - smoothstep(0.025, 0.22, coreDist)) * bodyMask * fieldRise;
  let frontCore = (1.0 - smoothstep(0.018, 0.068, coreDist)) * bodyMask * fieldRise;
  let lobeA = 1.0 - smoothstep(0.09, 0.26, length((p - vec2f(-0.27, 0.29)) * vec2f(1.0, 0.9)));
  let lobeB = 1.0 - smoothstep(0.09, 0.26, length((p - vec2f(0.24, -0.05)) * vec2f(1.0, 0.9)));
  let lobeC = 1.0 - smoothstep(0.08, 0.24, length((p - vec2f(-0.25, -0.43)) * vec2f(1.0, 0.9)));
  let incomplete = (1.0 - smoothstep(frontY - 0.06, frontY + 0.18, p.y)) *
    bodyMask * fieldRise * clamp(lobeA + lobeB + lobeC, 0.0, 1.0);
  result = over(result, ink(vec3f(0.08, 0.48, 0.40), incomplete * 0.27,
    incomplete * 0.17));
  let joinAB = 1.0 - smoothstep(0.06, 0.16,
    capsule(p, vec2f(-0.27, 0.29), vec2f(0.24, -0.05)));
  let joinBC = 1.0 - smoothstep(0.06, 0.16,
    capsule(p, vec2f(0.24, -0.05), vec2f(-0.25, -0.43)));
  let joined = reached * fieldRise * clamp(joinAB + joinBC, 0.0, 1.0);
  let inward = smoothstep(1.15, 1.72, t);
  let inwardMask = 1.0 - smoothstep(0.34, 0.66, abs(p.x));
  let absorption = mix(1.0, 0.72 + 0.28 * inwardMask, inward);
  let restoredEnvelope = reached * fieldRise *
    (0.55 + 0.35 * smoothstep(0.38, 1.05, t)) * absorption;
  result = over(result, ink(vec3f(0.07, 0.52, 0.43), restoredEnvelope * 0.34,
    restoredEnvelope * 0.10));
  let livingDensity = reached * fieldRise *
    (0.48 + 0.28 * clamp(lobeA + lobeB + lobeC, 0.0, 1.0)) * absorption;
  result = over(result, ink(vec3f(0.03, 0.47, 0.40), livingDensity * 0.56,
    livingDensity * 0.20));
  result = over(result, ink(vec3f(0.11, 0.69, 0.55), joined * absorption * 0.34,
    joined * absorption * 0.29));

  // Behind the moving front, disconnected light gathers into coherent local
  // patches. Density and emission differ so the body remains visible through it.
  let coherence = smoothstep(0.16, 0.43, p.y - frontY);
  let innerLight = livingDensity * coherence *
    (0.32 + 0.68 * clamp(lobeA * 0.8 + lobeB + lobeC * 0.7, 0.0, 1.0));
  result = over(result, ink(vec3f(0.16, 0.88, 0.66), innerLight * 0.39,
    innerLight * 0.29));
  let settledLobes = reached * fieldRise * coherence * absorption *
    clamp(lobeA * 0.82 + lobeB * 0.95 + lobeC * 0.78, 0.0, 1.0);
  result = over(result, ink(vec3f(0.28, 0.91, 0.73), settledLobes * 0.25,
    settledLobes * 0.28));
  result = over(result, ink(vec3f(0.25, 0.75, 0.64), frontBody * 0.42,
    frontBody * 0.38));
  result = over(result, ink(vec3f(0.81, 1.0, 0.83), frontCore * 0.84,
    frontCore * 0.72));

  // The field turns into the body after restoring it; no enclosing shell stays.
  let skinEdge = band(abs(p.x) - bodyWidth, 0.020, 0.071) * reached * fieldRise;
  result = over(result, ink(vec3f(0.25, 0.83, 0.66), skinEdge * 0.28,
    skinEdge * 0.17));

  // PH-H3: a body-bound circulation persists through the confirmed acceleration
  // window; short side currents show its outward motion without making a shell.
  if (u.state.x > 0.5) {
    let fade = 1.0 - smoothstep(10.7, 12.0, wall);
    let guideRise = smoothstep(1.18, 1.82, t);
    let flowClock = select(t, 2.4, reduced);
    let resident = bodyMask * guideRise * fade;
    let circulatingY = 0.22 * sin(flowClock * 0.90) + 0.18 * p.x +
      0.10 * sin(3.1 * p.x + flowClock * 0.56);
    let circulatingSheet = (1.0 - smoothstep(0.18, 0.52,
      abs(p.y - circulatingY))) * resident;
    let residentDensity = resident *
      (0.48 + 0.14 * sin(flowClock * 0.75 - p.y * 3.4));
    result = over(result, ink(vec3f(0.07, 0.58, 0.46), residentDensity * 0.34,
      residentDensity * 0.22));
    result = over(result, ink(vec3f(0.19, 0.83, 0.64), circulatingSheet * 0.21,
      circulatingSheet * 0.19));
    let sideX = bodyWidth + 0.10 - 0.10 * p.y +
      0.026 * sin(p.y * 6.2 + t * 1.3);
    let reach = (1.0 - smoothstep(0.57, 0.78, abs(p.y))) * fade * guideRise;
    let stream = band(abs(p.x) - sideX, 0.026, 0.058) * reach;
    // Separate short travelling currents replace a persistent vertical outline.
    let travelling = select(fract(t * 1.62 + p.y * 1.53 + select(0.0, 0.21, p.x > 0.0)),
      0.52, reduced);
    let crest = 1.0 - smoothstep(0.075, 0.20, abs(travelling - 0.5));
    result = over(result, ink(vec3f(0.03, 0.55, 0.48), stream * 0.045,
      stream * 0.025));
    let currentHalo = band(abs(p.x) - sideX, 0.044, 0.14) *
      reach * crest;
    result = over(result, ink(vec3f(0.11, 0.66, 0.58), currentHalo * 0.12,
      currentHalo * 0.20));
    result = over(result, ink(vec3f(0.36, 0.96, 0.76), stream * crest * 0.65,
      stream * crest * 0.58));
  }

  // OBS-H1: wider low-density scattering is driven only by the active source.
  let wideFrontGlow = (1.0 - smoothstep(0.08, 0.36, coreDist)) * bodyMask * fieldRise;
  let sourceGlow = wideFrontGlow * 0.52 + settledLobes * 0.24 + skinEdge * 0.15;
  result = over(result, ink(vec3f(0.14, 0.72, 0.57), sourceGlow * 0.31,
    sourceGlow * 0.45));
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
        values.set([viewport.pixelWidth, viewport.pixelHeight,
          (finite(effect.visualElapsedMs) ? effect.visualElapsedMs : effect.elapsedMs) / 1000,
          effect.reducedMotion ? 1 : 0], 4);
        values.set([effect.accelerationActive ? 1 : 0, CAST_MS / 1000,
          effect.elapsedMs / 1000, 1], 8);
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
