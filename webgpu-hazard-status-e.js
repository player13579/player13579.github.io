/* Textureless hazard fields and brief status-onset E for the shared WebGPU frame.
 * Persistent poison/burning body markers remain owned by PERSISTENT_STATUS_ATE. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const HAZARDS = Object.freeze({ fire: 'hazard-fire', poison: 'hazard-poison', water: 'hazard-water' });
  const STATUS = Object.freeze({ poison: 'status-poison', burning: 'status-burning' });
  const CLEAR = Object.freeze({ poison: 'status-poison-cleared', burning: 'status-burn-cleared' });
  const MAX_FIELDS = 32, MAX_PULSES = 24, MAX_COMMANDS = 512, STATUS_PULSE_MS = 640;
  const rgba = (r, g, b, a) => [r / 255, g / 255, b / 255, clamp(a)];
  function validate({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !Array.isArray(scene.effects) || !Array.isArray(scene.hazardFields) || !Array.isArray(scene.players) ||
      !finite(scene.nowMs) || !finite(scene.serverNow) || !camera || ![camera.x, camera.y, zoom].every(finite) || zoom <= 0 ||
      !viewport || ![viewport.width, viewport.height].every(finite) || viewport.width <= 0 || viewport.height <= 0 ||
      (viewport.kind !== undefined && viewport.kind !== 'main'))
      throw new TypeError('Hazard Status E needs effects, active fields, public actors, both clocks, camera, zoom, and viewport');
    if ((viewport.pixelWidth !== undefined || viewport.pixelHeight !== undefined) &&
      (!Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth < 1 ||
        !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight < 1))
      throw new TypeError('Hazard Status E needs valid physical viewport dimensions');
  }
  function screen(x, y, camera, zoom, label) {
    if (![x, y].every(finite)) throw new Error(`Hazard Status E requires finite ${label} coordinates`);
    return { x: (x - camera.x) * zoom, y: (y - camera.y) * zoom };
  }
  function plan({ scene, camera, zoom, viewport } = {}) {
    validate({ scene, camera, zoom, viewport });
    const active = scene.hazardFields.filter(field => field && ['fire', 'poison', 'water'].includes(field.kind) &&
      finite(field.createdAt) && finite(field.endsAt) && field.endsAt > scene.serverNow);
    if (active.length > MAX_FIELDS) throw new RangeError('Hazard Status E active field budget exceeded');
    const fields = active.map(field => {
      const id = String(field.id || ''), sourceId = String(field.sourceId || '');
      if (!id) throw new Error('Hazard Status E requires authoritative hazard field IDs');
      if (!finite(field.x) || !finite(field.y) || !finite(field.radius) || field.radius <= 0)
        throw new Error(`Hazard Status E ${id} needs authoritative center and world radius`);
      const duration = field.endsAt - field.createdAt;
      if (!finite(duration) || duration <= 0 || scene.serverNow < field.createdAt)
        throw new Error(`Hazard Status E ${id} has invalid authoritative lifetime`);
      return { id, kind: field.kind, sourceId, center: screen(field.x, field.y, camera, zoom, `${field.kind} field`),
        radius: field.radius * zoom, strength: Math.max(0.25, Number(field.strength) || 1),
        age: scene.serverNow - field.createdAt, duration, remaining: field.endsAt - scene.serverNow,
        endsAt: field.endsAt,
        progress: clamp((scene.serverNow - field.createdAt) / duration), excludeSource: Boolean(field.excludeSource),
        reducedMotion: Boolean(scene.reducedMotion) };
    });
    const pulses = [], pulseIds = new Set();
    for (const event of scene.effects) {
      const kind = event?.type === STATUS.poison ? 'poison' : event?.type === STATUS.burning ? 'burning' : '';
      if (!kind) continue;
      const playerId = String(event.playerId || ''), actor = scene.players.find(p => String(p?.id || '') === playerId);
      const activeNow = kind === 'poison' ? actor?.poisoned : actor?.burning;
      if (!playerId || !actor || !activeNow || !actor.alive || actor.ejected || actor.inVent || actor.invisible ||
        ![actor.x, actor.y].every(finite)) continue;
      if (!String(event.id || '') || !finite(event.startedAt)) throw new Error('Hazard Status E status activation requires event ID and local start');
      if (pulseIds.has(String(event.id))) throw new Error('Hazard Status E requires unique status event IDs');
      pulseIds.add(String(event.id));
      const age = scene.nowMs - event.startedAt;
      if (age < 0 || age >= STATUS_PULSE_MS) continue;
      pulses.push({ id: String(event.id), kind, playerId, center: screen(actor.x, actor.y, camera, zoom, 'visible status actor'),
        age, progress: clamp(age / STATUS_PULSE_MS), strength: Math.max(0.25, Number(event.variant) || 1),
        reducedMotion: Boolean(scene.reducedMotion) });
    }
    if (pulses.length > MAX_PULSES) throw new RangeError('Hazard Status E status pulse budget exceeded');
    return { fields, pulses, cueEvents: scene.effects.filter(e => e &&
      (Object.values(CLEAR).includes(e.type) || e.type === 'natural-recovery' && e.variant === 'cleared')),
      nowMs: scene.nowMs, serverNow: scene.serverNow };
  }
  function line(a, b, width, color, mode = 'additive') {
    const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy);
    if (!finite(length) || length < 0.01) return null;
    const c = dx / length, s = dy / length;
    return { x: -length / 2, y: -width / 2, w: length, h: width,
      transform: [c, s, -s, c, (a.x + b.x) / 2, (a.y + b.y) / 2], color, mode };
  }
  function ring(center, rx, ry, pieces, phase, width, color) {
    const commands = [];
    for (let i = 0; i < pieces; i++) {
      const a0 = phase + i * Math.PI * 2 / pieces, a1 = a0 + Math.PI * 2 / pieces * 0.72;
      const p0 = { x: center.x + Math.cos(a0) * rx, y: center.y + Math.sin(a0) * ry };
      const p1 = { x: center.x + Math.cos(a1) * rx, y: center.y + Math.sin(a1) * ry };
      const cmd = line(p0, p1, width, color);
      if (cmd) commands.push(cmd);
    }
    return commands;
  }
  function fieldCommands(field) {
    const c = field.center, r = field.radius, reduced = field.reducedMotion;
    const phase = reduced ? 0 : field.age * (field.kind === 'fire' ? 0.004 : field.kind === 'poison' ? 0.0007 : 0.0015);
    const commands = [];
    if (field.kind === 'fire') {
      // Combustion front: broken ground rim and broad updraft tongues, with luminous hot cores.
      commands.push(...ring(c, r, r * 0.68, reduced ? 8 : 12, phase * 0.3, 3.1, rgba(255, 104, 31, 0.38)));
      const tongues = reduced ? 4 : 7;
      for (let i = 0; i < tongues; i++) {
        const x = c.x + (i - (tongues - 1) / 2) * r * 0.17;
        const baseY = c.y + r * 0.34;
        const height = r * (0.34 + ((i % 3) * 0.08));
        const sway = reduced ? 0 : Math.sin(phase + i * 1.7) * r * 0.045;
        const p0 = { x, y: baseY }, p1 = { x: x + sway, y: baseY - height };
        const outer = line(p0, p1, r * 0.045, rgba(255, 96, 25, 0.3));
        const core = line(p0, p1, r * 0.014, rgba(255, 226, 137, 0.82));
        if (outer) commands.push(outer); if (core) commands.push(core);
      }
    } else if (field.kind === 'poison') {
      // Poison gas membrane: slow detached loops and rising large bubbles, not flame tongues.
      commands.push(...ring(c, r, r * 0.78, reduced ? 8 : 10, phase, 2.6, rgba(166, 216, 72, 0.42)));
      commands.push(...ring(c, r * 0.72, r * 0.56, reduced ? 6 : 8, -phase * 0.7, 1.6, rgba(205, 239, 111, 0.34)));
      const bubbles = reduced ? 3 : 5;
      for (let i = 0; i < bubbles; i++) {
        const t = reduced ? 0.5 : (field.age * 0.00035 + i / bubbles) % 1;
        const x = c.x + Math.sin(i * 2.2 + phase) * r * 0.56;
        const y = c.y + r * 0.42 - t * r * 0.92;
        const size = r * (0.045 + (i % 2) * 0.018);
        commands.push({ x: x - size / 2, y: y - size / 2, w: size, h: size,
          color: rgba(219, 247, 139, 0.64), mode: 'additive' });
      }
    } else {
      // Water is a low, expanding surface pulse; it visibly cools fire without borrowing fire's upward flow.
      const expansion = reduced ? 0.74 : 0.55 + 0.2 * ((field.age * 0.0004) % 1);
      commands.push(...ring(c, r * expansion, r * 0.23 * expansion, reduced ? 8 : 12, phase * 0.18, 3, rgba(97, 211, 255, 0.53)));
      commands.push(...ring(c, r * 0.58, r * 0.13, reduced ? 6 : 8, -phase * 0.23, 1.8, rgba(205, 247, 255, 0.58)));
      const rays = reduced ? 4 : 6;
      for (let i = 0; i < rays; i++) {
        const a = phase + i * Math.PI * 2 / rays;
        const p0 = { x: c.x + Math.cos(a) * r * 0.22, y: c.y + Math.sin(a) * r * 0.12 };
        const p1 = { x: c.x + Math.cos(a) * r * 0.84, y: c.y + Math.sin(a) * r * 0.19 };
        const cmd = line(p0, p1, 2.2, rgba(154, 229, 255, 0.46)); if (cmd) commands.push(cmd);
      }
    }
    return commands;
  }
  function pulseCommands(pulse) {
    const { center: c, progress: p, reducedMotion: reduced } = pulse;
    const alpha = (1 - p) * (reduced ? 0.52 : 0.82), commands = [];
    if (pulse.kind === 'burning') {
      // One onset flare only; persistent burning marker remains the status ATE owner's responsibility.
      const spread = reduced ? 6 : 3 + 12 * p;
      for (const side of [-1, 0, 1]) {
        const base = { x: c.x + side * spread, y: c.y + 8 };
        const tip = { x: c.x + side * spread * 0.65, y: c.y - (reduced ? 10 : 8 + 20 * (1 - p)) };
        const flame = line(base, tip, 3.4, rgba(255, 176, 66, alpha)); if (flame) commands.push(flame);
      }
    } else {
      // A brief inward membrane snap and two ascending droplets.
      commands.push(...ring(c, 13 * (1 - 0.3 * p), 9 * (1 - 0.3 * p), reduced ? 4 : 6, 0, 2, rgba(204, 244, 117, alpha)));
      for (const side of [-1, 1]) {
        const x = c.x + side * 7, lift = reduced ? 7 : 5 + 12 * p;
        commands.push({ x: x - 2, y: c.y - lift, w: 4, h: 4, color: rgba(225, 250, 154, alpha * 0.9), mode: 'additive' });
      }
    }
    return commands;
  }
  function create() {
    let destroyed = false;
    const seenCueIds = new Set(), previousFields = new Map(), previousStatuses = new Map();
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Hazard Status E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' || typeof target !== 'string' || !target)
        throw new TypeError('Hazard Status E needs the shared rectangle frame and target');
      const planned = plan({ scene, camera, zoom, viewport });
      const commands = [...planned.fields.flatMap(fieldCommands), ...planned.pulses.flatMap(pulseCommands)];
      if (commands.length > MAX_COMMANDS || commands.some(c => ![c.x, c.y, c.w, c.h, c.color?.[3]].every(finite)))
        throw new RangeError('Hazard Status E invalid or over budget');
      const cueEdges = [];
      const emit = (edgeId, action, cue, soundKey = null, soundOwner = 'no-loop-cue') => {
        if (seenCueIds.has(edgeId)) return;
        seenCueIds.add(edgeId);
        cueEdges.push({ edgeId, action, cue, soundKey, soundOwner });
      };
      for (const field of planned.fields) {
        if (!previousFields.has(field.id)) emit(`hazard:${field.id}:start`, 'start', `hazard-${field.kind}`,
          field.kind === 'fire' ? null : `hazard-${field.kind}-field`, field.kind === 'fire' ? 'server-fireJutsu-one-shot' : 'candidate-edge-only');
        previousFields.set(field.id, { endsAt: field.endsAt, kind: field.kind });
      }
      for (const [id, prior] of previousFields) {
        if (planned.fields.some(field => field.id === id)) continue;
        // Emit a stop edge only when exact authoritative endsAt has passed. A room reset or
        // server-side field eviction before that deadline is not misreported as natural end.
        if (scene.serverNow >= prior.endsAt) emit(`hazard:${id}:stop`, 'stop', `hazard-${prior.kind}`, null, 'no-server-loop');
        previousFields.delete(id);
      }
      for (const pulse of planned.pulses) emit(`status:${pulse.id}:start`, 'start', `status-${pulse.kind}`,
        null, 'no-server-status-sound');
      const visibleStatus = new Map();
      for (const actor of scene.players) {
        if (!actor || actor.invisible || actor.inVent || actor.ejected || !actor.alive || !actor.id || ![actor.x, actor.y].every(finite)) continue;
        for (const kind of ['poison', 'burning']) {
          const key = `${actor.id}:${kind}`, active = Boolean(kind === 'poison' ? actor.poisoned : actor.burning);
          visibleStatus.set(key, active);
          if (previousStatuses.get(key) === true && !active) {
            const clearEvent = planned.cueEvents.find(e => e.playerId === actor.id &&
              (e.type === CLEAR[kind] || e.type === 'natural-recovery'));
            const reason = clearEvent?.id || `${key}:observed-transition:${scene.serverNow}`;
            emit(`status:${reason}:stop`, 'stop', `status-${kind}`, null, 'no-server-status-loop');
          }
        }
      }
      previousStatuses.clear();
      for (const [key, active] of visibleStatus) previousStatuses.set(key, active);
      if (commands.length) {
        frame.stage('world:hazard-status-e');
        for (const command of commands) frame.rect(target, command);
      }
      return { drawn: planned.fields.length + planned.pulses.length, fields: planned.fields,
        statusPulses: planned.pulses, commands, cueEdges };
    }
    return Object.freeze({ record, destroy() { destroyed = true; seenCueIds.clear(); previousFields.clear(); previousStatuses.clear(); } });
  }
  const api = Object.freeze({ HAZARDS, STATUS, CLEAR, MAX_FIELDS, MAX_PULSES, MAX_COMMANDS, STATUS_PULSE_MS, plan, create });
  root.DvaWebGPUHazardStatusE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
