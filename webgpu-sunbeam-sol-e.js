/* Sunbeam Sol candidate: textureless WebGPU E using the executable design.
 * This pass has no presentation owner; record it into the game's ordered frame. */
(function (root) {
  'use strict';
  const design = root.DvaSunbeamSolDesign ||
    (typeof require === 'function' ? require('./webgpu-sunbeam-sol-design.js') : null);
  const shader = /* wgsl */ `
struct Params {
  screen: vec4f,       // physical width/height, logical-to-physical x/y
  palm: vec4f,         // palm pixel x/y, target pixel x/y
  phase: vec4f,        // supply, extension, carrier, boundary
  state: vec4f,        // progress, OBS scatter, zoom, world range
  control: vec4f,      // ray count, mask, reduced, reserved
};
@group(0) @binding(0) var<uniform> p: Params;
struct VOut { @builtin(position) pos: vec4f };
@vertex fn vs_main(@builtin(vertex_index) i: u32) -> VOut {
  var o: VOut;
  let v = array<vec2f,3>(vec2f(-1.0,-1.0),vec2f(3.0,-1.0),vec2f(-1.0,3.0));
  o.pos=vec4f(v[i],0.0,1.0);
  return o;
}
fn bell(x:f32, s:f32) -> f32 { return exp(-x*x/max(0.001,s*s)); }
fn segment(px:vec2f, a:vec2f, b:vec2f) -> vec2f {
  let d=b-a;
  let len=max(0.001,length(d));
  let axis=d/len;
  let local=px-a;
  return vec2f(dot(local,axis)/len, dot(local,vec2f(-axis.y,axis.x)));
}
@fragment fn fs_main(@builtin(position) frag:vec4f) -> @location(0) vec4f {
  let px=frag.xy;
  let a=p.palm.xy;
  let b=p.palm.zw;
  let q=segment(px,a,b);
  let u=q.x;
  let growth=p.phase.y;
  let endU=max(0.015,growth);
  let range=max(1.0,p.state.w);
  let shortFactor=clamp(range/200.0,0.72,1.0);
  let launched=smoothstep(0.0,0.085,clamp(u,0.0,1.0));
  let shoulder=17.0+12.0*sin(3.14159265*pow(clamp(u,0.0,1.0),0.76));
  let terminal=1.0-0.20*smoothstep(0.76,1.0,u);
  let widthWorld=(8.0+launched*shoulder*terminal)*shortFactor;
  let widthPx=max(2.5,widthWorld*p.state.z*p.screen.z);
  // A bounded, broad optical fold alters the body cross-section; it cannot
  // change the authoritative direction or endpoint.
  let fold=sin(u*14.0-p.state.x*19.0)*sin(3.14159265*clamp(u,0.0,1.0));
  let center=q.y-0.10*widthPx*fold;
  let lateral=abs(center)/widthPx;
  let head=smoothstep(-0.018,0.035,u);
  let tail=1.0-smoothstep(endU-0.027,endU+0.003,u);
  let finite=head*tail;
  let last=1.0-smoothstep(0.973,1.003,u);
  let supplyRadius=max(7.0,16.0*p.state.z*p.screen.z);
  let palmD=length(px-a)/supplyRadius;
  let palmCone=bell(q.y,max(4.0,widthPx*0.49))*
    (1.0-smoothstep(0.015,0.12,u))*smoothstep(-0.055,0.012,u);
  let supply=(bell(palmD,0.87)*0.54+palmCone*0.92)*p.phase.x;
  let bulk=(1.0-smoothstep(0.75,0.98,lateral))*finite*last*p.phase.z;
  let dense=bell(lateral,0.40)*finite*last*p.phase.z;
  let caustic=bell((center/widthPx)-0.50*sin(u*11.0-p.state.x*14.0),0.18);
  let inner=(0.20+0.80*caustic)*dense;
  let shell=bell(lateral-0.91,0.12)*finite*last*p.phase.w;
  let refracted=shell*(0.56+0.44*sin(u*10.0-p.state.x*13.0+center/widthPx*2.5));
  // The end is an attenuation zone of this same volume. No unsupported hit.
  let endD=length(vec2f((u-1.0)*max(1.0,length(b-a)),q.y)) /
    max(5.0,widthPx*1.12);
  let outflow=bell(endD,0.82)*p.phase.z*growth*0.14;
  let obs=bell(lateral,1.39)*finite*last*p.state.y*0.08*p.phase.z;
  let mask=i32(p.control.y);
  let supplyOn=select(0.0,1.0,(mask & 1)!=0);
  let coreOn=select(0.0,1.0,(mask & 2)!=0);
  let boundaryOn=select(0.0,1.0,(mask & 4)!=0);
  let obsOn=select(0.0,1.0,(mask & 8)!=0);
  let S=supply*supplyOn;
  let C=(bulk*0.48+dense*0.26+inner*0.20+outflow)*coreOn;
  let B=refracted*boundaryOn;
  let O=obs*obsOn;
  let n=max(1.0,p.control.x);
  let overlap=1.0/sqrt(n);
  let coverage=clamp((S*0.36+C*0.58+B*0.19)*overlap,0.0,0.74);
  let solar=vec3f(1.0,0.39,0.07);
  let pale=vec3f(1.0,0.69,0.25);
  let hot=vec3f(1.0,0.88,0.52);
  let emission=(solar*(S*0.55+B*0.68)+pale*C*0.50+
    hot*(inner*0.20*coreOn+S*0.16)+solar*O)*overlap;
  return vec4f(emission+coverage*vec3f(0.30,0.12,0.03),coverage);
}`;
  function create({ renderer, frameOwner = renderer } = {}) {
    if (!design?.plan || frameOwner?.state !== 'ready' ||
        !frameOwner.device?.createShaderModule || !frameOwner.own || !frameOwner.release)
      throw new TypeError('Sunbeam Sol needs executable design and shared WebGPU frame owner');
    const device=frameOwner.device, format=frameOwner.format;
    const module=device.createShaderModule({ label:'Sunbeam Sol E', code:shader });
    const bindLayout=device.createBindGroupLayout({ entries:[{binding:0,visibility:3,buffer:{type:'uniform'}}] });
    const layout=device.createPipelineLayout({bindGroupLayouts:[bindLayout]});
    const pipeline=device.createRenderPipeline({label:'Sunbeam Sol E',layout,
      vertex:{module,entryPoint:'vs_main'},
      fragment:{module,entryPoint:'fs_main',targets:[{format,blend:{
        color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
        alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},
      primitive:{topology:'triangle-list'}});
    const ready=module.getCompilationInfo ? module.getCompilationInfo().then(info=>{
      const errors=info.messages?.filter(m=>m.type==='error')||[];
      if(errors.length)throw new Error(errors.map(m=>m.message).join('\n'));
    }) : Promise.resolve();
    void ready.catch(()=>{});
    const slots=[];
    let destroyed=false;
    function slot(index){
      if(slots[index])return slots[index];
      const buffer=frameOwner.own(device.createBuffer({label:`Sunbeam Sol E uniform ${index}`,
        size:80,usage:0x40|0x08}));
      const bind=device.createBindGroup({layout:bindLayout,entries:[{binding:0,resource:{buffer}}]});
      return (slots[index]={buffer,bind});
    }
    function record({frame,target,effect,actorElapsedMs,camera,zoom,viewport,reducedMotion=false,layerMask=15}={}){
      if(destroyed||frameOwner.state!=='ready')throw new Error('Sunbeam Sol pass unavailable');
      if(!frame?.add||!frame?.stage||!target)throw new TypeError('Ordered frame/target required');
      const planned=design.plan({effect,actorElapsedMs,camera,zoom,viewport,reducedMotion});
      if(!planned)return {drawn:0,plan:null};
      if(!Number.isInteger(layerMask)||layerMask<0||layerMask>15)throw new RangeError('Invalid layer mask');
      frame.stage('flora-sunbeam-sol-e');
      const sx=viewport.pixelWidth/viewport.width,sy=viewport.pixelHeight/viewport.height;
      planned.rays.forEach((ray,i)=>{
        const {buffer,bind}=slot(i);
        const v=new Float32Array([
          viewport.pixelWidth,viewport.pixelHeight,sx,sy,
          ray.handX*sx,ray.handY*sy,ray.endX*sx,ray.endY*sy,
          planned.phase.supply,planned.phase.extension,planned.phase.carrier,planned.phase.boundary,
          planned.phase.t,planned.phase.scatter,zoom,planned.rangeWorld,
          planned.rays.length,layerMask,reducedMotion?1:0,0
        ]);
        device.queue.writeBuffer(buffer,0,v);
        frame.add({target,label:`Sunbeam Sol E ${planned.id} hand ${i}`,encode(pass,info){
          if(info.device!==device||info.format!==format||
             info.width!==viewport.pixelWidth||info.height!==viewport.pixelHeight)
            throw new Error('Sunbeam Sol target mismatch');
          pass.setPipeline(pipeline);pass.setBindGroup(0,bind);pass.draw(3);
        }});
      });
      return {drawn:planned.rays.length,plan:planned};
    }
    return Object.freeze({ready,record,shader,destroy(){
      if(destroyed)return;destroyed=true;
      for(const {buffer} of slots)if(frameOwner.release(buffer))buffer.destroy();
    }});
  }
  const api=Object.freeze({shader,create});
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.DvaSunbeamSolE=api;
})(typeof globalThis==='undefined'?this:globalThis);
