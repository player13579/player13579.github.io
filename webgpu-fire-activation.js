/* Textureless single-fire activation on the shared main WebGPU device.
 * Source shader: webgpu-fire-ultra.js (second-generation preview).
 * The caller owns the ordered frame, target and the fireJutsu SFX route. */
(function (root) {
  'use strict';
  const DURATION_MS = 1500;
  const BASE_RADIUS = 240;
  const finite = Number.isFinite;
  const shader = /* wgsl */ `
struct Params {
  viewport: vec4f, // width, height, caster x, caster y in physical pixels
  event: vec4f,    // age seconds, resolved radius pixels, seed, reduced motion
  control: vec4f,  // intensity, radius y pixels, reserved, reserved
};
@group(0) @binding(0) var<uniform> p: Params;

fn hash1(n: f32) -> f32 { return fract(sin(n * 127.13 + p.event.z * 17.73) * 43758.5453); }
fn noise(q: vec2f) -> f32 {
  let i = floor(q);
  let f = fract(q);
  let u = f * f * (3.0 - 2.0 * f);
  let k = i.x + 67.0 * i.y;
  return mix(mix(hash1(k), hash1(k + 1.0), u.x),
             mix(hash1(k + 67.0), hash1(k + 68.0), u.x), u.y);
}
fn fbm(q: vec2f) -> f32 {
  return noise(q) * 0.55 + noise(q * 2.09 + 9.4) * 0.30
       + noise(q * 4.18 + 23.1) * 0.15;
}
fn bell(x: f32, width: f32) -> f32 { return exp(-x * x / max(width * width, 0.001)); }
fn capsule(x: f32, halfWidth: f32, feather: f32) -> f32 {
  return 1.0 - smoothstep(halfWidth - feather, halfWidth + feather, abs(x));
}
fn ageEnvelope(age: f32) -> f32 {
  return smoothstep(0.0, 0.10, age) * (1.0 - smoothstep(1.01, 1.50, age));
}
fn flowTime(age: f32) -> f32 { return select(age, 0.72, p.event.w > 0.5); }

struct VertexOut { @builtin(position) pos: vec4f };
@vertex fn screenVertex(@builtin(vertex_index) id: u32) -> VertexOut {
  let corners = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
  var out: VertexOut;
  out.pos = vec4f(corners[id], 0.0, 1.0);
  return out;
}

@fragment fn fireFragment(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let age = clamp(p.event.x, 0.0, 1.5);
  let time = flowTime(age);
  let axisScale = max(vec2f(p.event.y, p.control.y) / 240.0, vec2f(0.001));
  let radius = 240.0;
  let xy = vec2f(position.x - p.viewport.z, p.viewport.w - position.y) / axisScale;
  let x = xy.x;
  let y = xy.y;
  let life = ageEnvelope(age) * p.control.x;
  let ignition = smoothstep(0.005, 0.065, age) * (1.0 - smoothstep(0.16, 0.37, age));
  let reach = radius * smoothstep(0.025, 0.66, age);
  let travel = clamp(abs(x) / max(reach, 1.0), 0.0, 1.0);
  let arrival = 0.055 + 0.53 * abs(x) / radius;
  let localAge = max(age - arrival, 0.0);
  let frontGate = (1.0 - smoothstep(reach - 17.0, reach + 14.0, abs(x)))
      * smoothstep(0.0, 0.10, localAge) * (1.0 - smoothstep(1.04, 1.50, age));

  // Fuel/heat begins at the caster, and a coherent front travels along the floor.
  // Along-front variation is low frequency; all tongues share the same arrival gate.
  let floorNoise = fbm(vec2f(x * 0.023, -time * 1.35));
  let frontTop = (22.0 + 28.0 * floorNoise + 22.0 * (1.0 - travel))
      * smoothstep(0.0, 0.13, localAge);
  let frontEddy = sin(x * 0.051 - time * 5.0 + floorNoise * 3.4);
  let crest = frontTop + 22.0 * pow(max(frontEddy, 0.0), 2.0);
  let floorMask = smoothstep(-21.0, 6.0, y) *
      (1.0 - smoothstep(crest - 15.0, crest + 10.0, y));
  let flamelet = fbm(vec2f(x * 0.040 + 3.1, y * 0.035 - time * 2.1));
  let frontVariation = mix(0.46, 1.0, smoothstep(0.24, 0.69,
      flamelet + 0.18 * frontEddy)) * mix(1.0, 0.77, smoothstep(4.0, 48.0, y));
  let front = floorMask * frontGate * frontVariation;
  let frontCore = front * (1.0 - smoothstep(14.0, 52.0, y))
      * (0.52 + 0.48 * floorNoise);
  let advancingEdge = bell(abs(x) - reach + 13.0, 23.0) *
      smoothstep(-9.0, 2.0, y) * (1.0 - smoothstep(16.0, 53.0, y))
      * smoothstep(0.035, 0.20, age) * (1.0 - smoothstep(1.0, 1.5, age));

  // Buoyancy and a bounded shearing flow deform the broad, connected flame sheets.
  let height = 216.0 * smoothstep(0.05, 0.46, age);
  let h = clamp(y / max(height, 1.0), 0.0, 1.4);
  let wobble = fbm(vec2f(h * 2.4 - time * 1.3, h * 4.7 - time * 2.0));
  let shear = sin(h * 7.2 - time * 2.4 + p.event.z * 0.2) * (7.0 + 23.0 * h);
  let displaced = x - shear - (wobble - 0.5) * (24.0 + 37.0 * h);
  let plumeBase = smoothstep(-17.0, 8.0, y);
  let mainTop = height * (0.75 + 0.23 * bell(displaced - 9.0, 45.0)
      + 0.09 * sin(displaced * 0.056 - time * 1.4)
      - 0.07 * smoothstep(58.0, 107.0, abs(displaced)));
  let mainGate = plumeBase * (1.0 - smoothstep(mainTop - 25.0, mainTop + 8.0, y));
  let leftTop = height * (0.77 + 0.05 * sin(time * 1.5 + p.event.z));
  let rightTop = height * (0.65 + 0.06 * sin(time * 1.2 - p.event.z));
  let leftGate = plumeBase * (1.0 - smoothstep(leftTop - 25.0, leftTop + 7.0, y));
  let rightGate = plumeBase * (1.0 - smoothstep(rightTop - 22.0, rightTop + 7.0, y));
  let width = (83.0 - 59.0 * h) * (1.0 - smoothstep(0.84, 1.15, h)) + 6.0;
  let edgeWarp = (fbm(vec2f(displaced * 0.025, h * 5.8 - time * 2.9)) - 0.5)
      * (9.0 + 28.0 * h);
  let mainSheet = capsule(displaced + edgeWarp, width, 8.0) * mainGate;
  let secondaryLift = smoothstep(0.10, 0.33, h) * (1.0 - smoothstep(0.68, 1.01, h));
  let leftSheet = capsule(displaced + 57.0 + 31.0 * h + sin(h * 8.0 - time * 2.6) * 9.0,
                          25.0 * (1.0 - 0.42 * h), 5.0) * secondaryLift * leftGate;
  let rightSheet = capsule(displaced - 54.0 - 22.0 * h + sin(h * 7.2 - time * 2.0) * 8.0,
                           21.0 * (1.0 - 0.48 * h), 5.0) * secondaryLift * rightGate;
  let split = fbm(vec2f(displaced * 0.035 + 7.0, h * 4.7 - time * 3.6));
  let valleys = smoothstep(0.24, 0.47, split + 0.18 * (1.0 - h));
  var sheet = max(mainSheet * valleys, max(leftSheet * 0.70, rightSheet * 0.62));
  sheet = sheet * smoothstep(0.08, 0.25, age) *
      (1.0 - smoothstep(1.05, 1.5, age));
  let fuelBase = bell(x, 51.0) * bell(y - 15.0, 34.0) *
      smoothstep(0.0, 0.13, age) * (1.0 - smoothstep(1.1, 1.5, age));
  let core = sheet * capsule(displaced + 5.0 * sin(h * 12.0 - time * 3.8),
                             30.0 * (1.0 - 0.55 * h), 12.0)
      * (1.0 - smoothstep(0.57, 0.84, h));

  // Optical response follows emission. Ground heat has a shorter, wider footprint;
  // upward haze uses the same rising flow and never becomes a decorative ring.
  let groundHeat = bell(x, max(68.0, reach * 0.69)) * bell(y + 4.0, 24.0)
      * smoothstep(0.02, 0.22, age) * (1.0 - smoothstep(1.03, 1.5, age));
  let hotAir = bell(x - shear * 0.5, 92.0 + h * 40.0) *
      smoothstep(35.0, 90.0, y) * (1.0 - smoothstep(211.0, 295.0, y))
      * life;
  let shimmerField = fbm(vec2f(x * 0.048 + sin(time * 2.5 + y * 0.028) * 0.6,
                                   y * 0.054 - time * 2.4));
  let shimmer = hotAir * (0.30 + 0.70 * shimmerField) * 0.045;
  let bloom = (bell(x, 120.0) * bell(y - 88.0, 148.0) * 0.17
      + bell(x, max(94.0, reach * 0.77)) * bell(y - 4.0, 48.0) * 0.18)
      * life;
  let flash = bell(x, 48.0) * bell(y - 15.0, 39.0) * ignition * 0.71;

  let body = clamp(max(sheet, fuelBase * 0.84) * 0.84 + front * 0.67
      + advancingEdge * 0.24, 0.0, 0.98) * life;
  let hot = clamp(core * 0.81 + frontCore * 0.55 + fuelBase * 0.30, 0.0, 1.0) * life;
  let red = vec3f(0.88, 0.15, 0.035);
  let orange = vec3f(1.0, 0.40, 0.055);
  let yellow = vec3f(1.0, 0.78, 0.24);
  var flameColor = mix(red, orange, clamp(sheet * 0.62 + frontCore * 0.40, 0.0, 1.0));
  flameColor = mix(flameColor, yellow, hot * 0.90);
  let glowA = clamp(bloom + groundHeat * 0.13 + shimmer + flash * 0.70, 0.0, 0.75);
  let alpha = clamp(body + hot * 0.20 + glowA, 0.0, 1.0);
  let rgb = flameColor * body + vec3f(1.0, 0.86, 0.45) * hot * 0.20
      + vec3f(1.0, 0.34, 0.06) * (bloom + groundHeat * 0.13)
      + vec3f(0.94, 0.35, 0.12) * shimmer
      + vec3f(1.0, 0.77, 0.38) * flash * 0.70;
  return vec4f(min(rgb, vec3f(alpha)), alpha);
}

struct EmberOut {
  @builtin(position) pos: vec4f,
  @location(0) local: vec2f,
  @location(1) energy: f32,
};
@vertex fn emberVertex(@builtin(vertex_index) vertex: u32,
                       @builtin(instance_index) instance: u32) -> EmberOut {
  let corner = array<vec2f, 6>(vec2f(-1.0,-1.0),vec2f(1.0,-1.0),vec2f(-1.0,1.0),
                               vec2f(-1.0,1.0),vec2f(1.0,-1.0),vec2f(1.0,1.0));
  let id = f32(instance);
  let age = p.event.x;
  let born = 0.12 + hash1(id * 10.7) * 0.62;
  let particleAge = max(0.0, age - born);
  let travel = clamp(particleAge / (0.47 + hash1(id * 7.2) * 0.35), 0.0, 1.0);
  let live = smoothstep(0.0, 0.06, particleAge) * (1.0 - smoothstep(0.48, 1.0, travel))
      * ageEnvelope(age) * select(1.0, 0.45, p.event.w > 0.5);
  let side = (hash1(id * 3.3) * 2.0 - 1.0) * (19.0 + travel * 103.0);
  let drift = sin(flowTime(age) * 2.1 + id * 2.1) * travel * 10.0;
  let axisScale = max(vec2f(p.event.y, p.control.y) / 240.0, vec2f(0.001));
  let center = p.viewport.zw + vec2f(side + drift,
      -(20.0 + travel * (118.0 + hash1(id * 9.5) * 97.0))) * axisScale;
  let size = 1.1 + hash1(id * 8.1) * 1.45;
  let xy = center + corner[vertex] * size * 2.0 * axisScale;
  var out: EmberOut;
  out.pos = vec4f(xy.x / p.viewport.x * 2.0 - 1.0,
                  1.0 - xy.y / p.viewport.y * 2.0, 0.0, 1.0);
  out.local = corner[vertex];
  out.energy = live * p.control.x;
  return out;
}
@fragment fn emberFragment(input: EmberOut) -> @location(0) vec4f {
  let alpha = (1.0 - smoothstep(0.13, 0.92, length(input.local))) * input.energy * 0.67;
  return vec4f(vec3f(1.0, 0.55, 0.15) * alpha, alpha);
}
`;

  function seedFor(id) {
    const value = String(id);
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) / 0x100000000 * 17;
  }

  function plan({ effect, now, phase, camera, zoom, viewport,
    reducedMotion = false, alpha = 1 } = {}) {
    if (!['playing', 'meeting'].includes(phase) || effect?.type !== 'fire' ||
        (typeof effect.id !== 'string' && typeof effect.id !== 'number')) return null;
    if (!camera || !viewport || ![
      effect.x, effect.y, effect.radius, effect.startedAt, now,
      camera.x, camera.y, zoom, alpha,
      viewport.width, viewport.height, viewport.pixelWidth, viewport.pixelHeight
    ].every(finite) || zoom <= 0 || effect.radius <= 0 ||
        alpha <= 0 || viewport.width <= 0 || viewport.height <= 0 ||
        !Number.isInteger(viewport.pixelWidth) || !Number.isInteger(viewport.pixelHeight) ||
        viewport.pixelWidth <= 0 || viewport.pixelHeight <= 0) return null;
    const elapsed = now - effect.startedAt;
    if (elapsed < 0 || elapsed >= DURATION_MS) return null;
    const dprX = viewport.pixelWidth / viewport.width;
    const dprY = viewport.pixelHeight / viewport.height;
    // Preserve the v2 Fire shape in logical world units. The X/Y resolved
    // radius separately follows zoom and backing-size scaling on each axis.
    const radiusX = effect.radius * zoom * dprX;
    const radiusY = effect.radius * zoom * dprY;
    const x = (effect.x - camera.x) * zoom * dprX;
    const y = (effect.y - camera.y) * zoom * dprY;
    const age = elapsed / 1000;
    const values = new Float32Array([
      viewport.pixelWidth, viewport.pixelHeight, x, y,
      age, radiusX, seedFor(effect.id), reducedMotion ? 1 : 0,
      Math.min(1, alpha), radiusY, 0, 0
    ]);
    if (!values.every(finite)) return null;
    return Object.freeze({ effectId: String(effect.id), values, elapsed,
      x, y, radiusX, radiusY, radius: effect.radius, reducedMotion: Boolean(reducedMotion) });
  }

  function create({ renderer, frameOwner = renderer } = {}) {
    if (!frameOwner || frameOwner.state !== 'ready' ||
        !frameOwner.device?.createShaderModule || !frameOwner.device?.queue?.writeBuffer ||
        typeof frameOwner.own !== 'function' || typeof frameOwner.release !== 'function')
      throw new TypeError('Fire activation requires the shared WebGPU frame owner');
    const device = frameOwner.device;
    const format = frameOwner.format;
    const module = device.createShaderModule({ label: 'DVA textureless fire activation WGSL', code: shader });
    const bindGroupLayout = device.createBindGroupLayout({ entries: [{ binding: 0,
      visibility: 0x1 | 0x2, buffer: { type: 'uniform' } }] });
    const layout = device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] });
    const blend = { color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
      alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' } };
    const pipeline = (name, vertexEntry, fragmentEntry) => device.createRenderPipeline({
      label: `DVA fire ${name}`, layout,
      vertex: { module, entryPoint: vertexEntry },
      fragment: { module, entryPoint: fragmentEntry, targets: [{ format, blend }] },
      primitive: { topology: 'triangle-list' }
    });
    const flame = pipeline('flame', 'screenVertex', 'fireFragment');
    const ember = pipeline('ember', 'emberVertex', 'emberFragment');
    const slots = [];
    const indices = new WeakMap();
    let destroyed = false;
    function slot(index) {
      if (slots[index]) return slots[index];
      const uniform = frameOwner.own(device.createBuffer({
        label: `DVA fire activation parameters ${index}`,
        size: 48, usage: 0x40 | 0x08
      }));
      const bindGroup = device.createBindGroup({ layout: bindGroupLayout,
        entries: [{ binding: 0, resource: { buffer: uniform } }] });
      return (slots[index] = { uniform, bindGroup });
    }
    function record({ frame, target, viewport, ...input } = {}) {
      if (destroyed || frameOwner.state !== 'ready') throw new Error('Fire activation pass unavailable');
      if (!frame || typeof frame.add !== 'function' || typeof frame.stage !== 'function' ||
          typeof target !== 'string' || !target)
        throw new TypeError('Fire activation requires an ordered shared frame and target');
      const command = plan({ ...input, viewport });
      if (!command) return false;
      const index = indices.get(frame) || 0;
      const { uniform, bindGroup } = slot(index);
      device.queue.writeBuffer(uniform, 0, command.values);
      frame.stage('world:fire-activation');
      frame.add({ target, label: `DVA fire activation ${command.effectId}`,
        encode(pass, info) {
          if (info.device !== device || info.format !== format ||
              info.width !== viewport.pixelWidth || info.height !== viewport.pixelHeight)
            throw new Error('Fire activation target device, format or backing size mismatch');
          pass.setBindGroup(0, bindGroup);
          pass.setPipeline(flame);
          pass.draw(3);
          pass.setPipeline(ember);
          pass.draw(6, 14);
        } });
      indices.set(frame, index + 1);
      return true;
    }
    return Object.freeze({ device, plan, record, shader, get state() {
      return destroyed ? 'destroyed' : frameOwner.state;
    }, destroy() {
      if (destroyed) return;
      destroyed = true;
      for (const { uniform } of slots) {
        if (frameOwner.release(uniform)) uniform.destroy();
      }
    } });
  }
  const api = Object.freeze({ DURATION_MS, BASE_RADIUS, shader, plan, create });
  root.DvaWebGPUFireActivation = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
