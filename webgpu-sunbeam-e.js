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
        const fullWorldLength = Math.hypot(dxWorld, dyWorld);
        const handX = (hand.x - camera.x) * zoom;
        const handY = (hand.y - camera.y) * zoom;
        const targetX = (hand.x + dxWorld * extension - camera.x) * zoom;
        const targetY = (hand.y + dyWorld * extension - camera.y) * zoom;
        const dx = targetX - handX, dy = targetY - handY;
        const distance = Math.hypot(dx, dy), angle = Math.atan2(dy, dx);
        if (![handX, handY, targetX, targetY, distance, angle].every(finite))
          throw new Error(`Sunbeam E ${id} rejected: transformed beam geometry is not finite`);
        return { hand: { x: handX, y: handY }, target: { x: targetX, y: targetY },
          angle, distance, fullWorldLength };
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

  // Distinct PH supply, carrier, transport, boundary and terminal fields feed
  // one budgeted OBS response. Values are physical pixels in game and preview.
  const shader = /* wgsl */ `
struct Params {
  viewport: vec4f, // physical width, height, logical-to-physical x, y
  ray0: vec4f,     // measured hand x/y, extended endpoint x/y
  ray1: vec4f,
  energy: vec4f,   // PH envelope, supply, transport, logical zoom
  control: vec4f,  // hand count, progress, reduced motion, minimum full hand-to-target world length
};
@group(0) @binding(0) var<uniform> p: Params;
struct VertexOut { @builtin(position) position: vec4f };
@vertex fn screenVertex(@builtin(vertex_index) id: u32) -> VertexOut {
  let corners = array<vec2f, 3>(vec2f(-1.0,-1.0),vec2f(3.0,-1.0),vec2f(-1.0,3.0));
  var out: VertexOut;
  out.position = vec4f(corners[id], 0.0, 1.0);
  return out;
}
fn rayLight(pixel: vec2f, ray: vec4f, time: f32) -> vec4f {
  let a = ray.xy;
  let b = ray.zw;
  let axis = b - a;
  let rayLength = max(length(axis), 0.001);
  let tangent = axis / rayLength;
  let along = dot(pixel - a, tangent);
  let lateral = dot(pixel - a, vec2f(-tangent.y, tangent.x));
  let scale = max(0.25, p.energy.w) * (p.viewport.z + p.viewport.w) * 0.5;
  let worldLength = max(rayLength / scale, 0.001);
  let u = along / scale;
  let v = lateral / scale;
  let t = clamp(u / worldLength, 0.0, 1.0);
  let motion = select(time, 0.36, p.control.z > 0.5);
  let shortScale = mix(0.57, 1.0, smoothstep(100.0, 320.0, worldLength));

  // PH carrier: one broad, nonuniform solar plasma volume. Macro pinches and
  // a displaced axis are large enough to read at the smallest preview zoom.
  let throat = smoothstep(0.0, min(42.0, 0.18 * worldLength), u);
  let swell = 18.0 + 24.0 * exp(-pow((t - 0.23) / 0.19, 2.0))
    - 4.0 * exp(-pow((t - 0.51) / 0.10, 2.0))
    + 6.0 * exp(-pow((t - 0.73) / 0.18, 2.0));
  let capSpan = min(28.0, 0.18 * worldLength);
  let capStart = worldLength - capSpan;
  let tip = 1.0 - 0.70 * smoothstep(capStart, worldLength + 2.0, u);
  let width = mix(8.0, swell, throat) * tip * shortScale;
  let axisBend = (3.8 * sin(6.28318 * (0.72 * t + 0.13 * motion))
    + 2.3 * sin(6.28318 * (1.43 * t - 0.09 * motion))) * sin(3.14159 * t);
  let cross = v - axisBend;
  let shear = 4.2 * sin(6.28318 * (2.2 * t - 0.48 * motion + 0.10 * sign(cross)))
    * sin(3.14159 * t);
  let edgePosition = abs(cross) - width - shear;
  let bodyCross = 1.0 - smoothstep(-2.0, 2.0, edgePosition);
  let sourceGate = smoothstep(-5.0, 3.0, u);
  let frontGate = 1.0 - smoothstep(worldLength - max(8.0, capSpan * 0.55),
    worldLength + 3.0, u);
  let carrier = sourceGate * frontGate * bodyCross * p.energy.z;

  // PH palm supply precedes full propagation. It is spatially local to the
  // measured emitter and narrows into the carrier instead of copying its rim.
  let palmRadius = length(vec2f((u - 3.0) * 0.64, v * 0.93));
  let palm = (1.0 - smoothstep(9.0, 18.0, palmRadius))
    * (1.0 - smoothstep(19.0, 34.0, u)) * p.energy.y;
  let supplyTongue = (1.0 - smoothstep(5.0, 10.0, abs(v)))
    * smoothstep(-3.0, 8.0, u) * (1.0 - smoothstep(24.0, 42.0, u)) * p.energy.y;
  let supply = max(palm, 0.65 * supplyTongue);

  // PH transport: broad, offset streams pass through the one carrier.
  // Their staggered waves and the intervening dim channel give direction and
  // depth, while the carrier beneath them remains connected.
  let streamAPath = width * (0.28 + 0.15 * sin(6.28318 * (0.90 * t - 0.15 * motion)));
  let streamBPath = -width * (0.32 + 0.13 * sin(6.28318 * (0.63 * t - 0.22 * motion)));
  let waveA = 0.48 + 0.52 * pow(0.5 + 0.5 * cos(6.28318 * (u / 126.0 - 1.55 * motion)), 2.0);
  let waveB = 0.42 + 0.58 * pow(0.5 + 0.5 * cos(6.28318 * (u / 164.0 - 1.10 * motion + 0.27)), 2.0);
  let streamA = exp(-pow((cross - streamAPath) / max(5.0, 0.35 * width), 2.0)) * waveA;
  let streamB = exp(-pow((cross - streamBPath) / max(5.0, 0.30 * width), 2.0)) * waveB;
  let heart = exp(-pow((cross + 0.05 * width) / max(4.0, 0.23 * width), 2.0))
    * (0.56 + 0.44 * waveA);
  let channel = exp(-pow((cross - width * 0.15) / max(2.0, 0.10 * width), 2.0))
    * (0.38 + 0.22 * waveB);
  let transport = carrier * (0.36 * streamA + 0.30 * streamB + 0.28 * heart);
  let bodyAlpha = carrier * clamp(0.20 + 0.31 * streamA + 0.25 * streamB
    + 0.30 * heart - 0.31 * channel, 0.12, 0.78);

  // Broad asymmetric solar tongues are displaced plasma, not copies of the
  // carrier outline. Their two loci and lifetimes differ from the streams.
  let tongueScale = smoothstep(120.0, 340.0, worldLength);
  let upperReach = (4.0 + 24.0 * tongueScale)
    * (1.0 - smoothstep(0.0, 0.19, abs(t - 0.25 - 0.025 * motion)));
  let lowerReach = (3.0 + 17.0 * tongueScale)
    * (1.0 - smoothstep(0.0, 0.21, abs(t - 0.63 + 0.035 * motion)));
  let upperTongue = smoothstep(width - 4.0, width + 2.0, cross)
    * (1.0 - smoothstep(width + upperReach - 2.0, width + upperReach + 3.0, cross));
  let lowerTongue = smoothstep(width - 4.0, width + 2.0, -cross)
    * (1.0 - smoothstep(width + lowerReach - 2.0, width + lowerReach + 3.0, -cross));
  let plasmaTongues = sourceGate * frontGate * p.energy.z
    * (0.32 * upperTongue * smoothstep(0.0, 6.0, upperReach)
    + 0.25 * lowerTongue * smoothstep(0.0, 6.0, lowerReach));

  // PH boundary: a delayed, feathered shear outside the carrier. Its spatial
  // support differs from the internal streams and follows the moving contour.
  let edgeLobe = exp(-pow((edgePosition - 2.8) / 5.6, 2.0));
  let edgeRhythm = 0.58 + 0.42 * sin(6.28318 * (1.72 * t - 0.62 * motion))
    * sin(6.28318 * (0.66 * t - 0.37 * motion));
  let boundary = sourceGate * frontGate * p.energy.z * 0.26
    * edgeLobe * edgeRhythm;

  // PH endpoint: a finite, narrow propagation front, not a hit flash.
  let terminal = p.energy.z * 0.14 * exp(-pow((u - worldLength) / 11.0, 2.0))
    * exp(-pow(cross / max(5.0, width * 0.78), 2.0));

  // OBS: a separately budgeted low-opacity response to the PH source/body.
  // It cannot fill the dim internal channel or turn the silhouette white.
  let haloWidth = width + 15.0 * shortScale;
  let observation = p.energy.z * sourceGate * frontGate * 0.06
    * exp(-pow(abs(cross) / max(8.0, haloWidth), 2.0));
  let flowTerm = 0.42 * transport;
  let supplyTerm = 0.70 * supply;
  let density = bodyAlpha + flowTerm + boundary + plasmaTongues
    + terminal + observation + supplyTerm;
  let alpha = clamp(p.energy.x * density, 0.0, 0.91);
  // Different PH and OBS layers retain their own radiance. A single mixed
  // orange for every field flattened the motion into a uniform baton.
  let radiance = bodyAlpha * vec3f(1.0, 0.44, 0.12)
    + flowTerm * vec3f(1.0, 0.97, 0.76)
    + boundary * vec3f(1.0, 0.64, 0.20)
    + plasmaTongues * vec3f(1.0, 0.55, 0.16)
    + terminal * vec3f(1.0, 0.86, 0.53)
    + observation * vec3f(0.89, 0.40, 0.13)
    + supplyTerm * vec3f(1.0, 0.98, 0.84);
  let straightColor = radiance / max(density, 0.0001);
  return vec4f(straightColor * alpha, alpha);
}
fn unionPremultiplied(a: vec4f, b: vec4f) -> vec4f {
  return a + b * (1.0 - a.a);
}
fn shortRangeUnion(a: vec4f, b: vec4f) -> vec4f {
  let sourceOver = unionPremultiplied(a, b);
  let alphaOld = sourceOver.a;
  let alphaShort = max(a.a, b.a) + 0.10 * min(a.a, b.a) * (1.0 - max(a.a, b.a));
  let shortMix = 1.0 - smoothstep(180.0, 360.0, p.control.w);
  let alphaNew = clamp(mix(alphaOld, alphaShort, shortMix), 0.0, 1.0);
  let rgbScale = alphaNew / max(alphaOld, 0.000001);
  return vec4f(sourceOver.rgb * rgbScale, alphaNew);
}
@fragment fn sunbeamFragment(@builtin(position) position: vec4f) -> @location(0) vec4f {
  var light = rayLight(position.xy, p.ray0, p.control.y);
  if (p.control.x > 1.5) {
    light = shortRangeUnion(light, rayLight(position.xy, p.ray1, p.control.y));
  }
  // rayLight already applies the single lifetime envelope and premultiplies
  // each source. A second fade here would dim onset and decay quadratically.
  return light;
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
          rays.length, effect.progress, effect.reducedMotion ? 1 : 0,
          Math.min(...rays.map(ray => ray.fullWorldLength))
        ]);
        if (!values.every(finite)) throw new Error('Sunbeam E shader values are not finite');
        device.queue.writeBuffer(uniform, 0, values);
        const paddingX = 70 * zoom * sx, paddingY = 70 * zoom * sy;
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
