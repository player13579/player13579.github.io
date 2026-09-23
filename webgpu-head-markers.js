/* Retained head markers in the caller's ordered, shared WebGPU frame.
 * Selection and material upload remain with app.js. No canvas or device is created. */
(function (root) {
  'use strict';
  const PROFILES = Object.freeze({
    naturalRecovery: ['naturalRecoveryEffect', 31, .94, .04, [0.44, .89, .43]],
    acceleration: ['accelerationPhaseEffect', 32, .94, .08, [.34, .84, 1]],
    levitation: ['statusLevitationEffect', 30, .88, .27, [.65, .76, 1]],
    hpReduction: ['statusHpReductionEffect', 30, .88, .46, [1, .40, .45]],
    resistanceBreak: ['pushStandFirmBreak', 30, .84, .63, [1, .47, .31]],
    standFirm: ['instantStandFirmTexture', 28, .94, .18, [.47, .82, 1]],
    push: ['instantPushTexture', 28, .94, .72, [1, .72, .30]],
    iai: ['itemIaiTexture', 30, .94, .42, [.78, .9, 1]],
    burning: ['hazardFireEffect', 30, .88, .81, [1, .37, .11]],
    poison: ['poisonBubbleMarker', 30, .86, .94, [.48, .86, .59]],
    manaGpu: ['statusManaGpuEffect', 30, .94, .57, [.45, .75, 1]],
    destructionSlash: ['fighterDestructionSlashMilestoneEffect', 30, .94, .76, [1, .55, .78]],
    clairvoyance: ['clairvoyanceThrowAte', 30, .92, .35, [.68, .63, 1]]
  });
  const EXCLUDED = Object.freeze(['gain-stamina','gain-heal','gain-mana','gain-overheal',
    'gain-acceleration','gain-luckBoost','gain-statusRecovery','gain-cooldownReduction','gain-credits']);
  const EXCLUDED_SET = new Set(EXCLUDED);
  const SUPPORTED = Object.freeze(['persistent-status','enhance-activation','fighter-energy-charge']);
  const finite = Number.isFinite;
  function isExcluded(candidate) {
    return EXCLUDED_SET.has(String(candidate?.type||'')) ||
      (String(candidate?.type||'')==='credit');
  }
  function visibleUnsupported(presentation) {
    const entries=[];
    for (const candidate of [...presentation.nonCredits,...(presentation.credits||[])]) {
      const type=String(candidate?.type||'');
      if (SUPPORTED.includes(type) || isExcluded(candidate)) continue;
      entries.push(Object.freeze({type,instanceKey:String(candidate?.instanceKey||''),
        category:String(candidate?.category||'')}));
    }
    return Object.freeze(entries);
  }
  function lifetime(candidate, now) {
    const effect=candidate.sourceEffect||candidate;
    const startedAt=finite(Number(candidate.startedAt))?Number(candidate.startedAt):
      finite(Number(effect.startedAt))?Number(effect.startedAt):now;
    const expiresAt=finite(Number(candidate.expiresAt))?Number(candidate.expiresAt):
      finite(Number(effect._headMarkerExpiresAt))?Number(effect._headMarkerExpiresAt):
      startedAt+Math.max(1,Number(effect.duration)||1200);
    if(now<startedAt||now>=expiresAt)return null;
    const elapsed=Math.max(0,now-startedAt),remaining=Math.max(0,expiresAt-now);
    const progress=elapsed<180?.2*(elapsed/180):remaining<360?.7+.3*(1-remaining/360):.45;
    return {startedAt,expiresAt,elapsed,remaining,progress};
  }
  const ease=value=>1-Math.pow(1-Math.min(1,Math.max(0,value)),3);
  const fade=value=>value<=.7?1:1-((value-.7)/.3)**2*(3-2*((value-.7)/.3));
  const shader = /* wgsl */ `
struct Params { rect: vec4f, uv: vec4f, color: vec4f, glow: vec4f, viewport: vec4f };
@group(0) @binding(0) var<uniform> p: Params;
@group(0) @binding(1) var source: texture_2d<f32>;
@group(0) @binding(2) var sourceSampler: sampler;
struct Out { @builtin(position) position: vec4f, @location(0) local: vec2f };
@vertex fn vs(@builtin(vertex_index) i: u32) -> Out {
  let corners = array<vec2f,6>(vec2f(0,0),vec2f(1,0),vec2f(0,1),vec2f(0,1),vec2f(1,0),vec2f(1,1));
  let q = corners[i]; var o: Out;
  o.position = vec4f((p.rect.xy + q*p.rect.zw)/p.viewport.xy*vec2f(2,-2)+vec2f(-1,1),0,1);
  o.local = q; return o;
}
@fragment fn fs(i: Out) -> @location(0) vec4f {
  let q = i.local;
  let center = q*2.0-1.0;
  let aura = pow(max(0.0,1.0-length(center)),2.2)*p.glow.a;
  let inner = (q-vec2f(.5))*1.8+vec2f(.5);
  var texel = vec4f(0.0);
  if (all(inner >= vec2f(0.0)) && all(inner <= vec2f(1.0))) {
    texel = textureSampleLevel(source,sourceSampler,p.uv.xy+inner*p.uv.zw,0.0);
  }
  let material = texel * p.color.a;
  let light = vec4f(p.glow.rgb*aura,aura);
  return material + light*(1.0-material.a);
}`;
  function slot(index, total) {
    const row = Math.floor(index / 4), rowStart = row * 4;
    const count = Math.min(4, total - rowStart);
    // Match app.js characterBodyVisualY so the retained GPU route follows the
    // same 0.72 body shrink and foot pivot as the legacy marker layout.
    const markerY = -104 - row * 29;
    const bodyY = 31 + (markerY - 31) * .72;
    return [(index - rowStart - (count - 1) / 2) * 27, bodyY];
  }
  function materialFor(materials, key, generation) {
    const entry = materials?.[key];
    if (!entry || entry.ready !== true || !entry.texture || typeof entry.texture.createView !== 'function') {
      throw new Error(`Head marker material unavailable: ${key}`);
    }
    if (entry.premultipliedAlpha !== true)
      throw new Error(`Head marker material must be premultiplied: ${key}`);
    if (entry.generation !== generation) throw new Error(`Head marker material stale: ${key}`);
    return entry.texture;
  }
  function plan({ actor, presentation, activeState, materials, explanations, now,
    reducedMotion = false, generation, viewport, alpha = 1,
    family = 'status', eventInstanceKey = null } = {}) {
    if (!Number.isInteger(generation) || viewport?.generation !== generation ||
        ![viewport?.width, viewport?.height, now, alpha].every(finite) ||
        viewport.width <= 0 || viewport.height <= 0 || alpha < 0 || alpha > 1) {
      throw new TypeError('Head marker plan requires a current logical viewport, generation, clock and alpha');
    }
    if (!actor?.id || !Array.isArray(actor.transform) || actor.transform.length !== 6 ||
        !actor.transform.every(finite) || !Array.isArray(presentation?.nonCredits)) {
      throw new TypeError('Head marker actor transform and selected presentation required');
    }
    if (!['status','event'].includes(family) ||
        (family==='event' && (typeof eventInstanceKey!=='string'||!eventInstanceKey)))
      throw new TypeError('Head marker event planning needs a stable instance key');
    const unsupported=visibleUnsupported(presentation);
    if (!actor.visible || !actor.alive || actor.ejected || actor.inVent ||
        !['playing', 'meeting'].includes(actor.phase) || alpha === 0) {
      return Object.freeze({ generation, commands: Object.freeze([]), hitTargets: Object.freeze([]),
        unsupported: Object.freeze([]), excludedFamilies: EXCLUDED });
    }
    const time = Math.floor(now / 1000 * 60) / 60;
    const commands = [], hitTargets = [];
    // Removed gain families and credits own neither slots nor hit regions.
    const candidates = presentation.nonCredits.filter(candidate =>
      (candidate?.type==='persistent-status' && activeState?.[candidate.category]) ||
      (['enhance-activation','fighter-energy-charge'].includes(candidate?.type) &&
        lifetime(candidate,now)));
    for (let index = 0; index < candidates.length; index++) {
      const candidate = candidates[index];
      if (candidate.type!=='persistent-status') {
        if(family!=='event'||String(candidate.instanceKey||candidate.sourceEffect?.id||'')!==eventInstanceKey)
          continue;
        const type=candidate.type;
        if(type==='enhance-activation'&&actor.invisible)continue;
        const life=lifetime(candidate,now);
        if(!life)continue;
        if(type==='enhance-activation'&&(life.progress<=0||life.progress>=1))continue;
        const effect=candidate.sourceEffect||candidate;
        const [localX,baseY]=slot(index,candidates.length);
        const reveal=ease(life.progress/(type==='enhance-activation'?.2:.18));
        const localY=baseY+(type==='enhance-activation'
          ? reducedMotion?0:2*(1-reveal)
          : reducedMotion?0:Math.sin(time*3.2+index*1.19)*.9);
        const [a,b,c,d,e,f]=actor.transform;
        const x=a*localX+c*localY+e,y=b*localX+d*localY+f;
        const scale=Math.max(.5,Math.hypot(a,b),Math.hypot(c,d));
        const size=26*(type==='fighter-energy-charge'?.8+reveal*.2:1)*scale;
        const radius=Math.max(15,size*.62);
        const texture=materialFor(materials,type==='enhance-activation'?'enhanceHoldMarker':'fighterEnergyChargeEffect',generation);
        const count=Math.max(1,Math.floor(Number(candidate.aggregateCount)||
          Number(effect._headMarkerAggregateCount)||1));
        const instanceKey=String(candidate.instanceKey||effect._headMarkerInstanceKey||effect.id||'');
        if(!instanceKey)throw new Error(`Retained ${type} marker needs stable instance key`);
        const key=type==='enhance-activation'?`enhance:${instanceKey}:${actor.id}`:
          `fighter-ec:${instanceKey}:${actor.id}`;
        const title=type==='enhance-activation'?'エンハンス':`EC獲得${count>1?` ×${count}`:''}`;
        const detail=type==='enhance-activation'
          ?'長押しによる発動が成立しました。能力の一括発動も含みます。'
          :'ファイターのECが1増加しました。頭上markerは現在のキャラクター位置に追従します。';
        hitTargets.push(Object.freeze({key,x,y,radius,title,detail}));
        const height=type==='enhance-activation'?size:size;
        const width=type==='enhance-activation'?size*434/1075:size;
        const command=Object.freeze({kind:type,x,y,size:width,height,texture,
          uv:Object.freeze([0,0,1,1]),alpha:alpha*(type==='enhance-activation'
            ?reveal*(1-ease((life.progress-.70)/.30)):fade(life.progress)),
          glow:Object.freeze(type==='enhance-activation'?[.19,.85,1]:[.45,.87,1]),
          glowStrength:.2,blendMode:type==='enhance-activation'?'screen':'additive',time,
          reducedMotion:Boolean(reducedMotion)});
        commands.push(command);
        if(type==='enhance-activation'&&!reducedMotion&&life.elapsed<920&&materials.enhancePropagationLight?.ready){
          const propagation=materialFor(materials,'enhancePropagationLight',generation);
          const phase=life.elapsed/40,first=Math.floor(phase),blend=phase-first;
          for(const [cell,weight] of [[first,1-blend],...(blend>0?[[Math.min(23,first+1),blend]]:[])]){
            if(weight<=0)continue;
            commands.push(Object.freeze({...command,kind:'enhance-propagation',texture:propagation,
              uv:Object.freeze([((cell%8)*211+2)/1688,(Math.floor(cell/8)*516+2)/1548,
                207/1688,512/1548]),alpha:command.alpha*weight,
              glowStrength:.08,blendMode:'additive'}));
          }
        }
        continue;
      }
      if(family!=='status'||(actor.invisible&&!actor.isSelf))continue;
      const category = candidate.category, profile = PROFILES[category];
      if (!profile) throw new Error(`Unsupported persistent status category: ${category}`);
      const texture = materialFor(materials, profile[0], generation);
      const explanation = explanations?.[category];
      if (!Array.isArray(explanation) || !explanation[0] || !explanation[1]) {
        throw new Error(`Head marker explanation unavailable: ${category}`);
      }
      const [localX, baseY] = slot(index, candidates.length);
      const localY = baseY + (reducedMotion ? 0 : Math.sin(time * 2.4 + profile[3] * Math.PI * 2) * 1.1);
      const [a,b,c,d,e,f] = actor.transform;
      const x = a*localX+c*localY+e, y = b*localX+d*localY+f;
      const scale = Math.max(.5,Math.hypot(a,b),Math.hypot(c,d));
      const radius = Math.max(15, profile[1]*.62*scale);
      const size = profile[1]*scale;
      const poisonCell = reducedMotion ? 32 : Math.floor(((((time/3.2+profile[3])%1+1)%1)*32))%32;
      const uv = category === 'poison'
        ? [(poisonCell%8)/8, Math.floor(poisonCell/8)/5, 1/8, 1/5]
        : [0,0,1,1];
      const command = Object.freeze({ kind: 'persistent-status', category, x, y, size,
        radius, texture, uv: Object.freeze(uv), alpha: alpha*profile[2],
        glow: Object.freeze(profile[4]), glowStrength: category === 'naturalRecovery' && actor.resting ? .31 : .2,
        time, reducedMotion: Boolean(reducedMotion) });
      commands.push(command);
      hitTargets.push(Object.freeze({ key: `status:${actor.id}:${category}`, x, y, radius,
        title: explanation[0], detail: explanation[1] }));
      if (category === 'burning' && materials.fireMaterialTransport?.ready) {
        const fire = materialFor(materials, 'fireMaterialTransport', generation);
        const phase = reducedMotion ? 8 : (((time*.72+profile[3])%1+1)%1)*32;
        const first = Math.floor(phase), blend = phase-first;
        const cells = [[0,1],[first+1,(1-blend)*.9]];
        if (blend > 0) cells.push([(first+1)%32+1,blend*.9]);
        // The ordered fire atlas layers replace the legacy fallback material.
        commands.pop();
        for (const [cell,weight] of cells) commands.push(Object.freeze({
          ...command, kind:'burning-transport', texture:fire,
          uv:Object.freeze([(cell%6)/6,Math.floor(cell/6)/6,1/6,1/6]),
          alpha:command.alpha*weight, glowStrength:cell===0?command.glowStrength:0
        }));
      }
      if (category === 'naturalRecovery' && activeState.aroma) {
        const aroma = materialFor(materials, 'aromaScentTransport', generation);
        const phase = reducedMotion ? 8 : (((time*.36)%1+1)%1)*24;
        const first = Math.floor(phase), blend = phase-first;
        const cells = [[0,1],[first+1,1-blend]];
        if (blend > 0) cells.push([(first+1)%24+1,blend]);
        for (const [cell, weight] of cells) {
          const cx = x + 8*scale, cy = y - 3*scale;
          commands.push(Object.freeze({ kind: 'aroma-detail', category, x:cx, y:cy,
            anchorX:x, anchorY:y, size:17.5*scale, height:28*scale, texture:aroma,
            uv:Object.freeze([(cell%5)/5,Math.floor(cell/5)/5,1/5,1/5]),
            alpha:alpha*profile[2]*weight, glow:Object.freeze([.70,.44,.94]), glowStrength:.06 }));
        }
      }
    }
    return Object.freeze({ generation, commands:Object.freeze(commands), hitTargets:Object.freeze(hitTargets),
      unsupported, excludedFamilies:EXCLUDED });
  }
  function create({ frameOwner } = {}) {
    if (frameOwner?.state !== 'ready') throw new TypeError('Shared WebGPU frame owner required');
    const device=frameOwner.device, format=frameOwner.format;
    const module=device.createShaderModule({label:'DVA retained head markers',code:shader});
    const pipelines=new Map();
    function pipelineFor(mode){
      if(!['source-over','screen','additive'].includes(mode))throw new Error(`Unsupported marker blend: ${mode}`);
      if(!pipelines.has(mode)){
        const color=mode==='screen'
          ?{srcFactor:'one-minus-dst',dstFactor:'one',operation:'add'}
          :{srcFactor:'one',dstFactor:mode==='additive'?'one':'one-minus-src-alpha',operation:'add'};
        pipelines.set(mode,device.createRenderPipeline({label:`DVA ordered ${mode} head markers`,layout:'auto',
          vertex:{module,entryPoint:'vs'},fragment:{module,entryPoint:'fs',targets:[{format,
            blend:{color,alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},
          primitive:{topology:'triangle-list'}}));
      }
      return pipelines.get(mode);
    }
    const sampler=device.createSampler({minFilter:'linear',magFilter:'linear',addressModeU:'clamp-to-edge',addressModeV:'clamp-to-edge'});
    const slots=[]; const frameIndices=new WeakMap(); let destroyed=false;
    function buffer(index) {
      if (!slots[index]) slots[index]=frameOwner.own(device.createBuffer({label:'DVA head marker command',size:80,usage:0x40|0x08}));
      return slots[index];
    }
    function record({frame,target,viewport,planned}={}) {
      if (destroyed || frameOwner.state !== 'ready') throw new Error('Head marker pass unavailable');
      if (typeof frame?.add !== 'function' || !target || !planned ||
          ![viewport?.width,viewport?.height,viewport?.pixelWidth,viewport?.pixelHeight].every(v=>finite(v)&&v>0)) {
        throw new TypeError('Shared frame, target, logical viewport and plan required');
      }
      const commands=planned.commands;
      if (!Array.isArray(commands) || !Array.isArray(planned.hitTargets)) throw new TypeError('Invalid head marker plan');
      if (!Array.isArray(planned.unsupported) || planned.unsupported.length)
        throw new Error('Head marker plan has visible unsupported families');
      if (planned.generation !== viewport.generation) throw new Error('Head marker plan stale for viewport');
      if (!commands.length) return planned.hitTargets;
      let next=frameIndices.get(frame)||0;
      const draws=[];
      for (const command of commands) {
        const gpuBuffer=buffer(next++);
        const w=command.size*1.8, h=(command.height||command.size)*1.8;
        const values=new Float32Array([
          command.x-w/2,command.y-h/2,w,h,
          ...command.uv,1,1,1,command.alpha,
          ...command.glow,command.glowStrength,
          viewport.width,viewport.height,0,0
        ]);
        if (!values.every(finite)) throw new RangeError('Head marker GPU command nonfinite');
        device.queue.writeBuffer(gpuBuffer,0,values);
        draws.push({command,gpuBuffer});
      }
      frameIndices.set(frame,next);
      frame.add({target,label:'DVA retained head markers',encode(pass){
        for (const {command,gpuBuffer} of draws) {
          const pipeline=pipelineFor(command.blendMode||'additive');
          pass.setPipeline(pipeline);
          const group=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[
            {binding:0,resource:{buffer:gpuBuffer}},
            {binding:1,resource:command.texture.createView()},
            {binding:2,resource:sampler}
          ]});
          pass.setBindGroup(0,group);pass.draw(6);
        }
      }});
      return planned.hitTargets;
    }
    return Object.freeze({record,destroy(){
      if(destroyed)return;
      destroyed=true;
      for(const resource of slots){
        if(!resource)continue;
        frameOwner.release?.(resource);
        resource.destroy();
      }
      slots.length=0;
    }});
  }
  const api=Object.freeze({PROFILES,EXCLUDED,SUPPORTED,plan,create});
  root.DvaWebGPUHeadMarkers=api;
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
