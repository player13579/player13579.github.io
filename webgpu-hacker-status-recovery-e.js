/* Textureless Hacker status-clear E on the shared WebGPU frame.
 * This is intentionally separate from the statusRecovery benefit E: Hacker's
 * current event does not identify whether any status was actually removed. */
(function (root) {
  'use strict';

  const EVENT_TYPE = 'hacker-status-recover';
  const OUTCOMES = Object.freeze({ cleared: 'cleared', unchanged: 'unchanged' });
  const DURATION_MS = 1380, RADIUS_X = 66, RADIUS_Y = 82, ANCHOR_Y = 52;
  const FLOAT_COUNT = 16, finite = Number.isFinite;

  const shader = /* wgsl */ `
struct Params { view:vec4f, geometry:vec4f, state:vec4f, extra:vec4f };
@group(0) @binding(0) var<uniform> p:Params;
struct Vertex { @builtin(position) position:vec4f };
@vertex fn vs(@builtin(vertex_index) i:u32)->Vertex {
 let v=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3))[i];
 var o:Vertex;o.position=vec4f(v,0,1);return o;
}
fn sq(v:f32)->f32{return v*v;}
fn bell(v:f32,w:f32)->f32{return exp(-sq(v)/max(sq(w),.0001));}
fn ease(v:f32)->f32{let x=clamp(v,0.0,1.0);return x*x*(3.0-2.0*x);}
fn contour(x:f32,y:f32)->f32{
 let w=select(mix(.29,.41,smoothstep(-.08,.24,y)),
              mix(.32,.43,smoothstep(.20,.62,y)),y>.2);
 return abs(abs(x)-w);
}
@fragment fn fs(@builtin(position) pixel:vec4f)->@location(0) vec4f {
 let q=(pixel.xy-p.view.zw)/max(p.geometry.xy,vec2f(.001));
 let t=clamp(p.state.x,0.0,1.0);let reduced=p.state.z>.5;let alpha=p.state.w;
 let travel=select(ease(t/.66),.53,reduced);
 // A coherent body-shaped clear rim remains as broad murky sheets lift away.
 let y=q.y;let edge=contour(q.x,y);
 let body=smoothstep(-.96,-.82,y)*(1.0-smoothstep(.76,.91,y));
 let peel=.055+.58*travel;
 let sheetA=bell(edge-peel,.078)*body;
 let sheetB=bell(edge-(peel+.15),.115)*body*(1.0-smoothstep(.48,.84,t));
 let cleanRim=bell(edge,.026)*body*(.28+.72*smoothstep(.05,.34,t));
 let downward=bell(y-(.55+travel*.42),.08)*(1.0-smoothstep(.12,.53,abs(q.x)));
 let uplift=bell(y-(-.26-travel*.31),.12)*(1.0-smoothstep(.1,.55,abs(q.x)));
 let depart=1.0-smoothstep(.56,.91,t);
 let core=(sheetA*.78+sheetB*.30)*depart+cleanRim*.83+downward*.20+uplift*.25;
 let glow=(sheetA*.31+sheetB*.18)*depart+cleanRim*.48+downward*.13+uplift*.17;
 let fade=smoothstep(0.0,.06,t)*(1.0-smoothstep(.91,1.0,t));
 let pulse=select(1.0,.72+.28*cos((t-.53)*3.14159),reduced);
 let strength=fade*pulse*alpha;
 let mist=vec3f(.31,.48,.38);let clear=vec3f(.32,.91,.91);
 let rgb=mix(mist,clear,smoothstep(.12,.63,t));
 let source=clamp(core*strength,0.0,.93);let halo=clamp(glow*strength*.46,0.0,.28);
 return vec4f(rgb*source+mix(rgb,vec3f(.78,1.0,.97),.28)*halo,
               clamp(source+halo*.54,0.0,.98));
}`;

  function actorVisible(player) {
    return Boolean(player?.id && player.alive && !player.ejected && !player.inVent &&
      !player.invisible && finite(player.x) && finite(player.y));
  }

  function plan({ effect, player, now, phase, camera, zoom, viewport,
    reducedMotion = false, alpha = 1, outcome } = {}) {
    if (phase !== 'playing' || !actorVisible(player) || !effect ||
        effect.type !== EVENT_TYPE || !effect.id || !finite(effect.startedAt) ||
        !finite(effect.duration) || effect.duration <= 0 ||
        String(effect.targetId || '') !== String(player.id) ||
        !String(effect.playerId || '') ||
        (outcome ?? effect.outcome ?? effect.variant) !== OUTCOMES.cleared ||
        !finite(now) || !finite(alpha) || alpha <= 0 || alpha > 1) return null;
    if (!camera || viewport?.kind !== 'main' ||
        ![camera.x,camera.y,zoom,viewport.width,viewport.height,
          viewport.pixelWidth,viewport.pixelHeight].every(finite) || zoom <= 0 ||
        viewport.width <= 0 || viewport.height <= 0 ||
        !Number.isInteger(viewport.pixelWidth) || !Number.isInteger(viewport.pixelHeight) ||
        viewport.pixelWidth <= 0 || viewport.pixelHeight <= 0) return null;
    const durationMs = Math.min(DURATION_MS, effect.duration);
    const elapsed = now - effect.startedAt;
    if (elapsed < 0 || elapsed >= durationMs) return null;
    const sx = zoom * viewport.pixelWidth / viewport.width;
    const sy = zoom * viewport.pixelHeight / viewport.height;
    const centerX = (player.x-camera.x)*sx;
    const centerY = (player.y-ANCHOR_Y-camera.y)*sy;
    const radiusX = RADIUS_X*sx, radiusY = RADIUS_Y*sy;
    if (![centerX,centerY,radiusX,radiusY].every(finite) || radiusX <= 0 || radiusY <= 0 ||
        centerX+radiusX*1.3 < 0 || centerX-radiusX*1.3 > viewport.pixelWidth ||
        centerY+radiusY*1.3 < 0 || centerY-radiusY*1.3 > viewport.pixelHeight) return null;
    return Object.freeze({ effectId:String(effect.id), ownerId:String(effect.playerId),
      targetId:String(effect.targetId), progress:elapsed/durationMs, durationMs,
      reducedMotion:Boolean(reducedMotion), alpha, centerX,centerY,radiusX,radiusY,
      pixelWidth:viewport.pixelWidth,pixelHeight:viewport.pixelHeight });
  }

  function planBatch({ effects, players, now, phase, camera, zoom, viewport,
    reducedMotion = false, alpha = 1, outcomeFor } = {}) {
    if (!Array.isArray(effects) || !Array.isArray(players))
      throw new TypeError('Hacker status E batch requires normalized events and players');
    const byId = new Map(players.filter(p=>p?.id).map(p=>[String(p.id),p]));
    const seen = new Set(), plans = [];
    for (const effect of effects) {
      if (effect?.type !== EVENT_TYPE) continue;
      const id=String(effect.id||'');if(!id||seen.has(id))continue;seen.add(id);
      const player=byId.get(String(effect.targetId||''));
      const outcome=typeof outcomeFor==='function'?outcomeFor(effect):undefined;
      const planned=plan({effect,player,now,phase,camera,zoom,viewport,reducedMotion,alpha,outcome});
      if(planned)plans.push(planned);
    }
    return Object.freeze(plans);
  }

  function pack(p) {
    if (!p || ![p.progress,p.alpha,p.centerX,p.centerY,p.radiusX,p.radiusY,
      p.pixelWidth,p.pixelHeight].every(finite)) throw new TypeError('Valid status-clear E plan required');
    const data=new Float32Array([p.pixelWidth,p.pixelHeight,p.centerX,p.centerY,
      p.radiusX,p.radiusY,0,0,Math.min(1,Math.max(0,p.progress)),0,
      p.reducedMotion?1:0,Math.min(1,Math.max(0,p.alpha)),0,0,0,0]);
    if(!data.every(finite))throw new RangeError('Status-clear E exceeds float32 range');
    return data;
  }

  function create({ renderer, frameOwner=renderer }={}) {
    if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||
      !frameOwner.device?.queue?.writeBuffer||typeof frameOwner.own!=='function'||
      typeof frameOwner.release!=='function'||typeof frameOwner.format!=='string')
      throw new TypeError('Hacker status E requires the shared ready WebGPU frame owner');
    const device=frameOwner.device,format=frameOwner.format;
    const module=device.createShaderModule({label:'DVA Hacker status clear E WGSL',code:shader});
    const pipeline=device.createRenderPipeline({label:'DVA Hacker status clear E',layout:'auto',
      vertex:{module,entryPoint:'vs'},fragment:{module,entryPoint:'fs',targets:[{format,
        blend:{color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
          alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},
      primitive:{topology:'triangle-list'}});
    const slots=[],indices=new WeakMap();let destroyed=false;
    function slot(i){if(slots[i])return slots[i];const uniform=frameOwner.own(device.createBuffer({
      label:`DVA Hacker status clear E ${i}`,size:FLOAT_COUNT*4,usage:0x40|0x08}));
      const bindGroup=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),
        entries:[{binding:0,resource:{buffer:uniform}}]});return(slots[i]={uniform,bindGroup});}
    function record({frame,target,viewport,planned}={}){
      if(destroyed||frameOwner.state!=='ready')throw new Error('Hacker status E unavailable');
      if(typeof frame?.add!=='function'||typeof frame?.stage!=='function'||typeof target!=='string'||
        !target||!planned||viewport?.kind!=='main'||viewport.pixelWidth!==planned.pixelWidth||
        viewport.pixelHeight!==planned.pixelHeight)throw new TypeError('Hacker status E needs current shared frame and plan');
      const i=indices.get(frame)||0,{uniform,bindGroup}=slot(i);device.queue.writeBuffer(uniform,0,pack(planned));
      frame.stage(`world:hacker-status-clear:${planned.effectId}`);
      frame.add({target,label:`DVA Hacker status clear E ${planned.effectId}`,encode(pass,info){
        if(info.device!==device||info.format!==format||info.width!==viewport.pixelWidth||info.height!==viewport.pixelHeight)
          throw new Error('Hacker status E target device, format or backing size mismatch');
        pass.setPipeline(pipeline);pass.setBindGroup(0,bindGroup);pass.draw(3);
      }});indices.set(frame,i+1);return Object.freeze({effectId:planned.effectId,drawn:true});
    }
    return Object.freeze({plan,planBatch,record,shader,get state(){return destroyed?'destroyed':frameOwner.state;},
      destroy(){if(destroyed)return;destroyed=true;for(const s of slots)if(frameOwner.release(s.uniform))s.uniform.destroy();slots.length=0;}});
  }
  const api=Object.freeze({EVENT_TYPE,OUTCOMES,DURATION_MS,shader,plan,planBatch,pack,create});
  root.DvaWebGPUHackerStatusRecoveryE=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
