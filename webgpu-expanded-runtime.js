/* WebGPU-only expanded-map presentation owner. The caller supplies scene and
 * layout observations on its existing game loop; this module owns no RAF. */
(function (root) {
  'use strict';
  const rendererDefault = root.DvaWebGPURenderer || (typeof require === 'function' ? require('./webgpu-renderer.js') : null);
  const viewportDefault = root.DvaWebGPUViewport || (typeof require === 'function' ? require('./webgpu-viewport.js') : null);
  const textDefault = root.DvaWebGPUText || (typeof require === 'function' ? require('./webgpu-text.js') : null);
  const expandedDefault = root.DvaWebGPUExpandedMap || (typeof require === 'function' ? require('./webgpu-expanded-map.js') : null);
  const scriptUrl = root.document?.currentScript?.src || root.location?.href;
  const defaultBaseUrl = scriptUrl ? new URL('assets/generated/webgpu-text/', scriptUrl).href : null;

  async function create(options = {}) {
    const { canvas, target = 'expanded-map', manifest: suppliedManifest,
      rendererApi = rendererDefault, viewportApi = viewportDefault,
      textApi = textDefault, expandedApi = expandedDefault,
      fetcher = root.fetch, decode = root.createImageBitmap,
      atlasBaseUrl = defaultBaseUrl, gpu } = options;
    if (!canvas || typeof canvas.getContext !== 'function' || !atlasBaseUrl ||
        !rendererApi?.create || !viewportApi?.createStableGate || !textApi?.upload ||
        !expandedApi?.create || typeof fetcher !== 'function' || typeof decode !== 'function') {
      throw new TypeError('Expanded WebGPU canvas, APIs, atlas URL, fetch and decoder required');
    }
    let renderer, text, expanded, handle;
    let disposed = false, localFailure = null, generation = 0;
    const gate = viewportApi.createStableGate();
    function cleanup() {
      if (disposed) return;
      generation += 1;
      disposed = true;
      gate.suspend();
      try { expanded?.destroy(); } finally {
        try { text?.destroy(); } finally {
          try { handle?.unregister(); } catch (_) { /* Device may already be lost. */ }
          renderer?.destroy();
        }
      }
    }
    function failed(error) {
      localFailure = error instanceof Error ? error : new Error(String(error));
      try { cleanup(); } catch (_) { /* Preserve the first failure. */ }
      try { options.onFailure?.(localFailure); } catch (_) { /* Preserve the GPU failure. */ }
    }
    try {
      const manifest = suppliedManifest || await (async () => {
        const response = await fetcher(new URL('atlas.json', atlasBaseUrl).href);
        if (!response?.ok) throw new Error('Expanded map text atlas manifest unavailable');
        return response.json();
      })();
      if (manifest?.schema !== 'dva-webgpu-text-atlas-v1') throw new Error('Invalid expanded map text atlas manifest');
      renderer = await rendererApi.create({ gpu, onFailure: failed,
        powerPreference: options.powerPreference, deviceDescriptor: options.deviceDescriptor,
        format: options.format });
      if (disposed) {
        renderer.destroy();
        throw localFailure || new Error('WebGPU renderer unavailable');
      }
      if (renderer.state !== 'ready') throw renderer.failure || new Error('WebGPU renderer unavailable');
      text = await textApi.upload({ device: renderer.device, manifest, baseUrl: atlasBaseUrl,
        fetcher, decode });
      if (disposed) {
        text.destroy();
        throw localFailure || new Error('WebGPU renderer unavailable');
      }
      expanded = expandedApi.create({ device: renderer.device, format: renderer.format, text });
      // Registration starts at a valid physical backing. The first stable
      // viewport observation resizes it before the first frame.
      handle = renderer.registerTarget(target, canvas, { width: Math.max(1, canvas.width || 1),
        height: Math.max(1, canvas.height || 1), logicalWidth: 1200, logicalHeight: 760 });
    } catch (error) {
      try { cleanup(); } catch (_) {}
      throw error;
    }
    async function draw(scene, { sample, rect, dpr = 1, padding } = {}) {
      if (disposed) throw localFailure || new Error('Expanded WebGPU runtime destroyed');
      if (!scene?.map) throw new TypeError('Expanded map scene and map required');
      const drawGeneration = generation;
      const viewport = gate.observe(sample, { kind: 'expanded', rect, dpr,
        map: scene.map, padding, maxTextureDimension2D: renderer.device.limits.maxTextureDimension2D });
      if (!viewport) return Object.freeze({ drawn: false, reason: 'unstable-layout' });
      try {
        await expanded.prepare(scene);
        if (drawGeneration !== generation || disposed || gate.suspended) {
          return Object.freeze({ drawn: false, reason: 'suspended' });
        }
        handle.resize(viewport.pixelWidth, viewport.pixelHeight);
        const frame = renderer.beginFrame('DVA expanded map');
        let resources;
        try {
          resources = expanded.draw({ frame, target, viewport, scene });
          const passes = frame.submit();
          return Object.freeze({ drawn: true, passes, viewport });
        } catch (error) {
          try { frame.discard(); } catch (_) {}
          throw error;
        } finally { resources?.release(); }
      } catch (error) {
        if (drawGeneration !== generation) {
          return Object.freeze({ drawn: false, reason: 'suspended' });
        }
        failed(error);
        throw error;
      }
    }
    return Object.freeze({
      get state() { return localFailure || renderer.state === 'failed' ? 'failed' : disposed ? 'destroyed' : 'ready'; },
      get failure() { return localFailure || renderer.failure || null; },
      get viewport() { return gate.snapshot; },
      draw,
      suspend() { generation += 1; gate.suspend(); },
      destroy: cleanup
    });
  }
  const api = Object.freeze({ create });
  root.DvaWebGPUExpandedRuntime = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
