/* Diagnostic-bed activation E for the shared WebGPU world frame.
 * The caller supplies an accepted successful-use event and owns the frame,
 * device, clock, audio playback, and lifecycle. No texture or private RAF. */
(function (root) {
  'use strict';

  const ROOM = Object.freeze({ x: 2200, y: 2520, width: 950, height: 780 });
  const OBJECT = Object.freeze({ id: 'v302-medical-diagnosticBed-1',
    type: 'relaxationBed', x: 2419, y: 2738 });
  const ZONE = Object.freeze({ x: 122, y: 138, width: 226, height: 148 });
  const DURATION_MS = 900;
  const finite = Number.isFinite;
  const shader = /* wgsl */ `
struct Params { view: vec4f, world: vec4f, effect: vec4f }
@group(0) @binding(0) var<uniform> params: Params;
struct Vertex { @builtin(position) position: vec4f, @location(0) local: vec2f }
@vertex fn vs(@builtin(vertex_index) index: u32) -> Vertex {
  let corner = array<vec2f, 6>(vec2f(0.0,0.0),vec2f(1.0,0.0),vec2f(0.0,1.0),
    vec2f(0.0,1.0),vec2f(1.0,0.0),vec2f(1.0,1.0))[index];
  let local=vec2f(122.0,138.0)+corner*vec2f(226.0,148.0);
  let screen=(params.world.xy+local-params.view.zw)*params.world.z;
  var out: Vertex;
  out.position=vec4f(screen/params.view.xy*vec2f(2.0,-2.0)+vec2f(-1.0,1.0),0.0,1.0);
  out.local=local;
  return out;
}
fn rr(p:vec2f,c:vec2f,h:vec2f,r:f32)->f32 {
  let q=abs(p-c)-h+vec2f(r);
  return length(max(q,vec2f(0.0)))+min(max(q.x,q.y),0.0)-r;
}
fn gate(t:f32,a:f32,b:f32,c:f32,d:f32)->f32 {
  return smoothstep(a,b,t)*(1.0-smoothstep(c,d,t));
}
fn sq(v:f32)->f32 { return v*v; }
fn line(y:f32,center:f32,width:f32)->f32 { return exp(-sq((y-center)/width)); }
struct Light { rail:f32, breath:f32, plate:f32, stream:f32, core:f32, tail:f32, glow:f32, bedHalo:f32, settle:f32, bed:f32 }
fn light(p:vec2f)->Light {
  var t=params.world.w*(3.35/0.9);
  if (params.effect.y>0.5) { t=2.35; }
  let railMask=1.0-smoothstep(-1.0,3.0,rr(p,vec2f(230.0,211.0),vec2f(92.0,53.0),12.0));
  let bed=1.0-smoothstep(-2.0,4.0,rr(p,vec2f(231.0,211.0),vec2f(80.0,37.0),15.0));
  let wake=gate(t,0.04,0.23,2.52,3.08);
  let span=smoothstep(142.0,155.0,p.x)*(1.0-smoothstep(305.0,318.0,p.x));
  let upper=line(p.y,163.0,10.0)*span;
  let lower=line(p.y,261.0,10.0)*span;
  let inward=clamp((t-0.27)/0.78,0.0,1.0);
  let breathUpper=line(p.y,167.0+inward*28.0,8.0)*bed;
  let breathLower=line(p.y,255.0-inward*28.0,8.0)*bed;
  let flowPhase=clamp((t-1.15)/1.48,0.0,1.0);
  let front=156.0+flowPhase*155.0;
  let angled=p.x-front+abs(p.y-211.0)*0.23;
  let flow=gate(t,1.16,1.34,2.58,2.92);
  var out:Light;
  out.rail=(upper+lower)*wake*railMask;
  out.breath=gate(t,0.30,0.45,1.04,1.38)*(breathUpper+breathLower);
  out.plate=gate(t,0.28,0.50,1.22,1.85)*
    exp(-sq((p.x-231.0)/72.0)-sq((p.y-211.0)/27.0))*bed;
  out.stream=flow*exp(-sq(angled/48.0))*bed;
  out.core=flow*exp(-sq(angled/24.0))*bed;
  out.tail=gate(t,1.50,1.72,2.83,3.14)*
    (line(p.y,189.0,5.0)+line(p.y,233.0,5.0))*bed*clamp((front-p.x)/48.0,0.0,1.0);
  out.glow=exp(-sq((p.x-front)/56.0)-sq((p.y-211.0)/60.0))*
    gate(t,1.17,1.36,2.64,2.96);
  out.bedHalo=exp(-sq((p.x-231.0)/116.0)-sq((p.y-211.0)/69.0))*
    gate(t,0.16,0.38,2.58,3.20);
  out.settle=gate(t,2.55,2.77,3.08,3.35)*line(p.y,211.0,15.0)*bed;
  out.bed=bed;
  return out;
}
@fragment fn fsBase(input:Vertex)->@location(0) vec4f {
  let e=light(input.local);
  let wake=gate(params.world.w*(3.35/0.9),0.17,0.38,2.84,3.23);
  var color=vec3f(0.20,0.58,0.52);
  color=mix(color,vec3f(0.82,1.0,0.32),
    clamp(e.rail*0.97+e.breath*0.75+e.plate*0.92,0.0,0.97));
  color=mix(color,vec3f(0.63,0.98,0.22),
    clamp(e.stream*0.91+e.tail*0.40,0.0,0.94));
  color=mix(color,vec3f(1.0,1.0,0.75),e.core*0.98);
  let alpha=clamp(e.bed*wake*0.40+e.rail*0.97+e.breath*0.75+
    e.plate*0.92+e.stream*0.91+e.tail*0.40+e.core*0.98,
    0.0,0.96)*params.effect.x;
  return vec4f(color,alpha);
}
@fragment fn fsGlow(input:Vertex)->@location(0) vec4f {
  let e=light(input.local);
  let railHalo=(exp(-sq((input.local.y-163.0)/17.0))+
    exp(-sq((input.local.y-261.0)/17.0)))*e.rail*0.34;
  let color=vec3f(0.50,0.93,0.20)*railHalo*1.65+
    vec3f(0.38,0.94,0.20)*e.glow*0.72+
    vec3f(0.35,0.61,0.13)*e.bedHalo*0.20+
    vec3f(0.22,0.72,0.52)*e.settle*0.16;
  return vec4f(color*params.effect.x,0.0);
}`;

  function validEffect(effect) {
    return effect?.type === `object-${OBJECT.type}` &&
      effect.objectId === OBJECT.id &&
      typeof effect.id === 'string' && effect.id.length > 0 &&
      [effect.x, effect.y, effect.startedAt].every(finite) &&
      Math.abs(effect.x - OBJECT.x) <= 1 && Math.abs(effect.y - OBJECT.y) <= 1 &&
      effect.startedAt >= 0;
  }

  function plan({ camera, zoom, viewport, now, effect, intensity = 1,
    reducedMotion = false } = {}) {
    if (!camera || !viewport || ![camera.x, camera.y, zoom,
      viewport.width, viewport.height, now, intensity].every(finite) ||
      zoom <= 0 || viewport.width <= 0 || viewport.height <= 0 ||
      now < 0 || intensity < 0 || intensity > 1) {
      throw new TypeError('Medical object E needs a camera, viewport, clock and intensity');
    }
    if (!effect) return null;
    if (!validEffect(effect)) throw new TypeError('Medical object E needs the exact diagnostic-bed use effect');
    const elapsed = now - effect.startedAt;
    if (elapsed < 0 || elapsed >= DURATION_MS || intensity === 0) return null;
    const x = (ROOM.x + ZONE.x - camera.x) * zoom;
    const y = (ROOM.y + ZONE.y - camera.y) * zoom;
    if (x >= viewport.width || y >= viewport.height ||
      x + ZONE.width * zoom <= 0 || y + ZONE.height * zoom <= 0) return null;
    return Object.freeze({ effectId: effect.id, elapsed, x, y,
      width: ZONE.width * zoom, height: ZONE.height * zoom,
      camera: Object.freeze({ x: camera.x, y: camera.y }), zoom,
      intensity, reducedMotion: Boolean(reducedMotion) });
  }

  // Return one cue on the accepted-use edge. The caller owns mute/verify,
  // listener state and actual synthesis or playback; no looping sound is made.
  function planSfx({ effect, previousNow, now, audible = false,
    listener, radius = 600 } = {}) {
    if (![previousNow, now, radius].every(finite) || previousNow < 0 ||
      now < previousNow || radius <= 0 ||
      (listener && ![listener.x, listener.y].every(finite)))
      throw new TypeError('Invalid medical object E sound interval');
    if (!effect) return Object.freeze([]);
    if (!validEffect(effect)) throw new TypeError('Medical object E needs the exact diagnostic-bed use effect');
    if (!audible || !listener || now - previousNow > 250 ||
      !(previousNow < effect.startedAt && effect.startedAt <= now)) return Object.freeze([]);
    const x = ROOM.x + 231, y = ROOM.y + 211;
    if ((listener.x - x) ** 2 + (listener.y - y) ** 2 > radius ** 2)
      return Object.freeze([]);
    return Object.freeze([Object.freeze({ id: `medical:diagnostic-bed:${effect.id}`,
      objectId: OBJECT.id, x, y, frequencyFrom: 190, frequencyTo: 430,
      duration: .26, gain: .014, waveform: 'sine' })]);
  }

  function create({ device, format } = {}) {
    if (!device?.createShaderModule || !device?.createRenderPipeline ||
      !device?.createBuffer || !device?.createBindGroup ||
      !device?.queue?.writeBuffer || typeof format !== 'string' || !format)
      throw new TypeError('Medical object E needs the shared WebGPU device and format');
    const module = device.createShaderModule({ label: 'DVA medical object E', code: shader });
    const base = device.createRenderPipeline({ label: 'DVA diagnostic bed surface',
      layout: 'auto', vertex: { module, entryPoint: 'vs' },
      fragment: { module, entryPoint: 'fsBase', targets: [{ format, blend: {
        color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
        alpha: { srcFactor: 'zero', dstFactor: 'one', operation: 'add' }
      } }] }, primitive: { topology: 'triangle-list' } });
    const glow = device.createRenderPipeline({ label: 'DVA diagnostic bed emissive light',
      layout: 'auto', vertex: { module, entryPoint: 'vs' },
      fragment: { module, entryPoint: 'fsGlow', targets: [{ format, blend: {
        color: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
        alpha: { srcFactor: 'zero', dstFactor: 'one', operation: 'add' }
      } }] }, primitive: { topology: 'triangle-list' } });
    const uniform = device.createBuffer({ label: 'DVA diagnostic bed E state',
      size: 48, usage: 0x40 | 0x08 }); // UNIFORM | COPY_DST
    const bindBase = device.createBindGroup({ layout: base.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniform } }] });
    const bindGlow = device.createBindGroup({ layout: glow.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniform } }] });
    let destroyed = false;
    return Object.freeze({
      device,
      get ready() { return !destroyed; },
      record({ frame, target, viewport, camera, zoom, now, effect,
        intensity = 1, reducedMotion = false, planned } = {}) {
        if (destroyed) throw new Error('Medical object E pass destroyed');
        const result = planned === undefined ? plan({ camera, zoom, viewport, now,
          effect, intensity, reducedMotion }) : planned;
        if (!result) return Object.freeze({ drawn: false });
        if (!frame || typeof frame.stage !== 'function' || typeof frame.add !== 'function' ||
          typeof target !== 'string' || !target || !viewport ||
          ![viewport.width, viewport.height, viewport.pixelWidth, viewport.pixelHeight]
            .every(value => Number.isInteger(value) && value > 0) ||
          !result.camera || ![result.camera.x, result.camera.y, result.zoom,
            result.elapsed, result.intensity].every(finite) ||
          result.zoom <= 0 || result.elapsed < 0 || result.elapsed >= DURATION_MS ||
          result.intensity < 0 || result.intensity > 1) {
          throw new TypeError('Invalid shared WebGPU medical object E frame');
        }
        device.queue.writeBuffer(uniform, 0, new Float32Array([
          viewport.width, viewport.height, result.camera.x, result.camera.y,
          ROOM.x, ROOM.y, result.zoom, result.elapsed / 1000,
          result.intensity, result.reducedMotion ? 1 : 0, 0, 0
        ]));
        frame.stage('world:medical-diagnostic-bed-e');
        for (const [pipeline, layer] of [[base, 'surface'], [glow, 'glow']]) {
          const bind = layer === 'surface' ? bindBase : bindGlow;
          frame.add({ target, label: `world:medical-diagnostic-bed-e:${layer}`,
            encode(pass, info) {
              if (info.width !== viewport.pixelWidth || info.height !== viewport.pixelHeight)
                throw new Error('Medical object E backing dimensions differ from shared target');
              pass.setPipeline(pipeline);
              pass.setBindGroup(0, bind);
              pass.draw(6);
            }
          });
        }
        return Object.freeze({ drawn: true, effectId: result.effectId, elapsed: result.elapsed });
      },
      destroy() { if (destroyed) return; destroyed = true; uniform.destroy(); }
    });
  }

  const api = Object.freeze({ ROOM, OBJECT, ZONE, DURATION_MS, shader, plan, planSfx, create });
  root.DvaWebGPUMedicalObjectE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
