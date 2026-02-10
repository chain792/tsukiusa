// 武器定義
export const weapons = {
  // Normal
  N4: { tier: 'Normal', level: 4, requiredL1: 1 / (5 ** 23) },
  N3: { tier: 'Normal', level: 3, requiredL1: 1 / (5 ** 22) },
  N2: { tier: 'Normal', level: 2, requiredL1: 1 / (5 ** 21) },
  N1: { tier: 'Normal', level: 1, requiredL1: 1 / (5 ** 20) },
  // Magic
  M4: { tier: 'Magic', level: 4, requiredL1: 1 / (5 ** 19) },
  M3: { tier: 'Magic', level: 3, requiredL1: 1 / (5 ** 18) },
  M2: { tier: 'Magic', level: 2, requiredL1: 1 / (5 ** 17) },
  M1: { tier: 'Magic', level: 1, requiredL1: 1 / (5 ** 16) },
  // Rare
  R4: { tier: 'Rare', level: 4, requiredL1: 1 / (5 ** 15) },
  R3: { tier: 'Rare', level: 3, requiredL1: 1 / (5 ** 14) },
  R2: { tier: 'Rare', level: 2, requiredL1: 1 / (5 ** 13) },
  R1: { tier: 'Rare', level: 1, requiredL1: 1 / (5 ** 12) },
  // Unique
  Unique4: { tier: 'Unique', level: 4, requiredL1: 1 / (5 ** 11) },
  Unique3: { tier: 'Unique', level: 3, requiredL1: 1 / (5 ** 10) },
  Unique2: { tier: 'Unique', level: 2, requiredL1: 1 / (5 ** 9) },
  Unique1: { tier: 'Unique', level: 1, requiredL1: 1 / (5 ** 8) },
  // Epic
  E4: { tier: 'Epic', level: 4, requiredL1: 1 / (5 ** 7) },
  E3: { tier: 'Epic', level: 3, requiredL1: 1 / (5 ** 6) },
  E2: { tier: 'Epic', level: 2, requiredL1: 1 / (5 ** 5) },
  E1: { tier: 'Epic', level: 1, requiredL1: 1 / (5 ** 4) },
  // Legend
  L4: { tier: 'Legend', level: 4, requiredL1: 1/125 },
  L3: { tier: 'Legend', level: 3, requiredL1: 1/25 },
  L2: { tier: 'Legend', level: 2, requiredL1: 1/5 },
  L1: { tier: 'Legend', level: 1, requiredL1: 1 },
  // Star
  S4: { tier: 'Star', level: 4, requiredL1: 3 },
  S3: { tier: 'Star', level: 3, requiredL1: 9 },
  S2: { tier: 'Star', level: 2, requiredL1: 27 },
  S1: { tier: 'Star', level: 1, requiredL1: 54 },
  // Galaxy
  G4: { tier: 'Galaxy', level: 4, requiredL1: 108 },
  G3: { tier: 'Galaxy', level: 3, requiredL1: 216 },
  G2: { tier: 'Galaxy', level: 2, requiredL1: 432 },
  G1: { tier: 'Galaxy', level: 1, requiredL1: 864 },
  // Universe
  U4: { tier: 'Universe', level: 4, requiredL1: 1728 },
} as const;

// 武器名の型
export type WeaponName = keyof typeof weapons;

// 武器名の配列（順序付き）
export const weaponNames: WeaponName[] = [
  'N4', 'N3', 'N2', 'N1',
  'M4', 'M3', 'M2', 'M1',
  'R4', 'R3', 'R2', 'R1',
  'Unique4', 'Unique3', 'Unique2', 'Unique1',
  'E4', 'E3', 'E2', 'E1',
  'L4', 'L3', 'L2', 'L1',
  'S4', 'S3', 'S2', 'S1',
  'G4', 'G3', 'G2', 'G1',
  'U4',
];

// ティアの型
export type WeaponTier = typeof weapons[WeaponName]['tier'];

// 合成ルール定義
export const synthesisRules: Record<WeaponName, { output: WeaponName; count: number } | null> = {
  // Normal: 5本 → 次の等級
  N4: { output: 'N3', count: 5 },
  N3: { output: 'N2', count: 5 },
  N2: { output: 'N1', count: 5 },
  N1: { output: 'M4', count: 5 },
  // Magic: 5本 → 次の等級
  M4: { output: 'M3', count: 5 },
  M3: { output: 'M2', count: 5 },
  M2: { output: 'M1', count: 5 },
  M1: { output: 'R4', count: 5 },
  // Rare: 5本 → 次の等級
  R4: { output: 'R3', count: 5 },
  R3: { output: 'R2', count: 5 },
  R2: { output: 'R1', count: 5 },
  R1: { output: 'Unique4', count: 5 },
  // Unique: 5本 → 次の等級
  Unique4: { output: 'Unique3', count: 5 },
  Unique3: { output: 'Unique2', count: 5 },
  Unique2: { output: 'Unique1', count: 5 },
  Unique1: { output: 'E4', count: 5 },
  // Epic: 5本 → 次の等級
  E4: { output: 'E3', count: 5 },
  E3: { output: 'E2', count: 5 },
  E2: { output: 'E1', count: 5 },
  E1: { output: 'L4', count: 5 },
  // Legend
  L4: { output: 'L3', count: 5 },
  L3: { output: 'L2', count: 5 },
  L2: { output: 'L1', count: 5 },
  L1: { output: 'S4', count: 3 },
  // Star
  S4: { output: 'S3', count: 3 },
  S3: { output: 'S2', count: 3 },
  S2: { output: 'S1', count: 2 },
  S1: { output: 'G4', count: 2 },
  // Galaxy
  G4: { output: 'G3', count: 2 },
  G3: { output: 'G2', count: 2 },
  G2: { output: 'G1', count: 2 },
  G1: { output: 'U4', count: 2 },
  // Universe
  U4: null, // 最上位、合成不可
};

// ガチャレベルの型定義
export type GachaLevel = 8 | 9 | 10 | 11 | 12 | 13 | 14;

// ガチャ確率テーブルの型定義
export interface GachaRate {
  level: GachaLevel;
  normalRate: number;
  normalDistribution: { N4: number; N3: number; N2: number; N1: number };
  magicRate: number;
  magicDistribution: { M4: number; M3: number; M2: number; M1: number };
  rareRate: number;
  rareDistribution: { R4: number; R3: number; R2: number; R1: number };
  uniqueRate: number;
  uniqueDistribution: { Unique4: number; Unique3: number; Unique2: number; Unique1: number };
  epicRate: number;
  epicDistribution: { E4: number; E3: number; E2: number; E1: number };
  legendRate: number;
  legendDistribution: { L4: number; L3: number; L2: number; L1: number };
  starRate?: number;
  starDistribution?: { S4: number; S3?: number; S2?: number; S1?: number };
}

// ガチャシミュレーション結果
export interface GachaResult {
  name: WeaponName;
  count: number;
  probability: number;
}

export interface GachaSimulationResult {
  totalPulls: number;
  results: GachaResult[];
}

// 期待値分析結果
export interface ExpectationAnalysisResult {
  gachaLevel: GachaLevel;
  totalPulls: number;
  rawResults: GachaSimulationResult;
  synthesizedResults: { name: WeaponName; count: number }[];
}

// 武器情報を取得
export function getWeapon(name: WeaponName) {
  return weapons[name];
}

// 武器名かどうかをチェック
export function isWeaponName(name: string): name is WeaponName {
  return name in weapons;
}
