/* Original Codex Astra, mana clean v2. Gallery-only 3D volume candidate. */
(function(global){'use strict';
const VERSION='mana-astra-clean-v2',LIFE_MS=1500;
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
function state(ageMs){
  if(!Number.isFinite(ageMs))return {active:false,phase:0,amount:0,stage:'invalid'};
  const phase=ageMs/LIFE_MS,arrivals=[.10,.23,.36].map(start=>ease((phase-start)/.25));
  const amounts=arrivals.map(a=>ease((a-.58)/.42));
  return {active:phase>0&&phase<1,phase,arrivals,amount:amounts.reduce((a,b)=>a+b,0)/3,stage:phase<=0?'before':phase<.12?'condensation':phase<.61?'absorption':phase<.82?'stored':phase<1?'settling':'ended'};
}
function pcm(sampleRate=48000){
  if(!Number.isFinite(sampleRate)||sampleRate<8000)throw new RangeError('sampleRate');
  const samples=new Float32Array(Math.ceil(sampleRate*1.5));let oscillator=0;
  for(let i=0;i<samples.length;i++){
    const t=i/sampleRate,p=t/1.5,formation=ease(p/.035)*(1-ease((p-.22)/.22));
    oscillator+=2*Math.PI*(172+60*ease(p/.28))/sampleRate;
    let sound=formation*(Math.sin(oscillator)*.036+Math.sin(oscillator*1.501)*.020+Math.sin(oscillator*3.025)*.010);
    for(let k=0;k<3;k++){
      const arrival=.35+k*.13,dt=p-arrival;
      if(dt>-.022&&dt<.29){const attack=ease((dt+.022)/.035),decay=Math.exp(-Math.max(0,dt)*14);const f=392*Math.pow(1.125,k);
        sound+=attack*decay*(Math.sin(2*Math.PI*f*t)*.057+Math.sin(2*Math.PI*f*2.76*t)*.012+Math.sin(2*Math.PI*f*.501*t)*.021);}
    }
    const settle=ease((p-.52)/.12)*(1-ease((p-.76)/.24));
    sound+=settle*Math.sin(2*Math.PI*196*t)*.019;
    samples[i]=sound*ease(p/.008)*(1-ease((p-.92)/.08));
  }samples[0]=0;samples[samples.length-1]=0;return samples;
}
function causes(){const seen=new Set(),active=new Map();return {
  add(e,now){if(!e||e.type!=='gain-mana'||!e.id||!e.playerId||!Number.isFinite(e.at)||!Number.isFinite(now)||seen.has(e.id)||['renki','renki-tenfold','desire-recovery'].includes(e.variant))return false;seen.add(e.id);if(now-e.at>=LIFE_MS)return false;active.set(e.id,{...e});return true;},
  frame(now,targets){const out=[];for(const [id,e] of active){const s=state(now-e.at),target=targets.get(e.playerId);if(!target||target.dead||s.stage==='ended'||s.stage==='invalid'){active.delete(id);continue;}if(s.active)out.push({...e,...s,target});}return out;},
  cancel(id){active.delete(id);},reset(){seen.clear();active.clear();},get size(){return active.size;}
};}
function sound({verify=false,mute=false}={}){let ctx=null,closed=false;const used=new Set(),nodes=new Set();return {
  async unlock(){if(verify||mute||closed)return false;ctx??=new (global.AudioContext||global.webkitAudioContext)();await ctx.resume();return ctx.state==='running';},
  play(id){if(verify||mute||closed||!id||used.has(id)||ctx?.state!=='running')return false;used.add(id);const data=pcm(ctx.sampleRate),buffer=ctx.createBuffer(1,data.length,ctx.sampleRate);buffer.copyToChannel(data,0);const source=ctx.createBufferSource();source.buffer=buffer;source.connect(ctx.destination);nodes.add(source);source.onended=()=>{source.disconnect();nodes.delete(source);};source.start();return true;},
  async dispose(){if(closed)return;closed=true;for(const n of nodes){n.stop();n.disconnect();}nodes.clear();if(ctx)await ctx.close();},
  get info(){return {verify,mute,contextCreated:!!ctx,playing:nodes.size,closed};}
};}
const shader=String.raw`
struct Params {size:vec2f, phase:f32, reduced:f32, heights:vec2f, mode:f32, offset:f32};
@group(0) @binding(0) var<uniform> u:Params;
@group(0) @binding(1) var actorTexture:texture_2d<f32>;
@group(0) @binding(2) var filtering:sampler;
struct V { @builtin(position) p:vec4f };
@vertex fn vertex(@builtin(vertex_index) index:u32)->V {var points=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3));var out:V;out.p=vec4f(points[index],0,1);return out;}
fn smooth01(x:f32)->f32 {let v=clamp(x,0.,1.);return v*v*(3.-2.*v);}
fn amount(t:f32)->f32 {var a=0.;for(var i=0;i<3;i++){let travel=smooth01((t-(.10+f32(i)*.13))/.25);a+=smooth01((travel-.58)/.42);}return a/3.;}
fn transport(t:f32,k:i32)->vec4f {
  let travel=smooth01((t-(.10+f32(k)*.13))/.25);
  var origins=array<vec3f,3>(vec3f(-.35,.09,.12),vec3f(.34,-.095,-.12),vec3f(-.09,.285,.13));
  let origin=origins[k]*mix(1.,.64,u.reduced);
  let bend=vec3f(.04*sin(f32(k)*2.1),-.065,.07*cos(f32(k)*2.3))*sin(travel*3.1415926);
  let center=origin*(1.-travel)+bend;
  let consumed=smooth01((travel-.58)/.42);
  let formed=smooth01(t/.085);
  let radius=(.077+f32(k)*.009)*formed*pow(max(0.,1.-consumed),.45);
  return vec4f(center,radius);
}
// PH1: density and radiation from a bounded 3D condensate, no trail geometry.
fn condensate(point:vec3f,t:f32)->vec4f {
  var optical=0.;var emitted=vec3f(0);
  for(var k=0;k<3;k++){
    let blob=transport(t,k);if(blob.w<.002){continue;}
    let relative=(point-blob.xyz)/blob.w;
    let inward=normalize(-blob.xy+vec2f(.0001));
    let axial=dot(relative.xy,inward);
    let cross=dot(relative.xy,vec2f(-inward.y,inward.x));
    // Closed, pear-shaped volume: dense front points toward the receiver.
    let taper=.94-.30*smoothstep(-1.5,1.5,axial);
    let q=vec3f(axial/1.43,cross/taper,relative.z/(taper*.90));
    let r2=dot(q,q);if(r2>2.0){continue;}
    let r=sqrt(r2);
    let veil=exp(-r2*2.8);
    let boundary=exp(-pow((r-.87)/.12,2.));
    let nucleus=q-vec3f(.19,0.,.05);
    let core=exp(-dot(nucleus,nucleus)*13.);
    let litEdge=boundary*(.08+.92*pow(max(0.,dot(normalize(q+vec3f(.001)),normalize(vec3f(-.4,-.6,1.)))),3.));
    optical+=veil*13.+boundary*3.;
    emitted+=vec3f(.055,.18,.75)*veil*12.+vec3f(.15,.78,1.0)*litEdge*18.+vec3f(.82,.98,1.)*core*42.;
  }return vec4f(emitted,optical);
}
// PH2: stored volume responds to the amount that PH1 has actually deposited.
fn reservoir(point:vec3f,t:f32,bodyMask:f32)->vec4f {
  let stored=amount(t);if(stored<.002||bodyMask<.002){return vec4f(0);}
  let collapse=1.-smooth01((t-.82)/.18);
  let growth=(.43+.57*pow(stored,.333333))*pow(max(.001,collapse),.4);
  let py=point.y+.035;
  let width=(.093+.032*cos(clamp(py/.23,-1.,1.)*2.8))*growth;
  let q=vec3f(point.x/width,py/(.233*growth),(point.z-.08)/(.075*growth));
  let r2=dot(q,q);if(r2>2.){return vec4f(0);}
  let body=exp(-r2*2.25)*stored*collapse*bodyMask;
  let core=exp(-pow(q.x*3.1,2.)-pow(q.y*1.10,4.)-pow(q.z*2.,2.))*stored*collapse*bodyMask;
  let shell=exp(-pow((sqrt(r2)-.86)/.13,2.))*stored*collapse*bodyMask;
  let color=vec3f(.035,.36,.86)*body*18.+vec3f(.2,.83,1.)*shell*5.+vec3f(.62,.95,1.)*core*25.;
  return vec4f(color,body*5.);
}
// Front-to-back emission/absorption quadrature over real z extent.
fn integrate(xy:vec2f,t:f32,zNear:f32,zFar:f32,bodyMask:f32,receiver:bool)->vec4f {
  let steps=24;let dz=(zNear-zFar)/f32(steps);
  var transmission=1.;var light=vec3f(0);
  for(var n=0;n<steps;n++){
    let z=zNear-(f32(n)+.5)*dz;
    var medium=vec4f(0);
    if(u.mode!=2.){medium=condensate(vec3f(xy,z),t);}
    if(receiver&&u.mode!=3.){medium+=reservoir(vec3f(xy,z),t,bodyMask);}
    let absorption=exp(-medium.a*dz);
    light+=transmission*medium.rgb*dz;
    transmission*=absorption;
  }
  return vec4f(light,1.-transmission);
}
fn nearGlow(xy:vec2f,t:f32,bodyMask:f32)->vec3f {
  var glow=vec3f(0);
  if(u.mode!=2.){for(var k=0;k<3;k++){let blob=transport(t,k);let d=length(xy-blob.xy);let g=exp(-pow(d/max(.001,blob.w*1.6),2.))*blob.w;glow+=vec3f(.015,.12,.28)*g*1.1;}}
  if(u.mode!=3.){let a=amount(t)*(1.-smooth01((t-.82)/.18));glow+=vec3f(.015,.12,.25)*exp(-dot(xy/vec2f(.19,.28),xy/vec2f(.19,.28))*2.)*a*.18*bodyMask;}
  return glow;
}
fn encode(rgb:vec3f)->vec3f {let c=clamp(rgb,vec3f(0),vec3f(1));return select(c*12.92,1.055*pow(c,vec3f(1./2.4))-.055,c>vec3f(.0031308));}
@fragment fn fragment(v:V)->@location(0) vec4f {
  let second=v.p.x>u.size.x*.5;let h=select(u.heights.x,u.heights.y,second);
  let center=vec2f(u.size.x*select(.28,.73,second)+u.offset,u.size.y*.47-h*.5);
  let local=(v.p.xy-center)/h;
  let source=vec2f(local.x*225.+128.,local.y*225.+16.);
  var body=textureSample(actorTexture,filtering,clamp(source/768.,vec2f(.0001),vec2f(255.9/768.)));
  if(source.x<0.||source.x>=256.||source.y<0.||source.y>=256.){body=vec4f(0);}
  let p=local-vec2f(0,.60);
  var rgb=vec3f(.0021,.003,.0058);
  let live=u.phase>0.&&u.phase<1.&&u.mode!=1.&&abs(p.x)<.62&&abs(p.y)<.56;
  if(live){let back=integrate(p,u.phase,0.,-.32,0.,false);rgb=rgb*(1.-back.a)+back.rgb;}
  rgb=rgb*(1.-body.a)+body.rgb*body.a;
  if(live){
    let mask=body.a*smoothstep(.40,.46,local.y)*(1.-smoothstep(.88,.98,local.y));
    let front=integrate(p,u.phase,.32,0.,mask,true);rgb=rgb*(1.-front.a)+front.rgb+nearGlow(p,u.phase,mask);
  }
  return vec4f(encode(rgb),1.);
}`;
async function renderer(canvas,{spriteUrl='assets/generated/philia-front-nine-v752.png'}={}){
  if(!navigator.gpu)throw new Error('WebGPU unavailable');const adapter=await navigator.gpu.requestAdapter();if(!adapter)throw new Error('No GPU adapter');
  const device=await adapter.requestDevice(),context=canvas.getContext('webgpu'),format=navigator.gpu.getPreferredCanvasFormat(),errors=[];
  if(!context){device.destroy();throw new Error('WebGPU context unavailable');}
  let bitmap,texture,buffer,closed=false,receipt=null;
  device.addEventListener('uncapturederror',event=>errors.push(event.error.message));
  device.lost.then(reason=>{if(!closed)errors.push('device lost: '+reason.message);});
  try{
    const code=device.createShaderModule({code:shader,label:VERSION});const info=await code.getCompilationInfo();const problems=info.messages.filter(x=>x.type==='error');if(problems.length)throw new Error(problems.map(x=>x.message).join('\n'));
    device.pushErrorScope('validation');const response=await fetch(spriteUrl,{signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error('Sprite '+response.status);
    bitmap=await createImageBitmap(await response.blob());texture=device.createTexture({size:[bitmap.width,bitmap.height],format:'rgba8unorm-srgb',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});device.queue.copyExternalImageToTexture({source:bitmap},{texture},{width:bitmap.width,height:bitmap.height});bitmap.close();bitmap=null;
    buffer=device.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});
    const pipeline=await device.createRenderPipelineAsync({layout:'auto',vertex:{module:code,entryPoint:'vertex'},fragment:{module:code,entryPoint:'fragment',targets:[{format}]},primitive:{topology:'triangle-list'}});
    const bind=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer}},{binding:1,resource:texture.createView()},{binding:2,resource:device.createSampler({magFilter:'linear',minFilter:'linear'})}]});
    const error=await device.popErrorScope();if(error)throw new Error(error.message);let count=0;
    function draw(phase,options={}){
      if(closed)throw new Error('disposed');if(!Number.isFinite(phase))throw new RangeError('phase');
      const dpr=options.dpr||devicePixelRatio||1,width=Math.round((canvas.clientWidth||788)*dpr),height=Math.round((canvas.clientHeight||300)*dpr);
      if(canvas.width!==width||canvas.height!==height||count===0){canvas.width=width;canvas.height=height;context.configure({device,format,alphaMode:'opaque',usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC});}
      device.queue.writeBuffer(buffer,0,new Float32Array([width,height,phase,options.reduced?1:0,100*dpr,64*dpr,options.mode||0,(options.offset||0)*dpr]));
      const output=context.getCurrentTexture(),command=device.createCommandEncoder(),pass=command.beginRenderPass({colorAttachments:[{view:output.createView(),loadOp:'clear',storeOp:'store',clearValue:{r:0,g:0,b:0,a:1}}]});pass.setPipeline(pipeline);pass.setBindGroup(0,bind);pass.draw(3);pass.end();device.queue.submit([command.finish()]);receipt={phase,frame:++count,width,height,dpr,reduced:!!options.reduced};return receipt;
    }
    async function pixels(phase,options={}){
      draw(phase,options);const width=canvas.width,height=canvas.height,stride=Math.ceil(width*4/256)*256,read=device.createBuffer({size:stride*height,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),command=device.createCommandEncoder();command.copyTextureToBuffer({texture:context.getCurrentTexture()},{buffer:read,bytesPerRow:stride},{width,height});device.queue.submit([command.finish()]);
      try{await read.mapAsync(GPUMapMode.READ);const mapped=new Uint8Array(read.getMappedRange()),out=new Uint8Array(width*height*4);for(let y=0;y<height;y++)out.set(mapped.subarray(y*stride,y*stride+width*4),y*width*4);return {width,height,format,data:out};}finally{read.unmap();read.destroy();}
    }
    return {draw,pixels,errors,info:{vendor:adapter.info?.vendor,architecture:adapter.info?.architecture},get receipt(){return receipt;},async settle(){await device.queue.onSubmittedWorkDone();},dispose(){if(closed)return;closed=true;context.unconfigure();buffer.destroy();texture.destroy();device.destroy();}};
  }catch(error){bitmap?.close();buffer?.destroy();texture?.destroy();closed=true;device.destroy();throw error;}
}
const api={VERSION,LIFE_MS,state,pcm,causes,sound,renderer,shader};if(typeof module!=='undefined'&&module.exports)module.exports=api;else global.DvaManaAstraCleanV2=api;
})(globalThis);
