import { weapons, weaponNames, type WeaponName } from './types';
import { rarityColors } from './constants';

// 武器の表示情報
export interface WeaponInfo {
  name: WeaponName;
  tier: string;
  level: number;
  requiredL1: number;
  color: string;
}

// 全武器情報リスト
export const allWeapons: WeaponInfo[] = weaponNames.map(name => {
  const weapon = weapons[name];
  return {
    name,
    tier: weapon.tier,
    level: weapon.level,
    requiredL1: weapon.requiredL1,
    color: rarityColors[weapon.tier],
  };
});

// 武器名から武器情報を取得
export function getWeaponInfo(name: WeaponName): WeaponInfo {
  const weapon = weapons[name];
  return {
    name,
    tier: weapon.tier,
    level: weapon.level,
    requiredL1: weapon.requiredL1,
    color: rarityColors[weapon.tier],
  };
}
