/* Proximity-only E for the accepted medical sink and patient chair.
 * These collision fixtures have no server use event. The caller owns the
 * player snapshot, shared WebGPU frame/device, clock, and audio playback. */
(function (root) {
  'use strict';
  const ROOM = Object.freeze({ x: 2200, y: 2520, width: 950, height: 780 });
  const FIXTURES = Object.freeze({
    'medical-handwash-sink-1': Object.freeze({ id: 'medical-handwash-sink-1',
      x: 3001, y: 2677, w: 96, h: 93, zoneX: 793, zoneY: 145,
      zoneW: 118, zoneH: 119, kind: 0, radius: 170, period: 7600,
      duration: 1450, offset: 0 }),
    'medical-patient-chair-1': Object.freeze({ id: 'medical-patient-chair-1',
      x: 2789, y: 3035, w: 84, h: 90, zoneX: 578, zoneY: 503,
      zoneW: 108, zoneH: 116, kind: 1, radius: 155, period: 9400,
      duration: 1700, offset: 2400 })
  });
  const finite = Number.isFinite;
  const shader = /* wgsl */ `
struct Params { view: vec4f, world: vec4f, effect: vec4f }
@group(0) @binding(0) var<uniform> params: Params;
struct Vertex { @builtin(position) position: vec4f, @location(0) local: vec2f }
@vertex fn vs(@builtin(vertex_index) index: u32) -> Vertex {
  let corner = array<vec2f,6>(vec2f(0,0),vec2f(1,0),vec2f(0,1),
    vec2f(0,1),vec2f(1,0),vec2f(1,1))[index];
  let size = select(vec2f(118.0,119.0),vec2f(108.0,116.0),params.effect.x>0.5);
  let screen = (params.world.xy + corner*size - params.view.zw)*params.world.z;
  var out: Vertex;
  out.position = vec4f(screen/params.view.xy*vec2f(2.0,-2.0)+vec2f(-1.0,1.0),0.0,1.0);
  out.local = corner*size;
  return out;
}
fn sq(v:f32)->f32 { return v*v; }
fn rr(p:vec2f,c:vec2f,h:vec2f,r:f32)->f32 {
  let q=abs(p-c)-h+vec2f(r);
  return length(max(q,vec2f(0)))+min(max(q.x,q.y),0.0)-r;
}
fn gate(t:f32,a:f32,b:f32,c:f32,d:f32)->f32 {
  return smoothstep(a,b,t)*(1.0-smoothstep(c,d,t));
}
@fragment fn fsContrast(input:Vertex)->@location(0) vec4f {
  let p=input.local;
  let t=params.world.w;
  let reduced=params.effect.z>0.5;
  if (params.effect.x<0.5) {
    // A short wet crescent gives the bright porcelain a readable water edge.
    let arc=exp(-sq(rr(p,vec2f(59,53),vec2f(31,25),12)/3.8))*
      smoothstep(48.0,57.0,p.y)*gate(t,0.28,0.43,0.85,0.98);
    let travel=select(smoothstep(0.12,0.73,t),0.58,reduced);
    let a=vec2f(38.0+travel*15.0,35.0+travel*16.0);
    let b=vec2f(80.0-travel*15.0,44.0+travel*9.0);
    let drops=(exp(-sq(length(p-a)/7.5))+exp(-sq(length(p-b)/7.5)))*
      gate(t,0.06,0.22,0.80,0.96);
    return vec4f(vec3f(0.04,0.24,0.31),
      clamp((arc*0.82+drops*0.54)*params.effect.y,0.0,0.84));
  }
  // A moving upholstery edge sits under the emissive seam; it does not
  // outline the entire chair or suggest that the chair has been occupied.
  let travel=select(smoothstep(0.07,0.72,t),0.55,reduced);
  let edge=exp(-sq(rr(p,vec2f(54,38),vec2f(27,25),10)/4.2))*
    exp(-sq((p.y-(16.0+travel*43.0))/24.0))*
    gate(t,0.06,0.22,0.77,0.96);
  let seat=exp(-sq((p.y-75.0)/4.2))*
    (1.0-smoothstep(-1.0,3.0,rr(p,vec2f(54,76),vec2f(30,17),9)))*
    gate(t,0.43,0.60,0.90,0.99);
  return vec4f(vec3f(0.20,0.13,0.08),
    clamp((edge*0.84+seat*0.54)*params.effect.y,0.0,0.86));
}
@fragment fn fs(input:Vertex)->@location(0) vec4f {
  let p=input.local;
  let t=params.world.w;
  let reduced=params.effect.z>0.5;
  var color=vec3f(0);
  if (params.effect.x<0.5) {
    // Water beads converge toward the porcelain basin; a broad reflection
    // follows, then both retreat. No running tap or implied use action.
    let basin=1.0-smoothstep(-1.0,3.0,rr(p,vec2f(59,53),vec2f(31,25),12));
    let travel=select(smoothstep(0.12,0.73,t),0.58,reduced);
    let beadCenterA=vec2f(38.0+travel*15.0,35.0+travel*16.0);
    let beadCenterB=vec2f(80.0-travel*15.0,44.0+travel*9.0);
    let beadA=exp(-sq((p.x-beadCenterA.x)/4.7)-sq((p.y-beadCenterA.y)/5.4));
    let beadB=exp(-sq((p.x-beadCenterB.x)/4.7)-sq((p.y-beadCenterB.y)/5.4));
    let beads=(beadA+beadB)*gate(t,0.04,0.23,0.83,1.05)*basin;
    let beadRim=(exp(-sq((length(p-beadCenterA)-5.5)/2.3))+
      exp(-sq((length(p-beadCenterB)-5.5)/2.3)))*
      gate(t,0.04,0.23,0.83,1.05)*basin;
    let wash=exp(-sq((p.x-(37.0+travel*43.0))/19.0)-sq((p.y-55.0)/16.0)) *
      gate(t,0.34,0.56,0.90,1.0)*basin;
    let rim=exp(-sq(rr(p,vec2f(59,53),vec2f(32,26),12)/5.5))*
      gate(t,0.49,0.66,0.90,1.0);
    let halo=exp(-sq((p.x-59.0)/42.0)-sq((p.y-54.0)/35.0))*
      gate(t,0.36,0.57,0.93,1.0);
    color=vec3f(0.27,0.86,1.0)*(beads*1.8+wash*0.85)+
      vec3f(0.94,1.0,0.93)*beadRim*1.45+
      vec3f(0.81,1.0,0.97)*rim*0.82+
      vec3f(0.20,0.71,0.81)*halo*0.26;
  } else {
    // Chair readiness is expressed by its stitched back and cushion seams.
    // It does not show occupancy or offer an interaction prompt.
    let back=1.0-smoothstep(-1.0,3.0,rr(p,vec2f(54,38),vec2f(27,25),10));
    let seat=1.0-smoothstep(-1.0,3.0,rr(p,vec2f(54,76),vec2f(30,17),9));
    let backSeam=exp(-sq((p.y-(29.0+select(t*25.0,13.0,reduced)))/5.0))*back;
    let edgeProgress=select(smoothstep(0.07,0.72,t),0.55,reduced);
    let backEdge=exp(-sq(rr(p,vec2f(54,38),vec2f(27,25),10)/3.2))*
      exp(-sq((p.y-(16.0+edgeProgress*43.0))/21.0))*
      gate(t,0.06,0.25,0.77,0.96);
    let seatSeam=exp(-sq((p.y-75.0)/5.5))*seat;
    let side=exp(-sq((abs(p.x-54.0)-25.0)/5.0))*seat;
    let wake=gate(t,0.05,0.27,0.72,0.95);
    let settle=gate(t,0.46,0.65,0.92,1.0);
    let halo=exp(-sq((p.x-54.0)/43.0)-sq((p.y-68.0)/38.0))*settle;
    color=vec3f(0.93,1.0,0.67)*backEdge*2.55+
      vec3f(0.62,0.89,0.67)*backSeam*wake*0.91+
      vec3f(1.0,0.84,0.37)*(seatSeam*0.83+side*0.43)*settle+
      vec3f(0.76,0.51,0.19)*halo*0.24;
  }
  return vec4f(color*params.effect.y,0.0);
}`;

  function fixture(id) {
    if (!Object.hasOwn(FIXTURES, id)) throw new TypeError('Exact medical fixture ID required');
    return FIXTURES[id];
  }
  function validate({ fixtureId, player, now }) {
    const item=fixture(fixtureId);
    if (!player || ![player.x,player.y,now].every(finite) || now<0)
      throw new TypeError('Medical fixture E needs actual player position and clock');
    return item;
  }
  function nearby(item, player) {
    const x=item.x+item.w/2, y=item.y+item.h/2;
    return (player.x-x)**2+(player.y-y)**2 <= item.radius**2;
  }
  function phase(item, now) { return (now+item.offset)%item.period; }
  function plan({ fixtureId, player, camera, zoom, viewport, now,
    intensity=1, reducedMotion=false }={}) {
    const item=validate({ fixtureId,player,now });
    if (!camera || !viewport || ![camera.x,camera.y,zoom,viewport.width,
      viewport.height,intensity].every(finite) || zoom<=0 ||
      viewport.width<=0 || viewport.height<=0 || intensity<0 || intensity>1)
      throw new TypeError('Medical fixture E needs camera, viewport, zoom and intensity');
    const elapsed=phase(item,now);
    if (!nearby(item,player) || elapsed>=item.duration || intensity===0) return null;
    const x=(ROOM.x+item.zoneX-camera.x)*zoom;
    const y=(ROOM.y+item.zoneY-camera.y)*zoom;
    const width=item.zoneW*zoom, height=item.zoneH*zoom;
    if (x>=viewport.width || y>=viewport.height || x+width<=0 || y+height<=0) return null;
    return Object.freeze({ fixtureId, kind:item.kind, x,y,width,height,
      elapsed, duration:item.duration, intensity, reducedMotion:Boolean(reducedMotion),
      camera:Object.freeze({x:camera.x,y:camera.y}), zoom });
  }
  function planSfx({ fixtureId, player, previousNow, now,
    audible=false, listener, radius=550 }={}) {
    const item=validate({ fixtureId,player,now });
    if (![previousNow,radius].every(finite) || previousNow<0 ||
      now<previousNow || radius<=0 ||
      (listener && ![listener.x,listener.y].every(finite)))
      throw new TypeError('Invalid medical fixture sound interval');
    if (!audible || !listener || !nearby(item,player) ||
      now-previousNow>250) return Object.freeze([]);
    const edge=Math.floor((now+item.offset)/item.period)*item.period-item.offset;
    if (!(previousNow<edge && edge<=now)) return Object.freeze([]);
    const x=item.x+item.w/2, y=item.y+item.h/2;
    if ((listener.x-x)**2+(listener.y-y)**2>radius**2) return Object.freeze([]);
    const sink=item.kind===0;
    return Object.freeze([Object.freeze({
      id:`medical:fixture:${fixtureId}:${edge}`, objectId:fixtureId, x,y,
      kind:sink?'porcelain-water-beads':'chair-upholstery-settle',
      duration:sink?.17:.22, gain:sink?.0035:.003,
      frequencyFrom:sink?660:155, frequencyTo:sink?870:113,
      noiseMix:sink?.28:.10, attack:sink?.018:.035, release:sink?.09:.14
    })]);
  }
  function create({device,format}={}) {
    if (!device?.createShaderModule || !device?.createRenderPipeline ||
      !device?.createBuffer || !device?.createBindGroup ||
      !device?.queue?.writeBuffer || typeof format!=='string' || !format)
      throw new TypeError('Medical fixture E needs shared WebGPU device and format');
    const module=device.createShaderModule({label:'DVA medical fixture E',code:shader});
    const contrast=device.createRenderPipeline({label:'DVA medical fixture material contrast',
      layout:'auto', vertex:{module,entryPoint:'vs'},
      fragment:{module,entryPoint:'fsContrast',targets:[{format,blend:{
        color:{srcFactor:'src-alpha',dstFactor:'one-minus-src-alpha',operation:'add'},
        alpha:{srcFactor:'zero',dstFactor:'one',operation:'add'}
      }}]}, primitive:{topology:'triangle-list'} });
    const pipeline=device.createRenderPipeline({label:'DVA medical fixture localized emissive',
      layout:'auto', vertex:{module,entryPoint:'vs'},
      fragment:{module,entryPoint:'fs',targets:[{format,blend:{
        color:{srcFactor:'one',dstFactor:'one',operation:'add'},
        alpha:{srcFactor:'zero',dstFactor:'one',operation:'add'}
      }}]}, primitive:{topology:'triangle-list'} });
    // Both fixtures may be queued into one frame before encode/submit.
    // Keep their uniforms separate so the later write cannot retarget the first.
    const resources=Object.values(FIXTURES).map(item=>{
      const uniform=device.createBuffer({label:`DVA ${item.id} E state`,
        size:48,usage:0x40|0x08});
      const bindContrast=device.createBindGroup({layout:contrast.getBindGroupLayout(0),
        entries:[{binding:0,resource:{buffer:uniform}}]});
      const bind=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),
        entries:[{binding:0,resource:{buffer:uniform}}]});
      return {uniform,bindContrast,bind};
    });
    let destroyed=false;
    return Object.freeze({device,get ready(){return !destroyed;},
      record({frame,target,viewport,planned}={}) {
        if (destroyed) throw new Error('Medical fixture E pass destroyed');
        if (!planned) return Object.freeze({drawn:false});
        const item=fixture(planned.fixtureId);
        if (!frame || typeof frame.stage!=='function' || typeof frame.add!=='function' ||
          typeof target!=='string' || !target || !viewport ||
          ![viewport.width,viewport.height,viewport.pixelWidth,viewport.pixelHeight]
            .every(value=>Number.isInteger(value)&&value>0) ||
          !planned.camera || ![planned.camera.x,planned.camera.y,planned.zoom,
            planned.elapsed,planned.intensity].every(finite) ||
          planned.kind!==item.kind || planned.zoom<=0 || planned.elapsed<0 ||
          planned.elapsed>=item.duration || planned.intensity<=0 || planned.intensity>1)
          throw new TypeError('Invalid shared WebGPU medical fixture E frame');
        const resource=resources[item.kind];
        device.queue.writeBuffer(resource.uniform,0,new Float32Array([
          viewport.width,viewport.height,planned.camera.x,planned.camera.y,
          ROOM.x+item.zoneX,ROOM.y+item.zoneY,planned.zoom,planned.elapsed/item.duration,
          item.kind,planned.intensity,planned.reducedMotion?1:0,0
        ]));
        frame.stage(`world:medical-fixture-e:${item.id}`);
        frame.add({target,label:`world:medical-fixture-e:${item.id}:material`,
          encode(pass,info) {
            if (info.width!==viewport.pixelWidth || info.height!==viewport.pixelHeight)
              throw new Error('Medical fixture E backing dimensions differ from shared target');
            pass.setPipeline(contrast); pass.setBindGroup(0,resource.bindContrast); pass.draw(6);
          }});
        frame.add({target,label:`world:medical-fixture-e:${item.id}:light`,
          encode(pass,info) {
            if (info.width!==viewport.pixelWidth || info.height!==viewport.pixelHeight)
              throw new Error('Medical fixture E backing dimensions differ from shared target');
            pass.setPipeline(pipeline); pass.setBindGroup(0,resource.bind); pass.draw(6);
          }});
        return Object.freeze({drawn:true,fixtureId:item.id,elapsed:planned.elapsed});
      },
      destroy(){if(destroyed)return;destroyed=true;
        for(const resource of resources) resource.uniform.destroy();}
    });
  }
  const api=Object.freeze({ROOM,FIXTURES,shader,plan,planSfx,create});
  root.DvaWebGPUMedicalFixtureE=api;
  if (typeof module!=='undefined' && module.exports) module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
