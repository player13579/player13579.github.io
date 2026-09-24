/* Textureless WebGPU E candidate for local transfers and teleport phases.
 * It deliberately renders only each event's own visible actor position. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));
  const TYPES = Object.freeze({
    transferIn: 'transfer-in', transferOut: 'transfer-out', warp: 'action-warp'
  });
  const DURATIONS = Object.freeze({
    [TYPES.transferIn]: 760, [TYPES.transferOut]: 760, [TYPES.warp]: 680
  });
  const MAX_EVENTS = 24;
  const MAX_RECTS_PER_EVENT = 20;
  const COLORS = Object.freeze({
    incoming: [0.38, 0.96, 0.83], outgoing: [0.42, 0.72, 1],
    warp: [0.74, 0.56, 1], arrival: [0.53, 0.95, 1]
  });
  function validate({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !Array.isArray(scene.events) || !finite(scene.nowMs) ||
        !Array.isArray(scene.visiblePlayerIds) ||
        (scene.viewerId !== undefined && typeof scene.viewerId !== 'string') ||
        !camera || ![camera.x, camera.y, zoom].every(finite) || zoom <= 0 ||
        !viewport || ![viewport.width, viewport.height].every(finite) ||
        viewport.width <= 0 || viewport.height <= 0 ||
        (viewport.kind !== undefined && viewport.kind !== 'main'))
      throw new TypeError('Transfer/Warp E requires visible owners, local time, camera, zoom, and logical main viewport');
    if ((viewport.pixelWidth !== undefined || viewport.pixelHeight !== undefined) &&
        (!Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth < 1 ||
         !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight < 1))
      throw new TypeError('Transfer/Warp E requires valid physical viewport dimensions');
  }
  function color(rgb, alpha) { return [...rgb, clamp(alpha, 0, 1)]; }
  function rect(center, width, height, rgba, phase = 0) {
    return {
      x: center.x - width / 2, y: center.y - height / 2,
      w: width, h: height, color: rgba, mode: 'additive', rotation: phase
    };
  }
  function plan({ scene, camera, zoom, viewport } = {}) {
    validate({ scene, camera, zoom, viewport });
    const events = scene.events.filter(event => event && Object.values(TYPES).includes(event.type));
    if (events.length > MAX_EVENTS) throw new RangeError('Transfer/Warp E active event budget exceeded');
    const visible = new Set(scene.visiblePlayerIds.map(id => String(id || '')).filter(Boolean));
    const ids = new Set(), plans = [];
    for (const event of events) {
      const id = String(event.id || ''), playerId = String(event.playerId || '');
      if (!id) throw new Error('Transfer/Warp E requires event IDs');
      if (ids.has(id)) continue;
      ids.add(id);
      if (!playerId || !finite(event.startedAt) || ![event.x, event.y].every(finite))
        throw new Error(`Transfer/Warp E ${id} requires own event position, playerId, and local start time`);
      // The existing event owner is not proof of current visibility. The scene
      // adapter must pass only IDs accepted by the shared visible-player path.
      if (!visible.has(playerId)) continue;
      if (event.viewerId && String(event.viewerId) !== String(scene.viewerId || '')) continue;
      const age = scene.nowMs - event.startedAt;
      const cap = DURATIONS[event.type];
      const duration = Math.min(cap, finite(event.durationMs) && event.durationMs > 0 ? event.durationMs : cap);
      if (age < 0 || age >= duration) continue;
      const progress = clamp(age / duration, 0, 1);
      const reducedMotion = Boolean(scene.reducedMotion);
      const origin = { x: (event.x - camera.x) * zoom, y: (event.y - camera.y) * zoom };
      if (![origin.x, origin.y].every(finite)) throw new Error(`Transfer/Warp E ${id} has invalid projected event position`);
      const arrival = event.type === TYPES.warp && String(event.variant || '') === 'arrival';
      const kind = event.type === TYPES.transferIn ? 'transfer-in'
        : event.type === TYPES.transferOut ? 'transfer-out'
          : arrival ? 'warp-arrival' : 'warp-departure';
      plans.push({ id, type: event.type, playerId, kind, origin, age, duration,
        progress, reducedMotion, alpha: (1 - progress) * (reducedMotion ? 0.58 : 0.88) });
    }
    return plans;
  }
  function commandsFor(effect) {
    const commands = [], p = effect.progress, reduced = effect.reducedMotion;
    const c = effect.kind === 'transfer-in' ? COLORS.incoming
      : effect.kind === 'transfer-out' ? COLORS.outgoing
        : effect.kind === 'warp-arrival' ? COLORS.arrival : COLORS.warp;
    const a = effect.alpha;
    const center = effect.origin;
    // Energy is drawn as a local event seal. It never bridges to, points at,
    // or follows a target; the two authoritative warp events stay independent.
    const radius = reduced ? 17 : 8 + Math.sin(Math.PI * p) * 12 + p * 5;
    const count = reduced ? 4 : 6;
    for (let i = 0; i < count; i++) {
      const theta = Math.PI * 2 * i / count + (reduced ? 0 : (effect.kind === 'transfer-out' ? -1 : 1) * p * 0.8);
      const inner = radius * (effect.kind === 'warp-departure' ? 0.46 : 0.66);
      const outer = radius * (effect.kind === 'warp-departure' ? 1.25 : 1.12);
      const start = { x: center.x + Math.cos(theta) * inner, y: center.y + Math.sin(theta) * inner };
      const end = { x: center.x + Math.cos(theta) * outer, y: center.y + Math.sin(theta) * outer };
      const dx = end.x - start.x, dy = end.y - start.y, length = Math.hypot(dx, dy);
      commands.push({ x: (start.x + end.x) / 2 - length / 2, y: (start.y + end.y) / 2 - 1.5,
        w: length, h: 3, transform: [dx / length, dy / length, -dy / length, dx / length,
          (start.x + end.x) / 2, (start.y + end.y) / 2],
        color: color(c, a * (0.58 + (i % 2) * 0.3)), mode: 'additive' });
    }
    const coreScale = reduced
      ? (effect.kind === 'warp-departure' ? 0.52 : effect.kind === 'warp-arrival' ? 0.66 : 0.58)
      : effect.kind === 'warp-departure' ? 0.72 - p * 0.38
        : effect.kind === 'warp-arrival' ? 0.42 + p * 0.48
          : effect.kind === 'transfer-in' ? 0.3 + p * 0.62 : 0.94 - p * 0.52;
    const core = rect(center, Math.max(3, 9 * coreScale), Math.max(3, 9 * coreScale), color(c, a),
      reduced ? 0 : p * 0.78);
    commands.push(core);
    // A short segmented glow marks the changing transfer/warp phase; motion
    // freezes to a readable fixed seal under reduced motion.
    const gap = reduced ? 1 : Math.sin(Math.PI * p) * 4;
    commands.push(rect({ x: center.x - radius * 0.52, y: center.y }, radius * 0.32 - gap * 0.2, 2.4,
      color(c, a * 0.7), reduced ? 0 : -0.16));
    commands.push(rect({ x: center.x + radius * 0.52, y: center.y }, radius * 0.32 - gap * 0.2, 2.4,
      color(c, a * 0.7), reduced ? 0 : 0.16));
    return commands;
  }
  function create() {
    let destroyed = false;
    function record({ frame, target, scene, camera, zoom, viewport } = {}) {
      if (destroyed) throw new Error('Transfer/Warp E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' ||
          typeof target !== 'string' || !target)
        throw new TypeError('Transfer/Warp E requires shared rectangle frame and target');
      const effects = plan({ scene, camera, zoom, viewport });
      const commands = effects.flatMap(commandsFor);
      if (commands.some(command => ![command.x, command.y, command.w, command.h,
          command.color?.[3], ...(command.transform || [])].every(finite)) ||
          commands.length > MAX_EVENTS * MAX_RECTS_PER_EVENT)
        throw new RangeError('Transfer/Warp E invalid or over budget');
      if (commands.length) {
        frame.stage('world:transfer-warp-e');
        for (const command of commands) frame.rect(target, command);
      }
      return { drawn: effects.length, effects, commands };
    }
    return Object.freeze({ record, destroy() { destroyed = true; } });
  }
  const api = Object.freeze({ TYPES, DURATIONS, MAX_EVENTS, MAX_RECTS_PER_EVENT, plan, create });
  root.DvaWebGPUTransferWarpE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
