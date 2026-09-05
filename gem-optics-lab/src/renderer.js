import {
  GEM_MATERIALS,
  OPTICS_APPROXIMATIONS,
  clamp,
  createCutPlanes,
  cauchyCoefficients,
} from './optics.js?v=20260905-ipad-hq';
import { createOpticalPostprocess } from './postprocess.js';
import { createSpectralTable } from './spectrum.js';
import {
  adaptMotionScale,
  canContinueMotionBatch,
  getRenderPolicy,
  motionPixelBudget,
} from './render-policy.js?v=20260905-ipad-hq';

const MAX_PLANES = 128;
const MAX_BOUNCES = 40;

const DEFAULT_OPTIONS = Object.freeze({
  gem: 'diamond',
  cut: 'brilliant',
  environment: 'studio',
  lightAngle: 28,
  intensity: 1.15,
  dispersion: 1,
  autoRotate: false,
  quality: 'auto',
  yaw: 0.35,
  pitch: 0.95,
  zoom: 0.96,
});

const ENVIRONMENTS = Object.freeze({ studio: 0, spotlight: 1, daylight: 2 });

const VERTEX_SHADER = `#version 300 es
precision highp float;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
precision highp int;

#define MAX_PLANES ${MAX_PLANES}
#define MAX_BOUNCES ${MAX_BOUNCES}

out vec4 outColor;
uniform vec2 uResolution;
uniform vec2 uJitter;
uniform int uSampleIndex;
uniform int uSpectralCount;
uniform int uBounceLimit;
uniform vec3 uCauchy;
uniform vec4 uSpectrum[48];
uniform vec4 uDaylight[12];
uniform sampler2D uIlluminants;
uniform vec3 uView;
uniform float uLightAngle;
uniform float uIntensity;
uniform vec3 uAbsorption;
uniform int uPlaneCount;
uniform int uEnvironment;
uniform vec4 uPlanes[MAX_PLANES];

const float PI = 3.141592653589793;
const float EPSILON = 0.000045;

mat2 rotate2(float angle) {
  float c = cos(angle), s = sin(angle);
  return mat2(c, -s, s, c);
}

float softRect(vec3 d, vec3 center, vec3 tangent, float width, float height, float softness) {
  vec3 c = normalize(center);
  vec3 t = normalize(tangent - c * dot(c, tangent));
  vec3 b = cross(c, t);
  float facing = dot(d, c);
  if (facing <= 0.0) return 0.0;
  vec2 q = vec2(dot(d, t), dot(d, b)) / max(facing, 0.025);
  vec2 edge = 1.0 - smoothstep(vec2(width, height) - softness,
                               vec2(width, height) + softness, abs(q));
  return edge.x * edge.y;
}

bool intersectGem(vec3 origin, vec3 direction, out float nearT, out float farT,
                  out vec3 nearNormal, out vec3 farNormal) {
  nearT = -1e20;
  farT = 1e20;
  nearNormal = vec3(0.0);
  farNormal = vec3(0.0);
  for (int i = 0; i < MAX_PLANES; i++) {
    if (i >= uPlaneCount) break;
    vec3 normal = uPlanes[i].xyz;
    float denominator = dot(normal, direction);
    float numerator = uPlanes[i].w - dot(normal, origin);
    if (abs(denominator) < 1e-7) {
      if (numerator < 0.0) return false;
    } else {
      float t = numerator / denominator;
      if (denominator < 0.0 && t > nearT) {
        nearT = t;
        nearNormal = normal;
      } else if (denominator > 0.0 && t < farT) {
        farT = t;
        farNormal = normal;
      }
    }
    if (nearT > farT) return false;
  }
  return farT >= 0.0 && farT < 1e19;
}

// Once a ray is known to be inside a convex gem, only outward-facing planes
// can be its next boundary. This avoids computing the unused entry slab at
// every internal reflection.
bool intersectGemExit(vec3 origin, vec3 direction, out float exitT, out vec3 exitNormal) {
  exitT = 1e20;
  exitNormal = vec3(0.0);
  for (int i = 0; i < MAX_PLANES; i++) {
    if (i >= uPlaneCount) break;
    vec3 normal = uPlanes[i].xyz;
    float denominator = dot(normal, direction);
    if (denominator > 1e-7) {
      float t = (uPlanes[i].w - dot(normal, origin)) / denominator;
      if (t >= 0.0 && t < exitT) {
        exitT = t;
        exitNormal = normal;
      }
    }
  }
  return exitT < 1e19;
}

float fresnelDielectric(float cosIncident, float n1, float n2, out bool tir) {
  float ci = clamp(abs(cosIncident), 0.0, 1.0);
  float eta = n1 / n2;
  float sinTransmittedSquared = eta * eta * max(0.0, 1.0 - ci * ci);
  if (sinTransmittedSquared >= 1.0) {
    tir = true;
    return 1.0;
  }
  tir = false;
  float ct = sqrt(max(0.0, 1.0 - sinTransmittedSquared));
  float rs = (n1 * ci - n2 * ct) / (n1 * ci + n2 * ct);
  float rp = (n2 * ci - n1 * ct) / (n2 * ci + n1 * ct);
  return clamp(0.5 * (rs * rs + rp * rp), 0.0, 1.0);
}

// Planck's law ratios: analytic illuminants, normalized at 550 nm.
float blackbody(float wavelength, float temperature) {
  float c2 = 14387769.0;
  return pow(550.0 / wavelength, 5.0)
    * (exp(c2 / (550.0 * temperature)) - 1.0)
    / (exp(c2 / (wavelength * temperature)) - 1.0);
}

float spectralEnvironment(vec3 direction, vec4 lamps, float daylight) {
  vec3 d = normalize(direction);
  d.xy = rotate2(-uLightAngle) * d.xy;
  float upper = smoothstep(-0.5, 0.9, d.z);
  float base = (0.028 + upper * 0.025) * daylight;
  if (uEnvironment == 0) {
    float key = softRect(d, vec3(-0.52,-0.67,0.53), vec3(0.78,-0.62,0.0),0.26,0.50,0.035);
    float rim = softRect(d, vec3(0.82,0.32,0.48), vec3(-0.36,0.93,0.0),0.10,0.46,0.02);
    float strip = softRect(d, vec3(0.32,-0.05,0.95),vec3(0.98,0.0,-0.22),0.57,0.038,0.008);
    float pin = pow(max(dot(d,normalize(vec3(-0.20,0.88,0.44))),0.0),1100.0);
    float fill = softRect(d,vec3(-0.62,0.63,-0.32),vec3(0.74,0.67,0.0),0.38,0.33,0.10);
    return base + key*5.3*lamps.x + rim*3.1*lamps.y
      + strip*3.7*daylight + pin*17.0*lamps.z + fill*0.55*daylight;
  }
  if (uEnvironment == 1) {
    float spot=pow(max(dot(d,normalize(vec3(-0.38,-0.78,0.50))),0.0),220.0);
    float pin=pow(max(dot(d,normalize(vec3(0.60,0.63,0.49))),0.0),1700.0);
    float slash=softRect(d,vec3(-0.20,0.10,0.97),vec3(0.98,0.02,0.20),0.38,0.022,0.006);
    return base*0.42 + spot*10.0*lamps.z + pin*28.0*daylight
      + slash*3.4*lamps.y;
  }
  float sky=pow(max(d.z*.5+.5,0.0),1.5);
  float sun=pow(max(dot(d,normalize(vec3(-0.42,-0.52,0.74))),0.0),1600.0);
  float window=softRect(d,vec3(0.58,0.34,0.74),vec3(-0.50,0.86,0.0),0.36,0.36,0.06);
  return base + sky*0.38*daylight + sun*30.0*lamps.w
    + window*3.2*daylight + max(-d.z,0.0)*0.05*lamps.z;
}

float spectralAbsorption(float wavelength) {
  if (wavelength < 550.0) return mix(uAbsorption.b,uAbsorption.g,clamp((wavelength-460.0)/90.0,0.0,1.0));
  return mix(uAbsorption.g,uAbsorption.r,clamp((wavelength-550.0)/60.0,0.0,1.0));
}

float traceSpectral(vec3 entry, vec3 incident, vec3 entryNormal, float wavelength, float daylight, vec4 lamps) {
  float waveUm=wavelength*.001;
  float ior=uCauchy.x + uCauchy.y*(1.0/(waveUm*waveUm)-1.0/(.58930*.58930))*uCauchy.z;
  float absorption=spectralAbsorption(wavelength);
  bool tir;
  float f=fresnelDielectric(-dot(incident,entryNormal),1.0,ior,tir);
  float radiance=f*spectralEnvironment(reflect(incident,entryNormal),lamps,daylight);
  float throughput=1.0-f;
  vec3 direction=refract(incident,entryNormal,1.0/ior);
  vec3 origin=entry+direction*EPSILON;
  for(int bounce=0;bounce<MAX_BOUNCES;bounce++) {
    if(bounce>=uBounceLimit)break;
    float distance;vec3 normal;
    if(!intersectGemExit(origin,direction,distance,normal))break;
    throughput*=exp(-absorption*distance);
    vec3 point=origin+direction*distance;
    float reflectance=fresnelDielectric(dot(direction,normal),ior,1.0,tir);
    if(!tir)radiance+=throughput*(1.0-reflectance)
      *spectralEnvironment(refract(direction,-normal,ior),lamps,daylight);
    throughput*=reflectance;
    if(throughput<0.00012)break;
    direction=reflect(direction,normal);origin=point+direction*EPSILON;
  }
  return radiance;
}

vec3 rgbToXYZ(vec3 c) {
  return mat3(.4123908,.2126390,.0193308, .3575843,.7151687,.1191948, .1804808,.0721923,.9505322)*c;
}

void main() {
  vec2 pixel=gl_FragCoord.xy+uJitter;
  vec2 centered=(2.0*pixel-uResolution.xy)/uResolution.y;
  float yaw=uView.x,pitch=uView.y,zoom=uView.z;
  float framing=min(1.0,(uResolution.x/uResolution.y)*0.96);
  vec3 target=vec3(0.0,0.0,-0.18);
  vec3 camera=target+3.65*vec3(sin(yaw)*cos(pitch),-cos(yaw)*cos(pitch),sin(pitch));
  vec3 forward=normalize(target-camera);
  vec3 right=normalize(cross(forward,vec3(0.0,0.0,1.0)));
  vec3 up=cross(right,forward);
  vec3 ray=normalize(forward*2.82+(centered.x*right+centered.y*up)/(zoom*framing));
  vec3 xyz;
  float nearT,farT;vec3 normal,farNormal;
  if(intersectGem(camera,ray,nearT,farT,normal,farNormal)&&nearT>0.0) {
    vec3 point=camera+ray*nearT;
    xyz=vec3(0.0);
    // Every presented cycle covers all bands. Each subpass traces three bands;
    // the CPU freezes one camera pose until all strata have accumulated.
    ivec2 p=ivec2(gl_FragCoord.xy);
    int strata=uSpectralCount/3;
    int offset=(p.x*73+p.y*151+uSampleIndex)%strata;
    for(int k=0;k<3;k++) {
      int index=offset+k*strata;
      vec4 band=uSpectrum[index];
      float daylight=uDaylight[index/4][index%4];
      vec4 lamps=texelFetch(uIlluminants,ivec2(index,0),0);
      xyz+=traceSpectral(point,ray,normal,band.x,daylight,lamps)*band.yzw/3.0;
    }
    xyz*=uIntensity;
  } else {
    float radial=length(centered*vec2(.72,.86));
    vec3 background=mix(vec3(.008,.011,.019),vec3(.0025,.0035,.006),smoothstep(.05,1.25,radial));
    background+=.006*pow(max(0.0,1.0-radial),3.0)*vec3(.55,.66,1.0);
    xyz=rgbToXYZ(background);
  }
  // Accumulate scene-linear XYZ. Tone mapping, camera glare and sRGB occur once at presentation.
  outColor=vec4(xyz,1.0);
}`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) || 'Unknown shader compilation error';
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

