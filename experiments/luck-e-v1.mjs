/**
 * luck-e.mjs — 収束房 / Confluence Chambers
 * Standalone ES module. No imports, image assets, WebGL, or 2D drawing path.
 *
 * EFFECT CONTRACT
 *   Visual lifetime: 1420 actor-ms, not 1420 wall-ms.
 *   Reference display: 980 x 620 CSS px; actor body: 124 x 164 CSS px.
 *   The host owns gameplay, actors, authority IDs, actor clocks and visibility.
 *   Nothing in this module changes luck, probabilities, donations or idea progress.
 *
 * INTEGRATION (all named exports below are implemented in this file)
 *   const session = createSession({ id: 'unique-game-session' });
 *   const owner = createFrameOwner({ device });
 *   const effect = create({
 *     renderer: { device, format }, frameOwner: owner, session,
 *     readLiveInput: () => currentInput
 *   });
 *   await effect.ready;
 *   // In a user-gesture handler: await effect.unlockAudio();
 *   // Every host frame:
 *   const frame = owner.beginFrame({
 *     encoder: device.createCommandEncoder(), colorView,
 *     width: canvas.width, height: canvas.height, presenting: true
 *   });
 *   // Record the host's scene/actors into frame.encoder first.
 *   const receipt = effect.record(frame, currentInput);
 *   const submitted = owner.submit(frame); // sole finish/submit, exactly once
 *   // Do not await in the RAF hot path; both promises may be inspected later.
 *   receipt.done.then(console.log);
 *   submitted.catch(console.error);
 *
 * Shared encoders must be enrolled with owner.beginFrame before host recording.
 * Do not call finish/queue.submit yourself, or nest unbalanced GPU error scopes.
 * The module's renderer.record NEVER submits, finishes, or writes a GPU queue.
 * GPU uploads use immutable mapped-at-creation buffers, isolated per frame.
 *
 * INPUT (see testInput for a complete executable example)
 *   sessionId, roomKey, wallMs, surfaceVisible, reducedMotion,
 *   display: { cssWidth, cssHeight, dpr },
 *   viewport: { x, y, width, height } in CSS px,
 *   camera: { x, y, zoom, cssPixelsPerWorldUnit, angleRad },
 *   actors: [{ playerId, x, y, bodyWidth, bodyHeight, angleRad,
 *              actorMs, rate, visible, clipCss? }],
 *   causes: [{ id, playerId, startedActorMs, meaning: 'luck'|'intuition',
 *              authority?: { type, effectKind, variant, durationMs } }]
 *
 * plan(input) is pure, deep-copies only recognized data, and returns a frozen
 * plan with source input. record accepts either raw input or such a plan.
 * causes may be an inbox: the runtime retains registered causes until session
 * destruction, including deduplication tombstones. plan alone has no ledger.
 * roomKey identifies a room incarnation. Cause IDs must be session-unique.
 * source authority.durationMs is metadata, never the E's visual lifetime.
 * authorityLuckCause adapts the previously specified gain-luckBoost event.
 *
 * readLiveInput is REQUIRED: GPU completion can occur after room/visibility/
 * actor-clock changes. It must return the latest input, even between RAFs.
 * Call effect.sync(input) on room, pause or visibility transitions as well.
 * An expired cause, leaving a room, or hiding an actor never restarts its clock.
 * Returning to a room does not revive retired causes. A new cause needs a new ID.
 * Reuse the same session across renderer/device recreation to retain SFX claims.
 *
 * RECEIPT BOUNDARY
 * A receipt is private-branded and resolved only by the owner that submitted
 * its encoder, after queue completion, error-scope resolution and nonzero
 * MAIN-VOLUME occlusion-query results. Glow alone cannot earn a sound.
 * Caller-supplied { submitted: true } objects are not accepted anywhere.
 * This proves surviving samples in the enrolled color attachment, not physical
 * display scan-out, audibility, or the absence of later host overpainting.
 * Record E in the final world-composite stage. The host must set presenting and
 * surfaceVisible honestly and reflect modal/occlusion state in visibility/clip.
 * Integer query readback is NOT an image-to-2D transfer. runGpuProbe additionally
 * reads RGBA bytes for numeric diagnostics only; it never draws those bytes.
 *
 * TEST HOST
 *   const preview = await mountTest(document.querySelector('canvas'));
 *   preview.seek(980); preview.setRate(0.5); preview.setReducedMotion(true);
 *   preview.trigger(); await preview.unlockAudio();
 *   await preview.destroy();
 * mountTest is an opt-in synthetic host, not an integration into the real game.
 * Click the preview canvas to unlock audio and create a NEW independent cause.
 *
 * Runtime requirements: secure-context WebGPU and Web Audio. No silent fallback.
 * Supported color attachments: rgba8unorm, bgra8unorm, their -srgb variants,
 * rgba16float; sampleCount 1 or 4 (4 requires a resolveView on every frame).
 * For linear attachments use colorEncoding:'linear'; otherwise 'srgb'.
 *
 * Standards used while implementing this module:
 *   https://www.w3.org/TR/WGSL/
 *   https://gpuweb.github.io/types/interfaces/GPUQueue.html
 *   https://gpuweb.github.io/types/interfaces/GPURenderPassEncoder.html
 *   https://webaudio.github.io/web-audio-api/
 *
 * No validation result is baked in as a success. Probe functions return actual
 * runtime observations. Real game events, real skins, physical GPU/monitor and
 * audible quality remain host-side acceptance tasks.
 */

export const VERSION = 'confluence-chambers/1.0.0';
export const LIFETIME_ACTOR_MS = 1420;
export const TEST_TIMES = Object.freeze([
  -1, 0, 1, 40, 100, 180, 300, 400, 560, 740,
  900, 1060, 1180, 1280, 1360, 1400, 1410, 1419, 1420, 1500
]);
export const TEST_RATES = Object.freeze([0, 0.25, 0.5, 1, 2, 4, 8]);
export const TEST_DPRS = Object.freeze([1, 1.5, 2, 3]);
export const TEST_BODY_SIZES = Object.freeze([
  Object.freeze([124, 164]), Object.freeze([62, 82]),
  Object.freeze([31, 41]), Object.freeze([18, 24])
]);

const BUFFER_UNIFORM = 64;
const BUFFER_STORAGE = 128;
const BUFFER_MAP_READ = 1;
const BUFFER_COPY_SRC = 4;
const BUFFER_COPY_DST = 8;
const BUFFER_QUERY_RESOLVE = 512;
const TEXTURE_COPY_SRC = 1;
const TEXTURE_RENDER_ATTACHMENT = 16;
const SHADER_VERTEX_FRAGMENT = 3;
const MAP_READ = 1;
const ITEM_FLOATS = 28;
const FRAME_FLOATS = 12;
const MAX_VISIBLE_CAUSES = 64;
const MAX_INPUT_ACTORS = 2048;
const MAX_INPUT_CAUSES = 4096;
const DEFAULT_LEDGER_LIMIT = 65536;
const FRAME_OWNERS = new WeakMap();
const OWNER_BY_DEVICE = new WeakMap();
const FRAME_RECORDS = new WeakMap();
const SESSION_RECORDS = new WeakMap();
const RECEIPT_RECORDS = new WeakMap();

function requireCondition(condition, message, ErrorType = TypeError) {
  if (!condition) throw new ErrorType(message);
}

function finite(value, name, lower = -1e12, upper = 1e12) {
  requireCondition(
    typeof value === 'number' && Number.isFinite(value) &&
    value >= lower && value <= upper,
    `${name} must be finite in [${lower}, ${upper}]`
  );
  return value;
}

function integer(value, name, lower, upper) {
  finite(value, name, lower, upper);
  requireCondition(Number.isInteger(value), `${name} must be an integer`);
  return value;
}

function text(value, name) {
  requireCondition(
    typeof value === 'string' && value.length > 0 && value.length <= 256 &&
    !value.includes('\u0000'), `${name} must be a nonempty ID (max 256 characters)`
  );
  return value;
}

function flag(value, name) {
  requireCondition(typeof value === 'boolean', `${name} must be boolean`);
  return value;
}

