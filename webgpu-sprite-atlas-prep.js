/* Sprite atlas preparation for the shared WebGPU renderer. All coordinates in
 * this API are source pixels or logical viewport units, never backing pixels.
 * Metadata must describe the final RGBA pixels after any chroma removal. The
 * module never reads image pixels, creates a 2D context, or owns a GPU device. */
(function (root) {
  'use strict';

  const finite = Number.isFinite;
  function integer(value, name, minimum = 0) {
    if (!Number.isInteger(value) || value < minimum) throw new RangeError(`${name} must be an integer >= ${minimum}`);
    return value;
  }
  function positive(value, name) {
    if (!finite(value) || value <= 0) throw new RangeError(`${name} must be positive and finite`);
    return value;
  }
  function pair(value, name) {
    if (!Array.isArray(value) || value.length !== 2) throw new TypeError(`${name} must be a pair`);
    return value;
  }
  function median(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  }
  function unsupported(reason, requiredMetadata) {
    return Object.freeze({ supported: false, reason, requiredMetadata });
  }

  function createAtlas({ image, size, columns, rows, transparency, bounds, walkMeasurements } = {}) {
    const [width, height] = pair(size, 'size');
    integer(width, 'width', 1); integer(height, 'height', 1);
    integer(columns, 'columns', 1); integer(rows, 'rows', 1);
    if (image && (image.naturalWidth !== width || image.naturalHeight !== height || !image.complete)) {
      throw new RangeError('Loaded image dimensions must match atlas metadata');
    }
    const cellWidth = Math.floor(width / columns), cellHeight = Math.floor(height / rows);
    if (!cellWidth || !cellHeight) throw new RangeError('Atlas cells must be nonempty');
    if (transparency !== 'authored-alpha' && transparency !== 'prepared-rgba') {
      return unsupported('Source transparency has not been established',
        'An authored-alpha source or a preprocessed RGBA asset with exact legacy keying and void masks');
    }
    if (bounds !== undefined) {
      if (!Array.isArray(bounds) || bounds.length !== columns * rows) throw new RangeError('One alpha bound per atlas cell is required');
      bounds.forEach((bound, index) => {
        if (bound === null) return;
        if (!Array.isArray(bound) || bound.length !== 4 || !bound.every(Number.isInteger) ||
            bound[0] < 0 || bound[1] < 0 || bound[2] < bound[0] || bound[3] < bound[1] ||
            bound[2] >= cellWidth || bound[3] >= cellHeight) {
          throw new RangeError(`Invalid alpha bound for cell ${index}`);
        }
      });
    }
    if (walkMeasurements !== undefined) {
      if (columns !== 20 || rows !== 12 || !Array.isArray(walkMeasurements) || walkMeasurements.length !== 240) {
        throw new RangeError('Walk measurements require the 20x12, four-direction, 60-frame atlas');
      }
      walkMeasurements.forEach((item, index) => {
        if (!item || !finite(item.topX) || !Number.isInteger(item.bottom) ||
            item.topX < 0 || item.topX >= cellWidth || item.bottom < 0 || item.bottom >= cellHeight) {
          throw new RangeError(`Invalid walk measurement ${index}`);
        }
      });
    }
    return Object.freeze({ supported: true, image, size: Object.freeze([width, height]),
      columns, rows, cellWidth, cellHeight, transparency,
      bounds: bounds?.map(bound => bound && Object.freeze([...bound])) ?? null,
      walkMeasurements: walkMeasurements?.map(item => Object.freeze({ topX: item.topX, bottom: item.bottom })) ?? null });
  }

  function cell(atlas, column, row, { trim = false } = {}) {
    if (!atlas?.supported) return atlas || unsupported('Atlas is missing', 'Atlas source metadata');
    integer(column, 'column'); integer(row, 'row');
    if (column >= atlas.columns || row >= atlas.rows) throw new RangeError('Cell is outside the atlas');
    const index = row * atlas.columns + column;
    let x = 0, y = 0, width = atlas.cellWidth, height = atlas.cellHeight;
    if (trim) {
      if (!atlas.bounds) return unsupported('Exact alpha crop is unavailable',
        'Cell-local inclusive alpha bounds after transparency preparation, alpha >= 18');
      const bound = atlas.bounds[index];
      if (bound === null) return null;
      x = Math.max(0, bound[0] - 2);
      y = Math.max(0, bound[1] - 2);
      width = Math.min(atlas.cellWidth - 1, bound[2] + 2) - x + 1;
      height = Math.min(atlas.cellHeight - 1, bound[3] + 2) - y + 1;
    }
    return Object.freeze({ x: column * atlas.cellWidth + x, y: row * atlas.cellHeight + y,
      width, height, sourceSize: atlas.size, column, row, index });
  }

  function walkCell(atlas, direction, frame) {
    if (!atlas?.supported) return atlas || unsupported('Atlas is missing', 'Atlas source metadata');
    if (atlas.columns !== 20 || atlas.rows !== 12) throw new RangeError('Walk atlas must be 20x12');
    integer(direction, 'direction'); if (direction > 3) throw new RangeError('Direction must be 0..3');
    if (!finite(frame)) throw new RangeError('Frame must be finite');
    const index = ((Math.floor(frame) % 60) + 60) % 60;
    return cell(atlas, index % 20, direction * 3 + Math.floor(index / 20));
  }

  function walkAnchor(atlas, direction, frame) {
    if (!atlas?.supported) return atlas || unsupported('Atlas is missing', 'Atlas source metadata');
    if (atlas.columns !== 20 || atlas.rows !== 12) throw new RangeError('Walk atlas must be 20x12');
    integer(direction, 'direction'); if (direction > 3) throw new RangeError('Direction must be 0..3');
    if (!finite(frame)) throw new RangeError('Frame must be finite');
    if (!atlas.walkMeasurements) return unsupported('Walk anchor is unavailable',
      'For each direction/frame: alpha > 24 on even x/y pixels; alpha-weighted top x at y <= 0.56 cell height and maximum sampled bottom y');
    const index = ((Math.floor(frame) % 60) + 60) % 60;
    const start = direction * 60;
    const group = atlas.walkMeasurements.slice(start, start + 60);
    const referenceX = median(group.map(item => item.topX));
    const referenceBottom = median(group.map(item => item.bottom));
    const item = group[index];
    return Object.freeze({ x: referenceX - item.topX, y: referenceBottom - item.bottom });
  }

  function spriteCommand(rect, { x, y, maxWidth, maxHeight, anchor = 'bottom', flip = false,
    color = [1, 1, 1, 1], order = 0 } = {}) {
    if (!rect || rect.supported === false) return rect || unsupported('Cell is empty', 'Nonempty alpha bounds');
    if (![x, y, order].every(finite)) throw new RangeError('Position and order must be finite');
    positive(maxWidth, 'maxWidth'); positive(maxHeight, 'maxHeight');
    if (anchor !== 'bottom' && anchor !== 'center') throw new RangeError('Anchor must be bottom or center');
    if (typeof flip !== 'boolean') throw new TypeError('Flip must be boolean');
    const scale = Math.min(maxWidth / rect.width, maxHeight / rect.height);
    const width = rect.width * scale, height = rect.height * scale;
    return Object.freeze({ x: x - width / 2, y: y - (anchor === 'bottom' ? height : height / 2),
      w: width, h: height, crop: [rect.x, rect.y, rect.width, rect.height],
      sourceSize: rect.sourceSize, flipX: flip, color, order, mode: 'source-over' });
  }

  function walkCommand(atlas, direction, frame, { x, y, width, height, color, order } = {}) {
    const rect = walkCell(atlas, direction, frame);
    if (rect?.supported === false) return rect;
    const anchor = walkAnchor(atlas, direction, frame);
    if (anchor?.supported === false) return anchor;
    if (![x, y, width, height].every(finite) || width <= 0 || height <= 0) {
      throw new RangeError('Walk destination must be finite and positive');
    }
    return Object.freeze({ x: x + anchor.x * (width / atlas.cellWidth),
      y: y + anchor.y * (height / atlas.cellHeight), w: width, h: height,
      crop: [rect.x, rect.y, rect.width, rect.height], sourceSize: atlas.size,
      color: color || [1, 1, 1, 1], order: order ?? 0, mode: 'source-over' });
  }

  function createTextureCache(device) {
    if (!device?.createTexture || !device?.queue?.copyExternalImageToTexture) {
      throw new TypeError('Shared WebGPU device and queue are required');
    }
    const textures = new Map(), owned = new Set();
    function textureFor(atlas) {
      if (!atlas?.supported || !atlas.image) throw new TypeError('Loaded supported atlas required');
      const existing = textures.get(atlas.image);
      if (existing && existing.width === atlas.size[0] && existing.height === atlas.size[1]) return existing.texture;
      const texture = device.createTexture({ label: 'DVA sprite atlas', size: atlas.size,
        format: 'rgba8unorm', usage: 0x02 | 0x04 | 0x10 }); // COPY_DST | TEXTURE_BINDING | RENDER_ATTACHMENT
      try {
        device.queue.copyExternalImageToTexture({ source: atlas.image },
          { texture, premultipliedAlpha: true }, atlas.size);
      } catch (error) { texture.destroy(); throw error; }
      owned.add(texture);
      textures.set(atlas.image, { width: atlas.size[0], height: atlas.size[1], texture });
      return texture;
    }
    return Object.freeze({ textureFor,
      record(frame, target, atlas, command) {
        if (!frame?.sprite || !command || command.supported === false) throw new TypeError('Sprite command required');
        frame.sprite(target, { ...command, texture: textureFor(atlas) });
      },
      destroy() { for (const texture of owned) texture.destroy(); owned.clear(); textures.clear(); } });
  }

  const api = Object.freeze({ createAtlas, cell, walkCell, walkAnchor, spriteCommand, walkCommand, createTextureCache });
  root.DvaWebGPUSpriteAtlasPrep = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
