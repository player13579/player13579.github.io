/* Textureless Sunbeam E for the shared ordered WebGPU frame. The caller must
 * provide a measured hand world point, explicit facing vector, and target. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, value));
  const MAX_ACTIVE = 16;
  const TYPE = 'flora-sunbeam';
  const color = (r, g, b, a) => [r / 255, g / 255, b / 255, clamp(a)];
  const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };

  function validateContext({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !Array.isArray(scene.effects) ||
        !camera || !viewport ||
        ![scene.nowMs, camera.x, camera.y, zoom,
          viewport.width, viewport.height].every(finite) ||
        zoom <= 0 || viewport.width <= 0 || viewport.height <= 0 ||
        (viewport.kind !== undefined && viewport.kind !== 'main'))
      throw new TypeError('Sunbeam E needs timed effects, camera, zoom, and logical viewport');
    if (viewport.pixelWidth !== undefined &&
        (!Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth < 1 ||
         !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight < 1))
      throw new TypeError('Sunbeam E needs valid physical viewport dimensions');
  }

  function plan(input = {}) {
    validateContext(input);
    const { scene, camera, zoom } = input;
    const active = [];
    for (const effect of scene.effects) {
      if (effect?.type !== TYPE) continue;
      if (!finite(effect.startedAt) || !finite(effect.duration) || effect.duration <= 0)
        throw new Error(`Sunbeam E ${String(effect.id ?? '')} rejected: finite positive timing required`);
      if (scene.nowMs - effect.startedAt < effect.duration) active.push(effect);
    }
    if (active.length > MAX_ACTIVE)
      throw new RangeError(`Sunbeam E candidate exceeds ${MAX_ACTIVE} concurrent effects`);
    const ids = new Set();
    return active.map(effect => {
      const id = String(effect.id ?? '');
      if (!id || ids.has(id)) throw new Error('Sunbeam E needs distinct active source IDs');
      ids.add(id);
      const hand = effect.handWorld;
      const facing = effect.facing;
      const target = effect.targetWorld;
      if (!hand || ![hand.x, hand.y].every(finite))
        throw new Error(`Sunbeam E ${id} rejected: explicit handWorld point required`);
      if (!facing || ![facing.x, facing.y].every(finite) ||
          Math.hypot(facing.x, facing.y) < 1e-6)
        throw new Error(`Sunbeam E ${id} rejected: explicit nonzero facing vector required`);
      if (!target || ![target.x, target.y].every(finite))
        throw new Error(`Sunbeam E ${id} rejected: explicit targetWorld point required`);
      const worldDx = target.x - hand.x, worldDy = target.y - hand.y;
      const worldDistance = Math.hypot(worldDx, worldDy);
      if (!finite(worldDistance) || worldDistance < 1e-3)
        throw new Error(`Sunbeam E ${id} rejected: target must differ from the hand point`);
      const elapsed = Math.max(0, scene.nowMs - effect.startedAt);
      const progress = clamp(elapsed / effect.duration);
      const reducedMotion = Boolean(scene.reducedMotion);
      const extension = reducedMotion ? 1 : smooth(progress / .19);
      const tail = 1 - smooth((progress - .82) / .18);
      const pulse = reducedMotion ? .94 : .9 + .1 * Math.sin(progress * Math.PI * 8);
      const alpha = clamp(tail * pulse);
      const handX = (hand.x - camera.x) * zoom;
      const handY = (hand.y - camera.y) * zoom;
      const targetX = (hand.x + worldDx * extension - camera.x) * zoom;
      const targetY = (hand.y + worldDy * extension - camera.y) * zoom;
      const dx = targetX - handX, dy = targetY - handY;
      const distance = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const facingAngle = Math.atan2(facing.y, facing.x);
      if (![handX, handY, targetX, targetY, distance, angle, facingAngle].every(finite))
        throw new Error(`Sunbeam E ${id} rejected: transformed beam geometry is not finite`);
      const arrival = !reducedMotion && progress >= .19 && progress <= .31
        ? Math.sin(Math.PI * (progress - .19) / .12) : 0;
      const flashAlpha = clamp(arrival * tail);
      const extent = Math.max(0, distance);
      const ribbons = extent > 0.05 ? [
        { width: 46 * zoom, color: color(58, 190, 255, alpha * .11) },
        { width: 25 * zoom, color: color(102, 220, 255, alpha * .25) },
        { width: 11 * zoom, color: color(230, 252, 255, alpha * .92) }
      ] : [];
      const emitter = [
        { angle: facingAngle, length: 11 * zoom, width: 2.2 * zoom,
          color: color(220, 249, 255, alpha * .95) },
        { angle: facingAngle + Math.PI / 2, length: 7 * zoom, width: 1.5 * zoom,
          color: color(133, 224, 255, alpha * .78) }
      ];
      const flashRays = [];
      if (flashAlpha > 0) {
        const radius = (12 + 19 * arrival) * zoom;
        for (let index = 0; index < 6; index++) {
          const rayAngle = index * Math.PI / 3 + facingAngle;
          const inner = radius * .24, outer = radius * (index % 2 ? .74 : 1);
          flashRays.push({ x0: targetX + Math.cos(rayAngle) * inner,
            y0: targetY + Math.sin(rayAngle) * inner,
            x1: targetX + Math.cos(rayAngle) * outer,
            y1: targetY + Math.sin(rayAngle) * outer,
            width: Math.max(1, 1.8 * zoom),
            color: color(248, 254, 255, flashAlpha * (index % 2 ? .62 : .9)) });
        }
      }
      return { id, playerId: String(effect.playerId ?? ''), progress,
        reducedMotion, hand: { x: handX, y: handY },
        target: { x: targetX, y: targetY }, angle, facingAngle, distance,
        alpha, flashAlpha, ribbons, emitter, flashRays,
        duration: effect.duration, startedAt: effect.startedAt };
    });
  }

  function segmentRect(x0, y0, x1, y1, width, colorValue, mode = 'additive') {
    const dx = x1 - x0, dy = y1 - y0;
    const length = Math.hypot(dx, dy);
    if (![x0, y0, x1, y1, width, ...colorValue].every(finite) ||
        width <= 0 || length <= 1e-4) return null;
    const angle = Math.atan2(dy, dx), c = Math.cos(angle), s = Math.sin(angle);
    return { x: -length / 2, y: -width / 2, w: length, h: width,
      transform: [c, s, -s, c, (x0 + x1) / 2, (y0 + y1) / 2],
      color: colorValue, mode };
  }
  function recordPlan(frame, target, effect, commands) {
    for (const ribbon of effect.ribbons) {
      const command = segmentRect(effect.hand.x, effect.hand.y,
        effect.target.x, effect.target.y, ribbon.width, ribbon.color);
      if (command) commands.push(command);
    }
    for (const ray of effect.emitter) {
      const command = segmentRect(effect.hand.x - Math.cos(ray.angle) * ray.length / 2,
        effect.hand.y - Math.sin(ray.angle) * ray.length / 2,
        effect.hand.x + Math.cos(ray.angle) * ray.length / 2,
        effect.hand.y + Math.sin(ray.angle) * ray.length / 2,
        ray.width, ray.color);
      if (command) commands.push(command);
    }
    for (const ray of effect.flashRays) {
      const command = segmentRect(ray.x0, ray.y0, ray.x1, ray.y1,
        ray.width, ray.color);
      if (command) commands.push(command);
    }
  }

  function create() {
    let destroyed = false;
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Sunbeam E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' ||
          typeof target !== 'string' || !target)
        throw new TypeError('Sunbeam E needs the shared rectangle frame and target');
      const effects = plan({ scene, camera, zoom, viewport });
      if (!effects.length) return { drawn: 0, effects, commands: [] };
      const commands = [];
      for (const effect of effects) recordPlan(frame, target, effect, commands);
      if (commands.length > MAX_ACTIVE * 15)
        throw new RangeError('Sunbeam E geometry exceeded its bounded primitive budget');
      frame.stage('flora-sunbeam-e');
      for (const command of commands) frame.rect(target, command);
      return { drawn: effects.length, effects, commands };
    }
    return Object.freeze({ record, destroy() { destroyed = true; } });
  }

  const api = Object.freeze({ TYPE, MAX_ACTIVE, plan, create });
  root.DvaWebGPUSunbeamE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
