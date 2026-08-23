import { skillRunes, runeSlotCounts, type RuneGrade, type RuneTierEffects } from './runes';

/** 1枠に特定の効果1つが出る確率 */
export function effectChancePerSlot(tier: RuneTierEffects): number {
  if (tier.effects.length === 0) return 0;
  return tier.probability / tier.effects.length;
}

/**
 * 変換1回（全枠振り直し）で、狙いの効果が少なくとも1枠に出る確率。
 *
 * 各枠を独立した抽選として計算している。
 * 実際にはレジェンド/スター効果は「最大1つまで」という制約があるため、
 * それらを狙う場合は厳密には独立ではない（表示側で注記すること）。
 */
export function chancePerConversion(perSlot: number, slots: number): number {
  if (perSlot <= 0) return 0;
  return 1 - Math.pow(1 - perSlot, slots);
}

/** 目標到達率 target（0〜1）に必要な変換回数 */
export function conversionsFor(chance: number, target: number): number | null {
  if (chance <= 0) return null;
  if (chance >= 1) return 1;
  return Math.ceil(Math.log(1 - target) / Math.log(1 - chance));
}

/** 期待変換回数（幾何分布の平均） */
export function expectedConversions(chance: number): number | null {
  if (chance <= 0) return null;
  return 1 / chance;
}

export interface RuneOdds {
  /** 1枠あたりの出現確率 */
  perSlot: number;
  /** 変換1回で少なくとも1枠に出る確率 */
  perConversion: number;
  expected: number | null;
  /** 到達率 → 必要な変換回数 */
  milestones: { target: number; conversions: number | null }[];
}

const MILESTONES = [0.5, 0.9, 0.99];

export function calcRuneOdds(skillId: string, tierName: string, grade: RuneGrade): RuneOdds | null {
  const tiers = skillRunes[skillId];
  if (!tiers) return null;
  const tier = tiers.find(t => t.tier === tierName);
  if (!tier) return null;
  const perSlot = effectChancePerSlot(tier);
  const perConversion = chancePerConversion(perSlot, runeSlotCounts[grade]);
  return {
    perSlot,
    perConversion,
    expected: expectedConversions(perConversion),
    milestones: MILESTONES.map(target => ({ target, conversions: conversionsFor(perConversion, target) })),
  };
}
