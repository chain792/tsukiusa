import { useState, useMemo } from 'react';
import {
  weaponImages,
  allWeapons,
  requiredL1Map,
  rarityColors,
  tierNames,
  tierOrder,
  getWeaponDisplayName,
} from '../lib/weapons';

const weaponOptions = allWeapons.filter(w =>
  w.name !== 'Normal' && w.name !== 'Rare' && w.name !== 'Epic'
);

// 目標用の選択肢（レジェンド最上級以上のみ）
const targetWeaponOptions = weaponOptions.filter(w =>
  !(w.rarity.tier === 'Legend' && ('level' in w.rarity && w.rarity.level > 1))
);

// インベントリ用のグルーピング
const groupedWeapons = {
  Legend: weaponOptions.filter(w => w.rarity.tier === 'Legend' && w.name in weaponImages),
  Star: weaponOptions.filter(w => w.rarity.tier === 'Star' && w.name in weaponImages),
  Galaxy: weaponOptions.filter(w => w.rarity.tier === 'Galaxy' && w.name in weaponImages),
  Universe: weaponOptions.filter(w => w.rarity.tier === 'Universe' && w.name in weaponImages),
};

const SummaryCard = ({
  title,
  value,
  subValue,
  highlight = false,
  colorClass = 'text-gray-800'
}: {
  title: string,
  value: string,
  subValue?: string,
  highlight?: boolean,
  colorClass?: string
}) => (
  <div className={`bg-white rounded-xl shadow-sm border p-3 md:p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow ${highlight ? 'border-blue-200 bg-blue-50' : 'border-gray-100'}`}>
    <div className="text-gray-500 text-xs md:text-sm font-medium mb-1">{title}</div>
    <div className={`text-lg md:text-2xl font-bold ${colorClass} break-all`}>{value}</div>
    {subValue && <div className="text-[10px] md:text-xs text-gray-500 mt-1">{subValue}</div>}
  </div>
);

