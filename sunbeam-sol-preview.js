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
  const pose=p.get('hands')==='2'?{
    asset:'assets/generated/philia-sunbeam-front-v894.png',crop:[136,641,412,580],
    origin:{x:201.1175105836245,y:572},scale:.1745345744680851,
    emitters:[{x:141,y:237},{x:282,y:237}]
  }:{
    asset:'assets/generated/philia-sunbeam-right-v894.png',crop:[100,640,473,589],
    origin:{x:237.75,y:581},scale:.16599915682967958,
    emitters:[{x:425,y:215}]
  };
  const hands=pose.emitters.map(h=>({x:(h.x-pose.origin.x)*pose.scale,
    y:(h.y-pose.origin.y)*pose.scale}));
  const reducedMotion=p.get('reduced')==='1';
  const layerMask=Math.round(bounded('layers',15,0,15));
  const fixed=p.has('phaseMs')&&p.has('verify');
  let elapsed=bounded('phaseMs',0,0,1199),renderer,handle,e,spriteTexture,spriteImage,raf=0,last=0,cycle=0;
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
      // This accepted release pose and its palm share one source transform.
      // The live game must still submit the actual pose for every E frame.
      const bodyX=(SOURCE.x-camera.x)*zoom,bodyY=(SOURCE.y-camera.y)*zoom;
      frame.stage('diagnostic-actor');
      frame.sprite('sol-preview',{x:bodyX-pose.origin.x*pose.scale*zoom,
        y:bodyY-pose.origin.y*pose.scale*zoom,
        w:pose.crop[2]*pose.scale*zoom,h:pose.crop[3]*pose.scale*zoom,
        crop:pose.crop,sourceSize:[spriteImage.naturalWidth,spriteImage.naturalHeight],
        texture:spriteTexture,color:[1,1,1,1]});
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
    spriteImage=new Image();spriteImage.src=pose.asset;await spriteImage.decode();
    spriteTexture=renderer.device.createTexture({label:'Sunbeam Sol accepted release pose',
      size:[spriteImage.naturalWidth,spriteImage.naturalHeight],format:'rgba8unorm',
      usage:0x02|0x04|0x10});
    renderer.device.queue.copyExternalImageToTexture({source:spriteImage},
      {texture:spriteTexture,premultipliedAlpha:true},
      [spriteImage.naturalWidth,spriteImage.naturalHeight]);
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
    e?.destroy();spriteTexture?.destroy();handle?.unregister();renderer?.destroy();
  },{once:true});
})();
