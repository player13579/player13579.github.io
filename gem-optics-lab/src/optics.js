/**
 * Small, dependency-free optics/geometry module shared by the renderer and tests.
 * Wavelengths are expressed in micrometres; all geometry is in model units.
 */

const FRAUNHOFER = Object.freeze({
  F: 0.48613,
  d: 0.58930,
  C: 0.65627,
});

export const RGB_WAVELENGTHS = Object.freeze([0.610, 0.550, 0.460]);

// The renderer intentionally treats birefringent gems as isotropic, using a
// representative visible-light index. Absorption is an artistic-scale Beer-
// Lambert coefficient, rather than a claim about a particular mined specimen.
export const GEM_MATERIALS = Object.freeze({
  diamond: Object.freeze({
    name: 'Diamond',
    ior: 2.417,
    abbe: 55.3,
    absorption: Object.freeze([0.018, 0.025, 0.040]),
  }),
  sapphire: Object.freeze({
    name: 'Sapphire',
    ior: 1.765,
    abbe: 72.2,
    absorption: Object.freeze([1.55, 0.40, 0.045]),
  }),
  emerald: Object.freeze({
    name: 'Emerald',
    ior: 1.580,
    // Cauchy-equivalent Vd derived from the conventional gemological B-G
    // dispersion 0.014 (686.7–430.8 nm), rather than treating B-G as F-C.
    abbe: 70.9,
    gemologicalDispersionBG: 0.014,
    absorption: Object.freeze([0.72, 0.055, 0.82]),
  }),
  ruby: Object.freeze({
    name: 'Ruby',
    ior: 1.765,
    abbe: 72.2,
    absorption: Object.freeze([0.025, 1.05, 1.42]),
  }),
});

export function clamp(value, low, high) {
  return Math.min(high, Math.max(low, value));
}