function list(value, name, limit) {
  requireCondition(Array.isArray(value), `${name} must be an array`);
  requireCondition(value.length <= limit, `${name} exceeds ${limit}`, RangeError);
  return value;
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function easeBetween(value, begin, end) {
  const unit = clamp01((value - begin) / (end - begin));
  return unit * unit * (3 - 2 * unit);
}

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

function errorText(error) {
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
}

function alignBytes(value, multiple) {
  return Math.ceil(value / multiple) * multiple;
}

function causeKey(sessionId, causeId) {
  return JSON.stringify([sessionId, causeId]);
}

function lexical(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function boundedRect(value, name) {
  requireCondition(value && typeof value === 'object', `${name} is required`);
  return {
    x: finite(value.x, `${name}.x`, -1e8, 1e8),
    y: finite(value.y, `${name}.y`, -1e8, 1e8),
    width: finite(value.width, `${name}.width`, 0, 1e8),
    height: finite(value.height, `${name}.height`, 0, 1e8)
  };
}

function rectIntersection(first, second) {
  const x = Math.max(first.x, second.x);
  const y = Math.max(first.y, second.y);
  const right = Math.min(first.x + first.width, second.x + second.width);
  const bottom = Math.min(first.y + first.height, second.y + second.height);
  return { x, y, width: Math.max(0, right - x), height: Math.max(0, bottom - y) };
}

function normalizeCause(raw) {
  requireCondition(raw && typeof raw === 'object', 'cause must be an object');
  const meaning = raw.meaning ?? 'luck';
  requireCondition(meaning === 'luck' || meaning === 'intuition', 'unsupported cause meaning');
  let authority = null;
  if (raw.authority !== undefined && raw.authority !== null) {
    authority = {
      type: text(raw.authority.type, 'authority.type'),
      effectKind: text(raw.authority.effectKind, 'authority.effectKind'),
      variant: text(raw.authority.variant, 'authority.variant'),
      durationMs: finite(raw.authority.durationMs, 'authority.durationMs', 0, 1e9)
    };
  }
  return {
    id: text(raw.id, 'cause.id'),
    playerId: text(raw.playerId, 'cause.playerId'),
    startedActorMs: finite(raw.startedActorMs, 'cause.startedActorMs', 0, 1e12),
    meaning,
    authority
  };
}

/** Read-only adapter; it does not recalculate or shorten the gameplay buff. */
export function authorityLuckCause(event, startedActorMs) {
  requireCondition(event && typeof event === 'object', 'authority event is required');
  requireCondition(
    event.type === 'gain-luckBoost' && event.effectKind === 'luckBoost' &&
    event.variant === 'donation-rational' && event.durationMs === 1680,
    'authority event does not match the declared donation-rational contract'
  );
  return deepFreeze(normalizeCause({
    id: event.id, playerId: event.playerId, startedActorMs, meaning: 'luck',
    authority: {
      type: event.type, effectKind: event.effectKind,
      variant: event.variant, durationMs: event.durationMs
    }
  }));
}

/** Integrate a LINEAR rate change across the interval (trapezoidal integral).
 * For an instantaneous rate change, set clock.rate at the transition first.
 * Production hosts should supply their authoritative simulation actorMs.
 */
export function advanceActorClock(clock, wallMs, endRate = clock.rate) {
  const oldWall = finite(clock.wallMs, 'clock.wallMs', 0, 1e12);
  const oldActor = finite(clock.actorMs, 'clock.actorMs', 0, 1e12);
  const oldRate = finite(clock.rate, 'clock.rate', 0, 8);
  const nextWall = finite(wallMs, 'wallMs', oldWall, 1e12);
  const rate = finite(endRate, 'endRate', 0, 8);
  return deepFreeze({
    wallMs: nextWall,
    actorMs: oldActor + (nextWall - oldWall) * (oldRate + rate) / 2,
    rate
  });
}

export function temporalState(ageActorMs, reducedMotion = false) {
  finite(ageActorMs, 'ageActorMs');
  flag(reducedMotion, 'reducedMotion');
  const exists = ageActorMs >= 0 && ageActorMs < LIFETIME_ACTOR_MS;
  const rise = easeBetween(ageActorMs, 0, 180);
  const gather = easeBetween(ageActorMs, 260, 1160);
  const settle = easeBetween(ageActorMs, 1080, 1419);
  const dying = Math.sqrt(clamp01((LIFETIME_ACTOR_MS - ageActorMs) / 340));
  return deepFreeze({
    exists,
    ageActorMs,
    normalizedAge: clamp01(ageActorMs / LIFETIME_ACTOR_MS),
    opacity: exists ? (0.28 + 0.72 * rise) * dying : 0,
    compression: reducedMotion ? 0.18 : 0.05 + 0.36 * gather + 0.06 * settle,
    flowRadius: reducedMotion ? 0.36 : 0.91 - 0.83 * easeBetween(ageActorMs, 60, 1140),
    phase: !exists ? 'absent' : ageActorMs < 180 ? 'formation' :
      ageActorMs < 740 ? 'acquisition' : ageActorMs < 1080 ? 'integration' : 'dissolution'
  });
}

function normalizedInput(raw) {
  requireCondition(raw && typeof raw === 'object', 'input is required');
  const display = {
    cssWidth: finite(raw.display?.cssWidth, 'display.cssWidth', 1, 16384),
    cssHeight: finite(raw.display?.cssHeight, 'display.cssHeight', 1, 16384),
    dpr: finite(raw.display?.dpr, 'display.dpr', 0.5, 4)
  };
  const viewport = boundedRect(raw.viewport, 'viewport');
  requireCondition(viewport.x >= 0 && viewport.y >= 0 &&
    viewport.x + viewport.width <= display.cssWidth &&
    viewport.y + viewport.height <= display.cssHeight, 'viewport must fit the CSS display');
  const camera = {
    x: finite(raw.camera?.x, 'camera.x'),
    y: finite(raw.camera?.y, 'camera.y'),
    zoom: finite(raw.camera?.zoom, 'camera.zoom', 1e-4, 100),
    cssPixelsPerWorldUnit: finite(raw.camera?.cssPixelsPerWorldUnit, 'camera.cssPixelsPerWorldUnit', 1e-4, 1e5),
    angleRad: finite(raw.camera?.angleRad ?? 0, 'camera.angleRad', -1e5, 1e5)
  };
  const actorIds = new Set();
  const actors = list(raw.actors, 'actors', MAX_INPUT_ACTORS).map((actor) => {
    const playerId = text(actor.playerId, 'actor.playerId');
    requireCondition(!actorIds.has(playerId), `duplicate actor ${playerId}`);
    actorIds.add(playerId);
    return {
      playerId,
      x: finite(actor.x, 'actor.x'),
      y: finite(actor.y, 'actor.y'),
      bodyWidth: finite(actor.bodyWidth, 'actor.bodyWidth', 1e-4, 1e6),
      bodyHeight: finite(actor.bodyHeight, 'actor.bodyHeight', 1e-4, 1e6),
      angleRad: finite(actor.angleRad ?? 0, 'actor.angleRad', -1e5, 1e5),
      actorMs: finite(actor.actorMs, 'actor.actorMs', 0, 1e12),
      rate: finite(actor.rate, 'actor.rate', 0, 8),
      visible: flag(actor.visible, 'actor.visible'),
      clipCss: actor.clipCss ? boundedRect(actor.clipCss, 'actor.clipCss') : null
    };
  });
  const uniqueCauses = new Map();
  for (const rawCause of list(raw.causes ?? [], 'causes', MAX_INPUT_CAUSES)) {
    const cause = normalizeCause(rawCause);
    const previous = uniqueCauses.get(cause.id);
    requireCondition(!previous || JSON.stringify(previous) === JSON.stringify(cause),
      `conflicting cause ID in input: ${cause.id}`, Error);
    uniqueCauses.set(cause.id, cause);
  }
  const inspect = {};
  for (const name of ['core', 'structure', 'thin', 'transport', 'glow']) {
    inspect[name] = raw.inspect?.[name] === undefined ? true : flag(raw.inspect[name], `inspect.${name}`);
  }
  return {
    sessionId: text(raw.sessionId, 'sessionId'),
    roomKey: text(raw.roomKey, 'roomKey'),
    wallMs: finite(raw.wallMs, 'wallMs', 0, 1e12),
    surfaceVisible: flag(raw.surfaceVisible, 'surfaceVisible'),
    reducedMotion: flag(raw.reducedMotion, 'reducedMotion'),
    display, viewport, camera, actors,
    causes: [...uniqueCauses.values()].sort((a, b) => lexical(a.id, b.id)),
    softPixelBudget: finite(raw.softPixelBudget ?? 2400000, 'softPixelBudget', 1, 1e10),
    inspect
  };
}

/** Pure and deterministic. No clock reads, random numbers, GPU, DOM or caches. */
export function plan(rawInput) {
  const input = normalizedInput(rawInput);
  const { camera, display, viewport } = input;
  const width = Math.round(display.cssWidth * display.dpr);
  const height = Math.round(display.cssHeight * display.dpr);
  const pixels = camera.zoom * camera.cssPixelsPerWorldUnit;
  const cameraCos = Math.cos(camera.angleRad);
  const cameraSin = Math.sin(camera.angleRad);
  const actors = new Map(input.actors.map((actor) => [actor.playerId, actor]));
  const items = [];
  const warnings = [];
  for (const cause of input.causes) {
    const actor = actors.get(cause.playerId);
    if (!actor) continue;
    const timing = temporalState(actor.actorMs - cause.startedActorMs, input.reducedMotion);
    if (!timing.exists || !actor.visible || !input.surfaceVisible) continue;
    const wx = actor.x - camera.x;
    const wy = actor.y - camera.y;
    const centerCssX = viewport.x + viewport.width * 0.5 + pixels * (wx * cameraCos + wy * cameraSin);
    const centerCssY = viewport.y + viewport.height * 0.5 + pixels * (wx * cameraSin - wy * cameraCos);
    const relativeAngle = actor.angleRad - camera.angleRad;
    const physicalHeight = actor.bodyHeight * pixels * display.dpr;
    const xBasis = [Math.cos(relativeAngle) * physicalHeight, -Math.sin(relativeAngle) * physicalHeight];
    const yBasis = [-Math.sin(relativeAngle) * physicalHeight, -Math.cos(relativeAngle) * physicalHeight];
    const aspect = actor.bodyWidth / actor.bodyHeight;
    const halfWidth = 1.12 * Math.min(1.55, Math.max(0.65, aspect / 0.75609756));
    const halfHeight = 1.12;
    const hx = (halfWidth * Math.abs(xBasis[0]) + halfHeight * Math.abs(yBasis[0])) / display.dpr;
    const hy = (halfWidth * Math.abs(xBasis[1]) + halfHeight * Math.abs(yBasis[1])) / display.dpr;
    let clip = rectIntersection(viewport, { x: centerCssX - hx, y: centerCssY - hy, width: hx * 2, height: hy * 2 });
    if (actor.clipCss) clip = rectIntersection(clip, actor.clipCss);
    if (clip.width <= 0 || clip.height <= 0) continue;
    const clipPx = [clip.x * display.dpr, clip.y * display.dpr,
      (clip.x + clip.width) * display.dpr, (clip.y + clip.height) * display.dpr];
    const sx = Math.max(0, Math.floor(clipPx[0]));
    const sy = Math.max(0, Math.floor(clipPx[1]));
    const right = Math.min(width, Math.ceil(clipPx[2]));
    const bottom = Math.min(height, Math.ceil(clipPx[3]));
    if (right <= sx || bottom <= sy) continue;
    const bodyHeightCss = actor.bodyHeight * pixels;
    if (bodyHeightCss < 24) warnings.push(`sub-reference body height: ${cause.id}: ${bodyHeightCss.toFixed(2)} CSS px`);
    items.push({
      cause, key: causeKey(input.sessionId, cause.id),
      actorMs: actor.actorMs, actorRate: actor.rate, timing,
      centerPx: [centerCssX * display.dpr, centerCssY * display.dpr],
      xBasis, yBasis, aspect, halfWidth, halfHeight,
      bodyHeightCss, clipPx,
      scissor: { x: sx, y: sy, width: right - sx, height: bottom - sy },
      soundPan: Math.min(0.75, Math.max(-0.75, (centerCssX / display.cssWidth * 2 - 1) * 0.75))
    });
  }
  requireCondition(items.length <= MAX_VISIBLE_CAUSES,
    `visible causes exceed ${MAX_VISIBLE_CAUSES}; no silent merging or eviction`, RangeError);
  items.sort((a, b) => a.cause.startedActorMs - b.cause.startedActorMs || lexical(a.key, b.key));
  const area = items.reduce((sum, item) => sum + item.scissor.width * item.scissor.height, 0);
  const constrained = area > input.softPixelBudget;
  if (constrained) warnings.push('soft budget: fewer depth samples and weaker halo; primary volume retained');
  return deepFreeze({
    version: VERSION, source: input, width, height, items,
    depthSamples: constrained ? 24 : 40,
    glowStrength: input.inspect.glow ? (constrained ? 0.55 : 1) : 0,
    estimatedFragmentArea: area, warnings
  });
}

// All shader source is supplied here. Identifiers intentionally avoid WGSL
// reserved words, including target, active, pass, input/output dialect aliases.
export const WGSL = String.raw`
struct SceneInfo {
  outputSize: vec4<f32>,
  layers: vec4<f32>,
  post: vec4<f32>,
}

struct ChamberItem {
  pose: vec4<f32>,
  horizontal: vec4<f32>,
  vertical: vec4<f32>,
  state: vec4<f32>,
  clipBox: vec4<f32>,
  character: vec4<f32>,
  extra: vec4<f32>,
}

struct RasterPoint {
  @builtin(position) position: vec4<f32>,
  @location(0) localPosition: vec2<f32>,
  @location(1) @interpolate(flat) itemNumber: u32,
}

@group(0) @binding(0) var<uniform> scene: SceneInfo;
@group(0) @binding(1) var<storage, read> chambers: array<ChamberItem>;

fn unionSoft(first: f32, second: f32, width: f32) -> f32 {
  let weight = clamp(0.5 + 0.5 * (second - first) / width, 0.0, 1.0);
  return mix(second, first, weight) - width * weight * (1.0 - weight);
}

fn ellipsoidDistance(pos: vec3<f32>, radii: vec3<f32>) -> f32 {
  return (length(pos / radii) - 1.0) * min(radii.x, min(radii.y, radii.z));
}

fn capsuleDistance(pos: vec3<f32>, begin: vec3<f32>, end: vec3<f32>, radius: f32) -> f32 {
  let edge = end - begin;
  let fraction = clamp(dot(pos - begin, edge) / max(dot(edge, edge), 0.0001), 0.0, 1.0);
  return length(pos - begin - edge * fraction) - radius;
}

fn bodyPoint(pos: vec3<f32>, item: ChamberItem) -> vec3<f32> {
  let spread = clamp(item.pose.z / 0.75609756, 0.65, 1.55);
  let twist = item.character.x;
  let xy = vec2<f32>(
    cos(twist) * pos.x - sin(twist) * (pos.y + 0.13),
    sin(twist) * pos.x + cos(twist) * (pos.y + 0.13) - 0.13
  );
  return vec3<f32>(xy.x / spread, xy.y, pos.z);
}

// Six mutually connected pressure chambers. These are shape subdivisions of
// ONE finite declared field, not emitted objects, orbiting icons or particles.
fn chamberDistance(pos: vec3<f32>, item: ChamberItem) -> f32 {
  let contraction = 1.0 - item.state.y;
  let destination = vec3<f32>(0.0, -0.15, 0.12);
  let radiusScale = 0.94 - 0.10 * item.state.y;
  let c0 = mix(destination, vec3<f32>(-0.47, 0.03, -0.08), contraction);
  let c1 = mix(destination, vec3<f32>(-0.32, -0.34, 0.08), contraction);
  let c2 = mix(destination, vec3<f32>(0.40, 0.08, 0.10), contraction);
  let c3 = mix(destination, vec3<f32>(0.38, -0.36, -0.07), contraction);
  let c4 = mix(destination, vec3<f32>(0.00, -0.38, -0.02), contraction);
  let c5 = vec3<f32>(0.0, -0.14, 0.18);
  let d0 = ellipsoidDistance(pos - c0, vec3<f32>(0.27, 0.24, 0.25) * radiusScale);
  let d1 = ellipsoidDistance(pos - c1, vec3<f32>(0.25, 0.27, 0.23) * radiusScale);
  let d2 = ellipsoidDistance(pos - c2, vec3<f32>(0.27, 0.30, 0.25) * radiusScale);
  let d3 = ellipsoidDistance(pos - c3, vec3<f32>(0.31, 0.22, 0.26) * radiusScale);
  let d4 = ellipsoidDistance(pos - c4, vec3<f32>(0.28, 0.19, 0.24) * radiusScale);
  let d5 = ellipsoidDistance(pos - c5, vec3<f32>(0.19, 0.20, 0.23));
  var merged = unionSoft(d0, d1, 0.14);
  merged = unionSoft(merged, d2, 0.15);
  merged = unionSoft(merged, d3, 0.14);
  merged = unionSoft(merged, d4, 0.13);
  return unionSoft(merged, d5, 0.13);
}

// A thick internal receiving spine; its pigment exists even with glow disabled.
fn nucleusDistance(pos: vec3<f32>, item: ChamberItem) -> f32 {
  let contraction = 1.0 - item.state.y;
  let junction = vec3<f32>(0.0, -0.14, 0.19);
  let left = mix(junction, vec3<f32>(-0.45, -0.02, 0.07), contraction);
  let lower = mix(junction, vec3<f32>(0.29, -0.39, 0.05), contraction);
  let right = mix(junction, vec3<f32>(0.37, 0.08, 0.16), contraction);
  var spine = ellipsoidDistance(pos - junction, vec3<f32>(0.14, 0.16, 0.16));
  spine = unionSoft(spine, capsuleDistance(pos, junction, left, 0.078), 0.055);
  spine = unionSoft(spine, capsuleDistance(pos, junction, lower, 0.087), 0.055);
  return unionSoft(spine, capsuleDistance(pos, junction, right, 0.069), 0.045);
}

fn faceProtection(localPosition: vec2<f32>, aspect: f32) -> f32 {
  let head = (localPosition - vec2<f32>(0.0, 0.365)) / vec2<f32>(0.27 * aspect / 0.756, 0.215);
  return smoothstep(0.95, 1.23, length(head));
}

fn clipped(pos: vec2<f32>, bounds: vec4<f32>) -> bool {
  return pos.x < bounds.x || pos.y < bounds.y || pos.x >= bounds.z || pos.y >= bounds.w;
}

fn encodeSrgb(linearRgb: vec3<f32>) -> vec3<f32> {
  let low = linearRgb * 12.92;
  let high = 1.055 * pow(max(linearRgb, vec3<f32>(0.0)), vec3<f32>(1.0 / 2.4)) - vec3<f32>(0.055);
  return select(high, low, linearRgb <= vec3<f32>(0.0031308));
}

fn outputPremultiplied(linearRgb: vec3<f32>, opacity: f32) -> vec4<f32> {
  var encoded = clamp(linearRgb, vec3<f32>(0.0), vec3<f32>(0.995));
  if scene.post.y > 0.5 {
    encoded = encodeSrgb(encoded);
  }
  return vec4<f32>(encoded * opacity, opacity);
}

@vertex
fn vertexChamber(@builtin(vertex_index) vertexNumber: u32,
                 @builtin(instance_index) itemNumber: u32) -> RasterPoint {
  var corners = array<vec2<f32>, 6>(
    vec2<f32>(-1.12, -1.12), vec2<f32>(1.12, -1.12), vec2<f32>(-1.12, 1.12),
    vec2<f32>(-1.12, 1.12), vec2<f32>(1.12, -1.12), vec2<f32>(1.12, 1.12)
  );
  let item = chambers[itemNumber];
  let localPosition = corners[vertexNumber] / 1.12 * item.extra.xy;
  let pixel = item.pose.xy + item.horizontal.xy * localPosition.x + item.vertical.xy * localPosition.y;
  var result: RasterPoint;
  result.position = vec4<f32>(pixel.x * 2.0 / scene.outputSize.x - 1.0,
    1.0 - pixel.y * 2.0 / scene.outputSize.y, 0.5, 1.0);
  result.localPosition = localPosition;
  result.itemNumber = itemNumber;
  return result;
}

@fragment
fn fragmentChamber(raster: RasterPoint) -> @location(0) vec4<f32> {
  // Screen derivatives are evaluated uniformly before any discard or loop.
  let footprint = max(length(fwidth(raster.localPosition)), 0.0015);
  let item = chambers[raster.itemNumber];
  let protection = faceProtection(raster.localPosition, item.pose.z);
  if clipped(raster.position.xy, item.clipBox) || protection < 0.002 {
    discard;
  }
  let count = u32(scene.outputSize.w);
  let depthStep = 1.52 / f32(count);
  let softness = max(0.030, footprint * 1.2);
  var accumulated = vec3<f32>(0.0);
  var transmission = 1.0;
  for (var slice: u32 = 0u; slice < 40u; slice += 1u) {
    if slice >= count { break; }
    let depth = 0.78 - (f32(slice) + 0.5) * depthStep;
    let pos = bodyPoint(vec3<f32>(raster.localPosition, depth), item);
    let outline = chamberDistance(pos, item);
    let occupancy = 1.0 - smoothstep(-softness, softness, outline);
    let coreDistance = nucleusDistance(pos, item);
    let core = (1.0 - smoothstep(-0.016, 0.032 + footprint, coreDistance)) * scene.layers.x;
    let membraneLimit = 1.0 - smoothstep(0.055, 0.105, abs(outline));
    let membrane = exp(-abs(outline) / (0.022 + footprint)) * membraneLimit * scene.layers.z;
    let radial = length((pos - vec3<f32>(0.0, -0.14, 0.12)) * vec3<f32>(1.0, 1.05, 0.42));
    let frontOffset = (radial - item.state.z) / 0.13;
    let movingFront = exp(-frontOffset * frontOffset) * scene.layers.w;
    // Broad connected lamellae, not high-frequency sparkle or noise.
    let lamella = 0.60 + 0.40 * cos(pos.y * 14.0 + pos.z * 10.0 + pos.x * 4.0);
    let structure = occupancy * scene.layers.y;
    let extinction = structure * (3.2 + 1.8 * lamella) + core * 10.0 + membrane * 1.15;
    let stepOpacity = 1.0 - exp(-extinction * depthStep);
    let purple = vec3<f32>(1.85, 0.105, 3.90);
    let plum = vec3<f32>(0.65, 0.035, 2.10);
    let lemon = vec3<f32>(9.0, 7.7, 0.075);
    let veil = vec3<f32>(3.35, 0.90, 4.85);
    let tissueColor = mix(plum, purple, lamella) * (0.83 + 0.36 * movingFront);
    let weighted = structure * tissueColor + core * lemon + membrane * veil * 0.48;
    let denominator = max(structure + core + membrane * 0.48, 0.001);
    let localRadiance = weighted / denominator;
    accumulated += transmission * stepOpacity * localRadiance;
    transmission *= 1.0 - stepOpacity;
  }
  let coverage = 1.0 - transmission;
  let bodyWindow = length((raster.localPosition - vec2<f32>(0.0, -0.02)) / vec2<f32>(0.21, 0.29));
  let receivingWindow = exp(-dot(raster.localPosition - vec2<f32>(0.0, -0.16),
    raster.localPosition - vec2<f32>(0.0, -0.16)) / 0.017);
  let hostReadability = mix(0.38 + 0.62 * smoothstep(0.6, 1.1, bodyWindow), 1.0, receivingWindow);
  let opacity = coverage * item.state.x * protection * hostReadability;
  if opacity < 0.004 { discard; }
  let unexposed = accumulated / max(coverage, 0.001);
  let exposed = unexposed / vec3<f32>(1.0 + max(unexposed.x, max(unexposed.y, unexposed.z)));
  return outputPremultiplied(exposed, opacity);
}

@fragment
fn fragmentHalo(raster: RasterPoint) -> @location(0) vec4<f32> {
  let item = chambers[raster.itemNumber];
  let protection = faceProtection(raster.localPosition, item.pose.z);
  if clipped(raster.position.xy, item.clipBox) || protection < 0.002 { discard; }
  let pos = bodyPoint(vec3<f32>(raster.localPosition, 0.06), item);
  let distanceValue = chamberDistance(pos, item);
  let outer = max(distanceValue, 0.0);
  let finiteMask = 1.0 - smoothstep(0.115, 0.235, outer);
  let spreading = exp(-outer * 18.0) * finiteMask;
  let receiving = exp(-length(pos.xy - vec2<f32>(0.0, -0.14)) * 4.3);
  let haloColor = mix(vec3<f32>(0.58, 0.028, 0.96), vec3<f32>(0.98, 0.79, 0.035), receiving * 0.48);
  let opacity = spreading * 0.39 * item.state.x * protection * scene.post.x;
  if opacity < 0.003 { discard; }
  return outputPremultiplied(haloColor, opacity);
}
`;

function pushScopes(device) {
  device.pushErrorScope('out-of-memory');
  device.pushErrorScope('internal');
  device.pushErrorScope('validation');
}

function popScopes(device) {
  // Pop synchronously, then await their promises; another frame may begin.
  const validation = device.popErrorScope();
  const internal = device.popErrorScope();
  const memory = device.popErrorScope();
  return Promise.all([validation, internal, memory]);
}

function publicGpuErrors(errors) {
  return errors.filter(Boolean).map((error) => ({
    name: error.constructor?.name ?? 'GPUError', message: String(error.message)
  }));
}

function requireOwner(owner) {
  const state = FRAME_OWNERS.get(owner);
  requireCondition(state && !state.destroyed, 'a live createFrameOwner result is required', Error);
  return state;
}

async function setupOnOwner(owner, operation) {
  const state = requireOwner(owner);
  state.setupCount += 1;
  const setup = state.setupTail.then(async () => {
    requireCondition(!state.openFrame, 'cannot initialize GPU resources inside an open host frame', Error);
    requireCondition(!state.lost && !state.destroyed, 'device/owner is unavailable', Error);
    pushScopes(state.device);
    let result;
    let thrown = null;
    try {
      result = await operation();
    } catch (error) {
      thrown = error;
    }
    const errors = publicGpuErrors(await popScopes(state.device));
    if (thrown) throw thrown;
    requireCondition(errors.length === 0, `GPU setup failed: ${JSON.stringify(errors)}`, Error);
    requireCondition(!state.lost, 'device was lost during setup', Error);
    return result;
  });
  state.setupTail = setup.catch(() => undefined);
  try {
    return await setup;
  } finally {
    state.setupCount -= 1;
  }
}

/** One owner per shared device. It is the DRIVER'S submission component. */
export function createFrameOwner({ device, maxFramesInFlight = 3 } = {}) {
  requireCondition(device?.queue && typeof device.createCommandEncoder === 'function', 'GPUDevice is required');
  integer(maxFramesInFlight, 'maxFramesInFlight', 1, 8);
  requireCondition(!OWNER_BY_DEVICE.has(device), 'this device already has a frame owner', Error);
  const state = {
    device, maxFramesInFlight, nextFrameId: 1, openFrame: null,
    destroyed: false, lost: null, inFlight: new Set(), setupCount: 0,
    setupTail: Promise.resolve()
  };

  const owner = Object.freeze({
    get available() {
      return !state.destroyed && !state.lost && !state.openFrame &&
        state.setupCount === 0 && state.inFlight.size < state.maxFramesInFlight;
    },

    beginFrame({ encoder, colorView, resolveView = null, width, height,
      presenting, sampleCount = 1, label = 'luck-host-frame' } = {}) {
      requireCondition(!state.destroyed && !state.lost, 'GPU frame owner is unavailable', Error);
      requireCondition(!state.openFrame, 'finish or abort the open host frame first', Error);
      requireCondition(state.setupCount === 0, 'await all effect.ready promises before beginning frames', Error);
      requireCondition(state.inFlight.size < state.maxFramesInFlight, 'frame owner backpressure: too many in-flight frames', Error);
      requireCondition(encoder && typeof encoder.beginRenderPass === 'function', 'shared GPUCommandEncoder is required');
      requireCondition(colorView, 'colorView is required');
      integer(width, 'frame.width', 1, device.limits.maxTextureDimension2D);
      integer(height, 'frame.height', 1, device.limits.maxTextureDimension2D);
      requireCondition(sampleCount === 1 || sampleCount === 4, 'sampleCount must be 1 or 4');
      requireCondition(sampleCount === 1 ? resolveView === null : !!resolveView,
        'sampleCount 4 requires resolveView; sampleCount 1 must not supply it');
      flag(presenting, 'frame.presenting');
      // The scopes include ALL subsequent host and E recording and submission.
      pushScopes(device);
      const frame = Object.freeze({
        id: state.nextFrameId++, encoder, colorView, resolveView,
        width, height, presenting, sampleCount, label: String(label)
      });
      const record = {
        owner, frame, status: 'recording', jobs: [], effects: new Set(), poisoned: null
      };
      FRAME_RECORDS.set(frame, record);
      state.openFrame = record;
      return frame;
    },

    submit(frame) {
      const record = FRAME_RECORDS.get(frame);
      requireCondition(record?.owner === owner && record === state.openFrame &&
        record.status === 'recording', 'frame is foreign, closed, aborted, or already submitted', Error);
      record.status = 'submitting';
      state.openFrame = null;
      let thrown = record.poisoned;
      let queueDone = Promise.resolve();
      if (!thrown && !state.lost && !state.destroyed) {
        try {
          const commands = frame.encoder.finish({ label: frame.label });
          // The ONLY queue.submit call in the production submission path.
          device.queue.submit([commands]);
          record.status = 'submitted';
          queueDone = device.queue.onSubmittedWorkDone();
        } catch (error) {
          thrown = error;
        }
      } else {
        thrown ??= new Error('device/owner became unavailable');
      }
      const scopeResults = popScopes(device);
      const completed = (async () => {
        let queueFailure = null;
        try { await queueDone; } catch (error) { queueFailure = error; }
        let errors = [];
        try { errors = publicGpuErrors(await scopeResults); }
        catch (error) { errors = [{ name: 'ScopeFailure', message: errorText(error) }]; }
        const success = !thrown && !queueFailure && errors.length === 0 &&
          !state.lost && !state.destroyed && record.status === 'submitted';
        const failure = thrown ? errorText(thrown) : queueFailure ? errorText(queueFailure) :
          state.lost ? `device lost: ${state.lost.message}` : state.destroyed ? 'owner destroyed' :
          errors.length ? JSON.stringify(errors) : null;
        const reports = [];
        for (const job of record.jobs) {
          try {
            reports.push(await job.complete(success, failure));
          } catch (error) {
            reports.push(job.fail(errorText(error)));
          } finally {
            job.release();
          }
        }
        record.status = success ? 'completed' : 'failed';
        return Object.freeze({
          frameId: frame.id, status: record.status, submitted: success,
          errors, failure, receipts: reports
        });
      })();
      state.inFlight.add(completed);
      completed.finally(() => state.inFlight.delete(completed)).catch(() => undefined);
      return completed;
    },

    async abort(frame, reason = 'host-aborted') {
      const record = FRAME_RECORDS.get(frame);
      requireCondition(record?.owner === owner && record === state.openFrame &&
        record.status === 'recording', 'only the current unsubmitted frame can be aborted', Error);
      record.status = 'aborted';
      state.openFrame = null;
      const scopes = popScopes(device);
      const reports = [];
      for (const job of record.jobs) {
        reports.push(job.fail(String(reason)));
        job.release();
      }
      const errors = publicGpuErrors(await scopes);
      return Object.freeze({ frameId: frame.id, status: 'aborted', submitted: false, errors, receipts: reports });
    },

    async drain() {
      await Promise.allSettled([...state.inFlight]);
    },

    async destroy() {
      if (state.destroyed) return;
      if (state.openFrame) await owner.abort(state.openFrame.frame, 'owner-destroyed');
      state.destroyed = true;
      await state.setupTail;
      await Promise.allSettled([...state.inFlight]);
      OWNER_BY_DEVICE.delete(device);
      // The shared device belongs to the host and is never destroyed here.
    }
  });
  FRAME_OWNERS.set(owner, state);
  OWNER_BY_DEVICE.set(device, owner);
  device.lost.then((info) => { state.lost = info; }).catch((error) => {
    state.lost = { message: errorText(error) };
  });
  return owner;
}

/** Session ledger is independent of GPU resource lifetime. Never LRU-evicted. */
export function createSession({ id, causeLimit = DEFAULT_LEDGER_LIMIT } = {}) {
  text(id, 'session.id');
  integer(causeLimit, 'causeLimit', 1, 1000000);
  const state = {
    id, causeLimit, roomKey: null, generation: 0, wallMs: -1,
    actorClocks: new Map(), causes: new Map(), destroyed: false,
    clients: new Set()
  };
  const session = Object.freeze({
    id,
    get size() { return state.causes.size; },
    get generation() { return state.generation; },
    diagnostics() {
      return deepFreeze([...state.causes.values()].map((entry) => ({
        causeId: entry.cause.id, playerId: entry.cause.playerId, roomKey: entry.roomKey,
        retired: entry.retired, quarantined: entry.quarantined,
        soundClaimed: entry.soundClaimed, soundStatus: entry.soundStatus
      })));
    },
    destroy() {
      if (state.destroyed) return;
      state.destroyed = true;
      state.generation += 1;
      for (const client of state.clients) client.invalidate('session-destroyed');
      state.clients.clear();
      state.causes.clear();
      state.actorClocks.clear();
    }
  });
  SESSION_RECORDS.set(session, state);
  return session;
}

function requireSession(session) {
  const state = SESSION_RECORDS.get(session);
  requireCondition(state && !state.destroyed, 'live createSession result is required', Error);
  return state;
}

function observeSession(session, input) {
  const state = requireSession(session);
  requireCondition(input.sessionId === state.id, 'input sessionId differs from session', Error);
  requireCondition(input.wallMs >= state.wallMs, 'host monotonic clock regressed', Error);
  const roomChanged = state.roomKey !== null && state.roomKey !== input.roomKey;
  if (roomChanged) {
    for (const entry of state.causes.values()) {
      if (entry.roomKey === state.roomKey) entry.retired = true;
    }
    state.generation += 1;
    for (const client of state.clients) client.invalidate('room-changed');
  }
  state.roomKey = input.roomKey;
  state.wallMs = input.wallMs;
  for (const actor of input.actors) {
    const key = JSON.stringify([input.roomKey, actor.playerId]);
    const oldTime = state.actorClocks.get(key);
    requireCondition(oldTime === undefined || actor.actorMs >= oldTime,
      `actor clock regressed for ${actor.playerId}; use a new room incarnation after a reset`, Error);
    state.actorClocks.set(key, actor.actorMs);
  }
  for (const cause of input.causes) {
    const key = causeKey(state.id, cause.id);
    const fingerprint = JSON.stringify([input.roomKey, cause]);
    const previous = state.causes.get(key);
    if (previous) {
      if (previous.fingerprint !== fingerprint) {
        previous.quarantined = true;
        for (const client of state.clients) client.cancelCause(key);
        throw new Error(`authority cause ID changed content: ${cause.id}`);
      }
      continue;
    }
    requireCondition(state.causes.size < state.causeLimit,
      'session cause ledger is full; refuse instead of evicting deduplication history', RangeError);
    state.causes.set(key, {
      key, cause, roomKey: input.roomKey, fingerprint,
      retired: false, quarantined: false, soundClaimed: false, soundStatus: 'unclaimed'
    });
  }
  const actors = new Map(input.actors.map((actor) => [actor.playerId, actor]));
  const renderableCauses = [];
  for (const entry of state.causes.values()) {
    if (entry.roomKey !== state.roomKey || entry.retired || entry.quarantined) continue;
    const actor = actors.get(entry.cause.playerId);
    if (actor && actor.actorMs - entry.cause.startedActorMs >= LIFETIME_ACTOR_MS) {
      entry.retired = true;
      for (const client of state.clients) client.cancelCause(entry.key);
      continue;
    }
    renderableCauses.push(entry.cause);
  }
  requireCondition(renderableCauses.length <= MAX_INPUT_CAUSES,
    'too many unexpired causes for the input contract', RangeError);
  for (const client of state.clients) client.updateVoices(input, actors);
  return plan({ ...input, causes: renderableCauses });
}

function documentCanPresent() {
  return typeof document === 'undefined' || document.visibilityState !== 'hidden';
}

function makeSoundBuffer(context) {
  const duration = 0.36;
  const sampleRate = context.sampleRate;
  const length = Math.ceil(duration * sampleRate);
  const buffer = context.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  // Fixed harmonic body + a short filtered breath. No coin samples, rising
  // particle chimes, pitch-converging pair, randomness or external audio file.
  let noiseState = 284731;
  let lowNoise = 0;
  for (let index = 0; index < length; index += 1) {
    const time = index / sampleRate;
    noiseState = (Math.imul(noiseState, 1664525) + 1013904223) >>> 0;
    const white = noiseState / 2147483648 - 1;
    lowNoise += 0.12 * (white - lowNoise);
    const strikeEnvelope = (1 - Math.exp(-time / 0.004)) * Math.exp(-time / 0.075);
    const bodyEnvelope = (1 - Math.exp(-time / 0.025)) * Math.exp(-time / 0.14);
    const exitEnvelope = 1 - easeBetween(time, 0.26, duration);
    const strike = Math.sin(time * Math.PI * 2 * 392) * 0.46 +
      Math.sin(time * Math.PI * 2 * 784) * 0.19;
    const body = Math.sin(time * Math.PI * 2 * 294) * 0.36 +
      Math.sin(time * Math.PI * 2 * 588) * 0.17 +
      Math.sin(time * Math.PI * 2 * 1176) * 0.065;
    const breath = lowNoise * (1 - Math.exp(-time / 0.009)) * Math.exp(-time / 0.052) * 0.20;
    data[index] = Math.tanh((strike * strikeEnvelope + body * bodyEnvelope + breath) * 1.4) * exitEnvelope * 0.68;
  }
  return buffer;
}

function createSoundEngine({ audioContext = null, volume = 0.34 } = {}) {
  finite(volume, 'audio.volume', 0, 1);
  let context = audioContext;
  let ownsContext = false;
  let buffer = null;
  let master = null;
  let compressor = null;
  let closed = false;
  const voices = new Map();

  function initialize() {
    if (!context || master || closed) return;
    requireCondition(typeof context.createBufferSource === 'function' &&
      typeof context.createStereoPanner === 'function', 'a real Web Audio AudioContext is required');
    master = context.createGain();
    master.gain.value = volume;
    compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -12;
    compressor.knee.value = 14;
    compressor.ratio.value = 6;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.11;
    master.connect(compressor);
    compressor.connect(context.destination);
    buffer = makeSoundBuffer(context);
  }

  function cancelCause(key) {
    const voice = voices.get(key);
    if (!voice) return;
    try { voice.source.stop(); } catch { /* already stopped */ }
    voice.cleanup();
  }

  function stopAll() {
    for (const key of [...voices.keys()]) cancelCause(key);
  }

  const engine = {
    async unlock() {
      requireCondition(!closed, 'audio engine is destroyed', Error);
      if (!context) {
        const AudioContextClass = globalThis.AudioContext ?? globalThis.webkitAudioContext;
        requireCondition(AudioContextClass, 'Web Audio is not available', Error);
        context = new AudioContextClass({ latencyHint: 'interactive' });
        ownsContext = true;
      }
      initialize();
      if (context.state !== 'running') await context.resume();
      return context.state;
    },

    tryConsume(receipt, key, entry, liveItem) {
      const proof = RECEIPT_RECORDS.get(receipt);
      requireCondition(proof && proof.authorized && proof.rasterized.has(key),
        'SFX requires a private submitted-and-rasterized receipt', Error);
      if (entry.soundClaimed) return 'already-claimed';
      if (closed || volume === 0) return 'muted';
      if (!context || context.state !== 'running') return 'audio-locked';
      if (liveItem.actorRate === 0) return 'actor-paused';
      if (!documentCanPresent()) return 'document-hidden';
      if (voices.size >= MAX_VISIBLE_CAUSES) return 'audio-backpressure';
      initialize();
      const source = context.createBufferSource();
      const gain = context.createGain();
      const panner = context.createStereoPanner();
      const remainingActorSeconds = Math.max(0.001,
        (LIFETIME_ACTOR_MS - liveItem.timing.ageActorMs) / 1000);
      if (remainingActorSeconds < buffer.duration) {
        const length = Math.max(1, Math.floor(remainingActorSeconds * context.sampleRate));
        const shortened = context.createBuffer(1, length, context.sampleRate);
        const samples = shortened.getChannelData(0);
        samples.set(buffer.getChannelData(0).subarray(0, length));
        const fadeSamples = Math.min(length, Math.ceil(context.sampleRate * 0.012));
        for (let index = 0; index < fadeSamples; index += 1) {
          samples[length - fadeSamples + index] *= 1 - index / Math.max(1, fadeSamples - 1);
        }
        source.buffer = shortened;
      } else {
        source.buffer = buffer;
      }
      source.playbackRate.value = liveItem.actorRate;
      gain.gain.value = 1 / Math.sqrt(Math.max(1, voices.size + 1));
      panner.pan.value = liveItem.soundPan;
      source.connect(gain);
      gain.connect(panner);
      panner.connect(master);
      let cleaned = false;
      const cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        source.disconnect();
        gain.disconnect();
        panner.disconnect();
        voices.delete(key);
      };
      source.onended = cleanup;
      // Claim synchronously before start; no asynchronous window can replay it.
      // A scheduling exception remains a consumed failed attempt, not a retry.
      entry.soundClaimed = true;
      entry.soundStatus = 'scheduling';
      voices.set(key, { source, cleanup, playerId: entry.cause.playerId });
      try {
        source.start(context.currentTime);
        entry.soundStatus = 'scheduled';
        return 'scheduled';
      } catch (error) {
        cleanup();
        entry.soundStatus = `scheduling-failed: ${errorText(error)}`;
        return entry.soundStatus;
      }
    },

    cancelCause,
    invalidate: stopAll,

    updateVoices(input, actors) {
      if (!context || closed) return;
      if (!input.surfaceVisible || !documentCanPresent() || context.state !== 'running') {
        stopAll();
        return;
      }
      for (const [key, voice] of voices) {
        const actor = actors.get(voice.playerId);
        if (!actor || !actor.visible || actor.rate === 0) {
          cancelCause(key);
        } else {
          voice.source.playbackRate.setTargetAtTime(actor.rate, context.currentTime, 0.012);
        }
      }
    },

    setVolume(nextVolume) {
      volume = finite(nextVolume, 'audio.volume', 0, 1);
      if (master) master.gain.setValueAtTime(volume, context.currentTime);
      if (volume === 0) stopAll();
    },

    get state() { return closed ? 'destroyed' : context?.state ?? 'not-created'; },

    async destroy() {
      if (closed) return;
      closed = true;
      stopAll();
      master?.disconnect();
      compressor?.disconnect();
      if (ownsContext && context?.state !== 'closed') await context.close();
      buffer = null;
      master = null;
      compressor = null;
    }
  };
  return engine;
}

function mappedBuffer(device, values, usage, label) {
  const bytes = alignBytes(values.byteLength, 4);
  const buffer = device.createBuffer({ size: bytes, usage, mappedAtCreation: true, label });
  new Uint8Array(buffer.getMappedRange()).set(new Uint8Array(values.buffer, values.byteOffset, values.byteLength));
  buffer.unmap();
  return buffer;
}

function signature(id) {
  let value = 5381;
  for (const character of id) value = (Math.imul(value, 33) + character.codePointAt(0)) >>> 0;
  return ((value % 1024) / 1023 - 0.5) * 0.095;
}

function packedItems(items, reducedMotion) {
  const values = new Float32Array(items.length * ITEM_FLOATS);
  items.forEach((item, index) => {
    values.set([
      ...item.centerPx, item.aspect, item.timing.normalizedAge,
      ...item.xBasis, item.bodyHeightCss, 0,
      ...item.yBasis, item.actorRate, 0,
      item.timing.opacity, item.timing.compression, item.timing.flowRadius, reducedMotion ? 1 : 0,
      ...item.clipPx,
      signature(item.cause.id), item.cause.meaning === 'intuition' ? 1 : 0, 0, 0,
      item.halfWidth, item.halfHeight, 0, 0
    ], index * ITEM_FLOATS);
  });
  return values;
}

/**
 * Construct the E renderer. All GPU recording goes into enrolled shared frames.
 * readLiveInput must remain callable during pending GPU completion callbacks.
 */
export function create({ renderer, frameOwner, session, readLiveInput,
  audioContext = null, audioEnabled = true, volume = 0.34 } = {}) {
  requireCondition(renderer && typeof renderer === 'object', 'renderer is required');
  const ownerState = requireOwner(frameOwner);
  const device = renderer.device;
  requireCondition(device === ownerState.device, 'renderer and frame owner must share one GPUDevice', Error);
  const formats = ['rgba8unorm', 'bgra8unorm', 'rgba8unorm-srgb', 'bgra8unorm-srgb', 'rgba16float'];
  requireCondition(formats.includes(renderer.format), 'unsupported renderer.format');
  const sampleCount = renderer.sampleCount ?? 1;
  requireCondition(sampleCount === 1 || sampleCount === 4, 'renderer.sampleCount must be 1 or 4');
  const colorEncoding = renderer.colorEncoding ??
    (renderer.format.endsWith('-srgb') || renderer.format === 'rgba16float' ? 'linear' : 'srgb');
  requireCondition(colorEncoding === 'srgb' || colorEncoding === 'linear', 'invalid renderer.colorEncoding');
  requireCondition(typeof readLiveInput === 'function', 'readLiveInput callback is required for post-submit validation');
  flag(audioEnabled, 'audioEnabled');
  const ledger = requireSession(session);
  const sound = createSoundEngine({ audioContext, volume: audioEnabled ? volume : 0 });
  ledger.clients.add(sound);
  let disposed = false;
  let initialized = false;
  let localGeneration = 0;
  let pipelines = null;
  let layout = null;
  let compilationMessages = null;
  const jobs = new Set();
  const instanceIdentity = {};

  function sourceOf(value) {
    return value?.version === VERSION && value.source ? value.source : value;
  }

  function sync(value) {
    requireCondition(!disposed, 'effect is destroyed', Error);
    const input = normalizedInput(sourceOf(value));
    return observeSession(session, input);
  }

  function livePlan() {
    return sync(readLiveInput());
  }

  function acceptSfx(receipt) {
    const proof = RECEIPT_RECORDS.get(receipt);
    requireCondition(proof?.instanceIdentity === instanceIdentity && proof.authorized,
      'receipt is foreign or has not completed an accepted submission', Error);
    if (!proof.soundWindow) return [];
    proof.soundWindow = false;
    if (disposed || proof.localGeneration !== localGeneration || ledger.destroyed ||
      proof.sessionGeneration !== ledger.generation) return [];
    const current = livePlan();
    if (proof.sessionGeneration !== ledger.generation || !proof.presenting ||
      !current.source.surfaceVisible || !documentCanPresent()) return [];
    const liveItems = new Map(current.items.map((item) => [item.key, item]));
    const results = [];
    for (const key of proof.rasterized) {
      const entry = ledger.causes.get(key);
      const item = liveItems.get(key);
      if (!entry || !item || entry.retired || entry.quarantined || entry.roomKey !== current.source.roomKey) {
        results.push({ key, sound: 'no-longer-visible-or-valid' });
      } else {
        results.push({ key, sound: sound.tryConsume(receipt, key, entry, item) });
      }
    }
    return results;
  }

  const ready = setupOnOwner(frameOwner, async () => {
    const reserved = inspectShaderWords(WGSL);
    requireCondition(reserved.length === 0, `WGSL reserved identifiers: ${reserved.join(', ')}`, Error);
    const shader = device.createShaderModule({ label: 'luck-e: complete WGSL', code: WGSL });
    const info = await shader.getCompilationInfo();
    compilationMessages = info.messages.map((message) => Object.freeze({
      type: message.type, message: message.message, lineNum: message.lineNum,
      linePos: message.linePos, offset: message.offset, length: message.length
    }));
    const failures = compilationMessages.filter((message) => message.type === 'error');
    requireCondition(failures.length === 0,
      `WGSL compilation failed:\n${failures.map((m) => `${m.lineNum}:${m.linePos} ${m.message}`).join('\n')}`, Error);
    layout = device.createBindGroupLayout({
      label: 'luck-e: immutable frame and instances',
      entries: [
        { binding: 0, visibility: SHADER_VERTEX_FRAGMENT, buffer: { type: 'uniform', minBindingSize: FRAME_FLOATS * 4 } },
        { binding: 1, visibility: SHADER_VERTEX_FRAGMENT, buffer: { type: 'read-only-storage', minBindingSize: ITEM_FLOATS * 4 } }
      ]
    });
    const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [layout] });
    const blend = {
      color: { operation: 'add', srcFactor: 'one', dstFactor: 'one-minus-src-alpha' },
      alpha: { operation: 'add', srcFactor: 'one', dstFactor: 'one-minus-src-alpha' }
    };
    function descriptor(entryPoint, label) {
      return {
        label, layout: pipelineLayout,
        vertex: { module: shader, entryPoint: 'vertexChamber' },
        fragment: { module: shader, entryPoint, targets: [{ format: renderer.format, blend, writeMask: 15 }] },
        primitive: { topology: 'triangle-list', cullMode: 'none' },
        multisample: { count: sampleCount }
      };
    }
    const [halo, volumePipeline] = await Promise.all([
      device.createRenderPipelineAsync(descriptor('fragmentHalo', 'luck-e: finite halo')),
      device.createRenderPipelineAsync(descriptor('fragmentChamber', 'luck-e: colored receiving volume'))
    ]);
    if (!disposed) pipelines = { halo, volume: volumePipeline };
  }).then(() => {
    requireCondition(!disposed, 'effect was destroyed during initialization', Error);
    initialized = true;
    return Object.freeze({ compilationMessages: Object.freeze(compilationMessages) });
  });
  // Retain rejection for callers awaiting ready without causing a global unhandled
  // rejection merely because they construct first and await in a later task.
  ready.catch(() => undefined);

  const effect = Object.freeze({
    ready,
    get compilationMessages() { return compilationMessages; },
    get audioState() { return sound.state; },
    sync,
    unlockAudio() {
      requireCondition(!disposed && audioEnabled, 'audio is disabled or effect is destroyed', Error);
      return sound.unlock();
    },
    setVolume(nextVolume) { sound.setVolume(audioEnabled ? nextVolume : 0); },
    acceptSfx,

    record(frame, value) {
      requireCondition(initialized && !disposed && !ownerState.lost, 'await ready on a live effect before record', Error);
      const frameRecord = FRAME_RECORDS.get(frame);
      requireCondition(frameRecord?.owner === frameOwner && frameRecord === ownerState.openFrame &&
        frameRecord.status === 'recording', 'record requires the current enrolled shared frame', Error);
      requireCondition(!frameRecord.effects.has(instanceIdentity), 'effect.record was already called for this frame', Error);
      requireCondition(!frameRecord.poisoned, 'host frame is poisoned; abort it', Error);
      requireCondition(frame.sampleCount === sampleCount, 'frame and pipeline sample counts differ', Error);
      const planned = sync(value);
      requireCondition(planned.width === frame.width && planned.height === frame.height,
        'DPR/CSS dimensions do not match the physical color attachment', Error);
      frameRecord.effects.add(instanceIdentity);
      frameRecord.causeKeys ??= new Set();
      const items = planned.items.filter((item) => !frameRecord.causeKeys.has(item.key));
      const completion = deferred();
      const receipt = Object.freeze({
        frameId: frame.id,
        causeIds: Object.freeze(items.map((item) => item.cause.id)),
        done: completion.promise
      });
      const proof = {
        instanceIdentity, frameId: frame.id, localGeneration,
        sessionGeneration: ledger.generation, presenting: frame.presenting,
        authorized: false, soundWindow: false, rasterized: new Set()
      };
      RECEIPT_RECORDS.set(receipt, proof);
      let finishedReport = null;
      let released = false;
      let queryReadback = null;
      const resources = [];

      function finishReport(status, fields = {}) {
        if (finishedReport) return finishedReport;
        finishedReport = deepFreeze({ frameId: frame.id, status,
          causeIds: items.map((item) => item.cause.id), ...fields });
        completion.resolve(finishedReport);
        return finishedReport;
      }

      const job = {
        fail(reason) {
          proof.authorized = false;
          return finishReport('rejected', { reason, visibility: [], sounds: [] });
        },
        async complete(success, reason) {
          if (finishedReport) return finishedReport;
          if (!success) return job.fail(reason ?? 'submission-failed');
          if (disposed || proof.localGeneration !== localGeneration || ledger.destroyed) return job.fail('effect-invalidated');
          if (items.length === 0) return finishReport('empty', { visibility: [], sounds: [] });
          await queryReadback.mapAsync(MAP_READ);
          const values = new DataView(queryReadback.getMappedRange());
          const visibility = items.map((item, index) => {
            const queryValue = values.getBigUint64(index * 8, true);
            if (queryValue > 0n) proof.rasterized.add(item.key);
            return { causeId: item.cause.id, key: item.key,
              queryResult: queryValue.toString(), mainVolumeRasterized: queryValue > 0n };
          });
          queryReadback.unmap();
          if (disposed || ledger.destroyed || ownerState.lost ||
            proof.sessionGeneration !== ledger.generation) return job.fail('lifecycle-changed-after-submit');
          // Observing live input here also detects transitions between RAFs.
          const current = livePlan();
          if (proof.sessionGeneration !== ledger.generation ||
            current.source.roomKey !== planned.source.roomKey) return job.fail('room-changed-after-submit');
          proof.authorized = true;
          let sounds = [];
          if (frame.presenting && documentCanPresent() && current.source.surfaceVisible) {
            proof.soundWindow = true;
            sounds = acceptSfx(receipt);
          }
          // A locked/hidden receipt cannot be replayed after unlock or resume.
          // A still-live cause may try again with a NEW submitted frame.
          proof.soundWindow = false;
          return finishReport('submitted', {
            visibility, sounds,
            presenting: frame.presenting,
            limitation: 'surviving primary samples, not physical scan-out or audibility'
          });
        },
        release() {
          if (released) return;
          released = true;
          for (const resource of resources) {
            try {
              if (resource.mapState === 'mapped') resource.unmap();
              resource.destroy();
            } catch { /* device loss does not permit an audio retry */ }
          }
          jobs.delete(job);
        }
      };
      jobs.add(job);
      frameRecord.jobs.push(job);
      if (items.length === 0) return receipt;

      let renderPass = null;
      try {
        const settings = planned.source.inspect;
        const frameValues = new Float32Array([
          frame.width, frame.height, planned.source.display.dpr, planned.depthSamples,
          settings.core ? 1 : 0, settings.structure ? 1 : 0,
          settings.thin ? 1 : 0, settings.transport ? 1 : 0,
          planned.glowStrength, colorEncoding === 'srgb' ? 1 : 0, 0, 0
        ]);
        const frameBuffer = mappedBuffer(device, frameValues, BUFFER_UNIFORM, 'luck-e: frame snapshot');
        resources.push(frameBuffer);
        const itemBuffer = mappedBuffer(device, packedItems(items, planned.source.reducedMotion),
          BUFFER_STORAGE, 'luck-e: cause snapshots');
        resources.push(itemBuffer);
        const bindGroup = device.createBindGroup({
          label: 'luck-e: frame bindings', layout,
          entries: [
            { binding: 0, resource: { buffer: frameBuffer } },
            { binding: 1, resource: { buffer: itemBuffer } }
          ]
        });
        const queries = device.createQuerySet({ type: 'occlusion', count: items.length,
          label: 'luck-e: primary-volume visibility only' });
        resources.push(queries);
        const queryBytes = alignBytes(items.length * 8, 256);
        const resolvedQueries = device.createBuffer({ size: queryBytes,
          usage: BUFFER_QUERY_RESOLVE | BUFFER_COPY_SRC, label: 'luck-e: query resolve' });
        resources.push(resolvedQueries);
        queryReadback = device.createBuffer({ size: queryBytes,
          usage: BUFFER_MAP_READ | BUFFER_COPY_DST, label: 'luck-e: query readback' });
        resources.push(queryReadback);
        const attachment = { view: frame.colorView, loadOp: 'load', storeOp: 'store' };
        if (frame.resolveView) attachment.resolveTarget = frame.resolveView;
        renderPass = frame.encoder.beginRenderPass({
          label: 'luck-e: halo then primary per independent cause',
          colorAttachments: [attachment], occlusionQuerySet: queries
        });
        renderPass.setBindGroup(0, bindGroup);
        renderPass.setViewport(0, 0, frame.width, frame.height, 0, 1);
        // Stable authority ordering. Each cause is a self-contained halo + body.
        // All colors use bounded premultiplied over, not unbounded additive white.
        items.forEach((item, index) => {
          const clip = item.scissor;
          renderPass.setScissorRect(clip.x, clip.y, clip.width, clip.height);
          if (planned.glowStrength > 0) {
            renderPass.setPipeline(pipelines.halo);
            renderPass.draw(6, 1, 0, index);
          }
          renderPass.setPipeline(pipelines.volume);
          renderPass.beginOcclusionQuery(index);
          renderPass.draw(6, 1, 0, index);
          renderPass.endOcclusionQuery();
          frameRecord.causeKeys.add(item.key);
        });
        renderPass.end();
        renderPass = null;
        frame.encoder.resolveQuerySet(queries, 0, items.length, resolvedQueries, 0);
        frame.encoder.copyBufferToBuffer(resolvedQueries, 0, queryReadback, 0, queryBytes);
      } catch (error) {
        if (renderPass) {
          try { renderPass.end(); } catch { /* owner will refuse this frame */ }
        }
        frameRecord.poisoned = error;
        job.fail(errorText(error));
        throw error;
      }
      return receipt;
    },

    async destroy() {
      if (disposed) return;
      disposed = true;
      initialized = false;
      localGeneration += 1;
      ledger.clients.delete(sound);
      for (const job of jobs) job.fail('effect-destroyed');
      await sound.destroy();
      await ready.catch(() => undefined);
      pipelines = null;
      layout = null;
      // Pending buffer lifetimes remain owned by their shared frame jobs until
      // submit/abort completes. Never destroy another subsystem's open encoder.
    }
  });
  ownerState.device.lost.then(() => {
    sound.invalidate('device-lost');
    localGeneration += 1;
    for (const job of jobs) job.fail('device-lost');
  }).catch(() => undefined);
  return effect;
}

