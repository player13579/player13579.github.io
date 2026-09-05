import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MOTION_BATCH_MAX,
  MOTION_CPU_BUDGET_MS,
  canContinueMotionBatch,
  getRenderPolicy,
  spectralIndicesForSubpass,
} from '../src/render-policy.js';

test('motion uses the full spectral and bounce policy of every quality', () => {
  assert.deepEqual(getRenderPolicy('auto'), {
    spectralBands: 24, targetSamples: 32, bounces: 16, strata: 8,
  });
  assert.deepEqual(getRenderPolicy('high'), {
    spectralBands: 24, targetSamples: 64, bounces: 24, strata: 8,
  });
  assert.deepEqual(getRenderPolicy('ultra'), {
    spectralBands: 48, targetSamples: 128, bounces: 40, strata: 16,
  });
  assert.throws(() => getRenderPolicy('preview'), /Unknown render quality/);
});

test('a complete same-pose cycle covers every spectral band exactly once per pixel', () => {
  for (const bands of [24, 48]) {
    const strata = bands / 3;
    for (const [x, y] of [[0, 0], [1, 7], [1390, 1061], [-2, 5]]) {
      const visited = [];
      for (let subpass = 0; subpass < strata; subpass += 1) {
        const indices = spectralIndicesForSubpass(x, y, subpass, bands);
        assert.equal(indices.length, 3);
        visited.push(...indices);
      }
      assert.deepEqual(visited.sort((a, b) => a - b),
        Array.from({ length: bands }, (_, index) => index));
    }
  }
});

test('motion batching always permits one pass, then respects time and pass budgets', () => {
  assert.equal(canContinueMotionBatch(0, MOTION_CPU_BUDGET_MS * 100), true);
  assert.equal(canContinueMotionBatch(1, MOTION_CPU_BUDGET_MS - 0.01), true);
  assert.equal(canContinueMotionBatch(1, MOTION_CPU_BUDGET_MS), false);
  assert.equal(canContinueMotionBatch(MOTION_BATCH_MAX, 0), false);
});
