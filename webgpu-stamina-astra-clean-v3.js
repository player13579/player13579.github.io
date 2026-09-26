(function(global){'use strict';
const VERSION='stamina-astra-clean-v3';const STARTS=[.02,.25,.48],SPAN=.52;
const sat=x=>Math.max(0,Math.min(1,x));const smooth=(a,b,t)=>{let x=sat((t-a)/(b-a));return x*x*(3-2*x);};
function phaseData(age,duration=1500){if(!Number.isFinite(age)||!Number.isFinite(duration)||duration<=0)return {p:-1,pulses:[]};const p=age/duration;return {p,pulses:p<0||p>=1?[]:STARTS.map((start,index)=>({index,local:(p-start)/SPAN})).filter(v=>v.local>=0&&v.local<1)};}
const shader=String.raw`
struct Config { size:vec2f, phase:f32, reduced:f32, actors:array<vec4f,2> };
@group(0) @binding(0) var<uniform> cfg:Config;
@group(0) @binding(1) var actorImage:texture_2d<f32>;
@group(0) @binding(2) var imageSampler:sampler;
@vertex fn vertex(@builtin(vertex_index) index:u32)->@builtin(position) vec4f {
 let points=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3));return vec4f(points[index],0,1);
}
fn actor(q:vec2f)->vec4f {let uv=(q*224.+vec2f(128.,240.))/256.;if(any(uv<vec2f(0.))||any(uv>vec2f(1.))){return vec4f(0.);}return textureSampleLevel(actorImage,imageSampler,uv,0.);}
fn pad(q:vec2f,amount:f32,aa:f32)->vec3f {
 var result=vec3f(0.);
 for(var side=0u;side<2u;side++){
  let sign=select(-1.,1.,side==1u);let v=q-vec2f(sign*.085,-.005);
  let d=max(abs(v.x+.25*v.y)/(.115+.018*amount),abs(v.y)/(.023+.018*amount));
  let coverage=1.-smoothstep(.70,1.+aa*8.,d);
  let centre=exp(-pow(v.x/.09,2.)-pow(v.y/.020,2.));
  result+=amount*(coverage*vec3f(.25,.37,.018)+centre*vec3f(.90,.76,.23));
 }return result;
}
// 足裏から立ち上がる厚い剪断体。横断輪郭線を作らず、体積ごと体幹へ受け渡す。
fn pressureSurface(q:vec2f,local:f32,index:u32,aa:f32)->vec4f {
 if(local<0.||local>=1.){return vec4f(0.);}
 let travel=smoothstep(0.,.89,local);
 let sign=select(-1.,1.,index%2u==0u);
 let y=-.065-.405*travel;
 let halfHeight=.11+.135*sin(3.14159265*local);
 let axial=(q.y-y)/halfHeight;
 let turn=smoothstep(.50,.94,local);
 let centre=sign*(.09+.095*sin(3.14159265*travel)*select(1.,.55,cfg.reduced>0.))*(1.-turn*.77);
 let curl=sign*(.08*axial+.035*sin(axial*3.14159265))*(1.-turn*.60)*select(1.,.55,cfg.reduced>0.);
 let width=(.096+.063*sin(3.14159265*local))*(.60+.40*smoothstep(-1.,.25,axial));
 let side=(q.x-centre-curl)/width;
 let shape=max(abs(axial),abs(side)*.84+max(0.,-axial)*.31);
 let coverage=1.-smoothstep(.79,1.+aa/width,shape);
 let depth=sqrt(max(0.,1.-min(1.,side*side*.72)))*coverage;
 let fold=exp(-pow((side+sign*.20)/.69,2.))*coverage*(.62+.38*(1.-smoothstep(-.80,.70,axial)));
 let localGlow=exp(-max(shape-1.,0.)*9.)*.035;
 let envelope=smoothstep(0.,.08,local)*(1.-smoothstep(.86,1.,local));
 return vec4f(coverage,depth,fold,localGlow)*envelope;
}
fn illuminate(rgb:vec3f,f:vec4f,front:bool)->vec3f {
 let opacity=f.x*select(.80,.40,front);
 let surface=vec3f(.10,.20,.008)+vec3f(.27,.32,.020)*f.y;
 let emission=f.y*vec3f(.20,.37,.006)+f.z*vec3f(.71,.69,.12)+f.w*vec3f(.13,.21,.003);
 return mix(rgb,surface,opacity)+emission*select(.92,.69,front);
}
// 到達済みの搬送量で受け取り容積を満たす。静的な全身着色ではない。
fn receiver(q:vec2f,amount:f32,aa:f32)->vec4f {
 if(amount<=.001){return vec4f(0.);}
 var result=vec4f(0.);
 for(var k=0u;k<2u;k++){
  let sign=select(-1.,1.,k==1u);
  let centre=vec2f(sign*(.132-.092*amount),-.42);
  let r=q-centre;
  let x=r.x+sign*r.y*.23;
  let width=.042+.051*amount;
  let halfHeight=.125+.065*amount;
  let v=r.y/halfHeight;
  let side=x/width;
  let solid=max(abs(v),abs(side)*.81+max(v,0.)*.27);
  let boundary=1.-smoothstep(.79,1.+aa/width,solid);
  let fill=smoothstep(.98-amount*2.10,.98-amount*2.10+.15,v);
  let coverage=boundary*fill;
  let density=coverage*(.44+.56*sqrt(max(0.,1.-min(1.,side*side*.63))));
  let pressure=coverage*exp(-pow((side-sign*.32)/.64,2.))*(.56+.44*amount);
  result+=vec4f(coverage,density,pressure,0.);
 }return result;
}
@fragment fn fragment(@builtin(position) pixel:vec4f)->@location(0) vec4f {
 var rgb=pow(vec3f(.055,.072,.09),vec3f(2.2));let p=cfg.phase;let present=p>0.&&p<1.;
 let starts=array<f32,3>(.02,.25,.48);
 for(var a=0u;a<2u;a++){
  let info=cfg.actors[a];let q=(pixel.xy-info.xy)/info.z;let aa=.65/info.z;
  if(abs(q.x)>.49||q.y< -1.06||q.y>.10){continue;}
  var fronts=array<vec4f,3>();var padIntensity=0.;var received=0.;
  if(present){
   for(var k=0u;k<3u;k++){
    let local=(p-starts[k])/.52;
    let arrival=smoothstep(.55,.87,local);
    received+=arrival/3.;
    fronts[k]=pressureSurface(q,local,k,aa)*(1.-arrival*.77);
    let startPulse=smoothstep(starts[k]-.03,starts[k]+.015,p)*(1.-smoothstep(starts[k]+.055,starts[k]+.13,p));
    padIntensity=max(padIntensity,startPulse);
    // 奥側は正しい身体遮蔽へ委ねる。
    rgb=illuminate(rgb,fronts[k],false);
   }
   rgb+=pad(q,padIntensity,aa);
   let held=receiver(q,received,aa)*(1.-smoothstep(.935,1.,p));
   rgb=illuminate(rgb,held,false);
  }
  let sprite=actor(q);let original=pow(sprite.rgb,vec3f(2.2));rgb=mix(rgb,original,sprite.a);
  if(present){
   for(var k=0u;k<3u;k++){
    // 奥に隠れた面を正面全面へ複製せず、身体に接する中心の受け取りだけ出す。
    let coreMask=1.-smoothstep(.19,.31,abs(q.x));
    let bodyMask=smoothstep(-.72,-.64,q.y);
    let contact=(.65+.35*sprite.a)*coreMask*bodyMask;
    rgb=illuminate(rgb,fronts[k]*contact,true);
   }
   let stored=receiver(q,received,aa)*(1.-smoothstep(.935,1.,p));
   rgb=illuminate(rgb,stored*(.40+.60*sprite.a),true);
   // 出発時に靴の上面へ届く光。固定外周オーラは持たない。
   let shoeLight=padIntensity*exp(-pow((q.y+.045)/.055,2.))*sprite.a;
   rgb+=vec3f(.31,.35,.045)*shoeLight;
  }
 }
 rgb=rgb/(vec3f(1.)+rgb*.34);return vec4f(pow(rgb,vec3f(1./2.2)),1.);
}`;
async function createRenderer(canvas){
 if(!navigator.gpu)throw Error('WebGPU unavailable');const adapter=await navigator.gpu.requestAdapter({powerPreference:'high-performance'});if(!adapter)throw Error('No WebGPU adapter');const device=await adapter.requestDevice();const errors=[];device.addEventListener('uncapturederror',event=>errors.push(event.error.message));
 const code=device.createShaderModule({code:shader});const compilation=await code.getCompilationInfo();const messages=Array.from(compilation.messages,m=>({type:m.type,line:m.lineNum,message:m.message}));if(messages.some(m=>m.type==='error')){device.destroy();throw Error(JSON.stringify(messages));}
 device.pushErrorScope('validation');const context=canvas.getContext('webgpu'),format=navigator.gpu.getPreferredCanvasFormat();context.configure({device,format,alphaMode:'opaque'});
 const pipeline=await device.createRenderPipelineAsync({layout:'auto',vertex:{module:code,entryPoint:'vertex'},fragment:{module:code,entryPoint:'fragment',targets:[{format}]}});
 const response=await fetch('assets/generated/philia-front-nine-v752.png');if(!response.ok)throw Error('Missing actor fixture');const bitmap=await createImageBitmap(await response.blob(),0,0,256,256,{premultiplyAlpha:'none'});
 const image=device.createTexture({size:[256,256],format:'rgba8unorm',usage:GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT});device.queue.copyExternalImageToTexture({source:bitmap},{texture:image},{width:256,height:256});bitmap.close();
 const uniform=device.createBuffer({size:48,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const bind=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:uniform}},{binding:1,resource:image.createView()},{binding:2,resource:device.createSampler({magFilter:'linear',minFilter:'linear'})}]});const validation=await device.popErrorScope();if(validation)throw Error(validation.message);let disposed=false;
 return {version:VERSION,messages,errors,adapterInfo:adapter.info,async draw(p,{width=680,height=280,dpr=1,reduced=false}={}){
  if(disposed)throw Error('Disposed');if(![p,width,height,dpr].every(Number.isFinite)||Math.min(width,height,dpr)<=0)throw TypeError('Invalid draw');const w=Math.round(width*dpr),h=Math.round(height*dpr);if(canvas.width!==w)canvas.width=w;if(canvas.height!==h)canvas.height=h;canvas.style.width=width+'px';canvas.style.height=height+'px';
  device.queue.writeBuffer(uniform,0,new Float32Array([w,h,p,reduced?1:0,width*.31*dpr,210*dpr,100*dpr,0,width*.71*dpr,210*dpr,64*dpr,0]));const encoder=device.createCommandEncoder();const pass=encoder.beginRenderPass({colorAttachments:[{view:context.getCurrentTexture().createView(),loadOp:'clear',storeOp:'store',clearValue:{r:0,g:0,b:0,a:1}}]});pass.setPipeline(pipeline);pass.setBindGroup(0,bind);pass.draw(3);pass.end();device.queue.submit([encoder.finish()]);await device.queue.onSubmittedWorkDone();
 },dispose(){if(disposed)return;disposed=true;uniform.destroy();image.destroy();context.unconfigure();device.destroy();}};
}
function synthesize(rate=48000,duration=1500){
 if(!Number.isFinite(rate)||rate<8000||!Number.isFinite(duration)||duration<=0||duration>10000)throw TypeError('Invalid audio');const pcm=new Float32Array(Math.ceil(rate*duration/1000));let seed=0x3405a3;let filtered=0;const phases=[0,0,0];
 for(let i=0;i<pcm.length;i++){
  const p=i/(pcm.length-1);seed=(Math.imul(seed,1664525)+1013904223)>>>0;const white=seed/2147483648-1;filtered+=.11*(white-filtered);let sample=0;
  for(let k=0;k<3;k++){
   const t=(p-STARTS[k])/SPAN;if(t<0||t>=1)continue;
   const launch=smooth(0,.05,t)*(1-smooth(.08,.34,t));
   const receive=smooth(.30,.67,t)*(1-smooth(.80,1,t));
   phases[k]+=Math.PI*2*(92+18*k+55*smooth(.25,.88,t))/rate;
   sample+=launch*(filtered*.11+Math.sin(phases[k])*.055)+receive*(Math.sin(phases[k])*.045+Math.sin(phases[k]*2.63)*.012)+filtered*.025*Math.sin(Math.PI*t);
  }
  pcm[i]=sample*Math.min(1,i/220,(pcm.length-1-i)/220);
 }pcm[0]=0;pcm[pcm.length-1]=0;return pcm;
}
function createAudio({context=null,verify=false}={}){const seen=new Set(),playing=new Map();const silent=verify||(typeof location!=='undefined'&&new URLSearchParams(location.search).has('verify'));let ended=false;
 const stop=id=>{const v=playing.get(id);if(!v)return;v.gain.gain.setTargetAtTime(0,context.currentTime,.01);try{v.source.stop(context.currentTime+.05);}catch{}playing.delete(id);};
 return {silent,start(id,age=0,duration=1500){if(ended||!id||seen.has(id)||age<0)return false;seen.add(id);if(seen.size>128)seen.delete(seen.values().next().value);if(silent||age>80||!context||context.state!=='running')return false;const pcm=synthesize(context.sampleRate,duration);const buffer=context.createBuffer(1,pcm.length,context.sampleRate);buffer.copyToChannel(pcm,0);const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;gain.gain.value=.85;source.connect(gain);gain.connect(context.destination);source.start();playing.set(id,{source,gain});source.onended=()=>{source.disconnect();gain.disconnect();playing.delete(id);};return true;},stop,dispose(){ended=true;for(const id of playing.keys())stop(id);seen.clear();}};
}
const api={VERSION,STARTS,SPAN,phaseData,shader,createRenderer,synthesize,createAudio};if(typeof module!=='undefined'&&module.exports)module.exports=api;else global.DvaStaminaAstraCleanV3=api;
})(globalThis);
