/* Ground-item commands for the shared ordered WebGPU primitive batch.
 * Coordinates enter in world units and leave in logical viewport pixels. The caller
 * owns the camera, nearest-item decision, batch, device, and text atlas. */
(function (root) {
  'use strict';
  const firearmCells = Object.freeze({ handgun: 0, smg: 1, assault: 2, sniper: 3 });
  const finite = Number.isFinite;
  const sizeForKind = kind => kind === 'sword' ? [76, 42] :
    kind === 'heavy' ? [72, 42] : kind === 'invention' ? [68, 48] : [56, 38];
  const ready = image => image?.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
  function createCommands({ groundItems, nearestId = null, textures = {}, camera, zoom,
    viewport, order = 0 } = {}) {
    if (!Array.isArray(groundItems) || !camera || !viewport ||
        ![camera.x, camera.y, zoom, viewport.width, viewport.height, order].every(finite) ||
        zoom <= 0 || viewport.width <= 0 || viewport.height <= 0) {
      throw new TypeError('Ground items require a world camera and positive logical viewport');
    }
    const sx = zoom, sy = zoom;
    const world = [sx, 0, 0, sy, -camera.x * sx, -camera.y * sy];
    const commands = [];
    let sequence = 0;
    for (const item of groundItems) {
      if (!item) continue;
      const x = Number(item.x) || 0, y = Number(item.y) || 0;
      const angle = (Number(item.angle) || 0) * .18;
      if (![x, y, angle].every(finite)) continue;
      const px = (x - camera.x) * sx, py = (y - camera.y) * sy;
      // The presentation target clips partial quads. This conservative bound
      // skips only items fully beyond it, including glow and prompt extents.
      if (px < -100 * sx || px > viewport.width + 100 * sx ||
          py < -80 * sy || py > viewport.height + 80 * sy) continue;
      const selected = nearestId !== null && nearestId === item.id;
      const push = (part, values) => commands.push(Object.freeze({
        stage: 'world:ground-items', part, itemId: item.id, order: order + sequence++, ...values
      }));
      push('shadow', { x: x - 35, y: y - 2, w: 70, h: 22, transform: world });
      if (selected) push('halo', { x: x - 50, y: y - 34, w: 100, h: 68, transform: world });
      const asset = String(item.asset || '');
      const cell = firearmCells[asset];
      let image = null, crop = null, dimensions = null;
      if (Number.isInteger(cell) && ready(textures.groundFirearmIcons)) {
        image = textures.groundFirearmIcons;
        crop = [cell * image.naturalWidth / 4, 0, image.naturalWidth / 4, image.naturalHeight];
        dimensions = [68, 34];
      } else if (ready(textures.groundItemTextures?.[asset])) {
        image = textures.groundItemTextures[asset];
        dimensions = sizeForKind(String(item.kind || ''));
      }
      if (image) push('art', { image, asset, ...(crop ? { crop } : {}),
        sourceSize: [image.naturalWidth, image.naturalHeight],
        x: x - dimensions[0] / 2, y: y - dimensions[1] / 2,
        w: dimensions[0], h: dimensions[1], rotation: angle, pivot: [0.5, 0.5], transform: world });
      else {
        const cosine = Math.cos(angle), sine = Math.sin(angle);
        const rotatedWorld = [sx * cosine, sy * sine, -sx * sine, sy * cosine,
          sx * (x - cosine * x + sine * y - camera.x),
          sy * (y - sine * x - cosine * y - camera.y)];
        push('fallback', { x: x - 25, y: y - 9, w: 50, h: 18,
          transform: rotatedWorld, selected });
      }
      if (selected) push('label', { text: `E 拾う ${item.label || 'アイテム'}`,
        centerX: px, bottomY: (y - 28 - camera.y) * sy, fontSize: 13 * zoom });
    }
    return Object.freeze(commands);
  }

  // Masks are generated as RGBA bytes; no 2D canvas or GPU readback is used.
  function maskBytes(kind, width = 128, height = 64) {
    const bytes = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const u = (x + .5 - width / 2) / (width / 2);
      const v = (y + .5 - height / 2) / (height / 2);
      const radius = Math.hypot(u, v);
      const alpha = kind === 'shadow' ? (radius <= .94 ? .35 : 0) :
        .42 * Math.exp(-Math.pow(Math.max(0, radius - .55) * 4, 2));
      const color = kind === 'shadow' ? [7, 15, 27] : [103, 232, 249];
      const i = (y * width + x) * 4;
      bytes[i] = Math.round(color[0] * alpha);
      bytes[i + 1] = Math.round(color[1] * alpha);
      bytes[i + 2] = Math.round(color[2] * alpha);
      bytes[i + 3] = Math.round(alpha * 255);
    }
    return bytes;
  }
  function createTextureCache(device) {
    if (!device?.createTexture || !device?.queue?.copyExternalImageToTexture || !device.queue.writeTexture) {
      throw new TypeError('The shared WebGPU device and queue are required');
    }
    const imageTextures = new Map(), owned = new Set(), masks = new Map();
    let destroyed = false;
    function createTexture(label, width, height) {
      const texture = device.createTexture({ label, size: [width, height], format: 'rgba8unorm',
        usage: 0x02 | 0x04 | 0x10 }); // COPY_DST | TEXTURE_BINDING | RENDER_ATTACHMENT
      owned.add(texture);
      return texture;
    }
    function textureFor(command) {
      if (destroyed) throw new Error('Ground-item cache destroyed');
      if (command.part === 'shadow' || command.part === 'halo') {
        if (!masks.has(command.part)) {
          const texture = createTexture(`DVA ground ${command.part}`, 128, 64);
          try { device.queue.writeTexture({ texture }, maskBytes(command.part),
            { bytesPerRow: 128 * 4 }, { width: 128, height: 64 }); }
          catch (error) { texture.destroy(); owned.delete(texture); throw error; }
          masks.set(command.part, texture);
        }
        return masks.get(command.part);
      }
      const image = command.image;
      if (!ready(image)) throw new TypeError('Ground-item image is unavailable');
      const cached = imageTextures.get(image);
      if (cached && cached.width === image.naturalWidth && cached.height === image.naturalHeight) return cached.texture;
      const texture = createTexture(`DVA ground ${command.asset}`, image.naturalWidth, image.naturalHeight);
      try { device.queue.copyExternalImageToTexture({ source: image },
        { texture, premultipliedAlpha: true }, [image.naturalWidth, image.naturalHeight]); }
      catch (error) { texture.destroy(); owned.delete(texture); throw error; }
      // Retain replaced textures until the owner destroys this cache: an older
      // frame may still reference one between recording and GPU submission.
      imageTextures.set(image, { width: image.naturalWidth, height: image.naturalHeight, texture });
      return texture;
    }
    function record(batch, command, textAtlas) {
      if (!command || command.stage !== 'world:ground-items') throw new TypeError('Ground-item command required');
      if (command.part === 'label') {
        if (!textAtlas?.layout || !Array.isArray(textAtlas.textures)) return false;
        const layout = textAtlas.layout(command.text, { size: command.fontSize });
        if (layout.quads.some(glyph => !textAtlas.textures[glyph.page])) return false;
        const left = command.centerX - layout.width / 2;
        const top = command.bottomY - layout.height;
        const edge = command.fontSize * (2 / 13);
        for (const offset of [[-edge, 0], [edge, 0], [0, -edge], [0, edge], [0, 0]]) {
          for (const glyph of layout.quads) {
            const texture = textAtlas.textures[glyph.page];
            batch.sprite({ x: left + glyph.x + offset[0], y: top + glyph.y + offset[1],
              w: glyph.w, h: glyph.h, uv: glyph.uv, texture,
              color: offset[0] || offset[1] ? [8 / 255, 15 / 255, 27 / 255, .88] :
                [236 / 255, 254 / 255, 1, 1], order: command.order });
          }
        }
        return true;
      }
      if (command.part === 'fallback') {
        batch.rect({ ...command, color: command.selected ? [165 / 255, 243 / 255, 252 / 255, 1] :
          [203 / 255, 213 / 255, 225 / 255, 1] });
        const border = [15 / 255, 23 / 255, 42 / 255, 1];
        for (const [dx, dy, w, h] of [[0, 0, 50, 2], [0, 16, 50, 2], [0, 2, 2, 14], [48, 2, 2, 14]]) {
          batch.rect({ ...command, x: command.x + dx, y: command.y + dy, w, h, color: border });
        }
        return true;
      }
      batch.sprite({ ...command, texture: textureFor(command),
        color: [1, 1, 1, 1], mode: 'source-over' });
      return true;
    }
    return Object.freeze({ textureFor, record, destroy() {
      if (destroyed) return;
      destroyed = true;
      for (const texture of owned) texture.destroy();
      owned.clear(); masks.clear(); imageTextures.clear();
    } });
  }
  const api = Object.freeze({ createCommands, createTextureCache, maskBytes });
  root.DvaWebGPUGroundItems = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
