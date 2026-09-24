/* Successful footbath-use E. The caller owns the shared WebGPU frame, clock,
 * accepted event, audio playback, and lifecycle. The ambient bath is separate. */
(function (root) {
  'use strict';

  const ROOM = Object.freeze({ x: 2200, y: 2520, width: 950, height: 780 });
  const OBJECT = Object.freeze({ id: 'v302-medical-sterilizer-3', type: 'footBath', x: 2428, y: 3089 });
  const ZONE = Object.freeze({ x: 143, y: 458, width: 166, height: 135 });
  const DURATION_MS = 1050;
  const finite = Number.isFinite;
  const shader = /* wgsl */ `
struct Params { view: vec4f, world: vec4f, effect: vec4f }
@group(0) @binding(0) var<uniform> params: Params;
struct Vertex { @builtin(position) position: vec4f, @location(0) local: vec2f }
@vertex fn vs(@builtin(vertex_index) index: u32) -> Vertex {
  let corner=array<vec2f,6>(vec2f(0,0),vec2f(1,0),vec2f(0,1),
    vec2f(0,1),vec2f(1,0),vec2f(1,1))[index];
  let local=vec2f(143.0,458.0)+corner*vec2f(166.0,135.0);
  let screen=(params.world.xy+local-params.view.zw)*params.world.z;
  var out:Vertex;
  out.position=vec4f(screen/params.view.xy*vec2f(2.0,-2.0)+vec2f(-1.0,1.0),0.0,1.0);
  out.local=local;
  return out;
}
fn sq(x:f32)->f32 { return x*x; }
fn gate(t:f32,a:f32,b:f32,c:f32,d:f32)->f32 {
  return smoothstep(a,b,t)*(1.0-smoothstep(c,d,t));
}
fn roundedRect(p:vec2f,c:vec2f,h:vec2f,r:f32)->f32 {
  let q=abs(p-c)-h+vec2f(r);
  return length(max(q,vec2f(0.0)))+min(max(q.x,q.y),0.0)-r;
}
struct Light { water:f32, front:f32, cleanse:f32, relief:f32, halo:f32 }
fn light(p:vec2f)->Light {
  let t=params.world.w;
  let bath=1.0-smoothstep(-1.0,3.0,
    roundedRect(p,vec2f(226.0,531.0),vec2f(62.0,35.0),12.0));
  let wake=gate(t,0.02,0.13,0.72,0.94);
  let travel=smoothstep(0.13,0.62,t);
  let radial=length((p-vec2f(226.0,531.0))/vec2f(65.0,38.0));
  let expanding=exp(-sq((radial-(0.10+travel*1.02))/0.18));
  let wash=exp(-sq((p.x-(174.0+travel*104.0))/24.0))*bath;
  let settle=gate(t,0.60,0.76,0.91,1.05);
  var out:Light;
  out.water=bath*wake*(0.25+0.28*exp(-sq(radial/0.80)));
  out.front=(expanding*0.72+wash*0.54)*bath*gate(t,0.13,0.22,0.65,0.81);
  // A broad, upward cleansing column grows from the water, then folds back in.
  let rise=select(24.0*smoothstep(0.27,0.62,t),18.0,params.effect.y>0.5);
  let column=exp(-sq((p.x-226.0)/31.0)) *
    exp(-sq((p.y-(522.0-rise))/25.0));
  out.cleanse=column*gate(t,0.26,0.40,0.70,0.90);
  // The final cool band crosses the bath once; it never loops at idle.
  out.relief=exp(-sq((p.y-(527.0+7.0*smoothstep(0.68,0.93,t)))/8.0))*
    exp(-sq((p.x-226.0)/55.0))*settle*bath;
  out.halo=exp(-sq((p.x-226.0)/85.0)-sq((p.y-522.0)/50.0))*
    gate(t,0.10,0.25,0.77,1.01);
  return out;
}
@fragment fn fsBase(input:Vertex)->@location(0) vec4f {
  let e=light(input.local);
  let color=mix(vec3f(0.12,0.50,0.56),vec3f(0.42,0.94,0.82),
    clamp(e.front+e.cleanse*0.60,0.0,1.0));
  let cool=mix(color,vec3f(0.73,0.96,1.0),clamp(e.relief*0.75,0.0,1.0));
  let alpha=clamp(e.water*0.48+e.front*0.70+e.cleanse*0.43+
    e.relief*0.55,0.0,0.90)*params.effect.x;
  return vec4f(cool,alpha);
}
@fragment fn fsGlow(input:Vertex)->@location(0) vec4f {
  let e=light(input.local);
  let color=vec3f(0.20,0.73,0.68)*e.halo*0.28+
    vec3f(0.36,0.86,0.68)*e.front*0.30+
    vec3f(0.39,0.92,0.77)*e.cleanse*0.34+
    vec3f(0.30,0.66,0.82)*e.relief*0.16;
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
      now < 0 || intensity < 0 || intensity > 1)
      throw new TypeError('Footbath use E needs a camera, viewport, clock and intensity');
    if (!effect) return null;
    if (!validEffect(effect)) throw new TypeError('Footbath use E needs the exact accepted object event');
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

  // One gentle water-to-clear-tone cue on the event edge. The caller applies
  // its audio settings and verify-mode mute, deduplicates by id, and plays it.
  function planSfx({ effect, previousNow, now, audible = false,
    listener, radius = 600 } = {}) {
    if (![previousNow, now, radius].every(finite) || previousNow < 0 ||
      now < previousNow || radius <= 0 ||
      (listener && ![listener.x, listener.y].every(finite)))
      throw new TypeError('Invalid footbath use E sound interval');
    if (!effect) return Object.freeze([]);
    if (!validEffect(effect)) throw new TypeError('Footbath use E needs the exact accepted object event');
    if (!audible || !listener || now - previousNow > 250 ||
      !(previousNow < effect.startedAt && effect.startedAt <= now)) return Object.freeze([]);
    const x = ROOM.x + 226, y = ROOM.y + 531;
    if ((listener.x - x) ** 2 + (listener.y - y) ** 2 > radius ** 2)
      return Object.freeze([]);
    return Object.freeze([Object.freeze({ id: `medical:footbath-use:${effect.id}`,
      objectId: OBJECT.id, x, y, frequencyFrom: 270, frequencyTo: 520,
      duration: .34, gain: .012, waveform: 'sine', noise: true })]);
  }

  function create({ device, format } = {}) {
    if (!device?.createShaderModule || !device?.createRenderPipeline ||
      !device?.createBuffer || !device?.createBindGroup ||
      !device?.queue?.writeBuffer || typeof format !== 'string' || !format)
      throw new TypeError('Footbath use E needs the shared WebGPU device and format');
    const module = device.createShaderModule({ label: 'DVA footbath use E', code: shader });
    function pipeline(label, entryPoint, blendColor) {
      return device.createRenderPipeline({ label, layout: 'auto',
        vertex: { module, entryPoint: 'vs' },
        fragment: { module, entryPoint, targets: [{ format, blend: {
          color: { ...blendColor, operation: 'add' },
          alpha: { srcFactor: 'zero', dstFactor: 'one', operation: 'add' }
        } }] }, primitive: { topology: 'triangle-list' } });
    }
    const base = pipeline('DVA footbath use water', 'fsBase',
      { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha' });
    const glow = pipeline('DVA footbath use emissive relief', 'fsGlow',
      { srcFactor: 'one', dstFactor: 'one' });
    const uniform = device.createBuffer({ label: 'DVA footbath use E state',
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
        if (destroyed) throw new Error('Footbath use E pass destroyed');
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
          result.intensity < 0 || result.intensity > 1)
          throw new TypeError('Invalid shared WebGPU footbath use E frame');
        device.queue.writeBuffer(uniform, 0, new Float32Array([
          viewport.width, viewport.height, result.camera.x, result.camera.y,
          ROOM.x, ROOM.y, result.zoom, result.elapsed / 1000,
          result.intensity, result.reducedMotion ? 1 : 0, 0, 0
        ]));
        frame.stage('world:medical-footbath-use-e');
        for (const [passPipeline, bind, layer] of
          [[base, bindBase, 'water'], [glow, bindGlow, 'glow']]) {
          frame.add({ target, label: `world:medical-footbath-use-e:${layer}`,
            encode(pass, info) {
              if (info.width !== viewport.pixelWidth || info.height !== viewport.pixelHeight)
                throw new Error('Footbath use E backing dimensions differ from shared target');
              pass.setPipeline(passPipeline);
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
  root.DvaWebGPUMedicalFootbathUseE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
