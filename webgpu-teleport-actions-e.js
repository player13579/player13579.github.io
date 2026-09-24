/* Distinct textureless E candidates for body and heart teleport actions.
 * Body departure/arrival are independent server events; no path is inferred.
 * Heart teleport is caster-private. Its target fields are intentionally ignored. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const smooth = v => { const t = clamp(v); return t * t * (3 - 2 * t); };
  const TYPES = Object.freeze({ body: 'action-teleport', heart: 'action-heart-teleport' });
  const DURATION_MS = Object.freeze({ departure: 680, arrival: 760, heart: 940 });
  const MAX_EVENTS = 24, MAX_RECTS_PER_EVENT = 18;
  const COLORS = Object.freeze({ body: [0.56, 0.79, 1], arrival: [0.62, 0.96, 1], heart: [1, 0.48, 0.66] });

  function validate({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !Array.isArray(scene.events) || !Array.isArray(scene.visiblePlayerIds) ||
        !finite(scene.nowMs) || !camera || ![camera.x, camera.y, zoom].every(finite) || zoom <= 0 ||
        !viewport || ![viewport.width, viewport.height].every(finite) || viewport.width <= 0 || viewport.height <= 0 ||
        (viewport.kind !== undefined && viewport.kind !== 'main') ||
        (scene.viewerId !== undefined && typeof scene.viewerId !== 'string'))
      throw new TypeError('Teleport Actions E needs viewer visibility, timed events, camera, zoom, and logical viewport');
    if ((viewport.pixelWidth !== undefined || viewport.pixelHeight !== undefined) &&
        (!Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth < 1 ||
         !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight < 1))
      throw new TypeError('Teleport Actions E needs valid physical viewport dimensions');
  }

  function rect(center, width, height, color, rotation = 0) {
    return { x: center.x - width / 2, y: center.y - height / 2, w: width, h: height,
      color, mode: 'additive', rotation };
  }

  function classify(event) {
    const type = String(event.type || ''), variant = String(event.variant || '');
    if (type === TYPES.body && (variant === '' || variant === 'arrival'))
      return { kind: variant === 'arrival' ? 'arrival' : 'departure' };
    if (type === TYPES.heart && variant) return { kind: 'heart' };
    return null;
  }

  function plan({ scene, camera, zoom, viewport } = {}) {
    validate({ scene, camera, zoom, viewport });
    const active = scene.events.filter(event => event && classify(event));
    if (active.length > MAX_EVENTS) throw new RangeError(`Teleport Actions E exceeds ${MAX_EVENTS} active events`);
    const visible = new Set(scene.visiblePlayerIds.map(id => String(id || '')).filter(Boolean));
    const ids = new Set(), results = [];
    for (const event of active) {
      const id = String(event.id || ''), playerId = String(event.playerId || '');
      if (!id || ids.has(id)) throw new Error('Teleport Actions E requires distinct event IDs');
      ids.add(id);
      const classification = classify(event);
      if (!playerId || !finite(event.startedAt) || !finite(event.x) || !finite(event.y))
        throw new Error(`Teleport Actions E ${id} requires playerId, local start, and local event coordinates`);
      if (!visible.has(playerId)) continue;
      if (classification.kind === 'heart' &&
          (!scene.viewerId || String(event.viewerId || '') !== scene.viewerId || playerId !== scene.viewerId || !event.targetId))
        continue;
      const duration = DURATION_MS[classification.kind], age = scene.nowMs - event.startedAt;
      if (age < 0 || age >= duration) continue;
      const center = { x: (event.x - camera.x) * zoom, y: (event.y - camera.y) * zoom };
      if (![center.x, center.y].every(finite)) throw new Error(`Teleport Actions E ${id} has invalid projected event coordinates`);
      const progress = clamp(age / duration);
      results.push({ id, type: event.type, playerId, kind: classification.kind, center, age, duration,
        progress, reducedMotion: Boolean(scene.reducedMotion), alpha: (1 - smooth(progress)) *
          (scene.reducedMotion ? 0.58 : 0.88), privateToViewer: classification.kind === 'heart',
        // A target coordinate may exist on either event; this plan never reads it.
        endpointUsed: false });
    }
    return results;
  }

  function commandsFor(effect) {
    const { center: c, progress: p, reducedMotion: reduced, alpha } = effect;
    const commands = [], color = effect.kind === 'heart' ? COLORS.heart
      : effect.kind === 'arrival' ? COLORS.arrival : COLORS.body;
    const rgba = (amount, rgb = color) => [...rgb, clamp(alpha * amount)];
    const add = (x, y, w, h, a, rotation = 0, rgb = color) => commands.push(rect({ x, y }, w, h, rgba(a, rgb), reduced ? 0 : rotation));
    if (effect.kind === 'heart') {
      // A private compressive seal: three tapered chevrons close on the caster's point.
      // It suggests remote focus without exposing or geometrically encoding the target.
      const spread = reduced ? 7 : 13 - p * 5;
      for (let i = 0; i < 3; i++) {
        const depth = i * (reduced ? 3 : 4.5), half = spread - i * 2;
        add(c.x - half / 2, c.y - depth, half, 2.2, 0.92 - i * 0.14, -0.62);
        add(c.x + half / 2, c.y - depth, half, 2.2, 0.92 - i * 0.14, 0.62);
      }
      add(c.x, c.y + (reduced ? 0 : 3 * Math.sin(p * Math.PI)), 3.2, reduced ? 6 : 8, 1, 0,
        [1, 0.82, 0.9]);
      return commands;
    }
    const contracting = effect.kind === 'departure';
    const radius = reduced ? 9 : (contracting ? 15 - p * 7 : 7 + p * 9);
    const shrink = reduced ? 0 : (contracting ? p * 0.42 : -p * 0.42);
    // Four separate portal corners; departure collapses, arrival opens. No bridge between events.
    for (let i = 0; i < 4; i++) {
      const angle = Math.PI / 4 + i * Math.PI / 2 + (reduced ? 0 : (contracting ? -1 : 1) * p * 0.55);
      const x = c.x + Math.cos(angle) * radius, y = c.y + Math.sin(angle) * radius * 0.72;
      add(x, y, 8 - shrink * 3, 2.5, 0.9 - i * 0.07, angle + Math.PI / 2);
    }
    const core = contracting ? 1 - p * 0.68 : 0.35 + p * 0.65;
    add(c.x, c.y, reduced ? 4.5 : 4 + core * 4, reduced ? 4.5 : 4 + core * 4, 0.96,
      reduced ? 0 : (contracting ? -p : p) * 0.9, [0.84, 0.93, 1]);
    add(c.x - radius * 0.55, c.y, reduced ? 3 : 3 + p * 3, 1.8, 0.7, reduced ? 0 : -0.22);
    add(c.x + radius * 0.55, c.y, reduced ? 3 : 3 + p * 3, 1.8, 0.7, reduced ? 0 : 0.22);
    return commands;
  }

  function create() {
    let destroyed = false;
    function record({ frame, target, scene, camera, zoom, viewport } = {}) {
      if (destroyed) throw new Error('Teleport Actions E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' || typeof target !== 'string' || !target)
        throw new TypeError('Teleport Actions E needs shared rectangle frame and target');
      const effects = plan({ scene, camera, zoom, viewport });
      const commands = effects.flatMap(commandsFor);
      if (commands.length > MAX_EVENTS * MAX_RECTS_PER_EVENT || commands.some(cmd =>
          ![cmd.x, cmd.y, cmd.w, cmd.h, cmd.rotation, ...cmd.color].every(finite)))
        throw new RangeError('Teleport Actions E invalid or over budget');
      if (commands.length) {
        frame.stage('world:teleport-actions-e');
        for (const command of commands) frame.rect(target, command);
      }
      return { drawn: effects.length, effects, commands };
    }
    return Object.freeze({ record, destroy() { destroyed = true; } });
  }

  const api = Object.freeze({ TYPES, DURATION_MS, MAX_EVENTS, MAX_RECTS_PER_EVENT, plan, create });
  root.DvaWebGPUTeleportActionsE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
