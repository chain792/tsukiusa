import type { Locale } from '../../i18n/types';

// レベル名（数値 → ロケール別）
export const levelNames: Record<Locale, Record<number, string>> = {
  ja: {
    4: '下級',
    3: '中級',
    2: '上級',
    1: '最上級',
  },
  en: {
    4: 'Low',
    3: 'Mid',
    2: 'High',
    1: 'Supreme',
  },
};

// ティア名（英語 → ロケール別）
export const tierNames: Record<Locale, Record<string, string>> = {
  ja: {
    Normal: 'ノーマル',
    Magic: 'マジック',
    Rare: 'レア',
    Unique: 'ユニーク',
    Epic: 'エピック',
    Legend: 'レジェンド',
    Star: 'スター',
    Galaxy: 'ギャラクシー',
    Universe: 'ユニバース',
  },
  en: {
    Normal: 'Normal',
    Magic: 'Magic',
    Rare: 'Rare',
    Unique: 'Unique',
    Epic: 'Epic',
    Legend: 'Legend',
    Star: 'Star',
    Galaxy: 'Galaxy',
    Universe: 'Universe',
  },
};

// ティアの順序
export const tierOrder = ['Normal', 'Magic', 'Rare', 'Unique', 'Epic', 'Legend', 'Star', 'Galaxy', 'Universe'] as const;

// レア度カラーパレット
export const rarityColors: Record<string, string> = {
  Normal: '#9CA3AF',
  Magic: '#3B82F6',
  Rare: '#16A34A',
  Unique: '#B45309',
  Epic: '#7C3AED',
  Legend: '#F59E0B',
  Star: '#A855F7',
  Galaxy: '#06B6D4',
  Universe: '#22C55E',
};

// ガチャレベルごとのボーナス獲得（レジェンド最上級）に必要な回数
export const bonusThresholds: Record<number, number> = {
  8: 1200,
  9: 1150,
  10: 1050,
  11: 1000,
  12: 900,
  13: 800,
  14: 700,
};
