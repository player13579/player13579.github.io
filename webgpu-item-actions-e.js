/* Textureless local pickup E candidate. Item-use poses, throw flight/impact,
 * acquisition, and benefit results retain their existing dedicated owners. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const smooth = v => { const t = clamp(v); return t * t * (3 - 2 * t); };
  const TYPES = Object.freeze({ pickup: 'action-item-pickup', use: 'action-item-use', throw: 'action-item-throw' });
  const PICKUP_MS = 560, MAX_EVENTS = 32, MAX_RECTS_PER_EVENT = 12;
  const PICKUP_COLOR = Object.freeze([0.55, 0.92, 0.82]);

  function validate({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !Array.isArray(scene.events) || !Array.isArray(scene.visiblePlayerIds) ||
        !finite(scene.nowMs) || !camera || ![camera.x, camera.y, zoom].every(finite) || zoom <= 0 ||
        !viewport || ![viewport.width, viewport.height].every(finite) || viewport.width <= 0 || viewport.height <= 0 ||
        (viewport.kind !== undefined && viewport.kind !== 'main'))
      throw new TypeError('Item Actions E needs visible owners, timed events, camera, zoom, and logical viewport');
    if ((viewport.pixelWidth !== undefined || viewport.pixelHeight !== undefined) &&
        (!Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth < 1 ||
         !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight < 1))
      throw new TypeError('Item Actions E needs valid physical viewport dimensions');
  }

  function rect(center, width, height, color, rotation = 0) {
    return { x: center.x - width / 2, y: center.y - height / 2, w: width, h: height,
      color, mode: 'additive', rotation };
  }

  function plan({ scene, camera, zoom, viewport } = {}) {
    validate({ scene, camera, zoom, viewport });
    const active = scene.events.filter(event => event && Object.values(TYPES).includes(event.type));
    if (active.length > MAX_EVENTS) throw new RangeError(`Item Actions E exceeds ${MAX_EVENTS} active events`);
    const ids = new Set(), visible = new Set(scene.visiblePlayerIds.map(id => String(id || '')).filter(Boolean));
    const owned = [], skipped = [];
    for (const event of active) {
      const id = String(event.id || ''), type = String(event.type || ''), variant = String(event.variant || '');
      if (!id || ids.has(id)) throw new Error('Item Actions E requires distinct event IDs');
      ids.add(id);
      if (!variant) throw new Error(`Item Actions E ${id} requires its exact item variant`);
      const playerId = String(event.playerId || '');
      // Impact events may have no playerId: their actual landing effect is separately owned.
      if (type === TYPES.throw && variant.startsWith('impact:')) {
        skipped.push({ id, type, reason: 'landing-impact-owned-by-item-or-impact-e' });
        continue;
      }
      if (!playerId || !finite(event.startedAt) || !finite(event.x) || !finite(event.y))
        throw new Error(`Item Actions E ${id} requires actor, local start, and event coordinates`);
      if (!visible.has(playerId)) continue;
      if (type === TYPES.use) {
        skipped.push({ id, type, reason: 'item-specific-use-pose-and-result-e-own-this-action' });
        continue;
      }
      if (type === TYPES.throw) {
        skipped.push({ id, type, reason: 'throw-body-motion-flight-physics-and-impact-own-this-action' });
        continue;
      }
      const age = scene.nowMs - event.startedAt;
      if (age < 0 || age >= PICKUP_MS) continue;
      // The event source is the picker, not the removed ground-item position.
      // The item ID is used only as receipt validation; it never selects an icon.
      const center = { x: (event.x - camera.x) * zoom, y: (event.y - camera.y) * zoom };
      if (![center.x, center.y].every(finite)) throw new Error(`Item Actions E ${id} has invalid projected actor point`);
      const progress = clamp(age / PICKUP_MS);
      owned.push({ id, playerId, kind: 'pickup-receipt', center, age, duration: PICKUP_MS, progress,
        reducedMotion: Boolean(scene.reducedMotion), alpha: (1 - smooth(progress)) * (scene.reducedMotion ? 0.54 : 0.84),
        itemIdentityUsedForGeometry: false });
    }
    return { owned, skipped };
  }

  function commandsFor(effect) {
    const { center: c, progress: p, reducedMotion: reduced, alpha } = effect;
    const commands = [], rgba = amount => [...PICKUP_COLOR, clamp(alpha * amount)];
    const add = (x, y, w, h, amount, rotation = 0) => commands.push(rect({ x, y }, w, h, rgba(amount), reduced ? 0 : rotation));
    // A successful pickup leaves the ground object; two inward folds close at the
    // actor-local receipt point. It does not depict the removed item's shape or benefit.
    const reach = reduced ? 8 : 15 - p * 5;
    for (const side of [-1, 1]) {
      const x = c.x + side * reach * 0.55;
      add(x, c.y - 5, 8 - (reduced ? 0 : p * 2), 2.4, 0.96, side * 0.68);
      add(c.x + side * reach * 0.27, c.y + 1, 6, 2, 0.74, -side * 0.48);
    }
    const flash = reduced ? 0 : Math.sin(Math.PI * p);
    add(c.x, c.y, 3.2 + flash * 2.4, 3.2 + flash * 2.4, 0.9);
    return commands;
  }

  function create() {
    let destroyed = false;
    function record({ frame, target, scene, camera, zoom, viewport } = {}) {
      if (destroyed) throw new Error('Item Actions E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' || typeof target !== 'string' || !target)
        throw new TypeError('Item Actions E needs shared rectangle frame and target');
      const planned = plan({ scene, camera, zoom, viewport });
      const commands = planned.owned.flatMap(commandsFor);
      if (commands.length > MAX_EVENTS * MAX_RECTS_PER_EVENT || commands.some(cmd =>
          ![cmd.x, cmd.y, cmd.w, cmd.h, cmd.rotation, ...cmd.color].every(finite)))
        throw new RangeError('Item Actions E invalid or over budget');
      if (commands.length) {
        frame.stage('world:item-pickup-e');
        for (const command of commands) frame.rect(target, command);
      }
      return { drawn: planned.owned.length, owned: planned.owned, skipped: planned.skipped, commands };
    }
    return Object.freeze({ record, destroy() { destroyed = true; } });
  }

  const api = Object.freeze({ TYPES, PICKUP_MS, MAX_EVENTS, MAX_RECTS_PER_EVENT, plan, create });
  root.DvaWebGPUItemActionsE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
