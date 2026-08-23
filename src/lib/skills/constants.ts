import type { Locale } from '../../i18n/types';
import type { SkillTier, SkillElement, SkillKind, SkillTarget } from './data';

export const skillTierNames: Record<Locale, Record<SkillTier, string>> = {
  ja: { Rare: 'レア', Unique: 'ユニーク', Epic: 'エピック', Legend: 'レジェンド', Star: 'スター' },
  en: { Rare: 'Rare', Unique: 'Unique', Epic: 'Epic', Legend: 'Legend', Star: 'Star' },
};

export const skillElementNames: Record<Locale, Record<SkillElement, string>> = {
  ja: { Light: '光', Dark: '闇', Fire: '火', Water: '水' },
  en: { Light: 'Light', Dark: 'Dark', Fire: 'Fire', Water: 'Water' },
};

export const skillKindNames: Record<Locale, Record<SkillKind, string>> = {
  ja: { Attack: '攻撃型', Buff: 'バフ型', Debuff: 'デバフ型' },
  en: { Attack: 'Attack', Buff: 'Buff', Debuff: 'Debuff' },
};

export const skillTargetNames: Record<Locale, Record<SkillTarget, string>> = {
  ja: {
    Self: '自分',
    Single: '単数',
    Multi: '複数',
    AreaEnemy: '範囲(敵)',
    AreaFixed: '範囲(固定)',
    AreaTracking: '範囲(追跡)',
    AreaSelf: '範囲(自分)',
  },
  en: {
    Self: 'Self',
    Single: 'Single',
    Multi: 'Multi',
    AreaEnemy: 'Area (Enemy)',
    AreaFixed: 'Area (Fixed)',
    AreaTracking: 'Area (Tracking)',
    AreaSelf: 'Area (Self)',
  },
};

export const runeTierNames: Record<Locale, Record<string, string>> = {
  ja: { Magic: 'マジック', Rare: 'レア', Unique: 'ユニーク', Epic: 'エピック', Legend: 'レジェンド', Star: 'スター' },
  en: { Magic: 'Magic', Rare: 'Rare', Unique: 'Unique', Epic: 'Epic', Legend: 'Legend', Star: 'Star' },
};

export const runeTierColors: Record<string, string> = {
  Magic: '#3B82F6',
  Rare: '#16A34A',
  Unique: '#B45309',
  Epic: '#7C3AED',
  Legend: '#F59E0B',
  Star: '#A855F7',
};

/** 既存の武器レア度カラーと揃える */
export const skillTierColors: Record<SkillTier, string> = {
  Rare: '#16A34A',
  Unique: '#B45309',
  Epic: '#7C3AED',
  Legend: '#F59E0B',
  Star: '#A855F7',
};

export const skillElementColors: Record<SkillElement, string> = {
  Light: '#EAB308',
  Dark: '#7C3AED',
  Fire: '#EF4444',
  Water: '#0EA5E9',
};
