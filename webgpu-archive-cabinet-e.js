/* Textureless, exact-object archive cabinet activation E.
 * The authoritative object-use event selects the saved record; the host owns
 * event admission, audio, and the shared WebGPU frame. */
(function (root) {
  'use strict';

  const OBJECT_ID = 'v302-archive-archiveCabinet-2';
  const EVENT_TYPE = 'object-archiveCabinet';
  const ANCHOR = Object.freeze({ x: 916, y: 365 });
  const DURATION_MS = 1120;
  const finite = Number.isFinite;

  const shader = /* wgsl */ `
struct Params { viewport: vec4f, scale: vec4f, time: vec4f }
@group(0) @binding(0) var<uniform> p: Params;
struct Vertex { @builtin(position) pos: vec4f };
@vertex fn vs(@builtin(vertex_index) i:u32)->Vertex {
  let corners=array<vec2f,3>(vec2f(-1.0,-1.0),vec2f(3.0,-1.0),vec2f(-1.0,3.0));
  var out:Vertex;out.pos=vec4f(corners[i],0.0,1.0);return out;
}
fn box(p:vec2f,h:vec2f,r:f32)->f32 {
  let q=abs(p)-h+vec2f(r);
  return length(max(q,vec2f(0.0)))+min(max(q.x,q.y),0.0)-r;
}
fn band(v:f32,w:f32)->f32 { return exp(-pow(v/max(w,0.01),2.0)); }
fn door(p:vec2f,c:vec2f,a:f32)->f32 {
  let q=p-c;let ca=cos(a);let sa=sin(a);
  let local=vec2f(ca*q.x+sa*q.y,-sa*q.x+ca*q.y);
  return box(local,vec2f(15.0,27.0),2.0);
}
@fragment fn fs(@builtin(position) pixel:vec4f)->@location(0) vec4f {
  let t=clamp(p.time.x,0.0,1.0);
  let reduced=p.time.y>0.5;
  let motionT=select(t,0.46,reduced);
  let appear=smoothstep(0.02,0.13,t)*(1.0-smoothstep(0.86,1.0,t));
  let open=smoothstep(0.04,0.38,motionT)*(1.0-smoothstep(0.70,0.98,motionT));
  let q=(pixel.xy-p.viewport.zw)/max(p.scale.xy,vec2f(0.001));

  // A compact two-door records cabinet with a visible dossier interior.
  let shell=1.0-smoothstep(-0.8,1.2,box(q,vec2f(48.0,33.0),3.0));
  let rim=1.0-smoothstep(0.5,2.2,abs(box(q,vec2f(48.0,33.0),3.0)));
  let gap=18.0+open*19.0;
  let swing=0.82*open;
  let leftDoor=1.0-smoothstep(-0.5,1.4,door(q,vec2f(-gap,0.0),-swing));
  let rightDoor=1.0-smoothstep(-0.5,1.4,door(q,vec2f(gap,0.0),swing));
  let inner=1.0-smoothstep(-0.5,1.2,box(q,vec2f(20.0,28.0),1.5));
  let shelf=(band(q.y+17.0,0.9)+band(q.y,0.9)+band(q.y-17.0,0.9))*
    (1.0-smoothstep(18.0,21.0,abs(q.x)))*inner;
  let folders=(band(q.x+13.0,1.0)+band(q.x+8.0,1.0)+band(q.x-8.0,1.0)+
    band(q.x-13.0,1.0))*band(q.y+8.0,6.5)*inner;
  let scanX=-16.0+32.0*motionT;
  let scan=band(q.x-scanX,1.4)*inner*(1.0-smoothstep(0.78,0.98,t));
  let indexGlyph=band(abs(q.x)-5.0,0.7)*band(q.y-8.0,3.0)*inner;
  let reveal=smoothstep(0.16,0.48,motionT)*(1.0-smoothstep(0.62,0.90,motionT));
  let projection=band(abs(q.y)-39.0,1.15)*
    (1.0-smoothstep(35.0,51.0,abs(q.x)))*reveal;
  let outward=band(q.x,30.0)*band(q.y,41.0)*reveal*0.22;
  let lock=band(length(q-vec2f(0.0,-28.0)),3.2)*(1.0-open*0.8);
  let envelope=appear*p.time.z;

  let cabinet=vec3f(0.30,0.19,0.095)*shell*0.34+
    vec3f(0.82,0.53,0.23)*rim*0.44+
    vec3f(0.91,0.78,0.48)*(leftDoor+rightDoor)*0.17;
  let paper=vec3f(1.0,0.82,0.47)*(shelf*0.25+folders*0.20+indexGlyph*0.32);
  let archiveLight=vec3f(0.40,0.84,1.0)*(scan*0.55+projection*0.48+outward+lock*0.16);
  let source=(cabinet+paper+archiveLight)*envelope;
  let alpha=clamp((shell*0.11+rim*0.28+(leftDoor+rightDoor)*0.075+
    shelf*0.24+folders*0.18+indexGlyph*0.25+scan*0.44+
    projection*0.28+outward+lock*0.14)*envelope,0.0,0.88);
  let glow=(vec3f(0.23,0.66,0.94)*(scan*0.27+projection*0.36+outward*0.35)+
    vec3f(0.96,0.56,0.16)*rim*0.12)*envelope;
  return vec4f(min(source+glow,vec3f(alpha)),alpha);
}`;

  function plan({ effect, now, phase, camera, zoom, viewport,
    reducedMotion = false, alpha = 1 } = {}) {
    if (phase !== 'playing' || effect?.type !== EVENT_TYPE ||
        effect?.objectId !== OBJECT_ID || effect?.effectKind !== 'credits' ||
        typeof effect.id !== 'string' || !effect.id || viewport?.kind !== 'main') return null;
    if (![effect.x, effect.y, effect.startedAt, now, camera?.x, camera?.y, zoom,
      viewport.width, viewport.height, viewport.pixelWidth, viewport.pixelHeight, alpha]
      .every(finite) || effect.x !== ANCHOR.x || effect.y !== ANCHOR.y ||
        zoom <= 0 || alpha <= 0 || alpha > 1 || viewport.width <= 0 || viewport.height <= 0 ||
        !Number.isInteger(viewport.pixelWidth) || !Number.isInteger(viewport.pixelHeight) ||
        viewport.pixelWidth <= 0 || viewport.pixelHeight <= 0) return null;
    const elapsed = now - effect.startedAt;
    if (elapsed < 0 || elapsed >= DURATION_MS) return null;
    const dprX = viewport.pixelWidth / viewport.width;
    const dprY = viewport.pixelHeight / viewport.height;
    const scaleX = zoom * dprX;
    const scaleY = zoom * dprY;
    const x = (ANCHOR.x - camera.x) * scaleX;
    const y = (ANCHOR.y - camera.y) * scaleY;
    const values = new Float32Array([
      viewport.pixelWidth, viewport.pixelHeight, x, y,
      scaleX, scaleY, 0, 0,
      elapsed / DURATION_MS, reducedMotion ? 1 : 0, alpha, 0
    ]);
    if (!values.every(finite)) return null;
    return Object.freeze({ effectId: effect.id, objectId: OBJECT_ID,
      elapsed, durationMs: DURATION_MS, progress: elapsed / DURATION_MS,
      x, y, scaleX, scaleY, reducedMotion: Boolean(reducedMotion), values });
  }

  function create({ renderer, frameOwner = renderer } = {}) {
    if (!frameOwner || frameOwner.state !== 'ready' || !frameOwner.device?.createShaderModule ||
        !frameOwner.device?.queue?.writeBuffer || typeof frameOwner.own !== 'function' ||
        typeof frameOwner.release !== 'function')
      throw new TypeError('Archive cabinet E requires the shared WebGPU frame owner');
    const device = frameOwner.device;
    const format = frameOwner.format;
    const module = device.createShaderModule({ label: 'DVA archive cabinet E WGSL', code: shader });
    const bindGroupLayout = device.createBindGroupLayout({ entries: [{ binding: 0,
      visibility: 0x1 | 0x2, buffer: { type: 'uniform' } }] });
    const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] });
    const pipeline = device.createRenderPipeline({ label: 'DVA archive cabinet E',
      layout: pipelineLayout,
      vertex: { module, entryPoint: 'vs' },
      fragment: { module, entryPoint: 'fs', targets: [{ format,
        blend: { color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
          alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' } } }] },
      primitive: { topology: 'triangle-list' } });
    const slots = [];
    const frameIndices = new WeakMap();
    const frameEvents = new WeakMap();
    let destroyed = false;
    function slot(index) {
      if (slots[index]) return slots[index];
      const uniform = frameOwner.own(device.createBuffer({
        label: `DVA archive cabinet E parameters ${index}`, size: 48, usage: 0x40 | 0x08 }));
      const bindGroup = device.createBindGroup({ layout: bindGroupLayout,
        entries: [{ binding: 0, resource: { buffer: uniform } }] });
      return (slots[index] = { uniform, bindGroup });
    }
    function record({ frame, target, viewport, ...input } = {}) {
      if (destroyed || frameOwner.state !== 'ready') throw new Error('Archive cabinet E pass unavailable');
      if (!frame || typeof frame.add !== 'function' || typeof frame.stage !== 'function' ||
          typeof target !== 'string' || !target)
        throw new TypeError('Archive cabinet E requires an ordered shared frame and target');
      const command = plan({ ...input, viewport });
      if (!command) return false;
      let seen = frameEvents.get(frame);
      if (!seen) { seen = new Set(); frameEvents.set(frame, seen); }
      if (seen.has(command.effectId)) return false;
      seen.add(command.effectId);
      const index = frameIndices.get(frame) || 0;
      const { uniform, bindGroup } = slot(index);
      device.queue.writeBuffer(uniform, 0, command.values);
      frame.stage('world:archive-cabinet-e');
      frame.add({ target, label: `DVA archive cabinet E ${command.effectId}`,
        encode(pass, info) {
          if (info.device !== device || info.format !== format ||
              info.width !== viewport.pixelWidth || info.height !== viewport.pixelHeight)
            throw new Error('Archive cabinet E target device, format or backing size mismatch');
          pass.setBindGroup(0, bindGroup);
          pass.setPipeline(pipeline);
          pass.draw(3);
        } });
      frameIndices.set(frame, index + 1);
      return true;
    }
    return Object.freeze({ device, plan, record, shader, get state() {
      return destroyed ? 'destroyed' : frameOwner.state;
    }, destroy() {
      if (destroyed) return;
      destroyed = true;
      for (const { uniform } of slots) if (frameOwner.release(uniform)) uniform.destroy();
      slots.length = 0;
    } });
  }

  const api = Object.freeze({ OBJECT_ID, EVENT_TYPE, ANCHOR, DURATION_MS, shader, plan, create });
  root.DvaWebGPUArchiveCabinetE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
