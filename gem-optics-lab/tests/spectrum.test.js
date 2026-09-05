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
test('motion tables cover the visible interval and retain normalized D65 energy', () => {
  for (const count of [6, 12]) {
    const table = createSpectralTable(count);
    assert.equal(table.count, count);
    assert.ok(table.wavelengths[0] > 380 && table.wavelengths.at(-1) < 780);
    assert.ok(table.wavelengths[0] < 420 && table.wavelengths.at(-1) > 740);
    const xyz = [0, 0, 0];
    for (let i = 0; i < count; i += 1) {
      for (let channel = 0; channel < 3; channel += 1) {
        xyz[channel] += table.daylight[i] * table.packed[i * 4 + channel + 1] / count;
      }
    }
    assert.deepEqual(xyz.map((value) => +value.toFixed(4)),
      table.whiteXYZ.map((value) => +value.toFixed(4)));
    assert.ok(Math.abs(table.whiteXYZ[1] - 1) < 1e-6);
    assert.ok(Math.abs(table.whiteXYZ[0] - .95) < .012, String(table.whiteXYZ));
    assert.ok(Math.abs(table.whiteXYZ[2] - 1.089) < .018, String(table.whiteXYZ));
  }
});
test('1931 Y peak is near 550 nm and supported counts are explicit', () => {
  assert.ok(cieXYZ(550)[1] > .98);
  assert.throws(() => createSpectralTable(9), RangeError);
});
