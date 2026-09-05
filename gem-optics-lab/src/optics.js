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

function ellipseSupport(nx, ny, aspectX, aspectY) {
  return Math.hypot(aspectX * nx, aspectY * ny);
}

const CUT_SPECS = Object.freeze({
  brilliant: Object.freeze({
    sectors: 12,
    aspect: [1, 1],
    phase: Math.PI / 12,
    tierOffsets: Object.freeze([0, 0.5, 0, 0.5, 0]),
    profile: Object.freeze([
      Object.freeze([0.46, 0.60]),
      Object.freeze([0.72, 0.36]),
      Object.freeze([1.00, 0.09]),
      Object.freeze([1.00, -0.09]),
      Object.freeze([0.56, -0.52]),
      Object.freeze([0.035, -0.94]),
    ]),
  }),
  emerald: Object.freeze({
    sectors: 8,
    aspect: [1.13, 0.80],
    phase: Math.PI / 8,
    tierOffsets: Object.freeze([0, 0, 0, 0, 0]),
    profile: Object.freeze([
      Object.freeze([0.57, 0.56]),
      Object.freeze([0.78, 0.34]),
      Object.freeze([1.00, 0.08]),
      Object.freeze([1.00, -0.08]),
      Object.freeze([0.60, -0.54]),
      Object.freeze([0.11, -0.90]),
    ]),
  }),
  oval: Object.freeze({
    sectors: 12,
    aspect: [1.16, 0.80],
    phase: Math.PI / 12,
    tierOffsets: Object.freeze([0, 0.5, 0, 0.5, 0]),
    profile: Object.freeze([
      Object.freeze([0.43, 0.59]),
      Object.freeze([0.70, 0.35]),
      Object.freeze([1.00, 0.085]),
      Object.freeze([1.00, -0.085]),
      Object.freeze([0.54, -0.53]),
      Object.freeze([0.045, -0.93]),
    ]),
  }),
});

/**
 * Build outward-facing half-spaces for a closed convex cut. A point is inside
 * iff dot(plane.normal, point) <= plane.distance for every plane.
 */
export function createCutPlanes(cut = 'brilliant') {
  const spec = CUT_SPECS[cut];
  if (!spec) throw new RangeError(`Unknown gemstone cut: ${cut}`);
  const planes = [];
  for (let sector = 0; sector < spec.sectors; sector += 1) {
    for (let edge = 0; edge < spec.profile.length - 1; edge += 1) {
      const theta = spec.phase + ((sector + spec.tierOffsets[edge]) * Math.PI * 2) / spec.sectors;
      const nx = Math.cos(theta);
      const ny = Math.sin(theta);
      const support = ellipseSupport(nx, ny, spec.aspect[0], spec.aspect[1]);
      const [radiusA, zA] = spec.profile[edge];
      const [radiusB, zB] = spec.profile[edge + 1];
      const xA = support * radiusA;
      const xB = support * radiusB;
      const radial = zA - zB;
      const vertical = xB - xA;
      const length = Math.hypot(radial, vertical);
      const normal = [
        (radial * nx) / length,
        (radial * ny) / length,
        vertical / length,
      ];
      const distance = (radial * xA + vertical * zA) / length;
      planes.push(Object.freeze({ normal: Object.freeze(normal), distance }));
    }
  }
  const topZ = spec.profile[0][1];
  const bottomZ = spec.profile[spec.profile.length - 1][1];
  planes.push(Object.freeze({ normal: Object.freeze([0, 0, 1]), distance: topZ }));
  planes.push(Object.freeze({ normal: Object.freeze([0, 0, -1]), distance: -bottomZ }));
  return Object.freeze(planes);
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
  spectralSamples: 'RGB wavelengths (610, 550, 460 nm)',
  crystalModel: 'isotropic representative IOR; birefringence omitted',
  environment: 'analytic procedural studio lights',
  transport: 'geometric optics with a 12-bounce cap; no wave optics or full caustics',
});
