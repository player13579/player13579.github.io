/* Textureless WebGPU E prototype for the one-room cafeteria candidate.
 * In-place replacement for the three legacy cafeteria IDs; no new fixtures.
 * No DOM/Canvas access. Callers own authoritative accepted events and SFX.
 * Fixture centers and extents are provisional until measured on the approved raster. */
(function (root) {
  'use strict';
  const MAP_ID = 'station';
  const ROOM_ID = 'cafeteria';
  const TYPE = 'cafeteria-object-e';
  const AMBIENT_TYPE = 'cafeteria-service-transition';
  const MAX_FRAME_EVENTS = 12;
  const OBJECTS = Object.freeze({
    'v302-cafeteria-nutritionStation-1': Object.freeze({
      id: 'v302-cafeteria-nutritionStation-1', type: 'healthyMealTable', effectKind: 'healthyMeal',
      x: 1334, y: 2661, kind: 0, durationMs: 1320, width: 104, height: 58,
      design: 'four-well plate delivery', soundProfile: 'ceramic-slide-contact'
    }),
    'v302-cafeteria-hydration-2': Object.freeze({
      id: 'v302-cafeteria-hydration-2', type: 'mineralWaterBar', effectKind: 'stamina',
      x: 1827, y: 2661, kind: 1, durationMs: 820, width: 82, height: 104,
      design: 'measured culture pour', soundProfile: 'measured-pour-glass-contact'
    }),
    'v302-cafeteria-sofa-3': Object.freeze({
      id: 'v302-cafeteria-sofa-3', type: 'relaxationSalon', effectKind: 'acceleration',
      x: 1343, y: 3048, kind: 2, durationMs: 1060, width: 112, height: 112,
      design: 'centered communal-platter resonance', soundProfile: 'quiet-cutlery-settle'
    })
  });
  const AMBIENT = Object.freeze({
    id: 'cafeteria-service-light', x: 1450, y: 2474, width: 260, height: 72,
    durationMs: 1460, soundProfile: 'ceiling-baffle-shift'
  });
  const SFX_POLICY = Object.freeze({ owner: 'webgpu-map-cafeteria-e-sfx adapter',
    required: true, edge: 'one-shot-per-accepted-event-id-or-service-revision',
    fixtureProfilesDistinct: true, ambientProfile: AMBIENT.soundProfile,
    idle: 'silent', loop: 'none', playbackByCandidate: false });
  const finite = Number.isFinite;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  function validView({ map, phase, roomVisible, camera, zoom, viewport }) {
    return map?.id === MAP_ID && phase === 'playing' && roomVisible === true &&
      camera && [camera.x, camera.y, zoom, viewport?.width, viewport?.height,
        viewport?.pixelWidth, viewport?.pixelHeight].every(finite) && zoom > 0 &&
      viewport.width > 0 && viewport.height > 0 && viewport.kind === 'main' &&
      Number.isInteger(viewport.pixelWidth) && viewport.pixelWidth > 0 &&
      Number.isInteger(viewport.pixelHeight) && viewport.pixelHeight > 0;
  }
  function screenBounds(source, camera, zoom, viewport) {
    const sx = zoom * viewport.pixelWidth / viewport.width;
    const sy = zoom * viewport.pixelHeight / viewport.height;
    const rect = { x: (source.x - source.width / 2 - camera.x) * sx,
      y: (source.y - source.height / 2 - camera.y) * sy,
      width: source.width * sx, height: source.height * sy };
    if (!Object.values(rect).every(finite) || rect.x >= viewport.pixelWidth ||
        rect.y >= viewport.pixelHeight || rect.x + rect.width <= 0 ||
        rect.y + rect.height <= 0) return null;
    return { rect, sx, sy };
  }
  function objectPhase(kind, p) {
    if (kind === 0) return p < 0.364 ? 'four-bay-sequence' : p < 0.879 ? 'stationary-tray-forms' : 'platter-settle';
    if (kind === 1) return p < 0.305 ? 'glass-graduations-resolve' : p < 0.756 ? 'dose-band-locks' : 'measured-stop';
    return p < 0.660 ? 'centered-platter-resonance' : 'resonance-settle';
  }
  function planObject({ map, event, now, phase, roomVisible, camera, zoom, viewport, reducedMotion = false } = {}) {
    const source = OBJECTS[event?.objectId];
    if (!validView({ map, phase, roomVisible, camera, zoom, viewport }) || !source ||
        event?.type !== TYPE || event.accepted !== true || event.objectType !== source.type ||
        event.effectKind !== source.effectKind || typeof event.id !== 'string' || !event.id ||
        typeof event.playerId !== 'string' || !event.playerId || !finite(event.startedAt) ||
        !finite(now) || !finite(event.duration) || event.duration !== source.durationMs ||
        now < event.startedAt || now >= event.startedAt + source.durationMs) return null;
    const object = Array.isArray(map.objects) && map.objects.find(o => o?.id === source.id);
    if (!object || object.type !== source.type || object.effectKind !== source.effectKind ||
        object.x !== source.x || object.y !== source.y || object.room !== ROOM_ID) return null;
    const bounds = screenBounds(source, camera, zoom, viewport);
    if (!bounds) return null;
    const progress = clamp((now - event.startedAt) / source.durationMs, 0, 1);
    return Object.freeze({ type: TYPE, eventId: event.id, objectId: source.id, playerId: event.playerId,
      design: source.design, kind: source.kind, phase: objectPhase(source.kind, progress), progress,
      elapsedMs: now - event.startedAt, durationMs: source.durationMs,
      source: Object.freeze({ x: source.x, y: source.y, width: source.width, height: source.height }),
      screen: Object.freeze(bounds.rect), pixelWidth: viewport.pixelWidth, pixelHeight: viewport.pixelHeight,
      camera: Object.freeze({ x: camera.x, y: camera.y }), scale: Object.freeze({ x: bounds.sx, y: bounds.sy }),
      reducedMotion: Boolean(reducedMotion),
      sound: Object.freeze({ required: true, profile: source.soundProfile, eventId: event.id,
        edge: 'accepted-use-once', playbackByCandidate: false, durationMs: source.durationMs }) });
  }
  function planAmbient({ map, event, now, phase, roomVisible, camera, zoom, viewport, reducedMotion = false } = {}) {
    if (!validView({ map, phase, roomVisible, camera, zoom, viewport }) || event?.type !== AMBIENT_TYPE ||
        event.accepted !== true || typeof event.revision !== 'string' || !event.revision ||
        !finite(event.startedAt) || !finite(event.duration) || event.duration !== AMBIENT.durationMs ||
        !finite(now) || now < event.startedAt || now >= event.startedAt + AMBIENT.durationMs) return null;
    const sx = zoom * viewport.pixelWidth / viewport.width, sy = zoom * viewport.pixelHeight / viewport.height;
    const screen = { x: (AMBIENT.x - AMBIENT.width / 2 - camera.x) * sx,
      y: (AMBIENT.y - AMBIENT.height / 2 - camera.y) * sy,
      width: AMBIENT.width * sx, height: AMBIENT.height * sy };
    if (!Object.values(screen).every(finite) || screen.x >= viewport.pixelWidth ||
        screen.y >= viewport.pixelHeight || screen.x + screen.width <= 0 ||
        screen.y + screen.height <= 0) return null;
    return Object.freeze({ type: AMBIENT_TYPE, eventId: event.revision, design: 'aisle-clipped ceiling-baffle sweep',
      kind: 3, progress: clamp((now - event.startedAt) / AMBIENT.durationMs, 0, 1),
      durationMs: AMBIENT.durationMs, source: Object.freeze({ x: AMBIENT.x, y: AMBIENT.y,
        width: AMBIENT.width, height: AMBIENT.height }), screen: Object.freeze(screen),
      pixelWidth: viewport.pixelWidth, pixelHeight: viewport.pixelHeight,
      camera: Object.freeze({ x: camera.x, y: camera.y }), scale: Object.freeze({ x: sx, y: sy }),
      reducedMotion: Boolean(reducedMotion),
      sound: Object.freeze({ required: true, profile: AMBIENT.soundProfile, eventId: event.revision,
        edge: 'service-revision-once', playbackByCandidate: false, durationMs: AMBIENT.durationMs }) });
  }
  function planAll(context = {}) {
    const out = [];
    const ids = new Set();
    for (const event of Array.isArray(context.events) ? context.events : []) {
      const plan = event?.type === AMBIENT_TYPE ? planAmbient({ ...context, event }) : planObject({ ...context, event });
      if (plan && !ids.has(plan.eventId)) { ids.add(plan.eventId); out.push(plan); }
    }
    return Object.freeze(out);
  }
  const shader = /* wgsl */`
struct Params { view: vec4f, source: vec4f, state: vec4f, scale: vec4f };
@group(0) @binding(0) var<uniform> p: Params;
struct V { @builtin(position) position: vec4f, @location(0) clip: vec2f };
@vertex fn vs(@builtin(vertex_index) i: u32) -> V {
 let q = array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3))[i];
 var o: V; o.position=vec4f(q,0,1); o.clip=q; return o;
}
fn line(d:f32,w:f32)->f32 { return exp(-(d*d)/max(w*w,0.0001)); }
fn band(v:f32,a:f32,b:f32)->f32 { return smoothstep(a,a+0.035,v)*(1.0-smoothstep(b-0.035,b,v)); }
fn capsule(p0:vec2f,a:vec2f,b:vec2f,w:f32)->f32 {
 let v=b-a; let q=p0-a; let t=clamp(dot(q,v)/max(dot(v,v),0.0001),0.0,1.0);
 return line(length(q-v*t),w);
}
@fragment fn fs(i:V)->@location(0) vec4f {
 let px=vec2f((i.clip.x+1.0)*0.5*p.view.z,(1.0-i.clip.y)*0.5*p.view.w);
 let world=p.view.xy+px/p.scale.xy;
 let q=(world-p.source.xy)/p.source.zw*2.0-vec2f(1.0);
 if(any(abs(q)>vec2f(1.0))){discard;}
 let t=p.state.x; let k=p.state.y; let reduced=p.state.w>0.5;
 let u=select(t,0.52,reduced); var m=0.0; var h=0.0; var c=vec3f(0.82,0.92,0.80);
 if(k<0.5){
   // Service counter: four broad well notes, a fixed bay response, and one
   // shallow plate edge moving outward. Warmth ends before the settle tail.
   let warm=smoothstep(0.0,0.12,t)*(1.0-smoothstep(0.20,0.29,t));
   let travel=smoothstep(0.22,0.31,t)*(1.0-smoothstep(0.61,0.70,t));
   let settle=smoothstep(0.62,0.70,t)*(1.0-smoothstep(0.90,1.0,t));
   let wells=line(q.y+0.50,0.045)+line(q.y+0.17,0.045)+line(q.y-0.17,0.045)+line(q.y-0.50,0.045);
   let bay=line(q.x-0.62,0.045)*band(q.y,-0.42,0.42);
   let plateX=mix(-0.50,0.55,clamp((t-0.22)/0.39,0.0,1.0));
   let plate= line(length(vec2f((q.x-plateX)*1.12,q.y*1.35))-0.19,0.045)+
     line(length(vec2f((q.x-plateX)*1.12,q.y*1.35))-0.27,0.025);
   m=wells*warm*0.24+bay*warm*0.55+plate*travel+line(q.x-0.62,0.10)*settle;
   h=bay*warm*0.25+plate*travel*0.70+line(q.x-0.62,0.12)*settle*0.3;
   c=vec3f(0.96,0.70,0.34);
 } else if(k<1.5){
   // Hydration column: one descending meniscus, one measured curved ribbon,
   // then a single cup contact. No bubbles, idle refrigeration, or sparkle.
   let drain=smoothstep(0.0,0.08,t)*(1.0-smoothstep(0.33,0.43,t));
   let pour=smoothstep(0.35,0.45,t)*(1.0-smoothstep(0.75,0.84,t));
   let contact=smoothstep(0.76,0.84,t)*(1.0-smoothstep(0.92,1.0,t));
   let meniscusY=mix(-0.48,0.40,clamp(t/0.39,0.0,1.0));
   let vessel=line(abs(q.x)-0.48,0.045)*band(q.y,-0.68,0.70)+line(q.y+0.68,0.04)*band(q.x,-0.48,0.48);
   let surface=line(q.y-meniscusY,0.052)*band(q.x,-0.40,0.40);
   let stream=capsule(q,vec2f(0.36,-0.30),vec2f(0.20,0.30),0.055)*pour+
     line(q.y-(0.55+0.10*sin(u*8.0+q.x*3.0)),0.052)*band(q.x,0.11,0.31)*pour;
   let cup=line(abs(q.x-0.18)-0.16,0.04)*band(q.y,0.44,0.77)+line(q.y-0.77,0.035)*band(q.x,0.02,0.34);
   m=vessel*0.20+surface*drain+stream+cup*contact;
   h=surface*drain*0.35+stream*0.58+cup*contact*0.25;
   c=vec3f(0.30,0.78,0.86);
 } else if(k<2.5){
   // Rest table: the only moving feature is a thin reflection traveling from
   // the plate-setting edge along one leaf-shaped contour to its rounded tip.
   let travel=smoothstep(0.0,0.08,t)*(1.0-smoothstep(0.66,0.74,t));
   let fade=smoothstep(0.66,0.76,t)*(1.0-smoothstep(0.92,1.0,t));
   let leafY=0.14*sin(q.x*2.4)-0.05;
   let rim=line(q.y-leafY,0.035)*band(q.x,-0.82,0.82);
   let front=clamp(u/0.68,0.0,1.0);
   let glint=line(q.x-(-0.74+front*1.40),0.075)*line(q.y-(leafY+0.04),0.10);
   m=rim*travel*0.12+glint*travel+glint*fade*0.34;
   h=glint*travel*0.68+glint*fade*0.25;
   c=vec3f(0.74,0.93,0.62);
 } else {
   // Architectural ceiling-baffle change reflected only on clear aisle floor;
   // the central upload task anchor has a quiet circular exclusion.
   let sweep=smoothstep(0.0,0.13,t)*(1.0-smoothstep(0.78,1.0,t));
   let y=-0.72+1.44*clamp(u,0.0,1.0);
   let aisle=band(q.x,-0.78,0.78)*band(q.y,-0.92,0.92);
   // upload-f sits at world (1604,2850), offset from this source by (4,20).
   let taskQ=(q-vec2f(4.0/170.0,20.0/82.0))*vec2f(1.85,1.72);
   let taskGap=1.0-smoothstep(0.22,0.34,length(taskQ));
   let ribbon=line(q.y-y+0.07*sin(q.x*3.2),0.18)*aisle*(1.0-taskGap)*sweep;
   let broad=line(q.y-y+0.07*sin(q.x*3.2),0.42)*aisle*(1.0-taskGap)*sweep;
   m=ribbon*0.16+broad*0.09; h=ribbon*0.32;
   c=vec3f(0.70,0.84,0.77);
 }
 let pulse=select(1.0,0.82+0.18*cos(t*6.2831853),!reduced);
 let a=clamp((m+h*0.46)*pulse*0.66,0.0,0.48);
 return vec4f(c*(a+h*0.18),a);
}`;
  function pack(p) {
    if (!p || !finite(p.kind) || p.kind < 0 || p.kind > 3 || !finite(p.progress) ||
        p.progress < 0 || p.progress >= 1 || ![p.source?.x, p.source?.y, p.source?.width,
        p.source?.height, p.camera?.x, p.camera?.y, p.scale?.x, p.scale?.y,
        p.pixelWidth, p.pixelHeight].every(finite) || p.scale.x <= 0 || p.scale.y <= 0 ||
        p.pixelWidth <= 0 || p.pixelHeight <= 0) throw new TypeError('Valid cafeteria E plan required');
    const data = new Float32Array([p.camera.x, p.camera.y, p.pixelWidth, p.pixelHeight,
      p.source.x, p.source.y, p.source.width, p.source.height,
      p.progress, p.kind, p.reducedMotion ? 1 : 0, 0,
      p.scale.x, p.scale.y, 0, 0]);
    if (!data.every(finite)) throw new RangeError('Cafeteria E uniform exceeds float32 range');
    return data;
  }
  function create({ renderer, frameOwner = renderer } = {}) {
    if (frameOwner?.state !== 'ready' || !frameOwner.device?.createShaderModule ||
        !frameOwner.device?.createRenderPipeline || !frameOwner.device?.createBuffer ||
        !frameOwner.device?.createBindGroup || !frameOwner.device?.queue?.writeBuffer ||
        typeof frameOwner.own !== 'function' || typeof frameOwner.release !== 'function' ||
        typeof frameOwner.format !== 'string') throw new TypeError('Cafeteria E requires shared ready WebGPU frame owner');
    const device = frameOwner.device, format = frameOwner.format;
    const module = device.createShaderModule({ label: 'DVA cafeteria WebGPU E WGSL', code: shader });
    const pipeline = device.createRenderPipeline({ label: 'DVA cafeteria fixture and ambient E', layout: 'auto',
      vertex: { module, entryPoint: 'vs' }, fragment: { module, entryPoint: 'fs', targets: [{ format,
        blend: { color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
          alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' } } }] },
      primitive: { topology: 'triangle-list' } });
    const slots = [], frameState = new WeakMap(); let destroyed = false;
    function slot(i) {
      if (slots[i]) return slots[i];
      const buffer = frameOwner.own(device.createBuffer({ label: `DVA cafeteria E slot ${i}`,
        size: 64, usage: 0x40 | 0x08 }));
      const bind = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer } }] });
      return (slots[i] = { buffer, bind });
    }
    function record({ frame, target, viewport, planned } = {}) {
      if (destroyed || frameOwner.state !== 'ready') throw new Error('Cafeteria E unavailable');
      if (!frame || typeof frame.stage !== 'function' || typeof frame.add !== 'function' ||
          typeof target !== 'string' || !target || viewport?.kind !== 'main' ||
          viewport.pixelWidth !== planned?.pixelWidth || viewport.pixelHeight !== planned?.pixelHeight)
        throw new TypeError('Cafeteria E requires current main-frame plan');
      const state = frameState.get(frame) || { ids: new Set(), next: 0 };
      if (state.ids.has(planned.eventId)) return Object.freeze({ drawn: false, duplicate: true, eventId: planned.eventId });
      if (state.next >= MAX_FRAME_EVENTS) throw new RangeError('Cafeteria E frame event limit exceeded');
      const bufferSlot = slot(state.next++);
      device.queue.writeBuffer(bufferSlot.buffer, 0, pack(planned));
      frame.stage(`world:cafeteria-e:${planned.eventId}`);
      frame.add({ target, label: `world:cafeteria-e:${planned.design}:${planned.eventId}`,
        encode(pass, info) {
          if (info.device !== device || info.format !== format || info.width !== viewport.pixelWidth ||
              info.height !== viewport.pixelHeight) throw new Error('Cafeteria E shared-target mismatch');
          pass.setPipeline(pipeline); pass.setBindGroup(0, bufferSlot.bind); pass.draw(3);
        } });
      state.ids.add(planned.eventId); frameState.set(frame, state);
      return Object.freeze({ drawn: true, eventId: planned.eventId, design: planned.design,
        soundProfile: planned.sound.profile, soundPlaybackOwned: false });
    }
    return Object.freeze({ record, shader, get state() { return destroyed ? 'destroyed' : frameOwner.state; },
      destroy() { if (destroyed) return; destroyed = true;
        for (const item of slots) if (frameOwner.release(item.buffer)) item.buffer.destroy(); slots.length = 0; } });
  }
  const api = Object.freeze({ MAP_ID, ROOM_ID, TYPE, AMBIENT_TYPE, MAX_FRAME_EVENTS,
    OBJECTS, AMBIENT, SFX_POLICY, shader, objectPhase, planObject, planAmbient, planAll, pack, create });
  root.DvaWebGPUMapCafeteriaE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
