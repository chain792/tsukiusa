import type { ExpectationAnalysisResult, GachaLevel, WeaponRarity } from '../types';
import { simulateGachaExpectation } from './gachaSimulator';
import { performSynthesis } from './synthesisCalculator';
import { getRarityShorthand } from '../data/synthesis';

// 合成順序（低レア度から高レア度へ）
const synthesisOrder: string[] = [
  'L4', 'L3', 'L2', 'L1',
  'S4', 'S3', 'S2', 'S1',
  'G4', 'G3', 'G2', 'G1'
];

// 期待値分析を実行
export function analyzeExpectation(
  level: GachaLevel,
  totalPulls: number,
  includeSteps: boolean = false
): ExpectationAnalysisResult {
  // ガチャ結果を取得
  const rawResults = simulateGachaExpectation(level, totalPulls);

  // 武器の在庫マップを作成
  const inventory = new Map<string, number>();
  for (const result of rawResults.results) {
    const name = getRarityShorthand(result.rarity);
    inventory.set(name, result.count);
  }

  const steps: string[] = [];

  // 低レア度から順に合成シミュレーション
  for (const rarityName of synthesisOrder) {
    const count = inventory.get(rarityName) || 0;
    if (count === 0) continue;

    // この武器を基準に合成を試みる
    const rarity = parseWeaponNameToRarity(rarityName);
    if (!rarity) continue;

    const synthesisResult = performSynthesis({ rarity, count });

    if (synthesisResult.canSynthesize && synthesisResult.output) {
      const outputName = getRarityShorthand(synthesisResult.output);
      const outputCount = Math.floor(synthesisResult.used / getInputCount(rarityName));

      // 在庫を更新
      inventory.set(rarityName, synthesisResult.remaining);
      const currentOutput = inventory.get(outputName) || 0;
      inventory.set(outputName, currentOutput + outputCount);

      if (includeSteps) {
        steps.push(
          `${rarityName} ${count.toFixed(2)}本 → ${rarityName} ${synthesisResult.remaining.toFixed(2)}本 + ${outputName} ${outputCount}本`
        );
      }
    }
  }

  // 最終結果を整形
  const synthesizedResults: ExpectationAnalysisResult['synthesizedResults'] = [];
  for (const [rarityName, count] of inventory.entries()) {
    if (count > 0) {
      const rarity = parseWeaponNameToRarity(rarityName);
      if (rarity) {
        synthesizedResults.push({ rarity, count });
      }
    }
  }

  // レア度順にソート（高レア度から）
  synthesizedResults.sort((a, b) => {
    const aIndex = synthesisOrder.indexOf(getRarityShorthand(a.rarity));
    const bIndex = synthesisOrder.indexOf(getRarityShorthand(b.rarity));
    return bIndex - aIndex;
  });

  return {
    gachaLevel: level,
    totalPulls,
    rawResults,
    synthesizedResults,
    synthesisSteps: includeSteps ? steps : undefined
  };
}

// 合成に必要な入力数を取得
function getInputCount(rarityName: string): number {
  const countMap: Record<string, number> = {
    'L4': 5, 'L3': 5, 'L2': 5, 'L1': 3,
    'S4': 3, 'S3': 3, 'S2': 2, 'S1': 2,
    'G4': 2, 'G3': 2, 'G2': 2, 'G1': 2
  };
  return countMap[rarityName] || 1;
}

// 武器名からWeaponRarityを取得（簡易版）
function parseWeaponNameToRarity(name: string): WeaponRarity | null {
  if (name === 'L4') return { tier: 'Legend', level: 4 };
  if (name === 'L3') return { tier: 'Legend', level: 3 };
  if (name === 'L2') return { tier: 'Legend', level: 2 };
  if (name === 'L1') return { tier: 'Legend', level: 1 };
  if (name === 'S4') return { tier: 'Star', level: 4 };
  if (name === 'S3') return { tier: 'Star', level: 3 };
  if (name === 'S2') return { tier: 'Star', level: 2 };
  if (name === 'S1') return { tier: 'Star', level: 1 };
  if (name === 'G4') return { tier: 'Galaxy', level: 4 };
  if (name === 'G3') return { tier: 'Galaxy', level: 3 };
  if (name === 'G2') return { tier: 'Galaxy', level: 2 };
  if (name === 'G1') return { tier: 'Galaxy', level: 1 };
  if (name === 'U4') return { tier: 'Universe', level: 4 };
  return null;
}
