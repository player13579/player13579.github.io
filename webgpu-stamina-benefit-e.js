/* Stamina gain E: pressure drawn into the body, stored at the sternum,
 * then delivered along the limbs. No image asset or inherited E shader. */
(function(root){
  'use strict';
  const DURATION_MS=1180;
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const ease=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};
  const design=Object.freeze({
    id:'gain-stamina', durationMs:DURATION_MS,
    cause:'A confirmed stamina gain on one living actor; amount is deliberately not encoded.',
    source:'Body-adjacent pressure sheets at the left and right flank, converging at the sternum.',
    main:'A bright green-white sternum reservoir distributes replenishment through four bent limb conduits.',
    layers:Object.freeze([
      Object.freeze({id:'intake-sheets',mask:1,role:'Two broad opposing surfaces visibly feed inward; removing them removes the supply.'}),
      Object.freeze({id:'central-reservoir',mask:2,role:'The filled sternum and spine sustain the received energy; removing them breaks the transfer.'}),
      Object.freeze({id:'limb-delivery',mask:4,role:'Branching conduits move the charge to hands and feet; removing them loses the result.'}),
      Object.freeze({id:'source-scatter',mask:8,role:'Soft near-field light derives from the active sheets and reservoir; it is never the main silhouette.'})
    ]),
    timing:Object.freeze({arrival:[0,210],accumulation:[110,460],delivery:[250,960],release:[960,1180]}),
    clock:'Actor presentation milliseconds; caller integrates the actor rate. Preview and game pass the same elapsed value.',
    sound:'Air intake rises into a short resonant charged body, then a descending exhale. One sound per cause after submitted frame.',
    size:'At default zoom the field is approximately 116 by 138 world units around a 105-unit-tall actor.',
    provenance:'DVA E quality contract 2026-09-24; B Codex-honoo 26ccab76342b7eec7a8b9e3164afd825e1838bdd.'
  });
  function plan({effect,actorElapsedMs,camera,zoom,viewport,reducedMotion=false}={}){
    if(!effect||effect.type!=='gain-stamina'||!effect.id||!effect.causeId||
       !effect.actorWorld||!camera||!viewport)return null;
    const n=[effect.actorWorld.x,effect.actorWorld.y,camera.x,camera.y,zoom,
      viewport.width,viewport.height,viewport.pixelWidth,viewport.pixelHeight,
      actorElapsedMs,effect.duration??DURATION_MS];
    if(!n.every(Number.isFinite)||zoom<=0||viewport.width<=0||viewport.height<=0||
       viewport.pixelWidth<=0||viewport.pixelHeight<=0||n[10]<=0)return null;
    const t=actorElapsedMs/n[10];
    if(t<0||t>=1)return null;
    const inhale=ease(0,.13,t)*(1-ease(.28,.48,t));
    const reservoir=ease(.095,.28,t)*(1-ease(.80,1,t));
    const delivery=ease(.21,.37,t)*(1-ease(.82,1,t));
    const release=ease(.84,1,t);
    const px=viewport.pixelWidth/viewport.width,py=viewport.pixelHeight/viewport.height;
    return Object.freeze({id:String(effect.id),causeId:String(effect.causeId),t,
      duration:n[10],actorElapsedMs,footX:(effect.actorWorld.x-camera.x)*zoom*px,
      footY:(effect.actorWorld.y-camera.y)*zoom*py,scaleX:zoom*px,scaleY:zoom*py,
      viewport,phase:Object.freeze({inhale,reservoir,delivery,release}),reducedMotion:!!reducedMotion});
  }
  function scissorForPlan(planned){
    if(!planned)return null;
    const {viewport,footX,footY,scaleX,scaleY}=planned;
    const x=Math.max(0,Math.floor(footX-65*scaleX));
    const y=Math.max(0,Math.floor(footY-127*scaleY));
    const right=Math.min(viewport.pixelWidth,Math.ceil(footX+65*scaleX));
    const bottom=Math.min(viewport.pixelHeight,Math.ceil(footY+17*scaleY));
    return right>x&&bottom>y?Object.freeze({x,y,width:right-x,height:bottom-y}):null;
  }
  const shader=/* wgsl */`
struct Params { screen: vec4f, body: vec4f, phase: vec4f, control: vec4f };
@group(0) @binding(0) var<uniform> p:Params;
struct Out { @builtin(position) pos:vec4f };
@vertex fn vs(@builtin(vertex_index) i:u32)->Out {
  let triangle=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3));
  var o:Out;o.pos=vec4f(triangle[i],0,1);return o;
}
fn bell(v:f32,r:f32)->f32{return exp(-v*v/max(.0001,r*r));}
fn seg(q:vec2f,a:vec2f,b:vec2f)->vec2f {
  let d=b-a;let u=clamp(dot(q-a,d)/max(.0001,dot(d,d)),0,1);
  return vec2f(length(q-a-u*d),u);
}
fn tube(q:vec2f,a:vec2f,b:vec2f,r:f32)->f32 {
  let v=seg(q,a,b);return bell(v.x,r)*(smoothstep(0,.06,v.y))*(1-smoothstep(.96,1,v.y));
}
fn route(q:vec2f,a:vec2f,b:vec2f,c:vec2f,width:f32,front:f32)->vec3f {
  let first=seg(q,a,b);let second=seg(q,b,c);
  let nearFirst=first.x<second.x;
  let distance=select(second.x,first.x,nearFirst);
  let progress=select(1.+second.y,first.y,nearFirst);
  let body=bell(distance,width);
  let filled=body*(1.-smoothstep(front-.15,front+.035,progress));
  let pulse=bell(distance,width*.66)*bell(progress-front,.16);
  return vec3f(body,filled,pulse);
}
@fragment fn fs(@builtin(position) f:vec4f)->@location(0) vec4f {
  let q=(f.xy-p.body.xy)/p.body.zw;
  let t=p.phase.x;
  let intake=p.phase.y;let reservoir=p.phase.z;let delivery=p.phase.w;
  let mask=i32(p.control.x);
  let sheetOn=select(0.,1.,(mask&1)!=0);
  let reserveOn=select(0.,1.,(mask&2)!=0);
  let limbOn=select(0.,1.,(mask&4)!=0);
  let obsOn=select(0.,1.,(mask&8)!=0);
  let reduced=p.control.y>.5;
  let lateral=abs(q.x);
  // Two curved air-pressure surfaces fold toward the ribs. Their opening
  // narrows over time rather than merely fading a fixed pair of arcs.
  let bend=pow(clamp(abs(q.y+59.)/54.,0.,1.),1.45);
  let sheetX=46.+16.*bend-20.*smoothstep(0,.42,t);
  let heightGate=smoothstep(-83.,-67.,q.y)*(1.-smoothstep(-22.,-8.,q.y));
  let sheetWidth=9.0+5.0*(1.-smoothstep(.18,.55,t));
  let sheet=bell(lateral-sheetX,sheetWidth)*heightGate*intake*sheetOn;
  let sheetEdge=bell(lateral-sheetX,2.8)*heightGate*intake*sheetOn;
  let feed=bell(q.y+59.,18.)*smoothstep(4.,16.,lateral)*
    (1.-smoothstep(sheetX-3.,sheetX+3.,lateral))*intake*sheetOn;
  // Arrival folds lead into a compact sternum charge, then the charge
  // drains through articulated branches. The body never becomes a gauge.
  let bridge=tube(q,vec2f(-23,-49),vec2f(0,-49),4.)+
             tube(q,vec2f(23,-49),vec2f(0,-49),4.);
  let sternum=bell(length((q-vec2f(0,-49))/vec2f(8,7)),.92)*reservoir*reserveOn;
  let spine=tube(q,vec2f(0,-48),vec2f(0,-29),3.5)*reservoir*reserveOn;
  let intakeBridge=min(1.,bridge)*intake*reserveOn;
  let front=select(clamp((t-.22)*3.7,0.,2.),1.25,reduced);
  // Placement follows the displayed actor: shoulders (~+/-13,-50), hands
  // (~+/-21,-35), knees (~+/-8,-17), feet (~+/-6,-2). This is not a halo.
  let armL=route(q,vec2f(0,-49),vec2f(-14,-52),vec2f(-21,-35),3.4,front);
  let armR=route(q,vec2f(0,-49),vec2f(14,-52),vec2f(21,-35),3.4,front);
  let legL=route(q,vec2f(0,-29),vec2f(-9,-17),vec2f(-6,-2),3.6,front);
  let legR=route(q,vec2f(0,-29),vec2f(9,-17),vec2f(6,-2),3.6,front);
  let branches=clamp(armL.x+armR.x+legL.x+legR.x,0.,1.)*delivery*limbOn;
  let filled=clamp(armL.y+armR.y+legL.y+legR.y,0.,1.)*delivery*limbOn;
  let branchCore=clamp(armL.z+armR.z+legL.z+legR.z,0.,1.)*delivery*limbOn;
  let arrived=select(smoothstep(1.55,1.98,front),
    smoothstep(.48,.72,t),reduced)*delivery*limbOn;
  let terminals=(bell(length(q-vec2f(-21,-35)),5.)+
    bell(length(q-vec2f(21,-35)),5.)+
    bell(length(q-vec2f(-6,-2)),5.)+
    bell(length(q-vec2f(6,-2)),5.))*arrived;
  let stored=clamp(sternum*.92+spine*.44+intakeBridge*.50,0.,1.);
  let surrounding=clamp(sheet*.25+feed*.15+stored*.20+filled*.17,0.,.48)*obsOn;
  let alpha=clamp(sheet*.16+sheetEdge*.24+feed*.26+stored*.44+
    branches*.08+filled*.42+branchCore*.32+terminals*.16+surrounding*.07,0.,.92);
  let emerald=vec3f(.055,.80,.38);
  let mint=vec3f(.25,1.,.62);
  let white=vec3f(.91,1.,.85);
  let emission=emerald*(sheet*.37+feed*.30+surrounding*.11+branches*.07)+
    mint*(sheetEdge*.52+feed*.15+stored*.44+filled*.55+branchCore*.75+terminals*.38)+
    white*(sternum*.37*reserveOn+branchCore*.32+terminals*.18+sheetEdge*.08);
  return vec4f(emission+vec3f(.025,.13,.06)*alpha,alpha);
}`;
  function create({renderer,frameOwner=renderer}={}){
    if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||
       !frameOwner.own||!frameOwner.release)throw new TypeError('Shared WebGPU frame owner required');
    const device=frameOwner.device,format=frameOwner.format;
    const module=device.createShaderModule({label:'Stamina gain E',code:shader});
    const layout=device.createBindGroupLayout({entries:[{binding:0,visibility:3,buffer:{type:'uniform'}}]});
    const pipeline=device.createRenderPipeline({label:'Stamina gain E',
      layout:device.createPipelineLayout({bindGroupLayouts:[layout]}),
      vertex:{module,entryPoint:'vs'},fragment:{module,entryPoint:'fs',targets:[{format,blend:{
        color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
        alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},
      primitive:{topology:'triangle-list'}});
    const ready=module.getCompilationInfo?module.getCompilationInfo().then(info=>{
      const errors=info.messages?.filter(m=>m.type==='error')||[];
      if(errors.length)throw new Error(errors.map(m=>m.message).join('\n'));
    }):Promise.resolve();
    void ready.catch(()=>{});
    const slots=[],indices=new WeakMap();let destroyed=false;
    function slot(index){
      if(slots[index])return slots[index];
      const buffer=frameOwner.own(device.createBuffer({label:`Stamina gain uniform ${index}`,size:64,usage:0x40|0x08}));
      const bind=device.createBindGroup({layout,entries:[{binding:0,resource:{buffer}}]});
      return(slots[index]={buffer,bind});
    }
    function record({frame,target,effect,actorElapsedMs,camera,zoom,viewport,
      reducedMotion=false,layerMask=15}={}){
      if(destroyed||frameOwner.state!=='ready')throw new Error('Stamina gain pass unavailable');
      if(!frame?.add||!frame?.stage||!target)throw new TypeError('Ordered frame and target required');
      if(!Number.isInteger(layerMask)||layerMask<0||layerMask>15)throw new RangeError('Invalid layer mask');
      const planned=plan({effect,actorElapsedMs,camera,zoom,viewport,reducedMotion});
      if(!planned)return {drawn:0,plan:null};
      const scissor=scissorForPlan(planned);
      if(!scissor)return {drawn:0,plan:planned};
      const i=indices.get(frame)||0,{buffer,bind}=slot(i);indices.set(frame,i+1);
      device.queue.writeBuffer(buffer,0,new Float32Array([
        viewport.pixelWidth,viewport.pixelHeight,0,0,
        planned.footX,planned.footY,planned.scaleX,planned.scaleY,
        planned.t,planned.phase.inhale,planned.phase.reservoir,planned.phase.delivery,
        layerMask,reducedMotion?1:0,0,0]));
      frame.stage('stamina-benefit-e');
      frame.add({target,label:`Stamina gain E ${planned.id}`,encode(pass,info){
        if(info.device!==device||info.format!==format||info.width!==viewport.pixelWidth||
           info.height!==viewport.pixelHeight)throw new Error('Stamina gain target mismatch');
        pass.setScissorRect(scissor.x,scissor.y,scissor.width,scissor.height);
        pass.setPipeline(pipeline);pass.setBindGroup(0,bind);pass.draw(3);
      }});
      return {drawn:1,plan:planned};
    }
    return Object.freeze({ready,record,shader,destroy(){
      if(destroyed)return;destroyed=true;
      for(const {buffer} of slots)if(frameOwner.release(buffer))buffer.destroy();
    }});
  }
  const api=Object.freeze({DURATION_MS,design,plan,scissorForPlan,shader,create});
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.DvaStaminaBenefitE=api;
})(typeof globalThis==='undefined'?this:globalThis);
