/* Textureless special combat E candidates. All forms stay on event-authored
 * target/path points; body coordinates are never treated as gun or hand muzzles. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const TYPES = Object.freeze({ rpg: 'gunner-rpg', missile: 'gunner-missile', iai: 'iai-destruction-attack' });
  const VARIANTS = Object.freeze({
    rpg: new Set(['normal', 'enhance', 'gbo']), missile: new Set(['normal', 'enhance', 'gbo']),
    iai: new Set(['upgraded-to-destruction', 'existing-disappearance', 'existing-destruction'])
  });
  const DURATIONS = Object.freeze({ [TYPES.rpg]: 1200, [TYPES.missile]: 1200, [TYPES.iai]: 900 });
  const MAX_EVENTS = 24, MAX_RECTS_PER_EVENT = 16;
  const rgba = (r, g, b, a) => [r / 255, g / 255, b / 255, clamp(a)];
  function validate({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !Array.isArray(scene.effects) || !Array.isArray(scene.players) || !finite(scene.nowMs) ||
      !camera || ![camera.x, camera.y, zoom].every(finite) || zoom <= 0 || !viewport ||
      ![viewport.width, viewport.height].every(finite) || viewport.width <= 0 || viewport.height <= 0 ||
      (viewport.kind !== undefined && viewport.kind !== 'main'))
      throw new TypeError('Special Combat E needs events, actors, local time, camera, zoom, and logical viewport');
    if ((viewport.pixelWidth !== undefined || viewport.pixelHeight !== undefined) &&
      (!Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth < 1 ||
        !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight < 1))
      throw new TypeError('Special Combat E needs valid physical viewport dimensions');
  }
  function screen(x, y, camera, zoom, label) {
    if (![x, y].every(finite)) throw new Error(`Special Combat E requires finite ${label} coordinates`);
    return { x: (x - camera.x) * zoom, y: (y - camera.y) * zoom };
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
    const events = scene.effects.filter(effect => effect && Object.values(TYPES).includes(effect.type));
    if (events.length > MAX_EVENTS) throw new RangeError('Special Combat E event budget exceeded');
    const ids = new Set(), out = [], suppressed = [];
    for (const effect of events) {
      const id = String(effect.id || ''), type = String(effect.type || ''), playerId = String(effect.playerId || '');
      if (!id || ids.has(id)) throw new Error('Special Combat E requires unique event IDs');
      ids.add(id);
      if (!playerId || !finite(effect.startedAt)) throw new Error(`Special Combat E ${id} needs playerId and local event start`);
      const variant = String(effect.variant || ''), kind = type === TYPES.rpg ? 'rpg' : type === TYPES.missile ? 'missile' : 'iai';
      if (!VARIANTS[kind].has(variant)) throw new Error(`Special Combat E ${id} rejects unsupported ${kind} variant ${variant}`);
      const durationRaw = effect.duration ?? effect.durationMs;
      const duration = durationRaw == null || Number(durationRaw) === 0 ? DURATIONS[type] : Number(durationRaw);
      if (!finite(duration) || duration <= 0) throw new Error(`Special Combat E ${id} needs positive visual duration`);
      const age = scene.nowMs - effect.startedAt;
      if (age < 0 || age >= duration) continue;
      const owner = scene.players.find(player => String(player?.id || '') === playerId);
      if (!owner || owner.alive === false || owner.ejected || owner.inVent || owner.invisible) {
        suppressed.push({ id, reason: 'source-not-publicly-visible' }); continue;
      }
      const progress = clamp(age / duration), reducedMotion = Boolean(scene.reducedMotion);
      let point, targetId = String(effect.targetId || ''), semantics;
      if (kind === 'rpg') {
        if (!finite(effect.radius) || effect.radius <= 0 || ![effect.targetX, effect.targetY].every(finite))
          throw new Error(`Special Combat E ${id} needs authoritative RPG path endpoint and range`);
        point = screen(effect.targetX, effect.targetY, camera, zoom, 'RPG path endpoint');
        semantics = 'resolved-aim-path-end-not-impact';
      } else {
        if (!targetId || ![effect.targetX, effect.targetY].every(finite))
          throw new Error(`Special Combat E ${id} needs exact targetId and target world point`);
        const target = scene.players.find(player => String(player?.id || '') === targetId);
        if (!target || target.invisible || target.inVent || target.ejected) {
          suppressed.push({ id, reason: 'target-not-publicly-visible' }); continue;
        }
        point = screen(effect.targetX, effect.targetY, camera, zoom, kind === 'iai' ? 'destruction target' : 'selected missile target');
        semantics = kind === 'missile' ? 'selected-target-point-no-impact-receipt' : `successful-destruction:${variant}`;
      }
      out.push({ id, type, kind, variant, playerId, targetId, point, age, duration, progress,
        reducedMotion, semantics, radius: finite(effect.radius) ? effect.radius * zoom : null,
        // heavyWeapon is already server-owned for RPG/missile; IAI kill audio belongs
        // to the authoritative kill transaction when one occurs. This E never plays sound.
        soundOwner: kind === 'iai' ? 'authoritative-kill-transaction-if-emitted' : 'server-heavyWeapon-one-shot' });
    }
    return { events: out, suppressed };
  }
  function commandsFor(effect) {
    const c = effect.point, p = effect.progress, reduced = effect.reducedMotion;
    const alpha = (1 - p) * (reduced ? 0.56 : 0.9), commands = [];
    const addLine = (a, b, w, color) => { const cmd = line(a, b, w, color); if (cmd) commands.push(cmd); };
    if (effect.kind === 'rpg') {
      // Only a path-end cap. No muzzle, route segment, target collision or explosion is inferred.
      const reach = reduced ? 5 : 4 + p * 4;
      for (let i = 0; i < 4; i++) {
        const a = i * Math.PI / 2 + (reduced ? 0 : p * 0.22);
        addLine({ x: c.x + Math.cos(a) * reach * 0.42, y: c.y + Math.sin(a) * reach * 0.42 },
          { x: c.x + Math.cos(a) * reach, y: c.y + Math.sin(a) * reach }, 2.8,
          rgba(255, 180, 92, alpha * 0.8));
      }
      commands.push(rect(c, 3.4, 3.4, rgba(255, 241, 189, alpha)));
    } else if (effect.kind === 'missile') {
      // Tracking lock brackets at the actual selected target point; not a flying missile or hit.
      const gap = reduced ? 8 : 7 + p * 5, arm = reduced ? 3 : 4.5;
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
        const corner = { x: c.x + sx * gap, y: c.y + sy * gap };
        addLine(corner, { x: corner.x - sx * arm, y: corner.y }, 2.1, rgba(123, 218, 255, alpha));
        addLine(corner, { x: corner.x, y: corner.y - sy * arm }, 2.1, rgba(203, 246, 255, alpha * 0.9));
      }
      if (!reduced) {
        addLine({ x: c.x - 2, y: c.y }, { x: c.x + 2, y: c.y }, 1.2, rgba(255, 255, 255, alpha * 0.7));
        addLine({ x: c.x, y: c.y - 2 }, { x: c.x, y: c.y + 2 }, 1.2, rgba(255, 255, 255, alpha * 0.7));
      }
    } else {
      // Iai successful cut: two intersecting fault lines draw inward to an erased core.
      const size = (reduced ? 8 : 5 + p * 8);
      const angle = effect.variant === 'existing-disappearance' ? Math.PI / 2 : Math.PI / 4;
      const reach = size * 1.8;
      addLine({ x: c.x - Math.cos(angle) * reach, y: c.y - Math.sin(angle) * reach },
        { x: c.x + Math.cos(angle) * reach, y: c.y + Math.sin(angle) * reach }, 3.2,
        rgba(201, 237, 255, alpha));
      addLine({ x: c.x - Math.cos(angle + Math.PI / 2) * reach * 0.72, y: c.y - Math.sin(angle + Math.PI / 2) * reach * 0.72 },
        { x: c.x + Math.cos(angle + Math.PI / 2) * reach * 0.72, y: c.y + Math.sin(angle + Math.PI / 2) * reach * 0.72 }, 2,
        rgba(effect.variant === 'upgraded-to-destruction' ? 231 : 156,
          effect.variant === 'upgraded-to-destruction' ? 173 : 218, 255, alpha * 0.82));
      commands.push(rect(c, Math.max(2, 4 * (1 - p * 0.45)), Math.max(2, 4 * (1 - p * 0.45)), rgba(248, 252, 255, alpha)));
    }
    return commands;
  }
  function create() {
    let destroyed = false;
    const consumed = new Set();
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Special Combat E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' || typeof target !== 'string' || !target)
        throw new TypeError('Special Combat E needs the shared rectangle frame and target');
      const planned = plan({ scene, camera, zoom, viewport });
      const commands = planned.events.flatMap(commandsFor);
      if (commands.length > MAX_EVENTS * MAX_RECTS_PER_EVENT ||
        commands.some(command => ![command.x, command.y, command.w, command.h, command.color?.[3]].every(finite)))
        throw new RangeError('Special Combat E invalid or over budget');
      const cueEdges = [];
      for (const effect of planned.events) if (!consumed.has(effect.id)) {
        consumed.add(effect.id);
        cueEdges.push({ edgeId: `special-combat:${effect.id}:start`, eventId: effect.id,
          soundOwner: effect.soundOwner, playback: 'delegate-existing-owner' });
      }
      if (commands.length) {
        frame.stage('world:special-combat-e');
        for (const command of commands) frame.rect(target, command);
      }
      return { events: planned.events, suppressed: planned.suppressed, commands, cueEdges };
    }
    return Object.freeze({ record, destroy() { destroyed = true; consumed.clear(); } });
  }
  const api = Object.freeze({ TYPES, VARIANTS, DURATIONS, MAX_EVENTS, MAX_RECTS_PER_EVENT, plan, create });
  root.DvaWebGPUSpecialCombatE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
