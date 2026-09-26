(() => {
  'use strict';

  // Astra-authored replayable versions remain distinct from game adoption.
  const entries = [{
    id: 'heal-astra-prototype',
    title: 'ヒール · Astra版',
    detail: '採用済みのヒール。WebGPUで自動ループ再生します。',
    status: '採用済み・再生可能',
    source: 'webgpu-heal-astra-prototype.js',
    page: 'heal-astra-preview.html'
  }, {
    id: 'sunbeam-astra-clean-v3', title: 'サンビーム · Astra v3',
    detail: '手元から伝播し対象へ届く最新版。ユーザー評価は良好。聴感と本編接続は未受入。',
    status: 'ユーザー評価良好・本編未採用', source: 'webgpu-sunbeam-astra-clean-v3.js', page: 'sunbeam-astra-clean-v3-preview.html'
  }, {
    id: 'luck-astra-clean-v4', title: '幸運 · Astra v4',
    detail: '独立制作した最新版。ユーザー評価は良好。聴感と本編接続は未受入。',
    status: 'ユーザー評価良好・本編未採用', source: 'webgpu-luck-astra-v4.js', page: 'luck-astra-v4-preview.html'
  }, {
    id: 'stamina-astra-clean-v1', title: 'スタミナ回復 · Astra v1',
    detail: 'ゼロから制作した版。脚線に見え補給の意味が弱いため品質不採用。本編未接続。',
    status: '品質不採用・再生可能', source: 'webgpu-stamina-astra-clean-v1.js', page: 'stamina-astra-clean-v1-preview.html'
  }, {
    id: 'stamina-astra-clean-v2', title: 'スタミナ回復 · Astra v2',
    detail: '独立制作した版。実GPU再生済み、最終品質と聴感は未受入。本編未接続。',
    status: '試作・品質未受入', source: 'webgpu-stamina-astra-clean-v2.js', page: 'stamina-astra-clean-v2-preview.html'
  }, {
    id: 'stamina-astra-clean-v3', title: 'スタミナ回復 · Astra v3',
    detail: '独立制作した版。発光する衣装に見え品質不採用。本編未接続。',
    status: '品質不採用・再生可能', source: 'webgpu-stamina-astra-clean-v3.js', page: 'stamina-astra-clean-v3-preview.html'
  }, {
    id: 'mana-astra-clean-v1', title: 'マナ獲得 · Astra v1',
    detail: 'ゼロから制作した版。布帯状で獲得後の意味が弱く品質不採用。本編未接続。',
    status: '品質不採用・再生可能', source: 'webgpu-mana-astra-clean-v1.js', page: 'mana-astra-clean-v1-preview.html'
  }, {
    id: 'mana-astra-clean-v2', title: 'マナ獲得 · Astra v2',
    detail: '独立制作した版。実GPU再生済み、最終品質と聴感は未受入。本編未接続。',
    status: '試作・品質未受入', source: 'webgpu-mana-astra-clean-v2.js', page: 'mana-astra-clean-v2-preview.html'
  }, {
    id: 'mana-astra-clean-v3', title: 'マナ獲得 · Astra v3',
    detail: '独立制作した版。輪や体表模様に読めるため品質不採用。本編未接続。',
    status: '品質不採用・再生可能', source: 'webgpu-mana-astra-clean-v3.js', page: 'mana-astra-clean-v3-preview.html'
  }, {
    id: 'mana-astra-clean-v4-pilot', title: 'マナ獲得 · Astra v4',
    detail: '三状態だけの造形試験。接触の帯と体表模様に見え品質不採用。SFX・全寿命なし。',
    status: '三状態試作・品質不採用', source: 'webgpu-mana-astra-clean-v4-pilot.js', page: 'mana-astra-clean-v4-pilot.html'
  }, {
    id: 'mana-astra-v5-pilot', title: 'マナ獲得 · Astra v5',
    detail: '三状態だけの新規造形試験。品質・SFX・全寿命は未受入。本編未接続。',
    status: '三状態試作・品質未受入', source: 'webgpu-mana-astra-v5-pilot.js', page: 'webgpu-mana-astra-v5-pilot.html'
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
    preview.searchParams.set('embed', '1');
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
