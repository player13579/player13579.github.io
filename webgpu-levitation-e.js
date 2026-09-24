/* Textureless Levitation E for the shared ordered WebGPU frame.
 * The caller supplies transition clocks and measured airborne body/feet points;
 * this pass never infers an anchor from the floor or character gait. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const smooth = v => { const t = clamp(v); return t * t * (3 - 2 * t); };
  const TYPE = 'gravity-levitation';
  const MAX_ACTORS = 16;
  const ONSET_MS = 360;
  const END_MS = 420;
  const STREAM_SEGMENTS = 8;

  function validateContext({ scene, camera, zoom, viewport } = {}) {
    if (!scene || !Array.isArray(scene.actors) || !camera || !viewport ||
        ![scene.nowMs, camera.x, camera.y, zoom, viewport.width, viewport.height].every(finite) ||
        zoom <= 0 || viewport.width <= 0 || viewport.height <= 0 ||
        (viewport.kind !== undefined && viewport.kind !== 'main'))
      throw new TypeError('Levitation E needs timed actors, camera, zoom, and logical viewport');
    if (viewport.pixelWidth !== undefined &&
        (!Number.isInteger(viewport.pixelWidth) || viewport.pixelWidth < 1 ||
         !Number.isInteger(viewport.pixelHeight) || viewport.pixelHeight < 1))
      throw new TypeError('Levitation E needs valid physical viewport dimensions');
  }

  function plan(input = {}) {
    validateContext(input);
    const { scene, camera, zoom } = input;
    const now = scene.nowMs;
    const sourceActors = scene.actors.filter(a => a?.type === TYPE);
    if (sourceActors.length > MAX_ACTORS) throw new RangeError(`Levitation E exceeds ${MAX_ACTORS} concurrent actors`);
    const ids = new Set();
    return sourceActors.map(actor => {
      const id = String(actor.id ?? '');
      if (!id || ids.has(id)) throw new Error('Levitation E needs distinct actor IDs');
      ids.add(id);
      if (!finite(actor.startedAt) || (actor.active !== true && !finite(actor.endedAt)))
        throw new Error(`Levitation E ${id} rejected: explicit start/end transition times required`);
      const body = actor.bodyWorld, feet = actor.feetWorld;
      if (!body || ![body.x, body.y].every(finite) || !feet || ![feet.x, feet.y].every(finite))
        throw new Error(`Levitation E ${id} rejected: explicit airborne bodyWorld and feetWorld required`);
      const ending = actor.active !== true;
      const phaseAge = ending ? Math.max(0, now - actor.endedAt) : Math.max(0, now - actor.startedAt);
      const onset = !ending && phaseAge < ONSET_MS;
      const endT = ending ? clamp(phaseAge / END_MS) : 0;
      const reduced = Boolean(scene.reducedMotion);
      const fade = ending ? 1 - smooth(endT) : 1;
      const pulse = reduced ? 1 : 0.91 + 0.09 * Math.sin(now * 0.0032 + id.length * 0.7);
      const alpha = clamp(fade * pulse);
      const toScreen = p => ({ x: (p.x - camera.x) * zoom, y: (p.y - camera.y) * zoom });
      const b = toScreen(body), f = toScreen(feet);
      const heightWorld = feet.y - body.y;
      if (heightWorld <= 0.5)
        throw new Error(`Levitation E ${id} rejected: airborne body must be above supplied feet`);
      if (actor.active !== true && now >= actor.endedAt + END_MS) return null;
      const height = heightWorld * zoom;
      const onsetT = onset ? clamp(phaseAge / ONSET_MS) : 1;
      const ringAlpha = (onset ? 1 - smooth(onsetT) : (ending ? 0 : 0.23)) * alpha;
      const ringRadius = (12 + (onset ? 13 * smooth(onsetT) : 0)) * zoom;
      const streams = [];
      const converge = ending ? smooth(endT) : 0;
      for (const side of [-1, 1]) {
        const phase = reduced ? 0 : now * 0.00105 + (side > 0 ? Math.PI : 0) + id.length * 0.41;
        const baseX = (feet.x - camera.x) * zoom + side * 8 * zoom;
        const bottomY = f.y - 3 * zoom;
        const topY = b.y + height * 0.23;
        const points = [];
        for (let i = 0; i <= STREAM_SEGMENTS; i++) {
          const t = i / STREAM_SEGMENTS;
          const rise = t * (1 - 0.20 * converge);
          const swirl = reduced ? 0 : Math.sin(phase - t * Math.PI * 1.4) * 5.2 * zoom * (1 - 0.72 * converge);
          const collapse = ending ? (1 - converge) : 1;
          points.push({ x: baseX + swirl * collapse + (b.x - f.x) * rise,
            y: bottomY - (bottomY - topY) * rise + (ending ? converge * t * height * 0.12 : 0) });
        }
        streams.push({ points, alpha: alpha * (ending ? 1 - smooth(Math.max(0, endT - 0.15) / 0.85) : (reduced ? 0.32 : 0.66)) });
      }
      return { id, playerId: String(actor.playerId ?? id), active: !ending, ending,
        onset, phaseAge, endT, reducedMotion: reduced, body: b, feet: f, height,
        alpha, ringAlpha, ringRadius, streams };
    }).filter(Boolean);
  }

  function rectForSegment(a, b, width, color) {
    const dx = b.x - a.x, dy = b.y - a.y;
    const length = Math.hypot(dx, dy);
    if (!finite(length) || length < 1e-4 || !finite(width) || width <= 0) return null;
    const c = dx / length, s = dy / length;
    return { x: -length / 2, y: -width / 2, w: length, h: width,
      transform: [c, s, -s, c, (a.x + b.x) / 2, (a.y + b.y) / 2],
      color, mode: 'additive' };
  }
  function commandsFor(effect) {
    const result = [];
    for (const stream of effect.streams) {
      for (let i = 0; i < stream.points.length - 1; i++) {
        const t = i / (stream.points.length - 2);
        const width = (2.2 + 2.2 * Math.sin(Math.PI * t)) * (effect.reducedMotion ? 0.8 : 1);
        const color = [0.44, 0.84, 1, clamp(stream.alpha * (0.64 + 0.36 * Math.sin(Math.PI * t)))];
        const command = rectForSegment(stream.points[i], stream.points[i + 1], width, color);
        if (command) result.push(command);
      }
    }
    if (effect.ringAlpha > 0.001) {
      const segments = effect.reducedMotion ? 12 : 20;
      for (let i = 0; i < segments; i++) {
        const a0 = i * Math.PI * 2 / segments + (effect.onset ? effect.phaseAge * 0.0016 : 0);
        const a1 = (i + 0.76) * Math.PI * 2 / segments + (effect.onset ? effect.phaseAge * 0.0016 : 0);
        const center = effect.feet;
        const radius = effect.ringRadius * (1 + (effect.onset ? 0.12 * Math.sin(effect.phaseAge * 0.025) : 0));
        const p0 = { x: center.x + Math.cos(a0) * radius, y: center.y + Math.sin(a0) * radius * 0.34 };
        const p1 = { x: center.x + Math.cos(a1) * radius, y: center.y + Math.sin(a1) * radius * 0.34 };
        const ring = rectForSegment(p0, p1, Math.max(1.2, 2.4 * (effect.reducedMotion ? 1 : 1)),
          [0.66, 0.86, 1, clamp(effect.ringAlpha * 0.88)]);
        if (ring) result.push(ring);
      }
    }
    return result;
  }
  function create() {
    let destroyed = false;
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed) throw new Error('Levitation E pass destroyed');
      if (typeof frame?.stage !== 'function' || typeof frame?.rect !== 'function' ||
          typeof target !== 'string' || !target)
        throw new TypeError('Levitation E needs the shared rectangle frame and target');
      const effects = plan({ scene, camera, zoom, viewport });
      if (!effects.length) return { drawn: 0, effects, commands: [] };
      const commands = effects.flatMap(commandsFor);
      if (commands.length > MAX_ACTORS * (STREAM_SEGMENTS * 2 + 20))
        throw new RangeError('Levitation E geometry exceeded its bounded primitive budget');
      frame.stage('world:gravity-levitation-e');
      for (const command of commands) frame.rect(target, command);
      return { drawn: effects.length, effects, commands };
    }
    return Object.freeze({ record, destroy() { destroyed = true; } });
  }
  const api = Object.freeze({ TYPE, MAX_ACTORS, ONSET_MS, END_MS, STREAM_SEGMENTS, plan, create });
  root.DvaWebGPULevitationE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
