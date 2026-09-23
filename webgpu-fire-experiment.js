/* Standalone textureless Fire E study. No game runtime dependency. */
const FIRE_WGSL = /* wgsl */ `
struct Params {
  viewport: vec4f, // physical width, height, anchor x, anchor y
  motion: vec4f,   // time, lifecycle age, scale, seed
  flags: vec4f,    // reduced motion, intensity, reserved, reserved
};
@group(0) @binding(0) var<uniform> p: Params;

fn hash(n: f32) -> f32 { return fract(sin(n * 127.1 + p.motion.w * 18.743) * 43758.5453); }
fn noise(v: vec2f) -> f32 {
  let i = floor(v);
  let f = fract(v);
  let u = f * f * (3.0 - 2.0 * f);
  let n = i.x + i.y * 61.0;
  return mix(mix(hash(n), hash(n + 1.0), u.x),
             mix(hash(n + 61.0), hash(n + 62.0), u.x), u.y);
}
fn fbm(v: vec2f) -> f32 {
  return noise(v) * 0.57 + noise(v * 2.17 + 7.6) * 0.29 + noise(v * 4.43 + 19.3) * 0.14;
}
fn life(age: f32) -> f32 {
  let erupt = smoothstep(0.0, 0.18, age);
  let die = 1.0 - smoothstep(0.95, 1.50, age);
  return erupt * die;
}
@vertex fn flameVertex(@builtin(vertex_index) vid: u32) -> @builtin(position) vec4f {
  let points = array<vec2f, 3>(vec2f(-1.0,-1.0), vec2f(3.0,-1.0), vec2f(-1.0,3.0));
  return vec4f(points[vid],0.0,1.0);
}
@fragment fn flameFragment(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let scale = max(p.motion.z, 0.2);
  let q = vec2f((pos.x - p.viewport.z) / (125.0 * scale),
                (p.viewport.w - pos.y) / (235.0 * scale));
  let age = p.motion.y;
  let time = select(p.motion.x, 0.74, p.flags.x > 0.5);
  let strength = life(age) * p.flags.y;
  let growth = smoothstep(0.02, 0.53, age);
  let shapeY = q.y / max(growth, 0.08);
  let rise = clamp(shapeY, 0.0, 1.5);
  // Buoyancy advects the turbulent field upward while the source stays fixed.
  let flow = vec2f(q.x * 2.4 + sin(rise * 6.3 - time * 2.1) * 0.16,
                   rise * 3.5 - time * 2.7);
  let curl = fbm(flow) - 0.5;
  let shear = sin(rise * 11.0 - time * 3.2 + p.motion.w) * 0.11 * rise;
  let x = q.x - curl * (0.18 + 0.22 * rise) - shear;
  let tip = 1.0 - smoothstep(0.67, 1.17, rise);
  let width = (0.58 - rise * 0.38) * tip + 0.018;
  let fray = (fbm(vec2f(x * 4.3, rise * 7.0 - time * 4.0)) - 0.5) * 0.28 * rise;
  let main = (1.0 - smoothstep(width - 0.035, width + 0.025, abs(x) + fray))
             * smoothstep(-0.10, 0.05, shapeY) * (1.0 - smoothstep(1.03, 1.22, shapeY));
  // Two displaced tongues break the symmetry without multiplying detail.
  let leftX = x + 0.57 + 0.10 * sin(rise * 8.0 - time * 2.1);
  let rightX = x - 0.51 + 0.08 * sin(rise * 7.4 + time * 2.4);
  let left = (1.0 - smoothstep(0.14, 0.19, abs(leftX)))
      * smoothstep(0.09, 0.24, shapeY) * (1.0 - smoothstep(0.77, 1.04, shapeY));
  let right = (1.0 - smoothstep(0.12, 0.17, abs(rightX)))
      * smoothstep(0.05, 0.19, shapeY) * (1.0 - smoothstep(0.51, 0.78, shapeY));
  let fanLeft = (1.0 - smoothstep(0.07, 0.16, abs(x + 0.20 + 1.35 * rise)))
      * smoothstep(0.05, 0.22, shapeY) * (1.0 - smoothstep(0.48, 0.69, shapeY));
  let fanRight = (1.0 - smoothstep(0.07, 0.15, abs(x - 0.19 - 1.19 * rise)))
      * smoothstep(0.04, 0.18, shapeY) * (1.0 - smoothstep(0.40, 0.63, shapeY));
  var body = max(main, max(left * 0.83, max(right * 0.72, max(fanLeft * 0.59, fanRight * 0.51))));
  let base = exp(-pow(q.x / 0.55, 2.0) * 2.0 - pow(q.y / 0.17, 2.0) * 1.8);
  body = max(body, base * 0.94);
  // A low rolling fire front carries the ignition out from the source.
  let lateral = abs(q.x) * 0.521;
  let shockRadius = 0.04 + age * 0.97;
  let frontLife = smoothstep(0.02, 0.13, age) * (1.0 - smoothstep(0.94, 1.39, age));
  let frontNoise = fbm(vec2f(q.x * 3.0, -time * 2.6 + q.y * 4.0));
  let tongue = pow(max(0.0, sin(q.x * 7.2 - time * 4.8 + frontNoise * 3.0)), 2.0);
  let frontHeight = 0.055 + 0.15 * (1.0 - clamp(lateral / max(shockRadius, 0.1), 0.0, 1.0))
      + tongue * 0.27;
  let frontExtent = 1.0 - smoothstep(shockRadius - 0.18, shockRadius + 0.025, lateral);
  let shock = frontExtent * smoothstep(-0.07, 0.02, q.y)
      * (1.0 - smoothstep(frontHeight - 0.04, frontHeight + 0.035, q.y)) * frontLife;
  let frontHot = shock * tongue * (1.0 - smoothstep(0.09, 0.34, q.y));
  let frontGlow = exp(-pow(q.y / 0.18, 2.0) * 1.7)
      * (1.0 - smoothstep(shockRadius, shockRadius + 0.22, lateral)) * frontLife * 0.12;
  let flash = exp(-pow(q.x / 0.36, 2.0) * 1.5 - pow(q.y / 0.19, 2.0) * 1.7)
      * smoothstep(0.0, 0.07, age) * (1.0 - smoothstep(0.20, 0.42, age));
  // Heat flow folds the bright core; surrounding haze carries the light outward.
  let coreX = x + 0.026 * sin(rise * 17.0 - time * 5.5);
  let core = (1.0 - smoothstep(0.045, 0.18 * (1.0 - 0.55 * rise), abs(coreX)))
      * (1.0 - smoothstep(0.62, 0.86, shapeY)) * body;
  let thermal = 0.78 + 0.22 * sin(rise * 18.0 - time * 6.0 + curl * 6.0);
  let opacity = clamp(body * (0.66 + core * 0.32) * strength * thermal, 0.0, 0.98);
  let glow = exp(-pow(q.x / 0.93, 2.0) * 1.7 - pow((q.y - 0.30) / 0.52, 2.0) * 2.2)
      * strength * 0.20;
  let floorHeat = exp(-pow(q.x / 2.05, 2.0) * 1.6 - pow(q.y / 0.14, 2.0) * 2.0)
      * strength * 0.13;
  let outer = vec3f(0.72, 0.105, 0.025);
  let hot = vec3f(1.0, 0.48, 0.055);
  let whiteHot = vec3f(1.0, 0.91, 0.53);
  var color = mix(outer, hot, clamp(body * 0.72 + (1.0 - rise) * 0.14, 0.0, 1.0));
  color = mix(color, whiteHot, core * 0.88);
  let alpha = clamp(opacity + glow * 0.48 + shock * 0.48 + frontHot * 0.19 + frontGlow * 0.52 + floorHeat * 0.7 + flash * 0.70, 0.0, 1.0);
  return vec4f(color * opacity + vec3f(1.0, 0.29, 0.035) * glow * 0.50
      + vec3f(1.0, 0.25, 0.025) * shock * 0.48
      + vec3f(1.0, 0.65, 0.12) * frontHot * 0.19
      + vec3f(1.0, 0.19, 0.025) * frontGlow * 0.52
      + vec3f(1.0, 0.28, 0.025) * floorHeat * 0.70
      + vec3f(1.0, 0.85, 0.42) * flash * 0.70, alpha);
}

struct EmberOut {
  @builtin(position) position: vec4f,
  @location(0) local: vec2f,
  @location(1) strength: f32,
};
@vertex fn emberVertex(@builtin(vertex_index) vid: u32, @builtin(instance_index) iid: u32) -> EmberOut {
  let corners = array<vec2f, 6>(vec2f(-1.0,-1.0),vec2f(1.0,-1.0),vec2f(-1.0,1.0),
                                 vec2f(-1.0,1.0),vec2f(1.0,-1.0),vec2f(1.0,1.0));
  let id = f32(iid);
  let reduced = p.flags.x > 0.5;
  let t = select(p.motion.x, 0.74, reduced);
  let spawn = hash(id * 13.0) * 0.44;
  let elapsed = p.motion.y - spawn;
  let phase = clamp(elapsed / (0.65 + hash(id * 7.0) * 0.20), 0.0, 1.0);
  let gate = select(1.0, 0.38, reduced);
  let live = smoothstep(0.0, 0.10, phase) * (1.0 - smoothstep(0.64, 1.0, phase))
      * life(p.motion.y) * gate;
  let side = (hash(id * 3.4) * 2.0 - 1.0) * (14.0 + 48.0 * phase);
  let drift = sin(t * 2.3 + id * 2.7) * 13.0 * phase;
  let center = p.viewport.zw + vec2f((side + drift) * p.motion.z,
      -(40.0 + phase * (168.0 + hash(id * 9.2) * 70.0)) * p.motion.z);
  let radius = (1.2 + hash(id * 4.1) * 1.8) * p.motion.z;
  var out: EmberOut;
  let px = center + corners[vid] * radius * 2.6;
  out.position = vec4f(px.x / p.viewport.x * 2.0 - 1.0, 1.0 - px.y / p.viewport.y * 2.0, 0.0, 1.0);
  out.local = corners[vid];
  out.strength = live * (0.55 + 0.45 * hash(id * 11.0)) * p.flags.y;
  return out;
}
@fragment fn emberFragment(input: EmberOut) -> @location(0) vec4f {
  let d = length(input.local);
  let a = (1.0 - smoothstep(0.12, 0.92, d)) * input.strength * 0.78;
  return vec4f(vec3f(1.0, 0.47, 0.09) * a, a);
}
`;

