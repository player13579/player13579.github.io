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
    { id: 'cafeteria', title: '実りの食堂', detail: '室内設備と環境EのWebGPU試作。採用原画が未配信のため背景との合成は確認待ち。', status: 'E試作・原画待ち', source: 'webgpu-map-cafeteria-e.js', page: 'cafeteria-webgpu-preview.html', node: '#cafeteria', aspect: '930 / 860' },
    { id: 'emp', title: 'EMP 放電', detail: 'サーバーの通常EMP確定イベント形を使った単独フィクスチャ。発動・干渉・音声・本編実寸の受入は別途確認が必要です。', status: '単独フィクスチャ・画質/SFX未受入', source: 'webgpu-emp-effect.js', kind: 'integrated' },
    { id: 'barrier', title: 'バリア被弾', detail: 'サーバーの耐久バリア被弾イベント形と所有者・攻撃者を使った単独フィクスチャ。画質・SFX・本編実イベントの受入は未完了です。', status: '単独フィクスチャ・画質/SFX未受入', source: 'webgpu-barrier-e.js', kind: 'integrated' },
    { id: 'dodge', title: '回避', detail: '通常の回避発動イベントと現在の身体位置を使う単独フィクスチャ。実移動・無敵判定・画質・SFXの受入は含みません。', status: '単独フィクスチャ・画質/SFX未受入', source: 'webgpu-dodge-e.js', kind: 'integrated' },
    { id: 'renki', title: '錬気', detail: '通常の錬気発動イベントと現在の身体位置を使う単独フィクスチャ。ゲーム本編の発動・画質・SFXの受入は未完了です。', status: '単独フィクスチャ・画質/SFX未受入', source: 'webgpu-renki-e.js', kind: 'integrated' },
    { id: 'idea-truth', title: 'イデア・真', detail: '真の獲得イベントと現在の身体位置を使う単独フィクスチャ。美・善・昇天や本編実イベントの受入は含みません。', status: '単独フィクスチャ・画質/SFX未受入', source: 'webgpu-idea-e.js', kind: 'integrated' },
    { id: 'bust', title: 'バスト発動', detail: '対象への時限バスト付与イベントを使う単独フィクスチャ。持続状態・衝突判定・画質・SFXの受入は含みません。', status: '単独フィクスチャ・画質/SFX未受入', source: 'webgpu-bust-e.js', kind: 'integrated' },
    { id: 'gravity-keeper', title: '時の番人フィールド', detail: '時の番人の発動イベント・半径・寿命を使う単独フィクスチャ。グラビティストームや本編判定・画質・SFXの受入は含みません。', status: '単独フィクスチャ・画質/SFX未受入', source: 'webgpu-gravity-field-e.js', kind: 'integrated' },
    { id: 'hacker-status', title: 'ハッカー状態回復', detail: '状態異常の解除が成立したイベントと対象位置を使う単独フィクスチャ。異常なしの結果や本編実イベント・画質・SFXの受入は含みません。', status: '単独フィクスチャ・画質/SFX未受入', source: 'webgpu-hacker-status-recovery-e.js', kind: 'integrated' },
    { id: 'medical-bed', title: '診療ベッド使用', detail: '現行の成功使用イベント形を使うWebGPU単独フィクスチャ。実ゲームでの表示とSFXは未受入です。', status: '単独フィクスチャ・本編表示/SFX未受入', source: 'webgpu-medical-object-e.js', kind: 'integrated' },
    { id: 'medical-cabinet', title: '薬草とリネンの棚', detail: '現行の成功使用イベント形を使うWebGPU単独フィクスチャ。実ゲームでの表示とSFXは未受入です。', status: '単独フィクスチャ・本編表示/SFX未受入', source: 'webgpu-medical-cabinet-e.js', kind: 'integrated' },
    { id: 'medical-footbath', title: '足湯使用', detail: '現行の成功使用イベント形を使うWebGPU単独フィクスチャ。実ゲームでの表示とSFXは未受入です。', status: '単独フィクスチャ・本編表示/SFX未受入', source: 'webgpu-medical-footbath-use-e.js', kind: 'integrated' },
    { id: 'medical-ambient', title: '医療室の環境光', detail: '足湯の水面、窓光、床の木漏れ日を既存のWebGPU環境Eで再生。本編の視覚品質とSFXは未受入です。', status: '単独E・本編品質/SFX未受入', source: 'webgpu-medical-environment-e.js', kind: 'integrated' },
    { id: 'fighter-slash', title: 'ファイター斬撃', detail: '現在の fighter-slash イベント形を使う単独WebGPUフィクスチャ。ゲーム本編の実画面品質とSFXは未受入です。', status: '単独フィクスチャ・本編画質/SFX未受入', source: 'webgpu-fighter-energy-e.js', kind: 'integrated' },
    { id: 'flora-invisible', title: 'フローラ インビジブル', detail: '本人だけへ届く flora-invisible イベントと不可視の本人を使う単独WebGPUフィクスチャ。本編の実画面品質とSFXは未受入です。', status: '単独フィクスチャ・本編画質/SFX未受入', source: 'webgpu-flora-e.js', kind: 'integrated' },
    { id: 'room-cooling-unit', objectId: 'v302-reactor-coolingUnit-2', title: '冷却ユニット使用', detail: '現行の成功使用イベントと著者済みオブジェクトIDを使うWebGPU候補。実GPU/本編の品質受入とSFX受入は未完了です。', status: '視覚/SFX候補・品質受入待ち', source: 'webgpu-room-object-use-e.js', kind: 'integrated' },
    { id: 'room-command-desk', objectId: 'v302-observatory-commandDesk-3', title: '観測デスク使用', detail: '現行の成功使用イベントと著者済みオブジェクトIDを使うWebGPU候補。実GPU/本編の品質受入とSFX受入は未完了です。', status: '視覚/SFX候補・品質受入待ち', source: 'webgpu-room-object-use-e.js', kind: 'integrated' },
    { id: 'room-pallet-jack', objectId: 'v302-storage-palletJack-2', title: 'パレットジャッキ使用', detail: '現行の成功使用イベントと著者済みオブジェクトIDを使うWebGPU候補。実GPU/本編の品質受入とSFX受入は未完了です。', status: '視覚/SFX候補・品質受入待ち', source: 'webgpu-room-object-use-e.js', kind: 'integrated' },
    { id: 'room-restorative-mist', objectId: 'v302-greenhouse-mistSprayer-2', title: '薬草ミスト使用', detail: '現行の成功使用イベントと著者済みオブジェクトIDを使うWebGPU候補。実GPU/本編の品質受入とSFX受入は未完了です。', status: '視覚/SFX候補・品質受入待ち', source: 'webgpu-room-object-use-e.js', kind: 'integrated' },
    { id: 'room-herb-preparation-table', objectId: 'v302-greenhouse-compostUnit-3', title: '薬草調合台使用', detail: '現行の成功使用イベントと著者済みオブジェクトIDを使うWebGPU候補。実GPU/本編の品質受入とSFX受入は未完了です。', status: '視覚/SFX候補・品質受入待ち', source: 'webgpu-room-object-use-e.js', kind: 'integrated' },
    { id: 'corridor-a03-sconce', objectId: 'v317-corridor-a03-1', title: 'A03 壁灯', detail: '左側のガラス開口から壁面へ広がる光。候補表示で、視覚受入は未完了。SFX品質も未受入。', status: '視覚候補・SFX品質未受入', source: 'webgpu-corridor-object-use-e.js', page: 'webgpu-e-gallery.html#corridor-a03-sconce', kind: 'corridor' },
    { id: 'corridor-a07-sconce', objectId: 'v317-corridor-a07-1', title: 'A07 壁灯', detail: '交差する真鍮羽根が開き、屈折光を菱形へ集める。候補表示で、視覚受入は未完了。SFX品質も未受入。', status: '視覚候補・SFX品質未受入', source: 'webgpu-corridor-object-use-e.js', page: 'webgpu-e-gallery.html#corridor-a07-sconce', kind: 'corridor' },
    { id: 'corridor-a09-sconce', objectId: 'v317-corridor-a09-1', title: 'A09 壁灯', detail: '三枚のガラス面へ順に光を渡す。候補表示で、視覚受入は未完了。SFX品質も未受入。', status: '視覚候補・SFX品質未受入', source: 'webgpu-corridor-object-use-e.js', page: 'webgpu-e-gallery.html#corridor-a09-sconce', kind: 'corridor' },
    { id: 'corridor-a10-footlight', objectId: 'v317-corridor-a10-1', title: 'A10 足元灯', detail: '器具から床へ横方向の光を送る。候補表示で、視覚受入は未完了。SFX品質も未受入。', status: '視覚候補・SFX品質未受入', source: 'webgpu-corridor-object-use-e.js', page: 'webgpu-e-gallery.html#corridor-a10-footlight', kind: 'corridor' },
    { id: 'corridor-a11-footlight', objectId: 'v317-corridor-a11-1', title: 'A11 足元灯', detail: '対の光が敷居で合流して床へ抜ける。候補表示で、視覚受入は未完了。SFX品質も未受入。', status: '視覚候補・SFX品質未受入', source: 'webgpu-corridor-object-use-e.js', page: 'webgpu-e-gallery.html#corridor-a11-footlight', kind: 'corridor' },
    { id: 'corridor-a16-sconce', objectId: 'v317-corridor-a16-1', title: 'A16 壁灯', detail: 'ガラス内の光が満ち、一本のフィラメントへ集まる。候補表示で、視覚受入は未完了。SFX品質も未受入。', status: '視覚候補・SFX品質未受入', source: 'webgpu-corridor-object-use-e.js', page: 'webgpu-e-gallery.html#corridor-a16-sconce', kind: 'corridor' }
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
  let active = null, monitor = 0, mysteryTimer = 0, corridorRun = 0, activeCleanup = null;
  const clearActive = () => {
    corridorRun++;
    clearInterval(monitor); clearInterval(mysteryTimer);
    document.documentElement.dataset.gpuReady = '0';
    if (activeCleanup) { activeCleanup(); activeCleanup = null; }
    const old = stage.querySelector('iframe');
    if (old) old.remove();
    const oldCanvas = stage.querySelector('canvas[data-gallery-native]');
    if (oldCanvas) oldCanvas.remove();
  };
  async function startIntegrated(entry, runId) {
    const canvas = document.createElement('canvas');
    canvas.width = 980; canvas.height = 620; canvas.dataset.galleryNative = '1';
    canvas.setAttribute('aria-label', `${entry.title} WebGPU E 単独フィクスチャ自動再生`);
    stage.append(canvas);
    let renderer = null, target = null, effect = null, raf = 0, disposed = false;
    const targetId = `integrated-gallery-${runId}`;
    const dispose = () => {
      if (disposed) return;
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      try { effect?.destroy(); } catch (_) {}
      try { target?.unregister(); } catch (_) {}
      try { renderer?.destroy(); } catch (_) {}
      canvas.remove();
    };
    activeCleanup = dispose;
    try {
      if (!navigator.gpu) throw new Error('このブラウザーでは WebGPU を使用できません');
      for (const src of ['webgpu-frame-core.js', 'webgpu-primitives.js', 'webgpu-compositing.js', 'webgpu-renderer.js', entry.source]) await loadScript(src);
      if (disposed || runId !== corridorRun || active !== entry.id) return;
      renderer = await window.DvaWebGPURenderer.create({ gpu: navigator.gpu });
      if (disposed || runId !== corridorRun || active !== entry.id) { renderer.destroy(); renderer = null; return; }
      target = renderer.registerTarget(targetId, canvas, { width: 980, height: 620, logicalWidth: 980, logicalHeight: 620 });
      const isEmp = entry.id === 'emp', isHacker = entry.id === 'hacker-status';
      const isFighterSlash = entry.id === 'fighter-slash';
      const isFloraInvisible = entry.id === 'flora-invisible';
      const medicalEffectKind = ({ 'medical-bed': 'acceleration',
        'medical-cabinet': 'heal', 'medical-footbath': 'footBath' })[entry.id];
      const isMedical = Boolean(medicalEffectKind);
      const isMedicalAmbient = entry.id === 'medical-ambient';
      const isRoomObject = entry.id.startsWith('room-');
      const api = ({ emp: window.DvaWebGPUEmpEffect, barrier: window.DvaWebGPUBarrierE,
        'fighter-slash': window.DvaWebGPUFighterEnergyE,
        'flora-invisible': window.DvaWebGPUFloraE,
        dodge: window.DvaWebGPUDodgeE, renki: window.DvaWebGPURenkiE,
        'idea-truth': window.DvaWebGPIdeaE, bust: window.DvaWebGPUBustE,
        'gravity-keeper': window.DvaWebGPUGravityFieldE,
        'hacker-status': window.DvaWebGPUHackerStatusRecoveryE,
        'medical-bed': window.DvaWebGPUMedicalObjectE,
        'medical-cabinet': window.DvaWebGPUMedicalCabinetE,
        'medical-footbath': window.DvaWebGPUMedicalFootbathUseE,
        'medical-ambient': window.DvaWebGPUMedicalEnvironmentE,
        'room-cooling-unit': window.DvaWebGPURoomObjectUseE,
        'room-command-desk': window.DvaWebGPURoomObjectUseE,
        'room-pallet-jack': window.DvaWebGPURoomObjectUseE,
        'room-restorative-mist': window.DvaWebGPURoomObjectUseE,
        'room-herb-preparation-table': window.DvaWebGPURoomObjectUseE })[entry.id];
      if (!api?.plan || !api?.create) throw new Error('現在のWebGPU E APIがありません');
      effect = isRoomObject || isFloraInvisible ? api.create({ renderer, frameOwner: renderer }) :
        isMedical || isMedicalAmbient ? api.create({ device: renderer.device, format: renderer.format }) :
        isEmp || isHacker ? api.create({ renderer, frameOwner: renderer }) : api.create();
      const viewport = { kind: 'main', width: 980, height: 620, pixelWidth: 980, pixelHeight: 620 };
      const camera = { x: 0, y: 0 }, zoom = 1;
      const duration = ({ emp: api.DURATIONS?.emp,
        'fighter-slash': api.DURATIONS?.['fighter-slash'],
        'flora-invisible': api.DURATION_MS?.['flora-invisible'],
        barrier: api.EVENT_MAP?.['preparation-barrier-hit:durability-hit']?.duration,
        dodge: api.VISUAL_MS, renki: api.VISUAL_MS,
        'idea-truth': 1800, bust: api.EVENT_DURATION?.[api.START_EVENT],
        'gravity-keeper': 5000, 'hacker-status': Math.min(1200, api.DURATION_MS || 1200),
        'medical-bed': api.DURATION_MS, 'medical-cabinet': api.DURATION_MS,
        'medical-footbath': api.DURATION_MS, 'medical-ambient': 8000,
        'room-cooling-unit': api.DURATION_MS,
        'room-command-desk': api.DURATION_MS, 'room-pallet-jack': api.DURATION_MS,
        'room-restorative-mist': api.DURATION_MS,
        'room-herb-preparation-table': api.DURATION_MS })[entry.id];
      if (!Number.isFinite(duration) || duration <= 0) throw new Error('現在のE寿命がありません');
      const cycleLength = duration + 350, startedAt = performance.now();
      const draw = now => {
        if (disposed || runId !== corridorRun || active !== entry.id) { dispose(); return; }
        const total = now - startedAt, elapsed = total % cycleLength;
        const cycle = Math.floor(total / cycleLength);
        const frame = renderer.beginFrame(`${entry.id} E gallery fixture`);
        try {
          frame.clear(targetId, [.035, .052, .067, 1]);
          if (elapsed > 0 && elapsed < duration) {
            if (isMedicalAmbient) {
              const ambientZoom = .78;
              const ambientCamera = {
                x: api.ROOM.x - (viewport.width - api.ROOM.width * ambientZoom) / (2 * ambientZoom),
                y: api.ROOM.y - (viewport.height - api.ROOM.height * ambientZoom) / (2 * ambientZoom)
              };
              const now = elapsed;
              const planned = api.plan({ camera: ambientCamera, zoom: ambientZoom,
                viewport, now, mode: 'balanced', intensity: .72, reducedMotion: false });
              if (!planned) throw new Error('医療室の環境Eを計画できません');
              const result = effect.record({ frame, target: targetId, viewport,
                camera: ambientCamera, zoom: ambientZoom, now, mode: 'balanced',
                intensity: .72, reducedMotion: false, planned });
              if (!result.drawn) throw new Error('医療室の環境Eを描画できません');
            } else if (isRoomObject) {
              const authored = api.OBJECTS[entry.objectId];
              if (!authored) throw new Error('著者済みオブジェクトの設計データがありません');
              const map = { id: api.MAP_ID, objects: [{ id: authored.id,
                type: authored.type, effectKind: authored.effectKind,
                x: authored.x, y: authored.y, room: authored.room,
                visualWidth: authored.width, visualHeight: authored.height }] };
              const roomCamera = { x: authored.x - viewport.width / 2,
                y: authored.y - viewport.height / 2 };
              // Mirror the current successful-use event payload. Only the
              // selected authored object is passed to the real planner.
              const source = { id: `magic_gallery_room_${cycle}`,
                type: `object-${authored.type}`, x: authored.x, y: authored.y,
                radius: 100, targetX: null, targetY: null,
                playerId: 'gallery-preview-player', targetId: '',
                objectId: authored.id, viewerId: '', variant: '', mode: '',
                effectKind: authored.effectKind, completionKind: '',
                objectCausalId: `map-object:${authored.id}:object_use_gallery_${cycle}`,
                markerCount: 1, durationMs: 0, startedAt: 0, duration };
              const planned = api.plan({ map, event: source, now: elapsed,
                phase: 'playing', camera: roomCamera, zoom: 1, viewport,
                reducedMotion: false });
              if (!planned) throw new Error('成功使用イベントを計画できません');
              const result = effect.record({ frame, target: targetId, viewport, planned });
              if (!result.drawn) throw new Error('成功使用イベントを描画できません');
            } else if (isMedical) {
              const object = api.OBJECT, room = api.ROOM, zone = api.ZONE, medicalZoom = 1;
              const medicalCamera = {
                x: room.x + zone.x + zone.width / 2 - viewport.width / (2 * medicalZoom),
                y: room.y + zone.y + zone.height / 2 - viewport.height / (2 * medicalZoom)
              };
              // Match pushMagicEffect's successful object-use payload. The
              // client-local start clock is added after network receipt.
              const source = { id: `magic_gallery_${entry.id}_${cycle}`,
                type: `object-${object.type}`, x: Math.round(object.x), y: Math.round(object.y),
                radius: 0, targetX: null, targetY: null, playerId: 'gallery-operator',
                targetId: '', objectId: object.id, viewerId: '', variant: '', mode: '',
                effectKind: medicalEffectKind, completionKind: '', markerCount: 1,
                objectCausalId: `map-object:${object.id}:object_use_gallery_${cycle}`,
                durationMs: 0, startedAt: 0, duration: 2200 };
              const planned = api.plan({ camera: medicalCamera, zoom: medicalZoom,
                viewport, now: elapsed, effect: source, intensity: 1, reducedMotion: false });
              if (!planned) throw new Error('成功使用イベントを計画できません');
              const result = effect.record({ frame, target: targetId, viewport,
                camera: medicalCamera, zoom: medicalZoom, now: elapsed, effect: source,
                intensity: 1, reducedMotion: false, planned });
              if (!result.drawn) throw new Error('成功使用イベントを描画できません');
            } else if (isFighterSlash) {
              // Match the current captured fighter-slash event contract. This
              // fixture covers the slash subtype only, with its explicit path.
              const source = { id: `gallery-fighter-slash-${cycle}`, type: 'fighter-slash',
                variant: '', playerId: 'gallery-fighter', x: 380, y: 310,
                targetX: 660, targetY: 310, startedAt: 0, duration };
              const actor = { id: source.playerId, x: 380, y: 310,
                bodyWorld: { x: 380, y: 310 }, alive: true, ejected: false,
                inVent: false, invisible: false };
              const scene = { nowMs: elapsed, reducedMotion: false,
                events: [source], players: [actor] };
              const result = effect.record({ frame, target: targetId, viewport,
                scene, camera, zoom });
              if (result.drawn !== 1 || result.effects?.[0]?.kind !== 'slash')
                throw new Error('ファイター斬撃イベントを描画できません');
            } else if (isFloraInvisible) {
              // The server serializes this event only to its owner. Keep the
              // event audience, viewer and invisible actor bound to one ID.
              const source = { id: `gallery-flora-invisible-${cycle}`,
                type: api.TYPES.invisible, playerId: 'gallery-flora',
                viewerId: 'gallery-flora', x: 490, y: 310, radius: 120, startedAt: 0,
                duration, durationMs: duration };
              const player = { id: source.playerId, x: 490, y: 310,
                alive: true, ejected: false, inVent: false, invisible: true };
              const planned = api.plan({ effect: source, player,
                viewerId: source.viewerId, now: elapsed, phase: 'playing',
                camera, zoom, viewport, reducedMotion: false, alpha: 1 });
              if (!planned || planned.type !== api.TYPES.invisible || !planned.privateCue ||
                  planned.actorId !== source.viewerId)
                throw new Error('本人限定インビジブルイベントを計画できません');
              const result = effect.record({ frame, target: targetId, viewport, planned });
              if (!result.drawn || result.effectId !== source.id)
                throw new Error('インビジブルイベントを描画できません');
            } else if (isEmp) {
              // resolveStandardEmp in offline-server-main.js emits this event family.
              const source = { id: `gallery-emp-${cycle}`, type: 'emp', variant: 'positive',
                playerId: 'gallery-operator', x: 490, y: 310, radius: 260,
                startedAt: 0, duration, resolvedEmpPulseIds: [`gallery-pulse-${cycle}`] };
              const planned = api.plan({ effect: source, now: elapsed, phase: 'playing',
                camera, zoom, viewport, reducedMotion: false, alpha: 1 });
              if (!planned) throw new Error('EMPイベントを計画できません');
              effect.record({ frame, target: targetId, viewport, planned });
            } else if (isHacker) {
              // recoverHackerTargetStatus emits a clear visual only for "cleared".
              const source = { id: `gallery-hacker-status-${cycle}`, type: api.EVENT_TYPE,
                variant: api.OUTCOMES.cleared, playerId: 'gallery-hacker', targetId: 'gallery-target',
                x: 490, y: 310, radius: 145, startedAt: 0, duration };
              const player = { id: source.targetId, x: 490, y: 310, alive: true,
                ejected: false, inVent: false, invisible: false };
              const planned = api.plan({ effect: source, player, now: elapsed,
                phase: 'playing', camera, zoom, viewport, reducedMotion: false, alpha: 1 });
              if (!planned) throw new Error('状態回復イベントを計画できません');
              effect.record({ frame, target: targetId, viewport, planned });
            } else if (entry.id === 'barrier') {
              // apply barrier damage in offline-server-main.js emits this hit event.
              const source = { id: `gallery-barrier-${cycle}`, type: 'preparation-barrier-hit',
                variant: 'durability-hit', playerId: 'gallery-defender', targetId: 'gallery-attacker',
                x: 490, y: 310, radius: 110, startedAt: 0, duration };
              const scene = { nowMs: elapsed, reducedMotion: false, effects: [source], players: [
                { id: 'gallery-defender', x: 490, y: 310, barrierDurability: 4 },
                { id: 'gallery-attacker', x: 630, y: 310, barrierDurability: 0 }
              ] };
              const result = effect.record({ frame, target: targetId, viewport, scene, camera, zoom });
              if (result.drawn !== 1) throw new Error('バリア被弾イベントを描画できません');
            } else if (entry.id === 'bust' || entry.id === 'gravity-keeper') {
              const source = entry.id === 'bust'
                ? { id: `gallery-bust-${cycle}`, type: 'action-push', variant: 'timed-bust-start',
                    playerId: 'gallery-attacker', targetId: 'gallery-holder', x: 490, y: 310,
                    radius: 125, startedAt: 0, duration }
                : { id: `gallery-gravity-keeper-${cycle}`, type: api.TYPES.keeper,
                    variant: 'total-stop', playerId: 'gallery-keeper', x: 490, y: 310,
                    radius: 155, startedAt: 0, durationMs: duration };
              const scene = entry.id === 'bust'
                ? { nowMs: elapsed, serverNow: elapsed, reducedMotion: false, effects: [source],
                    players: [
                      { id: 'gallery-holder', x: 490, y: 310, bodyWorld: { x: 490, y: 310 },
                        alive: true, bustUntil: 0 },
                      { id: 'gallery-attacker', x: 630, y: 310, bodyWorld: { x: 630, y: 310 },
                        alive: true, bustUntil: 0 }
                    ] }
                : { nowMs: elapsed, serverNow: elapsed, reducedMotion: false,
                    effects: [source], gravityZones: [] };
              const result = effect.record({ frame, target: targetId, viewport, scene, camera, zoom });
              if (result.drawn !== 1) throw new Error(`${entry.title}イベントを描画できません`);
            } else {
              // combatScene in app.js supplies both event arrays and current bodyWorld.
              const type = entry.id === 'dodge' ? 'action-dodge' :
                entry.id === 'renki' ? 'action-renki' : 'idea-truth';
              const source = { id: `gallery-${entry.id}-${cycle}`, type,
                variant: '', playerId: 'gallery-operator', x: 490, y: 310,
                radius: entry.id === 'dodge' ? 115 : entry.id === 'renki' ? 120 : 135,
                startedAt: 0, duration: entry.id === 'idea-truth' ? 1800 : 1200 };
              const body = entry.id === 'dodge' ? { x: 514, y: 310 } : { x: 490, y: 310 };
              const scene = { nowMs: elapsed, serverNow: elapsed, reducedMotion: false,
                effects: [source], events: [source], self: null, players: [
                  { id: source.playerId, x: body.x, y: body.y, bodyWorld: body,
                    alive: true, ejected: false, inVent: false, invisible: false }
                ] };
              const result = effect.record({ frame, target: targetId, viewport, scene, camera, zoom });
              if (result.drawn !== 1) throw new Error(`${entry.title}イベントを描画できません`);
            }
          }
          frame.submit();
          document.documentElement.dataset.gpuReady = '1';
          notice.hidden = true;
        } catch (error) {
          try { frame.discard(); } catch (_) {}
          notice.hidden = false; notice.textContent = `WebGPU: ${error.message || error}`;
          document.documentElement.dataset.gpuReady = '0';
          dispose(); return;
        }
        raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
    } catch (error) {
      if (!disposed && runId === corridorRun && active === entry.id) {
        notice.hidden = false; notice.textContent = `WebGPU: ${error.message || error}`;
        document.documentElement.dataset.gpuReady = '0';
      }
      dispose();
    }
  }
  async function startCorridor(entry, runId) {
    const canvas = document.createElement('canvas');
    canvas.width = 980; canvas.height = 620; canvas.dataset.galleryNative = '1';
    canvas.setAttribute('aria-label', `${entry.title} WebGPU E 自動再生`);
    canvas.style.cssText = 'display:block;width:100%;height:100%;';
    stage.append(canvas);
    notice.hidden = true;
    let renderer = null, target = null, effect = null, raf = 0, disposed = false;
    const dispose = () => {
      if (disposed) return;
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      try { effect?.destroy(); } catch (_) {}
      try { target?.unregister(); } catch (_) {}
      try { renderer?.destroy(); } catch (_) {}
      canvas.remove();
    };
    activeCleanup = dispose;
    try {
      if (!navigator.gpu) throw new Error('このブラウザーでは WebGPU を使用できません');
      for (const src of ['webgpu-frame-core.js', 'webgpu-primitives.js', 'webgpu-compositing.js', 'webgpu-renderer.js', 'webgpu-corridor-object-use-e.js']) await loadScript(src);
      if (disposed || runId !== corridorRun || active !== entry.id) return;
      renderer = await window.DvaWebGPURenderer.create({ gpu: navigator.gpu });
      if (disposed || runId !== corridorRun || active !== entry.id) { renderer.destroy(); renderer = null; return; }
      target = renderer.registerTarget(`corridor-gallery-${runId}`, canvas, { width: 980, height: 620, logicalWidth: 980, logicalHeight: 620 });
      const api = window.DvaWebGPUCorridorObjectUseE;
      const authored = api.OBJECTS[entry.objectId];
      if (!authored) throw new Error('廊下オブジェクトの設計データがありません');
      effect = api.create({ renderer, frameOwner: renderer });
      const map = { id: api.MAP_ID, objects: [{
        id: authored.id, type: authored.type, effectKind: authored.effectKind,
        x: authored.x, y: authored.y, visualWidth: authored.width, visualHeight: authored.height,
        corridor: authored.corridor
      }] };
      const viewport = { kind: 'main', width: 980, height: 620, pixelWidth: 980, pixelHeight: 620 };
      const camera = { x: authored.x - viewport.width / 2, y: authored.y - viewport.height / 2 };
      const duration = api.DURATION_MS, cycleLength = duration + 350;
      const startedAt = performance.now();
      const draw = now => {
        if (disposed || runId !== corridorRun || active !== entry.id) { dispose(); return; }
        const cycleElapsed = (now - startedAt) % cycleLength;
        const cycle = Math.floor((now - startedAt) / cycleLength);
        const frame = renderer.beginFrame(`${entry.id} corridor E gallery`);
        try {
          frame.clear(targetId, [.035, .052, .067, 1]);
          if (cycleElapsed < duration) {
            const event = {
              id: `gallery-use:${entry.objectId}:${cycle}`, type: `object-${authored.type}`,
              objectId: authored.id, effectKind: authored.effectKind,
              x: authored.x, y: authored.y, radius: 100, playerId: 'gallery-preview',
              startedAt: 0, duration
            };
            const planned = api.plan({ map, event, now: cycleElapsed, phase: 'playing', camera, zoom: 1, viewport });
            if (planned) effect.record({ frame, target: targetId, viewport, planned });
          }
          frame.submit();
          document.documentElement.dataset.gpuReady = '1';
          notice.hidden = true;
        } catch (error) {
          try { frame.discard(); } catch (_) {}
          notice.hidden = false; notice.textContent = `WebGPU: ${error.message || error}`;
          document.documentElement.dataset.gpuReady = '0';
          dispose(); return;
        }
        raf = requestAnimationFrame(draw);
      };
      const targetId = `corridor-gallery-${runId}`;
      raf = requestAnimationFrame(draw);
    } catch (error) {
      if (!disposed && runId === corridorRun && active === entry.id) {
        notice.hidden = false; notice.textContent = `WebGPU: ${error.message || error}`;
        document.documentElement.dataset.gpuReady = '0';
      }
      dispose();
    }
  }
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
    const sourceLink = document.getElementById('selected-link');
    sourceLink.href = address(entry.page || `webgpu-e-gallery.html#${entry.id}`);
    sourceLink.hidden = entry.kind === 'corridor' || entry.kind === 'integrated';
    document.querySelectorAll('.item').forEach(button => button.setAttribute('aria-current', String(button.dataset.id === entry.id)));
    history.replaceState(null, '', `${location.pathname}${location.search}#${entry.id}`);
    if (entry.kind === 'corridor') {
      notice.hidden = false; notice.textContent = 'WebGPU を読み込んでいます…';
      startCorridor(entry, corridorRun);
      return;
    }
    if (entry.kind === 'integrated') {
      notice.hidden = false; notice.textContent = 'WebGPU を読み込んでいます…';
      startIntegrated(entry, corridorRun);
      return;
    }
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
