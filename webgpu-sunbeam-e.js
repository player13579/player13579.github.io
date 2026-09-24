/* Textureless Sunbeam E for the shared ordered WebGPU frame. The caller must
 * provide a measured hand world point, explicit facing vector, and target. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, value));
  const MAX_ACTIVE = 16;
  const MAX_EMITTERS_PER_EVENT = 2;
  const MAX_DURATION_MS = 1200;
  const MAX_WORLD_RANGE = 950;
  const RANGE_TOLERANCE = 2;
  const TYPE = 'flora-sunbeam';
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
      // PH supply, propagation and dispersal use one source clock. The
      // server's endpoint has no wall/target classification, so it cannot flash.
      const supply = reducedMotion ? .94 : .22 + .78 * smooth(progress / .08);
      const transport = reducedMotion ? 1 : smooth(progress / .19);
      const alpha = clamp(tail);
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
        return { hand: { x: handX, y: handY }, target: { x: targetX, y: targetY },
          angle, distance };
      });
      const firstRay = rays[0];
      return { id, playerId: String(effect.playerId ?? ''), progress,
        reducedMotion, hand: firstRay.hand, target: firstRay.target,
        angle: firstRay.angle, distance: firstRay.distance,
        alpha, supply, transport, dispersal: 1 - tail, rays,
        handWorlds: hands.map(hand => ({ x: hand.x, y: hand.y })),
        sourceWorld: { x: source.x, y: source.y }, targetWorld: { x: target.x, y: target.y },
        serverDistance, duration: effect.duration, startedAt: effect.startedAt };
    });
  }

  // A continuous optical field replaces the old segmented-rectangle geometry.
  // Values are physical pixels; the same shader is used by game and preview.
  const shader = /* wgsl */ `
struct Params {
  viewport: vec4f, // physical width, height, logical-to-physical x, y
  ray0: vec4f,     // measured hand x/y, extended endpoint x/y
  ray1: vec4f,
  energy: vec4f,   // PH envelope, supply, transport, logical zoom
  control: vec4f,  // hand count, progress, reduced motion, reserved
};
@group(0) @binding(0) var<uniform> p: Params;
struct VertexOut { @builtin(position) position: vec4f };
@vertex fn screenVertex(@builtin(vertex_index) id: u32) -> VertexOut {
  let corners = array<vec2f, 3>(vec2f(-1.0,-1.0),vec2f(3.0,-1.0),vec2f(-1.0,3.0));
  var out: VertexOut;
  out.position = vec4f(corners[id], 0.0, 1.0);
  return out;
}
fn bell(value: f32, width: f32) -> f32 {
  let u = value / max(width, 0.001);
  return exp(-u * u);
}
fn rayLight(pixel: vec2f, ray: vec4f, time: f32) -> vec4f {
  let a = ray.xy;
  let b = ray.zw;
  let axis = b - a;
  let rayLength = max(length(axis), 0.001);
  let tangent = axis / rayLength;
  let along = dot(pixel - a, tangent);
  let t = clamp(along / rayLength, 0.0, 1.0);
  let lateral = dot(pixel - a, vec2f(-tangent.y, tangent.x));
  let scale = max(0.25, p.energy.w) * (p.viewport.z + p.viewport.w) * 0.5;
  let motion = select(time, 0.35, p.control.z > 0.5);
  let movingEnergy = select(0.92 + 0.08 * sin(7.85 * t - motion * 5.0),
    1.0, p.control.z > 0.5);
  // PH1: emission supplied at the measured hand, transported along one
  // continuous axis, then dispersed at the authoritative finite terminus.
  let sourceGate = smoothstep(-7.0 * scale, 7.0 * scale, along);
  let terminusGate = 1.0 - smoothstep(rayLength - 31.0 * scale,
    rayLength + 4.0 * scale, along);
  let column = sourceGate * terminusGate * p.energy.z * movingEnergy;
  let inner = bell(lateral, 7.0 * scale) * column;
  let body = bell(lateral, 24.0 * scale) * column;
  let supplyCore = bell(length(pixel - a), 12.0 * scale) * p.energy.y;
  let worldRgb = vec3f(1.0, 0.985, 0.79) * inner * 0.86 +
    vec3f(1.0, 0.72, 0.19) * body * 0.48 +
    vec3f(1.0, 0.88, 0.47) * supplyCore * 0.67;
  let worldCoverage = inner * 0.66 + body * 0.31 + supplyCore * 0.48;
  // OBS1: low local glow is bound to PH1's actual source/column mask. It
  // cannot create an endpoint impact or replace the column silhouette.
  let sourceGlow = bell(length(pixel - a), 37.0 * scale) * p.energy.y * 0.14;
  let columnGlow = bell(lateral, 51.0 * scale) * column * 0.095;
  let observation = sourceGlow + columnGlow;
  let rgb = worldRgb + vec3f(1.0, 0.68, 0.17) * observation;
  return vec4f(rgb, worldCoverage + observation);
}
@fragment fn sunbeamFragment(@builtin(position) position: vec4f) -> @location(0) vec4f {
  var light = rayLight(position.xy, p.ray0, p.control.y);
  if (p.control.x > 1.5) {
    light = max(light, rayLight(position.xy, p.ray1, p.control.y));
  }
  let alpha = clamp(light.a * p.energy.x, 0.0, 0.97);
  // The transparent live overlay uses premultiplied-alpha presentation.
  let rgb = min(light.rgb * p.energy.x, vec3f(alpha));
  return vec4f(rgb, alpha);
}
`;

  function create({ renderer, frameOwner = renderer } = {}) {
    if (frameOwner?.state !== 'ready' || !frameOwner.device?.createShaderModule ||
        !frameOwner.device?.queue?.writeBuffer || !frameOwner.own || !frameOwner.release)
      throw new TypeError('Sunbeam E requires the shared WebGPU frame owner');
    const device = frameOwner.device, format = frameOwner.format;
    const module = device.createShaderModule({ label: 'DVA continuous solar Sunbeam WGSL', code: shader });
    const bindGroupLayout = device.createBindGroupLayout({ entries: [{ binding: 0,
      visibility: 0x1 | 0x2, buffer: { type: 'uniform' } }] });
    const layout = device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] });
    const blend = { color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
      alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' } };
    const pipeline = device.createRenderPipeline({ label: 'DVA continuous Sunbeam E', layout,
      vertex: { module, entryPoint: 'screenVertex' },
      fragment: { module, entryPoint: 'sunbeamFragment', targets: [{ format, blend }] },
      primitive: { topology: 'triangle-list' } });
    let compileState = module.getCompilationInfo ? 'pending' : 'ready';
    const ready = module.getCompilationInfo ? Promise.resolve().then(() => module.getCompilationInfo())
      .then(info => {
        if (info.messages?.some(item => item.type === 'error'))
          throw new Error('Sunbeam WGSL compilation failed');
        compileState = 'ready';
      }).catch(error => { compileState = 'failed'; throw error; }) : Promise.resolve();
    // The staged main driver is synchronous; it may choose Canvas fallback
    // while compilation is pending. Its unused promise must remain handled.
    void ready.catch(() => {});
    const slots = [], indices = new WeakMap();
    let destroyed = false;
    function slot(index) {
      if (slots[index]) return slots[index];
      const uniform = frameOwner.own(device.createBuffer({
        label: `DVA Sunbeam E parameters ${index}`, size: 80, usage: 0x40 | 0x08 }));
      const bindGroup = device.createBindGroup({ layout: bindGroupLayout,
        entries: [{ binding: 0, resource: { buffer: uniform } }] });
      return (slots[index] = { uniform, bindGroup });
    }
    function record({ frame, target, viewport, scene, camera, zoom } = {}) {
      if (destroyed || frameOwner.state !== 'ready') throw new Error('Sunbeam E pass destroyed or unavailable');
      if (compileState !== 'ready') throw new Error('Sunbeam WGSL shader is not ready');
      if (!frame || typeof frame.stage !== 'function' || typeof frame.add !== 'function' ||
          typeof target !== 'string' || !target || !viewport ||
          !Number.isInteger(viewport.pixelWidth) || !Number.isInteger(viewport.pixelHeight))
        throw new TypeError('Sunbeam E needs an ordered WebGPU frame and physical target');
      const effects = plan({ scene, camera, zoom, viewport });
      if (!effects.length) return { drawn: 0, effects, passes: 0 };
      const sx = viewport.pixelWidth / viewport.width;
      const sy = viewport.pixelHeight / viewport.height;
      const baseIndex = indices.get(frame) || 0;
      frame.stage('flora-sunbeam-e');
      effects.forEach((effect, offset) => {
        const { uniform, bindGroup } = slot(baseIndex + offset);
        const rays = effect.rays;
        const point = ray => [ray.hand.x * sx, ray.hand.y * sy,
          ray.target.x * sx, ray.target.y * sy];
        const values = new Float32Array([
          viewport.pixelWidth, viewport.pixelHeight, sx, sy,
          ...point(rays[0]), ...(rays[1] ? point(rays[1]) : point(rays[0])),
          effect.alpha, effect.supply, effect.transport, zoom,
          rays.length, effect.progress, effect.reducedMotion ? 1 : 0, 0
        ]);
        if (!values.every(finite)) throw new Error('Sunbeam E shader values are not finite');
        device.queue.writeBuffer(uniform, 0, values);
        const paddingX = 105 * zoom * sx, paddingY = 105 * zoom * sy;
        const xs = rays.flatMap(ray => [ray.hand.x * sx, ray.target.x * sx]);
        const ys = rays.flatMap(ray => [ray.hand.y * sy, ray.target.y * sy]);
        const left = clamp(Math.floor(Math.min(...xs) - paddingX), 0, viewport.pixelWidth);
        const top = clamp(Math.floor(Math.min(...ys) - paddingY), 0, viewport.pixelHeight);
        const right = clamp(Math.ceil(Math.max(...xs) + paddingX), 0, viewport.pixelWidth);
        const bottom = clamp(Math.ceil(Math.max(...ys) + paddingY), 0, viewport.pixelHeight);
        if (right <= left || bottom <= top)
          throw new Error(`Sunbeam E ${effect.id} has no visible target footprint`);
        frame.add({ target, label: `DVA continuous Sunbeam E ${effect.id}`,
          encode(pass, info) {
            if (info.device !== device || info.format !== format ||
                info.width !== viewport.pixelWidth || info.height !== viewport.pixelHeight)
              throw new Error('Sunbeam E target device, format or backing size mismatch');
            pass.setScissorRect(left, top, right - left, bottom - top);
            pass.setPipeline(pipeline);
            pass.setBindGroup(0, bindGroup);
            pass.draw(3);
          } });
      });
      indices.set(frame, baseIndex + effects.length);
      return { drawn: effects.length, effects, passes: effects.length };
    }
    return Object.freeze({ device, shader, ready, record,
      get state() { return destroyed ? 'destroyed' : compileState; },
      destroy() {
        if (destroyed) return;
        destroyed = true;
        for (const { uniform } of slots) if (frameOwner.release(uniform)) uniform.destroy();
      } });
  }

  const api = Object.freeze({ TYPE, MAX_ACTIVE, MAX_EMITTERS_PER_EVENT,
    MAX_DURATION_MS,
    MAX_WORLD_RANGE, RANGE_TOLERANCE, shader, plan, create });
  root.DvaWebGPUSunbeamE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
