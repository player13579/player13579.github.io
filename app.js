const $ = (selector) => document.querySelector(selector);
const DVA_ECONOMY = globalThis.DVAEconomyCatalog;
if (!DVA_ECONOMY) throw new Error("共有商品カタログを読み込めませんでした。");
const DVA_CLIENT_RELEASE = "mana-conversion-luck-headshot-quantum-electric-v554";
const DVA_CLIENT_RELEASE_HEADER = "x-dva-client-release";
const API_BASE_URL = String(globalThis.DVA_API_BASE_URL || "").trim().replace(/\/+$/, "");
const URL_PARAMETERS = new URLSearchParams(location.search);
const PLATFORM_OVERRIDE = URL_PARAMETERS.get("platform");
const IS_VERIFICATION_MODE = URL_PARAMETERS.has("verify");
const VERIFY_REAL_SCREEN_FIXTURE_KIND = IS_VERIFICATION_MODE
  ? String(URL_PARAMETERS.get("realScreenFixture") || "")
  : "";
const IS_TRUSTED_REAL_SCREEN_FIXTURE_HOST = /^(?:localhost|127(?:\.\d{1,3}){3}|player13579\.github\.io)$/i.test(location.hostname);
const VERIFY_REAL_SCREEN_AUTO_START = Boolean(
  VERIFY_REAL_SCREEN_FIXTURE_KIND &&
  URL_PARAMETERS.get("autoStart") === "1" &&
  IS_TRUSTED_REAL_SCREEN_FIXTURE_HOST
);
if (VERIFY_REAL_SCREEN_FIXTURE_KIND) {
  document.documentElement.setAttribute("data-real-screen-fixture", VERIFY_REAL_SCREEN_FIXTURE_KIND);
}
if (VERIFY_REAL_SCREEN_AUTO_START) {
  document.documentElement.setAttribute("data-verification-frame-interval", "100");
}
const IS_PLICY = PLATFORM_OVERRIDE === "plicy" || /(^|\.)plicy\.net$/i.test(location.hostname) || /(^|\.)game\.plicy\.net$/i.test(location.hostname);
const MOVEMENT_SEND_INTERVAL_MS = 28;
const UI_RENDER_INTERVAL_MS = 0;
const IMAGE_SMOOTHING_QUALITY = "high";
const SELECTION_ARROW_REPEAT_INTERVAL_MS = 110;
const ABILITY_BATCH_HOLD_DELAY_MS = 420;
const ROOT_SHORTCUT_HOLD_DELAY_MS = 240;
const CONTINUOUS_ACTION_HOLD_DELAY_MS = 420;
const CONTINUOUS_ACTION_REPEAT_INTERVAL_MS = 220;
const SWITCH_DRAG_HOLD_DELAY_MS = 360;
const SWITCH_DRAG_MOVE_CANCEL_PX = 14;
const FIGHTER_SLASH_REPEAT_INTERVAL_MS = 620;
const TABLET_SCROLL_GESTURE_THRESHOLD_PX = 12;
const SMARTPHONE_REPAIR_STAMINA_COST = 300;
const MOVEMENT_IDLE_SESSION_ROTATE_MS = 1_500;
const ITEM_THROW_BASE_DISTANCE_CLIENT = 220;
const ITEM_THROW_MAX_CHARGE_MS_CLIENT = 3_000;
const ITEM_THROW_TARGET_CURSOR_SPEED = 900;
const CLAIRVOYANCE_ZOOM = 0.65;
const MARKER_EXPLANATION_DURATION_MS = 1_450;
const ENHANCE_HOLD_STEP_MS_CLIENT = 600;
const ENHANCE_MAX_LEVEL_CLIENT = 1;
const GBO_HOLD_MS_CLIENT = 3_000;

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
  titleCommandTransitionAte: $("#titleCommandTransitionAte"),
  titleCommandPixelField: $("#titleCommandPixelField"),
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
  gameTacticsButton: $("#gameTacticsButton"),
  titleHomeButton: $("#titleHomeButton"),
  tacticsPanel: $("#tacticsPanel"),
  tacticsBackButton: $("#tacticsBackButton"),
  tacticsChapterList: $("#tacticsChapterList"),
  tacticsContent: $("#tacticsContent"),
  tacticsNovelStage: $("#tacticsNovelStage"),
  tacticsNovelCanvas: $("#tacticsNovelCanvas"),
  tacticsNovelChapter: $("#tacticsNovelChapter"),
  tacticsNovelProgress: $("#tacticsNovelProgress"),
  tacticsNovelSpeakerRole: $("#tacticsNovelSpeakerRole"),
  tacticsNovelSpeaker: $("#tacticsNovelSpeaker"),
  tacticsNovelText: $("#tacticsNovelText"),
  tacticsNovelRestart: $("#tacticsNovelRestart"),
  tacticsNovelPrev: $("#tacticsNovelPrev"),
  tacticsNovelAuto: $("#tacticsNovelAuto"),
  tacticsNovelNext: $("#tacticsNovelNext"),
  soloTrainingProgress: $("#soloTrainingProgress"),
  soloMissionGrid: $("#soloMissionGrid"),
  canvas: $("#gameCanvas"),
  killCameraOverlay: $("#killCameraOverlay"),
  killCameraTitle: $("#killCameraTitle"),
  killCameraKiller: $("#killCameraKiller"),
  killCameraAction: $("#killCameraAction"),
  killCameraLogicRow: $("#killCameraLogicRow"),
  killCameraLogic: $("#killCameraLogic"),
  killCameraCloseButton: $("#killCameraCloseButton"),
  actionCommandRegistry: $("#actionCommandRegistry"),
  fieldLowerRow: $("#fieldLowerRow"),
  tabletButton: $("#tabletButton"),
  tabletPanel: $("#tabletPanel"),
  tabletJoystickZone: $("#tabletJoystickZone"),
  tabletJoystick: $("#tabletJoystick"),
  tabletJoystickKnob: $("#tabletJoystickKnob"),
  tabletQuickActions: $("#tabletQuickActions"),
  tabletNinjutsuShortcut: $("#tabletNinjutsuShortcut"),
  tabletContextShortcut: $("#tabletContextShortcut"),
  tabletAbilityShortcut: $("#tabletAbilityShortcut"),
  tabletShootShortcut: $("#tabletShootShortcut"),
  tabletEmpShortcut: $("#tabletEmpShortcut"),
  tabletManaConversionShortcut: $("#tabletManaConversionShortcut"),
  tabletClairvoyanceShortcut: $("#tabletClairvoyanceShortcut"),
  tabletVendingShortcut: $("#tabletVendingShortcut"),
  tabletDodgeShortcut: $("#tabletDodgeShortcut"),
  tabletJumpShortcut: $("#tabletJumpShortcut"),
  tabletRenkiShortcut: $("#tabletRenkiShortcut"),
  tabletRestShortcut: $("#tabletRestShortcut"),
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
  inventoryItemDetail: $("#inventoryItemDetail"),
  inventoryItemDetailName: $("#inventoryItemDetailName"),
  inventoryItemDetailType: $("#inventoryItemDetailType"),
  inventoryItemDetailDescription: $("#inventoryItemDetailDescription"),
  switchDragMenu: $("#switchDragMenu"),
  switchDragTitle: $("#switchDragTitle"),
  switchDragOptions: $("#switchDragOptions"),
  itemUseButton: $("#itemUseButton"),
  itemThrowButton: $("#itemThrowButton"),
  enhanceReadout: $("#enhanceReadout"),
  transferTargetSelect: $("#transferTargetSelect"),
  transferCreditsAmount: $("#transferCreditsAmount"),
  transferItemButton: $("#transferItemButton"),
  transferCreditsButton: $("#transferCreditsButton"),
  nameInput: $("#nameInput"),
  namePolicy: $("#namePolicy"),
  skinSelect: $("#skinSelect"),
  mapSelect: $("#mapSelect"),
  matchmakingButton: $("#matchmakingButton"),
  analyticsPanel: $("#analyticsPanel"),
  analyticsToggleButton: $("#analyticsToggleButton"),
  selectTimer: $("#selectTimer"),
  selectTeamText: $("#selectTeamText"),
  offlineTeamChoice: $("#offlineTeamChoice"),
  offlineDefenderButton: $("#offlineDefenderButton"),
  offlineAttackerButton: $("#offlineAttackerButton"),
  operatorList: $("#operatorList"),
  operatorDetail: $("#operatorDetail"),
  debugForceEndButton: $("#debugForceEndButton"),
  leaveRoomButton: $("#leaveRoomButton"),
  operatorReselectButton: $("#operatorReselectButton"),
  roleName: $("#roleName"),
  specialName: $("#specialName"),
  movementAccControl: $("#movementAccControl"),
  movementAccToggleButton: $("#movementAccToggleButton"),
  manaConversionControl: $("#manaConversionControl"),
  manaConversionModeSelect: $("#manaConversionModeSelect"),
  manaConversionButton: $("#manaConversionButton"),
  objectiveText: $("#objectiveText"),
  sabotageAlert: $("#sabotageAlert"),
  ninjutsuButton: $("#ninjutsuButton"),
  shootButton: $("#shootButton"),
  weaponButton: $("#weaponButton"),
  dodgeButton: $("#dodgeButton"),
  teleportButton: $("#teleportButton"),
  teleportControl: $("#teleportControl"),
  teleportModeSelect: $("#teleportModeSelect"),
  abilityCascadeSelects: $("#abilityCascadeSelects"),
  rootAbilityBranchControl: $("#rootAbilityBranchControl"),
  rootAbilityBranchSelect: $("#rootAbilityBranchSelect"),
  quantumKineticBranchControl: $("#quantumKineticBranchControl"),
  quantumKineticBranchSelect: $("#quantumKineticBranchSelect"),
  abilityAutoActivateControl: $("#abilityAutoActivateControl"),
  abilityAutoActivateToggle: $("#abilityAutoActivateToggle"),
  teleportModeDescription: $("#teleportModeDescription"),
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
  vendingButton: $("#vendingButton"),
  healButton: $("#healButton"),
  alchemyButton: $("#alchemyButton"),
  alchemyControl: $("#alchemyControl"),
  alchemyChoiceGrid: $("#alchemyChoiceGrid"),
  alchemySelectionText: $("#alchemySelectionText"),
  alchemySelect: $("#alchemySelect"),
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
  hackerTargetSelect: $("#hackerTargetSelect"),
  hackerCategoryPreviousButton: $("#hackerCategoryPreviousButton"),
  hackerCategoryNextButton: $("#hackerCategoryNextButton"),
  hackerCategoryLabel: $("#hackerCategoryLabel"),
  gunnerReloadButton: $("#gunnerReloadButton"),
  vendingPanel: $("#vendingPanel"),
  vendingBulkPurchase: $("#vendingBulkPurchase"),
  vendingCategoryPreviousButton: $("#vendingCategoryPreviousButton"),
  vendingCategoryNextButton: $("#vendingCategoryNextButton"),
  vendingCategoryLabel: $("#vendingCategoryLabel"),
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

// Fixed overlays must not remain inside animated panels: even an identity
// transform makes position:fixed use that panel as its containing block.
for (const overlay of [els.inventoryItemDetail]) {
  if (overlay && overlay.parentElement !== document.body) document.body.append(overlay);
}

// Keep the field canvas synchronized with the compositor. A desynchronized
// context can expose the cleared or partially drawn frame while prop-heavy
// scenes are still being painted, which presents as a full-field flash.
const ctx = els.canvas.getContext("2d", { alpha: false });
const mapCtx = els.expandedMapCanvas.getContext("2d");
const CAMERA_ZOOM = 1.65;
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
  map: "dva_map",
  debugForceEnd: "dva_debug_force_end",
  musicMuted: "dva_music_muted",
  gameMuted: "dva_game_muted",
  clientId: "dva_client_id",
  soloMissions: "dva_solo_missions_v1",
  analyticsDisabled: "dva_analytics_disabled",
  analyticsQueue: "dva_analytics_queue_v1",
  developerIdentity: "dva_developer_identity_v1",
  tabletMode: "dva_tablet_mode",
  abilityAutoActivate: "dva_ability_auto_activate_v1"
};
storage.cpuGravityHint = "dva_cpu_gravity_hint";
storage.offlineSession = "dva_offline_session_v528";
if (VERIFY_REAL_SCREEN_AUTO_START) {
  // A Pages verification origin is reused across exact routes. Discard only
  // the previous match identity before state is constructed so its poll cannot
  // race the next fixture's deterministic offline session.
  localStorage.removeItem(storage.room);
  localStorage.removeItem(storage.player);
  localStorage.removeItem(storage.offlineSession);
}

const GUNNER_WEAPON_MOTION_IDS = Object.freeze(["handgun", "smg", "assault", "sniper", "taser"]);
// Texture construction runs while the main state object is initialized, so this
// asset-key list must exist before createTextures() is called.
const PHYSICAL_ACTION_MOTION_KINDS = Object.freeze([
  "attack", "slash", "shoot", "reload", "evade", "cast", "heal",
  "power", "heart-transfer", "focus", "rest", "interact", "jump", "throw"
]);
const HACKER_ROOT_OPERATOR_TYPES = Object.freeze(["fighter", "gravity", "flora", "gunner", "quantum"]);
const HACKER_ROOT_OPERATOR_LABELS = Object.freeze({
  fighter: "ファイター",
  gravity: "グラビティ",
  flora: "フローラ",
  gunner: "ガンナー",
  quantum: "クオンタム"
});
const QUANTUM_ABILITY_MODE_OPTIONS = Object.freeze([
  ["quantum-kinetic", "運動エネルギー制御"],
  ["electric-discharge", "エレクトリック"],
  ["nuclear-transmutation", "核変換"],
  ["nuclear-fission", "核分裂"],
  ["nuclear-fusion", "核融合"]
]);
const QUANTUM_KINETIC_MODE_OPTIONS = Object.freeze([
  ["kinetic-accelerate", "加速"],
  ["kinetic-decelerate", "減速"]
]);
const MATCHMAKING_MAP_IDS = Object.freeze(["station", "outpost"]);

function normalizeMatchmakingMapId(value) {
  const mapId = String(value || "").trim();
  return MATCHMAKING_MAP_IDS.includes(mapId) ? mapId : "station";
}
const OPERATOR_ABILITY_MODE_OPTIONS = Object.freeze({
  fighter: Object.freeze([["limit-break", "リミットブレイク"]]),
  teleport: Object.freeze([["near", "転移・対象付近"], ["target", "対象転移"], ["heart", "心臓"], ["accelerate", "アクセラレート"], ["decelerate", "ディーセラレート"], ["time-keeper", "時の番人"], ["storm", "グラビティストーム"]]),
  gravity: Object.freeze([["near", "転移・対象付近"], ["target", "対象転移"], ["heart", "心臓"], ["accelerate", "アクセラレート"], ["decelerate", "ディーセラレート"], ["time-keeper", "時の番人"], ["storm", "グラビティストーム"]]),
  flora: Object.freeze([["heal", "回復"], ["sunbeam", "サンビーム"], ["invisible", "インビジブル"]]),
  quantum: QUANTUM_ABILITY_MODE_OPTIONS
});

const state = {
  screen: "title",
  tacticsReturnScreen: "title",
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
  focusResyncSerial: 0,
  foregroundRecovery: { inFlight: false, queued: false },
  pollInFlight: false,
  // Every async room response is tied to this client-side ownership generation.
  // A visibility restore can replace an expired generated-offline room while an
  // older poll is still in flight; that older response must never clear or
  // overwrite the replacement session.
  roomSessionGeneration: 1,
  backgroundResume: { serial: 0, inFlight: false, queued: false },
  rejectedActionRecovery: { inFlight: false, queued: false },
  manaConversionInFlight: false,
  manaConversionModeInFlight: false,
  pendingManaConversionMode: "",
  pendingManaConversionTransactionId: "",
  realtime: null,
  movementQueue: null,
  frameDriver: null,
  lastStateServerNow: 0,
  lastStateReceivedAt: 0,
  toastTimer: null,
  inventoryItemDetailTimer: null,
  inventoryItemDetailSource: null,
  switchDrag: {
    pointerId: null,
    source: null,
    timer: 0,
    opened: false,
    persistent: false,
    hover: null,
    operatorHover: null,
    hierarchical: false,
    hierarchicalStage: "operator",
    branchOperatorIndex: -1,
    branchOptions: [],
    finalChoice: null,
    options: [],
    startX: 0,
    startY: 0,
    suppressClickUntil: new WeakMap()
  },
  nativeSelectHold: {
    pointerId: null,
    source: null,
    timer: 0,
    startedAt: 0,
    startX: 0,
    startY: 0,
    opened: false,
    branchMode: false,
    suppressClickUntil: new WeakMap()
  },
  mysteryRevealTimer: null,
  titleArrivalTimer: null,
  fieldFeedOpen: false,
  lastRoomChatId: "",
  lastRoomChatRoomId: "",
  chatNotificationTimer: null,
  verificationEnemyBotBaseline: null,
  verificationPreparationBarrierSeen: false,
  verificationPreparationBarrierReleased: false,
  matchmakingInFlight: false,
  matchmakingSerial: 0,
  matchmakingTicket: null,
  offlineTeamChoiceInFlight: false,
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
  dismissedKillCameraId: "",
  hitEffects: [],
  magicEffects: [],
  headMarkerSlots: new Map(),
  headMarkerPresentationCache: new Map(),
  headMarkerPresentationFrame: -1,
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
  abilityBatchHold: { pointerId: null, button: null, timer: 0, held: false, holdId: "", action: null, startPromise: null },
  abilityBatchKeyHold: { code: "", button: null, timer: 0, held: false, holdId: "", action: null, startPromise: null },
  rootShortcutHold: { pointerId: null, button: null, timer: 0 },
  rootShortcutKeyHold: { code: "", button: null, timer: 0 },
  continuousActionHold: { pointerId: null, button: null, timer: 0, fighterSlash: false },
  continuousActionKeyHold: { code: "", repeat: null, timer: 0, repeatInterval: 0, fighterSlash: false },
  continuousActionSuppressClicks: new WeakMap(),
  continuousActionKeyAt: new Map(),
  fighterSlashGuardIntent: false,
  fighterSlashPendingRequests: new Set(),
  selectedWeaponItemId: "",
  explicitInventoryItemId: "",
  implicitHsgInventoryFallback: false,
  enhanceHold: { kind: "", chargeKind: "", pointerId: null, startedAt: 0, timer: 0, itemId: "", chargeId: "" },
  throwTargeting: {
    active: false,
    itemId: "",
    holdMs: 0,
    chargeId: "",
    targetX: 0,
    targetY: 0,
    startedAt: 0,
    lastFrameAt: 0,
    frame: 0,
    directionKeys: new Set()
  },
  clairvoyance: {
    active: false,
    x: 0,
    y: 0,
    lastFrameAt: 0,
    frame: 0,
    serverDesired: false,
    requestPending: false,
    requestSerial: 0
  },
  clairvoyanceTeleportTap: null,
  clairvoyanceTeleportRequestSerial: 0,
  markerHitTargets: [],
  markerExplanation: null,
  operatorBranchesOpen: false,
  operatorBranchType: "",
  borrowedOperatorType: "",
  borrowedAbilityModes: { fighter: "limit-break", gravity: "accelerate", flora: "heal", quantum: "nuclear-transmutation" },
  quantumAbilityMode: "nuclear-transmutation",
  quantumKineticModes: { native: "kinetic-accelerate", borrowed: "kinetic-accelerate" },
  quantumModePlayerId: "",
  quantumKineticHold: { pointerId: null, source: null, timer: 0, opened: false, cancelled: false, startX: 0, startY: 0, selected: "", borrowed: false },
  quantumSelectStage: "ability",
  quantumOperatorBranchStage: "ability",
  rootAbilitySelectStage: "operator",
  rootAbilitySelectWasActive: false,
  abilityAutoActivate: localStorage.getItem(storage.abilityAutoActivate) !== "0",
  arrowRepeatKey: "",
  arrowRepeatAt: 0,
  keybindOpen: false,
  teleportTargeting: false,
  teleportBorrowed: false,
  teleportTargetId: "",
  teleportTargetMode: "body",
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
  gunActivationPending: false,
  operatorRenderKey: "",
  operatorDetailTimer: 0,
  operatorDetailSource: null,
  resultCelebrationKey: "",
  resultBoardFingerprint: "",
  mapPointer: null,
  expandedMapTap: null,
  actionSelectionId: "",
  hackerSelectedRecipeId: "",
  hackerSelectedByCategory: Object.create(null),
  hackerCategoryId: "generate-supply",
  hackerDockVisible: false,
  hackerGenerationInFlight: false,
  hackerCooldownWakeTimer: 0,
  hackerCooldownWakeAt: 0,
  activeScrollRegion: null,
  expandedScrollRegion: null,
  blankPaneTap: null,
  keyboardContext: "",
  keyboardElement: null,
  debugForceEndEnabled: localStorage.getItem(storage.debugForceEnd) === "1",
  checkpointSeen: new Set(),
  analyticsExitReported: false,
  analyticsFlushInFlight: false,
  offlineClient: null,
  offlineMode: localStorage.getItem(storage.offlineSession) === "1",
  onlineAvailable: false,
  onlineAvailabilityChecked: false,
  onlineAvailabilityCheckInFlight: false,
  startupFullscreenPending: false,
  tacticsChapterId: "tactics-basics",
  tacticsNovelIndex: 0,
  tacticsNovelAuto: false,
  tacticsNovelSceneChangedAt: 0,
  tacticsNovelFrame: 0,
  tacticsNovelPointer: null,
  tacticsNovelSuppressClickUntil: 0,
  phaseUiKey: "",
  actionLayoutKey: "",
  activeEffectsRenderKey: "",
  inventoryVisualWeapon: "",
  vendingOpen: false,
  vendingBulkPurchase: false,
  vendingRenderKey: "",
  vendingCategoryId: "generate-supply",
  vendingSelectedByCategory: Object.create(null),
  itemRenderKey: "",
  utilityRenderKey: "",
  lastCanvasStageError: "",
  lastCanvasItemError: "",
  lastUiRenderAt: 0,
  uiRenderTimer: 0,
  drawViewport: null,
  minimapFrameCache: null,
  minimapLastDrawAt: 0,
  audio: {
    context: null,
    master: null,
    compressor: null,
    sfxBuffers: new Map(),
    sfxLoading: null,
    sfxCursor: new Map(),
    unlocked: false,
    muted: IS_VERIFICATION_MODE || localStorage.getItem(storage.gameMuted) !== "0",
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

function playerFacingRoleLabel(role) {
  return Object.hasOwn(roleLabels, role) ? roleLabels[role] : roleLabels.unknown;
}

function onlineApiHeaders(headers = {}) {
  return { ...headers, [DVA_CLIENT_RELEASE_HEADER]: DVA_CLIENT_RELEASE };
}

const specialLabels = {
  fighter: "ファイター"
};

specialLabels.teleport = "グラビティ";
specialLabels.gunner = "ガンナー";
specialLabels.flora = "フローラ";
specialLabels.alchemist = "ハッカー";
specialLabels.quantum = "クオンタム";
specialLabels.assassin = "アサシン";

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
  "mineral-water": "通常使用: 自分の燃焼解除・SP+100。投擲: 着地点半径135の全員へ同効果。瓶片は確率ダメージ",
  seawater: "重水素を含む海水。通常使用は自分の燃焼解除、投擲は着地点へ消火水域を作る。クオンタムの運動エネルギー制御で高温水または氷へ変換でき、終盤は2MPの核融合にも使える",
  antidote: "通常使用: 自分の毒解除。投擲: 着地点半径120の全員へ同効果。瓶片は確率ダメージ",
  molotov: "通常使用は自分を燃焼。投擲は着地点周囲を継続燃焼し、瓶片が確率ダメージ。Enhanceは強度・範囲のみ強化",
  evade: "回避受付+0.25秒（累積上限+1.50秒）。回避自体は200SPを消費",
  speed: "加速+0.15（累積）。移動・物理モーション・クールタイム・行動不能・タスク速度へ適用",
  warp: "獲得時に即席をテレポート権利1回へ変換（最大3回）。任意のタイミングで拡大マップを開き、地点を選ぶと1回消費",
  mystery: "幸運／直観補正つき抽選: 6C／SP+250／完全活性／理知化／12秒減速／15秒能力封印／8秒意識消失",
  fire: "1回分を獲得（最大2回）。周囲を継続燃焼。Enhanceは強度・範囲のみ強化",
  substitution: "1回分を獲得（最大2回）。次の攻撃を無効化して転移。理知中のみ発動",
  grit: "1回分を獲得。次の確殺をボディダメージ化。理知中のみ発動",
  heal: "負傷時はHPを2まで全回復。無傷時はオーバーヒール+1",
  reason: "1回分を獲得。次の攻撃対象のバリアを全削除し、削除1回につき自分へ0.5ダメージ。理知中のみ発動",
  mana: "MP+1",
  stamina: "取得時に即席でSP+350。物理所持品には残らない",
  railgun: "使用: 使い切り。全遮蔽物を貫通する直線射撃で、命中時は確殺（破壊・死体あり）。投擲被弾: 対象の幸運で与ダメージ0.10〜0.60。接地後は実体が残り、誰でも拾える",
  "particle-cannon": "使用: 使い切り。6秒間、0.30秒間隔で照準操作できる貫通ビームを放射し、経路上の全対象は命中時に確殺（破壊・死体あり）。投擲被弾: 対象の幸運で与ダメージ0.10〜0.60。接地後は実体が残り、誰でも拾える",
  excalibur: "使用: 使い切り。前方半面の全対象を確殺（破壊・死体あり）。アタッカー勝利確定時を除き、使用者も確殺（破壊・死体あり）。投擲被弾: 対象の幸運で与ダメージ0.10〜0.60。接地後は実体が残り、誰でも拾える",
  exile: "遠隔クローン操作を解禁。全域破壊時はクローン位置へ本体を退避",
  hack: "取得時に即席で全生存者の位置表示効果へ変換。EMPストレージ遮断中は停止し、解除後に復帰。物理所持品には残らない",
  handgun: "タップで現在の1弾倉（最大12発）を空まで射撃。射程520・通常与ダメージ0.48（最遠0.31）・0.38秒間隔。600〜2999msの単一Enhanceは0.58（最遠0.37）・固定1MP。HSは射手の幸運で腰撃ち2〜34%、エイム中49〜81%。投擲被弾は幸運で0.08〜0.36、接地後は誰でも拾える",
  smg: "タップで現在の1弾倉（最大30発）を空まで射撃。射程460・通常与ダメージ0.42（最遠0.12）・0.10秒間隔。600〜2999msの単一Enhanceは0.50（最遠0.14）・固定1MP。HSは射手の幸運で腰撃ち2〜34%、エイム中49〜81%。投擲被弾は幸運で0.08〜0.36、接地後は誰でも拾える",
  assault: "タップで現在の1弾倉（最大18発）を空まで射撃。射程760・通常与ダメージ0.58（最遠0.46）・0.24秒間隔。600〜2999msの単一Enhanceは0.70（最遠0.55）・固定1MP。HSは射手の幸運で腰撃ち2〜34%、エイム中49〜81%。投擲被弾は幸運で0.08〜0.36、接地後は誰でも拾える",
  sniper: "タップで現在の1弾倉（最大5発）を空まで射撃。射程1200・通常与ダメージ1.35（距離減衰なし）・1.10秒間隔。600〜2999msの単一Enhanceは与ダメージ1.62・固定1MP。固有の確殺なし。HSは射手の幸運で腰撃ち2〜34%、エイム中49〜81%。投擲被弾は幸運で0.08〜0.36、接地後は誰でも拾える",
  taser: "タップで現在の1弾倉（最大8発）を空まで射撃。射程420・通常与ダメージ0.16（最遠0.12）・0.72秒間隔。600〜2999msの単一Enhanceは0.19（最遠0.14）・固定1MP。HSは射手の幸運で腰撃ち2〜34%、エイム中49〜81%。命中対象を6秒間35%減速。投擲被弾は幸運で0.08〜0.36、接地後は誰でも拾える",
  mercury: "通常使用は自分へ毒。投擲は着地点周囲へ毒と瓶片ダメージ。クオンタムで金へ核変換し、取得時に100Cへ即時換金",
  lead: "通常使用は自分へ毒。投擲は着地点周囲へ毒と瓶片ダメージ。クオンタムで金へ核変換し、取得時に100Cへ即時換金",
  uranium: "投擲時に空中で容器が開く放射性物質。通常使用は自分へ強毒。投擲は内容物を散布して容器を破壊するため接地回収物を残さない。クオンタムは2MPで核分裂し全域を破壊して死体を残す",
  plutonium: "投擲時に空中で容器が開く放射性物質。通常使用は自分へ強毒。投擲は内容物を散布して容器を破壊するため接地回収物を残さない。クオンタムは2MPで核分裂し全域を破壊して死体を残す",
  "orichalcum-sword": "物理武器。直接斬撃は確殺（死体あり）。斬る: 150SP・CTなし。700ms物理ガード、先頭140msのJGで衝撃を100%反射。EMP・毒・サンビーム等は通常ガード不可。投擲被弾は幸運で柄・腹なら0.12〜0.51、運悪く刃なら確殺。接地後は誰でも拾える。EC・衝撃波・EC milestone はファイター能力であり、この剣の効果ではない",
  hsg: "Storageへ入る物理HSG。通常使用と床外へ進む直前の自動起動は1MPで即8秒・ACC 1.8。600〜2999ms長押しは総コスト固定1MPのEnhance、3000ms以上は総コスト固定2MPのGBOとして即80秒・ACC 18で起動しHSG 1個を破壊。全所持者が使え、理知を要しない。MP不足時は発動せず、通常投擲は接地後に回収でき、譲渡・死亡時戦利品移動も可能。最後の浮揚が床のない場所で終了すると落下死。起動中・20秒CT中は使用不可",
  iai: "獲得時に即席として自動装備。次の成功した攻撃を破壊（死体あり）へ強化して1回分を自動消費。失敗・回避・ガード・準備バリア・非攻撃では消費せず、既に消滅する攻撃は死体なしのまま",
  ice: "通常使用は自分へ低温ダメージ・減速。投擲は着地点周囲へ低温攻撃と瓶片ダメージ",
  "heated-water": "通常使用は自分を燃焼。投擲は着地点周囲を燃焼し、瓶片が確率ダメージ",
  gold: "ROOTハッカー限定の即席生成。取得時に純金インゴットを100Cへ即時換金し、物理所持品には残らない",
  rpg: "使用: 使い切り。半径300以内にいる自分以外の全員へ与ダメージ1.00の物理攻撃。投擲被弾: 対象の幸運で与ダメージ0.10〜0.60。接地後は誰でも拾える",
  missile: "使用: 使い切り。最寄りの自分以外1人へ確殺の物理攻撃（HS・死体あり）。投擲被弾: 対象の幸運で与ダメージ0.10〜0.60。接地後は誰でも拾える"
});

const VENDING_PRODUCT_LABELS = DVA_ECONOMY.productLabels;
const VENDING_PRODUCT_COSTS = DVA_ECONOMY.productCosts;

const alchemyRecipes = [
  ...DVA_ECONOMY.products.map((product) => ({
    id: product.hackerRecipeId,
    productId: product.id,
    label: product.label,
    output: VENDING_PRODUCT_DESCRIPTIONS[product.id] || "自販機と同期した共有商品を生成します。",
    asset: product.asset,
    hackerAccess: product.hackerAccess
  })),
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
  { id: "invention-excalibur", label: "エクスカリバー", output: VENDING_PRODUCT_DESCRIPTIONS.excalibur, kind: "invention", inventoryId: "excalibur" },
  { id: "invention-railgun", label: "レールガン", output: VENDING_PRODUCT_DESCRIPTIONS.railgun, kind: "invention", inventoryId: "railgun" },
  { id: "invention-particle-cannon", label: "荷電粒子砲", output: VENDING_PRODUCT_DESCRIPTIONS["particle-cannon"], kind: "invention", inventoryId: "particle-cannon" }
];

const HACKER_EXTENSION_COOLDOWN_MS = Object.freeze({
  "hack-credits-delete": 60_000,
  "hack-credits-duplicate": 90_000,
  "hack-items-delete": 75_000,
  "hack-items-duplicate": 105_000,
  "hack-hp-delete": 120_000,
  "hack-hp-duplicate": 60_000,
  "hack-mana-delete": 60_000,
  "hack-mana-duplicate": 90_000,
  "hack-status-recover": 36_000,
  revive: 120_000
});

function hackerRecipeCooldownMs(recipeOrId) {
  const id = typeof recipeOrId === "string" ? recipeOrId : String(recipeOrId?.id || "");
  return DVA_ECONOMY.cooldownForRecipe(id) || HACKER_EXTENSION_COOLDOWN_MS[id] || (id.startsWith("object-") ? 30_000 : 36_000);
}

function hackerRecipePresentation(recipe) {
  return String(recipe?.output || "").trim();
}

function hackerRecipeCooldownLabel(recipe) {
  return `CT ${Math.round(hackerRecipeCooldownMs(recipe) / 1000)}秒`;
}

function hackerRecipeNameMarkup(recipe) {
  return `<strong>${escapeHtml(recipe.label)}</strong><small class="item-name-meta">${escapeHtml(hackerRecipeCooldownLabel(recipe))}</small>`;
}

const GENERATED_ITEM_TEXTURE_CACHE_VERSION = "mana-conversion-luck-headshot-quantum-electric-v554";

const generatedItemTextureFiles = new Map([
  ["gold", { file: "item-gold-ingot-v436.png" }],
  ["mercury", { file: "item-mercury.webp" }],
  ["quantum-mercury", { file: "item-mercury.webp" }],
  ["lead", { file: "item-lead.webp" }],
  ["quantum-lead", { file: "item-lead.webp" }],
  ["uranium", { file: "item-uranium.webp" }],
  ["quantum-uranium", { file: "item-uranium.webp" }],
  ["plutonium", { file: "item-plutonium.webp" }],
  ["quantum-plutonium", { file: "item-plutonium.webp" }],
  ["seawater", { file: "item-seawater-v522.png" }],
  ["mineral-water", { file: "item-mineral-water.webp" }],
  ["antidote", { file: "item-antidote.webp" }],
  ["molotov", { file: "item-molotov.webp" }],
  ["ice", { file: "item-ice.webp" }],
  ["heated-water", { file: "item-heated-water.webp" }],
  ["orichalcum-sword", { file: "item-orichalcum-sword-v453.png" }],
  ["hsg", { file: "item-hsg-v486.png" }],
  ["iai", { file: "instant-iai-abstract-v451.png" }],
  ["stamina", { file: "alchemy-effect-stamina-v311.png" }],
  ["heal", { file: "alchemy-effect-heal-v311.png" }],
  ["fire", { file: "item-fire-scroll-v540.png" }],
  ["fire-jutsu", { file: "item-fire-scroll-v540.png" }],
  ["substitution", { file: "alchemy-effect-substitution-v311.png" }],
  ["warp", { file: "item-teleport-map-scroll-v495.png" }],
  ["instant-warp", { file: "item-teleport-map-scroll-v495.png" }],
  ["instant-evade", { file: "action-effect-dodge-v311.png" }],
  ["instant-speed", { file: "status-marker-acceleration-v376.png" }],
  ["instant-mystery", { file: "philosophy-effect-mystery-v311.png" }],
  ["grit", { file: "philosophy-effect-stand-v311.png" }],
  ["reason", { file: "philosophy-effect-push-v311.png" }],
  ["mana", { file: "alchemy-effect-rational-free-v311.png" }],
  ["railgun", { file: "alchemy-railgun.webp" }],
  ["particle-cannon", { file: "alchemy-particle-cannon.webp" }],
  ["excalibur", { file: "alchemy-excalibur.webp" }],
  ["exile", { file: "exile-clone.webp" }],
  ["hack", { file: "operator-hacker-ate-v391.png" }],
  ["handgun", { file: "gunner-weapon-icons-v422.webp", size: "400% 100%", position: "0 0" }],
  ["smg", { file: "gunner-weapon-icons-v422.webp", size: "400% 100%", position: "33.333% 0" }],
  ["assault", { file: "gunner-weapon-icons-v422.webp", size: "400% 100%", position: "66.667% 0" }],
  ["sniper", { file: "gunner-weapon-icons-v422.webp", size: "400% 100%", position: "100% 0" }],
  ["taser", { file: "gunner-taser.webp" }],
  ["rpg", { file: "gunner-rpg.webp" }],
  ["missile", { file: "gunner-missile.webp" }],
  ["gunner-special-ammo-weak", { file: "gunner-special-ammo-weak-v455.png" }],
  ["gunner-special-ammo-penetrate", { file: "gunner-special-ammo-penetrate-v455.png" }],
  ["gunner-special-ammo-shock", { file: "gunner-special-ammo-shock-v455.png" }],
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

// Keep one semantic URL per generated icon.  State polling intentionally calls
// the render helpers often; replacing an identical CSS background on every
// pass made some browsers briefly repaint the action-surface fallback.
const generatedItemTexturePreloads = new Map();

function preloadGeneratedItemTexture(imageUrl) {
  if (!imageUrl || generatedItemTexturePreloads.has(imageUrl)) return;
  const image = new Image();
  image.decoding = "async";
  image.src = imageUrl;
  generatedItemTexturePreloads.set(imageUrl, image);
}

function applyGeneratedItemTexture(button, itemId) {
  const normalizedId = String(itemId || "").replace(/^(?:vending-|weapon:|invention:|heavy:)/, "");
  const texture = generatedItemTextureFiles.get(normalizedId);
  if (!texture) return false;
  const icon = button?.querySelector?.(".alchemy-choice-icon, .vending-item-icon");
  if (!icon) return false;
  const base = texture.file.startsWith("room-") || texture.file.startsWith("facility-")
    ? "assets/"
    : "assets/generated/";
  const imageUrl = assetUrl(`${base}${texture.file}?v=${GENERATED_ITEM_TEXTURE_CACHE_VERSION}`);
  const position = texture.position || "center";
  const size = texture.size || "contain";
  const binding = `${normalizedId}|${imageUrl}|${position}|${size}`;
  if (icon.dataset.generatedTextureBinding === binding) return true;
  preloadGeneratedItemTexture(imageUrl);
  icon.classList.add("generated-item-texture-visible");
  icon.dataset.generatedTexture = normalizedId;
  icon.dataset.generatedTextureBinding = binding;
  icon.style.setProperty("--generated-item-texture", `url("${imageUrl}")`);
  icon.style.setProperty("--generated-item-position", position);
  icon.style.setProperty("--generated-item-size", size);
  icon.style.backgroundImage = `url("${imageUrl}")`;
  icon.style.backgroundPosition = position;
  icon.style.backgroundSize = size;
  icon.style.backgroundRepeat = "no-repeat";
  return true;
}

alchemyRecipes.push(
  { id: "borrowed-fighter", label: "ファイター", output: "root借用中", kind: "borrowed", inventoryId: "fighter" },
  { id: "borrowed-gravity", label: "グラビティ", output: "root借用中", kind: "borrowed", inventoryId: "gravity" },
  { id: "borrowed-flora", label: "フローラ", output: "root借用中", kind: "borrowed", inventoryId: "flora" },
  { id: "borrowed-gunner", label: "ガンナー", output: "root借用中", kind: "borrowed", inventoryId: "gunner" },
  { id: "borrowed-quantum", label: "クオンタム", output: "root借用中", kind: "borrowed", inventoryId: "quantum" }
);

const hackerRecipeCategories = [
  ...DVA_ECONOMY.categories.map(({ id, label }) => ({ id, label })),
  { id: "hack", label: "対象操作" }
];

function hackerRecipeCategory(recipe) {
  if (recipe?.kind === "invention") return "weapon";
  if (recipe?.id?.startsWith("hack-")) return "hack";
  return DVA_ECONOMY.productForRecipe(recipe?.id)?.category || (["stamina", "revive"].includes(recipe?.id) ? "instant-item" : "generate-supply");
}

function vendingProductCategory(itemId) {
  return DVA_ECONOMY.categoryForProduct(itemId);
}

function vendingProductButtons() {
  return [...els.vendingPanel.querySelectorAll("[data-drink]")];
}

function ensureDynamicVendingChoices() {
  const grid = els.vendingPanel.querySelector(".vending-grid");
  if (!grid) return;
  const catalogIds = new Set(DVA_ECONOMY.products.map((product) => product.id));
  for (const button of vendingProductButtons()) {
    if (!catalogIds.has(button.dataset.drink)) button.remove();
  }
  for (const product of DVA_ECONOMY.products) {
    let button = grid.querySelector(`[data-drink="${CSS.escape(product.id)}"]`);
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "vending-item-with-icon";
      button.innerHTML = '<span class="vending-item-icon" aria-hidden="true"></span><span></span>';
      grid.append(button);
    }
    button.dataset.drink = product.id;
    button.dataset.vendingAsset = product.asset;
    button.dataset.vendingCategory = product.category;
    button.dataset.vendingAvailable = product.vendingAvailable ? "1" : "0";
    button.querySelector(":scope > span:last-child").textContent = product.label;
    button.setAttribute("aria-label", `${product.label} ${product.price}C`);
    applyGeneratedItemTexture(button, product.asset || product.id);
  }
}

function availableVendingCategories() {
  const buttons = vendingProductButtons();
  return hackerRecipeCategories.filter((category) =>
    buttons.some((button) => DVA_ECONOMY.product(button.dataset.drink)?.vendingAvailable && vendingProductCategory(button.dataset.drink) === category.id)
  );
}

function selectVendingCategory(categoryId, direction = 0, { wrap = true } = {}) {
  const categories = availableVendingCategories();
  if (!categories.length) return false;
  const currentIndex = Math.max(0, categories.findIndex((category) => category.id === state.vendingCategoryId));
  const nextIndex = currentIndex + direction;
  const category = categoryId
    ? categories.find((candidate) => candidate.id === categoryId)
    : wrap
      ? categories[(nextIndex + categories.length) % categories.length]
      : categories[nextIndex];
  if (!category) return false;
  const focused = document.activeElement?.closest?.("[data-drink]");
  if (focused?.dataset.drink) {
    state.vendingSelectedByCategory[state.vendingCategoryId] = focused.dataset.drink;
  }
  state.vendingCategoryId = category.id;
  state.vendingRenderKey = "";
  renderVending(state.data);
  const preferredId = state.vendingSelectedByCategory[category.id];
  const next = els.vendingPanel.querySelector(
    preferredId ? `[data-drink="${CSS.escape(preferredId)}"]` : "[data-drink]:not([hidden])"
  );
  if (next && !next.hidden) {
    next.focus({ preventScroll: true });
    next.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }
  return true;
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
  const product = DVA_ECONOMY.productForRecipe(recipe?.id);
  if (product?.hackerAccess === "root" && !self?.hackerRootActive) return false;
  if (!recipe?.kind) return true;
  if (recipe.kind === "invention") return (self?.inventions || []).includes(recipe.inventoryId);
  if (recipe.kind === "borrowed") return availableBorrowedActiveOperatorTypes(self).includes(recipe.inventoryId);
  return true;
}

function ensureDynamicAlchemyChoices() {
  for (const recipe of alchemyRecipes) {
    if (recipe.kind === "invention") continue;
    let option = els.alchemySelect.querySelector(`option[value="${recipe.id}"]`);
    if (!option) {
      option = document.createElement("option");
      option.value = recipe.id;
      els.alchemySelect.append(option);
    }
    option.textContent = `${recipe.label}（${hackerRecipeCooldownLabel(recipe)}）`;
    if (recipe.kind === "borrowed") continue;
    const existingButton = els.alchemyChoiceGrid.querySelector(`[data-alchemy-choice="${recipe.id}"]`);
    if (existingButton) {
      const copy = existingButton.querySelector(":scope > span:last-child");
      if (copy) {
        copy.classList.add("item-name-line");
        copy.innerHTML = hackerRecipeNameMarkup(recipe);
      }
      existingButton.setAttribute("aria-label", `${recipe.label} ${hackerRecipeCooldownLabel(recipe)}`);
    } else {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "alchemy-choice alchemy-inventory-choice";
      button.dataset.alchemyChoice = recipe.id;
      button.dataset.atlasCell = recipe.kind === "invention" ? "3" : "1";
      if (recipe.asset) button.dataset.alchemyAsset = recipe.asset;
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-label", `${recipe.label} ${hackerRecipeCooldownLabel(recipe)}`);
      button.innerHTML = `<span class="alchemy-choice-icon" aria-hidden="true"></span><span class="item-name-line">${hackerRecipeNameMarkup(recipe)}</span>`;
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
    !player.ejected &&
    !player.invisible
  );
}

function ensureHackerTarget(data = state.data) {
  const targets = hackerTargets(data);
  if (!targets.some((player) => player.id === state.hackerTargetId)) {
    state.hackerTargetId = targets[0]?.id || "";
  }
  return targets.find((player) => player.id === state.hackerTargetId) || null;
}

function syncHackerTargetSelect(data = state.data) {
  const targets = hackerTargets(data);
  const key = targets.map((player) => `${player.id}:${player.name}`).join("|");
  if (els.hackerTargetSelect.dataset.key !== key) {
    els.hackerTargetSelect.dataset.key = key;
    els.hackerTargetSelect.replaceChildren(...targets.map((player) => {
      const option = document.createElement("option");
      option.value = player.id;
      option.textContent = `${playerIdentityLabel(player)}${player.id === data?.selfId ? "（自分）" : ""}`;
      return option;
    }));
  }
  els.hackerTargetSelect.value = targets.some((player) => player.id === state.hackerTargetId)
    ? state.hackerTargetId
    : targets[0]?.id || "";
  els.hackerTargetSelect.disabled = targets.length < 2;
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
  els.hackerTargetSelect.focus({ preventScroll: true });
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

function selectHackerCategory(categoryId, direction = 0, { wrap = true } = {}) {
  const recipes = availableHackerRecipes();
  const categories = hackerRecipeCategories.filter((category) =>
    recipes.some((recipe) => hackerRecipeCategory(recipe) === category.id)
  );
  if (!categories.length) return false;
  const currentIndex = Math.max(0, categories.findIndex((category) => category.id === state.hackerCategoryId));
  const nextIndex = currentIndex + direction;
  const category = categoryId
    ? categories.find((candidate) => candidate.id === categoryId)
    : wrap
      ? categories[(nextIndex + categories.length) % categories.length]
      : categories[nextIndex];
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
  if (!button || button.dataset.actionDisabled === "1") {
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
    // Preserve the pressed card node so a held action can resume as soon as
    // its cooldown expires instead of losing pointer capture on a rebuild.
    renderHackerAbilityDock(state.data);
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
    renderHackerAbilityDock(state.data);
    scheduleHackerCooldownWake(state.data);
    window.setTimeout(() => renderHackerAbilityDock(state.data), 260);
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
  syncHackerTargetSelect(data);

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
      button.setAttribute("aria-label", `${recipe.label} ${hackerRecipeCooldownLabel(recipe)}`);
      button.innerHTML = `
        <span class="alchemy-choice-icon hacker-action-icon" aria-hidden="true"></span>
        <span class="hacker-action-copy item-name-line">${hackerRecipeNameMarkup(recipe)}</span>
      `;
      bindInventoryDetailHold(button, {
        label: recipe.label,
        output: category.label,
        badge: "",
        detail: recipe.output || "バイブコーディングで生成・適用する対象。"
      }, els.hackerAbilityGrid);
      els.hackerAbilityGrid.append(button);
      applyGeneratedItemTexture(button, recipe.asset || recipe.id);
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
  els.hackerAbilityGrid.querySelectorAll("[data-hacker-recipe]").forEach((button) => {
    const recipe = alchemyRecipes.find((entry) => entry.id === button.dataset.hackerRecipe);
    if (recipe) applyGeneratedItemTexture(button, recipe.asset || recipe.id);
  });

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
    const actionDisabled = !canAct ||
      !recipe ||
      !alchemyRecipeAvailable(recipe, self) ||
      state.hackerGenerationInFlight ||
      (targetRequired && !target) ||
      (!recipe.kind && (!vibeCodingReady || !enoughMana));
    button.disabled = false;
    button.dataset.actionDisabled = actionDisabled ? "1" : "0";
    button.setAttribute("aria-disabled", String(actionDisabled));
    button.classList.toggle("action-unavailable", actionDisabled);
  });
}

const soloMissionIds = ["movement", "combat", "defense", "intel", "emp", "cpu-gravity", "cpu-stage2"];

const TACTICS_NOVEL_SCENES = Object.freeze([
  {
    title: "ようこそ",
    speaker: "sophia",
    role: "TACTICAL GUIDE",
    name: "ソフィア",
    text: "戦術いろはへようこそ。フィリアと一緒に、試合の大切な流れを身振りとATEで軽やかに案内します。",
    sophiaGesture: "interact",
    philiaGesture: "rest",
    symbols: [{ type: "note", owner: "sophia" }, { type: "sparkle", owner: "philia" }]
  },
  {
    title: "試合の流れ",
    speaker: "philia",
    role: "FLOW GUIDE",
    name: "フィリア",
    text: "オペレーター選択、バトル、会議、次ラウンド、リザルトの順です。死体通報かスマホ緊急会議で会議へ移ります。",
    sophiaGesture: "focus",
    philiaGesture: "interact",
    symbols: [{ type: "cheer", owner: "philia" }, { type: "note", owner: "sophia" }]
  },
  {
    title: "陣営と勝利",
    speaker: "sophia",
    role: "VICTORY GUIDE",
    name: "ソフィア",
    text: "ディフェンダーは全タスク完了か全アタッカー排除、アタッカーはディフェンダー全滅か致命サボタージュ完遂で勝利。善のイデア到達は幸運／直観が最大でも1秒だけ早まり、アタッカーに対ディフェンダーの定期キル期限はありません。",
    sophiaGesture: "power",
    philiaGesture: "focus",
    symbols: [{ type: "sparkle", owner: "sophia" }, { type: "cheer", owner: "philia" }]
  },
  {
    title: "移動とSP",
    speaker: "philia",
    role: "MOVEMENT GUIDE",
    name: "フィリア",
    text: "SPは満タン開始。歩行でも減り、ダッシュはより多く消費します。停止してからタスク、距離を決めて跳躍、と切り替えましょう。",
    sophiaGesture: "rest",
    philiaGesture: "focus",
    symbols: [{ type: "idea", owner: "philia" }, { type: "note", owner: "sophia" }]
  },
  {
    title: "MP・SPと心の状態",
    speaker: "sophia",
    role: "RESOURCE GUIDE",
    name: "ソフィア",
    text: "SPとMPは各自の現在上限に対する割合で、0%=0点、0%超〜50%=1点、50%超=2点。合計0=欲望、1〜2=気概、3〜4=理知です。HPは含めません。SPとMPの獲得が上限を超えるとcurrent/maxが一緒に拡張され、消費しても上限は縮みません。理知の自然回復は不足分を回復した後もcurrent/maxをじわじわ拡張します。",
    sophiaGesture: "focus",
    philiaGesture: "interact",
    symbols: [{ type: "idea", owner: "sophia" }, { type: "sparkle", owner: "philia" }]
  },
  {
    title: "戦闘用語",
    speaker: "philia",
    role: "COMBAT GUIDE",
    name: "フィリア",
    text: "HPは2。確殺は残HPに関係なく倒します。破壊と消滅は同じ強制死亡ですが、破壊は死体あり、消滅は死体なしです。",
    sophiaGesture: "interact",
    philiaGesture: "power",
    symbols: [{ type: "idea", owner: "philia" }, { type: "sparkle", owner: "sophia" }]
  },
  {
    title: "ファイターとEC",
    speaker: "sophia",
    role: "FIGHTER GUIDE",
    name: "ソフィア",
    text: "オリハルコン・ソード自体は物理斬撃・ガード・JG反射を行う剣です。これとは別に、ファイター能力のECは初回100でMP・SP・HP・バリア無限、初回500で居合、初回1000でLB被確殺解除・消滅斬り・全攻撃JG反射を永続獲得します。EC100以上の斬るではEC100を使い特大衝撃波も起こせます。",
    sophiaGesture: "power",
    philiaGesture: "focus",
    symbols: [{ type: "sparkle", owner: "sophia" }, { type: "idea", owner: "philia" }]
  },
  {
    title: "アイテムと自販機",
    speaker: "philia",
    role: "ITEM GUIDE",
    name: "フィリア",
    text: "自販機はどこでも開け、分類から選びます。瓶は接地で壊れ、ウラン／プルトニウム容器は投擲中に空中で開くため回収できません。それ以外の物理アイテムは被弾地点か接地点に残り、誰でも拾えます。長押しで詳細を確認できます。",
    sophiaGesture: "interact",
    philiaGesture: "throw",
    symbols: [{ type: "cheer", owner: "philia" }, { type: "note", owner: "sophia" }]
  },
  {
    title: "オペレーター",
    speaker: "sophia",
    role: "OPERATOR GUIDE",
    name: "ソフィア",
    text: "ガンナーは銃と特殊弾、グラビティは時空と全域重力嵐、フローラは自己回復と光、ハッカーは生成、クオンタムは物質変換を担当します。",
    sophiaGesture: "interact",
    philiaGesture: "cast",
    symbols: [{ type: "note", owner: "sophia" }, { type: "sparkle", owner: "philia" }]
  },
  {
    title: "索敵・EMP・サボ",
    speaker: "philia",
    role: "INTEL GUIDE",
    name: "フィリア",
    text: "千里眼は全員共通で0.25MP/秒。同位相EMPは900ms以内で共振、逆位相は相殺します。敵陣営Botも千里眼で索敵します。",
    sophiaGesture: "focus",
    philiaGesture: "cast",
    symbols: [{ type: "idea", owner: "philia" }, { type: "cheer", owner: "sophia" }]
  },
  {
    title: "会議とルミナス",
    speaker: "sophia",
    role: "MEETING GUIDE",
    name: "ソフィア",
    text: "匿名投票とゲーム内テキストチャットで情報を整理します。ルミナスはディフェンダーが一試合に一度だけ使い、的中するとキル1です。",
    sophiaGesture: "focus",
    philiaGesture: "interact",
    symbols: [{ type: "idea", owner: "sophia" }, { type: "note", owner: "philia" }]
  },
  {
    title: "実戦へ",
    speaker: "philia",
    role: "READY GUIDE",
    name: "フィリア",
    text: "イデア到達者が複数なら、その全員が勝利します。仕様表とソロ訓練も使い、得意な判断を見つけたらプレイへ進みましょう。",
    sophiaGesture: "heal",
    philiaGesture: "power",
    symbols: [{ type: "cheer", owner: "philia" }, { type: "sparkle", owner: "sophia" }, { type: "note", owner: "philia", secondary: true }]
  }
]);

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
  const playMode = state.onlineAvailable ? "オンライン優先マッチング" : "オフライン自動切替";
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

const TITLE_COMMAND_DEPTH_UV = Object.freeze({ x: 0.58, y: 0.59 });

init();

function prepareTitleHero() {
  const reveal = () => {
    els.startScreen.classList.add("title-ready");
    playTitleCommandArrival();
  };
  if (!els.startHero) {
    reveal();
    return;
  }
  if (els.startHero.complete && els.startHero.naturalWidth > 0) {
    els.startHero.decode?.().catch(() => {}).finally(reveal);
    return;
  }
  els.startHero.addEventListener("load", reveal, { once: true });
  els.startHero.addEventListener("error", reveal, { once: true });
}

function titleTextureDepthPoint() {
  const screenRect = els.startScreen.getBoundingClientRect();
  const naturalWidth = Math.max(1, Number(els.startHero?.naturalWidth) || 1672);
  const naturalHeight = Math.max(1, Number(els.startHero?.naturalHeight) || 941);
  const coverScale = Math.max(screenRect.width / naturalWidth, screenRect.height / naturalHeight);
  const renderedWidth = naturalWidth * coverScale;
  const renderedHeight = naturalHeight * coverScale;
  const renderedLeft = screenRect.left + (screenRect.width - renderedWidth) / 2;
  const renderedTop = screenRect.top + (screenRect.height - renderedHeight) / 2;
  return {
    x: renderedLeft + renderedWidth * TITLE_COMMAND_DEPTH_UV.x,
    y: renderedTop + renderedHeight * TITLE_COMMAND_DEPTH_UV.y
  };
}

function titleCommandDepthPath(depthPoint, commandRect) {
  const centerX = commandRect.left + commandRect.width / 2;
  const centerY = commandRect.top + commandRect.height / 2;
  const startX = depthPoint.x - centerX;
  const startY = depthPoint.y - centerY;
  const rayAngle = Math.atan2(-startY, -startX) * 180 / Math.PI;
  const roll = Math.max(-9, Math.min(9, rayAngle * 0.08));
  return {
    startX,
    startY,
    farX: startX * 0.72,
    farY: startY * 0.72,
    approachX: startX * 0.3,
    approachY: startY * 0.3,
    overshootX: startX * -0.035,
    overshootY: startY * -0.035,
    settleX: startX * 0.012,
    settleY: startY * 0.012,
    roll,
    approachRoll: roll * 0.38
  };
}

function titleCommandLayoutRect(button) {
  const parentRect = button.parentElement.getBoundingClientRect();
  return {
    left: parentRect.left + button.offsetLeft,
    top: parentRect.top + button.offsetTop,
    width: button.offsetWidth,
    height: button.offsetHeight
  };
}

function updateTitleCommandDepthPaths() {
  if (!els.startScreen || !els.titlePlayButton || !els.titleTacticsButton) return;
  const depthPoint = titleTextureDepthPoint();
  [els.titlePlayButton, els.titleTacticsButton].forEach((button) => {
    const path = titleCommandDepthPath(depthPoint, titleCommandLayoutRect(button));
    for (const [name, value] of Object.entries(path)) {
      button.style.setProperty(`--title-depth-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`, `${value}${name.endsWith("Roll") || name === "roll" ? "deg" : "px"}`);
    }
    button.dataset.titleDepthOrigin = "texture-vanishing-point";
  });
}

function playTitleCommandArrival() {
  if (state.titleArrivalTimer) window.clearTimeout(state.titleArrivalTimer);
  els.startScreen.classList.remove("title-arriving");
  updateTitleCommandDepthPaths();
  void els.startScreen.offsetWidth;
  els.startScreen.classList.add("title-arriving");
  state.titleArrivalTimer = window.setTimeout(() => {
    els.startScreen.classList.remove("title-arriving");
    state.titleArrivalTimer = null;
  }, 700);
}

function init() {
  applyStartupCommand();
  prepareTitleHero();
  const savedName = localStorage.getItem(storage.name) || "";
  els.nameInput.value = savedName;
  els.skinSelect.value = normalizeSkinId(localStorage.getItem(storage.skin));
  els.mapSelect.value = normalizeMatchmakingMapId(localStorage.getItem(storage.map));
  syncGameAudioButtons();
  updateSoloProgressUi();
  setScreen("title");
  bindEvents();
  requestStartupFullscreen();
  initializeTacticsPanel();
  initializeOfflineRuntime();
  if (VERIFY_REAL_SCREEN_AUTO_START) {
    window.setTimeout(() => void runVerificationRealScreenAutoStart(), 0);
  }
  if (state.offlineMode) activateOfflineMode();
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
        headers: onlineApiHeaders({ "content-type": "application/json" }),
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
  if (VERIFY_REAL_SCREEN_AUTO_START) {
    const runId = String(URL_PARAMETERS.get("verify") || Date.now()).replace(/[^a-z0-9_-]+/gi, "-").slice(0, 80);
    return `verify-${VERIFY_REAL_SCREEN_FIXTURE_KIND}-${runId}`;
  }
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
    isDeveloper: () => localStorage.getItem(storage.developerIdentity) === "1" || Boolean(
      VERIFY_REAL_SCREEN_FIXTURE_KIND && IS_TRUSTED_REAL_SCREEN_FIXTURE_HOST
    )
  });
  // Warm the generated-offline runtime without creating a room or switching
  // connection mode. The 120ms decision can then move directly to operator
  // selection instead of making the user wait for the large worker to parse.
  void state.offlineClient.start();
}

function activateOfflineMode(reason = "") {
  if (!state.offlineClient) return false;
  state.offlineClient.start();
  state.offlineMode = true;
  localStorage.setItem(storage.offlineSession, "1");
  state.realtime?.disconnect();
  document.documentElement.dataset.connectionMode = "offline";
  if (reason) showToast(reason);
  return true;
}

function deactivateOfflineMode() {
  state.offlineMode = false;
  localStorage.removeItem(storage.offlineSession);
  document.documentElement.dataset.connectionMode = "online";
}

function applyOnlineAvailabilityUi() {
  const available = state.onlineAvailable;
  document.documentElement.dataset.onlineAvailability = available ? "available" : "unavailable";
  updateSoloProgressUi();
  render();
}

async function checkOnlineAvailability() {
  if (state.onlineAvailabilityCheckInFlight) {
    const deadline = performance.now() + 2600;
    while (state.onlineAvailabilityCheckInFlight && performance.now() < deadline) await delay(60);
    return state.onlineAvailable;
  }
  state.onlineAvailabilityCheckInFlight = true;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch(apiUrl("/api/online-capacity"), {
      method: "GET",
      cache: "no-store",
      headers: onlineApiHeaders({ accept: "application/json" }),
      signal: controller.signal
    });
    const result = response.ok ? await response.json().catch(() => null) : null;
    const compatibleRelease = result?.requiredClientRelease === DVA_CLIENT_RELEASE;
    state.onlineAvailable = Boolean(
      response.ok &&
      result?.ok &&
      compatibleRelease &&
      result?.renderCapacity === "available" &&
      result?.available
    );
  } catch {
    state.onlineAvailable = false;
  } finally {
    window.clearTimeout(timeout);
    state.onlineAvailabilityChecked = true;
    state.onlineAvailabilityCheckInFlight = false;
    applyOnlineAvailabilityUi();
  }
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
    clientRelease: DVA_CLIENT_RELEASE,
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
  if (IS_VERIFICATION_MODE) return false;
  if (document.fullscreenElement || typeof document.documentElement.requestFullscreen !== "function") return false;
  try {
    await document.documentElement.requestFullscreen({ navigationUI: "hide" });
    return true;
  } catch {
    return false;
  }
}

const LOCKED_VIEWPORT_CONTENT = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";
let viewportScaleResetTimer = 0;

function restoreLockedViewportScale(force = false) {
  const scale = Number(window.visualViewport?.scale) || 1;
  if (!force && scale <= 1.01) return false;
  const current = document.querySelector('meta[name="viewport"]');
  if (!current) return false;
  const replacement = document.createElement("meta");
  replacement.name = "viewport";
  replacement.content = LOCKED_VIEWPORT_CONTENT;
  current.replaceWith(replacement);
  return true;
}

function scheduleViewportScaleRestore(force = false) {
  if (viewportScaleResetTimer) window.clearTimeout(viewportScaleResetTimer);
  viewportScaleResetTimer = window.setTimeout(() => {
    viewportScaleResetTimer = 0;
    restoreLockedViewportScale(force);
  }, force ? 0 : 80);
}

const FULLSCREEN_SCROLL_SELECTOR = "[data-right-panel-scroll], [data-scroll-region], #sidePanel, .tablet-branch-list, .operator-branch-list, .hacker-ability-grid, .active-effects-panel, .active-effects-list, .item-inventory-grid, .vending-panel, .operator-list, .operator-detail, .field-feed-list, .alchemy-choice-grid, .tactics-content, .tactics-chapters, .solo-training, .solo-mission-grid, .keybind-list, .result-ranking";
const scrollSurfaceRevisions = new WeakMap();
const scrollRestoreExpected = new WeakMap();

function resetScrollSurfaceForSemanticContext(surface) {
  if (!(surface instanceof Element)) return;
  const revision = (scrollSurfaceRevisions.get(surface) || 0) + 1;
  scrollSurfaceRevisions.set(surface, revision);
  const reset = () => {
    if (!surface.isConnected || (scrollSurfaceRevisions.get(surface) || 0) !== revision) return;
    scrollRestoreExpected.set(surface, { top: 0, left: 0 });
    surface.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };
  reset();
  requestAnimationFrame(() => requestAnimationFrame(reset));
}

document.addEventListener("scroll", (event) => {
  const surface = event.target;
  if (!(surface instanceof Element) || !surface.matches(FULLSCREEN_SCROLL_SELECTOR)) return;
  const expected = scrollRestoreExpected.get(surface);
  if (expected && Math.abs(surface.scrollTop - expected.top) <= 1 && Math.abs(surface.scrollLeft - expected.left) <= 1) {
    scrollRestoreExpected.delete(surface);
    return;
  }
  scrollRestoreExpected.delete(surface);
  scrollSurfaceRevisions.set(surface, (scrollSurfaceRevisions.get(surface) || 0) + 1);
}, true);

function capturePollScrollPositions() {
  return [...document.querySelectorAll(FULLSCREEN_SCROLL_SELECTOR)]
    .filter((surface) => surface instanceof Element && !surface.hidden && surface.getClientRects().length > 0)
    .map((surface) => {
      const maxTop = Math.max(0, surface.scrollHeight - surface.clientHeight);
      const maxLeft = Math.max(0, surface.scrollWidth - surface.clientWidth);
      return {
        surface,
        top: Math.max(0, Number(surface.scrollTop) || 0),
        left: Math.max(0, Number(surface.scrollLeft) || 0),
        wasScrollableY: maxTop > 1,
        wasScrollableX: maxLeft > 1,
        atEndY: maxTop > 1 && surface.scrollTop >= maxTop - 1,
        atEndX: maxLeft > 1 && surface.scrollLeft >= maxLeft - 1,
        revision: scrollSurfaceRevisions.get(surface) || 0
      };
    });
}

function restorePollScrollPositions(snapshot, { defer = true } = {}) {
  const restore = () => {
    for (const entry of snapshot || []) {
      const { surface } = entry;
      if (!(surface instanceof Element) || !surface.isConnected) continue;
      if ((scrollSurfaceRevisions.get(surface) || 0) !== entry.revision) continue;
      const maxTop = Math.max(0, surface.scrollHeight - surface.clientHeight);
      const maxLeft = Math.max(0, surface.scrollWidth - surface.clientWidth);
      const top = Math.min(entry.atEndY && entry.wasScrollableY ? maxTop : entry.top, maxTop);
      const left = Math.min(entry.atEndX && entry.wasScrollableX ? maxLeft : entry.left, maxLeft);
      scrollRestoreExpected.set(surface, { top, left });
      if (Math.abs(surface.scrollTop - top) > 0.5) surface.scrollTop = top;
      if (Math.abs(surface.scrollLeft - left) > 0.5) surface.scrollLeft = left;
    }
  };
  restore();
  if (!defer) return;
  requestAnimationFrame(() => requestAnimationFrame(restore));
}

function isFullscreenScrollableSurface(surface) {
  if (!(surface instanceof Element) || surface.scrollHeight <= surface.clientHeight + 1) return false;
  const overflowY = typeof getComputedStyle === "function"
    ? String(getComputedStyle(surface).overflowY || "")
    : String(surface.overflowY || "auto");
  return /^(auto|scroll|overlay)$/.test(overflowY);
}

function resolveFullscreenScrollableSurface(target) {
  if (!(target instanceof Element)) return null;
  const visited = new Set();
  let fallback = null;
  let candidate = target.closest(FULLSCREEN_SCROLL_SELECTOR);
  while (candidate) {
    const mapped = candidate.matches("[data-scroll-region]") ? scrollRegionTarget(candidate) : candidate;
    if (mapped instanceof Element && !visited.has(mapped)) {
      visited.add(mapped);
      fallback ||= mapped;
      if (isFullscreenScrollableSurface(mapped)) return mapped;
    }
    candidate = candidate.parentElement?.closest(FULLSCREEN_SCROLL_SELECTOR) || null;
  }
  return fallback;
}

function createFullscreenSwipeGuard({ isActive, resolveScrollable }) {
  const touches = new Map();
  return {
    start(id, clientY, target) {
      if (!isActive()) return false;
      touches.set(id, {
        lastY: clientY,
        scrollable: resolveScrollable(target)
      });
      return true;
    },
    move(id, clientY) {
      const touch = touches.get(id);
      if (!touch || !isActive()) return false;
      const deltaY = clientY - touch.lastY;
      touch.lastY = clientY;
      if (Math.abs(deltaY) < 0.5) return false;
      const scrollable = touch.scrollable;
      if (!scrollable) return true;
      const maxScrollTop = Math.max(0, scrollable.scrollHeight - scrollable.clientHeight);
      if (maxScrollTop <= 0) return true;
      if (deltaY > 0) return scrollable.scrollTop <= 0;
      return scrollable.scrollTop >= maxScrollTop - 1;
    },
    end(id) {
      return touches.delete(id);
    },
    clear() {
      touches.clear();
    }
  };
}

function requestStartupFullscreen() {
  if (IS_VERIFICATION_MODE) {
    state.startupFullscreenPending = false;
    return;
  }
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

async function runTitleCommandTransition(button, action) {
  if (!button || state.titleCommandTransitionRunning) return false;
  state.titleCommandTransitionRunning = true;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const duration = reduced ? 160 : 640;
  const rect = button.getBoundingClientRect();
  const overlay = els.titleCommandTransitionAte;
  const pixels = els.titleCommandPixelField;
  pixels.replaceChildren();
  overlay.style.setProperty("--command-left", `${rect.left}px`);
  overlay.style.setProperty("--command-top", `${rect.top}px`);
  overlay.style.setProperty("--command-width", `${rect.width}px`);
  overlay.style.setProperty("--command-height", `${rect.height}px`);
  for (let index = 0; index < 38; index += 1) {
    const pixel = document.createElement("i");
    const side = index % 2 ? 1 : -1;
    pixel.style.setProperty("--pixel-x", `${(index * 47) % 100}%`);
    pixel.style.setProperty("--pixel-y", `${(index * 29) % 100}%`);
    pixel.style.setProperty("--pixel-dx", `${side * (70 + (index % 9) * 21)}px`);
    pixel.style.setProperty("--pixel-delay", `${(index % 8) * 18}ms`);
    pixel.style.setProperty("--pixel-size", `${2 + index % 4}px`);
    pixels.appendChild(pixel);
  }
  overlay.hidden = false;
  overlay.classList.toggle("reduced", Boolean(reduced));
  void overlay.offsetWidth;
  overlay.classList.add("active");
  button.classList.add("title-command-dispersing");
  els.titlePlayButton.disabled = true;
  els.titleTacticsButton.disabled = true;
  await delay(duration);
  action();
  await delay(reduced ? 20 : 140);
  overlay.classList.remove("active");
  overlay.classList.remove("reduced");
  overlay.hidden = true;
  pixels.replaceChildren();
  button.classList.remove("title-command-dispersing");
  els.titlePlayButton.disabled = false;
  els.titleTacticsButton.disabled = false;
  state.titleCommandTransitionRunning = false;
  return true;
}

function setScreen(screen) {
  const next = ["title", "tactics", "game"].includes(screen) ? screen : "title";
  const previous = state.screen;
  state.screen = next;
  if (previous !== next && (state.activeScrollRegion || state.expandedScrollRegion)) {
    setSelectedScrollRegion(null, { focus: false });
  }
  closeSwitchDragMenu();
  if (next !== "game" && state.fieldFeedOpen) setFieldFeedOpen(false);
  if (next !== "game" && state.vendingOpen) setVendingOpen(false, { focus: false });
  document.body.classList.toggle("start-open", next !== "game");
  document.body.classList.toggle("tactics-open", next === "tactics");
  document.body.classList.toggle("game-open", next === "game");
  document.documentElement.classList.toggle("game-open", next === "game");
  if (next === "game") scheduleStableGameplayViewportReflow(previous !== "game" ? 0 : 80);
  els.startScreen.hidden = next === "game";
  els.startScreen.classList.remove("title-arriving");
  if (els.titleMuteButton) els.titleMuteButton.hidden = next === "tactics";
  els.gameApp.setAttribute("aria-hidden", String(next !== "game"));
  els.titleMenu.hidden = next !== "title";
  els.tacticsPanel.hidden = next !== "tactics";
  els.leaveRoomButton.hidden = next === "title";
  if (next === "title") playTitleCommandArrival();
  if (els.tacticsBackButton) {
    const returnsToGame = next === "tactics" && state.tacticsReturnScreen === "game" && Boolean(state.data);
    const label = returnsToGame ? "ゲームへ戻る" : "タイトルへ戻る";
    els.tacticsBackButton.setAttribute("aria-label", label);
    els.tacticsBackButton.title = label;
  }
  if (next === "tactics") setActiveTacticsChapter(state.tacticsChapterId || "tactics-basics");
  else syncTacticsNovelAnimation();
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
  initializeTacticsNovel();
}

function setActiveTacticsChapter(id) {
  state.tacticsChapterId = id;
  els.tacticsPanel?.classList.toggle("novel-active", id === "tactics-novel");
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
  syncTacticsNovelAnimation();
}

function initializeTacticsNovel() {
  if (!els.tacticsNovelStage || !els.tacticsNovelCanvas) return;
  els.tacticsNovelProgress.replaceChildren(...TACTICS_NOVEL_SCENES.map(() => document.createElement("i")));
  els.tacticsNovelRestart.addEventListener("click", () => setTacticsNovelScene(0));
  els.tacticsNovelPrev.addEventListener("click", () => setTacticsNovelScene(state.tacticsNovelIndex - 1));
  els.tacticsNovelNext.addEventListener("click", () => {
    if (state.tacticsNovelIndex >= TACTICS_NOVEL_SCENES.length - 1) {
      setTacticsNovelAuto(false);
      setTacticsNovelScene(0);
      return;
    }
    setTacticsNovelScene(state.tacticsNovelIndex + 1);
  });
  els.tacticsNovelAuto.addEventListener("click", () => setTacticsNovelAuto(!state.tacticsNovelAuto));
  els.tacticsNovelStage.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("button")) return;
    if (performance.now() < state.tacticsNovelSuppressClickUntil) return;
    els.tacticsNovelNext.click();
  });
  els.tacticsNovelStage.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest("button")) return;
    state.tacticsNovelPointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    try { els.tacticsNovelStage.setPointerCapture(event.pointerId); } catch {}
  });
  els.tacticsNovelStage.addEventListener("pointerup", (event) => {
    const pointer = state.tacticsNovelPointer;
    state.tacticsNovelPointer = null;
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    if (Math.abs(dx) < 46 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
    state.tacticsNovelSuppressClickUntil = performance.now() + 650;
    setTacticsNovelScene(state.tacticsNovelIndex + (dx < 0 ? 1 : -1));
  });
  els.tacticsNovelStage.addEventListener("pointercancel", () => {
    state.tacticsNovelPointer = null;
  });
  setTacticsNovelScene(0, { quiet: true });
}

function setTacticsNovelAuto(enabled) {
  state.tacticsNovelAuto = Boolean(enabled);
  state.tacticsNovelSceneChangedAt = performance.now();
  els.tacticsNovelAuto.setAttribute("aria-pressed", String(state.tacticsNovelAuto));
  els.tacticsNovelAuto.textContent = state.tacticsNovelAuto ? "自動 ON" : "自動 OFF";
  syncTacticsNovelAnimation();
}

function setTacticsNovelScene(requestedIndex, options = {}) {
  const index = clamp(Number(requestedIndex) || 0, 0, TACTICS_NOVEL_SCENES.length - 1);
  const changed = index !== state.tacticsNovelIndex;
  state.tacticsNovelIndex = index;
  state.tacticsNovelSceneChangedAt = performance.now();
  const scene = TACTICS_NOVEL_SCENES[index];
  els.tacticsNovelChapter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(TACTICS_NOVEL_SCENES.length).padStart(2, "0")}　${scene.title}`;
  els.tacticsNovelSpeakerRole.textContent = scene.role;
  els.tacticsNovelSpeaker.textContent = scene.name;
  els.tacticsNovelText.textContent = scene.text;
  els.tacticsNovelPrev.disabled = index === 0;
  els.tacticsNovelRestart.disabled = index === 0;
  els.tacticsNovelNext.textContent = index === TACTICS_NOVEL_SCENES.length - 1 ? "もう一度 ↻" : "次へ →";
  [...els.tacticsNovelProgress.children].forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === index);
    dot.classList.toggle("complete", dotIndex < index);
  });
  if (changed && !options.quiet) playSound("select");
  syncTacticsNovelAnimation();
}

function syncTacticsNovelAnimation() {
  const active = state.screen === "tactics" && state.tacticsChapterId === "tactics-novel" && !els.tacticsNovelStage?.hidden;
  if (!active) {
    if (state.tacticsNovelFrame) cancelAnimationFrame(state.tacticsNovelFrame);
    state.tacticsNovelFrame = 0;
    return;
  }
  if (!state.tacticsNovelFrame) state.tacticsNovelFrame = requestAnimationFrame(drawTacticsNovelFrame);
}

function tacticsNovelMotionFrame(timeSeconds) {
  return [0, 1, 2, 1][Math.floor(timeSeconds * 1.35) % 4];
}

function tacticsNovelCueEnvelope(elapsed, start, end, fade = 240) {
  if (elapsed <= start - fade || elapsed >= end + fade) return 0;
  if (elapsed < start) return clamp((elapsed - (start - fade)) / fade, 0, 1);
  if (elapsed > end) return clamp(((end + fade) - elapsed) / fade, 0, 1);
  return 1;
}

function tacticsNovelGestureActivity(elapsed, active, person) {
  const offset = person === "sophia" ? 0 : 120;
  const windows = active
    ? [[520 + offset, 1_900 + offset], [4_180 + offset, 5_080 + offset]]
    : [[2_520 + offset, 3_260 + offset]];
  return Math.max(...windows.map(([start, end]) => tacticsNovelCueEnvelope(elapsed, start, end, 210)));
}

function drawTacticsNovelCharacter(ctx, person, gesture, x, baseY, height, active, timeSeconds, entrance, elapsed) {
  const gestureActivity = tacticsNovelGestureActivity(elapsed, active, person);
  const displayedGesture = gestureActivity > 0.01 ? gesture : "rest";
  const image = state.textures.tacticsNovelMotions?.[person]?.[displayedGesture];
  const skin = person === "sophia" ? "blue-dress" : "white-hood";
  const key = `physical-motion-${skin}-${displayedGesture}-novel-v466`;
  const source = image ? transparentSpriteSource(image, key, 20) : null;
  if (!source) return;
  const frame = gestureActivity > 0.01
    ? tacticsNovelMotionFrame(timeSeconds + (person === "sophia" ? 0 : 0.37))
    : 1;
  const sourceWidth = source.width / 3;
  const sourceHeight = source.height;
  const activeScale = active ? 1 + gestureActivity * 0.045 : 0.94 + gestureActivity * 0.018;
  const drawHeight = height * activeScale;
  const drawWidth = drawHeight * sourceWidth / sourceHeight;
  const direction = person === "sophia" ? -1 : 1;
  const slide = direction * (1 - entrance) * 54;
  const bob = Math.sin(timeSeconds * 1.45 + (person === "sophia" ? 0 : 1.4)) * (0.45 + gestureActivity * (active ? 2.95 : 1.2));
  ctx.save();
  ctx.globalAlpha = (active ? 1 : 0.72) * (0.48 + entrance * 0.52);
  ctx.filter = active ? "saturate(1.05) brightness(1.03)" : "saturate(0.78) brightness(0.82)";
  ctx.translate(x + slide, baseY + bob);
  ctx.drawImage(source, frame * sourceWidth, 0, sourceWidth, sourceHeight, -drawWidth / 2, -drawHeight, drawWidth, drawHeight);
  ctx.restore();
}

function drawTacticsNovelAmbientE(ctx, width, height, timeSeconds) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let index = 0; index < 18; index += 1) {
    const phase = (timeSeconds * (0.022 + index * 0.0007) + index * 0.071) % 1;
    const x = ((index * 83) % 997) / 997 * width + Math.sin(timeSeconds * 0.6 + index) * 10;
    const y = height * (0.78 - phase * 0.66);
    const alpha = Math.sin(phase * Math.PI) * 0.28;
    ctx.fillStyle = index % 3 === 0 ? `rgba(250,204,21,${alpha})` : `rgba(94,234,212,${alpha * 0.74})`;
    ctx.fillRect(x, y, 2 + index % 2, 2 + index % 2);
  }
  ctx.restore();
}

function drawTacticsNovelMangaE(ctx, type, x, y, size, timeSeconds, phase, visibility) {
  ctx.save();
  ctx.globalAlpha = visibility;
  ctx.globalCompositeOperation = "screen";
  const pulse = 0.5 + Math.sin(timeSeconds * 4.2 + phase) * 0.5;
  if (type === "sparkle") {
    ctx.translate(x, y);
    for (let index = 0; index < 5; index += 1) {
      const angle = phase + index * Math.PI * 0.4;
      const radius = size * (0.56 + pulse * 0.12);
      ctx.fillStyle = `rgba(103,232,249,${0.14 + pulse * 0.2})`;
      ctx.save();
      ctx.translate(Math.cos(angle) * radius, Math.sin(angle) * radius);
      ctx.rotate(angle + timeSeconds * 0.3);
      ctx.fillRect(-2, -2, 4, 4);
      ctx.restore();
    }
  } else if (type === "idea") {
    for (let index = 0; index < 4; index += 1) {
      const angle = -Math.PI * 0.82 + index * Math.PI * 0.55;
      ctx.fillStyle = `rgba(250,204,21,${0.12 + pulse * 0.19})`;
      ctx.beginPath();
      ctx.arc(x + Math.cos(angle) * size * 0.58, y + Math.sin(angle) * size * 0.58, 2.2 + pulse * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === "cheer") {
    ctx.strokeStyle = `rgba(94,234,212,${0.12 + pulse * 0.17})`;
    ctx.lineWidth = Math.max(3, size * 0.045);
    ctx.beginPath();
    ctx.moveTo(x - size * 0.55, y + size * 0.5);
    ctx.bezierCurveTo(x - size * 0.2, y + size * 0.2, x + size * 0.08, y - size * 0.1, x + size * 0.58, y - size * 0.48);
    ctx.stroke();
  } else if (type === "note") {
    for (let index = 0; index < 4; index += 1) {
      const rise = (timeSeconds * 0.18 + index * 0.23 + phase) % 1;
      const px = x + (index - 1.5) * size * 0.24 + Math.sin(timeSeconds + index) * 4;
      const py = y + size * 0.5 - rise * size;
      const radius = 2.8 + index % 2;
      ctx.fillStyle = `rgba(165,243,252,${Math.sin(rise * Math.PI) * 0.24})`;
      ctx.beginPath();
      for (let side = 0; side < 6; side += 1) {
        const angle = side * Math.PI / 3;
        const hx = px + Math.cos(angle) * radius;
        const hy = py + Math.sin(angle) * radius;
        if (side === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawTacticsNovelMangaAte(ctx, symbol, index, anchors, timeSeconds, entrance, elapsed) {
  const cueStarts = [980, 3_720, 5_380];
  const cueDurations = [1_020, 900, 720];
  const cueIndex = Math.min(index, cueStarts.length - 1);
  const visibility = tacticsNovelCueEnvelope(elapsed, cueStarts[cueIndex], cueStarts[cueIndex] + cueDurations[cueIndex], 220);
  if (visibility <= 0) return;
  const image = state.textures.tacticsNovelMangaSymbols?.[symbol.type];
  if (!image?.complete || !image.naturalWidth) return;
  const ownerAnchor = anchors[symbol.owner] || anchors.sophia;
  const secondaryOffset = symbol.secondary ? 78 : 0;
  const x = ownerAnchor.x + (symbol.owner === "sophia" ? -ownerAnchor.size * 0.52 : ownerAnchor.size * 0.52) + secondaryOffset;
  const y = ownerAnchor.y - ownerAnchor.size * (symbol.secondary ? 0.36 : 0.72);
  const baseSize = clamp(ownerAnchor.size * (symbol.secondary ? 0.23 : 0.3), 58, 118);
  const localTime = timeSeconds + index * 0.73;
  const scale = entrance * (0.94 + Math.sin(localTime * 3.2) * 0.055);
  const rotation = Math.sin(localTime * 1.8) * 0.08;
  drawTacticsNovelMangaE(ctx, symbol.type, x, y, baseSize, timeSeconds, index * 0.67, visibility);
  ctx.save();
  ctx.globalAlpha = entrance * visibility;
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);
  ctx.drawImage(image, -baseSize / 2, -baseSize / 2, baseSize, baseSize);
  ctx.restore();
}

function drawTacticsNovelFrame(timestamp) {
  state.tacticsNovelFrame = 0;
  if (state.screen !== "tactics" || state.tacticsChapterId !== "tactics-novel") return;
  const canvas = els.tacticsNovelCanvas;
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) {
    state.tacticsNovelFrame = requestAnimationFrame(drawTacticsNovelFrame);
    return;
  }
  const pixelRatio = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  const targetWidth = Math.round(rect.width * pixelRatio);
  const targetHeight = Math.round(rect.height * pixelRatio);
  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);
  const scene = TACTICS_NOVEL_SCENES[state.tacticsNovelIndex];
  const elapsed = Math.max(0, timestamp - state.tacticsNovelSceneChangedAt);
  const timeSeconds = timestamp / 1000;
  const entrance = 1 - Math.pow(1 - clamp(elapsed / 520, 0, 1), 3);
  drawTacticsNovelAmbientE(ctx, rect.width, rect.height, timeSeconds);
  const compact = rect.width < 620;
  const characterHeight = clamp(rect.height * (compact ? 0.56 : 0.72), 245, compact ? 360 : 520);
  const baseY = rect.height * (compact ? 0.63 : 0.8);
  const anchors = {
    sophia: { x: rect.width * (compact ? 0.28 : 0.3), y: baseY, size: characterHeight },
    philia: { x: rect.width * (compact ? 0.72 : 0.7), y: baseY, size: characterHeight }
  };
  drawTacticsNovelCharacter(ctx, "sophia", scene.sophiaGesture, anchors.sophia.x, baseY, characterHeight, scene.speaker === "sophia", timeSeconds, entrance, elapsed);
  drawTacticsNovelCharacter(ctx, "philia", scene.philiaGesture, anchors.philia.x, baseY, characterHeight, scene.speaker === "philia", timeSeconds, entrance, elapsed);
  scene.symbols.forEach((symbol, index) => drawTacticsNovelMangaAte(ctx, symbol, index, anchors, timeSeconds, entrance, elapsed));
  if (state.tacticsNovelAuto && elapsed >= 7_000) {
    if (state.tacticsNovelIndex >= TACTICS_NOVEL_SCENES.length - 1) setTacticsNovelAuto(false);
    else setTacticsNovelScene(state.tacticsNovelIndex + 1);
  }
  state.tacticsNovelFrame = requestAnimationFrame(drawTacticsNovelFrame);
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
  const weapons = ["HG 0.48", "SMG 0.42", "AR 0.58", "SR 1.35"];
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
  KeyZ: "clairvoyance",
  KeyX: "empButton",
  KeyF: "manaConversionButton",
  KeyB: "cameraButton",
  KeyN: "nextCameraButton",
  KeyV: "vendingButton",
  KeyH: "operatorAbilityButton",
  KeyJ: "jumpButton",
  KeyK: "sleepButton",
  KeyC: "renkiButton",
  KeyL: "sabotageButton",
  KeyU: "utilityButton",
  KeyE: "contextActionButton",
  KeyY: "fullscreenButton",
  KeyM: "mapActionButton",
  Backslash: "gameMuteButton",
  IntlYen: "gameMuteButton"
};

const CHARACTER_ACTION_BY_API = Object.freeze({
  "/api/kill": "attack",
  "/api/ninjutsu": "attack",
  "/api/shoot": "shoot",
  "/api/gunner-weapon": "weapon-switch",
  "/api/gunner-reload": "reload",
  "/api/gunner-heavy": "shoot",
  "/api/dodge": "evade",
  "/api/fighter-slash": "slash",
  "/api/limit-break": "power",
  "/api/sleep": "rest",
  "/api/donate": "interact",
  "/api/teleport": "cast",
  "/api/gravity-time": "cast",
  "/api/gravity-time-keeper": "power",
  "/api/gravity-storm": "power",
  "/api/instant-warp": "cast",
  "/api/purchase": "interact",
  "/api/fire-jutsu": "cast",
  "/api/quantum-control": "cast",
  "/api/clairvoyance": "focus",
  "/api/item-use": "interact",
  "/api/item-pickup": "interact",
  "/api/item-throw": "throw",
  "/api/flora-heal": "heal",
  "/api/alchemist-invention": "cast",
  "/api/borrowed-ability": "cast",
  "/api/emergency": "interact",
  "/api/luminous": "cast",
  "/api/vote": "interact",
  "/api/sabotage": "interact",
  "/api/repair": "interact",
  "/api/utility": "interact",
  "/api/transfer": "interact",
  "/api/emp": "cast",
  "/api/mana-conversion": "cast",
  "/api/jump": "jump"
});

const CHARACTER_ACTION_DURATION = Object.freeze({
  attack: 520,
  slash: 620,
  shoot: 260,
  "weapon-switch": 560,
  reload: 760,
  evade: 560,
  cast: 820,
  heal: 900,
  power: 980,
  "heart-transfer": 1800,
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
  "heart-transfer": 0,
  focus: 8,
  rest: 9,
  interact: 10,
  jump: 11,
  // Throw release has dedicated timing and body mechanics while retaining the empty-hand attack cells.
  throw: 0
});
function triggerCharacterAction(playerId, kind, duration = CHARACTER_ACTION_DURATION[kind] || 700, startedAt = state.frameNow || performance.now(), sourceEffectId = "", variant = "", motionId = kind) {
  if (!playerId || !kind) return;
  state.characterActions.set(playerId, {
    kind,
    startedAt,
    duration: Math.max(120, Number(duration) || 700),
    sourceEffectId,
    variant: String(variant || ""),
    motionId: String(motionId || kind)
  });
}

const MAGIC_EFFECT_CHARACTER_ACTION = Object.freeze({
  "action-grit": "evade",
  "action-stand": "evade",
  "action-dodge": "evade",
  "action-rest": "rest",
  "action-teleport": "cast",
  "action-heart-teleport": "heart-transfer",
  "action-warp": "cast",
  "action-ninjutsu-focus": "focus",
  "action-renki": "focus",
  "action-task": "interact",
  "action-clairvoyance": "focus",
  "action-shoot": "shoot",
  "action-reload": "reload",
  "action-item-use": "interact",
  "action-item-throw": "throw",
  "action-special-ammo-load": "reload",
  "action-gunner-aim-headshot": "shoot",
  "action-gunner-headshot": "shoot",
  "item-hsg-activate": "power",
  "gunner-passive-aim": "focus",
  "action-weapon-switch": "weapon-switch",
  "action-reason": "attack",
  "action-push": "attack",
  "action-sabotage": "interact",
  "action-repair": "interact",
  "action-smartphone": "interact",
  "action-smartphone-repair": "interact",
  "action-vending": "interact",
  "action-mana": "focus",
  "action-alchemy": "cast",
  "action-jump": "jump",
  "action-fighter-dodge-counter": "slash",
  "transfer-out": "interact",
  "transfer-in": "interact",
  "fighter-slash": "slash",
  "fighter-slash-parry": "slash",
  "fighter-iaido": "slash",
  "fighter-energy-release": "throw",
  "fighter-energy-impact": null,
  "fighter-shockwave": "slash",
  "gunner-rpg": "shoot",
  "gunner-missile": "shoot",
  "gunner-nuclear": "power",
  "fire": "cast",
  "substitution": "evade",
  "flora": "heal",
  "flora-sunbeam": "cast",
  "flora-invisible": "cast",
  "limit-break": "power",
  "emp": "cast",
  "emp-charge": "cast",
  "gravity-accelerate": "cast",
  "gravity-decelerate": "cast",
  "gravity-time-keeper": "power",
  "gravity-storm": "power",
  "quantum-transmutation": "cast",
  "quantum-temperature-cold": "cast",
  "quantum-temperature-hot": "power",
  "quantum-nuclear": "power",
  "quantum-nuclear-fusion": "power",
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

function magicCharacterActionKind(type, variant = "") {
  // Tasks and Hacker content application intentionally keep the character
  // physically still; their UI/progress and Vibe Coding ATE own the feedback.
  if (type === "action-task" || type === "action-alchemy" || type === "action-renki") return null;
  if (type === "fighter-energy-charge") {
    return /(?:^|:)milestone-motion-(?:500|1000)(?::|$)/.test(String(variant || "")) ? "power" : null;
  }
  if (MAGIC_EFFECT_CHARACTER_ACTION[type]) return MAGIC_EFFECT_CHARACTER_ACTION[type];
  // Map objects keep their dedicated B effect, but do not drive a character motion.
  if (type.startsWith("object-") || type.startsWith("alchemy-object-")) return null;
  // Storm victim and barrier-hit effects must not repeatedly overwrite the
  // caster's activation motion. Only the root gravity-storm event owns it.
  if (type.startsWith("gravity-storm-")) return null;
  if (type.startsWith("emp-")) return "cast";
  if (/fighter-(iaido|slash)|action-fighter/.test(type)) return "slash";
  if (/gunner-(rpg|missile|nuclear)|railgun|particle|sunbeam/.test(type)) return "shoot";
  if (/flora/.test(type)) return "heal";
  if (/dodge|substitution|stand/.test(type)) return "evade";
  if (/limit-break|item-hsg|idea-/.test(type)) return "power";
  if (/gunner-aim/.test(type)) return "focus";
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
  "Alt+Digit4": "hack",
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
  suppressClickUntil: 0,
  originX: 0,
  originY: 0,
  moved: false,
  held: false
};

function vendingProductDetail(button) {
  const id = String(button?.dataset?.drink || "");
  return {
    label: VENDING_PRODUCT_LABELS[id] || id || "自販機商品",
    output: "自販機商品",
    badge: "",
    detail: VENDING_PRODUCT_DESCRIPTIONS[id] || "購入後に所持品から使用できます。"
  };
}

async function purchaseVendingItem(button, { bulk = false } = {}) {
  if (!button || button.disabled || button.hidden || button.dataset.purchaseDisabled === "1" || button.dataset.purchasePending === "1") return false;
  button.dataset.purchasePending = "1";
  try {
    // Bulk purchase is a single authoritative transaction.  Repeating normal
    // purchases locally races credit changes and can buy a partial, accidental
    // sequence when a long press is released or a panel is rebuilt.
    return await api("/api/purchase", { itemId: button.dataset.drink, ...(bulk ? { bulk: true } : {}) });
  } finally {
    delete button.dataset.purchasePending;
  }
}

function stopVendingHold({ suppressClick = false } = {}) {
  const button = vendingHold.button;
  const pointerId = vendingHold.pointerId;
  if (vendingHold.timer) window.clearTimeout(vendingHold.timer);
  if (suppressClick) vendingHold.suppressClickUntil = performance.now() + 1_200;
  vendingHold.timer = 0;
  vendingHold.button = null;
  vendingHold.pointerId = null;
  vendingHold.originX = 0;
  vendingHold.originY = 0;
  vendingHold.moved = false;
  vendingHold.held = false;
  if (button && pointerId !== null) {
    try {
      if (button.hasPointerCapture?.(pointerId)) button.releasePointerCapture(pointerId);
    } catch {}
  }
}

function stopVendingKeyHold() {
  const code = state.continuousActionKeyHold?.code || "";
  if (vendingHotkeys[code] || vendingHotkeys[`Alt+${code}`]) stopContinuousActionKeyHold(code);
}

function startVendingHold(event, button) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  if (!button) return;
  stopVendingHold();
  vendingHold.button = button;
  vendingHold.pointerId = event.pointerId;
  vendingHold.originX = event.clientX;
  vendingHold.originY = event.clientY;
  vendingHold.timer = window.setTimeout(() => {
    if (vendingHold.button !== button || vendingHold.moved) return;
    vendingHold.timer = 0;
    vendingHold.held = true;
    vendingHold.suppressClickUntil = performance.now() + 1_200;
    try { button.setPointerCapture(event.pointerId); } catch {}
    if (state.vendingBulkPurchase) {
      // Exactly one request owns the whole all-credit purchase.  The server
      // computes the purchasable count from its current authoritative credits.
      void purchaseVendingItem(button, { bulk: true });
    } else {
      showInventoryItemDetail(vendingProductDetail(button), button);
    }
    if (navigator.vibrate) navigator.vibrate(18);
  }, 520);
}

function moveVendingHold(event) {
  if (vendingHold.pointerId !== event.pointerId || !vendingHold.button) return;
  if (!vendingHold.moved && Math.hypot(
    event.clientX - vendingHold.originX,
    event.clientY - vendingHold.originY
  ) > 9) {
    vendingHold.moved = true;
    stopVendingHold({ suppressClick: true });
  }
}

function finishVendingHold(event) {
  if (vendingHold.pointerId !== event.pointerId || !vendingHold.button) return;
  const wasHeld = vendingHold.held;
  if (wasHeld || vendingHold.moved) {
    if (event.cancelable) event.preventDefault();
    event.stopPropagation();
    stopVendingHold({ suppressClick: true });
    return;
  }
  vendingHold.suppressClickUntil = performance.now() + 1_200;
  stopVendingHold();
  void purchaseVendingItem(event.currentTarget);
}

function cancelVendingHold(event) {
  if (vendingHold.pointerId !== event.pointerId) return;
  stopVendingHold({ suppressClick: true });
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
  "fullscreenButton",
  "ninjutsuButton",
  "contextActionButton"
]);

function isContinuousGameActionButton(button) {
  if (!(button instanceof HTMLButtonElement) || button.hidden) return false;
  if (state.screen !== "game" || state.data?.phase !== "playing") return false;
  if (switchDragDescriptorForSource(button)) return false;
  if (button.dataset.repeatableAbility === "0") return false;
  if (isAbilityBatchButton(button)) return false;
  if (
    SPECIALIZED_HOLD_ACTION_IDS.has(button.id) ||
    NON_REPEATABLE_ACTION_HOTKEY_BUTTONS.has(button.id) ||
    button.matches("[data-drink]")
  ) return false;
  if (button.id === "tabletAbilityShortcut") {
    return button.dataset.repeatableAbility === "1";
  }
  if ([
    "tabletEmpShortcut",
    "tabletDodgeShortcut",
    "tabletRestShortcut",
    "tabletDonateShortcut"
  ].includes(button.id)) return true;
  if (["ninjutsuButton", "tabletNinjutsuShortcut"].includes(button.id)) {
    return false;
  }
  // Ordinary gameplay buttons are one-shot.  Ability batching has its own
  // server-observed hold transaction, and selector controls own their own
  // long-press behavior; neither may fall back to this old repeat controller.
  if (button.dataset.repeatableAbility === "1" || button.closest("#operatorBranchList")) return false;
  return Boolean(button.closest("#actionCommandRegistry"));
}

function isGameActionUnavailable(button) {
  return Boolean(
    !button ||
    button.disabled ||
    button.dataset.actionDisabled === "1" ||
    button.getAttribute("aria-disabled") === "true"
  );
}

function invokeContinuousGameAction(button, { allowHidden = false, initial = false } = {}) {
  if (!button?.isConnected || isGameActionUnavailable(button)) return false;
  if (!allowHidden && (button.hidden || button.closest("[hidden]"))) return false;
  // The action keeps its existing icon, physical motion, and B-generated effect.
  // Holding only changes input cadence, so no new visual asset meaning is introduced.
  const source = button === els.tabletAbilityShortcut ? els.operatorAbilityButton : button;
  if (!source || isGameActionUnavailable(source) || source.hidden) return false;
  const fighterSlash = isOrichalcumSwordActionButton(button);
  const previousGuardIntent = state.fighterSlashGuardIntent;
  if (fighterSlash) state.fighterSlashGuardIntent = Boolean(initial);
  try {
    source.click();
  } finally {
    if (fighterSlash) state.fighterSlashGuardIntent = previousGuardIntent;
  }
  return true;
}

function continuousGameActionInterval(button) {
  return CONTINUOUS_ACTION_REPEAT_INTERVAL_MS;
}

function isOrichalcumSwordActionButton(button) {
  if (button !== els.itemUseButton) return false;
  const selected = String(state.selectedWeaponItemId || "");
  return selected === "orichalcum-sword";
}

function requestFighterSlash(targetId, perfectGuardIntent = false) {
  const request = api("/api/fighter-slash", { targetId, perfectGuardIntent: Boolean(perfectGuardIntent) });
  state.fighterSlashPendingRequests.add(request);
  request.then(
    () => state.fighterSlashPendingRequests.delete(request),
    () => state.fighterSlashPendingRequests.delete(request)
  );
  return request;
}

function queueFighterSlashGuardRelease() {
  if (!state.roomId || !state.playerId) return false;
  const roomId = state.roomId;
  const playerId = state.playerId;
  const pending = [...state.fighterSlashPendingRequests];
  void Promise.allSettled(pending).then(() => {
    if (state.roomId !== roomId || state.playerId !== playerId) return false;
    return api("/api/fighter-slash-release");
  });
  return true;
}

function stopContinuousActionKeyHold(code = "") {
  const hold = state.continuousActionKeyHold;
  if (code && hold.code !== code) return false;
  const releaseFighterSlash = hold.fighterSlash;
  if (hold.timer) window.clearTimeout(hold.timer);
  hold.code = "";
  hold.repeat = null;
  hold.timer = 0;
  hold.repeatInterval = 0;
  hold.fighterSlash = false;
  if (releaseFighterSlash) queueFighterSlashGuardRelease();
  return true;
}

function beginContinuousActionKeyHold(code, repeat, repeatInterval = CONTINUOUS_ACTION_REPEAT_INTERVAL_MS, fighterSlash = false) {
  if (!code || typeof repeat !== "function") return false;
  stopContinuousActionKeyHold();
  const hold = state.continuousActionKeyHold;
  hold.code = code;
  hold.repeat = repeat;
  hold.repeatInterval = Math.max(80, Number(repeatInterval) || CONTINUOUS_ACTION_REPEAT_INTERVAL_MS);
  hold.fighterSlash = Boolean(fighterSlash);
  const tick = () => {
    if (hold.code !== code || hold.repeat !== repeat) return;
    if (state.screen !== "game" || state.data?.phase !== "playing") {
      stopContinuousActionKeyHold(code);
      return;
    }
    if (repeat(false) === false) {
      stopContinuousActionKeyHold(code);
      return;
    }
    hold.timer = window.setTimeout(tick, hold.repeatInterval);
  };
  if (repeat(true) === false) {
    stopContinuousActionKeyHold(code);
    return false;
  }
  hold.timer = window.setTimeout(tick, Math.max(CONTINUOUS_ACTION_HOLD_DELAY_MS, hold.repeatInterval));
  return true;
}

function beginContinuousButtonKeyHold(code, resolveButton) {
  const initialButton = resolveButton?.();
  const repeatInterval = continuousGameActionInterval(initialButton);
  const fighterSlash = isOrichalcumSwordActionButton(initialButton);
  return beginContinuousActionKeyHold(code, (initial = false) => {
    const button = resolveButton?.();
    if (!isContinuousGameActionButton(button)) return false;
    if (!isGameActionUnavailable(button)) invokeContinuousGameAction(button, { allowHidden: true, initial });
    return true;
  }, repeatInterval, fighterSlash);
}

function stopContinuousActionHold(pointerId = null) {
  const hold = state.continuousActionHold;
  if (pointerId !== null && hold.pointerId !== pointerId) return false;
  const releaseFighterSlash = hold.fighterSlash;
  const capturedPointerId = hold.pointerId;
  const capturedButton = hold.button;
  if (hold.button) state.continuousActionSuppressClicks.set(hold.button, performance.now() + 600);
  if (hold.timer) window.clearTimeout(hold.timer);
  hold.timer = 0;
  hold.pointerId = null;
  hold.button = null;
  hold.fighterSlash = false;
  if (capturedButton && capturedPointerId !== null) {
    try {
      if (capturedButton.hasPointerCapture?.(capturedPointerId)) capturedButton.releasePointerCapture(capturedPointerId);
    } catch {}
  }
  if (releaseFighterSlash) queueFighterSlashGuardRelease();
  return true;
}

function beginContinuousActionHold(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  const button = event.target instanceof Element ? event.target.closest("button") : null;
  // Hacker generation cards own their pointer hold for detail display. Vibe
  // Coding generation is intentionally one-shot and never enters repeat.
  if (button?.closest("#hackerAbilityGrid")) return;
  // Kinetic control owns the pointer until release so a long hold can choose
  // exactly one branch without firing the remembered action on pointerdown.
  if ((button === els.operatorAbilityButton || button === els.tabletAbilityShortcut) && quantumKineticHoldEligible()) return;
  if (!isContinuousGameActionButton(button)) return;
  event.preventDefault();
  stopContinuousActionHold();
  const hold = state.continuousActionHold;
  hold.pointerId = event.pointerId;
  hold.button = button;
  hold.fighterSlash = isOrichalcumSwordActionButton(button);
  state.continuousActionSuppressClicks.set(button, Number.POSITIVE_INFINITY);
  try { button.setPointerCapture(event.pointerId); } catch {}
  invokeContinuousGameAction(button, { initial: true });
  const repeatInterval = continuousGameActionInterval(button);
  const repeat = () => {
    if (hold.pointerId !== event.pointerId || hold.button !== button) return;
    if (state.screen !== "game" || state.data?.phase !== "playing" || !button.isConnected) {
      stopContinuousActionHold(event.pointerId);
      return;
    }
    if (!isGameActionUnavailable(button) && !button.hidden && !button.closest("[hidden]")) invokeContinuousGameAction(button, { initial: false });
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
    chargeId: "",
    targetX: 0,
    targetY: 0,
    startedAt: 0,
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
  const elapsed = clamp(timestamp - (target.lastFrameAt || timestamp), 0, 40);
  target.lastFrameAt = timestamp;
  const direction = throwTargetDirection();
  if (direction.dx || direction.dy) {
    const distance = ITEM_THROW_TARGET_CURSOR_SPEED * elapsed / 1000;
    moveThrowTarget(direction.dx * distance, direction.dy * distance);
  }
  syncClairvoyanceManaUsage();
  updateEnhanceReadout();
  target.frame = requestAnimationFrame(updateThrowTargetingFrame);
}

function beginThrowTargeting(itemId, holdMs = 0, chargeId = "") {
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
    chargeId: String(chargeId || ""),
    targetX: preview.x,
    targetY: preview.y,
    startedAt: timestamp,
    lastFrameAt: timestamp,
    frame: 0,
    directionKeys: new Set()
  };
  state.throwTargeting.frame = requestAnimationFrame(updateThrowTargetingFrame);
  updateEnhanceReadout();
  showToast("着地点選択は時間制限なし。移動キーで接地点を動かし、キーを離すか確定操作で投擲、Escで取消します。");
  return true;
}

function cancelThrowTargeting(silent = false, message = "投擲をキャンセルしました。", { preserveCharge = false, recoverOnFailure = true } = {}) {
  if (!state.throwTargeting.active) return false;
  if (state.throwTargeting.frame) cancelAnimationFrame(state.throwTargeting.frame);
  state.throwTargeting = emptyThrowTargetingState();
  if (!preserveCharge) void clearServerEnhanceCharge({ recoverOnFailure });
  syncClairvoyanceManaUsage();
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
  const { itemId, holdMs, chargeId, targetX, targetY } = state.throwTargeting;
  cancelThrowTargeting(true, "", { preserveCharge: true });
  return api("/api/item-throw", { itemId, holdMs, chargeId, targetX, targetY });
}

function abilityBatchSource(button) {
  if (button?.tabletSource) return abilityBatchSource(button.tabletSource);
  if (button === els.tabletAbilityShortcut) return els.operatorAbilityButton;
  if (button === els.tabletRenkiShortcut) return els.renkiButton;
  return button;
}

function isAbilityBatchButton(button) {
  const source = abilityBatchSource(button);
  return source === els.operatorAbilityButton || source === els.renkiButton;
}

const ABILITY_BATCH_CLIENT_PATHS = new Set([
  "/api/renki",
  "/api/teleport",
  "/api/gravity-time",
  "/api/gravity-time-keeper",
  "/api/gravity-storm",
  "/api/quantum-control",
  "/api/flora-heal",
  "/api/borrowed-ability"
]);

function abilityBatchActionSupported(action) {
  if (!action || !ABILITY_BATCH_CLIENT_PATHS.has(action.path)) return false;
  if (action.path !== "/api/borrowed-ability") return true;
  return ["gravity", "flora", "quantum"].includes(String(action.action?.ability || ""));
}

function abilityBatchEligible(button) {
  const source = abilityBatchSource(button);
  if (!isAbilityBatchButton(source) || isGameActionUnavailable(source) || source.hidden) return false;
  const self = state.data?.self;
  if (!self || state.screen !== "game" || state.data?.phase !== "playing") return false;
  // A map destination is a separate targeting interaction, not a repeatable
  // ability execution. Its existing hold/select semantics stay untouched.
  if (source === els.operatorAbilityButton && self.special === "teleport" &&
    ["body", "target"].includes(els.teleportModeSelect.value)) return false;
  return abilityBatchActionSupported(abilityBatchAction(source));
}

function operatorAbilityAction() {
  const self = state.data?.self;
  if (!self) return null;
  if (self.special === "fighter") return { path: "/api/limit-break", action: {} };
  if (self.special === "teleport") {
    const mode = els.teleportModeSelect.value;
    const targetId = els.teleportTargetSelect.value || self.id;
    if (["body", "target"].includes(mode)) return null;
    if (["heart", "near"].includes(mode)) return { path: "/api/teleport", action: { targetId, mode } };
    if (["accelerate", "decelerate"].includes(mode)) return { path: "/api/gravity-time", action: { targetId, mode } };
    if (mode === "storm") return { path: "/api/gravity-storm", action: { targetId } };
    if (mode === "time-keeper") return { path: "/api/gravity-time-keeper", action: {} };
    return null;
  }
  if (self.special === "flora") {
    const mode = els.teleportModeSelect.value;
    return { path: "/api/flora-heal", action: {
      mode: ["sunbeam", "invisible"].includes(mode) ? mode : "heal",
      targetId: mode === "sunbeam" ? (els.teleportTargetSelect.value || "") : "",
      dx: Number(self.aimX) || 0,
      dy: Number(self.aimY) || 1
    } };
  }
  if (self.special === "quantum") return { path: "/api/quantum-control", action: { mode: selectedQuantumExecutableMode(false) } };
  if (self.special === "alchemist") return { path: "/api/hacker-root", action: {} };
  return null;
}

function newAbilityBatchHoldId() {
  return globalThis.crypto?.randomUUID?.() || `ability-batch-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function borrowedAbilityAction() {
  const self = state.data?.self;
  const type = selectedBorrowedOperator();
  const recipe = alchemyRecipes.find((entry) => entry.id === `borrowed-${type}`);
  if (!self || !recipe || !alchemyRecipeAvailable(recipe)) return null;
  const mode = state.borrowedAbilityModes[type] || els.teleportModeSelect.value;
  if (type === "gravity" && ["body", "target"].includes(mode)) return null;
  return { path: "/api/borrowed-ability", action: borrowedAbilityPayload(recipe, mode) };
}

function abilityBatchAction(button) {
  const source = abilityBatchSource(button);
  if (source === els.renkiButton) return { path: "/api/renki", action: {}, renki: true };
  return operatorAbilityAction();
}

function rootShortcutHoldEligible(button) {
  const source = abilityBatchSource(button);
  const self = state.data?.self;
  return Boolean(
    source === els.operatorAbilityButton &&
    self?.special === "alchemist" &&
    self.hackerRootActive &&
    state.screen === "game" &&
    state.data?.phase === "playing" &&
    self.alive &&
    !self.ejected &&
    !isGameActionUnavailable(source)
  );
}

function stopRootShortcutHold(pointerId = null, { cancelled = false, deactivate = false } = {}) {
  const hold = state.rootShortcutHold;
  if (pointerId !== null && hold.pointerId !== pointerId) return false;
  if (hold.timer) window.clearTimeout(hold.timer);
  const capturedPointerId = hold.pointerId;
  const button = hold.button;
  hold.pointerId = null;
  hold.button = null;
  hold.timer = 0;
  if (!button) return false;
  state.continuousActionSuppressClicks.set(button, performance.now() + 700);
  if (capturedPointerId !== null) {
    try {
      if (button.hasPointerCapture?.(capturedPointerId)) button.releasePointerCapture(capturedPointerId);
    } catch {}
  }
  if (deactivate) void api("/api/hacker-root");
  else if (!cancelled) triggerSelectedBorrowedAbility();
  return true;
}

function beginRootShortcutHold(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  const button = event.target instanceof Element ? event.target.closest("button") : null;
  if (!rootShortcutHoldEligible(button)) return;
  const localScroll = event.pointerType !== "mouse" && isFullscreenScrollableSurface(resolveFullscreenScrollableSurface(button));
  if (!localScroll) event.preventDefault();
  stopRootShortcutHold(null, { cancelled: true });
  const hold = state.rootShortcutHold;
  hold.pointerId = event.pointerId;
  hold.button = button;
  state.continuousActionSuppressClicks.set(button, Number.POSITIVE_INFINITY);
  if (!localScroll) {
    try { button.setPointerCapture(event.pointerId); } catch {}
  }
  hold.timer = window.setTimeout(() => {
    if (hold.pointerId !== event.pointerId || hold.button !== button) return;
    stopRootShortcutHold(event.pointerId, { deactivate: true });
  }, ROOT_SHORTCUT_HOLD_DELAY_MS);
}

function finishRootShortcutPointerHold(event, cancelled = false) {
  if (state.rootShortcutHold.pointerId !== event.pointerId) return false;
  return stopRootShortcutHold(event.pointerId, { cancelled });
}

function stopRootShortcutKeyHold(code = "", { cancelled = false, deactivate = false } = {}) {
  const hold = state.rootShortcutKeyHold;
  if (code && hold.code !== code) return false;
  if (hold.timer) window.clearTimeout(hold.timer);
  const button = hold.button;
  hold.code = "";
  hold.button = null;
  hold.timer = 0;
  if (!button) return false;
  if (deactivate) void api("/api/hacker-root");
  else if (!cancelled) triggerSelectedBorrowedAbility();
  return true;
}

function beginRootShortcutKeyHold(code, button) {
  if (!code || !rootShortcutHoldEligible(button)) return false;
  stopRootShortcutKeyHold("", { cancelled: true });
  const hold = state.rootShortcutKeyHold;
  hold.code = code;
  hold.button = button;
  hold.timer = window.setTimeout(() => {
    if (hold.code !== code || hold.button !== button) return;
    stopRootShortcutKeyHold(code, { deactivate: true });
  }, ROOT_SHORTCUT_HOLD_DELAY_MS);
  return true;
}

function cancelActiveRootShortcutHolds() {
  stopRootShortcutHold(null, { cancelled: true });
  stopRootShortcutKeyHold("", { cancelled: true });
}

async function beginAbilityBatchTransaction(button, hold) {
  const action = abilityBatchAction(button);
  if (!action) return null;
  hold.action = action;
  hold.holdId = newAbilityBatchHoldId();
  const started = await api("/api/ability-hold", {
    phase: "start",
    holdId: hold.holdId,
    actionPath: action.path,
    action: action.action
  });
  const holdId = started?.abilityHold?.id || hold.holdId;
  if (!holdId) return null;
  hold.holdId = holdId;
  return holdId;
}

async function dispatchAbilityBatch(button, hold, { autoCommit = false } = {}) {
  const source = abilityBatchSource(button);
  const holdId = await hold.startPromise;
  if (!source || isGameActionUnavailable(source) || !holdId || !abilityBatchActionSupported(hold.action)) return false;
  const payload = {
    ...hold.action.action,
    [hold.action.renki ? "renkiHoldId" : "abilityHoldId"]: holdId,
    ...(autoCommit ? { abilityHoldAutoCommit: true } : {})
  };
  await api(hold.action.path, payload);
  return true;
}

async function cancelAbilityBatchTransaction(hold) {
  const holdId = await hold?.startPromise;
  if (!holdId || !hold?.action?.path) return false;
  return api("/api/ability-hold", { phase: "cancel", actionPath: hold.action.path, holdId });
}

function stopAbilityBatchHold(pointerId = null, { dispatch = false, autoCommit = false, notifyServer = true } = {}) {
  const hold = state.abilityBatchHold;
  if (pointerId !== null && hold.pointerId !== pointerId) return false;
  if (hold.timer) window.clearTimeout(hold.timer);
  const capturedPointerId = hold.pointerId;
  const { button, held, action, startPromise } = hold;
  const transaction = { action, startPromise };
  hold.pointerId = null;
  hold.button = null;
  hold.timer = 0;
  hold.held = false;
  hold.holdId = "";
  hold.action = null;
  hold.startPromise = null;
  if (button) state.continuousActionSuppressClicks.set(button, performance.now() + 700);
  if (button && capturedPointerId !== null) {
    try {
      if (button.hasPointerCapture?.(capturedPointerId)) button.releasePointerCapture(capturedPointerId);
    } catch {}
  }
  if (dispatch) return dispatchAbilityBatch(button, transaction, { autoCommit });
  if (button && notifyServer) void cancelAbilityBatchTransaction(transaction);
  return Boolean(button);
}

function beginAbilityBatchHold(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  const button = event.target instanceof Element ? event.target.closest("button") : null;
  if (!abilityBatchEligible(button)) return;
  // Do not claim a pointer that began in an actually overflowing native
  // surface.  Touch scrolling then emits pointercancel before the threshold;
  // a stationary tap/hold still reaches the same global finish/timer route.
  const localScroll = event.pointerType !== "mouse" && isFullscreenScrollableSurface(resolveFullscreenScrollableSurface(button));
  if (!localScroll) event.preventDefault();
  stopAbilityBatchHold();
  const hold = state.abilityBatchHold;
  hold.pointerId = event.pointerId;
  hold.button = button;
  hold.startPromise = beginAbilityBatchTransaction(button, hold);
  if (!localScroll) {
    try { button.setPointerCapture(event.pointerId); } catch {}
  }
  hold.timer = window.setTimeout(() => {
    if (hold.pointerId !== event.pointerId || hold.button !== button) return;
    hold.held = true;
    void stopAbilityBatchHold(event.pointerId, { dispatch: true, autoCommit: true });
  }, ABILITY_BATCH_HOLD_DELAY_MS);
}

function finishAbilityBatchPointerHold(event, cancelled = false) {
  const hold = state.abilityBatchHold;
  if (hold.pointerId !== event.pointerId) return false;
  const button = hold.button;
  stopAbilityBatchHold(event.pointerId, { dispatch: !cancelled });
  return Boolean(button);
}

function stopAbilityBatchKeyHold(code = "", { dispatch = false, autoCommit = false, notifyServer = true } = {}) {
  const hold = state.abilityBatchKeyHold;
  if (code && hold.code !== code) return false;
  if (hold.timer) window.clearTimeout(hold.timer);
  const { button, held, action, startPromise } = hold;
  const transaction = { action, startPromise };
  hold.code = "";
  hold.button = null;
  hold.timer = 0;
  hold.held = false;
  hold.holdId = "";
  hold.action = null;
  hold.startPromise = null;
  if (dispatch) return dispatchAbilityBatch(button, transaction, { autoCommit });
  if (button && notifyServer) void cancelAbilityBatchTransaction(transaction);
  return Boolean(button);
}

function beginAbilityBatchKeyHold(code, button) {
  if (!code || !abilityBatchEligible(button)) return false;
  stopAbilityBatchKeyHold();
  const hold = state.abilityBatchKeyHold;
  hold.code = code;
  hold.button = button;
  hold.startPromise = beginAbilityBatchTransaction(button, hold);
  hold.timer = window.setTimeout(() => {
    if (hold.code !== code || hold.button !== button) return;
    hold.held = true;
    void stopAbilityBatchKeyHold(code, { dispatch: true, autoCommit: true });
  }, ABILITY_BATCH_HOLD_DELAY_MS);
  return true;
}

function cancelActiveAbilityBatchHolds({ notifyServer = true } = {}) {
  stopAbilityBatchHold(null, { dispatch: false, notifyServer });
  stopAbilityBatchKeyHold("", { dispatch: false, notifyServer });
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
  if (!view.requestPending && view.serverDesired && !data.self.clairvoyanceActive && Number(data.self.mana) <= 0) {
    setLocalClairvoyanceActive(false, data);
    syncClairvoyanceManaUsage();
    showToast("千里眼はMP切れで終了しました。");
    return;
  }
  const elapsed = clamp(timestamp - (view.lastFrameAt || timestamp), 0, 40);
  view.lastFrameAt = timestamp;
  const direction = clairvoyanceDirection();
  if (direction.dx || direction.dy) {
    const acceleration = state.clairvoyance.active
      ? 2
      : clamp(Number(data.self.accelerationMultiplier) || 1, 0.25, 16);
    const distance = 540 * acceleration * elapsed / 1000;
    view.x = clamp(view.x + direction.dx * distance, 0, data.map.width);
    view.y = clamp(view.y + direction.dy * distance, 0, data.map.height);
  }
  view.frame = requestAnimationFrame(updateClairvoyanceFrame);
}

function setLocalClairvoyanceActive(shouldEnable, data = state.data) {
  const view = state.clairvoyance;
  const serverDesired = Boolean(view.serverDesired);
  const requestPending = Boolean(view.requestPending);
  const requestSerial = Number(view.requestSerial) || 0;
  if (view.frame) cancelAnimationFrame(view.frame);
  clearMovementInput();
  rotateMovementSession();
  sendMovement(true);
  if (!shouldEnable) {
    state.clairvoyanceTeleportTap = null;
    state.clairvoyanceTeleportRequestSerial += 1;
    state.clairvoyance = {
      active: false,
      x: 0,
      y: 0,
      lastFrameAt: 0,
      frame: 0,
      serverDesired,
      requestPending,
      requestSerial
    };
    state.camera.initialized = false;
    updateActionButtons(data);
    return true;
  }
  const self = data.players.find((player) => player.id === data.selfId);
  if (!self) return false;
  const origin = renderedPlayer(self);
  const timestamp = performance.now();
  state.clairvoyance = {
    active: true,
    x: origin.x,
    y: origin.y,
    lastFrameAt: timestamp,
    frame: 0,
    serverDesired,
    requestPending,
    requestSerial
  };
  state.clairvoyance.frame = requestAnimationFrame(updateClairvoyanceFrame);
  state.camera.initialized = false;
  updateActionButtons(data);
  return true;
}

function requestClairvoyanceManaUsage(active) {
  const view = state.clairvoyance;
  const desired = Boolean(active);
  if (view.serverDesired === desired && (view.requestPending || Boolean(state.data?.self?.clairvoyanceActive) === desired)) return;
  view.serverDesired = desired;
  view.requestPending = true;
  view.requestSerial = (Number(view.requestSerial) || 0) + 1;
  const requestSerial = view.requestSerial;
  if (!state.roomId || !state.playerId) {
    view.requestPending = false;
    return;
  }
  void api("/api/clairvoyance", { active: desired }).then((result) => {
    if (state.clairvoyance.requestSerial !== requestSerial) return;
    state.clairvoyance.requestPending = false;
    const accepted = Boolean(result?.self?.clairvoyanceActive);
    if (desired && !accepted && state.clairvoyance.active) setLocalClairvoyanceActive(false, result || state.data);
  });
}

function syncClairvoyanceManaUsage() {
  const throwObservation = throwTargetClairvoyanceActive(state.data);
  requestClairvoyanceManaUsage(state.clairvoyance.active || throwObservation);
}

function toggleClairvoyance(force = null) {
  const data = state.data;
  const shouldEnable = force === null ? !state.clairvoyance.active : Boolean(force);
  if (shouldEnable && (
    !data ||
    data.phase !== "playing" ||
    !data.self?.alive ||
    data.self.ejected ||
    Number(data.self.mana) <= 0
  )) return false;
  const changed = setLocalClairvoyanceActive(shouldEnable, data);
  if (!changed) return false;
  syncClairvoyanceManaUsage();
  if (shouldEnable) {
    const drain = Number(data?.self?.clairvoyanceManaPerSecond) || 0.25;
    showToast(`千里眼を起動しました。観測中 ${drain.toFixed(2)}MP/秒。`);
  }
  return true;
}

function clientGboEligibleItemId(itemId) {
  const id = String(itemId || "");
  return id === "hsg" || id === "orichalcum-sword" || id.startsWith("weapon:") || id.startsWith("heavy:") || id.startsWith("invention:");
}

function updateEnhanceReadout() {
  if (!els.enhanceReadout) return;
  if (state.throwTargeting.active) {
    els.enhanceReadout.textContent = "接地点指定中 / 移動キーを離して確定 / Escでキャンセル";
    return;
  }
  const hold = state.enhanceHold;
  const elapsed = hold.startedAt ? Math.max(0, performance.now() - hold.startedAt) : 0;
  const requested = Math.min(ENHANCE_MAX_LEVEL_CLIENT, Math.floor(elapsed / ENHANCE_HOLD_STEP_MS_CLIENT));
  const mana = Math.max(0, Number(state.data?.self?.mana) || 0);
  const gbo = Boolean(hold.kind && clientGboEligibleItemId(hold.itemId) && elapsed >= GBO_HOLD_MS_CLIENT);
  els.enhanceReadout.textContent = !hold.kind
    ? "長押し: 600msからエンハンス / 武具は3000msでGBO"
    : gbo
      ? mana >= 2 ? "GBO / 性能×10 / -2MP / 使用後に武具破壊" : "GBO / MP不足（2MP必要） / 解放時は不成立"
      : requested > 0
        ? mana >= 1 ? "エンハンス / -1MP" : "エンハンス / MP不足（1MP必要）"
        : "通常動作 / 0MP";
  if (hold.kind) hold.timer = requestAnimationFrame(updateEnhanceReadout);
}

function beginEnhanceAction(kind, pointerId = null) {
  if (!kind || state.enhanceHold.kind) return false;
  const itemId = kind === "shoot"
    ? `weapon:${String(state.data?.self?.gunnerWeapon || "")}`
    : kind === "fire"
      ? "fire-jutsu"
      : ["use", "throw"].includes(kind) ? String(els.itemSelect?.value || "") : "";
  const chargeKind = kind === "use" && itemId.startsWith("weapon:") ? "shoot" : kind;
  if (chargeKind === "shoot" && state.gunActivationPending) return false;
  const chargePromise = state.roomId && state.playerId
    ? api("/api/enhance-charge", { active: true, kind: chargeKind, itemId })
    : Promise.resolve(false);
  state.enhanceHold = { kind, chargeKind, pointerId, startedAt: performance.now(), timer: 0, itemId, chargeId: "", chargePromise };
  if (chargeKind === "shoot") state.gunActivationPending = true;
  state.movementQueue?.clear?.();
  clearMovementInput();
  // A new movement session makes any request that was already in flight before
  // the hold stale, so it cannot move the player after Enhance has begun.
  rotateMovementSession();
  sendMovement(true);
  updateEnhanceReadout();
  return true;
}

function cancelEnhanceAction(kind = state.enhanceHold.kind, { recoverOnFailure = true } = {}) {
  const hold = state.enhanceHold;
  if (!hold.kind || (kind && hold.kind !== kind)) return false;
  if (hold.timer) cancelAnimationFrame(hold.timer);
  state.enhanceHold = { kind: "", chargeKind: "", pointerId: null, startedAt: 0, timer: 0, itemId: "", chargeId: "" };
  if (hold.chargeKind === "shoot") state.gunActivationPending = false;
  if (hold.pointerId !== null) {
    for (const button of [els.shootButton, els.tabletShootShortcut, els.fireJutsuButton, els.itemUseButton, els.itemThrowButton]) {
      try {
        if (button?.hasPointerCapture?.(hold.pointerId)) button.releasePointerCapture(hold.pointerId);
      } catch {}
    }
  }
  updateEnhanceReadout();
  // Preserve request order: if the start request is still travelling, clear it
  // only after that request settles so a cancelled charge cannot reappear.
  void Promise.resolve(hold.chargePromise).then(() => {
    if (!state.roomId || !state.playerId) return false;
    if (recoverOnFailure) return api("/api/enhance-charge", { active: false });
    return request("/api/enhance-charge", {
      roomId: state.roomId,
      playerId: state.playerId,
      active: false
    }, { quiet: true, attempts: 1 });
  });
  return true;
}

async function clearServerEnhanceCharge({ recoverOnFailure = true } = {}) {
  if (!state.roomId || !state.playerId) return false;
  if (recoverOnFailure) return api("/api/enhance-charge", { active: false });
  return request("/api/enhance-charge", {
    roomId: state.roomId,
    playerId: state.playerId,
    active: false
  }, { quiet: true, attempts: 1 });
}

async function finishEnhanceAction(kind = state.enhanceHold.kind, pointerId = null) {
  const hold = state.enhanceHold;
  if (!hold.kind || (kind && hold.kind !== kind) || (pointerId !== null && hold.pointerId !== pointerId)) return false;
  const holdMs = Math.max(0, performance.now() - hold.startedAt);
  if (hold.timer) cancelAnimationFrame(hold.timer);
  state.enhanceHold = { kind: "", chargeKind: "", pointerId: null, startedAt: 0, timer: 0, itemId: "", chargeId: "" };
  updateEnhanceReadout();
  const chargeResult = await Promise.resolve(hold.chargePromise);
  const chargeId = String(chargeResult?.self?.enhanceChargeId || hold.chargeId || "");
  if (kind === "shoot") {
    const result = await beginGunFire(holdMs, chargeId);
    if (!result) await clearServerEnhanceCharge();
    state.gunActivationPending = false;
    return result;
  }
  if (kind === "fire") return api("/api/fire-jutsu", { holdMs, chargeId });
  const itemId = hold.itemId || els.itemSelect?.value || "";
  if (!itemId) {
    await clearServerEnhanceCharge();
    return false;
  }
  if (kind === "use" && itemId === "fire-jutsu") return api("/api/fire-jutsu", { holdMs, chargeId });
  if (kind === "throw") {
    const finalized = await api("/api/enhance-charge", { active: false, finalize: true, holdMs, chargeId });
    if (!finalized) return false;
    return beginThrowTargeting(itemId, holdMs, chargeId);
  }
  if (kind === "use" && itemId.startsWith("invention:")) {
    return api("/api/alchemist-invention", { invention: itemId.slice(10), holdMs, chargeId });
  }
  if (kind === "use" && itemId.startsWith("weapon:")) {
    const weaponId = itemId.slice(7);
    if (weaponId !== state.data?.self?.gunnerWeapon) {
      const switched = await api("/api/gunner-weapon", { weaponId });
      if (!switched) {
        await clearServerEnhanceCharge();
        state.gunActivationPending = false;
        return false;
      }
    }
    const result = await beginGunFire(holdMs, chargeId);
    if (!result) await clearServerEnhanceCharge();
    state.gunActivationPending = false;
    return result;
  }
  if (kind === "use" && itemId.startsWith("heavy:")) {
    return api("/api/gunner-heavy", { weapon: itemId.slice(6), holdMs, chargeId });
  }
  if (kind === "use" && ["substitution", "stand-firm", "push"].includes(itemId)) {
    await clearServerEnhanceCharge();
    showToast("このアイテムは条件成立時に自動発動します。");
    return true;
  }
  return api("/api/item-use", { itemId, holdMs, chargeId });
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
  if (elementKey === "manaConversionButton") {
    event.stopImmediatePropagation();
    const button = els.manaConversionButton;
    if (!event.repeat && button && !button.disabled && !button.hidden) button.click();
    return true;
  }
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
  if (rootShortcutHoldEligible(button)) {
    if (!event.repeat) beginRootShortcutKeyHold(event.code, button);
    return true;
  }
  if (isAbilityBatchButton(button)) {
    if (!event.repeat) {
      if (abilityBatchEligible(button)) beginAbilityBatchKeyHold(event.code, button);
      else if (button && !button.disabled) button.click();
    }
    return true;
  }
  if (isContinuousGameActionButton(button)) {
    if (!event.repeat) beginContinuousButtonKeyHold(event.code, () => els[elementKey]);
    return true;
  }
  if (event.repeat) return true;
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
  });
  els.jumpButton.textContent = "跳躍";
  setTabletShortcutLabel(els.tabletJumpShortcut, "跳躍");
}

function updateJumpPreparationUi() {
  if (!state.jumpPreparing || !state.jumpKeyDownAt) return;
  const preparedMs = Math.max(0, performance.now() - state.jumpKeyDownAt);
  const distance = 120 + preparedMs * 2.7;
  const stamina = 24 + distance * 0.14;
  const pulse = (preparedMs % 700) / 700;
  [els.jumpButton, els.tabletJumpShortcut].forEach((button) => {
    button?.style.setProperty("--jump-charge", pulse.toFixed(3));
  });
  const jumpDetail = `跳躍 ${Math.round(distance)}m / ${Math.ceil(stamina)}SP`;
  els.jumpButton.textContent = jumpDetail;
  setTabletShortcutLabel(els.tabletJumpShortcut, "跳躍", jumpDetail);
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
    void purchaseVendingItem(button);
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

function isTacticsScrollRegion(region) {
  return state.screen === "tactics" && (region === els.tacticsChapterList || region === els.tacticsContent);
}

function isExpandableScrollRegion(region) {
  if (!(region instanceof Element)) return false;
  if (isTacticsScrollRegion(region)) return true;
  return state.screen === "game" &&
    state.data?.phase === "playing" &&
    region !== els.sidePanel &&
    Boolean(els.sidePanel?.contains(region));
}

function selectedScrollRegion() {
  const region = state.activeScrollRegion;
  if (region && region.isConnected && visibleScrollRegions().includes(region)) return region;
  if (region) region.classList.remove("scroll-region-selected", "scroll-region-expanded");
  els.sidePanel?.classList.remove("scroll-region-expanded-host");
  els.statusPanel?.classList.remove("scroll-region-expanded-host");
  els.tacticsPanel?.classList.remove("tactics-region-expanded-host");
  state.activeScrollRegion = null;
  state.expandedScrollRegion = null;
  return null;
}

function syncExpandedScrollRegion(region) {
  document.querySelectorAll("[data-scroll-region].scroll-region-expanded").forEach((entry) => {
    entry.classList.remove("scroll-region-expanded");
  });
  els.sidePanel?.classList.remove("scroll-region-expanded-host");
  els.statusPanel?.classList.remove("scroll-region-expanded-host");
  els.tacticsPanel?.classList.remove("tactics-region-expanded-host");
  state.expandedScrollRegion = null;
  if (isTacticsScrollRegion(region)) {
    const visibleTacticsPanes = [els.tacticsChapterList, els.tacticsContent].filter((entry) =>
      entry && !entry.hidden && !entry.closest("[hidden]") && entry.getClientRects().length > 0
    );
    if (visibleTacticsPanes.length < 2) return;
    region.classList.add("scroll-region-expanded");
    els.tacticsPanel?.classList.add("tactics-region-expanded-host");
    state.expandedScrollRegion = region;
    return;
  }
  if (
    state.screen !== "game" ||
    state.data?.phase !== "playing" ||
    !(region instanceof Element) ||
    region === els.sidePanel ||
    !els.sidePanel?.contains(region)
  ) return;
  const visibleRightPanes = visibleScrollRegions().filter((entry) => entry !== els.sidePanel && els.sidePanel?.contains(entry));
  if (visibleRightPanes.length < 2) return;
  region.classList.add("scroll-region-expanded");
  els.sidePanel.classList.add("scroll-region-expanded-host");
  region.closest("#statusPanel")?.classList.add("scroll-region-expanded-host");
  state.expandedScrollRegion = region;
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
  if (focus) region.focus?.({ preventScroll: true });
  const target = scrollRegionTarget(region);
  target?.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "smooth" });
  return true;
}

function toggleExpandedScrollRegion(region) {
  if (!isExpandableScrollRegion(region)) return false;
  if (state.expandedScrollRegion === region) {
    syncExpandedScrollRegion(null);
    return true;
  }
  setSelectedScrollRegion(region, { focus: false });
  syncExpandedScrollRegion(region);
  return state.expandedScrollRegion === region;
}

function isBlankPaneTapTarget(event, region) {
  const target = event.target instanceof Element ? event.target : null;
  if (!target || !region?.contains(target)) return false;
  if (target.closest("button, input, select, textarea, a, label, [role='button'], [role='option'], [contenteditable='true'], [data-hacker-recipe], [data-item-choice]")) return false;
  const scrollTarget = scrollRegionTarget(region);
  const rect = scrollTarget?.getBoundingClientRect?.();
  if (rect && (
    (scrollTarget.scrollHeight > scrollTarget.clientHeight && event.clientX >= rect.right - 18) ||
    (scrollTarget.scrollWidth > scrollTarget.clientWidth && event.clientY >= rect.bottom - 18)
  )) return false;
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
    !element.matches(".hacker-category-step") &&
    !element.hidden && !element.disabled && !element.closest("[hidden]") && element.getClientRects().length > 0
  );
}

function selectItemChoice(itemId, focus = true) {
  const button = els.itemInventoryGrid?.querySelector(`[data-item-choice="${CSS.escape(String(itemId || ""))}"]`);
  if (!button) return false;
  els.itemSelect.value = button.dataset.itemChoice;
  state.explicitInventoryItemId = button.dataset.itemChoice;
  state.implicitHsgInventoryFallback = false;
  if (isDisplayedWeaponItemId(button.dataset.itemChoice)) state.selectedWeaponItemId = button.dataset.itemChoice;
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
        if (region === els.vendingPanel && next.dataset.drink) {
          state.vendingSelectedByCategory[state.vendingCategoryId] = next.dataset.drink;
        }
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
        ? els.matchmakingButton
        : phase === "selecting"
            ? els.operatorList.querySelector('.operator-card[data-selectable="1"]') || els.operatorList.querySelector(".operator-card")
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

function cycleSelectBy(select, direction = 1) {
  if (!select || select.disabled || select.options.length < 2) return false;
  const count = select.options.length;
  select.selectedIndex = (select.selectedIndex + direction + count) % count;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

function commitRootHoldAbility(type, rawMode) {
  const self = state.data?.self;
  if (!rootAbilityModeSelectActive(self) || !availableBorrowedActiveOperatorTypes(self).includes(type)) return false;
  const mode = type === "quantum" ? normalizeQuantumClientMode(rawMode) : rawMode;
  const selectable = type === "quantum"
    ? [...QUANTUM_KINETIC_MODE_OPTIONS, ...QUANTUM_ABILITY_MODE_OPTIONS.filter(([value]) => value !== "quantum-kinetic")]
    : OPERATOR_ABILITY_MODE_OPTIONS[type] || [];
  if (!selectable.some(([value]) => value === mode)) return false;
  state.borrowedOperatorType = type;
  if (type === "quantum") rememberQuantumExecutableMode(mode, true);
  else state.borrowedAbilityModes[type] = mode;
  populateRootOperatorModeSelect(self);
  syncAbilityModeDescription(type, self, mode);
  ensureTeleportTargetForMode(state.data);
  updateActionButtons(state.data);
  setActionSelection(els.teleportModeSelect);
  if (state.abilityAutoActivate) triggerBorrowedAbility(type, mode);
  return true;
}

function commitNativeQuantumHoldAbility(rawMode) {
  const self = state.data?.self;
  if (self?.special !== "quantum" || rootAbilityModeSelectActive(self)) return false;
  const mode = normalizeQuantumClientMode(rawMode);
  if (!rememberQuantumExecutableMode(mode, false)) return false;
  state.quantumSelectStage = "ability";
  populateNativeQuantumModeSelect();
  syncAbilityModeDescription("quantum", self, mode);
  updateActionButtons(state.data);
  setActionSelection(els.teleportModeSelect);
  if (state.abilityAutoActivate) triggerOperatorAbility();
  return true;
}

function quantumKineticHoldChoices({ borrowed = false } = {}) {
  const selected = selectedQuantumKineticMode(borrowed);
  return QUANTUM_KINETIC_MODE_OPTIONS.map(([mode, label]) => ({
    key: `quantum-kinetic:${mode}`,
    group: "運動エネルギー制御",
    label,
    selected: selected === mode,
    apply() {
      if (borrowed) commitRootHoldAbility("quantum", mode);
      else commitNativeQuantumHoldAbility(mode);
    }
  }));
}

function quantumTopLevelHoldChoices({ borrowed = false } = {}) {
  const selected = selectedQuantumExecutableMode(borrowed);
  return QUANTUM_ABILITY_MODE_OPTIONS.map(([mode, label]) => {
    if (mode === "quantum-kinetic") {
      return {
        key: "quantum:quantum-kinetic",
        group: "クオンタム",
        label,
        selected: selected.startsWith("kinetic-"),
        branches: quantumKineticHoldChoices({ borrowed })
      };
    }
    return {
      key: `quantum:${mode}`,
      group: "クオンタム",
      label,
      selected: selected === mode,
      apply() {
        if (borrowed) commitRootHoldAbility("quantum", mode);
        else commitNativeQuantumHoldAbility(mode);
      }
    };
  });
}

function borrowedOperatorHoldChoices(self = state.data?.self) {
  return availableBorrowedActiveOperatorTypes(self).map((type) => ({
    key: `root-operator:${type}`,
    group: "オペ",
    label: HACKER_ROOT_OPERATOR_LABELS[type] || type,
    selected: state.borrowedOperatorType === type,
    branches: type === "quantum"
      ? quantumTopLevelHoldChoices({ borrowed: true })
      : (OPERATOR_ABILITY_MODE_OPTIONS[type] || []).map(([mode, label]) => ({
        key: `${type}:${mode}`,
        group: HACKER_ROOT_OPERATOR_LABELS[type] || type,
        label,
        selected: state.borrowedOperatorType === type && state.borrowedAbilityModes[type] === mode,
        apply() { commitRootHoldAbility(type, mode); }
      }))
  }));
}

function switchDragDescriptorForSource(source) {
  if (!(source instanceof Element)) return null;
  const options = [];
  let title = "切り替え先";
  let rootGroup = "切替";
  if (source === els.weaponButton) {
    title = "武器を切り替え";
    const weapons = Array.isArray(state.data?.self?.gunnerWeapons) ? state.data.self.gunnerWeapons : [];
    options.push(...weapons.map((weapon) => ({
      key: `weapon:${weapon.id}`,
      group: "武器",
      label: weapon.shortName || weapon.name || weapon.id,
      selected: weapon.id === state.data?.self?.gunnerWeapon,
      apply() { void api("/api/gunner-weapon", { weaponId: weapon.id }); }
    })));
  }
  const unique = options.filter((option, index, all) => all.findIndex((entry) => entry.key === option.key) === index);
  const hierarchical = unique.some((option) => Array.isArray(option.branches));
  return unique.length > 1 ? { title, rootGroup, options: unique, hierarchical } : null;
}

function positionSwitchDragMenu(source = state.switchDrag.source) {
  if (!source?.isConnected || els.switchDragMenu.hidden) return;
  const sourceRect = source.getBoundingClientRect();
  const menuRect = els.switchDragMenu.getBoundingClientRect();
  const viewport = window.visualViewport;
  const leftEdge = Number(viewport?.offsetLeft) || 0;
  const topEdge = Number(viewport?.offsetTop) || 0;
  const rightEdge = leftEdge + (Number(viewport?.width) || window.innerWidth);
  const bottomEdge = topEdge + (Number(viewport?.height) || window.innerHeight);
  const margin = 10;
  const gap = 12;
  const maxLeft = Math.max(leftEdge + margin, rightEdge - menuRect.width - margin);
  let left = Math.min(maxLeft, Math.max(leftEdge + margin, sourceRect.left + sourceRect.width / 2 - menuRect.width / 2));
  let top = sourceRect.top - menuRect.height - gap;
  if (top < topEdge + margin) top = sourceRect.bottom + gap;
  top = Math.min(Math.max(topEdge + margin, top), Math.max(topEdge + margin, bottomEdge - menuRect.height - margin));
  els.switchDragMenu.style.left = `${Math.round(left)}px`;
  els.switchDragMenu.style.top = `${Math.round(top)}px`;
}

function clearSwitchDragHover() {
  state.switchDrag.hover?.classList.remove("switch-drag-hover");
  state.switchDrag.operatorHover?.classList.remove("switch-drag-hover");
  state.switchDrag.hover = null;
  state.switchDrag.operatorHover = null;
  state.switchDrag.finalChoice = null;
}

function renderSwitchDragAbilityBranch(operatorIndex) {
  const gesture = state.switchDrag;
  if (!gesture.hierarchical || !Number.isInteger(operatorIndex) || operatorIndex < 0) return false;
  const operator = gesture.options[operatorIndex];
  if (!operator) return false;
  gesture.hierarchicalStage = "ability";
  gesture.branchOperatorIndex = operatorIndex;
  gesture.branchOptions = Array.isArray(operator.branches) ? operator.branches : [];
  clearSwitchDragHover();
  els.switchDragTitle.textContent = `${operator.label}の能力を選択`;
  els.switchDragOptions.replaceChildren();
  els.switchDragOptions.setAttribute("aria-label", `${operator.label}の能力`);
  gesture.branchOptions.forEach((ability, index) => {
    const button = document.createElement("button");
    const hasBranches = Array.isArray(ability.branches) && ability.branches.length > 0;
    button.type = "button";
    button.dataset.switchDragAbilityIndex = String(index);
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(Boolean(ability.selected)));
    button.setAttribute("aria-label", `${ability.group}: ${ability.label}`);
    if (hasBranches) button.setAttribute("aria-haspopup", "listbox");
    button.className = `switch-drag-option switch-drag-ability${hasBranches ? " switch-drag-operator" : ""}${ability.selected ? " selected" : ""}`;
    button.innerHTML = `<small>${escapeHtml(ability.group)}</small><strong>${escapeHtml(ability.label)}</strong>`;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      if (!state.switchDrag.opened || !state.switchDrag.persistent) return;
      event.stopPropagation();
      const choice = state.switchDrag.branchOptions[index];
      if (Array.isArray(choice?.branches) && choice.branches.length) {
        renderSwitchDragNestedBranch(choice);
        return;
      }
      closeSwitchDragMenu();
      if (!choice) return;
      choice.apply();
      showToast(`${choice.group}: ${choice.label}`);
      playSound("select");
    });
    els.switchDragOptions.append(button);
  });
  positionSwitchDragMenu();
  return true;
}

function updateSwitchDragHover(clientX, clientY) {
  if (!state.switchDrag.opened) return;
  const candidate = document.elementsFromPoint(clientX, clientY)
    .map((element) => element.closest?.("#switchDragOptions button"))
    .find(Boolean) || null;
  const gesture = state.switchDrag;
  if (gesture.hierarchical) {
    if (!candidate) {
      gesture.hover?.classList.remove("switch-drag-hover");
      gesture.hover = null;
      gesture.finalChoice = null;
      return;
    }
    if (candidate.dataset.switchDragOperatorIndex !== undefined) {
      if (candidate !== gesture.operatorHover) {
        gesture.operatorHover?.classList.remove("switch-drag-hover");
        gesture.operatorHover = candidate;
        candidate.classList.add("switch-drag-hover");
        if (navigator.vibrate) navigator.vibrate(8);
      }
      return;
    }
    if (candidate.dataset.switchDragAbilityIndex !== undefined) {
      if (candidate === gesture.hover) return;
      gesture.hover?.classList.remove("switch-drag-hover");
      gesture.hover = candidate;
      candidate.classList.add("switch-drag-hover");
      const abilityIndex = Number(candidate.dataset.switchDragAbilityIndex);
      gesture.finalChoice = Number.isInteger(abilityIndex) ? gesture.branchOptions[abilityIndex] || null : null;
      if (navigator.vibrate) navigator.vibrate(8);
      return;
    }
  }
  if (candidate === state.switchDrag.hover) return;
  state.switchDrag.hover?.classList.remove("switch-drag-hover");
  state.switchDrag.hover = null;
  if (!candidate) return;
  state.switchDrag.hover = candidate;
  candidate.classList.add("switch-drag-hover");
  if (navigator.vibrate) navigator.vibrate(8);
}

function closeSwitchDragMenu() {
  const gesture = state.switchDrag;
  const source = gesture.source;
  const pointerId = gesture.pointerId;
  if (gesture.timer) window.clearTimeout(gesture.timer);
  gesture.timer = 0;
  source?.classList.remove("switch-drag-source");
  clearSwitchDragHover();
  gesture.pointerId = null;
  gesture.source = null;
  gesture.opened = false;
  gesture.persistent = false;
  gesture.hierarchical = false;
  gesture.hierarchicalStage = "operator";
  gesture.branchOperatorIndex = -1;
  gesture.branchOptions = [];
  gesture.finalChoice = null;
  gesture.options = [];
  els.switchDragMenu.hidden = true;
  els.switchDragMenu.classList.remove("hierarchical");
  els.switchDragMenu.setAttribute("aria-hidden", "true");
  source?.setAttribute("aria-expanded", "false");
  els.switchDragOptions.replaceChildren();
  if (source && pointerId !== null) {
    try {
      if (source.hasPointerCapture?.(pointerId)) source.releasePointerCapture(pointerId);
    } catch {}
  }
}

function openSwitchDragMenu(descriptor, { persistent = false } = {}) {
  const gesture = state.switchDrag;
  if (!persistent && gesture.pointerId === null) return;
  if (!gesture.source?.isConnected || gesture.source.hidden || gesture.source.disabled || gesture.source.getClientRects().length === 0) {
    closeSwitchDragMenu();
    return;
  }
  gesture.opened = true;
  gesture.persistent = persistent;
  gesture.hierarchical = Boolean(descriptor.hierarchical);
  gesture.hierarchicalStage = "operator";
  els.switchDragMenu.classList.remove("hierarchical");
  gesture.options = descriptor.options;
  gesture.source.classList.add("switch-drag-source");
  gesture.source.setAttribute("aria-expanded", "true");
  els.switchDragTitle.textContent = descriptor.title;
  els.switchDragOptions.replaceChildren();
  els.switchDragOptions.classList.remove("hierarchical");
  if (gesture.hierarchical) {
    const rootGroup = descriptor.rootGroup || "切替";
    els.switchDragOptions.setAttribute("aria-label", rootGroup);
    descriptor.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.switchDragOperatorIndex = String(index);
      button.setAttribute("aria-haspopup", "listbox");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", `${rootGroup}: ${option.label}`);
      button.className = `switch-drag-option switch-drag-operator${option.selected ? " selected" : ""}`;
      button.innerHTML = `<small>${escapeHtml(rootGroup)}</small><strong>${escapeHtml(option.label)}</strong>`;
      button.addEventListener("click", (event) => {
        event.preventDefault();
        if (!state.switchDrag.opened || !state.switchDrag.persistent) return;
        event.stopPropagation();
        const choice = state.switchDrag.options[index];
        if (Array.isArray(choice?.branches) && choice.branches.length) {
          renderSwitchDragAbilityBranch(index);
          return;
        }
        closeSwitchDragMenu();
        if (!choice) return;
        choice.apply();
        showToast(`${choice.group}: ${choice.label}`);
        playSound("select");
      });
      els.switchDragOptions.append(button);
    });
  } else {
  els.switchDragOptions.removeAttribute("aria-label");
  descriptor.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.switchDragIndex = String(index);
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(Boolean(option.selected)));
    button.setAttribute("aria-label", `${option.group}: ${option.label}`);
    button.className = `switch-drag-option${option.selected ? " selected" : ""}`;
    button.innerHTML = `<small>${escapeHtml(option.group)}</small><strong>${escapeHtml(option.label)}</strong>`;
    button.addEventListener("click", (event) => event.preventDefault());
    button.addEventListener("click", (event) => {
      if (!state.switchDrag.opened || !state.switchDrag.persistent) return;
      event.stopPropagation();
      const choice = state.switchDrag.options[index];
      closeSwitchDragMenu();
      if (!choice) return;
      choice.apply();
      showToast(`${choice.group}: ${choice.label}`);
      playSound("select");
    });
    els.switchDragOptions.append(button);
  });
  }
  els.switchDragMenu.hidden = false;
  els.switchDragMenu.setAttribute("aria-hidden", "false");
  positionSwitchDragMenu();
  if (gesture.pointerId !== null) {
    try { gesture.source.setPointerCapture?.(gesture.pointerId); } catch {}
  }
  if (navigator.vibrate) navigator.vibrate(16);
}

function openSharedSwitchMenuForSource(source, { persistent = false } = {}) {
  const descriptor = switchDragDescriptorForSource(source);
  if (!descriptor) return false;
  if (state.switchDrag.source !== source) {
    closeSwitchDragMenu();
    state.switchDrag.source = source;
  }
  openSwitchDragMenu(descriptor, { persistent });
  return state.switchDrag.opened;
}

// Tap and long hold are only two input routes into this one existing selector.
// Candidate data, DOM, styling and selection behavior stay owned by the tap UI.
function openSwitchControlTapUi(source) {
  return openSharedSwitchMenuForSource(source, { persistent: true });
}

function beginSwitchDragGesture(event) {
  if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
  const source = event.currentTarget;
  const descriptor = switchDragDescriptorForSource(source);
  if (!descriptor) return;
  event.preventDefault();
  closeSwitchDragMenu();
  const gesture = state.switchDrag;
  gesture.pointerId = event.pointerId;
  gesture.source = source;
  gesture.startX = event.clientX;
  gesture.startY = event.clientY;
  gesture.timer = window.setTimeout(() => openSwitchControlTapUi(source), SWITCH_DRAG_HOLD_DELAY_MS);
}

function moveSwitchDragGesture(event) {
  const gesture = state.switchDrag;
  if (gesture.pointerId !== event.pointerId) return;
  if (!gesture.opened) {
    if (Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY) > SWITCH_DRAG_MOVE_CANCEL_PX) {
      closeSwitchDragMenu();
    }
    return;
  }
  event.preventDefault();
  updateSwitchDragHover(event.clientX, event.clientY);
}

function finishSwitchDragGesture(event, cancelled = false) {
  const gesture = state.switchDrag;
  if (gesture.pointerId !== event.pointerId) return false;
  const source = gesture.source;
  const opened = gesture.opened;
  if (opened) {
    event.preventDefault();
    updateSwitchDragHover(event.clientX, event.clientY);
    const index = cancelled ? -1 : Number(gesture.hover?.dataset.switchDragIndex);
    const operatorIndex = cancelled ? -1 : Number(gesture.operatorHover?.dataset.switchDragOperatorIndex);
    const abilityChoice = gesture.hierarchicalStage === "ability" ? gesture.finalChoice : null;
    const nestedChoice = gesture.hierarchicalStage === "nested" ? gesture.finalChoice : null;
    const choice = cancelled
      ? null
      : gesture.hierarchical
        ? abilityChoice || nestedChoice
        : Number.isInteger(index) && index >= 0 ? gesture.options[index] : null;
    gesture.suppressClickUntil.set(source, performance.now() + 900);
    if (!cancelled && gesture.hierarchical && gesture.hierarchicalStage === "operator" && Number.isInteger(operatorIndex) && operatorIndex >= 0) {
      const rootChoice = gesture.options[operatorIndex];
      if (!Array.isArray(rootChoice?.branches) || !rootChoice.branches.length) {
        closeSwitchDragMenu();
        if (rootChoice) {
          rootChoice.apply();
          showToast(`${rootChoice.group}: ${rootChoice.label}`);
          playSound("select");
        }
        return true;
      }
      if (gesture.timer) window.clearTimeout(gesture.timer);
      gesture.timer = 0;
      gesture.pointerId = null;
      gesture.persistent = true;
      renderSwitchDragAbilityBranch(operatorIndex);
      try {
        if (source?.hasPointerCapture?.(event.pointerId)) source.releasePointerCapture(event.pointerId);
      } catch {}
      return true;
    }
    if (!cancelled && gesture.hierarchical && choice && Array.isArray(choice.branches) && choice.branches.length) {
      if (gesture.timer) window.clearTimeout(gesture.timer);
      gesture.timer = 0;
      gesture.pointerId = null;
      gesture.persistent = true;
      renderSwitchDragNestedBranch(choice);
      try {
        if (source?.hasPointerCapture?.(event.pointerId)) source.releasePointerCapture(event.pointerId);
      } catch {}
      return true;
    }
    if (!cancelled && !choice) {
      if (gesture.timer) window.clearTimeout(gesture.timer);
      gesture.timer = 0;
      gesture.pointerId = null;
      gesture.persistent = true;
      clearSwitchDragHover();
      try {
        if (source?.hasPointerCapture?.(event.pointerId)) source.releasePointerCapture(event.pointerId);
      } catch {}
      return true;
    }
    closeSwitchDragMenu();
    if (choice) {
      choice.apply();
      showToast(`${choice.group}: ${choice.label}`);
      playSound("select");
    }
    return true;
  }
  if (!cancelled && switchDragDescriptorForSource(source)) {
    event.preventDefault();
    gesture.suppressClickUntil.set(source, performance.now() + 900);
    closeSwitchDragMenu();
    gesture.source = source;
    openSwitchControlTapUi(source);
    return true;
  }
  closeSwitchDragMenu();
  return false;
}

function suppressSwitchDragClick(event) {
  const source = event.target instanceof Element ? event.target.closest("button, select") : null;
  const suppressUntil = source ? Number(state.switchDrag.suppressClickUntil.get(source)) || 0 : 0;
  if (performance.now() >= suppressUntil) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  state.switchDrag.suppressClickUntil.delete(source);
}

function clearNativeSelectHold() {
  const hold = state.nativeSelectHold;
  if (hold.timer) window.clearTimeout(hold.timer);
  hold.timer = 0;
  hold.pointerId = null;
  hold.source = null;
  hold.startedAt = 0;
  hold.startX = 0;
  hold.startY = 0;
  hold.opened = false;
  hold.branchMode = false;
}

function openNativeSelectPicker(source, allowLegacyClick = false) {
  if (!(source instanceof HTMLSelectElement) || !source.isConnected || source.disabled || source.hidden) return false;
  try { source.focus({ preventScroll: true }); } catch { source.focus(); }
  if (typeof source.showPicker !== "function") {
    if (allowLegacyClick) {
      try { source.click(); } catch {}
    }
    return false;
  }
  try {
    source.showPicker();
    return true;
  } catch {
    return false;
  }
}

function beginNativeSelectHold(event) {
  if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
  const source = event.currentTarget;
  if (!(source instanceof HTMLSelectElement) || source.disabled || source.options.length < 2) return;
  clearNativeSelectHold();
  const hold = state.nativeSelectHold;
  hold.pointerId = event.pointerId;
  hold.source = source;
  hold.startedAt = performance.now();
  hold.startX = event.clientX;
  hold.startY = event.clientY;
  // Every select-based switch uses the exact browser/device picker. Long hold
  // is an additional input route into the same native picker, never a custom UI.
  hold.opened = openNativeSelectPicker(source, true);
}

function moveNativeSelectHold(event) {
  const hold = state.nativeSelectHold;
  if (hold.pointerId !== event.pointerId || hold.opened) return;
  if (Math.hypot(event.clientX - hold.startX, event.clientY - hold.startY) > SWITCH_DRAG_MOVE_CANCEL_PX) {
    clearNativeSelectHold();
  }
}

function finishNativeSelectHold(event, cancelled = false) {
  const hold = state.nativeSelectHold;
  if (hold.pointerId !== event.pointerId) return false;
  const source = hold.source;
  const heldLongEnough = performance.now() - hold.startedAt >= SWITCH_DRAG_HOLD_DELAY_MS;
  let opened = hold.opened;
  if (!cancelled && heldLongEnough && !opened) opened = openNativeSelectPicker(source, true);
  if (opened) {
    event.preventDefault();
    hold.suppressClickUntil.set(source, performance.now() + 900);
  }
  clearNativeSelectHold();
  return opened;
}

function suppressNativeSelectHoldClick(event) {
  const source = event.target instanceof HTMLSelectElement ? event.target : null;
  const suppressUntil = source ? Number(state.nativeSelectHold.suppressClickUntil.get(source)) || 0 : 0;
  if (performance.now() >= suppressUntil) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  state.nativeSelectHold.suppressClickUntil.delete(source);
}

function bindSwitchDragControl(source) {
  if (!source) return;
  if (source instanceof HTMLSelectElement) {
    source.dataset.switchUi = "native-default";
    source.classList.add("native-switch-hold-control");
    source.addEventListener("pointerdown", beginNativeSelectHold);
    source.addEventListener("contextmenu", (event) => {
      if (state.nativeSelectHold.source === source) event.preventDefault();
    });
    return;
  }
  source.classList.add("switch-drag-control");
  source.setAttribute("aria-haspopup", "listbox");
  source.setAttribute("aria-controls", "switchDragMenu");
  source.setAttribute("aria-expanded", "false");
  source.addEventListener("pointerdown", beginSwitchDragGesture);
  source.addEventListener("click", (event) => {
    if (!switchDragDescriptorForSource(source)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    closeSwitchDragMenu();
    state.switchDrag.source = source;
    openSwitchControlTapUi(source);
  }, true);
  source.addEventListener("lostpointercapture", (event) => finishSwitchDragGesture(event, true));
  source.addEventListener("contextmenu", (event) => {
    if (!switchDragDescriptorForSource(source)) return;
    event.preventDefault();
  });
}

function selectAlchemyRecipe(conversion, focus = false) {
  const recipe = alchemyRecipes.find((candidate) => candidate.id === conversion) || alchemyRecipes[0];
  els.alchemySelect.value = recipe.id;
  els.alchemySelectionText.textContent = `${recipe.label}（${hackerRecipeCooldownLabel(recipe)}） ${hackerRecipePresentation(recipe)}`;
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
      els.hackerAbilityGrid.querySelector(
        `[data-hacker-recipe="${CSS.escape(state.hackerSelectedRecipeId || "")}"]`
      )?.click();
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

function availableBorrowedActiveOperatorTypes(self = state.data?.self) {
  return availableBorrowedOperatorTypes(self).filter((type) => (OPERATOR_ABILITY_MODE_OPTIONS[type] || []).length > 0);
}

function cycleBorrowedOperator(direction = 1) {
  const self = state.data?.self;
  if (self?.special !== "alchemist") return false;
  const types = availableBorrowedActiveOperatorTypes(self);
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

function selectBorrowedAbilityMode(type, mode) {
  const self = state.data?.self;
  if (!availableBorrowedActiveOperatorTypes(self).includes(type)) return false;
  const choices = OPERATOR_ABILITY_MODE_OPTIONS[type] || [];
  if (!choices.some(([value]) => value === mode)) return false;
  state.borrowedOperatorType = type;
  state.borrowedAbilityModes[type] = mode;
  renderTargetOptions(state.data);
  if ([...els.teleportModeSelect.options].some((option) => option.value === mode)) {
    els.teleportModeSelect.value = mode;
    els.teleportModeSelect.dispatchEvent(new Event("change", { bubbles: true }));
  }
  updateActionButtons(state.data);
  setActionSelection(els.teleportModeSelect);
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
  if (state.screen === "game" && event.code === "KeyI") {
    event.preventDefault();
    if (!event.repeat) els.gameTacticsButton.click();
    return true;
  }
  if (state.screen === "tactics" && event.code === "KeyI" && state.tacticsReturnScreen === "game" && state.data) {
    event.preventDefault();
    if (!event.repeat) switchScreenWithEffect("game");
    return true;
  }
  if (state.screen === "tactics" && state.tacticsChapterId === "tactics-novel") {
    const buttonFocused = document.activeElement?.matches?.("button");
    const action = event.code === "ArrowLeft"
      ? () => els.tacticsNovelPrev.click()
      : event.code === "ArrowRight"
        ? () => els.tacticsNovelNext.click()
        : event.code === "Home"
          ? () => els.tacticsNovelRestart.click()
          : !buttonFocused && ["Space", "Enter"].includes(event.code)
            ? () => els.tacticsNovelNext.click()
          : null;
    if (action) {
      event.preventDefault();
      if (!event.repeat) action();
      return true;
    }
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
    const joinAction = event.code === "KeyL" ? () => els.matchmakingButton.click() : null;
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
  if (state.screen === "game" && state.data?.phase === "playing") {
    const self = state.data?.self;
    if (["Quote", "KeyG"].includes(event.code)) {
      event.preventDefault();
      if (!event.repeat) {
        const action = () => void api("/api/donate");
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
    const button = els.operatorList.querySelector(`.operator-card[data-hotkey="${hotkey}"][data-selectable="1"]`);
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
  ensureDynamicVendingChoices();
  ensureDynamicAlchemyChoices();
  document.addEventListener("pointerdown", unlockAudio, { passive: true });
  document.addEventListener("keydown", unlockAudio);
  document.addEventListener("pointerdown", beginRootShortcutHold, true);
  document.addEventListener("pointerdown", beginAbilityBatchHold, true);
  document.addEventListener("pointerdown", beginContinuousActionHold, true);
  document.addEventListener("click", suppressContinuousActionClick, true);
  document.addEventListener("click", suppressSwitchDragClick, true);
  document.addEventListener("click", suppressNativeSelectHoldClick, true);
  document.addEventListener("pointerdown", (event) => {
    const button = event.target instanceof Element ? event.target.closest("button") : null;
  if (!button) return;
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
    deactivateOfflineMode();
    state.realtime?.disconnect();
    document.documentElement.dataset.connectionMode = "matching";
    recordUsageCheckpoint("matchmaking_open");
    void enterFullscreen();
    void runTitleCommandTransition(els.titlePlayButton, () => switchScreenWithEffect("game"));
  });
  els.titleTacticsButton.addEventListener("click", () => {
    state.tacticsReturnScreen = "title";
    recordUsageCheckpoint("tactics_open");
    void runTitleCommandTransition(els.titleTacticsButton, () => switchScreenWithEffect("tactics"));
  });
  els.gameTacticsButton.addEventListener("click", () => {
    state.tacticsReturnScreen = "game";
    recordUsageCheckpoint("tactics_open_from_game");
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
  els.tabletContextShortcut.addEventListener("click", () => els.contextActionButton.click());
  els.tabletEmpShortcut.addEventListener("click", () => els.empButton.click());
  els.tabletManaConversionShortcut.addEventListener("click", () => els.manaConversionButton.click());
  els.tabletClairvoyanceShortcut.addEventListener("click", () => toggleClairvoyance());
  els.tabletVendingShortcut.addEventListener("click", () => setVendingOpen(!state.vendingOpen));
  els.tabletDodgeShortcut.addEventListener("click", () => els.dodgeButton.click());
  els.tabletRenkiShortcut.addEventListener("click", () => els.renkiButton.click());
  els.tabletRestShortcut.addEventListener("click", () => els.sleepButton.click());
  els.tabletDonateShortcut.addEventListener("click", () => void api("/api/donate"));
  els.vendingButton.addEventListener("click", () => setVendingOpen(!state.vendingOpen));
  els.vendingBulkPurchase.addEventListener("change", () => {
    state.vendingBulkPurchase = Boolean(els.vendingBulkPurchase.checked);
    if (!state.vendingBulkPurchase) stopVendingHold({ suppressClick: true });
  });
  window.addEventListener("resize", () => scheduleStableGameplayViewportReflow(80), { passive: true });
  bindTabletControls();
  [
    els.hackerTargetSelect,
    els.teleportModeSelect,
    els.rootAbilityBranchSelect,
    els.quantumKineticBranchSelect,
    els.teleportTargetSelect,
    els.empPhaseSelect,
    els.sabotageSelect,
    els.transferTargetSelect,
    els.weaponButton
  ].forEach(bindSwitchDragControl);
  els.teleportModeSelect.addEventListener("pointerdown", () => {
    prepareRootAbilityModeSelectForOpen();
  }, true);
  els.teleportModeSelect.addEventListener("focus", () => {
    prepareRootAbilityModeSelectForOpen();
  });
  document.addEventListener("pointerdown", (event) => {
    const gesture = state.switchDrag;
    if (!gesture.opened || !gesture.persistent) return;
    const target = event.target instanceof Node ? event.target : null;
    if (target && (els.switchDragMenu.contains(target) || gesture.source?.contains?.(target))) return;
    closeSwitchDragMenu();
  }, true);
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !state.switchDrag.opened) return;
    event.preventDefault();
    closeSwitchDragMenu();
  }, true);
  window.addEventListener("pointermove", moveSwitchDragGesture, true);
  window.addEventListener("pointerup", (event) => finishSwitchDragGesture(event), true);
  window.addEventListener("pointercancel", (event) => finishSwitchDragGesture(event, true), true);
  window.addEventListener("pointermove", moveNativeSelectHold, true);
  window.addEventListener("pointerup", (event) => finishNativeSelectHold(event), true);
  window.addEventListener("pointercancel", (event) => finishNativeSelectHold(event, true), true);
  window.addEventListener("blur", () => {
    closeSwitchDragMenu();
    clearNativeSelectHold();
    stopVendingHold({ suppressClick: true });
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) return;
    closeSwitchDragMenu();
    clearNativeSelectHold();
    stopVendingHold({ suppressClick: true });
  });
  window.addEventListener("resize", () => positionSwitchDragMenu(), { passive: true });
  window.visualViewport?.addEventListener("resize", () => positionSwitchDragMenu(), { passive: true });
  window.visualViewport?.addEventListener("scroll", () => positionSwitchDragMenu(), { passive: true });
  els.operatorBranchCloseButton.addEventListener("click", () => setOperatorBranchesOpen(false));
  els.keybindCloseButton.addEventListener("click", () => setKeybindOpen(false));
  els.killCameraCloseButton.addEventListener("click", () => {
    const record = state.data?.self?.killCamera;
    if (record?.id) state.dismissedKillCameraId = record.id;
    els.killCameraOverlay.hidden = true;
    els.canvas.focus({ preventScroll: true });
  });
  els.keybindOverlay.addEventListener("click", (event) => {
    if (event.target === els.keybindOverlay) setKeybindOpen(false);
  });
  els.movementAccToggleButton.addEventListener("click", () => void toggleMovementAcc());
  els.manaConversionModeSelect.addEventListener("change", () => void selectManaConversionMode());
  els.manaConversionButton.addEventListener("click", () => void convertManaToSelectedProtection());
  document.addEventListener("fullscreenchange", syncFullscreenButton);
  els.titleHomeButton.addEventListener("click", () => void returnToTitle());
  els.tacticsBackButton.addEventListener("click", () => {
    const destination = state.tacticsReturnScreen === "game" && state.data ? "game" : "title";
    switchScreenWithEffect(destination);
  });
  els.titleMuteButton?.addEventListener("click", toggleGameMuted);
  els.tacticsMuteButton?.addEventListener("click", toggleGameMuted);
  els.gameMuteButton?.addEventListener("click", toggleGameMuted);
  els.skinSelect.addEventListener("change", syncSelectedSkin);
  els.mapSelect.addEventListener("change", () => {
    const mapId = normalizeMatchmakingMapId(els.mapSelect.value);
    els.mapSelect.value = mapId;
    localStorage.setItem(storage.map, mapId);
  });
  els.matchmakingButton.addEventListener("click", startMatchmaking);
  [els.nameInput].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      startMatchmaking();
    });
  });
  els.analyticsToggleButton.addEventListener("click", () => void loadDropoffAnalytics());
  els.hackerTargetSelect.addEventListener("change", () => {
    if (!hackerTargets().some((player) => player.id === els.hackerTargetSelect.value)) return;
    state.hackerTargetId = els.hackerTargetSelect.value;
    renderHackerAbilityDock(state.data, true);
    const target = currentHackerTarget();
    if (target) showToast(`ハッカー対象: ${target.name}${target.id === state.data?.selfId ? "（自分）" : ""}`);
  });
  const bindCategoryStep = (button, changeCategory) => {
    let repeatTimer = 0;
    let repeatInterval = 0;
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    const stop = () => {
      window.clearTimeout(repeatTimer);
      window.clearInterval(repeatInterval);
      repeatTimer = 0;
      repeatInterval = 0;
      pointerId = null;
    };
    button.addEventListener("click", changeCategory);
    button.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      stop();
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      repeatTimer = window.setTimeout(() => {
        repeatInterval = window.setInterval(changeCategory, 150);
      }, 420);
    });
    button.addEventListener("pointermove", (event) => {
      if (pointerId !== event.pointerId) return;
      if (Math.hypot(event.clientX - startX, event.clientY - startY) > 9) stop();
    });
    button.addEventListener("pointerup", stop);
    button.addEventListener("pointercancel", stop);
    button.addEventListener("pointerleave", stop);
  };
  bindCategoryStep(els.hackerCategoryPreviousButton, () => selectHackerCategory("", -1));
  bindCategoryStep(els.hackerCategoryNextButton, () => selectHackerCategory("", 1));
  bindCategoryStep(els.vendingCategoryPreviousButton, () => selectVendingCategory("", -1));
  bindCategoryStep(els.vendingCategoryNextButton, () => selectVendingCategory("", 1));
  // Keep action suppression outside the current card subtree. Category
  // changes may rebuild that subtree before a browser emits its synthetic
  // click, so an ancestor-only click listener cannot own the whole gesture.
  const hackerCategoryActionGate = createInventoryClickGate();
  const vendingCategoryActionGate = createInventoryClickGate();
  const bindCategoryStripFlick = (strip, changeCategory, {
    // The label/control remains the semantic category owner, while `surface`
    // deliberately makes the same horizontal flick available from anywhere in
    // that category UI.  This avoids a tiny, hard-to-hit-only gesture target.
    surface = strip,
    threshold = 10,
    axisRatio = 1.2,
    onTravel = null,
    actionGate = null,
    // Some compact panels are deliberately `display: contents` in one
    // layout.  Their header/cards still bubble through the semantic owner,
    // but the unoccupied padding belongs to the containing panel instead.
    // Register that container too, while accepting only its visual safe
    // rectangle, so a Hacker flick is not narrower than the other catalog
    // controls in the same right-panel surface.
    registeredSurface = null,
    isRegisteredSafeStart = null
  } = {}) => {
    const gestureSurface = surface || strip;
    if (!strip || !gestureSurface) return;
    const registeredGestureSurface = registeredSurface || gestureSurface;
    const clickGate = createInventoryClickGate();
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let travelled = false;
    let changedCategory = false;
    let axisOwner = "";
    const reset = () => {
      pointerId = null;
      travelled = false;
      changedCategory = false;
      axisOwner = "";
    };
    const cancel = (event) => {
      if (event && pointerId !== event.pointerId) return;
      // A browser may cancel a gesture after it has travelled (for example
      // while retargeting a native control).  Keep that transaction's click
      // suppressed: cancellation is never permission to run the card/action
      // that the horizontal or vertical gesture already replaced.
      const suppressClick = travelled;
      reset();
      if (suppressClick) {
        clickGate.arm();
        actionGate?.arm();
      } else {
        clickGate.reset();
        actionGate?.reset();
      }
    };
    const classify = (event) => {
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      const distance = Math.hypot(dx, dy);
      return {
        dx,
        dy,
        distance,
        horizontal: distance > threshold && Math.abs(dx) > Math.abs(dy) * axisRatio,
        vertical: distance > threshold && Math.abs(dy) > Math.abs(dx) * axisRatio
      };
    };
    const noteTravel = (event) => {
      if (pointerId !== event.pointerId) return null;
      const gesture = classify(event);
      if (gesture.distance <= threshold) return gesture;
      // A drag/flick must never fall through to the tapped card/button below.
      // Do not permanently classify the first over-threshold sample when it
      // is still diagonal. Touch hardware commonly reports that ambiguous
      // sample before the user's horizontal intent becomes decisive.
      if (!travelled) {
        travelled = true;
        clickGate.arm();
        actionGate?.arm();
        onTravel?.(event, gesture);
      }
      if (!axisOwner && gesture.vertical) axisOwner = "vertical";
      if (!axisOwner && gesture.horizontal) axisOwner = "horizontal";
      // Once horizontal ownership is certain, cancel native activation at the
      // move boundary instead of waiting until pointerup. Vertical scrolling
      // stays native and ambiguous diagonal travel commits neither action.
      if (axisOwner === "horizontal" && event.cancelable) event.preventDefault();
      if (axisOwner === "horizontal") {
        // Commit at the first decisive move.  Some native target controls
        // retarget or cancel the later pointerup; waiting for that final event
        // was why a valid Hacker target-operation flick could visibly travel
        // without changing its genre.  `changedCategory` makes this exactly
        // one adjacent step for the complete pointer transaction.
        if (!changedCategory) {
          changedCategory = true;
          clickGate.arm();
          actionGate?.arm();
          changeCategory(gesture.dx < 0 ? 1 : -1);
        }
      }
      return gesture;
    };
    const finish = (event) => {
      if (pointerId !== event.pointerId) return;
      const gesture = noteTravel(event) || classify(event);
      if (gesture.distance > threshold) {
        const horizontal = axisOwner !== "vertical" && gesture.horizontal && !changedCategory;
        const dx = gesture.dx;
        if (horizontal) {
          if (event.cancelable) event.preventDefault();
          changedCategory = true;
          // Retain the gate immediately before the step: synthesized click is
          // suppressed even on platforms that emit it after a prevented up.
          actionGate?.arm();
          clickGate.arm();
          if (horizontal) changeCategory(dx < 0 ? 1 : -1);
        }
        // Do not stop propagation here: card-specific hold handlers must see
        // the release and clear their timer/capture after a panel-wide flick.
      }
      reset();
    };
    const startsInGestureSurface = (event) => {
      const path = typeof event.composedPath === "function" ? event.composedPath() : [];
      if (path.includes(gestureSurface) || gestureSurface.contains(event.target)) return true;
      return Boolean(isRegisteredSafeStart?.(event));
    };
    const begin = (event) => {
      if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
      if (pointerId !== null || !startsInGestureSurface(event)) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      travelled = false;
      changedCategory = false;
      axisOwner = "";
      clickGate.reset();
      actionGate?.reset();
    };
    // The semantic dock owns all of its header, target select and cards. In
    // the compact `display: contents` layout its parent additionally owns
    // only the dock's visible blank/padding rectangle. This makes every
    // registered target-operation surface a valid horizontal start without
    // stealing adjacent status controls.
    gestureSurface.addEventListener("pointerdown", begin, true);
    if (registeredGestureSurface !== gestureSurface) {
      registeredGestureSurface.addEventListener("pointerdown", begin, true);
    }
    // The registered panel may contain a native select or an action button
    // which becomes the pointer's event target.  Listening only on the panel
    // loses the directional sample when that target retargets/captures the
    // transaction (the right-to-left route was the visible recurrence).  A
    // window capture listener remains scoped by `pointerId`, so it owns only
    // a transaction which *started* in this panel and still leaves vertical
    // native scrolling plus every unrelated pointer alone.
    // Keep the surface listener for normal bubbling paths as well. The window
    // capture listener below closes the retarget/capture gap without changing
    // ordinary panel event ordering.
    gestureSurface.addEventListener("pointermove", noteTravel, true);
    window.addEventListener("pointermove", noteTravel, true);
    // Capture on window lets a flick finish correctly even if it leaves the
    // panel before release.  It deliberately does not block the target's own
    // pointerup cleanup (Vending repeat/detail and Hacker card long hold).
    window.addEventListener("pointerup", finish, true);
    window.addEventListener("pointercancel", cancel, true);
    gestureSurface.addEventListener("lostpointercapture", cancel, true);
    window.addEventListener("blur", () => cancel());
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancel();
    });
    gestureSurface.addEventListener("click", (event) => {
      if (!clickGate.consume()) return;
      actionGate?.consume();
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  };
  bindCategoryStripFlick(
    els.hackerCategoryLabel.parentElement,
    (direction) => selectHackerCategory("", direction, { wrap: false }),
    {
      surface: els.hackerAbilityDock,
      actionGate: hackerCategoryActionGate,
      registeredSurface: els.hackerAbilityDock.parentElement,
      isRegisteredSafeStart: (event) => {
        const safeSurface = els.hackerAbilityDock;
        const container = safeSurface.parentElement;
        if (!container?.contains(event.target)) return false;
        const rect = safeSurface.getBoundingClientRect();
        // A small tolerance includes the dock's rendered padding/border but
        // not unrelated role/status content in the same parent panel.
        const inset = 6;
        return event.clientX >= rect.left - inset && event.clientX <= rect.right + inset &&
          event.clientY >= rect.top - inset && event.clientY <= rect.bottom + inset;
      },
      // A deliberately slow physical swipe can cross the long-hold timeout
      // before its first move sample arrives. Once travel is observed, close
      // any detail opened by that same Hacker-card transaction.
      onTravel: () => {
        if (state.inventoryItemDetailSource?.closest("#hackerAbilityGrid")) hideInventoryItemDetail();
      }
    }
  );
  bindCategoryStripFlick(
    els.vendingCategoryLabel.parentElement,
    (direction) => selectVendingCategory("", direction, { wrap: false }),
    {
      surface: els.vendingPanel,
      actionGate: vendingCategoryActionGate,
      // The card receives pointerdown before it can start its 520ms detail or
      // repeat-purchase hold.  Any panel drag cancels that pending action.
      onTravel: (event) => {
        if (vendingHold.pointerId === event.pointerId) stopVendingHold({ suppressClick: true });
      }
    }
  );
  els.hackerAbilityGrid.addEventListener("click", (event) => {
    if (hackerCategoryActionGate.consume()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    const button = event.target.closest?.("[data-hacker-recipe]");
    if (!button || button.dataset.actionDisabled === "1") return;
    selectHackerAction(button.dataset.hackerRecipe, false);
    void executeHackerRecipe(button.dataset.hackerRecipe);
  });
  els.resetButton.addEventListener("click", () => {
    if (state.data?.soloMission) {
      void leaveCurrentRoom();
      return;
    }
    void rematch();
  });
  els.debugForceEndButton.addEventListener("click", () => api("/api/force-end"));
  els.leaveRoomButton.addEventListener("click", () => void returnToTitle());
  els.operatorReselectButton.addEventListener("click", () => void returnOfflineToOperatorSelect());
  [els.offlineDefenderButton, els.offlineAttackerButton].forEach((button) => {
    button.addEventListener("click", () => void chooseOfflineTeam(button.dataset.offlineTeam));
  });
  els.mapActionButton.addEventListener("click", () => toggleExpandedMapFromAction());
  els.mapCloseButton.addEventListener("click", () => setExpandedMapOpen(false));
  els.ninjutsuButton.addEventListener("click", performNinjutsu);
  const bindGunTriggerButton = (button) => {
    let suppressClickUntil = 0;
    button.addEventListener("pointerdown", (event) => {
      if ((event.pointerType === "mouse" && event.button !== 0) || button.disabled) return;
      event.preventDefault();
      state.gunTriggerPointerId = event.pointerId;
      button.setPointerCapture?.(event.pointerId);
      beginEnhanceAction("shoot", event.pointerId);
    });
    button.addEventListener("pointerup", (event) => {
      suppressClickUntil = performance.now() + 700;
      releaseGunPointer(event);
    });
    button.addEventListener("pointercancel", cancelGunPointer);
    button.addEventListener("lostpointercapture", cancelGunPointer);
    button.addEventListener("click", (event) => {
      if (performance.now() < suppressClickUntil) return;
      if (event.detail === 0) void pulseGunFire();
    });
  };
  const releaseGunPointer = (event) => {
    if (state.gunTriggerPointerId !== null && event.pointerId !== state.gunTriggerPointerId) return;
    state.gunTriggerPointerId = null;
    void finishEnhanceAction("shoot", event.pointerId);
  };
  const cancelGunPointer = (event) => {
    if (state.gunTriggerPointerId !== null && event.pointerId !== state.gunTriggerPointerId) return;
    state.gunTriggerPointerId = null;
    cancelEnhanceAction("shoot");
  };
  bindGunTriggerButton(els.shootButton);
  bindGunTriggerButton(els.tabletShootShortcut);
  els.weaponButton.addEventListener("click", () => api("/api/gunner-weapon", { direction: 1 }));
  els.gunnerReloadButton.addEventListener("click", () => api("/api/gunner-reload"));
  els.dodgeButton.addEventListener("click", () => api("/api/dodge"));
  els.teleportButton.addEventListener("click", triggerTeleportAction);
  els.empButton.addEventListener("click", () => api("/api/emp", { phase: els.empPhaseSelect.value }));
  [els.teleportModeSelect, els.rootAbilityBranchSelect, els.quantumKineticBranchSelect, els.teleportTargetSelect, els.empPhaseSelect, els.sabotageSelect].forEach((select) => {
    select.addEventListener("change", () => {
      if ([els.teleportModeSelect, els.quantumKineticBranchSelect].includes(select)) {
        if (commitNativeQuantumModeSelect(select)) {
          if (state.data) updateActionButtons(state.data);
          if (state.quantumSelectStage === "ability") select.blur();
          return;
        }
      }
      if ([els.teleportModeSelect, els.rootAbilityBranchSelect, els.quantumKineticBranchSelect].includes(select)) {
        if (commitRootAbilityModeSelect(select)) {
          if (state.data) renderTargetOptions(state.data);
          if (state.rootAbilitySelectStage === "operator") select.blur();
          return;
        }
      }
      if (select === els.teleportModeSelect) {
        rememberSelectedOperatorMode();
        if (state.data) renderTargetOptions(state.data);
        ensureTeleportTargetForMode(state.data);
        const owner = selectedBorrowedOperator() || state.data?.self?.special || "";
        syncAbilityModeDescription(owner, state.data?.self);
        if (state.abilityAutoActivate) triggerOperatorAbility();
      }
      if (state.data) updateActionButtons(state.data);
      select.blur();
    });
  });
  els.abilityAutoActivateToggle.checked = state.abilityAutoActivate;
  els.abilityAutoActivateToggle.addEventListener("change", () => {
    state.abilityAutoActivate = els.abilityAutoActivateToggle.checked;
    localStorage.setItem(storage.abilityAutoActivate, state.abilityAutoActivate ? "1" : "0");
    els.abilityAutoActivateControl.dataset.enabled = state.abilityAutoActivate ? "1" : "0";
    els.abilityAutoActivateControl.title = state.abilityAutoActivate
      ? "ON: 能力を選択した時に即実行します"
      : "OFF: 能力の選択だけを確定し、既存の能力操作で実行します";
    const owner = selectedBorrowedOperator() || state.data?.self?.special || "";
    syncAbilityModeDescription(owner, state.data?.self);
    showToast(state.abilityAutoActivate ? "能力の選択時実行: ON" : "能力の選択時実行: OFF");
  });
  els.abilityAutoActivateControl.dataset.enabled = state.abilityAutoActivate ? "1" : "0";
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
    if (els.contextActionButton.dataset.context === "ground-item") {
      const groundItemId = String(els.contextActionButton.dataset.groundItemId || "");
      if (groundItemId && !els.contextActionButton.disabled) {
        void api("/api/item-pickup", { groundItemId });
      }
      return;
    }
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
    // The control-local pointerup must own releases that began on an Enhance
    // button. Finishing here in capture phase clears the hold before the
    // button can suppress its synthetic click, which starts a second charge
    // and makes the first ordinary use fail the server transaction check.
    if (event.target instanceof Element && event.target.closest(".enhance-hold-control")) return;
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
    state.explicitInventoryItemId = els.itemSelect.value;
    state.implicitHsgInventoryFallback = false;
    if (isDisplayedWeaponItemId(els.itemSelect.value)) state.selectedWeaponItemId = els.itemSelect.value;
    state.itemRenderKey = "";
    if (state.data) {
      renderItemControl(state.data);
      updateActionButtons(state.data);
      renderTabletControls(state.data);
    }
  });
  els.emergencyButton.addEventListener("click", () => api("/api/emergency"));
  els.sabotageButton.addEventListener("click", () => api("/api/sabotage", { type: els.sabotageSelect.value }));
  els.utilityButton.addEventListener("click", () => api("/api/utility", { type: els.utilitySelect.value }));
  document.querySelectorAll("[data-drink]").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (vendingCategoryActionGate.consume() || performance.now() < vendingHold.suppressClickUntil) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      purchaseVendingItem(button);
    });
    button.addEventListener("pointerdown", (event) => startVendingHold(event, button));
    button.addEventListener("pointermove", moveVendingHold);
    button.addEventListener("pointerup", finishVendingHold);
    button.addEventListener("pointercancel", cancelVendingHold);
    button.addEventListener("lostpointercapture", cancelVendingHold);
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
    state.blankPaneTap = (
      event.isPrimary &&
      scrollRegion &&
      isExpandableScrollRegion(scrollRegion) &&
      isBlankPaneTapTarget(event, scrollRegion)
    ) ? {
      pointerId: event.pointerId,
      region: scrollRegion,
      x: event.clientX,
      y: event.clientY
    } : null;
  });
  document.addEventListener("pointermove", (event) => {
    const tap = state.blankPaneTap;
    if (!tap || tap.pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > 9) state.blankPaneTap = null;
  }, { passive: true });
  document.addEventListener("pointerup", (event) => {
    const tap = state.blankPaneTap;
    state.blankPaneTap = null;
    if (!tap || tap.pointerId !== event.pointerId || !isBlankPaneTapTarget(event, tap.region)) return;
    toggleExpandedScrollRegion(tap.region);
  });
  document.addEventListener("pointercancel", () => { state.blankPaneTap = null; });
  const suppressIosGameCallout = (event) => {
    if (state.screen !== "game") return;
    const target = event.target instanceof Element ? event.target : null;
    if (!target?.closest(".item-inventory-choice, .hacker-direct-action, .vending-item-with-icon, .enhance-hold-control")) return;
    if (event.cancelable) event.preventDefault();
    const selection = window.getSelection?.();
    if (selection && selection.rangeCount) selection.removeAllRanges();
  };
  document.addEventListener("contextmenu", suppressIosGameCallout, { capture: true });
  document.addEventListener("selectstart", suppressIosGameCallout, { capture: true });
  document.addEventListener("dragstart", suppressIosGameCallout, { capture: true });
  document.addEventListener("copy", suppressIosGameCallout, { capture: true });

  els.dashButton.addEventListener("pointerdown", (event) => { event.preventDefault(); setDashHeld(true); });
  els.dashButton.addEventListener("pointerup", () => setDashHeld(false));
  els.dashButton.addEventListener("pointercancel", () => setDashHeld(false));
  els.dashButton.addEventListener("pointerleave", () => setDashHeld(false));
  els.slowWalkButton.addEventListener("pointerdown", (event) => { event.preventDefault(); setSlowWalkHeld(true); });
  els.slowWalkButton.addEventListener("pointerup", () => setSlowWalkHeld(false));
  els.slowWalkButton.addEventListener("pointercancel", () => setSlowWalkHeld(false));
  els.slowWalkButton.addEventListener("pointerleave", () => setSlowWalkHeld(false));

  els.chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = els.chatInput.value.trim();
    if (!message) return;
    const ok = await api("/api/chat", { message });
    if (ok) els.chatInput.value = "";
  });

  els.chatTab.addEventListener("click", () => setFeed());

  window.addEventListener("keydown", (event) => {
    const eventTarget = event.target instanceof Element ? event.target : document.activeElement;
    const editableTarget = eventTarget?.matches?.('input, textarea, [contenteditable="true"]')
      ? eventTarget
      : document.activeElement?.matches?.('input, textarea, [contenteditable="true"]')
        ? document.activeElement
        : null;
    if (editableTarget) return;
    if (triggerDeveloperAnalyticsHotkey(event)) return;
    const typingField = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
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
    if (!typingField && (event.code === "PageUp" || event.code === "PageDown")) {
      event.preventDefault();
      if (!event.repeat) cycleSelectedScrollRegion(event.code === "PageUp" ? -1 : 1);
      return;
    }
    if (
      !typingField &&
      selectedScrollRegion() === els.vendingPanel &&
      event.shiftKey &&
      ["ArrowLeft", "ArrowRight"].includes(event.key)
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!event.repeat) selectVendingCategory("", event.key === "ArrowRight" ? 1 : -1);
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
    if (event.code === "Backspace" && state.screen !== "title" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      if (!event.repeat) void returnToTitle();
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
      const destination = state.screen === "tactics" && state.tacticsReturnScreen === "game" && state.data
        ? "game"
        : "title";
      switchScreenWithEffect(destination);
      return;
    }
    if (!typingField && event.code === "KeyQ" && state.screen === "game" && ["playing", "meeting"].includes(state.data?.phase)) {
      event.preventDefault();
      if (!event.repeat) void toggleMovementAcc();
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
      [els.teleportModeSelect, els.rootAbilityBranchSelect, els.quantumKineticBranchSelect, els.teleportTargetSelect, els.empPhaseSelect, els.sabotageSelect, els.alchemySelect].includes(activeElement);
    const panelActionHotkey = (activeElement === els.alchemySelect && event.code === "KeyR") ||
      (activeElement === els.sabotageSelect && event.code === "KeyL") ||
      ([els.teleportModeSelect, els.rootAbilityBranchSelect, els.quantumKineticBranchSelect, els.teleportTargetSelect].includes(activeElement) && ["KeyP", "KeyO", "Digit0"].includes(event.code)) ||
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
        if (!event.repeat) {
          const controls = contextKeyboardElements();
          const selected = controls.includes(document.activeElement) ? document.activeElement : state.keyboardElement;
          if (rootShortcutHoldEligible(selected)) {
            beginRootShortcutKeyHold(event.code, selected);
          } else if (isAbilityBatchButton(selected) && abilityBatchEligible(selected)) {
            beginAbilityBatchKeyHold(event.code, selected);
          } else if (selected?.dataset?.repeatableAbility === "1" || selected?.closest?.("#operatorBranchList")) {
            activateKeyboardSelection();
          } else {
            beginContinuousActionKeyHold(event.code, activateKeyboardSelection);
          }
        }
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
    const eventTarget = event.target instanceof Element ? event.target : document.activeElement;
    if (eventTarget?.matches?.('input, textarea, [contenteditable="true"]') ||
      document.activeElement?.matches?.('input, textarea, [contenteditable="true"]')) return;
    stopRootShortcutKeyHold(event.code);
    stopAbilityBatchKeyHold(event.code, { dispatch: true });
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
    cancelActiveRootShortcutHolds();
    stopContinuousActionHold();
    stopContinuousActionKeyHold();
    cancelThrowTargeting(true);
    cancelEnhanceAction();
    state.continuousActionKeyAt.clear();
    clearMovementInput();
  });
  window.addEventListener("focus", () => void recoverRoomInteractionAfterBackground());
  window.addEventListener("online", () => void flushUsageAnalytics());
  window.addEventListener("pagehide", () => {
    cancelTransientGameInputForBackground();
    recordUsageExit();
  });
  window.addEventListener("pointerout", (event) => {
    if (event.relatedTarget == null) clearMovementInput();
  });
  window.addEventListener("pointerup", (event) => {
    if (state.enhanceHold.pointerId === event.pointerId) void finishEnhanceAction(state.enhanceHold.kind, event.pointerId);
    stopContinuousActionHold(event.pointerId);
    releasePointerInput(event.pointerId);
    if (state.gunTriggerPointerId === event.pointerId) state.gunTriggerPointerId = null;
  });
  window.addEventListener("pointercancel", (event) => {
    if (state.enhanceHold.pointerId === event.pointerId) cancelEnhanceAction(state.enhanceHold.kind);
    stopContinuousActionHold(event.pointerId);
    releasePointerInput(event.pointerId);
    if (state.gunTriggerPointerId === event.pointerId) state.gunTriggerPointerId = null;
  });
  window.addEventListener("lostpointercapture", (event) => {
    stopContinuousActionHold(event.pointerId);
  }, true);
  window.addEventListener("mousedown", (event) => {
    if (event.button !== 0) clearMovementInput();
  });
  window.addEventListener("contextmenu", (event) => {
    if (event.target instanceof Element && event.target.closest(".game-area, .tablet-quick-actions, .tablet-branch-tray, .item-inventory-choice, .hacker-direct-action, .vending-item-with-icon, .enhance-hold-control")) {
      event.preventDefault();
      clearMovementInput();
    }
  });
  document.addEventListener("selectstart", (event) => {
    if (event.target instanceof Element && event.target.closest(".tablet-quick-actions, .tablet-branch-tray, .item-inventory-choice, .hacker-direct-action, .vending-item-with-icon, .enhance-hold-control")) {
      event.preventDefault();
    }
  });
  document.addEventListener("dragstart", (event) => {
    if (event.target instanceof Element && event.target.closest(".tablet-quick-actions, .tablet-branch-tray, .item-inventory-choice, .hacker-direct-action, .vending-item-with-icon, .enhance-hold-control")) {
      event.preventDefault();
    }
  });
  const fullscreenSwipeGuard = createFullscreenSwipeGuard({
    isActive: () => state.screen === "game",
    resolveScrollable: resolveFullscreenScrollableSurface
  });
  document.addEventListener("touchstart", (event) => {
    Array.from(event.changedTouches || []).forEach((touch) => {
      fullscreenSwipeGuard.start(touch.identifier, touch.clientY, event.target);
    });
  }, { capture: true, passive: true });
  document.addEventListener("touchmove", (event) => {
    const blockPageGesture = Array.from(event.touches || []).some((touch) =>
      fullscreenSwipeGuard.move(touch.identifier, touch.clientY)
    );
    if (blockPageGesture && event.cancelable) event.preventDefault();
  }, { capture: true, passive: false });
  const finishFullscreenTouch = (event) => {
    Array.from(event.changedTouches || []).forEach((touch) => fullscreenSwipeGuard.end(touch.identifier));
  };
  document.addEventListener("touchend", finishFullscreenTouch, { capture: true, passive: true });
  document.addEventListener("touchcancel", finishFullscreenTouch, { capture: true, passive: true });
  ["gesturestart", "gesturechange", "gestureend"].forEach((type) => {
    document.addEventListener(type, (event) => {
      if (state.screen === "game" && event.cancelable) event.preventDefault();
    }, { capture: true, passive: false });
  });
  document.addEventListener("dblclick", (event) => {
    if (state.screen !== "game") return;
    if (event.cancelable) event.preventDefault();
  }, { capture: true, passive: false });
  window.visualViewport?.addEventListener("resize", () => {
    scheduleViewportScaleRestore();
    scheduleStableGameplayViewportReflow(120);
  }, { passive: true });
  window.addEventListener("pointerup", (event) => {
    finishRootShortcutPointerHold(event);
    finishAbilityBatchPointerHold(event);
  }, true);
  window.addEventListener("pointercancel", (event) => {
    finishRootShortcutPointerHold(event, true);
    finishAbilityBatchPointerHold(event, true);
  }, true);
  window.addEventListener("lostpointercapture", (event) => {
    finishRootShortcutPointerHold(event, true);
    finishAbilityBatchPointerHold(event, true);
  }, true);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelActiveRootShortcutHolds();
      cancelActiveAbilityBatchHolds();
    }
  });
  window.addEventListener("blur", () => {
    cancelActiveRootShortcutHolds();
    cancelActiveAbilityBatchHolds();
  });
  window.addEventListener("orientationchange", () => {
    scheduleViewportScaleRestore(true);
    scheduleStableGameplayViewportReflow(160);
  }, { passive: true });
  window.addEventListener("pageshow", () => {
    scheduleViewportScaleRestore();
    scheduleStableGameplayViewportReflow(160);
    void recoverRoomInteractionAfterBackground();
  }, { passive: true });
  document.addEventListener("focusout", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) {
      scheduleViewportScaleRestore();
    }
  }, true);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      fullscreenSwipeGuard.clear();
      stopContinuousActionHold();
      stopContinuousActionKeyHold();
      state.continuousActionKeyAt.clear();
      cancelTransientGameInputForBackground();
    }
    clearMovementInput();
    if (!document.hidden) {
      void recoverRoomInteractionAfterBackground();
    }
    if (!document.hidden) {
      scheduleViewportScaleRestore();
      scheduleStableGameplayViewportReflow(160);
    }
    if (document.hidden) recordUsageExit();
    else {
      recordUsageResume();
      void flushUsageAnalytics();
    }
    syncBgm();
  });

  els.expandedMapCanvas.addEventListener("pointerdown", beginExpandedMapTap);
  els.expandedMapCanvas.addEventListener("pointermove", moveExpandedMapTap);
  els.expandedMapCanvas.addEventListener("pointerup", (event) => finishExpandedMapTap(event));
  els.expandedMapCanvas.addEventListener("pointercancel", (event) => finishExpandedMapTap(event, true));
  els.expandedMapCanvas.addEventListener("lostpointercapture", (event) => finishExpandedMapTap(event));
  els.expandedMapCanvas.addEventListener("pointerleave", () => {
    if (!state.expandedMapTap) state.mapPointer = null;
  });
  els.canvas.addEventListener("pointerdown", attackFromCanvas);
  els.canvas.addEventListener("pointermove", moveClairvoyanceTeleportTap);
  els.canvas.addEventListener("pointerup", (event) => void finishClairvoyanceTeleportTap(event));
  els.canvas.addEventListener("pointercancel", (event) => void finishClairvoyanceTeleportTap(event, true));
  els.canvas.addEventListener("lostpointercapture", (event) => void finishClairvoyanceTeleportTap(event, true));
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
  const pointerId = state.tabletStick.pointerId;
  state.tabletStick.pointerId = null;
  state.tabletStick.dx = 0;
  state.tabletStick.dy = 0;
  setTabletStickMode("idle", 0);
  els.tabletJoystick.classList.remove("active");
  els.tabletJoystickKnob.style.transform = "translate(-50%, -50%)";
  if (pointerId !== null) {
    try {
      if (els.tabletJoystick.hasPointerCapture?.(pointerId)) els.tabletJoystick.releasePointerCapture(pointerId);
    } catch {}
  }
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
      if (pointerId === null && !holdTimer && !repeatTimer) return;
      const shouldEndHold = repeating;
      const capturedPointerId = pointerId;
      moved = true;
      clearTimers();
      pointerId = null;
      repeating = false;
      if (capturedPointerId !== null) {
        try {
          if (button.hasPointerCapture?.(capturedPointerId)) button.releasePointerCapture(capturedPointerId);
        } catch {}
      }
      pointerCancel?.();
      if (shouldEndHold) holdEnd?.({ cancelled: true });
    };
    button.addEventListener("pointerdown", (event) => {
      if (event.defaultPrevented && isAbilityBatchButton(button)) return;
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
    button.cancelScrollableHold = cancelForScroll;
  };

  if (hold === "shoot") {
    bindScrollableHold({
      interval: 0,
      pointerStart: () => beginEnhanceAction("shoot"),
      pointerCancel: () => cancelEnhanceAction("shoot"),
      tapInvoke: () => void finishEnhanceAction("shoot"),
      holdInvoke: () => {},
      holdEnd: ({ cancelled }) => {
        if (!cancelled) void finishEnhanceAction("shoot");
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
  } else if (hold === "repeat") {
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
    "flora-target": "サンビーム対象選択",
    "quantum-kinetic": "運動エネルギー制御",
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
      hold: options.hold || (isAbilityBatchButton(source) ? "ability-batch" : ""),
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
  const addQuantumModeAction = (label, mode) => appendTabletBranchButton(label, () => {
    if (!rememberQuantumExecutableMode(mode, false)) return;
    populateNativeQuantumModeSelect();
    updateActionButtons(state.data);
    if (state.abilityAutoActivate) els.operatorAbilityButton.click();
    // A terminal selection is complete after one executable mode.  Leaving
    // the old kinetic submenu path active made later polling draw its stale
    // accelerate/decelerate controls over nuclear selections.
    setTabletBranchPath("", { focus: false });
  }, {
    kind: ["nuclear-fission", "nuclear-fusion"].includes(mode) ? "danger" : "action",
    selected: selectedQuantumExecutableMode(false) === mode,
    disabled: els.operatorAbilityButton.disabled
  });
  const addQuantumKineticParent = () => appendTabletBranchButton("運動エネルギー制御", () => {
    const kineticMode = selectedQuantumKineticMode(false);
    rememberQuantumExecutableMode(kineticMode, false);
    populateNativeQuantumModeSelect();
    els.teleportModeSelect.value = "quantum-kinetic";
    syncAbilityModeDescription("quantum", self, kineticMode);
    updateActionButtons(state.data);
    // Parent selection only establishes the executable default.  The child
    // branch remains a chooser and never auto-executes by opening it.
    setTabletBranchPath("quantum-kinetic");
  }, {
    kind: "branch",
    branchPath: "quantum-kinetic",
    selected: selectedQuantumExecutableMode(false).startsWith("kinetic-"),
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
        addModeAction("対象転移", "target");
        addModeAction("心臓転移", "heart");
        addSubmenu("転移対象を選択", "gravity-target");
      } else if (branchPath === "gravity-time") {
	        addModeAction("アクセラレート", "accelerate");
	        addModeAction("ディーセラレート", "decelerate");
	        addModeAction("時の番人", "time-keeper");
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
      if (branchPath === "flora-target") {
        [...els.teleportTargetSelect.options].forEach((option) => {
          appendTabletBranchButton(option.textContent, () => {
            setSelectValue(els.teleportTargetSelect, option.value);
            setTabletBranchPath("");
          }, { kind: "target", selected: option.value === els.teleportTargetSelect.value });
        });
      } else {
        addModeAction("回復・オーバーヒール", "heal");
        addModeAction("サンビーム", "sunbeam");
        addModeAction("インビジブル", "invisible");
        if (els.teleportModeSelect.value === "sunbeam") addSubmenu("サンビーム対象を選択", "flora-target");
      }
    } else if (self.special === "quantum") {
      if (tabletQuantumKineticTerminalActive(self)) {
        addQuantumModeAction("加速", "kinetic-accelerate");
        addQuantumModeAction("減速", "kinetic-decelerate");
      } else {
        addQuantumKineticParent();
        addQuantumModeAction("核変換", "nuclear-transmutation");
        addQuantumModeAction("核分裂", "nuclear-fission");
        addQuantumModeAction("核融合", "nuclear-fusion");
      }
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
        "vending-inventions": ["railgun", "particle-cannon", "excalibur", "exile", "hack", "handgun", "smg", "assault", "sniper", "taser", "rpg", "missile"],
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

function conciseTabletAbilityName(data) {
  const owner = els.operatorAbilityButton.dataset.operator || data?.self?.special || "none";
  const mode = els.teleportModeSelect.value;
  const modeNames = {
    fighter: {
      "limit-break": "リミットブレイク"
    },
    teleport: {
      near: "転移・対象付近",
      target: "対象転移",
      heart: "心臓転移",
      accelerate: "アクセラレート",
      decelerate: "ディーセラレート",
      "time-keeper": "時の番人",
      storm: "グラビティストーム"
    },
    flora: {
      heal: "回復",
      sunbeam: "サンビーム",
      invisible: "インビジブル"
    },
    quantum: {
      "quantum-kinetic": "運動エネルギー制御",
      "kinetic-accelerate": "運動エネルギー制御 / 加速",
      "kinetic-decelerate": "運動エネルギー制御 / 減速",
      "nuclear-transmutation": "核変換",
      "nuclear-fission": "核分裂",
      "nuclear-fusion": "核融合"
    }
  };
  if (owner === "fighter") return "リミットブレイク";
  if (owner === "alchemist") {
    if (!data?.self?.hackerRootActive) return "Root化";
    const borrowed = selectedBorrowedOperator();
    const borrowedOwner = borrowed === "gravity" ? "teleport" : borrowed;
    if (borrowedOwner === "quantum") return quantumModeLabel(selectedQuantumExecutableMode(true));
    return modeNames[borrowedOwner]?.[state.borrowedAbilityModes[borrowed] || mode] || specialLabels[borrowedOwner] || "借用能力";
  }
  if (owner === "quantum") return quantumModeLabel(selectedQuantumExecutableMode(data?.self?.special === "alchemist"));
  return modeNames[owner]?.[mode] || specialLabels[owner] || "オペ能力";
}

function setTabletShortcutLabel(button, name, detail = "") {
  if (!button) return;
  button.textContent = name;
  button.setAttribute("aria-label", name);
  button.title = detail || name;
}

function renderTabletControls(data) {
  if (!data?.self) return;
  setTabletShortcutLabel(els.tabletNinjutsuShortcut, "忍殺", els.ninjutsuButton.textContent || "忍殺");
  els.tabletNinjutsuShortcut.disabled = els.ninjutsuButton.disabled || els.ninjutsuButton.hidden;
  els.tabletNinjutsuShortcut.hidden = els.ninjutsuButton.hidden;
  setTabletShortcutLabel(els.tabletContextShortcut, els.contextActionButton.textContent || "周辺アクション", els.contextActionButton.title || "周辺アクション");
  els.tabletContextShortcut.disabled = els.contextActionButton.disabled || els.contextActionButton.hidden;
  els.tabletContextShortcut.hidden = els.contextActionButton.hidden;
  setTabletShortcutLabel(
    els.tabletAbilityShortcut,
    conciseTabletAbilityName(data),
    `${els.operatorAbilityButton.title || els.operatorAbilityButton.textContent || "現在の能力を発動"}。能力切替は専用選択欄をタップまたは長押し`
  );
  els.tabletAbilityShortcut.disabled = els.operatorAbilityButton.hidden;
  els.tabletAbilityShortcut.hidden = els.operatorAbilityButton.hidden;
  els.tabletAbilityShortcut.dataset.operator = els.operatorAbilityButton.dataset.operator || "none";
  els.tabletAbilityShortcut.dataset.repeatableAbility = els.operatorAbilityButton.dataset.repeatableAbility || "0";
  els.tabletAbilityShortcut.dataset.actionDisabled = els.operatorAbilityButton.disabled ? "1" : "0";
  els.tabletAbilityShortcut.classList.toggle("action-disabled", els.operatorAbilityButton.disabled);
  els.tabletAbilityShortcut.setAttribute("aria-haspopup", "false");
  setTabletShortcutLabel(els.tabletShootShortcut, "射撃", els.shootButton.textContent || "射撃");
  els.tabletShootShortcut.disabled = els.shootButton.disabled;
  els.tabletShootShortcut.hidden = els.shootButton.hidden;
  els.tabletShootShortcut.classList.toggle("active", els.shootButton.classList.contains("active"));
  setTabletShortcutLabel(els.tabletEmpShortcut, "EMP", els.empButton.textContent || "EMP");
  // The tablet shortcut delegates to the canonical EMP button.  It must carry
  // the exact same disabled state: previously a cooling-down or ability-locked
  // EMP looked tappable on tablet, but its delegated .click() was a silent
  // no-op because the source button was disabled.
  els.tabletEmpShortcut.disabled = els.empButton.disabled || els.empButton.hidden;
  els.tabletEmpShortcut.hidden = els.empButton.hidden;
  els.tabletEmpShortcut.dataset.actionDisabled = els.empButton.disabled ? "1" : "0";
  els.tabletEmpShortcut.classList.toggle("action-disabled", els.empButton.disabled);
  setTabletShortcutLabel(
    els.tabletManaConversionShortcut,
    els.manaConversionButton.textContent || "バスト変換",
    els.manaConversionButton.title || "1MPを選択中のバスト／バリアへ変換"
  );
  els.tabletManaConversionShortcut.disabled = els.manaConversionButton.disabled || els.manaConversionButton.hidden;
  els.tabletManaConversionShortcut.hidden = els.manaConversionControl.hidden;
  els.tabletManaConversionShortcut.dataset.actionDisabled = els.manaConversionButton.disabled ? "1" : "0";
  els.tabletManaConversionShortcut.classList.toggle("action-disabled", els.manaConversionButton.disabled);
  setTabletShortcutLabel(els.tabletClairvoyanceShortcut, "千里眼", state.clairvoyance.active ? "千里眼を解除" : "千里眼を発動");
  els.tabletClairvoyanceShortcut.disabled = data.phase !== "playing" || !data.self.alive || data.self.ejected;
  els.tabletClairvoyanceShortcut.classList.toggle("active", state.clairvoyance.active);
  els.tabletClairvoyanceShortcut.setAttribute("aria-pressed", String(state.clairvoyance.active));
  setTabletShortcutLabel(els.tabletVendingShortcut, "自販機", state.vendingOpen ? "自販機を閉じる" : "自販機を開く");
  els.tabletVendingShortcut.disabled = data.phase !== "playing" || !data.self.alive || data.self.ejected || data.self.inVent;
  els.tabletVendingShortcut.classList.toggle("active", state.vendingOpen);
  els.tabletVendingShortcut.setAttribute("aria-expanded", String(state.vendingOpen));
  setTabletShortcutLabel(els.tabletDodgeShortcut, "回避", els.dodgeButton.textContent || "回避");
  els.tabletDodgeShortcut.disabled = els.dodgeButton.disabled || els.dodgeButton.hidden;
  els.tabletDodgeShortcut.hidden = els.dodgeButton.hidden;
  setTabletShortcutLabel(els.tabletJumpShortcut, "跳躍", els.jumpButton.textContent || "跳躍");
  els.tabletJumpShortcut.disabled = els.jumpButton.disabled;
  setTabletShortcutLabel(els.tabletRenkiShortcut, "練気", els.renkiButton.title || els.renkiButton.textContent || "練気");
  els.tabletRenkiShortcut.disabled = els.renkiButton.disabled;
  setTabletShortcutLabel(els.tabletRestShortcut, "休息", els.sleepButton.title || els.sleepButton.textContent || "休息");
  els.tabletRestShortcut.disabled = els.sleepButton.disabled;
  setTabletShortcutLabel(els.tabletDonateShortcut, "募金", "10Cを募金");
  const canAct = data.phase === "playing" && data.self.alive && !data.self.ejected && !data.self.inVent;
  els.tabletDonateShortcut.disabled = !canAct || Number(data.self.credits || 0) < 10;
  renderTabletBranch(data);
}

function portraitTabletRequired() {
  return window.innerHeight > window.innerWidth;
}

function syncPortraitTabletDock() {
  const panel = els.tabletPanel;
  const fieldSlot = document.querySelector(".field-stage-slot");
  const board = fieldSlot?.querySelector(".board-wrap");
  const lower = els.fieldLowerRow;
  if (!panel || !fieldSlot || !board || !lower) return;
  const portrait = portraitTabletRequired();
  document.body.classList.toggle("portrait-tablet-dock", portrait);
  if (portrait) {
    if (panel.parentElement !== fieldSlot || panel.nextElementSibling !== lower) fieldSlot.insertBefore(panel, lower);
  } else if (panel.parentElement !== board || panel !== board.firstElementChild) {
    board.prepend(panel);
  }
}

function setTabletOpen(open, { persist = true, focus = true } = {}) {
  const playable = state.screen === "game" && state.data?.phase === "playing";
  const portrait = portraitTabletRequired();
  syncPortraitTabletDock();
  state.tabletOpen = Boolean(playable && (open || portrait));
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
    state.teleportTargetMode = "body";
    state.instantWarpTargeting = false;
    state.mapPointer = null;
    state.expandedMapTap = null;
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

function clairvoyanceTeleportContext(data = state.data) {
  const self = data?.self;
  if (!state.clairvoyance.active || !self || data?.phase !== "playing" || !self.alive || self.ejected || self.inVent) return null;
  // Presentation only: the endpoint independently selects and validates the
  // Gravity/Scroll route from authoritative state.
  if (!hasDisplayedOperatorAccess(self, "gravity") && Number(self.warpCharges) <= 0) return null;
  return { self };
}

function clairvoyanceCanvasWorldPoint(event) {
  const data = state.data;
  const point = canvasPointerPosition(event);
  const viewport = state.drawViewport;
  if (!data || !point || !viewport) return null;
  const zoom = worldZoomFor(data);
  const x = viewport.left + point.x / zoom;
  const y = viewport.top + point.y / zoom;
  return { x, y, valid: isClientWalkable(data, x, y, data.map.playerRadius) };
}

function beginClairvoyanceTeleportTap(event) {
  if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return false;
  if (!clairvoyanceTeleportContext() || pointerHitsMinimap(event)) return false;
  state.clairvoyanceTeleportTap = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    moved: false
  };
  try { els.canvas.setPointerCapture(event.pointerId); } catch {}
  return true;
}

function moveClairvoyanceTeleportTap(event) {
  const tap = state.clairvoyanceTeleportTap;
  if (!tap || tap.pointerId !== event.pointerId || tap.moved) return;
  tap.moved = Math.hypot(event.clientX - tap.startX, event.clientY - tap.startY) > 10;
}

async function finishClairvoyanceTeleportTap(event, cancelled = false) {
  const tap = state.clairvoyanceTeleportTap;
  if (!tap || tap.pointerId !== event.pointerId) return false;
  state.clairvoyanceTeleportTap = null;
  if (cancelled || tap.moved || !clairvoyanceTeleportContext()) return false;
  const point = clairvoyanceCanvasWorldPoint(event);
  if (!point?.valid) {
    showToast("通行可能な場所を指定してください。");
    return false;
  }
  const roomId = state.roomId;
  const playerId = state.playerId;
  const requestSerial = ++state.clairvoyanceTeleportRequestSerial;
  const ok = await api("/api/clairvoyance-teleport", { x: point.x, y: point.y });
  if (!ok || requestSerial !== state.clairvoyanceTeleportRequestSerial || state.roomId !== roomId || state.playerId !== playerId) return false;
  // Close only after this same-session response confirms canonical closure.
  if (state.clairvoyance.active && !ok.self?.clairvoyanceActive) {
    setLocalClairvoyanceActive(false, ok);
    state.clairvoyance.serverDesired = false;
    state.clairvoyance.requestPending = false;
  }
  return true;
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
  if (beginInstantWarpTargeting()) return;
  if (beginSelfLocationTeleportFromMap()) return;
  setExpandedMapOpen(true);
}

function selfLocationTeleportContext(data = state.data) {
  const self = data?.self;
  if (!self || data.phase !== "playing" || !self.alive || self.ejected || self.inVent) return null;
  const nativeGravity = self.special === "teleport";
  const borrowedGravity = self.special === "alchemist" &&
    selectedBorrowedOperator() === "gravity" &&
    hasDisplayedOperatorAccess(self, "gravity");
  if (!nativeGravity && !borrowedGravity) return null;
  if ((Number(self.teleportReadyAt) || 0) > estimatedServerNow(data)) return null;
  return { self, borrowed: borrowedGravity };
}

function beginSelfLocationTeleportFromMap() {
  const context = selfLocationTeleportContext();
  if (!context) return false;
  state.teleportTargetId = context.self.id;
  state.teleportTargetMode = "body";
  state.teleportTargeting = true;
  state.teleportBorrowed = context.borrowed;
  setExpandedMapOpen(true);
  initializeMapKeyboardPointer();
  syncExpandedMapUi();
  return true;
}

function syncExpandedMapUi() {
  const targeting = state.expandedMapOpen && (state.teleportTargeting || state.instantWarpTargeting);
  const area = currentAreaLabel(state.data);
  const teleportTarget = state.data?.players?.find((player) => player.id === state.teleportTargetId);
  els.expandedMapTitle.textContent = state.instantWarpTargeting
    ? "テレポートマップスクロール：転移先"
    : targeting
      ? state.teleportTargetMode === "target"
        ? `${teleportTarget?.name || "対象"} の対象転移先`
        : `${teleportTarget?.name || "自分"} の転移先`
      : `現在地: ${area}`;
  els.teleportMapStatus.hidden = !targeting;
  els.expandedMapCanvas.classList.toggle("teleport-targeting", targeting);
}

function beginInstantWarpTargeting() {
  const data = state.data;
  if (!data || data.phase !== "playing" || !data.self.alive || data.self.ejected || data.self.inVent || data.self.warpCharges <= 0) return false;
  state.instantWarpTargeting = true;
  state.teleportTargeting = false;
  state.teleportBorrowed = false;
  setExpandedMapOpen(true);
  initializeMapKeyboardPointer();
  return true;
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
  if (mode === "target") {
    beginTeleportTargeting("target");
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
  if (mode === "time-keeper") {
    void api("/api/gravity-time-keeper");
    return;
  }
  beginTeleportTargeting("body");
}

function beginTeleportTargeting(mode = "body") {
  const data = state.data;
  if (!data || data.phase !== "playing" || data.self.special !== "teleport" || !["body", "target"].includes(mode)) return;
  const liveNow = estimatedServerNow(data);
  if (!data.self.alive || data.self.ejected || data.self.inVent || data.self.teleportReadyAt > liveNow) return;
  state.teleportTargetId = mode === "target" ? (els.teleportTargetSelect.value || data.self.id) : data.self.id;
  state.teleportTargetMode = mode;
  state.teleportTargeting = true;
  state.teleportBorrowed = false;
  setExpandedMapOpen(true);
  initializeMapKeyboardPointer();
}

function beginBorrowedGravityTargeting(mode = "body") {
  const data = state.data;
  if (!data || data.phase !== "playing" || data.self.special !== "alchemist" || !["body", "target"].includes(mode)) return;
  if (!hasDisplayedOperatorAccess(data.self, "gravity") || !data.self.alive || data.self.ejected || data.self.inVent) return;
  state.teleportTargetId = mode === "target" ? (els.teleportTargetSelect.value || data.self.id) : data.self.id;
  state.teleportTargetMode = mode;
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
    mode: recipe.inventoryId === "flora" ? (["sunbeam", "invisible"].includes(mode) ? mode : "heal") : mode,
    targetId: combatTarget || (recipe.inventoryId === "flora"
      ? (mode === "sunbeam" ? (els.teleportTargetSelect.value || "") : "")
      : (els.teleportTargetSelect.value || state.data?.self?.id || "")),
    dx: Number(state.data?.self?.aimX) || 0,
    dy: Number(state.data?.self?.aimY) || 1
  };
}

function ensureDefaultBorrowedAbilitySelection(self = state.data?.self) {
  if (self?.special !== "alchemist" || !self.hackerRootActive) return { type: "", mode: "" };
  const owned = availableBorrowedActiveOperatorTypes(self);
  if (!owned.length) return { type: "", mode: "" };
  const hasRememberedType = owned.includes(state.borrowedOperatorType);
  const type = hasRememberedType
    ? state.borrowedOperatorType
    : (owned.includes("gravity") ? "gravity" : owned[0]);
  const choices = OPERATOR_ABILITY_MODE_OPTIONS[type] || [];
  if (!choices.length) return { type: "", mode: "" };
  state.borrowedOperatorType = type;
  if (type === "quantum") {
    const executableModes = ["kinetic-accelerate", "kinetic-decelerate", "nuclear-transmutation", "nuclear-fission", "nuclear-fusion"];
    const remembered = normalizeQuantumClientMode(state.borrowedAbilityModes.quantum);
    const mode = executableModes.includes(remembered) ? remembered : "kinetic-accelerate";
    rememberQuantumExecutableMode(mode, true);
    return { type, mode };
  }
  const remembered = state.borrowedAbilityModes[type];
  const defaultMode = !hasRememberedType && type === "gravity" ? "accelerate" : choices[0][0];
  const mode = choices.some(([value]) => value === remembered) ? remembered : defaultMode;
  state.borrowedAbilityModes[type] = mode;
  return { type, mode };
}

function selectedBorrowedOperator() {
  return ensureDefaultBorrowedAbilitySelection().type;
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
  if (type === "gravity" && ["body", "target"].includes(mode)) {
    beginBorrowedGravityTargeting(mode);
    return;
  }
  void api("/api/borrowed-ability", borrowedAbilityPayload(recipe, mode));
}

function triggerSelectedBorrowedAbility() {
  const self = state.data?.self;
  if (self?.special !== "alchemist" || !self.hackerRootActive) return false;
  const type = selectedBorrowedOperator();
  if (!type) return false;
  triggerBorrowedAbility(type, state.borrowedAbilityModes[type] || "");
  return true;
}

function setOperatorBranchesOpen(open, operatorType = "", focusFirst = true) {
  const self = state.data?.self;
  state.operatorBranchesOpen = Boolean(open && self && state.data?.phase === "playing");
  state.operatorBranchType = state.operatorBranchesOpen ? operatorType : "";
  els.operatorBranchPanel.hidden = !state.operatorBranchesOpen;
  els.operatorBranchList.replaceChildren();
  if (!state.operatorBranchesOpen) {
    state.quantumOperatorBranchStage = "ability";
    return;
  }

  const activeType = operatorType || self.special;
  const borrowedPreview = self.special === "alchemist" && Boolean(operatorType);
  const titles = {
    fighter: "ファイター能力",
    teleport: "グラビティ能力",
    gravity: "グラビティ能力",
    flora: "フローラ能力",
    quantum: "クオンタム",
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
    button.dataset.repeatableAbility = "1";
    button.addEventListener("click", () => {
      action();
    });
    els.operatorBranchList.appendChild(button);
  };

    if (activeType === "teleport" || activeType === "gravity") {
      const gravityDescriptions = {
        near: "1MP。選択した他プレイヤーの近くへ全身転移する",
        target: "1MP。マップで指定した地点へ選択対象を転移する。味方への誤射は発動者が即死する",
        heart: "10MP。拳を握り、対象の心臓へ干渉して遠隔確殺を試みる",
      accelerate: "1MP。8秒間×2.5。移動・行動不能時間・クールタイム・タスク・物理モーションを加速する",
      decelerate: "1MP。8秒間×0.38。移動・行動不能時間・クールタイム・タスク・物理モーションを減速する",
      "time-keeper": "1000MP。5秒間、術者以外の全プレイヤー・入力・クールタイム・物体運動を完全停止する",
      storm: "10MP。指定地点へ全域の敵を12秒間吸引し、幸運に応じた継続ダメージ・減速・拘束。発動者は最後の1秒だけバリアなし"
    };
    const gravityModes = new Set(["near", "target", "heart", "accelerate", "decelerate", "time-keeper", "storm"]);
    [...els.teleportModeSelect.options].filter((option) => gravityModes.has(option.value)).forEach((option) => {
      addBranch(option.textContent, () => {
        state.borrowedAbilityModes.gravity = option.value;
        els.teleportModeSelect.value = option.value;
        els.teleportModeSelect.dispatchEvent(new Event("change", { bubbles: true }));
      }, option.value === (borrowedPreview ? state.borrowedAbilityModes.gravity : els.teleportModeSelect.value), gravityDescriptions[option.value] || "");
    });
  } else if (activeType === "flora") {
    const floraDescriptions = {
      heal: "1MP。自分のHP・SP・状態異常を回復し、加速を付与する",
      sunbeam: "10MP。選択対象方向へ光線を放ち、交差した全対象を貫通して確殺する",
      invisible: "10MP。10秒間透明になり、敵Botの直接視認・追跡対象から外れる"
    };
    const floraModes = new Set(["heal", "sunbeam", "invisible"]);
    [...els.teleportModeSelect.options].filter((option) => floraModes.has(option.value)).forEach((option) => {
      addBranch(option.textContent, () => {
        state.borrowedAbilityModes.flora = option.value;
        els.teleportModeSelect.value = option.value;
        els.teleportModeSelect.dispatchEvent(new Event("change", { bubbles: true }));
      }, option.value === (borrowedPreview ? state.borrowedAbilityModes.flora : els.teleportModeSelect.value), floraDescriptions[option.value] || "");
    });
  } else if (activeType === "quantum") {
    const selectQuantumBranchMode = (mode) => {
      rememberQuantumExecutableMode(mode, borrowedPreview);
      if (borrowedPreview) {
        populateRootOperatorModeSelect(self);
      } else {
        populateNativeQuantumModeSelect();
      }
      updateActionButtons(state.data);
      if (state.abilityAutoActivate) {
        if (borrowedPreview) triggerBorrowedAbility("quantum", mode);
        else void api("/api/quantum-control", { mode });
      }
      setOperatorBranchesOpen(false);
    };
    if (state.quantumOperatorBranchStage === "kinetic") {
      addBranch("加速", () => selectQuantumBranchMode("kinetic-accelerate"), selectedQuantumExecutableMode(borrowedPreview) === "kinetic-accelerate", "所持している水を高温水へ変える。水がなければ何も起きない");
      addBranch("減速", () => selectQuantumBranchMode("kinetic-decelerate"), selectedQuantumExecutableMode(borrowedPreview) === "kinetic-decelerate", "所持している水を氷へ変える。水がなければ何も起きない");
    } else {
      addBranch("運動エネルギー制御", () => {
        state.quantumOperatorBranchStage = "kinetic";
        setOperatorBranchesOpen(true, operatorType, true);
      }, selectedQuantumExecutableMode(borrowedPreview).startsWith("kinetic-"), "選択後、加速か減速へ分岐する");
      addBranch("核変換", () => selectQuantumBranchMode("nuclear-transmutation"), selectedQuantumExecutableMode(borrowedPreview) === "nuclear-transmutation", "所持している鉛か水銀を金へ変えて100Cへ即時換金する。対象がなければ何も起きない");
      addBranch("核分裂", () => selectQuantumBranchMode("nuclear-fission"), selectedQuantumExecutableMode(borrowedPreview) === "nuclear-fission", "終盤に所持ウランかプルトニウムへ核分裂を適用し、全人間へ影響する。対象がなければ何も起きない");
      addBranch("核融合", () => selectQuantumBranchMode("nuclear-fusion"), selectedQuantumExecutableMode(borrowedPreview) === "nuclear-fusion", "終盤に重水素を含む所持海水で核融合し、全人間へ影響する。海水がなければ何も起きない");
    }
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
      mode: ["sunbeam", "invisible"].includes(mode) ? mode : "heal",
      targetId: mode === "sunbeam" ? (els.teleportTargetSelect.value || "") : "",
      dx: Number(self.aimX) || 0,
      dy: Number(self.aimY) || 1
    });
  } else if (self.special === "quantum") {
    void api("/api/quantum-control", { mode: selectedQuantumExecutableMode(false) });
  } else if (self.special === "alchemist") {
    if (self.hackerRootActive) triggerSelectedBorrowedAbility();
    else void api("/api/hacker-root");
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

function beginExpandedMapTap(event) {
  if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
  state.expandedMapTap = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    moved: false
  };
  updateExpandedMapPointer(event);
  try { els.expandedMapCanvas.setPointerCapture(event.pointerId); } catch {}
}

function moveExpandedMapTap(event) {
  updateExpandedMapPointer(event);
  const tap = state.expandedMapTap;
  if (!tap || tap.pointerId !== event.pointerId || tap.moved) return;
  tap.moved = Math.hypot(event.clientX - tap.startX, event.clientY - tap.startY) > 10;
}

function finishExpandedMapTap(event, cancelled = false) {
  const tap = state.expandedMapTap;
  if (!tap || tap.pointerId !== event.pointerId) return;
  state.expandedMapTap = null;
  if (cancelled || tap.moved) return;
  event.preventDefault();
  void teleportFromExpandedMap(event);
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
  if (!state.teleportTargeting && !state.instantWarpTargeting) {
    if (!beginSelfLocationTeleportFromMap()) return;
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
  if (state.instantWarpTargeting) {
    clearMovementInput(false);
    rotateMovementSession();
    sendMovement(true);
  }
  const ok = await api(endpoint, {
    x: point.x,
    y: point.y,
    targetId: state.teleportTargeting ? state.teleportTargetId : "",
    mode: state.teleportTargeting ? state.teleportTargetMode : "body",
    ability: state.teleportBorrowed ? "gravity" : undefined
  });
  if (!ok) return;
  if (
    endpoint === "/api/instant-warp" &&
    Math.hypot(Number(ok.self?.x) - point.x, Number(ok.self?.y) - point.y) > 2
  ) {
    showToast("テレポート先への移動を確認できませんでした。権利は消費されていません。");
    return;
  }
  setExpandedMapOpen(false);
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

function renderSkinAssetId(value) {
  return normalizeSkinId(value) === "blue-dress" ? "blue-dress" : "white-hood";
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
  const selected = player && player.id === data?.selfId && state.pendingSkinId
    ? state.pendingSkinId
    : player?.skinId;
  return renderSkinAssetId(selected);
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

function acceptMatchmakingResult(result, name, offline) {
  if (!result || result.phase === "lobby") return false;
  if (offline) activateOfflineMode();
  else deactivateOfflineMode();
  lockPlayerName(result.profile?.name || responsePlayerName(result, name));
  setCurrentRoomSession(result.roomId, result.playerId);
  applyState(result);
  recordUsageCheckpoint(offline ? "matchmaking_offline" : "matchmaking_online");
  showToast(offline
    ? "対戦相手が見つからなかったため、オフライン対戦を開始します。"
    : "対戦相手が見つかりました。オンライン対戦を開始します。");
  return true;
}

function newInstantMatchmakingRequestId() {
  return globalThis.crypto?.randomUUID?.() || `instant-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function cancelInstantMatchmaking(ticket) {
  if (!ticket?.matchmakingRequestId) return null;
  return request("/api/matchmake/instant/cancel", {
    matchmakingRequestId: ticket.matchmakingRequestId
  }, {
    quiet: true,
    forceOnline: true,
    timeoutMs: 900,
    attempts: 1
  });
}

async function startMatchmaking() {
  if (state.matchmakingInFlight) return;
  loadGameplayTextures();
  const name = els.nameInput.value.trim();
  if (!name) {
    showToast("最初に名前を入力してください。");
    els.nameInput.focus();
    return;
  }
  const skinId = normalizeSkinId(els.skinSelect.value);
  const mapId = normalizeMatchmakingMapId(els.mapSelect.value);
  localStorage.setItem(storage.name, name);
  localStorage.setItem(storage.skin, skinId);
  localStorage.setItem(storage.map, mapId);
  const serial = ++state.matchmakingSerial;
  state.matchmakingInFlight = true;
  state.matchmakingTicket = null;
  els.matchmakingButton.disabled = true;
  els.matchmakingButton.textContent = "対戦方式を即時判定中…";
  document.documentElement.dataset.connectionMode = "matching";
  try {
    // Availability is refreshed independently in the background. The Play
    // path never waits on a multi-second capacity probe: it either asks the
    // server for one 120ms atomic pairing decision or falls back locally now.
    const available = state.onlineAvailable;
    let result = null;
    if (available && serial === state.matchmakingSerial) {
      const matchmakingRequestId = newInstantMatchmakingRequestId();
      const ticket = { matchmakingRequestId, mapId };
      state.matchmakingTicket = ticket;
      result = await request("/api/matchmake", {
        name,
        skinId,
        mapId,
        instantDecision: true,
        matchmakingRequestId
      }, {
        quiet: true,
        forceOnline: true,
        timeoutMs: 1200,
        attempts: 1
      });
      state.matchmakingTicket = null;
      if (result?.matchmaking?.status === "online" && serial === state.matchmakingSerial && acceptMatchmakingResult(result, name, false)) return;
    }
    if (serial !== state.matchmakingSerial) return;
    if (!activateOfflineMode()) {
      showToast("オフライン対戦を準備できませんでした。");
      return;
    }
    result = await request("/api/matchmake", { name, skinId, mapId, offlineFallback: true }, { forceOffline: true });
    if (serial !== state.matchmakingSerial) return;
    acceptMatchmakingResult(result, name, true);
  } finally {
    if (serial === state.matchmakingSerial) {
      state.matchmakingInFlight = false;
      state.matchmakingTicket = null;
      els.matchmakingButton.disabled = false;
      els.matchmakingButton.textContent = "マッチング開始 [L]";
    }
  }
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
  setCurrentRoomSession(result.roomId, result.playerId);
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
  const generation = state.roomSessionGeneration;
  state.pollInFlight = true;
  try {
    const result = await request("/api/state", {
      roomId,
      playerId
    }, { quiet: true });
    if (result && isCurrentRoomSession(roomId, playerId, generation)) applyState(result);
  } finally {
    state.pollInFlight = false;
  }
}

async function runVerificationRealScreenAutoStart() {
  if (!VERIFY_REAL_SCREEN_AUTO_START || !state.offlineClient) return;
  document.documentElement.setAttribute("data-v533-auto-start-status", "starting");
  try {
    // Pages is the canonical verification origin, so sequential exact-route
    // fixtures share its localStorage. Never let a previous fixture's room
    // identity short-circuit or contaminate the next deterministic run.
    if (state.roomId || state.playerId) resetLocalSession();
    await state.offlineClient.start();
    if (!els.nameInput.value.trim()) els.nameInput.value = "V533 Verify";
    const name = els.nameInput.value.trim();
    const skinId = normalizeSkinId(els.skinSelect.value);
    const mapId = normalizeMatchmakingMapId(els.mapSelect.value);
    setScreen("game");
    const result = await request("/api/matchmake", {
      name,
      skinId,
      mapId,
      offlineFallback: true
    }, { forceOffline: true, attempts: 3, timeoutMs: 30_000 });
    if (!acceptMatchmakingResult(result, name, true)) {
      throw new Error(`verification matchmaking failed: ${JSON.stringify({
        received: Boolean(result),
        phase: String(result?.phase || ""),
        matchmaking: String(result?.matchmaking?.status || ""),
        hasRoom: Boolean(result?.roomId),
        hasPlayer: Boolean(result?.playerId)
      })}`);
    }
    const self = state.data?.self;
    if (state.data?.phase === "selecting" && self && !self.operatorReady) {
      const operator = (state.data.operators?.[self.role] || [])
        .find((entry) => Number(entry.taken) < Number(entry.limit));
      if (!operator || !(await selectOperatorFromCard(operator))) {
        throw new Error("verification operator selection failed");
      }
    }
    document.documentElement.setAttribute("data-v533-auto-start-status", "ready");
  } catch (error) {
    document.documentElement.setAttribute("data-v533-auto-start-status", "failed");
    document.documentElement.setAttribute("data-v533-auto-start-error", String(error?.message || error));
  }
}

async function leaveCurrentRoom(options = {}) {
  if (!state.roomId || !state.playerId) return false;
  const roomId = state.roomId;
  const playerId = state.playerId;
  const destination = options.destination || (state.data?.soloMission ? "tactics" : "title");
  els.leaveRoomButton.disabled = true;
  const result = await request("/api/leave", { roomId, playerId }, { quiet: true });
  els.leaveRoomButton.disabled = false;
  if (!result || state.roomId !== roomId || state.playerId !== playerId) return false;
  resetLocalSession();
  switchScreenWithEffect(destination);
  if (options.announce !== false) showToast("マッチから退出しました。");
  return true;
}

async function rematch() {
  if (state.data?.soloMission) return leaveCurrentRoom();
  els.resetButton.disabled = true;
  const left = await leaveCurrentRoom({ destination: "game", announce: false });
  els.resetButton.disabled = false;
  if (!left) {
    showToast("現在のマッチを終了できませんでした。");
    return false;
  }
  await startMatchmaking();
  return true;
}

async function returnOfflineToOperatorSelect() {
  if (!state.offlineMode || !state.roomId || !state.playerId || state.data?.phase !== "playing") return false;
  const roomId = state.roomId;
  const playerId = state.playerId;
  els.operatorReselectButton.disabled = true;
  clearMovementInput();
  closeSwitchDragMenu();
  if (state.expandedMapOpen) setExpandedMapOpen(false);
  const result = await request("/api/operator-reselect", {
    roomId,
    playerId,
    localOffline: true
  }, { quiet: true, forceOffline: true });
  els.operatorReselectButton.disabled = false;
  if (!result || state.roomId !== roomId || state.playerId !== playerId) {
    showToast("オペレーター選択へ戻れませんでした。");
    return false;
  }
  applyState(result);
  // Operator reselect changes the semantic owner of the shared sidebar. A
  // preserved Vending/Inventory offset would otherwise put the fresh operator
  // UI above the viewport and make the panel appear blank. Invalidate the
  // poll snapshot before resetting so its deferred two-frame restore cannot
  // reapply the previous context's position.
  resetScrollSurfaceForSemanticContext(els.sidePanel);
  showToast("陣営とオペレーターを選び直してください。");
  return true;
}

function syncOfflineTeamChoiceVisual(role) {
  const activeRole = state.offlineMode && ["defender", "attacker"].includes(role) ? role : "";
  const busy = state.offlineTeamChoiceInFlight;
  [
    [els.offlineDefenderButton, "defender"],
    [els.offlineAttackerButton, "attacker"]
  ].forEach(([button, value]) => {
    const selected = activeRole === value;
    button.setAttribute("aria-pressed", String(selected));
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-disabled", String(busy));
  });
  els.offlineTeamChoice.setAttribute("aria-busy", String(busy));
}

async function chooseOfflineTeam(role) {
  if (state.offlineTeamChoiceInFlight || !state.offlineMode || state.data?.phase !== "selecting" || !["defender", "attacker"].includes(role)) return false;
  const previousRole = state.data?.self?.role || "defender";
  state.offlineTeamChoiceInFlight = true;
  syncOfflineTeamChoiceVisual(role);
  const result = await request("/api/offline-team", {
    roomId: state.roomId,
    playerId: state.playerId,
    role,
    localOffline: true
  }, { quiet: true, forceOffline: true });
  state.offlineTeamChoiceInFlight = false;
  if (!result) {
    syncOfflineTeamChoiceVisual(previousRole);
    showToast("陣営を変更できませんでした。");
    return false;
  }
  applyState(result);
  syncOfflineTeamChoiceVisual(result.self?.role || previousRole);
  return true;
}

async function returnToTitle() {
  if (state.matchmakingInFlight) {
    const ticket = state.matchmakingTicket;
    state.matchmakingSerial += 1;
    state.matchmakingInFlight = false;
    state.matchmakingTicket = null;
    els.matchmakingButton.disabled = false;
    els.matchmakingButton.textContent = "マッチング開始 [L]";
    void cancelInstantMatchmaking(ticket);
  }
  if (state.roomId && state.playerId) {
    return leaveCurrentRoom({ destination: "title" });
  }
  state.tacticsReturnScreen = "title";
  switchScreenWithEffect("title");
  return true;
}

function releaseRejectedActionTransientInput() {
  cancelActiveRootShortcutHolds();
  stopContinuousActionHold();
  stopContinuousActionKeyHold();
  state.continuousActionKeyAt.clear();
  state.continuousActionSuppressClicks = new WeakMap();
  cancelActiveAbilityBatchHolds({ notifyServer: false });
  stopVendingHold({ suppressClick: true });
  els.tabletBranchList?.querySelectorAll("button").forEach((button) => button.cancelScrollableHold?.());
  closeSwitchDragMenu();
  clearNativeSelectHold();
  closeQuantumKineticHold();
  Object.assign(state.quantumKineticHold, {
    pointerId: null,
    source: null,
    opened: false,
    cancelled: false,
    selected: "",
    borrowed: false
  });
  const tabletPointerId = state.tabletGesture.pointerId;
  const tabletSource = state.tabletGesture.sourceButton;
  window.clearTimeout(state.tabletGesture.submenuTimer);
  state.tabletGesture.submenuTimer = 0;
  state.tabletGesture.hoverButton?.classList.remove("gesture-hover");
  state.tabletGesture.hoverButton = null;
  state.tabletGesture.pointerId = null;
  state.tabletGesture.sourceButton = null;
  state.tabletGesture.suppressClick = false;
  tabletSource?.classList.remove("gesture-source");
  els.tabletPanel?.classList.remove("gesture-active");
  if (tabletSource && tabletPointerId !== null) {
    try {
      if (tabletSource.hasPointerCapture?.(tabletPointerId)) tabletSource.releasePointerCapture(tabletPointerId);
    } catch {}
  }
  state.blankPaneTap = null;
  clearLocalGunTrigger();
  if (state.enhanceHold.kind) cancelEnhanceAction(state.enhanceHold.kind, { recoverOnFailure: false });
  if (state.throwTargeting.active) cancelThrowTargeting(true, "", { recoverOnFailure: false });
  const jumpPointerId = state.jumpPointerId;
  state.jumpPointerId = null;
  if (jumpPointerId !== null) {
    for (const button of [els.jumpButton, els.tabletJumpShortcut]) {
      try {
        if (button?.hasPointerCapture?.(jumpPointerId)) button.releasePointerCapture(jumpPointerId);
      } catch {}
    }
  }
  if (state.jumpPreparing) {
    resetJumpPreparationLocal();
    if (state.roomId && state.playerId) {
      void request("/api/jump/cancel", {
        roomId: state.roomId,
        playerId: state.playerId
      }, { quiet: true, attempts: 1 });
    }
  }
  clearMovementInput();
}

async function resyncAfterRejectedAction() {
  const recovery = state.rejectedActionRecovery;
  if (!state.roomId || !state.playerId) return false;
  if (recovery.inFlight) {
    recovery.queued = true;
    return false;
  }
  recovery.inFlight = true;
  try {
    do {
      recovery.queued = false;
      const roomId = state.roomId;
      const playerId = state.playerId;
      const generation = state.roomSessionGeneration;
      const result = await request("/api/state", { roomId, playerId }, {
        quiet: true,
        attempts: 1,
        timeoutMs: 3_000,
        resetOnNotFound: false
      });
      if (result && isCurrentRoomSession(roomId, playerId, generation)) {
        applyState(result, { authoritative: true });
      }
    } while (recovery.queued && state.roomId && state.playerId);
    return true;
  } finally {
    recovery.inFlight = false;
  }
}

function recoverAfterRejectedAction() {
  releaseRejectedActionTransientInput();
  void resyncAfterRejectedAction();
}

async function api(path, extra = {}, options = {}) {
  if (!state.roomId || !state.playerId) {
    showToast("先にマッチングを開始してください。");
    return false;
  }
  const result = await request(path, {
    roomId: state.roomId,
    playerId: state.playerId,
    ...extra
  });
  if (!result) {
    recoverAfterRejectedAction();
    return false;
  }
  if (result.moderated) {
    const message = result.error || "禁止コメントを検出したため退出しました。";
    resetLocalSession();
    showToast(message);
    return result;
  }
  let actionKind = CHARACTER_ACTION_BY_API[path];
  const requestedMode = String(extra?.mode || extra?.phase || extra?.conversion || "");
  if (path === "/api/teleport" && requestedMode === "heart") actionKind = "heart-transfer";
  if (path === "/api/gravity-storm") actionKind = "power";
  if (path === "/api/gravity-time-keeper") actionKind = "power";
  if (path === "/api/quantum-control" && ["nuclear-fission", "nuclear-fusion"].includes(requestedMode)) actionKind = "power";
  if (result.actionApplied === false && (
    path === "/api/quantum-control" ||
    (path === "/api/borrowed-ability" && String(extra?.ability || "") === "quantum")
  )) actionKind = "";
  if (actionKind) {
    const actionVariant = ["/api/shoot", "/api/gunner-weapon"].includes(path)
      ? String(
        result?.self?.gunFiringWeapon ||
        result?.self?.gunnerWeapon ||
        state.data?.self?.gunFiringWeapon ||
        state.data?.self?.gunnerWeapon ||
        ""
      )
      : path === "/api/gunner-reload"
        ? String(
          result?.self?.gunnerReloadWeapon ||
          result?.self?.gunnerWeapon ||
          state.data?.self?.gunnerReloadWeapon ||
          state.data?.self?.gunnerWeapon ||
          ""
        )
        : [
            "/api/teleport",
            "/api/gravity-time",
            "/api/gravity-time-keeper",
            "/api/gravity-storm",
            "/api/quantum-control",
            "/api/emp",
            "/api/alchemy"
          ].includes(path)
          ? requestedMode
          : "";
    triggerCharacterAction(state.playerId, actionKind, undefined, undefined, "", actionVariant, path);
  }
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
    matchmaking_open: "マッチング入口",
    matchmaking_online: "オンライン成立",
    matchmaking_offline: "オフライン自動切替",
    online_open: "旧オンライン入口",
    tactics_open: "戦術いろは",
    online_joined: "旧オンライン入室",
    offline_joined: "旧オフライン入室",
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
  if (!target) {
    showToast("忍殺できる距離に対象がいません。");
    return;
  }
  const ok = await api("/api/ninjutsu", { targetId: target.id });
  if (ok) {
    const assassin = state.data?.self?.special === "assassin";
    showToast(`${target.name}への忍殺準備を開始しました。自分と対象が4秒間静止すると${assassin ? "アサシン忍殺による消滅" : "通常忍殺（死体あり）"}が発動します。`);
  }
}

async function attackFromCanvas(event) {
  if (!state.data || event.button !== 0) return;
  if (beginClairvoyanceTeleportTap(event)) {
    event.preventDefault();
    return;
  }
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

function clearLocalGunTrigger() {
  const pointerId = state.gunTriggerPointerId;
  state.gunTriggerHeld = false;
  state.gunTriggerPointerId = null;
  state.gunFireStartPromise = null;
  state.gunActivationPending = false;
  els.shootButton.classList.remove("active");
  els.tabletShootShortcut?.classList.remove("active");
  if (pointerId === null) return;
  for (const button of [els.shootButton, els.tabletShootShortcut]) {
    try {
      if (button?.hasPointerCapture?.(pointerId)) button.releasePointerCapture(pointerId);
    } catch {}
  }
}

async function beginGunFire(holdMs = 0, chargeId = "") {
  if (state.gunTriggerHeld || state.gunFireStartPromise || els.shootButton.disabled) return false;
  state.gunTriggerHeld = true;
  els.shootButton.classList.add("active");
  const direction = gunnerDirection();
  const request = api("/api/shoot", { action: "start", dx: direction.dx, dy: direction.dy, holdMs, chargeId });
  state.gunFireStartPromise = request;
  const result = await request;
  if (state.gunFireStartPromise === request) {
    clearLocalGunTrigger();
  }
  return Boolean(result);
}

async function endGunFire() {
  const hadTrigger = state.gunTriggerHeld || state.gunFireStartPromise;
  const pending = state.gunFireStartPromise;
  clearLocalGunTrigger();
  if (!hadTrigger) return;
  state.hackerGenerationInFlight = false;
  clearHackerCooldownWake();
  if (pending) await pending;
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
  return finishEnhanceActionAfterTablet("shoot");
}

function cardinalDirectionVector(dx, dy, fallback = { dx: 0, dy: 1 }) {
  const x = Number(dx) || 0;
  const y = Number(dy) || 0;
  if (Math.abs(x) < 0.01 && Math.abs(y) < 0.01) return fallback;
  return Math.abs(x) >= Math.abs(y)
    ? { dx: x < 0 ? -1 : 1, dy: 0 }
    : { dx: 0, dy: y < 0 ? -1 : 1 };
}

function facingFromDirection(dx, dy, fallback = "down") {
  const fallbackVector = {
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 },
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 }
  }[fallback] || { dx: 0, dy: 1 };
  const direction = cardinalDirectionVector(dx, dy, fallbackVector);
  if (direction.dx < 0) return "left";
  if (direction.dx > 0) return "right";
  return direction.dy < 0 ? "up" : "down";
}

function gunnerDirection() {
  const data = state.data;
  const facing = state.facing.get(data?.selfId) || "down";
  const facingVector = {
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 },
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 }
  }[facing];
  const input = getDirection();
  if (input.dx || input.dy) return cardinalDirectionVector(input.dx, input.dy, facingVector);
  const aimX = Number(data?.self.aimX) || 0;
  const aimY = Number(data?.self.aimY) || 0;
  return cardinalDirectionVector(aimX, aimY, facingVector);
}

async function request(path, body = {}, options = {}) {
  const useOffline = options.forceOffline || (state.offlineMode && !options.forceOnline);
  if (useOffline) {
    const result = await state.offlineClient?.request(path, { ...body, clientId: clientId() }, {
      timeoutMs: options.timeoutMs,
      attempts: options.attempts
    });
    if (!result?.ok) {
      if (!options.quiet) showToast(result?.error || "オフライン処理に失敗しました。");
      return null;
    }
    return result;
  }
  const retryable = [
    "/api/state",
    "/api/profile",
    "/api/solo/start",
    "/api/checkpoints",
    "/api/checkpoints/exclude"
  ].includes(path);
  const attempts = Number.isFinite(options.attempts) ? Math.max(1, options.attempts) : retryable ? 3 : 1;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), Number(options.timeoutMs) || 12_000);
    try {
      const response = await fetch(apiUrl(path), {
        method: "POST",
        headers: onlineApiHeaders({ "content-type": "application/json" }),
        body: JSON.stringify({ ...body, clientId: clientId() }),
        signal: controller.signal
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
        if (response.status === 426 || result?.requiredClientRelease) {
          state.onlineAvailable = false;
          applyOnlineAvailabilityUi();
        }
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
    } finally {
      window.clearTimeout(timeout);
    }
  }
  return null;
}

function delay(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function isCurrentRoomSession(roomId, playerId, generation = state.roomSessionGeneration) {
  return generation === state.roomSessionGeneration &&
    state.roomId === roomId && state.playerId === playerId;
}

function setCurrentRoomSession(roomId, playerId) {
  const nextRoomId = String(roomId || "");
  const nextPlayerId = String(playerId || "");
  if (state.roomId !== nextRoomId || state.playerId !== nextPlayerId) {
    state.roomSessionGeneration += 1;
    state.pendingManaConversionTransactionId = "";
    state.pendingManaConversionMode = "";
    state.manaConversionInFlight = false;
    state.manaConversionModeInFlight = false;
  }
  state.roomId = nextRoomId;
  state.playerId = nextPlayerId;
  if (nextRoomId && nextPlayerId) {
    localStorage.setItem(storage.room, nextRoomId);
    localStorage.setItem(storage.player, nextPlayerId);
  }
}

function invalidateFocusResync() {
  state.focusResyncSerial += 1;
  state.focusResyncing = false;
  state.focusResyncPromise = null;
}

function cancelTransientGameInputForBackground() {
  invalidateFocusResync();
  clearMovementInput();
  cancelActiveRootShortcutHolds();
  cancelActiveAbilityBatchHolds();
  stopContinuousActionHold();
  stopContinuousActionKeyHold();
  state.continuousActionKeyAt.clear();
  closeSwitchDragMenu();
  clearNativeSelectHold();
  cancelEnhanceAction();
  cancelThrowTargeting(true);
  clearLocalGunTrigger();
  if (state.clairvoyance.active) setLocalClairvoyanceActive(false, state.data);
  state.clairvoyance.serverDesired = false;
  state.clairvoyance.requestPending = false;
  state.clairvoyance.requestSerial = (Number(state.clairvoyance.requestSerial) || 0) + 1;
  state.tabletResumeAfterMap = false;
  if (state.expandedMapOpen || state.teleportTargeting || state.instantWarpTargeting) setExpandedMapOpen(false);
  if (state.operatorBranchesOpen) setOperatorBranchesOpen(false);
}

function returnExpiredOnlineRoomToMatchmaking(generation, roomId, playerId) {
  if (!isCurrentRoomSession(roomId, playerId, generation)) return false;
  resetLocalSession();
  deactivateOfflineMode();
  setScreen("game");
  showToast("以前の対戦は終了しました。マッチングを開始してください。");
  return true;
}

async function rebuildExpiredOfflineRoom(generation, roomId, playerId) {
  if (!isCurrentRoomSession(roomId, playerId, generation)) return false;
  const name = els.nameInput.value.trim() || localStorage.getItem(storage.name) || "プレイヤー";
  const skinId = normalizeSkinId(localStorage.getItem(storage.skin) || els.skinSelect.value);
  const mapId = normalizeMatchmakingMapId(localStorage.getItem(storage.map) || els.mapSelect.value);
  cancelTransientGameInputForBackground();
  resetLocalSession();
  if (!activateOfflineMode()) {
    setScreen("game");
    showToast("オフライン対戦を復帰できませんでした。マッチングを開始してください。");
    return false;
  }
  const replacementGeneration = state.roomSessionGeneration;
  const result = await request("/api/matchmake", { name, skinId, mapId, offlineFallback: true }, {
    quiet: true,
    forceOffline: true
  });
  if (!result || replacementGeneration !== state.roomSessionGeneration || !state.offlineMode) return false;
  lockPlayerName(result.profile?.name || responsePlayerName(result, name));
  setCurrentRoomSession(result.roomId, result.playerId);
  applyState(result, { authoritative: true });
  setScreen("game");
  showToast("オフライン対戦を復帰しました。オペレーターを選択してください。");
  return true;
}

async function resumeRoomAfterBackground() {
  if (document.hidden || !state.roomId || !state.playerId) return false;
  if (state.backgroundResume.inFlight) {
    state.backgroundResume.queued = true;
    return false;
  }
  state.backgroundResume.inFlight = true;
  const serial = ++state.backgroundResume.serial;
  const roomId = state.roomId;
  const playerId = state.playerId;
  const generation = state.roomSessionGeneration;
  const offline = state.offlineMode;
  try {
    // A suspended dedicated worker can be discarded by the browser. Starting
    // it is idempotent and preserves a healthy worker; a missing generated
    // room is rebuilt below rather than leaking its raw server error.
    if (offline) await state.offlineClient?.start?.();
    const result = await request("/api/state", { roomId, playerId }, {
      quiet: true,
      forceOffline: offline,
      forceOnline: !offline,
      timeoutMs: 3_500,
      attempts: 1
    });
    if (serial !== state.backgroundResume.serial || !isCurrentRoomSession(roomId, playerId, generation)) return false;
    if (result) {
      state.lastMovementServerNow = 0;
      state.lastStateServerNow = 0;
      applyState(result, { authoritative: true });
      if (!offline) ensureRealtimeConnection();
      return true;
    }
    return offline
      ? rebuildExpiredOfflineRoom(generation, roomId, playerId)
      : returnExpiredOnlineRoomToMatchmaking(generation, roomId, playerId);
  } finally {
    if (serial === state.backgroundResume.serial) {
      state.backgroundResume.inFlight = false;
      if (state.backgroundResume.queued && !document.hidden) {
        state.backgroundResume.queued = false;
        queueMicrotask(() => void resumeRoomAfterBackground());
      }
    }
  }
}

async function recoverRoomInteractionAfterBackground() {
  if (document.hidden || !state.roomId || !state.playerId) return false;
  if (state.foregroundRecovery.inFlight) {
    state.foregroundRecovery.queued = true;
    return false;
  }
  state.foregroundRecovery.inFlight = true;
  try {
    // Room ownership must settle before movement creates a new session.  The
    // former parallel calls could resync an expired room and keep every input
    // behind focusResyncing for the offline request's full retry window.
    const resumed = await resumeRoomAfterBackground();
    if (!resumed || document.hidden || !state.roomId || !state.playerId) return false;
    syncClairvoyanceManaUsage();
    if (state.data?.phase !== "playing") return true;
    await resyncMovementAfterFocus();
    // A bounded resync failure must not freeze otherwise legal actions. State
    // polling remains authoritative and the next focus can retry with a new
    // movement-session serial.
    return Boolean(state.data && !document.hidden);
  } finally {
    state.foregroundRecovery.inFlight = false;
    if (state.foregroundRecovery.queued && !document.hidden) {
      state.foregroundRecovery.queued = false;
      queueMicrotask(() => void recoverRoomInteractionAfterBackground());
    }
  }
}

function resetLocalSession() {
  invalidateFocusResync();
  state.roomSessionGeneration += 1;
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
  state.dismissedKillCameraId = "";
  state.hitEffects = [];
  state.magicEffects = [];
  state.worldSoundEffects = [];
  state.movementActive = false;
  state.movementStopPendingSeq = 0;
  state.expandedMapOpen = false;
  state.tabletOpen = false;
  state.tabletResumeAfterMap = false;
  state.operatorBranchesOpen = false;
  resetRootBorrowedAbilitySelection();
  state.gunTriggerHeld = false;
  state.gunTriggerPointerId = null;
  state.gunFireStartPromise = null;
  els.shootButton.classList.remove("active");
  state.teleportTargeting = false;
  state.teleportBorrowed = false;
  state.teleportTargetId = "";
  state.teleportTargetMode = "body";
  state.instantWarpTargeting = false;
  state.cameraViewIndex = -1;
  state.operatorRenderKey = "";
  state.resultCelebrationKey = "";
  state.resultBoardFingerprint = "";
  els.resultConfetti.replaceChildren();
  state.mapPointer = null;
  state.actionSelectionId = "";
  state.phaseUiKey = "";
  state.actionLayoutKey = "";
  state.activeEffectsRenderKey = "";
  state.inventoryVisualWeapon = "";
  state.explicitInventoryItemId = "";
  state.implicitHsgInventoryFallback = false;
  state.selectedWeaponItemId = "";
  state.hackerTargetId = "";
  state.hackerDockRenderKey = "";
  state.hackerSelectedRecipeId = "";
  state.hackerSelectedByCategory = Object.create(null);
  state.vendingOpen = false;
  state.vendingBulkPurchase = false;
  els.vendingBulkPurchase.checked = false;
  state.vendingRenderKey = "";
  state.vendingCategoryId = "generate-supply";
  state.vendingSelectedByCategory = Object.create(null);
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
  localStorage.removeItem(storage.offlineSession);
  render();
}

function applyState(data, options = {}) {
  if (!options.authoritative && isStaleState(data)) return false;
  if (data?.phase === "lobby" && !data.soloMission) {
    resetLocalSession();
    showToast("旧ルームを終了しました。マッチングを開始してください。");
    return false;
  }
  const previousPhase = state.data?.phase || "";
  if (!data.self?.gunFiring && state.gunTriggerHeld && !state.gunFireStartPromise) {
    clearLocalGunTrigger();
  }
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
    stopVendingKeyHold();
    cancelEnhanceAction();
    cancelThrowTargeting(true);
    state.vendingOpen = false;
    state.vendingBulkPurchase = false;
    els.vendingBulkPurchase.checked = false;
    els.vendingPanel.hidden = true;
    els.itemControl.hidden = true;
    state.vendingRenderKey = "";
    state.itemRenderKey = "";
    setOperatorBranchesOpen(false);
    if (["selecting", "ended"].includes(data.phase)) resetRootBorrowedAbilitySelection();
  }
  if (state.data?.roomId && state.data.roomId !== data.roomId) setExpandedMapOpen(false);
  const borrowedGravityTargetingValid = state.teleportBorrowed && hasDisplayedOperatorAccess(data.self, "gravity");
  if (state.teleportTargeting && (data.phase !== "playing" || (data.self.special !== "teleport" && !borrowedGravityTargetingValid) || !data.self.alive)) {
    state.teleportTargeting = false;
    state.teleportBorrowed = false;
    state.teleportTargetId = "";
    state.teleportTargetMode = "body";
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
  if (IS_VERIFICATION_MODE) {
    const barrierActive = data.phase === "playing" && Number(data.preparationEndsAt) > Number(data.serverNow || Date.now());
    document.documentElement.setAttribute("data-v533-preparation-barrier-active", barrierActive ? "true" : "false");
    if (barrierActive) state.verificationPreparationBarrierSeen = true;
    if (state.verificationPreparationBarrierSeen && !barrierActive) {
      state.verificationPreparationBarrierReleased = true;
    }
    document.documentElement.setAttribute(
      "data-v533-preparation-barrier-released",
      state.verificationPreparationBarrierReleased ? "true" : "false"
    );
    const self = data.self || {};
    const root = document.documentElement;
    root.setAttribute("data-v550-fixture", VERIFY_REAL_SCREEN_FIXTURE_KIND || "manual");
    root.setAttribute("data-v550-self-role", String(self.role || ""));
    root.setAttribute("data-v550-self-special", String(self.special || ""));
    root.setAttribute("data-v550-self-mana", String(self.mana ?? ""));
    root.setAttribute("data-v550-self-stamina", String(self.stamina ?? ""));
    root.setAttribute("data-v550-self-credits", String(self.credits ?? ""));
    root.setAttribute("data-v550-self-body-hits", String(self.bodyHits ?? ""));
    root.setAttribute("data-v550-self-grit", String(self.gritCharges ?? ""));
    root.setAttribute("data-v550-fighter-energy", String(self.fighterEnergyCharge ?? ""));
    root.setAttribute("data-v550-fighter-peak", String(self.fighterEnergyPeak ?? ""));
    root.setAttribute("data-v550-fighter-infinite", self.fighterInfiniteResources ? "true" : "false");
    root.setAttribute("data-v550-movement-acc", String(self.movementAcc ?? ""));
    root.setAttribute("data-v550-movement-acc-enabled", self.movementAccEnabled === false ? "false" : "true");
    root.setAttribute("data-v550-movement-acc-active", self.movementAccActive ? "true" : "false");
    root.setAttribute("data-v550-root-active", self.hackerRootActive ? "true" : "false");
    root.setAttribute("data-v550-task-done-count", String((self.tasks || []).filter((task) => task.done).length));
    root.setAttribute("data-v550-sabotage-type", String(data.sabotage?.type || ""));
    root.setAttribute("data-v550-last-event", String((data.events || []).at(-1)?.text || ""));
    root.setAttribute("data-v550-magic-types", (data.magicEffects || []).slice(-12).map((effect) => effect.type).join(","));
    if (data.sabotage?.type) root.setAttribute("data-v550-sabotage-observed", String(data.sabotage.type));
    if ((data.magicEffects || []).some((effect) => effect.type === "action-repair" && effect.variant === "proximity")) {
    root.setAttribute("data-v550-proximity-repair-observed", "true");
    }
    root.setAttribute("data-v553-mana-conversion-mode", String(self.manaConversionMode || "reason"));
    root.setAttribute("data-v553-self-mana", String(self.mana ?? ""));
    root.setAttribute("data-v553-self-grit", String(self.gritCharges ?? ""));
    root.setAttribute("data-v553-self-reason", String(self.reasonCharges ?? ""));
    const manaConversionEffects = (data.magicEffects || []).filter((effect) => (
      effect.variant === "mana-conversion" && ["instant-stand-firm-acquired", "instant-push-acquired"].includes(effect.type)
    ));
    for (const effect of manaConversionEffects) {
      if (effect.type === "instant-stand-firm-acquired") root.setAttribute("data-v553-barrier-ate-observed", "true");
      if (effect.type === "instant-push-acquired") root.setAttribute("data-v553-bust-ate-observed", "true");
    }
    root.setAttribute("data-v554-gunner-aim-active", self.gunnerSnipingActive ? "true" : "false");
    root.setAttribute("data-v554-gunner-luck", String(self.luck ?? ""));
    root.setAttribute("data-v554-gunner-current-hs-chance", String(self.gunnerCurrentHeadshotChance ?? ""));
    root.setAttribute("data-v554-gunner-last-hit-zone", String(self.gunnerLastHitZone || ""));
    if (self.gunnerBodyHitObserved) root.setAttribute("data-v554-gunner-body-observed", "true");
    if (self.gunnerHeadshotObserved) root.setAttribute("data-v554-gunner-head-observed", "true");
    if (self.gunnerLastHitZone === "body") root.setAttribute("data-v554-gunner-body-observed", "true");
    if (self.gunnerLastHitZone === "head") root.setAttribute("data-v554-gunner-head-observed", "true");
    if ((data.magicEffects || []).some((effect) => effect.type === "action-gunner-headshot")) {
      root.setAttribute("data-v554-gunner-headshot-ate-observed", "true");
    }
    root.setAttribute("data-v554-quantum-mode", String(self.quantumMode || ""));
    root.setAttribute("data-v554-quantum-electric-self-mana", String(self.mana ?? ""));
    root.setAttribute("data-v554-quantum-electric-self-stamina", String(self.stamina ?? ""));
    root.setAttribute("data-v554-quantum-electric-last-target", String(self.quantumElectricLastTargetId || ""));
    root.setAttribute("data-v554-quantum-electric-last-outcome", String(self.quantumElectricLastOutcome || ""));
    root.setAttribute("data-v554-quantum-electric-last-damage", String(self.quantumElectricLastDamage ?? ""));
    const electricEffect = (data.magicEffects || []).findLast((effect) => effect.type === "quantum-electric-discharge");
    if (electricEffect) {
      root.setAttribute("data-v554-quantum-electric-effect-observed", "true");
      root.setAttribute("data-v554-quantum-electric-target", String(electricEffect.targetId || ""));
    }
    const visibleSunbeamCount = (data.magicEffects || []).filter((effect) => effect.type === "flora-sunbeam").length;
    if (visibleSunbeamCount > Number(root.getAttribute("data-v550-sunbeam-count") || 0)) {
      root.setAttribute("data-v550-sunbeam-count", String(visibleSunbeamCount));
    }
    const visibleCreditMarkerCount = Math.max(0, ...(data.magicEffects || [])
      .filter((effect) => effect.type === "gain-credits")
      .map((effect) => Number(effect.markerCount) || 0));
    if (visibleCreditMarkerCount > Number(root.getAttribute("data-v550-credit-marker-count") || 0)) {
      root.setAttribute("data-v550-credit-marker-count", String(visibleCreditMarkerCount));
    }
    if (VERIFY_REAL_SCREEN_FIXTURE_KIND.startsWith("enemy-bot-repertoire-")) {
      const repertoireEvent = (data.events || []).findLast((event) => /RPG|レールガン|核変換|ROOT|借用|heavy-rpg|invention-railgun|quantum-nuclear|root-borrowed/.test(String(event?.text || "")));
      if (repertoireEvent) root.setAttribute("data-v550-bot-repertoire-event", String(repertoireEvent.text || ""));
    }
    if (Number(self.fighterEnergyPeak) === 99) root.setAttribute("data-v550-fighter-ec99-observed", "true");
    if (self.fighterInfiniteResources) root.setAttribute("data-v550-fighter-ec100-observed", "true");
    if (self.movementAccActive && Number(self.movementAcc) >= 2) root.setAttribute("data-v550-movement-acc2-observed", "true");
  }
  if (VERIFY_REAL_SCREEN_FIXTURE_KIND === "enemy-bot-combat" && state.verificationEnemyBotBaseline) {
    const bot = (Array.isArray(data.players) ? data.players : [])
      .find((entry) => entry.id === state.verificationEnemyBotBaseline.id);
    const moved = Boolean(bot) && Math.hypot(
      Number(bot.x) - state.verificationEnemyBotBaseline.x,
      Number(bot.y) - state.verificationEnemyBotBaseline.y
    ) > 1;
    const killed = data.self?.alive === false || data.self?.ejected === true;
    if (moved) document.documentElement.setAttribute("data-v533-enemy-bot-moved", "true");
    if (killed) document.documentElement.setAttribute("data-v533-enemy-bot-killed", "true");
  }
  if (VERIFY_REAL_SCREEN_FIXTURE_KIND === "enemy-defender-task") {
    const taskEvent = (Array.isArray(data.events) ? data.events : [])
      .findLast((event) => /Bot .* を完了し、20Cを獲得しました。/.test(String(event?.text || "")));
    if (taskEvent) {
      document.documentElement.setAttribute("data-v527-enemy-defender-task-event", String(taskEvent.text || ""));
      if (state.verificationEnemyDefenderTaskEventId !== taskEvent.id) {
        state.verificationEnemyDefenderTaskEventId = taskEvent.id;
        showToast(`実画面検証: ${taskEvent.text}`);
      }
    }
  }
  if (VERIFY_REAL_SCREEN_FIXTURE_KIND && data.phase === "playing" && data.self?.alive) {
    const fixtureSessionKey = `${data.roomId}:${data.selfId}:${VERIFY_REAL_SCREEN_FIXTURE_KIND}`;
    if (state.verificationFixtureSessionKey !== fixtureSessionKey) {
      state.verificationFixtureSessionKey = fixtureSessionKey;
      queueMicrotask(async () => {
        if (state.verificationFixtureSessionKey !== fixtureSessionKey || state.data?.phase !== "playing") return;
        const result = await request("/api/regression-real-screen-fixture", {
          roomId: state.roomId,
          playerId: state.playerId,
          _offlineDeveloper: true,
          kind: VERIFY_REAL_SCREEN_FIXTURE_KIND
        }, { attempts: 1, timeoutMs: 3_000, resetOnNotFound: false });
        if (result && state.verificationFixtureSessionKey === fixtureSessionKey) {
          if (VERIFY_REAL_SCREEN_FIXTURE_KIND === "enemy-bot-combat") {
            const bot = (Array.isArray(result.players) ? result.players : [])
              .find((entry) => entry.isBot && entry.alive && !entry.ejected);
            state.verificationEnemyBotBaseline = bot
              ? { id: bot.id, x: Number(bot.x), y: Number(bot.y) }
              : null;
            document.documentElement.setAttribute("data-v533-enemy-bot-moved", "false");
            document.documentElement.setAttribute("data-v533-enemy-bot-killed", "false");
          }
          applyState(result, { authoritative: true });
        }
      });
    }
  }
  if (previousPhase !== data.phase) {
    if (data.phase === "selecting") recordUsageCheckpoint("operator_select");
    else if (data.phase === "playing") {
      if (previousPhase !== "meeting") {
        state.explicitInventoryItemId = "";
        state.selectedWeaponItemId = "";
        state.itemRenderKey = "";
        state.inventoryVisualWeapon = "";
      }
      recordUsageCheckpoint("battle_started");
    }
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
    disappeared: next.self.special === "assassin"
      ? "アサシン忍殺による消滅が成功しました。死体・通報対象は残りません。"
      : "忍殺成功。対象を倒し、通報可能な死体が残りました。",
    blocked: "忍殺は防御されました。",
    body: "胴体に命中しました。もう一度攻撃すればキルできます。",
    miss: "攻撃は外れました。",
    moved: "自分か対象が動いたため、忍殺に失敗しました。",
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
    state.headMarkerSlots.clear();
    state.headMarkerPresentationCache.clear();
    state.headMarkerPresentationFrame = -1;
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
    const localEffect = {
      ...effect,
      startedAt,
      duration
    };
    const nonCreditSemantic = nonCreditHeadMarkerSemanticKey(localEffect);
    if (nonCreditSemantic) {
      const existing = state.magicEffects.find((entry) => (
        entry.playerId === localEffect.playerId &&
        nonCreditHeadMarkerSemanticKey(entry) === nonCreditSemantic &&
        (Number(entry._headMarkerExpiresAt) || (Number(entry.startedAt) + Number(entry.duration))) > receivedAt
      ));
      if (existing) {
        const extensionUntil = Math.max(
          Number(existing._headMarkerExpiresAt) || (Number(existing.startedAt) + Number(existing.duration)),
          receivedAt + duration
        );
        existing._headMarkerInstanceKey = existing._headMarkerInstanceKey || existing.id;
        existing._headMarkerExpiresAt = extensionUntil;
        existing._headMarkerAggregateCount = Math.max(1, Number(existing._headMarkerAggregateCount) || Number(existing.markerCount) || 1) +
          Math.max(1, Number(localEffect.markerCount) || 1);
        existing._headMarkerLastAt = receivedAt;
        existing.duration = Math.max(1, extensionUntil - Number(existing.startedAt));
        existing.variant = localEffect.variant;
        state.headMarkerPresentationFrame = -1;
        state.headMarkerPresentationCache.clear();
        continue;
      }
      localEffect._headMarkerInstanceKey = localEffect.id;
      localEffect._headMarkerAggregateCount = Math.max(1, Number(localEffect.markerCount) || 1);
      localEffect._headMarkerLastAt = receivedAt;
      localEffect._headMarkerExpiresAt = receivedAt + duration;
      localEffect.duration = localEffect._headMarkerExpiresAt - receivedAt;
    }
    state.magicEffects.push(localEffect);
    state.headMarkerPresentationFrame = -1;
    state.headMarkerPresentationCache.clear();
    if (effect.type.startsWith("object-") && effect.playerId === next.selfId) {
      const objectType = effect.type.slice("object-".length);
      const object = (next.map?.objects || []).find((entry) => (
        entry.type === objectType && Math.hypot(entry.x - effect.x, entry.y - effect.y) < 4
      ));
      if (object) showToast(`${object.label}: ${object.effectLabel}`);
    }
    const actionKind = magicCharacterActionKind(effect.type, effect.variant);
    if (actionKind && effect.playerId) {
      if (effect.type === "action-shoot" && Number.isFinite(effect.targetX) && Number.isFinite(effect.targetY)) {
        state.facing.set(
          effect.playerId,
          facingFromDirection(
            effect.targetX - effect.x,
            effect.targetY - effect.y,
            state.facing.get(effect.playerId) || "down"
          )
        );
      }
      triggerCharacterAction(
        effect.playerId,
        actionKind,
        CHARACTER_ACTION_DURATION[actionKind] || duration,
        startedAt,
        effect.id,
        effect.variant,
        effect.type
      );
    }
  }
}

function magicEffectDuration(type) {
  if (type === "action-heart-teleport") return 1800;
  if (type === "idea-ascension") return 5200;
  if (type === "mystery-reveal") return 2200;
  if (type === "fire") return 1500;
  if (type === "emp-resonance" || type === "emp-cancel") return 1600;
  if (type === "emp-storage-lock") return 7000;
  if (type === "alchemy-railgun") return 900;
  if (type === "alchemy-particle-cannon") return 900;
  if (type === "alchemy-particle-beam") return 420;
  if (type === "action-special-ammo-load") return 1450;
  if (type === "action-special-ammo-shot") return 620;
  if (type === "action-special-ammo-impact") return 1050;
  if (type === "quantum-transmutation") return 3600;
  if (type === "instant-iai-acquired") return 820;
  if (type === "instant-stand-firm-acquired") return 1050;
  if (type === "instant-push-acquired") return 900;
  if (type.startsWith("instant-") && type.endsWith("-acquired")) return 980;
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
      const ideaWinnerIds = Array.isArray(next.ideaWinnerIds) && next.ideaWinnerIds.length
        ? next.ideaWinnerIds
        : [next.ideaWinnerId].filter(Boolean);
      const wonIdea = next.winner === "idea" && ideaWinnerIds.includes(next.selfId);
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
    if (["walk", "dash"].includes(sound.type) && sound.ownerId === next.selfId) continue;
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
      emp: "emp",
      dash: "worldDash",
      walk: "worldStep",
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
        sound.variant,
        `sound:${sound.type}`
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
  }
}

function worldSoundListener(data) {
  const camera = currentCamera(data);
  if (camera) return camera;
  const self = data.players.find((player) => player.id === data.selfId);
  return self ? renderedPlayer(self) : null;
}

function discardConcealedPlayerRenderState(playerId) {
  if (!playerId) return;
  state.motion.delete(playerId);
  state.facing.delete(playerId);
  state.walkAnimations.delete(playerId);
  state.physicalMotionPhases.forEach((_value, key) => {
    if (String(key).startsWith(`${playerId}:`)) state.physicalMotionPhases.delete(key);
  });
  state.characterActions.delete(playerId);
  state.renderPlayers.delete(playerId);
}

function updateMotion(nextData) {
  const timestamp = performance.now();
  const previous = new Map((state.data?.players || []).map((player) => [player.id, player]));
  const seen = new Set();
  for (const player of nextData.players || []) {
    seen.add(player.id);
    if (player.invisible && player.id !== nextData.selfId) {
      discardConcealedPlayerRenderState(player.id);
      continue;
    }
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

function relocationRevisionFor(player) {
  return Math.max(0, Number(player?.relocationRevision) || 0);
}

function snapRenderedRelocation(current, player, nextData, timestamp) {
  current.x = player.x;
  current.y = player.y;
  current.targetX = player.x;
  current.targetY = player.y;
  current.velocityX = 0;
  current.velocityY = 0;
  current.predictionLeadMultiplier = Math.max(0.01, Number(player.speedMultiplier) || 1);
  current.predictionLeadUntil = 0;
  current.jumpHeight = 0;
  current.jumpMotionStartedAt = 0;
  current.jumpMotionCompletedAt = 0;
  current.updatedAt = timestamp;
  // A camera following the local body must never ease from the old world
  // position after a confirmed teleport. The next frame re-anchors it from
  // the newly snapped rendered position.
  if (player.id === nextData.selfId) state.camera.initialized = false;
  state.motion.set(player.id, { dx: 0, dy: 1, moving: false, changedAt: timestamp });
}

function syncRenderPlayers(nextData) {
  const timestamp = performance.now();
  const seen = new Set();
  for (const player of nextData.players || []) {
    seen.add(player.id);
    if (player.invisible && player.id !== nextData.selfId) {
      discardConcealedPlayerRenderState(player.id);
      continue;
    }
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
        relocationRevision: relocationRevisionFor(player),
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
    const relocationRevision = relocationRevisionFor(player);
    const relocated = relocationRevision !== relocationRevisionFor(current);
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

    // A relocation revision is issued only by the successful authoritative
    // teleport primitive. It intentionally bypasses local prediction/stale
    // movement suppression: distance alone cannot distinguish a legitimate
    // short teleport from a delayed ordinary movement snapshot.
    if (relocated) snapRenderedRelocation(current, player, nextData, timestamp);

    if (!relocated && jumpActive && current.jumpMotionStartedAt !== Number(player.jumpMotion.startedAt)) {
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
    if (shouldSnap && !relocated) {
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
    current.relocationRevision = relocationRevision;
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
    const isSelf = playerId === data.selfId;
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

function activeKillCameraRecord(data = state.data) {
  const record = data?.self?.killCamera;
  if (!record?.id || data.self.alive || data.self.ejected || data.phase === "meeting") return null;
  if (state.dismissedKillCameraId === record.id) return null;
  return record;
}

function renderKillCamera(data) {
  const record = activeKillCameraRecord(data);
  els.killCameraOverlay.hidden = !record;
  if (!record) return;
  els.killCameraTitle.textContent = `${record.victimName || "あなた"} の死亡記録`;
  els.killCameraKiller.textContent = record.killerName || "環境・ルール";
  els.killCameraAction.textContent = record.actionLabel || "死因記録エラー（未定義）";
  const showBotDecision = Boolean(record.killerIsBot);
  els.killCameraLogicRow.hidden = !showBotDecision;
  els.killCameraLogic.textContent = showBotDecision
    ? record.botDecisionLogic || "判断記録なし: 内部情報から理由を補完しません。"
    : "";
}

function render() {
  const pollScrollPositions = capturePollScrollPositions();
  const data = state.data;
  const tacticsScrollActive = state.screen === "tactics" &&
    (isTacticsScrollRegion(state.activeScrollRegion) || isTacticsScrollRegion(state.expandedScrollRegion));
  if (!tacticsScrollActive && data?.phase !== "playing" && (state.activeScrollRegion || state.expandedScrollRegion)) {
    setSelectedScrollRegion(null, { focus: false });
  }
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
  const resetSidebarForPhaseContext = state.phaseUiKey !== phaseUiKey && (
    data?.phase === "selecting" ||
    (data?.phase === "playing" && String(state.phaseUiKey || "").endsWith(":selecting"))
  );
  if (state.phaseUiKey !== phaseUiKey) {
    closeSwitchDragMenu();
    state.phaseUiKey = phaseUiKey;
    els.joinPanel.hidden = Boolean(data);
    els.selectPanel.hidden = !data || data.phase !== "selecting";
    els.statusPanel.hidden = !data || data.phase === "selecting";
    els.meetingPanel.hidden = !data || data.phase !== "meeting";
    if (data?.phase !== "selecting" && !els.operatorDetail.hidden) {
      hideOperatorDetail();
      scheduleGameplayViewportReflow(true);
    }
    if (data?.phase === "playing" && tabletModePreferenceEnabled()) {
      requestAnimationFrame(() => setTabletOpen(true, { persist: false, focus: false }));
    }
  }
  state.fieldFeedOpen = Boolean(data && data.phase === "meeting");
  els.fieldFeedPanel.hidden = !state.fieldFeedOpen;
  els.leaveRoomButton.hidden = state.screen === "title";
  els.operatorReselectButton.hidden = !(
    state.screen === "game" &&
    state.offlineMode &&
    data?.phase === "playing" &&
    !data?.soloMission
  );
  els.tabletButton.hidden = false;
  els.tabletButton.disabled = !data || data.phase !== "playing";
  els.gameMuteButton.hidden = false;
  if (els.tabletButton.disabled && state.tabletOpen) {
    setTabletOpen(false, { persist: false, focus: false });
  }
  els.fieldLowerRow.hidden = !data || ![
    "playing",
    "meeting"
  ].includes(data.phase) && !(data.phase === "selecting" && !els.operatorDetail.hidden);

  if (!data) {
    els.endOverlay.hidden = true;
    els.killCameraOverlay.hidden = true;
    if (state.expandedMapOpen) setExpandedMapOpen(false);
    syncKeyboardContext();
    restorePollScrollPositions(pollScrollPositions);
    return;
  }

  renderKillCamera(data);
  renderEnd(data);
  renderOperatorSelect(data);
  renderStatus(data);
  renderMeeting(data);
  renderFeeds(data);
  syncKeyboardContext();
  if (resetSidebarForPhaseContext) resetScrollSurfaceForSemanticContext(els.sidePanel);
  restorePollScrollPositions(resetSidebarForPhaseContext
    ? pollScrollPositions.filter((entry) => entry.surface !== els.sidePanel)
    : pollScrollPositions);
}

function formatBattleTime(data) {
  const elapsedSeconds = Math.max(0, Math.floor((estimatedServerNow(data) - (data.battleStartedAt || estimatedServerNow(data))) / 1000));
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function renderOperatorSelect(data) {
  if (data.phase !== "selecting") return;
  const self = data.self;
  const role = playerFacingRoleLabel(self.role);
  els.offlineTeamChoice.hidden = !state.offlineMode;
  syncOfflineTeamChoiceVisual(state.offlineMode ? self.role : "");
  const isTurn = state.offlineMode
    ? !self.operatorReady
    : data.operatorTurnPlayerId === self.id;
  const turnLabel = `${data.operatorTurnPosition || 0} / ${data.operatorTurnTotal || 0}`;
  els.selectTimer.textContent = `${turnLabel} ・ ${data.operatorSelectSecondsLeft || 0}秒`;
  if (self.operatorReady) {
    els.selectTeamText.textContent = `${role} を選択済みです。${data.operatorTurnName || "次のプレイヤー"}の選択を待っています。`;
  } else if (isTurn) {
    els.selectTeamText.textContent = `あなたの選択順です。${role}として使用するオペレーターを選択してください。`;
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
  hideOperatorDetail();
  els.operatorList.innerHTML = "";
  els.operatorDetail.hidden = true;

  operators.forEach((operator, operatorIndex) => {
    const selected = self.operatorId === operator.id;
    const available = selected || operator.taken < operator.limit;
    const selectable = Boolean(isTurn && !self.operatorReady && available);
    const button = document.createElement("button");
    button.className = `operator-card${selected ? " selected" : ""}${operator.asset ? " has-visual" : ""}`;
    button.type = "button";
    button.dataset.operatorId = operator.id;
    button.dataset.selectable = selectable ? "1" : "0";
    if (operatorIndex < 9) button.dataset.hotkey = String(operatorIndex + 1);
    button.setAttribute("aria-disabled", String(!selectable));
    button.setAttribute("aria-label", `${operator.name}。長押しで説明`);
    button.innerHTML = `
      ${operator.asset ? `<span class="operator-visual operator-visual-${escapeHtml(operator.asset)}" aria-hidden="true"></span>` : ""}
      <span class="operator-meta">
        <span class="name-line">${escapeHtml(operator.name)}</span>
      </span>
      <span class="badge">${operator.taken} / ${operator.limit >= 99 ? "∞" : operator.limit}</span>
    `;
    bindOperatorDetailHold(button, operator);
    button.addEventListener("click", () => {
      if (selectable) void selectOperatorFromCard(operator);
    });
    els.operatorList.appendChild(button);
  });
}

function syncOperatorDetailFieldLayout() {
  if (state.data?.phase !== "selecting") return;
  const fieldSlot = els.fieldLowerRow?.parentElement;
  if (!fieldSlot) return;
  const detailHeight = els.operatorDetail?.hidden
    ? 0
    : Math.ceil(els.fieldLowerRow.getBoundingClientRect().height);
  const nextValue = `${detailHeight}px`;
  if (fieldSlot.style.getPropertyValue("--field-lower-height") !== nextValue) {
    fieldSlot.style.setProperty("--field-lower-height", nextValue);
  }
}

function hideOperatorDetail() {
  if (state.operatorDetailTimer) window.clearTimeout(state.operatorDetailTimer);
  state.operatorDetailTimer = 0;
  state.operatorDetailSource?.removeAttribute("aria-describedby");
  state.operatorDetailSource = null;
  els.operatorList?.querySelectorAll(".operator-card.detail-active").forEach((card) => card.classList.remove("detail-active"));
  els.operatorDetail.hidden = true;
  if (state.data?.phase === "selecting") {
    els.fieldLowerRow.hidden = true;
    syncOperatorDetailFieldLayout();
    scheduleGameplayViewportReflow();
  }
}

function showOperatorDetail(operator, sourceButton) {
  if (!operator || !sourceButton) return;
  hideOperatorDetail();
  state.operatorDetailSource = sourceButton;
  sourceButton.setAttribute("aria-describedby", "operatorDetail");
  sourceButton.classList.add("detail-active");
  els.operatorDetail.innerHTML = `
    <span class="operator-detail-kicker">OPERATOR DETAIL</span>
    <div class="operator-detail-head"><strong>${escapeHtml(operator.name)}</strong></div>
    <p>${escapeHtml(operator.details || operator.description)}</p>
  `;
  els.operatorDetail.hidden = false;
  els.fieldLowerRow.hidden = false;
  requestAnimationFrame(() => {
    syncOperatorDetailFieldLayout();
    scheduleGameplayViewportReflow(true);
  });
  scheduleGameplayViewportReflow(true);
  state.operatorDetailTimer = window.setTimeout(hideOperatorDetail, 12_000);
}

function bindOperatorDetailHold(button, operator) {
  const clickGate = createInventoryClickGate();
  let pointerId = null;
  let pointerType = "";
  const clearSelection = () => window.getSelection?.()?.removeAllRanges?.();
  const gesture = createInventoryTouchGesture({
    onHold: () => {
      clickGate.arm();
      clearSelection();
      try { button.setPointerCapture(pointerId); } catch {}
      showOperatorDetail(operator, button);
      if (navigator.vibrate) navigator.vibrate(18);
    },
    onClearSelection: clearSelection
  });
  const suppressNative = (event) => {
    if (event.cancelable) event.preventDefault();
    event.stopPropagation();
    clearSelection();
  };
  for (const type of ["contextmenu", "selectstart", "dragstart", "copy"]) button.addEventListener(type, suppressNative);
  button.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    hideOperatorDetail();
    pointerId = event.pointerId;
    pointerType = event.pointerType || "mouse";
    clickGate.reset();
    gesture.start(pointerId, event.clientX, event.clientY);
  });
  button.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) return;
    gesture.move(pointerId, event.clientX, event.clientY);
  });
  button.addEventListener("pointerup", (event) => {
    if (pointerId !== event.pointerId) return;
    const result = gesture.end(pointerId);
    if (result !== "tap") {
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();
      clickGate.arm();
    }
    pointerId = null;
    pointerType = "";
  });
  const cancel = (event) => {
    if (pointerId !== event.pointerId) return;
    gesture.cancel(pointerId);
    pointerId = null;
    pointerType = "";
    clickGate.reset();
  };
  button.addEventListener("pointercancel", cancel);
  button.addEventListener("lostpointercapture", cancel);
  button.addEventListener("click", (event) => {
    if (!clickGate.consume()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
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

function rootAbilityModeSelectActive(self = state.data?.self) {
  return Boolean(
    self?.special === "alchemist" &&
    self.hackerRootActive &&
    availableBorrowedActiveOperatorTypes(self).length > 0
  );
}

function normalizeQuantumClientMode(rawMode) {
  const mode = String(rawMode || "nuclear-transmutation");
  return {
    "transmute-mercury": "nuclear-transmutation",
    "transmute-lead": "nuclear-transmutation",
    "cool-water": "kinetic-decelerate",
    "heat-water": "kinetic-accelerate",
    "fission-uranium": "nuclear-fission",
    "fission-plutonium": "nuclear-fission",
    "fusion-seawater": "nuclear-fusion"
  }[mode] || mode;
}

function quantumModeLabel(rawMode) {
  return {
    "kinetic-accelerate": "運動エネルギー制御 / 加速",
    "kinetic-decelerate": "運動エネルギー制御 / 減速",
    "electric-discharge": "エレクトリック",
    "nuclear-transmutation": "核変換",
    "nuclear-fission": "核分裂",
    "nuclear-fusion": "核融合"
  }[normalizeQuantumClientMode(rawMode)] || "クオンタム";
}

function quantumTopMode(rawMode) {
  return normalizeQuantumClientMode(rawMode).startsWith("kinetic-") ? "quantum-kinetic" : normalizeQuantumClientMode(rawMode);
}

function selectedQuantumExecutableMode(borrowed = false) {
  return normalizeQuantumClientMode(borrowed
    ? state.borrowedAbilityModes.quantum
    : state.quantumAbilityMode || state.data?.self?.quantumMode);
}

function hasCompatibleQuantumItem(self, rawMode) {
  const mode = normalizeQuantumClientMode(rawMode);
  if (mode === "electric-discharge") return true;
  const ids = mode === "nuclear-transmutation"
    ? ["lead", "mercury"]
    : mode === "nuclear-fission"
      ? ["uranium", "plutonium"]
      : mode === "nuclear-fusion"
        ? ["seawater"]
      : ["mineral-water", "seawater"];
  return ids.some((id) => (self?.itemInventory || []).some((item) => item.id === id && Number(item.amount) > 0));
}

function rememberQuantumExecutableMode(rawMode, borrowed = false) {
  const mode = normalizeQuantumClientMode(rawMode);
  if (!["kinetic-accelerate", "kinetic-decelerate", "nuclear-transmutation", "nuclear-fission", "nuclear-fusion", "electric-discharge"].includes(mode)) return false;
  if (mode.startsWith("kinetic-")) state.quantumKineticModes[borrowed ? "borrowed" : "native"] = mode;
  if (borrowed) state.borrowedAbilityModes.quantum = mode;
  else state.quantumAbilityMode = mode;
  return true;
}

function renderSwitchDragNestedBranch(parentChoice) {
  const gesture = state.switchDrag;
  if (!gesture.hierarchical || !Array.isArray(parentChoice?.branches) || !parentChoice.branches.length) return false;
  gesture.hierarchicalStage = "nested";
  gesture.branchOptions = parentChoice.branches;
  clearSwitchDragHover();
  els.switchDragTitle.textContent = `${parentChoice.label}の分岐`;
  els.switchDragOptions.replaceChildren();
  els.switchDragOptions.setAttribute("aria-label", `${parentChoice.label}の分岐`);
  gesture.branchOptions.forEach((choice, index) => {
    const button = document.createElement("button");
    const hasBranches = Array.isArray(choice.branches) && choice.branches.length > 0;
    button.type = "button";
    button.dataset.switchDragAbilityIndex = String(index);
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(Boolean(choice.selected)));
    button.setAttribute("aria-label", `${choice.group}: ${choice.label}`);
    if (hasBranches) button.setAttribute("aria-haspopup", "listbox");
    button.className = `switch-drag-option switch-drag-ability${hasBranches ? " switch-drag-operator" : ""}${choice.selected ? " selected" : ""}`;
    button.innerHTML = `<small>${escapeHtml(choice.group)}</small><strong>${escapeHtml(choice.label)}</strong>`;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      if (!state.switchDrag.opened || !state.switchDrag.persistent) return;
      event.stopPropagation();
      const selected = state.switchDrag.branchOptions[index];
      if (Array.isArray(selected?.branches) && selected.branches.length) {
        renderSwitchDragNestedBranch(selected);
        return;
      }
      closeSwitchDragMenu();
      if (!selected) return;
      selected.apply();
      showToast(`${selected.group}: ${selected.label}`);
      playSound("select");
    });
    els.switchDragOptions.append(button);
  });
  positionSwitchDragMenu();
  return true;
}

function selectedQuantumKineticMode(borrowed = false) {
  const current = selectedQuantumExecutableMode(borrowed);
  if (current.startsWith("kinetic-")) return current;
  return normalizeQuantumClientMode(state.quantumKineticModes[borrowed ? "borrowed" : "native"] || "kinetic-accelerate");
}

// The terminal picker is a transient child of the currently selected kinetic
// branch.  A remembered stage alone is not authoritative: polls, ROOT exit,
// and a later nuclear selection must never resurrect it or change a mode back
// to kinetic.
function nativeQuantumKineticTerminalActive(self = state.data?.self) {
  return Boolean(
    self?.special === "quantum" &&
    !rootAbilityModeSelectActive(self) &&
    state.quantumSelectStage === "kinetic" &&
    els.teleportModeSelect?.dataset.specialKey?.startsWith("quantum:") &&
    els.teleportModeSelect.value === "quantum-kinetic"
  );
}

function rootQuantumKineticTerminalActive(self = state.data?.self) {
  return Boolean(
    rootAbilityModeSelectActive(self) &&
    selectedBorrowedOperator() === "quantum" &&
    state.rootAbilitySelectStage === "quantum-kinetic" &&
    !els.rootAbilityBranchControl.hidden &&
    els.rootAbilityBranchSelect.value === "quantum-kinetic"
  );
}

function tabletQuantumKineticTerminalActive(self = state.data?.self) {
  return Boolean(
    self?.special === "quantum" &&
    state.tabletBranchGroup === "operator" &&
    state.tabletBranchPath === "quantum-kinetic"
  );
}

function syncAbilityCascadeSelectVisibility() {
  const rootVisible = Boolean(els.rootAbilityBranchControl && !els.rootAbilityBranchControl.hidden);
  const kineticVisible = Boolean(els.quantumKineticBranchControl && !els.quantumKineticBranchControl.hidden);
  if (els.abilityCascadeSelects) els.abilityCascadeSelects.hidden = !rootVisible && !kineticVisible;
}

function clearAbilityCascadeSelects({ root = true, kinetic = true } = {}) {
  if (root && els.rootAbilityBranchControl) {
    els.rootAbilityBranchControl.hidden = true;
    els.rootAbilityBranchSelect.innerHTML = "";
    delete els.rootAbilityBranchSelect.dataset.specialKey;
  }
  if (kinetic && els.quantumKineticBranchControl) {
    els.quantumKineticBranchControl.hidden = true;
    els.quantumKineticBranchSelect.innerHTML = "";
    delete els.quantumKineticBranchSelect.dataset.specialKey;
  }
  syncAbilityCascadeSelectVisibility();
}

function resetRootBorrowedAbilitySelection() {
  state.borrowedOperatorType = "";
  state.borrowedAbilityModes = {
    fighter: "limit-break",
    gravity: "accelerate",
    flora: "heal",
    quantum: "nuclear-transmutation"
  };
  state.quantumKineticModes.borrowed = "kinetic-accelerate";
  state.rootAbilitySelectStage = "operator";
  state.rootAbilitySelectWasActive = false;
  if (els.teleportModeSelect) {
    els.teleportModeSelect.innerHTML = "";
    delete els.teleportModeSelect.dataset.specialKey;
  }
  clearAbilityCascadeSelects();
}

function populateQuantumKineticModeSelect({ root = false } = {}) {
  if (root) state.rootAbilitySelectStage = "quantum-kinetic";
  else state.quantumSelectStage = "kinetic";
  els.quantumKineticBranchControl.hidden = false;
  els.quantumKineticBranchSelect.dataset.specialKey = `${root ? "root-" : ""}quantum-kinetic`;
  els.quantumKineticBranchSelect.innerHTML = QUANTUM_KINETIC_MODE_OPTIONS
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join("");
  // The native picker contains only the two executable choices. Accelerate is
  // the canonical first/default choice; preserve an already committed choice
  // when this branch is reopened instead of returning to a blank bar.
  els.quantumKineticBranchSelect.value = selectedQuantumKineticMode(root);
  els.quantumKineticBranchSelect.setAttribute("aria-label", `${root ? "ROOT借用" : ""}クオンタム・運動エネルギー制御・加速または減速`);
  syncAbilityCascadeSelectVisibility();
  els.teleportModeDescription.textContent = "運動エネルギー制御を加速か減速へ分岐します。対象となる水を所持していなければ何も起きません。";
  return true;
}

function populateNativeQuantumModeSelect({ preserveCascade = false } = {}) {
  const selectedMode = selectedQuantumExecutableMode(false);
  state.quantumSelectStage = "ability";
  if (!preserveCascade) clearAbilityCascadeSelects();
  const key = `quantum:${QUANTUM_ABILITY_MODE_OPTIONS.map(([value]) => value).join("|")}`;
  els.teleportModeSelect.dataset.specialKey = key;
  els.teleportModeSelect.innerHTML = QUANTUM_ABILITY_MODE_OPTIONS
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join("");
  els.teleportModeSelect.value = quantumTopMode(selectedMode);
  els.teleportModeSelect.setAttribute("aria-label", "クオンタム能力");
  syncAbilityModeDescription("quantum", state.data?.self, selectedMode);
  return true;
}

function commitNativeQuantumModeSelect(source = els.teleportModeSelect) {
  const self = state.data?.self;
  if (self?.special !== "quantum" || rootAbilityModeSelectActive(self)) return false;
  if (source === els.quantumKineticBranchSelect) {
    const mode = source.value;
    if (!rememberQuantumExecutableMode(mode, false)) return true;
    state.quantumSelectStage = "ability";
    clearAbilityCascadeSelects({ root: false, kinetic: true });
    syncAbilityModeDescription("quantum", self, mode);
    // A terminal branch is the current ability, not only a detail-pane value.
    // Re-render the shortcut in this transaction so it cannot remain at the
    // parent "運動エネルギー制御" label until the next state poll.
    updateActionButtons(state.data);
    showToast(`運動エネルギー制御: ${quantumModeLabel(mode)}`);
    if (state.abilityAutoActivate) triggerOperatorAbility();
    return true;
  }
  if (source !== els.teleportModeSelect) return false;
  const mode = source.value;
  if (mode === "quantum-kinetic") {
    const kineticMode = selectedQuantumKineticMode(false);
    rememberQuantumExecutableMode(kineticMode, false);
    populateQuantumKineticModeSelect();
    syncAbilityModeDescription("quantum", self, kineticMode);
    updateActionButtons(state.data);
    return true;
  }
  clearAbilityCascadeSelects();
  if (rememberQuantumExecutableMode(mode, false)) {
    syncAbilityModeDescription("quantum", self, mode);
    updateActionButtons(state.data);
    if (state.abilityAutoActivate) triggerOperatorAbility();
  }
  return true;
}

function populateRootOperatorModeSelect(self = state.data?.self, { selectedType = "", preserveCascade = false } = {}) {
  const types = availableBorrowedActiveOperatorTypes(self);
  if (!types.length) return false;
  if (!preserveCascade) {
    state.rootAbilitySelectStage = "operator";
    clearAbilityCascadeSelects();
  }
  els.teleportModeSelect.dataset.specialKey = `root-operators:${types.join("|")}`;
  els.teleportModeSelect.innerHTML = [
    '<option value="" disabled>オペ名を選択</option>',
    ...types.map((type) => `<option value="root-operator:${escapeHtml(type)}">${escapeHtml(HACKER_ROOT_OPERATOR_LABELS[type] || type)}</option>`)
  ].join("");
  els.teleportModeSelect.value = types.includes(selectedType) ? `root-operator:${selectedType}` : "";
  els.teleportModeSelect.setAttribute("aria-label", "ROOT借用オペ名");
  els.teleportModeDescription.textContent = "オペを選ぶと能力分岐が表示されます。各段階はブラウザ標準pickerで順に選択します。";
  return true;
}

function populateRootAbilityModeSelect(type, { prompt = false, selectedMode = "" } = {}) {
  const self = state.data?.self;
  if (!availableBorrowedActiveOperatorTypes(self).includes(type)) return false;
  const choices = OPERATOR_ABILITY_MODE_OPTIONS[type] || [];
  if (!choices.length) return false;
  state.borrowedOperatorType = type;
  if (prompt) {
    // Keep the first-stage selector synchronized without resetting the visible
    // second-stage branch. A poll between the two native picker stages used to
    // rebuild this selector and collapse every branch back to Gravity.
    populateRootOperatorModeSelect(self, { selectedType: type, preserveCascade: true });
    state.rootAbilitySelectStage = "ability";
    clearAbilityCascadeSelects({ root: false, kinetic: true });
    els.rootAbilityBranchControl.hidden = false;
    els.rootAbilityBranchSelect.dataset.specialKey = `root-abilities:${type}:${choices.map(([value]) => value).join("|")}`;
    els.rootAbilityBranchSelect.innerHTML = [
      '<option value="" disabled>能力を選択</option>',
      ...choices.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`)
    ].join("");
    const effectiveSelected = choices.some(([value]) => value === selectedMode) ? selectedMode : "";
    els.rootAbilityBranchSelect.value = effectiveSelected;
    els.rootAbilityBranchSelect.setAttribute("aria-label", `ROOT借用能力分岐・${HACKER_ROOT_OPERATOR_LABELS[type] || type}`);
    syncAbilityCascadeSelectVisibility();
    els.teleportModeDescription.textContent = `${HACKER_ROOT_OPERATOR_LABELS[type] || type}の能力を選択してください。`;
    return true;
  }
  return populateRootOperatorModeSelect(self);
}

function prepareRootAbilityModeSelectForOpen() {
  const self = state.data?.self;
  if (!rootAbilityModeSelectActive(self)) return false;
  // Reopening ROOT selection always starts at the complete operator list.
  // Keeping the previous ability stage left the initial Gravity branch visible
  // and made every other borrowed operator appear unavailable.
  return populateRootOperatorModeSelect(self);
}

function commitRootAbilityModeSelect(source = els.teleportModeSelect) {
  const self = state.data?.self;
  if (!rootAbilityModeSelectActive(self)) return false;
  if (source === els.quantumKineticBranchSelect && state.rootAbilitySelectStage === "quantum-kinetic") {
    const mode = source.value;
    if (!rememberQuantumExecutableMode(mode, true)) return true;
    populateRootOperatorModeSelect(self);
    syncAbilityModeDescription("quantum", self, mode);
    showToast(`クオンタム: ${quantumModeLabel(mode)}`);
    updateActionButtons(state.data);
    if (state.abilityAutoActivate) triggerBorrowedAbility("quantum", mode);
    return true;
  }
  // The operator selector remains visible beside the second-stage ability
  // selector. A second operator choice can therefore arrive while the stored
  // stage is still "ability" (the native select may already own focus, so its
  // focus handler is not guaranteed to reset the stage first). Treat the
  // value's explicit root-operator identity as authoritative instead of
  // leaving every later choice on the first operator's branch.
  if (source === els.teleportModeSelect && String(source.value || "").startsWith("root-operator:")) {
    const type = String(source.value || "").replace(/^root-operator:/, "");
    if (!availableBorrowedActiveOperatorTypes(self).includes(type)) return true;
    populateRootAbilityModeSelect(type, { prompt: true });
    showToast(`${HACKER_ROOT_OPERATOR_LABELS[type] || type}の能力を選択`);
    updateActionButtons(state.data);
    return true;
  }
  if (source === els.rootAbilityBranchSelect && state.rootAbilitySelectStage === "ability") {
    const type = selectedBorrowedOperator();
    const mode = source.value;
    const choices = OPERATOR_ABILITY_MODE_OPTIONS[type] || [];
    if (!choices.some(([value]) => value === mode)) return true;
    if (type === "quantum" && mode === "quantum-kinetic") {
      const kineticMode = selectedQuantumKineticMode(true);
      rememberQuantumExecutableMode(kineticMode, true);
      populateQuantumKineticModeSelect({ root: true });
      syncAbilityModeDescription("quantum", self, kineticMode);
      updateActionButtons(state.data);
      return true;
    }
    state.borrowedAbilityModes[type] = mode;
    populateRootOperatorModeSelect(self);
    syncAbilityModeDescription(type, self);
    ensureTeleportTargetForMode(state.data);
    showToast(`${HACKER_ROOT_OPERATOR_LABELS[type] || type}: ${choices.find(([value]) => value === mode)?.[1] || mode}`);
    updateActionButtons(state.data);
    if (state.abilityAutoActivate) triggerBorrowedAbility(type, mode);
    return true;
  }
  return true;
}

function quantumKineticHoldEligible() {
  const self = state.data?.self;
  const borrowed = Boolean(self?.special === "alchemist" && self?.hackerRootActive && selectedBorrowedOperator() === "quantum");
  return Boolean((self?.special === "quantum" || borrowed) && els.teleportModeSelect.value === "quantum-kinetic");
}

function closeQuantumKineticHold() {
  const hold = state.quantumKineticHold;
  if (hold.timer) window.clearTimeout(hold.timer);
  hold.timer = 0;
}

function beginQuantumKineticHold(event, source) {
  if (!quantumKineticHoldEligible() || (event.pointerType === "mouse" && event.button !== 0)) return false;
  const hold = state.quantumKineticHold;
  closeQuantumKineticHold();
  Object.assign(hold, { pointerId: event.pointerId, source, opened: false, cancelled: false, startX: event.clientX, startY: event.clientY, selected: "", borrowed: state.data?.self?.special === "alchemist" });
  hold.timer = window.setTimeout(() => {
    if (hold.pointerId !== event.pointerId || hold.cancelled) return;
    hold.opened = true;
    if (hold.borrowed) {
      populateRootOperatorModeSelect(state.data?.self, { selectedType: "quantum" });
      populateRootAbilityModeSelect("quantum", { prompt: true, selectedMode: "quantum-kinetic" });
      populateQuantumKineticModeSelect({ root: true });
    } else {
      populateNativeQuantumModeSelect({ preserveCascade: true });
      els.teleportModeSelect.value = "quantum-kinetic";
      populateQuantumKineticModeSelect();
    }
    updateActionButtons(state.data);
    state.continuousActionSuppressClicks.set(source, performance.now() + 900);
    // Rendering must happen while the source button is still held. Opening a
    // native picker from this delayed callback either loses transient user
    // activation or defers until pointerup on mobile, which made the two
    // controls appear sequentially. Leave both native selects visibly present
    // and let the player tap the terminal 加速／減速 picker explicitly.
    els.quantumKineticBranchSelect.focus({ preventScroll: true });
  }, 420);
  return true;
}

function updateQuantumKineticHold(event) {
  const hold = state.quantumKineticHold;
  if (hold.pointerId !== event.pointerId) return;
  if (!hold.opened && Math.hypot(event.clientX - hold.startX, event.clientY - hold.startY) > 14) {
    hold.cancelled = true;
    closeQuantumKineticHold();
    return;
  }
}

function finishQuantumKineticHold(event, cancelled = false) {
  const hold = state.quantumKineticHold;
  if (hold.pointerId !== event.pointerId) return false;
  const nativePickerOwnedGesture = hold.opened && !hold.cancelled;
  const source = hold.source;
  closeQuantumKineticHold();
  Object.assign(hold, { pointerId: null, source: null, opened: false, cancelled: false, selected: "", borrowed: false });
  if (!nativePickerOwnedGesture) return false;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (source) state.continuousActionSuppressClicks.set(source, performance.now() + 700);
  return true;
}

function bindQuantumKineticHold(source) {
  source?.addEventListener("pointerdown", (event) => { beginQuantumKineticHold(event, source); }, true);
  source?.addEventListener("pointermove", updateQuantumKineticHold, true);
  source?.addEventListener("pointerup", (event) => { finishQuantumKineticHold(event, false); }, true);
  source?.addEventListener("pointercancel", (event) => { finishQuantumKineticHold(event, true); }, true);
  source?.addEventListener("lostpointercapture", (event) => { finishQuantumKineticHold(event, true); }, true);
  source?.addEventListener("click", (event) => {
    const until = Number(state.continuousActionSuppressClicks.get(source)) || 0;
    if (performance.now() < until) {
      event.preventDefault();
      event.stopImmediatePropagation();
      state.continuousActionSuppressClicks.delete(source);
    }
  }, true);
}

function renderTargetOptions(data) {
  const self = data.self;
  if (self.special === "quantum" && state.quantumModePlayerId !== self.id) {
    state.quantumModePlayerId = self.id;
    state.quantumAbilityMode = normalizeQuantumClientMode(self.quantumMode);
    if (state.quantumAbilityMode.startsWith("kinetic-")) state.quantumKineticModes.native = state.quantumAbilityMode;
    state.quantumSelectStage = "ability";
  }
  const selectedAlchemy = alchemyRecipes.find((recipe) => recipe.id === els.alchemySelect.value);
  const borrowedOperator = selectedBorrowedOperator();
  const modeOwner = borrowedOperator || self.special;
  els.teleportTargetSelect.dataset.ownerKey = modeOwner;
  const options = OPERATOR_ABILITY_MODE_OPTIONS[modeOwner] || [];
  const rootAbilitySwitchVisible = rootAbilityModeSelectActive(self);
  // A stale stage must not recreate a terminal picker after the visible
  // selector has moved to a different ability or ROOT has ended.
  if (!rootAbilitySwitchVisible && state.rootAbilitySelectStage === "quantum-kinetic") {
    state.rootAbilitySelectStage = "operator";
    clearAbilityCascadeSelects();
  }
  if (self.special !== "quantum" && state.quantumSelectStage === "kinetic") {
    state.quantumSelectStage = "ability";
    clearAbilityCascadeSelects({ root: false, kinetic: true });
  }
  if (self.special !== "quantum" && state.tabletBranchPath === "quantum-kinetic") {
    setTabletBranchPath("", { focus: false });
  }
  if (state.quantumSelectStage === "kinetic" && !nativeQuantumKineticTerminalActive(self)) {
    state.quantumSelectStage = "ability";
    clearAbilityCascadeSelects({ root: false, kinetic: true });
  }
  if (state.rootAbilitySelectStage === "quantum-kinetic" && !rootQuantumKineticTerminalActive(self)) {
    state.rootAbilitySelectStage = "operator";
    clearAbilityCascadeSelects();
  }
  if (!rootAbilitySwitchVisible && state.rootAbilitySelectWasActive) {
    resetRootBorrowedAbilitySelection();
  } else if (rootAbilitySwitchVisible && !state.rootAbilitySelectWasActive) {
    state.rootAbilitySelectStage = "operator";
  }
  state.rootAbilitySelectWasActive = rootAbilitySwitchVisible;
  const alchemyTargetVisible = self.special === "alchemist" &&
    (els.alchemySelect.value === "revive" || els.alchemySelect.value.startsWith("hack-"));
  const controlVisible = data.phase === "playing" && (rootAbilitySwitchVisible || options.length > 1 || alchemyTargetVisible) && self.alive && !self.ejected;
  els.teleportControl.hidden = !controlVisible;
  els.teleportModeSelect.closest("label").hidden = !rootAbilitySwitchVisible && !options.length;
  els.abilityAutoActivateControl.hidden = !rootAbilitySwitchVisible && !options.length;
  els.empPhaseControl.hidden = data.phase !== "playing" || !self.alive || self.ejected;
  if (!controlVisible && self.special !== "alchemist") return;

  const modeKey = options.map((option) => option[0]).join("|");
  if (rootAbilitySwitchVisible) {
    if (state.rootAbilitySelectStage === "operator") {
      const operatorKey = `root-operators:${availableBorrowedActiveOperatorTypes(self).join("|")}`;
      if (els.teleportModeSelect.dataset.specialKey !== operatorKey) populateRootOperatorModeSelect(self);
    } else if (state.rootAbilitySelectStage === "quantum-kinetic") {
      const rootType = selectedBorrowedOperator();
      const rootChoices = OPERATOR_ABILITY_MODE_OPTIONS[rootType] || [];
      const operatorKey = `root-operators:${availableBorrowedActiveOperatorTypes(self).join("|")}`;
      const abilityKey = `root-abilities:${rootType}:${rootChoices.map(([value]) => value).join("|")}`;
      if (els.teleportModeSelect.dataset.specialKey !== operatorKey) {
        populateRootOperatorModeSelect(self, { selectedType: rootType, preserveCascade: true });
      }
      if (els.rootAbilityBranchSelect.dataset.specialKey !== abilityKey) {
        populateRootAbilityModeSelect(rootType, { prompt: true, selectedMode: "quantum-kinetic" });
      }
      if (els.quantumKineticBranchSelect.dataset.specialKey !== "root-quantum-kinetic") populateQuantumKineticModeSelect({ root: true });
    } else if (state.rootAbilitySelectStage === "ability") {
      const rootType = selectedBorrowedOperator();
      const rootChoices = OPERATOR_ABILITY_MODE_OPTIONS[rootType] || [];
      const operatorKey = `root-operators:${availableBorrowedActiveOperatorTypes(self).join("|")}`;
      const abilityKey = `root-abilities:${rootType}:${rootChoices.map(([value]) => value).join("|")}`;
      if (els.teleportModeSelect.dataset.specialKey !== operatorKey) {
        populateRootOperatorModeSelect(self, { selectedType: rootType, preserveCascade: true });
      }
      if (els.rootAbilityBranchSelect.dataset.specialKey !== abilityKey) populateRootAbilityModeSelect(rootType, { prompt: true });
    } else {
      populateRootOperatorModeSelect(self);
    }
  } else if (modeOwner === "quantum" && nativeQuantumKineticTerminalActive(self)) {
    const quantumKey = `quantum:${QUANTUM_ABILITY_MODE_OPTIONS.map(([value]) => value).join("|")}`;
    if (els.teleportModeSelect.dataset.specialKey !== quantumKey) {
      populateNativeQuantumModeSelect({ preserveCascade: true });
      els.teleportModeSelect.value = "quantum-kinetic";
    }
    if (els.quantumKineticBranchSelect.dataset.specialKey !== "quantum-kinetic") populateQuantumKineticModeSelect();
  } else if (options.length && els.teleportModeSelect.dataset.specialKey !== `${modeOwner}:${modeKey}`) {
    clearAbilityCascadeSelects();
    const previousMode = els.teleportModeSelect.value;
    els.teleportModeSelect.dataset.specialKey = `${modeOwner}:${modeKey}`;
    els.teleportModeSelect.innerHTML = options.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
    const rememberedMode = borrowedOperator ? state.borrowedAbilityModes[borrowedOperator] : "";
    const defaultMode = modeOwner === "teleport" || modeOwner === "gravity" ? "accelerate" : options[0]?.[0];
    const gravityDefault = ["teleport", "gravity"].includes(modeOwner);
    const effectiveRememberedMode = modeOwner === "quantum"
      ? quantumTopMode(borrowedOperator ? state.borrowedAbilityModes.quantum : state.quantumAbilityMode)
      : rememberedMode;
    els.teleportModeSelect.value = options.some(([value]) => value === effectiveRememberedMode)
      ? effectiveRememberedMode
      : gravityDefault && options.some(([value]) => value === defaultMode)
        ? defaultMode
        : options.some(([value]) => value === previousMode)
          ? previousMode
          : defaultMode;
    rememberSelectedOperatorMode();
  }

  if ((!rootAbilitySwitchVisible || state.rootAbilitySelectStage === "operator") && !nativeQuantumKineticTerminalActive(self)) {
    const explicitMode = modeOwner === "quantum"
      ? selectedQuantumExecutableMode(Boolean(borrowedOperator))
      : "";
    syncAbilityModeDescription(modeOwner, self, explicitMode);
  }

  const currentAbilityMode = rootAbilitySwitchVisible && borrowedOperator
    ? state.borrowedAbilityModes[borrowedOperator] || ""
    : els.teleportModeSelect.value;
  const floraTargeting = modeOwner === "flora" &&
    currentAbilityMode === "sunbeam";
  const gravityTargeting = ["teleport", "gravity"].includes(modeOwner) && currentAbilityMode !== "time-keeper";
  els.teleportTargetSelect.closest("label").hidden = !alchemyTargetVisible && !gravityTargeting && !floraTargeting;
  els.teleportTargetSelect.setAttribute("aria-label", floraTargeting ? "サンビーム対象" : "能力対象");

  const includeDead = self.special === "alchemist" && els.alchemySelect.value === "revive";
  const hackerTargeting = self.special === "alchemist" && els.alchemySelect.value.startsWith("hack-");
  const targets = data.players.filter((player) => includeDead
    ? !player.alive && !player.ejected
    : player.alive && !player.ejected && !player.inVent && !player.invisible && (!(hackerTargeting || floraTargeting) || player.id !== self.id));
  const previous = els.teleportTargetSelect.value || self.id;
  const key = `${includeDead ? "dead" : floraTargeting ? "flora" : hackerTargeting ? "hacker" : "living"}:` +
    targets.map((player) => `${player.id}:${player.name}`).join("|");
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

function abilityModeDescription(owner, mode, self) {
  const costs = self?.abilityCosts || {};
  const free = self?.hackerManaFree || self?.rationalFreeAbilityReady;
  const cost = (key, fallback = 1) => free ? "今回0MP" : `${Number(costs[key] ?? fallback)}MP`;
  const descriptions = {
    fighter: {
      "limit-break": "HPを1消費してSPと加速を3倍ずつ累積する。HPを使い切ると死亡する。"
    },
    teleport: {
      near: `対象の近くへ全身転移する。${cost("teleport")}。`,
      target: `マップで指定した地点へ選択対象を転移する。味方への誤射は発動者が即死する。${cost("teleport")}。`,
      heart: `拳を握って対象の心臓へ干渉し、遠隔確殺を試みる。位置は公開しない。${cost("heartTeleport", 10)}。`,
      accelerate: `対象を8秒間×2.5加速する。移動、行動不能時間、クールタイム、タスク進行、物理モーションへ同倍率を適用。${cost("teleport")}。`,
      decelerate: `対象を8秒間×0.38へ減速する。移動、行動不能時間、クールタイム、タスク進行、物理モーションへ同倍率を適用。味方への誤射は発動者が即死する。${cost("teleport")}。`,
      "time-keeper": `5秒間、術者以外の全プレイヤー・入力・クールタイム・物体運動を完全停止する。${cost("timeKeeper", 1000)}。`,
      storm: `指定地点へ全域の敵を12秒間吸引し、幸運に応じた継続ダメージ・減速・拘束を与える。発動者には最後の1秒を除いてバリアが発生する。${cost("gravityStorm", 10)}。`
    },
    gravity: null,
    flora: {
      heal: `自分のHP・SP・状態異常を即時回復し、12秒間加速する。${cost("flora")}。`,
      sunbeam: `試合経過時間による発動制限なし。選択対象方向へ通常発動し、交差した全対象を貫通して確殺する。${cost("floraSunbeam", 10)}。壁は貫通しない。`,
      invisible: `10秒間透明になり、敵Botの直接視認・追跡対象から外れる。自分には半透明で表示する。${cost("floraInvisible", 10)}。`
    },
    quantum: {
      "quantum-kinetic": "選択後、加速か減速へ分岐する。ミネラルウォーターまたは海水を所持していなければ何も起きない。",
      "kinetic-accelerate": "所持しているミネラルウォーターまたは海水の運動エネルギーを加速し、高温水へ変える。対象がなければ何も起きない。",
      "kinetic-decelerate": "所持しているミネラルウォーターまたは海水の運動エネルギーを減速し、氷へ変える。対象がなければ何も起きない。",
      "electric-discharge": `量子制御で空気を局所絶縁破壊し、650以内・見通し上の最近接敵へ一条の電子輸送路を形成する。0.35ダメージと3秒間35%減速。壁・遮蔽物で終端し、連鎖・範囲・貫通はしない。16SP / ${cost("quantumElectric")}。`,
      "nuclear-transmutation": "所持している鉛か水銀を自動選択して金へ核変換し、100Cへ即時換金する。どちらもなければ何も起きない。",
      "nuclear-fission": `終盤解禁後、所持しているウランかプルトニウムを自動選択し、核分裂連鎖で全人間へ影響する。どちらもなければ何も起きない。${cost("quantumNuclear")}。`,
      "nuclear-fusion": `終盤解禁後、重水素を含む所持海水を自動選択し、核融合連鎖で核分裂同様に全人間へ影響する。海水がなければ何も起きない。${cost("quantumNuclear")}。`
    }
  };
  const ownerDescriptions = owner === "gravity" ? descriptions.teleport : descriptions[owner];
  return ownerDescriptions?.[mode] || "選択した能力の発動条件と効果をここに表示します。";
}

function syncAbilityModeDescription(owner, self, explicitMode = "") {
  if (!els.teleportModeDescription) return;
  const autoState = state.abilityAutoActivate ? "ON（選択時に即実行）" : "OFF（選択だけ確定）";
  els.teleportModeDescription.textContent = `${abilityModeDescription(owner, explicitMode || els.teleportModeSelect.value, self)} 選択時実行: ${autoState}`;
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
  const role = playerFacingRoleLabel(self.role);
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

function collectInventoryDisplayItems(self, liveNow = estimatedServerNow(state.data)) {
  const chargeDescriptions = {
    "fire-jutsu": VENDING_PRODUCT_DESCRIPTIONS.fire
  };
  const regularItems = (Array.isArray(self.itemInventory) ? self.itemInventory : []).filter((item) =>
    item && (!item.kind || ["item", "charge", "instant"].includes(item.kind)) && typeof item.id === "string" && item.id.length > 0 && Number(item.amount) > 0
  ).map((item) => {
    const inventoryKind = item.kind === "instant" ? "instant" : item.kind === "charge" ? "charge" : "item";
    if (item.id === "hsg") {
      const activeMs = Math.max(0, Number(self.hsgUntil) - liveNow);
      const cooldownMs = Math.max(0, Number(self.hsgReadyAt) - liveNow);
      const gboActive = Number(self.timedAccelerationStacks?.hsg?.multiplier) >= 18;
      const stateLabel = activeMs > 0
        ? `${gboActive ? "GBO作動中" : "作動中"} ${Math.ceil(activeMs / 1000)}秒`
        : cooldownMs > 0
          ? `CT ${Math.ceil(cooldownMs / 1000)}秒`
          : "待機";
      return {
        ...item,
        inventoryKind,
        output: `物理武具 / ${stateLabel}`,
        detail: activeMs > 0
          ? `物理HSG。${gboActive ? "GBO" : "通常／Enhance"}浮揚中（残り${(activeMs / 1000).toFixed(1)}秒）。本体はStorageに残り、投擲・譲渡・死亡時戦利品移動が可能`
          : cooldownMs > 0
            ? `物理HSG。20秒CT中（残り${(cooldownMs / 1000).toFixed(1)}秒）。本体はStorageに残り、投擲・譲渡・死亡時戦利品移動が可能`
            : "物理HSG。通常使用と床外自動起動は1MPで即8秒・ACC 1.8。Useを600〜2999ms長押しすると総コスト固定1MPの単一Enhanceで即10秒・ACC 2.0、3000ms以上で総コスト固定2MPのGBOを即起動。MP不足時は発動せず、GBOだけHSGを1個破壊。通常投擲は接地後に回収でき、譲渡・死亡時戦利品移動も可能",
        badge: `×${Number(item.amount) || 1} / ${stateLabel}`,
        usable: activeMs <= 0 && cooldownMs <= 0 && (Boolean(self.fighterInfiniteResources) || Number(self.mana) >= Math.max(1, Number(self.hsgManaCost) || 1)),
        throwable: true,
        transferable: true
      };
    }
    return {
      ...item,
      inventoryKind,
      output: item.kind === "instant" ? "即席" : item.kind === "charge" ? "消耗品" : "所持品",
      detail: `${chargeDescriptions[item.id] || VENDING_PRODUCT_DESCRIPTIONS[item.id] || alchemyRecipes.find((entry) => entry.id === item.id || entry.id === `vending-${item.id}`)?.output || "使用・投擲可能"}${item.id === "orichalcum-sword" ? " / UseまたはThrowを600ms以上長押しすると固定1MPのEnhance、3000ms以上で固定2MPのGBO。GBOは該当数値性能を一回だけ10倍にし、その使用で剣を破壊" : ""}`,
      badge: `×${Number(item.amount) || 1}`
    };
  });
  const availableGunnerWeapons = (Array.isArray(self.gunnerWeapons) ? self.gunnerWeapons : [])
    .filter((weapon) => weapon.available !== false);
  // Purchased/Hacker-generated firearms are already authoritative in
  // gunnerWeapons. Gating only on the native Gunner operator made those owned
  // weapons disappear from a Hacker's inventory even though they were usable.
  const gunnerAccess = hasDisplayedOperatorAccess(self, "gunner") || availableGunnerWeapons.length > 0;
  const weaponItems = gunnerAccess
    ? availableGunnerWeapons
      .map((weapon) => {
        const specialType = weapon.id === self.gunnerSpecialAmmoWeapon && Number(self.gunnerSpecialAmmoRounds) > 0
          ? String(self.gunnerSpecialAmmoType || "")
          : "";
        const specialLabel = { weak: "ウィーク", penetrate: "ペネトレイト", shock: "ショック" }[specialType] || "";
        return {
          id: `weapon:${weapon.id}`,
          sourceId: weapon.id,
          label: weapon.name,
          asset: weapon.id,
          inventoryKind: "weapon",
          output: `${Number(weapon.ammo) || 0}/${Number(weapon.maxAmmo) || 0}発${specialLabel ? ` / ${specialLabel}×${self.gunnerSpecialAmmoRounds}` : ""}`,
          detail: `${VENDING_PRODUCT_DESCRIPTIONS[weapon.id] || "銃器"} / 現在HS ${Math.round((Number(self.gunnerCurrentHeadshotChance) || (self.gunnerSnipingActive ? 0.65 : 0.18)) * 100)}%（${self.gunnerSnipingActive ? "エイム" : "腰撃ち"}・幸運補正済み）${specialLabel ? ` / ${specialLabel}×${self.gunnerSpecialAmmoRounds}` : ""} / Shoot・Use・Throwを600ms以上長押しすると固定1MPのEnhance、3000ms以上で固定2MPのGBO。GBO射撃は1弾倉の通常数値性能を10倍にし、完了・中断時に銃を破壊`,
          badge: [weapon.id === self.gunnerWeapon ? "選択中" : "", specialLabel].filter(Boolean).join(" / ")
        };
      })
    : [];
  const specialAmmoLabels = { weak: "ウィーク弾", penetrate: "貫通弾", shock: "ショック弾" };
  const specialAmmoInventory = self.gunnerSpecialAmmoInventory && typeof self.gunnerSpecialAmmoInventory === "object"
    ? self.gunnerSpecialAmmoInventory
    : {};
  const specialAmmoItems = gunnerAccess
    ? Object.entries(specialAmmoLabels).filter(([type]) => Number(specialAmmoInventory[type]) > 0).map(([type, label]) => {
      const count = Math.max(0, Math.floor(Number(specialAmmoInventory[type]) || 0));
      const loaded = self.gunnerSpecialAmmoType === type && Number(self.gunnerSpecialAmmoRounds) > 0;
      return {
        id: `special-ammo:${type}`,
        sourceId: type,
        label,
        asset: `gunner-special-ammo-${type}`,
        inventoryKind: "special-ammo",
        output: `所持 ${count}発${loaded ? " / 装填中" : ""}`,
        detail: `${label}の獲得済み所持弾。現在の選択武器へ適用され、武器を切り替えると新しい選択武器へ追従します。装填中でも追加獲得でき、通常リロードでは失われません。`,
        badge: `${loaded ? "装填中 / " : ""}×${count}`,
        throwable: false,
        transferable: false
      };
    })
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
    detail: `${VENDING_PRODUCT_DESCRIPTIONS[id] || "使用・投擲可能"} / Use・Throwを600ms以上長押しすると固定1MPのEnhance、3000ms以上で固定2MPのGBO。GBOは該当数値性能を一回だけ10倍にして発明武器を破壊`,
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
    detail: `${VENDING_PRODUCT_DESCRIPTIONS[id] || "使い切り重火器"} / Use・Throwを600ms以上長押しすると固定1MPのEnhance、3000ms以上で固定2MPのGBO。GBOは該当数値性能を一回だけ10倍にして重火器を破壊`,
    badge: `×${count}`
  }));
  return [...regularItems, ...weaponItems, ...specialAmmoItems, ...inventionItems, ...heavyItems];
}

function createInventoryTouchGesture({
  onHold,
  onClearSelection,
  schedule = (callback, delay) => window.setTimeout(callback, delay),
  cancelSchedule = (timer) => window.clearTimeout(timer),
  holdDelay = 520,
  moveTolerance = 9
}) {
  let timer = 0;
  let touchId = null;
  let originX = 0;
  let originY = 0;
  let moved = false;
  let held = false;

  const clearTimer = () => {
    if (timer) cancelSchedule(timer);
    timer = 0;
  };
  const reset = () => {
    clearTimer();
    touchId = null;
    moved = false;
    held = false;
  };

  return {
    start(id, clientX, clientY) {
      reset();
      touchId = id;
      originX = clientX;
      originY = clientY;
      onClearSelection();
      timer = schedule(() => {
        if (touchId !== id || moved) return;
        timer = 0;
        held = true;
        onClearSelection();
        onHold();
      }, holdDelay);
    },
    move(id, clientX, clientY) {
      if (touchId !== id) return false;
      if (!moved && Math.hypot(clientX - originX, clientY - originY) > moveTolerance) {
        moved = true;
        clearTimer();
      }
      return moved;
    },
    end(id) {
      if (touchId !== id) return "ignored";
      const result = held ? "hold" : moved ? "scroll" : "tap";
      clearTimer();
      onClearSelection();
      reset();
      return result;
    },
    cancel(id = touchId) {
      if (touchId !== id) return false;
      onClearSelection();
      reset();
      return true;
    }
  };
}

function hideInventoryItemDetail() {
  if (state.inventoryItemDetailTimer) window.clearTimeout(state.inventoryItemDetailTimer);
  state.inventoryItemDetailTimer = null;
  state.inventoryItemDetailSource?.removeAttribute("aria-describedby");
  state.inventoryItemDetailSource = null;
  els.inventoryItemDetail.hidden = true;
}

function showInventoryItemDetail(item, sourceButton) {
  if (!item || !sourceButton) return;
  if (state.inventoryItemDetailTimer) window.clearTimeout(state.inventoryItemDetailTimer);
  state.inventoryItemDetailSource?.removeAttribute("aria-describedby");
  state.inventoryItemDetailSource = sourceButton;
  sourceButton.setAttribute("aria-describedby", "inventoryItemDetailDescription");
  els.inventoryItemDetailName.textContent = item.label || "所持品";
  els.inventoryItemDetailType.textContent = [item.output || "所持品", item.badge || ""].filter(Boolean).join(" / ");
  els.inventoryItemDetailDescription.textContent = item.detail || "使用・投擲可能";
  els.inventoryItemDetail.hidden = false;
  positionInventoryItemDetail(sourceButton);
  state.inventoryItemDetailTimer = window.setTimeout(hideInventoryItemDetail, 12_000);
}

function positionInventoryItemDetail(sourceButton = state.inventoryItemDetailSource) {
  const panel = els.inventoryItemDetail;
  if (!sourceButton || !panel || panel.hidden) return;
  const viewport = window.visualViewport;
  const leftEdge = Number(viewport?.offsetLeft) || 0;
  const topEdge = Number(viewport?.offsetTop) || 0;
  const rightEdge = leftEdge + (Number(viewport?.width) || window.innerWidth);
  const bottomEdge = topEdge + (Number(viewport?.height) || window.innerHeight);
  const margin = 10;
  const gap = 10;
  panel.style.left = `${leftEdge + margin}px`;
  panel.style.top = `${topEdge + margin}px`;
  panel.style.right = "auto";
  panel.style.bottom = "auto";
  panel.style.maxHeight = `${Math.max(120, bottomEdge - topEdge - margin * 2)}px`;
  const sourceRect = sourceButton.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const maxLeft = Math.max(leftEdge + margin, rightEdge - panelRect.width - margin);
  const maxTop = Math.max(topEdge + margin, bottomEdge - panelRect.height - margin);
  const spaceRight = rightEdge - sourceRect.right - margin;
  const spaceLeft = sourceRect.left - leftEdge - margin;
  let left = Math.min(maxLeft, Math.max(leftEdge + margin, sourceRect.left));
  if (spaceRight >= panelRect.width + gap) left = sourceRect.right + gap;
  else if (spaceLeft >= panelRect.width + gap) left = sourceRect.left - panelRect.width - gap;
  const centeredTop = sourceRect.top + sourceRect.height / 2 - panelRect.height / 2;
  const top = Math.min(maxTop, Math.max(topEdge + margin, centeredTop));
  panel.style.left = `${Math.round(left)}px`;
  panel.style.top = `${Math.round(top)}px`;
}

window.addEventListener("resize", () => positionInventoryItemDetail(), { passive: true });
window.visualViewport?.addEventListener("resize", () => positionInventoryItemDetail(), { passive: true });
window.visualViewport?.addEventListener("scroll", () => positionInventoryItemDetail(), { passive: true });

function createInventoryClickGate({
  now = () => performance.now(),
  duration = 1_200
} = {}) {
  let suppressUntil = 0;
  return {
    arm() {
      suppressUntil = now() + duration;
    },
    reset() {
      suppressUntil = 0;
    },
    consume() {
      if (now() > suppressUntil) return false;
      suppressUntil = 0;
      return true;
    }
  };
}

function bindInventoryDetailHold(button, item, scrollContainer = els.itemInventoryGrid) {
  button.__inventoryDetailItem = item;
  const clickGate = createInventoryClickGate();
  let activePointerId = null;
  let activePointerType = "";
  const clearNativeSelection = () => {
    const selection = window.getSelection?.();
    if (selection && selection.rangeCount) selection.removeAllRanges();
  };
  const suppressNativeLongPress = (event) => {
    if (event.cancelable) event.preventDefault();
    event.stopPropagation();
    clearNativeSelection();
  };
  button.addEventListener("contextmenu", suppressNativeLongPress);
  button.addEventListener("selectstart", suppressNativeLongPress);
  button.addEventListener("dragstart", suppressNativeLongPress);
  button.addEventListener("copy", suppressNativeLongPress);
  const pointerGesture = createInventoryTouchGesture({
    onHold: () => {
      clickGate.arm();
      clearNativeSelection();
      try { button.setPointerCapture(activePointerId); } catch {}
      showInventoryItemDetail(button.__inventoryDetailItem || item, button);
      if (navigator.vibrate) navigator.vibrate(18);
    },
    onClearSelection: clearNativeSelection
  });
  button.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    activePointerId = event.pointerId;
    activePointerType = event.pointerType || "mouse";
    clickGate.reset();
    pointerGesture.start(event.pointerId, event.clientX, event.clientY);
  });
  button.addEventListener("pointermove", (event) => {
    if (activePointerId !== event.pointerId) return;
    pointerGesture.move(event.pointerId, event.clientX, event.clientY);
  });
  button.addEventListener("pointerup", (event) => {
    if (activePointerId !== event.pointerId) return;
    const result = pointerGesture.end(event.pointerId);
    if (result !== "tap") {
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();
      clickGate.arm();
    }
    activePointerId = null;
    activePointerType = "";
  });
  const cancelPointerGesture = (event) => {
    if (activePointerId !== event.pointerId) return;
    pointerGesture.cancel(event.pointerId);
    activePointerId = null;
    activePointerType = "";
    clickGate.reset();
  };
  button.addEventListener("pointercancel", cancelPointerGesture);
  button.addEventListener("lostpointercapture", cancelPointerGesture);
  button.addEventListener("click", (event) => {
    if (!clickGate.consume()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
}

function defaultInventoryItemSelection(items, self, explicitItemId = "") {
  const available = Array.isArray(items) ? items : [];
  const explicit = available.find((item) => item.id === String(explicitItemId || ""));
  if (explicit) return explicit.id;
  const equippedFirearmId = self?.gunnerWeapon ? `weapon:${self.gunnerWeapon}` : "";
  if (equippedFirearmId && available.some((item) => item.id === equippedFirearmId)) return equippedFirearmId;
  const nonHsgWeapon = available.find((item) => item.id !== "hsg" && displayedWeaponKind(item));
  if (nonHsgWeapon) return nonHsgWeapon.id;
  if (available.some((item) => item.id === "hsg")) return "hsg";
  return available[0]?.id || "";
}

function hasNonHsgDisplayedWeapon(items) {
  return (Array.isArray(items) ? items : []).some((item) => item.id !== "hsg" && displayedWeaponKind(item));
}

function renderItemControl(data) {
  const self = data.self;
  const items = collectInventoryDisplayItems(self, estimatedServerNow(data));
  const targets = (data.players || []).filter((player) => player.id !== self.id && player.alive && !player.ejected);
  const visible = data.phase === "playing" && self.alive && !self.ejected && (items.length > 0 || Number(self.credits) > 0);
  els.itemControl.hidden = !visible;
  if (!visible) {
    state.itemRenderKey = "";
    if (state.inventoryItemDetailSource && els.itemControl.contains(state.inventoryItemDetailSource)) hideInventoryItemDetail();
    return;
  }
  const previousTarget = els.transferTargetSelect.value;
  const renderKey = JSON.stringify([
    items.map((item) => [item.id, item.label, item.asset, item.inventoryKind, item.throwable, item.transferable]),
    targets.map((target) => [target.id, target.name])
  ]);
  if (state.itemRenderKey !== renderKey) {
    state.itemRenderKey = renderKey;
    if (!items.some((item) => item.id === state.explicitInventoryItemId)) state.explicitInventoryItemId = "";
    const replaceImplicitHsg = state.implicitHsgInventoryFallback && !state.explicitInventoryItemId && hasNonHsgDisplayedWeapon(items);
    const preferredItemId = defaultInventoryItemSelection(items, self, replaceImplicitHsg ? "" : state.explicitInventoryItemId);
    state.implicitHsgInventoryFallback = !state.explicitInventoryItemId && preferredItemId === "hsg" && !hasNonHsgDisplayedWeapon(items);
    els.itemSelect.innerHTML = items.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.label)} ${escapeHtml(item.badge || "")}</option>`).join("");
    if (preferredItemId) els.itemSelect.value = preferredItemId;
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
      button.draggable = false;
      button.style.webkitTouchCallout = "none";
      button.style.webkitUserSelect = "none";
      button.style.userSelect = "none";
      button.setAttribute("role", "option");
      button.setAttribute("aria-label", item.label);
      button.innerHTML = `<span class="alchemy-choice-icon" aria-hidden="true"></span><span class="item-choice-copy"><strong>${escapeHtml(item.label)}</strong>${item.inventoryKind === "special-ammo" || item.id === "hsg" ? `<small>${escapeHtml(item.badge)}</small>` : ""}</span>`;
      bindInventoryDetailHold(button, item);
      button.addEventListener("click", () => {
        hideInventoryItemDetail();
        selectItemChoice(item.id, false);
        if (item.inventoryKind === "weapon" && item.sourceId !== state.data?.self?.gunnerWeapon) {
          void api("/api/gunner-weapon", { weaponId: item.sourceId });
        }
      });
      els.itemInventoryGrid.append(button);
      applyGeneratedItemTexture(button, item.asset || item.sourceId || item.id);
    });
  }
  [...els.itemSelect.options].forEach((option) => {
    const item = items.find((entry) => entry.id === option.value);
    if (item) option.textContent = `${item.label} ${item.badge || ""}`.trim();
  });
  [...els.transferTargetSelect.options].forEach((option) => {
    const target = targets.find((entry) => entry.id === option.value);
    if (target) option.textContent = playerIdentityLabel(target);
  });
  els.itemInventoryGrid.querySelectorAll("[data-item-choice]").forEach((button) => {
    const item = items.find((entry) => entry.id === button.dataset.itemChoice);
    if (!item) return;
    button.__inventoryDetailItem = item;
    button.setAttribute("aria-label", item.label);
    const name = button.querySelector(".item-choice-copy strong");
    const badge = button.querySelector(".item-choice-copy small");
    if (name && name.textContent !== item.label) name.textContent = item.label;
    if (badge && badge.textContent !== String(item.badge || "")) badge.textContent = String(item.badge || "");
    applyGeneratedItemTexture(button, item.asset || item.sourceId || item.id);
  });
  const weaponChanged = Boolean(state.inventoryVisualWeapon && state.inventoryVisualWeapon !== self.gunnerWeapon);
  state.inventoryVisualWeapon = self.gunnerWeapon || "";
  const equippedWeaponItemId = self.gunnerWeapon ? `weapon:${self.gunnerWeapon}` : "";
  if (weaponChanged && items.some((item) => item.id === equippedWeaponItemId)) {
    // Keyboard weapon switching must move the visible inventory selection with
    // the authoritative weapon, otherwise the old firearm remains highlighted.
    els.itemSelect.value = equippedWeaponItemId;
    state.explicitInventoryItemId = equippedWeaponItemId;
    state.implicitHsgInventoryFallback = false;
  }
  const fallbackItemId = defaultInventoryItemSelection(items, self, state.explicitInventoryItemId);
  const selected = items.find((item) => item.id === els.itemSelect.value) || items.find((item) => item.id === fallbackItemId) || items[0];
  if (selected && els.itemSelect.value !== selected.id) els.itemSelect.value = selected.id;
  if (selected && displayedWeaponKind(selected)) state.selectedWeaponItemId = selected.id;
  els.itemInventoryGrid.querySelectorAll("[data-item-choice]").forEach((button) => {
    const active = button.dataset.itemChoice === selected?.id;
    button.classList.toggle("selected", active);
    button.setAttribute("aria-selected", String(active));
  });
  const blocked = (Number(self.itemDisabledUntil) || 0) > estimatedServerNow(data);
  const canActOnItem = Boolean(selected) && !blocked && selected?.inventoryKind !== "special-ammo";
  const canUse = canActOnItem && selected?.usable !== false;
  const selectedInstant = selected?.inventoryKind === "instant";
  const selectedWeaponReloading = selected?.inventoryKind === "weapon" &&
    selected.sourceId === self.gunnerReloadWeapon &&
    (Number(self.gunnerReloadUntil) || 0) > estimatedServerNow(data);
  const transferCredits = transferCreditAmount();
  els.transferCreditsAmount.max = String(Math.max(1, Math.floor(Number(self.credits) || 0)));
  els.itemUseButton.disabled = !canUse || selectedWeaponReloading;
  els.itemUseButton.hidden = false;
  els.itemThrowButton.hidden = selectedInstant;
  els.itemThrowButton.disabled = selectedInstant || !canActOnItem || selected?.throwable === false;
  els.transferItemButton.hidden = selectedInstant;
  els.transferItemButton.disabled = selectedInstant || !selected || !targets.length || blocked || selected?.transferable === false;
  els.transferCreditsButton.disabled = Number(self.credits) < transferCredits || !targets.length;
  const selectedUseLabel = selected?.inventoryKind === "weapon"
    ? selectedWeaponReloading ? `自動リロード ${Math.max(0, (Number(self.gunnerReloadUntil) - estimatedServerNow(data)) / 1000).toFixed(1)}秒` : "射撃"
    : selected?.id === "hsg"
      ? "使用"
      : selected?.sourceId === "orichalcum-sword" || selected?.id === "orichalcum-sword"
      ? "斬る"
      : selectedInstant ? "発動" : selected?.usable === false ? "使用不可" : "使用";
  els.itemUseButton.textContent = `${selectedUseLabel} [Shift+V]`;
  els.itemThrowButton.textContent = "投擲 [Shift+G]";
  els.transferCreditsButton.textContent = `${transferCredits}C譲渡（所持${Math.floor(Number(self.credits) || 0)}C）`;
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

function ownsDisplayedItem(self, itemId) {
  return Boolean((Array.isArray(self?.itemInventory) ? self.itemInventory : []).some((item) => (
    item?.id === itemId && Number(item.amount) > 0
  )));
}

function hasDisplayedOrichalcumSword(self) {
  return ownsDisplayedItem(self, "orichalcum-sword");
}

function isDisplayedWeaponItemId(itemId) {
  const id = String(itemId || "");
  return id === "orichalcum-sword" || id.startsWith("weapon:") || id.startsWith("invention:") || id.startsWith("heavy:");
}

function displayedWeaponKind(item) {
  if (!item) return "";
  if (item.id === "orichalcum-sword") return "sword";
  if (item.inventoryKind === "weapon" || String(item.id || "").startsWith("weapon:")) return "firearm";
  if (item.inventoryKind === "invention" || String(item.id || "").startsWith("invention:")) return "invention";
  if (item.inventoryKind === "heavy" || String(item.id || "").startsWith("heavy:")) return "heavy";
  return "";
}

function displayedWeaponAction(self) {
  if (!self) return null;
  const items = collectInventoryDisplayItems(self);
  const findWeapon = (id) => {
    const item = items.find((candidate) => candidate.id === id);
    const kind = displayedWeaponKind(item);
    return kind ? { ...item, kind } : null;
  };
  const selected = findWeapon(els.itemSelect?.value);
  if (selected) return selected;
  const remembered = findWeapon(state.selectedWeaponItemId);
  if (remembered) return remembered;
  const equippedFirearm = findWeapon(self.gunnerWeapon ? `weapon:${self.gunnerWeapon}` : "");
  if (equippedFirearm) return equippedFirearm;
  const sword = findWeapon("orichalcum-sword");
  if (sword) return sword;
  const fallback = items.find((item) => displayedWeaponKind(item));
  return fallback ? { ...fallback, kind: displayedWeaponKind(fallback) } : null;
}

function isRepeatableDisplayedWeaponAction(weaponAction) {
  return ["sword", "firearm"].includes(weaponAction?.kind);
}

function collectOperatorPassiveEffects(self, liveNow, phase = "playing") {
  const effects = [];
  const add = (label, value, tone, detail, layout = "inline") => effects.push({ label, value, tone, detail, layout });
  const passiveEnabled = Boolean(self.passivesEnabled);
  const passiveValue = passiveEnabled ? "有効" : "理知まで休止";
  const passiveTone = passiveEnabled ? "rational" : "neutral";

  if (hasDisplayedOperatorAccess(self, "fighter")) {
    add("キルカウンター", passiveValue, passiveTone, "確殺を回避した時だけ攻撃者を即時確殺");
    const energyWait = Math.max(0, Number(self.fighterEnergyChargeReadyAt || 0) - liveNow);
    const infinite = self.fighterInfiniteResources
      ? " / MP・SP・HP・バリア∞"
      : "";
    const energyPeak = Math.max(Number(self.fighterEnergyPeak) || 0, Number(self.fighterEnergyCharge) || 0);
    add(
      "EC",
      passiveEnabled ? `現在${Math.max(0, Number(self.fighterEnergyCharge) || 0)} / 最高${energyPeak} / 次${formatEffectCountdown(energyWait)}${infinite}` : passiveValue,
      passiveTone,
      "12秒ごとに1MPでEC+1。通常衝撃波はEC-1。初回100:MP・SP・HP・バリア∞。初回500:居合+1。初回1000:LB被確殺解除、消滅斬り（死体なし）、JG全反射。EC100以上の斬る:EC-100で特大衝撃波",
      "stacked"
    );
  }

  if (hasDisplayedOperatorAccess(self, "gravity")) {
    add("リビテーション", self.levitationActive ? "浮揚可能" : passiveValue, self.levitationActive ? "rational" : passiveTone, "床外移動中0.04MP/秒。終了時に床がなければ落下死");
  }

  if (hasDisplayedOperatorAccess(self, "flora")) {
    const aromaValue = self.aromaActive
      ? `自然回復 HP・SP・MP ×${Number(self.aromaRegenMultiplier || 1.75).toFixed(2)}`
      : passiveValue;
    add("アロマ", aromaValue, self.aromaActive ? "good" : passiveTone, "本人の理知自然回復だけを強化。HP・SP・MPの漸進回復速度を1.75倍化");
  }

  if (hasDisplayedOperatorAccess(self, "gunner")) {
    const specialAmmoWait = Math.max(0, Number(self.gunnerSpecialAmmoReadyAt || 0) - liveNow);
    const bufferedAmmo = self.gunnerSpecialAmmoInventory || {};
    add(
      "特殊弾装填パッシブ",
      passiveEnabled
        ? `${specialAmmoWait > 0 ? `次 ${formatEffectCountdown(specialAmmoWait)}` : "待機"} / 保持: ウィーク ${Math.max(0, Number(bufferedAmmo.weak) || 0)}・ペネトレイト ${Math.max(0, Number(bufferedAmmo.penetrate) || 0)}・ショック ${Math.max(0, Number(bufferedAmmo.shock) || 0)}`
        : passiveValue,
      passiveTone,
      "理知中18秒ごとに選択中の銃へウィーク弾・貫通弾・ショック弾のいずれかを1マガジン獲得。非装填種も保持し、武器切替時に選択銃へ再適用"
    );
    const aimMovementLabel = self.movementMode === "walk"
      ? "通常歩行"
      : self.movementMode === "slow"
        ? "低速移動"
        : self.movementMode === "jump" || self.movementMode === "jump-prepare"
          ? "ジャンプ"
          : "停止";
    const aimValue = !passiveEnabled
      ? "理知まで休止"
      : self.movementMode === "dash"
        ? "ダッシュ中・休止"
        : self.gunnerSnipingActive
          ? `${aimMovementLabel}・追尾中`
          : self.gunnerAimAvailable
            ? `${aimMovementLabel}・対象探索中`
            : "現在休止";
    add(
      "エイム",
      aimValue,
      self.gunnerSnipingActive ? "truth" : passiveTone,
      `理知中はダッシュ以外の移動状態で、選択銃の射程内かつ遮蔽物越しでない最寄りの生存者へ射撃方向を自動追尾。幸運補正後のHSは腰撃ち${Math.round((Number(self.gunnerHipHeadshotChance) || 0.18) * 100)}%、エイム${Math.round((Number(self.gunnerAimHeadshotChance) || 0.65) * 100)}%。正規ダッシュ時だけ即解除。手動ボタン・追尾移動なし`
    );
  }

  const hsgActiveMs = Math.max(0, Number(self.hsgUntil) - liveNow);
  const hsgGboActive = Number(self.timedAccelerationStacks?.hsg?.multiplier) >= 18;
  if (hsgActiveMs > 0) {
    add(
      "HSG",
      `${hsgGboActive ? "GBO" : "HSG"}浮揚中 ${formatEffectCountdown(hsgActiveMs)}`,
      "truth",
      `${hsgGboActive ? "直接GBO" : "直接使用または床外自動起動"}の時間効果。Storage cardで使用・投擲とCTを確認`
    );
  }

  if (hasDisplayedOperatorAccess(self, "assassin")) {
    add("常時無音", "常時有効", "truth", "歩行・ダッシュを含む全移動で足音イベントを発生させず、敵Botにも足音証拠を与えない");
    add("アサシン忍殺", "消滅へ変換", "truth", "忍殺成功時はアサシン忍殺による消滅となり、死体・通報対象・死体由来markerを残さない");
  }

  if (self.special === "alchemist") {
    const hackerOperational = phase === "playing" && self.alive && !self.ejected;
    add("ハック", hackerOperational ? "稼働" : "戦闘中のみ", hackerOperational ? "rational" : "neutral", "生存中は対象位置を把握。防衛側ではタスクを60秒ごとに自動完了");
    const manaGpuDrain = Number(self.manaGpuDrainPerSecond || 0).toFixed(3);
    const manaGpuReductionSeconds = Math.round(Number(self.manaGpuCooldownReductionMsPerMana || 0) / 1000);
    add(
      "マナGPU",
      self.manaGpuActive
        ? `${(Math.max(0, Number(self.manaGpuCooldownCreditMs) || 0) / 1000).toFixed(1)}秒蓄積・稼働`
        : `${(Math.max(0, Number(self.manaGpuCooldownCreditMs) || 0) / 1000).toFixed(1)}秒蓄積・休止`,
      self.manaGpuActive ? "truth" : "neutral",
      `毎秒${manaGpuDrain}MPを短縮クール化。1MP=${manaGpuReductionSeconds}秒`
    );
  }

  return effects;
}

function renderActiveEffects(data) {
  const self = data.self;
  const liveNow = estimatedServerNow(data);
  const rational = self.mentalState === "理知";
  const itemBlocked = (Number(self.itemDisabledUntil) || 0) > liveNow;
  const effects = [];
  const add = (label, value, tone, detail) => effects.push({ label, value, tone, detail });
  const timed = (label, endsAt, tone, detail) => {
    if ((endsAt || 0) > liveNow) add(label, formatEffectCountdown(endsAt - liveNow), tone, detail);
  };

  const immediate = self.lastImmediateFeedback;
  if (immediate?.at && liveNow - immediate.at < 6500 && !["EC", "自然回復", "エイム"].includes(immediate.label)) {
    add(immediate.label, "完了", "instant", immediate.detail);
  }

  if (self.rationalFreeAbilityReady) {
    add("固有能力無料化", "準備完了", "rational", "次の固有能力はMP消費なし");
  } else if (rational) {
    timed("固有能力無料化", self.rationalFreeAbilityReadyAt, "rational", "理知維持で準備");
  }

  const passiveState = itemBlocked ? "EMP遮断" : rational ? "有効" : "理知まで休止";
  if (self.goodActive) add("善・全バフ", passiveState, rational ? "good" : "neutral", "バスト+1・バリア+1・HP/状態回復・加速・タスクSP軽減");
  if (self.luminousActive) add("ルミナス加速", "適用中", "truth", "加速×1.65。移動・物理モーション・CT・行動不能・タスク速度へ適用");
  if (self.limitBreakActive) {
    const limitBreakDetail = self.fighterInfiniteResources
      ? `HP消費なし / MP・SP・HP・バリア∞ / SP・加速×${Math.max(3, Number(self.limitBreakMultiplier) || 3)} / 被確殺デメリット解除`
      : `HP-1×${Math.max(1, Number(self.limitBreakStacks) || 1)} / SP・加速×${Math.max(3, Number(self.limitBreakMultiplier) || 3)} / MP継続消費 / 即死回避無効`;
    add("リミットブレイク", "永続", "truth", limitBreakDetail);
  }
  if (self.hackerRootActive) {
    add("ROOT", "適用中・Hで解除", "truth", "発動前のHPを保存し、解除時に正確に復元。バリア・変わり身は所持を維持したままROOT中だけ無効。ROOT中は対象オペ能力を借用");
  }
  effects.push(...collectOperatorPassiveEffects(self, liveNow, data.phase));
  if (Number(self.killChainCount) > 0) {
    add(
      "キルチェイン",
      `×${Math.max(0, Number(self.killChainCount) || 0)} / 次回キルCT ${(Math.max(0, Number(self.killChainCooldownMs) || 0) / 1000).toFixed(1)}秒`,
      "truth",
      `合法な異陣営キルごとに基本キルCTを10%ずつ短縮。現在${Math.round(Math.max(0.25, Number(self.killChainCooldownMultiplier) || 1) * 100)}%（最短25%）。銃の発射間隔・リロード・能力CTは対象外`
    );
  }
  if ((self.overheal || 0) > 0) add("オーバーヒール", `×${self.overheal}`, "good", "1回につきボディダメージ1回を吸収し、状態異常を解除");
  if ((self.standFirmCharges || 0) > 0) add("バリア", `×${self.standFirmCharges} / ${passiveState}`, rational ? "spirit" : "neutral", "確殺1回をボディダメージ化し、発動後もしばらく防護");
  if ((self.substitutionCharges || 0) > 0) add("変わり身の術", `×${self.substitutionCharges} / ${passiveState}`, rational ? "spirit" : "neutral", "次の攻撃を無効化して転移");
  if ((self.pushCharges || 0) > 0) add("バスト", `×${self.pushCharges} / ${passiveState}`, rational ? "truth" : "neutral", "バリア全消去。1回につき反動0.5");
  if ((self.iaiCharges || 0) > 0) add("居合", `×${self.iaiCharges} / 即席・自動`, rational ? "truth" : "neutral", "次の成功攻撃を破壊へ強化。失敗・回避・ガード・準備バリアでは消費しない。既存の消滅は維持");
  if ((self.warpCharges || 0) > 0) add("テレポートマップスクロール", `テレポート可能回数 ×${self.warpCharges}`, "truth", "巻き紙の獲得時にテレポート権利へ即時変換。任意のタイミングで拡大マップを開き、通行可能地点を選ぶと1回消費");
  if ((Number(self.gravityStormSlowUntil) || 0) > liveNow) {
    const multiplier = Math.max(0, Math.min(1, Number(self.gravityStormSlowMultiplier) || 1));
    timed(
      "重力減速",
      self.gravityStormSlowUntil,
      "desire",
      `速度${Math.round(multiplier * 100)}% / HP-${Number(self.lastGravityStormDamage || 0).toFixed(2)}`
    );
  }
  const borrowedOperatorAccess = (type) => hasDisplayedOperatorAccess(self, type);
  const specialAmmoLabels = { weak: "ウィーク", penetrate: "ペネトレイト", shock: "ショック" };
  const specialAmmoWeapon = (self.gunnerWeapons || []).find((weapon) => weapon.id === self.gunnerSpecialAmmoWeapon);
  if (self.gunnerSpecialAmmoType && Number(self.gunnerSpecialAmmoRounds) > 0) {
    const typeLabel = specialAmmoLabels[self.gunnerSpecialAmmoType] || "特殊弾";
    const detail = self.gunnerSpecialAmmoType === "weak"
      ? "命中した対象を破壊し、対象の死体を残す。射手への代償ダメージなし"
      : self.gunnerSpecialAmmoType === "penetrate"
        ? "通常の遮蔽物を貫通して射線上の対象へ到達"
        : "幸運/直観0未満:確殺 / 0以上:6秒間35%減速";
    add("特殊弾装填", `${typeLabel} / ${specialAmmoWeapon?.shortName || specialAmmoWeapon?.name || self.gunnerSpecialAmmoWeapon} ×${self.gunnerSpecialAmmoRounds}`, "truth", detail);
  }
  if (self.gravityTimeMode) timed(
    self.gravityTimeMode === "accelerate"
      ? `アクセラレート ×${Math.max(1, Number(self.gravityTimeStacks?.accelerate) || 1)}`
      : `ディーセラレート ×${Math.max(1, Number(self.gravityTimeStacks?.decelerate) || 1)}`,
    self.gravityTimeEndsAt,
    self.gravityTimeMode === "accelerate" ? "good" : "desire",
    "1MP・8秒。移動・物理モーション・CT・行動不能・タスク速度へ適用"
  );
  timed("時の番人", self.timeKeeperEndsAt, "truth", "1000MP・5秒。術者以外の全プレイヤー・入力・CT・物体運動を完全停止");
  timed("時間停止", self.timeStoppedUntil, "desire", "入力・行動・クールタイム・物理モーション停止");
  if ((self.routePartnerCount || 0) > 0) add("ペア行動警告", `${self.routePartnerCount}人`, "desire", "同経路5秒で継続ダメージ");
  timed("スマホ操作", self.smartphoneUntil, "neutral", "完了まで行動不能");

  if ((self.dodgeDurationBonusMs || 0) > 0) {
    add("回避時間拡張", `+${(self.dodgeDurationBonusMs / 1000).toFixed(2)}秒`, "beauty", "キル無効時間を延長");
  }
  if (self.mapObjectEffects?.speedBoost) add("加速床", "範囲内", "good", "加速×1.35。移動・物理モーション・CT・行動不能・タスク速度へ適用");
  if (self.mapObjectEffects?.quiet) add("静音フィールド", "範囲内", "rational", "足音なし");
  timed("回避", self.dodgeActiveUntil, "beauty", self.special === "fighter" ? "確殺を無効化した時だけキルカウンター" : "効果中に受けた攻撃を無効化する");
  const slashPerfectRemaining = Math.max(0, Number(self.slashPerfectUntil) - liveNow);
  const slashGuardRemaining = Math.max(0, Number(self.slashActiveUntil) - liveNow);
  const slashRearmRemaining = Math.max(0, Number(self.slashPerfectReadyAt) - liveNow);
  if (slashPerfectRemaining > 0) {
    add(
      self.fighterInfiniteResources ? "斬る・全反射ジャストガード" : "斬る・ジャストガード",
      `${Math.ceil(slashPerfectRemaining)}ms`,
      "truth",
      self.fighterInfiniteResources ? "受付中は全攻撃を反射" : "受付中は物理衝撃を100%反射"
    );
  } else if (slashGuardRemaining > 0) {
    add("斬る・物理ガード", `${Math.ceil(slashGuardRemaining)}ms`, "rational", "物理攻撃を無効化。EMP・毒・光は不可");
  }
  if (hasDisplayedOrichalcumSword(self) && slashRearmRemaining > 0) {
    add("ジャストガード再武装", `${(slashRearmRemaining / 1000).toFixed(1)}秒`, "neutral", "完了前の連打は受付遅延");
  }
  const floraAcceleration = self.timedAccelerationStacks?.flora;
  timed(
    `フローラ加速${floraAcceleration?.count > 1 ? ` ×${floraAcceleration.count}` : ""}`,
    floraAcceleration?.endsAt || self.overhealSpeedUntil,
    "good",
    `現在×${Number(floraAcceleration?.multiplier || 1.8).toFixed(2)}。移動・物理モーション・CT・行動不能・タスク速度へ適用`
  );
  timed("速度低下", self.slowedUntil, "desire", "移動速度低下");
  timed("テーザー痺れ", self.taserSlowedUntil, "desire", "移動速度35%低下");
  timed("ショック減速", self.shockSlowedUntil, "desire", "移動速度35%低下");
  timed("能力封印", self.abilityDisabledUntil, "desire", "固有能力使用不可");
  timed("EMP機器異常", self.itemDisabledUntil, "desire", "アイテム・装備効果停止（状態異常回復の対象外）");
  if (self.statusImmunityActive) {
    const hpRate = Number(self.naturalRecoveryHpPerSecond || 0.05).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
    const spRate = Number(self.naturalRecoveryStaminaPerSecond || 19).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    const mpRate = Number(self.naturalRecoveryManaPerSecond || 0.127).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
    add("自然回復", "理知", "good", `人体の状態異常を無効化・即時解除。EMP機器異常は状態異常ではないため回復対象外。HP ${hpRate}/秒、SP ${spRate}/秒、MP ${mpRate}/秒で独立回復し、満タン後はSP・MPのcurrent/maxを同率で拡張`);
  }
  if (self.poisonStatus) add("中毒", "継続中", "desire", "解毒剤・フローラ回復・理知中の自然回復で解除");
  if (self.burnStatus) add("燃焼", "継続中", "desire", "水・フローラ回復・理知中の自然回復で解除");
  timed("意識消失", self.unconsciousUntil, "desire", "視聴覚・行動停止");
  timed("重力拘束", self.gravityPinnedUntil, "desire", "移動・行動停止");
  timed("休息", self.sleepingUntil, "neutral", `行動停止・SP回復×4。SP全快時、MPが${Number(self.restCompletionManaFloor) || 2}未満なら${Number(self.restCompletionManaFloor) || 2}へ回復`);
  timed("精神統一", self.meditatingUntil, "rational", "開始時にMPを獲得。タップ+10MP/35秒、420ms以上の長押し+100MP/350秒");
  timed("インビジブル", self.floraInvisibleUntil, "good", "10秒間透明化。敵Botの直接視認・追跡対象外。自分のキャラクターは半透明表示");
  // The acquired product deliberately shares the native Hacker passive name
  // and map-feed meaning. A Hacker who also acquires it still gets exactly one
  // Applied Effects row; non-Hackers retain the acquired/EMP state wording.
  if (self.hackActive && self.special !== "alchemist") add("ハック", self.hackEffective ? "稼働" : "遮断中", self.hackEffective ? "rational" : "desire", self.hackEffective ? "即席適用・全生存者を表示" : "即席効果を保持・EMP解除後に復帰");

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
    <li class="effect-tone-${escapeHtml(effect.tone)}${effect.layout === "stacked" ? " effect-layout-stacked" : ""}">
      <span class="effect-copy">
        <strong class="effect-name">${escapeHtml(effect.label)}</strong>
        <small class="effect-detail">${escapeHtml(effect.detail)}</small>
      </span>
      <strong class="effect-value">${escapeHtml(effect.value)}</strong>
    </li>
  `).join("");
  scheduleActiveEffectsLayout();
}

let gameplayViewportReflowFrame = 0;
let gameplayViewportSettleTimer = 0;
let activeEffectsLayoutFrame = 0;
let gameplayViewportReflowPasses = 0;
let activeEffectsLayoutCallbacks = [];
const GAMEPLAY_VIEWPORT_REFLOW_MAX_PASSES = 4;
const GAMEPLAY_VIEWPORT_STABLE_SAMPLE_FRAMES = 2;
const GAMEPLAY_VIEWPORT_MIN_DIMENSION = 120;
let gameplayViewportStabilityFrame = 0;
let gameplayViewportStabilityTimer = 0;
let gameplayViewportStabilityGeneration = 0;
let gameplayViewportCandidateKey = "";
let gameplayViewportCandidateFrames = 0;
let gameplayViewportLastVisibleSample = null;

function visibleGameplayViewportSample() {
  if (document.hidden) return null;
  const width = Number(window.innerWidth);
  const height = Number(window.innerHeight);
  const visualWidth = Number(window.visualViewport?.width ?? width);
  const visualHeight = Number(window.visualViewport?.height ?? height);
  if (![width, height, visualWidth, visualHeight].every(Number.isFinite)) return null;
  if (width < GAMEPLAY_VIEWPORT_MIN_DIMENSION || height < GAMEPLAY_VIEWPORT_MIN_DIMENSION) return null;
  if (visualWidth < GAMEPLAY_VIEWPORT_MIN_DIMENSION || visualHeight < GAMEPLAY_VIEWPORT_MIN_DIMENSION) return null;
  // A background resume can expose a finite but partial visual viewport for a
  // few frames (keyboard/browser-chrome restoration and stale compositor
  // dimensions are common examples).  It must be rejected just like a zero
  // viewport: committing `innerWidth`/`innerHeight` during that disagreement
  // pins the fixed game shell to a stretched Canvas until the next lifecycle
  // event.  Small scrollbar/sub-pixel differences remain legitimate.
  const viewportMismatch = (layout, visual) => Math.abs(layout - visual) > Math.max(2, layout * 0.03);
  if (viewportMismatch(width, visualWidth) || viewportMismatch(height, visualHeight)) return null;
  return { width, height, visualWidth, visualHeight };
}

function gameplayViewportSampleKey(sample) {
  if (!sample) return "";
  return [sample.width, sample.height, sample.visualWidth, sample.visualHeight]
    .map((value) => Math.round(value * 10))
    .join(":");
}

function commitStableGameplayViewportSample(sample) {
  if (!sample || document.hidden) return false;
  gameplayViewportLastVisibleSample = { width: sample.width, height: sample.height };
  const widthValue = `${Math.round(sample.width * 10) / 10}px`;
  const heightValue = `${Math.round(sample.height * 10) / 10}px`;
  const rootStyle = document.documentElement.style;
  if (rootStyle.getPropertyValue("--dva-game-viewport-width") !== widthValue) {
    rootStyle.setProperty("--dva-game-viewport-width", widthValue);
  }
  if (rootStyle.getPropertyValue("--dva-game-viewport-height") !== heightValue) {
    rootStyle.setProperty("--dva-game-viewport-height", heightValue);
  }
  return true;
}

function scheduleStableGameplayViewportReflow(delayMs = 80) {
  const generation = ++gameplayViewportStabilityGeneration;
  gameplayViewportCandidateKey = "";
  gameplayViewportCandidateFrames = 0;
  let invalidSampleFrames = 0;
  if (gameplayViewportStabilityFrame) cancelAnimationFrame(gameplayViewportStabilityFrame);
  gameplayViewportStabilityFrame = 0;
  window.clearTimeout(gameplayViewportStabilityTimer);
  gameplayViewportStabilityTimer = window.setTimeout(() => {
    gameplayViewportStabilityTimer = 0;
    const collect = () => {
      gameplayViewportStabilityFrame = 0;
      if (generation !== gameplayViewportStabilityGeneration || document.hidden) return;
      const sample = visibleGameplayViewportSample();
      // Do not commit a partial sample, but keep a short bounded observation
      // window so a browser that reports its final foreground dimensions one
      // frame later can still settle without requiring another lifecycle event.
      if (!sample) {
        if (invalidSampleFrames < 4) {
          invalidSampleFrames += 1;
          gameplayViewportStabilityFrame = requestAnimationFrame(collect);
        }
        return;
      }
      invalidSampleFrames = 0;
      const key = gameplayViewportSampleKey(sample);
      if (key === gameplayViewportCandidateKey) gameplayViewportCandidateFrames += 1;
      else {
        gameplayViewportCandidateKey = key;
        gameplayViewportCandidateFrames = 1;
      }
      if (gameplayViewportCandidateFrames < GAMEPLAY_VIEWPORT_STABLE_SAMPLE_FRAMES) {
        gameplayViewportStabilityFrame = requestAnimationFrame(collect);
        return;
      }
      if (commitStableGameplayViewportSample(sample)) scheduleGameplayViewportReflow(true);
    };
    gameplayViewportStabilityFrame = requestAnimationFrame(collect);
  }, Math.max(0, Number(delayMs) || 0));
}

function gameplayViewportGeometryKey() {
  const fieldSlot = document.querySelector(".field-stage-slot");
  const board = fieldSlot?.querySelector(".board-wrap");
  const panel = els.activeEffectsPanel;
  const rectKey = (element) => {
    const rect = element?.getBoundingClientRect();
    return rect
      ? [Math.round(rect.width * 10), Math.round(rect.height * 10), Math.round(rect.top * 10)].join(":")
      : "0:0:0";
  };
  return [
    Math.round((Number(gameplayViewportLastVisibleSample?.width) || window.innerWidth) * 10),
    Math.round((Number(gameplayViewportLastVisibleSample?.height) || window.innerHeight) * 10),
    rectKey(fieldSlot),
    rectKey(board),
    rectKey(panel),
    fieldSlot?.style.getPropertyValue("--field-lower-height") || ""
  ].join("|");
}

function scheduleGameplayViewportReflow(settle = false) {
  if (settle) gameplayViewportReflowPasses = 0;
  if (gameplayViewportReflowFrame) return;
  gameplayViewportReflowFrame = requestAnimationFrame(() => {
    gameplayViewportReflowFrame = 0;
    const before = gameplayViewportGeometryKey();
    updateTitleCommandDepthPaths();
    syncPortraitTabletDock();
    if (state.screen === "game") {
      setTabletOpen(state.tabletOpen, { persist: false, focus: false });
      scheduleTabletBranchLayout();
      scheduleActiveEffectsLayout(() => {
        const after = gameplayViewportGeometryKey();
        if (after !== before && gameplayViewportReflowPasses < GAMEPLAY_VIEWPORT_REFLOW_MAX_PASSES - 1) {
          gameplayViewportReflowPasses += 1;
          scheduleGameplayViewportReflow(false);
        } else {
          gameplayViewportReflowPasses = 0;
        }
      });
    }
  });
  if (settle) {
    window.clearTimeout(gameplayViewportSettleTimer);
    gameplayViewportSettleTimer = window.setTimeout(() => {
      gameplayViewportSettleTimer = 0;
      scheduleGameplayViewportReflow(false);
    }, 120);
  }
}

function scheduleActiveEffectsLayout(afterLayout = null) {
  if (typeof afterLayout === "function") activeEffectsLayoutCallbacks.push(afterLayout);
  if (activeEffectsLayoutFrame) return;
  activeEffectsLayoutFrame = requestAnimationFrame(layoutActiveEffectsPanel);
}

function layoutActiveEffectsPanel() {
  activeEffectsLayoutFrame = 0;
  const callbacks = activeEffectsLayoutCallbacks;
  activeEffectsLayoutCallbacks = [];
  const panel = els.activeEffectsPanel;
  if (!panel || panel.hidden) {
    callbacks.forEach((callback) => callback());
    return;
  }
  const lowerRow = els.fieldLowerRow;
  const fieldSlot = lowerRow?.parentElement;
  const board = fieldSlot?.querySelector(".board-wrap");
  const fieldStyle = fieldSlot ? getComputedStyle(fieldSlot) : null;
  const stageGap = Number.parseFloat(fieldStyle?.rowGap || fieldStyle?.gap || "0") || 0;
  const currentPanelHeight = panel.getBoundingClientRect().height;
  const lowerExtras = lowerRow
    ? Math.max(0, lowerRow.getBoundingClientRect().height - currentPanelHeight)
    : 0;
  const measuredFieldRemainder = fieldSlot && board
    ? fieldSlot.getBoundingClientRect().height - board.getBoundingClientRect().height - stageGap - lowerExtras
    : 0;
  const fallbackHeight = Math.min(360, Math.floor(window.innerHeight * 0.36));
  const availableHeight = Math.max(116, Math.floor(measuredFieldRemainder > 0 ? measuredFieldRemainder : fallbackHeight));
  const borderHeight = (Number.parseFloat(getComputedStyle(panel).borderTopWidth) || 0) +
    (Number.parseFloat(getComputedStyle(panel).borderBottomWidth) || 0);
  const naturalHeight = Math.ceil(panel.scrollHeight + borderHeight);
  const shouldScroll = naturalHeight > availableHeight + 2;

  const maxHeight = `${shouldScroll ? availableHeight : naturalHeight}px`;
  const overflowY = shouldScroll ? "auto" : "visible";
  if (panel.style.maxHeight !== maxHeight) panel.style.maxHeight = maxHeight;
  if (panel.style.overflowY !== overflowY) panel.style.overflowY = overflowY;
  if (panel.classList.contains("effects-scrollable") !== shouldScroll) panel.classList.toggle("effects-scrollable", shouldScroll);

  if (lowerRow && fieldSlot && !lowerRow.hidden) {
    const lowerHeight = Math.ceil(lowerRow.getBoundingClientRect().height);
    const lowerHeightValue = `${lowerHeight}px`;
    if (fieldSlot.style.getPropertyValue("--field-lower-height") !== lowerHeightValue) {
      fieldSlot.style.setProperty("--field-lower-height", lowerHeightValue);
    }
  }
  callbacks.forEach((callback) => callback());
}

function setVendingOpen(open, { focus = true } = {}) {
  const data = state.data;
  const available = Boolean(
    state.screen === "game" &&
    data?.phase === "playing" &&
    data.self?.alive &&
    !data.self.ejected &&
    !data.self.inVent
  );
  state.vendingOpen = Boolean(open && available);
  state.vendingRenderKey = "";
  if (!state.vendingOpen) {
    stopVendingHold();
    stopVendingKeyHold();
    if (selectedScrollRegion() === els.vendingPanel) setSelectedScrollRegion(null, { focus: false });
  }
  if (data) renderVending(data);
  else els.vendingPanel.hidden = true;
  els.vendingButton.classList.toggle("active", state.vendingOpen);
  els.vendingButton.setAttribute("aria-expanded", String(state.vendingOpen));
  setTabletShortcutLabel(els.tabletVendingShortcut, "自販機", state.vendingOpen ? "自販機を閉じる" : "自販機を開く");
  els.tabletVendingShortcut.classList.toggle("active", state.vendingOpen);
  els.tabletVendingShortcut.setAttribute("aria-expanded", String(state.vendingOpen));
  if (state.vendingOpen) {
    requestAnimationFrame(() => setSelectedScrollRegion(els.vendingPanel, { focus }));
  }
}

function renderVending(data) {
  els.vendingPanel.querySelectorAll("[data-drink]").forEach((button) => {
    applyGeneratedItemTexture(button, button.dataset.vendingAsset || button.dataset.drink);
  });
  const available = Boolean(data.phase === "playing" && data.self.alive && !data.self.ejected && !data.self.inVent);
  if (!available) {
    state.vendingOpen = false;
    stopVendingHold({ suppressClick: true });
    stopVendingKeyHold();
  }
  const visible = Boolean(available && state.vendingOpen);
  els.vendingButton.disabled = !available;
  els.vendingButton.classList.toggle("active", visible);
  els.vendingButton.setAttribute("aria-expanded", String(visible));
  els.tabletVendingShortcut?.classList.toggle("active", visible);
  els.tabletVendingShortcut?.setAttribute("aria-expanded", String(visible));
  if (els.vendingPanel.hidden === visible) els.vendingPanel.hidden = !visible;
  if (!visible) {
    state.vendingRenderKey = "";
    scheduleActiveEffectsLayout();
    return;
  }
  const buttons = vendingProductButtons();
  const categories = availableVendingCategories();
  const category = categories.find((entry) => entry.id === state.vendingCategoryId) || categories[0] || hackerRecipeCategories[0];
  state.vendingCategoryId = category.id;
  const categoryButtons = buttons.filter((button) => DVA_ECONOMY.product(button.dataset.drink)?.vendingAvailable && vendingProductCategory(button.dataset.drink) === category.id);
  els.vendingCategoryLabel.textContent = `${category.label} ${categoryButtons.length}`;
  buttons.forEach((button) => {
    const product = DVA_ECONOMY.product(button.dataset.drink);
    button.hidden = !product?.vendingAvailable || product.category !== category.id;
    const copy = button.querySelector("span:last-child");
    const id = button.dataset.drink;
    const label = VENDING_PRODUCT_LABELS[id] || id;
    const price = Number.isFinite(VENDING_PRODUCT_COSTS[id]) ? `${VENDING_PRODUCT_COSTS[id]}C` : "";
    const visibleName = `${label}${price ? ` ${price}` : ""}`;
    if (copy && copy.textContent.trim() !== visibleName) {
      copy.classList.add("item-name-line");
      copy.innerHTML = `<span class="item-name-label">${escapeHtml(label)}</span>${price ? `<small class="item-name-meta">${escapeHtml(price)}</small>` : ""}`;
    }
    button.setAttribute("aria-label", visibleName);
    button.removeAttribute("title");
  });
  const mysteryVisible = data.self.lastMysteryResult && estimatedServerNow(data) - (data.self.lastMysteryResultAt || 0) < 20_000;
  const renderKey = JSON.stringify([
    Math.floor(Number(data.self.stamina) || 0),
    Number(data.self.maxStoredStamina) || 500,
    Number(data.self.bodyHits) || 0,
    Number(data.self.credits) || 0,
    Number(data.self.mana) || 0,
    data.self.fireJutsuCharges || 0,
    data.self.substitutionCharges || 0,
    data.self.standFirmCharges || 0,
    data.self.pushCharges || 0,
    mysteryVisible ? data.self.lastMysteryResult : "",
    Boolean(data.self.hackActive),
    category.id
  ]);
  if (state.vendingRenderKey === renderKey) {
    scheduleActiveEffectsLayout();
    return;
  }
  state.vendingRenderKey = renderKey;
  buttons.forEach((button) => {
    const staminaFull = false;
    const alreadyHasHack = button.dataset.drink === "hack" && data.self.hackActive;
    const unavailable = staminaFull || alreadyHasHack || data.self.credits < VENDING_PRODUCT_COSTS[button.dataset.drink];
    button.disabled = false;
    button.dataset.purchaseDisabled = unavailable ? "1" : "0";
    button.setAttribute("aria-disabled", String(unavailable));
    button.classList.toggle("purchase-unavailable", unavailable);
  });
  if (els.magicInventory.hidden) els.magicInventory.hidden = false;
  const carriedItems = (data.self.itemInventory || []).map((item) => `${item.label} ${item.amount}`).join(" / ");
  const inventoryText = `所持: ${carriedItems ? `${carriedItems} / ` : ""}火遁スクロール ${data.self.fireJutsuCharges || 0} / 変わり身 ${data.self.substitutionCharges || 0} / 銃器 ${(data.self.purchasedWeapons || []).length}${data.self.exiled ? " / 亡命済み" : ""}${mysteryVisible ? ` / ミステリー結果: ${data.self.lastMysteryResult}` : ""}`;
  if (els.magicInventory.textContent !== inventoryText) els.magicInventory.textContent = inventoryText;
  scheduleActiveEffectsLayout();
}

function objectiveText(data) {
  const self = data.self;
  const liveNow = estimatedServerNow(data);
  const itemBlocked = (Number(self.itemDisabledUntil) || 0) > liveNow;
  const rational = self.mentalState === "理知";
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
  if ((self.shockSlowedUntil || 0) > liveNow) {
    return `ショック減速 / 移動速度35%低下 / 残り${((self.shockSlowedUntil - liveNow) / 1000).toFixed(1)}秒`;
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
  const dodgeText = `回避 ${Number(self.dodgeStaminaCost) || 200}SP`;
  if (self.special === "fighter" && self.alive) {
    return `ファイター / EC・キルカウンター・リミットブレイク / 初期装備: オリハルコン・ソード / ${dodgeText}`;
  }
  if (self.special === "teleport" && self.alive) {
    return `タスクを進めてください。テレポート ${self.abilityCosts?.teleport || 0}MP / ${dodgeText}`;
  }
  if (self.role === "attacker") {
    if (self.aimTargetId && self.aimReadyAt > liveNow) {
      return `忍殺静止中。発動まで${((self.aimReadyAt - liveNow) / 1000).toFixed(1)}秒。自分か対象が動くと失敗し、成功時は${self.special === "assassin" ? "アサシン忍殺による消滅となり、死体・通報対象を残しません" : "通常忍殺として通報可能な死体を残します"}。`;
    }
    const cd = Math.max(0, Math.ceil((self.killReadyAt - data.serverNow) / 1000));
    const empSeconds = Math.max(0, Math.ceil(((self.empReadyAt || 0) - liveNow) / 1000));
    const sabotageSeconds = Math.max(0, Math.ceil(((self.sabotageReadyAt || 0) - liveNow) / 1000));
    const assassinStatus = self.special === "assassin" ? "アサシン / 足音常時無音 / " : "";
    const chain = Math.max(0, Number(self.killChainCount) || 0);
    const chainStatus = chain > 0 ? ` / キルチェイン ${chain}（次CT ${(Math.max(0, Number(self.killChainCooldownMs) || 0) / 1000).toFixed(1)}秒）` : "";
    return `${assassinStatus}ディフェンダーを減らしてください。忍殺 ${cd ? `${cd}秒` : "使用可能"} / EMP ${empSeconds ? `${empSeconds}秒` : "使用可能"} / サボタージュ ${sabotageSeconds ? `${sabotageSeconds}秒` : "使用可能"}${chainStatus}`;
  }
  if (!self.alive) return "死亡中です。残ったタスクは完了扱いです。";
  if (self.chatMuted) return "復活後のため、この試合ではチャットできません。";
  return `タスクは${self.taskStaminaRequirement || 400}SPを消費し、端末の近くで停止し続けると自動実行。回避は${Number(self.dodgeStaminaCost) || 200}SPを消費します。現在 ${Math.floor(self.stamina || 0)}SP / ${dodgeText}`;
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

function syncMovementAccControl(data = state.data) {
  const self = data?.self;
  if (!els.movementAccControl || !self) return;
  const enabled = self.movementAccEnabled !== false;
  const threshold = Math.max(1, Number(self.movementAccThreshold) || 2);
  const fixedAcc = Math.max(1, Number(self.movementAccMax) || 2);
  const acceleration = Math.max(1, Number(self.accelerationMultiplier) || 1);
  const active = self.movementAccActive === true || (
    self.movementAccActive == null && enabled && acceleration + 1e-6 >= threshold && Number(self.movementAcc) > 1.5
  );
  els.movementAccToggleButton.textContent = active
    ? `移動ACC ${fixedAcc.toFixed(2)}　固定中 [Q]`
    : enabled
      ? `移動ACC固定　待機（ACC ${threshold.toFixed(0)}以上） [Q]`
      : "移動ACC固定　OFF [Q]";
  els.movementAccToggleButton.setAttribute("aria-pressed", String(enabled));
  els.movementAccToggleButton.dataset.state = active ? "active" : enabled ? "waiting" : "off";
  els.movementAccToggleButton.classList.toggle("active", active);
  els.movementAccToggleButton.classList.toggle("waiting", enabled && !active);
  els.movementAccToggleButton.disabled = !["playing", "meeting"].includes(data.phase) || self.ejected;
}

async function toggleMovementAcc() {
  const self = state.data?.self;
  if (!self || !["playing", "meeting"].includes(state.data?.phase) || self.ejected) return false;
  const enabled = self.movementAccEnabled !== false;
  return api("/api/movement-acc", { enabled: !enabled });
}

function normalizeManaConversionMode(value) {
  return value === "grit" ? "grit" : "reason";
}

function manaConversionLabel(mode) {
  return normalizeManaConversionMode(mode) === "grit" ? "バリア" : "バスト";
}

function syncManaConversionControl(data = state.data) {
  const self = data?.self;
  if (!self || !els.manaConversionControl) return;
  const isPlaying = data.phase === "playing";
  const liveNow = estimatedServerNow(data);
  const actionBlocked = isActionBlocked(data);
  const itemBlocked = (Number(self.itemDisabledUntil) || 0) > liveNow;
  const canAct = isPlaying && self.alive && !self.ejected && !self.inVent && !actionBlocked && !itemBlocked;
  const authoritativeMode = normalizeManaConversionMode(self.manaConversionMode);
  const mode = normalizeManaConversionMode(state.pendingManaConversionMode || authoritativeMode);
  const label = manaConversionLabel(mode);
  const charges = mode === "grit"
    ? Math.max(0, Number(self.gritCharges) || 0)
    : Math.max(0, Number(self.reasonCharges) || 0);
  const hasMana = Boolean(self.fighterInfiniteResources) || (Number(self.mana) || 0) >= 1;
  els.manaConversionControl.hidden = !isPlaying;
  els.manaConversionControl.dataset.mode = mode;
  els.manaConversionModeSelect.value = mode;
  els.manaConversionModeSelect.disabled = !canAct || state.manaConversionModeInFlight || state.manaConversionInFlight;
  els.manaConversionButton.textContent = `${label}変換`;
  els.manaConversionButton.title = `1MPを${label}1回分へ変換 [F] / 所持 ${charges}/3`;
  els.manaConversionButton.setAttribute("aria-label", `1MPを${label}1回分へ変換`);
  els.manaConversionButton.disabled = !canAct || !hasMana || charges >= 3 || state.manaConversionModeInFlight || state.manaConversionInFlight;
}

async function selectManaConversionMode() {
  if (state.manaConversionModeInFlight || state.manaConversionInFlight) return false;
  const mode = normalizeManaConversionMode(els.manaConversionModeSelect.value);
  if (mode === normalizeManaConversionMode(state.data?.self?.manaConversionMode)) {
    syncManaConversionControl();
    return true;
  }
  state.pendingManaConversionMode = mode;
  state.manaConversionModeInFlight = true;
  syncManaConversionControl();
  const result = await api("/api/mana-conversion-mode", { mode });
  state.manaConversionModeInFlight = false;
  state.pendingManaConversionMode = "";
  syncManaConversionControl();
  return result;
}

function newManaConversionTransactionId() {
  return globalThis.crypto?.randomUUID?.() || `mana-conversion-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function convertManaToSelectedProtection() {
  if (state.manaConversionInFlight || state.manaConversionModeInFlight || els.manaConversionButton.disabled) return false;
  const transactionId = state.pendingManaConversionTransactionId || newManaConversionTransactionId();
  state.pendingManaConversionTransactionId = transactionId;
  state.manaConversionInFlight = true;
  syncManaConversionControl();
  const result = await api("/api/mana-conversion", { transactionId });
  state.manaConversionInFlight = false;
  if (result?.manaConversionTransactionId === transactionId) {
    state.pendingManaConversionTransactionId = "";
  }
  syncManaConversionControl();
  return result;
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
  const selectedAlchemy = alchemyRecipes.find((recipe) => recipe.id === els.alchemySelect.value) || alchemyRecipes[0];
  const activeBorrowedOperator = selectedBorrowedOperator();
  const hasMana = (key) => {
    if (self.hackerManaFree || self.rationalFreeAbilityReady) return true;
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
  const utilityStation = nearestStation((station) => station.type === "utility");
  const groundItem = nearestGroundItem(data);
  const liveNow = estimatedServerNow(data);
  const itemBlocked = (Number(self.itemDisabledUntil) || 0) > liveNow;
  syncManaConversionControl(data);
  const dodgeStaminaCost = Number(self.dodgeStaminaCost) || 200;
  const cameraIndices = availableCameraIndices(data);
  const aiming = Boolean(aimed && self.aimTargetId);
  const dodgeAccess = self.role === "defender" || fighterAccess;

  const contextSource = !groundItem
    ? (utilityStation ? els.utilityButton : null)
    : null;
  const actionLayoutKey = JSON.stringify([
    self.role,
    self.special,
    fighterAccess,
    borrowedGunnerAccess,
    canUseKill,
    state.cameraViewIndex >= 0 && cameraIndices.length >= 2,
    (self.fireJutsuCharges || 0) > 0,
    hasDisplayedOperatorAccess(self, "gravity"),
    hasDisplayedOperatorAccess(self, "flora"),
    hasDisplayedOperatorAccess(self, "gunner"),
    hasDisplayedOperatorAccess(self, "quantum"),
    activeBorrowedOperator,
    els.teleportModeSelect.value,
    els.teleportTargetSelect.value
  ]);
  if (state.actionLayoutKey !== actionLayoutKey) {
    state.actionLayoutKey = actionLayoutKey;
    els.emergencyButton.hidden = false;
    els.ninjutsuButton.hidden = !canUseKill;
    els.dodgeButton.hidden = !dodgeAccess;
    els.teleportButton.hidden = true;
    els.shootButton.hidden = true;
    els.weaponButton.hidden = true;
    els.sleepButton.hidden = false;
    els.renkiButton.hidden = false;
    els.healButton.hidden = true;
    els.alchemyButton.hidden = true;
    els.operatorAbilityButton.hidden = activeBorrowedOperator
      ? false
      : !["fighter", "teleport", "flora", "quantum", "alchemist"].includes(self.special);
    els.jumpButton.hidden = true;
    els.gunnerReloadButton.hidden = true;
    els.empButton.hidden = false;
    els.cameraButton.hidden = self.role !== "defender";
    els.nextCameraButton.hidden = self.role !== "defender";
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
  els.contextActionButton.hidden = !(groundItem || contextSource);
  if (groundItem) {
    els.contextActionButton.dataset.sourceId = "";
    els.contextActionButton.dataset.context = "ground-item";
    els.contextActionButton.dataset.groundItemId = groundItem.id;
    els.contextActionButton.dataset.hotkey = "E";
    els.contextActionButton.textContent = `拾う: ${groundItem.label}`;
    els.contextActionButton.title = `${groundItem.label}を拾う（誰でも取得可能）`;
    els.contextActionButton.disabled = !(canActAlive && !itemBlocked);
  } else if (contextSource) {
    els.contextActionButton.dataset.sourceId = contextSource.id;
    els.contextActionButton.dataset.context = contextSource.id.replace(/Button$/, "");
    els.contextActionButton.dataset.groundItemId = "";
    els.contextActionButton.dataset.hotkey = contextSource.dataset.hotkey || "";
    els.contextActionButton.textContent = contextSource.textContent;
    els.contextActionButton.title = contextSource.title || contextSource.textContent;
    els.contextActionButton.disabled = contextSource.disabled;
  } else {
    els.contextActionButton.dataset.sourceId = "";
    els.contextActionButton.dataset.context = "";
    els.contextActionButton.dataset.groundItemId = "";
    els.contextActionButton.title = "";
    els.contextActionButton.removeAttribute("data-hotkey");
  }
  const killSeconds = Math.max(0, Math.ceil(((self.killReadyAt || 0) - liveNow) / 1000));
  els.ninjutsuButton.textContent = aiming
    ? `忍殺 ${(Math.max(0, self.aimReadyAt - liveNow) / 1000).toFixed(1)}秒`
    : killSeconds > 0
      ? `忍殺 ${killSeconds}秒`
      : "忍殺";
  els.ninjutsuButton.disabled = !(canActAlive && canUseKill && !aiming && self.killReadyAt <= liveNow && target);
  els.ninjutsuButton.classList.toggle("active", aiming);
  const killChainSuffix = Number(self.killChainCount) > 0
    ? ` キルチェイン${Number(self.killChainCount)}、次回キルCT ${(Math.max(0, Number(self.killChainCooldownMs) || 0) / 1000).toFixed(1)}秒。`
    : " キル成立ごとに次回キルCTを10%短縮（最短25%）。";
  els.ninjutsuButton.title = (self.special === "assassin"
    ? "忍殺: 自分と対象が4秒間静止するとアサシン忍殺による消滅。死体・通報対象・死体由来マーカーを残さない。移動または対象喪失で失敗"
    : "忍殺: 自分と対象が4秒間静止すると対象を倒し、通報可能な死体を残す。移動または対象喪失で失敗") + killChainSuffix;
  els.fireJutsuButton.textContent = `火遁スクロール 燃焼 ×${self.fireJutsuCharges || 0}`;
  els.fireJutsuButton.disabled = !(canUseAbility && !itemBlocked && (self.fireJutsuCharges || 0) > 0);
  const rootProtectionBlocked = Boolean(self.hackerRootActive);
  els.substitutionStatusButton.textContent = rootProtectionBlocked
    ? `変わり身 ×${self.substitutionCharges || 0}（ROOT中無効・所持維持）`
    : itemBlocked
      ? `変わり身 ×${self.substitutionCharges || 0}（EMP遮断）`
      : `変わり身 ×${self.substitutionCharges || 0}（自動）`;
  const standFirmCharges = Number(self.standFirmCharges ?? self.gritCharges) || 0;
  const pushCharges = Number(self.pushCharges ?? self.reasonCharges) || 0;
  const philosophy = [
    (self.ideaStage || 0) >= 1 && (self.ideaFirstAspect === "truth" || (self.ideaStage || 0) >= 2) ? "真" : "",
    (self.ideaStage || 0) >= 1 && (self.ideaFirstAspect === "beauty" || (self.ideaStage || 0) >= 2) ? "美" : "",
    self.goodActive ? "善" : ""
  ].filter(Boolean).join("・");
  const standFirmMode = self.fighterInfiniteResources
    ? "EC100到達報酬"
    : rootProtectionBlocked
      ? "ROOT中無効・所持維持"
      : itemBlocked
        ? "EMP遮断"
        : "自動";
  els.gritStatusButton.textContent = `バリア ${self.fighterInfiniteResources ? "∞" : `×${standFirmCharges}`}（${standFirmMode}）${philosophy ? ` / ${philosophy}` : ""}`;
  els.reasonButton.textContent = `バスト ×${pushCharges}（${itemBlocked ? "EMP遮断" : "自動"}）`;
  els.reasonButton.disabled = true;
  const gunnerWeapons = Array.isArray(self.gunnerWeapons) ? self.gunnerWeapons : [];
  const gunnerWeapon = gunnerWeapons.find((weapon) => weapon.id === self.gunnerWeapon) || gunnerWeapons[0] || {
    id: "assault", name: "アサルトライフル", shortName: "AR", ammo: 0, maxAmmo: 0, ammoPerShot: 1, range: 920, damage: 0.34, manaCost: 0
  };
  const gunSeconds = Math.max(0, ((Number(self.gunReadyAt) || 0) - liveNow) / 1000);
  const gunAmmoReady = Number(gunnerWeapon.ammo) >= Number(gunnerWeapon.ammoPerShot || 1);
  const firingWeapon = gunnerWeapons.find((weapon) => weapon.id === self.gunFiringWeapon) || gunnerWeapon;
  const reloadSeconds = Math.max(0, ((Number(self.gunnerReloadUntil) || 0) - liveNow) / 1000);
  const gunnerBurstStaminaCost = Number(self.gunnerBurstStaminaCost) || 50;
  const shootLabel = `射撃 -${gunnerBurstStaminaCost}SP`;
  // The layout reset hides Gunner controls defensively.  Reapply their
  // authoritative access visibility on every state update so a role switch,
  // ROOT acquisition or purchased firearm cannot leave an otherwise enabled
  // firing route invisible.
  els.shootButton.hidden = !gunnerAccess;
  els.weaponButton.hidden = !gunnerAccess;
  els.gunnerReloadButton.hidden = !gunnerAccess;
  els.weaponButton.dataset.weapon = gunnerWeapon.id;
  els.weaponButton.dataset.destroyed = "false";
  const activeSpecialAmmo = self.gunnerSpecialAmmoWeapon === gunnerWeapon.id && Number(self.gunnerSpecialAmmoRounds) > 0
    ? ({ weak: "ウィーク", penetrate: "ペネトレイト", shock: "ショック" }[self.gunnerSpecialAmmoType] || "特殊弾")
    : "";
  els.weaponButton.textContent = `${gunnerWeapon.shortName || gunnerWeapon.name} ${gunnerWeapon.ammo}/${gunnerWeapon.maxAmmo}${activeSpecialAmmo ? ` / ${activeSpecialAmmo}×${self.gunnerSpecialAmmoRounds}` : ""}`;
  const normalDamage = Math.max(0, Number(gunnerWeapon.damage) || 0);
  const minimumDamage = Math.round(normalDamage * Math.max(0, Number(gunnerWeapon.minDamageRatio) || 1) * 100) / 100;
  const normalDamageDetail = minimumDamage < normalDamage
    ? `通常与ダメージ${normalDamage.toFixed(2)}（最遠${minimumDamage.toFixed(2)}）`
    : `通常与ダメージ${normalDamage.toFixed(2)}（距離減衰なし）`;
  const aimDamageDetail = `現在HS ${Math.round((Number(self.gunnerCurrentHeadshotChance) || (self.gunnerSnipingActive ? 0.65 : 0.18)) * 100)}%（${self.gunnerSnipingActive ? "エイム" : "腰撃ち"}） / 幸運補正後: 腰撃ち${Math.round((Number(self.gunnerHipHeadshotChance) || 0.18) * 100)}%・エイム${Math.round((Number(self.gunnerAimHeadshotChance) || 0.65) * 100)}%`;
  els.weaponButton.title = `${gunnerWeapon.name} / 射程${gunnerWeapon.range} / ${normalDamageDetail} / ${aimDamageDetail}${activeSpecialAmmo ? ` / ${activeSpecialAmmo}特殊弾はこの選択武器へ適用中` : ""} / Tで切替`;
  els.weaponButton.disabled = !(canActAlive && !itemBlocked && gunnerAccess);
  if (self.gunFiring) {
    els.shootButton.textContent = `${firingWeapon.shortName || firingWeapon.name} 1弾倉射撃中（残り${Math.max(0, Number(self.gunnerBurstRoundsRemaining) || 0)}発）`;
  } else if (reloadSeconds > 0) {
    els.shootButton.textContent = `リロード ${reloadSeconds.toFixed(1)}秒`;
  } else if (!gunAmmoReady) {
    els.shootButton.textContent = `${shootLabel} 弾切れ`;
  } else if (gunSeconds > 0) {
    els.shootButton.textContent = `${shootLabel} ${gunSeconds.toFixed(1)}秒`;
  } else {
    els.shootButton.textContent = shootLabel;
  }
  els.shootButton.classList.toggle("active", Boolean(self.gunFiring || state.gunTriggerHeld));
  els.shootButton.disabled = Boolean(self.gunFiring || state.gunTriggerHeld || state.gunFireStartPromise) ||
    !(canUseAbility && !itemBlocked && gunnerAccess && gunAmmoReady && Number(self.stamina) >= gunnerBurstStaminaCost && gunSeconds <= 0 && reloadSeconds <= 0);
  els.gunnerReloadButton.textContent = reloadSeconds > 0 ? `リロード ${reloadSeconds.toFixed(1)}秒` : "リロード";
  els.gunnerReloadButton.disabled = !(canActAlive && !itemBlocked && gunnerAccess && Number(gunnerWeapon.ammo) < Number(gunnerWeapon.maxAmmo) && reloadSeconds <= 0);
  els.dodgeButton.textContent = `回避 -${dodgeStaminaCost}SP`;
  els.dodgeButton.disabled = !(canUseAbility && dodgeAccess && self.stamina >= dodgeStaminaCost && hasMana("dodge") && self.dodgeActiveUntil <= liveNow);
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
  const operatorMode = activeBorrowedOperator
    ? state.borrowedAbilityModes[activeBorrowedOperator] || ""
    : els.teleportModeSelect.value;
  const floraCostKey = operatorMode === "sunbeam"
    ? "floraSunbeam"
    : operatorMode === "invisible"
      ? "floraInvisible"
      : "flora";
  const operatorLabels = {
    fighter: self.limitBreakActive ? `リミットブレイク ×${Math.max(1, Number(self.limitBreakStacks) || 1)} 永続` : "リミットブレイク",
    teleport: operatorMode === "near" ? `転移・対象付近 ${operatorCostLabel("teleport")}`
      : operatorMode === "target" ? `対象転移 ${operatorCostLabel("teleport")}`
        : operatorMode === "heart" ? `心臓転移 ${operatorCostLabel("heartTeleport")}`
          : operatorMode === "accelerate" ? `アクセラレート 8秒 ${operatorCostLabel("teleport")}`
            : operatorMode === "decelerate" ? `ディーセラレート 8秒 ${operatorCostLabel("teleport")}`
              : operatorMode === "time-keeper" ? `時の番人 5秒 ${operatorCostLabel("timeKeeper")}`
                : `グラビティストーム ${operatorCostLabel("gravityStorm")}`,
    flora: operatorMode === "heal"
      ? `回復 ${operatorCostLabel("flora")}`
      : operatorMode === "sunbeam"
        ? `サンビーム ${operatorCostLabel("floraSunbeam")}`
        : `インビジブル 10秒 ${operatorCostLabel("floraInvisible")}`,
    quantum: selectedQuantumExecutableMode(activeBorrowedOperator === "quantum") === "electric-discharge"
      ? `${quantumModeLabel("electric-discharge")} ${operatorCostLabel("quantumElectric")} / -16SP`
      : quantumModeLabel(selectedQuantumExecutableMode(activeBorrowedOperator === "quantum")),
    assassin: "常時無音（パッシブ）",
    alchemist: "Root化"
  };
  const borrowedDisplayedOperator = activeBorrowedOperator === "gravity"
    ? "teleport"
    : activeBorrowedOperator;
  const borrowedDisplayedLabel = operatorLabels[borrowedDisplayedOperator] || "能力を選択";
  const rootToggle = self.special === "alchemist";
  const displayedOperator = rootToggle ? "alchemist" : self.special;
  const quantumEndgameSecondsLeft = Math.max(0, Number(data.quantumEndgameSecondsLeft) || 0);
  const nativeQuantumMode = selectedQuantumExecutableMode(false);
  const borrowedQuantumMode = selectedQuantumExecutableMode(true);
  const nuclearModeLocked = (mode) => ["nuclear-fission", "nuclear-fusion"].includes(mode) && !data.quantumEndgameAvailable;
  const nativeQuantumEndgameLocked = displayedOperator === "quantum" && nuclearModeLocked(nativeQuantumMode);
  const borrowedQuantumEndgameLocked = borrowedDisplayedOperator === "quantum" && nuclearModeLocked(borrowedQuantumMode);
  const nativeQuantumManaUnavailable = displayedOperator === "quantum" && nativeQuantumMode === "electric-discharge" && !hasMana("quantumElectric");
  const borrowedQuantumManaUnavailable = borrowedDisplayedOperator === "quantum" && borrowedQuantumMode === "electric-discharge" && !hasMana("quantumElectric");
  const nativeFloraUnavailable = displayedOperator === "flora" && (
    !hasMana(floraCostKey) || (operatorMode === "invisible" && self.floraInvisibleActive)
  );
  const borrowedFloraUnavailable = borrowedDisplayedOperator === "flora" && (
    !hasMana(floraCostKey) || (operatorMode === "invisible" && self.floraInvisibleActive)
  );
  els.operatorAbilityButton.textContent = rootToggle
    ? (self.hackerRootActive ? borrowedDisplayedLabel : "Root化")
    : operatorLabels[displayedOperator] || "オペ能力";
  if (self.hackerRootActive && borrowedQuantumEndgameLocked) {
    els.operatorAbilityButton.textContent += `（終盤まで${quantumEndgameSecondsLeft}秒）`;
  } else if (nativeQuantumEndgameLocked) {
    els.operatorAbilityButton.textContent += `（終盤まで${quantumEndgameSecondsLeft}秒）`;
  }
  els.operatorAbilityButton.dataset.operator = displayedOperator || "none";
  els.operatorAbilityButton.dataset.repeatableAbility = rootToggle ? "0" : "1";
  els.operatorAbilityButton.classList.toggle("active", Boolean(rootToggle && self.hackerRootActive));
  els.operatorAbilityButton.disabled = rootToggle && self.hackerRootActive
    ? !(isPlaying && self.alive && !self.ejected) || borrowedFloraUnavailable || borrowedQuantumManaUnavailable ||
      (borrowedDisplayedOperator === "quantum" && hasCompatibleQuantumItem(self, borrowedQuantumMode) && Number(self.stamina) < Number(self.quantumActionStaminaCost || 16))
    : !canUseAbility ||
      displayedOperator === "assassin" ||
      nativeFloraUnavailable ||
      nativeQuantumManaUnavailable ||
      (displayedOperator === "teleport" && !hasMana(operatorMode === "storm" ? "gravityStorm" : operatorMode === "heart" ? "heartTeleport" : operatorMode === "time-keeper" ? "timeKeeper" : "teleport")) ||
      (displayedOperator === "fighter" && (!hasMana("fighterCharge") || (Math.max(0, 2 - (Number(self.bodyHits) || 0)) + Math.max(0, Number(self.overheal) || 0)) <= 1)) ||
      nativeQuantumEndgameLocked ||
      (displayedOperator === "quantum" && hasCompatibleQuantumItem(self, selectedQuantumExecutableMode(false)) && Number(self.stamina) < Number(self.quantumActionStaminaCost || 16));
  els.operatorAbilityButton.title = self.hackerRootActive && borrowedQuantumEndgameLocked
    ? `核分裂・核融合は終盤に解禁されます（残り${quantumEndgameSecondsLeft}秒）。${ROOT_SHORTCUT_HOLD_DELAY_MS}ms長押しでROOT解除`
    : rootToggle && self.hackerRootActive
    ? `タップで${borrowedDisplayedLabel}を実行。${ROOT_SHORTCUT_HOLD_DELAY_MS}ms長押しでROOT解除`
    : rootToggle
    ? "タップでROOT化"
    : nativeQuantumEndgameLocked
    ? `核分裂・核融合は終盤に解禁されます（残り${quantumEndgameSecondsLeft}秒）`
    : abilityBatchActionSupported(operatorAbilityAction())
    ? "タップは通常1回。長押しはサーバーが現在MPから2を残す量を一括消費し、通常MPコストで成立する回数を同じ対象・方式へ並列発動"
    : "タップで現在の固有能力を1回発動";
  const empSeconds = Math.max(0, Math.ceil(((self.empReadyAt || 0) - liveNow) / 1000));
  const empPhaseLabel = els.empPhaseSelect.value === "negative" ? "逆相" : "正相";
  els.empButton.textContent = empSeconds > 0 ? `${empPhaseLabel}EMP ${empSeconds}秒` : `${empPhaseLabel}EMP`;
  els.empButton.disabled = !(canUseAbility && empSeconds === 0);
  els.cameraButton.textContent = state.cameraViewIndex >= 0 ? "監視終了" : "監視カメラ";
  els.cameraButton.classList.toggle("active", state.cameraViewIndex >= 0);
  els.cameraButton.disabled = !(canUseAbility && self.role === "defender" && cameraIndices.length);
  els.nextCameraButton.disabled = state.cameraViewIndex < 0;
  const sleepSeconds = Math.max(0, Math.ceil(((self.sleepingUntil || 0) - liveNow) / 1000));
  const sleepEstimate = Math.max(0.1, ((self.maxStoredStamina || 500) - self.stamina) / (self.sleepRegenPerSecond || 76));
  els.sleepButton.textContent = sleepSeconds > 0 ? `休息 ${sleepSeconds}秒` : `休息 約${sleepEstimate.toFixed(1)}秒`;
  els.sleepButton.title = `SP全快まで行動を停止して毎秒${Number(self.sleepRegenPerSecond) || 76}SP回復。完了時にMPが${Number(self.restCompletionManaFloor) || 2}未満なら${Number(self.restCompletionManaFloor) || 2}へ回復します。`;
  els.sleepButton.disabled = !(canActAlive && self.stamina < (self.maxStoredStamina || 500));
  const renkiSeconds = Math.max(0, ((self.meditatingUntil || 0) - liveNow) / 1000);
  els.renkiButton.textContent = renkiSeconds > 0 ? `精神統一 ${renkiSeconds.toFixed(1)}秒` : "練気 +10MP / 35秒";
  els.renkiButton.title = "タップは+10MP・35秒。420ms以上の長押しは+100MP・350秒。どちらも一回だけ自動確定し、反復しません。";
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
  if (contextSource && !groundItem) {
    els.contextActionButton.textContent = contextSource.textContent;
    els.contextActionButton.disabled = contextSource.disabled;
  }
  els.chatInput.disabled = !(data.phase === "meeting" && self.alive && !self.ejected && !self.chatMuted);
  syncMovementAccControl(data);
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
        <span class="sub-line">${escapeHtml(playerFacingRoleLabel(player.role))}</span>
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

// The result payload already seals the only player-facing score. This board
// deliberately accepts no historical score aliases or client-side transforms.
function resultPointTotal(entry) {
  const points = Number(entry?.points);
  return Number.isFinite(points) ? points : 0;
}

function boardMvpLabel(entry) {
  return entry?.mvp === true ? "MVP" : "";
}

// The server seals this ledger with the total. Rendering named facts is not a
// client-side score calculation: malformed facts are simply omitted.
function resultPointBreakdown(entry) {
  if (!Array.isArray(entry?.pointBreakdown)) return [];
  return entry.pointBreakdown
    .filter((fact) => typeof fact?.reason === "string" && fact.reason && Number.isFinite(Number(fact.points)) && Number(fact.points) !== 0)
    .map((fact) => ({ reason: fact.reason, points: Number(fact.points) }));
}

function resultPointBreakdownText(entry) {
  const facts = resultPointBreakdown(entry);
  return facts.length
    ? facts.map((fact) => `${fact.reason} ${fact.points > 0 ? "+" : ""}${fact.points}`).join(" · ")
    : "変動なし";
}

function resultBoardFingerprint(data, results) {
  const ideaWinnerIds = Array.isArray(data.ideaWinnerIds) && data.ideaWinnerIds.length
    ? data.ideaWinnerIds
    : [data.ideaWinnerId].filter(Boolean);
  return JSON.stringify({
    roomId: String(data.roomId || ""),
    round: Number(data.round) || 0,
    winner: String(data.winner || ""),
    finishReason: String(data.finishReason || ""),
    soloMissionId: String(data.soloMission?.id || ""),
    selfId: String(data.selfId || ""),
    ideaWinnerIds: ideaWinnerIds.map(String).sort(),
    results: results.map((entry, index) => [
      String(entry.id || ""),
      String(entry.name || ""),
      String(entry.role || ""),
      String(entry.color || ""),
      index,
      resultPointTotal(entry),
      entry.mvp === true,
      resultPointBreakdown(entry).map((fact) => [fact.reason, fact.points]),
      Boolean(entry.ideaWinner),
      Boolean(entry.luminousSuccess)
    ])
  });
}

function renderEnd(data) {
  const ended = data.phase === "ended";
  els.endOverlay.hidden = !ended;
  els.resetButton.hidden = !ended;
  els.resetButton.textContent = data.soloMission ? "戦術いろはへ戻る" : "もう一度マッチング";
  if (!ended) {
    els.endTitle.textContent = "";
    els.endReason.textContent = "";
    els.resultRanking.replaceChildren();
    state.resultCelebrationKey = "";
    state.resultBoardFingerprint = "";
    els.resultConfetti.replaceChildren();
    return;
  }
  const ideaWinnerIds = new Set(
    Array.isArray(data.ideaWinnerIds) && data.ideaWinnerIds.length
      ? data.ideaWinnerIds
      : [data.ideaWinnerId].filter(Boolean)
  );
  const results = data.results || [];
  const fingerprint = resultBoardFingerprint(data, results);
  const resultChanged = state.resultBoardFingerprint !== fingerprint;
  els.endTitle.textContent = "ランクポイント";
  els.endReason.textContent = data.finishReason || "";
  if (data.soloMission?.id === "cpu-gravity" && data.winner === "attackers") {
    localStorage.setItem(storage.cpuGravityHint, "1");
    const hint = $("#cpuGravityHint");
    if (hint) hint.hidden = false;
  }
  if (resultChanged) {
    const previousScrollTop = Math.max(0, Number(els.resultRanking.scrollTop) || 0);
    const previousScrollLeft = Math.max(0, Number(els.resultRanking.scrollLeft) || 0);
    // Replacing the rows can synchronously clamp scrollTop to zero. Mark that
    // browser-owned reset as expected so the common poll restorer can restore
    // the captured offset after layout without mistaking the clamp for a new
    // user flick.
    scrollRestoreExpected.set(els.resultRanking, { top: 0, left: 0 });
    els.resultRanking.replaceChildren();
    if (results.length) {
      const section = document.createElement("section");
      section.className = "result-team result-overall";
      section.innerHTML = `
        <div class="result-team-title">
          <strong>全プレイヤー</strong>
          <span>ランクポイント</span>
        </div>
        <div class="result-team-list"></div>
      `;
      const list = section.querySelector(".result-team-list");
      results.forEach((entry, index) => {
        const row = document.createElement("div");
        const points = resultPointTotal(entry);
        const mvpLabel = boardMvpLabel(entry);
        const breakdown = resultPointBreakdownText(entry);
        const isMvp = mvpLabel === "MVP";
        const ideaWinner = data.winner === "idea" && (entry.ideaWinner || ideaWinnerIds.has(entry.id));
        row.className = `result-row${isMvp ? " is-first" : ""}${entry.id === data.selfId ? " is-self" : ""}${entry.luminousSuccess ? " is-luminous" : ""}${ideaWinner ? " is-idea-winner" : ""}${points !== 0 ? " has-points" : ""}`;
        row.innerHTML = `
          <span class="color-dot" style="background:${escapeHtml(entry.color || "#94a3b8")}"></span>
          <span class="result-player">
            <strong>${escapeHtml(String(entry.name || ""))}</strong>
            ${mvpLabel ? `<small class="result-point-mvp">${mvpLabel}</small>` : ""}
            <small class="result-point-breakdown">${escapeHtml(breakdown)}</small>
          </span>
          <span class="result-points" aria-label="ランクポイント ${points > 0 ? "+" : ""}${points}"><strong>${points > 0 ? "+" : ""}${points}</strong><small>ランクP</small></span>
        `;
        list.appendChild(row);
      });
      els.resultRanking.appendChild(section);
    }
    scrollRestoreExpected.set(els.resultRanking, {
      top: previousScrollTop,
      left: previousScrollLeft
    });
    state.resultBoardFingerprint = fingerprint;
  }
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
    ? (selfResult?.ideaWinner || (Array.isArray(data.ideaWinnerIds) ? data.ideaWinnerIds : [data.ideaWinnerId]).includes(data.selfId))
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
  if (document.hidden || !state.roomId || !state.playerId || state.data?.phase !== "playing") return Promise.resolve(false);
  if (state.focusResyncPromise) return state.focusResyncPromise;
  const roomId = state.roomId;
  const playerId = state.playerId;
  const generation = state.roomSessionGeneration;
  const serial = ++state.focusResyncSerial;
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
    resetOnNotFound: false,
    timeoutMs: 1_500,
    attempts: 1
  }).then((result) => {
    if (!result || serial !== state.focusResyncSerial || !isCurrentRoomSession(roomId, playerId, generation)) return false;
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
  }).catch(() => false).finally(() => {
    if (serial !== state.focusResyncSerial) return;
    state.focusResyncing = false;
    state.focusResyncPromise = null;
  });
  return state.focusResyncPromise;
}

async function sendHttpMovement(payload) {
  if (state.offlineMode) return state.offlineClient?.request("/api/move", payload);
  const response = await fetch(apiUrl("/api/move"), {
    method: "POST",
    headers: onlineApiHeaders({ "content-type": "application/json" }),
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
  if (Number.isFinite(Number(result.maxStoredStamina))) {
    data.self.maxStoredStamina = Math.max(Number(result.maxStoredStamina), Number(result.stamina) || 0);
  }
  data.self.slowedUntil = result.slowedUntil;
  data.self.taserSlowedUntil = result.taserSlowedUntil;
  data.self.shockSlowedUntil = result.shockSlowedUntil;
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
  const authoritativeMovementAccEnabled = result.movementAccEnabled !== false;
  const authoritativeMovementAccThreshold = Math.max(1, Number(result.movementAccThreshold) || 2);
  const authoritativeMovementAccActive = result.movementAccActive === true || (
    result.movementAccActive == null && authoritativeMovementAccEnabled && authoritativeAcceleration + 1e-6 >= authoritativeMovementAccThreshold && Number(result.movementAcc) > 1.5
  );
  const authoritativeMovementAccMax = Math.max(1, Number(result.movementAccMax) || 2);
  const authoritativeMovementAcc = authoritativeMovementAccActive ? authoritativeMovementAccMax : 1;
  data.self.speedMultiplier = authoritativeSpeed;
  data.self.accelerationMultiplier = authoritativeAcceleration;
  data.self.movementAcc = authoritativeMovementAcc;
  data.self.movementAccMax = authoritativeMovementAccMax;
  data.self.movementAccEnabled = authoritativeMovementAccEnabled;
  data.self.movementAccActive = authoritativeMovementAccActive;
  data.self.movementAccAvailable = result.movementAccAvailable === true;
  data.self.movementAccThreshold = authoritativeMovementAccThreshold;
  player.speedMultiplier = authoritativeSpeed;
  player.accelerationMultiplier = authoritativeAcceleration;
  player.movementAcc = authoritativeMovementAcc;
  player.movementAccMax = authoritativeMovementAccMax;
  player.movementAccEnabled = authoritativeMovementAccEnabled;
  player.movementAccActive = authoritativeMovementAccActive;
  player.movementAccAvailable = result.movementAccAvailable === true;
  player.movementAccThreshold = authoritativeMovementAccThreshold;
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
  player.shockSlowedUntil = result.shockSlowedUntil;
  player.gravityStormSlowUntil = result.gravityStormSlowUntil;
  player.gravityStormSlowMultiplier = result.gravityStormSlowMultiplier;
  player.lastGravityStormDamage = result.lastGravityStormDamage;
  syncMovementAccControl(data);

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
  if (state.enhanceHold.kind || state.throwTargeting.active || state.clairvoyance.active || state.jumpPreparing || state.focusResyncing || document.hidden || isActionBlocked()) return { dx: 0, dy: 0 };
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
  if (candidate.invisible) return false;
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

function drawGunnerAim(data = state.data) {
  if (data?.phase !== "playing" || !data.self?.gunnerSnipingActive || !data.self?.gunnerAimTargetId) return;
  const target = data.players.find((player) => player.id === data.self.gunnerAimTargetId && player.alive && !player.ejected && !player.invisible);
  const self = selfPlayer();
  if (!target || !self) return;
  const origin = renderedPlayer(self);
  const destination = renderedPlayer(target);
  const frameNow = state.frameNow || performance.now();
  const pulse = 0.72 + Math.sin(frameNow / 110) * 0.18;
  const gradient = ctx.createLinearGradient(origin.x, origin.y, destination.x, destination.y);
  gradient.addColorStop(0, "rgba(34,211,238,0.28)");
  gradient.addColorStop(0.72, "rgba(125,211,252,0.78)");
  gradient.addColorStop(1, "rgba(255,255,255,0.92)");
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = pulse;
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2.2;
  ctx.setLineDash([12, 9]);
  ctx.lineDashOffset = -(frameNow / 32);
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(destination.x, destination.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "rgba(224,242,254,0.9)";
  ctx.beginPath();
  ctx.arc(destination.x, destination.y, 27 + pulse * 4, -Math.PI * 0.16, Math.PI * 0.36);
  ctx.arc(destination.x, destination.y, 27 + pulse * 4, Math.PI * 0.84, Math.PI * 1.36);
  ctx.stroke();
  ctx.restore();
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

function nearestGroundItem(data = state.data) {
  const self = selfPlayer();
  if (!data || !self || data.phase !== "playing" || !self.alive || self.ejected || self.inVent) return null;
  return (Array.isArray(data.groundItems) ? data.groundItems : [])
    .map((groundItem) => ({ ...groundItem, dist: dist(self, groundItem) }))
    .filter((groundItem) => groundItem.dist <= Math.max(1, Number(groundItem.pickupRange) || 92))
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
      drawGroundItems(data);
      drawFacilityEffects(data);
      drawBodies(data);
      drawWorldSoundEffects();
      drawJumpPreparationEffect(data);
      drawThrowLandingPreview(data);
      drawStandaloneClairvoyanceAte(data);
      drawPlayers(data);
      drawGunnerAim(data);
      drawKillCameraWorldMarkers(data);
      drawHitEffects();
      drawMagicEffects();
      drawAttackTargets(data);
    } finally {
      ctx.restore();
    }
  });

  drawCanvasStage("task-indicators", () => drawTaskEdgeIndicators(data, camera, w, h, worldZoom));
  drawCanvasStage("repair-indicators", () => drawSabotageRepairIndicators(data, camera, w, h, worldZoom));
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

function worldZoomFor(data = state.data) {
  if (!data) return CAMERA_ZOOM;
  if (throwTargetClairvoyanceActive(data) || state.clairvoyance.active) return CLAIRVOYANCE_ZOOM;
  if (state.cameraViewIndex >= 0) return CAMERA_ZOOM;
  return CAMERA_ZOOM;
}

function throwTargetClairvoyanceActive(data = state.data) {
  if (!state.throwTargeting.active || !data?.map || Number(data.self?.mana) <= 0) return false;
  const self = data.players?.find((player) => player.id === data.selfId);
  if (!self) return false;
  const origin = renderedPlayer(self);
  const halfWidth = Math.max(120, els.canvas.width / CAMERA_ZOOM / 2 - 72);
  const halfHeight = Math.max(120, els.canvas.height / CAMERA_ZOOM / 2 - 72);
  return Math.abs(state.throwTargeting.targetX - origin.x) > halfWidth ||
    Math.abs(state.throwTargeting.targetY - origin.y) > halfHeight;
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
      ? `忍殺静止中: ${target?.name || "対象"} / 残り ${(remaining / 1000).toFixed(1)}秒`
      : `${data.self.special === "assassin" ? "忍殺消滅" : "忍殺撃破"}処理中: ${target?.name || "対象"}`;
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
  const killCamera = activeKillCameraRecord(data);
  const killCameraTarget = killCamera
    ? {
        x: (Number(killCamera.victimX) + Number(killCamera.killerX)) / 2,
        y: (Number(killCamera.victimY) + Number(killCamera.killerY)) / 2
      }
    : null;
  const selectedCamera = currentCamera(data);
  const throwTarget = state.throwTargeting.active
    ? { x: state.throwTargeting.targetX, y: state.throwTargeting.targetY }
    : null;
  const clairvoyanceTarget = !throwTarget && state.clairvoyance.active
    ? { x: state.clairvoyance.x, y: state.clairvoyance.y }
    : null;
  const target = killCameraTarget || throwTarget || clairvoyanceTarget || selectedCamera || (self ? renderedPlayer(self) : { x: data.map.width / 2, y: data.map.height / 2 });
  const viewW = w / zoom;
  const viewH = h / zoom;
  const desiredX = clamp(target.x - viewW / 2, 0, Math.max(0, data.map.width - viewW));
  const desiredY = clamp(target.y - viewH / 2, 0, Math.max(0, data.map.height - viewH));
  const mode = killCameraTarget
    ? `kill-camera:${killCamera.id}:${zoom}`
    : throwTarget
    ? `throw-target:${throwTargetClairvoyanceActive(data) ? "clairvoyance" : "follow"}:${zoom}`
    : clairvoyanceTarget
      ? `clairvoyance:${zoom}`
      : selectedCamera
      ? `camera:${selectedCamera.id}`
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

// Sparse drifting leaves add a third, independent environmental cadence to the
// authored plant sway and canopy shadows. The particles reuse masked foliage
// from each accepted map composite instead of a generic code-drawn leaf.
const MAP_DRIFTING_LEAF_AREA_IDS = Object.freeze({
  station: new Set([
    "archive", "atrium", "greenhouse", "cafeteria", "medical",
    "a02", "a05", "a08", "a12", "a13", "a17", "a18"
  ]),
  outpost: new Set([
    "hub", "greenhouse", "south-gallery", "east-botanical"
  ])
});

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

function deterministicLeafUnit(seed, index, salt = 0) {
  const value = Math.sin(seed * 12.9898 + index * 78.233 + salt * 37.719) * 43758.5453;
  return value - Math.floor(value);
}

function drawDriftingMapLeaves(data, area, time, intensity = 1) {
  const areaIds = MAP_DRIFTING_LEAF_AREA_IDS[data.map.id];
  if (!areaIds?.has(area.id)) return false;
  const layer = mapPlantLayer(data, area);
  if (!layer?.clusters?.length) return false;

  const seed = [...`${data.map.id}:${area.id}`]
    .reduce((value, character) => value + character.charCodeAt(0), 0);
  const particleCount = Math.max(3, Math.min(7, Math.round(Math.sqrt(area.w * area.h) / 120)));
  const horizontalDirection = data.map.id === "outpost" ? -1 : 1;
  const sampledTime = Math.floor(time * 60) / 60;

  ctx.save();
  ctx.beginPath();
  appendWorldAreaPath(area);
  ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = IMAGE_SMOOTHING_QUALITY;
  ctx.globalCompositeOperation = "source-over";

  for (let index = 0; index < particleCount; index += 1) {
    const speed = 0.018 + deterministicLeafUnit(seed, index, 1) * 0.014;
    const progress = (sampledTime * speed + deterministicLeafUnit(seed, index, 2)) % 1;
    const startX = deterministicLeafUnit(seed, index, 3);
    const startY = deterministicLeafUnit(seed, index, 4) * 0.42;
    const horizontal = (startX + horizontalDirection * progress * 0.84 + 2) % 1;
    const flutter = Math.sin(sampledTime * (1.05 + index * 0.09) + seed * 0.031 + index * 1.7);
    const x = area.x + horizontal * area.w;
    const y = area.y + ((startY + progress * 0.67 + flutter * 0.035 + 2) % 1) * area.h;
    const cluster = layer.clusters[(seed + index * 5) % layer.clusters.length];
    const longestSide = clamp(
      Math.min(area.w, area.h) * (0.016 + deterministicLeafUnit(seed, index, 5) * 0.008),
      5.5,
      12.5
    );
    const aspect = clamp(cluster.w / Math.max(1, cluster.h), 0.62, 1.55);
    const drawWidth = aspect >= 1 ? longestSide : longestSide * aspect;
    const drawHeight = aspect >= 1 ? longestSide / aspect : longestSide;
    const rotation = flutter * 0.58 + progress * Math.PI * (2.4 + (index % 3) * 0.7);
    const fade = Math.sin(Math.PI * progress) ** 0.7;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = fade * (0.42 + deterministicLeafUnit(seed, index, 6) * 0.22) * intensity;
    ctx.drawImage(
      layer.canvas,
      cluster.x,
      cluster.y,
      cluster.w,
      cluster.h,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );
    ctx.restore();

    // A restrained luminance catch is the complementary E layer; it never
    // redraws the foliage texture or becomes a second leaf silhouette.
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = fade * 0.12 * intensity;
    ctx.fillStyle = "#f5e7a6";
    ctx.beginPath();
    ctx.ellipse(x - horizontalDirection * 0.8, y - 0.7, 1.15, 0.55, rotation, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }
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
    drawDriftingMapLeaves(data, room, time, room.id === "greenhouse" ? 1.06 : 0.88);
    if (footBathRoomIds.has(room.id)) drawFootBathRoomKomorebi(data, room, time);
    else {
      const strength = komorebiStrength[room.id];
      if (strength) drawKomorebiRoom(data, room, time, strength);
    }
  }
  for (const corridor of visibleCorridors.flatMap((entry) => corridorRenderSegments(entry))) {
    drawMapPlantWind(data, corridor, time, 0.82);
    drawDriftingMapLeaves(data, corridor, time, 0.76);
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
    const radius = Number(zone.radius || 220);
    const phase = (state.frameNow || performance.now()) / 420;
    const stormVisible = worldPointVisible(zone.x, zone.y, radius + 100);
    if (stormVisible) {
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
      const barrierUntil = Number(zone.barrierUntil || (Number(zone.endsAt) - 1000));
      ctx.fillStyle = "#f5f3ff";
      ctx.font = "900 11px Segoe UI, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        `${now < barrierUntil ? "全域吸引" : "最終1秒・バリアなし"} ${Math.ceil(Math.max(0, zone.endsAt - now) / 1000)}秒`,
        0,
        radius + 20
      );
      ctx.restore();
    }
    const barrierUntil = Number(zone.barrierUntil || (Number(zone.endsAt) - 1000));
    if (safeEyeTexture && now < barrierUntil) {
      const safeRadius = Number(zone.barrierRadius || 140);
      const safeX = Number.isFinite(Number(zone.safeX)) ? Number(zone.safeX) : zone.x;
      const safeY = Number.isFinite(Number(zone.safeY)) ? Number(zone.safeY) : zone.y;
      if (!worldPointVisible(safeX, safeY, safeRadius + 70)) continue;
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
    }
    const propCell = station.type === "emergency" ? 5 : 0;
    const propWidth = station.type === "emergency" ? 82 : 74;
    const propHeight = station.type === "emergency" ? 64 : 70;
    const integrated = Boolean(roomCompositeForPoint(data, station.room, station));
    const textured = integrated
      ? true
      : drawGeneratedPropCell(facilityProps, propCell, station.x, station.y, propWidth, propHeight, activeTask ? 1 : 0.9);
    if (!textured && station.type !== "vending") {
      if (station.type !== "task") {
        ctx.fillStyle = color;
        ctx.strokeStyle = activeTask ? "#e0fbff" : "rgba(255,255,255,0.42)";
        ctx.lineWidth = activeTask ? 4 : 2;
        ctx.beginPath();
        ctx.arc(station.x, station.y, activeTask ? 20 : 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
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

const GROUND_FIREARM_ICON_CELLS = Object.freeze({ handgun: 0, smg: 1, assault: 2, sniper: 3 });

function drawGroundItemTexture(groundItem) {
  const asset = String(groundItem.asset || "");
  const kind = String(groundItem.kind || "");
  const atlasCell = GROUND_FIREARM_ICON_CELLS[asset];
  if (Number.isInteger(atlasCell)) {
    const atlas = state.textures?.groundFirearmIcons;
    if (atlas?.complete && atlas.naturalWidth > 0) {
      const cellWidth = atlas.naturalWidth / 4;
      ctx.drawImage(atlas, atlasCell * cellWidth, 0, cellWidth, atlas.naturalHeight, -34, -17, 68, 34);
      return true;
    }
  }
  const image = state.textures?.groundItemTextures?.[asset];
  if (image?.complete && image.naturalWidth > 0) {
    const width = kind === "sword" ? 76 : kind === "heavy" ? 72 : kind === "invention" ? 68 : 56;
    const height = kind === "sword" ? 42 : kind === "heavy" ? 42 : kind === "invention" ? 48 : 38;
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
    return true;
  }
  return false;
}

function drawGroundItems(data) {
  const groundItems = Array.isArray(data.groundItems) ? data.groundItems : [];
  if (!groundItems.length) return;
  const nearest = nearestGroundItem(data);
  for (const groundItem of groundItems) {
    const x = Number(groundItem.x) || 0;
    const y = Number(groundItem.y) || 0;
    const angle = Number(groundItem.angle) || 0;
    const selected = nearest?.id === groundItem.id;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(7, 15, 27, .35)";
    ctx.beginPath();
    ctx.ellipse(0, 9, 35, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.rotate(angle * 0.18);
    if (selected) {
      ctx.shadowColor = "rgba(103, 232, 249, .92)";
      ctx.shadowBlur = 18;
    }
    if (!drawGroundItemTexture(groundItem)) {
      ctx.fillStyle = selected ? "#a5f3fc" : "#cbd5e1";
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2;
      ctx.fillRect(-25, -9, 50, 18);
      ctx.strokeRect(-25, -9, 50, 18);
    }
    ctx.restore();

    if (selected) {
      ctx.save();
      ctx.font = "800 13px Segoe UI, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(8, 15, 27, .88)";
      ctx.fillStyle = "#ecfeff";
      const label = `E 拾う ${groundItem.label || "アイテム"}`;
      ctx.strokeText(label, x, y - 28);
      ctx.fillText(label, x, y - 28);
      ctx.restore();
    }
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

function drawGunnerSpecialAmmoEffect(effect, progress) {
  if (!["action-special-ammo-load", "action-special-ammo-shot", "action-special-ammo-impact"].includes(effect.type)) return false;
  const type = String(effect.variant || "").split(":")[0];
  const texture = state.textures.gunnerSpecialAmmoEffects?.[type];
  const prepared = texture ? transparentSpriteSource(texture, `gunner-special-ammo-${type}`, 14) : null;
  const sprite = prepared ? normalizedSpriteFrame(prepared, `gunner-special-ammo-${type}`, 1, 1, 0, 0) : null;
  if (!sprite) return false;

  const time = (state.frameNow || performance.now()) / 1000;
  const pulse = Math.sin(progress * Math.PI);
  const targetX = Number.isFinite(Number(effect.targetX)) ? Number(effect.targetX) : Number(effect.x) || 0;
  const targetY = Number.isFinite(Number(effect.targetY)) ? Number(effect.targetY) : Number(effect.y) || 0;
  let x = Number(effect.x) || 0;
  let y = Number(effect.y) || 0;
  let rotation = 0;
  let width = effect.type === "action-special-ammo-load" ? 245 : 205;
  let height = effect.type === "action-special-ammo-load" ? 150 : 118;
  let mode = type === "weak" ? "resonance" : "glitch";
  let alpha = Math.max(0.1, 1 - progress * 0.82);

  if (effect.type === "action-special-ammo-shot") {
    const dx = targetX - x;
    const dy = targetY - y;
    const distance = Math.hypot(dx, dy) || 1;
    const nx = dx / distance;
    const ny = dy / distance;
    const travel = type === "shock" ? progress : progress * progress * (3 - 2 * progress);
    const phaseOffset = type === "shock" ? Math.sin(progress * Math.PI * 18) * (1 - progress) * 7 : 0;
    x += dx * travel - ny * phaseOffset;
    y += dy * travel + nx * phaseOffset;
    rotation = Math.atan2(dy, dx);
    width = type === "shock" ? 205 : 220;
    height = 120;
    alpha = Math.max(0.2, 1 - progress * 0.5);
  } else if (effect.type === "action-special-ammo-load") {
    y -= 34;
    if (type === "weak") {
      width *= 0.84 + pulse * 0.22;
      height *= 1.08 - pulse * 0.1;
    } else {
      x += Math.sin(progress * Math.PI * 14) * (1 - progress) * 8;
      y += Math.cos(progress * Math.PI * 11) * (1 - progress) * 4;
      width *= 0.9 + pulse * 0.12;
    }
  } else {
    if (type === "weak") {
      width = 250 * (0.82 + pulse * 0.38);
      height = 145 * (1.08 - pulse * 0.16);
    } else {
      x += Math.sin(progress * Math.PI * 22) * (1 - progress) * 9;
      y += Math.cos(progress * Math.PI * 17) * (1 - progress) * 5;
      width = 225 * (0.88 + pulse * 0.2);
      height = 135 * (0.92 + pulse * 0.16);
    }
  }

  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(rotation);
  ctx.globalCompositeOperation = "lighter";
  const eGradient = ctx.createRadialGradient(0, 0, 2, 0, 0, Math.max(width, height) * 0.58);
  if (type === "weak") {
    eGradient.addColorStop(0, `rgba(255, 226, 250, ${0.2 + pulse * 0.1})`);
    eGradient.addColorStop(0.36, `rgba(187, 31, 91, ${0.14 + pulse * 0.08})`);
    eGradient.addColorStop(1, "rgba(95, 5, 42, 0)");
  } else {
    eGradient.addColorStop(0, `rgba(229, 252, 255, ${0.24 + pulse * 0.14})`);
    eGradient.addColorStop(0.4, `rgba(35, 174, 255, ${0.15 + pulse * 0.1})`);
    eGradient.addColorStop(1, "rgba(22, 64, 170, 0)");
  }
  ctx.globalAlpha = alpha * 0.72;
  ctx.fillStyle = eGradient;
  ctx.fillRect(-width * 0.62, -height * 0.72, width * 1.24, height * 1.44);
  ctx.globalAlpha = alpha;
  drawAnimatedTextureCentered(sprite, 0, 0, width, height, {
    mode,
    time,
    progress,
    phase: type === "weak" ? 0.12 : 0.78,
    intensity: 0.96,
    baseAlpha: 0.26,
    opacityBoost: 3.4
  });
  ctx.restore();
  return true;
}

function drawMagicEffects() {
  if (!["playing", "meeting"].includes(state.data?.phase)) {
    state.magicEffects = [];
    return;
  }
  const now = state.frameNow || performance.now();
  state.magicEffects = state.magicEffects.filter((effect) => now - effect.startedAt < effect.duration);
  const activeGainEffects = state.magicEffects.filter((effect) => isSharedHeadMarkerEffect(effect));
  for (const player of state.data?.players || []) {
    const previousSlot = state.headMarkerSlots.get(player.id) || null;
    const presentation = selectHeadMarkerPresentation(
      player,
      state.data,
      headMarkerEffectsForPlayer(player, state.data),
      now,
      previousSlot
    );
    rememberHeadMarkerPresentation(player.id, presentation, now);
  }
  const renderedNonCreditHeadMarkerInstances = new Set();
  for (const effect of state.magicEffects) {
    const progress = clamp((now - effect.startedAt) / effect.duration, 0, 1);
    if (effect.type.startsWith("gain-")) {
      if (!isCreditHeadMarkerEffect(effect)) {
        const player = gainEffectPlayer(effect);
        const presentation = player ? headMarkerPresentationForPlayer(player, state.data, now) : null;
        const sourceEffect = canonicalNonCreditHeadMarkerSource(
          effect,
          presentation,
          renderedNonCreditHeadMarkerInstances
        );
        if (!sourceEffect) continue;
        const sourceProgress = clamp((now - sourceEffect.startedAt) / sourceEffect.duration, 0, 1);
        drawGainAcquisitionEffect(sourceEffect, sourceProgress, now);
        continue;
      }
      const peerEffects = activeGainEffects.filter((entry) => entry.playerId === effect.playerId);
      drawGainAcquisitionEffect(effect, progress, now, peerEffects.indexOf(effect), peerEffects.length);
      continue;
    }
    // A persistent head marker is the sole field presentation for grants that
    // already own one. Do not also flash the same semantic texture at ordinary
    // action size over the character or focus point.
    if (effect.type === "fighter-energy-charge") {
      const player = gainEffectPlayer(effect);
      const presentation = player ? headMarkerPresentationForPlayer(player, state.data, now) : null;
      const sourceEffect = canonicalNonCreditHeadMarkerSource(
        effect,
        presentation,
        renderedNonCreditHeadMarkerInstances
      );
      if (!sourceEffect) continue;
      const sourceProgress = clamp((now - sourceEffect.startedAt) / sourceEffect.duration, 0, 1);
      {
        const effect = sourceEffect;
        const progress = sourceProgress;
        recordVerificationMarkerRender(effect, "head-marker", now);
        drawFighterEnergyChargeMarker(effect, progress, now);
      }
      continue;
    }
    if (MARKER_OWNED_EFFECT_TYPES.has(effect.type)) continue;
    // Map-object activation already communicates its awarded categories through
    // the persistent head markers. When both arrive in the same state sample,
    // keep those readable markers and skip only the redundant full-size object
    // presentation for the same recipient. Combat, hazards and transmutation
    // remain independent even when they happen nearby.
    const concurrentGainMarker = effect.type.startsWith("object-") && activeGainEffects.some((entry) => (
      entry.playerId === effect.playerId && Math.abs(entry.startedAt - effect.startedAt) <= 80
    ));
    if (concurrentGainMarker) continue;
    if (drawGunnerSpecialAmmoEffect(effect, progress)) continue;
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
    if (effect.type === "flora-invisible") drawFloraInvisibleGeneratedEffect(effect, progress);
    if (effect.type === "alchemy-railgun" || effect.type === "alchemy-particle-beam") drawDirectedEnergyEffect(effect, progress, now);
    if (effect.type.startsWith("gravity-storm-")) drawGravityStormImpactEffect(effect, progress);
    if (effect.type === "emp" || effect.type.startsWith("emp-")) drawEmpEffect(effect, progress, now);
    if (effect.type.startsWith("status-") || effect.type.startsWith("hazard-")) drawStatusAndHazardEffect(effect, progress);
    if (effect.type === "mystery-reveal") drawPhilosophyAtlasEffect(effect, 10, progress, 170);
    if (effect.type.startsWith("action-") || effect.type === "gunner-passive-aim") drawActionEffect(effect, progress, now);
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
  const distance = 120 + elapsed * 2.7;
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
    const label = landing.valid
      ? "接地点 / 離して確定 / Escでキャンセル"
      : "着地不可 / 移動またはEscでキャンセル";
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
  const now = (state.frameNow || performance.now()) / 1000;
  ctx.globalCompositeOperation = "lighter";
  if (railgun) {
    const shock = objectEffectEase(clamp(progress / 0.42, 0, 1));
    for (let index = 0; index < 11; index += 1) {
      const along = ((index + 0.5) / 11) * length;
      const spread = (1 - shock) * (18 + (index % 3) * 9);
      ctx.globalAlpha = (1 - progress) * (0.24 + (index % 4) * 0.055);
      ctx.fillStyle = index % 3 === 0 ? "#fff4cf" : "#8be9ff";
      ctx.fillRect(along, (index % 2 ? -1 : 1) * spread, 12 + (index % 4) * 8, 1.4 + (index % 2));
    }
  } else {
    for (let index = 0; index < 18; index += 1) {
      const along = ((index / 18 + progress * 0.48) % 1) * length;
      const helix = Math.sin(index * 1.73 + now * 9.2) * renderHeight * 0.26 * (1 - progress * 0.35);
      const size = 1.4 + (index % 4) * 0.75;
      ctx.globalAlpha = Math.max(0, 1 - progress) * (0.28 + (index % 5) * 0.06);
      ctx.fillStyle = index % 2 ? "#e5b7ff" : "#7df4ff";
      ctx.save();
      ctx.translate(along, helix);
      ctx.rotate(Math.PI / 4 + now * 0.7);
      ctx.fillRect(-size, -size, size * 2, size * 2);
      ctx.restore();
    }
  }
  ctx.restore();
  return true;
}

const MARKER_OWNED_EFFECT_TYPES = new Set([
  "instant-stand-firm-acquired",
  "instant-push-acquired",
  "instant-iai-acquired",
  "instant-speed-acquired",
  "fighter-push-acquired",
  "resolve-focus"
]);

const GENERATED_EFFECT_TEXTURES = {
  "fire": ["fireJutsuFieldEffect", 520],
  "substitution": ["substitutionFieldEffect", 300],
  "limit-break": ["limitBreakFieldEffect", 360],
  "fighter-energy-charge": ["fighterEnergyChargeEffect", 220],
  "instant-iai-acquired": ["itemIaiTexture", 230],
  "iai-destruction-attack": ["itemIaiTexture", 270],
  "instant-stand-firm-acquired": ["instantStandFirmTexture", 230],
  "instant-push-acquired": ["instantPushTexture", 230],
  "instant-stamina-acquired": ["instantStaminaTexture", 230],
  "instant-heal-acquired": ["instantHealTexture", 230],
  "instant-fire-acquired": ["instantFireTexture", 240],
  "instant-substitution-acquired": ["instantSubstitutionTexture", 230],
  "teleport-map-scroll-acquired": ["teleportMapScrollAcquisitionTexture", 250],
  "instant-evade-acquired": ["instantEvadeTexture", 240],
  "instant-speed-acquired": ["instantSpeedTexture", 210],
  "instant-mystery-acquired": ["instantMysteryTexture", 240],
  "instant-mana-acquired": ["instantManaTexture", 240],
  "instant-hack-acquired": ["hackerRootMatrix", 190],
  "fighter-energy-destruction-milestone": ["fighterDestructionSlashMilestoneEffect", 290],
  "fighter-energy-destruction-slash": ["fighterDestructionSlashMilestoneEffect", 260],
  "fighter-energy-release": ["fighterEnergyReleaseEffect", 180],
  "fighter-energy-impact": ["fighterEnergyImpactEffect", 250],
  "fighter-shockwave": ["fighterShockwaveEffect", 180],
  "fighter-push-acquired": ["pushMarkerEffect", 96],
  "hacker-root": ["hackerRootMatrix", 190],
  "natural-recovery": ["naturalRecoveryEffect", 230],
  "gbo-overdrive": ["gboOverdriveEffect", 300],
  "gravity-time-keeper": ["gravityTimeKeeperEffect", 260],
  "preparation-barrier-hit": ["preparationBarrierEffect", 220],
  "alchemy-human-transmutation": ["humanTransmutationEffect", 260],
  "alchemy-excalibur": ["alchemyExcaliburEffect", 520],
  "action-vibe-coding": ["vibeCodingEffect", 220],
  "item-hsg-activate": ["hsgItemTexture", 240],
  "action-gunner-aim-headshot": ["gunnerWeaponsAtlas", 210],
  "action-gunner-headshot": ["gunnerWeaponsAtlas", 210],
  "gunner-rpg": ["gunnerRpgEffect", 280],
  "gunner-missile": ["gunnerMissileEffect", 250],
  "quantum-transmutation": ["quantumTransmutationEffect", 260],
  "quantum-temperature-cold": ["quantumColdEffect", 240],
  "quantum-temperature-hot": ["quantumHotEffect", 240],
  "quantum-ice-impact": ["quantumColdEffect", 280],
  "quantum-nuclear": ["quantumNuclearEffect", 760],
  "quantum-nuclear-fusion": ["quantumNuclearFusion", 760],
  "quantum-electric-discharge": ["quantumElectricDischarge", 340],
  "hazard-antidote": ["hazardWaterEffect", 250],
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
  if (/emp|taser|shock|vibe|hack|pair-route|smartphone|gbo|overdrive/.test(token)) return "glitch";
  if (/teleport|warp|substitution|transfer/.test(token)) return "teleport";
  if (/fire|burn|hot|nuclear|rpg|missile/.test(token)) return "combustion";
  if (/railgun|particle|sunbeam|excalibur|slash|shoot|beam/.test(token)) return "beam";
  if (/reload|sustained-fire/.test(token)) return "recoil";
  if (/grit|stand|shield|overheal|beauty/.test(token)) return "shield";
  if (/mana|water|antidote|heal|flora|recovery|cold|ice/.test(token)) return "ripple";
  if (/credits|luck|mystery|transmutation|invention/.test(token)) return "orbit";
  if (/jump|hover|limit-break|speed|acceleration|power/.test(token)) return "flow-up";
  if (/aim|weak|scope|reason|truth/.test(token)) return "shimmer";
  if (/push|impact|storm|violation/.test(token)) return "impact";
  return fallback;
}

function drawGoldTransmutationStages(goldSprite, progress) {
  const reveal = clamp((progress - 0.08) / 0.2, 0, 1);
  const settle = objectEffectEase(clamp((progress - 0.24) / 0.28, 0, 1));
  const fade = 1 - objectEffectEase(clamp((progress - 0.84) / 0.16, 0, 1));
  const smoothReveal = reveal * reveal * (3 - 2 * reveal);
  const ingotWidth = 82;
  const ingotHeight = 29;

  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = smoothReveal * fade;
  drawNormalizedSpriteCentered(
    goldSprite,
    0,
    -42 - (1 - settle) * 30,
    ingotWidth * (0.84 + settle * 0.16),
    ingotHeight * (0.84 + settle * 0.16)
  );
}

function drawGeneratedStandaloneEffect(effect, progress) {
  if (effect?.type === "quantum-electric-discharge" && IS_VERIFICATION_MODE) {
    document.documentElement.setAttribute("data-v554-quantum-electric-rendered", "true");
  }
  if (effect?.type === "fighter-energy-charge") {
    recordVerificationMarkerRender(effect, "ordinary-ec", state.frameNow || performance.now());
  } else if (effect?.type === "action-dodge" && effect?.variant === "fixture-positive-control") {
    recordVerificationMarkerRender(effect, "ordinary-control", state.frameNow || performance.now());
  }
  const definition = effect.type === "limit-break" && effect.variant === "release"
    ? ["limitBreakReleaseEffect", 320]
    : GENERATED_EFFECT_TEXTURES[effect.type];
  if (!definition) return false;
  const [textureKey, defaultSize] = definition;
  const prepared = transparentSpriteSource(state.textures[textureKey], textureKey, 18);
  const sprite = prepared ? normalizedSpriteFrame(prepared, textureKey, 1, 1, 0, 0) : null;
  if (!sprite) return false;
  if (effect.type === "gravity-time-keeper") {
    const arrive = objectEffectEase(clamp(progress / 0.12, 0, 1));
    const fade = 1 - objectEffectEase(clamp((progress - 0.84) / 0.16, 0, 1));
    const size = Math.max(defaultSize, Number(effect.radius || 0) * 2.05);
    ctx.save();
    ctx.translate(effect.x, effect.y);
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = fade * (0.45 + arrive * 0.5);
    drawAnimatedTextureBottom(sprite, 0, size / 2, size, size, {
      mode: "hold",
      progress: 0.5,
      intensity: 0.86,
      baseAlpha: 0.12
    });
    // Complementary E: sparse particles remain spatially fixed for the whole
    // stop. They support the frozen-state read without redrawing the clockwork.
    const fixedMotes = [[-0.36, -0.28], [0.31, -0.34], [-0.42, 0.08], [0.39, 0.16], [-0.2, 0.39], [0.23, 0.33]];
    fixedMotes.forEach(([px, py], index) => {
      ctx.globalAlpha = fade * (0.28 + (index % 3) * 0.11);
      ctx.fillStyle = index % 2 ? "#f9d985" : "#bdf7ff";
      ctx.fillRect(px * size - 2, py * size - 2, 4, 4);
    });
    ctx.restore();
    return true;
  }
  if (effect.type.startsWith("instant-") && effect.type.endsWith("-acquired")) {
    return drawInstantItemAcquisitionEffect(effect, progress, sprite, defaultSize);
  }
  if (effect.type === "transfer-out" || effect.type === "transfer-in") {
    return drawTransferGeneratedEffect(effect, progress, sprite, defaultSize);
  }
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  const radiusSize = Number(effect.radius) > 0 ? Number(effect.radius) * 1.9 : defaultSize;
  const size = Math.min(["quantum-nuclear", "quantum-nuclear-fusion"].includes(effect.type) ? 1500 : 520, Math.max(defaultSize, radiusSize)) *
    (0.82 + pulse * 0.28 + progress * 0.14);
  const targetX = Number.isFinite(effect.targetX) ? effect.targetX : effect.x;
  const targetY = Number.isFinite(effect.targetY) ? effect.targetY : effect.y;
  const directed = ["gunner-missile", "alchemy-excalibur", "action-jump", "fighter-shockwave", "fighter-energy-release", "quantum-electric-discharge"].includes(effect.type) && (targetX !== effect.x || targetY !== effect.y);
  const goldTransmutation = effect.type === "quantum-transmutation";
  const renderHeight = goldTransmutation
    ? Math.max(72, size * 0.28)
    : ["fighter-shockwave", "fighter-energy-release"].includes(effect.type)
    ? Math.max(120, Number(effect.radius || 0) * 2.2)
    : size;
  const renderWidth = goldTransmutation ? renderHeight * (510 / 141) : size;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = Math.max(0.08, 1 - progress * 0.84);
  ctx.translate(directed ? (effect.x + targetX) / 2 : effect.x, directed ? (effect.y + targetY) / 2 : effect.y);
  if (directed) {
    const sourceAxisOffset = effect.type === "alchemy-excalibur"
      ? Math.PI / 4
      : effect.type === "quantum-electric-discharge"
        ? -Math.PI / 4
        : 0;
    ctx.rotate(Math.atan2(targetY - effect.y, targetX - effect.x) - sourceAxisOffset);
  }
  drawAnimatedTextureBottom(
    sprite,
    0,
    goldTransmutation ? 30 : renderHeight / 2,
    directed ? Math.max(size, Math.hypot(targetX - effect.x, targetY - effect.y)) : renderWidth,
    renderHeight,
    { mode: directed ? "beam" : semanticEffectMotion(effect.type, effect.variant), progress, intensity: 0.94, baseAlpha: 0.16 }
  );
  if (effect.type === "alchemy-excalibur") {
    const edge = Math.sin(clamp(progress / 0.74, 0, 1) * Math.PI);
    ctx.globalCompositeOperation = "lighter";
    for (let index = 0; index < 14; index += 1) {
      const sweep = clamp((progress - index * 0.018) / 0.58, 0, 1);
      const angle = -0.62 + sweep * 1.24 + (index - 7) * 0.018;
      const radius = size * (0.26 + (index % 5) * 0.035);
      ctx.globalAlpha = edge * (1 - sweep * 0.55) * (0.18 + (index % 4) * 0.06);
      ctx.fillStyle = index % 3 === 0 ? "#ffe6a3" : "#baf6ff";
      ctx.save();
      ctx.rotate(angle);
      ctx.fillRect(radius, -1.2, 18 + (index % 4) * 7, 2.4);
      ctx.restore();
    }
  }
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

function drawInstantItemAcquisitionEffect(effect, progress, sprite, defaultSize) {
  const fade = 1 - objectEffectEase(clamp((progress - 0.68) / 0.32, 0, 1));
  const targetX = Number(effect.x) || 0;
  const targetY = Number(effect.y) || 0;
  const kind = effect.type.replace(/^instant-/, "").replace(/-acquired$/, "");
  if (!["iai", "stand-firm", "push"].includes(kind)) {
    return drawUtilityInstantItemAcquisitionEffect(effect, progress, sprite, defaultSize, kind);
  }
  ctx.save();
  ctx.translate(targetX, targetY);

  if (kind === "iai") {
    const arrival = objectEffectEase(clamp(progress / 0.18, 0, 1));
    const release = objectEffectEase(clamp((progress - 0.12) / 0.34, 0, 1));
    ctx.rotate(-0.68 + (1 - arrival) * 0.17);
    ctx.translate((1 - arrival) * -84 + release * 12, (1 - arrival) * 35 - release * 6);
    ctx.scale(0.72 + arrival * 0.3 + release * 0.08, 0.6 + arrival * 0.4 - release * 0.08);
    ctx.globalAlpha = fade * (0.22 + arrival * 0.78);
    drawAnimatedTextureCentered(sprite, 0, 0, defaultSize, defaultSize, {
      mode: "beam",
      progress: release,
      intensity: 0.94,
      baseAlpha: 0.12
    });
    ctx.globalCompositeOperation = "lighter";
    for (let index = 0; index < 5; index += 1) {
      const travel = clamp((progress - index * 0.035) / 0.58, 0, 1);
      ctx.globalAlpha = fade * (1 - travel) * (0.28 + index * 0.035);
      ctx.fillStyle = index % 2 ? "#a76dff" : "#8de9ff";
      ctx.beginPath();
      ctx.ellipse(-92 + travel * 154, 52 + index * 7 - travel * 32, 2.2, 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === "stand-firm") {
    const rise = objectEffectEase(clamp(progress / 0.28, 0, 1));
    const compression = Math.sin(clamp((progress - 0.12) / 0.54, 0, 1) * Math.PI);
    const rebound = objectEffectEase(clamp((progress - 0.46) / 0.34, 0, 1));
    ctx.translate(0, (1 - rise) * 72 - rebound * 10);
    ctx.scale(0.82 + rise * 0.18 + rebound * 0.05, 0.56 + rise * 0.44 - compression * 0.12 + rebound * 0.08);
    ctx.globalAlpha = fade * (0.18 + rise * 0.82);
    drawAnimatedTextureCentered(sprite, 0, 0, defaultSize, defaultSize, {
      mode: "shield",
      progress,
      intensity: 0.9,
      baseAlpha: 0.14
    });
    ctx.globalCompositeOperation = "lighter";
    for (let index = 0; index < 7; index += 1) {
      const lift = clamp((progress - index * 0.04) / 0.7, 0, 1);
      const offsetX = ((index * 37) % 88) - 44;
      ctx.globalAlpha = fade * (1 - lift) * 0.34;
      ctx.fillStyle = index % 3 === 0 ? "#ffd78d" : "#9dfff1";
      ctx.beginPath();
      ctx.arc(offsetX, 78 - lift * (92 + index * 3), 1.2 + (index % 2) * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    const drive = objectEffectEase(clamp(progress / 0.3, 0, 1));
    const recoil = Math.sin(clamp(progress / 0.48, 0, 1) * Math.PI);
    ctx.translate((1 - drive) * -74 + drive * 18 - recoil * 14, 0);
    ctx.scale(0.64 + drive * 0.42 + recoil * 0.08, 0.84 + drive * 0.16 - recoil * 0.05);
    ctx.globalAlpha = fade * (0.2 + drive * 0.8);
    drawAnimatedTextureCentered(sprite, 0, 0, defaultSize, defaultSize, {
      mode: "impact",
      progress,
      intensity: 0.94,
      baseAlpha: 0.12
    });
    ctx.globalCompositeOperation = "lighter";
    for (let index = 0; index < 6; index += 1) {
      const wake = clamp((progress - index * 0.045) / 0.62, 0, 1);
      ctx.globalAlpha = fade * (1 - wake) * 0.32;
      ctx.fillStyle = index % 2 ? "#ffcb75" : "#ff795d";
      ctx.beginPath();
      ctx.ellipse(-108 + wake * 112, -28 + index * 11, 2.4, 1.1, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

function drawUtilityInstantItemAcquisitionEffect(effect, progress, sprite, defaultSize, kind) {
  const fade = 1 - objectEffectEase(clamp((progress - 0.72) / 0.28, 0, 1));
  const enter = objectEffectEase(clamp(progress / 0.3, 0, 1));
  const pulse = Math.sin(clamp(progress / 0.7, 0, 1) * Math.PI);
  const profiles = {
    stamina: { mode: "power", rotate: 1.2, dx: 0, dy: 42, sx: 0.5, sy: 0.5, color: "#ffe08a", mote: "orbit" },
    heal: { mode: "ripple", rotate: -0.12, dx: 0, dy: 58, sx: 0.76, sy: 0.45, color: "#9fffe9", mote: "converge" },
    fire: { mode: "combustion", rotate: 0.08, dx: 0, dy: 76, sx: 0.66, sy: 0.36, color: "#ff963f", mote: "rise" },
    substitution: { mode: "teleport", rotate: 1.55, dx: 34, dy: 0, sx: 0.22, sy: 0.9, color: "#d9a2ff", mote: "cross" },
    warp: { mode: "teleport", rotate: -0.65, dx: -64, dy: 38, sx: 0.42, sy: 0.42, color: "#8dc6ff", mote: "bridge" },
    evade: { mode: "recoil", rotate: 0.06, dx: 72, dy: 0, sx: 0.38, sy: 0.82, color: "#a787ff", mote: "lateral" },
    speed: { mode: "flow-up", rotate: 0, dx: 0, dy: 78, sx: 0.6, sy: 0.34, color: "#76f4ff", mote: "rise" },
    mystery: { mode: "orbit", rotate: 2.4, dx: 0, dy: 0, sx: 0.52, sy: 0.52, color: "#ffcf67", mote: "orbit" },
    mana: { mode: "ripple", rotate: -0.28, dx: -42, dy: 0, sx: 0.48, sy: 0.7, color: "#8ea7ff", mote: "wave" },
    hack: { mode: "glitch", rotate: 0.04, dx: 0, dy: 54, sx: 0.68, sy: 0.5, color: "#77f4ff", mote: "scan" }
  };
  const profile = profiles[kind] || profiles.mana;
  ctx.save();
  ctx.translate(Number(effect.x) || 0, Number(effect.y) || 0);
  const recoil = kind === "evade" ? Math.sin(progress * Math.PI * 2.5) * (1 - progress) * 18 : 0;
  const warpSnap = kind === "warp" ? Math.sin(clamp(progress / 0.54, 0, 1) * Math.PI) * 16 : 0;
  ctx.translate((1 - enter) * profile.dx + recoil + warpSnap, (1 - enter) * profile.dy - pulse * (kind === "fire" || kind === "speed" ? 18 : 6));
  ctx.rotate((1 - enter) * profile.rotate + (kind === "mystery" ? progress * 0.9 : 0));
  ctx.scale(profile.sx + enter * (1 - profile.sx) + pulse * 0.08, profile.sy + enter * (1 - profile.sy) + pulse * 0.06);
  ctx.globalAlpha = fade * (0.18 + enter * 0.82);
  drawAnimatedTextureCentered(sprite, 0, 0, defaultSize, defaultSize, {
    mode: profile.mode,
    progress,
    intensity: 0.92,
    baseAlpha: 0.12
  });
  ctx.restore();

  ctx.save();
  ctx.translate(Number(effect.x) || 0, Number(effect.y) || 0);
  ctx.globalCompositeOperation = "lighter";
  for (let index = 0; index < 7; index += 1) {
    const travel = clamp((progress - index * 0.035) / 0.72, 0, 1);
    let x = ((index * 43) % 96) - 48;
    let y = 58 - travel * 106;
    if (profile.mote === "converge") {
      x *= 1 - travel;
      y = -62 + travel * 62;
    } else if (profile.mote === "cross") {
      x = (index % 2 ? -1 : 1) * (74 - travel * 70);
      y = ((index * 29) % 76) - 38;
    } else if (profile.mote === "bridge") {
      x = -92 + travel * 184;
      y = (index - 3) * 7 + Math.sin(travel * Math.PI) * -22;
    } else if (profile.mote === "lateral") {
      x = (index % 2 ? -1 : 1) * (92 - travel * 34);
      y = (index - 3) * 13;
    } else if (profile.mote === "orbit") {
      const angle = travel * Math.PI * 2 + index * 0.9;
      x = Math.cos(angle) * (58 - travel * 24);
      y = Math.sin(angle) * (38 - travel * 14);
    } else if (profile.mote === "wave") {
      x = -86 + travel * 172;
      y = Math.sin(travel * Math.PI * 3 + index * 0.8) * 26;
    } else if (profile.mote === "scan") {
      x = -76 + travel * 152;
      y = (index - 3) * 10;
    }
    ctx.globalAlpha = fade * (1 - travel) * (0.24 + (index % 3) * 0.055);
    ctx.fillStyle = index % 3 === 0 ? "#ffffff" : profile.color;
    ctx.beginPath();
    ctx.ellipse(x, y, profile.mote === "lateral" ? 3.2 : 1.6, 1.1, 0, 0, Math.PI * 2);
    ctx.fill();
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
  const width = flora ? 34 : particle ? 42 : 18;
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
  "action-ninjutsu-focus": 7,
  "gunner-passive-aim": 7,
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

function gunnerWeaponIdFromActionVariant(variant, fallback = "") {
  const weaponId = String(variant || "")
    .split(":")
    .find((token) => GUNNER_WEAPON_MOTION_IDS.includes(token));
  if (weaponId) return weaponId;
  return GUNNER_WEAPON_MOTION_IDS.includes(fallback) ? fallback : "";
}

function drawGunnerActionEffect(effect, progress) {
  const stateEffect = effect.type === "action-shoot";
  if (!stateEffect) return false;
  const weaponId = gunnerWeaponIdFromActionVariant(effect.variant);
  if (!weaponId) return false;
  const index = GUNNER_WEAPON_CELLS[weaponId];
  const sourceIndex = 5 + index;
  const sprite = transparentSpriteSource(
    state.textures.gunnerCombatStateEffects?.[sourceIndex],
    `gunner-combat-state-${sourceIndex}`,
    24
  );
  if (!sprite) return false;
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  ctx.save();
  const firingEffect = effect.type === "action-shoot";
  ctx.globalCompositeOperation = firingEffect ? "lighter" : "source-over";
  ctx.globalAlpha = Math.max(0.06, 1 - progress * 0.88);
  if (effect.type === "action-shoot" && Number.isFinite(effect.targetX) && Number.isFinite(effect.targetY)) {
    const dx = effect.targetX - effect.x;
    const dy = effect.targetY - effect.y;
    const direction = cardinalDirectionVector(dx, dy);
    const unitX = direction.dx;
    const unitY = direction.dy;
    const muzzle = ({
      handgun: { forward: 29, height: -32 },
      smg: { forward: 37, height: -34 },
      assault: { forward: 43, height: -36 },
      sniper: { forward: 57, height: -37 },
      taser: { forward: 31, height: -32 }
    })[weaponId] || { forward: 35, height: -34 };
    const flashLength = ({ handgun: 42, smg: 48, assault: 56, sniper: 72, taser: 40 })[weaponId] || 46;
    const flashHeight = ({ handgun: 34, smg: 38, assault: 42, sniper: 48, taser: 34 })[weaponId] || 38;
    const horizontalShot = unitX !== 0;
    const bodyAnchorX = horizontalShot ? 0 : unitY < 0 ? 8 : -8;
    const bodyAnchorY = horizontalShot ? muzzle.height : unitY < 0 ? -43 : -10;
    const startX = effect.x + bodyAnchorX + unitX * muzzle.forward;
    const startY = effect.y + bodyAnchorY + unitY * muzzle.forward;
    ctx.translate(startX, startY);
    ctx.rotate(Math.atan2(unitY, unitX));
    drawAnimatedTextureCentered(sprite, flashLength / 2, 0, flashLength, flashHeight + pulse * 8, {
      mode: semanticEffectMotion(effect.type, effect.variant, "beam"), progress, intensity: 0.95, baseAlpha: 0.14
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

function drawHeartTeleportEffect(effect, progress) {
  const player = state.data?.players?.find((entry) => entry.id === effect.playerId);
  const source = state.textures.heartTeleportEffect;
  const sprite = source ? transparentSpriteSource(source, "heart-transfer-fist-glow-ate-v468", 18) : null;
  const position = player ? renderedPlayer(player) : { x: effect.x, y: effect.y };
  const facing = player
    ? facingFor(player, motionFor(player, state.data))
    : state.facing.get(effect.playerId) || "right";
  const direction = facing === "left" ? -1 : 1;
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  const fistX = position.x + direction * (22 + Math.min(1, progress * 2.4) * 7);
  const fistY = position.y - 31;
  const width = 94 + pulse * 24;
  const height = 72 + pulse * 18;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = Math.max(0.34, 1 - progress * 0.5);
  ctx.translate(fistX, fistY);
  ctx.scale(direction, 1);
  if (sprite) {
    drawAnimatedTextureCentered(sprite, 0, 0, width, height, {
      mode: "energy", progress, phase: 0.41, intensity: 1, baseAlpha: 0.24, opacityBoost: 2.7
    });
  }
  // E adds sparse detached sparks only; the raster owns the red fist glow.
  ctx.fillStyle = "rgba(255, 192, 203, 0.86)";
  for (let index = 0; index < 5; index += 1) {
    const phase = (progress * 1.8 + index / 5) % 1;
    const angle = -0.8 + index * 0.38;
    const travel = 14 + phase * 28;
    const moteSize = 1.8 + (1 - phase) * 2.2;
    ctx.save();
    ctx.translate(Math.cos(angle) * travel, Math.sin(angle) * travel * 0.52);
    ctx.rotate(angle + Math.PI / 4);
    ctx.globalAlpha = Math.max(0.06, (1 - phase) * (0.36 + pulse * 0.28));
    ctx.fillRect(-moteSize / 2, -moteSize / 2, moteSize, moteSize);
    ctx.restore();
  }
  ctx.restore();
  return true;
}

function drawActionEffect(effect, progress, now) {
  // Weapon switching and reloading are represented by their exact
  // weapon-specific character motions. Reusing the firearm-flash strip for
  // either state creates an unrelated line-like overlay.
  if (["action-weapon-switch", "action-reload"].includes(effect.type)) return;
  if (effect.type === "action-shoot" && drawGunnerActionEffect(effect, progress)) return;
  if (["action-fighter-dodge-counter", "fighter-slash", "fighter-slash-parry"].includes(effect.type) && drawFighterDodgeCounterEffect(effect, progress)) return;
  if (effect.type === "action-heart-teleport" && drawHeartTeleportEffect(effect, progress)) return;
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
    state.textures.empCancelEffect
  ];
  const keys = ["emp-resonance-v398", "emp-cancel-v311"];
  const source = sources[index];
  const sprite = source ? transparentSpriteSource(source, keys[index], 28) : null;
  if (!sprite) return false;
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  const size = rawSize * (1.05 + progress * 0.7 + pulse * 0.18);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = Math.max(0.12, 1 - progress * 0.78);
  drawAnimatedTextureBottom(sprite, effect.x, effect.y + size / 2, size, size, {
    mode: index === 0 ? "resonance" : "glitch",
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
  if (effect.type === "gravity-storm-barrier-hit") {
    const prepared = transparentSpriteSource(state.textures.gravityStormSafeEye, "gravity-storm-safe-eye-v320-hit", 18);
    if (!prepared) return false;
    const pulse = Math.sin(Math.min(1, progress) * Math.PI);
    const size = Math.max(170, Number(effect.radius || 140) * 2) * (0.88 + pulse * 0.24);
    ctx.save();
    ctx.translate(effect.x, effect.y);
    ctx.rotate(-progress * 0.18);
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = Math.max(0.08, 1 - progress * 0.86);
    drawAnimatedTextureCentered(prepared, 0, 0, size, size, {
      mode: "guard",
      progress,
      phase: 0.37,
      intensity: 0.96,
      baseAlpha: 0.18
    });
    ctx.restore();
    return true;
  }
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

function isCreditHeadMarkerEffect(effect) {
  const type = String(effect?.type || "");
  const effectKind = String(effect?.effectKind || "");
  return type === "gain-credits" || (type.startsWith("gain-") && effectKind === "credits");
}

function nonCreditHeadMarkerSemanticKey(effect) {
  if (!effect || isCreditHeadMarkerEffect(effect)) return "";
  const playerId = String(effect.playerId || "");
  if (!playerId) return "";
  const type = String(effect.type || "");
  if (type === "fighter-energy-charge") return "gain:fighter-energy-charge";
  if (type.startsWith("gain-")) {
    const effectKind = String(effect.effectKind || type.slice("gain-".length) || "gain");
    return `gain:${effectKind}`;
  }
  if (type === "persistent-status" || effect.persistent) {
    const category = String(effect.category || effect.effectKind || type || "status");
    return `persistent:${category}`;
  }
  if (type === "attacker-ally-marker") return "persistent:attacker-ally";
  return "";
}

function coalesceNonCreditHeadMarkerEffects(effects, now) {
  const timestamp = Number(now) || 0;
  const candidates = [];
  const bySemantic = new Map();
  for (const effect of Array.isArray(effects) ? effects : []) {
    const semanticKey = nonCreditHeadMarkerSemanticKey(effect);
    if (!semanticKey || effect?.active === false) continue;
    const persistent = Boolean(effect?.persistent || effect?.type === "persistent-status" || effect?.type === "attacker-ally-marker");
    const startedAt = Number.isFinite(Number(effect?.startedAt))
      ? Number(effect.startedAt)
      : Number.isFinite(Number(effect?.at)) ? Number(effect.at) : timestamp;
    const rawDuration = Math.max(1, Number(effect?.duration) || Number(effect?.durationMs) || 1200);
    const expiresAt = persistent
      ? Number.POSITIVE_INFINITY
      : Math.max(
          startedAt + rawDuration,
          Number(effect?._headMarkerExpiresAt) || Number(effect?.expiresAt) || 0
        );
    if (!persistent && expiresAt <= timestamp) continue;
    const aggregateCount = Math.max(
      1,
      Math.floor(Number(effect?._headMarkerAggregateCount) || Number(effect?.markerCount) || 1)
    );
    const instanceKey = String(effect?._headMarkerInstanceKey || effect?.id || `${semanticKey}:${startedAt}`);
    const lastAt = Math.max(startedAt, Number(effect?._headMarkerLastAt) || Number(effect?.at) || startedAt);
    const groupKey = `${String(effect?.playerId || "")}:${semanticKey}`;
    const existing = bySemantic.get(groupKey);
    if (existing) {
      existing.expiresAt = Math.max(existing.expiresAt, expiresAt);
      existing.aggregateCount += aggregateCount;
      existing.lastAt = Math.max(existing.lastAt, lastAt);
      existing.sourceEffect = {
        ...existing.sourceEffect,
        ...effect,
        id: existing.instanceKey,
        startedAt: existing.startedAt,
        duration: Math.max(1, existing.expiresAt - existing.startedAt),
        _headMarkerInstanceKey: existing.instanceKey,
        _headMarkerExpiresAt: existing.expiresAt,
        _headMarkerAggregateCount: existing.aggregateCount,
        _headMarkerLastAt: existing.lastAt
      };
      continue;
    }
    const candidate = {
      semanticKey,
      instanceKey,
      startedAt,
      expiresAt,
      aggregateCount,
      lastAt,
      persistent,
      type: String(effect?.type || ""),
      category: String(effect?.category || effect?.effectKind || ""),
      sourceEffect: {
        ...effect,
        id: instanceKey,
        startedAt,
        duration: persistent ? rawDuration : Math.max(1, expiresAt - startedAt),
        _headMarkerInstanceKey: instanceKey,
        _headMarkerExpiresAt: expiresAt,
        _headMarkerAggregateCount: aggregateCount,
        _headMarkerLastAt: lastAt
      }
    };
    bySemantic.set(groupKey, candidate);
    candidates.push(candidate);
  }
  return candidates;
}

function selectHeadMarkerPresentation(player, data, effects, now, previousSlot) {
  const timestamp = Number(now) || 0;
  const playerId = String(player?.id || "");
  if (!playerId || !["playing", "meeting"].includes(String(data?.phase || ""))) {
    return { nonCredit: null, nonCredits: [], queued: [], credits: [] };
  }
  const relevant = (Array.isArray(effects) ? effects : []).filter((effect) => String(effect?.playerId || "") === playerId);
  const credits = relevant.filter((effect) => {
    if (!isCreditHeadMarkerEffect(effect)) return false;
    const startedAt = Number.isFinite(Number(effect?.startedAt))
      ? Number(effect.startedAt)
      : Number.isFinite(Number(effect?.at)) ? Number(effect.at) : timestamp;
    const duration = Math.max(1, Number(effect?.duration) || Number(effect?.durationMs) || 1200);
    return startedAt + duration > timestamp;
  });
  const candidates = coalesceNonCreditHeadMarkerEffects(relevant, timestamp);
  const transient = candidates
    .filter((candidate) => !candidate.persistent && candidate.expiresAt > timestamp)
    .sort((left, right) => right.lastAt - left.lastAt || left.startedAt - right.startedAt || left.semanticKey.localeCompare(right.semanticKey));
  const persistent = candidates
    .filter((candidate) => candidate.persistent)
    .sort((left, right) => left.semanticKey.localeCompare(right.semanticKey));
  // Distinct semantics may share the overhead layout. Same-semantic events
  // were already coalesced above, so every entry is a stable visual instance.
  const nonCredits = [...transient, ...persistent];
  const selected = nonCredits[0] || null;
  return {
    nonCredit: selected,
    nonCredits,
    queued: [],
    credits
  };
}

function nonCreditHeadMarkerCandidateForEffect(effect, presentation) {
  const candidates = Array.isArray(presentation?.nonCredits)
    ? presentation.nonCredits
    : presentation?.nonCredit ? [presentation.nonCredit] : [];
  const instanceKey = String(effect?._headMarkerInstanceKey || effect?.id || "");
  const semanticKey = nonCreditHeadMarkerSemanticKey(effect);
  return candidates.find((candidate) => instanceKey && candidate.instanceKey === instanceKey) ||
    candidates.find((candidate) => semanticKey && candidate.semanticKey === semanticKey) ||
    null;
}

function canonicalNonCreditHeadMarkerSource(effect, presentation, renderedInstances) {
  if (isCreditHeadMarkerEffect(effect)) return effect;
  const candidate = nonCreditHeadMarkerCandidateForEffect(effect, presentation);
  if (!candidate) return null;
  const playerId = String(effect?.playerId || candidate?.sourceEffect?.playerId || "");
  const instanceKey = String(candidate.instanceKey || "");
  if (!playerId || !instanceKey) return null;
  const renderKey = `${playerId}:${instanceKey}`;
  if (renderedInstances?.has(renderKey)) return null;
  renderedInstances?.add(renderKey);
  // The candidate holds the first stable instance identity, extended lifetime
  // and aggregate count.  Never pass a later raw duplicate to the renderer.
  return candidate.sourceEffect || null;
}

function recordVerificationMarkerRender(effect, channel, timestamp) {
  if (!IS_VERIFICATION_MODE || !String(effect?.variant || "").startsWith("fixture-")) return;
  const fixtureEffects = (state.magicEffects || [])
    .filter((entry) => String(entry?.variant || "").startsWith("fixture-"))
    .map((entry) => String(entry.id || ""))
    .sort();
  const runKey = fixtureEffects.join("|");
  if (!runKey) return;
  if (!state.verificationMarkerRenderProbe || state.verificationMarkerRenderProbe.runKey !== runKey) {
    state.verificationMarkerRenderProbe = {
      runKey,
      calls: { "head-marker": 0, "ordinary-ec": 0, "ordinary-control": 0 },
      headMarkerIds: [],
      aggregateMax: 0,
      frameCalls: {},
      maxHeadMarkerCallsPerFrame: 0
    };
  }
  const probe = state.verificationMarkerRenderProbe;
  probe.calls[channel] = (Number(probe.calls[channel]) || 0) + 1;
  if (channel === "head-marker") {
    const id = String(effect?.id || "");
    if (id && !probe.headMarkerIds.includes(id)) probe.headMarkerIds.push(id);
    probe.aggregateMax = Math.max(
      probe.aggregateMax,
      Math.max(1, Number(effect?._headMarkerAggregateCount) || Number(effect?.markerCount) || 1)
    );
    const frame = String(Math.floor((Number(timestamp) || 0) * 60 / 1000));
    probe.frameCalls[frame] = (Number(probe.frameCalls[frame]) || 0) + 1;
    probe.maxHeadMarkerCallsPerFrame = Math.max(probe.maxHeadMarkerCallsPerFrame, probe.frameCalls[frame]);
  }
  document.documentElement.setAttribute("data-v527-marker-render-probe", JSON.stringify({
    calls: probe.calls,
    headMarkerIds: probe.headMarkerIds,
    aggregateMax: probe.aggregateMax,
    maxHeadMarkerCallsPerFrame: probe.maxHeadMarkerCallsPerFrame
  }));
}

function nonCreditHeadMarkerPlacement(effect, presentation) {
  const candidates = Array.isArray(presentation?.nonCredits)
    ? presentation.nonCredits
    : presentation?.nonCredit ? [presentation.nonCredit] : [];
  const candidate = nonCreditHeadMarkerCandidateForEffect(effect, presentation);
  const baseIndex = Math.max(0, candidates.indexOf(candidate));
  return {
    candidate,
    baseIndex,
    total: Math.max(1, candidates.length),
    startRow: 0
  };
}

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
  stamina: ["SP獲得", "SPが即時回復しました。獲得量は発動元の表示値です。"],
  credits: ["クレジット獲得", "クレジットが即時加算されました。獲得量は発動元の表示値です。"],
  mana: ["MP獲得", "MPが即時回復しました。獲得量は発動元の表示値です。"],
  cooldownReduction: ["待機時間短縮", "進行中の能力・行動・オブジェクトCTを発動元の表示秒数だけ短縮しました。"],
  statusRecovery: ["状態異常回復", "燃焼・毒・通常/テーザー/ショック/重力減速・能力封印・重力拘束を解除します。EMP機器異常は状態異常ではないため、この回復では解除できません。"],
  acceleration: ["加速獲得", "移動・物理モーション・CT・行動不能・タスク速度を発動元の倍率・時間で加速します。"],
  luckBoost: ["幸運／直観上昇", "乱数判定とイデア到達時間に有利な補正を得ました。"],
  overheal: ["オーバーヒール", "通常HPを超える耐久+1。次のボディダメージを吸収します。"],
  relaxation: ["リラックス", "12秒間、加速×1.35を得ました。移動・物理モーション・CT・行動不能・タスク速度へ適用します。"],
  herbalRecovery: ["植物療法", "HP+1。"],
  healthyMeal: ["健康的な食事", "HP+1・SP+120・MP+1。"],
  mineralWater: ["ミネラルウォーター", "燃焼解除・SP+100。"],
  heal: ["HP回復", "発動元の表示量だけHPを回復しました。"],
  fullRecovery: ["全回復", "HPを2まで全回復し、オーバーヒールを最低1にしました。"],
  decoy: ["デコイ作動", "SP+100と偽足音を発生させました。"]
});

const STATUS_MARKER_EXPLANATIONS = Object.freeze({
  naturalRecovery: ["自然回復", "理知中、人体の状態異常を無効化・即時解除し、HP・SP・MPを独立して漸進回復します。EMP機器異常は状態異常ではないため解除できません。アロマ有効中は、このマーカーに香気と葉片の補助エフェクトが加わります。"],
  acceleration: ["加速", "移動・物理モーション・CT・行動不能・タスク速度が表示倍率で加速しています。"],
  levitation: ["浮揚", "床外移動中は0.04MP/秒。終了時に床がなければ落下死します。"],
  hpReduction: ["HP減少", "現在HPまたはHP上限が低下しています。"],
  resistanceBreak: ["確殺耐性無効", "リミットブレイク中はバリア・変わり身による確殺回避が無効です。EC1000到達後は解除されます。"],
  standFirm: ["バリア", "次に受ける確殺を一度だけ防ぎ、発動後もしばらく防護します。"],
  push: ["バスト", "対象のバリアを無効化します。無効化数に応じ反動を受けます。"],
  iai: ["居合・即席", "次の成功攻撃を破壊（死体あり）へ自動強化します。失敗・回避・ガード・準備バリアでは消費せず、既存の消滅は維持します。"],
  burning: ["燃焼", "解除されるまで継続ダメージを受けます。水・フローラ回復・理知中の自然回復で解除できます。"],
  poison: ["毒", "解除されるまで継続ダメージを受けます。解毒剤・フローラ回復・理知中の自然回復で解除できます。"],
  manaGpu: ["マナGPU", "0.025MP/秒を短縮クールへ変換（1MP=20秒）。次のバイブコーディングで必要分を自動消費します。"],
  infiniteResources: ["無限資源", "EC100回到達報酬によりMP・SP・HP・バリアが無限になっています。"],
  destructionSlash: ["常時消滅斬り", "EC1000回到達後のファイター能力が、所持中の剣による斬るを死体なしの消滅へ強化します。剣自体の効果ではありません。"],
  clairvoyance: ["千里眼", "視点を遠隔地点へ移し、現地を観測しています。"]
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

// Compact grants and EC share one player-attached marker lane.  This keeps
// concurrent authoritative effects readable without creating a second,
// normal-action-size copy of an EC texture at the character's feet.
function isSharedHeadMarkerEffect(effect) {
  return Boolean(effect?.playerId) && (effect.type?.startsWith("gain-") || effect.type === "fighter-energy-charge");
}

function sharedHeadMarkerCount(effect) {
  if (!isCreditHeadMarkerEffect(effect)) return 1;
  return Math.max(1, Math.floor(Number(effect?.markerCount) || 1));
}

function persistentHeadMarkerEffects(player, data) {
  if (!player?.id || !player.alive || player.ejected) return [];
  const effects = [];
  if (data?.phase === "playing" && player.attackerAlly) {
    effects.push({
      id: `ally:${player.id}`,
      type: "attacker-ally-marker",
      category: "attackerAlly",
      playerId: player.id,
      persistent: true,
      active: true,
      at: 0
    });
  }
  const activeState = persistentStatusAteState(player, data);
  for (const category of Object.keys(PERSISTENT_STATUS_ATE_PROFILES)) {
    if (!activeState[category]) continue;
    effects.push({
      id: `status:${player.id}:${category}`,
      type: "persistent-status",
      category,
      playerId: player.id,
      persistent: true,
      active: true,
      at: 0
    });
  }
  return effects;
}

function headMarkerEffectsForPlayer(player, data) {
  return [
    ...state.magicEffects.filter((effect) => effect.playerId === player?.id && isSharedHeadMarkerEffect(effect)),
    ...persistentHeadMarkerEffects(player, data)
  ];
}

function rememberHeadMarkerPresentation(playerId, presentation, now) {
  const previous = state.headMarkerSlots.get(playerId) || null;
  const primary = presentation.nonCredits?.[0] || presentation.nonCredit || null;
  if (!primary) {
    state.headMarkerSlots.delete(playerId);
  } else {
    const sameInstance = previous?.instanceKey === primary.instanceKey;
    state.headMarkerSlots.set(playerId, {
      ...primary,
      selectedAt: sameInstance ? previous.selectedAt : now
    });
  }
  state.headMarkerPresentationCache.set(playerId, presentation);
  return presentation;
}

function headMarkerPresentationForPlayer(player, data, now) {
  const frame = Number(state.frameNow || now) || 0;
  if (state.headMarkerPresentationFrame !== frame) {
    state.headMarkerPresentationFrame = frame;
    state.headMarkerPresentationCache.clear();
  }
  const cached = state.headMarkerPresentationCache.get(player?.id);
  if (cached) return cached;
  const previousSlot = state.headMarkerSlots.get(player?.id) || null;
  const presentation = selectHeadMarkerPresentation(
    player,
    data,
    headMarkerEffectsForPlayer(player, data),
    now,
    previousSlot
  );
  return rememberHeadMarkerPresentation(player.id, presentation, now);
}

function creditHeadMarkerPlacement(effect, presentation) {
  const creditEffects = presentation?.credits || [];
  const effectIndex = creditEffects.indexOf(effect);
  const baseIndex = creditEffects.slice(0, Math.max(0, effectIndex))
    .reduce((sum, entry) => sum + sharedHeadMarkerCount(entry), 0);
  const total = creditEffects.reduce((sum, entry) => sum + sharedHeadMarkerCount(entry), 0);
  return {
    baseIndex,
    total: Math.max(1, total),
    startRow: headMarkerRowCount(presentation?.nonCredits?.length || (presentation?.nonCredit ? 1 : 0))
  };
}

function headMarkerLifetimeProgress(effect, now) {
  const startedAt = Number(effect?.startedAt) || now;
  const expiresAt = Number(effect?._headMarkerExpiresAt) || (startedAt + Math.max(1, Number(effect?.duration) || 1200));
  const elapsed = Math.max(0, now - startedAt);
  const remaining = Math.max(0, expiresAt - now);
  if (elapsed < 180) return 0.2 * (elapsed / 180);
  if (remaining < 360) return 0.7 + 0.3 * (1 - remaining / 360);
  return 0.45;
}

function drawGainAcquisitionEffect(effect, progress, now, index = 0, total = 1) {
  const texture = dedicatedMapObjectEffectTexture(effect.effectKind);
  if (!texture?.complete || !texture.naturalWidth) return;
  const prepared = transparentSpriteSource(texture, `gain-ate-${effect.effectKind}`, 14);
  if (!prepared) return;
  const player = gainEffectPlayer(effect);
  if (!player || !player.alive || player.ejected || player.inVent) return;
  const presentation = headMarkerPresentationForPlayer(player, state.data, now);
  const creditMarker = isCreditHeadMarkerEffect(effect);
  const nonCreditPlacement = creditMarker ? null : nonCreditHeadMarkerPlacement(effect, presentation);
  if (!creditMarker && !nonCreditPlacement?.candidate) return;
  if (creditMarker && !presentation.credits.includes(effect)) return;
  const markerCount = creditMarker ? sharedHeadMarkerCount(effect) : 1;
  if (creditMarker) recordVerificationMarkerRender(effect, "head-marker", now);
  const placement = creditMarker
    ? creditHeadMarkerPlacement(effect, presentation)
    : nonCreditPlacement;
  const { baseIndex, total: expandedTotal, startRow } = placement;
  const profile = OBJECT_EFFECT_PRESENTATIONS[effect.effectKind] || OBJECT_EFFECT_PRESENTATIONS.mana;
  const markerProgress = creditMarker ? progress : headMarkerLifetimeProgress(effect, now);
  const fade = objectEffectFade(markerProgress);
  const reveal = objectEffectEase(markerProgress / 0.2);
  const size = HEAD_MARKER_LAYOUT.markerSize * (0.76 + reveal * 0.24);
  const explanation = GAIN_MARKER_EXPLANATIONS[effect.effectKind] || ["獲得効果", "即時効果を獲得しました。"];
  const aggregateCount = creditMarker
    ? markerCount
    : Math.max(1, Number(effect._headMarkerAggregateCount) || nonCreditPlacement.candidate.aggregateCount || 1);
  for (let markerIndex = 0; markerIndex < markerCount; markerIndex += 1) {
    const expandedIndex = baseIndex + markerIndex;
    const marker = headMarkerSlot(expandedIndex, expandedTotal, startRow);
    const bob = Math.sin(now / 170 + expandedIndex * 1.7) * 0.8;
    ctx.save();
    ctx.translate(player.x + marker.x, player.y - (Number(player.jumpHeight) || 0) + marker.y + bob);
    registerMarkerHitTarget(
      `gain:${effect._headMarkerInstanceKey || effect.id || effect.createdAt || effect.effectKind}:${player.id}:${markerIndex}`,
      0,
      0,
      size * 0.62,
      `${explanation[0]}${!creditMarker && aggregateCount > 1 ? ` ×${aggregateCount}` : ""}`,
      explanation[1]
    );
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = fade;
    drawAnimatedTextureCentered(prepared, 0, 0, size, size, {
      mode: profile.motion,
      time: now / 1000,
      phase: expandedIndex * 0.23,
      intensity: 0.9,
      baseAlpha: 0.16,
      opacityBoost: 3
    });
    drawAteComplementaryVfx(ctx, profile.motion, size, size, now / 1000, progress, fade * 0.42);
    ctx.restore();
  }
}

function drawFighterEnergyChargeMarker(effect, progress, now) {
  const prepared = transparentSpriteSource(state.textures.fighterEnergyChargeEffect, "fighter-energy-charge-marker", 18);
  const sprite = prepared ? normalizedSpriteFrame(prepared, "fighter-energy-charge-marker", 1, 1, 0, 0) : null;
  const player = gainEffectPlayer(effect);
  if (!sprite || !player || !player.alive || player.ejected || player.inVent) return;
  const presentation = headMarkerPresentationForPlayer(player, state.data, now);
  const placement = nonCreditHeadMarkerPlacement(effect, presentation);
  if (!placement.candidate) return;
  const { baseIndex, total, startRow } = placement;
  const marker = headMarkerSlot(baseIndex, total, startRow);
  const time = Math.floor((now / 1000) * 60) / 60;
  const markerProgress = headMarkerLifetimeProgress(effect, now);
  const reveal = objectEffectEase(markerProgress / 0.18);
  const fade = objectEffectFade(markerProgress);
  const size = HEAD_MARKER_LAYOUT.markerSize * (0.8 + reveal * 0.2);
  const bob = Math.sin(time * 3.2 + baseIndex * 1.19) * 0.9;
  ctx.save();
  ctx.translate(player.x + marker.x, player.y - (Number(player.jumpHeight) || 0) + marker.y + bob);
  registerMarkerHitTarget(
    `fighter-ec:${effect._headMarkerInstanceKey || effect.id || effect.createdAt || effect.at}:${player.id}`,
    0,
    0,
    size * 0.62,
    `EC獲得${Math.max(1, Number(effect._headMarkerAggregateCount) || placement.candidate.aggregateCount || 1) > 1 ? ` ×${Math.max(1, Number(effect._headMarkerAggregateCount) || placement.candidate.aggregateCount || 1)}` : ""}`,
    "ファイターのECが1増加しました。頭上markerは現在のキャラクター位置に追従します。"
  );
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = fade;
  drawAnimatedTextureCentered(sprite, 0, 0, size, size, {
    mode: "flow-up",
    time,
    progress,
    phase: 0.61 + baseIndex * 0.19,
    intensity: 0.9,
    baseAlpha: 0.16,
    opacityBoost: 3
  });
  // E is sparse upward motes, distinct from the EC texture silhouette.
  drawAteComplementaryVfx(ctx, "flow-up", size, size, time, progress, fade * 0.42);
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
    if (player.inVent || (player.invisible && player.id !== data.selfId)) return;
    drawHuman(player, data);
  });
}

function drawKillCameraWorldMarkers(data) {
  const record = activeKillCameraRecord(data);
  if (!record) return;
  const victim = { x: Number(record.victimX) || 0, y: Number(record.victimY) || 0 };
  const killer = { x: Number(record.killerX) || victim.x, y: Number(record.killerY) || victim.y };
  const separated = Math.hypot(killer.x - victim.x, killer.y - victim.y) > 10;
  ctx.save();
  ctx.lineWidth = 4;
  ctx.setLineDash([11, 8]);
  ctx.strokeStyle = "rgba(248, 113, 113, 0.9)";
  if (separated) {
    ctx.beginPath();
    ctx.moveTo(killer.x, killer.y - 22);
    ctx.lineTo(victim.x, victim.y - 22);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  const marker = (point, color, label) => {
    ctx.fillStyle = "rgba(2, 6, 23, 0.82)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(point.x, point.y - 22, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "900 14px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, point.x, point.y - 22);
  };
  marker(victim, "#f87171", "死亡地点");
  if (separated) marker(killer, "#facc15", "キラー");
  ctx.restore();
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

const ACCELERATION_READY_PHYSICAL_KINDS = new Set([
  "focus", "rest", "power", "cast", "heal", "reload", "shoot", "interact", "heart-transfer"
]);

function accelerationReadyMotionDynamics(player, kind, motionId = kind) {
  const rate = physicalMotionRateFor(player);
  const accelerationReady = ACCELERATION_READY_PHYSICAL_KINDS.has(kind);
  if (!accelerationReady || rate <= 1) {
    return { rate, spatialScale: 1, poseTravel: 1 };
  }
  return {
    // Timing still follows the authoritative acceleration multiplier. Spatial
    // travel shrinks inversely so high acceleration does not produce violent
    // bobbing, lunging, or rotation, and authored extreme poses converge on
    // the stable middle pose instead of flashing at high frequency.
    rate,
    spatialScale: Math.max(0.1, 1 / rate),
    poseTravel: Math.max(0.28, 1 / Math.sqrt(rate))
  };
}

function loopedPhysicalMotionProgress(player, kind, cycleMs, motionId = kind) {
  const timestamp = state.frameNow || performance.now();
  const key = `${player.id}:${kind}:${motionId}`;
  const phase = state.physicalMotionPhases.get(key) || { progress: 0, lastAt: timestamp };
  const elapsed = clamp(timestamp - phase.lastAt, 0, 50);
  const dynamics = accelerationReadyMotionDynamics(player, kind, motionId);
  phase.progress = (phase.progress + elapsed * dynamics.rate / Math.max(1, cycleMs)) % 1;
  phase.lastAt = timestamp;
  state.physicalMotionPhases.set(key, phase);
  return phase.progress;
}

function displayedGunnerState(player, data = state.data) {
  const isSelf = player?.id === data?.selfId;
  const authoritative = isSelf ? data?.self : player;
  const selectedWeapon = String(authoritative?.gunnerWeapon || player?.gunnerWeapon || "");
  const firingWeapon = String(authoritative?.gunFiringWeapon || player?.gunFiringWeapon || selectedWeapon);
  const reloadWeapon = String(authoritative?.gunnerReloadWeapon || player?.gunnerReloadWeapon || selectedWeapon);
  return {
    firing: Boolean(authoritative?.gunFiring || player?.gunFiring || (isSelf && state.gunTriggerHeld)),
    selectedWeapon,
    firingWeapon,
    reloadWeapon
  };
}

function gunnerFiringFacingFor(player, data = state.data) {
  const isSelf = player?.id === data?.selfId;
  const authoritative = isSelf ? data?.self : player;
  const aimX = Number(authoritative?.aimX ?? player?.aimX);
  if (Number.isFinite(aimX) && Math.abs(aimX) > 0.05) {
    const facing = aimX < 0 ? "left" : "right";
    state.facing.set(player.id, facing);
    return facing;
  }
  const current = state.facing.get(player.id);
  if (current === "left" || current === "right") return current;
  return "right";
}

function displayedEnhanceCharge(player, data = state.data) {
  const isSelf = player?.id === data?.selfId;
  if (isSelf && state.enhanceHold.kind) {
    return {
      active: true,
      kind: state.enhanceHold.kind,
      elapsedMs: Math.max(0, performance.now() - Number(state.enhanceHold.startedAt || performance.now()))
    };
  }
  const authoritative = isSelf ? data?.self : player;
  const startedAt = Number(authoritative?.enhanceChargeStartedAt || player?.enhanceChargeStartedAt) || 0;
  const kind = String(authoritative?.enhanceChargeKind || player?.enhanceChargeKind || "");
  return {
    active: startedAt > 0 && Boolean(kind),
    kind,
    elapsedMs: startedAt > 0 ? Math.max(0, estimatedServerNow(data) - startedAt) : 0
  };
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
  if (player.movementMode === "sleep") return { kind: "rest", progress: loopedPhysicalMotionProgress(player, "rest", 1600, "action-rest"), motionId: "action-rest" };
  if (player.id === state.data?.selfId && state.throwTargeting.active) {
    // Hold the authored wind-up pose while the landing point is being placed.
    // The release animation is emitted independently by /api/item-throw.
    return { kind: "throw", progress: 0.3, variant: "prepare" };
  }
  const gunnerState = displayedGunnerState(player);
  if (gunnerState.firing) {
    const cycle = loopedPhysicalMotionProgress(player, "shoot", 360);
    // Weapon animation is shooter-local. Never fall back to another player's
    // selected weapon, otherwise one switch would visually affect everyone.
    const variant = gunnerState.firingWeapon;
    return { kind: "shoot", progress: cycle <= 0.5 ? cycle * 2 : (1 - cycle) * 2, variant };
  }
  const action = state.characterActions.get(player.id);
  if (!action) return null;
  const lastSampleAt = Number(action.lastSampleAt) || Number(action.startedAt) || timestamp;
  const elapsed = clamp(timestamp - lastSampleAt, 0, 100);
  const dynamics = accelerationReadyMotionDynamics(player, action.kind, action.motionId);
  const progress = (Number(action.sampledProgress) || 0) +
    elapsed * dynamics.rate / Math.max(1, action.duration);
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
  if (self && data.self.floraInvisibleActive && player.alive && !player.ejected) ctx.globalAlpha *= 0.32;

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
  const enhanceRim = enhanceRimLightState(player, data);
  ctx.save();
  if (enhanceRim) ctx.filter = enhanceRim.filter;
  const drewPlayerSprite = drawPlayerSprite(player, data, ghost, characterAction);
  ctx.restore();
  if (drewPlayerSprite) {
    drawEnhanceRimLightGlints(enhanceRim);
    drawPreparationBarrierAte(player);
    drawLuminousFeathers(player);
    drawAttackerAllyMarker(player);
    drawPersistentStatusAteLayers(player, data);
    ctx.restore();
    return;
  }

  const skin = state.textures.skin;
  ctx.save();
  if (enhanceRim) ctx.filter = enhanceRim.filter;
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
  ctx.restore();
  drawEnhanceRimLightGlints(enhanceRim);

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

function enhanceRimLightState(player, data) {
  if (!player.alive || player.ejected) return null;
  const charge = displayedEnhanceCharge(player, data);
  // A held control is not itself an Enhance presentation.  The server has
  // exactly one Enhance interval: 600 through 2999ms.  Keeping the rim out
  // of the ordinary press and the GBO interval prevents an unrelated action
  // (notably Limit Break or an EC milestone in the same poll) from acquiring
  // the Enhance silhouette/filter merely because another control is held.
  const enhanceStartsAt = Math.max(1, Number(data?.self?.enhanceHoldStepMs) || ENHANCE_HOLD_STEP_MS_CLIENT);
  if (!charge.active || charge.elapsedMs < enhanceStartsAt || charge.elapsedMs >= GBO_HOLD_MS_CLIENT) return null;
  const stepMs = enhanceStartsAt;
  const maximum = Math.max(1, Number(data?.self?.enhanceMaxLevel) || ENHANCE_MAX_LEVEL_CLIENT);
  const level = Math.min(maximum, Math.floor(charge.elapsedMs / stepMs));
  const time = (state.frameNow || performance.now()) / 1000;
  const phase = time * (3.8 + level * 0.32) + (player.id?.length || 0) * 0.41;
  const offsetX = Math.cos(phase) * (1.35 + level * 0.24);
  const offsetY = Math.sin(phase) * (1.15 + level * 0.2);
  const innerBlur = 1.6 + level * 0.36;
  const outerBlur = 5.5 + level * 1.15;
  return {
    charge,
    level,
    time,
    filter: [
      `drop-shadow(${offsetX.toFixed(2)}px ${offsetY.toFixed(2)}px ${innerBlur.toFixed(2)}px rgba(240,253,255,.98))`,
      `drop-shadow(${(-offsetX).toFixed(2)}px ${(-offsetY).toFixed(2)}px ${(innerBlur + 0.8).toFixed(2)}px rgba(34,211,238,.9))`,
      `drop-shadow(0 0 ${outerBlur.toFixed(2)}px rgba(139,92,246,.72))`
    ].join(" ")
  };
}

function drawEnhanceRimLightGlints(rim) {
  if (!rim) return;
  const anchors = [
    [-29, -54], [25, -44], [-35, -17], [34, 3], [-22, 30], [23, 33]
  ];
  const visibleGlints = Math.min(6, 3 + rim.level);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let index = 0; index < visibleGlints; index += 1) {
    const [baseX, baseY] = anchors[index];
    const cycle = ((rim.time * (0.72 + index * 0.035) + index * 0.193) % 1 + 1) % 1;
    const life = Math.sin(cycle * Math.PI);
    const size = 2.2 + rim.level * 0.34 + life * 2.1;
    ctx.save();
    ctx.translate(baseX + Math.sin(rim.time * 2.1 + index) * 2.4, baseY - cycle * 9);
    ctx.rotate(Math.PI / 4 + rim.time * 0.18 * (index % 2 ? -1 : 1));
    ctx.globalAlpha = life * (0.38 + rim.level * 0.1);
    ctx.fillStyle = index % 2 ? "#e0f2fe" : "#a5f3fc";
    ctx.shadowColor = index % 2 ? "#c4b5fd" : "#22d3ee";
    ctx.shadowBlur = 7 + rim.level * 2;
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.restore();
  }
  ctx.restore();
}

function drawHackerRootState(player) {
  if (!player.hackerRootActive || !player.alive || player.ejected) return;
  const prepared = transparentSpriteSource(state.textures.hackerRootMatrix, "hacker-root-matrix-v497", 18);
  const sprite = prepared ? normalizedSpriteFrame(prepared, "hacker-root-matrix-v497", 1, 1, 0, 0) : null;
  if (!sprite) return;
  const time = (state.frameNow || performance.now()) / 1000;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha *= 0.72 + Math.sin(time * 5.2) * 0.06;
  ctx.translate(0, 5);
  drawAnimatedTextureCentered(sprite, 0, -8, 170, 170, {
    mode: "data-down",
    time,
    phase: (player.id?.length || 0) * 0.13,
    intensity: 0.92,
    baseAlpha: 0.13,
    opacityBoost: 2.8
  });
  ctx.restore();
}

function drawAttackerAllyMarker(player) {
  if (state.data?.phase !== "playing" || !player.attackerAlly || !player.alive || player.ejected) return;
  const now = state.frameNow || performance.now();
  const presentation = headMarkerPresentationForPlayer(player, state.data, now);
  const markerEffect = {
    id: `ally:${player.id}`,
    type: "attacker-ally-marker",
    category: "attackerAlly",
    playerId: player.id,
    persistent: true
  };
  const placement = nonCreditHeadMarkerPlacement(markerEffect, presentation);
  if (!placement.candidate) return;
  const prepared = transparentSpriteSource(state.textures.attackerAllyMarker, "attacker-ally-marker", 18);
  const sprite = prepared ? normalizedSpriteFrame(prepared, "attacker-ally-marker", 1, 1, 0, 0) : null;
  if (!sprite) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha *= 0.88;
  const marker = headMarkerSlot(placement.baseIndex, placement.total, placement.startRow);
  registerMarkerHitTarget(
    `ally:${player.id}`,
    marker.x,
    marker.y,
    18,
    "アタッカー味方",
    "自分と同じアタッカー陣営のプレイヤーです。"
  );
  drawAnimatedTextureCentered(sprite, marker.x, marker.y, 28, 28, {
    mode: "energy",
    time: (state.frameNow || performance.now()) / 1000,
    intensity: 0.82,
    baseAlpha: 0.14,
    opacityBoost: 2.8
  });
  ctx.restore();
}

const PERSISTENT_STATUS_ATE_PROFILES = Object.freeze({
  naturalRecovery: Object.freeze({ texture: "naturalRecoveryEffect", mode: "ripple", size: 31, alpha: 0.94, phase: 0.04 }),
  acceleration: Object.freeze({ texture: "accelerationPhaseEffect", mode: "flow-up", size: 32, alpha: 0.94, phase: 0.08 }),
  levitation: Object.freeze({ texture: "statusLevitationEffect", mode: "ripple", size: 30, alpha: 0.88, phase: 0.27 }),
  hpReduction: Object.freeze({ texture: "statusHpReductionEffect", mode: "data-down", size: 30, alpha: 0.88, phase: 0.46 }),
  resistanceBreak: Object.freeze({ texture: "pushStandFirmBreak", mode: "glitch", size: 30, alpha: 0.84, phase: 0.63 }),
  standFirm: Object.freeze({ texture: "instantStandFirmTexture", mode: "shield", size: 28, alpha: 0.94, phase: 0.18 }),
  push: Object.freeze({ texture: "instantPushTexture", mode: "impact", size: 28, alpha: 0.94, phase: 0.72 }),
  iai: Object.freeze({ texture: "itemIaiTexture", mode: "beam", size: 30, alpha: 0.94, phase: 0.42 }),
  burning: Object.freeze({ texture: "hazardFireEffect", mode: "combustion", size: 30, alpha: 0.88, phase: 0.81 }),
  poison: Object.freeze({ texture: "hazardPoisonEffect", mode: "orbit", size: 30, alpha: 0.86, phase: 0.94 }),
  manaGpu: Object.freeze({ texture: "statusManaGpuEffect", mode: "data-accelerate", size: 30, alpha: 0.94, phase: 0.57 }),
  // Infinite Resources is an EC100 one-shot resource reward presentation, not a
  // second persistent EC-looking overhead marker.  Its durable state remains
  // in Applied Effects; the dedicated milestone owns the field ATE.
  destructionSlash: Object.freeze({ texture: "fighterDestructionSlashMilestoneEffect", mode: "beam", size: 30, alpha: 0.94, phase: 0.76 }),
  clairvoyance: Object.freeze({ texture: "clairvoyanceThrowAte", mode: "shimmer", size: 30, alpha: 0.92, phase: 0.35 })
});

function persistentStatusAteState(player, data) {
  const selfState = player.id === data.selfId ? data.self?.statusAte : null;
  const visibleState = player.statusAte || selfState || {};
  const naturalRecovery = Boolean(visibleState.naturalRecovery || (player.id === data.selfId && data.self?.statusImmunityActive));
  const aroma = Boolean(player.aromaActive || (player.id === data.selfId && data.self?.aromaActive));
  if (player.id !== data.selfId) return { ...visibleState, naturalRecovery, aroma };
  return {
    ...visibleState,
    naturalRecovery,
    aroma,
    manaGpu: Boolean(data.self?.manaGpuActive),
    iai: (Number(data.self?.iaiCharges) || 0) > 0,
    infiniteResources: Boolean(data.self?.fighterInfiniteResources),
    destructionSlash: Boolean(data.self?.fighterDestructionSlash)
  };
}

// Aroma deliberately does not alter the Natural Recovery texture's silhouette
// glow. Its complementary, finite E-layer is drawn separately at this same
// marker anchor so the recovery marker remains one stable shared marker.
const NATURAL_RECOVERY_MARKER_GLOW = Object.freeze({
  intensity: 0.9,
  baseAlpha: 0.15,
  opacityBoost: 3.2
});

function naturalRecoveryMarkerGlow() {
  return NATURAL_RECOVERY_MARKER_GLOW;
}

function drawAromaNaturalRecoveryMarkerEffect(markerX, markerY, time, activeState) {
  if (!activeState?.naturalRecovery || !activeState?.aroma) return false;
  // Five short-lived scent-leaf motes are intentionally complementary to the
  // recovery raster rather than another marker texture or a full-size ATE.
  const particleCount = 5;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let index = 0; index < particleCount; index += 1) {
    const cycle = ((time * (0.32 + index * 0.018) + index * 0.211) % 1 + 1) % 1;
    const life = Math.sin(cycle * Math.PI);
    const drift = Math.sin(time * 2.2 + index * 1.73) * (2.5 + index * 0.42);
    const x = markerX + drift + (index - (particleCount - 1) / 2) * 2.2;
    const y = markerY + 11 - cycle * (18 + (index % 2) * 4);
    const size = 1.7 + life * 1.35;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.52 + time * 0.45 + index * 0.77);
    ctx.globalAlpha = life * (0.28 + (index % 2) * 0.07);
    ctx.fillStyle = index % 2 ? "#bbf7d0" : "#d8b4fe";
    ctx.shadowColor = index % 2 ? "#4ade80" : "#c084fc";
    ctx.shadowBlur = 4 + life * 3;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(size * 0.82, -size * 0.08, 0, size);
    ctx.quadraticCurveTo(-size * 0.58, -size * 0.08, 0, -size);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
  return true;
}

function drawFloraInvisibleGeneratedEffect(effect, progress) {
  const key = "flora-invisible-ate-v527";
  const prepared = transparentSpriteSource(state.textures.floraInvisibleV527, key, 18);
  const sprite = prepared ? normalizedSpriteFrame(prepared, key, 1, 1, 0, 0) : null;
  if (!sprite) return false;
  const pulse = Math.sin(Math.min(1, progress) * Math.PI);
  const size = 176 + pulse * 34;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = Math.max(0.06, 1 - progress * 0.88);
  ctx.translate(effect.x, effect.y - 24 - progress * 16);
  ctx.rotate(Math.sin(progress * Math.PI * 2) * 0.035);
  drawAnimatedTextureCentered(sprite, 0, 0, size, size, {
    mode: "shimmer",
    progress,
    intensity: 0.94,
    baseAlpha: 0.18,
    opacityBoost: 2.2
  });
  ctx.restore();
  return true;
}

function drawPersistentStatusAteLayers(player, data) {
  if (!player.alive || player.ejected) return;
  const activeState = persistentStatusAteState(player, data);
  const time = Math.floor(((state.frameNow || performance.now()) / 1000) * 60) / 60;
  const now = state.frameNow || performance.now();
  const previousSlot = state.headMarkerSlots.get(player.id) || null;
  const presentation = selectHeadMarkerPresentation(
    player,
    data,
    headMarkerEffectsForPlayer(player, data),
    now,
    previousSlot
  );
  rememberHeadMarkerPresentation(player.id, presentation, now);
  const candidates = (presentation.nonCredits || []).filter((candidate) => (
    candidate.type === "persistent-status" && activeState[candidate.category]
  ));
  for (const candidate of candidates) {
    const category = candidate.category;
    const profile = PERSISTENT_STATUS_ATE_PROFILES[category];
    if (!profile) continue;
    const naturalRecoveryGlow = category === "naturalRecovery"
      ? naturalRecoveryMarkerGlow(activeState)
      : null;
    const source = state.textures[profile.texture];
    const prepared = transparentSpriteSource(source, `persistent-status-${category}`, 18);
    const sprite = prepared ? normalizedSpriteFrame(prepared, `persistent-status-${category}`, 1, 1, 0, 0) : null;
    if (!sprite) continue;
    const markerEffect = candidate.sourceEffect || {
      id: candidate.instanceKey,
      type: "persistent-status",
      category,
      playerId: player.id,
      persistent: true
    };
    const placement = nonCreditHeadMarkerPlacement(markerEffect, presentation);
    if (!placement.candidate) continue;
    const marker = headMarkerSlot(placement.baseIndex, placement.total, placement.startRow);
    const markerX = marker.x;
    const markerY = marker.y + Math.sin(time * 2.4 + profile.phase * Math.PI * 2) * 1.1;
    const explanation = STATUS_MARKER_EXPLANATIONS[category] || ["適用中の効果", "この効果が現在適用されています。"];
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha *= profile.alpha;
    registerMarkerHitTarget(`status:${player.id}:${category}`, markerX, markerY, profile.size * 0.62, explanation[0], explanation[1]);
    drawAnimatedTextureCentered(sprite, markerX, markerY, profile.size, profile.size, {
      mode: profile.mode,
      time,
      phase: profile.phase,
      intensity: naturalRecoveryGlow?.intensity ?? 0.9,
      baseAlpha: naturalRecoveryGlow?.baseAlpha ?? 0.15,
      opacityBoost: naturalRecoveryGlow?.opacityBoost ?? 3.2
    });
    if (category === "naturalRecovery") {
      drawAromaNaturalRecoveryMarkerEffect(markerX, markerY, time, activeState);
    }
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

function physicalMotionSignature(motionId, kind) {
  const source = `${String(kind || "action")}:${String(motionId || kind || "action")}`;
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  const unit = (shift) => ((hash >>> shift) & 255) / 255;
  return {
    lead: 0.015 + unit(0) * 0.075,
    release: 0.86 + unit(8) * 0.1,
    sway: unit(16) * 2 - 1,
    lift: unit(24) * 2 - 1,
    twist: (((hash >>> 5) & 255) / 255) * 2 - 1,
    frequency: 1 + ((hash >>> 13) & 3)
  };
}

function physicalActionFramePosition(kind, progress, motionId = kind) {
  const signature = physicalMotionSignature(motionId, kind);
  const value = clamp((progress - signature.lead) / Math.max(0.5, signature.release - signature.lead), 0, 1);
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
  if (kind === "cast" || kind === "heal" || kind === "power" || kind === "heart-transfer") {
    const smooth = value * value * (3 - 2 * value);
    return smooth * 2;
  }
  if (kind === "jump") return Math.min(2, objectEffectEase(value / 0.64) * 2);
  if (kind === "reload") return (0.5 - Math.cos(value * Math.PI) * 0.5) * 2;
  if (kind === "focus" || kind === "rest") return Math.min(2, value * 1.72 + Math.sin(value * Math.PI) * 0.28);
  return objectEffectEase(value) * 2;
}

function applyAbilitySpecificPhysicalTransform(kind, progress, facing, motionId, motionScale, variant = "") {
  const id = String(motionId || kind);
  const mode = String(variant || "");
  const impulse = Math.sin(clamp(progress, 0, 1) * Math.PI);
  const ease = objectEffectEase(clamp(progress, 0, 1));
  const hasId = (...tokens) => tokens.some((token) => id === token || id.includes(token));

  if (hasId("alchemy-railgun")) {
    const brace = objectEffectEase(clamp(progress / 0.32, 0, 1));
    const recoil = Math.sin(clamp((progress - 0.26) / 0.42, 0, 1) * Math.PI);
    ctx.translate(facing * (-5.5 * brace - 15 * recoil) * motionScale, (5 * brace + 1.5 * recoil) * motionScale);
    ctx.rotate(-facing * (0.052 * brace + 0.075 * recoil) * motionScale);
    ctx.scale(1 + recoil * 0.07 * motionScale, 1 - brace * 0.055 * motionScale);
    return true;
  }
  if (hasId("alchemy-particle-cannon", "alchemy-particle-beam")) {
    const plant = objectEffectEase(clamp(progress / 0.26, 0, 1));
    const sweep = Math.sin(progress * Math.PI * 3.2) * impulse;
    ctx.translate(facing * (-7 * plant + sweep * 2.4) * motionScale, (4.2 * plant - Math.abs(sweep) * 1.2) * motionScale);
    ctx.rotate(facing * (-0.038 * plant + sweep * 0.024) * motionScale);
    ctx.scale(1 + plant * 0.045 * motionScale, 1 - plant * 0.035 * motionScale);
    return true;
  }
  if (hasId("alchemy-excalibur")) {
    const windup = objectEffectEase(clamp(progress / 0.34, 0, 1));
    const cut = objectEffectEase(clamp((progress - 0.3) / 0.27, 0, 1));
    const settle = objectEffectEase(clamp((progress - 0.62) / 0.38, 0, 1));
    ctx.translate(facing * (-7 * windup + 24 * cut - 10 * settle) * motionScale, (3 * windup - 8 * cut + 5 * settle) * motionScale);
    ctx.rotate(facing * (-0.13 * windup + 0.28 * cut - 0.11 * settle) * motionScale);
    ctx.scale(1 - cut * 0.06 * motionScale, 1 + cut * 0.09 * motionScale);
    return true;
  }
  if (hasId("gunner-rpg")) {
    const launch = Math.sin(clamp((progress - 0.18) / 0.56, 0, 1) * Math.PI);
    ctx.translate(-facing * launch * 12 * motionScale, launch * 4 * motionScale);
    ctx.rotate(-facing * launch * 0.085 * motionScale);
    return true;
  }
  if (hasId("gunner-missile")) {
    const lock = objectEffectEase(clamp(progress / 0.44, 0, 1));
    const launch = Math.sin(clamp((progress - 0.42) / 0.5, 0, 1) * Math.PI);
    ctx.translate(facing * (lock * 4 - launch * 8) * motionScale, (-lock * 5 + launch * 2) * motionScale);
    ctx.rotate(facing * (lock * 0.045 - launch * 0.055) * motionScale);
    return true;
  }

  if (hasId("action-heart-teleport") || (id === "/api/teleport" && mode === "heart")) {
    const clench = objectEffectEase(clamp(progress / 0.46, 0, 1));
    const release = objectEffectEase(clamp((progress - 0.68) / 0.32, 0, 1));
    ctx.translate(facing * (-4.5 * clench + 3 * release) * motionScale, (3.2 * clench - 2 * release) * motionScale);
    ctx.rotate(facing * (-0.048 * clench + 0.025 * release) * motionScale);
    ctx.scale(1 - clench * 0.038 * motionScale, 1 + clench * 0.052 * motionScale);
    return true;
  }
  if (hasId("gravity-storm", "/api/gravity-storm")) {
    const plant = objectEffectEase(clamp(progress / 0.36, 0, 1));
    const release = objectEffectEase(clamp((progress - 0.72) / 0.28, 0, 1));
    ctx.translate(facing * Math.sin(progress * Math.PI * 2) * 1.4 * plant * motionScale, (5.5 * plant - 3 * release) * motionScale);
    ctx.rotate(facing * Math.sin(progress * Math.PI * 2) * 0.012 * plant * motionScale);
    ctx.scale(1 + plant * 0.055 * motionScale, 1 - plant * 0.045 * motionScale);
    return true;
  }
  if (hasId("gravity-time-keeper", "/api/gravity-time-keeper")) {
    const lock = objectEffectEase(clamp(progress / 0.28, 0, 1));
    ctx.translate(0, -5 * lock * motionScale);
    ctx.rotate(facing * Math.sin(progress * Math.PI) * 0.018 * motionScale);
    ctx.scale(1 + lock * 0.045 * motionScale, 1 - lock * 0.035 * motionScale);
    return true;
  }
  const accelerating = hasId("gravity-accelerate") || (id === "/api/gravity-time" && mode === "accelerate");
  if (accelerating) {
    ctx.translate(facing * ease * 4.2 * motionScale, -impulse * 7 * motionScale);
    ctx.rotate(facing * impulse * 0.042 * motionScale);
    ctx.scale(1 - impulse * 0.025 * motionScale, 1 + impulse * 0.05 * motionScale);
    return true;
  }
  const decelerating = hasId("gravity-decelerate") || (id === "/api/gravity-time" && mode === "decelerate");
  if (decelerating) {
    ctx.translate(-facing * impulse * 3.6 * motionScale, impulse * 5.2 * motionScale);
    ctx.rotate(-facing * impulse * 0.036 * motionScale);
    ctx.scale(1 + impulse * 0.045 * motionScale, 1 - impulse * 0.05 * motionScale);
    return true;
  }
  if (hasId("action-teleport") || id === "/api/teleport") {
    const vanish = Math.sin(clamp(progress / 0.62, 0, 1) * Math.PI);
    ctx.translate(facing * (ease - 0.5) * 5 * motionScale, -vanish * 3.5 * motionScale);
    ctx.rotate(facing * (progress - 0.5) * 0.05 * motionScale);
    ctx.scale(1 - vanish * 0.075 * motionScale, 1 + vanish * 0.04 * motionScale);
    return true;
  }
  if (hasId("fighter-energy-charge")) {
    const gather = objectEffectEase(clamp(progress / 0.7, 0, 1));
    ctx.translate(0, gather * 2.8 * motionScale);
    ctx.scale(1 - gather * 0.03 * motionScale, 1 + gather * 0.04 * motionScale);
    return true;
  }
  if (hasId("emp") || id === "/api/emp") {
    const polarity = mode.includes("negative") ? -1 : 1;
    ctx.translate(facing * polarity * impulse * 4 * motionScale, -impulse * 2.2 * motionScale);
    ctx.rotate(facing * polarity * impulse * 0.048 * motionScale);
    ctx.scale(1 + impulse * 0.032 * motionScale, 1 - impulse * 0.022 * motionScale);
    return true;
  }
  if (hasId("action-vibe-coding")) {
    const step = Math.sin(progress * Math.PI * 4) * impulse;
    ctx.translate(facing * step * 3.2 * motionScale, -Math.abs(step) * 1.8 * motionScale);
    ctx.rotate(facing * step * 0.026 * motionScale);
    return true;
  }
  if (hasId("quantum-") || id === "/api/quantum-control") {
    const cold = id.includes("cold") || mode === "kinetic-decelerate";
    const hot = id.includes("hot") || mode === "kinetic-accelerate";
    const nuclear = id.includes("nuclear") || ["nuclear-fission", "nuclear-fusion"].includes(mode);
    const direction = cold ? -1 : 1;
    ctx.translate(facing * direction * impulse * (nuclear ? 2 : 4.5) * motionScale, (cold ? 3.5 : -3.5) * impulse * motionScale);
    ctx.rotate(facing * direction * impulse * (nuclear ? 0.02 : 0.055) * motionScale);
    ctx.scale(
      1 + impulse * (nuclear ? 0.06 : hot ? 0.045 : -0.028) * motionScale,
      1 + impulse * (nuclear ? 0.06 : hot ? 0.025 : 0.04) * motionScale
    );
    return true;
  }
  return false;
}

function applyPhysicalActionTransform(kind, progress, flip, motionId = kind, spatialScale = 1, variant = "") {
  const impulse = Math.sin(clamp(progress, 0, 1) * Math.PI);
  const facing = flip ? -1 : 1;
  const signature = physicalMotionSignature(motionId, kind);
  const motionScale = clamp(Number(spatialScale) || 0, 0.1, 1);
  const abilitySpecific = applyAbilitySpecificPhysicalTransform(kind, progress, facing, motionId, motionScale, variant);
  if (abilitySpecific) {
    // Ability-specific choreography already applies the authored displacement.
  } else if (kind === "attack") {
    ctx.translate(facing * impulse * 7 * motionScale, -impulse * 1.4 * motionScale);
    ctx.rotate(facing * impulse * 0.035 * motionScale);
  } else if (kind === "throw") {
    const windup = objectEffectEase(clamp(progress / 0.4, 0, 1));
    const release = objectEffectEase(clamp((progress - 0.36) / 0.3, 0, 1));
    const followThrough = Math.sin(clamp((progress - 0.52) / 0.48, 0, 1) * Math.PI);
    ctx.translate(facing * (-windup * 5 + release * 12) * motionScale, (-release * 3.5 + followThrough * 1.5) * motionScale);
    ctx.rotate(facing * (-windup * 0.045 + release * 0.09 - followThrough * 0.025) * motionScale);
    ctx.scale(1 - followThrough * 0.018 * motionScale, 1 + followThrough * 0.028 * motionScale);
  } else if (kind === "slash") {
    const strike = Math.sin(clamp((progress - 0.2) / 0.55, 0, 1) * Math.PI);
    ctx.translate(facing * strike * 10 * motionScale, -strike * 2.5 * motionScale);
    ctx.rotate(facing * strike * 0.065 * motionScale);
  } else if (kind === "evade") {
    ctx.translate(-facing * impulse * 12 * motionScale, -impulse * 4 * motionScale);
    ctx.rotate(-facing * impulse * 0.055 * motionScale);
  } else if (kind === "cast") {
    ctx.translate(0, -impulse * 5 * motionScale);
    ctx.scale(1 + impulse * 0.025 * motionScale, 1 - impulse * 0.018 * motionScale);
  } else if (kind === "heal") {
    ctx.translate(0, -impulse * 3 * motionScale);
    ctx.scale(1 + impulse * 0.018 * motionScale, 1 + impulse * 0.035 * motionScale);
  } else if (kind === "power") {
    const charge = clamp(progress / 0.65, 0, 1);
    ctx.translate(0, -Math.sin(charge * Math.PI) * 4 * motionScale);
    ctx.scale(1 + charge * 0.045 * motionScale, 1 + charge * 0.045 * motionScale);
  } else if (kind === "focus") {
    ctx.translate(0, Math.sin(progress * Math.PI * 2) * 1.5 * motionScale);
  } else if (kind === "rest") {
    ctx.translate(0, objectEffectEase(progress) * 3 * motionScale);
    ctx.scale(1 + impulse * 0.012 * motionScale, 1 - impulse * 0.02 * motionScale);
  } else if (kind === "interact") {
    ctx.translate(facing * impulse * 2.5 * motionScale, -impulse * 1.2 * motionScale);
  } else if (kind === "reload") {
    ctx.translate(0, Math.sin(progress * Math.PI * 2) * 1.5 * motionScale);
    ctx.rotate(facing * Math.sin(progress * Math.PI * 2) * 0.012 * motionScale);
  } else if (kind === "jump") {
    ctx.translate(facing * progress * 5 * motionScale, -Math.sin(progress * Math.PI) * 24 * motionScale);
    ctx.scale(1 - impulse * 0.035 * motionScale, 1 + impulse * 0.055 * motionScale);
  }
  const uniqueWave = Math.sin(clamp(progress, 0, 1) * Math.PI * signature.frequency) * impulse;
  ctx.translate(
    facing * uniqueWave * signature.sway * 2.4 * motionScale,
    uniqueWave * signature.lift * 1.65 * motionScale
  );
  ctx.rotate(facing * uniqueWave * signature.twist * 0.012 * motionScale);
}

function drawPhysicalActionSprite(player, data, ghost, action) {
  if (action?.kind === "shoot" && drawWeaponFireMotion(player, data, ghost, action)) return true;
  if (action?.kind === "weapon-switch" && drawWeaponSwitchMotion(player, data, ghost, action)) return true;
  if (action?.kind === "reload" && drawWeaponReloadMotion(player, data, ghost, action)) return true;
  if (!Object.hasOwn(PHYSICAL_ACTION_SEQUENCE, action?.kind)) return false;
  const skinId = displayedSkinId(player, data);
  const atlasId = player.isBot ? "male-bot" : skinId === "blue-dress" ? "blue-dress" : "white-hood";

  const normalizedProgress = clamp(Number(action.progress) || 0, 0, 1);
  const dynamics = accelerationReadyMotionDynamics(player, action.kind, action.motionId);
  const rawPhase = physicalActionFramePosition(action.kind, normalizedProgress, action.motionId);
  const phase = 1 + (rawPhase - 1) * dynamics.poseTravel;
  const frame = Math.min(2, Math.max(0, Math.round(phase)));
  const motionImage = state.textures.physicalActionMotions?.[atlasId]?.[action.kind];
  const sourceVersion = atlasId === "male-bot"
    ? (action.kind === "heart-transfer" ? "v468" : "v465")
    : "v483";
  const sourceKey = `physical-motion-${atlasId}-${action.kind}-${sourceVersion}`;
  const prepared = motionImage ? transparentSpriteSource(motionImage, sourceKey, 20) : null;
  const sprite = prepared
    ? normalizedSpriteFrame(prepared, sourceKey, 3, 1, 0, frame)
    : null;
  if (!sprite) return false;

  const facing = facingFor(player, motionFor(player, data));
  const flip = facing === "left";
  const actionHeight = action.kind === "rest" || action.kind === "focus" ? 88 : 98;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = IMAGE_SMOOTHING_QUALITY;
  applyPhysicalActionTransform(action.kind, normalizedProgress, flip, action.motionId, dynamics.spatialScale, action.variant);
  drawNormalizedSprite(sprite, 0, 31, 98, actionHeight, flip);
  ctx.restore();
  drawNameplate(player, ghost, -78);
  return true;
}

function gunnerWeaponMotionSprite(player, data, weaponId, actionId, progress) {
  if (!GUNNER_WEAPON_MOTION_IDS.includes(weaponId)) return null;
  const skinId = player.isBot ? "male-bot" : displayedSkinId(player, data) === "blue-dress" ? "blue-dress" : "white-hood";
  const image = state.textures.weaponActionMotions?.[skinId]?.[weaponId]?.[actionId];
  const version = skinId === "male-bot" ? "v313" : "v483";
  const sourceKey = `weapon-motion-${skinId}-${weaponId}-${actionId}-${version}`;
  const prepared = image ? transparentSpriteSource(image, sourceKey, 20) : null;
  const frame = skinId === "male-bot"
    ? 0
    : progress < 0.32 ? 0 : progress < 0.72 ? 1 : 2;
  return prepared
    ? normalizedSpriteFrame(prepared, sourceKey, skinId === "male-bot" ? 1 : 3, 1, 0, frame)
    : null;
}

function drawWeaponReloadMotion(player, data, ghost, action) {
  const gunnerState = displayedGunnerState(player, data);
  const weaponId = gunnerWeaponIdFromActionVariant(action?.variant, gunnerState.reloadWeapon);
  const progress = clamp(Number(action.progress) || 0, 0, 1);
  const sprite = gunnerWeaponMotionSprite(player, data, weaponId, "reload", progress);
  if (!sprite) return false;

  const profile = {
    handgun: { width: 108, lower: 9.0, side: 5.0, roll: 7.5, magazine: 3.0, chamber: 2.0, checks: 1 },
    smg: { width: 116, lower: 11.0, side: 8.0, roll: 5.2, magazine: 6.0, chamber: 3.0, checks: 2 },
    assault: { width: 128, lower: 12.5, side: 10.0, roll: 4.1, magazine: 7.5, chamber: 4.5, checks: 2 },
    sniper: { width: 146, lower: 7.0, side: 15.0, roll: 2.6, magazine: 3.5, chamber: 8.0, checks: 1 },
    taser: { width: 108, lower: 5.5, side: 4.0, roll: 9.0, magazine: 2.0, chamber: 1.5, checks: 3 }
  }[weaponId];
  const lowerIn = Math.sin(clamp(progress / 0.34, 0, 1) * Math.PI / 2);
  const raiseOut = 1 - Math.sin(clamp((progress - 0.68) / 0.32, 0, 1) * Math.PI / 2);
  const lowered = lowerIn * raiseOut;
  const magazineSeat = Math.sin(clamp((progress - 0.16) / 0.55, 0, 1) * Math.PI);
  const chamberCheck = Math.sin(clamp((progress - 0.64) / 0.36, 0, 1) * Math.PI);
  const weaponCheck = Math.sin(progress * Math.PI * profile.checks) * Math.sin(progress * Math.PI);
  const facing = facingFor(player, motionFor(player, data));
  const flip = facing === "left";
  const direction = flip ? 1 : -1;
  const dynamics = accelerationReadyMotionDynamics(player, "reload", action.motionId);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = IMAGE_SMOOTHING_QUALITY;
  ctx.translate(
    direction * (profile.side * magazineSeat - profile.chamber * chamberCheck + weaponCheck * 0.8) * dynamics.spatialScale,
    (profile.lower * lowered - chamberCheck * 1.8) * dynamics.spatialScale
  );
  ctx.rotate(direction * (profile.roll * lowered - profile.roll * 0.28 * chamberCheck) * Math.PI / 180 * dynamics.spatialScale);
  ctx.scale(
    1 + magazineSeat * profile.magazine * 0.0014 * dynamics.spatialScale,
    1 - magazineSeat * profile.magazine * 0.0010 * dynamics.spatialScale
  );
  drawNormalizedSprite(sprite, 0, 31, profile.width, 98, flip);
  ctx.restore();
  drawNameplate(player, ghost, -78);
  return true;
}

function drawWeaponSwitchMotion(player, data, ghost, action) {
  const gunnerState = displayedGunnerState(player, data);
  const weaponId = GUNNER_WEAPON_MOTION_IDS.includes(action?.variant)
    ? action.variant
    : (GUNNER_WEAPON_MOTION_IDS.includes(gunnerState.selectedWeapon) ? gunnerState.selectedWeapon : "");
  const progress = clamp(Number(action.progress) || 0, 0, 1);
  const sprite = gunnerWeaponMotionSprite(player, data, weaponId, "switch", progress);
  if (!sprite) return false;
  const easeOut = 1 - Math.pow(1 - progress, 3);
  const settle = Math.sin(progress * Math.PI);
  const profile = {
    handgun: { width: 108, drawX: 7, drawY: 13, lift: 3.2, roll: 2.8, brace: 1.2 },
    smg: { width: 116, drawX: 10, drawY: 10, lift: 2.2, roll: 1.4, brace: 2.3 },
    assault: { width: 128, drawX: 13, drawY: 9, lift: 2.8, roll: 1.9, brace: 3.1 },
    sniper: { width: 146, drawX: 17, drawY: 7, lift: 1.7, roll: 1.1, brace: 4.6 },
    taser: { width: 108, drawX: 6, drawY: 14, lift: 3.8, roll: 3.4, brace: 0.8 }
  }[weaponId];
  const facing = facingFor(player, motionFor(player, data));
  const flip = facing === "left";
  const dynamics = accelerationReadyMotionDynamics(player, "weapon-switch", action.motionId);
  const direction = flip ? 1 : -1;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = IMAGE_SMOOTHING_QUALITY;
  ctx.translate(
    direction * ((1 - easeOut) * profile.drawX + settle * profile.brace) * dynamics.spatialScale,
    ((1 - easeOut) * profile.drawY - settle * profile.lift) * dynamics.spatialScale
  );
  ctx.rotate(direction * (1 - easeOut) * profile.roll * Math.PI / 180 * dynamics.spatialScale);
  drawNormalizedSprite(sprite, 0, 31, profile.width, 98, flip);
  ctx.restore();
  drawNameplate(player, ghost, -78);
  return true;
}

function drawWeaponFireMotion(player, data, ghost, action) {
  const gunnerState = displayedGunnerState(player, data);
  const weaponId = GUNNER_WEAPON_MOTION_IDS.includes(action?.variant)
    ? action.variant
    : (GUNNER_WEAPON_MOTION_IDS.includes(gunnerState.firingWeapon) ? gunnerState.firingWeapon : "");
  if (!weaponId) return false;
  const progress = clamp(Number(action.progress) || 0, 0, 1);
  const sprite = gunnerWeaponMotionSprite(player, data, weaponId, "fire", progress);
  if (!sprite) return false;
  const profile = {
    handgun: { width: 108, recoil: 2.2, lift: 0.7, rotation: 1.6, pulses: 1, brace: 0.8 },
    smg: { width: 116, recoil: 1.35, lift: 0.45, rotation: 0.65, pulses: 4, brace: 1.8 },
    assault: { width: 128, recoil: 2.0, lift: 0.6, rotation: 1.0, pulses: 2, brace: 2.4 },
    sniper: { width: 146, recoil: 4.8, lift: 1.0, rotation: 2.2, pulses: 1, brace: 3.6 },
    taser: { width: 108, recoil: 0.65, lift: 0.25, rotation: 0.35, pulses: 2, brace: 0.3 }
  }[weaponId] || { width: 108, recoil: 1.5, lift: 0.5, rotation: 0.8, pulses: 1, brace: 1 };
  const mainImpulse = Math.sin(progress * Math.PI);
  const burstImpulse = profile.pulses > 1
    ? (0.66 + Math.max(0, Math.sin(progress * Math.PI * profile.pulses * 2)) * 0.34) * mainImpulse
    : mainImpulse;
  const settle = Math.sin(Math.min(1, progress * 1.45) * Math.PI);
  // The projectile and muzzle flash follow aimX/aimY. Keep the authored
  // side-facing firearm pose on the same horizontal side even when the player
  // is stationary or moving away from the shot direction.
  const facing = gunnerFiringFacingFor(player, data);
  const flip = facing === "left";
  const dynamics = accelerationReadyMotionDynamics(player, "shoot", action.motionId);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = IMAGE_SMOOTHING_QUALITY;
  ctx.translate(
    (flip ? 1 : -1) * (profile.brace * settle + profile.recoil * burstImpulse) * dynamics.spatialScale,
    -profile.lift * burstImpulse * dynamics.spatialScale
  );
  ctx.rotate((flip ? -1 : 1) * burstImpulse * profile.rotation * Math.PI / 720 * dynamics.spatialScale);
  ctx.scale(
    1 - mainImpulse * profile.recoil * 0.0018 * dynamics.spatialScale,
    1 + mainImpulse * profile.recoil * 0.0012 * dynamics.spatialScale
  );
  drawNormalizedSprite(sprite, 0, 31, profile.width, 98, flip);
  ctx.restore();
  drawNameplate(player, ghost, -78);
  return true;
}

const WALK_MOTION_PROFILES = Object.freeze({
  slow: Object.freeze({
    strideDistance: 59,
    poseSequence: Object.freeze([0, 1, 0, 0, 2, 0]),
    operatorSequence: Object.freeze([0, 0, 1, 1, 2, 2, 3, 3, 2, 2, 1, 1]),
    lift: 0.8,
    sideSway: 0.28,
    frontSway: 0.42,
    sideLean: 0.003,
    frontLean: 0.002,
    directionalLean: 0,
    stepSoundMinInterval: 300
  }),
  walk: Object.freeze({
    strideDistance: 78,
    poseSequence: Object.freeze([0, 1, 0, 2]),
    operatorSequence: Object.freeze([0, 1, 2, 3, 2, 1, 0, 3]),
    lift: 2.2,
    sideSway: 0.75,
    frontSway: 1.1,
    sideLean: 0.01,
    frontLean: 0.006,
    directionalLean: 0,
    stepSoundMinInterval: 170
  }),
  dash: Object.freeze({
    strideDistance: 94,
    poseSequence: Object.freeze([1, 1, 1, 0, 2, 2, 2, 0]),
    operatorSequence: Object.freeze([0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3]),
    lift: 3.4,
    sideSway: 1.05,
    frontSway: 1.45,
    sideLean: 0.012,
    frontLean: 0.008,
    directionalLean: 0.022,
    stepSoundMinInterval: 115
  })
});

function normalizeWalkMotionMode(value) {
  return value === "slow" || value === "dash" ? value : "walk";
}

function walkMotionProfile(value) {
  return WALK_MOTION_PROFILES[normalizeWalkMotionMode(value)];
}

function walkMotionPose(value, frame, moving) {
  if (!moving) return 0;
  const sequence = walkMotionProfile(value).poseSequence;
  const phase = ((Number(frame) % 60) + 60) % 60 / 60;
  return sequence[Math.min(sequence.length - 1, Math.floor(phase * sequence.length))];
}

function walkBodyMotion(value, direction, frame, moving) {
  if (!moving) return { lift: 0, sway: 0, lean: 0 };
  const profile = walkMotionProfile(value);
  const gaitPhase = ((Number(frame) % 60) + 60) % 60 / 60 * Math.PI * 2;
  const contact = 0.5 - Math.cos(gaitPhase * 2) * 0.5;
  const stride = Math.sin(gaitPhase);
  const sideFacing = direction === "left" || direction === "right";
  const directionSign = direction === "left" ? -1 : direction === "right" ? 1 : 0;
  return {
    lift: contact * profile.lift,
    sway: stride * (sideFacing ? profile.sideSway : profile.frontSway),
    lean: directionSign * profile.directionalLean + stride * (sideFacing ? profile.sideLean : profile.frontLean)
  };
}

function walkMotionMode(player) {
  if (player?.id === state.data?.selfId) {
    const canDash = isDashing() && Number(state.data?.self?.stamina || 0) > 0.5;
    return canDash ? "dash" : isSlowWalking() ? "slow" : "walk";
  }
  return normalizeWalkMotionMode(player?.movementMode);
}

function drawPetSprite(player, data, ghost) {
  const skinId = displayedSkinId(player, data);
  const motion = motionFor(player, data);
  const facing = facingFor(player, motion);
  const direction = { down: "front", left: "left", right: "right", up: "back" }[facing] || "front";
  const movementMode = walkMotionMode(player);
  const frame = walkAnimationFrame(player, motion, movementMode);
  const walkRowSource = state.textures.playerWalkRows?.[skinId]?.[direction];
  const walkRowKey = `skinWalk3-${skinId}-${direction}-v483`;
  const walkRow = walkRowSource ? transparentSpriteSource(walkRowSource, walkRowKey, 12) : null;
  if (walkRow) {
    drawMinimalWalkFrame(walkRow, walkRowKey, direction, frame, motion.moving, movementMode, -47, -63, 94, 94);
    drawNameplate(player, ghost, -78);
    return true;
  }
  if (skinId === "blue-dress") {
    const skinSet = state.textures.playerSkins[skinId];
    const directional = transparentSpriteSource(skinSet?.[direction], `playerSkin-${skinId}-${direction}`, 24);
    if (directional && drawStandaloneWalkFrame(directional, `playerSkin-${skinId}-${direction}`, frame, -47, -63, 94, 94)) {
      drawNameplate(player, ghost, -78);
      return true;
    }
    const master = transparentSpriteSource(state.textures.blueDressMaster, "blueDressMaster", 24);
    if (master) {
      drawMasterWalkFrame(master, direction, frame, -47, -63, 94, 94);
      drawNameplate(player, ghost, -78);
      return true;
    }
  }
  const skinWalkSource = state.textures.playerWalkAtlases?.[skinId];
  const skinWalkAtlas = skinWalkSource ? transparentSpriteSource(skinWalkSource, `skinWalk60-${skinId}`, 12) : null;
  if (skinWalkAtlas) {
    drawBlendedWalkFrame(skinWalkAtlas, direction, frame, -47, -63, 94, 94);
    drawNameplate(player, ghost, -78);
    return true;
  }
  const atlas = transparentSpriteSource(state.textures.playerWalk60, "playerWalk60", 24);
  if (!atlas) return false;
  drawBlendedWalkFrame(atlas, direction, frame, -47, -63, 94, 94);
  drawNameplate(player, ghost, -78);
  return true;
}

function walkAnimationFrame(player, motion, requestedMode = walkMotionMode(player)) {
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
  if (motion.moving) {
    if (!animation.moving) {
      animation.frame = 0;
      animation.x = player.x;
      animation.y = player.y;
    }
    const movementMode = normalizeWalkMotionMode(requestedMode);
    const profile = walkMotionProfile(movementMode);
    const strideDistance = profile.strideDistance;
    const travelled = Math.hypot(player.x - animation.x, player.y - animation.y);
    // Drive the gait from actual rendered displacement. Input against a wall
    // no longer runs the legs in place, and acceleration raises cadence only
    // because the character really covers more ground.
    const discontinuityDistance = Math.max(360, strideDistance * 4);
    if (travelled <= discontinuityDistance) {
      // Render prediction and remote interpolation can legitimately cover more
      // than 42% of a stride between samples, especially under acceleration.
      // Preserve all ordinary displacement and reject only an actual teleport.
      animation.frame = (animation.frame + travelled / strideDistance * 60) % 60;
    } else {
      animation.frame = 0;
    }
    const stepPose = walkMotionPose(movementMode, animation.frame, true);
    if (player.id === state.data?.selfId && player.alive && stepPose > 0 && stepPose !== animation.stepBucket && now - animation.lastStepAt > profile.stepSoundMinInterval) {
      animation.stepBucket = stepPose;
      animation.lastStepAt = now;
      if (movementMode !== "slow") playSound(movementMode === "dash" ? "dashStep" : "step");
    } else if (stepPose === 0) {
      animation.stepBucket = 0;
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
  const contact = 0.5 - Math.cos(phase * 2) * 0.5;
  const sideFacing = direction === 1 || direction === 2;
  const lateral = stride * (sideFacing ? 0.72 : 0.34);
  const bob = contact * 0.72;
  const lean = stride * (sideFacing ? 0.0065 : 0.0035);
  const compression = contact * 0.006;
  const scale = Math.min(width / sprite.width, height / sprite.height);
  const drawWidth = sprite.width * scale;
  const drawHeight = sprite.height * scale;
  const centerX = x + width / 2;
  const bottomY = y + height;

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = IMAGE_SMOOTHING_QUALITY;
  ctx.translate(centerX + lateral, bottomY - bob);
  ctx.rotate(lean);
  ctx.scale(1 + compression, 1 - compression);
  ctx.drawImage(
    sprite,
    0,
    0,
    sprite.width,
    sprite.height,
    -drawWidth / 2,
    -drawHeight,
    drawWidth,
    drawHeight
  );
  ctx.restore();
}

function drawMinimalWalkFrame(atlas, key, direction, frame, moving, movementMode, x, y, width, height) {
  // Each direction is one independent horizontal row: neutral, one foot, the
  // opposite foot. Slow, normal, and dash use distinct contact timing and body
  // dynamics while real rendered displacement remains the only clock.
  const profile = walkMotionProfile(movementMode);
  const poseIndex = walkMotionPose(movementMode, frame, moving);
  const body = walkBodyMotion(movementMode, direction, frame, moving);
  if (IS_VERIFICATION_MODE) {
    els.canvas.dataset.walkPose = String(poseIndex);
    els.canvas.dataset.walkGaitFrame = Number(frame).toFixed(2);
    els.canvas.dataset.walkDirection = String(direction);
    els.canvas.dataset.walkTexture = key;
    els.canvas.dataset.walkMode = normalizeWalkMotionMode(movementMode);
    els.canvas.dataset.walkStrideDistance = String(profile.strideDistance);
    els.canvas.dataset.walkLift = body.lift.toFixed(3);
    els.canvas.dataset.walkLean = body.lean.toFixed(4);
  }
  const sprite = normalizedSpriteFrame(atlas, key, 3, 1, 0, poseIndex);
  if (!sprite) return false;
  ctx.save();
  ctx.translate(body.sway, 0);
  ctx.rotate(body.lean);
  drawNormalizedSprite(sprite, x + width / 2, y + height - body.lift, width, height);
  ctx.restore();
  return true;
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
  const movementMode = walkMotionMode(player);
  const profile = walkMotionProfile(movementMode);
  const sequence = profile.operatorSequence;
  const frame = walkAnimationFrame(player, motion, movementMode);
  const phase = frame / 60 * sequence.length;
  const index = Math.floor(phase) % sequence.length;
  const nextIndex = (index + 1) % sequence.length;
  const blend = phase - Math.floor(phase);
  const row = 0;
  const sprite = normalizedSpriteFrame(atlas, "operatorsWalk", 4, 2, row, sequence[index]);
  const nextSprite = normalizedSpriteFrame(atlas, "operatorsWalk", 4, 2, row, sequence[nextIndex]);
  if (!sprite || !nextSprite) return false;
  const facing = facingFor(player, motion);
  const direction = { down: "front", left: "left", right: "right", up: "back" }[facing] || "front";
  const body = walkBodyMotion(movementMode, direction, frame, motion.moving);
  ctx.save();
  ctx.translate(body.sway * 0.75, -body.lift * 0.75);
  ctx.rotate(body.lean * 0.8);
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
  ctx.restore();
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
  const manaGaugeMax = Math.max(2, Number(self.maxMana) || 2);
  const accelerationMultiplier = Math.max(1, Number(self.accelerationMultiplier) || 1);
  const movementAccEnabled = self.movementAccEnabled !== false;
  const movementAccThreshold = Math.max(1, Number(self.movementAccThreshold) || 2);
  const movementAccMax = Math.max(1, Number(self.movementAccMax) || 2);
  const movementAccActive = self.movementAccActive === true || (
    self.movementAccActive == null && movementAccEnabled && accelerationMultiplier + 1e-6 >= movementAccThreshold && Number(self.movementAcc) > 1.5
  );
  const healthText = baseHealth > 0 && baseHealth < 0.001
    ? baseHealth.toFixed(4)
    : baseHealth.toFixed(1).replace(/\.0$/, "");
  const bars = [
    { label: "SP", value: self.fighterInfiniteResources ? maxStamina : Math.max(0, stamina), max: maxStamina, color: stamina <= 0 ? "#fb7185" : "#22c55e", text: self.fighterInfiniteResources ? "∞" : `${Math.round(stamina)}/${Math.round(maxStamina)}` },
    { label: "MP", value: self.fighterInfiniteResources ? manaGaugeMax : Math.max(0, mana), max: manaGaugeMax, color: self.mentalState === "理知" ? "#a78bfa" : self.mentalState === "気概" ? "#fbbf24" : "#fb7185", text: self.fighterInfiniteResources ? "∞" : `${Math.round(mana * 100) / 100}/${Math.round(manaGaugeMax * 100) / 100}` },
    { label: "HP", value: self.fighterInfiniteResources ? 2 : baseHealth, max: 2, color: baseHealth >= 1.5 ? "#22c55e" : baseHealth >= 0.65 ? "#f59e0b" : "#f43f5e", text: self.fighterInfiniteResources ? "∞" : `${healthText}/2${overheal ? `+${overheal}` : ""}` }
  ];
  if (IS_VERIFICATION_MODE) {
    const hudProbe = JSON.stringify({
      bars: bars.map((bar) => bar.label),
      compactShortening: self.special === "alchemist",
      operator: self.special || ""
    });
    if (document.documentElement.getAttribute("data-v528-hud-contract") !== hudProbe) {
      document.documentElement.setAttribute("data-v528-hud-contract", hudProbe);
    }
  }
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
  const desireOffset = self.desireBiasLabel ? 34 : 0;
  const height = detailTop + vibeCodingOffset + desireOffset + (idea > 0 ? 104 : 86);

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
  const fighterEcText = hasDisplayedOperatorAccess(self, "fighter")
    ? `   EC ${Math.max(0, Math.floor(Number(self.fighterEnergyCharge) || 0))}`
    : "";
  const movementAccText = ` / 移動固定 ${movementAccActive ? `ACC${movementAccMax.toFixed(0)}` : movementAccEnabled ? "待機" : "OFF"}`;
  ctx.fillText(`ACC ×${accelerationMultiplier.toFixed(2)}${movementAccText}${fighterEcText}`, 27, detailTop);
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
  if (self.special === "alchemist") {
    ctx.fillStyle = "#22d3ee";
    ctx.fillText(`短縮 ${(Math.max(0, Number(self.manaGpuCooldownCreditMs) || 0) / 1000).toFixed(1)}s`, 127, detailTop + 38);
  }
  if (self.special === "alchemist") drawReadyText("VIBE", vibeCodingCooldownRemaining, 27, detailTop + 38);
  const resourceOffset = vibeCodingOffset;
  ctx.fillStyle = "#fbbf24";
  ctx.fillText(`${Math.round(Number(self.credits) || 0)}C`, 27, detailTop + 38 + resourceOffset);
  ctx.fillStyle = Number(self.luck || 0) >= 0 ? "#f0abfc" : "#fb7185";
  ctx.fillText(`幸運／直観 ${Number(self.luck || 0).toFixed(2)}`, 27, detailTop + 56 + resourceOffset);
  ctx.fillStyle = "#e2e8f0";
  const mind = self.mentalPoints || {};
  ctx.fillText(`心状態:${self.mentalState || "気概"}（MP${Number(mind.manaPoints) || 0}+SP${Number(mind.staminaPoints) || 0}=${Number(mind.total) || 0} / 上限比）`, 27, detailTop + 74 + resourceOffset);
  if (self.desireBiasLabel) {
    ctx.fillStyle = "#fb7185";
    ctx.fillText(self.desireBiasLabel, 27, detailTop + 92 + resourceOffset);
    ctx.font = "700 9px Segoe UI, sans-serif";
    ctx.fillStyle = "#fecdd3";
    ctx.fillText(String(self.desireBiasDetail || "").slice(0, 34), 27, detailTop + 108 + resourceOffset);
  }
  if (idea > 0 && !self.ideaBlockedByDesire) {
    const ideaLabel = ["真/美", "真/美", "善", "善のイデア"][Math.min(3, Number(self.ideaStage) || 0)];
    ctx.fillStyle = "#fde68a";
    ctx.fillText(`${ideaLabel} ${idea}s`, 27, detailTop + 92 + resourceOffset + desireOffset);
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
  if (data.self.hackTracking || data.self.hackEffective) {
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
  if (data.self.hackTracking || data.self.hackEffective) {
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
const version = "mana-conversion-luck-headshot-quantum-electric-v554";
  const pendingSources = [];
  const defer = (entry, path) => {
    pendingSources.push([entry, assetUrl(`${path}?v=${version}`)]);
    return entry;
  };
  const image = (path) => {
    const entry = new Image();
    return defer(entry, path);
  };
  const eagerImage = (path) => {
    const entry = new Image();
    entry.src = assetUrl(`${path}?v=${version}`);
    return entry;
  };
  const imageSet = (paths) => paths.map(image);
  const operators = new Image();
  const operatorsWalk = new Image();
  const playerMaster = new Image();
  const playerWalk60 = new Image();
  const blueDressMaster = new Image();
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
    "assets/generated/teleport-map-scroll-acquisition-ate-v495.png",
    "assets/generated/alchemy-effect-grit-v311.png",
    "assets/generated/alchemy-effect-reason-v311.png"
  ]);
  const empResonanceEffect = new Image();
  const empCancelEffect = new Image();
  const heartTeleportEffect = eagerImage("assets/generated/heart-transfer-fist-glow-ate-v468.png");
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
  const fighterSlashEffect = new Image();
  const fighterEnergyChargeEffect = new Image();
  const itemIaiTexture = new Image();
  const instantStandFirmTexture = philosophyEffectTextures[4];
  const instantPushTexture = philosophyEffectTextures[5];
  const instantStaminaTexture = alchemyEffectTextures[5];
  const instantHealTexture = alchemyEffectTextures[6];
  const instantFireTexture = alchemyEffectTextures[7];
  const instantSubstitutionTexture = alchemyEffectTextures[8];
  const instantWarpTexture = new Image();
  const teleportMapScrollAcquisitionTexture = new Image();
  const instantEvadeTexture = actionEffectTextures[2];
  const instantMysteryTexture = philosophyEffectTextures[10];
  const instantManaTexture = alchemyEffectTextures[2];
  const fighterDestructionSlashMilestoneEffect = new Image();
  const fighterEnergyReleaseEffect = new Image();
  const fighterEnergyImpactEffect = new Image();
  const fighterShockwaveEffect = new Image();
  const standFirmMarkerEffect = instantStandFirmTexture;
  const pushMarkerEffect = instantPushTexture;
  const floraHealV1 = new Image();
  const floraSunbeamV3 = new Image();
  const floraInvisibleV527 = new Image();
  const tacticalSystemsAtlas = new Image();
  const gravityStorm = new Image();
  const gravityStormSafeEye = new Image();
  const luminousMeetingEffect = new Image();
  const attackerAllyMarker = new Image();
  const hackerRootMatrix = new Image();
  const gravityTimeKeeperEffect = new Image();
  const fireJutsuFieldEffect = new Image();
  const substitutionFieldEffect = new Image();
  const limitBreakFieldEffect = new Image();
  const limitBreakReleaseEffect = new Image();
  const alchemyExcaliburEffect = new Image();
  const accelerationPhaseEffect = new Image();
  const instantSpeedTexture = accelerationPhaseEffect;
  const statusLevitationEffect = new Image();
  const preparationBarrierEffect = new Image();
  const humanTransmutationEffect = new Image();
  const statusHpReductionEffect = new Image();
  const statusManaGpuEffect = new Image();
  const vibeCodingEffect = new Image();
  const hsgItemTexture = new Image();
  const gunnerSpecialAmmoEffects = {
    weak: new Image(),
    penetrate: new Image(),
    shock: new Image()
  };
  const gunnerRpgEffect = new Image();
  const gunnerMissileEffect = new Image();
  const quantumTransmutationEffect = new Image();
  const quantumColdEffect = new Image();
  const quantumHotEffect = new Image();
  const quantumNuclearEffect = new Image();
  const quantumNuclearFusion = new Image();
  const quantumElectricDischarge = new Image();
  const hazardPoisonEffect = new Image();
  const hazardWaterEffect = new Image();
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
  const naturalRecoveryEffect = new Image();
  const gboOverdriveEffect = new Image();
  const playerWalkRows = Object.fromEntries(["blue-dress", "white-hood"].map((skinId) => [
    skinId,
    Object.fromEntries(["front", "left", "right", "back"].map((direction) => [direction, new Image()]))
  ]));
  const itemTextures = Object.fromEntries([
    "gold", "mercury", "lead", "uranium", "plutonium", "mineral-water", "antidote", "molotov", "ice", "heated-water"
  ].map((id) => [id, image(id === "gold" ? "assets/generated/item-gold-ingot-v436.png" : `assets/generated/item-${id}.webp`)]));
  itemTextures.seawater = image("assets/generated/item-seawater-v522.png");
  const groundFirearmIcons = image("assets/generated/gunner-weapon-icons-v422.webp");
  const groundItemTextures = {
    taser: image("assets/generated/gunner-taser.webp"),
    "orichalcum-sword": image("assets/generated/item-orichalcum-sword-v453.png"),
    excalibur: image("assets/generated/alchemy-excalibur.webp"),
    railgun: image("assets/generated/alchemy-railgun.webp"),
    "particle-cannon": image("assets/generated/alchemy-particle-cannon.webp"),
    rpg: image("assets/generated/gunner-rpg.webp"),
    missile: image("assets/generated/gunner-missile.webp")
  };
  const physicalActionMotions = Object.fromEntries(
    ["white-hood", "blue-dress", "male-bot"].map((skinId) => [
      skinId,
      Object.fromEntries(PHYSICAL_ACTION_MOTION_KINDS.map((kind) => [kind, new Image()]))
    ])
  );
  const weaponActionMotions = Object.fromEntries(
    ["white-hood", "blue-dress", "male-bot"].map((skinId) => [
      skinId,
      Object.fromEntries(GUNNER_WEAPON_MOTION_IDS.map((weaponId) => [weaponId, {
        fire: new Image(),
        switch: new Image(),
        reload: new Image()
      }]))
    ])
  );
  const fullMapComposites = {
    station: image("assets/generated/field-aurelia-corridor-objects-v317.webp"),
    outpost: image("assets/generated/field-lumina-laboratory-v458.webp")
  };
  const tacticsStoryboard = new Image();
  const tacticsPlayerHood = new Image();
  const tacticsPlayerBlue = new Image();
  const tacticsNovelMangaSymbols = Object.fromEntries(["sparkle", "idea", "cheer", "note"].map((type) => [
    type,
    eagerImage(`assets/generated/tactics-manga-${type}-v466.png`)
  ]));
  const tacticsNovelMotionKinds = ["interact", "rest", "focus", "power", "throw", "cast", "heal"];
  const tacticsNovelMotions = {
    sophia: Object.fromEntries(tacticsNovelMotionKinds.map((kind) => [kind, eagerImage(`assets/generated/physical-motion-blue-dress-${kind}-v483.png`)])),
    philia: Object.fromEntries(tacticsNovelMotionKinds.map((kind) => [kind, eagerImage(`assets/generated/physical-motion-white-hood-${kind}-v483.png`)]))
  };
  defer(operators, "assets/operators.webp");
  defer(operatorsWalk, "assets/operators-walk.webp");
  defer(playerMaster, "assets/player-master-b.webp");
  defer(playerWalk60, "assets/player-walk-60.webp");
  defer(blueDressMaster, "assets/generated/skin-blue-dress-master-chibi-v3.webp");
  defer(killCutinMaster, "assets/generated/white-hood-kill-cutin-v404.png");
  defer(blueDressKillCutin, "assets/generated/skin-blue-dress-kill-cutin.webp");
  defer(killCutin60, "assets/kill-cutin-60.webp");
  defer(empResonanceEffect, "assets/generated/emp-resonance-v398.png");
  defer(empCancelEffect, "assets/generated/emp-cancel-v311.png");
  defer(gunnerWeaponsAtlas, "assets/generated/gunner-weapons-atlas.webp");
  defer(fighterSlashEffect, "assets/generated/fighter-slash-effect.webp");
  defer(fighterEnergyChargeEffect, "assets/generated/fighter-energy-charge-ate-v404.png");
  defer(itemIaiTexture, "assets/generated/instant-iai-abstract-v451.png");
  defer(instantWarpTexture, "assets/generated/item-teleport-map-scroll-v495.png");
  defer(teleportMapScrollAcquisitionTexture, "assets/generated/teleport-map-scroll-acquisition-ate-v495.png");
  defer(fighterDestructionSlashMilestoneEffect, "assets/generated/fighter-destruction-slash-milestone-v435.png");
  defer(fighterEnergyReleaseEffect, "assets/generated/fighter-energy-release-ate-v404.png");
  defer(fighterEnergyImpactEffect, "assets/generated/fighter-energy-impact-ate-v404.png");
  defer(fighterShockwaveEffect, "assets/generated/fighter-shockwave-ate-v393.png");
  defer(floraHealV1, "assets/generated/flora-self-heal-v336.png");
  defer(floraSunbeamV3, "assets/generated/flora-sunbeam-v3-v336.png");
  defer(floraInvisibleV527, "assets/generated/flora-invisible-ate-v527.png");
  defer(tacticalSystemsAtlas, "assets/generated/tactical-systems-atlas.webp");
  defer(gravityStorm, "assets/generated/gravity-storm.webp");
  defer(gravityStormSafeEye, "assets/generated/gravity-storm-safe-eye-v320.png");
  defer(luminousMeetingEffect, "assets/generated/luminous-meeting-effect-v311.png");
  defer(attackerAllyMarker, "assets/generated/attacker-ally-marker.webp");
  defer(hackerRootMatrix, "assets/generated/hacker-root-matrix-v497.png");
  defer(gravityTimeKeeperEffect, "assets/generated/gravity-time-keeper-v497.png");
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
  defer(hsgItemTexture, "assets/generated/item-hsg-v486.png");
  defer(gunnerSpecialAmmoEffects.weak, "assets/generated/gunner-special-ammo-weak-v455.png");
  defer(gunnerSpecialAmmoEffects.penetrate, "assets/generated/gunner-special-ammo-penetrate-v455.png");
  defer(gunnerSpecialAmmoEffects.shock, "assets/generated/gunner-special-ammo-shock-v455.png");
  defer(gunnerRpgEffect, "assets/generated/gunner-rpg-v311.png");
  defer(gunnerMissileEffect, "assets/generated/gunner-missile-v311.png");
  defer(quantumTransmutationEffect, "assets/generated/effect-gold-transmutation-v436.png");
  defer(quantumColdEffect, "assets/generated/effect-quantum-cold.webp");
  defer(quantumHotEffect, "assets/generated/effect-quantum-hot.webp");
  defer(quantumNuclearEffect, "assets/generated/effect-quantum-nuclear-v311.png");
  defer(quantumNuclearFusion, "assets/generated/quantum-nuclear-fusion-ate-v522.png");
  defer(quantumElectricDischarge, "assets/generated/quantum-electric-discharge-v554.png");
  defer(hazardPoisonEffect, "assets/generated/effect-hazard-poison.webp");
  defer(hazardWaterEffect, "assets/generated/effect-hazard-water.webp");
  defer(bottleShardEffect, "assets/generated/effect-bottle-shards.webp");
  defer(footBathSparkleEffect, "assets/generated/effect-footbath-hidden-spring-godray-v359.png");
  for (const [id, entry] of Object.entries(mapObjectEffectTextures)) {
    defer(entry, id === "credits" ? "assets/generated/object-effect-credits-v438.png" : `assets/generated/object-effect-${id}-v327.png`);
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
  defer(naturalRecoveryEffect, "assets/generated/natural-recovery-ate-v510.png");
  defer(gboOverdriveEffect, "assets/generated/gbo-overdrive-ate-v513.png");
  for (const [skinId, rows] of Object.entries(playerWalkRows)) {
    ["front", "left", "right", "back"].forEach((direction) => {
      defer(rows[direction], `assets/generated/skin-${skinId}-walk-${direction}-v483.png`);
    });
  }
  for (const [skinId, motions] of Object.entries(physicalActionMotions)) {
    for (const [kind, entry] of Object.entries(motions)) {
      const version = skinId === "male-bot" ? (kind === "heart-transfer" ? "v468" : "v465") : "v483";
      defer(entry, `assets/generated/physical-motion-${skinId}-${kind}-${version}.png`);
    }
  }
  for (const [skinId, weapons] of Object.entries(weaponActionMotions)) {
    for (const [weaponId, actions] of Object.entries(weapons)) {
      for (const [actionId, entry] of Object.entries(actions)) {
        const source = skinId === "male-bot"
          ? `assets/generated/weapon-motion-${skinId}-${weaponId}-v313.webp`
          : `assets/generated/weapon-motion-${skinId}-${weaponId}-${actionId}-v483.png`;
        defer(entry, source);
      }
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
    playerWalkAtlases: {},
    playerWalkRows,
    playerWalk60,
    blueDressMaster,
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
    fighterSlashEffect,
    fighterEnergyChargeEffect,
    itemIaiTexture,
    instantStandFirmTexture,
    instantPushTexture,
    instantStaminaTexture,
    instantHealTexture,
    instantFireTexture,
    instantSubstitutionTexture,
    instantWarpTexture,
    teleportMapScrollAcquisitionTexture,
    instantEvadeTexture,
    instantSpeedTexture,
    instantMysteryTexture,
    instantManaTexture,
    fighterDestructionSlashMilestoneEffect,
    fighterEnergyReleaseEffect,
    fighterEnergyImpactEffect,
    fighterShockwaveEffect,
    standFirmMarkerEffect,
    pushMarkerEffect,
    floraHealV1,
    floraSunbeamV3,
    floraInvisibleV527,
    tacticalSystemsAtlas,
    gravityStorm,
    gravityStormSafeEye,
    luminousMeetingEffect,
    attackerAllyMarker,
    hackerRootMatrix,
    gravityTimeKeeperEffect,
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
    hsgItemTexture,
    gunnerSpecialAmmoEffects,
    gunnerRpgEffect,
    gunnerMissileEffect,
    quantumTransmutationEffect,
    quantumColdEffect,
    quantumHotEffect,
    quantumNuclearEffect,
    quantumNuclearFusion,
    quantumElectricDischarge,
    hazardFireEffect: fireJutsuFieldEffect,
    hazardPoisonEffect,
    hazardWaterEffect,
    bottleShardEffect,
    footBathSparkleEffect,
    mapObjectEffectTextures,
    itemStaminaCell,
    creditCrates,
    manaPotion,
    itemAntidote,
    itemHeal,
    itemTextures,
    groundFirearmIcons,
    groundItemTextures,
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
    naturalRecoveryEffect,
    gboOverdriveEffect,
    physicalActionMotions,
    weaponActionMotions,
    fullMapComposites,
    tacticsStoryboard,
    tacticsPlayerHood,
    tacticsPlayerBlue,
    tacticsNovelMangaSymbols,
    tacticsNovelMotions,
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
  // Effect catalogs are loaded incrementally. A legal action can reach its
  // renderer before an optional semantic raster has been registered; that
  // absence must skip only the texture layer, never abort the whole Canvas
  // world stage while complementary VFX and authoritative play continue.
  if (!image || !image.complete || !image.naturalWidth) return null;
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
    const physicalMotionKey = key.startsWith("physical-motion-");
    const generatedMotionKey = physicalMotionKey || key.startsWith("weapon-motion-") || key.startsWith("skinWalk3-");
    const strictGreenKey = key === "cutin-blue-dress" ||
      key === "blueDressMaster" ||
      key.startsWith("physical-action-") ||
      generatedMotionKey ||
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
      const minimum = Math.min(data[i], data[i + 1], data[i + 2]);
      const maximum = Math.max(data[i], data[i + 1], data[i + 2]);
      // Some generated motion sheets contain a baked neutral checkerboard even
      // though they were authored for alpha. Remove only bright neutral pixels
      // connected to an outer edge, preserving enclosed white clothing.
      const checkerboardKey = generatedMotionKey && minimum > 224 && maximum - minimum < 20;
      return data[i + 3] < 8 || dark || greenKey || checkerboardKey;
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
  navigator.serviceWorker.register(new URL("sw.js?v=mana-conversion-luck-headshot-quantum-electric-v554", document.baseURI)).catch(() => {});
}
