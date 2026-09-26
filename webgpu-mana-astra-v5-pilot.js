(function(root){
 'use strict';
 const VERSION='mana-astra-v5-three-state-pilot';
 const PHASES=[0.2,0.65,1.1];
 const FIXTURE={path:'assets/generated/philia-front-nine-v752.png',width:768,height:768,cell:256,alphaBounds:{x:57,y:16,width:141,height:225},origin:{x:128,y:240}};
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
 const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
 function stateAt(t){
   if(!PHASES.includes(t))throw new Error('Three-state pilot accepts only 0.2, 0.65, 1.1 seconds');
   const r=t===0.2?0:t===0.65?0.48:1;
   const transit=t===0.65?0.12:0;
   return {t,source:1-r-transit,transit,retained:r};
 }
 function norm(p){const l=Math.hypot(...p)||1;return p.map(x=>x/l);}
 function sub(a,b){return a.map((x,i)=>x-b[i]);}
 function cross(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
 // Closed swept source: its thick shoulder, lower turn and consumed inner face
 // are geometry. There is no sprite, glow shell or inherited Mana field.
 function freePoint(u,v,state){
   const a=2*Math.PI*v;
   const belly=Math.pow(Math.max(0,Math.sin(Math.PI*u)),0.70);
   const taper=(1-0.28*u)*belly;
   const s=state.source;
   const consumed=1-s;
   const cx=-0.515+0.04*Math.sin(Math.PI*u)+0.07*u*u;
   const cy=0.35+0.335*u;
   const cz=-0.014+0.052*Math.sin(Math.PI*u)-0.038*u;
   const inner=Math.pow(Math.max(0,Math.cos(a)),1.5);
   const notch=consumed*0.095*Math.exp(-Math.pow((u-0.40)/0.26,2))*inner;
   const rx=0.136*taper*(0.72+0.28*Math.sqrt(s));
   const rz=0.078*taper*Math.sqrt(s);
   const inward=consumed*0.075*Math.pow(u,1.8);
   return[cx+rx*Math.cos(a)-notch+inward,cy-0.012*Math.sin(a)*belly,cz+rz*Math.sin(a)];
 }
 // One open doubly-curved receiving surface. The high/rear and low/front
 // banks are not copies of the outer perimeter; the right edge is body-bound.
 function boundaryPoint(u,v,state){
   const y=2*u-1,x=2*v-1;
   const span=Math.sqrt(Math.max(0.012,1-y*y));
   const localX=0.136*x*span;
   const empty=0.095*(1-x*x)*Math.pow(Math.max(0,Math.sin(Math.PI*u)),0.8);
   const rolled=0.020*Math.exp(-Math.pow((x+0.76)/0.30,2))*Math.sin(Math.PI*u);
   const z=0.005+0.077*y-empty*(1-state.retained*0.96)+rolled;
   return[-0.181+localX,0.522+0.148*y+0.010*x,z];
 }
 function retainedPoint(u,v,state){
   const a=v*Math.PI*2;
   const r=state.retained;
   const shape=Math.pow(Math.max(0,Math.sin(Math.PI*u)),0.75);
   const reach=0.48+0.52*r;
   const rx=0.098*shape*reach*(1.0-0.18*u);
   const rz=(0.027+0.045*r)*shape;
   const x=-0.19+0.037*Math.sin(Math.PI*u)+0.013*u;
   const y=0.415+(0.19+0.035*r)*u;
   const z=-0.028+0.082*r+0.025*u;
   return[x+rx*Math.cos(a),y+0.008*Math.sin(a)*shape,z+rz*Math.sin(a)];
 }
 function transitPoint(u,v,state){
   const a=v*Math.PI*2,shape=Math.sin(Math.PI*u);
   return[-0.365+0.125*u+0.014*Math.sin(Math.PI*u),0.50+0.077*u,
     0.025-0.073*Math.sin(Math.PI*u)+0.046*u].map((n,i)=>n+(i===0?0.038*shape*Math.cos(a):i===1?0.008*shape*Math.sin(a):0.035*shape*Math.sin(a)));
 }
 function surface(fn,nu,nv,material,state){
   const out=[];
   function vert(u,v){
     const p=fn(u,v,state),eps=.0005;
     const du=sub(fn(clamp(u+eps),v,state),fn(clamp(u-eps),v,state));
     const vp=v+eps,vm=v-eps;
     const dv=sub(fn(u,vp,state),fn(u,vm,state));
     let n=norm(cross(du,dv));
     if(material===1&&n[2]<0)n=n.map(x=>-x);
     return [...p,...n,u,v,material];
   }
   for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){
     const a=vert(i/nu,j/nv),b=vert((i+1)/nu,j/nv),c=vert(i/nu,(j+1)/nv),d=vert((i+1)/nu,(j+1)/nv);
     out.push([a,b,c],[c,b,d]);
   }
   return out;
 }
 function geometry(state,omit=''){
   const all=[];
   if(state.source>0&&omit!=='free')all.push(...surface(freePoint,44,36,0,state));
   if(omit!=='boundary')all.push(...surface(boundaryPoint,36,36,1,state));
   if(state.retained>0&&omit!=='retained')all.push(...surface(retainedPoint,36,36,2,state));
   if(state.transit>0&&omit!=='transit')all.push(...surface(transitPoint,24,28,3,state));
   all.sort((a,b)=>a.reduce((s,p)=>s+p[2],0)-b.reduce((s,p)=>s+p[2],0));
   const vertices=new Float32Array(all.flat(2));
   if(!vertices.every(Number.isFinite))throw new Error('Non-finite geometry');
   return vertices;
 }
 async function create({canvas,phase=.2,h=64,mode='normal',omit='',diagnostic='normal',noActor=false}){
   if(!root.navigator?.gpu)throw new Error('WebGPU unavailable; no fallback');
   if(!root.location.search.includes('verify'))throw new Error('Isolated pilot requires verify');
   if(![64,100].includes(h))throw new Error('H must be actual 64 or 100');
   const state=stateAt(phase),errors=[],warnings=[];
   const adapter=await navigator.gpu.requestAdapter({powerPreference:'high-performance'});
   if(!adapter)throw new Error('No WebGPU adapter');
   const device=await adapter.requestDevice();
   device.addEventListener('uncapturederror',e=>errors.push(e.error.message));
   const context=canvas.getContext('webgpu');
   const format=navigator.gpu.getPreferredCanvasFormat();
   const shader=await fetch('webgpu-mana-astra-v5-pilot.wgsl').then(r=>{if(!r.ok)throw new Error('Shader missing');return r.text();});
   const module=device.createShaderModule({label:VERSION,code:shader});
   const compile=await module.getCompilationInfo();
   for(const m of compile.messages)(m.type==='error'?errors:warnings).push(`${m.lineNum}:${m.linePos} ${m.message}`);
   if(errors.length)throw new Error(errors.join('\n'));
   const img=new Image();img.src=FIXTURE.path;await img.decode();
   const tex=device.createTexture({size:[768,768],format:'rgba8unorm-srgb',usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});
   device.queue.copyExternalImageToTexture({source:img},{texture:tex,premultipliedAlpha:true},[768,768]);
   const sampler=device.createSampler({magFilter:'linear',minFilter:'linear'});
   const bgl=device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:'uniform'}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:'float'}}]});
   const layout=device.createPipelineLayout({bindGroupLayouts:[bgl]});
   const blend={color:{srcFactor:'one',dstFactor:'one-minus-src-alpha'},alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha'}};
   const mesh=device.createRenderPipeline({label:'mana-v5-volume-surface',layout,vertex:{module,entryPoint:'meshVS',buffers:[{arrayStride:36,attributes:[{shaderLocation:0,offset:0,format:'float32x3'},{shaderLocation:1,offset:12,format:'float32x3'},{shaderLocation:2,offset:24,format:'float32x2'},{shaderLocation:3,offset:32,format:'float32'}]}]},fragment:{module,entryPoint:'meshFS',targets:[{format,blend}]},primitive:{topology:'triangle-list',cullMode:'none'},depthStencil:{format:'depth24plus',depthWriteEnabled:true,depthCompare:'less-equal'}});
   const sprite=device.createRenderPipeline({label:'existing-philia-fixture',layout,vertex:{module,entryPoint:'quadVS'},fragment:{module,entryPoint:'spriteFS',targets:[{format,blend}]},primitive:{topology:'triangle-list'},depthStencil:{format:'depth24plus',depthWriteEnabled:false,depthCompare:'always'}});
   const glow=device.createRenderPipeline({label:'local-observation-only',layout,vertex:{module,entryPoint:'glowVS'},fragment:{module,entryPoint:'glowFS',targets:[{format,blend}]},primitive:{topology:'triangle-list'},depthStencil:{format:'depth24plus',depthWriteEnabled:false,depthCompare:'always'}});
   const vertices=geometry(state,omit);
   const buffer=device.createBuffer({size:vertices.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});device.queue.writeBuffer(buffer,0,vertices);
   canvas.width=360;canvas.height=240;context.configure({device,format,alphaMode:'opaque'});
   const depth=device.createTexture({size:[360,240],format:'depth24plus',usage:GPUTextureUsage.RENDER_ATTACHMENT});
   const center=202,top=(240-h)/2,scale=h/FIXTURE.alphaBounds.height;
   const spriteRect=[center-FIXTURE.origin.x*scale,top-FIXTURE.alphaBounds.y*scale,256*scale,256*scale];
   const buffers=[];
   const diag={normal:0,front:1,back:2,gray:3,depth:4}[diagnostic];
   if(diag===undefined)throw new Error('Unknown diagnostic');
   function bind(side,rect=spriteRect,intensity=1){
     const ub=device.createBuffer({size:48,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});buffers.push(ub);
     device.queue.writeBuffer(ub,0,new Float32Array([360,240,center,h,side,intensity,top,diag,...rect]));
     return device.createBindGroup({layout:bgl,entries:[{binding:0,resource:{buffer:ub}},{binding:1,resource:sampler},{binding:2,resource:tex.createView()}]});
   }
   const back=bind(0),front=bind(1),actor=bind(0);
   const obs=[];
   if(mode!=='no-glow'){
     // Source-linked supports stay outside the body for rear light. No halo
     // is generated from unseen rear geometry or the whole receiver outline.
     if(state.source>0&&omit!=='free')obs.push({side:0,group:bind(0,[-.45,.455,.13,.16],state.source)});
     if(state.transit>0&&omit!=='transit')obs.push({side:1,group:bind(1,[-.252,.555,.09,.10],1)});
     if(state.retained>0&&omit!=='retained')obs.push({side:1,group:bind(1,[-.137,.53,.11,.13],state.retained*.80)});
   }
   device.pushErrorScope('validation');
   const encoder=device.createCommandEncoder();
   const pass=encoder.beginRenderPass({colorAttachments:[{view:context.getCurrentTexture().createView(),loadOp:'clear',storeOp:'store',clearValue:{r:.012,g:.019,b:.029,a:1}}],depthStencilAttachment:{view:depth.createView(),depthLoadOp:'clear',depthStoreOp:'store',depthClearValue:1}});
   function drawSide(side,bg){
     for(const o of obs.filter(x=>x.side===side)){pass.setPipeline(glow);pass.setBindGroup(0,o.group);pass.draw(6);}
     pass.setPipeline(mesh);pass.setBindGroup(0,bg);pass.setVertexBuffer(0,buffer);pass.draw(vertices.length/9);
   }
   drawSide(0,back);
   if(!noActor){pass.setPipeline(sprite);pass.setBindGroup(0,actor);pass.draw(6);}
   drawSide(1,front);pass.end();device.queue.submit([encoder.finish()]);await device.queue.onSubmittedWorkDone();
   const validation=await device.popErrorScope();if(validation)errors.push(validation.message);
   const infos=adapter.info||{};
   let destroyed=false;
   function destroy(){if(destroyed)return;destroyed=true;buffer.destroy();buffers.forEach(b=>b.destroy());depth.destroy();tex.destroy();context.unconfigure();device.destroy();}
   const snapshot={ready:errors.length===0,version:VERSION,state,h,mode,omit,diagnostic,noActor,canvas:[360,240],dpr:devicePixelRatio,fixture:FIXTURE,spriteRect,renderedAlphaHeight:h,vertexCount:vertices.length/9,passOrder:['rear-world-and-local-OBS','existing-Philia','front-world-and-local-OBS'],compilation:{errors,warnings},adapter:{vendor:infos.vendor,architecture:infos.architecture,device:infos.device,description:infos.description},audio:'not_created_verification_silent',submittedFrames:1,threeStateOnly:true};
   return{snapshot,destroy};
 }
 const api={VERSION,PHASES,FIXTURE,stateAt,geometry,freePoint,boundaryPoint,retainedPoint,create};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.DvaManaV5Pilot=api;
})(typeof globalThis!=='undefined'?globalThis:this);
