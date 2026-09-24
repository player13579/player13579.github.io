/* Standalone a01 E candidate. The caller owns the shared WebGPU device/frame,
 * authoritative door/object event, clock, and sound playback. No texture,
 * canvas, RAF, audio node or live-game route is created here. */
(function (root) {
  'use strict';

  const CORRIDOR = Object.freeze({ id: 'a01', x: 1180, y: 650, width: 200, height: 180 });
  const DOOR_ID = 'd-archive-security';
  const OBJECT_ID = 'v317-corridor-a01-1';
  const KINDS = Object.freeze({
    'door-cycle': Object.freeze({ index: 0, x: 1180, y: 715, width: 200, height: 88,
      durationMs: 1050, sourceX: 1180, sourceY: 740, sound: 'airseal-pressure-release' }),
    'reader-use': Object.freeze({ index: 1, x: 1226, y: 651, width: 56, height: 62,
      durationMs: 760, sourceX: 1252, sourceY: 684, sound: 'ceramic-gasket-clasp' }),
    'reader-luck-crossing': Object.freeze({ index: 2, x: 1180, y: 710, width: 54, height: 88,
      durationMs: 680, sourceX: 1192, sourceY: 748, sound: 'amber-luck-facet' })
  });
  const finite = Number.isFinite;
  const MAX_FRAME_EVENTS = 64;

  const shader = /* wgsl */ `
struct Params { view: vec4f, world: vec4f, effect: vec4f }
@group(0) @binding(0) var<uniform> params: Params;
struct Vertex { @builtin(position) position: vec4f, @location(0) local: vec2f }
fn sizeFor(kind:f32)->vec2f {
  if (kind < 0.5) { return vec2f(200.0,88.0); }
  if (kind < 1.5) { return vec2f(56.0,62.0); }
  return vec2f(54.0,88.0);
}
@vertex fn vs(@builtin(vertex_index) index:u32)->Vertex {
  let corner=array<vec2f,6>(vec2f(0,0),vec2f(1,0),vec2f(0,1),
    vec2f(0,1),vec2f(1,0),vec2f(1,1))[index];
  let size=sizeFor(params.effect.x);
  let screen=(params.world.xy+corner*size-params.view.zw)*params.world.z;
  var out:Vertex;
  out.position=vec4f(screen/params.view.xy*vec2f(2.0,-2.0)+vec2f(-1.0,1.0),0.0,1.0);
  out.local=corner*size;
  return out;
}
fn sq(v:f32)->f32 { return v*v; }
fn gate(t:f32,a:f32,b:f32,c:f32,d:f32)->f32 {
  return smoothstep(a,b,t)*(1.0-smoothstep(c,d,t));
}
fn diamond(p:vec2f,center:vec2f,radii:vec2f)->f32 {
  return abs((p.x-center.x)/radii.x)+abs((p.y-center.y)/radii.y);
}
@fragment fn fsMaterial(in:Vertex)->@location(0) vec4f {
  let p=in.local;
  let t=params.world.w;
  let kind=params.effect.x;
  let reduced=params.effect.z>0.5;
  if (kind<0.5) {
    // Floor-local air compression: a broad dark refractive skirt follows one
    // horizontal crossing. It never depicts a closing ceramic wall seal.
    let progress=select(smoothstep(0.04,0.84,t),0.56,reduced);
    let x=8.0+progress*184.0;
    let skirt=exp(-sq((p.x-x)/19.0))*gate(t,0.0,0.13,0.78,1.0)*
      smoothstep(4.0,14.0,p.y)*(1.0-smoothstep(74.0,86.0,p.y));
    return vec4f(vec3f(0.035,0.10,0.15),skirt*0.24*params.effect.y);
  }
  if (kind<1.5) {
    // The small wall-mounted reader closes from both ends; this contrast
    // stays around the panel, away from the doorway pressure front.
    let close=select(smoothstep(0.08,0.64,t),0.56,reduced);
    let gap=20.0-close*11.0;
    let jaws=(1.0-smoothstep(2.0,4.0,abs(abs(p.y-31.0)-gap)))*
      (1.0-smoothstep(21.0,26.0,abs(p.x-28.0)))*gate(t,0.0,0.10,0.76,1.0);
    return vec4f(vec3f(0.14,0.13,0.10),jaws*0.48*params.effect.y);
  }
  let shape=1.0-smoothstep(0.87,1.03,diamond(p,vec2f(27.0,44.0),vec2f(19.0,29.0)));
  return vec4f(vec3f(0.19,0.13,0.04),shape*gate(t,0.02,0.20,0.74,1.0)*0.36*params.effect.y);
}
@fragment fn fsLight(in:Vertex)->@location(0) vec4f {
  let p=in.local;
  let t=params.world.w;
  let kind=params.effect.x;
  let reduced=params.effect.z>0.5;
  let energy=gate(t,0.0,0.15,0.77,1.0)*params.effect.y;
  var color=vec3f(0.0);
  if (kind<0.5) {
    let progress=select(smoothstep(0.04,0.84,t),0.56,reduced);
    let front=8.0+progress*184.0;
    let across=smoothstep(5.0,17.0,p.y)*(1.0-smoothstep(69.0,83.0,p.y));
    let bow=sin((p.y-44.0)*0.055)*3.0;
    let edge=exp(-sq((p.x-front-bow)/4.8))*across;
    let aura=exp(-sq((p.x-front-bow)/24.0))*across;
    color=vec3f(0.18,0.79,1.0)*aura*0.68+
      vec3f(0.82,0.98,1.0)*edge*1.6;
  } else if (kind<1.5) {
    let close=select(smoothstep(0.08,0.64,t),0.56,reduced);
    let gap=20.0-close*11.0;
    let edge=exp(-sq((abs(p.y-31.0)-gap)/2.8))*
      (1.0-smoothstep(19.0,25.0,abs(p.x-28.0)));
    let center=exp(-sq((p.x-28.0)/13.0)-sq((p.y-31.0)/8.0))*
      gate(t,0.44,0.63,0.80,1.0);
    color=vec3f(0.71,0.92,0.91)*edge*1.32+
      vec3f(1.0,0.86,0.53)*center*0.95;
  } else {
    // One broad amber facet at the actual qualifying crossing, visually
    // unlike both the cyan air front and the ceramic panel closure.
    let d=diamond(p,vec2f(27.0,44.0),vec2f(19.0,29.0));
    let shell=exp(-sq((d-0.86)/0.12));
    let core=(1.0-smoothstep(0.48,0.92,d))*
      (0.42+0.58*exp(-sq((p.x-22.0)/8.0)));
    let tail=exp(-sq((p.x-27.0)/26.0)-sq((p.y-44.0)/38.0))*0.18;
    color=vec3f(1.0,0.72,0.19)*(shell*1.5+core*0.8)+
      vec3f(1.0,0.97,0.66)*core*0.8+vec3f(0.72,0.37,0.06)*tail;
  }
  return vec4f(color*energy,0.0);
}`;

  function details(event) {
    if (!event || typeof event.id !== 'string' || !event.id ||
      !Object.hasOwn(KINDS,event.kind) || !finite(event.atMs) || event.atMs<0)
      throw new TypeError('a01 E requires an exact event ID, kind and timestamp');
    if (event.kind==='door-cycle' ? event.doorId!==DOOR_ID : event.objectId!==OBJECT_ID)
      throw new TypeError('a01 E requires the exact door or object ID');
    return KINDS[event.kind];
  }
  function plan({ event,camera,zoom,viewport,now,intensity=1,reducedMotion=false }={}) {
    const item=details(event);
    if (!camera || !viewport || ![camera.x,camera.y,zoom,viewport.width,
      viewport.height,now,intensity].every(finite) || zoom<=0 ||
      viewport.width<=0 || viewport.height<=0 || now<0 ||
      intensity<0 || intensity>1)
      throw new TypeError('a01 E needs valid camera, viewport, zoom, clock and intensity');
    const elapsed=now-event.atMs;
    if (elapsed<0 || elapsed>=item.durationMs || intensity===0) return null;
    const x=(item.x-camera.x)*zoom,y=(item.y-camera.y)*zoom;
    const width=item.width*zoom,height=item.height*zoom;
    if (x>=viewport.width || y>=viewport.height || x+width<=0 || y+height<=0) return null;
    return Object.freeze({ eventId:event.id,kind:event.kind,kindIndex:item.index,
      x,y,width,height,elapsed,durationMs:item.durationMs,intensity,
      reducedMotion:Boolean(reducedMotion),camera:Object.freeze({x:camera.x,y:camera.y}),zoom });
  }
  function planSfx({event,previousNow,now,audible=false,listener,radius=520}={}) {
    const item=details(event);
    if (![previousNow,now,radius].every(finite) || previousNow<0 || now<previousNow ||
      radius<=0 || (listener && ![listener.x,listener.y].every(finite)))
      throw new TypeError('Invalid a01 E sound interval');
    if (!audible || !listener || now-previousNow>250 ||
      !(previousNow<event.atMs && event.atMs<=now)) return Object.freeze([]);
    if ((listener.x-item.sourceX)**2+(listener.y-item.sourceY)**2>radius**2)
      return Object.freeze([]);
    const door=item.index===0,use=item.index===1;
    return Object.freeze([Object.freeze({
      id:`corridor:a01:${event.id}:${item.sound}`,eventId:event.id,
      kind:item.sound,x:item.sourceX,y:item.sourceY,
      duration:door?.31:use?.19:.14,gain:door?.0038:use?.0033:.003,
      frequencyFrom:door?123:use?370:720,
      frequencyTo:door?85:use?510:980,
      noiseMix:door?.58:use?.22:.08,
      attack:door?.045:use?.013:.009,
      release:door?.18:use?.11:.08
    })]);
  }
  function create({device,format}={}) {
    if (!device?.createShaderModule || !device?.createRenderPipeline ||
      !device?.createBuffer || !device?.createBindGroup ||
      !device?.queue?.writeBuffer || typeof format!=='string' || !format)
      throw new TypeError('a01 E needs shared WebGPU device and format');
    const module=device.createShaderModule({label:'DVA a01 corridor E',code:shader});
    const material=device.createRenderPipeline({label:'DVA a01 material contrast',
      layout:'auto',vertex:{module,entryPoint:'vs'},
      fragment:{module,entryPoint:'fsMaterial',targets:[{format,blend:{
        color:{srcFactor:'src-alpha',dstFactor:'one-minus-src-alpha',operation:'add'},
        alpha:{srcFactor:'zero',dstFactor:'one',operation:'add'}
      }}]},primitive:{topology:'triangle-list'}});
    const light=device.createRenderPipeline({label:'DVA a01 local light',
      layout:'auto',vertex:{module,entryPoint:'vs'},
      fragment:{module,entryPoint:'fsLight',targets:[{format,blend:{
        color:{srcFactor:'one',dstFactor:'one',operation:'add'},
        alpha:{srcFactor:'zero',dstFactor:'one',operation:'add'}
      }}]},primitive:{topology:'triangle-list'}});
    const resources=[];
    function slot(index) {
      if (resources[index]) return resources[index];
      const uniform=device.createBuffer({label:`DVA a01 event ${index} state`,size:48,usage:0x40|0x08});
      const materialBind=device.createBindGroup({layout:material.getBindGroupLayout(0),
        entries:[{binding:0,resource:{buffer:uniform}}]});
      const lightBind=device.createBindGroup({layout:light.getBindGroupLayout(0),
        entries:[{binding:0,resource:{buffer:uniform}}]});
      return (resources[index]={uniform,materialBind,lightBind});
    }
    const frameIndices=new WeakMap();
    let destroyed=false;
    return Object.freeze({device,get ready(){return !destroyed;},
      record({frame,target,viewport,planned}={}) {
        if (destroyed) throw new Error('a01 E pass destroyed');
        if (!planned) return Object.freeze({drawn:false});
        if (!frame || typeof frame.stage!=='function' || typeof frame.add!=='function' ||
          typeof target!=='string' || !target || !viewport ||
          ![viewport.width,viewport.height,viewport.pixelWidth,viewport.pixelHeight]
            .every(value=>Number.isInteger(value)&&value>0) ||
          !Object.hasOwn(KINDS,planned.kind) ||
          KINDS[planned.kind].index!==planned.kindIndex ||
          !planned.camera || ![planned.camera.x,planned.camera.y,planned.zoom,
            planned.elapsed,planned.durationMs,planned.intensity].every(finite) ||
          planned.zoom<=0 || planned.durationMs!==KINDS[planned.kind].durationMs ||
          planned.elapsed<0 || planned.elapsed>=planned.durationMs ||
          planned.intensity<=0 || planned.intensity>1)
          throw new TypeError('Invalid shared WebGPU a01 E frame');
        const index=frameIndices.get(frame)||0;
        if (index>=MAX_FRAME_EVENTS)
          throw new RangeError('a01 E frame event limit exceeded');
        const item=KINDS[planned.kind],res=slot(index);
        device.queue.writeBuffer(res.uniform,0,new Float32Array([
          viewport.width,viewport.height,planned.camera.x,planned.camera.y,
          item.x,item.y,planned.zoom,planned.elapsed/planned.durationMs,
          item.index,planned.intensity,planned.reducedMotion?1:0,0
        ]));
        const label=`world:corridor-a01-e:${planned.kind}:${planned.eventId}`;
        frame.stage(label);
        for (const [suffix,pipeline,bind] of [
          ['material',material,res.materialBind],['light',light,res.lightBind]
        ]) frame.add({target,label:`${label}:${suffix}`,encode(pass,info){
          if (info.width!==viewport.pixelWidth || info.height!==viewport.pixelHeight)
            throw new Error('a01 E backing dimensions differ from shared target');
          pass.setPipeline(pipeline);pass.setBindGroup(0,bind);pass.draw(6);
        }});
        frameIndices.set(frame,index+1);
        return Object.freeze({drawn:true,kind:planned.kind,eventId:planned.eventId});
      },
      destroy(){if(destroyed)return;destroyed=true;
        for(const res of resources)res.uniform.destroy();
        resources.length=0;
      }
    });
  }
  const api=Object.freeze({CORRIDOR,DOOR_ID,OBJECT_ID,KINDS,shader,plan,planSfx,create});
  root.DvaWebGPUCorridorA01E=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
