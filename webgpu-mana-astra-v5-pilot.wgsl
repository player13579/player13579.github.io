// Mana v5 isolated three-state pilot. Original surface material, no E texture.
struct Frame { viewport:vec4f, mode:vec4f, sprite:vec4f, };
@group(0) @binding(0) var<uniform> f:Frame;
@group(0) @binding(1) var spriteSampler:sampler;
@group(0) @binding(2) var spriteTexture:texture_2d<f32>;
struct In {
 @location(0) p:vec3f,
 @location(1) n:vec3f,
 @location(2) uv:vec2f,
 @location(3) material:f32,
};
struct Out {
 @builtin(position) p:vec4f,
 @location(0) world:vec3f,
 @location(1) n:vec3f,
 @location(2) uv:vec2f,
 @location(3) @interpolate(flat) material:f32,
};
@vertex fn meshVS(v:In)->Out {
 var o:Out;
 let px=f.viewport.z+(v.p.x+0.36*v.p.z)*f.viewport.w;
 let py=f.mode.z+(v.p.y-0.28*v.p.z)*f.viewport.w;
 o.p=vec4f(px/f.viewport.x*2.0-1.0,1.0-py/f.viewport.y*2.0,0.5-v.p.z*0.4,1.0);
 o.world=v.p;o.n=v.n;o.uv=v.uv;o.material=v.material;return o;
}
fn gauss(x:f32,s:f32)->f32 {return exp(-x*x/(s*s));}
@fragment fn meshFS(v:Out)->@location(0) vec4f {
 let side=f.mode.x;
 let inspectMode=f.mode.w;
 if(inspectMode<0.5) {
   if((side<0.5 && v.world.z>=0.0)||(side>0.5 && v.world.z<0.0)){discard;}
 } else if(inspectMode<1.5) {if(side<0.5){discard;}}
 else if(inspectMode<2.5) {if(side>0.5){discard;}}
 else {if((side<0.5 && v.world.z>=0.0)||(side>0.5 && v.world.z<0.0)){discard;}}
 let normal=normalize(v.n);
 let facing=max(0.0,normal.z);
 let directed=clamp(dot(normal,normalize(vec3f(-0.4,-0.65,0.72))),0.0,1.0);
 let backtone=0.35+0.65*directed;
 let m=v.material;
 var base=vec3f(0.16,0.065,0.41);
 var emission=0.0;
 var coverage=0.0;
 if(m<0.5) {
   let shoulder=gauss(v.uv.x-0.31,0.20)*gauss(v.uv.y-0.17,0.22);
   let middle=gauss(v.uv.x-0.57,0.40);
   base=mix(vec3f(0.08,0.045,0.26),vec3f(0.23,0.24,0.72),directed);
   coverage=0.30+0.38*facing*middle;
   emission=0.12+0.28*directed+1.2*shoulder*directed;
 } else if(m<1.5) {
   let rimShoulder=gauss(v.uv.x-0.32,0.21)*gauss(v.uv.y-0.08,0.26);
   base=mix(vec3f(0.065,0.038,0.19),vec3f(0.20,0.19,0.48),directed);
   coverage=0.48+0.20*facing;
   emission=0.06+0.12*directed+0.47*rimShoulder*directed;
 } else if(m<2.5) {
   let retainedShoulder=gauss(v.uv.x-0.43,0.30)*gauss(v.uv.y-0.17,0.25);
   base=mix(vec3f(0.08,0.06,0.27),vec3f(0.24,0.32,0.72),directed);
   coverage=0.28+0.35*facing;
   emission=0.12+0.36*directed+0.94*retainedShoulder*directed;
 } else {
   let contact=gauss(v.uv.x-0.55,0.30)*gauss(v.uv.y-0.12,0.23);
   base=vec3f(0.20,0.30,0.62);
   coverage=0.36+0.26*facing;
   emission=0.24+1.4*contact*directed;
 }
 let hot=clamp((emission-0.6)*0.8,0.0,0.85);
 let light=mix(vec3f(0.16,0.38,1.0),vec3f(0.80,0.91,1.0),hot);
 var rgb=base*coverage*backtone+light*emission;
 if(inspectMode>2.5 && inspectMode<3.5) {
   let luminance=dot(rgb,vec3f(0.2126,0.7152,0.0722));rgb=vec3f(luminance);
 }
 if(inspectMode>3.5) {
   rgb=select(vec3f(0.20,0.42,0.94),vec3f(0.98,0.36,0.16),v.world.z>=0.0)*coverage;
 }
 return vec4f(rgb,coverage);
}

struct Quad { @builtin(position) p:vec4f, @location(0) uv:vec2f, };
@vertex fn quadVS(@builtin(vertex_index) i:u32)->Quad {
 let corners=array<vec2f,6>(vec2f(0,0),vec2f(1,0),vec2f(0,1),vec2f(0,1),vec2f(1,0),vec2f(1,1));
 var o:Quad;let q=corners[i];let px=f.sprite.xy+q*f.sprite.zw;
 o.p=vec4f(px.x/f.viewport.x*2.0-1.0,1.0-px.y/f.viewport.y*2.0,0.5,1);o.uv=q;return o;
}
@fragment fn spriteFS(v:Quad)->@location(0) vec4f {
 return textureSample(spriteTexture,spriteSampler,v.uv/3.0);
}

// A finite source-local optical support. It has no world thickness or geometry role.
@vertex fn glowVS(@builtin(vertex_index) i:u32)->Quad {
 let q=array<vec2f,6>(vec2f(-1,-1),vec2f(1,-1),vec2f(-1,1),vec2f(-1,1),vec2f(1,-1),vec2f(1,1))[i];
 let px=f.viewport.z+(f.sprite.x+q.x*f.sprite.z)*f.viewport.w;
 let py=f.mode.z+(f.sprite.y+q.y*f.sprite.w)*f.viewport.w;
 var o:Quad;o.p=vec4f(px/f.viewport.x*2.0-1.0,1.0-py/f.viewport.y*2.0,0.5,1);o.uv=q;return o;
}
@fragment fn glowFS(v:Quad)->@location(0) vec4f {
 let r=length(v.uv);if(r>1.0){discard;}
 let intensity=0.13*exp(-r*r*7.0)*(1.0-smoothstep(0.65,1.0,r))*f.mode.y;
 return vec4f(vec3f(0.11,0.28,0.9)*intensity,0.0);
}