function createProgram(gl) {
  const vertex = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || 'Unknown shader link error';
    gl.deleteProgram(program);
    throw new Error(log);
  }
  return program;
}

function validateOptions(current, partial) {
  const next = { ...current };
  if ('gem' in partial) {
    if (!GEM_MATERIALS[partial.gem]) throw new RangeError(`Unknown gem: ${partial.gem}`);
    next.gem = partial.gem;
  }
  if ('cut' in partial) {
    if (!['brilliant', 'emerald', 'oval'].includes(partial.cut)) throw new RangeError(`Unknown cut: ${partial.cut}`);
    next.cut = partial.cut;
  }
  if ('environment' in partial) {
    if (!(partial.environment in ENVIRONMENTS)) throw new RangeError(`Unknown environment: ${partial.environment}`);
    next.environment = partial.environment;
  }
  if ('quality' in partial) {
    if (!['auto', 'high', 'ultra'].includes(partial.quality)) throw new RangeError(`Unknown quality: ${partial.quality}`);
    next.quality = partial.quality;
  }
  if ('lightAngle' in partial) next.lightAngle = Number(partial.lightAngle);
  if ('intensity' in partial) next.intensity = clamp(Number(partial.intensity), 0.3, 3);
  if ('dispersion' in partial) next.dispersion = clamp(Number(partial.dispersion), 0, 2);
  if ('autoRotate' in partial) next.autoRotate = Boolean(partial.autoRotate);
  if ('yaw' in partial) next.yaw = Number(partial.yaw);
  if ('pitch' in partial) next.pitch = clamp(Number(partial.pitch), -1.35, 1.45);
  if ('zoom' in partial) next.zoom = clamp(Number(partial.zoom), 0.55, 2.8);
  for (const key of ['lightAngle', 'intensity', 'dispersion', 'yaw', 'pitch', 'zoom']) {
    if (!Number.isFinite(next[key])) throw new TypeError(`${key} must be a finite number`);
  }
  return next;
}


