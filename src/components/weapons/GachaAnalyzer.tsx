/**
 * 武器ガチャシミュレーター
 *
 * ガチャレベルと回数を指定して、獲得武器の期待値を計算する。
 * - 排出確率に基づく期待値計算
 * - 全武器を合成した場合の最終結果を表示
 * - 排出確率の詳細表示
 */
import { useState, useMemo } from 'react';
import { analyzeExpectation } from '../../utils/expectationCalculator';
import type { GachaLevel, WeaponName } from '../../lib/weapons';
import {
  weapons,
  rarityColors,
  getWeaponDisplayName,
  gachaRates,
  getGachaRate,
} from '../../lib/weapons';
import { SummaryCard, WeaponCard } from '../ui';

export default function GachaAnalyzer() {
  // ガチャ設定
  const [gachaLevel, setGachaLevel] = useState<GachaLevel>(14);
  const [totalPulls, setTotalPulls] = useState<number | ''>(2000);

  // 折りたたみセクションの開閉状態
  const [isRateTableOpen, setIsRateTableOpen] = useState(false);
  const [isRawResultsOpen, setIsRawResultsOpen] = useState(false);

  // ガチャ結果の期待値を計算（合成シミュレーション含む）
  const result = useMemo(() => {
    const pulls = typeof totalPulls === 'number' ? totalPulls : 0;
    if (pulls > 0) {
      return analyzeExpectation(gachaLevel, pulls);
    }
    return null;
  }, [gachaLevel, totalPulls]);

  // レジェンド最上級換算の合計値
  const totalL1Value = useMemo(() => {
    if (!result) return 0;
    let total = 0;
    for (const item of result.synthesizedResults) {
      total += weapons[item.name].requiredL1 * item.count;
    }
    return total;
  }, [result]);

  // 生の排出結果（合成前、高レアリティ順）
  const rawDisplayResults = useMemo(() => {
    if (!result?.rawResults) return [];
    return result.rawResults.results
      .filter(item => item.count > 0.01)
      .sort((a, b) => weapons[b.name].requiredL1 - weapons[a.name].requiredL1);
  }, [result]);

  // 合成後の最終結果（高レアリティ順）
  const synthesizedDisplayResults = useMemo(() => {
    if (!result) return [];
    return result.synthesizedResults
      .filter(item => item.count > 0.01)
      .sort((a, b) => weapons[b.name].requiredL1 - weapons[a.name].requiredL1);
  }, [result]);

  const currentRate = getGachaRate(gachaLevel);
  const numericPulls = typeof totalPulls === 'number' ? totalPulls : 0;
  const totalRubies = numericPulls * 100;

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto">
      {/* ===== 設定エリア ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 md:h-6 bg-blue-600 rounded-full"></span>
            シミュレーション設定
          </h2>
        </div>

        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* ガチャレベル選択 */}
          <div>
            <label className="block mb-2 md:mb-3 text-sm font-bold text-gray-700">
              ガチャレベル
            </label>
            <div className="flex flex-wrap gap-2">
              {gachaRates.map((rate) => (
                <button
                  key={rate.level}
                  onClick={() => setGachaLevel(rate.level)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 ${gachaLevel === rate.level
                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                    }`}
                >
                  Lv.{rate.level}
                </button>
              ))}
            </div>
          </div>

          {/* ガチャ回数入力 */}
          <div>
            <label className="block mb-2 md:mb-3 text-sm font-bold text-gray-700">
              ガチャ回数
            </label>
            {/* クイック選択ボタン */}
            <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
              {[1000, 2000, 5000, 10000, 50000, 100000].map((n) => (
                <button
                  key={n}
                  onClick={() => setTotalPulls(n)}
                  className={`px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold transition-all ${totalPulls === n
                    ? 'bg-blue-100 text-blue-700 border-blue-200 border'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {n.toLocaleString()}
                </button>
              ))}
            </div>
            {/* カスタム入力 */}
            <div className="relative">
              <input
                type="number"
                value={totalPulls}
                onChange={(e) => {
                  const val = e.target.value;
                  setTotalPulls(val === '' ? '' : Number(val));
                }}
                min="0"
                step="1000"
                className="w-full pl-4 pr-12 py-2 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none font-mono text-base md:text-lg"
                placeholder="カスタム回数"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-sm">回</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 結果表示エリア ===== */}
      {result && numericPulls > 0 && (
        <div className="space-y-4 md:space-y-6">
          {/* サマリーカード */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <SummaryCard
              title="ガチャ設定"
              value={`${numericPulls.toLocaleString()}回`}
              subValue={`Lv.${gachaLevel}`}
            />
            <SummaryCard
              title="消費ルビー"
              value={`${Math.floor(totalRubies / 10000).toLocaleString()}万`}
              subValue={`${totalRubies.toLocaleString()}`}
            />
            <SummaryCard
              title="レジェンド最上級換算"
              value={`${Math.floor(totalL1Value).toLocaleString()}本`}
            />
          </div>

          {/* 最終獲得武器（合成後） */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-base md:text-lg font-bold text-gray-800">
                最終獲得武器
                <span className="ml-2 text-xs md:text-sm font-normal text-gray-500">※全て合成した場合の期待値</span>
              </h3>
            </div>

            <div className="p-4 md:p-6">
              {synthesizedDisplayResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                  {synthesizedDisplayResults.map((item) => (
                    <WeaponCard
                      key={item.name}
                      name={item.name}
                      count={item.count}
                      showDecimals={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  獲得できる武器はありません
                </div>
              )}
            </div>
          </div>

          {/* 折りたたみ: ガチャ排出内訳（合成前） */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setIsRawResultsOpen(!isRawResultsOpen)}
              className="w-full px-4 py-3 md:px-6 md:py-4 flex items-center justify-between bg-gray-50/50 hover:bg-gray-100 transition-colors text-left"
            >
              <h3 className="text-sm font-bold text-gray-700">
                参考：ガチャ排出内訳 (期待値)
              </h3>
              <span className={`transform transition-transform duration-200 text-gray-500 ${isRawResultsOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {isRawResultsOpen && (
              <div className="p-4 md:p-6 border-t border-gray-100">
                {rawDisplayResults.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {rawDisplayResults.map((item) => (
                      <WeaponCard
                        key={item.name}
                        name={item.name}
                        count={item.count}
                        showDecimals={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    排出情報なし
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 折りたたみ: 排出確率詳細 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setIsRateTableOpen(!isRateTableOpen)}
              className="w-full px-4 py-3 md:px-6 md:py-4 flex items-center justify-between bg-gray-50/50 hover:bg-gray-100 transition-colors text-left"
            >
              <h3 className="text-sm font-bold text-gray-700">
                Lv.{gachaLevel} 排出確率詳細
              </h3>
              <span className={`transform transition-transform duration-200 text-gray-500 ${isRateTableOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {isRateTableOpen && currentRate && (
              <div className="p-4 md:p-6 space-y-6 border-t border-gray-100 text-sm">
                {/* Legend排出確率 */}
                <div>
                  <div className="flex justify-between items-end mb-2 pb-2 border-b border-gray-100">
                    <span className="font-bold text-gray-700" style={{ color: rarityColors.Legend }}>Legend</span>
                    <span className="font-bold text-gray-800">{(currentRate.legendRate * 100).toFixed(0)}%</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                    {(Object.entries(currentRate.legendDistribution) as [WeaponName, number][]).map(([name, ratio]) => {
                      const actualProb = currentRate.legendRate * ratio;
                      return (
                        <div key={name} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
                          <span className="font-bold text-gray-600 text-xs md:text-sm">{getWeaponDisplayName(name)}</span>
                          <div className="text-right">
                            <span className="font-bold text-gray-800 text-xs md:text-sm">{(actualProb * 100).toFixed(2)}%</span>
                            <span className="text-gray-400 text-[10px] ml-1">({(ratio * 100).toFixed(0)}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Star排出確率（存在する場合のみ） */}
                {(currentRate.starRate || 0) > 0 && currentRate.starDistribution && (
                  <div>
                    <div className="flex justify-between items-end mb-2 pb-2 border-b border-gray-100 mt-4">
                      <span className="font-bold text-gray-700" style={{ color: rarityColors.Star }}>Star</span>
                      <span className="font-bold text-gray-800">{(currentRate.starRate! * 100).toFixed(2)}%</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                      {(Object.entries(currentRate.starDistribution) as [WeaponName, number][]).map(([name, ratio]) => {
                        const actualProb = currentRate.starRate! * ratio;
                        return (
                          <div key={name} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
                            <span className="font-bold text-gray-600 text-xs md:text-sm">{getWeaponDisplayName(name)}</span>
                            <div className="text-right">
                              <span className="font-bold text-gray-800 text-xs md:text-sm">{(actualProb * 100).toFixed(4)}%</span>
                              <span className="text-gray-400 text-[10px] ml-1">({(ratio * 100).toFixed(0)}%)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
