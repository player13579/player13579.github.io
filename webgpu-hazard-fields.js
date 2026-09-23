/* Persistent hazard material for the shared, ordered WebGPU world frame.
 * World coordinates remain logical; the presentation target owns physical DPR.
 * This pass owns only GPU copies of the already loaded transport atlases. */
(function (root) {
  'use strict';
  const sizes = Object.freeze({ fire: [2304, 2304], water: [3072, 1536], poison: [2304, 2048] });
  const keys = Object.freeze({ fire: 'fireMaterialTransport', water: 'waterMaterialTransport',
    poison: 'poisonMaterialTransport' });
  const poisonPoolPhases = 32;
  const poisonBubblePhases = 32;
  const finite = Number.isFinite;
  const ready = (image, kind) => Boolean(image?.complete &&
    image.naturalWidth === sizes[kind][0] && image.naturalHeight === sizes[kind][1]);
  const cycle = value => ((value % 1) + 1) % 1;

  function plan({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !camera || !viewport ||
        ![camera.x, camera.y, zoom, viewport.width, viewport.height, scene.now].every(finite) ||
        zoom <= 0 || viewport.width <= 0 || viewport.height <= 0) {
      throw new TypeError('Hazard fields require a timed scene, camera, zoom, and logical viewport');
    }
    const fields = Array.isArray(scene.hazardFields) ? scene.hazardFields : [];
    const textures = scene.textures || {};
    const reduced = Boolean(scene.reducedMotion);
    const time = scene.now / 1000;
    const transform = [zoom, 0, 0, zoom, -camera.x * zoom, -camera.y * zoom];
    const commands = [];
    for (const field of fields) {
      const kind = String(field?.kind || '');
      // The old fallback sits behind three unconditional transport branches.
      // It has no authored atlas or defined behavior for other kinds.
      if (!sizes[kind] || !ready(textures[keys[kind]], kind)) continue;
      const x = Number(field.x), y = Number(field.y);
      if (!finite(x) || !finite(y)) continue;
      const radius = Math.max(24, Number(field.radius) || 80);
      const image = textures[keys[kind]];
      const sourceSize = sizes[kind];
      const push = (part, crop, px, py, w, h, weight, mode) => {
        if (weight <= 0) return;
        commands.push(Object.freeze({ kind, part, image,
          sprite: Object.freeze({ x: px, y: py, w, h, crop, sourceSize, transform,
            color: [1, 1, 1, .72 * weight], mode }) }));
      };
      if (kind === 'fire') {
        const size = radius * 2.25;
        const phase = reduced ? 8 : cycle(time * .72 + x * .001) * 32;
        const first = Math.floor(phase), blend = phase - first;
        const fire = (index, weight, part) => push(part,
          [(index % 6) * 384, Math.floor(index / 6) * 384, 384, 384],
          x - size / 2, y - size / 2, size, size, weight, 'additive');
        fire(0, 1, 'root');
        fire(first + 1, (1 - blend) * .9, 'phase-a');
        if (blend > 0) fire((first + 1) % 32 + 1, blend * .9, 'phase-b');
      } else if (kind === 'water') {
        const width = radius * 2.25, height = width * 256 / 384;
        const phase = reduced ? 8 : cycle(time * .48 + x * .001) * 32;
        const first = Math.floor(phase), blend = phase - first;
        const water = (index, weight, part) => push(part,
          [(index % 8) * 384, Math.floor(index / 8) * 256, 384, 256],
          x - width / 2, y - height / 2, width, height, weight, 'source-over');
        water(1, 1, 'settled');
        water(14 + first, (1 - blend) * .65, 'phase-a');
        if (blend > 0) water(14 + (first + 1) % 32, blend * .65, 'phase-b');
      } else {
        const width = radius * 2.25, height = width * 256 / 384;
        const phase = reduced ? .32 : cycle(time * .23 + x * .001);
        const pool = (index, weight, part) => push(part,
          [(index % 6) * 384, Math.floor(index / 6) * 256, 384, 256],
          x - width / 2, y - height / 2, width, height, weight, 'source-over');
        pool(0, 1, 'pool');
        const q = phase * poisonPoolPhases, first = Math.floor(q), blend = q - first;
        pool(first + 1, (1 - blend) * .75, 'phase-a');
        if (blend > 0) pool((first + 1) % poisonPoolPhases + 1, blend * .75, 'phase-b');
        for (let index = 0; index < 3; index += 1) {
          const bubbleCycle = reduced ? .38 : cycle(time * .37 + index * .333);
          if (Math.sin(Math.PI * bubbleCycle) <= .001) continue;
          const frame = bubbleCycle * (poisonBubblePhases - 1);
          const firstBubble = Math.floor(frame), bubbleBlend = frame - firstBubble;
          const size = width * (index === 1 ? .145 : .115);
          const lift = reduced ? 0 : Math.max(0, (bubbleCycle - .3) / .7) * width * .17;
          const bx = x + [-.25, .06, .29][index] * width;
          const by = y + [.035, -.035, .065][index] * width - lift;
          const bubble = (cell, weight, part) => push(part,
            [(cell % 8) * 128, 1536 + Math.floor(cell / 8) * 128, 128, 128],
            bx - size / 2, by - size / 2, size, size, weight, 'source-over');
          bubble(firstBubble, 1 - bubbleBlend, `bubble-${index}-a`);
          if (bubbleBlend > 0) bubble(Math.min(firstBubble + 1, poisonBubblePhases - 1),
            bubbleBlend, `bubble-${index}-b`);
        }
      }
    }
    return Object.freeze(commands);
  }

  function create({ device } = {}) {
    if (!device?.createTexture || !device?.queue?.copyExternalImageToTexture) {
      throw new TypeError('Shared WebGPU device and queue required');
    }
    const cache = new Map(), owned = new Set();
    let destroyed = false;
    function textureFor(command) {
      if (destroyed) throw new Error('Hazard-field pass destroyed');
      const { image, kind } = command;
      const previous = cache.get(image);
      if (previous) return previous;
      const size = sizes[kind];
      const texture = device.createTexture({ label: `DVA ${kind} hazard transport`,
        size, format: 'rgba8unorm', usage: 0x02 | 0x04 | 0x10 });
      try { device.queue.copyExternalImageToTexture({ source: image },
        { texture, premultipliedAlpha: true }, size); }
      catch (error) { texture.destroy(); throw error; }
      cache.set(image, texture);
      owned.add(texture);
      return texture;
    }
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Hazard-field pass destroyed');
      const commands = plan({ scene, camera, zoom, viewport });
      if (!commands.length) return 0;
      if (typeof frame?.stage !== 'function' || typeof frame.sprite !== 'function' ||
          typeof target !== 'string' || !target ||
          ![viewport.pixelWidth, viewport.pixelHeight].every(value => Number.isInteger(value) && value > 0)) {
        throw new TypeError('Shared frame, target, and committed viewport required');
      }
      // Resolve uploads before recording any commands in the shared frame.
      const textures = commands.map(textureFor);
      frame.stage('world:hazard-fields');
      commands.forEach((command, index) => frame.sprite(target,
        { ...command.sprite, texture: textures[index] }));
      return commands.length;
    }
    return Object.freeze({ plan, record, destroy() {
      if (destroyed) return;
      destroyed = true;
      for (const texture of owned) texture.destroy();
      cache.clear(); owned.clear();
    } });
  }
  const api = Object.freeze({ plan, create, ready });
  root.DvaWebGPUHazardFields = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
