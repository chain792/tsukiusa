import { weapons, type WeaponName } from './types';
import { levelNames, tierNames } from './constants';
import type { Locale } from '../../i18n/types';

// 武器の表示名を取得（例: "スター中級" / "Star Mid"）
export function getWeaponDisplayName(name: WeaponName, locale: Locale = 'ja'): string {
  const weapon = weapons[name];
  const tierName = tierNames[locale][weapon.tier] || weapon.tier;
  const levelName = levelNames[locale][weapon.level] || '';
  if (locale === 'en') return `${tierName} ${levelName}`;
  return `${tierName}${levelName}`;
}

// 武器名からティア名を取得（例: "Legend"）
export function getTier(name: WeaponName): string {
  return weapons[name].tier;
}
