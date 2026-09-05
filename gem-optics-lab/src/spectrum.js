// CIE 1931 2° CMFs: Wyman, Sloan & Shirley, JCGT 2(2), 2013.
// D65 values: CIE, ISO/CIE 11664-2:2022, https://files.cie.co.at/CIE_std_illum_D65.csv
// CIE dataset metadata/license: https://www.cie.co.at/datatable/cie-standard-illuminant-d65
const D65_5NM = [49.9755,52.3118,54.6482,68.7015,82.7549,87.1204,91.486,92.4589,93.4318,90.057,86.6823,95.7736,104.865,110.936,117.008,117.41,117.812,116.336,114.861,115.392,115.923,112.367,108.811,109.082,109.354,108.578,107.802,106.296,104.79,106.239,107.689,106.047,104.405,104.225,104.046,102.023,100,98.1671,96.3342,96.0611,95.788,92.2368,88.6856,89.3459,90.0062,89.8026,89.5991,88.6489,87.6987,85.4936,83.2886,83.4939,83.6992,81.863,80.0268,80.1207,80.2146,81.2462,82.2778,80.281,78.2842,74.0027,69.7213,70.6652,71.6091,72.979,74.349,67.9765,61.604,65.7448,69.8856,72.4863,75.087,69.3398,63.5927,55.0054,46.4182,56.6118,66.8054,65.0941,63.3828];
const D65_START = 380;

function gaussian(w, beta, left, right) {
  const t = (w - beta) * (w < beta ? left : right);
  return Math.exp(-0.5 * t * t);
}

export function cieXYZ(wavelengthNm) {
  const w = Number(wavelengthNm);
  if (!Number.isFinite(w)) return [0, 0, 0];
  return [
    0.362 * gaussian(w, 442, .0624, .0374) + 1.056 * gaussian(w, 599.8, .0264, .0323) - .065 * gaussian(w, 501.1, .049, .0382),
    0.821 * gaussian(w, 568.8, .0213, .0247) + .286 * gaussian(w, 530.9, .0613, .0322),
    1.217 * gaussian(w, 437, .0845, .0278) + .681 * gaussian(w, 459, .0385, .0725),
  ];
}

function interpolateD65(w) {
  if (w <= 380) return D65_5NM[0] / 100;
  if (w >= 780) return D65_5NM[D65_5NM.length - 1] / 100;
  const p = (w - D65_START) / 5;
  const i = Math.floor(p);
  const f = p - i;
  return (D65_5NM[i] * (1 - f) + D65_5NM[i + 1] * f) / 100;
}

export function createSpectralTable(count = 24) {
  if (![6, 12, 24, 48].includes(count)) throw new RangeError('count must be 6, 12, 24, or 48');
  const width = 400 / count;
  const wavelengths = Array.from({ length: count }, (_, i) => 380 + (i + .5) * width);
  // A broad six-band preview badly under-samples the narrow blue colour-matching
  // functions at simple midpoints. Integrate D65 * CMF within each band, then
  // express that integral as one representative wavelength and one effective CMF.
  // This keeps a common Y normalization (no per-channel white balance) and makes
  // the low-cost motion estimator neutral under the reference illuminant.
  const quadrature = wavelengths.map((_, index) => {
    const samples = Math.max(12, Math.ceil(width));
    const sums = [0, 0, 0];
    let daylightSum = 0;
    for (let sample = 0; sample < samples; sample += 1) {
      const w = 380 + index * width + (sample + .5) * width / samples;
      const d65 = interpolateD65(w);
      const xyz = cieXYZ(w);
      daylightSum += d65;
      for (let channel = 0; channel < 3; channel += 1) sums[channel] += d65 * xyz[channel];
    }
    return {
      daylight: daylightSum / samples,
      xyz: sums.map((value) => value / daylightSum),
    };
  });
  const daylight = Float32Array.from(quadrature, (band) => band.daylight);
  const whiteRaw = quadrature.reduce((sum, band) => [
    sum[0] + band.daylight * band.xyz[0],
    sum[1] + band.daylight * band.xyz[1],
    sum[2] + band.daylight * band.xyz[2],
  ], [0, 0, 0]);
  const denom = whiteRaw[1];
  const packed = new Float32Array(48 * 4);
  wavelengths.forEach((w, i) => {
    const [x, y, z] = quadrature[i].xyz;
    packed.set([w, x * count / denom, y * count / denom, z * count / denom], i * 4);
  });
  return { count, packed, daylight, whiteXYZ: whiteRaw.map(v => v / denom), wavelengths };
}

export { interpolateD65 };
