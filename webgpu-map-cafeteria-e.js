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
  const ANCHOR_STATUS = 'provisional-before-approved-raster';
  const ANCHOR_SOURCE = 'outputs/request-20260924/map-next-room/integration-plan.coordinates.json';
  const OBJECTS = Object.freeze({
    'v302-cafeteria-nutritionStation-1': Object.freeze({
      id: 'v302-cafeteria-nutritionStation-1', type: 'healthyMealTable', effectKind: 'healthyMeal',
      x: 1334, y: 2661, kind: 0, durationMs: 1320, width: 104, height: 58,
      design: 'four-bay service tray', soundProfile: 'four-bay-service-sequence'
    }),
    'v302-cafeteria-hydration-2': Object.freeze({
      id: 'v302-cafeteria-hydration-2', type: 'mineralWaterBar', effectKind: 'stamina',
      x: 1827, y: 2661, kind: 1, durationMs: 820, width: 82, height: 104,
      design: 'culture dose calibration', soundProfile: 'culture-dose-calibration'
    }),
    'v302-cafeteria-sofa-3': Object.freeze({
      id: 'v302-cafeteria-sofa-3', type: 'relaxationSalon', effectKind: 'acceleration',
      x: 1343, y: 3048, kind: 2, durationMs: 1060, width: 112, height: 112,
      design: 'centered communal-platter resonance', soundProfile: 'communal-platter-settle'
    })
  });
  const AMBIENT = Object.freeze({
    id: 'cafeteria-service-light', x: 1450, y: 2474, width: 260, height: 72,
    durationMs: 1460, soundProfile: 'upper-louver-servos'
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
    const progress = clamp((now - event.startedAt) / AMBIENT.durationMs, 0, 1);
    return Object.freeze({ type: AMBIENT_TYPE, eventId: event.revision, design: 'upper-wall louver sequence',
      kind: 3, phase: progress < 0.82 ? 'ordered-louver-rotation' : 'upper-wall-aperture-settle', progress,
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
@fragment fn fs(i:V)->@location(0) vec4f {
 let px=vec2f((i.clip.x+1.0)*0.5*p.view.z,(1.0-i.clip.y)*0.5*p.view.w);
 let world=p.view.xy+px/p.scale.xy;
 let q=(world-p.source.xy)/p.source.zw*2.0-vec2f(1.0);
 if(any(abs(q)>vec2f(1.0))){discard;}
 let t=p.state.x; let k=p.state.y; let reduced=p.state.z>0.5;
 let u=select(t,0.52,reduced); var m=0.0; var h=0.0; var c=vec3f(0.82,0.92,0.80);
 if(k<0.5){
   // Replacement meal-service cause: four separate service wells resolve in
   // place, then a broad stationary tray/platter contour forms at the output.
   // It has no warm single-bay flare or travelling plate silhouette.
   let wa=line(q.y+0.61,0.065)*band(q.x,-0.80,-0.15)*
     (smoothstep(0.00,0.025,t)*(1.0-smoothstep(0.075,0.10,t)));
   let wb=line(q.y+0.20,0.065)*band(q.x,-0.80,-0.15)*
     (smoothstep(0.09,0.115,t)*(1.0-smoothstep(0.165,0.19,t)));
   let wc=line(q.y-0.20,0.065)*band(q.x,-0.80,-0.15)*
     (smoothstep(0.18,0.205,t)*(1.0-smoothstep(0.255,0.28,t)));
   let wd=line(q.y-0.61,0.065)*band(q.x,-0.80,-0.15)*
     (smoothstep(0.27,0.295,t)*(1.0-smoothstep(0.345,0.37,t)));
   let trayIn=smoothstep(0.34,0.48,t);
   let trayHold=1.0-smoothstep(0.90,1.0,t);
   let trayRound=length(vec2f((q.x-0.38)*1.20,q.y*1.80));
   let trayRim=line(trayRound-(0.10+0.50*trayIn),0.055);
   let trayInner=line(trayRound-(0.03+0.42*trayIn),0.026);
   let serviceSpine=line(q.x+0.02,0.035)*band(q.y,-0.62,0.62)*trayIn;
   let resolve=(wa+wb+wc+wd)*0.82;
   m=resolve+trayRim*trayHold+trayInner*trayHold*0.74+serviceSpine*trayHold*0.44;
   h=(wa+wb+wc+wd)*0.78+trayRim*trayHold*0.62+trayInner*trayHold*0.46;
   c=vec3f(0.36,0.98,0.68);
 } else if(k<1.5){
   // Precision dose presentation, not a pour: etch marks resolve, a single
   // measured rectangular segment appears between fixed graduations, and a
   // two-sided bracket closes and holds on that exact quantity. No fluid flow.
   let etch=smoothstep(0.02,0.20,t);
   let dose=smoothstep(0.24,0.42,t);
   let lock=smoothstep(0.60,0.74,t);
   let glassSides=(line(abs(q.x)-0.33,0.035)+line(abs(q.y)-0.75,0.035))*band(q.x,-0.34,0.34);
   let ticks=(line(q.y+0.54,0.024)+line(q.y+0.35,0.024)+line(q.y+0.16,0.024)+
     line(q.y+0.03,0.024)+line(q.y-0.35,0.024)+line(q.y-0.54,0.024))*band(q.x,0.39,0.77)*etch;
   let doseBody=band(q.y,-0.12,0.12)*band(q.x,-0.26,0.26)*dose;
   let doseEdge=(line(q.y-0.12,0.028)+line(q.y+0.12,0.028))*band(q.x,-0.24,0.24)*dose;
   let bracket=(line(q.x+0.43,0.04)+line(q.x-0.43,0.04))*band(q.y,-0.17,0.17)*lock;
   let bracketEnds=(line(q.y-0.17,0.035)+line(q.y+0.17,0.035))*
     (band(q.x,-0.51,-0.38)+band(q.x,0.38,0.51))*lock;
   let stop=1.0-smoothstep(0.0,0.18,abs(u-0.86));
   m=glassSides*0.20+ticks*0.68+doseBody*0.78+doseEdge*0.72+bracket*0.84+bracketEnds*0.56;
   h=ticks*0.32+doseBody*0.70+doseEdge*0.58+bracket*0.54+bracketEnds*0.38+stop*doseBody*0.20;
   c=vec3f(0.96,0.42,0.68);
 } else if(k<2.5){
   // Successful communal rest produces a centered platter-settle resonance:
   // nested, slightly elliptical rings and a broad center dish form in place.
   // No botanical contour, perimeter trace, or seat-to-seat travel.
   let build=smoothstep(0.04,0.50,t);
   let settle=smoothstep(0.62,0.78,t)*(1.0-smoothstep(0.92,1.0,t));
   let radius=0.12+0.72*build;
   let ellipse=length(vec2f(q.x*0.92,q.y*1.08));
   let outer=line(ellipse-radius,0.050);
   let middle=line(ellipse-(radius*0.72),0.034);
   let inner=line(ellipse-(radius*0.44),0.026);
   let dish=1.0-smoothstep(0.12,0.32,ellipse);
   let core=line(ellipse-0.11,0.045);
   let layered=outer*0.78+middle*0.58+inner*0.40;
   m=layered+core*settle*0.72+dish*settle*0.18;
   h=outer*0.62+middle*0.42+inner*0.34+core*settle*0.52;
   c=vec3f(0.50,0.58,1.0);
 } else {
   // Room service change is expressed on three upper-wall baffle louvers.
   // Each broad blade rotates in sequence; a recessed aperture and rim layers
   // appear behind it. This is architectural geometry, not a floor-light field.
   let a0=smoothstep(0.03,0.20,t)*(1.0-smoothstep(0.30,0.42,t));
   let a1=smoothstep(0.28,0.45,t)*(1.0-smoothstep(0.55,0.67,t));
   let a2=smoothstep(0.53,0.70,t)*(1.0-smoothstep(0.80,0.92,t));
   let fade=1.0-smoothstep(0.88,1.0,t);
   let open0=smoothstep(0.06,0.32,t);
   let open1=smoothstep(0.31,0.57,t);
   let open2=smoothstep(0.56,0.82,t);
   let x0=q.x+0.58; let x1=q.x; let x2=q.x-0.58;
   let blade0=line(q.y-(0.25*x0*(0.20+0.80*open0)),0.115)*band(x0,-0.27,0.27);
   let blade1=line(q.y-(0.25*x1*(0.20+0.80*open1)),0.115)*band(x1,-0.27,0.27);
   let blade2=line(q.y-(0.25*x2*(0.20+0.80*open2)),0.115)*band(x2,-0.27,0.27);
   let apertures=(band(q.x,-0.84,-0.32)*a0+band(q.x,-0.27,0.27)*a1+band(q.x,0.32,0.84)*a2);
   let rim=line(abs(q.y)-0.55,0.04)*band(q.x,-0.94,0.94);
   let deep=(blade0*a0+blade1*a1+blade2*a2);
   let core=(blade0*open0+blade1*open1+blade2*open2)*fade;
   m=apertures*0.18+rim*0.52+deep*0.68+core*0.78;
   h=apertures*0.26+rim*0.40+deep*0.54+core*0.72;
   c=vec3f(0.76,0.58,1.0);
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
  const api = Object.freeze({ MAP_ID, ROOM_ID, TYPE, AMBIENT_TYPE, MAX_FRAME_EVENTS, ANCHOR_STATUS, ANCHOR_SOURCE,
    OBJECTS, AMBIENT, SFX_POLICY, shader, objectPhase, planObject, planAmbient, planAll, pack, create });
  root.DvaWebGPUMapCafeteriaE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
