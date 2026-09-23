/* Main-frame WebGPU sensory blackout. The caller owns the shared frame,
 * text atlas, logical viewport and authoritative server-time estimate. */
(function (root) {
  'use strict';
  const BLACK = Object.freeze([3 / 255, 5 / 255, 6 / 255, 1]);
  const PALE = Object.freeze([215 / 255, 227 / 255, 233 / 255, 1]);

  function message(scene) {
    const until = Number(scene?.unconsciousUntil);
    const now = Number(scene?.now);
    if (!Number.isFinite(until) || !Number.isFinite(now) || until <= now) return null;
    return `意識消失 ${Math.max(0, (until - now) / 1000).toFixed(1)}秒`;
  }

  async function prepare(scene, text) {
    const value = message(scene);
    if (!value) return false;
    if (typeof text?.ensure !== 'function') throw new TypeError('Shared GPU text atlas required');
    await text.ensure(value);
    return true;
  }

  function enqueue({ frame, target, viewport, scene, text } = {}) {
    const value = message(scene);
    if (!value) return Object.freeze({ drawn: false });
    if (!frame?.stage || !frame?.rect || !frame?.sprite ||
        typeof target !== 'string' || !target || viewport?.kind !== 'main' ||
        !(viewport.width > 0 && viewport.height > 0) ||
        !text?.layout || !Array.isArray(text.textures)) {
      throw new TypeError('Shared WebGPU frame, main viewport and text atlas required');
    }
    const layout = text.layout(value, { x: 0, y: 0, size: 24 });
    if (!Array.isArray(layout?.quads) || !Number.isFinite(layout.width) ||
        !Number.isFinite(layout.height)) throw new Error('Invalid sensory text layout');
    for (const glyph of layout.quads) {
      if (!text.textures[glyph.page]) throw new Error('Sensory text atlas page is not loaded');
    }
    frame.stage('sensory');
    frame.rect(target, { x: 0, y: 0, w: viewport.width, h: viewport.height, color: BLACK });
    for (const glyph of layout.quads) {
      frame.sprite(target, {
        x: viewport.width / 2 + glyph.x - layout.width / 2,
        y: viewport.height / 2 + glyph.y - layout.height / 2,
        w: glyph.w, h: glyph.h, uv: glyph.uv,
        texture: text.textures[glyph.page], color: PALE
      });
    }
    return Object.freeze({ drawn: true, message: value, glyphs: layout.quads.length });
  }

  const api = Object.freeze({ message, prepare, enqueue });
  root.DvaWebGPUSensoryBlackout = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
