(() => {
  'use strict';

  const entry = {
    id: 'heal',
    title: 'ヒール',
    detail: '採用された治癒Eを12秒のループで確認できます。本編接続の受入は継続中です。',
    status: '採用・接続確認中',
    source: 'webgpu-heal-astra-prototype.js',
    page: 'heal-astra-preview.html'
  };
  const params = new URLSearchParams(location.search);
  const preview = new URL(entry.page, location.href);
  if (params.has('verify')) preview.searchParams.set('verify', params.get('verify') || '1');
  for (const key of ['phase', 'zoom']) {
    if (params.has(key)) preview.searchParams.set(key, params.get(key));
  }

  document.getElementById('selected-title').textContent = entry.title;
  document.getElementById('selected-description').textContent = entry.detail;
  document.getElementById('selected-status').textContent = entry.status;
  document.getElementById('selected-source').textContent = `WebGPU: ${entry.source}`;
  document.getElementById('selected-link').href = preview.href;

  const catalog = document.getElementById('catalog');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'item';
  button.dataset.id = entry.id;
  button.setAttribute('aria-current', 'true');
  button.innerHTML = `<strong>${entry.title}</strong><span>${entry.status}</span>`;
  catalog.append(button);

  const stage = document.getElementById('stage');
  const notice = document.getElementById('notice');
  if (!navigator.gpu) {
    notice.textContent = 'このブラウザーでは WebGPU を使用できません。';
    return;
  }

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
})();
