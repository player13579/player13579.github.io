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
  inventoryItemDetail: $("#inventoryItemDetail"),
  inventoryItemDetailName: $("#inventoryItemDetailName"),
  inventoryItemDetailType: $("#inventoryItemDetailType"),
  inventoryItemDetailDescription: $("#inventoryItemDetailDescription"),
  itemHoldBranchLines: $("#itemHoldBranchLines"),
  itemHoldBranch: $("#itemHoldBranch"),
  itemHoldBranchTitle: $("#itemHoldBranchTitle"),
  itemHoldBranchContinuousButton: $("#itemHoldBranchContinuousButton"),
  itemHoldBranchDetailButton: $("#itemHoldBranchDetailButton"),
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

// Fixed overlays must not remain inside animated panels: even an identity
// transform makes position:fixed use that panel as its containing block.
for (const overlay of [els.inventoryItemDetail, els.itemHoldBranchLines, els.itemHoldBranch]) {
  if (overlay && overlay.parentElement !== document.body) document.body.append(overlay);
}

// Keep the field canvas synchronized with the compositor. A desynchronized
// context can expose the cleared or partially drawn frame while prop-heavy
// scenes are still being painted, which presents as a full-field flash.
const ctx = els.canvas.getContext("2d", { alpha: false });
const mapCtx = els.expandedMapCanvas.getContext("2d");
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
  inventoryItemDetailTimer: null,
  inventoryItemDetailSource: null,
  itemHoldBranch: {
    source: null,
    detail: null,
    repeat: null,
    pointerId: null,
    selected: "",
    repeatTimer: 0,
    repeatRunning: false
  },
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
  tabletBranchPaÛm7ãkh‘éì¶»§q«^vKÓİÙ\Ø\ÙJ
