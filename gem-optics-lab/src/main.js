import { createGemRenderer } from './renderer.js';
import { GEM_MATERIALS, CUT_INFO } from './optics.js';

const $ = (id) => document.getElementById(id);
const materials = {
  diamond: { title: 'Diamond', name: 'ダイヤモンド', number: '01', note: '光を動かすと、内部で反射した光がファセットごとに明滅します。' },
  sapphire: { title: 'Sapphire', name: 'サファイア', number: '02', note: '光が石の内部を長く進むほど、吸収によって深い青が現れます。' },
  emerald: { title: 'Emerald', name: 'エメラルド', number: '03', note: 'カットを切り替えると、光が通る距離と緑の濃淡が変わります。' },
  ruby: { title: 'Ruby', name: 'ルビー', number: '04', note: '白い表面反射と、内部を透過した赤い光の違いを観察できます。' },
};
const cutNames = { brilliant: 'ラウンド・ブリリアント', emerald: 'エメラルド・カット', oval: 'オーバル・カット' };
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const options = { gem: 'diamond', cut: 'brilliant', environment: 'studio', lightAngle: 35, intensity: 1.2, dispersion: 1, autoRotate: false, quality: 'auto' };
let renderer;
let ready = false;

function showError(error) {
  $('loading').hidden = true;
  $('render-error').hidden = false;
  $('render-error-text').textContent = 'WebGL 2 が利用できません。ブラウザーのハードウェア アクセラレーションを有効にして再読み込みしてください。';
  console.error('Gem renderer:', error);
}

function updateReadouts() {
  const gem = { ...materials[options.gem], ...GEM_MATERIALS[options.gem], name: materials[options.gem].name };
  $('gem-title').textContent = gem.title;
  $('gem-japanese').textContent = gem.name;
  $('specimen-index').textContent = `SPECIMEN ${gem.number} / 04`;
  $('cut-description').textContent = cutNames[options.cut];
  $('cut-description').title = `${CUT_INFO[options.cut].opticalFacets} 光学ファセット`;
  $('ior').textContent = gem.ior.toFixed(3);
  $('critical-angle').textContent = `${(Math.asin(1 / gem.ior) * 180 / Math.PI).toFixed(1)}°`;
  $('dispersion-readout').textContent = ((gem.ior - 1) / gem.abbe * options.dispersion).toFixed(4);
  $('observation').textContent = gem.note;
  $('auto-rotate').classList.toggle('active', options.autoRotate);
  $('auto-rotate').setAttribute('aria-pressed', String(options.autoRotate));
}

function updateOptions(patch) {
  Object.assign(options, patch);
  renderer?.setOptions(patch);
  updateReadouts();
}

for (const button of document.querySelectorAll('[data-gem]')) {
  button.addEventListener('click', () => {
    for (const item of document.querySelectorAll('[data-gem]')) {
      const selected = item === button;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    }
    updateOptions({ gem: button.dataset.gem });
  });
}
for (const button of document.querySelectorAll('[data-environment]')) {
  button.addEventListener('click', () => {
    for (const item of document.querySelectorAll('[data-environment]')) {
      const selected = item === button;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    }
    updateOptions({ environment: button.dataset.environment });
  });
}
$('cut').addEventListener('change', (event) => updateOptions({ cut: event.target.value }));
$('quality').addEventListener('change', (event) => updateOptions({ quality: event.target.value }));
for (const [id, key, format] of [
  ['light-angle', 'lightAngle', (value) => `${value}°`],
  ['intensity', 'intensity', (value) => `${value.toFixed(1)} ×`],
  ['dispersion', 'dispersion', (value) => `${value.toFixed(2).replace(/0$/, '')} ×`],
]) {
  const input = $(id);
  const sync = () => {
    const value = Number(input.value);
    input.style.setProperty('--fill', `${((value - Number(input.min)) / (Number(input.max) - Number(input.min))) * 100}%`);
    $(`${id}-value`).textContent = format(value);
    updateOptions({ [key]: value });
  };
  input.addEventListener('input', sync);
  sync();
}
$('auto-rotate').addEventListener('click', () => updateOptions({ autoRotate: !options.autoRotate }));
$('reset-view').addEventListener('click', () => renderer?.resetView());
$('reload').addEventListener('click', () => window.location.reload());

const dialog = $('about-dialog');
$('about-open').addEventListener('click', () => dialog.showModal());
$('about-close').addEventListener('click', () => dialog.close());
$('about-done').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }
});
reducedMotion.addEventListener('change', (event) => {
  if (event.matches) updateOptions({ autoRotate: false });
});

try {
  renderer = createGemRenderer($('gem-canvas'), {
    onError: showError,
    onStats: (stats) => {
      if (!ready && stats.totalPresentedFrames > 0) { ready = true; $('loading').hidden = true; }
      const percent = Math.min(100, Math.round(stats.samples / stats.targetSamples * 100));
      $('refinement-status').textContent = stats.moving ? (options.quality === 'auto' ? '回転中 · タブレット向け描画' : `${stats.spectralBands}波長 · 回転中も精細描画`) : stats.refining ? `細部を描画中 ${percent}%` : `${stats.spectralBands}波長 · 精細化完了`;
      $('refinement-status').classList.toggle('complete', !stats.refining && !stats.moving);
      $('gem-canvas').dataset.samples = String(stats.samples);
      $('gem-canvas').dataset.targetSamples = String(stats.targetSamples);
      $('gem-canvas').dataset.hdr = String(stats.hdr);
      $('gem-canvas').dataset.moving = String(stats.moving);
      $('gem-canvas').dataset.spectralBands = String(stats.spectralBands);
      $('gem-canvas').dataset.bounces = String(stats.bounces);
      if (Number.isFinite(stats.renderPixels)) $('gem-canvas').dataset.renderPixels = String(stats.renderPixels);
      if (Number.isFinite(stats.adaptiveScale)) $('gem-canvas').dataset.adaptiveScale = String(stats.adaptiveScale);
      if (Number.isFinite(stats.completedMotionFrames)) $('gem-canvas').dataset.motionFrames = String(stats.completedMotionFrames);
      if (Number.isFinite(stats.renderedYaw)) $('gem-canvas').dataset.renderedYaw = String(stats.renderedYaw);
      if (Number.isFinite(stats.renderedZoom)) $('gem-canvas').dataset.renderedZoom = String(stats.renderedZoom);
    },
  });
  renderer.setOptions(options);
  updateReadouts();
} catch (error) { showError(error); }

window.addEventListener('pagehide', () => renderer?.destroy());
window.addEventListener('pageshow', (event) => { if (event.persisted) window.location.reload(); });
