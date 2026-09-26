(function(g){'use strict';
const VERSION='stamina-astra-clean-v2';
const clamp=x=>Math.min(1,Math.max(0,x));
const ease=(a,b,x)=>{const q=clamp((x-a)/(b-a));return q*q*(3-2*q);};
function state(age,duration=1500){
 if(!Number.isFinite(age)||!Number.isFinite(duration)||duration<=0)return {p:-1,supply:0,deposited:0,pressure:0};
 const p=age/duration;if(p<=0||p>=1)return {p,supply:0,deposited:0,pressure:clamp(p)};
 return {p,supply:ease(0,.12,p)*(1-ease(.54,.90,p)),deposited:ease(.25,.76,p)*(1-ease(.84,1,p)),pressure:ease(.10,.82,p)};
}
const WGSL=String.raw`
struct Params { size:vec2f, p:f32, reduced:f32, actors:array<vec4f,2> };
@group(0) @binding(0) var<uniform> u:Params;
@group(0) @binding(1) var portrait:texture_2d<f32>;
@group(0) @binding(2) var sampler0:sampler;
@vertex fn vert(@builtin(vertex_index) index:u32)->@builtin(position) vec4f {
 let vertices=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3));return vec4f(vertices[index],0,1);
}
fn turn(p:vec2f,a:f32)->vec2f {let c=cos(a);let s=sin(a);return vec2f(c*p.x+s*p.y,-s*p.x+c*p.y);}
// 面の幅・湾曲・前後厚みを独立に持つ。線や輪郭strokeから主形を生成しない。
fn fold(q:vec2f,center:vec2f,radius:vec2f,rotation:f32,bending:f32,aa:f32)->vec4f {
 let local=turn(q-center,rotation);let t=local.y/radius.y;
 let span=radius.x*pow(max(0.,1.-t*t),.62)*(1.+.16*t);
 let axis=bending*(t*t-.35);
 let x=local.x-axis;
 let outer=max(abs(x)-span,abs(local.y)-radius.y);
 // 身体へ向く側の開口。閉じた楕円・防壁にならず、厚い折れ面を残す。
 let hollow=(length((local-vec2f(radius.x*.78,-radius.y*.18))/vec2f(radius.x*.66,radius.y*.64))-1.)*radius.x;
 let distance=max(outer,-hollow);
 let cover=1.-smoothstep(-aa,aa,distance);
 let across=x/max(span,.003);
 let density=sqrt(max(0.,1.-across*across))*cover;
 let relief=(.32+.68*pow(clamp(.5-.5*across,0.,1.),.65))*cover;
 let crease=exp(-pow((across+.40+.19*sin(t*2.8))/.20,2.))*cover;
 let glow=exp(-max(distance,0.)*52.)*.19;
 return vec4f(cover,density*relief,crease,glow);
}
fn bodyUv(q:vec2f)->vec2f{return (q*224.+vec2f(128.,240.))/256.;}
fn sprite(q:vec2f)->vec4f {let uv=bodyUv(q);if(any(uv<vec2f(0.))||any(uv>vec2f(1.))){return vec4f(0.);}return textureSampleLevel(portrait,sampler0,uv,0.);}
fn drawFold(rgb:vec3f,f:vec4f,power:f32,front:bool)->vec3f {
 let pigment=mix(vec3f(.22,.053,.008),vec3f(.93,.34,.046),f.y);
 let alpha=f.x*power*select(.58,.27,front);
 let emissive=(vec3f(.85,.28,.025)*f.y*.62+vec3f(1.45,.93,.30)*f.z*.45+vec3f(.40,.12,.007)*f.w)*power;
 return mix(rgb,pigment,alpha)+emissive;
}
@fragment fn frag(@builtin(position) xy:vec4f)->@location(0) vec4f {
 var rgb=pow(vec3f(.055,.072,.09),vec3f(2.2));
 let p=u.p;let valid=p>0.&&p<1.;
 let compression=smoothstep(.10,.82,p);
 let supply=smoothstep(0.,.12,p)*(1.-smoothstep(.54,.90,p));
 let deposited=smoothstep(.25,.76,p)*(1.-smoothstep(.84,1.,p));
 for(var i=0u;i<2u;i++){
  let a=u.actors[i];let q=(xy.xy-a.xy)/a.z;let aa=.7/a.z;
  if(abs(q.x)>.85||q.y< -1.12||q.y>.18){continue;}
  let headProtection=smoothstep(-.70,-.60,q.y);
  // L1: 背面の厚い曲面。供給が身体へ近付くにつれて中心と幅が収縮する。
  if(valid&&supply>0.){
   let rotation=-.74+.30*compression*(1.-u.reduced*.75);
   let back=fold(q,vec2f(-.24*(1.-compression),-.57+.05*compression),vec2f(.30-.12*compression,.36-.045*compression),rotation,.105,aa);
   rgb=drawFold(rgb,back,supply,false);
  }
  let tex=sprite(q);let albedo=pow(tex.rgb,vec3f(2.2));rgb=mix(rgb,albedo,tex.a);
  if(valid){
   // L3: 身体の面積を使って受け渡しを示す。資源値や輪郭ゲージは表示しない。
   let reach=length(vec2f(q.x/.48,(q.y+.48)/.60));
   let arrival=smoothstep(.25+reach*.12,.52+reach*.18,p);
   let end=1.-smoothstep(.84,1.,p);
   let response=arrival*end*tex.a*headProtection;
   let warm=vec3f(.65,.25,.035)*(0.50+0.50*albedo);
   let storedDepth=.60+.58*exp(-pow(q.x/.20,2.)-pow((q.y+.41)/.26,2.));
   rgb+=warm*response*storedDepth*.75;
   // 濃い内部と明るい折れ目を持つL2が体幹の前を通り、そこへ吸収される。
   if(supply>0.){
    let rotation=2.53+.28*compression*(1.-u.reduced*.75);
    let face=fold(q,vec2f(.25*(1.-compression),-.27-.16*compression),vec2f(.25-.085*compression,.32-.055*compression),rotation,.085,aa);
    let bodyWindow=1.-.46*tex.a;
    rgb=drawFold(rgb,face,supply*headProtection*bodyWindow,true);
   }
   // OBS1は受け渡し済みの身体領域へ束縛。外側の体積の代替にしない。
   let neighboring=max(max(sprite(q+vec2f(.028,0.)).a,sprite(q-vec2f(.028,0.)).a),max(sprite(q+vec2f(0.,.028)).a,sprite(q-vec2f(0.,.028)).a));
   rgb+=vec3f(.23,.075,.009)*deposited*max(0.,neighboring-tex.a)*headProtection;
  }
 }
 rgb=rgb/(1.+rgb*.32);return vec4f(pow(rgb,vec3f(1./2.2)),1.);
}`;
async function createRenderer(canvas){
 if(!navigator.gpu)throw Error('WebGPU unavailable');const adapter=await navigator.gpu.requestAdapter({powerPreference:'high-performance'});if(!adapter)throw Error('No GPU adapter');
 const device=await adapter.requestDevice();const errors=[];device.addEventListener('uncapturederror',e=>errors.push(e.error.message));
 const shader=device.createShaderModule({code:WGSL});const compilation=await shader.getCompilationInfo();const messages=Array.from(compilation.messages,m=>({type:m.type,message:m.message,line:m.lineNum}));if(messages.some(m=>m.type==='error')){device.destroy();throw Error(JSON.stringify(messages));}
 device.pushErrorScope('validation');const context=canvas.getContext('webgpu');const format=navigator.gpu.getPreferredCanvasFormat();context.configure({device,format,alphaMode:'opaque'});
 const pipeline=await device.createRenderPipelineAsync({layout:'auto',vertex:{module:shader,entryPoint:'vert'},fragment:{module:shader,entryPoint:'frag',targets:[{format}]}});
 const response=await fetch('assets/generated/philia-front-nine-v752.png');if(!response.ok)throw Error('Missing body fixture');const bitmap=await createImageBitmap(await response.blob(),0,0,256,256,{premultiplyAlpha:'none'});
 const texture=device.createTexture({size:[256,256],format:'rgba8unorm',usage:GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT});device.queue.copyExternalImageToTexture({source:bitmap},{texture},{width:256,height:256});bitmap.close();
 const buffer=device.createBuffer({size:48,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const group=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer}},{binding:1,resource:texture.createView()},{binding:2,resource:device.createSampler({magFilter:'linear',minFilter:'linear'})}]});
 const invalid=await device.popErrorScope();if(invalid)throw Error(invalid.message);let disposed=false,frames=0;
 return {version:VERSION,errors,messages,adapterInfo:adapter.info,
  async draw(p,{width=680,height=280,dpr=1,reduced=false}={}){
   if(disposed)throw Error('Disposed');if(![p,width,height,dpr].every(Number.isFinite)||width<=0||height<=0||dpr<=0)throw TypeError('Invalid frame');
   const w=Math.round(width*dpr),h=Math.round(height*dpr);if(canvas.width!==w)canvas.width=w;if(canvas.height!==h)canvas.height=h;canvas.style.width=width+'px';canvas.style.height=height+'px';
   device.queue.writeBuffer(buffer,0,new Float32Array([w,h,p,reduced?1:0,width*.31*dpr,210*dpr,100*dpr,0,width*.71*dpr,210*dpr,64*dpr,0]));
   const encoder=device.createCommandEncoder();const pass=encoder.beginRenderPass({colorAttachments:[{view:context.getCurrentTexture().createView(),loadOp:'clear',storeOp:'store',clearValue:{r:0,g:0,b:0,a:1}}]});pass.setPipeline(pipeline);pass.setBindGroup(0,group);pass.draw(3);pass.end();device.queue.submit([encoder.finish()]);await device.queue.onSubmittedWorkDone();frames++;return {frames,p};
  },dispose(){if(disposed)return;disposed=true;texture.destroy();buffer.destroy();context.unconfigure();device.destroy();}
 };
}
function makePCM(rate=48000,duration=1500){
 if(!Number.isFinite(rate)||rate<8000||!Number.isFinite(duration)||duration<=0||duration>10000)throw TypeError('Invalid PCM parameters');
 const samples=new Float32Array(Math.ceil(rate*duration/1000));let seed=0x9d84be;let lp=0,bp=0,phase1=0,phase2=0;
 for(let i=0;i<samples.length;i++){
  const p=i/(samples.length-1);seed=(Math.imul(seed,1103515245)+12345)>>>0;const noise=seed/2147483648-1;
  lp+=.035*(noise-lp);bp+=.24*(noise-bp);
  const press=Math.pow(Math.sin(Math.PI*clamp(p/.56)),1.65);
  const receive=ease(.20,.50,p)*(1-ease(.65,.94,p));
  const f=118+28*ease(.20,.65,p);phase1+=2*Math.PI*f/rate;phase2+=2*Math.PI*(f*2.08)/rate;
  const sound=(bp-lp)*.19*press+lp*.2*press+receive*(Math.sin(phase1)*.09+Math.sin(phase2)*.026);
  samples[i]=sound*Math.min(1,i/220,(samples.length-1-i)/220);
 }samples[0]=0;samples[samples.length-1]=0;return samples;
}
function createSound({verify=false,context=null}={}){
 const silent=verify||(typeof location!=='undefined'&&new URLSearchParams(location.search).has('verify'));const seen=new Set(),voices=new Map();let disposed=false;
 const cancel=id=>{const v=voices.get(id);if(!v)return;v.gain.gain.setTargetAtTime(0,context.currentTime,.009);try{v.source.stop(context.currentTime+.045);}catch{}voices.delete(id);};
 return {silent,start(id,duration=1500,age=0){if(disposed||!id||seen.has(id)||age<0)return false;seen.add(id);if(seen.size>128)seen.delete(seen.values().next().value);if(silent||!context||context.state!=='running'||age>80)return false;
  const pcm=makePCM(context.sampleRate,duration);const buffer=context.createBuffer(1,pcm.length,context.sampleRate);buffer.copyToChannel(pcm,0);const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;gain.gain.value=.75;source.connect(gain);gain.connect(context.destination);source.start();voices.set(id,{source,gain});source.onended=()=>{source.disconnect();gain.disconnect();voices.delete(id);};return true;
 },cancel,dispose(){disposed=true;for(const id of voices.keys())cancel(id);seen.clear();}};
}
const API={VERSION,WGSL,state,makePCM,createRenderer,createSound};if(typeof module!=='undefined'&&module.exports)module.exports=API;else g.DvaStaminaAstraCleanV2=API;
})(globalThis);
