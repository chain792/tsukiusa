import type { WeaponInfo } from '../../types';
import { levelNames, tierNames } from './constants';

// 武器の表示名を取得（例: "スター中級"）
export function getWeaponDisplayName(weapon: WeaponInfo): string {
  const tierName = tierNames[weapon.rarity.tier] || weapon.rarity.tier;
  const levelName = 'level' in weapon.rarity ? levelNames[weapon.rarity.level] : '';
  return `${tierName}${levelName}`;
}

// 武器名（"L4", "S3"等）から表示名を取得
export function getWeaponDisplayNameFromCode(name: string): string {
  const tier = name.charAt(0);
  const level = parseInt(name.charAt(1));
  const tierMap: Record<string, string> = {
    L: 'レジェンド',
    S: 'スター',
    G: 'ギャラクシー',
    U: 'ユニバース',
  };
  return `${tierMap[tier] || tier}${levelNames[level] || ''}`;
}

// 武器名（"L4", "S3"等）からティア名を取得（例: "Legend"）
export function getTierFromCode(name: string): string {
  const tier = name.charAt(0);
  const tierMap: Record<string, string> = {
    L: 'Legend',
    S: 'Star',
    G: 'Galaxy',
    U: 'Universe',
  };
  return tierMap[tier] || 'Legend';
}
