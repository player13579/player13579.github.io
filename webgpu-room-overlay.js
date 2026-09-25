/* One isotropic source-to-world mapping for authored room art. The source
 * remains unchanged; the shader clips it to the authored room polygon. */
(function (root) {
  'use strict';
  const CAFETERIA = Object.freeze({ id: 'cafeteria', x: 1120, y: 2420, w: 930, h: 860,
    polygon: Object.freeze([[0, 80], [100, 0], [830, 0], [930, 100],
      [930, 760], [830, 860], [100, 860], [0, 760]]) });
  const finite = value => typeof value === 'number' && Number.isFinite(value);

  function mapping(image, room = CAFETERIA) {
    const sw = Number(image?.naturalWidth ?? image?.width);
    const sh = Number(image?.naturalHeight ?? image?.height);
    if (![sw, sh, room?.w, room?.h].every(finite) || sw < 1 || sh < 1 ||
        room.w < 1 || room.h < 1 || !Array.isArray(room.polygon) || room.polygon.length !== 8)
      throw new TypeError('Room art and eight-point world geometry are required');
    const sx = sw / room.w, sy = sh / room.h;
    if (Math.abs((sw / sh) / (room.w / room.h) - 1) > 0.002)
      throw new RangeError('Room art aspect ratio cannot use one isotropic mapping');
    // Keep the source's top-left fixed. The world rectangle may leave a tiny
    // source remainder on one axis; never center-crop or stretch that axis.
    const scale = Math.min(sx, sy);
    return Object.freeze({ sourceWidth: sw, sourceHeight: sh, scale,
      offsetX: 0, offsetY: 0 });
  }

  const shader = /* wgsl */`
struct Params { source:vec4f, room:vec4f, polygon:array<vec4f,8>, offset:vec4f };
@group(0) @binding(0) var sourceTexture:texture_2d<f32>;
@group(0) @binding(1) var sourceSampler:sampler;
@group(0) @binding(2) var<uniform> params:Params;
struct VertexOut { @builtin(position) position:vec4f, @location(0) local:vec2f };
@vertex fn vs(@builtin(vertex_index) id:u32)->VertexOut {
  let vertices=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3));
  let q=vertices[id];
  var out:VertexOut; out.position=vec4f(q,0,1);
  out.local=vec2f((q.x+1.0)*.5*params.room.z,(1.0-q.y)*.5*params.room.w);
  return out;
}
fn inside(p:vec2f)->bool {
  var hit=false;
  for(var i=0u;i<8u;i=i+1u){
    let a=params.polygon[i].xy; let b=params.polygon[(i+1u)%8u].xy;
    if((a.y>p.y)!=(b.y>p.y) && p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x){hit=!hit;}
  }
  return hit;
}
@fragment fn fs(input:VertexOut)->@location(0) vec4f {
  if(!inside(input.local)){discard;}
  let sourcePixel=input.local*params.source.z+params.offset.xy;
  return textureSampleLevel(sourceTexture,sourceSampler,sourcePixel/params.source.xy,0);
}`;

  function uniformData(image, room = CAFETERIA) {
    const m = mapping(image, room);
    const data = new Float32Array(44);
    data.set([m.sourceWidth, m.sourceHeight, m.scale, 0,
      room.x, room.y, room.w, room.h]);
    for (let i = 0; i < 8; i += 1) data.set([room.polygon[i][0], room.polygon[i][1], 0, 0], 8 + i * 4);
    data[40] = m.offsetX; data[41] = m.offsetY;
    return data;
  }

  const api = Object.freeze({ CAFETERIA, mapping, uniformData, shader });
  root.DvaWebGPURoomOverlay = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