/** Static reserved-word scan, NOT a substitute for GPU compilation. */
export function inspectShaderWords(source = WGSL) {
  const words = new Set((
    'NULL Self abstract active alignas alignof as asm asm_fragment async attribute auto await ' +
    'become cast catch class co_await co_return co_yield coherent column_major common compile ' +
    'compile_fragment concept const_cast consteval constexpr constinit crate debugger decltype ' +
    'delete demote demote_to_helper do dynamic_cast enum explicit export extends extern external ' +
    'fallthrough filter final finally friend from fxgroup get goto groupshared highp impl implements ' +
    'import inline instanceof interface layout lowp macro macro_rules match mediump meta mod module ' +
    'move mut mutable namespace new nil noexcept noinline nointerpolation non_coherent noncoherent ' +
    'noperspective null nullptr of operator package packoffset partition pass patch pixelfragment ' +
    'precise precision premerge priv protected pub public readonly ref regardless register ' +
    'reinterpret_cast require resource restrict self set shared sizeof smooth snorm static ' +
    'static_assert static_cast std subroutine super target template this thread_local throw trait ' +
    'try type typedef typeid typename typeof union unless unorm unsafe unsized use using varying ' +
    'virtual volatile wgsl where with writeonly yield'
  ).split(/\s+/));
  // The bundled shaders use line comments only; removing block comments also
  // makes this useful on straightforward caller test strings.
  const stripped = String(source).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  const tokens = stripped.match(/[A-Za-z_][A-Za-z_0-9]*/g) ?? [];
  return Object.freeze([...new Set(tokens.filter((token) => words.has(token) || token.startsWith('__')))]);
}

