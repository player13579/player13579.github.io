(() => {
  'use strict';

  // The shared gallery stays on the accepted Heal preview until another E is ready.
  const entries = [{
    id: 'heal',
    title: 'ヒール',
    detail: '採用された治癒Eを12秒のループで確認できます。本編接続の受入は継続中です。',
    status: '採用・接続確認中',
    source: 'webgpu-heal-astra-prototype.js',
    page: 'heal-astra-preview.html'
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
    const preview = new URL(entry.page || entry.source, location.href);
    if (params.has('verify')) preview.searchParams.set('verify', params.get('verify') || '1');
    for (const key of ['phase', 'zoom']) {
      if (params.has(key)) preview.searchParams.set(key, params.get(key));
    }
    return preview;
  }

  function select(index) {
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
  }

  if (!entries.length) {
    counter.textContent = '0 件';
    notice.textContent = '表示できる受理済みEはありません。';
    return;
  }
  select(0);
})();
