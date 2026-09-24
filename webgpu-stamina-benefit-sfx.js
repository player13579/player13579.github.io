/* Stamina gain E sound: body-adjacent intake, stored resonance, limb release.
 * This module never plays automatically. The submitted-frame owner calls start. */
(function(root){
  'use strict';
  const DURATION=1.18;
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
  function synthesize(sampleRate=48000){
    if(!Number.isInteger(sampleRate)||sampleRate<8000||sampleRate>192000)
      throw new RangeError('Invalid sample rate');
    const count=Math.ceil(DURATION*sampleRate),left=new Float32Array(count),right=new Float32Array(count);
    const TAU=2*Math.PI;let seed=0x52A7C19,low=0,mid=0,phase=0,peak=0;
    for(let i=0;i<count;i++){
      const sec=i/sampleRate,p=sec/DURATION;
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      const noise=seed/2147483648-1;
      low+=.055*(noise-low);mid+=.24*(noise-mid);
      const intake=smooth(0,.085,p)*(1-smooth(.27,.49,p));
      const store=smooth(.12,.33,p)*(1-smooth(.72,.98,p));
      const supply=smooth(.23,.40,p)*(1-smooth(.82,1,p));
      const exit=1-smooth(.94,1,p);
      const f=185+52*smooth(.11,.45,p)-36*smooth(.70,1,p);
      phase+=TAU*f/sampleRate;
      const air=(mid-low)*.115*intake;
      const filled=(.067*Math.sin(phase)+.043*Math.sin(phase*1.99+.3)+
        .020*Math.sin(phase*2.98-.5))*store;
      const limb=.027*Math.sin(TAU*(310*sec+34*sec*sec))*supply*
        (.88+.12*Math.sin(TAU*3.2*sec));
      const softness=smooth(0,.012,sec)*exit;
      const pan=.13*Math.sin(TAU*1.4*sec);
      left[i]=softness*(air*(1-pan)+filled+limb*(1+.28*pan));
      right[i]=softness*(air*(1+pan)+filled*.98+limb*(1-.28*pan));
      peak=Math.max(peak,Math.abs(left[i]),Math.abs(right[i]));
    }
    return Object.freeze({duration:DURATION,sampleRate,channels:[left,right],peak});
  }
  function createPlayer({context,destination=context?.destination}={}){
    if(!context?.createBuffer||!destination)throw new TypeError('AudioContext required');
    const pcm=synthesize(context.sampleRate);
    const buffer=context.createBuffer(2,pcm.channels[0].length,pcm.sampleRate);
    pcm.channels.forEach((data,i)=>buffer.copyToChannel(data,i));
    let room='',generation=-1,current=null,destroyed=false;
    const seen=new Set();
    function stop(fade=.035){
      if(!current)return;
      const old=current;current=null;
      const t=context.currentTime;
      old.gain.gain.cancelScheduledValues(t);
      old.gain.gain.setValueAtTime(old.gain.gain.value,t);
      old.gain.gain.linearRampToValueAtTime(0,t+Math.max(0,fade));
      try{old.source.stop(t+Math.max(0,fade)+.01);}catch(_){}
    }
    function enterRoom(id,nextGeneration){
      if(!id||!Number.isSafeInteger(nextGeneration))throw new TypeError('Room identity required');
      if(room!==id||generation!==nextGeneration){stop(0);seen.clear();room=id;generation=nextGeneration;}
    }
    function setActorRate(rate){
      if(!Number.isFinite(rate)||rate<0||rate>12)return false;
      if(current)current.source.playbackRate.setValueAtTime(rate,context.currentTime);
      return true;
    }
    function start({causeId,roomId,roomGeneration,phaseSeconds=0,actorRate=1,
      volume=.7,frameSubmitted=false,visible=true,muted=false}={}){
      if(destroyed||!causeId||room!==roomId||generation!==roomGeneration||seen.has(String(causeId))||
         !frameSubmitted||!visible||muted||context.state!=='running'||
         !Number.isFinite(phaseSeconds)||phaseSeconds<0||phaseSeconds>=DURATION||
         !Number.isFinite(actorRate)||actorRate<0||actorRate>12)return false;
      seen.add(String(causeId));if(seen.size>256)seen.delete(seen.values().next().value);
      stop(0);
      const source=context.createBufferSource(),gain=context.createGain();
      source.buffer=buffer;source.playbackRate.setValueAtTime(actorRate,context.currentTime);
      gain.gain.value=clamp(volume);source.connect(gain);gain.connect(destination);
      const entry={source,gain};current=entry;
      source.onended=()=>{source.disconnect();gain.disconnect();if(current===entry)current=null;};
      source.start(context.currentTime,phaseSeconds);
      return true;
    }
    return Object.freeze({enterRoom,start,setActorRate,stop,destroy(){
      if(destroyed)return;destroyed=true;stop(0);
    },peak:pcm.peak});
  }
  const api=Object.freeze({DURATION,synthesize,createPlayer});
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.DvaStaminaBenefitSfx=api;
})(typeof globalThis==='undefined'?this:globalThis);
