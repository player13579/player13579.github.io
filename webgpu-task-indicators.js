/* Task edge labels for the shared ordered WebGPU renderer frame. The caller
 * schedules draw after world and before HUD, and owns the uploaded text atlas. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (value, low, high) => Math.min(Math.max(value, low), high);
  const ink = [230 / 255, 251 / 255, 1, 1];
  const shadow = [2 / 255, 18 / 255, 28 / 255, .22];
  const shadowOffsets = Object.freeze([
    [-2, 0], [2, 0], [0, -2], [0, 2],
    [-1, -1], [1, -1], [-1, 1], [1, 1]
  ]);

  function plan({ data, camera, zoom, viewport } = {}) {
    if (!data || !camera || !viewport || viewport.kind !== 'main' ||
        ![camera.x, camera.y, zoom, viewport.width, viewport.height].every(finite) ||
        zoom <= 0 || viewport.width <= 0 || viewport.height <= 0) {
      throw new TypeError('Task indicators require game data, camera, zoom, and a logical main viewport');
    }
    if (data.self?.role !== 'defender' || data.phase !== 'playing') return Object.freeze([]);
    const labels = [];
    for (const task of data.self.tasks || []) {
      if (task.done) continue;
      const station = data.map?.stations?.find(item => item.id === task.stationId);
      if (!station) continue;
      const sx = (station.x - camera.x) * zoom;
      const sy = (station.y - camera.y) * zoom;
      if (![sx, sy].every(finite)) continue;
      if (sx >= 28 && sy >= 28 && sx <= viewport.width - 28 && sy <= viewport.height - 28) continue;
      labels.push(Object.freeze({
        text: task.type === 'download' ? 'DL' : 'UP',
        x: clamp(sx, 34, viewport.width - 34),
        y: clamp(sy, 34, viewport.height - 34), stationId: station.id
      }));
    }
    return Object.freeze(labels);
  }

  function create({ textAtlas } = {}) {
    if (typeof textAtlas?.layout !== 'function' || !Array.isArray(textAtlas.textures)) {
      throw new TypeError('Uploaded GPU text atlas required');
    }
    let destroyed = false;
    function draw({ frame, target, viewport, data, camera, zoom } = {}) {
      if (destroyed) throw new Error('Task indicator pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame.sprite !== 'function' ||
          typeof target !== 'string' || !target || !viewport ||
          ![viewport.pixelWidth, viewport.pixelHeight].every(finite) ||
          viewport.pixelWidth <= 0 || viewport.pixelHeight <= 0) {
        throw new TypeError('Shared renderer frame, target, and committed WebGPU viewport required');
      }
      const labels = plan({ data, camera, zoom, viewport });
      if (!labels.length) return 0;
      const layouts = labels.map(label => textAtlas.layout(label.text, { size: 12 }));
      for (const layout of layouts) {
        if (layout.quads.some(glyph => !textAtlas.textures[glyph.page])) {
          throw new Error('Task indicator atlas page is not loaded; ensure DL and UP before drawing');
        }
      }
      frame.stage('task-indicators');
      labels.forEach((label, index) => {
        const layout = layouts[index];
        const left = label.x - layout.width / 2;
        const top = label.y - layout.height / 2;
        for (const [dx, dy] of [...shadowOffsets, [0, 0]]) {
          for (const glyph of layout.quads) {
            frame.sprite(target, { x: left + glyph.x + dx, y: top + glyph.y + dy,
              w: glyph.w, h: glyph.h, uv: glyph.uv,
              texture: textAtlas.textures[glyph.page], color: dx || dy ? shadow : ink,
              mode: 'source-over' });
          }
        }
      });
      return labels.length;
    }
    return Object.freeze({ draw, destroy() {
      destroyed = true;
    } });
  }
  const api = Object.freeze({ create, plan });
  root.DvaWebGPUTaskIndicators = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
