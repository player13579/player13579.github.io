/* Body silhouettes for the shared ordered WebGPU world frame. The caller owns
 * the DvaWebGPUEffectShapes renderer, frame, target, and returned batch. */
(function (root) {
  'use strict';

  const ink = [17 / 255, 24 / 255, 39 / 255, 1];
  const red = [239 / 255, 68 / 255, 68 / 255, 1];
  const white = [248 / 255, 250 / 255, 252 / 255, 1];
  const finite = Number.isFinite;

  function createCommands({ data, camera, zoom, startOrder = 0 } = {}) {
    if (!Array.isArray(data?.bodies) || !camera ||
        ![camera.x, camera.y, zoom, startOrder].every(finite) || zoom <= 0) {
      throw new TypeError('Bodies require game data, camera, positive zoom, and finite order');
    }
    const commands = [];
    data.bodies.forEach((body, index) => {
      if (!body || ![body.x, body.y].every(finite)) {
        throw new TypeError(`Body ${index} requires finite world coordinates`);
      }
      const x = (body.x - camera.x) * zoom;
      const y = (body.y - camera.y) * zoom;
      const order = startOrder + index * 3;
      // Canvas stroke was centered on the 21x12 ellipse with lineWidth 3.
      // Concentric ellipses match its outer/inner axis extents exactly.
      commands.push({ kind: 'ellipse', x, y: y + 8 * zoom,
        rx: 22.5 * zoom, ry: 13.5 * zoom, color: ink, order });
      commands.push({ kind: 'ellipse', x, y: y + 8 * zoom,
        rx: 19.5 * zoom, ry: 10.5 * zoom, color: red, order: order + 1 });
      commands.push({ kind: 'circle', x: x - 9 * zoom, y: y + zoom,
        radius: 6 * zoom, color: white, order: order + 2 });
    });
    return commands;
  }

  function record({ shapes, frame, target, viewport, data, camera, zoom,
    startOrder = 0 } = {}) {
    if (typeof shapes?.enqueue !== 'function' || typeof frame?.add !== 'function' ||
        typeof target !== 'string' || !target || !viewport ||
        ![viewport.width, viewport.height].every(finite) ||
        viewport.width <= 0 || viewport.height <= 0 ||
        !Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth <= 0 ||
        !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight <= 0) {
      throw new TypeError('Bodies require shared shapes, frame, target, and committed logical/physical viewport');
    }
    const commands = createCommands({ data, camera, zoom, startOrder });
    if (!commands.length) return null;
    return shapes.enqueue(frame, { target, width: viewport.width,
      height: viewport.height, pixelWidth: viewport.pixelWidth,
      pixelHeight: viewport.pixelHeight, commands, label: 'DVA bodies' });
  }

  const api = Object.freeze({ createCommands, record });
  root.DvaWebGPUBodies = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
