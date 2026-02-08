import { weapons, synthesisRules, type WeaponName } from './types';

// 合成ルールを取得
export function getSynthesisRule(name: WeaponName) {
  return synthesisRules[name];
}

// 合成に必要な入力数を取得
export function getInputCount(name: WeaponName): number {
  const rule = synthesisRules[name];
  return rule?.count || 1;
}

// 必要L1数を取得
export function getRequiredL1(name: WeaponName): number {
  return weapons[name].requiredL1;
}

// 合成入力
export interface SynthesisInput {
  name: WeaponName;
  count: number;
}

// 合成結果
export interface SynthesisResult {
  canSynthesize: boolean;
  output?: WeaponName;
  used: number;
  remaining: number;
}

// 合成を実行
export function performSynthesis(input: SynthesisInput): SynthesisResult {
  const rule = synthesisRules[input.name];

  if (!rule) {
    return { canSynthesize: false, used: 0, remaining: input.count };
  }

  if (input.count < rule.count) {
    return { canSynthesize: false, used: 0, remaining: input.count };
  }

  const timesCanSynthesize = Math.floor(input.count / rule.count);
  const used = timesCanSynthesize * rule.count;
  const remaining = input.count - used;

  return { canSynthesize: true, output: rule.output, used, remaining };
}
