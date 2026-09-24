/* Textureless ROOT lifecycle E for the caller's shared WebGPU frame.
 * The app owns status truth, event ordering and any sound; no private device or texture. */
(function (root) {
  'use strict';

  const EVENT_TYPE = 'hacker-root';
  const VARIANTS = Object.freeze({ activation: 'all-operators', release: 'release' });
  const MODES = Object.freeze({ activation: 0, sustained: 1, release: 2 });
  const EVENT_DURATION_MS = 1200;
  const RADIUS_X = 68, RADIUS_Y = 82, ANCHOR_Y = 47, FLOAT_COUNT = 16;
  const finite = Number.isFinite;

  const shader = /* wgsl */ `
struct Params { view:vec4f, geometry:vec4f, state:vec4f, extra:vec4f };
@group(0) @binding(0) var<uniform> p:Params;
struct Vertex { @builtin(position) position:vec4f };
@vertex fn vs(@builtin(vertex_index) i:u32)->Vertex {
  let v=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3))[i];
  var out:Vertex;out.position=vec4f(v,0,1);return out;
}
fn sq(v:f32)->f32{return v*v;}
fn bell(v:f32,w:f32)->f32{return exp(-sq(v)/max(sq(w),.0001));}
fn ease(v:f32)->f32{let x=clamp(v,0.0,1.0);return x*x*(3.0-2.0*x);}
@fragment fn fs(@builtin(position) pixel:vec4f)->@location(0) vec4f {
  let q=(pixel.xy-p.view.zw)/max(p.geometry.xy,vec2f(.001));
  let t=clamp(p.state.x,0.0,1.0);let mode=p.state.y;
  let reduced=p.state.z>.5;let alpha=p.state.w;let actorPhase=p.extra.x;
  let release=mode>1.5;let sustained=mode>.5 && mode<1.5;
  let travel=select(ease(t/.32),.52,reduced);
  let expansion=select(ease(t/.72),.5,reduced);
  let bracketRadius=select(select(mix(1.38,.78,travel),.78,sustained),
    .78+.56*expansion,release);
  let absQ=abs(q);
  let vertical=bell(abs(absQ.x-bracketRadius),.030)*
    (1.0-smoothstep(bracketRadius-.06,bracketRadius+.06,absQ.y));
  let horizontal=bell(abs(absQ.y-bracketRadius*.88),.031)*
    (1.0-smoothstep(bracketRadius-.12,bracketRadius+.12,absQ.x));
  let rails=vertical+horizontal;
  let inside=1.0-smoothstep(.68,.90,max(absQ.x/.78,absQ.y/.83));
  let lockDistance=abs(absQ.x*1.02+absQ.y*.72-.46);
  let lockShell=bell(lockDistance,.033);
  let lockCore=bell(absQ.x,.11)*bell(absQ.y+.03,.14);
  let scanPhase=select(actorPhase*.16,.5,reduced);
  let scanY=fract(scanPhase)*1.64-.82;
  let scan=bell(q.y-scanY,.022)*(1.0-smoothstep(.18,.62,absQ.x));
  let activeMask=select(1.0,inside,sustained);
  var core=rails*.67+lockShell*.46+lockCore*.18+scan*.52;
  var glow=rails*.33+lockShell*.26+lockCore*.12+scan*.26;
  if(release){
    core=(rails*.64+lockShell*.18+scan*.30)*(1.0-ease((t-.68)/.32));
    glow=(rails*.31+lockShell*.12+scan*.16)*(1.0-ease((t-.60)/.40));
  }else if(sustained){
    core=rails*.48+lockShell*.42+lockCore*.22+scan*.24;
    glow=rails*.34+lockShell*.30+lockCore*.16+scan*.18;
  }else{
    let arrival=ease(t/.20);let impulse=bell(t-.27,.10);
    core=core*arrival+impulse*(lockShell*.48+lockCore*.52);
    glow=glow*arrival+impulse*(rails*.22+lockShell*.38);
  }
  var visibility=select(select(smoothstep(0.0,.045,t)*(1.0-smoothstep(.92,1.0,t)),1.0,sustained),
    smoothstep(0.0,.04,t)*(1.0-smoothstep(.87,1.0,t)),release);
  if(reduced){visibility=select(1.0,smoothstep(0.0,.05,t)*(1.0-smoothstep(.93,1.0,t)),!sustained);}
  let cold=vec3f(.15,.79,1.0);let warm=vec3f(.49,.96,1.0);
  let color=mix(cold,warm,smoothstep(-.76,.76,q.y));
  let source=clamp((core*activeMask+glow*.10)*visibility*alpha,0.0,.92);
  let halo=clamp(glow*visibility*alpha*.38,0.0,.30);
  let outAlpha=clamp(source+halo,0.0,.98);
  return vec4f(color*source+color*halo*.7,outAlpha);
}`;

  function actorVisible(player) {
    return Boolean(player?.id && player.alive && !player.ejected && !player.inVent && !player.invisible &&
      finite(player.x) && finite(player.y));
  }

  function baseGeometry({ player, camera, zoom, viewport }) {
    if (!camera || viewport?.kind !== 'main' ||
        ![camera.x,camera.y,zoom,viewport.width,viewport.height,
          viewport.pixelWidth,viewport.pixelHeight,player.x,player.y].every(finite) ||
        zoom<=0 || viewport.width<=0 || viewport.height<=0 ||
        !Number.isInteger(viewport.pixelWidth) || !Number.isInteger(viewport.pixelHeight) ||
        viewport.pixelWidth<=0 || viewport.pixelHeight<=0) return null;
    const sx=zoom*viewport.pixelWidth/viewport.width,sy=zoom*viewport.pixelHeight/viewport.height;
    const centerX=(player.x-camera.x)*sx,centerY=(player.y-ANCHOR_Y-camera.y)*sy;
    const radiusX=RADIUS_X*sx,radiusY=RADIUS_Y*sy;
    if (![centerX,centerY,radiusX,radiusY].every(finite) || radiusX<=0 || radiusY<=0) return null;
    if (centerX+radiusX*1.7<0 || centerX-radiusX*1.7>viewport.pixelWidth ||
        centerY+radiusY*1.7<0 || centerY-radiusY*1.7>viewport.pixelHeight) return null;
    return { centerX,centerY,radiusX,radiusY,
      pixelWidth:viewport.pixelWidth,pixelHeight:viewport.pixelHeight };
  }

  function plan({ effect = null, player, now, actorTime = now, phase, camera, zoom,
    viewport, reducedMotion = false, alpha = 1 } = {}) {
    if (!['playing'].includes(phase) || !actorVisible(player) ||
        ![now,actorTime,alpha].every(finite) || alpha<=0 || alpha>1) return null;
    let mode,progress=0,durationMs=0,effectId,actorPhase=actorTime/1000;
    if (effect) {
      if (effect.type!==EVENT_TYPE || !effect.id ||
          String(effect.playerId||'')!==String(player.id) ||
          !finite(effect.startedAt) || !finite(effect.duration) || effect.duration<=0) return null;
      if (effect.variant===VARIANTS.activation) mode=MODES.activation;
      else if (effect.variant===VARIANTS.release) mode=MODES.release;
      else return null;
      if (mode===MODES.activation && !player.hackerRootActive) return null;
      durationMs=Math.min(EVENT_DURATION_MS,effect.duration);
      const elapsed=now-effect.startedAt;
      if (elapsed<0 || elapsed>=durationMs) return null;
      progress=elapsed/durationMs;
      effectId=String(effect.id);
    } else {
      if (!player.hackerRootActive) return null;
      mode=MODES.sustained;
      effectId=`hacker-root-state:${String(player.id)}`;
    }
    const geometry=baseGeometry({player,camera,zoom,viewport});
    if (!geometry) return null;
    return Object.freeze({ ...geometry,effectId,mode,progress,durationMs,
      reducedMotion:Boolean(reducedMotion),alpha,actorPhase });
  }

  function planBatch({ effects, players, now, phase, camera, zoom, viewport,
    reducedMotion = false, alpha = 1, actorTimeFor = player => now } = {}) {
    if (!Array.isArray(effects) || !Array.isArray(players))
      throw new TypeError('ROOT E batch requires normalized event and player arrays');
    const byId=new Map(players.filter(player=>player?.id).map(player=>[String(player.id),player]));
    const seen=new Set(),plans=[];
    for (const effect of effects) {
      const id=String(effect?.id||'');if(!id||seen.has(id))continue;seen.add(id);
      if (effect.type!==EVENT_TYPE) continue;
      const player=byId.get(String(effect.playerId||''));
      const planned=plan({effect,player,now,actorTime:actorTimeFor(player),phase,camera,zoom,viewport,reducedMotion,alpha});
      if(planned)plans.push(planned);
    }
    for (const player of players) {
      if(!player?.hackerRootActive)continue;
      const planned=plan({player,now,actorTime:actorTimeFor(player),phase,camera,zoom,viewport,reducedMotion,alpha});
      if(planned&&!seen.has(planned.effectId)){seen.add(planned.effectId);plans.push(planned);}
    }
    return Object.freeze(plans);
  }

  function pack(planned) {
    if (!planned || !Object.values(MODES).includes(planned.mode) ||
        ![planned.pixelWidth,planned.pixelHeight,planned.centerX,planned.centerY,
          planned.radiusX,planned.radiusY,planned.progress,planned.alpha,planned.actorPhase].every(finite))
      throw new TypeError('A valid ROOT E plan is required');
    const data=new Float32Array([planned.pixelWidth,planned.pixelHeight,planned.centerX,planned.centerY,
      planned.radiusX,planned.radiusY,0,planned.mode,planned.progress,planned.mode,
      planned.reducedMotion?1:0,planned.alpha,planned.actorPhase,0,0,0]);
    if(!data.every(finite))throw new RangeError('ROOT E values exceed float32 range');
    return data;
  }

  function create({ renderer, frameOwner = renderer } = {}) {
    if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||
       !frameOwner.device?.queue?.writeBuffer||typeof frameOwner.own!=='function'||
       typeof frameOwner.release!=='function'||typeof frameOwner.format!=='string')
      throw new TypeError('ROOT E requires the shared ready WebGPU frame owner');
    const device=frameOwner.device,format=frameOwner.format;
    const module=device.createShaderModule({label:'DVA textureless Hacker Root E WGSL',code:shader});
    const pipeline=device.createRenderPipeline({label:'DVA Hacker Root body E',layout:'auto',
      vertex:{module,entryPoint:'vs'},fragment:{module,entryPoint:'fs',targets:[{format,
        blend:{color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
          alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},
      primitive:{topology:'triangle-list'}});
    const slots=[],indices=new WeakMap();let destroyed=false;
    function slot(index){
      if(slots[index])return slots[index];
      const uniform=frameOwner.own(device.createBuffer({label:`DVA Hacker Root E ${index}`,
        size:FLOAT_COUNT*4,usage:0x40|0x08}));
      const bindGroup=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),
        entries:[{binding:0,resource:{buffer:uniform}}]});
      return(slots[index]={uniform,bindGroup});
    }
    function record({frame,target,viewport,planned}={}){
      if(destroyed||frameOwner.state!=='ready')throw new Error('ROOT E pass unavailable');
      if(typeof frame?.add!=='function'||typeof frame?.stage!=='function'||
         typeof target!=='string'||!target||!planned||viewport?.kind!=='main'||
         viewport.pixelWidth!==planned.pixelWidth||viewport.pixelHeight!==planned.pixelHeight)
        throw new TypeError('ROOT E needs the current shared frame, target, viewport and plan');
      const index=indices.get(frame)||0,{uniform,bindGroup}=slot(index);
      device.queue.writeBuffer(uniform,0,pack(planned));
      frame.stage(`world:hacker-root:${planned.effectId}`);
      frame.add({target,label:`DVA Hacker Root E ${planned.effectId}`,encode(pass,info){
        if(info.device!==device||info.format!==format||info.width!==viewport.pixelWidth||info.height!==viewport.pixelHeight)
          throw new Error('ROOT E target device, format or backing size mismatch');
        pass.setPipeline(pipeline);pass.setBindGroup(0,bindGroup);pass.draw(3);
      }});
      indices.set(frame,index+1);
      return Object.freeze({effectId:planned.effectId,mode:planned.mode,drawn:true});
    }
    return Object.freeze({device,plan,planBatch,record,shader,
      get state(){return destroyed?'destroyed':frameOwner.state;},
      destroy(){if(destroyed)return;destroyed=true;
        for(const item of slots)if(frameOwner.release(item.uniform))item.uniform.destroy();
        slots.length=0;
      }});
  }

  const api=Object.freeze({EVENT_TYPE,VARIANTS,MODES,EVENT_DURATION_MS,shader,plan,planBatch,pack,create});
  root.DvaWebGPUHackerRootE=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
