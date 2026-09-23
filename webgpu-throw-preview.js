/* Throw landing preview in the shared ordered WebGPU world frame. The caller
 * resolves gameplay state and owns the frame, device, target, and atlas. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  const mod = n => ((n % 1) + 1) % 1;
  const ink = (r, g, b, a = 1) => [r / 255, g / 255, b / 255, a];
  const shader = /* wgsl */ `
struct Params { view: vec4f, rect: vec4f, motion: vec4f, style: vec4f }
@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var material: texture_2d<f32>;
@group(0) @binding(2) var materialSampler: sampler;
struct Vertex { @builtin(position) position: vec4f, @location(0) uv: vec2f }
@vertex fn vs(@builtin(vertex_index) index: u32) -> Vertex {
  let corner = array<vec2f, 6>(vec2f(0,0),vec2f(1,0),vec2f(0,1),
    vec2f(0,1),vec2f(1,0),vec2f(1,1))[index];
  let margin = vec2f(14.0) / params.rect.zw;
  let uv = corner * (vec2f(1.0) + margin * 2.0) - margin;
  let offset = (uv - vec2f(0.5)) * params.rect.zw;
  let angle = params.style.z;
  let rotated = vec2f(offset.x * cos(angle) - offset.y * sin(angle),
    offset.x * sin(angle) + offset.y * cos(angle));
  let pixel = params.rect.xy + params.rect.zw * 0.5 + rotated;
  var out: Vertex;
  out.position = vec4f(pixel / params.view.xy * vec2f(2.0,-2.0) + vec2f(-1.0,1.0), 0.0, 1.0);
  out.uv = uv;
  return out;
}
@fragment fn fs(input: Vertex) -> @location(0) vec4f {
  let uv = input.uv;
  let inside = all(uv >= vec2f(0.0)) && all(uv <= vec2f(1.0));
  let icon = params.style.y > 0.5;
  // The 1213px Clairvoyance sheet has a fixed transparent rim. Canvas cropped
  // that rim before fitting the 979x906 authored silhouette to its icon box.
  let sourceUV = select(uv, vec2f(117.0, 153.0) / 1213.0 +
    uv * vec2f(979.0, 906.0) / 1213.0, icon);
  let source = textureSample(material, materialSampler, clamp(sourceUV, vec2f(0.0), vec2f(1.0)));
  let body = select(vec4f(0.0), source, inside);
  let clock = select(params.motion.x * 0.76 + params.motion.y * 0.52,
    params.motion.x * 0.64 + 0.73 * 1.35 + 0.24 * 0.18, icon);
  var highlight = 0.0;
  if (!icon && params.motion.z < 0.5) {
    for (var i = 0u; i < 4u; i = i + 1u) {
      let angle = f32(i) * 1.570796327;
      let phase = clock * 2.4 + angle;
      let settle = 0.76 + sin(phase) * 0.08;
      let center = vec2f(0.5) + vec2f(cos(angle) * 0.26, sin(angle) * 0.2) * settle;
      let p = (uv - center) / vec2f(0.09);
      let mask = clamp(1.0 - length(p), 0.0, 1.0);
      highlight += mask * (0.26 + max(0.0, sin(phase)) * 0.22);
    }
  }
  if (icon && params.motion.z < 0.5) {
    // A narrow horizon sweep is masked by the authored eye silhouette. The
    // movement is source-clock driven, while reduced motion holds the image.
    let travel = fract(clock * 0.23 + 0.73);
    let center = 0.12 + travel * 0.76;
    let band = 1.0 - smoothstep(0.015, 0.10, abs(uv.y - center));
    let aperture = smoothstep(0.06, 0.23, uv.x) * (1.0 - smoothstep(0.77, 0.94, uv.x));
    highlight = band * aperture * 0.56;
  }
  let pixel = vec2f(1.0) / params.rect.zw;
  let blurStep = pixel * 7.0;
  var halo = 0.0;
  for (var i = 0u; i < 8u; i = i + 1u) {
    let angle = f32(i) * 0.785398163;
    let displaced = uv + vec2f(cos(angle), sin(angle)) * blurStep;
    let haloUV = select(displaced, vec2f(117.0, 153.0) / 1213.0 +
      displaced * vec2f(979.0, 906.0) / 1213.0, icon);
    halo += textureSample(material, materialSampler,
      clamp(haloUV, vec2f(0.0), vec2f(1.0))).a;
  }
  halo = halo / 8.0;
  let alpha = params.style.x;
  let base = body * (alpha * select(0.75, 0.17 * 2.35, icon));
  let glint = body * min(highlight * 0.98 * 2.5, 1.0) * alpha;
  let glow = vec4f(0.14, 0.76, 0.9, 1.0) * halo * select(0.12, 0.16, icon) * alpha;
  return base + glint + glow;
}`;

  function plan({ scene, camera, zoom, viewport, image } = {}) {
    if (!scene || !camera || !viewport || ![camera.x, camera.y, zoom,
      viewport.width, viewport.height].every(finite) || zoom <= 0 ||
      viewport.width <= 0 || viewport.height <= 0) {
      throw new TypeError('Throw preview requires resolved scene, camera, zoom, and logical viewport');
    }
    if (!scene.landing || !image?.complete || image.naturalWidth !== 1254 || image.naturalHeight !== 1254) {
      return null;
    }
    const landing = scene.landing;
    if (!landing.origin || ![landing.x, landing.y, landing.origin.x, landing.origin.y,
      landing.distance, scene.now, scene.mapWidth, scene.mapHeight].every(finite)) {
      throw new TypeError('Resolved landing, map size, and clock must be finite');
    }
    const mapDiagonal = Math.max(1, Math.hypot(scene.mapWidth, scene.mapHeight));
    const distanceRatio = clamp(landing.distance / mapDiagonal);
    const size = 92 + distanceRatio * 26;
    const markerX = Math.round(landing.x), markerY = Math.round(landing.y);
    const x = (markerX - camera.x) * zoom, y = (markerY - camera.y) * zoom;
    const now = scene.now;
    // The source freezes only the shared texture animation for reduced motion;
    // the outer glints, trajectory, alpha pulse, and optional icon keep running.
    const textureTime = scene.reducedMotion ? 0 : now;
    const alpha = 0.82 + Math.sin(now * 4.8) * 0.08;
    const glints = [];
    for (let index = 0; index < 5; index++) {
      const cycle = mod(now * (0.72 + index * 0.035) + index * 0.19);
      glints.push({ x: x + Math.sin(index * 2.17) * size * 0.31 * zoom,
        y: y + (-18 - cycle * 34) * zoom, alpha: Math.sin(cycle * Math.PI) * 0.7,
        color: index % 2 ? ink(250, 204, 21) : ink(103, 232, 249) });
    }
    const trajectoryLength = Math.hypot(markerX - landing.origin.x, markerY - landing.origin.y);
    const particleCount = Math.max(5, Math.min(16, Math.floor(trajectoryLength / 48)));
    const particles = [];
    for (let index = 1; index <= particleCount; index++) {
      const baseT = index / (particleCount + 1);
      const flow = mod(now * 0.46 + baseT);
      const t = 0.08 + flow * 0.84;
      const px = landing.origin.x + (markerX - landing.origin.x) * t;
      const arcHeight = Math.sin(t * Math.PI) * Math.min(118, 42 + trajectoryLength * 0.085);
      const py = landing.origin.y + (markerY - landing.origin.y) * t - arcHeight;
      particles.push({ x: (px - camera.x) * zoom, y: (py - camera.y) * zoom,
        size: (2.2 + index % 3 * 0.8) * zoom,
        alpha: Math.sin(t * Math.PI) * (0.28 + distanceRatio * 0.34),
        rotation: Math.PI / 4 + t * 0.9,
        color: index % 2 ? ink(253, 230, 138) : ink(165, 243, 252),
        glow: index % 2 ? ink(250, 204, 21) : ink(34, 211, 238) });
    }
    let clairvoyanceIcon = null;
    if (scene.targeting && scene.clairvoyance) {
      const progress = .24, reveal = 1, impulse = Math.sin(progress * Math.PI);
      const sampledTime = Math.floor(now * 60) / 60;
      const wave = Math.sin((sampledTime * .64 + .73) * Math.PI * 2);
      const iconSize = Math.min(92, Math.max(48, 118 * .58)) * (.78 + reveal * .22);
      const width = iconSize * 1.08, height = iconSize * 906 / 979 * .9;
      clairvoyanceIcon = {
        x: x + (5 * impulse + 2.1 * wave) * zoom - width * zoom / 2,
        y: y - (4 + iconSize * .12) * zoom + (-4 * impulse + .5 * wave) * zoom - height * zoom / 2,
        width: width * zoom, height: height * zoom, rotation: .025 * impulse,
        textureTime: scene.reducedMotion ? 0 : sampledTime, alpha: reveal
      };
    }
    return { x, y, size: size * zoom, now, textureTime, alpha, distanceRatio, glints,
      particles, targeting: Boolean(scene.targeting), valid: Boolean(landing.valid),
      clairvoyance: Boolean(scene.targeting && scene.clairvoyance),
      clairvoyanceIcon,
      markerWorld: { x: markerX, y: markerY } };
  }

  function create({ device, format, textAtlas } = {}) {
    if (!device?.createShaderModule || !device?.createTexture || !device.queue?.copyExternalImageToTexture ||
      !device.createRenderPipeline || !device.createBuffer || !textAtlas?.layout ||
      !Array.isArray(textAtlas.textures) || typeof format !== 'string' || !format) {
      throw new TypeError('Shared device, format, and GPU text atlas required');
    }
    const module = device.createShaderModule({ label: 'DVA throw landing mask and glow', code: shader });
    const pipeline = device.createRenderPipeline({ label: 'DVA throw landing preview', layout: 'auto',
      vertex: { module, entryPoint: 'vs' }, fragment: { module, entryPoint: 'fs',
        targets: [{ format, blend: { color: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
          alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' } } }] },
      primitive: { topology: 'triangle-list' } });
    const sampler = device.createSampler({ magFilter: 'linear', minFilter: 'linear', addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge' });
    const cached = new Map();
    let destroyed = false;
    function textureFor(image, size) {
      if (!image?.complete || image.naturalWidth !== size || image.naturalHeight !== size) return null;
      if (cached.has(image)) return cached.get(image);
      const texture = device.createTexture({ label: 'DVA throw preview image', size: [size, size],
        format: 'rgba8unorm', usage: 0x02 | 0x04 | 0x10 });
      try { device.queue.copyExternalImageToTexture({ source: image },
        { texture, premultipliedAlpha: true }, [size, size]); }
      catch (error) { texture.destroy(); throw error; }
      cached.set(image, texture);
      return texture;
    }
    async function prepare(input) {
      const result = plan(input);
      if (result?.clairvoyance && (!input?.clairvoyanceImage?.complete ||
          input.clairvoyanceImage.naturalWidth !== 1213 ||
          input.clairvoyanceImage.naturalHeight !== 1213)) {
        throw new Error('Clairvoyance throw preview image unavailable');
      }
      if (result?.targeting) {
        if (typeof textAtlas.ensure !== 'function') throw new TypeError('GPU text atlas ensure required');
        await textAtlas.ensure(result.valid ? '接地点 / 離して確定 / Escでキャンセル' : '着地不可 / 移動またはEscでキャンセル');
      }
      return result;
    }
    function record({ frame, target, viewport, scene, camera, zoom, image, clairvoyanceImage,
      preparedPlan } = {}) {
      if (destroyed) throw new Error('Throw preview pass destroyed');
      const result = preparedPlan || plan({ scene, camera, zoom, viewport, image });
      if (!result) return null;
      if (result.clairvoyance && (!clairvoyanceImage?.complete ||
          clairvoyanceImage.naturalWidth !== 1213 || clairvoyanceImage.naturalHeight !== 1213))
        throw new Error('Clairvoyance throw preview image unavailable');
      if (!frame?.add || !frame?.rect || !frame?.sprite || !frame?.stage ||
        typeof target !== 'string' || !target || !Number.isInteger(viewport?.pixelWidth) ||
        !Number.isInteger(viewport?.pixelHeight) || viewport.pixelWidth < 1 || viewport.pixelHeight < 1) {
        throw new TypeError('Shared frame and committed target required');
      }
      const label = result.targeting ? result.valid
        ? '接地点 / 離して確定 / Escでキャンセル' : '着地不可 / 移動またはEscでキャンセル' : null;
      const layout = label && textAtlas.layout(label, { size: 13 * zoom, missing: 'replace' });
      if (layout) for (const glyph of layout.quads) if (!textAtlas.textures[glyph.page]) {
        throw new Error('Throw preview glyph page unavailable; call prepare first');
      }
      const texture = textureFor(image, 1254);
      if (!texture) return null;
      const uniform = device.createBuffer({ label: 'DVA throw preview parameters', size: 64, usage: 0x40 | 0x08 });
      let iconUniform = null;
      let released = false, encoded = false;
      try {
      const values = new Float32Array(16);
      values.set([viewport.width, viewport.height, 0, 0], 0);
      values.set([result.x - result.size / 2, result.y - result.size / 2, result.size, result.size], 4);
      values.set([result.textureTime, result.distanceRatio, scene.reducedMotion ? 1 : 0, 0], 8);
      values.set([result.alpha, 0, 0, 0], 12);
      device.queue.writeBuffer(uniform, 0, values);
      const bindings = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [
        { binding: 0, resource: { buffer: uniform } },
        { binding: 1, resource: texture.createView() },
        { binding: 2, resource: sampler }
      ] });
      frame.stage('world:throw-preview:marker');
      frame.add({ target, label: 'world:throw-preview:masked-glow', encode(pass, context) {
        if (encoded || released) throw new Error('Throw preview pass is closed');
        if (context?.device !== device || context.format !== format ||
            context.width !== viewport.pixelWidth || context.height !== viewport.pixelHeight ||
            context.target !== target) {
          throw new Error('Throw preview pass needs matching shared GPU target');
        }
        encoded = true;
        pass.setPipeline(pipeline); pass.setBindGroup(0, bindings); pass.draw(6);
      } });
      frame.stage('world:throw-preview:glints');
      for (const glint of result.glints) {
        frame.rect(target, { x: glint.x - 1.5 * zoom, y: glint.y - 4 * zoom,
          w: 3 * zoom, h: 8 * zoom, color: [...glint.color.slice(0, 3), glint.alpha], mode: 'additive' });
      }
      if (layout) {
        const w = Math.max(146 * zoom, layout.width + 24 * zoom), h = 28 * zoom;
        const x = result.x - w / 2, y = result.y + result.size * 0.55;
        const fill = result.valid ? ink(8, 25, 39, .9) : ink(69, 10, 10, .92);
        const edge = result.valid ? ink(103, 232, 249, .95) : ink(251, 113, 133, .95);
        const radius = 8 * zoom, border = 2 * zoom;
        frame.stage('world:throw-preview:label');
        // Rounded bands preserve the small 8px corners without a separate path API.
        const bands = Math.max(1, Math.ceil(h));
        for (let row = 0; row < bands; row++) {
          const top = row * h / bands, bottom = (row + 1) * h / bands;
          const distance = Math.min(top + (bottom - top) / 2, h - top - (bottom - top) / 2);
          const inset = distance < radius ? radius - Math.sqrt(Math.max(0, radius * radius - (radius - distance) ** 2)) : 0;
          frame.rect(target, { x: x + inset, y: y + top, w: w - inset * 2,
            h: bottom - top, color: distance < border ? edge : fill });
          if (distance >= border) {
            frame.rect(target, { x: x + inset, y: y + top, w: border, h: bottom - top, color: edge });
            frame.rect(target, { x: x + w - inset - border, y: y + top, w: border, h: bottom - top, color: edge });
          }
        }
        const quads = layout.quads;
        const top = quads.length ? Math.min(...quads.map(g => g.y)) : 0;
        const bottom = quads.length ? Math.max(...quads.map(g => g.y + g.h)) : layout.height;
        for (const glyph of quads) frame.sprite(target, { x: result.x - layout.width / 2 + glyph.x,
          y: y + h / 2 - (top + bottom) / 2 + glyph.y, w: glyph.w, h: glyph.h,
          uv: glyph.uv, texture: textAtlas.textures[glyph.page], color: ink(248, 250, 252) });
      }
      frame.stage('world:throw-preview:trajectory');
      for (const particle of result.particles) {
        frame.rect(target, { x: particle.x - particle.size * 1.5, y: particle.y - particle.size * 1.5,
          w: particle.size * 3, h: particle.size * 3, rotation: particle.rotation,
          color: [...particle.glow.slice(0, 3), particle.alpha * .12], mode: 'additive' });
        frame.rect(target, { x: particle.x - particle.size / 2, y: particle.y - particle.size / 2,
          w: particle.size, h: particle.size, rotation: particle.rotation,
          color: [...particle.color.slice(0, 3), particle.alpha], mode: 'additive' });
      }
      if (result.clairvoyance) {
        const icon = textureFor(clairvoyanceImage, 1213);
        if (!icon) throw new Error('Clairvoyance throw preview image unavailable');
        const profile = result.clairvoyanceIcon;
        iconUniform = device.createBuffer({ label: 'DVA Clairvoyance throw parameters', size: 64, usage: 0x40 | 0x08 });
        const iconValues = new Float32Array(16);
        iconValues.set([viewport.width, viewport.height, 0, 0], 0);
        iconValues.set([profile.x, profile.y, profile.width, profile.height], 4);
        iconValues.set([profile.textureTime, 0, scene.reducedMotion ? 1 : 0, 0], 8);
        iconValues.set([profile.alpha, 1, profile.rotation, 0], 12);
        device.queue.writeBuffer(iconUniform, 0, iconValues);
        const iconBindings = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [
          { binding: 0, resource: { buffer: iconUniform } },
          { binding: 1, resource: icon.createView() },
          { binding: 2, resource: sampler }
        ] });
        frame.stage('world:throw-preview:clairvoyance');
        let iconEncoded = false;
        frame.add({ target, label: 'world:throw-preview:clairvoyance-scan', encode(pass, context) {
          if (iconEncoded || released) throw new Error('Clairvoyance throw preview pass is closed');
          if (context?.device !== device || context.format !== format ||
              context.width !== viewport.pixelWidth || context.height !== viewport.pixelHeight ||
              context.target !== target) throw new Error('Clairvoyance throw preview needs matching shared GPU target');
          iconEncoded = true;
          pass.setPipeline(pipeline); pass.setBindGroup(0, iconBindings); pass.draw(6);
        } });
      }
      return { drawn: true, uniform, destroy() {
        if (released) return;
        released = true;
        uniform.destroy();
        iconUniform?.destroy();
      } };
      } catch (error) {
        if (!released) { released = true; uniform.destroy(); iconUniform?.destroy(); }
        throw error;
      }
    }
    return Object.freeze({ plan, prepare, record, destroy() {
      if (destroyed) return;
      destroyed = true;
      for (const texture of cached.values()) texture.destroy();
      cached.clear();
    } });
  }
  const api = Object.freeze({ plan, create, shader });
  root.DvaWebGPUThrowPreview = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
