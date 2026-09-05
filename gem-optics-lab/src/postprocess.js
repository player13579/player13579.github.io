// CIE XYZ progressive accumulation and a deliberately restrained camera PSF.
// XYZ is the canonical working space: it permits spectral samples to remain
// positive even where their converted display RGB would contain a negative value.
// RGBA16F keeps highlight energy until the final display transform.  On devices
// without EXT_color_buffer_float this falls back to RGBA8, whose useful range is
// approximately [0, 1] per channel (bright caustics will be clipped).

const VERTEX = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const ACCUMULATE = `#version 300 es
precision highp float;
uniform sampler2D uCurrent, uPrevious;
uniform float uPreviousCount;
out vec4 outColor;
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  vec4 current = texelFetch(uCurrent, p, 0);
  vec4 previous = texelFetch(uPrevious, p, 0);
  outColor = (previous * uPreviousCount + current) / (uPreviousCount + 1.0);
}`;

const DOWNSAMPLE = `#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform bool uExtract;
out vec4 outColor;
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy) * 2;
  ivec2 size = textureSize(uSource, 0);
  ivec2 hi = size - 1;
  vec4 sum = vec4(0.0);
  for (int y = 0; y < 2; ++y) for (int x = 0; x < 2; ++x) {
    vec4 radianceSample = texelFetch(uSource, clamp(p + ivec2(x, y), ivec2(0), hi), 0);
    // Extract only actual bright light using CIE Y, then blur its XYZ colour.
    // Subsequent pyramid levels receive already-extracted light unchanged.
    if (uExtract) radianceSample *= smoothstep(0.60, 2.50, max(radianceSample.y, 0.0));
    sum += radianceSample;
  }
  outColor = sum * 0.25;
}`;

const BLUR = `#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform ivec2 uDirection;
out vec4 outColor;
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  ivec2 hi = textureSize(uSource, 0) - 1;
  vec4 sum = texelFetch(uSource, p, 0) * 0.227027;
  sum += (texelFetch(uSource, clamp(p + uDirection * 1, ivec2(0), hi), 0)
        + texelFetch(uSource, clamp(p - uDirection * 1, ivec2(0), hi), 0)) * 0.1945946;
  sum += (texelFetch(uSource, clamp(p + uDirection * 2, ivec2(0), hi), 0)
        + texelFetch(uSource, clamp(p - uDirection * 2, ivec2(0), hi), 0)) * 0.1216216;
  sum += (texelFetch(uSource, clamp(p + uDirection * 3, ivec2(0), hi), 0)
        + texelFetch(uSource, clamp(p - uDirection * 3, ivec2(0), hi), 0)) * 0.054054;
  sum += (texelFetch(uSource, clamp(p + uDirection * 4, ivec2(0), hi), 0)
        + texelFetch(uSource, clamp(p - uDirection * 4, ivec2(0), hi), 0)) * 0.016216;
  outColor = sum;
}`;

const PRESENT = `#version 300 es
precision highp float;
uniform sampler2D uScene, uBloom0, uBloom1, uBloom2;
uniform float uGlare;
out vec4 outColor;

// Manual bilinear filtering keeps the pyramid smooth even when float linear
// filtering is unavailable (OES_texture_float_linear is optional in WebGL2).
vec4 filtered(sampler2D image, vec2 uv) {
  ivec2 s = textureSize(image, 0);
  vec2 f = uv * vec2(s) - 0.5;
  ivec2 base = ivec2(floor(f));
  vec2 t = fract(f);
  ivec2 hi = s - 1;
  vec4 a = texelFetch(image, clamp(base, ivec2(0), hi), 0);
  vec4 b = texelFetch(image, clamp(base + ivec2(1, 0), ivec2(0), hi), 0);
  vec4 c = texelFetch(image, clamp(base + ivec2(0, 1), ivec2(0), hi), 0);
  vec4 d = texelFetch(image, clamp(base + ivec2(1, 1), ivec2(0), hi), 0);
  return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
}
vec3 filmic(vec3 x) {
  // ACES-like shoulder: preserves coloured specular highlights without exposure spikes.
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}
vec3 xyzToLinearSrgb(vec3 xyz) {
  // W3C CSS Color 4 D65 CIE XYZ -> linear sRGB matrix.
  return mat3(3.2409699419, -0.9692436363, 0.0556300797,
             -1.5373831776, 1.8759675015, -0.2039769589,
             -0.4986107603, 0.0415550574, 1.0569715142) * xyz;
}
vec3 linearToSrgb(vec3 x) {
  vec3 lo = x * 12.92;
  vec3 hi = 1.055 * pow(max(x, 0.0), vec3(1.0 / 2.4)) - 0.055;
  return mix(lo, hi, step(vec3(0.0031308), x));
}
float noise(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
void main() {
  vec2 uv = gl_FragCoord.xy / vec2(textureSize(uScene, 0));
  vec3 scene = filtered(uScene, uv).rgb;
  // A three-scale, normalized Gaussian pyramid approximates a lens PSF; it is
  // intentionally low energy so that it reads as flare around real highlights.
  vec3 psf = filtered(uBloom0, uv).rgb * 0.46
           + filtered(uBloom1, uv).rgb * 0.33
           + filtered(uBloom2, uv).rgb * 0.21;
  vec3 highlight = scene * smoothstep(0.60, 2.50, max(scene.y, 0.0));
  // Redistribute highlight energy into the PSF instead of adding free light.
  vec3 linearSrgb = max(xyzToLinearSrgb(scene + (psf - highlight) * clamp(uGlare, 0.0, 0.25)), 0.0);
  vec3 display = filmic(linearSrgb);
  display = linearToSrgb(display);
  display += (noise(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(clamp(display, 0.0, 1.0), 1.0);
}`;

