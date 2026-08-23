// リン（月ウサギ）のスキルデータ
// 出典: 公式wiki スキル（リン） https://w.atwiki.jp/tsukiusa/pages/140.html （2026-06-04 更新）
// 英語のスキル名は公式表記が確認できていないため、暫定の訳語

export const skillTiers = ['Rare', 'Unique', 'Epic', 'Legend', 'Star'] as const;
export const skillElements = ['Light', 'Dark', 'Fire', 'Water'] as const;
export const skillKinds = ['Attack', 'Buff', 'Debuff'] as const;
export const skillTargets = ['Self', 'Single', 'Multi', 'AreaEnemy', 'AreaFixed', 'AreaTracking', 'AreaSelf'] as const;

export type SkillTier = typeof skillTiers[number];
export type SkillElement = typeof skillElements[number];
export type SkillKind = typeof skillKinds[number];
export type SkillTarget = typeof skillTargets[number];

export interface Skill {
  id: string;
  ja: string;
  en: string;
  tier: SkillTier;
  element: SkillElement;
  kinds: SkillKind[];
  targets: SkillTarget[];
  /** クールタイム（秒） */
  cooldown: number;
  /** スキルLv.1 のMP消費量 */
  mpLv1: number;
  /** スキルLv.110（MAX）のMP消費量 */
  mpMax: number;
}

