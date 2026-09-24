(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const verify = params.has('verify');
  const entries = [
    { id: 'heal', title: 'ヒール', detail: '採用されたAstra版。12秒の治癒現象を自動再生。本編接続の受入は継続中。', status: '採用・接続確認中', source: 'webgpu-heal-astra-prototype.js', page: 'heal-astra-preview.html', node: '#stage' },
    { id: 'sunbeam', title: 'サンビーム', detail: 'Sol版の手元から目標までの光路。現在の本編接続ソース。', status: '本編接続', source: 'webgpu-sunbeam-sol-e.js', page: 'sunbeam-sol-preview.html', node: '#stage' },
    { id: 'stamina', title: 'スタミナ恩恵', detail: '供給、伝達、身体への着地をゲーム表示寸法で確認。', status: '本編接続', source: 'webgpu-stamina-benefit-e.js', page: 'stamina-benefit-preview.html', node: '#stage', aspect: '620 / 460' },
    { id: 'mana', title: 'マナ恩恵', detail: '三面の光が身体へ折り込まれる現在のWebGPU実装。', status: '本編接続', source: 'webgpu-mana-benefit-e.js', page: 'webgpu-e-gallery.html?stage=mana', node: '#mana-stage', aspect: '620 / 460' },
    { id: 'fire', title: 'ファイア', detail: '単独で受入済みの第二案。ゲーム本編への統合は未完了。', status: '単独E・統合待ち', source: 'webgpu-fire-ultra.js', page: 'fire-webgpu-ultra-preview.html', node: '#fire' },
    { id: 'mystery', title: 'ミステリーボックス', detail: '箱の開封E。報酬が表示先へ飛ぶ部分はこの単独プレビューに含まれません。', status: '部分プレビュー', source: 'webgpu-mystery-box-reveal-e.js', page: 'mystery-box-webgpu-preview.html', node: '#scene' },
    { id: 'cafeteria', title: '実りの食堂', detail: '室内設備と環境Eを原画の上で順番に自動再生。', status: '環境Eプレビュー', source: 'webgpu-map-cafeteria-e.js', page: 'cafeteria-webgpu-preview.html', node: '#cafeteria', aspect: '930 / 860' }
  ];
  const byId = new Map(entries.map(entry => [entry.id, entry]));
  const address = (page) => {
    const url = new URL(page, location.href);
    url.searchParams.set('gallery', '1');
    if (verify) url.searchParams.set('verify', '1');
    return url.href;
  };
  const loadScript = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`${src} を読み込めません`));
    document.head.append(script);
  });

  if (params.get('stage') === 'mana') {
    document.body.innerHTML = '<canvas id="mana-stage" width="620" height="460" aria-label="マナ恩恵Eの自動再生"></canvas><div id="mana-error" role="alert"></div>';
    document.body.style.cssText = 'margin:0;background:#0d1720;display:grid;place-items:center;min-height:100vh';
    const canvas = document.getElementById('mana-stage');
    canvas.style.cssText = 'width:min(100vw,calc(100vh * 620 / 460));height:auto;aspect-ratio:620/460;display:block';
    const errorBox = document.getElementById('mana-error');
    errorBox.style.cssText = 'position:fixed;inset:auto 12px 12px;color:#ffd4c9;font:14px system-ui';
    const run = async () => {
      if (!navigator.gpu) throw new Error('WebGPU 非対応のため表示できません');
      for (const src of ['webgpu-frame-core.js', 'webgpu-primitives.js', 'webgpu-compositing.js', 'webgpu-renderer.js', 'webgpu-mana-benefit-e.js']) await loadScript(src);
      const renderer = await window.DvaWebGPURenderer.create({ gpu: navigator.gpu });
      const target = renderer.registerTarget('mana-gallery', canvas, { width: 620, height: 460, logicalWidth: 620, logicalHeight: 460 });
      const effect = window.DvaManaBenefitE.create({ renderer, frameOwner: renderer });
      await effect.ready;
      let raf = 0, last = performance.now(), elapsed = 0, cycle = 0;
      const draw = now => {
        const delta = Math.min(50, Math.max(0, now - last)); last = now;
        elapsed += delta;
        if (elapsed >= 1550) { elapsed %= 1550; cycle++; }
        const frame = renderer.beginFrame('Mana benefit gallery');
        try {
          frame.clear('mana-gallery', [.045, .072, .10, 1]);
          if (elapsed < 1200) effect.record({ frame, target: 'mana-gallery', effect: {
            type: 'gain-mana', effectKind: 'mana', id: `gallery-mana-${cycle}`,
            causeId: `gallery-mana-cause-${cycle}`, actorWorld: { x: 310, y: 320 }, duration: 1200
          }, actorElapsedMs: elapsed, camera: { x: 0, y: 0 }, zoom: 1,
          viewport: { width: 620, height: 460, pixelWidth: 620, pixelHeight: 460 } });
          frame.submit();
          document.documentElement.dataset.gpuReady = '1';
        } catch (error) { try { frame.discard(); } catch (_) {} throw error; }
        raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
      const cleanup = () => { cancelAnimationFrame(raf); effect.destroy(); target.unregister(); renderer.destroy(); };
      window.addEventListener('pagehide', cleanup, { once: true });
    };
    run().catch(error => { errorBox.textContent = `WebGPU: ${error.message || error}`; document.documentElement.dataset.gpuReady = '0'; });
    return;
  }

  const stage = document.getElementById('stage');
  const notice = document.getElementById('notice');
  const catalog = document.getElementById('catalog');
  let active = null, monitor = 0, mysteryTimer = 0;
  const clearActive = () => {
    clearInterval(monitor); clearInterval(mysteryTimer);
    const old = stage.querySelector('iframe');
    if (old) old.remove();
  };
  function styleChild(doc, entry) {
    const css = document.createElement('style');
    css.textContent = `html,body{margin:0!important;width:100%!important;height:100%!important;overflow:hidden!important;background:#101820!important}body{display:block!important}main{margin:0!important;padding:0!important;width:100%!important;max-width:none!important;height:100%!important}main>h1,main>p,.eyebrow,.controls,main>div:not(.stage):not(.scroll),#status{display:none!important}.scroll{width:100%!important;height:100%!important;overflow:hidden!important}.stage{width:100%!important;height:100%!important;aspect-ratio:auto!important;border:0!important;border-radius:0!important}canvas{display:block!important;width:100%!important;height:100%!important;max-width:none!important;aspect-ratio:auto!important;border:0!important;border-radius:0!important}#error:not(:empty){display:block!important;position:fixed!important;z-index:10!important;inset:auto 8px 8px!important;color:#ffd3ca!important;background:#321d23!important;padding:8px!important}`;
    doc.head.append(css);
    if (entry.id === 'mystery') {
      const slider = doc.getElementById('time');
      if (slider) {
        let phase = 0, last = performance.now();
        mysteryTimer = setInterval(() => {
          const now = performance.now(); phase = (phase + Math.min(now - last, 100)) % 3000; last = now;
          slider.value = String(Math.min(2599, Math.floor(phase)));
          slider.dispatchEvent(new Event('input', { bubbles: true }));
        }, 33);
      }
    }
    if (entry.id === 'fire') {
      // The original verify route holds one frame; resume only this gallery's selected iframe.
      const reduced = doc.getElementById('reduced');
      if (reduced?.checked) reduced.checked = false;
      const pause = doc.getElementById('pause');
      if (pause && pause.textContent === '再開') pause.click();
    }
  }
  function select(id) {
    const entry = byId.get(id) || entries[0];
    if (active === entry.id) return;
    clearActive(); active = entry.id;
    stage.style.aspectRatio = entry.aspect || '980 / 620';
    document.getElementById('selected-title').textContent = entry.title;
    document.getElementById('selected-description').textContent = entry.detail;
    document.getElementById('selected-status').textContent = entry.status;
    document.getElementById('selected-source').textContent = `WebGPU: ${entry.source}`;
    document.getElementById('selected-link').href = address(entry.page);
    document.querySelectorAll('.item').forEach(button => button.setAttribute('aria-current', String(button.dataset.id === entry.id)));
    history.replaceState(null, '', `${location.pathname}${location.search}#${entry.id}`);
    if (!navigator.gpu) { notice.hidden = false; notice.textContent = 'このブラウザーでは WebGPU を使用できません。WebGPU 対応環境で開いてください。'; return; }
    notice.hidden = false; notice.textContent = 'WebGPU を読み込んでいます…';
    const iframe = document.createElement('iframe');
    iframe.title = `${entry.title} WebGPU 自動再生`;
    iframe.allow = 'autoplay';
    iframe.src = address(entry.page);
    iframe.addEventListener('load', () => {
      if (active !== entry.id) return;
      try {
        const doc = iframe.contentDocument;
        if (!doc) throw new Error('プレビューにアクセスできません');
        styleChild(doc, entry);
        notice.hidden = true;
        monitor = setInterval(() => {
          if (active !== entry.id) return;
          const error = doc.querySelector('#error:not(:empty),#mana-error:not(:empty)');
          const text = error?.textContent?.trim();
          if (text) { notice.textContent = text; notice.hidden = false; }
          else if (iframe.contentWindow?.__fireUltraError) { notice.textContent = iframe.contentWindow.__fireUltraError; notice.hidden = false; }
          else if (doc.documentElement.dataset.gpuReady === '0') { notice.textContent = doc.querySelector('#status')?.textContent || 'WebGPU の初期化に失敗しました'; notice.hidden = false; }
          else notice.hidden = true;
        }, 500);
      } catch (error) { notice.hidden = false; notice.textContent = error.message; }
    });
    iframe.addEventListener('error', () => { notice.hidden = false; notice.textContent = 'プレビューを読み込めませんでした'; });
    stage.append(iframe);
  }
  for (const entry of entries) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'item'; button.dataset.id = entry.id;
    button.innerHTML = `<strong>${entry.title}</strong><span>${entry.status}</span>`;
    button.addEventListener('click', () => select(entry.id));
    catalog.append(button);
  }
  select(location.hash.slice(1));
  window.addEventListener('hashchange', () => select(location.hash.slice(1)));
  window.addEventListener('pagehide', clearActive, { once: true });
})();
