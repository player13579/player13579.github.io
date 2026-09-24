/* Textureless acceleration/deceleration lifecycle E for a shared WebGPU frame.
 * The app owns event admission/order and one-shot SFX; no marker clock enters here. */
(function (root) {
  'use strict';

  const PROFILES = Object.freeze({
    'gravity-accelerate': Object.freeze({ mode: 0, durationMs: 8000, radiusX: 58,
      radiusY: 76, anchorY: 48, hue: 'amber-cyan' }),
    'gravity-decelerate': Object.freeze({ mode: 1, durationMs: 8000, radiusX: 62,
      radiusY: 80, anchorY: 49, hue: 'ice-violet' }),
    'natural-recovery': Object.freeze({ mode: 2, durationMs: 1350, radiusX: 54,
      radiusY: 72, anchorY: 47, hue: 'mint-clear' })
  });
  const finite = Number.isFinite;
  const FLOAT_COUNT = 16;
  const TRANSITION = Object.freeze({ grant: 0, sustain: 1, removal: 2, blocked: 3, clear: 4 });

  function outsideViewport({ type, player, camera, zoom, viewport } = {}) {
    const profile = PROFILES[type];
    if (!profile || !player || !camera || viewport?.kind !== 'main' ||
        ![player.x, player.y, camera.x, camera.y, zoom, viewport.width, viewport.height,
          viewport.pixelWidth, viewport.pixelHeight].every(finite) || zoom <= 0 ||
        viewport.width <= 0 || viewport.height <= 0 ||
        viewport.pixelWidth <= 0 || viewport.pixelHeight <= 0) return false;
    const sx = zoom * viewport.pixelWidth / viewport.width;
    const sy = zoom * viewport.pixelHeight / viewport.height;
    const centerX = (player.x - camera.x) * sx;
    const centerY = (player.y - profile.anchorY - camera.y) * sy;
    const radiusX = profile.radiusX * sx, radiusY = profile.radiusY * sy;
    return [centerX, centerY, radiusX, radiusY].every(finite) &&
      (centerX + radiusX * 1.15 < 0 || centerX - radiusX * 1.15 > viewport.pixelWidth ||
       centerY + radiusY * 1.15 < 0 || centerY - radiusY * 1.15 > viewport.pixelHeight);
  }

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
fn angleGap(a:f32,b:f32)->f32{return abs(atan2(sin(a-b),cos(a-b)));}
fn edge(t:f32)->f32{return smoothstep(0.0,.025,t)*(1.0-smoothstep(.91,1.0,t));}
@fragment fn fs(@builtin(position) pixel:vec4f)->@location(0) vec4f {
  let q=(pixel.xy-p.view.zw)/max(p.geometry.xy,vec2f(.001));
  let t=clamp(p.state.x,0.0,1.0);let mode=p.state.y;let reduced=p.state.z>.5;
  let transition=p.extra.x;let motionT=select(t,.5,reduced);
  var rgb=vec3f(.58,.91,1.0);var core=0.0;var glow=0.0;
  if(mode<.5){
    // Acceleration grant: warm ignition opens into two clean, fast upward lanes.
    // Expiry reverses them into the torso so the lifecycle visibly terminates.
    let grant=ease(t/.13);let remove=ease((t-.83)/.17);
    let travel=select(grant,1.0-remove,t>.83);
    let height=q.y+.22;let laneX=abs(q.x)-(.20+.27*travel+.045*sin(height*5.0));
    let window=smoothstep(-.94,-.72,height)*(1.0-smoothstep(.66,.92,height));
    let lanes=bell(laneX,.047)*window;
    let sweep=bell(height-(.72-1.45*motionT),.12)*(1.0-smoothstep(.18,.40,abs(q.x)));
    let crest=bell(length(vec2f(q.x*1.08,(q.y+.48)*.78))-(.43+.34*travel),.035);
    core=(lanes*.84+sweep*.52+crest*.38)*select(1.0,0.0,transition==3.0);
    glow=lanes*.37+sweep*.24+crest*.29;
    rgb=mix(vec3f(1.0,.45,.10),vec3f(.42,.93,1.0),smoothstep(-.04,.10,q.y));
  }else if(mode<1.5){
    // Deceleration grant clamps a broad ice ring inward. At the deadline its
    // two jaws part and the contained field releases outward once.
    let grant=ease(t/.16);let remove=ease((t-.81)/.19);
    let radius=select(mix(1.04,.58,grant),.58+.48*remove,t>.81);
    let r=length(vec2f(q.x,q.y*.88));let angle=atan2(q.y*.88,q.x);
    let spin=select(motionT*6.28318,0.0,reduced);
    let gap=angleGap(angle,spin);
    let ring=bell(r-radius,.036)*(1.0-smoothstep(.24,.58,gap));
    let secondJaw=bell(r-radius,.055)*smoothstep(2.68,3.08,gap);
    let seam=bell(r-radius-.11,.12)*(1.0-smoothstep(.02,.45,t));
    let denied=bell(r-1.02,.043)*(1.0-smoothstep(.08,.48,gap));
    core=select(ring*.83+secondJaw*.37+seam*.29,denied*.72,transition==3.0);
    glow=select(bell(r-radius,.105)*.42+secondJaw*.20+seam*.18,denied*.28,transition==3.0);
    rgb=select(mix(vec3f(.28,.88,1.0),vec3f(.76,.48,1.0),smoothstep(2.48,3.10,gap)),
      vec3f(.82,.75,1.0),transition==3.0);
  }else{
    // Natural recovery separates a broad murky film from the body contour;
    // clear mint/cyan remains briefly around the cleansed silhouette.
    let clean=ease(t/.43);let depart=ease((t-.10)/.44);
    let y=clamp(q.y,-1.0,1.0);
    let width=select(mix(.18,.30,smoothstep(-.14,.28,y)),
      mix(.23,.34,smoothstep(.28,.70,y)),y>.28);
    let contour=abs(abs(q.x)-width);
    let peel=.035+.42*depart;
    let vertical=smoothstep(-.88,-.70,y)*(1.0-smoothstep(.72,.92,y));
    let murk=bell(contour-peel,.09)*vertical*(1.0-ease((t-.46)/.35));
    let clearRim=bell(contour,.032)*vertical*(.35+.65*clean);
    let wash=bell(contour,.115)*vertical*clean*.42;
    core=murk*.67+clearRim*.96;glow=murk*.28+clearRim*.42+wash*.45;
    rgb=mix(vec3f(.43,.48,.38),vec3f(.27,1.0,.82),clean);
  }
  // The final SFX is intentionally external; every branch retains a bright
  // premultiplied core and a wider low-alpha glow, including reduced motion.
  var visibility=edge(t);
  if(transition==0.0){visibility*=1.0-ease((t-.18)/.18);}
  if(transition==2.0){visibility*=ease((t-.70)/.18);}
  if(transition==3.0){visibility*=1.0-ease((t-.30)/.25);}
  if(transition==4.0){visibility*=1.0-ease((t-.78)/.18);}
  if(reduced){visibility=edge(t);}
  visibility*=p.state.w;
  let a=clamp((core+glow*.46)*visibility,0.0,.96);
  let c=rgb*(core+glow*.52)*visibility;
  return vec4f(c,a);
}`;

  function transitionFor(mode, progress, variant) {
    if (mode === 2) return variant === 'cleared' ? 'clear' : 'blocked';
    if (String(variant || '').startsWith('rational-natural-recovery-immune')) return 'blocked';
    if (progress < .12) return 'grant';
    if (progress >= .84) return 'removal';
    return 'sustain';
  }

  function plan({ effect, player, now, phase, camera, zoom, viewport,
    reducedMotion = false, alpha = 1 } = {}) {
    if (!effect || !player || !['playing', 'meeting'].includes(phase) ||
        !player.alive || player.ejected || player.inVent || player.invisible) return null;
    const profile = PROFILES[effect.type];
    if (!profile || !effect.id || !effect.playerId || !finite(effect.startedAt) ||
        !finite(effect.duration) || effect.duration <= 0 ||
        (effect.type === 'gravity-accelerate' || effect.type === 'gravity-decelerate'
          ? String(effect.targetId || '') !== String(player.id)
          : String(effect.playerId) !== String(player.id))) return null;
    if (!camera || viewport?.kind !== 'main' ||
        ![player.x, player.y, camera.x, camera.y, zoom, now, alpha,
          viewport.width, viewport.height, viewport.pixelWidth, viewport.pixelHeight].every(finite) ||
        zoom <= 0 || alpha <= 0 || alpha > 1 || viewport.width <= 0 || viewport.height <= 0 ||
        !Number.isInteger(viewport.pixelWidth) || !Number.isInteger(viewport.pixelHeight) ||
        viewport.pixelWidth <= 0 || viewport.pixelHeight <= 0) return null;
    const durationMs = Math.min(profile.durationMs, effect.duration);
    const elapsed = now - effect.startedAt;
    if (elapsed < 0 || elapsed >= durationMs) return null;
    const progress = elapsed / durationMs;
    const transition = transitionFor(profile.mode, progress, effect.variant);
    const scaleX = zoom * viewport.pixelWidth / viewport.width;
    const scaleY = zoom * viewport.pixelHeight / viewport.height;
    const centerX = (player.x - camera.x) * scaleX;
    const centerY = (player.y - profile.anchorY - camera.y) * scaleY;
    const radiusX = profile.radiusX * scaleX, radiusY = profile.radiusY * scaleY;
    if (![centerX, centerY, radiusX, radiusY].every(finite) || radiusX <= 0 || radiusY <= 0) return null;
    if (outsideViewport({ type: effect.type, player, camera, zoom, viewport })) return null;
    return Object.freeze({ effectId: String(effect.id), type: effect.type,
      mode: profile.mode, transition, transitionIndex: TRANSITION[transition],
      elapsed, durationMs, progress, reducedMotion: Boolean(reducedMotion), alpha,
      centerX, centerY, radiusX, radiusY,
      pixelWidth: viewport.pixelWidth, pixelHeight: viewport.pixelHeight });
  }

  function planBatch({ effects, resolvePlayer, ...context } = {}) {
    if (!Array.isArray(effects) || typeof resolvePlayer !== 'function')
      throw new TypeError('Status tempo E batch requires effects and actor resolver');
    const seen = new Set(), output = [];
    for (const effect of effects) {
      const id = String(effect?.id || '');
      if (!id || seen.has(id)) continue;
      seen.add(id);
      const actorId = effect.type === 'gravity-accelerate' || effect.type === 'gravity-decelerate'
        ? effect.targetId : effect.playerId;
      const player = resolvePlayer(String(actorId || ''));
      const planned = plan({ ...context, effect, player });
      if (planned) output.push(planned);
    }
    return Object.freeze(output);
  }

  function pack(planned) {
    if (!planned || !Object.hasOwn(PROFILES, planned.type) ||
        !Object.hasOwn(TRANSITION, planned.transition) ||
        ![planned.pixelWidth, planned.pixelHeight, planned.centerX, planned.centerY,
          planned.radiusX, planned.radiusY, planned.progress, planned.alpha].every(finite))
      throw new TypeError('A valid status tempo E plan is required');
    const data = new Float32Array([
      planned.pixelWidth, planned.pixelHeight, planned.centerX, planned.centerY,
      planned.radiusX, planned.radiusY, 0, planned.mode,
      planned.progress, planned.mode, planned.reducedMotion ? 1 : 0,
      Math.min(1, Math.max(0, planned.alpha)), planned.transitionIndex, 0, 0, 0
    ]);
    if (!data.every(finite)) throw new RangeError('Status tempo E values exceed float32 range');
    return data;
  }

  function create({ renderer, frameOwner = renderer } = {}) {
    if (frameOwner?.state !== 'ready' || !frameOwner.device?.createShaderModule ||
        !frameOwner.device?.queue?.writeBuffer || typeof frameOwner.own !== 'function' ||
        typeof frameOwner.release !== 'function' || typeof frameOwner.format !== 'string')
      throw new TypeError('Status tempo E requires the shared ready WebGPU frame owner');
    const device = frameOwner.device, format = frameOwner.format;
    const module = device.createShaderModule({ label: 'DVA textureless status tempo E WGSL', code: shader });
    const pipeline = device.createRenderPipeline({ label: 'DVA status tempo body E', layout: 'auto',
      vertex: { module, entryPoint: 'vs' }, fragment: { module, entryPoint: 'fs', targets: [{ format,
        blend: { color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
          alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' } } }] },
      primitive: { topology: 'triangle-list' } });
    const slots = [], frameIndices = new WeakMap();let destroyed = false;
    function slot(index) {
      if (slots[index]) return slots[index];
      const uniform = frameOwner.own(device.createBuffer({ label: `DVA status tempo E ${index}`,
        size: FLOAT_COUNT * 4, usage: 0x40 | 0x08 }));
      const bindGroup = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: uniform } }] });
      return (slots[index] = { uniform, bindGroup });
    }
    function record({ frame, target, viewport, planned } = {}) {
      if (destroyed || frameOwner.state !== 'ready') throw new Error('Status tempo E pass unavailable');
      if (typeof frame?.add !== 'function' || typeof frame?.stage !== 'function' ||
          typeof target !== 'string' || !target || !planned || viewport?.kind !== 'main' ||
          viewport.pixelWidth !== planned.pixelWidth || viewport.pixelHeight !== planned.pixelHeight)
        throw new TypeError('Status tempo E needs the current shared frame, target, viewport and plan');
      const index=frameIndices.get(frame)||0,{uniform,bindGroup}=slot(index);
      device.queue.writeBuffer(uniform,0,pack(planned));
      frame.stage(`world:status-tempo:${planned.effectId}`);
      frame.add({ target, label: `DVA status tempo E ${planned.effectId}`, encode(pass, info) {
        if (info.device !== device || info.format !== format ||
            info.width !== viewport.pixelWidth || info.height !== viewport.pixelHeight)
          throw new Error('Status tempo E target device, format or backing size mismatch');
        pass.setPipeline(pipeline);pass.setBindGroup(0,bindGroup);pass.draw(3);
      }});
      frameIndices.set(frame,index+1);
      return Object.freeze({ effectId: planned.effectId, transition: planned.transition, drawn: true });
    }
    return Object.freeze({ device, plan, planBatch, record, shader,
      get state(){return destroyed?'destroyed':frameOwner.state;},
      destroy(){if(destroyed)return;destroyed=true;
        for(const item of slots)if(frameOwner.release(item.uniform))item.uniform.destroy();
        slots.length=0;
      }
    });
  }

  const api=Object.freeze({ PROFILES, TRANSITION, outsideViewport, shader, plan, planBatch, pack, create });
  root.DvaWebGPUStatusTempoE=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