export default function GoalCalculator() {
  const [targetWeapon, setTargetWeapon] = useState<string>('U4');
  const [targetCount, setTargetCount] = useState<number>(1);
  const [inventory, setInventory] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    weaponOptions.forEach(w => initial[w.name] = 0);
    return initial;
  });
  const [dailyL1, setDailyL1] = useState<number>(9);

  // 折りたたみ状態管理 (初期値は全て閉じている: false)
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({
    Legend: false,
    Star: false,
    Galaxy: false,
    Universe: false
  });

  const toggleTier = (tier: string) => {
    setExpandedTiers(prev => ({
      ...prev,
      [tier]: !prev[tier]
    }));
  };

  const result = useMemo(() => {
    const targetL1Required = (requiredL1Map[targetWeapon] || 0) * targetCount;
    let inventoryL1Total = 0;
    for (const [name, count] of Object.entries(inventory)) {
      const l1Value = requiredL1Map[name] || 0;
      inventoryL1Total += l1Value * count;
    }
    const neededL1 = Math.max(0, targetL1Required - inventoryL1Total);
    const daysNeeded = dailyL1 > 0 ? Math.ceil(neededL1 / dailyL1) : Infinity;
    const monthsNeeded = daysNeeded / 30;

    return { targetL1: targetL1Required, inventoryL1: inventoryL1Total, neededL1, daysNeeded, monthsNeeded };
  }, [targetWeapon, targetCount, inventory, dailyL1]);

  const updateInventory = (name: string, count: number) => {
    setInventory(prev => ({ ...prev, [name]: Math.max(0, count) }));
  };

  const targetWeaponObject = allWeapons.find(w => w.name === targetWeapon);
  const targetImage = weaponImages[targetWeapon];
  const progressPercent = result && result.targetL1 > 0
    ? Math.min(100, Math.round((result.inventoryL1 / result.targetL1) * 100))
    : 0;

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto">

      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {/* 目標設定エリア */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1 h-5 md:h-6 bg-green-600 rounded-full"></span>
              目標設定
            </h2>
          </div>

          <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
            {/* 左側: ゴール入力フォーム */}
            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">目標の武器</label>
                <select
                  value={targetWeapon}
                  onChange={(e) => setTargetWeapon(e.target.value)}
                  className="w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-base"
                >
                  {targetWeaponOptions.map((weapon) => (
                    <option key={weapon.name} value={weapon.name}>
                      {getWeaponDisplayName(weapon)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">目標本数</label>
                <div className="relative">
                  <input
                    type="number"
                    value={targetCount}
                    onChange={(e) => setTargetCount(Math.max(1, Number(e.target.value)))}
                    min="1"
                    className="w-full pl-3 pr-8 py-2 md:pl-4 md:pr-10 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-base md:text-lg font-mono"
                  />
                  <span className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-xs md:text-base">本</span>
                </div>
              </div>
            </div>

            {/* 右側: ターゲットプレビュー */}
            <div className="flex flex-col items-center justify-center p-4 md:p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200 h-full min-h-[160px] md:min-h-[200px]">
              {targetWeaponObject && targetImage && (
                <>
                  <div className="relative mb-3 md:mb-4">
                    <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-60"></div>
                    <img
                      src={targetImage.src}
                      alt={getWeaponDisplayName(targetWeaponObject)}
                      className="w-20 h-20 md:w-24 md:h-24 object-contain relative z-10 drop-shadow-md"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Target Weapon</div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                      {getWeaponDisplayName(targetWeaponObject)}
                    </h3>
                    <div className="inline-flex items-center px-3 py-1 bg-white border border-gray-200 rounded-full text-xs md:text-sm font-semibold text-gray-600">
                      × {targetCount.toLocaleString()} 本
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 達成予測設定エリア */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1 h-5 md:h-6 bg-purple-500 rounded-full"></span>
              達成予測のための設定
            </h2>
          </div>
          <div className="p-4 md:p-6 bg-purple-50/30">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1">
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">
                  1日の獲得数（レジェンド最上級換算）
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={dailyL1}
                    onChange={(e) => setDailyL1(Math.max(0, Number(e.target.value)))}
                    min="0"
                    className="w-full pl-3 pr-8 py-2 md:pl-4 md:pr-10 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-base md:text-lg font-mono"
                  />
                  <span className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-xs md:text-base">本</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 md:mb-3 md:flex-1">
                ※ 放置狩りや武器倉庫、武器ガチャ等で1日に獲得できる「レジェンド最上級」の本数を入力してください。
                これをもとに達成予定日を算出します。
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 手持ち武器入力エリア */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 md:h-6 bg-blue-600 rounded-full"></span>
            現在の所持武器
          </h2>
          <span className="text-[10px] md:text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
            タップして開閉
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {tierOrder.map((tier) => (
            <div key={tier} className="bg-white">
              <button
                onClick={() => toggleTier(tier)}
                className="w-full flex items-center justify-between px-4 py-3 md:px-6 md:py-4 hover:bg-gray-50 transition-colors"
                style={{ backgroundColor: expandedTiers[tier] ? 'rgba(249, 250, 251, 0.5)' : undefined }}
              >
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                  <h4 className="font-bold text-gray-700 text-sm md:text-base" style={{ color: rarityColors[tier] }}>
                    {tierNames[tier]} Tier
                  </h4>
                  {/* 入力済みアイテムがある場合バッジを表示 */}
                  {(() => {
                    const count = (groupedWeapons as any)[tier].reduce((acc: number, w: any) => acc + (inventory[w.name] || 0), 0);
                    return count > 0 ? (
                      <span className="text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {count}本 入力中
                      </span>
                    ) : null;
                  })()}
                </div>
                <span className={`text-gray-400 transform transition-transform duration-200 ${expandedTiers[tier] ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {expandedTiers[tier] && (
                <div className="px-4 pb-4 pt-2 md:px-6 md:pb-6 animate-fadeIn">
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {(groupedWeapons as any)[tier].map((weapon: any) => (
                      <div key={weapon.name} className="flex items-center p-2.5 md:p-3 bg-gray-50 rounded-xl border border-gray-100 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                        <img
                          src={weaponImages[weapon.name].src}
                          alt={weapon.name}
                          className="w-10 h-10 md:w-12 md:h-12 object-contain mr-2 md:mr-3"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] md:text-xs text-gray-500 mb-1 truncate">{getWeaponDisplayName(weapon)}</div>
                          <input
                            type="number"
                            value={inventory[weapon.name] || 0}
                            onChange={(e) => updateInventory(weapon.name, Number(e.target.value))}
                            min="0"
                            placeholder="0"
                            className="w-full px-2 py-1 md:py-1.5 border border-gray-200 rounded-md text-sm font-mono focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 計算結果エリア */}
      {result && (
        <div className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <SummaryCard
              title="必要総数"
              value={`${result.targetL1.toLocaleString()}`}
              subValue="レジェンド最上級換算"
              colorClass="text-blue-700"
              highlight={true}
            />
            <SummaryCard
              title="所持数"
              value={`${result.inventoryL1.toLocaleString()}`}
              subValue="レジェンド最上級換算"
              colorClass="text-green-600"
            />
            <SummaryCard
              title="不足数"
              value={`${result.neededL1.toLocaleString()}`}
              subValue="レジェンド最上級換算"
              colorClass="text-orange-600"
            />
            <SummaryCard
              title="達成予定"
              value={result.daysNeeded === Infinity ? '未定' : result.neededL1 === 0 ? '達成' : `${result.daysNeeded.toLocaleString()}日`}
              subValue={result.daysNeeded !== Infinity && result.neededL1 > 0 ? `約 ${(result.daysNeeded / 30).toFixed(1)}ヶ月` : undefined}
              colorClass="text-purple-600"
            />
          </div>

          {/* 進捗詳細 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800 text-sm md:text-base">目標達成状況</h3>
              <span className="text-xl md:text-2xl font-black text-blue-600">{progressPercent}%</span>
            </div>

            <div className="h-3 md:h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
                }}
              >
                <div className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 translate-x-full animate-shimmer"></div>
              </div>
            </div>

            {result.neededL1 > 0 && result.daysNeeded !== Infinity ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm bg-blue-50/50 p-3 md:p-4 rounded-xl border border-blue-100">
                <div className="text-gray-600 mb-2 sm:mb-0 text-xs md:text-sm">
                  現在のペース（<span className="font-bold text-gray-800">{dailyL1}本/日</span>）で継続した場合の達成予定日
                </div>
                <div className="text-base md:text-lg font-bold text-blue-800 text-right sm:text-left">
                  {new Date(Date.now() + result.daysNeeded * 24 * 60 * 60 * 1000).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'short'
                  })}
                </div>
              </div>
            ) : result.neededL1 === 0 ? (
              <div className="text-center py-3 md:py-4 bg-green-50 rounded-xl border border-green-200 text-green-700 font-bold text-sm md:text-base">
                🎉 目標を達成しています！
              </div>
            ) : (
              <div className="text-center py-3 md:py-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-500 text-xs md:text-sm">
                1日の獲得ペースを入力すると達成予定日が計算されます
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