NÂˆYˆ
˜\šX[OOHœÛYÈŠH™]\›ˆ™İ[”ÛYÈÂˆYˆ
˜\šX[OOH˜\ÜØ][ˆ˜\šX[OOH˜\ˆŠH™]\›ˆ™İ[\ÜØ][ÂˆYˆ
˜\šX[OOHœÛš\\ˆˆ˜\šX[OOHœÜˆŠH™]\›ˆ™İ[”Ûš\\ˆÂˆ™]\›ˆ™İ[’[™İ[ˆÂŸB‚™[˜İ[Ûˆ^PY™™\™YÙ
Ú[™Ü[ÛœÈHßJHÂˆÛÛœİÛÛ^Hİ]K˜]Y[Ë˜ÛÛ^ÂˆÛÛœİX\İ\ˆHİ]K˜]Y[Ë›X\İ\ÂˆYˆ
XÛÛ^[X\İ\ˆÛÛ^œİ]HOOH˜ÛÜÙYŠH™]\›ˆ˜[ÙNÂˆÛÛœİ™\ÛÛ™YÚ[™HY™™\™YÙÚ[™
Ú[™Ü[ÛœÊNÂˆÛÛœİš[\ÈHÑ–ĞTÔÑUÖÜ™\ÛÛ™YÚ[™NÂˆYˆ
Yš[\ÏË›[™İ
H™]\›ˆ˜[ÙNÂˆÛÛœİİ\œÛÜˆHİ]K˜]Y[ËœÙİ\œÛÜ‹™Ù]
™\ÛÛ™YÚ[™
HÂˆÛÛœİš[HHš[\ÖØİ\œÛÜˆ	Hš[\Ë›[™İNÂˆÛÛœİY™™\ˆHİ]K˜]Y[ËœÙY™™\œË™Ù]
š[JNÂˆYˆ
XY™™\ŠH™]\›ˆ˜[ÙNÂˆİ]K˜]Y[ËœÙİ\œÛÜ‹œÙ]
™\ÛÛ™YÚ[™İ\œÛÜˆ
ÈJNÂ‚ˆÛÛœİÛİ\˜ÙHHÛÛ^˜Ü™X]PY™™\”Ûİ\˜ÙJ
NÂˆÛÛœİØZ[ˆHÛÛ^˜Ü™X]QØZ[Š
NÂˆÛÛœİ˜\ÙQØZ[ˆHÑ–ÑĞRS”ÖÜ™\ÛÛ™YÚ[™HÏÈŒÌÂˆÛÛœİÜ[Û•›Û[YHH[X™\‹š\Ñš[š]J[X™\ŠÜ[ÛœË›Û[YJJHÈ[X™\ŠÜ[ÛœË›Û[YJHˆNÂˆØZ[‹™ØZ[‹˜[YHH˜\ÙQØZ[ˆ
ˆÛ[\
Ü[Û•›Û[YKKŒJNÂˆÛİ\˜ÙK˜Y™™\ˆHY™™\ÂˆÛİ\˜ÙKœ^X˜XÚÔ˜]K˜[YHHÈœİ\‹™\Úİ\‹ÛÜ›İ\‹ÛÜ›\Ú—Kš[˜ÛY\Ê™\ÛÛ™YÚ[™
BˆÈMˆ
ÈX]œ˜[™ÛJ
H
ˆŒˆˆNÂˆÛİ\˜ÙK˜ÛÛ›™Xİ
ØZ[ŠNÂ‚ˆYˆ
Ü[ÛœËœÜ]X[	‰ˆ\[ÙˆÛÛ^˜Ü™X]T[›™\ˆOOH™[˜İ[ÛˆŠHÂˆÛÛœİ[›™\ˆHÛÛ^˜Ü™X]T[›™\Š
NÂˆ[›™\‹œ[›š[™Ó[Ù[H’•ˆÂˆ[›™\‹™\İ[˜ÙS[Ù[Hš[™\œÙHÂˆ[›™\‹œ™Y‘\İ[˜ÙHHNÂˆ[›™\‹›X^\İ[˜ÙHHLÂˆ[›™\‹œ›ÛÙ™‘˜XİÜˆHÂˆÛÛœİÈHHHˆHHHÜ[ÛœËœÜ]X[ÂˆYˆ
[›™\‹œÜÚ][Û–
HÂˆ[›™\‹œÜÚ][Û–œÙ]˜[YP][YJ[X™\Š
HÛÛ^˜İ\œ™[[YJNÂˆ[›™\‹œÜÚ][Û–KœÙ]˜[YP][YJ[X™\ŠJHÛÛ^˜İ\œ™[[YJNÂˆ[›™\‹œÜÚ][Û–‹œÙ]˜[YP][YJ[X™\ŠŠHÛÛ^˜İ\œ™[[YJNÂˆH[ÙHYˆ
\[Ùˆ[›™\‹œÙ]ÜÚ][ÛˆOOH™[˜İ[ÛˆŠHÂˆ[›™\‹œÙ]ÜÚ][ÛŠ[X™\Š
H[X™\ŠJH[X™\ŠŠH
NÂˆBˆØZ[‹˜ÛÛ›™Xİ
[›™\ŠNÂˆ[›™\‹˜ÛÛ›™Xİ
X\İ\ŠNÂˆH[ÙHYˆ
\[ÙˆÛÛ^˜Ü™X]Tİ\™[Ô[›™\ˆOOH™[˜İ[ÛˆŠHÂˆÛÛœİ[›™\ˆHÛÛ^˜Ü™X]Tİ\™[Ô[›™\Š
NÂˆ[›™\‹œ[‹˜[YHHÛ[\
[X™\ŠÜ[ÛœËœ[ŠHLKJNÂˆØZ[‹˜ÛÛ›™Xİ
[›™\ŠNÂˆ[›™\‹˜ÛÛ›™Xİ
X\İ\ŠNÂˆH[ÙHÂˆØZ[‹˜ÛÛ›™Xİ
X\İ\ŠNÂˆBˆÛİ\˜ÙKœİ\

NÂˆ™]\›ˆYNÂŸB‚™[˜İ[Ûˆ^UÛ™Jœ™\]Y[˜ŞK[™œ™\]Y[˜ŞK\˜][Û‹\K›Û[YK[^HH[ˆHÜ]X[H[
HÂˆÛÛœİÛÛ^Hİ]K˜]Y[Ë˜ÛÛ^ÂˆÛÛœİX\İ\ˆHİ]K˜]Y[Ë›X\İ\ÂˆYˆ
XÛÛ^[X\İ\ˆÛÛ^œİ]HOOH˜ÛÜÙYŠH™]\›ÂˆÛÛœİİ\HÛÛ^˜İ\œ™[[YH
È[^NÂˆÛÛœİİÜHİ\
È\˜][ÛÂˆÛÛœİÜØÚ[]ÜˆHÛÛ^˜Ü™X]SÜØÚ[]ÜŠ
NÂˆÛÛœİØZ[ˆHÛÛ^˜Ü™X]QØZ[Š
NÂˆÜØÚ[]Ü‹\HH\NÂˆÜØÚ[]Ü‹™œ™\]Y[˜ŞKœÙ]˜[YP][YJX]›X^
Œœ™\]Y[˜ŞJKİ\
NÂˆÜØÚ[]Ü‹™œ™\]Y[˜ŞK™^Û™[X[˜[\Õ˜[YP][YJX]›X^
Œ[™œ™\]Y[˜ŞJKİÜ
NÂˆØZ[‹™ØZ[‹œÙ]˜[YP][YJŒKİ\
NÂˆØZ[‹™ØZ[‹™^Û™[X[˜[\Õ˜[YP][YJX]›X^
Œ‹›Û[YJKİ\
ÈX]›Z[ŠŒL‹\˜][ÛˆÈÊJNÂˆØZ[‹™ØZ[‹™^Û™[X[˜[\Õ˜[YP][YJŒKİÜ
NÂˆÜØÚ[]Ü‹˜ÛÛ›™Xİ
ØZ[ŠNÂˆYˆ
Ü]X[	‰ˆ\[ÙˆÛÛ^˜Ü™X]T[›™\ˆOOH™[˜İ[ÛˆŠHÂˆÛÛœİ[›™\ˆHÛÛ^˜Ü™X]T[›™\Š
NÂˆ[›™\‹œ[›š[™Ó[Ù[H’•ˆÂˆ[›™\‹™\İ[˜ÙS[Ù[Hš[™\œÙHÂˆ[›™\‹œ™Y‘\İ[˜ÙHHNÂˆ[›™\‹›X^\İ[˜ÙHHLÂˆ[›™\‹œ›ÛÙ™‘˜XİÜˆHÂˆÛÛœİH[X™\ŠÜ]X[
HÂˆÛÛœİHH[X™\ŠÜ]X[JHÂˆÛÛœİˆH[X™\ŠÜ]X[ŠHÂˆYˆ
[›™\‹œÜÚ][Û–
HÂˆ[›™\‹œÜÚ][Û–œÙ]˜[YP][YJİ\
NÂˆ[›™\‹œÜÚ][Û–KœÙ]˜[YP][YJKİ\
NÂˆ[›™\‹œÜÚ][Û–‹œÙ]˜[YP][YJ‹İ\
NÂˆH[ÙHYˆ
\[Ùˆ[›™\‹œÙ]ÜÚ][ÛˆOOH™[˜İ[ÛˆŠHÂˆ[›™\‹œÙ]ÜÚ][ÛŠKŠNÂˆBˆØZ[‹˜ÛÛ›™Xİ
[›™\ŠNÂˆ[›™\‹˜ÛÛ›™Xİ
X\İ\ŠNÂˆH[ÙHYˆ
\[ÙˆÛÛ^˜Ü™X]Tİ\™[Ô[›™\ˆOOH™[˜İ[ÛˆŠHÂˆÛÛœİ[›™\ˆHÛÛ^˜Ü™X]Tİ\™[Ô[›™\Š
NÂˆ[›™\‹œ[‹˜[YHHÛ[\
[‹LKJNÂˆØZ[‹˜ÛÛ›™Xİ
[›™\ŠNÂˆ[›™\‹˜ÛÛ›™Xİ
X\İ\ŠNÂˆH[ÙHÂˆØZ[‹˜ÛÛ›™Xİ
X\İ\ŠNÂˆBˆÜØÚ[]Ü‹œİ\
İ\
NÂˆÜØÚ[]Ü‹œİÜ
İÜ
ÈŒŠNÂŸB‚™[˜İ[Ûˆ^Q›Ûİİ\
Ü[ÛœÈHßJHÂˆÛÛœİÛÛ^Hİ]K˜]Y[Ë˜ÛÛ^ÂˆÛÛœİX\İ\ˆHİ]K˜]Y[Ë›X\İ\ÂˆYˆ
XÛÛ^[X\İ\ˆÛÛ^œİ]HOOH˜ÛÜÙYŠH™]\›ÂˆÛÛœİ\ÚH›ÛÛX[ŠÜ[ÛœË™\Ú
NÂˆÛÛœİ›Û[YHHÛ[\
[X™\ŠÜ[ÛœË›Û[YJHKJNÂˆÛÛœİ[ˆHÛ[\
[X™\ŠÜ[ÛœËœ[ŠHLKJNÂˆÛÛœİÜ]X[HÜ[ÛœËœÜ]X[[ÂˆÛÛœİ\˜][ÛˆH\ÚÈŒŒˆˆŒMÂˆÛÛœİØ[\T˜]HHÛÛ^œØ[\T˜]NÂˆÛÛœİY™™\ˆHÛÛ^˜Ü™X]PY™™\ŠKX]˜ÙZ[
Ø[\T˜]H
ˆ\˜][ÛŠKØ[\T˜]JNÂˆÛÛœİØ[\\ÈHY™™\‹™Ù]Ú[›™[]J
NÂˆ]ÛÛS›Ú\ÙHHÂ‚ˆ›Üˆ
][™^HÈ[™^Ø[\\Ë›[™İÈ[™^
ÏHJHÂˆÛÛœİ[YHH[™^ÈØ[\T˜]NÂˆÛÛœİÚ]HHX]œ˜[™ÛJ
H
ˆˆHNÂˆÛÛS›Ú\ÙHHÛÛS›Ú\ÙH
ˆ
ÈÚ]H
ˆŒMÂˆÛÛœİY[HX]™^
][YH
ˆ
\ÚÈÍˆŠJNÂˆÛÛœİÙU[YHH[YHH
\ÚÈŒÎˆŒŒŠNÂˆÛÛœİÙHHÙU[YHˆÈX]™^
]ÙU[YH
ˆ
\ÚÈÎˆM
JH
ˆŒˆˆÂˆÛÛœİØÜ˜\T›ÙÜ™\ÜÈHÛ[\

[YHHŒN
HÈ
\˜][Ûˆ
ˆ
KJNÂˆÛÛœİØÜ˜\HHX]œÚ[ŠØÜ˜\T›ÙÜ™\ÜÈ
ˆX]”JH
ˆ
\ÚÈŒˆŒM
NÂˆØ[\\ÖÚ[™^HH
ÛÛS›Ú\ÙH
ˆÌˆ
ÈÚ]H
ˆŒ
H
ˆ
Y[
ÈÙH
ÈØÜ˜\JNÂˆB‚ˆÛÛœİİ\HÛÛ^˜İ\œ™[[YNÂˆÛÛœİ˜\šX][ÛˆHLˆ
ÈX]œ˜[™ÛJ
H
ˆŒMÂˆÛÛœİİÔÛİ\˜ÙHHÛÛ^˜Ü™X]PY™™\”Ûİ\˜ÙJ
NÂˆÛÛœİYÚÛİ\˜ÙHHÛÛ^˜Ü™X]PY™™\”Ûİ\˜ÙJ
NÂˆİÔÛİ\˜ÙK˜Y™™\ˆHY™™\ÂˆYÚÛİ\˜ÙK˜Y™™\ˆHY™™\ÂˆİÔÛİ\˜ÙKœ^X˜XÚÔ˜]K˜[YHH˜\šX][ÛÂˆYÚÛİ\˜ÙKœ^X˜XÚÔ˜]K˜[YHH˜\šX][Ûˆ
ˆKŒÎÂ‚ˆÛÛœİ[\Xİš[\ˆHÛÛ^˜Ü™X]Pš\]XYš[\Š
NÂˆ[\Xİš[\‹\HH›İÜ\ÜÈÂˆ[\Xİš[\‹™œ™\]Y[˜ŞK˜[YHH\ÚÈMLˆLLÂˆ[\Xİš[\‹”K˜[YHHÎÂˆÛÛœİØİY™‘š[\ˆHÛÛ^˜Ü™X]Pš\]XYš[\Š
NÂˆØİY™‘š[\‹\HHšYÚ\ÜÈÂˆØİY™‘š[\‹™œ™\]Y[˜ŞK˜[YHH\ÚÈNˆLLÂˆØİY™‘š[\‹”K˜[YHHMNÂˆÛÛœİ[\XİØZ[ˆHÛÛ^˜Ü™X]QØZ[Š
NÂˆÛÛœİØİY™‘ØZ[ˆHÛÛ^˜Ü™X]QØZ[Š
NÂˆÛÛœİZ^HÛÛ^˜Ü™X]QØZ[Š
NÂˆ[\XİØZ[‹™ØZ[‹˜[YHH\ÚÈÌˆˆNÂˆØİY™‘ØZ[‹™ØZ[‹˜[YHH\ÚÈŒˆŒMÂˆZ^™ØZ[‹˜[YHH›Û[YNÂ‚ˆİÔÛİ\˜ÙK˜ÛÛ›™Xİ
[\Xİš[\ŠNÂˆ[\Xİš[\‹˜ÛÛ›™Xİ
[\XİØZ[ŠNÂˆ[\XİØZ[‹˜ÛÛ›™Xİ
Z^
NÂˆYÚÛİ\˜ÙK˜ÛÛ›™Xİ
ØİY™‘š[\ŠNÂˆØİY™‘š[\‹˜ÛÛ›™Xİ
ØİY™‘ØZ[ŠNÂˆØİY™‘ØZ[‹˜ÛÛ›™Xİ
Z^
NÂ‚ˆYˆ
Ü]X[	‰ˆ\[ÙˆÛÛ^˜Ü™X]T[›™\ˆOOH™[˜İ[ÛˆŠHÂˆÛÛœİ[›™\ˆHÛÛ^˜Ü™X]T[›™\Š
NÂˆ[›™\‹œ[›š[™Ó[Ù[H’•ˆÂˆ[›™\‹™\İ[˜ÙS[Ù[Hš[™\œÙHÂˆ[›™\‹œ™Y‘\İ[˜ÙHHNÂˆ[›™\‹›X^\İ[˜ÙHHLÂˆ[›™\‹œ›ÛÙ™‘˜XİÜˆHÂˆÛÛœİH[X™\ŠÜ]X[
HÂˆÛÛœİHH[X™\ŠÜ]X[JHÂˆÛÛœİˆH[X™\ŠÜ]X[ŠHÂˆYˆ
[›™\‹œÜÚ][Û–
HÂˆ[›™\‹œÜÚ][Û–œÙ]˜[YP][YJİ\
NÂˆ[›™\‹œÜÚ][Û–KœÙ]˜[YP][YJKİ\
NÂˆ[›™\‹œÜÚ][Û–‹œÙ]˜[YP][YJ‹İ\
NÂˆH[ÙHYˆ
\[Ùˆ[›™\‹œÙ]ÜÚ][ÛˆOOH™[˜İ[ÛˆŠHÂˆ[›™\‹œÙ]ÜÚ][ÛŠKŠNÂˆBˆZ^˜ÛÛ›™Xİ
[›™\ŠNÂˆ[›™\‹˜ÛÛ›™Xİ
X\İ\ŠNÂˆH[ÙHYˆ
\[ÙˆÛÛ^˜Ü™X]Tİ\™[Ô[›™\ˆOOH™[˜İ[ÛˆŠHÂˆÛÛœİ[›™\ˆHÛÛ^˜Ü™X]Tİ\™[Ô[›™\Š
NÂˆ[›™\‹œ[‹˜[YHH[ÂˆZ^˜ÛÛ›™Xİ
[›™\ŠNÂˆ[›™\‹˜ÛÛ›™Xİ
X\İ\ŠNÂˆH[ÙHÂˆZ^˜ÛÛ›™Xİ
X\İ\ŠNÂˆB‚ˆİÔÛİ\˜ÙKœİ\
İ\
NÂˆYÚÛİ\˜ÙKœİ\
İ\
NÂˆÛÛœİ[\œ™\]Y[˜ŞHH
\ÚÈLˆˆÎ
H
ˆ˜\šX][ÛÂˆ^UÛ™J[\œ™\]Y[˜ŞK\ÚÈˆˆ\ÚÈŒLÈˆŒKœÚ[™H‹
\ÚÈŒÍHˆŒJH
ˆ›Û[YK[‹Ü]X[
NÂŸB‚™[˜İ[Ûˆ^TÛİ[™
Ú[™Ü[ÛœÈHßJHÂˆYˆ
İ]K˜]Y[Ë›]]Y\ÔÙ[œÛÜP›ØÚÙY

JH™]\›ÂˆÛÛœİÛÛ^Hİ]K˜]Y[Ë˜ÛÛ^ÂˆYˆ
XÛÛ^ÛÛ^œİ]HOOH˜ÛÜÙYŠH™]\›ÂˆYˆ
ÛÛ^œİ]HOOHœİ\Ü[™YŠHÛÛ^œ™\İ[YJ
K˜Ø]Ú


HOˆßJNÂˆÛÛœİY™™\™YH^PY™™\™YÙ
Ú[™Ü[ÛœÊNÂˆÛÛœİ^Y\™Y›Ûİİ\HÈœİ\‹™\Úİ\‹ÛÜ›İ\‹ÛÜ›\Ú—Kš[˜ÛY\ÊÚ[™
NÂˆYˆ
Y™™\™Y	‰ˆ[^Y\™Y›Ûİİ\
H™]\›ÂˆYˆ
Ú[™OOH˜ÛXÚÈŠHÂˆ^UÛ™JŒŒŒŒKœÚ[™H‹Œ
NÂˆH[ÙHYˆ
Ú[™OOHœİ\ŠHÂˆ^Q›Ûİİ\
È›Û[YNˆN[ˆ
X]œ˜[™ÛJ
HHJH
ˆŒJNÂˆH[ÙHYˆ
Ú[™OOH™\Úİ\ŠHÂˆ^Q›Ûİİ\
È\ÚˆYK›Û[YNˆL‹[ˆ
X]œ˜[™ÛJ
HHJH
ˆŒHJNÂˆH[ÙHYˆ
Ú[™OOHš[\XİŠHÂˆ^UÛ™JLŒMKŒL‹šX[™ÛH‹ŒLÊNÂˆ^UÛ™JLNÍŒŒœÚ[™H‹ŒŒN
NÂˆH[ÙHYˆ
Ú[™OOHœÙ[XİŠHÂˆ^UÛ™JMMŒLšX[™ÛH‹ŒM
NÂˆ^UÛ™JŒŒLËœÚ[™H‹ŒLŒÊNÂˆH[ÙHYˆ
Ú[™OOHœ›İ[™ŠHÂˆ^UÛ™JŒÎLŒM‹šX[™ÛH‹ŒLŠNÂˆ^UÛ™JÎLLŒŒNšX[™ÛH‹ŒLŒLŠNÂˆH[ÙHYˆ
Ú[™OOHœİ\ŠHÂˆÌÌÌŒK™›Ü‘XXÚ

œ™\]Y[˜ŞK[™^
HOˆ^UÛ™Jœ™\]Y[˜ŞKœ™\]Y[˜ŞH
ˆKŒŒMKœÜ]X\™H‹Œ[™^
ˆŒJJNÂˆH[ÙHYˆ
Ú[™OOH\ÚÈŠHÂˆÍLŒËNKÎK™›Ü‘XXÚ

œ™\]Y[˜ŞK[™^
HOˆ^UÛ™Jœ™\]Y[˜ŞKœ™\]Y[˜ŞKŒNœÚ[™H‹ŒLË[™^
ˆŒ
JNÂˆH[ÙHYˆ
Ú[™OOH›Øš™XİŠHÂˆÛÛœİ›Û[YHHÛ[\
[X™\ŠÜ[ÛœË›Û[YJHKJNÂˆÌÍŒMLK™›Ü‘XXÚ

œ™\]Y[˜ŞK[™^
HOˆ^UÛ™Jœ™\]Y[˜ŞKœ™\]Y[˜ŞH
ˆKŒL‹ŒM‹šX[™ÛH‹ŒH
ˆ›Û[YK[™^
ˆŒMKÜ[ÛœËœ[‹Ü[ÛœËœÜ]X[
JNÂˆH[ÙHYˆ
Ú[™OOH›YY][™ÈŠHÂˆÍŒŒŒŒŒŒK™›Ü‘XXÚ

œ™\]Y[˜ŞK[™^
HOˆ^UÛ™Jœ™\]Y[˜ŞKœ™\]Y[˜ŞKŒLËœÜ]X\™H‹ŒL[™^
ˆŒLJJNÂˆH[ÙHYˆ
Ú[™OOH˜[\ŠHÂˆ^UÛ™JÌLŒŒŒKœØ]İÛİ‹ŒL
NÂˆ^UÛ™JÌLŒŒŒKœØ]İÛİ‹ŒLŒ
NÂˆH[ÙHYˆ
Ú[™OOH™šYÚ\Ûİ[\ˆŠHÂˆÍLŒLNÍŒMMŒK™›Ü‘XXÚ

œ™\]Y[˜ŞK[™^
HOˆ^UÛ™Jœ™\]Y[˜ŞKœ™\]Y[˜ŞH
ˆKŒŒLK[™^	HˆÈœÜ]X\™HˆˆšX[™ÛH‹ŒK[™^
ˆŒÍKÜ[ÛœËœ[‹Ü[ÛœËœÜ]X[
JNÂˆH[ÙHYˆ
Ú[™OOH™ÙÙHŠHÂˆ^UÛ™JŒLÎŒLœÚ[™H‹ŒJNÂˆ^UÛ™JLNMŒLËšX[™ÛH‹ŒËŒ
NÂˆH[ÙHYˆ
Ú[™OOH[\ÜŠHÂˆÌŒÎLŒŒNK™›Ü‘XXÚ

œ™\]Y[˜ŞK[™^
HOˆ^UÛ™Jœ™\]Y[˜ŞKœ™\]Y[˜ŞH
ˆKŒM‹œÚ[™H‹ŒL[™^
ˆŒÍJJNÂˆ^UÛ™JLNNŒšX[™ÛH‹ŒŒL
NÂˆH[ÙHYˆ
Ú[™OOHšÚ[ŠHÂˆ^UÛ™JŒL‹ŒÎœØ]İÛİ‹ŒN
NÂˆÌLÌŒMMÌŒK™›Ü‘XXÚ

œ™\]Y[˜ŞK[™^
HOˆ^UÛ™Jœ™\]Y[˜ŞKœ™\]Y[˜ŞH
ˆNŒËœÜ]X\™H‹ŒL[™^
ˆŒÍJJNÂˆH[ÙHYˆ
Ú[™OOH™X]ŠHÂˆ^UÛ™JNÎL‹œØ]İÛİ‹ŒŒ
NÂˆ^UÛ™JLŒLLŒÌ‹œÜ]X\™H‹ŒKŒÊNÂˆH[ÙHYˆ
Ú[™OOH™İ[œÚİŠHÂˆÛÛœİ›Û[YHHÛ[\
[X™\ŠÜ[ÛœË›Û[YJHKJNÂˆÛÛœİ[ˆHÛ[\
[X™\ŠÜ[ÛœËœ[ŠHLKJNÂˆÛÛœİ˜\šX[HÜ[ÛœË˜\šX[š[™İ[ˆÂˆYˆ
˜\šX[OOHœÛYÈŠHÂˆÌŒKŒL×K™›Ü‘XXÚ

[^JHOˆÂˆ^UÛ™JŒŒÍŒLKœÜ]X\™H‹ŒN
ˆ›Û[YK[^K[‹Ü[ÛœËœÜ]X[
NÂˆ^UÛ™JLÌŒNŒMKœØ]İÛİ‹ŒLˆ
ˆ›Û[YK[^H
ÈŒ[‹Ü[ÛœËœÜ]X[
NÂˆJNÂˆH[ÙHYˆ
˜\šX[OOH˜\ÜØ][ŠHÂˆ^UÛ™JLKÎŒÍœÜ]X\™H‹ŒÍ
ˆ›Û[YK[‹Ü[ÛœËœÜ]X[
NÂˆ^UÛ™JLNL‹ŒL‹œØ]İÛİ‹ŒH
ˆ›Û[YKŒL‹[‹Ü[ÛœËœÜ]X[
NÂˆ^UÛ™JNÌ‹šX[™ÛH‹ŒN
ˆ›Û[YKŒÍK[‹Ü[ÛœËœÜ]X[
NÂˆH[ÙHYˆ
˜\šX[OOHœÛš\\ˆŠHÂˆ^UÛ™JL‹Œ‹œÜ]X\™H‹ˆ
ˆ›Û[YK[‹Ü[ÛœËœÜ]X[
NÂˆ^UÛ™JNŒMÌŒM‹œØ]İÛİ‹ŒÌH
ˆ›Û[YKŒ[‹Ü[ÛœËœÜ]X[
NÂˆ^UÛ™J‹‹šX[™ÛH‹Œ
ˆ›Û[YKŒK[‹Ü[ÛœËœÜ]X[
NÂˆH[ÙHÂˆ^UÛ™JNŒœÜ]X\™H‹Œˆ
ˆ›Û[YK[‹Ü[ÛœËœÜ]X[
NÂˆ^UÛ™JLMLŒKœØ]İÛİ‹ŒN
ˆ›Û[YKŒL‹[‹Ü[ÛœËœÜ]X[
NÂˆ^UÛ™JÎ‹ŒÍšX[™ÛH‹ŒLˆ
ˆ›Û[YKŒË[‹Ü[ÛœËœÜ]X[
NÂˆBˆH[ÙHYˆ
Ú[™OOHÛÜ›İ\ŠHÂˆÛÛœİ›Û[YHHÛ[\
[X™\ŠÜ[ÛœË›Û[YJHKJNÂˆ^Q›Ûİİ\
È›Û[YNˆÎ
ˆ›Û[YK[ˆÜ[ÛœËœ[‹Ü]X[ˆÜ[ÛœËœÜ]X[JNÂˆH[ÙHYˆ
Ú[™OOHÛÜ›\ÚŠHÂˆÛÛœİ›Û[YHHÛ[\
[X™\ŠÜ[ÛœË›Û[YJHKJNÂˆ^Q›Ûİİ\
È\ÚˆYK›Û[YK[ˆÜ[ÛœËœ[‹Ü]X[ˆÜ[ÛœËœÜ]X[JNÂˆH[ÙHYˆ
Ú[™OOHÛÜ››Û™HŠHÂˆÛÛœİ›Û[YHHÛ[\
[X™\ŠÜ[ÛœË›Û[YJHKJNÂˆ^UÛ™JMLŒM‹œÜ]X\™H‹ŒMH
ˆ›Û[YKÜ[ÛœËœ[‹Ü[ÛœËœÜ]X[
NÂˆ^UÛ™JLŒŒL‹œÚ[™H‹ŒÍH
ˆ›Û[YKŒKÜ[ÛœËœ[‹Ü[ÛœËœÜ]X[
NÂˆH[ÙHYˆ
Ú[™OOH™[\ŠHÂˆÛÛœİ›Û[YHHÛ[\
[X™\ŠÜ[ÛœË›Û[YJHKJNÂˆ^UÛ™JÌ‹Ì‹œÚ[™H‹ŒÍˆ
ˆ›Û[YKÜ[ÛœËœ[‹Ü[ÛœËœÜ]X[
NÂˆ^UÛ™JMÌ‹ŒÌœØ]İÛİ‹ŒH
ˆ›Û[YKŒNÜ[ÛœËœ[‹Ü[ÛœËœÜ]X[
NÂˆÎLŒLÌŒMMK™›Ü‘XXÚ

œ™\]Y[˜ŞK[™^
HOˆÂˆ^UÛ™Jœ™\]Y[˜ŞKœ™\]Y[˜ŞH
ˆŒÍŒKœÜ]X\™H‹ŒM
ˆ›Û[YK[™^
ˆŒKÜ[ÛœËœ[‹Ü[ÛœËœÜ]X[
NÂˆJNÂˆH[ÙHYˆ
Ú[™OOH™š\™R]İHŠHÂˆÛÛœİ›Û[YHHÛ[\
[X™\ŠÜ[ÛœË›Û[YJHKJNÂˆ^UÛ™JL‹‹‹œØ]İÛİ‹ŒÌ
ˆ›Û[YKÜ[ÛœËœ[‹Ü[ÛœËœÜ]X[
NÂˆ^UÛ™JŒLNŒÎšX[™ÛH‹ŒŒˆ
ˆ›Û[YKŒÍKÜ[ÛœËœ[‹Ü[ÛœËœÜ]X[
NÂˆÍLŒLŒLNÍŒK™›Ü‘XXÚ

œ™\]Y[˜ŞK[™^
HOˆÂˆ^UÛ™Jœ™\]Y[˜ŞKœ™\]Y[˜ŞH
ˆNŒLKœÜ]X\™H‹ŒL
ˆ›Û[YKŒ
È[™^
ˆŒMKÜ[ÛœËœ[‹Ü[ÛœËœÜ]X[
NÂˆJNÂˆH[ÙHYˆ
Ú[™OOHœİXœİ]][ÛˆŠHÂˆÛÛœİ›Û[YHHÛ[\
[X™\ŠÜ[ÛœË›Û[YJHKJNÂˆ^UÛ™JNŒšX[™ÛH‹ŒŒˆ
ˆ›Û[YKÜ[ÛœËœ[‹Ü[ÛœËœÜ]X[
NÂˆ^UÛ™JŒMŒŒM‹œÚ[™H‹ŒM
ˆ›Û[YKŒ‹Ü[ÛœËœ[‹Ü[ÛœËœÜ]X[
NÂˆ^UÛ™JLÌŒŒŒœÜ]X\™H‹Œ
ˆ›Û[YKŒËÜ[ÛœËœ[‹Ü[ÛœËœÜ]X[
NÂˆH[ÙHYˆ
Ú[™OOHœ˜[šÚ[™ÈŠHÂˆÍLŒËNKÎLËLÌNWK™›Ü‘XXÚ

œ™\]Y[˜ŞK[™^
HOˆÂˆ^UÛ™Jœ™\]Y[˜ŞKœ™\]Y[˜ŞH
ˆKŒ‹ŒK[™^	HˆÈšX[™ÛHˆˆœÚ[™H‹ŒMK[™^
ˆŒJNÂˆJNÂˆ^UÛ™JNM‹ÎL‹Œ‹šX[™ÛH‹ŒLKŒLŠNÂˆH[ÙHYˆ
Ú[™OOHÚ[ˆŠHÂˆÌÎL‹LŒËNKÎK™›Ü‘XXÚ

œ™\]Y[˜ŞK[™^
HOˆ^UÛ™Jœ™\]Y[˜ŞKœ™\]Y[˜ŞKŒœÚ[™H‹ŒM[™^
ˆŒL
JNÂˆH[ÙHYˆ
Ú[™OOH›ÜÙHŠHÂˆÌÌÌËNM—K™›Ü‘XXÚ

œ™\]Y[˜ŞK[™^
HOˆ^UÛ™Jœ™\]Y[˜ŞKœ™\]Y[˜ŞH
ˆL‹ŒÌšX[™ÛH‹ŒLË[™^
ˆŒMJJNÂˆBŸB‚™[˜İ[ÛˆÚİÕØ\İ
Y\ÜØYÙJHÂˆ[ËØ\İ^ÛÛ[HY\ÜØYÙNÂˆ[ËØ\İšY[ˆH˜[ÙNÂˆÛX\•[Y[İ]
İ]KØ\İ[Y\ŠNÂˆİ]KØ\İ[Y\ˆHÙ][Y[İ]


HOˆÂˆ[ËØ\İšY[ˆHYNÂˆKÍŒ
NÂŸB‚™[˜İ[Ûˆ™YÚ\İ\”Ù\šXÙUÛÜšÙ\Š
HÂˆYˆ
JœÙ\šXÙUÛÜšÙ\ˆˆ[ˆ˜]šYØ]ÜŠHØØ][Û‹œ›İØÛÛOOH™š[NˆˆÊŸŠ\XŞW›™]	ÚK\İ
ØØ][Û‹šÜİ˜[YJJH™]\›Âˆ˜]šYØ]Ü‹œÙ\šXÙUÛÜšÙ\‹œ™YÚ\İ\Š™]ÈT“
œİËšœÈ‹Øİ[Y[˜˜\ÙUT’JJK˜Ø]Ú


HOˆßJNÂŸB