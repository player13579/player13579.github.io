/* Gunner passive aim in the ordered, shared-device WebGPU world stream.
 * Coordinates are logical viewport pixels. The caller supplies the committed
 * physical backing separately and owns the returned transient buffer. */
(function (root) {
  'use strict';
  const shader = /* wgsl */ `
struct Aim { line: vec4f, reticle: vec4f, state: vec4f, viewport: vec4f }
const PI: f32 = 3.14159265359;
@group(0) @binding(0) var<uniform> aim: Aim;
struct Vertex { @builtin(position) position: vec4f, @location(0) pixel: vec2f,
  @location(1) @interpolate(flat) part: u32 }
@vertex fn vs(@builtin(vertex_index) vertex: u32, @builtin(instance_index) part: u32) -> Vertex {
  let corner = array<vec2f, 6>(vec2f(0,0),vec2f(1,0),vec2f(0,1),
    vec2f(0,1),vec2f(1,0),vec2f(1,1))[vertex];
  var low: vec2f;
  var high: vec2f;
  if (part == 0u) {
    low = min(aim.line.xy, aim.line.zw) - vec2f(aim.state.w * .5 + 2.0);
    high = max(aim.line.xy, aim.line.zw) + vec2f(aim.state.w * .5 + 2.0);
  } else {
    low = aim.reticle.xy - vec2f(aim.reticle.z + aim.reticle.w * .5 + 2.0);
    high = aim.reticle.xy + vec2f(aim.reticle.z + aim.reticle.w * .5 + 2.0);
  }
  let pixel = mix(low, high, corner);
  var out: Vertex;
  out.position = vec4f(pixel / aim.viewport.xy * vec2f(2.0,-2.0) + vec2f(-1.0,1.0), 0.0, 1.0);
  out.pixel = pixel;
  out.part = part;
  return out;
}
fn arcDistance(pixel: vec2f, start: f32, sweep: f32) -> f32 {
  let delta = pixel - aim.reticle.xy;
  let angle = atan2(delta.y, delta.x);
  let relative = fract((angle - start) / 6.28318530718) * 6.28318530718;
  if (relative <= sweep) { return abs(length(delta) - aim.reticle.z); }
  let first = aim.reticle.xy + aim.reticle.z * vec2f(cos(start), sin(start));
  let last = aim.reticle.xy + aim.reticle.z * vec2f(cos(start + sweep), sin(start + sweep));
  return min(length(pixel - first), length(pixel - last));
}
@fragment fn fs(input: Vertex) -> @location(0) vec4f {
  var color: vec4f;
  var distance: f32;
  var width: f32;
  if (input.part == 0u) {
    let direction = aim.line.zw - aim.line.xy;
    let length2 = dot(direction, direction);
    if (length2 < .0001) { discard; }
    let t = dot(input.pixel - aim.line.xy, direction) / length2;
    if (t < 0.0 || t > 1.0) { discard; }
    let along = t * sqrt(length2);
    let phase = fract((along + aim.state.y / 32.0 * aim.state.x) / (21.0 * aim.state.x));
    if (phase >= 12.0 / 21.0) { discard; }
    distance = abs(direction.x * (input.pixel.y - aim.line.y) -
      direction.y * (input.pixel.x - aim.line.x)) / sqrt(length2);
    width = aim.state.w;
    let c0 = vec4f(34.0/255.0,211.0/255.0,238.0/255.0,.28);
    let c1 = vec4f(125.0/255.0,211.0/255.0,252.0/255.0,.78);
    let c2 = vec4f(1.0,1.0,1.0,.92);
    color = select(mix(c1,c2,clamp((t-.72)/.28,0.0,1.0)),
      mix(c0,c1,clamp(t/.72,0.0,1.0)), t <= .72);
  } else if (input.part == 3u) {
    // Canvas arcs share one path: arc() connects the first endpoint to the
    // second start point before stroke(). Preserve that visible chord.
    let first = aim.reticle.xy + aim.reticle.z * vec2f(cos(PI*.36), sin(PI*.36));
    let last = aim.reticle.xy + aim.reticle.z * vec2f(cos(PI*.84), sin(PI*.84));
    let direction = last - first;
    let t = clamp(dot(input.pixel - first, direction) / dot(direction, direction), 0.0, 1.0);
    distance = length(input.pixel - mix(first, last, t));
    width = aim.reticle.w;
    color = vec4f(224.0/255.0,242.0/255.0,254.0/255.0,.9);
  } else {
    let start = select(-PI*.16, PI*.84, input.part == 2u);
    distance = arcDistance(input.pixel, start, PI*.52);
    width = aim.reticle.w;
    color = vec4f(224.0/255.0,242.0/255.0,254.0/255.0,.9);
  }
  let aa = max(fwidth(distance), .5);
  let coverage = 1.0 - smoothstep(width*.5-aa,width*.5+aa,distance);
  let alpha = color.a * aim.state.z * coverage;
  return vec4f(color.rgb * alpha, alpha);
}`;
  const finite = Number.isFinite;
  function plan({ scene, camera, zoom } = {}) {
    if (scene == null) return null;
    if (!camera || ![camera.x, camera.y, zoom, scene.now].every(finite) || zoom <= 0) {
      throw new TypeError('Aim requires resolved scene, world camera, positive zoom, and frame time');
    }
    const { origin, destination, now } = scene;
    if (![origin?.x, origin?.y, destination?.x, destination?.y].every(finite)) {
      throw new TypeError('Aim requires finite rendered world coordinates');
    }
    const x0 = (origin.x - camera.x) * zoom, y0 = (origin.y - camera.y) * zoom;
    const x1 = (destination.x - camera.x) * zoom, y1 = (destination.y - camera.y) * zoom;
    const pulse = 0.72 + Math.sin(now / 110) * .18;
    return Object.freeze({ line: Object.freeze([x0,y0,x1,y1]),
      target: Object.freeze([x1,y1,(27 + pulse * 4) * zoom,2.5 * zoom]),
      state: Object.freeze([zoom,now,pulse,2.2 * zoom]) });
  }
  function create({ device, format } = {}) {
    if (typeof device?.createShaderModule !== 'function' || !format) {
      throw new TypeError('Aim requires shared WebGPU device and format');
    }
    const module = device.createShaderModule({ label: 'DVA gunner aim', code: shader });
    const pipeline = device.createRenderPipeline({ label: 'DVA gunner aim additive', layout: 'auto',
      vertex: { module, entryPoint: 'vs' }, fragment: { module, entryPoint: 'fs', targets: [{
        format, blend: { color: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
          alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' } }
      }] }, primitive: { topology: 'triangle-list' } });
    let destroyed = false;
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed || typeof frame?.add !== 'function' || !target || !viewport ||
          ![viewport.width,viewport.height].every(finite) || viewport.width <= 0 || viewport.height <= 0 ||
          !Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth <= 0 ||
          !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight <= 0) {
        throw new TypeError('Aim requires open shared frame, target, and committed viewport');
      }
      const geometry = plan({ scene, camera, zoom });
      if (!geometry) return null;
      const buffer = device.createBuffer({ label: 'DVA gunner aim uniform', size: 64, usage: 0x40 | 0x08 });
      device.queue.writeBuffer(buffer, 0, new Float32Array([
        ...geometry.line, ...geometry.target, ...geometry.state, viewport.width, viewport.height, 0, 0
      ]));
      const group = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer } }] });
      let encoded = false, disposed = false;
      try {
        frame.add({ target, label: 'world:gunner-aim', encode(pass, context) {
          if (encoded || disposed) throw new Error('Aim pass is closed');
          if (context.device !== device || context.format !== format ||
              context.width !== viewport.pixelWidth || context.height !== viewport.pixelHeight) {
            throw new Error('Aim pass needs matching shared GPU target');
          }
          encoded = true;
          pass.setPipeline(pipeline); pass.setBindGroup(0, group); pass.draw(6, 4);
        } });
      } catch (error) { buffer.destroy(); throw error; }
      return Object.freeze({ destroy() { if (!disposed) { disposed = true; buffer.destroy(); } } });
    }
    return Object.freeze({ record, destroy() { destroyed = true; } });
  }
  const api = Object.freeze({ plan, create, shader });
  root.DvaWebGPUGunnerAim = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
