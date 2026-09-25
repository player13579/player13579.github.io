/* Source-space E for the authored corridor object uses. The caller owns
 * the authoritative event, shared WebGPU frame and sound playback. */
(function(root){
 'use strict';
 const MAP_ID='station',DURATION_MS=2200,MAX_FRAME_EVENTS=32;
 const raw=[
  ['v317-corridor-a15-1','wallSconce','mana',1040,1682,24,24,'a15','sconce-shutter-mana','brass-shutter-glass-charge'],
  ['v317-corridor-a02-1','corridorPlanter','luckBoost',485,1046,42,42,'a02','planter-leaf-vein-luck','clay-leaf-rub-rise'],
  ['v317-corridor-a17-2','corridorPlanter','luckBoost',745,1185,42,42,'a17','planter-canopy-shadow-luck','ceramic-canopy-brush'],
  ['v317-corridor-a04-1','corridorBench','acceleration',3201,532,100,40,'a04','bench-horizontal-slat-release','timber-slat-double-tap'],
  ['v317-corridor-a06-1','corridorBench','acceleration',1828,1170,40,100,'a06','bench-vertical-spine-release','upright-rail-spring'],
  ['v317-corridor-a13-2','corridorBench','acceleration',1718,2385,100,40,'a13','bench-corner-hinge-release','corner-hinge-clack'],
  ['v317-corridor-a17-1','corridorBench','acceleration',1150,968,100,40,'a17','bench-window-reflection-release','window-seat-glass-tick'],
  ['v317-corridor-a18-1','corridorBench','acceleration',3401,2918,100,40,'a18','bench-endrail-release','endrail-resonant-knock'],
  ['v317-corridor-a05-1','corridorPlanter','heal',2414,885,42,42,'a05','planter-paired-leaf-heal-wash','paired-leaf-water-drop'],
  ['v317-corridor-a08-1','corridorPlanter','stamina',3182,1992,42,42,'a08','planter-root-rise-stamina','root-pot-pulse'],
  ['v317-corridor-a12-1','corridorPlanter','luckBoost',2434,2386,42,42,'a12','planter-cross-leaf-luck','cross-leaf-brush'],
  ['v317-corridor-a13-1','corridorPlanter','stamina',1900,2180,42,42,'a13','planter-upright-stamina','upright-leaf-tap'],
  ['v317-corridor-a18-2','corridorPlanter','heal',3233,3130,42,42,'a18','planter-canopy-heal','canopy-water-rustle'],
  ['v317-corridor-a14-1','wallSconce','luckBoost',1085,2802,24,24,'a14','sconce-bounded-luck-halo','glass-shutter-luck-tone'],
  ['v317-corridor-a03-1','wallSconce','luckBoost',2005,632,24,24,'a03','sconce-offset-glass-window','offset-glass-aperture-tone'],
  ['v317-corridor-a07-1','wallSconce','luckBoost',3235,1422,24,24,'a07','sconce-crossed-vane-focus','crossed-vane-glass-tone'],
  ['v317-corridor-a09-1','wallSconce','luckBoost',3928,1061,24,24,'a09','sconce-stacked-glass-transfer','stacked-glass-transfer-tone'],
  ['v317-corridor-a10-1','wallSconce','luckBoost',3928,1861,24,24,'a10','footlight-lateral-ground-wash','ground-wash-brass-tone'],
  ['v317-corridor-a11-1','wallSconce','luckBoost',3928,2671,24,24,'a11','footlight-chevron-threshold','threshold-glass-chime'],
  ['v317-corridor-a16-1','wallSconce','mana',1815,1742,24,24,'a16','sconce-glass-reservoir-charge','reservoir-filament-tone'],
  ['v317-corridor-a01-1','wallSconce','luckBoost',1240,672,24,24,'a01','sconce-archive-wall-step','archive-brass-wick-click']
 ];
 const OBJECTS=Object.freeze(Object.fromEntries(raw.map((r,index)=>[r[0],Object.freeze({
  id:r[0],type:r[1],effectKind:r[2],x:r[3],y:r[4],width:r[5],height:r[6],corridor:r[7],
  code:index,design:r[8],soundProfile:r[9],sound:Object.freeze({profile:r[9],sourceX:r[3],sourceY:r[4],
   edge:'accepted-use-once',durationMs:[185,230,270,160,205,215,245,190,220,215,230,205,225,185,
    210,205,230,180,195,240,210][index],
   material:['brass-glass','clay-leaf','ceramic-canopy','timber','steel-spring','hinge','glass-wood','endrail',
    'paired-leaf','root-clay','cross-leaf','upright-leaf','water-canopy','brass-glass',
    'offset-glass','crossed-brass','stacked-glass','floor-brass','threshold-glass','mana-glass','archive-brass-glass'][index]})
 })])));
 const finite=Number.isFinite;
 const WALL_SCONCE_EXTENT=Object.freeze({halfWidth:58,halfHeight:46});
 function wallSconcePhase(progress,reducedMotion=false){
  if(reducedMotion)return 'steady-illumination';
  if(progress<.20)return 'shutter-opening';
  if(progress<.42)return 'filament-charging';
  if(progress<.78)return 'wall-illumination';
  return 'finite-light-decay';
 }
 const SFX_POLICY=Object.freeze({owner:'server-success-use-world-sound',currentProfile:'object',
  required:true,customProfilesComplete:false,candidatePlayback:false,edge:'one-per-accepted-event-id',
  note:'Server currently emits generic object sound with no shared object event causal ID; replace it when wiring the distinct profile.'});
 // B設計参照: player13579/B Codex-honoo commit fcc7d025c6f7a621043aa3306a6c6fc93b9ab3f6
 // 基底 blob eb33f176862372809bf67057f9a0a5d533e2b9b8 / 拡張 blob c5caf23456b667a48d63f13ad85f6f66d919de57。
 // VisualCausality / PerceptualEvidenceは「開く→充電→壁面へ伝播→有限減衰」を別の形と応答で読む。
 // VFX.Activation・MultilayerArchitecture・SpatialMorphology・MaterialOpticalResponseでは、広域の壁面照明、
 // 固定背板と可動真鍮シャッター、透過ガラス縁、遅れて強まる一本のフィラメントを別層にする。
 // VFX.TransportTemporal・CompositingReadabilityとLDMは、光源に結び付いた有界プール、
 // 層ごとの開始差、材質境界の分離、表示寸法を保つ局所輝度と終端減衰へ反映する。
 const shader=/* wgsl */`
struct Params{view:vec4f,source:vec4f,shape:vec4f,state:vec4f};
@group(0)@binding(0)var<uniform>p:Params;
struct Vertex{@builtin(position)position:vec4f,@location(0)clip:vec2f};
@vertex fn vs(@builtin(vertex_index)i:u32)->Vertex{
 let v=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3))[i];
 var o:Vertex;o.position=vec4f(v,0,1);o.clip=v;return o;
}
fn line(v:f32,w:f32)->f32{return exp(-v*v/max(w*w,.0001));}
fn band(v:f32,a:f32,b:f32)->f32{return smoothstep(a,a+.045,v)*(1.0-smoothstep(b-.045,b,v));}
fn over(dst:vec4f,color:vec3f,coverage:f32)->vec4f{
 let a=clamp(coverage,0.0,1.0);return vec4f(color*a+dst.rgb*(1.0-a),a+dst.a*(1.0-a));
}
@fragment fn fs(in:Vertex)->@location(0)vec4f{
 let pixel=vec2f((in.clip.x+1.0)*.5*p.shape.x,(1.0-in.clip.y)*.5*p.shape.y);
 let world=p.view.xy+pixel/p.view.zw;
 let q=(world-p.source.xy)/p.source.zw*2.0-vec2f(1.0);
 if(any(abs(q)>vec2f(1.0))){discard;}
 let t=p.state.x;let code=p.state.y;let reduced=p.state.z>.5;
 let sweep=select(t,.58,reduced);
 let envelope=smoothstep(0.0,.13,t)*(1.0-smoothstep(.72,1.0,t));
 var mark=0.0;var highlight=0.0;var color=vec3f(0.8);
 if(code<.5){
  // A15: distinct optics of one shuttered sconce. The broad, clipped wall pool
  // grows after the brass leaves uncover the glass; the filament peaks later.
  let open=select(smoothstep(.015,.24,t),.88,reduced);
  let charge=select(smoothstep(.035,.31,t),.80,reduced);
  let life=smoothstep(0.0,.055,t)*(1.0-smoothstep(.79,.99,t));
  let poolRise=select(smoothstep(.065,.31,t),.84,reduced);
  let radius=length(q*vec2f(.92,1.10));
  let radialPool=exp(-2.55*radius*radius)*(1.0-smoothstep(.78,1.0,radius));
  var layers=vec4f(0.0);
  let poolA=radialPool*(.17+.25*charge)*open*poolRise*life;
  layers=over(layers,vec3f(1.0,.61,.25),poolA);

  // A dark bronze spine remains fixed while the paired brass shutters travel.
  let spine=band(q.x,-.20,.20)*band(q.y,-.43,.43);
  let shutterCenter=.075+open*.18;
  let shutterL=band(q.x,-shutterCenter-.072,-shutterCenter+.072)*band(q.y,-.32,.32);
  let shutterR=band(q.x, shutterCenter-.072, shutterCenter+.072)*band(q.y,-.32,.32);
  let shutters=shutterL+shutterR;
  let bevelL=band(q.x,-shutterCenter-.018,-shutterCenter+.018)*band(q.y,-.27,.27);
  let bevelR=band(q.x, shutterCenter-.018, shutterCenter+.018)*band(q.y,-.27,.27);
  layers=over(layers,vec3f(.27,.12,.055),spine*.72*life);
  layers=over(layers,vec3f(.69,.36,.13),shutters*.88*life);
  layers=over(layers,vec3f(.98,.72,.35),(bevelL+bevelR)*.43*life);

  // Glass keeps a translucent center and a firmer edge, unlike the metal leaves.
  let glass=band(q.x,-.12,.12)*band(q.y,-.34,.34);
  let glassCore=band(q.x,-.082,.082)*band(q.y,-.265,.265);
  let glassRim=clamp(glass-glassCore,0.0,1.0);
  layers=over(layers,vec3f(.42,.29,.14),glass*.19*life);
  layers=over(layers,vec3f(.96,.70,.37),glassRim*.52*life);

  // One broad S-shaped filament becomes the brightest layer as it charges.
  let filamentX=.047*sin((q.y+.205)*7.66);
  let filamentLine=line(q.x-filamentX,.034)*band(q.y,-.205,.205);
  let filamentHalo=filamentLine*.24*charge*life;
  let filamentCore=filamentLine*.92*charge*life;
  layers=over(layers,vec3f(1.0,.57,.19),filamentHalo);
  layers=over(layers,vec3f(1.0,.91,.67),filamentCore);
  return layers;
 }else if(code<1.5){
  // A02: three rooted leaf midribs conduct luck from the clay rim upward.
  let root=band(q.y,.42,.53)*band(q.x,-.62,.62);
  let leafA=line(q.x+.38+.24*q.y,.09)*band(q.y,-.53,.33);
  let leafB=line(q.x-.37-.20*q.y,.08)*band(q.y,-.54,.28);
  let leafC=line(q.x,.07)*band(q.y,-.75,.27);
  mark=root*.45+(leafA+leafB+leafC)*line(q.y-(.56-1.20*sweep),.27);
  highlight=(leafA+leafB+leafC)*.28;color=vec3f(.60,.89,.38);
 }else if(code<2.5){
  // A17: a broad canopy folds shade across the pot in three separate leaves.
  let crown=band(q.y,-.66,-.05)*band(q.x,-.76,.76);
  let vein=line(q.y+.31+.28*q.x*q.x,.07)*crown;
  let shade=line(q.x-(sweep*1.4-.7),.22)*crown;
  mark=shade*.75+vein*.38;highlight=band(q.y,.50,.59)*band(q.x,-.52,.52)*.23;
  color=vec3f(.31,.78,.61);
 }else if(code<3.5){
  // A04: a horizontal timber slat compresses and sends a lateral release.
  let slats=line(q.y+.37,.055)+line(q.y,.055)+line(q.y-.37,.055);
  mark=slats*line(q.x-(sweep*1.7-.85),.20);
  highlight=band(q.x,-.79,.79)*line(q.y,.05)*.28;color=vec3f(.95,.62,.31);
 }else if(code<4.5){
  // A06: a tall upright rail stores force from bottom to top.
  let rail=line(q.x-.36,.07)+line(q.x+.36,.07);
  mark=rail*line(q.y-(.82-sweep*1.64),.17);
  highlight=line(q.x,.06)*band(q.y,-.78,.78)*.25;color=vec3f(.48,.82,.92);
 }else if(code<5.5){
  // A13: force turns visibly through a right-angle corner hinge.
  let horizontal=line(q.y-.34,.07)*band(q.x,-.74,.25);
  let vertical=line(q.x-.24,.07)*band(q.y,-.40,.61);
  mark=horizontal*line(q.x-(sweep*1.15-.74),.17)+vertical*line(q.y-(.63-sweep*.94),.17);
  highlight=line(length((q-vec2f(.24,.34))*vec2f(1.0,1.0))-.16,.08)*.45;
  color=vec3f(.84,.74,.47);
 }else if(code<6.5){
  // A17: a window seat catches one long reflection along its back rail.
  let rail=line(q.y+.50,.08)*band(q.x,-.80,.80);
  let pane=line(q.x+q.y*.31-(sweep*1.6-.8),.12)*band(q.y,-.77,-.18);
  mark=rail*.48+pane*.80;highlight=line(q.y+.22,.06)*band(q.x,-.68,.68)*.23;
  color=vec3f(.66,.87,.99);
 }else if(code<7.5){
  // A18: two endrail contacts answer in sequence across the bench length.
  let left=line(q.x+.66,.08)*band(q.y,-.65,.65);
  let right=line(q.x-.66,.08)*band(q.y,-.65,.65);
  mark=left*line(sweep-.30,.18)+right*line(sweep-.67,.18);
  highlight=line(q.y-.46,.06)*band(q.x,-.68,.68)*.25;
  color=vec3f(.93,.50,.40);
 }else if(code<8.5){
  // A05: two broad leaves carry a clean healing wash from clay to tips.
  let leaves=line(q.x+.32+.20*q.y,.10)+line(q.x-.32-.20*q.y,.10);
  mark=leaves*band(q.y,-.68,.45)*line(q.y-(.62-sweep*1.34),.18);
  highlight=line(q.y-.51,.07)*band(q.x,-.54,.54)*.35;color=vec3f(.47,1.0,.82);
 }else if(code<9.5){
  // A08: a central root stores force and releases one rising vertical front.
  let root=line(q.x,.10)*band(q.y,-.74,.58);
  mark=root*line(q.y-(.72-sweep*1.45),.20);
  highlight=line(q.y-.47,.08)*band(q.x,-.52,.52)*.32;color=vec3f(.55,.93,.48);
 }else if(code<10.5){
  // A12: crossing midribs pass a restrained luck glint between two leaves.
  let crossed=line(q.x+.48*q.y,.085)+line(q.x-.48*q.y,.085);
  mark=crossed*band(q.y,-.72,.49)*line(q.x-(sweep*1.25-.63),.20);
  highlight=line(q.y-.52,.07)*band(q.x,-.51,.51)*.30;color=vec3f(.84,.93,.41);
 }else if(code<11.5){
  // A13: upright leaf seams lift a stamina pulse without scattering fragments.
  let upright=line(q.x-.23,.075)+line(q.x+.23,.075);
  mark=upright*band(q.y,-.69,.48)*line(q.y-(.69-sweep*1.36),.17);
  highlight=line(q.y-.47,.08)*band(q.x,-.46,.46)*.32;color=vec3f(.39,.91,.72);
 }else if(code<12.5){
  // A18: canopy's lower edge sends one healing sweep through the leaf fan.
  let canopy=line(q.y+.24+.31*q.x*q.x,.09)*band(q.x,-.72,.72);
  mark=canopy*line(q.x-(sweep*1.45-.73),.20);
  highlight=line(q.y-.52,.07)*band(q.x,-.52,.52)*.33;color=vec3f(.45,1.0,.81);
 }else if(code<13.5){
  // A14: brass shutters admit a bounded warm luck halo around the lamp glass.
  let lamp=line(length(q*vec2f(.93,1.05))-.37,.075);
  let shutter=line(abs(q.x)-(.12+.22*sweep),.07)*band(q.y,-.46,.46);
  mark=lamp*(.38+.62*sweep)+shutter*.58;
  highlight=line(length(q)-(.24+.43*sweep),.12)*.36;color=vec3f(1.0,.82,.41);
 }else if(code<14.5){
  // A03: offset glass aperture opens from the left; a bounded wedge then illuminates the wall.
  let aperture=band(q.x,-.50,-.17)*band(q.y,-.48,.48);
  let opening=band(q.x,-.45,-.45+.68*sweep)*band(q.y,-.36,.36);
  let wedge=band(q.x,-.36,.58)*band(q.y,-.28-.17*(q.x+.36),.28+.17*(q.x+.36));
  mark=aperture*.38+opening*.62+wedge*smoothstep(.12,.52,sweep)*.38;
  highlight=line(q.x+.26,.045)*band(q.y,-.31,.31)*.43;
  color=vec3f(.95,.79,.39);
 }else if(code<15.5){
  // A07: crossed brass vanes separate first, then focus a diamond of refracted light.
  let vaneA=line(q.y-q.x*.57+(.24-.24*sweep),.085)*band(q.x,-.65,.65);
  let vaneB=line(q.y+q.x*.57-(.24-.24*sweep),.085)*band(q.x,-.65,.65);
  let diamond=abs(q.x)*.78+abs(q.y);
  let aperture=band(diamond,.17,.66)*smoothstep(.20,.58,sweep);
  mark=(vaneA+vaneB)*.45+aperture*.50;
  highlight=line(diamond-.34,.07)*smoothstep(.32,.72,sweep)*.55;
  color=vec3f(.80,.94,.63);
 }else if(code<16.5){
  // A09: three stacked panes hand illumination downward, one pane after another.
  let paneTop=band(q.x,-.43,.43)*band(q.y,-.70,-.30);
  let paneMid=band(q.x,-.43,.43)*band(q.y,-.20,.20);
  let paneLow=band(q.x,-.43,.43)*band(q.y,.30,.70);
  let chargeTop=smoothstep(.04,.27,sweep)*(1.0-smoothstep(.45,.72,sweep));
  let chargeMid=smoothstep(.27,.51,sweep)*(1.0-smoothstep(.72,.95,sweep));
  let chargeLow=smoothstep(.52,.79,sweep);
  mark=paneTop*(.20+.52*chargeTop)+paneMid*(.20+.52*chargeMid)+paneLow*(.20+.52*chargeLow);
  highlight=line(q.y-(-.5+sweep),.075)*band(q.x,-.36,.36)*.40;
  color=vec3f(.73,.88,1.0);
 }else if(code<17.5){
  // A10: low footlight sends a broad, horizontal wash along the floor from its source.
  let fixture=band(q.x,-.22,.22)*band(q.y,-.60,-.37);
  let floor=band(q.y,-.12,.60)*band(q.x,-.80,.80);
  let front=line(abs(q.x)-(.12+.62*sweep),.17)*floor;
  let shelf=band(q.y,-.38,-.29)*band(q.x,-.54,.54);
  mark=fixture*.39+front*.72+shelf*.24;
  highlight=line(q.y+.34,.065)*band(q.x,-.45,.45)*.55;
  color=vec3f(1.0,.71,.35);
 }else if(code<18.5){
  // A11: a paired chevron footlight meets at the threshold, then fades toward the floor.
  let left=line(q.y+.36-.53*(q.x+.55),.09)*band(q.x,-.71,0.0);
  let right=line(q.y+.36+.53*(q.x-.55),.09)*band(q.x,0.0,.71);
  let threshold=band(q.y,.37,.50)*band(q.x,-.75,.75);
  let meet=line(q.x,.17)*smoothstep(.25,.66,sweep);
  mark=(left+right)*line(abs(q.x)-(.72-.72*sweep),.22)+threshold*.35+meet*threshold*.43;
  highlight=line(q.y-.42,.06)*band(q.x,-.64,.64)*.50;
  color=vec3f(.98,.81,.52);
 }else if(code<19.5){
  // A16: mana remains inside glass; a reservoir charges radially into one filament core.
  let vessel=length(q*vec2f(1.06,.85));
  let rim=line(vessel-.58,.065);
  let fill=band(q.y,.39-.83*sweep,.48)*band(q.x,-.43,.43);
  let filament=line(q.x-.12*sin(q.y*6.0),.055)*band(q.y,-.43,.35);
  mark=rim*.41+fill*.55+filament*smoothstep(.25,.73,sweep)*.75;
  highlight=line(vessel-.33,.13)*smoothstep(.38,.80,sweep)*.43;
  color=vec3f(.54,.89,1.0);
 }else{
  // A01: the existing brass wall lamp throws one stepped archive-side wash.
  // A compact glass wick remains the source; three broad wall terraces answer
  // from the fixture outward instead of forming the future ceramic reader seam.
  let housing=band(q.x,-.17,.17)*band(q.y,-.33,.38);
  let glass=band(q.x,-.10,.10)*band(q.y,-.22,.23);
  let wick=line(q.x,.045)*band(q.y,-.16,.16);
  let first=band(q.x,-.44,-.16)*band(q.y,-.32,.20);
  let second=band(q.x,-.70,-.44)*band(q.y,-.15,.35);
  let third=band(q.x,-.88,-.70)*band(q.y,.02,.48);
  let arrive1=smoothstep(.10,.34,sweep);
  let arrive2=smoothstep(.30,.56,sweep);
  let arrive3=smoothstep(.51,.76,sweep);
  let pool=(first*arrive1+second*arrive2+third*arrive3)*.43;
  mark=housing*.25+glass*.34+pool;
  highlight=wick*(.24+.60*smoothstep(.12,.47,sweep))+
    line(q.x+.17,.045)*band(q.y,-.29,.32)*.24;
  color=vec3f(1.0,.70,.31);
 }
 let a=clamp((mark+highlight)*envelope*.75,0.0,.82);
 return vec4f(color*a,a);
}`;
 function eventStart(e){return finite(e?.startedAt)?e.startedAt:e?.at;}
 function supported(e){const s=OBJECTS[e?.objectId];return Boolean(s&&e.type===`object-${s.type}`&&e.effectKind===s.effectKind);}
 function plan({map,event,now,phase,camera,zoom,viewport,reducedMotion=false}={}){
  if(!supported(event)||map?.id!==MAP_ID||!Array.isArray(map.objects)||phase!=='playing'||
   typeof event.id!=='string'||!event.id||typeof event.playerId!=='string'||!event.playerId||
   !finite(now)||!finite(zoom)||zoom<=0||!camera||![camera.x,camera.y,viewport?.width,
   viewport?.height,viewport?.pixelWidth,viewport?.pixelHeight].every(finite)||
   viewport.width<=0||viewport.height<=0||!Number.isInteger(viewport.pixelWidth)||
   !Number.isInteger(viewport.pixelHeight)||viewport.pixelWidth<=0||viewport.pixelHeight<=0)return null;
  const s=OBJECTS[event.objectId],o=map.objects.find(item=>item?.id===s.id),start=eventStart(event);
  if(!o||o.type!==s.type||o.effectKind!==s.effectKind||o.x!==s.x||o.y!==s.y||
   o.visualWidth!==s.width||o.visualHeight!==s.height||o.corridor!==s.corridor||
   event.x!==s.x||event.y!==s.y||event.radius!==100||!finite(start)||
   !finite(event.duration)||event.duration<=0||event.duration>DURATION_MS||
   now<start||now>=start+event.duration)return null;
  const sx=zoom*viewport.pixelWidth/viewport.width,sy=zoom*viewport.pixelHeight/viewport.height;
  const halfW=s.type==='wallSconce'?WALL_SCONCE_EXTENT.halfWidth:Math.max(s.width*.85,25);
  const halfH=s.type==='wallSconce'?WALL_SCONCE_EXTENT.halfHeight:Math.max(s.height*.85,25);
  const bounds={x:s.x-halfW,y:s.y-halfH,width:halfW*2,height:halfH*2};
  const rect={x:(bounds.x-camera.x)*sx,y:(bounds.y-camera.y)*sy,width:bounds.width*sx,height:bounds.height*sy};
  if(!Object.values(rect).every(finite)||rect.x>=viewport.pixelWidth||rect.y>=viewport.pixelHeight||
   rect.x+rect.width<=0||rect.y+rect.height<=0)return null;
  return Object.freeze({objectId:s.id,eventId:event.id,startedAt:start,code:s.code,design:s.design,
   effectKind:s.effectKind,progress:(now-start)/event.duration,durationMs:event.duration,
   phase:s.type==='wallSconce'?wallSconcePhase((now-start)/event.duration,reducedMotion):null,
   source:Object.freeze(bounds),screen:Object.freeze(rect),pixelWidth:viewport.pixelWidth,
   pixelHeight:viewport.pixelHeight,camera:Object.freeze({x:camera.x,y:camera.y}),
   scale:Object.freeze({x:sx,y:sy}),reducedMotion:Boolean(reducedMotion),
   sound:Object.freeze({required:true,profile:s.soundProfile,eventId:event.id,x:s.x,y:s.y,
    edge:'accepted-use-once',currentProfile:'object',candidatePlayback:false,
    durationMs:s.sound.durationMs,material:s.sound.material})});
 }
 function planAll({map,effects,...context}={}){
  if(!Array.isArray(effects))return Object.freeze([]);
  const seen=new Set(),out=[];
  for(const e of effects){if(seen.has(e?.id))continue;const p=plan({map,event:e,...context});if(p){seen.add(e.id);out.push(p);}}
  return Object.freeze(out);
 }
 function pack(p){const s=OBJECTS[p?.objectId];if(!s||p.code!==s.code||typeof p.eventId!=='string'||!p.eventId||
  ![p.pixelWidth,p.pixelHeight,p.source?.x,p.source?.y,p.source?.width,p.source?.height,
   p.camera?.x,p.camera?.y,p.scale?.x,p.scale?.y,p.progress].every(finite)||
  p.pixelWidth<=0||p.pixelHeight<=0||p.scale.x<=0||p.scale.y<=0||p.progress<0||p.progress>=1)
   throw new TypeError('Valid corridor object E plan required');
  const d=new Float32Array([p.camera.x,p.camera.y,p.scale.x,p.scale.y,
   p.source.x,p.source.y,p.source.width,p.source.height,p.pixelWidth,p.pixelHeight,0,0,
   p.progress,p.code,p.reducedMotion?1:0,0]);
  if(!d.every(finite))throw new RangeError('Corridor object E uniform exceeds float32 range');return d;
 }
 function create({renderer,frameOwner=renderer}={}){
  if(frameOwner?.state!=='ready'||!frameOwner.device?.createShaderModule||
   !frameOwner.device?.createRenderPipeline||!frameOwner.device?.createBuffer||
   !frameOwner.device?.createBindGroup||!frameOwner.device?.queue?.writeBuffer||
   typeof frameOwner.own!=='function'||typeof frameOwner.release!=='function'||
   typeof frameOwner.format!=='string')throw new TypeError('Corridor object E needs ready shared WebGPU owner');
  const device=frameOwner.device,format=frameOwner.format,module=device.createShaderModule({label:'DVA corridor object use E',code:shader});
  const pipeline=device.createRenderPipeline({label:'DVA corridor source use E',layout:'auto',
   vertex:{module,entryPoint:'vs'},fragment:{module,entryPoint:'fs',targets:[{format,blend:{
    color:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'},
    alpha:{srcFactor:'one',dstFactor:'one-minus-src-alpha',operation:'add'}}}]},primitive:{topology:'triangle-list'}});
  const slots=[],indices=new WeakMap(),seenByFrame=new WeakMap();let destroyed=false;
  function slot(i){if(slots[i])return slots[i];const buffer=frameOwner.own(device.createBuffer({
   label:`DVA corridor object E slot ${i}`,size:64,usage:0x40|0x08}));
   const bind=device.createBindGroup({layout:pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer}}]});
   return(slots[i]={buffer,bind});}
  function record({frame,target,viewport,planned}={}){
   if(destroyed||frameOwner.state!=='ready')throw new Error('Corridor object E unavailable');
   if(!frame||typeof frame.stage!=='function'||typeof frame.add!=='function'||
    typeof target!=='string'||!target||viewport?.kind!=='main'||
    viewport.pixelWidth!==planned?.pixelWidth||viewport.pixelHeight!==planned?.pixelHeight)
    throw new TypeError('Corridor object E requires current main viewport plan');
   const data=pack(planned);let seen=seenByFrame.get(frame);
   if(!seen){seen=new Set();seenByFrame.set(frame,seen);}
   if(seen.has(planned.eventId))return Object.freeze({drawn:false,duplicate:true,eventId:planned.eventId});
   const i=indices.get(frame)||0;if(i>=MAX_FRAME_EVENTS)throw new RangeError('Corridor object E frame limit');
   const s=slot(i);device.queue.writeBuffer(s.buffer,0,data);
   frame.stage(`world:corridor-object-use-e:${planned.objectId}:${planned.eventId}`);
   frame.add({target,label:`world:${planned.design}:${planned.eventId}`,encode(pass,info){
    if(info.device!==device||info.format!==format||info.width!==viewport.pixelWidth||info.height!==viewport.pixelHeight)
     throw new Error('Corridor object E shared target mismatch');
    pass.setPipeline(pipeline);pass.setBindGroup(0,s.bind);pass.draw(3);
   }});seen.add(planned.eventId);indices.set(frame,i+1);
   return Object.freeze({drawn:true,objectId:planned.objectId,eventId:planned.eventId,
    design:planned.design,soundProfile:planned.sound.profile,soundPlaybackOwned:false});
  }
  return Object.freeze({record,get state(){return destroyed?'destroyed':frameOwner.state;},
   destroy(){if(destroyed)return;destroyed=true;for(const s of slots)if(frameOwner.release(s.buffer))s.buffer.destroy();slots.length=0;}});
 }
 const api=Object.freeze({MAP_ID,DURATION_MS,OBJECTS,SFX_POLICY,WALL_SCONCE_EXTENT,
  wallSconcePhase,shader,supported,plan,planAll,pack,create});
 root.DvaWebGPUCorridorObjectUseE=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
