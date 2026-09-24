/* Textureless, cable-spool-specific use E for the shared main WebGPU frame.
 * This is a visual candidate only; the host retains event and sound ownership. */
(function (root) {
  'use strict';

  const OBJECT_ID = 'v302-power-cableSpool-2';
  const EVENT_TYPE = 'object-cableSpool';
  const ANCHOR = Object.freeze({ x: 830, y: 1502 });
  const DURATION_MS = 1320;
  const finite = Number.isFinite;
  const shader = /* wgsl */ `
struct Params {
  viewport: vec4f, // physical width, height, event center x, event center y
  event: vec4f,    // age seconds, zoom*DPR x, zoom*DPR y, reduced motion
  control: vec4f,  // alpha, reserved
};
@group(0) @binding(0) var<uniform> p: Params;

struct VertexOut { @builtin(position) pos: vec4f };
@vertex fn vs(@builtin(vertex_index) id: u32) -> VertexOut {
  let corners = array<vec2f, 3>(vec2f(-1.0,-1.0), vec2f(3.0,-1.0), vec2f(-1.0,3.0));
  var out: VertexOut;
  out.pos = vec4f(corners[id], 0.0, 1.0);
  return out;
}
fn capsule(distance: f32, width: f32) -> f32 {
  return 1.0 - smoothstep(width * 0.55, width, abs(distance));
}
fn ellipse(q: vec2f, radius: vec2f) -> f32 {
  return length(q / radius);
}
@fragment fn fs(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let age = clamp(p.event.x, 0.0, 1.32);
  let dpr = max(p.event.yz, vec2f(0.001));
  let q = (pos.xy - p.viewport.zw) / dpr;
  let reduced = p.event.w > 0.5;
  let motionAge = select(age, 0.48, reduced);
  let release = smoothstep(0.03, 0.30, motionAge);
  let rewind = smoothstep(0.58, 1.02, motionAge);
  let settle = smoothstep(0.96, 1.28, age);

  // A short cable tail pays out, then winds back onto a visible reel hub.
  let tailLength = mix(18.0, 66.0, release) * (1.0 - rewind * 0.82);
  let tailX = q.x - 20.0 - tailLength * 0.5;
  let tailWave = sin((q.x + motionAge * 18.0) * 0.085) * 4.0 * (1.0 - rewind);
  let tailGate = smoothstep(10.0, 16.0, q.x) *
      (1.0 - smoothstep(20.0 + tailLength, 28.0 + tailLength, q.x));
  let cable = capsule(q.y - tailWave, 1.55) * tailGate * (1.0 - settle);

  // The broad flanges and wound cable turns read as a reel, not a generic ring.
  let hub = ellipse(q, vec2f(20.0, 19.0));
  let leftFlange = ellipse(q - vec2f(-23.0, 0.0), vec2f(5.0, 28.0));
  let rightFlange = ellipse(q - vec2f(23.0, 0.0), vec2f(5.0, 28.0));
  let body = max(1.0 - smoothstep(0.90, 1.04, hub),
      max(1.0 - smoothstep(0.83, 1.06, leftFlange),
          1.0 - smoothstep(0.83, 1.06, rightFlange)));
  let hubR = length(q / vec2f(1.0, 0.96));
  let spin = motionAge * (1.0 - smoothstep(0.72, 1.20, age)) * select(1.0, 0.0, reduced);
  let angle = atan2(q.y, q.x) - spin * 5.4;
  let turns = abs(sin(angle * 1.5 + hubR * 0.13));
  let woundCable = exp(-pow((hubR - 12.0) / 2.2, 2.0)) *
      smoothstep(0.28, 0.62, turns) * (0.62 + 0.38 * release);
  let axle = exp(-pow(hubR / 3.4, 2.0));

  let glowHub = exp(-pow(hubR / 31.0, 2.0)) * (0.22 + 0.28 * (1.0 - settle));
  let glowTail = exp(-pow((q.y - tailWave) / 8.0, 2.0)) * tailGate *
      (1.0 - smoothstep(0.0, 1.0, abs(tailX) / max(tailLength, 1.0))) * 0.12;
  let envelope = smoothstep(0.0, 0.075, age) * (1.0 - smoothstep(1.12, 1.32, age));
  let alpha = clamp((body * 0.38 + woundCable * 0.78 + cable * 0.92 +
      axle * 0.52 + glowHub + glowTail) * envelope * p.control.x, 0.0, 0.88);
  let darkMetal = vec3f(0.30, 0.16, 0.055);
  let copper = vec3f(1.0, 0.48, 0.12);
  let warmCore = vec3f(1.0, 0.80, 0.38);
  let rgb = darkMetal * body * 0.23 + copper * (woundCable * 0.72 + cable * 0.68 + glowTail)
      + warmCore * (axle * 0.40 + glowHub * 0.40);
  return vec4f(min(rgb, vec3f(alpha)), alpha);
}`;

  function plan({ effect, now, phase, camera, zoom, viewport,
    reducedMotion = false, alpha = 1 } = {}) {
    if (phase !== 'playing' || effect?.type !== EVENT_TYPE ||
        effect?.objectId !== OBJECT_ID || effect?.effectKind !== 'credits' ||
        (typeof effect.id !== 'string' && typeof effect.id !== 'number') ||
        viewport?.kind !== 'main') return null;
    if (![effect.x, effect.y, effect.startedAt, now, camera?.x, camera?.y, zoom,
      viewport.width, viewport.height, viewport.pixelWidth, viewport.pixelHeight, alpha]
      .every(finite) || effect.x !== ANCHOR.x || effect.y !== ANCHOR.y ||
        zoom <= 0 || alpha <= 0 || alpha > 1 || viewport.width <= 0 || viewport.height <= 0 ||
        !Number.isInteger(viewport.pixelWidth) || !Number.isInteger(viewport.pixelHeight) ||
        viewport.pixelWidth <= 0 || viewport.pixelHeight <= 0) return null;
    const elapsed = now - effect.startedAt;
    if (elapsed < 0 || elapsed >= DURATION_MS) return null;
    const dprX = viewport.pixelWidth / viewport.width;
    const dprY = viewport.pixelHeight / viewport.height;
    const scaleX = zoom * dprX;
    const scaleY = zoom * dprY;
    const x = (ANCHOR.x - camera.x) * scaleX;
    const y = (ANCHOR.y - camera.y) * scaleY;
    const values = new Float32Array([
      viewport.pixelWidth, viewport.pixelHeight, x, y,
      elapsed / 1000, scaleX, scaleY, reducedMotion ? 1 : 0,
      alpha, 0, 0, 0
    ]);
    if (!values.every(finite)) return null;
    return Object.freeze({ effectId: String(effect.id), objectId: OBJECT_ID,
      x, y, elapsed, durationMs: DURATION_MS, reducedMotion: Boolean(reducedMotion), values });
  }

  function create({ renderer, frameOwner = renderer } = {}) {
    if (!frameOwner || frameOwner.state !== 'ready' || !frameOwner.device?.createShaderModule ||
        !frameOwner.device?.queue?.writeBuffer || typeof frameOwner.own !== 'function' ||
        typeof frameOwner.release !== 'function')
      throw new TypeError('Cable spool E requires the shared WebGPU frame owner');
    const device = frameOwner.device;
    const format = frameOwner.format;
    const module = device.createShaderModule({ label: 'DVA cable spool E WGSL', code: shader });
    const bindGroupLayout = device.createBindGroupLayout({ entries: [{ binding: 0,
      visibility: 0x1 | 0x2, buffer: { type: 'uniform' } }] });
    const layout = device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] });
    const blend = { color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
      alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' } };
    const pipeline = device.createRenderPipeline({ label: 'DVA cable spool E', layout,
      vertex: { module, entryPoint: 'vs' },
      fragment: { module, entryPoint: 'fs', targets: [{ format, blend }] },
      primitive: { topology: 'triangle-list' } });
    const slots = [];
    const frameIndices = new WeakMap();
    const frameEvents = new WeakMap();
    let destroyed = false;
    function slot(index) {
      if (slots[index]) return slots[index];
      const uniform = frameOwner.own(device.createBuffer({ label: `DVA cable spool E parameters ${index}`,
        size: 48, usage: 0x40 | 0x08 }));
      const bindGroup = device.createBindGroup({ layout: bindGroupLayout,
        entries: [{ binding: 0, resource: { buffer: uniform } }] });
      return (slots[index] = { uniform, bindGroup });
    }
    function record({ frame, target, viewport, ...input } = {}) {
      if (destroyed || frameOwner.state !== 'ready') throw new Error('Cable spool E pass unavailable');
      if (!frame || typeof frame.add !== 'function' || typeof frame.stage !== 'function' ||
          typeof target !== 'string' || !target)
        throw new TypeError('Cable spool E requires an ordered shared frame and target');
      const command = plan({ ...input, viewport });
      if (!command) return false;
      let seen = frameEvents.get(frame);
      if (!seen) { seen = new Set(); frameEvents.set(frame, seen); }
      if (seen.has(command.effectId)) return false;
      seen.add(command.effectId);
      const index = frameIndices.get(frame) || 0;
      const { uniform, bindGroup } = slot(index);
      device.queue.writeBuffer(uniform, 0, command.values);
      frame.stage('world:cable-spool-e');
      frame.add({ target, label: `DVA cable spool E ${command.effectId}`,
        encode(pass, info) {
          if (info.device !== device || info.format !== format ||
              info.width !== viewport.pixelWidth || info.height !== viewport.pixelHeight)
            throw new Error('Cable spool E target device, format or backing size mismatch');
          pass.setBindGroup(0, bindGroup);
          pass.setPipeline(pipeline);
          pass.draw(3);
        } });
      frameIndices.set(frame, index + 1);
      return true;
    }
    return Object.freeze({ device, plan, record, shader, get state() {
      return destroyed ? 'destroyed' : frameOwner.state;
    }, destroy() {
      if (destroyed) return;
      destroyed = true;
      for (const { uniform } of slots) if (frameOwner.release(uniform)) uniform.destroy();
    } });
  }

  const api = Object.freeze({ OBJECT_ID, EVENT_TYPE, ANCHOR, DURATION_MS, shader, plan, create });
  root.DvaWebGPUCableSpoolE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
