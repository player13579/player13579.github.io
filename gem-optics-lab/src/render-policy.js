const POLICIES = Object.freeze({
  auto: Object.freeze({
    static: Object.freeze({ spectralBands: 48, targetSamples: 96, bounces: 28, maxPixels: 1_600_000 }),
    motion: Object.freeze({ spectralBands: 12, bounces: 16, basePixels: 420_000, minPixels: 260_000, maxPixels: 1_200_000 }),
  }),
  high: Object.freeze({
    static: Object.freeze({ spectralBands: 24, targetSamples: 64, bounces: 24, maxPixels: 1_500_000 }),
    motion: Object.freeze({ spectralBands: 12, bounces: 12, basePixels: 320_000, minPixels: 320_000, maxPixels: 320_000 }),
  }),
  ultra: Object.freeze({
    static: Object.freeze({ spectralBands: 48, targetSamples: 128, bounces: 40, maxPixels: 2_600_000 }),
    motion: Object.freeze({ spectralBands: 24, bounces: 20, basePixels: 480_000, minPixels: 480_000, maxPixels: 480_000 }),
  }),
});

export const MOTION_BATCH_MAX = 4;
export const MOTION_CPU_BUDGET_MS = 9;
export const MOTION_TARGET_FRAME_MS = 1000 / 24;

export function getRenderPolicy(quality, moving = false) {
  const qualityPolicy = POLICIES[quality];
  if (!qualityPolicy) throw new RangeError(`Unknown render quality: ${quality}`);
  const selected = moving ? qualityPolicy.motion : qualityPolicy.static;
  return Object.freeze({ ...selected, moving, strata: selected.spectralBands / 3 });
}

export function motionPixelBudget(quality, adaptiveScale = 1) {
  const policy = getRenderPolicy(quality, true);
  const scale = Number.isFinite(adaptiveScale) ? adaptiveScale : 1;
  return Math.round(Math.min(policy.maxPixels,
    Math.max(policy.minPixels, policy.basePixels * scale)));
}

// 38–52 ms is a wide stability band around the 24 fps target. Large misses are
// corrected quickly; smaller changes avoid visible resolution pumping.
export function adaptMotionScale(currentScale, meanFrameMs) {
  const scale = Number.isFinite(currentScale) ? currentScale : 1;
  if (!Number.isFinite(meanFrameMs)) return scale;
  if (meanFrameMs > 70) return Math.max(.5, scale * .72);
  if (meanFrameMs > 52) return Math.max(.5, scale * .86);
  if (meanFrameMs < 27) return Math.min(3, scale * 1.18);
  if (meanFrameMs < 38) return Math.min(3, scale * 1.08);
  return scale;
}

export function canContinueMotionBatch(completedSubpasses, elapsedMs) {
  return completedSubpasses < MOTION_BATCH_MAX
    && (completedSubpasses === 0 || elapsedMs < MOTION_CPU_BUDGET_MS);
}

/** Mirrors the shader's cyclic three-band stratification for policy tests. */
export function spectralIndicesForSubpass(pixelX, pixelY, subpass, spectralBands) {
  if (![6, 12, 24, 48].includes(spectralBands)) {
    throw new RangeError('spectralBands must be 6, 12, 24, or 48');
  }
  const strata = spectralBands / 3;
  const offset = ((pixelX * 73 + pixelY * 151 + subpass) % strata + strata) % strata;
  return [offset, offset + strata, offset + strata * 2];
}
