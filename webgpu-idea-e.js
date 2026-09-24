/* Four distinct textureless Idea E candidates for the shared WebGPU frame. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const smooth = v => { const t = clamp(v); return t * t * (3 - 2 * t); };
  const TYPES = Object.freeze({
    'idea-truth': 'truth', 'idea-beauty': 'beauty',
    'idea-good': 'good', 'idea-ascension': 'ascension'
  });
  const DEFAULT_MS = 1200, ASCENSION_EVENT_MS = 5200, ASCENSION_STATE_MS = 5000;
  const MAX_EVENTS = 24;
  const col = (r, g, b, a) => [r / 255, g / 255, b / 255, clamp(a)];
  function validate({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !Array.isArray(scene.effects) || !Array.isArray(scene.players) || !finite(scene.nowMs) ||
        !camera || ![camera.x, camera.y, zoom].every(finite) || !viewport ||
        ![viewport.width, viewport.height].every(finite) || viewport.width <= 0 || viewport.height <= 0 || zoom <= 0 ||
        (viewport.kind !== undefined && viewport.kind !== 'main'))
      throw new TypeError('Idea E needs timed events, players, camera, zoom, and logical viewport');
    if (viewport.pixelWidth !== undefined &&
        (!Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth < 1 ||
         !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight < 1))
      throw new TypeError('Idea E needs valid physical viewport dimensions');
  }
  function plan(input = {}) {
    validate(input);
    const { scene, camera, zoom } = input;
    const events = scene.effects.filter(effect => Object.hasOwn(TYPES, String(effect?.type || '')));
    if (events.length > MAX_EVENTS) throw new RangeError(`Idea E exceeds ${MAX_EVENTS} concurrent attainment events`);
    const ids = new Set(), out = [];
    for (const effect of events) {
      const id = String(effect.id || ''), playerId = String(effect.playerId || '');
      if (!id || ids.has(id)) throw new Error('Idea E requires distinct authoritative event IDs');
      ids.add(id);
      const kind = TYPES[effect.type];
      if (!playerId || !finite(effect.startedAt))
        throw new Error(`Idea E ${id} rejected: exact playerId and local event start required`);
      const defaultMs = kind === 'ascension' ? ASCENSION_EVENT_MS : DEFAULT_MS;
      const duration = Number(effect.duration || effect.durationMs || defaultMs);
      if (!finite(duration) || duration <= 0) throw new Error(`Idea E ${id} rejected: positive finite duration required`);
      const age = scene.nowMs - effect.startedAt;
      if (age < 0 || age >= duration) continue;
      const player = scene.players.find(p => String(p?.id || '') === playerId);
      if (!player || player.alive === false || player.ejected || player.inVent || player.invisible)
        throw new Error(`Idea E ${id} rejected: visible living owner ${playerId} unavailable`);
      const body = player.bodyWorld;
      if (!body || ![body.x, body.y].every(finite))
        throw new Error(`Idea E ${id} rejected: same-frame explicit bodyWorld position required`);
      const center = { x: (body.x - camera.x) * zoom, y: (body.y - camera.y) * zoom };
      let progress = clamp(age / duration), clock = 'event-local';
      let stateStartedAt = null, stateUntil = null;
      if (kind === 'ascension') {
        if (!finite(scene.serverNow) || !finite(player.ascensionStartedAt) || !finite(player.ascensionUntil) ||
            player.ascensionUntil <= player.ascensionStartedAt)
          throw new Error(`Idea E ${id} rejected: authoritative ascension clock required`);
        progress = clamp((scene.serverNow - player.ascensionStartedAt) /
          (player.ascensionUntil - player.ascensionStartedAt));
        stateStartedAt = player.ascensionStartedAt;
        stateUntil = player.ascensionUntil;
        clock = 'server-ascension-state';
      }
      const radius = Number(effect.radius || (kind === 'ascension' ? 260 : kind === 'good' ? 185 : kind === 'beauty' ? 145 : 135));
      if (!finite(radius) || radius <= 0) throw new Error(`Idea E ${id} rejected: positive event radius required`);
      const tail = 1 - smooth((progress - (kind === 'ascension' ? 0.78 : 0.72)) /
        (kind === 'ascension' ? 0.22 : 0.28));
      out.push({ id, type: effect.type, kind, playerId, startedAt: effect.startedAt, duration,
        age, progress, clock, stateStartedAt, stateUntil, center, radius: radius * zoom, zoom,
        reducedMotion: Boolean(scene.reducedMotion), alpha: tail * (scene.reducedMotion ? 0.8 : 0.94) });
    }
    return out;
  }
  function segment(a, b, width, rgba) {
    const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy);
    if (!finite(length) || length < 1e-4 || width <= 0) return null;
    const c = dx / length, s = dy / length;
    return { x: -length / 2, y: -width / 2, w: length, h: width,
      transform: [c, s, -s, c, (a.x + b.x) / 2, (a.y + b.y) / 2], color: rgba, mode: 'additive' };
  }
  function polyline(commands, points, width, color) {
    for (let i = 0; i < points.length - 1; i++) {
      const c = segment(points[i], points[i + 1], width, color);
      if (c) commands.push(c);
    }
  }
  function ellipseArc(cx, cy, rx, ry, start, end, steps, rotation = 0) {
    const points = [];
    const cr = Math.cos(rotation), sr = Math.sin(rotation);
    for (let i = 0; i <= steps; i++) {
      const a = start + (end - start) * i / steps;
      const x = Math.cos(a) * rx, y = Math.sin(a) * ry;
      points.push({ x: cx + x * cr - y * sr, y: cy + x * sr + y * cr });
    }
    return points;
  }
  function commandsFor(e) {
    const commands = [], { x: cx, y: cy } = e.center, r = e.radius, p = e.progress, alpha = e.alpha;
    if (!(alpha > 0)) return commands;
    const reduced = e.reducedMotion;
    if (e.kind === 'truth') {
      // Truth: a narrow, balanced prismatic lens with one unbroken central axis.
      const radius = r * (0.39 + 0.05 * (reduced ? 0 : Math.sin(p * Math.PI * 2)));
      polyline(commands, [
        { x: cx, y: cy - radius }, { x: cx + radius * 0.58, y: cy - radius * 0.14 },
        { x: cx + radius * 0.42, y: cy + radius * 0.58 }, { x: cx, y: cy + radius },
        { x: cx - radius * 0.42, y: cy + radius * 0.58 }, { x: cx - radius * 0.58, y: cy - radius * 0.14 },
        { x: cx, y: cy - radius }
      ], 2.8 * e.zoom, col(139, 220, 255, alpha * 0.9));
      polyline(commands, [{ x: cx, y: cy - radius * 1.13 }, { x: cx, y: cy + radius * 1.16 }],
        1.8 * e.zoom, col(225, 248, 255, alpha * 0.86));
      for (const side of [-1, 1]) {
        const ray = segment({ x: cx + side * radius * 0.19, y: cy - radius * 0.42 },
          { x: cx + side * radius * 0.72, y: cy - radius * 0.88 }, 1.6 * e.zoom,
          col(190, 239, 255, alpha * 0.62));
        if (ray) commands.push(ray);
      }
    } else if (e.kind === 'beauty') {
      // Beauty: five independent petal loops form a living blossom rather than a shield.
      const petals = 5, steps = reduced ? 5 : 8;
      for (let i = 0; i < petals; i++) {
        const angle = i * Math.PI * 2 / petals + (reduced ? 0 : p * 0.72);
        const centerRadius = r * 0.25, petalRadius = r * 0.23;
        const px = cx + Math.cos(angle) * centerRadius, py = cy + Math.sin(angle) * centerRadius;
        const points = ellipseArc(px, py, petalRadius * 0.48, petalRadius,
          -Math.PI * 0.72, Math.PI * 0.72, steps, angle - Math.PI / 2);
        polyline(commands, points, 2.5 * e.zoom,
          col(226, 171 + i * 8, 255, alpha * 0.78));
      }
      const stem = segment({ x: cx, y: cy + r * 0.18 }, { x: cx, y: cy + r * 0.56 },
        2 * e.zoom, col(181, 238, 211, alpha * 0.72));
      if (stem) commands.push(stem);
    } else if (e.kind === 'good') {
      // Good: three ascending, linked arcs gather around a grounded central cradle.
      const layers = [0.27, 0.42, 0.57];
      for (let i = 0; i < layers.length; i++) {
        const rise = (i - 1) * r * 0.19;
        const points = ellipseArc(cx, cy + rise, r * layers[i], r * 0.2,
          Math.PI * 1.08, Math.PI * 1.92, reduced ? 6 : 10,
          reduced ? 0 : -0.12 * Math.sin(p * Math.PI + i * 0.55));
        polyline(commands, points, (3.2 - i * 0.45) * e.zoom,
          col(136 + i * 23, 255, 196 + i * 12, alpha * (0.72 - i * 0.1)));
      }
      const centerLine = segment({ x: cx, y: cy + r * 0.28 }, { x: cx, y: cy - r * 0.23 },
        2.4 * e.zoom, col(227, 255, 238, alpha * 0.82));
      if (centerLine) commands.push(centerLine);
    } else {
      // Ascension: twin rising wings and a long central shaft climb with server state time.
      const rise = r * 0.66 * smooth(p);
      const shaft = segment({ x: cx, y: cy + r * 0.55 - rise * 0.28 },
        { x: cx, y: cy - r * 0.98 - rise }, 3.5 * e.zoom,
        col(255, 245, 196, alpha * 0.94));
      if (shaft) commands.push(shaft);
      for (const side of [-1, 1]) {
        const points = [];
        const steps = reduced ? 6 : 10;
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const spread = r * (0.06 + 0.63 * Math.sin(Math.PI * t * 0.82));
          const y = cy + r * 0.22 - rise * t - t * r * 0.92;
          const sweep = reduced ? 0 : Math.sin(p * Math.PI * 2 + t * 2.4) * r * 0.025;
          points.push({ x: cx + side * spread + sweep, y });
        }
        polyline(commands, points, 3.2 * e.zoom,
          col(255, side > 0 ? 227 : 208, 143, alpha * 0.78));
      }
      if (!reduced) {
        for (let i = 0; i < 4; i++) {
          const x = cx + (i - 1.5) * r * 0.17;
          const ray = segment({ x, y: cy + r * (0.18 + i % 2 * 0.18) - rise * 0.3 },
            { x, y: cy - r * (0.7 + i % 2 * 0.12) - rise }, 1.6 * e.zoom,
            col(255, 250, 216, alpha * 0.52));
          if (ray) commands.push(ray);
        }
      }
    }
    return commands;
  }
  function create() {
    let destroyed = false;
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Idea E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' ||
          typeof target !== 'string' || !target)
        throw new TypeError('Idea E needs the shared rectangle frame and target');
      const effects = plan({ scene, camera, zoom, viewport });
      if (!effects.length) return { drawn: 0, effects, commands: [] };
      const commands = effects.flatMap(commandsFor);
      if (commands.length > MAX_EVENTS * 64) throw new RangeError('Idea E geometry exceeded its bounded primitive budget');
      frame.stage('world:idea-e');
      for (const command of commands) frame.rect(target, command);
      return { drawn: effects.length, effects, commands };
    }
    return Object.freeze({ record, destroy() { destroyed = true; } });
  }
  const api = Object.freeze({ TYPES, DEFAULT_MS, ASCENSION_EVENT_MS, ASCENSION_STATE_MS, MAX_EVENTS, plan, create });
  root.DvaWebGPIdeaE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
