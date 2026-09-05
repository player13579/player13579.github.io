import {
  GEM_MATERIALS,
  OPTICS_APPROXIMATIONS,
  clamp,
  createCutPlanes,
  refractiveIndicesRGB,
} from './optics.js';

const MAX_PLANES = 64;
const MAX_BOUNCES = 12;

const DEFAULT_OPTIONS = Object.freeze({
  gem: 'diamond',
  cut: 'brilliant',
  environment: 'studio',
  lightAngle: 28,
  intensity: 1.15,
  dispersion: 1,
  autoRotate: true,
  quality: 'auto',
  yaw: 0.35,
  pitch: 0.66,
  zoom: 1,
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
uniform float uTime;
uniform vec3 uView;
uniform float uLightAngle;
uniform float uIntensity;
uniform vec3 uIor;
uniform vec3 uAbsorption;
uniform int uPlaneCount;
uniform int uEnvironment;
uniform vec3 uPlaneNormal[MAX_PLANES];
uniform float uPlaneDistance[MAX_PLANES];

const float PI = 3.141592653589793;
const float EPSILON = 0.00035;

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

vec3 environmentRadiance(vec3 direction) {
  vec3 d = normalize(direction);
  float a = uLightAngle;
  d.xy = rotate2(-a) * d.xy;

  vec3 base = vec3(0.019, 0.023, 0.032);
  float upper = smoothstep(-0.5, 0.9, d.z);
  base += vec3(0.013, 0.017, 0.024) * upper;

  if (uEnvironment == 0) {
    float key = softRect(d, vec3(-0.52, -0.67, 0.53), vec3(0.78, -0.62, 0.0), 0.30, 0.54, 0.055);
    float rim = softRect(d, vec3(0.82, 0.32, 0.48), vec3(-0.36, 0.93, 0.0), 0.13, 0.48, 0.035);
    float strip = softRect(d, vec3(0.32, -0.05, 0.95), vec3(0.98, 0.0, -0.22), 0.62, 0.045, 0.012);
    float pin = pow(max(dot(d, normalize(vec3(-0.20, 0.88, 0.44))), 0.0), 620.0);
    return base + key * vec3(5.2, 4.7, 4.15) + rim * vec3(1.8, 2.6, 4.2)
      + strip * vec3(2.8, 3.15, 3.7) + pin * vec3(11.0, 9.4, 7.4);
  }
  if (uEnvironment == 1) {
    float spot = pow(max(dot(d, normalize(vec3(-0.38, -0.78, 0.50))), 0.0), 150.0);
    float hard = pow(max(dot(d, normalize(vec3(0.60, 0.63, 0.49))), 0.0), 920.0);
    float slash = softRect(d, vec3(-0.20, 0.10, 0.97), vec3(0.98, 0.02, 0.20), 0.38, 0.028, 0.008);
    return base * 0.32 + spot * vec3(8.2, 6.5, 5.0) + hard * vec3(15.0, 17.0, 21.0)
      + slash * vec3(2.2, 3.2, 5.0);
  }
  float sky = pow(max(d.z * 0.5 + 0.5, 0.0), 1.5);
  float sun = pow(max(dot(d, normalize(vec3(-0.42, -0.52, 0.74))), 0.0), 1100.0);
  float window = softRect(d, vec3(0.58, 0.34, 0.74), vec3(-0.50, 0.86, 0.0), 0.36, 0.36, 0.07);
  return base + sky * vec3(0.24, 0.37, 0.62) + sun * vec3(24.0, 19.0, 12.0)
    + window * vec3(2.6, 2.8, 3.1) + max(-d.z, 0.0) * vec3(0.06, 0.045, 0.035);
}

bool intersectGem(vec3 origin, vec3 direction, out float nearT, out float farT,
                  out vec3 nearNormal, out vec3 farNormal) {
  nearT = -1e20;
  farT = 1e20;
  nearNormal = vec3(0.0);
  farNormal = vec3(0.0);
  for (int i = 0; i < MAX_PLANES; i++) {
    if (i >= uPlaneCount) break;
    vec3 normal = uPlaneNormal[i];
    float denominator = dot(normal, direction);
    float numerator = uPlaneDistance[i] - dot(normal, origin);
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
    vec3 normal = uPlaneNormal[i];
    float denominator = dot(normal, direction);
    if (denominator > 1e-7) {
      float t = (uPlaneDistance[i] - dot(normal, origin)) / denominator;
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

float channelValue(vec3 color, int channel) {
  if (channel == 0) return color.r;
  if (channel == 1) return color.g;
  return color.b;
}

float traceInside(vec3 entryPoint, vec3 incident, vec3 entryNormal,
                  float ior, float absorption, int channel, out float entryReflectance) {
  bool entryTir;
  entryReflectance = fresnelDielectric(-dot(incident, entryNormal), 1.0, ior, entryTir);
  vec3 direction = refract(incident, entryNormal, 1.0 / ior);
  vec3 origin = entryPoint + direction * EPSILON;
  float throughput = 1.0 - entryReflectance;
  float radiance = 0.0;

  for (int bounce = 0; bounce < MAX_BOUNCES; bounce++) {
    float distance;
    vec3 exitNormal;
    if (!intersectGemExit(origin, direction, distance, exitNormal)) break;
    throughput *= exp(-absorption * distance);
    vec3 exitPoint = origin + direction * distance;
    float cosIncident = max(dot(direction, exitNormal), 0.0);
    bool tir;
    float reflectance = fresnelDielectric(cosIncident, ior, 1.0, tir);
    if (!tir) {
      vec3 exitDirection = refract(direction, -exitNormal, ior);
      radiance += throughput * (1.0 - reflectance)
        * channelValue(environmentRadiance(exitDirection), channel);
    }
    throughput *= reflectance;
    if (throughput < 0.00065) break;
    direction = reflect(direction, exitNormal);
    origin = exitPoint + direction * EPSILON;
  }
  return radiance;
}

vec3 acesToneMap(vec3 x) {
  const float a = 2.51;
  const float b = 0.03;
  const float c = 2.43;
  const float d = 0.59;
  const float e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

void main() {
  vec2 centered = (2.0 * gl_FragCoord.xy - uResolution.xy) / uResolution.y;
  float vignette = 1.0 - 0.28 * smoothstep(0.15, 1.45, length(centered));

  float yaw = uView.x;
  float pitch = uView.y;
  float zoom = uView.z;
  float framing = min(1.0, (uResolution.x / uResolution.y) * 0.85);
  vec3 camera = 3.45 * vec3(sin(yaw) * cos(pitch), -cos(yaw) * cos(pitch), sin(pitch));
  vec3 forward = normalize(-camera);
  vec3 right = normalize(cross(forward, vec3(0.0, 0.0, 1.0)));
  vec3 up = cross(right, forward);
  vec3 ray = normalize(forward * 2.82 + (centered.x * right + centered.y * up) / (zoom * framing));

  vec3 color;
  float nearT, farT;
  vec3 entryNormal, farNormal;
  if (intersectGem(camera, ray, nearT, farT, entryNormal, farNormal) && nearT > 0.0) {
    vec3 point = camera + ray * nearT;
    vec3 transmitted = vec3(0.0);
    vec3 entryF = vec3(0.0);
    transmitted.r = traceInside(point, ray, entryNormal, uIor.r, uAbsorption.r, 0, entryF.r);
    transmitted.g = traceInside(point, ray, entryNormal, uIor.g, uAbsorption.g, 1, entryF.g);
    transmitted.b = traceInside(point, ray, entryNormal, uIor.b, uAbsorption.b, 2, entryF.b);
    vec3 reflected = environmentRadiance(reflect(ray, entryNormal)) * entryF;
    color = reflected + transmitted;
    color *= uIntensity;
  } else {
    float radial = length(centered * vec2(0.72, 0.86));
    color = mix(vec3(0.008, 0.011, 0.019), vec3(0.0025, 0.0035, 0.006), smoothstep(0.05, 1.25, radial));
    color += 0.006 * pow(max(0.0, 1.0 - radial), 3.0) * vec3(0.55, 0.66, 1.0);
  }
  color *= vignette;
  color = pow(acesToneMap(color), vec3(1.0 / 2.2));
  float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  outColor = vec4(color + dither / 420.0, 1.0);
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
    if (!['auto', 'high'].includes(partial.quality)) throw new RangeError(`Unknown quality: ${partial.quality}`);
    next.quality = partial.quality;
  }
  if ('lightAngle' in partial) next.lightAngle = Number(partial.lightAngle);
  if ('intensity' in partial) next.intensity = clamp(Number(partial.intensity), 0.3, 3);
  if ('dispersion' in partial) next.dispersion = clamp(Number(partial.dispersion), 0, 2);
  if ('autoRotate' in partial) next.autoRotate = Boolean(partial.autoRotate);
  if ('yaw' in partial) next.yaw = Number(partial.yaw);
  if ('pitch' in partial) next.pitch = clamp(Number(partial.pitch), -1.15, 1.15);
  if ('zoom' in partial) next.zoom = clamp(Number(partial.zoom), 0.68, 1.65);
  for (const key of ['lightAngle', 'intensity', 'dispersion', 'yaw', 'pitch', 'zoom']) {
    if (!Number.isFinite(next[key])) throw new TypeError(`${key} must be a finite number`);
  }
  return next;
}

export function createGemRenderer(canvas, { onError, onStats } = {}) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('A canvas element is required');
  let gl;
  let program;
  try {
    gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
    if (!gl) throw new Error('WebGL 2 is unavailable in this browser');
    program = createProgram(gl);
  } catch (error) {
    onError?.(error);
    throw error;
  }

  const vao = gl.createVertexArray();
  const locations = {
    resolution: gl.getUniformLocation(program, 'uResolution'),
    time: gl.getUniformLocation(program, 'uTime'),
    view: gl.getUniformLocation(program, 'uView'),
    lightAngle: gl.getUniformLocation(program, 'uLightAngle'),
    intensity: gl.getUniformLocation(program, 'uIntensity'),
    ior: gl.getUniformLocation(program, 'uIor'),
    absorption: gl.getUniformLocation(program, 'uAbsorption'),
    planeCount: gl.getUniformLocation(program, 'uPlaneCount'),
    environment: gl.getUniformLocation(program, 'uEnvironment'),
    planeNormal: gl.getUniformLocation(program, 'uPlaneNormal[0]'),
    planeDistance: gl.getUniformLocation(program, 'uPlaneDistance[0]'),
  };

  let state = { ...DEFAULT_OPTIONS };
  let planes = createCutPlanes(state.cut);
  let destroyed = false;
  let animationFrame = 0;
  let renderStart = performance.now();
  let rotationOffset = 0;
  let previousFrame = renderStart;
  let statsStart = renderStart;
  let statsFrames = 0;
  let autoDpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let pointer = null;
  let dirty = true;
  let planesDirty = true;
  const oldTouchAction = canvas.style.touchAction;
  canvas.style.touchAction = 'none';

  function desiredDpr() {
    const device = window.devicePixelRatio || 1;
    return state.quality === 'high' ? Math.min(device, 2) : Math.min(device, autoDpr);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = desiredDpr();
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      dirty = true;
    }
  }

  function uploadPlanes() {
    const normals = new Float32Array(MAX_PLANES * 3);
    const distances = new Float32Array(MAX_PLANES);
    planes.forEach((plane, index) => {
      normals.set(plane.normal, index * 3);
      distances[index] = plane.distance;
    });
    gl.uniform1i(locations.planeCount, planes.length);
    gl.uniform3fv(locations.planeNormal, normals);
    gl.uniform1fv(locations.planeDistance, distances);
  }

  function render(now) {
    if (destroyed) return;
    animationFrame = requestAnimationFrame(render);
    resize();
    const delta = Math.min((now - previousFrame) / 1000, 0.1);
    previousFrame = now;
    if (document.hidden || (!dirty && !state.autoRotate)) return;
    dirty = false;
    if (state.autoRotate) rotationOffset += delta * 0.115;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    const material = GEM_MATERIALS[state.gem];
    const ior = refractiveIndicesRGB(material, state.dispersion);
    gl.uniform2f(locations.resolution, canvas.width, canvas.height);
    gl.uniform1f(locations.time, (now - renderStart) / 1000);
    gl.uniform3f(locations.view, state.yaw + rotationOffset, state.pitch, state.zoom);
    gl.uniform1f(locations.lightAngle, (state.lightAngle * Math.PI) / 180);
    gl.uniform1f(locations.intensity, state.intensity);
    gl.uniform3fv(locations.ior, ior);
    gl.uniform3fv(locations.absorption, material.absorption);
    gl.uniform1i(locations.environment, ENVIRONMENTS[state.environment]);
    if (planesDirty) {
      uploadPlanes();
      planesDirty = false;
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    statsFrames += 1;
    if (now - statsStart >= 1000) {
      const fps = (statsFrames * 1000) / (now - statsStart);
      if (state.quality === 'auto') {
        const device = window.devicePixelRatio || 1;
        if (fps < 38 && autoDpr > 0.72) autoDpr = Math.max(0.72, autoDpr - 0.12);
        else if (fps > 56 && autoDpr < Math.min(device, 1.5)) autoDpr = Math.min(device, 1.5, autoDpr + 0.06);
      }
      onStats?.({ fps, bounces: MAX_BOUNCES, planes: planes.length, dpr: desiredDpr() });
      statsStart = now;
      statsFrames = 0;
    }
  }

  function pointerDown(event) {
    state = { ...state, yaw: state.yaw + rotationOffset };
    rotationOffset = 0;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture?.(event.pointerId);
  }

  function pointerMove(event) {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    state = {
      ...state,
      yaw: state.yaw - dx * 0.007,
      pitch: clamp(state.pitch + dy * 0.006, -1.15, 1.15),
    };
    dirty = true;
  }

  function pointerUp(event) {
    if (pointer?.id === event.pointerId) pointer = null;
  }

  function wheel(event) {
    event.preventDefault();
    state = { ...state, zoom: clamp(state.zoom * Math.exp(-event.deltaY * 0.001), 0.68, 1.65) };
    dirty = true;
  }

  function keyDown(event) {
    const turn = event.shiftKey ? 0.16 : 0.07;
    const handledKeys = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', '_', '0']);
    if (!handledKeys.has(event.key)) return;
    state = { ...state, yaw: state.yaw + rotationOffset };
    rotationOffset = 0;
    switch (event.key) {
      case 'ArrowLeft': state = { ...state, yaw: state.yaw + turn }; break;
      case 'ArrowRight': state = { ...state, yaw: state.yaw - turn }; break;
      case 'ArrowUp': state = { ...state, pitch: clamp(state.pitch - turn, -1.15, 1.15) }; break;
      case 'ArrowDown': state = { ...state, pitch: clamp(state.pitch + turn, -1.15, 1.15) }; break;
      case '+':
      case '=': state = { ...state, zoom: clamp(state.zoom * 1.08, 0.68, 1.65) }; break;
      case '-':
      case '_': state = { ...state, zoom: clamp(state.zoom / 1.08, 0.68, 1.65) }; break;
      case '0': state = { ...state, yaw: DEFAULT_OPTIONS.yaw, pitch: DEFAULT_OPTIONS.pitch, zoom: DEFAULT_OPTIONS.zoom }; break;
      default: break;
    }
    dirty = true;
    event.preventDefault();
  }

  function visibilityChange() {
    previousFrame = performance.now();
    statsStart = previousFrame;
    statsFrames = 0;
    if (!document.hidden) dirty = true;
  }

  function contextLost(event) {
    event.preventDefault();
    cancelAnimationFrame(animationFrame);
    onError?.(new Error('WebGL context lost; reload the page to restore the renderer'));
  }

  canvas.addEventListener('pointerdown', pointerDown);
  canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerup', pointerUp);
  canvas.addEventListener('pointercancel', pointerUp);
  canvas.addEventListener('wheel', wheel, { passive: false });
  canvas.addEventListener('keydown', keyDown);
  canvas.addEventListener('webglcontextlost', contextLost);
  document.addEventListener('visibilitychange', visibilityChange);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  gl.useProgram(program);
  uploadPlanes();
  planesDirty = false;
  animationFrame = requestAnimationFrame(render);

  return Object.freeze({
    setOptions(partial = {}) {
      const previousCut = state.cut;
      const previousQuality = state.quality;
      state = validateOptions(state, partial);
      if (state.cut !== previousCut) {
        planes = createCutPlanes(state.cut);
        planesDirty = true;
      }
      if (state.quality === 'auto' && state.quality !== previousQuality) {
        autoDpr = Math.min(window.devicePixelRatio || 1, 1.5);
      }
      dirty = true;
    },
    resetView() {
      rotationOffset = 0;
      state = { ...state, yaw: DEFAULT_OPTIONS.yaw, pitch: DEFAULT_OPTIONS.pitch, zoom: DEFAULT_OPTIONS.zoom };
      dirty = true;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', pointerDown);
      canvas.removeEventListener('pointermove', pointerMove);
      canvas.removeEventListener('pointerup', pointerUp);
      canvas.removeEventListener('pointercancel', pointerUp);
      canvas.removeEventListener('wheel', wheel);
      canvas.removeEventListener('keydown', keyDown);
      canvas.removeEventListener('webglcontextlost', contextLost);
      document.removeEventListener('visibilitychange', visibilityChange);
      canvas.style.touchAction = oldTouchAction;
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    },
    getState() {
      return Object.freeze({
        ...state,
        yaw: state.yaw + rotationOffset,
        planeCount: planes.length,
        maxBounces: MAX_BOUNCES,
        approximations: OPTICS_APPROXIMATIONS,
      });
    },
  });
}

export { DEFAULT_OPTIONS, MAX_BOUNCES };
