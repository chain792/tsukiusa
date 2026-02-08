// 武器定義
export const weapons = {
  L4: { tier: 'Legend', level: 4, requiredL1: 1/125 },
  L3: { tier: 'Legend', level: 3, requiredL1: 1/25 },
  L2: { tier: 'Legend', level: 2, requiredL1: 1/5 },
  L1: { tier: 'Legend', level: 1, requiredL1: 1 },
  S4: { tier: 'Star', level: 4, requiredL1: 3 },
  S3: { tier: 'Star', level: 3, requiredL1: 9 },
  S2: { tier: 'Star', level: 2, requiredL1: 27 },
  S1: { tier: 'Star', level: 1, requiredL1: 54 },
  G4: { tier: 'Galaxy', level: 4, requiredL1: 108 },
  G3: { tier: 'Galaxy', level: 3, requiredL1: 216 },
  G2: { tier: 'Galaxy', level: 2, requiredL1: 432 },
  G1: { tier: 'Galaxy', level: 1, requiredL1: 864 },
  U4: { tier: 'Universe', level: 4, requiredL1: 1728 },
} as const;

// 武器名の型
export type WeaponName = keyof typeof weapons;

// 武器名の配列（順序付き）
export const weaponNames: WeaponName[] = ['L4', 'L3', 'L2', 'L1', 'S4', 'S3', 'S2', 'S1', 'G4', 'G3', 'G2', 'G1', 'U4'];

// ティアの型
export type WeaponTier = typeof weapons[WeaponName]['tier'];

// 合成ルール定義
export const synthesisRules: Record<WeaponName, { output: WeaponName; count: number } | null> = {
  L4: { output: 'L3', count: 5 },
  L3: { output: 'L2', count: 5 },
  L2: { output: 'L1', count: 5 },
  L1: { output: 'S4', count: 3 },
  S4: { output: 'S3', count: 3 },
  S3: { output: 'S2', count: 3 },
  S2: { output: 'S1', count: 2 },
  S1: { output: 'G4', count: 2 },
  G4: { output: 'G3', count: 2 },
  G3: { output: 'G2', count: 2 },
  G2: { output: 'G1', count: 2 },
  G1: { output: 'U4', count: 2 },
  U4: null, // 最上位、合成不可
};

// ガチャレベルの型定義
export type GachaLevel = 8 | 9 | 10 | 11 | 12 | 13 | 14;

// ガチャ確率テーブルの型定義
export interface GachaRate {
  level: GachaLevel;
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
