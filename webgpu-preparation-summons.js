/* The v726 preparation arrival, recorded in the shared ordered WebGPU world
 * frame immediately before the players. The caller resolves rendered player
 * positions and sprite readiness; this pass owns the roster clock and circle
 * texture on the caller's device. All geometry is in logical viewport pixels. */
(function (root) {
  'use strict';
  const ASSET = 'assets/generated/preparation-summon-circle-v726.png';
  const finite = Number.isFinite;
  const clamp = value => Math.max(0, Math.min(1, value));
  const ink = (r, g, b, a) => [r / 255, g / 255, b / 255, a];
  function ready(image) {
    return Boolean(image?.complete && image.naturalWidth > 0 && image.naturalHeight > 0);
  }
  function validate({ scene, camera, zoom, viewport }) {
    if (!scene || !Array.isArray(scene.players) || !(scene.entries instanceof Map) ||
      !camera || !viewport || ![scene.nowMs, camera.x, camera.y, zoom,
        viewport.width, viewport.height].every(finite) || zoom <= 0 ||
      viewport.width <= 0 || viewport.height <= 0)
      throw new TypeError('Preparation summons need a live roster, clock, camera, zoom, and logical viewport');
    if (scene.ringAssetPath !== undefined && scene.ringAssetPath !== ASSET)
      throw new Error(`Unsupported preparation summon material: ${scene.ringAssetPath}`);
  }
  function plan(input = {}) {
    validate(input);
    const { scene, camera, zoom } = input;
    const entries = scene.entries;
    if (!scene.active) { entries.clear(); return []; }
    const roster = scene.players.filter(player => player && !player.isBot && !player.ejected);
    const ids = new Set(roster.map(player => String(player.id || '')));
    for (const id of entries.keys()) if (!ids.has(id)) entries.delete(id);
    const sessionKey = String(scene.roomId || '') + ':' + (Number(scene.roomSessionGeneration) || 0);
    const imageReady = ready(scene.ringImage);
    const result = [];
    for (const player of roster) {
      const id = String(player.id || '');
      if (![player.x, player.y].every(finite)) throw new TypeError(`Preparation player ${id} needs a rendered world position`);
      let entry = entries.get(id);
      if (!entry || entry.sessionKey !== sessionKey) {
        entry = { sessionKey, appearedAt: scene.nowMs };
        entries.set(id, entry);
      }
      if (scene.reducedMotion) entry.summonExpired = true;
      if (!finite(entry.summonStartedAt) && !entry.summonExpired &&
          player.spriteReady && imageReady) entry.summonStartedAt = scene.nowMs;
      if (!finite(entry.summonStartedAt) && scene.nowMs - entry.appearedAt > 4000)
        entry.summonExpired = true;
      const t = finite(entry.summonStartedAt) ? clamp((scene.nowMs - entry.summonStartedAt) / 980) : 1;
      const active = !scene.reducedMotion && finite(entry.summonStartedAt) && t < 1;
      const descent = scene.reducedMotion ? 0 : (1 - Math.min(1, t / 0.64)) ** 2 * 78;
      const impact = scene.reducedMotion ? 0 : Math.sin(clamp((t - 0.54) / 0.30) * Math.PI);
      entry.arrival = { active, descent, stanceX: 1 + impact * 0.105,
        stanceY: 1 - impact * 0.13, lean: (id.length % 2 ? 1 : -1) * impact * 0.035 };
      if (!active) continue;
      const worldX = finite(player.renderedX) ? player.renderedX : player.x;
      const worldY = finite(player.renderedY) ? player.renderedY : player.y;
      const x = (worldX - camera.x) * zoom;
      const footY = (worldY + 30 - camera.y) * zoom;
      const easeOut = 1 - (1 - t) ** 3;
      const size = Math.max(1, 116 * 0.56 * (0.64 + easeOut * 0.36)) * zoom;
      const beamHeight = (42 + 96 * easeOut) * 0.56 * zoom;
      const ringAlpha = (1 - t) * 0.86;
      const beamWidth = Math.max(1, 1.7 * 0.56) * zoom;
      const beams = [-1, 1].map(side => ({
        x0: x + side * size * 0.16, y0: footY - 3 * 0.56 * zoom,
        x1: x + side * size * 0.16 * 0.36, y1: footY - beamHeight,
        width: beamWidth, color: ink(184, 245, 255, 0.78 * ringAlpha)
      }));
      const motes = Array.from({ length: 5 }, (_, particle) => {
        const particleT = clamp((t - particle * 0.075) / 0.72);
        const lane = particle - 2;
        return { x: x + lane * (6 + 12 * particleT) * 0.56 * zoom - 0.56 * zoom,
          y: footY - 8 * 0.56 * zoom - particleT * beamHeight * 0.72,
          size: 2 * 0.56 * zoom,
          color: ink(216, 250, 255, 0.92 * (1 - particleT) * (1 - t * 0.25) * 0.8) };
      });
      result.push({ id, x, footY, size, angle: (t - 0.5) * 0.42,
        ringAlpha, ringReady: imageReady, beams, motes, arrival: entry.arrival });
    }
    return result;
  }
  function beamRect(beam) {
    const dx = beam.x1 - beam.x0, dy = beam.y1 - beam.y0;
    const length = Math.hypot(dx, dy), angle = Math.atan2(dy, dx);
    const c = Math.cos(angle), s = Math.sin(angle);
    return { x: -length / 2, y: -beam.width / 2, w: length, h: beam.width,
      transform: [c, s, -s, c, (beam.x0 + beam.x1) / 2, (beam.y0 + beam.y1) / 2],
      color: beam.color, mode: 'additive' };
  }
  function create({ device } = {}) {
    if (!device?.createTexture || !device.queue?.copyExternalImageToTexture)
      throw new TypeError('Preparation summons need the shared WebGPU device');
    const textures = new Map();
    let destroyed = false;
    function textureFor(image) {
      if (!ready(image)) return null;
      const cached = textures.get(image);
      if (cached && cached.width === image.naturalWidth && cached.height === image.naturalHeight)
        return cached.texture;
      const texture = device.createTexture({ label: 'DVA preparation summon circle v726',
        size: [image.naturalWidth, image.naturalHeight], format: 'rgba8unorm',
        usage: 0x02 | 0x04 | 0x10 }); // COPY_DST | TEXTURE_BINDING | RENDER_ATTACHMENT
      try {
        device.queue.copyExternalImageToTexture({ source: image },
          { texture, premultipliedAlpha: true }, [image.naturalWidth, image.naturalHeight]);
      } catch (error) { texture.destroy(); throw error; }
      if (cached) cached.texture.destroy();
      textures.set(image, { width: image.naturalWidth, height: image.naturalHeight, texture });
      return texture;
    }
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Preparation summon pass destroyed');
      if (!frame?.stage || !frame?.sprite || !frame?.rect ||
          typeof target !== 'string' || !target ||
          !Number.isInteger(viewport?.pixelWidth) || !Number.isInteger(viewport?.pixelHeight) ||
          viewport.pixelWidth < 1 || viewport.pixelHeight < 1)
        throw new TypeError('Preparation summons need a shared frame and physical backing dimensions');
      const effects = plan({ scene, camera, zoom, viewport });
      if (!effects.length) return { drawn: 0, effects };
      const texture = textureFor(scene.ringImage);
      frame.stage('world:preparation-summons');
      for (const effect of effects) {
        if (effect.ringReady && texture) {
          const c = Math.cos(effect.angle), s = Math.sin(effect.angle);
          frame.sprite(target, { x: -effect.size / 2, y: -effect.size * 0.22,
            w: effect.size, h: effect.size * 0.44,
            transform: [c, s, -s, c, effect.x, effect.footY],
            texture, color: [1, 1, 1, effect.ringAlpha], mode: 'additive' });
        }
        for (const beam of effect.beams) frame.rect(target, beamRect(beam));
        for (const mote of effect.motes) if (mote.color[3] > 0)
          frame.rect(target, { x: mote.x, y: mote.y, w: mote.size, h: mote.size,
            color: mote.color, mode: 'additive' });
      }
      return { drawn: effects.length, effects };
    }
    return Object.freeze({ device, record, destroy() {
      if (destroyed) return;
      destroyed = true;
      for (const value of textures.values()) value.texture.destroy();
      textures.clear();
    } });
  }
  const api = Object.freeze({ ASSET, plan, create });
  root.DvaWebGPUPreparationSummons = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
