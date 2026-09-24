/* Textureless digital-action E candidate for the shared ordered WebGPU frame.
 * The only drawable event is Vibe Coding activation. Task effects represent
 * completion (owned by facility effects), while vending effects currently
 * represent a completed purchase and have no vending-instance identity. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const smooth = v => { const t = clamp(v); return t * t * (3 - 2 * t); };
  const MAX_EVENTS = 16, VISUAL_MS = 920, DEFAULT_EVENT_MS = 1500;
  const TYPE = 'action-vibe-coding';
  const REJECTED = Object.freeze({
    'action-task': 'task-completion-owned-by-facility-effects',
    'action-vending': 'purchase-event-owned-by-action-fallback-and-no-machine-instance-id'
  });
  const rgb = (r, g, b, a) => [r / 255, g / 255, b / 255, clamp(a)];

  function validate(input = {}) {
    const { scene, camera, zoom, viewport } = input;
    if (!scene || !Array.isArray(scene.effects) || !Array.isArray(scene.players) ||
        !finite(scene.nowMs) || !camera || ![camera.x, camera.y, zoom].every(finite) ||
        zoom <= 0 || !viewport || ![viewport.width, viewport.height].every(finite) ||
        viewport.width <= 0 || viewport.height <= 0 ||
        (viewport.kind !== undefined && viewport.kind !== 'main'))
      throw new TypeError('Digital action E needs timed events, actor positions, camera, zoom, and logical viewport');
    if (viewport.pixelWidth !== undefined &&
        (!Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth < 1 ||
         !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight < 1))
      throw new TypeError('Digital action E needs valid physical viewport dimensions');
  }

  function plan(input = {}) {
    validate(input);
    const { scene, camera, zoom } = input;
    const matching = scene.effects.filter(effect => effect?.type === TYPE ||
      Object.prototype.hasOwnProperty.call(REJECTED, effect?.type));
    if (matching.length > MAX_EVENTS) throw new RangeError(`Digital action E exceeds ${MAX_EVENTS} concurrent events`);
    const ids = new Set(), result = [];
    for (const effect of matching) {
      const id = String(effect.id || '');
      if (!id || ids.has(id)) throw new Error('Digital action E requires distinct event IDs');
      ids.add(id);
      if (REJECTED[effect.type]) return { supported: false, reason: REJECTED[effect.type], effectId: id };
      const ownerId = String(effect.playerId || '');
      const startedAt = Number(effect.startedAt ?? effect.at);
      if (!ownerId || !finite(startedAt) || typeof effect.variant !== 'string' || !effect.variant)
        throw new TypeError(`Vibe Coding E ${id} needs exact owner, time, and recipe variant`);
      const duration = Number(effect.durationMs || effect.duration || DEFAULT_EVENT_MS);
      if (!finite(duration) || duration <= 0) throw new TypeError(`Vibe Coding E ${id} needs positive finite duration`);
      const age = scene.nowMs - startedAt;
      if (age < 0 || age >= Math.min(duration, VISUAL_MS)) continue;
      const player = scene.players.find(candidate => String(candidate?.id || '') === ownerId);
      if (!player || !player.alive || player.ejected || player.inVent || player.invisible || player.hidden)
        throw new Error(`Vibe Coding E ${id} rejected: visible living owner ${ownerId} unavailable`);
      // The server event itself contains the authoritative activation position.
      // Do not substitute a later actor position or infer a generated target/result.
      if (![effect.x, effect.y].every(finite)) throw new TypeError(`Vibe Coding E ${id} needs event source coordinates`);
      const progress = age / Math.min(duration, VISUAL_MS);
      const variant = String(effect.variant);
      const family = variant === 'gold' ? 'gold' : variant.startsWith('hack-') || variant === 'revive' ? 'hack' : 'recipe';
      const entry = smooth(progress / 0.13), exit = 1 - smooth((progress - 0.68) / 0.32);
      result.push(Object.freeze({ id, ownerId, variant, family, startedAt, age, progress,
        center: Object.freeze({ x: (effect.x - camera.x) * zoom, y: (effect.y - camera.y) * zoom }),
        zoom, alpha: entry * exit * (scene.reducedMotion ? 0.7 : 0.9),
        reducedMotion: Boolean(scene.reducedMotion) }));
    }
    return result;
  }

  function segment(a, b, width, color) {
    const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy);
    if (!finite(length) || length < 1e-4 || !finite(width) || width <= 0) return null;
    const cos = dx / length, sin = dy / length;
    return { x: -length / 2, y: -width / 2, w: length, h: width,
      transform: [cos, sin, -sin, cos, (a.x + b.x) / 2, (a.y + b.y) / 2],
      color, mode: 'additive' };
  }

  function commandsFor(event) {
    const { center: c, zoom: z, alpha: a, progress: p, family, reducedMotion } = event;
    if (!(a > 0)) return [];
    const out = [], drift = reducedMotion ? 0 : Math.sin(p * Math.PI * 2) * 3 * z;
    const hue = family === 'gold' ? [255, 212, 92] : family === 'hack' ? [221, 105, 255] : [72, 220, 255];
    // Two open code-brackets converge toward a small compile core. This signals
    // generation in progress without depicting the recipe's item, target, or result.
    const bracketSpan = (10 + 4 * smooth(p)) * z;
    for (const side of [-1, 1]) {
      const x = c.x + side * bracketSpan;
      const top = c.y - (17 + drift) * z, bottom = c.y + (13 - drift) * z;
      const inward = -side * 7 * z;
      const points = [
        [{ x: x + inward, y: top }, { x, y: top + 4 * z }],
        [{ x, y: top + 4 * z }, { x, y: bottom - 4 * z }],
        [{ x, y: bottom - 4 * z }, { x: x + inward, y: bottom }]
      ];
      for (const [from, to] of points) {
        const cmd = segment(from, to, 2.2 * z, rgb(...hue, a * 0.72));
        if (cmd) out.push(cmd);
      }
    }
    const core = segment({ x: c.x - (2 + smooth(p) * 4) * z, y: c.y },
      { x: c.x + (2 + smooth(p) * 4) * z, y: c.y }, 2.4 * z, rgb(232, 250, 255, a * 0.88));
    if (core) out.push(core);
    if (!reducedMotion) {
      for (let i = 0; i < 4; i++) {
        const side = i % 2 ? 1 : -1, row = Math.floor(i / 2);
        const y = c.y + (row ? 9 : -10) * z;
        const x = c.x + side * (5 + ((p * 9 + i * 3) % 9)) * z;
        const cmd = segment({ x, y }, { x: x + side * 2.8 * z, y }, 1.25 * z,
          rgb(...hue, a * (0.3 + 0.32 * Math.sin(p * Math.PI))));
        if (cmd) out.push(cmd);
      }
    }
    return out;
  }

  function create() {
    let destroyed = false;
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Digital action E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' ||
          typeof target !== 'string' || !target)
        throw new TypeError('Digital action E needs shared WebGPU rect frame and target');
      const events = plan({ scene, camera, zoom, viewport });
      if (!Array.isArray(events)) return events;
      if (!events.length) return { drawn: 0, events, commands: [] };
      const commands = events.flatMap(commandsFor);
      if (commands.length > MAX_EVENTS * 16) throw new RangeError('Digital action E primitive budget exceeded');
      frame.stage('world:task-vending-vibe-e');
      for (const command of commands) frame.rect(target, command);
      return { drawn: events.length, events, commands };
    }
    return Object.freeze({ record, destroy() { destroyed = true; } });
  }
  const api = Object.freeze({ TYPE, MAX_EVENTS, VISUAL_MS, DEFAULT_EVENT_MS, plan, commandsFor, create });
  root.DvaWebGPUTaskVendingVibeE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
