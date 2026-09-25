(function(root){
'use strict';
const VERSION='stamina-astra-clean-v1';
const finite=(x)=>typeof x==='number'&&Number.isFinite(x);
const clamp=x=>Math.max(0,Math.min(1,x));
function phase(age,duration=1500){return finite(age)&&finite(duration)&&duration>0?age/duration:-1;}
function envelope(p){
  if(!finite(p)||p<=0||p>=1)return {intake:0,transfer:0,legs:0};
  const s=(a,b,x)=>{const q=clamp((x-a)/(b-a));return q*q*(3-2*q);};
  return {intake:s(0,.06,p)*(1-s(.17,.34,p)),transfer:s(.08,.23,p)*(1-s(.34,.52,p)),legs:s(.20,.35,p)*(1-s(.76,1,p))};
}
const shader=String.raw`
struct U { viewport:vec2f, time:f32, reduced:f32, count:f32, pad:vec3f, actors:array<vec4f,4> };
@group(0) @binding(0) var<uniform> u:U;
@group(0) @binding(1) var avatar:texture_2d<f32>;
@group(0) @binding(2) var smp:sampler;
@vertex fn vs(@builtin(vertex_index) i:u32)->@builtin(position) vec4f {
 let xy=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3));return vec4f(xy[i],0,1);
}
fn band(a:f32,b:f32,p:f32)->f32{return smoothstep(a,a+.055,p)*(1.-smoothstep(b-.12,b,p));}
fn bez(a:vec2f,b:vec2f,c:vec2f,t:f32)->vec2f{return mix(mix(a,b,t),mix(b,c,t),t);}
// 曲率・幅・前縁を持つ面。中軸線だけでなく幅を持つ体積投影を返す。
fn sheet(q:vec2f,a:vec2f,b:vec2f,c:vec2f,width:f32,front:f32,back:f32,aa:f32)->vec3f {
 var body=0.;var core=0.;var halo=0.;
 for(var i=0u;i<20u;i++){
  let t0=f32(i)/20.;let t1=f32(i+1u)/20.;let v0=bez(a,b,c,t0);let v1=bez(a,b,c,t1);
  let v=v1-v0;let h=clamp(dot(q-v0,v)/max(dot(v,v),.000001),0.,1.);let t=mix(t0,t1,h);
  let d=length(q-mix(v0,v1,h));
  let w=width*(.22+.78*pow(max(sin(3.14159265*t),0.),.65));
  let ends=smoothstep(back-.11,back+.025,t)*(1.-smoothstep(front-.025,front+.07,t));
  let cov=(1.-smoothstep(w-aa,w+aa,d))*ends;
  body=max(body,cov*(.72+.28*(1.-d/max(w,.001))));
  core=max(core,(1.-smoothstep(w*.18,w*.48+aa,d))*ends*.72);
  halo=max(halo,exp(-max(d-w,0.)*90.)*ends*.20);
 }
 return vec3f(body,core,halo);
}
fn light(f:vec3f,strength:f32)->vec3f {
 // 琥珀の面・薄黄色の芯・近傍光を独立に配分する。
 return strength*(f.x*vec3f(.82,.23,.025)+f.y*vec3f(.95,.68,.22)+f.z*vec3f(.46,.12,.012));
}
fn intake(q:vec2f,p:f32,aa:f32)->vec3f {
 let e=band(0.,.34,p);var f=vec3f(0.);let travelIn=smoothstep(0.,.30,p);
 for(var i=0u;i<2u;i++){
  let sign=select(-1.,1.,i==1u);let span=mix(.48,.30,u.reduced);
  let a=vec2f(sign*(span-.09*travelIn),-.57+.08*travelIn);
  let b=vec2f(sign*.31,-.33);let c=vec2f(sign*.025,-.47);
  f+=light(sheet(q,a,b,c,.067,clamp(.24+travelIn*1.15,0.,1.1),max(0.,travelIn*.8-.08),aa),e);
 }
 return f;
}
fn frontEffect(q:vec2f,p:f32,aa:f32)->vec3f {
 var f=vec3f(0.);let junction=band(.08,.52,p);
 let sq=q-vec2f(0.,-.445);
 let d=length(sq/vec2f(.10,.052));
 f+=vec3f(.95,.39,.055)*exp(-d*d*2.2)*junction;
 let gain=band(.20,1.,p);let travel=smoothstep(.20,.67,p);let absorb=smoothstep(.74,1.,p);
 for(var i=0u;i<2u;i++){
  let sign=select(-1.,1.,i==1u);
  let a=vec2f(sign*.068,-.44);let b=vec2f(sign*(.17-.018*u.reduced),-.26);let c=vec2f(sign*.085,-.015);
  let width=.055*(1.-absorb*.56);
  let field=sheet(q,a,b,c,width,travel*1.18,absorb*.85,aa);
  f+=light(field,gain*(.7+.32*smoothstep(.28,.56,p)));
 }
 return f;
}
fn linear(c:vec3f)->vec3f{return pow(c,vec3f(2.2));}
@fragment fn fs(@builtin(position) pos:vec4f)->@location(0) vec4f {
 var rgb=linear(vec3f(.055,.072,.09));
 for(var i=0u;i<4u;i++){
  if(f32(i)>=u.count){break;}
  let a=u.actors[i];let q=(pos.xy-a.xy)/a.z;let aa=.70/a.z;let p=u.time;
  if(q.x < -.68 || q.x > .68 || q.y < -1.08 || q.y > .12){continue;}
  if(p>0.&&p<.34){rgb+=intake(q,p,aa);}
  // source cell bbox=(57,16)-(198,241), foot=(128,240). H is visible 224px height.
  let uv=(q*224.+vec2f(128.,240.))/256.;
  if(all(uv>=vec2f(0.))&&all(uv<=vec2f(1.))){
   let texel=textureSampleLevel(avatar,smp,uv,0.);rgb=mix(rgb,linear(texel.rgb),texel.a);
  }
  if(p>.08&&p<1.){rgb+=frontEffect(q,p,aa);}
 }
 // 鋭い局所芯を保ちつつ、加算の交差で広い白塊にしない連続露光応答。
 rgb=rgb/(vec3f(1.)+rgb*.42);
 return vec4f(pow(rgb,vec3f(1./2.2)),1.);
}`;
async function createRenderer(canvas,{spriteUrl='assets/generated/philia-front-nine-v752.png'}={}){
 if(!navigator.gpu)throw Error('WebGPU unavailable');
 const adapter=await navigator.gpu.requestAdapter({powerPreference:'high-performance'});
 if(!adapter)throw Error('WebGPU adapter unavailable');
 const device=await adapter.requestDevice();const errors=[];
 device.addEventListener('uncapturederror',e=>errors.push(e.error.message));
 const module=device.createShaderModule({code:shader,label:VERSION});
 const info=await module.getCompilationInfo();
 const messages=Array.from(info.messages,m=>({type:m.type,line:m.lineNum,message:m.message}));
 if(messages.some(m=>m.type==='error')){device.destroy();throw Error(JSON.stringify(messages));}
 device.pushErrorScope('validation');
 const context=canvas.getContext('webgpu');const format=navigator.gpu.getPreferredCanvasFormat();
 context.configure({device,format,alphaMode:'opaque'});
 const pipeline=await device.createRenderPipelineAsync({layout:'auto',vertex:{module,entryPoint:'vs'},fragment:{module,entryPoint:'fs',targets:[{format}]},primitive:{topology:'triangle-list'}});
 const data=await fetch(spriteUrl);if(!data.ok)throw Error('Body fixture unavailable');
 const image=await createImageBitmap(await data.blob(),0,0,256,256,{premultiplyAlpha:'none'});
 const tex=device.createTexture({size:[256,256],format:'rgba8unorm',usage:GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT});
 device.queue.copyExternalImageToTexture({source:image},{texture:tex},{width:256,height:256});image.close();
 const uniform=device.createBuffer({size:112,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});
 const bind=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:uniform}},{binding:1,resource:tex.createView()},{binding:2,resource:device.createSampler({magFilter:'linear',minFilter:'linear'})}]});
 const validation=await device.popErrorScope();if(validation)throw Error(validation.message);
 let disposed=false;let submissions=0;
 return {version:VERSION,messages,errors,adapterInfo:adapter.info,
  async render(p,{width=680,height=300,dpr=1,reducedMotion=false,actors=[{x:210,y:210,height:100},{x:470,y:210,height:64}]}={}){
   if(disposed)throw Error('Renderer disposed');
   if(!finite(p)||![width,height,dpr].every(x=>finite(x)&&x>0)||actors.length>4)throw TypeError('Invalid frame');
   for(const a of actors)if(![a.x,a.y,a.height].every(finite)||a.height<=0)throw TypeError('Invalid actor');
   const w=Math.round(width*dpr),h=Math.round(height*dpr);
   if(canvas.width!==w)canvas.width=w;if(canvas.height!==h)canvas.height=h;
   canvas.style.width=width+'px';canvas.style.height=height+'px';
   const u=new Float32Array(28);u.set([canvas.width,canvas.height,p,reducedMotion?1:0,actors.length]);
   actors.forEach((a,i)=>u.set([a.x*dpr,a.y*dpr,a.height*dpr,0],12+i*4));
   device.queue.writeBuffer(uniform,0,u);
   const encoder=device.createCommandEncoder();const pass=encoder.beginRenderPass({colorAttachments:[{view:context.getCurrentTexture().createView(),loadOp:'clear',storeOp:'store',clearValue:{r:0,g:0,b:0,a:1}}]});
   pass.setPipeline(pipeline);pass.setBindGroup(0,bind);pass.draw(3);pass.end();device.queue.submit([encoder.finish()]);
   await device.queue.onSubmittedWorkDone();submissions++;return {submitted:true,submissions,p};
  },
  dispose(){if(disposed)return;disposed=true;tex.destroy();uniform.destroy();context.unconfigure();device.destroy();}
 };
}
function makeSound(sampleRate=48000,durationMs=1500){
 if(!finite(sampleRate)||sampleRate<8000||!finite(durationMs)||durationMs<1)throw TypeError('Invalid sound length');
 const length=Math.ceil(sampleRate*durationMs/1000);const samples=new Float32Array(length);let seed=0x419a27;let low=0;let ph1=0;let ph2=0;
 for(let i=0;i<length;i++){
  const p=i/(length-1);seed=(Math.imul(seed,1664525)+1013904223)>>>0;const n=seed/2147483648-1;
  low=.92*low+.08*n;const hiss=(n-low);
  const intake=Math.pow(Math.sin(Math.PI*clamp(p/.31)),2)*.052;
  const x=clamp((p-.15)/.68);const body=Math.pow(Math.sin(Math.PI*x),2);
  ph1+=2*Math.PI*(145+65*x)/sampleRate;ph2+=2*Math.PI*(218+105*x)/sampleRate;
  const smoothEdge=Math.min(1,i/256,(length-1-i)/256);
  samples[i]=smoothEdge*(hiss*intake+body*(Math.sin(ph1)*.11+Math.sin(ph2)*.045+low*.06));
 }
 return samples;
}
function createEvents({verify=false,audioContext=null}={}){
 const active=new Map(),seen=new Set(),voices=new Map();let disposed=false;
 // URL verification cannot be overridden by a caller's false flag.
 const silent=verify||(typeof location!=='undefined'&&new URLSearchParams(location.search).has('verify'));
 function stop(id){const v=voices.get(id);if(v){try{v.gain.gain.cancelScheduledValues(v.ctx.currentTime);v.gain.gain.setTargetAtTime(0,v.ctx.currentTime,.008);v.source.stop(v.ctx.currentTime+.04);}catch{}voices.delete(id);}}
 return {
  ingest(event){if(disposed||!event||event.type!=='gain-stamina'||!event.id||!event.playerId||!finite(event.at)||!finite(event.durationMs)||event.durationMs<=0||seen.has(event.id))return false;
   seen.add(event.id);if(seen.size>128)seen.delete(seen.values().next().value);active.set(event.id,{...event,sounded:false});
   if(active.size>128){const oldest=active.keys().next().value;active.delete(oldest);stop(oldest);}return true;},
  frame(now,owners){const out=[];for(const [id,e]of active){const p=phase(now-e.at,e.durationMs);if(p>=1||!owners.has(e.playerId)){active.delete(id);stop(id);continue;}if(p>=0)out.push({...e,p});}return out;},
  receipt(id,now){const e=active.get(id);if(!e||e.sounded||now<e.at)return false;e.sounded=true;
   if(silent||now-e.at>80||!audioContext||audioContext.state!=='running')return false;
   const pcm=makeSound(audioContext.sampleRate,e.durationMs);const buffer=audioContext.createBuffer(1,pcm.length,audioContext.sampleRate);buffer.copyToChannel(pcm,0);
   const source=audioContext.createBufferSource(),gain=audioContext.createGain();source.buffer=buffer;gain.gain.value=.75;source.connect(gain);gain.connect(audioContext.destination);source.start();voices.set(id,{source,gain,ctx:audioContext});source.onended=()=>{source.disconnect();gain.disconnect();voices.delete(id);};return true;},
  cancel(id){active.delete(id);stop(id);},
  dispose(){disposed=true;for(const id of voices.keys())stop(id);active.clear();seen.clear();},
  get silent(){return silent;},get activeCount(){return active.size;}
 };
}
const api={VERSION,shader,phase,envelope,createRenderer,makeSound,createEvents};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.DvaStaminaAstraCleanV1=api;
})(globalThis);

