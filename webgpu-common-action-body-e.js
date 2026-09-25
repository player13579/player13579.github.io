/* Common body action E candidates. Barrier/Bust visuals and their SFX remain
 * delegated to their existing WebGPU owners; this module owns action-mana. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const OWNERS = Object.freeze({
    'action-stand:durability-created': { renderer: 'DvaWebGPUBarrierE', sound: 'DvaWebGPUDefenseMovementESfx' },
    'action-push:timed-bust-start': { renderer: 'DvaWebGPUBustE', sound: 'DvaWebGPUDefenseMovementESfx' },
    'action-push:timed-bust-break': { renderer: 'DvaWebGPUBarrierE', sound: 'DvaWebGPUDefenseMovementESfx' }
  });
  const TYPE = 'action-mana';
  const STATES = Object.freeze({ '欲望': 'desire', '気概': 'grit', '理知': 'rational', renki: 'renki-release' });
  const MAX_EVENTS = 32, MAX_RECTS_PER_EVENT = 16, MAX_SHAPES_PER_EVENT = 20, DEFAULT_DURATION_MS = 1200;
  const rgba = (r, g, b, a) => [r / 255, g / 255, b / 255, clamp(a)];
  function validate({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !Array.isArray(scene.effects) || !Array.isArray(scene.players) || !finite(scene.nowMs) ||
      !camera || ![camera.x, camera.y, zoom].every(finite) || zoom <= 0 || !viewport ||
      ![viewport.width, viewport.height].every(finite) || viewport.width <= 0 || viewport.height <= 0 ||
      (viewport.kind !== undefined && viewport.kind !== 'main'))
      throw new TypeError('Common Action Body E needs timed effects, public actors, camera, zoom, and logical viewport');
    if ((viewport.pixelWidth !== undefined || viewport.pixelHeight !== undefined) &&
      (!Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth < 1 ||
        !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight < 1))
      throw new TypeError('Common Action Body E needs valid physical viewport dimensions');
  }
  function line(a, b, width, color) {
    const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy);
    if (!finite(length) || length < 0.01) return null;
    const c = dx / length, s = dy / length;
    return { x: -length / 2, y: -width / 2, w: length, h: width,
      transform: [c, s, -s, c, (a.x + b.x) / 2, (a.y + b.y) / 2], color, mode: 'additive' };
  }
  function rect(center, w, h, color) {
    return { x: center.x - w / 2, y: center.y - h / 2, w, h, color, mode: 'additive' };
  }
  function plan({ scene, camera, zoom, viewport } = {}) {
    validate({ scene, camera, zoom, viewport });
    const active = scene.effects.filter(e => e && (e.type === TYPE || e.type === 'action-stand' || e.type === 'action-push'));
    if (active.length > MAX_EVENTS) throw new RangeError('Common Action Body E active event budget exceeded');
    const ids = new Set(), owned = [], delegated = [], unsupported = [];
    for (const effect of active) {
      const id = String(effect.id || ''), type = String(effect.type || ''), variant = String(effect.variant || ''), key = `${type}:${variant}`;
      if (!id || ids.has(id)) throw new Error('Common Action Body E requires distinct event IDs');
      ids.add(id);
      if (type !== TYPE) {
        const owner = OWNERS[key];
        if (!owner) { unsupported.push({ id, type, variant, reason: 'no-known-webgpu-owner-for-event-variant' }); continue; }
        delegated.push({ id, type, variant, rendererOwner: owner.renderer, soundOwner: owner.sound });
        continue;
      }
      const kind = STATES[variant];
      if (!kind) { unsupported.push({ id, type, variant, reason: 'unrecognized-action-mana-variant' }); continue; }
      const playerId = String(effect.playerId || '');
      if (!playerId || !finite(effect.x) || !finite(effect.y) || !finite(effect.startedAt))
        throw new Error(`Common Action Body E ${id} requires playerId, event world point and local start`);
      const actor = scene.players.find(p => String(p?.id || '') === playerId);
      if (!actor || !actor.alive || actor.ejected || actor.inVent || actor.invisible || ![actor.x, actor.y].every(finite)) {
        delegated.push({ id, type, variant, rendererOwner: null, soundOwner: 'existing-focus-magic-effect', suppressed: 'actor-not-visible' });
        continue;
      }
      const rawDuration = effect.duration ?? effect.durationMs;
      const duration = rawDuration == null || Number(rawDuration) === 0 ? DEFAULT_DURATION_MS : Number(rawDuration);
      if (!finite(duration) || duration <= 0) throw new Error(`Common Action Body E ${id} requires a positive normalized duration`);
      const age = scene.nowMs - effect.startedAt;
      if (age < 0 || age >= duration) continue;
      const completionKind = kind === 'renki-release' ? String(effect.completionKind || '') : '';
      if (kind === 'renki-release' && !['normal', 'tenfold'].includes(completionKind)) {
        unsupported.push({ id, type, variant, reason: 'renki-release-completion-kind-unavailable' });
        continue;
      }
      owned.push({ id, type, variant, kind, playerId, center: { x: (effect.x - camera.x) * zoom, y: (effect.y - camera.y) * zoom },
        age, duration, progress: clamp(age / duration), completionKind, reducedMotion: Boolean(scene.reducedMotion),
        // Variant "欲望" is also used by an unrelated donation failure route; source
        // payload cannot distinguish that cause. Keep its E a generic desire-state pulse.
        causeSpecificity: kind === 'desire' ? 'variant-only-ambiguous-producer' : 'exact-variant' });
    }
    return { owned, delegated, unsupported };
  }
  function visualsFor(effect) {
    const { center: c, progress: p, reducedMotion: reduced } = effect;
    const commands = [], shapeCommands = [];
    const visualScale = 1.75;
    const at = (x, y) => ({ x: c.x + (x - c.x) * visualScale,
      y: c.y + (y - c.y) * visualScale });
    // A bright middle life followed by a deliberate tail. The first frame is
    // already legible; the last 18% dissolves without a hard cutoff.
    const entrance = clamp(0.58 + p * 4.2);
    const exit = clamp((1 - p) / 0.18);
    const light = entrance * exit * (reduced ? 0.78 : 1);
    const swell = reduced ? 1 : 0.84 + 0.16 * Math.sin(Math.PI * clamp(p / 0.65));
    const glow = (x, y, radius, color, opacity) => shapeCommands.push({
      kind: 'glow', ...at(x, y), radius: radius * visualScale,
      color: rgba(...color, light * opacity), mode: 'additive' });
    const oval = (x, y, rx, ry, color, opacity, rotation = 0) => shapeCommands.push({
      kind: 'ellipse', ...at(x, y), rx: rx * visualScale, ry: ry * visualScale,
      rotation, color: rgba(...color, light * opacity), mode: 'additive' });
    const arc = (x, y, radius, start, sweep, width, color, opacity) => shapeCommands.push({
      kind: 'arc', ...at(x, y), radius: radius * visualScale, start, sweep,
      lineWidth: width * visualScale,
      color: rgba(...color, light * opacity), mode: 'additive' });
    const stroke = (a, b, width, color, opacity) => {
      // The shared shape pass supplies the round, soft field. Keep a diffuse
      // ribbon in the ordered primitive pass too: it makes the body silhouette
      // readable on small displays even when radial light is subtle.
      for (const [extra, strength] of [[16, 0.2], [7, 0.4], [0, 1]]) {
        const band = line(at(a.x, a.y), at(b.x, b.y),
          (width + extra) * visualScale, rgba(...color, light * opacity * strength));
        if (band) commands.push(band);
      }
    };
    if (effect.kind === 'desire') {
      // Two unequal, escaping violet tongues part from a shared heart.
      const spread = reduced ? 0 : 7 * Math.sin(Math.PI * p);
      glow(c.x, c.y - 3, 43 * swell, [183, 70, 246], 0.35);
      glow(c.x - 19 - spread, c.y - 9, 31, [230, 75, 202], 0.27);
      glow(c.x + 18 + spread, c.y + 1, 32, [124, 73, 255], 0.28);
      oval(c.x - 14 - spread, c.y - 9, 10, 27, [199, 83, 240], 0.29, -0.38);
      oval(c.x + 13 + spread, c.y + 1, 9, 24, [133, 91, 255], 0.29, 0.34);
      arc(c.x - 11 - spread, c.y - 6, 23, 1.58, 3.7, 4.4, [255, 143, 236], 0.72);
      arc(c.x + 10 + spread, c.y + 3, 21, -1.36, 3.5, 4, [188, 142, 255], 0.68);
      stroke({ x: c.x - 9, y: c.y + 12 }, { x: c.x - 18 - spread, y: c.y - 24 }, 3.6, [255, 216, 249], 0.84);
      stroke({ x: c.x + 8, y: c.y + 14 }, { x: c.x + 17 + spread, y: c.y - 18 }, 3.2, [222, 204, 255], 0.8);
      stroke({ x: c.x, y: c.y + 12 }, { x: c.x, y: c.y - 12 }, 2.6, [255, 225, 253], 0.7);
      oval(c.x, c.y + 2, 7, 12, [255, 180, 244], 0.54);
    } else if (effect.kind === 'grit') {
      // Grounded gold compression drives into one decisive upward thrust.
      const thrust = reduced ? 8 : 4 + 11 * Math.sin(Math.PI * clamp(p / 0.7));
      glow(c.x, c.y - 8, 44 * swell, [255, 145, 38], 0.37);
      glow(c.x, c.y - 18 - thrust, 31, [255, 210, 81], 0.27);
      oval(c.x, c.y - 11, 12, 32, [255, 178, 60], 0.32);
      oval(c.x, c.y - 13 - thrust * 0.5, 5, 22, [255, 229, 122], 0.48);
      arc(c.x, c.y + 17, 24, 0.25, 2.65, 5, [255, 190, 78], 0.65);
      arc(c.x, c.y + 17, 24, Math.PI + 0.25, 2.65, 5, [255, 190, 78], 0.65);
      stroke({ x: c.x - 19, y: c.y + 16 }, { x: c.x - 4, y: c.y - 16 - thrust }, 4.2, [255, 225, 133], 0.84);
      stroke({ x: c.x + 19, y: c.y + 16 }, { x: c.x + 4, y: c.y - 16 - thrust }, 4.2, [255, 225, 133], 0.84);
      stroke({ x: c.x, y: c.y + 18 }, { x: c.x, y: c.y - 31 - thrust }, 5, [255, 249, 196], 0.92);
      commands.push(rect(at(c.x, c.y - 31 - thrust), 7 * visualScale, 7 * visualScale,
        rgba(255, 250, 213, light * 0.95)));
    } else if (effect.kind === 'rational') {
      // Cool, ordered planes align into a diamond above a quiet central axis.
      const align = reduced ? 0 : 8 * (1 - p);
      glow(c.x, c.y - 8, 45 * swell, [67, 174, 255], 0.35);
      glow(c.x, c.y - 18, 29, [131, 232, 255], 0.26);
      oval(c.x, c.y - 8, 20, 30, [86, 199, 244], 0.23);
      oval(c.x, c.y - 8, 7, 26, [172, 244, 255], 0.37);
      arc(c.x, c.y - 8, 31, -2.6, 2.1, 3.3, [111, 219, 255], 0.62);
      arc(c.x, c.y - 8, 31, 0.55, 2.1, 3.3, [111, 219, 255], 0.62);
      const top = { x: c.x, y: c.y - 42 }, bottom = { x: c.x, y: c.y + 22 };
      stroke({ x: c.x - 22 - align, y: c.y - 9 }, top, 3, [208, 249, 255], 0.86);
      stroke(top, { x: c.x + 22 + align, y: c.y - 9 }, 3, [208, 249, 255], 0.86);
      stroke({ x: c.x - 22 - align, y: c.y - 9 }, bottom, 2.5, [126, 228, 255], 0.74);
      stroke(bottom, { x: c.x + 22 + align, y: c.y - 9 }, 2.5, [126, 228, 255], 0.74);
      stroke({ x: c.x, y: c.y + 17 }, { x: c.x, y: c.y - 35 }, 3, [234, 253, 255], 0.9);
    } else {
      // Completion has an inward gathering, a rising release, and a lingering
      // plume. Tenfold adds two broad wings; normal remains a single column.
      const tenfold = effect.completionKind === 'tenfold';
      const release = reduced ? 0.72 : clamp((p - 0.24) / 0.39);
      const lift = release * (tenfold ? 32 : 24);
      const radius = tenfold ? 58 : 43;
      glow(c.x, c.y - 10 - lift * 0.35, radius * swell, [88, 190, 255], tenfold ? 0.43 : 0.37);
      glow(c.x, c.y - 20 - lift, tenfold ? 39 : 32, [174, 240, 255], 0.34);
      oval(c.x, c.y - 9 - lift * 0.45, tenfold ? 20 : 14, tenfold ? 42 : 34,
        [111, 216, 255], tenfold ? 0.39 : 0.32);
      oval(c.x, c.y - 18 - lift, tenfold ? 9 : 7, 24, [220, 251, 255], 0.48);
      arc(c.x, c.y + 12, tenfold ? 31 : 25, 0.18, 2.78, 4.5, [139, 225, 255], 0.73);
      arc(c.x, c.y + 12, tenfold ? 31 : 25, Math.PI + 0.18, 2.78, 4.5, [139, 225, 255], 0.73);
      stroke({ x: c.x - 13, y: c.y + 23 }, { x: c.x - 4, y: c.y - 27 - lift }, 3.4, [210, 248, 255], 0.84);
      stroke({ x: c.x + 13, y: c.y + 23 }, { x: c.x + 4, y: c.y - 27 - lift }, 3.4, [210, 248, 255], 0.84);
      stroke({ x: c.x, y: c.y + 13 }, { x: c.x, y: c.y - 40 - lift }, 4.2, [246, 254, 255], 0.91);
      if (tenfold) {
        for (const side of [-1, 1]) {
          glow(c.x + side * 34, c.y - 17 - lift * 0.5, 31, [84, 169, 255], 0.3);
          oval(c.x + side * 29, c.y - 13 - lift * 0.5, 8, 29, [105, 189, 255], 0.31, side * 0.45);
          stroke({ x: c.x + side * 18, y: c.y + 15 },
            { x: c.x + side * 35, y: c.y - 31 - lift }, 3.1, [177, 232, 255], 0.76);
        }
      }
    }
    return { commands, shapeCommands };
  }
  function create() {
    let destroyed = false;
    const consumedCueIds = new Set();
    function record({ frame, target, shapes, viewport, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Common Action Body E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' || typeof target !== 'string' || !target)
        throw new TypeError('Common Action Body E needs the shared rectangle frame and target');
      const result = plan({ scene, camera, zoom, viewport });
      if (result.owned.length && typeof shapes?.enqueue !== 'function')
        throw new TypeError('Common Action Body E needs shared WebGPU effect shapes');
      const visuals = result.owned.map(visualsFor);
      const commands = visuals.flatMap(visual => visual.commands);
      const shapeCommands = visuals.flatMap(visual => visual.shapeCommands);
      if (commands.length > MAX_EVENTS * MAX_RECTS_PER_EVENT ||
        shapeCommands.length > MAX_EVENTS * MAX_SHAPES_PER_EVENT ||
        commands.some(c => ![c.x, c.y, c.w, c.h, c.color?.[3], ...(c.transform || [])].every(finite)) ||
        shapeCommands.some(c => ![c.x, c.y, c.radius ?? c.rx, c.ry ?? c.radius,
          c.color?.[3], c.start ?? 0, c.sweep ?? 0, c.lineWidth ?? 0].every(finite)))
        throw new RangeError('Common Action Body E invalid or over budget');
      const cueEdges = [];
      for (const event of [...result.owned, ...result.delegated]) {
        if (consumedCueIds.has(event.id)) continue;
        consumedCueIds.add(event.id);
        const soundOwner = event.soundOwner || (event.type === TYPE ? 'existing-focus-magic-effect' : OWNERS[`${event.type}:${event.variant}`]?.sound);
        cueEdges.push({ edgeId: `common-action:${event.id}:start`, action: 'start', type: event.type,
          variant: event.variant, rendererOwner: event.rendererOwner || (event.type === TYPE ? 'DvaWebGPUCommonActionBodyE' : null),
          soundOwner, playback: 'delegate-existing-owner' });
      }
      let batch = null;
      if (commands.length || shapeCommands.length) {
        frame.stage('world:common-action-body-e');
        batch = shapes.enqueue(frame, { target, width: viewport.width, height: viewport.height,
          pixelWidth: viewport.pixelWidth ?? viewport.width,
          pixelHeight: viewport.pixelHeight ?? viewport.height,
          commands: shapeCommands, label: 'DVA common action mana body light' });
        for (const command of commands) frame.rect(target, command);
      }
      return { owned: result.owned, delegated: result.delegated, unsupported: result.unsupported,
        commands, shapeCommands, batch, cueEdges };
    }
    return Object.freeze({ record, destroy() { destroyed = true; consumedCueIds.clear(); } });
  }
  const api = Object.freeze({ TYPE, STATES, OWNERS, MAX_EVENTS, MAX_RECTS_PER_EVENT,
    MAX_SHAPES_PER_EVENT, DEFAULT_DURATION_MS, plan, create });
  root.DvaWebGPUCommonActionBodyE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
