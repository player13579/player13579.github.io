/* Mana clean v1. Original Codex Astra runtime, 2026-09-26. Gallery candidate only. */
(function(root){
'use strict';
const VERSION='mana-astra-clean-v1';
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const smooth=(a,b,x)=>{const z=clamp((x-a)/(b-a));return z*z*(3-2*z);};
function sample(ageMs,durationMs=1500){
  if(!Number.isFinite(ageMs)||!Number.isFinite(durationMs)||durationMs<=0)return {active:false,phase:0,stage:'invalid'};
  const phase=ageMs/durationMs;
  return {active:phase>0&&phase<1,phase:clamp(phase),stage:phase<=0?'before':phase>=1?'ended':phase<.147?'onset':phase<.587?'intake':phase<.8?'storage':'settle'};
}
function makeSfx(sampleRate=48000,durationMs=1500){
  if(!Number.isFinite(sampleRate)||sampleRate<8000||!Number.isFinite(durationMs)||durationMs<=0)throw new RangeError('Invalid SFX duration or sample rate');
  const n=Math.ceil(sampleRate*durationMs/1000),pcm=new Float32Array(n);let seed=179,low=0,phase=0;
  for(let i=0;i<n;i++){
    const t=i/sampleRate, p=i/Math.max(1,n-1),window=smooth(0,.02,p)*(1-smooth(.74,1,p));
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    const noise=(seed/4294967296)*2-1;low=low*.955+noise*.045;
    const intake=smooth(.02,.13,p)*(1-smooth(.42,.6,p));
    const arrival=smooth(.27,.40,p)*(1-smooth(.57,.88,p));
    phase+=2*Math.PI*(235+155*smooth(.06,.46,p))/sampleRate;
    const harmonic=Math.sin(phase)+.28*Math.sin(phase*2.007)+.12*Math.sin(phase*3.98);
    const resonance=Math.sin(2*Math.PI*523.25*t)*.55+Math.sin(2*Math.PI*784.88*t)*.24+Math.sin(2*Math.PI*1081.4*t)*.13;
    pcm[i]=window*(intake*(low*.20+harmonic*.052)+arrival*resonance*.078);
  }
  pcm[0]=0;pcm[n-1]=0;return pcm;
}
function createEvents(){
  const seen=new Set(),active=new Map();
  return {
    accept(event,now){
      if(!event||event.type!=='gain-mana'||!event.id||!event.playerId||seen.has(event.id)||!Number.isFinite(now)||!Number.isFinite(event.at))return false;
      if(['renki','renki-tenfold','desire-recovery'].includes(event.variant))return false;
      const durationMs=Number.isFinite(event.durationMs)?event.durationMs:1500;
      if(durationMs<=0)return false;
      seen.add(event.id);
      if(now-event.at>=durationMs)return false;
      active.set(event.id,{...event,durationMs});return true;
    },
    frame(now,targets){
      const result=[];
      for(const [id,event] of active){
        const target=targets.get(event.playerId),state=sample(now-event.at,event.durationMs);
        if(!target||target.dead||state.stage==='ended'||state.stage==='invalid'){active.delete(id);continue;}
        if(state.active)result.push({...event,...state,target});
      }return result;
    },
    cancel(id){return active.delete(id);},
    reset(){active.clear();seen.clear();},
    get size(){return active.size;}
  };
}
const WGSL=String.raw`
struct Params { viewport:vec2f, time:f32, reduced:f32, heights:vec2f, mode:f32, offset:f32 };
@group(0) @binding(0) var<uniform> u:Params;
@group(0) @binding(1) var sprite:texture_2d<f32>;
@group(0) @binding(2) var sampler0:sampler;
struct VertexOut { @builtin(position) position:vec4f };
@vertex fn vs(@builtin(vertex_index) i:u32)->VertexOut {
  var p=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3));
  var o:VertexOut;o.position=vec4f(p[i],0,1);return o;
}
fn over(a:vec4f,b:vec4f)->vec4f{return a+b*(1-a.a);}
fn resolve(body:f32,edge:f32,glow:f32,tonal:f32)->vec4f {
  let color=mix(vec3f(.22,.30,.92),vec3f(.34,.78,1.0),tonal);
  let alpha=clamp(body*.58+edge*.85+glow*.30,0.0,.97);
  let light=color*(body*.85+glow*.42)+vec3f(.68,.92,1.0)*edge;
  return vec4f(min(light,vec3f(1.0))*alpha,alpha);
}
fn intake(p:vec2f, t:f32, side:f32, h:f32)->vec4f {
  let onset=select(.03,.105,side>0);
  let a=t-onset;
  let reach=mix(.51,.32,u.reduced);
  let s=1.0-abs(p.x)/reach;
  let front=smoothstep(.01,.40,a);
  let tail=smoothstep(.34,.67,a);
  let longitudinal=smoothstep(tail-.09,tail+.045,s)*(1-smoothstep(front-.02,front+.09,s));
  let leftY=.13*(1-s)+.13*sin(3.14159*s);
  let rightY=-.17*(1-s)-.075*sin(3.14159*s);
  let curve=select(leftY,rightY,side>0);
  let width=(.028+.088*pow(max(0.0,sin(3.14159*clamp(s,0.0,1.0))),.75))*(1.0-.24*smoothstep(.65,1.,s));
  let d=(p.y-curve)/width;
  let aa=1.2/h/width;
  let band=(1-smoothstep(.83-aa,1.0+aa,abs(d)));
  let fold=-.50+.26*sin(s*4.7-a*3.1);
  let border=exp(-pow((d-fold)/(.105+aa*.3),2.0));
  let thickness=pow(max(0.,1.-d*d),.72);
  let lowerLip=exp(-pow((d-.75)/(.15+aa*.2),2.0))*.27;
  let body=band*(.34+.52*thickness+.14*smoothstep(-.5,.7,d));
  let halo=exp(-pow(d/1.8,2.0))*.38;
  let endGate=smoothstep(0.0,.04,a)*(1-smoothstep(.57,.68,a));
  let shape=longitudinal*endGate*select(0.0,1.0,p.x*side>=0.0)*smoothstep(-.03,.04,s)*(1-smoothstep(.98,1.055,s));
  return resolve(body*shape,(border+lowerLip)*band*shape*.67,halo*shape,clamp(s*.7+.16,0.,1.));
}
fn storage(p:vec2f,t:f32,h:f32,mask:f32)->vec4f {
  let rise=smoothstep(.22,.51,t);
  let settle=1-smoothstep(.76,1.0,t);
  let narrow=mix(1.0,.44,smoothstep(.71,.98,t));
  let center=vec2f(.01,-.025);
  let v=p-center;
  let width=(.075+.044*cos(clamp(v.y/.22,-1.0,1.0)*1.57))*narrow;
  let shape=pow(abs(v.x)/width,1.55)+pow(abs(v.y)/(.20*narrow),2.8);
  let volume=exp(-shape*1.8)*rise*settle;
  let seam=exp(-pow((v.x+.021*narrow)/(.013+1.0/h),2.0)-pow(v.y/(.125*narrow),4.0))*rise*settle;
  // Receiver light is confined to the existing body; no free-standing badge.
  return resolve(volume*.70*mask,seam*.32*mask,volume*.22*mask,.77);
}
@fragment fn fs(v:VertexOut)->@location(0) vec4f {
  let second=v.position.x>u.viewport.x*.5;
  let h=select(u.heights.x,u.heights.y,second);
  let centerX=u.viewport.x*select(.28,.73,second)+u.offset;
  let top=u.viewport.y*.47-h*.50;
  let local=vec2f((v.position.x-centerX)/h,(v.position.y-top)/h);
  let tex=(vec2f(local.x*225.0+128.0,local.y*225.0+16.0))/vec2f(768,768);
  let inSprite=tex.x>=0.0&&tex.y>=0.0&&tex.x<=256.0/768.0&&tex.y<=256.0/768.0;
  var actor=textureSample(sprite,sampler0,clamp(tex,vec2f(.0001),vec2f(255.9/768.0)));
  if(!inSprite){actor=vec4f(0);}
  actor=vec4f(actor.rgb*actor.a,actor.a);
  var scene=vec4f(.025,.032,.052,1.0);
  let p=local-vec2f(0,.59);
  let t=u.time;
  let live=t>0&&t<1&&u.mode!=1;
  var back=vec4f(0);var front=vec4f(0);var reservoir=vec4f(0);
  if(live){
    if(u.mode!=2){back=intake(p,t,1.0,h);front=intake(p,t,-1.0,h);}
    if(u.mode!=3){reservoir=storage(p,t,h,actor.a*smoothstep(.40,.46,local.y)*(1-smoothstep(.88,.97,local.y)));}
  }
  scene=over(back,scene);scene=over(actor,scene);scene=over(front,scene);scene=over(reservoir,scene);
  return scene;
}`;
async function createRenderer(canvas,options={}){
  if(!globalThis.navigator?.gpu)throw new Error('WebGPU is unavailable');
  const adapter=await navigator.gpu.requestAdapter();if(!adapter)throw new Error('WebGPU adapter unavailable');
  const device=await adapter.requestDevice(),context=canvas.getContext('webgpu');
  if(!context){device.destroy();throw new Error('WebGPU canvas unavailable');}
  const format=navigator.gpu.getPreferredCanvasFormat(),errors=[];
  device.addEventListener('uncapturederror',e=>errors.push(e.error.message));
  const shader=device.createShaderModule({label:VERSION,code:WGSL});
  const compilation=await shader.getCompilationInfo();
  const compileErrors=compilation.messages.filter(x=>x.type==='error');
  if(compileErrors.length){device.destroy();throw new Error(compileErrors.map(x=>x.message).join('\n'));}
  device.pushErrorScope('validation');
  let bitmap,texture,uniform,pipeline,bind;
  try{
    const response=await fetch(options.spriteUrl||'assets/generated/philia-front-nine-v752.png');
    if(!response.ok)throw new Error('Sprite HTTP '+response.status);
    bitmap=await createImageBitmap(await response.blob());
    texture=device.createTexture({size:[bitmap.width,bitmap.height],format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
    device.queue.copyExternalImageToTexture({source:bitmap},{texture},{width:bitmap.width,height:bitmap.height});bitmap.close();bitmap=null;
    uniform=device.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});
    pipeline=await device.createRenderPipelineAsync({layout:'auto',vertex:{module:shader,entryPoint:'vs'},fragment:{module:shader,entryPoint:'fs',targets:[{format}]},primitive:{topology:'triangle-list'}});
    bind=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:uniform}},{binding:1,resource:texture.createView()},{binding:2,resource:device.createSampler({magFilter:'linear',minFilter:'linear'})}]});
    const validation=await device.popErrorScope();if(validation)throw new Error(validation.message);
  }catch(error){bitmap?.close();texture?.destroy();uniform?.destroy();device.destroy();throw error;}
  let disposed=false,submitted=0,last=null;
  const info=adapter.info?{vendor:adapter.info.vendor,architecture:adapter.info.architecture,device:adapter.info.device,description:adapter.info.description}:{};
  device.lost.then(reason=>{if(!disposed)errors.push('device-lost:'+reason.message);});
  function render(phase,settings={}){
    if(disposed)throw new Error('Renderer disposed');
    if(!Number.isFinite(phase))throw new RangeError('Non-finite phase');
    const dpr=settings.dpr||globalThis.devicePixelRatio||1,w=Math.round((settings.width||canvas.clientWidth||640)*dpr),h=Math.round((settings.height||canvas.clientHeight||300)*dpr);
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;context.configure({device,format,alphaMode:'opaque',usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC});}
    if(submitted===0)context.configure({device,format,alphaMode:'opaque',usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC});
    device.queue.writeBuffer(uniform,0,new Float32Array([w,h,phase,settings.reduced?1:0,100*dpr,64*dpr,settings.mode||0,(settings.offset||0)*dpr]));
    const output=context.getCurrentTexture(),encoder=device.createCommandEncoder();
    const pass=encoder.beginRenderPass({colorAttachments:[{view:output.createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:'clear',storeOp:'store'}]});
    pass.setPipeline(pipeline);pass.setBindGroup(0,bind);pass.draw(3);pass.end();device.queue.submit([encoder.finish()]);
    submitted++;last={phase,submitted,width:w,height:h,dpr,reduced:!!settings.reduced,mode:settings.mode||0};return last;
  }
  async function readPixels(phase,settings={}){
    render(phase,settings);const w=canvas.width,h=canvas.height,row=Math.ceil(w*4/256)*256;
    const buffer=device.createBuffer({size:row*h,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});
    const encoder=device.createCommandEncoder();encoder.copyTextureToBuffer({texture:context.getCurrentTexture()},{buffer,bytesPerRow:row},{width:w,height:h});device.queue.submit([encoder.finish()]);
    try{await buffer.mapAsync(GPUMapMode.READ);const source=new Uint8Array(buffer.getMappedRange()),out=new Uint8Array(w*h*4);for(let y=0;y<h;y++)out.set(source.subarray(y*row,y*row+w*4),y*w*4);return {width:w,height:h,format,pixels:out};}finally{buffer.unmap();buffer.destroy();}
  }
  return {render,readPixels,info,errors,get receipt(){return last;},async settled(){await device.queue.onSubmittedWorkDone();},dispose(){if(disposed)return;disposed=true;context.unconfigure();uniform.destroy();texture.destroy();device.destroy();}};
}
function createAudio({verify=false,muted=false}={}){
  let context=null,disposed=false;const active=new Set(),played=new Set();
  return {
    async unlock(){if(verify||muted||disposed)return false;if(!context)context=new (globalThis.AudioContext||globalThis.webkitAudioContext)();await context.resume();return context.state==='running';},
    play(causeId,durationMs=1500){
      if(verify||muted||disposed||!causeId||played.has(causeId)||context?.state!=='running')return false;
      played.add(causeId);const data=makeSfx(context.sampleRate,durationMs),buffer=context.createBuffer(1,data.length,context.sampleRate);buffer.copyToChannel(data,0);
      const node=context.createBufferSource();node.buffer=buffer;node.connect(context.destination);active.add(node);node.onended=()=>{node.disconnect();active.delete(node);};node.start();return true;
    },
    async dispose(){if(disposed)return;disposed=true;for(const node of active){node.stop();node.disconnect();}active.clear();if(context)await context.close();},
    get state(){return {verify,muted,contextCreated:!!context,active:active.size,played:played.size,disposed};}
  };
}
const api={VERSION,sample,makeSfx,createEvents,createRenderer,createAudio,WGSL};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.DvaManaAstraCleanV1=api;
})(globalThis);
