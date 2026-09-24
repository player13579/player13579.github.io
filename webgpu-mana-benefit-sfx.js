/* Mana benefit SFX: refractive reveal, folding resonance and body contact.
 * Synthesized once; the submitted-frame owner decides if it can be heard. */
(function(root){
  'use strict';
  const DURATION=1.2,TAU=2*Math.PI;
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const ease=(a,b,x)=>{const u=clamp((x-a)/(b-a));return u*u*(3-2*u);};
  function synthesize(sampleRate=48000){
    if(!Number.isInteger(sampleRate)||sampleRate<8000||sampleRate>192000)
      throw new RangeError('Invalid sample rate');
    const count=Math.ceil(DURATION*sampleRate);
    const left=new Float32Array(count),right=new Float32Array(count);
    let phaseA=0,phaseB=0,phaseC=0,seed=0x7c53e1a9,filtered=0,peak=0;
    for(let i=0;i<count;i++){
      const sec=i/sampleRate,p=sec/DURATION;
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      const white=seed/2147483648-1;
      filtered+=(white-filtered)*(.12-.07*ease(.1,.6,p));
      const reveal=ease(0,.045,p)*(1-ease(.15,.32,p));
      const folding=ease(.12,.27,p)*(1-ease(.71,.96,p));
      const receive=ease(.28,.38,p)*(1-ease(.69,.94,p));
      const end=1-ease(.92,1,p);
      const glide=1-.19*ease(.12,.68,p);
      phaseA+=TAU*(224*glide)/sampleRate;
      phaseB+=TAU*(337*glide)/sampleRate;
      phaseC+=TAU*(509*glide)/sampleRate;
      const glassAir=(white-filtered)*.030*reveal;
      const refract=(Math.sin(phaseA)*.059+Math.sin(phaseB+.63)*.033+
        Math.sin(phaseC-1.15)*.019)*folding;
      const bloom=(Math.sin(phaseA*.51+.7)*.036+
        Math.sin(phaseB*1.5)*.025)*receive;
      const edge=ease(0,.009,sec)*end;
      const spatial=.085*Math.sin(TAU*(1.1*sec+.08*sec*sec));
      left[i]=edge*(glassAir*(1-spatial)+refract*(1+.12*spatial)+bloom*(1-.2*spatial));
      right[i]=edge*(glassAir*(1+spatial)+refract*(1-.12*spatial)+bloom*(1+.2*spatial));
      peak=Math.max(peak,Math.abs(left[i]),Math.abs(right[i]));
    }
    return Object.freeze({duration:DURATION,sampleRate,channels:[left,right],peak});
  }
  function createPlayer({context,destination=context?.destination}={}){
    if(!context?.createBuffer||!destination)throw new TypeError('AudioContext required');
    const pcm=synthesize(context.sampleRate);
    const buffer=context.createBuffer(2,pcm.channels[0].length,pcm.sampleRate);
    pcm.channels.forEach((samples,i)=>buffer.copyToChannel(samples,i));
    let room='',generation=-1,current=null,destroyed=false;
    const seen=new Set();
    function stop(fade=.03){
      if(!current)return;
      const previous=current;current=null;
      const time=context.currentTime,release=Math.max(0,fade);
      previous.gain.gain.cancelScheduledValues(time);
      previous.gain.gain.setValueAtTime(previous.gain.gain.value,time);
      previous.gain.gain.linearRampToValueAtTime(0,time+release);
      try{previous.source.stop(time+release+.01);}catch(_){}
    }
    function enterRoom(id,nextGeneration){
      if(!id||!Number.isSafeInteger(nextGeneration))throw new TypeError('Room identity required');
      if(room!==id||generation!==nextGeneration){
        stop(0);seen.clear();room=id;generation=nextGeneration;
      }
    }
    function setActorRate(rate){
      if(!Number.isFinite(rate)||rate<0||rate>12)return false;
      if(current)current.source.playbackRate.setValueAtTime(rate,context.currentTime);
      return true;
    }
    function start({causeId,roomId,roomGeneration,phaseSeconds=0,actorRate=1,
      volume=.7,frameSubmitted=false,visible=true,muted=false}={}){
      if(destroyed||!causeId||room!==roomId||generation!==roomGeneration||
         seen.has(String(causeId))||!frameSubmitted||!visible||muted||
         context.state!=='running'||!Number.isFinite(phaseSeconds)||
         phaseSeconds<0||phaseSeconds>=DURATION||
         !Number.isFinite(actorRate)||actorRate<0||actorRate>12)return false;
      seen.add(String(causeId));
      if(seen.size>256)seen.delete(seen.values().next().value);
      stop(0);
      const source=context.createBufferSource(),gain=context.createGain();
      source.buffer=buffer;
      source.playbackRate.setValueAtTime(actorRate,context.currentTime);
      gain.gain.value=clamp(volume);
      source.connect(gain);gain.connect(destination);
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
  root.DvaManaBenefitSfx=api;
})(typeof globalThis==='undefined'?this:globalThis);
