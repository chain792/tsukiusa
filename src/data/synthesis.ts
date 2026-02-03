import type { SynthesisRule, WeaponRarity } from '../types';

// 合成ルール定義
export const synthesisRules: SynthesisRule[] = [
  // Legend tier
  {
    input: { rarity: { tier: 'Legend', level: 4 }, count: 5 },
    output: { tier: 'Legend', level: 3 }
  },
  {
    input: { rarity: { tier: 'Legend', level: 3 }, count: 5 },
    output: { tier: 'Legend', level: 2 }
  },
  {
    input: { rarity: { tier: 'Legend', level: 2 }, count: 5 },
    output: { tier: 'Legend', level: 1 }
  },

  // Legend to Star
  {
    input: { rarity: { tier: 'Legend', level: 1 }, count: 3 },
    output: { tier: 'Star', level: 4 }
  },

  // Star tier
  {
    input: { rarity: { tier: 'Star', level: 4 }, count: 3 },
    output: { tier: 'Star', level: 3 }
  },
  {
    input: { rarity: { tier: 'Star', level: 3 }, count: 3 },
    output: { tier: 'Star', level: 2 }
  },
  {
    input: { rarity: { tier: 'Star', level: 2 }, count: 2 },
    output: { tier: 'Star', level: 1 }
  },

  // Star to Galaxy
  {
    input: { rarity: { tier: 'Star', level: 1 }, count: 2 },
    output: { tier: 'Galaxy', level: 4 }
  },

  // Galaxy tier
  {
    input: { rarity: { tier: 'Galaxy', level: 4 }, count: 2 },
    output: { tier: 'Galaxy', level: 3 }
  },
  {
    input: { rarity: { tier: 'Galaxy', level: 3 }, count: 2 },
    output: { tier: 'Galaxy', level: 2 }
  },
  {
    input: { rarity: { tier: 'Galaxy', level: 2 }, count: 2 },
    output: { tier: 'Galaxy', level: 1 }
  },

  // Galaxy to Universe
  {
    input: { rarity: { tier: 'Galaxy', level: 1 }, count: 2 },
    output: { tier: 'Universe', level: 4 }
  }
];

// レア度が等しいかチェックする関数
export function rarityEquals(a: WeaponRarity, b: WeaponRarity): boolean {
  if (a.tier !== b.tier) return false;

  if ('level' in a && 'level' in b) {
    return a.level === b.level;
  }

  return true;
}

// 合成ルールを検索する関数
export function findSynthesisRule(input: WeaponRarity): SynthesisRule | undefined {
  return synthesisRules.find(rule => rarityEquals(rule.input.rarity, input));
}

// 必要素材数の逆算マップ（L1基準）
export const requiredL1Map: Record<string, number> = {
  // Legend
  'L4': 125,   // 5^3 = 125
  'L3': 25,    // 5^2 = 25
  'L2': 5,     // 5^1 = 5
  'L1': 1,     // 基準

  // Star
  'S4': 3,     // 3 × L1
  'S3': 9,     // 3 × 3
  'S2': 27,    // 3 × 3 × 3
  'S1': 54,    // 3 × 3 × 3 × 2

  // Galaxy
  'G4': 108,   // 54 × 2
  'G3': 216,   // 108 × 2
  'G2': 432,   // 216 × 2
  'G1': 864,   // 432 × 2

  // Universe
  'U4': 1728   // 864 × 2
};

// レア度から略称を取得
export function getRarityShorthand(rarity: WeaponRarity): string {
  if (rarity.tier === 'Normal' || rarity.tier === 'Rare' || rarity.tier === 'Epic') {
    return rarity.tier;
  }

  return `${rarity.tier.charAt(0)}${rarity.level}`;
}

// レア度から必要L1数を取得
export function getRequiredL1(rarity: WeaponRarity): number {
  const shorthand = getRarityShorthand(rarity);
  return requiredL1Map[shorthand] || 0;
}
