const q=new URLSearchParams(location.search), verify=q.has('verify');
if(verify) document.body.classList.add('verify');
const SCENES=new Set(['all','ambient','bed','cabinet','bath','upload','sink','chair']);
let scene=SCENES.has(q.get('state'))?q.get('state'):'all';
const fixedFrame=verify&&q.has('frame')?Math.max(0,Math.min(1.3,Number(q.get('frame')))):null;
const reducedMotion=q.has('reduced');
const canvas=document.querySelector('#view'),status=document.querySelector('#status'),errorBox=document.querySelector('#error');
const audioButton=document.querySelector('#audio');
const APIs={environment:globalThis.DvaWebGPUMedicalEnvironmentE,bed:globalThis.DvaWebGPUMedicalObjectE,
 cabinet:globalThis.DvaWebGPUMedicalCabinetE,bath:globalThis.DvaWebGPUMedicalFootbathUseE,
 upload:globalThis.DvaWebGPUMedicalUploadConsoleE,fixture:globalThis.DvaWebGPUMedicalFixtureE};
const camera={x:2200,y:2520},zoom=1,viewport={width:950,height:780,pixelWidth:950,pixelHeight:780};
const ROOM_TEXTURE='../medical-chatgpt-attempt2-b.png';
const shader=`
@group(0) @binding(0) var image:texture_2d<f32>;
struct Out{@builtin(position) position:vec4f,@location(0) uv:vec2f}
@vertex fn vs(@builtin(vertex_index) i:u32)->Out{
 let c=array<vec2f,6>(vec2f(0,0),vec2f(1,0),vec2f(0,1),vec2f(0,1),vec2f(1,0),vec2f(1,1))[i];
 var o:Out;o.position=vec4f(c.x*2.-1.,1.-c.y*2.,0.,1.);o.uv=c;return o;
}
@fragment fn fs(o:Out)->@location(0) vec4f{
 let dim=textureDimensions(image);let px=clamp(vec2i(o.uv*vec2f(dim)),vec2i(0),vec2i(dim)-vec2i(1));
 return vec4f(textureLoad(image,px,0).rgb,1.);
}`;
const presets={all:7000,ambient:7000,bed:7000,cabinet:7000,bath:7000,upload:7000,sink:15200,chair:7000};
const verifyBase=verify&&q.has('base')&&Number.isFinite(Number(q.get('base')))?Math.max(0,Math.min(60000,Number(q.get('base')))):null;
const baseTime=()=>verifyBase??presets[scene];
const near={sink:{x:3050,y:2720},chair:{x:2830,y:3080},all:{x:2830,y:3080}};
let device,context,format,basePipeline,baseBind,passes,startTime=performance.now(),audioContext,audioEnabled=false,lastNow=null,failed=false;
let activationSerial=0;
const active=key=>scene==='all'||scene===key;
function acceptedEffect(api,type,startedAt,extra={}) {return {id:`preview-${type}-${activationSerial}`,type:`object-${api.OBJECT.type}`,objectId:api.OBJECT.id,x:api.OBJECT.x,y:api.OBJECT.y,startedAt,...extra};}
function sound(cue){if(verify||!audioEnabled||!audioContext||audioContext.state!=='running')return;
 const at=audioContext.currentTime,osc=audioContext.createOscillator(),gain=audioContext.createGain();
 const character=cue.character||cue.kind||'';
 osc.type=cue.waveform||('chair-upholstery-settle'===character?'triangle':'sine');
 const from=cue.frequencyFrom||cue.frequency||220,to=cue.frequencyTo||from;
 const duration=Math.max(.07,cue.duration||.2),amplitude=Math.max(.0002,cue.gain||.003);
 osc.frequency.setValueAtTime(from,at);osc.frequency.exponentialRampToValueAtTime(Math.max(1,to),at+Math.max(.05,cue.duration||.2));
 gain.gain.setValueAtTime(.0001,at);gain.gain.linearRampToValueAtTime(amplitude,at+Math.min(.035,Math.max(.008,cue.attack||.025)));
 gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
 osc.connect(gain);gain.connect(audioContext.destination);osc.start(at);osc.stop(at+duration);
 osc.onended=()=>{osc.disconnect();gain.disconnect();};
 const textureMix=cue.noiseMix??(cue.noise?.32:(character==='linen-herbal-rustle'?.28:0));
 if(textureMix>0){
  const sampleRate=audioContext.sampleRate,count=Math.max(1,Math.ceil(duration*sampleRate));
  const buffer=audioContext.createBuffer(1,count,sampleRate),data=buffer.getChannelData(0);
  let seed=2166136261;for(const char of String(cue.id||character)){seed^=char.charCodeAt(0);seed=Math.imul(seed,16777619);}
  for(let i=0;i<count;i++){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;data[i]=((seed>>>0)/2147483648-1)*(.64+.36*Math.sin(i/sampleRate*64));}
  const noise=audioContext.createBufferSource(),filter=audioContext.createBiquadFilter(),textureGain=audioContext.createGain();
  filter.type='bandpass';filter.frequency.value=character==='chair-upholstery-settle'?340:character==='linen-herbal-rustle'?1050:character==='porcelain-water-beads'?1650:620;
  filter.Q.value=character==='porcelain-water-beads'?1.4:.75;
  textureGain.gain.setValueAtTime(.0001,at);
  textureGain.gain.linearRampToValueAtTime(amplitude*Math.min(1,textureMix),at+Math.min(.05,Math.max(.009,cue.attack||.025)));
  textureGain.gain.exponentialRampToValueAtTime(.0001,at+duration);
  noise.buffer=buffer;noise.connect(filter);filter.connect(textureGain);textureGain.connect(audioContext.destination);
  noise.start(at);noise.stop(at+duration);noise.onended=()=>{noise.disconnect();filter.disconnect();textureGain.disconnect();};
 }
}
function getNow(){return baseTime()+(fixedFrame!==null?fixedFrame*1000:(performance.now()-startTime));}
function frameBuilder(){const jobs=[];return {stage(){},add(job){jobs.push(job)},jobs};}
function queue(frame,key,planned){if(!planned)return false;const result=passes[key].record({frame,target:'medical-room',viewport,planned});return result.drawn;}
function render(){if(failed)return;try{
 const now=getNow(),t0=baseTime();const frame=frameBuilder();
 const environment=APIs.environment.plan({camera,zoom,viewport,now,mode:'balanced',intensity:.72,reducedMotion});
 queue(frame,'environment',environment);
 const effects={bed:acceptedEffect(APIs.bed,'bed',t0),cabinet:acceptedEffect(APIs.cabinet,'cabinet',t0,{effectKind:APIs.cabinet.OBJECT.effectKind}),bath:acceptedEffect(APIs.bath,'bath',t0)};
 const drawn={environment:true};
 for(const key of ['bed','cabinet','bath'])if(active(key))drawn[key]=queue(frame,key,APIs[key].plan({camera,zoom,viewport,now,effect:effects[key],intensity:1,reducedMotion}));
 let uploadCompletion=null;
 if(active('upload')){
  const completion={id:`preview-upload-${activationSerial}`,type:'action-task',mode:'upload',targetId:'upload-d',targetX:APIs.upload.STATION.x,targetY:APIs.upload.STATION.y,startedAt:t0,duration:750};
  const elapsed=now-t0;const activeUpload=elapsed<450?{id:'preview-upload',stationId:'upload-d',progress:Math.min(.94,Math.max(0,elapsed/460))}:null;
  uploadCompletion=elapsed>=450?{...completion,startedAt:t0+450}:null;
  drawn.upload=queue(frame,'upload',APIs.upload.plan({station:{...APIs.upload.STATION,type:'task'},task:{stationId:'upload-d',type:'upload',done:false},activeUpload,completion:uploadCompletion,camera,zoom,viewport,now,intensity:1,reducedMotion}));
 }
 const fixturePlayer=near[scene]||near.all;
 for(const [name,id] of [['sink','medical-handwash-sink-1'],['chair','medical-patient-chair-1']])if(active(name))
  drawn[name]=queue(frame,'fixture',APIs.fixture.plan({fixtureId:id,player:fixturePlayer,camera,zoom,viewport,now,intensity:1,reducedMotion}));
 const encoder=device.createCommandEncoder(),target=context.getCurrentTexture().createView();
 {const pass=encoder.beginRenderPass({colorAttachments:[{view:target,loadOp:'clear',storeOp:'store',clearValue:{r:0,g:0,b:0,a:1}}]});pass.setPipeline(basePipeline);pass.setBindGroup(0,baseBind);pass.draw(6);pass.end();}
 for(const job of frame.jobs){const pass=encoder.beginRenderPass({colorAttachments:[{view:target,loadOp:'load',storeOp:'store'}]});job.encode(pass,{width:950,height:780});pass.end();}
 device.queue.submit([encoder.finish()]);
 if(!verify&&audioEnabled&&now-(lastNow??t0-1)<250){const listener={x:2675,y:2910},previousNow=lastNow??t0-1;
   for(const cue of APIs.environment.planSfx({previousNow,now,mode:'balanced',audible:true,listener}))sound(cue);
   for(const key of ['bed','cabinet','bath'])if(active(key))for(const cue of APIs[key].planSfx({effect:effects[key],previousNow,now,audible:true,listener}))sound(cue);
   if(uploadCompletion)for(const cue of APIs.upload.planSfx({completion:uploadCompletion,previousNow,now,audible:true,listener}))sound(cue);
   for(const [name,id] of [['sink','medical-handwash-sink-1'],['chair','medical-patient-chair-1']])if(active(name))for(const cue of APIs.fixture.planSfx({fixtureId:id,player:fixturePlayer,previousNow,now,audible:true,listener}))sound(cue);}
 lastNow=now;
 const shown=Object.entries(drawn).filter(([,yes])=>yes).map(([name])=>name).join(', ');
 status.textContent=verify?`WebGPU描画済み・${scene}・${fixedFrame?.toFixed(2)??'経過'}秒・無音｜${shown}`:`WebGPU描画済み・${scene}｜${shown}`;
 globalThis.__medicalRoomPreview={ready:true,scene,now,drawn,drawCalls:frame.jobs.length,source:ROOM_TEXTURE,verify};
 if(fixedFrame===null)requestAnimationFrame(render);
 }catch(error){failed=true;errorBox.textContent=String(error.stack||error);status.textContent='WebGPU描画に失敗';globalThis.__medicalRoomPreview={ready:false,error:String(error)};}}
