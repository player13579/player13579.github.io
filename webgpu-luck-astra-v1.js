/** Astra-authored first implementation. Independent of other-model E candidates.
 * Source: e-design-astra/luck-e-design-v1.md revision 2. Preview, NOT game accepted.
 * Coordinates: chest origin, x right/y up/z behind, actual alpha-bounds body H.
 * Density, surface opacity and radiance remain separate until linear composite.
 */
export const LUCK_ASTRA_V1 = Object.freeze({
 version:'astra-luck-v1', author:'GPT-6-Astra', duration:1.45,
 sourceCommit:'26ccab76342b7eec7a8b9e3164afd825e1838bdd',
 baseBlob:'eb33f176862372809bf67057f9a0a5d533e2b9b8',
 extensionBlob:'513273efb4bb177be07de59e91200d382af1856d',
 acceptance:'preview-only; actual GPU and perceptual acceptance require review',
 PH:{PH1:'finite declared fantasy convergence; buildLuckMesh and surface shader',PH2:'declared recipient chest response; response mesh'},
 OBS:{O1:'visible-emission separable local Gaussian; no background-dependent correction',ordinaryPostEffects:false},
 domains:{optics:'emission, transmission, body occlusion',thermal:'N/A no heating',fluid:'N/A no fluid',solid:'N/A no solid deformation',electromagnetic:'N/A no charge',chemical:'N/A no reaction',acoustic:'dedicated cause-synchronous SFX; no world wave interference',biological:'N/A no tissue change'},
 intensityBudget:{surfaceOpacityMax:.70,sourceRadianceMax:.40,glowGain:.48,glowRadiusH:.055},
 rulesToCode:{finiteBoundary:'buildLuckMesh and p >= 1',mainInteriorBoundary:'widthProfile and surface fragment',frontBack:'exclusive z test',sampling:'CSS H to device pixels once',linearAlpha:'premultiplied union then source-over then display encode',SFX:'makeSound and same loop cause/phase'},
});
export const BRANCHES=Object.freeze([
 {p:[[-.92,.35],[-.76,.54],[-.56,.29],[-.38,.13]],w:.30,z:.06,angle:-6,arrival:.34},
 {p:[[-.78,-.33],[-.66,-.42],[-.50,-.25],[-.38,-.13]],w:.27,z:-.07,angle:5,arrival:.43},
 {p:[[.48,.31],[.32,.48],[.04,.34],[-.12,.18]],w:.29,z:.08,angle:7,arrival:.51},
]);
const CLAMP=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const smooth=(a,b,x)=>{const t=CLAMP((x-a)/(b-a));return t*t*(3-2*t);};
export function widthProfile(s){
 const knots=[[0,0],[.16,.82],[.32,1],[.68,.94],[1,.70]];
 for(let i=1;i<knots.length;i++)if(s<=knots[i][0]){
  const [a,v]=knots[i-1],[b,w]=knots[i];return v+(w-v)*smooth(a,b,s);
 }return .70;
}
export function retraction(p){return p<.82?.28*smooth(.62,.82,p):.28+.72*smooth(.82,.92,p);}
function bezier(points,s){const t=1-s;return [0,1].map(k=>t*t*t*points[0][k]+3*t*t*s*points[1][k]+3*t*s*s*points[2][k]+s*s*s*points[3][k]);}
function tangent(points,s){const t=1-s;const v=[0,1].map(k=>3*t*t*(points[1][k]-points[0][k])+6*t*s*(points[2][k]-points[1][k])+3*s*s*(points[3][k]-points[2][k]));const n=Math.hypot(...v);return [-v[1]/n,v[0]/n];}
// Vertex: position xyz, curve s, cross-section q, PH part (A/B/C/collector/response).
// This single geometry builder is both testable design and GPU vertex source.
export function buildLuckMesh(p,{reduced=false}={}){
 if(!Number.isFinite(p)||p<=0||p>=1)return new Float32Array();
 const out=[],tri=(a,b,c)=>out.push(...a,...b,...c);
 const grow=smooth(0,.10,p),s0=retraction(p);
 if(p<.92){
  for(let id=0;id<3;id++){
   const b=BRANCHES[id],angle=(reduced?0:b.angle*Math.PI/180)*(1-smooth(0,.30,p));
   const sample=(s,q)=>{
    let [x,y]=bezier(b.p,s);const n=tangent(b.p,s);
    const offset=(q-.42)*b.w*widthProfile(s)*grow;
    x+=n[0]*offset;y+=n[1]*offset;
    // Entry stays registered; rotation relaxes along final 20% of the sheet.
    const a=angle*(1-smooth(.78,1,s)),dx=x-b.p[3][0],dy=y-b.p[3][1];
    return [b.p[3][0]+dx*Math.cos(a)-dy*Math.sin(a),b.p[3][1]+dx*Math.sin(a)+dy*Math.cos(a),b.z+(-.045-b.z)*s,s,q,id];
   };
   const steps=48,across=12;
   for(let i=0;i<steps;i++)for(let j=0;j<across;j++){
    const a=s0+(1-s0)*i/steps,bS=s0+(1-s0)*(i+1)/steps,q=j/across,r=(j+1)/across;
    const v0=sample(a,q),v1=sample(bS,q),v2=sample(bS,r),v3=sample(a,r);
    tri(v0,v1,v2);tri(v0,v2,v3);
   }
  }
  // Chaikin corner rounding preserves a broad area receiver, never a point junction.
  let ring=[[-.43,.14],[-.25,.23],[-.08,.18],[.065,.035],[.045,-.06],[-.24,-.18],[-.43,-.13]];
  for(let pass=0;pass<2;pass++){const next=[];for(let i=0;i<ring.length;i++){
   const a=ring[i],b=ring[(i+1)%ring.length];next.push([.75*a[0]+.25*b[0],.75*a[1]+.25*b[1]],[.25*a[0]+.75*b[0],.25*a[1]+.75*b[1]]);
  }ring=next;}
  const vertex=(v)=>[v[0],v[1]*grow,-.045,(v[0]+.43)/.495,(v[1]+.18)/.41,3];
  for(let i=0;i<ring.length;i++)tri(vertex([-.23,.025]),vertex(ring[i]),vertex(ring[(i+1)%ring.length]));
 }
 if(p>.30){
  const response=(a)=>[.11*Math.cos(a),.055*Math.sin(a),-.08,.5,.5,4];
  for(let i=0;i<40;i++)tri([0,0,-.08,.5,.5,4],response(i*Math.PI/20),response((i+1)*Math.PI/20));
 }
 return new Float32Array(out);
}

