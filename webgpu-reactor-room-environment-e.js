/* Textureless, room-owned water-light environment E candidate.
 * It is a fixed reflection on dry stepping-stone floor, not the basin's own E. */
(function(root){
 'use strict';
 const MAP_ID='station',ROOM_ID='reactor',SOURCE_ID='reactor-water-caustic-floor',PERIOD_MS=11200,FLOATS=16;
 const SOURCE_OBJECT=Object.freeze({id:'v302-reactor-coolingUnit-2',type:'coolingUnit',effectKind:'stamina',x:4388,y:388});
 const FIELD=Object.freeze({x:4060,y:820,halfWidth:170,halfHeight:82});
 const SFX_POLICY=Object.freeze({playback:false,loop:false,oneShot:false,
  reason:'optical-refraction-has-no-independent-acoustic-event',existingRoomOwner:'woodsAir',
  start:'first-visible-main-frame',stop:'first-frame-fully-clipped-or-room-exit',periodicRearm:false});
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
fn softline(v:f32,w:f32)->f32{return exp(-sq(v)/max(sq(w),.0001));}
@fragment fn fs(@builtin(position)px:vec4f)->@location(0)vec4f{
 let q=(px.xy-p.view.zw)/max(p.geometry.xy,vec2f(.001));
 let phase=p.state.x;let reduced=p.state.y>.5;let alpha=p.state.z;
 let cycle=select(phase,0.38,reduced);
 // Still-water refraction travels only across a fixed dry-stone patch. The two
 // wide, irregular ribbons are separated layers of one optical projection.
 let gate=1.0-smoothstep(.70,1.0,length(vec2f(q.x*.84,q.y*1.13)));
 let drift=sin(cycle*6.2831853)*.045;
 let causticA=q.y-(.22+drift+.085*sin(q.x*2.65+cycle*6.2831853));
 let causticB=q.y-(-.24-drift*.72+.067*sin(q.x*2.05-cycle*6.2831853*.72+.8));
 let edgeA=softline(causticA,.067)*gate;
 let edgeB=softline(causticB,.052)*gate;
 let broadA=softline(causticA,.17)*gate;
 let broadB=softline(causticB,.145)*gate;
 let glint=(edgeA*.30+edgeB*.25)*(.62+.18*cos(cycle*6.2831853));
 let body=(broadA*.09+broadB*.075+glint)*alpha;
 let halo=(broadA*.20+broadB*.16+glint*.45)*alpha;
 let light=vec3f(.30,.77,.88);
 let rgb=light*body+mix(light,vec3f(.83,.96,.91),.28)*halo;
 return vec4f(rgb,clamp(body+halo*.42,0.0,.34));
}`;
 function insidePolygon(x,y,polygon){
  if(!Array.isArray(polygon)||polygon.length<3)return false;let inside=false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
   const a=polygon[i],b=polygon[j];if(!Array.isArray(a)||!Array.isArray(b)||![a[0],a[1],b[0],b[1]].every(finite))return false;
   if(((a[1]>y)!==(b[1]>y))&&(x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]))inside=!inside;
  }return inside;
 }
 function rectDistance(x,y,rect){const dx=Math.max(rect.x-x,0,x-(rect.x+rect.w)),dy=Math.max(rect.y-y,0,y-(rect.y+rect.h));return Math.hypot(dx,dy);}
 function plan({map,now,phase,roomVisible=true,camera,zoom,viewport,reducedMotion=false}={}){
  const room=map?.rooms?.find(r=>r?.id===ROOM_ID),source=map?.objects?.find(o=>o?.id===SOURCE_OBJECT.id);
  if(map?.id!==MAP_ID||!room||room.x!==3400||room.y!==150||room.w!==1300||room.h!==850||
   !Array.isArray(room.polygon)||!source||source.type!==SOURCE_OBJECT.type||source.effectKind!==SOURCE_OBJECT.effectKind||
   source.x!==SOURCE_OBJECT.x||source.y!==SOURCE_OBJECT.y||!['playing','meeting'].includes(phase)||roomVisible!==true||
   !finite(now)||!camera||![camera.x,camera.y,zoom,viewport?.width,viewport?.height,viewport?.pixelWidth,viewport?.pixelHeight].every(finite)||
   zoom<=0||viewport.width<=0||viewport.height<=0||!Number.isInteger(viewport.pixelWidth)||!Number.isInteger(viewport.pixelHeight)||
   viewport.kind!=='main'||viewport.pixelWidth<=0||viewport.pixelHeight<=0||!insidePolygon(FIELD.x,FIELD.y,room.polygon))return null;
  // Existing visible structures and their operation centers stay clear of the
  // floor reflection. Door apertures and the only room approach stay unobscured.
  const anchors=[...(map.stations||[]).filter(s=>s.room===ROOM_ID).map(s=>({x:s.x,y:s.y,r:86})),
   ...(map.objects||[]).filter(o=>o.room===ROOM_ID).map(o=>({x:o.x,y:o.y,r:100}))];
  if(anchors.some(a=>rectDistance(a.x,a.y,{x:FIELD.x-FIELD.halfWidth,y:FIELD.y-FIELD.halfHeight,
   w:FIELD.halfWidth*2,h:FIELD.halfHeight*2})<a.r))return null;
  const doors=(map.doors||[]).filter(d=>d.id==='d-reactor-engineering');
  const westApproach=(map.corridors||[]).find(c=>c.id==='a04');
  if(!westApproach||westApproach.x!==3000||westApproach.y!==500||westApproach.w!==400||westApproach.h!==180||
   doors.length!==1||rectDistance(doors[0].x+doors[0].w/2,doors[0].y+doors[0].h/2,
   {x:FIELD.x-FIELD.halfWidth,y:FIELD.y-FIELD.halfHeight,w:FIELD.halfWidth*2,h:FIELD.halfHeight*2})<80)return null;
  const sx=zoom*viewport.pixelWidth/viewport.width,sy=zoom*viewport.pixelHeight/viewport.height;
  const centerX=(FIELD.x-camera.x)*sx,centerY=(FIELD.y-camera.y)*sy;
  const radiusX=FIELD.halfWidth*sx,radiusY=FIELD.halfHeight*sy;
  if(![centerX,centerY,radiusX,radiusY].every(finite)||centerX+radiusX<0||centerX-radiusX>viewport.pixelWidth||
   centerY+radiusY<0||centerY-radiusY>viewport.pixelHeight)return null;
  const seconds=Math.max(0,now)/1000;
  return Object.freeze({sourceId:SOURCE_ID,mapId:MAP_ID,roomId:ROOM_ID,sourceObjectId:SOURCE_OBJECT.id,
   centerX,centerY,radiusX,radiusY,pixelWidth:viewport.pixelWidth,pixelHeight:viewport.pixelHeight,
   phase:(seconds% (PERIOD_MS/1000))/(PERIOD_MS/1000),reducedMotion:Boolean(reducedMotion),alpha:1,
   audio:Object.freeze({play:false,owner:'none',existingOwner:SFX_POLICY.existingRoomOwner}),
   startEdge:'visible-main-frame',stopEdge:'room-exit-or-full-clipping'});
 }
 function pack(p){if(!p||p.sourceId!==SOURCE_ID||![p.centerX,p.centerY,p.radiusX,p.radiusY,p.pixelWidth,p.pixelHeight,p.phase,p.alpha].every(finite)||
   p.radiusX<=0||p.radiusY<=0||p.pixelWidth<=0||p.pixelHeight<=0)throw new TypeError('Valid reactor environment E plan required');
  const data=new Float32Array([p.pixelWidth,p.pixelHeight,p.centerX,p.centerY,p.radiusX,p.radiusY,0,0,
   p.phase,p.reducedMotion?1:0,p.alpha,0,0,0,0,0]);
  if(!data.every(finite))throw new RangeError('Reactor environment E exceeds float32 range');return data;}
 function create({renderer,frameOwner=renderer}={}){
  if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||!frameOwner.device?.queue?.writeBuffer||
   typeof frameOwner.own!=='function'||typeof frameOwner.release!=='function'||typeof frameOwner.format!=='string')
   throw new TypeError('Reactor environment E requires shared ready WebGPU frame owner');
  const device=frameOwner.device,format=frameOwner.format,module=device.createShaderModule({label:'DVA reactor water-caustic environment E WGSL',code:shader});
  const pipeline=device.createRenderPipeline({label:'DVA reactor water-caustic environment E',layout:'auto',vertex:{module,entryPoint:'vs'},
   fragment:{module,entryPoint:'fs',targets:[{format,blend:{color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
    alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},primitive:{topology:'triangle-list'}});
  const uniform=frameOwner.own(device.createBuffer({label:'DVA reactor environment E params',size:FLOATS*4,usage:0x40|0x08}));
  const bindGroup=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:uniform}}]});let destroyed=false;
  function record({frame,target,viewport,planned}={}){
   if(destroyed||frameOwner.state!=='ready')throw new Error('Reactor environment E unavailable');
   if(typeof frame?.stage!=='function'||typeof frame?.add!=='function'||typeof target!=='string'||!target||!planned||
    viewport?.kind!=='main'||viewport.pixelWidth!==planned.pixelWidth||viewport.pixelHeight!==planned.pixelHeight)
    throw new TypeError('Reactor environment E requires current visible frame plan');
   device.queue.writeBuffer(uniform,0,pack(planned));frame.stage(`world:reactor-environment:${SOURCE_ID}`);
   frame.add({target,label:`DVA reactor environment E ${SOURCE_ID}`,encode(pass,info){
    if(info.device!==device||info.format!==format||info.width!==viewport.pixelWidth||info.height!==viewport.pixelHeight)
     throw new Error('Reactor environment E target mismatch');pass.setPipeline(pipeline);pass.setBindGroup(0,bindGroup);pass.draw(3);
   }});return Object.freeze({sourceId:SOURCE_ID,drawn:true,audio:false});
  }
  return Object.freeze({plan,record,shader,get state(){return destroyed?'destroyed':frameOwner.state;},destroy(){if(destroyed)return;destroyed=true;if(frameOwner.release(uniform))uniform.destroy();}});
 }
 const api=Object.freeze({MAP_ID,ROOM_ID,SOURCE_ID,PERIOD_MS,SOURCE_OBJECT,FIELD,SFX_POLICY,shader,plan,pack,create});
 root.DvaWebGPUReactorRoomEnvironmentE=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
