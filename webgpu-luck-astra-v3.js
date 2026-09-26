/* Luck v3: an independently authored branching / selection / arrival experiment. */
(function(global){
  'use strict';
  const EDITION='luck-astra-clean-v3';
  const sat=x=>Math.min(1,Math.max(0,x));
  function ease(a,b,x){const n=sat((x-a)/(b-a));return n*n*(3-2*n);}
  const PATHS=[
    [[-45,-8,0],[-55,-39,-20],[-42,-64,-16],[-17,-62,0]],
    [[-45,-8,0],[-39,38,15],[23,60,25],[55,34,7]],
    [[-45,-8,0],[-10,-78,4],[66,-60,22],[-1,-3,24]],
    [[-78,12,-8],[-67,10,-5],[-56,-7,-1],[-45,-8,0]]
  ];
  function bezier(controls,t){const a=1-t;return [0,1,2].map(k=>a*a*a*controls[0][k]+3*a*a*t*controls[1][k]+3*a*t*t*controls[2][k]+t*t*t*controls[3][k]);}
  function unit(v){const l=Math.hypot(...v)||1;return v.map(x=>x/l);}
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  function makeGeometry(reduced=false){
    const triangles=[];const lengthSteps=128,ringSteps=16;
    for(let id=0;id<4;id++){
      const controls=PATHS[id].map(p=>reduced?[p[0]*.76,p[1]*.76,p[2]*.76]:p);
      const grid=[];
      for(let n=0;n<=lengthSteps;n++){
        const t=n/lengthSteps,center=bezier(controls,t),ahead=bezier(controls,Math.min(1,t+.001)),behind=bezier(controls,Math.max(0,t-.001));
        const tangent=unit(ahead.map((x,k)=>x-behind[k]));const side=unit(cross(tangent,[0,0,1]));const up=unit(cross(side,tangent));
        for(let j=0;j<=ringSteps;j++){
          const a=j/ringSteps*Math.PI*2;const normal=side.map((x,k)=>x*Math.cos(a)+up[k]*Math.sin(a));
          const radius=(id===2?6.7:id===3?4.5:6.4)*(.50+.50*Math.pow(Math.sin(Math.PI*t),.8));
          grid.push([...center,...normal,t,id,radius,0]);
        }
      }
      for(let n=0;n<lengthSteps;n++)for(let j=0;j<ringSteps;j++){
        const q=n*(ringSteps+1)+j;
        for(const indices of [[q,q+ringSteps+1,q+ringSteps+2],[q,q+ringSteps+2,q+1]]){
          const vertices=indices.map(k=>grid[k]);const z=vertices.reduce((sum,v)=>sum+v[2]+v[1]*.35,0)/3;
          triangles.push({vertices,z});
        }
      }
    }
    triangles.sort((a,b)=>a.z-b.z);
    const data=new Float32Array(triangles.length*3*10*2);let offset=0;
    for(const halo of [1,0])for(const tri of triangles)for(const v of tri.vertices){data.set(v,offset);data[offset+9]=halo;offset+=10;}
    return data;
  }
  function phaseAt(ms,duration=1500){
    if(!Number.isFinite(ms)||!Number.isFinite(duration)||duration<=0)return {p:-1,stage:'inactive',visible:false};
    const p=ms/duration;
    return {p,visible:p>0&&p<1,stage:p<0?'inactive':p<.16?'branch':p<.38?'possibilities':p<.54?'selection':p<.83?'passage':p<.96?'arrival':p<1?'release':'ended'};
  }
  const WGSL=/* wgsl */`
struct Frame { viewport:vec2f, phase:f32, actorHeight:f32, halo:f32, spare:vec3f };
@group(0) @binding(0) var<uniform> f:Frame;
fn segment(p:vec2f,a:vec2f,b:vec2f,r:f32)->f32{let ab=b-a;return length(p-a-ab*clamp(dot(p-a,ab)/dot(ab,ab),0.,1.))-r;}
fn receiver(p:vec2f)->f32{
  var d=length(p-vec2f(0.,-25.))-7.;
  let q=abs(p-vec2f(0.,-3.))-vec2f(8.,12.);d=min(d,length(max(q,vec2f(0.)))+min(max(q.x,q.y),0.)-2.);
  d=min(d,segment(p,vec2f(-6.,8.),vec2f(-7.,28.),3.5));d=min(d,segment(p,vec2f(6.,8.),vec2f(7.,28.),3.5));
  d=min(d,segment(p,vec2f(-9.,-11.),vec2f(-16.,7.),3.));d=min(d,segment(p,vec2f(9.,-11.),vec2f(16.,7.),3.));return d;
}
@vertex fn screenVertex(@builtin(vertex_index) index:u32)->@builtin(position) vec4f{
  let corners=array<vec2f,3>(vec2f(-1.,-1.),vec2f(3.,-1.),vec2f(-1.,3.));return vec4f(corners[index],0.,1.);
}
@fragment fn receiverFragment(@builtin(position) pixel:vec4f)->@location(0) vec4f{
  let p=(pixel.xy-f.viewport*.5)/(f.actorHeight/64.);
  let d=receiver(p);let mask=1.-smoothstep(-.6,.6,d);
  let edge=exp(-abs(d)/1.2);
  let receiving=smoothstep(.80,.87,f.phase)*(1.-smoothstep(.91,1.,f.phase));
  let arrivalBand=exp(-pow((p.x*.66+p.y*.74+3.)/7.,2.))*exp(-dot(p,p)/560.);
  let response=vec3f(1.,.56,.12)*receiving*(arrivalBand*.50+edge*arrivalBand*.43);
  let bodyColor=vec3f(.25,.28,.31)+edge*.09+response;
  let alpha=max(mask,edge*arrivalBand*receiving*.25);
  return vec4f(bodyColor*alpha,alpha);
}
struct TubeOut { @builtin(position) position:vec4f, @location(0) normal:vec3f, @location(1) uv:vec2f, @location(2) halo:f32, @location(3) depth:f32 };
fn pulse(t:f32,p:f32)->f32{
  let head=smoothstep(.48,.84,p);
  let tail=smoothstep(.60,.95,p);
  return smoothstep(t-.045,t+.035,head)*(1.-smoothstep(t-.035,t+.035,tail))*smoothstep(.46,.53,p);
}
@vertex fn tubeVertex(@location(0) center:vec3f,@location(1) normal:vec3f,@location(2) uv:vec2f,@location(3) radius:f32,@location(4) halo:f32)->TubeOut{
  let moving=pulse(uv.x,f.phase);
  let channel=1.-smoothstep(.52,.68,f.phase);
  let boost=select(1.,channel+sqrt(moving)*1.80,uv.y>1.5&&uv.y<2.5);
  var extent=smoothstep(.09,.31,f.phase);
  if(uv.y<1.5){extent=min(extent,1.-smoothstep(.38+uv.y*.025,.55+uv.y*.025,f.phase));}
  if(uv.y>2.5){extent=smoothstep(.005,.095,f.phase);}
  let cap=select(sqrt(smoothstep(0.,.055,extent-uv.x)),1.,uv.y>2.5&&extent>.99);
  let flowVolume=.84+.16*sin(uv.x*11.-f.phase*7.+uv.y*1.4);
  let r=radius*boost*cap*flowVolume*select(1.,1.85,halo>.5);
  let position=center+normal*r;
  let projected=vec2f(position.x,position.y*.9396926-position.z*.3420201);
  let pixel=projected*(f.actorHeight/64.);
  var o:TubeOut;o.position=vec4f(pixel.x*2./f.viewport.x,-pixel.y*2./f.viewport.y,0.,1.);
  o.normal=normal;o.uv=uv;o.halo=halo;o.depth=position.z*.9396926+position.y*.3420201;return o;
}
@fragment fn tubeFragment(o:TubeOut)->@location(0) vec4f{
  let t=o.uv.x;let id=o.uv.y;let p=f.phase;
  if(p<=0.||p>=1.){discard;}
  let growth=smoothstep(.09,.31,p);
  let grown=1.-smoothstep(growth-.02,growth+.02,t);
  let onset=smoothstep(.005,.06,p);
  let moving=pulse(t,p);
  let selected=id>1.5&&id<2.5;
  var opacity=0.;var warmth=0.;
  if(id>2.5){let rootGrowth=smoothstep(.005,.095,p);opacity=(1.-smoothstep(rootGrowth-.02,rootGrowth+.02,t))*onset*(1.-smoothstep(.44,.58,p))*.62;}
  else if(selected){
    let oldChannel=grown*onset*(1.-smoothstep(.52,.68,p))*.63;
    opacity=max(oldChannel,moving*.92)*(1.-smoothstep(.93,.985,p));
    warmth=smoothstep(.36,.51,p);
  }else{
    let end=1.-smoothstep(.38+id*.025,.55+id*.025,p);
    opacity=grown*onset*(1.-smoothstep(end-.025,end+.025,t))*.63;
  }
  let endCap=smoothstep(0.,.025,t)*(1.-smoothstep(.975,1.,t));
  opacity*=endCap;
  let pixel=(o.position.xy-f.viewport*.5)/(f.actorHeight/64.);
  let body=1.-smoothstep(-.5,.5,receiver(pixel));
  let visible=1.-body*(1.-smoothstep(-.65,.65,o.depth));
  opacity*=visible;
  let n=normalize(o.normal);let depthThrough=abs(dot(n,vec3f(0.,.3420201,.9396926)));
  let palette=mix(vec3f(.27,.56,.73),vec3f(1.,.54,.105),warmth);
  // An emissive volume approximation: view-ray thickness controls opacity,
  // while a narrower internal radiance spine remains a distinct distribution.
  let volume=1.-exp(-2.65*depthThrough);
  let meso=.86+.14*sin(t*11.-p*7.+id*1.4);
  let lit=palette*(.65+depthThrough*.65)+mix(vec3f(.48,.83,1.),vec3f(1.,.97,.81),warmth)*pow(depthThrough,3.)*(.20+.64*warmth)*meso;
  if(o.halo>.5){let a=opacity*.16*sqrt(depthThrough)*f.halo;return vec4f(palette*a*1.6,a*.22);}
  return vec4f(lit*opacity*volume,opacity*volume);
}`;

  function soundSamples(rate=48000,durationMs=1500){
    if(!Number.isFinite(rate)||rate<8000||rate>192000||!Number.isFinite(durationMs)||durationMs<100||durationMs>10000)throw new RangeError('Invalid SFX duration or sample rate');
    const seconds=durationMs/1000,length=Math.ceil(rate*seconds),samples=new Float32Array(length);
    const strikes=[{p:.075,g:.027,f:[641,1093,1829],d:.085},{p:.255,g:.023,f:[713,1217,2081],d:.072},{p:.415,g:.038,f:[863,1541],d:.05},{p:.485,g:.027,f:[1021,1687],d:.043},{p:.805,g:.072,f:[392,784,1176,1960],d:.15}];
    let random=0x3ad75291,filtered=0;
    for(let i=0;i<length;i++){
      const time=i/rate,p=time/seconds;random^=random<<13;random^=random>>>17;random^=random<<5;
      const noise=(random>>>0)/2147483648-1;filtered=.91*filtered+.09*noise;
      let sum=filtered*.14*ease(.40,.53,p)*(1-ease(.72,.84,p));
      for(const strike of strikes){const age=time-strike.p*seconds;if(age<0)continue;const gate=ease(0,.005,age)*Math.exp(-age/strike.d);
        for(let k=0;k<strike.f.length;k++)sum+=Math.sin(2*Math.PI*strike.f[k]*age)*gate*strike.g/(1+k*1.1);
      }
      samples[i]=sum*ease(0,.005,p)*(1-ease(.95,1,p));
    }
    samples[0]=0;samples[length-1]=0;return samples;
  }

  async function attach(canvas,{height=100,durationMs=1500,reduced=false,onError=()=>{}}={}){
    if(!global.navigator?.gpu)throw new Error('WebGPU が必要です');
    const adapter=await navigator.gpu.requestAdapter();if(!adapter)throw new Error('GPU adapter unavailable');
    const gpu=await adapter.requestDevice();const target=canvas.getContext('webgpu');if(!target){gpu.destroy();throw new Error('WebGPU canvas unavailable');}
    const format=navigator.gpu.getPreferredCanvasFormat();const module=gpu.createShaderModule({code:WGSL});
    const compilation=await module.getCompilationInfo();const errors=compilation.messages.filter(m=>m.type==='error');if(errors.length){gpu.destroy();throw new Error(errors.map(e=>e.message).join('\n'));}
    const blending={color:{srcFactor:'one',dstFactor:'one-minus-src-alpha'},alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha'}};
    const uniform=gpu.createBuffer({size:48,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});
    const receiverPipeline=await gpu.createRenderPipelineAsync({layout:'auto',vertex:{module,entryPoint:'screenVertex'},fragment:{module,entryPoint:'receiverFragment',targets:[{format,blend:blending}]},multisample:{count:4}});
    const tubePipeline=await gpu.createRenderPipelineAsync({layout:'auto',vertex:{module,entryPoint:'tubeVertex',buffers:[{arrayStride:40,attributes:[{shaderLocation:0,offset:0,format:'float32x3'},{shaderLocation:1,offset:12,format:'float32x3'},{shaderLocation:2,offset:24,format:'float32x2'},{shaderLocation:3,offset:32,format:'float32'} ,{shaderLocation:4,offset:36,format:'float32'}]}]},fragment:{module,entryPoint:'tubeFragment',targets:[{format,blend:blending}]},primitive:{cullMode:'back'},multisample:{count:4}});
    const receiverBind=gpu.createBindGroup({layout:receiverPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:uniform}}]});
    const tubeBind=gpu.createBindGroup({layout:tubePipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:uniform}}]});
    const geometry=makeGeometry(reduced),vertexBuffer=gpu.createBuffer({size:geometry.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});gpu.queue.writeBuffer(vertexBuffer,0,geometry);
    const verify=new URLSearchParams(global.location?.search||'').has('verify');
    let disposed=false,multisample=null,raf=null,rendered=0,initialized=false,lastCycle=-1,audio=null;
    const voices=new Set();const started=performance.now();const uniforms=new Float32Array(12);
    gpu.addEventListener('uncapturederror',event=>onError(event.error.message));gpu.lost.then(info=>{if(!disposed)onError(info.message);});
    function frame(ms,{halo=1}={}){
      if(disposed)return false;const rect=canvas.getBoundingClientRect(),dpr=Math.min(global.devicePixelRatio||1,2);
      const width=Math.max(1,Math.round(rect.width*dpr)),pixelsHigh=Math.max(1,Math.round(rect.height*dpr));
      if(!initialized||canvas.width!==width||canvas.height!==pixelsHigh){
        canvas.width=width;canvas.height=pixelsHigh;target.configure({device:gpu,format,alphaMode:'opaque'});if(multisample)multisample.destroy();
        multisample=gpu.createTexture({size:[width,pixelsHigh],format,sampleCount:4,usage:GPUTextureUsage.RENDER_ATTACHMENT});initialized=true;
      }
      const state=phaseAt(ms,durationMs);uniforms.set([width,pixelsHigh,state.p,height*dpr,halo]);gpu.queue.writeBuffer(uniform,0,uniforms);
      const encoder=gpu.createCommandEncoder();const pass=encoder.beginRenderPass({colorAttachments:[{view:multisample.createView(),resolveTarget:target.getCurrentTexture().createView(),clearValue:{r:.052,g:.070,b:.086,a:1},loadOp:'clear',storeOp:'discard'}]});
      pass.setPipeline(receiverPipeline);pass.setBindGroup(0,receiverBind);pass.draw(3);
      if(state.visible){pass.setPipeline(tubePipeline);pass.setBindGroup(0,tubeBind);pass.setVertexBuffer(0,vertexBuffer);pass.draw(geometry.length/10);}pass.end();gpu.queue.submit([encoder.finish()]);rendered++;
      canvas.dataset.phase=String(state.p);canvas.dataset.stage=state.stage;return state;
    }
    async function unlock(){if(disposed||verify)return;const Constructor=global.AudioContext||global.webkitAudioContext;if(!Constructor)return;audio ||=new Constructor();if(audio.state==='suspended')await audio.resume();}
    function play(cycle,ms){if(verify||!audio||audio.state!=='running'||lastCycle===cycle||ms>65)return;lastCycle=cycle;const pcm=soundSamples(audio.sampleRate,durationMs),b=audio.createBuffer(1,pcm.length,audio.sampleRate);b.copyToChannel(pcm,0);const s=audio.createBufferSource();s.buffer=b;s.connect(audio.destination);voices.add(s);s.onended=()=>{voices.delete(s);s.disconnect();};s.start();}
    function loop(now){if(disposed)return;const period=durationMs+1250,wall=now-started,ms=wall%period;frame(ms);play(Math.floor(wall/period),ms);raf=requestAnimationFrame(loop);}
    global.addEventListener('pointerdown',unlock,{passive:true});global.addEventListener('keydown',unlock);if(!verify)void unlock().catch(()=>{});
    raf=requestAnimationFrame(loop);
    const api={edition:EDITION,verify,get frames(){return rendered;},get audioCreated(){return audio!==null;},adapter:{vendor:adapter.info?.vendor,architecture:adapter.info?.architecture},shaderMessages:compilation.messages.map(m=>({type:m.type,message:m.message})),
      async capture(ms,settings={}){cancelAnimationFrame(raf);const result=frame(ms,settings);await gpu.queue.onSubmittedWorkDone();return result;},
      draw:frame,
      destroy(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);global.removeEventListener('pointerdown',unlock);global.removeEventListener('keydown',unlock);for(const v of voices){try{v.stop();}catch{}}voices.clear();if(audio)void audio.close();vertexBuffer.destroy();uniform.destroy();if(multisample)multisample.destroy();target.unconfigure();gpu.destroy();}};
    return api;
  }
  const api={EDITION,phaseAt,makeGeometry,soundSamples,attach};global.LuckAstraV3=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
