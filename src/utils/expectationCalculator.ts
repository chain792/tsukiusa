import type { ExpectationAnalysisResult, GachaLevel, WeaponName } from '../lib/weapons';
import {
  simulateGachaExpectation,
  getInputCount,
  synthesisRules,
  performSynthesis,
} from '../lib/weapons';

// 合成順序（低レア度から高レア度へ）
const synthesisOrder: WeaponName[] = [
  'L4', 'L3', 'L2', 'L1',
  'S4', 'S3', 'S2', 'S1',
  'G4', 'G3', 'G2', 'G1',
];

// 期待値分析を実行
export function analyzeExpectation(
  level: GachaLevel,
  totalPulls: number,
): ExpectationAnalysisResult {
  const rawResults = simulateGachaExpectation(level, totalPulls);

  // 武器の在庫マップを作成
  const inventory = new Map<WeaponName, number>();
  for (const result of rawResults.results) {
    inventory.set(result.name, result.count);
  }

  // 低レア度から順に合成シミュレーション
  for (const name of synthesisOrder) {
    const count = inventory.get(name) || 0;
    if (count === 0) continue;

    const rule = synthesisRules[name];
    if (!rule) continue;

    const synthesisResult = performSynthesis({ name, count });

    if (synthesisResult.canSynthesize && synthesisResult.output) {
      const outputCount = Math.floor(synthesisResult.used / getInputCount(name));

      inventory.set(name, synthesisResult.remaining);
      const currentOutput = inventory.get(synthesisResult.output) || 0;
      inventory.set(synthesisResult.output, currentOutput + outputCount);
    }
  }

  // 最終結果を整形
  const synthesizedResults: ExpectationAnalysisResult['synthesizedResults'] = [];
  for (const [name, count] of inventory.entries()) {
    if (count > 0) {
      synthesizedResults.push({ name, count });
    }
  }

  synthesizedResults.sort((a, b) => {
    const aIndex = synthesisOrder.indexOf(a.name);
    const bIndex = synthesisOrder.indexOf(b.name);
    // U4 は synthesisOrder に含まれないので -1 になる、最後にソート
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return bIndex - aIndex;
  });

  return {
    gachaLevel: level,
    totalPulls,
    rawResults,
    synthesizedResults,
  };
}