export function dot3(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function length3(v) {
  return Math.hypot(v[0], v[1], v[2]);
}

export function normalize3(v) {
  const length = length3(v);
  if (length < 1e-14) throw new RangeError('Cannot normalize a zero vector');
  return [v[0] / length, v[1] / length, v[2] / length];
}

export function reflectVector(incident, normal) {
  const scale = 2 * dot3(incident, normal);
  return [
    incident[0] - scale * normal[0],
    incident[1] - scale * normal[1],
    incident[2] - scale * normal[2],
  ];
}

/**
 * Snell refraction for unit vectors.
 * `normal` points back into the incident medium, so dot(incident, normal) <= 0.
 * Returns null under total internal reflection.
 */
export function snellRefract(incident, normal, nIncident, nTransmitted) {
  if (!(nIncident > 0 && nTransmitted > 0)) {
    throw new RangeError('Refractive indices must be positive');
  }
  const I = normalize3(incident);
  let N = normalize3(normal);
  if (dot3(I, N) > 1e-12) N = N.map((component) => -component);
  const cosIncident = clamp(-dot3(I, N), 0, 1);
  const eta = nIncident / nTransmitted;
  const discriminant = 1 - eta * eta * (1 - cosIncident * cosIncident);
  if (discriminant < 0) return null;
  const factor = eta * cosIncident - Math.sqrt(Math.max(0, discriminant));
  return normalize3([
    eta * I[0] + factor * N[0],
    eta * I[1] + factor * N[1],
    eta * I[2] + factor * N[2],
  ]);
}

/** Exact unpolarized Fresnel power reflectance for two lossless dielectrics. */
export function dielectricFresnel(cosIncident, nIncident, nTransmitted) {
  if (!(nIncident > 0 && nTransmitted > 0)) {
    throw new RangeError('Refractive indices must be positive');
  }
  const ci = clamp(Math.abs(cosIncident), 0, 1);
  const eta = nIncident / nTransmitted;
  const sinTransmittedSq = eta * eta * Math.max(0, 1 - ci * ci);
  if (sinTransmittedSq >= 1) {
    return { reflectance: 1, tir: true, cosTransmitted: 0 };
  }
  const ct = Math.sqrt(Math.max(0, 1 - sinTransmittedSq));
  const rsNumerator = nIncident * ci - nTransmitted * ct;
  const rsDenominator = nIncident * ci + nTransmitted * ct;
  const rpNumerator = nTransmitted * ci - nIncident * ct;
  const rpDenominator = nTransmitted * ci + nIncident * ct;
  const rs = rsNumerator / rsDenominator;
  const rp = rpNumerator / rpDenominator;
  return {
    reflectance: clamp(0.5 * (rs * rs + rp * rp), 0, 1),
    tir: false,
    cosTransmitted: ct,
  };
}

/** Cauchy A+B/lambda^2 fitted to n_d and Abbe V_d. */
export function cauchyCoefficients(ior, abbe) {
  if (!(ior > 1 && abbe > 0)) throw new RangeError('Invalid IOR or Abbe number');
  const spread = (ior - 1) / abbe;
  const inverseF = 1 / (FRAUNHOFER.F * FRAUNHOFER.F);
  const inverseC = 1 / (FRAUNHOFER.C * FRAUNHOFER.C);
  const B = spread / (inverseF - inverseC);
  const A = ior - B / (FRAUNHOFER.d * FRAUNHOFER.d);
  return { A, B };
}

export function refractiveIndexAt(wavelength, material, dispersionScale = 1) {
  if (!(wavelength > 0)) throw new RangeError('Wavelength must be positive');
  const resolved = typeof material === 'string' ? GEM_MATERIALS[material] : material;
  if (!resolved) throw new RangeError(`Unknown gemstone material: ${material}`);
  const { A, B } = cauchyCoefficients(resolved.ior, resolved.abbe);
  const dispersed = A + B / (wavelength * wavelength);
  return resolved.ior + (dispersed - resolved.ior) * clamp(dispersionScale, 0, 2);
}

export function refractiveIndicesRGB(material, dispersionScale = 1) {
  return RGB_WAVELENGTHS.map((wavelength) =>
    refractiveIndexAt(wavelength, material, dispersionScale));
}

export function beerLambert(absorption, distance) {
  if (!(distance >= 0)) throw new RangeError('Distance cannot be negative');
  return absorption.map((coefficient) => Math.exp(-Math.max(0, coefficient) * distance));
}

const DEG = Math.PI / 180;

function ellipseSupport(nx, ny, aspectX, aspectY) {
  return Math.hypot(aspectX * nx, aspectY * ny);
}

function plane(normal, distance, group, facetIndex, optical = true) {
  return Object.freeze({
    normal: Object.freeze(normal),
    distance,
    group,
    facetIndex,
    optical,
  });
}

function pointOnRing(radius, azimuth, z) {
  return [radius * Math.cos(azimuth), radius * Math.sin(azimuth), z];
}

function planeThroughPoints(a, b, c, group, facetIndex, optical = true) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  let normal = normalize3([
    ab[1] * ac[2] - ab[2] * ac[1],
    ab[2] * ac[0] - ab[0] * ac[2],
    ab[0] * ac[1] - ab[1] * ac[0],
  ]);
  let distance = dot3(normal, a);
  if (distance < 0) {
    normal = normal.map((component) => -component);
    distance = -distance;
  }
  return plane(normal, distance, group, facetIndex, optical);
}

function addAngledFamily(target, {
  count, phase = 0, angle, radiusAtAnchor, anchorZ, downward = false,
  group, optical = true,
}) {
  const inclination = angle * DEG;
  const horizontal = Math.sin(inclination);
  const vertical = Math.cos(inclination) * (downward ? -1 : 1);
  for (let index = 0; index < count; index += 1) {
    const azimuth = (phase + (index * 360) / count) * DEG;
    const radius = typeof radiusAtAnchor === 'function'
      ? radiusAtAnchor(azimuth)
      : radiusAtAnchor;
    const normal = [
      horizontal * Math.cos(azimuth),
      horizontal * Math.sin(azimuth),
      vertical,
    ];
    target.push(plane(
      normal,
      horizontal * radius + vertical * anchorZ,
      group,
      index,
      optical,
    ));
  }
}

