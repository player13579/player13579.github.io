/* Body gain effects in the ordered main WebGPU frame.
 * The caller records each admitted magic event at its original position in
 * the event stream. This pass owns source GPU copies and draw buffers only. */
(function (root) {
  'use strict';
  const PROFILES = Object.freeze({
    heal: Object.freeze({ type: 'gain-heal', key: 'healBodyRecovery', layer: 0, code: 1,
      sourceWidth: 941, sourceHeight: 1672, duration: 1180 }),
    mana: Object.freeze({ type: 'gain-mana', key: 'manaBodyRecovery', layer: 1, code: 2,
      sourceWidth: 1024, sourceHeight: 1536, duration: 1240 }),
    overheal: Object.freeze({ type: 'gain-overheal', key: null, layer: null, code: 3,
      duration: 1250 })
  });
  const TEXTURE_WIDTH = 1024, TEXTURE_HEIGHT = 1672;
  const FLOATS_PER_EFFECT = 16;
  const shader = /* wgsl */ `
struct Frame { size: vec4f };
struct Effect { rect: vec4f, phase: vec4f, shape: vec4f, source: vec4f };
@group(0) @binding(0) var<uniform> frame: Frame;
@group(0) @binding(1) var<storage, read> effects: array<Effect>;
@group(0) @binding(2) var sources: texture_2d_array<f32>;
@group(0) @binding(3) var sourceSampler: sampler;
@group(0) @binding(4) var bases: texture_2d_array<f32>;
struct Vertex { @builtin(position) position: vec4f, @location(0) local: vec2f, @location(1) @interpolate(flat) index: u32 };
@vertex fn vs(@builtin(vertex_index) vertex: u32, @builtin(instance_index) index: u32) -> Vertex {
  let corners = array<vec2f, 6>(vec2f(0,0),vec2f(1,0),vec2f(0,1),vec2f(0,1),vec2f(1,0),vec2f(1,1));
  let e = effects[index]; let uv = corners[vertex];
  let pos = e.rect.xy + uv * e.rect.zw;
  var out: Vertex;
  out.position = vec4f(pos / frame.size.xy * vec2f(2,-2) + vec2f(-1,1), 0, 1);
   out.local = uv * (e.shape.xy + vec2f(e.shape.w * 2.0)) - vec2f(e.shape.w);
   out.index = index; return out;
}
fn ease(x: f32) -> f32 { let q = 1.0 - clamp(x, 0.0, 1.0); return 1.0 - q*q*q; }
fn over(bottom: vec4f, top: vec4f) -> vec4f { return top + bottom * (1.0 - top.a); }
fn original(e: Effect, local: vec2f, offset: f32) -> vec4f {
  let sampleHeight = select(e.shape.z, e.shape.y, e.source.z > .5);
  let uv = vec2f(local.x / e.shape.x, (local.y - offset) / sampleHeight);
  let value = textureSampleLevel(sources, sourceSampler, uv * e.source.xy, i32(e.phase.x) - 1, 0.0);
  if (any(uv < vec2f(0.0)) || any(uv > vec2f(1.0))) { return vec4f(0.0); }
  return value;
}
fn baseOriginal(e: Effect, local: vec2f) -> vec4f {
  if (e.source.z < 1.5) { return original(e,local,0.0); }
  if (any(local < vec2f(0)) || local.x > e.shape.x || local.y > e.shape.z) { return vec4f(0); }
  return textureSampleLevel(bases,sourceSampler,local * e.source.w / vec2f(textureDimensions(bases)),i32(e.phase.x) - 1,0.0);
}
fn verticalMask(e: Effect, y: f32, low: f32, high: f32) -> f32 {
  let start = low * e.shape.y; let end = high * e.shape.y;
  let feather = min(13.0, max(4.0, (end - start) * 0.24));
  return clamp((y - start + feather) / feather, 0.0, 1.0) * clamp((end + feather - y) / feather, 0.0, 1.0);
}
fn manaMask(e: Effect, local: vec2f, flow: f32) -> f32 {
  // Same 24 phase fronts and authored source-local curves as the Canvas path.
  let points = array<vec2f,18>(
    vec2f(.16,.29),vec2f(.15,.35),vec2f(.22,.39),vec2f(.31,.42),vec2f(.38,.45),vec2f(.43,.475),
    vec2f(.90,.50),vec2f(.86,.46),vec2f(.79,.45),vec2f(.73,.49),vec2f(.68,.55),vec2f(.64,.605),
    vec2f(.10,.57),vec2f(.14,.66),vec2f(.25,.72),vec2f(.39,.75),vec2f(.54,.72),vec2f(.64,.605));
  let progress = min(23.0, floor(flow * 24.0)) / 23.0;
  let last = min(5u, u32(floor(progress * 6.0)));
  var alpha = 0.0;
  for (var i = 0u; i < 18u; i++) {
    let pointIndex = i % 6u;
    let leading = clamp((progress - f32(pointIndex) / 5.0 + .20) / .20, 0.0, 1.0);
    if (pointIndex <= last && leading > 0.0) {
      let radius = e.shape.x * (.23 + .05 * leading);
      let d = length(local - points[i] * e.shape.xy) / radius;
      let a = select(mix(leading * .84, 0.0, clamp((d-.58)/.42,0.0,1.0)), mix(leading,leading*.84,clamp(d/.58,0.0,1.0)), d <= .58);
      alpha = min(1.0, alpha + a);
    }
  }
  let t = clamp((progress - .72) / .28, 0.0, 1.0);
  let ambient = t*t*(3.0-2.0*t);
  return ambient + alpha * (1.0 - ambient);
}
fn maskedPixel(e: Effect, local: vec2f, offset: f32, low: f32, high: f32, flow: f32) -> vec4f {
  if (any(local < vec2f(0)) || any(local > e.shape.xy)) { return vec4f(0); }
  var mask = verticalMask(e,local.y,low,high);
  if (flow >= 0.0) { mask = manaMask(e,local,flow); }
  return original(e,local,offset) * mask;
}
fn maskedOriginal(e: Effect, local: vec2f, offset: f32, low: f32, high: f32, flow: f32) -> vec4f {
  // Canonical masks and animated scratch layers are native-sized. Interpolate
  // the masked native texels, not a high-resolution analytical mask, on zoom.
  if (e.source.z < 1.5) { return maskedPixel(e,local,offset,low,high,flow); }
  let a = floor(local - .5) + .5; let f = fract(local - .5);
  return mix(mix(maskedPixel(e,a,offset,low,high,flow),maskedPixel(e,a+vec2f(1,0),offset,low,high,flow),f.x),
             mix(maskedPixel(e,a+vec2f(0,1),offset,low,high,flow),maskedPixel(e,a+vec2f(1,1),offset,low,high,flow),f.x),f.y);
}
fn overhealAt(e: Effect, local: vec2f) -> vec4f {
  // Surplus health crests above the body, then forms a thin outer reservoir.
  let uv = local / e.shape.xy;
  if (any(uv < vec2f(0)) || any(uv > vec2f(1))) { return vec4f(0); }
  let p = e.phase.y;
  let reduced = e.phase.z > .5;
  let arrive = ease(p / .28);
  let spread = ease((p - .18) / .38);
  let depart = 1.0 - ease((p - .76) / .24);
  let drift = select(p * .24, 0.0, reduced);
  let side = abs(uv.x - .5);
  let body = .18 + .075 * smoothstep(.29,.65,uv.y);
  let shell = abs(side - body - .075 * spread);
  let sheetWindow = smoothstep(.25,.37,uv.y) * (1.0 - smoothstep(.79,.91,uv.y));
  let sheet = (1.0 - smoothstep(.008,.028,shell)) * sheetWindow * spread;
  let sheetGlow = (1.0 - smoothstep(.018,.075,shell)) * sheetWindow * spread * .27;
  let crestY = .25 - .075 * arrive + .012 * sin((uv.x * 2.0 + drift) * 6.28318);
  let crest = (1.0 - smoothstep(.007,.027,abs(uv.y - crestY))) *
    (1.0 - smoothstep(.18,.43,side)) * arrive;
  let crestGlow = (1.0 - smoothstep(.018,.09,abs(uv.y - crestY))) *
    (1.0 - smoothstep(.24,.49,side)) * arrive * .25;
  let spillX = .34 + .10 * spread + .018 * sin((uv.y * 2.0 + drift) * 6.28318);
  let spill = (1.0 - smoothstep(.006,.026,abs(side - spillX))) *
    smoothstep(.19,.31,uv.y) * (1.0 - smoothstep(.49,.68,uv.y)) * spread;
  let core = max(crest * .86, max(sheet * .72, spill * .62));
  let halo = max(crestGlow, sheetGlow);
  let alpha = clamp((core + halo) * depart * e.phase.w, 0.0, .86);
  let hue = mix(vec3f(.20,.67,.81), vec3f(.75,1.0,.94), clamp(core,0.0,1.0));
  return vec4f(hue * alpha, alpha);
}
 fn materialAt(e: Effect, local: vec2f) -> vec4f {
   if (e.phase.x > 2.5) { return overhealAt(e,local); }
   if (any(local < vec2f(0.0)) || any(local > e.shape.xy)) { return vec4f(0.0); }
   let p = e.phase.y; let reduced = e.phase.z > .5; let opacity = e.phase.w;
  let release = 1.0 - ease((p - .82) / .18);
  if (e.phase.x > 1.5) {
    let appear = ease(p / .14); let gather = ease((p - .03) / .54);
    let flow = ease((p - .02) / select(.60,.70,reduced));
     var material = baseOriginal(e,local);
     if (flow < .999) { material = maskedOriginal(e,local,0.0,0.0,1.0,flow); }
    return material * (appear*release*(.84+.16*gather)*opacity);
  }
  let heal = e.phase.x > .5;
  let appear = ease(p / select(.16,.18,heal));
  let flow = ease((p - select(.10,.12,heal)) / select(.54,.48,heal));
  let settle = ease((p - select(.56,.58,heal)) / select(.32,.28,heal));
  var color = vec4f(0.0);
   if (appear*release > .001) { color = baseOriginal(e,local) * (appear*release*opacity); }
  let bounds = select(vec4f(.48,.20,.02,.07),vec4f(.52,.22,.02,.08),heal);
  let ends = select(vec4f(1,.78,.47,.35),vec4f(1,.84,.56,.38),heal);
  var offsets = vec4f(10*(1-appear),12*(1-flow),9*(1-flow),-4*settle);
  var strengths = vec4f(.84*appear*(1-settle*.28),.78*flow*(1-settle*.18),.72*flow,.64*settle);
  if (heal) {
    offsets = vec4f(12*(1-appear),14*(1-flow),10*(1-flow),-4*settle);
    strengths = vec4f(.8*appear*(1-settle*.22),.72*flow*(1-settle*.16),.65*flow,.56*settle);
  }
  if (reduced) {
    offsets = vec4f(0.0);
    strengths = select(vec4f(.78*appear*(1-settle*.28),.70*flow,.58*flow,.55*settle),vec4f(.72*(1-settle*.2),.64*flow,.52*flow,.48*settle),heal);
  }
  for (var i=0u; i<4u; i++) {
    let strength = strengths[i]*release;
    if (strength > .001) {
       color = over(color,maskedOriginal(e,local,offsets[i],bounds[i],ends[i],-1.0) * (strength*opacity));
    }
  }
   return color;
 }
 @fragment fn fs(in: Vertex) -> @location(0) vec4f {
   let e = effects[in.index];
   let core = materialAt(e,in.local);
   if (e.phase.x > 2.5) { return core; }
   // Sample the current revealed material, not a whole-image outline.
   let directions = array<vec2f,8>(vec2f(1,0),vec2f(-1,0),vec2f(0,1),vec2f(0,-1),
     vec2f(.707,.707),vec2f(-.707,.707),vec2f(.707,-.707),vec2f(-.707,-.707));
   var near = 0.0; var far = 0.0;
   for (var i=0u; i<8u; i++) {
     near = near + materialAt(e,in.local + directions[i] * 5.0).a;
     far = far + materialAt(e,in.local + directions[i] * 11.0).a;
   }
   let light = clamp((near * .065 + far * .041) * (1.0 - core.a * .72), 0.0, .48);
   let hue = select(select(vec3f(.56,.94,.39),vec3f(1.0,.50,.68),e.phase.x > .5),
     vec3f(.55,.54,1.0),e.phase.x > 1.5);
   return over(vec4f(hue * light,light),core);
 }`;
  const finite = Number.isFinite;
  function ready(image, kind) {
    const p = PROFILES[kind];
    if (kind === 'overheal') return true;
    return Boolean(p && image?.complete && Number(image.naturalWidth) === p.sourceWidth &&
      Number(image.naturalHeight) === p.sourceHeight);
  }
  function plan({ effect, player, now, phase, camera, zoom, viewport, textures,
    reducedMotion = false, alpha = 1 } = {}) {
    if (!['playing', 'meeting'].includes(phase) || !effect || !player ||
        !player.alive || player.ejected || player.inVent || player.invisible) return null;
    const kind = String(effect.type || '').replace(/^gain-/, '');
    const profile = PROFILES[kind];
    if (!profile || effect.type !== profile.type ||
        String(effect.effectKind || kind) !== kind ||
        (kind === 'mana' && effect.variant === 'desire-recovery')) return null;
    const image = textures?.[profile.key];
    if (!ready(image, kind)) return null;
    if (!camera || !viewport || ![player.x, player.y, camera.x, camera.y, zoom,
      viewport.width, viewport.height, now, alpha].every(finite) || zoom <= 0 ||
      viewport.width <= 0 || viewport.height <= 0 || alpha <= 0) return null;
    const admittedAt = Number(effect.startedAt);
    const elapsed = now - (finite(admittedAt) ? admittedAt : now);
    if (elapsed < 0 || elapsed >= profile.duration) return null;
    return Object.freeze({ kind, image, elapsed, reduced: Boolean(reducedMotion),
      alpha: Math.min(alpha, 1), x: (player.x - camera.x) * zoom,
      y: (player.y - camera.y) * zoom, scale: zoom });
  }
  function pack(command) {
    const kind = command.kind;
    const p = PROFILES[kind];
    if (!p) throw new TypeError('Unknown body benefit');
    const width = 104;
    const height = kind === 'heal' ? 1672 * 104 / 941 : 156;
    const top = kind === 'overheal' ? -113 : kind === 'heal' ? 31 - 1400 * 104 / 941 :
      31 - 1386 * 104 / 1024;
    const pad = 14, visibleHeight = Math.ceil(height);
    const data = new Float32Array([
      command.x - (width / 2 + pad) * command.scale,
      command.y + (top - pad) * command.scale,
      (width + pad * 2) * command.scale,
      (visibleHeight + pad * 2) * command.scale,
      p.code, Math.max(0, Math.min(1, command.elapsed / p.duration)),
      command.reduced ? 1 : 0, command.alpha,
      width, visibleHeight, height, pad,
      kind === 'overheal' ? 0 : p.sourceWidth / TEXTURE_WIDTH,
      kind === 'overheal' ? 0 : p.sourceHeight / TEXTURE_HEIGHT, 0, 0
    ]);
    if (!data.every(finite)) throw new RangeError('Body benefit exceeds float32 range');
    return data;
  }
  function create({ renderer, frameOwner = renderer } = {}) {
    if (!frameOwner || frameOwner.state !== 'ready') throw new TypeError('Shared WebGPU frame owner required');
    const device = frameOwner.device, format = frameOwner.format;
    if (device.limits.maxTextureDimension2D < TEXTURE_HEIGHT) throw new RangeError('Body benefit texture exceeds GPU limit');
    const module = device.createShaderModule({ label: 'DVA shared body benefit WGSL', code: shader });
    const pipeline = device.createRenderPipeline({ label: 'DVA ordered body benefits', layout: 'auto',
      vertex: { module, entryPoint: 'vs' }, fragment: { module, entryPoint: 'fs', targets: [{ format,
        blend: { color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
          alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' } } }] },
      primitive: { topology: 'triangle-list' } });
    const texture = frameOwner.own(device.createTexture({ label: 'DVA authored body benefit sources',
      size: [TEXTURE_WIDTH, TEXTURE_HEIGHT, 2], format: 'rgba8unorm', usage: 0x04 | 0x02 | 0x10 }));
    const sampler = device.createSampler({ minFilter: 'linear', magFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge' });
    const images = new Map(), slots = [];
    const frameIndices = new WeakMap();
    let destroyed = false;
    function slot(index) {
      if (slots[index]) return slots[index];
      const uniform = frameOwner.own(device.createBuffer({ label: 'DVA body benefit viewport',
        size: 16, usage: 0x40 | 0x08 }));
      const storage = frameOwner.own(device.createBuffer({ label: 'DVA body benefit effect',
        size: FLOATS_PER_EFFECT * 4, usage: 0x80 | 0x08 }));
      const bindGroup = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [
        { binding: 0, resource: { buffer: uniform } },
        { binding: 1, resource: { buffer: storage } },
        { binding: 2, resource: texture.createView({ dimension: '2d-array' }) },
        { binding: 3, resource: sampler },
        { binding: 4, resource: texture.createView({ dimension: '2d-array' }) }
      ] });
      return (slots[index] = { uniform, storage, bindGroup });
    }
    function upload(kind, image) {
      if (kind === 'overheal') return true;
      if (!ready(image, kind)) return false;
      const identity = image.currentSrc || image.src || '';
      const previous = images.get(kind);
      if (previous?.image === image && previous.identity === identity) return true;
      const p = PROFILES[kind];
      device.queue.copyExternalImageToTexture({ source: image, flipY: false },
        { texture, origin: [0, 0, p.layer], premultipliedAlpha: true, colorSpace: 'srgb' },
        [p.sourceWidth, p.sourceHeight]);
      images.set(kind, { image, identity });
      return true;
    }
    function record({ frame, target, viewport, ...scene } = {}) {
      if (destroyed || frameOwner.state !== 'ready') throw new Error('Body benefit pass unavailable');
      if (typeof frame?.add !== 'function' || typeof target !== 'string' || !target ||
          ![viewport?.width, viewport?.height].every(value => finite(value) && value > 0) ||
          ![viewport?.pixelWidth, viewport?.pixelHeight].every(value => Number.isInteger(value) && value > 0)) {
        throw new TypeError('Body benefit requires an ordered frame and committed viewport');
      }
      const command = plan({ ...scene, viewport });
      if (!command) return false;
      upload(command.kind, command.image);
      const index = frameIndices.get(frame) || 0;
      const { uniform, storage, bindGroup } = slot(index);
      const packed = pack(command);
      device.queue.writeBuffer(uniform, 0, new Float32Array([
        viewport.width, viewport.height, viewport.pixelWidth, viewport.pixelHeight]));
      device.queue.writeBuffer(storage, 0, packed);
      frame.stage?.('world:body-benefit');
      frame.add({ target, label: `DVA ${command.kind} body benefit`, encode(pass, info) {
        if (info.device !== device || info.format !== format ||
            info.width !== viewport.pixelWidth || info.height !== viewport.pixelHeight) {
          throw new Error('Body benefit target device, format or backing size mismatch');
        }
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.draw(6, 1);
      } });
      frameIndices.set(frame, index + 1);
      return true;
    }
    return Object.freeze({ device, plan, record, upload, get state() {
      return destroyed ? 'destroyed' : frameOwner.state;
    }, destroy() {
      if (destroyed) return;
      destroyed = true;
      for (const resource of [texture, ...slots.flatMap(({ uniform, storage }) => [uniform, storage])]) {
        if (frameOwner.release(resource)) resource.destroy();
      }
      images.clear();
    } });
  }
  const api = Object.freeze({ PROFILES, shader, ready, plan, pack, create });
  root.DvaWebGPUBodyBenefitPass = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