export function createGemRenderer(canvas,{onError,onStats}={}) {
  if(!(canvas instanceof HTMLCanvasElement))throw new TypeError('A canvas element is required');
  let gl,program,post;
  try {
    gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'high-performance'});
    if(!gl)throw new Error('WebGL 2 is unavailable');
    program=createProgram(gl);post=createOpticalPostprocess(gl);
  }catch(error){if(program)gl.deleteProgram(program);onError?.(error);throw error;}
  const vao=gl.createVertexArray();
  const illuminantTexture=gl.createTexture();
  const uniform={};
  for(const name of ['uResolution','uJitter','uSampleIndex','uSpectralCount','uBounceLimit','uCauchy','uView','uLightAngle','uIntensity','uAbsorption','uPlaneCount','uEnvironment','uPlanes[0]','uSpectrum[0]','uDaylight[0]','uIlluminants'])uniform[name]=gl.getUniformLocation(program,name);
  let state={...DEFAULT_OPTIONS};
  let planes=createCutPlanes(state.cut),spectrum=createSpectralTable(24);
  let destroyed=false,frame=0,dirty=true,planesDirty=true,spectrumDirty=true;
  let rotationOffset=0,previous=performance.now(),lastInteraction=0,lastReport=0;
  let mode='none',statsStart=previous;
  let motionCycle=null,completedMotionFrames=0,totalPresentedFrames=0;
  let presentedSinceStats=0,motionPresentedSinceStats=0;
  let renderedYaw=null,renderedPitch=null,renderedZoom=null;
  let adaptiveScale=1,motionFrameMean=0,lastMotionPresent=0;
  let motionFramesSinceAdapt=0,lastAdaptAt=0;
  let pointer=null;
  const pointers=new Map();
  let pinchDistance=0;
  const oldTouchAction=canvas.style.touchAction;canvas.style.touchAction='none';
  function isMovingMode(){return mode==='motion-spectral';}
  function policy(moving=isMovingMode()){return getRenderPolicy(state.quality,moving);}
  function targetSamples(){return getRenderPolicy(state.quality,false).targetSamples;}
  function bounceLimit(moving=isMovingMode()){return policy(moving).bounces;}
  function activateSpectrum(moving){
    const count=getRenderPolicy(state.quality,moving).spectralBands;
    if(spectrum.count!==count){spectrum=createSpectralTable(count);spectrumDirty=true;}
  }
  function desiredDpr(){
    const device=window.devicePixelRatio||1;
    return state.quality==='ultra'?Math.min(Math.max(device,1.25),2):state.quality==='high'?Math.min(device,1.6):Math.min(device,2);
  }
  function resize(moving=isMovingMode()){
    const rect=canvas.getBoundingClientRect();
    let dpr=desiredDpr();
    const maxPixels=moving
      ?motionPixelBudget(state.quality,state.quality==='auto'?adaptiveScale:1)
      :getRenderPolicy(state.quality,false).maxPixels;
    dpr=Math.min(dpr,Math.sqrt(maxPixels/Math.max(1,rect.width*rect.height)));
    const w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));
    if(canvas.width!==w||canvas.height!==h){
      canvas.width=w;canvas.height=h;post.resize(w,h);motionCycle=null;dirty=true;
    }
  }
  function halton(index,base){let value=0,f=1;while(index>0){f/=base;value+=f*(index%base);index=Math.floor(index/base);}return value;}
  function resetStats(now){statsStart=now;presentedSinceStats=0;motionPresentedSinceStats=0;}
  function notify(now,moving,motionSamples=0,force=false){
    if(!force&&now-lastReport<110&&post.sampleCount!==targetSamples())return;
    lastReport=now;
    const elapsed=Math.max(1,now-statsStart);
    onStats?.({
      fps:presentedSinceStats*1000/elapsed,
      presentFPS:presentedSinceStats*1000/elapsed,
      motionFPS:motionPresentedSinceStats*1000/elapsed,
      bounces:bounceLimit(moving),planes:planes.length,
      dpr:canvas.width/Math.max(1,canvas.clientWidth),
      samples:moving?0:post.sampleCount,targetSamples:targetSamples(),
      motionSamples,targetMotionSamples:spectrum.count/3,
      spectralBands:spectrum.count,
      refining:!moving&&post.sampleCount<targetSamples(),moving,
      mode,completedMotionFrames,totalPresentedFrames,
      renderedYaw,renderedPitch,renderedZoom,
      renderPixels:canvas.width*canvas.height,adaptiveScale,
      hdr:post.hdrSupported,
    });
    if(elapsed>=2000)resetStats(now);
  }

  function drawSpectralPass(renderState,sampleIndex,jitterX,jitterY){
    post.beginSample();
    gl.useProgram(program);gl.bindVertexArray(vao);
    const material=GEM_MATERIALS[renderState.gem];
    const coefficients=cauchyCoefficients(material.ior,material.abbe);
    gl.uniform2f(uniform.uResolution,canvas.width,canvas.height);
    gl.uniform2f(uniform.uJitter,jitterX,jitterY);
    gl.uniform1i(uniform.uSampleIndex,sampleIndex);
    gl.uniform1i(uniform.uSpectralCount,spectrum.count);
    gl.uniform1i(uniform.uBounceLimit,getRenderPolicy(renderState.quality,renderState.moving).bounces);
    gl.uniform3f(uniform.uCauchy,material.ior,coefficients.B,renderState.dispersion);
    gl.uniform3f(uniform.uView,renderState.yaw,renderState.pitch,renderState.zoom);
    gl.uniform1f(uniform.uLightAngle,renderState.lightAngle*Math.PI/180);
    gl.uniform1f(uniform.uIntensity,renderState.intensity);
    gl.uniform3fv(uniform.uAbsorption,material.absorption);
    gl.uniform1i(uniform.uEnvironment,ENVIRONMENTS[renderState.environment]);
    if(planesDirty){
      if(planes.length>MAX_PLANES)throw new Error('Gem geometry exceeds shader capacity');
      const packed=new Float32Array(MAX_PLANES*4);
      planes.forEach((p,i)=>packed.set([...p.normal,p.distance],i*4));
      gl.uniform4fv(uniform['uPlanes[0]'],packed);gl.uniform1i(uniform.uPlaneCount,planes.length);planesDirty=false;
    }
    gl.activeTexture(gl.TEXTURE4);gl.bindTexture(gl.TEXTURE_2D,illuminantTexture);gl.uniform1i(uniform.uIlluminants,4);
    if(spectrumDirty){
      const daylightUniform=new Float32Array(48);daylightUniform.set(spectrum.daylight);
      gl.uniform4fv(uniform['uSpectrum[0]'],spectrum.packed);gl.uniform4fv(uniform['uDaylight[0]'],daylightUniform);
      const lamps=new Float32Array(48*4);
      spectrum.wavelengths.forEach((w,i)=>[5400,8500,4200,5800].forEach((temperature,k)=>{
        lamps[i*4+k]=Math.pow(550/w,5)*Math.expm1(14387769/(550*temperature))/Math.expm1(14387769/(w*temperature));
      }));
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA32F,48,1,0,gl.RGBA,gl.FLOAT,lamps);spectrumDirty=false;
    }
    gl.drawArrays(gl.TRIANGLES,0,3);
    post.endSample();
  }

  function render(now){
    if(destroyed)return;
    frame=requestAnimationFrame(render);
    const delta=Math.min((now-previous)/1000,.1);previous=now;
    if(document.hidden)return;
    try {
      const moving=state.autoRotate||pointers.size>0||now-lastInteraction<120;
      const nextMode=moving?'motion-spectral':'static-progressive';
      if(mode!==nextMode){
        mode=nextMode;motionCycle=null;post.reset();dirty=true;resetStats(now);
        activateSpectrum(moving);
        if(moving){motionFrameMean=0;lastMotionPresent=0;motionFramesSinceAdapt=0;lastAdaptAt=now;}
      }
      resize(moving);
      if(!moving&&!dirty&&post.sampleCount>=targetSamples())return;
      if(state.autoRotate&&!pointers.size)rotationOffset+=delta*.085;
      if(moving){
        const strata=spectrum.count/3;
        if(!motionCycle){
          post.reset();
          motionCycle={state:{...state,yaw:state.yaw+rotationOffset,moving:true},subpass:0,strata};
          dirty=false;
        }
        const batchStart=performance.now();
        let batched=0;
        while(motionCycle.subpass<motionCycle.strata
          && canContinueMotionBatch(batched,performance.now()-batchStart)){
          drawSpectralPass(motionCycle.state,motionCycle.subpass,0,0);
          motionCycle.subpass++;batched++;
        }
        const motionSamples=motionCycle.subpass;
        const completed=motionSamples===motionCycle.strata;
        if(completed){
          post.present({glare:.075});
          renderedYaw=motionCycle.state.yaw;
          renderedPitch=motionCycle.state.pitch;renderedZoom=motionCycle.state.zoom;
          completedMotionFrames++;totalPresentedFrames++;
          presentedSinceStats++;motionPresentedSinceStats++;
          const finishedAt=performance.now();
          if(state.quality==='auto'&&lastMotionPresent>0){
            const frameMs=Math.min(500,finishedAt-lastMotionPresent);
            motionFrameMean=motionFrameMean?motionFrameMean*.78+frameMs*.22:frameMs;
            motionFramesSinceAdapt++;
            if(motionFramesSinceAdapt>=8&&finishedAt-lastAdaptAt>=750){
              adaptiveScale=adaptMotionScale(adaptiveScale,motionFrameMean);
              motionFramesSinceAdapt=0;lastAdaptAt=finishedAt;
            }
          }
          lastMotionPresent=finishedAt;
          motionCycle=null;post.reset();
        }
        notify(now,true,motionSamples,completed);
        return;
      }

      if(dirty){post.reset();dirty=false;}
      const count=post.sampleCount;
      const strata=spectrum.count/3;
      const cycle=Math.floor(count/strata)+1;
      const renderState={...state,yaw:state.yaw+rotationOffset,moving:false};
      drawSpectralPass(
        renderState,count,
        (halton(count+1,2)+halton(cycle,5))%1-.5,
        (halton(count+1,3)+halton(cycle,7))%1-.5,
      );
      if(post.sampleCount%strata===0){
        post.present({glare:.075});
        renderedYaw=renderState.yaw;
        renderedPitch=renderState.pitch;renderedZoom=renderState.zoom;
        totalPresentedFrames++;presentedSinceStats++;
      }
      notify(now,false,0);
    }catch(error){cancelAnimationFrame(frame);onError?.(error);}
  }
  function changed(interaction=true){dirty=true;if(interaction)lastInteraction=performance.now();}
  function foldRotation(){state.yaw+=rotationOffset;rotationOffset=0;}
  function pointerDown(event){
    foldRotation();canvas.focus({preventScroll:true});
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    pointer={id:event.pointerId,x:event.clientX,y:event.clientY};
    canvas.setPointerCapture(event.pointerId);
    if(pointers.size===2){const [a,b]=[...pointers.values()];pinchDistance=Math.hypot(a.x-b.x,a.y-b.y);}
  }
  function pointerMove(event){
    if(!pointers.has(event.pointerId))return;
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if(pointers.size===2){const[a,b]=[...pointers.values()];const distance=Math.hypot(a.x-b.x,a.y-b.y);if(pinchDistance>0)state.zoom=clamp(state.zoom*distance/pinchDistance,.55,2.8);pinchDistance=distance;}
    else if(pointer?.id===event.pointerId){state.yaw-=(event.clientX-pointer.x)*.007;state.pitch=clamp(state.pitch+(event.clientY-pointer.y)*.006,-1.35,1.45);}
    pointer={id:event.pointerId,x:event.clientX,y:event.clientY};changed();
  }
  function pointerUp(event){pointers.delete(event.pointerId);if(pointer?.id===event.pointerId)pointer=null;pinchDistance=0;changed();}
  function wheel(event){event.preventDefault();state.zoom=clamp(state.zoom*Math.exp(-event.deltaY*.001),.55,2.8);changed();}
  function resetView(){rotationOffset=0;state={...state,yaw:DEFAULT_OPTIONS.yaw,pitch:DEFAULT_OPTIONS.pitch,zoom:DEFAULT_OPTIONS.zoom};changed(false);}
  function keyDown(event){
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','_','0'].includes(event.key))return;
    foldRotation();const turn=event.shiftKey?.16:.07;
    if(event.key==='ArrowLeft')state.yaw+=turn;
    if(event.key==='ArrowRight')state.yaw-=turn;
    if(event.key==='ArrowUp')state.pitch=clamp(state.pitch-turn,-1.35,1.45);
    if(event.key==='ArrowDown')state.pitch=clamp(state.pitch+turn,-1.35,1.45);
    if(event.key==='+'||event.key==='=')state.zoom=clamp(state.zoom*1.1,.55,2.8);
    if(event.key==='-'||event.key==='_')state.zoom=clamp(state.zoom/1.1,.55,2.8);
    if(event.key==='0')resetView();
    changed();event.preventDefault();
  }
  function visibility(){
    previous=performance.now();
    if(!document.hidden){motionCycle=null;post.reset();changed(false);}
  }
  function contextLost(event){event.preventDefault();cancelAnimationFrame(frame);onError?.(new Error('WebGL context lost; reload to restore'));}
  const handlers={pointerdown:pointerDown,pointermove:pointerMove,pointerup:pointerUp,pointercancel:pointerUp,keydown:keyDown,webglcontextlost:contextLost};
  Object.entries(handlers).forEach(([name,fn])=>canvas.addEventListener(name,fn));
  canvas.addEventListener('wheel',wheel,{passive:false});document.addEventListener('visibilitychange',visibility);
  const observer=new ResizeObserver(()=>{try{resize();}catch(error){onError?.(error)}});observer.observe(canvas);
  frame=requestAnimationFrame(render);
  return Object.freeze({
    setOptions(partial={}){
      const prior=state;state=validateOptions(state,partial);
      if(state.cut!==prior.cut){planes=createCutPlanes(state.cut);planesDirty=true;}
      if(state.quality!==prior.quality){
        adaptiveScale=1;motionFrameMean=0;lastMotionPresent=0;
        activateSpectrum(isMovingMode());
      }
      const opticsChanged=['gem','cut','environment','lightAngle','intensity','dispersion','quality']
        .some((key)=>state[key]!==prior[key]);
      if(opticsChanged){motionCycle=null;post.reset();}
      changed(false);
    },resetView,
    destroy(){if(destroyed)return;destroyed=true;cancelAnimationFrame(frame);observer.disconnect();Object.entries(handlers).forEach(([name,fn])=>canvas.removeEventListener(name,fn));canvas.removeEventListener('wheel',wheel);document.removeEventListener('visibilitychange',visibility);canvas.style.touchAction=oldTouchAction;post.destroy();gl.deleteTexture(illuminantTexture);gl.deleteVertexArray(vao);gl.deleteProgram(program);},
    getState(){
      const moving=isMovingMode();
      return Object.freeze({
        ...state,yaw:state.yaw+rotationOffset,planeCount:planes.length,
        maxBounces:bounceLimit(moving),sampleCount:moving?0:post.sampleCount,
        targetSamples:targetSamples(),spectralBands:spectrum.count,
        motionSamples:motionCycle?.subpass??0,
        targetMotionSamples:getRenderPolicy(state.quality,true).strata,
        moving,mode,completedMotionFrames,totalPresentedFrames,
        renderedYaw,renderedPitch,renderedZoom,
        renderPixels:canvas.width*canvas.height,adaptiveScale,
        hdr:post.hdrSupported,approximations:OPTICS_APPROXIMATIONS,
      });
    },
  });
}

export {DEFAULT_OPTIONS,MAX_BOUNCES};
