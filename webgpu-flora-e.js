/* Textureless Flora cast phenomena for the shared WebGPU frame.
 * Heal cast and invisibility have separate choreography. Invisible actors are
 * owner-only, authorized by the server event's exact viewerId. */
(function(root){
  'use strict';
  const TYPES=Object.freeze({heal:'flora','invisible':'flora-invisible'});
  const MODES=Object.freeze({heal:0,invisible:1});
  const DURATION_MS=Object.freeze({flora:1200,'flora-invisible':1600});
  const PROFILES=Object.freeze({
    flora:Object.freeze({radiusX:72,radiusY:42,anchorY:-12}),
    'flora-invisible':Object.freeze({radiusX:59,radiusY:77,anchorY:48})
  });
  const FLOATS=16,finite=Number.isFinite;

  const shader=/* wgsl */`
struct Params{view:vec4f,geometry:vec4f,state:vec4f,extra:vec4f};
@group(0) @binding(0)var<uniform> p:Params;
struct Vertex{@builtin(position) position:vec4f};
@vertex fn vs(@builtin(vertex_index)i:u32)->Vertex{
 let v=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3))[i];
 var o:Vertex;o.position=vec4f(v,0,1);return o;
}
fn sq(v:f32)->f32{return v*v;}
fn bell(v:f32,w:f32)->f32{return exp(-sq(v)/max(sq(w),.0001));}
fn gap(a:f32,b:f32)->f32{return abs(atan2(sin(a-b),cos(a-b)));}
fn ease(v:f32)->f32{let x=clamp(v,0.0,1.0);return x*x*(3.0-2.0*x);}
@fragment fn fs(@builtin(position)pixel:vec4f)->@location(0)vec4f{
 let q=(pixel.xy-p.view.zw)/max(p.geometry.xy,vec2f(.001));
 let t=clamp(p.state.x,0.0,1.0);let mode=p.state.y;let reduced=p.state.z>.5;
 let alpha=p.state.w;let quietT=select(t,.52,reduced);var core=0.0;var glow=0.0;
 var rgb=vec3f(.33,1.0,.67);
 if(mode<.5){
   // The heal cast is a floor-root aperture, below the torso benefit E: two
   // broad petal arcs open across the ground and meet at a luminous stem.
   let angle=atan2(q.y,q.x);let r=length(vec2f(q.x,q.y*.87));
   let turn=quietT*6.28318;let petalA=gap(angle,turn+.72*sin(quietT*3.14159));
   let petalB=gap(angle,turn+3.14159-.72*sin(quietT*3.14159));
   let arcA=bell(petalA,.26)*bell(r-(.54+.19*ease(quietT)),.047);
   let arcB=bell(petalB,.26)*bell(r-(.54+.19*ease(quietT)),.047);
   let stem=bell(q.x-.10*sin(q.y*2.8+turn),.045)*
      (1.0-smoothstep(.42,.91,abs(q.y)));
   let seed=bell(length(vec2f(q.x*1.1,(q.y+.05)*.82))-(.18+.42*ease(t/.34)),.035);
   core=arcA*.72+arcB*.66+stem*.48+seed*.55;
   glow=arcA*.30+arcB*.28+stem*.23+seed*.28;
   rgb=mix(vec3f(.29,.94,.52),vec3f(.72,1.0,.37),smoothstep(-.55,.55,q.y));
 }else{
   // The private invisibility cue folds two refractive brackets across the
   // body, then erases their wake into a thin cool outline.
   let a=abs(q.x);let y=abs(q.y);let open=ease(t/.30);let vanish=ease((t-.47)/.44);
   let rx=mix(1.10,.56,open)+.22*vanish;
   let vertical=bell(a-rx,.034)*(1.0-smoothstep(.75,.98,y));
   let horizontal=bell(y-(.78+.13*open),.032)*(1.0-smoothstep(.55,.82,a));
   let front=gap(atan2(q.y,q.x),-1.2+quietT*6.28318);
   let scan=bell(front,.13)*bell(length(q)-(.70-.19*open),.075);
   let refraction=bell(abs(a-.48-.09*sin(q.y*5.0+quietT*6.0)),.07)*
      (1.0-smoothstep(.62,.91,y));
   core=(vertical*.71+horizontal*.44+scan*.75+refraction*.43)*(1.0-.54*vanish);
   glow=(vertical*.34+horizontal*.27+scan*.32+refraction*.25)*(1.0-.30*vanish);
   rgb=mix(vec3f(.36,.91,1.0),vec3f(.80,.57,1.0),smoothstep(-.6,.65,q.y));
 }
 let fade=smoothstep(0.0,.055,t)*(1.0-smoothstep(.91,1.0,t));
 let motionGain=select(1.0,.82,reduced);let visibility=fade*motionGain*alpha;
 let source=clamp(core*visibility,0.0,.94);let halo=clamp(glow*visibility*.48,0.0,.30);
 return vec4f(rgb*(source+halo*.45),clamp(source+halo*.55,0.0,.98));
}`;

  function plan({effect,player,viewerId,now,phase,camera,zoom,viewport,
    reducedMotion=false,alpha=1}={}){
    if(!effect||!player||phase!=='playing'||!['flora','flora-invisible'].includes(effect.type)||
      !effect.id||!effect.playerId||String(effect.playerId)!==String(player.id)||
      !player.alive||player.ejected||player.inVent||!finite(player.x)||!finite(player.y)||
      !finite(effect.startedAt)||!finite(effect.duration)||effect.duration<=0||
      !finite(now)||!finite(alpha)||alpha<=0||alpha>1||!viewerId)return null;
    const actorId=String(player.id),viewer=String(viewerId);
    const privateCue=effect.type==='flora-invisible'||player.invisible===true;
    if(privateCue&&(viewer!==actorId||String(effect.viewerId||'')!==viewer))return null;
    if(!camera||viewport?.kind!=='main'||
      ![camera.x,camera.y,zoom,viewport.width,viewport.height,viewport.pixelWidth,viewport.pixelHeight].every(finite)||
      zoom<=0||viewport.width<=0||viewport.height<=0||!Number.isInteger(viewport.pixelWidth)||
      !Number.isInteger(viewport.pixelHeight)||viewport.pixelWidth<=0||viewport.pixelHeight<=0)return null;
    const durationMs=Math.min(DURATION_MS[effect.type],effect.duration),elapsed=now-effect.startedAt;
    if(elapsed<0||elapsed>=durationMs)return null;
    const profile=PROFILES[effect.type];
    const sx=zoom*viewport.pixelWidth/viewport.width,sy=zoom*viewport.pixelHeight/viewport.height;
    const centerX=(player.x-camera.x)*sx,centerY=(player.y-profile.anchorY-camera.y)*sy;
    const radiusX=profile.radiusX*sx,radiusY=profile.radiusY*sy;
    if(![centerX,centerY,radiusX,radiusY].every(finite)||radiusX<=0||radiusY<=0||
      centerX+radiusX*1.25<0||centerX-radiusX*1.25>viewport.pixelWidth||
      centerY+radiusY*1.25<0||centerY-radiusY*1.25>viewport.pixelHeight)return null;
    return Object.freeze({effectId:String(effect.id),actorId,type:effect.type,
      mode:MODES[effect.type==='flora'?'heal':'invisible'],privateCue,
      progress:elapsed/durationMs,durationMs,reducedMotion:Boolean(reducedMotion),alpha,
      centerX,centerY,radiusX,radiusY,pixelWidth:viewport.pixelWidth,pixelHeight:viewport.pixelHeight});
  }

  function planBatch({effects,players,viewerId,now,phase,camera,zoom,viewport,
    reducedMotion=false,alpha=1}={}){
    if(!Array.isArray(effects)||!Array.isArray(players))throw new TypeError('Flora E needs event and player arrays');
    const byId=new Map(players.filter(p=>p?.id).map(p=>[String(p.id),p]));
    const seen=new Set(),out=[];
    for(const effect of effects){const id=String(effect?.id||'');if(!id||seen.has(id))continue;seen.add(id);
      if(!Object.values(TYPES).includes(effect.type))continue;
      const player=byId.get(String(effect.playerId||''));
      const result=plan({effect,player,viewerId,now,phase,camera,zoom,viewport,reducedMotion,alpha});
      if(result)out.push(result);
    }
    return Object.freeze(out);
  }

  function pack(p){if(!p||![p.progress,p.alpha,p.centerX,p.centerY,p.radiusX,p.radiusY,p.pixelWidth,p.pixelHeight].every(finite))
      throw new TypeError('Valid Flora E plan required');
    const data=new Float32Array([p.pixelWidth,p.pixelHeight,p.centerX,p.centerY,p.radiusX,p.radiusY,0,p.mode,
      Math.min(1,Math.max(0,p.progress)),p.mode,p.reducedMotion?1:0,Math.min(1,Math.max(0,p.alpha)),0,0,0,0]);
    if(!data.every(finite))throw new RangeError('Flora E exceeds float32 range');return data;}

  function create({renderer,frameOwner=renderer}={}){
    if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||!frameOwner.device?.queue?.writeBuffer||
      typeof frameOwner.own!=='function'||typeof frameOwner.release!=='function'||typeof frameOwner.format!=='string')
      throw new TypeError('Flora E requires the shared ready WebGPU frame owner');
    const device=frameOwner.device,format=frameOwner.format;
    const module=device.createShaderModule({label:'DVA Flora phenomena E WGSL',code:shader});
    const pipeline=device.createRenderPipeline({label:'DVA Flora phenomena E',layout:'auto',vertex:{module,entryPoint:'vs'},
      fragment:{module,entryPoint:'fs',targets:[{format,blend:{color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
        alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},primitive:{topology:'triangle-list'}});
    const slots=[],indices=new WeakMap();let destroyed=false;
    function slot(i){if(slots[i])return slots[i];const uniform=frameOwner.own(device.createBuffer({
      label:`DVA Flora phenomena E ${i}`,size:FLOATS*4,usage:0x40|0x08}));
      const bindGroup=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:uniform}}]});
      return(slots[i]={uniform,bindGroup});}
    function record({frame,target,viewport,planned}={}){
      if(destroyed||frameOwner.state!=='ready')throw new Error('Flora E unavailable');
      if(typeof frame?.add!=='function'||typeof frame?.stage!=='function'||typeof target!=='string'||!target||!planned||
        viewport?.kind!=='main'||viewport.pixelWidth!==planned.pixelWidth||viewport.pixelHeight!==planned.pixelHeight)
        throw new TypeError('Flora E needs current shared frame, target, viewport and plan');
      const i=indices.get(frame)||0,{uniform,bindGroup}=slot(i);device.queue.writeBuffer(uniform,0,pack(planned));
      frame.stage(`world:flora:${planned.effectId}`);frame.add({target,label:`DVA Flora E ${planned.effectId}`,encode(pass,info){
        if(info.device!==device||info.format!==format||info.width!==viewport.pixelWidth||info.height!==viewport.pixelHeight)
          throw new Error('Flora E target device, format or backing size mismatch');
        pass.setPipeline(pipeline);pass.setBindGroup(0,bindGroup);pass.draw(3);
      }});indices.set(frame,i+1);return Object.freeze({effectId:planned.effectId,type:planned.type,drawn:true});}
    return Object.freeze({plan,planBatch,record,shader,get state(){return destroyed?'destroyed':frameOwner.state;},
      destroy(){if(destroyed)return;destroyed=true;for(const s of slots)if(frameOwner.release(s.uniform))s.uniform.destroy();slots.length=0;}});
  }
  const api=Object.freeze({TYPES,MODES,DURATION_MS,shader,plan,planBatch,pack,create});
  root.DvaWebGPUFloraE=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
