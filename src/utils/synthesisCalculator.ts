import type { WeaponRarity } from '../types';
import { getRequiredL1, getRarityShorthand, findSynthesisRule } from '../data/synthesis';

// 目標武器を作るために必要なL1の本数を計算
export function calculateRequiredBase(targetRarity: WeaponRarity): number {
  return getRequiredL1(targetRarity);
}

// 合成経路を計算（逆順にたどる）
export function calculateSynthesisPath(targetRarity: WeaponRarity): string[] {
  const path: string[] = [];
  const targetName = getRarityShorthand(targetRarity);

  // U4からL1までの経路を逆順で記録
  const pathMap: Record<string, { from: string; count: number }> = {
    'L3': { from: 'L4', count: 5 },
    'L2': { from: 'L3', count: 5 },
    'L1': { from: 'L2', count: 5 },
    'S4': { from: 'L1', count: 3 },
    'S3': { from: 'S4', count: 3 },
    'S2': { from: 'S3', count: 3 },
    'S1': { from: 'S2', count: 2 },
    'G4': { from: 'S1', count: 2 },
    'G3': { from: 'G4', count: 2 },
    'G2': { from: 'G3', count: 2 },
    'G1': { from: 'G2', count: 2 },
    'U4': { from: 'G1', count: 2 }
  };

  let current = targetName;
  while (current !== 'L1' && pathMap[current]) {
    const { from, count } = pathMap[current];
    path.unshift(`${from} × ${count} → ${current}`);
    current = from;
  }

  return path;
}

// 複数の素材から合成可能かチェック
export interface SynthesisInput {
  rarity: WeaponRarity;
  count: number;
}

export interface SynthesisResult {
  canSynthesize: boolean;
  output?: WeaponRarity;
  used: number;
  remaining: number;
}

// 合成を実行
export function performSynthesis(input: SynthesisInput): SynthesisResult {
  const rule = findSynthesisRule(input.rarity);

  if (!rule) {
    return {
      canSynthesize: false,
      used: 0,
      remaining: input.count
    };
  }

  const requiredCount = rule.input.count;
  if (input.count < requiredCount) {
    return {
      canSynthesize: false,
      used: 0,
      remaining: input.count
    };
  }

  const timesCanSynthesize = Math.floor(input.count / requiredCount);
  const used = timesCanSynthesize * requiredCount;
  const remaining = input.count - used;

  return {
    canSynthesize: true,
    output: rule.output,
    used,
    remaining
  };
}