function createOpticalPostprocess(gl) {
  if (!gl || typeof gl.createTexture !== 'function') throw new TypeError('A WebGL2 context is required');

  let width = 0, height = 0, sampleCount = 0, readIndex = 0, destroyed = false;
  const hdrSupported = Boolean(gl.getExtension('EXT_color_buffer_float'));
  // Probe this extension for capability reporting / future tuning. Manual filtering
  // below intentionally avoids making correctness depend on it.
  const floatLinearSupported = Boolean(gl.getExtension('OES_texture_float_linear'));
  const internalFormat = hdrSupported ? gl.RGBA16F : gl.RGBA8;
  const type = hdrSupported ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE;
  const textures = [], framebuffers = [], programs = [];
  let vao, sampleTexture, sampleFbo, accumTextures, accumFbos, pyramid;

  const fail = (message) => { throw new Error(`Optical postprocess: ${message}`); };
  function shader(kind, source) {
    const value = gl.createShader(kind);
    gl.shaderSource(value, source); gl.compileShader(value);
    if (!gl.getShaderParameter(value, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(value); gl.deleteShader(value); fail(log || 'shader compilation failed');
    }
    return value;
  }
  function program(fragment) {
    const vertex = shader(gl.VERTEX_SHADER, VERTEX);
    let pixel;
    try { pixel = shader(gl.FRAGMENT_SHADER, fragment); } catch (error) { gl.deleteShader(vertex); throw error; }
    const value = gl.createProgram();
    gl.attachShader(value, vertex); gl.attachShader(value, pixel); gl.linkProgram(value);
    gl.deleteShader(vertex); gl.deleteShader(pixel);
    if (!gl.getProgramParameter(value, gl.LINK_STATUS)) { const log = gl.getProgramInfoLog(value); gl.deleteProgram(value); fail(log || 'program link failed'); }
    programs.push(value); return value;
  }
  function texture(w, h) {
    const value = gl.createTexture(); textures.push(value);
    gl.bindTexture(gl.TEXTURE_2D, value);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, gl.RGBA, type, null);
    return value;
  }
  function fbo(tex) {
    const value = gl.createFramebuffer(); framebuffers.push(value);
    gl.bindFramebuffer(gl.FRAMEBUFFER, value);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) fail('framebuffer is incomplete');
    return value;
  }
  function bindTexture(unit, value) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, value); }
  function draw(target, w, h, prog) { gl.bindFramebuffer(gl.FRAMEBUFFER, target); gl.viewport(0, 0, w, h); gl.useProgram(prog); gl.drawArrays(gl.TRIANGLES, 0, 3); }
  function cleanResources() {
    framebuffers.splice(0).forEach((x) => gl.deleteFramebuffer(x));
    textures.splice(0).forEach((x) => gl.deleteTexture(x));
    programs.splice(0).forEach((x) => gl.deleteProgram(x));
    if (vao) gl.deleteVertexArray(vao);
  }

  let accumulationProgram, downsampleProgram, blurProgram, presentProgram;
  try {
    vao = gl.createVertexArray();
    accumulationProgram = program(ACCUMULATE);
    downsampleProgram = program(DOWNSAMPLE);
    blurProgram = program(BLUR);
    presentProgram = program(PRESENT);
  } catch (error) { cleanResources(); throw error; }

  function releaseTargets() {
    // Target resources are tracked globally; deleting them here also removes them
    // from the tracking lists so destroy only releases each object once.
    const remove = (items, fn) => items.forEach((x) => { const i = fn.list.indexOf(x); if (i >= 0) fn.list.splice(i, 1); fn.delete(x); });
    const texFn = { list: textures, delete: (x) => gl.deleteTexture(x) };
    const fbFn = { list: framebuffers, delete: (x) => gl.deleteFramebuffer(x) };
    if (pyramid) pyramid.forEach((level) => { remove([level.a, level.b], texFn); remove([level.aFbo, level.bFbo], fbFn); });
    if (accumTextures) remove(accumTextures, texFn);
    if (accumFbos) remove(accumFbos, fbFn);
    if (sampleTexture) remove([sampleTexture], texFn);
    if (sampleFbo) remove([sampleFbo], fbFn);
    pyramid = sampleTexture = sampleFbo = accumTextures = accumFbos = undefined;
  }

  function resize(nextWidth, nextHeight) {
    if (destroyed) return false;
    const max = Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE), gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
    const w = Math.max(1, Math.min(max, Math.floor(Number(nextWidth) || 1)));
    const h = Math.max(1, Math.min(max, Math.floor(Number(nextHeight) || 1)));
    if (w === width && h === height) return false;
    releaseTargets(); width = w; height = h; sampleCount = 0; readIndex = 0;
    try {
      sampleTexture = texture(w, h); sampleFbo = fbo(sampleTexture);
      accumTextures = [texture(w, h), texture(w, h)]; accumFbos = [fbo(accumTextures[0]), fbo(accumTextures[1])];
      pyramid = []; let lw = w, lh = h;
      for (let i = 0; i < 3; i += 1) { lw = Math.max(1, Math.ceil(lw / 2)); lh = Math.max(1, Math.ceil(lh / 2)); const a = texture(lw, lh), b = texture(lw, lh); pyramid.push({ width: lw, height: lh, a, b, aFbo: fbo(a), bFbo: fbo(b) }); }
    } catch (error) {
      // At this point prior targets were released, so every tracked texture/FBO
      // belongs to this failed allocation. Keep the compiled programs usable.
      framebuffers.splice(0).forEach((x) => gl.deleteFramebuffer(x));
      textures.splice(0).forEach((x) => gl.deleteTexture(x));
      pyramid = sampleTexture = sampleFbo = accumTextures = accumFbos = undefined;
      width = height = 0;
      throw error;
    }
    return true;
  }

  function beginSample() {
    if (destroyed) return;
    if (!width || !height) fail('resize must be called before rendering');
    gl.bindVertexArray(vao); gl.bindFramebuffer(gl.FRAMEBUFFER, sampleFbo); gl.viewport(0, 0, width, height);
  }
  function endSample({ reset = false } = {}) {
    if (destroyed) return;
    if (!width || !height) fail('resize must be called before accumulation');
    gl.bindVertexArray(vao);
    const previousCount = reset ? 0 : sampleCount;
    // Always write to the opposite attachment: sampling from the render target
    // currently bound for output is undefined, even when reset discards it.
    const destination = 1 - readIndex;
    bindTexture(0, sampleTexture); bindTexture(1, accumTextures[readIndex]);
    gl.useProgram(accumulationProgram);
    gl.uniform1i(gl.getUniformLocation(accumulationProgram, 'uCurrent'), 0);
    gl.uniform1i(gl.getUniformLocation(accumulationProgram, 'uPrevious'), 1);
    gl.uniform1f(gl.getUniformLocation(accumulationProgram, 'uPreviousCount'), previousCount);
    draw(accumFbos[destination], width, height, accumulationProgram);
    readIndex = destination; sampleCount = previousCount + 1;
  }
  function reset() { sampleCount = 0; readIndex = 0; }
  // Samples are always CIE XYZ.  Convert RGB previews to XYZ before beginSample;
  // converting only here keeps progressive spectral accumulation physically linear.
  function present({ glare = 0.06 } = {}) {
    if (destroyed || !sampleCount) return;
    gl.bindVertexArray(vao);
    let source = accumTextures[readIndex];
    pyramid.forEach((level, index) => {
      gl.useProgram(downsampleProgram); bindTexture(0, source); gl.uniform1i(gl.getUniformLocation(downsampleProgram, 'uSource'), 0); gl.uniform1i(gl.getUniformLocation(downsampleProgram, 'uExtract'), index === 0 ? 1 : 0); draw(level.aFbo, level.width, level.height, downsampleProgram);
      gl.useProgram(blurProgram); bindTexture(0, level.a); gl.uniform1i(gl.getUniformLocation(blurProgram, 'uSource'), 0); gl.uniform2i(gl.getUniformLocation(blurProgram, 'uDirection'), 1, 0); draw(level.bFbo, level.width, level.height, blurProgram);
      gl.useProgram(blurProgram); bindTexture(0, level.b); gl.uniform1i(gl.getUniformLocation(blurProgram, 'uSource'), 0); gl.uniform2i(gl.getUniformLocation(blurProgram, 'uDirection'), 0, 1); draw(level.aFbo, level.width, level.height, blurProgram);
      source = level.a;
    });
    gl.useProgram(presentProgram);
    bindTexture(0, accumTextures[readIndex]); bindTexture(1, pyramid[0].a); bindTexture(2, pyramid[1].a); bindTexture(3, pyramid[2].a);
    gl.uniform1i(gl.getUniformLocation(presentProgram, 'uScene'), 0); gl.uniform1i(gl.getUniformLocation(presentProgram, 'uBloom0'), 1); gl.uniform1i(gl.getUniformLocation(presentProgram, 'uBloom1'), 2); gl.uniform1i(gl.getUniformLocation(presentProgram, 'uBloom2'), 3); gl.uniform1f(gl.getUniformLocation(presentProgram, 'uGlare'), Number(glare) || 0);
    draw(null, width, height, presentProgram);
  }

  return Object.freeze({ resize, beginSample, endSample, present, reset, destroy() { if (!destroyed) { destroyed = true; releaseTargets(); cleanResources(); } }, get sampleCount() { return sampleCount; }, get hdrSupported() { return hdrSupported; }, get floatLinearSupported() { return floatLinearSupported; } });
}

export { createOpticalPostprocess };