export const skills: Skill[] = [
  { id: 'lightning-strike', ja: 'ライトニング・ストライク', en: "Lightning Strike", tier: 'Rare', element: 'Light', kinds: ['Attack'], targets: ['AreaEnemy'], cooldown: 8, mpLv1: 80, mpMax: 167 },
  { id: 'cure', ja: 'キュア', en: "Cure", tier: 'Rare', element: 'Light', kinds: ['Buff'], targets: ['Self'], cooldown: 17, mpLv1: 200, mpMax: 418 },
  { id: 'dark-zone', ja: 'ダーク・ゾーン', en: "Dark Zone", tier: 'Rare', element: 'Dark', kinds: ['Attack'], targets: ['AreaFixed'], cooldown: 9, mpLv1: 150, mpMax: 314 },
  { id: 'dark-storm', ja: 'ダーク・ストーム', en: "Dark Storm", tier: 'Rare', element: 'Dark', kinds: ['Attack'], targets: ['AreaTracking'], cooldown: 15, mpLv1: 120, mpMax: 251 },
  { id: 'fire-ball', ja: 'ファイア・ボール', en: "Fire Ball", tier: 'Rare', element: 'Fire', kinds: ['Attack'], targets: ['Multi'], cooldown: 5, mpLv1: 100, mpMax: 209 },
  { id: 'fire-explosion', ja: 'ファイア・エクスプローション', en: "Fire Explosion", tier: 'Rare', element: 'Fire', kinds: ['Attack'], targets: ['AreaEnemy'], cooldown: 10, mpLv1: 120, mpMax: 251 },
  { id: 'ice-spear', ja: 'アイス・スピア', en: "Ice Spear", tier: 'Rare', element: 'Water', kinds: ['Attack'], targets: ['Multi'], cooldown: 5, mpLv1: 100, mpMax: 209 },
  { id: 'blessing-of-mana', ja: 'マナの祝福', en: "Blessing of Mana", tier: 'Rare', element: 'Water', kinds: ['Buff'], targets: ['Self'], cooldown: 14, mpLv1: 0, mpMax: 0 },
  { id: 'speed-up', ja: 'スピードアップ', en: "Speed Up", tier: 'Unique', element: 'Light', kinds: ['Buff'], targets: ['Self'], cooldown: 18, mpLv1: 150, mpMax: 314 },
  { id: 'lightning-arrow', ja: 'ライトニング・アロー', en: "Lightning Arrow", tier: 'Unique', element: 'Light', kinds: ['Attack'], targets: ['Multi'], cooldown: 10, mpLv1: 150, mpMax: 314 },
  { id: 'dark-contract', ja: '闇の契約', en: "Dark Contract", tier: 'Unique', element: 'Dark', kinds: ['Buff'], targets: ['Self'], cooldown: 26, mpLv1: 80, mpMax: 167 },
  { id: 'curse', ja: 'カース', en: "Curse", tier: 'Unique', element: 'Dark', kinds: ['Debuff', 'Attack'], targets: ['Single'], cooldown: 15, mpLv1: 180, mpMax: 376 },
  { id: 'fire-shield', ja: 'ファイア・シールド', en: "Fire Shield", tier: 'Unique', element: 'Fire', kinds: ['Buff', 'Attack'], targets: ['Self', 'AreaEnemy'], cooldown: 16, mpLv1: 200, mpMax: 418 },
  { id: 'fire-rain', ja: 'ファイア・レイン', en: "Fire Rain", tier: 'Unique', element: 'Fire', kinds: ['Debuff', 'Attack'], targets: ['Multi'], cooldown: 18, mpLv1: 220, mpMax: 460 },
  { id: 'glacial-burst', ja: 'グレシャル・バースト', en: "Glacial Burst", tier: 'Unique', element: 'Water', kinds: ['Attack'], targets: ['AreaEnemy'], cooldown: 9, mpLv1: 130, mpMax: 272 },
  { id: 'ice-tornado', ja: 'アイス・トルネード', en: "Ice Tornado", tier: 'Unique', element: 'Water', kinds: ['Debuff', 'Attack'], targets: ['AreaTracking'], cooldown: 13, mpLv1: 240, mpMax: 502 },
  { id: 'blessing-of-light', ja: '光の祝福', en: "Blessing of Light", tier: 'Epic', element: 'Light', kinds: ['Buff'], targets: ['Self'], cooldown: 22, mpLv1: 250, mpMax: 522 },
  { id: 'light-singularity', ja: '光の特異点', en: "Light Singularity", tier: 'Epic', element: 'Light', kinds: ['Attack'], targets: ['AreaEnemy'], cooldown: 10, mpLv1: 120, mpMax: 251 },
  { id: 'dark-spear', ja: 'ダーク・スピア', en: "Dark Spear", tier: 'Epic', element: 'Dark', kinds: ['Attack'], targets: ['Multi'], cooldown: 18, mpLv1: 200, mpMax: 418 },
  { id: 'dark-nova', ja: 'ダーク・ノヴァ', en: "Dark Nova", tier: 'Epic', element: 'Dark', kinds: ['Attack'], targets: ['AreaSelf'], cooldown: 9, mpLv1: 270, mpMax: 564 },
  { id: 'sacrifice', ja: 'サクリファイス', en: "Sacrifice", tier: 'Epic', element: 'Dark', kinds: ['Debuff', 'Attack'], targets: ['AreaSelf'], cooldown: 20, mpLv1: 0, mpMax: 0 },
  { id: 'fire-tornado', ja: 'ファイア・トルネード', en: "Fire Tornado", tier: 'Epic', element: 'Fire', kinds: ['Attack'], targets: ['AreaTracking'], cooldown: 14, mpLv1: 250, mpMax: 522 },
  { id: 'lava-zone', ja: '溶岩地帯', en: "Lava Zone", tier: 'Epic', element: 'Fire', kinds: ['Debuff', 'Attack'], targets: ['AreaEnemy'], cooldown: 17, mpLv1: 270, mpMax: 564 },
  { id: 'rune-of-fire', ja: '火のルーン', en: "Rune of Fire", tier: 'Epic', element: 'Fire', kinds: ['Buff', 'Attack'], targets: ['AreaSelf'], cooldown: 15, mpLv1: 200, mpMax: 418 },
  { id: 'chilling-armor', ja: 'チリングアーマー', en: "Chilling Armor", tier: 'Epic', element: 'Water', kinds: ['Buff'], targets: ['Self'], cooldown: 20, mpLv1: 150, mpMax: 314 },
  { id: 'ice-nova', ja: 'アイス・ノヴァ', en: "Ice Nova", tier: 'Epic', element: 'Water', kinds: ['Attack'], targets: ['AreaSelf'], cooldown: 13, mpLv1: 300, mpMax: 627 },
  { id: 'aqua-totem', ja: 'アクアトーテム', en: "Aqua Totem", tier: 'Epic', element: 'Water', kinds: ['Debuff', 'Attack'], targets: ['Multi'], cooldown: 16, mpLv1: 270, mpMax: 564 },
  { id: 'carrot-bazooka', ja: 'ニンジンバズーカ！', en: "Carrot Bazooka!", tier: 'Epic', element: 'Light', kinds: ['Buff'], targets: ['AreaSelf'], cooldown: 7, mpLv1: 100, mpMax: 209 },
  { id: 'air-horn-gun', ja: 'エアーホーンガン！', en: "Air Horn Gun!", tier: 'Epic', element: 'Dark', kinds: ['Buff', 'Attack'], targets: ['Self', 'AreaEnemy'], cooldown: 16, mpLv1: 300, mpMax: 627 },
  { id: 'lightning-field', ja: 'ライトニング・フィールド', en: "Lightning Field", tier: 'Legend', element: 'Light', kinds: ['Buff', 'Attack'], targets: ['AreaSelf'], cooldown: 25, mpLv1: 350, mpMax: 732 },
  { id: 'judgment-of-light', ja: '光の審判', en: "Judgment of Light", tier: 'Legend', element: 'Light', kinds: ['Attack'], targets: ['Single'], cooldown: 22, mpLv1: 400, mpMax: 836 },
  { id: 'light-of-punishment', ja: '懲罰の光', en: "Light of Punishment", tier: 'Legend', element: 'Light', kinds: ['Debuff', 'Attack'], targets: ['Multi'], cooldown: 17, mpLv1: 350, mpMax: 732 },
  { id: 'lightning-trap', ja: 'ライトニング・トラップ', en: "Lightning Trap", tier: 'Legend', element: 'Light', kinds: ['Debuff', 'Attack'], targets: ['Multi'], cooldown: 12, mpLv1: 400, mpMax: 836 },
  { id: 'ragnarok', ja: 'ラグナロク', en: "Ragnarok", tier: 'Legend', element: 'Light', kinds: ['Attack'], targets: ['AreaSelf'], cooldown: 19, mpLv1: 420, mpMax: 878 },
  { id: 'song-of-starlight', ja: '星影の歌', en: "Song of Starlight", tier: 'Legend', element: 'Light', kinds: ['Attack'], targets: ['AreaEnemy'], cooldown: 8, mpLv1: 320, mpMax: 669 },
  { id: 'holy-ray', ja: 'ホーリー・レイ', en: "Holy Ray", tier: 'Legend', element: 'Light', kinds: ['Buff', 'Attack'], targets: ['AreaEnemy'], cooldown: 28, mpLv1: 550, mpMax: 1150 },
  { id: 'divine-explosion', ja: '神聖爆発', en: "Divine Explosion", tier: 'Legend', element: 'Light', kinds: ['Attack'], targets: ['AreaEnemy'], cooldown: 14, mpLv1: 300, mpMax: 627 },
  { id: 'black-hole', ja: 'ブラックホール', en: "Black Hole", tier: 'Legend', element: 'Dark', kinds: ['Debuff', 'Attack'], targets: ['AreaEnemy'], cooldown: 15, mpLv1: 300, mpMax: 627 },
  { id: 'seed-of-darkness', ja: '闇の種子', en: "Seed of Darkness", tier: 'Legend', element: 'Dark', kinds: ['Attack'], targets: ['Single'], cooldown: 1, mpLv1: 150, mpMax: 314 },
  { id: 'soul-shackles', ja: '魂の足枷', en: "Soul Shackles", tier: 'Legend', element: 'Dark', kinds: ['Debuff', 'Attack'], targets: ['AreaSelf'], cooldown: 18, mpLv1: 350, mpMax: 732 },
  { id: 'rune-of-ruin', ja: '破滅のルーン', en: "Rune of Ruin", tier: 'Legend', element: 'Dark', kinds: ['Buff', 'Attack'], targets: ['AreaSelf'], cooldown: 22, mpLv1: 400, mpMax: 836 },
  { id: 'dark-force', ja: 'ダーク・フォース', en: "Dark Force", tier: 'Legend', element: 'Dark', kinds: ['Buff', 'Attack'], targets: ['AreaEnemy'], cooldown: 12, mpLv1: 300, mpMax: 627 },
  { id: 'dark-moon', ja: 'ダーク・ムーン', en: "Dark Moon", tier: 'Legend', element: 'Dark', kinds: ['Buff', 'Attack'], targets: ['Single'], cooldown: 21, mpLv1: 360, mpMax: 752 },
  { id: 'soul-drain', ja: 'ソウル・ドレイン', en: "Soul Drain", tier: 'Legend', element: 'Dark', kinds: ['Attack'], targets: ['AreaEnemy'], cooldown: 1.5, mpLv1: 150, mpMax: 314 },
  { id: 'death-impact', ja: 'デスインパクト', en: "Death Impact", tier: 'Legend', element: 'Dark', kinds: ['Debuff', 'Buff', 'Attack'], targets: ['AreaEnemy'], cooldown: 26, mpLv1: 150, mpMax: 314 },
  { id: 'meteor', ja: 'メテオ', en: "Meteor", tier: 'Legend', element: 'Fire', kinds: ['Debuff', 'Attack'], targets: ['AreaEnemy'], cooldown: 22, mpLv1: 250, mpMax: 522 },
  { id: 'enchant-fire', ja: 'エンチャント・ファイア', en: "Enchant Fire", tier: 'Legend', element: 'Fire', kinds: ['Buff'], targets: ['Self'], cooldown: 21, mpLv1: 330, mpMax: 690 },
  { id: 'inferno', ja: 'インフェルノ', en: "Inferno", tier: 'Legend', element: 'Fire', kinds: ['Attack'], targets: ['AreaEnemy'], cooldown: 22, mpLv1: 400, mpMax: 836 },
  { id: 'phoenix-force', ja: 'フェニックス・フォース', en: "Phoenix Force", tier: 'Legend', element: 'Fire', kinds: ['Buff', 'Attack'], targets: ['Single'], cooldown: 28, mpLv1: 100, mpMax: 209 },
  { id: 'hellfire', ja: 'ヘルファイア', en: "Hellfire", tier: 'Legend', element: 'Fire', kinds: ['Attack'], targets: ['AreaEnemy'], cooldown: 3, mpLv1: 270, mpMax: 564 },
  { id: 'purifying-flame', ja: '浄化の炎', en: "Purifying Flame", tier: 'Legend', element: 'Fire', kinds: ['Buff', 'Attack'], targets: ['AreaTracking'], cooldown: 21, mpLv1: 420, mpMax: 878 },
  { id: 'ignite', ja: 'イグナイト', en: "Ignite", tier: 'Legend', element: 'Fire', kinds: ['Debuff', 'Attack'], targets: ['AreaEnemy'], cooldown: 16, mpLv1: 360, mpMax: 752 },
  { id: 'overcharge', ja: 'オーバー・チャージ', en: "Overcharge", tier: 'Legend', element: 'Fire', kinds: ['Buff', 'Attack'], targets: ['AreaSelf'], cooldown: 27, mpLv1: 420, mpMax: 878 },
  { id: 'blizzard', ja: 'ブリザード', en: "Blizzard", tier: 'Legend', element: 'Water', kinds: ['Attack'], targets: ['AreaSelf'], cooldown: 18, mpLv1: 350, mpMax: 732 },
  { id: 'ice-orb', ja: 'アイス・オーブ', en: "Ice Orb", tier: 'Legend', element: 'Water', kinds: ['Attack'], targets: ['AreaTracking'], cooldown: 7, mpLv1: 250, mpMax: 522 },
  { id: 'grace-of-water', ja: '水の恩恵', en: "Grace of Water", tier: 'Legend', element: 'Water', kinds: ['Buff', 'Attack'], targets: ['Self'], cooldown: 23, mpLv1: 150, mpMax: 314 },
  { id: 'spear-of-the-sea-god', ja: '海神の槍', en: "Spear of the Sea God", tier: 'Legend', element: 'Water', kinds: ['Debuff', 'Attack'], targets: ['Multi'], cooldown: 17, mpLv1: 250, mpMax: 522 },
  { id: 'dragon-s-breath', ja: '龍の息吹', en: "Dragon's Breath", tier: 'Legend', element: 'Water', kinds: ['Buff', 'Attack'], targets: ['AreaSelf'], cooldown: 21, mpLv1: 300, mpMax: 627 },
  { id: 'frozen-break', ja: 'フローズン・ブレイク', en: "Frozen Break", tier: 'Legend', element: 'Water', kinds: ['Buff', 'Attack'], targets: ['AreaEnemy'], cooldown: 14, mpLv1: 300, mpMax: 627 },
  { id: 'night-storm', ja: 'ナイト・ストーム', en: "Night Storm", tier: 'Legend', element: 'Water', kinds: ['Buff', 'Attack'], targets: ['AreaSelf'], cooldown: 19, mpLv1: 500, mpMax: 1045 },
  { id: 'wrath-of-water', ja: '水の怒り', en: "Wrath of Water", tier: 'Legend', element: 'Water', kinds: ['Buff', 'Attack'], targets: ['AreaSelf'], cooldown: 17, mpLv1: 250, mpMax: 522 },
  { id: 'curse-of-the-white-night', ja: '白夜の呪い', en: "Curse of the White Night", tier: 'Legend', element: 'Light', kinds: ['Debuff', 'Attack'], targets: ['AreaEnemy'], cooldown: 38, mpLv1: 600, mpMax: 1254 },
  { id: 'apocalypse', ja: 'アポカリプス', en: "Apocalypse", tier: 'Legend', element: 'Dark', kinds: ['Attack'], targets: ['AreaEnemy'], cooldown: 28, mpLv1: 430, mpMax: 899 },
  { id: 'domain-of-fire', ja: '火の領域', en: "Domain of Fire", tier: 'Legend', element: 'Fire', kinds: ['Buff', 'Attack'], targets: ['AreaEnemy'], cooldown: 26, mpLv1: 540, mpMax: 1129 },
  { id: 'squeaky-hammer', ja: 'ピコピコハンマー！', en: "Squeaky Hammer!", tier: 'Legend', element: 'Dark', kinds: ['Debuff', 'Attack'], targets: ['AreaEnemy'], cooldown: 7, mpLv1: 350, mpMax: 732 },
  { id: 'spring-trap', ja: 'スプリングトラップ！', en: "Spring Trap!", tier: 'Legend', element: 'Light', kinds: ['Debuff', 'Attack'], targets: ['AreaEnemy'], cooldown: 14, mpLv1: 400, mpMax: 840 },
  { id: 'odyssey', ja: 'オデッセイ', en: "Odyssey", tier: 'Legend', element: 'Light', kinds: ['Debuff', 'Attack'], targets: ['AreaEnemy'], cooldown: 10, mpLv1: 300, mpMax: 630 },
  { id: 'pole-dignity', ja: 'ポール・ディグニティ', en: "Pole Dignity", tier: 'Legend', element: 'Water', kinds: ['Debuff', 'Attack'], targets: ['AreaEnemy'], cooldown: 10, mpLv1: 50, mpMax: 104 },
  { id: 'lantern-festival', ja: 'ランタン祭り', en: "Lantern Festival", tier: 'Legend', element: 'Fire', kinds: ['Attack'], targets: ['AreaEnemy'], cooldown: 12, mpLv1: 150, mpMax: 314 },
  { id: 'chain-lightning', ja: 'チェインライトニング', en: "Chain Lightning", tier: 'Star', element: 'Light', kinds: ['Attack'], targets: ['AreaEnemy'], cooldown: 10, mpLv1: 120, mpMax: 239 },
  { id: 'judgment-of-charm', ja: '魅惑の審判', en: "Judgment of Charm", tier: 'Star', element: 'Dark', kinds: ['Attack'], targets: ['AreaEnemy'], cooldown: 20, mpLv1: 270, mpMax: 537 },
  { id: 'lava-bullet', ja: 'ラヴァバレット', en: "Lava Bullet", tier: 'Star', element: 'Fire', kinds: ['Buff', 'Attack'], targets: ['AreaEnemy'], cooldown: 35, mpLv1: 300, mpMax: 597 },
  { id: 'aqua-wave', ja: 'アクアウェーブ', en: "Aqua Wave", tier: 'Star', element: 'Water', kinds: ['Attack'], targets: ['AreaEnemy'], cooldown: 7, mpLv1: 100, mpMax: 199 },
];
