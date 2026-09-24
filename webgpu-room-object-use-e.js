/* Textureless source-space E candidates for observed non-corridor station objects.
 * The caller owns accepted server events, the shared WebGPU frame, and SFX playback. */
(function(root){
 'use strict';
 const MAP_ID='station',DURATION_MS=2200,MAX_FRAME_EVENTS=32;
 const raw=[
  ['v302-comms-serverRack-2','serverRack','credits',4346,2882,'comms','rack-powered-bay-retrieval','rack-relay-click','steel-relay'],
  ['v302-engineering-toolCart-2','toolCart','credits',4308,1316,'engineering','cart-drawer-withdrawal','drawer-slide-clink','steel-drawer'],
  ['v302-fabrication-toolCart-3','toolCart','acceleration',3655,2426,'fabrication','cart-flywheel-start','ratchet-flywheel-tick','brass-ratchet'],
  ['v302-atrium-conferenceTable-4','conferenceTable','mana',2812,1886,'atrium','table-inlay-transfer','inlay-glass-tone','wood-glass'],
  ['v302-comms-radioConsole-1','radioConsole','luckBoost',3742,2882,'comms','console-tuning-response','radio-tuner-pip','bakelite-radio'],
  ['v302-atrium-sofa-1','conferenceSofa','overheal',2149,1314,'atrium','sofa-cushion-recovery','cushion-spring-hum','woven-cushion'],
  ['v302-comms-antennaArray-3','antennaArray','mana',3754,3143,'comms','antenna-signal-acquisition','antenna-carrier-chirp','copper-aerial'],
  ['v302-cafeteria-nutritionStation-1','healthyMealTable','healthyMeal',1334,2661,'cafeteria','meal-service-fan','service-bell-steam','ceramic-mealware'],
  ['v302-storage-equipmentLocker-3','equipmentLocker','stamina',1210,2011,'storage','storage-locker-withdrawal','storage-locker-latch','painted-steel'],
  ['v302-security-equipmentLocker-3','equipmentLocker','stamina',1458,965,'security','security-locker-release','security-locker-bolt','armored-steel'],
  ['v302-storage-cargoCrate-1','cargoCrate','credits',1203,1696,'storage','crate-hinged-credit-retrieval','crate-hinge-knock','timber-hinge'],
  ['v302-fabrication-workbench-1','workbench','stamina',3642,2102,'fabrication','fabrication-bench-tool-run','bench-tool-chime','machined-steel'],
  ['v302-engineering-workbench-1','workbench','stamina',3619,1316,'engineering','engineering-bench-pressure-release','bench-pressure-hiss','composite-worktop']
 ];
 const OBJECTS=Object.freeze(Object.fromEntries(raw.map((r,code)=>[r[0],Object.freeze({
  id:r[0],type:r[1],effectKind:r[2],x:r[3],y:r[4],room:r[5],width:110,height:76,code,
  design:r[6],soundProfile:r[7],sound:Object.freeze({profile:r[7],material:r[8],durationMs:180+code*7,
   edge:'accepted-use-once',playbackByCandidate:false})
 })])));
 const SFX_POLICY=Object.freeze({owner:'external-world-sound-player',edge:'one-per-accepted-object-use-event-id',
  required:true,customProfilesDistinct:true,candidatePlayback:false,idle:'none',loop:'none',
  note:'Current server emits generic object sound. Wire these exact ID profiles through the authoritative one-shot sound path.'});
 const SERVER_RACK_VISUAL=Object.freeze({sequence:Object.freeze([
  Object.freeze({name:'enclosure-response',from:0,to:.16}),
  Object.freeze({name:'rolling-bay-scan',from:.16,to:.42}),
  Object.freeze({name:'bounded-core-halo',from:.42,to:.62}),
  Object.freeze({name:'retrieval-pulse',from:.62,to:.80}),
  Object.freeze({name:'finite-decay',from:.80,to:1})
 ])});
 const finite=Number.isFinite;
 function visualPhase(code,progress){
  if(code!==0||!finite(progress)||progress<0||progress>=1)return '';
  const phase=SERVER_RACK_VISUAL.sequence.find(item=>progress>=item.from&&progress<item.to);
  return phase?.name||'';
 }
 const shader=/* wgsl */`
struct Params{view:vec4f,source:vec4f,shape:vec4f,state:vec4f};
@group(0)@binding(0)var<uniform>p:Params;
struct V{@builtin(position)position:vec4f,@location(0)clip:vec2f};
@vertex fn vs(@builtin(vertex_index)i:u32)->V{let q=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3))[i];var o:V;o.position=vec4f(q,0,1);o.clip=q;return o;}
fn line(v:f32,w:f32)->f32{return exp(-v*v/max(w*w,.0001));}
fn band(v:f32,a:f32,b:f32)->f32{return smoothstep(a,a+.035,v)*(1.0-smoothstep(b-.035,b,v));}
@fragment fn fs(i:V)->@location(0)vec4f{
 let px=vec2f((i.clip.x+1.0)*.5*p.shape.x,(1.0-i.clip.y)*.5*p.shape.y);
 let world=p.view.xy+px/p.view.zw;let q=(world-p.source.xy)/p.source.zw*2.0-vec2f(1.0);
 if(any(abs(q)>vec2f(1.0))){discard;}let t=p.state.x;let k=p.state.y;let reduced=p.state.z>.5;
 let u=select(t,.55,reduced);let env=smoothstep(0.0,.10,t)*(1.0-smoothstep(.76,1.0,t));
 var m=0.0;var h=0.0;var c=vec3f(.8,.8,.8);
 if(k<.5){
  // Powered rack: enclosure opens, a broad scanner crosses ordered bays, a
  // bounded core gathers charge, then one retrieval pulse decays cleanly.
  let response=smoothstep(0.0,.12,t)*(1.0-smoothstep(.16,.24,t));
  let scan=smoothstep(.12,.20,t)*(1.0-smoothstep(.48,.58,t));
  let core=smoothstep(.34,.44,t)*(1.0-smoothstep(.68,.78,t));
  let retrieve=smoothstep(.59,.67,t)*(1.0-smoothstep(.76,.85,t));
  let scanY=.68-clamp((t-.16)/.42,0.0,1.0)*1.36;
  let retrievalProgress=clamp((t-.60)/.22,0.0,1.0);
  let sideOpen=.48+.15*response;
  let enclosure=(line(abs(q.x)-sideOpen,.055)*band(q.y,-.64,.64))+
   (line(abs(q.y)-.64,.055)*band(q.x,-.65,.65));
  let innerFrame=(line(abs(q.x)-.42,.035)*band(q.y,-.48,.48))+
   (line(abs(q.y)-.48,.035)*band(q.x,-.44,.44));
  let bays=(line(q.y+.23,.035)+line(q.y,.035)+line(q.y-.23,.035))*band(q.x,-.39,.39);
  let bayScan=line(q.y-scanY,.115)*band(q.x,-.38,.38)*scan;
  let scanLeading=line(q.y-scanY-.075,.045)*band(q.x,-.36,.36)*scan;
  let coreRadius=length(vec2f(q.x/.245,q.y/.52));
  let boundedCore=(1.0-smoothstep(.70,1.0,coreRadius))*core;
  let coreRim=line(coreRadius-.91,.105)*core;
  let coreHalo=line(coreRadius-1.10,.32)*core*.48;
  let pulseRadius=.10+retrievalProgress*.96;
  let retrievalRing=line(length(vec2f(q.x,q.y*.86))-pulseRadius,.075)*retrieve;
  let retrievalPacket=line(q.y-(.56-retrievalProgress*1.12),.105)*band(q.x,-.21,.21)*retrieve;
  let retrieveGate=(line(q.x-.24,.045)+line(q.x+.24,.045))*band(q.y,-.62,.62)*retrieve;
  c=vec3f(.36,.88,1.0);
  m=enclosure*(.35+.65*response)+innerFrame*.56+bays*.48+bayScan*.94+scanLeading*.7+
   boundedCore*.95+coreRim*.76+retrievalRing*.92+retrievalPacket;
  h=enclosure*.24+bayScan*.55+scanLeading*.45+boundedCore*.72+coreRim*.66+coreHalo*.9+
   retrievalRing*.64+retrievalPacket*.62+retrieveGate*.42;
 }else if(k<1.5){c=vec3f(1.0,.63,.30);let drawer=line(q.y+.27,.055)*band(q.x,-.58,.58);m=drawer*line(q.x-(u*1.5-.75),.19)+line(q.y-.54,.045)*band(q.x,-.68,.68)*.4;h=drawer*.25;
 }else if(k<2.5){c=vec3f(.98,.48,.25);let wheel=line(length(q-vec2f(-.48,.45))-.19,.04)+line(length(q-vec2f(.48,.45))-.19,.04);let spoke=line(q.y-.08*sin(u*6.28),.035)*band(q.x,-.38,.38);m=wheel*.65+spoke*band(q.y,-.36,.3);h=spoke*.65;
 }else if(k<3.5){c=vec3f(.59,.82,1.0);let ring=line(length(q)-(.17+.62*u),.055);let inlay=line(q.y-.08*sin(q.x*5.0),.055)*band(q.x,-.65,.65);m=ring*.68+inlay*line(u-(q.x*.5+.5),.18);h=ring*.42;
 }else if(k<4.5){c=vec3f(.47,.89,.76);let wave=line(q.y-.18*sin(q.x*7.0-u*9.0),.045)*band(q.x,-.75,.75);let dial=line(length(q-vec2f(.52,-.48))-.16,.04);m=wave*.8+dial*.55;h=wave*.42;
 }else if(k<5.5){c=vec3f(.77,.65,1.0);let cushion=line(q.y+.18+.08*sin(q.x*5.0),.09)*band(q.x,-.72,.72);let waves=line(q.y-(u*.95-.48),.045)*band(q.x,-.62,.62);m=cushion*.35+waves;h=waves*.48;
 }else if(k<6.5){c=vec3f(.34,.88,1.0);let mast=line(q.x,.035)*band(q.y,-.86,.72);let a=line(length(q-vec2f(-.28,.18))-(.15+.52*u),.045);let b=line(length(q-vec2f(.28,.18))-(.12+.43*u),.04);m=mast*.45+(a+b)*band(q.y,-.65,.48);h=(a+b)*.5;
 }else if(k<7.5){c=vec3f(1.0,.72,.32);let plate=band(q.y,.18,.58)*band(q.x,-.67,.67);let steam=line(q.x-.36*sin(u*5.0),.05)*band(q.y,-.72,.05)+line(q.x+.34*sin(u*4.0),.045)*band(q.y,-.68,.10);m=plate*.46+steam*.8;h=steam*.42;
 }else if(k<8.5){c=vec3f(.69,.87,1.0);let door=line(abs(q.x)-.56,.045)*band(q.y,-.72,.72);let shelves=line(q.y+.3,.035)*band(q.x,-.5,.5)+line(q.y-.25,.035)*band(q.x,-.5,.5);let pull=line(q.x-(u*1.2-.6),.13)*band(q.y,-.28,.12);m=door*.6+shelves*.35+pull*.7;h=pull*.5;
 }else if(k<9.5){c=vec3f(.38,.89,1.0);let bolt=line(q.x-.49,.05)*band(q.y,-.55,.55)+line(q.x+.49,.05)*band(q.y,-.55,.55);let bar=line(q.y-(.55-u*1.1),.065)*band(q.x,-.74,.74);m=bolt*.55+bar;h=bar*.55;
 }else if(k<10.5){c=vec3f(1.0,.56,.30);let lid=line(q.y-(.42-u*.75),.065)*band(q.x,-.72,.72);let box=line(abs(q.x)-.7,.04)*band(q.y,-.55,.38);m=lid+box*.45;h=lid*.6;
 }else if(k<11.5){c=vec3f(.72,.93,.43);let tool=line(q.y-(.48-.96*u),.055)*band(q.x,-.68,.68);let bench=line(q.y+.35,.06)*band(q.x,-.72,.72);let spark=(line(q.x-.42,.055)+line(q.x+.37,.05))*line(q.y-(.05+.24*sin(u*12.0)),.09);m=tool*.62+bench*.38+spark*.55;h=spark*.65;
 }else{c=vec3f(.93,.72,.42);let platen=line(q.y+.28,.06)*band(q.x,-.68,.68);let pressure=line(q.x-(u*1.4-.7),.07)*band(q.y,-.60,.35);let release=line(q.y-(.05+.52*u),.055)*band(q.x,-.42,.42);m=platen*.42+pressure*.62+release*.6;h=release*.52;}
 let a=clamp((m+h*.58)*env*.78,0.0,.84);return vec4f(c*a,a);
}`;
 function supported(e){const s=OBJECTS[e?.objectId];return Boolean(s&&e.type===`object-${s.type}`&&e.effectKind===s.effectKind);}
 function eventStart(e){return finite(e?.startedAt)?e.startedAt:e?.at;}
 function plan({map,event,now,phase,camera,zoom,viewport,reducedMotion=false}={}){
  if(!supported(event)||map?.id!==MAP_ID||!Array.isArray(map.objects)||phase!=='playing'||
   typeof event.id!=='string'||!event.id||typeof event.playerId!=='string'||!event.playerId||
   !finite(now)||!finite(zoom)||zoom<=0||!camera||![camera.x,camera.y,viewport?.width,viewport?.height,
   viewport?.pixelWidth,viewport?.pixelHeight].every(finite)||viewport.width<=0||viewport.height<=0||
   !Number.isInteger(viewport.pixelWidth)||!Number.isInteger(viewport.pixelHeight)||viewport.pixelWidth<=0||viewport.pixelHeight<=0)return null;
  const s=OBJECTS[event.objectId],o=map.objects.find(x=>x?.id===s.id),start=eventStart(event);
  if(!o||o.type!==s.type||o.effectKind!==s.effectKind||o.x!==s.x||o.y!==s.y||
   o.visualWidth!==s.width||o.visualHeight!==s.height||o.room!==s.room||event.x!==s.x||event.y!==s.y||
   event.radius!==100||!finite(start)||!finite(event.duration)||event.duration<=0||event.duration>DURATION_MS||
   now<start||now>=start+event.duration)return null;
  const sx=zoom*viewport.pixelWidth/viewport.width,sy=zoom*viewport.pixelHeight/viewport.height;
  const halfW=Math.max(s.width*.78,28),halfH=Math.max(s.height*.78,28);
  const bounds={x:s.x-halfW,y:s.y-halfH,width:halfW*2,height:halfH*2};
  const rect={x:(bounds.x-camera.x)*sx,y:(bounds.y-camera.y)*sy,width:bounds.width*sx,height:bounds.height*sy};
  if(!Object.values(rect).every(finite)||rect.x>=viewport.pixelWidth||rect.y>=viewport.pixelHeight||rect.x+rect.width<=0||rect.y+rect.height<=0)return null;
  return Object.freeze({objectId:s.id,eventId:event.id,startedAt:start,code:s.code,design:s.design,effectKind:s.effectKind,
   progress:(now-start)/event.duration,visualPhase:visualPhase(s.code,(now-start)/event.duration),
   durationMs:event.duration,source:Object.freeze(bounds),screen:Object.freeze(rect),
   pixelWidth:viewport.pixelWidth,pixelHeight:viewport.pixelHeight,camera:Object.freeze({x:camera.x,y:camera.y}),
   scale:Object.freeze({x:sx,y:sy}),reducedMotion:Boolean(reducedMotion),
   sound:Object.freeze({required:true,profile:s.soundProfile,eventId:event.id,x:s.x,y:s.y,
    edge:'accepted-use-once',currentProfile:'object',playbackByCandidate:false,durationMs:s.sound.durationMs,material:s.sound.material})});
 }
 function planAll({map,effects,...context}={}){if(!Array.isArray(effects))return Object.freeze([]);const seen=new Set(),out=[];
  for(const e of effects){const p=plan({map,event:e,...context});if(p&&!seen.has(e.id)){seen.add(e.id);out.push(p);}}return Object.freeze(out);}
 function pack(p){const s=OBJECTS[p?.objectId];if(!s||p.code!==s.code||typeof p.eventId!=='string'||!p.eventId||
  ![p.pixelWidth,p.pixelHeight,p.source?.x,p.source?.y,p.source?.width,p.source?.height,p.camera?.x,p.camera?.y,
   p.scale?.x,p.scale?.y,p.progress].every(finite)||p.pixelWidth<=0||p.pixelHeight<=0||p.scale.x<=0||p.scale.y<=0||p.progress<0||p.progress>=1)
   throw new TypeError('Valid room object E plan required');
  const d=new Float32Array([p.camera.x,p.camera.y,p.scale.x,p.scale.y,p.source.x,p.source.y,p.source.width,p.source.height,
   p.pixelWidth,p.pixelHeight,0,0,p.progress,p.code,p.reducedMotion?1:0,0]);
  if(!d.every(finite))throw new RangeError('Room object E uniform exceeds float32 range');return d;}
 function create({renderer,frameOwner=renderer}={}){
  if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||!frameOwner.device?.createRenderPipeline||
   !frameOwner.device?.createBuffer||!frameOwner.device?.createBindGroup||!frameOwner.device?.queue?.writeBuffer||
   typeof frameOwner.own!=='function'||typeof frameOwner.release!=='function'||typeof frameOwner.format!=='string')
   throw new TypeError('Room object E requires ready shared WebGPU owner');
  const device=frameOwner.device,format=frameOwner.format,module=device.createShaderModule({label:'DVA room object use E',code:shader});
  const pipeline=device.createRenderPipeline({label:'DVA room source object E',layout:'auto',vertex:{module,entryPoint:'vs'},
   fragment:{module,entryPoint:'fs',targets:[{format,blend:{color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
   alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},primitive:{topology:'triangle-list'}});
  const slots=[],indices=new WeakMap(),seenByFrame=new WeakMap();let destroyed=false;
  function slot(i){if(slots[i])return slots[i];const buffer=frameOwner.own(device.createBuffer({label:`DVA room object E slot ${i}`,size:64,usage:0x40|0x08}));
   const bind=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer}}]});return(slots[i]={buffer,bind});}
  function record({frame,target,viewport,planned}={}){if(destroyed||frameOwner.state!=='ready')throw new Error('Room object E unavailable');
   if(!frame||typeof frame.stage!=='function'||typeof frame.add!=='function'||typeof target!=='string'||!target||viewport?.kind!=='main'||
    viewport.pixelWidth!==planned?.pixelWidth||viewport.pixelHeight!==planned?.pixelHeight)throw new TypeError('Room object E requires current main viewport plan');
   const d=pack(planned);let seen=seenByFrame.get(frame);if(!seen){seen=new Set();seenByFrame.set(frame,seen);}
   if(seen.has(planned.eventId))return Object.freeze({drawn:false,duplicate:true,eventId:planned.eventId});
   const i=indices.get(frame)||0;if(i>=MAX_FRAME_EVENTS)throw new RangeError('Room object E frame limit');const slotRef=slot(i);
   device.queue.writeBuffer(slotRef.buffer,0,d);frame.stage(`world:room-object-use-e:${planned.objectId}:${planned.eventId}`);
   frame.add({target,label:`world:${planned.design}:${planned.eventId}`,encode(pass,info){if(info.device!==device||info.format!==format||
    info.width!==viewport.pixelWidth||info.height!==viewport.pixelHeight)throw new Error('Room object E shared target mismatch');
    pass.setPipeline(pipeline);pass.setBindGroup(0,slotRef.bind);pass.draw(3);}});
   seen.add(planned.eventId);indices.set(frame,i+1);return Object.freeze({drawn:true,objectId:planned.objectId,eventId:planned.eventId,
    design:planned.design,soundProfile:planned.sound.profile,soundPlaybackOwned:false});
  }
  return Object.freeze({record,get state(){return destroyed?'destroyed':frameOwner.state;},destroy(){if(destroyed)return;destroyed=true;
   for(const s of slots)if(frameOwner.release(s.buffer))s.buffer.destroy();slots.length=0;}});
 }
 const api=Object.freeze({MAP_ID,DURATION_MS,OBJECTS,SFX_POLICY,SERVER_RACK_VISUAL,visualPhase,shader,supported,plan,planAll,pack,create});
 root.DvaWebGPURoomObjectUseE=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
