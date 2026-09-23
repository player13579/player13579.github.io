/* Integrated static authored field sampled and composited in
 * WGSL. Consume in the existing map stage before Canvas screen/multiply/lighter
 * overlays: a separate lower DOM canvas cannot supply their blend backdrop.
 * Caller owns the image, map identity, clock, RAF, pointer target and fallback. */
(function(root){
  'use strict';
  const finite=x=>typeof x==='number'&&Number.isFinite(x);
  function areas(map){return [...map.rooms,...map.corridors.flatMap(c=>Array.isArray(c.renderSegments)&&c.renderSegments.length?c.renderSegments:[c]),...map.doors];}
  function createGeometryMask(map,createCanvas=()=>root.document.createElement('canvas')){
    if(!Number.isInteger(map.width)||!Number.isInteger(map.height)||map.width<=0||map.height<=0)throw Error('Invalid map geometry');
    const canvas=createCanvas();canvas.width=map.width;canvas.height=map.height;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)throw Error('Geometry mask unavailable');
    ctx.beginPath();
    for(const a of areas(map)){
      if(Array.isArray(a.polygon)&&a.polygon.length>=3){ctx.moveTo(a.polygon[0][0],a.polygon[0][1]);for(let i=1;i<a.polygon.length;i++)ctx.lineTo(a.polygon[i][0],a.polygon[i][1]);ctx.closePath();}
      else ctx.rect(a.x,a.y,a.w,a.h);
    }
    ctx.fillStyle='#fff';ctx.fill(); // Same nonzero compound path as drawMap's clip.
    const rgba=ctx.getImageData(0,0,map.width,map.height).data,alpha=new Uint8Array(map.width*map.height);
    for(let i=0;i<alpha.length;i++)alpha[i]=rgba[i*4+3];
    canvas.width=canvas.height=1;return alpha;
  }
  const shader=/* wgsl */`
struct Frame { view:vec4f, camera:vec4f, map:vec4f };
@group(0) @binding(0) var<uniform> frame:Frame;
@group(0) @binding(1) var material:texture_2d<f32>;
@group(0) @binding(2) var geometry:texture_2d<f32>;
@group(0) @binding(3) var linearSampler:sampler;
@vertex fn vs(@builtin(vertex_index) id:u32)->@builtin(position) vec4f {
  let p=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3));return vec4f(p[id],0,1);
}
fn over(bottom:vec3f,top:vec4f)->vec3f{return top.rgb+bottom*(1-top.a);}
fn gridCoverage(world:f32,pixelWorld:f32)->f32{
  let cell=fract(world/96.0)*96.0;let distance=min(cell,96.0-cell);
  return clamp((.5+pixelWorld*.5-distance)/pixelWorld,0,1);
}
@fragment fn fs(@builtin(position) pixel:vec4f)->@location(0) vec4f {
  let local=pixel.xy/frame.camera.z;let world=frame.camera.xy+local;
  let outside=vec3f(205,238,250)/255.0;
  if(any(world<vec2f(0))||any(world>=frame.map.xy)){return vec4f(outside,1);}
  let uv=world/frame.map.xy;
  let cover=textureSampleLevel(geometry,linearSampler,uv,0).r;
  let extent=frame.view.xy/frame.camera.z;
  let t=clamp(dot(local,extent)/dot(extent,extent),0,1);
  let wash=mix(vec4f(vec3f(234,246,250)/255.0*.3,.3),vec4f(vec3f(76,111,130)/255.0*.12,.12),t);
  var floor=over(vec3f(200,217,225)/255.0,wash);
  let line=vec3f(57,83,99)/255.0;
  let gx=.12*gridCoverage(world.x,1.0/frame.camera.z);
  let gy=.12*gridCoverage(world.y,1.0/frame.camera.z);
  floor=mix(floor,line,gx);floor=mix(floor,line,gy);
  let source=textureSampleLevel(material,linearSampler,uv,0);
  return vec4f(mix(outside,over(floor,source),cover),1);
}`;
  async function create(canvas,options={}){
    let device,context,texture,mask,uniform,query,resolve,readback,timer;
    let status='initializing',cancelled=false,notified=false,readPending=false,lastMeasured=false;
    const resources=[];
    const cleanup=()=>{for(const r of resources){try{r.destroy();}catch(_){}}try{context?.unconfigure();}catch(_){}try{device?.removeEventListener?.('uncapturederror',onError);device?.destroy();}catch(_){}};
    const fail=reason=>{if(status==='failed'||status==='destroyed')return;status='failed';cancelled=true;cleanup();if(!notified){notified=true;try{options.onFailure?.(reason);}catch(_){}}};
    const onError=e=>{e.preventDefault?.();fail(e.error?.message||'WebGPU validation failure');};
    const own=r=>{resources.push(r);return r;};
    const initialize=async()=>{
      const gpu=options.gpu||root.navigator?.gpu;if(!gpu)throw Error('WebGPU unavailable');
      const map=options.map,image=options.image;
      if(!map||!image||image.complete===false||Number(image.naturalWidth??image.width)!==map.width||Number(image.naturalHeight??image.height)!==map.height)throw Error('Authored image/geometry mismatch');
      const adapter=await gpu.requestAdapter({powerPreference:'high-performance'});if(cancelled)return null;if(!adapter)throw Error('WebGPU adapter unavailable');
      const timing=Boolean(options.timestamps&&adapter.features.has('timestamp-query'));
      device=await adapter.requestDevice({requiredFeatures:timing?['timestamp-query']:[]});if(cancelled){cleanup();return null;}
      device.addEventListener?.('uncapturederror',onError);device.lost.then(x=>fail(x.message||'WebGPU device lost'),e=>fail(String(e)));
      if(Math.max(map.width,map.height)>device.limits.maxTextureDimension2D)throw Error('Authored map exceeds GPU limit');
      const module=device.createShaderModule({label:'DVA authored field shader',code:shader});
      if(module.getCompilationInfo){const info=await module.getCompilationInfo();const errors=info.messages.filter(x=>x.type==='error');if(errors.length)throw Error(errors.map(x=>x.message).join('; '));}
      const format=gpu.getPreferredCanvasFormat();
      const pipeline=await device.createRenderPipelineAsync({layout:'auto',vertex:{module,entryPoint:'vs'},fragment:{module,entryPoint:'fs',targets:[{format}]},primitive:{topology:'triangle-list'}});
      if(cancelled){cleanup();return null;}
      context=canvas.getContext('webgpu');if(!context)throw Error('WebGPU canvas unavailable');context.configure({device,format,alphaMode:'opaque'});
      uniform=own(device.createBuffer({size:48,usage:0x40|0x08}));
      texture=own(device.createTexture({label:'Unchanged 4800x3400 authored map',size:[map.width,map.height],format:'rgba8unorm',usage:0x04|0x02|0x10}));
      mask=own(device.createTexture({label:'Once-created room corridor door coverage',size:[map.width,map.height],format:'r8unorm',usage:0x04|0x02}));
      device.queue.copyExternalImageToTexture({source:image},{texture,premultipliedAlpha:true,colorSpace:'srgb'},[map.width,map.height]);
      const alpha=options.mask||createGeometryMask(map,options.createCanvas);
      if(alpha.byteLength!==map.width*map.height)throw Error('Geometry mask size mismatch');
      device.queue.writeTexture({texture:mask},alpha,{bytesPerRow:map.width},[map.width,map.height]);
      const sampler=device.createSampler({minFilter:'linear',magFilter:'linear',addressModeU:'clamp-to-edge',addressModeV:'clamp-to-edge'});
      const bind=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:uniform}},{binding:1,resource:texture.createView()},{binding:2,resource:mask.createView()},{binding:3,resource:sampler}]});
      if(timing){query=own(device.createQuerySet({type:'timestamp',count:2}));resolve=own(device.createBuffer({size:16,usage:0x200|0x04}));readback=own(device.createBuffer({size:16,usage:0x01|0x08}));}
      status='ready';
      return {
        get state(){return status;},get timestamps(){return timing;},get canvas(){return canvas;},
        render(frame){
          if(status!=='ready')return false;
          const {width,height,cameraX,cameraY,zoom}=frame;
          if(![width,height,cameraX,cameraY,zoom].every(finite)||!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||zoom<=0||Math.max(width,height)>device.limits.maxTextureDimension2D)return false;
          try{
            if(canvas.width!==width)canvas.width=width;if(canvas.height!==height)canvas.height=height;
            device.queue.writeBuffer(uniform,0,new Float32Array([width,height,0,0,cameraX,cameraY,zoom,0,map.width,map.height,0,0]));
            const encoder=device.createCommandEncoder();const measured=timing&&frame.measureGpu&&!readPending;
            const descriptor={colorAttachments:[{view:context.getCurrentTexture().createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:'clear',storeOp:'store'}]};
            if(measured)descriptor.timestampWrites={querySet:query,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1};
            const pass=encoder.beginRenderPass(descriptor);pass.setPipeline(pipeline);pass.setBindGroup(0,bind);pass.draw(3);pass.end();
            if(measured){encoder.resolveQuerySet(query,0,2,resolve,0);encoder.copyBufferToBuffer(resolve,0,readback,0,16);}
            device.queue.submit([encoder.finish()]);lastMeasured=measured;return true;
          }catch(e){fail(e.message||String(e));return false;}
        },
        async readGpuMilliseconds(){
          if(!lastMeasured||readPending||status!=='ready')return null;lastMeasured=false;readPending=true;
          try{await readback.mapAsync(1);const v=new BigUint64Array(readback.getMappedRange());const ms=Number(v[1]-v[0])/1e6;readback.unmap();return ms;}catch(_){return null;}finally{readPending=false;}
        },
        destroy(){if(status==='destroyed')return;status='destroyed';cancelled=true;cleanup();}
      };
    };
    const timeout=new Promise(r=>{timer=setTimeout(()=>{fail('Field initialization timeout');r(null);},options.timeoutMs??10000);});
    try{return await Promise.race([initialize().catch(e=>{fail(e.message||String(e));return null;}),timeout]);}finally{clearTimeout(timer);}
  }
  const api=Object.freeze({create,createGeometryMask,areas,shader});root.DvaWebGPUFieldStatic=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
