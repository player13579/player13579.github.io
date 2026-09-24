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
  const MAX_EVENTS = 32, MAX_RECTS_PER_EVENT = 16, DEFAULT_DURATION_MS = 1200;
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
  function commandsFor(effect) {
    const { center: c, progress: p, reducedMotion: reduced } = effect, commands = [];
    const alpha = (1 - p) * (reduced ? 0.55 : 0.88), addLine = (a, b, w, color) => {
      const cmd = line(a, b, w, color); if (cmd) commands.push(cmd);
    };
    if (effect.kind === 'desire') {
      // A divided, fraying pair of outward curls: instability rather than a generic ring.
      for (const side of [-1, 1]) {
        const points = [
          { x: c.x, y: c.y },
          { x: c.x + side * (6 + p * 7), y: c.y - 7 },
          { x: c.x + side * (14 + p * 12), y: c.y + (reduced ? 1 : Math.sin(p * 8 + side) * 5) },
          { x: c.x + side * (20 + p * 14), y: c.y - 8 }
        ];
        for (let i = 0; i < points.length - 1; i++) addLine(points[i], points[i + 1], 2.7 - i * 0.35,
          rgba(221, 115, 255, alpha * (0.95 - i * 0.16)));
      }
      for (const side of [-1, 1]) commands.push(rect({ x: c.x + side * (9 + p * 16), y: c.y + 9 - p * 12 }, 3.4, 3.4,
        rgba(255, 198, 247, alpha * 0.8)));
    } else if (effect.kind === 'rational') {
      // Ordered mana alignment: three ascending paired columns converge on a bright apex.
      const lift = reduced ? 5 : 3 + p * 13;
      for (let i = -1; i <= 1; i++) {
        const x = c.x + i * (reduced ? 6 : 8);
        addLine({ x, y: c.y + 9 }, { x: c.x + i * 2, y: c.y - lift }, 2.2,
          rgba(113, 224, 255, alpha * (i === 0 ? 1 : 0.72)));
      }
      addLine({ x: c.x - 7, y: c.y - lift }, { x: c.x, y: c.y - lift - 4 }, 2,
        rgba(210, 250, 255, alpha));
      addLine({ x: c.x, y: c.y - lift - 4 }, { x: c.x + 7, y: c.y - lift }, 2,
        rgba(210, 250, 255, alpha));
    } else if (effect.kind === 'grit') {
      // Resolve: compact inward wedge and short grounded thrust, distinct from both curls and columns.
      const scale = reduced ? 0.8 : 0.45 + 0.55 * p;
      const points = [
        { x: c.x - 11 * scale, y: c.y - 6 * scale },
        { x: c.x + 10 * scale, y: c.y },
        { x: c.x - 11 * scale, y: c.y + 6 * scale }
      ];
      addLine(points[0], points[1], 3.2, rgba(255, 197, 94, alpha));
      addLine(points[1], points[2], 3.2, rgba(255, 197, 94, alpha * 0.82));
      addLine({ x: c.x - 17 * scale, y: c.y }, { x: c.x - 8 * scale, y: c.y }, 2.1,
        rgba(255, 237, 172, alpha));
    } else {
      // Renki completion: energy returns from a focal point in a measured expanding release.
      const radius = reduced ? 12 : 5 + p * 17;
      const arms = effect.completionKind === 'tenfold' ? (reduced ? 6 : 10) : (reduced ? 4 : 6);
      for (let i = 0; i < arms; i++) {
        const a = i * Math.PI * 2 / arms + (reduced ? 0 : p * 0.24);
        const inner = radius * 0.4, outer = radius;
        addLine({ x: c.x + Math.cos(a) * inner, y: c.y + Math.sin(a) * inner },
          { x: c.x + Math.cos(a) * outer, y: c.y + Math.sin(a) * outer },
          effect.completionKind === 'tenfold' ? 2.2 : 2.8,
          rgba(111, 218, 255, alpha * (effect.completionKind === 'tenfold' ? 0.72 : 0.9)));
      }
      commands.push(rect(c, effect.completionKind === 'tenfold' ? 5 : 4, effect.completionKind === 'tenfold' ? 5 : 4,
        rgba(223, 249, 255, alpha)));
    }
    return commands;
  }
  function create() {
    let destroyed = false;
    const consumedCueIds = new Set();
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Common Action Body E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' || typeof target !== 'string' || !target)
        throw new TypeError('Common Action Body E needs the shared rectangle frame and target');
      const result = plan({ scene, camera, zoom, viewport });
      const commands = result.owned.flatMap(commandsFor);
      if (commands.length > MAX_EVENTS * MAX_RECTS_PER_EVENT ||
        commands.some(c => ![c.x, c.y, c.w, c.h, c.color?.[3]].every(finite)))
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
      if (commands.length) {
        frame.stage('world:common-action-body-e');
        for (const command of commands) frame.rect(target, command);
      }
      return { owned: result.owned, delegated: result.delegated, unsupported: result.unsupported, commands, cueEdges };
    }
    return Object.freeze({ record, destroy() { destroyed = true; consumedCueIds.clear(); } });
  }
  const api = Object.freeze({ TYPE, STATES, OWNERS, MAX_EVENTS, MAX_RECTS_PER_EVENT, DEFAULT_DURATION_MS, plan, create });
  root.DvaWebGPUCommonActionBodyE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
