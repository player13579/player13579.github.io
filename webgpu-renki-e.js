/* Textureless Renki E candidate for the shared ordered WebGPU frame.
 * Only committed normal and tenfold action-renki events are rendered. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const smooth = v => { const t = clamp(v); return t * t * (3 - 2 * t); };
  const TYPE = 'action-renki';
  const DESIRE_VARIANTS = new Set(['desire-recovery-start', 'desire-recovery']);
  const VISUAL_MS = 1150;
  const DEFAULT_EVENT_MS = 1200;
  const MAX_EVENTS = 20;
  const col = (r, g, b, a) => [r / 255, g / 255, b / 255, clamp(a)];
  function visualKind(effect) {
    if (effect?.type !== TYPE || DESIRE_VARIANTS.has(String(effect.variant || ''))) return '';
    if (effect.variant === 'tenfold') return 'tenfold';
    if (effect.variant == null || effect.variant === '') return 'normal';
    return '';
  }
  function validate({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !Array.isArray(scene.effects) || !Array.isArray(scene.players) || !finite(scene.nowMs) ||
        !camera || ![camera.x, camera.y, zoom].every(finite) || !viewport ||
        ![viewport.width, viewport.height].every(finite) || viewport.width <= 0 || viewport.height <= 0 || zoom <= 0 ||
        (viewport.kind !== undefined && viewport.kind !== 'main'))
      throw new TypeError('Renki E needs timed events, actor positions, camera, zoom, and logical viewport');
    if (viewport.pixelWidth !== undefined &&
        (!Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth < 1 ||
         !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight < 1))
      throw new TypeError('Renki E needs valid physical viewport dimensions');
  }
  function plan(input = {}) {
    validate(input);
    const { scene, camera, zoom } = input;
    const matching = scene.effects.filter(effect => visualKind(effect));
    if (matching.length > MAX_EVENTS) throw new RangeError(`Renki E exceeds ${MAX_EVENTS} concurrent activation events`);
    const ids = new Set();
    const result = [];
    for (const effect of matching) {
      const id = String(effect.id || ''), playerId = String(effect.playerId || '');
      if (!id || ids.has(id)) throw new Error('Renki E requires distinct activation event IDs');
      ids.add(id);
      if (!playerId || !finite(effect.startedAt))
        throw new Error(`Renki E ${id} rejected: exact owner and local event time required`);
      const duration = Number(effect.duration || effect.durationMs || DEFAULT_EVENT_MS);
      if (!finite(duration) || duration <= 0) throw new Error(`Renki E ${id} rejected: positive finite duration required`);
      const age = scene.nowMs - effect.startedAt;
      if (age < 0 || age >= Math.min(duration, VISUAL_MS)) continue;
      const player = scene.players.find(p => String(p?.id || '') === playerId);
      if (!player || !player.alive || player.ejected || player.inVent || player.invisible)
        throw new Error(`Renki E ${id} rejected: visible living owner ${playerId} unavailable`);
      const body = player.bodyWorld;
      if (!body || ![body.x, body.y].every(finite))
        throw new Error(`Renki E ${id} rejected: explicit current bodyWorld position required`);
      const radius = Number(effect.radius || (effect.variant === 'tenfold' ? 150 : 120));
      if (!finite(radius) || radius <= 0) throw new Error(`Renki E ${id} rejected: positive world radius required`);
      const center = { x: (body.x - camera.x) * zoom, y: (body.y - camera.y) * zoom };
      const visualDuration = Math.min(duration, VISUAL_MS);
      const progress = clamp(age / visualDuration);
      const entry = smooth(progress / 0.13);
      const tail = 1 - smooth((progress - 0.7) / 0.3);
      result.push({ id, playerId, kind: visualKind(effect), variant: effect.variant || '',
        startedAt: effect.startedAt, age, duration: visualDuration, progress, center,
        radius: radius * zoom, zoom, reducedMotion: Boolean(scene.reducedMotion),
        alpha: entry * tail * (scene.reducedMotion ? 0.78 : 0.92) });
    }
    return result;
  }
  function segment(a, b, width, color) {
    const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy);
    if (!finite(length) || length < 1e-4 || width <= 0) return null;
    const c = dx / length, s = dy / length;
    return { x: -length / 2, y: -width / 2, w: length, h: width,
      transform: [c, s, -s, c, (a.x + b.x) / 2, (a.y + b.y) / 2], color, mode: 'additive' };
  }
  function addPolyline(commands, points, widthAt, rgbaAt) {
    for (let i = 0; i < points.length - 1; i++) {
      const t = i / Math.max(1, points.length - 2);
      const cmd = segment(points[i], points[i + 1], widthAt(t), rgbaAt(t));
      if (cmd) commands.push(cmd);
    }
  }
  function commandsFor(effect) {
    const commands = [], c = effect.center, r = effect.radius, a = effect.alpha;
    if (!(a > 0)) return commands;
    const reduced = effect.reducedMotion;
    if (effect.kind === 'normal') {
      // Three distinct inward wisps coalesce around one quiet central knot.
      const branches = reduced ? 3 : 3;
      const pointsPer = reduced ? 5 : 8;
      for (let branch = 0; branch < branches; branch++) {
        const angle = [-2.1, 0.08, 2.12][branch];
        const points = [];
        for (let i = 0; i <= pointsPer; i++) {
          const t = i / pointsPer;
          const swirl = reduced ? 0 : Math.sin(effect.progress * 5.2 + branch * 1.7 + t * 2.4) * r * 0.045;
          const radius = r * (0.58 * (1 - t) + 0.06);
          const theta = angle + (branch % 2 ? -1 : 1) * effect.progress * 0.82 + t * 0.6;
          points.push({ x: c.x + Math.cos(theta) * radius + Math.cos(angle + Math.PI / 2) * swirl,
            y: c.y + Math.sin(theta) * radius + Math.sin(angle + Math.PI / 2) * swirl });
        }
        addPolyline(commands, points, t => (3.2 + 2.4 * Math.sin(Math.PI * t)) * effect.zoom,
          t => col(94 + branch * 16, 188 + branch * 10, 255, a * (0.34 + 0.56 * t)));
      }
      const knot = r * (0.1 + 0.08 * smooth(effect.progress));
      for (let i = 0; i < (reduced ? 4 : 8); i++) {
        const theta = i * Math.PI / (reduced ? 2 : 4) + (reduced ? 0 : effect.progress * 0.8);
        const p0 = { x: c.x + Math.cos(theta) * knot * 0.25, y: c.y + Math.sin(theta) * knot * 0.25 };
        const p1 = { x: c.x + Math.cos(theta) * knot, y: c.y + Math.sin(theta) * knot };
        const cmd = segment(p0, p1, 2.2 * effect.zoom, col(211, 246, 255, a * 0.72));
        if (cmd) commands.push(cmd);
      }
    } else {
      // Tenfold compresses two opposed broad currents into a long, narrow axial plume.
      const pointsPer = reduced ? 6 : 10;
      for (let arm = 0; arm < 2; arm++) {
        const points = [];
        const base = arm === 0 ? -0.78 : 2.36;
        for (let i = 0; i <= pointsPer; i++) {
          const t = i / pointsPer;
          const width = r * (0.46 * (1 - smooth(effect.progress * 1.15)) + 0.09);
          const halfAngle = (0.62 * (1 - t) + 0.14) * (1 - 0.38 * smooth(effect.progress));
          const theta = base + (t - 0.5) * halfAngle * 2 + (reduced ? 0 : effect.progress * (arm ? -0.42 : 0.42));
          const radius = r * (0.08 + 0.48 * (1 - t));
          const axial = (t - 0.5) * r * 0.24;
          points.push({ x: c.x + Math.cos(theta) * radius + Math.cos(base + Math.PI / 2) * axial,
            y: c.y + Math.sin(theta) * radius + Math.sin(base + Math.PI / 2) * axial });
        }
        addPolyline(commands, points, t => (4.2 - t * 1.8) * effect.zoom,
          t => col(146 + arm * 28, 172 + arm * 18, 255, a * (0.38 + 0.5 * t)));
      }
      const plumeLength = r * (0.16 + 0.52 * smooth(effect.progress));
      const plume = segment({ x: c.x, y: c.y + plumeLength * 0.5 },
        { x: c.x, y: c.y - plumeLength * 0.5 }, 3.4 * effect.zoom,
        col(225, 236, 255, a * 0.78));
      if (plume) commands.push(plume);
      if (!reduced) {
        for (let i = 0; i < 6; i++) {
          const side = (i % 2 ? 1 : -1), t = Math.floor(i / 2) / 2;
          const y = c.y + (t - 0.5) * plumeLength;
          const reach = r * (0.04 + 0.1 * smooth(effect.progress));
          const ray = segment({ x: c.x, y }, { x: c.x + side * reach, y: y - side * reach * 0.22 },
            1.5 * effect.zoom, col(201, 229, 255, a * 0.55));
          if (ray) commands.push(ray);
        }
      }
    }
    return commands;
  }
  function create() {
    let destroyed = false;
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Renki E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' ||
          typeof target !== 'string' || !target)
        throw new TypeError('Renki E needs the shared rectangle frame and target');
      const effects = plan({ scene, camera, zoom, viewport });
      if (!effects.length) return { drawn: 0, effects, commands: [] };
      const commands = effects.flatMap(commandsFor);
      if (commands.length > MAX_EVENTS * 64) throw new RangeError('Renki E primitive budget exceeded');
      frame.stage('world:renki-e');
      for (const command of commands) frame.rect(target, command);
      return { drawn: effects.length, effects, commands };
    }
    return Object.freeze({ record, destroy() { destroyed = true; } });
  }
  const api = Object.freeze({ TYPE, DESIRE_VARIANTS, VISUAL_MS, DEFAULT_EVENT_MS, MAX_EVENTS, visualKind, plan, create });
  root.DvaWebGPURenkiE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
