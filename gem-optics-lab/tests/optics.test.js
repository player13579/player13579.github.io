import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GEM_MATERIALS,
  beerLambert,
  cauchyCoefficients,
  createCutPlanes,
  dielectricFresnel,
  dot3,
  intersectConvexPlanes,
  length3,
  pointInsidePlanes,
  refractiveIndexAt,
  refractiveIndicesRGB,
  snellRefract,
} from '../src/optics.js';

const closeTo = (actual, expected, tolerance = 1e-10) => {
  assert.ok(Math.abs(actual - expected) <= tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`);
};

test('normal-incidence Fresnel matches the exact dielectric result', () => {
  for (const material of Object.values(GEM_MATERIALS)) {
    const result = dielectricFresnel(1, 1, material.ior);
    const expected = ((1 - material.ior) / (1 + material.ior)) ** 2;
    closeTo(result.reflectance, expected);
    assert.equal(result.tir, false);
    closeTo(result.cosTransmitted, 1);
  }
});

test('Snell refraction preserves the sine-angle ratio', () => {
  const incidentAngle = Math.PI / 6;
  const incident = [Math.sin(incidentAngle), 0, -Math.cos(incidentAngle)];
  const refracted = snellRefract(incident, [0, 0, 1], 1, 1.5);
  assert.ok(refracted);
  closeTo(length3(refracted), 1);
  const transmittedSine = Math.hypot(refracted[0], refracted[1]);
  closeTo(1 * Math.sin(incidentAngle), 1.5 * transmittedSine);
  assert.ok(refracted[2] < 0);
});

test('critical angle produces total internal reflection', () => {
  const n = 1.5;
  const critical = Math.asin(1 / n);
  const below = dielectricFresnel(Math.cos(critical - 1e-4), n, 1);
  const above = dielectricFresnel(Math.cos(critical + 1e-4), n, 1);
  assert.equal(below.tir, false);
  assert.equal(above.tir, true);
  assert.equal(above.reflectance, 1);

  const outgoingAboveCritical = [Math.sin(critical + 0.02), 0, Math.cos(critical + 0.02)];
  assert.equal(snellRefract(outgoingAboveCritical, [0, 0, -1], n, 1), null);
});

test('Cauchy fit reproduces n_d and requested Abbe spread', () => {
  const material = GEM_MATERIALS.diamond;
  const { A, B } = cauchyCoefficients(material.ior, material.abbe);
  closeTo(A + B / 0.58930 ** 2, material.ior, 1e-12);
  const spread = (A + B / 0.48613 ** 2) - (A + B / 0.65627 ** 2);
  closeTo((material.ior - 1) / spread, material.abbe, 1e-9);
});

test('emerald Abbe value agrees with its conventional B-G dispersion', () => {
  const material = GEM_MATERIALS.emerald;
  const inverseG = 1 / 0.4308 ** 2;
  const inverseB = 1 / 0.6867 ** 2;
  const cauchyB = material.gemologicalDispersionBG / (inverseG - inverseB);
  const equivalentFCSpread = cauchyB * (1 / 0.48613 ** 2 - 1 / 0.65627 ** 2);
  const equivalentAbbe = (material.ior - 1) / equivalentFCSpread;
  closeTo(material.abbe, equivalentAbbe, 0.02);
});

test('RGB dispersion orders blue above red and scales to zero cleanly', () => {
  for (const material of Object.values(GEM_MATERIALS)) {
    const [red, green, blue] = refractiveIndicesRGB(material, 1);
    assert.ok(blue > green && green > red);
    const disabled = refractiveIndicesRGB(material, 0);
    disabled.forEach((index) => closeTo(index, material.ior));
    closeTo(refractiveIndexAt(0.58930, material, 2), material.ior);
  }
});

test('Beer-Lambert attenuation is multiplicative over distance', () => {
  const coefficients = [0.1, 0.7, 1.5];
  const one = beerLambert(coefficients, 1);
  const two = beerLambert(coefficients, 2);
  one.forEach((value, channel) => closeTo(value * value, two[channel]));
});

for (const [cut, expectedPlaneCount] of Object.entries({ brilliant: 62, emerald: 42, oval: 62 })) {
  test(`${cut} cut is closed, convex, and has outward unit normals`, () => {
    const planes = createCutPlanes(cut);
    assert.equal(planes.length, expectedPlaneCount);
    assert.ok(planes.length >= 40 && planes.length <= 64);
    assert.ok(pointInsidePlanes([0, 0, 0], planes));
    planes.forEach((plane) => {
      closeTo(length3(plane.normal), 1, 1e-12);
      assert.ok(plane.distance > 0);
    });

    // Probe many view directions. Each ray must enter through an inward-facing
    // slab and leave through an outward-facing slab, with both points on the hull.
    for (let elevation = -0.8; elevation <= 0.8001; elevation += 0.4) {
      for (let azimuth = 0; azimuth < Math.PI * 2; azimuth += Math.PI / 10) {
        const radial = Math.cos(elevation);
        const outward = [
          Math.cos(azimuth) * radial,
          Math.sin(azimuth) * radial,
          Math.sin(elevation),
        ];
        const origin = outward.map((component) => component * 3.2);
        const direction = outward.map((component) => -component);
        const hit = intersectConvexPlanes(origin, direction, planes);
        assert.ok(hit, `missing ${cut} intersection at ${azimuth}, ${elevation}`);
        assert.ok(hit.near > 0 && hit.far > hit.near);
        assert.ok(hit.nearPlane >= 0 && hit.farPlane >= 0);
        const nearPoint = origin.map((component, i) => component + direction[i] * hit.near);
        const farPoint = origin.map((component, i) => component + direction[i] * hit.far);
        assert.ok(pointInsidePlanes(nearPoint, planes, 1e-8));
        assert.ok(pointInsidePlanes(farPoint, planes, 1e-8));
        const nearPlane = planes[hit.nearPlane];
        const farPlane = planes[hit.farPlane];
        closeTo(dot3(nearPlane.normal, nearPoint), nearPlane.distance, 1e-8);
        closeTo(dot3(farPlane.normal, farPoint), farPlane.distance, 1e-8);
        assert.ok(dot3(nearPlane.normal, direction) < 0);
        assert.ok(dot3(farPlane.normal, direction) > 0);
      }
    }
  });
}
