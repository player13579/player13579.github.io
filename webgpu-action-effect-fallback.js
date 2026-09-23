/* The final ACTION_EFFECT_CELLS branch of drawActionEffect, recorded into the
 * caller's ordered world frame. Source images must already contain the final
 * RGBA that transparentSpriteSource(..., 28) would have produced. No Canvas
 * preparation, GPU readback, adapter, or second device belongs to this pass. */
(function (root) {
  'use strict';

  const CELLS = Object.freeze({
    'action-task': 0, 'action-rest': 3, 'action-teleport': 4,
    'action-warp': 5, 'gunner-passive-aim': 6, 'action-shoot': 7,
    'action-vent': 8, 'action-vending': 9
  });
  const CONDITIONAL = new Set(['action-shoot']);
  const clamp = x => Math.min(1, Math.max(0, x));
  const ease = x => { const t = clamp(x); return t * t * (3 - 2 * t); };
  const finite = Number.isFinite;
  const shader = /* wgsl */ `
struct Params {
  view: vec4f, centerSize: vec4f, motion: vec4f, style: vec4f,
  sourceSize: vec4f
}
@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var material: texture_2d<f32>;
@group(0) @binding(2) var materialSampler: sampler;
struct Vertex { @builtin(position) position: vec4f, @location(0) uv: vec2f }
@vertex fn vs(@builtin(vertex_index) index: u32) -> Vertex {
  let corner = array<vec2f<f32>, 6>(vec2f(0,0),vec2f(1,0),vec2f(0,1),
    vec2f(0,1),vec2f(1,0),vec2f(1,1))[index];
  let margin = vec2f(18.0) / params.centerSize.zw;
  let uv = corner * (vec2f(1.0) + margin * 2.0) - margin;
  let local = (uv - vec2f(0.5)) * params.centerSize.zw + vec2f(0.0, params.motion.w);
  let angle = params.motion.z;
  let turned = vec2f(local.x * cos(angle) - local.y * sin(angle),
                     local.x * sin(angle) + local.y * cos(angle));
  let pixel = params.centerSize.xy + turned;
  var output: Vertex;
  output.position = vec4f(pixel / params.view.xy * vec2f(2.0, -2.0) + vec2f(-1.0, 1.0), 0.0, 1.0);
  output.uv = uv;
  return output;
}
@fragment fn fs(input: Vertex) -> @location(0) vec4f {
  let uv = input.uv;
  let inside = all(uv >= vec2f(0.0)) && all(uv <= vec2f(1.0));
  let source = textureSample(material, materialSampler, clamp(uv, vec2f(0.0), vec2f(1.0)));
  let alpha = select(0.0, source.a, inside);
  let straight = select(vec3f(0.0), source.rgb / max(source.a, 0.0001), source.a > 0.0001);
  let luma = dot(straight, vec3f(0.2126, 0.7152, 0.0722));
  let saturated = mix(vec3f(luma), straight, 1.12);
  let filtered = clamp((saturated * 1.14 - vec3f(0.5)) * 1.1 + vec3f(0.5), vec3f(0.0), vec3f(1.0));
  let envelope = params.style.x;
  let base = filtered * alpha * envelope * 0.42;

  // The two-layer E is source-alpha-bound: the travelling band illuminates
  // authored material while the eight taps spread its colored light outward.
  let clock = params.motion.x;
  let phase = params.style.y;
  let kind = params.style.z;
  let reduced = params.style.w > 0.5;
  var front = 0.0;
  if (!reduced) {
    if (kind < 0.5) {
      let center = fract(clock * 0.82 + phase + params.motion.y * 0.6);
      front = (1.0 - smoothstep(0.0, 0.17, abs(uv.y - center))) * 0.36;
    } else if (kind < 1.5) {
      let center = fract(clock * 1.12 + phase + params.motion.y * 1.2);
      front = (1.0 - smoothstep(0.0, 0.14, abs(uv.x - center))) * 0.44;
    } else if (kind < 2.5) {
      let center = fract(clock * 1.28 + phase + params.motion.y * 0.35);
      front = (1.0 - smoothstep(0.0, 0.12, abs(uv.x - center))) * 0.48;
    } else {
      let sparkle = sin(clock * 4.0 + phase * 6.2831853 + uv.x * 17.0 + uv.y * 13.0);
      front = max(0.0, sparkle) * 0.28;
    }
  }
  let glint = filtered * alpha * front * envelope * 0.86;
  let offset = vec2f(9.0) / params.centerSize.zw;
  var halo = 0.0;
  var haloColor = vec3f(0.0);
  for (var i = 0u; i < 8u; i = i + 1u) {
    let theta = f32(i) * 0.785398163;
    let sampleUV = uv + vec2f(cos(theta), sin(theta)) * offset;
    if (all(sampleUV >= vec2f(0.0)) && all(sampleUV <= vec2f(1.0))) {
      let neighbor = textureSample(material, materialSampler, sampleUV);
      halo += neighbor.a;
      haloColor += neighbor.rgb;
    }
  }
  halo = halo / 8.0;
  haloColor = haloColor / 8.0;
  let bloom = haloColor * envelope * 0.22;
  let outAlpha = alpha * envelope * (0.42 + front * 0.86) + halo * envelope * 0.13;
  return vec4f(base + glint + bloom, min(outAlpha, 1.0));
}`;

  function rejection(effect, branch) {
    const type = String(effect?.type || '');
    if (!(type in CELLS)) return 'bespoke-or-unreachable-type';
    if (type === 'action-task' && effect.variant === 'attendance' && !effect.mode) return 'attendance-owner';
    if (type === 'action-task' && (effect.mode === 'download' || effect.mode === 'upload')) return 'digital-task-owner';
    if (CONDITIONAL.has(type) && branch !== 'after-bespoke-declined') return 'weapon-specific-owner-unresolved';
    return null;
  }
  function mode(type) {
    if (type === 'action-teleport' || type === 'action-warp') return 1;
    if (type === 'action-shoot') return 2;
    if (type === 'gunner-passive-aim') return 3;
    return 0;
  }
  function plan({ effect, progress, now, camera, zoom, viewport, image, reducedMotion = false,
    branch = '' } = {}) {
    const reason = rejection(effect, branch);
    if (reason) return { supported: false, reason };
    if (!camera || !viewport || ![progress, now, effect.x, effect.y, camera.x, camera.y,
      zoom, viewport.width, viewport.height].every(finite) || zoom <= 0 ||
      viewport.width <= 0 || viewport.height <= 0) {
      throw new TypeError('Action fallback needs finite event, clock, camera, zoom, and logical viewport');
    }
    const index = CELLS[effect.type];
    if (!image?.complete || !(image.naturalWidth > 0) || !(image.naturalHeight > 0)) {
      return { supported: true, drawn: false, reason: 'prepared-texture-absent', index };
    }
    if (progress < 0 || progress >= 1) return { supported: true, drawn: false, reason: 'outside-lifetime', index };
    const radius = Math.max(80, Number(effect.radius) || 110);
    const pulse = Math.sin(Math.min(1, progress) * Math.PI);
    const size = radius * (1.15 + progress * 1.25 + pulse * 0.2);
    const alpha = ease(progress / 0.065) * (1 - progress * 0.42) *
      (1 - ease((progress - 0.58) / 0.42));
    const layers = [0, 1].map(layer => {
      const bound = size * (0.88 + layer * 0.16);
      const scale = Math.min(bound / image.naturalWidth, bound / image.naturalHeight);
      return Object.freeze({
        center: [(effect.x - camera.x) * zoom, (effect.y - camera.y) * zoom],
        width: image.naturalWidth * scale * zoom,
        height: image.naturalHeight * scale * zoom,
        rotation: reducedMotion ? 0 : (index % 2 ? 1 : -1) * (progress * 0.28 + layer * 0.08),
        offsetY: -progress * (8 + layer * 5) * zoom,
        alpha: alpha * (0.78 - layer * 0.26),
        phase: layer * 0.43, mode: mode(effect.type), progress,
        time: reducedMotion ? 0 : Math.floor(now / 1000 * 60) / 60,
        reducedMotion: Boolean(reducedMotion)
      });
    });
    return { supported: true, drawn: true, index, image, layers };
  }
  function create({ device, format } = {}) {
    if (!device?.createShaderModule || !device?.createRenderPipeline || !device?.createTexture ||
      !device?.createBuffer || !device?.createBindGroup || !device?.queue?.copyExternalImageToTexture ||
      !device?.queue?.writeBuffer || typeof format !== 'string' || !format) {
      throw new TypeError('Shared WebGPU device and format required');
    }
    const module = device.createShaderModule({ label: 'DVA action fallback material and E', code: shader });
    const pipeline = device.createRenderPipeline({ label: 'DVA action fallback additive', layout: 'auto',
      vertex: { module, entryPoint: 'vs' }, fragment: { module, entryPoint: 'fs',
        targets: [{ format, blend: { color: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
          alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' } } }] },
      primitive: { topology: 'triangle-list' } });
    const sampler = device.createSampler({ magFilter: 'linear', minFilter: 'linear', addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge' });
    const textures = new Map();
    let destroyed = false;
    function textureFor(image) {
      const previous = textures.get(image);
      if (previous?.width === image.naturalWidth && previous?.height === image.naturalHeight) return previous.texture;
      if (previous) previous.texture.destroy();
      const texture = device.createTexture({ label: 'DVA prepared action fallback T',
        size: [image.naturalWidth, image.naturalHeight], format: 'rgba8unorm', usage: 0x02 | 0x04 | 0x10 });
      try { device.queue.copyExternalImageToTexture({ source: image },
        { texture, premultipliedAlpha: true }, [image.naturalWidth, image.naturalHeight]); }
      catch (error) { texture.destroy(); throw error; }
      textures.set(image, { texture, width: image.naturalWidth, height: image.naturalHeight });
      return texture;
    }
    function record({ frame, target, viewport, effect, progress, now, camera, zoom, image,
      reducedMotion, branch, preparedPlan } = {}) {
      if (destroyed) throw new Error('Action fallback renderer destroyed');
      const result = preparedPlan || plan({ effect, progress, now, camera, zoom, viewport,
        image, reducedMotion, branch });
      if (!result.drawn) return result;
      if (!frame?.add || typeof target !== 'string' || !target ||
        !Number.isInteger(viewport?.pixelWidth) || !Number.isInteger(viewport?.pixelHeight) ||
        viewport.pixelWidth < 1 || viewport.pixelHeight < 1) {
        throw new TypeError('Ordered frame and physical presentation size required');
      }
      const texture = textureFor(result.image);
      const leases = [];
      try {
        for (const layer of result.layers) {
          const buffer = device.createBuffer({ label: 'DVA action fallback parameters', size: 80, usage: 0x40 | 0x08 });
          const lease = { buffer, encoded: false, released: false };
          leases.push(lease);
          const values = new Float32Array(20);
          values.set([viewport.width, viewport.height, 0, 0], 0);
          values.set([...layer.center, layer.width, layer.height], 4);
          values.set([layer.time, layer.progress, layer.rotation, layer.offsetY], 8);
          values.set([layer.alpha, layer.phase, layer.mode, layer.reducedMotion ? 1 : 0], 12);
          values.set([result.image.naturalWidth, result.image.naturalHeight, 0, 0], 16);
          device.queue.writeBuffer(buffer, 0, values);
          const bindings = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [
            { binding: 0, resource: { buffer } },
            { binding: 1, resource: texture.createView() }, { binding: 2, resource: sampler }
          ] });
          frame.add({ target, label: 'world:action-effect-fallback', encode(pass, context) {
            if (lease.encoded || lease.released) throw new Error('Action fallback pass closed');
            if (context?.device !== device || context.format !== format || context.target !== target ||
              context.width !== viewport.pixelWidth || context.height !== viewport.pixelHeight) {
              throw new Error('Action fallback needs matching shared GPU target');
            }
            lease.encoded = true;
            pass.setPipeline(pipeline); pass.setBindGroup(0, bindings); pass.draw(6);
          } });
        }
      } catch (error) {
        for (const lease of leases) { if (!lease.released) { lease.released = true; lease.buffer.destroy(); } }
        throw error;
      }
      return { ...result, destroy() {
        for (const lease of leases) { if (!lease.released) { lease.released = true; lease.buffer.destroy(); } }
      } };
    }
    return Object.freeze({ plan, record, destroy() {
      if (destroyed) return;
      destroyed = true;
      for (const entry of textures.values()) entry.texture.destroy();
      textures.clear();
    } });
  }
  const api = Object.freeze({ cells: CELLS, rejection, plan, create, shader });
  root.DvaWebGPUActionEffectFallback = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
