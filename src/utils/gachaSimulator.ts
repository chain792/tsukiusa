import type { GachaSimulationResult, WeaponRarity, GachaLevel } from '../types';
import { calculateActualProbabilities } from '../data/gacha';
import { parseWeaponName } from '../data/weapons';

// ガチャをN回引いたときの期待値を計算
export function simulateGachaExpectation(level: GachaLevel, totalPulls: number): GachaSimulationResult {
  const probabilities = calculateActualProbabilities(level);
  const results: GachaSimulationResult['results'] = [];

  // 各レア度の期待値を計算
  for (const [rarityName, probability] of Object.entries(probabilities)) {
    const rarity = parseWeaponName(rarityName);
    if (!rarity) continue;

    const expectedCount = totalPulls * probability;

    results.push({
      rarity,
      count: expectedCount,
      probability
    });
  }

  // 確率の高い順にソート
  results.sort((a, b) => b.probability - a.probability);

  return {
    totalPulls,
    results
  };
}

// ガチャをランダムシミュレーション（実際の抽選）
export function simulateGachaRandom(level: GachaLevel, totalPulls: number): GachaSimulationResult {
  const probabilities = calculateActualProbabilities(level);
  const counts: Record<string, number> = {};

  // 各レア度のカウントを初期化
  for (const rarityName of Object.keys(probabilities)) {
    counts[rarityName] = 0;
  }

  // ガチャを引く
  for (let i = 0; i < totalPulls; i++) {
    const roll = Math.random();
    let cumulativeProbability = 0;

    // 確率に基づいて抽選
    for (const [rarityName, probability] of Object.entries(probabilities)) {
      cumulativeProbability += probability;
      if (roll < cumulativeProbability) {
        counts[rarityName]++;
        break;
      }
    }
  }

  // 結果を整形
  const results: GachaSimulationResult['results'] = [];
  for (const [rarityName, count] of Object.entries(counts)) {
    const rarity = parseWeaponName(rarityName);
    if (!rarity || count === 0) continue;

    results.push({
      rarity,
      count,
      probability: probabilities[rarityName]
    });
  }

  // 確率の高い順にソート
  results.sort((a, b) => b.probability - a.probability);

  return {
    totalPulls,
    results
  };
}

// ガチャ結果を整数に丸める（期待値の場合）
export function roundGachaResults(result: GachaSimulationResult): GachaSimulationResult {
  return {
    ...result,
    results: result.results.map(r => ({
      ...r,
      count: Math.floor(r.count)
    }))
  };
}