/** Complete host snapshot for one synthetic cause. Body units are meters. */
export function testInput({
  ageActorMs = 0, dpr = 1, reducedMotion = false, rate = 1,
  bodyWidthCss = 124, bodyHeightCss = 164, zoom = 1,
  sessionId = 'luck-e-test-session', roomKey = 'luck-e-test-room',
  causeId = 'luck-e-test-cause', playerId = 'luck-e-test-actor',
  wallMs = 100000, visible = true, surfaceVisible = true,
  inspect = undefined
} = {}) {
  finite(ageActorMs, 'test ageActorMs', -10000, 1e9);
  finite(bodyWidthCss, 'test bodyWidthCss', 1, 2000);
  finite(bodyHeightCss, 'test bodyHeightCss', 1, 2000);
  return deepFreeze(normalizedInput({
    sessionId, roomKey, wallMs, reducedMotion, surfaceVisible,
    display: { cssWidth: 980, cssHeight: 620, dpr },
    viewport: { x: 0, y: 0, width: 980, height: 620 },
    camera: { x: 0, y: 0, zoom, cssPixelsPerWorldUnit: 100, angleRad: 0 },
    actors: [{
      playerId, x: 0, y: 0,
      bodyWidth: bodyWidthCss / 100, bodyHeight: bodyHeightCss / 100,
      angleRad: 0, actorMs: 10000 + ageActorMs, rate, visible
    }],
    causes: [{ id: causeId, playerId, startedActorMs: 10000, meaning: 'luck' }],
    inspect
  }));
}

