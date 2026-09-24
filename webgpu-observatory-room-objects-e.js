/* Textureless, per-object WebGPU E candidates for the observatory fixtures.
 * Candidate only: success admission, spatial audio and the world frame remain
 * owned by the existing app/server. Custom object SFX are not yet implemented. */
(function(root){
 'use strict';
 const MAP_ID='station',ROOM_ID='observatory',DURATION_MS=2200,FLOATS=16;
 const OBJECTS=Object.freeze({
  'v302-observatory-holoProjector-1':Object.freeze({id:'v302-observatory-holoProjector-1',type:'holoProjector',
   effectKind:'luckBoost',x:2230,y:330,width:110,height:76,cooldownMs:38000,code:0,
   design:'tabletop-astrolabe-projection',requiredSfx:'astrolabe-calibration-chime'}),
  'v302-observatory-readingLamp-2':Object.freeze({id:'v302-observatory-readingLamp-2',type:'readingLamp',
   effectKind:'mana',x:2760,y:330,width:110,height:76,cooldownMs:26000,code:1,
   design:'articulated-desk-lamp-pool',requiredSfx:'reading-lamp-glass-tap'}),
  'v302-observatory-commandDesk-3':Object.freeze({id:'v302-observatory-commandDesk-3',type:'commandDesk',
   effectKind:'luckBoost',x:2240,y:636,width:110,height:76,cooldownMs:38000,code:2,
   design:'command-console-data-rails',requiredSfx:'command-desk-confirmation'})
 });
 const SFX_POLICY=Object.freeze({required:true,owner:'existing-server-world-sound',edge:'one-shot-per-server-sound-receipt-id',
  currentProfile:'object',customProfilesComplete:false,audioEdgeCorrelated:false,candidatePlayback:false,
  missing:Object.freeze({'v302-observatory-holoProjector-1':'astrolabe-calibration-chime',
   'v302-observatory-readingLamp-2':'reading-lamp-glass-tap','v302-observatory-commandDesk-3':'command-desk-confirmation'}),
  idle:'none',cooldown:'none',loop:'none'});
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
fn rect(p:vec2f,h:vec2f,r:f32)->f32{let q=abs(p)-h+vec2f(r);return length(max(q,vec2f(0)))+min(max(q.x,q.y),0)-r;}
fn gate(t:f32,a:f32,b:f32,c:f32,d:f32)->f32{return smoothstep(a,b,t)*(1.0-smoothstep(c,d,t));}
struct Light{rgb:vec3f,alpha:f32,emission:vec3f};
fn evaluate(q:vec2f)->Light{
 let kind=p.geometry.z;let progress=p.state.x;let state=p.state.y;let reduced=p.state.z>.5;
 let idlePhase=select(p.extra.y*.21+kind*1.73,.43,reduced);let eventPhase=select(progress,.52,reduced);
 let active=state>1.5;let ready=state>.5&&state<1.5;
 let awake=select(select(.12,.25,ready),gate(progress,.01,.12,.82,1.0),active);
 var base=vec3f(0);var alpha=0.0;var emit=vec3f(0);
 if(kind<.5){
  // Star-chart table: one large projected astrolabe with three legible,
  // incomplete orbital arcs and a central alignment cross; no star particles.
  let r=length(vec2f(q.x*.92,q.y*1.12));let a=atan2(q.y,q.x);
  let sweep=idlePhase*.24+eventPhase*6.2831853;
  let span=abs(fract((a+sweep+3.14159265)/6.2831853)*6.2831853-3.14159265);
  let arcA=line(r-(.53+.035*sin(a*2.0)),.035)*(1.0-smoothstep(1.55,1.78,span));
  let arcB=line(r-.34,.026)*(1.0-smoothstep(2.20,2.45,abs(a+1.1)));
  let arcC=line(r-.70,.022)*(1.0-smoothstep(1.05,1.28,abs(a-2.2)));
  let meridian=line(q.x-.03*sin(sweep),.018)*line(q.y,.50);
  let focus=line(r,.10);let expand=line(r,(.10+.70*eventPhase));
  let use=select(focus,expand,active);let strength=awake*(arcA*.68+arcB*.48+arcC*.36+meridian*.22+use*.55);
  base=vec3f(.64,.36,.98)*strength*.56+vec3f(.60,.91,1.0)*(arcA*.27+focus*.16)*awake;
  alpha=clamp(strength*.44+(arcA+arcB+arcC)*awake*.075,0.0,.80);
  emit=vec3f(.47,.28,1.0)*(arcA*.78+arcB*.48+arcC*.30+use*.35)*awake;
 }else if(kind<1.5){
  // Desk lamp: an overhead shade/hinge feeds a broad tapered pool onto a
  // reading surface. This is a downcast trapezoid, never an annular sector.
  let shade=(1.0-smoothstep(.015,.055,rect(q-vec2f(0,-.70),vec2f(.25,.10),.08)));
  let hinge=line(q.y+.53,.035)*line(q.x-.26,.22);
  let cone=1.0-smoothstep(.0,.10,abs(q.x)-(.18+.58*(q.y+.48)));
  let lower=smoothstep(-.43,-.29,q.y)*(1.0-smoothstep(.48,.70,q.y));
  let pool=cone*lower*(1.0-smoothstep(.90,1.12,length(vec2f(q.x*.86,(q.y-.12)*1.12))));
  let sweepY=mix(-.22,.40,eventPhase);
  let readingSweep=line(q.y-sweepY,.030)*pool*select(0.0,1.0,active);
  let deskEdge=line(q.y-.52,.035)*smoothstep(.52,.7,abs(q.x));
  let useShade=shade*(.55+.45*awake);let field=pool*(.18+.68*awake)+readingSweep*.42;
  base=vec3f(1.0,.69,.29)*(field*.64+useShade*.32+hinge*.22+deskEdge*.08);
  alpha=clamp(field*.30+useShade*.19+hinge*.10+readingSweep*.18+deskEdge*.035,0.0,.68);
  emit=vec3f(1.0,.47,.13)*(field*.46+useShade*.24+readingSweep*.72+hinge*.12);
 }else{
  // Command desk: three broad digital rails converge on a central command
  // node; the success scan traverses the rails once, without a radial halo.
  let frame=(line(abs(q.x)-.75,.035)*step(abs(q.y),.72)+line(abs(q.y)-.72,.035)*step(abs(q.x),.75));
  let railA=line(q.y+.34,.040)*step(abs(q.x),.54);
  let railB=line(q.y,.028)*step(abs(q.x),.44);
  let railC=line(q.y-.34,.040)*step(abs(q.x),.54);
  let node=line(length(q-vec2f(.02,0)),.13);
  let scanX=-.58+1.16*eventPhase;
  let scan=line(q.x-scanX,.045)*step(abs(q.y),.58)*select(0.0,1.0,active);
  let bridges=(line(q.x+.55,.026)+line(q.x-.55,.026))*step(abs(q.y),.47);
  let signal=frame*.30+(railA+railB+railC)*.54+node*.74+bridges*.32+scan*.95;
  let strength=awake*signal;
  base=vec3f(.14,.78,.94)*(frame*.16+bridges*.16)*awake+
       vec3f(.26,.94,1.0)*(railA+railB+railC)*awake*.34+
       vec3f(.93,.99,1.0)*(node*.46+scan*.56)*awake;
  alpha=clamp(strength*.27,0.0,.78);
  emit=vec3f(.10,.66,1.0)*(signal*.82)*awake;
 }
 if(state<.5){base*=.60;emit*=.36;alpha*=.72;}
 if(ready){base*=1.10;emit*=1.25;alpha=min(.86,alpha*1.08);}
 return Light(base,alpha,emit);
}
@fragment fn fsBase(@builtin(position)px:vec4f)->@location(0)vec4f{
 let q=(px.xy-p.view.zw)/max(p.geometry.xy,vec2f(.001));let e=evaluate(q);return vec4f(e.rgb*p.state.w,e.alpha*p.state.w);
}
@fragment fn fsEmission(@builtin(position)px:vec4f)->@location(0)vec4f{
 let q=(px.xy-p.view.zw)/max(p.geometry.xy,vec2f(.001));let e=evaluate(q);return vec4f(e.emission*p.state.w,0.0);
}`;
 function inside(x,y,poly){if(!Array.isArray(poly)||poly.length<3)return false;let v=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];if(!Array.isArray(a)||!Array.isArray(b)||![a[0],a[1],b[0],b[1]].every(finite))return false;
  if(((a[1]>y)!==(b[1]>y))&&(x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]))v=!v;}return v;}
 function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
 function rectDistance(x,y,r){const dx=Math.max(r.x-x,0,x-(r.x+r.w)),dy=Math.max(r.y-y,0,y-(r.y+r.h));return Math.hypot(dx,dy);}
 function plan({map,objectId,now,serverNow,phase,effects=[],camera,zoom,viewport,reducedMotion=false}={}){
  const spec=OBJECTS[objectId],room=map?.rooms?.find(r=>r?.id===ROOM_ID),object=map?.objects?.find(o=>o?.id===objectId);
  if(!spec||map?.id!==MAP_ID||!room||room.x!==2000||room.y!==140||room.w!==1000||room.h!==680||
   !Array.isArray(room.polygon)||!object||object.type!==spec.type||object.room!==ROOM_ID||object.effectKind!==spec.effectKind||
   object.x!==spec.x||object.y!==spec.y||object.visualWidth!==spec.width||object.visualHeight!==spec.height||
   !finite(object.cooldownMs)||object.cooldownMs!==spec.cooldownMs||!finite(object.readyAt)||!finite(now)||!finite(serverNow)||
   phase!=='playing'||!Array.isArray(effects)||!camera||![camera.x,camera.y,zoom,viewport?.width,viewport?.height,
    viewport?.pixelWidth,viewport?.pixelHeight].every(finite)||zoom<=0||viewport.width<=0||viewport.height<=0||
    viewport.kind!=='main'||!Number.isInteger(viewport.pixelWidth)||!Number.isInteger(viewport.pixelHeight)||
    viewport.pixelWidth<=0||viewport.pixelHeight<=0||!inside(spec.x,spec.y,room.polygon))return null;
  const zone={x:spec.x-(spec.width+48)/2,y:spec.y-(spec.height+44)/2,w:spec.width+48,h:spec.height+44};
  const corners=[[zone.x,zone.y],[zone.x+zone.w,zone.y],[zone.x,zone.y+zone.h],[zone.x+zone.w,zone.y+zone.h]];
  if(!corners.every(([x,y])=>inside(x,y,room.polygon)))return null;
  const otherObjects=(map.objects||[]).filter(o=>o.room===ROOM_ID&&o.id!==spec.id);
  if(otherObjects.some(o=>rectDistance(o.x,o.y,zone)<Math.max(o.visualWidth||0,o.visualHeight||0)*.70))return null;
  const objectSpaces=(map.objectSpaces||[]).filter(o=>o.room===ROOM_ID);
  if(objectSpaces.some(o=>rectDistance(o.x+o.w/2,o.y+o.h/2,zone)<Math.max(o.w,o.h)*.55))return null;
  const time=now/1000,sx=zoom*viewport.pixelWidth/viewport.width,sy=zoom*viewport.pixelHeight/viewport.height;
  const centerX=(spec.x-camera.x)*sx,centerY=(spec.y-camera.y)*sy,radiusX=zone.w*.5*sx,radiusY=zone.h*.5*sy;
  if(![centerX,centerY,radiusX,radiusY,time].every(finite)||centerX+radiusX<0||centerX-radiusX>viewport.pixelWidth||
   centerY+radiusY<0||centerY-radiusY>viewport.pixelHeight)return null;
  const validEvents=effects.filter(e=>e?.type===`object-${spec.type}`&&e.objectId===spec.id&&e.effectKind===spec.effectKind&&
   typeof e.id==='string'&&e.id.length>0&&finite(e.x)&&finite(e.y)&&e.x===spec.x&&e.y===spec.y&&
   finite(e.radius)&&e.radius===100&&typeof e.playerId==='string'&&e.playerId.length>0&&
   finite(e.startedAt)&&finite(e.duration)&&e.duration>0&&e.duration<=DURATION_MS&&now>=e.startedAt&&now<e.startedAt+e.duration)
   .sort((a,b)=>b.startedAt-a.startedAt);
  const event=validEvents[0]||null,ready=object.readyAt<=serverNow,state=event?2:ready?1:0;
  const progress=event?clamp((now-event.startedAt)/event.duration,0,1):0;
  const cooldownProgress=ready?1:clamp(1-(object.readyAt-serverNow)/spec.cooldownMs,0,1);
  return Object.freeze({objectId:spec.id,type:spec.type,effectKind:spec.effectKind,design:spec.design,code:spec.code,
   centerX,centerY,radiusX,radiusY,pixelWidth:viewport.pixelWidth,pixelHeight:viewport.pixelHeight,
   progress,state,readyProgress:cooldownProgress,ambientTime:time,reducedMotion:Boolean(reducedMotion),
   eventId:event?event.id:'',durationMs:event?event.duration:0,
   sfx:Object.freeze({required:true,audioMissing:true,owner:'server',currentProfile:'object',
    eventId:event?event.id:'',edge:event?'same-success-path-generic-sound-receipt':'none',
    audioEdgeCorrelated:false,candidatePlayback:false,
    missingProfile:spec.requiredSfx})});
 }
 function planAll(args={}){return Object.freeze(Object.keys(OBJECTS).flatMap(id=>{const p=plan({...args,objectId:id});return p?[p]:[]}));}
 function pack(p){if(!p||!OBJECTS[p.objectId]||![p.centerX,p.centerY,p.radiusX,p.radiusY,p.pixelWidth,p.pixelHeight,
  p.progress,p.state,p.readyProgress,p.ambientTime].every(finite)||![0,1,2].includes(p.state))throw new TypeError('Valid observatory object E plan required');
  const d=new Float32Array([p.pixelWidth,p.pixelHeight,p.centerX,p.centerY,p.radiusX,p.radiusY,p.code,0,
   p.progress,p.state,p.reducedMotion?1:0,1,p.readyProgress,p.ambientTime,0,0]);
  if(!d.every(finite))throw new RangeError('Observatory object E exceeds float32 range');return d;}
 function create({renderer,frameOwner=renderer}={}){
  if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||!frameOwner.device?.queue?.writeBuffer||
   !frameOwner.device?.createBindGroupLayout||!frameOwner.device?.createPipelineLayout||
   typeof frameOwner.own!=='function'||typeof frameOwner.release!=='function'||typeof frameOwner.format!=='string')
   throw new TypeError('Observatory object E requires shared ready WebGPU frame owner');
  const device=frameOwner.device,format=frameOwner.format,module=device.createShaderModule({label:'DVA observatory object E WGSL',code:shader});
  const bindGroupLayout=device.createBindGroupLayout({entries:[{binding:0,visibility:0x1|0x2,buffer:{type:'uniform'}}]});
  const pipelineLayout=device.createPipelineLayout({bindGroupLayouts:[bindGroupLayout]});
  const makePipeline=(entry,label,blend)=>device.createRenderPipeline({label,layout:pipelineLayout,vertex:{module,entryPoint:'vs'},
   fragment:{module,entryPoint:entry,targets:[{format,blend}]},primitive:{topology:'triangle-list'}});
  const blend={color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}};
  const base=makePipeline('fsBase','DVA observatory object E material',blend);
  const emission=makePipeline('fsEmission','DVA observatory object E emission',{color:{srcFactor:'one',dstFactor:'one',operation:'add'},alpha:{srcFactor:'zero',dstFactor:'one',operation:'add'}});
  const slots=[],indices=new WeakMap(),seenByFrame=new WeakMap();let destroyed=false;
  function getSlot(i){if(slots[i])return slots[i];const uniform=frameOwner.own(device.createBuffer({label:`DVA observatory object E slot ${i}`,size:FLOATS*4,usage:0x40|0x08}));
   const bindGroup=device.createBindGroup({layout:bindGroupLayout,entries:[{binding:0,resource:{buffer:uniform}}]});return(slots[i]={uniform,bindGroup});}
  function record({frame,target,viewport,planned}={}){
   if(destroyed||frameOwner.state!=='ready')throw new Error('Observatory object E unavailable');
   if(!frame||typeof frame.stage!=='function'||typeof frame.add!=='function'||typeof target!=='string'||!target||!planned||
    viewport?.kind!=='main'||planned.pixelWidth!==viewport.pixelWidth||planned.pixelHeight!==viewport.pixelHeight)
    throw new TypeError('Observatory object E requires the current main-frame plan');
   let seen=seenByFrame.get(frame);if(!seen){seen=new Set();seenByFrame.set(frame,seen);}
   if(planned.eventId&&seen.has(planned.eventId))return Object.freeze({drawn:false,duplicate:true,audioMissing:true});
   if(planned.eventId)seen.add(planned.eventId);
   const index=indices.get(frame)||0;if(index>=3)throw new RangeError('At most three observatory objects may be recorded per frame');
   const slot=getSlot(index),data=pack(planned);device.queue.writeBuffer(slot.uniform,0,data);
   frame.stage(`world:observatory-object-e:${planned.objectId}:${planned.eventId||'state'}`);
   for(const [pipeline,layer] of [[base,'material'],[emission,'emission']])frame.add({target,label:`DVA observatory ${planned.design} E ${layer}`,
    encode(pass,info){if(info.device!==device||info.format!==format||info.width!==viewport.pixelWidth||info.height!==viewport.pixelHeight)
     throw new Error('Observatory object E target mismatch');pass.setPipeline(pipeline);pass.setBindGroup(0,slot.bindGroup);pass.draw(3);}});
   indices.set(frame,index+1);return Object.freeze({drawn:true,objectId:planned.objectId,eventId:planned.eventId,
    layers:2,audioMissing:true,audioEdge:planned.sfx.edge,audioEdgeCorrelated:false});
  }
  return Object.freeze({plan,planAll,record,shader,get state(){return destroyed?'destroyed':frameOwner.state;},destroy(){if(destroyed)return;destroyed=true;
   for(const s of slots)if(frameOwner.release(s.uniform))s.uniform.destroy();slots.length=0;}});
 }
 const api=Object.freeze({MAP_ID,ROOM_ID,DURATION_MS,OBJECTS,SFX_POLICY,shader,plan,planAll,pack,create});
 root.DvaWebGPUObservatoryRoomObjectsE=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
