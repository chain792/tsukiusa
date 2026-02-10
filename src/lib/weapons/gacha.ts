import type { GachaRate, GachaSimulationResult, GachaLevel, WeaponName } from './types';
import { isWeaponName } from './types';

// エピック以下の共通分布（全レベル共通）
const normalDistribution = { N4: 0.25, N3: 0.25, N2: 0.25, N1: 0.25 } as const;
const magicRate = 0.05;
const magicDistribution = { M4: 0.30, M3: 0.25, M2: 0.25, M1: 0.20 } as const;
const rareRate = 0.21;
const rareDistribution = { R4: 0.35, R3: 0.30, R2: 0.20, R1: 0.15 } as const;
const uniqueRate = 0.45;
const uniqueDistribution = { Unique4: 0.40, Unique3: 0.30, Unique2: 0.20, Unique1: 0.10 } as const;
const epicRate = 0.229;
const epicDistribution = { E4: 0.45, E3: 0.30, E2: 0.18, E1: 0.07 } as const;

// ガチャ確率テーブル
export const gachaRates: GachaRate[] = [
  {
    level: 8,
    normalRate: 0.03, normalDistribution,
    magicRate, magicDistribution,
    rareRate, rareDistribution,
    uniqueRate, uniqueDistribution,
    epicRate, epicDistribution,
    legendRate: 0.03,
    legendDistribution: { L4: 0.5, L3: 0.3, L2: 0.15, L1: 0.05 },
  },
  {
    level: 9,
    normalRate: 0.03, normalDistribution,
    magicRate, magicDistribution,
    rareRate, rareDistribution,
    uniqueRate, uniqueDistribution,
    epicRate, epicDistribution,
    legendRate: 0.03,
    legendDistribution: { L4: 0.5, L3: 0.3, L2: 0.15, L1: 0.05 },
    starRate: 0.0005,
    starDistribution: { S4: 1.0 },
  },
  {
    level: 10,
    normalRate: 0.03, normalDistribution,
    magicRate, magicDistribution,
    rareRate, rareDistribution,
    uniqueRate, uniqueDistribution,
    epicRate, epicDistribution,
    legendRate: 0.03,
    legendDistribution: { L4: 0.5, L3: 0.3, L2: 0.15, L1: 0.05 },
    starRate: 0.001,
    starDistribution: { S4: 0.9, S3: 0.1 },
  },
  {
    level: 11,
    normalRate: 0.03, normalDistribution,
    magicRate, magicDistribution,
    rareRate, rareDistribution,
    uniqueRate, uniqueDistribution,
    epicRate, epicDistribution,
    legendRate: 0.03,
    legendDistribution: { L4: 0.5, L3: 0.3, L2: 0.15, L1: 0.05 },
    starRate: 0.001,
    starDistribution: { S4: 0.8, S3: 0.14, S2: 0.06 },
  },
  {
    level: 12,
    normalRate: 0.03, normalDistribution,
    magicRate, magicDistribution,
    rareRate, rareDistribution,
    uniqueRate, uniqueDistribution,
    epicRate, epicDistribution,
    legendRate: 0.03,
    legendDistribution: { L4: 0.5, L3: 0.3, L2: 0.15, L1: 0.05 },
    starRate: 0.001,
    starDistribution: { S4: 0.75, S3: 0.14, S2: 0.07, S1: 0.04 },
  },
  {
    level: 13,
    normalRate: 0.0198, normalDistribution,
    magicRate, magicDistribution,
    rareRate, rareDistribution,
    uniqueRate, uniqueDistribution,
    epicRate, epicDistribution,
    legendRate: 0.04,
    legendDistribution: { L4: 0.5, L3: 0.3, L2: 0.15, L1: 0.05 },
    starRate: 0.0012,
    starDistribution: { S4: 0.75, S3: 0.14, S2: 0.07, S1: 0.04 },
  },
  {
    level: 14,
    normalRate: 0.0194, normalDistribution,
    magicRate, magicDistribution,
    rareRate, rareDistribution,
    uniqueRate, uniqueDistribution,
    epicRate, epicDistribution,
    legendRate: 0.04,
    legendDistribution: { L4: 0.5, L3: 0.3, L2: 0.15, L1: 0.05 },
    starRate: 0.0016,
    starDistribution: { S4: 0.75, S3: 0.14, S2: 0.07, S1: 0.04 },
  },
];

