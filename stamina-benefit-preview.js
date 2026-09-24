(async function(){
  'use strict';
  const canvas=document.getElementById('stage'),error=document.getElementById('error');
  const query=new URLSearchParams(location.search),verify=query.has('verify');
  const W=620,H=460,FOOT={x:310,y:304},DURATION=window.DvaStaminaBenefitE?.DURATION_MS||1180;
  const fixed=verify&&query.has('phaseMs');
  const reduced=query.get('reduced')==='1';
  const mask=query.has('layers')?Math.max(0,Math.min(15,Math.round(Number(query.get('layers'))))):15;
  let elapsed=fixed?Math.max(0,Math.min(DURATION-1,Number(query.get('phaseMs'))||0)):0;
  let cycle=0,last=0,raf=0,renderer,target,e,actorImage,actorTexture,
    audioContext,player,audioUnlocked=false;
  function fixture(){return {type:'gain-stamina',id:`preview-stamina-${cycle}`,
    causeId:`preview-stamina-cause-${cycle}`,actorWorld:{x:FOOT.x,y:FOOT.y},duration:DURATION};}
  function actor(frame){
    frame.stage('diagnostic-actor');
    // Existing actor art is a placement fixture, never an E image reference.
    frame.sprite('stamina-preview',{x:FOOT.x-53,y:FOOT.y-108,w:106,h:108,
      crop:[0,0,250,247],sourceSize:[actorImage.naturalWidth,actorImage.naturalHeight],
      texture:actorTexture,color:[1,1,1,1]});
  }
  function render(){
    if(!renderer||renderer.state!=='ready')return false;
    const viewport={width:W,height:H,pixelWidth:canvas.width,pixelHeight:canvas.height};
    const frame=renderer.beginFrame('Stamina benefit preview');
    try{
      frame.clear('stamina-preview',[.045,.062,.075,1]);
      actor(frame);
      const result=e.record({frame,target:'stamina-preview',effect:fixture(),actorElapsedMs:elapsed,
        camera:{x:0,y:0},zoom:1,viewport,reducedMotion:reduced,layerMask:mask});
      frame.submit();
      window.__staminaBenefitPreview=Object.freeze({ready:true,phaseMs:elapsed,cycle,
        drawn:result.drawn,plan:result.plan,layerMask:mask,reducedMotion:reduced});
      error.textContent='';return true;
    }catch(ex){try{frame.discard();}catch(_){}throw ex;}
  }
  function sound(submitted){
    if(!submitted||verify||!audioUnlocked||!player||audioContext?.state!=='running')return;
    player.start({causeId:`preview-stamina-cause-${cycle}`,roomId:'stamina-preview',
      roomGeneration:0,phaseSeconds:elapsed/1000,frameSubmitted:true,
      visible:!document.hidden,muted:false});
  }
  function tick(now){
    raf=0;const dt=Math.min(50,Math.max(0,now-last));last=now;
    const next=elapsed+dt;
    if(next>=DURATION+420){cycle++;elapsed=next%(DURATION+420);const submitted=render();sound(submitted);}
    else if(next>=DURATION){elapsed=DURATION;render();}
    else{elapsed=next;render();}
    raf=requestAnimationFrame(tick);
  }
  try{
    if(!window.DvaWebGPURenderer||!window.DvaStaminaBenefitE)
      throw new Error('Required WebGPU modules unavailable');
    renderer=await window.DvaWebGPURenderer.create({gpu:navigator.gpu});
    const dpr=Math.min(window.devicePixelRatio||1,2);
    target=renderer.registerTarget('stamina-preview',canvas,{width:Math.round(W*dpr),
      height:Math.round(H*dpr),logicalWidth:W,logicalHeight:H});
    actorImage=new Image();actorImage.src='assets/generated/philia-front-slow-v761.png';
    await actorImage.decode();
    actorTexture=renderer.device.createTexture({label:'Stamina preview actor placement fixture',
      size:[actorImage.naturalWidth,actorImage.naturalHeight],format:'rgba8unorm',
      usage:0x02|0x04|0x10});
    renderer.device.queue.copyExternalImageToTexture({source:actorImage},
      {texture:actorTexture,premultipliedAlpha:true},
      [actorImage.naturalWidth,actorImage.naturalHeight]);
    e=window.DvaStaminaBenefitE.create({renderer,frameOwner:renderer});await e.ready;
    render();if(!fixed){last=performance.now();raf=requestAnimationFrame(tick);}
  }catch(ex){window.__staminaBenefitPreviewError=String(ex?.stack||ex);error.textContent=String(ex);}
  canvas.addEventListener('pointerdown',async()=>{
    if(verify)return;
    try{
      audioContext ||=new (window.AudioContext||window.webkitAudioContext)();
      await audioContext.resume();
      player ||=window.DvaStaminaBenefitSfx.createPlayer({context:audioContext});
      player.enterRoom('stamina-preview',0);audioUnlocked=true;sound(true);
    }catch(ex){window.__staminaBenefitAudioError=String(ex);}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)player?.stop(0);});
  window.addEventListener('beforeunload',()=>{
    if(raf)cancelAnimationFrame(raf);player?.destroy();void audioContext?.close();
    e?.destroy();actorTexture?.destroy();target?.unregister();renderer?.destroy();
  },{once:true});
})();
