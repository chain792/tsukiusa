// 武器レア度の型定義
export type WeaponTier = 'Normal' | 'Rare' | 'Epic' | 'Legend' | 'Star' | 'Galaxy' | 'Universe';

export type LegendLevel = 1 | 2 | 3 | 4;
export type StarLevel = 1 | 2 | 3 | 4;
export type GalaxyLevel = 1 | 2 | 3 | 4;
export type UniverseLevel = 4;

export type WeaponRarity =
  | { tier: 'Normal' }
  | { tier: 'Rare' }
  | { tier: 'Epic' }
  | { tier: 'Legend'; level: LegendLevel }
  | { tier: 'Star'; level: StarLevel }
  | { tier: 'Galaxy'; level: GalaxyLevel }
  | { tier: 'Universe'; level: UniverseLevel };

// 合成ルールの型定義
export interface SynthesisRule {
  input: {
    rarity: WeaponRarity;
    count: number;
  };
  output: WeaponRarity;
}

// ガチャレベルの型定義
export type GachaLevel = 8 | 9 | 10 | 11 | 12 | 13 | 14;

// ガチャ確率テーブルの型定義
export interface GachaRate {
  level: GachaLevel;
  legendRate: number; // レジェンド等級の確率（小数）
  legendDistribution: {
    L4: number; // Legend Level 4 の確率（等級内での割合、小数）
    L3: number; // Legend Level 3 の確率
    L2: number; // Legend Level 2 の確率
    L1: number; // Legend Level 1 の確率
  };
  starRate?: number; // スター等級の確率（小数、オプション）
  starDistribution?: {
    S4: number; // Star Level 4 の確率（等級内での割合、小数）
    S3?: number; // Star Level 3 の確率
    S2?: number; // Star Level 2 の確率
    S1?: number; // Star Level 1 の確率
  };
}

// 武器の表示情報
export interface WeaponInfo {
  rarity: WeaponRarity;
  name: string; // 表示名（例: "L4", "S3", "G1"）
  requiredL1: number; // L1換算で必要な本数
  color: string; // 表示色（Hex）
}

// ガチャシミュレーション結果
export interface GachaSimulationResult {
  totalPulls: number; // 試行回数
  results: {
    rarity: WeaponRarity;
    count: number; // 排出された本数
    probability: number; // 確率（小数）
  }[];
}

// 期待値分析結果
export interface ExpectationAnalysisResult {
  gachaLevel: GachaLevel;
  totalPulls: number;
  rawResults: GachaSimulationResult; // ガチャ排出結果
  synthesizedResults: {
    rarity: WeaponRarity;
    count: number; // 合成後の本数
  }[];
  synthesisSteps?: string[]; // 合成過程の説明（オプション）
}

// レア度の略称
export type RarityShorthand =
  | 'Normal'
  | 'Rare'
  | 'Epic'
  | 'L4' | 'L3' | 'L2' | 'L1'
  | 'S4' | 'S3' | 'S2' | 'S1'
  | 'G4' | 'G3' | 'G2' | 'G1'
  | 'U4';
