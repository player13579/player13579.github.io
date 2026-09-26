/* Sunbeam clean v2. Original code/design: Codex gpt-6-astra, 2026-09-26.
 * No prior Sunbeam/E implementation used. See outputs/.../design.md.
 * Isolated candidate; no game registration or adoption implied. */
(function (root) {
  'use strict';
  const VERSION = 'sunbeam-astra-clean-v2';
  const DURATION = 2.15;
  const WGSL = `
struct Beam { endpoints: vec4f, state: vec4f, spare: vec4f }
struct Uniforms { view: vec4f, beams: array<Beam, 4> }
@group(0) @binding(0) var<uniform> u: Uniforms;
@vertex fn vs(@builtin(vertex_index) i:u32)->@builtin(position) vec4f {
 var p=array<vec2f,3>(vec2f(-1.,-1.),vec2f(3.,-1.),vec2f(-1.,3.));return vec4f(p[i],0.,1.);
}
fn g(x:f32)->f32{return exp(-x*x);}
fn rise(t:f32,a:f32,b:f32)->f32{return smoothstep(a,b,t);}
fn field(p:vec2f,b:Beam)->vec4f {
 let t=b.state.x;
 if(b.state.w<0.5||t<0.||t>=2.15){return vec4f(0.);}
 let delta=b.endpoints.zw-b.endpoints.xy;let len=length(delta);
 if(len<1.){return vec4f(0.);}
 let axis=delta/len;let d=p-b.endpoints.xy;let scale=b.state.y;
 let x=dot(d,axis)/scale;let y=dot(d,vec2f(-axis.y,axis.x))/scale;
 let lengthW=len/scale;let s=x/lengthW;
 if(x < -48. || x > lengthW+32. || abs(y)>330.) {return vec4f(0.);}
 let short=min(1.,lengthW/450.);
 let arrival=rise(t,0.10,0.32);
 let departed=rise(t,1.40,1.94);
 let sourceOn=rise(t,0.,0.13)*(1.-rise(t,1.34,1.53));
 let transportMask=(1.-rise(s,arrival-0.025,arrival+0.035))*rise(s,departed-0.025,departed+0.065);
 let inside=rise(s,-0.015,0.005)*(1.-rise(s,0.97,1.01));
 let terminal=1.-rise(s,0.74,1.04);
 let tail=(1.-rise(t,1.95,2.15));
 let open=rise(s,0.,0.085);
 let rearTaper=rise(s,departed-0.04,departed+0.11);
 // Large asymmetric opening with a quieter long body. No straight white core.
 let taper=mix(0.28,1.,terminal);
 let reduced=b.state.z>0.5;
 let p1=(t-0.20)*0.70;
 let p2=(t-0.50)*1.00;
 let w1=g((s-p1)/max(0.055,65./lengthW))*rise(t,0.17,0.27);
 let w2=g((s-p2)/max(0.11,90./lengthW))*rise(t,0.43,0.57);
 let wake=g((s-p1+0.10)/0.09)*rise(t,0.17,0.27);
 // Visible aperture responds to the two wide transport envelopes.
 let apertureResponse=1.+select(1.,0.50,reduced)*(0.88*w1+0.52*w2-0.16*wake);
 let r=(7.+21.*open)*(0.48+0.52*short)*taper*mix(0.2,1.,rearTaper)*apertureResponse;
 let volumeGate=transportMask*inside*tail*rise(t,0.09,0.22);
 let cross=y/max(r,1.);
 let chord=sqrt(max(0.,1.-cross*cross));
 let body=chord*volumeGate*(0.40+0.32*w1+0.22*w2);
 let core=g(y/(r*(0.20+0.20*w1+0.10*w2)+1.))*volumeGate*(0.045+2.7*w1+1.8*w2);
 let boundary=g((abs(y)-r*0.76)/(r*0.19+1.))*volumeGate*0.11;
 let frontAt=arrival*lengthW;
 let head=g((x-frontAt)/(17.+14.*short))*g(y/(r*1.25+3.))*rise(t,0.09,0.17)*(1.-rise(t,0.30,0.35));
 var radiance=vec3f(1.,0.50,0.07)*(body+boundary)
   +vec3f(1.,0.96,0.65)*core*1.2
   +vec3f(1.,0.88,0.38)*head*2.6;
 var trans=exp(-(body*0.35+core*0.2));
 // PH2 changes at the same spatial cause, with a wider optical response.
 let scatterWide=(14.+r*1.5+22.*rise(s,0.,0.32))*(0.55+0.45*short);
 let scatter=g(y/scatterWide)*volumeGate*(0.05+0.30*w1+0.19*w2);
 let skirt=g((y-r*1.12)/(r*0.65+12.))*volumeGate*(0.04+0.10*w2);
 radiance+=vec3f(1.,0.40,0.055)*(scatter+skirt);
 // Source: energy is visibly supplied at the explicit origin, then shuts first.
 let sourceCore=g(x/10.)*g(y/14.)*sourceOn;
 let sourceLight=g(x/32.)*g(y/45.)*sourceOn;
 let aperture=g((x-11.)/16.)*g(y/(15.+7.*rise(t,0.03,0.14)))*sourceOn;
 radiance+=vec3f(1.,0.97,0.77)*sourceCore*5.2+vec3f(1.,0.63,0.17)*(sourceLight*0.38+aperture*1.1);
 trans*=exp(-sourceCore*0.7);
 // PH3 is only available for an explicitly confirmed receiver; never infer a hit.
 if(b.spare.x>0.5){
  let hitX=x-lengthW;
  let contactOn=rise(t,0.30,0.335)*(1.-rise(t,1.94,2.13));
  var plane=0.;var reflectedCone=0.;
  var events=array<f32,3>(0.32,1.50,1.6285714);
  for(var j=0u;j<3u;j++){
   let age=t-events[j];
   let impulse=rise(age,0.,0.04)*exp(-max(0.,age)*7.5);
   let extent=(12.+88.*rise(age,0.,0.31))*(0.56+0.44*short);
   let spreading=g((abs(y)-extent)/(14.+8.*rise(age,0.,0.3)));
   let fill=g(y/extent)*0.38;
   plane+=g(hitX/10.)*(spreading+fill)*impulse;
   reflectedCone+=rise(hitX,-160.,-10.)*(1.-rise(hitX,-8.,9.))
     *g(y/(15.+abs(hitX)*0.85))*exp(hitX/100.)*impulse;
  }
  let contact=g(hitX/7.)*g(y/(r*1.2+9.))*contactOn;
  radiance+=vec3f(1.,0.94,0.67)*(plane*4.+contact*0.90)
    +vec3f(1.,0.48,0.08)*reflectedCone*0.60;
  trans*=exp(-(plane*0.35+contact*0.3));
 }
 return vec4f(radiance,1.-trans);
}
@fragment fn fs(@builtin(position) pos:vec4f)->@location(0) vec4f {
 let p=pos.xy/u.view.z;var color=vec3f(0.);var alpha=0.;
 for(var i=0u;i<4u;i++){let v=field(p,u.beams[i]);color+=v.rgb;alpha=1.-(1.-alpha)*(1.-v.a);}
 return vec4f(color,alpha);
}
`;
  const POST = `
@group(0) @binding(0) var hdr:texture_2d<f32>;
@group(0) @binding(1) var linearSampler:sampler;
@vertex fn vs(@builtin(vertex_index) i:u32)->@builtin(position) vec4f {
 var p=array<vec2f,3>(vec2f(-1.,-1.),vec2f(3.,-1.),vec2f(-1.,3.));return vec4f(p[i],0.,1.);
}
@fragment fn fs(@builtin(position) p:vec4f)->@location(0) vec4f {
 let size=vec2f(textureDimensions(hdr));let uv=p.xy/size;
 let center=textureSampleLevel(hdr,linearSampler,uv,0.);
 var halo=vec3f(0.);
 // OBS1 uses only actual PH radiance; it cannot invent a source silhouette.
 for(var j=0u;j<8u;j++){
  let theta=f32(j)*0.78539816;
  let direction=vec2f(cos(theta),sin(theta));
  let a=textureSampleLevel(hdr,linearSampler,uv+direction*4./size,0.).rgb;
  let b=textureSampleLevel(hdr,linearSampler,uv+direction*10./size,0.).rgb;
  halo+=(a*0.055+b*0.032);
 }
 let energy=center.rgb+halo*0.33;
 let rgb=vec3f(1.)-exp(-energy*1.32);
 let alpha=max(center.a,max(rgb.r,max(rgb.g,rgb.b)));
 return vec4f(rgb,alpha);
}
`;

  function checkedBeam(beam) {
    const a=beam?.start,b=beam?.end;
    if (!a || !b || ![a.x,a.y,b.x,b.y,beam.age].every(Number.isFinite)) throw new TypeError('Finite explicit start/end/age required');
    return {start:{x:a.x,y:a.y},end:{x:b.x,y:b.y},age:beam.age,scale:Number.isFinite(beam.scale)&&beam.scale>0?beam.scale:1,reducedMotion:!!beam.reducedMotion,impactConfirmed:beam.impactConfirmed===true};
  }

  async function createRenderer(canvas) {
    if(!navigator.gpu)throw new Error('WebGPU required');
    const adapter=await navigator.gpu.requestAdapter();if(!adapter)throw new Error('GPU adapter unavailable');
    const device=await adapter.requestDevice(),errors=[];
    device.addEventListener('uncapturederror',e=>errors.push(e.error.message));
    const context=canvas.getContext('webgpu');if(!context){device.destroy();throw new Error('WebGPU canvas unavailable');}
    const format=navigator.gpu.getPreferredCanvasFormat();context.configure({device,format,alphaMode:'premultiplied'});
    const module=device.createShaderModule({code:WGSL}),postModule=device.createShaderModule({code:POST});
    for(const shader of [module,postModule]){const info=await shader.getCompilationInfo();const bad=info.messages.filter(m=>m.type==='error');if(bad.length){device.destroy();throw new Error(bad.map(m=>m.message).join('\n'));}}
    const pipeline=await device.createRenderPipelineAsync({layout:'auto',vertex:{module,entryPoint:'vs'},fragment:{module,entryPoint:'fs',targets:[{format:'rgba16float'}]},primitive:{topology:'triangle-list'}});
    const postPipeline=await device.createRenderPipelineAsync({layout:'auto',vertex:{module:postModule,entryPoint:'vs'},fragment:{module:postModule,entryPoint:'fs',targets:[{format}]},primitive:{topology:'triangle-list'}});
    const buffer=device.createBuffer({size:208,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});
    const bind=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer}}]});
    const sampler=device.createSampler({magFilter:'linear',minFilter:'linear'});
    const data=new Float32Array(52);let texture=null,postBind=null,disposed=false,submitted=0;
    return {
      version:VERSION,adapterInfo:{vendor:adapter.info?.vendor,architecture:adapter.info?.architecture,device:adapter.info?.device,description:adapter.info?.description},errors,
      render(beams=[],{width=canvas.clientWidth,height=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2)}={}) {
        if(disposed)throw new Error('Renderer disposed');if(beams.length>4)throw new RangeError('At most four simultaneous Sunbeams');
        if(![width,height,dpr].every(n=>Number.isFinite(n)&&n>0))throw new TypeError('Positive viewport required');
        const pw=Math.max(1,Math.round(width*dpr)),ph=Math.max(1,Math.round(height*dpr));
        if(canvas.width!==pw||canvas.height!==ph||!texture){
          texture?.destroy();canvas.width=pw;canvas.height=ph;
          texture=device.createTexture({size:[pw,ph],format:'rgba16float',usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});
          postBind=device.createBindGroup({layout:postPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:texture.createView()},{binding:1,resource:sampler}]});
        }
        data.fill(0);data.set([width,height,dpr,beams.length]);beams.forEach((raw,i)=>{const b=checkedBeam(raw);data.set([b.start.x,b.start.y,b.end.x,b.end.y,b.age,b.scale,b.reducedMotion?1:0,1,b.impactConfirmed?1:0,0,0,0],4+i*12);});
        device.queue.writeBuffer(buffer,0,data);const encoder=device.createCommandEncoder();
        const pass=encoder.beginRenderPass({colorAttachments:[{view:texture.createView(),clearValue:{r:0,g:0,b:0,a:0},loadOp:'clear',storeOp:'store'}]});
        pass.setPipeline(pipeline);pass.setBindGroup(0,bind);pass.draw(3);pass.end();
        const postPass=encoder.beginRenderPass({colorAttachments:[{view:context.getCurrentTexture().createView(),clearValue:{r:0,g:0,b:0,a:0},loadOp:'clear',storeOp:'store'}]});
        postPass.setPipeline(postPipeline);postPass.setBindGroup(0,postBind);postPass.draw(3);postPass.end();device.queue.submit([encoder.finish()]);submitted++;
        return{submitted,ages:beams.map(b=>b.age)};
      },flush:()=>device.queue.onSubmittedWorkDone(),
      dispose(){if(disposed)return;disposed=true;texture?.destroy();buffer.destroy();context.unconfigure();device.destroy();}
    };
  }

  // Original deterministic PCM: inhaled spectral onset, pressure, solar harmonics.
  function synthesize(sampleRate=48000, impactConfirmed=false) {
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
      const emission=Math.min(1,t/0.17)*Math.exp(-Math.max(0,t-1.40)*5.8);
      phase+=2*Math.PI*(155+240*Math.exp(-t*3.2))/sampleRate;
      const harmonic=(Math.sin(phase)+0.20*Math.sin(phase*2)+0.08*Math.sin(phase*4))*0.19*emission;
      const pressure=Math.sin(2*Math.PI*72*t)*Math.exp(-Math.pow((t-0.23)/0.14,2))*0.20;
      const intake=(noise-low)*Math.exp(-Math.pow((t-0.08)/0.07,2))*0.055;
      const air=low*emission*0.23;
      let contact=0;if(impactConfirmed){for(const hit of [0.32,1.50,1.6285714]){const age=t-hit;if(age>=0)contact+=(noise*0.15+Math.sin(2*Math.PI*245*t)*0.15)*(1-Math.exp(-age*150))*Math.exp(-age*17);}}
      pcm[i]=Math.tanh((harmonic+pressure+intake+air+contact)*gate)*0.62;
    }
    pcm[pcm.length-1]=0;return pcm;
  }
  function createSound({verify=new URLSearchParams(root.location?.search||'').has('verify'),muted=false}={}){
    // URL verification cannot be overridden through options.
    const locked=verify||new URLSearchParams(root.location?.search||'').has('verify');
    let context=null,buffer=null,impactBuffer=null,disposed=false;
    const seen=new Set(),active=new Map();
    async function unlock(){
      if(locked||muted||disposed)return false;
      if(!context){context=new (root.AudioContext||root.webkitAudioContext)();buffer=context.createBuffer(1,Math.ceil(DURATION*context.sampleRate),context.sampleRate);buffer.copyToChannel(synthesize(context.sampleRate),0);impactBuffer=context.createBuffer(1,Math.ceil(DURATION*context.sampleRate),context.sampleRate);impactBuffer.copyToChannel(synthesize(context.sampleRate,true),0);}
      await context.resume();return context.state==='running';
    }
    function play(id,{impactConfirmed=false}={}){
      if(typeof id!=='string'||!id||seen.has(id)||disposed||locked||muted||context?.state!=='running')return false;
      seen.add(id);if(seen.size>256)seen.delete(seen.values().next().value);
      if(active.size>=4)return false;
      const source=context.createBufferSource(),gain=context.createGain();source.buffer=impactConfirmed?impactBuffer:buffer;gain.gain.value=0.65/Math.sqrt(active.size+1);
      source.connect(gain);gain.connect(context.destination);source.onended=()=>{source.disconnect();gain.disconnect();active.delete(id);};active.set(id,{source,gain});source.start();return true;
    }
    function cancel(id){const entry=active.get(id);if(entry){const now=context.currentTime;entry.gain.gain.cancelScheduledValues(now);entry.gain.gain.setTargetAtTime(0,now,0.008);entry.source.stop(now+0.04);active.delete(id);}}
    return {unlock,play,cancel,get locked(){return locked;},get activeCount(){return active.size;},async dispose(){if(disposed)return;disposed=true;for(const id of active.keys())cancel(id);if(context)await context.close();active.clear();}};
  }
  const api={VERSION,DURATION,WGSL,checkedBeam,createRenderer,synthesize,createSound};
  root.SunbeamAstraCleanV2=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
