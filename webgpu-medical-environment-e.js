/* Medical-room environmental E for the shared, ordered WebGPU world frame.
 * The accepted sparse room art is at world (2200,2520), size 950x780.
 * This pass creates no image, canvas, device, frame clock, RAF, or audio node.
 * Record it after the authored field and before world characters. */
(function (root) {
  'use strict';

  const ROOM = Object.freeze({ x: 2200, y: 2520, width: 950, height: 780 });
  const MODES = Object.freeze({ bath: 0, balanced: 1, rich: 2 });
  const CUES = Object.freeze([
    Object.freeze({ id: 'bath', tier: 0, period: 8000, offset: 0, frequency: 180, duration: .38, gain: .004, noise: true }),
    Object.freeze({ id: 'daylight', tier: 1, period: 13000, offset: 0, frequency: 280, duration: .42, gain: .002, noise: true })
  ]);
  const finite = Number.isFinite;
  const shader = /* wgsl */ `
struct Params { view: vec4f, world: vec4f, effect: vec4f }
@group(0) @binding(0) var<uniform> params: Params;
struct Vertex { @builtin(position) position: vec4f, @location(0) local: vec2f }
@vertex fn vs(@builtin(vertex_index) index: u32) -> Vertex {
  let corner = array<vec2f, 6>(vec2f(0,0),vec2f(1,0),vec2f(0,1),
    vec2f(0,1),vec2f(1,0),vec2f(1,1))[index];
  let screen = (params.world.xy - params.view.zw + corner * vec2f(950.0,780.0)) * params.world.z;
  var out: Vertex;
  out.position = vec4f(screen / params.view.xy * vec2f(2.0,-2.0) + vec2f(-1.0,1.0),0.0,1.0);
  out.local = corner * vec2f(950.0,780.0);
  return out;
}
fn roundedRect(p: vec2f, center: vec2f, halfSize: vec2f, radius: f32) -> f32 {
  let q = abs(p-center)-halfSize+vec2f(radius);
  return length(max(q,vec2f(0.0))) + min(max(q.x,q.y),0.0)-radius;
}
fn hash(p: vec2f) -> f32 { return fract(sin(dot(p,vec2f(127.1,311.7)))*43758.5453); }
fn noise(p0: vec2f) -> f32 {
  let i=floor(p0); let f=fract(p0); let u=f*f*(vec2f(3.0)-2.0*f);
  return mix(mix(hash(i),hash(i+vec2f(1.0,0.0)),u.x),
    mix(hash(i+vec2f(0.0,1.0)),hash(i+vec2f(1.0,1.0)),u.x),u.y);
}
fn oval(p: vec2f, center: vec2f, radii: vec2f) -> f32 { return length((p-center)/radii); }
fn pulse(t: f32, period: f32, width: f32) -> f32 {
  return 1.0-smoothstep(0.0,width,fract(t/period));
}
@fragment fn fs(in: Vertex) -> @location(0) vec4f {
  let p=in.local;
  let t=params.world.w;
  let intensity=params.effect.y;
  let reduced=params.effect.z > 0.5;
  let flow=p*vec2f(0.105,0.155)+vec2f(t*0.23,-t*0.31);
  let n=noise(flow)+0.45*noise(flow*2.1+vec2f(t*0.08,0.0));
  let d=roundedRect(p,vec2f(226.0,531.0),vec2f(63.0,37.0),12.0);
  let water=1.0-smoothstep(-1.5,2.0,d);
  let bands=pow(max(0.0,sin(p.x*0.18+p.y*0.12+t*1.8+n*3.0)),8.0);
  let ripples=pow(max(0.0,sin(length((p-vec2f(224.0,531.0))*vec2f(0.78,1.0))*0.22-t*2.5)),12.0);
  let shimmer=(0.035+0.16*bands+0.085*ripples)*(1.0+0.14*pulse(t,8.0,0.16))*water;
  var color=vec3f(0.26,0.78,0.88)*shimmer;
  for (var j=0; j<3; j=j+1) {
    let fj=f32(j);
    let lift=select(fract(t*0.105+fj*0.31),0.52,reduced);
    let y=487.0-lift*34.0;
    let x=198.0+fj*25.0+sin(t*1.2+fj*2.0+lift*3.0)*4.0;
    let dx=abs(p.x-x-sin((p.y-y)*0.11+t+fj)*2.0);
    let fade=(1.0-smoothstep(482.0,489.0,y))*smoothstep(452.0,460.0,y);
    color += vec3f(0.70,0.90,0.94)*exp(-dx*dx/7.5)*exp(-pow((p.y-y)/13.0,2.0))*fade*0.11;
  }
  if (params.effect.x >= 1.0) {
    let windowMask=1.0-smoothstep(0.0,3.0,roundedRect(p,vec2f(600.0,32.0),vec2f(195.0,20.0),3.0));
    let daylight=(0.45+0.45*noise(p*0.031+vec2f(t*0.11,-t*0.07))+0.10*pulse(t,13.0,0.13))*windowMask;
    color += vec3f(0.17,0.22,0.15)*daylight*0.24;
    let sill=1.0-smoothstep(0.0,2.5,roundedRect(p,vec2f(600.0,61.0),vec2f(182.0,2.0),1.0));
    color += vec3f(0.48,0.54,0.35)*sill*(0.35+0.65*daylight)*0.07;
    let floorPatchA=exp(-pow(oval(p,vec2f(551.0,264.0),vec2f(84.0,57.0)),2.0)*2.2);
    let floorPatchB=exp(-pow(oval(p,vec2f(735.0,304.0),vec2f(69.0,50.0)),2.0)*2.2);
    let leafShade=0.42+0.58*noise(p*0.035+vec2f(t*0.13,-t*0.09));
    let floorLight=(floorPatchA+floorPatchB)*leafShade*(0.82+0.18*pulse(t,13.0,0.13));
    color += vec3f(0.50,0.32,0.09)*floorLight*0.78;
  }
  // Premultiplied additive light; the destination alpha is preserved by the pipeline.
  return vec4f(color*intensity,0.0);
}`;

  function plan({ camera, zoom, viewport, now, mode = 'balanced', intensity = .65,
    reducedMotion = false } = {}) {
    if (!camera || !viewport || ![camera.x, camera.y, zoom, now,
      viewport.width, viewport.height, intensity].every(finite) ||
      zoom <= 0 || viewport.width <= 0 || viewport.height <= 0 ||
      now < 0 || intensity < 0 || intensity > 1 || !Object.hasOwn(MODES, mode)) {
      throw new TypeError('Medical environment E needs a camera, viewport, clock, and valid mode');
    }
    const x = (ROOM.x - camera.x) * zoom;
    const y = (ROOM.y - camera.y) * zoom;
    const width = ROOM.width * zoom, height = ROOM.height * zoom;
    if (!intensity || x >= viewport.width || y >= viewport.height ||
      x + width <= 0 || y + height <= 0) return null;
    return Object.freeze({ x, y, width, height, mode, modeIndex: MODES[mode],
      intensity, reducedMotion: Boolean(reducedMotion), now,
      camera: Object.freeze({ x: camera.x, y: camera.y }), zoom });
  }

  // The caller owns proximity, mute/verify state, clock, scheduling, and playback.
  // At most one event of each kind is returned per frame, only for a recent edge.
  function planSfx({ previousNow, now, mode = 'balanced', audible = false,
    listener, radius = 660 } = {}) {
    if (![previousNow, now, radius].every(finite) || previousNow < 0 || now < previousNow ||
      radius <= 0 || !Object.hasOwn(MODES, mode) ||
      (listener && ![listener.x, listener.y].every(finite))) {
      throw new TypeError('Invalid medical environment E sound interval');
    }
    if (!audible || !listener || now - previousNow > 250 || now === previousNow) return Object.freeze([]);
    const dx = listener.x - (ROOM.x + ROOM.width / 2);
    const dy = listener.y - (ROOM.y + ROOM.height / 2);
    if (dx * dx + dy * dy > radius * radius) return Object.freeze([]);
    return Object.freeze(CUES.filter(cue => cue.tier <= MODES[mode] &&
      Math.floor((previousNow + cue.offset) / cue.period) <
      Math.floor((now + cue.offset) / cue.period)).map(cue => Object.freeze({
      id: `medical:${cue.id}`, x: ROOM.x + ROOM.width / 2,
      y: ROOM.y + ROOM.height / 2, frequency: cue.frequency,
      duration: cue.duration, gain: cue.gain, noise: cue.noise
    })));
  }

  function create({ device, format } = {}) {
    if (!device?.createShaderModule || !device?.createRenderPipeline ||
      !device?.createBuffer || !device?.createBindGroup || !device?.queue?.writeBuffer ||
      typeof format !== 'string' || !format) {
      throw new TypeError('Medical environment E needs the shared WebGPU device and format');
    }
    const module = device.createShaderModule({ label: 'DVA medical environment E', code: shader });
    const pipeline = device.createRenderPipeline({
      label: 'DVA medical environment additive light', layout: 'auto',
      vertex: { module, entryPoint: 'vs' },
      fragment: { module, entryPoint: 'fs', targets: [{ format, blend: {
        color: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
        alpha: { srcFactor: 'zero', dstFactor: 'one', operation: 'add' }
      } }] }, primitive: { topology: 'triangle-list' }
    });
    const uniform = device.createBuffer({ label: 'DVA medical environment state',
      size: 48, usage: 0x40 | 0x08 }); // UNIFORM | COPY_DST
    const bind = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniform } }] });
    let destroyed = false;
    return Object.freeze({
      device,
      record({ frame, target, viewport, camera, zoom, now, mode = 'balanced',
        intensity = .65, reducedMotion = false, planned } = {}) {
        if (destroyed) throw new Error('Medical environment E pass destroyed');
        const result = planned === undefined ? plan({ camera, zoom, viewport, now,
          mode, intensity, reducedMotion }) : planned;
        if (!result) return Object.freeze({ drawn: false });
        if (!frame || typeof frame.stage !== 'function' || typeof frame.add !== 'function' ||
          typeof target !== 'string' || !target || !viewport ||
          ![viewport.width, viewport.height, viewport.pixelWidth, viewport.pixelHeight]
            .every(value => Number.isInteger(value) && value > 0) ||
          !result.camera || ![result.camera.x, result.camera.y, result.zoom].every(finite) ||
          result.zoom <= 0 ||
          result.modeIndex !== MODES[result.mode] || ![result.now, result.intensity].every(finite)) {
          throw new TypeError('Invalid shared WebGPU medical environment E frame');
        }
        device.queue.writeBuffer(uniform, 0, new Float32Array([
          viewport.width, viewport.height, result.camera.x, result.camera.y,
          ROOM.x, ROOM.y, result.zoom, result.now / 1000,
          result.modeIndex, result.intensity, result.reducedMotion ? 1 : 0, 0
        ]));
        frame.stage('world:medical-environment-e');
        frame.add({ target, label: 'world:medical-environment-e',
          encode(pass, info) {
            if (info.width !== viewport.pixelWidth || info.height !== viewport.pixelHeight) {
              throw new Error('Medical E backing dimensions differ from shared target');
            }
            pass.setPipeline(pipeline);
            pass.setBindGroup(0, bind);
            pass.draw(6);
          }
        });
        return Object.freeze({ drawn: true, mode: result.mode });
      },
      destroy() { if (destroyed) return; destroyed = true; uniform.destroy(); }
    });
  }

  const api = Object.freeze({ ROOM, MODES, CUES, shader, plan, planSfx, create });
  root.DvaWebGPUMedicalEnvironmentE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
