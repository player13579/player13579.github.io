/* Original Sunbeam Sol sound: one source-bound 1.2 s optical discharge.
 * Playback starts only after the caller has submitted the matching E frame. */
(function(root){
  'use strict';
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
  function synthesize(sampleRate=48000){
    if(!Number.isInteger(sampleRate)||sampleRate<8000||sampleRate>192000)throw new RangeError('Bad sample rate');
    const count=Math.ceil(1.2*sampleRate),left=new Float32Array(count),right=new Float32Array(count);
    let seed=0x5B202609,low=0,high=0,phase=0,peak=0;
    const TAU=2*Math.PI;
    for(let i=0;i<count;i++){
      const t=i/sampleRate,p=t/1.2;
      const supply=smooth(0,.11,p)*(1-smooth(.86,1,p));
      const carrier=smooth(.06,.23,p)*(1-smooth(.88,1,p));
      const boundary=smooth(.19,.35,p)*(1-smooth(.8,.98,p));
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      const n=seed/2147483648-1;
      low+=.09*(n-low);high+=.37*(n-high);
      const air=(high-low)*(.10*supply+.035*boundary);
      const rise=smooth(.04,.25,p);
      phase+=TAU*(105+96*rise+18*Math.sin(TAU*1.7*t))/sampleRate;
      const body=(.078*Math.sin(phase)+.052*Math.sin(phase*1.51+.4)+
        .024*Math.sin(phase*2.03-.2))*carrier;
      const leading=.055*Math.sin(TAU*(350*t+190*t*t))*supply*(1-smooth(.15,.4,p));
      const edge=.015*Math.sin(TAU*690*t+2.5*Math.sin(TAU*3*t))*boundary;
      const release=1-smooth(.93,1,p);
      const gate=smooth(0,.012,t)*release;
      const pan=.18*Math.sin(TAU*.95*t);
      left[i]=gate*(body+leading+edge+air*(1-pan));
      right[i]=gate*(body+leading+edge*.94+air*(1+pan));
      peak=Math.max(peak,Math.abs(left[i]),Math.abs(right[i]));
    }
    return Object.freeze({sampleRate,duration:1.2,channels:[left,right],peak});
  }
  function createPlayer({context,destination=context?.destination}={}){
    if(!context?.createBuffer||!destination)throw new TypeError('AudioContext required');
    const pcm=synthesize(context.sampleRate);
    const buffer=context.createBuffer(2,pcm.channels[0].length,pcm.sampleRate);
    pcm.channels.forEach((channel,i)=>buffer.copyToChannel(channel,i));
    let room='',generation=-1,current=null,disposed=false;
    const seen=new Set();
    function stop(fade=.04){
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
    function start({eventId,causeId,roomId,roomGeneration,phaseSeconds=0,volume=.6,
      frameSubmitted=false,visible=true,muted=false}={}){
      if(disposed||!eventId||!causeId||!frameSubmitted||!visible||muted||
         !Number.isFinite(phaseSeconds)||phaseSeconds<0||phaseSeconds>=1.2||
         room!==roomId||generation!==roomGeneration||context.state!=='running')return false;
      const key=`${room}:${generation}:${causeId}`;
      if(seen.has(key))return false;
      seen.add(key);
      if(seen.size>256)seen.delete(seen.values().next().value);
      stop(0);
      const source=context.createBufferSource(),gain=context.createGain();
      source.buffer=buffer;
      gain.gain.value=clamp(volume,0,1);
      source.connect(gain);gain.connect(destination);
      const entry={source,gain};current=entry;
      source.onended=()=>{source.disconnect();gain.disconnect();if(current===entry)current=null;};
      source.start(context.currentTime,phaseSeconds);
      return true;
    }
    return Object.freeze({enterRoom,start,stop,destroy(){if(disposed)return;disposed=true;stop(0);},peak:pcm.peak});
  }
  const api=Object.freeze({synthesize,createPlayer});
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.DvaSunbeamSolSfx=api;
})(typeof globalThis==='undefined'?this:globalThis);