const UNIFORM=`struct U { view:vec4f, time:vec4f, opts:vec4f }; @group(0) @binding(0) var<uniform> u:U;`;
const SURFACE=UNIFORM+`
struct V { @builtin(position) pos:vec4f,@location(0) data:vec4f,@location(1) xy:vec2f };
@vertex fn vs(@location(0) xyz:vec3f,@location(1) sqi:vec3f)->V {
 var o:V;o.pos=vec4f(xyz.x*u.view.z*2/u.view.x,xyz.y*u.view.z*2/u.view.y,0,1);
 o.data=vec4f(sqi,xyz.z);o.xy=xyz.xy;return o;
}
fn on(bit:u32)->f32{return select(0.0,1.0,(u32(u.time.w)&bit)!=0u);}
struct F{@location(0) color:vec4f,@location(1) emission:vec4f};
@fragment fn fs(v:V)->F {
 if((v.data.w>=0.0)!=(u.time.y>0.5)){discard;}
 let p=u.time.x;let s=v.data.x;let q=v.data.y;let id=v.data.z;
 var envelope=smoothstep(0.0,.08,p)*(1.0-smoothstep(.85,.92,p));
 var density=0.0;var edge=1.0;
 if(id<2.5){
  let arrival=select(select(.34,.43,id>.5),.51,id>1.5);
  let center=clamp((p-.025)/(arrival-.025),0.0,1.18);
  let packet=(1.0-smoothstep(.08,.23,abs(s-center)))*(1.0-smoothstep(arrival,arrival+.07,p));
  density=packet;edge=smoothstep(0.0,.045,q)*(1.0-smoothstep(.955,1.0,q));
  if(u.opts.x>.5){density=smoothstep(.06,arrival,p)*(1.0-smoothstep(arrival,arrival+.07,p));}
 }else if(id<3.5){
  // Three broad, offset entry responses; max-union avoids a white triple intersection.
  let da=length((v.xy-vec2f(-.34,.11))/vec2f(.20,.085));
  let db=length((v.xy-vec2f(-.33,-.09))/vec2f(.18,.080));
  let dc=length((v.xy-vec2f(-.12,.14))/vec2f(.17,.070));
  let a=(1.0-smoothstep(.32,.41,p))*smoothstep(.28,.34,p)*(1.0-smoothstep(.3,1.0,da));
  let b=(1.0-smoothstep(.43,.50,p))*smoothstep(.37,.43,p)*(1.0-smoothstep(.3,1.0,db));
  let c=(1.0-smoothstep(.51,.58,p))*smoothstep(.45,.51,p)*(1.0-smoothstep(.3,1.0,dc));
  density=max(max(a,b),c);
 }else{
  envelope=smoothstep(.30,.52,p)*(1.0-smoothstep(.86,1.0,p));
  edge=1.0-smoothstep(.55,1.0,length(v.xy/vec2f(.11,.055)));
  density=.45;
 }
 let w1=select(on(1u),on(4u),id>3.5);
 let w2=select(on(2u),on(4u),id>3.5);
 let opacity=envelope*edge*min(.70,.55*w1+.15*density*w2);
 // Linear-light constants from #EAAF42 and #FFD991. No tone mapping by backdrop.
 let material=mix(vec3f(.823,.429,.054),vec3f(1.0,.694,.283),.18+.35*q+.24*density);
 let emission=envelope*edge*(.12*w1+.28*density*w2);
 var f:F;f.color=vec4f(material*opacity,opacity);f.emission=vec4f(material*emission,emission);return f;
}`;
const FULLSCREEN=`@vertex fn vs(@builtin(vertex_index) i:u32)->@builtin(position) vec4f {
 let pos=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3));return vec4f(pos[i],0,1);
}`;
const COMPOSITE=UNIFORM+`
@group(0) @binding(1) var sam:sampler;
@group(0) @binding(2) var back:texture_2d<f32>;
@group(0) @binding(3) var front:texture_2d<f32>;
@group(0) @binding(4) var rearLight:texture_2d<f32>;
@group(0) @binding(5) var foreLight:texture_2d<f32>;
@group(0) @binding(6) var actor:texture_2d<f32>;
@group(0) @binding(7) var glow:texture_2d<f32>;
fn avatar(pos:vec2f)->vec4f {
 let local=(pos-u.view.xy*.5)/u.view.z;
 let source=vec2f(128.0,105.0)+local*222.0;
 let uv=source/vec2f(768,512);
 let c=textureSampleLevel(actor,sam,uv,0);
 return select(vec4f(0),c,all(source>=vec2f(0))&&all(source<vec2f(256)));
}
fn visibleLight(uv:vec2f,a:f32)->vec3f {
 return textureSampleLevel(foreLight,sam,uv,0).rgb+textureSampleLevel(rearLight,sam,uv,0).rgb*(1.0-a);
}
@fragment fn source(@builtin(position) pos:vec4f)->@location(0) vec4f {
 let uv=pos.xy/u.view.xy;return vec4f(visibleLight(uv,avatar(pos.xy).a),1);
}
fn encode(c:vec3f)->vec3f{return select(12.92*c,1.055*pow(max(c,vec3f(0)),vec3f(1.0/2.4))-.055,c>vec3f(.0031308));}
@fragment fn fsFinal(@builtin(position) pos:vec4f)->@location(0) vec4f {
 let uv=pos.xy/u.view.xy;let b=textureSampleLevel(back,sam,uv,0);let f=textureSampleLevel(front,sam,uv,0);let a=avatar(pos.xy);
 var color=vec3f(.00857,.01521,.02416); // fixed #17212b in linear light
 color=b.rgb+color*(1.0-b.a);
 color=a.rgb*a.a+color*(1.0-a.a);
 color=f.rgb+color*(1.0-f.a);
 color+=visibleLight(uv,a.a);
 if((u32(u.time.w)&8u)!=0u){color+=textureSampleLevel(glow,sam,uv,0).rgb*.48;}
 if(u.opts.y>.5){color=vec3f(max(f.a,b.a*(1.0-a.a)));}
 return vec4f(encode(clamp(color,vec3f(0),vec3f(1))),1);
}`+FULLSCREEN;
const BLUR=UNIFORM+`
@group(0) @binding(1) var sam:sampler;@group(0) @binding(2) var src:texture_2d<f32>;
@fragment fn fs(@builtin(position) pos:vec4f)->@location(0) vec4f {
 let uv=pos.xy/u.view.xy;let step=vec2f(u.opts.z,u.opts.w)*u.view.z*.055/3.0/u.view.xy;
 var sum=textureSampleLevel(src,sam,uv,0).rgb*.270682;
 sum+=(textureSampleLevel(src,sam,uv+step,0).rgb+textureSampleLevel(src,sam,uv-step,0).rgb)*.216745;
 sum+=(textureSampleLevel(src,sam,uv+step*2,0).rgb+textureSampleLevel(src,sam,uv-step*2,0).rgb)*.111281;
 sum+=(textureSampleLevel(src,sam,uv+step*3,0).rgb+textureSampleLevel(src,sam,uv-step*3,0).rgb)*.036633;
 return vec4f(sum,1);
}`+FULLSCREEN;

