/* World-space sound rings in the shared WebGPU world frame. The caller owns
 * scene expiry, the frame, and disposal of the returned shape batch. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const TAU = Math.PI * 2;
  const red = [239 / 255, 68 / 255, 68 / 255, 1];
  const gold = [251 / 255, 191 / 255, 36 / 255, 1];
  const clamp = value => Math.min(1, Math.max(0, value));

  function plan({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !Array.isArray(scene.effects) || !finite(scene.now) ||
        !camera || ![camera.x, camera.y, zoom].every(finite) || zoom <= 0 ||
        !viewport || ![viewport.width, viewport.height].every(value => finite(value) && value > 0)) {
      throw new TypeError('World sound rings require a scene, camera, zoom and logical viewport');
    }
    const commands = [];
    for (const effect of scene.effects) {
      if (!effect || ![effect.x, effect.y, effect.startedAt, effect.duration].every(finite) ||
          effect.duration <= 0 || scene.now - effect.startedAt >= effect.duration) continue;
      const progress = clamp((scene.now - effect.startedAt) / effect.duration);
      const alpha = 1 - progress;
      const x = (effect.x - camera.x) * zoom;
      const y = (effect.y - camera.y) * zoom;
      commands.push({ kind: 'arc', x, y, radius: (28 + progress * 125) * zoom,
        lineWidth: (5 - progress * 2) * zoom, start: 0, sweep: TAU,
        color: red, alpha, mode: 'source-over' });
      commands.push({ kind: 'arc', x, y, radius: (16 + progress * 55) * zoom,
        lineWidth: 3 * zoom, start: 0, sweep: TAU,
        color: gold, alpha, mode: 'source-over' });
    }
    return commands;
  }

  function record({ shapes, frame, target, viewport, scene, camera, zoom } = {}) {
    if (typeof shapes?.enqueue !== 'function' || !frame ||
        typeof target !== 'string' || !target ||
        !Number.isInteger(viewport?.pixelWidth) || viewport.pixelWidth < 1 ||
        !Number.isInteger(viewport?.pixelHeight) || viewport.pixelHeight < 1) {
      throw new TypeError('World sound rings require a shared GPU frame and committed target');
    }
    const commands = plan({ scene, camera, zoom, viewport });
    if (!commands.length) return null;
    return shapes.enqueue(frame, { target, width: viewport.width,
      height: viewport.height, pixelWidth: viewport.pixelWidth,
      pixelHeight: viewport.pixelHeight, label: 'world:sound-effects', commands });
  }

  const api = Object.freeze({ plan, record });
  root.DvaWebGPUWorldSoundEffects = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
