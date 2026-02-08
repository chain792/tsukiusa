/**
 * 武器目標計算機
 *
 * 目標の武器を作成するために必要な素材と達成予定日を計算する。
 * - 目標武器と本数の設定
 * - 現在の所持武器の入力
 * - レジェンド最上級換算での必要数計算
 * - 1日の獲得ペースから達成予定日を算出
 */
import { useState, useMemo } from 'react';
import {
  weaponImages,
  allWeapons,
  weapons,
  rarityColors,
  tierNames,
  tierOrder,
  getWeaponDisplayName,
  isWeaponName,
  type WeaponName,
} from '../../lib/weapons';
import { SummaryCard } from '../ui';

// 目標武器の選択肢（レジェンド最上級以上のみ）
const targetWeaponOptions = allWeapons.filter(w =>
  !(w.tier === 'Legend' && w.level > 1)
);

// 所持武器入力用のティア別グループ
const groupedWeapons: Record<string, typeof allWeapons> = {
  Legend: allWeapons.filter(w => w.tier === 'Legend'),
  Star: allWeapons.filter(w => w.tier === 'Star'),
  Galaxy: allWeapons.filter(w => w.tier === 'Galaxy'),
  Universe: allWeapons.filter(w => w.tier === 'Universe'),
};

export default function GoalCalculator() {
  // 目標設定（空入力を許可するため number | '' 型）
  const [targetWeapon, setTargetWeapon] = useState<WeaponName>('U4');
  const [targetCount, setTargetCount] = useState<number | ''>(1);

  // 所持武器（空入力を許可、初期値は空文字）
  const [inventory, setInventory] = useState<Record<WeaponName, number | ''>>(() => {
    const initial = {} as Record<WeaponName, number | ''>;
    allWeapons.forEach(w => initial[w.name] = '');
    return initial;
  });

  // 1日の獲得ペース（空入力を許可）
  const [dailyL1, setDailyL1] = useState<number | ''>(9);

  // 数値として取得（空文字は0として扱う）
  const numericTargetCount = typeof targetCount === 'number' ? targetCount : 0;
  const numericDailyL1 = typeof dailyL1 === 'number' ? dailyL1 : 0;

  // ティア別の折りたたみ状態
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({
    Legend: false,
    Star: false,
    Galaxy: false,
    Universe: false
  });

  const toggleTier = (tier: string) => {
    setExpandedTiers(prev => ({ ...prev, [tier]: !prev[tier] }));
  };

  // 必要数・所持数・不足数・達成日数を計算
  const result = useMemo(() => {
    // 目標達成に必要なL1換算値
    const targetL1Required = weapons[targetWeapon].requiredL1 * numericTargetCount;

    // 所持武器のL1換算合計
    let inventoryL1Total = 0;
    for (const [name, count] of Object.entries(inventory)) {
      if (isWeaponName(name)) {
        const numericCount = typeof count === 'number' ? count : 0;
        inventoryL1Total += weapons[name].requiredL1 * numericCount;
      }
    }

    // 不足数と達成日数
    const neededL1 = Math.max(0, targetL1Required - inventoryL1Total);
    const daysNeeded = numericDailyL1 > 0 ? Math.ceil(neededL1 / numericDailyL1) : Infinity;

    return { targetL1: targetL1Required, inventoryL1: inventoryL1Total, neededL1, daysNeeded };
  }, [targetWeapon, numericTargetCount, inventory, numericDailyL1]);

  // 所持武器の更新（空入力許可）
  const updateInventory = (name: WeaponName, value: string) => {
    setInventory(prev => ({
      ...prev,
      [name]: value === '' ? '' : Math.max(0, Number(value))
    }));
  };

  const targetWeaponObject = allWeapons.find(w => w.name === targetWeapon);
  const targetImage = weaponImages[targetWeapon];

  // 進捗パーセント（0-100）
  const progressPercent = result.targetL1 > 0
    ? Math.min(100, Math.round((result.inventoryL1 / result.targetL1) * 100))
    : 0;

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {/* ===== 目標設定エリア ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1 h-5 md:h-6 bg-green-600 rounded-full"></span>
              目標設定
            </h2>
          </div>

          <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
            {/* 武器・本数選択 */}
            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">目標の武器</label>
                <select
                  value={targetWeapon}
                  onChange={(e) => setTargetWeapon(e.target.value as WeaponName)}
                  className="w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-base"
                >
                  {targetWeaponOptions.map((weapon) => (
                    <option key={weapon.name} value={weapon.name}>
                      {getWeaponDisplayName(weapon.name)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">目標本数</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetCount(Math.max(1, numericTargetCount - 1))}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg text-xl font-bold text-gray-600 transition-colors"
                  >
                    −
                  </button>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={targetCount}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTargetCount(val === '' ? '' : Math.max(1, Number(val)));
                      }}
                      min="1"
                      className="w-full pl-3 pr-8 py-2 md:pl-4 md:pr-10 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-base md:text-lg font-mono text-center"
                    />
                    <span className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-xs md:text-base">本</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTargetCount(numericTargetCount + 1)}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg text-xl font-bold text-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* 目標武器プレビュー */}
            <div className="flex flex-col items-center justify-center p-4 md:p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200 h-full min-h-[160px] md:min-h-[200px]">
              {targetWeaponObject && targetImage && (
                <>
                  <div className="relative mb-3 md:mb-4">
                    <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-60"></div>
                    <img
                      src={targetImage.src}
                      alt={getWeaponDisplayName(targetWeapon)}
                      className="w-20 h-20 md:w-24 md:h-24 object-contain relative z-10 drop-shadow-md"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Target Weapon</div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                      {getWeaponDisplayName(targetWeapon)}
                    </h3>
                    <div className="inline-flex items-center px-3 py-1 bg-white border border-gray-200 rounded-full text-xs md:text-sm font-semibold text-gray-600">
                      × {numericTargetCount.toLocaleString()} 本
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ===== 達成予測設定エリア ===== */}
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
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDailyL1(Math.max(0, numericDailyL1 - 1))}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg text-xl font-bold text-gray-600 transition-colors"
                  >
                    −
                  </button>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={dailyL1}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDailyL1(val === '' ? '' : Math.max(0, Number(val)));
                      }}
                      min="0"
                      className="w-full pl-3 pr-8 py-2 md:pl-4 md:pr-10 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-base md:text-lg font-mono text-center"
                    />
                    <span className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-xs md:text-base">本</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDailyL1(numericDailyL1 + 1)}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg text-xl font-bold text-gray-600 transition-colors"
                  >
                    +
                  </button>
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

      {/* ===== 所持武器入力エリア ===== */}
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

        {/* ティア別の折りたたみ入力フォーム */}
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
                  {/* 入力中の武器数を表示 */}
                  {(() => {
                    const count = groupedWeapons[tier].reduce((acc, w) => {
                      const val = inventory[w.name];
                      return acc + (typeof val === 'number' ? val : 0);
                    }, 0);
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
                    {groupedWeapons[tier].map((weapon) => (
                      <div key={weapon.name} className="flex items-center p-2.5 md:p-3 bg-gray-50 rounded-xl border border-gray-100 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                        <img
                          src={weaponImages[weapon.name].src}
                          alt={weapon.name}
                          className="w-10 h-10 md:w-12 md:h-12 object-contain mr-2 md:mr-3"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] md:text-xs text-gray-500 mb-1 truncate">{getWeaponDisplayName(weapon.name)}</div>
                          <input
                            type="number"
                            value={inventory[weapon.name]}
                            onChange={(e) => updateInventory(weapon.name, e.target.value)}
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

      {/* ===== 計算結果エリア ===== */}
      <div className="space-y-4 md:space-y-6">
        {/* サマリーカード */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <SummaryCard
            title="必要総数"
            value={`${result.targetL1.toLocaleString()}`}
            subValue="レジェンド最上級換算"
            color="#1d4ed8"
            highlight={true}
          />
          <SummaryCard
            title="所持数"
            value={`${result.inventoryL1.toLocaleString()}`}
            subValue="レジェンド最上級換算"
            color="#16a34a"
          />
          <SummaryCard
            title="不足数"
            value={`${result.neededL1.toLocaleString()}`}
            subValue="レジェンド最上級換算"
            color="#ea580c"
          />
          <SummaryCard
            title="達成予定"
            value={result.daysNeeded === Infinity ? '未定' : result.neededL1 === 0 ? '達成' : `${result.daysNeeded.toLocaleString()}日`}
            subValue={result.daysNeeded !== Infinity && result.neededL1 > 0 ? `約 ${(result.daysNeeded / 30).toFixed(1)}ヶ月` : undefined}
            color="#9333ea"
          />
        </div>

        {/* 進捗バー */}
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

          {/* 達成予定日表示 */}
          {result.neededL1 > 0 && result.daysNeeded !== Infinity ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm bg-blue-50/50 p-3 md:p-4 rounded-xl border border-blue-100">
              <div className="text-gray-600 mb-2 sm:mb-0 text-xs md:text-sm">
                現在のペース（<span className="font-bold text-gray-800">{numericDailyL1}本/日</span>）で継続した場合の達成予定日
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
              目標を達成しています
            </div>
          ) : (
            <div className="text-center py-3 md:py-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-500 text-xs md:text-sm">
              1日の獲得ペースを入力すると達成予定日が計算されます
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