export async function createFireExperiment(canvas, options = {}) {
  if (!navigator.gpu) throw new Error("WebGPU is unavailable in this browser.");
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) throw new Error("No WebGPU adapter was found.");
  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu");
  if (!context) throw new Error("This canvas cannot create a WebGPU context.");
  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format, alphaMode: "premultiplied" });
  const module = device.createShaderModule({ code: FIRE_WGSL });
  const errors = await module.getCompilationInfo();
  const shaderErrors = errors.messages.filter(message => message.type === "error");
  if (shaderErrors.length) throw new Error(shaderErrors.map(message => `${message.lineNum}:${message.linePos} ${message.message}`).join("\n"));
  const uniformBuffer = device.createBuffer({ size: 48, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  const bindGroupLayout = device.createBindGroupLayout({ entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX, buffer: { type: "uniform" } }] });
  const layout = device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] });
  const bindGroup = device.createBindGroup({ layout: bindGroupLayout, entries: [{ binding: 0, resource: { buffer: uniformBuffer } }] });
  const blend = { color: { srcFactor: "one", dstFactor: "one-minus-src-alpha" }, alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha" } };
  const flamePipeline = device.createRenderPipeline({ layout, vertex: { module, entryPoint: "flameVertex" }, fragment: { module, entryPoint: "flameFragment", targets: [{ format, blend }] }, primitive: { topology: "triangle-list" } });
  const emberPipeline = device.createRenderPipeline({ layout, vertex: { module, entryPoint: "emberVertex" }, fragment: { module, entryPoint: "emberFragment", targets: [{ format, blend }] }, primitive: { topology: "triangle-list" } });
  const state = { time: 0.78, age: 0.78, scale: 1, seed: 4, intensity: 1, reducedMotion: false, ...options };
  let destroyed = false;
  device.lost.then(() => { destroyed = true; });
  function render(overrides = {}) {
    if (destroyed) return;
    Object.assign(state, overrides);
    const width = canvas.width, height = canvas.height;
    const uniform = new Float32Array([width, height, width * 0.5, height * 0.59,
      state.time, state.age, state.scale, state.seed,
      state.reducedMotion ? 1 : 0, state.intensity, 0, 0]);
    device.queue.writeBuffer(uniformBuffer, 0, uniform);
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({ colorAttachments: [{ view: context.getCurrentTexture().createView(),
      clearValue: { r: 0, g: 0, b: 0, a: 0 }, loadOp: "clear", storeOp: "store" }] });
    pass.setBindGroup(0, bindGroup);
    pass.setPipeline(flamePipeline);
    pass.draw(3);
    pass.setPipeline(emberPipeline);
    pass.draw(6, 18);
    pass.end();
    device.queue.submit([encoder.finish()]);
  }
  return { render, state, device, shader: FIRE_WGSL, destroy() { destroyed = true; uniformBuffer.destroy(); context.unconfigure(); } };
}
