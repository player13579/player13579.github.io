(() => {
  'use strict';

  // Retired pre-reset entries never return; new Astra clean-room versions remain reviewable.
  const entries = [{
    id: 'heal-astra-prototype',
    title: 'ヒール · Astra試作',
    detail: '独立したAstra制作版。専用WebGPUプレビューで12秒ループ再生します。',
    status: '試作・再生可能',
    source: 'webgpu-heal-astra-prototype.js',
    page: 'heal-astra-preview.html'
  }, {
    id: 'sunbeam-astra-clean-v1',
    title: 'サンビーム · Astra新規v1',
    detail: '旧版を表現入力に使わず制作した試作。細い単純な帯に見えるため画質は不採用。本編未接続。',
    status: '品質不採用・再生可能',
    source: 'webgpu-sunbeam-astra-clean-v1.js',
    page: 'sunbeam-astra-clean-v1-preview.html'
  }, {
    id: 'luck-astra-clean-v2',
    title: '幸運 · Astra新規v2',
    detail: '旧版を表現入力に使わず制作した試作。翼のように見える問題が残るため画質は不採用。本編未接続。',
    status: '品質不採用・再生可能',
    source: 'webgpu-luck-astra-v2.js',
    page: 'luck-astra-v2-preview.html'
  }];
  const params = new URLSearchParams(location.search);
  let selectedIndex = 0;
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
    button.addEventListener('click', () => select(index));
    catalog.append(button);
    return button;
  });
  const counter = document.getElementById('entry-counter');
  counter.textContent = `${entries.length} 件`;

  function makePreview(entry) {
    const preview = new URL(entry.page, location.href);
    if (params.has('verify')) preview.searchParams.set('verify', params.get('verify') || '1');
    for (const key of ['phase', 'zoom']) {
      if (params.has(key)) preview.searchParams.set(key, params.get(key));
    }
    return preview;
  }

  function select(index) {
    selectedIndex = (index + entries.length) % entries.length;
    const entry = entries[selectedIndex];
    document.getElementById('selected-title').textContent = entry.title;
    document.getElementById('selected-description').textContent = entry.detail;
    document.getElementById('selected-status').textContent = entry.status;
    document.getElementById('selected-source').textContent = `WebGPU: ${entry.source}`;
    const sourceLink = document.getElementById('selected-link');
    const preview = makePreview(entry);
    sourceLink.href = preview.href;
    sourceLink.textContent = '元のWebGPUプレビューを見る ↗';
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
  }

  if (!entries.length) {
    counter.textContent = '0 件';
    notice.textContent = '表示できるAstra制作Eはありません。';
    return;
  }
  select(0);
})();
