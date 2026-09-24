/* Finite, textureless bottle fragment/reflection E for the shared WebGPU frame.
 * It consumes only the dedicated landing splash event and its center/radius. */
(function(root){
  'use strict';
  const TYPE='bottle-shards',DURATION_MS=820,SHARD_COUNT=6;
  const BOTTLES=Object.freeze(['mercury','lead','mineral-water','seawater','antidote','molotov','ice','heated-water']);
  const MIN_RADIUS=112,MAX_RADIUS=128,FLOATS=16,finite=Number.isFinite;
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
 let t=clamp(p.state.x,0.0,1.0);let reduced=p.state.z>.5;let alpha=p.state.w;
 let motion=select(t,.54,reduced);let phase=p.geometry.z;var shards=0.0;var reflections=0.0;
 // Fixed loop bound: precisely six readable shards, never an unbounded particle field.
 for(var i=0u;i<6u;i=i+1u){
   let n=f32(i);let a=phase+n*1.04719755;
   let d=vec2f(cos(a),sin(a));let side=vec2f(-d.y,d.x);
   let travel=.07+.78*ease(motion/.72)+(n-2.5)*.012;
   let along=dot(q,d);let across=abs(dot(q,side));
   let shaft=bell(along-travel,.036)*bell(across,.011)*
     smoothstep(.02,.13,t)*(1.0-smoothstep(.80,.96,t));
   let taper=bell(along-travel+.045,.082)*bell(across,.027)*
     (1.0-smoothstep(.74,.95,t));
   let tip=bell(along-travel-.025,.012)*bell(across,.009)*
     (1.0-smoothstep(.80,.97,t));
   shards+=shaft*.74+taper*.43+tip*.88;
   // One cool specular glint travels along each glass splinter.
   let glint=bell(along-(travel-.025),.016)*bell(across,.020);
   reflections+=glint*(.34+.12*cos(n*2.2+phase*4.0));
 }
 let radius=length(q);let ringRadius=.16+.60*ease(t/.48);
 let fractureRing=bell(radius-ringRadius,.018)*(1.0-smoothstep(.43,.87,t));
 let centerFlash=bell(radius,.10)*(1.0-smoothstep(.035,.24,t));
 let endFade=1.0-smoothstep(.70,1.0,t);let appear=smoothstep(0.0,.035,t);
 let vis=appear*endFade*alpha;let body=shards+fractureRing*.46+centerFlash*.34;
 let shine=reflections+fractureRing*.27+centerFlash*.20;
 let glass=mix(vec3f(.28,.81,1.0),vec3f(.91,.99,1.0),clamp(shine,0.0,1.0));
 let source=clamp(body*vis,0.0,.94);let halo=clamp(shine*vis*.40,0.0,.26);
 return vec4f(glass*source+vec3f(.45,.83,1.0)*halo,clamp(source+halo*.48,0.0,.98));
}`;

  function bottleId(variant){
    if(typeof variant!=='string')return '';
    const id=variant.slice(0,variant.lastIndexOf(':'));
    const hits=variant.slice(variant.lastIndexOf(':')+1);
    return BOTTLES.includes(id)&&/^\d+$/.test(hits)?id:'';
  }
  function seedFor(id){let h=2166136261;for(let i=0;i<id.length;i++)h=Math.imul(h^id.charCodeAt(i),16777619);
    return ((h>>>0)%100000)/100000*Math.PI*2;}
  function plan({effect,players,viewerId,now,phase,camera,zoom,viewport,reducedMotion=false,alpha=1}={}){
    if(!effect||effect.type!==TYPE||!effect.id||!bottleId(effect.variant)||!Array.isArray(players)||
      !viewerId||!String(effect.playerId||'')||phase!=='playing'||!finite(now)||!finite(alpha)||alpha<=0||alpha>1||
      ![effect.x,effect.y,effect.radius,effect.startedAt,effect.duration].every(finite)||
      effect.duration<=0||![MIN_RADIUS,MAX_RADIUS].includes(effect.radius)||
      !camera||viewport?.kind!=='main'||![camera.x,camera.y,zoom,viewport.width,viewport.height,
        viewport.pixelWidth,viewport.pixelHeight].every(finite)||zoom<=0||viewport.width<=0||viewport.height<=0||
      !Number.isInteger(viewport.pixelWidth)||!Number.isInteger(viewport.pixelHeight)||
      viewport.pixelWidth<=0||viewport.pixelHeight<=0)return null;
    const owner=players.find(player=>String(player?.id||'')===String(effect.playerId));
    // A bottle burst has no private audience field. If its thrower is concealed
    // or cannot be resolved, the splash coordinate is not safe to disclose.
    if(!owner||owner.invisible===true||owner.ejected)return null;
    const durationMs=Math.min(DURATION_MS,effect.duration),elapsed=now-effect.startedAt;
    if(elapsed<0||elapsed>=durationMs)return null;
    const sx=zoom*viewport.pixelWidth/viewport.width,sy=zoom*viewport.pixelHeight/viewport.height;
    const centerX=(effect.x-camera.x)*sx,centerY=(effect.y-camera.y)*sy;
    const radiusX=(effect.radius+16)*sx,radiusY=(effect.radius+16)*sy;
    if(![centerX,centerY,radiusX,radiusY].every(finite)||radiusX<=0||radiusY<=0||
      centerX+radiusX<0||centerX-radiusX>viewport.pixelWidth||
      centerY+radiusY<0||centerY-radiusY>viewport.pixelHeight)return null;
    return Object.freeze({effectId:String(effect.id),type:TYPE,ownerId:String(effect.playerId),
      itemId:bottleId(effect.variant),hitCount:Number(effect.variant.slice(effect.variant.lastIndexOf(':')+1)),
      centerX,centerY,radiusX,radiusY,seed:seedFor(String(effect.id)),
      progress:elapsed/durationMs,durationMs,reducedMotion:Boolean(reducedMotion),alpha,
      pixelWidth:viewport.pixelWidth,pixelHeight:viewport.pixelHeight,shardCount:SHARD_COUNT});
  }
  function planBatch({effects,players,viewerId,...context}={}){
    if(!Array.isArray(effects)||!Array.isArray(players))throw new TypeError('Bottle shard E needs effects and players');
    const seen=new Set(),out=[];
    for(const effect of effects){const id=String(effect?.id||'');if(!id||seen.has(id))continue;seen.add(id);
      if(effect.type!==TYPE)continue;const p=plan({...context,effect,players,viewerId});if(p)out.push(p);}
    return Object.freeze(out);
  }
  function pack(p){if(!p||![p.progress,p.alpha,p.centerX,p.centerY,p.radiusX,p.radiusY,
      p.pixelWidth,p.pixelHeight,p.seed].every(finite)||p.shardCount!==SHARD_COUNT)
      throw new TypeError('Valid bottle shard E plan required');
    const data=new Float32Array([p.pixelWidth,p.pixelHeight,p.centerX,p.centerY,p.radiusX,p.radiusY,p.seed,0,
      Math.min(1,Math.max(0,p.progress)),0,p.reducedMotion?1:0,Math.min(1,Math.max(0,p.alpha)),0,0,0,0]);
    if(!data.every(finite))throw new RangeError('Bottle shard E exceeds float32 range');return data;}
  function create({renderer,frameOwner=renderer}={}){
    if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||!frameOwner.device?.queue?.writeBuffer||
      typeof frameOwner.own!=='function'||typeof frameOwner.release!=='function'||typeof frameOwner.format!=='string')
      throw new TypeError('Bottle shard E requires the shared ready WebGPU frame owner');
    const device=frameOwner.device,format=frameOwner.format;
    const module=device.createShaderModule({label:'DVA bottle-shards E WGSL',code:shader});
    const pipeline=device.createRenderPipeline({label:'DVA bottle-shards E',layout:'auto',vertex:{module,entryPoint:'vs'},
      fragment:{module,entryPoint:'fs',targets:[{format,blend:{color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
        alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},primitive:{topology:'triangle-list'}});
    const slots=[],indices=new WeakMap();let destroyed=false;
    function slot(i){if(slots[i])return slots[i];const uniform=frameOwner.own(device.createBuffer({
      label:`DVA bottle-shards E ${i}`,size:FLOATS*4,usage:0x40|0x08}));
      const bindGroup=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:uniform}}]});
      return(slots[i]={uniform,bindGroup});}
    function record({frame,target,viewport,planned}={}){
      if(destroyed||frameOwner.state!=='ready')throw new Error('Bottle shard E unavailable');
      if(typeof frame?.add!=='function'||typeof frame?.stage!=='function'||typeof target!=='string'||!target||!planned||
        viewport?.kind!=='main'||viewport.pixelWidth!==planned.pixelWidth||viewport.pixelHeight!==planned.pixelHeight)
        throw new TypeError('Bottle shard E needs current shared frame and plan');
      const i=indices.get(frame)||0,{uniform,bindGroup}=slot(i);device.queue.writeBuffer(uniform,0,pack(planned));
      frame.stage(`world:bottle-shards:${planned.effectId}`);frame.add({target,label:`DVA bottle shard E ${planned.effectId}`,encode(pass,info){
        if(info.device!==device||info.format!==format||info.width!==viewport.pixelWidth||info.height!==viewport.pixelHeight)
          throw new Error('Bottle shard E target device, format or backing size mismatch');
        pass.setPipeline(pipeline);pass.setBindGroup(0,bindGroup);pass.draw(3);
      }});indices.set(frame,i+1);return Object.freeze({effectId:planned.effectId,shardCount:SHARD_COUNT,drawn:true});}
    return Object.freeze({plan,planBatch,record,shader,get state(){return destroyed?'destroyed':frameOwner.state;},
      destroy(){if(destroyed)return;destroyed=true;for(const s of slots)if(frameOwner.release(s.uniform))s.uniform.destroy();slots.length=0;}});
  }
  const api=Object.freeze({TYPE,DURATION_MS,SHARD_COUNT,BOTTLES,MIN_RADIUS,MAX_RADIUS,shader,plan,planBatch,pack,create});
  root.DvaWebGPUBottleShardsE=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
