const $ = (selector) => document.querySelector(selector);
const API_BASE_URL = String(globalThis.DVA_API_BASE_URL || "").trim().replace(/\/+$/, "");
const URL_PARAMETERS = new URLSearchParams(location.search);
const PLATFORM_OVERRIDE = URL_PARAMETERS.get("platform");
const IS_VERIFICATION_MODE = URL_PARAMETERS.has("verify");
const IS_PLICY = PLATFORM_OVERRIDE === "plicy" || /(^|\.)plicy\.net$/i.test(location.hostname) || /(^|\.)game\.plicy\.net$/i.test(location.hostname);
const MOVEMENT_SEND_INTERVAL_MS = 28;
const UI_RENDER_INTERVAL_MS = 0;
const IMAGE_SMOOTHING_QUALITY = "high";
const SELECTION_ARROW_REPEAT_INTERVAL_MS = 110;
const CONTINUOUS_ACTION_HOLD_DELAY_MS = 420;
const CONTINUOUS_ACTION_REPEAT_INTERVAL_MS = 220;
const FIGHTER_SLASH_REPEAT_INTERVAL_MS = 620;
const TABLET_SCROLL_GESTURE_THRESHOLD_PX = 12;
const SMARTPHONE_REPAIR_STAMINA_COST = 300;
const MOVEMENT_IDLE_SESSION_ROTATE_MS = 1_500;
const ITEM_THROW_BASE_DISTANCE_CLIENT = 220;
const ITEM_THROW_MAX_CHARGE_MS_CLIENT = 3_000;
const ITEM_THROW_TARGETING_WINDOW_MS = 12_000;
const ITEM_THROW_TARGET_CURSOR_SPEED = 900;
const CLAIRVOYANCE_ZOOM = 0.65;
const MARKER_EXPLANATION_DURATION_MS = 1_450;
const ENHANCE_HOLD_STEP_MS_CLIENT = 600;
const ENHANCE_MAX_LEVEL_CLIENT = 4;

function apiUrl(path) {
  const normalized = String(path || "").startsWith("/") ? String(path) : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}

function assetUrl(path) {
  return new URL(String(path || "").replace(/^\/+/, ""), document.baseURI).href;
}

const els = {
  startScreen: $("#startScreen"),
  startHero: $("#startHero"),
  titleFxCanvas: $("#titleFxCanvas"),
  screenFlash: $("#screenFlash"),
  gameApp: $("#gameApp"),
  sensoryOverlay: $("#sensoryOverlay"),
  sensoryOverlayText: $("#sensoryOverlayText"),
  titleMenu: $("#titleMenu"),
  titlePlayButton: $("#titlePlayButton"),
  titlePlayProgress: $("#titlePlayProgress"),
  titleTacticsButton: $("#titleTacticsButton"),
  fullscreenButton: $("#fullscreenButton"),
  keybindButton: $("#keybindButton"),
  keybindOverlay: $("#keybindOverlay"),
  keybindCloseButton: $("#keybindCloseButton"),
  keybindList: $("#keybindList"),
  titleMuteButton: $("#titleMuteButton"),
  tacticsMuteButton: $("#tacticsMuteButton"),
  gameMuteButton: $("#gameMuteButton"),
  titleHomeButton: $("#titleHomeButton"),
  tacticsPanel: $("#tacticsPanel"),
  tacticsBackButton: $("#tacticsBackButton"),
  tacticsChapterList: $("#tacticsChapterList"),
  tacticsContent: $("#tacticsContent"),
  soloTrainingProgress: $("#soloTrainingProgress"),
  soloMissionGrid: $("#soloMissionGrid"),
  canvas: $("#gameCanvas"),
  actionCommandRegistry: $("#actionCommandRegistry"),
  fieldLowerRow: $("#fieldLowerRow"),
  tabletButton: $("#tabletButton"),
  tabletPanel: $("#tabletPanel"),
  tabletJoystickZone: $("#tabletJoystickZone"),
  tabletJoystick: $("#tabletJoystick"),
  tabletJoystickKnob: $("#tabletJoystickKnob"),
  tabletQuickActions: $("#tabletQuickActions"),
  tabletNinjutsuShortcut: $("#tabletNinjutsuShortcut"),
  tabletAbilityShortcut: $("#tabletAbilityShortcut"),
  tabletShootShortcut: $("#tabletShootShortcut"),
  tabletEmpShortcut: $("#tabletEmpShortcut"),
  tabletClairvoyanceShortcut: $("#tabletClairvoyanceShortcut"),
  tabletDodgeShortcut: $("#tabletDodgeShortcut"),
  tabletJumpShortcut: $("#tabletJumpShortcut"),
  tabletRenkiShortcut: $("#tabletRenkiShortcut"),
  tabletRestShortcut: $("#tabletRestShortcut"),
  tabletManaToStaminaShortcut: $("#tabletManaToStaminaShortcut"),
  tabletDonateShortcut: $("#tabletDonateShortcut"),
  tabletBranchLines: $("#tabletBranchLines"),
  tabletBranchTray: $("#tabletBranchTray"),
  tabletBranchTitle: $("#tabletBranchTitle"),
  tabletBranchList: $("#tabletBranchList"),
  tabletBranchBackButton: $("#tabletBranchBackButton"),
  tabletBranchCloseButton: $("#tabletBranchCloseButton"),
  operatorBranchPanel: $("#operatorBranchPanel"),
  operatorBranchList: $("#operatorBranchList"),
  operatorBranchCloseButton: $("#operatorBranchCloseButton"),
  mapActionButton: $("#mapActionButton"),
  expandedMapOverlay: $("#expandedMapOverlay"),
  expandedMapCanvas: $("#expandedMapCanvas"),
  expandedMapTitle: $("#expandedMapTitle"),
  teleportMapStatus: $("#teleportMapStatus"),
  mapCloseButton: $("#mapCloseButton"),
  soloMissionHud: $("#soloMissionHud"),
  soloMissionHudName: $("#soloMissionHudName"),
  soloMissionHudProgress: $("#soloMissionHudProgress"),
  joinPanel: $("#joinPanel"),
  lobbyPanel: $("#lobbyPanel"),
  lobbyTitle: $("#lobbyTitle"),
  selectPanel: $("#selectPanel"),
  statusPanel: $("#statusPanel"),
  meetingPanel: $("#meetingPanel"),
  fieldFeedPanel: $("#fieldFeedPanel"),
  sidePanel: $("#sidePanel"),
  chatNotification: $("#chatNotification"),
  chatNotificationText: $("#chatNotificationText"),
  activeEffectsPanel: $("#activeEffectsPanel"),
  activeEffectsList: $("#activeEffectsList"),
  itemControl: $("#itemControl"),
  itemSelect: $("#itemSelect"),
  itemInventoryGrid: $("#itemInventoryGrid"),
  itemUseButton: $("#itemUseButton"),
  itemThrowButton: $("#itemThrowButton"),
  enhanceReadout: $("#enhanceReadout"),
  transferTargetSelect: $("#transferTargetSelect"),
  transferCreditsAmount: $("#transferCreditsAmount"),
  transferItemButton: $("#transferItemButton"),
  transferCreditsButton: $("#transferCreditsButton"),
  nameInput: $("#nameInput"),
  namePolicy: $("#namePolicy"),
  roomCodeLabel: $("#roomCodeLabel"),
  roomInput: $("#roomInput"),
  skinSelect: $("#skinSelect"),
  joinButton: $("#joinButton"),
  offlineJoinButton: $("#offlineJoinButton"),
  publicRoomsHeader: $("#publicRoomsHeader"),
  refreshRoomsButton: $("#refreshRoomsButton"),
  roomList: $("#roomList"),
  addBotButton: $("#addBotButton"),
  startButton: $("#startButton"),
  analyticsPanel: $("#analyticsPanel"),
  analyticsToggleButton: $("#analyticsToggleButton"),
  lobbyList: $("#lobbyList"),
  hostBadge: $("#hostBadge"),
  selectTimer: $("#selectTimer"),
  selectTeamText: $("#selectTeamText"),
  operatorList: $("#operatorList"),
  operatorDetail: $("#operatorDetail"),
  debugForceEndButton: $("#debugForceEndButton"),
  leaveRoomButton: $("#leaveRoomButton"),
  settingsPanel: $("#settingsPanel"),
  mapSelect: $("#mapSelect"),
  hostTeamSelect: $("#hostTeamSelect"),
  attackerCountInput: $("#attackerCountInput"),
  taskCountInput: $("#taskCountInput"),
  killCooldownInput: $("#killCooldownInput"),
  killRangeInput: $("#killRangeInput"),
  discussionTimeInput: $("#discussionTimeInput"),
  votingTimeInput: $("#votingTimeInput"),
  emergencyLimitInput: $("#emergencyLimitInput"),
  anonymousVotesInput: $("#anonymousVotesInput"),
  confirmEjectsInput: $("#confirmEjectsInput"),
  roleName: $("#roleName"),
  specialName: $("#specialName"),
  objectiveText: $("#objectiveText"),
  sabotageAlert: $("#sabotageAlert"),
  taskButton: $("#taskButton"),
  ninjutsuButton: $("#ninjutsuButton"),
  shootButton: $("#shootButton"),
  weaponButton: $("#weaponButton"),
  dodgeButton: $("#dodgeButton"),
  teleportButton: $("#teleportButton"),
  teleportControl: $("#teleportControl"),
  teleportModeSelect: $("#teleportModeSelect"),
  teleportTargetSelect: $("#teleportTargetSelect"),
  emergencyButton: $("#emergencyButton"),
  dashButton: $("#dashButton"),
  slowWalkButton: $("#slowWalkButton"),
  sleepButton: $("#sleepButton"),
  renkiButton: $("#renkiButton"),
  empButton: $("#empButton"),
  empPhaseControl: $("#empPhaseControl"),
  empPhaseSelect: $("#empPhaseSelect"),
  cameraButton: $("#cameraButton"),
  nextCameraButton: $("#nextCameraButton"),
  healButton: $("#healButton"),
  alchemyButton: $("#alchemyButton"),
  alchemyControl: $("#alchemyControl"),
  alchemyChoiceGrid: $("#alchemyChoiceGrid"),
  alchemySelectionText: $("#alchemySelectionText"),
  alchemySelect: $("#alchemySelect"),
  instantWarpButton: $("#instantWarpButton"),
  fireJutsuButton: $("#fireJutsuButton"),
  substitutionStatusButton: $("#substitutionStatusButton"),
  gritStatusButton: $("#gritStatusButton"),
  reasonButton: $("#reasonButton"),
  operatorAbilityButton: $("#operatorAbilityButton"),
  jumpButton: $("#jumpButton"),
  operatorBranchTitle: $("#operatorBranchTitle"),
  contextActionButton: $("#contextActionButton"),
  hackerAbilityDock: $("#hackerAbilityDock"),
  hackerAbilityGrid: $("#hackerAbilityGrid"),
  hackerTargetButton: $("#hackerTargetButton"),
  hackerCategoryPreviousButton: $("#hackerCategoryPreviousButton"),
  hackerCategoryNextButton: $("#hackerCategoryNextButton"),
  hackerCategoryLabel: $("#hackerCategoryLabel"),
  gunnerReloadButton: $("#gunnerReloadButton"),
  vendingPanel: $("#vendingPanel"),
  magicInventory: $("#magicInventory"),
  sabotageControl: $("#sabotageControl"),
  sabotageSelect: $("#sabotageSelect"),
  sabotageButton: $("#sabotageButton"),
  utilityControl: $("#utilityControl"),
  utilitySelect: $("#utilitySelect"),
  utilityButton: $("#utilityButton"),
  utilityPanel: $("#utilityPanel"),
  meetingReason: $("#meetingReason"),
  meetingTimer: $("#meetingTimer"),
  luminousPanel: $("#luminousPanel"),
  luminousEffectStage: $("#luminousEffectStage"),
  luminousStatus: $("#luminousStatus"),
  luminousList: $("#luminousList"),
  voteList: $("#voteList"),
  chatTab: $("#chatTab"),
  chatFeed: $("#chatFeed"),
  chatForm: $("#chatForm"),
  chatInput: $("#chatInput"),
  toast: $("#toast"),
  mysteryReveal: $("#mysteryReveal"),
  mysteryRevealResult: $("#mysteryRevealResult"),
  endOverlay: $("#endOverlay"),
  resultConfetti: $("#resultConfetti"),
  endTitle: $("#endTitle"),
  endReason: $("#endReason"),
  resultRanking: $("#resultRanking"),
  resetButton: $("#resetButton")
};

// Keep the field canvas synchronized with the compositor. A desynchronized
// context can expose the cleared or partially drawn frame while prop-heavy
// scenes are still being painted, which presents as a full-field flash.
const ctx = els.canvas.getContext("2d", { alpha: false });
const mapCtx = els.expandedMapCanvas.getContext("2d");
const titleFxCtx = els.titleFxCanvas.getContext("2d");
const CAMERA_ZOOM = 1.65;
const SR_SCOPE_ZOOM = 0.92;
const SFX_ASSETS = Object.freeze({
  click: ["ui-click.wav"],
  select: ["ui-confirm.wav"],
  round: ["round.wav"],
  start: ["start.wav"],
  task: ["task.wav"],
  object: ["object.wav"],
  meeting: ["meeting.wav"],
  alert: ["alert.wav"],
  impact: ["impact.wav"],
  fighterCounter: ["fighter-counter.wav"],
  dodge: ["dodge.wav"],
  teleport: ["teleport.wav"],
  kill: ["kill.wav"],
  death: ["death.wav"],
  step: ["footstep-1.wav", "footstep-2.wav"],
  dashStep: ["dash-step-1.wav", "dash-step-2.wav"],
  worldStep: ["footstep-1.wav", "footstep-2.wav"],
  worldDash: ["dash-step-1.wav", "dash-step-2.wav"],
  emp: ["emp.wav"],
  fireJutsu: ["fire-jutsu.wav"],
  substitution: ["substitution.wav"],
  ranking: ["ranking.wav"],
  win: ["win.wav"],
  lose: ["lose.wav"],
  gunHandgun: ["gun-handgun.wav"],
  gunSmg: ["gun-smg.wav"],
  gunAssault: ["gun-assault.wav"],
  gunSniper: ["gun-sniper.wav"]
});
const SFX_GAINS = Object.freeze({
  click: 0.22,
  select: 0.32,
  round: 0.34,
  start: 0.34,
  task: 0.32,
  object: 0.28,
  meeting: 0.34,
  alert: 0.30,
  impact: 0.42,
  fighterCounter: 0.40,
  dodge: 0.34,
  teleport: 0.38,
  kill: 0.48,
  death: 0.46,
  step: 0.18,
  dashStep: 0.26,
  worldStep: 0.24,
  worldDash: 0.32,
  worldDrone: 0.20,
  emp: 0.46,
  fireJutsu: 0.44,
  substitution: 0.40,
  ranking: 0.38,
  win: 0.38,
  lose: 0.36,
  gunHandgun: 0.46,
  gunSmg: 0.42,
  gunAssault: 0.50,
  gunSniper: 0.56
});
document.documentElement.dataset.runtimeProfile = "maximum-fidelity";
const storage = {
  name: "dva_name",
  room: "dva_room",
  player: "dva_player",
  skin: "dva_skin",
  debugForceEnd: "dva_debug_force_end",
  musicMuted: "dva_music_muted",
  gameMuted: "dva_game_muted",
  clientId: "dva_client_id",
  soloMissions: "dva_solo_missions_v1",
  analyticsDisabled: "dva_analytics_disabled",
  analyticsQueue: "dva_analytics_queue_v1",
  developerIdentity: "dva_developer_identity_v1",
  tabletMode: "dva_tablet_mode"
};
storage.cpuGravityHint = "dva_cpu_gravity_hint";

const GUNNER_WEAPON_MOTION_IDS = Object.freeze(["handgun", "smg", "assault", "sniper", "taser"]);
const HACKER_ROOT_OPERATOR_TYPES = Object.freeze(["fighter", "gravity", "flora", "gunner", "quantum"]);

const state = {
  screen: "title",
  titleFx: {
    routeGlints: [],
    atmosphere: [],
    lastRouteAt: 0,
    lastAtmosphereAt: 0,
    width: 0,
    height: 0
  },
  data: null,
  soloMissionStarting: false,
  roomId: localStorage.getItem(storage.room) || "",
  playerId: localStorage.getItem(storage.player) || "",
  pendingSkinId: "",
  skinRequestSeq: 0,
  keys: new Set(),
  pad: new Set(),
  pointerPads: new Map(),
  lastMoveSent: 0,
  lastMovementPumpAt: 0,
  moveRequestSeq: 0,
  lastMoveAppliedSeq: 0,
  lastMoveAppliedClock: 0,
  lastMovementServerNow: 0,
  lastMovementSentSignature: "",
  movementIdleStartedAt: 0,
  movementSession: globalThis.crypto?.randomUUID?.() || `move-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  movementSessionStartedAt: Date.now(),
  movementActive: false,
  movementStopPendingSeq: 0,
  focusResyncing: false,
  focusResyncPromise: null,
  pollInFlight: false,
  realtime: null,
  movementQueue: null,
  frameDriver: null,
  lastStateServerNow: 0,
  lastStateReceivedAt: 0,
  toastTimer: null,
  mysteryRevealTimer: null,
  fieldFeedOpen: false,
  lastRoomChatId: "",
  lastRoomChatRoomId: "",
  chatNotificationTimer: null,
  roomsLoadedAt: 0,
  settingsDirty: false,
  textures: createTextures(),
  motion: new Map(),
  facing: new Map(),
  walkAnimations: new Map(),
  physicalMotionPhases: new Map(),
  characterActions: new Map(),
  renderPlayers: new Map(),
  camera: { x: 0, y: 0, vx: 0, vy: 0, initialized: false, mode: "", frame: -1 },
  frameNow: 0,
  lastFrameAt: 0,
  killEffects: [],
  hitEffects: [],
  magicEffects: [],
  worldSoundEffects: [],
  expandedMapOpen: false,
  tabletOpen: false,
  tabletResumeAfterMap: false,
  tabletStick: { pointerId: null, dx: 0, dy: 0, strength: 0, mode: "idle" },
  tabletBranchGroup: "",
  tabletBranchPath: "",
  tabletBranchRenderKey: "",
  hackerTargetId: "",
  hackerDockRenderKey: "",
  tabletGesture: {
    pointerId: null,
    sourceButton: null,
    hoverButton: null,
    submenuTimer: 0,
    suppressClick: false
  },
  continuousActionHold: { pointerId: null, button: null, timer: 0 },
  continuousActionKeyHold: { code: "", repeat: null, timer: 0, repeatInterval: 0 },
  continuousActionSuppressClicks: new WeakMap(),
  continuousActionKeyAt: new Map(),
  enhanceHold: { kind: "", pointerId: null, startedAt: 0, timer: 0 },
  throwTargeting: {
    active: false,
    itemId: "",
    holdMs: 0,
    targetX: 0,
    targetY: 0,
    startedAt: 0,
    expiresAt: 0,
    lastFrameAt: 0,
    frame: 0,
    directionKeys: new Set()
  },
  clairvoyance: { active: false, x: 0, y: 0, lastFrameAt: 0, frame: 0 },
  markerHitTargets: [],
  markerExplanation: null,
  operatorBranchesOpen: false,
  operatorBranchType: "",
  borrowedOperatorType: "gravity",
  borrowedAbilityModes: { gravity: "accelerate", flora: "heal", gunner: "hover-sprint" },
  arrowRepeatKey: "",
  arrowRepeatAt: 0,
  keybindOpen: false,
  teleportTargeting: false,
  teleportBorrowed: false,
  teleportTargetId: "",
  instantWarpTargeting: false,
  cameraViewIndex: -1,
  dashHeld: false,
  slowWalkHeld: false,
  jumpKeyDownAt: 0,
  jumpPreparing: false,
  jumpPreparePromise: null,
  jumpPrepareDirection: { dx: 0, dy: 1 },
  jumpPointerId: null,
  jumpPointerDownAt: 0,
  jumpSuppressClickUntil: 0,
  gunTriggerHeld: false,
  gunTriggerPointerId: null,
  gunFireStartPromise: null,
  renderDrone: null,
  operatorRenderKey: "",
  resultCelebrationKey: "",
  mapPointer: null,
  actionSelectionId: "",
  hackerSelectedRecipeId: "",
  hackerSelectedByCategory: Object.create(null),
  hackerCategoryId: "generate-supply",
  hackerDockVisible: false,
  hackerGenerationInFlight: false,
  hackerCooldownWakeTimer: 0,
  hackerCooldownWakeAt: 0,
  activeScrollRegion: null,
  keyboardContext: "",
  keyboardElement: null,
  debugForceEndEnabled: localStorage.getItem(storage.debugForceEnd) === "1",
  checkpointSeen: new Set(),
  analyticsExitReported: false,
  analyticsFlushInFlight: false,
  offlineClient: null,
  offlineMode: false,
  onlineAvailable: false,
  onlineAvailabilityChecked: false,
  onlineAvailabilityCheckInFlight: false,
  startupFullscreenPending: false,
  tacticsChapterId: "tactics-basics",
  phaseUiKey: "",
  actionLayoutKey: "",
  activeEffectsRenderKey: "",
  inventoryVisualWeapon: "",
  vendingRenderKey: "",
  itemRenderKey: "",
  utilityRenderKey: "",
  lastCanvasStageError: "",
  lastCanvasItemError: "",
  lastUiRenderAt: 0,
  uiRenderTimer: 0,
  drawViewport: null,
  minimapFrameCache: null,
  minimapLastDrawAt: 0,
  roomListKey: "",
  audio: {
    context: null,
    master: null,
    compressor: null,
    sfxBuffers: new Map(),
    sfxLoading: null,
    sfxCursor: new Map(),
    unlocked: false,
    muted: IS_VERIFICATION_MODE || localStorage.getItem(storage.gameMuted) === "1" || localStorage.getItem(storage.musicMuted) === "1",
    currentBgm: null,
    titleBgm: createBgmAudio(assetUrl("assets/bgm-title.mp3"), 0.34)
  }
};

const roleLabels = {
  defender: "ディフェンダー",
  attacker: "アタッカー",
  unassigned: "",
  unknown: "不明"
};

const specialLabels = {
  fighter: "ファイター"
};

specialLabels.teleport = "グラビティ";
specialLabels.gunner = "ガンナー";
specialLabels.flora = "フローラ";
specialLabels.alchemist = "ハッカー";
specialLabels.quantum = "量子制御";

const sabotageLabels = {
  comms: "通信妨害",
  reactor: "コア異常",
  oxygen: "大気漏れ",
  doors: "区画封鎖"
};

const utilityLabels = {
  admin: "人数情報を見る",
  vitals: "生体情報を見る",
  doorlog: "通行記録を見る"
};

const VENDING_PRODUCT_DESCRIPTIONS = Object.freeze({
  "mineral-water": "燃焼解除・SP回復。投擲時は周囲へ適用",
  antidote: "毒を解除。投擲時は周囲へ適用",
  molotov: "着弾地点を燃焼。長押しで範囲強化",
  evade: "回避の有効時間を0.25秒延長",
  speed: "加速を1段階追加",
  warp: "指定地点へ即時移動する消耗品",
  mystery: "幸運／直観に応じた強化または弱体",
  fire: "範囲へ継続燃焼。長押しで拡散",
  substitution: "次に受ける攻撃を無効化して転移",
  grit: "次の確殺をボディダメージへ変換",
  heal: "負傷回復。無傷時はオーバーヒール",
  reason: "対象の踏ん張りを全無効化。数に応じ反動",
  mana: "マナを1回復",
  railgun: "遮蔽物を貫通する直線破壊射撃",
  "particle-cannon": "操作可能な破壊ビームを継続放射",
  excalibur: "前方半面を破壊し、使用者も死亡",
  exile: "クローンを遠隔操作し全域破壊を回避",
  computer: "生存者のスマホ位置情報を取得",
  handgun: "低反動の近中距離銃",
  smg: "高レート・近距離向け・距離減衰大",
  assault: "中レート・距離減衰小の標準銃",
  sniper: "長射程・確殺・低レート",
  taser: "低ダメージ・移動速度低下",
  mercury: "通常使用は有害。投擲時は着地点へ毒を拡散",
  lead: "通常使用は有害。投擲時は着地点へ毒を拡散",
  uranium: "量子制御の核分裂素材。通常使用は有害",
  plutonium: "量子制御の核分裂素材。通常使用は有害",
  ice: "投擲できる低温変換済みの水",
  "heated-water": "投擲できる高温変換済みの水",
  rpg: "周囲を攻撃する使い切り重火器",
  missile: "最寄り対象を攻撃する使い切り重火器"
});

const alchemyRecipes = [
  { id: "stamina", label: "スタミナ", output: "+350SP" },
  { id: "heal", label: "回復", output: "負傷治療／オーバーヒール" },
  { id: "fire", label: "火遁の術", output: VENDING_PRODUCT_DESCRIPTIONS.fire },
  { id: "substitution", label: "変わり身の術", output: VENDING_PRODUCT_DESCRIPTIONS.substitution },
  { id: "warp", label: "即時ワープ", output: VENDING_PRODUCT_DESCRIPTIONS.warp },
  { id: "grit", label: "踏ん張り", output: VENDING_PRODUCT_DESCRIPTIONS.grit },
  { id: "reason", label: "押し込み", output: "対象の踏ん張りを全無効化 / 1回につき自身へ0.5ダメージ" },
  { id: "mercury", label: "水銀瓶", output: VENDING_PRODUCT_DESCRIPTIONS.mercury, asset: "quantum-mercury" },
  { id: "lead", label: "鉛瓶", output: VENDING_PRODUCT_DESCRIPTIONS.lead, asset: "quantum-lead" },
  { id: "uranium", label: "ウラン容器", output: VENDING_PRODUCT_DESCRIPTIONS.uranium, asset: "quantum-uranium" },
  { id: "plutonium", label: "プルトニウム容器", output: VENDING_PRODUCT_DESCRIPTIONS.plutonium, asset: "quantum-plutonium" },
  { id: "mineral-water", label: "ミネラルウォーター", output: VENDING_PRODUCT_DESCRIPTIONS["mineral-water"], asset: "mineral-water" },
  { id: "antidote", label: "解毒剤", output: VENDING_PRODUCT_DESCRIPTIONS.antidote, asset: "antidote" },
  { id: "molotov", label: "火炎瓶", output: VENDING_PRODUCT_DESCRIPTIONS.molotov, asset: "molotov" },
  { id: "vending-evade", label: "回避拡張", output: "回避時間 +0.25秒", asset: "grit" },
  { id: "vending-speed", label: "アクセラレート飲料", output: "移動速度 ×1.10（重複可）", asset: "warp" },
  { id: "vending-mystery", label: "ミステリー", output: "幸運値に応じたランダム効果", asset: "reason" },
  { id: "vending-mana", label: "マナポーション", output: "マナ +1", asset: "mana" },
  { id: "vending-railgun", label: "レールガン", output: "全遮蔽物貫通兵器", asset: "railgun" },
  { id: "vending-particle-cannon", label: "荷電粒子砲", output: "破壊ビームを継続放射", asset: "particle-cannon" },
  { id: "vending-excalibur", label: "エクスカリバー", output: "前方半面を破壊", asset: "excalibur" },
  { id: "vending-exile", label: "亡命", output: "遠隔クローンを運用", asset: "exile" },
  { id: "vending-computer", label: "パソコン", output: "生存者の位置情報を取得", asset: "computer" },
  { id: "vending-handgun", label: "ハンドガン", output: "武器と弾薬を生成", asset: "handgun" },
  { id: "vending-smg", label: "サブマシンガン", output: "武器と弾薬を生成", asset: "smg" },
  { id: "vending-assault", label: "アサルトライフル", output: "武器と弾薬を生成", asset: "assault" },
  { id: "vending-sniper", label: "スナイパーライフル", output: "武器と弾薬を生成", asset: "sniper" },
  { id: "vending-taser", label: "テーザー銃", output: "武器と弾薬を生成", asset: "taser" },
  { id: "revive", label: "人体生成", output: "死者を一度だけ復活 / 0MP" },
  { id: "hack-credits-delete", label: "クレジット削除", output: "対象のクレジットを0にする", asset: "hack-credits-delete" },
  { id: "hack-credits-duplicate", label: "クレジット増殖", output: "対象のクレジットを複製", asset: "hack-credits-duplicate" },
  { id: "hack-items-delete", label: "アイテム削除", output: "対象の所持品を削除", asset: "hack-items-delete" },
  { id: "hack-items-duplicate", label: "アイテム増殖", output: "対象の所持品を複製", asset: "hack-items-duplicate" },
  { id: "hack-hp-delete", label: "HP削除", output: "対象のHPを0にする", asset: "hack-hp-delete" },
  { id: "hack-hp-duplicate", label: "HP増殖", output: "対象のHPを回復", asset: "hack-hp-duplicate" },
  { id: "hack-mana-delete", label: "マナ削除", output: "対象のマナを0にする", asset: "hack-mana-delete" },
  { id: "hack-mana-duplicate", label: "マナ増殖", output: "対象のマナを複製", asset: "hack-mana-duplicate" },
  { id: "hack-status-recover", label: "状態異常回復", output: "対象の状態異常を解除", asset: "hack-status-recover" },
  { id: "invention-excalibur", label: "エクスカリバー", output: "前方半面を破壊", kind: "invention", inventoryId: "excalibur" },
  { id: "invention-railgun", label: "レールガン", output: "全遮蔽物貫通", kind: "invention", inventoryId: "railgun" },
  { id: "invention-particle-cannon", label: "荷電粒子砲", output: "破壊ビームを継続放射", kind: "invention", inventoryId: "particle-cannon" }
];

function hackerRecipeCooldownMs(recipeOrId) {
  const id = typeof recipeOrId === "string" ? recipeOrId : String(recipeOrId?.id || "");
  if (id === "revive") return 36_000;
  if (id === "hack-hp-delete") return 28_000;
  if (id.startsWith("hack-")) return 18_000;
  if (id.startsWith("object-")) return 12_000;
  if (id.startsWith("vending-")) return 9_000;
  return 7_000;
}

function hackerRecipePresentation(recipe) {
  const description = String(recipe?.output || "").trim();
  const cooldown = `クールタイム ${Math.round(hackerRecipeCooldownMs(recipe) / 1000)}秒`;
  return description ? `${description} / ${cooldown}` : cooldown;
}

const generatedItemTextureFiles = new Map([
  ["gold", { file: "item-gold.webp" }],
  ["mercury", { file: "item-mercury.webp" }],
  ["quantum-mercury", { file: "item-mercury.webp" }],
  ["lead", { file: "item-lead.webp" }],
  ["quantum-lead", { file: "item-lead.webp" }],
  ["uranium", { file: "item-uranium.webp" }],
  ["quantum-uranium", { file: "item-uranium.webp" }],
  ["plutonium", { file: "item-plutonium.webp" }],
  ["quantum-plutonium", { file: "item-plutonium.webp" }],
  ["mineral-water", { file: "item-mineral-water.webp" }],
  ["antidote", { file: "item-antidote.webp" }],
  ["molotov", { file: "item-molotov.webp" }],
  ["ice", { file: "item-ice.webp" }],
  ["heated-water", { file: "item-heated-water.webp" }],
  ["stamina", { file: "item-stamina-cell.webp" }],
  ["heal", { file: "item-heal.webp" }],
  ["fire", { file: "item-fire-jutsu.webp" }],
  ["fire-jutsu", { file: "item-fire-jutsu.webp" }],
  ["substitution", { file: "status-substitution.webp" }],
  ["warp", { file: "status-instant-warp.webp" }],
  ["instant-warp", { file: "status-instant-warp.webp" }],
  ["grit", { file: "status-stand-firm.webp" }],
  ["reason", { file: "status-push.webp" }],
  ["mana", { file: "mana-potion.webp" }],
  ["railgun", { file: "alchemy-railgun.webp" }],
  ["particle-cannon", { file: "alchemy-particle-cannon.webp" }],
  ["excalibur", { file: "alchemy-excalibur.webp" }],
  ["exile", { file: "exile-clone.webp" }],
  ["computer", { file: "item-computer-v404.png" }],
  ["handgun", { file: "gunner-weapons-atlas.webp", size: "500% 100%", position: "0 0" }],
  ["smg", { file: "gunner-weapons-atlas.webp", size: "500% 100%", position: "25% 0" }],
  ["assault", { file: "gunner-weapons-atlas.webp", size: "500% 100%", position: "50% 0" }],
  ["sniper", { file: "gunner-weapons-atlas.webp", size: "500% 100%", position: "75% 0" }],
  ["taser", { file: "gunner-taser.webp" }],
  ["rpg", { file: "gunner-rpg.webp" }],
  ["missile", { file: "gunner-missile.webp" }],
  ["revive", { file: "human-transmutation-sd-silhouette-v407.png", size: "contain" }],
  ["hack-credits-delete", { file: "hack-credits-delete.webp" }],
  ["hack-credits-duplicate", { file: "hack-credits-duplicate.webp" }],
  ["hack-items-delete", { file: "hack-items-delete.webp" }],
  ["hack-items-duplicate", { file: "hack-items-duplicate.webp" }],
  ["hack-hp-delete", { file: "hack-hp-delete.webp" }],
  ["hack-hp-duplicate", { file: "hack-hp-duplicate.webp" }],
  ["hack-mana-delete", { file: "hack-mana-delete.webp" }],
  ["hack-mana-duplicate", { file: "hack-mana-duplicate.webp" }],
  ["hack-status-recover", { file: "flora-self-heal-v336.png" }],
  ["invention-excalibur", { file: "alchemy-excalibur.webp" }],
  ["invention-railgun", { file: "alchemy-railgun.webp" }],
  ["invention-particle-cannon", { file: "alchemy-particle-cannon.webp" }]
]);

function applyGeneratedItemTexture(button, itemId) {
  const normalizedId = String(itemId || "").replace(/^(?:vending-|weapon:|invention:|heavy:)/, "");
  const texture = generatedItemTextureFiles.get(normalizedId);
  if (!texture) return false;
  const icon = button?.querySelector?.(".alchemy-choice-icon, .vending-item-icon");
  if (!icon) return false;
  const base = texture.file.startsWith("room-") || texture.file.startsWith("facility-")
    ? "assets/"
    : "assets/generated/";
  icon.style.backgroundImage = `url("${assetUrl(`${base}${texture.file}?v=hacker-icons-v385`)}")`;
  icon.style.backgroundPosition = texture.position || "center";
  icon.style.backgroundSize = texture.size || "contain";
  icon.style.backgroundRepeat = "no-repeat";
  return true;
}

alchemyRecipes.push(
  { id: "borrowed-fighter", label: "ファイター", output: "root借用中", kind: "borrowed", inventoryId: "fighter" },
  { id: "borrowed-gravity", label: "グラビティ", output: "root借用中", kind: "borrowed", inventoryId: "gravity" },
  { id: "borrowed-flora", label: "フローラ", output: "root借用中", kind: "borrowed", inventoryId: "flora" },
  { id: "borrowed-gunner", label: "ガンナー", output: "root借用中", kind: "borrowed", inventoryId: "gunner" },
  { id: "borrowed-quantum", label: "量子制御", output: "root借用中", kind: "borrowed", inventoryId: "quantum" }
);

const hackerRecipeCategories = [
  { id: "generate-supply", label: "生成・物資" },
  { id: "weapon", label: "武器" },
  { id: "generate-tech", label: "生成・技術" },
  { id: "hack", label: "対象操作" },
  { id: "invention", label: "発明品" }
];

function hackerRecipeCategory(recipe) {
  if (recipe?.kind === "invention") return "invention";
  if (recipe?.id?.startsWith("hack-")) return "hack";
  const weaponRecipes = new Set([
    "vending-railgun", "vending-particle-cannon", "vending-excalibur",
    "vending-handgun", "vending-smg", "vending-assault", "vending-sniper", "vending-taser"
  ]);
  if (weaponRecipes.has(recipe?.id)) return "weapon";
  const technologyRecipes = new Set([
    "vending-evade", "vending-speed", "vending-mystery", "vending-mana",
    "vending-exile", "vending-computer", "vending-molotov", "revive"
  ]);
  return technologyRecipes.has(recipe?.id) ? "generate-tech" : "generate-supply";
}

function isHackerPlayer(player) {
  return Boolean(player && (
    player.special === "alchemist" ||
    player.operatorId === "attacker-alchemist"
  ));
}

function availableHackerRecipes(self = state.data?.self) {
  return alchemyRecipes.filter((recipe) =>
    recipe.kind !== "borrowed" &&
    recipe.kind !== "invention" &&
    alchemyRecipeAvailable(recipe, self)
  );
}

function alchemyRecipeAvailable(recipe, self = state.data?.self) {
  if (!recipe?.kind) return true;
  if (recipe.kind === "invention") return (self?.inventions || []).includes(recipe.inventoryId);
  if (recipe.kind === "borrowed") return availableBorrowedOperatorTypes(self).includes(recipe.inventoryId);
  return true;
}

function ensureDynamicAlchemyChoices() {
  for (const recipe of alchemyRecipes) {
    if (recipe.kind === "invention") continue;
    if (!els.alchemySelect.querySelector(`option[value="${recipe.id}"]`)) {
      const option = document.createElement("option");
      option.value = recipe.id;
      option.textContent = recipe.label;
      els.alchemySelect.append(option);
    }
    if (recipe.kind === "borrowed") continue;
    const existingButton = els.alchemyChoiceGrid.querySelector(`[data-alchemy-choice="${recipe.id}"]`);
    if (existingButton) {
      const detail = existingButton.querySelector("small");
      if (detail) detail.textContent = hackerRecipePresentation(recipe);
      existingButton.setAttribute("aria-label", `${recipe.label}: ${hackerRecipePresentation(recipe)}`);
    } else {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "alchemy-choice alchemy-inventory-choice";
      button.dataset.alchemyChoice = recipe.id;
      button.dataset.atlasCell = recipe.kind === "invention" ? "3" : "1";
      if (recipe.asset) button.dataset.alchemyAsset = recipe.asset;
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-label", `${recipe.label}: ${hackerRecipePresentation(recipe)}`);
      button.innerHTML = `<span class="alchemy-choice-icon" aria-hidden="true"></span><span><strong>${escapeHtml(recipe.label)}</strong><small>${escapeHtml(hackerRecipePresentation(recipe))}</small></span>`;
      els.alchemyChoiceGrid.append(button);
    }
  }
}

function syncAlchemyInventoryChoices(self = state.data?.self) {
  for (const recipe of alchemyRecipes.filter((entry) => entry.kind)) {
    if (recipe.kind === "invention") continue;
    const visible = alchemyRecipeAvailable(recipe, self);
    const button = els.alchemyChoiceGrid.querySelector(`[data-alchemy-choice="${recipe.id}"]`);
    if (button) button.hidden = !visible;
  }
  const selected = alchemyRecipes.find((recipe) => recipe.id === els.alchemySelect.value);
  if (selected?.kind && (selected.kind === "invention" || !alchemyRecipeAvailable(selected, self))) selectAlchemyRecipe("stamina");
}

function hackerTargets(data = state.data) {
  if (!data?.self) return [];
  return data.players.filter((player) =>
    player.alive &&
    !player.ejected
  );
}

function ensureHackerTarget(data = state.data) {
  const targets = hackerTargets(data);
  if (!targets.some((player) => player.id === state.hackerTargetId)) {
    state.hackerTargetId = targets[0]?.id || "";
  }
  return targets.find((player) => player.id === state.hackerTargetId) || null;
}

function cycleHackerTarget(direction = 1) {
  const targets = hackerTargets();
  if (!targets.length) {
    state.hackerTargetId = "";
    renderHackerAbilityDock(state.data);
    return false;
  }
  const currentIndex = targets.findIndex((player) => player.id === state.hackerTargetId);
  const nextIndex = (Math.max(0, currentIndex) + direction + targets.length) % targets.length;
  state.hackerTargetId = targets[nextIndex].id;
  renderHackerAbilityDock(state.data, true);
  els.hackerTargetButton.focus({ preventScroll: true });
  const selected = targets[nextIndex];
  showToast(`ハッカー対象: ${selected.name}${selected.id === state.data?.selfId ? "（自分）" : ""}`);
  return true;
}

function hackerActionButtons() {
  return [...els.hackerAbilityGrid.querySelectorAll("[data-hacker-recipe]")];
}

function syncHackerSelectedName() {}

function selectHackerAction(recipeId, focus = true, behavior = "smooth") {
  const buttons = hackerActionButtons();
  if (!buttons.length) {
    state.hackerSelectedRecipeId = "";
    syncHackerSelectedName();
    return false;
  }
  const selected = buttons.find((button) => button.dataset.hackerRecipe === recipeId) || buttons[0];
  state.hackerSelectedRecipeId = selected.dataset.hackerRecipe || "";
  if (state.hackerSelectedRecipeId) {
    state.hackerSelectedByCategory[state.hackerCategoryId] = state.hackerSelectedRecipeId;
  }
  syncHackerSelectedName();
  buttons.forEach((button) => {
    const active = button === selected;
    button.classList.toggle("hacker-key-selected", active);
    button.setAttribute("aria-current", active ? "true" : "false");
  });
  selected.scrollIntoView({ block: "nearest", inline: "nearest", behavior });
  if (focus) {
    if (selected.disabled) els.hackerAbilityDock.focus({ preventScroll: true });
    else selected.focus({ preventScroll: true });
  }
  return true;
}

function cycleHackerAction(direction = 1, step = 1) {
  const buttons = hackerActionButtons();
  if (!buttons.length) return false;
  const currentIndex = buttons.findIndex((button) => button.dataset.hackerRecipe === state.hackerSelectedRecipeId);
  const startIndex = currentIndex >= 0 ? currentIndex : direction > 0 ? -1 : 0;
  const nextIndex = (startIndex + direction * Math.max(1, step) % buttons.length + buttons.length) % buttons.length;
  return selectHackerAction(buttons[nextIndex].dataset.hackerRecipe, true, step > 1 ? "auto" : "smooth");
}

function navigateHackerAction(key) {
  const buttons = hackerActionButtons();
  if (!buttons.length) return false;
  const current = buttons.find((button) => button.dataset.hackerRecipe === state.hackerSelectedRecipeId) ||
    (buttons.includes(document.activeElement) ? document.activeElement : buttons[0]);
  const next = spatialSelectionCandidate(buttons, current, key);
  return next ? selectHackerAction(next.dataset.hackerRecipe, true) : false;
}

function selectHackerCategory(categoryId, direction = 0) {
  const recipes = availableHackerRecipes();
  const categories = hackerRecipeCategories.filter((category) =>
    recipes.some((recipe) => hackerRecipeCategory(recipe) === category.id)
  );
  if (!categories.length) return false;
  const currentIndex = Math.max(0, categories.findIndex((category) => category.id === state.hackerCategoryId));
  const category = categoryId
    ? categories.find((candidate) => candidate.id === categoryId)
    : categories[(currentIndex + direction + categories.length) % categories.length];
  if (!category) return false;
  state.hackerCategoryId = category.id;
  state.hackerSelectedRecipeId = state.hackerSelectedByCategory[category.id] || "";
  state.hackerDockRenderKey = "";
  renderHackerAbilityDock(state.data, true);
  return true;
}

function activateHackerActionSelection() {
  const button = els.hackerAbilityGrid.querySelector(
    `[data-hacker-recipe="${CSS.escape(state.hackerSelectedRecipeId || "")}"]`
  );
  if (!button || button.disabled) {
    showToast(button ? "この適用内容は現在実行できません。" : "適用内容を選択してください。");
    return false;
  }
  void executeHackerRecipe(button.dataset.hackerRecipe);
  return true;
}

function alchemyRecipeManaCost(recipe) {
  return 0;
}

async function runAlchemyGeneration(recipeId, targetId = "") {
  const recipe = alchemyRecipes.find((entry) => entry.id === recipeId);
  if (!recipe) {
    const fallback = availableHackerRecipes()[0] || alchemyRecipes.find((entry) => !entry.kind);
    if (fallback) selectAlchemyRecipe(fallback.id);
    showToast("生成先を再選択しました。");
    return false;
  }
  if (recipe.kind === "borrowed" || recipe.kind === "invention") {
    return executeHackerRecipe(recipe.id);
  }
  const serverRecipeIds = state.data?.self?.alchemyRecipeIds;
  if (Array.isArray(serverRecipeIds) && serverRecipeIds.length && !serverRecipeIds.includes(recipe.id)) {
    const fallback = availableHackerRecipes().find((entry) => !entry.kind && serverRecipeIds.includes(entry.id));
    if (fallback) selectAlchemyRecipe(fallback.id);
    showToast("画面と生成サーバーの版が一致していません。再読込して生成先を選び直してください。");
    return false;
  }
  const ok = await api("/api/alchemy", { conversion: recipeId, targetId });
  if (!ok || !String(recipeId).startsWith("ability-")) return ok;
  const borrowedType = String(recipeId).slice("ability-".length);
  const borrowedRecipe = alchemyRecipes.find((entry) => entry.id === `borrowed-${borrowedType}`);
  if (!borrowedRecipe || !alchemyRecipeAvailable(borrowedRecipe)) return ok;
  state.borrowedOperatorType = borrowedType;
  renderTargetOptions(state.data);
  updateActionButtons(state.data);
  showToast(`${borrowedRecipe.label}を獲得しました。Hキーで使用できます。`);
  return ok;
}

function clearHackerCooldownWake() {
  if (state.hackerCooldownWakeTimer) window.clearTimeout(state.hackerCooldownWakeTimer);
  state.hackerCooldownWakeTimer = 0;
  state.hackerCooldownWakeAt = 0;
}

function scheduleHackerCooldownWake(data = state.data) {
  const readyAt = Number(data?.self?.vibeCodingReadyAt) || 0;
  const liveNow = estimatedServerNow(data);
  if (!readyAt || readyAt <= liveNow) {
    clearHackerCooldownWake();
    return;
  }
  if (state.hackerCooldownWakeTimer && state.hackerCooldownWakeAt === readyAt) return;
  clearHackerCooldownWake();
  state.hackerCooldownWakeAt = readyAt;
  state.hackerCooldownWakeTimer = window.setTimeout(() => {
    state.hackerCooldownWakeTimer = 0;
    state.hackerCooldownWakeAt = 0;
    renderHackerAbilityDock(state.data, true);
  }, Math.max(40, readyAt - liveNow + 60));
}

async function executeHackerRecipe(recipeId) {
  const data = state.data;
  const self = data?.self;
  const recipe = alchemyRecipes.find((entry) => entry.id === recipeId);
  if (!recipe || !isHackerPlayer(self) || !alchemyRecipeAvailable(recipe, self) || state.hackerGenerationInFlight) return false;
  const button = els.hackerAbilityGrid.querySelector(`[data-hacker-recipe="${CSS.escape(recipe.id)}"]`);
  state.hackerGenerationInFlight = true;
  button?.classList.add("executing");
  try {
    if (recipe.kind === "invention") {
      return await api("/api/alchemist-invention", { invention: recipe.inventoryId });
    }
    if (recipe.kind === "borrowed") {
      triggerBorrowedAbility(recipe.inventoryId, state.borrowedAbilityModes[recipe.inventoryId] || "");
      return true;
    }
    const targetId = recipe.id === "revive"
      ? data.players.find((player) => !player.alive && !player.ejected)?.id || ""
      : recipe.id.startsWith("hack-")
        ? ensureHackerTarget(data)?.id || ""
        : "";
    return await runAlchemyGeneration(recipe.id, targetId);
  } finally {
    state.hackerGenerationInFlight = false;
    button?.classList.remove("executing");
    renderHackerAbilityDock(state.data, true);
    scheduleHackerCooldownWake(state.data);
    window.setTimeout(() => renderHackerAbilityDock(state.data, true), 260);
  }
}

function renderHackerAbilityDock(data = state.data, force = false) {
  const self = data?.self;
  const visible = Boolean(self && data.phase === "playing" && isHackerPlayer(self));
  const opening = visible && !state.hackerDockVisible;
  state.hackerDockVisible = visible;
  els.hackerAbilityDock.hidden = !visible;
  if (!visible) {
    state.hackerDockRenderKey = "";
    return;
  }
  if (opening) {
    state.hackerCategoryId = "generate-supply";
    state.hackerSelectedRecipeId = state.hackerSelectedByCategory["generate-supply"] || "";
  }
  const liveNow = estimatedServerNow(data);

  const target = ensureHackerTarget(data);
  els.hackerTargetButton.textContent = target
    ? `対象: ${target.name}${target.id === data.selfId ? "（自分）" : ""}`
    : "対象なし";
  els.hackerTargetButton.disabled = hackerTargets(data).length < 2;

  const availableRecipes = availableHackerRecipes(self);
  const availableCategories = hackerRecipeCategories.filter((entry) =>
    availableRecipes.some((recipe) => hackerRecipeCategory(recipe) === entry.id)
  );
  const category = availableCategories.find((entry) => entry.id === state.hackerCategoryId) || availableCategories[0] || hackerRecipeCategories[0];
  state.hackerCategoryId = category.id;
  const recipes = availableRecipes.filter((recipe) => hackerRecipeCategory(recipe) === category.id);
  els.hackerCategoryLabel.textContent = `${category.label} ${recipes.length}`;
  const renderKey = `${category.id}:${recipes.map((recipe) => recipe.id).join("|")}`;
  if (force || renderKey !== state.hackerDockRenderKey) {
    state.hackerDockRenderKey = renderKey;
    els.hackerAbilityGrid.replaceChildren();
    recipes.forEach((recipe, index) => {
      const source = els.alchemyChoiceGrid.querySelector(`[data-alchemy-choice="${CSS.escape(recipe.id)}"]`);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "alchemy-choice hacker-direct-action";
      button.id = `hackerDirectAction${index + 1}`;
      button.dataset.hackerRecipe = recipe.id;
      button.dataset.hackerCategory = category.id;
      button.dataset.alchemyChoice = recipe.id;
      button.dataset.atlasCell = source?.dataset.atlasCell || (recipe.kind === "invention" ? "3" : "1");
      if (recipe.asset) button.dataset.alchemyAsset = recipe.asset;
      button.setAttribute("aria-label", `${recipe.label}: ${hackerRecipePresentation(recipe)}`);
      button.innerHTML = `
        <span class="alchemy-choice-icon hacker-action-icon" aria-hidden="true"></span>
        <span class="hacker-action-copy"><strong>${escapeHtml(recipe.label)}</strong><small>${escapeHtml(hackerRecipePresentation(recipe))}</small></span>
      `;
      applyGeneratedItemTexture(button, recipe.asset || recipe.id);
      els.hackerAbilityGrid.append(button);
    });
    selectHackerAction(
      state.hackerSelectedRecipeId || state.hackerSelectedByCategory[category.id] || "",
      false,
      "auto"
    );
    els.hackerAbilityDock.classList.remove("page-transition");
    void els.hackerAbilityDock.offsetWidth;
    els.hackerAbilityDock.classList.add("page-transition");
  }
  syncHackerSelectedName();

  const canAct = self.alive &&
    !self.ejected &&
    !self.inVent &&
    !isActionBlocked(data) &&
    (Number(self.abilityDisabledUntil) || 0) <= liveNow;
  const vibeCodingReady = (Number(self.vibeCodingReadyAt) || 0) <= liveNow;
  scheduleHackerCooldownWake(data);
  els.hackerAbilityGrid.querySelectorAll("[data-hacker-recipe]").forEach((button) => {
    const recipe = alchemyRecipes.find((entry) => entry.id === button.dataset.hackerRecipe);
    const targetRequired = recipe?.id?.startsWith("hack-");
    const enoughMana = (Number(self.mana) || 0) >= alchemyRecipeManaCost(recipe);
    const description = button.querySelector("small");
    if (description && recipe) description.textContent = hackerRecipePresentation(recipe);
    button.disabled = !canAct ||
      !recipe ||
      !alchemyRecipeAvailable(recipe, self) ||
      state.hackerGenerationInFlight ||
      (targetRequired && !target) ||
      (!recipe.kind && (!vibeCodingReady || !enoughMana));
  });
}

const soloMissionIds = ["movement", "combat", "defense", "intel", "emp", "cpu-gravity", "cpu-stage2"];

function completedSoloMissions() {
  try {
    const value = JSON.parse(localStorage.getItem(storage.soloMissions) || "[]");
    return new Set(Array.isArray(value) ? value.filter((id) => soloMissionIds.includes(id)) : []);
  } catch {
    return new Set();
  }
}

function updateSoloProgressUi() {
  const completed = completedSoloMissions();
  const count = completed.size;
  els.titlePlayButton.disabled = false;
  const playMode = state.onlineAvailable ? "オンライン利用可能" : "オフラインプレイ";
  els.titlePlayProgress.textContent = `${playMode} / ソロ訓練 ${count}/${soloMissionIds.length}`;
  els.soloTrainingProgress.textContent = `${count} / ${soloMissionIds.length} 完了`;
  els.soloMissionGrid.querySelectorAll("[data-solo-card]").forEach((card) => {
    card.classList.toggle("completed", completed.has(card.dataset.soloCard));
  });
  const hint = $("#cpuGravityHint");
  if (hint) hint.hidden = localStorage.getItem(storage.cpuGravityHint) !== "1";
}

function recordSoloMissionCompletion(missionId) {
  if (!soloMissionIds.includes(missionId)) return false;
  const completed = completedSoloMissions();
  const added = !completed.has(missionId);
  completed.add(missionId);
  localStorage.setItem(storage.soloMissions, JSON.stringify([...completed]));
  updateSoloProgressUi();
  return added;
}

init();

function init() {
  applyStartupCommand();
  const savedName = localStorage.getItem(storage.name) || "";
  els.nameInput.value = savedName;
  els.roomInput.value = state.roomId || "";
  els.skinSelect.value = normalizeSkinId(localStorage.getItem(storage.skin));
  syncGameAudioButtons();
  updateSoloProgressUi();
  setScreen("title");
  bindEvents();
  requestStartupFullscreen();
  initializeTacticsPanel();
  initializeOfflineRuntime();
  initializeRealtimeTransport();
  registerServiceWorker();
  if (location.protocol === "file:") {
    showToast("HTMLを直接開いています。start-game.cmd かアプリ起動ショートカットから http://localhost:3000 を開いてください。");
  }
  void checkOnlineAvailability();
  if (state.roomId && state.playerId) {
    loadGameplayTextures();
    pollState();
  }
  void initializeProfileIdentity();
  void flushUsageAnalytics();
  setInterval(recordUsageHeartbeat, 15_000);
  setInterval(() => void flushUsageAnalytics(), 15_000);
  setInterval(() => {
    if (!els.analyticsPanel.hidden) void loadDropoffAnalytics(false);
  }, 15_000);
  setInterval(pollState, 250);
  setInterval(() => void checkOnlineAvailability(), 60_000);
  setInterval(() => {
    if (state.onlineAvailable) void refreshRooms();
  }, 5500);
  state.frameDriver = globalThis.DVAFrameLoop?.start(drawLoop) || null;
}

async function initializeProfileIdentity() {
  const result = await request("/api/profile", {}, { quiet: true, forceOnline: true });
  if (result?.profile?.developer) localStorage.setItem(storage.developerIdentity, "1");
  const savedName = String(result?.profile?.name || "").trim();
  if (els.namePolicy && result?.policy) els.namePolicy.textContent = String(result.policy);
  if (savedName) lockPlayerName(savedName);
  else if (!result?.profile?.developer && els.nameInput.value.trim() === "プレイヤー") {
    els.nameInput.value = "";
    els.nameInput.placeholder = "名前を入力";
    localStorage.removeItem(storage.name);
  }
  recordUsageCheckpoint("title_loaded");
}

function lockPlayerName(name) {
  const fixedName = String(name || "").trim();
  if (!fixedName) return;
  els.nameInput.value = fixedName;
  els.nameInput.readOnly = true;
  els.nameInput.setAttribute("aria-readonly", "true");
  els.nameInput.title = "この名前はIPアドレス単位で保存済みのため変更できません。";
  els.namePolicy?.classList.add("locked");
  localStorage.setItem(storage.name, fixedName);
}

function analyticsUserName() {
  return String(selfPlayer()?.name || els.nameInput.value || localStorage.getItem(storage.name) || "未設定").trim().slice(0, 16);
}

function responsePlayerName(result, fallback = "") {
  const selfId = String(result?.selfId || result?.playerId || "");
  const player = Array.isArray(result?.players)
    ? result.players.find((entry) => String(entry?.id || "") === selfId)
    : null;
  return String(player?.name || fallback || "").trim();
}

function recordUsageCheckpoint(name) {
  if (localStorage.getItem(storage.analyticsDisabled) === "1") return;
  state.analyticsExitReported = false;
  state.checkpointSeen.add(name);
  enqueueUsageAnalytics({ checkpoint: name, event: "visit" });
}

function recordUsageExit() {
  if (localStorage.getItem(storage.analyticsDisabled) === "1" || state.analyticsExitReported) return;
  state.analyticsExitReported = true;
  enqueueUsageAnalytics({ checkpoint: "", event: "leave" }, true);
}

function recordUsageResume() {
  if (localStorage.getItem(storage.analyticsDisabled) === "1") return;
  state.analyticsExitReported = false;
  enqueueUsageAnalytics({ checkpoint: "", event: "resume" });
}

function recordUsageHeartbeat() {
  if (document.hidden || localStorage.getItem(storage.analyticsDisabled) === "1" || !state.checkpointSeen.size) return;
  enqueueUsageAnalytics({ checkpoint: "", event: "heartbeat" });
}

function analyticsQueue() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storage.analyticsQueue) || "[]");
    return Array.isArray(parsed) ? parsed.slice(-256) : [];
  } catch {
    return [];
  }
}

function saveAnalyticsQueue(queue) {
  localStorage.setItem(storage.analyticsQueue, JSON.stringify(queue.slice(-256)));
}

function createAnalyticsEvent(payload) {
  return {
    id: globalThis.crypto?.randomUUID?.() || `analytics-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    checkpoint: String(payload.checkpoint || ""),
    event: String(payload.event || "visit"),
    occurredAt: Date.now(),
    clientId: clientId(),
    userName: analyticsUserName()
  };
}

function enqueueUsageAnalytics(payload, useBeacon = false) {
  const event = createAnalyticsEvent(payload);
  const queue = analyticsQueue();
  queue.push(event);
  saveAnalyticsQueue(queue);
  if (useBeacon && typeof navigator.sendBeacon === "function") {
    // A safelisted MIME type avoids a CORS preflight while PLiCy is unloading.
    const body = new Blob([JSON.stringify(event)], { type: "text/plain;charset=UTF-8" });
    navigator.sendBeacon(apiUrl("/api/checkpoint"), body);
  }
  void flushUsageAnalytics();
}

async function flushUsageAnalytics() {
  if (state.analyticsFlushInFlight || localStorage.getItem(storage.analyticsDisabled) === "1") return false;
  const queue = analyticsQueue();
  if (!queue.length) return true;
  state.analyticsFlushInFlight = true;
  try {
    while (queue.length) {
      const event = queue[0];
      const response = await fetch(apiUrl("/api/checkpoint"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(event),
        keepalive: true
      });
      if (!response.ok) return false;
      const result = await response.json().catch(() => null);
      if (!result?.ok) return false;
      queue.shift();
      saveAnalyticsQueue(queue);
    }
    return true;
  } catch {
    return false;
  } finally {
    state.analyticsFlushInFlight = false;
  }
}

async function excludeOwnAnalytics() {
  localStorage.setItem(storage.analyticsDisabled, "1");
  localStorage.removeItem(storage.analyticsQueue);
  state.analyticsExitReported = true;
  // Keep the session on the server so other clients can still see it. The
  // report endpoint excludes this client by id without deleting its history.
}

function clientId() {
  let value = localStorage.getItem(storage.clientId);
  if (!value) {
    value = globalThis.crypto?.randomUUID?.() || `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(storage.clientId, value);
  }
  return value;
}

function initializeOfflineRuntime() {
  if (!globalThis.DVAOffline?.OfflineApiClient) return;
  state.offlineClient = new DVAOffline.OfflineApiClient({
    clientId,
    isDeveloper: () => localStorage.getItem(storage.developerIdentity) === "1"
  });
}

function activateOfflineMode(reason = "") {
  if (!state.offlineClient) return false;
  state.offlineClient.start();
  state.offlineMode = true;
  state.realtime?.disconnect();
  document.documentElement.dataset.connectionMode = "offline";
  if (els.lobbyTitle) els.lobbyTitle.textContent = "オフラインロビー";
  if (reason) showToast(reason);
  return true;
}

function deactivateOfflineMode() {
  state.offlineMode = false;
  document.documentElement.dataset.connectionMode = "online";
  if (els.lobbyTitle) els.lobbyTitle.textContent = "オンラインロビー";
}

function applyOnlineAvailabilityUi() {
  const available = state.onlineAvailable;
  els.roomCodeLabel.hidden = !available;
  els.joinButton.hidden = !available;
  els.publicRoomsHeader.hidden = !available;
  els.roomList.hidden = !available;
  document.documentElement.dataset.onlineAvailability = available ? "available" : "unavailable";
  if (!available) {
    els.roomInput.value = "";
    renderRoomList([]);
  }
  updateSoloProgressUi();
  render();
}

async function checkOnlineAvailability() {
  if (state.onlineAvailabilityCheckInFlight) return state.onlineAvailable;
  state.onlineAvailabilityCheckInFlight = true;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(apiUrl("/api/online-capacity"), {
      method: "GET",
      cache: "no-store",
      headers: { accept: "application/json" },
      signal: controller.signal
    });
    const result = response.ok ? await response.json().catch(() => null) : null;
    state.onlineAvailable = Boolean(response.ok && result?.ok && result?.renderCapacity === "available" && result?.available);
  } catch {
    state.onlineAvailable = false;
  } finally {
    window.clearTimeout(timeout);
    state.onlineAvailabilityChecked = true;
    state.onlineAvailabilityCheckInFlight = false;
    applyOnlineAvailabilityUi();
  }
  if (state.onlineAvailable) void refreshRooms();
  return state.onlineAvailable;
}

function initializeRealtimeTransport() {
  if (!globalThis.DVARuntime) return;
  state.realtime = new DVARuntime.RealtimeClient({
    onState(data) {
      if (data?.roomId === state.roomId && data?.selfId === state.playerId) applyState(data);
    },
    onMovement: applyMovementAck
  });
  state.movementQueue = new DVARuntime.MovementRequestQueue(sendHttpMovement, applyMovementAck);
}

function ensureRealtimeConnection() {
  if (state.offlineMode) {
    state.realtime?.disconnect();
    return;
  }
  if (!state.realtime || !state.roomId || !state.playerId) return;
  state.realtime.connect({
    apiBase: API_BASE_URL,
    roomId: state.roomId,
    playerId: state.playerId,
    clientId: clientId(),
    performanceMode: "standard"
  });
}

function applyStartupCommand() {
  const command = URL_PARAMETERS.get("command");
  if (command === "force-end") {
    localStorage.setItem(storage.debugForceEnd, "1");
    state.debugForceEndEnabled = true;
  } else if (command === "hide-force-end") {
    localStorage.removeItem(storage.debugForceEnd);
    state.debugForceEndEnabled = false;
  } else if (command === "analytics-off") {
    localStorage.setItem(storage.analyticsDisabled, "1");
    void excludeOwnAnalytics();
  } else if (command === "analytics-on") {
    localStorage.removeItem(storage.analyticsDisabled);
  }
  els.debugForceEndButton.hidden = !state.debugForceEndEnabled;
}

async function enterFullscreen() {
  if (document.fullscreenElement || typeof document.documentElement.requestFullscreen !== "function") return false;
  try {
    await document.documentElement.requestFullscreen({ navigationUI: "hide" });
    return true;
  } catch {
    return false;
  }
}

function requestStartupFullscreen() {
  if (document.fullscreenElement) return;
  state.startupFullscreenPending = true;
  const retry = () => {
    if (!state.startupFullscreenPending || document.fullscreenElement) return;
    void enterFullscreen().then((entered) => {
      if (!entered) return;
      state.startupFullscreenPending = false;
      document.removeEventListener("pointerdown", retry, true);
      document.removeEventListener("keydown", retry, true);
    });
  };
  document.addEventListener("pointerdown", retry, true);
  document.addEventListener("keydown", retry, true);
  retry();
}

async function toggleFullscreen() {
  if (document.fullscreenElement) {
    try {
      await document.exitFullscreen();
    } catch {}
    return;
  }
  const entered = await enterFullscreen();
  if (!entered) showToast("この表示環境では全画面化が許可されていません。");
}

function syncFullscreenButton() {
  const active = Boolean(document.fullscreenElement);
  els.fullscreenButton.classList.toggle("active", active);
  els.fullscreenButton.title = active ? "全画面表示を終了する" : "全画面表示にする";
  els.fullscreenButton.setAttribute("aria-label", els.fullscreenButton.title);
}

function createBgmAudio(src, volume) {
  const audio = new Audio(src);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = volume;
  return audio;
}

function switchScreenWithEffect(next) {
  const flashClass = next === "tactics" ? "tactics-flash" : next === "game" ? "game-flash" : "";
  els.screenFlash.classList.remove("active", "tactics-flash", "game-flash");
  void els.screenFlash.offsetWidth;
  if (flashClass) els.screenFlash.classList.add(flashClass);
  els.screenFlash.classList.add("active");
  window.setTimeout(() => els.screenFlash.classList.remove("active", "tactics-flash", "game-flash"), 380);
  setScreen(next);
}

function resizeTitleEffects() {
  const rect = els.titleFxCanvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  if (state.titleFx.width === width && state.titleFx.height === height && els.titleFxCanvas.width === Math.round(width * ratio)) return;
  state.titleFx.width = width;
  state.titleFx.height = height;
  els.titleFxCanvas.width = Math.round(width * ratio);
  els.titleFxCanvas.height = Math.round(height * ratio);
  titleFxCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
  state.titleFx.routeGlints = [];
  state.titleFx.atmosphere = [];
}

function titleHeroPoint(u, v) {
  const width = state.titleFx.width;
  const height = state.titleFx.height;
  const naturalWidth = els.startHero.naturalWidth || 1659;
  const naturalHeight = els.startHero.naturalHeight || 948;
  const scale = Math.max(width / naturalWidth, height / naturalHeight);
  const renderedWidth = naturalWidth * scale;
  const renderedHeight = naturalHeight * scale;
  const positionX = window.matchMedia("(max-width: 720px)").matches ? 0.66 : 0.5;
  return {
    x: (width - renderedWidth) * positionX + renderedWidth * u,
    y: (height - renderedHeight) * 0.5 + renderedHeight * v
  };
}

function spawnTitleRouteGlint(timestamp) {
  const branch = Math.random();
  const start = titleHeroPoint(0.76 + (Math.random() - 0.5) * 0.07, 0.86);
  const control = branch < 0.52
    ? titleHeroPoint(0.75, 0.68)
    : branch < 0.8
      ? titleHeroPoint(0.70, 0.62)
      : titleHeroPoint(0.82, 0.63);
  const end = branch < 0.52
    ? titleHeroPoint(0.75, 0.48)
    : branch < 0.8
      ? titleHeroPoint(0.69, 0.51)
      : titleHeroPoint(0.82, 0.52);
  state.titleFx.routeGlints.push({
    start,
    control,
    end,
    startedAt: timestamp,
    duration: 1180 + Math.random() * 620,
    phase: Math.random() * Math.PI * 2,
    hue: branch < 0.68 ? "aqua" : "sun"
  });
  state.titleFx.routeGlints = state.titleFx.routeGlints.slice(-18);
}

function spawnTitleAtmosphere(timestamp) {
  const roll = Math.random();
  const kind = roll < 0.48 ? "refract" : roll < 0.82 ? "mote" : "glint";
  const anchor = kind === "refract"
    ? titleHeroPoint(0.76 + (Math.random() - 0.5) * 0.18, 0.54 + Math.random() * 0.28)
    : kind === "glint"
      ? titleHeroPoint(0.75 + (Math.random() - 0.5) * 0.18, 0.48 + (Math.random() - 0.5) * 0.12)
      : titleHeroPoint(0.62 + Math.random() * 0.3, 0.18 + Math.random() * 0.48);
  const duration = kind === "refract" ? 1200 + Math.random() * 1300 : kind === "glint" ? 620 + Math.random() * 620 : 1100 + Math.random() * 1700;
  state.titleFx.atmosphere.push({
    kind,
    x: anchor.x,
    y: anchor.y,
    vx: (Math.random() - 0.5) * (kind === "refract" ? 9 : 22),
    vy: kind === "refract" ? -(7 + Math.random() * 12) : kind === "glint" ? 1 : -(2 + Math.random() * 7),
    radius: kind === "refract" ? 8 + Math.random() * 15 : kind === "glint" ? 4 + Math.random() * 7 : 1.2 + Math.random() * 2.8,
    startedAt: timestamp,
    duration,
    phase: Math.random() * Math.PI * 2
  });
  state.titleFx.atmosphere = state.titleFx.atmosphere.slice(-110);
}

function drawTitleEffects(timestamp) {
  if (els.startScreen.hidden) return;
  resizeTitleEffects();
  const width = state.titleFx.width;
  const height = state.titleFx.height;
  titleFxCtx.clearRect(0, 0, width, height);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (timestamp - state.titleFx.lastRouteAt > 135 + Math.random() * 160) {
    state.titleFx.lastRouteAt = timestamp;
    spawnTitleRouteGlint(timestamp);
  }
  if (timestamp - state.titleFx.lastAtmosphereAt > 34 + Math.random() * 46) {
    state.titleFx.lastAtmosphereAt = timestamp;
    spawnTitleAtmosphere(timestamp);
  }
  const modeAlpha = state.screen === "tactics" ? 0.28 : 1;
  state.titleFx.routeGlints = state.titleFx.routeGlints.filter((glint) => timestamp - glint.startedAt < glint.duration);
  state.titleFx.atmosphere = state.titleFx.atmosphere.filter((particle) => timestamp - particle.startedAt < particle.duration);
  titleFxCtx.save();
  titleFxCtx.globalCompositeOperation = "lighter";
  for (const glint of state.titleFx.routeGlints) {
    const progress = clamp((timestamp - glint.startedAt) / glint.duration, 0, 1);
    const travel = 1 - Math.pow(1 - progress, 1.7);
    const inverse = 1 - travel;
    const x = inverse * inverse * glint.start.x + 2 * inverse * travel * glint.control.x + travel * travel * glint.end.x;
    const y = inverse * inverse * glint.start.y + 2 * inverse * travel * glint.control.y + travel * travel * glint.end.y;
    const envelope = Math.sin(Math.PI * progress) * modeAlpha;
    const radius = 2.4 + Math.sin(glint.phase + progress * Math.PI * 4) * 0.8;
    const color = glint.hue === "sun" ? "190, 242, 100" : "103, 232, 249";
    const gradient = titleFxCtx.createRadialGradient(x, y, 0, x, y, radius * 5.5);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${0.92 * envelope})`);
    gradient.addColorStop(0.22, `rgba(${color}, ${0.7 * envelope})`);
    gradient.addColorStop(1, `rgba(${color}, 0)`);
    titleFxCtx.globalAlpha = 1;
    titleFxCtx.fillStyle = gradient;
    titleFxCtx.beginPath();
    titleFxCtx.arc(x, y, radius * 5.5, 0, Math.PI * 2);
    titleFxCtx.fill();
  }
  for (const particle of state.titleFx.atmosphere) {
    const age = timestamp - particle.startedAt;
    const progress = age / particle.duration;
    const seconds = age / 1000;
    const phase = particle.phase + seconds * (particle.kind === "glint" ? 5.2 : 1.7);
    const x = particle.x + particle.vx * seconds + Math.sin(phase) * (particle.kind === "refract" ? 5 : 2.4);
    const y = particle.y + particle.vy * seconds;
    const envelope = Math.sin(Math.PI * Math.min(1, progress)) * modeAlpha;
    const gradient = titleFxCtx.createRadialGradient(x, y, 0, x, y, particle.radius * (1 + progress * 0.55));
    if (particle.kind === "refract") {
      gradient.addColorStop(0, `rgba(153, 246, 228, ${0.36 * envelope})`);
      gradient.addColorStop(0.42, `rgba(103, 232, 249, ${0.16 * envelope})`);
      gradient.addColorStop(1, "rgba(103, 232, 249, 0)");
    } else if (particle.kind === "glint") {
      gradient.addColorStop(0, `rgba(255, 255, 255, ${0.68 * envelope})`);
      gradient.addColorStop(0.34, `rgba(190, 242, 100, ${0.26 * envelope})`);
      gradient.addColorStop(1, "rgba(190, 242, 100, 0)");
    } else {
      gradient.addColorStop(0, `rgba(254, 243, 199, ${0.72 * envelope})`);
      gradient.addColorStop(0.3, `rgba(252, 211, 77, ${0.28 * envelope})`);
      gradient.addColorStop(1, "rgba(252, 211, 77, 0)");
    }
    titleFxCtx.globalAlpha = 1;
    titleFxCtx.fillStyle = gradient;
    titleFxCtx.beginPath();
    titleFxCtx.arc(x, y, particle.radius * (1 + progress * 0.55), 0, Math.PI * 2);
    titleFxCtx.fill();
  }
  titleFxCtx.restore();
}

function setScreen(screen) {
  const next = ["title", "tactics", "game"].includes(screen) ? screen : "title";
  state.screen = next;
  if (next !== "game" && state.fieldFeedOpen) setFieldFeedOpen(false);
  document.body.classList.toggle("start-open", next !== "game");
  document.body.classList.toggle("tactics-open", next === "tactics");
  document.body.classList.toggle("game-open", next === "game");
  els.startScreen.hidden = next === "game";
  if (els.titleMuteButton) els.titleMuteButton.hidden = next === "tactics";
  els.gameApp.setAttribute("aria-hidden", String(next !== "game"));
  els.titleMenu.hidden = next !== "title";
  els.tacticsPanel.hidden = next !== "tactics";
  if (next === "tactics") setActiveTacticsChapter(state.tacticsChapterId || "tactics-basics");
  if (next !== "game") clearMovementInput();
  window.scrollTo(0, 0);
  syncBgm();
  requestAnimationFrame(() => syncKeyboardContext(true));
}

function toggleGameMuted() {
  if (IS_VERIFICATION_MODE) {
    state.audio.muted = true;
    if (state.audio.master && state.audio.context) state.audio.master.gain.value = 0;
    syncGameAudioButtons();
    syncBgm();
    return;
  }
  state.audio.muted = !state.audio.muted;
  localStorage.setItem(storage.gameMuted, state.audio.muted ? "1" : "0");
  localStorage.removeItem(storage.musicMuted);
  if (state.audio.master && state.audio.context) {
    state.audio.master.gain.cancelScheduledValues(state.audio.context.currentTime);
    state.audio.master.gain.setTargetAtTime(state.audio.muted ? 0 : 0.42, state.audio.context.currentTime, 0.018);
  }
  syncGameAudioButtons();
  syncBgm();
}

function syncGameAudioButtons() {
  const muted = state.audio.muted;
  for (const button of [els.titleMuteButton, els.tacticsMuteButton, els.gameMuteButton].filter(Boolean)) {
    button.classList.toggle("is-muted", muted);
    button.textContent = muted ? "×♪" : "♪";
    button.setAttribute("aria-label", muted ? "ゲーム音をオン" : "ゲーム音をオフ");
    button.title = muted ? "ゲーム音をオン" : "ゲーム音をオフ";
  }
}

function desiredBgm() {
  if (state.audio.muted || document.hidden) return null;
  if (state.screen === "title" || state.screen === "tactics") return state.audio.titleBgm;
  if (state.screen === "game" && (!state.data || state.data.phase === "lobby" || state.data.phase === "selecting")) {
    return state.audio.titleBgm;
  }
  return null;
}

function syncBgm() {
  const target = desiredBgm();
  document.body.dataset.bgm = target === state.audio.titleBgm ? "title" : "off";
  document.body.dataset.musicMuted = String(state.audio.muted);
  if (state.audio.currentBgm && state.audio.currentBgm !== target) {
    state.audio.currentBgm.pause();
  }
  state.audio.currentBgm = target;
  if (!target || !state.audio.unlocked) return;
  target.play().catch(() => {});
}

function initializeTacticsPanel() {
  els.tacticsChapterList.querySelectorAll("[data-tactics-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const article = document.getElementById(button.dataset.tacticsTarget);
      if (!article) return;
      setActiveTacticsChapter(article.id);
    });
  });
}

function setActiveTacticsChapter(id) {
  state.tacticsChapterId = id;
  els.tacticsChapterList.querySelectorAll("[data-tactics-target]").forEach((button) => {
    const active = button.dataset.tacticsTarget === id;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });
  els.tacticsContent.querySelectorAll(".tactics-article").forEach((article) => {
    const active = article.id === id;
    article.hidden = !active;
    article.setAttribute("aria-hidden", String(!active));
  });
  els.tacticsContent.scrollTop = 0;
}

function syncTacticsChapterFromScroll() {
  const top = els.tacticsContent.scrollTop + 36;
  const articles = [...els.tacticsContent.querySelectorAll(".tactics-article")];
  let active = articles[0];
  for (const article of articles) {
    if (article.offsetTop <= top) active = article;
    else break;
  }
  if (active) setActiveTacticsChapter(active.id);
}

function drawTacticsVideo(player) {
  const { ctx, canvas, scene, duration } = player;
  const w = canvas.width;
  const h = canvas.height;
  const t = clamp(player.time / duration, 0, 1);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#071015";
  ctx.fillRect(0, 0, w, h);
  const atlas = state.textures.tacticsStoryboard;
  if (atlas.complete && atlas.naturalWidth) {
    const cellW = atlas.naturalWidth / 2;
    const cellH = atlas.naturalHeight / 3;
    const zoom = 1.06 + Math.sin(t * Math.PI * 2) * 0.018;
    const sourceW = cellW / zoom;
    const sourceH = sourceW * 9 / 16;
    const panX = Math.sin(t * Math.PI * 2 + scene * 0.8) * cellW * 0.025;
    const panY = Math.cos(t * Math.PI * 2 + scene * 0.6) * cellH * 0.025;
    const sx = (scene % 2) * cellW + (cellW - sourceW) / 2 + panX;
    const sy = Math.floor(scene / 2) * cellH + (cellH - sourceH) / 2 + panY;
    ctx.drawImage(atlas, sx, sy, sourceW, sourceH, 0, 0, w, h);
  }
  const shade = ctx.createLinearGradient(0, 0, 0, h);
  shade.addColorStop(0, "rgba(3, 8, 12, 0.12)");
  shade.addColorStop(0.62, "rgba(3, 8, 12, 0.02)");
  shade.addColorStop(1, "rgba(3, 8, 12, 0.66)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, w, h);
  if (scene === 0) drawTacticsBasics(ctx, w, h, player.time, duration);
  if (scene === 1) drawTacticsMovement(ctx, w, h, player.time, duration);
  if (scene === 2) drawTacticsCombat(ctx, w, h, player.time, duration);
  if (scene === 3) drawTacticsResources(ctx, w, h, player.time, duration);
  if (scene === 4) drawTacticsIntel(ctx, w, h, player.time, duration);
  if (scene === 5) drawTacticsMeeting(ctx, w, h, player.time, duration);
}

function tacticsLabel(ctx, text, x, y, options = {}) {
  ctx.save();
  ctx.font = options.font || "900 20px Segoe UI, sans-serif";
  ctx.textAlign = options.align || "center";
  ctx.textBaseline = "middle";
  const width = ctx.measureText(text).width + 22;
  const left = (options.align === "left" ? x : options.align === "right" ? x - width : x - width / 2);
  ctx.fillStyle = options.background || "rgba(5, 12, 17, 0.88)";
  tacticsRoundRect(ctx, left, y - 17, width, 34, 5);
  ctx.fillStyle = options.color || "#f8fafc";
  ctx.fillText(text, x, y);
  ctx.restore();
}

function tacticsRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
}

function drawTacticsSprite(ctx, image, key, x, y, width, height, alpha = 1) {
  const source = transparentSpriteSource(image, `tactics-${key}`, 24);
  if (!source) return false;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(source, x - width / 2, y - height / 2, width, height);
  ctx.restore();
  return true;
}

function drawTacticsBasics(ctx, w, h, time) {
  const stages = ["オペ選択", "バトル", "会議", "リザルト"];
  const active = Math.min(3, Math.floor((time % 24) / 6));
  const centerX = w * 0.5;
  const centerY = h * 0.47;
  const angle = time * 0.42 - Math.PI / 2;
  drawTacticsSprite(ctx, state.textures.tacticsPlayerHood, "hood", centerX + Math.cos(angle) * 150, centerY + Math.sin(angle) * 96, 86, 112);
  drawTacticsSprite(ctx, state.textures.tacticsPlayerBlue, "blue", centerX - Math.cos(angle) * 150, centerY - Math.sin(angle) * 96, 86, 112);
  stages.forEach((stage, index) => {
    const x = 132 + index * ((w - 264) / 3);
    ctx.fillStyle = index === active ? "#22d3ee" : "rgba(148, 163, 184, 0.56)";
    ctx.fillRect(x - 54, h - 90, 108, 5);
    tacticsLabel(ctx, stage, x, h - 58, { font: "800 15px Segoe UI, sans-serif", color: index === active ? "#cffafe" : "#cbd5e1" });
  });
  tacticsLabel(ctx, active === 1 ? "タスク完了 / 全敵排除 / 人数同数" : stages[active], w / 2, 46, { color: "#a5f3fc" });
}

function drawTacticsMovement(ctx, w, h, time) {
  const phase = Math.floor((time % 27) / 9);
  const local = (time % 9) / 9;
  const modes = ["通常歩行", "ダッシュ", "無音歩行"];
  const colors = ["#67e8f9", "#fbbf24", "#cbd5e1"];
  const x = 120 + local * (w - 240);
  const y = h * 0.48 + Math.sin(local * Math.PI * 2) * 48;
  if (phase !== 2) {
    const ring = (time * (phase === 1 ? 120 : 72)) % 180;
    ctx.strokeStyle = colors[phase];
    ctx.globalAlpha = 1 - ring / 180;
    ctx.lineWidth = phase === 1 ? 6 : 3;
    ctx.beginPath();
    ctx.arc(x, y, 24 + ring, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  drawTacticsSprite(ctx, state.textures.tacticsPlayerHood, "hood", x, y, 82, 108);
  const stamina = phase === 1 ? Math.max(0, 100 - local * 100) : Math.min(100, 35 + local * 65);
  ctx.fillStyle = "rgba(4, 10, 14, 0.88)";
  ctx.fillRect(w / 2 - 150, h - 72, 300, 22);
  ctx.fillStyle = colors[phase];
  ctx.fillRect(w / 2 - 146, h - 68, 292 * stamina / 100, 14);
  tacticsLabel(ctx, `${modes[phase]} / SP ${Math.round(stamina)}`, w / 2, 44, { color: colors[phase] });
}

function drawTacticsCombat(ctx, w, h, time) {
  const weapons = ["HG 0.48", "SMG 0.42", "AR 0.58", "SR 確殺"];
  const weaponIndex = Math.min(3, Math.floor((time % 32) / 8));
  const local = (time % 8) / 8;
  const shooterX = 210;
  const targetX = 750;
  const y = h * 0.5;
  drawTacticsSprite(ctx, state.textures.tacticsPlayerBlue, "blue", shooterX, y, 92, 124);
  drawTacticsSprite(ctx, state.textures.tacticsPlayerHood, "hood", targetX, y, 92, 124);
  const gunAtlas = state.textures.gunnerWeaponsAtlas;
  if (gunAtlas.complete && gunAtlas.naturalWidth) {
    const cellW = gunAtlas.naturalWidth / 4;
    const cellH = gunAtlas.naturalHeight / 2;
    ctx.drawImage(gunAtlas, weaponIndex * cellW, 0, cellW, cellH, shooterX - 74, y - 126, 148, 74);
  }
  const pulse = (local * (weaponIndex === 1 ? 8 : weaponIndex === 2 ? 4 : 2)) % 1;
  ctx.strokeStyle = ["#fbbf24", "#22d3ee", "#fb7185", "#a78bfa"][weaponIndex];
  ctx.lineWidth = weaponIndex === 3 ? 3 : 5;
  ctx.globalAlpha = 1 - pulse * 0.45;
  ctx.beginPath();
  ctx.moveTo(shooterX + 48, y - 18);
  ctx.lineTo(shooterX + 48 + (targetX - shooterX - 92) * pulse, y - 18);
  ctx.stroke();
  ctx.globalAlpha = 1;
  const damage = weaponIndex === 3 ? 2 : Math.min(2, local * (weaponIndex === 1 ? 2.5 : weaponIndex === 2 ? 1.8 : 1.2));
  ctx.fillStyle = "rgba(4, 10, 14, 0.9)";
  ctx.fillRect(targetX - 80, y + 82, 160, 18);
  ctx.fillStyle = damage >= 2 ? "#ef4444" : "#22c55e";
  ctx.fillRect(targetX - 76, y + 86, 152 * Math.max(0, 1 - damage / 2), 10);
  tacticsLabel(ctx, weapons[weaponIndex], w / 2, 44, { color: ["#fde68a", "#a5f3fc", "#fecdd3", "#ddd6fe"][weaponIndex] });
  tacticsLabel(ctx, weaponIndex === 3 ? "SR: 単発高威力 / 長押し低レート連射" : "弾切れ時はリロード", w / 2, h - 52, { font: "800 15px Segoe UI, sans-serif" });
}

function drawTacticsResources(ctx, w, h, time, duration) {
  const progress = time / duration;
  const mana = progress < 0.18 ? 0 : progress < 0.36 ? 1 : 2;
  const stateName = mana === 0 ? "欲望" : mana === 1 ? "気概" : "理知";
  const stage = progress < 0.52 ? "理知維持" : progress < 0.66 ? "真 / 美" : progress < 0.78 ? "真 + 美" : progress < 0.9 ? "善" : "善のイデア";
  const colors = ["#ef4444", "#fbbf24", "#a78bfa"];
  for (let index = 0; index < 3; index += 1) {
    const x = w / 2 - 120 + index * 120;
    ctx.strokeStyle = index <= mana ? colors[index] : "rgba(148, 163, 184, 0.34)";
    ctx.lineWidth = index === mana ? 8 : 3;
    ctx.beginPath();
    ctx.arc(x, h * 0.5, 42, 0, Math.PI * 2);
    ctx.stroke();
    tacticsLabel(ctx, String(index), x, h * 0.5, { background: "rgba(5, 10, 15, 0.7)", color: index <= mana ? colors[index] : "#94a3b8" });
  }
  const wing = Math.max(0, (progress - 0.9) / 0.1);
  if (wing > 0) {
    ctx.save();
    ctx.translate(w / 2, h * 0.28);
    ctx.strokeStyle = "rgba(248, 250, 252, 0.9)";
    ctx.lineWidth = 6;
    for (const side of [-1, 1]) {
      for (let feather = 0; feather < 6; feather += 1) {
        ctx.beginPath();
        ctx.moveTo(side * 12, 0);
        ctx.quadraticCurveTo(side * (70 + feather * 12) * wing, -50 + feather * 10, side * (120 + feather * 16) * wing, -74 + feather * 18);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  tacticsLabel(ctx, `${stateName} / ${stage}`, w / 2, 44, { color: mana === 2 ? "#ddd6fe" : colors[mana] });
  const milestones = ["2:00", "5:00", "9:00", "15:00"];
  milestones.forEach((label, index) => tacticsLabel(ctx, label, 190 + index * 195, h - 52, { font: "800 14px Segoe UI, sans-serif", color: progress >= [0.52, 0.66, 0.78, 0.9][index] ? "#f8fafc" : "#94a3b8" }));
}

function drawTacticsIntel(ctx, w, h, time) {
  const samePhase = Math.floor(time / 8) % 2 === 0;
  const centerX = w / 2;
  const centerY = h * 0.54;
  const wave = (time * 90) % 250;
  for (const side of [-1, 1]) {
    ctx.strokeStyle = side < 0 ? "#22d3ee" : "#e879f9";
    ctx.globalAlpha = 1 - wave / 250;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(centerX + side * 125, centerY, 25 + wave, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  if (samePhase) {
    ctx.fillStyle = "rgba(248, 250, 252, 0.88)";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 22 + Math.sin(time * 8) * 7, 0, Math.PI * 2);
    ctx.fill();
  }
  drawTacticsSprite(ctx, state.textures.facilityProps[2], "camera", 155, 118, 110, 110);
  drawTacticsSprite(ctx, state.textures.facilityProps[4], "drone", w - 155, 118, 112, 112);
  tacticsLabel(ctx, samePhase ? "同位相: 共振 / 至近確殺" : "逆位相: 相殺", w / 2, 44, { color: samePhase ? "#f8fafc" : "#f0abfc" });
  tacticsLabel(ctx, "EMP再充填 18秒 / 干渉窓 900ms", w / 2, h - 52, { font: "800 15px Segoe UI, sans-serif" });
}

function drawTacticsMeeting(ctx, w, h, time, duration) {
  const progress = time / duration;
  const centerX = w / 2;
  const centerY = h * 0.48;
  for (let index = 0; index < 8; index += 1) {
    const angle = index / 8 * Math.PI * 2 + time * 0.08;
    const x = centerX + Math.cos(angle) * 220;
    const y = centerY + Math.sin(angle) * 120;
    ctx.fillStyle = index === Math.floor(progress * 8) % 8 ? "#67e8f9" : "rgba(203, 213, 225, 0.72)";
    tacticsRoundRect(ctx, x - 34, y - 20, 68, 40, 5);
  }
  if (progress > 0.62) {
    ctx.save();
    ctx.translate(centerX, centerY - 90);
    ctx.strokeStyle = "#fde68a";
    ctx.shadowColor = "#facc15";
    ctx.shadowBlur = 18;
    ctx.lineWidth = 5;
    for (let feather = 0; feather < 7; feather += 1) {
      ctx.beginPath();
      ctx.moveTo(0, feather * 8);
      ctx.quadraticCurveTo(38 + feather * 6, -25 + feather * 4, 72 + feather * 8, -38 + feather * 12);
      ctx.stroke();
    }
    ctx.restore();
  }
  tacticsLabel(ctx, progress < 0.32 ? "匿名投票" : progress < 0.62 ? "追放陣営は非開示" : "ルミナス: 的中はキル1 / 外れ死亡", w / 2, 44, { color: progress > 0.62 ? "#fde68a" : "#a5f3fc" });
  tacticsLabel(ctx, `会議残り ${Math.max(0, Math.ceil(300 * (1 - progress)))}秒`, w / 2, h - 52, { font: "800 15px Segoe UI, sans-serif" });
}

const actionHotkeys = {
  Digit3: "emergencyButton",
  Digit4: "smartphoneRepair",
  Digit6: "ninjutsuButton",
  Digit8: "dodgeButton",
  Digit0: "teleportButton",
  KeyZ: "clairvoyance",
  KeyX: "empButton",
  KeyB: "cameraButton",
  KeyN: "nextCameraButton",
  KeyH: "operatorAbilityButton",
  KeyJ: "jumpButton",
  KeyK: "sleepButton",
  KeyC: "renkiButton",
  KeyL: "sabotageButton",
  KeyU: "utilityButton",
  KeyY: "fullscreenButton",
  KeyM: "mapActionButton",
  Backslash: "gameMuteButton",
  IntlYen: "gameMuteButton"
};

const CHARACTER_ACTION_BY_API = Object.freeze({
  "/api/kill": "attack",
  "/api/ninjutsu": "attack",
  "/api/shoot": "shoot",
  "/api/gunner-weapon": "interact",
  "/api/gunner-reload": "reload",
  "/api/gunner-hover-sprint": "power",
  "/api/gunner-heavy": "shoot",
  "/api/dodge": "evade",
  "/api/fighter-slash": "slash",
  "/api/limit-break": "power",
  "/api/sleep": "rest",
  "/api/renki": "focus",
  "/api/resource-convert": "focus",
  "/api/donate": "interact",
  "/api/teleport": "cast",
  "/api/gravity-time": "cast",
  "/api/gravity-storm": "cast",
  "/api/instant-warp": "cast",
  "/api/purchase": "interact",
  "/api/fire-jutsu": "cast",
  "/api/quantum-control": "cast",
  "/api/item-use": "interact",
  "/api/item-throw": "throw",
  "/api/flora-heal": "heal",
  "/api/alchemist-invention": "cast",
  "/api/borrowed-ability": "cast",
  "/api/emergency": "interact",
  "/api/luminous": "cast",
  "/api/vote": "interact",
  "/api/kick": "interact",
  "/api/sabotage": "interact",
  "/api/repair": "interact",
  "/api/utility": "interact",
  "/api/transfer": "interact",
  "/api/emp": "cast",
  "/api/jump": "jump"
});

const CHARACTER_ACTION_DURATION = Object.freeze({
  attack: 520,
  slash: 620,
  shoot: 260,
  reload: 760,
  evade: 560,
  cast: 820,
  heal: 900,
  power: 980,
  focus: 1100,
  rest: 1300,
  interact: 620,
  throw: 720
});

const PHYSICAL_ACTION_SEQUENCE = Object.freeze({
  attack: 0,
  slash: 1,
  shoot: 2,
  reload: 3,
  evade: 4,
  cast: 5,
  heal: 6,
  power: 7,
  focus: 8,
  rest: 9,
  interact: 10,
  jump: 11,
  // The attack cells supply the arm silhouettes; throw has its own timing and body mechanics below.
  throw: 0
});

function triggerCharacterAction(playerId, kind, duration = CHARACTER_ACTION_DURATION[kind] || 700, startedAt = state.frameNow || performance.now(), sourceEffectId = "", variant = "") {
  if (!playerId || !kind) return;
  state.characterActions.set(playerId, {
    kind,
    startedAt,
    duration: Math.max(120, Number(duration) || 700),
    sourceEffectId,
    variant: String(variant || "")
  });
}

const MAGIC_EFFECT_CHARACTER_ACTION = Object.freeze({
  "action-grit": "evade",
  "action-stand": "evade",
  "action-dodge": "evade",
  "action-rest": "rest",
  "action-teleport": "cast",
  "action-heart-teleport": "cast",
  "action-warp": "cast",
  "action-ninjutsu-focus": "focus",
  "action-shoot": "shoot",
  "action-sustained-fire": "shoot",
  "action-sniper-scope": "focus",
  "action-reload": "reload",
  "action-weak-bullet": "shoot",
  "action-weak-bullet-load": "reload",
  "action-taser": "shoot",
  "action-weapon-switch": "reload",
  "action-reason": "attack",
  "action-push": "attack",
  "action-sabotage": "interact",
  "action-repair": "interact",
  "action-smartphone": "interact",
  "action-smartphone-repair": "interact",
  "action-vending": "interact",
  "action-renki": "focus",
  "action-mana": "focus",
  "action-alchemy": "cast",
  "action-jump": "jump",
  "action-fighter-dodge-counter": "slash",
  "transfer-out": "interact",
  "transfer-in": "interact",
  "fighter-slash": "slash",
  "fighter-slash-parry": "slash",
  "fighter-iaido": "slash",
  "fighter-energy-charge": "power",
  "fighter-energy-release": "throw",
  "fighter-energy-impact": null,
  "fighter-shockwave": "slash",
  "gunner-hover-sprint": "power",
  "gunner-rpg": "shoot",
  "gunner-missile": "shoot",
  "gunner-nuclear": "power",
  "fire": "cast",
  "substitution": "evade",
  "flora": "heal",
  "flora-sunbeam": "cast",
  "limit-break": "power",
  "emp": "cast",
  "emp-charge": "cast",
  "gravity-accelerate": "cast",
  "gravity-decelerate": "cast",
  "gravity-storm": "cast",
  "alchemy-human-transmutation": "cast",
  "alchemy-excalibur": "slash",
  "alchemy-railgun": "shoot",
  "alchemy-particle-cannon": "shoot",
  "alchemy-particle-beam": "shoot",
  "mystery-reveal": "interact",
  "pair-route-violation": "evade",
  "idea-truth": "power",
  "idea-beauty": "power",
  "idea-good": "power",
  "idea-ascension": "power"
});

function magicCharacterActionKind(type) {
  if (MAGIC_EFFECT_CHARACTER_ACTION[type]) return MAGIC_EFFECT_CHARACTER_ACTION[type];
  // Map objects keep their dedicated B effect, but do not drive a character motion.
  if (type.startsWith("object-") || type.startsWith("alchemy-object-")) return null;
  if (type.startsWith("gravity-storm-")) return "cast";
  if (type.startsWith("emp-")) return "cast";
  if (/fighter-(iaido|slash)|action-fighter/.test(type)) return "slash";
  if (/gunner-(rpg|missile|nuclear)|railgun|particle|sunbeam/.test(type)) return "shoot";
  if (/flora/.test(type)) return "heal";
  if (/dodge|substitution|stand/.test(type)) return "evade";
  if (/limit-break|hover-sprint|idea-/.test(type)) return "power";
  if (/emp|gravity|fire|vibe|alchemy|teleport/.test(type)) return "cast";
  if (/vending|object|push/.test(type)) return "interact";
  return "";
}

const vendingHotkeys = {
  Digit1: "mineral-water",
  Digit2: "evade",
  Digit3: "speed",
  Digit4: "warp",
  Digit5: "mystery",
  Digit6: "fire",
  Digit7: "substitution",
  Digit8: "grit",
  Digit9: "heal",
  Digit0: "reason",
  KeyP: "mana",
  "Alt+Digit1": "railgun",
  "Alt+Digit2": "particle-cannon",
  "Alt+Digit3": "excalibur",
  "Alt+Digit4": "computer",
  "Alt+Digit5": "exile",
  "Alt+Digit6": "handgun",
  "Alt+Digit7": "smg",
  "Alt+Digit8": "assault",
  "Alt+Digit9": "sniper",
  "Alt+Digit0": "taser",
  "Alt+KeyM": "molotov",
  "Alt+KeyA": "antidote"
};

const vendingHold = {
  button: null,
  pointerId: null,
  timer: 0,
  suppressClickUntil: 0
};

async function purchaseVendingItem(button) {
  if (!button || button.disabled || button.hidden || button.dataset.purchasePending === "1") return false;
  button.dataset.purchasePending = "1";
  try {
    return await api("/api/purchase", { itemId: button.dataset.drink });
  } finally {
    delete button.dataset.purchasePending;
  }
}

function stopVendingHold() {
  if (vendingHold.timer) window.clearTimeout(vendingHold.timer);
  vendingHold.timer = 0;
  vendingHold.button = null;
  vendingHold.pointerId = null;
}

function startVendingHold(event, button) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  event.preventDefault();
  stopVendingHold();
  vendingHold.button = button;
  vendingHold.pointerId = event.pointerId;
  vendingHold.suppressClickUntil = performance.now() + 1000;
  try { button.setPointerCapture(event.pointerId); } catch {}
  purchaseVendingItem(button);
  const repeat = async () => {
    if (vendingHold.button !== button) return;
    await purchaseVendingItem(button);
    if (vendingHold.button === button && !button.disabled) {
      vendingHold.timer = window.setTimeout(repeat, 180);
    }
  };
  vendingHold.timer = window.setTimeout(repeat, 420);
}

const SPECIALIZED_HOLD_ACTION_IDS = new Set([
  "shootButton",
  "tabletShootShortcut",
  "jumpButton",
  "tabletJumpShortcut",
  "dashButton",
  "slowWalkButton",
  "fireJutsuButton",
  "itemUseButton",
  "itemThrowButton"
]);
const NON_REPEATABLE_ACTION_HOTKEY_BUTTONS = new Set([
  "mapActionButton",
  "gameMuteButton",
  "fullscreenButton"
]);

function isContinuousGameActionButton(button) {
  if (!(button instanceof HTMLButtonElement) || button.hidden) return false;
  if (state.screen !== "game" || state.data?.phase !== "playing") return false;
  if (
    SPECIALIZED_HOLD_ACTION_IDS.has(button.id) ||
    NON_REPEATABLE_ACTION_HOTKEY_BUTTONS.has(button.id) ||
    button.matches("[data-drink]")
  ) return false;
  if ([
    "tabletAbilityShortcut",
    "tabletNinjutsuShortcut",
    "tabletEmpShortcut",
    "tabletDodgeShortcut",
    "tabletRenkiShortcut",
    "tabletRestShortcut",
    "tabletManaToStaminaShortcut",
    "tabletDonateShortcut"
  ].includes(button.id)) return true;
  if (button.id === "ninjutsuButton" && hasDisplayedOperatorAccess(state.data?.self, "fighter")) return true;
  return Boolean(
    button.closest("#actionCommandRegistry") ||
    button.closest("#hackerAbilityGrid")
  );
}

function invokeContinuousGameAction(button, { allowHidden = false } = {}) {
  if (!button?.isConnected || button.disabled) return false;
  if (!allowHidden && (button.hidden || button.closest("[hidden]"))) return false;
  // The action keeps its existing icon, physical motion, and B-generated effect.
  // Holding only changes input cadence, so no new visual asset meaning is introduced.
  const source = button === els.tabletAbilityShortcut ? els.operatorAbilityButton : button;
  if (!source || source.disabled || source.hidden) return false;
  source.click();
  return true;
}

function continuousGameActionInterval(button) {
  return ["ninjutsuButton", "tabletNinjutsuShortcut"].includes(button?.id) && hasDisplayedOperatorAccess(state.data?.self, "fighter")
    ? FIGHTER_SLASH_REPEAT_INTERVAL_MS
    : CONTINUOUS_ACTION_REPEAT_INTERVAL_MS;
}

function isFighterSlashActionButton(button) {
  return button === els.ninjutsuButton && hasDisplayedOperatorAccess(state.data?.self, "fighter");
}

function stopContinuousActionKeyHold(code = "") {
  const hold = state.continuousActionKeyHold;
  if (code && hold.code !== code) return false;
  if (hold.timer) window.clearTimeout(hold.timer);
  hold.code = "";
  hold.repeat = null;
  hold.timer = 0;
  hold.repeatInterval = 0;
  return true;
}

function beginContinuousActionKeyHold(code, repeat, repeatInterval = CONTINUOUS_ACTION_REPEAT_INTERVAL_MS) {
  if (!code || typeof repeat !== "function") return false;
  stopContinuousActionKeyHold();
  const hold = state.continuousActionKeyHold;
  hold.code = code;
  hold.repeat = repeat;
  hold.repeatInterval = Math.max(80, Number(repeatInterval) || CONTINUOUS_ACTION_REPEAT_INTERVAL_MS);
  const tick = () => {
    if (hold.code !== code || hold.repeat !== repeat) return;
    if (state.screen !== "game" || state.data?.phase !== "playing") {
      stopContinuousActionKeyHold(code);
      return;
    }
    if (repeat() === false) {
      stopContinuousActionKeyHold(code);
      return;
    }
    hold.timer = window.setTimeout(tick, hold.repeatInterval);
  };
  if (repeat() === false) {
    stopContinuousActionKeyHold(code);
    return false;
  }
  hold.timer = window.setTimeout(tick, Math.max(CONTINUOUS_ACTION_HOLD_DELAY_MS, hold.repeatInterval));
  return true;
}

function beginContinuousButtonKeyHold(code, resolveButton) {
  const initialButton = resolveButton?.();
  const repeatInterval = continuousGameActionInterval(initialButton);
  return beginContinuousActionKeyHold(code, () => {
    const button = resolveButton?.();
    if (!isContinuousGameActionButton(button)) return false;
    if (!button.disabled) invokeContinuousGameAction(button, { allowHidden: true });
    return true;
  }, repeatInterval);
}

function stopContinuousActionHold(pointerId = null) {
  const hold = state.continuousActionHold;
  if (pointerId !== null && hold.pointerId !== pointerId) return false;
  if (hold.button) state.continuousActionSuppressClicks.set(hold.button, performance.now() + 600);
  if (hold.timer) window.clearTimeout(hold.timer);
  hold.timer = 0;
  hold.pointerId = null;
  hold.button = null;
  return true;
}

function beginContinuousActionHold(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  const button = event.target instanceof Element ? event.target.closest("button") : null;
  if (!isContinuousGameActionButton(button)) return;
  event.preventDefault();
  stopContinuousActionHold();
  const hold = state.continuousActionHold;
  hold.pointerId = event.pointerId;
  hold.button = button;
  state.continuousActionSuppressClicks.set(button, Number.POSITIVE_INFINITY);
  try { button.setPointerCapture(event.pointerId); } catch {}
  invokeContinuousGameAction(button);
  const repeatInterval = continuousGameActionInterval(button);
  const repeat = () => {
    if (hold.pointerId !== event.pointerId || hold.button !== button) return;
    if (state.screen !== "game" || state.data?.phase !== "playing" || !button.isConnected) {
      stopContinuousActionHold(event.pointerId);
      return;
    }
    if (!button.disabled && !button.hidden && !button.closest("[hidden]")) invokeContinuousGameAction(button);
    hold.timer = window.setTimeout(repeat, repeatInterval);
  };
  hold.timer = window.setTimeout(repeat, Math.max(CONTINUOUS_ACTION_HOLD_DELAY_MS, repeatInterval));
}

function suppressContinuousActionClick(event) {
  if (event.detail <= 0) return;
  const button = event.target instanceof Element ? event.target.closest("button") : null;
  const suppressUntil = button ? Number(state.continuousActionSuppressClicks.get(button)) || 0 : 0;
  if (performance.now() >= suppressUntil) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  state.continuousActionSuppressClicks.delete(button);
}

function allowContinuousActionKey(event, identity = event.code, repeatInterval = CONTINUOUS_ACTION_REPEAT_INTERVAL_MS) {
  const timestamp = performance.now();
  const key = String(identity || event.code);
  if (!event.repeat) {
    state.continuousActionKeyAt.set(key, timestamp);
    return true;
  }
  const previous = Number(state.continuousActionKeyAt.get(key)) || 0;
  if (timestamp - previous < repeatInterval) return false;
  state.continuousActionKeyAt.set(key, timestamp);
  return true;
}

function enhanceActionForElement(elementKey) {
  if (elementKey === "fireJutsuButton") return "fire";
  if (elementKey === "itemUseButton") return "use";
  if (elementKey === "itemThrowButton") return "throw";
  return "";
}

function emptyThrowTargetingState() {
  return {
    active: false,
    itemId: "",
    holdMs: 0,
    targetX: 0,
    targetY: 0,
    startedAt: 0,
    expiresAt: 0,
    lastFrameAt: 0,
    frame: 0,
    directionKeys: new Set()
  };
}

function throwTargetKey(event) {
  const code = String(event?.code || "");
  if (["KeyW", "ArrowUp"].includes(code)) return "up";
  if (["KeyS", "ArrowDown"].includes(code)) return "down";
  if (["KeyA", "ArrowLeft"].includes(code)) return "left";
  if (["KeyD", "ArrowRight"].includes(code)) return "right";
  return "";
}

function throwTargetDirection() {
  const active = state.throwTargeting.directionKeys;
  let dx = Number(active.has("right")) - Number(active.has("left"));
  let dy = Number(active.has("down")) - Number(active.has("up"));
  if (!dx && !dy && state.tabletOpen && state.tabletStick.pointerId !== null) {
    dx = Number(state.tabletStick.dx) || 0;
    dy = Number(state.tabletStick.dy) || 0;
  }
  const length = Math.hypot(dx, dy);
  return length > 1 ? { dx: dx / length, dy: dy / length } : { dx, dy };
}

function constrainThrowTarget(data, targetX, targetY) {
  const self = data?.players?.find((player) => player.id === data.selfId);
  const origin = self ? renderedPlayer(self) : null;
  if (!origin || !data?.map) return null;
  const radius = Math.max(12, (Number(data.map.playerRadius) || 36) * 0.4);
  let x = clamp(Number(targetX) || origin.x, radius, data.map.width - radius);
  let y = clamp(Number(targetY) || origin.y, radius, data.map.height - radius);
  const dx = x - origin.x;
  const dy = y - origin.y;
  const distance = Math.hypot(dx, dy);
  return { x, y, origin, distance };
}

function moveThrowTarget(dx, dy) {
  if (!state.throwTargeting.active || (!dx && !dy)) return false;
  const target = constrainThrowTarget(
    state.data,
    state.throwTargeting.targetX + dx,
    state.throwTargeting.targetY + dy
  );
  if (!target) return false;
  state.throwTargeting.targetX = target.x;
  state.throwTargeting.targetY = target.y;
  return true;
}

function updateThrowTargetingFrame(timestamp) {
  const target = state.throwTargeting;
  if (!target.active) return;
  const data = state.data;
  if (!data || data.phase !== "playing" || !data.self?.alive || data.self.ejected || data.self.inVent) {
    cancelThrowTargeting(true);
    return;
  }
  if (timestamp >= target.expiresAt) {
    cancelThrowTargeting(false, "投擲の接地点指定を終了しました。");
    return;
  }
  const elapsed = clamp(timestamp - (target.lastFrameAt || timestamp), 0, 40);
  target.lastFrameAt = timestamp;
  const direction = throwTargetDirection();
  if (direction.dx || direction.dy) {
    const distance = ITEM_THROW_TARGET_CURSOR_SPEED * elapsed / 1000;
    moveThrowTarget(direction.dx * distance, direction.dy * distance);
  }
  updateEnhanceReadout();
  target.frame = requestAnimationFrame(updateThrowTargetingFrame);
}

function beginThrowTargeting(itemId, holdMs = 0) {
  const data = state.data;
  if (!data || data.phase !== "playing" || !data.self?.alive || !itemId) return false;
  if (state.throwTargeting.active) cancelThrowTargeting(true);
  const preview = predictedThrowLanding(data, holdMs);
  if (!preview) return false;
  clearMovementInput();
  const timestamp = performance.now();
  state.throwTargeting = {
    active: true,
    itemId,
    holdMs: Math.max(0, Number(holdMs) || 0),
    targetX: preview.x,
    targetY: preview.y,
    startedAt: timestamp,
    expiresAt: timestamp + ITEM_THROW_TARGETING_WINDOW_MS,
    lastFrameAt: timestamp,
    frame: 0,
    directionKeys: new Set()
  };
  state.throwTargeting.frame = requestAnimationFrame(updateThrowTargetingFrame);
  updateEnhanceReadout();
  showToast("移動キーで接地点を動かし、キーを離すと投擲します。");
  return true;
}

function cancelThrowTargeting(silent = false, message = "投擲をキャンセルしました。") {
  if (!state.throwTargeting.active) return false;
  if (state.throwTargeting.frame) cancelAnimationFrame(state.throwTargeting.frame);
  state.throwTargeting = emptyThrowTargetingState();
  updateEnhanceReadout();
  if (!silent && message) showToast(message);
  return true;
}

async function confirmThrowTargeting() {
  if (!state.throwTargeting.active) return false;
  const landing = targetedThrowLanding(state.data);
  if (!landing?.valid) {
    showToast("接地できる場所へマーカーを移動してください。");
    return false;
  }
  const { itemId, holdMs, targetX, targetY } = state.throwTargeting;
  cancelThrowTargeting(true);
  return api("/api/item-throw", { itemId, holdMs, targetX, targetY });
}

function beginThrowTargetMovement(event) {
  if (!state.throwTargeting.active) return false;
  const direction = throwTargetKey(event);
  if (!direction) return false;
  event.preventDefault();
  if (!event.repeat && !state.throwTargeting.directionKeys.has(direction)) {
    state.throwTargeting.directionKeys.add(direction);
    const vector = {
      up: { dx: 0, dy: -1 },
      down: { dx: 0, dy: 1 },
      left: { dx: -1, dy: 0 },
      right: { dx: 1, dy: 0 }
    }[direction];
    moveThrowTarget(vector.dx * 24, vector.dy * 24);
  }
  return true;
}

function releaseThrowTargetMovement(event) {
  if (!state.throwTargeting.active) return false;
  const direction = throwTargetKey(event);
  if (!direction || !state.throwTargeting.directionKeys.has(direction)) return false;
  event.preventDefault();
  state.throwTargeting.directionKeys.delete(direction);
  if (state.throwTargeting.directionKeys.size === 0) void confirmThrowTargeting();
  return true;
}

function clairvoyanceDirection() {
  let dx = 0;
  let dy = 0;
  if (state.tabletOpen && state.tabletStick.pointerId !== null) {
    dx = Number(state.tabletStick.dx) || 0;
    dy = Number(state.tabletStick.dy) || 0;
  } else {
    dx = Number(state.keys.has("right")) - Number(state.keys.has("left"));
    dy = Number(state.keys.has("down")) - Number(state.keys.has("up"));
  }
  const length = Math.hypot(dx, dy);
  return length > 1 ? { dx: dx / length, dy: dy / length } : { dx, dy };
}

function beginClairvoyanceMovement(event) {
  if (!state.clairvoyance.active || state.throwTargeting.active) return false;
  const direction = throwTargetKey(event);
  if (!direction) return false;
  event.preventDefault();
  state.keys.add(direction);
  sendMovement(true);
  return true;
}

function releaseClairvoyanceMovement(event) {
  if (!state.clairvoyance.active || state.throwTargeting.active) return false;
  const direction = throwTargetKey(event);
  if (!direction) return false;
  event.preventDefault();
  state.keys.delete(direction);
  sendMovement(true);
  return true;
}

function updateClairvoyanceFrame(timestamp) {
  const view = state.clairvoyance;
  if (!view.active) return;
  const data = state.data;
  if (!data || data.phase !== "playing" || !data.self?.alive || data.self.ejected) {
    toggleClairvoyance(false);
    return;
  }
  const elapsed = clamp(timestamp - (view.lastFrameAt || timestamp), 0, 40);
  view.lastFrameAt = timestamp;
  const direction = clairvoyanceDirection();
  if (direction.dx || direction.dy) {
    const distance = 1_100 * elapsed / 1000;
    view.x = clamp(view.x + direction.dx * distance, 0, data.map.width);
    view.y = clamp(view.y + direction.dy * distance, 0, data.map.height);
  }
  view.frame = requestAnimationFrame(updateClairvoyanceFrame);
}

function toggleClairvoyance(force = null) {
  const data = state.data;
  const shouldEnable = force === null ? !state.clairvoyance.active : Boolean(force);
  if (shouldEnable && (!data || data.phase !== "playing" || !data.self?.alive || data.self.ejected)) return false;
  if (state.clairvoyance.frame) cancelAnimationFrame(state.clairvoyance.frame);
  if (!shouldEnable) {
    clearMovementInput();
    rotateMovementSession();
    sendMovement(true);
    state.clairvoyance = { active: false, x: 0, y: 0, lastFrameAt: 0, frame: 0 };
    state.camera.initialized = false;
    updateActionButtons(data);
    return true;
  }
  const self = data.players.find((player) => player.id === data.selfId);
  if (!self) return false;
  const origin = renderedPlayer(self);
  clearMovementInput();
  rotateMovementSession();
  sendMovement(true);
  const timestamp = performance.now();
  state.clairvoyance = { active: true, x: origin.x, y: origin.y, lastFrameAt: timestamp, frame: 0 };
  state.clairvoyance.frame = requestAnimationFrame(updateClairvoyanceFrame);
  state.camera.initialized = false;
  updateActionButtons(data);
  showToast("千里眼を起動しました。移動入力で観測焦点を動かします。");
  return true;
}

function updateEnhanceReadout() {
  if (!els.enhanceReadout) return;
  if (state.throwTargeting.active) {
    const remaining = Math.max(0, state.throwTargeting.expiresAt - performance.now());
    els.enhanceReadout.textContent = `接地点指定 ${(remaining / 1000).toFixed(1)}秒 / 移動キーを離して確定`;
    return;
  }
  const hold = state.enhanceHold;
  const elapsed = hold.startedAt ? Math.max(0, performance.now() - hold.startedAt) : 0;
  const requested = Math.min(ENHANCE_MAX_LEVEL_CLIENT, Math.floor(elapsed / ENHANCE_HOLD_STEP_MS_CLIENT));
  const affordable = Math.min(requested, Math.max(0, Math.floor(Number(state.data?.self?.mana) || 0)));
  els.enhanceReadout.textContent = hold.kind
    ? `エンハンス ${affordable} / -${affordable}MP`
    : "長押しでエンハンス / 0MP";
  if (hold.kind) hold.timer = requestAnimationFrame(updateEnhanceReadout);
}

function beginEnhanceAction(kind, pointerId = null) {
  if (!kind || state.enhanceHold.kind) return false;
  state.enhanceHold = { kind, pointerId, startedAt: performance.now(), timer: 0 };
  state.movementQueue?.clear?.();
  clearMovementInput();
  // A new movement session makes any request that was already in flight before
  // the hold stale, so it cannot move the player after Enhance has begun.
  rotateMovementSession();
  sendMovement(true);
  updateEnhanceReadout();
  return true;
}

function cancelEnhanceAction(kind = state.enhanceHold.kind) {
  const hold = state.enhanceHold;
  if (!hold.kind || (kind && hold.kind !== kind)) return false;
  if (hold.timer) cancelAnimationFrame(hold.timer);
  state.enhanceHold = { kind: "", pointerId: null, startedAt: 0, timer: 0 };
  updateEnhanceReadout();
  return true;
}

async function finishEnhanceAction(kind = state.enhanceHold.kind, pointerId = null) {
  const hold = state.enhanceHold;
  if (!hold.kind || (kind && hold.kind !== kind) || (pointerId !== null && hold.pointerId !== pointerId)) return false;
  const holdMs = Math.max(0, performance.now() - hold.startedAt);
  if (hold.timer) cancelAnimationFrame(hold.timer);
  state.enhanceHold = { kind: "", pointerId: null, startedAt: 0, timer: 0 };
  updateEnhanceReadout();
  if (kind === "fire") return api("/api/fire-jutsu", { holdMs });
  const itemId = els.itemSelect?.value || "";
  if (!itemId) return false;
  if (kind === "use" && itemId === "fire-jutsu") return api("/api/fire-jutsu", { holdMs });
  if (kind === "use" && itemId === "instant-warp") {
    beginInstantWarpTargeting();
    return true;
  }
  if (kind === "throw") {
    return beginThrowTargeting(itemId, holdMs);
  }
  if (kind === "use" && itemId.startsWith("invention:")) {
    return api("/api/alchemist-invention", { invention: itemId.slice(10) });
  }
  if (kind === "use" && itemId.startsWith("weapon:")) {
    const weaponId = itemId.slice(7);
    if (weaponId !== state.data?.self?.gunnerWeapon) {
      const switched = await api("/api/gunner-weapon", { weaponId });
      if (!switched) return false;
    }
    return pulseGunFire();
  }
  if (kind === "use" && itemId.startsWith("heavy:")) {
    return api("/api/gunner-heavy", { weapon: itemId.slice(6) });
  }
  if (kind === "use" && ["substitution", "stand-firm", "push"].includes(itemId)) {
    showToast("このアイテムは条件成立時に自動発動します。");
    return true;
  }
  return api("/api/item-use", { itemId, holdMs });
}

async function finishEnhanceActionAfterTablet(kind) {
  if (!beginEnhanceAction(kind)) return false;
  return finishEnhanceAction(kind);
}

function triggerActionHotkey(event) {
  const hotkey = event.altKey ? `Alt+${event.code}` : event.code;
  const elementKey = actionHotkeys[hotkey];
  if (!elementKey) return false;
  if (!["mapActionButton", "gameMuteButton"].includes(elementKey) && state.data?.phase !== "playing") return false;
  event.preventDefault();
  if (elementKey === "clairvoyance") {
    if (!event.repeat) toggleClairvoyance();
    return true;
  }
  if (elementKey === "smartphoneRepair") {
    if (!event.repeat) void triggerSmartphoneRepair();
    return true;
  }
  if (elementKey === "jumpButton") {
    if (!event.repeat) {
      state.jumpKeyDownAt = performance.now();
      void beginJumpPreparation();
    }
    return true;
  }
  const enhanceKind = enhanceActionForElement(elementKey);
  if (enhanceKind) {
    if (!event.repeat) beginEnhanceAction(enhanceKind);
    return true;
  }
  const button = els[elementKey];
  if (elementKey === "gameMuteButton") {
    if (!event.repeat) toggleGameMuted();
    return true;
  }
  if (isContinuousGameActionButton(button)) {
    if (!event.repeat) beginContinuousButtonKeyHold(event.code, () => els[elementKey]);
    return true;
  }
  if (NON_REPEATABLE_ACTION_HOTKEY_BUTTONS.has(elementKey)) {
    if (event.repeat) return true;
  } else if (!allowContinuousActionKey(
    event,
    `action:${event.code}`,
    elementKey === "ninjutsuButton" && hasDisplayedOperatorAccess(state.data?.self, "fighter")
      ? FIGHTER_SLASH_REPEAT_INTERVAL_MS
      : CONTINUOUS_ACTION_REPEAT_INTERVAL_MS
  )) {
    return true;
  }
  if (button && !button.disabled) button.click();
  return true;
}

function triggerItemHotkey(event) {
  if (state.screen !== "game" || state.data?.phase !== "playing" || els.itemControl.hidden || event.altKey || !event.shiftKey) return false;
  const kind = event.code === "KeyV" ? "use" : event.code === "KeyG" ? "throw" : "";
  if (!kind) return false;
  event.preventDefault();
  if (!event.repeat) beginEnhanceAction(kind);
  return true;
}

function resetJumpPreparationLocal() {
  state.jumpPreparing = false;
  state.jumpPreparePromise = null;
  state.jumpKeyDownAt = 0;
  state.jumpPointerDownAt = 0;
  [els.jumpButton, els.tabletJumpShortcut].forEach((button) => {
    button?.classList.remove("charging");
    button?.style.removeProperty("--jump-charge");
    if (button) button.textContent = "跳躍";
  });
}

function updateJumpPreparationUi() {
  if (!state.jumpPreparing || !state.jumpKeyDownAt) return;
  const preparedMs = Math.max(0, performance.now() - state.jumpKeyDownAt);
  const distance = 120 + preparedMs * 0.9;
  const stamina = 24 + distance * 0.14;
  const pulse = (preparedMs % 700) / 700;
  [els.jumpButton, els.tabletJumpShortcut].forEach((button) => {
    button?.style.setProperty("--jump-charge", pulse.toFixed(3));
    if (button) button.textContent = `跳躍 ${Math.round(distance)}m / ${Math.ceil(stamina)}SP`;
  });
}

async function beginJumpPreparation() {
  if (state.jumpPreparing) return state.jumpPreparePromise;
  const direction = getDirection();
  clearMovementInput();
  state.jumpPreparing = true;
  state.jumpKeyDownAt ||= performance.now();
  const aimX = Number(state.data?.self?.aimX);
  const aimY = Number(state.data?.self?.aimY);
  state.jumpPrepareDirection = direction.dx || direction.dy
    ? direction
    : {
        dx: Number.isFinite(aimX) ? aimX : 0,
        dy: Number.isFinite(aimY) ? aimY : 1
      };
  els.jumpButton.classList.add("charging");
  els.tabletJumpShortcut?.classList.add("charging");
  state.jumpPreparePromise = api("/api/jump/prepare", state.jumpPrepareDirection).then((result) => {
    if (!result) resetJumpPreparationLocal();
    return result;
  });
  return state.jumpPreparePromise;
}

async function cancelJumpPreparation() {
  if (!state.jumpPreparing) return;
  resetJumpPreparationLocal();
  await api("/api/jump/cancel").catch(() => false);
}

async function sendJump() {
  if (!state.jumpPreparing) await beginJumpPreparation();
  const prepared = await state.jumpPreparePromise;
  if (!prepared) return false;
  const direction = state.jumpPrepareDirection;
  rotateMovementSession();
  try {
    const jumped = await api("/api/jump", {
      dx: direction.dx,
      dy: direction.dy,
      movementSession: state.movementSession,
      movementSessionStartedAt: state.movementSessionStartedAt
    }, { authoritative: true });
    if (jumped) anchorLocalJumpRender(jumped);
    return Boolean(jumped);
  } finally {
    resetJumpPreparationLocal();
  }
}

function triggerVendingHotkey(event) {
  const itemId = vendingHotkeys[event.altKey ? `Alt+${event.code}` : event.code];
  if (!itemId || els.vendingPanel.hidden) return false;
  const resolveButton = () => els.vendingPanel.querySelector(`[data-drink="${itemId}"]`);
  const button = resolveButton();
  if (!button || button.hidden) return false;
  event.preventDefault();
  if (!event.repeat) {
    beginContinuousActionKeyHold(event.code, () => {
      const current = resolveButton();
      if (els.vendingPanel.hidden || !current || current.hidden) return false;
      if (!current.disabled) current.click();
      return true;
    });
  }
  return true;
}

function visibleGameplayChoiceButtons() {
  const roots = [
    !els.vendingPanel.hidden ? els.vendingPanel.querySelector(".vending-grid") : null,
    !els.alchemyControl.hidden ? els.alchemyChoiceGrid : null
  ].filter(Boolean);
  const focusedRoot = roots.find((root) => root.contains(document.activeElement));
  if (focusedRoot) {
    const focusedButtons = [...focusedRoot.querySelectorAll("button")].filter((button) =>
      !button.hidden && !button.closest("[hidden]")
    );
    if (focusedButtons.length) return focusedButtons;
  }
  for (const root of roots) {
    const buttons = [...root.querySelectorAll("button")].filter((button) =>
      !button.hidden && !button.closest("[hidden]")
    );
    if (buttons.length) return buttons;
  }
  return [];
}

function elementScreenCenter(element) {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function spatialSelectionCandidate(elements, current, key) {
  if (!elements.length) return null;
  if (!current || !elements.includes(current)) return elements[0];
  const origin = elementScreenCenter(current);
  const axis = key === "ArrowLeft" || key === "ArrowRight" ? "x" : "y";
  const crossAxis = axis === "x" ? "y" : "x";
  const sign = key === "ArrowRight" || key === "ArrowDown" ? 1 : -1;
  const candidates = elements
    .filter((element) => element !== current)
    .map((element) => ({ element, point: elementScreenCenter(element) }))
    .filter(({ point }) => (point[axis] - origin[axis]) * sign > 1)
    .sort((a, b) => {
      const aPrimary = Math.abs(a.point[axis] - origin[axis]);
      const bPrimary = Math.abs(b.point[axis] - origin[axis]);
      const aCross = Math.abs(a.point[crossAxis] - origin[crossAxis]);
      const bCross = Math.abs(b.point[crossAxis] - origin[crossAxis]);
      return aPrimary * 4 + aCross - (bPrimary * 4 + bCross);
    });
  if (candidates[0]) return candidates[0].element;
  const wrapped = elements
    .filter((element) => element !== current)
    .map((element) => ({ element, point: elementScreenCenter(element) }))
    .sort((a, b) => {
      const edgeOrder = sign > 0 ? a.point[axis] - b.point[axis] : b.point[axis] - a.point[axis];
      if (Math.abs(edgeOrder) > 1) return edgeOrder;
      return Math.abs(a.point[crossAxis] - origin[crossAxis]) - Math.abs(b.point[crossAxis] - origin[crossAxis]);
    });
  return wrapped[0]?.element || current;
}

function scrollRegionTarget(region) {
  if (!(region instanceof Element)) return null;
  const targetId = String(region.dataset.scrollTarget || "");
  return targetId ? document.getElementById(targetId) || region : region;
}

function visibleScrollRegions() {
  return [...document.querySelectorAll("[data-scroll-region]")].filter((region) =>
    !region.hidden && !region.closest("[hidden]") && region.getClientRects().length > 0
  );
}

function selectedScrollRegion() {
  const region = state.activeScrollRegion;
  if (region && region.isConnected && visibleScrollRegions().includes(region)) return region;
  if (region) region.classList.remove("scroll-region-selected", "scroll-region-expanded");
  els.sidePanel?.classList.remove("scroll-region-expanded-host");
  els.statusPanel?.classList.remove("scroll-region-expanded-host");
  state.activeScrollRegion = null;
  return null;
}

function syncExpandedScrollRegion(region) {
  document.querySelectorAll("[data-scroll-region].scroll-region-expanded").forEach((entry) => {
    entry.classList.remove("scroll-region-expanded");
  });
  els.sidePanel?.classList.remove("scroll-region-expanded-host");
  els.statusPanel?.classList.remove("scroll-region-expanded-host");
  if (!(region instanceof Element) || !els.sidePanel?.contains(region)) return;
  const choiceCount = scrollRegionChoices(region).length;
  if (choiceCount < 7) return;
  region.classList.add("scroll-region-expanded");
  els.sidePanel.classList.add("scroll-region-expanded-host");
  region.closest("#statusPanel")?.classList.add("scroll-region-expanded-host");
}

function setSelectedScrollRegion(region, { focus = true } = {}) {
  document.querySelectorAll("[data-scroll-region].scroll-region-selected").forEach((entry) => {
    entry.classList.remove("scroll-region-selected");
    entry.removeAttribute("aria-current");
  });
  state.activeScrollRegion = region || null;
  if (!region) {
    syncExpandedScrollRegion(null);
    return false;
  }
  region.classList.add("scroll-region-selected");
  region.setAttribute("aria-current", "true");
  syncExpandedScrollRegion(region);
  if (focus) region.focus?.({ preventScroll: true });
  const target = scrollRegionTarget(region);
  target?.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "smooth" });
  return true;
}

function cycleSelectedScrollRegion(direction = 1) {
  const regions = visibleScrollRegions();
  if (!regions.length) return false;
  const current = selectedScrollRegion();
  const currentIndex = regions.indexOf(current);
  const start = currentIndex >= 0 ? currentIndex : direction > 0 ? -1 : 0;
  const next = regions[(start + direction + regions.length) % regions.length];
  return setSelectedScrollRegion(next);
}

function scrollRegionChoices(region) {
  const target = scrollRegionTarget(region);
  if (!target) return [];
  return [...target.querySelectorAll("button, [role='option'], [data-hacker-recipe], [data-item-choice]")].filter((element) =>
    !element.hidden && !element.disabled && !element.closest("[hidden]") && element.getClientRects().length > 0
  );
}

function selectItemChoice(itemId, focus = true) {
  const button = els.itemInventoryGrid?.querySelector(`[data-item-choice="${CSS.escape(String(itemId || ""))}"]`);
  if (!button) return false;
  els.itemSelect.value = button.dataset.itemChoice;
  els.itemSelect.dispatchEvent(new Event("change", { bubbles: true }));
  if (focus) button.focus({ preventScroll: true });
  button.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  return true;
}

function navigateSelectedScrollRegion(key) {
  const region = selectedScrollRegion();
  if (!region) return false;
  const target = scrollRegionTarget(region);
  const vertical = key === "ArrowUp" || key === "ArrowDown";
  const direction = key === "ArrowDown" || key === "ArrowRight" ? 1 : -1;
  let moved = false;
  if (region === els.hackerAbilityDock) {
    moved = navigateHackerAction(key);
  } else {
    const choices = scrollRegionChoices(region);
    if (choices.length) {
      const current = choices.includes(document.activeElement)
        ? document.activeElement
        : choices.find((choice) => choice.getAttribute("aria-selected") === "true" || choice.classList.contains("selected")) || choices[0];
      const next = spatialSelectionCandidate(choices, current, key);
      if (next?.dataset.itemChoice) moved = selectItemChoice(next.dataset.itemChoice, true);
      else if (next) {
        next.focus({ preventScroll: true });
        next.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
        moved = true;
      }
    }
  }
  if (vertical && target) {
    const amount = Math.max(48, Math.round((target.clientHeight || 120) * 0.34)) * direction;
    target.scrollBy({ top: amount, behavior: "smooth" });
  }
  return moved || vertical;
}

function activateSelectedScrollRegionChoice() {
  const region = selectedScrollRegion();
  if (!region) return false;
  if (region === els.hackerAbilityDock) return activateHackerActionSelection();
  const choices = scrollRegionChoices(region);
  const selected = choices.includes(document.activeElement) ? document.activeElement : null;
  if (!selected || selected.dataset.itemChoice) return Boolean(selected);
  selected.click();
  return true;
}

function navigateGameplayChoices(key) {
  const buttons = visibleGameplayChoiceButtons();
  if (!buttons.length) return false;
  const current = buttons.includes(document.activeElement)
    ? document.activeElement
    : buttons.find((button) => button.dataset.hackerRecipe === state.hackerSelectedRecipeId) || buttons[0];
  const next = spatialSelectionCandidate(buttons, current, key);
  if (!next) return false;
  if (next.dataset.hackerRecipe) selectHackerAction(next.dataset.hackerRecipe, true);
  else if (next.dataset.alchemyChoice) selectAlchemyRecipe(next.dataset.alchemyChoice, true);
  else next.focus({ preventScroll: true });
  next.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  return true;
}

function activateGameplayChoice() {
  const buttons = visibleGameplayChoiceButtons();
  if (!buttons.length) return false;
  const selected = buttons.includes(document.activeElement)
    ? document.activeElement
    : buttons.find((button) => button.dataset.hackerRecipe === state.hackerSelectedRecipeId) || buttons[0];
  if (!selected || selected.disabled) return false;
  selected.click();
  return true;
}

function navigateGameplaySelect(select, direction) {
  if (!(select instanceof HTMLSelectElement) || !direction) return false;
  const options = [...select.options].filter((option) => !option.disabled && !option.hidden);
  if (!options.length) return false;
  const current = options.findIndex((option) => option.value === select.value);
  const next = options[(Math.max(0, current) + direction + options.length) % options.length];
  if (!next) return false;
  select.value = next.value;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  select.focus({ preventScroll: true });
  return true;
}

function activateGameplaySelect(select) {
  const actionBySelect = new Map([
    [els.teleportModeSelect, els.teleportButton],
    [els.teleportTargetSelect, els.teleportButton],
    [els.empPhaseSelect, els.empButton],
    [els.sabotageSelect, els.sabotageButton],
    [els.alchemySelect, els.alchemyButton]
  ]);
  const button = actionBySelect.get(select);
  if (!button || button.hidden || button.disabled) return false;
  button.click();
  return true;
}

function setActionSelection(button, scroll = true) {
  void scroll;
  if (!button) return false;
  previewBorrowedAbilityButton(button);
  return false;
}

function previewBorrowedAbilityButton(button) {
  const type = button?.dataset?.borrowedOperator || "";
  if (state.data?.self?.special === "alchemist" && type) {
    const recipe = alchemyRecipes.find((entry) => entry.id === `borrowed-${type}`);
    if (recipe) {
      els.alchemySelect.value = recipe.id;
      renderTargetOptions(state.data);
      const savedMode = state.borrowedAbilityModes[type];
      if (savedMode && [...els.teleportModeSelect.options].some((option) => option.value === savedMode)) {
        els.teleportModeSelect.value = savedMode;
        if (type === "gravity") ensureTeleportTargetForMode(state.data);
      }
    }
    if (state.operatorBranchesOpen) setOperatorBranchesOpen(false);
  }
}

function keyboardContextKey() {
  if (state.keybindOpen) return "keybind";
  if (state.screen === "title") return "title";
  if (state.screen === "tactics") return `tactics:${state.tacticsChapterId}`;
  if (state.fieldFeedOpen) return "game:feed:chat";
  if (state.expandedMapOpen) return "game:map";
  if (state.operatorBranchesOpen) return "game:operator-branches";
  if (state.tabletOpen) return "game:tablet";
  return `game:${state.data?.phase || "join"}`;
}

function keyboardControlsIn(...roots) {
  const controls = [];
  const seen = new Set();
  for (const root of roots.filter(Boolean)) {
    const candidates = root.matches?.("button, input, select, textarea, [tabindex]")
      ? [root, ...root.querySelectorAll("button, input, select, textarea, [tabindex]")]
      : [...root.querySelectorAll("button, input, select, textarea, [tabindex]")];
    for (const element of candidates) {
      if (seen.has(element) || element.disabled || element.hidden || element.getAttribute("tabindex") === "-1") continue;
      if (element.matches?.('input[type="hidden"]') || element.closest("[hidden]") || element.getClientRects().length === 0) continue;
      seen.add(element);
      controls.push(element);
    }
  }
  return controls;
}

function contextKeyboardElements() {
  if (state.keybindOpen) return keyboardControlsIn(els.keybindOverlay);
  if (state.screen === "title") {
    return keyboardControlsIn(els.titleMenu, els.titleMuteButton);
  }
  if (state.screen === "tactics") {
    return keyboardControlsIn(els.tacticsPanel);
  }
  if (state.fieldFeedOpen) return keyboardControlsIn(els.fieldFeedPanel);
  if (state.expandedMapOpen) return keyboardControlsIn(els.expandedMapOverlay);
  if (state.operatorBranchesOpen) return keyboardControlsIn(els.operatorBranchPanel);
  if (state.tabletOpen) return [];
  const phase = state.data?.phase || "join";
  if (phase === "playing") return [];
  const panel = phase === "join"
    ? els.joinPanel
    : phase === "lobby"
      ? els.lobbyPanel
      : phase === "selecting"
        ? els.selectPanel
        : phase === "meeting"
          ? els.meetingPanel
          : els.endOverlay;
  if (phase === "meeting") {
    return keyboardControlsIn(
      els.sabotageControl,
      els.meetingPanel,
      els.fieldFeedPanel,
      els.statusPanel,
      els.titleHomeButton,
      els.leaveRoomButton,
      els.debugForceEndButton
    );
  }
  return keyboardControlsIn(panel, els.titleHomeButton, els.leaveRoomButton, els.debugForceEndButton);
}

function preferredKeyboardElement(elements) {
  const phase = state.data?.phase || "join";
  const preferred = state.fieldFeedOpen
    ? (!els.chatInput.disabled ? els.chatInput : els.chatTab)
    : state.screen === "title"
    ? els.titlePlayButton
    : state.screen === "tactics"
      ? els.tacticsChapterList.querySelector("button.active")
    : phase === "join"
        ? els.offlineJoinButton
        : phase === "lobby"
          ? els.mapSelect
          : phase === "selecting"
            ? els.operatorList.querySelector(".operator-card:not(:disabled)")
            : phase === "meeting"
              ? els.voteList.querySelector(".vote-card:not(:disabled)")
              : els.resetButton;
  return elements.includes(preferred) ? preferred : elements[0] || null;
}

function setKeyboardSelection(element, scroll = true) {
  const controls = contextKeyboardElements();
  if (!element || !controls.includes(element)) return false;
  document.querySelectorAll(".keyboard-selected").forEach((item) => {
    item.classList.remove("keyboard-selected");
  });
  state.keyboardElement = element;
  element.classList.add("keyboard-selected");
  element.focus({ preventScroll: true });
  if (scroll) element.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  return true;
}

function syncKeyboardContext(force = false) {
  const context = keyboardContextKey();
  const controls = contextKeyboardElements();
  const currentValid = state.keyboardElement?.isConnected && controls.includes(state.keyboardElement);
  if (!force && context === state.keyboardContext && currentValid) return;
  state.keyboardContext = context;
  state.keyboardElement = null;
  document.querySelectorAll(".keyboard-selected").forEach((item) => {
    item.classList.remove("keyboard-selected");
  });
  const preferred = preferredKeyboardElement(controls);
  if (preferred) setKeyboardSelection(preferred, false);
}

function navigateKeyboardContext(key) {
  const controls = contextKeyboardElements();
  if (!controls.length) return false;
  const active = controls.includes(document.activeElement) ? document.activeElement : state.keyboardElement;
  return setKeyboardSelection(spatialSelectionCandidate(controls, active, key));
}

function activateKeyboardSelection() {
  const controls = contextKeyboardElements();
  const element = controls.includes(document.activeElement) ? document.activeElement : state.keyboardElement;
  if (!element || !controls.includes(element) || element.disabled) return false;
  if (element.matches("button, [role='button']")) {
    element.click();
    return true;
  }
  element.focus();
  return false;
}

function cycleLobbySelect(select) {
  if (!select || select.disabled || select.options.length < 2) return false;
  select.selectedIndex = (select.selectedIndex + 1) % select.options.length;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  select.focus({ preventScroll: true });
  return true;
}

function cycleSelectBy(select, direction = 1) {
  if (!select || select.disabled || select.options.length < 2) return false;
  const count = select.options.length;
  select.selectedIndex = (select.selectedIndex + direction + count) % count;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

function selectAlchemyRecipe(conversion, focus = false) {
  const recipe = alchemyRecipes.find((candidate) => candidate.id === conversion) || alchemyRecipes[0];
  els.alchemySelect.value = recipe.id;
  els.alchemySelectionText.textContent = `${recipe.label} ${hackerRecipePresentation(recipe)}`;
  els.alchemyChoiceGrid.querySelectorAll("[data-alchemy-choice]").forEach((button) => {
    const selected = button.dataset.alchemyChoice === recipe.id;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
    if (selected && focus) button.focus({ preventScroll: true });
  });
  if (state.data) {
    renderTargetOptions(state.data);
    updateActionButtons(state.data);
  }
  return recipe;
}

function cycleAlchemyRecipe(direction) {
  const available = availableHackerRecipes();
  const currentIndex = available.findIndex((recipe) => recipe.id === els.alchemySelect.value);
  const nextIndex = (Math.max(0, currentIndex) + direction + available.length) % available.length;
  selectAlchemyRecipe(available[nextIndex].id, false);
}

function triggerAlchemySelectionHotkey(event) {
  return false;
}

function triggerHackerHotkey(event) {
  const self = state.data?.self;
  if (state.screen !== "game" || state.data?.phase !== "playing" || self?.special !== "alchemist") return false;
  const activeTag = document.activeElement?.tagName || "";
  const hackerNavigationAvailable = !state.expandedMapOpen && !state.fieldFeedOpen && !state.tabletOpen &&
    !state.operatorBranchesOpen && !state.keybindOpen && !["INPUT", "TEXTAREA", "SELECT"].includes(activeTag);
  const hackerSelectionFocused = selectedScrollRegion() === els.hackerAbilityDock;
  if (!event.shiftKey && event.code === "KeyP" && hackerNavigationAvailable) {
    event.preventDefault();
    if (allowContinuousActionKey(event, "hacker-target")) cycleHackerTarget(1);
    return true;
  }
  if (hackerSelectionFocused && event.shiftKey && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    selectHackerCategory("", event.key === "ArrowRight" ? 1 : -1);
    return true;
  }
  if (hackerSelectionFocused && !event.shiftKey && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    navigateHackerAction(event.key);
    return true;
  }
  if (hackerSelectionFocused && (event.key === "Enter" || event.code === "Space")) {
    event.preventDefault();
    if (!event.repeat) {
      beginContinuousButtonKeyHold(event.code, () => els.hackerAbilityGrid.querySelector(
        `[data-hacker-recipe="${CSS.escape(state.hackerSelectedRecipeId || "")}"]`
      ));
    }
    return true;
  }
  return false;
}

function allowSelectionArrowRepeat(event) {
  if (!event.key.startsWith("Arrow")) return true;
  const now = performance.now();
  if (!event.repeat || state.arrowRepeatKey !== event.code) {
    state.arrowRepeatKey = event.code;
    state.arrowRepeatAt = now;
    return true;
  }
  if (now - state.arrowRepeatAt < SELECTION_ARROW_REPEAT_INTERVAL_MS) return false;
  state.arrowRepeatAt = now;
  return true;
}

function availableBorrowedOperatorTypes(self = state.data?.self) {
  if (self?.special !== "alchemist" || !self.hackerRootActive) return [];
  const reported = Array.isArray(self.hackerRootOperators) ? self.hackerRootOperators : HACKER_ROOT_OPERATOR_TYPES;
  return reported.filter((type) => HACKER_ROOT_OPERATOR_TYPES.includes(type));
}

function cycleBorrowedOperator(direction = 1) {
  const self = state.data?.self;
  if (self?.special !== "alchemist") return false;
  const types = availableBorrowedOperatorTypes(self);
  if (!types.length) return false;
  const currentIndex = types.indexOf(state.borrowedOperatorType);
  const startIndex = currentIndex >= 0 ? currentIndex : direction > 0 ? -1 : 0;
  const nextIndex = (startIndex + direction + types.length) % types.length;
  const type = types[nextIndex];
  const recipe = alchemyRecipes.find((entry) => entry.id === `borrowed-${type}`);
  if (!recipe) return false;
  state.borrowedOperatorType = type;
  renderTargetOptions(state.data);
  updateActionButtons(state.data);
  setActionSelection(els.operatorAbilityButton);
  showToast(`借用オペ: ${recipe.label}`);
  return true;
}

function isDeveloperAnalyticsHotkey(event) {
  const focusedTag = document.activeElement?.tagName;
  return event.ctrlKey && event.altKey && !event.shiftKey && event.code === "Home" && !["INPUT", "TEXTAREA"].includes(focusedTag);
}

function triggerDeveloperAnalyticsHotkey(event) {
  if (!isDeveloperAnalyticsHotkey(event)) return false;
  event.preventDefault();
  if (event.repeat) return true;
  els.analyticsToggleButton.hidden = false;
  void loadDropoffAnalytics();
  return true;
}

function triggerScreenHotkey(event) {
  if (state.screen === "title" && event.code === "KeyP") {
    event.preventDefault();
    if (!event.repeat) els.titlePlayButton.click();
    return true;
  }
  if (state.screen === "title" && event.code === "KeyI") {
    event.preventDefault();
    if (!event.repeat) els.titleTacticsButton.click();
    return true;
  }
  if (state.screen === "tactics" && /^Digit[1-7]$/.test(event.code)) {
    const button = els.soloMissionGrid.querySelector(`[data-solo-mission="${soloMissionIds[Number(event.code.slice(-1)) - 1]}"]`);
    if (!button) return false;
    event.preventDefault();
    if (!event.repeat) button.click();
    return true;
  }
  if (state.screen === "game" && event.code === "KeyY") {
    event.preventDefault();
    if (!event.repeat) toggleFullscreen();
    return true;
  }
  if (state.screen === "game" && (state.data?.phase || "join") === "join") {
    const joinAction = event.code === "KeyO"
      ? () => els.offlineJoinButton.click()
      : event.code === "KeyL"
        ? () => {
            if (els.joinButton.hidden || els.joinButton.disabled) showToast("オンラインルームは現在利用できません。");
            else els.joinButton.click();
          }
        : null;
    if (joinAction) {
      event.preventDefault();
      if (!event.repeat) joinAction();
      return true;
    }
  }
  if (state.screen === "game" && state.data?.phase === "playing" && event.key === "Tab") {
    event.preventDefault();
    if (!event.repeat) setTabletOpen(!state.tabletOpen);
    return true;
  }
  if (state.screen === "game" && state.data?.phase === "lobby") {
    if (event.shiftKey && /^Digit[1-9]$/.test(event.code)) {
      const kickButton = els.lobbyList.querySelector(`[data-kick-hotkey="${event.code.slice(-1)}"]`);
      if (kickButton && !kickButton.disabled) {
        event.preventDefault();
        if (!event.repeat) kickButton.click();
        return true;
      }
    }
    const lobbyAction = {
      KeyB: () => !els.addBotButton.disabled && els.addBotButton.click(),
      KeyS: () => !els.startButton.disabled && els.startButton.click(),
      KeyM: () => cycleLobbySelect(els.mapSelect),
      KeyT: () => cycleLobbySelect(els.hostTeamSelect)
    }[event.code];
    if (lobbyAction) {
      event.preventDefault();
      if (!event.repeat) lobbyAction();
      return true;
    }
  }
  if (state.screen === "game" && state.data?.phase === "playing") {
    const self = state.data?.self;
    if (["Comma", "Quote", "KeyG"].includes(event.code)) {
      event.preventDefault();
      if (!event.repeat) {
        const action = event.code === "Comma"
          ? () => void api("/api/resource-convert", { direction: "mana-to-stamina" })
          : () => void api("/api/donate");
        beginContinuousActionKeyHold(event.code, () => {
          action();
          return true;
        });
      }
      return true;
    }
    if (event.code === "KeyT" && (
      self?.special === "gunner" ||
      hasDisplayedOperatorAccess(self, "gunner") ||
      (self?.purchasedWeapons || []).length > 0 ||
      (self?.inventions || []).length > 0 ||
      (self?.heavyWeapons || []).length > 0
    )) {
      event.preventDefault();
      if (!event.repeat) {
        const direction = event.shiftKey ? -1 : 1;
        beginContinuousActionKeyHold(event.code, () => {
          if (els.weaponButton.hidden) return false;
          if (!els.weaponButton.disabled) void api("/api/gunner-weapon", { direction });
          return true;
        });
      }
      return true;
    }
    if (event.code === "KeyP" && !els.vendingPanel.hidden) return false;
    const selectionAction = {
      KeyO: () => cycleActiveOperatorMode(1),
      KeyP: () => !els.teleportControl.hidden && cycleSelectBy(els.teleportTargetSelect, 1),
      Semicolon: () => cycleSelectBy(els.empPhaseSelect, 1)
    }[event.code];
    if (selectionAction) {
      event.preventDefault();
      if (!event.repeat) selectionAction();
      return true;
    }
  }
  if (state.screen === "game" && state.data?.phase === "playing" && event.code === "KeyL") {
    event.preventDefault();
    if (!event.repeat && state.data?.self?.role === "attacker") {
      beginContinuousButtonKeyHold(event.code, () => els.sabotageButton);
    }
    return true;
  }
  if (state.screen === "game" && state.data?.phase === "selecting" && /^Digit[1-9]$/.test(event.code)) {
    const hotkey = event.code.slice(-1);
    const button = els.operatorList.querySelector(`.operator-card[data-hotkey="${hotkey}"]:not(:disabled)`);
    if (!button) return false;
    event.preventDefault();
    if (!event.repeat) button.click();
    return true;
  }
  if (state.screen === "game" && state.data?.phase === "meeting" && /^Digit[0-9]$/.test(event.code)) {
    const button = els.voteList.querySelector(`[data-hotkey="${event.code === "Digit0" ? "0" : event.code.slice(-1)}"]`);
    if (!button || button.disabled) return false;
    event.preventDefault();
    if (!event.repeat) button.click();
    return true;
  }
  return false;
}

function bindEvents() {
  ensureDynamicAlchemyChoices();
  document.addEventListener("pointerdown", unlockAudio, { passive: true });
  document.addEventListener("keydown", unlockAudio);
  document.addEventListener("pointerdown", beginContinuousActionHold, true);
  document.addEventListener("click", suppressContinuousActionClick, true);
  document.addEventListener("pointerdown", (event) => {
    const button = event.target instanceof Element ? event.target.closest("button") : null;
    if (!button || button.disabled) return;
    const rect = button.getBoundingClientRect();
    button.style.setProperty("--press-x", `${event.clientX - rect.left}px`);
    button.style.setProperty("--press-y", `${event.clientY - rect.top}px`);
    button.classList.remove("press-pulse");
    void button.offsetWidth;
    button.classList.add("press-pulse");
  }, { passive: true });
  document.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("button")) playSound("click");
  });
  els.titlePlayButton.addEventListener("click", () => {
    if (els.titlePlayButton.disabled) return;
    loadGameplayTextures();
    if (state.onlineAvailable) {
      deactivateOfflineMode();
      recordUsageCheckpoint("online_open");
    } else {
      activateOfflineMode();
      recordUsageCheckpoint("offline_open");
    }
    enterFullscreen();
    switchScreenWithEffect("game");
  });
  els.titleTacticsButton.addEventListener("click", () => {
    recordUsageCheckpoint("tactics_open");
    switchScreenWithEffect("tactics");
  });
  els.soloMissionGrid.querySelectorAll("[data-solo-mission]").forEach((button) => {
    button.addEventListener("click", () => startSoloMission(button.dataset.soloMission));
  });
  els.fullscreenButton.addEventListener("click", toggleFullscreen);
  els.keybindButton.addEventListener("click", () => setKeybindOpen(!state.keybindOpen));
  els.tabletButton?.addEventListener("click", () => setTabletOpen(!state.tabletOpen));
  els.tabletBranchCloseButton.addEventListener("click", () => setTabletBranchGroup(""));
  els.tabletBranchBackButton.addEventListener("click", () => setTabletBranchPath(""));
  els.tabletBranchList.addEventListener("scroll", renderTabletBranchLines, { passive: true });
  els.tabletNinjutsuShortcut.addEventListener("click", () => els.ninjutsuButton.click());
  els.tabletEmpShortcut.addEventListener("click", () => els.empButton.click());
  els.tabletClairvoyanceShortcut.addEventListener("click", () => toggleClairvoyance());
  els.tabletDodgeShortcut.addEventListener("click", () => els.dodgeButton.click());
  els.tabletRenkiShortcut.addEventListener("click", () => els.renkiButton.click());
  els.tabletRestShortcut.addEventListener("click", () => els.sleepButton.click());
  els.tabletManaToStaminaShortcut.addEventListener("click", () => void api("/api/resource-convert", { direction: "mana-to-stamina" }));
  els.tabletDonateShortcut.addEventListener("click", () => void api("/api/donate"));
  window.addEventListener("resize", scheduleTabletBranchLayout, { passive: true });
  window.addEventListener("resize", scheduleActiveEffectsLayout, { passive: true });
  bindTabletControls();
  els.operatorBranchCloseButton.addEventListener("click", () => setOperatorBranchesOpen(false));
  els.keybindCloseButton.addEventListener("click", () => setKeybindOpen(false));
  els.keybindOverlay.addEventListener("click", (event) => {
    if (event.target === els.keybindOverlay) setKeybindOpen(false);
  });
  document.addEventListener("fullscreenchange", syncFullscreenButton);
  els.titleHomeButton.addEventListener("click", () => switchScreenWithEffect("title"));
  els.tacticsBackButton.addEventListener("click", () => switchScreenWithEffect("title"));
  els.titleMuteButton?.addEventListener("click", toggleGameMuted);
  els.tacticsMuteButton?.addEventListener("click", toggleGameMuted);
  els.gameMuteButton?.addEventListener("click", toggleGameMuted);
  els.skinSelect.addEventListener("change", syncSelectedSkin);
  els.joinButton.addEventListener("click", joinRoom);
  els.offlineJoinButton.addEventListener("click", () => joinRoom({ forceOffline: true }));
  [els.nameInput, els.roomInput].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      joinRoom({ forceOffline: event.shiftKey || !state.onlineAvailable });
    });
  });
  els.refreshRoomsButton.addEventListener("click", refreshRooms);
  els.addBotButton.addEventListener("click", () => api("/api/add-bot"));
  els.startButton.addEventListener("click", () => api("/api/start"));
  els.analyticsToggleButton.addEventListener("click", () => void loadDropoffAnalytics());
  els.hackerTargetButton.addEventListener("click", () => cycleHackerTarget(1));
  const bindHackerCategoryStep = (button, direction) => {
    let repeatTimer = 0;
    let repeatInterval = 0;
    const stop = () => {
      window.clearTimeout(repeatTimer);
      window.clearInterval(repeatInterval);
      repeatTimer = 0;
      repeatInterval = 0;
    };
    button.addEventListener("click", () => selectHackerCategory("", direction));
    button.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      stop();
      repeatTimer = window.setTimeout(() => {
        repeatInterval = window.setInterval(() => selectHackerCategory("", direction), 150);
      }, 420);
    });
    button.addEventListener("pointerup", stop);
    button.addEventListener("pointercancel", stop);
    button.addEventListener("pointerleave", stop);
  };
  bindHackerCategoryStep(els.hackerCategoryPreviousButton, -1);
  bindHackerCategoryStep(els.hackerCategoryNextButton, 1);
  els.hackerAbilityGrid.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-hacker-recipe]");
    if (!button || button.disabled) return;
    selectHackerAction(button.dataset.hackerRecipe, false);
    void executeHackerRecipe(button.dataset.hackerRecipe);
  });
  els.resetButton.addEventListener("click", () => {
    if (state.data?.soloMission) {
      void leaveCurrentRoom();
      return;
    }
    void api("/api/reset");
  });
  els.debugForceEndButton.addEventListener("click", () => api("/api/force-end"));
  els.leaveRoomButton.addEventListener("click", leaveCurrentRoom);
  els.mapActionButton.addEventListener("click", () => toggleExpandedMapFromAction());
  els.mapCloseButton.addEventListener("click", () => setExpandedMapOpen(false));
  els.taskButton.addEventListener("click", () => api("/api/task", { taskId: nearestTask()?.id || "nearest" }));
  els.ninjutsuButton.addEventListener("click", performNinjutsu);
  const bindGunTriggerButton = (button) => {
    button.addEventListener("pointerdown", (event) => {
      if ((event.pointerType === "mouse" && event.button !== 0) || button.disabled) return;
      event.preventDefault();
      state.gunTriggerPointerId = event.pointerId;
      button.setPointerCapture?.(event.pointerId);
      void beginGunFire();
    });
    button.addEventListener("pointerup", releaseGunPointer);
    button.addEventListener("pointercancel", releaseGunPointer);
    button.addEventListener("lostpointercapture", releaseGunPointer);
    button.addEventListener("click", (event) => {
      if (event.detail === 0) void pulseGunFire();
    });
  };
  const releaseGunPointer = (event) => {
    if (state.gunTriggerPointerId !== null && event.pointerId !== state.gunTriggerPointerId) return;
    state.gunTriggerPointerId = null;
    void endGunFire();
  };
  bindGunTriggerButton(els.shootButton);
  bindGunTriggerButton(els.tabletShootShortcut);
  els.weaponButton.addEventListener("click", () => api("/api/gunner-weapon", { direction: 1 }));
  els.gunnerReloadButton.addEventListener("click", () => api("/api/gunner-reload"));
  els.dodgeButton.addEventListener("click", () => api("/api/dodge"));
  els.teleportButton.addEventListener("click", triggerTeleportAction);
  els.empButton.addEventListener("click", () => api("/api/emp", { phase: els.empPhaseSelect.value }));
  [els.teleportModeSelect, els.teleportTargetSelect, els.empPhaseSelect, els.sabotageSelect].forEach((select) => {
    select.addEventListener("change", () => {
      if (select === els.teleportModeSelect) {
        rememberSelectedOperatorMode();
        ensureTeleportTargetForMode(state.data);
      }
      if (state.data) updateActionButtons(state.data);
      select.blur();
    });
  });
  els.cameraButton.addEventListener("click", toggleCameraView);
  els.nextCameraButton.addEventListener("click", nextCameraView);
  els.healButton.addEventListener("click", () => api("/api/flora-heal"));
  els.alchemyButton.addEventListener("click", () => executeHackerRecipe(els.alchemySelect.value));
  els.operatorAbilityButton.addEventListener("click", triggerOperatorAbility);
  const beginJumpPointer = (button, event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (els.jumpButton.disabled) return;
    event.preventDefault();
    state.jumpPointerId = event.pointerId;
    state.jumpPointerDownAt = performance.now();
    state.jumpSuppressClickUntil = performance.now() + 700;
    button.setPointerCapture?.(event.pointerId);
    void beginJumpPreparation();
  };
  const endJumpPointer = (event) => {
    if (state.jumpPointerId === null || event.pointerId !== state.jumpPointerId) return;
    event.preventDefault();
    state.jumpPointerId = null;
    void sendJump();
  };
  const cancelJumpPointer = (event) => {
    if (state.jumpPointerId === null || event.pointerId !== state.jumpPointerId) return;
    state.jumpPointerId = null;
    void cancelJumpPreparation();
  };
  const bindJumpPointerButton = (button) => {
    button.addEventListener("pointerdown", (event) => beginJumpPointer(button, event));
    button.addEventListener("pointerup", endJumpPointer);
    button.addEventListener("pointercancel", cancelJumpPointer);
    button.addEventListener("lostpointercapture", cancelJumpPointer);
    button.addEventListener("click", (event) => {
      if (event.detail > 0 && performance.now() < state.jumpSuppressClickUntil) return;
      void sendJump();
    });
  };
  bindJumpPointerButton(els.jumpButton);
  bindJumpPointerButton(els.tabletJumpShortcut);
  els.contextActionButton.addEventListener("click", () => {
    const source = document.getElementById(els.contextActionButton.dataset.sourceId || "");
    if (source && !source.disabled) source.click();
  });
  els.alchemyChoiceGrid.querySelectorAll("[data-alchemy-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const recipe = selectAlchemyRecipe(button.dataset.alchemyChoice);
      if (state.tabletOpen && recipe) void executeHackerRecipe(recipe.id);
    });
  });
  els.sleepButton.addEventListener("click", () => api("/api/sleep"));
  els.renkiButton.addEventListener("click", () => api("/api/renki"));
  els.instantWarpButton.addEventListener("click", beginInstantWarpTargeting);
  const bindEnhanceButton = (button, kind) => {
    let suppressClickUntil = 0;
    button.classList.add("enhance-hold-control");
    const suppressNativeHoldUi = (event) => {
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();
    };
    button.addEventListener("touchstart", suppressNativeHoldUi, { passive: false });
    button.addEventListener("contextmenu", suppressNativeHoldUi);
    button.addEventListener("selectstart", suppressNativeHoldUi);
    button.addEventListener("dragstart", suppressNativeHoldUi);
    const finishPointerAction = (event) => {
      if (kind === "use" && state.gunTriggerPointerId === event.pointerId) {
        event.preventDefault();
        suppressClickUntil = performance.now() + 700;
        void endGunFire();
        return true;
      }
      if (state.enhanceHold.pointerId !== event.pointerId) return false;
      event.preventDefault();
      suppressClickUntil = performance.now() + 700;
      void finishEnhanceAction(kind, event.pointerId);
      return true;
    };
    button.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (button.disabled) return;
      event.preventDefault();
      button.setPointerCapture?.(event.pointerId);
      if (kind === "use" && String(els.itemSelect?.value || "").startsWith("weapon:")) {
        suppressClickUntil = performance.now() + 1200;
        state.gunTriggerPointerId = event.pointerId;
        void beginInventoryWeaponFire(event.pointerId);
        return;
      }
      beginEnhanceAction(kind, event.pointerId);
    });
    button.addEventListener("pointerup", (event) => {
      finishPointerAction(event);
    });
    button.addEventListener("pointercancel", (event) => {
      finishPointerAction(event);
    });
    button.addEventListener("lostpointercapture", (event) => {
      finishPointerAction(event);
    });
    button.addEventListener("click", (event) => {
      if (performance.now() < suppressClickUntil) return;
      if (!beginEnhanceAction(kind)) return;
      void finishEnhanceAction(kind);
    });
  };
  bindEnhanceButton(els.fireJutsuButton, "fire");
  bindEnhanceButton(els.itemUseButton, "use");
  bindEnhanceButton(els.itemThrowButton, "throw");
  window.addEventListener("pointerup", (event) => {
    if (state.enhanceHold.pointerId !== event.pointerId) return;
    void finishEnhanceAction(state.enhanceHold.kind, event.pointerId);
  }, true);
  els.transferItemButton.addEventListener("click", () => api("/api/transfer", {
    targetId: els.transferTargetSelect.value,
    itemId: els.itemSelect.value,
    amount: 1
  }));
  els.transferCreditsButton.addEventListener("click", () => api("/api/transfer", {
    targetId: els.transferTargetSelect.value,
    amount: transferCreditAmount(),
    credits: true
  }));
  els.transferCreditsAmount.addEventListener("input", () => {
    if (state.data) renderItemControl(state.data);
  });
  els.itemSelect.addEventListener("change", () => {
    cancelThrowTargeting(true);
    state.itemRenderKey = "";
    if (state.data) renderItemControl(state.data);
  });
  els.emergencyButton.addEventListener("click", () => api("/api/emergency"));
  els.sabotageButton.addEventListener("click", () => api("/api/sabotage", { type: els.sabotageSelect.value }));
  els.utilityButton.addEventListener("click", () => api("/api/utility", { type: els.utilitySelect.value }));
  document.querySelectorAll("[data-drink]").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (performance.now() < vendingHold.suppressClickUntil && event.detail > 0) return;
      purchaseVendingItem(button);
    });
    button.addEventListener("pointerdown", (event) => startVendingHold(event, button));
    button.addEventListener("pointerup", stopVendingHold);
    button.addEventListener("pointercancel", stopVendingHold);
    button.addEventListener("lostpointercapture", stopVendingHold);
  });
  document.addEventListener("focusin", (event) => {
    const element = event.target;
    if (!(element instanceof Element)) return;
    const scrollRegion = element.closest("[data-scroll-region]");
    if (scrollRegion) setSelectedScrollRegion(scrollRegion, { focus: false });
    if (contextKeyboardElements().includes(element)) setKeyboardSelection(element, false);
  });
  document.addEventListener("pointerdown", (event) => {
    const element = event.target;
    if (!(element instanceof Element)) return;
    const scrollRegion = element.closest("[data-scroll-region]");
    if (scrollRegion) setSelectedScrollRegion(scrollRegion, { focus: false });
  });

  els.dashButton.addEventListener("pointerdown", (event) => { event.preventDefault(); setDashHeld(true); });
  els.dashButton.addEventListener("pointerup", () => setDashHeld(false));
  els.dashButton.addEventListener("pointercancel", () => setDashHeld(false));
  els.dashButton.addEventListener("pointerleave", () => setDashHeld(false));
  els.slowWalkButton.addEventListener("pointerdown", (event) => { event.preventDefault(); setSlowWalkHeld(true); });
  els.slowWalkButton.addEventListener("pointerup", () => setSlowWalkHeld(false));
  els.slowWalkButton.addEventListener("pointercancel", () => setSlowWalkHeld(false));
  els.slowWalkButton.addEventListener("pointerleave", () => setSlowWalkHeld(false));

  const settingsInputs = [
    els.mapSelect,
    els.hostTeamSelect,
    els.attackerCountInput,
    els.taskCountInput,
    els.killCooldownInput,
    els.killRangeInput,
    els.discussionTimeInput,
    els.votingTimeInput,
    els.emergencyLimitInput,
    els.anonymousVotesInput,
    els.confirmEjectsInput
  ];
  settingsInputs.forEach((input) => input.addEventListener("change", sendSettings));

  els.chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = els.chatInput.value.trim();
    if (!message) return;
    const ok = await api("/api/chat", { message });
    if (ok) els.chatInput.value = "";
  });

  els.chatTab.addEventListener("click", () => setFeed());

  window.addEventListener("keydown", (event) => {
    if (triggerDeveloperAnalyticsHotkey(event)) return;
    const typingField = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
    if (document.activeElement === els.chatInput) return;
    if (!typingField && state.enhanceHold.kind) {
      const movementInput = Boolean(keyName(event.key)) ||
        event.key.startsWith("Arrow") ||
        ["Shift", "Control", "Alt"].includes(event.key);
      if (movementInput) {
        event.preventDefault();
        clearMovementInput();
        sendMovement(true);
        return;
      }
    }
    if (!typingField && state.throwTargeting.active) {
      if (event.key === "Escape") {
        event.preventDefault();
        cancelThrowTargeting();
        return;
      }
      if (beginThrowTargetMovement(event)) return;
    }
    if (!typingField && beginClairvoyanceMovement(event)) return;
    if (!typingField && event.key.startsWith("Arrow") && !allowSelectionArrowRepeat(event)) {
      event.preventDefault();
      return;
    }
    const lobbyKickChord = state.screen === "game" && state.data?.phase === "lobby" &&
      event.shiftKey && /^Digit[1-9]$/.test(event.code);
    if (!typingField && !lobbyKickChord && (event.key === "`" || event.key === "@")) {
      event.preventDefault();
      if (!event.repeat) setKeybindOpen(!state.keybindOpen);
      return;
    }
    if (!typingField && event.code === "PageDown") {
      event.preventDefault();
      if (!event.repeat) cycleSelectedScrollRegion(1);
      return;
    }
    if (!typingField && selectedScrollRegion() && event.key.startsWith("Arrow") && !event.shiftKey) {
      event.preventDefault();
      navigateSelectedScrollRegion(event.key);
      return;
    }
    if (!typingField && selectedScrollRegion() && (event.key === "Enter" || event.code === "Space")) {
      event.preventDefault();
      if (!event.repeat) {
        const region = selectedScrollRegion();
        beginContinuousActionKeyHold(event.code, () => {
          if (selectedScrollRegion() !== region) return false;
          return activateSelectedScrollRegionChoice();
        });
      }
      return;
    }
    if (state.keybindOpen) {
      if (event.key === "Escape") {
        event.preventDefault();
        setKeybindOpen(false);
        return;
      }
    }
    if (event.code === "Backspace" && state.screen === "game" && state.data && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      if (!event.repeat) void leaveCurrentRoom();
      return;
    }
    if (event.key === "Escape" && selectedScrollRegion()) {
      event.preventDefault();
      setSelectedScrollRegion(null);
      return;
    }
    if (event.key === "Escape" && state.expandedMapOpen) {
      event.preventDefault();
      setExpandedMapOpen(false);
      return;
    }
    if (event.key === "Escape" && state.operatorBranchesOpen) {
      event.preventDefault();
      setOperatorBranchesOpen(false);
      return;
    }
    if (event.key === "Escape" && state.tabletOpen) {
      event.preventDefault();
      setTabletOpen(false);
      return;
    }
    if (event.key === "Escape" && state.screen !== "title") {
      event.preventDefault();
      switchScreenWithEffect("title");
      return;
    }
    if (isActionBlocked()) {
      event.preventDefault();
      clearMovementInput();
      return;
    }
    // Hacker selection owns the arrow keys while its dock is available.
    if (triggerHackerHotkey(event)) return;
    const activeElement = document.activeElement;
    const activeIsFormControl = ["INPUT", "TEXTAREA", "SELECT"].includes(activeElement?.tagName);
    if (state.screen === "tactics" && activeElement?.matches?.('input[type="range"]') && ["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    const lobbyScreenHotkey = state.screen === "game" && state.data?.phase === "lobby" &&
      (["KeyB", "KeyS", "KeyM", "KeyT", "KeyY"].includes(event.code) ||
        (event.shiftKey && /^Digit[1-9]$/.test(event.code)));
    const gameplayOptionFocused = state.screen === "game" && state.data?.phase === "playing" &&
      [els.teleportModeSelect, els.teleportTargetSelect, els.empPhaseSelect, els.sabotageSelect, els.alchemySelect].includes(activeElement);
    const panelActionHotkey = (activeElement === els.alchemySelect && event.code === "KeyR") ||
      (activeElement === els.sabotageSelect && event.code === "KeyL") ||
      ([els.teleportModeSelect, els.teleportTargetSelect].includes(activeElement) && ["KeyP", "KeyO", "Digit0"].includes(event.code)) ||
      (activeElement === els.empPhaseSelect && event.code === "Semicolon");
    const contextSelectionKey = event.key.startsWith("Arrow") || event.key === "Enter" || event.code === "Space";
    if (activeIsFormControl && !lobbyScreenHotkey && !panelActionHotkey && !gameplayOptionFocused && !contextSelectionKey) return;
    if (triggerItemHotkey(event)) return;
    if (triggerScreenHotkey(event)) return;
    if (gameplayOptionFocused && event.key.startsWith("Arrow") && !event.shiftKey) {
      event.preventDefault();
      navigateGameplaySelect(activeElement, event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (gameplayOptionFocused && (event.key === "Enter" || event.code === "Space")) {
      event.preventDefault();
      if (!event.repeat) {
        beginContinuousActionKeyHold(event.code, () => activateGameplaySelect(activeElement));
      }
      return;
    }
    if (state.screen === "game" && state.expandedMapOpen && (state.teleportTargeting || state.instantWarpTargeting)) {
      if (event.key.startsWith("Arrow")) {
        event.preventDefault();
        moveExpandedMapPointer(event.key, event.shiftKey);
        return;
      }
      if (event.key === "Enter" || event.code === "Space") {
        event.preventDefault();
        activateExpandedMapPoint(state.mapPointer);
        return;
      }
    }
    const contextualNavigation = state.screen !== "game" || state.expandedMapOpen || state.fieldFeedOpen || state.operatorBranchesOpen || state.tabletOpen || state.data?.phase !== "playing";
    if (contextualNavigation && event.key.startsWith("Arrow")) {
      event.preventDefault();
      navigateKeyboardContext(event.key);
      return;
    }
    if (contextualNavigation && (event.key === "Enter" || event.code === "Space")) {
      event.preventDefault();
      if (state.data?.phase === "playing") {
        if (!event.repeat) beginContinuousActionKeyHold(event.code, activateKeyboardSelection);
      } else if (!event.repeat) {
        activateKeyboardSelection();
      }
      return;
    }
    if (state.screen !== "game") return;
    if (event.key === "Shift") {
      event.preventDefault();
      state.keys.add("dash");
      if (!event.repeat) syncMovementInputImmediately();
      return;
    }
    if (event.key === "Control" || event.key === "Alt") {
      event.preventDefault();
      state.keys.add("slow");
      if (!event.repeat) syncMovementInputImmediately();
      return;
    }
    if (!els.itemControl.hidden && event.altKey && event.code === "KeyV") {
      event.preventDefault();
      if (!event.repeat) els.transferItemButton.click();
      return;
    }
    if (!els.itemControl.hidden && event.altKey && event.code === "KeyC") {
      event.preventDefault();
      if (!event.repeat) els.transferCreditsButton.click();
      return;
    }
    if (triggerAlchemySelectionHotkey(event)) return;
    if (triggerVendingHotkey(event)) return;
    if (triggerActionHotkey(event)) return;
    const key = keyName(event.key);
    if (key) {
      event.preventDefault();
      state.keys.add(key);
      if (!event.repeat) syncMovementInputImmediately();
    }
  });
  window.addEventListener("keyup", (event) => {
    stopContinuousActionKeyHold(event.code);
    if (releaseThrowTargetMovement(event)) return;
    if (releaseClairvoyanceMovement(event)) return;
    for (const key of state.continuousActionKeyAt.keys()) {
      if (key === event.code || key.endsWith(`:${event.code}`)) state.continuousActionKeyAt.delete(key);
    }
    if (event.code === state.arrowRepeatKey) {
      state.arrowRepeatKey = "";
      state.arrowRepeatAt = 0;
    }
    if (event.code === "KeyJ" && state.jumpKeyDownAt > 0) {
      event.preventDefault();
      void sendJump();
    }
    if (event.code === "KeyV") void finishEnhanceAction("use");
    if (event.code === "KeyG") void finishEnhanceAction("throw");
    if (event.key === "Shift") state.keys.delete("dash");
    if (event.key === "Control" || event.key === "Alt") state.keys.delete("slow");
    const key = keyName(event.key);
    if (key) state.keys.delete(key);
    syncMovementInputImmediately();
  });
  window.addEventListener("blur", () => {
    stopContinuousActionHold();
    stopContinuousActionKeyHold();
    cancelThrowTargeting(true);
    if (state.enhanceHold.timer) cancelAnimationFrame(state.enhanceHold.timer);
    state.enhanceHold = { kind: "", pointerId: null, startedAt: 0, timer: 0 };
    state.continuousActionKeyAt.clear();
    clearMovementInput();
  });
  window.addEventListener("focus", () => void resyncMovementAfterFocus());
  window.addEventListener("online", () => void flushUsageAnalytics());
  window.addEventListener("pagehide", () => {
    clearMovementInput();
    recordUsageExit();
  });
  window.addEventListener("pointerout", (event) => {
    if (event.relatedTarget == null) clearMovementInput();
  });
  window.addEventListener("pointerup", (event) => {
    if (state.enhanceHold.pointerId === event.pointerId) void finishEnhanceAction(state.enhanceHold.kind, event.pointerId);
    stopContinuousActionHold(event.pointerId);
    releasePointerInput(event.pointerId);
    if (state.gunTriggerPointerId === event.pointerId) void endGunFire();
  });
  window.addEventListener("pointercancel", (event) => {
    if (state.enhanceHold.pointerId === event.pointerId) {
      if (state.enhanceHold.timer) cancelAnimationFrame(state.enhanceHold.timer);
      state.enhanceHold = { kind: "", pointerId: null, startedAt: 0, timer: 0 };
      updateEnhanceReadout();
    }
    stopContinuousActionHold(event.pointerId);
    releasePointerInput(event.pointerId);
    if (state.gunTriggerPointerId === event.pointerId) void endGunFire();
  });
  window.addEventListener("lostpointercapture", (event) => {
    stopContinuousActionHold(event.pointerId);
  }, true);
  window.addEventListener("mousedown", (event) => {
    if (event.button !== 0) clearMovementInput();
  });
  window.addEventListener("contextmenu", (event) => {
    if (event.target instanceof Element && event.target.closest(".game-area, .tablet-quick-actions, .tablet-branch-tray, .item-inventory-choice, .enhance-hold-control")) {
      event.preventDefault();
      clearMovementInput();
    }
  });
  document.addEventListener("selectstart", (event) => {
    if (event.target instanceof Element && event.target.closest(".tablet-quick-actions, .tablet-branch-tray, .item-inventory-choice, .enhance-hold-control")) {
      event.preventDefault();
    }
  });
  document.addEventListener("dragstart", (event) => {
    if (event.target instanceof Element && event.target.closest(".tablet-quick-actions, .tablet-branch-tray, .item-inventory-choice, .enhance-hold-control")) {
      event.preventDefault();
    }
  });
  const preserveFullscreenGameSurface = (event) => {
    if (state.screen !== "game" || !event.cancelable) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest("input, textarea, select, .tablet-branch-list, .hacker-ability-grid, .active-effects-list, .item-inventory-grid, .vending-list, .field-feed-list")) return;
    event.preventDefault();
  };
  document.addEventListener("touchmove", preserveFullscreenGameSurface, { capture: true, passive: false });
  ["gesturestart", "gesturechange", "gestureend"].forEach((type) => {
    document.addEventListener(type, preserveFullscreenGameSurface, { capture: true, passive: false });
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopContinuousActionHold();
      stopContinuousActionKeyHold();
      state.continuousActionKeyAt.clear();
    }
    clearMovementInput();
    if (!document.hidden) void resyncMovementAfterFocus();
    if (document.hidden) recordUsageExit();
    else {
      recordUsageResume();
      void flushUsageAnalytics();
    }
    syncBgm();
  });

  els.expandedMapCanvas.addEventListener("pointermove", updateExpandedMapPointer);
  els.expandedMapCanvas.addEventListener("pointerleave", () => {
    state.mapPointer = null;
  });
  els.expandedMapCanvas.addEventListener("click", teleportFromExpandedMap);
  els.canvas.addEventListener("pointerdown", attackFromCanvas);
}

function clearPointerInput() {
  state.pointerPads.clear();
  state.pad.clear();
  resetTabletStick();
}

function syncPointerPads() {
  state.pad.clear();
  for (const direction of state.pointerPads.values()) state.pad.add(direction);
}

function releasePointerInput(pointerId) {
  state.pointerPads.delete(pointerId);
  syncPointerPads();
  syncMovementInputImmediately();
}

function syncMovementInputImmediately() {
  const direction = getDirection();
  if (direction.dx || direction.dy) sendMovement();
  else if (state.movementActive) sendMovement(true);
}

function setDashHeld(active) {
  state.dashHeld = Boolean(active);
  els.dashButton.classList.toggle("active", state.dashHeld);
  syncMovementInputImmediately();
}

function setSlowWalkHeld(active) {
  state.slowWalkHeld = Boolean(active);
  els.slowWalkButton.classList.toggle("active", state.slowWalkHeld);
  syncMovementInputImmediately();
}

function clearMovementInput() {
  const shouldSendStop = state.movementActive;
  state.movementQueue?.clear?.();
  state.keys.clear();
  clearPointerInput();
  state.dashHeld = false;
  state.slowWalkHeld = false;
  els.dashButton.classList.remove("active");
  els.slowWalkButton.classList.remove("active");
  if (state.gunTriggerHeld) void endGunFire();
  if (state.jumpPreparing) void cancelJumpPreparation();
  if (shouldSendStop) sendMovement(true);
  state.lastMovementSentSignature = "";
}

function setKeybindOpen(open) {
  state.keybindOpen = Boolean(open);
  els.keybindOverlay.hidden = !state.keybindOpen;
  els.keybindButton.setAttribute("aria-expanded", String(state.keybindOpen));
  if (state.keybindOpen) {
    clearMovementInput();
    requestAnimationFrame(() => els.keybindList.focus({ preventScroll: true }));
  } else {
    els.keybindButton.focus({ preventScroll: true });
  }
  requestAnimationFrame(() => syncKeyboardContext(true));
}

function bindTabletControls() {
  els.tabletAbilityShortcut.addEventListener("click", () => {
    if (!els.operatorAbilityButton.disabled && !els.operatorAbilityButton.hidden) els.operatorAbilityButton.click();
  });
  els.tabletPanel.addEventListener("pointerdown", (event) => {
    if (!pointerHitsMinimap(event)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openExpandedMapFromMinimap();
  }, true);
  const clearGestureHover = () => {
    window.clearTimeout(state.tabletGesture.submenuTimer);
    state.tabletGesture.submenuTimer = 0;
    state.tabletGesture.hoverButton?.classList.remove("gesture-hover");
    state.tabletGesture.hoverButton = null;
  };
  const branchButtonAtPoint = (x, y) => document.elementsFromPoint(x, y)
    .map((element) => element.closest?.("#tabletBranchList button"))
    .find((button) => button && !button.disabled) || null;
  const updateGestureTarget = (event) => {
    if (state.tabletGesture.pointerId !== event.pointerId) return;
    const candidate = branchButtonAtPoint(event.clientX, event.clientY);
    if (candidate === state.tabletGesture.hoverButton) return;
    clearGestureHover();
    if (!candidate) return;
    state.tabletGesture.hoverButton = candidate;
    candidate.classList.add("gesture-hover");
    if (navigator.vibrate) navigator.vibrate(8);
    if (candidate.dataset.branchPath) {
      state.tabletGesture.submenuTimer = window.setTimeout(() => {
        if (state.tabletGesture.hoverButton !== candidate || state.tabletGesture.pointerId === null) return;
        setTabletBranchPath(candidate.dataset.branchPath, { focus: false });
        clearGestureHover();
        if (navigator.vibrate) navigator.vibrate(14);
      }, 260);
    }
  };
  const finishTabletGesture = (event, cancelled = false) => {
    if (state.tabletGesture.pointerId !== event.pointerId) return;
    event.preventDefault();
    if (!cancelled) updateGestureTarget(event);
    const target = cancelled ? null : state.tabletGesture.hoverButton;
    const sourceButton = state.tabletGesture.sourceButton;
    clearGestureHover();
    state.tabletGesture.pointerId = null;
    state.tabletGesture.sourceButton = null;
    state.tabletGesture.suppressClick = true;
    sourceButton?.classList.remove("gesture-source");
    els.tabletPanel.classList.remove("gesture-active");
    try {
      if (sourceButton?.hasPointerCapture(event.pointerId)) sourceButton.releasePointerCapture(event.pointerId);
    } catch {}
    if (target && !target.disabled) {
      const opensSubmenu = Boolean(target.dataset.branchPath);
      target.click();
      if (!opensSubmenu) setTabletBranchGroup("", { focus: false });
    }
    window.setTimeout(() => {
      state.tabletGesture.suppressClick = false;
    }, 0);
  };

  document.querySelectorAll("[data-tablet-category]").forEach((button) => {
    const group = button.dataset.tabletCategory;
    button.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (button === els.tabletAbilityShortcut) {
        if (event.defaultPrevented) return;
        event.preventDefault();
        state.tabletGesture.suppressClick = true;
        if (!els.operatorAbilityButton.disabled) els.operatorAbilityButton.click();
        return;
      }
      event.preventDefault();
      clearGestureHover();
      state.tabletGesture.pointerId = event.pointerId;
      state.tabletGesture.sourceButton = button;
      state.tabletGesture.suppressClick = false;
      button.classList.add("gesture-source");
      els.tabletPanel.classList.add("gesture-active");
      try { button.setPointerCapture(event.pointerId); } catch {}
      setTabletBranchGroup(group, { focus: false });
    });
    button.addEventListener("pointermove", updateGestureTarget);
    button.addEventListener("pointerup", (event) => finishTabletGesture(event, false));
    button.addEventListener("pointercancel", (event) => finishTabletGesture(event, true));
    button.addEventListener("lostpointercapture", (event) => {
      if (state.tabletGesture.pointerId === event.pointerId) finishTabletGesture(event, true);
    });
    button.addEventListener("click", () => {
      if (state.tabletGesture.suppressClick) {
        state.tabletGesture.suppressClick = false;
        return;
      }
      if (button === els.tabletAbilityShortcut) {
        if (!els.operatorAbilityButton.disabled) els.operatorAbilityButton.click();
        return;
      }
      setTabletBranchGroup(state.tabletBranchGroup === group ? "" : group);
    });
  });
  window.addEventListener("pointermove", (event) => {
    if (state.tabletGesture.pointerId === event.pointerId) updateGestureTarget(event);
  }, true);
  window.addEventListener("pointerup", (event) => {
    if (state.tabletGesture.pointerId === event.pointerId) finishTabletGesture(event, false);
  }, true);
  window.addEventListener("pointercancel", (event) => {
    if (state.tabletGesture.pointerId === event.pointerId) finishTabletGesture(event, true);
  }, true);
  window.addEventListener("blur", () => {
    if (state.tabletGesture.pointerId === null) return;
    finishTabletGesture({
      pointerId: state.tabletGesture.pointerId,
      preventDefault() {}
    }, true);
  });

  const moveStick = (event) => {
    if (state.tabletStick.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    if (state.enhanceHold.kind && !state.throwTargeting.active) {
      resetTabletStick();
      sendMovement(true);
      return;
    }
    const rect = els.tabletJoystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxDistance = Math.max(1, Math.min(rect.width, rect.height) / 2 - 30);
    const rawX = event.clientX - centerX;
    const rawY = event.clientY - centerY;
    const rawLength = Math.hypot(rawX, rawY);
    const scale = rawLength > maxDistance ? maxDistance / rawLength : 1;
    const knobX = rawX * scale;
    const knobY = rawY * scale;
    const normalizedX = knobX / maxDistance;
    const normalizedY = knobY / maxDistance;
    const normalizedLength = Math.hypot(normalizedX, normalizedY);
    const deadZone = 0.12;
    const strength = normalizedLength <= deadZone
      ? 0
      : Math.min(1, (normalizedLength - deadZone) / (1 - deadZone));
    state.tabletStick.dx = strength && normalizedLength ? normalizedX / normalizedLength : 0;
    state.tabletStick.dy = strength && normalizedLength ? normalizedY / normalizedLength : 0;
    const mode = strength <= 0
      ? "idle"
      : strength < 0.4
        ? "slow"
        : strength >= 0.8
          ? "dash"
          : "walk";
    setTabletStickMode(mode, strength);
    els.tabletJoystickKnob.style.transform = `translate(calc(-50% + ${knobX.toFixed(1)}px), calc(-50% + ${knobY.toFixed(1)}px))`;
  };
  const releaseStick = (event) => {
    if (state.tabletStick.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    const confirmThrow = state.throwTargeting.active;
    resetTabletStick();
    if (confirmThrow) {
      void confirmThrowTargeting();
      return;
    }
    syncMovementInputImmediately();
  };
  const releaseActiveStick = (event) => {
    if (state.tabletStick.pointerId === null) return;
    if (Number.isFinite(event?.pointerId) && state.tabletStick.pointerId !== event.pointerId) return;
    const confirmThrow = state.throwTargeting.active && event?.type !== "blur" && event?.type !== "pointercancel";
    resetTabletStick();
    if (confirmThrow) {
      void confirmThrowTargeting();
      return;
    }
    syncMovementInputImmediately();
  };
  els.tabletJoystick.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    if (state.enhanceHold.kind && !state.throwTargeting.active) {
      resetTabletStick();
      sendMovement(true);
      return;
    }
    state.tabletStick.pointerId = event.pointerId;
    els.tabletJoystick.classList.add("active");
    try { els.tabletJoystick.setPointerCapture(event.pointerId); } catch {}
    moveStick(event);
    syncMovementInputImmediately();
  });
  els.tabletJoystick.addEventListener("pointermove", moveStick);
  els.tabletJoystick.addEventListener("pointerup", releaseStick);
  els.tabletJoystick.addEventListener("pointercancel", releaseStick);
  els.tabletJoystick.addEventListener("lostpointercapture", releaseStick);
  const joystickTouchIds = new Set();
  const touchListContainsTrackedJoystickTouch = (touchList) => Array.from(touchList || [])
    .some((touch) => joystickTouchIds.has(touch.identifier));
  const suppressTrackedJoystickGesture = (event) => {
    if (!touchListContainsTrackedJoystickTouch(event.touches)
      && !touchListContainsTrackedJoystickTouch(event.changedTouches)) return false;
    if (event.cancelable) event.preventDefault();
    event.stopPropagation();
    return true;
  };
  const beginJoystickTouch = (event) => {
    Array.from(event.changedTouches || []).forEach((touch) => joystickTouchIds.add(touch.identifier));
    suppressTrackedJoystickGesture(event);
  };
  const finishJoystickTouch = (event) => {
    const tracked = suppressTrackedJoystickGesture(event);
    if (!tracked) return;
    Array.from(event.changedTouches || []).forEach((touch) => joystickTouchIds.delete(touch.identifier));
  };
  els.tabletJoystickZone.addEventListener("touchstart", beginJoystickTouch, { capture: true, passive: false });
  document.addEventListener("touchmove", suppressTrackedJoystickGesture, { capture: true, passive: false });
  document.addEventListener("touchend", finishJoystickTouch, { capture: true, passive: false });
  document.addEventListener("touchcancel", finishJoystickTouch, { capture: true, passive: false });
  const suppressGameSurfaceTouch = (event) => {
    if (state.screen !== "game" || !event.cancelable) return;
    event.preventDefault();
  };
  els.canvas.addEventListener("touchstart", suppressGameSurfaceTouch, { capture: true, passive: false });
  els.canvas.addEventListener("touchmove", suppressGameSurfaceTouch, { capture: true, passive: false });
  window.addEventListener("pointerup", releaseActiveStick, true);
  window.addEventListener("pointercancel", releaseActiveStick, true);
  window.addEventListener("blur", releaseActiveStick);
  if ("ResizeObserver" in window) {
    const tabletBranchObserver = new ResizeObserver(() => scheduleTabletBranchLayout());
    tabletBranchObserver.observe(els.tabletPanel);
    tabletBranchObserver.observe(els.tabletBranchTray);
  }
}

function setTabletStickMode(mode, strength = 0) {
  const validMode = ["idle", "slow", "walk", "dash"].includes(mode) ? mode : "idle";
  state.tabletStick.mode = validMode;
  state.tabletStick.strength = Math.max(0, Math.min(1, Number(strength) || 0));
  els.tabletJoystick.dataset.mode = validMode;
  els.tabletJoystick.style.setProperty("--stick-strength", state.tabletStick.strength.toFixed(3));
  els.tabletJoystick.setAttribute(
    "aria-valuetext",
    validMode === "idle" ? "停止" : `移動速度 ${Math.round(state.tabletStick.strength * 100)}%`
  );
}

function resetTabletStick() {
  state.tabletStick.pointerId = null;
  state.tabletStick.dx = 0;
  state.tabletStick.dy = 0;
  setTabletStickMode("idle", 0);
  els.tabletJoystick.classList.remove("active");
  els.tabletJoystickKnob.style.transform = "translate(-50%, -50%)";
}

function setTabletBranchGroup(group, { focus = true } = {}) {
  const validGroup = group === "operator" ? group : "";
  group = validGroup;
  if (state.tabletBranchGroup !== group) state.tabletBranchPath = "";
  state.tabletBranchGroup = group;
  state.tabletBranchRenderKey = "";
  els.tabletBranchTray.hidden = !group;
  els.tabletBranchLines.hidden = !group;
  els.tabletPanel.classList.toggle("branch-open", Boolean(group));
  document.querySelectorAll("[data-tablet-category]").forEach((button) => {
    button.classList.toggle("active", button.dataset.tabletCategory === group);
  });
  if (group) {
    renderTabletBranch(state.data, true);
  } else {
    state.tabletBranchPath = "";
    els.tabletBranchList.replaceChildren();
    els.tabletBranchLines.replaceChildren();
  }
  requestAnimationFrame(() => syncKeyboardContext(true));
}

function setTabletBranchPath(path, { focus = true } = {}) {
  state.tabletBranchPath = String(path || "");
  state.tabletBranchRenderKey = "";
  renderTabletBranch(state.data, true);
}

function positionTabletBranchTree() {
  if (!state.tabletOpen || !state.tabletBranchGroup || els.tabletBranchTray.hidden) return;
  const source = document.querySelector(`[data-tablet-category="${state.tabletBranchGroup}"]`);
  if (!source || source.hidden) return;
  const panelRect = els.tabletPanel.getBoundingClientRect();
  const sourceRect = source.getBoundingClientRect();
  const trayHeight = els.tabletBranchTray.offsetHeight;
  const sourceCenterY = sourceRect.top - panelRect.top + sourceRect.height / 2;
  const quickRect = els.tabletQuickActions.getBoundingClientRect();
  const quickTop = quickRect.height > 0 ? quickRect.top - panelRect.top : panelRect.height;
  const maxTop = Math.max(48, quickTop - trayHeight - 12);
  const top = Math.max(48, Math.min(maxTop, sourceCenterY - trayHeight / 2));
  els.tabletBranchTray.style.top = `${Math.round(top)}px`;
}

function renderTabletBranchLines() {
  els.tabletBranchLines.replaceChildren();
  if (!state.tabletOpen || !state.tabletBranchGroup || els.tabletBranchTray.hidden) return;
  const source = document.querySelector(`[data-tablet-category="${state.tabletBranchGroup}"]`);
  const targets = [...els.tabletBranchList.querySelectorAll("button:not([hidden])")];
  if (!source || source.hidden || !targets.length) return;

  const panelRect = els.tabletPanel.getBoundingClientRect();
  const sourceRect = source.getBoundingClientRect();
  const sourceX = sourceRect.left - panelRect.left;
  const sourceY = sourceRect.top - panelRect.top + sourceRect.height / 2;
  const endpoints = targets.map((button) => {
    const rect = button.getBoundingClientRect();
    return {
      x: rect.right - panelRect.left,
      y: rect.top - panelRect.top + rect.height / 2
    };
  });
  const maxEndX = Math.max(...endpoints.map((point) => point.x));
  const junctionX = Math.max(maxEndX + 18, sourceX - 62);
  const namespace = "http://www.w3.org/2000/svg";
  els.tabletBranchLines.setAttribute("viewBox", `0 0 ${panelRect.width} ${panelRect.height}`);

  const addPath = (d, className) => {
    const path = document.createElementNS(namespace, "path");
    path.setAttribute("d", d);
    path.setAttribute("class", className);
    els.tabletBranchLines.append(path);
  };
  addPath(`M ${sourceX} ${sourceY} H ${junctionX}`, "tablet-branch-trunk");
  for (const point of endpoints) {
    const controlX = Math.max(point.x + 28, junctionX - 34);
    addPath(`M ${junctionX} ${sourceY} C ${controlX} ${sourceY}, ${controlX} ${point.y}, ${point.x} ${point.y}`, "tablet-branch-path");
    const endpoint = document.createElementNS(namespace, "circle");
    endpoint.setAttribute("cx", String(point.x));
    endpoint.setAttribute("cy", String(point.y));
    endpoint.setAttribute("r", "3");
    endpoint.setAttribute("class", "tablet-branch-endpoint");
    els.tabletBranchLines.append(endpoint);
  }
}

function scheduleTabletBranchLayout() {
  requestAnimationFrame(() => {
    positionTabletBranchTree();
    requestAnimationFrame(renderTabletBranchLines);
  });
}

function appendTabletBranchButton(label, action, {
  disabled = false,
  danger = false,
  selected = false,
  source = null,
  hold = "",
  kind = "action",
  branchPath = ""
} = {}) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.disabled = Boolean(disabled);
  button.classList.add("tablet-branch-node", `node-${kind}`);
  button.classList.toggle("danger", danger);
  button.classList.toggle("selected", selected);
  if (branchPath) button.dataset.branchPath = branchPath;
  if (source) {
    button.tabletSource = source;
    if (source.id) button.dataset.tabletSourceId = source.id;
  }

  const bindScrollableHold = ({
    invoke,
    tapInvoke = invoke,
    holdInvoke = invoke,
    holdEnd = null,
    pointerStart = null,
    pointerCancel = null,
    delay = CONTINUOUS_ACTION_HOLD_DELAY_MS,
    interval = CONTINUOUS_ACTION_REPEAT_INTERVAL_MS
  }) => {
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let moved = false;
    let repeating = false;
    let holdTimer = 0;
    let repeatTimer = 0;
    let suppressPointerClickUntil = 0;
    const clearTimers = () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(repeatTimer);
      holdTimer = 0;
      repeatTimer = 0;
    };
    const repeat = () => {
      if (pointerId === null || moved || button.disabled) return;
      holdInvoke();
      if (interval > 0) repeatTimer = window.setTimeout(repeat, interval);
    };
    const cancelForScroll = () => {
      const shouldEndHold = repeating;
      moved = true;
      clearTimers();
      pointerId = null;
      repeating = false;
      pointerCancel?.();
      if (shouldEndHold) holdEnd?.({ cancelled: true });
    };
    button.addEventListener("pointerdown", (event) => {
      if (button.disabled || (event.pointerType === "mouse" && event.button !== 0)) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      moved = false;
      repeating = false;
      clearTimers();
      if (pointerStart?.() === false) {
        pointerId = null;
        return;
      }
      holdTimer = window.setTimeout(() => {
        if (pointerId !== event.pointerId || moved || button.disabled) return;
        repeating = true;
        suppressPointerClickUntil = performance.now() + 800;
        try { button.setPointerCapture(event.pointerId); } catch {}
        repeat();
      }, delay);
    });
    button.addEventListener("pointermove", (event) => {
      if (pointerId !== event.pointerId || repeating) return;
      if (Math.hypot(event.clientX - startX, event.clientY - startY) >= TABLET_SCROLL_GESTURE_THRESHOLD_PX) {
        cancelForScroll();
      }
    });
    button.addEventListener("pointerup", (event) => {
      if (pointerId !== event.pointerId) return;
      const shouldTap = !moved && !repeating && !button.disabled;
      const shouldEndHold = repeating;
      suppressPointerClickUntil = performance.now() + 800;
      clearTimers();
      pointerId = null;
      repeating = false;
      if (shouldTap) tapInvoke();
      if (shouldEndHold) holdEnd?.({ cancelled: false });
    });
    button.addEventListener("pointercancel", cancelForScroll);
    button.addEventListener("lostpointercapture", () => {
      if (pointerId !== null) cancelForScroll();
    });
    button.addEventListener("click", (event) => {
      if (event.detail > 0 && performance.now() < suppressPointerClickUntil) return;
      if (event.detail === 0) tapInvoke();
    });
  };

  if (hold === "shoot") {
    let firing = false;
    bindScrollableHold({
      delay: 140,
      interval: 0,
      tapInvoke: () => void pulseGunFire(),
      holdInvoke: () => {
        if (!firing) {
          firing = true;
          void beginGunFire();
        }
      },
      holdEnd: () => {
        if (!firing) return;
        firing = false;
        void endGunFire();
      }
    });
  } else if (hold === "enhance-use" || hold === "enhance-throw") {
    const enhanceKind = hold === "enhance-throw" ? "throw" : "use";
    bindScrollableHold({
      interval: 0,
      pointerStart: () => beginEnhanceAction(enhanceKind),
      pointerCancel: () => cancelEnhanceAction(enhanceKind),
      tapInvoke: () => void finishEnhanceAction(enhanceKind),
      holdInvoke: () => {},
      holdEnd: ({ cancelled }) => {
        if (!cancelled) void finishEnhanceAction(enhanceKind);
      }
    });
  } else if (hold === "vending") {
    bindScrollableHold({ invoke: () => source.click() });
  } else if (hold === "repeat" || (!hold && !["branch", "target", "system"].includes(kind))) {
    bindScrollableHold({ invoke: action });
  } else {
    button.addEventListener("click", action);
  }
  els.tabletBranchList.appendChild(button);
  return button;
}

function setSelectValue(select, value) {
  if (!select || ![...select.options].some((option) => option.value === value)) return false;
  select.value = value;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  renderTargetOptions(state.data);
  updateActionButtons(state.data);
  return true;
}

function renderTabletBranch(data, force = false) {
  if (!state.tabletOpen || !state.tabletBranchGroup || !data?.self) return;
  const group = state.tabletBranchGroup;
  const branchPath = state.tabletBranchPath;
  const self = data.self;
  const structuralKey = JSON.stringify([
    group,
    branchPath,
    self.special,
    self.role,
    data.players.filter((player) => player.alive && !player.ejected).map((player) => player.id),
    !els.vendingPanel.hidden,
    !els.utilityControl.hidden,
    els.teleportModeSelect.value,
    els.teleportTargetSelect.value,
    els.alchemySelect.value,
    els.empPhaseSelect.value,
    els.sabotageSelect.value,
    [...document.querySelectorAll(".tablet-action-source button")].map((button) => [button.id, button.hidden])
  ]);
  if (!force && structuralKey === state.tabletBranchRenderKey) {
    els.tabletBranchList.querySelectorAll("button").forEach((button) => {
      const source = button.tabletSource || document.getElementById(button.dataset.tabletSourceId);
      if (!source) return;
      button.disabled = source.disabled;
      button.textContent = source.textContent;
    });
    scheduleTabletBranchLayout();
    return;
  }
  state.tabletBranchRenderKey = structuralKey;
  els.tabletBranchList.replaceChildren();
  const titles = { operator: "オペレーター", context: "周辺設備" };
  const branchTitles = {
    "gravity-transfer": "転移",
    "gravity-time": "時空制御",
    "gravity-target": "対象選択",
    "hacker-resources": "対象データ操作",
    "hacker-supplies": "戦術物資",
    "hacker-weapons": "武器",
    "hacker-special": "特殊生成",
    "vending-support": "回復・支援",
    "vending-tactical": "戦術用品",
    "vending-inventions": "特殊装備"
  };
  els.tabletBranchTitle.textContent = branchPath
    ? `${titles[group] || "操作"} / ${branchTitles[branchPath] || "分岐"}`
    : titles[group] || "操作";
  els.tabletBranchBackButton.hidden = !branchPath;

  const addSource = (source, options = {}) => {
    if (!source || source.hidden) return null;
    return appendTabletBranchButton(options.label || source.textContent, () => source.click(), {
      disabled: source.disabled,
      danger: source.classList.contains("danger"),
      source,
      hold: options.hold || "",
      kind: options.kind || (source.classList.contains("danger") ? "danger" : "action")
    });
  };
  const addCycle = (label, select, direction = 1) => appendTabletBranchButton(label, () => {
    cycleSelectBy(select, direction);
    renderTargetOptions(state.data);
    updateActionButtons(state.data);
    renderTabletBranch(state.data, true);
  }, { kind: "cycle" });
  const addSubmenu = (label, path) => appendTabletBranchButton(label, () => setTabletBranchPath(path), {
    kind: "branch",
    branchPath: path
  });
  const addModeAction = (label, mode) => appendTabletBranchButton(label, () => {
    if (!setSelectValue(els.teleportModeSelect, mode)) return;
    els.operatorAbilityButton.click();
  }, {
    kind: mode === "heart" || mode === "storm" ? "danger" : "action",
    selected: els.teleportModeSelect.value === mode,
    disabled: els.operatorAbilityButton.disabled
  });
  const addRecipe = (recipe) => appendTabletBranchButton(recipe.label, () => {
    void executeHackerRecipe(recipe.id);
  }, {
    kind: recipe.id.startsWith("hack-") ? "data" : recipe.kind === "invention" ? "danger" : "action",
    selected: recipe.id === els.alchemySelect.value
  });

  if (group === "operator") {
    if (self.special === "teleport") {
      if (branchPath === "gravity-transfer") {
        addModeAction("地点へ転移", "body");
        addModeAction("対象付近へ転移", "near");
        addModeAction("心臓転移", "heart");
        addSubmenu("転移対象を選択", "gravity-target");
      } else if (branchPath === "gravity-time") {
        addModeAction("アクセラレート", "accelerate");
        addModeAction("ディーセラレート", "decelerate");
        addSubmenu("時間操作対象を選択", "gravity-target");
      } else if (branchPath === "gravity-target") {
        [...els.teleportTargetSelect.options].forEach((option) => {
          appendTabletBranchButton(option.textContent, () => {
            setSelectValue(els.teleportTargetSelect, option.value);
            setTabletBranchPath("");
          }, { kind: "target", selected: option.value === els.teleportTargetSelect.value });
        });
      } else {
        addSubmenu("転移", "gravity-transfer");
        addSubmenu("時空制御", "gravity-time");
        addModeAction("グラビティストーム", "storm");
      }
    } else if (self.special === "alchemist") {
      const availableRecipes = alchemyRecipes.filter((recipe) => alchemyRecipeAvailable(recipe, self));
      const recipesForPath = {
        "hacker-resources": availableRecipes.filter((recipe) => recipe.id.startsWith("hack-")),
        "hacker-supplies": availableRecipes.filter((recipe) => ["stamina", "heal", "fire", "substitution", "warp", "grit", "reason"].includes(recipe.id)),
        "hacker-weapons": availableRecipes.filter((recipe) => hackerRecipeCategory(recipe) === "weapon"),
        "hacker-special": availableRecipes.filter((recipe) => recipe.id === "revive")
      }[branchPath];
      if (recipesForPath) {
        if (branchPath === "hacker-resources") {
          const hackerTarget = ensureHackerTarget(data);
          appendTabletBranchButton(hackerTarget ? `対象: ${hackerTarget.name}` : "対象なし", () => {
            cycleHackerTarget(1);
            renderTabletBranch(state.data, true);
          }, { kind: "target", disabled: hackerTargets(data).length < 2 });
        }
        recipesForPath.forEach(addRecipe);
      } else {
        addSubmenu("対象データ", "hacker-resources");
        addSubmenu("戦術物資", "hacker-supplies");
        addSubmenu("武器", "hacker-weapons");
        addSubmenu("特殊生成", "hacker-special");
      }
    } else if (self.special === "flora") {
      addModeAction("回復・オーバーヒール", "heal");
      addModeAction("サンビーム放射", "sunbeam");
      addModeAction("サンビーム収束", "sunbeam-converged");
    } else if (self.special === "gunner") {
      addModeAction("ホバースプリント", "hover-sprint");
    } else if (self.special === "quantum") {
      [
        ["水銀→金", "transmute-mercury"],
        ["鉛→金", "transmute-lead"],
        ["水→氷", "cool-water"],
        ["水→高温水", "heat-water"],
        ["ウラン核分裂", "fission-uranium"],
        ["プルトニウム核分裂", "fission-plutonium"]
      ].forEach(([label, mode]) => addModeAction(label, mode));
    } else {
      addSource(els.operatorAbilityButton);
    }
  } else if (group === "context") {
    if (!els.itemControl.hidden) {
      if (branchPath === "inventory") {
        appendTabletBranchButton(`選択: ${els.itemSelect.options[els.itemSelect.selectedIndex]?.textContent || "なし"}`, () => {
          cycleSelectBy(els.itemSelect, 1);
          renderTabletBranch(state.data, true);
        }, { kind: "cycle", disabled: els.itemSelect.options.length < 2 });
        appendTabletBranchButton("通常使用", () => void finishEnhanceActionAfterTablet("use"), { kind: "action", hold: "enhance-use", disabled: els.itemUseButton.disabled });
        appendTabletBranchButton("投擲", () => void finishEnhanceActionAfterTablet("throw"), { kind: "danger", hold: "enhance-throw", disabled: els.itemThrowButton.disabled });
        appendTabletBranchButton(`譲渡先: ${els.transferTargetSelect.options[els.transferTargetSelect.selectedIndex]?.textContent || "なし"}`, () => {
          cycleSelectBy(els.transferTargetSelect, 1);
          renderTabletBranch(state.data, true);
        }, { kind: "target", disabled: els.transferTargetSelect.options.length < 2 });
        appendTabletBranchButton("選択品を譲渡", () => els.transferItemButton.click(), { kind: "action", disabled: els.transferItemButton.disabled });
        appendTabletBranchButton(`${transferCreditAmount()}C譲渡`, () => els.transferCreditsButton.click(), { kind: "action", disabled: els.transferCreditsButton.disabled });
      } else if (!branchPath) {
        addSubmenu("所持品", "inventory");
      }
    }
    if (!els.vendingPanel.hidden) {
      const vendingGroups = {
        "vending-support": ["mineral-water", "antidote", "evade", "speed", "heal", "mana"],
        "vending-tactical": ["warp", "mystery", "fire", "molotov", "substitution", "grit", "reason", "ice", "heated-water"],
        "vending-inventions": ["railgun", "particle-cannon", "excalibur", "exile", "computer", "handgun", "smg", "assault", "sniper", "taser", "rpg", "missile"],
        "vending-materials": ["mercury", "lead", "uranium", "plutonium"]
      };
      if (!branchPath) {
        addSubmenu("回復・支援", "vending-support");
        addSubmenu("戦術用品", "vending-tactical");
        addSubmenu("特殊装備", "vending-inventions");
        addSubmenu("元素素材", "vending-materials");
      }
      els.vendingPanel.querySelectorAll("[data-drink]").forEach((source) => {
        if (!branchPath || !vendingGroups[branchPath]?.includes(source.dataset.drink)) return;
        appendTabletBranchButton(source.textContent.trim(), () => source.click(), {
          disabled: source.disabled,
          source,
          hold: "vending",
          kind: source.classList.contains("danger") ? "danger" : "action"
        });
      });
    }
    if (!els.utilityControl.hidden) addSource(els.utilityButton);
  }
  scheduleTabletBranchLayout();
}

function renderTabletControls(data) {
  if (!data?.self) return;
  els.tabletNinjutsuShortcut.textContent = els.ninjutsuButton.textContent || "忍殺";
  els.tabletNinjutsuShortcut.disabled = els.ninjutsuButton.disabled || els.ninjutsuButton.hidden;
  els.tabletNinjutsuShortcut.hidden = els.ninjutsuButton.hidden;
  els.tabletAbilityShortcut.textContent = els.operatorAbilityButton.textContent || "オペ能力";
  els.tabletAbilityShortcut.disabled = els.operatorAbilityButton.disabled || els.operatorAbilityButton.hidden;
  els.tabletAbilityShortcut.hidden = els.operatorAbilityButton.hidden;
  els.tabletAbilityShortcut.dataset.operator = els.operatorAbilityButton.dataset.operator || "none";
  els.tabletAbilityShortcut.title = "タップして現在のオペ能力を発動";
  els.tabletAbilityShortcut.setAttribute("aria-haspopup", "false");
  els.tabletShootShortcut.textContent = els.shootButton.textContent || "射撃";
  els.tabletShootShortcut.disabled = els.shootButton.disabled;
  els.tabletShootShortcut.hidden = els.shootButton.hidden;
  els.tabletShootShortcut.classList.toggle("active", els.shootButton.classList.contains("active"));
  els.tabletEmpShortcut.textContent = els.empButton.textContent || "EMP";
  els.tabletEmpShortcut.disabled = els.empButton.disabled || els.empButton.hidden;
  els.tabletEmpShortcut.hidden = els.empButton.hidden;
  els.tabletClairvoyanceShortcut.textContent = state.clairvoyance.active ? "千里眼解除" : "千里眼";
  els.tabletClairvoyanceShortcut.disabled = data.phase !== "playing" || !data.self.alive || data.self.ejected;
  els.tabletClairvoyanceShortcut.classList.toggle("active", state.clairvoyance.active);
  els.tabletDodgeShortcut.textContent = els.dodgeButton.textContent || "回避";
  els.tabletDodgeShortcut.disabled = els.dodgeButton.disabled || els.dodgeButton.hidden;
  els.tabletDodgeShortcut.hidden = els.dodgeButton.hidden;
  els.tabletJumpShortcut.textContent = els.jumpButton.textContent || "跳躍";
  els.tabletJumpShortcut.disabled = els.jumpButton.disabled;
  els.tabletRenkiShortcut.textContent = els.renkiButton.textContent || "練気";
  els.tabletRenkiShortcut.disabled = els.renkiButton.disabled;
  els.tabletRestShortcut.textContent = els.sleepButton.textContent || "休息";
  els.tabletRestShortcut.disabled = els.sleepButton.disabled;
  const canAct = data.phase === "playing" && data.self.alive && !data.self.ejected && !data.self.inVent;
  els.tabletManaToStaminaShortcut.disabled = !canAct || Number(data.self.mana || 0) < 1;
  els.tabletDonateShortcut.disabled = !canAct || Number(data.self.credits || 0) < 10;
  renderTabletBranch(data);
}

function setTabletOpen(open, { persist = true, focus = true } = {}) {
  state.tabletOpen = Boolean(open && state.screen === "game" && state.data?.phase === "playing");
  els.tabletPanel.hidden = !state.tabletOpen;
  els.tabletButton?.setAttribute("aria-expanded", String(state.tabletOpen));
  els.tabletButton?.classList.toggle("active", state.tabletOpen);
  document.body.classList.toggle("tablet-mode-active", state.tabletOpen);
  document.documentElement.classList.toggle("tablet-mode-active", state.tabletOpen);
  if (persist) localStorage.setItem(storage.tabletMode, state.tabletOpen ? "1" : "0");
  if (state.tabletOpen) {
    if (state.fieldFeedOpen) setFieldFeedOpen(false);
    if (state.expandedMapOpen) setExpandedMapOpen(false);
    document.querySelectorAll(".keyboard-selected").forEach((item) => item.classList.remove("keyboard-selected"));
    if (els.tabletPanel.contains(document.activeElement)) document.activeElement.blur();
  } else if (focus) {
    (els.tabletButton || els.canvas).focus({ preventScroll: true });
  }
  if (!state.tabletOpen) {
    setTabletBranchGroup("");
    resetTabletStick();
    setDashHeld(false);
    setSlowWalkHeld(false);
    syncMovementInputImmediately();
  } else {
    renderTabletControls(state.data);
  }
  requestAnimationFrame(() => syncKeyboardContext(true));
}

function tabletModePreferenceEnabled() {
  return localStorage.getItem(storage.tabletMode) !== "0";
}

function setExpandedMapOpen(open) {
  const wasOpen = state.expandedMapOpen;
  if (open && state.fieldFeedOpen) setFieldFeedOpen(false);
  state.expandedMapOpen = Boolean(open && state.data);
  if (!state.expandedMapOpen) {
    state.teleportTargeting = false;
    state.teleportBorrowed = false;
    state.teleportTargetId = "";
    state.instantWarpTargeting = false;
    state.mapPointer = null;
  }
  els.expandedMapOverlay.hidden = !state.expandedMapOpen;
  els.mapActionButton.setAttribute("aria-expanded", String(state.expandedMapOpen));
  els.mapActionButton.textContent = state.expandedMapOpen ? "マップを閉じる" : "マップを開く";
  syncExpandedMapUi();
  clearMovementInput();
  requestAnimationFrame(() => syncKeyboardContext(true));
  if (wasOpen && !state.expandedMapOpen && state.tabletResumeAfterMap) {
    state.tabletResumeAfterMap = false;
    if (state.data?.phase === "playing") {
      requestAnimationFrame(() => setTabletOpen(true, { persist: false, focus: false }));
    }
  }
}

function minimapCanvasBounds(canvasWidth = els.canvas.width) {
  return { x: canvasWidth - 234, y: 70, width: 220, height: 150 };
}

function smartphoneRepairCanvasBounds(canvasWidth = els.canvas.width) {
  const size = 76;
  return { x: canvasWidth - size - 24, y: 236, width: size, height: size };
}

function smartphoneRepairState(data = state.data) {
  const self = data?.self;
  const liveNow = data ? estimatedServerNow(data) : 0;
  const active = Boolean(data?.phase === "playing" && (data.sabotage || data.activeDoorIds?.length));
  const remote = self?.special === "alchemist";
  const taskRange = Number(data?.map?.taskRange) || 70;
  const nearRepairStation = Boolean(data?.sabotage && data?.map?.stations?.some((station) => (
    station.type === "repair" &&
    station.repair === data.sabotage.type &&
    Math.hypot(Number(self?.x) - Number(station.x), Number(self?.y) - Number(station.y)) <= taskRange
  )));
  const activeDoorIds = new Set(data?.activeDoorIds || []);
  const nearClosedDoor = Boolean(data?.map?.doors?.some((door) => (
    activeDoorIds.has(door.id) &&
    Math.hypot(Number(self?.x) - (Number(door.x) + Number(door.w) / 2), Number(self?.y) - (Number(door.y) + Number(door.h) / 2)) <= taskRange
  )));
  const inPhysicalRange = nearRepairStation || nearClosedDoor;
  const itemBlocked = (Number(self?.itemDisabledUntil) || 0) > liveNow;
  const actionBlocked = self ? Math.max(
    Number(self.sleepingUntil) || 0,
    Number(self.unconsciousUntil) || 0,
    Number(self.meditatingUntil) || 0,
    Number(self.smartphoneUntil) || 0,
    Number(self.gravityPinnedUntil) || 0,
    Number(self.ascensionUntil) || 0
  ) > liveNow : true;
  const enoughStamina = !remote || Number(self?.stamina || 0) >= SMARTPHONE_REPAIR_STAMINA_COST;
  return {
    visible: active && (remote || inPhysicalRange),
    disabled: !active || (!remote && !inPhysicalRange) || !self?.alive || self.ejected || self.inVent || (remote && itemBlocked) || actionBlocked || !enoughStamina,
    itemBlocked,
    enoughStamina,
    remote,
    inPhysicalRange
  };
}

function pointerHitsSmartphoneRepair(event) {
  const repair = smartphoneRepairState();
  if (!repair.visible) return false;
  const point = canvasPointerPosition(event);
  if (!point) return false;
  const bounds = smartphoneRepairCanvasBounds();
  return point.x >= bounds.x && point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y && point.y <= bounds.y + bounds.height;
}

async function triggerSmartphoneRepair() {
  const repair = smartphoneRepairState();
  if (!repair.visible) return false;
  if (repair.remote && repair.itemBlocked) {
    showToast("EMPでスマホを使用できません。");
    return false;
  }
  if (!repair.enoughStamina) {
    showToast(`スマホ修理には ${SMARTPHONE_REPAIR_STAMINA_COST}SP が必要です。`);
    return false;
  }
  if (repair.disabled) return false;
  return api("/api/repair");
}

function canvasPointerPosition(event) {
  const rect = els.canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  return {
    x: (event.clientX - rect.left) * (els.canvas.width / rect.width),
    y: (event.clientY - rect.top) * (els.canvas.height / rect.height)
  };
}

function pointerHitsMinimap(event) {
  const point = canvasPointerPosition(event);
  if (!point) return false;
  const bounds = minimapCanvasBounds();
  return point.x >= bounds.x && point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y && point.y <= bounds.y + bounds.height;
}

function openExpandedMapFromMinimap() {
  if (!state.data || state.data.phase !== "playing" || state.expandedMapOpen) return false;
  state.tabletResumeAfterMap = state.tabletOpen;
  if (state.tabletOpen) setTabletOpen(false, { persist: false, focus: false });
  toggleExpandedMapFromAction();
  return state.expandedMapOpen;
}

function toggleExpandedMapFromAction() {
  if (state.expandedMapOpen) {
    setExpandedMapOpen(false);
    return;
  }
  const data = state.data;
  const self = data?.self;
  if (
    data?.phase === "playing" &&
    self?.special === "teleport" &&
    self.alive &&
    !self.ejected &&
    !self.inVent
  ) {
    const liveNow = estimatedServerNow(data);
    if ((Number(self.teleportReadyAt) || 0) <= liveNow) {
      els.teleportModeSelect.value = "body";
      state.teleportTargetId = self.id;
      state.teleportTargeting = true;
      state.teleportBorrowed = false;
      setExpandedMapOpen(true);
      initializeMapKeyboardPointer();
      return;
    }
  }
  setExpandedMapOpen(true);
}

function syncExpandedMapUi() {
  const targeting = state.expandedMapOpen && (state.teleportTargeting || state.instantWarpTargeting);
  const area = currentAreaLabel(state.data);
  const teleportTarget = state.data?.players?.find((player) => player.id === state.teleportTargetId);
  els.expandedMapTitle.textContent = state.instantWarpTargeting
    ? "即時ワープ先"
    : targeting
      ? `${teleportTarget?.name || "自分"} の転移先`
      : `現在地: ${area}`;
  els.teleportMapStatus.hidden = !targeting;
  els.expandedMapCanvas.classList.toggle("teleport-targeting", targeting);
}

function beginInstantWarpTargeting() {
  const data = state.data;
  if (!data || data.phase !== "playing" || !data.self.alive || data.self.warpCharges <= 0) return;
  state.instantWarpTargeting = true;
  state.teleportTargeting = false;
  state.teleportBorrowed = false;
  setExpandedMapOpen(true);
  initializeMapKeyboardPointer();
}

function toggleCameraView() {
  const data = state.data;
  const available = availableCameraIndices(data);
  if (!data || data.phase !== "playing" || data.self.role !== "defender" || !available.length) return;
  state.cameraViewIndex = state.cameraViewIndex >= 0 ? -1 : available[0];
  clearMovementInput();
  render();
}

function nextCameraView() {
  const available = availableCameraIndices(state.data);
  if (!available.length || state.cameraViewIndex < 0) return;
  const position = available.indexOf(state.cameraViewIndex);
  state.cameraViewIndex = available[(position + 1) % available.length];
}

function availableCameraIndices(data) {
  return (data?.map?.cameras || [])
    .map((camera, index) => ({ camera, index }))
    .filter(({ camera }) => !camera.destroyed)
    .map(({ index }) => index);
}

function currentCamera(data) {
  if (state.cameraViewIndex < 0) return null;
  const camera = data?.map?.cameras?.[state.cameraViewIndex];
  return camera && !camera.destroyed ? camera : null;
}

function triggerTeleportAction() {
  const data = state.data;
  if (!data || data.phase !== "playing" || data.self.special !== "teleport") return;
  const mode = els.teleportModeSelect.value;
  if (mode === "heart") {
    const targetId = els.teleportTargetSelect.value || data.self.id;
    if (targetId !== data.self.id) void api("/api/teleport", { targetId, mode: "heart" });
    return;
  }
  if (mode === "near") {
    void api("/api/teleport", { targetId: els.teleportTargetSelect.value || data.self.id, mode: "near" });
    return;
  }
  if (mode === "accelerate" || mode === "decelerate") {
    void api("/api/gravity-time", { targetId: els.teleportTargetSelect.value || data.self.id, mode });
    return;
  }
  if (mode === "storm") {
    void api("/api/gravity-storm", { targetId: els.teleportTargetSelect.value || data.self.id });
    return;
  }
  beginTeleportTargeting();
}

function beginTeleportTargeting() {
  const data = state.data;
  if (!data || data.phase !== "playing" || data.self.special !== "teleport" || els.teleportModeSelect.value !== "body") return;
  const liveNow = estimatedServerNow(data);
  if (!data.self.alive || data.self.ejected || data.self.inVent || data.self.teleportReadyAt > liveNow) return;
  state.teleportTargetId = els.teleportTargetSelect.value || data.self.id;
  state.teleportTargeting = true;
  state.teleportBorrowed = false;
  setExpandedMapOpen(true);
  initializeMapKeyboardPointer();
}

function beginBorrowedGravityTargeting() {
  const data = state.data;
  if (!data || data.phase !== "playing" || data.self.special !== "alchemist" || els.teleportModeSelect.value !== "body") return;
  if (!hasDisplayedOperatorAccess(data.self, "gravity") || !data.self.alive || data.self.ejected || data.self.inVent) return;
  state.teleportTargetId = els.teleportTargetSelect.value || data.self.id;
  state.teleportTargeting = true;
  state.teleportBorrowed = true;
  setExpandedMapOpen(true);
  initializeMapKeyboardPointer();
}

function borrowedAbilityPayload(recipe, requestedMode = "") {
  const mode = requestedMode || state.borrowedAbilityModes[recipe.inventoryId] || els.teleportModeSelect.value;
  const combatTarget = recipe.inventoryId === "fighter" ? nearestTarget()?.id || "" : "";
  return {
    ability: recipe.inventoryId,
    mode: recipe.inventoryId === "flora" ? (mode.startsWith("sunbeam") ? "sunbeam" : "heal") : mode,
    converged: recipe.inventoryId === "flora" && mode === "sunbeam-converged",
    targetId: combatTarget || (recipe.inventoryId === "flora" ? "" : (els.teleportTargetSelect.value || state.data?.self?.id || "")),
    dx: Number(state.data?.self?.aimX) || 0,
    dy: Number(state.data?.self?.aimY) || 1
  };
}

function selectedBorrowedOperator() {
  const self = state.data?.self;
  if (self?.special !== "alchemist") return "";
  const owned = availableBorrowedOperatorTypes(self);
  if (!owned.length) return "";
  if (!owned.includes(state.borrowedOperatorType)) state.borrowedOperatorType = owned[0];
  return state.borrowedOperatorType;
}

function rememberSelectedOperatorMode() {
  const borrowedType = selectedBorrowedOperator();
  if (!borrowedType || borrowedType === "fighter") return;
  state.borrowedAbilityModes[borrowedType] = els.teleportModeSelect.value;
}

function cycleActiveOperatorMode(direction = 1) {
  if (els.teleportModeSelect.disabled || !els.teleportModeSelect.options.length) return false;
  cycleSelectBy(els.teleportModeSelect, direction);
  rememberSelectedOperatorMode();
  renderTargetOptions(state.data);
  updateActionButtons(state.data);
  return true;
}

function triggerBorrowedAbility(type, requestedMode = "") {
  const recipe = alchemyRecipes.find((entry) => entry.id === `borrowed-${type}`);
  if (!recipe || !alchemyRecipeAvailable(recipe)) return;
  if (requestedMode) state.borrowedAbilityModes[type] = requestedMode;
  state.borrowedOperatorType = type;
  renderTargetOptions(state.data);
  const mode = state.borrowedAbilityModes[type] || els.teleportModeSelect.value;
  if ([...els.teleportModeSelect.options].some((option) => option.value === mode)) {
    els.teleportModeSelect.value = mode;
  }
  if (type === "gravity" && mode === "body") {
    beginBorrowedGravityTargeting();
    return;
  }
  void api("/api/borrowed-ability", borrowedAbilityPayload(recipe, mode));
}

function setOperatorBranchesOpen(open, operatorType = "", focusFirst = true) {
  const self = state.data?.self;
  state.operatorBranchesOpen = Boolean(open && self && state.data?.phase === "playing");
  state.operatorBranchType = state.operatorBranchesOpen ? operatorType : "";
  els.operatorBranchPanel.hidden = !state.operatorBranchesOpen;
  els.operatorBranchList.replaceChildren();
  if (!state.operatorBranchesOpen) return;

  const activeType = operatorType || self.special;
  const borrowedPreview = self.special === "alchemist" && Boolean(operatorType);
  const titles = {
    fighter: "ファイター能力",
    teleport: "グラビティ能力",
    gravity: "グラビティ能力",
    flora: "フローラ能力",
    gunner: "ガンナー能力",
    quantum: "量子制御",
    alchemist: "バイブコーディング"
  };
  els.operatorBranchTitle.textContent = titles[activeType] || "派生能力";

  const addBranch = (label, action, selected = false, description = "") => {
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `<strong>${escapeHtml(label)}</strong>${description ? `<small>${escapeHtml(description)}</small>` : ""}`;
    button.title = description || label;
    button.setAttribute("aria-label", description ? `${label}: ${description}` : label);
    button.classList.toggle("selected", selected);
    button.addEventListener("click", () => {
      setOperatorBranchesOpen(false);
      action();
    });
    els.operatorBranchList.appendChild(button);
  };

  if (activeType === "teleport" || activeType === "gravity") {
    const gravityDescriptions = {
      body: "拡大マップで指定した通行可能地点へ転移する",
      near: "選択した他プレイヤーの近くへ転移する",
      heart: "対象の心臓へ干渉して遠隔攻撃する",
      accelerate: "8秒間、移動・行動・リキャストを超加速する",
      decelerate: "8秒間、対象の移動・行動・リキャストを超減速する",
      storm: "乱数強度の継続ダメージ・減速・重力変位。自身の半径2mは安全"
    };
    const gravityModes = new Set(["body", "near", "heart", "accelerate", "decelerate", "storm"]);
    [...els.teleportModeSelect.options].filter((option) => gravityModes.has(option.value)).forEach((option) => {
      addBranch(option.textContent, () => {
        state.borrowedAbilityModes.gravity = option.value;
        els.teleportModeSelect.value = option.value;
        els.teleportModeSelect.dispatchEvent(new Event("change", { bubbles: true }));
        if (borrowedPreview) triggerBorrowedAbility("gravity", option.value);
        else triggerOperatorAbility();
      }, option.value === (borrowedPreview ? state.borrowedAbilityModes.gravity : els.teleportModeSelect.value), gravityDescriptions[option.value] || "");
    });
  } else if (activeType === "flora") {
    const floraDescriptions = {
      heal: "周囲のHP・SP・状態異常を回復し、加速を付与する",
      sunbeam: "屈折・散乱・回折する貫通光線で複数対象を攻撃する",
      "sunbeam-converged": "光を一点へ収束し、貫通を失う代わりに確殺する"
    };
    const floraModes = new Set(["heal", "sunbeam", "sunbeam-converged"]);
    [...els.teleportModeSelect.options].filter((option) => floraModes.has(option.value)).forEach((option) => {
      addBranch(option.textContent, () => {
        state.borrowedAbilityModes.flora = option.value;
        els.teleportModeSelect.value = option.value;
        els.teleportModeSelect.dispatchEvent(new Event("change", { bubbles: true }));
        if (borrowedPreview) triggerBorrowedAbility("flora", option.value);
        else triggerOperatorAbility();
      }, option.value === (borrowedPreview ? state.borrowedAbilityModes.flora : els.teleportModeSelect.value), floraDescriptions[option.value] || "");
    });
  } else if (activeType === "gunner") {
    addBranch("ホバースプリント", () => {
      state.borrowedAbilityModes.gunner = "hover-sprint";
      if ([...els.teleportModeSelect.options].some((option) => option.value === "hover-sprint")) {
        els.teleportModeSelect.value = "hover-sprint";
      }
      if (borrowedPreview) triggerBorrowedAbility("gunner", "hover-sprint");
      else triggerOperatorAbility();
    }, (borrowedPreview ? state.borrowedAbilityModes.gunner : els.teleportModeSelect.value) === "hover-sprint", "8秒間加速し、壁と障害物を無視して移動する");
  } else if (activeType === "quantum") {
    const quantumModes = new Set(["transmute-mercury", "transmute-lead", "cool-water", "heat-water", "fission-uranium", "fission-plutonium"]);
    [...els.teleportModeSelect.options].filter((option) => quantumModes.has(option.value)).forEach((option) => {
      addBranch(option.textContent, () => {
        els.teleportModeSelect.value = option.value;
        void api("/api/quantum-control", { mode: option.value });
      }, option.value === els.teleportModeSelect.value, "選択した物質または温度状態を量子制御する");
    });
  } else if (activeType === "alchemist") {
    availableHackerRecipes(self).forEach((recipe) => {
      addBranch(recipe.label, () => {
        selectAlchemyRecipe(recipe.id);
        triggerOperatorAbility();
      }, recipe.id === els.alchemySelect.value, recipe.output || "");
    });
  }
  if (focusFirst) {
    requestAnimationFrame(() => els.operatorBranchList.querySelector("button")?.focus({ preventScroll: true }));
  }
}

function triggerOperatorAbility() {
  const self = state.data?.self;
  if (!self) return;
  if (self.special === "fighter") {
    void api("/api/limit-break");
  } else if (self.special === "teleport") {
    triggerTeleportAction();
  } else if (self.special === "flora") {
    const mode = els.teleportModeSelect.value;
    void api("/api/flora-heal", {
      mode: mode.startsWith("sunbeam") ? "sunbeam" : "heal",
      converged: mode === "sunbeam-converged",
      targetId: "",
      dx: Number(self.aimX) || 0,
      dy: Number(self.aimY) || 1
    });
  } else if (self.special === "gunner") {
    void api("/api/gunner-hover-sprint");
  } else if (self.special === "quantum") {
    void api("/api/quantum-control", { mode: els.teleportModeSelect.value || self.quantumMode });
  } else if (self.special === "alchemist") {
    const borrowedType = selectedBorrowedOperator();
    if (borrowedType) triggerBorrowedAbility(borrowedType, state.borrowedAbilityModes[borrowedType] || "");
  }
}

function initializeMapKeyboardPointer() {
  const self = state.data?.self;
  if (!self) return;
  state.mapPointer = {
    x: self.x,
    y: self.y,
    valid: isClientWalkable(state.data, self.x, self.y, state.data.map.playerRadius || 36)
  };
}

function moveExpandedMapPointer(key, fast = false) {
  const data = state.data;
  if (!data) return;
  if (!state.mapPointer) initializeMapKeyboardPointer();
  if (!state.mapPointer) return;
  const step = fast ? 180 : 72;
  const dx = key === "ArrowLeft" ? -step : key === "ArrowRight" ? step : 0;
  const dy = key === "ArrowUp" ? -step : key === "ArrowDown" ? step : 0;
  const radius = data.map.playerRadius || 36;
  const x = clamp(state.mapPointer.x + dx, radius, data.map.width - radius);
  const y = clamp(state.mapPointer.y + dy, radius, data.map.height - radius);
  state.mapPointer = { x, y, valid: isClientWalkable(data, x, y, radius) };
}

function expandedMapPoint(event) {
  const data = state.data;
  if (!data) return null;
  const rect = els.expandedMapCanvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  const layout = expandedMapLayout(data);
  const canvasX = (event.clientX - rect.left) * (els.expandedMapCanvas.width / rect.width);
  const canvasY = (event.clientY - rect.top) * (els.expandedMapCanvas.height / rect.height);
  const x = (canvasX - layout.ox) / layout.scale;
  const y = (canvasY - layout.oy) / layout.scale;
  return {
    x,
    y,
    valid: isClientWalkable(data, x, y, data.map.playerRadius)
  };
}

function updateExpandedMapPointer(event) {
  if (!state.teleportTargeting && !state.instantWarpTargeting) return;
  state.mapPointer = expandedMapPoint(event);
}

function nearestExpandedMapDestination(point) {
  const data = state.data;
  if (!data || !point) return null;
  const radius = data.map.playerRadius || 36;
  if (point.valid) return point;
  for (const offset of [18, 36, 54, 72, 96, 132]) {
    for (let step = 0; step < 16; step += 1) {
      const angle = step / 16 * Math.PI * 2;
      const x = clamp(point.x + Math.cos(angle) * offset, radius, data.map.width - radius);
      const y = clamp(point.y + Math.sin(angle) * offset, radius, data.map.height - radius);
      if (isClientWalkable(data, x, y, radius)) return { x, y, valid: true };
    }
  }
  return point;
}

async function teleportFromExpandedMap(event) {
  const self = state.data?.self;
  if (!state.teleportTargeting && !state.instantWarpTargeting) {
    if (state.data?.phase !== "playing" || self?.special !== "teleport" || !self.alive || self.ejected || self.inVent) return;
    state.teleportTargeting = true;
    state.teleportBorrowed = false;
    state.teleportTargetId = self.id;
    state.mapPointer = nearestExpandedMapDestination(expandedMapPoint(event));
    syncExpandedMapUi();
    await activateExpandedMapPoint(state.mapPointer);
    return;
  }
  const point = nearestExpandedMapDestination(expandedMapPoint(event));
  state.mapPointer = point;
  await activateExpandedMapPoint(point);
}

async function activateExpandedMapPoint(point) {
  if (!state.teleportTargeting && !state.instantWarpTargeting) return;
  point = nearestExpandedMapDestination(point);
  if (!point?.valid) {
    showToast("通行可能な場所を指定してください。");
    return;
  }
  const endpoint = state.instantWarpTargeting
    ? "/api/instant-warp"
    : state.teleportBorrowed
      ? "/api/borrowed-ability"
      : "/api/teleport";
  const ok = await api(endpoint, {
    x: point.x,
    y: point.y,
    targetId: state.teleportTargeting ? state.teleportTargetId : "",
    mode: "body",
    ability: state.teleportBorrowed ? "gravity" : undefined
  });
  if (ok) setExpandedMapOpen(false);
}

function keyName(key) {
  const value = key.toLowerCase();
  if (value === "w") return "up";
  if (value === "s") return "down";
  if (value === "a") return "left";
  if (value === "d") return "right";
  return "";
}

function normalizeSkinId(value) {
  return value === "blue-dress" ? "blue-dress" : "hood";
}

function normalizeKillerSkinId(value, killerIsBot = false) {
  if (killerIsBot || value === "operator") return "operator";
  return normalizeSkinId(value);
}

function playerIdentityLabel(player) {
  const name = String(player?.name || "");
  if (player?.isBot) return name;
  const killRate = Number(player?.killRate);
  return `${name} / ${Number.isFinite(killRate) ? killRate.toFixed(2) : "0.00"}`;
}

function displayedSkinId(player, data = state.data) {
  if (player && player.id === data?.selfId && state.pendingSkinId) return state.pendingSkinId;
  return normalizeSkinId(player?.skinId);
}

async function syncSelectedSkin() {
  const skinId = normalizeSkinId(els.skinSelect.value);
  const requestSeq = ++state.skinRequestSeq;
  state.pendingSkinId = skinId;
  els.skinSelect.value = skinId;
  localStorage.setItem(storage.skin, skinId);
  if (!state.roomId || !state.playerId) return;
  const ok = await api("/api/skin", { skinId });
  if (requestSeq !== state.skinRequestSeq) return;
  if (!ok) state.pendingSkinId = "";
}

async function joinRoom(options = {}) {
  loadGameplayTextures();
  if (!options.forceOffline && !state.onlineAvailable) {
    showToast("オンライン機能は現在利用できません。");
    return;
  }
  const name = els.nameInput.value.trim();
  if (!name) {
    showToast("最初に名前を入力してください。");
    els.nameInput.focus();
    return;
  }
  const skinId = normalizeSkinId(els.skinSelect.value);
  localStorage.setItem(storage.name, name);
  localStorage.setItem(storage.skin, skinId);
  const requestBody = {
    name,
    skinId,
    roomId: els.roomInput.value.trim(),
    playerId: state.playerId
  };
  let result = null;
  if (!options.forceOffline) {
    deactivateOfflineMode();
    result = await request("/api/join", requestBody, { quiet: true, forceOnline: true });
  }
  if (!result) {
    if (!activateOfflineMode(options.forceOffline
      ? "オフラインルームを作成します。"
      : "公開サーバーに接続できないため、オフラインルームへ切り替えました。")) return;
    result = await request("/api/join", requestBody, { forceOffline: true });
  }
  if (!result) return;
  lockPlayerName(result.profile?.name || responsePlayerName(result, name));
  state.roomId = result.roomId;
  state.playerId = result.playerId;
  localStorage.setItem(storage.room, state.roomId);
  localStorage.setItem(storage.player, state.playerId);
  applyState(result);
  recordUsageCheckpoint(state.offlineMode ? "offline_joined" : "online_joined");
  if (result.offline) showToast(`オフラインルーム ${result.roomId}`);
  if (result.midJoined) showToast("進行中の試合へ途中参加しました。");
}

async function startSoloMission(missionId) {
  if (!soloMissionIds.includes(missionId) || state.soloMissionStarting) return;
  const name = localStorage.getItem(storage.name) || els.nameInput.value.trim();
  if (!name) {
    showToast("最初に名前を入力してください。");
    setScreen("online");
    els.nameInput.focus();
    return;
  }
  loadGameplayTextures();
  state.soloMissionStarting = true;
  recordUsageCheckpoint(`solo_start_${missionId}`);
  const soloButtons = [...els.soloMissionGrid.querySelectorAll("[data-solo-mission]")];
  soloButtons.forEach((button) => {
    button.disabled = true;
    button.textContent = button.dataset.soloMission === missionId ? "接続中..." : "開始";
  });
  const skinId = normalizeSkinId(localStorage.getItem(storage.skin) || els.skinSelect.value);
  const previousRoomId = state.roomId;
  const previousPlayerId = state.playerId;
  if (previousRoomId && previousPlayerId && !state.offlineMode) {
    void request("/api/leave", { roomId: previousRoomId, playerId: previousPlayerId }, { quiet: true, forceOnline: true });
  }
  activateOfflineMode();
  const result = await request("/api/solo/start", { missionId, name, skinId }, { forceOffline: true });
  state.soloMissionStarting = false;
  soloButtons.forEach((button) => {
    button.disabled = false;
    button.textContent = "開始";
  });
  if (!result) return;
  lockPlayerName(result.profile?.name || responsePlayerName(result, name));
  resetLocalSession();
  state.roomId = result.roomId;
  state.playerId = result.playerId;
  localStorage.setItem(storage.room, state.roomId);
  localStorage.setItem(storage.player, state.playerId);
  applyState(result);
  enterFullscreen();
  switchScreenWithEffect("game");
  showToast(`${result.soloMission?.name || "ソロ訓練"}: ${result.soloMission?.objective || "目標を達成してください。"}`);
}

async function pollState() {
  if (!state.roomId || !state.playerId) return;
  if (state.realtime?.isHealthy()) return;
  if (state.pollInFlight) return;
  const roomId = state.roomId;
  const playerId = state.playerId;
  state.pollInFlight = true;
  try {
    const result = await request("/api/state", {
      roomId,
      playerId
    }, { quiet: true, resetOnNotFound: true });
    if (result && state.roomId === roomId && state.playerId === playerId) applyState(result);
  } finally {
    state.pollInFlight = false;
  }
}

async function leaveCurrentRoom() {
  if (!state.roomId || !state.playerId) return;
  const roomId = state.roomId;
  const playerId = state.playerId;
  const returnToTactics = Boolean(state.data?.soloMission);
  els.leaveRoomButton.disabled = true;
  const result = await request("/api/leave", { roomId, playerId });
  els.leaveRoomButton.disabled = false;
  if (!result || state.roomId !== roomId || state.playerId !== playerId) return;
  resetLocalSession();
  if (returnToTactics) switchScreenWithEffect("tactics");
  showToast("部屋から退出しました。");
  refreshRooms();
}

async function api(path, extra = {}, options = {}) {
  if (!state.roomId || !state.playerId) {
    showToast("先に入室してください。");
    return false;
  }
  const result = await request(path, {
    roomId: state.roomId,
    playerId: state.playerId,
    ...extra
  });
  if (!result) return false;
  if (result.moderated) {
    const message = result.error || "禁止コメントを検出したため退出しました。";
    resetLocalSession();
    showToast(message);
    return result;
  }
  const actionKind = CHARACTER_ACTION_BY_API[path];
  if (actionKind) triggerCharacterAction(state.playerId, actionKind);
  applyState(result, { authoritative: Boolean(options.authoritative) });
  return result;
}

async function loadDropoffAnalytics(toggle = true) {
  if (toggle && !els.analyticsPanel.hidden) {
    els.analyticsPanel.hidden = true;
    els.analyticsToggleButton.classList.remove("active");
    els.analyticsToggleButton.setAttribute("aria-expanded", "false");
    return;
  }
  els.analyticsPanel.innerHTML = `
    <div class="panel-title-row"><strong>離脱分析</strong><span class="badge">接続中</span></div>
    <p class="analytics-status-message">保存済みのプレイ履歴を読み込んでいます。</p>
  `;
  els.analyticsPanel.hidden = false;
  els.analyticsToggleButton.classList.add("active");
  els.analyticsToggleButton.setAttribute("aria-expanded", "true");
  const result = await request(
    "/api/checkpoints",
    { clientId: clientId() },
    { publicFeature: "離脱分析" }
  );
  if (!result?.checkpoints) {
    const pendingCount = analyticsQueue().length;
    els.analyticsPanel.innerHTML = `
      <div class="panel-title-row"><strong>離脱分析</strong><span class="badge warning">取得失敗</span></div>
      <p class="analytics-status-message">公開サーバーが停止中です。今回の記録はこの端末に保持し、サーバー復旧後に自動送信します。</p>
      <p class="analytics-status-message warning">未送信 ${pendingCount}件</p>
      <button class="secondary analytics-retry-button" type="button">再試行</button>
    `;
    els.analyticsPanel.querySelector(".analytics-retry-button")?.addEventListener("click", () => {
      els.analyticsPanel.hidden = true;
      void loadDropoffAnalytics();
    });
    return;
  }
  const labels = {
    title_loaded: "タイトル",
    online_open: "オンライン入口",
    tactics_open: "戦術いろは",
    online_joined: "オンライン入室",
    offline_joined: "オフライン入室",
    operator_select: "オペレーター選択",
    battle_started: "バトル",
    meeting_started: "会議",
    result_reached: "リザルト",
    "solo_start_movement": "移動訓練",
    "solo_start_combat": "射撃訓練",
    "solo_start_defense": "防衛訓練",
    "solo_start_intel": "索敵訓練",
    "solo_start_emp": "EMP訓練",
    "solo_start_cpu-gravity": "CPU戦"
  };
  const players = Array.isArray(result.checkpoints.players) ? result.checkpoints.players : [];
  const archiveWarning = !result.archiveStatus
    ? `<p class="analytics-status-message warning">公開バックエンドが旧版です。履歴の永続保存を有効にするにはバックエンドを更新してください。</p>`
    : result.archiveStatus.state === "failed"
      ? `<p class="analytics-status-message warning">過去履歴の復元に失敗しています。現在のサーバー起動中に記録された履歴のみ表示します。</p>`
      : "";
  els.analyticsPanel.innerHTML = `
    <div class="panel-title-row"><strong>離脱分析</strong><span class="badge">${players.length}人</span></div>
    <p>匿名プレイヤーごとの総プレイ時間と、最後に到達した地点だけを表示します。この端末のアクセスは常に除外されます。</p>
    ${archiveWarning}
    <ol class="analytics-player-list">${players.map((player) => `
      <li>
        <span>
          <strong>${escapeHtml(player.name || `#${player.id || "unknown"}`)}</strong>
          <small>離脱地点: ${escapeHtml(labels[player.currentCheckpoint] || player.currentCheckpoint || "不明")}</small>
        </span>
        <strong>${formatAnalyticsDuration(player.totalSeconds)}</strong>
      </li>
    `).join("") || "<li>まだ他のプレイヤー履歴はありません。</li>"}</ol>
  `;
  els.analyticsPanel.hidden = false;
  els.analyticsToggleButton.classList.add("active");
  els.analyticsToggleButton.setAttribute("aria-expanded", "true");
  els.analyticsPanel.focus({ preventScroll: true });
}

function formatAnalyticsDuration(rawSeconds) {
  const totalSeconds = Math.max(0, Math.round(Number(rawSeconds) || 0));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(totalSeconds % 3600 / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}時間${minutes}分`;
  if (minutes > 0) return `${minutes}分${seconds}秒`;
  return `${seconds}秒`;
}

async function performNinjutsu() {
  const target = nearestTarget();
  const fighterSlash = hasDisplayedOperatorAccess(state.data.self, "fighter");
  if (!target) {
    if (fighterSlash) {
      const ok = await api("/api/fighter-slash", { targetId: "" });
      if (ok) showToast("斬るを発動しました。射撃を切断できます。");
      return;
    }
    showToast("忍殺できる距離に対象がいません。");
    return;
  }
  const ok = await api(fighterSlash ? "/api/fighter-slash" : "/api/ninjutsu", { targetId: target.id });
  if (ok) {
    showToast(fighterSlash
      ? `${target.name}へ斬るを実行しました。`
      : `${target.name}への忍殺準備を開始しました。相手が動くと失敗します。`);
  }
}

async function attackFromCanvas(event) {
  if (!state.data || event.button !== 0) return;
  if (showMarkerExplanationFromPointer(event)) {
    event.preventDefault();
    return;
  }
  if (pointerHitsSmartphoneRepair(event)) {
    event.preventDefault();
    void triggerSmartphoneRepair();
    return;
  }
  if (pointerHitsMinimap(event)) {
    event.preventDefault();
    openExpandedMapFromMinimap();
  }
}

async function beginGunFire() {
  if (state.gunTriggerHeld || state.gunFireStartPromise || els.shootButton.disabled) return false;
  state.gunTriggerHeld = true;
  els.shootButton.classList.add("active");
  const direction = gunnerDirection();
  const request = api("/api/shoot", { action: "start", dx: direction.dx, dy: direction.dy });
  state.gunFireStartPromise = request;
  const result = await request;
  if (!result && state.gunFireStartPromise === request) {
    state.gunTriggerHeld = false;
    state.gunTriggerPointerId = null;
    state.gunFireStartPromise = null;
    els.shootButton.classList.remove("active");
  }
  return Boolean(result);
}

async function endGunFire() {
  const hadTrigger = state.gunTriggerHeld || state.gunFireStartPromise;
  state.gunTriggerHeld = false;
  state.gunTriggerPointerId = null;
  els.shootButton.classList.remove("active");
  if (!hadTrigger) return;
  const pending = state.gunFireStartPromise;
  state.gunFireStartPromise = null;
  state.hackerGenerationInFlight = false;
  clearHackerCooldownWake();
  if (pending) await pending;
  if (state.roomId && state.playerId) await api("/api/shoot", { action: "stop" });
}

async function beginInventoryWeaponFire(pointerId) {
  const itemId = els.itemSelect?.value || "";
  if (!itemId.startsWith("weapon:")) return false;
  const weaponId = itemId.slice(7);
  if (weaponId !== state.data?.self?.gunnerWeapon) {
    const switched = await api("/api/gunner-weapon", { weaponId });
    if (!switched || state.gunTriggerPointerId !== pointerId) return false;
  }
  if (state.gunTriggerPointerId !== pointerId) return false;
  return beginGunFire();
}

async function pulseGunFire() {
  if (!await beginGunFire()) return;
  window.setTimeout(() => void endGunFire(), 90);
}

function gunnerDirection() {
  const data = state.data;
  const input = getDirection();
  if (input.dx || input.dy) return input;
  const aimX = Number(data?.self.aimX) || 0;
  const aimY = Number(data?.self.aimY) || 0;
  const length = Math.hypot(aimX, aimY);
  if (length > 0.01) return { dx: aimX / length, dy: aimY / length };
  const facing = state.facing.get(data?.selfId) || "down";
  return {
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 },
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 }
  }[facing];
}

async function request(path, body = {}, options = {}) {
  const useOffline = options.forceOffline || (state.offlineMode && !options.forceOnline);
  if (useOffline) {
    const result = await state.offlineClient?.request(path, { ...body, clientId: clientId() });
    if (!result?.ok) {
      if (!options.quiet) showToast(result?.error || "オフライン処理に失敗しました。");
      return null;
    }
    return result;
  }
  const retryable = [
    "/api/state",
    "/api/rooms",
    "/api/profile",
    "/api/join",
    "/api/solo/start",
    "/api/checkpoints",
    "/api/checkpoints/exclude"
  ].includes(path);
  const attempts = retryable ? 3 : 1;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(apiUrl(path), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...body, clientId: clientId() })
      });
      let result = null;
      try {
        result = await response.json();
      } catch {
        if (retryable && response.status >= 500 && attempt + 1 < attempts) {
          if (!options.quiet) showToast("公開サーバーを起動しています。再接続中です。");
          await delay(700 * (attempt + 1));
          continue;
        }
        throw new Error("invalid-json");
      }
      if (!response.ok || !result.ok) {
        if (options.resetOnNotFound && response.status === 404) resetLocalSession();
        if (!options.quiet) {
          const outdatedPublicApi = options.publicFeature && response.status === 404 && API_BASE_URL;
          showToast(outdatedPublicApi
            ? `${options.publicFeature}用の公開サーバーが旧版です。バックエンドを更新してください。`
            : result.error || "通信エラー");
        }
        return null;
      }
      return result;
    } catch (error) {
      if (attempt + 1 < attempts) {
        if (!options.quiet) showToast("サーバーへ再接続しています。");
        await delay(700 * (attempt + 1));
        continue;
      }
      if (!options.quiet) showToast("サーバーに接続できません。公開サーバーの起動待ち、またはローカルアプリの起動状態を確認してください。");
      return null;
    }
  }
  return null;
}

function delay(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function resetLocalSession() {
  state.realtime?.disconnect();
  state.movementQueue?.clear();
  state.data = null;
  state.roomId = "";
  state.playerId = "";
  state.lastStateServerNow = 0;
  state.lastStateReceivedAt = 0;
  state.lastMoveAppliedClock = 0;
  state.lastMovementServerNow = 0;
  state.lastMovementSentSignature = "";
  state.fieldFeedOpen = false;
  state.lastRoomChatId = "";
  state.lastRoomChatRoomId = "";
  hideChatNotification();
  state.motion.clear();
  state.facing.clear();
  state.walkAnimations.clear();
  state.physicalMotionPhases.clear();
  state.characterActions.clear();
  state.renderPlayers.clear();
  state.camera = { x: 0, y: 0, initialized: false, mode: "", frame: -1 };
  state.killEffects = [];
  state.hitEffects = [];
  state.magicEffects = [];
  state.worldSoundEffects = [];
  state.movementActive = false;
  state.movementStopPendingSeq = 0;
  state.expandedMapOpen = false;
  state.tabletOpen = false;
  state.tabletResumeAfterMap = false;
  state.operatorBranchesOpen = false;
  state.gunTriggerHeld = false;
  state.gunTriggerPointerId = null;
  state.gunFireStartPromise = null;
  els.shootButton.classList.remove("active");
  state.teleportTargeting = false;
  state.teleportBorrowed = false;
  state.instantWarpTargeting = false;
  state.cameraViewIndex = -1;
  state.renderDrone = null;
  state.operatorRenderKey = "";
  state.resultCelebrationKey = "";
  els.resultConfetti.replaceChildren();
  state.mapPointer = null;
  state.actionSelectionId = "";
  state.phaseUiKey = "";
  state.actionLayoutKey = "";
  state.activeEffectsRenderKey = "";
  state.inventoryVisualWeapon = "";
  state.hackerTargetId = "";
  state.hackerDockRenderKey = "";
  state.hackerSelectedRecipeId = "";
  state.hackerSelectedByCategory = Object.create(null);
  state.vendingRenderKey = "";
  state.utilityRenderKey = "";
  state.lastCanvasStageError = "";
  state.lastCanvasItemError = "";
  state.keyboardContext = "";
  state.keyboardElement = null;
  els.expandedMapOverlay.hidden = true;
  els.tabletPanel.hidden = true;
  els.operatorBranchPanel.hidden = true;
  els.hackerAbilityDock.hidden = true;
  els.hackerAbilityGrid.replaceChildren();
  els.tabletButton?.setAttribute("aria-expanded", "false");
  els.fieldFeedPanel.hidden = true;
  els.mapActionButton.setAttribute("aria-expanded", "false");
  els.mapActionButton.textContent = "マップを開く";
  syncExpandedMapUi();
  clearMovementInput();
  localStorage.removeItem(storage.room);
  localStorage.removeItem(storage.player);
  els.roomInput.value = "";
  render();
}

async function refreshRooms() {
  if (!state.onlineAvailable) {
    renderRoomList([]);
    return;
  }
  const result = await request("/api/rooms", {}, { quiet: true, forceOnline: true });
  if (!result) return;
  renderRoomList(result.rooms || []);
}

async function sendSettings() {
  if (!state.data || state.data.phase !== "lobby" || state.data.hostId !== state.playerId) return;
  await api("/api/settings", {
    mapId: els.mapSelect.value,
    hostTeam: els.hostTeamSelect.value,
    attackerCount: Number(els.attackerCountInput.value),
    taskCount: Number(els.taskCountInput.value),
    killCooldown: Number(els.killCooldownInput.value),
    killRange: Number(els.killRangeInput.value),
    discussionTime: Number(els.discussionTimeInput.value),
    votingTime: Number(els.votingTimeInput.value),
    emergencyLimit: Number(els.emergencyLimitInput.value),
    anonymousVotes: els.anonymousVotesInput.checked,
    confirmEjects: els.confirmEjectsInput.checked
  });
}

function applyState(data, options = {}) {
  if (!options.authoritative && isStaleState(data)) return false;
  const previousPhase = state.data?.phase || "";
  const soloJustCompleted = Boolean(
    data.soloMission?.completed &&
    (!state.data || state.data.roomId !== data.roomId || !state.data.soloMission?.completed)
  );
  if (state.pendingSkinId && normalizeSkinId(data.self?.skinId) === state.pendingSkinId) {
    state.pendingSkinId = "";
  }
  if (state.data?.phase === "playing" && data.phase !== "playing") {
    clearMovementInput();
    state.movementActive = false;
    state.movementStopPendingSeq = 0;
    stopVendingHold();
    cancelEnhanceAction();
    cancelThrowTargeting(true);
    els.vendingPanel.hidden = true;
    els.itemControl.hidden = true;
    state.vendingRenderKey = "";
    state.itemRenderKey = "";
    setOperatorBranchesOpen(false);
  }
  if (state.data?.roomId && state.data.roomId !== data.roomId) setExpandedMapOpen(false);
  const borrowedGravityTargetingValid = state.teleportBorrowed && hasDisplayedOperatorAccess(data.self, "gravity");
  if (state.teleportTargeting && (data.phase !== "playing" || (data.self.special !== "teleport" && !borrowedGravityTargetingValid) || !data.self.alive)) {
    state.teleportTargeting = false;
    state.teleportBorrowed = false;
    state.mapPointer = null;
    syncExpandedMapUi();
  }
  if (state.instantWarpTargeting && (data.phase !== "playing" || !data.self.alive || data.self.warpCharges <= 0)) {
    state.instantWarpTargeting = false;
    state.mapPointer = null;
    syncExpandedMapUi();
  }
  if (state.cameraViewIndex >= 0 && (data.phase !== "playing" || data.self.role !== "defender")) {
    state.cameraViewIndex = -1;
  }
  if (state.cameraViewIndex >= 0 && !currentCamera(data)) state.cameraViewIndex = -1;
  if (data.self.drone?.active) {
    const drone = data.self.drone;
    if (!state.renderDrone) state.renderDrone = { x: drone.x, y: drone.y, targetX: drone.x, targetY: drone.y };
    state.renderDrone.targetX = drone.x;
    state.renderDrone.targetY = drone.y;
  } else {
    state.renderDrone = null;
  }
  detectGameSounds(state.data, data);
  detectAttackResult(state.data, data);
  detectLuminousResult(state.data, data);
  detectMysteryResult(state.data, data);
  detectWorldSounds(state.data, data);
  detectHitEffects(state.data, data);
  detectMagicEffects(state.data, data);
  detectKillEffects(state.data, data);
  detectRoomChat(state.data, data);
  updateMotion(data);
  syncRenderPlayers(data);
  if (data.serverNow) {
    state.lastStateServerNow = data.serverNow;
    state.lastStateReceivedAt = performance.now();
  }
  state.data = data;
  if (previousPhase !== data.phase) {
    if (data.phase === "selecting") recordUsageCheckpoint("operator_select");
    else if (data.phase === "playing") recordUsageCheckpoint("battle_started");
    else if (data.phase === "meeting") recordUsageCheckpoint("meeting_started");
    else if (data.phase === "ended") recordUsageCheckpoint("result_reached");
  }
  if (soloJustCompleted) {
    recordSoloMissionCompletion(data.soloMission.id);
    playSound("ranking");
    showToast(`訓練完了: ${data.soloMission.name}`);
  }
  ensureRealtimeConnection();
  syncBgm();
  scheduleUiRender();
  return true;
}

function scheduleUiRender(force = false) {
  if (!UI_RENDER_INTERVAL_MS || force) {
    if (state.uiRenderTimer) window.clearTimeout(state.uiRenderTimer);
    state.uiRenderTimer = 0;
    state.lastUiRenderAt = performance.now();
    render();
    return;
  }
  const elapsed = performance.now() - state.lastUiRenderAt;
  if (elapsed >= UI_RENDER_INTERVAL_MS) {
    state.lastUiRenderAt = performance.now();
    render();
    return;
  }
  if (state.uiRenderTimer) return;
  state.uiRenderTimer = window.setTimeout(() => {
    state.uiRenderTimer = 0;
    state.lastUiRenderAt = performance.now();
    render();
  }, Math.max(1, UI_RENDER_INTERVAL_MS - elapsed));
}

function isStaleState(data) {
  if (!data?.serverNow || (!state.lastStateServerNow && !state.lastMovementServerNow)) return false;
  if (state.data?.roomId && data.roomId !== state.data.roomId) return false;
  return data.serverNow < Math.max(state.lastStateServerNow, state.lastMovementServerNow);
}

function detectAttackResult(previous, next) {
  if (!previous || !next.self.lastAttackResultAt || next.self.lastAttackResultAt <= (previous.self.lastAttackResultAt || 0)) return;
  const messages = {
    lethal: "攻撃成功。対象をキルしました。",
    body: "胴体に命中しました。もう一度攻撃すればキルできます。",
    miss: "攻撃は外れました。",
    moved: "対象が動いたため、忍殺に失敗しました。",
    dodged: "攻撃を回避されました。",
    fighterCountered: "ファイターのキルカウンターを受けました。"
  };
  showToast(messages[next.self.lastAttackResult] || "攻撃結果が確定しました。");
}

function detectLuminousResult(previous, next) {
  if (!previous || !next.self.lastLuminousResultAt || next.self.lastLuminousResultAt <= (previous.self.lastLuminousResultAt || 0)) return;
  const resultClass = next.self.lastLuminousResult === "success" ? "is-success" : "is-failure";
  els.luminousEffectStage?.classList.remove("is-success", "is-failure");
  void els.luminousEffectStage?.offsetWidth;
  els.luminousEffectStage?.classList.add(resultClass);
  if (next.self.lastLuminousResult === "success") {
    playSound("win");
    showToast("ルミナス成功。キル1と大幅な移動速度上昇を獲得しました。");
  } else if (next.self.lastLuminousResult === "failure") {
    playSound("death");
    showToast("ルミナス失敗。代償として死亡しました。");
  }
}

function detectMysteryResult(previous, next) {
  if (!previous || !next.self.lastMysteryResultAt || next.self.lastMysteryResultAt <= (previous.self.lastMysteryResultAt || 0)) return;
  const result = next.self.lastMysteryResult || "効果なし";
  showToast(`ミステリー: ${result}`);
  els.mysteryRevealResult.textContent = result;
  els.mysteryReveal.hidden = false;
  clearTimeout(state.mysteryRevealTimer);
  state.mysteryRevealTimer = setTimeout(() => {
    els.mysteryReveal.hidden = true;
  }, 6000);
}

function isActionBlocked(data = state.data) {
  if (!data) return false;
  const blockedUntil = data.self?.actionBlockedUntil || Math.max(
    Number(data.self?.sleepingUntil) || 0,
    Number(data.self?.unconsciousUntil) || 0
  );
  return blockedUntil > estimatedServerNow(data);
}

function isSensoryBlocked(data = state.data) {
  return Boolean(data && (data.self?.unconsciousUntil || data.self?.sensoryBlockedUntil || 0) > estimatedServerNow(data));
}

function updateSensoryOverlay(data) {
  const blocked = isSensoryBlocked(data);
  els.sensoryOverlay.hidden = !blocked;
  if (!blocked) {
    els.sensoryOverlayText.textContent = "";
    return;
  }
  const liveNow = estimatedServerNow(data);
  const endsAt = data.self.unconsciousUntil;
  els.sensoryOverlayText.textContent = `意識消失 ${Math.max(0, (endsAt - liveNow) / 1000).toFixed(1)}秒`;
}

function detectKillEffects(previous, next) {
  if (!previous) return;
  if (isSensoryBlocked(next)) return;
  const oldBodies = new Set((previous.bodies || []).map((body) => body.id));
  for (const body of next.bodies || []) {
    if (oldBodies.has(body.id)) continue;
    if (!body.showKillCutin) continue;
    startKillEffect({
      id: body.id,
      playerId: body.playerId,
      x: body.x,
      y: body.y,
      name: body.name,
      killerId: body.killerId || "",
      killerName: body.killerName || "",
      killerIsBot: Boolean(body.killerIsBot || body.killerSkinId === "operator"),
      killerSkinId: normalizeKillerSkinId(body.killerSkinId, body.killerIsBot)
    });
  }
}

function detectHitEffects(previous, next) {
  if (!previous || previous.roomId !== next.roomId) return;
  const known = new Set((previous.hitEffects || []).map((effect) => effect.id));
  for (const effect of next.hitEffects || []) {
    if (known.has(effect.id)) continue;
    state.hitEffects.push({
      ...effect,
      startedAt: state.frameNow || performance.now(),
      duration: effect.lethal ? 1100 : 850
    });
    if (effect.playerId === next.selfId) playSound("impact");
  }
}

function detectMagicEffects(previous, next) {
  if (!["playing", "meeting"].includes(next?.phase)) {
    state.magicEffects = [];
    return;
  }
  if (!previous || previous.roomId !== next.roomId) return;
  if (isSensoryBlocked(next)) return;
  const known = new Set((previous.magicEffects || []).map((effect) => effect.id));
  for (const effect of next.magicEffects || []) {
    if (known.has(effect.id)) continue;
    const receivedAt = state.frameNow || performance.now();
    const duration = Math.max(magicEffectDuration(effect.type), Number(effect.durationMs) || 0);
    // Network delay must not consume a visual effect before the client can draw it.
    const startedAt = receivedAt;
    state.magicEffects.push({
      ...effect,
      startedAt,
      duration
    });
    if (effect.type.startsWith("object-") && effect.playerId === next.selfId) {
      const objectType = effect.type.slice("object-".length);
      const object = (next.map?.objects || []).find((entry) => (
        entry.type === objectType && Math.hypot(entry.x - effect.x, entry.y - effect.y) < 4
      ));
      if (object) showToast(`${object.label}: ${object.effectLabel}`);
    }
    const actionKind = magicCharacterActionKind(effect.type);
    if (actionKind && effect.playerId) {
      triggerCharacterAction(
        effect.playerId,
        actionKind,
        CHARACTER_ACTION_DURATION[actionKind] || duration,
        startedAt,
        effect.id,
        effect.variant
      );
    }
  }
}

function magicEffectDuration(type) {
  if (type === "idea-ascension") return 5200;
  if (type === "mystery-reveal") return 2200;
  if (type === "fire") return 1500;
  if (type === "emp-resonance" || type === "emp-cancel") return 1600;
  if (type === "emp-storage-lock") return 7000;
  if (type === "alchemy-railgun") return 900;
  if (type === "alchemy-particle-cannon") return 900;
  if (type === "alchemy-particle-beam") return 420;
  if (type === "quantum-transmutation") return 3600;
  if (type.startsWith("object-")) return 2200;
  if (type.startsWith("idea-")) return 1800;
  return 1200;
}

function startKillEffect(effect) {
  if (state.killEffects.some((item) => item.id === effect.id)) return;
  playSound(effect.playerId === state.playerId ? "death" : "kill");
  const timestamp = state.frameNow || performance.now();
  state.killEffects.push({
    ...effect,
    startedAt: timestamp,
    duration: 1000
  });
}

function detectGameSounds(previous, next) {
  if (!previous || previous.roomId !== next.roomId) return;
  if (isSensoryBlocked(next)) return;
  if (previous.phase !== next.phase) {
    if (next.phase === "selecting") playSound("round");
    if (next.phase === "playing") playSound("start");
    if (next.phase === "meeting") playSound("meeting");
    if (next.phase === "ended") {
      const wonIdea = next.winner === "idea" && next.ideaWinnerId === next.selfId;
      playSound(wonIdea || next.winner === `${next.self.role}s` ? "win" : "lose");
    }
  }
  if (!previous.self.operatorReady && next.self.operatorReady) playSound("select");
  if (previous.self.gunnerWeapon && next.self.gunnerWeapon && previous.self.gunnerWeapon !== next.self.gunnerWeapon) {
    const weapon = (next.self.gunnerWeapons || []).find((entry) => entry.id === next.self.gunnerWeapon);
    playSound("select");
    showToast(`武器切替: ${weapon?.shortName || weapon?.name || next.self.gunnerWeapon}`);
  }
  const previousDone = (previous.self.tasks || []).filter((task) => task.done).length;
  const nextDone = (next.self.tasks || []).filter((task) => task.done).length;
  if (nextDone > previousDone) {
    playSound("task");
  }
  if (next.self.dodgeActiveUntil > previous.self.dodgeActiveUntil) playSound("dodge");
  if ((next.self.teleportReadyAt || 0) > (previous.self.teleportReadyAt || 0)) playSound("teleport");
  if (!previous.sabotage && next.sabotage) playSound("alert");
}

function detectWorldSounds(previous, next) {
  if (!previous || previous.roomId !== next.roomId) return;
  if (isSensoryBlocked(next)) return;
  const known = new Set((previous.sounds || []).map((sound) => sound.id));
  for (const sound of next.sounds || []) {
    if (known.has(sound.id)) continue;
    if (["walk", "dash"].includes(sound.type) && sound.ownerId === next.selfId && sound.sourceKind !== "drone") continue;
    const listener = worldSoundListener(next);
    const dx = listener ? sound.x - listener.x : 0;
    const dy = listener ? sound.y - listener.y : 0;
    const distance = Math.hypot(dx, dy);
    const maxDistance = Math.max(1, Number(sound.maxDistance) || 1000);
    if (distance > maxDistance) continue;
    const volume = clamp(1 - distance / maxDistance, 0, 1) * clamp(Number(sound.volume) || 1, 0, 1.25);
    if (volume <= 0.01) continue;
    const kind = {
      gunshot: "gunshot",
      heartTeleportReveal: "teleport",
      emp: "emp",
      dash: "worldDash",
      walk: "worldStep",
      drone: "worldDrone",
      fireJutsu: "fireJutsu",
      jump: "worldDash",
      "fighter-iaido": "fighterCounter",
      fighterSlash: "fighterCounter",
      substitution: "substitution",
      fighterCounter: "fighterCounter",
      object: "object"
    }[sound.type];
    if (!kind) continue;
    const characterActionKind = {
      gunshot: "shoot",
      fireJutsu: "cast",
      "fighter-iaido": "slash",
      fighterSlash: "slash",
      substitution: "evade",
      fighterCounter: "slash",
      object: null
    }[sound.type];
    if (characterActionKind && sound.ownerId) {
      triggerCharacterAction(
        sound.ownerId,
        characterActionKind,
        CHARACTER_ACTION_DURATION[characterActionKind],
        state.frameNow || performance.now(),
        sound.id,
        sound.variant
      );
    }
    playSound(kind, {
      pan: clamp(dx / Math.max(240, maxDistance * 0.45), -1, 1),
      volume,
      variant: sound.variant || "",
      spatial: {
        x: clamp(dx / maxDistance, -1, 1) * 4,
        y: 0,
        z: clamp(dy / maxDistance, -1, 1) * 4
      }
    });
    // Gunshots remain spatial audio only. Heart teleport intentionally reveals
    // a position, but firearm use must not create an exact minimap marker.
    if (sound.type === "heartTeleportReveal") {
      state.worldSoundEffects.push({
        ...sound,
        startedAt: state.frameNow || performance.now(),
        duration: 2200
      });
    }
  }
}

function worldSoundListener(data) {
  const camera = currentCamera(data);
  if (camera) return camera;
  if (data.self.drone?.active) return state.renderDrone || data.self.drone;
  const self = data.players.find((player) => player.id === data.selfId);
  return self ? renderedPlayer(self) : null;
}

function updateMotion(nextData) {
  const timestamp = performance.now();
  const previous = new Map((state.data?.players || []).map((player) => [player.id, player]));
  const seen = new Set();
  for (const player of nextData.players || []) {
    seen.add(player.id);
    const last = previous.get(player.id);
    const current = state.motion.get(player.id) || { dx: 0, dy: 1, moving: false, changedAt: timestamp };
    if (!last) {
      state.motion.set(player.id, current);
      continue;
    }
    const serverMovement = Math.hypot(Number(player.moveX) || 0, Number(player.moveY) || 0);
    if (player.moving && serverMovement > 0.01) {
      state.motion.set(player.id, {
        dx: player.moveX / serverMovement,
        dy: player.moveY / serverMovement,
        moving: true,
        changedAt: timestamp
      });
    } else {
      state.motion.set(player.id, { ...current, moving: false, changedAt: timestamp });
    }
  }
  for (const id of state.motion.keys()) {
    if (!seen.has(id)) {
      state.motion.delete(id);
      state.facing.delete(id);
      state.walkAnimations.delete(id);
    }
  }
}

function localMovementPredictionPending() {
  return state.movementActive || state.movementStopPendingSeq > state.lastMoveAppliedSeq;
}

function isStaleSelfMovementState(player, nextData) {
  if (player?.id !== nextData?.selfId) return false;
  if (String(player.movementSession || "") !== state.movementSession) {
    return localMovementPredictionPending();
  }
  return Number(player.movementSeq) < state.lastMoveAppliedSeq ||
    Number(player.movementClock) < state.lastMoveAppliedClock;
}

function syncRenderPlayers(nextData) {
  const timestamp = performance.now();
  const seen = new Set();
  for (const player of nextData.players || []) {
    seen.add(player.id);
    const current = state.renderPlayers.get(player.id);
    if (!current) {
      const jumpMotion = player.jumpMotion;
      const jumpActive = jumpMotion && Number(jumpMotion.endsAt) > estimatedServerNow(nextData);
      state.renderPlayers.set(player.id, {
        x: jumpActive ? Number(jumpMotion.fromX) : player.x,
        y: jumpActive ? Number(jumpMotion.fromY) : player.y,
        targetX: player.x,
        targetY: player.y,
        roomId: nextData.roomId,
        phase: nextData.phase,
        alive: player.alive,
        ejected: player.ejected,
        isBot: player.isBot,
        moveX: player.moveX || 0,
        moveY: player.moveY || 0,
        moving: Boolean(player.moving),
        speedMultiplier: Math.max(0.01, Number(player.speedMultiplier) || 1),
        predictionLeadMultiplier: Math.max(0.01, Number(player.speedMultiplier) || 1),
        predictionLeadUntil: 0,
        velocityX: 0,
        velocityY: 0,
        jumpHeight: 0,
        jumpMotionStartedAt: jumpActive ? Number(jumpMotion.startedAt) : 0,
        jumpMotionCompletedAt: 0,
        updatedAt: timestamp
      });
      continue;
    }

    const jump = Math.hypot(player.x - current.x, player.y - current.y);
    const jumpActive = player.jumpMotion && Number(player.jumpMotion.endsAt) > estimatedServerNow(nextData);
    const staleSelfMovement = isStaleSelfMovementState(player, nextData);
    const isLocallyPredictedSelf = player.id === nextData.selfId && (
      localMovementPredictionPending() || staleSelfMovement
    );
    const shouldSnap =
      current.roomId !== nextData.roomId ||
      current.phase !== nextData.phase ||
      current.alive !== player.alive ||
      current.ejected !== player.ejected ||
      player.inVent ||
      (jump > 360 && !jumpActive && !isLocallyPredictedSelf);

    if (jumpActive && current.jumpMotionStartedAt !== Number(player.jumpMotion.startedAt)) {
      current.x = Number(player.jumpMotion.fromX);
      current.y = Number(player.jumpMotion.fromY);
      current.velocityX = 0;
      current.velocityY = 0;
      current.jumpMotionStartedAt = Number(player.jumpMotion.startedAt);
      current.jumpMotionCompletedAt = 0;
    }

    const nextSpeedMultiplier = Math.max(0.01, Number(player.speedMultiplier) || 1);
    const previousSpeedMultiplier = Math.max(0.01, Number(current.speedMultiplier) || nextSpeedMultiplier);
    if (isLocallyPredictedSelf && previousSpeedMultiplier > nextSpeedMultiplier + 0.05) {
      current.predictionLeadMultiplier = Math.max(
        Number(current.predictionLeadMultiplier) || 1,
        previousSpeedMultiplier
      );
      current.predictionLeadUntil = timestamp + 360;
    } else if (timestamp >= (Number(current.predictionLeadUntil) || 0)) {
      current.predictionLeadMultiplier = nextSpeedMultiplier;
    }
    current.speedMultiplier = nextSpeedMultiplier;
    // Movement acknowledgements are newer than some full-state frames. Keep a
    // stale frame from pulling the locally predicted player backward.
    if (jumpActive) {
      current.targetX = Number(player.jumpMotion.toX);
      current.targetY = Number(player.jumpMotion.toY);
    } else if (!isLocallyPredictedSelf) {
      current.targetX = player.x;
      current.targetY = player.y;
    }
    if (shouldSnap) {
      current.x = player.x;
      current.y = player.y;
      current.velocityX = 0;
      current.velocityY = 0;
    }
    current.roomId = nextData.roomId;
    current.phase = nextData.phase;
    current.alive = player.alive;
    current.ejected = player.ejected;
    current.isBot = player.isBot;
    current.moveX = player.moveX || 0;
    current.moveY = player.moveY || 0;
    current.moving = Boolean(player.moving);
    current.updatedAt = timestamp;
  }

  for (const id of state.renderPlayers.keys()) {
    if (!seen.has(id)) state.renderPlayers.delete(id);
  }
}

function advanceRenderPlayers(data) {
  const dt = state.frameDelta || 16.67;
  const timestamp = performance.now();
  for (const [playerId, current] of state.renderPlayers) {
    const player = data.players.find((entry) => entry.id === playerId);
    if (!player) continue;
    const isSelf = playerId === data.selfId && !data.self.drone?.active;
    const localDirection = isSelf ? getDirection() : null;
    const moving = isSelf
      ? Boolean(localDirection.dx || localDirection.dy)
      : current.moving;
    const directionX = isSelf ? localDirection.dx : current.moveX;
    const directionY = isSelf ? localDirection.dy : current.moveY;
    const selfCanDash = isSelf && isDashing() && data.self.stamina > 0.5;
    const movementMode = isSelf ? (selfCanDash ? "dash" : isSlowWalking() ? "slow" : "walk") : player.movementMode;
    const modeMultiplier = movementMode === "dash" ? 1.75 : movementMode === "slow" ? 0.52 : 1;
    const baseSpeed = player.alive
      ? data.map.speed * (player.speedMultiplier || (playerId === data.selfId ? data.self.speedMultiplier : 1) || 1)
      : data.map.ghostSpeed;
    const speed = baseSpeed * modeMultiplier;
    const predictionLeadMultiplier = timestamp < (Number(current.predictionLeadUntil) || 0)
      ? Math.max(Number(current.predictionLeadMultiplier) || 1, Number(player.speedMultiplier) || 1)
      : Math.max(0.01, Number(player.speedMultiplier) || 1);
    const leadAllowanceSpeed = player.alive
      ? data.map.speed * predictionLeadMultiplier * modeMultiplier
      : speed;
    const radius = player.alive ? data.map.playerRadius : 8;

    const jumpMotion = player.jumpMotion;
    const serverNow = estimatedServerNow(data);
    if (jumpMotion && Number(jumpMotion.endsAt) > serverNow) {
      const duration = Math.max(1, Number(jumpMotion.endsAt) - Number(jumpMotion.startedAt));
      const progress = clamp((serverNow - Number(jumpMotion.startedAt)) / duration, 0, 1);
      const eased = progress * progress * (3 - 2 * progress);
      current.x = Number(jumpMotion.fromX) + (Number(jumpMotion.toX) - Number(jumpMotion.fromX)) * eased;
      current.y = Number(jumpMotion.fromY) + (Number(jumpMotion.toY) - Number(jumpMotion.fromY)) * eased;
      current.jumpHeight = Math.sin(Math.PI * progress) * Math.min(190, 34 + Math.sqrt(Math.max(0, Number(jumpMotion.distance) || 0)) * 3.2);
      current.velocityX = 0;
      current.velocityY = 0;
      continue;
    }
    if (
      jumpMotion &&
      Number(jumpMotion.startedAt) > 0 &&
      Number(current.jumpMotionCompletedAt) !== Number(jumpMotion.startedAt)
    ) {
      current.x = Number(jumpMotion.toX);
      current.y = Number(jumpMotion.toY);
      current.targetX = Number(jumpMotion.toX);
      current.targetY = Number(jumpMotion.toY);
      current.velocityX = 0;
      current.velocityY = 0;
      current.jumpMotionCompletedAt = Number(jumpMotion.startedAt);
    }
    current.jumpHeight = 0;
    current.jumpMotionStartedAt = 0;

    if (isSelf && moving) {
      const advanced = DVARuntime.advanceCollisionAwarePosition({
        x: current.x,
        y: current.y,
        directionX,
        directionY,
        speed,
        deltaMs: dt,
        maxStep: 8,
        canOccupy: (x, y) => isClientMovementAllowed(data, player, x, y, radius)
      });
      current.x = advanced.x;
      current.y = advanced.y;
      const correctionX = current.targetX - current.x;
      const correctionY = current.targetY - current.y;
      const correctionDistance = Math.hypot(correctionX, correctionY);
      // Ignore sub-pixel acknowledgements. Correcting those every frame makes
      // diagonal input visibly tremble even though the server position is fine.
      if (correctionDistance > 3) {
        const reconciled = DVARuntime.reconcilePredictedMovement({
          x: current.x,
          y: current.y,
          targetX: current.targetX,
          targetY: current.targetY,
          directionX,
          directionY,
          speed,
          leadAllowanceSpeed,
          deltaMs: dt,
          allowBackwardCorrection: false
        });
        current.x = reconciled.x;
        current.y = reconciled.y;
        if (reconciled.snapped) {
          current.velocityX = 0;
          current.velocityY = 0;
        }
      }
      continue;
    }

    // Releasing input is locally authoritative until the server acknowledges
    // the stop timestamp. Holding the predicted point prevents a stale room
    // snapshot from pulling the character back during that round trip.
    if (isSelf && localMovementPredictionPending()) {
      current.velocityX = 0;
      current.velocityY = 0;
      continue;
    }

    const predictionWindow = 180;
    const elapsed = moving ? clamp(timestamp - current.updatedAt, 0, predictionWindow) / 1000 : 0;
    let predictedX = current.targetX + directionX * speed * elapsed;
    let predictedY = current.targetY + directionY * speed * elapsed;
    if (!isClientMovementAllowed(data, player, predictedX, predictedY, radius)) {
      predictedX = current.targetX;
      predictedY = current.targetY;
    }
    const dx = predictedX - current.x;
    const dy = predictedY - current.y;
    if (Math.hypot(dx, dy) > 360) {
      current.x = predictedX;
      current.y = predictedY;
      continue;
    }
    const smoothing = moving ? 0.065 : 0.085;
    const smoothedX = smoothDamp(current.x, predictedX, current.velocityX || 0, smoothing, dt / 1000);
    const smoothedY = smoothDamp(current.y, predictedY, current.velocityY || 0, smoothing, dt / 1000);
    current.x = smoothedX.value;
    current.y = smoothedY.value;
    current.velocityX = smoothedX.velocity;
    current.velocityY = smoothedY.velocity;
  }
}

function smoothDamp(current, target, velocity, smoothTime, deltaSeconds) {
  const time = Math.max(0.025, smoothTime);
  const delta = clamp(deltaSeconds, 0.001, 0.05);
  const omega = 2 / time;
  const x = omega * delta;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = current - target;
  const temporary = (velocity + omega * change) * delta;
  return {
    value: target + (change + temporary) * decay,
    velocity: (velocity - omega * temporary) * decay
  };
}

function advanceRenderDrone(data) {
  if (!data.self.drone?.active || !state.renderDrone) return;
  const dt = state.frameDelta || 16.67;
  const direction = getDirection();
  const moving = direction.dx || direction.dy;
  if (moving && state.cameraViewIndex < 0) {
    const modeMultiplier = isDashing() ? 1.75 : isSlowWalking() ? 0.52 : 1;
    const speed = data.map.speed * 0.9 * modeMultiplier;
    const step = speed * Math.min(dt, 100) / 1000;
    state.renderDrone.x = clamp(state.renderDrone.x + direction.dx * step, 8, data.map.width - 8);
    state.renderDrone.y = clamp(state.renderDrone.y + direction.dy * step, 8, data.map.height - 8);
  }
  const correctionX = state.renderDrone.targetX - state.renderDrone.x;
  const correctionY = state.renderDrone.targetY - state.renderDrone.y;
  const smoothedX = smoothDamp(state.renderDrone.x, state.renderDrone.x + correctionX, state.renderDrone.velocityX || 0, 0.065, dt / 1000);
  const smoothedY = smoothDamp(state.renderDrone.y, state.renderDrone.y + correctionY, state.renderDrone.velocityY || 0, 0.065, dt / 1000);
  state.renderDrone.x = smoothedX.value;
  state.renderDrone.y = smoothedY.value;
  state.renderDrone.velocityX = smoothedX.velocity;
  state.renderDrone.velocityY = smoothedY.velocity;
}

function isClientWalkable(data, x, y, radius) {
  if (x < radius || y < radius || x > data.map.width - radius || y > data.map.height - radius) return false;
  const seam = Math.max(radius, 32);
  const corridorAreas = data.map.corridors.flatMap((corridor) => corridorRenderSegments(corridor));
  const inArea = [...data.map.rooms, ...corridorAreas].some((rect) => (
    x >= rect.x - seam && x <= rect.x + rect.w + seam &&
    y >= rect.y - seam && y <= rect.y + rect.h + seam
  ));
  if (!inArea) return false;
  return !data.map.doors.some((door) => (
    data.activeDoorIds.includes(door.id) &&
    x >= door.x - 6 && x <= door.x + door.w + 6 &&
    y >= door.y - 6 && y <= door.y + door.h + 6
  ));
}

function isClientMovementAllowed(data, player, x, y, radius) {
  const insideMap = x >= radius && y >= radius && x <= data.map.width - radius && y <= data.map.height - radius;
  if (!insideMap) return false;
  const liveNow = estimatedServerNow(data);
  const levitating = Boolean(
    player?.levitationActive ||
    (player?.id === data.selfId && data.self?.levitationActive)
  );
  const accelerationPhasing = Boolean(
    player?.accelerationPhasing ||
    (player?.id === data.selfId && data.self?.accelerationPhasing)
  );
  return accelerationPhasing || levitating || !player?.alive || isClientWalkable(data, x, y, radius);
}

function renderedPlayer(player) {
  const current = state.renderPlayers.get(player.id);
  if (!current) return player;
  return { ...player, x: current.x, y: current.y, jumpHeight: current.jumpHeight || 0 };
}

function render() {
  const data = state.data;
  const offlineContext = state.offlineMode || (!data && !state.onlineAvailable);
  updateSensoryOverlay(data);
  els.soloMissionHud.hidden = !data?.soloMission;
  if (data?.soloMission) {
    els.soloMissionHudName.textContent = data.soloMission.name;
    els.soloMissionHudProgress.textContent = data.soloMission.completed
      ? "訓練完了"
      : `${data.soloMission.objective} / ${data.soloMission.progress}`;
  }
  const phaseUiKey = data ? `${data.roomId}:${data.phase}` : "disconnected";
  if (state.phaseUiKey !== phaseUiKey) {
    state.phaseUiKey = phaseUiKey;
    els.joinPanel.hidden = Boolean(data);
    els.lobbyPanel.hidden = !data || data.phase !== "lobby";
    els.selectPanel.hidden = !data || data.phase !== "selecting";
    els.statusPanel.hidden = !data || data.phase === "lobby" || data.phase === "selecting";
    els.meetingPanel.hidden = !data || data.phase !== "meeting";
    if (data?.phase === "playing" && tabletModePreferenceEnabled()) {
      requestAnimationFrame(() => setTabletOpen(true, { persist: false, focus: false }));
    }
  }
  state.fieldFeedOpen = Boolean(data && data.phase === "meeting");
  els.fieldFeedPanel.hidden = !state.fieldFeedOpen;
  els.leaveRoomButton.hidden = !data;
  els.tabletButton.hidden = false;
  els.tabletButton.disabled = !data || data.phase !== "playing";
  els.gameMuteButton.hidden = false;
  if (els.tabletButton.disabled && state.tabletOpen) {
    setTabletOpen(false, { persist: false, focus: false });
  }
  els.fieldLowerRow.hidden = !data || !["playing", "meeting"].includes(data.phase);

  if (!data) {
    els.endOverlay.hidden = true;
    if (state.expandedMapOpen) setExpandedMapOpen(false);
    syncKeyboardContext();
    return;
  }

  renderEnd(data);
  renderLobby(data);
  renderOperatorSelect(data);
  renderStatus(data);
  renderMeeting(data);
  renderFeeds(data);
  syncKeyboardContext();
}

function phaseLabel(phase) {
  if (phase === "lobby") return "オンラインロビー";
  if (phase === "selecting") return "オペレーター選択";
  if (phase === "playing") return "バトル";
  if (phase === "meeting") return "会議";
  if (phase === "ended") return "試合終了";
  return phase;
}

function formatBattleTime(data) {
  const elapsedSeconds = Math.max(0, Math.floor((estimatedServerNow(data) - (data.battleStartedAt || estimatedServerNow(data))) / 1000));
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function renderRoomList(rooms) {
  const renderKey = JSON.stringify(rooms.map((room) => [
    room.id,
    room.host,
    room.hostKillRate,
    room.phase,
    room.players,
    room.humans,
    room.availableSlots,
    room.midJoinAvailable,
    room.joinable
  ]));
  if (state.roomListKey === renderKey) return;
  state.roomListKey = renderKey;
  els.roomList.innerHTML = "";
  rooms.forEach((room) => {
    const card = document.createElement("button");
    card.className = `room-card${room.midJoinAvailable ? " is-mid-join" : ""}`;
    card.type = "button";
    card.disabled = room.joinable === false;
    const phaseText = room.midJoinAvailable
      ? `途中参加可 / 空き${room.availableSlots}`
      : room.joinable === false
        ? `${phaseLabel(room.phase)} / 参加不可`
        : phaseLabel(room.phase);
    card.innerHTML = `
      <span class="room-meta">
        <span class="name-line">${escapeHtml(room.id)} / ${escapeHtml(playerIdentityLabel({ name: room.host, killRate: room.hostKillRate }))}</span>
        <span class="sub-line">${escapeHtml(room.map)} · ${room.humans ?? room.players}/${room.players}人 · ${escapeHtml(phaseText)}</span>
      </span>
      ${room.midJoinAvailable ? '<span class="room-join-badge">途中参加</span>' : ""}
    `;
    card.addEventListener("click", () => {
      els.roomInput.value = room.id;
    });
    els.roomList.appendChild(card);
  });
}

function renderLobby(data) {
  if (data.phase !== "lobby") return;
  const isHost = data.hostId === state.playerId;
  els.hostBadge.hidden = !isHost;
  els.addBotButton.disabled = !isHost;
  els.startButton.disabled = !isHost;
  els.settingsPanel.querySelectorAll("input, select").forEach((input) => {
    input.disabled = !isHost;
  });
  els.anonymousVotesInput.disabled = !isHost;
  els.confirmEjectsInput.disabled = !isHost;
  fillMapSelect(data);
  const s = data.settings;
  setInputValue(els.mapSelect, s.mapId);
  setInputValue(els.hostTeamSelect, s.hostTeam || "random");
  setInputValue(els.attackerCountInput, s.attackerCount);
  setInputValue(els.taskCountInput, s.taskCount);
  setInputValue(els.killCooldownInput, s.killCooldown);
  setInputValue(els.killRangeInput, s.killRange);
  setInputValue(els.discussionTimeInput, s.discussionTime);
  setInputValue(els.votingTimeInput, s.votingTime);
  setInputValue(els.emergencyLimitInput, s.emergencyLimit);
  els.anonymousVotesInput.checked = Boolean(s.anonymousVotes);
  els.confirmEjectsInput.checked = Boolean(s.confirmEjects);

  els.lobbyList.innerHTML = "";
  let kickHotkeyIndex = 0;
  data.players.forEach((player) => {
    const skinId = displayedSkinId(player, data);
    const displayedRole = roleLabels[player.role] || (player.role === "unassigned" ? "" : player.role);
    const item = document.createElement("li");
    item.innerHTML = `
      <span class="color-dot" style="background:${player.color}"></span>
      <span class="player-meta">
        <span class="name-line">${escapeHtml(playerIdentityLabel(player))}${player.host ? " / ホスト" : ""}</span>
        ${player.isBot ? "" : `<span class="sub-line">${skinId === "blue-dress" ? "青白ドレス" : "白フード"}</span>`}
      </span>
      ${displayedRole ? `<span class="badge">${escapeHtml(displayedRole)}</span>` : ""}
    `;
    if (isHost && player.id !== data.selfId) {
      kickHotkeyIndex += 1;
      const kickButton = document.createElement("button");
      kickButton.type = "button";
      kickButton.className = "lobby-kick-button";
      kickButton.textContent = kickHotkeyIndex <= 9 ? `退出 [Shift+${kickHotkeyIndex}]` : "退出";
      kickButton.title = `${player.name}を退出させる`;
      if (kickHotkeyIndex <= 9) kickButton.dataset.kickHotkey = String(kickHotkeyIndex);
      kickButton.addEventListener("click", () => {
        api("/api/kick", { targetId: player.id });
      });
      item.appendChild(kickButton);
    }
    els.lobbyList.appendChild(item);
  });
  const ownPlayer = data.players.find((player) => player.id === data.selfId);
  if (ownPlayer && document.activeElement !== els.skinSelect) {
    els.skinSelect.value = state.pendingSkinId || normalizeSkinId(ownPlayer.skinId);
  }
}

function renderOperatorSelect(data) {
  if (data.phase !== "selecting") return;
  const self = data.self;
  const role = roleLabels[self.role] || self.role;
  const isTurn = state.offlineMode
    ? !self.operatorReady
    : data.operatorTurnPlayerId === self.id;
  const turnLabel = `${data.operatorTurnPosition || 0} / ${data.operatorTurnTotal || 0}`;
  els.selectTimer.textContent = `${turnLabel} ・ ${data.operatorSelectSecondsLeft || 0}秒`;
  if (self.operatorReady) {
    els.selectTeamText.textContent = `${role} を選択済みです。${data.operatorTurnName || "次のプレイヤー"}の選択を待っています。`;
  } else if (isTurn) {
    els.selectTeamText.textContent = `あなたの選択順です。${role}として使用するオペレーターを選択してください。全オペレーターを選択できます。`;
  } else {
    els.selectTeamText.textContent = `${data.operatorTurnName || "前のプレイヤー"}の選択を待っています。`;
  }
  const roleOperators = data.operators?.[self.role] || [];
  const operators = roleOperators.length > 0
    ? roleOperators
    : [...new Map(
        Object.values(data.operators || {})
          .flat()
          .map((operator) => [operator.special || operator.id, operator])
      ).values()];
  const renderKey = JSON.stringify({
    role: self.role,
    isTurn,
    ready: self.operatorReady,
    selected: self.operatorId,
    operators: operators.map((operator) => [operator.id, operator.taken, operator.limit])
  });
  if (state.operatorRenderKey === renderKey) return;
  state.operatorRenderKey = renderKey;
  els.operatorList.innerHTML = "";
  els.operatorDetail.hidden = operators.length === 0;

  const showOperatorDetail = (operator) => {
    if (!operator) return;
    els.operatorList.querySelectorAll(".operator-card").forEach((card) => {
      card.classList.toggle("detail-active", card.dataset.operatorId === operator.id);
    });
    els.operatorDetail.innerHTML = `
      <div class="operator-detail-head">
        <strong>${escapeHtml(operator.name)}</strong>
      </div>
      <p>${escapeHtml(operator.details || operator.description)}</p>
    `;
  };

  operators.forEach((operator, operatorIndex) => {
    const selected = self.operatorId === operator.id;
    const available = selected || operator.taken < operator.limit;
    const button = document.createElement("button");
    button.className = `operator-card${selected ? " selected" : ""}${operator.asset ? " has-visual" : ""}`;
    button.type = "button";
    button.dataset.operatorId = operator.id;
    if (operatorIndex < 9) button.dataset.hotkey = String(operatorIndex + 1);
    button.disabled = !isTurn || self.operatorReady || !available;
    button.innerHTML = `
      ${operator.asset ? `<span class="operator-visual operator-visual-${escapeHtml(operator.asset)}" aria-hidden="true"></span>` : ""}
      <span class="operator-meta">
        <span class="name-line">${escapeHtml(operator.name)}</span>
      </span>
      <span class="badge">${operator.taken} / ${operator.limit >= 99 ? "∞" : operator.limit}</span>
    `;
    button.addEventListener("pointerenter", () => showOperatorDetail(operator));
    button.addEventListener("focus", () => showOperatorDetail(operator));
    button.addEventListener("click", () => selectOperatorFromCard(operator));
    els.operatorList.appendChild(button);
  });

  showOperatorDetail(operators.find((operator) => operator.id === self.operatorId) || operators[0]);
}

async function selectOperatorFromCard(operator) {
  if (!operator || !state.roomId || !state.playerId) return false;
  const body = {
    roomId: state.roomId,
    playerId: state.playerId,
    operatorId: operator.id,
    operatorSpecial: operator.special
  };
  let result = await request("/api/operator", body, { quiet: state.offlineMode });
  if (!result && state.offlineMode && operator.special) {
    result = await request("/api/operator", {
      ...body,
      operatorId: ""
    }, { quiet: true, forceOffline: true });
  }
  if (!result) {
    showToast("そのオペレーターは選択できません。画面を再読み込みしてください。");
    return false;
  }
  applyState(result);
  return true;
}

function fillMapSelect(data) {
  const currentOptions = [...els.mapSelect.options].map((option) => option.value).join(",");
  const nextOptions = (data.availableMaps || []).map((map) => map.id).join(",");
  if (currentOptions === nextOptions) return;
  els.mapSelect.innerHTML = "";
  (data.availableMaps || []).forEach((map) => {
    const option = document.createElement("option");
    option.value = map.id;
    option.textContent = map.label;
    els.mapSelect.appendChild(option);
  });
}

function setInputValue(input, value) {
  if (document.activeElement === input) return;
  input.value = value;
}

function renderTargetOptions(data) {
  const self = data.self;
  const modeOptions = {
    teleport: [["body", "転移・地点"], ["near", "転移・対象付近"], ["heart", "心臓"], ["accelerate", "アクセラレート"], ["decelerate", "ディーセラレート"], ["storm", "グラビティストーム"]],
    gravity: [["body", "転移・地点"], ["near", "転移・対象付近"], ["heart", "心臓"], ["accelerate", "アクセラレート"], ["decelerate", "ディーセラレート"], ["storm", "グラビティストーム"]],
    flora: [["heal", "回復"], ["sunbeam", "サンビーム・放射"], ["sunbeam-converged", "サンビーム・収束"]],
    gunner: [["hover-sprint", "ホバースプリント"]],
    quantum: [["transmute-mercury", "水銀→金"], ["transmute-lead", "鉛→金"], ["cool-water", "水→氷"], ["heat-water", "水→高温水"], ["fission-uranium", "ウラン核分裂"], ["fission-plutonium", "プルトニウム核分裂"]]
  };
  const selectedAlchemy = alchemyRecipes.find((recipe) => recipe.id === els.alchemySelect.value);
  const borrowedOperator = selectedBorrowedOperator();
  const modeOwner = borrowedOperator || self.special;
  els.teleportTargetSelect.dataset.ownerKey = modeOwner;
  const options = modeOptions[modeOwner] || [];
  const alchemyTargetVisible = self.special === "alchemist" &&
    (els.alchemySelect.value === "revive" || els.alchemySelect.value.startsWith("hack-"));
  const controlVisible = data.phase === "playing" && (options.length > 1 || alchemyTargetVisible) && self.alive && !self.ejected;
  els.teleportControl.hidden = !controlVisible;
  els.teleportModeSelect.closest("label").hidden = !options.length;
  els.teleportTargetSelect.closest("label").hidden = !alchemyTargetVisible &&
    !["teleport", "gravity"].includes(modeOwner);
  els.empPhaseControl.hidden = data.phase !== "playing" || !self.alive || self.ejected;
  if (!controlVisible && self.special !== "alchemist") return;

  const modeKey = options.map((option) => option[0]).join("|");
  if (options.length && els.teleportModeSelect.dataset.specialKey !== `${modeOwner}:${modeKey}`) {
    const previousMode = els.teleportModeSelect.value;
    els.teleportModeSelect.dataset.specialKey = `${modeOwner}:${modeKey}`;
    els.teleportModeSelect.innerHTML = options.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
    const rememberedMode = borrowedOperator ? state.borrowedAbilityModes[borrowedOperator] : "";
    const defaultMode = modeOwner === "teleport" || modeOwner === "gravity" ? "accelerate" : options[0]?.[0];
    els.teleportModeSelect.value = options.some(([value]) => value === rememberedMode)
      ? rememberedMode
      : options.some(([value]) => value === previousMode)
        ? previousMode
        : defaultMode;
    rememberSelectedOperatorMode();
  }

  const includeDead = self.special === "alchemist" && els.alchemySelect.value === "revive";
  const hackerTargeting = self.special === "alchemist" && els.alchemySelect.value.startsWith("hack-");
  const targets = data.players.filter((player) => includeDead
    ? !player.alive && !player.ejected
    : player.alive && !player.ejected && !player.inVent && (!hackerTargeting || player.id !== self.id));
  const previous = els.teleportTargetSelect.value || self.id;
  const key = targets.map((player) => `${player.id}:${player.name}`).join("|");
  if (els.teleportTargetSelect.dataset.key !== key) {
    els.teleportTargetSelect.dataset.key = key;
    els.teleportTargetSelect.innerHTML = "";
    targets.forEach((player) => {
      const option = document.createElement("option");
      option.value = player.id;
      option.textContent = player.id === self.id ? `${playerIdentityLabel(player)} (自分)` : playerIdentityLabel(player);
      els.teleportTargetSelect.appendChild(option);
    });
    const fallback = targets.find((player) => player.id !== self.id)?.id || targets[0]?.id || "";
    els.teleportTargetSelect.value = targets.some((player) => player.id === previous) ? previous : fallback;
  }
  if (self.special === "teleport" || borrowedOperator === "gravity") ensureTeleportTargetForMode(data);
}

function ensureTeleportTargetForMode(data) {
  if (!data?.self) return;
  const mode = els.teleportModeSelect.value;
  if (["body", "accelerate"].includes(mode) && [...els.teleportTargetSelect.options].some((option) => option.value === data.self.id)) {
    els.teleportTargetSelect.value = data.self.id;
    return;
  }
  if (!["heart", "near"].includes(mode) || els.teleportTargetSelect.value !== data.self.id) return;
  const otherTarget = [...els.teleportTargetSelect.options].find((option) => option.value !== data.self.id);
  if (otherTarget) els.teleportTargetSelect.value = otherTarget.value;
}

function renderStatus(data) {
  if (data.phase === "lobby" || data.phase === "selecting") {
    els.activeEffectsPanel.hidden = true;
    els.itemControl.hidden = true;
    state.itemRenderKey = "";
    return;
  }
  const self = data.self;
  const role = roleLabels[self.role] || self.role;
  els.roleName.textContent = role;
  els.roleName.style.color = self.role === "attacker" ? "#fca5a5" : "#7dd3fc";
  els.specialName.textContent = self.special ? specialLabels[self.special] || self.special : "通常";
  els.specialName.hidden = !self.special;

  renderActiveEffects(data);
  els.objectiveText.textContent = objectiveText(data);

  if (data.sabotage) {
    const time = data.sabotage.secondsLeft == null ? "" : ` / ${data.sabotage.secondsLeft}秒`;
    els.sabotageAlert.hidden = false;
    els.sabotageAlert.textContent = `${sabotageLabels[data.sabotage.type] || data.sabotage.type} 発生中${time}`;
  } else if (data.activeDoorIds?.length) {
    els.sabotageAlert.hidden = false;
    els.sabotageAlert.textContent = `閉鎖ドア: ${data.activeDoorIds.length}`;
  } else {
    els.sabotageAlert.hidden = true;
  }

  els.sabotageControl.hidden = data.phase !== "playing" || self.role !== "attacker";
  els.alchemyControl.hidden = true;
  syncAlchemyInventoryChoices(self);
  renderTargetOptions(data);
  renderUtility(data);
  renderVending(data);
  updateActionButtons(data);
  renderHackerAbilityDock(data);
  renderItemControl(data);
}

function collectInventoryDisplayItems(self) {
  const chargeDescriptions = {
    "fire-jutsu": VENDING_PRODUCT_DESCRIPTIONS.fire,
    "instant-warp": VENDING_PRODUCT_DESCRIPTIONS.warp
  };
  const regularItems = (Array.isArray(self.itemInventory) ? self.itemInventory : []).filter((item) =>
    item && (!item.kind || ["item", "charge"].includes(item.kind)) && typeof item.id === "string" && item.id.length > 0 && Number(item.amount) > 0 && item.usable !== false
  ).map((item) => ({
    ...item,
    inventoryKind: item.kind === "charge" ? "charge" : "item",
    output: item.kind === "charge" ? "消耗品" : "所持品",
    detail: chargeDescriptions[item.id] || VENDING_PRODUCT_DESCRIPTIONS[item.id] || alchemyRecipes.find((entry) => entry.id === item.id || entry.id === `vending-${item.id}`)?.output || "使用・投擲できる所持品",
    badge: `×${Number(item.amount) || 1}`
  }));
  const gunnerAccess = hasDisplayedOperatorAccess(self, "gunner") || (self.purchasedWeapons || []).length > 0;
  const weaponItems = gunnerAccess
    ? (Array.isArray(self.gunnerWeapons) ? self.gunnerWeapons : [])
      .filter((weapon) => weapon.available !== false)
      .map((weapon) => ({
        id: `weapon:${weapon.id}`,
        sourceId: weapon.id,
        label: weapon.name,
        asset: weapon.id,
        inventoryKind: "weapon",
        output: `${Number(weapon.ammo) || 0}/${Number(weapon.maxAmmo) || 0}発`,
        detail: `${VENDING_PRODUCT_DESCRIPTIONS[weapon.id] || "銃器"}。射程${Math.round(Number(weapon.range) || 0)}、威力${Number(weapon.damage).toFixed(2)}。使用を長押しすると持続射撃し、停止後は自動リロードする。投擲すると武器を失う`,
        badge: weapon.id === self.gunnerWeapon ? "選択中" : ""
      }))
    : [];
  const inventionNames = { railgun: "レールガン", "particle-cannon": "荷電粒子砲", excalibur: "エクスカリバー" };
  const inventionCounts = (self.inventions || []).reduce((counts, id) => {
    counts[id] = (counts[id] || 0) + 1;
    return counts;
  }, {});
  const inventionItems = Object.entries(inventionCounts).filter(([id, count]) => inventionNames[id] && count > 0).map(([id, count]) => ({
    id: `invention:${id}`,
    sourceId: id,
    label: inventionNames[id],
    asset: id,
    inventoryKind: "invention",
    output: "発明武器",
    detail: VENDING_PRODUCT_DESCRIPTIONS[id] || "特殊な発明武器。通常使用と投擲に対応する",
    badge: `×${count}`
  }));
  const heavyNames = { rpg: "RPG", missile: "ミサイル" };
  const heavyCounts = (self.heavyWeapons || []).reduce((counts, id) => {
    counts[id] = (counts[id] || 0) + 1;
    return counts;
  }, {});
  const heavyItems = Object.entries(heavyCounts).filter(([id, count]) => heavyNames[id] && count > 0).map(([id, count]) => ({
    id: `heavy:${id}`,
    sourceId: id,
    label: heavyNames[id],
    asset: id,
    inventoryKind: "heavy",
    output: "重火器",
    detail: VENDING_PRODUCT_DESCRIPTIONS[id] || "使い切りの重火器。通常使用と投擲に対応する",
    badge: `×${count}`
  }));
  return [...regularItems, ...weaponItems, ...inventionItems, ...heavyItems];
}

function bindInventoryDetailHold(button, item) {
  let timer = 0;
  let pointerId = null;
  let originX = 0;
  let originY = 0;
  let suppressClick = false;
  const clear = () => {
    if (timer) window.clearTimeout(timer);
    timer = 0;
    pointerId = null;
  };
  button.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.cancelable) event.preventDefault();
    clear();
    pointerId = event.pointerId;
    originX = event.clientX;
    originY = event.clientY;
    suppressClick = false;
    try { button.setPointerCapture(event.pointerId); } catch {}
    timer = window.setTimeout(() => {
      if (pointerId !== event.pointerId) return;
      suppressClick = true;
      showToast(`${item.label}: ${item.detail || "使用・投擲できる所持品"}`);
      if (navigator.vibrate) navigator.vibrate(18);
    }, 520);
  });
  const suppressNativeLongPress = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  button.addEventListener("contextmenu", suppressNativeLongPress);
  button.addEventListener("selectstart", suppressNativeLongPress);
  button.addEventListener("dragstart", suppressNativeLongPress);
  button.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - originX, event.clientY - originY) > 9) clear();
  });
  button.addEventListener("pointerup", clear);
  button.addEventListener("pointercancel", clear);
  button.addEventListener("lostpointercapture", clear);
  button.addEventListener("click", (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    suppressClick = false;
  }, true);
}

function renderItemControl(data) {
  const self = data.self;
  const items = collectInventoryDisplayItems(self);
  const targets = (data.players || []).filter((player) => player.id !== self.id && player.alive && !player.ejected);
  const visible = data.phase === "playing" && self.alive && !self.ejected && (items.length > 0 || Number(self.credits) > 0);
  els.itemControl.hidden = !visible;
  if (!visible) {
    state.itemRenderKey = "";
    return;
  }
  const previousItem = els.itemSelect.value;
  const previousTarget = els.transferTargetSelect.value;
  const renderKey = JSON.stringify([
    items.map((item) => [item.id, item.label, item.badge, item.asset, item.inventoryKind, item.output, item.detail]),
    targets.map((target) => [target.id, target.name]),
    self.credits
  ]);
  if (state.itemRenderKey !== renderKey) {
    state.itemRenderKey = renderKey;
    els.itemSelect.innerHTML = items.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.label)} ${escapeHtml(item.badge || "")}</option>`).join("");
    if (items.some((item) => item.id === previousItem)) els.itemSelect.value = previousItem;
    els.transferTargetSelect.innerHTML = targets.map((target) => `<option value="${escapeHtml(target.id)}">${escapeHtml(playerIdentityLabel(target))}</option>`).join("");
    if (targets.some((target) => target.id === previousTarget)) els.transferTargetSelect.value = previousTarget;
    els.itemInventoryGrid.replaceChildren();
    items.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "item-inventory-choice alchemy-choice";
      button.dataset.itemChoice = item.id;
      button.dataset.alchemyChoice = item.id;
      button.dataset.alchemyAsset = item.asset || item.sourceId || item.id;
      button.dataset.inventoryKind = item.inventoryKind;
      button.setAttribute("role", "option");
      button.innerHTML = `<span class="alchemy-choice-icon" aria-hidden="true"></span><span class="item-choice-copy"><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.output || "所持品")}</small></span><b>${escapeHtml(item.badge || "")}</b>`;
      applyGeneratedItemTexture(button, item.asset || item.sourceId || item.id);
      bindInventoryDetailHold(button, item);
      button.addEventListener("click", () => {
        selectItemChoice(item.id, false);
        if (item.inventoryKind === "weapon" && item.sourceId !== state.data?.self?.gunnerWeapon) {
          void api("/api/gunner-weapon", { weaponId: item.sourceId });
        }
      });
      els.itemInventoryGrid.append(button);
    });
  }
  const selected = items.find((item) => item.id === els.itemSelect.value) || items[0];
  if (selected && els.itemSelect.value !== selected.id) els.itemSelect.value = selected.id;
  els.itemInventoryGrid.querySelectorAll("[data-item-choice]").forEach((button) => {
    const active = button.dataset.itemChoice === selected?.id;
    button.classList.toggle("selected", active);
    button.setAttribute("aria-selected", String(active));
  });
  const blocked = (Number(self.itemDisabledUntil) || 0) > estimatedServerNow(data);
  const canUse = Boolean(selected) && !blocked;
  const selectedWeaponReloading = selected?.inventoryKind === "weapon" &&
    selected.sourceId === self.gunnerReloadWeapon &&
    (Number(self.gunnerReloadUntil) || 0) > estimatedServerNow(data);
  const transferCredits = transferCreditAmount();
  els.transferCreditsAmount.max = String(Math.max(1, Math.floor(Number(self.credits) || 0)));
  els.itemUseButton.disabled = !canUse || selectedWeaponReloading;
  els.itemUseButton.hidden = false;
  els.itemThrowButton.disabled = !canUse;
  els.transferItemButton.disabled = !selected || !targets.length || blocked;
  els.transferCreditsButton.disabled = Number(self.credits) < transferCredits || !targets.length;
  const selectedUseLabel = selected?.inventoryKind === "weapon"
    ? selectedWeaponReloading ? `自動リロード ${Math.max(0, (Number(self.gunnerReloadUntil) - estimatedServerNow(data)) / 1000).toFixed(1)}秒` : "射撃"
    : "使用";
  els.itemUseButton.textContent = `${selectedUseLabel} [Shift+V]`;
  els.itemThrowButton.textContent = "投擲 [Shift+G]";
  els.transferCreditsButton.textContent = `${transferCredits}C譲渡（所持${Math.floor(Number(self.credits) || 0)}C）`;
  const weaponChanged = Boolean(state.inventoryVisualWeapon && state.inventoryVisualWeapon !== self.gunnerWeapon);
  state.inventoryVisualWeapon = self.gunnerWeapon || "";
  if (weaponChanged) {
    const equipped = els.itemInventoryGrid.querySelector(`[data-item-choice="weapon:${CSS.escape(self.gunnerWeapon || "")}"]`);
    equipped?.classList.add("weapon-switch-confirm");
  }
}

function transferCreditAmount() {
  return Math.max(1, Math.floor(Number(els.transferCreditsAmount?.value) || 1));
}

function formatEffectCountdown(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function hasDisplayedOperatorAccess(self, type) {
  if (!self) return false;
  const nativeSpecial = type === "gravity" ? "teleport" : type;
  return self.special === nativeSpecial || (
    self.special === "alchemist" &&
    self.hackerRootActive &&
    availableBorrowedOperatorTypes(self).includes(type)
  );
}

function collectOperatorPassiveEffects(self, liveNow) {
  const effects = [];
  const add = (label, value, tone, detail) => effects.push({ label, value, tone, detail });
  const passiveEnabled = Boolean(self.passivesEnabled);
  const passiveValue = passiveEnabled ? "有効" : "理知まで休止";
  const passiveTone = passiveEnabled ? "rational" : "neutral";

  if (hasDisplayedOperatorAccess(self, "fighter")) {
    add("キルカウンター", passiveValue, passiveTone, "回避成功時、攻撃者を即時キルする");
    add("斬る", "忍殺強化", "rational", "忍殺を居合へ変え、射撃を切断してジャストガード時は反射する");
    const energyWait = Math.max(0, Number(self.fighterEnergyChargeReadyAt || 0) - liveNow);
    const shockwaves = Math.max(0, Number(self.fighterShockwaveCharges) || 0);
    add("エネルギーチャージ", passiveEnabled ? `衝撃波×${shockwaves} / ${formatEffectCountdown(energyWait)}` : passiveValue, passiveTone, "一定時間ごとに1MPを自動消費して衝撃波を1発蓄積する。斬るか投擲で1発消費し、累計3回ごとに押し込みを得る");
  }

  if (hasDisplayedOperatorAccess(self, "gravity")) {
    add("リビテーション", self.levitationActive ? "浮揚可能" : passiveValue, self.levitationActive ? "rational" : passiveTone, "床のない場所を浮揚でき、浮揚中はマナを消費する");
  }

  if (hasDisplayedOperatorAccess(self, "flora")) {
    const aromaValue = self.aromaActive
      ? `SP回復 ×${Number(self.aromaRegenMultiplier || 1.6).toFixed(2)}`
      : passiveValue;
    add("アロマ", aromaValue, self.aromaActive ? "good" : passiveTone, "本人の停止中スタミナ回復速度を上昇させる");
  }

  if (self.special === "alchemist") {
    add("ハック", "常時稼働", "rational", "生存者の位置を把握し、タスクを時間経過で自動完了する");
    const manaGpuDrain = Number(self.manaGpuDrainPerSecond || 0).toFixed(3);
    const manaGpuReductionSeconds = Math.round(Number(self.manaGpuCooldownReductionMsPerMana || 0) / 1000);
    add(
      "マナGPU",
      self.manaGpuActive ? "稼働中" : "条件待ち",
      self.manaGpuActive ? "truth" : "neutral",
      `再使用待機中に毎秒${manaGpuDrain}MPを自動消費し、1MPにつき残りクールタイムを${manaGpuReductionSeconds}秒短縮する。待機時間またはMPがない間は停止する`
    );
    add("root化", self.hackerRootActive ? "発動中" : "待機", self.hackerRootActive ? "truth" : "neutral", "絶体絶命時に他オペレーターの全能力を借用する");
  }

  return effects;
}

function renderActiveEffects(data) {
  const self = data.self;
  const liveNow = estimatedServerNow(data);
  const rational = Number(self.mana) >= (Number(self.rationalManaThreshold) || 2);
  const itemBlocked = (Number(self.itemDisabledUntil) || 0) > liveNow;
  const effects = [];
  const add = (label, value, tone, detail) => effects.push({ label, value, tone, detail });
  const timed = (label, endsAt, tone, detail) => {
    if ((endsAt || 0) > liveNow) add(label, formatEffectCountdown(endsAt - liveNow), tone, detail);
  };

  const immediate = self.lastImmediateFeedback;
  if (immediate?.at && liveNow - immediate.at < 6500) {
    add(immediate.label, "完了", "instant", immediate.detail);
  }

  if (self.rationalFreeAbilityReady) {
    add("固有能力無料化", "準備完了", "rational", "次のオペ固有能力をマナ消費なしで発動できる");
  } else if (rational) {
    timed("固有能力無料化", self.rationalFreeAbilityReadyAt, "rational", "理知を維持すると次のオペ固有能力が無料になる");
  }

  const passiveState = itemBlocked ? "EMP遮断" : rational ? "有効" : "理知まで休止";
  if (self.goodActive) add("善・全バフ", passiveState, rational ? "good" : "neutral", "理知中、押し込み・踏ん張り・回復・加速・タスク消費軽減を同時に得る");
  if (self.luminousActive) add("ルミナス加速", "適用中", "truth", "移動速度が大幅に上昇する");
  effects.push(...collectOperatorPassiveEffects(self, liveNow));
  if ((self.overheal || 0) > 0) add("オーバーヒール", `×${self.overheal}`, "good", "次のボディダメージを吸収し、状態異常を解除する");
  if ((self.standFirmCharges || 0) > 0) add("踏ん張り", `×${self.standFirmCharges} / ${passiveState}`, rational ? "spirit" : "neutral", "理知中、次に受ける確殺を1回だけボディダメージへ変換する");
  if ((self.substitutionCharges || 0) > 0) add("変わり身の術", `×${self.substitutionCharges} / ${passiveState}`, rational ? "spirit" : "neutral", "理知中、次のあらゆる攻撃を無効化し別地点へ移動する");
  if ((self.pushCharges || 0) > 0) add("押し込み", `×${self.pushCharges} / ${passiveState}`, rational ? "truth" : "neutral", "理知中、次の攻撃対象の踏ん張りを全無効化し、無効化1回につき自身へ0.5ダメージ");
  if ((Number(self.gravityStormSlowUntil) || 0) > liveNow) {
    const multiplier = Math.max(0, Math.min(1, Number(self.gravityStormSlowMultiplier) || 1));
    timed(
      "重力減速",
      self.gravityStormSlowUntil,
      "desire",
      `移動速度 ${Math.round(multiplier * 100)}% / 直近HP -${Number(self.lastGravityStormDamage || 0).toFixed(2)}`
    );
  }
  const borrowedOperatorAccess = (type) => hasDisplayedOperatorAccess(self, type);
  if (self.weakBulletLoaded) {
    add("ウィークバレット", "自動装填済み", "truth", "次に命中した対象を破壊し、射手自身も破壊される");
  } else if (Number(self.weakBulletReadyAt) > liveNow) {
    timed("ウィークバレット自動装填", self.weakBulletReadyAt, "rational", "理知中に時間経過で自動装填される");
  }
  if (self.gravityTimeMode) timed(
    self.gravityTimeMode === "accelerate"
      ? `アクセラレート ×${Math.max(1, Number(self.gravityTimeStacks?.accelerate) || 1)}`
      : `ディーセラレート ×${Math.max(1, Number(self.gravityTimeStacks?.decelerate) || 1)}`,
    self.gravityTimeEndsAt,
    self.gravityTimeMode === "accelerate" ? "good" : "desire",
    "1MPで8秒間、対象の移動・行動不能時間・クールタイムを相対変化させる"
  );
  if ((self.routePartnerCount || 0) > 0) add("ペア行動警告", `${self.routePartnerCount}人`, "desire", "同じ経路を5秒以上進むとディフェンダーは継続ダメージを受ける");
  timed("スマホ操作", self.smartphoneUntil, "neutral", "遠隔修復または緊急会議の送信完了まで行動不能になる");

  if ((self.dodgeDurationBonusMs || 0) > 0) {
    add("回避時間拡張", `+${(self.dodgeDurationBonusMs / 1000).toFixed(2)}秒`, "beauty", "回避1回あたりのキル無効時間を延長する");
  }
  if (self.mapObjectEffects?.speedBoost) add("加速床", "範囲内", "good", "床の効果で移動速度が上昇する");
  if (self.mapObjectEffects?.quiet) add("静音フィールド", "範囲内", "rational", "移動中の足音が周囲へ伝わらない");
  timed("回避", self.dodgeActiveUntil, "beauty", self.special === "fighter" ? "キルを無効化し、キルカウンターを行う" : "効果中に受けたキル判定を無効化する");
  const floraAcceleration = self.timedAccelerationStacks?.flora;
  timed(
    `フローラ加速${floraAcceleration?.count > 1 ? ` ×${floraAcceleration.count}` : ""}`,
    floraAcceleration?.endsAt || self.overhealSpeedUntil,
    "good",
    `1回につき移動速度1.80倍。現在${floraAcceleration?.count || 1}重で×${Number(floraAcceleration?.multiplier || 1.8).toFixed(2)}`
  );
  const hoverAcceleration = self.timedAccelerationStacks?.["hover-sprint"];
  timed(
    `ホバースプリント${hoverAcceleration?.count > 1 ? ` ×${hoverAcceleration.count}` : ""}`,
    hoverAcceleration?.endsAt || self.hoverSprintUntil,
    "good",
    `1回につき移動速度1.80倍。現在${hoverAcceleration?.count || 1}重で×${Number(hoverAcceleration?.multiplier || 1.8).toFixed(2)}`
  );
  timed("速度低下", self.slowedUntil, "desire", "一時的に移動速度が低下する");
  timed("テーザー痺れ", self.taserSlowedUntil, "desire", "移動速度が35%低下する。行動不能やリキャスト低下は発生しない");
  timed("能力封印", self.abilityDisabledUntil, "desire", "オペ固有能力を発動できない");
  timed("EMPストレージ遮断", self.itemDisabledUntil, "desire", "全アイテムを使用できず、踏ん張り・押し込み・変わり身・装備・戦術PCなどの効果も停止する");
  if (self.poisonStatus) add("中毒", "継続", "desire", "解毒剤またはフローラの回復を受けるまで継続ダメージを受ける");
  if (self.burnStatus) add("燃焼", "継続", "desire", "水またはフローラの回復を受けるまで継続ダメージを受ける");
  timed("意識消失", self.unconsciousUntil, "desire", "視覚・聴覚情報が消失し、行動できない");
  timed("重力拘束", self.gravityPinnedUntil, "desire", "強い重力に押さえ込まれ、一時的に移動・行動できない");
  timed("休息", self.sleepingUntil, "neutral", "行動不能になる代わりにスタミナ回復速度が4倍になる");
  timed("精神統一", self.meditatingUntil, "rational", "行動不能になり、完了時にマナを1獲得する");
  if (self.computerActive) add("パソコン", self.computerEffective ? "稼働" : "遮断中", self.computerEffective ? "rational" : "desire", self.computerEffective ? "全生存者の位置情報を表示する" : "EMP解除後に自動復帰する");

  const panelHidden = !["playing", "meeting"].includes(data.phase);
  if (els.activeEffectsPanel.hidden !== panelHidden) els.activeEffectsPanel.hidden = panelHidden;
  const visibleEffects = effects.length ? effects : [{ label: "効果なし", value: "-", tone: "neutral", detail: "現在適用されているバフ・デバフはない" }];
  const renderKey = JSON.stringify(visibleEffects);
  if (state.activeEffectsRenderKey === renderKey) {
    scheduleActiveEffectsLayout();
    return;
  }
  state.activeEffectsRenderKey = renderKey;
  els.activeEffectsList.innerHTML = visibleEffects.map((effect) => `
    <li class="effect-tone-${escapeHtml(effect.tone)}">
      <span class="effect-copy">
        <strong class="effect-name">${escapeHtml(effect.label)}</strong>
        <small class="effect-detail">${escapeHtml(effect.detail)}</small>
      </span>
      <strong class="effect-value">${escapeHtml(effect.value)}</strong>
    </li>
  `).join("");
  scheduleActiveEffectsLayout();
}

let activeEffectsLayoutFrame = 0;

function scheduleActiveEffectsLayout() {
  cancelAnimationFrame(activeEffectsLayoutFrame);
  activeEffectsLayoutFrame = requestAnimationFrame(layoutActiveEffectsPanel);
}

function layoutActiveEffectsPanel() {
  activeEffectsLayoutFrame = 0;
  const panel = els.activeEffectsPanel;
  if (!panel || panel.hidden) return;
  const availableHeight = Math.max(116, Math.min(250, Math.floor(window.innerHeight * 0.24)));
  const borderHeight = (Number.parseFloat(getComputedStyle(panel).borderTopWidth) || 0) +
    (Number.parseFloat(getComputedStyle(panel).borderBottomWidth) || 0);
  const naturalHeight = Math.ceil(panel.scrollHeight + borderHeight);
  const shouldScroll = naturalHeight > availableHeight + 2;

  panel.style.maxHeight = `${shouldScroll ? availableHeight : naturalHeight}px`;
  panel.style.overflowY = shouldScroll ? "auto" : "visible";
  panel.classList.toggle("effects-scrollable", shouldScroll);

  const lowerRow = els.fieldLowerRow;
  const fieldSlot = lowerRow?.parentElement;
  if (lowerRow && fieldSlot && !lowerRow.hidden) {
    const lowerHeight = Math.ceil(lowerRow.getBoundingClientRect().height);
    fieldSlot.style.setProperty("--field-lower-height", `${lowerHeight}px`);
  }
}

function renderVending(data) {
  els.vendingPanel.querySelectorAll("[data-drink]").forEach((button) => {
    applyGeneratedItemTexture(button, button.dataset.vendingAsset || button.dataset.drink);
  });
  const near = nearestStation((station) => station.type === "vending");
  const visible = Boolean(data.phase === "playing" && data.self.alive && !data.self.ejected && near);
  if (els.vendingPanel.hidden === visible) els.vendingPanel.hidden = !visible;
  if (!visible) {
    state.vendingRenderKey = "";
    scheduleActiveEffectsLayout();
    return;
  }
  const costs = {
    "mineral-water": 6,
    antidote: 18,
    molotov: 45,
    evade: 10,
    speed: 8,
    warp: 12,
    mystery: 40,
    fire: 90,
    substitution: 75,
    grit: 30,
    heal: 10,
    reason: 45,
    mana: 25,
    railgun: 140,
    "particle-cannon": 180,
    excalibur: 220,
    exile: 250,
    computer: 120,
    handgun: 35,
    smg: 60,
    assault: 80,
    sniper: 110,
    taser: 55,
    mercury: 20,
    lead: 16,
    uranium: 120,
    plutonium: 160,
    ice: 14,
    "heated-water": 14,
    rpg: 160,
    missile: 190
  };
  els.vendingPanel.querySelectorAll("[data-drink]").forEach((button) => {
    const copy = button.querySelector("span:last-child");
    const description = VENDING_PRODUCT_DESCRIPTIONS[button.dataset.drink] || "";
    if (!copy || !description) return;
    let detail = copy.querySelector("small");
    if (!detail) {
      detail = document.createElement("small");
      copy.append(detail);
    }
    detail.textContent = description;
    button.title = description;
  });
  const mysteryVisible = data.self.lastMysteryResult && estimatedServerNow(data) - (data.self.lastMysteryResultAt || 0) < 20_000;
  const renderKey = JSON.stringify([
    near.id,
    Math.floor(Number(data.self.stamina) || 0),
    Number(data.self.maxStoredStamina) || 500,
    Number(data.self.bodyHits) || 0,
    Number(data.self.credits) || 0,
    Number(data.self.mana) || 0,
    data.self.fireJutsuCharges || 0,
    data.self.substitutionCharges || 0,
    data.self.standFirmCharges || 0,
    data.self.pushCharges || 0,
    mysteryVisible ? data.self.lastMysteryResult : ""
  ]);
  if (state.vendingRenderKey === renderKey) {
    scheduleActiveEffectsLayout();
    return;
  }
  state.vendingRenderKey = renderKey;
  els.vendingPanel.querySelectorAll("[data-drink]").forEach((button) => {
    if (button.hidden) button.hidden = false;
    const staminaFull = false;
    const healUnavailable = button.dataset.drink === "heal" && data.self.bodyHits <= 0;
    const alreadyOwnsComputer = button.dataset.drink === "computer" && data.self.computerActive;
    const disabled = staminaFull || healUnavailable || alreadyOwnsComputer || data.self.credits < costs[button.dataset.drink];
    if (button.disabled !== disabled) button.disabled = disabled;
  });
  if (els.magicInventory.hidden) els.magicInventory.hidden = false;
  const carriedItems = (data.self.itemInventory || []).map((item) => `${item.label} ${item.amount}`).join(" / ");
  const inventoryText = `所持: ${carriedItems ? `${carriedItems} / ` : ""}火遁 ${data.self.fireJutsuCharges || 0} / 変わり身 ${data.self.substitutionCharges || 0} / 銃器 ${(data.self.purchasedWeapons || []).length}${data.self.computerActive ? " / 戦術PC" : ""}${data.self.exiled ? " / 亡命済み" : ""}${mysteryVisible ? ` / ミステリー結果: ${data.self.lastMysteryResult}` : ""}`;
  if (els.magicInventory.textContent !== inventoryText) els.magicInventory.textContent = inventoryText;
  scheduleActiveEffectsLayout();
}

function objectiveText(data) {
  const self = data.self;
  const liveNow = estimatedServerNow(data);
  const itemBlocked = (Number(self.itemDisabledUntil) || 0) > liveNow;
  const rational = Number(self.mana) >= (Number(self.rationalManaThreshold) || 2);
  if (data.phase === "ended") return data.finishReason || "";
  if (self.ejected) return "追放されています。観戦のみ可能です。";
  if ((self.ascensionUntil || 0) > liveNow) {
    return `善のイデアへ昇天中 / 特殊勝利まで${((self.ascensionUntil - liveNow) / 1000).toFixed(1)}秒`;
  }
  if ((self.sleepingUntil || 0) > liveNow) {
    return `休息中 / 行動不能 / 高速回復 / 残り${((self.sleepingUntil - liveNow) / 1000).toFixed(1)}秒`;
  }
  if ((self.meditatingUntil || 0) > liveNow) {
    return `練気・精神統一中 / 行動不能 / 残り${((self.meditatingUntil - liveNow) / 1000).toFixed(1)}秒`;
  }
  if ((self.unconsciousUntil || 0) > liveNow) {
    return `意識消失中 / 視覚・聴覚遮断 / 残り${((self.unconsciousUntil - liveNow) / 1000).toFixed(1)}秒`;
  }
  if ((self.taserSlowedUntil || 0) > liveNow) {
    return `テーザー痺れ / 行動速度低下 / 残り${((self.taserSlowedUntil - liveNow) / 1000).toFixed(1)}秒`;
  }
  if ((self.abilityDisabledUntil || 0) > liveNow) {
    return `能力封印中 / 残り${((self.abilityDisabledUntil - liveNow) / 1000).toFixed(1)}秒`;
  }
  if ((self.slowedUntil || 0) > liveNow) {
    return `速度低下中 / 残り${((self.slowedUntil - liveNow) / 1000).toFixed(1)}秒`;
  }
  if (self.lastMysteryResult && liveNow - (self.lastMysteryResultAt || 0) < 20_000) {
    return `ミステリー結果: ${self.lastMysteryResult}`;
  }
  if (self.role === "defender" && self.alive && self.dodgeActiveUntil > liveNow) {
    return `回避有効 / 残り${((self.dodgeActiveUntil - liveNow) / 1000).toFixed(1)}秒`;
  }
  const dodgeText = "回避 100SP";
  if (self.special === "fighter" && self.alive) {
    return `ファイター / 斬る・キルカウンター・リミットブレイク / ${dodgeText}`;
  }
  if (self.special === "teleport" && self.alive) {
    return `タスクを進めてください。テレポート ${self.abilityCosts?.teleport || 0}MP / ${dodgeText}`;
  }
  if (self.role === "attacker") {
    if (self.aimTargetId && self.aimReadyAt > liveNow) {
      return `忍殺準備中です。発動まで${((self.aimReadyAt - liveNow) / 1000).toFixed(1)}秒。対象が動くと失敗します。`;
    }
    const cd = Math.max(0, Math.ceil((self.killReadyAt - data.serverNow) / 1000));
    const empSeconds = Math.max(0, Math.ceil(((self.empReadyAt || 0) - liveNow) / 1000));
    const sabotageSeconds = Math.max(0, Math.ceil(((self.sabotageReadyAt || 0) - liveNow) / 1000));
    return `ディフェンダーを減らしてください。キル ${cd ? `${cd}秒` : "使用可能"} / EMP ${empSeconds ? `${empSeconds}秒` : "使用可能"} / サボタージュ ${sabotageSeconds ? `${sabotageSeconds}秒` : "使用可能"}`;
  }
  if (!self.alive) return "死亡中です。残ったタスクは完了扱いです。";
  if (self.chatMuted) return "復活後のため、この試合ではチャットできません。";
  return `タスクは${self.taskStaminaRequirement || 200}SPを消費し、端末の近くで停止し続けると自動実行。回避は100SPを消費します。現在 ${Math.floor(self.stamina || 0)}SP / ${dodgeText}`;
}

function renderUtility(data) {
  const utilityStation = nearestStation((station) => station.type === "utility");
  const visible = Boolean(data.utility && utilityStation && utilityStation.utility === data.utility.type);
  if (els.utilityPanel.hidden === visible) els.utilityPanel.hidden = !visible;
  if (!visible) {
    if (state.utilityRenderKey) els.utilityPanel.innerHTML = "";
    state.utilityRenderKey = "";
    return;
  }
  const renderKey = JSON.stringify([utilityStation.id, data.utility.type, data.utility.title, data.utility.lines || []]);
  if (state.utilityRenderKey === renderKey) return;
  state.utilityRenderKey = renderKey;
  els.utilityPanel.innerHTML = `
    <h3>${escapeHtml(data.utility.title)}</h3>
    ${(data.utility.lines || []).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
  `;
}

function updateActionButtons(data) {
  const self = data.self;
  const fighterAccess = hasDisplayedOperatorAccess(self, "fighter");
  const borrowedGunnerAccess = self.special === "alchemist" && hasDisplayedOperatorAccess(self, "gunner");
  const gunnerAccess = self.special === "gunner" || borrowedGunnerAccess || (self.purchasedWeapons || []).length > 0;
  const isPlaying = data.phase === "playing";
  const isAttacker = self.role === "attacker";
  const canUseKill = isAttacker || isDefenderHunter(self);
  const actionBlocked = isActionBlocked(data);
  const abilityLocked = (self.abilityDisabledUntil || 0) > estimatedServerNow(data);
  const canActAlive = isPlaying && self.alive && !self.ejected && !self.inVent && !actionBlocked;
  const canUseAbility = canActAlive && !abilityLocked;
  const abilityCosts = self.abilityCosts || {};
  const borrowedFreeUses = self.borrowedAbilityFreeUses || {};
  const selectedAlchemy = alchemyRecipes.find((recipe) => recipe.id === els.alchemySelect.value) || alchemyRecipes[0];
  const activeBorrowedOperator = selectedBorrowedOperator();
  const selectedBorrowedRecipe = alchemyRecipes.find(
    (recipe) => recipe.id === `borrowed-${activeBorrowedOperator}`
  );
  const hasMana = (key) => {
    if (self.hackerManaFree) return true;
    const cost = Number(abilityCosts[key]) || 0;
    return cost <= 0 || (Number(self.mana) || 0) >= cost;
  };
  const operatorCostLabel = (key) => self.hackerManaFree
    ? "0MP / CTあり"
    : self.rationalFreeAbilityReady
      ? "FREE"
      : `-${abilityCosts[key] ?? 1}MP`;
  const target = nearestTarget();
  const aimed = aimedTarget(data);
  const task = nearestTask();
  const utilityStation = nearestStation((station) => station.type === "utility");
  const liveNow = estimatedServerNow(data);
  const itemBlocked = (Number(self.itemDisabledUntil) || 0) > liveNow;
  const maxStamina = Number(self.maxStamina) || 100;
  const cameraIndices = availableCameraIndices(data);
  const aiming = Boolean(aimed && self.aimTargetId);
  const contextSource = utilityStation ? els.utilityButton : null;

  const hackerManualTask = self.special === "alchemist" && Boolean(task);
  els.taskButton.hidden = !hackerManualTask;
  els.taskButton.textContent = task ? `タスク: ${task.label}` : "タスク";
  els.taskButton.disabled = !(hackerManualTask && canActAlive && Number(self.stamina) >= Number(self.taskStaminaRequirement || 200) && (Number(self.taskAutoReadyAt) || 0) <= liveNow);
  const actionLayoutKey = JSON.stringify([
    self.role,
    self.special,
    fighterAccess,
    borrowedGunnerAccess,
    canUseKill,
    state.cameraViewIndex >= 0 && cameraIndices.length >= 2,
    (self.warpCharges || 0) > 0,
    (self.fireJutsuCharges || 0) > 0,
    hasDisplayedOperatorAccess(self, "gravity"),
    hasDisplayedOperatorAccess(self, "flora"),
    hasDisplayedOperatorAccess(self, "gunner"),
    hasDisplayedOperatorAccess(self, "quantum"),
    task?.id || "",
    activeBorrowedOperator,
    els.teleportModeSelect.value,
    els.teleportTargetSelect.value
  ]);
  if (state.actionLayoutKey !== actionLayoutKey) {
    state.actionLayoutKey = actionLayoutKey;
    els.emergencyButton.hidden = false;
    els.ninjutsuButton.hidden = !canUseKill;
    els.dodgeButton.hidden = self.role !== "defender";
    els.teleportButton.hidden = true;
    els.shootButton.hidden = true;
    els.weaponButton.hidden = true;
    els.sleepButton.hidden = false;
    els.renkiButton.hidden = false;
    els.healButton.hidden = true;
    els.alchemyButton.hidden = true;
    els.operatorAbilityButton.hidden = activeBorrowedOperator
      ? false
      : !["fighter", "teleport", "flora", "gunner", "quantum"].includes(self.special);
    els.jumpButton.hidden = true;
    els.gunnerReloadButton.hidden = true;
    els.empButton.hidden = false;
    els.cameraButton.hidden = self.role !== "defender";
    els.nextCameraButton.hidden = self.role !== "defender";
    els.instantWarpButton.hidden = true;
    els.fireJutsuButton.hidden = true;
    els.mapActionButton.hidden = false;
    els.substitutionStatusButton.hidden = true;
    els.gritStatusButton.hidden = true;
    els.reasonButton.hidden = true;
  }
  els.jumpButton.hidden = true;
  els.jumpButton.disabled = !canActAlive || Number(self.stamina) < 41;
  els.jumpButton.dataset.hotkey = "J";
  els.jumpButton.title = "Jを長押しして跳躍距離を延ばす";
  els.contextActionButton.hidden = !contextSource;
  if (contextSource) {
    els.contextActionButton.dataset.sourceId = contextSource.id;
    els.contextActionButton.dataset.context = contextSource.id.replace(/Button$/, "");
    els.contextActionButton.dataset.hotkey = contextSource.dataset.hotkey || "";
    els.contextActionButton.textContent = contextSource.textContent;
    els.contextActionButton.disabled = contextSource.disabled;
  } else {
    els.contextActionButton.dataset.sourceId = "";
    els.contextActionButton.dataset.context = "";
    els.contextActionButton.removeAttribute("data-hotkey");
  }
  const killSeconds = Math.max(0, Math.ceil(((self.killReadyAt || 0) - liveNow) / 1000));
  els.ninjutsuButton.textContent = fighterAccess
    ? "斬る"
    : aiming
      ? `忍殺準備 ${(Math.max(0, self.aimReadyAt - liveNow) / 1000).toFixed(1)}秒`
      : killSeconds > 0
        ? `忍殺 ${killSeconds}秒`
        : "忍殺";
  const slashReady = fighterAccess && canActAlive && Number(self.stamina) >= Number(self.fighterSlashStaminaCost || 75);
  els.ninjutsuButton.disabled = fighterAccess
    ? !slashReady
    : !(canActAlive && canUseKill && !aiming && self.killReadyAt <= liveNow && target);
  els.fireJutsuButton.textContent = `火遁の術 燃焼 ×${self.fireJutsuCharges || 0}`;
  els.fireJutsuButton.disabled = !(canUseAbility && !itemBlocked && (self.fireJutsuCharges || 0) > 0);
  els.substitutionStatusButton.textContent = itemBlocked ? `変わり身 ×${self.substitutionCharges || 0}（EMP遮断）` : `変わり身 ×${self.substitutionCharges || 0}（自動）`;
  const standFirmCharges = Number(self.standFirmCharges ?? self.gritCharges) || 0;
  const pushCharges = Number(self.pushCharges ?? self.reasonCharges) || 0;
  const philosophy = [
    (self.ideaStage || 0) >= 1 && (self.ideaFirstAspect === "truth" || (self.ideaStage || 0) >= 2) ? "真" : "",
    (self.ideaStage || 0) >= 1 && (self.ideaFirstAspect === "beauty" || (self.ideaStage || 0) >= 2) ? "美" : "",
    self.goodActive ? "善" : ""
  ].filter(Boolean).join("・");
  els.gritStatusButton.textContent = `踏ん張り ×${standFirmCharges}（${itemBlocked ? "EMP遮断" : "自動"}）${philosophy ? ` / ${philosophy}` : ""}`;
  els.reasonButton.textContent = `押し込み ×${pushCharges}（${itemBlocked ? "EMP遮断" : "自動"}）`;
  els.reasonButton.disabled = true;
  const gunnerWeapons = Array.isArray(self.gunnerWeapons) ? self.gunnerWeapons : [];
  const gunnerWeapon = gunnerWeapons.find((weapon) => weapon.id === self.gunnerWeapon) || gunnerWeapons[0] || {
    id: "assault", name: "アサルトライフル", shortName: "AR", ammo: 0, maxAmmo: 0, ammoPerShot: 1, range: 920, damage: 0.34, manaCost: 0
  };
  const gunSeconds = Math.max(0, ((Number(self.gunReadyAt) || 0) - liveNow) / 1000);
  const gunAmmoReady = Number(gunnerWeapon.ammo) >= Number(gunnerWeapon.ammoPerShot || 1);
  const firingWeapon = gunnerWeapons.find((weapon) => weapon.id === self.gunFiringWeapon) || gunnerWeapon;
  const reloadSeconds = Math.max(0, ((Number(self.gunnerReloadUntil) || 0) - liveNow) / 1000);
  const shootLabel = "射撃";
  els.weaponButton.dataset.weapon = gunnerWeapon.id;
  els.weaponButton.dataset.destroyed = "false";
  els.weaponButton.textContent = `${gunnerWeapon.shortName || gunnerWeapon.name} ${gunnerWeapon.ammo}/${gunnerWeapon.maxAmmo}`;
  const falloffPercent = Math.round((1 - (Number(gunnerWeapon.minDamageRatio) || 1)) * 100);
  els.weaponButton.title = gunnerWeapon.id === "sniper"
    ? `${gunnerWeapon.name} / 射程${gunnerWeapon.range} / 長押し連射 / 確殺 / Tで切替`
    : `${gunnerWeapon.name} / ${Number(gunnerWeapon.damage).toFixed(2)}ダメージ / 距離減衰${falloffPercent}% / Tで切替`;
  els.weaponButton.disabled = !(canActAlive && !itemBlocked && gunnerAccess);
  if (self.gunFiring) {
    els.shootButton.textContent = `${firingWeapon.shortName || firingWeapon.name} 持続射撃中`;
  } else if (reloadSeconds > 0) {
    els.shootButton.textContent = `リロード ${reloadSeconds.toFixed(1)}秒`;
  } else if (!gunAmmoReady) {
    els.shootButton.textContent = `${shootLabel} 弾切れ`;
  } else if (gunSeconds > 0) {
    els.shootButton.textContent = `${shootLabel} ${gunSeconds.toFixed(1)}秒`;
  } else {
    els.shootButton.textContent = gunnerWeapon.id === "sniper" ? "長押しSR連射" : "長押し射撃";
  }
  els.shootButton.classList.toggle("active", Boolean(self.gunFiring || state.gunTriggerHeld));
  els.shootButton.disabled = self.gunFiring || state.gunTriggerHeld
    ? false
    : !(canUseAbility && !itemBlocked && gunnerAccess && gunAmmoReady && gunSeconds <= 0 && reloadSeconds <= 0);
  els.gunnerReloadButton.textContent = reloadSeconds > 0 ? `リロード ${reloadSeconds.toFixed(1)}秒` : "リロード";
  els.gunnerReloadButton.disabled = !(canActAlive && !itemBlocked && gunnerAccess && Number(gunnerWeapon.ammo) < Number(gunnerWeapon.maxAmmo) && reloadSeconds <= 0);
  const dodgeSeconds = Math.max(0, Math.ceil(((self.dodgeReadyAt || 0) - liveNow) / 1000));
  els.dodgeButton.textContent = dodgeSeconds > 0 ? `回避 ${dodgeSeconds}秒` : "回避 -100SP";
  els.dodgeButton.disabled = !(canUseAbility && self.role === "defender" && self.stamina >= maxStamina && hasMana("dodge") && self.dodgeActiveUntil <= liveNow && dodgeSeconds === 0);
  const teleportMode = els.teleportModeSelect.value === "heart" ? "heart" : "body";
  const teleportTargetIsSelf = (els.teleportTargetSelect.value || self.id) === self.id;
  els.teleportButton.textContent = teleportMode === "heart"
    ? `心臓へ転移 ${operatorCostLabel("heartTeleport")}`
    : `全身を転移 ${operatorCostLabel("teleport")}`;
  els.teleportButton.classList.toggle("danger", teleportMode === "heart");
  els.teleportButton.disabled = !(canUseAbility && self.special === "teleport" &&
    hasMana(teleportMode === "heart" ? "heartTeleport" : "teleport") &&
    (teleportMode !== "heart" || !teleportTargetIsSelf));
  els.healButton.textContent = `${self.overheal > 0 ? "オーバーヒール済み" : self.bodyHits > 0 ? "回復" : "オーバーヒール"} ${operatorCostLabel("flora")}`;
  els.healButton.disabled = !(canUseAbility && self.special === "flora" && hasMana("flora"));
  els.alchemyButton.textContent = `バイブコーディング: ${selectedAlchemy.label} ${operatorCostLabel("alchemy")}`;
  els.alchemyButton.disabled = !(canUseAbility &&
    self.special === "alchemist" &&
    hasMana("alchemy") &&
    (Number(self.vibeCodingReadyAt) || 0) <= liveNow);
  const operatorMode = els.teleportModeSelect.value;
  const borrowedModeLabel = selectedBorrowedRecipe
    ? activeBorrowedOperator === "gravity"
      ? els.teleportModeSelect.options[els.teleportModeSelect.selectedIndex]?.textContent || "能力"
      : activeBorrowedOperator === "flora"
        ? els.teleportModeSelect.options[els.teleportModeSelect.selectedIndex]?.textContent || "能力"
        : activeBorrowedOperator === "gunner"
          ? "ホバースプリント"
          : activeBorrowedOperator === "fighter"
            ? self.limitBreakActive ? "リミットブレイク解除" : "リミットブレイク"
            : "常時パッシブ"
    : "";
  const operatorLabels = {
    fighter: self.limitBreakActive ? "リミットブレイク解除" : "リミットブレイク",
    teleport: operatorMode === "body" ? `転移・地点 ${operatorCostLabel("teleport")}`
      : operatorMode === "near" ? `転移・対象付近 ${operatorCostLabel("teleport")}`
        : operatorMode === "heart" ? `心臓転移 ${operatorCostLabel("heartTeleport")}`
          : operatorMode === "accelerate" ? `アクセラレート 8秒 ${operatorCostLabel("teleport")}`
            : operatorMode === "decelerate" ? `ディーセラレート 8秒 ${operatorCostLabel("teleport")}`
              : `グラビティストーム ${operatorCostLabel("teleport")}`,
    flora: operatorMode === "heal" ? `回復 ${operatorCostLabel("flora")}` : operatorMode === "sunbeam-converged" ? `サンビーム収束 ${operatorCostLabel("flora")}` : `サンビーム放射 ${operatorCostLabel("flora")}`,
    gunner: `ホバースプリント ${operatorCostLabel("hoverSprint")}`,
    quantum: els.teleportModeSelect.options[els.teleportModeSelect.selectedIndex]?.textContent || "量子制御",
    alchemist: selectedBorrowedRecipe
      ? `${selectedBorrowedRecipe.label} / ${borrowedModeLabel}`
      : "借用能力"
  };
  const borrowedCostKey = activeBorrowedOperator === "gravity"
      ? (operatorMode === "heart" ? "heartTeleport" : "teleport")
      : activeBorrowedOperator === "flora"
        ? "flora"
      : activeBorrowedOperator === "fighter"
        ? "fighterCharge"
      : "hoverSprint";
  const selectedBorrowedFree = selectedBorrowedRecipe &&
    Number(borrowedFreeUses[activeBorrowedOperator]) > 0;
  const borrowedStateBlocked = Boolean(selectedBorrowedRecipe) && (
    !alchemyRecipeAvailable(selectedBorrowedRecipe, self) ||
    (!selectedBorrowedFree && !(activeBorrowedOperator === "fighter" && self.limitBreakActive) && !hasMana(borrowedCostKey))
  );
  const displayedOperator = activeBorrowedOperator === "gravity"
    ? "teleport"
    : activeBorrowedOperator || self.special;
  const displayedOperatorLabel = operatorLabels[displayedOperator] || "オペ能力";
  els.operatorAbilityButton.textContent = activeBorrowedOperator
    ? `借用 ${specialLabels[displayedOperator] || displayedOperator} / ${displayedOperatorLabel}`
    : displayedOperatorLabel;
  els.operatorAbilityButton.dataset.operator = displayedOperator || "none";
  els.operatorAbilityButton.disabled = !canUseAbility ||
    (displayedOperator === "fighter" && !self.limitBreakActive && !hasMana("fighterCharge")) ||
    (displayedOperator === "gunner" && ((Number(self.hoverSprintUntil) || 0) > liveNow || !hasMana("hoverSprint"))) ||
    (displayedOperator === "quantum" && Number(self.stamina) < 8) ||
    (activeBorrowedOperator && borrowedStateBlocked);
  const empSeconds = Math.max(0, Math.ceil(((self.empReadyAt || 0) - liveNow) / 1000));
  const empPhaseLabel = els.empPhaseSelect.value === "negative" ? "逆相" : "正相";
  els.empButton.textContent = empSeconds > 0 ? `${empPhaseLabel}EMP ${empSeconds}秒` : `${empPhaseLabel}EMP`;
  els.empButton.disabled = !(canUseAbility && empSeconds === 0);
  els.cameraButton.textContent = state.cameraViewIndex >= 0 ? "監視終了" : "監視カメラ";
  els.cameraButton.classList.toggle("active", state.cameraViewIndex >= 0);
  els.cameraButton.disabled = !(canUseAbility && self.role === "defender" && cameraIndices.length);
  els.nextCameraButton.disabled = state.cameraViewIndex < 0;
  els.instantWarpButton.textContent = `即時ワープ ×${self.warpCharges || 0}`;
  els.instantWarpButton.disabled = !canUseAbility || itemBlocked;
  const sleepSeconds = Math.max(0, Math.ceil(((self.sleepingUntil || 0) - liveNow) / 1000));
  const sleepEstimate = Math.max(0.1, ((self.maxStoredStamina || 500) - self.stamina) / (self.sleepRegenPerSecond || 76));
  els.sleepButton.textContent = sleepSeconds > 0 ? `休息 ${sleepSeconds}秒` : `休息 約${sleepEstimate.toFixed(1)}秒`;
  els.sleepButton.disabled = !(canActAlive && self.stamina < (self.maxStoredStamina || 500));
  const renkiSeconds = Math.max(0, ((self.meditatingUntil || 0) - liveNow) / 1000);
  els.renkiButton.textContent = renkiSeconds > 0 ? `精神統一 ${renkiSeconds.toFixed(1)}秒` : "練気 +1MP / 3.5秒";
  els.renkiButton.disabled = !canUseAbility;
  els.dashButton.disabled = !(isPlaying && !self.ejected && !self.inVent && !actionBlocked && activeStaminaFor(data) > 0);
  els.slowWalkButton.disabled = !(isPlaying && !self.ejected && !self.inVent && !actionBlocked);
  els.emergencyButton.textContent = `スマホ緊急会議 ${self.emergenciesLeft || 0}回`;
  els.emergencyButton.disabled = !(canActAlive && self.emergenciesLeft > 0);
  const sabotageSeconds = Math.max(0, Math.ceil(((self.sabotageReadyAt || 0) - liveNow) / 1000));
  const sabotageName = sabotageLabels[els.sabotageSelect.value] || "サボ";
  els.sabotageButton.textContent = sabotageSeconds > 0
    ? `${sabotageName} ${sabotageSeconds}秒 [矢印→Enter]`
    : `${sabotageName} [矢印→Enter]`;
  els.sabotageButton.disabled = !(canUseAbility && isAttacker && sabotageSeconds === 0 && hasMana("sabotage"));
  els.utilityControl.hidden = !(isPlaying && self.alive && !self.ejected && utilityStation);
  if (utilityStation) {
    els.utilitySelect.value = utilityStation.utility;
    els.utilityButton.textContent = utilityLabels[utilityStation.utility] || "情報端末を使用";
  }
  els.utilityButton.disabled = !(canUseAbility && utilityStation);
  if (contextSource) {
    els.contextActionButton.textContent = contextSource.textContent;
    els.contextActionButton.disabled = contextSource.disabled;
  }
  els.chatInput.disabled = !(data.phase === "meeting" && self.alive && !self.ejected && !self.chatMuted);
  renderTabletControls(data);
}

function renderMeeting(data) {
  if (data.phase !== "meeting" || !data.meeting) return;
  const selectedMeetingKey = els.meetingPanel.contains(state.keyboardElement)
    ? state.keyboardElement?.dataset?.keyboardKey || ""
    : "";
  const m = data.meeting;
  const discussion = m.discussionSecondsLeft > 0;
  els.meetingReason.textContent = discussion ? `${m.reason} / 討論中` : m.reason;
  els.meetingTimer.textContent = discussion ? `討論 ${m.discussionSecondsLeft}秒` : `投票 ${m.secondsLeft}秒`;
  els.voteList.innerHTML = "";

  const alivePlayers = data.players.filter((player) => player.alive && !player.ejected);
  const canUseLuminous = data.self.role === "defender" && data.self.alive && !data.self.ejected && !data.self.luminousUsed;
  els.luminousPanel.hidden = data.self.role !== "defender";
  els.luminousList.innerHTML = "";
  if (data.self.role === "defender") {
    els.luminousStatus.textContent = data.self.luminousActive
      ? "成功 / キル1"
      : data.self.luminousUsed
        ? "使用済み"
        : "1回限り";
    alivePlayers
      .filter((player) => player.id !== data.selfId)
      .forEach((player) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "luminous-target";
        button.dataset.keyboardKey = `luminous:${player.id}`;
        button.disabled = !canUseLuminous;
        button.innerHTML = `<span>${escapeHtml(playerIdentityLabel(player))}</span><strong>発動</strong>`;
        button.addEventListener("click", () => api("/api/luminous", { targetId: player.id }));
        els.luminousList.appendChild(button);
      });
  }

  alivePlayers.forEach((player, playerIndex) => {
    const votes = voteCountFor(data, player.id);
    const button = document.createElement("button");
    button.className = "vote-card";
    button.type = "button";
    if (playerIndex < 9) button.dataset.hotkey = String(playerIndex + 1);
    button.dataset.keyboardKey = `vote:${player.id}`;
    button.disabled = discussion || !data.self.alive || data.self.ejected || Boolean(data.meeting.votes?.[data.selfId]);
    button.innerHTML = `
      <span class="player-meta">
        <span class="name-line">${escapeHtml(playerIdentityLabel(player))}</span>
        <span class="sub-line">${escapeHtml(roleLabels[player.role] || player.role)}</span>
      </span>
      <span class="badge">${votes}</span>
    `;
    button.addEventListener("click", () => api("/api/vote", { targetId: player.id }));
    els.voteList.appendChild(button);
  });

  const skip = document.createElement("button");
  skip.className = "vote-card";
  skip.type = "button";
  skip.dataset.hotkey = "0";
  skip.dataset.keyboardKey = "vote:skip";
  skip.disabled = discussion || !data.self.alive || data.self.ejected || Boolean(data.meeting.votes?.[data.selfId]);
  skip.innerHTML = `
    <span class="player-meta">
      <span class="name-line">スキップ</span>
      <span class="sub-line">投票をスキップ</span>
    </span>
    <span class="badge">${voteCountFor(data, "skip")}</span>
  `;
  skip.addEventListener("click", () => api("/api/vote", { targetId: "skip" }));
  els.voteList.appendChild(skip);
  if (selectedMeetingKey) {
    const replacement = [...els.meetingPanel.querySelectorAll("[data-keyboard-key]")]
      .find((button) => button.dataset.keyboardKey === selectedMeetingKey && !button.disabled);
    if (replacement) {
      state.keyboardElement = replacement;
      replacement.classList.add("keyboard-selected");
      replacement.focus({ preventScroll: true });
    }
  }
}

function voteCountFor(data, targetId) {
  return Object.values(data.meeting?.votes || {}).filter((vote) => vote === targetId).length;
}

function renderFeeds(data) {
  els.chatFeed.innerHTML = "";
  data.chat.forEach((line) => {
    const div = document.createElement("div");
    div.className = "feed-line";
    div.innerHTML = `<strong>${escapeHtml(playerIdentityLabel(line))}</strong>: ${escapeHtml(line.message)}`;
    els.chatFeed.appendChild(div);
  });
  els.chatFeed.scrollTop = els.chatFeed.scrollHeight;
}

function renderEnd(data) {
  const ended = data.phase === "ended";
  els.endOverlay.hidden = !ended;
  els.resetButton.hidden = !(ended && data.hostId === state.playerId);
  els.resetButton.textContent = data.soloMission ? "戦術いろはへ戻る" : "オンラインロビーへ戻る";
  if (!ended) {
    els.endTitle.textContent = "";
    els.endReason.textContent = "";
    els.resultRanking.innerHTML = "";
    state.resultCelebrationKey = "";
    els.resultConfetti.replaceChildren();
    return;
  }
  els.endTitle.textContent = data.winner === "none"
    ? "試合終了"
    : data.winner === "idea"
      ? "善のイデア 特殊勝利"
      : data.winner === "attackers" ? "アタッカー勝利" : "ディフェンダー勝利";
  els.endReason.textContent = data.finishReason || "";
  if (data.soloMission?.id === "cpu-gravity" && data.winner === "attackers") {
    localStorage.setItem(storage.cpuGravityHint, "1");
    const hint = $("#cpuGravityHint");
    if (hint) hint.hidden = false;
  }
  els.resultRanking.innerHTML = "";
  const results = data.results || [];
  const ideaWinnerRole = results.find((entry) => entry.id === data.ideaWinnerId)?.role;
  const winningRole = data.winner === "idea" ? ideaWinnerRole || "defender" : data.winner === "attackers" ? "attacker" : "defender";
  const teamOrder = winningRole === "attacker" ? ["attacker", "defender"] : ["defender", "attacker"];
  teamOrder.forEach((role) => {
    const entries = results.filter((entry) => entry.role === role);
    if (!entries.length) return;
    const section = document.createElement("section");
    section.className = `result-team result-team-${role}`;
    section.innerHTML = `
      <div class="result-team-title">
        <strong>${role === "attacker" ? "アタッカー" : "ディフェンダー"}</strong>
        <span>${entries.length}人</span>
      </div>
      <div class="result-team-list"></div>
    `;
    const list = section.querySelector(".result-team-list");
    entries.forEach((entry, index) => {
      const row = document.createElement("div");
      const rank = index + 1;
      row.dataset.rank = String(rank);
      row.className = `result-row${rank === 1 ? " is-first" : ""}${entry.id === data.selfId ? " is-self" : ""}${entry.luminousSuccess ? " is-luminous" : ""}`;
      const detail = `キル ${entry.actualKills} / ${entry.rankTier || "bronze"}`;
      row.innerHTML = `
        <span class="result-rank">${rank}</span>
        <span class="color-dot" style="background:${escapeHtml(entry.color || "#94a3b8")}"></span>
        <span class="result-player">
          <strong>${escapeHtml(playerIdentityLabel(entry))}</strong>
          <small>${detail}</small>
        </span>
        <span class="result-score">${entry.contributionScore}</span>
      `;
      list.appendChild(row);
    });
    els.resultRanking.appendChild(section);
  });
  startResultCelebration(data, results);
}

function startResultCelebration(data, results) {
  if (!results.length) return;
  const key = `${data.roomId}:${data.round}:${data.winner}`;
  if (state.resultCelebrationKey === key) return;
  state.resultCelebrationKey = key;
  els.resultConfetti.replaceChildren();
  const colors = ["#facc15", "#22d3ee", "#f43f5e", "#4ade80", "#fb923c", "#e879f9", "#f8fafc"];
  for (let index = 0; index < 112; index += 1) {
    const piece = document.createElement("i");
    piece.style.setProperty("--x", `${(index * 37) % 101}%`);
    piece.style.setProperty("--drift", `${((index * 53) % 220) - 110}px`);
    piece.style.setProperty("--delay", `${(index % 14) * 0.055}s`);
    piece.style.setProperty("--duration", `${2.2 + (index % 9) * 0.11}s`);
    piece.style.setProperty("--spin", `${360 + (index % 7) * 130}deg`);
    piece.style.backgroundColor = colors[index % colors.length];
    els.resultConfetti.appendChild(piece);
  }
  for (let index = 0; index < 48; index += 1) {
    const spark = document.createElement("b");
    spark.style.setProperty("--x", `${(index * 67) % 101}%`);
    spark.style.setProperty("--y", `${12 + (index * 43) % 76}%`);
    spark.style.setProperty("--delay", `${(index % 12) * 0.07}s`);
    spark.style.setProperty("--scale", `${0.55 + (index % 6) * 0.16}`);
    spark.style.color = colors[(index * 3) % colors.length];
    els.resultConfetti.appendChild(spark);
  }
  for (let index = 0; index < 4; index += 1) {
    const halo = document.createElement("span");
    halo.style.setProperty("--delay", `${index * 0.22}s`);
    halo.style.setProperty("--halo-color", colors[index]);
    els.resultConfetti.appendChild(halo);
  }
  const selfResult = results.find((entry) => entry.id === data.selfId);
  const selfWon = data.winner === "idea"
    ? data.ideaWinnerId === data.selfId
    : (data.winner === "attackers" && selfResult?.role === "attacker") ||
      (data.winner === "defenders" && selfResult?.role === "defender");
  playSound(selfWon ? "win" : "lose");
  window.setTimeout(() => playSound("ranking"), 420);
}

function setFeed() {
  els.chatFeed.hidden = false;
  els.chatForm.hidden = false;
  els.chatTab.classList.add("active");
  if (state.fieldFeedOpen) hideChatNotification();
}

function setFieldFeedOpen(open) {
  if (open && state.expandedMapOpen) setExpandedMapOpen(false);
  state.fieldFeedOpen = Boolean(open && state.data && state.screen === "game");
  if (state.fieldFeedOpen) {
    setFeed();
    hideChatNotification();
  }
  els.fieldFeedPanel.hidden = !state.fieldFeedOpen;
  state.keyboardContext = "";
  syncKeyboardContext(true);
}

function hideChatNotification() {
  if (state.chatNotificationTimer) window.clearTimeout(state.chatNotificationTimer);
  state.chatNotificationTimer = null;
  els.chatNotification.hidden = true;
  els.chatNotificationText.textContent = "";
}

function detectRoomChat(_previous, next) {
  const chat = Array.isArray(next?.chat) ? next.chat : [];
  const latest = chat[chat.length - 1];
  const roomId = String(next?.roomId || "");
  if (state.lastRoomChatRoomId !== roomId) {
    state.lastRoomChatRoomId = roomId;
    state.lastRoomChatId = latest?.id || "";
    return;
  }
  if (!latest) {
    state.lastRoomChatId = "";
    return;
  }
  if (latest.id === state.lastRoomChatId) return;
  state.lastRoomChatId = latest.id;
  if (state.screen !== "game" || state.fieldFeedOpen) return;
  hideChatNotification();
  els.chatNotificationText.textContent = `${playerIdentityLabel(latest)}: ${latest.message}`;
  els.chatNotification.hidden = false;
  state.chatNotificationTimer = window.setTimeout(hideChatNotification, 5000);
}

function sendMovement(forceStop = false) {
  const data = state.data;
  if (!data || data.phase !== "playing") return;
  if (state.cameraViewIndex >= 0 && !forceStop) return;
  const actionLocksMovement = Boolean(state.enhanceHold.kind) || state.throwTargeting.active || state.clairvoyance.active;
  const direction = forceStop || actionLocksMovement ? { dx: 0, dy: 0 } : getDirection();
  const moving = Boolean(direction.dx || direction.dy);
  const timestamp = performance.now();
  if (
    moving &&
    !state.movementActive &&
    state.movementIdleStartedAt > 0 &&
    timestamp - state.movementIdleStartedAt >= MOVEMENT_IDLE_SESSION_ROTATE_MS
  ) {
    rotateMovementSession();
  }
  const inputSignature = [
    direction.dx.toFixed(4),
    direction.dy.toFixed(4),
    Number(isDashing()),
    Number(isSlowWalking())
  ].join(":");
  const inputChanged = inputSignature !== state.lastMovementSentSignature;
  if (!forceStop && !moving && !state.movementActive) return;
  if (!forceStop && moving && !inputChanged && timestamp - state.lastMoveSent < MOVEMENT_SEND_INTERVAL_MS) return;
  state.lastMoveSent = timestamp;
  state.lastMovementSentSignature = inputSignature;
  state.movementActive = moving;
  if (moving) state.movementIdleStartedAt = 0;
  else state.movementIdleStartedAt = timestamp;
  const requestSeq = ++state.moveRequestSeq;
  if (!moving) state.movementStopPendingSeq = requestSeq;
  const payload = {
    roomId: state.roomId,
    playerId: state.playerId,
    dx: direction.dx,
    dy: direction.dy,
    dash: isDashing(),
    slow: isSlowWalking(),
    movementSession: state.movementSession,
    movementSessionStartedAt: state.movementSessionStartedAt,
    movementClock: timestamp,
    movementSeq: requestSeq,
    clientId: clientId()
  };
  if (state.realtime?.sendMovement(payload)) return;
  if (state.movementQueue) {
    state.movementQueue.enqueue(payload);
    return;
  }
  sendHttpMovement(payload).then(applyMovementAck).catch(() => {});
}

function rotateMovementSession() {
  state.movementQueue?.clear?.();
  state.movementSession = globalThis.crypto?.randomUUID?.() || `move-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  state.movementSessionStartedAt = Date.now();
  state.moveRequestSeq = 0;
  state.lastMoveAppliedSeq = 0;
  state.lastMoveAppliedClock = 0;
  state.lastMovementServerNow = 0;
  state.lastMovementSentSignature = "";
  state.movementActive = false;
  state.movementStopPendingSeq = 0;
  const self = selfPlayer();
  const rendered = self ? state.renderPlayers.get(self.id) : null;
  if (rendered) {
    rendered.targetX = rendered.x;
    rendered.targetY = rendered.y;
    rendered.velocityX = 0;
    rendered.velocityY = 0;
  }
}

function anchorLocalJumpRender(sourceData = state.data) {
  const data = sourceData;
  const self = data?.players?.find((player) => player.id === data.selfId);
  const jump = self?.jumpMotion;
  const rendered = self ? state.renderPlayers.get(self.id) : null;
  if (!rendered || !jump || !Number.isFinite(Number(jump.toX)) || !Number.isFinite(Number(jump.toY))) return;
  const active = Number(jump.endsAt) > estimatedServerNow(data);
  rendered.x = active ? Number(jump.fromX) : Number(jump.toX);
  rendered.y = active ? Number(jump.fromY) : Number(jump.toY);
  rendered.targetX = Number(jump.toX);
  rendered.targetY = Number(jump.toY);
  rendered.velocityX = 0;
  rendered.velocityY = 0;
  rendered.jumpMotionStartedAt = Number(jump.startedAt) || 0;
  rendered.jumpMotionCompletedAt = active ? 0 : Number(jump.startedAt) || 0;
}

function resyncMovementAfterFocus() {
  if (document.hidden || !document.hasFocus() || !state.roomId || !state.playerId) return Promise.resolve(false);
  if (state.focusResyncPromise) return state.focusResyncPromise;
  const roomId = state.roomId;
  const playerId = state.playerId;
  clearMovementInput();
  rotateMovementSession();
  state.focusResyncing = true;
  state.focusResyncPromise = request("/api/movement/resync", {
    roomId,
    playerId,
    movementSession: state.movementSession,
    movementSessionStartedAt: state.movementSessionStartedAt
  }, {
    quiet: true,
    resetOnNotFound: false
  }).then((result) => {
    if (!result || state.roomId !== roomId || state.playerId !== playerId) return false;
    // Focus recovery is an authoritative session boundary. It must not be
    // rejected because an acknowledgement from the previous session carried a
    // slightly newer timestamp.
    state.lastMovementServerNow = 0;
    state.lastStateServerNow = 0;
    applyState(result, { authoritative: true });
    const authoritative = result.players?.find((player) => player.id === result.selfId);
    const rendered = authoritative ? state.renderPlayers.get(authoritative.id) : null;
    if (rendered && !(authoritative.jumpMotion && Number(authoritative.jumpMotion.endsAt) > estimatedServerNow(result))) {
      rendered.x = Number(authoritative.x);
      rendered.y = Number(authoritative.y);
      rendered.targetX = Number(authoritative.x);
      rendered.targetY = Number(authoritative.y);
      rendered.velocityX = 0;
      rendered.velocityY = 0;
    } else {
      anchorLocalJumpRender();
    }
    return true;
  }).finally(() => {
    state.focusResyncing = false;
    state.focusResyncPromise = null;
  });
  return state.focusResyncPromise;
}

async function sendHttpMovement(payload) {
  if (state.offlineMode) return state.offlineClient?.request("/api/move", payload);
  const response = await fetch(apiUrl("/api/move"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  return response.json();
}

function applyMovementAck(result) {
  const resultSession = String(result?.movementSession || "");
  if (resultSession && resultSession !== state.movementSession) return;
  const requestSeq = Number(result?.movementSeq) || 0;
  if (requestSeq && requestSeq < state.lastMoveAppliedSeq) return;
  if (requestSeq) state.lastMoveAppliedSeq = requestSeq;
  if (requestSeq && requestSeq >= state.movementStopPendingSeq) state.movementStopPendingSeq = 0;
  if (!result?.ok) return;
  const data = state.data;
  if (!data || result.roomId !== data.roomId || result.playerId !== data.selfId) return;
  state.lastMoveAppliedClock = Math.max(state.lastMoveAppliedClock, Number(result.movementClock) || 0);
  state.lastMovementServerNow = Math.max(state.lastMovementServerNow, Number(result.serverNow) || 0);
  const player = data.players.find((entry) => entry.id === data.selfId);
  if (!player) return;
  data.self.stamina = result.stamina;
  data.self.slowedUntil = result.slowedUntil;
  data.self.taserSlowedUntil = result.taserSlowedUntil;
  data.self.gravityStormSlowUntil = result.gravityStormSlowUntil;
  data.self.gravityStormSlowMultiplier = result.gravityStormSlowMultiplier;
  data.self.lastGravityStormDamage = result.lastGravityStormDamage;
  data.self.movementMode = result.movementMode;
  const authoritativeSpeed = Math.max(
    0.01,
    Number(result.speedMultiplier) || Number(data.self.speedMultiplier) || Number(player.speedMultiplier) || 1
  );
  const authoritativeAcceleration = Math.max(
    0.01,
    Number(result.accelerationMultiplier) || Number(data.self.accelerationMultiplier) || 1
  );
  data.self.speedMultiplier = authoritativeSpeed;
  data.self.accelerationMultiplier = authoritativeAcceleration;
  player.speedMultiplier = authoritativeSpeed;
  player.accelerationMultiplier = authoritativeAcceleration;
  player.x = result.x;
  player.y = result.y;
  player.moveX = result.moveX;
  player.moveY = result.moveY;
  player.moving = Math.hypot(result.moveX, result.moveY) > 0.01;
  player.movementMode = result.movementMode;
  player.movementSession = state.movementSession;
  player.movementSeq = requestSeq;
  player.movementClock = Number(result.movementClock) || 0;
  player.slowedUntil = result.slowedUntil;
  player.taserSlowedUntil = result.taserSlowedUntil;
  player.gravityStormSlowUntil = result.gravityStormSlowUntil;
  player.gravityStormSlowMultiplier = result.gravityStormSlowMultiplier;
  player.lastGravityStormDamage = result.lastGravityStormDamage;

  const rendered = state.renderPlayers.get(player.id);
  if (!rendered) return;
  rendered.speedMultiplier = authoritativeSpeed;
  rendered.predictionLeadMultiplier = authoritativeSpeed;
  rendered.predictionLeadUntil = 0;
  rendered.targetX = result.x;
  rendered.targetY = result.y;
  rendered.moveX = result.moveX;
  rendered.moveY = result.moveY;
  rendered.moving = player.moving;
  rendered.updatedAt = performance.now();
}

function isDashing() {
  const tabletDash = state.tabletOpen &&
    state.tabletStick.pointerId !== null &&
    state.tabletStick.mode === "dash";
  return tabletDash || state.dashHeld || state.keys.has("dash");
}

function isSlowWalking() {
  const tabletSlow = state.tabletOpen &&
    state.tabletStick.pointerId !== null &&
    state.tabletStick.mode === "slow";
  return !isDashing() && (tabletSlow || state.slowWalkHeld || state.keys.has("slow"));
}

function getDirection() {
  if (state.enhanceHold.kind || state.throwTargeting.active || state.clairvoyance.active || state.jumpPreparing || state.focusResyncing || document.hidden || !document.hasFocus() || isActionBlocked()) return { dx: 0, dy: 0 };
  const stickLength = Math.hypot(state.tabletStick.dx, state.tabletStick.dy);
  if (state.tabletOpen && stickLength > 0.01) {
    return { dx: state.tabletStick.dx, dy: state.tabletStick.dy };
  }
  const active = new Set([...state.keys, ...state.pad]);
  const directions = [...active];
  const left = directions.some((direction) => direction === "left" || direction.includes("left"));
  const right = directions.some((direction) => direction === "right" || direction.includes("right"));
  const up = directions.some((direction) => direction === "up" || direction.includes("up"));
  const down = directions.some((direction) => direction === "down" || direction.includes("down"));
  const dx = Number(right) - Number(left);
  const dy = Number(down) - Number(up);
  const len = Math.hypot(dx, dy);
  return len > 1 ? { dx: dx / len, dy: dy / len } : { dx, dy };
}

function activeStaminaFor(data) {
  if (data?.self.drone?.active) return Number.POSITIVE_INFINITY;
  return data?.self.stamina || 0;
}

function selfPlayer() {
  return state.data?.players.find((player) => player.id === state.data.selfId) || null;
}

function isDefenderHunter(player) {
  return player?.role === "defender" && !player.isBot;
}

function canSelectCombatTarget(viewer, candidate) {
  if (!viewer || !candidate || viewer.id === candidate.id) return false;
  return true;
}

function nearestTarget() {
  const data = state.data;
  const self = selfPlayer();
  if (!data || !self) return null;
  return data.players
    .filter((player) => player.id !== self.id && canSelectCombatTarget(data.self, player) && player.alive && !player.ejected)
    .map((player) => ({ ...player, dist: dist(self, player) }))
    .filter((player) => player.dist <= data.settings.killRange)
    .sort((a, b) => a.dist - b.dist)[0] || null;
}

function aimedTarget(data = state.data) {
  if (!data || !data.self.aimTargetId) return null;
  const self = data.players.find((player) => player.id === data.selfId);
  const target = data.players.find((player) => player.id === data.self.aimTargetId);
  if (!self || !target || !target.alive || target.ejected) return null;
  if (!canSelectCombatTarget(data.self, target)) return null;
  return dist(self, target) <= data.settings.killRange ? target : null;
}

function nearestTask() {
  const data = state.data;
  const self = selfPlayer();
  if (!data || !self) return null;
  return (data.self.tasks || [])
    .filter((task) => !task.done)
    .map((task) => {
      const station = data.map.stations.find((item) => item.id === task.stationId);
      return station ? { ...task, station, dist: dist(self, station) } : null;
    })
    .filter(Boolean)
    .filter((task) => task.dist <= data.map.taskRange)
    .sort((a, b) => a.dist - b.dist)[0] || null;
}

function nearestStation(predicate) {
  const data = state.data;
  const self = selfPlayer();
  if (!data || !self) return null;
  return data.map.stations
    .filter(predicate)
    .map((station) => ({ ...station, dist: dist(self, station) }))
    .filter((station) => station.dist <= data.map.taskRange)
    .sort((a, b) => a.dist - b.dist)[0] || null;
}

function nearestMapObject() {
  const data = state.data;
  const self = selfPlayer();
  if (!data || !self) return null;
  return (data.map.objects || [])
    .filter((object) => object.interactive)
    .map((object) => ({ ...object, dist: dist(self, object) }))
    .filter((object) => object.dist <= Number(object.useRange || data.map.taskRange || 150))
    .sort((a, b) => a.dist - b.dist)[0] || null;
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function drawLoop(timestamp = 0, engineDelta = 0) {
  state.frameNow = timestamp || performance.now();
  state.frameDelta = engineDelta || (state.lastFrameAt ? Math.min(100, state.frameNow - state.lastFrameAt) : 16.67);
  state.lastFrameAt = state.frameNow;
  if (state.frameNow - state.lastMovementPumpAt >= MOVEMENT_SEND_INTERVAL_MS) {
    state.lastMovementPumpAt = state.frameNow;
    sendMovement();
  }
  drawTitleEffects(state.frameNow);
  updateJumpPreparationUi();
  try {
    if (state.screen === "game") draw();
    const drawMode = state.data ? state.data.phase : "idle";
    if (document.body.dataset.drawMode !== drawMode) document.body.dataset.drawMode = drawMode;
    if (document.body.dataset.drawError) delete document.body.dataset.drawError;
  } catch (error) {
    document.body.dataset.drawError = error?.message || String(error);
    console.error("Canvas draw failed", error);
  }
}

function drawCanvasStage(name, callback) {
  try {
    callback();
    if (state.lastCanvasStageError.startsWith(`${name}:`)) {
      state.lastCanvasStageError = "";
      delete document.body.dataset.drawStageError;
    }
  } catch (error) {
    const message = `${name}:${error?.message || String(error)}`;
    document.body.dataset.drawStageError = message;
    if (state.lastCanvasStageError !== message) console.error(`Canvas stage failed: ${name}`, error);
    state.lastCanvasStageError = message;
  }
}

function draw() {
  const data = state.data;
  const canvas = els.canvas;
  const w = canvas.width;
  const h = canvas.height;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "none";
  ctx.setLineDash([]);
  state.markerHitTargets.length = 0;
  ctx.fillStyle = data ? "#91a8b7" : "#25323d";
  ctx.fillRect(0, 0, w, h);
  if (!data) {
    drawIdle(w, h);
    return;
  }
  if (data.phase !== "playing") {
    if (state.tabletOpen) setTabletOpen(false, { persist: false, focus: false });
    if (state.operatorBranchesOpen) setOperatorBranchesOpen(false);
  }

  drawCanvasStage("motion", () => {
    advanceRenderPlayers(data);
    advanceRenderDrone(data);
  });
  const worldZoom = worldZoomFor(data);
  const camera = cameraFor(data, w, h, worldZoom);
  const viewW = w / worldZoom;
  const viewH = h / worldZoom;
  state.drawViewport = {
    left: camera.x,
    top: camera.y,
    right: camera.x + viewW,
    bottom: camera.y + viewH
  };
  drawCanvasStage("map", () => {
    ctx.save();
    try {
      ctx.scale(worldZoom, worldZoom);
      ctx.translate(-camera.x, -camera.y);
      drawMap(data, camera, viewW, viewH);
    } finally {
      ctx.restore();
    }
  });

  drawCanvasStage("world", () => {
    ctx.save();
    try {
      ctx.scale(worldZoom, worldZoom);
      ctx.translate(-camera.x, -camera.y);
      drawStations(data);
      drawMapObjects(data);
      drawResolvePoint(data);
      drawAlchemyObjects(data);
      drawGravityZones(data);
      drawHazardFields(data);
      drawFacilityEffects(data);
      drawBodies(data);
      drawWorldSoundEffects();
      drawJumpPreparationEffect(data);
      drawThrowLandingPreview(data);
      drawStandaloneClairvoyanceAte(data);
      drawPlayers(data);
      drawHitEffects();
      drawMagicEffects();
      drawAttackTargets(data);
    } finally {
      ctx.restore();
    }
  });

  drawCanvasStage("scope-visibility", () => drawScopeVisibilityMask(data, camera, w, h, worldZoom));
  drawCanvasStage("task-indicators", () => drawTaskEdgeIndicators(data, camera, w, h, worldZoom));
  drawCanvasStage("repair-indicators", () => drawSabotageRepairIndicators(data, camera, w, h, worldZoom));
  drawCanvasStage("vending-indicator", () => drawVendingEdgeIndicator(data, camera, w, h, worldZoom));
  drawCanvasStage("hud", () => drawHud(data, w, h));
  drawCanvasStage("smartphone-repair", () => drawSmartphoneRepairControl(data, w));
  drawCanvasStage("minimap", () => drawMinimap(data, w, h));
  drawCanvasStage("mode-banner", () => drawModeBanner(data, w));
  if (state.expandedMapOpen) drawCanvasStage("expanded-map", () => drawExpandedMap(data));
  drawCanvasStage("lighting", () => drawLighting(data, w, h, camera, worldZoom));
  drawCanvasStage("kill-animation", () => drawKillAnimations(data, camera, w, h, worldZoom));
  drawCanvasStage("sensory", () => drawSensoryBlackout(data, w, h));
  drawCanvasStage("marker-explanation", () => drawMarkerExplanation(w, h));
}

function sniperScopeActive(data = state.data) {
  return false;
}

function worldZoomFor(data = state.data) {
  if (!data) return CAMERA_ZOOM;
  if (throwTargetClairvoyanceActive(data) || state.clairvoyance.active) return CLAIRVOYANCE_ZOOM;
  if (state.cameraViewIndex >= 0) return CAMERA_ZOOM;
  if (sniperScopeActive(data)) return SR_SCOPE_ZOOM;
  return CAMERA_ZOOM;
}

function throwTargetClairvoyanceActive(data = state.data) {
  if (!state.throwTargeting.active || !data?.map) return false;
  const self = data.players?.find((player) => player.id === data.selfId);
  if (!self) return false;
  const origin = renderedPlayer(self);
  const halfWidth = Math.max(120, els.canvas.width / CAMERA_ZOOM / 2 - 72);
  const halfHeight = Math.max(120, els.canvas.height / CAMERA_ZOOM / 2 - 72);
  return Math.abs(state.throwTargeting.targetX - origin.x) > halfWidth ||
    Math.abs(state.throwTargeting.targetY - origin.y) > halfHeight;
}

function scopeRayEnd(data, origin, angle, maxDistance) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  let lastX = origin.x;
  let lastY = origin.y;
  for (let distance = 12; distance <= maxDistance; distance += 12) {
    const x = origin.x + dx * distance;
    const y = origin.y + dy * distance;
    if (!isClientWalkable(data, x, y, 2)) break;
    lastX = x;
    lastY = y;
  }
  return { x: lastX, y: lastY };
}

function drawScopeVisibilityMask(data, camera, w, h, zoom) {
  if (!sniperScopeActive(data)) return;
  const self = selfPlayer();
  if (!self) return;
  const origin = renderedPlayer(self);
  const weapon = (data.self.gunnerWeapons || []).find((entry) => entry.id === "sniper");
  const maxDistance = Math.max(900, Number(weapon?.range) || 1200);
  const rays = 240;
  const points = [];
  for (let index = 0; index < rays; index += 1) {
    const angle = Math.PI * 2 * index / rays;
    const end = scopeRayEnd(data, origin, angle, maxDistance);
    points.push({ x: (end.x - camera.x) * zoom, y: (end.y - camera.y) * zoom });
  }
  ctx.save();
  ctx.fillStyle = "rgba(2, 5, 9, 0.97)";
  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) ctx.lineTo(points[index].x, points[index].y);
  ctx.closePath();
  ctx.fill("evenodd");
  ctx.restore();
}

function drawSensoryBlackout(data, w, h) {
  const liveNow = estimatedServerNow(data);
  const unconscious = (data.self.unconsciousUntil || 0) > liveNow;
  if (!unconscious) return;
  const endsAt = data.self.unconsciousUntil;
  ctx.save();
  ctx.fillStyle = "#030506";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#d7e3e9";
  ctx.font = "900 24px Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`意識消失 ${Math.max(0, (endsAt - liveNow) / 1000).toFixed(1)}秒`, w / 2, h / 2);
  ctx.restore();
}

function drawModeBanner(data, w) {
  let text = "";
  if (throwTargetClairvoyanceActive(data)) {
    text = "千里眼 / 着地点追従 / 全域投擲";
  } else if (state.clairvoyance.active) {
    text = "千里眼 / 広域観測 / Zで解除";
  } else if (state.cameraViewIndex >= 0) {
    const camera = currentCamera(data);
    const available = availableCameraIndices(data);
    const position = available.indexOf(state.cameraViewIndex) + 1;
    text = `監視カメラ / ${camera?.label || "カメラ"} / ${position}-${available.length}`;
  } else if (data.self.aimTargetId) {
    const target = data.players.find((player) => player.id === data.self.aimTargetId);
    const remaining = Math.max(0, data.self.aimReadyAt - estimatedServerNow(data));
    text = remaining > 0
      ? `照準中: ${target?.name || "対象"} / 残り ${(remaining / 1000).toFixed(1)}秒`
      : `確殺処理中: ${target?.name || "対象"}`;
  }
  if (!text) return;
  ctx.save();
  ctx.fillStyle = "rgba(8, 25, 32, 0.88)";
  roundRect(w / 2 - 180, 16, 360, 34, 6, true, false);
  ctx.fillStyle = "#ecfeff";
  ctx.font = "800 13px Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, 33);
  ctx.restore();
}

function drawIdle(w, h) {
  ctx.fillStyle = "#9fb6c4";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  for (let x = 0; x < w; x += 42) {
    for (let y = 0; y < h; y += 42) {
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

function cameraFor(data, w, h, zoom = 1) {
  const self = selfPlayer();
  const selectedCamera = currentCamera(data);
  const throwTarget = state.throwTargeting.active
    ? { x: state.throwTargeting.targetX, y: state.throwTargeting.targetY }
    : null;
  const clairvoyanceTarget = !throwTarget && state.clairvoyance.active
    ? { x: state.clairvoyance.x, y: state.clairvoyance.y }
    : null;
  const scopeTarget = !throwTarget && !clairvoyanceTarget && !selectedCamera && sniperScopeActive(data) && self
    ? {
        x: renderedPlayer(self).x + (Number(data.self.aimX) || 0) * 470,
        y: renderedPlayer(self).y + (Number(data.self.aimY) || 1) * 470
      }
    : null;
  const target = throwTarget || clairvoyanceTarget || selectedCamera || scopeTarget || (self ? renderedPlayer(self) : { x: data.map.width / 2, y: data.map.height / 2 });
  const viewW = w / zoom;
  const viewH = h / zoom;
  const desiredX = clamp(target.x - viewW / 2, 0, Math.max(0, data.map.width - viewW));
  const desiredY = clamp(target.y - viewH / 2, 0, Math.max(0, data.map.height - viewH));
  const mode = throwTarget
    ? `throw-target:${throwTargetClairvoyanceActive(data) ? "clairvoyance" : "follow"}:${zoom}`
    : clairvoyanceTarget
      ? `clairvoyance:${zoom}`
      : selectedCamera
      ? `camera:${selectedCamera.id}`
      : scopeTarget
        ? `sniper:${zoom}`
        : `player:${data.selfId}:${zoom}`;
  const camera = state.camera;
  if (!camera.initialized || camera.mode !== mode) {
    camera.x = desiredX;
    camera.y = desiredY;
    camera.vx = 0;
    camera.vy = 0;
    camera.initialized = true;
    camera.mode = mode;
  } else if (camera.frame !== state.frameNow) {
    const delta = (state.frameDelta || 16.67) / 1000;
    const smoothedX = smoothDamp(camera.x, desiredX, camera.vx || 0, 0.085, delta);
    const smoothedY = smoothDamp(camera.y, desiredY, camera.vy || 0, 0.085, delta);
    camera.x = smoothedX.value;
    camera.y = smoothedY.value;
    camera.vx = smoothedX.velocity;
    camera.vy = smoothedY.velocity;
  }
  camera.frame = state.frameNow;
  return { x: camera.x, y: camera.y };
}

function worldPointVisible(x, y, padding = 0) {
  const viewport = state.drawViewport;
  if (!viewport) return true;
  return x >= viewport.left - padding && x <= viewport.right + padding &&
    y >= viewport.top - padding && y <= viewport.bottom + padding;
}

function worldRectVisible(rect, padding = 0) {
  const viewport = state.drawViewport;
  if (!viewport) return true;
  return rect.x + rect.w >= viewport.left - padding && rect.x <= viewport.right + padding &&
    rect.y + rect.h >= viewport.top - padding && rect.y <= viewport.bottom + padding;
}

function corridorRenderSegments(corridor) {
  return Array.isArray(corridor?.renderSegments) && corridor.renderSegments.length
    ? corridor.renderSegments
    : [corridor];
}

function appendWorldAreaPath(area) {
  if (Array.isArray(area?.polygon) && area.polygon.length >= 3) {
    ctx.moveTo(area.polygon[0][0], area.polygon[0][1]);
    for (let index = 1; index < area.polygon.length; index += 1) {
      ctx.lineTo(area.polygon[index][0], area.polygon[index][1]);
    }
    ctx.closePath();
    return;
  }
  ctx.rect(area.x, area.y, area.w, area.h);
}

function drawMap(data, camera, w, h) {
  const map = data.map;
  ctx.fillStyle = "#cdeefa";
  ctx.fillRect(camera.x, camera.y, w, h);
  const visibleRooms = map.rooms.filter((rect) => worldRectVisible(rect, 80));
  const visibleCorridors = map.corridors.filter((rect) => worldRectVisible(rect, 80));
  const visibleDoors = map.doors.filter((rect) => worldRectVisible(rect, 50));
  ctx.save();
  ctx.beginPath();
  const visibleCorridorSegments = visibleCorridors.flatMap((corridor) => corridorRenderSegments(corridor));
  // Door pixels belong to the authored full-map texture too. Excluding their
  // geometry exposes the floor underlay as dark rectangles at boundaries.
  for (const rect of [...visibleRooms, ...visibleCorridorSegments, ...visibleDoors]) {
    appendWorldAreaPath(rect);
  }
  ctx.clip();
  // Composite images contain intentional transparent doorway cutouts. The
  // shared floor is their underlay, not a fallback, so those cutouts never
  // expose the out-of-bounds canvas color.
  drawFloor(data, camera, w, h);
  drawFieldEnvironment(data, visibleRooms, visibleCorridors);
  drawCanonicalPortalOpenings(data, camera, w, h);
  drawDoorPortals(data);
  ctx.restore();
  drawTextureSurfaceAnimation(data);
  drawAmbientMapAnimations(data, visibleRooms, visibleCorridors);

  visibleRooms.forEach((room) => {
    ctx.fillStyle = "#183448";
    ctx.globalAlpha = 0.95;
    ctx.font = "800 13px Segoe UI, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(room.label, room.x + 14, room.y + 24);
    ctx.globalAlpha = 1;
  });

  data.map.doors
    .filter((door) => data.activeDoorIds.includes(door.id) && worldRectVisible(door, 50))
    .forEach((door) => {
    ctx.fillStyle = "#ef4444";
    ctx.strokeStyle = "#fecaca";
    ctx.lineWidth = 2;
    roundRect(door.x, door.y, door.w, door.h, 3, true, true);
  });
}

function mapRoomShadeMask(data, room) {
  const source = state.textures.fullMapComposites?.[data.map.id];
  if (!source?.complete || !source.naturalWidth || !source.naturalHeight) return null;
  const cache = state.textures.mapShadowMasks;
  const cacheKey = `${data.map.id}:${room.id}:${source.naturalWidth}x${source.naturalHeight}`;
  if (cache?.has(cacheKey)) return cache.get(cacheKey);

  const sourceX = room.x / data.map.width * source.naturalWidth;
  const sourceY = room.y / data.map.height * source.naturalHeight;
  const sourceWidth = room.w / data.map.width * source.naturalWidth;
  const sourceHeight = room.h / data.map.height * source.naturalHeight;
  const scale = Math.min(1, 480 / Math.max(1, sourceWidth), 480 / Math.max(1, sourceHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(48, Math.round(sourceWidth * scale));
  canvas.height = Math.max(48, Math.round(sourceHeight * scale));
  const local = canvas.getContext("2d", { willReadFrequently: true });
  if (!local) return null;

  try {
    local.drawImage(source, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    const pixels = local.getImageData(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;
    const luminance = new Float32Array(width * height);
    const integral = new Float64Array((width + 1) * (height + 1));
    for (let y = 0; y < height; y += 1) {
      let rowSum = 0;
      for (let x = 0; x < width; x += 1) {
        const pixelIndex = y * width + x;
        const offset = pixelIndex * 4;
        const value = pixels.data[offset] * 0.2126 + pixels.data[offset + 1] * 0.7152 + pixels.data[offset + 2] * 0.0722;
        luminance[pixelIndex] = value;
        rowSum += value;
        integral[(y + 1) * (width + 1) + x + 1] = integral[y * (width + 1) + x + 1] + rowSum;
      }
    }

    const LOCAL_MEAN_RADIUS = Math.max(7, Math.round(Math.min(width, height) * 0.035));
    const localMean = (x, y) => {
      const x0 = Math.max(0, x - LOCAL_MEAN_RADIUS);
      const y0 = Math.max(0, y - LOCAL_MEAN_RADIUS);
      const x1 = Math.min(width - 1, x + LOCAL_MEAN_RADIUS);
      const y1 = Math.min(height - 1, y + LOCAL_MEAN_RADIUS);
      const stride = width + 1;
      const sum = integral[(y1 + 1) * stride + x1 + 1]
        - integral[y0 * stride + x1 + 1]
        - integral[(y1 + 1) * stride + x0]
        + integral[y0 * stride + x0];
      return sum / Math.max(1, (x1 - x0 + 1) * (y1 - y0 + 1));
    };

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const pixelIndex = y * width + x;
        const offset = pixelIndex * 4;
        const red = pixels.data[offset];
        const green = pixels.data[offset + 1];
        const blue = pixels.data[offset + 2];
        const sourceAlpha = pixels.data[offset + 3] / 255;
        const value = luminance[pixelIndex];
        const left = luminance[y * width + Math.max(0, x - 1)];
        const right = luminance[y * width + Math.min(width - 1, x + 1)];
        const up = luminance[Math.max(0, y - 1) * width + x];
        const down = luminance[Math.min(height - 1, y + 1) * width + x];
        const edgeGradient = Math.hypot(right - left, down - up) * 0.5;
        const localDarkness = localMean(x, y) - value;
        const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
        const shadowStrength = clamp((localDarkness - 4) / 25, 0, 1);
        const softFoliageEdge = 1 - clamp((edgeGradient - 2.8) / 17, 0, 1);
        const lowChromaWeight = clamp(1 - chroma / 112, 0.2, 1);
        const tonalWindow = clamp((value - 46) / 48, 0, 1) * clamp((202 - value) / 45, 0, 1);
        const borderSuppression = x < 2 || y < 2 || x >= width - 2 || y >= height - 2 ? 0 : 1;
        const alpha = sourceAlpha * shadowStrength * softFoliageEdge * lowChromaWeight * tonalWindow * borderSuppression;
        pixels.data[offset] = 25;
        pixels.data[offset + 1] = 43;
        pixels.data[offset + 2] = 25;
        pixels.data[offset + 3] = Math.round(alpha * 192);
      }
    }
    local.clearRect(0, 0, canvas.width, canvas.height);
    local.putImageData(pixels, 0, 0);
  } catch {
    return null;
  }
  cache?.set(cacheKey, canvas);
  return canvas;
}

const MAP_PLANT_WIND_ROOM_IDS = new Set([
  "archive", "reactor", "atrium", "greenhouse", "cafeteria", "medical", "comms"
]);

function mapPlantLayer(data, area) {
  const source = state.textures.fullMapComposites?.[data.map.id];
  if (!source?.complete || !source.naturalWidth || !source.naturalHeight) return null;
  const cache = state.textures.mapPlantLayers;
  const areaKey = area.id || `${area.x}:${area.y}:${area.w}:${area.h}`;
  const cacheKey = `${data.map.id}:${areaKey}:${source.naturalWidth}x${source.naturalHeight}`;
  if (cache?.has(cacheKey)) return cache.get(cacheKey) || null;

  const sourceX = area.x / data.map.width * source.naturalWidth;
  const sourceY = area.y / data.map.height * source.naturalHeight;
  const sourceWidth = area.w / data.map.width * source.naturalWidth;
  const sourceHeight = area.h / data.map.height * source.naturalHeight;
  const scale = Math.min(1, 430 / Math.max(1, sourceWidth), 430 / Math.max(1, sourceHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(32, Math.round(sourceWidth * scale));
  canvas.height = Math.max(32, Math.round(sourceHeight * scale));
  const local = canvas.getContext("2d", { willReadFrequently: true });
  if (!local) return null;

  try {
    local.drawImage(source, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    const pixels = local.getImageData(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;
    const CELL = 6;
    const columns = Math.ceil(width / CELL);
    const rows = Math.ceil(height / CELL);
    const cellHits = new Uint16Array(columns * rows);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const offset = (y * width + x) * 4;
        const red = pixels.data[offset];
        const green = pixels.data[offset + 1];
        const blue = pixels.data[offset + 2];
        const sourceAlpha = pixels.data[offset + 3] / 255;
        const saturation = Math.max(red, green, blue) - Math.min(red, green, blue);
        const greenLead = green - Math.max(red * 0.84 + blue * 0.16, blue * 0.92);
        const leafHue = clamp((greenLead - 2) / 38, 0, 1);
        const leafSaturation = clamp((saturation - 10) / 72, 0, 1);
        const leafLuminance = clamp((green - 24) / 74, 0, 1) * clamp((238 - green) / 42, 0.25, 1);
        const confidence = leafHue * leafSaturation * leafLuminance;
        pixels.data[offset + 3] = Math.round(sourceAlpha * confidence ** 0.72 * 224);
        if (pixels.data[offset + 3] > 28) {
          cellHits[Math.floor(y / CELL) * columns + Math.floor(x / CELL)] += 1;
        }
      }
    }

    const occupied = new Uint8Array(columns * rows);
    for (let index = 0; index < occupied.length; index += 1) occupied[index] = cellHits[index] >= 3 ? 1 : 0;
    const visited = new Uint8Array(occupied.length);
    const clusters = [];
    for (let start = 0; start < occupied.length; start += 1) {
      if (!occupied[start] || visited[start]) continue;
      const queue = [start];
      visited[start] = 1;
      let head = 0;
      let minColumn = columns;
      let maxColumn = 0;
      let minRow = rows;
      let maxRow = 0;
      let hits = 0;
      while (head < queue.length) {
        const index = queue[head++];
        const column = index % columns;
        const row = Math.floor(index / columns);
        minColumn = Math.min(minColumn, column);
        maxColumn = Math.max(maxColumn, column);
        minRow = Math.min(minRow, row);
        maxRow = Math.max(maxRow, row);
        hits += cellHits[index];
        for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
          for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
            if (!rowOffset && !columnOffset) continue;
            const nextColumn = column + columnOffset;
            const nextRow = row + rowOffset;
            if (nextColumn < 0 || nextColumn >= columns || nextRow < 0 || nextRow >= rows) continue;
            const next = nextRow * columns + nextColumn;
            if (!occupied[next] || visited[next]) continue;
            visited[next] = 1;
            queue.push(next);
          }
        }
      }
      if (hits < 18) continue;
      const x = Math.max(0, minColumn * CELL - 4);
      const y = Math.max(0, minRow * CELL - 4);
      const w = Math.min(width - x, (maxColumn - minColumn + 1) * CELL + 8);
      const h = Math.min(height - y, (maxRow - minRow + 1) * CELL + 8);
      let visiblePixels = 0;
      for (let sampleY = y; sampleY < y + h; sampleY += 2) {
        for (let sampleX = x; sampleX < x + w; sampleX += 2) {
          if (pixels.data[(sampleY * width + sampleX) * 4 + 3] > 28) visiblePixels += 1;
        }
      }
      const fillRatio = visiblePixels / Math.max(1, Math.ceil(w / 2) * Math.ceil(h / 2));
      if (fillRatio > 0.64 || (w > width * 0.46 && h < height * 0.16)) continue;
      clusters.push({ x, y, w, h, weight: hits });
    }

    local.clearRect(0, 0, width, height);
    local.putImageData(pixels, 0, 0);
    clusters.sort((left, right) => right.weight - left.weight);
    const result = clusters.length ? { canvas, clusters: clusters.slice(0, 36) } : null;
    cache?.set(cacheKey, result || false);
    return result;
  } catch {
    cache?.set(cacheKey, false);
    return null;
  }
}

function drawMapPlantWind(data, area, time, intensity = 1) {
  if (area.room && !MAP_PLANT_WIND_ROOM_IDS.has(area.room)) return false;
  if (area.id && data.map.rooms.includes(area) && !MAP_PLANT_WIND_ROOM_IDS.has(area.id)) return false;
  const layer = mapPlantLayer(data, area);
  if (!layer?.clusters?.length) return false;
  const sampledTime = Math.floor(time * 60) / 60;
  const seed = [...String(area.id || `${area.x}:${area.y}`)].reduce((value, character) => value + character.charCodeAt(0), 0);
  const coherentWind = Math.sin(sampledTime * Math.PI * 0.42 + seed * 0.017) * 0.62
    + Math.sin(sampledTime * Math.PI * 0.91 + seed * 0.031) * 0.25
    + Math.sin(sampledTime * Math.PI * 1.83 + seed * 0.007) * 0.13;
  const scaleX = area.w / layer.canvas.width;
  const scaleY = area.h / layer.canvas.height;

  ctx.save();
  ctx.beginPath();
  appendWorldAreaPath(area);
  ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = IMAGE_SMOOTHING_QUALITY;
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 0.72 * intensity;
  layer.clusters.forEach((cluster, index) => {
    const localFlutter = coherentWind * 0.76
      + Math.sin(sampledTime * (1.18 + index * 0.017) + seed * 0.021 + index * 1.31) * 0.17
      + Math.sin(sampledTime * 2.74 + index * 0.73) * 0.07;
    const worldHeight = cluster.h * scaleY;
    const tipAmplitude = clamp(worldHeight * 0.075, 1.1, 7.2);
    const slices = Math.max(5, Math.min(9, Math.round(cluster.h / 9)));
    for (let slice = 0; slice < slices; slice += 1) {
      const sourceTop = cluster.y + cluster.h * slice / slices;
      const sourceBottom = cluster.y + cluster.h * (slice + 1) / slices;
      const sourceSliceHeight = Math.max(1, sourceBottom - sourceTop + 0.75);
      const normalizedHeight = 1 - (slice + 0.5) / slices;
      const bend = normalizedHeight ** 1.65;
      const xOffset = localFlutter * tipAmplitude * bend;
      const yOffset = -Math.abs(localFlutter) * tipAmplitude * 0.12 * bend;
      ctx.drawImage(
        layer.canvas,
        cluster.x,
        sourceTop,
        cluster.w,
        sourceSliceHeight,
        area.x + cluster.x * scaleX + xOffset,
        area.y + sourceTop * scaleY + yOffset,
        cluster.w * scaleX,
        sourceSliceHeight * scaleY + 0.65
      );
    }
  });
  ctx.restore();
  return true;
}

const KOMOREBI_SUN_ELEVATION = 52 * Math.PI / 180;
const KOMOREBI_SUN_AZIMUTH = -38 * Math.PI / 180;
const KOMOREBI_WIND_AZIMUTH = 18 * Math.PI / 180;

function projectedLeafShadowOffset(canopyHeight, angularDeflection, yawDeflection) {
  const solarZenith = Math.PI / 2 - KOMOREBI_SUN_ELEVATION;
  const longitudinal = canopyHeight * (
    Math.tan(solarZenith + angularDeflection) - Math.tan(solarZenith)
  );
  const lateral = canopyHeight * yawDeflection / Math.max(0.2, Math.cos(solarZenith));
  const sunX = Math.cos(KOMOREBI_SUN_AZIMUTH);
  const sunY = Math.sin(KOMOREBI_SUN_AZIMUTH);
  const windX = Math.cos(KOMOREBI_WIND_AZIMUTH);
  const windY = Math.sin(KOMOREBI_WIND_AZIMUTH);
  return {
    x: longitudinal * sunX + lateral * windX,
    y: longitudinal * sunY + lateral * windY
  };
}

function drawAuthoredMapShadeAnimation(data, room, time, intensity = 1) {
  const shadeMask = mapRoomShadeMask(data, room);
  if (!shadeMask) return false;
  const sampledTime = Math.floor(time * 60) / 60;
  const seed = [...String(room.id || "room")].reduce((value, character) => value + character.charCodeAt(0), 0);
  const seedPhase = seed * 0.013;
  const canopyHeight = Math.min(room.w, room.h) * 0.2;
  const coherentGust = Math.sin(Math.PI * 2 * 0.075 * sampledTime + seedPhase) * 0.56
    + Math.sin(Math.PI * 2 * 0.163 * sampledTime + seedPhase * 1.7) * 0.29
    + Math.sin(Math.PI * 2 * 0.31 * sampledTime + 1.3) * 0.15;
  const coherentOffset = projectedLeafShadowOffset(canopyHeight, coherentGust * 0.015, coherentGust * 0.007);

  ctx.save();
  ctx.beginPath();
  appendWorldAreaPath(room);
  ctx.clip();
  ctx.globalCompositeOperation = "multiply";
  ctx.filter = "blur(0.85px)";
  ctx.globalAlpha = 0.2 * intensity;
  ctx.drawImage(shadeMask, room.x + coherentOffset.x, room.y + coherentOffset.y, room.w, room.h);

  const penumbraOffset = projectedLeafShadowOffset(canopyHeight, coherentGust * 0.009, coherentGust * 0.004);
  ctx.filter = "blur(1.65px)";
  ctx.globalAlpha = 0.09 * intensity;
  ctx.drawImage(shadeMask, room.x + penumbraOffset.x, room.y + penumbraOffset.y, room.w, room.h);
  ctx.filter = "blur(0.65px)";

  const clusterColumns = 4;
  const clusterRows = 3;
  for (let cluster = 0; cluster < clusterColumns * clusterRows; cluster += 1) {
    const column = cluster % clusterColumns;
    const row = Math.floor(cluster / clusterColumns);
    const spatialPhase = seedPhase + column * 1.37 + row * 2.11;
    const localFlutter = coherentGust * 0.72
      + Math.sin(Math.PI * 2 * (0.21 + cluster * 0.004) * sampledTime + spatialPhase) * 0.2
      + Math.sin(Math.PI * 2 * 0.47 * sampledTime + spatialPhase * 1.61) * 0.08;
    const localOffset = projectedLeafShadowOffset(
      canopyHeight * (0.82 + row * 0.08),
      localFlutter * 0.017,
      localFlutter * 0.009
    );
    const centerX = room.x + room.w * (0.14 + column * 0.24 + Math.sin(spatialPhase) * 0.018);
    const centerY = room.y + room.h * (0.18 + row * 0.31 + Math.cos(spatialPhase) * 0.022);
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, room.w * 0.19, room.h * 0.235, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.globalAlpha = 0.115 * intensity;
    ctx.drawImage(shadeMask, room.x + localOffset.x, room.y + localOffset.y, room.w, room.h);
    ctx.restore();
  }
  ctx.filter = "none";

  // Tiny sunlit dust motes are the complementary E layer. They follow the
  // same wind field but do not redraw or duplicate the foliage-shadow texture.
  ctx.globalCompositeOperation = "screen";
  const dustMoteCount = Math.max(5, Math.min(11, Math.round(room.w * room.h / 62000)));
  for (let mote = 0; mote < dustMoteCount; mote += 1) {
    const phase = (sampledTime * (0.018 + mote * 0.0007) + mote * 0.173 + seed * 0.0001) % 1;
    const x = room.x + ((mote * 0.61803398875 + phase * 0.11) % 1) * room.w;
    const y = room.y + (1 - phase) * room.h;
    const alpha = Math.sin(Math.PI * phase) ** 2 * 0.16 * intensity;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#fff0ba";
    const size = 0.8 + (mote % 3) * 0.35;
    ctx.fillRect(x, y, size, size);
  }
  ctx.restore();
  return true;
}

function drawKomorebiRoom(data, room, time, intensity = 1) {
  drawAuthoredMapShadeAnimation(data, room, time, intensity);
}

function drawFootBathAmbient(object, time, intensity = 1) {
  const sprite = transparentSpriteSource(state.textures.footBathSparkleEffect, "footbath-hidden-spring-godray-v359", 10);
  if (!sprite) return;
  const sampledTime = Math.floor(time * 60) / 60;
  const sourceWidth = sprite.width;
  const sourceHeight = sprite.height;

  ctx.save();
  ctx.translate(object.x, object.y - 6);
  ctx.globalCompositeOperation = "screen";
  ctx.filter = "saturate(0.82) brightness(0.72)";
  applyAteGlowContext(ctx, "ripple", time, Number(object.x || 0) * 0.001, intensity * 0.34);

  // The sun direction is fixed. Steam density changes the beam visibility;
  // the ray itself never rotates or slides away from its canopy opening.
  const godrayBreathing = 0.82 + Math.sin(sampledTime * Math.PI * 0.24) * 0.06;
  ctx.globalAlpha = intensity * 0.15 * godrayBreathing;
  ctx.drawImage(
    sprite,
    sourceWidth * 0.015,
    sourceHeight * 0.035,
    sourceWidth * 0.43,
    sourceHeight * 0.47,
    -148,
    -166,
    154,
    128
  );

  // The authored bath rim stays in the room texture. Only highlights inside a
  // fixed ellipse move, so no frame can displace the bath silhouette.
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, 8, 118, 31, 0, 0, Math.PI * 2);
  ctx.clip();
  const wavePhase = sampledTime * Math.PI * 0.58;
  const waterDrift = Math.sin(wavePhase) * 4.2;
  const waterSourceX = clamp(sourceWidth * 0.025 + waterDrift, 0, sourceWidth * 0.055);
  ctx.globalAlpha = intensity * (0.255 + Math.sin(wavePhase) * 0.032);
  ctx.drawImage(
    sprite,
    waterSourceX,
    sourceHeight * 0.43,
    sourceWidth * 0.95,
    sourceHeight * 0.36,
    -125,
    -29,
    250,
    82
  );
  ctx.globalAlpha = intensity * (0.115 + Math.cos(wavePhase * 0.73) * 0.022);
  ctx.drawImage(
    sprite,
    clamp(sourceWidth * 0.035 - waterDrift * 0.64, 0, sourceWidth * 0.06),
    sourceHeight * 0.5,
    sourceWidth * 0.93,
    sourceHeight * 0.25,
    -122,
    -20,
    244,
    70
  );
  ctx.restore();

  const steamSlices = [
    { sx: 0.12, sw: 0.2, x: -49, delay: 0.04, wind: 0.8 },
    { sx: 0.39, sw: 0.22, x: 0, delay: 0.37, wind: 1.15 },
    { sx: 0.66, sw: 0.2, x: 49, delay: 0.7, wind: 0.95 }
  ];
  for (const steam of steamSlices) {
    const phase = (sampledTime * 0.145 + steam.delay) % 1;
    const rise = 48 * (1 - Math.exp(-phase * 3.25));
    const lateralDrift = steam.wind * 8 * phase ** 1.35;
    const alpha = Math.sin(phase * Math.PI) ** 1.35 * 0.245 * intensity;
    if (alpha <= 0.005) continue;
    ctx.globalAlpha = alpha;
    ctx.drawImage(
      sprite,
      sourceWidth * steam.sx,
      sourceHeight * 0.13,
      sourceWidth * steam.sw,
      sourceHeight * 0.37,
      steam.x - 29 + lateralDrift,
      -62 - rise,
      58 + phase * 10,
      94 + phase * 20
    );
  }

  const sparkleSlices = [
    { sx: 0.24, sy: 0.48, x: -67, y: -2, phase: 0.1 },
    { sx: 0.68, sy: 0.49, x: 69, y: 0, phase: 1.8 }
  ];
  for (const sparkle of sparkleSlices) {
    const alpha = Math.max(0, Math.sin(sampledTime * 3.1 + sparkle.phase)) ** 2 * 0.48 * intensity;
    if (alpha <= 0.005) continue;
    ctx.globalAlpha = alpha;
    ctx.drawImage(
      sprite,
      sourceWidth * sparkle.sx,
      sourceHeight * sparkle.sy,
      sourceWidth * 0.075,
      sourceHeight * 0.075,
      sparkle.x - 11,
      sparkle.y - 11,
      22,
      22
    );
  }
  ctx.restore();
}

function drawFootBathRoomKomorebi(data, room, time) {
  drawAuthoredMapShadeAnimation(data, room, time, 1.04);
}

const MAP_OBJECT_EFFECT_TEXTURE_IDS = Object.freeze({
  stamina: "stamina",
  credits: "credits",
  mana: "mana",
  cooldownReduction: "cooldown-reduction",
  statusRecovery: "status-recovery",
  acceleration: "acceleration",
  luckBoost: "luck-boost",
  overheal: "overheal",
  relaxation: "relaxation",
  herbalRecovery: "herbal-recovery",
  healthyMeal: "healthy-meal",
  mineralWater: "mineral-water",
  heal: "heal",
  fullRecovery: "full-recovery",
  decoy: "decoy"
});

const OBJECT_EFFECT_PRESENTATIONS = Object.freeze({
  stamina: Object.freeze({ motion: "charge", color: "#4ade80", accent: "#facc15", size: 112 }),
  credits: Object.freeze({ motion: "orbit", color: "#fbbf24", accent: "#fde68a", size: 114 }),
  mana: Object.freeze({ motion: "pulse", color: "#818cf8", accent: "#c4b5fd", size: 118 }),
  cooldownReduction: Object.freeze({ motion: "rewind", color: "#22d3ee", accent: "#fef3c7", size: 116 }),
  statusRecovery: Object.freeze({ motion: "cleanse", color: "#34d399", accent: "#e0f2fe", size: 120 }),
  acceleration: Object.freeze({ motion: "dash", color: "#38bdf8", accent: "#a7f3d0", size: 122 }),
  luckBoost: Object.freeze({ motion: "constellation", color: "#f472b6", accent: "#fcd34d", size: 118 }),
  overheal: Object.freeze({ motion: "shield", color: "#60a5fa", accent: "#f0f9ff", size: 122 }),
  relaxation: Object.freeze({ motion: "breathe", color: "#2dd4bf", accent: "#bae6fd", size: 116 }),
  herbalRecovery: Object.freeze({ motion: "cleanse", color: "#22c55e", accent: "#a7f3d0", size: 120 }),
  healthyMeal: Object.freeze({ motion: "bloom", color: "#f59e0b", accent: "#4ade80", size: 122 }),
  mineralWater: Object.freeze({ motion: "ripple", color: "#38bdf8", accent: "#e0f2fe", size: 118 }),
  heal: Object.freeze({ motion: "heal", color: "#4ade80", accent: "#f0fdf4", size: 120 }),
  fullRecovery: Object.freeze({ motion: "burst", color: "#14b8a6", accent: "#fde68a", size: 128 }),
  decoy: Object.freeze({ motion: "signal", color: "#a78bfa", accent: "#67e8f9", size: 116 })
});

const OBJECT_EFFECT_APPEARANCE = Object.freeze({
  stamina: Object.freeze({ choreography: "updraft", shape: "shard", palette: ["#34d399", "#a7f3d0", "#fde047", "#ffffff"] }),
  credits: Object.freeze({ choreography: "fountain", shape: "confetti", palette: ["#f59e0b", "#fde047", "#fef3c7", "#fb7185"] }),
  mana: Object.freeze({ choreography: "spiral", shape: "glint", palette: ["#6366f1", "#a78bfa", "#67e8f9", "#f0abfc"] }),
  cooldownReduction: Object.freeze({ choreography: "rewind", shape: "shard", palette: ["#22d3ee", "#60a5fa", "#fef3c7", "#ffffff"] }),
  statusRecovery: Object.freeze({ choreography: "cleanse", shape: "petal", palette: ["#10b981", "#6ee7b7", "#bae6fd", "#ffffff"] }),
  acceleration: Object.freeze({ choreography: "backdraft", shape: "shard", palette: ["#38bdf8", "#67e8f9", "#a7f3d0", "#ffffff"] }),
  luckBoost: Object.freeze({ choreography: "constellation", shape: "glint", palette: ["#f472b6", "#facc15", "#c4b5fd", "#ffffff"] }),
  overheal: Object.freeze({ choreography: "guard", shape: "glint", palette: ["#3b82f6", "#60a5fa", "#bae6fd", "#ffffff"] }),
  relaxation: Object.freeze({ choreography: "drift", shape: "petal", palette: ["#2dd4bf", "#7dd3fc", "#d8b4fe", "#ffffff"] }),
  herbalRecovery: Object.freeze({ choreography: "bloom", shape: "leaf", palette: ["#16a34a", "#4ade80", "#a7f3d0", "#fde68a"] }),
  healthyMeal: Object.freeze({ choreography: "fountain", shape: "petal", palette: ["#f59e0b", "#fb7185", "#4ade80", "#fef3c7"] }),
  mineralWater: Object.freeze({ choreography: "splash", shape: "droplet", palette: ["#0284c7", "#38bdf8", "#a5f3fc", "#ffffff"] }),
  heal: Object.freeze({ choreography: "bloom", shape: "petal", palette: ["#22c55e", "#86efac", "#f9a8d4", "#ffffff"] }),
  fullRecovery: Object.freeze({ choreography: "prism-burst", shape: "glint", palette: ["#14b8a6", "#38bdf8", "#facc15", "#f472b6"] }),
  decoy: Object.freeze({ choreography: "pixel-scatter", shape: "pixel", palette: ["#8b5cf6", "#22d3ee", "#f472b6", "#ffffff"] })
});

function dedicatedMapObjectEffectTexture(effectKind, type = "") {
  if (type === "footBath" || effectKind === "footBath") return state.textures.footBathSparkleEffect;
  const textureId = MAP_OBJECT_EFFECT_TEXTURE_IDS[effectKind];
  return textureId ? state.textures.mapObjectEffectTextures?.[textureId] || null : null;
}

function drawTextureSurfaceAnimation(data) {
  const image = state.textures.fullMapComposites?.[data.map.id];
  if (!image?.complete || !image.naturalWidth) return;
  const time = (state.frameNow || performance.now()) / 1000;
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 0.018 + (Math.sin(time * 0.41) * 0.5 + 0.5) * 0.013;
  ctx.filter = `brightness(${1.035 + Math.sin(time * 0.31) * 0.008}) saturate(1.025)`;
  // Keep authored doors and object coordinates pixel-stable; animate light only.
  ctx.drawImage(image, 0, 0, data.map.width, data.map.height);
  ctx.restore();
}

function drawAmbientMapAnimations(data, visibleRooms, visibleCorridors = []) {
  const time = (state.frameNow || performance.now()) / 1000;
  const komorebiStrength = { archive: 1, atrium: 0.92, greenhouse: 0.72, cafeteria: 0.42 };
  const footBathRoomIds = new Set(
    (data.map.objects || [])
      .filter((object) => object.type === "footBath" || object.effectKind === "footBath")
      .map((object) => object.room)
      .filter(Boolean)
  );
  for (const room of visibleRooms) {
    drawMapPlantWind(data, room, time, room.id === "greenhouse" ? 1.08 : 0.94);
    if (footBathRoomIds.has(room.id)) drawFootBathRoomKomorebi(data, room, time);
    else {
      const strength = komorebiStrength[room.id];
      if (strength) drawKomorebiRoom(data, room, time, strength);
    }
  }
  for (const corridor of visibleCorridors.flatMap((entry) => corridorRenderSegments(entry))) {
    drawMapPlantWind(data, corridor, time, 0.82);
  }
  const visibleRoomIds = new Set(visibleRooms.map((room) => room.id));
  for (const object of data.map.objects || []) {
    if ((object.type !== "footBath" && object.effectKind !== "footBath") || !visibleRoomIds.has(object.room)) continue;
    // The spring, steam, caustics, and fixed-source god rays are environmental
    // ATE. Object benefit bursts remain event-driven in drawObjectActivationEffect.
    drawFootBathAmbient(object, time, 0.86);
  }
}

function drawFieldEnvironment(data, visibleRooms = data.map.rooms, visibleCorridors = data.map.corridors) {
  const fullMapComposite = state.textures.fullMapComposites?.[data.map.id];
  if (!fullMapComposite?.complete || !fullMapComposite.naturalWidth) return false;
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.filter = "none";
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = IMAGE_SMOOTHING_QUALITY;
  ctx.drawImage(fullMapComposite, 0, 0, data.map.width, data.map.height);
  ctx.restore();
  return true;
}

function drawDoorPortals(data) {
  // Door geometry is authored into the room/corridor composite atlas. Any
  // second pass here creates a visible seam or silver column at boundaries.
  return;
}

function drawCanonicalPortalOpenings(data, camera, w, h) {
  // Entrances are already authored into each room/corridor composite. A floor
  // repaint here covered those pixels with the gray rectangles seen at doors.
  return;
}

function transparentEdgeBackgroundSource(image) {
  if (!image?.complete || !image.naturalWidth) return image;
  const cache = state.textures.compositeSources;
  const cached = cache?.get(image);
  if (cached) return cached;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const local = canvas.getContext("2d", { willReadFrequently: true });
    local.drawImage(image, 0, 0);
    const imageData = local.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    const cornerIndices = [0, width - 1, (height - 1) * width, height * width - 1];
    const backgroundColors = cornerIndices.map((index) => {
      const offset = index * 4;
      return [pixels[offset], pixels[offset + 1], pixels[offset + 2], pixels[offset + 3]];
    }).filter(([r, g, b, a]) => {
      if (a < 8) return true;
      const luminance = (r + g + b) / 3;
      const spread = Math.max(r, g, b) - Math.min(r, g, b);
      return spread <= 24 && (luminance <= 34 || luminance >= 218);
    });
    if (!backgroundColors.length) {
      cache?.set(image, image);
      return image;
    }
    const visited = new Uint8Array(width * height);
    const queue = new Int32Array(width * height);
    let head = 0;
    let tail = 0;
    const isEdgeBackground = (index) => {
      const offset = index * 4;
      const r = pixels[offset];
      const g = pixels[offset + 1];
      const b = pixels[offset + 2];
      const a = pixels[offset + 3];
      if (a < 8) return true;
      return backgroundColors.some(([br, bg, bb, ba]) => {
        if (ba < 8) return false;
        const distance = Math.hypot(r - br, g - bg, b - bb);
        const backgroundLuminance = (br + bg + bb) / 3;
        const tolerance = backgroundLuminance >= 128 ? 24 : 32;
        return distance <= tolerance;
      });
    };
    const enqueue = (x, y) => {
      if (x < 0 || y < 0 || x >= width || y >= height) return;
      const index = y * width + x;
      if (visited[index] || !isEdgeBackground(index)) return;
      visited[index] = 1;
      queue[tail++] = index;
    };
    for (let x = 0; x < width; x += 1) {
      enqueue(x, 0);
      enqueue(x, height - 1);
    }
    for (let y = 0; y < height; y += 1) {
      enqueue(0, y);
      enqueue(width - 1, y);
    }
    while (head < tail) {
      const index = queue[head++];
      const x = index % width;
      const y = Math.floor(index / width);
      enqueue(x + 1, y);
      enqueue(x - 1, y);
      enqueue(x, y + 1);
      enqueue(x, y - 1);
    }
    if (!tail) {
      cache?.set(image, image);
      return image;
    }
    for (let index = 0; index < visited.length; index += 1) {
      if (visited[index]) pixels[index * 4 + 3] = 0;
    }
    const fringe = new Uint8Array(visited);
    for (let pass = 0; pass < 3; pass += 1) {
      const next = new Uint8Array(fringe);
      for (let index = 0; index < fringe.length; index += 1) {
        if (!fringe[index]) continue;
        const x = index % width;
        const y = Math.floor(index / width);
        const neighbors = [
          x > 0 ? index - 1 : -1,
          x + 1 < width ? index + 1 : -1,
          y > 0 ? index - width : -1,
          y + 1 < height ? index + width : -1
        ];
        for (const neighbor of neighbors) {
          if (neighbor < 0 || fringe[neighbor]) continue;
          const offset = neighbor * 4;
          const distances = backgroundColors
            .filter((color) => color[3] >= 8)
            .map(([br, bg, bb]) => Math.hypot(
              pixels[offset] - br,
              pixels[offset + 1] - bg,
              pixels[offset + 2] - bb
            ));
          const distance = distances.length ? Math.min(...distances) : Number.POSITIVE_INFINITY;
          const limit = pass === 0 ? 46 : pass === 1 ? 36 : 30;
          if (distance > limit) continue;
          pixels[offset + 3] = Math.min(
            pixels[offset + 3],
            Math.round(255 * Math.max(0, distance - 12) / Math.max(1, limit - 12))
          );
          next[neighbor] = 1;
        }
      }
      fringe.set(next);
    }
    local.putImageData(imageData, 0, 0);
    cache?.set(image, canvas);
    return canvas;
  } catch {
    cache?.set(image, image);
    return image;
  }
}

function drawFloor(data, camera, w, h, includeGrid = true) {
  const outpost = data.map.id === "outpost";
  ctx.fillStyle = outpost ? "#bbc6c4" : "#c8d9e1";
  ctx.fillRect(camera.x, camera.y, w, h);
  const wash = ctx.createLinearGradient(camera.x, camera.y, camera.x + w, camera.y + h);
  wash.addColorStop(0, outpost ? "rgba(208,222,216,0.24)" : "rgba(234,246,250,0.3)");
  wash.addColorStop(1, outpost ? "rgba(87,108,105,0.12)" : "rgba(76,111,130,0.12)");
  ctx.fillStyle = wash;
  ctx.fillRect(camera.x, camera.y, w, h);
  if (!includeGrid) return;
  ctx.strokeStyle = outpost ? "rgba(64,85,82,0.12)" : "rgba(57,83,99,0.12)";
  ctx.lineWidth = 1;
  const grid = 96;
  const startX = Math.floor(camera.x / grid) * grid;
  const startY = Math.floor(camera.y / grid) * grid;
  for (let x = startX; x < camera.x + w + grid; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, camera.y);
    ctx.lineTo(x, camera.y + h);
    ctx.stroke();
  }
  for (let y = startY; y < camera.y + h + grid; y += grid) {
    ctx.beginPath();
    ctx.moveTo(camera.x, y);
    ctx.lineTo(camera.x + w, y);
    ctx.stroke();
  }
}

function preparedAtlasTexture(image, key) {
  if (Array.isArray(image)) {
    return image.map((entry, index) => transparentSpriteSource(entry, `${key}-${index}`, 30));
  }
  return transparentSpriteSource(image, key, 30);
}

function drawGeneratedPropCell(image, cellIndex, centerX, centerY, width, height, alpha = 1) {
  if (!image) return false;
  const source = Array.isArray(image) ? image[cellIndex] : image;
  if (!source) return false;
  const imageWidth = source.naturalWidth || source.width;
  const imageHeight = source.naturalHeight || source.height;
  if (!imageWidth || !imageHeight) return false;
  const sourceWidth = Array.isArray(image) ? imageWidth : imageWidth / 3;
  const sourceHeight = Array.isArray(image) ? imageHeight : imageHeight / 2;
  const column = Array.isArray(image) ? 0 : cellIndex % 3;
  const row = Array.isArray(image) ? 0 : Math.floor(cellIndex / 3);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.filter = "brightness(1.02) saturate(1.04) contrast(1.02)";
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(
    source,
    column * sourceWidth,
    row * sourceHeight,
    sourceWidth,
    sourceHeight,
    centerX - width / 2,
    centerY - height / 2,
    width,
    height
  );
  ctx.restore();
  return true;
}

function roomCompositeForPoint(data, roomId, point) {
  const room = roomId && roomId !== "corridor"
    ? data.map.rooms.find((entry) => entry.id === roomId)
    : data.map.rooms.find((entry) => (
      point.x >= entry.x && point.x <= entry.x + entry.w &&
      point.y >= entry.y && point.y <= entry.y + entry.h
  ));
  if (!room) return null;
  const image = state.textures.fullMapComposites?.[data.map.id];
  return image?.complete && image.naturalWidth ? image : null;
}

function mapObjectStyle(object) {
  const style = {
    recharge: { color: "#22d3ee", symbol: "EN", prop: 0 },
    medPod: { color: "#34d399", symbol: "+", prop: 0 },
    supply: { color: "#facc15", symbol: "C", prop: 0 },
    decoy: { color: "#fb7185", symbol: "♪", prop: 4 },
    speedPad: { color: "#a78bfa", symbol: ">>", prop: -1 },
    hushField: { color: "#94a3b8", symbol: "M", prop: -1 },
    restSeat: { color: "#38bdf8", symbol: "REST" },
    airPlant: { color: "#4ade80", symbol: "AIR" },
    commandDesk: { color: "#f59e0b", symbol: "SYNC" },
    equipmentLocker: { color: "#fb7185", symbol: "GEAR" },
    hydration: { color: "#22d3ee", symbol: "SP" },
    bookshelf: { color: "#60a5fa", symbol: "CD" },
    archiveCabinet: { color: "#facc15", symbol: "C" },
    readingLamp: { color: "#a78bfa", symbol: "MP" },
    securityConsole: { color: "#38bdf8", symbol: "CD" },
    cameraTripod: { color: "#f0abfc", symbol: "LU" },
    holoProjector: { color: "#e879f9", symbol: "LU" },
    reactorGauge: { color: "#fb923c", symbol: "CD" },
    coolingUnit: { color: "#67e8f9", symbol: "+" },
    powerCabinet: { color: "#fde047", symbol: "CD" },
    cableSpool: { color: "#facc15", symbol: "C" },
    cargoCrate: { color: "#facc15", symbol: "C" },
    palletJack: { color: "#c084fc", symbol: ">>" },
    conferenceSofa: { color: "#34d399", symbol: "HP+" },
    footBath: { color: "#7dd3fc", symbol: "湯" },
    indoorGarden: { color: "#4ade80", symbol: "+" },
    conferenceTable: { color: "#60a5fa", symbol: "CD" },
    workbench: { color: "#60a5fa", symbol: "CD" },
    toolCart: { color: "#facc15", symbol: "C" },
    recyclingUnit: { color: "#facc15", symbol: "C" },
    aromaticGarden: { color: "#d8b4fe", symbol: "LU" },
    restorativeMist: { color: "#5eead4", symbol: "+" },
    herbPreparationTable: { color: "#86efac", symbol: "+" },
    healthyMealTable: { color: "#fb7185", symbol: "+" },
    mineralWaterBar: { color: "#22d3ee", symbol: "SP" },
    relaxationBed: { color: "#f9a8d4", symbol: ">>" },
    herbalCabinet: { color: "#5eead4", symbol: "+" },
    radioConsole: { color: "#60a5fa", symbol: "CD" },
    serverRack: { color: "#facc15", symbol: "C" },
    antennaArray: { color: "#a78bfa", symbol: "MP" }
  }[object.type] || { color: "#67c7d8", symbol: "•", prop: 0 };
  return style;
}

function drawMapObjects(data) {
  const self = selfPlayer();
  const now = estimatedServerNow(data);
  let itemError = "";
  for (const object of data.map.objects || []) {
    if (!worldPointVisible(object.x, object.y, Number(object.radius || 100) + 110)) continue;
    const style = mapObjectStyle(object);
    const near = Boolean(self && dist(self, object) <= Number(object.interactive ? object.useRange || data.map.taskRange : object.radius || 100));
    const ready = !object.interactive || Number(object.readyAt || 0) <= now;
    ctx.save();
    try {
      if (near) {
        ctx.fillStyle = "rgba(9,20,28,0.94)";
        roundRect(object.x - 76, object.y + 52, 152, 36, 6, true, false);
        ctx.fillStyle = ready ? "#f8fafc" : "#94a3b8";
        ctx.font = "900 12px Segoe UI, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(object.label, object.x, object.y + 63);
        ctx.fillStyle = style.color;
        ctx.font = "800 9px Segoe UI, sans-serif";
        ctx.fillText(object.effectLabel, object.x, object.y + 78);
      }
    } catch (error) {
      if (!itemError) itemError = `${object.id || object.type}:${error?.message || String(error)}`;
    } finally {
      ctx.restore();
    }
  }
  if (itemError) {
    document.body.dataset.drawObjectError = itemError;
    if (state.lastCanvasItemError !== itemError) console.error("Canvas object draw failed", itemError);
    state.lastCanvasItemError = itemError;
  } else if (state.lastCanvasItemError) {
    state.lastCanvasItemError = "";
    delete document.body.dataset.drawObjectError;
  }
}

function drawResolvePoint(data) {
  const point = data.map.resolvePoint;
  if (!point || !worldPointVisible(point.x, point.y, 180)) return;
  const self = selfPlayer();
  const near = Boolean(self && dist(self, point) <= Number(point.useRange || 82));
  const color = point.reward === "grit" ? "#67e8f9" : "#f0abfc";
  const time = (state.frameNow || performance.now()) / 1000;
  const prepared = transparentSpriteSource(state.textures.resolvePoint, "resolve-point", 18);
  const sprite = prepared ? normalizedSpriteFrame(prepared, "resolve-point", 1, 1, 0, 0) : null;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.94;
  if (sprite) {
    drawAnimatedTextureCentered(sprite, point.x, point.y - 9, 144, 144, {
      mode: "energy",
      time,
      phase: Number(point.x || 0) * 0.003,
      intensity: 0.88,
      baseAlpha: 0.22
    });
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(point.x, point.y - 10, 33, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 0.48 + Math.sin(time * 3.4) * 0.1;
  ctx.strokeStyle = color;
  ctx.lineWidth = near ? 6 : 3;
  ctx.beginPath();
  ctx.ellipse(point.x, point.y + 30, 48, 18, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(8,20,28,0.94)";
  roundRect(point.x - 68, point.y + 51, 136, 35, 6, true, false);
  ctx.fillStyle = "#f8fafc";
  ctx.font = "900 11px Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(point.label, point.x, point.y + 62);
  ctx.fillStyle = color;
  ctx.font = "800 9px Segoe UI, sans-serif";
  ctx.fillText(point.effectLabel, point.x, point.y + 77);
  ctx.restore();
}

function drawAlchemyObjects(data) {
  const now = estimatedServerNow(data);
  const facilityProps = preparedAtlasTexture(state.textures.facilityProps, "facility-props");
  const roomProps = preparedAtlasTexture(state.textures.roomProps, "room-props");
  for (const object of data.map.alchemyObjects || []) {
    if (!worldPointVisible(object.x, object.y, Number(object.radius || 90) + 80)) continue;
    const remaining = Math.max(0, (Number(object.endsAt) || now) - now);
    const pulse = 0.5 + Math.sin((state.frameNow || performance.now()) / 210) * 0.5;
    const style = object.type === "cover"
      ? { color: "#94a3b8", label: "錬成遮蔽物", symbol: "▰", atlas: facilityProps, cell: 0, width: 92, height: 82 }
      : object.type === "recharge"
        ? { color: "#4ade80", label: "回復端末", symbol: "+", atlas: roomProps, cell: 1, width: 88, height: 78 }
        : { color: "#fbbf24", label: "音響デコイ", symbol: "♪", atlas: roomProps, cell: 5, width: 92, height: 80 };
    ctx.save();
    ctx.strokeStyle = style.color;
    ctx.lineWidth = 3 + pulse * 2;
    const textured = drawGeneratedPropCell(style.atlas, style.cell, object.x, object.y, style.width, style.height, 0.96);
    if (!textured) {
      ctx.fillStyle = object.type === "cover" ? "rgba(51,65,85,0.94)" : "rgba(8,25,32,0.9)";
      if (object.type === "cover") roundRect(object.x - 43, object.y - 35, 86, 70, 6, true, true);
      else {
        ctx.beginPath();
        ctx.arc(object.x, object.y, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
    if (object.type !== "cover") {
      ctx.globalAlpha = 0.24 + pulse * 0.14;
      ctx.beginPath();
      ctx.arc(object.x, object.y, Number(object.radius || 105), 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    if (!textured) {
      ctx.fillStyle = style.color;
      ctx.font = "900 22px Segoe UI, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(style.symbol, object.x, object.y);
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(8,20,28,0.9)";
    roundRect(object.x - 54, object.y + 43, 108, 28, 5, true, false);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 10px Segoe UI, sans-serif";
    ctx.fillText(`${style.label} ${Math.ceil(remaining / 1000)}秒`, object.x, object.y + 57);
    ctx.restore();
  }
}

function drawGravityZones(data) {
  const now = estimatedServerNow(data);
  const stormTexture = transparentSpriteSource(state.textures.gravityStorm, "gravity-storm-v122", 20);
  const safeEyeTexture = transparentSpriteSource(state.textures.gravityStormSafeEye, "gravity-storm-safe-eye-v320", 18);
  for (const zone of data.gravityZones || []) {
    if (!worldPointVisible(zone.x, zone.y, Number(zone.radius || 200) + 100)) continue;
    const radius = Number(zone.radius || 220);
    const phase = (state.frameNow || performance.now()) / 420;
    ctx.save();
    ctx.translate(zone.x, zone.y);
    ctx.globalCompositeOperation = "lighter";
    if (stormTexture) {
      const spin = phase * 0.08;
      ctx.save();
      ctx.rotate(spin);
      ctx.globalAlpha = 0.72;
      ctx.drawImage(stormTexture, -radius, -radius, radius * 2, radius * 2);
      ctx.restore();
    }
    ctx.fillStyle = "rgba(76,29,149,0.34)";
    ctx.strokeStyle = "rgba(196,181,253,0.9)";
    ctx.lineWidth = 8;
    ctx.setLineDash([18, 12]);
    ctx.lineDashOffset = -phase * 18;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);
    for (let index = 0; index < 20; index += 1) {
      const angle = phase * (index % 2 ? -0.7 : 0.9) + index / 12 * Math.PI * 2;
      const orbit = radius * (0.18 + (index % 5) * 0.16);
      ctx.fillStyle = index % 3 ? "#a78bfa" : "#e9d5ff";
      ctx.fillRect(Math.cos(angle) * orbit - 4, Math.sin(angle) * orbit - 4, 8, 8);
    }
    ctx.fillStyle = "#f5f3ff";
    ctx.font = "900 11px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`重力変動 ${Math.ceil(Math.max(0, zone.endsAt - now) / 1000)}秒`, 0, radius + 20);
    ctx.restore();
    if (safeEyeTexture) {
      const safeRadius = Number(zone.safeRadius || 200);
      const safeX = Number.isFinite(Number(zone.safeX)) ? Number(zone.safeX) : zone.x;
      const safeY = Number.isFinite(Number(zone.safeY)) ? Number(zone.safeY) : zone.y;
      const safePulse = 1 + Math.sin(phase * 1.65) * 0.04;
      ctx.save();
      ctx.translate(safeX, safeY);
      ctx.rotate(-phase * 0.04);
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.82;
      ctx.drawImage(
        safeEyeTexture,
        -safeRadius * safePulse,
        -safeRadius * safePulse,
        safeRadius * safePulse * 2,
        safeRadius * safePulse * 2
      );
      ctx.restore();
    }
  }
}

function drawStations(data) {
  const self = selfPlayer();
  const facilityProps = preparedAtlasTexture(state.textures.facilityProps, "facility-props");
  const taskIds = new Set((data.self.tasks || []).filter((task) => !task.done).map((task) => task.stationId));
  data.map.stations.forEach((station) => {
    if (!worldPointVisible(station.x, station.y, 180)) return;
    let color = "#9aa9b8";
    let symbol = "";
    const activeTask = taskIds.has(station.id);
    if (station.type === "task") {
      color = activeTask ? "#06d6ff" : "#728295";
      symbol = station.task === "download" ? "DL" : station.task === "upload" ? "UP" : "T";
    } else if (station.type === "repair") {
      color = data.sabotage?.type === station.repair ? "#f59e0b" : "#8290a0";
      symbol = "R";
    } else if (station.type === "utility") {
      color = "#38bdf8";
      symbol = "U";
    } else if (station.type === "emergency") {
      color = "#ef4444";
      symbol = "!";
    } else if (station.type === "vending") {
      color = "#facc15";
      symbol = "V";
    }
    const propCell = station.type === "vending" ? 1 : station.type === "emergency" ? 5 : 0;
    const propWidth = station.type === "vending" ? 72 : station.type === "emergency" ? 82 : 74;
    const propHeight = station.type === "vending" ? 92 : station.type === "emergency" ? 64 : 70;
    const integrated = Boolean(roomCompositeForPoint(data, station.room, station));
    const textured = integrated
      ? true
      : drawGeneratedPropCell(facilityProps, propCell, station.x, station.y, propWidth, propHeight, activeTask ? 1 : 0.9);
    if (!textured && station.type !== "vending") {
      ctx.fillStyle = color;
      ctx.strokeStyle = activeTask ? "#e0fbff" : "rgba(255,255,255,0.42)";
      ctx.lineWidth = activeTask ? 4 : 2;
      ctx.beginPath();
      ctx.arc(station.x, station.y, activeTask ? 20 : 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    if (station.type !== "task" && station.type !== "vending") {
      ctx.fillStyle = "rgba(7,16,20,0.88)";
      ctx.beginPath();
      ctx.arc(station.x, station.y + propHeight * 0.34, activeTask ? 14 : 11, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = activeTask ? "#dffbff" : "#f8fafc";
    ctx.shadowColor = station.type === "task" ? "rgba(3,18,26,0.92)" : "transparent";
    ctx.shadowBlur = station.type === "task" ? 4 : 0;
    ctx.font = activeTask ? "900 10px Segoe UI, sans-serif" : "900 9px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(symbol, station.x, station.y + propHeight * 0.34 + 0.5);
    ctx.shadowBlur = 0;
    if (activeTask) {
      ctx.fillStyle = "rgba(248,252,255,0.94)";
      roundRect(station.x - 45, station.y + 28, 90, 22, 7, true, false);
      ctx.fillStyle = "#103245";
      ctx.font = "900 12px Segoe UI, sans-serif";
      ctx.fillText(station.label, station.x, station.y + 39);
    }
    if (station.type === "vending") {
      ctx.fillStyle = "rgba(24,32,38,0.94)";
      roundRect(station.x - 50, station.y + 52, 100, 27, 7, true, false);
      ctx.fillStyle = "#fde047";
      ctx.font = "900 14px Segoe UI, sans-serif";
      ctx.fillText("自販機", station.x, station.y + 65.5);
    }
    if (station.type !== "task" && station.type !== "vending" && self && dist(self, station) <= data.map.taskRange) {
      ctx.strokeStyle = activeTask ? "rgba(6,214,255,0.85)" : "rgba(45,212,191,0.35)";
      ctx.lineWidth = activeTask ? 4 : 1;
      ctx.beginPath();
      ctx.arc(station.x, station.y, activeTask ? 34 : 24, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  data.map.cameras.forEach((camera) => {
    if (!worldPointVisible(camera.x, camera.y, 100)) return;
    const integrated = Boolean(roomCompositeForPoint(data, "", camera));
    if (!integrated && drawGeneratedPropCell(facilityProps, 2, camera.x, camera.y, 76, 56, camera.destroyed ? 0.42 : 1)) {
      if (camera.destroyed) {
        ctx.save();
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(camera.x - 28, camera.y - 24);
        ctx.lineTo(camera.x + 28, camera.y + 24);
        ctx.moveTo(camera.x + 28, camera.y - 24);
        ctx.lineTo(camera.x - 28, camera.y + 24);
        ctx.stroke();
        ctx.restore();
      }
      return;
    }
    if (integrated && !camera.destroyed) return;
    ctx.save();
    ctx.translate(camera.x, camera.y);
    ctx.fillStyle = camera.destroyed ? "rgba(71,85,105,0.72)" : "#67e8f9";
    ctx.strokeStyle = camera.destroyed ? "#ef4444" : "#083344";
    ctx.lineWidth = 3;
    roundRect(-15, -10, 30, 20, 4, true, true);
    ctx.beginPath();
    ctx.arc(5, 0, 5, 0, Math.PI * 2);
    ctx.stroke();
    if (camera.destroyed) {
      ctx.beginPath();
      ctx.moveTo(-18, -15);
      ctx.lineTo(18, 15);
      ctx.moveTo(18, -15);
      ctx.lineTo(-18, 15);
      ctx.stroke();
    }
    ctx.restore();
  });

}

function drawFacilityEffects(data) {
  const time = (state.frameNow || performance.now()) / 1000;
  const activeTaskIds = new Set((data.self.tasks || []).filter((task) => !task.done).map((task) => task.stationId));
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  data.map.stations.forEach((station, stationIndex) => {
    if (!worldPointVisible(station.x, station.y, 150)) return;
    const seed = stationIndex * 0.173;
    if (station.type === "task") {
      drawTaskTransferStationEffect(station, activeTaskIds.has(station.id), time, seed);
    } else if (station.type === "utility" || station.type === "repair") {
      const active = activeTaskIds.has(station.id);
      const strength = active ? 0.92 : 0.2;
      for (let particleIndex = 0; particleIndex < 3; particleIndex += 1) {
        const progress = (time * (0.36 + particleIndex * 0.025) + seed + particleIndex / 3) % 1;
        const sway = Math.sin(time * 2.4 + particleIndex * 2.1 + stationIndex) * 9;
        const alpha = Math.sin(progress * Math.PI) * strength;
        ctx.fillStyle = `rgba(34,211,238,${alpha})`;
        ctx.fillRect(station.x + sway - 1.5, station.y + 17 - progress * 62, 3, 8);
      }
      if (active) {
        ctx.strokeStyle = `rgba(103,232,249,${0.4 + Math.sin(time * 5 + seed) * 0.18})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(station.x - 22, station.y - 24);
        ctx.lineTo(station.x + 22, station.y - 24);
        ctx.stroke();
      }
    }

    if (station.type === "emergency") {
      const progress = (time * 0.62 + seed) % 1;
      ctx.strokeStyle = `rgba(248,113,113,${(1 - progress) * 0.72})`;
      ctx.lineWidth = 4 - progress * 2;
      ctx.beginPath();
      ctx.arc(station.x, station.y, 28 + progress * 34, 0, Math.PI * 2);
      ctx.stroke();
    } else if (station.type === "vending") {
      for (let light = 0; light < 4; light += 1) {
        const alpha = 0.28 + Math.sin(time * 5 + light * 1.3 + seed) * 0.2;
        ctx.fillStyle = `rgba(${light % 2 ? "250,204,21" : "45,212,191"},${alpha})`;
        ctx.fillRect(station.x - 18 + light * 12, station.y - 30, 5, 3);
      }
    }

    if (station.type === "repair" && data.sabotage?.type === station.repair) {
      ctx.strokeStyle = `rgba(245,158,11,${0.54 + Math.sin(time * 8) * 0.24})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(station.x, station.y, 31 + Math.sin(time * 6 + seed) * 4, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  data.map.cameras.forEach((camera, index) => {
    if (!worldPointVisible(camera.x, camera.y, 100)) return;
    if (camera.destroyed) return;
    const angle = time * 0.72 + index * 1.7;
    const length = 52;
    ctx.strokeStyle = "rgba(34,211,238,0.34)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(camera.x, camera.y);
    ctx.lineTo(camera.x + Math.cos(angle) * length, camera.y + Math.sin(angle) * length);
    ctx.stroke();
    ctx.fillStyle = "rgba(240,253,255,0.72)";
    ctx.beginPath();
    ctx.arc(camera.x + Math.cos(angle) * length, camera.y + Math.sin(angle) * length, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function drawTaskTransferStationEffect(station, active, time, phase) {
  const download = station.task === "download";
  const source = download ? state.textures.transferInEffect : state.textures.transferOutEffect;
  const sprite = source ? transparentSpriteSource(source, `task-transfer-${download ? "download" : "upload"}-v343`, 24) : null;
  if (!sprite) return false;
  const pulse = 1 + Math.sin(time * (download ? 3.2 : 2.6) + phase * 9) * 0.035;
  const size = (active ? 132 : 102) * pulse;
  ctx.save();
  ctx.translate(station.x, station.y - 10);
  ctx.globalCompositeOperation = "screen";
  applyAteGlowContext(
    ctx,
    download ? "data-down" : "data-up",
    time,
    phase,
    active ? 1.08 : 0.62
  );
  const direction = download ? 1 : -1;
  const travel = ((time * 0.62 + phase) % 1 + 1) % 1;
  ctx.globalAlpha = active ? 0.24 : 0.1;
  drawNormalizedSpriteCentered(sprite, 0, direction * (travel - 0.5) * 12, size * 1.12, size * 1.12);
  ctx.globalAlpha = active ? 0.94 : 0.38;
  drawNormalizedSpriteCentered(sprite, 0, direction * Math.sin(time * 2.4 + phase * 4) * 3, size, size);

  const particleCount = active ? 12 : 6;
  const particleColor = download ? "rgba(103,232,249,0.92)" : "rgba(186,230,253,0.92)";
  for (let index = 0; index < particleCount; index += 1) {
    const cycle = ((time * (active ? 0.92 : 0.54) + phase + index / particleCount) % 1 + 1) % 1;
    const angle = phase * Math.PI * 2 + index * 2.399963229728653;
    const radius = size * (0.18 + cycle * 0.34);
    const particleSize = (active ? 4.4 : 3.1) * (1 - cycle * 0.46);
    ctx.save();
    ctx.translate(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.62 + direction * (cycle - 0.5) * 18
    );
    ctx.rotate(angle + time * direction * 1.8);
    ctx.globalAlpha = (active ? 0.84 : 0.34) * Math.sin(Math.PI * cycle);
    ctx.fillStyle = particleColor;
    ctx.shadowColor = particleColor;
    ctx.shadowBlur = active ? 9 : 5;
    ctx.fillRect(-particleSize / 2, -particleSize / 2, particleSize, particleSize);
    ctx.restore();
  }
  ctx.restore();
  return true;
}

function activeTaskEntries(data) {
  return (data.self.tasks || [])
    .filter((task) => !task.done)
    .map((task) => {
      const station = data.map.stations.find((item) => item.id === task.stationId);
      return station ? { task, station } : null;
    })
    .filter(Boolean);
}

function drawTaskEdgeIndicators(data, camera, w, h, zoom = CAMERA_ZOOM) {
  if (data.self.role !== "defender" || data.phase !== "playing") return;
  const rightLimit = w - 34;
  activeTaskEntries(data).forEach(({ task, station }) => {
    const sx = (station.x - camera.x) * zoom;
    const sy = (station.y - camera.y) * zoom;
    const inside = sx >= 28 && sy >= 28 && sx <= w - 28 && sy <= h - 28;
    if (inside) return;
    const x = clamp(sx, 34, rightLimit);
    const y = clamp(sy, 34, h - 34);
    const download = task.type === "download";
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#e6fbff";
    ctx.shadowColor = "rgba(2,18,28,0.96)";
    ctx.shadowBlur = 4;
    ctx.font = "900 12px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(download ? "DL" : "UP", 0, 0);
    ctx.shadowBlur = 0;
    ctx.restore();
  });
}

function drawSabotageRepairIndicators(data, camera, w, h, zoom = CAMERA_ZOOM) {
  if (data.phase !== "playing") return;
  const stations = sabotageRepairStations(data);
  if (!stations.length) return;
  for (const station of stations) {
    const sx = (station.x - camera.x) * zoom;
    const sy = (station.y - camera.y) * zoom;
    const inside = sx >= 38 && sy >= 92 && sx <= w - 38 && sy <= h - 38;
    if (inside) continue;
    const x = clamp(sx, 52, w - 52);
    const y = clamp(sy, 104, h - 52);
    const pulse = 1 + Math.sin((state.frameNow || 0) / 110) * 0.12;
    drawSabotageRepairMarker(ctx, x, y, 64, pulse);
  }
}

function drawSmartphoneRepairControl(data, w) {
  const repair = smartphoneRepairState(data);
  if (!repair.visible) return;
  const bounds = smartphoneRepairCanvasBounds(w);
  const texture = repair.remote
    ? state.textures.smartphoneRepairIcon || state.textures.sabotageRepairMarker
    : state.textures.sabotageRepairMarker;
  const time = (state.frameNow || 0) / 1000;
  const pulse = 1 + Math.sin(time * Math.PI * 2.4) * 0.035;
  const size = bounds.width * pulse;
  const centerX = bounds.x + bounds.width / 2;
  const centerY = bounds.y + bounds.height / 2;
  ctx.save();
  ctx.globalAlpha = repair.disabled ? 0.42 : 0.98;
  ctx.translate(centerX, centerY);
  ctx.shadowColor = repair.itemBlocked ? "rgba(239, 68, 68, 0.78)" : "rgba(34, 211, 238, 0.72)";
  ctx.shadowBlur = repair.disabled ? 5 : 15 + Math.sin(time * 5.2) * 3;
  if (texture?.complete && texture.naturalWidth) {
    ctx.drawImage(texture, -size / 2, -size / 2, size, size);
  } else {
    ctx.fillStyle = repair.itemBlocked ? "#991b1b" : "#0e7490";
    ctx.fillRect(-size * 0.32, -size * 0.44, size * 0.64, size * 0.88);
    ctx.fillStyle = "#ecfeff";
    ctx.fillRect(-size * 0.19, -size * 0.31, size * 0.38, size * 0.47);
  }
  ctx.shadowBlur = 0;
  ctx.fillStyle = repair.itemBlocked ? "#fecaca" : repair.enoughStamina ? "#ecfeff" : "#fde68a";
  ctx.font = "900 12px Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(repair.itemBlocked ? "EMP" : "4", 0, size * 0.38);
  ctx.restore();
}

function sabotageRepairStations(data) {
  if (!data?.map) return [];
  const targets = [];
  if (data.sabotage) {
    const repairedPoints = data.sabotage.repairedPoints || {};
    targets.push(...data.map.stations.filter((station) => (
      station.type === "repair" &&
      station.repair === data.sabotage.type &&
      !repairedPoints[station.id]
    )));
  }
  const activeDoorIds = new Set(Array.isArray(data.activeDoorIds) ? data.activeDoorIds : []);
  targets.push(...data.map.doors
    .filter((door) => activeDoorIds.has(door.id))
    .map((door) => ({
      id: `door-repair-${door.id}`,
      x: door.x + door.w / 2,
      y: door.y + door.h / 2,
      repair: "doors"
    })));
  return targets;
}

function drawSabotageRepairMarker(targetCtx, x, y, size, pulse = 1) {
  const texture = state.textures.sabotageRepairMarker;
  const drawSize = size * pulse;
  targetCtx.save();
  targetCtx.translate(x, y);
  targetCtx.globalAlpha = 0.94;
  targetCtx.shadowColor = "rgba(245, 158, 11, 0.72)";
  targetCtx.shadowBlur = Math.max(5, drawSize * 0.13);
  if (texture?.complete && texture.naturalWidth) {
    targetCtx.drawImage(texture, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
  } else {
    targetCtx.rotate(Math.PI / 4);
    targetCtx.fillStyle = "#f59e0b";
    targetCtx.strokeStyle = "#fff7d6";
    targetCtx.lineWidth = Math.max(2, drawSize * 0.08);
    targetCtx.fillRect(-drawSize * 0.32, -drawSize * 0.32, drawSize * 0.64, drawSize * 0.64);
    targetCtx.strokeRect(-drawSize * 0.32, -drawSize * 0.32, drawSize * 0.64, drawSize * 0.64);
  }
  targetCtx.restore();
}

function drawVendingEdgeIndicator(data, camera, w, h, zoom = CAMERA_ZOOM) {
  if (data.phase !== "playing") return;
  const self = selfPlayer();
  if (!self) return;
  const station = data.map.stations
    .filter((item) => item.type === "vending")
    .map((item) => ({ ...item, distance: dist(self, item) }))
    .sort((a, b) => a.distance - b.distance)[0];
  if (!station) return;
  const sx = (station.x - camera.x) * zoom;
  const sy = (station.y - camera.y) * zoom;
  const rightLimit = w - 54;
  const inside = sx >= 40 && sy >= 100 && sx <= rightLimit && sy <= h - 40;
  if (inside) return;
  const x = clamp(sx, 54, rightLimit);
  const y = clamp(sy, 112, h - 54);
  ctx.save();
  ctx.fillStyle = "rgba(24,32,38,0.94)";
  ctx.strokeStyle = "#fde047";
  ctx.lineWidth = 3;
  roundRect(x - 47, y - 23, 94, 46, 8, true, true);
  ctx.fillStyle = "#fde047";
  ctx.font = "900 13px Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("V 自販機", x, y - 6);
  ctx.fillStyle = "#f8fafc";
  ctx.font = "800 11px Segoe UI, sans-serif";
  ctx.fillText(`${Math.round(station.distance)}m`, x, y + 11);
  ctx.restore();
}

function drawBodies(data) {
  data.bodies.forEach((body) => {
    ctx.save();
    ctx.translate(body.x, body.y);
    ctx.fillStyle = "#ef4444";
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 8, 21, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.arc(-9, 1, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawWorldSoundEffects() {
  const now = state.frameNow || performance.now();
  state.worldSoundEffects = state.worldSoundEffects.filter((effect) => now - effect.startedAt < effect.duration);
  for (const effect of state.worldSoundEffects) {
    const progress = clamp((now - effect.startedAt) / effect.duration, 0, 1);
    ctx.save();
    ctx.globalAlpha = 1 - progress;
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 5 - progress * 2;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, 28 + progress * 125, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, 16 + progress * 55, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawHitEffects() {
  const now = state.frameNow || performance.now();
  state.hitEffects = state.hitEffects.filter((effect) => now - effect.startedAt < effect.duration);
  for (const effect of state.hitEffects) {
    const progress = clamp((now - effect.startedAt) / effect.duration, 0, 1);
    const seed = [...String(effect.id)].reduce((value, character) => ((value * 31) + character.charCodeAt(0)) >>> 0, 17);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let index = 0; index < 22; index += 1) {
      const angle = ((seed % 360) + index * 137.5) * Math.PI / 180;
      const speed = 38 + ((seed >> (index % 12)) & 31) + index * 1.7;
      const travel = speed * Math.sin(Math.min(1, progress) * Math.PI * 0.62);
      const x = effect.x + Math.cos(angle) * travel;
      const y = effect.y + Math.sin(angle) * travel + progress * progress * 34;
      const alpha = (1 - progress) * (index % 3 === 0 ? 0.95 : 0.72);
      const hue = (seed + index * 43 + now / 7) % 360;
      const radius = Math.max(1.2, (effect.lethal ? 6.5 : 5) * (1 - progress * 0.65) * (0.7 + (index % 4) * 0.1));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `hsl(${hue} 96% 62%)`;
      ctx.shadowColor = `hsl(${hue} 100% 72%)`;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.ellipse(x, y, radius * 1.45, radius, angle, 0, Math.PI * 2);
      ctx.fill();
      if (index % 3 === 0) drawRainbowSpark(x, y, radius * 2.4, hue, angle + now / 420);
    }
    ctx.globalAlpha = 1 - progress;
    ctx.strokeStyle = `hsl(${(seed + now / 5) % 360} 100% 72%)`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, 16 + progress * (effect.lethal ? 76 : 52), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawHazardFields(data) {
  const fields = Array.isArray(data.hazardFields) ? data.hazardFields : [];
  const now = state.frameNow || performance.now();
  for (const field of fields) {
    const radius = Math.max(24, Number(field.radius) || 80);
    const kind = String(field.kind || "");
    const textureKey = kind === "fire" ? "hazardFireEffect" : kind === "poison" ? "hazardPoisonEffect" : "hazardWaterEffect";
    const image = state.textures?.[textureKey];
    const prepared = image ? transparentSpriteSource(image, textureKey, 18) : null;
    const sprite = prepared ? normalizedSpriteFrame(prepared, textureKey, 1, 1, 0, 0) : null;
    ctx.save();
    ctx.translate(Number(field.x) || 0, Number(field.y) || 0);
    ctx.globalAlpha = 0.72;
    ctx.globalCompositeOperation = kind === "water" ? "source-over" : "lighter";
    if (sprite) {
      drawAnimatedTextureCentered(sprite, 0, 0, radius * 2.25, radius * 2.25, {
        mode: kind === "water" ? "ripple" : "flow-up",
        time: now / 1000,
        phase: Number(field.x || 0) * 0.001,
        intensity: 0.92,
        baseAlpha: 0.16
      });
    } else {
      const color = kind === "fire" ? "rgba(249,115,22,.42)" : kind === "poison" ? "rgba(132,204,22,.38)" : "rgba(56,189,248,.34)";
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

const ATE_GLOW_PROFILES = Object.freeze({
  energy: Object.freeze({ core: "rgba(245,243,255,.52)", aura: "rgba(167,139,250,.42)", outer: "rgba(34,211,238,.26)", blur: 15, pulse: 0.18 }),
  beam: Object.freeze({ core: "rgba(255,255,255,.58)", aura: "rgba(103,232,249,.46)", outer: "rgba(96,165,250,.28)", blur: 18, pulse: 0.12 }),
  ripple: Object.freeze({ core: "rgba(236,254,255,.54)", aura: "rgba(56,189,248,.42)", outer: "rgba(45,212,191,.26)", blur: 14, pulse: 0.22 }),
  "flow-up": Object.freeze({ core: "rgba(240,253,244,.52)", aura: "rgba(74,222,128,.42)", outer: "rgba(250,204,21,.24)", blur: 16, pulse: 0.2 }),
  "data-down": Object.freeze({ core: "rgba(236,254,255,.52)", aura: "rgba(34,211,238,.42)", outer: "rgba(132,204,22,.24)", blur: 13, pulse: 0.14 }),
  "data-up": Object.freeze({ core: "rgba(240,249,255,.52)", aura: "rgba(56,189,248,.42)", outer: "rgba(163,230,53,.24)", blur: 13, pulse: 0.14 }),
  "data-accelerate": Object.freeze({ core: "rgba(255,255,255,.58)", aura: "rgba(34,211,238,.46)", outer: "rgba(168,85,247,.3)", blur: 17, pulse: 0.2 }),
  shimmer: Object.freeze({ core: "rgba(255,247,237,.54)", aura: "rgba(250,204,21,.42)", outer: "rgba(244,114,182,.26)", blur: 15, pulse: 0.28 }),
  orbit: Object.freeze({ core: "rgba(250,245,255,.52)", aura: "rgba(192,132,252,.42)", outer: "rgba(251,191,36,.25)", blur: 17, pulse: 0.16 }),
  resonance: Object.freeze({ core: "rgba(255,255,255,.6)", aura: "rgba(34,211,238,.48)", outer: "rgba(244,114,182,.34)", blur: 20, pulse: 0.3 }),
  glitch: Object.freeze({ core: "rgba(255,255,255,.5)", aura: "rgba(34,211,238,.44)", outer: "rgba(244,114,182,.3)", blur: 12, pulse: 0.34 }),
  teleport: Object.freeze({ core: "rgba(245,243,255,.54)", aura: "rgba(139,92,246,.44)", outer: "rgba(34,211,238,.27)", blur: 19, pulse: 0.24 }),
  gravity: Object.freeze({ core: "rgba(237,233,254,.5)", aura: "rgba(124,58,237,.46)", outer: "rgba(14,165,233,.28)", blur: 21, pulse: 0.2 }),
  impact: Object.freeze({ core: "rgba(255,247,237,.54)", aura: "rgba(251,146,60,.44)", outer: "rgba(239,68,68,.28)", blur: 17, pulse: 0.3 }),
  recoil: Object.freeze({ core: "rgba(248,250,252,.5)", aura: "rgba(96,165,250,.4)", outer: "rgba(249,115,22,.25)", blur: 13, pulse: 0.26 }),
  shield: Object.freeze({ core: "rgba(255,255,255,.54)", aura: "rgba(147,197,253,.43)", outer: "rgba(129,140,248,.26)", blur: 18, pulse: 0.16 }),
  combustion: Object.freeze({ core: "rgba(255,247,237,.54)", aura: "rgba(249,115,22,.46)", outer: "rgba(225,29,72,.29)", blur: 20, pulse: 0.3 }),
  targeting: Object.freeze({ core: "rgba(240,253,250,.58)", aura: "rgba(45,212,191,.46)", outer: "rgba(250,204,21,.28)", blur: 16, pulse: 0.14 }),
  clairvoyance: Object.freeze({ core: "rgba(255,255,255,.62)", aura: "rgba(56,189,248,.48)", outer: "rgba(250,204,21,.3)", blur: 19, pulse: 0.2 })
});

function normalizeAteGlowMode(mode = "energy") {
  const aliases = {
    charge: "flow-up",
    cleanse: "ripple",
    heal: "flow-up",
    bloom: "flow-up",
    dash: "beam",
    rewind: "orbit",
    constellation: "orbit",
    breathe: "ripple",
    burst: "impact",
    signal: "data-up",
    pulse: "energy"
  };
  const normalized = aliases[mode] || mode;
  return ATE_GLOW_PROFILES[normalized] ? normalized : "energy";
}

function applyAteGlowContext(targetContext, mode, time = 0, phase = 0, intensity = 1) {
  const profile = ATE_GLOW_PROFILES[normalizeAteGlowMode(mode)];
  const strength = clamp(Number(intensity) || 0, 0.12, 1.6);
  const pulse = 1 + Math.sin(time * (2.1 + profile.pulse * 2.4) + phase * Math.PI * 2) * profile.pulse;
  const auraBlur = Math.max(6, profile.blur * pulse * strength);
  const outerBlur = Math.max(8, profile.blur * 1.72 * (0.94 + pulse * 0.06) * strength);
  const inheritedFilter = targetContext.filter && targetContext.filter !== "none" ? `${targetContext.filter} ` : "";
  targetContext.filter = `${inheritedFilter}drop-shadow(0 0 ${auraBlur.toFixed(2)}px ${profile.aura})`;
  targetContext.shadowColor = profile.outer;
  targetContext.shadowBlur = outerBlur * 0.46;
  return profile;
}

function drawAteComplementaryVfx(targetContext, mode, width, height, time = 0, phase = 0, intensity = 1) {
  if (!(width > 0 && height > 0)) return;
  const rawIntensity = Number(intensity);
  if (!Number.isFinite(rawIntensity) || rawIntensity <= 0.001) return;
  const normalizedMode = normalizeAteGlowMode(mode);
  const profile = ATE_GLOW_PROFILES[normalizedMode];
  const sampledTime = Math.floor(time * 60) / 60;
  const strength = clamp(rawIntensity, 0, 1.4);
  const count = normalizedMode === "resonance" ? 10 : ["data-down", "data-up", "data-accelerate"].includes(normalizedMode) ? 7 : 5;
  const direction = normalizedMode === "data-down" ? 1 : -1;

  targetContext.save();
  targetContext.globalCompositeOperation = "lighter";
  targetContext.filter = "none";
  targetContext.shadowColor = profile.aura;
  targetContext.shadowBlur = Math.max(4, profile.blur * 0.42 * strength);
  for (let index = 0; index < count; index += 1) {
    const seed = phase * 7.13 + index * 1.917;
    const cycle = ((sampledTime * (0.34 + index * 0.013) + seed) % 1 + 1) % 1;
    let x = 0;
    let y = 0;
    let rotation = sampledTime * (0.8 + index * 0.07) + seed;
    let shardWidth = Math.max(2, Math.min(width, height) * (0.018 + (index % 3) * 0.005));
    let shardHeight = shardWidth * (1.6 + (index % 2) * 0.7);

    if (normalizedMode === "data-accelerate") {
      const input = index < 3;
      const lane = input ? index : index - 3;
      const laneCount = input ? 3 : 4;
      const laneY = (-0.24 + lane * (0.48 / Math.max(1, laneCount - 1))) * height;
      x = input
        ? -width * 0.44 + cycle * width * 0.34
        : width * 0.1 + cycle * width * 0.36;
      y = laneY + Math.sin(sampledTime * 3.2 + seed) * height * 0.018;
      rotation = 0;
      shardWidth *= input ? 1.15 : 1.9;
      shardHeight *= input ? 0.9 : 0.55;
    } else if (["beam", "recoil", "data-down", "data-up"].includes(normalizedMode)) {
      x = -width * 0.38 + cycle * width * 0.76;
      y = (-0.24 + (index % 4) * 0.16) * height;
      if (normalizedMode === "data-down" || normalizedMode === "data-up") {
        x = (-0.3 + (index % 5) * 0.15) * width;
        y = direction * (-height * 0.36 + cycle * height * 0.72);
        shardWidth *= 1.35;
        shardHeight *= 0.72;
      } else {
        rotation = 0;
        shardWidth *= 2.1;
        shardHeight *= 0.55;
      }
    } else if (["flow-up", "combustion"].includes(normalizedMode)) {
      x = (-0.3 + (index % 5) * 0.15) * width + Math.sin(sampledTime * 2.1 + seed) * width * 0.025;
      y = height * 0.34 - cycle * height * 0.68;
      rotation *= 0.7;
    } else if (["orbit", "gravity", "teleport"].includes(normalizedMode)) {
      const angle = sampledTime * (0.9 + index * 0.04) + seed;
      x = Math.cos(angle) * width * (0.25 + (index % 2) * 0.06);
      y = Math.sin(angle) * height * (0.2 + (index % 3) * 0.025);
      if (normalizedMode === "teleport") y += (cycle - 0.5) * height * 0.24;
      rotation = angle + Math.PI / 4;
    } else if (normalizedMode === "resonance") {
      const side = index % 2 ? -1 : 1;
      const convergence = Math.min(1, cycle / 0.56);
      if (cycle < 0.56) {
        x = side * width * (0.46 - convergence * 0.36);
        y = Math.sin(seed * 1.9) * height * 0.28 * (1 - convergence);
        rotation = side > 0 ? Math.PI : 0;
      } else {
        const release = (cycle - 0.56) / 0.44;
        const angle = seed * 0.73 + side * release * 0.34;
        x = Math.cos(angle) * width * (0.08 + release * 0.34);
        y = Math.sin(angle) * height * (0.06 + release * 0.3);
        rotation = angle + Math.PI / 4;
      }
      shardWidth *= 0.72;
      shardHeight *= 1.42;
    } else if (normalizedMode === "clairvoyance") {
      const sweep = ((sampledTime * 0.42 + index / Math.max(1, count)) % 1 + 1) % 1;
      x = (-0.4 + sweep * 0.8) * width;
      y = Math.sin(sweep * Math.PI * 2 + seed) * height * 0.16;
      rotation = Math.atan2(Math.cos(sweep * Math.PI * 2 + seed) * height * 0.16, width * 0.8);
      shardWidth *= 1.7;
      shardHeight *= 0.56;
    } else if (normalizedMode === "glitch") {
      x = (-0.34 + cycle * 0.68) * width;
      y = (-0.32 + (index % 6) * 0.13) * height;
      rotation = 0;
      shardWidth *= 2.4;
      shardHeight *= 0.5;
    } else {
      const angle = seed + cycle * Math.PI * 2;
      const radius = (0.12 + cycle * 0.22) * Math.min(width, height);
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
      rotation = angle + Math.PI / 4;
    }

    const life = Math.sin(cycle * Math.PI);
    targetContext.save();
    targetContext.translate(x, y);
    targetContext.rotate(rotation);
    targetContext.globalAlpha = clamp((0.16 + life * 0.5) * strength, 0, 0.82);
    targetContext.fillStyle = index % 2 ? profile.core : profile.aura;
    targetContext.fillRect(-shardWidth / 2, -shardHeight / 2, shardWidth, shardHeight);
    targetContext.restore();
  }
  targetContext.restore();
}

function drawMagicEffects() {
  if (!["playing", "meeting"].includes(state.data?.phase)) {
    state.magicEffects = [];
    return;
  }
  const now = state.frameNow || performance.now();
  state.magicEffects = state.magicEffects.filter((effect) => now - effect.startedAt < effect.duration);
  const activeGainEffects = state.magicEffects.filter((effect) => effect.type.startsWith("gain-") && effect.playerId);
  for (const effect of state.magicEffects) {
    const progress = clamp((now - effect.startedAt) / effect.duration, 0, 1);
    if (effect.type.startsWith("gain-")) {
      const peerEffects = activeGainEffects.filter((entry) => entry.playerId === effect.playerId);
      drawGainAcquisitionEffect(effect, progress, now, peerEffects.indexOf(effect), peerEffects.length);
      continue;
    }
    if (drawGeneratedStandaloneEffect(effect, progress)) continue;
    if (drawInventionEnergyTexture(effect, progress)) continue;
    if (drawTacticalSystemsEffect(effect, progress)) continue;
    if (["fighter-iaido", "fighter-slash", "fighter-slash-parry"].includes(effect.type) && drawFighterDodgeCounterEffect(effect, progress)) continue;
    if (effect.type.startsWith("object-")) {
      drawObjectActivationEffect(effect, progress, now);
      continue;
    }
    if (effect.type === "flora") {
      drawFloraGeneratedEffect(effect, progress, false);
    }
    if (effect.type === "flora-sunbeam") {
      if (!drawFloraGeneratedEffect(effect, progress, true)) drawDirectedEnergyEffect(effect, progress, now);
    }
    if (effect.type === "alchemy-railgun" || effect.type === "alchemy-particle-beam") drawDirectedEnergyEffect(effect, progress, now);
    if (effect.type.startsWith("gravity-storm-")) drawGravityStormImpactEffect(effect, progress);
    if (effect.type === "emp" || effect.type.startsWith("emp-")) drawEmpEffect(effect, progress, now);
    if (effect.type.startsWith("status-") || effect.type.startsWith("hazard-")) drawStatusAndHazardEffect(effect, progress);
    if (effect.type === "mystery-reveal") drawPhilosophyAtlasEffect(effect, 10, progress, 170);
    if (effect.type.startsWith("action-")) drawActionEffect(effect, progress, now);
    if (effect.type.startsWith("idea-")) drawIdeaEffect(effect, progress, now);
  }
}

function drawJumpPreparationEffect(data) {
  if (!state.jumpPreparing || data.phase !== "playing" || !data.self.alive) return;
  const self = data.players.find((player) => player.id === data.selfId);
  const position = self ? renderedPlayer(self) : null;
  if (!position) return;
  const prepared = transparentSpriteSource(state.textures.jumpActionEffect, "jump-action-effect", 16);
  const sprite = prepared ? normalizedSpriteFrame(prepared, "jump-action-effect", 1, 1, 0, 0) : null;
  if (!sprite) return;
  const elapsed = Math.max(0, performance.now() - state.jumpKeyDownAt);
  const distance = 120 + elapsed * 0.9;
  const visualLength = Math.min(560, 120 + Math.sqrt(distance) * 16);
  const direction = state.jumpPrepareDirection;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.46 + Math.min(0.36, elapsed / 4200);
  ctx.translate(position.x, position.y + 3);
  ctx.rotate(Math.atan2(direction.dy, direction.dx));
  drawAnimatedTextureCentered(sprite, visualLength * 0.34, 0, visualLength, 150, {
    mode: "beam",
    time: (state.frameNow || performance.now()) / 1000,
    intensity: 0.9,
    baseAlpha: 0.16
  });
  ctx.restore();
}

function clientEnhanceLevel(elapsedMs, self = state.data?.self) {
  const requested = Math.min(
    ENHANCE_MAX_LEVEL_CLIENT,
    Math.floor(Math.max(0, Number(elapsedMs) || 0) / ENHANCE_HOLD_STEP_MS_CLIENT)
  );
  return Math.min(requested, Math.max(0, Math.floor(Number(self?.mana) || 0)));
}

function currentThrowDirection(data) {
  const input = getDirection();
  if (input.dx || input.dy) return input;
  const aimX = Number(data?.self?.aimX) || 0;
  const aimY = Number(data?.self?.aimY) || 0;
  const length = Math.hypot(aimX, aimY);
  if (length > 0.01) return { dx: aimX / length, dy: aimY / length };
  const facing = state.facing.get(data?.selfId) || "down";
  return {
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 },
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 }
  }[facing];
}

function predictedThrowLanding(data, elapsedMs) {
  const self = data?.players?.find((player) => player.id === data.selfId);
  if (!self || !data?.map) return null;
  const origin = renderedPlayer(self);
  const direction = currentThrowDirection(data);
  const intendedDistance = ITEM_THROW_BASE_DISTANCE_CLIENT;
  const radius = Math.max(12, (Number(data.map.playerRadius) || 36) * 0.4);
  for (let ratio = 1; ratio >= 0.15; ratio -= 0.05) {
    const x = clamp(origin.x + direction.dx * intendedDistance * ratio, radius, data.map.width - radius);
    const y = clamp(origin.y + direction.dy * intendedDistance * ratio, radius, data.map.height - radius);
    if (isClientWalkable(data, x, y, radius)) {
      return {
        origin,
        x,
        y,
        direction,
        distance: intendedDistance * ratio,
        intendedDistance,
        charge: clamp(clientEnhanceLevel(elapsedMs, data.self) / ENHANCE_MAX_LEVEL_CLIENT, 0, 1)
      };
    }
  }
  return { origin, x: origin.x, y: origin.y, direction, distance: 0, intendedDistance, charge: 0 };
}

function targetedThrowLanding(data) {
  if (!state.throwTargeting.active) return null;
  const target = constrainThrowTarget(data, state.throwTargeting.targetX, state.throwTargeting.targetY);
  if (!target) return null;
  const dx = target.x - target.origin.x;
  const dy = target.y - target.origin.y;
  const distance = Math.hypot(dx, dy);
  const radius = Math.max(12, (Number(data.map.playerRadius) || 36) * 0.4);
  return {
    origin: target.origin,
    x: target.x,
    y: target.y,
    direction: distance > 0.01 ? { dx: dx / distance, dy: dy / distance } : currentThrowDirection(data),
    distance,
    intendedDistance: Math.hypot(Number(data.map.width) || 0, Number(data.map.height) || 0),
    charge: clamp(clientEnhanceLevel(state.throwTargeting.holdMs, data.self) / ENHANCE_MAX_LEVEL_CLIENT, 0, 1),
    valid: isClientWalkable(data, target.x, target.y, radius)
  };
}

function drawThrowLandingPreview(data) {
  const hold = state.enhanceHold;
  const targeting = state.throwTargeting.active;
  if ((!targeting && (hold.kind !== "throw" || !hold.startedAt)) || data.phase !== "playing" || !data.self?.alive) return;
  const itemId = targeting ? state.throwTargeting.itemId : els.itemSelect?.value || "";
  if (!itemId) return;
  const elapsedMs = targeting ? state.throwTargeting.holdMs : Math.max(0, performance.now() - hold.startedAt);
  const landing = targeting ? targetedThrowLanding(data) : predictedThrowLanding(data, elapsedMs);
  if (!landing) return;
  const prepared = transparentSpriteSource(state.textures.throwLandingPreview, "throw-landing-preview", 16);
  const sprite = prepared ? normalizedSpriteFrame(prepared, "throw-landing-preview", 1, 1, 0, 0) : null;
  if (!sprite) return;
  const now = (state.frameNow || performance.now()) / 1000;
  const mapDiagonal = Math.max(1, Math.hypot(Number(data.map.width) || 0, Number(data.map.height) || 0));
  const distanceRatio = clamp(landing.distance / mapDiagonal, 0, 1);
  const markerSize = 92 + distanceRatio * 26;
  const markerX = Math.round(landing.x);
  const markerY = Math.round(landing.y);

  ctx.save();
  ctx.translate(markerX, markerY);
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.82 + Math.sin(now * 4.8) * 0.08;
  drawAnimatedTextureCentered(sprite, 0, 0, markerSize, markerSize, {
    mode: "targeting",
    time: now,
    phase: distanceRatio,
    intensity: 0.98,
    baseAlpha: 0.3,
    opacityBoost: 2.5,
    visibilityProfile: "ambient"
  });
  for (let glint = 0; glint < 5; glint += 1) {
    const cycle = ((now * (0.72 + glint * 0.035) + glint * 0.19) % 1 + 1) % 1;
    const x = Math.sin(glint * 2.17) * markerSize * 0.31;
    const y = -18 - cycle * 34;
    const alpha = Math.sin(cycle * Math.PI) * 0.7;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = glint % 2 ? "#facc15" : "#67e8f9";
    ctx.fillRect(x - 1.5, y - 4, 3, 8);
  }
  ctx.restore();

  if (targeting) {
    const remaining = Math.max(0, state.throwTargeting.expiresAt - performance.now());
    const label = landing.valid
      ? `接地点 ${(remaining / 1000).toFixed(1)}秒 / 離して確定`
      : `着地不可 ${(remaining / 1000).toFixed(1)}秒`;
    ctx.save();
    ctx.font = "800 13px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const width = Math.max(146, ctx.measureText(label).width + 24);
    const x = markerX - width / 2;
    const y = markerY + markerSize * 0.55;
    ctx.fillStyle = landing.valid ? "rgba(8,25,39,0.9)" : "rgba(69,10,10,0.92)";
    ctx.strokeStyle = landing.valid ? "rgba(103,232,249,0.95)" : "rgba(251,113,133,0.95)";
    ctx.lineWidth = 2;
    roundRect(x, y, width, 28, 8, true, true);
    ctx.fillStyle = "#f8fafc";
    ctx.fillText(label, markerX, y + 14);
    ctx.restore();
  }

  const trajectoryLength = Math.hypot(markerX - landing.origin.x, markerY - landing.origin.y);
  const particleCount = Math.max(5, Math.min(16, Math.floor(trajectoryLength / 48)));
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let index = 1; index <= particleCount; index += 1) {
    const baseT = index / (particleCount + 1);
    const flow = ((now * 0.46 + baseT) % 1 + 1) % 1;
    const t = 0.08 + flow * 0.84;
    const x = landing.origin.x + (markerX - landing.origin.x) * t;
    const arcHeight = Math.sin(t * Math.PI) * Math.min(118, 42 + trajectoryLength * 0.085);
    const y = landing.origin.y + (markerY - landing.origin.y) * t - arcHeight;
    const alpha = Math.sin(t * Math.PI) * (0.28 + distanceRatio * 0.34);
    const size = 2.2 + (index % 3) * 0.8;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4 + t * 0.9);
    ctx.globalAlpha = alpha;
    ctx.shadowColor = index % 2 ? "#facc15" : "#22d3ee";
    ctx.shadowBlur = 8;
    ctx.fillStyle = index % 2 ? "#fde68a" : "#a5f3fc";
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.restore();
  }
  ctx.restore();

  if (targeting && throwTargetClairvoyanceActive(data)) drawClairvoyanceAte(landing, now);
}

function drawClairvoyanceAte(landing, time) {
  const prepared = transparentSpriteSource(state.textures.clairvoyanceThrowAte, "clairvoyance-throw-ate", 16);
  const sprite = prepared ? normalizedSpriteFrame(prepared, "clairvoyance-throw-ate", 1, 1, 0, 0) : null;
  if (!sprite) return;
  const phase = (time * 0.37) % 1;
  const size = 118 + Math.sin(time * 3.1) * 5;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  drawAnimatedTextureCentered(sprite, landing.x, landing.y - 4, size, size, {
    mode: "clairvoyance",
    time,
    phase,
    intensity: 0.94,
    baseAlpha: 0.18
  });
  ctx.restore();
}

function drawStandaloneClairvoyanceAte(data) {
  if (!state.clairvoyance.active || state.throwTargeting.active || data.phase !== "playing") return;
  drawClairvoyanceAte({ x: state.clairvoyance.x, y: state.clairvoyance.y }, (state.frameNow || performance.now()) / 1000);
}

function drawInventionEnergyTexture(effect, progress) {
  const railgun = effect.type === "alchemy-railgun";
  const particle = effect.type === "alchemy-particle-cannon" || effect.type === "alchemy-particle-beam";
  if (!railgun && !particle) return false;
  const textureKey = railgun ? "alchemyRailgunFieldEffect" : "alchemyParticleCannonFieldEffect";
  const prepared = transparentSpriteSource(state.textures[textureKey], textureKey, 18);
  const sprite = prepared ? normalizedSpriteFrame(prepared, textureKey, 1, 1, 0, 0) : null;
  if (!sprite) return false;
  const targetX = Number.isFinite(effect.targetX) ? effect.targetX : effect.x + (railgun ? 5000 : 1250);
  const targetY = Number.isFinite(effect.targetY) ? effect.targetY : effect.y;
  const dx = targetX - effect.x;
  const dy = targetY - effect.y;
  const length = Math.max(260, Math.hypot(dx, dy));
  const sourceAnchor = 0.08;
  const targetAnchor = 0.92;
  const renderWidth = length / (targetAnchor - sourceAnchor);
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  const renderHeight = (railgun ? 190 : 310) * (0.92 + pulse * 0.16);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = Math.max(0.12, 1 - progress * (railgun ? 0.84 : 0.62));
  ctx.translate(effect.x, effect.y);
  ctx.rotate(Math.atan2(dy, dx));
  drawAnimatedTextureCentered(
    sprite,
    (0.5 - sourceAnchor) * renderWidth,
    0,
    renderWidth,
    renderHeight,
    { mode: "beam", progress, intensity: railgun ? 1 : 0.92, baseAlpha: 0.15 }
  );
  ctx.restore();
  return true;
}

const GENERATED_EFFECT_TEXTURES = {
  "fire": ["fireJutsuFieldEffect", 520],
  "substitution": ["substitutionFieldEffect", 300],
  "limit-break": ["limitBreakFieldEffect", 360],
  "fighter-energy-charge": ["fighterEnergyChargeEffect", 220],
  "fighter-energy-release": ["fighterEnergyReleaseEffect", 180],
  "fighter-energy-impact": ["fighterEnergyImpactEffect", 250],
  "fighter-shockwave": ["fighterShockwaveEffect", 180],
  "fighter-push-acquired": ["pushMarkerEffect", 96],
  "hacker-root": ["hackerRootRainbow", 190],
  "preparation-barrier-hit": ["preparationBarrierEffect", 220],
  "alchemy-human-transmutation": ["humanTransmutationEffect", 260],
  "alchemy-excalibur": ["alchemyExcaliburEffect", 520],
  "action-vibe-coding": ["vibeCodingEffect", 220],
  "gunner-hover-sprint": ["gunnerHoverSprintEffect", 240],
  "gunner-rpg": ["gunnerRpgEffect", 280],
  "gunner-missile": ["gunnerMissileEffect", 250],
  "quantum-transmutation": ["quantumTransmutationEffect", 260],
  "quantum-temperature-cold": ["quantumColdEffect", 240],
  "quantum-temperature-hot": ["quantumHotEffect", 240],
  "quantum-ice-impact": ["quantumColdEffect", 280],
  "quantum-nuclear": ["quantumNuclearEffect", 760],
  "hazard-antidote": ["hazardWaterEffect", 250],
  "action-item-use": ["itemEnhanceEffect", 180],
  "action-item-throw": ["itemEnhanceEffect", 180],
  "bottle-shards": ["bottleShardEffect", 220],
  "action-jump": ["jumpActionEffect", 320],
  "action-push": ["pushStandFirmBreak", 230],
  "resolve-focus": ["resolvePoint", 190],
  "hacker-status-recover": ["floraHealV1", 210],
  "transfer-out": ["transferOutEffect", 190],
  "transfer-in": ["transferInEffect", 210]
};

function semanticEffectMotion(type, variant = "", fallback = "energy") {
  const token = `${String(type || "")} ${String(variant || "")}`.toLowerCase();
  if (/gravity|decelerate|accelerate/.test(token)) return "gravity";
  if (/emp|taser|vibe|hack|pair-route|smartphone/.test(token)) return "glitch";
  if (/teleport|warp|substitution|transfer/.test(token)) return "teleport";
  if (/fire|burn|hot|nuclear|rpg|missile/.test(token)) return "combustion";
  if (/railgun|particle|sunbeam|excalibur|slash|shoot|beam/.test(token)) return "beam";
  if (/reload|weapon-switch|sustained-fire/.test(token)) return "recoil";
  if (/grit|stand|shield|overheal|beauty/.test(token)) return "shield";
  if (/mana|water|antidote|heal|flora|recovery|cold|ice/.test(token)) return "ripple";
  if (/credits|luck|mystery|transmutation|invention/.test(token)) return "orbit";
  if (/jump|hover|limit-break|speed|acceleration|power/.test(token)) return "flow-up";
  if (/aim|weak-bullet|scope|reason|truth/.test(token)) return "shimmer";
  if (/push|impact|storm|violation/.test(token)) return "impact";
  return fallback;
}

function drawGoldCoinFromTexture(sprite, x, y, radius, rotation, alpha) {
  if (!sprite || alpha <= 0.004 || radius <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha *= alpha;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius, radius * 0.72, 0, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(sprite, -radius * 1.45, -radius * 1.45, radius * 2.9, radius * 2.9);
  ctx.restore();

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha *= alpha;
  ctx.strokeStyle = "rgba(255, 238, 144, 0.92)";
  ctx.lineWidth = Math.max(1.2, radius * 0.12);
  ctx.beginPath();
  ctx.ellipse(0, 0, radius, radius * 0.72, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawGoldTransmutationStages(goldSprite, progress) {
  const reveal = clamp((progress - 0.12) / 0.24, 0, 1);
  const breakApart = clamp((progress - 0.44) / 0.2, 0, 1);
  const coinsAppear = clamp((progress - 0.55) / 0.2, 0, 1);
  const creditConvert = clamp((progress - 0.78) / 0.2, 0, 1);
  const smoothReveal = reveal * reveal * (3 - 2 * reveal);
  const ingotWidth = 112;
  const ingotHeight = 86;

  if (breakApart <= 0.001) {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = smoothReveal;
    drawNormalizedSpriteCentered(
      goldSprite,
      0,
      -42 - (1 - smoothReveal) * 34,
      ingotWidth * (0.84 + smoothReveal * 0.16),
      ingotHeight * (0.84 + smoothReveal * 0.16)
    );
  } else if (breakApart < 1) {
    const fragmentCount = 5;
    const fragmentWidth = ingotWidth / fragmentCount;
    for (let index = 0; index < fragmentCount; index += 1) {
      const centeredIndex = index - (fragmentCount - 1) / 2;
      const offsetX = centeredIndex * 10 * breakApart;
      const offsetY = Math.abs(centeredIndex) * 4 * breakApart - breakApart * 8;
      ctx.save();
      ctx.translate(offsetX, -42 + offsetY);
      ctx.rotate(centeredIndex * 0.055 * breakApart);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1 - breakApart * 0.62;
      ctx.beginPath();
      ctx.rect(-ingotWidth / 2 + index * fragmentWidth, -ingotHeight / 2, fragmentWidth + 1, ingotHeight);
      ctx.clip();
      ctx.drawImage(goldSprite, -ingotWidth / 2, -ingotHeight / 2, ingotWidth, ingotHeight);
      ctx.restore();
    }
  }

  if (coinsAppear <= 0) return;
  const coinAlpha = coinsAppear * (1 - creditConvert);
  const coinCount = 7;
  for (let index = 0; index < coinCount; index += 1) {
    const side = index - (coinCount - 1) / 2;
    const fan = side * 22;
    const settleX = side * 17;
    const settleY = -34 + Math.abs(side) * 3;
    const x = fan * (1 - coinsAppear) + settleX * coinsAppear;
    const y = -50 - Math.sin((index + 1) * 1.27) * 16 * (1 - coinsAppear) + settleY * coinsAppear - creditConvert * 54;
    const radius = 10 + (index % 2) * 2;
    drawGoldCoinFromTexture(goldSprite, x, y, radius, side * 0.14 + progress * 2.4, coinAlpha);
  }

  if (creditConvert > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let index = 0; index < 12; index += 1) {
      const phase = index * 2.3999632297;
      const radius = (1 - creditConvert) * (22 + (index % 4) * 9);
      const x = Math.cos(phase) * radius;
      const y = -90 + Math.sin(phase) * radius * 0.62;
      const particleSize = 1.8 + (index % 3) * 0.9;
      ctx.globalAlpha = (1 - creditConvert) * (0.42 + (index % 4) * 0.12);
      ctx.fillStyle = index % 3 === 0 ? "#fff3bd" : index % 3 === 1 ? "#ffd45d" : "#e9a91f";
      ctx.beginPath();
      ctx.arc(x, y, particleSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function drawGeneratedStandaloneEffect(effect, progress) {
  const definition = effect.type === "limit-break" && effect.variant === "release"
    ? ["limitBreakReleaseEffect", 320]
    : GENERATED_EFFECT_TEXTURES[effect.type];
  if (!definition) return false;
  const [textureKey, defaultSize] = definition;
  const prepared = transparentSpriteSource(state.textures[textureKey], textureKey, 18);
  const sprite = prepared ? normalizedSpriteFrame(prepared, textureKey, 1, 1, 0, 0) : null;
  if (!sprite) return false;
  if (effect.type === "transfer-out" || effect.type === "transfer-in") {
    return drawTransferGeneratedEffect(effect, progress, sprite, defaultSize);
  }
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  const radiusSize = Number(effect.radius) > 0 ? Number(effect.radius) * 1.9 : defaultSize;
  const size = Math.min(effect.type === "quantum-nuclear" ? 1500 : 520, Math.max(defaultSize, radiusSize)) *
    (0.82 + pulse * 0.28 + progress * 0.14);
  const targetX = Number.isFinite(effect.targetX) ? effect.targetX : effect.x;
  const targetY = Number.isFinite(effect.targetY) ? effect.targetY : effect.y;
  const directed = ["gunner-missile", "alchemy-excalibur", "action-jump", "fighter-shockwave", "fighter-energy-release"].includes(effect.type) && (targetX !== effect.x || targetY !== effect.y);
  const renderHeight = ["fighter-shockwave", "fighter-energy-release"].includes(effect.type)
    ? Math.max(120, Number(effect.radius || 0) * 2.2)
    : size;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = Math.max(0.08, 1 - progress * 0.84);
  ctx.translate(directed ? (effect.x + targetX) / 2 : effect.x, directed ? (effect.y + targetY) / 2 : effect.y);
  if (directed) {
    const sourceAxisOffset = effect.type === "alchemy-excalibur" ? Math.PI / 4 : 0;
    ctx.rotate(Math.atan2(targetY - effect.y, targetX - effect.x) - sourceAxisOffset);
  }
  drawAnimatedTextureBottom(
    sprite,
    0,
    renderHeight / 2,
    directed ? Math.max(size, Math.hypot(targetX - effect.x, targetY - effect.y)) : size,
    renderHeight,
    { mode: directed ? "beam" : semanticEffectMotion(effect.type, effect.variant), progress, intensity: 0.94, baseAlpha: 0.16 }
  );
  if (effect.type === "quantum-transmutation") {
    const goldImage = state.textures?.itemTextures?.gold;
    const goldPrepared = goldImage ? transparentSpriteSource(goldImage, "item-gold", 12) : null;
    const goldSprite = goldPrepared ? normalizedSpriteFrame(goldPrepared, "item-gold", 1, 1, 0, 0) : null;
    if (goldSprite) {
      drawGoldTransmutationStages(goldSprite, progress);
    }
  }
  ctx.restore();
  return true;
}

function drawTransferGeneratedEffect(effect, progress, sprite, defaultSize) {
  const outgoing = effect.type === "transfer-out";
  const targetX = Number.isFinite(effect.targetX) ? effect.targetX : effect.x;
  const targetY = Number.isFinite(effect.targetY) ? effect.targetY : effect.y;
  const eased = outgoing ? 1 - Math.pow(1 - progress, 3) : progress;
  const x = outgoing ? effect.x + (targetX - effect.x) * eased : effect.x;
  const y = outgoing ? effect.y + (targetY - effect.y) * eased : effect.y;
  const pulse = Math.sin(progress * Math.PI);
  const size = defaultSize * (outgoing ? 0.78 + pulse * 0.34 : 1.15 - progress * 0.25 + pulse * 0.18);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = Math.max(0.12, outgoing ? 1 - progress * 0.55 : 1 - progress * 0.8);
  ctx.translate(x, y);
  if (outgoing && (targetX !== effect.x || targetY !== effect.y)) {
    ctx.rotate(Math.atan2(targetY - effect.y, targetX - effect.x));
  }
  drawAnimatedTextureCentered(sprite, 0, 0, size, size, {
    mode: "teleport",
    progress,
    intensity: 0.92,
    baseAlpha: 0.14
  });
  ctx.restore();
  return true;
}

const TACTICAL_SYSTEM_EFFECT_CELLS = {
  "action-smartphone": 1,
  "action-smartphone-repair": 1,
  "pair-route-violation": 2,
  "action-weak-bullet": 3,
  "action-weak-bullet-load": 3,
  "action-taser": 4,
  "gravity-accelerate": 5,
  "gravity-decelerate": 5,
  "gravity-storm": 6,
  "alchemy-object-recharge": 7,
  "alchemy-human-transmutation": 8,
  "alchemy-excalibur": 8,
  "alchemy-particle-cannon": 8
};

function drawTacticalSystemsEffect(effect, progress) {
  const index = TACTICAL_SYSTEM_EFFECT_CELLS[effect.type];
  if (!Number.isInteger(index)) return false;
  const atlas = transparentSpriteSource(state.textures.tacticalSystemsAtlas, "tactical-systems-atlas", 18);
  const sprite = atlas ? normalizedSpriteFrame(atlas, `tactical-system-${index}`, 3, 3, Math.floor(index / 3), index % 3) : null;
  if (!sprite) return false;
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  const base = Math.max(105, Number(effect.radius) || 120);
  const size = Math.min(index === 6 ? 560 : 390, base * (1.55 + progress * 0.65 + pulse * 0.2));
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = Math.max(0.08, 1 - progress * 0.82);
  ctx.translate(effect.x, effect.y);
  ctx.rotate(index === 5 ? progress * 0.24 : 0);
  drawAnimatedTextureBottom(sprite, 0, size / 2, size, size, {
    mode: semanticEffectMotion(effect.type, effect.variant, index === 6 ? "gravity" : "shimmer"),
    progress,
    intensity: 0.9,
    baseAlpha: 0.15
  });
  ctx.restore();
  return true;
}

function drawFloraGeneratedEffect(effect, progress, sunbeam) {
  const source = sunbeam ? state.textures.floraSunbeamV3 : state.textures.floraHealV1;
  const key = sunbeam ? "flora-sunbeam-v3" : "flora-heal-v1";
  const prepared = transparentSpriteSource(source, key, 18);
  const sprite = prepared ? normalizedSpriteFrame(prepared, key, 1, 1, 0, 0) : null;
  if (!sprite) return false;
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = Math.max(0.08, 1 - progress * 0.78);
  if (sunbeam) {
    const targetX = Number.isFinite(effect.targetX) ? effect.targetX : effect.x + 900;
    const targetY = Number.isFinite(effect.targetY) ? effect.targetY : effect.y;
    const dx = targetX - effect.x;
    const dy = targetY - effect.y;
    const length = Math.max(320, Math.hypot(dx, dy));
    ctx.translate(effect.x, effect.y);
    ctx.rotate(Math.atan2(dy, dx));
    const sourceAnchor = 0.16;
    const targetAnchor = 0.87;
    const renderWidth = length / (targetAnchor - sourceAnchor);
    const renderCenterX = (0.5 - sourceAnchor) * renderWidth;
    drawAnimatedTextureCentered(sprite, renderCenterX, 0, renderWidth, 390 + pulse * 55, {
      mode: "beam",
      progress,
      intensity: 0.98,
      baseAlpha: 0.14
    });
  } else {
    const size = Math.max(190, Number(effect.radius || 110) * 1.9) * (0.9 + pulse * 0.12);
    drawAnimatedTextureCentered(sprite, effect.x, effect.y - size * 0.03, size, size, {
      mode: "flow-up",
      progress,
      intensity: 0.96,
      baseAlpha: 0.22
    });
  }
  ctx.restore();
  return true;
}

function drawDirectedEnergyEffect(effect, progress, now) {
  const targetX = Number.isFinite(effect.targetX) ? effect.targetX : effect.x;
  const targetY = Number.isFinite(effect.targetY) ? effect.targetY : effect.y - 600;
  const flora = effect.type === "flora-sunbeam";
  const particle = effect.type.includes("particle");
  const width = flora ? (String(effect.variant || "").includes("converged") ? 15 : 34) : particle ? 42 : 18;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = Math.max(0.08, 1 - progress * 0.82);
  const gradient = ctx.createLinearGradient(effect.x, effect.y, targetX, targetY);
  gradient.addColorStop(0, flora ? "#fef08a" : particle ? "#67e8f9" : "#f8fafc");
  gradient.addColorStop(0.55, flora ? "#facc15" : particle ? "#38bdf8" : "#c4b5fd");
  gradient.addColorStop(1, "rgba(255,255,255,0.05)");
  ctx.strokeStyle = gradient;
  ctx.lineWidth = width * (0.65 + Math.sin(now / 70) * 0.08);
  ctx.beginPath();
  ctx.moveTo(effect.x, effect.y);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = Math.max(2, width * 0.2);
  ctx.stroke();
  ctx.restore();
}

const ACTION_EFFECT_CELLS = {
  "action-task": 0,
  "action-grit": 1,
  "action-stand": 1,
  "action-dodge": 2,
  "action-rest": 3,
  "action-teleport": 4,
  "action-heart-teleport": 4,
  "action-warp": 5,
  "action-drone": 6,
  "action-ninjutsu-focus": 7,
  "action-shoot": 7,
  "action-reason": 7,
  "action-push": 7,
  "action-sabotage": 8,
  "action-repair": 9,
  "action-vent": 10,
  "action-vending": 11,
  "action-renki": 11,
  "action-mana": 11,
  "action-alchemy": 11,
  "action-rational-free": 11,
  "action-jump": 5,
  "fighter-slash": 7,
  "fighter-slash-parry": 7,
  "fighter-iaido": 7
};

const GUNNER_WEAPON_CELLS = { handgun: 0, smg: 1, assault: 2, sniper: 3, taser: 4 };

function drawGunnerActionEffect(effect, progress) {
  const index = GUNNER_WEAPON_CELLS[effect.variant] ?? 0;
  const stateEffect = ["action-shoot", "action-weapon-switch", "action-sustained-fire", "action-sniper-scope", "action-reload"].includes(effect.type);
  if (!stateEffect) return false;
  const row = effect.type === "action-weapon-switch" ? 0 : 1;
  const sourceIndex = row * 5 + index;
  const sprite = transparentSpriteSource(
    state.textures.gunnerCombatStateEffects?.[sourceIndex],
    `gunner-combat-state-${sourceIndex}`,
    24
  );
  if (!sprite) return false;
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  ctx.save();
  const firingEffect = ["action-shoot", "action-sustained-fire", "action-sniper-scope"].includes(effect.type);
  ctx.globalCompositeOperation = firingEffect ? "lighter" : "source-over";
  ctx.globalAlpha = Math.max(0.06, 1 - progress * 0.88);
  if (effect.type === "action-shoot" && Number.isFinite(effect.targetX) && Number.isFinite(effect.targetY)) {
    const dx = effect.targetX - effect.x;
    const dy = effect.targetY - effect.y;
    const length = Math.max(48, Math.hypot(dx, dy));
    ctx.translate(effect.x + dx / 2, effect.y + dy / 2);
    ctx.rotate(Math.atan2(dy, dx));
    drawAnimatedTextureCentered(sprite, 0, 0, Math.min(1320, length + 96), 88 + pulse * 20, {
      mode: semanticEffectMotion(effect.type, effect.variant, "beam"), progress, intensity: 0.95, baseAlpha: 0.14
    });
  } else if (effect.type === "action-sustained-fire") {
    const size = 138 + pulse * 36;
    drawAnimatedTextureBottom(sprite, effect.x + 58, effect.y - 26, size * 1.55, size, {
      mode: "recoil", progress, intensity: 0.9, baseAlpha: 0.14
    });
  } else if (effect.type === "action-sniper-scope") {
    const size = 122 + pulse * 30;
    drawAnimatedTextureBottom(sprite, effect.x, effect.y - 38, size, size, {
      mode: "shimmer", progress, intensity: 0.82, baseAlpha: 0.18
    });
  } else {
    const size = 108 + pulse * 28;
    drawAnimatedTextureBottom(sprite, effect.x, effect.y - 34 - progress * 28 + size / 2, size * 1.45, size, {
      mode: "energy", progress, intensity: 0.86, baseAlpha: 0.16
    });
  }
  ctx.restore();
  return true;
}

const PHILOSOPHY_EFFECT_CELLS = {
  "action-renki": 0,
  "action-stand": 4,
  "action-grit": 4,
  "action-push": 5,
  "action-reason": 5,
  "action-alchemy": 0,
  "action-rational-free": 8,
  "idea-truth": 6,
  "idea-beauty": 7,
  "idea-good": 8,
  "idea-ascension": 9,
  "mystery-reveal": 10,
  emp: 11
};

const ALCHEMY_EFFECT_CELLS = {
  "action-renki": 0,
  "action-rational-free": 2,
  "action-alchemy": 3
};

const ALCHEMY_VARIANT_CELLS = {
  credits: 4,
  stamina: 5,
  heal: 6,
  fire: 7,
  substitution: 8,
  warp: 9,
  grit: 10,
  reason: 11
};

function drawPhilosophyAtlasEffect(effect, index, progress, rawSize) {
  const sprite = transparentSpriteSource(
    state.textures.philosophyEffectTextures?.[index],
    `philosophy-effect-${index}`,
    28
  );
  if (!sprite) return;
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  const size = rawSize * (0.78 + progress * 0.78 + pulse * 0.22);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = Math.max(0.08, 1 - progress * 0.86);
  ctx.translate(effect.x, effect.y);
  ctx.rotate((index % 2 ? 1 : -1) * progress * 0.24);
  drawAnimatedTextureBottom(sprite, 0, size / 2, size, size, {
    mode: semanticEffectMotion(effect.type, effect.variant),
    progress,
    phase: index * 0.19,
    intensity: 0.9,
    baseAlpha: 0.15
  });
  ctx.restore();
}

function drawFighterDodgeCounterEffect(effect, progress) {
  const sprite = transparentSpriteSource(state.textures.fighterSlashEffect, "fighter-slash-effect", 28);
  if (!sprite) return false;
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  const reach = Math.max(190, Number(effect.radius) * 1.55 || 248) * (0.82 + progress * 0.46 + pulse * 0.12);
  const thickness = reach * 0.34;
  const dx = Number.isFinite(effect.targetX) ? effect.targetX - effect.x : 1;
  const dy = Number.isFinite(effect.targetY) ? effect.targetY - effect.y : 0;
  const angle = Math.atan2(dy, dx);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = Math.max(0.05, 1 - progress * 0.9);
  ctx.translate(effect.x, effect.y);
  ctx.rotate(angle - 0.12 + progress * 0.24);
  // Keep the effect in front of the blade so the character motion stays readable.
  drawAnimatedTextureBottom(sprite, reach * 0.22, thickness * 0.5, reach, thickness, {
    mode: "beam", progress, intensity: 1, baseAlpha: 0.12
  });
  ctx.restore();
  return true;
}

function drawDroneAltitudeEffect(effect, progress) {
  const index = { low: 0, middle: 1, high: 2 }[effect.variant] ?? 0;
  const sprite = transparentSpriteSource(
    state.textures.droneAltitudeEffects?.[index],
    `drone-altitude-effect-${index}`,
    24
  );
  if (!sprite) return false;
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  const size = [150, 205, 275][index] * (0.76 + pulse * 0.32);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = Math.max(0.08, 1 - progress * 0.82);
  drawAnimatedTextureCentered(sprite, effect.x, effect.y, size, size, {
    mode: "flow-up", progress, phase: index * 0.33, intensity: 0.88, baseAlpha: 0.15
  });
  ctx.restore();
  return true;
}

function drawActionEffect(effect, progress, now) {
  if (["action-shoot", "action-weapon-switch", "action-sustained-fire", "action-sniper-scope", "action-reload"].includes(effect.type) && drawGunnerActionEffect(effect, progress)) return;
  if (["action-fighter-dodge-counter", "fighter-slash", "fighter-slash-parry"].includes(effect.type) && drawFighterDodgeCounterEffect(effect, progress)) return;
  if (effect.type === "action-drone-altitude" && drawDroneAltitudeEffect(effect, progress)) return;
  if (effect.type === "action-heart-teleport" && drawEmpInteractionSprite(effect, 2, progress, Math.max(145, Number(effect.radius) || 145))) return;
  const alchemyIndex = effect.type === "action-alchemy"
    ? ALCHEMY_VARIANT_CELLS[effect.variant] ?? ALCHEMY_EFFECT_CELLS[effect.type]
    : ALCHEMY_EFFECT_CELLS[effect.type];
  if (alchemyIndex != null && drawAlchemyEffect(effect, alchemyIndex, progress)) return;
  const index = ACTION_EFFECT_CELLS[effect.type] ?? 11;
  const sprite = transparentSpriteSource(
    state.textures.actionEffectTextures?.[index],
    `action-effect-${index}`,
    28
  );
  const maxRadius = Math.max(80, Number(effect.radius) || 110);
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  const size = maxRadius * (1.15 + progress * 1.25 + pulse * 0.2);

  let philosophyIndex = PHILOSOPHY_EFFECT_CELLS[effect.type];
  if (effect.type === "action-mana") {
    philosophyIndex = effect.variant === "欲望" ? 1 : effect.variant === "理知" ? 3 : 2;
  }
  if (Number.isInteger(philosophyIndex)) {
    drawPhilosophyAtlasEffect(effect, philosophyIndex, progress, maxRadius * 1.85);
    return;
  }

  if (!sprite) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let layer = 0; layer < 2; layer += 1) {
    const layerSize = size * (0.88 + layer * 0.16);
    ctx.save();
    ctx.translate(effect.x, effect.y);
    ctx.rotate((index % 2 ? 1 : -1) * (progress * 0.28 + layer * 0.08));
    ctx.globalAlpha = Math.max(0, 1 - progress * 0.92) * (0.78 - layer * 0.26);
    drawAnimatedTextureCentered(sprite, 0, -progress * (8 + layer * 5), layerSize, layerSize, {
      mode: semanticEffectMotion(effect.type, effect.variant, index === 3 || index === 9 ? "flow-up" : "energy"),
      time: now / 1000,
      progress,
      phase: layer * 0.43,
      intensity: 0.86,
      baseAlpha: 0.14
    });
    ctx.restore();
  }
  ctx.restore();
}

function drawEmpInteractionSprite(effect, index, progress, rawSize) {
  const sources = [
    state.textures.empResonanceEffect,
    state.textures.empCancelEffect,
    state.textures.heartTeleportEffect
  ];
  const keys = ["emp-resonance-v398", "emp-cancel-v311", "heart-teleport-v311"];
  const source = sources[index];
  const sprite = source ? transparentSpriteSource(source, keys[index], 28) : null;
  if (!sprite) return false;
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  const size = rawSize * (1.05 + progress * 0.7 + pulse * 0.18);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = Math.max(0.12, 1 - progress * 0.78);
  drawAnimatedTextureBottom(sprite, effect.x, effect.y + size / 2, size, size, {
    mode: index === 0 ? "resonance" : index === 2 ? "teleport" : "glitch",
    progress,
    phase: index * 0.29,
    intensity: index === 0 ? 1.14 : 0.96,
    baseAlpha: index === 0 ? 0.19 : 0.13
  });
  ctx.restore();
  return true;
}

function drawAlchemyEffect(effect, index, progress) {
  const sprite = transparentSpriteSource(
    state.textures.alchemyEffectTextures?.[index],
    `alchemy-effect-${index}`,
    28
  );
  if (!sprite) return false;
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  const maxRadius = Math.max(90, Number(effect.radius) || 130);
  const size = maxRadius * (1.2 + progress * 1.05 + pulse * 0.24);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = Math.max(0.08, 1 - progress * 0.82);
  ctx.translate(effect.x, effect.y);
  ctx.rotate((index % 2 ? 1 : -1) * progress * 0.18);
  drawAnimatedTextureBottom(sprite, 0, size / 2, size, size, {
    mode: semanticEffectMotion(effect.type, effect.variant, index === 7 ? "combustion" : "energy"),
    progress,
    phase: index * 0.17,
    intensity: 0.9,
    baseAlpha: 0.15
  });
  ctx.restore();
  return true;
}

function drawIdeaEffect(effect, progress, now) {
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  const isAscension = effect.type === "idea-ascension";
  const renderedEffect = isAscension ? { ...effect, y: effect.y - progress * 150 } : effect;
  const rawSize = (isAscension ? 280 : 190) * (0.96 + pulse * 0.08);
  drawPhilosophyAtlasEffect(renderedEffect, PHILOSOPHY_EFFECT_CELLS[effect.type] ?? 9, progress, rawSize);
}

function drawEmpEffect(effect, progress, now) {
  const maxRadius = Math.max(180, Number(effect.radius) || 260);
  const interactionIndex = effect.type === "emp-resonance" ? 0 : effect.type === "emp-cancel" ? 1 : -1;
  if (interactionIndex >= 0) {
    drawEmpInteractionSprite(effect, interactionIndex, progress, maxRadius);
  } else {
    drawPhilosophyAtlasEffect(effect, PHILOSOPHY_EFFECT_CELLS.emp, progress, maxRadius * 0.92);
  }
}

function drawGravityStormImpactEffect(effect, progress) {
  const atlas = transparentSpriteSource(state.textures.tacticalSystemsAtlas, "tactical-systems-atlas", 18);
  const sprite = atlas ? normalizedSpriteFrame(atlas, "gravity-storm-impact", 3, 3, 2, 0) : null;
  if (!sprite) return false;
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  const variantScale = effect.type === "gravity-storm-blast"
    ? 1.26
    : effect.type === "gravity-storm-pull"
      ? 0.96
      : effect.type === "gravity-storm-crush"
        ? 0.82
        : 1.08;
  const size = Math.max(180, Number(effect.radius) * 1.8 || 240) * variantScale * (0.82 + pulse * 0.28);
  ctx.save();
  ctx.translate(effect.x, effect.y);
  ctx.globalCompositeOperation = "lighter";
  for (let layer = 0; layer < 2; layer += 1) {
    const direction = effect.type === "gravity-storm-pull" ? -1 : 1;
    ctx.save();
    ctx.rotate(direction * (progress * 0.32 + layer * 0.11));
    ctx.globalAlpha = Math.max(0.06, 1 - progress * 0.88) * (0.78 - layer * 0.28);
    const layerSize = size * (0.9 + layer * 0.16);
    drawAnimatedTextureCentered(sprite, 0, 0, layerSize, layerSize, {
      mode: "gravity",
      progress,
      phase: layer * 0.47,
      intensity: effect.type === "gravity-storm-crush" ? 1 : 0.92,
      baseAlpha: 0.12
    });
    ctx.restore();
  }
  ctx.restore();
  return true;
}

function drawStatusAndHazardEffect(effect, progress) {
  let source = null;
  if (["status-burning", "hazard-fire"].includes(effect.type)) source = state.textures.hazardFireEffect;
  else if (["status-poison", "hazard-poison"].includes(effect.type)) source = state.textures.hazardPoisonEffect;
  else if (["status-burn-cleared", "hazard-water"].includes(effect.type)) source = state.textures.hazardWaterEffect;
  else if (effect.type === "status-poison-cleared" || effect.type === "hazard-antidote") source = state.textures.itemAntidote;
  if (!source) return false;
  const prepared = transparentSpriteSource(source, `status-effect-${effect.type}`, 18);
  const sprite = prepared ? normalizedSpriteFrame(prepared, `status-effect-${effect.type}`, 1, 1, 0, 0) : null;
  if (!sprite) return false;
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  const baseSize = Math.max(150, Number(effect.radius) * 2 || 210);
  ctx.save();
  ctx.translate(effect.x, effect.y);
  ctx.globalCompositeOperation = effect.type.includes("water") || effect.type.includes("cleared") ? "source-over" : "lighter";
  for (let layer = 0; layer < 2; layer += 1) {
    const size = baseSize * (0.82 + layer * 0.17 + pulse * 0.16);
    ctx.save();
    ctx.rotate((layer ? -1 : 1) * progress * 0.18);
    ctx.globalAlpha = Math.max(0.08, 1 - progress * 0.86) * (0.76 - layer * 0.28);
    drawAnimatedTextureCentered(sprite, 0, -progress * 12, size, size, {
      mode: semanticEffectMotion(effect.type, effect.variant, effect.type.includes("water") || effect.type.includes("cleared") ? "ripple" : "flow-up"),
      progress,
      phase: layer * 0.39,
      intensity: 0.9,
      baseAlpha: 0.14
    });
    ctx.restore();
  }
  ctx.restore();
  return true;
}

function drawObjectActivationEffect(effect, progress, now) {
  const type = effect.type.slice("object-".length);
  ctx.save();
  const footBath = type === "footBath" || effect.effectKind === "footBath";
  if (footBath && state.textures.footBathSparkleEffect?.complete) {
    drawFootBathAmbient(effect, now / 1000 + progress * 0.18, Math.max(0, 1 - progress) * 0.92);
    ctx.restore();
    return;
  }
  if (footBath) {
    const fallback = transparentSpriteSource(state.textures.footBathSparkleEffect, "footbath-static-fallback-v324", 18);
    if (fallback) {
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = Math.max(0, 1 - progress) * 0.68;
      drawAnimatedTextureCentered(fallback, effect.x, effect.y - 16, 250, 208, {
        mode: "shimmer",
        time: now / 1000,
        progress,
        intensity: Math.max(0.18, 1 - progress),
        baseAlpha: 0.2
      });
    }
    ctx.restore();
    return;
  }
  const semanticImage = dedicatedMapObjectEffectTexture(effect.effectKind, type);
  if (semanticImage?.complete && semanticImage.naturalWidth) {
    const prepared = transparentSpriteSource(semanticImage, `map-object-${effect.effectKind || type}`, 14);
    if (prepared) {
      drawSemanticObjectEffect(prepared, effect, progress, now);
      ctx.restore();
      return;
    }
  }
  drawObjectEffectFallback(effect, progress, now);
  ctx.restore();
}

const HEAD_MARKER_LAYOUT = Object.freeze({
  firstRowY: -104,
  rowGap: 29,
  columnGap: 27,
  maxColumns: 4,
  markerSize: 26
});

function headMarkerSlot(index, total, startRow = 0) {
  const safeIndex = Math.max(0, Number(index) || 0);
  const safeTotal = Math.max(1, Number(total) || 1);
  const row = Math.floor(safeIndex / HEAD_MARKER_LAYOUT.maxColumns);
  const rowStart = row * HEAD_MARKER_LAYOUT.maxColumns;
  const rowCount = Math.min(HEAD_MARKER_LAYOUT.maxColumns, safeTotal - rowStart);
  const column = safeIndex - rowStart;
  return {
    x: (column - (rowCount - 1) / 2) * HEAD_MARKER_LAYOUT.columnGap,
    y: HEAD_MARKER_LAYOUT.firstRowY - (startRow + row) * HEAD_MARKER_LAYOUT.rowGap
  };
}

function headMarkerRowCount(count) {
  return Math.ceil(Math.max(0, Number(count) || 0) / HEAD_MARKER_LAYOUT.maxColumns);
}

const GAIN_MARKER_EXPLANATIONS = Object.freeze({
  stamina: ["スタミナ獲得", "スタミナが即座に回復しました。"],
  credits: ["クレジット獲得", "クレジットを獲得しました。"],
  mana: ["マナ獲得", "マナが即座に増加しました。"],
  cooldownReduction: ["待機時間短縮", "能力や行動の待機時間が短縮されました。"],
  statusRecovery: ["状態異常回復", "燃焼・毒・EMP妨害などが解除されました。"],
  acceleration: ["加速獲得", "行動全般を速める加速効果を獲得しました。"],
  luckBoost: ["幸運／直観上昇", "乱数判定とイデア到達時間に有利な補正を得ました。"],
  overheal: ["オーバーヒール", "通常HPを超える追加耐久を獲得しました。"],
  relaxation: ["リラックス", "休息による回復効果を獲得しました。"],
  herbalRecovery: ["植物療法", "植物由来の回復効果を獲得しました。"],
  healthyMeal: ["健康的な食事", "複数の回復効果を獲得しました。"],
  mineralWater: ["ミネラルウォーター", "燃焼解除とスタミナ回復を受けました。"],
  heal: ["HP回復", "受けていたダメージが回復しました。"],
  fullRecovery: ["全回復", "複数の資源と状態が回復しました。"],
  decoy: ["デコイ獲得", "攻撃を逸らすための効果を獲得しました。"]
});

const STATUS_MARKER_EXPLANATIONS = Object.freeze({
  acceleration: ["加速", "移動・行動・モーション・待機時間の進行が加速しています。"],
  levitation: ["浮揚", "床のない場所を移動できます。浮揚中はMPを消費します。"],
  hpReduction: ["HP減少", "現在HPまたはHP上限が低下しています。"],
  resistanceBreak: ["耐性破壊", "踏ん張りや変わり身などの確殺防御が機能しません。"],
  standFirm: ["踏ん張り", "次に受ける確殺を一度だけ防ぎます。"],
  push: ["押し込み", "対象の踏ん張りを無効化します。無効化数に応じ反動を受けます。"],
  burning: ["燃焼", "継続ダメージを受けます。水やフローラ回復で解除できます。"],
  poison: ["毒", "継続ダメージを受けます。解毒剤やフローラ回復で解除できます。"],
  manaGpu: ["マナGPU", "再使用待機中に毎秒0.025MPを消費し、1MPにつき待機時間を20秒短縮します。"]
});

function registerMarkerHitTarget(key, localX, localY, radius, title, detail) {
  if (!key || !title || !detail) return;
  const matrix = ctx.getTransform();
  const x = matrix.a * localX + matrix.c * localY + matrix.e;
  const y = matrix.b * localX + matrix.d * localY + matrix.f;
  const scale = Math.max(0.5, Math.hypot(matrix.a, matrix.b), Math.hypot(matrix.c, matrix.d));
  state.markerHitTargets.push({
    key,
    x,
    y,
    radius: Math.max(15, radius * scale),
    title,
    detail
  });
}

function showMarkerExplanationFromPointer(event) {
  const point = canvasPointerPosition(event);
  if (!point) return false;
  const target = [...state.markerHitTargets]
    .reverse()
    .filter((entry) => Math.hypot(point.x - entry.x, point.y - entry.y) <= entry.radius)
    .sort((a, b) => Math.hypot(point.x - a.x, point.y - a.y) - Math.hypot(point.x - b.x, point.y - b.y))[0];
  if (!target) return false;
  state.markerExplanation = {
    key: target.key,
    title: target.title,
    detail: target.detail,
    x: target.x,
    y: target.y,
    startedAt: performance.now(),
    expiresAt: performance.now() + MARKER_EXPLANATION_DURATION_MS
  };
  return true;
}

function drawMarkerExplanation(width, height) {
  const explanation = state.markerExplanation;
  if (!explanation) return;
  const timestamp = performance.now();
  if (timestamp >= explanation.expiresAt) {
    state.markerExplanation = null;
    return;
  }
  const liveTarget = state.markerHitTargets.find((entry) => entry.key === explanation.key);
  const anchorX = liveTarget?.x ?? explanation.x;
  const anchorY = liveTarget?.y ?? explanation.y;
  const elapsed = timestamp - explanation.startedAt;
  const remaining = explanation.expiresAt - timestamp;
  const reveal = objectEffectEase(Math.min(1, elapsed / 130));
  const fade = Math.min(1, remaining / 260);
  const alpha = reveal * fade;
  const detailLines = String(explanation.detail).match(/.{1,25}/g)?.slice(0, 2) || [""];
  ctx.font = "600 11px Segoe UI, sans-serif";
  const detailWidth = Math.max(...detailLines.map((line) => ctx.measureText(line).width));
  const bubbleWidth = Math.min(296, Math.max(218, detailWidth + 30));
  const bubbleHeight = detailLines.length > 1 ? 78 : 64;
  const above = anchorY >= bubbleHeight + 38;
  const bubbleX = clamp(anchorX - bubbleWidth / 2, 10, width - bubbleWidth - 10);
  const bubbleY = clamp(above ? anchorY - bubbleHeight - 24 : anchorY + 24, 10, height - bubbleHeight - 10);
  const pointerX = clamp(anchorX, bubbleX + 18, bubbleX + bubbleWidth - 18);
  const pointerY = above ? bubbleY + bubbleHeight : bubbleY;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(anchorX, anchorY);
  ctx.scale(0.92 + reveal * 0.08, 0.92 + reveal * 0.08);
  ctx.translate(-anchorX, -anchorY);
  const background = ctx.createLinearGradient(bubbleX, bubbleY, bubbleX + bubbleWidth, bubbleY + bubbleHeight);
  background.addColorStop(0, "rgba(8,26,40,0.97)");
  background.addColorStop(1, "rgba(20,39,55,0.96)");
  ctx.shadowColor = "rgba(34,211,238,0.42)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = background;
  ctx.strokeStyle = "rgba(125,211,252,0.92)";
  ctx.lineWidth = 2;
  roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 8, true, true);
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo(pointerX - 8, pointerY);
  ctx.lineTo(anchorX, anchorY);
  ctx.lineTo(pointerX + 8, pointerY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "800 14px Segoe UI, sans-serif";
  ctx.fillStyle = "#f8fafc";
  ctx.fillText(explanation.title, bubbleX + 14, bubbleY + 20);
  ctx.font = "600 11px Segoe UI, sans-serif";
  ctx.fillStyle = "#cbd5e1";
  detailLines.forEach((line, index) => ctx.fillText(line, bubbleX + 14, bubbleY + 43 + index * 15));
  ctx.restore();
}

function gainEffectPlayer(effect) {
  const source = (state.data?.players || []).find((player) => player.id === effect.playerId);
  return source ? renderedPlayer(source) : null;
}

function gainMarkerStartRow(player, data) {
  if (!player) return 0;
  const allyRows = data?.phase === "playing" && player.attackerAlly ? 1 : 0;
  const statusCount = Object.entries(PERSISTENT_STATUS_ATE_PROFILES)
    .filter(([category]) => persistentStatusAteState(player, data)[category]).length;
  return allyRows + headMarkerRowCount(statusCount);
}

function drawGainAcquisitionEffect(effect, progress, now, index = 0, total = 1) {
  const texture = dedicatedMapObjectEffectTexture(effect.effectKind);
  if (!texture?.complete || !texture.naturalWidth) return;
  const prepared = transparentSpriteSource(texture, `gain-ate-${effect.effectKind}`, 14);
  if (!prepared) return;
  const player = gainEffectPlayer(effect);
  if (!player || !player.alive || player.ejected || player.inVent) return;
  const marker = headMarkerSlot(index, total, gainMarkerStartRow(player, state.data));
  const profile = OBJECT_EFFECT_PRESENTATIONS[effect.effectKind] || OBJECT_EFFECT_PRESENTATIONS.mana;
  const fade = objectEffectFade(progress);
  const reveal = objectEffectEase(progress / 0.2);
  const bob = Math.sin(now / 170 + index * 1.7) * 0.8;
  const size = HEAD_MARKER_LAYOUT.markerSize * (0.76 + reveal * 0.24);
  ctx.save();
  ctx.translate(player.x + marker.x, player.y - (Number(player.jumpHeight) || 0) + marker.y + bob);
  const explanation = GAIN_MARKER_EXPLANATIONS[effect.effectKind] || ["獲得効果", "即時効果を獲得しました。"];
  registerMarkerHitTarget(`gain:${effect.id || effect.createdAt || effect.effectKind}:${player.id}`, 0, 0, size * 0.62, explanation[0], explanation[1]);
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = fade;
  drawAnimatedTextureCentered(prepared, 0, 0, size, size, {
    mode: profile.motion,
    time: now / 1000,
    phase: index * 0.23,
    intensity: 0.9,
    baseAlpha: 0.16,
    opacityBoost: 3
  });
  drawAteComplementaryVfx(ctx, profile.motion, size, size, now / 1000, progress, fade * 0.42);
  ctx.restore();
}

function objectEffectEase(value) {
  const clamped = clamp(value, 0, 1);
  return 1 - Math.pow(1 - clamped, 3);
}

function objectEffectFade(progress) {
  if (progress <= 0.7) return 1;
  const normalized = clamp((progress - 0.7) / 0.3, 0, 1);
  return 1 - normalized * normalized * (3 - 2 * normalized);
}

function drawObjectTextureLayer(sprite, size, alpha, options = {}) {
  const {
    x = 0,
    y = 0,
    rotation = 0,
    scaleX = 1,
    scaleY = 1,
    composite = "screen",
    mode = "energy",
    time = (state.frameNow || performance.now()) / 1000,
    phase = 0,
    intensity = 1
  } = options;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scaleX, scaleY);
  ctx.globalCompositeOperation = composite;
  ctx.globalAlpha = clamp(alpha, 0, 1);
  applyAteGlowContext(ctx, mode, Math.floor(time * 60) / 60, phase, intensity * 0.72);
  drawNormalizedSpriteCentered(sprite, 0, 0, size, size);
  ctx.restore();
}

function objectAppearanceNoise(seed) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function drawObjectAppearanceGlyph(shape, size, color, rotation) {
  ctx.save();
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.beginPath();
  if (shape === "glint") {
    for (let point = 0; point < 8; point += 1) {
      const angle = point * Math.PI / 4;
      const length = point % 2 === 0 ? size : size * 0.22;
      const x = Math.cos(angle) * length;
      const y = Math.sin(angle) * length;
      if (point === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  } else if (shape === "leaf") {
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size * 0.72, -size * 0.4, size * 0.62, size * 0.62, 0, size);
    ctx.bezierCurveTo(-size * 0.62, size * 0.62, -size * 0.72, -size * 0.4, 0, -size);
    ctx.closePath();
  } else if (shape === "petal") {
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(size * 0.9, -size * 0.05, 0, size);
    ctx.quadraticCurveTo(-size * 0.9, -size * 0.05, 0, -size);
    ctx.closePath();
  } else if (shape === "droplet") {
    ctx.moveTo(0, -size * 1.15);
    ctx.bezierCurveTo(size * 0.72, -size * 0.18, size * 0.66, size * 0.86, 0, size);
    ctx.bezierCurveTo(-size * 0.66, size * 0.86, -size * 0.72, -size * 0.18, 0, -size * 1.15);
    ctx.closePath();
  } else if (shape === "confetti") {
    ctx.rect(-size * 0.72, -size * 0.34, size * 1.44, size * 0.68);
  } else if (shape === "pixel") {
    ctx.rect(-size * 0.5, -size * 0.5, size, size);
  } else {
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.42, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.42, 0);
    ctx.closePath();
  }
  ctx.fill();
  ctx.restore();
}

function drawObjectAppearanceCelebration(effect, progress, time, baseSize) {
  const presentation = OBJECT_EFFECT_APPEARANCE[effect.effectKind];
  if (!presentation || progress >= 0.68) return;
  const sampledTime = Math.floor(time * 60) / 60;
  const reveal = objectEffectEase(progress / 0.12);
  const exit = 1 - objectEffectEase(Math.max(0, progress - 0.4) / 0.28);
  const appearanceAlpha = reveal * exit;
  const count = presentation.choreography === "prism-burst" ? 18 : presentation.choreography === "constellation" ? 15 : 13;
  const effectSeed = [...`${effect.type}:${effect.effectKind}:${Math.round(effect.x)}:${Math.round(effect.y)}`]
    .reduce((sum, character, index) => sum + character.charCodeAt(0) * (index + 3), 0);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.filter = "none";
  for (let index = 0; index < count; index += 1) {
    const seed = effectSeed + index * 17.37;
    const noiseA = objectAppearanceNoise(seed);
    const noiseB = objectAppearanceNoise(seed + 9.71);
    const delay = (index % 5) * 0.018;
    if (progress < delay) continue;
    const local = clamp((progress - delay) / Math.max(0.2, 0.62 - delay), 0, 1);
    const life = Math.sin(local * Math.PI);
    const angle = noiseA * Math.PI * 2;
    let x = 0;
    let y = 0;
    let rotation = angle + sampledTime * (0.7 + noiseB * 1.1);

    if (presentation.choreography === "updraft" || presentation.choreography === "cleanse") {
      x = (noiseA - 0.5) * baseSize * 0.66 + Math.sin(sampledTime * 3 + seed) * baseSize * 0.035;
      y = baseSize * 0.35 - local * baseSize * (0.58 + noiseB * 0.18);
      rotation *= 0.45;
    } else if (presentation.choreography === "fountain") {
      const horizontal = (noiseA - 0.5) * baseSize * 0.92;
      x = horizontal * local;
      y = baseSize * 0.16 - local * baseSize * (0.64 + noiseB * 0.18) + local * local * baseSize * 0.32;
      rotation += local * 4.2;
    } else if (presentation.choreography === "spiral" || presentation.choreography === "rewind") {
      const direction = presentation.choreography === "rewind" ? -1 : 1;
      const spiralAngle = angle + direction * local * Math.PI * (2.3 + noiseB);
      const radius = baseSize * (0.12 + local * (0.3 + noiseB * 0.08));
      x = Math.cos(spiralAngle) * radius;
      y = Math.sin(spiralAngle) * radius * 0.72 - local * baseSize * 0.08;
      rotation = spiralAngle + Math.PI / 4;
    } else if (presentation.choreography === "backdraft") {
      x = baseSize * (0.42 - local * (0.78 + noiseA * 0.18));
      y = (noiseB - 0.5) * baseSize * 0.58 + Math.sin(local * Math.PI) * (noiseA - 0.5) * 12;
      rotation = -Math.PI / 2 + (noiseA - 0.5) * 0.45;
    } else if (presentation.choreography === "constellation") {
      x = (noiseA - 0.5) * baseSize * 0.76;
      y = (noiseB - 0.5) * baseSize * 0.68;
      rotation = sampledTime * (0.5 + noiseA) + angle;
    } else if (presentation.choreography === "guard") {
      x = Math.cos(angle) * baseSize * (0.34 + local * 0.08);
      y = Math.sin(angle) * baseSize * (0.28 + local * 0.06);
      rotation = angle + Math.PI / 4;
    } else if (presentation.choreography === "drift" || presentation.choreography === "bloom") {
      const spread = presentation.choreography === "bloom" ? 0.54 : 0.38;
      x = (noiseA - 0.5) * baseSize * spread + Math.sin(sampledTime * 1.8 + seed) * baseSize * 0.06;
      y = baseSize * 0.25 - local * baseSize * (0.34 + noiseB * 0.22);
      rotation += Math.sin(sampledTime * 2.2 + seed) * 0.65;
    } else if (presentation.choreography === "splash") {
      x = Math.cos(angle) * local * baseSize * (0.28 + noiseB * 0.22);
      y = Math.sin(angle) * local * baseSize * 0.3 - local * baseSize * 0.2 + local * local * baseSize * 0.22;
      rotation = Math.atan2(y, x || 0.001);
    } else if (presentation.choreography === "pixel-scatter") {
      x = Math.round(((noiseA - 0.5) * baseSize * (0.32 + local * 0.32)) / 5) * 5;
      y = Math.round(((noiseB - 0.5) * baseSize * (0.28 + local * 0.3)) / 5) * 5;
      rotation = index % 2 ? 0 : Math.PI / 4;
    } else {
      x = Math.cos(angle) * local * baseSize * (0.28 + noiseA * 0.2);
      y = Math.sin(angle) * local * baseSize * (0.24 + noiseB * 0.18);
      rotation = angle + Math.PI / 4;
    }

    const color = presentation.palette[index % presentation.palette.length];
    const size = baseSize * (0.025 + noiseB * 0.028) * (0.78 + life * 0.42);
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = clamp(appearanceAlpha * (0.34 + life * 0.66), 0, 0.9);
    ctx.shadowColor = color;
    ctx.shadowBlur = 7 + size * 1.4;
    drawObjectAppearanceGlyph(presentation.shape, size, color, rotation);
    ctx.restore();
  }
  ctx.restore();
}

function drawSemanticObjectEffect(sprite, effect, progress, now) {
  const profile = OBJECT_EFFECT_PRESENTATIONS[effect.effectKind] || Object.freeze({ motion: "pulse", color: "#67e8f9", accent: "#f8fafc", size: 116 });
  const time = now / 1000;
  const reveal = objectEffectEase(progress / 0.28);
  const fade = objectEffectFade(progress);
  const pulse = Math.sin(progress * Math.PI);
  const baseSize = profile.size * (0.7 + reveal * 0.3);
  const drawLayer = (size, alpha, options = {}) => drawObjectTextureLayer(sprite, size, alpha, {
    mode: profile.motion,
    time,
    phase: progress,
    intensity: fade,
    ...options
  });
  ctx.save();
  ctx.translate(effect.x, effect.y);

  if (profile.motion === "dash") {
    const travel = -20 + reveal * 20;
    drawLayer(baseSize, fade * 0.16, { x: travel - 24, scaleX: 1.12, scaleY: 0.84 });
    drawLayer(baseSize, fade * 0.28, { x: travel - 12, scaleX: 1.06, scaleY: 0.9 });
    drawLayer(baseSize, fade * 0.82, { x: travel, scaleX: 1.02, scaleY: 0.96 });
  } else if (profile.motion === "orbit" || profile.motion === "constellation") {
    const rotation = progress * (profile.motion === "orbit" ? 0.62 : 0.22);
    drawLayer(baseSize * 1.08, fade * 0.22, { rotation: -rotation * 0.58 });
    drawLayer(baseSize, fade * 0.84, { rotation });
  } else if (profile.motion === "rewind") {
    drawLayer(baseSize * 1.08, fade * 0.24, { rotation: progress * 0.58 });
    drawLayer(baseSize, fade * 0.84, { rotation: -progress * 1.18 });
  } else if (profile.motion === "cleanse" || profile.motion === "heal" || profile.motion === "bloom" || profile.motion === "charge") {
    const rise = (1 - reveal) * 18 - progress * 9;
    drawLayer(baseSize * 1.1, fade * 0.2, { y: rise + 7, scaleX: 1.04, scaleY: 0.92 });
    drawLayer(baseSize, fade * 0.84, { y: rise, scaleX: 0.96 + pulse * 0.04, scaleY: 0.94 + reveal * 0.06 });
  } else if (profile.motion === "shield") {
    const breathe = 1 + Math.sin(time * 3.4) * 0.025;
    drawLayer(baseSize * (1.12 + pulse * 0.05), fade * 0.22, { scaleX: breathe, scaleY: breathe });
    drawLayer(baseSize, fade * 0.82, { scaleX: breathe, scaleY: breathe });
  } else if (profile.motion === "breathe") {
    const breathe = 0.96 + Math.sin(time * 2.2) * 0.045;
    drawLayer(baseSize * 1.08, fade * 0.2, { y: Math.sin(time * 1.8) * 2.5 + 5, scaleX: breathe * 1.04, scaleY: breathe * 0.9 });
    drawLayer(baseSize, fade * 0.82, { y: Math.sin(time * 1.8) * 2.5, scaleX: breathe, scaleY: breathe });
  } else if (profile.motion === "ripple" || profile.motion === "pulse") {
    const flatten = profile.motion === "ripple" ? 0.7 : 1;
    drawLayer(baseSize * (1.1 + progress * 0.16), fade * 0.18, { scaleY: flatten });
    drawLayer(baseSize, fade * 0.82, { scaleX: 0.96 + pulse * 0.05, scaleY: (0.96 + pulse * 0.05) * flatten });
  } else if (profile.motion === "burst") {
    drawLayer(baseSize * (1.02 + pulse * 0.24), fade * 0.24, { rotation: -progress * 0.14 });
    drawLayer(baseSize * (0.76 + reveal * 0.24), fade * 0.76, { rotation: progress * 0.18 });
  } else if (profile.motion === "signal") {
    drawLayer(baseSize * (1.08 + pulse * 0.05), fade * 0.2, { rotation: -Math.sin(time * 2.6) * 0.03 });
    drawLayer(baseSize, fade * 0.8, { rotation: Math.sin(time * 2.6) * 0.05 });
  } else {
    drawLayer(baseSize, fade * 0.82);
  }
  drawAteComplementaryVfx(ctx, profile.motion, baseSize, baseSize, time, progress, fade * 0.72);
  drawObjectAppearanceCelebration(effect, progress, time, baseSize);
  ctx.restore();
}

function drawObjectEffectFallback() {
  return false;
}

function drawRainbowSpark(x, y, radius, hue, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = `hsl(${(hue + 35) % 360} 100% 78%)`;
  ctx.beginPath();
  for (let point = 0; point < 8; point += 1) {
    const angle = point * Math.PI / 4;
    const length = point % 2 === 0 ? radius : radius * 0.22;
    const px = Math.cos(angle) * length;
    const py = Math.sin(angle) * length;
    if (point === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPlayers(data) {
  const selectedCamera = currentCamera(data);
  const ordered = [...data.players]
    .map((player) => renderedPlayer(player))
    .filter((player) => (!selectedCamera || dist(player, selectedCamera) <= selectedCamera.range) && worldPointVisible(player.x, player.y, 240))
    .sort((a, b) => Number(a.alive) - Number(b.alive));
  ordered.forEach((player) => {
    if (player.inVent) return;
    drawHuman(player, data);
  });
}

function drawDrones(data) {
  const selectedCamera = currentCamera(data);
  const facilityProps = preparedAtlasTexture(state.textures.facilityProps, "facility-props");
  (data.drones || []).forEach((drone) => {
    const position = drone.ownerId === data.selfId && state.renderDrone ? { ...drone, ...state.renderDrone } : drone;
    if (selectedCamera && dist(position, selectedCamera) > selectedCamera.range) return;
    if (!worldPointVisible(position.x, position.y, 180)) return;
    const altitude = Math.max(0, Math.min(2, Number(drone.altitude) || 0));
    const altitudeScale = [1, 0.84, 0.68][altitude];
    ctx.save();
    ctx.globalAlpha = [0.34, 0.22, 0.12][altitude];
    ctx.fillStyle = "#07131b";
    ctx.beginPath();
    ctx.ellipse(position.x + altitude * 12, position.y + 19 + altitude * 12, 27 * altitudeScale, 11 * altitudeScale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    const altitudeSprite = transparentSpriteSource(
      state.textures.droneAltitudeEffects?.[altitude],
      `drone-altitude-${altitude}`,
      24
    );
    if (altitudeSprite) {
      const size = [124, 168, 220][altitude];
      ctx.save();
      ctx.globalAlpha = 0.96;
      ctx.drawImage(altitudeSprite, position.x - size / 2, position.y - size / 2, size, size);
      ctx.restore();
      return;
    }
    if (drawGeneratedPropCell(facilityProps, 4, position.x, position.y, 76 * altitudeScale, 62 * altitudeScale, 1)) return;
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(altitudeScale, altitudeScale);
    ctx.strokeStyle = "#083344";
    ctx.fillStyle = "#67e8f9";
    ctx.lineWidth = 3;
    ctx.fillRect(-13, -7, 26, 14);
    ctx.strokeRect(-13, -7, 26, 14);
    ctx.beginPath();
    ctx.moveTo(-13, -5); ctx.lineTo(-27, -14);
    ctx.moveTo(13, -5); ctx.lineTo(27, -14);
    ctx.moveTo(-13, 5); ctx.lineTo(-27, 14);
    ctx.moveTo(13, 5); ctx.lineTo(27, 14);
    ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    [[-28,-15],[28,-15],[-28,15],[28,15]].forEach(([x,y]) => { ctx.beginPath(); ctx.arc(x,y,6,0,Math.PI*2); ctx.fill(); ctx.stroke(); });
    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  });
}

function drawAttackTargets(data) {
  if (!data.self.aimTargetId) return;
  const self = selfPlayer();
  data.players
    .filter((player) => player.id !== data.selfId && canSelectCombatTarget(data.self, player) && player.alive && !player.inVent && self && dist(self, player) <= data.settings.killRange)
    .map(renderedPlayer)
    .forEach((player) => {
      const selected = player.id === data.self.aimTargetId;
      if (!selected) return;
      ctx.save();
      ctx.strokeStyle = selected ? "#22d3ee" : "#ef4444";
      ctx.lineWidth = selected ? 5 : 3;
      ctx.strokeRect(player.x - 38, player.y - 70, 76, 104);
      if (selected) {
        ctx.beginPath();
        ctx.arc(player.x, player.y - 18, 48, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    });
}

function drawLuminousFeathers(player) {
  if (!player.luminousActive || !player.alive || player.ejected) return;
  const time = (state.frameNow || performance.now()) / 1000;
  const source = state.textures.luminousMeetingEffect;
  const sprite = source ? transparentSpriteSource(source, "luminous-field-effect-v311", 22) : null;
  if (!sprite) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let layer = 0; layer < 2; layer += 1) {
    ctx.save();
    ctx.translate(0, -42);
    ctx.globalAlpha = 0.76 - layer * 0.28;
    const size = 150 * (0.92 + layer * 0.14);
    drawAnimatedTextureCentered(sprite, 0, 0, size, size, {
      mode: "flow-up",
      time,
      phase: layer * 0.55,
      intensity: 0.88,
      baseAlpha: 0.13
    });
    ctx.restore();
  }
  ctx.restore();
}

function drawPersistentIdeaState(player, data, ascensionProgress) {
  const selfState = player.id === data.selfId ? data.self : player;
  const goodActive = Boolean(selfState.goodActive);
  const effectIndex = ascensionProgress > 0
    ? 9
    : goodActive
      ? 8
      : selfState.ideaStage > 0
        ? selfState.ideaFirstAspect === "beauty" ? 7 : 6
        : -1;
  if (effectIndex < 0) return;
  const source = state.textures.philosophyEffectTextures?.[effectIndex];
  const sprite = source ? transparentSpriteSource(source, `persistent-idea-${effectIndex}`, 24) : null;
  if (!sprite) return;
  const time = (state.frameNow || performance.now()) / 1000;
  const size = ascensionProgress > 0 ? 154 + ascensionProgress * 92 : goodActive ? 116 : 86;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let layer = 0; layer < 2; layer += 1) {
    ctx.save();
    ctx.translate(0, -28 - ascensionProgress * 38);
    ctx.globalAlpha = (ascensionProgress > 0 ? 0.84 : 0.46) - layer * 0.18;
    const layerSize = size * (0.9 + layer * 0.16);
    drawAnimatedTextureCentered(sprite, 0, 0, layerSize, layerSize, {
      mode: effectIndex === 9 ? "flow-up" : "energy",
      time,
      phase: layer * 0.49,
      intensity: ascensionProgress > 0 ? 1 : 0.82,
      baseAlpha: 0.14
    });
    ctx.restore();
  }
  ctx.restore();
}

function physicalMotionRateFor(player) {
  const self = player?.id === state.data?.selfId ? state.data?.self : null;
  return clamp(Number(self?.accelerationMultiplier ?? player?.accelerationMultiplier) || 1, 0.15, 12);
}

function loopedPhysicalMotionProgress(player, kind, cycleMs) {
  const timestamp = state.frameNow || performance.now();
  const key = `${player.id}:${kind}`;
  const phase = state.physicalMotionPhases.get(key) || { progress: 0, lastAt: timestamp };
  const elapsed = clamp(timestamp - phase.lastAt, 0, 50);
  phase.progress = (phase.progress + elapsed * physicalMotionRateFor(player) / Math.max(1, cycleMs)) % 1;
  phase.lastAt = timestamp;
  state.physicalMotionPhases.set(key, phase);
  return phase.progress;
}

function currentCharacterAction(player) {
  const timestamp = state.frameNow || performance.now();
  const jumpMotion = player.jumpMotion;
  if (jumpMotion && Number(jumpMotion.endsAt) > estimatedServerNow(state.data)) {
    const duration = Math.max(1, Number(jumpMotion.endsAt) - Number(jumpMotion.startedAt));
    const progress = clamp((estimatedServerNow(state.data) - Number(jumpMotion.startedAt)) / duration, 0, 1);
    return { kind: "jump", progress };
  }
  if (player.movementMode === "jump-prepare") return { kind: "jump", progress: 0 };
  if (player.movementMode === "sleep") return { kind: "rest", progress: loopedPhysicalMotionProgress(player, "rest", 1600) };
  if (player.movementMode === "meditating") return { kind: "focus", progress: loopedPhysicalMotionProgress(player, "focus", 1800) };
  if (player.gunFiring || (player.id === state.data?.selfId && state.gunTriggerHeld)) {
    const cycle = loopedPhysicalMotionProgress(player, "shoot", 360);
    return { kind: "shoot", progress: cycle <= 0.5 ? cycle * 2 : (1 - cycle) * 2 };
  }
  const action = state.characterActions.get(player.id);
  if (!action) return null;
  const lastSampleAt = Number(action.lastSampleAt) || Number(action.startedAt) || timestamp;
  const elapsed = clamp(timestamp - lastSampleAt, 0, 100);
  const progress = (Number(action.sampledProgress) || 0) +
    elapsed * physicalMotionRateFor(player) / Math.max(1, action.duration);
  action.lastSampleAt = timestamp;
  action.sampledProgress = progress;
  if (progress >= 1) {
    state.characterActions.delete(player.id);
    return null;
  }
  return { ...action, progress: clamp(progress, 0, 1) };
}

function drawHuman(player, data) {
  const ghost = !player.alive && !player.ejected;
  const self = player.id === data.selfId;
  const liveNow = estimatedServerNow(data);
  const ascensionStartedAt = Number(player.ascensionStartedAt) || 0;
  const ascensionUntil = Number(player.ascensionUntil) || 0;
  const ascensionProgress = ascensionUntil > liveNow
    ? clamp((liveNow - ascensionStartedAt) / Math.max(1, ascensionUntil - ascensionStartedAt), 0, 1)
    : 0;
  const ascensionRise = ascensionProgress * ascensionProgress * 155;
  ctx.save();
  ctx.translate(player.x, player.y - ascensionRise - (Number(player.jumpHeight) || 0));
  const characterAction = currentCharacterAction(player);
  if (ghost) ctx.globalAlpha = 0.45;
  if (player.ejected) ctx.globalAlpha = 0.22;

  if (self) {
    if (data.self.dodgeActiveUntil > estimatedServerNow(data)) {
      ctx.strokeStyle = "#a7f3d0";
      ctx.lineWidth = 4;
      ctx.setLineDash([5, 7]);
      ctx.lineDashOffset = state.frameNow / 14;
      ctx.beginPath();
      ctx.arc(0, 0, 35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  drawPersistentIdeaState(player, data, ascensionProgress);
  drawHackerRootState(player);
  if (drawPlayerSprite(player, data, ghost, characterAction)) {
    drawPreparationBarrierAte(player);
    drawLuminousFeathers(player);
    drawAttackerAllyMarker(player);
    drawPersistentStatusAteLayers(player, data);
    ctx.restore();
    return;
  }

  const skin = state.textures.skin;
  ctx.fillStyle = player.color;
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 2;
  roundRect(-15, -2, 30, 29, 9, true, true);

  ctx.fillStyle = darken(player.color, 0.65);
  roundRect(-16, 19, 12, 18, 5, true, false);
  roundRect(4, 19, 12, 18, 5, true, false);

  ctx.fillStyle = skin;
  ctx.strokeStyle = "#0f172a";
  ctx.beginPath();
  ctx.arc(0, -19, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#2f1d15";
  ctx.beginPath();
  ctx.arc(0, -25, 17, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-14, -25, 28, 7);

  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.arc(-6, -18, 2.4, 0, Math.PI * 2);
  ctx.arc(6, -18, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#7f1d1d";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, -12, 4, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.font = "800 10px Segoe UI, sans-serif";
  const identityLabel = playerIdentityLabel(player).slice(0, 14);
  const nameplateWidth = Math.min(92, Math.max(44, ctx.measureText(identityLabel).width + 12));
  ctx.fillStyle = "#e2e8f0";
  ctx.globalAlpha *= 0.95;
  roundRect(-nameplateWidth / 2, -39, nameplateWidth, 13, 6, true, false);
  ctx.globalAlpha = ghost ? 0.45 : player.ejected ? 0.22 : 1;
  ctx.fillStyle = "#0f172a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(identityLabel, 0, -32);
  drawPreparationBarrierAte(player);
  drawLuminousFeathers(player);
  drawAttackerAllyMarker(player);
  drawPersistentStatusAteLayers(player, data);
  ctx.restore();

}

function drawPreparationBarrierAte(player) {
  if (!player.preparationBarrierActive || !player.alive || player.ejected) return;
  const prepared = transparentSpriteSource(state.textures.preparationBarrierEffect, "preparation-barrier-ate-v392", 12);
  const sprite = prepared ? normalizedSpriteFrame(prepared, "preparation-barrier-ate-v392", 1, 1, 0, 0) : null;
  if (!sprite) return;
  const time = Math.floor(((state.frameNow || performance.now()) / 1000) * 60) / 60;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha *= 0.9;
  drawAnimatedTextureCentered(sprite, 0, -8, 116, 132, {
    mode: "shield",
    time,
    phase: (player.id?.length || 0) * 0.17,
    intensity: 0.9,
    baseAlpha: 0.14,
    opacityBoost: 3
  });
  ctx.restore();
}

function drawHackerRootState(player) {
  if (!player.hackerRootActive || !player.alive || player.ejected) return;
  const prepared = transparentSpriteSource(state.textures.hackerRootRainbow, "hacker-root-rainbow", 18);
  const sprite = prepared ? normalizedSpriteFrame(prepared, "hacker-root-rainbow", 1, 1, 0, 0) : null;
  if (!sprite) return;
  const time = (state.frameNow || performance.now()) / 1000;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha *= 0.72 + Math.sin(time * 5.2) * 0.06;
  ctx.translate(0, 5);
  drawAnimatedTextureCentered(sprite, 0, -8, 170, 170, {
    mode: "energy",
    time,
    intensity: 0.92,
    baseAlpha: 0.13
  });
  ctx.restore();
}

function drawAttackerAllyMarker(player) {
  if (state.data?.phase !== "playing" || !player.attackerAlly || !player.alive || player.ejected) return;
  const prepared = transparentSpriteSource(state.textures.attackerAllyMarker, "attacker-ally-marker", 18);
  const sprite = prepared ? normalizedSpriteFrame(prepared, "attacker-ally-marker", 1, 1, 0, 0) : null;
  if (!sprite) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha *= 0.88;
  registerMarkerHitTarget(
    `ally:${player.id}`,
    0,
    HEAD_MARKER_LAYOUT.firstRowY,
    18,
    "アタッカー味方",
    "自分と同じアタッカー陣営のプレイヤーです。"
  );
  drawAnimatedTextureCentered(sprite, 0, HEAD_MARKER_LAYOUT.firstRowY, 28, 28, {
    mode: "energy",
    time: (state.frameNow || performance.now()) / 1000,
    intensity: 0.82,
    baseAlpha: 0.14,
    opacityBoost: 2.8
  });
  ctx.restore();
}

const PERSISTENT_STATUS_ATE_PROFILES = Object.freeze({
  acceleration: Object.freeze({ texture: "accelerationPhaseEffect", mode: "flow-up", size: 32, alpha: 0.94, phase: 0.08 }),
  levitation: Object.freeze({ texture: "statusLevitationEffect", mode: "ripple", size: 30, alpha: 0.88, phase: 0.27 }),
  hpReduction: Object.freeze({ texture: "statusHpReductionEffect", mode: "data-down", size: 30, alpha: 0.88, phase: 0.46 }),
  resistanceBreak: Object.freeze({ texture: "pushStandFirmBreak", mode: "glitch", size: 30, alpha: 0.84, phase: 0.63 }),
  standFirm: Object.freeze({ texture: "standFirmMarkerEffect", mode: "shield", size: 28, alpha: 0.94, phase: 0.18 }),
  push: Object.freeze({ texture: "pushMarkerEffect", mode: "shimmer", size: 28, alpha: 0.94, phase: 0.72 }),
  burning: Object.freeze({ texture: "hazardFireEffect", mode: "combustion", size: 30, alpha: 0.88, phase: 0.81 }),
  poison: Object.freeze({ texture: "hazardPoisonEffect", mode: "orbit", size: 30, alpha: 0.86, phase: 0.94 }),
  manaGpu: Object.freeze({ texture: "statusManaGpuEffect", mode: "data-accelerate", size: 30, alpha: 0.94, phase: 0.57 })
});

function persistentStatusAteState(player, data) {
  const selfState = player.id === data.selfId ? data.self?.statusAte : null;
  const visibleState = player.statusAte || selfState || {};
  return player.id === data.selfId && data.self?.manaGpuActive
    ? { ...visibleState, manaGpu: true }
    : visibleState;
}

function drawPersistentStatusAteLayers(player, data) {
  if (!player.alive || player.ejected) return;
  const activeState = persistentStatusAteState(player, data);
  const time = Math.floor(((state.frameNow || performance.now()) / 1000) * 60) / 60;
  const activeProfiles = Object.entries(PERSISTENT_STATUS_ATE_PROFILES)
    .filter(([category]) => activeState[category]);
  const startRow = data.phase === "playing" && player.attackerAlly ? 1 : 0;
  for (let index = 0; index < activeProfiles.length; index += 1) {
    const [category, profile] = activeProfiles[index];
    const source = state.textures[profile.texture];
    const prepared = transparentSpriteSource(source, `persistent-status-${category}`, 18);
    const sprite = prepared ? normalizedSpriteFrame(prepared, `persistent-status-${category}`, 1, 1, 0, 0) : null;
    if (!sprite) continue;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha *= profile.alpha;
    const marker = headMarkerSlot(index, activeProfiles.length, startRow);
    const markerX = marker.x;
    const markerY = marker.y + Math.sin(time * 2.4 + profile.phase * Math.PI * 2) * 1.1;
    const explanation = STATUS_MARKER_EXPLANATIONS[category] || ["適用中の効果", "この効果が現在適用されています。"];
    registerMarkerHitTarget(`status:${player.id}:${category}`, markerX, markerY, profile.size * 0.62, explanation[0], explanation[1]);
    drawAnimatedTextureCentered(sprite, markerX, markerY, profile.size, profile.size, {
      mode: profile.mode,
      time,
      phase: profile.phase,
      intensity: 0.9,
      baseAlpha: 0.15,
      opacityBoost: 3.2
    });
    ctx.restore();
  }
}

function drawPlayerSprite(player, data, ghost, characterAction = null) {
  if (characterAction && drawPhysicalActionSprite(player, data, ghost, characterAction)) return true;
  if (player.isBot && drawBotWalkSprite(player, data, ghost)) return true;
  if (!player.isBot && drawPetSprite(player, data, ghost)) return true;
  if (!player.isBot && drawOperatorWalkSprite(player, data, ghost)) return true;
  return drawOperatorSprite(player, data, ghost);
}

function drawBotWalkSprite(player, data, ghost) {
  return drawOperatorWalkSprite(player, data, ghost);
}

function physicalActionFramePosition(kind, progress) {
  const value = clamp(progress, 0, 1);
  if (kind === "attack" || kind === "slash") {
    if (value < 0.34) return objectEffectEase(value / 0.34) * 0.62;
    if (value < 0.58) return 0.62 + objectEffectEase((value - 0.34) / 0.24) * 1.38;
    return 2;
  }
  if (kind === "throw") {
    if (value < 0.4) return objectEffectEase(value / 0.4) * 0.82;
    if (value < 0.62) return 0.82 + objectEffectEase((value - 0.4) / 0.22) * 1.18;
    return 2;
  }
  if (kind === "shoot") return Math.min(2, objectEffectEase(value / 0.42) * 2);
  if (kind === "evade") return Math.sin(value * Math.PI) * 2;
  if (kind === "cast" || kind === "heal" || kind === "power") {
    const smooth = value * value * (3 - 2 * value);
    return smooth * 2;
  }
  if (kind === "jump") return Math.min(2, objectEffectEase(value / 0.64) * 2);
  if (kind === "reload") return (0.5 - Math.cos(value * Math.PI) * 0.5) * 2;
  if (kind === "focus" || kind === "rest") return Math.min(2, value * 1.72 + Math.sin(value * Math.PI) * 0.28);
  return objectEffectEase(value) * 2;
}

function applyPhysicalActionTransform(kind, progress, flip) {
  const impulse = Math.sin(clamp(progress, 0, 1) * Math.PI);
  const facing = flip ? -1 : 1;
  if (kind === "attack") {
    ctx.translate(facing * impulse * 7, -impulse * 1.4);
    ctx.rotate(facing * impulse * 0.035);
  } else if (kind === "throw") {
    const windup = objectEffectEase(clamp(progress / 0.4, 0, 1));
    const release = objectEffectEase(clamp((progress - 0.36) / 0.3, 0, 1));
    const followThrough = Math.sin(clamp((progress - 0.52) / 0.48, 0, 1) * Math.PI);
    ctx.translate(facing * (-windup * 5 + release * 12), -release * 3.5 + followThrough * 1.5);
    ctx.rotate(facing * (-windup * 0.045 + release * 0.09 - followThrough * 0.025));
    ctx.scale(1 - followThrough * 0.018, 1 + followThrough * 0.028);
  } else if (kind === "slash") {
    const strike = Math.sin(clamp((progress - 0.2) / 0.55, 0, 1) * Math.PI);
    ctx.translate(facing * strike * 10, -strike * 2.5);
    ctx.rotate(facing * strike * 0.065);
  } else if (kind === "evade") {
    ctx.translate(-facing * impulse * 12, -impulse * 4);
    ctx.rotate(-facing * impulse * 0.055);
  } else if (kind === "cast") {
    ctx.translate(0, -impulse * 5);
    ctx.scale(1 + impulse * 0.025, 1 - impulse * 0.018);
  } else if (kind === "heal") {
    ctx.translate(0, -impulse * 3);
    ctx.scale(1 + impulse * 0.018, 1 + impulse * 0.035);
  } else if (kind === "power") {
    const charge = clamp(progress / 0.65, 0, 1);
    ctx.translate(0, -Math.sin(charge * Math.PI) * 4);
    ctx.scale(1 + charge * 0.045, 1 + charge * 0.045);
  } else if (kind === "focus") {
    ctx.translate(0, Math.sin(progress * Math.PI * 2) * 1.5);
  } else if (kind === "rest") {
    ctx.translate(0, objectEffectEase(progress) * 3);
    ctx.scale(1 + impulse * 0.012, 1 - impulse * 0.02);
  } else if (kind === "interact") {
    ctx.translate(facing * impulse * 2.5, -impulse * 1.2);
  } else if (kind === "reload") {
    ctx.translate(0, Math.sin(progress * Math.PI * 2) * 1.5);
    ctx.rotate(facing * Math.sin(progress * Math.PI * 2) * 0.012);
  } else if (kind === "jump") {
    ctx.translate(facing * progress * 5, -Math.sin(progress * Math.PI) * 24);
    ctx.scale(1 - impulse * 0.035, 1 + impulse * 0.055);
  }
}

function drawPhysicalActionSprite(player, data, ghost, action) {
  if (action?.kind === "shoot" && drawWeaponFireMotion(player, data, ghost, action)) return true;
  const sequence = PHYSICAL_ACTION_SEQUENCE[action?.kind];
  if (!Number.isInteger(sequence)) return false;
  const skinId = displayedSkinId(player, data);
  const atlasId = player.isBot ? "male-bot" : skinId === "blue-dress" ? "blue-dress" : "white-hood";
  const atlasImage = state.textures.physicalActionAtlases?.[atlasId];
  const atlas = atlasImage ? transparentSpriteSource(atlasImage, `physical-action-${atlasId}`, 20) : null;
  if (!atlas) return false;

  const normalizedProgress = clamp(Number(action.progress) || 0, 0, 1);
  const phase = physicalActionFramePosition(action.kind, normalizedProgress);
  const firstFrame = Math.min(2, Math.floor(phase));
  const secondFrame = Math.min(2, firstFrame + 1);
  const blend = phase - Math.floor(phase);
  const row = Math.floor(sequence / 2);
  const firstColumn = (sequence % 2) * 3 + firstFrame;
  const secondColumn = (sequence % 2) * 3 + secondFrame;
  const first = normalizedSpriteFrame(atlas, `physical-action-${atlasId}`, 6, 6, row, firstColumn);
  const second = normalizedSpriteFrame(atlas, `physical-action-${atlasId}`, 6, 6, row, secondColumn);
  if (!first || !second) return false;

  const facing = facingFor(player, motionFor(player, data));
  const flip = facing === "left";
  const actionHeight = action.kind === "rest" || action.kind === "focus" ? 88 : 98;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = IMAGE_SMOOTHING_QUALITY;
  applyPhysicalActionTransform(action.kind, normalizedProgress, flip);
  ctx.globalAlpha *= 1 - blend;
  drawNormalizedSprite(first, 0, 31, 98, actionHeight, flip);
  ctx.globalAlpha = (ghost ? 0.45 : player.ejected ? 0.22 : 1) * blend;
  drawNormalizedSprite(second, 0, 31, 98, actionHeight, flip);
  ctx.restore();
  drawNameplate(player, ghost, -78);
  return true;
}

function drawWeaponFireMotion(player, data, ghost, action) {
  const weaponId = GUNNER_WEAPON_MOTION_IDS.includes(action?.variant)
    ? action.variant
    : (GUNNER_WEAPON_MOTION_IDS.includes(player.gunnerWeapon) ? player.gunnerWeapon : "");
  if (!weaponId) return false;
  const skinId = player.isBot ? "male-bot" : displayedSkinId(player, data) === "blue-dress" ? "blue-dress" : "white-hood";
  const image = state.textures.weaponFireMotions?.[skinId]?.[weaponId];
  const prepared = image ? transparentSpriteSource(image, `weapon-motion-${skinId}-${weaponId}`, 20) : null;
  const sprite = prepared
    ? normalizedSpriteFrame(
      prepared,
      `weapon-motion-${skinId}-${weaponId}`,
      1,
      1,
      0,
      0
    )
    : null;
  if (!sprite) return false;

  const progress = clamp(Number(action.progress) || 0, 0, 1);
  const impulse = Math.sin(progress * Math.PI);
  const weaponRecoil = {
    handgun: 1.4,
    smg: 1.8,
    assault: 2.1,
    sniper: 2.8,
    taser: 0.8
  }[weaponId] || 1.5;
  const facing = facingFor(player, motionFor(player, data));
  const flip = facing === "left";
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = IMAGE_SMOOTHING_QUALITY;
  ctx.translate((flip ? 1 : -1) * weaponRecoil * impulse, -Math.min(0.8, weaponRecoil * 0.2) * impulse);
  ctx.rotate((flip ? -1 : 1) * impulse * weaponRecoil * Math.PI / 720);
  const motionWidth = {
    handgun: 108,
    smg: 116,
    assault: 128,
    sniper: 146,
    taser: 108
  }[weaponId] || 108;
  drawNormalizedSprite(sprite, 0, 31, motionWidth, 98, flip);
  ctx.restore();
  drawNameplate(player, ghost, -78);
  return true;
}

function drawPetSprite(player, data, ghost) {
  const skinId = displayedSkinId(player, data);
  const motion = motionFor(player, data);
  const facing = facingFor(player, motion);
  const direction = { down: 0, left: 1, right: 2, up: 3 }[facing] ?? 0;
  const frame = walkAnimationFrame(player, motion);
  const skinWalkSource = state.textures.playerWalkAtlases?.[skinId];
  const skinWalkAtlas = skinWalkSource ? transparentSpriteSource(skinWalkSource, `skinWalk60-${skinId}`, 12) : null;
  if (skinWalkAtlas) {
    drawBlendedWalkFrame(skinWalkAtlas, direction, frame, -47, -63, 94, 94);
    drawNameplate(player, ghost, -78);
    return true;
  }
  if (skinId === "blue-dress") {
    const master = transparentSpriteSource(state.textures.blueDressMaster, "blueDressMaster", 24);
    if (master) {
      drawMasterWalkFrame(master, direction, frame, -47, -63, 94, 94);
      drawNameplate(player, ghost, -78);
      return true;
    }
    const skinSet = state.textures.playerSkins[skinId];
    const directional = transparentSpriteSource(skinSet?.[direction], `playerSkin-${skinId}-${direction}`, 24);
    if (directional && drawStandaloneWalkFrame(directional, `playerSkin-${skinId}-${direction}`, frame, -47, -63, 94, 94)) {
      drawNameplate(player, ghost, -78);
      return true;
    }
  }
  const atlas = transparentSpriteSource(state.textures.playerWalk60, "playerWalk60", 24);
  if (!atlas) return false;
  drawBlendedWalkFrame(atlas, direction, frame, -47, -63, 94, 94);
  drawNameplate(player, ghost, -78);
  return true;
}

function walkAnimationFrame(player, motion) {
  const now = state.frameNow || performance.now();
  const animation = state.walkAnimations.get(player.id) || {
    frame: 0,
    moving: false,
    x: player.x,
    y: player.y,
    lastAt: now,
    stepBucket: -1,
    lastStepAt: 0
  };
  const elapsed = clamp(now - animation.lastAt, 0, 50);
  if (motion.moving) {
    if (!animation.moving) animation.frame = 0;
    const cycleMs = player.movementMode === "dash" ? 500 : player.movementMode === "slow" ? 1040 : 720;
    animation.frame = (animation.frame + elapsed * physicalMotionRateFor(player) / cycleMs * 60) % 60;
    const stepBucket = Math.floor(animation.frame / 15) % 4;
    if (player.id === state.data?.selfId && player.alive && stepBucket !== animation.stepBucket && now - animation.lastStepAt > 170) {
      animation.stepBucket = stepBucket;
      animation.lastStepAt = now;
      if (!isSlowWalking()) playSound(isDashing() ? "dashStep" : "step");
    }
  } else {
    animation.frame = 0;
    animation.stepBucket = -1;
  }
  animation.moving = motion.moving;
  animation.x = player.x;
  animation.y = player.y;
  animation.lastAt = now;
  state.walkAnimations.set(player.id, animation);
  return animation.frame;
}

function drawMasterWalkFrame(master, direction, frame, x, y, width, height) {
  const cells = [
    { row: 0, column: 0 },
    { row: 0, column: 1 },
    { row: 1, column: 0 },
    { row: 1, column: 1 }
  ];
  const cell = cells[direction] || cells[0];
  const sprite = normalizedSpriteFrame(master, "playerMaster", 2, 2, cell.row, cell.column);
  if (!sprite) return false;
  drawProceduralWalkSprite(sprite, direction, frame, x, y, width, height);
  return true;
}

function drawStandaloneWalkFrame(source, key, frame, x, y, width, height) {
  const sprite = normalizedSpriteFrame(source, key, 1, 1, 0, 0);
  if (!sprite) return false;
  const direction = key.includes("-1") ? 1 : key.includes("-2") ? 2 : key.includes("-3") ? 3 : 0;
  drawProceduralWalkSprite(sprite, direction, frame, x, y, width, height);
  return true;
}

function drawProceduralWalkSprite(sprite, direction, frame, x, y, width, height) {
  const phase = frame / 60 * Math.PI * 2;
  const stride = Math.sin(phase);
  const bob = Math.abs(Math.sin(phase * 2)) * 1.25;
  const scale = Math.min(width / sprite.width, height / sprite.height);
  const drawWidth = sprite.width * scale;
  const drawHeight = sprite.height * scale;
  const centerX = x + width / 2;
  const bottomY = y + height;
  const lowerStart = Math.floor(sprite.height * 0.80);
  const upperEnd = Math.min(sprite.height, lowerStart + 3);
  const half = Math.floor(sprite.width / 2);
  const sideTravel = direction === 1 || direction === 2;

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = IMAGE_SMOOTHING_QUALITY;
  ctx.translate(centerX, bottomY);
  ctx.rotate(stride * 0.004);
  ctx.drawImage(
    sprite,
    0,
    0,
    sprite.width,
    upperEnd,
    -drawWidth / 2,
    -drawHeight - bob,
    drawWidth,
    upperEnd * scale
  );

  for (let leg = 0; leg < 2; leg += 1) {
    const sourceX = leg === 0 ? 0 : half;
    const sourceWidth = leg === 0 ? half + 2 : sprite.width - half;
    const legPhase = leg === 0 ? stride : -stride;
    const lift = Math.max(0, legPhase) * 2.4;
    const travel = legPhase * (sideTravel ? 2.2 : 1.35);
    ctx.drawImage(
      sprite,
      sourceX,
      lowerStart,
      sourceWidth,
      sprite.height - lowerStart,
      -drawWidth / 2 + sourceX * scale + travel,
      -drawHeight + lowerStart * scale - bob - lift,
      sourceWidth * scale,
      (sprite.height - lowerStart) * scale
    );
  }
  ctx.restore();
}

function drawBlendedWalkFrame(atlas, direction, frame, x, y, width, height) {
  const index = Math.floor(frame) % 60;
  const cellWidth = spriteWidth(atlas) / 20;
  const cellHeight = spriteHeight(atlas) / 12;
  const anchor = playerWalkAnchors(atlas)[direction * 60 + index] || { x: 0, y: 0 };
  drawAtlasCell(
    atlas,
    20,
    12,
    index % 20,
    direction * 3 + Math.floor(index / 20),
    x + anchor.x * (width / cellWidth),
    y + anchor.y * (height / cellHeight),
    width,
    height
  );
}

function playerWalkAnchors(atlas) {
  const key = atlas;
  const cached = state.textures.spriteMetadata.get(key);
  if (cached) return cached;
  const columns = 20;
  const rows = 12;
  const cellWidth = Math.floor(spriteWidth(atlas) / columns);
  const cellHeight = Math.floor(spriteHeight(atlas) / rows);
  const canvas = document.createElement("canvas");
  canvas.width = spriteWidth(atlas);
  canvas.height = spriteHeight(atlas);
  const local = canvas.getContext("2d", { willReadFrequently: true });
  local.drawImage(atlas, 0, 0);
  const pixels = local.getImageData(0, 0, canvas.width, canvas.height).data;
  const measurements = [];

  for (let direction = 0; direction < 4; direction += 1) {
    for (let frame = 0; frame < 60; frame += 1) {
      const column = frame % columns;
      const row = direction * 3 + Math.floor(frame / columns);
      let topWeight = 0;
      let topX = 0;
      let bottom = 0;
      for (let localY = 0; localY < cellHeight; localY += 2) {
        for (let localX = 0; localX < cellWidth; localX += 2) {
          const pixel = ((row * cellHeight + localY) * canvas.width + column * cellWidth + localX) * 4;
          const alpha = pixels[pixel + 3];
          if (alpha <= 24) continue;
          bottom = Math.max(bottom, localY);
          if (localY <= cellHeight * 0.56) {
            topWeight += alpha;
            topX += localX * alpha;
          }
        }
      }
      measurements.push({ x: topWeight ? topX / topWeight : cellWidth / 2, bottom });
    }
  }

  const anchors = [];
  for (let direction = 0; direction < 4; direction += 1) {
    const start = direction * 60;
    const frames = measurements.slice(start, start + 60);
    const referenceX = median(frames.map((item) => item.x));
    const referenceBottom = median(frames.map((item) => item.bottom));
    frames.forEach((item) => anchors.push({
      x: referenceX - item.x,
      y: referenceBottom - item.bottom
    }));
  }
  state.textures.spriteMetadata.set(key, anchors);
  return anchors;
}

function median(values) {
  const ordered = [...values].sort((a, b) => a - b);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2;
}

function drawAtlasCell(atlas, columns, rows, column, row, x, y, width, height) {
  const cellWidth = Math.floor(spriteWidth(atlas) / columns);
  const cellHeight = Math.floor(spriteHeight(atlas) / rows);
  ctx.drawImage(atlas, column * cellWidth, row * cellHeight, cellWidth, cellHeight, x, y, width, height);
}

function drawAtlasCellWithAlpha(atlas, columns, rows, column, row, x, y, width, height, alpha) {
  ctx.save();
  ctx.globalAlpha *= clamp(alpha, 0, 1);
  drawAtlasCell(atlas, columns, rows, column, row, x, y, width, height);
  ctx.restore();
}

function drawOperatorWalkSprite(player, data, ghost) {
  const atlas = transparentSpriteSource(state.textures.operatorsWalk, "operatorsWalk", 24);
  if (!atlas) return false;
  const motion = motionFor(player, data);
  const sequence = [0, 1, 2, 3, 2, 1, 0, 3];
  const phase = walkAnimationFrame(player, motion) / 60 * sequence.length;
  const index = Math.floor(phase) % sequence.length;
  const nextIndex = (index + 1) % sequence.length;
  const blend = phase - Math.floor(phase);
  const row = 0;
  const sprite = normalizedSpriteFrame(atlas, "operatorsWalk", 4, 2, row, sequence[index]);
  const nextSprite = normalizedSpriteFrame(atlas, "operatorsWalk", 4, 2, row, sequence[nextIndex]);
  if (!sprite || !nextSprite) return false;
  ctx.save();
  ctx.globalAlpha *= 1 - blend;
  drawNormalizedSprite(sprite, 0, 31, 70, 94, motion.moving && motion.dx < -0.18);
  ctx.restore();
  if (blend > 0.001) {
    ctx.save();
    ctx.globalAlpha *= blend;
    drawNormalizedSprite(nextSprite, 0, 31, 70, 94, motion.moving && motion.dx < -0.18);
    ctx.restore();
  }
  drawNameplate(player, ghost, -76);
  return true;
}

function drawOperatorSprite(player, data, ghost) {
  const atlas = state.textures.operators;
  if (!atlas.complete || !atlas.naturalWidth) return false;

  const halfWidth = atlas.naturalWidth / 2;
  const sx = 0;
  const sy = 0;
  const sw = halfWidth;
  const sh = atlas.naturalHeight;
  const dw = 68;
  const dh = 92;

  ctx.drawImage(atlas, sx, sy, sw, sh, -dw / 2, -62, dw, dh);
  drawNameplate(player, ghost, -76);
  return true;
}

function drawNameplate(player, ghost, y) {
  ctx.font = "800 10px Segoe UI, sans-serif";
  const identityLabel = playerIdentityLabel(player).slice(0, 14);
  const nameplateWidth = Math.min(92, Math.max(44, ctx.measureText(identityLabel).width + 12));
  const liveAttackerAlly = state.data?.phase === "playing" && player.attackerAlly;
  ctx.fillStyle = liveAttackerAlly ? "#7f1d1d" : "#e2e8f0";
  ctx.globalAlpha *= 0.96;
  roundRect(-nameplateWidth / 2, y, nameplateWidth, 14, 6, true, false);
  ctx.globalAlpha = ghost ? 0.45 : player.ejected ? 0.22 : 1;
  ctx.fillStyle = liveAttackerAlly ? "#fff1f2" : "#0f172a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(identityLabel, 0, y + 7);
}

function motionFor(player, data) {
  const current = state.motion.get(player.id) || { dx: 0, dy: 1, moving: false };
  if (player.id !== data.selfId) return current;
  const direction = getDirection();
  if (direction.dx || direction.dy) {
    return { dx: direction.dx, dy: direction.dy, moving: true };
  }
  return { ...current, moving: false };
}

function facingFor(player, motion) {
  const current = state.facing.get(player.id) || "down";
  if (!motion.moving) return current;
  const ax = Math.abs(motion.dx);
  const ay = Math.abs(motion.dy);
  const keepHorizontal = (current === "left" || current === "right") && ax >= ay * 0.82;
  const horizontal = ax > ay * 1.12 || keepHorizontal;
  const next = horizontal
    ? motion.dx < 0 ? "left" : "right"
    : motion.dy < 0 ? "up" : "down";
  state.facing.set(player.id, next);
  return next;
}

function spriteWidth(source) {
  return source.naturalWidth || source.width;
}

function spriteHeight(source) {
  return source.naturalHeight || source.height;
}

function normalizedSpriteFrame(source, key, cols, rows, row, frame) {
  const safeRow = clamp(Math.floor(row), 0, rows - 1);
  const safeFrame = clamp(Math.floor(frame), 0, cols - 1);
  const cacheKey = `cell:${key}:${cols}:${rows}:${safeRow}:${safeFrame}`;
  const cached = state.textures.preparedSprites.get(cacheKey);
  if (cached) return cached;

  try {
    const cellWidth = Math.floor(spriteWidth(source) / cols);
    const cellHeight = Math.floor(spriteHeight(source) / rows);
    const cell = document.createElement("canvas");
    cell.width = cellWidth;
    cell.height = cellHeight;
    const local = cell.getContext("2d", { willReadFrequently: true });
    local.drawImage(
      source,
      safeFrame * cellWidth,
      safeRow * cellHeight,
      cellWidth,
      cellHeight,
      0,
      0,
      cellWidth,
      cellHeight
    );
    const imageData = local.getImageData(0, 0, cellWidth, cellHeight);
    const pixels = imageData.data;
    let minX = cellWidth;
    let minY = cellHeight;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < cellHeight; y += 1) {
      for (let x = 0; x < cellWidth; x += 1) {
        const pixelIndex = (y * cellWidth + x) * 4;
        if (pixels[pixelIndex + 3] < 18) continue;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
    local.putImageData(imageData, 0, 0);
    if (maxX < minX || maxY < minY) return null;
    const pad = 2;
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(cellWidth - 1, maxX + pad);
    maxY = Math.min(cellHeight - 1, maxY + pad);
    const sprite = document.createElement("canvas");
    sprite.width = maxX - minX + 1;
    sprite.height = maxY - minY + 1;
    sprite.getContext("2d").drawImage(
      cell,
      minX,
      minY,
      sprite.width,
      sprite.height,
      0,
      0,
      sprite.width,
      sprite.height
    );
    state.textures.preparedSprites.set(cacheKey, sprite);
    return sprite;
  } catch {
    return null;
  }
}

function drawNormalizedSprite(sprite, centerX, bottomY, maxWidth, maxHeight, flip = false) {
  const scale = Math.min(maxWidth / sprite.width, maxHeight / sprite.height);
  const width = sprite.width * scale;
  const height = sprite.height * scale;
  ctx.save();
  ctx.translate(centerX, bottomY);
  if (flip) ctx.scale(-1, 1);
  ctx.drawImage(sprite, -width / 2, -height, width, height);
  ctx.restore();
}

function drawNormalizedSpriteCentered(sprite, centerX, centerY, maxWidth, maxHeight, flip = false) {
  const scale = Math.min(maxWidth / sprite.width, maxHeight / sprite.height);
  const width = sprite.width * scale;
  const height = sprite.height * scale;
  ctx.save();
  ctx.translate(centerX, centerY);
  if (flip) ctx.scale(-1, 1);
  ctx.drawImage(sprite, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function animatedTextureSize(sprite, maxWidth, maxHeight) {
  const scale = Math.min(maxWidth / sprite.width, maxHeight / sprite.height);
  return { width: sprite.width * scale, height: sprite.height * scale };
}

const EFFECT_TEXTURE_VISIBILITY = Object.freeze({
  effect: Object.freeze({ minimumAlpha: 0.36, brightness: 1.14, contrast: 1.1, saturation: 1.12 }),
  object: Object.freeze({ minimumAlpha: 0, brightness: 1, contrast: 1, saturation: 1 }),
  ambient: Object.freeze({ minimumAlpha: 0, brightness: 1, contrast: 1, saturation: 1 })
});

const ATE_ANIMATION_PROFILES = Object.freeze({
  energy: Object.freeze({ family: "breathing-motes", tempo: 0.82, phaseScale: 1.0, progressScale: 0.6, overlayGain: 0.92 }),
  beam: Object.freeze({ family: "directional-sweep", tempo: 1.28, phaseScale: 0.45, progressScale: 0.35, overlayGain: 1.08 }),
  ripple: Object.freeze({ family: "counter-wave", tempo: 0.72, phaseScale: 1.3, progressScale: 0.8, overlayGain: 0.88 }),
  "flow-up": Object.freeze({ family: "buoyant-plume", tempo: 0.58, phaseScale: 0.9, progressScale: 0.55, overlayGain: 0.96 }),
  "data-down": Object.freeze({ family: "packet-descent", tempo: 1.1, phaseScale: 1.7, progressScale: 0.2, overlayGain: 1.02 }),
  "data-up": Object.freeze({ family: "packet-ascent", tempo: 0.94, phaseScale: 1.4, progressScale: 0.26, overlayGain: 1.02 }),
  "data-accelerate": Object.freeze({ family: "compute-ingress-egress", tempo: 1.18, phaseScale: 1.15, progressScale: 0.28, overlayGain: 1.08 }),
  shimmer: Object.freeze({ family: "asynchronous-glint", tempo: 0.66, phaseScale: 0.7, progressScale: 0.45, overlayGain: 0.84 }),
  orbit: Object.freeze({ family: "elliptic-orbit", tempo: 0.8, phaseScale: 1.8, progressScale: 0.75, overlayGain: 0.9 }),
  resonance: Object.freeze({ family: "constructive-interference", tempo: 1.08, phaseScale: 0.88, progressScale: 0.54, overlayGain: 1.12 }),
  glitch: Object.freeze({ family: "discontinuous-slice", tempo: 1.75, phaseScale: 2.3, progressScale: 0.18, overlayGain: 1.04 }),
  teleport: Object.freeze({ family: "phase-column", tempo: 1.12, phaseScale: 1.1, progressScale: 1.2, overlayGain: 1.0 }),
  gravity: Object.freeze({ family: "inward-compression", tempo: 0.48, phaseScale: 0.55, progressScale: 0.92, overlayGain: 0.94 }),
  impact: Object.freeze({ family: "radial-impulse", tempo: 0.9, phaseScale: 0.8, progressScale: 1.45, overlayGain: 1.1 }),
  recoil: Object.freeze({ family: "backward-kick", tempo: 1.3, phaseScale: 0.6, progressScale: 1.6, overlayGain: 1.06 }),
  shield: Object.freeze({ family: "layered-guard", tempo: 0.62, phaseScale: 1.6, progressScale: 0.35, overlayGain: 0.9 }),
  combustion: Object.freeze({ family: "turbulent-flame", tempo: 1.08, phaseScale: 1.2, progressScale: 0.7, overlayGain: 1.08 }),
  targeting: Object.freeze({ family: "settling-landing", tempo: 0.76, phaseScale: 0.52, progressScale: 0.24, overlayGain: 0.98 }),
  clairvoyance: Object.freeze({ family: "horizon-scan", tempo: 0.64, phaseScale: 1.35, progressScale: 0.18, overlayGain: 1.06 })
});

// Keep the authored silhouette pixel-stable. Animation is limited to clipped
// highlight layers inside that footprint, which avoids frame-to-frame wobble.
function drawAnimatedTextureCentered(sprite, centerX, centerY, maxWidth, maxHeight, options = {}) {
  if (!sprite?.width || !sprite?.height) return false;
  const {
    mode = "energy",
    time = (state.frameNow || performance.now()) / 1000,
    progress = 0,
    phase = 0,
    intensity = 1,
    flip = false,
    baseAlpha = 0.22,
    opacityBoost = 3,
    visibilityProfile = "effect"
  } = options;
  const { width, height } = animatedTextureSize(sprite, maxWidth, maxHeight);
  if (!(width > 0 && height > 0)) return false;
  const sampledTime = Math.floor(time * 60) / 60;
  const animationMode = normalizeAteGlowMode(mode);
  const animationProfile = ATE_ANIMATION_PROFILES[animationMode] || ATE_ANIMATION_PROFILES.energy;
  const clock = sampledTime * animationProfile.tempo + phase * animationProfile.phaseScale + progress * animationProfile.progressScale;
  const inheritedAlpha = ctx.globalAlpha;

  ctx.save();
  ctx.translate(centerX, centerY);
  if (flip) ctx.scale(-1, 1);
  const effectiveOpacityBoost = clamp(Number(opacityBoost) || 1, 1, 4);
  const visibility = EFFECT_TEXTURE_VISIBILITY[visibilityProfile] || EFFECT_TEXTURE_VISIBILITY.effect;
  const baseTextureAlpha = clamp(
    Math.max(visibility.minimumAlpha, baseAlpha * effectiveOpacityBoost),
    0,
    1
  );
  if (visibilityProfile === "effect") {
    const inheritedFilter = ctx.filter && ctx.filter !== "none" ? `${ctx.filter} ` : "";
    ctx.filter = `${inheritedFilter}brightness(${visibility.brightness}) contrast(${visibility.contrast}) saturate(${visibility.saturation})`;
  }
  applyAteGlowContext(
    ctx,
    animationMode,
    sampledTime,
    phase + progress,
    intensity * (visibilityProfile === "ambient" ? 0.52 : 1)
  );
  ctx.globalAlpha = inheritedAlpha * baseTextureAlpha;
  ctx.drawImage(sprite, -width / 2, -height / 2, width, height);

  const drawClippedOverlay = (clipX, clipY, clipWidth, clipHeight, alpha, sourceOffsetX = 0, sourceOffsetY = 0, ellipse = false) => {
    if (!(clipWidth > 0 && clipHeight > 0) || alpha <= 0.004) return;
    ctx.save();
    ctx.beginPath();
    if (ellipse) ctx.ellipse(clipX + clipWidth / 2, clipY + clipHeight / 2, clipWidth / 2, clipHeight / 2, 0, 0, Math.PI * 2);
    else ctx.rect(clipX, clipY, clipWidth, clipHeight);
    ctx.clip();
    const overlayAlpha = clamp(
        Math.max(visibility.minimumAlpha * 0.72, alpha * intensity * effectiveOpacityBoost * animationProfile.overlayGain),
      0,
      1
    );
    ctx.globalAlpha = inheritedAlpha * overlayAlpha;
    ctx.drawImage(sprite, -width / 2 + sourceOffsetX, -height / 2 + sourceOffsetY, width, height);
    ctx.restore();
  };

  if (animationMode === "beam") {
    const travel = ((clock * 0.72) % 1 + 1) % 1;
    const bandWidth = width * 0.13;
    for (let band = 0; band < 3; band += 1) {
      const position = (travel + band / 3) % 1;
      const x = -width * 0.42 + position * width * 0.84 - bandWidth / 2;
      drawClippedOverlay(x, -height * 0.41, bandWidth, height * 0.82, 0.28 + band * 0.06, -position * width * 0.025, 0);
    }
  } else if (animationMode === "ripple") {
    for (let band = 0; band < 4; band += 1) {
      const y = -height * 0.34 + band * height * 0.19;
      const drift = Math.sin(clock * 2.8 + band * 1.41) * width * 0.018;
      drawClippedOverlay(-width * 0.41, y, width * 0.82, height * 0.12, 0.25 + Math.sin(clock * 3.1 + band) * 0.06, drift, 0, true);
    }
  } else if (animationMode === "flow-up") {
    for (let plume = 0; plume < 3; plume += 1) {
      const travel = ((clock * (0.19 + plume * 0.025) + plume * 0.31) % 1 + 1) % 1;
      const plumeWidth = width * (0.16 + plume * 0.015);
      const plumeHeight = height * 0.28;
      const x = (-0.24 + plume * 0.24) * width - plumeWidth / 2;
      const y = height * 0.24 - travel * height * 0.58 - plumeHeight / 2;
      drawClippedOverlay(x, y, plumeWidth, plumeHeight, Math.sin(travel * Math.PI) * 0.42, 0, travel * height * 0.035, true);
    }
  } else if (animationMode === "data-accelerate") {
    for (let stream = 0; stream < 6; stream += 1) {
      const input = stream < 3;
      const lane = input ? stream : stream - 3;
      const travel = ((clock * (0.38 + stream * 0.012) + lane * 0.23) % 1 + 1) % 1;
      const packetWidth = width * (input ? 0.09 : 0.13);
      const packetHeight = height * (input ? 0.09 : 0.055);
      const x = input
        ? -width * 0.42 + travel * width * 0.31
        : width * 0.11 + travel * width * 0.31;
      const y = (-0.23 + lane * 0.23) * height - packetHeight / 2;
      drawClippedOverlay(x - packetWidth / 2, y, packetWidth, packetHeight, Math.sin(travel * Math.PI) * 0.48, 0, 0, true);
    }
    const scanTravel = ((clock * 0.62) % 1 + 1) % 1;
    const scanX = -width * 0.1 + scanTravel * width * 0.2;
    drawClippedOverlay(scanX - width * 0.018, -height * 0.31, width * 0.036, height * 0.62, 0.42, 0, 0);
  } else if (animationMode === "data-down" || animationMode === "data-up") {
    const direction = animationMode === "data-down" ? 1 : -1;
    for (let stream = 0; stream < 5; stream += 1) {
      const travel = ((clock * (0.34 + stream * 0.016) + stream * 0.19) % 1 + 1) % 1;
      const directedTravel = direction > 0 ? travel : 1 - travel;
      const packetWidth = width * (0.08 + (stream % 2) * 0.025);
      const packetHeight = height * (0.08 + (stream % 3) * 0.018);
      const x = (-0.28 + stream * 0.14) * width - packetWidth / 2;
      const y = -height * 0.34 + directedTravel * height * 0.68 - packetHeight / 2;
      const alpha = Math.sin(travel * Math.PI) * (0.34 + (stream % 2) * 0.08);
      drawClippedOverlay(x, y, packetWidth, packetHeight, alpha, Math.sin(clock * 2.2 + stream) * width * 0.008, direction * height * 0.018);
    }
    const scanTravel = ((clock * 0.46) % 1 + 1) % 1;
    const scanY = -height * 0.32 + (direction > 0 ? scanTravel : 1 - scanTravel) * height * 0.64;
    drawClippedOverlay(-width * 0.34, scanY - height * 0.025, width * 0.68, height * 0.05, 0.32, 0, direction * height * 0.012);
  } else if (animationMode === "shimmer") {
    const glints = [[-0.27, -0.18, 0.1], [0.23, -0.05, 1.7], [-0.08, 0.24, 3.2], [0.3, 0.25, 4.4]];
    for (const [x, y, glintPhase] of glints) {
      const alpha = Math.max(0, Math.sin(clock * 3.2 + glintPhase)) ** 2 * 0.56;
      drawClippedOverlay(x * width - width * 0.055, y * height - height * 0.055, width * 0.11, height * 0.11, alpha, 0, 0, true);
    }
  } else if (animationMode === "orbit") {
    for (let satellite = 0; satellite < 6; satellite += 1) {
      const angle = clock * (0.9 + satellite * 0.035) + satellite * Math.PI / 3;
      const x = Math.cos(angle) * width * 0.28;
      const y = Math.sin(angle) * height * 0.2;
      drawClippedOverlay(x - width * 0.065, y - height * 0.065, width * 0.13, height * 0.13, 0.34, -x * 0.12, -y * 0.12, true);
    }
  } else if (animationMode === "resonance") {
    const synchronizedPulse = 0.32 + Math.max(0, Math.sin(clock * Math.PI * 2)) * 0.24;
    for (const side of [-1, 1]) {
      const centerX = side * width * 0.16;
      drawClippedOverlay(
        centerX - width * 0.31,
        -height * 0.38,
        width * 0.62,
        height * 0.76,
        synchronizedPulse,
        -side * width * 0.012,
        0,
        true
      );
    }
    const corePulse = 0.42 + Math.max(0, Math.sin(clock * Math.PI * 4 + Math.PI / 2)) * 0.34;
    drawClippedOverlay(-width * 0.105, -height * 0.34, width * 0.21, height * 0.68, corePulse, 0, Math.sin(clock * 2.7) * height * 0.008, true);
  } else if (animationMode === "glitch") {
    for (let band = 0; band < 7; band += 1) {
      const y = -height * 0.4 + band * height * 0.13;
      const offset = Math.sin(clock * 8.7 + band * 2.17) * width * (band % 2 ? 0.055 : 0.028);
      drawClippedOverlay(-width * 0.43, y, width * 0.86, height * 0.075, 0.24 + (band % 3) * 0.05, offset, 0);
    }
  } else if (animationMode === "teleport") {
    for (let slice = 0; slice < 6; slice += 1) {
      const x = -width * 0.42 + slice * width * 0.14;
      const offsetY = Math.sin(clock * 4.2 + slice * 0.92) * height * 0.055;
      drawClippedOverlay(x, -height * 0.42, width * 0.095, height * 0.84, 0.28 + slice * 0.025, 0, offsetY);
    }
  } else if (animationMode === "gravity") {
    for (let ring = 0; ring < 4; ring += 1) {
      const cycle = ((clock * 0.42 + ring * 0.23) % 1 + 1) % 1;
      const ringWidth = width * (0.72 - cycle * 0.48);
      const ringHeight = height * (0.72 - cycle * 0.48);
      drawClippedOverlay(-ringWidth / 2, -ringHeight / 2, ringWidth, ringHeight, 0.22 + (1 - cycle) * 0.24, 0, 0, true);
    }
  } else if (animationMode === "impact") {
    for (let band = 0; band < 4; band += 1) {
      const cycle = clamp(progress * 1.3 - band * 0.12, 0, 1);
      const bandWidth = width * (0.14 + cycle * 0.72);
      const bandHeight = height * (0.12 + cycle * 0.72);
      drawClippedOverlay(-bandWidth / 2, -bandHeight / 2, bandWidth, bandHeight, (1 - cycle) * 0.42 + 0.12, 0, 0, true);
    }
  } else if (animationMode === "recoil") {
    for (let band = 0; band < 5; band += 1) {
      const y = -height * 0.36 + band * height * 0.18;
      const kick = Math.sin(progress * Math.PI) * width * (0.07 + band * 0.008);
      drawClippedOverlay(-width * 0.42, y, width * 0.84, height * 0.1, 0.24 + band * 0.035, -kick, 0);
    }
  } else if (animationMode === "shield") {
    for (let shell = 0; shell < 3; shell += 1) {
      const pulse = 0.78 + Math.sin(clock * 2.4 + shell * 1.6) * 0.08;
      const shellWidth = width * pulse * (1 - shell * 0.13);
      const shellHeight = height * pulse * (1 - shell * 0.13);
      drawClippedOverlay(-shellWidth / 2, -shellHeight / 2, shellWidth, shellHeight, 0.2 + shell * 0.08, 0, 0, true);
    }
  } else if (animationMode === "combustion") {
    for (let plume = 0; plume < 5; plume += 1) {
      const travel = ((clock * (0.24 + plume * 0.018) + plume * 0.19) % 1 + 1) % 1;
      const plumeWidth = width * (0.12 + (plume % 2) * 0.035);
      const plumeHeight = height * 0.24;
      const x = (-0.3 + plume * 0.15) * width - plumeWidth / 2;
      const y = height * 0.28 - travel * height * 0.63 - plumeHeight / 2;
      drawClippedOverlay(x, y, plumeWidth, plumeHeight, Math.sin(travel * Math.PI) * 0.46, Math.sin(clock + plume) * width * 0.012, travel * height * 0.04, true);
    }
  } else if (animationMode === "targeting") {
    for (let quadrant = 0; quadrant < 4; quadrant += 1) {
      const phaseClock = clock * 2.4 + quadrant * Math.PI / 2;
      const settle = 0.76 + Math.sin(phaseClock) * 0.08;
      const glintWidth = width * 0.18;
      const glintHeight = height * 0.18;
      const x = Math.cos(quadrant * Math.PI / 2) * width * 0.26 * settle;
      const y = Math.sin(quadrant * Math.PI / 2) * height * 0.2 * settle;
      drawClippedOverlay(x - glintWidth / 2, y - glintHeight / 2, glintWidth, glintHeight, 0.26 + Math.max(0, Math.sin(phaseClock)) * 0.22, -x * 0.05, -y * 0.05, true);
    }
  } else {
    for (let mote = 0; mote < 5; mote += 1) {
      const angle = clock * (0.48 + mote * 0.035) + mote * Math.PI * 0.4;
      const orbitX = Math.cos(angle) * width * (0.11 + mote * 0.018);
      const orbitY = Math.sin(angle) * height * (0.1 + mote * 0.014);
      const moteWidth = width * 0.13;
      const moteHeight = height * 0.13;
      drawClippedOverlay(orbitX - moteWidth / 2, orbitY - moteHeight / 2, moteWidth, moteHeight, 0.3 + Math.sin(clock * 2.7 + mote) * 0.08, -orbitX * 0.08, -orbitY * 0.08, true);
    }
  }
  if (visibilityProfile !== "ambient") {
    drawAteComplementaryVfx(ctx, animationMode, width, height, sampledTime, phase + progress, intensity * 0.82);
  }
  ctx.restore();
  return true;
}

function drawAnimatedTextureBottom(sprite, centerX, bottomY, maxWidth, maxHeight, options = {}) {
  const { height } = animatedTextureSize(sprite, maxWidth, maxHeight);
  return drawAnimatedTextureCentered(sprite, centerX, bottomY - height / 2, maxWidth, maxHeight, options);
}

function drawKillAnimations(data, camera, w, h, zoom = CAMERA_ZOOM) {
  const now = state.frameNow || performance.now();
  state.killEffects = state.killEffects.filter((effect) => now - effect.startedAt < effect.duration);
  if (!state.killEffects.length) return;
  state.killEffects.forEach((effect) => drawWorldKillEffect(effect, camera, zoom));
  const cutin = state.killEffects[state.killEffects.length - 1];
  drawKillCutin(cutin, w, h);
}

function drawWorldKillEffect(effect, camera, zoom = CAMERA_ZOOM) {
  const now = state.frameNow || performance.now();
  const age = now - effect.startedAt;
  const progress = clamp(age / effect.duration, 0, 1);
  const sx = (effect.x - camera.x) * zoom;
  const sy = (effect.y - camera.y) * zoom;
  const humanKill = !(effect.killerIsBot || effect.killerSkinId === "operator");
  const blueDress = humanKill && normalizeSkinId(effect.killerSkinId) === "blue-dress";
  ctx.save();
  ctx.globalAlpha = 1 - progress * 0.72;
  ctx.translate(sx, sy);
  const radius = 32 + Math.sin(now / 55) * 5;
  ctx.strokeStyle = blueDress ? "rgba(186,230,253,0.95)" : humanKill ? "rgba(226,232,240,0.95)" : "rgba(248,113,113,0.90)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = blueDress ? "rgba(125,211,252,0.42)" : humanKill ? "rgba(226,232,240,0.42)" : "rgba(239,68,68,0.55)";
  for (let i = 0; i < 7; i += 1) {
    const angle = (Math.PI * 2 * i) / 7 + now / 180;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * 22, Math.sin(angle) * 22);
    ctx.lineTo(Math.cos(angle + 0.16) * 78, Math.sin(angle + 0.16) * 78);
    ctx.lineTo(Math.cos(angle - 0.16) * 78, Math.sin(angle - 0.16) * 78);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawKillCutin(effect, w, h) {
  const now = state.frameNow || performance.now();
  const age = now - effect.startedAt;
  const progress = clamp(age / effect.duration, 0, 1);
  const cutinFrame = clamp(Math.floor(age / (1000 / 60)), 0, 59);
  const fadeIn = clamp(age / 150, 0, 1);
  const fadeOut = clamp((effect.duration - age) / 230, 0, 1);
  const alpha = Math.min(fadeIn, fadeOut);
  const humanKill = !(effect.killerIsBot || effect.killerSkinId === "operator");
  const blueDress = humanKill && normalizeSkinId(effect.killerSkinId) === "blue-dress";
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = blueDress ? "rgba(20,31,45,0.80)" : humanKill ? "rgba(22,27,34,0.80)" : "rgba(24,10,12,0.74)";
  ctx.fillRect(0, h * 0.16, w, h * 0.34);
  ctx.fillStyle = blueDress ? "rgba(147,197,253,0.94)" : humanKill ? "rgba(226,232,240,0.94)" : "rgba(239,68,68,0.92)";
  ctx.fillRect(0, h * 0.16, w, 5);
  ctx.fillRect(0, h * 0.50 - 5, w, 5);

  const slide = (1 - Math.min(1, progress * 4)) * 120;
  if (humanKill) {
    drawCutinPet(12 - slide, h * 0.16 - 2, cutinFrame, effect.killerSkinId);
  } else {
    drawCutinOperator(98 - slide, h * 0.45);
  }

  ctx.fillStyle = blueDress ? "#eff6ff" : humanKill ? "#f8fafc" : "#fff1f2";
  ctx.font = "900 34px Segoe UI, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("キル", 260 - slide * 0.35, h * 0.31);
  ctx.font = "800 15px Segoe UI, sans-serif";
  ctx.fillStyle = blueDress ? "#bfdbfe" : humanKill ? "#cbd5e1" : "#fca5a5";
  ctx.fillText(effect.name ? `${effect.name} 撃破` : "対象を撃破", 264 - slide * 0.35, h * 0.38);
  ctx.restore();
}

function drawCutinPet(x, y, frame, skinId = "hood") {
  if (normalizeSkinId(skinId) === "blue-dress") {
    const source = transparentSpriteSource(state.textures.blueDressKillCutin, "cutin-blue-dress", 24);
    const sprite = source ? normalizedSpriteFrame(source, "cutin-blue-dress", 1, 1, 0, 0) : null;
    if (sprite) {
      const phase = clamp(frame, 0, 59) / 59;
      const impact = Math.sin(Math.min(1, phase * 1.7) * Math.PI / 2);
      const scale = Math.min(220 / sprite.width, 220 / sprite.height) * (0.90 + impact * 0.10);
      const width = sprite.width * scale;
      const height = sprite.height * scale;
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = IMAGE_SMOOTHING_QUALITY;
      ctx.translate(x + 110, y + 220);
      ctx.rotate((1 - impact) * -0.035);
      ctx.drawImage(sprite, -width / 2, -height, width, height);
      ctx.restore();
      return;
    }
  }
  const master = transparentSpriteSource(state.textures.killCutinMaster, "killCutinMaster", 24);
  if (master) {
    const sprite = normalizedSpriteFrame(master, "killCutinMaster", 1, 1, 0, 0);
    if (!sprite) return;
    const phase = clamp(frame, 0, 59) / 59;
    const impact = Math.sin(Math.min(1, phase * 1.7) * Math.PI / 2);
    const pulse = Math.sin(phase * Math.PI * 8) * (1 - phase) * 0.018;
    const scale = Math.min(220 / sprite.width, 220 / sprite.height) * (0.90 + impact * 0.10 + pulse);
    const width = sprite.width * scale;
    const height = sprite.height * scale;
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = IMAGE_SMOOTHING_QUALITY;
    ctx.translate(x + 110, y + 220);
    ctx.rotate((1 - impact) * -0.035);
    ctx.drawImage(sprite, -width / 2, -height, width, height);
    ctx.restore();
    return;
  }
  const atlas = transparentSpriteSource(state.textures.killCutin60, "killCutin60", 24);
  if (!atlas) return;
  drawAtlasCell(atlas, 10, 6, frame % 10, Math.floor(frame / 10), x, y, 220, 220);
}

function drawCutinOperator(x, y) {
  const atlas = transparentSpriteSource(state.textures.operatorsWalk, "operatorsWalk", 24);
  if (!atlas) return;
  const frame = Math.floor((state.frameNow || 0) / 80) % 4;
  const sprite = normalizedSpriteFrame(atlas, "operatorsWalk", 4, 2, 1, frame);
  if (!sprite) return;
  drawNormalizedSprite(sprite, x + 67, y + 32, 134, 184);
}

function drawLightningBolt(x1, y1, x2, y2, seed = 0) {
  ctx.save();
  ctx.strokeStyle = "rgba(224,251,255,0.96)";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  const steps = 4;
  for (let i = 1; i < steps; i += 1) {
    const t = i / steps;
    const wobble = Math.sin((state.frameNow || 0) / 45 + seed * 2.1 + i) * 12;
    const px = x1 + (x2 - x1) * t + wobble;
    const py = y1 + (y2 - y1) * t - wobble * 0.55;
    ctx.lineTo(px, py);
  }
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawScreenLightning(x1, y1, x2, y2, seed = 0) {
  ctx.save();
  ctx.strokeStyle = "rgba(103,232,249,0.78)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  const steps = 7;
  for (let i = 1; i < steps; i += 1) {
    const t = i / steps;
    const wobble = Math.sin((state.frameNow || 0) / 35 + seed * 1.7 + i) * 22;
    ctx.lineTo(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t + wobble);
  }
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawHud(data, w, h) {
  const self = data?.self;
  if (!self || !["playing", "meeting"].includes(data.phase)) return;

  const timestamp = estimatedServerNow(data);
  const stamina = Number(self.stamina) || 0;
  const mana = Number(self.mana) || 0;
  const baseHealth = self.alive ? Math.max(0, 2 - (Number(self.bodyHits) || 0)) : 0;
  const overheal = self.alive ? Math.max(0, Number(self.overheal) || 0) : 0;
  const cooldownRemaining = Math.max(0, (Number(self.killReadyAt) || 0) - timestamp);
  const empCooldownRemaining = Math.max(0, (Number(self.empReadyAt) || 0) - timestamp);
  const vibeCodingCooldownRemaining = self.special === "alchemist"
    ? Math.max(0, (Number(self.vibeCodingReadyAt) || 0) - timestamp)
    : 0;
  const maxStamina = Math.max(100, Number(self.maxStoredStamina) || 500);
  const manaGaugeMax = Math.max(2, Math.ceil(Math.max(0, mana) / 2) * 2);
  const accelerationMultiplier = Math.max(1, Number(self.accelerationMultiplier) || 1);
  const bars = [
    { label: "SP", value: Math.max(0, stamina), max: maxStamina, color: stamina <= 0 ? "#fb7185" : "#22c55e", text: `${Math.round(stamina)}` },
    { label: "MP", value: Math.max(0, mana), max: manaGaugeMax, color: self.manaState === "理知" ? "#a78bfa" : self.manaState === "気概" ? "#fbbf24" : "#fb7185", text: `${Math.round(mana * 100) / 100}` },
    { label: "HP", value: baseHealth, max: 2, color: baseHealth >= 1.5 ? "#22c55e" : baseHealth >= 0.65 ? "#f59e0b" : "#f43f5e", text: `${baseHealth.toFixed(1).replace(/\.0$/, "")}/2${overheal ? `+${overheal}` : ""}` }
  ];
  const width = Math.min(260, Math.max(224, w * 0.27));
  const barWidth = width - 116;
  const rowHeight = 25;
  const liveIdeaProgress = Math.max(0, Number(self.ideaProgressMs) || 0) + (
    Number(self.ideaProgressUpdatedAt || 0) > 0
      ? Math.max(0, timestamp - Number(self.ideaProgressUpdatedAt)) * Math.max(1, Number(self.ideaProgressRate) || 1)
      : 0
  );
  const idea = Number(self.ideaNextThresholdMs || 0) > 0 && Number(self.ideaProgressStartedAt || 0) > 0
    ? Math.max(0, Math.ceil((Number(self.ideaNextThresholdMs) - liveIdeaProgress) / 1000))
    : 0;
  const detailTop = 38 + bars.length * rowHeight;
  const vibeCodingOffset = self.special === "alchemist" ? 19 : 0;
  const height = detailTop + vibeCodingOffset + (idea > 0 ? 104 : 86);

  ctx.save();
  ctx.fillStyle = "rgba(8, 24, 32, 0.88)";
  ctx.strokeStyle = "rgba(103, 232, 249, 0.7)";
  ctx.lineWidth = 1.5;
  roundRect(14, 14, width, height, 8, true, true);
  bars.forEach((bar, index) => {
    const y = 34 + index * rowHeight;
    const ratio = clamp(bar.max > 0 ? bar.value / bar.max : 0, 0, 1);
    ctx.font = "900 11px Segoe UI, sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = bar.color;
    ctx.fillText(bar.label, 27, y);
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    roundRect(68, y - 9, barWidth, 9, 4, true, false);
    if (ratio > 0) {
      ctx.fillStyle = bar.color;
      roundRect(68, y - 9, Math.max(2, barWidth * ratio), 9, 4, true, false);
    }
    ctx.fillStyle = "#f8fafc";
    ctx.textAlign = "right";
    ctx.fillText(bar.text, width, y);
  });
  ctx.font = "900 11px Segoe UI, sans-serif";
  ctx.textAlign = "left";
  ctx.fillStyle = "#7dd3fc";
  ctx.fillText(`ACC ×${accelerationMultiplier.toFixed(2)}`, 27, detailTop);
  const drawReadyText = (label, remaining, x, y = detailTop + 19) => {
    const ready = remaining <= 0;
    ctx.save();
    ctx.fillStyle = ready ? "#ecfeff" : "#94a3b8";
    ctx.shadowColor = ready ? "#22d3ee" : "transparent";
    ctx.shadowBlur = ready ? 14 : 0;
    ctx.fillText(ready ? `${label} READY` : `${label} ${Math.ceil(remaining / 1000)}s`, x, y);
    ctx.restore();
  };
  drawReadyText("EMP", empCooldownRemaining, 27);
  drawReadyText("KILL", cooldownRemaining, 127);
  if (self.special === "alchemist") drawReadyText("VIBE", vibeCodingCooldownRemaining, 27, detailTop + 38);
  const resourceOffset = vibeCodingOffset;
  ctx.fillStyle = "#fbbf24";
  ctx.fillText(`${Math.round(Number(self.credits) || 0)}C`, 27, detailTop + 38 + resourceOffset);
  ctx.fillStyle = Number(self.luck || 0) >= 0 ? "#f0abfc" : "#fb7185";
  ctx.fillText(`幸運／直観 ${Number(self.luck || 0).toFixed(2)}`, 27, detailTop + 56 + resourceOffset);
  ctx.fillStyle = "#e2e8f0";
  ctx.fillText(`SP:${self.staminaState || "気概"} / MP:${self.manaState || "気概"}`, 27, detailTop + 74 + resourceOffset);
  if (idea > 0) {
    const ideaLabel = ["真/美", "真/美", "善", "善のイデア"][Math.min(3, Number(self.ideaStage) || 0)];
    ctx.fillStyle = "#fde68a";
    ctx.fillText(`${ideaLabel} ${idea}s`, 27, detailTop + 92 + resourceOffset);
  }
  ctx.restore();
}

function drawMinimap(data, w, h) {
  const map = data.map;
  const bounds = minimapCanvasBounds(w);
  const boxW = bounds.width;
  const boxH = bounds.height;
  const x = bounds.x;
  const y = bounds.y;
  const scale = Math.min((boxW - 18) / map.width, (boxH - 18) / map.height);
  const ox = x + 9;
  const oy = y + 9;

  ctx.fillStyle = "rgba(238,246,250,0.84)";
  roundRect(x, y, boxW, boxH, 8, true, false);
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#6f8798";
  const corridorAreas = map.corridors.flatMap((corridor) => corridorRenderSegments(corridor));
  [...map.rooms, ...corridorAreas].forEach((rect) => ctx.fillRect(rect.x, rect.y, rect.w, rect.h));
  ctx.fillStyle = "#2dd4bf";
  (data.self.tasks || []).filter((task) => !task.done).forEach((task) => {
    const station = map.stations.find((item) => item.id === task.stationId);
    if (station) {
      ctx.beginPath();
      ctx.arc(station.x, station.y, 28, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  if (data.phase === "playing" && sabotageRepairStations(data).length) {
    const pulse = 1 + Math.sin((state.frameNow || performance.now()) / 130) * 0.12;
    sabotageRepairStations(data).forEach((station) => drawSabotageRepairMarker(ctx, station.x, station.y, 250, pulse));
  }
  ctx.fillStyle = "#ef4444";
  data.bodies.forEach((body) => ctx.fillRect(body.x - 12, body.y - 12, 24, 24));
  state.worldSoundEffects.forEach((effect) => {
    const progress = clamp(((state.frameNow || performance.now()) - effect.startedAt) / effect.duration, 0, 1);
    ctx.strokeStyle = `rgba(239,68,68,${1 - progress})`;
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, 55 + progress * 110, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(220,38,38,${1 - progress * 0.65})`;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, 32, 0, Math.PI * 2);
    ctx.fill();
  });
  if (data.self.hackTracking) {
    data.players.filter((player) => player.id !== data.selfId && player.alive && !player.ejected).forEach((player) => {
      ctx.fillStyle = player.role === "attacker" ? "#fb7185" : "#38bdf8";
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(player.x, player.y, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }
  data.players.filter((player) => player.id === data.selfId).forEach((player) => {
    if (player.ejected) return;
    const pulse = 0.5 + 0.5 * Math.sin((state.frameNow || performance.now()) / 170);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.arc(player.x, player.y, 48 + pulse * 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#fef08a";
    ctx.strokeStyle = "#0e7490";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(player.x, player.y, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
  if (data.self.drone?.active) {
    const drone = state.renderDrone || data.self.drone;
    ctx.fillStyle = "#22d3ee";
    ctx.strokeStyle = "#083344";
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(drone.x, drone.y, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function currentAreaLabel(data = state.data) {
  if (!data) return "不明";
  const self = data.players?.find((player) => player.id === data.selfId);
  if (!self) return "不明";
  const room = data.map.rooms.find((item) => (
    self.x >= item.x && self.x <= item.x + item.w && self.y >= item.y && self.y <= item.y + item.h
  ));
  return room?.label || "連絡通路";
}

function expandedMapLayout(data) {
  const canvas = els.expandedMapCanvas;
  const padding = 38;
  const scale = Math.min(
    (canvas.width - padding * 2) / data.map.width,
    (canvas.height - padding * 2) / data.map.height
  );
  return {
    scale,
    ox: (canvas.width - data.map.width * scale) / 2,
    oy: (canvas.height - data.map.height * scale) / 2
  };
}

function drawExpandedMap(data) {
  const canvas = els.expandedMapCanvas;
  const map = data.map;
  const { scale, ox, oy } = expandedMapLayout(data);
  mapCtx.clearRect(0, 0, canvas.width, canvas.height);
  mapCtx.fillStyle = "#d7e3e9";
  mapCtx.fillRect(0, 0, canvas.width, canvas.height);

  mapCtx.save();
  mapCtx.translate(ox, oy);
  mapCtx.scale(scale, scale);
  mapCtx.lineJoin = "round";

  mapCtx.fillStyle = "#a8bbc5";
  map.corridors.flatMap((corridor) => corridorRenderSegments(corridor))
    .forEach((rect) => mapCtx.fillRect(rect.x, rect.y, rect.w, rect.h));
  mapCtx.fillStyle = "#758e9d";
  mapCtx.strokeStyle = "#425968";
  mapCtx.lineWidth = 8;
  map.rooms.forEach((room) => {
    mapCtx.fillRect(room.x, room.y, room.w, room.h);
    mapCtx.strokeRect(room.x, room.y, room.w, room.h);
  });

  mapCtx.fillStyle = "#294454";
  mapCtx.font = "800 54px Segoe UI, sans-serif";
  mapCtx.textAlign = "center";
  mapCtx.textBaseline = "middle";
  map.rooms.forEach((room) => {
    mapCtx.fillText(room.label, room.x + room.w / 2, room.y + room.h / 2);
  });

  mapCtx.fillStyle = "#ef4444";
  map.doors.filter((door) => data.activeDoorIds.includes(door.id)).forEach((door) => {
    mapCtx.fillRect(door.x, door.y, door.w, door.h);
  });

  mapCtx.fillStyle = "#12a594";
  (data.self.tasks || []).filter((task) => !task.done).forEach((task) => {
    const station = map.stations.find((item) => item.id === task.stationId);
    if (!station) return;
    mapCtx.beginPath();
    mapCtx.arc(station.x, station.y, 34, 0, Math.PI * 2);
    mapCtx.fill();
  });

  if (data.phase === "playing" && sabotageRepairStations(data).length) {
    const pulse = 1 + Math.sin((state.frameNow || performance.now()) / 130) * 0.12;
    sabotageRepairStations(data).forEach((station) => drawSabotageRepairMarker(mapCtx, station.x, station.y, 250, pulse));
  }


  mapCtx.fillStyle = "#a31625";
  data.bodies.forEach((body) => {
    mapCtx.fillRect(body.x - 22, body.y - 22, 44, 44);
  });

  state.worldSoundEffects.forEach((effect) => {
    const progress = clamp(((state.frameNow || performance.now()) - effect.startedAt) / effect.duration, 0, 1);
    mapCtx.strokeStyle = `rgba(220,38,38,${1 - progress})`;
    mapCtx.lineWidth = 12;
    mapCtx.beginPath();
    mapCtx.arc(effect.x, effect.y, 60 + progress * 130, 0, Math.PI * 2);
    mapCtx.stroke();
    mapCtx.fillStyle = `rgba(220,38,38,${0.95 - progress * 0.55})`;
    mapCtx.beginPath();
    mapCtx.arc(effect.x, effect.y, 34, 0, Math.PI * 2);
    mapCtx.fill();
    mapCtx.fillStyle = "#7f1d1d";
    mapCtx.font = "900 42px Segoe UI, sans-serif";
    mapCtx.textAlign = "center";
    mapCtx.fillText("心臓転移", effect.x, effect.y - 62);
  });
  if (data.self.hackTracking) {
    data.players.filter((player) => player.id !== data.selfId && player.alive && !player.ejected).forEach((player) => {
      const position = renderedPlayer(player);
      mapCtx.fillStyle = player.role === "attacker" ? "#fb7185" : "#38bdf8";
      mapCtx.strokeStyle = "#f8fafc";
      mapCtx.lineWidth = 10;
      mapCtx.beginPath();
      mapCtx.arc(position.x, position.y, 30, 0, Math.PI * 2);
      mapCtx.fill();
      mapCtx.stroke();
      mapCtx.fillStyle = "#102331";
      mapCtx.font = "900 28px Segoe UI, sans-serif";
      mapCtx.fillText(playerIdentityLabel(player), position.x, position.y - 48);
    });
  }

  data.players.filter((player) => player.id === data.selfId).forEach((player) => {
    if (player.ejected) return;
    const position = renderedPlayer(player);
    const pulse = 0.5 + 0.5 * Math.sin((state.frameNow || performance.now()) / 180);
    mapCtx.strokeStyle = `rgba(255,255,255,${0.8 - pulse * 0.28})`;
    mapCtx.lineWidth = 13;
    mapCtx.beginPath();
    mapCtx.arc(position.x, position.y, 54 + pulse * 22, 0, Math.PI * 2);
    mapCtx.stroke();
    mapCtx.fillStyle = "#fef08a";
    mapCtx.strokeStyle = "#0e7490";
    mapCtx.lineWidth = 14;
    mapCtx.beginPath();
    mapCtx.arc(position.x, position.y, 38, 0, Math.PI * 2);
    mapCtx.fill();
    mapCtx.stroke();
    const directionX = Number(data.self.aimX) || 0;
    const directionY = Number(data.self.aimY) || 1;
    const directionLength = Math.hypot(directionX, directionY) || 1;
    const nx = directionX / directionLength;
    const ny = directionY / directionLength;
    mapCtx.fillStyle = "#0e7490";
    mapCtx.beginPath();
    mapCtx.moveTo(position.x + nx * 67, position.y + ny * 67);
    mapCtx.lineTo(position.x + ny * 22 - nx * 18, position.y - nx * 22 - ny * 18);
    mapCtx.lineTo(position.x - ny * 22 - nx * 18, position.y + nx * 22 - ny * 18);
    mapCtx.closePath();
    mapCtx.fill();
    mapCtx.fillStyle = "#102331";
    mapCtx.font = "900 36px Segoe UI, sans-serif";
    mapCtx.textAlign = "center";
    mapCtx.fillText("現在地", position.x, position.y - 82);
  });

  if ((state.teleportTargeting || state.instantWarpTargeting) && state.mapPointer) {
    const point = state.mapPointer;
    mapCtx.strokeStyle = point.valid ? "#10b981" : "#ef4444";
    mapCtx.fillStyle = point.valid ? "rgba(16,185,129,0.18)" : "rgba(239,68,68,0.18)";
    mapCtx.lineWidth = 11;
    mapCtx.beginPath();
    mapCtx.arc(point.x, point.y, 58, 0, Math.PI * 2);
    mapCtx.fill();
    mapCtx.stroke();
    mapCtx.beginPath();
    mapCtx.moveTo(point.x - 82, point.y);
    mapCtx.lineTo(point.x + 82, point.y);
    mapCtx.moveTo(point.x, point.y - 82);
    mapCtx.lineTo(point.x, point.y + 82);
    mapCtx.stroke();
  }

  mapCtx.restore();
}

function drawLighting(data, w, h, camera = cameraFor(data, w, h), zoom = 1) {
  return;
}

function roundRect(x, y, w, h, r, fill, stroke) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function createTextures() {
const version = "bot-self-earned-win-v413";
  const pendingSources = [];
  const defer = (entry, path) => {
    pendingSources.push([entry, assetUrl(`${path}?v=${version}`)]);
    return entry;
  };
  const image = (path) => {
    const entry = new Image();
    return defer(entry, path);
  };
  const imageSet = (paths) => paths.map(image);
  const operators = new Image();
  const operatorsWalk = new Image();
  const playerMaster = new Image();
  const playerWalk60 = new Image();
  const blueDressMaster = new Image();
  const blueDressWalk60 = new Image();
  const killCutinMaster = new Image();
  const blueDressKillCutin = new Image();
  const killCutin60 = new Image();
  const actionEffectTextures = imageSet([
    "assets/generated/action-effect-task-v311.png",
    "assets/generated/action-effect-stand-v311.png",
    "assets/generated/action-effect-dodge-v311.png",
    "assets/generated/action-effect-rest-v311.png",
    "assets/generated/action-effect-teleport-v311.png",
    "assets/generated/action-effect-warp-v311.png",
    "assets/generated/action-effect-drone-v311.png",
    "assets/generated/action-effect-aim-v311.png",
    "assets/generated/action-effect-sabotage-v311.png",
    "assets/generated/action-effect-repair-v311.png",
    "assets/generated/action-effect-vent-v311.png",
    "assets/generated/action-effect-vending-v311.png"
  ]);
  const philosophyEffectTextures = imageSet([
    "assets/generated/philosophy-effect-renki-v311.png",
    "assets/generated/philosophy-effect-desire-v311.png",
    "assets/generated/philosophy-effect-grit-v311.png",
    "assets/generated/philosophy-effect-reason-v311.png",
    "assets/generated/philosophy-effect-stand-v311.png",
    "assets/generated/philosophy-effect-push-v311.png",
    "assets/generated/philosophy-effect-truth-v311.png",
    "assets/generated/philosophy-effect-beauty-v311.png",
    "assets/generated/philosophy-effect-good-v311.png",
    "assets/generated/philosophy-effect-ascension-v311.png",
    "assets/generated/philosophy-effect-mystery-v311.png",
    "assets/generated/philosophy-effect-emp-v311.png"
  ]);
  const alchemyEffectTextures = imageSet([
    "assets/generated/alchemy-effect-renki-v311.png",
    "assets/generated/alchemy-effect-desire-v311.png",
    "assets/generated/alchemy-effect-rational-free-v311.png",
    "assets/generated/alchemy-effect-generate-v311.png",
    "assets/generated/alchemy-effect-credits-v311.png",
    "assets/generated/alchemy-effect-stamina-v311.png",
    "assets/generated/alchemy-effect-heal-v311.png",
    "assets/generated/alchemy-effect-fire-v311.png",
    "assets/generated/alchemy-effect-substitution-v311.png",
    "assets/generated/alchemy-effect-warp-v311.png",
    "assets/generated/alchemy-effect-grit-v311.png",
    "assets/generated/alchemy-effect-reason-v311.png"
  ]);
  const empResonanceEffect = new Image();
  const empCancelEffect = new Image();
  const heartTeleportEffect = new Image();
  const gunnerWeaponsAtlas = new Image();
  const gunnerCombatStateEffects = imageSet([
    "assets/generated/gunner-break-handgun-v311.png",
    "assets/generated/gunner-break-smg-v311.png",
    "assets/generated/gunner-break-assault-v311.png",
    "assets/generated/gunner-break-sniper-v311.png",
    "assets/generated/gunner-break-taser-v311.png",
    "assets/generated/gunner-fire-handgun-v311.png",
    "assets/generated/gunner-fire-smg-v311.png",
    "assets/generated/gunner-fire-assault-v311.png",
    "assets/generated/gunner-fire-sniper-v311.png",
    "assets/generated/gunner-fire-taser-v311.png"
  ]);
  const droneAltitudeEffects = imageSet([
    "assets/generated/drone-altitude-low-v311.png",
    "assets/generated/drone-altitude-middle-v311.png",
    "assets/generated/drone-altitude-high-v311.png"
  ]);
  const fighterSlashEffect = new Image();
  const fighterEnergyChargeEffect = new Image();
  const fighterEnergyReleaseEffect = new Image();
  const fighterEnergyImpactEffect = new Image();
  const fighterShockwaveEffect = new Image();
  const standFirmMarkerEffect = philosophyEffectTextures[4];
  const pushMarkerEffect = philosophyEffectTextures[5];
  const floraHealV1 = new Image();
  const floraSunbeamV3 = new Image();
  const tacticalSystemsAtlas = new Image();
  const gravityStorm = new Image();
  const gravityStormSafeEye = new Image();
  const luminousMeetingEffect = new Image();
  const attackerAllyMarker = new Image();
  const hackerRootRainbow = new Image();
  const fireJutsuFieldEffect = new Image();
  const substitutionFieldEffect = new Image();
  const limitBreakFieldEffect = new Image();
  const limitBreakReleaseEffect = new Image();
  const alchemyExcaliburEffect = new Image();
  const accelerationPhaseEffect = new Image();
  const statusLevitationEffect = new Image();
  const preparationBarrierEffect = new Image();
  const humanTransmutationEffect = new Image();
  const statusHpReductionEffect = new Image();
  const statusManaGpuEffect = new Image();
  const vibeCodingEffect = new Image();
  const gunnerHoverSprintEffect = new Image();
  const gunnerRpgEffect = new Image();
  const gunnerMissileEffect = new Image();
  const quantumTransmutationEffect = new Image();
  const quantumColdEffect = new Image();
  const quantumHotEffect = new Image();
  const quantumNuclearEffect = new Image();
  const hazardPoisonEffect = new Image();
  const hazardWaterEffect = new Image();
  const itemEnhanceEffect = new Image();
  const bottleShardEffect = new Image();
  const footBathSparkleEffect = new Image();
  const mapObjectEffectTextures = Object.fromEntries([
    "stamina", "credits", "mana", "cooldown-reduction", "status-recovery",
    "acceleration", "luck-boost", "overheal", "relaxation", "herbal-recovery",
    "healthy-meal", "mineral-water", "heal", "full-recovery", "decoy"
  ].map((id) => [id, new Image()]));
  const itemStaminaCell = new Image();
  const creditCrates = new Image();
  const manaPotion = new Image();
  const itemAntidote = new Image();
  const itemHeal = new Image();
  const alchemyRailgunFieldEffect = new Image();
  const alchemyParticleCannonFieldEffect = new Image();
  const jumpActionEffect = new Image();
  const pushStandFirmBreak = new Image();
  const transferOutEffect = new Image();
  const transferInEffect = new Image();
  const resolvePoint = new Image();
  const sabotageRepairMarker = new Image();
  const smartphoneRepairIcon = new Image();
  const throwLandingPreview = new Image();
  const clairvoyanceThrowAte = new Image();
  const itemTextures = Object.fromEntries([
    "gold", "mercury", "lead", "uranium", "plutonium", "mineral-water", "antidote", "molotov", "ice", "heated-water"
  ].map((id) => [id, image(`assets/generated/item-${id}.webp`)]));
  const physicalActionAtlases = {
    "white-hood": new Image(),
    "blue-dress": new Image(),
    "male-bot": new Image()
  };
  const weaponFireMotions = Object.fromEntries(
    ["white-hood", "blue-dress", "male-bot"].map((skinId) => [
      skinId,
      Object.fromEntries(GUNNER_WEAPON_MOTION_IDS.map((weaponId) => [weaponId, new Image()]))
    ])
  );
  const fullMapComposites = {
    station: image("assets/generated/field-aurelia-corridor-objects-v317.webp")
  };
  const tacticsStoryboard = new Image();
  const tacticsPlayerHood = new Image();
  const tacticsPlayerBlue = new Image();
  defer(operators, "assets/operators.webp");
  defer(operatorsWalk, "assets/operators-walk.webp");
  defer(playerMaster, "assets/player-master-b.webp");
  defer(playerWalk60, "assets/player-walk-60.webp");
  defer(blueDressMaster, "assets/generated/skin-blue-dress-master-chibi-v3.webp");
  defer(blueDressWalk60, "assets/generated/skin-blue-dress-walk-60.webp");
  defer(killCutinMaster, "assets/generated/white-hood-kill-cutin-v404.png");
  defer(blueDressKillCutin, "assets/generated/skin-blue-dress-kill-cutin.webp");
  defer(killCutin60, "assets/kill-cutin-60.webp");
  defer(empResonanceEffect, "assets/generated/emp-resonance-v398.png");
  defer(empCancelEffect, "assets/generated/emp-cancel-v311.png");
  defer(heartTeleportEffect, "assets/generated/heart-teleport-v311.png");
  defer(gunnerWeaponsAtlas, "assets/generated/gunner-weapons-atlas.webp");
  defer(fighterSlashEffect, "assets/generated/fighter-slash-effect.webp");
  defer(fighterEnergyChargeEffect, "assets/generated/fighter-energy-charge-ate-v404.png");
  defer(fighterEnergyReleaseEffect, "assets/generated/fighter-energy-release-ate-v404.png");
  defer(fighterEnergyImpactEffect, "assets/generated/fighter-energy-impact-ate-v404.png");
  defer(fighterShockwaveEffect, "assets/generated/fighter-energy-release-ate-v404.png");
  defer(floraHealV1, "assets/generated/flora-self-heal-v336.png");
  defer(floraSunbeamV3, "assets/generated/flora-sunbeam-v3-v336.png");
  defer(tacticalSystemsAtlas, "assets/generated/tactical-systems-atlas.webp");
  defer(gravityStorm, "assets/generated/gravity-storm.webp");
  defer(gravityStormSafeEye, "assets/generated/gravity-storm-safe-eye-v320.png");
  defer(luminousMeetingEffect, "assets/generated/luminous-meeting-effect-v311.png");
  defer(attackerAllyMarker, "assets/generated/attacker-ally-marker.webp");
  defer(hackerRootRainbow, "assets/generated/hacker-root-rainbow.webp");
  defer(fireJutsuFieldEffect, "assets/generated/fire-jutsu-field.webp");
  defer(substitutionFieldEffect, "assets/generated/substitution-field.webp");
  defer(limitBreakFieldEffect, "assets/generated/limit-break-field-v307.png");
  defer(limitBreakReleaseEffect, "assets/generated/limit-break-release-v309.png");
  defer(alchemyExcaliburEffect, "assets/generated/alchemy-excalibur.webp");
  defer(accelerationPhaseEffect, "assets/generated/status-marker-acceleration-v376.png");
  defer(statusLevitationEffect, "assets/generated/status-levitation-v375.png");
  defer(preparationBarrierEffect, "assets/generated/status-preparation-barrier-ate-v392.png");
  defer(humanTransmutationEffect, "assets/generated/human-transmutation-sd-silhouette-v407.png");
  defer(statusHpReductionEffect, "assets/generated/status-hp-reduction-v375.png");
  defer(statusManaGpuEffect, "assets/generated/status-mana-gpu-ate-v402.png");
  defer(vibeCodingEffect, "assets/generated/action-vibe-coding-v311.png");
  defer(gunnerHoverSprintEffect, "assets/generated/gunner-hover-sprint-v311.png");
  defer(gunnerRpgEffect, "assets/generated/gunner-rpg-v311.png");
  defer(gunnerMissileEffect, "assets/generated/gunner-missile-v311.png");
  defer(quantumTransmutationEffect, "assets/generated/effect-quantum-transmutation.webp");
  defer(quantumColdEffect, "assets/generated/effect-quantum-cold.webp");
  defer(quantumHotEffect, "assets/generated/effect-quantum-hot.webp");
  defer(quantumNuclearEffect, "assets/generated/effect-quantum-nuclear-v311.png");
  defer(hazardPoisonEffect, "assets/generated/effect-hazard-poison.webp");
  defer(hazardWaterEffect, "assets/generated/effect-hazard-water.webp");
  defer(itemEnhanceEffect, "assets/generated/effect-item-enhance.webp");
  defer(bottleShardEffect, "assets/generated/effect-bottle-shards.webp");
  defer(footBathSparkleEffect, "assets/generated/effect-footbath-hidden-spring-godray-v359.png");
  for (const [id, entry] of Object.entries(mapObjectEffectTextures)) {
    defer(entry, `assets/generated/object-effect-${id}-v327.png`);
  }
  defer(itemStaminaCell, "assets/generated/item-stamina-cell.webp");
  defer(creditCrates, "assets/generated/credit-crates.png");
  defer(manaPotion, "assets/generated/mana-potion.webp");
  defer(itemAntidote, "assets/generated/item-antidote.webp");
  defer(itemHeal, "assets/generated/item-heal.webp");
  defer(alchemyRailgunFieldEffect, "assets/generated/alchemy-railgun-field-effect.webp");
  defer(alchemyParticleCannonFieldEffect, "assets/generated/alchemy-particle-cannon-field-effect.webp");
  defer(jumpActionEffect, "assets/generated/jump-action-effect-v311.png");
  defer(pushStandFirmBreak, "assets/generated/push-stand-firm-break-v311.png");
  defer(transferOutEffect, "assets/generated/effect-transfer-out.webp");
  defer(transferInEffect, "assets/generated/effect-transfer-in.webp");
  defer(resolvePoint, "assets/generated/resolve-point.webp");
  defer(sabotageRepairMarker, "assets/generated/sabotage-repair-map-marker.webp");
  defer(smartphoneRepairIcon, "assets/generated/smartphone-sabotage-repair-v374.png");
  defer(throwLandingPreview, "assets/generated/throw-landing-preview-v384.png");
  defer(clairvoyanceThrowAte, "assets/generated/clairvoyance-throw-ate-v412.png");
  defer(physicalActionAtlases["white-hood"], "assets/generated/physical-action-atlas-white-hood.webp?v=focus-sd-v308");
  defer(physicalActionAtlases["blue-dress"], "assets/generated/physical-action-atlas-blue-dress.webp");
  defer(physicalActionAtlases["male-bot"], "assets/generated/physical-action-atlas-male-bot.webp");
  for (const [skinId, weapons] of Object.entries(weaponFireMotions)) {
    for (const [weaponId, entry] of Object.entries(weapons)) {
      defer(entry, `assets/generated/weapon-motion-${skinId}-${weaponId}-v313.webp`);
    }
  }
  const facilityProps = image("assets/facility-props.webp");
  const roomProps = image("assets/room-props.webp");
  const playerSkins = {
    "blue-dress": imageSet([
      "assets/generated/skin-blue-dress-front.webp",
      "assets/generated/skin-blue-dress-left.webp",
      "assets/generated/skin-blue-dress-right.webp",
      "assets/generated/skin-blue-dress-back.webp"
    ])
  };
  return {
    skin: "#f2c6a0",
    operators,
    operatorsWalk,
    playerMaster,
    playerSkins,
    playerWalkAtlases: { "blue-dress": blueDressWalk60 },
    playerWalk60,
    blueDressMaster,
    blueDressWalk60,
    killCutinMaster,
    blueDressKillCutin,
    killCutin60,
    actionEffectTextures,
    philosophyEffectTextures,
    alchemyEffectTextures,
    empResonanceEffect,
    empCancelEffect,
    heartTeleportEffect,
    gunnerWeaponsAtlas,
    gunnerCombatStateEffects,
    droneAltitudeEffects,
    fighterSlashEffect,
    fighterEnergyChargeEffect,
    fighterEnergyReleaseEffect,
    fighterEnergyImpactEffect,
    fighterShockwaveEffect,
    standFirmMarkerEffect,
    pushMarkerEffect,
    floraHealV1,
    floraSunbeamV3,
    tacticalSystemsAtlas,
    gravityStorm,
    gravityStormSafeEye,
    luminousMeetingEffect,
    attackerAllyMarker,
    hackerRootRainbow,
    fireJutsuFieldEffect,
    substitutionFieldEffect,
    limitBreakFieldEffect,
    limitBreakReleaseEffect,
    alchemyExcaliburEffect,
    accelerationPhaseEffect,
    statusLevitationEffect,
    preparationBarrierEffect,
    humanTransmutationEffect,
    statusHpReductionEffect,
    statusManaGpuEffect,
    vibeCodingEffect,
    gunnerHoverSprintEffect,
    gunnerRpgEffect,
    gunnerMissileEffect,
    quantumTransmutationEffect,
    quantumColdEffect,
    quantumHotEffect,
    quantumNuclearEffect,
    hazardFireEffect: fireJutsuFieldEffect,
    hazardPoisonEffect,
    hazardWaterEffect,
    itemEnhanceEffect,
    bottleShardEffect,
    footBathSparkleEffect,
    mapObjectEffectTextures,
    itemStaminaCell,
    creditCrates,
    manaPotion,
    itemAntidote,
    itemHeal,
    itemTextures,
    alchemyRailgunFieldEffect,
    alchemyParticleCannonFieldEffect,
    jumpActionEffect,
    pushStandFirmBreak,
    transferOutEffect,
    transferInEffect,
    resolvePoint,
    sabotageRepairMarker,
    smartphoneRepairIcon,
    throwLandingPreview,
    clairvoyanceThrowAte,
    physicalActionAtlases,
    weaponFireMotions,
    fullMapComposites,
    tacticsStoryboard,
    tacticsPlayerHood,
    tacticsPlayerBlue,
    facilityProps,
    roomProps,
    assetVersion: version,
    pendingSources,
    gameplayLoaded: false,
    preparedSprites: new Map(),
    spriteMetadata: new Map(),
    compositeSources: new WeakMap(),
    mapShadowMasks: new Map(),
    mapPlantLayers: new Map()
  };
}

function loadGameplayTextures() {
  const textures = state.textures;
  if (!textures || textures.gameplayLoaded) return;
  textures.gameplayLoaded = true;
  for (const [entry, source] of textures.pendingSources || []) entry.src = source;
}

function transparentSpriteSource(image, key, threshold = 24) {
  if (!image.complete || !image.naturalWidth) return null;
  const cached = state.textures.preparedSprites.get(key);
  if (cached) return cached;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const local = canvas.getContext("2d");
    local.clearRect(0, 0, canvas.width, canvas.height);
    local.drawImage(image, 0, 0);
    const imageData = local.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const w = canvas.width;
    const h = canvas.height;
    const strictGreenKey = key === "cutin-blue-dress" ||
      key === "blueDressMaster" ||
      key.startsWith("physical-action-") ||
      key.startsWith("skinWalk60-blue-dress") ||
      key.startsWith("playerSkin-blue-dress-");
    const transparentCorner = data[3] < 8 || data[(w - 1) * 4 + 3] < 8 || data[((h - 1) * w) * 4 + 3] < 8;
    if (transparentCorner && !strictGreenKey) {
      state.textures.preparedSprites.set(key, image);
      return image;
    }
    const seen = new Uint8Array(w * h);
    const queue = new Int32Array(w * h);
    let head = 0;
    let tail = 0;
    const isBg = (index) => {
      const i = index * 4;
      const dark = data[i] < threshold && data[i + 1] < threshold && data[i + 2] < threshold;
      const greenKey = data[i + 1] > 76 && data[i] < 82 && data[i + 2] < 92 && data[i + 1] > data[i] * 1.35 && data[i + 1] > data[i + 2] * 1.25;
      return data[i + 3] < 8 || dark || greenKey;
    };
    const enqueue = (x, y) => {
      if (x < 0 || y < 0 || x >= w || y >= h) return;
      const index = y * w + x;
      if (seen[index] || !isBg(index)) return;
      seen[index] = 1;
      queue[tail++] = index;
    };
    for (let x = 0; x < w; x += 1) {
      enqueue(x, 0);
      enqueue(x, h - 1);
    }
    for (let y = 0; y < h; y += 1) {
      enqueue(0, y);
      enqueue(w - 1, y);
    }
    while (head < tail) {
      const index = queue[head++];
      const x = index % w;
      const y = Math.floor(index / w);
      enqueue(x + 1, y);
      enqueue(x - 1, y);
      enqueue(x, y + 1);
      enqueue(x, y - 1);
    }
    if (!tail && !strictGreenKey) {
      state.textures.preparedSprites.set(key, image);
      return image;
    }
    for (let i = 0; i < seen.length; i += 1) {
      if (seen[i]) data[i * 4 + 3] = 0;
      if (strictGreenKey) {
        const offset = i * 4;
        const red = data[offset];
        const green = data[offset + 1];
        const blue = data[offset + 2];
        const greenExcess = green - Math.max(red, blue);
        if (green > 48 && greenExcess > 6) {
          const keyStrength = clamp((greenExcess - 6) / 72, 0, 1);
          data[offset + 1] = Math.min(green, Math.max(red, blue) + 6);
          data[offset + 3] = Math.round(data[offset + 3] * (1 - keyStrength));
        }
      }
    }
    local.putImageData(imageData, 0, 0);
    state.textures.preparedSprites.set(key, canvas);
    return canvas;
  } catch {
    state.textures.preparedSprites.set(key, image);
    return image;
  }
}

function darken(hex, amount) {
  const value = hex.replace("#", "");
  const num = Number.parseInt(value.length === 3 ? value.split("").map((c) => c + c).join("") : value, 16);
  const r = Math.max(0, Math.floor(((num >> 16) & 255) * amount));
  const g = Math.max(0, Math.floor(((num >> 8) & 255) * amount));
  const b = Math.max(0, Math.floor((num & 255) * amount));
  return `rgb(${r},${g},${b})`;
}

function estimatedServerNow(data) {
  if (!data?.serverNow || !state.lastStateReceivedAt) return data?.serverNow || Date.now();
  return data.serverNow + Math.max(0, performance.now() - state.lastStateReceivedAt);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function unlockAudio() {
  state.audio.unlocked = true;
  syncBgm();
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  if (!state.audio.context) {
    const context = new AudioContextClass();
    const master = context.createGain();
    const compressor = context.createDynamicsCompressor();
    master.gain.value = state.audio.muted ? 0 : 0.42;
    compressor.threshold.value = -16;
    compressor.knee.value = 14;
    compressor.ratio.value = 4.5;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.18;
    master.connect(compressor);
    compressor.connect(context.destination);
    state.audio.context = context;
    state.audio.master = master;
    state.audio.compressor = compressor;
    const listener = context.listener;
    if (listener.forwardX) {
      listener.forwardX.setValueAtTime(0, context.currentTime);
      listener.forwardY.setValueAtTime(0, context.currentTime);
      listener.forwardZ.setValueAtTime(-1, context.currentTime);
      listener.upX.setValueAtTime(0, context.currentTime);
      listener.upY.setValueAtTime(1, context.currentTime);
      listener.upZ.setValueAtTime(0, context.currentTime);
    } else if (typeof listener.setOrientation === "function") {
      listener.setOrientation(0, 0, -1, 0, 1, 0);
    }
  }
  if (state.audio.context.state === "suspended") {
    state.audio.context.resume().catch(() => {});
  }
  preloadSfxBank();
}

function preloadSfxBank() {
  const context = state.audio.context;
  if (!context || state.audio.sfxLoading) return state.audio.sfxLoading;
  const files = [...new Set(Object.values(SFX_ASSETS).flat())];
  state.audio.sfxLoading = Promise.allSettled(files.map(async (file) => {
    const response = await fetch(assetUrl(`assets/sfx/${file}`), { cache: "force-cache" });
    if (!response.ok) throw new Error(`SFX ${file}: HTTP ${response.status}`);
    const buffer = await context.decodeAudioData(await response.arrayBuffer());
    state.audio.sfxBuffers.set(file, buffer);
  }));
  return state.audio.sfxLoading;
}

function bufferedSfxKind(kind, options) {
  if (kind !== "gunshot") return kind;
  const variant = String(options.variant || "handgun").toLowerCase();
  if (variant === "smg") return "gunSmg";
  if (variant === "assault" || variant === "ar") return "gunAssault";
  if (variant === "sniper" || variant === "sr") return "gunSniper";
  return "gunHandgun";
}

function playBufferedSfx(kind, options = {}) {
  const context = state.audio.context;
  const master = state.audio.master;
  if (!context || !master || context.state === "closed") return false;
  const resolvedKind = bufferedSfxKind(kind, options);
  const files = SFX_ASSETS[resolvedKind];
  if (!files?.length) return false;
  const cursor = state.audio.sfxCursor.get(resolvedKind) || 0;
  const file = files[cursor % files.length];
  const buffer = state.audio.sfxBuffers.get(file);
  if (!buffer) return false;
  state.audio.sfxCursor.set(resolvedKind, cursor + 1);

  const source = context.createBufferSource();
  const gain = context.createGain();
  const baseGain = SFX_GAINS[resolvedKind] ?? 0.32;
  const optionVolume = Number.isFinite(Number(options.volume)) ? Number(options.volume) : 1;
  gain.gain.value = baseGain * clamp(optionVolume, 0, 1.25);
  source.buffer = buffer;
  source.playbackRate.value = ["step", "dashStep", "worldStep", "worldDash"].includes(resolvedKind)
    ? 0.96 + Math.random() * 0.08
    : 1;
  source.connect(gain);

  if (options.spatial && typeof context.createPanner === "function") {
    const panner = context.createPanner();
    panner.panningModel = "HRTF";
    panner.distanceModel = "inverse";
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 0;
    const { x = 0, y = 0, z = 0 } = options.spatial;
    if (panner.positionX) {
      panner.positionX.setValueAtTime(Number(x) || 0, context.currentTime);
      panner.positionY.setValueAtTime(Number(y) || 0, context.currentTime);
      panner.positionZ.setValueAtTime(Number(z) || 0, context.currentTime);
    } else if (typeof panner.setPosition === "function") {
      panner.setPosition(Number(x) || 0, Number(y) || 0, Number(z) || 0);
    }
    gain.connect(panner);
    panner.connect(master);
  } else if (typeof context.createStereoPanner === "function") {
    const panner = context.createStereoPanner();
    panner.pan.value = clamp(Number(options.pan) || 0, -1, 1);
    gain.connect(panner);
    panner.connect(master);
  } else {
    gain.connect(master);
  }
  source.start();
  return true;
}

function playTone(frequency, endFrequency, duration, type, volume, delay = 0, pan = 0, spatial = null) {
  const context = state.audio.context;
  const master = state.audio.master;
  if (!context || !master || context.state === "closed") return;
  const start = context.currentTime + delay;
  const stop = start + duration;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(Math.max(20, frequency), start);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), stop);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + Math.min(0.012, duration / 3));
  gain.gain.exponentialRampToValueAtTime(0.0001, stop);
  oscillator.connect(gain);
  if (spatial && typeof context.createPanner === "function") {
    const panner = context.createPanner();
    panner.panningModel = "HRTF";
    panner.distanceModel = "inverse";
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 0;
    const x = Number(spatial.x) || 0;
    const y = Number(spatial.y) || 0;
    const z = Number(spatial.z) || 0;
    if (panner.positionX) {
      panner.positionX.setValueAtTime(x, start);
      panner.positionY.setValueAtTime(y, start);
      panner.positionZ.setValueAtTime(z, start);
    } else if (typeof panner.setPosition === "function") {
      panner.setPosition(x, y, z);
    }
    gain.connect(panner);
    panner.connect(master);
  } else if (typeof context.createStereoPanner === "function") {
    const panner = context.createStereoPanner();
    panner.pan.value = clamp(pan, -1, 1);
    gain.connect(panner);
    panner.connect(master);
  } else {
    gain.connect(master);
  }
  oscillator.start(start);
  oscillator.stop(stop + 0.02);
}

function playFootstep(options = {}) {
  const context = state.audio.context;
  const master = state.audio.master;
  if (!context || !master || context.state === "closed") return;
  const dash = Boolean(options.dash);
  const volume = clamp(Number(options.volume) || 1, 0, 1);
  const pan = clamp(Number(options.pan) || 0, -1, 1);
  const spatial = options.spatial || null;
  const duration = dash ? 0.22 : 0.16;
  const sampleRate = context.sampleRate;
  const buffer = context.createBuffer(1, Math.ceil(sampleRate * duration), sampleRate);
  const samples = buffer.getChannelData(0);
  let soleNoise = 0;

  for (let index = 0; index < samples.length; index += 1) {
    const time = index / sampleRate;
    const white = Math.random() * 2 - 1;
    soleNoise = soleNoise * 0.84 + white * 0.16;
    const heel = Math.exp(-time * (dash ? 34 : 46));
    const toeTime = time - (dash ? 0.078 : 0.062);
    const toe = toeTime > 0 ? Math.exp(-toeTime * (dash ? 38 : 54)) * 0.62 : 0;
    const scrapeProgress = clamp((time - 0.018) / (duration * 0.68), 0, 1);
    const scrape = Math.sin(scrapeProgress * Math.PI) * (dash ? 0.24 : 0.14);
    samples[index] = (soleNoise * 0.72 + white * 0.28) * (heel + toe + scrape);
  }

  const start = context.currentTime;
  const variation = 0.92 + Math.random() * 0.16;
  const lowSource = context.createBufferSource();
  const highSource = context.createBufferSource();
  lowSource.buffer = buffer;
  highSource.buffer = buffer;
  lowSource.playbackRate.value = variation;
  highSource.playbackRate.value = variation * 1.03;

  const impactFilter = context.createBiquadFilter();
  impactFilter.type = "lowpass";
  impactFilter.frequency.value = dash ? 1650 : 1250;
  impactFilter.Q.value = 0.7;
  const scuffFilter = context.createBiquadFilter();
  scuffFilter.type = "highpass";
  scuffFilter.frequency.value = dash ? 980 : 1250;
  scuffFilter.Q.value = 0.55;
  const impactGain = context.createGain();
  const scuffGain = context.createGain();
  const mix = context.createGain();
  impactGain.gain.value = dash ? 0.72 : 0.58;
  scuffGain.gain.value = dash ? 0.24 : 0.16;
  mix.gain.value = volume;

  lowSource.connect(impactFilter);
  impactFilter.connect(impactGain);
  impactGain.connect(mix);
  highSource.connect(scuffFilter);
  scuffFilter.connect(scuffGain);
  scuffGain.connect(mix);

  if (spatial && typeof context.createPanner === "function") {
    const panner = context.createPanner();
    panner.panningModel = "HRTF";
    panner.distanceModel = "inverse";
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 0;
    const x = Number(spatial.x) || 0;
    const y = Number(spatial.y) || 0;
    const z = Number(spatial.z) || 0;
    if (panner.positionX) {
      panner.positionX.setValueAtTime(x, start);
      panner.positionY.setValueAtTime(y, start);
      panner.positionZ.setValueAtTime(z, start);
    } else if (typeof panner.setPosition === "function") {
      panner.setPosition(x, y, z);
    }
    mix.connect(panner);
    panner.connect(master);
  } else if (typeof context.createStereoPanner === "function") {
    const panner = context.createStereoPanner();
    panner.pan.value = pan;
    mix.connect(panner);
    panner.connect(master);
  } else {
    mix.connect(master);
  }

  lowSource.start(start);
  highSource.start(start);
  const thumpFrequency = (dash ? 92 : 78) * variation;
  playTone(thumpFrequency, dash ? 42 : 48, dash ? 0.13 : 0.09, "sine", (dash ? 0.075 : 0.045) * volume, 0, pan, spatial);
}

function playSound(kind, options = {}) {
  if (state.audio.muted || isSensoryBlocked()) return;
  const context = state.audio.context;
  if (!context || context.state === "closed") return;
  if (context.state === "suspended") context.resume().catch(() => {});
  const buffered = playBufferedSfx(kind, options);
  const layeredFootstep = ["step", "dashStep", "worldStep", "worldDash"].includes(kind);
  if (buffered && !layeredFootstep) return;
  if (kind === "click") {
    playTone(420, 620, 0.045, "sine", 0.08);
  } else if (kind === "step") {
    playFootstep({ volume: 0.58, pan: (Math.random() - 0.5) * 0.08 });
  } else if (kind === "dashStep") {
    playFootstep({ dash: true, volume: 0.92, pan: (Math.random() - 0.5) * 0.1 });
  } else if (kind === "impact") {
    playTone(520, 145, 0.12, "triangle", 0.13);
    playTone(1180, 360, 0.08, "sine", 0.08, 0.018);
  } else if (kind === "select") {
    playTone(440, 554, 0.10, "triangle", 0.14);
    playTone(660, 880, 0.13, "sine", 0.10, 0.07);
  } else if (kind === "round") {
    playTone(260, 390, 0.16, "triangle", 0.12);
    playTone(390, 520, 0.18, "triangle", 0.10, 0.12);
  } else if (kind === "start") {
    [330, 440, 660].forEach((frequency, index) => playTone(frequency, frequency * 1.08, 0.15, "square", 0.08, index * 0.09));
  } else if (kind === "task") {
    [523, 659, 784].forEach((frequency, index) => playTone(frequency, frequency, 0.18, "sine", 0.13, index * 0.08));
  } else if (kind === "object") {
    const volume = clamp(Number(options.volume) || 1, 0, 1);
    [360, 540, 810].forEach((frequency, index) => playTone(frequency, frequency * 1.12, 0.16, "triangle", 0.1 * volume, index * 0.055, options.pan, options.spatial));
  } else if (kind === "meeting") {
    [620, 820, 620, 820].forEach((frequency, index) => playTone(frequency, frequency, 0.13, "square", 0.10, index * 0.11));
  } else if (kind === "alert") {
    playTone(310, 220, 0.25, "sawtooth", 0.10);
    playTone(310, 220, 0.25, "sawtooth", 0.10, 0.28);
  } else if (kind === "fighterCounter") {
    [520, 1180, 760, 1560].forEach((frequency, index) => playTone(frequency, frequency * 1.28, 0.11, index % 2 ? "square" : "triangle", 0.1, index * 0.035, options.pan, options.spatial));
  } else if (kind === "dodge") {
    playTone(860, 1380, 0.10, "sine", 0.09);
    playTone(1180, 540, 0.13, "triangle", 0.07, 0.04);
  } else if (kind === "teleport") {
    [260, 390, 620, 980].forEach((frequency, index) => playTone(frequency, frequency * 1.8, 0.16, "sine", 0.10, index * 0.035));
    playTone(1180, 180, 0.28, "triangle", 0.08, 0.10);
  } else if (kind === "kill") {
    playTone(210, 46, 0.38, "sawtooth", 0.18);
    [1320, 880, 1540, 720].forEach((frequency, index) => playTone(frequency, frequency * 0.58, 0.07, "square", 0.10, index * 0.035));
  } else if (kind === "death") {
    playTone(180, 38, 0.52, "sawtooth", 0.20);
    playTone(920, 110, 0.32, "square", 0.09, 0.03);
  } else if (kind === "gunshot") {
    const volume = clamp(Number(options.volume) || 1, 0, 1);
    const pan = clamp(Number(options.pan) || 0, -1, 1);
    const variant = options.variant || "handgun";
    if (variant === "smg") {
      [0, 0.065, 0.13].forEach((delay) => {
        playTone(220, 74, 0.11, "square", 0.18 * volume, delay, pan, options.spatial);
        playTone(1320, 180, 0.055, "sawtooth", 0.12 * volume, delay + 0.008, pan, options.spatial);
      });
    } else if (variant === "assault") {
      playTone(125, 38, 0.34, "square", 0.34 * volume, 0, pan, options.spatial);
      playTone(1180, 92, 0.12, "sawtooth", 0.25 * volume, 0.012, pan, options.spatial);
      playTone(58, 32, 0.48, "triangle", 0.18 * volume, 0.035, pan, options.spatial);
    } else if (variant === "sniper") {
      playTone(92, 24, 0.62, "square", 0.42 * volume, 0, pan, options.spatial);
      playTone(1820, 170, 0.16, "sawtooth", 0.31 * volume, 0.008, pan, options.spatial);
      playTone(46, 24, 0.86, "triangle", 0.24 * volume, 0.045, pan, options.spatial);
    } else {
      playTone(180, 48, 0.24, "square", 0.26 * volume, 0, pan, options.spatial);
      playTone(1080, 150, 0.085, "sawtooth", 0.18 * volume, 0.012, pan, options.spatial);
      playTone(78, 42, 0.34, "triangle", 0.12 * volume, 0.03, pan, options.spatial);
    }
  } else if (kind === "worldStep") {
    const volume = clamp(Number(options.volume) || 1, 0, 1);
    playFootstep({ volume: 0.78 * volume, pan: options.pan, spatial: options.spatial });
  } else if (kind === "worldDash") {
    const volume = clamp(Number(options.volume) || 1, 0, 1);
    playFootstep({ dash: true, volume, pan: options.pan, spatial: options.spatial });
  } else if (kind === "worldDrone") {
    const volume = clamp(Number(options.volume) || 1, 0, 1);
    playTone(540, 690, 0.16, "square", 0.055 * volume, 0, options.pan, options.spatial);
    playTone(1080, 820, 0.12, "sine", 0.035 * volume, 0.025, options.pan, options.spatial);
  } else if (kind === "emp") {
    const volume = clamp(Number(options.volume) || 1, 0, 1);
    playTone(72, 28, 0.72, "sine", 0.36 * volume, 0, options.pan, options.spatial);
    playTone(1480, 72, 0.30, "sawtooth", 0.25 * volume, 0.018, options.pan, options.spatial);
    [920, 1320, 680, 1540].forEach((frequency, index) => {
      playTone(frequency, frequency * 0.34, 0.09, "square", 0.14 * volume, index * 0.045, options.pan, options.spatial);
    });
  } else if (kind === "fireJutsu") {
    const volume = clamp(Number(options.volume) || 1, 0, 1);
    playTone(92, 46, 0.82, "sawtooth", 0.30 * volume, 0, options.pan, options.spatial);
    playTone(210, 980, 0.38, "triangle", 0.22 * volume, 0.035, options.pan, options.spatial);
    [640, 920, 520, 1180, 760].forEach((frequency, index) => {
      playTone(frequency, frequency * 0.58, 0.11, "square", 0.10 * volume, 0.08 + index * 0.055, options.pan, options.spatial);
    });
  } else if (kind === "substitution") {
    const volume = clamp(Number(options.volume) || 1, 0, 1);
    playTone(180, 64, 0.24, "triangle", 0.22 * volume, 0, options.pan, options.spatial);
    playTone(820, 1460, 0.16, "sine", 0.14 * volume, 0.02, options.pan, options.spatial);
    playTone(1320, 240, 0.20, "square", 0.08 * volume, 0.07, options.pan, options.spatial);
  } else if (kind === "ranking") {
    [523, 659, 784, 1047, 1319].forEach((frequency, index) => {
      playTone(frequency, frequency * 1.02, 0.25, index % 2 ? "triangle" : "sine", 0.15, index * 0.085);
    });
    playTone(196, 392, 0.62, "triangle", 0.11, 0.12);
  } else if (kind === "win") {
    [392, 523, 659, 784].forEach((frequency, index) => playTone(frequency, frequency, 0.24, "sine", 0.14, index * 0.10));
  } else if (kind === "lose") {
    [330, 247, 196].forEach((frequency, index) => playTone(frequency, frequency * 0.92, 0.30, "triangle", 0.13, index * 0.15));
  }
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => {
    els.toast.hidden = true;
  }, 3600);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || location.protocol === "file:" || /(^|\.)plicy\.net$/i.test(location.hostname)) return;
  navigator.serviceWorker.register(new URL("sw.js", document.baseURI)).catch(() => {});
}
