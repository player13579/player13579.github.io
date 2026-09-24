/* Textureless five-family Alchemy E candidate. Beam origins require an
 * event-bound, same-frame handWorld point; body centers are never used. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const smooth = v => { const t = clamp(v); return t * t * (3 - 2 * t); };
  const TYPE = Object.freeze({
    'alchemy-human-transmutation': 'transmutation',
    'alchemy-excalibur': 'excalibur',
    'alchemy-railgun': 'railgun',
    'alchemy-particle-cannon': 'cannon',
    'alchemy-particle-beam': 'particle-beam'
  });
  const DEFAULT_MS = Object.freeze({
    'alchemy-human-transmutation': 1200, 'alchemy-excalibur': 1200,
    'alchemy-railgun': 900, 'alchemy-particle-cannon': 900, 'alchemy-particle-beam': 420
  });
  const MAX_EVENTS = 24;
  const col = (r, g, b, a) => [r / 255, g / 255, b / 255, clamp(a)];
  function validate({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !Array.isArray(scene.effects) || !Array.isArray(scene.players) || !finite(scene.nowMs) ||
        !camera || ![camera.x, camera.y, zoom].every(finite) || !viewport ||
        ![viewport.width, viewport.height].every(finite) || viewport.width <= 0 || viewport.height <= 0 || zoom <= 0 ||
        (viewport.kind !== undefined && viewport.kind !== 'main'))
      throw new TypeError('Alchemy E needs timed effects, actors, camera, zoom, and logical viewport');
    if (viewport.pixelWidth !== undefined &&
        (!Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth < 1 ||
         !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight < 1))
      throw new TypeError('Alchemy E needs valid physical viewport dimensions');
  }
  function screen(point, camera, zoom, id, label) {
    if (!point || ![point.x, point.y].every(finite))
      throw new Error(`Alchemy E ${id} rejected: explicit ${label} world point required`);
    return { x: (point.x - camera.x) * zoom, y: (point.y - camera.y) * zoom };
  }
  function plan(input = {}) {
    validate(input);
    const { scene, camera, zoom } = input;
    const events = scene.effects.filter(effect => Object.hasOwn(TYPE, String(effect?.type || '')));
    if (events.length > MAX_EVENTS) throw new RangeError(`Alchemy E exceeds ${MAX_EVENTS} concurrent events`);
    const ids = new Set(), result = [];
    for (const effect of events) {
      const id = String(effect.id || ''), playerId = String(effect.playerId || ''), kind = TYPE[effect.type];
      if (!id || ids.has(id)) throw new Error('Alchemy E requires distinct server event IDs');
      ids.add(id);
      if (!playerId || !finite(effect.startedAt))
        throw new Error(`Alchemy E ${id} rejected: playerId and local event start time required`);
      const duration = Number(effect.duration || effect.durationMs || DEFAULT_MS[effect.type]);
      if (!finite(duration) || duration <= 0) throw new Error(`Alchemy E ${id} rejected: positive event duration required`);
      const age = scene.nowMs - effect.startedAt;
      if (age < 0 || age >= duration) continue;
      const owner = scene.players.find(p => String(p?.id || '') === playerId);
      if (!owner || owner.alive === false || owner.ejected || owner.inVent || owner.invisible)
        throw new Error(`Alchemy E ${id} rejected: visible living user ${playerId} unavailable`);
      const body = screen(owner.bodyWorld, camera, zoom, id, 'same-frame user body');
      let origin = null, target = null, targetId = String(effect.targetId || ''), direction = null;
      if (kind === 'transmutation') {
        if (!targetId) throw new Error(`Alchemy E ${id} rejected: exact revived targetId required`);
        const revived = scene.players.find(p => String(p?.id || '') === targetId);
        if (!revived || revived.alive === false || revived.ejected || revived.invisible)
          throw new Error(`Alchemy E ${id} rejected: revived target ${targetId} unavailable`);
        target = screen(revived.bodyWorld, camera, zoom, id, 'same-frame revived target body');
      } else {
        origin = screen(effect.handWorld, camera, zoom, id, 'event-bound handWorld origin');
        if (kind === 'railgun' || kind === 'particle-beam') {
          target = screen({ x: effect.targetX, y: effect.targetY }, camera, zoom, id, 'collision path endpoint');
          const dx = target.x - origin.x, dy = target.y - origin.y, length = Math.hypot(dx, dy);
          if (!finite(length) || length < 1) throw new Error(`Alchemy E ${id} rejected: beam path endpoint must differ from hand`);
          direction = { x: dx / length, y: dy / length };
        } else if (kind === 'excalibur') {
          const aim = effect.directionWorld;
          if (!aim || ![aim.x, aim.y].every(finite) || Math.hypot(aim.x, aim.y) < 1e-6)
            throw new Error(`Alchemy E ${id} rejected: explicit event-time Excalibur directionWorld required`);
          const endWorld = effect.pathEndWorld;
          target = screen(endWorld, camera, zoom, id, 'collision-resolved Excalibur pathEndWorld');
          const dx = target.x - origin.x, dy = target.y - origin.y, length = Math.hypot(dx, dy);
          if (!finite(length) || length < 1) throw new Error(`Alchemy E ${id} rejected: Excalibur path endpoint must differ from hand`);
          direction = { x: aim.x / Math.hypot(aim.x, aim.y), y: aim.y / Math.hypot(aim.x, aim.y) };
        } else {
          // Particle-cannon event is a 6s field activation, not a resolved firing path.
          // Its provided targetX/Y is only an aim projection; subsequent beam events own impacts.
          direction = effect.directionWorld && [effect.directionWorld.x, effect.directionWorld.y].every(finite)
            ? (() => { const n = Math.hypot(effect.directionWorld.x, effect.directionWorld.y); return n > 1e-6 ? { x: effect.directionWorld.x / n, y: effect.directionWorld.y / n } : null; })()
            : null;
        }
      }
      const radius = Number(effect.radius || (kind === 'transmutation' ? 180 : kind === 'excalibur' ? 900 : kind === 'cannon' ? 150 : 100));
      if (!finite(radius) || radius <= 0) throw new Error(`Alchemy E ${id} rejected: positive event radius required`);
      const progress = clamp(age / duration);
      const tail = 1 - smooth((progress - 0.72) / 0.28);
      result.push({ id, type: effect.type, kind, variant: String(effect.variant || ''), playerId, targetId,
        startedAt: effect.startedAt, duration, age, progress, body, origin, target, direction,
        radius: radius * zoom, zoom, reducedMotion: Boolean(scene.reducedMotion),
        alpha: tail * (scene.reducedMotion ? 0.8 : 0.94) });
    }
    return result;
  }
  function segment(a, b, width, rgba) {
    const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy);
    if (!finite(length) || length < 1e-4 || width <= 0) return null;
    const c = dx / length, s = dy / length;
    return { x: -length / 2, y: -width / 2, w: length, h: width,
      transform: [c, s, -s, c, (a.x + b.x) / 2, (a.y + b.y) / 2], color: rgba, mode: 'additive' };
  }
  function path(commands, points, width, rgba) {
    for (let i = 0; i < points.length - 1; i++) {
      const c = segment(points[i], points[i + 1], width, rgba);
      if (c) commands.push(c);
    }
  }
  function arc(cx, cy, rx, ry, a0, a1, steps, rotation = 0) {
    const result = [], cr = Math.cos(rotation), sr = Math.sin(rotation);
    for (let i = 0; i <= steps; i++) {
      const a = a0 + (a1 - a0) * i / steps, x = Math.cos(a) * rx, y = Math.sin(a) * ry;
      result.push({ x: cx + x * cr - y * sr, y: cy + x * sr + y * cr });
    }
    return result;
  }
  function commandsFor(e) {
    const out = [], p = e.progress, a = e.alpha, z = e.zoom;
    if (!(a > 0)) return out;
    if (e.kind === 'transmutation') {
      const { x, y } = e.target, r = e.radius * 0.48 * (0.72 + 0.28 * smooth(p));
      const sides = e.reducedMotion ? 6 : 9;
      const points = [];
      for (let i = 0; i <= sides; i++) {
        const angle = -Math.PI / 2 + i * Math.PI * 2 / sides;
        points.push({ x: x + Math.cos(angle) * r, y: y + Math.sin(angle) * r * 0.72 });
      }
      path(out, points, 2.8 * z, col(183, 240, 255, a * 0.78));
      for (const angle of [0, Math.PI * 2 / 3, Math.PI * 4 / 3]) {
        const len = r * (0.48 + 0.12 * Math.sin(p * Math.PI));
        const ray = segment({ x: x + Math.cos(angle) * r * 0.12, y: y + Math.sin(angle) * r * 0.12 },
          { x: x + Math.cos(angle) * len, y: y + Math.sin(angle) * len }, 2.4 * z,
          col(221, 255, 244, a * 0.86));
        if (ray) out.push(ray);
      }
      // Rising transmutation axis, clearly distinct from any sword or beam path.
      const axis = segment({ x, y: y + r * 0.65 }, { x, y: y - r * 0.9 }, 2.2 * z, col(192, 230, 255, a * 0.78));
      if (axis) out.push(axis);
    } else if (e.kind === 'excalibur') {
      const { origin: s, target: t, direction: d } = e;
      const dx = t.x - s.x, dy = t.y - s.y, length = Math.hypot(dx, dy), nx = dx / length, ny = dy / length;
      const width = e.radius * (e.variant === 'gbo-tenfold' ? 0.12 : 0.075) * (0.55 + 0.45 * Math.sin(Math.PI * p));
      const side = { x: -d.y, y: d.x };
      for (const offset of [-0.32, 0, 0.32]) {
        const a0 = { x: s.x + side.x * width * offset, y: s.y + side.y * width * offset };
        const a1 = { x: t.x + side.x * width * offset, y: t.y + side.y * width * offset };
        const blade = segment(a0, a1, Math.max(2, width * (offset === 0 ? 0.22 : 0.075)),
          offset === 0 ? col(255, 239, 180, a * 0.92) : col(249, 190, 100, a * 0.63));
        if (blade) out.push(blade);
      }
      const crescent = arc(s.x + nx * length * 0.34, s.y + ny * length * 0.34,
        width * 0.58, width * 0.34, -1.25, 1.25, e.reducedMotion ? 6 : 10, Math.atan2(d.y, d.x));
      path(out, crescent, 2.6 * z, col(255, 243, 204, a * 0.7));
    } else if (e.kind === 'railgun' || e.kind === 'particle-beam') {
      const s = e.origin, t = e.target, d = e.direction;
      const dx = t.x - s.x, dy = t.y - s.y, length = Math.hypot(dx, dy), nx = dx / length, ny = dy / length;
      const side = { x: -ny, y: nx };
      if (e.kind === 'railgun') {
        const core = segment(s, t, (e.variant === 'gbo' || e.variant === 'gbo-tenfold' ? 6.5 : 3.3) * z,
          col(244, 251, 255, a * 0.96));
        if (core) out.push(core);
        for (const sign of [-1, 1]) {
          const edge = segment({ x: s.x + side.x * sign * 4 * z, y: s.y + side.y * sign * 4 * z },
            { x: t.x + side.x * sign * 1.5 * z, y: t.y + side.y * sign * 1.5 * z }, 1.8 * z,
            col(109, 220, 255, a * 0.64));
          if (edge) out.push(edge);
        }
        // Terminal path marker only; event payload has no hit target ID.
        const tip = segment({ x: t.x - nx * 10 * z, y: t.y - ny * 10 * z },
          { x: t.x + nx * 7 * z, y: t.y + ny * 7 * z }, 2.4 * z, col(255, 248, 217, a * 0.82));
        if (tip) out.push(tip);
      } else {
        const turns = e.reducedMotion ? 4 : 8;
        for (let ribbon = 0; ribbon < 2; ribbon++) {
          const points = [];
          for (let i = 0; i <= turns; i++) {
            const q = i / turns, theta = (ribbon ? -1 : 1) * q * Math.PI * 2 + (e.reducedMotion ? 0 : p * 1.4);
            const offset = Math.sin(theta) * 5 * z;
            points.push({ x: s.x + nx * length * q + side.x * offset,
              y: s.y + ny * length * q + side.y * offset });
          }
          path(out, points, (ribbon ? 3.2 : 2.1) * z,
            ribbon ? col(226, 170, 255, a * 0.7) : col(121, 242, 255, a * 0.88));
        }
        const core = segment(s, t, 1.5 * z, col(244, 251, 255, a * 0.86));
        if (core) out.push(core);
      }
    } else {
      // Cannon activation is a compressed hand-side coil. Its aim projection is
      // intentionally not rendered as a beam; only collision-resolved beam events do that.
      const { x, y } = e.origin, radius = 12 * z * (0.82 + 0.18 * smooth(p));
      const turns = e.reducedMotion ? 8 : 14;
      for (let arm = 0; arm < 2; arm++) {
        const points = [];
        for (let i = 0; i <= turns; i++) {
          const q = i / turns, angle = q * Math.PI * (arm ? -4 : 4) + (e.reducedMotion ? 0 : p * 1.2);
          const rr = radius * (0.22 + q * 0.78);
          points.push({ x: x + Math.cos(angle) * rr, y: y + Math.sin(angle) * rr });
        }
        path(out, points, 2 * z, arm ? col(223, 173, 255, a * 0.68) : col(130, 235, 255, a * 0.88));
      }
    }
    return out;
  }
  function create() {
    let destroyed = false;
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Alchemy E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' ||
          typeof target !== 'string' || !target)
        throw new TypeError('Alchemy E needs the shared rectangle frame and target');
      const effects = plan({ scene, camera, zoom, viewport });
      if (!effects.length) return { drawn: 0, effects, commands: [] };
      const commands = effects.flatMap(commandsFor);
      if (commands.length > MAX_EVENTS * 64) throw new RangeError('Alchemy E geometry exceeded its bounded primitive budget');
      frame.stage('world:alchemy-e');
      for (const command of commands) frame.rect(target, command);
      return { drawn: effects.length, effects, commands };
    }
    return Object.freeze({ record, destroy() { destroyed = true; } });
  }
  const api = Object.freeze({ TYPE, DEFAULT_MS, MAX_EVENTS, plan, create });
  root.DvaWebGPUAlchemyE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