async function start(){if(!navigator.gpu)throw new Error('WebGPU が利用できません');
 for(const [key,api]of Object.entries(APIs))if(!api||typeof api.create!=='function')throw new Error(`${key} E module missing`);
 const adapter=await navigator.gpu.requestAdapter();if(!adapter)throw new Error('WebGPU adapter unavailable');
 device=await adapter.requestDevice();context=canvas.getContext('webgpu');if(!context)throw new Error('WebGPU context unavailable');
 format=navigator.gpu.getPreferredCanvasFormat();context.configure({device,format,alphaMode:'opaque'});
 const response=await fetch(ROOM_TEXTURE);if(!response.ok)throw new Error(`採用画像の読込に失敗: ${response.status}`);
 const bitmap=await createImageBitmap(await response.blob());if(bitmap.width!==1384||bitmap.height!==1136)throw new Error('採用画像の原寸が 1384×1136 と異なります');
 const texture=device.createTexture({size:[bitmap.width,bitmap.height],format:'rgba8unorm',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
 device.queue.copyExternalImageToTexture({source:bitmap},{texture},[bitmap.width,bitmap.height]);bitmap.close();
 const baseModule=device.createShaderModule({code:shader});
 const compilationErrors=[];
 for(const [key,source]of [['base',baseModule],...Object.entries(APIs).map(([key,api])=>[key,device.createShaderModule({code:api.shader})])]){
  const info=await source.getCompilationInfo();const errors=info.messages.filter(message=>message.type==='error');
  if(errors.length)compilationErrors.push(`${key}: ${errors.map(message=>`${message.lineNum}:${message.linePos} ${message.message}`).join('\n')}`);
 }
 if(compilationErrors.length)throw new Error(compilationErrors.join('\n'));
 basePipeline=device.createRenderPipeline({layout:'auto',vertex:{module:baseModule,entryPoint:'vs'},fragment:{module:baseModule,entryPoint:'fs',targets:[{format}]},primitive:{topology:'triangle-list'}});
 baseBind=device.createBindGroup({layout:basePipeline.getBindGroupLayout(0),entries:[{binding:0,resource:texture.createView()}]});
 passes=Object.fromEntries(Object.entries(APIs).map(([key,api])=>[key,api.create({device,format})]));
 device.lost.then(info=>{failed=true;status.textContent='WebGPU device lost';errorBox.textContent=info.message||'';});
 requestAnimationFrame(render);
}
for(const button of document.querySelectorAll('[data-scene]'))button.addEventListener('click',()=>{
 scene=button.dataset.scene;activationSerial++;startTime=performance.now();lastNow=null;
 for(const other of document.querySelectorAll('[data-scene]'))other.setAttribute('aria-pressed',String(other===button));
});
audioButton.addEventListener('click',async()=>{if(verify)return;try{
 audioContext??=new (window.AudioContext||window.webkitAudioContext)();
 audioEnabled=!audioEnabled;if(audioEnabled)await audioContext.resume();else await audioContext.suspend();
 audioButton.textContent=audioEnabled?'音を消す':'音を有効にする';audioButton.setAttribute('aria-pressed',String(audioEnabled));
}catch{audioButton.disabled=true;audioButton.textContent='音を利用できません';}});
if(verify){audioButton.disabled=true;audioButton.textContent='検証中は無音';}
start().catch(error=>{failed=true;status.textContent='起動失敗';errorBox.textContent=String(error.stack||error);globalThis.__medicalRoomPreview={ready:false,error:String(error)};});
