/* Textureless WebGPU E candidates for three exact storage-room fixtures.
 * Visual plans follow accepted object-use receipts and shared frame ownership.
 * The server's generic object SFX exists, but its per-object sound contract is
 * not implemented or correlated, so each candidate reports audioMissing. */
(function(root){
 'use strict';
 const MAP_ID='station',ROOM_ID='storage',DURATION_MS=2200,FLOATS=16;
 const OBJECTS=Object.freeze({
  'v302-storage-cargoCrate-1':Object.freeze({id:'v302-storage-cargoCrate-1',type:'cargoCrate',effectKind:'credits',
   x:1203,y:1696,width:110,height:76,cooldownMs:34000,halfWidth:66,halfHeight:54,code:0,
   design:'wooden-preservation-crate-credit-inlay',requiredSfx:'wooden-lid-credit-inlay-chime'}),
  'v302-storage-palletJack-2':Object.freeze({id:'v302-storage-palletJack-2',type:'palletJack',effectKind:'acceleration',
   x:1600,y:1696,width:110,height:76,cooldownMs:34000,halfWidth:70,halfHeight:58,code:1,
   design:'wicker-cart-caster-inertia',requiredSfx:'wicker-caster-roll-and-cloth-rush'}),
  'v302-storage-equipmentLocker-3':Object.freeze({id:'v302-storage-equipmentLocker-3',type:'equipmentLocker',effectKind:'stamina',
   x:1210,y:2011,width:110,height:76,cooldownMs:36000,halfWidth:72,halfHeight:58,code:2,
   design:'linen-rack-unfolding-stamina',requiredSfx:'linen-unfold-and-stamina-tone'})
 });
 const SFX_POLICY=Object.freeze({required:true,owner:'existing-server-world-sound',edge:'one-shot-per-server-sound-receipt-id',
  currentProfile:'object',customProfilesComplete:false,audioEdgeCorrelated:false,candidatePlayback:false,
  missing:Object.freeze({'v302-storage-cargoCrate-1':'wooden-lid-credit-inlay-chime',
   'v302-storage-palletJack-2':'wicker-caster-roll-and-cloth-rush',
   'v302-storage-equipmentLocker-3':'linen-unfold-and-stamina-tone'}),idle:'none',cooldown:'none',loop:'none'});
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
 let active=state>1.5;let ready=state>.5&&state<1.5;
 let idleTime=select(p.extra.y*.23+kind*1.91,.39,reduced);
 let t=select(progress,.48,reduced);
 let idleStrength=select(.10,.24,ready);
 let envelope=select(idleStrength,smoothstep(.01,.12,progress)*(1.0-smoothstep(.82,1.0,progress)),active);
 var base=vec3f(0);var alpha=0.0;var glow=vec3f(0);
 if(kind<.5){
  // Preserved timber: broad lid boards part around an inset, and three large
  // credit seals lift as one grouped reward. No generic coin-particle spray.
  let lid=1.0-smoothstep(.02,.07,box(q-vec2f(0,-.48),vec2f(.72,.20),.08));
  let seam=line(q.y+.18,.028)*step(abs(q.x),.67);
  let grain=(line(q.y+.61,.035)+line(q.y+.43,.026)+line(q.y-.68,.035))*step(abs(q.x),.74);
  let inside=1.0-smoothstep(.02,.07,box(q-vec2f(0,.23),vec2f(.55,.28),.10));
  let rise=.25+.60*t;
  let sealA=line(length(q-vec2f(-.38,rise-.22))-.105,.024);
  let sealB=line(length(q-vec2f(0,rise-.22))-.105,.024);
  let sealC=line(length(q-vec2f(.38,rise-.22))-.105,.024);
  let seals=(sealA+sealB+sealC)*inside*select(0.18,1.0,active);
  let open=select(.10,smoothstep(.02,.22,t),active);
  base=vec3f(.36,.20,.105)*(lid*.48+grain*.22)+vec3f(.91,.55,.20)*(seam*.62+grain*.16)+
       vec3f(.98,.78,.36)*(inside*.14+seals*.82*open);
  alpha=clamp(lid*.18+grain*.06+seam*.21+inside*.12+seals*.50*open,0.0,.82);
  glow=vec3f(1.0,.59,.16)*(seam*.28+seals*.83*open)*envelope;
 }else if(kind<1.5){
  // A woven handcart receives an in-place caster acceleration: paired broad
  // wheel treads turn in opposite phase and a short bilateral inertia wake
  // avoids inventing a travel direction absent from the use-event payload.
  let a=atan2(q.y+.49,q.x-.55)+idleTime*2.4+t*6.2831853;
  let b=atan2(q.y+.49,q.x+.55)-idleTime*2.4-t*6.2831853;
  let wheelA=line(length(q-vec2f(.55,-.49))-.22,.045);
  let wheelB=line(length(q-vec2f(-.55,-.49))-.22,.045);
  let spokes=line(sin(a*2.0),.10)*step(.18,length(q-vec2f(.55,-.49)))*step(length(q-vec2f(.55,-.49)),.30);
  let spokesB=(line(sin(b*2.0),.10))*step(.18,length(q-vec2f(-.55,-.49)))*step(length(q-vec2f(-.55,-.49)),.30);
  let basket=1.0-smoothstep(.02,.07,box(q-vec2f(0,-.06),vec2f(.72,.31),.09));
  let weave=(line(q.y+.23,.028)+line(q.y+.06,.026)+line(q.y-.11,.026))*step(abs(q.x),.64);
  let upright=line(abs(q.x)-.72,.035)*step(q.y,.48)*step(-.38,q.y);
  let wake=(line(q.x-.80,.075)+line(q.x+.80,.075))*line(q.y+.50,.28);
  let roll=wheelA+wheelB+spokes*.42+spokesB*.42;
  base=vec3f(.45,.28,.15)*(basket*.42+upright*.36)+vec3f(.82,.63,.37)*weave*.58+
       vec3f(.35,.90,1.0)*(roll*.43+wake*select(.04,.65,active));
  alpha=clamp(basket*.17+weave*.17+upright*.14+roll*.30+wake*select(.02,.22,active),0.0,.77);
  glow=vec3f(.14,.70,1.0)*(roll*.30+wake*.72)*envelope;
 }else{
  // Storage-specific linen rack, not a security-equipment cabinet: two
  // sliding cupboard leaves reveal three soft folded-cloth layers and seams.
  let shell=1.0-smoothstep(.02,.07,box(q,vec2f(.76,.70),.08));
  let doorLeft=1.0-smoothstep(.02,.07,box(q-vec2f(-.30,0),vec2f(.35,.62),.045));
  let doorRight=1.0-smoothstep(.02,.07,box(q-vec2f(.30,0),vec2f(.35,.62),.045));
  let gap=select(0.0,.35*smoothstep(.02,.42,t),active);
  let foldY=q.y+.39;
  let linen1=line(foldY-.02,.075)*step(abs(q.x-gap),.46);
  let linen2=line(foldY-.29,.075)*step(abs(q.x+gap),.46);
  let linen3=line(foldY-.56,.075)*step(abs(q.x-gap*.45),.46);
  let seam=(line(foldY-.10,.018)+line(foldY-.37,.018)+line(foldY-.64,.018))*step(abs(q.x),.41);
  let leaves=doorLeft+doorRight;
  let expose=select(.13,smoothstep(.02,.30,t),active);
  let breathe=.90+.10*sin(idleTime*1.6);
  base=vec3f(.24,.37,.34)*(shell*.16+leaves*.22)+vec3f(.65,.90,.78)*(linen1+linen2+linen3)*expose*breathe*.49+
       vec3f(.38,.96,.73)*seam*expose;
  alpha=clamp(shell*.10+leaves*.12+(linen1+linen2+linen3)*expose*.24+seam*expose*.22,0.0,.80);
  glow=vec3f(.22,1.0,.67)*((linen1+linen2+linen3)*.66+seam*.48)*expose*breathe*envelope;
 }
 if(state<.5){base*=.62;glow*=.38;alpha*=.76;}
 if(ready){base*=1.08;glow*=1.20;alpha=min(.88,alpha*1.08);}
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
  if(!spec||map?.id!==MAP_ID||!room||room.x!==1030||room.y!==1500||room.w!==750||room.h!==700||
   !Array.isArray(room.polygon)||!object||object.type!==spec.type||object.room!==ROOM_ID||object.effectKind!==spec.effectKind||
   object.x!==spec.x||object.y!==spec.y||object.visualWidth!==spec.width||object.visualHeight!==spec.height||
   object.cooldownMs!==spec.cooldownMs||!finite(object.readyAt)||!finite(now)||!finite(serverNow)||phase!=='playing'||
   !Array.isArray(effects)||!camera||![camera.x,camera.y,zoom,viewport?.width,viewport?.height,viewport?.pixelWidth,viewport?.pixelHeight].every(finite)||
   zoom<=0||viewport.width<=0||viewport.height<=0||viewport.kind!=='main'||!Number.isInteger(viewport.pixelWidth)||
   !Number.isInteger(viewport.pixelHeight)||viewport.pixelWidth<=0||viewport.pixelHeight<=0||!inside(spec.x,spec.y,room.polygon))return null;
  const zone={x:spec.x-spec.halfWidth,y:spec.y-spec.halfHeight,w:spec.halfWidth*2,h:spec.halfHeight*2};
  const corners=[[zone.x,zone.y],[zone.x+zone.w,zone.y],[zone.x,zone.y+zone.h],[zone.x+zone.w,zone.y+zone.h]];
  if(!corners.every(([x,y])=>inside(x,y,room.polygon)))return null;
  const others=(map.objects||[]).filter(o=>o.room===ROOM_ID&&o.id!==spec.id);
  if(others.some(o=>rectDistance(o.x,o.y,zone)<Math.max(o.visualWidth||0,o.visualHeight||0)*.7))return null;
  if((map.objectSpaces||[]).filter(o=>o.room===ROOM_ID).some(o=>rectDistance(o.x+o.w/2,o.y+o.h/2,zone)<Math.max(o.w,o.h)*.55))return null;
  const clearings=[['d-power-storage',1065,1685,30,130],['d-storage-atrium',1765,1750,30,130]];
  for(const [id,x,y,w,h] of clearings){const d=(map.doors||[]).find(v=>v.id===id);
   if(!d||d.x!==x||d.y!==y||d.w!==w||d.h!==h||rectDistance(d.x+d.w/2,d.y+d.h/2,zone)<32)return null;}
  const paths=[['a15',980,1660,120,180],['a16',1700,1720,150,190]];
  for(const [id,x,y,w,h] of paths){const c=(map.corridors||[]).find(v=>v.id===id);
   if(!c||c.x!==x||c.y!==y||c.w!==w||c.h!==h||rectRectDistance(zone,c)<20)return null;}
  const sx=zoom*viewport.pixelWidth/viewport.width,sy=zoom*viewport.pixelHeight/viewport.height;
  const centerX=(spec.x-camera.x)*sx,centerY=(spec.y-camera.y)*sy,radiusX=spec.halfWidth*sx,radiusY=spec.halfHeight*sy;
  const valid=effects.filter(e=>e?.type===`object-${spec.type}`&&e.objectId===spec.id&&e.effectKind===spec.effectKind&&
   typeof e.id==='string'&&e.id&&e.x===spec.x&&e.y===spec.y&&e.radius===100&&typeof e.playerId==='string'&&e.playerId&&
   finite(e.startedAt)&&finite(e.duration)&&e.duration>0&&e.duration<=DURATION_MS&&now>=e.startedAt&&now<e.startedAt+e.duration)
   .sort((a,b)=>b.startedAt-a.startedAt);
  const event=valid[0]||null,ready=object.readyAt<=serverNow,state=event?2:ready?1:0;
  const progress=event?clamp((now-event.startedAt)/event.duration,0,1):0;
  if(![centerX,centerY,radiusX,radiusY].every(finite)||centerX+radiusX<0||centerX-radiusX>viewport.pixelWidth||
   centerY+radiusY<0||centerY-radiusY>viewport.pixelHeight)return null;
  return Object.freeze({objectId:spec.id,type:spec.type,effectKind:spec.effectKind,design:spec.design,code:spec.code,
   centerX,centerY,radiusX,radiusY,pixelWidth:viewport.pixelWidth,pixelHeight:viewport.pixelHeight,state,progress,
   readyProgress:ready?1:clamp(1-(object.readyAt-serverNow)/spec.cooldownMs,0,1),ambientTime:now/1000,
   reducedMotion:Boolean(reducedMotion),eventId:event?event.id:'',durationMs:event?event.duration:0,
   sfx:Object.freeze({required:true,audioMissing:true,owner:'server',currentProfile:'object',
    eventId:event?event.id:'',edge:event?'same-success-path-generic-sound-receipt':'none',
    audioEdgeCorrelated:false,candidatePlayback:false,missingProfile:spec.requiredSfx})});
 }
 function planAll(args={}){return Object.freeze(Object.keys(OBJECTS).flatMap(id=>{const p=plan({...args,objectId:id});return p?[p]:[]}));}
 function pack(p){if(!p||!OBJECTS[p.objectId]||![p.centerX,p.centerY,p.radiusX,p.radiusY,p.pixelWidth,p.pixelHeight,
  p.progress,p.state,p.readyProgress,p.ambientTime].every(finite)||![0,1,2].includes(p.state))throw new TypeError('Valid storage object E plan required');
  const d=new Float32Array([p.pixelWidth,p.pixelHeight,p.centerX,p.centerY,p.radiusX,p.radiusY,p.code,0,
   p.progress,p.state,p.reducedMotion?1:0,1,p.readyProgress,p.ambientTime,0,0]);
  if(!d.every(finite))throw new RangeError('Storage object E exceeds float32 range');return d;}
 function create({renderer,frameOwner=renderer}={}){
  if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||!frameOwner.device?.queue?.writeBuffer||
   !frameOwner.device?.createBindGroupLayout||!frameOwner.device?.createPipelineLayout||
   typeof frameOwner.own!=='function'||typeof frameOwner.release!=='function'||typeof frameOwner.format!=='string')
   throw new TypeError('Storage object E requires shared ready WebGPU frame owner');
  const device=frameOwner.device,format=frameOwner.format,module=device.createShaderModule({label:'DVA storage object E WGSL',code:shader});
  const layout=device.createBindGroupLayout({entries:[{binding:0,visibility:0x1|0x2,buffer:{type:'uniform'}}]});
  const pipelineLayout=device.createPipelineLayout({bindGroupLayouts:[layout]});
  const pipeline=(entry,label,blend)=>device.createRenderPipeline({label,layout:pipelineLayout,vertex:{module,entryPoint:'vs'},
   fragment:{module,entryPoint:entry,targets:[{format,blend}]},primitive:{topology:'triangle-list'}});
  const base=pipeline('fsBase','DVA storage fixture E surface',{color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
   alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}});
  const emission=pipeline('fsEmission','DVA storage fixture E emission',{color:{srcFactor:'one',dstFactor:'one',operation:'add'},
   alpha:{srcFactor:'zero',dstFactor:'one',operation:'add'}});
  const slots=[],indices=new WeakMap(),seenByFrame=new WeakMap();let destroyed=false;
  function slot(i){if(slots[i])return slots[i];const uniform=frameOwner.own(device.createBuffer({label:`DVA storage object E slot ${i}`,size:FLOATS*4,usage:0x40|0x08}));
   const bind=device.createBindGroup({layout,entries:[{binding:0,resource:{buffer:uniform}}]});return(slots[i]={uniform,bind});}
  function record({frame,target,viewport,planned}={}){
   if(destroyed||frameOwner.state!=='ready')throw new Error('Storage object E unavailable');
   if(!frame||typeof frame.stage!=='function'||typeof frame.add!=='function'||typeof target!=='string'||!target||!planned||
    viewport?.kind!=='main'||planned.pixelWidth!==viewport.pixelWidth||planned.pixelHeight!==viewport.pixelHeight)
    throw new TypeError('Storage object E requires current main-frame plan');
   let seen=seenByFrame.get(frame);if(!seen){seen=new Set();seenByFrame.set(frame,seen);}
   if(planned.eventId&&seen.has(planned.eventId))return Object.freeze({drawn:false,duplicate:true,audioMissing:true});
   if(planned.eventId)seen.add(planned.eventId);
   const i=indices.get(frame)||0;if(i>=3)throw new RangeError('At most three storage objects may be recorded per frame');
   const s=slot(i);device.queue.writeBuffer(s.uniform,0,pack(planned));
   frame.stage(`world:storage-object-e:${planned.objectId}:${planned.eventId||'state'}`);
   for(const [pipe,layer]of[[base,'material'],[emission,'emission']])frame.add({target,label:`world:${planned.design}:${layer}`,
    encode(pass,info){if(info.device!==device||info.format!==format||info.width!==viewport.pixelWidth||info.height!==viewport.pixelHeight)
     throw new Error('Storage object E target mismatch');pass.setPipeline(pipe);pass.setBindGroup(0,s.bind);pass.draw(3);}});
   indices.set(frame,i+1);return Object.freeze({drawn:true,objectId:planned.objectId,eventId:planned.eventId,layers:2,
    audioMissing:true,audioEdge:planned.sfx.edge,audioEdgeCorrelated:false});
  }
  return Object.freeze({plan,planAll,record,shader,get state(){return destroyed?'destroyed':frameOwner.state;},destroy(){if(destroyed)return;destroyed=true;
   for(const s of slots)if(frameOwner.release(s.uniform))s.uniform.destroy();slots.length=0;}});
 }
 const api=Object.freeze({MAP_ID,ROOM_ID,DURATION_MS,OBJECTS,SFX_POLICY,shader,plan,planAll,pack,create});
 root.DvaWebGPUStorageRoomObjectsE=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
