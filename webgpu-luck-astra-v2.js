/* Astra clean v2. Independent implementation; see DESIGN.md for source provenance. */
(function (root) {
  'use strict';
  const VERSION = 'luck-astra-clean-v2';
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };
  function sampleLuck(elapsedMs, durationMs = 1500, reducedMotion = false) {
    if (!Number.isFinite(elapsedMs) || !Number.isFinite(durationMs) || durationMs <= 0) {
      return { phase: -1, visible: false, stage: 'inactive', reducedMotion: !!reducedMotion };
    }
    const phase = elapsedMs / durationMs;
    return { phase, visible: phase > 0 && phase < 1,
      stage: phase < 0 ? 'inactive' : phase < .14 ? 'unfold' : phase < .40 ? 'align' : phase < .91 ? 'fold' : phase < 1 ? 'receive' : 'ended',
      reducedMotion: !!reducedMotion };
  }
  const shader = /* wgsl */`
struct Settings { resolution: vec2f, phase: f32, height: f32, reduced: f32, glow: f32, reserved: vec2f };
@group(0) @binding(0) var<uniform> cfg: Settings;
@vertex fn vertex(@builtin(vertex_index) i:u32) -> @builtin(position) vec4f {
  let x = f32((i << 1u) & 2u); let y = f32(i & 2u);
  return vec4f(x*2.-1., y*2.-1., 0., 1.);
}
fn ss(a:f32,b:f32,x:f32)->f32 { return smoothstep(a,b,x); }
fn capsule(p:vec2f,a:vec2f,b:vec2f,r:f32)->f32 {
  let pa=p-a; let ba=b-a; return length(pa-ba*clamp(dot(pa,ba)/dot(ba,ba),0.,1.))-r;
}
fn bodyDistance(p:vec2f)->f32 {
  var d=length(p-vec2f(0.,-24.5))-7.5;
  d=min(d,capsule(p,vec2f(0.,-11.),vec2f(0.,6.),9.));
  d=min(d,capsule(p,vec2f(-6.,6.),vec2f(-7.,27.),4.));
  d=min(d,capsule(p,vec2f(6.,6.),vec2f(7.,27.),4.));
  d=min(d,capsule(p,vec2f(-9.,-10.),vec2f(-15.,8.),3.5));
  d=min(d,capsule(p,vec2f(9.,-10.),vec2f(15.,8.),3.5));
  return d;
}
@fragment fn fragment(@builtin(position) frag:vec4f)->@location(0) vec4f {
  let scale=cfg.height/64.;
  let p=(frag.xy-cfg.resolution*.5)/scale;
  let aa=max(.55,1./scale);
  let bodyD=bodyDistance(p);
  let body=1.-ss(-aa,aa,bodyD);
  let edge=exp(-abs(bodyD)/1.1);
  // Neutral calibration receiver; not an adopted game skin or a new E texture.
  let receiver=vec3f(.18,.22,.235)+edge*vec3f(.14,.16,.15);
  var rgb=receiver;
  let effectVisible=cfg.phase>0. && cfg.phase<1.;
  if(effectVisible) {
    let received=ss(.56,.83,cfg.phase)*(1.-ss(.87,1.,cfg.phase));
    let vertical=exp(-pow((p.y-(9.-cfg.phase*11.))/21.,2.));
    let receiveMask=exp(-abs(bodyD)/1.8)*vertical;
    rgb+=vec3f(.49,.71,.12)*receiveMask*received*.9;
    rgb+=vec3f(.12,.28,.075)*exp(-max(bodyD,0.)/4.)*vertical*received*.07*cfg.glow;
  }
  // One display transform, applied after layer compositing.
  let mapped=vec3f(1.)-exp(-rgb*1.3);
  let responseAlpha=select(0.,exp(-max(bodyD,0.)/3.)*ss(.56,.83,cfg.phase)*(1.-ss(.87,1.,cfg.phase))*.15,effectVisible);
  let alpha=max(body,responseAlpha);
  return vec4f(pow(mapped,vec3f(1./2.2))*alpha,alpha);
}`;

  const meshShader=/* wgsl */`
struct Settings { resolution: vec2f, phase: f32, height: f32, reduced: f32, glow: f32, reserved: vec2f };
@group(0) @binding(0) var<uniform> cfg: Settings;
struct Out { @builtin(position) position:vec4f, @location(0) normal:vec3f, @location(1) uv:vec2f, @location(2) age:f32, @location(3) depth:f32 };
fn capsule(p:vec2f,a:vec2f,b:vec2f,r:f32)->f32 {let pa=p-a;let ba=b-a;return length(pa-ba*clamp(dot(pa,ba)/dot(ba,ba),0.,1.))-r;}
fn bodyDistance(p:vec2f)->f32 {
  var d=length(p-vec2f(0.,-24.5))-7.5;
  d=min(d,capsule(p,vec2f(0.,-11.),vec2f(0.,6.),9.));
  d=min(d,capsule(p,vec2f(-6.,6.),vec2f(-7.,27.),4.));d=min(d,capsule(p,vec2f(6.,6.),vec2f(7.,27.),4.));
  d=min(d,capsule(p,vec2f(-9.,-10.),vec2f(-15.,8.),3.5));d=min(d,capsule(p,vec2f(9.,-10.),vec2f(15.,8.),3.5));return d;
}
@vertex fn vertex(@location(0) point:vec3f,@location(1) normal:vec3f,@location(2) uv:vec2f,@location(3) age:f32)->Out {
  var o:Out;let projected=vec2f(point.x*(1.+point.z*.004),point.y*.94-point.z*.24);
  let pixel=projected*(cfg.height/64.);
  o.position=vec4f(pixel.x/cfg.resolution.x*2.,-pixel.y/cfg.resolution.y*2.,0.,1.);
  o.normal=normal;o.uv=uv;o.age=age;o.depth=point.z;return o;
}
@fragment fn fragment(o:Out)->@location(0) vec4f {
  let u=o.uv.x;let v=o.uv.y;let age=o.age;
  let born=smoothstep(0.,.19,age);let folded=smoothstep(.40,.91,cfg.phase);
  let alive=born*(1.-smoothstep(.88,.98,cfg.phase));
  let aa=max(fwidth(v)*.85,.018);
  let cap=(1.-smoothstep(.975,1.,u))*smoothstep(0.,.025,u);
  let coverage=(1.-smoothstep(1.-aa,1.+aa,abs(v)))*alive*cap;
  let normal=normalize(o.normal);
  let facing=abs(dot(normal,normalize(vec3f(-.38,-.56,1.))));
  let thickness=pow(max(0.,1.-v*v),.65);
  let central=exp(-pow((v-.12*sin(u*5.))/.20,2.));
  let flow=exp(-pow((u-(.87-folded*.67))/.12,2.));
  let shoulder=exp(-pow((abs(v)-.79)/.14,2.));
  let root=smoothstep(.01,.17,u);let tip=1.-smoothstep(.88,1.,u);
  let jade=mix(vec3f(.014,.16,.095),vec3f(.19,.79,.36),facing*.64+thickness*.24);
  let gold=vec3f(1.,.71,.17);
  let ridge=central*(.25+.40*smoothstep(.15,.35,age))*root*tip;
  let turningEdge=shoulder*pow(facing,3.)*.43;
  let radiance=jade+gold*(ridge+flow*folded*.48+turningEdge);
  let local=(o.position.xy-cfg.resolution*.5)/(cfg.height/64.);
  let body=1.-smoothstep(-.8,.8,bodyDistance(local));
  let visibility=1.-body*(1.-smoothstep(-.8,.8,o.depth));
  let opacity=coverage*(.76+thickness*.17)*visibility;
  let mapped=pow(vec3f(1.)-exp(-radiance*1.55),vec3f(1./2.2));
  let halo=exp(-max(0.,abs(v)-1.)*7.)*(1.-coverage*.93)*alive*root*tip*.13*cfg.glow*visibility;
  return vec4f(mapped*opacity+vec3f(.21,.60,.20)*halo,opacity+halo*.3);
}`;

  function buildSurfaceVertices(phase,reducedMotion=false) {
    const steps=42, across=18;const points=new Float32Array(4*steps*across*6*9);let offset=0;
    function position(u,v,i) {
      const delay=i*.045;const t=phase-delay;
      const born=smooth(0,.19,t),align=smooth(.05,.40,phase),fold=smooth(.40+i*.025,.91,phase);
      const scatter=reducedMotion?.22:1;
      const angles=[-2.36,-.78,.88,2.22];
      const angle=angles[i]+(1-align)*(i%2?-.94:1.08)*scatter;
      const bend=.22+fold*2.72;
      const arcRadius=40/bend;
      const base=8+(1-align)*22*scatter;
      // Constant arc length, changing curvature: the tip folds over the root.
      // This is not a uniform shrink of a finished leaf image.
      const radial=base+arcRadius*Math.sin(u*bend);
      const width=18*Math.pow(Math.max(0,Math.sin(Math.PI*u)),.70)*(1-.25*u)*(.50+.50*born);
      const handed=i%2?1:-1;
      // Different longitudinal and transverse curvature create a folded volume.
      const twist=.45*Math.sin(Math.PI*u)+fold*1.48*(.25+.75*u);
      const lateral=width*v*Math.cos(twist)+Math.sin(Math.PI*u)*6*handed*(1-fold);
      const elevation=Math.sin(angle)*12*(1-fold)+arcRadius*(1-Math.cos(u*bend))+
        width*v*Math.sin(twist)+width*v*v*.26;
      return [Math.cos(angle)*radial-Math.sin(angle)*lateral,
        Math.sin(angle)*radial+Math.cos(angle)*lateral+4,
        elevation];
    }
    function vertex(u,v,i) {
      const p=position(u,v,i);const a=position(clamp(u+.002,.001,.999),v,i);const b=position(clamp(u-.002,.001,.999),v,i);
      const c=position(u,v+.002,i),d=position(u,v-.002,i);
      const x=a.map((value,k)=>value-b[k]),y=c.map((value,k)=>value-d[k]);
      let normal=[x[1]*y[2]-x[2]*y[1],x[2]*y[0]-x[0]*y[2],x[0]*y[1]-x[1]*y[0]];
      const length=Math.hypot(...normal)||1;normal=normal.map(value=>value/length);
      return [...p,...normal,u,v,phase-i*.045];
    }
    const order=[0,1,2,3].sort((a,b)=>position(.5,0,a)[2]-position(.5,0,b)[2]);
    points.backVertices=order.filter(i=>position(.5,0,i)[2]<0).length*steps*across*6;
    for(const i of order){
      const grid=[];for(let s=0;s<=steps;s++)for(let a=0;a<=across;a++)grid.push(vertex(.001+.998*s/steps,-1.55+3.1*a/across,i));
      for(let s=0;s<steps;s++)for(let a=0;a<across;a++){
        const at=s*(across+1)+a;for(const k of [at,at+across+1,at+across+2,at,at+across+2,at+1]){points.set(grid[k],offset);offset+=9;}
      }
    }
    return points;
  }

  function buildLuckSound(sampleRate = 48000, durationMs = 1500) {
    if (!Number.isFinite(sampleRate) || sampleRate < 8000 || sampleRate > 192000 || !Number.isFinite(durationMs) || durationMs < 100 || durationMs > 10000) throw new RangeError('Invalid sound dimensions');
    const count = Math.ceil(sampleRate * durationMs / 1000);
    const data = new Float32Array(count);
    const phases = [0, .4, .9];
    let seed=0x51926; let previous=0;
    for(let i=0;i<count;i++) {
      const p=i/(count-1); const t=i/sampleRate;
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      const noise=(seed/4294967296)*2-1;
      const high=noise-previous; previous=noise;
      let value=high*.014*(smooth(.01,.05,p)*(1-smooth(.12,.25,p)));
      for(let j=0;j<3;j++) {
        const delay=j===2?.055:j*.01;
        const q=p-delay;
        const base=[523.25,784.88,1046.5][j];
        const detune=[-.035,.027,-.02][j]*(1-smooth(.12,.35,q));
        phases[j]+=2*Math.PI*base*(1+detune)/sampleRate;
        const env=smooth(0,.025,q)*Math.exp(-Math.max(q,0)*3.4)*(1-smooth(.75,.98,p));
        const bright=.26*(1-smooth(.15,.57,p));
        value+=(Math.sin(phases[j])+Math.sin(phases[j]*2.003)*bright+Math.sin(phases[j]*3.997)*.075)*env*.045;
      }
      const lock=smooth(.31,.34,p)*(1-smooth(.34,.75,p));
      value+=Math.sin(2*Math.PI*392*t)*lock*.033;
      data[i]=value*smooth(0,.009,p)*(1-smooth(.96,1,p));
    }
    data[0]=0; data[count-1]=0;
    return data;
  }

  async function createRenderer(canvas, { height = 64, reducedMotion = false, onError = () => {} } = {}) {
    if(!root.navigator?.gpu) throw new Error('WebGPU is required');
    const adapter=await navigator.gpu.requestAdapter();
    if(!adapter) throw new Error('WebGPU adapter unavailable');
    const device=await adapter.requestDevice();
    const context=canvas.getContext('webgpu');
    if(!context) { device.destroy(); throw new Error('WebGPU canvas unavailable'); }
    const format=navigator.gpu.getPreferredCanvasFormat();
    const module=device.createShaderModule({code:shader});
    const info=await module.getCompilationInfo();
    const errors=info.messages.filter(m=>m.type==='error');
    if(errors.length) { device.destroy(); throw new Error(errors.map(m=>m.message).join('\n')); }
    const blend={color:{srcFactor:'one',dstFactor:'one-minus-src-alpha'},alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha'}};
    const pipeline=await device.createRenderPipelineAsync({layout:'auto',vertex:{module,entryPoint:'vertex'},fragment:{module,entryPoint:'fragment',targets:[{format,blend}]},primitive:{topology:'triangle-list'}});
    const meshModule=device.createShaderModule({code:meshShader});
    const meshInfo=await meshModule.getCompilationInfo();
    if(meshInfo.messages.some(m=>m.type==='error')){device.destroy();throw new Error(meshInfo.messages.map(m=>m.message).join('\n'));}
    const meshPipeline=await device.createRenderPipelineAsync({layout:'auto',vertex:{module:meshModule,entryPoint:'vertex',buffers:[{arrayStride:36,attributes:[{shaderLocation:0,offset:0,format:'float32x3'},{shaderLocation:1,offset:12,format:'float32x3'},{shaderLocation:2,offset:24,format:'float32x2'},{shaderLocation:3,offset:32,format:'float32'}]}]},fragment:{module:meshModule,entryPoint:'fragment',targets:[{format,blend}]},primitive:{topology:'triangle-list',cullMode:'none'}});
    const buffer=device.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});
    const bind=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer}}]});
    const meshBind=device.createBindGroup({layout:meshPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer}}]});
    const vertices=device.createBuffer({size:4*42*18*6*36,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});
    const settings=new Float32Array(8);
    let disposed=false, frames=0, configured=false;
    device.addEventListener('uncapturederror',event=>onError(event.error.message));
    device.lost.then(info=>{if(!disposed) onError('Device lost: '+info.message);});
    function draw(elapsedMs, durationMs=1500, { glow=1 }={}) {
      if(disposed) return false;
      const dpr=Math.min(root.devicePixelRatio||1,2);
      const rect=canvas.getBoundingClientRect();
      const w=Math.max(1,Math.round(rect.width*dpr)); const h=Math.max(1,Math.round(rect.height*dpr));
      if(!configured||canvas.width!==w||canvas.height!==h) {
        canvas.width=w; canvas.height=h;
        context.configure({device,format,alphaMode:'opaque'}); configured=true;
      }
      const state=sampleLuck(elapsedMs,durationMs,reducedMotion);
      settings.set([w,h,state.phase,height*dpr,reducedMotion?1:0,glow,0,0]);
      device.queue.writeBuffer(buffer,0,settings);
      const surface=state.visible?buildSurfaceVertices(state.phase,reducedMotion):null;
      if(surface)device.queue.writeBuffer(vertices,0,surface);
      const encoder=device.createCommandEncoder();
      const pass=encoder.beginRenderPass({colorAttachments:[{view:context.getCurrentTexture().createView(),clearValue:{r:.17,g:.205,b:.213,a:1},loadOp:'clear',storeOp:'store'}]});
      pass.setPipeline(pipeline); pass.setBindGroup(0,bind); pass.draw(3);
      if(surface){pass.setPipeline(meshPipeline);pass.setBindGroup(0,meshBind);pass.setVertexBuffer(0,vertices);pass.draw(4*42*18*6);}
      pass.end();
      device.queue.submit([encoder.finish()]); frames++;
      return state;
    }
    return { draw, get frames(){return frames;}, async settled(){await device.queue.onSubmittedWorkDone();},
      info:{adapter:adapter.info?{vendor:adapter.info.vendor,architecture:adapter.info.architecture,device:adapter.info.device,description:adapter.info.description}:null,shaderMessages:info.messages.map(m=>({type:m.type,message:m.message}))},
      dispose(){if(disposed)return;disposed=true;buffer.destroy();vertices.destroy();context.unconfigure();device.destroy();} };
  }

  async function mount(canvas, options={}) {
    const query=new URLSearchParams(root.location?.search||'');
    const verify=query.has('verify');
    const durationMs=Number(options.durationMs)||1500;
    const reducedMotion=options.reducedMotion??root.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
    const renderer=await createRenderer(canvas,{...options,reducedMotion});
    let disposed=false,raf=0,audioContext=null,lastSoundCycle=-1,lastCycle=-1;
    const sources=new Set();
    const start=performance.now(); const period=durationMs+1400;
    const fixed=query.has('t')?Number(query.get('t')):null;
    async function unlock() {
      if(verify||disposed) return;
      const Ctor=root.AudioContext||root.webkitAudioContext;
      if(!Ctor)return;
      audioContext ||= new Ctor();
      if(audioContext.state==='suspended') await audioContext.resume();
    }
    function sound(cycle,elapsed) {
      if(verify||!audioContext||audioContext.state!=='running'||lastSoundCycle===cycle||elapsed>80)return;
      lastSoundCycle=cycle;
      const samples=buildLuckSound(audioContext.sampleRate,durationMs);
      const buffer=audioContext.createBuffer(1,samples.length,audioContext.sampleRate);
      buffer.copyToChannel(samples,0);
      const source=audioContext.createBufferSource();source.buffer=buffer;source.connect(audioContext.destination);sources.add(source);
      source.onended=()=>{sources.delete(source);source.disconnect();};source.start();
    }
    function tick(now) {
      if(disposed)return;
      const wall=now-start; const cycle=Math.floor(wall/period);
      const elapsed=fixed!==null&&Number.isFinite(fixed)?fixed:wall%period;
      const state=renderer.draw(elapsed,durationMs);
      canvas.dataset.phase=state.phase.toFixed(4);canvas.dataset.stage=state.stage;
      if(fixed===null)sound(cycle,elapsed);
      lastCycle=cycle;
      raf=requestAnimationFrame(tick);
    }
    root.addEventListener('pointerdown',unlock,{passive:true});
    root.addEventListener('keydown',unlock);
    // Browsers that permit autoplay may start directly; browsers requiring a gesture remain silent.
    if(!verify) void unlock().catch(()=>{});
    raf=requestAnimationFrame(tick);
    const handle={renderer,verify,durationMs,get cycle(){return lastCycle;},get audioCreated(){return audioContext!==null;},
      dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);root.removeEventListener('pointerdown',unlock);root.removeEventListener('keydown',unlock);for(const source of sources){try{source.stop();}catch{}}sources.clear();if(audioContext)void audioContext.close();renderer.dispose();},
      async captureAt(ms, extra={}){cancelAnimationFrame(raf);const state=renderer.draw(ms,durationMs,extra);canvas.dataset.phase=state.phase.toFixed(4);canvas.dataset.stage=state.stage;await renderer.settled();return state;}};
    return handle;
  }
  const api={VERSION,sampleLuck,buildLuckSound,buildSurfaceVertices,createRenderer,mount};
  root.DVALuckAstraV2=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
