/* Ordinary mana gain: an open prismatic vault folds into the actor's body.
 * WebGPU shader only; no E image or offscreen Canvas 2D. */
(function(root){
  'use strict';
  const DURATION_MS=1200;
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const ease=(a,b,x)=>{const u=clamp((x-a)/(b-a));return u*u*(3-2*u);};
  const design=Object.freeze({
    id:'gain-mana',durationMs:DURATION_MS,
    source:'Three separated, translucent refractive faces in the actor-adjacent air.',
    transport:'Three visible, thick prismatic faces translate inward while a broad fold crosses each face.',
    recipient:'A sternum contact opens into a wide, body-shaped caustic that visibly fills downward.',
    timing:Object.freeze({appearance:[0,180],fold:[150,480],contact:[350,900],closure:[900,1200]}),
    clock:'Actor presentation milliseconds integrated by caller. Shader does not rescale time.',
    exclusion:'gain-mana variant desire-recovery belongs to Renki, not benefit E.',
    size:'Approximately 110 x 120 world units at normal zoom around a 105-unit actor.',
    sound:'Brief glass-air reveal, folding inharmonic resonance, and compact contact bloom.',
    provenance:'DVA E design quality contract 2026-09-24, B Codex-honoo 26ccab76342b7eec7a8b9e3164afd825e1838bdd.'
  });
  function plan({effect,actorElapsedMs,camera,zoom,viewport,reducedMotion=false}={}){
    if(!effect||effect.type!=='gain-mana'||effect.variant==='desire-recovery'||
       (effect.effectKind!=null&&effect.effectKind!=='mana')||
       effect.id==null||!effect.causeId||!effect.actorWorld||!camera||!viewport)return null;
    const values=[effect.actorWorld.x,effect.actorWorld.y,camera.x,camera.y,zoom,
      viewport.width,viewport.height,viewport.pixelWidth,viewport.pixelHeight,
      actorElapsedMs,effect.duration??DURATION_MS];
    if(!values.every(Number.isFinite)||zoom<=0||viewport.width<=0||viewport.height<=0||
       viewport.pixelWidth<=0||viewport.pixelHeight<=0||values[10]<=0)return null;
    const t=actorElapsedMs/values[10];
    if(t<0||t>=1)return null;
    const appearance=ease(0,.11,t)*(1-ease(.90,1,t));
    const fold=ease(.12,.30,t)*(1-ease(.90,1,t));
    const contact=ease(.29,.43,t)*(1-ease(.87,1,t));
    const closing=ease(.86,1,t);
    const xScale=zoom*viewport.pixelWidth/viewport.width;
    const yScale=zoom*viewport.pixelHeight/viewport.height;
    return Object.freeze({id:String(effect.id),causeId:String(effect.causeId),
      footX:(effect.actorWorld.x-camera.x)*xScale,
      footY:(effect.actorWorld.y-camera.y)*yScale,
      scaleX:xScale,scaleY:yScale,viewport,
      t,actorElapsedMs,duration:values[10],reducedMotion:!!reducedMotion,
      phase:Object.freeze({appearance,fold,contact,closing})});
  }
  function scissorForPlan(planned){
    if(!planned)return null;
    const {viewport,footX,footY,scaleX,scaleY}=planned;
    const x=Math.max(0,Math.floor(footX-66*scaleX));
    const y=Math.max(0,Math.floor(footY-127*scaleY));
    const right=Math.min(viewport.pixelWidth,Math.ceil(footX+66*scaleX));
    const bottom=Math.min(viewport.pixelHeight,Math.ceil(footY+13*scaleY));
    return right>x&&bottom>y?Object.freeze({x,y,width:right-x,height:bottom-y}):null;
  }
  const shader=/* wgsl */`
struct Params { screen: vec4f, body: vec4f, phase: vec4f, control: vec4f };
@group(0) @binding(0) var<uniform> p:Params;
struct Vertex { @builtin(position) position:vec4f };
@vertex fn vs(@builtin(vertex_index) i:u32)->Vertex {
  let xy=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3));
  var v:Vertex;v.position=vec4f(xy[i],0,1);return v;
}
fn bell(x:f32,w:f32)->f32{return exp(-x*x/max(.0001,w*w));}
fn band(y:f32,lo:f32,hi:f32,soft:f32)->f32 {
  return smoothstep(lo-soft,lo+soft,y)*(1.-smoothstep(hi-soft,hi+soft,y));
}
@fragment fn fs(@builtin(position) f:vec4f)->@location(0) vec4f {
  let q=(f.xy-p.body.xy)/p.body.zw;
  let t=p.phase.x;
  let appear=p.phase.y;
  let fold=p.phase.z;
  let contact=p.phase.w;
  let mask=i32(p.control.x);
  let faceOn=select(0.,1.,(mask&1)!=0);
  let seamOn=select(0.,1.,(mask&2)!=0);
  let bodyOn=select(0.,1.,(mask&4)!=0);
  let lightOn=select(0.,1.,(mask&8)!=0);
  let still=p.control.y>.5;
  // A non-circular, three-face vault. Dark gaps between the crown and side
  // faces remain open at every phase; this is world-space supply, not a UI ring.
  let progress=select(smoothstep(.10,.79,t),.72,still);
  let y=q.y;
  let ax=abs(q.x);
  let sideInner=37.-18.*progress+2.*sin((y+83.)*.029);
  let sideOuter=64.-20.*progress+4.*sin((y+96.)*.027);
  let faceY=band(y,-112.+22.*progress,-37.+10.*progress,5.);
  let sidePanel=smoothstep(sideInner-4.,sideInner+4.,ax)*
    (1.-smoothstep(sideOuter-4.,sideOuter+4.,ax))*faceY;
  let depth=clamp((ax-sideInner)/max(1.,sideOuter-sideInner),0.,1.);
  let sideInterior=sidePanel*(.86-.22*depth)*appear*faceOn;
  let sideBoundary=(bell(ax-sideInner,3.4)+bell(ax-sideOuter,3.4)*.7)*
    faceY*appear*faceOn;
  let crownBottom=-79.+22.*progress;
  let crownTop=crownBottom-35.+4.*progress;
  let crownWidth=29.-7.*progress;
  let crownProfile=1.-smoothstep(crownWidth-5.,crownWidth+4.,ax);
  let crownPanel=band(y,crownTop,crownBottom,5.)*crownProfile;
  let crown=crownPanel*(.82-.16*abs(y-(crownTop+crownBottom)*.5)/20.)*appear*faceOn;
  let crownEdge=(bell(y-crownTop,3.6)+bell(y-crownBottom,3.6)+
    bell(ax-crownWidth,3.2))*crownPanel*appear*faceOn;
  // Transport moves along the broad faces. It is distinct from the static
  // face interior; disabling it removes the direction of energy transfer.
  let frontY=-103.+59.*progress;
  let movingSeam=bell(y-frontY,9.)*sidePanel*fold*seamOn;
  let roofFold=bell(y-(crownTop+11.+14.*progress),8.)*crownPanel*fold*seamOn;
  let converging=bell(ax-sideInner+4.,7.)*
    band(y,-78.+11.*progress,-42.+7.*progress,6.)*fold*seamOn;
  // Receipt is a concentrated aperture and a broad translucent body-side
  // volume, not a line, progress bar, or upward-particle aftermath.
  let aperture=bell(length((q-vec2f(0.,-49.))/vec2f(10.,8.)),1.1)*contact*bodyOn;
  let bodyWidth=19.+10.*bell(y+52.,24.)+4.*bell(y+13.,16.);
  let bodyWindow=band(y,-76.,-2.,5.);
  let bodySurface=(1.-smoothstep(bodyWidth-5.,bodyWidth+5.,ax))*bodyWindow;
  let filled=bodySurface*contact*bodyOn;
  let arrivalFront=bell(y-(-66.+59.*progress),12.)*filled;
  let facet=bell(q.x*.42+(y+44.)*.36,13.)*filled;
  let rim=bell(ax-bodyWidth+4.,5.)*bodyWindow*contact*bodyOn;
  let supply=clamp(sideInterior*.28+crown*.24+movingSeam*.24+roofFold*.22,0.,.65);
  let spill=clamp(supply*.19+aperture*.42+arrivalFront*.24,0.,.65)*lightOn;
  let alpha=clamp(sideInterior*.47+crown*.44+sideBoundary*.28+crownEdge*.24+
    movingSeam*.34+roofFold*.31+converging*.24+filled*.32+
    arrivalFront*.32+facet*.18+rim*.22+aperture*.57+spill*.11,0.,.98);
  let indigo=vec3f(.17,.11,.65);
  let azure=vec3f(.13,.51,1.);
  let ice=vec3f(.44,.92,1.);
  let white=vec3f(.92,.98,1.);
  let color=indigo*(sideInterior*.46+crown*.43+filled*.18)+
    azure*(sideInterior*.23+crown*.18+sideBoundary*.48+crownEdge*.49+
      converging*.34+filled*.44+rim*.31)+
    ice*(movingSeam*.68+roofFold*.58+arrivalFront*.56+facet*.28+
      aperture*.32+spill*.31)+
    white*(aperture*.59+movingSeam*.09+arrivalFront*.10);
  return vec4f(color+vec3f(.06,.10,.22)*alpha,alpha);
}`;
  function create({renderer,frameOwner=renderer}={}){
    if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||
       !frameOwner.own||!frameOwner.release)throw new TypeError('Shared WebGPU frame owner required');
    const device=frameOwner.device,format=frameOwner.format;
    const module=device.createShaderModule({label:'Mana benefit E',code:shader});
    const layout=device.createBindGroupLayout({entries:[{binding:0,visibility:3,buffer:{type:'uniform'}}]});
    const pipeline=device.createRenderPipeline({label:'Mana benefit E',
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
    function slot(i){
      if(slots[i])return slots[i];
      const buffer=frameOwner.own(device.createBuffer({label:`Mana benefit uniform ${i}`,size:64,usage:0x40|0x08}));
      const bind=device.createBindGroup({layout,entries:[{binding:0,resource:{buffer}}]});
      return(slots[i]={buffer,bind});
    }
    function record({frame,target,effect,actorElapsedMs,camera,zoom,viewport,
      reducedMotion=false,layerMask=15}={}){
      if(destroyed||frameOwner.state!=='ready')throw new Error('Mana benefit pass unavailable');
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
        planned.t,planned.phase.appearance,planned.phase.fold,planned.phase.contact,
        layerMask,reducedMotion?1:0,0,0]));
      frame.stage('mana-benefit-e');
      frame.add({target,label:`Mana benefit E ${planned.id}`,encode(pass,info){
        if(info.device!==device||info.format!==format||info.width!==viewport.pixelWidth||
           info.height!==viewport.pixelHeight)throw new Error('Mana benefit target mismatch');
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
  root.DvaManaBenefitE=api;
})(typeof globalThis==='undefined'?this:globalThis);