// A single synthesized event buffer; playback offset joins the visual phase.
// No random particles/noise textures; deterministic band-limited sound only.
export function makeSound(context,duration=1.45){
 const n=Math.ceil(context.sampleRate*duration),buffer=context.createBuffer(2,n,context.sampleRate);
 for(let ch=0;ch<2;ch++){
  const data=buffer.getChannelData(ch);
  for(let i=0;i<n;i++){
   const t=i/context.sampleRate,p=t/duration;
   let v=0;
   const air=smooth(.02,.05,p)*(1-smooth(.16,.23,p));
   for(let h=0;h<13;h++)v+=Math.sin(2*Math.PI*(1117+h*167.1)*t+h*h*1.83+ch*.12)*air*.0015;
   for(let j=0;j<3;j++){
    const onset=BRANCHES[j].arrival,tau=Math.max(0,p-onset),env=smooth(onset,onset+.014,p)*Math.exp(-tau*7)*(1-smooth(.88,1,p));
    const f=[440,587,880][j];
    v+=env*(Math.sin(2*Math.PI*f*t)*.026+Math.sin(2*Math.PI*f*2*t)*.006*(1-smooth(.62,.85,p))+Math.sin(2*Math.PI*f*3*t)*.002);
   }
   data[i]=v*(1-smooth(.97,1,p));
  }
 }return buffer;
}

