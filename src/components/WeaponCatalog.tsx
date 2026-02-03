import { useState } from 'react';
import { allWeapons, rarityColors } from '../data/weapons';
import { requiredL1Map } from '../data/synthesis';

import L4Image from '../assets/L4.png';
import L3Image from '../assets/L3.png';
import L2Image from '../assets/L2.png';
import L1Image from '../assets/L1.png';
import S4Image from '../assets/S4.png';
import S3Image from '../assets/S3.png';
import S2Image from '../assets/S2.png';
import S1Image from '../assets/S1.png';
import G4Image from '../assets/G4.png';
import G3Image from '../assets/G3.png';
import G2Image from '../assets/G2.png';
import G1Image from '../assets/G1.png';
import U4Image from '../assets/U4.png';

const weaponImages: Record<string, ImageMetadata> = {
  L4: L4Image, L3: L3Image, L2: L2Image, L1: L1Image,
  S4: S4Image, S3: S3Image, S2: S2Image, S1: S1Image,
  G4: G4Image, G3: G3Image, G2: G2Image, G1: G1Image,
  U4: U4Image
};

const levelNames: Record<number, string> = {
  4: '下級',
  3: '中級',
  2: '上級',
  1: '最上級'
};

const tierNames: Record<string, string> = {
  Star: 'スター',
  Galaxy: 'ギャラクシー',
  Universe: 'ユニバース'
};

// 基準武器の選択肢
const baseWeaponOptions = [
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
function getRequiredBase(weaponName: string, baseName: string): number {
  const weaponL1 = requiredL1Map[weaponName] || 0;
  const baseL1 = requiredL1Map[baseName] || 1;
  return weaponL1 / baseL1;
}

export default function WeaponCatalog() {
  const [baseWeapon, setBaseWeapon] = useState('L1');

  const starWeapons = allWeapons.filter(w => w.rarity.tier === 'Star');
  const galaxyWeapons = allWeapons.filter(w => w.rarity.tier === 'Galaxy');
  const universeWeapons = allWeapons.filter(w => w.rarity.tier === 'Universe');

  const renderWeaponCard = (weapon: typeof allWeapons[0], hoverColor: string) => {
    const required = getRequiredBase(weapon.name, baseWeapon);
    const tierName = tierNames[weapon.rarity.tier] || weapon.rarity.tier;
    const levelName = 'level' in weapon.rarity ? levelNames[weapon.rarity.level] : '';

    return (
      <div
        key={weapon.name}
        className={`text-center p-4 bg-gray-50 rounded-lg ${hoverColor} transition-colors`}
      >
        <img
          src={weaponImages[weapon.name].src}
          alt={weapon.name}
          className="w-16 h-16 mx-auto mb-2 object-contain"
        />
        <div className="text-sm text-gray-500 mb-2">
          {tierName}{levelName}
        </div>
        <div className="text-lg font-semibold text-gray-800">
          {required % 1 === 0 ? required.toLocaleString() : required.toFixed(2)}本
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* 基準武器選択 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="font-medium text-gray-700">基準武器:</label>
          <select
            value={baseWeapon}
            onChange={(e) => setBaseWeapon(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {baseWeaponOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            ※ 各武器1本は基準武器何本分かを表示
          </span>
        </div>
      </div>

      {/* Star */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div
          className="px-6 py-4 border-b"
          style={{ background: `linear-gradient(135deg, ${rarityColors.Star}20, ${rarityColors.Star}10)` }}
        >
          <h3 className="text-lg font-bold" style={{ color: rarityColors.Star }}>
            Star (スター)
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6">
          {starWeapons.map(weapon => renderWeaponCard(weapon, 'hover:bg-purple-50'))}
        </div>
      </div>

      {/* Galaxy */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div
          className="px-6 py-4 border-b"
          style={{ background: `linear-gradient(135deg, ${rarityColors.Galaxy}20, ${rarityColors.Galaxy}10)` }}
        >
          <h3 className="text-lg font-bold" style={{ color: rarityColors.Galaxy }}>
            Galaxy (ギャラクシー)
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6">
          {galaxyWeapons.map(weapon => renderWeaponCard(weapon, 'hover:bg-cyan-50'))}
        </div>
      </div>

      {/* Universe */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div
          className="px-6 py-4 border-b"
          style={{ background: `linear-gradient(135deg, ${rarityColors.Universe}20, ${rarityColors.Universe}10)` }}
        >
          <h3 className="text-lg font-bold" style={{ color: rarityColors.Universe }}>
            Universe (ユニバース)
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6">
          {universeWeapons.map(weapon => renderWeaponCard(weapon, 'hover:bg-green-50'))}
        </div>
      </div>
    </div>
  );
}
