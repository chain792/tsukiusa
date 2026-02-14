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
import type { GachaLevel, WeaponName, Locale } from '../../lib/weapons';
import {
  weapons,
  tierNames,
  rarityColors,
  getWeaponDisplayName,
  gachaRates,
  getGachaRate,
  bonusThresholds,
} from '../../lib/weapons';
import { getTranslations } from '../../i18n';
import { SummaryCard, WeaponCard } from '../ui';

// エピック以上のティア
const displayTiers = new Set(['Epic', 'Legend', 'Star', 'Galaxy', 'Universe']);

// パーセント表示（不要な末尾0を除去）
function formatPercent(rate: number, maxDecimals: number): string {
  return parseFloat((rate * 100).toFixed(maxDecimals)) + '%';
}

// ティア別の排出確率表示セクション
function TierRateSection({
  tierKey,
  rate,
  distribution,
  decimalPlaces = 2,
  locale = 'ja',
}: {
  tierKey: string;
  rate: number;
  distribution: Record<string, number>;
  decimalPlaces?: number;
  locale?: Locale;
}) {
  const tierName = tierNames[locale][tierKey] || tierKey;
  return (
    <div>
      <div className="flex justify-between items-end mb-2 pb-2 border-b border-gray-100">
        <span className="font-bold text-gray-700" style={{ color: rarityColors[tierKey] }}>{tierName}</span>
        <span className="font-bold text-gray-800">{formatPercent(rate, 2)}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
        {(Object.entries(distribution) as [WeaponName, number][]).map(([name, ratio]) => {
          const actualProb = rate * ratio;
          return (
            <div key={name} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
              <span className="font-bold text-gray-600 text-xs md:text-sm">{getWeaponDisplayName(name, locale)}</span>
              <div className="text-right">
                <span className="font-bold text-gray-800 text-xs md:text-sm">{(actualProb * 100).toFixed(decimalPlaces)}%</span>
                <span className="text-gray-400 text-[10px] ml-1">({(ratio * 100).toFixed(0)}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GachaAnalyzer({ locale = 'ja' }: { locale?: Locale }) {
  const t = getTranslations(locale);

  // ガチャ設定
  const [gachaLevel, setGachaLevel] = useState<GachaLevel>(14);
  const [totalPulls, setTotalPulls] = useState<number | ''>(2000);

  // 折りたたみセクションの開閉状態
  const [isRateTableOpen, setIsRateTableOpen] = useState(false);
  const [isRawResultsOpen, setIsRawResultsOpen] = useState(false);

  // 累積ボーナス（レジェンド最上級）の本数
  const bonusL1Count = useMemo(() => {
    const pulls = typeof totalPulls === 'number' ? totalPulls : 0;
    const threshold = bonusThresholds[gachaLevel];
    if (threshold && pulls >= threshold) {
      return Math.floor(pulls / threshold);
    }
    return 0;
  }, [gachaLevel, totalPulls]);

  // ガチャ結果の期待値を計算（合成シミュレーション含む）
  const result = useMemo(() => {
    const pulls = typeof totalPulls === 'number' ? totalPulls : 0;
    if (pulls > 0) {
      return analyzeExpectation(gachaLevel, pulls, bonusL1Count);
    }
    return null;
  }, [gachaLevel, totalPulls, bonusL1Count]);

  // レジェンド最上級換算の合計値（ガチャ確率分 + ボーナス分）
  const { gachaL1Count, totalL1Count } = useMemo(() => {
    // 1. ガチャ確率分
    let gachaTotal = 0;
    if (result?.rawResults) {
      for (const item of result.rawResults.results) {
        gachaTotal += weapons[item.name].requiredL1 * item.count;
      }
    }

    return {
      gachaL1Count: gachaTotal,
      totalL1Count: gachaTotal + bonusL1Count,
    };
  }, [result, bonusL1Count]);

  // 生の排出結果（合成前、レジェンド以上のみ）
  const rawDisplayResults = useMemo(() => {
    if (!result?.rawResults) return [];
    return result.rawResults.results
      .filter(item => {
        const weapon = weapons[item.name];
        // スター以上、またはエピック上級(Lv2)以上のみ表示
        if (displayTiers.has(weapon.tier) && weapon.tier !== 'Epic') return item.count > 0.01;
        if (weapon.tier === 'Epic' && weapon.level <= 2) return item.count > 0.01;
        return false;
      })
      .sort((a, b) => weapons[b.name].requiredL1 - weapons[a.name].requiredL1);
  }, [result]);

  // 合成後の最終結果（レジェンド以上のみ）
  const legendAndAbove = new Set(['Legend', 'Star', 'Galaxy', 'Universe']);
  const synthesizedDisplayResults = useMemo(() => {
    if (!result) return [];
    return result.synthesizedResults
      .filter(item => item.count > 0.01 && legendAndAbove.has(weapons[item.name].tier))
      .sort((a, b) => weapons[b.name].requiredL1 - weapons[a.name].requiredL1);
  }, [result]);

  const currentRate = getGachaRate(gachaLevel);
  const numericPulls = typeof totalPulls === 'number' ? totalPulls : 0;
  const totalRubies = numericPulls * 100;

  // ルビー表示のフォーマット
  const formatRubies = (rubies: number) => {
    if (locale === 'en') {
      if (rubies >= 1000000) return `${(rubies / 1000000).toFixed(1)}M`;
      if (rubies >= 1000) return `${(rubies / 1000).toFixed(0)}K`;
      return rubies.toLocaleString();
    }
    return `${Math.floor(rubies / 10000).toLocaleString()}万`;
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto">
      {/* ===== 設定エリア ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 md:h-6 bg-blue-600 rounded-full"></span>
            {t.gacha.simulationSettings}
          </h2>
        </div>

        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* ガチャレベル選択 */}
          <div>
            <label className="block mb-2 md:mb-3 text-sm font-bold text-gray-700">
              {t.gacha.gachaLevel}
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
              {t.gacha.gachaPulls}
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
                placeholder={t.gacha.customPulls}
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-sm">{locale === 'ja' ? '回' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 結果表示エリア ===== */}
      {
        result && numericPulls > 0 && (
          <div className="space-y-4 md:space-y-6">
            {/* サマリーカード */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <SummaryCard
                title={t.gacha.gachaSettings}
                value={`${numericPulls.toLocaleString()}${t.common.pulls}`}
                subValue={`Lv.${gachaLevel}`}
              />
              <SummaryCard
                title={t.gacha.rubySpent}
                value={formatRubies(totalRubies)}
                subValue={`${totalRubies.toLocaleString()}`}
              />

              {/* レジェンド最上級換算（2カラム分） */}
              <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 flex flex-col justify-center">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 h-full">
                  {/* メイン数値 */}
                  <div className="flex flex-col justify-center min-w-[120px]">
                    <h3 className="text-xs md:text-sm font-medium opacity-80 text-gray-500 mb-1">{t.gacha.l1Equivalent}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                        {Math.floor(totalL1Count).toLocaleString()}
                      </span>
                      {t.common.unit && <span className="text-xs md:text-sm font-bold text-gray-500">{t.common.unit}</span>}
                    </div>
                  </div>

                  {/* 内訳・ボーナス表示 */}
                  <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-sm mb-2">
                      <div className="flex flex-col items-start px-2 py-1">
                        <span className="text-[11px] text-gray-500">{t.gacha.gachaDrops}</span>
                        <span className="font-bold text-gray-700">{Math.floor(gachaL1Count).toLocaleString()}</span>
                      </div>
                      <div className="text-gray-300 font-light">+</div>
                      <div className="flex flex-col items-start px-2 py-1">
                        <span className="text-[11px] text-gray-500">{t.gacha.cumulativeBonus}</span>
                        <span className="font-bold text-gray-700">{bonusL1Count.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* 説明文 */}
                    <div className="text-[11px] text-gray-500 leading-tight">
                      {t.gacha.bonusNote.replace('{threshold}', String(bonusThresholds[gachaLevel]))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 最終獲得武器（合成後） */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-base md:text-lg font-bold text-gray-800">
                  {t.gacha.finalWeapons}
                  <span className="ml-2 text-xs md:text-sm font-normal text-gray-500">{t.gacha.finalWeaponsNote}</span>
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
                        locale={locale}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    {t.gacha.noWeapons}
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
                  {t.gacha.rawBreakdown}
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
                          locale={locale}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      {t.gacha.noDropInfo}
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
                  Lv.{gachaLevel} {t.gacha.rateDetails}
                </h3>
                <span className={`transform transition-transform duration-200 text-gray-500 ${isRateTableOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {isRateTableOpen && currentRate && (
                <div className="p-4 md:p-6 space-y-6 border-t border-gray-100 text-sm">
                  {/* スター排出確率（存在する場合のみ） */}
                  {(currentRate.starRate || 0) > 0 && currentRate.starDistribution && (
                    <TierRateSection
                      tierKey="Star"
                      rate={currentRate.starRate!}
                      distribution={currentRate.starDistribution}
                      decimalPlaces={4}
                      locale={locale}
                    />
                  )}

                  {/* レジェンド排出確率 */}
                  <TierRateSection
                    tierKey="Legend"
                    rate={currentRate.legendRate}
                    distribution={currentRate.legendDistribution}
                    locale={locale}
                  />

                  {/* エピック以下 */}
                  <TierRateSection
                    tierKey="Epic"
                    rate={currentRate.epicRate}
                    distribution={currentRate.epicDistribution}
                    locale={locale}
                  />
                  <TierRateSection
                    tierKey="Unique"
                    rate={currentRate.uniqueRate}
                    distribution={currentRate.uniqueDistribution}
                    locale={locale}
                  />
                  <TierRateSection
                    tierKey="Rare"
                    rate={currentRate.rareRate}
                    distribution={currentRate.rareDistribution}
                    locale={locale}
                  />
                  <TierRateSection
                    tierKey="Magic"
                    rate={currentRate.magicRate}
                    distribution={currentRate.magicDistribution}
                    locale={locale}
                  />
                  <TierRateSection
                    tierKey="Normal"
                    rate={currentRate.normalRate}
                    distribution={currentRate.normalDistribution}
                    locale={locale}
                  />
                </div>
              )}
            </div>
          </div >
        )
      }
    </div >
  );
}
