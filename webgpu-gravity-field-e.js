/* Textureless Gravity E candidates. Time Keeper is an activation-bound point field;
 * Gravity Storm follows the authoritative public gravityZones state. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const TYPES = Object.freeze({ keeper: 'gravity-time-keeper', storm: 'gravity-storm' });
  const KEEP_RADIUS = 155;
  const MAX_FIELDS = 16;
  const rgba = (r, g, b, a) => [r / 255, g / 255, b / 255, clamp(a)];
  function validate({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !Array.isArray(scene.effects) || !Array.isArray(scene.gravityZones) ||
      !finite(scene.nowMs) || !camera || ![camera.x, camera.y, zoom].every(finite) || zoom <= 0 ||
      !viewport || ![viewport.width, viewport.height].every(finite) || viewport.width <= 0 || viewport.height <= 0 ||
      (viewport.kind !== undefined && viewport.kind !== 'main'))
      throw new TypeError('Gravity Field E requires effects, gravity zones, local time, camera, zoom, and logical viewport');
    if ((viewport.pixelWidth !== undefined || viewport.pixelHeight !== undefined) &&
      (!Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth < 1 ||
        !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight < 1))
      throw new TypeError('Gravity Field E requires valid physical viewport dimensions');
  }
  function screen(x, y, camera, zoom, name) {
    if (![x, y].every(finite)) throw new Error(`Gravity Field E requires finite ${name} coordinates`);
    return { x: (x - camera.x) * zoom, y: (y - camera.y) * zoom };
  }
  function plan({ scene, camera, zoom, viewport } = {}) {
    validate({ scene, camera, zoom, viewport });
    const out = [];
    const keeperEvents = scene.effects.filter(e => e?.type === TYPES.keeper);
    const zones = scene.gravityZones.filter(z => z && z.ownerId && finite(z.startedAt) && finite(z.endsAt));
    if (keeperEvents.length + zones.length > MAX_FIELDS) throw new RangeError('Gravity Field E active field budget exceeded');
    const ids = new Set();
    for (const event of keeperEvents) {
      const id = String(event.id || ''), ownerId = String(event.playerId || '');
      if (!id || ids.has(id)) throw new Error('Gravity Field E requires unique event/zone IDs');
      ids.add(id);
      if (!ownerId || event.variant !== 'total-stop') throw new Error(`Gravity Field E ${id} has unsupported Time Keeper payload`);
      const duration = Number(event.durationMs);
      if (!finite(event.startedAt) || !finite(duration) || duration <= 0) throw new Error(`Gravity Field E ${id} needs local start and exact duration`);
      const age = scene.nowMs - event.startedAt;
      if (age < 0 || age >= duration) continue;
      const radius = Number(event.radius);
      if (!finite(radius) || radius <= 0) throw new Error(`Gravity Field E ${id} needs its explicit event radius`);
      out.push({ id, kind: 'time-keeper', ownerId, center: screen(event.x, event.y, camera, zoom, 'Time Keeper event'),
        radius: radius * zoom, age, duration, progress: clamp(age / duration), reducedMotion: Boolean(scene.reducedMotion) });
    }
    for (const zone of zones) {
      const id = String(zone.id || ''), ownerId = String(zone.ownerId || '');
      if (!id || ids.has(id)) throw new Error('Gravity Field E requires unique event/zone IDs');
      ids.add(id);
      if (!finite(zone.x) || !finite(zone.y) || !finite(zone.radius) || zone.radius <= 0 ||
        !finite(zone.barrierUntil) || !finite(scene.serverNow))
        throw new Error(`Gravity Field E ${id} needs authoritative center, radius, barrierUntil, and serverNow`);
      const duration = zone.endsAt - zone.startedAt;
      if (!finite(duration) || duration <= 0) throw new Error(`Gravity Field E ${id} has invalid exact lifetime`);
      const age = scene.serverNow - zone.startedAt;
      if (age < 0 || scene.serverNow >= zone.endsAt) continue;
      out.push({ id, kind: 'storm', ownerId, targetId: String(zone.targetId || ''),
        center: screen(zone.x, zone.y, camera, zoom, 'Gravity Storm zone'), radius: zone.radius * zoom,
        age, duration, remaining: zone.endsAt - scene.serverNow, progress: clamp(age / duration),
        barrierActive: scene.serverNow < zone.barrierUntil, reducedMotion: Boolean(scene.reducedMotion) });
    }
    return out;
  }
  function line(a, b, width, color, mode = 'additive') {
    const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy);
    if (!finite(length) || length < 0.01) return null;
    const c = dx / length, s = dy / length;
    return { x: -length / 2, y: -width / 2, w: length, h: width,
      transform: [c, s, -s, c, (a.x + b.x) / 2, (a.y + b.y) / 2], color, mode };
  }
  function circle(center, radius, segments, phase, width, color) {
    const commands = [];
    for (let i = 0; i < segments; i++) {
      const a0 = phase + i * Math.PI * 2 / segments;
      const span = Math.PI * 2 / segments * 0.72;
      const a1 = a0 + span;
      const p0 = { x: center.x + Math.cos(a0) * radius, y: center.y + Math.sin(a0) * radius };
      const p1 = { x: center.x + Math.cos(a1) * radius, y: center.y + Math.sin(a1) * radius };
      const cmd = line(p0, p1, width, color);
      if (cmd) commands.push(cmd);
    }
    return commands;
  }
  function commandsFor(field) {
    const reduced = field.reducedMotion, p = field.progress, commands = [];
    if (field.kind === 'time-keeper') {
      // A point-anchored stop field: contracting outer halo at activation, a held broken
      // clock ring, then collapse. The supplied radius and event location are authoritative.
      const radius = field.radius * (p < 0.16 ? 0.58 + p * 2.6 : p > 0.84 ? 1 - (p - 0.84) * 2.6 : 1);
      const phase = reduced ? 0 : field.age * 0.0012;
      const alpha = p < 0.16 ? 0.9 : p > 0.84 ? 0.68 : 0.54;
      commands.push(...circle(field.center, radius, reduced ? 8 : 12, phase, 2.6, rgba(115, 218, 255, alpha)));
      commands.push(...circle(field.center, radius * 0.72, reduced ? 4 : 6, -phase * 0.45, 1.3, rgba(206, 244, 255, alpha * 0.64)));
      const rays = reduced ? 4 : 8;
      for (let i = 0; i < rays; i++) {
        const a = i * Math.PI * 2 / rays + phase;
        const inner = radius * 0.82, outer = radius * (0.94 + (i % 2) * 0.03);
        const cmd = line({ x: field.center.x + Math.cos(a) * inner, y: field.center.y + Math.sin(a) * inner },
          { x: field.center.x + Math.cos(a) * outer, y: field.center.y + Math.sin(a) * outer }, 2.1,
          rgba(176, 239, 255, alpha * 0.86));
        if (cmd) commands.push(cmd);
      }
    } else {
      // Gravity Storm vortex: exact server zone boundary with a slow inward-turning
      // set of broad spokes; no fabricated safe-zone or barrier geometry.
      const phase = reduced ? 0 : field.age * 0.00045;
      const alpha = reduced ? 0.42 : 0.58;
      commands.push(...circle(field.center, field.radius, reduced ? 8 : 12, phase, 3.4, rgba(180, 104, 255, alpha)));
      commands.push(...circle(field.center, field.radius * 0.83, reduced ? 6 : 8, -phase * 1.3, 1.8, rgba(226, 179, 255, alpha * 0.74)));
      const arms = reduced ? 4 : 6;
      for (let i = 0; i < arms; i++) {
        const a = phase + i * Math.PI * 2 / arms;
        const from = { x: field.center.x + Math.cos(a) * field.radius * 0.76, y: field.center.y + Math.sin(a) * field.radius * 0.76 };
        const to = { x: field.center.x + Math.cos(a + (reduced ? 0.42 : 0.68)) * field.radius * 0.33,
          y: field.center.y + Math.sin(a + (reduced ? 0.42 : 0.68)) * field.radius * 0.33 };
        const cmd = line(from, to, 4.4, rgba(201, 144, 255, alpha * (0.88 - i * 0.04)));
        if (cmd) commands.push(cmd);
      }
      commands.push(...circle(field.center, Math.max(4, field.radius * 0.08), 6, 0, 2.8, rgba(239, 210, 255, alpha * 0.86)));
    }
    return commands;
  }
  function create() {
    let destroyed = false;
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Gravity Field E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' || typeof target !== 'string' || !target)
        throw new TypeError('Gravity Field E requires the shared rectangle frame and target');
      const fields = plan({ scene, camera, zoom, viewport });
      const commands = fields.flatMap(commandsFor);
      if (commands.length > MAX_FIELDS * 32 || commands.some(c => ![c.x, c.y, c.w, c.h, c.color?.[3]].every(finite)))
        throw new RangeError('Gravity Field E invalid or over budget');
      if (commands.length) {
        frame.stage('world:gravity-field-e');
        for (const command of commands) frame.rect(target, command);
      }
      return { drawn: fields.length, fields, commands };
    }
    return Object.freeze({ record, destroy() { destroyed = true; } });
  }
  const api = Object.freeze({ TYPES, KEEP_RADIUS, MAX_FIELDS, plan, create });
  root.DvaWebGPUGravityFieldE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
