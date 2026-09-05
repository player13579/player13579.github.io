const POLICIES = Object.freeze({
  auto: Object.freeze({ spectralBands: 24, targetSamples: 32, bounces: 16 }),
  high: Object.freeze({ spectralBands: 24, targetSamples: 64, bounces: 24 }),
  ultra: Object.freeze({ spectralBands: 48, targetSamples: 128, bounces: 40 }),
});

export const MOTION_BATCH_MAX = 4;
export const MOTION_CPU_BUDGET_MS = 9;

export function getRenderPolicy(quality) {
  const policy = POLICIES[quality];
  if (!policy) throw new RangeError(`Unknown render quality: ${quality}`);
  return Object.freeze({ ...policy, strata: policy.spectralBands / 3 });
}

export function canContinueMotionBatch(completedSubpasses, elapsedMs) {
  return completedSubpasses < MOTION_BATCH_MAX
    && (completedSubpasses === 0 || elapsedMs < MOTION_CPU_BUDGET_MS);
}

/** Mirrors the shader's cyclic three-band stratification for policy tests. */
export function spectralIndicesForSubpass(pixelX, pixelY, subpass, spectralBands) {
  if (![24, 48].includes(spectralBands)) throw new RangeError('spectralBands must be 24 or 48');
  const strata = spectralBands / 3;
  const offset = ((pixelX * 73 + pixelY * 151 + subpass) % strata + strata) % strata;
  return [offset, offset + strata, offset + strata * 2];
}

