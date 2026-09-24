/* Textureless compressed-contact E for authoritative rigid-item impacts.
 * The event exposes a resolved contact point, class, contact face, attempted
 * damage and luck value; it does not expose reflection or durability outcomes. */
(function(root){
 'use strict';
 const TYPE='rigid-item-impact',DURATION_MS=620,FEATURE_COUNT=4;
 const CLASSES=Object.freeze({sword:0,firearm:1,invention:2,heavy:3,rigid:4});
 const CONTACTS=Object.freeze({blade:0,'safe-side':1,body:2});
 const GBO_MULTIPLIER=2.2,finite=Number.isFinite,FLOATS=16;
 const shader=/* wgsl */`
struct Params{view:vec4f,geometry:vec4f,state:vec4f,extra:vec4f};
@group(0)@binding(0)var<uniform>p:Params;
struct Vertex{@builtin(position)position:vec4f};
@vertex fn vs(@builtin(vertex_index)i:u32)->Vertex{
 let v=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3))[i];
 var o:Vertex;o.position=vec4f(v,0,1);return o;
}
fn sq(v:f32)->f32{return v*v;}
fn bell(v:f32,w:f32)->f32{return exp(-sq(v)/max(sq(w),.0001));}
fn ease(v:f32)->f32{let x=clamp(v,0.0,1.0);return x*x*(3.0-2.0*x);}
@fragment fn fs(@builtin(position)pixel:vec4f)->@location(0)vec4f{
 let q=(pixel.xy-p.view.zw)/max(p.geometry.xy,vec2f(.001));
 let t=clamp(p.state.x,0.0,1.0);let contact=p.state.y;let reduced=p.state.z>.5;
 let alpha=p.state.w;let seed=p.geometry.z;let impactClass=p.geometry.w;let boosted=p.extra.x>.5;
 let collapse=ease(t/.16);let release=ease((t-.13)/.36);let fade=1.0-ease((t-.57)/.43);
 let r=length(q);let ringR=mix(.50,.13,collapse)+.26*release;
 let pressure=bell(r-ringR,.027)*(1.0-ease((t-.36)/.27));
 let inner=bell(r-(.12+.16*collapse),.042)*(1.0-ease((t-.44)/.25));
 // Four fixed, short reflection facets. These are specular glints, not a
 // claim that the server resolved a guard reflection or broke an item.
 var facets=0.0;var gleam=0.0;
 for(var i=0u;i<4u;i=i+1u){
  let a=seed+f32(i)*1.5707963;let d=vec2f(cos(a),sin(a));let side=vec2f(-d.y,d.x);
  let distance=dot(q,d);let lateral=abs(dot(q,side));
  let pulse=bell(distance-(.29-.13*collapse),.022)*bell(lateral,.012);
  let echo=bell(distance-(.19+.12*release),.035)*bell(lateral,.020);
  facets+=pulse;gleam+=echo;
 }
 let blade=contact<.5;let flatSide=contact>.5&&contact<1.5;
 let starX=bell(abs(q.x),.026)*bell(q.y,.14);
 let starY=bell(abs(q.y),.026)*bell(q.x,.14);
 let bladeContact=(starX+starY)*select(.18,.72,blade);
 let broadContact=bell(ringR-r,.055)*(1.0-smoothstep(.18,.55,r));
 let contactCore=select(select(broadContact,inner,blade),pressure,flatSide);
 let core=(pressure*.62+inner*.30+facets*.40+bladeContact*.55+contactCore*.42)*fade;
 let glow=(pressure*.29+inner*.20+gleam*.42+facets*.18+broadContact*.16)*fade;
 var rgb=vec3f(.55,.83,1.0);
 if(impactClass<.5){rgb=vec3f(.72,.88,1.0);}
 else if(impactClass<1.5){rgb=vec3f(.46,.88,1.0);}
 else if(impactClass<2.5){rgb=vec3f(.72,.72,1.0);}
 else if(impactClass<3.5){rgb=vec3f(.91,.80,.57);}
 if(boosted){rgb=mix(rgb,vec3f(1.0,.88,.59),.28);}
 let arrival=smoothstep(0.0,.035,t);let quiet=select(1.0,.82,reduced);
 let source=clamp(core*arrival*quiet*alpha,0.0,.95);let halo=clamp(glow*arrival*quiet*alpha*.42,0.0,.29);
 return vec4f(rgb*source+mix(rgb,vec3f(.96,1.0,1.0),.30)*halo,clamp(source+halo*.50,0.0,.98));
}`;
 function parse(variant){
   if(typeof variant!=='string')return null;
   const m=/^(gbo:)?(sword|firearm|invention|heavy|rigid):(blade|safe-side|body):(\d+\.\d{2}):luck-(-?\d+\.\d{2})$/.exec(variant);
   if(!m)return null;
   const [,gbo,kind,contact,damageText,luckText]=m;
   if(kind==='sword'?!['blade','safe-side'].includes(contact):contact!=='body')return null;
   const damage=Number(damageText),luck=Number(luckText);
   if(!(damage>0)||!finite(luck)||luck < -1||luck > 1)return null;
   const boost=gbo?10:1;
   const range=kind==='sword'&&contact==='blade'?[2,2]:kind==='sword'?[.12,.51]:
     kind==='firearm'?[.08,.36]:[.10,.60];
   if(damage<range[0]*boost-.005||damage>range[1]*boost+.005)return null;
   return Object.freeze({gbo:Boolean(gbo),kind,contact,damage,luck});
 }
 function expectedRadius(meta){return (meta.kind==='sword'?112:82)*(meta.gbo?GBO_MULTIPLIER:1);}
 function seedFor(id){let h=2166136261;for(let i=0;i<id.length;i++)h=Math.imul(h^id.charCodeAt(i),16777619);
   return (h>>>0)%100000/100000*Math.PI*2;}
 function plan({effect,players,viewerId,now,phase,camera,zoom,viewport,reducedMotion=false,alpha=1}={}){
   const meta=parse(effect?.variant);
   if(!effect||effect.type!==TYPE||!effect.id||!meta||!Array.isArray(players)||!viewerId||
     !String(effect.playerId||'')||!String(effect.targetId||'')||phase!=='playing'||
     !finite(effect.x)||!finite(effect.y)||!finite(effect.radius)||
     Math.abs(effect.radius-expectedRadius(meta))>1e-6||
     !finite(effect.startedAt)||!finite(effect.duration)||effect.duration<=0||!finite(now)||
     !finite(alpha)||alpha<=0||alpha>1||!camera||viewport?.kind!=='main'||
     ![camera.x,camera.y,zoom,viewport.width,viewport.height,viewport.pixelWidth,viewport.pixelHeight].every(finite)||
     zoom<=0||viewport.width<=0||viewport.height<=0||!Number.isInteger(viewport.pixelWidth)||
     !Number.isInteger(viewport.pixelHeight)||viewport.pixelWidth<=0||viewport.pixelHeight<=0)return null;
   const owner=players.find(p=>String(p?.id||'')===String(effect.playerId));
   const target=players.find(p=>String(p?.id||'')===String(effect.targetId));
   // This event has no private audience field. Suppress it if either impacted
   // actor is concealed, or if the actor needed to authorize the public contact is absent.
   if(!owner||!target||owner.invisible===true||target.invisible===true||target.inVent===true||
     owner.ejected===true||target.ejected===true)return null;
   const durationMs=Math.min(DURATION_MS,effect.duration),elapsed=now-effect.startedAt;
   if(elapsed<0||elapsed>=durationMs)return null;
   const sx=zoom*viewport.pixelWidth/viewport.width,sy=zoom*viewport.pixelHeight/viewport.height;
   const centerX=(effect.x-camera.x)*sx,centerY=(effect.y-camera.y)*sy;
   const worldExtent=effect.radius*.58+24,radiusX=worldExtent*sx,radiusY=worldExtent*sy;
   if(![centerX,centerY,radiusX,radiusY].every(finite)||radiusX<=0||radiusY<=0||
     centerX+radiusX<0||centerX-radiusX>viewport.pixelWidth||centerY+radiusY<0||centerY-radiusY>viewport.pixelHeight)return null;
   return Object.freeze({effectId:String(effect.id),ownerId:String(effect.playerId),targetId:String(effect.targetId),
     kind:meta.kind,contact:meta.contact,gbo:meta.gbo,profileDamage:meta.damage,luck:meta.luck,
     centerX,centerY,radiusX,radiusY,seed:seedFor(String(effect.id)),progress:elapsed/durationMs,durationMs,
     reducedMotion:Boolean(reducedMotion),alpha,pixelWidth:viewport.pixelWidth,pixelHeight:viewport.pixelHeight,
     featureCount:FEATURE_COUNT});
 }
 function planBatch({effects,players,viewerId,...context}={}){
   if(!Array.isArray(effects)||!Array.isArray(players))throw new TypeError('Rigid impact E requires event/player arrays');
   const seen=new Set(),out=[];
   for(const effect of effects){const id=String(effect?.id||'');if(!id||seen.has(id))continue;seen.add(id);
     if(effect.type!==TYPE)continue;const p=plan({...context,effect,players,viewerId});if(p)out.push(p);}
   return Object.freeze(out);
 }
 function pack(p){if(!p||![p.progress,p.alpha,p.centerX,p.centerY,p.radiusX,p.radiusY,p.seed,p.pixelWidth,p.pixelHeight].every(finite)||
     !Object.hasOwn(CLASSES,p.kind)||!Object.hasOwn(CONTACTS,p.contact)||p.featureCount!==FEATURE_COUNT)
     throw new TypeError('Valid rigid impact E plan required');
   const d=new Float32Array([p.pixelWidth,p.pixelHeight,p.centerX,p.centerY,p.radiusX,p.radiusY,p.seed,CLASSES[p.kind],
     Math.min(1,Math.max(0,p.progress)),CONTACTS[p.contact],p.reducedMotion?1:0,Math.min(1,Math.max(0,p.alpha)),
     p.gbo?1:0,0,0,0]);if(!d.every(finite))throw new RangeError('Rigid impact E exceeds float32 range');return d;}
 function create({renderer,frameOwner=renderer}={}){
   if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||!frameOwner.device?.queue?.writeBuffer||
     typeof frameOwner.own!=='function'||typeof frameOwner.release!=='function'||typeof frameOwner.format!=='string')
     throw new TypeError('Rigid impact E requires the shared ready WebGPU frame owner');
   const device=frameOwner.device,format=frameOwner.format;
   const module=device.createShaderModule({label:'DVA rigid item impact E WGSL',code:shader});
   const pipeline=device.createRenderPipeline({label:'DVA rigid item impact E',layout:'auto',vertex:{module,entryPoint:'vs'},
     fragment:{module,entryPoint:'fs',targets:[{format,blend:{color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
       alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},primitive:{topology:'triangle-list'}});
   const slots=[],indices=new WeakMap();let destroyed=false;
   function slot(i){if(slots[i])return slots[i];const uniform=frameOwner.own(device.createBuffer({
     label:`DVA rigid impact E ${i}`,size:FLOATS*4,usage:0x40|0x08}));
     const bindGroup=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:uniform}}]});
     return(slots[i]={uniform,bindGroup});}
   function record({frame,target,viewport,planned}={}){
     if(destroyed||frameOwner.state!=='ready')throw new Error('Rigid impact E unavailable');
     if(typeof frame?.add!=='function'||typeof frame?.stage!=='function'||typeof target!=='string'||!target||!planned||
       viewport?.kind!=='main'||viewport.pixelWidth!==planned.pixelWidth||viewport.pixelHeight!==planned.pixelHeight)
       throw new TypeError('Rigid impact E needs current shared frame and plan');
     const i=indices.get(frame)||0,{uniform,bindGroup}=slot(i);device.queue.writeBuffer(uniform,0,pack(planned));
     frame.stage(`world:rigid-item-impact:${planned.effectId}`);frame.add({target,label:`DVA rigid impact E ${planned.effectId}`,encode(pass,info){
       if(info.device!==device||info.format!==format||info.width!==viewport.pixelWidth||info.height!==viewport.pixelHeight)
         throw new Error('Rigid impact E target device, format or backing size mismatch');
       pass.setPipeline(pipeline);pass.setBindGroup(0,bindGroup);pass.draw(3);
     }});indices.set(frame,i+1);return Object.freeze({effectId:planned.effectId,featureCount:FEATURE_COUNT,drawn:true});}
   return Object.freeze({plan,planBatch,record,shader,get state(){return destroyed?'destroyed':frameOwner.state;},
     destroy(){if(destroyed)return;destroyed=true;for(const s of slots)if(frameOwner.release(s.uniform))s.uniform.destroy();slots.length=0;}});
 }
 const api=Object.freeze({TYPE,DURATION_MS,FEATURE_COUNT,CLASSES,CONTACTS,parse,expectedRadius,shader,plan,planBatch,pack,create});
 root.DvaWebGPURigidItemImpactE=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
