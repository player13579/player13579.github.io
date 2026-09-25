/* Sunbeam clean v1. Original code/design: Codex gpt-6-astra, 2026-09-26.
 * No prior Sunbeam/E implementation used. See outputs/.../design.md.
 * Isolated candidate; no game registration or adoption implied. */
(function (root) {
  'use strict';
  const VERSION = 'sunbeam-astra-clean-v1';
  const DURATION = 1.70;
  const WGSL = `
struct Beam { endpoints: vec4f, state: vec4f, spare: vec4f }
struct Uniforms { view: vec4f, beams: array<Beam, 4> }
@group(0) @binding(0) var<uniform> u: Uniforms;
@vertex fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
  var p = array<vec2f,3>(vec2f(-1.,-1.),vec2f(3.,-1.),vec2f(-1.,3.));
  return vec4f(p[i],0.,1.);
}
fn bell(x:f32) -> f32 { return exp(-x*x); }
fn gate(t:f32, a:f32, b:f32) -> f32 { return smoothstep(a,b,t); }
// PH1: independently shaped supply, finite transported field and boundary.
fn sun(p:vec2f, b:Beam) -> vec4f {
  let t = b.state.x;
  if (b.state.w < 0.5 || t < 0.0 || t >= 1.70) { return vec4f(0.); }
  let delta = b.endpoints.zw-b.endpoints.xy;
  let len = length(delta);
  if (len < 1.0) { return vec4f(0.); }
  let axis = delta / len;
  let d = p-b.endpoints.xy;
  let x = dot(d,axis);
  let y = dot(d,vec2f(-axis.y,axis.x));
  let s = x/len;
  let scale = b.state.y;
  let shortness = min(1.0, len/(500.0*scale));
  let unit = scale * (0.25+0.75*shortness);
  let front = gate(t,0.065,0.27);
  let rear = gate(t,1.12,1.58);
  let spatial = gate(s,-0.008,0.009) * (1.-gate(s,0.965,1.005));
  let travel = (1.-gate(s,front-0.025,front+0.035)) * gate(s,rear-0.035,rear+0.015);
  let sustain = gate(t,0.025,0.13)*(1.-gate(t,1.56,1.70));
  let body = spatial*travel*sustain;
  // Wide near-field opening folds into a quieter narrow far-field, not a cylinder.
  let shoulder = pow(max(0.0,sin(clamp(s,0.,1.)*3.14159265)),0.72);
  let releaseTaper = gate(s,rear-0.02,rear+0.12);
  let width = unit*(2.0+55.0*shoulder*exp(-s*0.8))*mix(0.14,1.,releaseTaper);
  let motion = select(t*2.6,0.65,b.state.z>0.5);
  let fold = sin(s*5.2-motion)*shoulder;
  let upper = -width*(0.85+0.20*fold);
  let lower = width*(0.50+0.17*sin(s*3.9+0.6));
  // Mesoscopic surfaces have unequal thickness and a dark transparent channel.
  let sheetA = bell((y-upper)/(unit*(2.2+10.0*shoulder)));
  let sheetB = bell((y-lower)/(unit*(2.5+7.4*shoulder)));
  let center = width*(-0.20+0.25*sin(s*5.4-motion*0.5));
  let pulseAt = select(t*0.72-0.10,0.50,b.state.z>0.5);
  let pulse = bell((s-pulseAt)/0.19);
  let coreWidth = unit*(1.1+11.0*shoulder*(0.45+0.75*pulse))*mix(0.2,1.,releaseTaper);
  let core = bell((y-center)/coreWidth);
  let interior = bell(y/(width*0.85+unit))*0.12;
  // Low-frequency transport corrugation: broad luminance changes, no sparkles.
  let packet = 0.72 + 0.28*pow(0.5+0.5*cos(s*11.0-motion*3.0),2.0);
  let boundary = pow(1.-gate(s,0.72,1.01),0.65);
  let surface = (sheetA*1.65+sheetB*0.80)*packet*body;
  let lumen = core*(0.70+3.2*pulse)*body;
  let volume = interior*body;
  // L1 supply fans attach at x=0; not an unattached radial source dot.
  let a = x/(max(1.,42.*unit));
  let supplyTime = gate(t,0.,0.085)*(1.-gate(t,1.06,1.18));
  let supplyMask = gate(a,-0.08,0.02)*(1.-gate(a,0.75,1.25));
  let fanW = unit*(1.4+12.0*sqrt(max(a,0.)));
  let supply = (bell((y-fanW)/(3.0*unit))+bell((y+fanW*0.72)/(2.4*unit))) * supplyMask*supplyTime;
  // OBS1: analytic local spread bound to the same actual emission support.
  let nearLight = (bell(y/(width+14.*unit))*0.24*body
    + bell(y/(14.*unit))*supplyMask*supplyTime*0.14);
  let warm = vec3f(1.0,0.44,0.075);
  let honey = vec3f(1.0,0.72,0.24);
  let white = vec3f(1.0,0.94,0.69);
  let radiance = warm*(surface+nearLight)+honey*(volume+supply*1.9+core*0.6*body)+white*lumen;
  let density = min(1.,surface*0.45 + lumen*0.15 + supply*0.50 + nearLight);
  return vec4f(radiance,density);
}
@fragment fn fs(@builtin(position) pos:vec4f) -> @location(0) vec4f {
  let p = pos.xy/u.view.z;
  var radiance=vec3f(0.); var coverage=0.;
  for(var i=0u; i<4u; i++) {
    let v=sun(p,u.beams[i]); radiance+=v.rgb; coverage=1.-(1.-coverage)*(1.-v.a);
  }
  // One exposure after the field sum avoids white additive rectangles at overlap.
  let rgb=vec3f(1.)-exp(-radiance);
  let alpha=max(coverage,max(rgb.r,max(rgb.g,rgb.b)));
  return vec4f(rgb,alpha);
}`;

  function checkedBeam(beam) {
    const a=beam?.start,b=beam?.end;
    if (!a || !b || ![a.x,a.y,b.x,b.y,beam.age].every(Number.isFinite)) throw new TypeError('Finite explicit start/end/age required');
    return {start:{x:a.x,y:a.y},end:{x:b.x,y:b.y},age:beam.age,scale:Number.isFinite(beam.scale)&&beam.scale>0?beam.scale:1,reducedMotion:!!beam.reducedMotion};
  }
  async function createRenderer(canvas) {
    if (!navigator.gpu) throw new Error('WebGPU required');
    const adapter=await navigator.gpu.requestAdapter();
    if(!adapter) throw new Error('WebGPU adapter unavailable');
    const device=await adapter.requestDevice();
    const errors=[]; device.addEventListener('uncapturederror',e=>errors.push(e.error.message));
    const context=canvas.getContext('webgpu');
    if(!context){device.destroy();throw new Error('WebGPU canvas unavailable');}
    const format=navigator.gpu.getPreferredCanvasFormat();
    context.configure({device,format,alphaMode:'premultiplied'});
    const module=device.createShaderModule({code:WGSL});
    const compilation=await module.getCompilationInfo();
    const failures=compilation.messages.filter(m=>m.type==='error');
    if(failures.length){device.destroy();throw new Error(failures.map(m=>m.message).join('\n'));}
    const pipeline=await device.createRenderPipelineAsync({layout:'auto',vertex:{module,entryPoint:'vs'},fragment:{module,entryPoint:'fs',targets:[{format}]},primitive:{topology:'triangle-list'}});
    const buffer=device.createBuffer({size:208,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});
    const bind=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer}}]});
    let disposed=false,submitted=0;
    const data=new Float32Array(52);
    return {
      version:VERSION,adapterInfo:{vendor:adapter.info?.vendor,architecture:adapter.info?.architecture,device:adapter.info?.device,description:adapter.info?.description},errors,
      render(beams=[],{width=canvas.clientWidth,height=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2)}={}) {
        if(disposed) throw new Error('Renderer disposed');
        if(beams.length>4) throw new RangeError('At most four simultaneous Sunbeams');
        if(![width,height,dpr].every(n=>Number.isFinite(n)&&n>0)) throw new TypeError('Positive viewport required');
        const pw=Math.max(1,Math.round(width*dpr)),ph=Math.max(1,Math.round(height*dpr));
        if(canvas.width!==pw)canvas.width=pw;if(canvas.height!==ph)canvas.height=ph;
        data.fill(0); data.set([width,height,dpr,beams.length]);
        beams.forEach((raw,i)=>{const b=checkedBeam(raw);data.set([b.start.x,b.start.y,b.end.x,b.end.y,b.age,b.scale,b.reducedMotion?1:0,1],4+i*12);});
        device.queue.writeBuffer(buffer,0,data);
        const encoder=device.createCommandEncoder();
        const pass=encoder.beginRenderPass({colorAttachments:[{view:context.getCurrentTexture().createView(),clearValue:{r:0,g:0,b:0,a:0},loadOp:'clear',storeOp:'store'}]});
        pass.setPipeline(pipeline);pass.setBindGroup(0,bind);pass.draw(3);pass.end();device.queue.submit([encoder.finish()]);submitted++;
        return {submitted,ages:beams.map(b=>b.age)};
      },
      flush:()=>device.queue.onSubmittedWorkDone(),
      dispose(){if(disposed)return;disposed=true;buffer.destroy();context.unconfigure();device.destroy();}
    };
  }

  // Original deterministic PCM: inhaled spectral onset, pressure, solar harmonics.
  function synthesize(sampleRate=48000) {
    if(!Number.isFinite(sampleRate)||sampleRate<8000||sampleRate>192000) throw new RangeError('Unsupported sample rate');
    const pcm=new Float32Array(Math.ceil(DURATION*sampleRate));
    let seed=19760926, low=0,phase=0;
    for(let i=0;i<pcm.length;i++){
      const t=i/sampleRate;
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      const noise=seed/2147483648-1;
      low+=0.10*(noise-low);
      const attack=Math.min(1,t/0.04),tail=Math.max(0,Math.min(1,(DURATION-t)/0.16));
      const gate=attack*attack*tail*tail;
      const emission=Math.min(1,t/0.17)*Math.exp(-Math.max(0,t-1.08)*4.8);
      phase+=2*Math.PI*(180+160*Math.exp(-t*3))/sampleRate;
      const harmonic=(Math.sin(phase)+0.20*Math.sin(phase*2)+0.08*Math.sin(phase*4))*0.19*emission;
      const pressure=Math.sin(2*Math.PI*72*t)*Math.exp(-Math.pow((t-0.18)/0.16,2))*0.20;
      const intake=(noise-low)*Math.exp(-Math.pow((t-0.08)/0.07,2))*0.055;
      const air=low*emission*0.23;
      pcm[i]=Math.tanh((harmonic+pressure+intake+air)*gate)*0.62;
    }
    pcm[pcm.length-1]=0;return pcm;
  }
  function createSound({verify=new URLSearchParams(root.location?.search||'').has('verify'),muted=false}={}){
    // URL verification cannot be overridden through options.
    const locked=verify||new URLSearchParams(root.location?.search||'').has('verify');
    let context=null,buffer=null,disposed=false;
    const seen=new Set(),active=new Map();
    async function unlock(){
      if(locked||muted||disposed)return false;
      if(!context){context=new (root.AudioContext||root.webkitAudioContext)();buffer=context.createBuffer(1,Math.ceil(DURATION*context.sampleRate),context.sampleRate);buffer.copyToChannel(synthesize(context.sampleRate),0);}
      await context.resume();return context.state==='running';
    }
    function play(id){
      if(typeof id!=='string'||!id||seen.has(id)||disposed||locked||muted||context?.state!=='running')return false;
      seen.add(id);if(seen.size>256)seen.delete(seen.values().next().value);
      if(active.size>=4)return false;
      const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;gain.gain.value=0.65/Math.sqrt(active.size+1);
      source.connect(gain);gain.connect(context.destination);source.onended=()=>{source.disconnect();gain.disconnect();active.delete(id);};active.set(id,{source,gain});source.start();return true;
    }
    function cancel(id){const entry=active.get(id);if(entry){const now=context.currentTime;entry.gain.gain.cancelScheduledValues(now);entry.gain.gain.setTargetAtTime(0,now,0.008);entry.source.stop(now+0.04);active.delete(id);}}
    return {unlock,play,cancel,get locked(){return locked;},get activeCount(){return active.size;},async dispose(){if(disposed)return;disposed=true;for(const id of active.keys())cancel(id);if(context)await context.close();active.clear();}};
  }
  const api={VERSION,DURATION,WGSL,checkedBeam,createRenderer,synthesize,createSound};
  root.SunbeamAstraCleanV1=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
