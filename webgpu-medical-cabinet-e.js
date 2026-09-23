/* One successful use of the accepted herbal and linen cabinet.
 * Shared WebGPU device, world frame, clock and audio stay with the caller. */
(function (root) {
  'use strict';

  const ROOM = Object.freeze({ x: 2200, y: 2520, width: 950, height: 780 });
  const OBJECT = Object.freeze({ id: 'v302-medical-medicalCabinet-2',
    type: 'herbalCabinet', effectKind: 'heal', x: 2922, y: 2738 });
  // Accepted attempt2-b art: visible cabinet body x621..770, y161..249.
  const ZONE = Object.freeze({ x: 605, y: 139, width: 186, height: 137 });
  const DURATION_MS = 1180;
  const finite = Number.isFinite;
  const shader = /* wgsl */ `
struct Params { view: vec4f, world: vec4f, effect: vec4f }
@group(0) @binding(0) var<uniform> params: Params;
struct Vertex { @builtin(position) position: vec4f, @location(0) local: vec2f }
@vertex fn vs(@builtin(vertex_index) index: u32) -> Vertex {
  let corner = array<vec2f,6>(vec2f(0,0),vec2f(1,0),vec2f(0,1),
    vec2f(0,1),vec2f(1,0),vec2f(1,1))[index];
  let local = vec2f(605.0,139.0) + corner*vec2f(186.0,137.0);
  let screen = (params.world.xy + local - params.view.zw)*params.world.z;
  var out: Vertex;
  out.position = vec4f(screen/params.view.xy*vec2f(2.0,-2.0)+vec2f(-1.0,1.0),0.0,1.0);
  out.local = local;
  return out;
}
fn sq(x:f32)->f32 { return x*x; }
fn gate(t:f32,a:f32,b:f32,c:f32,d:f32)->f32 {
  return smoothstep(a,b,t)*(1.0-smoothstep(c,d,t));
}
fn rr(p:vec2f,c:vec2f,h:vec2f,r:f32)->f32 {
  let q=abs(p-c)-h+vec2f(r);
  return length(max(q,vec2f(0.0)))+min(max(q.x,q.y),0.0)-r;
}
fn segment(p:vec2f,a:vec2f,b:vec2f,width:f32)->f32 {
  let v=b-a;
  let h=clamp(dot(p-a,v)/dot(v,v),0.0,1.0);
  return 1.0-smoothstep(width-1.1,width+1.1,length(p-a-v*h));
}
fn leaf(p:vec2f,c:vec2f,angle:f32,extent:vec2f)->f32 {
  let q=p-c;
  let r=vec2f(q.x*cos(angle)+q.y*sin(angle),-q.x*sin(angle)+q.y*cos(angle));
  let d=abs(r.x)/extent.x+sq(r.y/extent.y);
  return 1.0-smoothstep(0.84,1.07,d);
}
struct Motif { frame:f32, linen:f32, fold:f32, stem:f32, leaves:f32, vein:f32,
  release:f32, halo:f32 }
fn motif(p:vec2f)->Motif {
  let t=select(params.world.w,0.63,params.effect.y>0.5);
  let wake=gate(t,0.02,0.11,0.96,1.18);
  // Light follows the real cabinet's wooden face; no room-wide wash.
  let border=abs(rr(p,vec2f(696.0,205.0),vec2f(74.0,42.0),5.0));
  let shelf=segment(p,vec2f(630.0,205.0),vec2f(760.0,205.0),2.0);
  let extent=clamp((t-0.18)/0.42,0.0,1.0);
  let front=632.0+extent*67.0;
  let linenZone=(1.0-smoothstep(691.0,701.0,p.x))*
    smoothstep(627.0,636.0,p.x)*(1.0-smoothstep(246.0,252.0,p.y))*
    smoothstep(163.0,169.0,p.y);
  let band1=exp(-sq((p.y-183.0)/4.0));
  let band2=exp(-sq((p.y-207.0)/4.0));
  let band3=exp(-sq((p.y-230.0)/4.0));
  let advancing=1.0-smoothstep(front-4.0,front+5.0,p.x);
  let foldHead=exp(-sq((p.x-front)/5.0))*(band1+band2+band3);
  let grow=clamp((t-0.31)/0.44,0.0,1.0);
  let stemTip=vec2f(730.0,223.0)-vec2f(0.0,55.0)*grow;
  let stemA=segment(p,vec2f(730.0,223.0),stemTip,2.4);
  let stemB=segment(p,vec2f(747.0,225.0),vec2f(747.0-18.0*grow,225.0-49.0*grow),2.1);
  let leaves=(leaf(p,vec2f(721.0,200.0),-0.66,vec2f(12.0,6.0))+
    leaf(p,vec2f(740.0,192.0),0.72,vec2f(12.0,6.0))+
    leaf(p,vec2f(721.0,182.0),-0.65,vec2f(10.0,5.0))+
    leaf(p,vec2f(744.0,208.0),0.63,vec2f(10.0,5.0)))*grow;
  let vein=segment(p,vec2f(730.0,220.0),stemTip,0.9)*grow;
  let route=segment(p,vec2f(681.0,205.0),vec2f(727.0,205.0),5.0);
  let travelling=exp(-sq((p.x-(681.0+42.0*clamp((t-0.53)/0.29,0.0,1.0)))/10.0));
  var out:Motif;
  out.frame=(exp(-sq(border/3.2))*0.75+shelf*0.27)*wake;
  out.linen=(band1+band2+band3)*linenZone*advancing*gate(t,0.15,0.30,0.82,1.07);
  out.fold=foldHead*linenZone*gate(t,0.18,0.29,0.73,0.98);
  out.stem=(stemA+stemB)*gate(t,0.31,0.42,0.96,1.18);
  out.leaves=leaves*gate(t,0.36,0.48,0.94,1.16);
  out.vein=vein*gate(t,0.48,0.63,0.93,1.10);
  out.release=route*travelling*gate(t,0.53,0.60,0.83,1.01);
  out.halo=exp(-sq((p.x-733.0)/34.0)-sq((p.y-199.0)/39.0))*
    gate(t,0.38,0.56,0.86,1.14);
  return out;
}
@fragment fn fsBase(input:Vertex)->@location(0) vec4f {
  let e=motif(input.local);
  let envelope=select(1.0,gate(params.world.w,0.02,0.13,0.91,1.17),
    params.effect.y>0.5);
  let cloth=clamp(e.linen*0.74+e.fold*0.92,0.0,1.0);
  let herb=clamp(e.stem*0.77+e.leaves*0.82+e.vein*0.44,0.0,1.0);
  let light=clamp(e.frame*0.54+e.release*0.76,0.0,1.0);
  let color=(vec3f(0.81,0.91,0.68)*cloth+
    vec3f(0.31,0.88,0.38)*herb+vec3f(0.58,0.88,0.52)*light)/
    max(cloth+herb+light,0.001);
  let alpha=clamp(cloth+herb+light,0.0,0.96)*params.effect.x*envelope;
  return vec4f(color,alpha);
}
@fragment fn fsGlow(input:Vertex)->@location(0) vec4f {
  let e=motif(input.local);
  let envelope=select(1.0,gate(params.world.w,0.02,0.13,0.91,1.17),
    params.effect.y>0.5);
  let clothHalo=e.linen*0.14+e.fold*0.24;
  let herbHalo=e.stem*0.15+e.leaves*0.25+e.halo*0.20;
  let color=vec3f(0.83,0.92,0.64)*clothHalo+
    vec3f(0.30,0.90,0.34)*herbHalo+
    vec3f(0.49,0.96,0.61)*e.release*0.22;
  return vec4f(color*params.effect.x*envelope,0.0);
}`;

  function validEffect(effect) {
    return effect?.type === `object-${OBJECT.type}` &&
      effect.objectId === OBJECT.id &&
      effect.effectKind === OBJECT.effectKind &&
      typeof effect.id === 'string' && effect.id.length > 0 &&
      [effect.x, effect.y, effect.startedAt].every(finite) &&
      Math.abs(effect.x - OBJECT.x) <= 1 && Math.abs(effect.y - OBJECT.y) <= 1 &&
      effect.startedAt >= 0;
  }
  function plan({ camera, zoom, viewport, now, effect, intensity = 1,
    reducedMotion = false } = {}) {
    if (!camera || !viewport || ![camera.x,camera.y,zoom,viewport.width,
      viewport.height,now,intensity].every(finite) || zoom <= 0 ||
      viewport.width <= 0 || viewport.height <= 0 || now < 0 ||
      intensity < 0 || intensity > 1)
      throw new TypeError('Medical cabinet E needs a camera, viewport, clock and intensity');
    if (!effect) return null;
    if (!validEffect(effect)) throw new TypeError('Medical cabinet E needs the exact successful herbal-cabinet heal effect');
    const elapsed=now-effect.startedAt;
    if (elapsed < 0 || elapsed >= DURATION_MS || intensity === 0) return null;
    const x=(ROOM.x+ZONE.x-camera.x)*zoom;
    const y=(ROOM.y+ZONE.y-camera.y)*zoom;
    if (x >= viewport.width || y >= viewport.height ||
      x+ZONE.width*zoom <= 0 || y+ZONE.height*zoom <= 0) return null;
    return Object.freeze({ effectId:effect.id, elapsed, x, y,
      width:ZONE.width*zoom, height:ZONE.height*zoom,
      camera:Object.freeze({x:camera.x,y:camera.y}), zoom, intensity,
      reducedMotion:Boolean(reducedMotion) });
  }
  // A single successful-use edge produces one finite cloth-and-herb cue.
  // The caller owns the actual timbre, mute/verify, and effect-id deduplication.
  function planSfx({ effect, previousNow, now, audible = false, listener,
    radius = 600 } = {}) {
    if (![previousNow,now,radius].every(finite) || previousNow < 0 ||
      now < previousNow || radius <= 0 ||
      (listener && ![listener.x,listener.y].every(finite)))
      throw new TypeError('Invalid medical cabinet E sound interval');
    if (!effect) return Object.freeze([]);
    if (!validEffect(effect)) throw new TypeError('Medical cabinet E needs the exact successful herbal-cabinet heal effect');
    if (!audible || !listener || now-previousNow > 250 ||
      !(previousNow < effect.startedAt && effect.startedAt <= now))
      return Object.freeze([]);
    const x=ROOM.x+696, y=ROOM.y+205;
    if ((listener.x-x)**2+(listener.y-y)**2 > radius**2)
      return Object.freeze([]);
    return Object.freeze([Object.freeze({ id:`medical:herbal-cabinet:${effect.id}`,
      objectId:OBJECT.id, x, y, frequencyFrom:330, frequencyTo:590,
      duration:.29, gain:.011, waveform:'triangle', character:'linen-herbal-rustle' })]);
  }
  function create({ device, format } = {}) {
    if (!device?.createShaderModule || !device?.createRenderPipeline ||
      !device?.createBuffer || !device?.createBindGroup ||
      !device?.queue?.writeBuffer || typeof format !== 'string' || !format)
      throw new TypeError('Medical cabinet E needs the shared WebGPU device and format');
    const module=device.createShaderModule({label:'DVA herbal cabinet E',code:shader});
    const base=device.createRenderPipeline({label:'DVA herbal cabinet linen and leaves',
      layout:'auto',vertex:{module,entryPoint:'vs'},
      fragment:{module,entryPoint:'fsBase',targets:[{format,blend:{
        color:{srcFactor:'src-alpha',dstFactor:'one-minus-src-alpha',operation:'add'},
        alpha:{srcFactor:'zero',dstFactor:'one',operation:'add'}
      }}]},primitive:{topology:'triangle-list'}});
    const glow=device.createRenderPipeline({label:'DVA herbal cabinet emissive light',
      layout:'auto',vertex:{module,entryPoint:'vs'},
      fragment:{module,entryPoint:'fsGlow',targets:[{format,blend:{
        color:{srcFactor:'one',dstFactor:'one',operation:'add'},
        alpha:{srcFactor:'zero',dstFactor:'one',operation:'add'}
      }}]},primitive:{topology:'triangle-list'}});
    const uniform=device.createBuffer({label:'DVA herbal cabinet E state',
      size:48,usage:0x40|0x08}); // UNIFORM | COPY_DST
    const bindBase=device.createBindGroup({layout:base.getBindGroupLayout(0),
      entries:[{binding:0,resource:{buffer:uniform}}]});
    const bindGlow=device.createBindGroup({layout:glow.getBindGroupLayout(0),
      entries:[{binding:0,resource:{buffer:uniform}}]});
    let destroyed=false;
    return Object.freeze({device,get ready(){return !destroyed;},
      record({frame,target,viewport,camera,zoom,now,effect,intensity=1,
        reducedMotion=false,planned}={}) {
        if (destroyed) throw new Error('Medical cabinet E pass destroyed');
        const result=planned===undefined?plan({camera,zoom,viewport,now,effect,
          intensity,reducedMotion}):planned;
        if (!result) return Object.freeze({drawn:false});
        if (!frame || typeof frame.stage!=='function' ||
          typeof frame.add!=='function' || typeof target!=='string' || !target ||
          !viewport || ![viewport.width,viewport.height,viewport.pixelWidth,
            viewport.pixelHeight].every(value=>Number.isInteger(value)&&value>0) ||
          !result.camera || ![result.camera.x,result.camera.y,result.zoom,
            result.elapsed,result.intensity].every(finite) || result.zoom<=0 ||
          result.elapsed<0 || result.elapsed>=DURATION_MS ||
          result.intensity<0 || result.intensity>1)
          throw new TypeError('Invalid shared WebGPU medical cabinet E frame');
        device.queue.writeBuffer(uniform,0,new Float32Array([
          viewport.width,viewport.height,result.camera.x,result.camera.y,
          ROOM.x,ROOM.y,result.zoom,result.elapsed/1000,
          result.intensity,result.reducedMotion?1:0,0,0
        ]));
        frame.stage('world:medical-herbal-cabinet-e');
        for (const [pipeline,bind,layer] of [[base,bindBase,'surface'],
          [glow,bindGlow,'glow']]) {
          frame.add({target,label:`world:medical-herbal-cabinet-e:${layer}`,
            encode(pass,info) {
              if (info.width!==viewport.pixelWidth ||
                info.height!==viewport.pixelHeight)
                throw new Error('Medical cabinet E backing dimensions differ from shared target');
              pass.setPipeline(pipeline);pass.setBindGroup(0,bind);pass.draw(6);
            }});
        }
        return Object.freeze({drawn:true,effectId:result.effectId,
          elapsed:result.elapsed});
      },destroy(){if(destroyed)return;destroyed=true;uniform.destroy();}});
  }
  const api=Object.freeze({ROOM,OBJECT,ZONE,DURATION_MS,shader,plan,planSfx,create});
  root.DvaWebGPUMedicalCabinetE=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
