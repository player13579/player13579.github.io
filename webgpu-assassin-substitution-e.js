/* Textureless substitution grant/trigger E. Spatial anchors are exclusively
 * event.x/y and, for a completed substitution, event.targetX/targetY. */
(function(root){
  'use strict';
  const GRANT='action-assassin-substitution-grant',TRIGGER='substitution';
  const DURATION=Object.freeze({[GRANT]:820,[TRIGGER]:1200});
  const finite=Number.isFinite,FLOATS=16;
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
fn angleGap(a:f32,b:f32)->f32{return abs(atan2(sin(a-b),cos(a-b)));}
@fragment fn fs(@builtin(position)px:vec4f)->@location(0)vec4f{
 let q=(px.xy-p.view.zw)/max(p.geometry.xy,vec2f(.001));
 let t=clamp(p.state.x,0.0,1.0);let kind=p.state.y;let reduced=p.state.z>.5;let alpha=p.state.w;
 var core=0.0;var glow=0.0;var rgb=vec3f(.66,.42,1.0);
 if(kind<.5){
   // Grant: one charge locks around the explicitly named caster point.
   // The recipient identity is metadata only; no inferred target coordinates.
   let quiet=select(t,.5,reduced);let radius=.32+.34*ease(quiet/.58);
   let r=length(q);let a=atan2(q.y,q.x);let spin=quiet*6.28318;
   let shell=bell(r-radius,.040);
   let twoBrackets=bell(angleGap(a,spin),.17)*bell(r-radius,.10)+
      bell(angleGap(a,spin+3.14159),.17)*bell(r-radius,.10);
   let lock=bell(q.x,.12)*bell(q.y,.10)*(1.0-ease(t/.38));
   core=shell*.62+twoBrackets*.86+lock*.35;
   glow=shell*.32+twoBrackets*.31+lock*.20;
   rgb=mix(vec3f(.64,.43,1.0),vec3f(.70,.94,1.0),ease(quiet));
 }else{
   // Trigger: both endpoint locations come from the successful server event.
   // Two portal rims exchange energy along their straight, explicit path.
   let a=p.extra.xy;let b=p.extra.zw;let quiet=select(t,.5,reduced);
   let delta=b-a;let pathLength=max(length(delta),.001);let dir=delta/pathLength;
   let progress=ease(t/.72);let sourceRim=bell(length(q-a)-(.34*(1.0-progress)+.035),.035);
   let targetRim=bell(length(q-b)-(.035+.30*progress),.035);
   let along=dot(q-a,dir);let across=abs((q-a).x*dir.y-(q-a).y*dir.x);
   let front=pathLength*progress;
   let transit=bell(along-front,.11)*bell(across,.060)*smoothstep(.04,.15,t);
   let wake=bell(along-front+.18,.17)*bell(across,.13)*(1.0-smoothstep(.55,.94,t));
   let arc=bell(across-.12*sin(clamp(along/pathLength,0.0,1.0)*3.14159),.035)*
      (1.0-smoothstep(.08,.48,abs(along-pathLength*.5)));
   let reappear=1.0-ease((t-.72)/.27);
   core=sourceRim*(.88*(1.0-progress))+targetRim*(.95*reappear)+transit*.78+wake*.27+arc*.22;
   glow=sourceRim*.38+targetRim*.42+transit*.35+wake*.24+arc*.14;
   rgb=mix(vec3f(.72,.43,1.0),vec3f(.42,.95,1.0),smoothstep(0.0,1.0,along/pathLength));
   let _reducedQuiet=quiet;
 }
 let fade=smoothstep(0.0,.045,t)*(1.0-smoothstep(.92,1.0,t));
 let calm=select(1.0,.82,reduced);let visibility=fade*calm*alpha;
 let source=clamp(core*visibility,0.0,.94);let halo=clamp(glow*visibility*.46,0.0,.30);
 return vec4f(rgb*(source+halo*.46),clamp(source+halo*.55,0.0,.98));
}`;

  function viewGrant(viewerId,subjectId,grant){
    return viewerId!=null&&subjectId!=null&&String(viewerId)===String(subjectId)&&
      String(grant?.viewerId||'')===String(viewerId)&&String(grant?.subjectId||'')===String(subjectId)&&
      grant?.scope==='self-only';
  }
  function plan({effect,players=[],viewerId,visibilityGrant=null,now,phase,camera,zoom,viewport,
    reducedMotion=false,alpha=1}={}){
    if(!effect||!['playing'].includes(phase)||!effect.id||!finite(now)||!finite(alpha)||alpha<=0||alpha>1||
      !camera||viewport?.kind!=='main'||![camera.x,camera.y,zoom,viewport.width,viewport.height,
        viewport.pixelWidth,viewport.pixelHeight].every(finite)||zoom<=0||viewport.width<=0||viewport.height<=0||
      !Number.isInteger(viewport.pixelWidth)||!Number.isInteger(viewport.pixelHeight)||
      viewport.pixelWidth<=0||viewport.pixelHeight<=0)return null;
    const kind=effect.type===GRANT?'grant':effect.type===TRIGGER?'trigger':'';
    if(!kind||!String(effect.playerId||'')||!finite(effect.startedAt)||!finite(effect.duration)||effect.duration<=0)return null;
    const ownerId=String(effect.playerId),playersById=new Map(players.filter(p=>p?.id).map(p=>[String(p.id),p]));
    const owner=playersById.get(ownerId);
    if(!owner||!owner.alive||owner.ejected||owner.inVent)return null;
    if(kind==='grant'){
      if(!effect.targetId||!finite(effect.x)||!finite(effect.y))return null;
      const recipient=playersById.get(String(effect.targetId));
      if(recipient?.invisible===true&&!viewGrant(viewerId,recipient.id,visibilityGrant))return null;
      if(owner.invisible===true&&!viewGrant(viewerId,owner.id,visibilityGrant))return null;
    }else{
      if(!finite(effect.x)||!finite(effect.y)||!finite(effect.targetX)||!finite(effect.targetY))return null;
      if(owner.invisible===true&&!viewGrant(viewerId,owner.id,visibilityGrant))return null;
    }
    const durationMs=Math.min(DURATION[effect.type],effect.duration),elapsed=now-effect.startedAt;
    if(elapsed<0||elapsed>=durationMs)return null;
    const sx=zoom*viewport.pixelWidth/viewport.width,sy=zoom*viewport.pixelHeight/viewport.height;
    const source={x:(effect.x-camera.x)*sx,y:(effect.y-camera.y)*sy};
    const dest=kind==='trigger'?{x:(effect.targetX-camera.x)*sx,y:(effect.targetY-camera.y)*sy}:source;
    const centerX=(source.x+dest.x)/2,centerY=(source.y+dest.y)/2;
    const radiusX=Math.max(58*sx,Math.abs(dest.x-source.x)/2+52*sx);
    const radiusY=Math.max(58*sy,Math.abs(dest.y-source.y)/2+52*sy);
    if(![centerX,centerY,radiusX,radiusY].every(finite)||
      centerX+radiusX*1.1<0||centerX-radiusX*1.1>viewport.pixelWidth||
      centerY+radiusY*1.1<0||centerY-radiusY*1.1>viewport.pixelHeight)return null;
    return Object.freeze({effectId:String(effect.id),kind,ownerId,
      recipientId:kind==='grant'?String(effect.targetId):'',
      defenderId:kind==='trigger'?ownerId:null,attackerId:null,
      sourceX:source.x,sourceY:source.y,destinationX:dest.x,destinationY:dest.y,
      localSourceX:(source.x-centerX)/radiusX,localSourceY:(source.y-centerY)/radiusY,
      localDestinationX:(dest.x-centerX)/radiusX,localDestinationY:(dest.y-centerY)/radiusY,
      progress:elapsed/durationMs,durationMs,reducedMotion:Boolean(reducedMotion),alpha,
      centerX,centerY,radiusX,radiusY,pixelWidth:viewport.pixelWidth,pixelHeight:viewport.pixelHeight});
  }
  function planBatch({effects,players,viewerId,visibilityGrantFor,...context}={}){
    if(!Array.isArray(effects)||!Array.isArray(players))throw new TypeError('Substitution E needs events and players');
    const seen=new Set(),out=[];
    for(const effect of effects){const id=String(effect?.id||'');if(!id||seen.has(id))continue;seen.add(id);
      const grant=typeof visibilityGrantFor==='function'?visibilityGrantFor(effect,viewerId,players):null;
      const planned=plan({...context,effect,players,viewerId,visibilityGrant:grant});if(planned)out.push(planned);}
    return Object.freeze(out);
  }
  function pack(p){if(!p||![p.progress,p.alpha,p.centerX,p.centerY,p.radiusX,p.radiusY,
      p.pixelWidth,p.pixelHeight,p.localSourceX,p.localSourceY,p.localDestinationX,p.localDestinationY].every(finite))
      throw new TypeError('Valid substitution E plan required');
    const data=new Float32Array([p.pixelWidth,p.pixelHeight,p.centerX,p.centerY,p.radiusX,p.radiusY,0,
      p.kind==='grant'?0:1,Math.min(1,Math.max(0,p.progress)),p.kind==='grant'?0:1,
      p.reducedMotion?1:0,Math.min(1,Math.max(0,p.alpha)),p.localSourceX,p.localSourceY,
      p.localDestinationX,p.localDestinationY]);
    if(!data.every(finite))throw new RangeError('Substitution E exceeds float32 range');return data;}
  function create({renderer,frameOwner=renderer}={}){
    if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||!frameOwner.device?.queue?.writeBuffer||
      typeof frameOwner.own!=='function'||typeof frameOwner.release!=='function'||typeof frameOwner.format!=='string')
      throw new TypeError('Substitution E needs the shared ready WebGPU frame owner');
    const device=frameOwner.device,format=frameOwner.format;
    const module=device.createShaderModule({label:'DVA Assassin substitution E WGSL',code:shader});
    const pipeline=device.createRenderPipeline({label:'DVA Assassin substitution E',layout:'auto',vertex:{module,entryPoint:'vs'},
      fragment:{module,entryPoint:'fs',targets:[{format,blend:{color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
        alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},primitive:{topology:'triangle-list'}});
    const slots=[],indices=new WeakMap();let destroyed=false;
    function slot(i){if(slots[i])return slots[i];const uniform=frameOwner.own(device.createBuffer({
      label:`DVA Assassin substitution E ${i}`,size:FLOATS*4,usage:0x40|0x08}));
      const bindGroup=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:uniform}}]});
      return(slots[i]={uniform,bindGroup});}
    function record({frame,target,viewport,planned}={}){
      if(destroyed||frameOwner.state!=='ready')throw new Error('Substitution E unavailable');
      if(typeof frame?.add!=='function'||typeof frame?.stage!=='function'||typeof target!=='string'||!target||!planned||
        viewport?.kind!=='main'||viewport.pixelWidth!==planned.pixelWidth||viewport.pixelHeight!==planned.pixelHeight)
        throw new TypeError('Substitution E needs current shared frame and plan');
      const i=indices.get(frame)||0,{uniform,bindGroup}=slot(i);device.queue.writeBuffer(uniform,0,pack(planned));
      frame.stage(`world:assassin-substitution:${planned.kind}:${planned.effectId}`);
      frame.add({target,label:`DVA Assassin substitution E ${planned.effectId}`,encode(pass,info){
        if(info.device!==device||info.format!==format||info.width!==viewport.pixelWidth||info.height!==viewport.pixelHeight)
          throw new Error('Substitution E target device, format or backing size mismatch');
        pass.setPipeline(pipeline);pass.setBindGroup(0,bindGroup);pass.draw(3);
      }});indices.set(frame,i+1);return Object.freeze({effectId:planned.effectId,kind:planned.kind,drawn:true});}
    return Object.freeze({plan,planBatch,record,shader,get state(){return destroyed?'destroyed':frameOwner.state;},
      destroy(){if(destroyed)return;destroyed=true;for(const s of slots)if(frameOwner.release(s.uniform))s.uniform.destroy();slots.length=0;}});
  }
  const api=Object.freeze({GRANT,TRIGGER,DURATION,shader,plan,planBatch,pack,create});
  root.DvaWebGPUAssassinSubstitutionE=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
