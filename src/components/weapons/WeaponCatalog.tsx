/**
 * 武器図鑑
 *
 * 各武器の必要合成数を一覧表示する。
 * - 基準武器を選択して換算値を変更可能
 * - ティア別（Star/Galaxy/Universe）にグループ化して表示
 */
import { useState } from 'react';
import {
  allWeapons,
  weapons,
  rarityColors,
  type WeaponName,
  type Locale,
} from '../../lib/weapons';
import { getTranslations } from '../../i18n';
import { getWeaponDisplayName } from '../../lib/weapons';
import { WeaponCard } from '../ui';

/**
 * 基準武器に対する換算値を計算
 * 例: 基準がL1で対象がS1の場合、S1を1本作るのに必要なL1の本数を返す
 */
function getRequiredBase(weaponName: WeaponName, baseName: WeaponName): number {
  const weaponL1 = weapons[weaponName].requiredL1;
  const baseL1 = weapons[baseName].requiredL1;
  return weaponL1 / baseL1;
}

// 基準武器の選択肢定義（value のみ、ラベルはロケールから生成）
const baseWeaponValues: WeaponName[] = ['L1', 'S4', 'S3', 'S2', 'S1', 'G4', 'G3', 'G2', 'G1', 'U4'];

export default function WeaponCatalog({ locale = 'ja' }: { locale?: Locale }) {
  const t = getTranslations(locale);
  const [baseWeapon, setBaseWeapon] = useState<WeaponName>('L1');

  const baseWeaponOptions = baseWeaponValues.map(value => ({
    value,
    label: getWeaponDisplayName(value, locale),
  }));

  // ティア別に武器をグループ化
  const weaponSections = [
    { tier: 'Star' as const, weapons: allWeapons.filter(w => w.tier === 'Star') },
    { tier: 'Galaxy' as const, weapons: allWeapons.filter(w => w.tier === 'Galaxy') },
    { tier: 'Universe' as const, weapons: allWeapons.filter(w => w.tier === 'Universe') },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ===== 基準武器選択 ===== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 md:px-6 md:py-4 flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <label className="font-bold text-gray-700 whitespace-nowrap text-sm md:text-base">{t.catalog.baseWeapon}</label>
          <div className="relative w-full sm:w-auto">
            <select
              value={baseWeapon}
              onChange={(e) => setBaseWeapon(e.target.value as WeaponName)}
              className="appearance-none w-full sm:w-auto px-4 py-1.5 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none font-medium bg-white text-sm"
            >
              {baseWeaponOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="text-[10px] md:text-xs text-gray-500">
          {t.catalog.baseWeaponNote}
        </div>
      </div>

      {/* ===== ティア別武器一覧 ===== */}
      {weaponSections.map(({ tier, weapons: sectionWeapons }) => (
        <div key={tier} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          {/* ティアヘッダー */}
          <div
            className="px-4 py-2 md:px-6 md:py-3 border-b flex items-center gap-2"
            style={{
              background: `linear-gradient(90deg, ${rarityColors[tier]}15, #ffffff)`,
              borderLeft: `4px solid ${rarityColors[tier]}`
            }}
          >
            <h3 className="text-base md:text-lg font-bold" style={{ color: rarityColors[tier] }}>{tier}</h3>
          </div>

          {/* 武器カードグリッド */}
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {sectionWeapons.map(weapon => (
                <WeaponCard
                  key={weapon.name}
                  name={weapon.name}
                  count={getRequiredBase(weapon.name, baseWeapon)}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