export function allActorMilliseconds() {
  return Object.freeze([-1, ...Array.from({ length: LIFETIME_ACTOR_MS }, (_, index) => index), 1420]);
}

function measureRgba(bytes, bytesPerRow, width, height) {
  let coloredPixels = 0;
  let brightPixels = 0;
  let yellowPixels = 0;
  let purplePixels = 0;
  let almostWhitePixels = 0;
  let alphaSum = 0;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const position = y * bytesPerRow + x * 4;
      const alpha = bytes[position + 3] / 255;
      if (alpha <= 1 / 255) continue;
      coloredPixels += 1;
      alphaSum += alpha;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      // Diagnostic bins, not universal perceptual acceptance thresholds.
      const red = Math.min(1, bytes[position] / 255 / alpha);
      const green = Math.min(1, bytes[position + 1] / 255 / alpha);
      const blue = Math.min(1, bytes[position + 2] / 255 / alpha);
      if (Math.max(red, green, blue) > 0.72) brightPixels += 1;
      if (red > 0.62 && green > 0.52 && blue < 0.55) yellowPixels += 1;
      if (blue > 0.55 && red > 0.35 && green < 0.55) purplePixels += 1;
      if (Math.min(red, green, blue) > 0.94) almostWhitePixels += 1;
    }
  }
  return {
    coloredPixels, brightPixels, yellowPixels, purplePixels, almostWhitePixels,
    alphaSum, bounds: maxX < 0 ? null : { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
  };
}

let probeSequence = 0;

/**
 * Execute real WebGPU compilation, rendering, queries and numeric RGBA readback.
 * Stop the host render loop while using a shared owner for this diagnostic.
 * Offscreen frames NEVER authorize SFX. No image is uploaded to a 2D renderer.
 * Use times: allActorMilliseconds() for the full integer-ms sweep.
 * This function returns measurements, not an artistic score or blanket Pass.
 */
export async function runGpuProbe({ device, frameOwner = null, times = TEST_TIMES,
  dpr = 1, reducedMotion = false, bodyWidthCss = 124, bodyHeightCss = 164,
  inspect = undefined } = {}) {
  requireCondition(device?.queue, 'runGpuProbe requires an actual GPUDevice');
  list(times, 'probe times', 10000);
  requireCondition(times.length > 0, 'probe times must not be empty');
  for (let index = 0; index < times.length; index += 1) {
    finite(times[index], 'probe time', -10000, 1e9);
    if (index > 0) requireCondition(times[index] >= times[index - 1], 'probe times must be nondecreasing');
  }
  const existing = frameOwner ?? OWNER_BY_DEVICE.get(device);
  const owner = existing ?? createFrameOwner({ device });
  const ownsOwner = !existing;
  requireCondition(requireOwner(owner).device === device, 'probe owner device mismatch');
  const session = createSession({ id: `luck-e-probe-${++probeSequence}` });
  let current = testInput({ ageActorMs: times[0], sessionId: session.id,
    dpr, reducedMotion, bodyWidthCss, bodyHeightCss, inspect });
  const effect = create({ renderer: { device, format: 'rgba8unorm' }, frameOwner: owner,
    session, readLiveInput: () => current, audioEnabled: false });
  let outputTexture = null;
  let pixelBuffer = null;
  let openFrame = null;
  const observations = [];
  try {
    await effect.ready;
    const first = plan(current);
    const width = first.width;
    const height = first.height;
    const bytesPerRow = alignBytes(width * 4, 256);
    await setupOnOwner(owner, async () => {
      outputTexture = device.createTexture({
        size: { width, height, depthOrArrayLayers: 1 }, format: 'rgba8unorm',
        usage: TEXTURE_RENDER_ATTACHMENT | TEXTURE_COPY_SRC, label: 'luck-e: numeric probe image'
      });
      pixelBuffer = device.createBuffer({ size: bytesPerRow * height,
        usage: BUFFER_MAP_READ | BUFFER_COPY_DST, label: 'luck-e: numeric pixel probe' });
    });
    for (let index = 0; index < times.length; index += 1) {
      current = testInput({ ageActorMs: times[index], sessionId: session.id,
        wallMs: 100000 + index, dpr, reducedMotion, bodyWidthCss, bodyHeightCss, inspect });
      const colorView = outputTexture.createView();
      openFrame = owner.beginFrame({ encoder: device.createCommandEncoder(), colorView,
        width, height, presenting: false, label: `luck-e probe ${times[index]} actor-ms` });
      const clearing = openFrame.encoder.beginRenderPass({ colorAttachments: [{
        view: colorView, loadOp: 'clear', storeOp: 'store', clearValue: { r: 0, g: 0, b: 0, a: 0 }
      }] });
      clearing.end();
      const receipt = effect.record(openFrame, current);
      openFrame.encoder.copyTextureToBuffer({ texture: outputTexture },
        { buffer: pixelBuffer, bytesPerRow, rowsPerImage: height }, { width, height, depthOrArrayLayers: 1 });
      const submitted = owner.submit(openFrame);
      openFrame = null;
      const submission = await submitted;
      const receiptReport = await receipt.done;
      requireCondition(submission.submitted, `probe submission failed: ${submission.failure}`, Error);
      await pixelBuffer.mapAsync(MAP_READ);
      let pixels;
      try {
        pixels = measureRgba(new Uint8Array(pixelBuffer.getMappedRange()), bytesPerRow, width, height);
      } finally {
        pixelBuffer.unmap();
      }
      observations.push({ ageActorMs: times[index], pixels, receipt: receiptReport });
    }
    return {
      version: VERSION, width, height, dpr, bodyWidthCss, bodyHeightCss, reducedMotion,
      compilationMessages: effect.compilationMessages, observations,
      hardwareIdentity: 'host-supplied device; physical GPU identity is not inferred',
      realGameEvents: 'not_run', realSkins: 'not_run', audibility: 'not_run', artisticReview: 'not_run'
    };
  } finally {
    if (openFrame) await owner.abort(openFrame, 'probe-cleanup').catch(() => undefined);
    await effect.destroy();
    await owner.drain();
    if (pixelBuffer?.mapState === 'mapped') pixelBuffer.unmap();
    pixelBuffer?.destroy();
    outputTexture?.destroy();
    session.destroy();
    if (ownsOwner) await owner.destroy();
  }
}

const FIXTURE_WGSL = String.raw`
struct FixtureInfo {
  dimensions: vec4<f32>,
  skinColor: vec4<f32>,
  clothesColor: vec4<f32>,
}
struct FixturePoint {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}
@group(0) @binding(0) var<uniform> fixture: FixtureInfo;

fn segmentShape(pos: vec2<f32>, a: vec2<f32>, b: vec2<f32>, radius: f32) -> f32 {
  let delta = b - a;
  let fraction = clamp(dot(pos - a, delta) / max(dot(delta, delta), 0.0001), 0.0, 1.0);
  return length(pos - a - delta * fraction) - radius;
}
@vertex
fn fixtureVertex(@builtin(vertex_index) idx: u32) -> FixturePoint {
  var corners = array<vec2<f32>, 6>(vec2<f32>(-0.5, -0.5), vec2<f32>(0.5, -0.5),
    vec2<f32>(-0.5, 0.5), vec2<f32>(-0.5, 0.5), vec2<f32>(0.5, -0.5), vec2<f32>(0.5, 0.5));
  let localPosition = corners[idx];
  let pixel = fixture.dimensions.xy * 0.5 + vec2<f32>(localPosition.x, -localPosition.y) * fixture.dimensions.zw;
  var result: FixturePoint;
  result.position = vec4<f32>(pixel.x * 2.0 / fixture.dimensions.x - 1.0,
    1.0 - pixel.y * 2.0 / fixture.dimensions.y, 0.5, 1.0);
  result.uv = localPosition;
  return result;
}
@fragment
fn fixtureFragment(raster: FixturePoint) -> @location(0) vec4<f32> {
  let edge = max(length(fwidth(raster.uv)), 0.002);
  let head = (length((raster.uv - vec2<f32>(0.0, 0.305)) / vec2<f32>(0.18, 0.19)) - 1.0) * 0.18;
  let torso = segmentShape(raster.uv, vec2<f32>(0.0, 0.08), vec2<f32>(0.0, -0.13), 0.23);
  let armLeft = segmentShape(raster.uv, vec2<f32>(-0.23, 0.06), vec2<f32>(-0.435, -0.19), 0.062);
  let armRight = segmentShape(raster.uv, vec2<f32>(0.23, 0.06), vec2<f32>(0.435, -0.19), 0.062);
  let legLeft = segmentShape(raster.uv, vec2<f32>(-0.115, -0.18), vec2<f32>(-0.14, -0.425), 0.071);
  let legRight = segmentShape(raster.uv, vec2<f32>(0.115, -0.18), vec2<f32>(0.14, -0.425), 0.071);
  let clothingDistance = min(torso, min(legLeft, legRight));
  let skinDistance = min(head, min(armLeft, armRight));
  let totalDistance = min(clothingDistance, skinDistance);
  let opacity = 1.0 - smoothstep(-edge, edge, totalDistance);
  if opacity < 0.004 { discard; }
  let rgb = select(fixture.clothesColor.xyz, fixture.skinColor.xyz, skinDistance < clothingDistance);
  return vec4<f32>(rgb * opacity, opacity);
}
`;

export const SYNTHETIC_SKINS = deepFreeze({
  light: { skin: [0.96, 0.78, 0.60], clothes: [0.90, 0.90, 0.94] },
  dark: { skin: [0.26, 0.15, 0.11], clothes: [0.085, 0.085, 0.10] },
  red: { skin: [0.70, 0.40, 0.25], clothes: [0.82, 0.055, 0.11] },
  blue: { skin: [0.82, 0.61, 0.40], clothes: [0.065, 0.22, 0.79] }
});

