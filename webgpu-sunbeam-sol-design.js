/* Executable Sunbeam E design. The authoritative event supplies the palm(s),
 * direction, finite endpoint and actor clock; this file invents no hit result. */
(function (root) {
  'use strict';
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const design = Object.freeze({
    identity: 'flora-sunbeam', durationActorMs: 1200, maxWorldRange: 950,
    source: 'B Codex-honoo 26ccab76342b7eec7a8b9e3164afd825e1838bdd',
    PH: Object.freeze({
      supply: 'The registered palm supplies a broad radiance volume which narrows into the forward carrier. It has no independent impact or particle.',
      carrier: 'One finite, direction-bound optical volume has a changing cross-section, a dense axial interior, refractive folds and a decaying end. It persists while supplied.',
      boundary: 'The carrier-air interface is wider and less dense than the interior; changing path length moves broad caustic folds without changing the server endpoint.'
    }),
    OBS: 'Low-strength display scatter derives from the same carrier density and ends when the source ends; it never forms the primary silhouette.',
    layers: Object.freeze([
      Object.freeze({ id: 'palm-supply', domain: 'world', PH: 'supply', lossIfRemoved: 'The beam seems to begin in empty air rather than to be fed by each registered hand.' }),
      Object.freeze({ id: 'carrier-volume', domain: 'world', PH: 'carrier', lossIfRemoved: 'No thick, continuous directional beam or finite reach remains.' }),
      Object.freeze({ id: 'refractive-boundary', domain: 'world', PH: 'boundary', lossIfRemoved: 'The finite cross-section and internally changing optical edge disappear.' }),
      Object.freeze({ id: 'source-scatter', domain: 'observation', OBS: 'source-scatter', lossIfRemoved: 'The beam still exists, but nearby light spill is lost.' })
    ]),
    links: Object.freeze([
      'palm-supply -> carrier-volume: supply feeds forward carrier',
      'carrier-volume -> refractive-boundary: optical path length defines boundary response',
      'source-scatter -> carrier-volume: OBS depends on carrier radiance, evaluated after carrier'
    ]),
    phases: Object.freeze({ supply: [0, 155], extension: [65, 255], sustained: [255, 1010], closure: [1010, 1200] }),
    acceptance: 'At ordinary gameplay size, source, thick carrier interior, optical boundary and finite end remain separable at start, middle and late action. Source scatter removal preserves the carrier.'
  });
  function time(actorMs, duration = design.durationActorMs, reducedMotion = false) {
    if (![actorMs, duration].every(Number.isFinite) || duration <= 0 || duration > 1200) return null;
    const t = actorMs / duration;
    if (t < 0 || t >= 1) return null;
    const supply = ease(0, .07, t) * (1 - ease(.855, 1, t));
    const extension = reducedMotion ? 1 : ease(.035, .20, t);
    const carrier = ease(.065, .18, t) * (1 - ease(.875, 1, t));
    const boundary = ease(.10, .24, t) * (1 - ease(.90, 1, t));
    const scatter = ease(.20, .37, t) * (1 - ease(.79, .95, t));
    return Object.freeze({ t, supply, extension, carrier, boundary, scatter, reducedMotion: !!reducedMotion });
  }
  function width(u, rangeWorld) {
    u = clamp(u);
    if (!Number.isFinite(rangeWorld) || rangeWorld <= 0 || rangeWorld > 952) return NaN;
    const shortFactor = clamp(rangeWorld / 240, .32, 1);
    const launched = ease(0, .085, u);
    const shoulder = 17 + 12 * Math.sin(Math.PI * Math.pow(u, .76));
    const terminal = 1 - .20 * ease(.76, 1, u);
    return (8 + launched * shoulder * terminal) * shortFactor;
  }
  function plan({ effect, actorElapsedMs, camera, zoom, viewport, reducedMotion = false } = {}) {
    if (!effect || effect.type !== 'flora-sunbeam' || !effect.id || !effect.sunbeamCausalId ||
        !Array.isArray(effect.handWorlds) || effect.handWorlds.length < 1 || effect.handWorlds.length > 2 ||
        !effect.sourceWorld || !effect.targetWorld || !effect.facing || !camera || !viewport) return null;
    const numbers = [effect.sourceWorld.x, effect.sourceWorld.y, effect.targetWorld.x, effect.targetWorld.y,
      effect.facing.x, effect.facing.y, camera.x, camera.y, zoom, viewport.width, viewport.height,
      viewport.pixelWidth, viewport.pixelHeight, actorElapsedMs, effect.duration];
    if (!numbers.every(Number.isFinite) || zoom <= 0 || viewport.width <= 0 || viewport.height <= 0 ||
        viewport.pixelWidth <= 0 || viewport.pixelHeight <= 0 ||
        effect.handWorlds.some(p => !p || ![p.x, p.y].every(Number.isFinite))) return null;
    const phase = time(actorElapsedMs, effect.duration, reducedMotion);
    if (!phase) return null;
    const dx = effect.targetWorld.x - effect.sourceWorld.x, dy = effect.targetWorld.y - effect.sourceWorld.y;
    const range = Math.hypot(dx, dy), facingLen = Math.hypot(effect.facing.x, effect.facing.y);
    if (range < 1 || range > 952 || facingLen < 1e-6 ||
        (dx * effect.facing.x + dy * effect.facing.y) / (range * facingLen) < .995) return null;
    const rays = effect.handWorlds.map(hand => {
      const end = effect.targetWorld;
      const handX = (hand.x - camera.x) * zoom, handY = (hand.y - camera.y) * zoom;
      const endX = (end.x - camera.x) * zoom, endY = (end.y - camera.y) * zoom;
      return Object.freeze({ handX, handY, endX, endY, length: Math.hypot(endX-handX,endY-handY),
        handWorld: Object.freeze({ x: hand.x, y: hand.y }) });
    });
    return Object.freeze({ id: String(effect.id), causeId: String(effect.sunbeamCausalId),
      duration: effect.duration, actorElapsedMs, phase, rangeWorld: range, zoom,
      viewport, rays: Object.freeze(rays) });
  }
  const api = Object.freeze({ design, clamp, ease, time, width, plan });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DvaSunbeamSolDesign = api;
})(typeof globalThis === 'undefined' ? this : globalThis);
