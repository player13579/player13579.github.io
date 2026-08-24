(function exposeDvaEconomyCatalog(root, factory) {
  const catalog = factory();
  if (typeof module === "object" && module?.exports) module.exports = catalog;
  if (root) root.DVAEconomyCatalog = catalog;
})(typeof globalThis === "object" ? globalThis : this, () => {
  "use strict";

  const COOLDOWN_MS_PER_CREDIT = 5_000;
  const creditIncome = Object.freeze({
    passiveIntervalMs: 10_000,
    passiveReward: 1,
    taskReward: 20,
    sabotageReward: 2,
    cacheReward: 3,
    quantumMercuryReward: 100,
    quantumLeadReward: 100,
    goldInstantReward: 100,
    mysteryJackpot: 6,
    donationCost: 1,
    hackerDuplicateBonus: 2
  });

  const categories = Object.freeze([
    Object.freeze({ id: "generate-supply", label: "生成・物資", defaultCooldownPerCredit: COOLDOWN_MS_PER_CREDIT }),
    Object.freeze({ id: "instant-item", label: "即席アイテム", defaultCooldownPerCredit: COOLDOWN_MS_PER_CREDIT }),
    Object.freeze({ id: "weapon", label: "武器", defaultCooldownPerCredit: COOLDOWN_MS_PER_CREDIT }),
    Object.freeze({ id: "generate-tech", label: "生成・技術", defaultCooldownPerCredit: COOLDOWN_MS_PER_CREDIT })
  ]);

  // Shop ability entitlements are deliberately separate from physical and
  // instant-item products. Buying one unlocks that exact ability for the
  // current match; it never executes during the credit transaction and never
  // changes the player's selected operator identity.
  const abilityGenres = Object.freeze([
    Object.freeze({ id: "operator-fighter", label: "ファイター", operator: "fighter" }),
    Object.freeze({ id: "operator-gravity", label: "グラビティ", operator: "gravity" }),
    Object.freeze({ id: "operator-flora", label: "フローラ", operator: "flora" }),
    Object.freeze({ id: "operator-gunner", label: "ガンナー", operator: "gunner" }),
    Object.freeze({ id: "operator-quantum", label: "クオンタム", operator: "quantum" }),
    Object.freeze({ id: "operator-assassin", label: "アサシン", operator: "assassin" }),
    Object.freeze({ id: "operator-hacker", label: "ハッカー", operator: "hacker" })
  ]);

  const abilityRows = [
    ["fighter-limit-break", "リミットブレイク", 18, "operator-fighter", "fighter", "limit-break", "active", "/api/limit-break"],
    ["gravity-near", "転移・対象付近", 6, "operator-gravity", "gravity", "near", "active", "/api/teleport"],
    ["gravity-target", "対象転移", 8, "operator-gravity", "gravity", "target", "active-target-map", "/api/teleport"],
    ["gravity-heart", "心臓転移", 22, "operator-gravity", "gravity", "heart", "active", "/api/teleport"],
    ["gravity-accelerate", "アクセラレート", 8, "operator-gravity", "gravity", "accelerate", "active", "/api/gravity-time"],
    ["gravity-decelerate", "ディーセラレート", 8, "operator-gravity", "gravity", "decelerate", "active", "/api/gravity-time"],
    ["gravity-time-keeper", "時の番人", 14, "operator-gravity", "gravity", "time-keeper", "active", "/api/gravity-time-keeper"],
    ["gravity-storm", "グラビティストーム", 20, "operator-gravity", "gravity", "storm", "active", "/api/gravity-storm"],
    ["flora-heal", "回復", 7, "operator-flora", "flora", "heal", "active", "/api/flora-heal"],
    ["flora-sunbeam", "サンビーム", 20, "operator-flora", "flora", "sunbeam", "active", "/api/flora-heal"],
    ["flora-invisible", "インビジブル", 16, "operator-flora", "flora", "invisible", "active", "/api/flora-heal"],
    ["gunner-aim", "エイム", 12, "operator-gunner", "gunner", "aim", "passive", "advanceGunnerAimPassive"],
    ["gunner-special-ammo", "特殊弾装填", 14, "operator-gunner", "gunner", "special-ammo", "passive", "advanceGunnerSpecialAmmo"],
    ["quantum-kinetic-accelerate", "運動エネルギー制御・加速", 8, "operator-quantum", "quantum", "kinetic-accelerate", "active", "/api/quantum-control"],
    ["quantum-kinetic-decelerate", "運動エネルギー制御・減速", 8, "operator-quantum", "quantum", "kinetic-decelerate", "active", "/api/quantum-control"],
    ["quantum-electric", "エレクトリック", 12, "operator-quantum", "quantum", "electric-discharge", "active", "/api/quantum-control"],
    ["quantum-transmutation", "核変換", 12, "operator-quantum", "quantum", "nuclear-transmutation", "active", "/api/quantum-control"],
    ["quantum-fission", "核分裂", 24, "operator-quantum", "quantum", "nuclear-fission", "active", "/api/quantum-control"],
    ["quantum-fusion", "核融合", 24, "operator-quantum", "quantum", "nuclear-fusion", "active", "/api/quantum-control"],
    ["assassin-annihilation", "消滅忍殺", 20, "operator-assassin", "assassin", "annihilation", "passive", "resolveAttack"],
    ["assassin-silent-steps", "常時無音", 12, "operator-assassin", "assassin", "silent-steps", "passive", "emitMovementNoise"],
    ["hacker-vibe-coding", "バイブコーディング", 22, "operator-hacker", "hacker", "vibe-coding", "panel", "/api/alchemy"],
    ["hacker-root", "ROOT", 25, "operator-hacker", "hacker", "root", "active", "/api/hacker-root"]
  ];

  const abilityProducts = Object.freeze(abilityRows.map(([id, label, price, genreId, operator, mode, behavior, actionOwner]) =>
    Object.freeze({ id, label, price, genreId, operator, mode, behavior, actionOwner })
  ));
  const abilityProductById = new Map(abilityProducts.map((entry) => [entry.id, entry]));

  // One credit is the price of the least expensive product. Every other price
  // is a relative gameplay-value unit. Hacker CT uses the same five seconds per
  // credit for every shared product, so price changes cannot drift from CT.
  const rows = [
    ["mineral-water", "ミネラルウォーター", 1, "generate-supply", "mineral-water", "mineral-water"],
    ["seawater", "海水", 2, "generate-supply", "seawater", "seawater"],
    ["antidote", "解毒剤", 2, "generate-supply", "antidote", "antidote"],
    ["molotov", "火炎瓶", 4, "generate-supply", "molotov", "molotov"],
    ["evade", "回避拡張", 4, "instant-item", "vending-evade", "instant-evade"],
    ["speed", "アクセラレート飲料", 5, "instant-item", "vending-speed", "instant-speed"],
    ["warp", "テレポートマップスクロール", 3, "instant-item", "warp", "warp"],
    ["mystery", "ミステリー", 4, "instant-item", "vending-mystery", "instant-mystery"],
    ["fire", "火遁スクロール", 8, "instant-item", "fire", "fire"],
    ["substitution", "変わり身の術", 8, "instant-item", "substitution", "substitution"],
    ["grit", "バリア", 5, "instant-item", "grit", "grit"],
    ["heal", "回復", 4, "instant-item", "heal", "heal"],
    ["reason", "バスト", 5, "instant-item", "reason", "reason"],
    ["mana", "マナポーション", 3, "instant-item", "vending-mana", "mana"],
    ["stamina", "スタミナ", 6, "instant-item", "stamina", "stamina"],
    ["hsg", "HSG", 8, "weapon", "hsg", "hsg"],
    ["railgun", "レールガン", 13, "weapon", "vending-railgun", "railgun"],
    ["particle-cannon", "荷電粒子砲", 16, "weapon", "vending-particle-cannon", "particle-cannon"],
    ["excalibur", "エクスカリバー", 19, "weapon", "vending-excalibur", "excalibur"],
    ["exile", "亡命", 22, "instant-item", "vending-exile", "exile"],
    ["hack", "ハック", 10, "instant-item", "vending-hack", "hack"],
    ["handgun", "ハンドガン", 3, "weapon", "vending-handgun", "handgun"],
    ["smg", "サブマシンガン", 5, "weapon", "vending-smg", "smg"],
    ["assault", "アサルトライフル", 7, "weapon", "vending-assault", "assault"],
    ["sniper", "スナイパーライフル", 10, "weapon", "vending-sniper", "sniper"],
    ["taser", "テーザー銃", 5, "weapon", "vending-taser", "taser"],
    ["mercury", "水銀瓶", 3, "generate-supply", "mercury", "quantum-mercury"],
    ["lead", "鉛瓶", 1, "generate-supply", "lead", "quantum-lead"],
    ["uranium", "ウラン容器", 12, "generate-supply", "uranium", "quantum-uranium"],
    ["plutonium", "プルトニウム容器", 15, "generate-supply", "plutonium", "quantum-plutonium"],
    ["orichalcum-sword", "オリハルコン・ソード", 17, "weapon", "orichalcum-sword", "orichalcum-sword"],
    ["iai", "居合", 9, "instant-item", "iai", "iai"],
    ["ice", "氷結水", 2, "generate-supply", "vending-ice", "ice", "root-only"],
    ["heated-water", "高温水", 2, "generate-supply", "vending-heated-water", "heated-water", "root-only"],
    ["gold", "金", 4, "instant-item", "gold", "gold", "root-only"],
    ["rpg", "RPG", 14, "weapon", "vending-rpg", "rpg"],
    ["missile", "ミサイル", 17, "weapon", "vending-missile", "missile"]
  ];

  const products = Object.freeze(rows.map(([id, label, price, category, hackerRecipeId, asset, availability = "shared"]) =>
    Object.freeze({
      id,
      label,
      price,
      category,
      hackerRecipeId,
      cooldownPerCredit: COOLDOWN_MS_PER_CREDIT,
      asset,
      availability,
      vendingAvailable: availability === "shared",
      hackerAccess: availability === "root-only" ? "root" : "ordinary"
    })
  ));
  const categoryById = new Map(categories.map((entry) => [entry.id, entry]));
  const productById = new Map(products.map((entry) => [entry.id, entry]));
  const productByRecipeId = new Map(products.map((entry) => [entry.hackerRecipeId, entry]));
  const productCosts = Object.freeze(Object.fromEntries(products.filter((entry) => entry.vendingAvailable).map((entry) => [entry.id, entry.price])));
  const productLabels = Object.freeze(Object.fromEntries(products.map((entry) => [entry.id, entry.label])));
  const vendingProducts = Object.freeze(products.filter((entry) => entry.vendingAvailable));
  const ordinaryHackerProducts = Object.freeze(products.filter((entry) => entry.hackerAccess === "ordinary"));

  const product = (itemId) => productById.get(String(itemId || "")) || null;
  const productForRecipe = (recipeId) => productByRecipeId.get(String(recipeId || "")) || null;
  const abilityProduct = (abilityId) => abilityProductById.get(String(abilityId || "")) || null;
  const categoryForProduct = (itemId) => product(itemId)?.category || "generate-supply";
  const cooldownForRecipe = (recipeId) => {
    const entry = productForRecipe(recipeId);
    if (!entry) return 0;
    const fallback = Number(categoryById.get(entry.category)?.defaultCooldownPerCredit) || COOLDOWN_MS_PER_CREDIT;
    return Math.max(1_000, Math.round(entry.price * (Number(entry.cooldownPerCredit) || fallback)));
  };

  return Object.freeze({
    version: "electric-long-range-settlement-v558",
    cooldownMsPerCredit: COOLDOWN_MS_PER_CREDIT,
    creditIncome,
    categories,
    abilityGenres,
    abilityProducts,
    products,
    vendingProducts,
    ordinaryHackerProducts,
    productCosts,
    productLabels,
    product,
    productForRecipe,
    abilityProduct,
    categoryForProduct,
    cooldownForRecipe
  });
});
