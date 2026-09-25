/* Astra authored E, generated exactly from recorded executable design. */
(function(root){'use strict';
const design=(()=>{const module={exports:{}};const require={main:null};
'use strict';
// 先行Eコード。画像生成指示ではなく、時相・断面・供給／排出を実行する。
// ゲームとプレビューはこの同一関数を組み込んだモジュールを使う。
const SOURCE = Object.freeze({commit:'26ccab76342b7eec7a8b9e3164afd825e1838bdd',
  base:'eb33f176862372809bf67057f9a0a5d533e2b9b8',extension:'513273efb4bb177be07de59e91200d382af1856d'});
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const smooth=(a,b,x)=>{const q=clamp((x-a)/(b-a));return q*q*(3-2*q);};
const DURATION=1.2;
function phase(actorSeconds,reduced=false){
  if(!Number.isFinite(actorSeconds))throw new TypeError('actorSeconds must be finite');
  const t=actorSeconds;
  const alive=t>=0&&t<DURATION;
  const supply=alive?smooth(0,.075,t)*(1-smooth(.78,.96,t)):0;
  const head=alive?smooth(.065,.245,t):0;
  const drain=alive?smooth(.85,1.16,t):1;
  const residual=alive?1-smooth(1.10,1.2,t):0;
  return {actorSeconds:t,alive,supply,head,drain,residual,reduced:Boolean(reduced),
    phase:!alive?'off':t<.065?'supply':t<.245?'propagation':t<.85?'transport':t<1.16?'drain':'termination'};
}
function crossSection(u,actorSeconds,reduced=false){
  const x=clamp(u);
  // 主輪郭: 手の細い開口から肩状に広がり、射程の端で閉じる紡錘断面。
  const shoulder=smooth(0,.10,x),tip=1-smooth(.78,1,x);
  const base=3+19*shoulder*tip;
  // 輸送の圧縮節。単にランダムな明滅を足さず、軸方向へ運ぶ。
  const theta=x*16-actorSeconds*(reduced?6:16);
  const fold=.68+.32*Math.sin(theta)*Math.sin(theta);
  return {radius:base*(.80+.20*fold),core:2.1+4.2*shoulder*tip,
    membrane:Math.sin(theta)*base*.64,head:phase(actorSeconds,reduced).head};
}
const contract=Object.freeze({
  output:'executable_effect_source_not_image_generation',clock:'actor_seconds_integral_not_wall_age',duration:DURATION,
  source:'同じ提出フレームの採用姿勢の全handWorlds。胴体座標の代用は禁止。',
  limit:'サーバー終点を越えない。壁・命中種別が未提供なので衝突爆発・傷・破片なし。',
  space:'ゲームworld +X右/+Y下をB world +X/-Yの投影面へ写像。1 world unit=設計上1cm、重力は光束を曲げない。',
  wind:'静穏空気・風速0。屈折背景、煙、風、布変形を新設しない。',
  PH:{
    PH1:'手の入力開口。供給量が滑らかに増減する非現実光源。受け手PH2へ放射。',
    PH2:'有限光束の宣言場。軸の光学輸送、密度の圧縮節と薄い曲面境界、終端の流出で閉じる。'
  },
  OBS:{OBS1:'PH1/PH2の発光分布だけを入力とする局所光学拡散。世界内の形を作らない。'},
  layers:[
    {id:'source',domain:'world',PH_refs:['PH1'],OBS_refs:[],why:'掌への接続と供給開始。幅12の扁平な漏斗、0-.96秒。取り除くと空中からビームが始まる。'},
    {id:'column',domain:'world',PH_refs:['PH2'],OBS_refs:[],why:'方向性と連続輸送。白金芯と有色の断面を持つ幅6-44の紡錘体、.065-1.2秒。主作用の全期間を被覆。'},
    {id:'fold',domain:'world',PH_refs:['PH2'],OBS_refs:[],why:'輸送場の内部圧縮と断面深度。互いに位相の異なる表裏の折れ面が長軸へ進行、columnへ束縛。上昇粒子ではない。'},
    {id:'front',domain:'world',PH_refs:['PH2'],OBS_refs:[],why:'有限の先端と入力遮断後の空隙。開始は手から伸長し、終了は手から空になって最終端へ排出する。命中を意味しない。'},
    {id:'source-scatter',domain:'observation',PH_refs:[],OBS_refs:['OBS1'],why:'発光の近傍光。主形分布を畳み込んだ近似、局所36wu以内。層を外しても主ビームが残る。'}
  ],
  optical:'linear radiance + premultiplied coverage、one/one-minus-src-alpha。密度・alpha・発光を分離。中心のみ白、境界はamber/coral、背景参照なし。',
  sampling:'通常zoom .75、監査.35/1/1.65、DPR1/2。内部面は最小2pxへAA、粒子・点・grainは採用しない。',
  sound:'同じcause IDで一度。掌供給の上昇倍音、放出の低域圧力と帯域ノイズ、軸輸送の有色持続、末端排出の短い高域尾。actor時計で連続rate変更。',
  edges:'取消・所有者消失・非表示で停止。再送は重複発音しない。reduced motionは主形と発光を残し、内部輸送だけ減速。',
  evidence:'静的合格、実GPUの時系列、聴感、ゲーム統合を別々に記録する。'
});
module.exports={SOURCE,DURATION,clamp,smooth,phase,crossSection,contract};
if(require.main===module){
 const assert=require('node:assert/strict');
 for(const t of [0,.04,.12,.24,.45,.72,.9,1.05,1.16,1.199]){
  assert(phase(t).alive);for(let i=0;i<=100;i++){const s=crossSection(i/100,t);assert(s.radius>=2.80&&s.radius<=22.1);}
 }
 for(const t of [-.1,1.2,2])assert.equal(phase(t).alive,false);
 console.log('PASS: executable Sunbeam Astra design');
}

return module.exports;})();
const shader="// 独立設計: 掌の有限開口 → 断面をもつ輸送束 → 有限終端。\nstruct Params { screen:vec4f, clock:vec4f, source:vec4f, endAndFlags:vec4f, inspectFlags:vec4f };\n@group(0) @binding(0) var<uniform> p:Params;\nstruct VOut {@builtin(position) position:vec4f};\n@vertex fn vs_main(@builtin(vertex_index) i:u32)->VOut{\n var q=array<vec2f,3>(vec2f(-1.,-1.),vec2f(3.,-1.),vec2f(-1.,3.));\n var o:VOut;o.position=vec4f(q[i],0.,1.);return o;\n}\nfn g(x:f32,w:f32)->f32{return exp(-pow(x/max(.001,w),2.));}\nfn rise(a:f32,b:f32,x:f32)->f32{return smoothstep(a,b,x);}\nfn beam(q:vec2f,origin:vec2f,lane:f32)->vec4f{\n let delta=p.endAndFlags.xy-origin;\n let len=length(delta);\n if(len<.001){return vec4f(0.);}\n let axis=delta/len;\n let normal=vec2f(-axis.y,axis.x);\n let v=q-origin;\n let along=dot(v,axis);let across=dot(v,normal);\n let u=along/len;\n let t=p.clock.x;\n let reduced=p.endAndFlags.z>.5;\n let supply=p.clock.y;let head=p.clock.z;let drain=p.clock.w;\n let residual=1.-rise(1.10,1.2,t);\n let shoulder=rise(0.,.10,u);let tip=1.-rise(.78,1.,u);\n let base=3.+19.*shoulder*tip;\n let travel=select(16.,6.,reduced);\n let theta=u*16.-t*travel+lane*.8;\n let fold=.68+.32*pow(sin(theta),2.);\n let radius=base*(.80+.20*fold);\n let aa=max(.35,1./p.screen.z);\n let frontGate=(1.-rise(head-.022,head+.012,u))*rise(-.02,.018,u);\n let drainGate=rise(drain-.036,drain+.018,u);\n let stop=1.-rise(.982,1.,u);\n let gate=frontGate*drainGate*stop*residual;\n // PH2: 不透明度とは独立した発光密度と有色の厚い断面。\n let r=across/radius;\n let coreWidth=2.1+4.2*shoulder*tip;\n let axial=g(across,coreWidth);\n let mantle=pow(max(0.,1.-r*r),.68);\n let innerCavity=1.-.35*g(r-.25*sin(theta),.22);\n let wave=.80+.20*sin(theta+.38*sin(u*9.));\n let depth=clamp(1.-r*.22,.5,1.25);\n let density=mantle*innerCavity*wave*depth;\n let edge=(1.-rise(radius-aa,radius+aa,abs(across)));\n let warm=vec3f(1.,.37,.045);\n let gold=vec3f(1.,.77,.20);\n let pearl=vec3f(1.,.97,.76);\n var radiance=(warm*density*.44+gold*axial*.68+pearl*pow(axial,2.)*1.10)*gate*edge;\n var coverage=(mantle*.11+axial*.035)*gate*edge;\n // PH2内部の流線面: 固有の曲率・厚み・表裏位相。色替えhaloではない。\n let curve=sin(theta)*radius*.64;\n let backCurve=-sin(theta+.70)*radius*.59;\n let foldWidth=max(1.0,radius*.135);\n let face=g(across-curve,foldWidth)*(.40+.60*max(0.,cos(theta)));\n let rear=g(across-backCurve,foldWidth*1.55)*(.42+.58*max(0.,-cos(theta+.7)));\n let foldedGate=rise(.015,.095,u)*(1.-rise(.82,.99,u))*gate;\n if(p.inspectFlags.x!=2.){\n  radiance+=(gold*face*.70+vec3f(1.,.24,.09)*rear*.40)*foldedGate;\n  coverage+=(face*.055+rear*.035)*foldedGate;\n }\n // PH1: 開口部の光を束へ絞る。中心は掌そのもの、逆方向への長い線なし。\n let inlet=g(along,7.5)*g(across,8.5)*supply;\n let flare=g(along-6.,12.)*g(across,4.2+max(0.,along)*.10)*supply;\n if(p.inspectFlags.x!=3.){\n  radiance+=(pearl*inlet*1.28+gold*flare*.43);\n  coverage+=inlet*.06;\n }\n // 先端は輸送束の短い高密度面。終端種別不明なので衝突輪／爆発は描かない。\n let headX=head*len;\n let headCap=g(along-headX,5.+radius*.23)*g(across,radius*.82);\n let headAlive=(1.-rise(.90,1.,head))*rise(.025,.1,head)*residual;\n radiance+=pearl*headCap*headAlive*.90;\n // OBS1: 入力束の光だけを局所へ拡散。形状は上のPH層だけで成立。\n if(p.inspectFlags.x!=1.){\n  let scatter=g(across,radius*1.72)*(1.-rise(radius*2.2,radius*2.9,abs(across)));\n  radiance+=gold*scatter*gate*.12+gold*g(along,20.)*g(across,20.)*supply*.11;\n }\n if(along>len+aa||along< -27.||abs(across)>80.){return vec4f(0.);}\n return vec4f(radiance,clamp(coverage,0.,.32));\n}\n@fragment fn fs_main(v:VOut)->@location(0) vec4f{\n let q=v.position.xy/p.screen.w;\n let world=(q-p.inspectFlags.yz)/p.screen.z;\n var a=beam(world,p.source.xy,0.);\n if(p.endAndFlags.w>1.5){\n  let b=beam(world,p.source.zw,1.);\n  // 同一光源の二開口はunion。交差で同じ物理束を二重加算しない。\n  a=max(a,b);\n }\n return a;\n}\n";
const SOURCE_SHA="b44f3b7c44a0c3903ccd858d851f57a674c3301cbe2d3a70cbb0424c2f17cac4";
function plan({effect,actorElapsedSeconds,camera,zoom,viewport,reducedMotion=false}={}){
 if(!effect||effect.cancelled||effect.visible===false||effect.ownerAlive===false)return null;
 if(!effect.id||!effect.sunbeamCausalId)throw new TypeError('Sunbeam Astra needs event and cause ids');
 const hands=effect.handWorlds;
 if(!Array.isArray(hands)||hands.length<1||hands.length>2||hands.some(h=>![h?.x,h?.y].every(Number.isFinite)))
  throw new TypeError('Same-frame registered handWorlds required');
 const end=effect.targetWorld,source=effect.sourceWorld;
 if(![end?.x,end?.y,source?.x,source?.y,camera?.x,camera?.y,zoom,viewport?.width,viewport?.height,actorElapsedSeconds].every(Number.isFinite)||zoom<=0||viewport.width<=0||viewport.height<=0)
  throw new TypeError('Finite source, endpoint, actor clock, camera and viewport required');
 const range=Math.hypot(end.x-source.x,end.y-source.y);
 if(range<.001||range>952)throw new RangeError('Authoritative endpoint outside Sunbeam range');
 if(hands.some(h=>Math.hypot(end.x-h.x,end.y-h.y)<.001))return null;
 const phases=design.phase(actorElapsedSeconds,reducedMotion);
 if(!phases.alive)return null;
 return Object.freeze({id:String(effect.id),causeId:String(effect.sunbeamCausalId),hands:hands.map(h=>({...h})),end:{...end},
  camera:{...camera},zoom,viewport:{...viewport},phase:phases});
}
function create({renderer}={}){
 if(!renderer?.device||renderer.state!=='ready')throw new TypeError('Ready shared renderer required');
 const device=renderer.device,slots=new Map();let disposed=false,pipeline;
 const readiness={compilationErrors:[],warnings:[],pipeline:false};
 const module=device.createShaderModule({label:'Sunbeam Astra source',code:shader});
 const ready=(async()=>{
  const info=await module.getCompilationInfo();
  readiness.compilationErrors=info.messages.filter(m=>m.type==='error').map(m=>m.message);
  readiness.warnings=info.messages.filter(m=>m.type==='warning').map(m=>m.message);
  if(readiness.compilationErrors.length)throw new Error(readiness.compilationErrors.join('\n'));
  pipeline=await device.createRenderPipelineAsync({label:'Sunbeam Astra',layout:'auto',vertex:{module,entryPoint:'vs_main'},
   fragment:{module,entryPoint:'fs_main',targets:[{format:renderer.format,blend:{
    color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
    alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},primitive:{topology:'triangle-list'}});
  if(disposed)throw new Error('Sunbeam Astra destroyed during pipeline creation');
  readiness.pipeline=true;return readiness;
 })();
 function release(id){const slot=slots.get(id);if(!slot)return false;renderer.release(slot.buffer);slot.buffer.destroy();slots.delete(id);return true;}
 function record({frame,target,planned,diagnostic=0}={}){
  if(disposed||!pipeline)throw new Error('Sunbeam Astra not ready');
  if(!planned)return {drawn:false};
  let slot=slots.get(planned.id);
  if(!slot){
   if(slots.size>=32)throw new RangeError('Release expired Sunbeam event slots');
   const buffer=renderer.own(device.createBuffer({label:`Sunbeam Astra ${planned.id}`,size:80,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}));
   const group=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer}}]});
   slot={buffer,group};slots.set(planned.id,slot);
  }
  const {viewport,zoom,camera,hands,end,phase:q}=planned;
  const dpr=viewport.pixelWidth?viewport.pixelWidth/viewport.width:1;
  if(!Number.isFinite(dpr)||dpr<=0)throw new TypeError('Invalid physical/logical viewport ratio');
  const h=hands[0],other=hands[1]||h;
  device.queue.writeBuffer(slot.buffer,0,new Float32Array([viewport.width,viewport.height,zoom,dpr,
   q.actorSeconds,q.supply,q.head,q.drain,h.x,h.y,other.x,other.y,end.x,end.y,q.reduced?1:0,hands.length,
   diagnostic,-camera.x*zoom,-camera.y*zoom,0]));
  frame.add({target,label:'Sunbeam Astra source transport',encode(pass){pass.setPipeline(pipeline);pass.setBindGroup(0,slot.group);pass.draw(3);}});
  return {drawn:true,eventId:planned.id,causeId:planned.causeId,actorSeconds:q.actorSeconds,stage:q.phase,handCount:hands.length};
 }
 return Object.freeze({ready,readiness,record,release,destroy(){if(disposed)return;disposed=true;for(const id of [...slots.keys()])release(id);}});
}
const api=Object.freeze({design,shader,SOURCE_SHA,plan,create});
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.DvaSunbeamAstraE=api;
})(typeof globalThis==='undefined'?this:globalThis);
