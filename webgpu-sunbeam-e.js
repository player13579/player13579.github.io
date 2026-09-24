/* Sunbeam v26 E: source-fed, directional and textureless WebGPU beam. The caller must
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
  viewport: vec4f,
  ray0: vec4f,
  ray1: vec4f,
  energy: vec4f,
  control: vec4f,
};
@group(0) @binding(0) var<uniform> p: Params;
struct VertexOut { @builtin(position) position: vec4f };
@vertex fn screenVertex(@builtin(vertex_index) id: u32) -> VertexOut {
  let corners = array<vec2f, 3>(vec2f(-1.0,-1.0), vec2f(3.0,-1.0), vec2f(-1.0,3.0));
  var out: VertexOut;
  out.position = vec4f(corners[id], 0.0, 1.0);
  return out;
}
fn hash11(x: f32) -> f32 { return fract(sin(x * 127.1 + 78.233) * 43758.5453); }
fn gauss(x: f32) -> f32 { return exp(-x * x); }
fn sat(x: f32) -> f32 { return clamp(x, 0.0, 1.0); }
fn over(a: vec4f, b: vec4f) -> vec4f { return a + b * (1.0 - a.a); }
fn beam(pixel: vec2f, ray: vec4f, clock: f32) -> vec4f {
  let axis = ray.zw - ray.xy;
  let lengthPx = max(length(axis), 0.001);
  let tangent = axis / lengthPx;
  let normal = vec2f(-tangent.y, tangent.x);
  let physicalPerWorld = max(0.001, p.energy.w * (p.viewport.z + p.viewport.w) * 0.5);
  let lengthWorld = lengthPx / physicalPerWorld;
  let u = dot(pixel - ray.xy, tangent) / physicalPerWorld;
  let v = dot(pixel - ray.xy, normal) / physicalPerWorld;
  let t = sat(u / max(lengthWorld, 0.001));
  let movingClock = select(clock, 0.38, p.control.z > 0.5);

  // PH1 macro envelope: asymmetric broad lobes and a marked dark waist.
  // PH geometry, rather than an OBS halo, owns the wide beam silhouette.
  let sizeFactor = mix(0.55, 1.0, smoothstep(90.0, 310.0, lengthWorld));
  let lobeA = 9.0 * gauss((t - 0.26) / 0.14);
  let lobeB = 6.5 * gauss((t - 0.69) / 0.17);
  let neck = 5.0 * gauss((t - 0.49) / 0.085);
  let emergence = mix(0.52, 1.0, smoothstep(0.0, 39.0, u));
  let terminalTaper = 1.0 - 0.94 * smoothstep(lengthWorld - 58.0, lengthWorld + 1.0, u);
  let halfWidth = (19.0 + lobeA + lobeB - neck) * sizeFactor * emergence * terminalTaper;
  let axisDrift = sin(6.283185 * (0.62 * t - 0.11 * movingClock))
    * sin(3.141593 * t) * 2.2;
  let cross = v - axisDrift;
  let finiteStart = smoothstep(-4.0, 2.0, u);
  let finiteEnd = 1.0 - smoothstep(lengthWorld - 3.0, lengthWorld + 2.0, u);
  let endAttenuation = 1.0 - 0.76 * smoothstep(lengthWorld - 42.0, lengthWorld + 2.0, u);
  let alongGate = finiteStart * finiteEnd * endAttenuation;

  // PH1 supply: a flared hand mouth contracts into the narrow axial channel.
  let palm = gauss(length(vec2f(u * 0.72, v)) / 10.5);
  let sourceWing = gauss((u - 13.0) / 16.0) * gauss((abs(v) - 11.0) / 5.0);
  let collimation = gauss(cross / max(4.0, 12.0 - 0.14 * max(u, 0.0)))
    * smoothstep(-3.0, 7.0, u) * (1.0 - smoothstep(36.0, 68.0, u));
  let supply = (0.74 * palm + 0.50 * sourceWing + 0.70 * collimation) * p.energy.y;

  // PH1 transport: large oblique fronts move downstream. A dark relief follows
  // every bright face through the envelope, while the hot axis stays intact.
  let frontSkew = 0.70 + 0.32 * sin(6.283185 * (0.90 * t - 0.21 * movingClock));
  let packetMetric = (u - frontSkew * cross - movingClock * 390.0) / 126.0;
  let packetCell = floor(packetMetric);
  let packetLocal = fract(packetMetric);
  let packetCenter = 0.38 + (hash11(packetCell + 4.0) - 0.5) * 0.17;
  let packetWeight = 0.72 + 0.28 * hash11(packetCell + 11.0);
  let packetFace = gauss((packetLocal - packetCenter) / 0.16) * packetWeight;
  let packetWake = gauss((packetLocal - packetCenter + 0.20) / 0.24) * packetWeight;
  let relief = gauss((packetLocal - packetCenter - 0.29) / 0.13);
  let frontEnergy = 0.86 * packetFace + 0.36 * packetWake;
  let lagMetric = (u - frontSkew * cross - max(0.0, movingClock - 0.045) * 390.0) / 126.0;
  let lagCell = floor(lagMetric);
  let lagCenter = 0.38 + (hash11(lagCell + 4.0) - 0.5) * 0.17;
  let lagPacket = gauss((fract(lagMetric) - lagCenter) / 0.19);

  // PH1 core: a narrow, continuous white-hot axis. Packet contrast is carried
  // by the envelope; it cannot turn this axis into a necklace of bright dots.
  let coreRadius = max(2.8, 0.15 * halfWidth);
  let core = gauss(cross / coreRadius) * (0.88 + 0.08 * packetFace)
    * alongGate * p.energy.z;
  let innerFire = gauss(cross / max(6.0, halfWidth * 0.34))
    * (0.33 + 0.33 * frontEnergy) * alongGate * p.energy.z;

  // PH1 carrier and shear: high-contrast flux faces separated by dark relief.
  // The outer contour is widened asymmetrically, not a blurred copy of core.
  let eddy = 3.8 * sin(6.283185 * (1.40 * t - 0.23 * movingClock))
    + 2.3 * sin(6.283185 * (2.80 * t - 0.34 * movingClock + 0.16 * sign(cross)));
  let edgeDistance = abs(cross) - halfWidth - eddy * (0.46 + 0.76 * lagPacket);
  let carrierMask = 1.0 - smoothstep(-3.0, 2.0, edgeDistance);
  let radial = 1.0 - 0.17 * smoothstep(0.0, halfWidth, abs(cross));
  let carrier = alongGate * carrierMask * radial * p.energy.z
    * max(0.12, 0.21 + 0.80 * frontEnergy - 0.20 * relief);
  let shearBand = gauss((edgeDistance - 0.5) / 4.2)
    * (0.12 + 0.48 * lagPacket) * alongGate * p.energy.z;
  let upperTongue = gauss((t - 0.30 - 0.045 * movingClock) / 0.13)
    * smoothstep(halfWidth - 3.0, halfWidth + 2.0, cross)
    * (1.0 - smoothstep(halfWidth + 12.0, halfWidth + 17.0, cross));
  let lowerTongue = gauss((t - 0.68 + 0.035 * movingClock) / 0.16)
    * smoothstep(halfWidth - 3.0, halfWidth + 2.0, -cross)
    * (1.0 - smoothstep(halfWidth + 7.0, halfWidth + 12.0, -cross));
  let tongues = (0.53 * upperTongue + 0.41 * lowerTongue)
    * (0.40 + 0.60 * frontEnergy) * alongGate * p.energy.z;

  // One broad off-axis sweep introduces directional depth without parallel
  // filaments. It is finite, curved, and tied to the travelling front.
  let sweepPath = halfWidth * (0.27 + 0.28 * sin(6.283185 * (0.72 * t - 0.24 * movingClock)));
  let sweep = gauss((cross - sweepPath) / 4.6) * gauss((t - 0.49) / 0.30)
    * (0.18 + 0.68 * frontEnergy) * alongGate * p.energy.z;

  // PH1 endpoint is a finite propagation rim, not a collision response.
  let endpoint = 0.18 * gauss((u - lengthWorld) / 5.5)
    * gauss(cross / max(3.0, halfWidth * 0.62)) * p.energy.z;

  // OBS1 receives PH1 emission. Its broad response is deliberately weak;
  // no blur, screen stripe, generated particle, or white silhouette fill.
  let observation = 0.055 * gauss(cross / max(10.0, halfWidth + 13.0))
    * alongGate * p.energy.z;
  let lifetime = p.energy.x;
  let haloA = sat(observation * lifetime);
  let bodyA = sat(carrier * lifetime * 0.82);
  let shearA = sat((shearBand + tongues) * lifetime * 0.68);
  let sweepA = sat(sweep * lifetime * 0.72);
  let innerA = sat(innerFire * lifetime * 0.88);
  let coreA = sat(core * lifetime * 0.97);
  let sourceA = sat(supply * lifetime * 0.88);
  let endA = sat(endpoint * lifetime * 0.50);
  var color = vec4f(vec3f(1.0, 0.54, 0.13) * haloA, haloA);
  color = over(vec4f(vec3f(1.0, 0.50, 0.10) * bodyA, bodyA), color);
  color = over(vec4f(vec3f(1.0, 0.69, 0.20) * shearA, shearA), color);
  color = over(vec4f(vec3f(1.0, 0.91, 0.49) * sweepA, sweepA), color);
  color = over(vec4f(vec3f(1.0, 0.82, 0.34) * innerA, innerA), color);
  color = over(vec4f(vec3f(1.0, 1.0, 0.94) * coreA, coreA), color);
  color = over(vec4f(vec3f(1.0, 0.98, 0.74) * sourceA, sourceA), color);
  color = over(vec4f(vec3f(1.0, 0.82, 0.40) * endA, endA), color);
  let cappedAlpha = min(color.a, 0.985);
  return vec4f(color.rgb * cappedAlpha / max(color.a, 0.000001), cappedAlpha);
}
fn boundedTwoHand(a: vec4f, b: vec4f) -> vec4f {
  let composite = over(a, b);
  let maxAlpha = max(a.a, b.a);
  let minAlpha = min(a.a, b.a);
  let shortWeight = 1.0 - smoothstep(180.0, 360.0, p.control.w);
  let limitedAlpha = maxAlpha + 0.12 * minAlpha * (1.0 - maxAlpha);
  let alpha = mix(composite.a, limitedAlpha, shortWeight);
  return vec4f(composite.rgb * alpha / max(composite.a, 0.000001), alpha);
}
@fragment fn sunbeamFragment(@builtin(position) position: vec4f) -> @location(0) vec4f {
  var color = beam(position.xy, p.ray0, p.control.y);
  if (p.control.x > 1.5) {
    color = boundedTwoHand(color, beam(position.xy, p.ray1, p.control.y));
  }
  return color;
}
`;

  function create({ renderer, frameOwner = renderer } = {}) {
    if (frameOwner?.state !== 'ready' || !frameOwner.device?.createShaderModule ||
        !frameOwner.device?.queue?.writeBuffer || !frameOwner.own || !frameOwner.release)
      throw new TypeError('Sunbeam E requires the shared WebGPU frame owner');
    const device = frameOwner.device, format = frameOwner.format;
    const module = device.createShaderModule({ label: 'DVA Sunbeam v26 WGSL', code: shader });
    const bindGroupLayout = device.createBindGroupLayout({ entries: [{ binding: 0,
      visibility: 0x1 | 0x2, buffer: { type: 'uniform' } }] });
    const layout = device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] });
    const blend = { color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
      alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' } };
    const pipeline = device.createRenderPipeline({ label: 'DVA Sunbeam v26 E', layout,
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
    // The staged main driver is synchronous; it may defer this pass
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
        frame.add({ target, label: `DVA Sunbeam v26 E ${effect.id}`,
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
