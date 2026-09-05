import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CUT_INFO,
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

const cross3 = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

function intersectThreePlanes(a, b, c) {
  const bc = cross3(b.normal, c.normal);
  const ca = cross3(c.normal, a.normal);
  const ab = cross3(a.normal, b.normal);
  const determinant = dot3(a.normal, bc);
  if (Math.abs(determinant) < 1e-11) return null;
  return [0, 1, 2].map((axis) => (
    a.distance * bc[axis] + b.distance * ca[axis] + c.distance * ab[axis]
  ) / determinant);
}

function exposedVerticesByPlane(planes) {
  const vertices = planes.map(() => new Map());
  for (let a = 0; a < planes.length - 2; a += 1) {
    for (let b = a + 1; b < planes.length - 1; b += 1) {
      for (let c = b + 1; c < planes.length; c += 1) {
        const point = intersectThreePlanes(planes[a], planes[b], planes[c]);
        if (!point || !pointInsidePlanes(point, planes, 2e-8)) continue;
        const key = point.map((value) => Math.round(value * 1e8)).join(',');
        vertices[a].set(key, point);
        vertices[b].set(key, point);
        vertices[c].set(key, point);
      }
    }
  }
  return vertices;
}

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

for (const [cut, expectedPlaneCount] of Object.entries({ brilliant: 74, emerald: 58, oval: 74 })) {
  test(`${cut} cut is closed, convex, and has outward unit normals`, () => {
    const planes = createCutPlanes(cut);
    assert.equal(planes.length, expectedPlaneCount);
    assert.equal(planes.length, CUT_INFO[cut].planeCount);
    assert.ok(planes.length >= 40 && planes.length <= 128);
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

  test(`${cut} exposes every intended plane as a non-degenerate facet`, () => {
    const planes = createCutPlanes(cut);
    const vertices = exposedVerticesByPlane(planes);
    planes.forEach((facet, index) => {
      assert.ok(vertices[index].size >= 3,
        `${cut} ${facet.group} ${facet.facetIndex} has only ${vertices[index].size} hull vertices`);
    });
    const actualFamilies = Object.fromEntries(Object.entries(CUT_INFO[cut].families)
      .map(([name]) => [name, planes.filter((facet) => facet.group === name).length]));
    assert.deepEqual(actualFamilies, CUT_INFO[cut].families);
    assert.equal(planes.filter((facet) => facet.optical).length, CUT_INFO[cut].opticalFacets);

    if (cut === 'brilliant') {
      const expectedVertices = {
        table: 8,
        star: 3,
        bezel: 4,
        upperGirdle: 3,
        girdle: 4,
        // A flat culet truncates the fourth kite vertex into a tiny edge.
        pavilionMain: 5,
        lowerGirdle: 3,
        culet: 8,
      };
      planes.forEach((facet, index) => {
        assert.equal(vertices[index].size, expectedVertices[facet.group],
          `${facet.group} ${facet.facetIndex} has the wrong polygon topology`);
      });
    }
  });
}

test('round brilliant proportions and canonical 58-facet families are preserved', () => {
  const info = CUT_INFO.brilliant;
  closeTo(info.tablePercent, 53.4, 0.05);
  closeTo(info.crownAngle, 34.5);
  closeTo(info.pavilionAngle, 40.75);
  assert.deepEqual(info.families, {
    table: 1,
    star: 8,
    bezel: 8,
    upperGirdle: 16,
    girdle: 16,
    pavilionMain: 8,
    lowerGirdle: 16,
    culet: 1,
  });
});

test('emerald cut has an exact 1.53:1 clipped rectangular girdle', () => {
  const planes = createCutPlanes('emerald');
  const alongX = intersectConvexPlanes([3, 0, 0], [-1, 0, 0], planes);
  const alongY = intersectConvexPlanes([0, 3, 0], [0, -1, 0], planes);
  assert.ok(alongX && alongY);
  closeTo(3 - alongX.near, 1.16, 1e-10);
  closeTo(3 - alongY.near, 0.76, 1e-10);
  closeTo((3 - alongX.near) / (3 - alongY.near), CUT_INFO.emerald.aspectRatio, 0.01);
  const diagonal = planes.filter((facet) => facet.group === 'girdle'
    && Math.abs(facet.normal[0]) > 0.5 && facet.normal[0] > 0 && facet.normal[1] > 0);
  assert.equal(diagonal.length, 1);
  closeTo(diagonal[0].distance, (1.16 + 0.76 - 0.22) / Math.SQRT2);
});
