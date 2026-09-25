/* Textureless WebGPU E candidates for two exact fixtures in the power room.
 * The matching cable-spool E stays separate; these designs do not share its
 * rotating reel, payout tail, or geometry. App/server/frame/audio remain hosts. */
(function(root){
 'use strict';
 const MAP_ID='station',ROOM_ID='power',DURATION_MS=2200,FLOATS=16;
 const OBJECTS=Object.freeze({
  'v302-power-powerCabinet-1':Object.freeze({id:'v302-power-powerCabinet-1',type:'powerCabinet',effectKind:'mana',
   x:279,y:1502,width:110,height:76,cooldownMs:38000,halfWidth:74,halfHeight:60,code:0,
   design:'folded-paper-and-lacquer-mana-shelf',requiredSfx:'paper-shade-mana-resonance'}),
  'v302-power-recharge-3':Object.freeze({id:'v302-power-recharge-3',type:'recharge',effectKind:'stamina',
   x:290,y:1907,width:110,height:76,cooldownMs:15000,halfWidth:70,halfHeight:60,code:1,
   design:'rest-seat-cushion-stamina-return',requiredSfx:'seat-cushion-returning-breath'})
 });
 const SFX_POLICY=Object.freeze({required:true,owner:'existing-server-world-sound',edge:'one-shot-per-server-sound-receipt-id',
  currentProfile:'object',customProfilesComplete:false,audioEdgeCorrelated:false,candidatePlayback:false,
  missing:Object.freeze({'v302-power-powerCabinet-1':'paper-shade-mana-resonance',
   'v302-power-recharge-3':'seat-cushion-returning-breath'}),idle:'none',cooldown:'none',loop:'none'});
 const finite=Number.isFinite;
 const shader=/* wgsl */`
struct Params{view:vec4f,geometry:vec4f,state:vec4f,extra:vec4f};
@group(0)@binding(0)var<uniform>p:Params;
struct Vertex{@builtin(position)position:vec4f};
@vertex fn vs(@builtin(vertex_index)i:u32)->Vertex{
 let v=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3))[i];var o:Vertex;o.position=vec4f(v,0,1);return o;
}
fn sq(v:f32)->f32{return v*v;}
fn line(v:f32,w:f32)->f32{return exp(-sq(v)/max(sq(w),.0001));}
fn box(p:vec2f,h:vec2f,r:f32)->f32{let q=abs(p)-h+vec2f(r);return length(max(q,vec2f(0)))+min(max(q.x,q.y),0)-r;}
struct Light{rgb:vec3f,alpha:f32,emission:vec3f};
fn evaluate(q:vec2f)->Light{
 let kind=p.geometry.z;let progress=p.state.x;let state=p.state.y;let reduced=p.state.z>.5;
 let activated=state>1.5;let ready=state>.5&&state<1.5;
 let idlePhase=select(p.extra.y*.18+kind*1.6,.38,reduced);let usePhase=select(progress,.5,reduced);
 let softReady=select(.11,.26,ready);
 let env=select(softReady,smoothstep(.015,.14,progress)*(1.0-smoothstep(.82,1.0,progress)),activated);
 var base=vec3f(0);var alpha=0.0;var glow=vec3f(0);
 if(kind<.5){
  // The power-room 行灯棚 is a broad folded-paper shade over a lacquer shelf.
  // Mana travels along paired, curved paper planes into an inset, not a
  // vertical lantern core or cable reel.
  let shelf=1.0-smoothstep(.02,.08,box(q-vec2f(0,.49),vec2f(.70,.13),.07));
  let shadeLeft=1.0-smoothstep(.02,.07,box(q-vec2f(-.37,-.16),vec2f(.34,.31),.12));
  let shadeRight=1.0-smoothstep(.02,.07,box(q-vec2f(.37,-.16),vec2f(.34,.31),.12));
  let foldA=line(q.y-(.20+.08*sin(q.x*2.0+idlePhase)),.045)*step(abs(q.x),.63);
  let foldB=line(q.y-(.02+.06*sin(q.x*2.0+idlePhase+1.4)),.035)*step(abs(q.x),.58);
  let foldC=line(q.y-(-.15+.05*sin(q.x*2.0+idlePhase+2.2)),.026)*step(abs(q.x),.49);
  let slit=line(q.y+.46,.026)*step(abs(q.x),.53);
  let drawX=mix(-.48,.48,usePhase);
  let manaThread=line(q.x-drawX,.045)*step(abs(q.y),.54)*select(0.0,1.0,activated);
  let paper=(shadeLeft+shadeRight)*.5;
  base=vec3f(.16,.23,.34)*(shelf*.34)+vec3f(.88,.68,.38)*(paper*.24+foldA*.38+foldB*.34+foldC*.30)+
       vec3f(.58,.91,1.0)*(slit*.32+manaThread*.55);
  alpha=clamp(shelf*.16+paper*.12+(foldA+foldB+foldC)*.19+slit*.16+manaThread*.30,0.0,.82);
  glow=vec3f(.28,.78,1.0)*(foldA*.26+foldB*.30+foldC*.28+slit*.32+manaThread*.85)*env;
 }else{
  // A cushioned rest seat gathers the stamina return through broad upholstery
  // seams and a single travelling, soft pressure wave; no annular basin/ring.
  let back=1.0-smoothstep(.02,.07,box(q-vec2f(0,-.42),vec2f(.61,.24),.12));
  let cushion=1.0-smoothstep(.02,.08,box(q-vec2f(0,.10),vec2f(.69,.29),.16));
  let arms=(1.0-smoothstep(.02,.07,box(q-vec2f(-.76,-.02),vec2f(.10,.37),.08)))+
           (1.0-smoothstep(.02,.07,box(q-vec2f(.76,-.02),vec2f(.10,.37),.08)));
  let seatRail=line(q.y-.52,.036)*step(abs(q.x),.68);
  let cushionSeam=line(q.y-.10,.023)*step(abs(q.x),.51);
  let waveX=mix(-.60,.60,usePhase);
  let returnWave=line(q.x-waveX,.055)*line(q.y-.06,.34)*cushion*select(.14,1.0,activated);
  let breathing=1.0+.08*sin(idlePhase*1.4);
  base=vec3f(.16,.29,.28)*(back*.36+arms*.28)+vec3f(.36,.68,.60)*(cushion*.36+seatRail*.30)+
       vec3f(.77,.98,.73)*(cushionSeam*.18+returnWave*.72)*breathing;
  alpha=clamp(back*.12+arms*.11+cushion*.18+seatRail*.16+cushionSeam*.08+returnWave*.38,0.0,.78);
  glow=vec3f(.38,1.0,.64)*(cushionSeam*.26+returnWave*.88)*env*breathing;
 }
 if(state<.5){base*=.62;glow*=.36;alpha*=.74;}
 if(ready){base*=1.08;glow*=1.22;alpha=min(.88,alpha*1.08);}
 return Light(base,alpha,glow);
}
@fragment fn fsBase(@builtin(position)px:vec4f)->@location(0)vec4f{
 let q=(px.xy-p.view.zw)/max(p.geometry.xy,vec2f(.001));let e=evaluate(q);return vec4f(e.rgb*e.alpha*p.state.w,e.alpha*p.state.w);
}
@fragment fn fsEmission(@builtin(position)px:vec4f)->@location(0)vec4f{
 let q=(px.xy-p.view.zw)/max(p.geometry.xy,vec2f(.001));let e=evaluate(q);return vec4f(e.emission*p.state.w,0.0);
}`;
 function inside(x,y,poly){if(!Array.isArray(poly)||poly.length<3)return false;let v=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];if(!Array.isArray(a)||!Array.isArray(b)||![a[0],a[1],b[0],b[1]].every(finite))return false;
  if(((a[1]>y)!==(b[1]>y))&&(x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]))v=!v;}return v;}
 function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
 function rectDistance(x,y,r){const dx=Math.max(r.x-x,0,x-(r.x+r.w)),dy=Math.max(r.y-y,0,y-(r.y+r.h));return Math.hypot(dx,dy);}
 function rectRectDistance(a,b){const dx=Math.max(b.x-(a.x+a.w),a.x-(b.x+b.w),0),dy=Math.max(b.y-(a.y+a.h),a.y-(b.y+b.h),0);return Math.hypot(dx,dy);}
 function plan({map,objectId,now,serverNow,phase,effects=[],camera,zoom,viewport,reducedMotion=false}={}){
  const spec=OBJECTS[objectId],room=map?.rooms?.find(r=>r?.id===ROOM_ID),object=map?.objects?.find(o=>o?.id===objectId);
  if(!spec||map?.id!==MAP_ID||!room||room.x!==40||room.y!==1250||room.w!==1040||room.h!==900||!Array.isArray(room.polygon)||
   !object||object.type!==spec.type||object.room!==ROOM_ID||object.effectKind!==spec.effectKind||object.x!==spec.x||object.y!==spec.y||
   object.visualWidth!==spec.width||object.visualHeight!==spec.height||object.cooldownMs!==spec.cooldownMs||!finite(object.readyAt)||
   !finite(now)||!finite(serverNow)||phase!=='playing'||!Array.isArray(effects)||!camera||
   ![camera.x,camera.y,zoom,viewport?.width,viewport?.height,viewport?.pixelWidth,viewport?.pixelHeight].every(finite)||
   zoom<=0||viewport.width<=0||viewport.height<=0||viewport.kind!=='main'||!Number.isInteger(viewport.pixelWidth)||
   !Number.isInteger(viewport.pixelHeight)||viewport.pixelWidth<=0||viewport.pixelHeight<=0||!inside(spec.x,spec.y,room.polygon))return null;
  const zone={x:spec.x-spec.halfWidth,y:spec.y-spec.halfHeight,w:spec.halfWidth*2,h:spec.halfHeight*2};
  if(![[zone.x,zone.y],[zone.x+zone.w,zone.y],[zone.x,zone.y+zone.h],[zone.x+zone.w,zone.y+zone.h]].every(([x,y])=>inside(x,y,room.polygon)))return null;
  const otherObjects=(map.objects||[]).filter(o=>o.room===ROOM_ID&&o.id!==spec.id);
  if(otherObjects.some(o=>rectDistance(o.x,o.y,zone)<Math.max(o.visualWidth||0,o.visualHeight||0)*.70))return null;
  const doors=[['d-power-storage',1065,1685,30,130]];
  for(const [id,x,y,w,h]of doors){const d=(map.doors||[]).find(v=>v.id===id);
   if(!d||d.x!==x||d.y!==y||d.w!==w||d.h!==h||rectRectDistance(zone,d)<30)return null;}
  const paths=[['a02',450,840,200,410],['a15',980,1660,120,180]];
  for(const [id,x,y,w,h]of paths){const c=(map.corridors||[]).find(v=>v.id===id);
   if(!c||c.x!==x||c.y!==y||c.w!==w||c.h!==h||rectRectDistance(zone,c)<20)return null;}
  if((map.objectSpaces||[]).filter(s=>s.room===ROOM_ID).some(s=>rectDistance(s.x+s.w/2,s.y+s.h/2,zone)<Math.max(s.w,s.h)*.55))return null;
  const sx=zoom*viewport.pixelWidth/viewport.width,sy=zoom*viewport.pixelHeight/viewport.height;
  const centerX=(spec.x-camera.x)*sx,centerY=(spec.y-camera.y)*sy,radiusX=spec.halfWidth*sx,radiusY=spec.halfHeight*sy;
  if(![centerX,centerY,radiusX,radiusY].every(finite)||centerX+radiusX<0||centerX-radiusX>viewport.pixelWidth||
   centerY+radiusY<0||centerY-radiusY>viewport.pixelHeight)return null;
  const events=effects.filter(e=>e?.type===`object-${spec.type}`&&e.objectId===spec.id&&e.effectKind===spec.effectKind&&
   typeof e.id==='string'&&e.id.length>0&&e.x===spec.x&&e.y===spec.y&&e.radius===100&&typeof e.playerId==='string'&&e.playerId.length>0&&
   finite(e.startedAt)&&finite(e.duration)&&e.duration>0&&e.duration<=DURATION_MS&&now>=e.startedAt&&now<e.startedAt+e.duration)
   .sort((a,b)=>b.startedAt-a.startedAt);
  const event=events[0]||null,ready=object.readyAt<=serverNow,state=event?2:ready?1:0;
  const progress=event?clamp((now-event.startedAt)/event.duration,0,1):0;
  return Object.freeze({objectId:spec.id,type:spec.type,effectKind:spec.effectKind,design:spec.design,code:spec.code,
   centerX,centerY,radiusX,radiusY,pixelWidth:viewport.pixelWidth,pixelHeight:viewport.pixelHeight,state,progress,
   readyProgress:ready?1:clamp(1-(object.readyAt-serverNow)/spec.cooldownMs,0,1),ambientTime:now/1000,
   reducedMotion:Boolean(reducedMotion),eventId:event?event.id:'',durationMs:event?event.duration:0,
   sfx:Object.freeze({required:true,audioMissing:true,owner:'server',currentProfile:'object',eventId:event?event.id:'',
    edge:event?'same-success-path-generic-sound-receipt':'none',audioEdgeCorrelated:false,candidatePlayback:false,missingProfile:spec.requiredSfx})});
 }
 function planAll(args={}){return Object.freeze(Object.keys(OBJECTS).flatMap(id=>{const p=plan({...args,objectId:id});return p?[p]:[]}));}
 function pack(p){if(!p||!OBJECTS[p.objectId]||![p.centerX,p.centerY,p.radiusX,p.radiusY,p.pixelWidth,p.pixelHeight,p.progress,p.state,
  p.readyProgress,p.ambientTime].every(finite)||![0,1,2].includes(p.state))throw new TypeError('Valid power-room object E plan required');
  const d=new Float32Array([p.pixelWidth,p.pixelHeight,p.centerX,p.centerY,p.radiusX,p.radiusY,p.code,0,p.progress,p.state,
   p.reducedMotion?1:0,1,p.readyProgress,p.ambientTime,0,0]);if(!d.every(finite))throw new RangeError('Power-room object E exceeds float32 range');return d;}
 function create({renderer,frameOwner=renderer}={}){
  if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||!frameOwner.device?.queue?.writeBuffer||
   !frameOwner.device?.createBindGroupLayout||!frameOwner.device?.createPipelineLayout||typeof frameOwner.own!=='function'||
   typeof frameOwner.release!=='function'||typeof frameOwner.format!=='string')throw new TypeError('Power-room object E requires shared ready WebGPU frame owner');
  const device=frameOwner.device,format=frameOwner.format,module=device.createShaderModule({label:'DVA power room object E WGSL',code:shader});
  const layout=device.createBindGroupLayout({entries:[{binding:0,visibility:0x1|0x2,buffer:{type:'uniform'}}]});
  const pipelineLayout=device.createPipelineLayout({bindGroupLayouts:[layout]});
  const make=(entry,label,blend)=>device.createRenderPipeline({label,layout:pipelineLayout,vertex:{module,entryPoint:'vs'},
   fragment:{module,entryPoint:entry,targets:[{format,blend}]},primitive:{topology:'triangle-list'}});
  const base=make('fsBase','DVA power room object E surface',{color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
   alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}});
  const emission=make('fsEmission','DVA power room object E emission',{color:{srcFactor:'one',dstFactor:'one',operation:'add'},
   alpha:{srcFactor:'zero',dstFactor:'one',operation:'add'}});
  const slots=[],indices=new WeakMap(),seenByFrame=new WeakMap();let destroyed=false;
  function slot(i){if(slots[i])return slots[i];const uniform=frameOwner.own(device.createBuffer({label:`DVA power room object E slot ${i}`,size:FLOATS*4,usage:0x40|0x08}));
   const bind=device.createBindGroup({layout,entries:[{binding:0,resource:{buffer:uniform}}]});return(slots[i]={uniform,bind});}
  function record({frame,target,viewport,planned}={}){
   if(destroyed||frameOwner.state!=='ready')throw new Error('Power-room object E unavailable');
   if(!frame||typeof frame.stage!=='function'||typeof frame.add!=='function'||typeof target!=='string'||!target||!planned||
    viewport?.kind!=='main'||planned.pixelWidth!==viewport.pixelWidth||planned.pixelHeight!==viewport.pixelHeight)
    throw new TypeError('Power-room object E requires current main-frame plan');
   let seen=seenByFrame.get(frame);if(!seen){seen=new Set();seenByFrame.set(frame,seen);}
   if(planned.eventId&&seen.has(planned.eventId))return Object.freeze({drawn:false,duplicate:true,audioMissing:true});
   if(planned.eventId)seen.add(planned.eventId);const i=indices.get(frame)||0;if(i>=2)throw new RangeError('At most two power objects may be recorded per frame');
   const s=slot(i);device.queue.writeBuffer(s.uniform,0,pack(planned));frame.stage(`world:power-object-e:${planned.objectId}:${planned.eventId||'state'}`);
   for(const [pipe,layer]of[[base,'material'],[emission,'emission']])frame.add({target,label:`world:${planned.design}:${layer}`,
    encode(pass,info){if(info.device!==device||info.format!==format||info.width!==viewport.pixelWidth||info.height!==viewport.pixelHeight)
     throw new Error('Power-room object E target mismatch');pass.setPipeline(pipe);pass.setBindGroup(0,s.bind);pass.draw(3);}});
   indices.set(frame,i+1);return Object.freeze({drawn:true,objectId:planned.objectId,eventId:planned.eventId,layers:2,
    audioMissing:true,audioEdge:planned.sfx.edge,audioEdgeCorrelated:false});
  }
  return Object.freeze({plan,planAll,record,shader,get state(){return destroyed?'destroyed':frameOwner.state;},destroy(){if(destroyed)return;destroyed=true;
   for(const s of slots)if(frameOwner.release(s.uniform))s.uniform.destroy();slots.length=0;}});
 }
 const api=Object.freeze({MAP_ID,ROOM_ID,DURATION_MS,OBJECTS,SFX_POLICY,shader,plan,planAll,pack,create});
 root.DvaWebGPUPowerRoomObjectsE=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
