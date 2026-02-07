import type { GachaSimulationResult, GachaLevel } from '../types';
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
