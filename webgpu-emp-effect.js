/* Textureless EMP family on the caller's ordered shared WebGPU frame.
 * The app owns authoritative event admission, source ordering and one-shot SFX. */
(function (root) {
  'use strict';
  const TYPES=Object.freeze({emp:0,'emp-charge':1,'emp-resonance':2,
    'emp-cancel':3,'emp-storage-lock':4});
  const DURATIONS=Object.freeze({emp:1200,'emp-charge':1200,'emp-resonance':1600,
    'emp-cancel':1600,'emp-storage-lock':7000});
  const finite=Number.isFinite;
  const ease=value=>{const t=Math.min(1,Math.max(0,value));return t*t*(3-2*t);};
  function seedFor(value){
    const id=String(value||'');let seed=0;
    for(let i=0;i<id.length;i++)seed=(seed*31+id.charCodeAt(i))%997;
    return seed/997;
  }
  const shader=/* wgsl */ `
struct Params { viewport: vec4f, geometry: vec4f, state: vec4f, hue: vec4f };
@group(0) @binding(0) var<uniform> p: Params;
struct Vertex { @builtin(position) pos: vec4f };
@vertex fn vs(@builtin(vertex_index) id:u32)->Vertex {
  let corners=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3));
  var out:Vertex;out.pos=vec4f(corners[id],0,1);return out;
}
fn bell(x:f32,w:f32)->f32{return exp(-x*x/max(w*w,.0001));}
fn hash(n:f32)->f32{return fract(sin(n*73.71+p.geometry.w*113.17)*43758.5453);}
fn ring(r:f32,front:f32,width:f32)->f32{return bell(r-front,width);}
fn smoothrise(x:f32)->f32{return smoothstep(0.0,1.0,x);}
@fragment fn fs(@builtin(position) position:vec4f)->@location(0) vec4f {
  let q=(position.xy-p.viewport.zw)/max(p.geometry.xy,vec2f(.001));
  let r=length(q);
  let t=clamp(p.state.x,0.0,1.0);
  let mode=p.state.y;
  let reduced=p.state.z>.5;
  let axis=vec2f(cos(p.geometry.z),sin(p.geometry.z));
  let along=dot(q,axis);
  let across=dot(q,vec2f(-axis.y,axis.x));
  let angle=atan2(q.y,q.x);
  let sector=floor((angle+3.14159265)/.52359878);
  let sectorNoise=hash(sector);
  let six=pow(abs(cos(angle*3.0)),7.0);
  let alive=smoothstep(0.0,.045,t)*(1.0-smoothstep(.74,1.0,t));
  var energy=0.0;var core=0.0;var violet=0.0;var tint=p.hue.rgb;
  if(mode<.5){
    // Discharge: forward electrical front and three curved major branches.
    let travel=select(.82,smoothrise(t/.78),!reduced);
    let front=.18+.80*travel;
    let fade=1.0-smoothstep(.62,1.0,t);
    let direction=smoothstep(-.65,.35,along/max(r,.015));
    let warped=front*(1.0+.045*sin(angle*3.0+p.geometry.w*6.28318));
    energy=ring(r,warped,.05)*(.22+.78*direction)*fade;
    energy+=ring(r,warped-.13,.12)*direction*.29*fade;
    let branchGate=smoothstep(.02,.16,along)*(1.0-smoothstep(front-.16,front+.04,along));
    let branchA=bell(across-.26*along-.045*sin(along*10.0),.05);
    let branchB=bell(across+.24*along+.05*sin(along*8.0),.05);
    let branchC=bell(across-.035*sin(along*9.0),.06);
    energy+=(branchA+branchB+branchC)*branchGate*.43*fade;
    energy+=six*smoothstep(.13,.27,r)*(1.0-smoothstep(front-.18,front,r))*.10*fade;
    core=bell(r,.18)*(.9-.35*t)+bell(r,.36)*.14*fade;
  }else if(mode<1.5){
    // Charge: six broad linked channels feed a bright central capacitor.
    let convergence=smoothrise(t);
    let reach=select(.45,.78-.35*convergence,!reduced);
    let lanes=six*smoothstep(.08,.19,r)*(1.0-smoothstep(reach-.11,reach+.015,r));
    energy=lanes*(.60+.35*convergence);
    energy+=ring(r,reach,.052)*(.38+.25*convergence);
    energy+=ring(r,.27,.055)*(.28+.22*convergence);
    core=bell(r,.16)*(.70+.55*convergence)+bell(r,.32)*.18;
  }else if(mode<2.5){
    // Two broad electromagnetic fronts cross a sharp violet resonance axis.
    // Each phase has one broad flash; the release drives one outward wave.
    let merge=smoothrise(t/.40);
    let separation=select(.33,.48-.22*merge,!reduced);
    let left=length(vec2f((along+separation)/.72,across/.78));
    let right=length(vec2f((along-separation)/.72,across/.78));
    let front=select(.93,.88+.12*merge,!reduced);
    let primary=ring(left,front,.038)+ring(right,front,.038);
    let shoulders=ring(left,front-.085,.095)+ring(right,front-.085,.095);
    energy=primary*.96+shoulders*.27;
    let contact=bell(along,.095)*(1.0-smoothstep(.42,.83,abs(across)));
    let mergeFlash=bell(t-.31,.055);
    let releaseFlash=bell(t-.65,.055);
    let flash=select(mergeFlash+releaseFlash,
      (mergeFlash+releaseFlash)*.35,reduced);
    violet=bell(along,.028)*(1.0-smoothstep(.49,.83,abs(across)))*
      (.94+.53*contact+.56*flash);
    violet+=bell(along,.11)*(1.0-smoothstep(.54,.94,abs(across)))*.22;
    core=bell(r,.13)*(.48+.63*flash)+bell(r,.30)*flash*.19;
    let release=smoothrise((t-.53)/.43);
    let waveFront=select(.73,.24+.76*release,!reduced);
    let waveGate=smoothstep(.53,.63,t)*(1.0-smoothstep(.86,1.0,t));
    energy+=ring(r,waveFront,.044)*waveGate*.72;
  }else if(mode<3.5){
    // Cancellation: opposite phase fronts collapse onto their collision seam.
    let collapse=smoothrise((t-.16)/.55);
    let separation=select(.23,.42*(1.0-collapse)+.07,!reduced);
    let poleA=length(q-axis*separation);
    let poleB=length(q+axis*separation);
    energy=(bell(poleA,.20)+bell(poleB,.20))*(1.0-.72*collapse)*.72;
    let seam=bell(along,.045+.045*collapse)*(1.0-smoothstep(.2,.55,abs(across)));
    energy+=seam*(.55+.38*bell(t-.48,.3));
    let leftFront=length(vec2f((along+.28)/.58,across/.68));
    let rightFront=length(vec2f((along-.28)/.58,across/.68));
    energy+=(ring(leftFront,1.0,.09)*(1.0-smoothstep(-.25,.04,along))+
      ring(rightFront,1.0,.09)*smoothstep(-.04,.25,along))*.65;
    core=bell(r,.21)*(.40+.48*bell(t-.48,.3));
    tint=mix(vec3f(.11,.70,1.0),vec3f(.73,.39,1.0),smoothstep(-.05,.05,along));
  }else{
    // Equipment storage lock: firm segmented enclosure, diamond and four tabs.
    let oval=length(vec2f(q.x,q.y/.76));
    let broken=mix(.28,1.0,smoothstep(.06,.16,abs(sin(angle*2.0))));
    energy=ring(oval,.64,.062)*broken*.95;
    energy+=ring(oval,.49,.08)*.28;
    energy+=pow(abs(cos(angle*2.0)),10.0)*ring(r,.70,.12)*.57;
    energy+=ring(abs(q.x)+abs(q.y),.42,.055)*.46;
    core=bell(r,.18)*.52;
    tint=vec3f(.48,.52,1.0);
  }
  let envelope=select(alive,smoothstep(0.0,.035,t)*(1.0-smoothstep(.92,1.0,t)),mode>3.5);
  let source=clamp((energy+core+violet)*envelope*p.state.w,0.0,.98);
  let halo=clamp((energy*.24+core*.36+violet*.22)*envelope*p.state.w,0.0,.30);
  let alpha=clamp(source+halo,0.0,.98);
  let color=mix(tint,vec3f(.72,.43,1.0),clamp(violet/(energy+core+violet+.001),0.0,.9));
  let bright=mix(color,vec3f(1.0,1.0,1.0),clamp(core*.60+violet*.35+energy*.20,0.0,.82));
  return vec4f(bright*source+color*halo,alpha);
}`;
  function plan({effect,now,phase,camera,zoom,viewport,reducedMotion=false,alpha=1,
    storageActor=null}={}){
    const mode=TYPES[effect?.type];
    if(mode===undefined||!['playing','meeting'].includes(phase)||
        !effect?.id||!camera||viewport?.kind!=='main')return null;
    const duration=Math.max(DURATIONS[effect.type],Number(effect.duration)||
      Number(effect.durationMs)||0);
    if(![effect.x,effect.y,effect.startedAt,now,camera.x,camera.y,zoom,alpha,
      viewport.width,viewport.height,viewport.pixelWidth,viewport.pixelHeight,duration]
      .every(finite)||zoom<=0||alpha<=0||alpha>1||duration<=0||
      viewport.width<=0||viewport.height<=0||!Number.isInteger(viewport.pixelWidth)||
      !Number.isInteger(viewport.pixelHeight)||viewport.pixelWidth<=0||viewport.pixelHeight<=0)return null;
    const elapsed=now-effect.startedAt,progress=elapsed/duration;
    if(progress<=0||progress>=1)return null;
    let sourceX=effect.x,sourceY=effect.y;
    if(effect.type==='emp-storage-lock'&&storageActor){
      if(String(storageActor.id)!==String(effect.playerId)||!storageActor.alive||storageActor.ejected)return null;
      const x=finite(storageActor.renderedX)?storageActor.renderedX:storageActor.x;
      const y=finite(storageActor.renderedY)?storageActor.renderedY:storageActor.y;
      if(finite(x)&&finite(y)){sourceX=x;sourceY=y;}
    }
    const radiusWorld=Math.max(80,Math.min(520,Number(effect.radius)||260));
    const dprX=viewport.pixelWidth/viewport.width,dprY=viewport.pixelHeight/viewport.height;
    const x=(sourceX-camera.x)*zoom*dprX,y=(sourceY-camera.y)*zoom*dprY;
    const radiusX=radiusWorld*zoom*dprX,radiusY=radiusWorld*zoom*dprY;
    const negative=effect.variant==='negative';
    const values=new Float32Array([
      viewport.pixelWidth,viewport.pixelHeight,x,y,
      radiusX,radiusY,finite(effect.empSourceAxis)?effect.empSourceAxis:0,
      seedFor(effect.playerId||effect.id),
      progress,mode,reducedMotion?1:0,alpha,
      ...(negative?[139/255,117/255,1,0]:[32/255,174/255,1,0])
    ]);
    if(!values.every(finite))return null;
    return Object.freeze({effectId:String(effect.id),type:effect.type,mode,
      ownerId:String(effect.playerId||''),empPulseId:String(effect.empPulseId||''),
      resolvedEmpPulseIds:Object.freeze(Array.isArray(effect.resolvedEmpPulseIds)
        ?effect.resolvedEmpPulseIds.map(String):[]),
      sourceX,sourceY,x,y,radiusWorld,radiusX,radiusY,
      elapsed,duration,progress,negative,reducedMotion:Boolean(reducedMotion),values});
  }
  function create({renderer,frameOwner=renderer}={}){
    if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||
        !frameOwner.device?.queue?.writeBuffer||typeof frameOwner.own!=='function'||
        typeof frameOwner.release!=='function')
      throw new TypeError('EMP effect requires the shared WebGPU frame owner');
    const device=frameOwner.device,format=frameOwner.format;
    const module=device.createShaderModule({label:'DVA textureless EMP WGSL',code:shader});
    const pipeline=device.createRenderPipeline({label:'DVA ordered EMP field',layout:'auto',
      vertex:{module,entryPoint:'vs'},fragment:{module,entryPoint:'fs',targets:[{format,
        blend:{color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
          alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},
      primitive:{topology:'triangle-list'}});
    const slots=[],indices=new WeakMap();let destroyed=false;
    function slot(index){
      if(slots[index])return slots[index];
      const uniform=frameOwner.own(device.createBuffer({label:`DVA EMP ${index}`,
        size:64,usage:0x40|0x08}));
      const bindGroup=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),
        entries:[{binding:0,resource:{buffer:uniform}}]});
      return(slots[index]={uniform,bindGroup});
    }
    function record({frame,target,viewport,planned}={}){
      if(destroyed||frameOwner.state!=='ready')throw new Error('EMP effect pass unavailable');
      if(typeof frame?.add!=='function'||typeof frame?.stage!=='function'||
          typeof target!=='string'||!target||!planned||
          planned.values?.length!==16||
          viewport?.pixelWidth!==planned.values[0]||viewport?.pixelHeight!==planned.values[1])
        throw new TypeError('EMP effect needs a current shared frame, target, viewport and plan');
      const index=indices.get(frame)||0,{uniform,bindGroup}=slot(index);
      device.queue.writeBuffer(uniform,0,planned.values);
      frame.stage(`world:emp:${planned.effectId}`);
      frame.add({target,label:`DVA EMP ${planned.effectId}`,encode(pass,info){
        if(info.device!==device||info.format!==format||
            info.width!==viewport.pixelWidth||info.height!==viewport.pixelHeight)
          throw new Error('EMP pass target device, format or backing size mismatch');
        pass.setPipeline(pipeline);pass.setBindGroup(0,bindGroup);pass.draw(3);
      }});
      indices.set(frame,index+1);
      return Object.freeze({effectId:planned.effectId,type:planned.type,drawn:true});
    }
    return Object.freeze({device,plan,record,shader,get state(){return destroyed?'destroyed':frameOwner.state;},
      destroy(){if(destroyed)return;destroyed=true;
        for(const item of slots)if(frameOwner.release(item.uniform))item.uniform.destroy();
        slots.length=0;
      }});
  }
  const api=Object.freeze({TYPES,DURATIONS,shader,plan,create});
  root.DvaWebGPUEmpEffect=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
