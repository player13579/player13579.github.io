/* Facility effects in the ordered shared WebGPU world frame. The scene is a
 * snapshot: no game globals, 2D surfaces, or hidden clock reads enter here. */
(function (root) {
  'use strict';
  const TAU = Math.PI * 2;
  const finite = Number.isFinite;
  const cycle = value => ((value % 1) + 1) % 1;
  const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, value));
  const ease = value => { const p = clamp(value); return p * p * (3 - 2 * p); };
  const rails = Object.freeze({
    download: [
      [[149,84],[198,84],[250,357],[218,357]],
      [[229,84],[282,84],[278,359],[241,359]],
      [[311,84],[363,84],[298,359],[268,359]]
    ],
    upload: [
      [[99,96],[216,96],[240,248],[259,354],[246,370],[201,253],[94,252]],
      [[204,89],[303,89],[304,196],[268,204],[269,365],[245,365],[244,204],[204,195]],
      [[311,96],[412,96],[415,247],[311,257],[272,365],[252,352],[287,241]]
    ]
  });
  const shader = /* wgsl */ `
struct Draw { geometry: vec4f, crop: vec4f, tint: vec4f,
  polygon: array<vec4f, 7>, count: vec4f }
@group(0) @binding(0) var<uniform> draw: Draw;
@group(0) @binding(1) var image: texture_2d<f32>;
@group(0) @binding(2) var imageSampler: sampler;
struct Vertex { @builtin(position) position: vec4f, @location(0) local: vec2f }
@vertex fn vs(@builtin(vertex_index) index: u32) -> Vertex {
  let corner = array<vec2f, 6>(vec2f(0,0),vec2f(1,0),vec2f(0,1),
    vec2f(0,1),vec2f(1,0),vec2f(1,1))[index];
  var result: Vertex;
  result.position = vec4f((draw.geometry.xy + corner * draw.geometry.zw) /
    draw.crop.zw * vec2f(2,-2) + vec2f(-1,1), 0, 1);
  result.local = corner * 512.0;
  return result;
}
fn inside(point: vec2f) -> bool {
  if (draw.count.x < 1.0) { return true; }
  var crossing = false;
  let count = u32(draw.count.x);
  for (var i = 0u; i < count; i = i + 1u) {
    let j = (i + count - 1u) % count;
    let a = draw.polygon[i].xy;
    let b = draw.polygon[j].xy;
    if ((a.y > point.y) != (b.y > point.y) &&
        point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) {
      crossing = !crossing;
    }
  }
  return crossing;
}
@fragment fn fs(input: Vertex) -> @location(0) vec4f {
  if (input.local.y < draw.count.y || input.local.y >= draw.count.z ||
      !inside(input.local)) { discard; }
  let sample = textureSample(image, imageSampler, input.local / 512.0);
  return sample * draw.tint.w;
}`;
  function ready(image) {
    return Boolean(image && image.complete !== false &&
      (image.naturalWidth || image.width) === 512 && (image.naturalHeight || image.height) === 512);
  }
  function plan({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !camera || !viewport || !Array.isArray(scene.stations) ||
        !Array.isArray(scene.tasks) || !Array.isArray(scene.magicEffects) ||
        ![scene.now, camera.x, camera.y, zoom, viewport.width, viewport.height].every(finite) ||
        zoom <= 0 || viewport.width <= 0 || viewport.height <= 0) {
      throw new TypeError('Facility effects require explicit scene, camera, zoom, and logical viewport');
    }
    const activeIds = new Set(scene.tasks.filter(task => task && !task.done).map(task => task.stationId));
    const commands = [], time = scene.now / 1000;
    const push = (station, kind, values) => commands.push(Object.freeze({
      kind, stationId: station.id, ...values
    }));
    function material(station, index, active, completion = null) {
      const download = station.task === 'download';
      const image = download ? scene.textures?.taskDownloadDigital : scene.textures?.taskUploadDigital;
      if (!ready(image)) return;
      const finishing = Boolean(completion);
      const progress = finishing ? clamp((scene.now - completion.startedAt) / completion.duration) : 0;
      const endActive = active;
      const startActive = finishing ? active || completion.playerId === scene.selfId : active;
      const settle = finishing && !scene.reducedMotion ? ease((progress - .68) / .32) : 0;
      const size = finishing ? (startActive ? 132 : 102) + ((endActive ? 132 : 102) - (startActive ? 132 : 102)) * settle : active ? 132 : 102;
      const strength = finishing ? (startActive ? .96 : .44) + ((endActive ? .96 : .44) - (startActive ? .96 : .44)) * settle : active ? .96 : .44;
      const x = (station.x - camera.x) * zoom, y = (station.y - 10 - camera.y) * zoom;
      const geometry = [x - size * zoom / 2, y - size * zoom / 2, size * zoom, size * zoom];
      const phase = index * .173;
      push(station, 'material', { image, blend: 'screen', geometry, alpha: strength,
        polygon: [], top: 0, bottom: 512 });
      function slice(polygon, top, height, power) {
        const low = clamp(top, 0, 512), high = clamp(top + height, 0, 512);
        if (power <= .0001 || high <= low) return;
        push(station, 'material', { image, blend: 'additive', geometry,
          alpha: strength * power, polygon, top: low, bottom: high });
      }
      for (let lane = 0; lane < 3; lane++) {
        const offset = phase + lane / 3;
        const normal = cycle(time * .58 + offset);
        const initial = finishing ? cycle(completion.startedAt / 1000 * .58 + offset) : normal;
        const flush = finishing ? ease(progress / .68) : 0;
        const travel = scene.reducedMotion ? .5 : finishing ? initial + (1 - initial) * flush : normal;
        const continuing = finishing ? 1 - ease((progress - .63) / .13) : active ? 1 : 0;
        const envelope = scene.reducedMotion ? .32 : Math.sin(Math.PI * travel);
        const head = download ? 90 + 264 * travel : 354 - 240 * travel;
        const rail = rails[station.task][lane];
        for (let tail = 0; tail < 4; tail++) {
          const top = download ? head - 10 - tail * 11 : head + tail * 11;
          slice(rail, top, 11, [1, .58, .24, .07][tail] * envelope * continuing * .84);
        }
        const resume = finishing && active ? ease((progress - .8) / .2) : 0;
        if (resume > 0) {
          const q = scene.reducedMotion ? .5 : normal;
          const headY = download ? 90 + 264 * q : 354 - 240 * q;
          const power = scene.reducedMotion ? .32 : Math.sin(Math.PI * q);
          for (let tail = 0; tail < 4; tail++) {
            slice(rail, download ? headY - 10 - tail * 11 : headY + tail * 11,
              11, [1, .58, .24, .07][tail] * power * resume * .84);
          }
        }
      }
      if (finishing) {
        const release = 1 - ease((progress - .65) / .27);
        const arrival = scene.reducedMotion ? .2 * release : ease((progress - .26) / .30) * release;
        if (download) slice([[179,335],[331,335],[331,416],[179,416]], 335, 81, arrival * .74);
        else for (const rail of rails.upload) slice(rail, 90, 162, arrival * .63);
      }
    }
    scene.stations.forEach((station, localIndex) => {
      const index = Number.isInteger(station?.sourceIndex) && station.sourceIndex >= 0
        ? station.sourceIndex : localIndex;
      if (!station || !finite(station.x) || !finite(station.y) ||
          station.x < camera.x - 150 || station.x > camera.x + viewport.width / zoom + 150 ||
          station.y < camera.y - 150 || station.y > camera.y + viewport.height / zoom + 150) return;
      const active = activeIds.has(station.id), phase = index * .173;
      if (station.type === 'task' && (station.task === 'download' || station.task === 'upload')) {
        const completion = station.completionEffect?.type === 'action-task' &&
          station.completionEffect.mode === station.task &&
          scene.magicEffects.includes(station.completionEffect) &&
          scene.now >= station.completionEffect.startedAt &&
          scene.now < Number(station.completionEffect.startedAt) +
            Number(station.completionEffect.duration)
          ? station.completionEffect : scene.magicEffects.find(effect => effect?.type === 'action-task' &&
          effect.targetId === station.id && (effect.mode === 'download' || effect.mode === 'upload') &&
          scene.now >= effect.startedAt && scene.now < effect.startedAt + effect.duration);
        material(station, index, active, completion || null);
      } else if (station.type === 'utility') {
        const strength = active ? .92 : .2;
        for (let particle = 0; particle < 3; particle++) {
          const progress = cycle(time * (.36 + particle * .025) + phase + particle / 3);
          const sway = Math.sin(time * 2.4 + particle * 2.1 + index) * 9;
          push(station, 'rect', { x: (station.x + sway - 1.5 - camera.x) * zoom,
            y: (station.y + 17 - progress * 62 - camera.y) * zoom,
            w: 3 * zoom, h: 8 * zoom, color: [34 / 255, 211 / 255, 238 / 255,
              Math.sin(progress * Math.PI) * strength] });
        }
        if (active) push(station, 'rect', { x: (station.x - 22 - camera.x) * zoom,
          y: (station.y - 25 - camera.y) * zoom, w: 44 * zoom, h: 2 * zoom,
          color: [103 / 255, 232 / 255, 249 / 255, .4 + Math.sin(time * 5 + phase) * .18] });
      }
      if (station.type === 'emergency') {
        const progress = cycle(time * .62 + phase);
        push(station, 'arc', { x: (station.x - camera.x) * zoom,
          y: (station.y - camera.y) * zoom, radius: (28 + progress * 34) * zoom,
          lineWidth: (4 - progress * 2) * zoom,
          color: [248 / 255, 113 / 255, 113 / 255, (1 - progress) * .72] });
      }
    });
    return Object.freeze(commands);
  }
  function create({ device, format } = {}) {
    if (!device?.createShaderModule || !device?.createRenderPipeline ||
        !device?.createTexture || !device?.queue?.copyExternalImageToTexture ||
        typeof format !== 'string' || !format) throw new TypeError('Shared WebGPU device and format required');
    const module = device.createShaderModule({ label: 'DVA facility material', code: shader });
    const sampler = device.createSampler({ magFilter: 'linear', minFilter: 'linear', addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge' });
    const pipelines = new Map(), textures = new Map(), owned = new Set();
    let destroyed = false;
    function pipeline(mode) {
      if (!pipelines.has(mode)) pipelines.set(mode, device.createRenderPipeline({
        label: `DVA facility ${mode}`, layout: 'auto', vertex: { module, entryPoint: 'vs' },
        fragment: { module, entryPoint: 'fs', targets: [{ format, blend: {
          color: { srcFactor: mode === 'screen' ? 'one-minus-dst' : 'one', dstFactor: 'one', operation: 'add' },
          alpha: { srcFactor: mode === 'screen' ? 'one-minus-dst-alpha' : 'one', dstFactor: 'one', operation: 'add' }
        } }] }, primitive: { topology: 'triangle-list' }
      }));
      return pipelines.get(mode);
    }
    function textureFor(image) {
      if (textures.has(image)) return textures.get(image);
      const texture = device.createTexture({ label: 'DVA task digital material', size: [512, 512],
        format: 'rgba8unorm', usage: 0x02 | 0x04 | 0x10 }); // COPY_DST | TEXTURE_BINDING | RENDER_ATTACHMENT
      try { device.queue.copyExternalImageToTexture({ source: image },
        { texture, premultipliedAlpha: true }, [512, 512]); }
      catch (error) { texture.destroy(); throw error; }
      textures.set(image, texture); owned.add(texture);
      return texture;
    }
    function record({ frame, target, viewport, shapes, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Facility pass destroyed');
      const commands = plan({ scene, camera, zoom, viewport });
      if (!commands.length) return { drawn: 0, batches: [], destroy() {} };
      if (typeof frame?.stage !== 'function' || typeof frame?.add !== 'function' ||
          typeof frame?.rect !== 'function' || typeof shapes?.enqueue !== 'function' ||
          typeof target !== 'string' || !target ||
          ![viewport.pixelWidth, viewport.pixelHeight].every(n => Number.isInteger(n) && n > 0)) {
        throw new TypeError('Facility effects require shared frame, shapes, target, and physical backing');
      }
      const resolved = commands.map(command => command.kind === 'material' ? textureFor(command.image) : null);
      const buffers = [], batches = [];
      frame.stage('world:facility-effects');
      try {
        commands.forEach((command, index) => {
          if (command.kind === 'rect') frame.rect(target, { x: command.x, y: command.y,
            w: command.w, h: command.h, color: command.color, mode: 'additive' });
          else if (command.kind === 'arc') batches.push(shapes.enqueue(frame, {
            target, width: viewport.width, height: viewport.height,
            pixelWidth: viewport.pixelWidth, pixelHeight: viewport.pixelHeight,
            label: 'world:facility-effects:emergency', commands: [{ kind: 'arc',
              x: command.x, y: command.y, radius: command.radius, lineWidth: command.lineWidth,
              start: 0, sweep: TAU, color: command.color, mode: 'additive' }] }));
          else {
            const data = new Float32Array(4 * (4 + 7 + 1));
            data.set(command.geometry, 0);
            data.set([0, 0, viewport.width, viewport.height], 4);
            data.set([1, 1, 1, command.alpha], 8);
            command.polygon.forEach((point, i) => data.set(point, 12 + i * 4));
            data.set([command.polygon.length, command.top, command.bottom, 0], 40);
            const buffer = device.createBuffer({ label: 'DVA facility draw', size: data.byteLength, usage: 0x40 | 0x08 });
            buffers.push(buffer); device.queue.writeBuffer(buffer, 0, data);
            const material = pipeline(command.blend);
            const group = device.createBindGroup({ layout: material.getBindGroupLayout(0), entries: [
              { binding: 0, resource: { buffer } },
              { binding: 1, resource: resolved[index].createView() },
              { binding: 2, resource: sampler }
            ] });
            frame.add({ target, label: 'world:facility-effects:material', encode(pass, context) {
              if (context.device !== device || context.width !== viewport.pixelWidth ||
                  context.height !== viewport.pixelHeight || context.format !== format) {
                throw new Error('Facility pass target/device mismatch');
              }
              pass.setPipeline(material); pass.setBindGroup(0, group); pass.draw(6);
            } });
          }
        });
      } catch (error) {
        buffers.forEach(buffer => buffer.destroy());
        batches.forEach(batch => batch.destroy());
        throw error;
      }
      return { drawn: commands.length, batches, destroy() {
        buffers.forEach(buffer => buffer.destroy());
        batches.forEach(batch => batch.destroy());
      } };
    }
    return Object.freeze({ plan, record, destroy() {
      if (destroyed) return;
      destroyed = true;
      for (const texture of owned) texture.destroy();
      owned.clear(); textures.clear();
    } });
  }
  const api = Object.freeze({ plan, create, ready, shader, rails });
  root.DvaWebGPUFacilityEffects = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
