(function exposeDvaEconomyCatalog(root, factory) {
  const catalog = factory();
  if (typeof module === "object" && module?.exports) module.exports = catalog;
  if (root) root.DVAEconomyCatalog = catalog;
})(typeof globalThis === "object" ? globalThis : this, () => {
  "use strict";

  const categories = Object.freeze([
    Object.freeze({ id: "generate-supply", label: "生成・物資", defaultCooldownPerCredit: 900 }),
    Object.freeze({ id: "weapon", label: "武器", defaultCooldownPerCredit: 600 }),
    Object.freeze({ id: "generate-tech", label: "生成・技術", defaultCooldownPerCredit: 900 }),
    Object.freeze({ id: "invention", label: "発明品", defaultCooldownPerCredit: 550 })
  ]);

  // Hacker CT = current vending price × fixed per-credit ratio. The explicit
  // ratios preserve v467 values while making every later price edit proportional.
  const rows = [
    ["mineral-water", "ミネラルウォーター", 12, "generate-supply", "mineral-water", 18_000 / 12, "mineral-water"],
    ["antidote", "解毒剤", 24, "generate-supply", "antidote", 24_000 / 24, "antidote"],
    ["molotov", "火炎瓶", 48, "generate-supply", "molotov", 42_000 / 48, "molotov"],
    ["evade", "回避拡張", 45, "generate-tech", "vending-evade", 42_000 / 45, "instant-evade"],
    ["speed", "アクセラレート飲料", 55, "generate-tech", "vending-speed", 54_000 / 55, "instant-speed"],
    ["warp", "即時ワープ", 35, "generate-tech", "warp", 36_000 / 35, "warp"],
    ["mystery", "ミステリー", 45, "generate-tech", "vending-mystery", 42_000 / 45, "instant-mystery"],
    ["fire", "火遁の術", 95, "generate-supply", "fire", 75_000 / 95, "fire"],
    ["substitution", "変わり身の術", 90, "generate-supply", "substitution", 72_000 / 90, "substitution"],
    ["grit", "踏ん張り", 60, "generate-supply", "grit", 54_000 / 60, "grit"],
    ["heal", "回復", 50, "generate-supply", "heal", 48_000 / 50, "heal"],
    ["reason", "押し込み", 65, "generate-supply", "reason", 60_000 / 65, "reason"],
    ["mana", "マナポーション", 30, "generate-tech", "vending-mana", 30_000 / 30, "mana"],
    ["railgun", "レールガン", 150, "invention", "vending-railgun", 90_000 / 150, "railgun"],
    ["particle-cannon", "荷電粒子砲", 190, "invention", "vending-particle-cannon", 105_000 / 190, "particle-cannon"],
    ["excalibur", "エクスカリバー", 230, "invention", "vending-excalibur", 120_000 / 230, "excalibur"],
    ["exile", "亡命", 260, "generate-tech", "vending-exile", 135_000 / 260, "exile"],
    ["computer", "パソコン", 125, "generate-tech", "vending-computer", 75_000 / 125, "computer"],
    ["handgun", "ハンドガン", 40, "weapon", "vending-handgun", 36_000 / 40, "handgun"],
    ["smg", "サブマシンガン", 65, "weapon", "vending-smg", 48_000 / 65, "smg"],
    ["assault", "アサルトライフル", 85, "weapon", "vending-assault", 60_000 / 85, "assault"],
    ["sniper", "スナイパーライフル", 120, "weapon", "vending-sniper", 75_000 / 120, "sniper"],
    ["taser", "テーザー銃", 60, "weapon", "vending-taser", 48_000 / 60, "taser"],
    ["mercury", "水銀瓶", 60, "generate-supply", "mercury", 48_000 / 60, "quantum-mercury"],
    ["lead", "鉛瓶", 40, "generate-supply", "lead", 36_000 / 40, "quantum-lead"],
    ["uranium", "ウラン容器", 140, "generate-supply", "uranium", 90_000 / 140, "quantum-uranium"],
    ["plutonium", "プルトニウム容器", 180, "generate-supply", "plutonium", 105_000 / 180, "quantum-plutonium"],
    ["orichalcum-sword", "オリハルコン・ソード", 200, "weapon", "orichalcum-sword", 90_000 / 200, "orichalcum-sword"],
    ["iai", "居合", 110, "generate-supply", "iai", 84_000 / 110, "iai"],
    ["ice", "氷結水", 20, "generate-supply", "vending-ice", 900, "ice"],
    ["heated-water", "高温水", 20, "generate-supply", "vending-heated-water", 900, "heated-water"],
    ["rpg", "RPG", 170, "weapon", "vending-rpg", 600, "rpg"],
    ["missile", "ミサイル", 200, "weapon", "vending-missile", 600, "missile"]
  ];

  const products = Object.freeze(rows.map(([id, label, price, category, hackerRecipeId, cooldownPerCredit, asset]) =>
    Object.freeze({ id, label, price, category, hackerRecipeId, cooldownPerCredit, asset })
  ));
  const categoryById = new Map(categories.map((entry) => [entry.id, entry]));
  const productById = new Map(products.map((entry) => [entry.id, entry]));
  const productByRecipeId = new Map(products.map((entry) => [entry.hackerRecipeId, entry]));
  const productCosts = Object.freeze(Object.fromEntries(products.map((entry) => [entry.id, entry.price])));
  const productLabels = Object.freeze(Object.fromEntries(products.map((entry) => [entry.id, entry.label])));

  const product = (itemId) => productById.get(String(itemId || "")) || null;
  const productForRecipe = (recipeId) => productByRecipeId.get(String(recipeId || "")) || null;
  const categoryForProduct = (itemId) => product(itemId)?.category || "generate-supply";
  const cooldownForRecipe = (recipeId) => {
    const entry = productForRecipe(recipeId);
    if (!entry) return 0;
    const fallback = Number(categoryById.get(entry.category)?.defaultCooldownPerCredit) || 900;
    return Math.max(1_000, Math.round(entry.price * (Number(entry.cooldownPerCredit) || fallback)));
  };

  return Object.freeze({
    version: "shared-economy-heart-readability-v470",
    categories,
    products,
    productCosts,
    productLabels,
    product,
    productForRecipe,
    categoryForProduct,
    cooldownForRecipe
  });
});