/** Complete opt-in WebGPU test host. It owns only the device it creates. */
export async function mountTest(canvas = null, options = {}) {
  requireCondition(typeof document !== 'undefined', 'mountTest requires a browser document');
  requireCondition(globalThis.navigator?.gpu, 'WebGPU is unavailable in this browser/context', Error);
  const madeCanvas = canvas === null;
  if (madeCanvas) {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
  }
  requireCondition(canvas instanceof HTMLCanvasElement, 'canvas must be an HTMLCanvasElement');
  const dpr = finite(options.dpr ?? Math.min(3, globalThis.devicePixelRatio || 1), 'preview dpr', 0.5, 4);
  const bodyWidthCss = finite(options.bodyWidthCss ?? 124, 'preview body width', 1, 2000);
  const bodyHeightCss = finite(options.bodyHeightCss ?? 164, 'preview body height', 1, 2000);
  let skinName = options.skin ?? 'light';
  requireCondition(SYNTHETIC_SKINS[skinName], 'unknown synthetic skin');
  const backdrop = options.background ?? [0.045, 0.055, 0.075];
  list(backdrop, 'preview background', 3);
  requireCondition(backdrop.length === 3, 'preview background needs three channels');
  backdrop.forEach((value) => finite(value, 'preview background channel', 0, 1));
  const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
  requireCondition(adapter, 'no WebGPU adapter was returned', Error);
  const device = await adapter.requestDevice();
  const format = navigator.gpu.getPreferredCanvasFormat();
  const context = canvas.getContext('webgpu');
  requireCondition(context, 'cannot acquire a WebGPU canvas context', Error);
  canvas.width = Math.round(980 * dpr);
  canvas.height = Math.round(620 * dpr);
  canvas.style.width = '980px';
  canvas.style.height = '620px';
  context.configure({ device, format, alphaMode: 'opaque' });
  const owner = createFrameOwner({ device });
  const session = createSession({ id: `luck-e-preview-${++probeSequence}` });
  let disposed = false;
  let animationHandle = 0;
  let reducedMotion = options.reducedMotion ?? globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  flag(reducedMotion, 'preview reducedMotion');
  let clock = { actorMs: 10000, wallMs: performance.now(), rate: finite(options.rate ?? 1, 'preview rate', 0, 8) };
  let roomOrdinal = 1;
  let causeOrdinal = 1;
  let inbox = [{ id: `preview-cause-${causeOrdinal}`, playerId: 'preview-actor', startedActorMs: clock.actorMs, meaning: 'luck' }];
  let fixturePipeline = null;
  let lastReceipt = null;
  let lastError = null;

  function tickClock() {
    clock = advanceActorClock(clock, performance.now(), clock.rate);
  }

  function currentInput() {
    tickClock();
    const base = testInput({ sessionId: session.id, roomKey: `preview-room-${roomOrdinal}`,
      playerId: 'preview-actor', dpr, reducedMotion, bodyWidthCss, bodyHeightCss,
      wallMs: clock.wallMs, rate: clock.rate, surfaceVisible: documentCanPresent() && canvas.isConnected });
    return {
      ...base,
      actors: [{ ...base.actors[0], actorMs: clock.actorMs }],
      causes: inbox
    };
  }

  const effect = create({ renderer: { device, format }, frameOwner: owner, session,
    readLiveInput: currentInput, volume: options.volume ?? 0.34 });

  function reportError(error) {
    lastError = errorText(error);
    if (typeof options.onError === 'function') options.onError(error);
    else console.error('luck-e preview:', error);
  }

  try {
    await effect.ready;
    await setupOnOwner(owner, async () => {
      const banned = inspectShaderWords(FIXTURE_WGSL);
      requireCondition(banned.length === 0, `fixture contains reserved identifiers: ${banned.join(', ')}`, Error);
      const module = device.createShaderModule({ code: FIXTURE_WGSL, label: 'luck-e: independent synthetic actor' });
      const info = await module.getCompilationInfo();
      const errors = info.messages.filter((message) => message.type === 'error');
      requireCondition(errors.length === 0, errors.map((m) => m.message).join('\n'), Error);
      fixturePipeline = await device.createRenderPipelineAsync({
        layout: 'auto', vertex: { module, entryPoint: 'fixtureVertex' },
        fragment: { module, entryPoint: 'fixtureFragment', targets: [{ format,
          blend: {
            color: { operation: 'add', srcFactor: 'one', dstFactor: 'one-minus-src-alpha' },
            alpha: { operation: 'add', srcFactor: 'one', dstFactor: 'one-minus-src-alpha' }
          }
        }] }, primitive: { topology: 'triangle-list' }
      });
    });
  } catch (error) {
    await effect.destroy();
    await owner.destroy();
    session.destroy();
    context.unconfigure();
    device.destroy();
    if (madeCanvas) canvas.remove();
    throw error;
  }

  // GPU setup time is not part of the first visual acquisition.
  clock = { ...clock, wallMs: performance.now() };

  function renderTick() {
    if (disposed) return;
    let frame = null;
    let fixtureBuffer = null;
    try {
      const input = currentInput();
      effect.sync(input);
      if (owner.available && input.surfaceVisible) {
        const colorView = context.getCurrentTexture().createView();
        frame = owner.beginFrame({ encoder: device.createCommandEncoder(), colorView,
          width: canvas.width, height: canvas.height, presenting: true });
        const skin = SYNTHETIC_SKINS[skinName];
        fixtureBuffer = mappedBuffer(device, new Float32Array([
          canvas.width, canvas.height, bodyWidthCss * dpr, bodyHeightCss * dpr,
          ...skin.skin, 1, ...skin.clothes, 1
        ]), BUFFER_UNIFORM, 'luck-e: synthetic host actor snapshot');
        const bindGroup = device.createBindGroup({ layout: fixturePipeline.getBindGroupLayout(0),
          entries: [{ binding: 0, resource: { buffer: fixtureBuffer } }] });
        const hostPass = frame.encoder.beginRenderPass({ colorAttachments: [{ view: colorView,
          loadOp: 'clear', storeOp: 'store', clearValue: { r: backdrop[0], g: backdrop[1], b: backdrop[2], a: 1 }
        }] });
        hostPass.setPipeline(fixturePipeline);
        hostPass.setBindGroup(0, bindGroup);
        hostPass.draw(6);
        hostPass.end();
        const receipt = effect.record(frame, input);
        const uploaded = fixtureBuffer;
        const submitted = owner.submit(frame);
        frame = null;
        fixtureBuffer = null;
        submitted.then((result) => {
          if (!result.submitted && !disposed) reportError(new Error(result.failure ?? 'submission failed'));
        }).catch(reportError).finally(() => uploaded.destroy());
        receipt.done.then((result) => {
          lastReceipt = result;
          if (typeof options.onReceipt === 'function') options.onReceipt(result);
        }).catch(reportError);
        inbox = [];
      }
    } catch (error) {
      if (frame) owner.abort(frame, errorText(error)).catch(reportError);
      fixtureBuffer?.destroy();
      reportError(error);
    }
    animationHandle = requestAnimationFrame(renderTick);
  }

  const controls = Object.freeze({
    canvas, device, frameOwner: owner, effect,
    get lastReceipt() { return lastReceipt; },
    get lastError() { return lastError; },
    get compilationMessages() { return effect.compilationMessages; },
    unlockAudio() { return effect.unlockAudio(); },
    trigger(meaning = 'luck') {
      requireCondition(!disposed, 'preview is destroyed', Error);
      tickClock();
      const cause = normalizeCause({ id: `preview-cause-${++causeOrdinal}`, playerId: 'preview-actor',
        startedActorMs: clock.actorMs, meaning });
      inbox = [...inbox, cause];
      return cause.id;
    },
    setRate(rate) {
      requireCondition(!disposed, 'preview is destroyed', Error);
      tickClock();
      clock = { ...clock, rate: finite(rate, 'preview rate', 0, 8) };
      effect.sync(currentInput());
    },
    setReducedMotion(value) {
      reducedMotion = flag(value, 'reducedMotion');
      effect.sync(currentInput());
    },
    setSkin(name) {
      requireCondition(SYNTHETIC_SKINS[name], 'unknown synthetic skin');
      skinName = name;
    },
    seek(ageActorMs) {
      // Isolated snapshot, not an authority-clock rewind: new room + new cause.
      finite(ageActorMs, 'preview age', -1000, 10000);
      tickClock();
      clock = { ...clock, rate: 0 };
      roomOrdinal += 1;
      inbox = [normalizeCause({ id: `preview-cause-${++causeOrdinal}`, playerId: 'preview-actor',
        startedActorMs: clock.actorMs - ageActorMs, meaning: 'luck' })];
      effect.sync(currentInput());
    },
    async destroy() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(animationHandle);
      canvas.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      await effect.destroy();
      await owner.destroy();
      session.destroy();
      context.unconfigure();
      device.destroy();
      if (madeCanvas) canvas.remove();
    }
  });

  function onPointer() {
    controls.unlockAudio().then(() => {
      if (disposed) return;
      if (clock.rate === 0) controls.setRate(1);
      controls.trigger();
    }).catch(reportError);
  }

  function onVisibility() {
    if (!disposed) {
      try { effect.sync(currentInput()); } catch (error) { reportError(error); }
    }
  }

  canvas.addEventListener('pointerdown', onPointer);
  document.addEventListener('visibilitychange', onVisibility);
  animationHandle = requestAnimationFrame(renderTick);
  return controls;
}

function completeDesignRecord(design) {
  const shared = design.VFX.layer_structure_contract;
  const details = {
    L1: {
      macro: '身体前面の太い結節と、三方向に連続する内部芯。',
      meso: '終端まで有限半径を持つ内部接続。',
      medium: 'PH1内の高密度受容芯。黄色の放射と不透明度を区別。'
    },
    L2: {
      macro: '非放射対称で連結された幅のある多室体積。',
      meso: '室ごとの奥行きと広い内部層密度。',
      medium: 'PH1の紫色体積。厚み・密度で透過が変わる。'
    },
    L3: {
      macro: '主室形状に追従する有限で薄い外側界面。',
      meso: '濃い内部と薄い領域の間を閉じた光学境界で接続。',
      medium: 'PH1界面の低光学密度。機械的な膜張力を捏造しない。'
    },
    L4: {
      macro: '外側から身体側へ進む広い励起前線。',
      meso: '場内の連続した明度差。別物体や粒子群を生成しない。',
      medium: 'PH1内部の放射分布変調。質量流や空気流ではない。'
    },
    L5: {
      macro: '主現象の周囲にだけ広がる有色の有限halo。',
      meso: '入力の有限境界に沿った減衰マスク。',
      medium: 'OBS1の画面上の拡散近似。世界内物質や独立光源ではない。'
    }
  };
  design.VFX.layers = design.VFX.layers.map((layer) => {
    const detail = details[layer.layer_id];
    const observing = layer.domain === 'observation';
    return {
      ...layer,
      spatial_structure: {
        ...shared.spatial_structure,
        macro: detail.macro,
        meso: detail.meso,
        anchor_and_transform: observing
          ? 'OBS1: 入力PH1の投影とclip領域へ束縛したscreenマスク。'
          : 'PH1: 対象身体の局所座標から共通world/camera/screen変換。',
        extent_orientation_depth: observing
          ? 'screen上の有限幅のみ。物理的厚み・接触・抗力はない。'
          : shared.spatial_structure.extent_orientation_depth
      },
      material_and_optics: {
        ...shared.material_and_optics,
        carrier_and_mechanism: detail.medium,
        model_refs: observing ? 'OBS1 / SamplingContract / IntensityBudget' : 'PH1.PhysicalModel / PH1.OctaDomain'
      },
      motion_and_phase: {
        ...shared.motion_and_phase,
        state_and_sampling_refs: observing ? 'OBS1.sampling_consequence / PH1 source history' : 'PH1.StateDynamics / SamplingContract'
      },
      integration: {
        ...shared.integration,
        failure_to_avoid: `${shared.integration.failure_to_avoid} この層では ${layer.loss_when_removed}`
      }
    };
  });
  delete design.VFX.layer_structure_contract;
  return deepFreeze(design);
}

/** B Foundation design record. Requirements below are NOT measured outcomes.
 * Scope is this E's declared field; existing host characters are not regenerated.
 * Rendering subdivisions of PH1 do not create new characters or gameplay events.
 */
