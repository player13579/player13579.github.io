/* DVA finite body recovery TEs. createTiles generates a borrowed offscreen
 * WebGPU surface for the original Canvas leaf, preserving interleaved magic-
 * effect order. Original PNGs are uploaded once; masks and source-over
 * composition run in WGSL. The caller owns visibility, clock, audio,
 * placement, scheduling and the Canvas2D fallback. */
(function (root) {
  'use strict';
  const PROFILES = Object.freeze({
    stamina: Object.freeze({ layer: 0, sourceWidth: 1024, sourceHeight: 1536, width: 88, height: 132, top: -94, duration: 1180 }),
    heal: Object.freeze({ layer: 1, sourceWidth: 941, sourceHeight: 1672, width: 104, height: 1672 * 104 / 941, top: 31 - 1400 * 104 / 941, duration: 1180 }),
    mana: Object.freeze({ layer: 2, sourceWidth: 1024, sourceHeight: 1536, width: 104, height: 156, top: 31 - 1386 * 104 / 1024, duration: 1240 })
  });
  const FLOATS_PER_EFFECT = 16;
  const TEXTURE_WIDTH = 1024, TEXTURE_HEIGHT = 1672;
  const shader = /* wgsl */ `
struct Frame { size: vec4f };
struct Effect { rect: vec4f, phase: vec4f, shape: vec4f, source: vec4f };
@group(0) @binding(0) var<uniform> frame: Frame;
@group(0) @binding(1) var<storage, read> effects: array<Effect>;
@group(0) @binding(2) var sources: texture_2d_array<f32>;
@group(0) @binding(3) var sourceSampler: sampler;
@group(0) @binding(4) var bases: texture_2d_array<f32>;
struct Vertex { @builtin(position) position: vec4f, @location(0) local: vec2f, @location(1) @interpolate(flat) index: u32 };
@vertex fn vs(@builtin(vertex_index) vertex: u32, @builtin(instance_index) index: u32) -> Vertex {
  let corners = array<vec2f, 6>(vec2f(0,0),vec2f(1,0),vec2f(0,1),vec2f(0,1),vec2f(1,0),vec2f(1,1));
  let e = effects[index]; let uv = corners[vertex];
  let pos = e.rect.xy + uv * e.rect.zw;
  var out: Vertex;
  out.position = vec4f(pos / frame.size.xy * vec2f(2,-2) + vec2f(-1,1), 0, 1);
  out.local = uv * e.shape.xy; out.index = index; return out;
}
fn ease(x: f32) -> f32 { let q = 1.0 - clamp(x, 0.0, 1.0); return 1.0 - q*q*q; }
fn over(bottom: vec4f, top: vec4f) -> vec4f { return top + bottom * (1.0 - top.a); }
fn original(e: Effect, local: vec2f, offset: f32) -> vec4f {
  let sampleHeight = select(e.shape.z, e.shape.y, e.source.z > .5);
  let uv = vec2f(local.x / e.shape.x, (local.y - offset) / sampleHeight);
  let value = textureSampleLevel(sources, sourceSampler, uv * e.source.xy, i32(e.phase.x), 0.0);
  if (any(uv < vec2f(0.0)) || any(uv > vec2f(1.0))) { return vec4f(0.0); }
  return value;
}
fn baseOriginal(e: Effect, local: vec2f) -> vec4f {
  if (e.source.z < 1.5) { return original(e,local,0.0); }
  if (any(local < vec2f(0)) || local.x > e.shape.x || local.y > e.shape.z) { return vec4f(0); }
  return textureSampleLevel(bases,sourceSampler,local * e.source.w / vec2f(textureDimensions(bases)),i32(e.phase.x),0.0);
}
fn verticalMask(e: Effect, y: f32, low: f32, high: f32) -> f32 {
  let start = low * e.shape.y; let end = high * e.shape.y;
  let feather = min(13.0, max(4.0, (end - start) * 0.24));
  return clamp((y - start + feather) / feather, 0.0, 1.0) * clamp((end + feather - y) / feather, 0.0, 1.0);
}
fn manaMask(e: Effect, local: vec2f, flow: f32) -> f32 {
  // Same 24 phase fronts and authored source-local curves as the Canvas path.
  let points = array<vec2f,18>(
    vec2f(.16,.29),vec2f(.15,.35),vec2f(.22,.39),vec2f(.31,.42),vec2f(.38,.45),vec2f(.43,.475),
    vec2f(.90,.50),vec2f(.86,.46),vec2f(.79,.45),vec2f(.73,.49),vec2f(.68,.55),vec2f(.64,.605),
    vec2f(.10,.57),vec2f(.14,.66),vec2f(.25,.72),vec2f(.39,.75),vec2f(.54,.72),vec2f(.64,.605));
  let progress = min(23.0, floor(flow * 24.0)) / 23.0;
  let last = min(5u, u32(floor(progress * 6.0)));
  var alpha = 0.0;
  for (var i = 0u; i < 18u; i++) {
    let pointIndex = i % 6u;
    let leading = clamp((progress - f32(pointIndex) / 5.0 + .20) / .20, 0.0, 1.0);
    if (pointIndex <= last && leading > 0.0) {
      let radius = e.shape.x * (.23 + .05 * leading);
      let d = length(local - points[i] * e.shape.xy) / radius;
      let a = select(mix(leading * .84, 0.0, clamp((d-.58)/.42,0.0,1.0)), mix(leading,leading*.84,clamp(d/.58,0.0,1.0)), d <= .58);
      alpha = min(1.0, alpha + a);
    }
  }
  let t = clamp((progress - .72) / .28, 0.0, 1.0);
  let ambient = t*t*(3.0-2.0*t);
  return ambient + alpha * (1.0 - ambient);
}
fn maskedPixel(e: Effect, local: vec2f, offset: f32, low: f32, high: f32, flow: f32) -> vec4f {
  if (any(local < vec2f(0)) || any(local > e.shape.xy)) { return vec4f(0); }
  var mask = verticalMask(e,local.y,low,high);
  if (flow >= 0.0) { mask = manaMask(e,local,flow); }
  return original(e,local,offset) * mask;
}
fn maskedOriginal(e: Effect, local: vec2f, offset: f32, low: f32, high: f32, flow: f32) -> vec4f {
  // Canonical masks and animated scratch layers are native-sized. Interpolate
  // the masked native texels, not a high-resolution analytical mask, on zoom.
  if (e.source.z < 1.5) { return maskedPixel(e,local,offset,low,high,flow); }
  let a = floor(local - .5) + .5; let f = fract(local - .5);
  return mix(mix(maskedPixel(e,a,offset,low,high,flow),maskedPixel(e,a+vec2f(1,0),offset,low,high,flow),f.x),
             mix(maskedPixel(e,a+vec2f(0,1),offset,low,high,flow),maskedPixel(e,a+vec2f(1,1),offset,low,high,flow),f.x),f.y);
}
@fragment fn fs(in: Vertex) -> @location(0) vec4f {
  let e = effects[in.index]; let p = e.phase.y; let reduced = e.phase.z > .5; let opacity = e.phase.w;
  let release = 1.0 - ease((p - .82) / .18);
  if (e.phase.x > 1.5) {
    let appear = ease(p / .14); let gather = ease((p - .03) / .54);
    let flow = ease((p - .02) / select(.60,.70,reduced));
    var material = baseOriginal(e,in.local);
    if (flow < .999) { material = maskedOriginal(e,in.local,0.0,0.0,1.0,flow); }
    return material * (appear*release*(.84+.16*gather)*opacity);
  }
  let heal = e.phase.x > .5;
  let appear = ease(p / select(.16,.18,heal));
  let flow = ease((p - select(.10,.12,heal)) / select(.54,.48,heal));
  let settle = ease((p - select(.56,.58,heal)) / select(.32,.28,heal));
  var color = vec4f(0.0);
  if (appear*release > .001) { color = baseOriginal(e,in.local) * (appear*release*opacity); }
  let bounds = select(vec4f(.48,.20,.02,.07),vec4f(.52,.22,.02,.08),heal);
  let ends = select(vec4f(1,.78,.47,.35),vec4f(1,.84,.56,.38),heal);
  var offsets = vec4f(10*(1-appear),12*(1-flow),9*(1-flow),-4*settle);
  var strengths = vec4f(.84*appear*(1-settle*.28),.78*flow*(1-settle*.18),.72*flow,.64*settle);
  if (heal) {
    offsets = vec4f(12*(1-appear),14*(1-flow),10*(1-flow),-4*settle);
    strengths = vec4f(.8*appear*(1-settle*.22),.72*flow*(1-settle*.16),.65*flow,.56*settle);
  }
  if (reduced) {
    offsets = vec4f(0.0);
    strengths = select(vec4f(.78*appear*(1-settle*.28),.70*flow,.58*flow,.55*settle),vec4f(.72*(1-settle*.2),.64*flow,.52*flow,.48*settle),heal);
  }
  for (var i=0u; i<4u; i++) {
    let strength = strengths[i]*release;
    if (strength > .001) {
      color = over(color,maskedOriginal(e,in.local,offsets[i],bounds[i],ends[i],-1.0) * (strength*opacity));
    }
  }
  return color;
}`;

  const finite = x => typeof x === 'number' && Number.isFinite(x);
  const clamp = x => Math.max(0, Math.min(1, x));
  function packEffects(effects) {
    if (!Array.isArray(effects)) throw new TypeError('effects must be an array');
    const data = [], kinds = new Set();
    for (const effect of effects) {
      const profile = PROFILES[effect.kind];
      if (!profile) throw new TypeError('unknown body recovery kind');
      const scale = effect.scale ?? 1, duration = effect.duration ?? profile.duration, alpha = effect.alpha ?? 1;
      if (![effect.x,effect.y,scale,effect.elapsed,duration,alpha].every(finite) || scale <= 0 || duration <= 0) throw new TypeError('invalid body recovery geometry or timing');
      // Lifecycle remains admission-owned: late texture readiness never restarts an event.
      if (effect.elapsed < 0 || effect.elapsed >= duration || alpha <= 0 || effect.variant === 'desire-recovery') continue;
      const height = Math.ceil(profile.height);
      data.push(effect.x-profile.width*scale/2,effect.y+profile.top*scale,profile.width*scale,height*scale,
        profile.layer,clamp(effect.elapsed/duration),effect.reduced?1:0,clamp(alpha),
        profile.width,height,profile.height,0,profile.sourceWidth/TEXTURE_WIDTH,profile.sourceHeight/TEXTURE_HEIGHT,0,0);
      kinds.add(effect.kind);
    }
    const packed = new Float32Array(data);
    if (!packed.every(Number.isFinite)) throw new RangeError('body recovery exceeds float32 range');
    return { data: packed, kinds: [...kinds] };
  }
  function sizeForFrame(frame, maxDimension) {
    if (![frame.width,frame.height].every(finite) || frame.width <= 0 || frame.height <= 0) throw new TypeError('invalid viewport');
    const dpr = finite(frame.dpr) && frame.dpr > 0 ? frame.dpr : 1;
    const width = frame.pixelWidth ?? Math.round(frame.width*dpr), height = frame.pixelHeight ?? Math.round(frame.height*dpr);
    if (![width,height].every(finite) || width <= 0 || height <= 0) throw new TypeError('invalid backing size');
    const scale = Math.min(1,maxDimension/width,maxDimension/height);
    return {width:Math.max(1,Math.floor(width*scale)),height:Math.max(1,Math.floor(height*scale))};
  }
  function placementForTransform(transform, x = 0, y = 0) {
    if(!transform||![transform.a,transform.b,transform.c,transform.d,transform.e,transform.f,x,y].every(finite))return null;
    // DVA's world transform is uniform positive scale + translation. Other
    // transforms use the canonical leaf rather than silently changing pixels.
    if(transform.a<=0||transform.a>4||Math.abs(transform.b)>1e-8||Math.abs(transform.c)>1e-8||Math.abs(transform.a-transform.d)>1e-8)return null;
    return {pixelScale:transform.a,pixelOriginX:transform.a*x+transform.e,pixelOriginY:transform.d*y+transform.f};
  }
  async function create(canvas, options = {}) {
    let device, context, uniform, storage, texture, baseTexture, timer;
    let state = 'initializing', notified = false, cancelled = false;
    const images = new Map();
    // Only original material is resized once. Never upload an animated/masked
    // Canvas TE frame. This matches the canonical native scratch sampling.
    const adaptive = options.sourceMode === 'adaptive-prepared';
    const prepared = options.sourceMode === 'native-prepared' || adaptive;
    const textureWidth = prepared ? 104 : TEXTURE_WIDTH;
    const textureHeight = prepared ? 185 : TEXTURE_HEIGHT;
    const cleanup = () => {
      try { device?.removeEventListener?.('uncapturederror',onError); } catch (_) {}
      for (const resource of [uniform,storage,texture,baseTexture]) { try { resource?.destroy(); } catch (_) {} }
      try { context?.unconfigure(); } catch (_) {}
      try { device?.destroy(); } catch (_) {}
      images.clear();
    };
    const fail = reason => {
      if (state === 'destroyed' || state === 'failed') return;
      state = 'failed'; cancelled = true; cleanup();
      if (!notified) { notified = true; try { options.onFailure?.(reason); } catch (_) {} }
    };
    const onError = event => { event.preventDefault?.(); fail(event.error?.message || 'WebGPU validation failure'); };
    const initialize = async () => {
      const gpu = options.gpu || root.navigator?.gpu;
      if (!gpu || typeof canvas?.getContext !== 'function') throw new Error('WebGPU unavailable');
      const adapter = await gpu.requestAdapter({powerPreference:'high-performance'});
      if (cancelled) return null;
      if (!adapter) throw new Error('WebGPU adapter unavailable');
      device = await adapter.requestDevice();
      if (cancelled) { cleanup(); return null; }
      device.addEventListener?.('uncapturederror',onError);
      device.lost.then(info => fail(info?.message || 'WebGPU device lost'),error => fail(String(error)));
      if (device.limits.maxTextureDimension2D < textureHeight) throw new Error('Body texture exceeds GPU limit');
      const module = device.createShaderModule({label:'DVA body recovery WGSL',code:shader});
      if (module.getCompilationInfo) {
        const info = await module.getCompilationInfo();
        if (info.messages.some(m=>m.type==='error')) throw new Error('Body recovery WGSL compilation failed: '+info.messages.filter(m=>m.type==='error').map(m=>m.message).join('; '));
      }
      if (cancelled) { cleanup(); return null; }
      const format = gpu.getPreferredCanvasFormat();
      const pipeline = await device.createRenderPipelineAsync({label:'DVA source-local recovery',layout:'auto',vertex:{module,entryPoint:'vs'},
        fragment:{module,entryPoint:'fs',targets:[{format,blend:{color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},primitive:{topology:'triangle-list'}});
      if (cancelled) { cleanup(); return null; }
      context = canvas.getContext('webgpu');
      if (!context) throw new Error('WebGPU canvas unavailable');
      context.configure({device,format,alphaMode:'premultiplied'});
      uniform = device.createBuffer({size:16,usage:0x40|0x08});
      texture = device.createTexture({label:'Original recovery material',size:[textureWidth,textureHeight,3],format:'rgba8unorm',usage:0x04|0x02|0x10});
      if(adaptive)baseTexture=device.createTexture({label:'Scale-specific untouched recovery bases',size:[416,740,3],format:'rgba8unorm',usage:0x04|0x02|0x10});
      const sampler = device.createSampler({minFilter:'linear',magFilter:'linear',addressModeU:'clamp-to-edge',addressModeV:'clamp-to-edge'});
      let capacity=0,bindGroup;
      const ensure = count => {
        if(count<=capacity)return;
        const max=Math.min(device.limits.maxStorageBufferBindingSize,device.limits.maxBufferSize),required=Math.max(1,count)*FLOATS_PER_EFFECT*4;
        if(required>max)throw new RangeError('Body recovery batch exceeds GPU limit');
        const bytes=Math.min(max,Math.max(16*FLOATS_PER_EFFECT*4,required*2));
        const previous=storage;storage=device.createBuffer({size:bytes,usage:0x80|0x08});capacity=Math.floor(bytes/(FLOATS_PER_EFFECT*4));
        bindGroup=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:uniform}},{binding:1,resource:{buffer:storage}},{binding:2,resource:texture.createView({dimension:'2d-array'})},{binding:3,resource:sampler},{binding:4,resource:(baseTexture||texture).createView({dimension:'2d-array'})}]});
        previous?.destroy();
      };
      ensure(1); state='ready';
      return {
        get state(){return state;},
        prepareScale(kind,scale) {
          if(!adaptive)return true;
          const stored=images.get(kind),p=PROFILES[kind];
          if(state!=='ready'||!stored||!finite(scale)||scale<=0||scale>4)return false;
          if(stored.scale===scale)return true;
          try{
            const source=options.createSourceCanvas?.()||root.document?.createElement('canvas');
            source.width=Math.ceil(p.width*scale);source.height=Math.ceil(p.height*scale);
            const paint=source.getContext('2d');paint.imageSmoothingEnabled=true;paint.imageSmoothingQuality='low';
            paint.drawImage(stored.image,0,0,p.width*scale,p.height*scale);
            device.queue.copyExternalImageToTexture({source,flipY:false},{texture:baseTexture,origin:[0,0,p.layer],premultipliedAlpha:true,colorSpace:'srgb'},[source.width,source.height]);
            stored.scale=scale;return true;
          }catch(error){fail(error.message||String(error));return false;}
        },
        setTexture(kind,image) {
          if(state!=='ready')return false;
          const p=PROFILES[kind];
          if(!p || !image || image.complete===false || Number(image.naturalWidth??image.width)!==p.sourceWidth || Number(image.naturalHeight??image.height)!==p.sourceHeight)return false;
          const identity=image.currentSrc||image.src||'';
          if(images.get(kind)?.image===image && images.get(kind)?.identity===identity)return true;
          try {
            let source=image,width=p.sourceWidth,height=p.sourceHeight;
            if(prepared){
              source=options.createSourceCanvas?.()||root.document?.createElement('canvas');
              if(!source)throw new Error('Native original material preparation unavailable');
              width=p.width;height=Math.ceil(p.height);source.width=width;source.height=height;
              const paint=source.getContext('2d');if(!paint)throw new Error('Original material Canvas2D preparation unavailable');
              paint.imageSmoothingEnabled=true;paint.imageSmoothingQuality='low';
              paint.drawImage(image,0,0,p.width,p.height);
            }
            device.queue.copyExternalImageToTexture({source,flipY:false},{texture,origin:[0,0,p.layer],premultipliedAlpha:true,colorSpace:'srgb'},[width,height]);
            images.set(kind,{image,identity});return true;
          }catch(error){fail(error.message||String(error));return false;}
        },
        render(frame) {
          if(state!=='ready')return false;
          try {
            const packed=packEffects(frame.effects||[]),size=sizeForFrame(frame,device.limits.maxTextureDimension2D);
            // Missing/decode-pending source is a transient fallback, not device failure.
            if(packed.kinds.some(kind=>!images.has(kind)))return false;
            if(prepared)for(let i=0;i<packed.data.length;i+=FLOATS_PER_EFFECT){
              packed.data[i+12]=packed.data[i+8]/textureWidth;
              packed.data[i+13]=packed.data[i+9]/textureHeight;
              packed.data[i+14]=adaptive?2:1;
              packed.data[i+15]=adaptive?frame.rasterScale:0;
            }
            if(canvas.width!==size.width)canvas.width=size.width;if(canvas.height!==size.height)canvas.height=size.height;
            ensure(packed.data.length/FLOATS_PER_EFFECT||1);
            device.queue.writeBuffer(uniform,0,new Float32Array([frame.width,frame.height,size.width,size.height]));
            if(packed.data.byteLength)device.queue.writeBuffer(storage,0,packed.data);
            const encoder=device.createCommandEncoder({label:'DVA body recovery frame'});
            const pass=encoder.beginRenderPass({colorAttachments:[{view:context.getCurrentTexture().createView(),clearValue:{r:0,g:0,b:0,a:0},loadOp:'clear',storeOp:'store'}]});
            if(packed.data.byteLength){pass.setPipeline(pipeline);pass.setBindGroup(0,bindGroup);pass.draw(6,packed.data.length/FLOATS_PER_EFFECT);}
            pass.end();device.queue.submit([encoder.finish()]);return true;
          }catch(error){fail(error.message||String(error));return false;}
        },
        destroy(){if(state==='destroyed')return;state='destroyed';cancelled=true;cleanup();}
      };
    };
    const timeout=new Promise(resolve=>{timer=setTimeout(()=>{fail('Body recovery WebGPU initialization timed out');resolve(null);},options.timeoutMs??5000);});
    try{return await Promise.race([initialize().catch(error=>{fail(error.message||String(error));return null;}),timeout]);}
    finally{clearTimeout(timer);}
  }
  // The single borrowed surface must be consumed immediately before another
  // renderTile call. No event-dependent canvases/textures are retained.
  async function createTiles(canvas, options = {}) {
    const renderer=await create(canvas,{...options,sourceMode:'adaptive-prepared'});
    if(!renderer)return null;
    let serial=0;
    return {
      get state(){return renderer.state;},
      setTexture:(kind,image)=>renderer.setTexture(kind,image),
      renderTile(effect) {
        const profile=PROFILES[effect?.kind];
        if(!profile||renderer.state!=='ready')return null;
        const duration=effect.duration??profile.duration,alpha=effect.alpha??1;
        if(!finite(effect.elapsed)||!finite(duration)||duration<=0||!finite(alpha)||effect.elapsed<0||effect.elapsed>=duration||alpha<=0||effect.variant==='desire-recovery')return null;
        const pixelScale=effect.pixelScale??1;
        // Caller obtains this from the complete Canvas transform, including DPR.
        // Exceeding the bounded allocation falls back; never silently downscale.
        const originX=effect.pixelOriginX??0,originY=effect.pixelOriginY??0;
        if(!finite(pixelScale)||pixelScale<=0||pixelScale>4||!finite(originX)||!finite(originY)||!renderer.prepareScale(effect.kind,pixelScale))return null;
        // Align the borrowed surface to destination backing pixels. Otherwise
        // Canvas resamples the finished GPU image a second time at fractional
        // actor/camera positions, softening even a high-resolution base.
        const left=(Math.floor(originX-profile.width*pixelScale/2)-originX)/pixelScale;
        const top=(Math.floor(originY+profile.top*pixelScale)-originY)/pixelScale;
        const pixelWidth=Math.ceil(104*pixelScale)+2,pixelHeight=Math.ceil(185*pixelScale)+2;
        const width=pixelWidth/pixelScale,tileHeight=pixelHeight/pixelScale;
        const ok=renderer.render({width,height:tileHeight,pixelWidth,pixelHeight,rasterScale:pixelScale,
          effects:[{...effect,x:-left,y:-top,scale:1,duration,alpha}]});
        if(!ok)return null;
        return {canvas,sourceX:0,sourceY:0,sourceWidth:pixelWidth,sourceHeight:pixelHeight,
          x:left,y:top,width,height:tileHeight,serial:++serial,alphaBaked:true};
      },
      destroy:()=>renderer.destroy()
    };
  }
  const api=Object.freeze({create,createTiles,placementForTransform,packEffects,sizeForFrame,PROFILES,shader,FLOATS_PER_EFFECT});
  root.DvaWebGPUBodyBenefits=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
