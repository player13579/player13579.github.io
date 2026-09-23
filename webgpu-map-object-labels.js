/* Near-map-object panels in the shared ordered WebGPU world frame.
 * The caller decides visibility/proximity, owns the atlas and frame lifetime. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const rgba = (r, g, b, a = 1) => [r / 255, g / 255, b / 255, a];
  const PANEL = rgba(9, 20, 28, .94);
  const READY = rgba(248, 250, 252);
  const WAITING = rgba(148, 163, 184);

  function parseColor(value) {
    if (typeof value !== 'string') throw new TypeError('Map object effect color required');
    const hex = value.match(/^#([\da-f]{3}|[\da-f]{6})$/i);
    if (!hex) throw new TypeError('Map object effect color must be hex RGB');
    const digits = hex[1].length === 3 ? [...hex[1]].map(char => char + char).join('') : hex[1];
    return rgba(...[0, 2, 4].map(index => parseInt(digits.slice(index, index + 2), 16)));
  }

  function plan({ scene, camera, zoom, viewport } = {}) {
    if (!Array.isArray(scene) || !camera || !viewport || viewport.kind !== 'main' ||
        ![camera.x, camera.y, zoom, viewport.width, viewport.height].every(finite) ||
        zoom <= 0 || viewport.width <= 0 || viewport.height <= 0) {
      throw new TypeError('Map labels require scene, world camera, zoom, and logical main viewport');
    }
    const entries = [];
    for (const object of scene) {
      if (!object || !object.near) continue;
      if (![object.x, object.y].every(finite) ||
          typeof object.label !== 'string' || typeof object.effectLabel !== 'string') {
        throw new TypeError('Near map object requires position and label strings');
      }
      const x = (object.x - camera.x) * zoom;
      const y = (object.y - camera.y) * zoom;
      entries.push(Object.freeze({
        panelX: x - 76 * zoom, panelY: y + 52 * zoom,
        panelWidth: 152 * zoom, panelHeight: 36 * zoom, radius: 6 * zoom,
        centerX: x, titleY: y + 63 * zoom, effectY: y + 78 * zoom,
        titleSize: 12 * zoom, effectSize: 9 * zoom,
        titleColor: object.ready ? READY : WAITING,
        effectColor: parseColor(object.color),
        label: object.label, effectLabel: object.effectLabel
      }));
    }
    return Object.freeze(entries);
  }

  function create({ textAtlas } = {}) {
    if (typeof textAtlas?.layout !== 'function' || !Array.isArray(textAtlas.textures)) {
      throw new TypeError('Uploaded GPU text atlas required');
    }
    let destroyed = false;
    function makePlan(input) {
      if (destroyed) throw new Error('Map object labels destroyed');
      return plan(input);
    }
    async function prepare(input) {
      const result = makePlan(input);
      if (result.length) {
        if (typeof textAtlas.ensure !== 'function') throw new TypeError('GPU text atlas ensure required');
        await textAtlas.ensure(result.flatMap(entry => [entry.label, entry.effectLabel]).join('\n'));
        if (destroyed) throw new Error('Map object labels destroyed');
      }
      return result;
    }
    function roundedPanel(frame, target, entry) {
      const { panelX: x, panelY: y, panelWidth: w, panelHeight: h, radius: r } = entry;
      // One logical-pixel horizontal strip per row keeps the 6-world-unit
      // corners while leaving scaling to the shared presentation viewport.
      const rows = Math.max(1, Math.ceil(h));
      for (let row = 0; row < rows; row++) {
        const top = y + h * row / rows;
        const bottom = y + h * (row + 1) / rows;
        const distance = Math.min((top + bottom) / 2 - y, y + h - (top + bottom) / 2);
        const inset = distance >= r ? 0 : r - Math.sqrt(Math.max(0, r * r - (r - distance) ** 2));
        frame.rect(target, { x: x + inset, y: top, w: w - inset * 2,
          h: bottom - top, color: PANEL, mode: 'source-over' });
      }
    }
    function layout(entry, text, size) {
      const result = textAtlas.layout(text, { size, missing: 'replace' });
      if (!result || !Array.isArray(result.quads) || !finite(result.width) || !finite(result.height)) {
        throw new Error('Invalid map object text layout');
      }
      for (const glyph of result.quads) {
        if (!textAtlas.textures[glyph.page]) {
          throw new Error(`Map object atlas page ${glyph.page} is not loaded; call prepare first`);
        }
      }
      return result;
    }
    function glyphs(frame, target, entry, result, centerY, color) {
      const left = entry.centerX - result.width / 2;
      const topGlyph = result.quads.length ? Math.min(...result.quads.map(glyph => glyph.y)) : 0;
      const bottomGlyph = result.quads.length
        ? Math.max(...result.quads.map(glyph => glyph.y + glyph.h)) : result.height;
      const top = centerY - (topGlyph + bottomGlyph) / 2;
      for (const glyph of result.quads) {
        frame.sprite(target, { x: left + glyph.x, y: top + glyph.y,
          w: glyph.w, h: glyph.h, uv: glyph.uv,
          texture: textAtlas.textures[glyph.page], color, mode: 'source-over' });
      }
    }
    function draw({ frame, target, viewport, scene, camera, zoom, preparedPlan } = {}) {
      const entries = preparedPlan || makePlan({ scene, camera, zoom, viewport });
      if (destroyed) throw new Error('Map object labels destroyed');
      if (!Array.isArray(entries)) throw new TypeError('Map object plan required');
      if (!entries.length) return 0;
      if (!viewport || viewport.kind !== 'main' ||
          ![viewport.pixelWidth, viewport.pixelHeight].every(value => finite(value) && value > 0) ||
          typeof frame?.stage !== 'function' || typeof frame.rect !== 'function' ||
          typeof frame.sprite !== 'function' || typeof target !== 'string' || !target) {
        throw new TypeError('Shared frame, target, and committed main viewport required');
      }
      const layouts = entries.map(entry => ({
        title: layout(entry, entry.label, entry.titleSize),
        effect: layout(entry, entry.effectLabel, entry.effectSize)
      }));
      frame.stage('world:map-object-labels');
      entries.forEach((entry, index) => {
        roundedPanel(frame, target, entry);
        glyphs(frame, target, entry, layouts[index].title, entry.titleY, entry.titleColor);
        glyphs(frame, target, entry, layouts[index].effect, entry.effectY, entry.effectColor);
      });
      return entries.length;
    }
    return Object.freeze({ plan: makePlan, prepare, draw, destroy() { destroyed = true; } });
  }
  const api = Object.freeze({ create, plan });
  root.DvaWebGPUMapObjectLabels = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
