/* Textureless dodge E for the shared WebGPU frame. The activation event owns
 * the short trail; self dodgeActiveUntil is state-only (not public actor data). */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const smooth = v => { const t = clamp(v); return t * t * (3 - 2 * t); };
  const MAX_EVENTS = 24;
  const EVENT_TYPE = 'action-dodge';
  const VISUAL_MS = 360;
  const BASE_DODGE_MS = 1000;
  const color = (r, g, b, a) => [r / 255, g / 255, b / 255, clamp(a)];
  function validate({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !Array.isArray(scene.events) || !Array.isArray(scene.players) ||
        !finite(scene.nowMs) || !camera || ![camera.x, camera.y, zoom].every(finite) ||
        !viewport || ![viewport.width, viewport.height].every(finite) ||
        viewport.width <= 0 || viewport.height <= 0 || zoom <= 0 ||
        (viewport.kind !== undefined && viewport.kind !== 'main'))
      throw new TypeError('Dodge E needs local time, events, actors, camera, zoom, and logical viewport');
    if (viewport.pixelWidth !== undefined &&
        (!Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth < 1 ||
         !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight < 1))
      throw new TypeError('Dodge E needs valid physical viewport dimensions');
  }
  function toScreen(point, camera, zoom, label) {
    if (!point || ![point.x, point.y].every(finite)) throw new Error(`Dodge E requires finite ${label} world coordinates`);
    return { x: (point.x - camera.x) * zoom, y: (point.y - camera.y) * zoom };
  }
  function plan(input = {}) {
    validate(input);
    const { scene, camera, zoom } = input;
    const known = new Set(), results = [];
    const events = scene.events.filter(e => e?.type === EVENT_TYPE && (e.variant == null || e.variant === ''));
    if (events.length > MAX_EVENTS) throw new RangeError(`Dodge E exceeds ${MAX_EVENTS} active action events`);
    for (const event of events) {
      const id = String(event.id || ''), playerId = String(event.playerId || '');
      if (!id || known.has(id)) throw new Error('Dodge E requires distinct action event IDs');
      known.add(id);
      if (!playerId || !finite(event.startedAt)) throw new Error(`Dodge E ${id} rejected: exact playerId and local event start required`);
      const age = scene.nowMs - event.startedAt;
      if (age < 0 || age >= VISUAL_MS) continue;
      const player = scene.players.find(p => String(p?.id || '') === playerId);
      if (!player) throw new Error(`Dodge E ${id} rejected: action owner ${playerId} unavailable`);
      const origin = toScreen({ x: event.x, y: event.y }, camera, zoom, 'action event');
      const body = toScreen(player.bodyWorld, camera, zoom, 'owner body');
      const dx = body.x - origin.x, dy = body.y - origin.y;
      const length = Math.hypot(dx, dy);
      const angle = length > 0.5 ? Math.atan2(dy, dx) :
        (player.facingAngle != null && finite(player.facingAngle) ? player.facingAngle : 0);
      results.push({ id, kind: 'activation', playerId, age, progress: clamp(age / VISUAL_MS),
        origin, body, distance: length, angle, reducedMotion: Boolean(scene.reducedMotion),
        alpha: (1 - smooth(age / VISUAL_MS)) * (scene.reducedMotion ? 0.72 : 0.9) });
    }
    // dodgeActiveUntil is present only in the viewer's self snapshot. Preserve that
    // scope instead of inventing opponent state or collision receipts.
    const self = scene.self;
    if (self && self.id && finite(self.dodgeActiveUntil) && finite(scene.serverNow) &&
        self.dodgeActiveUntil > scene.serverNow) {
      const player = scene.players.find(p => String(p?.id || '') === String(self.id));
      if (!player) throw new Error('Dodge E self state needs a matching actor');
      const body = toScreen(player.bodyWorld, camera, zoom, 'self body');
      const total = BASE_DODGE_MS + Math.max(0, Number(self.dodgeDurationBonusMs) || 0);
      const remaining = self.dodgeActiveUntil - scene.serverNow;
      results.push({ id: `state:${self.id}:${self.dodgeActiveUntil}`, kind: 'active', playerId: String(self.id),
        body, remaining, progress: clamp(1 - remaining / total), reducedMotion: Boolean(scene.reducedMotion),
        phase: scene.reducedMotion ? 0 : (total - remaining) * 0.003 });
    }
    return results;
  }
  function line(a, b, width, rgba) {
    const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy);
    if (!finite(length) || length < 1e-4) return null;
    const c = dx / length, s = dy / length;
    return { x: -length / 2, y: -width / 2, w: length, h: width,
      transform: [c, s, -s, c, (a.x + b.x) / 2, (a.y + b.y) / 2],
      color: rgba, mode: 'additive' };
  }
  function commandsFor(effect) {
    const commands = [], { reducedMotion: reduced } = effect;
    if (effect.kind === 'active') {
      // Small broken waist arcs mark invulnerability without reading as a barrier shell.
      for (let i = 0; i < 3; i++) {
        const a0 = effect.phase + i * Math.PI * 2 / 3;
        const a1 = a0 + (reduced ? 0.42 : 0.55);
        const r = 17;
        const p0 = { x: effect.body.x + Math.cos(a0) * r, y: effect.body.y + Math.sin(a0) * r * 0.58 };
        const p1 = { x: effect.body.x + Math.cos(a1) * r, y: effect.body.y + Math.sin(a1) * r * 0.58 };
        const cmd = line(p0, p1, 2.2, color(161, 232, 255, reduced ? 0.4 : 0.52));
        if (cmd) commands.push(cmd);
      }
      return commands;
    }
    const fade = effect.alpha;
    // The activation trace links the server-captured start point to the owner's current
    // position. Even a stationary dodge gets a compact bilateral slip mark, not a target check.
    if (effect.distance > 2) {
      const dx = effect.body.x - effect.origin.x, dy = effect.body.y - effect.origin.y;
      const nx = dx / effect.distance, ny = dy / effect.distance;
      const sideX = -ny * 3, sideY = nx * 3;
      for (const side of [-1, 1]) {
        const offset = side * 3;
        const p0 = { x: effect.origin.x + sideX * side, y: effect.origin.y + sideY * side };
        const p1 = { x: effect.body.x + sideX * side - nx * 6, y: effect.body.y + sideY * side - ny * 6 };
        const cmd = line(p0, p1, 2.8, color(119, 219, 255, fade * 0.88));
        if (cmd) commands.push(cmd);
      }
    }
    const rays = reduced ? 4 : 6;
    for (let i = 0; i < rays; i++) {
      const a = effect.angle + i * Math.PI * 2 / rays;
      const radius = 9 + (reduced ? 5 : 9 * effect.progress);
      const center = effect.body;
      const p0 = { x: center.x + Math.cos(a) * (radius * 0.46), y: center.y + Math.sin(a) * (radius * 0.35) };
      const p1 = { x: center.x + Math.cos(a) * radius, y: center.y + Math.sin(a) * radius * 0.78 };
      const cmd = line(p0, p1, 2.2, color(189, 244, 255, fade * (0.8 - i * 0.04)));
      if (cmd) commands.push(cmd);
    }
    return commands;
  }
  function create() {
    let destroyed = false;
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Dodge E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' ||
          typeof target !== 'string' || !target)
        throw new TypeError('Dodge E needs the shared rectangle frame and target');
      const effects = plan({ scene, camera, zoom, viewport });
      if (!effects.length) return { drawn: 0, effects, commands: [] };
      const commands = effects.flatMap(commandsFor);
      if (commands.length > MAX_EVENTS * 8 + 8) throw new RangeError('Dodge E primitive budget exceeded');
      frame.stage('world:action-dodge-e');
      for (const command of commands) frame.rect(target, command);
      return { drawn: effects.length, effects, commands };
    }
    return Object.freeze({ record, destroy() { destroyed = true; } });
  }
  const api = Object.freeze({ EVENT_TYPE, VISUAL_MS, BASE_DODGE_MS, MAX_EVENTS, plan, create });
  root.DvaWebGPUDodgeE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
