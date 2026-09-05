import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MOTION_BATCH_MAX,
  MOTION_CPU_BUDGET_MS,
  adaptMotionScale,
  canContinueMotionBatch,
  getRenderPolicy,
  motionPixelBudget,
  spectralIndicesForSubpass,
} from '../src/render-policy.js';

test('static quality remains detailed while every motion tier has a bounded workload', () => {
  assert.deepEqual(getRenderPolicy('auto'), {
    spectralBands: 48, targetSamples: 96, bounces: 28, maxPixels: 1_600_000,
    moving: false, strata: 16,
  });
  assert.deepEqual(getRenderPolicy('auto', true), {
    spectralBands: 12, bounces: 16, basePixels: 420_000, minPixels: 260_000, maxPixels: 1_200_000,
    moving: true, strata: 4,
  });
  assert.deepEqual(
    [getRenderPolicy('high', true), getRenderPolicy('ultra', true)]
      .map(({ spectralBands, bounces, strata }) => ({ spectralBands, bounces, strata })),
    [{ spectralBands: 12, bounces: 12, strata: 4 }, { spectralBands: 24, bounces: 20, strata: 8 }],
  );
  assert.throws(() => getRenderPolicy('preview'), /Unknown render quality/);
});

test('every same-pose cycle covers its motion or static spectrum exactly once', () => {
  for (const bands of [6, 12, 24, 48]) {
    const strata = bands / 3;
    for (const [x, y] of [[0, 0], [1, 7], [1390, 1061], [-2, 5]]) {
      const visited = [];
      for (let subpass = 0; subpass < strata; subpass += 1) {
        visited.push(...spectralIndicesForSubpass(x, y, subpass, bands));
      }
      assert.deepEqual(visited.sort((a, b) => a - b),
        Array.from({ length: bands }, (_, index) => index));
    }
  }
});

test('auto motion resolution reacts outside a stable 38-52ms hysteresis band', () => {
  assert.equal(adaptMotionScale(1, 45), 1);
  assert.equal(adaptMotionScale(1, 60), .86);
  assert.equal(adaptMotionScale(1, 80), .72);
  assert.equal(adaptMotionScale(1, 33), 1.08);
  assert.equal(adaptMotionScale(1, 20), 1.18);
  let scale = 1;
  for (let i = 0; i < 20; i += 1) scale = adaptMotionScale(scale, 80);
  assert.equal(motionPixelBudget('auto', scale), 260_000);
  for (let i = 0; i < 40; i += 1) scale = adaptMotionScale(scale, 10);
  assert.equal(motionPixelBudget('auto', scale), 1_200_000);
});

test('motion batching always permits one pass, then respects time and pass budgets', () => {
  assert.equal(canContinueMotionBatch(0, MOTION_CPU_BUDGET_MS * 100), true);
  assert.equal(canContinueMotionBatch(1, MOTION_CPU_BUDGET_MS - 0.01), true);
  assert.equal(canContinueMotionBatch(1, MOTION_CPU_BUDGET_MS), false);
  assert.equal(canContinueMotionBatch(MOTION_BATCH_MAX, 0), false);
});
