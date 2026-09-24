/* Textureless Sunbeam E for the shared ordered WebGPU frame. The caller must
 * provide a measured hand world point, explicit facing vector, and target. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, value));
  const MAX_ACTIVE = 16;
  const MAX_EMITTERS_PER_EVENT = 2;
  const MAX_PRIMITIVES_PER_RAY = 32;
  const MAX_DURATION_MS = 1200;
  const MAX_WORLD_RANGE = 950;
  const RANGE_TOLERANCE = 2;
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
      if (!finite(effect.startedAt) || !finite(effect.duration) || effect.duration <= 0 ||
          effect.duration > MAX_DURATION_MS)
        throw new Error(`Sunbeam E ${String(effect.id ?? '')} rejected: finite duration up to ${MAX_DURATION_MS} ms required`);
      const age = scene.nowMs - effect.startedAt;
      if (age < 0) throw new Error(`Sunbeam E ${String(effect.id ?? '')} rejected: event has not started`);
      if (age < effect.duration) active.push(effect);
    }
    if (active.length > MAX_ACTIVE)
      throw new RangeError(`Sunbeam E candidate exceeds ${MAX_ACTIVE} concurrent effects`);
    const ids = new Set();
    return active.map(effect => {
      const id = String(effect.id ?? '');
      if (!id || ids.has(id)) throw new Error('Sunbeam E needs distinct active source IDs');
      ids.add(id);
      const hands = Array.isArray(effect.handWorlds) ? effect.handWorlds :
        (effect.handWorld ? [effect.handWorld] : []);
      const facing = effect.facing;
      const target = effect.targetWorld;
      if (!hands.length || hands.length > MAX_EMITTERS_PER_EVENT ||
          hands.some(hand => !hand || ![hand.x, hand.y].every(finite)))
        throw new Error(`Sunbeam E ${id} rejected: explicit handWorld point required`);
      if (!facing || ![facing.x, facing.y].every(finite) ||
          Math.hypot(facing.x, facing.y) < 1e-6)
        throw new Error(`Sunbeam E ${id} rejected: explicit nonzero facing vector required`);
      if (!target || ![target.x, target.y].every(finite))
        throw new Error(`Sunbeam E ${id} rejected: explicit targetWorld point required`);
      const source = effect.sourceWorld ||
        (finite(effect.x) && finite(effect.y) ? { x: effect.x, y: effect.y } : null);
      if (!source || ![source.x, source.y].every(finite))
        throw new Error(`Sunbeam E ${id} rejected: authoritative sourceWorld point required`);
      const serverDx = target.x - source.x, serverDy = target.y - source.y;
      const serverDistance = Math.hypot(serverDx, serverDy);
      if (!finite(serverDistance) || serverDistance < 1e-3 ||
          serverDistance > MAX_WORLD_RANGE + RANGE_TOLERANCE)
        throw new Error(`Sunbeam E ${id} rejected: endpoint is outside the ${MAX_WORLD_RANGE}-world-unit server range`);
      const facingLength = Math.hypot(facing.x, facing.y);
      const alignment = (serverDx * facing.x + serverDy * facing.y) /
        (serverDistance * facingLength);
      if (!finite(alignment) || alignment < 0.995)
        throw new Error(`Sunbeam E ${id} rejected: endpoint does not follow authoritative facing`);
      const firstHand = hands[0];
      const worldDx = target.x - firstHand.x, worldDy = target.y - firstHand.y;
      const worldDistance = Math.hypot(worldDx, worldDy);
      if (!finite(worldDistance) || worldDistance < 1e-3)
        throw new Error(`Sunbeam E ${id} rejected: target must differ from the hand point`);
      const elapsed = Math.max(0, scene.nowMs - effect.startedAt);
      const progress = clamp(elapsed / effect.duration);
      const reducedMotion = Boolean(scene.reducedMotion);
      const extension = reducedMotion ? 1 : smooth(progress / .19);
      const tail = 1 - smooth((progress - .86) / .14);
      const pulse = reducedMotion ? .94 : .9 + .1 * Math.sin(progress * Math.PI * 8);
      const alpha = clamp(tail * pulse);
      const facingAngle = Math.atan2(facing.y, facing.x);
      const rays = hands.map(hand => {
        const dxWorld = target.x - hand.x, dyWorld = target.y - hand.y;
        const handX = (hand.x - camera.x) * zoom;
        const handY = (hand.y - camera.y) * zoom;
        const targetX = (hand.x + dxWorld * extension - camera.x) * zoom;
        const targetY = (hand.y + dyWorld * extension - camera.y) * zoom;
        const dx = targetX - handX, dy = targetY - handY;
        const distance = Math.hypot(dx, dy), angle = Math.atan2(dy, dx);
        if (![handX, handY, targetX, targetY, distance, angle].every(finite))
          throw new Error(`Sunbeam E ${id} rejected: transformed beam geometry is not finite`);
        const arrival = !reducedMotion && progress >= .19 && progress <= .31
          ? Math.sin(Math.PI * (progress - .19) / .12) : 0;
        const flashAlpha = clamp(arrival * tail);
        const impactAlpha = clamp(reducedMotion ? .26 * tail : Math.max(flashAlpha, .16 * alpha));
        const ribbons = distance > 0.05 ? [
          { width: 72 * zoom, color: color(255, 151, 25, alpha * .11) },
          { width: 42 * zoom, color: color(255, 204, 69, alpha * .25) },
          { width: 15 * zoom, color: color(255, 250, 215, alpha * .97) }
        ] : [];
        const beamSegments = [];
        if (distance > .05) {
          const nx = -Math.sin(angle), ny = Math.cos(angle);
          const flow = progress * Math.PI * 2;
          const strands = [
            { side: 0, width: 72 * zoom, rgb: [255, 146, 24], opacity: .105, phase: 0 },
            { side: 0, width: 42 * zoom, rgb: [255, 191, 52], opacity: .22, phase: 1.1 },
            { side: 0, width: 15 * zoom, rgb: [255, 250, 221], opacity: .96, phase: 2.3 },
            { side: -1, width: 13 * zoom, rgb: [255, 197, 54], opacity: .54, phase: .8 },
            { side: 1, width: 13 * zoom, rgb: [255, 218, 92], opacity: .48, phase: 2.1 }
          ];
          for (const strand of strands) {
            const points = [0, .34, .68, 1].map(t => {
              const splay = strand.side * 24 * zoom * Math.sin(Math.PI * t);
              const drift = strand.side === 0
                ? 3.8 * zoom * Math.sin(flow * 1.7 + t * Math.PI * 2.3 + strand.phase) * Math.sin(Math.PI * t)
                : 3.2 * zoom * Math.sin(flow + t * Math.PI * 2 + strand.phase) * Math.sin(Math.PI * t);
              return { x: handX + dx * t + nx * (splay + drift),
                y: handY + dy * t + ny * (splay + drift) };
            });
            for (let index = 0; index < points.length - 1; index++) {
              const taper = index === 0 ? .68 : index === 2 ? .8 : 1;
              beamSegments.push({ x0: points[index].x, y0: points[index].y,
                x1: points[index + 1].x, y1: points[index + 1].y,
                width: strand.width * taper,
                color: color(...strand.rgb, alpha * strand.opacity * (index === 1 ? 1 : .84)) });
            }
          }
        }
        const corona = [];
        const coronaStrength = alpha * (reducedMotion ? 1 : .58 + .42 * smooth(progress / .06));
        if (coronaStrength > 0) {
          for (const [offset, length, width, rgb, opacity] of [
            [-.72, 15, 2.4, [255, 184, 35], .72],
            [-.35, 10, 2, [255, 228, 106], .82],
            [0, 19, 4, [255, 249, 214], .98],
            [.35, 10, 2, [255, 228, 106], .82],
            [.72, 15, 2.4, [255, 184, 35], .72]
          ]) {
            const rayAngle = facingAngle + offset;
            corona.push({ angle: rayAngle, length: length * zoom, width: width * zoom,
              color: color(...rgb, coronaStrength * opacity) });
          }
          corona.push({ angle: facingAngle + Math.PI / 2, length: 8 * zoom,
            width: 2.3 * zoom, color: color(255, 219, 91, coronaStrength * .78) });
        }
        const flashRays = [];
        if (flashAlpha > 0) {
          const radius = (18 + 27 * arrival) * zoom;
          for (let index = 0; index < 8; index++) {
            const rayAngle = facingAngle + index * Math.PI / 4 + (index % 2 ? .1 : 0);
            const inner = radius * (index % 2 ? .28 : .18);
            const outer = radius * (index % 2 ? .78 : 1);
            flashRays.push({ x0: targetX + Math.cos(rayAngle) * inner,
              y0: targetY + Math.sin(rayAngle) * inner,
              x1: targetX + Math.cos(rayAngle) * outer,
              y1: targetY + Math.sin(rayAngle) * outer,
              width: Math.max(1, (index % 2 ? 2.1 : 3.4) * zoom),
              color: color(255, index % 2 ? 191 : 235, index % 2 ? 61 : 160,
                impactAlpha * (index % 2 ? .66 : .92)) });
          }
        }
        const bloom = impactAlpha > 0 ? [
          { angle: facingAngle, length: (28 + 14 * arrival) * zoom,
            width: (10 + 4 * arrival) * zoom, color: color(255, 191, 45, impactAlpha * .58) },
          { angle: facingAngle + Math.PI / 2, length: (19 + 10 * arrival) * zoom,
            width: (7 + 3 * arrival) * zoom, color: color(255, 246, 202, impactAlpha * .9) }
        ] : [];
        return { hand: { x: handX, y: handY }, target: { x: targetX, y: targetY },
          angle, distance, flashAlpha, impactAlpha, ribbons, beamSegments,
          emitter: corona, flashRays, bloom };
      });
      const firstRay = rays[0];
      return { id, playerId: String(effect.playerId ?? ''), progress,
        reducedMotion, hand: firstRay.hand, target: firstRay.target,
        angle: firstRay.angle, facingAngle, distance: firstRay.distance,
        alpha, flashAlpha: firstRay.flashAlpha, impactAlpha: firstRay.impactAlpha,
        ribbons: firstRay.ribbons, beamSegments: firstRay.beamSegments,
        emitter: firstRay.emitter, flashRays: firstRay.flashRays,
        bloom: firstRay.bloom, rays,
        handWorlds: hands.map(hand => ({ x: hand.x, y: hand.y })),
        sourceWorld: { x: source.x, y: source.y }, targetWorld: { x: target.x, y: target.y },
        serverDistance, duration: effect.duration, startedAt: effect.startedAt };
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
    for (const beam of effect.rays) {
      for (const segment of beam.beamSegments) {
        const command = segmentRect(segment.x0, segment.y0,
          segment.x1, segment.y1, segment.width, segment.color);
        if (command) commands.push(command);
      }
      for (const ray of beam.emitter) {
        const command = segmentRect(beam.hand.x - Math.cos(ray.angle) * ray.length / 2,
          beam.hand.y - Math.sin(ray.angle) * ray.length / 2,
          beam.hand.x + Math.cos(ray.angle) * ray.length / 2,
          beam.hand.y + Math.sin(ray.angle) * ray.length / 2,
          ray.width, ray.color);
        if (command) commands.push(command);
      }
      for (const ray of beam.flashRays) {
        const command = segmentRect(ray.x0, ray.y0, ray.x1, ray.y1,
          ray.width, ray.color);
        if (command) commands.push(command);
      }
      for (const ray of beam.bloom) {
        const command = segmentRect(beam.target.x - Math.cos(ray.angle) * ray.length / 2,
          beam.target.y - Math.sin(ray.angle) * ray.length / 2,
          beam.target.x + Math.cos(ray.angle) * ray.length / 2,
          beam.target.y + Math.sin(ray.angle) * ray.length / 2,
          ray.width, ray.color);
        if (command) commands.push(command);
      }
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
      if (commands.length > MAX_ACTIVE * MAX_EMITTERS_PER_EVENT * MAX_PRIMITIVES_PER_RAY)
        throw new RangeError('Sunbeam E geometry exceeded its bounded primitive budget');
      frame.stage('flora-sunbeam-e');
      for (const command of commands) frame.rect(target, command);
      return { drawn: effects.length, effects, commands };
    }
    return Object.freeze({ record, destroy() { destroyed = true; } });
  }

  const api = Object.freeze({ TYPE, MAX_ACTIVE, MAX_EMITTERS_PER_EVENT,
    MAX_PRIMITIVES_PER_RAY, MAX_DURATION_MS,
    MAX_WORLD_RANGE, RANGE_TOLERANCE, plan, create });
  root.DvaWebGPUSunbeamE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
