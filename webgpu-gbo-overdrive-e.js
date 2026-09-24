/* Textureless, event-owned GBO overdrive E for the shared WebGPU frame.
 * It visualizes the 1450 ms GBO event lifecycle only; it does not imply gear
 * destruction unless the exact server variant is `destroyed:weapon:<id>`. */
(function(root){
 'use strict';
 const TYPE='gbo-overdrive',DURATION_MS=1450;
 const WEAPONS=Object.freeze(['handgun','smg','assault','sniper','taser']);
 const STAGES=Object.freeze({charge:0,impact:1,destroyed:2});
 const RADIUS=Object.freeze({charge:175,impact:205,destroyed:185});
 const FLOATS=16,finite=Number.isFinite;
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
@fragment fn fs(@builtin(position)px:vec4f)->@location(0)vec4f{
 let q=(px.xy-p.view.zw)/max(p.geometry.xy,vec2f(.001));
 let t=clamp(p.state.x,0.0,1.0);let stage=p.state.y;let reduced=p.state.z>.5;let alpha=p.state.w;
 let phase=p.geometry.z;let charge=ease(t/.16);let decay=ease((t-.74)/.26);
 let quiet=select(t,.50,reduced);let ringR=select(.34+.43*charge,.78-.49*decay,t>.74);
 let r=length(vec2f(q.x,q.y*.94));let angle=atan2(q.y*.94,q.x);
 let shell=bell(r-ringR,.034);let inner=bell(r-(ringR-.14),.022);
 let rail=bell(r-(ringR+.14),.027)*(1.0-smoothstep(.28,.63,t));
 let gate=bell(q.x,.027)*smoothstep(-.82,-.64,q.y)*(1.0-smoothstep(.58,.78,q.y));
 let sweep=bell(angle-(quiet*6.28318+phase),.14)*bell(r-ringR,.09);
 let seeded=bell(angle-(phase+1.5708),.18)*bell(r-(.25+.31*charge),.055);
 var core=shell*.60+inner*.38+rail*.52+gate*.36+sweep*.62+seeded*.31;
 var glow=shell*.31+inner*.20+rail*.28+gate*.20+sweep*.33+seeded*.19;
 if(stage>.5&&stage<1.5){
   // Landing event: the field folds inward at its explicit impact point.
   let fold=ease(t/.43);let snap=bell(t-.22,.10);
   core=(shell*.56+inner*.50+rail*.20+sweep*.48)*(1.0-fold*.44)+snap*(shell*.55+inner*.30);
   glow=(shell*.32+inner*.25+rail*.14+sweep*.24)*(1.0-fold*.28)+snap*.24;
 }else if(stage>1.5){
   // Only this exact server stage denotes weapon destruction. Show a contained
   // overdrive collapse, never a fabricated weapon or flying debris.
   let collapse=ease(t/.40);let pulse=bell(t-.18,.11);
   core=(shell*.62+inner*.36+rail*.23)*(1.0-collapse)+pulse*(shell*.30+gate*.33);
   glow=(shell*.28+inner*.19+rail*.16)*(1.0-collapse)+pulse*.26;
 }
 let entry=smoothstep(0.0,.035,t);
 let leave=1.0-ease((t-.86)/.14);
 var brightness=1.0;
 if(stage>.5&&stage<1.5){brightness=1.12;}
 if(stage>1.5){brightness=1.05;}
 let outputAlpha=entry*leave*alpha;
 let source=clamp(core*outputAlpha*brightness,0.0,.96);
 let halo=clamp(glow*outputAlpha*.47*brightness,0.0,.34);
 let rgb=mix(vec3f(.24,.81,1.0),vec3f(.86,.97,1.0),clamp(.42+.24*sin(phase+quiet*6.28318),0.0,1.0));
 return vec4f(rgb*source+mix(rgb,vec3f(.92,.98,1.0),.37)*halo,clamp(source+halo*.53,0.0,.98));
}`;

 function parseVariant(variant){
   if(typeof variant!=='string')return null;
   let match;
   if((match=/^(?:activate|slash):(orichalcum-sword)$/.exec(variant)))
     return Object.freeze({stage:'charge',itemId:match[1],stageCode:STAGES.charge});
   if((match=/^(?:throw|impact):(orichalcum-sword|weapon:(handgun|smg|assault|sniper|taser))$/.exec(variant))){
     const stage=variant.startsWith('impact:')?'impact':'charge';
     return Object.freeze({stage,itemId:match[1],stageCode:STAGES[stage]});
   }
   if((match=/^magazine-commit:weapon:(handgun|smg|assault|sniper|taser)$/.exec(variant)))
     return Object.freeze({stage:'charge',itemId:`weapon:${match[1]}`,stageCode:STAGES.charge});
   if((match=/^destroyed:weapon:(handgun|smg|assault|sniper|taser)$/.exec(variant)))
     return Object.freeze({stage:'destroyed',itemId:`weapon:${match[1]}`,stageCode:STAGES.destroyed});
   return null;
 }
 function seedFor(id){let h=2166136261;for(let i=0;i<id.length;i++)h=Math.imul(h^id.charCodeAt(i),16777619);
   return (h>>>0)%100000/100000*Math.PI*2;}
 function plan({effect,players,viewerId,now,phase,camera,zoom,viewport,reducedMotion=false,alpha=1}={}){
   const meta=parseVariant(effect?.variant);
   if(!effect||effect.type!==TYPE||!effect.id||!meta||!Array.isArray(players)||!viewerId||
     String(effect.playerId||'')===''||phase!=='playing'||
     ![effect.x,effect.y,effect.radius,effect.startedAt,effect.duration,now,alpha].every(finite)||
     effect.duration<=0||effect.radius!==RADIUS[meta.stage]||alpha<=0||alpha>1||
     !camera||viewport?.kind!=='main'||![camera.x,camera.y,zoom,viewport.width,viewport.height,
       viewport.pixelWidth,viewport.pixelHeight].every(finite)||zoom<=0||viewport.width<=0||viewport.height<=0||
     !Number.isInteger(viewport.pixelWidth)||!Number.isInteger(viewport.pixelHeight)||
     viewport.pixelWidth<=0||viewport.pixelHeight<=0)return null;
   const owner=players.find(p=>String(p?.id||'')===String(effect.playerId));
   if(!owner||owner.invisible===true||owner.ejected===true)return null;
   const durationMs=Math.min(DURATION_MS,effect.duration),elapsed=now-effect.startedAt;
   if(elapsed<0||elapsed>=durationMs)return null;
   const sx=zoom*viewport.pixelWidth/viewport.width,sy=zoom*viewport.pixelHeight/viewport.height;
   const centerX=(effect.x-camera.x)*sx,centerY=(effect.y-camera.y)*sy;
   const radiusX=(effect.radius*.72+24)*sx,radiusY=(effect.radius*.72+24)*sy;
   if(![centerX,centerY,radiusX,radiusY].every(finite)||radiusX<=0||radiusY<=0||
     centerX+radiusX<0||centerX-radiusX>viewport.pixelWidth||
     centerY+radiusY<0||centerY-radiusY>viewport.pixelHeight)return null;
   return Object.freeze({effectId:String(effect.id),ownerId:String(effect.playerId),itemId:meta.itemId,
     stage:meta.stage,stageCode:meta.stageCode,centerX,centerY,radiusX,radiusY,seed:seedFor(String(effect.id)),
     progress:elapsed/durationMs,durationMs,reducedMotion:Boolean(reducedMotion),alpha,
     pixelWidth:viewport.pixelWidth,pixelHeight:viewport.pixelHeight});
 }
 function planBatch({effects,players,viewerId,...context}={}){
   if(!Array.isArray(effects)||!Array.isArray(players))throw new TypeError('GBO E requires normalized events and players');
   const seen=new Set(),out=[];
   for(const effect of effects){const id=String(effect?.id||'');if(!id||seen.has(id))continue;seen.add(id);
     if(effect.type!==TYPE)continue;const planned=plan({...context,effect,players,viewerId});if(planned)out.push(planned);}
   return Object.freeze(out);
 }
 function pack(p){if(!p||![p.centerX,p.centerY,p.radiusX,p.radiusY,p.seed,p.progress,p.alpha,p.pixelWidth,p.pixelHeight].every(finite)||
     !Object.values(STAGES).includes(p.stageCode))throw new TypeError('Valid GBO E plan required');
   const data=new Float32Array([p.pixelWidth,p.pixelHeight,p.centerX,p.centerY,p.radiusX,p.radiusY,p.seed,p.stageCode,
     Math.min(1,Math.max(0,p.progress)),p.stageCode,p.reducedMotion?1:0,Math.min(1,Math.max(0,p.alpha)),0,0,0,0]);
   if(!data.every(finite))throw new RangeError('GBO E exceeds float32 range');return data;}
 function create({renderer,frameOwner=renderer}={}){
   if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||!frameOwner.device?.queue?.writeBuffer||
     typeof frameOwner.own!=='function'||typeof frameOwner.release!=='function'||typeof frameOwner.format!=='string')
     throw new TypeError('GBO E requires the shared ready WebGPU frame owner');
   const device=frameOwner.device,format=frameOwner.format;
   const module=device.createShaderModule({label:'DVA GBO overdrive E WGSL',code:shader});
   const pipeline=device.createRenderPipeline({label:'DVA GBO overdrive E',layout:'auto',vertex:{module,entryPoint:'vs'},
     fragment:{module,entryPoint:'fs',targets:[{format,blend:{color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
       alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},primitive:{topology:'triangle-list'}});
   const slots=[],indices=new WeakMap();let destroyed=false;
   function slot(i){if(slots[i])return slots[i];const uniform=frameOwner.own(device.createBuffer({
     label:`DVA GBO overdrive E ${i}`,size:FLOATS*4,usage:0x40|0x08}));
     const bindGroup=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:uniform}}]});
     return(slots[i]={uniform,bindGroup});}
   function record({frame,target,viewport,planned}={}){
     if(destroyed||frameOwner.state!=='ready')throw new Error('GBO E unavailable');
     if(typeof frame?.add!=='function'||typeof frame?.stage!=='function'||typeof target!=='string'||!target||!planned||
       viewport?.kind!=='main'||viewport.pixelWidth!==planned.pixelWidth||viewport.pixelHeight!==planned.pixelHeight)
       throw new TypeError('GBO E needs current shared frame and plan');
     const i=indices.get(frame)||0,{uniform,bindGroup}=slot(i);device.queue.writeBuffer(uniform,0,pack(planned));
     frame.stage(`world:gbo-overdrive:${planned.effectId}`);frame.add({target,label:`DVA GBO E ${planned.effectId}`,encode(pass,info){
       if(info.device!==device||info.format!==format||info.width!==viewport.pixelWidth||info.height!==viewport.pixelHeight)
         throw new Error('GBO E target device, format or backing size mismatch');
       pass.setPipeline(pipeline);pass.setBindGroup(0,bindGroup);pass.draw(3);
     }});indices.set(frame,i+1);return Object.freeze({effectId:planned.effectId,stage:planned.stage,drawn:true});}
   return Object.freeze({plan,planBatch,record,shader,get state(){return destroyed?'destroyed':frameOwner.state;},
     destroy(){if(destroyed)return;destroyed=true;for(const s of slots)if(frameOwner.release(s.uniform))s.uniform.destroy();slots.length=0;}});
 }
 const api=Object.freeze({TYPE,DURATION_MS,WEAPONS,STAGES,RADIUS,shader,parseVariant,plan,planBatch,pack,create});
 root.DvaWebGPUGboOverdriveE=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
