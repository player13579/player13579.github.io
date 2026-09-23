/* Source-owned marker image uploads for one shared WebGPU device. The caller
 * chooses visible keys; this module creates no canvas, adapter, or device. */
(function (root) {
  'use strict';
  const profileApi = root.DvaWebGPUHeadMarkers ||
    (typeof require === 'function' ? require('./webgpu-head-markers.js') : null);
  const PROFILE_KEYS = Object.freeze(Object.values(profileApi?.PROFILES || {})
    .map(profile => profile[0]));
  const EXTRA_KEYS = Object.freeze(['fireMaterialTransport',
    'aromaScentTransport', 'enhanceHoldMarker',
    'fighterEnergyChargeEffect', 'enhancePropagationLight']);
  const KEYS = Object.freeze([...new Set([...PROFILE_KEYS, ...EXTRA_KEYS])]);
  const ALLOWED = new Set(KEYS);
  const USAGE = 0x02 | 0x04 | 0x10; // COPY_DST | TEXTURE_BINDING | RENDER_ATTACHMENT

  function create({ device } = {}) {
    if (!PROFILE_KEYS.length)
      throw new Error('Head marker profiles must load before marker materials');
    if (!device?.createTexture || !device?.queue?.copyExternalImageToTexture)
      throw new TypeError('Head marker materials need the shared WebGPU device and queue');
    let generation = null, destroyed = false;
    const bySource = new Map(), sourceByKey = new Map();
    function retire(source) {
      const entry = bySource.get(source);
      if (!entry) return;
      bySource.delete(source);
      entry.texture.destroy();
    }
    function clear() {
      for (const source of bySource.keys()) retire(source);
      sourceByKey.clear();
    }
    function requireGeneration(value) {
      if (destroyed) throw new Error('Head marker material cache destroyed');
      if (!Number.isInteger(value) || value < 0)
        throw new TypeError('Head marker materials need a room generation');
      if (generation !== value) {
        clear();
        generation = value;
      }
    }
    function materialFor(key, source, roomGeneration) {
      requireGeneration(roomGeneration);
      if (!ALLOWED.has(key)) throw new Error(`Unsupported head marker texture key: ${key}`);
      const width = Number(source?.naturalWidth), height = Number(source?.naturalHeight);
      const limit = device.limits?.maxTextureDimension2D ?? Infinity;
      if (!source?.complete || !Number.isInteger(width) ||
          !Number.isInteger(height) || width <= 0 || height <= 0 ||
          width > limit || height > limit)
        throw new Error(`Head marker source image unavailable: ${key}`);
      let entry = bySource.get(source);
      if (entry && (entry.width !== width || entry.height !== height)) {
        retire(source);
        entry = null;
      }
      if (!entry) {
        const texture = device.createTexture({ label: `DVA head marker ${key}`,
          size: [width, height], format: 'rgba8unorm', usage: USAGE });
        if (typeof texture?.createView !== 'function' ||
            typeof texture?.destroy !== 'function') {
          texture?.destroy?.();
          throw new TypeError(`Head marker GPU texture invalid: ${key}`);
        }
        try {
          device.queue.copyExternalImageToTexture({ source },
            { texture, premultipliedAlpha: true }, [width, height]);
        } catch (error) {
          texture.destroy();
          throw error;
        }
        entry = Object.freeze({ ready: true, source, device,
          generation: roomGeneration, premultipliedAlpha: true,
          texture, width, height });
        bySource.set(source, entry);
      }
      const previous = sourceByKey.get(key);
      sourceByKey.set(key, source);
      if (previous && previous !== source &&
          ![...sourceByKey.values()].includes(previous)) retire(previous);
      return entry;
    }
    function prepare({ textures, keys, generation: roomGeneration } = {}) {
      requireGeneration(roomGeneration);
      if (!textures || typeof textures !== 'object' ||
          !Array.isArray(keys) || new Set(keys).size !== keys.length)
        throw new TypeError('Head marker preparation needs source textures and distinct visible keys');
      return Object.freeze(Object.fromEntries(keys.map(key =>
        [key, materialFor(key, textures[key], roomGeneration)])));
    }
    return Object.freeze({ device, materialFor, prepare,
      get generation() { return generation; },
      get size() { return bySource.size; },
      destroy() { if (destroyed) return; destroyed = true; clear(); } });
  }
  const api = Object.freeze({ KEYS, PROFILE_KEYS, EXTRA_KEYS, USAGE, create });
  root.DvaWebGPUHeadMarkerMaterials = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
