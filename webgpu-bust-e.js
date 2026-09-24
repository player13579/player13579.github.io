/* Textureless timed-bust E for the shared WebGPU frame. Sustained presence is
 * state-owned by bustUntil; start and barrier-break responses are event-owned. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const smooth = v => { const t = clamp(v); return t * t * (3 - 2 * t); };
  const MAX_ACTORS = 16, MAX_EVENTS = 24;
  const START_EVENT = 'action-push:timed-bust-start';
  const BREAK_EVENT = 'action-push:timed-bust-break';
  const BUST_DURATION_MS = 8000;
  const EVENT_DURATION = Object.freeze({ [START_EVENT]: 650, [BREAK_EVENT]: 480 });
  const color = (r, g, b, a) => [r / 255, g / 255, b / 255, clamp(a)];
  function validate({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !Array.isArray(scene.players) || !Array.isArray(scene.effects) ||
        ![scene.nowMs, scene.serverNow].every(finite) || !camera || ![camera.x, camera.y, zoom].every(finite) ||
        !viewport || ![viewport.width, viewport.height].every(finite) || viewport.width <= 0 ||
        viewport.height <= 0 || zoom <= 0 ||
        (viewport.kind !== undefined && viewport.kind !== 'main'))
      throw new TypeError('Bust E needs local/server clocks, players, events, camera, zoom, and logical viewport');
    if (viewport.pixelWidth !== undefined &&
        (!Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth < 1 ||
         !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight < 1))
      throw new TypeError('Bust E needs valid physical viewport dimensions');
  }
  function actorMap(scene) {
    const active = scene.players.filter(p => finite(p?.bustUntil) && p.bustUntil > scene.serverNow &&
      p.alive !== false && !p.ejected);
    if (active.length > MAX_ACTORS) throw new RangeError(`Bust E exceeds ${MAX_ACTORS} active holders`);
    const ids = new Set();
    for (const player of scene.players) {
      const id = String(player?.id || '');
      if (id && ids.has(id)) throw new Error('Bust E requires unique player IDs');
      if (id) ids.add(id);
    }
    return active;
  }
  function screenPoint(point, camera, zoom, id, label) {
    if (!point || ![point.x, point.y].every(finite))
      throw new Error(`Bust E ${id} rejected: explicit ${label} bodyWorld position required`);
    return { x: (point.x - camera.x) * zoom, y: (point.y - camera.y) * zoom };
  }
  function plan(input = {}) {
    validate(input);
    const { scene, camera, zoom } = input;
    const results = [];
    const active = actorMap(scene);
    for (const player of active) {
      const id = String(player.id || '');
      if (!id) throw new Error('Bust E active holder needs a player ID');
      const body = screenPoint(player.bodyWorld, camera, zoom, id, 'holder');
      const phaseAge = clamp((BUST_DURATION_MS - (Number(player.bustUntil) - scene.serverNow)) / BUST_DURATION_MS) * BUST_DURATION_MS;
      const reduced = Boolean(scene.reducedMotion);
      results.push({ id: `state:${id}`, kind: 'sustain', ownerId: id, body,
        startedAt: Number(player.bustUntil) - BUST_DURATION_MS, expiresAt: Number(player.bustUntil), remaining: Number(player.bustUntil) - scene.serverNow,
        phase: reduced ? 0.42 : phaseAge * 0.0015,
        reducedMotion: reduced, alpha: reduced ? 0.72 : 0.78 + 0.1 * Math.sin(scene.nowMs * 0.004 + id.length) });
    }
    const events = scene.effects.filter(effect => EVENT_DURATION[`${String(effect?.type || '')}:${String(effect?.variant || '')}`]);
    if (events.length > MAX_EVENTS) throw new RangeError(`Bust E exceeds ${MAX_EVENTS} one-shot events`);
    const eventIds = new Set();
    for (const effect of events) {
      const id = String(effect.id || '');
      if (!id || eventIds.has(id)) throw new Error('Bust E one-shot events need distinct exact IDs');
      eventIds.add(id);
      const key = `${effect.type}:${effect.variant}`;
      const duration = Number(effect.duration || effect.durationMs || EVENT_DURATION[key]);
      if (!finite(effect.startedAt) || !finite(duration) || duration <= 0)
        throw new Error(`Bust E ${id} rejected: event start and positive duration required`);
      const age = scene.nowMs - effect.startedAt;
      if (age < 0 || age >= duration) continue;
      const targetId = String(effect.targetId || ''), sourceId = String(effect.playerId || '');
      if (!targetId || !sourceId) throw new Error(`Bust E ${id} rejected: exact playerId and targetId required`);
      const target = scene.players.find(p => String(p?.id || '') === targetId);
      const source = scene.players.find(p => String(p?.id || '') === sourceId);
      if (!target) throw new Error(`Bust E ${id} rejected: target ${targetId} unavailable`);
      if (!source) throw new Error(`Bust E ${id} rejected: source ${sourceId} unavailable`);
      const isStart = key === START_EVENT;
      const holder = isStart ? target : source;
      const pointOwner = isStart ? targetId : sourceId;
      const body = screenPoint(holder.bodyWorld, camera, zoom, pointOwner, 'event owner');
      const hitBody = isStart ? null : screenPoint(target.bodyWorld, camera, zoom, id, 'collision target');
      const reduced = Boolean(scene.reducedMotion);
      const progress = clamp(age / duration);
      results.push({ id, kind: isStart ? 'start' : 'break', ownerId: pointOwner,
        targetId, sourceId, body, hitBody, startedAt: effect.startedAt, duration,
        progress, reducedMotion: reduced,
        alpha: (isStart ? Math.sin(Math.PI * Math.min(1, progress * 1.28)) * (1 - 0.22 * progress)
          : (1 - smooth(progress * 0.9))) * (reduced ? 0.84 : 0.94) });
    }
    return results;
  }
  function segment(a, b, width, rgba, mode = 'additive') {
    const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy);
    if (!finite(length) || length < 1e-4 || width <= 0) return null;
    const c = dx / length, s = dy / length;
    return { x: -length / 2, y: -width / 2, w: length, h: width,
      transform: [c, s, -s, c, (a.x + b.x) / 2, (a.y + b.y) / 2], color: rgba, mode };
  }
  function commandsFor(effect) {
    const commands = [], c = effect.body, a = effect.alpha;
    if (!(a > 0)) return commands;
    if (effect.kind === 'sustain') {
      // Two incomplete, counter-circulating kinetic ribbons sit close to the torso;
      // unlike a barrier they never form a closed protective shell.
      for (let ribbon = 0; ribbon < 2; ribbon++) {
        const points = [];
        const count = effect.reducedMotion ? 6 : 10;
        for (let i = 0; i <= count; i++) {
          const t = i / count;
          const theta = effect.phase * (ribbon ? -0.73 : 1) + t * Math.PI * 1.58 + (ribbon ? Math.PI : 0);
          points.push({ x: c.x + Math.cos(theta) * 20 * (1 - 0.12 * t),
            y: c.y - 3 * effect.zoom + Math.sin(theta) * 13 - t * 14 });
        }
        for (let i = 0; i < points.length - 1; i++) {
          const t = i / (points.length - 2);
          const cmd = segment(points[i], points[i + 1], 2.4 + 1.4 * Math.sin(Math.PI * t),
            color(255, ribbon ? 190 : 126, 74, a * (0.5 + 0.5 * Math.sin(Math.PI * t))));
          if (cmd) commands.push(cmd);
        }
      }
      return commands;
    }
    if (effect.kind === 'start') {
      const spokes = effect.reducedMotion ? 4 : 7;
      for (let i = 0; i < spokes; i++) {
        const angle = i * Math.PI * 2 / spokes + (effect.reducedMotion ? 0 : effect.progress * 0.5);
        const r0 = 5, r1 = 23 + effect.progress * 14;
        const p0 = { x: c.x + Math.cos(angle) * r0, y: c.y + Math.sin(angle) * r0 };
        const p1 = { x: c.x + Math.cos(angle) * r1, y: c.y + Math.sin(angle) * r1 };
        const cmd = segment(p0, p1, 2.6, color(255, 200, 113, a * (1 - effect.progress * 0.3)));
        if (cmd) commands.push(cmd);
      }
      return commands;
    }
    // The only current collision response is barrier rupture. Draw a compressed
    // attack trace to the target and a short kinetic burst; the holder aura remains state-owned.
    const target = effect.hitBody;
    const dx = target.x - c.x, dy = target.y - c.y, length = Math.hypot(dx, dy);
    if (length > 0.1) {
      const nx = dx / length, ny = dy / length;
      for (const offset of [-4, 4]) {
        const sideX = -ny * offset, sideY = nx * offset;
        const cmd = segment({ x: c.x + nx * Math.max(0, length - 36) + sideX,
          y: c.y + ny * Math.max(0, length - 36) + sideY },
        { x: target.x + sideX, y: target.y + sideY }, 2.4,
        color(255, 197, 129, a * (1 - effect.progress)));
        if (cmd) commands.push(cmd);
      }
    }
    if (!effect.reducedMotion) {
      for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3 + Math.atan2(dy, dx);
        const radius = 8 + (1 - effect.progress) * (14 + i % 2 * 5);
        const p0 = { x: target.x + Math.cos(angle) * 3, y: target.y + Math.sin(angle) * 3 };
        const p1 = { x: target.x + Math.cos(angle) * radius, y: target.y + Math.sin(angle) * radius };
        const cmd = segment(p0, p1, 2.2, color(255, 219, 155, a * (1 - effect.progress)));
        if (cmd) commands.push(cmd);
      }
    }
    return commands;
  }
  function create() {
    let destroyed = false;
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Bust E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' ||
          typeof target !== 'string' || !target)
        throw new TypeError('Bust E needs the shared rectangle frame and target');
      const effects = plan({ scene, camera, zoom, viewport }).map(e => ({ ...e, zoom }));
      if (!effects.length) return { drawn: 0, effects, commands: [] };
      const commands = effects.flatMap(commandsFor);
      if (commands.length > MAX_ACTORS * 20 + MAX_EVENTS * 16)
        throw new RangeError('Bust E primitive budget exceeded');
      frame.stage('world:timed-bust-e');
      for (const command of commands) frame.rect(target, command);
      return { drawn: effects.length, effects, commands };
    }
    return Object.freeze({ record, destroy() { destroyed = true; } });
  }
  const api = Object.freeze({ MAX_ACTORS, MAX_EVENTS, START_EVENT, BREAK_EVENT, BUST_DURATION_MS, EVENT_DURATION, plan, create });
  root.DvaWebGPUBustE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
