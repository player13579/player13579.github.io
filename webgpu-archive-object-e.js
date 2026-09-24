/* Archive fixture E for the shared WebGPU world frame. Candidate standalone
 * module: no image, Canvas 2D, private RAF, audio playback or gameplay change.
 * The caller owns successful-use events, the shared frame/device and SFX IDs. */
(function (root) {
  'use strict';

  const ROOM = Object.freeze({ x: 80, y: 180, width: 1100, height: 660 });
  const OBJECTS = Object.freeze([
    Object.freeze({ id: 'v302-archive-bookshelf-1', type: 'bookshelf', key: 'index-lectern',
      x: 333, y: 365, zone: Object.freeze({ x: 168, y: 100, width: 170, height: 170 }),
      durationMs: 800, idlePeriodMs: 11300, idleOffsetMs: 0, idleDurationMs: 1450 }),
    Object.freeze({ id: 'v302-archive-archiveCabinet-2', type: 'archiveCabinet', key: 'preservation-arch',
      x: 916, y: 365, zone: Object.freeze({ x: 749, y: 95, width: 175, height: 180 }),
      durationMs: 1000, idlePeriodMs: 13700, idleOffsetMs: 4300, idleDurationMs: 1600 }),
    Object.freeze({ id: 'v302-archive-readingLamp-3', type: 'readingLamp', key: 'microfilm-reader',
      x: 344, y: 662, zone: Object.freeze({ x: 169, y: 390, width: 190, height: 190 }),
      durationMs: 940, idlePeriodMs: 16700, idleOffsetMs: 7700, idleDurationMs: 1500 })
  ]);
  const finite = Number.isFinite;
  const shader = /* wgsl */ `
struct Params { view: vec4f, world: vec4f, effect: vec4f }
@group(0) @binding(0) var<uniform> params: Params;
struct Vertex { @builtin(position) position: vec4f, @location(0) local: vec2f }
fn zone(index: f32) -> vec4f {
  if (index < 0.5) { return vec4f(168.0, 100.0, 170.0, 170.0); }
  if (index < 1.5) { return vec4f(749.0, 95.0, 175.0, 180.0); }
  return vec4f(169.0, 390.0, 190.0, 190.0);
}
@vertex fn vs(@builtin(vertex_index) index: u32) -> Vertex {
  let corner = array<vec2f, 6>(vec2f(0.0,0.0),vec2f(1.0,0.0),vec2f(0.0,1.0),
    vec2f(0.0,1.0),vec2f(1.0,0.0),vec2f(1.0,1.0))[index];
  let z=zone(params.effect.z);
  let local=z.xy+corner*z.zw;
  let screen=(params.world.xy+local-params.view.zw)*params.world.z;
  var out: Vertex;
  out.position=vec4f(screen/params.view.xy*vec2f(2.0,-2.0)+vec2f(-1.0,1.0),0.0,1.0);
  out.local=local;
  return out;
}
fn sq(v:f32)->f32 { return v*v; }
fn band(v:f32,c:f32,w:f32)->f32 { return exp(-sq((v-c)/w)); }
fn gate(t:f32,a:f32,b:f32,c:f32,d:f32)->f32 {
  return smoothstep(a,b,t)*(1.0-smoothstep(c,d,t));
}
fn rr(p:vec2f,c:vec2f,h:vec2f,r:f32)->f32 {
  let q=abs(p-c)-h+vec2f(r);
  return length(max(q,vec2f(0.0)))+min(max(q.x,q.y),0.0)-r;
}
struct Light { base: vec3f, alpha: f32, glow: vec3f }
fn light(p:vec2f)->Light {
  var t=params.world.w;
  if (params.effect.y>0.5) { t=0.58; }
  let idle=params.effect.w>0.5;
  let level=select(1.0,0.34,idle);
  var out:Light;
  if (params.effect.z<0.5) {
    // One accession folio: three page edges receive a coherent travelling scan.
    let folio=1.0-smoothstep(-1.5,3.0,rr(p,vec2f(253.0,185.0),vec2f(64.0,41.0),6.0));
    let pages=band(p.y,158.0,2.5)+band(p.y,181.0,2.5)+band(p.y,204.0,2.5);
    let front=194.0+clamp(t,0.0,1.0)*118.0;
    let scan=band(p.x,front,7.0)*folio*pages;
    let guide=band(p.x,201.0,2.0)*band(p.y,181.0,45.0)*folio;
    let wake=select(gate(t,0.02,0.13,0.81,1.0),gate(t,0.04,0.26,0.62,0.95),idle);
    let core=scan*wake*level;
    let edge=(pages*folio*0.12+guide*0.22)*wake*level;
    out.base=vec3f(1.0,0.69,0.23)*edge+vec3f(1.0,0.92,0.53)*core;
    out.alpha=clamp(edge+core*0.95,0.0,0.95);
    out.glow=vec3f(0.94,0.39,0.06)*band(p.x,front,22.0)*
      band(p.y,181.0,50.0)*folio*wake*level*0.62+
      vec3f(0.67,0.25,0.02)*guide*wake*level*0.12;
    return out;
  }
  if (params.effect.z<1.5) {
    // A suspended sheet changes phase behind a downward climate boundary.
    let sheet=1.0-smoothstep(-1.0,3.0,rr(p,vec2f(836.0,185.0),vec2f(67.0,51.0),4.0));
    let front=134.0+clamp(t,0.0,1.0)*99.0;
    let boundary=band(p.y,front,4.0)*sheet;
    let frost=(1.0-smoothstep(front-7.0,front+3.0,p.y))*sheet;
    let vertical=(band(p.x,773.0,2.5)+band(p.x,899.0,2.5))*band(p.y,185.0,56.0);
    let wake=select(gate(t,0.01,0.16,0.83,1.0),gate(t,0.04,0.26,0.60,0.95),idle);
    let phase=select(1.0,0.25,idle);
    out.base=vec3f(0.13,0.69,0.79)*frost*0.18*wake*phase+
      vec3f(0.76,0.99,1.0)*boundary*0.94*wake*level+
      vec3f(0.18,0.51,0.66)*vertical*0.16*wake*level;
    out.alpha=clamp(frost*0.19*phase+boundary*0.90*level+vertical*0.14*level,0.0,0.91)*wake;
    out.glow=vec3f(0.16,0.77,0.96)*band(p.y,front,18.0)*sheet*wake*level*0.68+
      vec3f(0.08,0.35,0.55)*vertical*wake*level*0.10;
    return out;
  }
  // Only one reel sector illuminates; no generic full annular halo.
  let q=p-vec2f(264.0,482.0);
  let radius=length(q);
  let angle=atan2(q.y,q.x);
  let stop=select(-1.20+clamp(t,0.0,1.0)*2.10,-0.18,idle);
  let sector=band(radius,44.0,4.0)*
    (1.0-smoothstep(0.48,0.63,abs(angle-stop)));
  let focus=band(radius,44.0,6.0)*band(angle,stop,0.10);
  let film=band(p.y,482.0,4.0)*band(p.x,264.0,52.0)*0.18;
  let wake=select(gate(t,0.02,0.13,0.78,1.0),gate(t,0.04,0.25,0.62,0.95),idle);
  out.base=(vec3f(0.39,0.79,0.71)*sector+vec3f(0.91,1.0,0.85)*focus+
    vec3f(0.25,0.49,0.43)*film)*wake*level;
  out.alpha=clamp(sector*0.83+focus*0.95+film*0.22,0.0,0.94)*wake*level;
  out.glow=vec3f(0.24,0.84,0.63)*band(radius,44.0,17.0)*
    (1.0-smoothstep(0.54,0.80,abs(angle-stop)))*wake*level*0.63+
    vec3f(0.60,0.94,0.64)*focus*wake*level*0.28;
  return out;
}
@fragment fn fsBase(input:Vertex)->@location(0) vec4f {
  let e=light(input.local);
  return vec4f(e.base*params.effect.x,e.alpha*params.effect.x);
}
@fragment fn fsGlow(input:Vertex)->@location(0) vec4f {
  let e=light(input.local);
  return vec4f(e.glow*params.effect.x,0.0);
}`;

  function objectForEffect(effect) {
    const object = OBJECTS.find(item => item.id === effect?.objectId);
    if (!object) return null;
    if (effect.type !== `object-${object.type}` || typeof effect.id !== 'string' ||
      !effect.id || ![effect.x, effect.y, effect.startedAt].every(finite) ||
      effect.startedAt < 0 || Math.abs(effect.x-object.x) > 1 ||
      Math.abs(effect.y-object.y) > 1)
      throw new TypeError('Archive E requires exact successful-use object event');
    return object;
  }
  function visible(object,camera,zoom,viewport) {
    const z=object.zone;
    const x=(ROOM.x+z.x-camera.x)*zoom, y=(ROOM.y+z.y-camera.y)*zoom;
    return x<viewport.width && y<viewport.height &&
      x+z.width*zoom>0 && y+z.height*zoom>0;
  }
  function validateView({ camera, zoom, viewport, now, intensity }) {
    if (!camera || !viewport || ![camera.x,camera.y,zoom,viewport.width,
      viewport.height,now,intensity].every(finite) || zoom<=0 ||
      viewport.width<=0 || viewport.height<=0 || now<0 ||
      intensity<0 || intensity>1)
      throw new TypeError('Archive E needs camera, viewport, clock and intensity');
  }
  function plan({ camera, zoom, viewport, now, effects = [], intensity = 1,
    reducedMotion = false } = {}) {
    validateView({camera,zoom,viewport,now,intensity});
    if (!Array.isArray(effects)) throw new TypeError('Archive E needs effect array');
    const latest=new Map();
    for (const effect of effects) {
      const object=objectForEffect(effect);
      if (!object) continue;
      if (effect.startedAt<=now && now-effect.startedAt<object.durationMs &&
        (!latest.has(object.id) || latest.get(object.id).startedAt<effect.startedAt))
        latest.set(object.id,effect);
    }
    if (intensity===0) return Object.freeze([]);
    const result=[];
    for (let i=0;i<OBJECTS.length;i++) {
      const object=OBJECTS[i];
      if (!visible(object,camera,zoom,viewport)) continue;
      const event=latest.get(object.id);
      const idleElapsed=(now+object.idleOffsetMs)%object.idlePeriodMs;
      if (!event && idleElapsed>=object.idleDurationMs) continue;
      const idle=!event;
      const elapsed=idle?idleElapsed:now-event.startedAt;
      const duration=idle?object.idleDurationMs:object.durationMs;
      const z=object.zone;
      result.push(Object.freeze({ objectId:object.id, index:i,
        kind:idle?'idle':'activation', effectId:idle?
          `idle:${object.id}:${Math.floor((now+object.idleOffsetMs)/object.idlePeriodMs)}`:event.id,
        elapsed, duration, progress:elapsed/duration,
        x:(ROOM.x+z.x-camera.x)*zoom,y:(ROOM.y+z.y-camera.y)*zoom,
        width:z.width*zoom,height:z.height*zoom,
        camera:Object.freeze({x:camera.x,y:camera.y}), zoom, intensity,
        reducedMotion:Boolean(reducedMotion) }));
    }
    return Object.freeze(result);
  }

  const SOUNDS = Object.freeze([
    Object.freeze({ signature:'three stepped accession clicks', duration:.28, gain:.012,
      layers:Object.freeze([{at:0,frequency:350,waveform:'triangle'},
        {at:.07,frequency:480,waveform:'triangle'},
        {at:.16,frequency:690,waveform:'sine'}]) }),
    Object.freeze({ signature:'finite air seal and glass tension', duration:.41, gain:.011,
      layers:Object.freeze([{at:0,frequency:115,waveform:'noise-band'},
        {at:.22,frequency:820,waveform:'sine'}]) }),
    Object.freeze({ signature:'reel tooth and resolving focus chirp', duration:.32, gain:.012,
      layers:Object.freeze([{at:0,frequency:240,waveform:'square'},
        {at:.14,frequency:740,waveform:'sine'}]) })
  ]);
  function planSfx({ effects = [], previousNow, now, audible = false,
    listener, radius = 600 } = {}) {
    if (!Array.isArray(effects) || ![previousNow,now,radius].every(finite) ||
      previousNow<0 || now<previousNow || radius<=0 ||
      (listener && ![listener.x,listener.y].every(finite)))
      throw new TypeError('Invalid archive E sound interval');
    if (!audible || !listener || now-previousNow>250) return Object.freeze([]);
    const cues=[];
    for (let i=0;i<OBJECTS.length;i++) {
      const object=OBJECTS[i];
      if ((listener.x-object.x)**2+(listener.y-object.y)**2>radius**2) continue;
      const events=effects.filter(value=>objectForEffect(value)?.id===object.id &&
        previousNow<value.startedAt && value.startedAt<=now)
        .sort((a,b)=>a.startedAt-b.startedAt);
      const cycle=Math.floor((now+object.idleOffsetMs)/object.idlePeriodMs);
      const idleOnset=cycle*object.idlePeriodMs-object.idleOffsetMs;
      const sound=SOUNDS[i];
      const eventIds=new Set();
      for (const event of events) {
        if (eventIds.has(event.id)) continue;
        eventIds.add(event.id);
        cues.push(Object.freeze({
        id:`archive:${object.key}:${event.id}`,objectId:object.id,
        kind:'activation',x:object.x,y:object.y,signature:sound.signature,
        duration:sound.duration,gain:sound.gain,layers:sound.layers }));
      }
      if (!events.length && previousNow<idleOnset && idleOnset<=now)
        cues.push(Object.freeze({ id:`archive:${object.key}:idle:${cycle}`,
          objectId:object.id,kind:'idle',x:object.x,y:object.y,
          signature:`quiet idle onset of ${object.key}`,duration:.12,
          gain:sound.gain*.22,layers:Object.freeze([sound.layers[0]]) }));
    }
    return Object.freeze(cues);
  }

  function create({ device, format } = {}) {
    if (!device?.createShaderModule || !device?.createRenderPipeline ||
      !device?.createBuffer || !device?.createBindGroup ||
      !device?.queue?.writeBuffer || typeof format!=='string' || !format)
      throw new TypeError('Archive E needs the shared WebGPU device and format');
    const module=device.createShaderModule({label:'DVA archive fixture E',code:shader});
    const base=device.createRenderPipeline({label:'DVA archive E material',layout:'auto',
      vertex:{module,entryPoint:'vs'},fragment:{module,entryPoint:'fsBase',targets:[{format,blend:{
        color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
        alpha:{srcFactor:'zero',dstFactor:'one',operation:'add'}
      }}]},primitive:{topology:'triangle-list'}});
    const glow=device.createRenderPipeline({label:'DVA archive E emitted light',layout:'auto',
      vertex:{module,entryPoint:'vs'},fragment:{module,entryPoint:'fsGlow',targets:[{format,blend:{
        color:{srcFactor:'one',dstFactor:'one',operation:'add'},
        alpha:{srcFactor:'zero',dstFactor:'one',operation:'add'}
      }}]},primitive:{topology:'triangle-list'}});
    const buffers=OBJECTS.map(object=>device.createBuffer({label:`DVA ${object.key} E state`,
      size:48,usage:0x40|0x08}));
    const binds=buffers.map(buffer=>({
      base:device.createBindGroup({layout:base.getBindGroupLayout(0),
        entries:[{binding:0,resource:{buffer}}]}),
      glow:device.createBindGroup({layout:glow.getBindGroupLayout(0),
        entries:[{binding:0,resource:{buffer}}]})
    }));
    let destroyed=false;
    return Object.freeze({ device, get ready(){return !destroyed;},
      record({ frame,target,viewport,camera,zoom,now,effects,intensity=1,
        reducedMotion=false,planned }={}) {
        if (destroyed) throw new Error('Archive E pass destroyed');
        const entries=planned===undefined?plan({camera,zoom,viewport,now,effects,
          intensity,reducedMotion}):planned;
        if (!Array.isArray(entries) || !Object.isFrozen(entries))
          throw new TypeError('Archive E requires a frozen plan');
        if (!entries.length) return Object.freeze({drawn:false,count:0});
        if (!frame || typeof frame.stage!=='function' || typeof frame.add!=='function' ||
          typeof target!=='string' || !target || !viewport ||
          ![viewport.width,viewport.height,viewport.pixelWidth,viewport.pixelHeight]
            .every(value=>Number.isInteger(value)&&value>0))
          throw new TypeError('Invalid shared WebGPU archive E frame');
        const used=new Set();
        frame.stage('world:archive-object-e');
        for (const entry of entries) {
          if (!entry || !Number.isInteger(entry.index) || entry.index<0 ||
            entry.index>=OBJECTS.length || used.has(entry.index) ||
            entry.objectId!==OBJECTS[entry.index].id ||
            ![entry.progress,entry.intensity,entry.zoom,entry.x,entry.y,
              entry.width,entry.height,
              entry.camera?.x,entry.camera?.y].every(finite) ||
            entry.progress<0 || entry.progress>=1 || entry.zoom<=0 ||
            entry.intensity<0 || entry.intensity>1 ||
            !['idle','activation'].includes(entry.kind))
            throw new TypeError('Invalid archive E plan entry');
          used.add(entry.index);
          const i=entry.index, buffer=buffers[i], bind=binds[i];
          device.queue.writeBuffer(buffer,0,new Float32Array([
            viewport.width,viewport.height,entry.camera.x,entry.camera.y,
            ROOM.x,ROOM.y,entry.zoom,entry.progress,
            entry.intensity,entry.reducedMotion?1:0,i,entry.kind==='idle'?1:0
          ]));
          for (const [pipeline,group,layer] of [[base,bind.base,'surface'],
            [glow,bind.glow,'glow']]) {
            frame.add({target,label:`world:archive-${OBJECTS[i].key}-e:${layer}`,
              encode(pass,info) {
                if (info.width!==viewport.pixelWidth ||
                  info.height!==viewport.pixelHeight)
                  throw new Error('Archive E backing dimensions differ from shared target');
                pass.setPipeline(pipeline);pass.setBindGroup(0,group);pass.draw(6);
              }});
          }
        }
        return Object.freeze({drawn:true,count:entries.length,
          objectIds:Object.freeze(entries.map(entry=>entry.objectId))});
      },
      destroy(){ if(destroyed)return;destroyed=true;for(const b of buffers)b.destroy(); }
    });
  }
  const api=Object.freeze({ROOM,OBJECTS,SOUNDS,shader,plan,planSfx,create});
  root.DvaWebGPUArchiveObjectE=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
