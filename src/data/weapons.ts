import type { WeaponInfo, WeaponRarity } from '../types';
import { getRequiredL1 } from './synthesis';
import { rarityColors } from '../lib/weapons/constants';

// 全ての武器レア度リスト（内部使用）
const allWeaponRarities: WeaponRarity[] = [
  // Legend
  { tier: 'Legend', level: 4 },
  { tier: 'Legend', level: 3 },
  { tier: 'Legend', level: 2 },
  { tier: 'Legend', level: 1 },
  // Star
  { tier: 'Star', level: 4 },
  { tier: 'Star', level: 3 },
  { tier: 'Star', level: 2 },
  { tier: 'Star', level: 1 },
  // Galaxy
  { tier: 'Galaxy', level: 4 },
  { tier: 'Galaxy', level: 3 },
  { tier: 'Galaxy', level: 2 },
  { tier: 'Galaxy', level: 1 },
  // Universe
  { tier: 'Universe', level: 4 }
];

// 武器情報を生成（内部使用）
function getWeaponInfo(rarity: WeaponRarity): WeaponInfo {
  const name = 'level' in rarity ? `${rarity.tier.charAt(0)}${rarity.level}` : rarity.tier;
  const color = rarityColors[rarity.tier];
  const requiredL1 = getRequiredL1(rarity);

  return {
    rarity,
    name,
    requiredL1,
    color
  };
}

// 全武器情報リスト
export const allWeapons: WeaponInfo[] = allWeaponRarities.map(getWeaponInfo);

// 武器名からWeaponRarityを取得
export function parseWeaponName(name: string): WeaponRarity | null {
  // Legend
  if (name === 'L4') return { tier: 'Legend', level: 4 };
  if (name === 'L3') return { tier: 'Legend', level: 3 };
  if (name === 'L2') return { tier: 'Legend', level: 2 };
  if (name === 'L1') return { tier: 'Legend', level: 1 };

  // Star
  if (name === 'S4') return { tier: 'Star', level: 4 };
  if (name === 'S3') return { tier: 'Star', level: 3 };
  if (name === 'S2') return { tier: 'Star', level: 2 };
  if (name === 'S1') return { tier: 'Star', level: 1 };

  // Galaxy
  if (name === 'G4') return { tier: 'Galaxy', level: 4 };
  if (name === 'G3') return { tier: 'Galaxy', level: 3 };
  if (name === 'G2') return { tier: 'Galaxy', level: 2 };
  if (name === 'G1') return { tier: 'Galaxy', level: 1 };

  // Universe
  if (name === 'U4') return { tier: 'Universe', level: 4 };

  // Normal/Rare/Epic
  if (name === 'Normal') return { tier: 'Normal' };
  if (name === 'Rare') return { tier: 'Rare' };
  if (name === 'Epic') return { tier: 'Epic' };

  return null;
}