// ガチャレベルから確率テーブルを取得
export function getGachaRate(level: GachaLevel): GachaRate | undefined {
  return gachaRates.find(rate => rate.level === level);
}

// 各レア度の実際の確率を計算
export function calculateActualProbabilities(level: GachaLevel): Partial<Record<WeaponName, number>> {
  const rate = getGachaRate(level);
  if (!rate) return {};

  const probabilities: Partial<Record<WeaponName, number>> = {};

  // ノーマル等級
  probabilities.N4 = rate.normalRate * rate.normalDistribution.N4;
  probabilities.N3 = rate.normalRate * rate.normalDistribution.N3;
  probabilities.N2 = rate.normalRate * rate.normalDistribution.N2;
  probabilities.N1 = rate.normalRate * rate.normalDistribution.N1;

  // マジック等級
  probabilities.M4 = rate.magicRate * rate.magicDistribution.M4;
  probabilities.M3 = rate.magicRate * rate.magicDistribution.M3;
  probabilities.M2 = rate.magicRate * rate.magicDistribution.M2;
  probabilities.M1 = rate.magicRate * rate.magicDistribution.M1;

  // レア等級
  probabilities.R4 = rate.rareRate * rate.rareDistribution.R4;
  probabilities.R3 = rate.rareRate * rate.rareDistribution.R3;
  probabilities.R2 = rate.rareRate * rate.rareDistribution.R2;
  probabilities.R1 = rate.rareRate * rate.rareDistribution.R1;

  // ユニーク等級
  probabilities.Unique4 = rate.uniqueRate * rate.uniqueDistribution.Unique4;
  probabilities.Unique3 = rate.uniqueRate * rate.uniqueDistribution.Unique3;
  probabilities.Unique2 = rate.uniqueRate * rate.uniqueDistribution.Unique2;
  probabilities.Unique1 = rate.uniqueRate * rate.uniqueDistribution.Unique1;

  // エピック等級
  probabilities.E4 = rate.epicRate * rate.epicDistribution.E4;
  probabilities.E3 = rate.epicRate * rate.epicDistribution.E3;
  probabilities.E2 = rate.epicRate * rate.epicDistribution.E2;
  probabilities.E1 = rate.epicRate * rate.epicDistribution.E1;

  // レジェンド等級
  probabilities.L4 = rate.legendRate * rate.legendDistribution.L4;
  probabilities.L3 = rate.legendRate * rate.legendDistribution.L3;
  probabilities.L2 = rate.legendRate * rate.legendDistribution.L2;
  probabilities.L1 = rate.legendRate * rate.legendDistribution.L1;

  // スター等級
  if (rate.starRate && rate.starDistribution) {
    probabilities.S4 = rate.starRate * rate.starDistribution.S4;
    if (rate.starDistribution.S3) probabilities.S3 = rate.starRate * rate.starDistribution.S3;
    if (rate.starDistribution.S2) probabilities.S2 = rate.starRate * rate.starDistribution.S2;
    if (rate.starDistribution.S1) probabilities.S1 = rate.starRate * rate.starDistribution.S1;
  }

  return probabilities;
}

// ガチャをN回引いたときの期待値を計算
export function simulateGachaExpectation(level: GachaLevel, totalPulls: number): GachaSimulationResult {
  const probabilities = calculateActualProbabilities(level);
  const results: GachaSimulationResult['results'] = [];

  for (const [name, probability] of Object.entries(probabilities)) {
    if (!isWeaponName(name) || !probability) continue;

    results.push({
      name,
      count: totalPulls * probability,
      probability,
    });
  }

  results.sort((a, b) => b.probability - a.probability);

  return { totalPulls, results };
}
