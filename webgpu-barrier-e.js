/* Textureless durable-barrier E candidate for the shared WebGPU frame.
 * Accepts only the server's three durable barrier event families. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const smooth = v => { const t = clamp(v); return t * t * (3 - 2 * t); };
  const MAX_EVENTS = 24;
  const TYPE = 'durable-barrier';
  const EVENT_MAP = Object.freeze({
    'action-stand:durability-created': { phase: 'create', owner: 'targetId', attacker: 'playerId', duration: 650 },
    'preparation-barrier-hit:durability-hit': { phase: 'hit', owner: 'playerId', attacker: 'targetId', duration: 650 },
    'preparation-barrier-hit:durability-broken': { phase: 'break', owner: 'playerId', attacker: 'targetId', duration: 480 },
    'action-push:timed-bust-break': { phase: 'break', owner: 'targetId', attacker: 'playerId', duration: 480 }
  });
  const rgba = (r, g, b, a) => [r / 255, g / 255, b / 255, clamp(a)];

  function resolveEvent(effect) {
    return EVENT_MAP[`${String(effect?.type || '')}:${String(effect?.variant || '')}`] || null;
  }
  function validate({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !Array.isArray(scene.effects) || !Array.isArray(scene.players) ||
        !finite(scene.nowMs) || !camera || ![camera.x, camera.y, zoom].every(finite) ||
        !viewport || ![viewport.width, viewport.height].every(finite) ||
        viewport.width <= 0 || viewport.height <= 0 || zoom <= 0 ||
        (viewport.kind !== undefined && viewport.kind !== 'main'))
      throw new TypeError('Barrier E needs timed effects, actors, camera, zoom, and logical viewport');
    if (viewport.pixelWidth !== undefined &&
        (!Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth < 1 ||
         !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight < 1))
      throw new TypeError('Barrier E needs valid physical viewport dimensions');
  }
  function plan(input = {}) {
    validate(input);
    const { scene, camera, zoom } = input;
    const events = scene.effects.filter(effect => resolveEvent(effect));
    if (events.length > MAX_EVENTS) throw new RangeError(`Barrier E exceeds ${MAX_EVENTS} concurrent events`);
    const ids = new Set();
    const results = [];
    for (const effect of events) {
      const id = String(effect.id || '');
      if (!id || ids.has(id)) throw new Error('Barrier E needs distinct one-shot event IDs');
      ids.add(id);
      const spec = resolveEvent(effect);
      const startedAt = Number(effect.startedAt);
      const duration = Number(effect.duration || effect.durationMs || spec.duration);
      if (!finite(startedAt) || !finite(duration) || duration <= 0)
        throw new Error(`Barrier E ${id} rejected: finite local event clock and duration required`);
      const progress = clamp((scene.nowMs - startedAt) / duration);
      if (scene.nowMs < startedAt || scene.nowMs >= startedAt + duration) continue;
      const ownerId = String(effect[spec.owner] || '');
      const attackerId = String(effect[spec.attacker] || '');
      if (!ownerId) throw new Error(`Barrier E ${id} rejected: ${spec.owner} must identify the barrier owner`);
      const owner = scene.players.find(p => String(p?.id || '') === ownerId);
      if (!owner || ![owner.x, owner.y].every(finite))
        throw new Error(`Barrier E ${id} rejected: owner ${ownerId} needs a finite world position`);
      const durability = Number(owner.barrierDurability);
      if (!finite(durability) || durability < 0)
        throw new Error(`Barrier E ${id} rejected: authoritative barrierDurability required`);
      const attacker = scene.players.find(p => String(p?.id || '') === attackerId);
      const angle = attacker && [attacker.x, attacker.y].every(finite)
        ? Math.atan2(attacker.y - owner.y, attacker.x - owner.x) : 0;
      const center = { x: (owner.x - camera.x) * zoom, y: (owner.y - camera.y) * zoom };
      const reduced = Boolean(scene.reducedMotion);
      const envelope = spec.phase === 'create'
        ? Math.sin(Math.PI * Math.min(1, progress * 1.65)) * (1 - progress * 0.22)
        : spec.phase === 'break' ? 1 - smooth(progress * 0.82) :
          Math.min(1, progress / 0.08) * (1 - progress * 0.65);
      const pulse = reduced ? 1 : 0.91 + 0.09 * Math.sin(progress * Math.PI * 8);
      const radius = (spec.phase === 'break' ? 63 + (reduced ? 0 : 13 * progress) :
        spec.phase === 'hit' ? 60 + (reduced ? 0 : 5 * Math.sin(progress * Math.PI * 2)) : 58 + 11 * smooth(progress)) * zoom;
      results.push({ id, type: effect.type, variant: effect.variant, phase: spec.phase,
        ownerId, attackerId, progress, duration, startedAt, reducedMotion: reduced,
        center, angle, radius, envelope: clamp(envelope * pulse), durability,
        broke: spec.phase === 'break' || effect.variant === 'durability-broken' });
    }
    return results;
  }
  function rect(a, b, width, color, mode = 'additive') {
    const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy);
    if (!finite(length) || length < 1e-4) return null;
    const c = dx / length, s = dy / length;
    return { x: -length / 2, y: -width / 2, w: length, h: width,
      transform: [c, s, -s, c, (a.x + b.x) / 2, (a.y + b.y) / 2],
      color, mode };
  }
  function commandsFor(event) {
    const commands = [];
    const { center: c, radius: r, envelope: e } = event;
    const count = event.reducedMotion ? 16 : 24;
    // A faceted double membrane: broad continuous-looking arcs with open gaps.
    for (let ring = 0; ring < 2; ring++) {
      const rr = r * (ring ? 0.77 : 1);
      const segments = ring ? Math.floor(count * 0.7) : count;
      const width = (ring ? 2.8 : 4.4) * (event.phase === 'break' ? 1 : 0.82);
      for (let i = 0; i < segments; i++) {
        if (ring && i % 4 === 2) continue;
        const a0 = i * Math.PI * 2 / segments + (event.reducedMotion ? 0 : event.progress * (ring ? -0.24 : 0.19));
        const span = (Math.PI * 2 / segments) * 0.88;
        const a1 = a0 + span;
        const p0 = { x: c.x + Math.cos(a0) * rr, y: c.y + Math.sin(a0) * rr * 1.14 };
        const p1 = { x: c.x + Math.cos(a1) * rr, y: c.y + Math.sin(a1) * rr * 1.14 };
        const alpha = e * (ring ? 0.56 : 0.83);
        const color = event.phase === 'break' ? rgba(255, 190, 116, alpha) :
          event.phase === 'hit' ? rgba(155, 229, 255, alpha) : rgba(120, 202, 255, alpha);
        const command = rect(p0, p1, width, color);
        if (command) commands.push(command);
      }
    }
    // Hit pressure is directed toward the attacker; break emits a small, fixed-count shard fan.
    if (event.phase === 'hit') {
      const direction = event.angle + Math.PI;
      const a0 = direction - 0.42, a1 = direction + 0.42;
      const p0 = { x: c.x + Math.cos(a0) * r * 0.73, y: c.y + Math.sin(a0) * r * 0.82 };
      const p1 = { x: c.x + Math.cos(a1) * r * 0.73, y: c.y + Math.sin(a1) * r * 0.82 };
      const hit = rect(p0, p1, 3.5, rgba(230, 251, 255, e * 0.92));
      if (hit) commands.push(hit);
    } else if (event.phase === 'break' && !event.reducedMotion) {
      for (let i = 0; i < 6; i++) {
        const a = event.angle + Math.PI + (i - 2.5) * 0.32;
        const start = { x: c.x + Math.cos(a) * r * 0.18, y: c.y + Math.sin(a) * r * 0.2 };
        const distance = r * (0.34 + 0.12 * (i % 3)) * (1 - event.progress * 0.35);
        const end = { x: c.x + Math.cos(a) * (r * 0.18 + distance), y: c.y + Math.sin(a) * (r * 0.2 + distance) };
        const shard = rect(start, end, 2.5 + (i % 2), rgba(255, 211, 154, e * (0.84 - i * 0.045)));
        if (shard) commands.push(shard);
      }
    }
    return commands;
  }
  function create() {
    let destroyed = false;
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Barrier E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' ||
          typeof target !== 'string' || !target)
        throw new TypeError('Barrier E needs the shared rectangle frame and target');
      const events = plan({ scene, camera, zoom, viewport });
      if (!events.length) return { drawn: 0, events, commands: [] };
      const commands = events.flatMap(commandsFor);
      if (commands.length > MAX_EVENTS * 64) throw new RangeError('Barrier E primitive budget exceeded');
      frame.stage('world:durable-barrier-e');
      for (const command of commands) frame.rect(target, command);
      return { drawn: events.length, events, commands };
    }
    return Object.freeze({ record, destroy() { destroyed = true; } });
  }
  const api = Object.freeze({ TYPE, MAX_EVENTS, EVENT_MAP, resolveEvent, plan, create });
  root.DvaWebGPUBarrierE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
