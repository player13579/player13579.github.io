/* Final world overlay for the caller-selected attack target. The caller resolves
 * combat eligibility and rendered player position before constructing the scene.
 * All commands use logical viewport pixels; the shared renderer owns DPR and GPU
 * submission. Call after magic effects and before task indicators. */
(function (root) {
  'use strict';
  const cyan = Object.freeze([34 / 255, 211 / 255, 238 / 255, 1]);
  const finite = Number.isFinite;

  function plan({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !camera || !viewport ||
        ![camera.x, camera.y, zoom, viewport.width, viewport.height].every(finite) ||
        zoom <= 0 || viewport.width <= 0 || viewport.height <= 0) {
      throw new TypeError('Attack target requires a scene, world camera, zoom, and logical viewport');
    }
    const player = scene.selectedTarget;
    if (player == null) return null;
    if (![player.x, player.y].every(finite)) {
      throw new TypeError('Selected target needs finite rendered world coordinates');
    }
    const x = (player.x - camera.x) * zoom;
    const y = (player.y - camera.y) * zoom;
    const left = x - 38 * zoom, top = y - 70 * zoom;
    const width = 76 * zoom, height = 104 * zoom, lineWidth = 5 * zoom;
    const half = lineWidth / 2;
    const rects = [
      { x: left - half, y: top - half, w: width + lineWidth, h: lineWidth },
      { x: left - half, y: top + height - half, w: width + lineWidth, h: lineWidth },
      { x: left - half, y: top + half, w: lineWidth, h: height - lineWidth },
      { x: left + width - half, y: top + half, w: lineWidth, h: height - lineWidth }
    ].map(rect => Object.freeze({ ...rect, color: cyan, mode: 'source-over' }));
    const circle = Object.freeze({ kind: 'arc', x, y: y - 18 * zoom,
      radius: 48 * zoom, start: 0, sweep: Math.PI * 2,
      lineWidth, color: cyan, mode: 'source-over' });
    return Object.freeze({ rects: Object.freeze(rects), circle });
  }

  function record({ frame, shapes, target, viewport, scene, camera, zoom } = {}) {
    if (typeof frame?.stage !== 'function' || typeof frame.rect !== 'function' ||
        typeof frame.add !== 'function' || typeof shapes?.enqueue !== 'function' ||
        typeof target !== 'string' || !target || !viewport ||
        ![viewport.pixelWidth, viewport.pixelHeight].every(Number.isInteger) ||
        viewport.pixelWidth <= 0 || viewport.pixelHeight <= 0) {
      throw new TypeError('Attack target needs the shared frame, effect shapes, target, and committed viewport');
    }
    const commands = plan({ scene, camera, zoom, viewport });
    if (!commands) return null;
    frame.stage('world:attack-targets');
    for (const rect of commands.rects) frame.rect(target, rect);
    // enqueue flushes the four primitive edges first, preserving the Canvas
    // strokeRect -> arc order in the single shared frame stream.
    return shapes.enqueue(frame, { target, width: viewport.width, height: viewport.height,
      pixelWidth: viewport.pixelWidth, pixelHeight: viewport.pixelHeight,
      commands: [commands.circle], label: 'world:attack-targets:circle' });
  }

  const api = Object.freeze({ plan, record });
  root.DvaWebGPUAttackTargets = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
