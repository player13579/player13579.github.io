/* Original Codex Astra, mana clean v3. Local 3D volume candidate; not gallery approved. */
(function(global){'use strict';
const VERSION='mana-astra-clean-v3',LIFE_MS=1500;
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
function state(ageMs){
  if(!Number.isFinite(ageMs))return {active:false,phase:0,amount:0,stage:'invalid'};
  const phase=ageMs/LIFE_MS,amount=ease((phase-.10)/.55);
  return {active:phase>0&&phase<1,phase,amount,stage:phase<=0?'before':phase<.10?'formation':phase<.65?'transfer':phase<.84?'stored':phase<1?'settling':'ended'};
}
function pcm(sampleRate=48000){
  if(!Number.isFinite(sampleRate)||sampleRate<8000)throw new RangeError('sampleRate');
  const samples=new Float32Array(Math.ceil(sampleRate*1.5));let phase=0,noiseLow=0,seed=571;
  for(let i=0;i<samples.length;i++){
    const seconds=i/sampleRate,t=seconds/1.5,Q=ease((t-.1)/.55),flow=4*Q*(1-Q);
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;const n=seed/2147483648-1;noiseLow=.94*noiseLow+.06*n;
    phase+=2*Math.PI*(155+130*Q)/sampleRate;
    const pressure=(Math.sin(phase)+.34*Math.sin(phase*1.997))*.043*(1-Q*.55);
    const edge=(Math.sin(phase*3.18)*.014+Math.sin(phase*5.07)*.006+noiseLow*.11)*flow;
    const settle=ease((t-.51)/.14)*(1-ease((t-.78)/.22))*(Math.sin(2*Math.PI*349.23*seconds)*.025+Math.sin(2*Math.PI*522.72*seconds)*.013);
    samples[i]=(pressure+edge+settle)*ease(t/.028)*(1-ease((t-.85)/.15));
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
fn amount(t:f32)->f32 {return smooth01((t-.10)/.55);}
// PH1/2: a single hollow supply volume loses its inner mass into the receiver.
fn condensate(point:vec3f,t:f32)->vec4f {
  let Q=amount(t);if(Q>=.9999){return vec4f(0);}
  let formation=smooth01(t/.09);
  let travel=mix(1.,.72,u.reduced);
  let center=vec3f((-.30+.072*Q)*travel,.035-.04*Q,-.025);
  let relative=point-center;
  let dimensions=vec3f(.285,.246,.157)*mix(1.,.80,Q);
  let outer=relative/dimensions;
  let outerR=dot(outer,outer);
  if(outerR>2.5){return vec4f(0);}
  let cavity=(relative-vec3f(.115+.032*Q,-.023,.027))/vec3f(.234+.037*Q,.176+.045*Q,.140);
  let innerR=dot(cavity,cavity);
  let bulk=(1.-smoothstep(.68,1.13,outerR))*smoothstep(.59,.93,innerR);
  let innerBoundary=exp(-pow((sqrt(innerR)-.93)/.065,2.))*(1.-smoothstep(.65,1.02,outerR));
  let frontResponse=.28+.72*smoothstep(-.12,.14,point.z);
  let available=pow(max(0.,1.-Q),.62)*formation;
  let neck=vec3f((point.x+.095)/.12,(point.y+.025)/.10,(point.z-.065)/.070);
  let transport=exp(-dot(neck,neck)*2.8)*4.*Q*(1.-Q)*formation;
  let strata=.64+.36*cos(relative.y*15.+relative.z*12.-Q*2.5);
  let density=bulk*available*strata;
  let emitted=vec3f(.020,.105,.40)*density*7.+vec3f(.12,.66,.94)*innerBoundary*available*frontResponse*11.+vec3f(.30,.79,1.)*transport*16.;
  return vec4f(emitted,density*12.+transport*3.);
}
// PH3: offset, oblique pockets with real intervening gaps; no central vertical core.
fn reservoir(point:vec3f,t:f32,bodyMask:f32)->vec4f {
  let Q=amount(t);if(Q<.001||bodyMask<.001){return vec4f(0);}
  let end=1.-smooth01((t-.84)/.16);
  var emission=vec3f(0);var optical=0.;
  var centers=array<vec3f,3>(vec3f(-.052,-.086,.078),vec3f(.063,.008,.139),vec3f(-.036,.100,.065));
  var tilts=array<f32,3>(-.70,.87,-.56);
  for(var k=0;k<3;k++){
    let filled=smooth01((Q-f32(k)*.205)/.59)*end;
    if(filled<.002){continue;}
    let growth=.46+.54*pow(filled,.33333);
    let p=point-centers[k];let c=cos(tilts[k]);let s=sin(tilts[k]);
    let q=vec3f((p.x*c-p.y*s)/(.089*growth),(p.x*s+p.y*c)/(.127*growth),p.z/(.064*growth));
    let r2=dot(q,q);if(r2>2.){continue;}
    let bulk=(1.-smoothstep(.65,1.08,r2))*filled*bodyMask;
    let frontSkin=exp(-pow((sqrt(r2)-.88)/.085,2.))*smoothstep(-.2,.8,q.z)*filled*bodyMask;
    let innerGap=1.-.65*exp(-pow((q.x+.12)/.16,2.)-pow((q.y-.30)/.28,2.));
    emission+=(vec3f(.015,.12,.33)*bulk*9.+vec3f(.20,.78,.95)*frontSkin*18.)*innerGap;
    optical+=bulk*9.;
  }
  return vec4f(emission,optical);
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
  let Q=amount(t);var light=vec3f(0);
  if(u.mode!=2.){
    let r=(xy-vec2f(-.30+.072*Q,.035-.04*Q))/vec2f(.32,.29);
    light+=vec3f(.012,.07,.20)*exp(-dot(r,r)*2.5)*(1.-Q)*smooth01(t/.09)*.13;
  }
  if(u.mode!=3.){
    let r=xy/vec2f(.23,.28);
    light+=vec3f(.012,.10,.23)*exp(-dot(r,r)*2.1)*Q*(1.-smooth01((t-.84)/.16))*.08*bodyMask;
  }
  return light;
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
const api={VERSION,LIFE_MS,state,pcm,causes,sound,renderer,shader};if(typeof module!=='undefined'&&module.exports)module.exports=api;else global.DvaManaAstraCleanV3=api;
})(globalThis);
