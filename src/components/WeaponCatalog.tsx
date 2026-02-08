import { useState } from 'react';
import {
  weaponImages,
  allWeapons,
  weapons,
  rarityColors,
  getWeaponDisplayName,
  type WeaponName,
} from '../lib/weapons';

// 基準武器の選択肢
const baseWeaponOptions: { value: WeaponName; label: string }[] = [
  { value: 'L1', label: 'レジェンド最上級' },
  { value: 'S4', label: 'スター下級' },
  { value: 'S3', label: 'スター中級' },
  { value: 'S2', label: 'スター上級' },
  { value: 'S1', label: 'スター最上級' },
  { value: 'G4', label: 'ギャラクシー下級' },
  { value: 'G3', label: 'ギャラクシー中級' },
  { value: 'G2', label: 'ギャラクシー上級' },
  { value: 'G1', label: 'ギャラクシー最上級' },
  { value: 'U4', label: 'ユニバース下級' },
];

// 基準武器に対する換算値を計算
function getRequiredBase(weaponName: WeaponName, baseName: WeaponName): number {
  const weaponL1 = weapons[weaponName].requiredL1;
  const baseL1 = weapons[baseName].requiredL1;
  return weaponL1 / baseL1;
}

export default function WeaponCatalog() {
  const [baseWeapon, setBaseWeapon] = useState<WeaponName>('L1');

  const starWeapons = allWeapons.filter(w => w.tier === 'Star');
  const galaxyWeapons = allWeapons.filter(w => w.tier === 'Galaxy');
  const universeWeapons = allWeapons.filter(w => w.tier === 'Universe');

  const renderWeaponCard = (weapon: typeof allWeapons[0]) => {
    const required = getRequiredBase(weapon.name, baseWeapon);
    const displayName = getWeaponDisplayName(weapon.name);
    const color = rarityColors[weapon.tier] || '#666';

    return (
      <div
        key={weapon.name}
        className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-3 md:p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-blue-200"
        style={{ borderColor: `${color}30` }}
      >
        <div
          className="absolute top-0 left-0 w-full h-1"
          style={{ backgroundColor: color }}
        />

        <img
          src={weaponImages[weapon.name].src}
          alt={weapon.name}
          className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 object-contain drop-shadow-sm"
        />
        <div className="text-xs md:text-sm font-bold text-gray-700 mb-1">
          {displayName}
        </div>
        <div className="text-base md:text-lg font-extrabold text-gray-800">
          {required % 1 === 0 ? required.toLocaleString() : required.toFixed(2)}
          <span className="text-[10px] md:text-xs font-normal text-gray-400 ml-1">本</span>
        </div>
      </div>
    );
  };

  const weaponSections = [
    { tier: 'Star' as const, title: 'Star (スター)', weapons: starWeapons },
    { tier: 'Galaxy' as const, title: 'Galaxy (ギャラクシー)', weapons: galaxyWeapons },
    { tier: 'Universe' as const, title: 'Universe (ユニバース)', weapons: universeWeapons },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 基準武器選択 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 md:px-6 md:py-4 flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <label className="font-bold text-gray-700 whitespace-nowrap text-sm md:text-base">基準武器:</label>
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
          ※ 各武器1本を作るのに、基準武器が何本必要かを表示します
        </div>
      </div>

      {/* 武器セクション */}
      {weaponSections.map(({ tier, title, weapons: sectionWeapons }) => (
        <div key={tier} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <div
            className="px-4 py-2 md:px-6 md:py-3 border-b flex items-center gap-2"
            style={{
              background: `linear-gradient(90deg, ${rarityColors[tier]}15, #ffffff)`,
              borderLeft: `4px solid ${rarityColors[tier]}`
            }}
          >
            <h3 className="text-base md:text-lg font-bold" style={{ color: rarityColors[tier] }}>{title}</h3>
          </div>
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {sectionWeapons.map(weapon => renderWeaponCard(weapon))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