function regularGirdle(count, aspectX = 1, aspectY = 1, phase = 0, inscribed = false) {
  const planes = [];
  for (let index = 0; index < count; index += 1) {
    const azimuth = phase * DEG + (index * Math.PI * 2) / count;
    const nx = Math.cos(azimuth);
    const ny = Math.sin(azimuth);
    const polygonScale = inscribed ? Math.cos(Math.PI / count) : 1;
    planes.push(plane(
      [nx, ny, 0],
      ellipseSupport(nx, ny, aspectX, aspectY) * polygonScale,
      'girdle',
      index,
      false,
    ));
  }
  return planes;
}

function radialBoundary(azimuth, outlinePlanes) {
  const direction = [Math.cos(azimuth), Math.sin(azimuth), 0];
  let radius = Infinity;
  for (const side of outlinePlanes) {
    const projection = dot3(side.normal, direction);
    if (projection > 1e-12) radius = Math.min(radius, side.distance / projection);
  }
  return radius;
}

function buildBrilliant() {
  // Diameter is 2 model units. These proportions describe an idealized modern
  // round brilliant: 53.4% table, 16% crown, 42.9% pavilion and 2% girdle.
  const planes = [];
  const crownAngle = 34.5;
  const pavilionAngle = 40.75;
  const tableZ = 0.340;
  const girdleTop = 0.020;
  const girdleBottom = -0.020;
  // Sixteen girdle sides are the minimum exact representation of the standard
  // arrangement: each upper/lower half then meets one full girdle edge without
  // inserting false vertices into its triangular optical facet.
  const girdle = regularGirdle(16, 1, 1, 11.25, true);
  const boundary = (azimuth) => radialBoundary(azimuth, girdle);

  // A bezel plane meets the table at each of its eight vertices. Adjacent star
  // planes bound the table edges; their 50% meetpoint fixes the star angle.
  const crownRadians = crownAngle * DEG;
  const bezelDistance = Math.sin(crownRadians) + Math.cos(crownRadians) * girdleTop;
  const tableVertexRadius = (bezelDistance - Math.cos(crownRadians) * tableZ)
    / Math.sin(crownRadians);
  const tableApothem = tableVertexRadius * Math.cos(22.5 * DEG);
  const starApexRadius = tableApothem + 0.50 * (1 - tableApothem);
  const starApexZ = (bezelDistance
    - Math.sin(crownRadians) * starApexRadius * Math.cos(22.5 * DEG))
    / Math.cos(crownRadians);
  const starAngle = Math.atan2(tableZ - starApexZ, starApexRadius - tableApothem) / DEG;

  planes.push(plane([0, 0, 1], tableZ, 'table', 0));
  addAngledFamily(planes, {
    count: 8, phase: 0, angle: starAngle,
    radiusAtAnchor: tableApothem, anchorZ: tableZ, group: 'star',
  });
  addAngledFamily(planes, {
    count: 8, phase: 22.5, angle: crownAngle,
    radiusAtAnchor: boundary, anchorZ: girdleTop, group: 'bezel',
  });
  // Each upper half contains the star apex and a 22.5° girdle chord. Solving the
  // plane from those meetpoints keeps stars triangular and bezels kite-shaped.
  const upperChordSupport = Math.cos(11.25 * DEG);
  const upperAngle = Math.atan2(
    starApexZ - girdleTop,
    upperChordSupport * (1 - starApexRadius),
  ) / DEG;
  addAngledFamily(planes, {
    count: 16, phase: 11.25, angle: upperAngle,
    radiusAtAnchor: upperChordSupport, anchorZ: girdleTop, group: 'upperGirdle',
  });
  planes.push(...girdle);
  addAngledFamily(planes, {
    count: 8, phase: 22.5, angle: pavilionAngle,
    radiusAtAnchor: boundary, anchorZ: girdleBottom,
    downward: true, group: 'pavilionMain',
  });
  // Each lower half is the exact triangle through one 22.5° girdle edge and
  // its 75%-length inner meetpoint. Adjacent triangles terminate on one of the
  // eight pavilion mains, preserving the standard alternating topology.
  const lowerTipRadius = 0.25;
  const pavilionTangent = Math.tan(pavilionAngle * DEG);
  const lowerTipZ = pavilionTangent * lowerTipRadius * Math.cos(22.5 * DEG)
    - pavilionTangent - Math.abs(girdleBottom);
  for (let index = 0; index < 16; index += 1) {
    const angleA = index * 22.5 * DEG;
    const angleB = (index + 1) * 22.5 * DEG;
    const tipAngle = (index % 2 === 0 ? index : index + 1) * 22.5 * DEG;
    planes.push(planeThroughPoints(
      pointOnRing(1, angleA, girdleBottom),
      pointOnRing(1, angleB, girdleBottom),
      pointOnRing(lowerTipRadius, tipAngle, lowerTipZ),
      'lowerGirdle',
      index,
    ));
  }
  planes.push(plane([0, 0, -1], 0.878, 'culet', 0));
  return Object.freeze(planes);
}