export const B_DESIGN = completeDesignRecord({
  name: '収束房 / Confluence Chambers',
  foundation: 'B Foundation / attribute_resolved edition supplied in this conversation',
  extension: 'B Foundation / 多層VFX統合改訂 2026-09-23 / exact individual PostEffects',
  FoundationOperationTemplate: {
    OutputContract: { schema_version: 'B-Expression-2', mode: 'Video', operation: 'design_only' },
    scope: '実行コードの制作。実行時はホストが描画を起動する。画像生成APIではない。',
    APIExecutionCodeTemplate: 'not_applicable: WebGPU runtime, not formal image-generation Python',
    requirement_and_observation_separated: true
  },
  InferenceExpansionPolicy: {
    DeclaredIntent: {
      character_count: '追加0。原因ごとに既存取得キャラ1体へ束縛する。',
      character_attributes: '既存の人数・身体・スキン・姿勢を保持し、年齢・性別・役割を新規設定しない。',
      main_action: '幸運／直観を取得した身体と周囲に有限の現象が発生し、身体へ収束する。',
      main_objects: '独立原因ごとに連続した受容場1。芯と多室構造は同じ場の内部構成。',
      background: 'ホスト背景を保持。背景の色・模様をEのshader入力にしない。',
      style: '2Dゲームに合成する奥行きのある手続き的な有色体積。',
      text_logo_policy: 'E内の文字、ロゴ、UIアイコン、頭上マーカーは使用しない。'
    },
    ExpressionIntent: {
      source: 'user_declared',
      purpose: '幸運／直観の獲得が対象自身に帰属することを、体積と内向き輸送から読む。',
      must_communicate: ['対象の身体への帰属', '全可視区間の主現象', '芯・有色構造・薄い領域・移送・強い発光の分離'],
      preserve_ambiguity: [], allowed_omission: [], allowed_exaggeration: [],
      protected_relations: ['ゲーム効果非変更', '独立獲得の非統合', '原因ID再送で再開しない', '共有encoderを描画側でsubmitしない']
    },
    SelectionLifecycle: {
      stages: ['candidate', 'accepted', 'registered_world', 'registered_observation'],
      candidate_catalog_in_final_code: false,
      attribute_resolved_is_not_accepted_inference: true
    },
    inferred_support_elements: { default_permission: 'denied', allowed_domains: [] },
    attribute_resolution: '厚い受容芯、非放射対称の連続多室構造、紫の組織、黄色の芯、有限haloを既存目的の具体化として選択。'
  },
  ExtensionActivationTable: {
    KeywordExpansion: { enabled: false, reason: '制作指示の強い発光は登録語の強発光とは異なり、光芒一式を展開しない。' },
    VFX: { enabled: true, basis: 'explicit' },
    PostEffects: { enabled: true, basis: 'attribute_resolved', mode: 'exact_selected_operations' },
    LDM: { enabled: true, basis: 'explicit_VFX' },
    GradientAnchorPolicy: { enabled: true, basis: 'attribute_resolved' },
    VideoGenerationPolicy: { enabled: true, basis: 'actor-clock animation' },
    CharacterPolicy: { ownership: 'host', reason: '既存キャラ属性を変更しない。Eモジュールは人物を作成しない。' },
    BeautifulPoseCapsule: { ownership: 'host', reason: '身体姿勢・支持は既存ホストに属す。Eは関節・支持接点を捏造しない。' }
  },
  PhenomenonSystemTemplate: {
    PartitionPolicy: {
      criterion: '一つの原因から発生し同じ寿命と受容境界を持つ連続宣言場をPH1とする。',
      shared_condition_policy: '身体基準寸法、位置、可視性、権威actor時計を共有し、原因ごとの開始時刻を保持する。',
      no_discipline_based_split: true
    },
    SharedConditions: {},
    PhenomenonRegistry: {
      PH1: {
        id: 'PH1', name: '有限の幸運・直観受容場', origin: 'declared', anchor: 'body', visibility: 'visible',
        local_state_difference: '高密度の芯、有色体積、低密度境界、内向き励起に局所差を持つ。',
        partition_reason: '同一原因の連続した場であり、各層は内部・境界・応答の描画分担である。'
      }
    },
    PhenomenonBlock: {
      PH1: {
        identity: {
          id: 'PH1', name: '有限の幸運・直観受容場', origin: 'declared', anchor: 'body', visibility: 'visible',
          local_state_difference: '高密度の芯、有色体積、低密度境界、内向き励起に局所差を持つ。',
          partition_reason: '同一原因の連続した場であり、各層は内部・境界・応答の描画分担である。'
        },
        DeepStructure: {
          Core: '胴体前面の受容結節と三方向へ太く連なる内部芯。頭上の一点記号ではない。',
          Structure: '非放射対称の多室体積を連続結合し、前後断面と内部層密度を区別する。',
          Surface: '有限の体積境界と薄い膜。高密度の芯と同じ不透明度・時間応答を機械的に与えない。'
        },
        PhysicalModel: {
          model_kind: 'declared_fantasy',
          system_boundary: '対象身体の近傍に限定された非物質受容場。位置はホストの読取専用境界条件。',
          state_variables: 'actor-ms、圧縮率、励起前線の距離、光学的密度、放射色、被覆率。',
          inputs: '権威原因IDと開始actor時刻、現在のactor時刻、現在の身体変換。',
          balance_conditions: {
            mass: { status: 'not_applicable', balance_or_reason: '宣言場であり、物質・浮遊粒子の質量生成を主張しない。' },
            momentum: { status: 'not_applicable', balance_or_reason: 'キャラに機械力・推進・反力を付与しない。' },
            energy: { status: 'applicable', balance_or_reason: '描画モデルの吸収・透過は有限の正の光学量で積分する。放射供給は宣言された獲得場で、実測Wや実在燃料ではない。' },
            charge: { status: 'not_applicable', balance_or_reason: '電荷・電流・電磁相互作用を生成しない。' }
          },
          constitutive_response: '場の断面と局所密度から正の消散係数を得て、前から奥へ透過と放射を積分する。',
          initial_condition: '開始時から多室体積と芯が存在し、不透明度が立ち上がる。',
          boundary_conditions: '外側に有限境界、身体側に受容芯、頭部に保護領域。画面外では描画しない。',
          approximation_scope: '宣言場の可視化であり、物理的な幸運エネルギーの実証ではない。ホスト身体の実照明を再計算したとは主張しない。'
        },
        ScaleRegime: {
          characteristic_length: '基準身体高1.64mを100 CSS px/mで観測する設計例。実装は現在の身体高に比例する。',
          characteristic_time: '1.420 actor-s。壁時計との差はホストのactor時計が決定する。',
          dominant_balance: '大きい有色体積と太い芯を薄い境界・haloより優先し、後半も体積を残す。',
          dimensionless_reasoning: '局所位置/身体高、経過actor-ms/1420、芯半径/体積半径を用いる。物質流体のRe/Weは非該当。',
          detail_cutoff: '深度サンプル40/24と画面微分による境界幅。24 CSS px身体高未満は警告し、実寸可読性を保証しない。'
        },
        OctaDomain: {
          Thermo: { applicability: 'not_applicable', role: 'latent', items: ['燃焼・温度上昇・相変化を設定しない。'], evidence_or_constraint: '黄色の芯を実在温度や燃料の測定値としない。' },
          Fluid: { applicability: 'not_applicable', role: 'latent', items: ['移動するのは宣言場の励起であり、空気や水の輸送ではない。'], evidence_or_constraint: '空気抵抗、浮力、煙を追加しない。' },
          Optics: { applicability: 'applicable', role: 'primary', items: ['厚み・密度で透過率を変える。', '芯、組織、膜の放射量と不透明度を分離する。'], evidence_or_constraint: '前後断面、内部芯、有色の薄い領域を直接読む。' },
          Materials: { applicability: 'applicable', role: 'supporting', items: ['宣言場の構成応答として局所密度と多室トポロジーを保持する。'], evidence_or_constraint: '現実の粘性・弾性率は付与しない。' },
          Electromagnetics: { applicability: 'not_applicable', role: 'latent', items: ['帯電や導電の機構を設定しない。'], evidence_or_constraint: '光学表示を電磁場ソルバーの実施と偽らない。' },
          Rheology: { applicability: 'not_applicable', role: 'latent', items: ['圧縮は宣言場の状態変化で、実物質のクリープではない。'], evidence_or_constraint: '時間係数を粘弾性物性の実測値としない。' },
          WaveOptics: { applicability: 'not_applicable', role: 'latent', items: ['干渉・回折・薄膜位相を設定しない。'], evidence_or_constraint: '紫と黄色の空間差は指定した放射分布に属す。' },
          SurfaceScience: { applicability: 'not_applicable', role: 'latent', items: ['濡れ・付着・毛管現象を設定しない。'], evidence_or_constraint: '身体への帰属は物質の付着ではない。' }
        },
        PerceptualReadability: {
          direct_evidence: '太い芯、有色体積、薄い外縁、内向き前線、身体への収束。',
          indirect_evidence: '身体の移動と同じ座標変換で、受容芯が取得キャラへ追従する。',
          figure_ground_separation: 'high',
          edge_legibility: '芯の黄と組織の紫を広い面積で分離し、haloなしでも体積境界を残す。',
          perceptual_failure_risk: '縮小による黄と紫の融合、顔の遮蔽、後半の体積消失、重複時の過密。',
          cue_roles: [
            { cue: '連続して太い受容芯', supports: '対象への帰属', reliability_and_overlap: '身体アンカーとの一致が前提。位置追従と意味が一部重複する。' },
            { cue: '局所励起の内向き移動', supports: '取得と収束の時間関係', reliability_and_overlap: '静止画一枚で移動方向を確定しない。RMでは静的な集約勾配にする。' },
            { cue: '半透明領域から見える高密度芯', supports: '内部を持つ有限現象', reliability_and_overlap: '画面上で十分な身体寸法と色分離が必要。' }
          ],
          confusable_alternative: '煙だけ、装飾アイコン、身体から外へ放出する攻撃。',
          disambiguating_evidence: '輪郭だけでなく体積と芯を保持し、前線と室中心を受容位置へ集める。',
          viewing_conditions: '980×620 CSS px、身体124×164を基準。半分・四分の一、DPR1/1.5/2/3、複数スキンで観察する。'
        },
        GeometryConstraint: {
          surface_orientation: '身体局所座標をworld/camera変換に従ってスクリーンへ写す。',
          normal_field_coherence: '楕円体と連続結合の境界は一貫した陰関数に従う。',
          curvature_behavior: '幅のある多室体積。輪、薄帯、放射対称の星形を主形にしない。',
          silhouette_logic: '芯と体積の一体形状が最初から後半まで残る。',
          contact_relation: '非物質場のため機械的接触はなし。受容部は身体位置へ固定する。',
          spatial_relation: '固定の有限深度範囲を前から奥へ積分。顔の意味領域を合成で保護する。'
        },
        StateDynamics: {
          state_space_extent: '形成、取得、定着、消滅の単一原因内遷移。',
          transition_path_character: 'monotonic', local_stability_type: 'stable',
          convergence_behavior: '多室の中心が身体の受容部へ寄り、体積を保って透明になる。',
          damping_profile: '末尾340 actor-msの連続した光学的不透明度減衰。',
          oscillation_pattern: 'none', equilibrium_recovery: 'ゲーム身体の姿勢回復はホストが所有する。',
          transition_failure_risk: '壁時計で進める、再送で再開する、部屋復帰で再生する、末尾を粒子へ置換する。',
          driving_input: '現在actorMs - 原因startedActorMs。',
          response_timescale: '形成180、主取得740まで、定着1080まで、消滅1420まで。すべてactor-ms。',
          phase_relation: '芯は全可視相で存在し、移送前線は主作用で内側へ到達する。',
          stability_condition: '原因内容不変、actor時計単調、部屋インカーネーション一致。'
        },
        Couplings: {
          DominantCouplings: ['PH1.Materials -> PH1.Optics: 密度と厚みが局所透過・芯の露出・放射分布を変える。'],
          SecondaryCouplings: [],
          CausalAssessment: {
            intervention: '原因とactor時刻を保持し、身体変換だけを変える。別比較ではhaloだけを無効化する。',
            predicted_response: '身体移動時は全現象が追従。halo除去時は広がりだけが減り、芯と有色体積は残る。',
            competing_explanation: '背景変更やカメラ変更による見え方の差と、場自体の変化を区別する。',
            uncertainty: '実ゲームスキン、実GPU、表示サイズ、音響出力の観察が別途必要。',
            check_status: 'hypothesis_only', evidence_refs: []
          }
        },
        CausalityLinks: {
          physical_influence: [],
          observation_dependency: [
            { source: 'OBS1', target: 'PH1', basis: '有限haloは受容場の形態・放射分布を入力にする。' },
            { source: 'OBS2', target: 'PH1', basis: '主体積を画素に積分して色と被覆率を出力する。' },
            { source: 'OBS2', target: 'OBS1', basis: 'haloの上へ有色体積を合成する。' }
          ],
          gaze_path: []
        },
        Evidence: {
          direct: ['連続体積', '有色密度差', '内部芯', '薄い境界', '集約する前線'],
          indirect: ['キャラ移動に対する身体相対位置の保持'], candidates: []
        },
        SurroundingChanges: {
          entries: [{ target: '既存身体の読取専用アンカー', change: '対象への帰属を画面上で示す。ゲーム状態・身体形状・背景は変更しない。' }],
          latent_reference_target: 'none'
        },
        VisualProjection: {
          role: 'essential', world_state_ref: 'PH1.DeepStructure / PH1.StateDynamics',
          retained_cues: ['太い芯', '有色体積', '薄い外縁', '身体への収束'],
          simplification: '深度サンプルを負荷に応じて減らすが、形状の式や原因数を変えない。',
          omission_scope: [], exaggeration_scope: [], ambiguity_scope: [],
          intent_ref: 'InferenceExpansionPolicy.ExpressionIntent'
        },
        BeautyStructureApplication: {
          conform_to: 'PlatonicGoodTemplate.BeautyStructuring', target_policy: 'standard',
          adjustment_reason: 'not_applicable',
          axes: {
            contrast: ['黄色の芯と紫の厚い領域', '高密度内部と低密度の薄い境界'],
            ratio_proportion: ['身体高に比例した有限範囲', '芯の太さと多室体積の厚さの差']
          }
        },
        GTBConnections: {
          Good: '取得対象と描画対象を一致させ、ゲームの意味を変更しない。',
          Truth: '権威ID、actor時計、座標、提出、可視query、音を別々に追跡する。',
          Beauty: '光だけでなく、芯・色・厚み・抜けを分ける。'
        },
        AcceptanceCriteria: {
          full_structure_present: true, all_8_domains_present: true,
          visibility_specific_evidence_present: true, physical_and_observation_links_not_mixed: true,
          physical_model_scale_and_response_consistent: true,
          perceptual_cues_and_identifiability_limits_explained: true,
          causal_assessment_status_matches_evidence: true
        },
        FailurePatterns: ['glow_only', 'particle_only_tail', 'head_marker', 'white_blob', 'clock_rewind', 'unsubmitted_audio']
      }
    }
  },
  CoordinateGravityWindTemplate: {
    WorldApplicability: { status: 'applicable', reason: '既存身体へ束縛された非物質の有限場。' },
    Units: { length: 'm', time: 'actor s; host wall ms tracked separately', temperature: 'K', pressure: 'Pa', angle: 'rad' },
    WorldCoordinates: { handedness: 'right_handed', X: 'right_positive', Y: 'up_positive', Z: 'backward_positive', camera_forward: 'negative_Z', origin: 'host_scene_origin' },
    CameraCoordinates: { X: 'right_positive', Y: 'up_positive', forward: 'negative_Z', projection: 'orthographic', FOV_or_scale: 'camera.cssPixelsPerWorldUnit * camera.zoom' },
    ScreenCoordinates: { domain: '[0,1]x[0,1]', x: '0_left_to_1_right', y: '0_top_to_1_bottom' },
    TransformChain: { order: ['world', 'camera', 'screen'], world_to_camera: 'camera位置とangleRadによる剛体変換。', camera_to_screen: 'CSS倍率からDPRで物理画素へ写像する。' },
    ContactCoordinates: { contact_patch: 'none', contact_normal: 'none', support_relation: 'not_applicable', no_penetration: true },
    VectorField: {
      dominant_vector: { direction: '場の各室から身体の受容部へ', magnitude: 'temporalState.compression', falloff: 'finite chamber extent', fluctuation: 'none' },
      secondary_vector: { direction: '内部励起の内向き移送', magnitude: 'temporalState.flowRadius', falloff: 'bounded Gaussian front', fluctuation: 'none' }
    },
    Gravity: {
      condition: 'normal', vector: [0, -9.80665, 0], strength: '設計例の仮定。Eの機械的重力結合は0。ホスト重力を設定・変更しない。',
      affected_responses: '物質的質量なしの宣言場なので、Eの弾道・落下は非該当。',
      evidence: '身体アンカーに追従し、重力落下の粒子へ分解しない。ホストの異なる重力条件にもEの力学は干渉しない。'
    },
    WindCapsule: {
      required: true, medium_state: 'air',
      medium_properties: { density: '設計例の静穏空気。未測定で、コードの入力・力学には使わない。', viscosity: '未測定。非物質Eへの抗力は非該当。' },
      Field: { direction: [0, 0, 0], speed: '0 m/s (design example)', gust: 'none', shear: 'none', turbulence: 'none' },
      ApplicableResponses: { body: 'host-owned; E does not apply force', cloth: 'not_applicable', hair: 'not_applicable', loose_elements: 'none', environment: 'Eに媒体輸送なし。真空・水中のホストにも架空の空気抵抗を加えない。' },
      non_applicable_responses_explicit: true
    }
  },
  PEMTemplate: {
    Mode: { phenomenon_equality: true, focus_phenomenon: 'none' },
    CausalMesh: {
      physical_mesh_required: false, reason: 'E所有範囲は1PHで、初期・有限境界・入力によって成立する。',
      gaze_target_policy: 'standard', adjustment_reason: 'not_applicable',
      gaze_path_A: '右上の高い室から内部芯を通って胴体の受容部へ。',
      gaze_path_B: '左下の広い薄領域から有色体積の密度差を通って身体へ。'
    },
    AttentionControl: { attention_focus: 'hierarchical', single_requires_explicit_request: true }
  },
  ObservationIntegrationTemplate: {
    ObservationRegistry: {
      OBS1: {
        operation_type: 'posteffect', input_references: ['PH1'],
        target_mask: '場の陰関数から最大0.235身体高の有限拡散。頭部とclip外を除く。',
        stage: 'world_render_observation', composite_method: 'alpha_blend',
        intensity: '最大alpha0.39×時間包絡×有限減衰。背景非依存。',
        protected_regions: ['head', 'clip exterior'],
        output_consequence: '強い色付き周辺発光。主形状を生成しない。', dependencies: ['PH1'],
        sampling_consequence: '主描画と同じ物理解像度。負荷時はhalo強度を先に低減する。'
      },
      OBS2: {
        operation_type: 'other', input_references: ['PH1', 'OBS1', 'display_condition'],
        target_mask: '対象のviewport、clip領域、頭部保護。', stage: 'display', composite_method: 'alpha_blend',
        intensity: '体積被覆率×時間包絡。色は有限の露出圧縮を経てpremultiplied over合成。',
        protected_regions: ['head', 'clip exterior', 'hidden actor'],
        output_consequence: '芯と有色体積を表示し、重複獲得を無制限な白加算にしない。',
        dependencies: ['PH1', 'OBS1', 'display_condition'],
        sampling_consequence: 'DPRは画素変換でありCSS寸法を変えない。画面微分で境界の足場を調整する。'
      }
    },
    SamplingContract: {
      output_resolution: 'round(cssWidth*dpr) × round(cssHeight*dpr)',
      intended_display_scale: '980×620、身体124×164 CSS pxを基準に1/2・1/4も観察。',
      spatial_detail_policy: '厚み・芯・広い色領域が主。高周波粒子・grainはない。',
      temporal_sampling: 'host cadence。状態はactor時計。独自frame rateや未指定露光積分を加えない。',
      filter_and_resample_policy: 'fwidthによる境界調整。低解像度のラスターE素材や2D転送は使わない。'
    },
    IntensityBudget: {
      global_observation_budget: '有限の身体近傍のみ。彩度のある主形と周辺発光を分離。',
      glow: '強い発光という明示目的に合わせた、有限alphaの有色halo。',
      protected_region_priority: 'highest', intentional_departures: []
    },
    CompositeValidation: {
      contour_preserved: 'not_tested', highlight_clipping: 'not_tested', shadow_crushing: 'not_tested',
      chroma_displacement: 'not_tested', fine_detail_retention: 'not_tested', protected_background_preserved: 'not_tested'
    }
  },
  ExtremumDesignColorTemplate: {
    PEV: { candidate_state_set: ['selected-continuous-chambers'], selected_physics_extremum: 'selected-continuous-chambers', reason: '主作用後も連続体積と受容芯が残る。' },
    AES: { selected_from_PEV_only: true, selected_aesthetic_extremum: 'selected-continuous-chambers', visual_circulation: '多室から受容芯へ', asymmetric_balance: '非放射対称の室厚み', tension_release: '広がりから定着へ', body_environment_consonance: '身体への追従と顔の抜け' },
    DesignScience: { VisualHierarchy: '芯→有色体積→薄膜→halo', DensityPlan: '受容側は厚く、外縁は薄く、頭部は空ける。', ShapeOrder: '非放射対称の連続多室', OrnamentFunction: '独立装飾なし' },
    CCM: {
      Palette: { base: 'violet', secondary: 'magenta-lavender', accent: 'saturated lemon yellow', neutral: 'transparent negative space' },
      ColorDynamics: { temp: 'mixed', value_range: '有色中明部と明るい芯', saturation: '高いが白への無制限加算を避ける' },
      Lighting: { key_K: 'not_applicable: declared field emission, not blackbody', fill_tint: '場の色を参照' },
      BackgroundBinding: { bg_dominant: 'host-owned, never sampled to correct E', bg_accent: 'unchanged' },
      PerceptualControl: { attention_focus: 'hierarchical', figure_ground_stability: 'high', arousal_level: 'mid', perceptual_noise_tolerance: 'low' }
    }
  },
  ReflectionClosureTemplate: {
    ReflectionClosureBlock: {}, reason: '輝きは場の放射であり、実在表面の鏡面反射やLensFlareではない。'
  },
  PhenomenonProfileTemplate: {
    ApplicabilityGuide: { selections: [] }, Profiles: {},
    reason: '水・布・炎・金属・反応等の物質profileを非物質宣言場へ強制しない。'
  },
  VFX: {
    trigger: 'explicit', world_registration: 'PhenomenonSystemTemplate.PhenomenonRegistry',
    observation_registration: 'ObservationIntegrationTemplate.ObservationRegistry',
    design_intent: {
      subject_and_action: '既存の取得身体へ収束する有限場', expression_intent_ref: 'InferenceExpansionPolicy.ExpressionIntent',
      primary_read: '厚い体積が身体に帰属し、全可視相で芯を保つ', layering_basis: '内部・体積・界面・移送・観測で固有機能を分ける。'
    },
    layers: [
      { layer_id: 'L1', role: 'primary_form', domain: 'world', PH_refs: ['PH1'], OBS_refs: [], selection: { basis: 'attribute_resolved', scope_and_reason: '明示された芯を太い受容結節として具体化。' }, function_and_visible_result: '身体側に黄色の太い内部芯。', loss_when_removed: '何が身体に定着するのかという帰属が弱まる。', implementation: 'nucleusDistance / scene.layers.x' },
      { layer_id: 'L2', role: 'internal_structure', domain: 'world', PH_refs: ['PH1'], OBS_refs: [], selection: { basis: 'attribute_resolved', scope_and_reason: '主形と有色構造を連続多室体積として具体化。' }, function_and_visible_result: '幅と厚みを持つ紫の構造が残る。', loss_when_removed: '太さ・奥行き・有色の主面積が失われ、芯だけになる。', implementation: 'chamberDistance / scene.layers.y' },
      { layer_id: 'L3', role: 'boundary', domain: 'world', PH_refs: ['PH1'], OBS_refs: [], selection: { basis: 'attribute_resolved', scope_and_reason: '薄い領域を局所密度の小さい界面として具体化。' }, function_and_visible_result: '厚い内部に対して薄い紫紅の境界が読める。', loss_when_removed: '厚い内部と外部の間の薄い遷移が弱まる。', implementation: 'membrane / scene.layers.z' },
      { layer_id: 'L4', role: 'transport', domain: 'world', PH_refs: ['PH1'], OBS_refs: [], selection: { basis: 'attribute_resolved', scope_and_reason: '内向きの励起移送を連続場内に置く。' }, function_and_visible_result: '粒子を放出せずに取得方向が動きから読める。', loss_when_removed: '静的な付随物と取得現象を区別する時間的手掛かりが減る。', implementation: 'movingFront / scene.layers.w' },
      { layer_id: 'L5', role: 'observation_support', domain: 'observation', PH_refs: [], OBS_refs: ['OBS1'], selection: { basis: 'attribute_resolved', scope_and_reason: '明示された強い発光の観測上の広がり。' }, function_and_visible_result: '有限で有色の周辺光を持つ。', loss_when_removed: '光の周辺への広がりだけが減る。芯と主形は残る。', implementation: 'fragmentHalo / scene.post.x' }
    ],
    layer_structure_contract: {
      spatial_structure: { anchor_and_transform: 'L1-L4は身体の共通world/camera変換、L5は同じ場を参照するscreenマスク。', extent_orientation_depth: '有限の室体積と固定深度積分。観測haloには機械的厚みを付与しない。', macro: '連続多室と身体への受容部', meso: '太い芯と内部層密度', micro: '画面微分で調整する境界。独立した微粒子なし。', edge_and_occlusion: '前から奥への体積透過と、頭部・clip保護。' },
      material_and_optics: { carrier_and_mechanism: '非物質宣言場の放射と透過', emission_opacity_density: '別変数として積分', color_and_light_response: '共有CCMに従う固定放射色', model_refs: 'PH1.PhysicalModel / PH1.OctaDomain.Optics / OBS1' },
      motion_and_phase: { driver_and_transport: '原因のactor時計と身体への内向き圧縮', distribution_and_correlation: '連続体積内の密度差であり粒子集団ではない', onset_peak_decay: 'TemporalTableを参照', state_and_sampling_refs: 'PH1.StateDynamics / SamplingContract' },
      integration: { composite_and_mask: 'L5を先に、L1-L4の主描画を後にpremultiplied over。', protected_cues: '身体への帰属、芯、頭部の抜け、独立原因数。', failure_to_avoid: '白い塊、haloだけ、末尾粒子だけ、頭上アイコン。' }
    },
    interlayer_links: [
      { source_layer: 'L5', target_layer: 'L2', relation_type: 'observation_dependency', mechanism_and_consequence: '体積の有限境界がhaloの範囲を決める。', foundation_binding: 'OBS1 -> PH1' },
      { source_layer: 'L1', target_layer: 'L2', relation_type: 'visual_relation', mechanism_and_consequence: '黄色の太い芯が紫の体積越しに読める。', foundation_binding: 'PH1.PerceptualReadability' },
      { source_layer: 'L4', target_layer: 'L1', relation_type: 'visual_relation', mechanism_and_consequence: '励起前線の到達先を受容芯が示す。', foundation_binding: 'PH1.StateDynamics' }
    ],
    causal_path: { input: '権威原因とactor時計', carrier_PH: 'PH1', receiver: '既存身体の非機械的受容境界。ゲーム効果はホストが所有。', ScaleRegime_ref: 'PH1.ScaleRegime', StateDynamics_ref: 'PH1.StateDynamics', ReactivePhaseChange_ref: 'not_applicable: no reaction or phase change' },
    orchestration: { common_time_basis: 'actor clock', layer_phase_relations: '芯は常在、前線は取得相、全体は末尾に透明化', environment_response: '身体への座標追従のみ。背景やスキンの実照明変更は主張しない。', visual_hierarchy: '厚い色面・芯・薄膜・haloを分離', bullet_time: 'not_applicable: acceleration is host actor time, not an added cinematic effect' },
    output_integration: { budget_ref: 'ObservationIntegrationTemplate.IntensityBudget', sampling_contract_ref: 'ObservationIntegrationTemplate.SamplingContract', LDM_ref: 'LuminanceDynamicsModule', composite_order: 'OBS1 then OBS2', color_alpha_contract: 'linear/srgb attachment contract; premultiply once', scale_adaptation: '深度40から24へ。主形と原因数を保持。' },
    validation_plan: { layer_checks: 'inspect toggles for each selected layer', composite_checks: '体積・色分離・顔保護・clip外不変', temporal_checks: 'TEST_TIMES / allActorMilliseconds / rate changes', actual_results_ref: 'runGpuProbe return value, not a prefilled pass' }
  },
  PostEffects: {
    trigger: { ordinary_posteffects: false, beta_targets: [] },
    selection: { mode: 'exact_selected_operations', scope_resolution: 'attribute_resolved_target_and_scope', exact_selected_operations: ['finite_source_bound_halo'] },
    local_posteffects: { applies: true, targets: ['PH1 extent'], exact_OBS_operations: ['finite_source_bound_halo'], OBS_refs: ['OBS1'] },
    global_posteffects: { applies: false, exact_OBS_operations: [], OBS_refs: [] }
  },
  LuminanceDynamicsModule: {
    trigger: { explicit_VFX: true, explicit_PostEffects: false, inferred_requires_luminance_dynamics: false },
    target_metrics: { target_size: 'body-relative', camera_distance: 'host orthographic scale', screen_occupancy: 'computed finite bounds', readability_priority: 'high' },
    Video: { temporal_envelope: 'temporalState.opacity', micro_variation: 'none', anti_flicker: 'no strobing or high-frequency modulation' },
    budget_ref: 'ObservationIntegrationTemplate.IntensityBudget', sampling_contract_ref: 'ObservationIntegrationTemplate.SamplingContract',
    AlphaBackground: { enabled: false, required_background_if_enabled: '#000000' }
  },
  GradientAnchorPolicy: { trigger: 'attribute_resolved', gradient_type: 'world_VFX_gradient', anchor: 'PH1 emission and density fields' },
  TemporalTable: [
    { beginActorMs: 0, endActorMs: 180, state: '幅と厚みのある芯・多室体積が立ち上がる。' },
    { beginActorMs: 180, endActorMs: 740, state: '有色構造内で励起前線が身体側へ進む。' },
    { beginActorMs: 740, endActorMs: 1080, state: '室中心と芯が身体へ寄り、定着を読む。' },
    { beginActorMs: 1080, endActorMs: 1420, state: '連続体積を保持して透明化。粒子だけへ置換しない。' }
  ],
  VideoGenerationPolicy: {
    Mode: 'Video', Duration: { source: 'user_declared', seconds: 1.42, time_basis: 'actor clock' },
    Style: 'procedural volumetric 2D-game composite', dataclass_forbidden: true,
    timeline: { unit: 'actor seconds', tracks: { PH: ['PH1: 0..1.420'], OBS: ['OBS1, OBS2: 0..1.420'], camera: ['host-owned'], audio: ['submitted visible receipt only; at most 0.360 actor-s and capped to remaining life'], dialogue: [] } },
    ContinuityLedger: { characters: 'existing playerId', costumes: 'host-owned', light_sources: 'PH1', objects: 'one field per cause', contacts: 'no mechanical contacts introduced' }
  },
  GlobalAcceptanceTemplate: {
    ValidationResults: {
      StructuralInspection: { status: 'not_run', reason: '完全なB機械検証器を実行したとの主張はしない。' },
      SemanticReconciliation: { status: 'not_run', reason: 'ホスト身体・世界条件・実ゲームイベントとの照合が必要。' },
      RenderObservation: { status: 'not_run', evidence_source: 'none; execute runGpuProbe / actual host review' }
    },
    OutcomeEvaluation: {
      intent_alignment: { status: 'not_run', evidence_refs: [] },
      artistic_effect: { status: 'not_run', evidence_refs: [] }
    },
    ComparativeEvaluation: { status: 'not_run', evidence: 'none' },
    FinalStatus: { specification_status: 'Warning', render_status: 'NotRun', failure_reasons: [] }
  }
});

