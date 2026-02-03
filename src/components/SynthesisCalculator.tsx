import { useState } from 'react';
import { calculateRequiredBase, calculateSynthesisPath } from '../utils/synthesisCalculator';
import { allWeapons } from '../data/weapons';
import type { WeaponRarity } from '../types';

export default function SynthesisCalculator() {
  const [selectedWeapon, setSelectedWeapon] = useState<string>('U4');
  const [result, setResult] = useState<{ requiredL1: number; path: string[] } | null>(null);

  // 計算を実行
  const handleCalculate = () => {
    const weapon = allWeapons.find(w => w.name === selectedWeapon);
    if (!weapon) return;

    const requiredL1 = calculateRequiredBase(weapon.rarity);
    const path = calculateSynthesisPath(weapon.rarity);

    setResult({ requiredL1, path });
  };

  // 武器選択時に自動計算
  const handleWeaponChange = (name: string) => {
    setSelectedWeapon(name);
    const weapon = allWeapons.find(w => w.name === name);
    if (!weapon) return;

    const requiredL1 = calculateRequiredBase(weapon.rarity);
    const path = calculateSynthesisPath(weapon.rarity);
    setResult({ requiredL1, path });
  };

  // 初期計算
  useState(() => {
    handleCalculate();
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 入力エリア */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">目標武器を選択</h3>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          武器レア度
        </label>
        <select
          value={selectedWeapon}
          onChange={(e) => handleWeaponChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {allWeapons.map((weapon) => (
            <option key={weapon.name} value={weapon.name}>
              {weapon.name} - {weapon.rarity.tier}
            </option>
          ))}
        </select>

        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            選択した武器を1本作成するために必要なL1（Legend Level 1）の本数を計算します。
          </p>
        </div>
      </div>

      {/* 結果表示エリア */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">計算結果</h3>

        {result && (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">必要なL1の本数</p>
              <p className="text-4xl font-bold text-blue-600">
                {result.requiredL1.toLocaleString()}本
              </p>
            </div>

            {result.path.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">合成経路</p>
                <div className="space-y-2">
                  {result.path.map((step, index) => (
                    <div key={index} className="flex items-center">
                      <span className="inline-block w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs flex items-center justify-center mr-2">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700 font-mono">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
