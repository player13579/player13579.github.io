/* Textureless, local activation cues for visible Ninjutsu focus and Rational's
 * mana-waiver transaction. Assassin substitution remains owned by its existing E. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const smooth = v => { const t = clamp(v); return t * t * (3 - 2 * t); };
  const TYPES = Object.freeze({ focus: 'action-ninjutsu-focus', rational: 'action-rational-free',
    substitutionGrant: 'action-assassin-substitution-grant', substitutionTrigger: 'substitution' });
  const DURATION_MS = Object.freeze({ focus: 720, rational: 460 });
  const MAX_EVENTS = 24, MAX_RECTS_PER_EVENT = 12;
  const COLORS = Object.freeze({ focus: [0.52, 0.84, 1], rational: [0.84, 0.91, 1] });
  const SOUND_OWNERS = Object.freeze({ focus: 'no-start-cue; existing authoritative attack/result sound path',
    rational: 'no-dedicated-cue-owner-found; no inferred reward sound',
    substitution: 'server world-sound substitution on successful trigger; existing substitution E owns visuals' });

  function validate({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !Array.isArray(scene.events) || !Array.isArray(scene.visiblePlayerIds) ||
        !finite(scene.nowMs) || !camera || ![camera.x, camera.y, zoom].every(finite) || zoom <= 0 ||
        !viewport || ![viewport.width, viewport.height].every(finite) || viewport.width <= 0 || viewport.height <= 0 ||
        (viewport.kind !== undefined && viewport.kind !== 'main'))
      throw new TypeError('Focus/Rational/Substitution E needs visible timed events, camera, zoom, and logical viewport');
    if ((viewport.pixelWidth !== undefined || viewport.pixelHeight !== undefined) &&
        (!Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth < 1 ||
         !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight < 1))
      throw new TypeError('Focus/Rational/Substitution E needs valid physical viewport dimensions');
  }

  function rect(center, width, height, color, rotation = 0) {
    return { x: center.x - width / 2, y: center.y - height / 2, w: width, h: height,
      color, mode: 'additive', rotation };
  }

  function classify(event) {
    const type = String(event.type || '');
    if (type === TYPES.focus || type === TYPES.rational) return type === TYPES.focus ? 'focus' : 'rational';
    if (type === TYPES.substitutionGrant || type === TYPES.substitutionTrigger) return 'substitution';
    return '';
  }

  function plan({ scene, camera, zoom, viewport } = {}) {
    validate({ scene, camera, zoom, viewport });
    const active = scene.events.filter(e => e && classify(e));
    if (active.length > MAX_EVENTS) throw new RangeError(`Focus/Rational/Substitution E exceeds ${MAX_EVENTS} events`);
    const ids = new Set(), visible = new Set(scene.visiblePlayerIds.map(id => String(id || '')).filter(Boolean));
    const owned = [], delegated = [];
    for (const event of active) {
      const id = String(event.id || ''), type = String(event.type || ''), kind = classify(event);
      if (!id || ids.has(id)) throw new Error('Focus/Rational/Substitution E requires distinct event IDs');
      ids.add(id);
      const playerId = String(event.playerId || '');
      if (!playerId) throw new Error(`Focus/Rational/Substitution E ${id} requires playerId`);
      if (kind === 'substitution') {
        delegated.push({ id, type, owner: 'DvaWebGPUAssassinSubstitutionE', reason: 'existing-grant-or-trigger-owner' });
        continue;
      }
      if (!finite(event.startedAt) || !finite(event.x) || !finite(event.y))
        throw new Error(`Focus/Rational E ${id} requires local event time and actor coordinates`);
      if (!visible.has(playerId)) continue;
      const age = scene.nowMs - event.startedAt, duration = DURATION_MS[kind];
      if (age < 0 || age >= duration) continue;
      const center = { x: (event.x - camera.x) * zoom, y: (event.y - camera.y) * zoom };
      if (![center.x, center.y].every(finite)) throw new Error(`Focus/Rational E ${id} has invalid projected actor point`);
      const progress = clamp(age / duration), reducedMotion = Boolean(scene.reducedMotion);
      owned.push({ id, type, playerId, kind, center, age, duration, progress, reducedMotion,
        alpha: (1 - smooth(progress)) * (reducedMotion ? 0.56 : 0.86),
        targetIdUsedForGeometry: false, resultClaim: kind === 'focus' ? 'focus-attempt-only' : 'mana-waiver-only' });
    }
    return { owned, delegated };
  }

  function commandsFor(effect) {
    const { center: c, progress: p, reducedMotion: reduced, alpha } = effect;
    const commands = [], rgb = COLORS[effect.kind];
    const rgba = a => [...rgb, clamp(alpha * a)];
    const add = (x, y, w, h, a, rotation = 0) => commands.push(rect({ x, y }, w, h, rgba(a), reduced ? 0 : rotation));
    if (effect.kind === 'focus') {
      // Four sight brackets contract around the caster; there is no target ray or lock assertion.
      const radius = reduced ? 8 : 16 - p * 5;
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
        const x = c.x + sx * radius, y = c.y + sy * radius;
        add(x - sx * 2.5, y, 7, 2.2, 0.9, 0);
        add(x, y - sy * 2.5, 2.2, 7, 0.78, 0);
      }
      add(c.x, c.y, 3.2, 3.2, 0.95, Math.PI / 4);
      if (!reduced) {
        const inward = 3 + Math.sin(Math.PI * p) * 3;
        add(c.x - inward, c.y, 2.2, 1.8, 0.65, 0);
        add(c.x + inward, c.y, 2.2, 1.8, 0.65, 0);
      }
    } else {
      // Rational's cost waiver is a brief balanced alignment, not a reward/benefit marker.
      const width = reduced ? 6 : 5 + 5 * Math.sin(Math.PI * p);
      const rise = reduced ? 5 : 2 + p * 5;
      add(c.x - width, c.y - rise, width, 2, 0.84, 0);
      add(c.x + width, c.y - rise, width, 2, 0.84, 0);
      add(c.x - width * 0.65, c.y + rise, width * 0.72, 2.2, 0.72, 0);
      add(c.x + width * 0.65, c.y + rise, width * 0.72, 2.2, 0.72, 0);
      add(c.x, c.y, 2.8, reduced ? 4.5 : 3 + Math.sin(Math.PI * p) * 2, 0.92, 0);
    }
    return commands;
  }

  function create() {
    let destroyed = false;
    function record({ frame, target, scene, camera, zoom, viewport } = {}) {
      if (destroyed) throw new Error('Focus/Rational/Substitution E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' || typeof target !== 'string' || !target)
        throw new TypeError('Focus/Rational/Substitution E needs shared rectangle frame and target');
      const planned = plan({ scene, camera, zoom, viewport });
      const commands = planned.owned.flatMap(commandsFor);
      if (commands.length > MAX_EVENTS * MAX_RECTS_PER_EVENT || commands.some(command =>
          ![command.x, command.y, command.w, command.h, command.rotation, ...command.color].every(finite)))
        throw new RangeError('Focus/Rational E invalid or over budget');
      if (commands.length) {
        frame.stage('world:focus-rational-e');
        for (const command of commands) frame.rect(target, command);
      }
      return { drawn: planned.owned.length, owned: planned.owned, delegated: planned.delegated, commands };
    }
    return Object.freeze({ record, destroy() { destroyed = true; } });
  }

  const api = Object.freeze({ TYPES, DURATION_MS, MAX_EVENTS, MAX_RECTS_PER_EVENT, SOUND_OWNERS, plan, create });
  root.DvaWebGPUFocusRationalSubstitutionE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