function clippedRectangleOutline(width, height, cornerCut) {
  const diagonalDistance = (width + height - cornerCut) / Math.SQRT2;
  return [
    [[1, 0, 0], width], [[-1, 0, 0], width],
    [[0, 1, 0], height], [[0, -1, 0], height],
    [[Math.SQRT1_2, Math.SQRT1_2, 0], diagonalDistance],
    [[-Math.SQRT1_2, Math.SQRT1_2, 0], diagonalDistance],
    [[-Math.SQRT1_2, -Math.SQRT1_2, 0], diagonalDistance],
    [[Math.SQRT1_2, -Math.SQRT1_2, 0], diagonalDistance],
  ];
}

function addHomotheticTier(target, outline, scaleA, zA, scaleB, zB, group) {
  outline.forEach(([horizontalNormal, support], index) => {
    const xA = support * scaleA;
    const xB = support * scaleB;
    const radial = zA - zB;
    const vertical = xB - xA;
    const magnitude = Math.hypot(radial, vertical);
    const normal = [
      (radial * horizontalNormal[0]) / magnitude,
      (radial * horizontalNormal[1]) / magnitude,
      vertical / magnitude,
    ];
    const distance = (radial * xA + vertical * zA) / magnitude;
    target.push(plane(normal, distance, group, index));
  });
}

function buildEmerald() {
  // A true clipped-corner 1.53:1 rectangular outline, propagated through three
  // crown and pavilion steps. Unlike an ellipse approximation, its four long
  // sides, four short sides, and four diagonal corner junctions are explicit.
  const outline = clippedRectangleOutline(1.16, 0.76, 0.22);
  const planes = [plane([0, 0, 1], 0.420, 'table', 0)];
  addHomotheticTier(planes, outline, 0.56, 0.420, 0.72, 0.295, 'crownStep1');
  addHomotheticTier(planes, outline, 0.72, 0.295, 0.87, 0.155, 'crownStep2');
  addHomotheticTier(planes, outline, 0.87, 0.155, 1.00, 0.025, 'crownStep3');
  outline.forEach(([normal, support], index) => {
    planes.push(plane(normal, support, 'girdle', index, false));
  });
  addHomotheticTier(planes, outline, 1.00, -0.025, 0.80, -0.190, 'pavilionStep1');
  addHomotheticTier(planes, outline, 0.80, -0.190, 0.53, -0.405, 'pavilionStep2');
  addHomotheticTier(planes, outline, 0.53, -0.405, 0.16, -0.690, 'pavilionStep3');
  planes.push(plane([0, 0, -1], 0.700, 'culet', 0));
  return Object.freeze(planes);
}

