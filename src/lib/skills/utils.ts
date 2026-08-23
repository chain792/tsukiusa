import type { Locale } from '../../i18n/types';
import type { Skill } from './data';
import { skillDetails } from './details';

/** ロケールに応じたスキル名 */
export function getSkillDisplayName(skill: Skill, locale: Locale = 'ja'): string {
  return locale === 'en' ? skill.en : skill.ja;
}

/** サイトで既定表示するスキルレベル */
export const defaultSkillLevel = 300;

/**
 * 任意レベルのMP消費量（推定値）。
 *
 * 公式wikiに載っているのは Lv.1 と Lv.110 の2点だけなので、
 * その2点から「毎レベル Lv.1 の値の1%ずつ加算される」と推定した式で外挿している。
 *
 *   MP(Lv) = MP(Lv.1) × (1 + 0.01 × (Lv - 1))
 *
 * Lv.110 では ×2.09 となり、スター以外のほぼ全スキルで wiki の値と一致する
 * （検証は `mpMax` との突き合わせで行える。オデッセイとスプリングトラップの2件のみ
 * wiki 値が ×2.10、スタースキルは ×1.99 でずれる）。
 *
 * ゲーム内での実測による裏取りは未実施。表示側で推定値である旨を明示すること。
 */
export function getMpAtLevel(skill: Skill, level: number): number {
  if (skill.mpLv1 === 0) return 0;
  return Math.round(skill.mpLv1 * (1 + 0.01 * (getEffectiveLevel(skill, level) - 1)));
}

/**
 * 指定レベルをそのスキルの上限で丸めた実効レベル。
 * レジェンド以下は Lv.110、スタースキルは Lv.100 が上限。
 */
export function getEffectiveLevel(skill: Skill, level: number): number {
  const max = skillDetails[skill.id]?.maxLevel ?? 110;
  return Math.min(Math.max(1, level), max);
}

/**
 * 毎秒あたりのMP消費量。
 * クールタイムごとに撃ち続けた場合の理論値で、小さいほどMP効率が良い。
 */
export function getMpPerSecond(skill: Skill, level: number): number {
  if (skill.cooldown <= 0) return 0;
  return getMpAtLevel(skill, level) / skill.cooldown;
}
