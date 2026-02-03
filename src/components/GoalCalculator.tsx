import { useState, useEffect } from 'react';
import { allWeapons, rarityColors } from '../data/weapons';
import { requiredL1Map, getRarityShorthand } from '../data/synthesis';
import type { WeaponRarity } from '../types';

interface InventoryItem {
  name: string;
  count: number;
  l1Value: number;
}

const weaponOptions = allWeapons.filter(w =>
  w.name !== 'Normal' && w.name !== 'Rare' && w.name !== 'Epic'
);

export default function GoalCalculator() {
  // 目標武器
  const [targetWeapon, setTargetWeapon] = useState<string>('U4');
  const [targetCount, setTargetCount] = useState<number>(1);

  // 手持ち武器（各レア度ごと）
  const [inventory, setInventory] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    weaponOptions.forEach(w => initial[w.name] = 0);
    return initial;
  });

  // 1日のドラバス（L1）獲得数
  const [dailyL1, setDailyL1] = useState<number>(9);

  // 計算結果
  const [result, setResult] = useState<{
    targetL1: number;
    inventoryL1: number;
    neededL1: number;
    daysNeeded: number;
  } | null>(null);

  // 計算を実行
  useEffect(() => {
    // 目標に必要なL1
    const targetL1Required = (requiredL1Map[targetWeapon] || 0) * targetCount;

    // 手持ち武器のL1換算合計
    let inventoryL1Total = 0;
    for (const [name, count] of Object.entries(inventory)) {
      const l1Value = requiredL1Map[name] || 0;
      inventoryL1Total += l1Value * count;
    }

    // 不足分
    const neededL1 = Math.max(0, targetL1Required - inventoryL1Total);

    // 必要日数
    const daysNeeded = dailyL1 > 0 ? Math.ceil(neededL1 / dailyL1) : Infinity;

    setResult({
      targetL1: targetL1Required,
      inventoryL1: inventoryL1Total,
      neededL1,
      daysNeeded
    });
  }, [targetWeapon, targetCount, inventory, dailyL1]);

  // 手持ち武器の更新
  const updateInventory = (name: string, count: number) => {
    setInventory(prev => ({ ...prev, [name]: Math.max(0, count) }));
  };

  return (
    <div className="space-y-6">
      {/* 目標設定 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm mr-3">1</span>
          目標を設定
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              目標武器
            </label>
            <select
              value={targetWeapon}
              onChange={(e) => setTargetWeapon(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
            >
              {weaponOptions.map((weapon) => (
                <option key={weapon.name} value={weapon.name}>
                  {weapon.name} ({weapon.rarity.tier})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              目標本数
            </label>
            <input
              type="number"
              value={targetCount}
              onChange={(e) => setTargetCount(Math.max(1, Number(e.target.value)))}
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
        </div>

        {/* 目標の視覚化 */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">目標</p>
              <p className="text-2xl font-bold" style={{ color: rarityColors[allWeapons.find(w => w.name === targetWeapon)?.rarity.tier || 'Legend'] }}>
                {targetWeapon} × {targetCount}本
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">必要ドラバス（L1）</p>
              <p className="text-3xl font-bold text-blue-600">
                {result?.targetL1.toLocaleString()}本
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 手持ち武器入力 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm mr-3">2</span>
          手持ち武器を入力
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          合成に使える手持ちの武器数を入力してください（任意）
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {weaponOptions.map((weapon) => (
            <div key={weapon.name} className="relative">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: weapon.color }}
                />
                {weapon.name}
              </label>
              <input
                type="number"
                value={inventory[weapon.name] || 0}
                onChange={(e) => updateInventory(weapon.name, Number(e.target.value))}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          ))}
        </div>

        {/* 手持ちの合計 */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">手持ち合計（L1換算）</p>
            <p className="text-2xl font-bold text-green-600">
              {result?.inventoryL1.toLocaleString()}本
            </p>
          </div>
        </div>
      </div>

      {/* 日数設定 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm mr-3">3</span>
          1日の獲得ペース
        </h3>

        <div className="max-w-xs">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            1日に獲得できるドラバス（L1）
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={dailyL1}
              onChange={(e) => setDailyL1(Math.max(0, Number(e.target.value)))}
              min="0"
              className="w-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <span className="text-gray-600">本/日</span>
          </div>
        </div>
      </div>

      {/* 結果表示 */}
      {result && (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-6 opacity-90">計算結果</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 不足分 */}
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm opacity-80 mb-1">不足ドラバス</p>
              <p className="text-4xl font-bold">
                {result.neededL1.toLocaleString()}
                <span className="text-lg ml-1">本</span>
              </p>
            </div>

            {/* 必要日数 */}
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm opacity-80 mb-1">必要日数</p>
              <p className="text-4xl font-bold">
                {result.daysNeeded === Infinity ? '∞' : result.neededL1 === 0 ? '0' : result.daysNeeded.toLocaleString()}
                <span className="text-lg ml-1">日</span>
              </p>
            </div>

            {/* 達成予定日 */}
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm opacity-80 mb-1">達成予定日</p>
              <p className="text-2xl font-bold">
                {result.neededL1 === 0 ? '達成済み！' :
                  result.daysNeeded === Infinity ? '—' :
                  new Date(Date.now() + result.daysNeeded * 24 * 60 * 60 * 1000).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                }
              </p>
            </div>
          </div>

          {/* 進捗バー */}
          {result.targetL1 > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2 opacity-80">
                <span>進捗</span>
                <span>{Math.min(100, Math.round((result.inventoryL1 / result.targetL1) * 100))}%</span>
              </div>
              <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (result.inventoryL1 / result.targetL1) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
