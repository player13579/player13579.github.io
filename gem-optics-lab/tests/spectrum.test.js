import test from 'node:test';
import assert from 'node:assert/strict';
import { cieXYZ, createSpectralTable } from '../src/spectrum.js';

test('table has finite midpoint wavelengths, weights, and daylight', () => {
  const t = createSpectralTable();
  assert.equal(t.packed.length, 192); assert.equal(t.daylight.length, 24);
  for (const v of t.packed) assert.ok(Number.isFinite(v));
  for (const v of t.daylight) assert.ok(v > 0 && Number.isFinite(v));
});
test('D65 white is approximately normalized', () => {
  const w = createSpectralTable(48).whiteXYZ;
  assert.ok(Math.abs(w[0] - .95) < .025 && Math.abs(w[1] - 1) < .025 && Math.abs(w[2] - 1.089) < .025, String(w));
});
test('flat D65 estimator integrates to its reference white', () => {
  const t = createSpectralTable(24); const xyz = [0, 0, 0];
  for (let i = 0; i < t.count; i++) for (let c = 0; c < 3; c++) xyz[c] += t.daylight[i] * t.packed[i * 4 + c + 1] / t.count;
  assert.deepEqual(xyz.map(v => +v.toFixed(4)), t.whiteXYZ.map(v => +v.toFixed(4)));
});
test('1931 Y peak is near 550 nm and counts are explicit', () => { assert.ok(cieXYZ(550)[1] > .98); assert.throws(() => createSpectralTable(12), RangeError); });
