/* Finite, fixture-owned greenhouse SFX candidates. This module is deliberately
 * not integrated into app.js: current server receipts lack a shared causal ID. */
(function(root){
 'use strict';
 const DURATION_MS=1000,EFFECT_DURATION_MS=2200;
 const PROFILES=Object.freeze({
  'v302-greenhouse-greenhousePlanter-1':Object.freeze({objectId:'v302-greenhouse-greenhousePlanter-1',
   effectType:'object-aromaticGarden',effectKind:'luckBoost',x:303,y:2652,profile:'compound-leaf-luck-tone',durationMs:820,
   design:'two ascending glasswood midrib notes with a warm wooden body; single envelope'}),
  'v302-greenhouse-mistSprayer-2':Object.freeze({objectId:'v302-greenhouse-mistSprayer-2',
   effectType:'object-restorativeMist',effectKind:'luckBoost',x:817,y:2652,profile:'herbal-mist-fan-release',durationMs:920,
   design:'one filtered air fan with a gentle rising resonant overtone; single exhale envelope'}),
  'v302-greenhouse-compostUnit-3':Object.freeze({objectId:'v302-greenhouse-compostUnit-3',
   effectType:'object-herbPreparationTable',effectKind:'heal',x:313,y:3057,profile:'herb-dose-mortar-resonance',durationMs:700,
   design:'one rounded wooden mortar press and short ceramic settle; no compost or repeated impacts'})
 });
 const finite=Number.isFinite, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const PROFILE_BY_KEY=Object.freeze(Object.fromEntries(Object.values(PROFILES).map(p=>[p.profile,p])));
 function plan({effect,sound,roomId,viewerRoomId,listener,visible=false,submittedEffectIds=[],alreadyPlayedSoundIds=[],
  allowCandidatePlayback=false,now}={}){
  const base={accepted:false,status:'rejected',genericFallbackEligible:true,suppressGenericFallback:false,playCandidate:false};
  if(!effect||!sound||roomId!=='station'||viewerRoomId!==roomId||visible!==true||!Number.isFinite(now))return Object.freeze({...base,reason:'room-or-visibility-gate'});
  const spec=PROFILES[String(effect.objectId||'')];
  if(!spec||effect.type!==spec.effectType||effect.effectKind!==spec.effectKind||effect.x!==spec.x||effect.y!==spec.y||
   typeof effect.id!=='string'||!effect.id||typeof effect.playerId!=='string'||!effect.playerId||
   !finite(effect.startedAt)||!finite(effect.duration)||effect.duration<=0||effect.duration>EFFECT_DURATION_MS||
   now<effect.startedAt||now>=effect.startedAt+effect.duration)return Object.freeze({...base,reason:'exact-object-effect-or-time-mismatch'});
  if(sound.type!=='object'||sound.sourceKind!=='facility'||sound.ownerId!==effect.playerId||sound.x!==spec.x||sound.y!==spec.y||
   typeof sound.id!=='string'||!sound.id||sound.id===effect.id||
   typeof effect.objectCausalId!=='string'||!effect.objectCausalId||sound.objectCausalId!==effect.objectCausalId)
   return Object.freeze({...base,reason:'independent-sound-receipt-has-no-exact-causal-link'});
  if(!contains(submittedEffectIds,effect.id))return Object.freeze({...base,reason:'effect-not-submitted-to-visible-frame'});
  if(contains(alreadyPlayedSoundIds,sound.id))return Object.freeze({...base,reason:'sound-receipt-already-consumed'});
  const maxDistance=Number(sound.maxDistance),rawVolume=Number(sound.volume),lx=Number(listener?.x),ly=Number(listener?.y);
  if(![maxDistance,rawVolume,lx,ly].every(finite)||maxDistance<=0||rawVolume<=0)return Object.freeze({...base,reason:'listener-or-spatial-sound-invalid'});
  const distance=Math.hypot(lx-sound.x,ly-sound.y),attenuation=clamp(1-distance/maxDistance,0,1)*clamp(rawVolume,0,1.25);
  if(distance>maxDistance||attenuation<=.01)return Object.freeze({...base,reason:'sound-out-of-range'});
  const causalId=effect.objectCausalId;
  return Object.freeze({accepted:true,status:'candidate-ready',objectId:spec.objectId,effectKind:spec.effectKind,profile:spec.profile,
   eventId:effect.id,soundId:sound.id,causalId,ownerId:effect.playerId,roomId,startedAt:effect.startedAt,durationMs:spec.durationMs,
   gain:clamp(attenuation,0,1),allowCandidatePlayback:Boolean(allowCandidatePlayback),playCandidate:Boolean(allowCandidatePlayback),
   genericFallbackEligible:true,suppressGenericFallback:false,design:spec.design});
 }
 function renderPcm(profile,sampleRate=48000){
  const spec=PROFILE_BY_KEY[profile];
  if(!spec)throw new RangeError('Unknown greenhouse fixture SFX profile');
  if(!finite(sampleRate)||sampleRate<22050||sampleRate>96000)throw new RangeError('Sample rate must be between 22050 and 96000');
  const length=Math.ceil(sampleRate*spec.durationMs/1000),pcm=new Float32Array(length);
  let noiseState=hash(profile)||1,low=0,previous=0;
  const smooth=x=>{x=clamp(x,0,1);return x*x*(3-2*x);};
  for(let i=0;i<length;i++){
   const t=i/sampleRate,progress=t/(spec.durationMs/1000),attack=smooth(t/.012),release=smooth((1-progress)/.11),env=attack*release;
   noiseState=(Math.imul(noiseState,1664525)+1013904223)>>>0;
   const white=(noiseState/2147483648)-1;
   low+=.075*(white-low);const high=white-low;let v=0;
   if(profile==='compound-leaf-luck-tone'){
    const n0=t-.055,n1=t-.205;
    const a=n0>=0?Math.exp(-n0/ .27):0,b=n1>=0?Math.exp(-n1/.34):0;
    v=env*(.15*a*Math.sin(2*Math.PI*(523*n0+16*n0*n0))+
     .11*b*Math.sin(2*Math.PI*(659*n1+10*n1*n1))+
     .035*Math.exp(-Math.max(0,t-.39)/.18)*Math.sin(2*Math.PI*1047*t));
   }else if(profile==='herbal-mist-fan-release'){
    const gust=smooth(t/.10)*Math.exp(-Math.max(0,t-.18)/.39);
    const glide=405*t+143*t*t;
    v=env*(.050*gust*high+.030*gust*Math.sin(2*Math.PI*glide)+
     .012*Math.exp(-Math.max(0,t-.47)/.16)*Math.sin(2*Math.PI*784*t));
   }else{
    const hit=Math.exp(-sq((t-.025)/.018));
    const thud=Math.exp(-Math.max(0,t-.02)/.19);
    const ceramic=Math.exp(-Math.max(0,t-.035)/.105);
    v=env*(.075*hit*high+.105*thud*Math.sin(2*Math.PI*(151*t-38*t*t))+
     .043*ceramic*Math.sin(2*Math.PI*587*t)+.017*Math.exp(-Math.max(0,t-.24)/.15)*Math.sin(2*Math.PI*392*t));
   }
   // Tiny DC remover and hard peak guard keep generated PCM finite and quiet.
   const dc=v-previous*.985;previous=v;pcm[i]=clamp(dc,-.32,.32);
  }
  pcm[0]=0;pcm[length-1]=0;return pcm;
 }
 function sq(v){return v*v;}
 function hash(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0;}
 function play({planned,context,master,volume,verify=false,muted=false}={}){
  if(!planned?.accepted||!planned.playCandidate||!planned.allowCandidatePlayback||verify||muted||!context||!master||context.state!=='running'||
   typeof context.createBuffer!=='function'||typeof context.createBufferSource!=='function'||typeof context.createGain!=='function')return null;
  const raw=volume===undefined?planned.gain:Number(volume),gainValue=finite(raw)?clamp(raw,0,1):0;if(gainValue<=0)return null;
  const seen=playedByContext.get(context)||new Set();if(seen.has(planned.soundId))return null;
  const spec=PROFILE_BY_KEY[planned.profile];if(!spec)return null;
  try{
   const pcm=renderPcm(spec.profile,context.sampleRate),buffer=context.createBuffer(1,pcm.length,context.sampleRate);
   buffer.getChannelData(0).set(pcm);
   const src=context.createBufferSource(),gain=context.createGain();src.buffer=buffer;gain.gain.setValueAtTime(gainValue,context.currentTime);
   src.connect(gain);gain.connect(master);src.start(context.currentTime);
   seen.add(planned.soundId);playedByContext.set(context,seen);
   return Object.freeze({status:'started',eventId:planned.eventId,soundId:planned.soundId,causalId:planned.causalId,profile:planned.profile,
    startedAt:context.currentTime,durationMs:spec.durationMs});
  }catch(_){return null;}
 }
 const playedByContext=new WeakMap();
 function genericFallbackDecision(planned,playbackReceipt,{replacementGate=false}={}){
  const replaced=Boolean(replacementGate===true&&planned?.accepted&&playbackReceipt?.status==='started'&&
   playbackReceipt.eventId===planned.eventId&&playbackReceipt.soundId===planned.soundId&&playbackReceipt.causalId===planned.causalId&&
   playbackReceipt.profile===planned.profile);
  return Object.freeze({suppressGenericFallback:replaced,genericFallbackEligible:!replaced,
   reason:replaced?'explicit-replacement-started':'replacement-not-proven'});
 }
 function contains(list,value){return list instanceof Set?list.has(value):Array.isArray(list)&&list.includes(value);}
 const api=Object.freeze({DURATION_MS,EFFECT_DURATION_MS,PROFILES,plan,renderPcm,play,genericFallbackDecision});
 root.DvaWebGPUGreenhouseRoomObjectsESfx=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
