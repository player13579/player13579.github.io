/* Medical upload console E. The owner supplies canonical task state and the
 * shared WebGPU frame, device, clock and audio playback. No private loop. */
(function (root) {
  'use strict';
  const ROOM = Object.freeze({ x: 2200, y: 2520 });
  const STATION = Object.freeze({ id: 'upload-d', task: 'upload', x: 2694, y: 2910 });
  const ZONE = Object.freeze({ x: 421, y: 320, width: 116, height: 80 });
  const COMPLETE_MS = 750;
  const finite = Number.isFinite;
  const shader = /* wgsl */ `
struct Params { view:vec4f, world:vec4f, state:vec4f, shade:vec4f }
@group(0) @binding(0) var<uniform> p:Params;
struct Out { @builtin(position) position:vec4f, @location(0) local:vec2f }
@vertex fn vs(@builtin(vertex_index) i:u32)->Out {
 let c=array<vec2f,6>(vec2f(0.,0.),vec2f(1.,0.),vec2f(0.,1.),vec2f(0.,1.),vec2f(1.,0.),vec2f(1.,1.))[i];
 let local=vec2f(421.,320.)+c*vec2f(116.,80.);
 let screen=(p.world.xy+local-p.view.zw)*p.world.z;
 var o:Out;
 o.position=vec4f(screen/p.view.xy*vec2f(2.,-2.)+vec2f(-1.,1.),0.,1.);
 o.local=local;
 return o;
}
fn box(q:vec2f,c:vec2f,h:vec2f)->f32 {
 let d=abs(q-c)-h;
 return length(max(d,vec2f(0.)))+min(max(d.x,d.y),0.);
}
fn band(v:f32,c:f32,w:f32)->f32 { return 1.-smoothstep(w,w+1.5,abs(v-c)); }
fn visual(q:vec2f)->vec4f {
 let uploading=p.state.x;
 let progress=p.state.y;
 let complete=p.state.z;
 let age=p.state.w;
 let reduced=p.shade.y;
 let face=1.-smoothstep(-1.,1.,box(q,vec2f(479.5,330.5),vec2f(38.5,4.5)));
 let track=1.-smoothstep(-.5,1.5,box(q,vec2f(469.,330.),vec2f(27.,2.)));
 let fill=track*(1.-smoothstep(-1.,1.,q.x-(442.+54.*progress)));
 let span=smoothstep(325.,327.,q.y)*(1.-smoothstep(333.,335.,q.y));
 let carriage=band(q.x,442.+54.*progress,2.2)*span*face;
 let centerSpan=smoothstep(451.,455.,q.x)*(1.-smoothstep(485.,489.,q.x));
 let idle=band(q.y,330.,1.0)*centerSpan*face;
 let success=band(q.y,330.,2.0)*centerSpan*face;
 let release=1.-smoothstep(.30,.75,age);
 let core=face*(idle*.11*(1.-uploading)*(1.-complete)+fill*.72*uploading+carriage*.51*uploading+success*.70*complete*release);
 let halo=exp(-pow((q.x-469.)/46.,2.)-pow((q.y-330.)/11.,2.))*(uploading*.085+complete*.18*release);
 let flicker=select(.94+.06*sin(p.world.w*6.),1.,reduced>.5);
 let color=mix(vec3f(.24,.62,.66),vec3f(.73,1.,.78),complete);
 return vec4f(color*(core*flicker+halo)*p.shade.x,0.);
}
@fragment fn fs(o:Out)->@location(0) vec4f { return visual(o.local); }
`;
  function stationValid(station) {
    return station?.id === STATION.id && station.type === 'task' &&
      station.task === STATION.task && station.x === STATION.x && station.y === STATION.y;
  }
  function taskValid(task) {
    return task?.stationId === STATION.id && task.type === STATION.task &&
      typeof task.done === 'boolean';
  }
  function completionValid(effect) {
    return effect?.type === 'action-task' && effect.mode === STATION.task &&
      effect.targetId === STATION.id && typeof effect.id === 'string' && !!effect.id &&
      [effect.startedAt, effect.duration, effect.targetX, effect.targetY].every(finite) &&
      effect.duration > 0 && effect.targetX === STATION.x && effect.targetY === STATION.y;
  }
  function plan({ station, task, activeUpload, completion, camera, zoom, viewport,
    now, intensity = 1, reducedMotion = false } = {}) {
    if (!camera || !viewport || ![camera.x,camera.y,zoom,viewport.width,viewport.height,now,intensity].every(finite) ||
      zoom <= 0 || viewport.width <= 0 || viewport.height <= 0 || now < 0 || intensity < 0 || intensity > 1)
      throw new TypeError('Upload console E needs a valid world view');
    if (!stationValid(station)) throw new TypeError('Upload console E needs exact upload-d station');
    if (task != null && !taskValid(task)) throw new TypeError('Upload console E needs canonical upload-d task');
    if (activeUpload != null && (activeUpload.stationId !== STATION.id ||
      typeof activeUpload.id !== 'string' || !activeUpload.id ||
      !finite(activeUpload.progress) || activeUpload.progress < 0 || activeUpload.progress > 1))
      throw new TypeError('Upload console E needs bounded upload-d progress');
    if (completion != null && !completionValid(completion))
      throw new TypeError('Upload console E needs exact upload-d completion event');
    const fresh = completion && now >= completion.startedAt &&
      now - completion.startedAt < Math.min(completion.duration, COMPLETE_MS);
    const active = !!(task && !task.done && activeUpload && activeUpload.progress < 1);
    const phase = fresh ? 'complete' : active ? 'active' : 'ready';
    if (!intensity) return null;
    const x = (ROOM.x + ZONE.x - camera.x) * zoom;
    const y = (ROOM.y + ZONE.y - camera.y) * zoom;
    if (x >= viewport.width || y >= viewport.height ||
      x + ZONE.width * zoom <= 0 || y + ZONE.height * zoom <= 0) return null;
    return Object.freeze({ stationId: STATION.id, phase,
      progress: active ? activeUpload.progress : 0,
      completionId: fresh ? completion.id : null,
      age: fresh ? (now - completion.startedAt) / 1000 : 0,
      x, y, width: ZONE.width * zoom, height: ZONE.height * zoom,
      camera: Object.freeze({ x: camera.x, y: camera.y }), zoom,
      now, intensity, reducedMotion: !!reducedMotion });
  }
  function planSfx({ completion, previousNow, now, audible = false, listener, radius = 600 } = {}) {
    if (![previousNow,now,radius].every(finite) || previousNow < 0 || now < previousNow || radius <= 0 ||
      (listener && ![listener.x,listener.y].every(finite)))
      throw new TypeError('Invalid upload console sound interval');
    if (!completion) return Object.freeze([]);
    if (!completionValid(completion)) throw new TypeError('Upload console E needs exact upload-d completion event');
    if (!audible || !listener || now - previousNow > 250 ||
      !(previousNow < completion.startedAt && completion.startedAt <= now) ||
      (listener.x - STATION.x) ** 2 + (listener.y - STATION.y) ** 2 > radius ** 2)
      return Object.freeze([]);
    return Object.freeze([Object.freeze({ id: `medical:upload-d:${completion.id}`,
      stationId: STATION.id, x: STATION.x, y: STATION.y,
      frequencyFrom: 420, frequencyTo: 760, duration: .18, gain: .012, waveform: 'sine' })]);
  }
  function create({ device, format } = {}) {
    if (!device?.createShaderModule || !device?.createRenderPipeline || !device?.createBuffer ||
      !device?.createBindGroup || !device?.queue?.writeBuffer || typeof format !== 'string' || !format)
      throw new TypeError('Upload console E needs shared WebGPU device and format');
    const module = device.createShaderModule({ label: 'DVA medical upload console E', code: shader });
    const pipeline = device.createRenderPipeline({ label: 'DVA medical upload console emission', layout: 'auto',
      vertex: { module, entryPoint: 'vs' }, fragment: { module, entryPoint: 'fs', targets: [{ format,
        blend: { color: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
          alpha: { srcFactor: 'zero', dstFactor: 'one', operation: 'add' } } }] },
      primitive: { topology: 'triangle-list' } });
    const uniform = device.createBuffer({ label: 'DVA upload console E state', size: 64, usage: 0x40 | 0x08 });
    const bind = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniform } }] });
    let destroyed = false;
    return Object.freeze({ device, get ready() { return !destroyed; },
      record({ frame, target, viewport, planned, ...inputs } = {}) {
        if (destroyed) throw new Error('Upload console E pass destroyed');
        const result = planned === undefined ? plan({ viewport, ...inputs }) : planned;
        if (!result) return Object.freeze({ drawn: false });
        if (!frame || typeof frame.stage !== 'function' || typeof frame.add !== 'function' ||
          typeof target !== 'string' || !target || !viewport ||
          ![viewport.width,viewport.height,viewport.pixelWidth,viewport.pixelHeight].every(v => Number.isInteger(v) && v > 0) ||
          result.stationId !== STATION.id || !['ready','active','complete'].includes(result.phase) ||
          !result.camera || ![result.camera.x,result.camera.y,result.zoom,result.now,result.progress,result.age,result.intensity].every(finite))
          throw new TypeError('Invalid shared WebGPU upload console frame');
        device.queue.writeBuffer(uniform, 0, new Float32Array([
          viewport.width,viewport.height,result.camera.x,result.camera.y,
          ROOM.x,ROOM.y,result.zoom,result.now / 1000,
          result.phase === 'active' ? 1 : 0,result.progress,result.phase === 'complete' ? 1 : 0,result.age,
          result.intensity,result.reducedMotion ? 1 : 0,0,0
        ]));
        frame.stage('world:medical-upload-console-e');
        frame.add({ target, label: 'world:medical-upload-console-e', encode(pass, info) {
          if (info.width !== viewport.pixelWidth || info.height !== viewport.pixelHeight)
            throw new Error('Upload console E backing dimensions differ from shared target');
          pass.setPipeline(pipeline); pass.setBindGroup(0, bind); pass.draw(6);
        } });
        return Object.freeze({ drawn: true, phase: result.phase, completionId: result.completionId });
      },
      destroy() { if (destroyed) return; destroyed = true; uniform.destroy(); }
    });
  }
  const api = Object.freeze({ ROOM, STATION, ZONE, COMPLETE_MS, shader, plan, planSfx, create });
  root.DvaWebGPUMedicalUploadConsoleE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
