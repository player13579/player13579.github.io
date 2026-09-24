/* Textureless, unique reactor-room object E candidates for the shared WebGPU
 * frame owner. This is intentionally not registered in the live app. */
(function(root){
 'use strict';
 const TYPE='station',ROOM='reactor',DURATION_MS=2200,FLOATS=16;
 const OBJECTS=Object.freeze({
  'v302-reactor-reactorGauge-1':Object.freeze({id:'v302-reactor-reactorGauge-1',type:'reactorGauge',
   effectKind:'luckBoost',x:3699,y:388,width:110,height:76,radius:100,cooldownMs:38000,
   silhouette:'spring-dial',sfx:'spring-gauge-click',code:0}),
  'v302-reactor-coolingUnit-2':Object.freeze({id:'v302-reactor-coolingUnit-2',type:'coolingUnit',
   effectKind:'stamina',x:4388,y:388,width:110,height:76,radius:100,cooldownMs:36000,
   silhouette:'stone-basin',sfx:'water-basin-tone',code:1}),
  'v302-reactor-powerCabinet-3':Object.freeze({id:'v302-reactor-powerCabinet-3',type:'powerCabinet',
   effectKind:'stamina',x:3712,y:771,width:110,height:76,radius:100,cooldownMs:38000,
   silhouette:'night-stone-lantern',sfx:'night-stone-chime',code:2})
 });
 const SFX_POLICY=Object.freeze({owner:'existing-server-world-sound',edge:'one-shot-per-accepted-object-use-event-id',
  idle:'none',cooldown:'none',loop:'none',candidatePlayback:false,
  profiles:Object.freeze({'v302-reactor-reactorGauge-1':'spring-gauge-click',
   'v302-reactor-coolingUnit-2':'water-basin-tone','v302-reactor-powerCabinet-3':'night-stone-chime'})});
 const finite=Number.isFinite;
 const shader=/* wgsl */`
struct Params{view:vec4f,geometry:vec4f,state:vec4f,extra:vec4f};
@group(0)@binding(0)var<uniform>p:Params;
struct Vertex{@builtin(position)position:vec4f};
@vertex fn vs(@builtin(vertex_index)i:u32)->Vertex{
 let v=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3))[i];
 var o:Vertex;o.position=vec4f(v,0,1);return o;
}
fn sq(v:f32)->f32{return v*v;}
fn line(v:f32,w:f32)->f32{return exp(-sq(v)/max(sq(w),.0001));}
fn ease(v:f32)->f32{let x=clamp(v,0.0,1.0);return x*x*(3.0-2.0*x);}
@fragment fn fs(@builtin(position)px:vec4f)->@location(0)vec4f{
 let q=(px.xy-p.view.zw)/max(p.geometry.xy,vec2f(.001));
 let kind=p.geometry.w;let state=p.state.y;let useP=p.state.x;let reduced=p.state.z>.5;
 let readiness=p.extra.x;let time=select(p.extra.y,0.0,reduced);let phase=p.geometry.z;
 let r=length(q);let angle=atan2(q.y,q.x);let usePulse=sin(useP*3.14159265);
 var core=0.0;var bloom=0.0;var c=vec3f(.9,.8,.4);
 if(kind<.5){
   // Spring gauge: a large dial, open arc and one readable moving needle.
   c=vec3f(1.0,.54,.19);
   let sweep=fract(time*.10+phase*.02)*5.15-2.575;
   let arc=1.0-smoothstep(2.35,2.43,abs(angle));
   let outer=line(r-.70,.035)*arc;let inner=line(r-.51,.022)*arc;
   let needle=line(angle-sweep,.047)*step(.18,r)*step(r,.57);
   let pivot=line(r,.075);let ticks=line(r-.61,.025)*arc*step(.42,abs(sin(angle*6.0)));
   core=outer*.70+inner*.38+needle*.86+pivot*.8+ticks*.24;
   bloom=outer*.50+needle*.63+pivot*.43;
 }else if(kind<1.5){
   // Cooling unit: low oval stone lip with a liquid surface and two broad wakes.
   c=vec3f(.20,.84,.96);
   let basin=length(vec2f(q.x*.82,q.y*1.30));
   let lip=line(basin-.60,.052);let waterY=q.y+.22+.045*sin(q.x*4.5+time*2.0+phase);
   let surface=line(waterY,.030)*step(abs(q.x),.48)*step(.10,basin);
   let waveA=line(waterY-.10,.034)*step(abs(q.x-.18),.36);
   let waveB=line(waterY+.095,.026)*step(abs(q.x+.22),.30);
   let vapor=(line(q.x-.30,.045)+line(q.x+.28,.05))*line(q.y+.83,.20);
   core=lip*.75+surface*.54+waveA*.24+waveB*.18+vapor*.26;
   bloom=lip*.43+surface*.52+vapor*.30;
 }else{
   // Night-stone lantern cabinet: upright faceted enclosure and a vertical core.
   c=vec3f(.61,.96,.40);
   let body=(1.0-smoothstep(.045,.085,abs(q.x)))*step(abs(q.y),.70);
   let seam=line(abs(q.x)-.57,.035)*step(abs(q.y),.72);
   let cap=line(abs(q.y)-.72,.035)*step(abs(q.x),.62);
   let ember=line(q.x,.105)*line(q.y+.02,.39);
   let beam=line(q.x,.22)*step(abs(q.y),.97)*.15;
   let vent=line(q.y-.39,.025)*step(abs(q.x),.47)+line(q.y+.39,.025)*step(abs(q.x),.47);
   core=body*.10+seam*.68+cap*.57+ember*.86+beam+vent*.36;
   bloom=ember*.72+beam*.45+seam*.20;
 }
 let active=select(.35,.88,state>1.5);
 let glow=active*(.68+.20*sin(time*2.1+phase));
 let sleeping=state>.5&&state<1.5;
 let idle=select(glow,.07+.10*readiness,sleeping);
 let start=ease(useP/.12);let decay=1.0-ease((useP-.64)/.36);
 let pulse=select(0.0,1.0,state>1.5);
 let useEnvelope=select(0.0,start*decay,pulse>.5);
 let useExpand=select(0.0,useP,pulse>.5);
 let useCore=select(idle*(core+bloom*.46),useEnvelope*(core*(1.0+useExpand*.45)+bloom*.82),pulse>.5);
 let glowCore=select(idle*bloom*.56,useEnvelope*bloom*1.15,pulse>.5);
 let coolDim=select(1.0,.52,sleeping);
 let bodyLight=clamp(useCore*coolDim,0.0,.94);
 let halo=clamp(glowCore*coolDim,0.0,.52);
 let rgb=mix(c,vec3f(.97,.99,.88),.30);
 return vec4f(rgb*bodyLight+mix(rgb,vec3f(1.0,.92,.62),.28)*halo,clamp(bodyLight+halo*.52,0.0,.98));
}`;

 function insidePolygon(x,y,polygon){
  if(!Array.isArray(polygon)||polygon.length<3)return false;let inside=false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
   const [xi,yi]=polygon[i]||[],[xj,yj]=polygon[j]||[];
   if(![xi,yi,xj,yj].every(finite))return false;
   if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))inside=!inside;
  }return inside;
 }
 function plan({map,objectId,now,serverNow,phase,camera,zoom,viewport,reducedMotion=false,effects=[]}={}){
  const spec=OBJECTS[objectId],room=map?.rooms?.find(r=>r?.id===ROOM),object=map?.objects?.find(o=>o?.id===objectId);
  if(!spec||map?.id!==TYPE||!room||!Array.isArray(room.polygon)||!object||object.id!==spec.id||
   object.type!==spec.type||object.room!==ROOM||object.effectKind!==spec.effectKind||
   object.x!==spec.x||object.y!==spec.y||object.visualWidth!==spec.width||object.visualHeight!==spec.height||
   !finite(object.readyAt)||!finite(now)||!finite(serverNow)||phase!=='playing'||!Array.isArray(effects)||
   !camera||![camera.x,camera.y,zoom,viewport?.width,viewport?.height,viewport?.pixelWidth,viewport?.pixelHeight].every(finite)||
   zoom<=0||viewport.width<=0||viewport.height<=0||viewport.pixelWidth<=0||viewport.pixelHeight<=0||
   !Number.isInteger(viewport.pixelWidth)||!Number.isInteger(viewport.pixelHeight)||!insidePolygon(spec.x,spec.y,room.polygon))return null;
  const sx=zoom*viewport.pixelWidth/viewport.width,sy=zoom*viewport.pixelHeight/viewport.height;
  const centerX=(spec.x-camera.x)*sx,centerY=(spec.y-camera.y)*sy;
  const radiusX=Math.max(spec.width,spec.height)*.94*sx,radiusY=Math.max(spec.width,spec.height)*.94*sy;
  if(![centerX,centerY,radiusX,radiusY].every(finite)||centerX+radiusX<0||centerX-radiusX>viewport.pixelWidth||
   centerY+radiusY<0||centerY-radiusY>viewport.pixelHeight)return null;
  const active=effects.filter(e=>e?.type===`object-${spec.type}`&&e.objectId===spec.id&&e.effectKind===spec.effectKind)
   .filter(e=>e.id!=null&&String(e.id)!==''&&finite(e.startedAt)&&finite(e.duration)&&e.duration>0&&
    e.duration<=DURATION_MS&&e.x===spec.x&&e.y===spec.y&&e.radius===spec.radius&&String(e.playerId||'')&&
    now>=e.startedAt&&now<e.startedAt+Math.min(e.duration,DURATION_MS))
   .sort((a,b)=>Number(b.startedAt)-Number(a.startedAt));
  const event=active[0]||null,ready=object.readyAt<=serverNow;
  const state=event?2:ready?0:1;
  const progress=event?clamp((now-event.startedAt)/Math.min(event.duration,DURATION_MS),0,1):0;
  const readyProgress=ready?1:clamp(1-(object.readyAt-serverNow)/spec.cooldownMs,0,1);
  return Object.freeze({objectId:spec.id,type:spec.type,effectKind:spec.effectKind,silhouette:spec.silhouette,
   centerX,centerY,radiusX,radiusY,pixelWidth:viewport.pixelWidth,pixelHeight:viewport.pixelHeight,code:spec.code,progress,state,readyProgress,
   phaseSeed:seedFor(spec.id),ambientTime:now/1000,reducedMotion:Boolean(reducedMotion),
   eventId:event?String(event.id):'',durationMs:event?Math.min(event.duration,DURATION_MS):0,
   legacySuppressionId:event?String(event.id):'',
   sfx:Object.freeze(event?{owner:SFX_POLICY.owner,profile:spec.sfx,edge:'activation-event-once',eventId:String(event.id),playbackByCandidate:false}:
    {owner:SFX_POLICY.owner,profile:spec.sfx,edge:'none',playbackByCandidate:false})});
 }
 function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
 function seedFor(id){let h=2166136261;for(let i=0;i<id.length;i++)h=Math.imul(h^id.charCodeAt(i),16777619);return (h>>>0)%100000/100000*Math.PI*2;}
 function planAll({map,now,serverNow,phase,camera,zoom,viewport,reducedMotion=false,effects=[]}={}){
  const out=[];for(const id of Object.keys(OBJECTS)){const p=plan({map,objectId:id,now,serverNow,phase,camera,zoom,viewport,reducedMotion,effects});if(p)out.push(p);}
  return Object.freeze(out);
 }
 function pack(p){if(!p||!finite(p.centerX)||!finite(p.centerY)||!finite(p.radiusX)||!finite(p.radiusY)||
   !finite(p.phaseSeed)||!finite(p.progress)||!finite(p.readyProgress)||![0,1,2].includes(p.code)||![0,1,2].includes(p.state))
   throw new TypeError('Valid reactor-room object E plan required');
  const d=new Float32Array([p.pixelWidth,p.pixelHeight,p.centerX,p.centerY,p.radiusX,p.radiusY,p.phaseSeed,p.code,
   p.progress,p.state,p.reducedMotion?1:0,1,p.readyProgress,p.ambientTime||0,0,0]);
  // Pixel dimensions are filled by create-time frame viewport normalization below.
  if(!d.every(finite))throw new RangeError('Reactor object E exceeds float32 range');return d;}
 function create({renderer,frameOwner=renderer}={}){
  if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||!frameOwner.device?.queue?.writeBuffer||
   typeof frameOwner.own!=='function'||typeof frameOwner.release!=='function'||typeof frameOwner.format!=='string')
   throw new TypeError('Reactor object E requires shared ready WebGPU frame owner');
  const device=frameOwner.device,format=frameOwner.format,module=device.createShaderModule({label:'DVA reactor object E WGSL',code:shader});
  const pipeline=device.createRenderPipeline({label:'DVA reactor object E',layout:'auto',vertex:{module,entryPoint:'vs'},
   fragment:{module,entryPoint:'fs',targets:[{format,blend:{color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
    alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},primitive:{topology:'triangle-list'}});
  const slots=[],indices=new WeakMap();let destroyed=false;
  function slot(i){if(slots[i])return slots[i];const uniform=frameOwner.own(device.createBuffer({label:`DVA reactor object E ${i}`,size:FLOATS*4,usage:0x40|0x08}));
   const bindGroup=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:uniform}}]});return(slots[i]={uniform,bindGroup});}
  function record({frame,target,viewport,planned}={}){
   if(destroyed||frameOwner.state!=='ready')throw new Error('Reactor object E unavailable');
   if(typeof frame?.add!=='function'||typeof frame?.stage!=='function'||typeof target!=='string'||!target||!planned||
    viewport?.kind!=='main'||!finite(viewport.pixelWidth)||!finite(viewport.pixelHeight)||
    planned.pixelWidth!==viewport.pixelWidth||planned.pixelHeight!==viewport.pixelHeight)
    throw new TypeError('Reactor object E requires a current committed viewport plan');
   const i=indices.get(frame)||0,{uniform,bindGroup}=slot(i),packed=pack(planned);
   device.queue.writeBuffer(uniform,0,packed);frame.stage(`world:reactor-object-e:${planned.objectId}:${planned.eventId||'idle'}`);
   frame.add({target,label:`DVA reactor object E ${planned.objectId}`,encode(pass,info){
    if(info.device!==device||info.format!==format||info.width!==viewport.pixelWidth||info.height!==viewport.pixelHeight)
     throw new Error('Reactor object E target mismatch');
    pass.setPipeline(pipeline);pass.setBindGroup(0,bindGroup);pass.draw(3);
   }});indices.set(frame,i+1);return true;
  }
  return Object.freeze({plan,planAll,record,shader,get state(){return destroyed?'destroyed':frameOwner.state;},
   destroy(){if(destroyed)return;destroyed=true;for(const s of slots)if(frameOwner.release(s.uniform))s.uniform.destroy();slots.length=0;}});
 }
 const api=Object.freeze({TYPE,ROOM,DURATION_MS,OBJECTS,SFX_POLICY,shader,plan,planAll,pack,create});
 root.DvaWebGPUReactorRoomObjectsE=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
