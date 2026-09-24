(async function(){
  'use strict';
  const p=new URLSearchParams(location.search),canvas=document.getElementById('stage');
  const error=document.getElementById('error');
  const W=980,H=620,SOURCE={x:2000,y:1600};
  const bounded=(key,defaultValue,min,max)=>{
    const v=Number(p.get(key));return p.has(key)&&Number.isFinite(v)?Math.max(min,Math.min(max,v)):defaultValue;
  };
  const range=bounded('range',520,70,950),zoom=bounded('zoom',.75,.35,1.7);
  const dpr=bounded('dpr',Math.min(window.devicePixelRatio||1,2),1,2);
  const angle=bounded('angle',0,-180,180)*Math.PI/180;
  const hands=p.get('hands')==='2'?[{x:14,y:-27},{x:14,y:-3}]:[{x:23,y:-24}];
  const reducedMotion=p.get('reduced')==='1';
  const layerMask=Math.round(bounded('layers',15,0,15));
  const fixed=p.has('phaseMs')&&p.has('verify');
  let elapsed=bounded('phaseMs',0,0,1199),renderer,handle,e,raf=0,last=0,cycle=0;
  let audioContext,audioPlayer,audioUnlocked=false;
  function fixture(){
    const facing={x:Math.cos(angle),y:Math.sin(angle)};
    return {id:`sol-preview-${cycle}`,sunbeamCausalId:`sol-cause-${cycle}`,
      type:'flora-sunbeam',duration:1200,sourceWorld:SOURCE,
      handWorlds:hands.map(h=>({x:SOURCE.x+h.x,y:SOURCE.y+h.y})),
      targetWorld:{x:SOURCE.x+facing.x*range,y:SOURCE.y+facing.y*range},facing};
  }
  function render(){
    if(!renderer||renderer.state!=='ready')return;
    const camera={x:SOURCE.x-250/zoom,y:SOURCE.y-310/zoom};
    const viewport={width:W,height:H,pixelWidth:Math.round(W*dpr),pixelHeight:Math.round(H*dpr)};
    const effect=fixture(),frame=renderer.beginFrame('Sunbeam Sol preview');
    try{
      frame.clear('sol-preview',[.055,.078,.105,1]);
      // A deliberately plain stand-in keeps the palm attachment legible;
      // accepted sprite registration is a separate live-game gate.
      const bodyX=(SOURCE.x-camera.x)*zoom,bodyY=(SOURCE.y-camera.y)*zoom;
      frame.stage('diagnostic-actor');
      frame.rect('sol-preview',{x:bodyX-19,y:bodyY-57,w:38,h:55,color:[.19,.27,.35,1]});
      frame.rect('sol-preview',{x:bodyX-14,y:bodyY-80,w:28,h:24,color:[.30,.37,.43,1]});
      frame.rect('sol-preview',{x:bodyX+13,y:bodyY-42,w:23,h:9,
        rotation:-.32,color:[.35,.40,.45,1]});
      frame.rect('sol-preview',{x:bodyX-15,y:bodyY-2,w:11,h:35,color:[.16,.22,.30,1]});
      frame.rect('sol-preview',{x:bodyX+4,y:bodyY-2,w:11,h:35,color:[.16,.22,.30,1]});
      const result=e.record({frame,target:'sol-preview',effect,actorElapsedMs:elapsed,camera,zoom,
        viewport,reducedMotion,layerMask});
      frame.submit();
      window.__sunbeamSolPreview=Object.freeze({ready:true,phaseMs:elapsed,cycle,range,zoom,dpr,
        hands:hands.length,layerMask,drawn:result.drawn,plan:result.plan});
      error.textContent='';
    }catch(ex){try{frame.discard();}catch(_){}throw ex;}
  }
  function playSound(){
    if(!audioUnlocked||!audioPlayer||!audioContext||audioContext.state!=='running')return;
    audioPlayer.start({eventId:`sol-preview-${cycle}`,causeId:`sol-cause-${cycle}`,
      roomId:'sol-preview',roomGeneration:0,phaseSeconds:elapsed/1000,
      volume:.65,frameSubmitted:true,visible:!document.hidden,muted:false});
  }
  function tick(now){
    raf=0;const delta=Math.min(50,Math.max(0,now-last));last=now;
    const next=elapsed+delta;
    if(next>=1200){cycle++;elapsed=next%1200;render();playSound();}
    else{elapsed=next;render();}
    raf=requestAnimationFrame(tick);
  }
  try{
    if(!window.DvaWebGPURenderer||!window.DvaSunbeamSolE)throw new Error('WebGPU modules missing');
    renderer=await window.DvaWebGPURenderer.create({gpu:navigator.gpu});
    handle=renderer.registerTarget('sol-preview',canvas,{width:Math.round(W*dpr),height:Math.round(H*dpr),
      logicalWidth:W,logicalHeight:H});
    e=window.DvaSunbeamSolE.create({renderer,frameOwner:renderer});
    await e.ready;
    render();
    if(!fixed){last=performance.now();raf=requestAnimationFrame(tick);}
  }catch(ex){window.__sunbeamSolPreviewError=String(ex?.stack||ex);error.textContent=`WebGPU: ${String(ex)}`;}
  canvas.addEventListener('pointerdown',async()=>{
    try{
      audioContext ||=new (window.AudioContext||window.webkitAudioContext)();
      await audioContext.resume();
      audioPlayer ||=window.DvaSunbeamSolSfx.createPlayer({context:audioContext});
      audioPlayer.enterRoom('sol-preview',0);audioUnlocked=true;playSound();
    }catch(ex){window.__sunbeamSolAudioError=String(ex);}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)audioPlayer?.stop(0);});
  window.addEventListener('beforeunload',()=>{
    if(raf)cancelAnimationFrame(raf);audioPlayer?.destroy();void audioContext?.close();
    e?.destroy();handle?.unregister();renderer?.destroy();
  },{once:true});
})();
