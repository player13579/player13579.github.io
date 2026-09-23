/* Alchemy objects in the shared ordered WebGPU world frame. The caller owns
 * the scene clock, camera, viewport, frame, shape renderer, and text atlas.
 * World positions become logical viewport pixels here; backing pixels never
 * enter object geometry. Record after mystery boxes and before gravity zones. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const TAU = Math.PI * 2;
  const rgba = (r, g, b, a = 1) => [r / 255, g / 255, b / 255, a];
  const styles = Object.freeze({
    cover: { color: rgba(148, 163, 184), label: '錬成遮蔽物', symbol: '▰', atlas: 'facilityProps', cell: 0, width: 92, height: 82 },
    recharge: { color: rgba(74, 222, 128), label: '回復端末', symbol: '+', atlas: 'roomProps', cell: 1, width: 88, height: 78 },
    decoy: { color: rgba(251, 191, 36), label: '音響デコイ', symbol: '♪', atlas: 'roomProps', cell: 5, width: 92, height: 80 }
  });
  const sourceReady = image => Boolean(image && (image.naturalWidth || image.width) > 0 &&
    (image.naturalHeight || image.height) > 0 && image.complete !== false);
  function sourceFor(atlas, cell) {
    const image = Array.isArray(atlas) ? atlas[cell] : atlas;
    if (!sourceReady(image)) return null;
    const width = image.naturalWidth || image.width, height = image.naturalHeight || image.height;
    return { image, sourceSize: [width, height], crop: Array.isArray(atlas)
      ? [0, 0, width, height]
      : [(cell % 3) * width / 3, Math.floor(cell / 3) * height / 2, width / 3, height / 2] };
  }
  function plan({ scene, textures = {}, camera, zoom, viewport, serverNow, frameNow } = {}) {
    if (!Array.isArray(scene) || !camera || !viewport ||
        ![camera.x, camera.y, zoom, viewport.width, viewport.height, serverNow, frameNow].every(finite) ||
        zoom <= 0 || viewport.width <= 0 || viewport.height <= 0) {
      throw new TypeError('Alchemy objects require a scene, clocks, camera, zoom, and logical viewport');
    }
    const right = camera.x + viewport.width / zoom, bottom = camera.y + viewport.height / zoom;
    const pulse = .5 + Math.sin(frameNow / 210) * .5;
    const entries = [];
    for (const object of scene) {
      if (!object || ![object.x, object.y].every(finite)) continue;
      const margin = Number(object.radius || 90) + 80;
      if (!finite(margin) || object.x < camera.x - margin || object.x > right + margin ||
          object.y < camera.y - margin || object.y > bottom + margin) continue;
      const style = styles[object.type] || styles.decoy;
      const x = (object.x - camera.x) * zoom, y = (object.y - camera.y) * zoom;
      const source = sourceFor(textures[style.atlas], style.cell);
      const remaining = Math.max(0, (Number(object.endsAt) || serverNow) - serverNow);
      entries.push(Object.freeze({ id: object.id, x, y, zoom, style, source,
        pulse, ringRadius: Number(object.radius || 105) * zoom,
        label: `${style.label} ${Math.ceil(remaining / 1000)}秒` }));
    }
    return Object.freeze(entries);
  }
  function create({ device, textAtlas } = {}) {
    if (!device?.createTexture || !device?.queue?.copyExternalImageToTexture ||
        typeof textAtlas?.layout !== 'function' || typeof textAtlas?.ensure !== 'function' ||
        !Array.isArray(textAtlas.textures)) {
      throw new TypeError('Alchemy objects require the shared WebGPU device and text atlas');
    }
    const textures = new Map(), owned = new Set();
    let destroyed = false;
    function makePlan(input) {
      if (destroyed) throw new Error('Alchemy-object pass destroyed');
      return plan(input);
    }
    async function prepare(input) {
      const entries = makePlan(input);
      if (entries.length) await textAtlas.ensure(entries.map(entry =>
        entry.source || entry.style === styles.cover ? entry.label : `${entry.style.symbol}${entry.label}`).join('\n'));
      if (destroyed) throw new Error('Alchemy-object pass destroyed');
      return entries;
    }
    function textureFor(source) {
      const { image, sourceSize } = source;
      const existing = textures.get(image);
      if (existing && existing.width === sourceSize[0] && existing.height === sourceSize[1]) return existing.texture;
      const texture = device.createTexture({ label: 'DVA alchemy prop atlas',
        size: sourceSize, format: 'rgba8unorm', usage: 0x02 | 0x04 | 0x10 });
      try { device.queue.copyExternalImageToTexture({ source: image },
        { texture, premultipliedAlpha: true }, sourceSize); }
      catch (error) { texture.destroy(); throw error; }
      textures.set(image, { width: sourceSize[0], height: sourceSize[1], texture });
      owned.add(texture); // Old-frame references remain alive until pass destruction.
      return texture;
    }
    function textLayout(value, size) {
      const result = textAtlas.layout(value, { size, missing: 'error' });
      if (!result || !Array.isArray(result.quads) || !finite(result.width)) throw new Error('Invalid alchemy text layout');
      for (const glyph of result.quads) if (!textAtlas.textures[glyph.page]) {
        throw new Error(`Alchemy text atlas page ${glyph.page} is not loaded; call prepare first`);
      }
      return result;
    }
    function glyphs(frame, target, result, centerX, centerY, color) {
      const top = result.quads.length ? Math.min(...result.quads.map(g => g.y)) : 0;
      const bottom = result.quads.length ? Math.max(...result.quads.map(g => g.y + g.h)) : result.height;
      const left = centerX - result.width / 2, shiftY = centerY - (top + bottom) / 2;
      for (const glyph of result.quads) frame.sprite(target, { x: left + glyph.x, y: shiftY + glyph.y,
        w: glyph.w, h: glyph.h, uv: glyph.uv, texture: textAtlas.textures[glyph.page],
        color, mode: 'source-over' });
    }
    function roundedRect(frame, target, x, y, w, h, radius, color) {
      const rows = Math.max(1, Math.ceil(h));
      for (let row = 0; row < rows; row++) {
        const top = y + h * row / rows, bottom = y + h * (row + 1) / rows;
        const distance = Math.min((top + bottom) / 2 - y, y + h - (top + bottom) / 2);
        const inset = distance >= radius ? 0 : radius - Math.sqrt(Math.max(0, radius * radius - (radius - distance) ** 2));
        frame.rect(target, { x: x + inset, y: top, w: w - 2 * inset, h: bottom - top,
          color, mode: 'source-over' });
      }
    }
    function record({ frame, shapes, target, viewport, preparedPlan } = {}) {
      if (destroyed) throw new Error('Alchemy-object pass destroyed');
      if (!Array.isArray(preparedPlan)) throw new TypeError('Call prepare before recording alchemy objects');
      if (!preparedPlan.length) return { drawn: 0, batches: [] };
      if (typeof frame?.stage !== 'function' || typeof frame.rect !== 'function' ||
          typeof frame.sprite !== 'function' || typeof shapes?.enqueue !== 'function' ||
          typeof target !== 'string' || !target || !viewport ||
          ![viewport.width, viewport.height].every(value => finite(value) && value > 0) ||
          ![viewport.pixelWidth, viewport.pixelHeight].every(value => Number.isInteger(value) && value > 0)) {
        throw new TypeError('Alchemy objects require the shared frame, shapes, target, and committed viewport');
      }
      // Validate all glyph pages before emitting any part of the pass.
      const layouts = preparedPlan.map(entry => ({ label: textLayout(entry.label, 10 * entry.zoom),
        symbol: entry.source || entry.style === styles.cover ? null :
          textLayout(entry.style.symbol, 22 * entry.zoom) }));
      // Image upload and glyph-page failures must happen before the first frame command.
      const propTextures = preparedPlan.map(entry => entry.source ? textureFor(entry.source) : null);
      const batches = [];
      try {
        frame.stage('world:alchemy-objects');
        preparedPlan.forEach((entry, index) => {
        const { x, y, zoom, style, source, pulse } = entry;
        if (source) frame.sprite(target, { x: x - style.width * zoom / 2,
          y: y - style.height * zoom / 2, w: style.width * zoom, h: style.height * zoom,
          crop: source.crop, sourceSize: source.sourceSize, texture: propTextures[index],
          color: [1, 1, 1, .96], mode: 'source-over' });
        else if (style === styles.cover) {
          roundedRect(frame, target, x - 43 * zoom, y - 35 * zoom, 86 * zoom, 70 * zoom,
            6 * zoom, rgba(51, 65, 85, .94));
          // The Canvas path fills and strokes the cover's rounded rectangle.
          const edge = style.color, t = (3 + pulse * 2) * zoom;
          frame.rect(target, { x: x - 43 * zoom, y: y - 35 * zoom, w: 86 * zoom, h: t, color: edge });
          frame.rect(target, { x: x - 43 * zoom, y: y + 35 * zoom - t, w: 86 * zoom, h: t, color: edge });
          frame.rect(target, { x: x - 43 * zoom, y: y - 35 * zoom, w: t, h: 70 * zoom, color: edge });
          frame.rect(target, { x: x + 43 * zoom - t, y: y - 35 * zoom, w: t, h: 70 * zoom, color: edge });
        } else batches.push(shapes.enqueue(frame, { target, width: viewport.width, height: viewport.height,
          pixelWidth: viewport.pixelWidth, pixelHeight: viewport.pixelHeight,
          commands: [{ kind: 'circle', x, y, radius: 28 * zoom, color: rgba(8, 25, 32, .9) },
            { kind: 'arc', x, y, radius: 28 * zoom, start: 0, sweep: TAU,
              lineWidth: (3 + pulse * 2) * zoom, color: style.color }],
          label: 'world:alchemy-objects:fallback' }));
        if (style !== styles.cover) batches.push(shapes.enqueue(frame, { target,
          width: viewport.width, height: viewport.height,
          pixelWidth: viewport.pixelWidth, pixelHeight: viewport.pixelHeight,
          commands: [{ kind: 'arc', x, y, radius: entry.ringRadius, start: 0, sweep: TAU,
            lineWidth: (3 + pulse * 2) * zoom,
            color: [...style.color.slice(0, 3), .24 + pulse * .14] }],
          label: 'world:alchemy-objects:pulse' }));
        if (!source && style === styles.cover) frame.rect(target, { x: x - 12 * zoom,
          y: y - 5 * zoom, w: 24 * zoom, h: 10 * zoom, color: style.color,
          mode: 'source-over' });
        else if (!source) glyphs(frame, target, layouts[index].symbol, x, y, style.color);
        roundedRect(frame, target, x - 54 * zoom, y + 43 * zoom, 108 * zoom, 28 * zoom,
          5 * zoom, rgba(8, 20, 28, .9));
        glyphs(frame, target, layouts[index].label, x, y + 57 * zoom, rgba(248, 250, 252));
        });
      } catch (error) {
        // The owner must discard its failed frame. Release our already-enqueued
        // shape buffers here, keeping the first recording error intact.
        for (const batch of batches) {
          try { batch?.destroy?.(); } catch (_) {}
        }
        throw error;
      }
      return { drawn: preparedPlan.length, batches };
    }
    return Object.freeze({ plan: makePlan, prepare, record, destroy() {
      if (destroyed) return;
      destroyed = true;
      for (const texture of owned) texture.destroy();
      owned.clear(); textures.clear();
    } });
  }
  const api = Object.freeze({ plan, create });
  root.DvaWebGPUAlchemyObjects = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