/** Host-side acceptance checklist; no entry asserts execution or success. */
export const ACCEPTANCE = deepFreeze([
  { id: 'gpu-compile', requirement: 'Await ready; inspect every WGSL message and both pipelines on the deployment GPU.', status: 'not_run' },
  { id: 'all-times', requirement: 'Render allActorMilliseconds(), boundary-neighbor times and intermediate fractional times; observe the main volume until disappearance.', status: 'not_run' },
  { id: 'scale-skin', requirement: '980x620 CSS; 124x164 actor, half/quarter sizes; DPR1/1.5/2/3; real light/dark/chromatic skins.', status: 'not_run' },
  { id: 'layer-removal', requirement: 'Toggle each inspect layer; removing glow must preserve the thick core and colored volume.', status: 'not_run' },
  { id: 'actor-clock', requirement: 'Normal, accelerating, decelerating, paused and resumed actor clocks; expire at 1420 actor-ms, not wall-ms.', status: 'not_run' },
  { id: 'reduced-motion', requirement: 'No moving front or geometry contraction; retain directional structure, color, core and slow opacity envelope.', status: 'not_run' },
  { id: 'authority', requirement: 'Wire real gain-luckBoost/intuition authority events; E must not write probabilities, idea progress or buff lifetime.', status: 'not_run' },
  { id: 'same-id', requirement: 'Resends never restart animation or SFX. Changed contents quarantine the cause. Different IDs remain independent.', status: 'not_run' },
  { id: 'submit-proof', requirement: 'Record alone, abort, validation failure, query zero, offscreen and foreign receipts cannot play SFX.', status: 'not_run' },
  { id: 'late-audio', requirement: 'A locked/hidden receipt cannot be replayed later; an unclaimed live cause needs a fresh submitted visible receipt.', status: 'not_run' },
  { id: 'lifecycle', requirement: 'Room changes invalidate pending sound; returning does not revive retired causes; reuse the session through GPU recreation.', status: 'not_run' },
  { id: 'background', requirement: 'Changing only the host background must not change E shader uniforms, geometry or palette. Review the resulting contrast separately.', status: 'not_run' },
  { id: 'resources', requirement: 'One shared encoder submission by its owner; isolated frame snapshots; release buffers after completion/abort; preserve host device.', status: 'not_run' },
  { id: 'audio-review', requirement: 'Listen on actual output hardware for clicks, level, crowding and meaning; scheduled does not prove audible.', status: 'not_run' }
]);

export default Object.freeze({
  VERSION, LIFETIME_ACTOR_MS, WGSL, B_DESIGN, ACCEPTANCE,
  create, createFrameOwner, createSession, plan, temporalState,
  authorityLuckCause, advanceActorClock, testInput, TEST_TIMES,
  TEST_RATES, TEST_DPRS, TEST_BODY_SIZES, allActorMilliseconds,
  inspectShaderWords, runGpuProbe, mountTest, SYNTHETIC_SKINS
});
