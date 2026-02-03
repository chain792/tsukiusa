import type { GachaRate } from '../types';

// ガチャ確率テーブル
export const gachaRates: GachaRate[] = [
  {
    level: 8,
    legendRate: 0.03,
    legendDistribution: {
      L4: 0.5,
      L3: 0.3,
      L2: 0.15,
      L1: 0.05
    }
  },
  {
    level: 9,
    legendRate: 0.03,
    legendDistribution: {
      L4: 0.5,
      L3: 0.3,
      L2: 0.15,
      L1: 0.05
    },
    starRate: 0.0005,
    starDistribution: {
      S4: 1.0
    }
  },
  {
    level: 10,
    legendRate: 0.03,
    legendDistribution: {
      L4: 0.5,
      L3: 0.3,
      L2: 0.15,
      L1: 0.05
    },
    starRate: 0.001,
    starDistribution: {
      S4: 0.9,
      S3: 0.1
    }
  },
  {
    level: 11,
    legendRate: 0.03,
    legendDistribution: {
      L4: 0.5,
      L3: 0.3,
      L2: 0.15,
      L1: 0.05
    },
    starRate: 0.001,
    starDistribution: {
      S4: 0.8,
      S3: 0.14,
      S2: 0.06
    }
  },
  {
    level: 12,
    legendRate: 0.03,
    legendDistribution: {
      L4: 0.5,
      L3: 0.3,
      L2: 0.15,
      L1: 0.05
    },
    starRate: 0.001,
    starDistribution: {
      S4: 0.75,
      S3: 0.14,
      S2: 0.07,
      S1: 0.04
    }
  },
  {
    level: 13,
    legendRate: 0.04,
    legendDistribution: {
      L4: 0.5,
      L3: 0.3,
      L2: 0.15,
      L1: 0.05
    },
    starRate: 0.0012,
    starDistribution: {
      S4: 0.75,
      S3: 0.14,
      S2: 0.07,
      S1: 0.04
    }
  },
  {
    level: 14,
    legendRate: 0.04,
    legendDistribution: {
      L4: 0.5,
      L3: 0.3,
      L2: 0.15,
      L1: 0.05
    },
    starRate: 0.0016,
    starDistribution: {
      S4: 0.75,
      S3: 0.14,
      S2: 0.07,
      S1: 0.04
    }
  }
];

// ガチャレベルから確率テーブルを取得
export function getGachaRate(level: number): GachaRate | undefined {
  return gachaRates.find(rate => rate.level === level);
}

// 各レア度の実際の確率を計算する関数
export function calculateActualProbabilities(level: number): Record<string, number> {
  const rate = getGachaRate(level);
  if (!rate) return {};

  const probabilities: Record<string, number> = {};

  // レジェンド等級の確率
  probabilities.L4 = rate.legendRate * rate.legendDistribution.L4;
  probabilities.L3 = rate.legendRate * rate.legendDistribution.L3;
  probabilities.L2 = rate.legendRate * rate.legendDistribution.L2;
  probabilities.L1 = rate.legendRate * rate.legendDistribution.L1;

  // スター等級の確率
  if (rate.starRate && rate.starDistribution) {
    probabilities.S4 = rate.starRate * rate.starDistribution.S4;
    if (rate.starDistribution.S3) {
      probabilities.S3 = rate.starRate * rate.starDistribution.S3;
    }
    if (rate.starDistribution.S2) {
      probabilities.S2 = rate.starRate * rate.starDistribution.S2;
    }
    if (rate.starDistribution.S1) {
      probabilities.S1 = rate.starRate * rate.starDistribution.S1;
    }
  }

  return probabilities;
}