function buildOval() {
  // Fancy ovals do not have one standardized facet geometry. An invertible
  // affine transform of the validated brilliant preserves every facet and meet
  // exactly while producing a clean 1.50:1 elliptical outline.
  return Object.freeze(buildBrilliant().map((source) => {
    const transformed = [
      source.normal[0] / 1.20,
      source.normal[1] / 0.80,
      source.normal[2],
    ];
    const magnitude = length3(transformed);
    return plane(
      transformed.map((component) => component / magnitude),
      source.distance / magnitude,
      source.group,
      source.facetIndex,
      source.optical,
    );
  }));
}

export const CUT_INFO = Object.freeze({
  brilliant: Object.freeze({
    symmetry: 8, opticalFacets: 58, planeCount: 74,
    tablePercent: 53.4, crownAngle: 34.5, pavilionAngle: 40.75,
    crownHeightPercent: 16.0, pavilionDepthPercent: 42.9,
    girdleThicknessPercent: 2.0, starLengthPercent: 50, lowerHalfPercent: 75,
    families: Object.freeze({ table: 1, star: 8, bezel: 8, upperGirdle: 16,
      girdle: 16, pavilionMain: 8, lowerGirdle: 16, culet: 1 }),
  }),
  emerald: Object.freeze({
    symmetry: 2, opticalFacets: 50, planeCount: 58, aspectRatio: 1.53,
    families: Object.freeze({ table: 1, crownStep1: 8, crownStep2: 8,
      crownStep3: 8, girdle: 8, pavilionStep1: 8, pavilionStep2: 8,
      pavilionStep3: 8, culet: 1 }),
  }),
  oval: Object.freeze({
    symmetry: 2, opticalFacets: 58, planeCount: 74, aspectRatio: 1.50,
    families: Object.freeze({ table: 1, star: 8, bezel: 8, upperGirdle: 16,
      girdle: 16, pavilionMain: 8, lowerGirdle: 16, culet: 1 }),
  }),
});

/**
 * Build outward-facing half-spaces for a closed convex cut. A point is inside
 * iff dot(plane.normal, point) <= plane.distance for every plane.
 */
export function createCutPlanes(cut = 'brilliant') {
  if (cut === 'brilliant') return buildBrilliant();
  if (cut === 'emerald') return buildEmerald();
  if (cut === 'oval') return buildOval();
  throw new RangeError(`Unknown gemstone cut: ${cut}`);
}

export function pointInsidePlanes(point, planes, epsilon = 1e-9) {
  return planes.every((plane) => dot3(plane.normal, point) <= plane.distance + epsilon);
}

/** CPU slab intersection used by tests and diagnostics. */
export function intersectConvexPlanes(origin, direction, planes, epsilon = 1e-9) {
  const ray = normalize3(direction);
  let near = -Infinity;
  let far = Infinity;
  let nearPlane = -1;
  let farPlane = -1;
  for (let index = 0; index < planes.length; index += 1) {
    const plane = planes[index];
    const denominator = dot3(plane.normal, ray);
    const numerator = plane.distance - dot3(plane.normal, origin);
    if (Math.abs(denominator) <= epsilon) {
      if (numerator < -epsilon) return null;
      continue;
    }
    const distance = numerator / denominator;
    if (denominator < 0 && distance > near) {
      near = distance;
      nearPlane = index;
    } else if (denominator > 0 && distance < far) {
      far = distance;
      farPlane = index;
    }
    if (near > far + epsilon) return null;
  }
  if (far < 0 || !Number.isFinite(far)) return null;
  return { near, far, nearPlane, farPlane };
}

export const OPTICS_APPROXIMATIONS = Object.freeze({
  spectralSamples: '12/24 visible wavelength bands during motion; 24/48 at rest, with CIE XYZ integration',
  crystalModel: 'isotropic representative IOR; birefringence omitted',
  environment: 'analytic procedural studio lights',
  geometry: 'commercial cut families are idealized as exact convex, perfectly symmetric plane arrangements',
  transport: 'geometric optics with 16/24/40-bounce quality budgets; no wave optics or full scene caustics',
});
