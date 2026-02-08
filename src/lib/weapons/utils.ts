import { weapons, type WeaponName } from './types';
import { levelNames, tierNames } from './constants';

// 武器の表示名を取得（例: "スター中級"）
export function getWeaponDisplayName(name: WeaponName): string {
  const weapon = weapons[name];
  const tierName = tierNames[weapon.tier] || weapon.tier;
  const levelName = levelNames[weapon.level] || '';
  return `${tierName}${levelName}`;
}

// 武器名からティア名を取得（例: "Legend"）
export function getTier(name: WeaponName): string {
  return weapons[name].tier;
}
