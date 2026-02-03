import { useState, useEffect } from 'react';
import { allWeapons, rarityColors } from '../data/weapons';
import { requiredL1Map } from '../data/synthesis';

const levelNames: Record<number, string> = {
  4: '下級',
  3: '中級',
  2: '上級',
  1: '最上級'
};

const tierNames: Record<string, string> = {
  Legend: 'レジェンド',
  Star: 'スター',
  Galaxy: 'ギャラクシー',
  Universe: 'ユニバース'
};

function getWeaponDisplayName(weapon: typeof allWeapons[0]): string {
  const tierName = tierNames[weapon.rarity.tier] || weapon.rarity.tier;
  const levelName = 'level' in weapon.rarity ? levelNames[weapon.rarity.level] : '';
  return `${tierName}${levelName}`;
}

const weaponOptions = allWeapons.filter(w =>
  w.name !== 'Normal' && w.name !== 'Rare' && w.name !== 'Epic'
);

const groupedWeapons = {
  Legend: weaponOptions.filter(w => w.rarity.tier === 'Legend'),
  Star: weaponOptions.filter(w => w.rarity.tier === 'Star'),
  Galaxy: weaponOptions.filter(w => w.rarity.tier === 'Galaxy'),
  Universe: weaponOptions.filter(w => w.rarity.tier === 'Universe'),
};

export default function GoalCalculator() {
  const [targetWeapon, setTargetWeapon] = useState<string>('U4');
  const [targetCount, setTargetCount] = useState<number>(1);
  const [inventory, setInventory] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    weaponOptions.forEach(w => initial[w.name] = 0);
    return initial;
  });
  const [dailyL1, setDailyL1] = useState<number>(9);

  const [result, setResult] = useState<{
    targetL1: number;
    inventoryL1: number;
    neededL1: number;
    daysNeeded: number;
    monthsNeeded: number;
  } | null>(null);

  useEffect(() => {
    const targetL1Required = (requiredL1Map[targetWeapon] || 0) * targetCount;
    let inventoryL1Total = 0;
    for (const [name, count] of Object.entries(inventory)) {
      const l1Value = requiredL1Map[name] || 0;
      inventoryL1Total += l1Value * count;
    }
    const neededL1 = Math.max(0, targetL1Required - inventoryL1Total);
    const daysNeeded = dailyL1 > 0 ? Math.ceil(neededL1 / dailyL1) : Infinity;
    const monthsNeeded = daysNeeded / 30;

    setResult({ targetL1: targetL1Required, inventoryL1: inventoryL1Total, neededL1, daysNeeded, monthsNeeded });
  }, [targetWeapon, targetCount, inventory, dailyL1]);

  const updateInventory = (name: string, count: number) => {
    setInventory(prev => ({ ...prev, [name]: Math.max(0, count) }));
  };

  const targetWeaponData = allWeapons.find(w => w.name === targetWeapon);
  const progressPercent = result && result.targetL1 > 0
    ? Math.min(100, Math.round((result.inventoryL1 / result.targetL1) * 100))
    : 0;

  return (
    <div className="space-y-4">
      {/* 上部: 目標設定 + 手持ち武器 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 左: 目標設定 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">目標設定</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">目標武器</label>
              <select
                value={targetWeapon}
                onChange={(e) => setTargetWeapon(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {weaponOptions.map((weapon) => (
                  <option key={weapon.name} value={weapon.name}>
                    {getWeaponDisplayName(weapon)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">目標本数</label>
              <input
                type="number"
                value={targetCount}
                onChange={(e) => setTargetCount(Math.max(1, Number(e.target.value)))}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">1日の獲得ペース（レジェンド最上級換算）</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={dailyL1}
                  onChange={(e) => setDailyL1(Math.max(0, Number(e.target.value)))}
                  min="0"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <span className="text-sm text-gray-500">本/日</span>
              </div>
            </div>
          </div>
        </div>

        {/* 右: 手持ち武器 */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">手持ち武器（任意）</h3>
            <span className="text-xs text-gray-500">合成素材として使える本数</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {Object.entries(groupedWeapons).map(([tier, weapons]) => (
              <div key={tier} className="border rounded-md p-2">
                <div
                  className="text-xs font-medium mb-1.5 px-1"
                  style={{ color: rarityColors[tier] }}
                >
                  {tierNames[tier]}
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {weapons.map((weapon) => (
                    <div key={weapon.name} className="text-center">
                      <div className="text-[10px] text-gray-500 mb-0.5 truncate">
                        {'level' in weapon.rarity ? levelNames[weapon.rarity.level] : ''}
                      </div>
                      <input
                        type="number"
                        value={inventory[weapon.name] || 0}
                        onChange={(e) => updateInventory(weapon.name, Number(e.target.value))}
                        min="0"
                        className="w-full px-1 py-1 border border-gray-200 rounded text-xs text-center focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 下部: 計算結果 */}
      {result && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h3 className="text-sm font-semibold text-gray-700">計算結果</h3>
          </div>

          <div className="p-4">
            {/* メイン結果 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-blue-600 mb-1">必要数</div>
                <div className="text-xl font-bold text-blue-700">
                  {result.targetL1.toLocaleString()}
                  <span className="text-sm font-normal ml-1">本</span>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-xs text-green-600 mb-1">手持ち合計</div>
                <div className="text-xl font-bold text-green-700">
                  {result.inventoryL1.toLocaleString()}
                  <span className="text-sm font-normal ml-1">本</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-xs text-orange-600 mb-1">不足分</div>
                <div className="text-xl font-bold text-orange-700">
                  {result.neededL1.toLocaleString()}
                  <span className="text-sm font-normal ml-1">本</span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-xs text-purple-600 mb-1">必要日数</div>
                <div className="text-xl font-bold text-purple-700">
                  {result.neededL1 === 0 ? (
                    '達成済み'
                  ) : result.daysNeeded === Infinity ? (
                    '—'
                  ) : (
                    <>
                      {result.daysNeeded.toLocaleString()}
                      <span className="text-sm font-normal ml-1">日</span>
                      <span className="text-xs font-normal text-purple-500 ml-1">
                        ({result.monthsNeeded.toFixed(1)}ヶ月)
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 進捗バー */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">進捗状況</span>
                <span className="text-sm font-medium text-gray-700">{progressPercent}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progressPercent}%`,
                    background: progressPercent === 100
                      ? '#22c55e'
                      : 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
                  }}
                />
              </div>
              {result.neededL1 > 0 && result.daysNeeded !== Infinity && (
                <div className="mt-2 text-sm text-gray-600">
                  達成予定日:
                  <span className="font-medium text-gray-800 ml-1">
                    {new Date(Date.now() + result.daysNeeded * 24 * 60 * 60 * 1000).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
