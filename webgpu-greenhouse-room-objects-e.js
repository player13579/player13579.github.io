/* Textureless WebGPU E candidates for three exact greenhouse fixtures.
 * These effects react to accepted uses; they do not claim plant growth,
 * compost transformation, or any state not present in the server payload. */
(function(root){
 'use strict';
 const MAP_ID='station',ROOM_ID='greenhouse',DURATION_MS=2200,FLOATS=16;
 const OBJECTS=Object.freeze({
  'v302-greenhouse-greenhousePlanter-1':Object.freeze({id:'v302-greenhouse-greenhousePlanter-1',type:'aromaticGarden',effectKind:'luckBoost',
   x:303,y:2652,width:110,height:76,cooldownMs:18000,effectAmount:.15,effectDurationMs:24000,
   halfWidth:76,halfHeight:62,code:0,design:'compound-leaf-luck-refraction',requiredSfx:'compound-leaf-luck-tone'}),
  'v302-greenhouse-mistSprayer-2':Object.freeze({id:'v302-greenhouse-mistSprayer-2',type:'restorativeMist',effectKind:'luckBoost',
   x:817,y:2652,width:110,height:76,cooldownMs:18000,effectAmount:.12,effectDurationMs:20000,
   halfWidth:76,halfHeight:62,code:1,design:'fan-sheet-herbal-mist-luck',requiredSfx:'herbal-mist-fan-release'}),
  'v302-greenhouse-compostUnit-3':Object.freeze({id:'v302-greenhouse-compostUnit-3',type:'herbPreparationTable',effectKind:'heal',
   x:313,y:3057,width:110,height:76,cooldownMs:34000,effectAmount:1,
   halfWidth:76,halfHeight:62,code:2,design:'herb-dose-mortar-heal-pulse',requiredSfx:'herb-dose-mortar-resonance'})
 });
 const SFX_POLICY=Object.freeze({required:true,owner:'server-success-use-world-sound',edge:'one-shot-per-accepted-use-receipt',
  genericProfile:'object',genericEventIdCorrelated:false,customProfilesComplete:false,candidatePlayback:false,
  existingAmbient:Object.freeze({owner:'komorebi-greenhouse',profile:'woodsAir',scope:'room',source:'environment-sound-receipt',
   excludedFromFixtureE:true}),missing:Object.freeze({
   'v302-greenhouse-greenhousePlanter-1':'compound-leaf-luck-tone',
   'v302-greenhouse-mistSprayer-2':'herbal-mist-fan-release',
   'v302-greenhouse-compostUnit-3':'herb-dose-mortar-resonance'}),idle:'none',cooldown:'none',loop:'none'});
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
fn leaf(q:vec2f,c:vec2f,a:f32,s:vec2f)->f32{
 let d=q-c;let r=vec2f(cos(a)*d.x+sin(a)*d.y,-sin(a)*d.x+cos(a)*d.y)/s;
 let body=1.0-smoothstep(.82,1.0,length(vec2f(r.x*1.08,r.y)));
 return body*step(abs(r.x),.98);
}
struct Light{rgb:vec3f,alpha:f32,emission:vec3f};
fn evaluate(q:vec2f)->Light{
 let kind=p.geometry.z;let progress=p.state.x;let state=p.state.y;let reduced=p.state.z>.5;
 let active=state>1.5;let ready=state>.5&&state<1.5;
 let time=select(p.extra.y,0.0,reduced);let useT=select(progress,.48,reduced);
 var rgb=vec3f(0);var alpha=0.0;var emission=vec3f(0);
 if(kind<.5){
  // Aromatic garden: three broad compound leaves stay rooted in place. The
  // accepted luck event travels through their midribs; no growth is asserted.
  let l0=leaf(q,vec2f(-.35,.02),-.32,vec2f(.35,.38));
  let l1=leaf(q,vec2f(.34,.02),.34,vec2f(.35,.38));
  let l2=leaf(q,vec2f(0,-.27),-1.5708,vec2f(.32,.34));
  let mid0=line(q.y-(.02+.30*(q.x+.35)),.021)*l0;
  let mid1=line(q.y-(.02-.30*(q.x-.34)),.021)*l1;
  let mid2=line(q.x,.022)*l2;
  let pulse0=select(0.0,1.0,active)*line(useT-.24,.16);
  let pulse1=select(0.0,1.0,active)*line(useT-.53,.16);
  let pulse2=select(0.0,1.0,active)*line(useT-.78,.14);
  let pot=1.0-smoothstep(.02,.065,abs(q.y-.54))*step(abs(q.x),.52);
  let silhouette=(l0+l1+l2)*.33;
  rgb=vec3f(.20,.36,.20)*silhouette+vec3f(.48,.80,.40)*(mid0+mid1+mid2)*.34+
      vec3f(.48,.30,.16)*pot*.45+vec3f(.88,.92,.49)*(pulse0*l0+pulse1*l1+pulse2*l2)*.72;
  alpha=clamp(silhouette*.29+pot*.16+(mid0+mid1+mid2)*.10+(pulse0*l0+pulse1*l1+pulse2*l2)*.28,0.0,.84);
  emission=vec3f(.78,1.0,.40)*(mid0*.18+mid1*.18+mid2*.20+(pulse0*l0+pulse1*l1+pulse2*l2)*.92);
 }else if(kind<1.5){
  // Restorative-mist vessel: three broad, curved fan sheets release and fold
  // back in. No leaf/pollen particles and no room-wide drifting foliage.
  let vessel=1.0-smoothstep(.025,.075,abs(q.y-.56))*step(abs(q.x),.44);
  let rim=line(q.y-.37,.035)*step(abs(q.x),.51);
  let fanX=q.x;
  let curve0=q.y-(.18+.17*fanX*fanX+.055*sin(fanX*3.1+useT*2.2));
  let curve1=q.y-(-.01+.12*fanX*fanX+.044*sin(fanX*2.7-useT*1.7));
  let curve2=q.y-(-.18+.075*fanX*fanX+.032*sin(fanX*3.5+useT*1.2));
  let sheets=(line(curve0,.052)+line(curve1,.044)+line(curve2,.034))*step(abs(fanX),.87);
  let gather=select(0.0,1.0,active)*(1.0-smoothstep(.70,1.0,useT));
  let fold=line(q.y-(.04+.08*sin(q.x*3.0)),.055)*step(abs(q.x),.52)*gather;
  rgb=vec3f(.13,.34,.36)*vessel*.48+vec3f(.40,.72,.69)*(sheets*.36+rim*.23)+
      vec3f(.88,.91,.57)*(sheets*gather*.48+fold*.58);
  alpha=clamp(vessel*.13+rim*.17+sheets*(.20+gather*.21)+fold*.20,0.0,.82);
  emission=vec3f(.55,.96,.78)*(sheets*gather*.90+fold*.80+rim*.12);
 }else{
  // Herb preparation table: bowl, broad rim and one pestle press produce a
  // single amber treatment pulse. This is not compost accumulation/change.
  let bowlOuter=length(vec2f(q.x*.82,(q.y-.24)*1.13));
  let bowl=line(bowlOuter-.47,.055)*step(q.y,.48);
  let liquid=line(q.y-(.17+.035*cos(q.x*2.0)),.055)*step(abs(q.x),.45)*step(q.y,-.03);
  let rim=line(q.y-.02,.032)*step(abs(q.x),.50);
  let pestleX=.24+.16*sin((useT-.45)*2.4);
  let pestle=line(q.x-pestleX-(q.y+.30)*.28,.065)*step(q.y,-.16)*step(q.y,.51);
  let press=select(0.0,1.0,active)*line(useT-.50,.20);
  let cure=line(q.y-(.12+.17*press),.044)*line(q.x,.47)*step(q.y,-.01);
  rgb=vec3f(.25,.22,.16)*bowl*.45+vec3f(.67,.56,.34)*(rim*.40+pestle*.44)+
      vec3f(.55,.34,.15)*liquid*.52+vec3f(1.0,.67,.25)*(cure*.78+press*bowl*.15);
  alpha=clamp(bowl*.24+rim*.18+pestle*.19+liquid*.15+cure*.25,0.0,.85);
  emission=vec3f(1.0,.55,.19)*(cure*.92+press*liquid*.36);
 }
 let env=select(.18,select(.34,.56,ready),state<1.5);
 let useEnv=select(0.0,smoothstep(.0,.12,progress)*(1.0-smoothstep(.72,1.0,progress)),active);
 let gain=select(env,useEnv,active);
 if(state<.5){rgb*=.72;alpha*=.78;emission*=.42;}
 if(ready){rgb*=1.06;alpha=min(.90,alpha*1.08);emission*=1.24;}
 return Light(rgb*gain,clamp(alpha*gain,0.0,.90),emission*gain);
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
 function rectRectDistance(a,b){const dx=Math.max(b.x-(a.x+a.w),a.x-(b.x+b.w),0),dy=Math.max(b.y-(a.y+a.h),a.y-(b.y+b.h),0);return Math.hypot(dx,dy);}
 function rectDistance(x,y,r){const dx=Math.max(r.x-x,0,x-(r.x+r.w)),dy=Math.max(r.y-y,0,y-(r.y+r.h));return Math.hypot(dx,dy);}
 function plan({map,objectId,now,serverNow,phase,effects=[],camera,zoom,viewport,reducedMotion=false}={}){
  const spec=OBJECTS[objectId],room=map?.rooms?.find(r=>r?.id===ROOM_ID),object=map?.objects?.find(o=>o?.id===objectId);
  if(!spec||map?.id!==MAP_ID||!room||room.x!==80||room.y!==2400||room.w!==970||room.h!==900||!Array.isArray(room.polygon)||
   !object||object.type!==spec.type||object.room!==ROOM_ID||object.effectKind!==spec.effectKind||object.x!==spec.x||object.y!==spec.y||
   object.visualWidth!==spec.width||object.visualHeight!==spec.height||object.cooldownMs!==spec.cooldownMs||!finite(object.readyAt)||
   !finite(now)||!finite(serverNow)||phase!=='playing'||!Array.isArray(effects)||!camera||
   ![camera.x,camera.y,zoom,viewport?.width,viewport?.height,viewport?.pixelWidth,viewport?.pixelHeight].every(finite)||
   zoom<=0||viewport.width<=0||viewport.height<=0||viewport.kind!=='main'||!Number.isInteger(viewport.pixelWidth)||
   !Number.isInteger(viewport.pixelHeight)||viewport.pixelWidth<=0||viewport.pixelHeight<=0||!inside(spec.x,spec.y,room.polygon))return null;
  const zone={x:spec.x-spec.halfWidth,y:spec.y-spec.halfHeight,w:spec.halfWidth*2,h:spec.halfHeight*2};
  if(![[zone.x,zone.y],[zone.x+zone.w,zone.y],[zone.x,zone.y+zone.h],[zone.x+zone.w,zone.y+zone.h]].every(([x,y])=>inside(x,y,room.polygon)))return null;
  const peers=(map.objects||[]).filter(o=>o.room===ROOM_ID&&o.id!==spec.id);
  if(peers.some(o=>rectDistance(o.x,o.y,zone)<Math.max(o.visualWidth||0,o.visualHeight||0)*.7))return null;
  const door=map.doors?.find(d=>d.id==='d-greenhouse-east');
  if(!door||door.x!==1035||door.y!==2810||door.w!==30||door.h!==130||rectRectDistance(zone,door)<24)return null;
  const approach=map.corridors?.find(c=>c.id==='a14');
  if(!approach||approach.x!==950||approach.y!==2780||approach.w!==170||approach.h!==190||rectRectDistance(zone,approach)<24)return null;
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
   sfx:Object.freeze({required:true,audioMissing:true,owner:'server-world-sound',currentProfile:'object',eventId:event?event.id:'',
    edge:event?'success-use-with-independent-generic-sound-receipt':'none',audioEdgeCorrelated:false,candidatePlayback:false,missingProfile:spec.requiredSfx,
    unrelatedRoomAmbient:'woodsAir'})});
 }
 function planAll(args={}){return Object.freeze(Object.keys(OBJECTS).flatMap(id=>{const p=plan({...args,objectId:id});return p?[p]:[]}));}
 function pack(p){if(!p||!OBJECTS[p.objectId]||![p.centerX,p.centerY,p.radiusX,p.radiusY,p.pixelWidth,p.pixelHeight,p.progress,p.state,
  p.readyProgress,p.ambientTime].every(finite)||![0,1,2].includes(p.state))throw new TypeError('Valid greenhouse object E plan required');
  const d=new Float32Array([p.pixelWidth,p.pixelHeight,p.centerX,p.centerY,p.radiusX,p.radiusY,p.code,0,p.progress,p.state,
   p.reducedMotion?1:0,1,p.readyProgress,p.ambientTime,0,0]);if(!d.every(finite))throw new RangeError('Greenhouse object E exceeds float32 range');return d;}
 function create({renderer,frameOwner=renderer}={}){
  if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||!frameOwner.device?.queue?.writeBuffer||
   !frameOwner.device?.createBindGroupLayout||!frameOwner.device?.createPipelineLayout||typeof frameOwner.own!=='function'||
   typeof frameOwner.release!=='function'||typeof frameOwner.format!=='string')throw new TypeError('Greenhouse object E requires shared ready WebGPU frame owner');
  const device=frameOwner.device,format=frameOwner.format,module=device.createShaderModule({label:'DVA greenhouse object E WGSL',code:shader});
  const layout=device.createBindGroupLayout({entries:[{binding:0,visibility:0x1|0x2,buffer:{type:'uniform'}}]});
  const pipelineLayout=device.createPipelineLayout({bindGroupLayouts:[layout]});
  const make=(entry,label,blend)=>device.createRenderPipeline({label,layout:pipelineLayout,vertex:{module,entryPoint:'vs'},
   fragment:{module,entryPoint:entry,targets:[{format,blend}]},primitive:{topology:'triangle-list'}});
  const base=make('fsBase','DVA greenhouse object E material',{color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
   alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}});
  const emission=make('fsEmission','DVA greenhouse object E emission',{color:{srcFactor:'one',dstFactor:'one',operation:'add'},
   alpha:{srcFactor:'zero',dstFactor:'one',operation:'add'}});
  const slots=[],indices=new WeakMap(),seenByFrame=new WeakMap();let destroyed=false;
  function slot(i){if(slots[i])return slots[i];const uniform=frameOwner.own(device.createBuffer({label:`DVA greenhouse object E slot ${i}`,size:FLOATS*4,usage:0x40|0x08}));
   const bind=device.createBindGroup({layout,entries:[{binding:0,resource:{buffer:uniform}}]});return(slots[i]={uniform,bind});}
  function record({frame,target,viewport,planned}={}){
   if(destroyed||frameOwner.state!=='ready')throw new Error('Greenhouse object E unavailable');
   if(!frame||typeof frame.stage!=='function'||typeof frame.add!=='function'||typeof target!=='string'||!target||!planned||
    viewport?.kind!=='main'||planned.pixelWidth!==viewport.pixelWidth||planned.pixelHeight!==viewport.pixelHeight)
    throw new TypeError('Greenhouse object E requires current main-frame plan');
   let seen=seenByFrame.get(frame);if(!seen){seen=new Set();seenByFrame.set(frame,seen);}
   if(planned.eventId&&seen.has(planned.eventId))return Object.freeze({drawn:false,duplicate:true,audioMissing:true});
   if(planned.eventId)seen.add(planned.eventId);const i=indices.get(frame)||0;if(i>=3)throw new RangeError('At most three greenhouse fixtures may be recorded per frame');
   const s=slot(i);device.queue.writeBuffer(s.uniform,0,pack(planned));frame.stage(`world:greenhouse-object-e:${planned.objectId}:${planned.eventId||'state'}`);
   for(const [pipe,layer]of[[base,'material'],[emission,'emission']])frame.add({target,label:`world:${planned.design}:${layer}`,
    encode(pass,info){if(info.device!==device||info.format!==format||info.width!==viewport.pixelWidth||info.height!==viewport.pixelHeight)
     throw new Error('Greenhouse object E target mismatch');pass.setPipeline(pipe);pass.setBindGroup(0,s.bind);pass.draw(3);}});
   indices.set(frame,i+1);return Object.freeze({drawn:true,objectId:planned.objectId,eventId:planned.eventId,layers:2,
    audioMissing:true,audioEdge:planned.sfx.edge,audioEdgeCorrelated:false});
  }
  return Object.freeze({plan,planAll,record,shader,get state(){return destroyed?'destroyed':frameOwner.state;},destroy(){if(destroyed)return;destroyed=true;
   for(const s of slots)if(frameOwner.release(s.uniform))s.uniform.destroy();slots.length=0;}});
 }
 const api=Object.freeze({MAP_ID,ROOM_ID,DURATION_MS,OBJECTS,SFX_POLICY,shader,plan,planAll,pack,create});
 root.DvaWebGPUGreenhouseRoomObjectsE=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
