/* Textureless, source-anchored contact E for preparation barriers.
 * Audio remains owned by the app's existing defense/movement SFX path. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const smooth = v => { const t = clamp(v); return t * t * (3 - 2 * t); };
  const TYPE = 'preparation-barrier-hit';
  const MAX_EVENTS = 24;
  const EVENT_MAP = Object.freeze({
    'durability-hit': Object.freeze({ state: 'durability-hit', durationMs: 650, cue: 'barrier-hit' }),
    'durability-broken': Object.freeze({ state: 'durability-broken', durationMs: 480, cue: 'barrier-break' })
  });
  const rgba = (r, g, b, a) => [r / 255, g / 255, b / 255, clamp(a)];

  function supported(effect) {
    return effect?.type === TYPE && Object.prototype.hasOwnProperty.call(EVENT_MAP, String(effect?.variant || ''));
  }
  function validate({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !Array.isArray(scene.effects) || !Array.isArray(scene.players) || !finite(scene.nowMs) ||
        !camera || ![camera.x, camera.y, zoom].every(finite) || zoom <= 0 || !viewport ||
        ![viewport.width, viewport.height].every(finite) || viewport.width <= 0 || viewport.height <= 0 ||
        (viewport.kind !== undefined && viewport.kind !== 'main'))
      throw new TypeError('Preparation Barrier Hit E needs timed effects, actors, camera, zoom, and logical viewport');
    if (viewport.pixelWidth !== undefined && (!Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth < 1 ||
        !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight < 1))
      throw new TypeError('Preparation Barrier Hit E needs valid physical viewport dimensions');
  }
  function plan(input = {}) {
    validate(input);
    const { scene, camera, zoom, viewport } = input;
    const effects = scene.effects.filter(supported);
    if (effects.length > MAX_EVENTS) throw new RangeError(`Preparation Barrier Hit E exceeds ${MAX_EVENTS} events`);
    const ids = new Set(), result = [];
    for (const effect of effects) {
      const id = String(effect.id || '');
      if (!id || ids.has(id)) throw new Error('Preparation Barrier Hit E requires distinct event IDs');
      ids.add(id);
      const spec = EVENT_MAP[effect.variant];
      const startedAt = Number(effect.startedAt);
      const rawDuration = effect.duration ?? effect.durationMs;
      const durationMs = rawDuration == null ? spec.durationMs : Number(rawDuration);
      if (!finite(startedAt) || !finite(durationMs) || durationMs <= 0)
        throw new Error(`Preparation Barrier Hit E ${id} requires a finite start and positive duration`);
      const age = scene.nowMs - startedAt;
      if (age < 0 || age >= durationMs) continue;
      const ownerId = String(effect.playerId || '');
      if (!ownerId) throw new Error(`Preparation Barrier Hit E ${id} requires the barrier owner playerId`);
      const owner = scene.players.find(p => String(p?.id || '') === ownerId);
      // The event's source is the defender passed to pushMagicEffect; x/y are
      // that source's authoritative contact-time world point. The public actor
      // gates whether drawing that source is currently permitted.
      if (!owner || ![owner.x, owner.y].every(finite))
        throw new Error(`Preparation Barrier Hit E ${id} requires a finite visible owner actor`);
      if (owner.alive === false || owner.ejected || owner.inVent ||
          (owner.invisible === true && String(scene.selfId || '') !== ownerId)) continue;
      const sourceX = Number(effect.x), sourceY = Number(effect.y);
      if (!finite(sourceX) || !finite(sourceY))
        throw new Error(`Preparation Barrier Hit E ${id} requires the server-captured source point`);
      const attackerId = String(effect.targetId || '');
      const attacker = attackerId ? scene.players.find(p => String(p?.id || '') === attackerId) : null;
      // The attacker only determines the approach axis. Missing sources are
      // legal in pushMagicEffect's contract and use its documented right-face fallback.
      if (attacker && (attacker.alive === false || attacker.ejected || attacker.inVent ||
          (attacker.invisible === true && String(scene.selfId || '') !== attackerId))) continue;
      const screen = { x: (sourceX - camera.x) * zoom, y: (sourceY - camera.y) * zoom };
      const radius = 37 * zoom;
      if (screen.x + radius < 0 || screen.y + radius < 0 ||
          screen.x - radius > viewport.width || screen.y - radius > viewport.height) continue;
      const angle = attacker && [attacker.x, attacker.y].every(finite)
        ? Math.atan2(attacker.y - sourceY, attacker.x - sourceX) : 0;
      const progress = clamp(age / durationMs), reducedMotion = Boolean(scene.reducedMotion);
      result.push({ id, type: TYPE, variant: effect.variant, kind: spec.state, ownerId, attackerId,
        center: screen, angle, startedAt, durationMs, progress, reducedMotion,
        alpha: (spec.state === 'durability-hit'
          ? (1 - smooth(progress)) * (reducedMotion ? 0.72 : 0.94)
          : (1 - smooth(progress * 0.88)) * (reducedMotion ? 0.78 : 0.96)),
        expansion: reducedMotion ? 1 : (spec.state === 'durability-hit' ? 1 + progress * 0.13 : 1 + progress * 0.34),
        sound: Object.freeze({ cue: spec.cue, playback: 'external-owner', owner: 'DvaWebGPUDefenseMovementESfx' }) });
    }
    return result;
  }
  function segment(a, b, width, color) {
    const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy);
    if (!finite(length) || length < 1e-4) return null;
    const c = dx / length, s = dy / length;
    return { x: -length / 2, y: -width / 2, w: length, h: width,
      transform: [c, s, -s, c, (a.x + b.x) / 2, (a.y + b.y) / 2], color, mode: 'additive' };
  }
  function commandsFor(event) {
    const commands = [], c = event.center, p = event.progress, alpha = event.alpha;
    if (!(alpha > 0)) return commands;
    const axis = event.angle + Math.PI;
    if (event.kind === 'durability-hit') {
      // A compressed, bright contact wedge sits on the source membrane; it is
      // intentionally not the closed activation shell or a break/shard burst.
      const radius = 18 * event.expansion;
      for (let side = -1; side <= 1; side++) {
        const a = axis + side * 0.34;
        const start = { x: c.x + Math.cos(a) * 5, y: c.y + Math.sin(a) * 5 };
        const end = { x: c.x + Math.cos(a) * radius, y: c.y + Math.sin(a) * radius * 0.72 };
        const cmd = segment(start, end, side === 0 ? 3.8 : 2.4,
          rgba(side === 0 ? 222 : 133, side === 0 ? 249 : 219, 255, alpha * (side === 0 ? 0.96 : 0.68)));
        if (cmd) commands.push(cmd);
      }
      const brace = 12 * event.expansion;
      for (const side of [-1, 1]) {
        const a = axis + side * 0.66;
        const cmd = segment({ x: c.x + Math.cos(a) * brace, y: c.y + Math.sin(a) * brace * 0.72 },
          { x: c.x + Math.cos(a + side * 0.22) * (brace + 5), y: c.y + Math.sin(a + side * 0.22) * (brace + 5) * 0.72 },
          2.1, rgba(158, 226, 255, alpha * 0.7));
        if (cmd) commands.push(cmd);
      }
    } else {
      // A broken membrane separates into four broad, retreating angular plates.
      // Reduced motion preserves the static separation but removes their drift.
      for (let i = 0; i < 4; i++) {
        const a = axis + (i - 1.5) * 0.58;
        const drift = event.reducedMotion ? 0 : p * (8 + (i % 2) * 4);
        const r0 = 5 + drift * 0.24, r1 = (18 + (i % 2) * 5) * event.expansion + drift;
        const p0 = { x: c.x + Math.cos(a) * r0, y: c.y + Math.sin(a) * r0 * 0.78 };
        const p1 = { x: c.x + Math.cos(a) * r1, y: c.y + Math.sin(a) * r1 * 0.78 };
        const flank = a + (i % 2 ? 0.2 : -0.2);
        const p2 = { x: c.x + Math.cos(flank) * r1 * 0.72, y: c.y + Math.sin(flank) * r1 * 0.58 };
        const shade = i % 2 ? rgba(255, 190, 117, alpha * 0.78) : rgba(255, 224, 176, alpha);
        const one = segment(p0, p1, 3.1, shade), two = segment(p1, p2, 2.6, shade);
        if (one) commands.push(one); if (two) commands.push(two);
      }
      const core = 5.5 * (event.reducedMotion ? 1 : 1 - p * 0.45);
      commands.push({ x: c.x - core / 2, y: c.y - core / 2, w: core, h: core,
        color: rgba(255, 246, 220, alpha * 0.86), mode: 'additive' });
    }
    return commands;
  }
  function create() {
    let destroyed = false;
    const cueIds = new Set();
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Preparation Barrier Hit E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' ||
          typeof target !== 'string' || !target)
        throw new TypeError('Preparation Barrier Hit E needs the shared rectangle frame and target');
      const events = plan({ scene, camera, zoom, viewport });
      const commands = events.flatMap(commandsFor);
      if (commands.length > MAX_EVENTS * 12 || commands.some(command =>
          ![command.x, command.y, command.w, command.h, ...command.transform || [], ...command.color].every(finite)))
        throw new RangeError('Preparation Barrier Hit E exceeded its finite primitive budget');
      const sfx = [];
      for (const event of events) if (!cueIds.has(event.id)) {
        cueIds.add(event.id);
        sfx.push(Object.freeze({ eventId: event.id, type: event.type, variant: event.variant,
          cue: event.sound.cue, playback: event.sound.playback, owner: event.sound.owner }));
      }
      if (commands.length) {
        frame.stage('world:preparation-barrier-hit-e');
        for (const command of commands) frame.rect(target, command);
      }
      return { drawn: events.length, events, commands, sfx };
    }
    return Object.freeze({ record, destroy() { destroyed = true; cueIds.clear(); } });
  }
  const api = Object.freeze({ TYPE, MAX_EVENTS, EVENT_MAP, supported, plan, create });
  root.DvaWebGPUPreparationBarrierHitE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
