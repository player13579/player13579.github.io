/* Late gravity impact and caster-barrier residue for the shared WebGPU world frame.
 * Geometry is authored in world units; DPR belongs only to the presentation target. */
(function (root) {
  'use strict';
  const STORM_CELLS = [[3430,486,489,484,12,12,512,512],[492,486,490,485,11,11,512,512],[1962,486,490,485,11,11,512,512],[1968,0,491,486,11,11,512,512],[3443,0,492,485,10,12,512,512],[0,0,492,486,10,12,512,512],[492,0,492,486,10,12,512,512],[984,0,492,486,10,13,512,512],[0,486,492,485,10,14,512,512],[1476,0,492,486,10,14,512,512],[2459,0,492,485,10,15,512,512],[2951,0,492,485,10,15,512,512],[2940,486,490,484,11,16,512,512],[982,486,490,485,11,16,512,512],[1472,486,490,485,11,16,512,512],[2452,486,488,485,12,16,512,512],[976,971,487,484,13,16,512,512],[1463,971,486,484,13,16,512,512],[1949,971,485,484,14,16,512,512],[2921,971,484,483,14,16,512,512],[3405,971,484,483,14,16,512,512],[486,1455,484,482,14,16,512,512],[1455,1455,484,481,14,16,512,512],[2424,1455,484,480,14,16,512,512],[2908,1455,484,480,14,16,512,512],[3392,1455,484,480,14,16,512,512],[1939,1455,485,480,13,16,512,512],[970,1455,485,481,13,15,512,512],[0,1455,486,482,13,14,512,512],[2434,971,487,483,12,13,512,512],[0,971,488,484,12,12,512,512],[488,971,488,484,12,12,512,512],[2928,2185,244,242,6,7,256,256],[3172,2185,244,242,6,7,256,256],[1952,2430,244,242,6,7,256,256],[732,2672,244,242,6,7,256,256],[1464,2672,244,242,6,7,256,256],[1708,2672,244,242,6,7,256,256],[1952,2672,244,242,6,7,256,256],[2196,2672,244,242,6,7,256,256],[2440,2672,244,242,6,7,256,256],[2684,2672,244,242,6,7,256,256],[3416,2185,244,242,6,7,256,256],[3660,2185,244,242,6,7,256,256],[0,2430,244,242,6,7,256,256],[244,2430,244,242,6,7,256,256],[488,2430,244,242,6,7,256,256],[732,2430,244,242,6,7,256,256],[976,2430,244,242,6,7,256,256],[1220,2430,244,242,6,7,256,256],[1464,2430,244,242,6,7,256,256],[1708,2430,244,242,6,7,256,256],[2196,2430,244,242,6,7,256,256],[2440,2430,244,242,6,7,256,256],[2684,2430,244,242,6,7,256,256],[2928,2430,244,242,6,7,256,256],[3172,2430,244,242,6,7,256,256],[3416,2430,244,242,6,7,256,256],[3660,2430,244,242,6,7,256,256],[0,2672,244,242,6,7,256,256],[244,2672,244,242,6,7,256,256],[488,2672,244,242,6,7,256,256],[976,2672,244,242,6,7,256,256],[1220,2672,244,242,6,7,256,256],[2928,2672,244,242,6,7,256,256],[3172,2672,244,242,6,7,256,256],[1952,2914,244,242,6,7,256,256],[732,3156,244,242,6,7,256,256],[1464,3156,244,242,6,7,256,256],[1708,3156,244,242,6,7,256,256],[1952,3156,244,242,6,7,256,256],[2196,3156,244,242,6,7,256,256],[2440,3156,244,242,6,7,256,256],[2684,3156,244,242,6,7,256,256],[3416,2672,244,242,6,7,256,256],[3660,2672,244,242,6,7,256,256],[0,2914,244,242,6,7,256,256],[244,2914,244,242,6,7,256,256],[488,2914,244,242,6,7,256,256],[732,2914,244,242,6,7,256,256],[976,2914,244,242,6,7,256,256],[1220,2914,244,242,6,7,256,256],[1464,2914,244,242,6,7,256,256],[1708,2914,244,242,6,7,256,256],[2196,2914,244,242,6,7,256,256],[2440,2914,244,242,6,7,256,256],[2684,2914,244,242,6,7,256,256],[2928,2914,244,242,6,7,256,256],[3172,2914,244,242,6,7,256,256],[3416,2914,244,242,6,7,256,256],[3660,2914,244,242,6,7,256,256],[0,3156,244,242,6,7,256,256],[244,3156,244,242,6,7,256,256],[488,3156,244,242,6,7,256,256],[976,3156,244,242,6,7,256,256],[1220,3156,244,242,6,7,256,256],[2928,3156,244,242,6,7,256,256],[3172,3156,244,242,6,7,256,256],[3416,3156,244,242,6,7,256,256],[3660,3156,244,242,6,7,256,256],[2684,2185,244,243,6,7,256,256],[1464,2185,244,244,6,6,256,256],[1708,2185,244,244,6,6,256,256],[1952,2185,244,244,6,6,256,256],[2196,2185,244,244,6,6,256,256],[2440,2185,244,244,6,6,256,256],[244,2185,244,244,6,6,256,256],[488,2185,244,244,6,6,256,256],[732,2185,244,244,6,6,256,256],[976,2185,244,244,6,6,256,256],[1220,2185,244,244,6,6,256,256],[0,2185,244,245,6,6,256,256],[732,1937,244,246,6,5,256,256],[976,1937,244,246,6,5,256,256],[1220,1937,244,246,6,5,256,256],[1464,1937,244,246,6,5,256,256],[1708,1937,244,246,6,5,256,256],[1952,1937,244,246,6,5,256,256],[2196,1937,244,246,6,5,256,256],[2440,1937,244,246,6,5,256,256],[2684,1937,244,246,6,5,256,256],[2928,1937,244,246,6,5,256,256],[3172,1937,244,246,6,5,256,256],[3416,1937,244,246,6,5,256,256],[3660,1937,244,246,6,5,256,256],[0,1937,244,248,6,4,256,256],[244,1937,244,248,6,4,256,256],[488,1937,244,248,6,4,256,256],[0,3398,228,191,14,32,256,256],[228,3398,228,166,14,45,256,256],[456,3398,228,157,14,49,256,256]];
  const RESIDUE_CELLS = [[456,0,75,228,298,110,448,448],[531,0,75,228,298,110,448,448],[981,0,75,228,298,110,448,448],[1056,0,75,228,298,110,448,448],[1131,0,75,228,298,110,448,448],[76,0,76,228,298,110,448,448],[152,0,76,228,298,110,448,448],[228,0,76,228,298,110,448,448],[304,0,76,228,298,110,448,448],[380,0,76,228,298,110,448,448],[0,0,76,228,298,110,448,448],[606,0,75,228,298,110,448,448],[681,0,75,228,298,110,448,448],[756,0,75,228,298,110,448,448],[831,0,75,228,298,110,448,448],[906,0,75,228,298,110,448,448]];
  const STORM_SIZE = [3940, 3589], RESIDUE_SIZE = [1212, 228];
  const finite = Number.isFinite;
  const clamp = value => Math.max(0, Math.min(1, value));
  const ready = (image, size) => Boolean(image?.complete &&
    image.naturalWidth === size[0] && image.naturalHeight === size[1]);

  function hitZone(effect, zones, now) {
    if (effect?.type !== 'gravity-storm-barrier-hit' || effect.variant !== 'caster-barrier' ||
        !effect.playerId || !finite(Number(effect.x)) || !finite(Number(effect.y))) return null;
    let best = null, distance = Infinity;
    for (const zone of zones) {
      if (!zone || zone.ownerId !== effect.playerId ||
          now >= Number(zone.barrierUntil || Number(zone.endsAt) - 1000) ||
          Number(effect.at) < Number(zone.startedAt) ||
          Number(effect.at) >= Number(zone.barrierUntil || Number(zone.endsAt) - 1000)) continue;
      const x = finite(Number(zone.safeX)) ? Number(zone.safeX) : Number(zone.x);
      const y = finite(Number(zone.safeY)) ? Number(zone.safeY) : Number(zone.y);
      const d = Math.hypot(Number(effect.x) - x, Number(effect.y) - y);
      if (d > Number(zone.barrierRadius || 140)) continue;
      if (d < distance || d === distance && Number(zone.startedAt) > Number(best?.startedAt || 0)) {
        best = zone; distance = d;
      }
    }
    return best;
  }
  function cellSprite(image, sourceSize, cell, x, y, width, height, transform, alpha, mode) {
    const [sx, sy, sw, sh, ox, oy, wholeW, wholeH] = cell;
    return { image, sourceSize, crop: [sx, sy, sw, sh],
      x: x + ox * width / wholeW, y: y + oy * height / wholeH,
      w: sw * width / wholeW, h: sh * height / wholeH,
      transform, color: [1, 1, 1, alpha], mode };
  }
  function plan({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !camera || !viewport ||
        ![scene.now, scene.frameNow, camera.x, camera.y, zoom,
          viewport.width, viewport.height].every(finite) ||
        zoom <= 0 || viewport.width <= 0 || viewport.height <= 0) {
      throw new TypeError('Gravity impacts require timed scene, camera, zoom, and logical viewport');
    }
    const textures = scene.textures || {};
    const storm = ready(textures.gravityLocalMaterialV834, STORM_SIZE)
      ? textures.gravityLocalMaterialV834 : null;
    const residue = ready(textures.gravitySafeEyeResidue, RESIDUE_SIZE)
      ? textures.gravitySafeEyeResidue : null;
    const reduced = Boolean(scene.reducedMotion);
    const zones = Array.isArray(scene.gravityZones) ? scene.gravityZones : [];
    const effects = Array.isArray(scene.effects) ? scene.effects : [];
    const world = [zoom, 0, 0, zoom, -camera.x * zoom, -camera.y * zoom];
    const sprites = [], rects = [], commands = [], claims = [], unhandled = [];
    function addSprite(effect, part, sprite) {
      const item = { effectId: effect.id, part, sprite };
      sprites.push(item); commands.push({ kind: 'sprite', item });
    }
    function addRect(effect, part, cx, cy, width, height, angle, color) {
      const rect = { x: cx - width / 2, y: cy - height / 2, w: width, h: height,
        rotation: angle, color, mode: 'additive', transform: world };
      const item = { effectId: effect.id, part, rect };
      rects.push(item); commands.push({ kind: 'rect', item });
    }
    function line(effect, part, x0, y0, x1, y1, width, color) {
      const length = Math.hypot(x1 - x0, y1 - y0);
      if (length > 0) addRect(effect, part, (x0 + x1) / 2, (y0 + y1) / 2,
        length, width, Math.atan2(y1 - y0, x1 - x0), color);
    }
    function ring(effect, part, x, y, radius, width, color) {
      const count = Math.max(24, Math.ceil(radius / 5));
      for (let i = 0; i < count; i += 1) {
        const a = i * Math.PI * 2 / count, b = (i + 1) * Math.PI * 2 / count;
        line(effect, part, x + Math.cos(a) * radius, y + Math.sin(a) * radius,
          x + Math.cos(b) * radius, y + Math.sin(b) * radius, width, color);
      }
    }
    for (const effect of effects) {
      const type = String(effect?.type || '');
      if (!type.startsWith('gravity-storm-')) continue;
      const duration = Number(effect.duration);
      const elapsed = scene.frameNow - Number(effect.startedAt);
      // drawMagicEffects discards effects at the duration boundary, but keeps
      // future-started events and samples their progress at zero.
      if (!finite(duration) || duration <= 0 || !finite(elapsed) || elapsed >= duration) continue;
      const p = clamp(elapsed / duration);
      const x = Number(effect.x), y = Number(effect.y);
      const radius = Math.max(90, Number(effect.radius) || 140);
      if (type === 'gravity-storm-barrier-hit' && effect.variant === 'caster-barrier' &&
          finite(x) && finite(y)) {
        const liveZone = hitZone(effect, zones, scene.now);
        claims.push({ effect, reason: p >= 1 ? 'expired' : liveZone ? 'live-zone' :
          residue ? 'residue' : 'residue-unavailable' });
        if (p >= 1 || liveZone) continue;
        if (!residue) {
          // The live zone owns the held barrier. Once it ends, retain the
          // impact's guard contour even if the optional residue atlas failed.
          const tail = Math.pow(1 - p, 1.12);
          ring(effect, 'barrier-fallback-ring', x, y, radius * (.62 + p * .16),
            Math.max(1.5, radius * .026), [.90, .84, 1, Math.sin(Math.PI * p) * tail * .7]);
          continue;
        }
        const cell = reduced ? 8 : Math.min(15, Math.floor(p * 16));
        const size = radius * 1254 / 357;
        addSprite(effect, 'barrier-residue',
          cellSprite(residue, RESIDUE_SIZE, RESIDUE_CELLS[cell],
            x - size / 2, y - size / 2, size, size, world,
            .82 * Math.pow(1 - p, 1.12), 'screen'));
        continue;
      }
      const mode = type === 'gravity-storm-pull' ? 1 :
        type === 'gravity-storm-heavy' ? 2 : type === 'gravity-storm-crush' ? 3 : 0;
      const known = mode || type === 'gravity-storm-blast' ||
        type === 'gravity-storm-barrier-hit' || type === 'gravity-storm-impact';
      if (!known || !finite(x) || !finite(y)) {
        unhandled.push({ effect, reason: !known ? 'unknown-type' : 'invalid-position' });
        continue;
      }
      if (!storm || !mode) {
        // Canvas's late fallback samples the stationary semantic raster and
        // draws a distinct field. The WebGPU path uses the original image
        // directly; the geometry remains when that optional image is missing.
        const source = type === 'gravity-storm-barrier-hit'
          ? textures.gravityStormSafeEye : textures.tacticalSystemsAtlas;
        const image = ready(source, [1254, 1254]) ? source : null;
        const tail = Math.pow(1 - p, 1.12), envelope = Math.sin(Math.PI * p);
        claims.push({ effect, reason: image ? 'semantic-fallback' : 'geometry-fallback' });
        if (image) {
          const size = radius * 2.05;
          const barrier = type === 'gravity-storm-barrier-hit';
          const height = barrier ? size : size * 379 / 410;
          addSprite(effect, 'fallback-material', {
            image, sourceSize: [1254, 1254],
            crop: barrier ? [0, 0, 1254, 1254] : [8, 836, 410, 379],
            x: x - size / 2, y: y - height / 2, w: size, h: height, transform: world,
            color: [1, 1, 1, tail * (barrier ? .82 : .7)],
            mode: barrier ? 'screen' : 'additive' });
        }
        if (type === 'gravity-storm-barrier-hit') {
          ring(effect, 'barrier-fallback-ring', x, y, radius * (.62 + p * .16),
            Math.max(1.5, radius * .026), [.90, .84, 1, envelope * tail * .7]);
        } else if (type === 'gravity-storm-blast') {
          const front = radius * (.12 + (reduced ? p : 1 - Math.pow(1 - p, 2.7)) * .92);
          ring(effect, 'blast-front', x, y, front, Math.max(2, radius * .045 * (1 - p * .62)),
            [.92, .88, 1, tail * .76 * .92]);
          for (let i = 0; i < (reduced ? 4 : 9); i += 1) {
            const a = i * 2.3999632297 + .24, lead = front * (.72 + (i % 3) * .08);
            line(effect, 'blast-spoke', x + Math.cos(a) * lead, y + Math.sin(a) * lead,
              x + Math.cos(a) * front, y + Math.sin(a) * front,
              Math.max(1, radius * .015), [.675, .486, 1, tail * envelope * .54 * .84]);
          }
        } else if (type === 'gravity-storm-crush') {
          const gap = radius * (.96 - p * .8);
          for (const sign of [-1, 1]) {
            addRect(effect, 'crush-plane', x + sign * (gap + radius * .05), y,
              radius * .1, radius * 1.56, 0, [.48, .294, .855, tail * (.35 + envelope * .42) * .34]);
            line(effect, 'crush-seam', x + sign * gap, y - radius * .72,
              x + sign * gap, y + radius * .72, Math.max(1.5, radius * .025),
              [.96, .933, 1, tail * .84 * .94]);
          }
        } else if (type === 'gravity-storm-pull') {
          for (let i = 0; i < (reduced ? 5 : 11); i += 1) {
            const angle = i * 2.3999632297 + .36;
            const outer = radius * (.98 - p * .7), inner = radius * (.1 + p * .08);
            line(effect, 'pull-trail', x + Math.cos(angle) * outer, y + Math.sin(angle) * outer,
              x + Math.cos(angle) * inner, y + Math.sin(angle) * inner,
              Math.max(1, radius * .018 * (1 - p * .45)),
              i % 3 ? [.745, .65, 1, tail * (.28 + envelope * .34) * .8] :
                [.957, .925, 1, tail * (.28 + envelope * .34) * .94]);
          }
          ring(effect, 'pull-core', x, y, Math.max(1, radius * .12),
            Math.max(1, radius * .08), [.67, .475, 1, envelope * tail * .45]);
        } else {
          const front = radius * (.84 - p * .59);
          ring(effect, 'heavy-compression', x, y, front, Math.max(2, radius * .038),
            [.72, .55, 1, tail * (.36 + envelope * .4)]);
        }
        continue;
      }
      claims.push({ effect, reason: 'packed-impact' });
      const opacity = Math.pow(1 - p, 1.12);
      const flowRadius = radius * 1.025;
      const phase = reduced ? 0 : p * 31;
      const first = Math.floor(phase), mix = reduced ? 0 : phase - first;
      const next = Math.min(31, first + 1);
      for (const [index, weight] of [[first, 1 - mix], [next, mix]]) {
        if (weight <= 0) continue;
        addSprite(effect, 'impact-flow',
          cellSprite(storm, STORM_SIZE, STORM_CELLS[mode * 32 + index],
            x - flowRadius, y - flowRadius, flowRadius * 2, flowRadius * 2,
            world, opacity * .70 * weight, 'additive'));
      }
      for (let i = 0; i < 3; i += 1) {
        const t = reduced ? .34 + i * .08 : p;
        const angle = i * 2.094 + .40;
        const inward = mode === 2 ? Math.pow(t, .65) : t;
        let rockX = Math.cos(angle) * radius * (.81 - inward * .57);
        let rockY = Math.sin(angle) * radius * (.81 - inward * .57) + radius * .12 * inward * inward;
        if (mode === 3) {
          rockX = (i % 2 ? 1 : -1) * radius * (.79 - .57 * t);
          rockY = (i - 1) * radius * .25 + t * radius * .08;
        }
        const bank = reduced ? (i - 1) * .12 :
          (i % 2 ? -1 : 1) * Math.sin(t * Math.PI) * (mode === 2 ? .85 : .35);
        const size = radius * (.15 + i * .025) * (1 - inward * .18);
        const rock = cellSprite(storm, STORM_SIZE, STORM_CELLS[128 + i],
          -size / 2, -size / 2, size, size * (1 - .18 * inward),
          world, opacity * .90, 'source-over');
        const c = Math.cos(bank), s = Math.sin(bank);
        rock.transform = [zoom * c, zoom * s, -zoom * s, zoom * c,
          (x + rockX - camera.x) * zoom, (y + rockY - camera.y) * zoom];
        addSprite(effect, `impact-rock-${i}`, rock);
      }
    }
    return Object.freeze({ sprites: Object.freeze(sprites), rects: Object.freeze(rects),
      commands: Object.freeze(commands), claims: Object.freeze(claims),
      unhandled: Object.freeze(unhandled) });
  }
  function create({ device } = {}) {
    if (!device?.createTexture || !device?.queue?.copyExternalImageToTexture)
      throw new TypeError('Shared WebGPU device and queue required');
    const cache = new Map(), owned = new Set();
    let destroyed = false;
    function textureFor(sprite) {
      const existing = cache.get(sprite.image);
      if (existing) return existing;
      const texture = device.createTexture({ label: 'DVA gravity impact material',
        size: sprite.sourceSize, format: 'rgba8unorm', usage: 0x02 | 0x04 | 0x10 });
      try { device.queue.copyExternalImageToTexture({ source: sprite.image },
        { texture, premultipliedAlpha: true }, sprite.sourceSize); }
      catch (error) { texture.destroy(); throw error; }
      cache.set(sprite.image, texture); owned.add(texture);
      return texture;
    }
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Gravity-impact pass destroyed');
      const result = plan({ scene, camera, zoom, viewport });
      if (result.unhandled.length) throw new Error(`Unported gravity impact: ${result.unhandled[0].reason}`);
      if (!result.commands.length) return result;
      if (typeof frame?.stage !== 'function' || typeof frame.sprite !== 'function' ||
          typeof frame.rect !== 'function' ||
          typeof target !== 'string' || !target ||
          ![viewport.pixelWidth, viewport.pixelHeight].every(value => Number.isInteger(value) && value > 0))
        throw new TypeError('Shared frame, target, and committed viewport required');
      const textures = result.sprites.map(item => textureFor(item.sprite));
      frame.stage('world:gravity-impacts');
      let index = 0;
      for (const command of result.commands) {
        if (command.kind === 'rect') frame.rect(target, command.item.rect);
        else {
          const { image, ...sprite } = command.item.sprite;
          frame.sprite(target, { ...sprite, texture: textures[index++] });
        }
      }
      return result;
    }
    return Object.freeze({ plan, record, destroy() {
      if (destroyed) return;
      destroyed = true;
      for (const texture of owned) texture.destroy();
      cache.clear(); owned.clear();
    } });
  }
  const api = Object.freeze({ plan, create, hitZone });
  root.DvaWebGPUGravityImpacts = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
