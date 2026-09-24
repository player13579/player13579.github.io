/*
 * Textureless WebGPU environment-E candidate for the observatory.
 * A slow prismatic skylight spill lives on an open floor patch, away from the
 * star-chart table, reading lamp, command desk, task point, and room openings.
 * It is deliberately a visual-only candidate until a matching SFX is authored.
 */
(function(root){
 'use strict';
 const MAP_ID='station',ROOM_ID='observatory',SOURCE_ID='observatory-skylight-prism-floor',PERIOD_MS=14800,FLOATS=16;
 const SKY_SOURCE=Object.freeze({kind:'raster-skylight',texture:'field-aurelia-composite-v313.webp',anchor:{x:2500,y:205}});
 const FIELD=Object.freeze({x:2675,y:635,halfWidth:150,halfHeight:75});
 const OBJECT_IDS=Object.freeze(['v302-observatory-holoProjector-1','v302-observatory-readingLamp-2','v302-observatory-commandDesk-3']);
 const SFX_POLICY=Object.freeze({required:true,playback:false,loop:false,oneShot:false,complete:false,
  reason:'existing-woodsAir-belongs-to-foliage-and-no-observatory-skylight-sfx-exists',
  existingRoomOwner:'none-for-skylight',unrelatedAmbientOwner:'woodsAir',
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
 let t=select(phase,.31,reduced);
 // A single broad shaft descends from the fixed skylight direction. Two
 // wide spectral refractions shift very slightly inside the same aperture.
 let envelope=1.0-smoothstep(.70,1.0,length(vec2f(q.x*.92,q.y*1.18)));
 let breath=.92+.08*sin(t*6.2831853);
 let spine=q.x-(.12+.045*sin(t*6.2831853));
 let shaft=softline(spine,.34)*smoothstep(-.88,-.55,q.y)*(1.0-smoothstep(.54,.82,q.y))*envelope;
 let bandA=softline(q.x-(spine+.21+.025*cos(t*6.2831853*.7)),.052)*smoothstep(-.82,-.54,q.y)*(1.0-smoothstep(.38,.66,q.y))*envelope;
 let bandB=softline(q.x-(spine-.24-.018*cos(t*6.2831853*.55)),.045)*smoothstep(-.70,-.50,q.y)*(1.0-smoothstep(.24,.52,q.y))*envelope;
 let edge=softline(q.x-(spine+.015),.022)*smoothstep(-.72,-.48,q.y)*(1.0-smoothstep(.35,.62,q.y))*envelope;
 let broad=shaft*.15+bandA*.18+bandB*.14;
 let gleam=edge*.23;
 let body=(broad+gleam)*alpha*breath;
 let halo=(shaft*.21+bandA*.18+bandB*.14+edge*.28)*alpha*breath;
 let rgb=vec3f(.92,.73,.43)*shaft*.10+vec3f(.56,.78,.94)*bandA*.20+
          vec3f(.95,.84,.61)*bandB*.14+vec3f(.98,.92,.76)*edge*.28;
 return vec4f(rgb*alpha*breath,clamp(body+halo*.34,0.0,.38));
}`;
 function insidePolygon(x,y,polygon){
  if(!Array.isArray(polygon)||polygon.length<3)return false;let inside=false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
   const a=polygon[i],b=polygon[j];if(!Array.isArray(a)||!Array.isArray(b)||![a[0],a[1],b[0],b[1]].every(finite))return false;
   if(((a[1]>y)!==(b[1]>y))&&(x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]))inside=!inside;
  }return inside;
 }
 function rectDistance(x,y,r){const dx=Math.max(r.x-x,0,x-(r.x+r.w)),dy=Math.max(r.y-y,0,y-(r.y+r.h));return Math.hypot(dx,dy);}
 function plan({map,now,phase,roomVisible=true,camera,zoom,viewport,reducedMotion=false}={}){
  const room=map?.rooms?.find(r=>r?.id===ROOM_ID);
  if(map?.id!==MAP_ID||!room||room.x!==2000||room.y!==140||room.w!==1000||room.h!==680||
   !Array.isArray(room.polygon)||!['playing','meeting'].includes(phase)||roomVisible!==true||!finite(now)||
   !camera||![camera.x,camera.y,zoom,viewport?.width,viewport?.height,viewport?.pixelWidth,viewport?.pixelHeight].every(finite)||
   zoom<=0||viewport.width<=0||viewport.height<=0||!Number.isInteger(viewport.pixelWidth)||!Number.isInteger(viewport.pixelHeight)||
   viewport.kind!=='main'||viewport.pixelWidth<=0||viewport.pixelHeight<=0)return null;
  const bounds={x:FIELD.x-FIELD.halfWidth,y:FIELD.y-FIELD.halfHeight,w:FIELD.halfWidth*2,h:FIELD.halfHeight*2};
  const corners=[[bounds.x,bounds.y],[bounds.x+bounds.w,bounds.y],[bounds.x,bounds.y+bounds.h],[bounds.x+bounds.w,bounds.y+bounds.h]];
  if(!corners.every(([x,y])=>insidePolygon(x,y,room.polygon)))return null;
  const objects=(map.objects||[]).filter(o=>o.room===ROOM_ID);
  const byId=new Map(objects.map(o=>[o.id,o]));
  const expected=[['v302-observatory-holoProjector-1','holoProjector',2230,330],
   ['v302-observatory-readingLamp-2','readingLamp',2760,330],['v302-observatory-commandDesk-3','commandDesk',2240,636]];
  if(expected.some(([id,type,x,y])=>{const o=byId.get(id);return !o||o.type!==type||o.x!==x||o.y!==y;}))return null;
  const task=(map.stations||[]).find(s=>s.id==='download-c'&&s.room===ROOM_ID);
  if(!task||task.x!==2500||task.y!==466)return null;
  // Keep interaction fixtures/task radii and each approach aperture clear.
  const anchors=[...expected.map(([id,,x,y])=>({id,x,y,r:105})),{id:task.id,x:task.x,y:task.y,r:86}];
  if(anchors.some(a=>rectDistance(a.x,a.y,bounds)<a.r))return null;
  const openings=[
   {id:'d-observatory-west',x:1985,y:635,w:30,h:130},
   {id:'d-observatory-reactor',x:2985,y:525,w:30,h:130},
   {id:'d-observatory-atrium',x:2425,y:805,w:130,h:30}];
  for(const expectedDoor of openings){const door=(map.doors||[]).find(d=>d.id===expectedDoor.id);
   if(!door||door.x!==expectedDoor.x||door.y!==expectedDoor.y||door.w!==expectedDoor.w||door.h!==expectedDoor.h||
    rectDistance(door.x+door.w/2,door.y+door.h/2,bounds)<80)return null;}
  const approaches=[['a03',1880,610,200,180],['a04',3000,500,400,180],['a05',2380,820,220,260]];
  for(const [id,x,y,w,h] of approaches){const c=(map.corridors||[]).find(v=>v.id===id);
   if(!c||c.x!==x||c.y!==y||c.w!==w||c.h!==h||rectDistance(FIELD.x,FIELD.y,c)<80)return null;}
  const sx=zoom*viewport.pixelWidth/viewport.width,sy=zoom*viewport.pixelHeight/viewport.height;
  const centerX=(FIELD.x-camera.x)*sx,centerY=(FIELD.y-camera.y)*sy,radiusX=FIELD.halfWidth*sx,radiusY=FIELD.halfHeight*sy;
  if(![centerX,centerY,radiusX,radiusY].every(finite)||centerX+radiusX<0||centerX-radiusX>viewport.pixelWidth||
   centerY+radiusY<0||centerY-radiusY>viewport.pixelHeight)return null;
  const seconds=Math.max(0,now)/1000;
  return Object.freeze({sourceId:SOURCE_ID,mapId:MAP_ID,roomId:ROOM_ID,source:SKY_SOURCE,
   centerX,centerY,radiusX,radiusY,pixelWidth:viewport.pixelWidth,pixelHeight:viewport.pixelHeight,
   phase:(seconds%(PERIOD_MS/1000))/(PERIOD_MS/1000),reducedMotion:Boolean(reducedMotion),alpha:1,
   audio:Object.freeze({play:false,required:true,complete:false,missing:'observatory-skylight-sfx',owner:'none',unrelatedOwner:'woodsAir'}),
   startEdge:'visible-main-frame',stopEdge:'room-exit-or-full-clipping'});
 }
 function pack(p){if(!p||p.sourceId!==SOURCE_ID||![p.centerX,p.centerY,p.radiusX,p.radiusY,p.pixelWidth,p.pixelHeight,p.phase,p.alpha].every(finite)||
   p.radiusX<=0||p.radiusY<=0||p.pixelWidth<=0||p.pixelHeight<=0)throw new TypeError('Valid observatory environment E plan required');
  const data=new Float32Array([p.pixelWidth,p.pixelHeight,p.centerX,p.centerY,p.radiusX,p.radiusY,0,0,
   p.phase,p.reducedMotion?1:0,p.alpha,0,0,0,0,0]);
  if(!data.every(finite))throw new RangeError('Observatory environment E exceeds float32 range');return data;}
 function create({renderer,frameOwner=renderer}={}){
  if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||!frameOwner.device?.queue?.writeBuffer||
   typeof frameOwner.own!=='function'||typeof frameOwner.release!=='function'||typeof frameOwner.format!=='string')
   throw new TypeError('Observatory environment E requires shared ready WebGPU frame owner');
  const device=frameOwner.device,format=frameOwner.format,module=device.createShaderModule({label:'DVA observatory skylight environment E WGSL',code:shader});
  const pipeline=device.createRenderPipeline({label:'DVA observatory skylight environment E',layout:'auto',vertex:{module,entryPoint:'vs'},
   fragment:{module,entryPoint:'fs',targets:[{format,blend:{color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
    alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},primitive:{topology:'triangle-list'}});
  const uniform=frameOwner.own(device.createBuffer({label:'DVA observatory environment E params',size:FLOATS*4,usage:0x40|0x08}));
  const bindGroup=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:uniform}}]});let destroyed=false;
  function record({frame,target,viewport,planned}={}){
   if(destroyed||frameOwner.state!=='ready')throw new Error('Observatory environment E unavailable');
   if(typeof frame?.stage!=='function'||typeof frame?.add!=='function'||typeof target!=='string'||!target||!planned||
    viewport?.kind!=='main'||viewport.pixelWidth!==planned.pixelWidth||viewport.pixelHeight!==planned.pixelHeight)
    throw new TypeError('Observatory environment E requires current visible frame plan');
   device.queue.writeBuffer(uniform,0,pack(planned));frame.stage(`world:observatory-environment:${SOURCE_ID}`);
   frame.add({target,label:`DVA observatory environment E ${SOURCE_ID}`,encode(pass,info){
    if(info.device!==device||info.format!==format||info.width!==viewport.pixelWidth||info.height!==viewport.pixelHeight)
     throw new Error('Observatory environment E target mismatch');pass.setPipeline(pipeline);pass.setBindGroup(0,bindGroup);pass.draw(3);
   }});return Object.freeze({sourceId:SOURCE_ID,drawn:true,audio:false,audioMissing:true});
  }
  return Object.freeze({plan,record,shader,get state(){return destroyed?'destroyed':frameOwner.state;},destroy(){if(destroyed)return;destroyed=true;if(frameOwner.release(uniform))uniform.destroy();}});
 }
 const api=Object.freeze({MAP_ID,ROOM_ID,SOURCE_ID,PERIOD_MS,SKY_SOURCE,FIELD,OBJECT_IDS,SFX_POLICY,shader,plan,pack,create});
 root.DvaWebGPUObservatoryRoomEnvironmentE=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
