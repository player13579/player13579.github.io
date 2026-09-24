/* Live-game Sunbeam-only WebGPU presentation. The Canvas field remains visible
 * until this transparent target submits the exact source-owned effect. */
(function (root) {
  'use strict';
  const rendererDefault = root.DvaWebGPURenderer ||
    (typeof require === 'function' ? require('./webgpu-renderer.js') : null);
  const effectDefault = root.DvaWebGPUSunbeamE ||
    (typeof require === 'function' ? require('./webgpu-sunbeam-e.js') : null);
  const TARGET = 'sunbeam-live-overlay';
  function validRect(rect) {
    return rect && [rect.left, rect.top, rect.width, rect.height].every(Number.isFinite) &&
      rect.width > 0 && rect.height > 0;
  }
  async function create({ canvas, rendererApi = rendererDefault,
    effectApi = effectDefault, gpu, onFailure } = {}) {
    if (!canvas?.getContext || !rendererApi?.create || !effectApi?.create)
      throw new TypeError('Sunbeam live overlay needs its WebGPU surface and E pass');
    const renderer = await rendererApi.create({ gpu, onFailure });
    if (renderer.state !== 'ready') throw new Error('Sunbeam live WebGPU renderer unavailable');
    let target, effect;
    try {
      target = renderer.registerTarget(TARGET, canvas, { width: Math.max(1, canvas.width || 1),
        height: Math.max(1, canvas.height || 1), logicalWidth: 980,
        logicalHeight: 620, alphaMode: 'premultiplied' });
      effect = effectApi.create();
    } catch (error) {
      try { target?.unregister(); } catch (_) {}
      renderer.destroy();
      throw error;
    }
    let destroyed = false;
    function draw({ effects, camera, zoom, rect, dpr = 1, nowMs,
      reducedMotion = false } = {}) {
      if (destroyed || renderer.state !== 'ready') throw new Error('Sunbeam live overlay unavailable');
      if (!Array.isArray(effects) || !effects.length || !validRect(rect) ||
          ![camera?.x, camera?.y, zoom, dpr, nowMs].every(Number.isFinite) ||
          zoom <= 0 || dpr <= 0) return Object.freeze({ drawn: false, ids: [] });
      const pixelWidth = Math.round(rect.width * dpr);
      const pixelHeight = Math.round(rect.height * dpr);
      if (pixelWidth < 1 || pixelHeight < 1 ||
          pixelWidth > renderer.device.limits.maxTextureDimension2D ||
          pixelHeight > renderer.device.limits.maxTextureDimension2D)
        return Object.freeze({ drawn: false, ids: [] });
      const viewport = Object.freeze({ kind: 'main', width: 980, height: 620,
        pixelWidth, pixelHeight });
      const scene = Object.freeze({ effects, nowMs, reducedMotion });
      const planned = effectApi.plan({ scene, camera, zoom, viewport });
      if (planned.length !== effects.length ||
          planned.some((entry, index) => entry.id !== String(effects[index].id)))
        return Object.freeze({ drawn: false, ids: [] });
      target.resize(pixelWidth, pixelHeight, { width: 980, height: 620 });
      const frame = renderer.beginFrame('DVA live Sunbeam E');
      try {
        frame.clear(TARGET, [0, 0, 0, 0]);
        const result = effect.record({ frame, target: TARGET, viewport,
          scene, camera, zoom });
        if (result.drawn !== planned.length || result.commands.length === 0)
          throw new Error('Sunbeam live E did not record its planned effects');
        frame.submit();
        return Object.freeze({ drawn: true, ids: Object.freeze(planned.map(item => item.id)),
          viewport });
      } catch (error) {
        try { frame.discard(); } catch (_) {}
        throw error;
      }
    }
    function destroy() {
      if (destroyed) return;
      destroyed = true;
      try { effect.destroy(); } finally {
        try { target.unregister(); } finally { renderer.destroy(); }
      }
    }
    return Object.freeze({ draw, destroy,
      get state() { return destroyed ? 'destroyed' : renderer.state; } });
  }
  const api = Object.freeze({ create });
  root.DvaWebGPUSunbeamLiveOverlay = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
