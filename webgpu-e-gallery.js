(() => {
  'use strict';

  // Preserve accepted E and list runnable versions only.
  const entries = [{
    id: 'heal',
    title: 'ヒール',
    detail: '採用された治癒Eを12秒のループで確認できます。本編接続の受入は継続中です。',
    status: '採用・接続確認中',
    source: 'webgpu-heal-astra-prototype.js',
    page: 'heal-astra-preview.html'
  }, {
    id: 'sunbeam-v2',
    title: 'サンビーム / ChatGPT Pro v2',
    detail: '採用済みWebGPU Eです。本編イベントとSFXの受入確認は継続中です。',
    status: '採用・本編接続確認中',
    source: 'webgpu-sunbeam-pro-v2.mjs',
    page: 'sunbeam-v2-gallery.html'
  }, {
    id: 'luck-v1',
    title: '幸運 / ChatGPT Pro v1',
    detail: 'Recovered standalone WebGPU version (125,664 bytes). Candidate only; visual quality is unaccepted.',
    status: '候補・未受入',
    source: 'experiments/luck-e-v1.mjs',
    provenance: 'outputs/request-20260925/sunbeam-pro-code/luck-e.mjs · ChatGPT Pro recovered source',
    page: 'webgpu-luck-candidate.html?version=v1'
  }, {
    id: 'luck-v2',
    title: '幸運 / ChatGPT Pro v2',
    detail: 'Standalone WebGPU version (139,251 bytes). Candidate only; actual-size visual audit rejected it.',
    status: '候補・未受入',
    source: 'experiments/luck-e-v2.mjs',
    provenance: 'outputs/request-20260925/e-pro-rebuild/luck-e.mjs · ChatGPT Pro',
    page: 'webgpu-luck-candidate.html?version=v2'
  }, {
    id: 'luck-v3-revision',
    title: '幸運 / ChatGPT Pro Revision',
    detail: 'Revised standalone WebGPU version (164,536 bytes). Candidate only; visual quality remains unaccepted.',
    status: '候補・未受入',
    source: 'experiments/luck-e-v3-revision.mjs',
    provenance: 'outputs/request-20260925/e-pro-rebuild/luck-e-revision.mjs · ChatGPT Pro',
    page: 'webgpu-luck-candidate.html?version=v3'
  }];
  const params = new URLSearchParams(location.search);
  const intervalMs = 12000;
  let selectedIndex = 0;
  let rotationTimer = 0;
  const catalog = document.getElementById('catalog');
  const stage = document.getElementById('stage');
  const notice = document.getElementById('notice');
  const buttons = entries.map((entry, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'item';
    button.dataset.id = entry.id;
    button.setAttribute('aria-current', 'false');
    const title = document.createElement('strong');
    title.textContent = entry.title;
    const status = document.createElement('span');
    status.textContent = entry.status;
    button.append(title, status);
    button.addEventListener('click', () => select(index, true));
    catalog.append(button);
    return button;
  });
  const counter = document.getElementById('entry-counter');
  counter.textContent = `${entries.length} 件`;

  function makePreview(entry) {
    const preview = new URL(entry.page || entry.source, location.href);
    if (params.has('verify')) preview.searchParams.set('verify', params.get('verify') || '1');
    for (const key of ['phase', 'zoom']) {
      if (params.has(key)) preview.searchParams.set(key, params.get(key));
    }
    return preview;
  }

  function select(index, restartRotation = false) {
    selectedIndex = (index + entries.length) % entries.length;
    const entry = entries[selectedIndex];
    const preview = makePreview(entry);
    document.getElementById('selected-title').textContent = entry.title;
    document.getElementById('selected-description').textContent = entry.detail;
    document.getElementById('selected-status').textContent = entry.status;
    document.getElementById('selected-source').textContent = `WebGPU: ${entry.source}`;
    document.getElementById('selected-link').href = preview.href;
    document.getElementById('selected-link').textContent = '元のWebGPUプレビューを見る ↗';
    buttons.forEach((button, buttonIndex) => {
      button.setAttribute('aria-current', buttonIndex === selectedIndex ? 'true' : 'false');
    });
    stage.querySelector('iframe')?.remove();
    notice.hidden = false;
    if (!navigator.gpu) {
      notice.textContent = 'このブラウザーでは WebGPU を使用できません。';
      return;
    }
    notice.textContent = 'WebGPU プレビューを読み込んでいます…';
    const iframe = document.createElement('iframe');
    iframe.title = `${entry.title} WebGPU 自動再生`;
    iframe.allow = 'autoplay';
    iframe.src = preview.href;
    iframe.addEventListener('load', () => {
      try {
        const child = iframe.contentDocument;
        if (!child) throw new Error('プレビューにアクセスできません');
        const error = child.getElementById('error');
        const updateNotice = () => {
          const message = error?.textContent?.trim();
          notice.textContent = message || '';
          notice.hidden = !message;
        };
        updateNotice();
        if (error) new MutationObserver(updateNotice).observe(error, { childList: true, characterData: true, subtree: true });
      } catch (error) {
        notice.textContent = error.message;
        notice.hidden = false;
      }
    });
    iframe.addEventListener('error', () => {
      notice.textContent = 'プレビューを読み込めませんでした';
      notice.hidden = false;
    });
    stage.append(iframe);
    if (restartRotation && entries.length > 1) {
      clearInterval(rotationTimer);
      rotationTimer = setInterval(() => select(selectedIndex + 1), intervalMs);
    }
  }

  if (!entries.length) {
    counter.textContent = '0 件';
    notice.textContent = '表示できる受理済みEはありません。';
    return;
  }
  select(0, entries.length > 1);
})();
