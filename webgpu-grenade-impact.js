/* Textureless grenade landing E for the shared ordered WebGPU world frame.
 * Input: scene = { now, reducedMotion?, effects: [{ id, type, x, y,
 *   startedAt, duration?, radius?, sourceId? }] }. Coordinates and radii are
 * world units. The caller owns source event order, expiry, SFX, frame submission
 * and returned shape-batch cleanup. No thrower position is sampled after impact.
 */
(function (root) {
  'use strict';
  const TAU = Math.PI * 2;
  const TYPES = Object.freeze({
    'grenade-frag-impact': Object.freeze({ duration: 900, minimumRadius: 132 }),
    'grenade-stun-impact': Object.freeze({ duration: 720, minimumRadius: 145 })
  });
  const finite = Number.isFinite;
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => 1 - Math.pow(1 - clamp(value), 3);

  function plan({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !finite(scene.now) || !Array.isArray(scene.effects) ||
        !camera || ![camera.x, camera.y, zoom].every(finite) || zoom <= 0 ||
        !viewport || ![viewport.width, viewport.height].every(value => finite(value) && value > 0)) {
      throw new TypeError('Grenade impact needs a timed scene, camera, zoom and logical viewport');
    }
    const commands = [], claims = [], unhandled = [];
    for (const effect of scene.effects) {
      const profile = TYPES[effect?.type];
      if (!profile) continue;
      if (![effect.x, effect.y, effect.startedAt].every(finite) ||
          (effect.duration !== undefined && (!finite(effect.duration) || effect.duration <= 0)) ||
          (effect.radius !== undefined && !finite(effect.radius))) {
        unhandled.push({ effect, reason: 'invalid-impact-record' });
        continue;
      }
      const duration = effect.duration ?? profile.duration;
      const elapsed = scene.now - effect.startedAt;
      if (elapsed >= duration) continue;
      const p = clamp(elapsed / duration);
      const reduced = Boolean(scene.reducedMotion);
      const radius = Math.max(profile.minimumRadius, effect.radius || 0) * zoom;
      const x = (effect.x - camera.x) * zoom, y = (effect.y - camera.y) * zoom;
      const strike = ease(p / (effect.type === 'grenade-frag-impact' ? .075 : .055));
      const expansion = ease((p - (effect.type === 'grenade-frag-impact' ? .025 : .01)) /
        (effect.type === 'grenade-frag-impact' ? .54 : .42));
      const fade = 1 - ease((p - (effect.type === 'grenade-frag-impact' ? .61 : .48)) /
        (effect.type === 'grenade-frag-impact' ? .39 : .52));
      if (fade <= .001) continue;
      const flash = reduced ? .68 : (1 - strike) * .72 + Math.sin(Math.min(1, p / .17) * Math.PI) * .24;
      const alpha = fade * (.58 + strike * .42);
      const add = item => commands.push({ ...item, mode: 'additive' });
      const glow = (part, gx, gy, r, color, opacity) => {
        if (opacity > .001) add({ kind: 'glow', part, x: gx, y: gy,
          radius: Math.max(.1, r), color, alpha: clamp(opacity) });
      };
      const ellipse = (part, gx, gy, rx, ry, rotation, color, opacity) => {
        if (opacity > .001) add({ kind: 'ellipse', part, x: gx, y: gy,
          rx: Math.max(.1, rx), ry: Math.max(.1, ry), rotation,
          color, alpha: clamp(opacity) });
      };
      const arc = (part, r, width, color, opacity) => {
        if (opacity > .001) add({ kind: 'arc', part, x, y, radius: Math.max(.1, r),
          lineWidth: Math.max(.1, width), start: 0, sweep: TAU,
          color, alpha: clamp(opacity) });
      };

      if (effect.type === 'grenade-frag-impact') {
        // The hot gas grows above the landing point; the lower ellipse stays
        // grounded. Shards fan away from one fixed source, never the thrower.
        const plume = radius * (.32 + expansion * .64);
        glow('frag-ground-glow', x, y + radius * .06, radius * (.56 + expansion * .54),
          [1, .27, .035, 1], alpha * .39);
        glow('frag-hot-core', x, y - plume * .18, radius * (.24 + expansion * .22),
          [1, .67, .14, 1], alpha * (.22 + flash * .49));
        ellipse('frag-ground-burst', x, y + radius * .09, radius * (.33 + expansion * .35),
          radius * (.09 + expansion * .075), 0, [1, .37, .06, 1], alpha * .62);
        ellipse('frag-updraft', x, y - plume * .42, radius * (.17 + expansion * .12),
          plume * .48, -.10, [1, .47, .08, 1], alpha * .30);
        arc('frag-blast-front', radius * (.16 + expansion * .80),
          radius * (.038 - p * .018), [1, .62, .13, 1], alpha * .58);
        const count = reduced ? 5 : 11;
        for (let i = 0; i < count; i += 1) {
          const angle = i * 2.3999632297 + .29;
          const travel = radius * (.16 + expansion * (.52 + (i % 3) * .11));
          const sx = x + Math.cos(angle) * travel;
          const sy = y + Math.sin(angle) * travel * .72 - Math.sin(Math.PI * p) * radius * .12;
          ellipse('frag-shard', sx, sy, radius * (.067 - p * .026),
            radius * .010, angle, i % 3 ? [1, .53, .10, 1] : [1, .85, .37, 1],
            alpha * (reduced ? .30 : .62));
        }
      } else {
        // Stun is a centered, nearly instantaneous optical discharge. Its
        // broad pale disk and two concentric fronts differ from frag's plume.
        const front = radius * (.12 + expansion * .94);
        glow('stun-field-glow', x, y, radius * (.46 + expansion * .78),
          [1, .76, .36, 1], alpha * (.27 + flash * .34));
        glow('stun-white-flash', x, y, radius * (.18 + expansion * .30),
          [1, .96, .78, 1], alpha * flash * .77);
        ellipse('stun-flash-disk', x, y, radius * (.11 + expansion * .22),
          radius * (.11 + expansion * .22), 0, [1, .95, .74, 1], alpha * flash * .46);
        arc('stun-shock-front', front, radius * (.065 - p * .032),
          [1, .93, .68, 1], alpha * .69);
        arc('stun-inner-front', front * .64, radius * .018,
          [1, .65, .33, 1], alpha * .30);
        if (!reduced) {
          for (let i = 0; i < 4; i += 1) {
            const angle = i * Math.PI / 4 + Math.PI / 8;
            ellipse('stun-lens-ray', x, y,
              radius * (.35 + expansion * .36), radius * .011,
              angle, [1, .89, .63, 1], alpha * flash * .26);
          }
        }
      }
      claims.push({ effect, type: effect.type, sourceId: effect.sourceId ?? null,
        progress: p, radius: radius / zoom, reducedMotion: reduced });
    }
    return Object.freeze({ commands: Object.freeze(commands),
      claims: Object.freeze(claims), unhandled: Object.freeze(unhandled) });
  }

  function record({ shapes, frame, target, viewport, scene, camera, zoom } = {}) {
    const result = plan({ scene, camera, zoom, viewport });
    if (result.unhandled.length) throw new TypeError(`Unported grenade impact: ${result.unhandled[0].reason}`);
    if (!result.commands.length) return Object.freeze({ ...result, batch: null });
    if (typeof shapes?.enqueue !== 'function' || typeof frame?.stage !== 'function' ||
        typeof frame?.add !== 'function' || typeof target !== 'string' || !target ||
        !Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth <= 0 ||
        !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight <= 0) {
      throw new TypeError('Grenade impact needs shared shapes, frame and committed target');
    }
    frame.stage('world:grenade-impact');
    const batch = shapes.enqueue(frame, { target, width: viewport.width,
      height: viewport.height, pixelWidth: viewport.pixelWidth,
      pixelHeight: viewport.pixelHeight, label: 'world:grenade-impact',
      commands: result.commands });
    return Object.freeze({ ...result, batch });
  }
  const api = Object.freeze({ TYPES, plan, record });
  root.DvaWebGPUGrenadeImpact = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