export async function startLuckAstraPreview(canvas){
 const qs=new URLSearchParams(location.search),verify=qs.has('verify');
 const finite=(key,fallback)=>{const v=Number(qs.get(key));return qs.has(key)&&Number.isFinite(v)?v:fallback;};
 const height=CLAMP(finite('height',100),32,320),rate=CLAMP(finite('rate',1.8),0,3);
 const phase=verify&&qs.has('phase')?CLAMP(finite('phase',0),0,1.1):null;
 const reduced=qs.get('reduced')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches;
 const mask=verify?CLAMP(finite('layers',15),0,15):15,diagnostic=verify&&qs.get('mask')==='1';
 if(!navigator.gpu)throw Error('WebGPU is required');
 const adapter=await navigator.gpu.requestAdapter();if(!adapter)throw Error('No WebGPU adapter');
 const device=await adapter.requestDevice(),context=canvas.getContext('webgpu'),format=navigator.gpu.getPreferredCanvasFormat();
 const errors=[];device.addEventListener('uncapturederror',e=>errors.push(e.error.message));
 let destroyed=false,raf=0,frames=0,last=performance.now(),elapsed=0,cause=0,playedCause=-1,audio,voice,sound;
 let textures=[],bindings,views,w=0,h=0,dpr=1;
 const uniforms=Array.from({length:4},()=>device.createBuffer({size:48,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}));
 const vertices=device.createBuffer({size:1024*1024,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});
 const sampler=device.createSampler({minFilter:'linear',magFilter:'linear',addressModeU:'clamp-to-edge',addressModeV:'clamp-to-edge'});
 const modules=[SURFACE,COMPOSITE,BLUR].map(code=>device.createShaderModule({code}));
 for(const module of modules){const info=await module.getCompilationInfo();for(const m of info.messages)if(m.type==='error')throw Error(`WGSL ${m.lineNum}:${m.linePos} ${m.message}`);}
 const maxBlend={color:{operation:'max',srcFactor:'one',dstFactor:'one'},alpha:{operation:'max',srcFactor:'one',dstFactor:'one'}};
 const shape=await device.createRenderPipelineAsync({layout:'auto',vertex:{module:modules[0],entryPoint:'vs',buffers:[{arrayStride:24,attributes:[{shaderLocation:0,offset:0,format:'float32x3'},{shaderLocation:1,offset:12,format:'float32x3'}]}]},fragment:{module:modules[0],entryPoint:'fs',targets:[{format:'rgba16float',blend:maxBlend},{format:'rgba16float',blend:maxBlend}]},primitive:{topology:'triangle-list'}});
 const screen=async(module,entryPoint,target)=>device.createRenderPipelineAsync({layout:'auto',vertex:{module,entryPoint:'vs'},fragment:{module,entryPoint,targets:[{format:target}]},primitive:{topology:'triangle-list'}});
 const source=await screen(modules[1],'source','rgba16float'),final=await screen(modules[1],'fsFinal',format),blur=await screen(modules[2],'fs','rgba16float');
 const image=new Image();image.src='assets/generated/sophia-front-five-v753.png';await image.decode();
 if(image.width!==768||image.height!==512)throw Error('Actor source registration changed');
 const actor=device.createTexture({size:[768,512],format:'rgba8unorm-srgb',usage:GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT});
 device.queue.copyExternalImageToTexture({source:image},{texture:actor,premultipliedAlpha:false},[768,512]);
 const actorView=actor.createView();
 function group(pipeline,entries){return device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:entries.map(([binding,resource])=>({binding,resource}))});}
 const ub=i=>({buffer:uniforms[i]});
 function resize(){
  dpr=Math.min(2,devicePixelRatio||1);w=Math.max(1,Math.round(canvas.clientWidth*dpr));h=Math.max(1,Math.round(canvas.clientHeight*dpr));
  canvas.width=w;canvas.height=h;context.configure({device,format,alphaMode:'opaque'});
  textures.forEach(t=>t.destroy());textures=Array.from({length:7},()=>device.createTexture({size:[w,h],format:'rgba16float',usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}));views=textures.map(t=>t.createView());
  const all=[[0,ub(0)],[1,sampler],[2,views[0]],[3,views[2]],[4,views[1]],[5,views[3]],[6,actorView],[7,views[6]]];
  bindings={front:group(shape,[[0,ub(0)]]),back:group(shape,[[0,ub(1)]]),
   source:group(source,[[0,ub(0)],[1,sampler],[4,views[1]],[5,views[3]],[6,actorView]]),final:group(final,all),
   blurH:group(blur,[[0,ub(2)],[1,sampler],[2,views[4]]]),blurV:group(blur,[[0,ub(3)],[1,sampler],[2,views[5]]])};
 }
 function stopVoice(){if(voice){try{voice.stop();}catch{}voice.disconnect();voice=null;}}
 function syncSound(p){
  if(verify||!audio||audio.state!=='running'||rate===0||p>=1||phase!==null)return;
  if(playedCause===cause)return;stopVoice();playedCause=cause;
  voice=audio.createBufferSource();voice.buffer=sound;voice.playbackRate.value=rate;voice.connect(audio.destination);voice.start(0,Math.max(0,p*1.45));
 }
 async function unlock(){if(verify||destroyed)return;if(!audio){audio=new AudioContext();sound=makeSound(audio);}await audio.resume();if(!destroyed)syncSound(elapsed/1.45);}
 const attachment=view=>({view,clearValue:[0,0,0,0],loadOp:'clear',storeOp:'store'});
 function draw(now){
  if(destroyed||document.hidden)return;
  const delta=Math.max(0,(now-last)/1000);last=now;
  if(phase===null){const cycle=1.45+.65*Math.max(rate,1);elapsed+=delta*rate;if(elapsed>=cycle){cause+=Math.floor(elapsed/cycle);elapsed%=cycle;}}
  const p=phase===null?elapsed/1.45:phase;
  if(w!==Math.round(canvas.clientWidth*Math.min(2,devicePixelRatio||1))||h!==Math.round(canvas.clientHeight*Math.min(2,devicePixelRatio||1)))resize();
  const mesh=buildLuckMesh(p,{reduced});if(mesh.length)device.queue.writeBuffer(vertices,0,mesh);
  for(let i=0;i<4;i++)device.queue.writeBuffer(uniforms[i],0,new Float32Array([w,h,height*dpr,dpr,p,i===1?1:0,rate,mask,reduced?1:0,diagnostic?1:0,i===2?1:0,i===3?1:0]));
  const encoder=device.createCommandEncoder();
  for(const [viewA,viewB,binding] of [[views[0],views[1],bindings.back],[views[2],views[3],bindings.front]]){
   const pass=encoder.beginRenderPass({colorAttachments:[attachment(viewA),attachment(viewB)]});pass.setPipeline(shape);pass.setBindGroup(0,binding);pass.setVertexBuffer(0,vertices);if(mesh.length)pass.draw(mesh.length/6);pass.end();
  }
  for(const [pipeline,binding,view] of [[source,bindings.source,views[4]],[blur,bindings.blurH,views[5]],[blur,bindings.blurV,views[6]],[final,bindings.final,context.getCurrentTexture().createView()]]){
   const pass=encoder.beginRenderPass({colorAttachments:[attachment(view)]});pass.setPipeline(pipeline);pass.setBindGroup(0,binding);pass.draw(3);pass.end();
  }
  device.queue.submit([encoder.finish()]);frames++;syncSound(p);
  window.__luckAstraV1Snapshot={ready:true,version:LUCK_ASTRA_V1.version,phase:p,heightCSS:height,dpr,rate,vertices:mesh.length/6,frames,cause,errors:[...errors],shaderCompilation:'pass',GPUValidation:errors.length?'failed':'no-errors-observed',visualAcceptance:'not_run',audio:verify?'immutable-verification-mute':audio?.state||'awaiting-gesture',layers:mask};
  canvas.dataset.receipt=JSON.stringify(window.__luckAstraV1Snapshot);
  raf=requestAnimationFrame(draw);
 }
 function visibility(){stopVoice();if(document.hidden){cancelAnimationFrame(raf);}else{last=performance.now();playedCause=-1;raf=requestAnimationFrame(draw);}}
 function destroy(){if(destroyed)return;destroyed=true;cancelAnimationFrame(raf);stopVoice();audio?.close();textures.forEach(t=>t.destroy());actor.destroy();vertices.destroy();uniforms.forEach(b=>b.destroy());device.destroy();canvas.removeEventListener('pointerdown',unlock);document.removeEventListener('visibilitychange',visibility);}
 device.lost.then(info=>{if(!destroyed){errors.push(`Device lost: ${info.message}`);destroy();document.querySelector('#error').textContent='WebGPU device lost';}});
 resize();canvas.addEventListener('pointerdown',unlock);document.addEventListener('visibilitychange',visibility);window.addEventListener('pagehide',destroy,{once:true});raf=requestAnimationFrame(draw);
 return {destroy,metadata:LUCK_ASTRA_V1};
}
