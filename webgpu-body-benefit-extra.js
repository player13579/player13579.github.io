/* Textureless body-centred benefit phenomena for the shared WebGPU frame.
 * The application owns authoritative event admission, ordering and one-shot SFX. */
(function (root) {
  'use strict';

  const PROFILES = Object.freeze({
    luckBoost: Object.freeze({ type: 'gain-luckBoost', index: 0, durationMs: 1420,
      radiusX: 62, radiusY: 82, anchorY: 54 }),
    statusRecovery: Object.freeze({ type: 'gain-statusRecovery', index: 1, durationMs: 1380,
      radiusX: 58, radiusY: 78, anchorY: 52 }),
    cooldownReduction: Object.freeze({ type: 'gain-cooldownReduction', index: 2, durationMs: 1480,
      radiusX: 66, radiusY: 76, anchorY: 51 })
  });
  const finite = Number.isFinite;
  const EFFECT_KEYS = Object.freeze(Object.keys(PROFILES));
  const FLOATS_PER_PLAN = 12;

  const shader = /* wgsl */ `
struct Params { view: vec4f, geometry: vec4f, state: vec4f };
@group(0) @binding(0) var<uniform> p: Params;
struct Vertex { @builtin(position) position: vec4f };
@vertex fn vs(@builtin(vertex_index) index:u32)->Vertex {
  let corner=array<vec2f,3>(vec2f(-1.0,-1.0),vec2f(3.0,-1.0),vec2f(-1.0,3.0))[index];
  var out:Vertex; out.position=vec4f(corner,0.0,1.0); return out;
}
fn sq(x:f32)->f32{return x*x;}
fn bell(x:f32,w:f32)->f32{return exp(-sq(x)/max(sq(w),.0001));}
fn angularGap(a:f32,b:f32)->f32{return abs(atan2(sin(a-b),cos(a-b)));}
fn envelope(t:f32)->f32{return smoothstep(0.0,.075,t)*(1.0-smoothstep(.84,1.0,t));}
@fragment fn fs(@builtin(position) position:vec4f)->@location(0) vec4f {
  let q=(position.xy-p.view.zw)/max(p.geometry.xy,vec2f(.001));
  let t=clamp(p.state.x,0.0,1.0); let kind=p.state.y;
  let reduced=p.state.z>.5; let opacity=p.state.w;
  let quietT=select(t,.52,reduced);
  let alive=envelope(t)*opacity;
  var energy=0.0; var halo=0.0; var tint=vec3f(1.0,.72,.20);
  if(kind<.5){
    // Two broad golden orbital bands lift around the body; one bright leading
    // arc rises a full turn instead of reading as a static ring icon.
    let lift=quietT*.54;
    let local=vec2f(q.x,(q.y+lift)*.79);
    let radius=length(local); let angle=atan2(local.y,local.x);
    let winding=angle+quietT*6.2831853;
    let primary=.72+.075*sin(winding*1.35+p.geometry.w*6.28318);
    let secondary=.96+.045*sin(winding*1.35+2.1+p.geometry.w*6.28318);
    let orbitA=bell(radius-primary,.037);
    let orbitB=bell(radius-secondary,.031)*smoothstep(.12,.42,t);
    let head=bell(angularGap(angle,-1.57-quietT*6.2831853),.17)*bell(radius-primary,.09);
    let lowerTail=bell(angle-(-1.57-quietT*6.2831853)-.22,.36)*bell(radius-primary,.045);
    energy=orbitA*.75+orbitB*.42+head*.74+lowerTail*.34;
    halo=(orbitA*.31+orbitB*.20+head*.28+lowerTail*.13);
    tint=mix(vec3f(1.0,.49,.09),vec3f(1.0,.91,.43),clamp(head,0.0,1.0));
  }else if(kind<1.5){
    // A contaminated surface follows a restrained hourglass body contour,
    // then peels outward as broad sheets. A clear cyan rim remains behind it.
    let y=clamp(q.y,-1.0,1.0);
    let bodyWidth=select(mix(.18,.30,smoothstep(-.12,.18,y)),
      mix(.22,.34,smoothstep(.28,.62,y)),y>.28);
    let side=abs(q.x); let contour=abs(side-bodyWidth);
    let peel=smoothstep(.06,.76,quietT);
    let residueOffset=.035+peel*.35;
    let residueEdge=abs(contour-residueOffset);
    let vertical=smoothstep(-.89,-.72,y)*(1.0-smoothstep(.76,.93,y));
    let twoSheets=bell(residueEdge,.075)*vertical;
    let smear=bell(contour-residueOffset-.12,.17)*vertical;
    let departing=1.0-smoothstep(.51,.86,t);
    let clearRim=bell(contour,.026)*vertical*(.52+.48*smoothstep(.05,.36,t));
    let clearingGlow=bell(contour,.10)*vertical*(.28+.24*smoothstep(.22,.55,t));
    energy=twoSheets*departing*.92+smear*departing*.25+clearRim*.92;
    halo=twoSheets*departing*.32+clearRim*.44+clearingGlow*.55;
    tint=mix(vec3f(.31,.54,.38),vec3f(.28,.91,1.0),smoothstep(.27,.55,t));
  }else{
    // A single luminous time ring contracts to the body and carries one
    // unbroken travelling front around its circumference.
    let r=length(vec2f(q.x,q.y*.91));
    let convergence=smoothstep(.08,.79,quietT);
    let radius=mix(1.02,.54,convergence);
    let angle=atan2(q.y*.91,q.x);
    let turn=quietT*6.2831853-1.5707963;
    let front=bell(angularGap(angle,turn),.17);
    let trail=bell(angularGap(angle,turn-.27),.39);
    let ring=bell(r-radius,.033);
    let broadRing=bell(r-radius,.092);
    energy=ring*(.46+front*.95)+broadRing*(.17+trail*.22);
    halo=ring*.34+broadRing*.22+front*bell(r-radius,.14)*.25;
    tint=mix(vec3f(.25,.69,1.0),vec3f(.72,.94,1.0),clamp(front,0.0,1.0));
  }
  let source=clamp(energy*alive,0.0,.96);
  let glow=clamp(halo*alive,0.0,.34);
  let color=tint*source+mix(tint,vec3f(.82,.95,1.0),.34)*glow;
  let alpha=clamp(source+glow*.52,0.0,.98);
  return vec4f(color,alpha);
}`;

  function plan({ effect, player, now, phase, camera, zoom, viewport,
    reducedMotion = false, alpha = 1 } = {}) {
    if (!effect || !player || !['playing', 'meeting'].includes(phase) ||
        !player.alive || player.ejected || player.inVent || player.invisible) return null;
    const key = String(effect.type || '').replace(/^gain-/, '');
    const profile = PROFILES[key];
    if (!profile || effect.type !== profile.type ||
        effect.effectKind !== key || !finite(effect.startedAt) ||
        (effect.playerId != null && String(effect.playerId) !== String(player.id))) return null;
    if (!camera || !viewport || viewport.kind !== 'main' ||
        ![player.x, player.y, camera.x, camera.y, zoom, now, alpha,
          viewport.width, viewport.height, viewport.pixelWidth, viewport.pixelHeight].every(finite) ||
        zoom <= 0 || alpha <= 0 || alpha > 1 || viewport.width <= 0 || viewport.height <= 0 ||
        !Number.isInteger(viewport.pixelWidth) || !Number.isInteger(viewport.pixelHeight) ||
        viewport.pixelWidth <= 0 || viewport.pixelHeight <= 0) return null;
    // The server's `at` is retained as provenance. The app resets `startedAt`
    // on receipt so network delay cannot consume the visual before first draw.
    // It also supplies `duration = max(magicEffectDuration(type), durationMs)`.
    const eventDuration = finite(effect.duration) && effect.duration > 0 ? effect.duration :
      finite(effect.durationMs) && effect.durationMs > 0 ? effect.durationMs : profile.durationMs;
    const durationMs = Math.min(profile.durationMs, eventDuration);
    const elapsed = now - effect.startedAt;
    if (elapsed < 0 || elapsed >= durationMs) return null;
    const dprX = viewport.pixelWidth / viewport.width;
    const dprY = viewport.pixelHeight / viewport.height;
    const centerX = (player.x - camera.x) * zoom * dprX;
    const centerY = (player.y - profile.anchorY - camera.y) * zoom * dprY;
    const radiusX = profile.radiusX * zoom * dprX;
    const radiusY = profile.radiusY * zoom * dprY;
    if (![centerX, centerY, radiusX, radiusY].every(finite) || radiusX <= 0 || radiusY <= 0) return null;
    const paddingX = radiusX * 1.12, paddingY = radiusY * 1.12;
    if (centerX + paddingX < 0 || centerX - paddingX > viewport.pixelWidth ||
        centerY + paddingY < 0 || centerY - paddingY > viewport.pixelHeight) return null;
    return Object.freeze({
      effectId: String(effect.id || `${key}:${effect.at}`), kind: key,
      elapsed, durationMs, progress: elapsed / durationMs,
      reducedMotion: Boolean(reducedMotion), alpha,
      centerX, centerY, radiusX, radiusY,
      pixelWidth: viewport.pixelWidth, pixelHeight: viewport.pixelHeight
    });
  }

  function pack(planned) {
    if (!planned || !Object.hasOwn(PROFILES, planned.kind) ||
        ![planned.progress, planned.alpha, planned.centerX, planned.centerY,
          planned.radiusX, planned.radiusY, planned.pixelWidth, planned.pixelHeight].every(finite))
      throw new TypeError('A valid body benefit E plan is required');
    const profile = PROFILES[planned.kind];
    const data = new Float32Array([
      planned.pixelWidth, planned.pixelHeight, planned.centerX, planned.centerY,
      planned.radiusX, planned.radiusY, 0, profile.index,
      Math.min(1, Math.max(0, planned.progress)), profile.index,
      planned.reducedMotion ? 1 : 0, Math.min(1, Math.max(0, planned.alpha))
    ]);
    if (!data.every(finite)) throw new RangeError('Body benefit E values exceed float32 range');
    return data;
  }

  function create({ renderer, frameOwner = renderer } = {}) {
    if (frameOwner?.state !== 'ready' || !frameOwner.device?.createShaderModule ||
        !frameOwner.device?.queue?.writeBuffer || typeof frameOwner.own !== 'function' ||
        typeof frameOwner.release !== 'function' || typeof frameOwner.format !== 'string')
      throw new TypeError('Body benefit E requires the shared ready WebGPU frame owner');
    const device = frameOwner.device, format = frameOwner.format;
    const module = device.createShaderModule({ label: 'DVA textureless body benefit E WGSL', code: shader });
    const pipeline = device.createRenderPipeline({ label: 'DVA body benefit E', layout: 'auto',
      vertex: { module, entryPoint: 'vs' }, fragment: { module, entryPoint: 'fs', targets: [{ format,
        blend: { color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
          alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' } } }] },
      primitive: { topology: 'triangle-list' } });
    const slots = [], frameIndices = new WeakMap();
    let destroyed = false;
    function slot(index) {
      if (slots[index]) return slots[index];
      const uniform = frameOwner.own(device.createBuffer({ label: `DVA body benefit E ${index}`,
        size: FLOATS_PER_PLAN * 4, usage: 0x40 | 0x08 }));
      const bindGroup = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: uniform } }] });
      return (slots[index] = { uniform, bindGroup });
    }
    function record({ frame, target, viewport, planned } = {}) {
      if (destroyed || frameOwner.state !== 'ready') throw new Error('Body benefit E pass unavailable');
      if (typeof frame?.add !== 'function' || typeof frame?.stage !== 'function' ||
          typeof target !== 'string' || !target || !planned ||
          viewport?.pixelWidth !== planned.pixelWidth || viewport?.pixelHeight !== planned.pixelHeight ||
          viewport?.kind !== 'main')
        throw new TypeError('Body benefit E needs the current shared frame, target, viewport and plan');
      const index = frameIndices.get(frame) || 0;
      const { uniform, bindGroup } = slot(index);
      device.queue.writeBuffer(uniform, 0, pack(planned));
      frame.stage(`world:body-benefit-extra:${planned.effectId}`);
      frame.add({ target, label: `DVA body benefit E ${planned.effectId}`, encode(pass, info) {
        if (info.device !== device || info.format !== format ||
            info.width !== viewport.pixelWidth || info.height !== viewport.pixelHeight)
          throw new Error('Body benefit E target device, format or backing size mismatch');
        pass.setPipeline(pipeline); pass.setBindGroup(0, bindGroup); pass.draw(3);
      } });
      frameIndices.set(frame, index + 1);
      return Object.freeze({ effectId: planned.effectId, kind: planned.kind, drawn: true });
    }
    return Object.freeze({ device, plan, record, shader,
      get state() { return destroyed ? 'destroyed' : frameOwner.state; },
      destroy() {
        if (destroyed) return;
        destroyed = true;
        for (const item of slots) if (frameOwner.release(item.uniform)) item.uniform.destroy();
        slots.length = 0;
      }
    });
  }

  const api = Object.freeze({ PROFILES, EFFECT_KEYS, shader, plan, pack, create });
  root.DvaWebGPUBodyBenefitExtra = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
