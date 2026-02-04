import { useState, useEffect } from 'react';
import { analyzeExpectation } from '../utils/expectationCalculator';
import { calculateActualProbabilities, gachaRates, getGachaRate } from '../data/gacha';
import { getRarityShorthand, requiredL1Map } from '../data/synthesis';
import { rarityColors } from '../data/weapons';
import type { GachaLevel, ExpectationAnalysisResult } from '../types';

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

function getWeaponDisplayName(name: string): string {
  const tier = name.charAt(0);
  const level = parseInt(name.charAt(1));
  const tierMap: Record<string, string> = {
    'L': 'レジェンド',
    'S': 'スター',
    'G': 'ギャラクシー',
    'U': 'ユニバース'
  };
  return `${tierMap[tier] || tier}${levelNames[level] || ''}`;
}

function getTierFromName(name: string): string {
  const tier = name.charAt(0);
  const tierMap: Record<string, string> = {
    'L': 'Legend',
    'S': 'Star',
    'G': 'Galaxy',
    'U': 'Universe'
  };
  return tierMap[tier] || 'Legend';
}

// サマリー表示用のカードコンポーネント
const SummaryCard = ({
  title,
  value,
  subValue,
  customColor
}: {
  title: string,
  value: string,
  subValue?: string,
  customColor?: string
}) => {
  return (
    <div
      className={`rounded-xl shadow-sm border p-3 md:p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow ${!customColor ? 'bg-white border-gray-100' : ''}`}
      style={customColor ? {
        backgroundColor: `${customColor}08`, // 非常に薄い背景
        borderColor: `${customColor}40`,     // 薄いボーダー
      } : undefined}
    >
      <div className={`text-xs md:text-sm font-medium mb-1 opacity-80 text-gray-500`}>{title}</div>
      <div
        className="text-lg md:text-2xl font-bold text-gray-800 break-all"
        style={customColor ? { color: customColor } : undefined}
      >
        {value}
      </div>
      {subValue && <div className={`text-[10px] md:text-xs mt-1 opacity-70 text-gray-500`}>{subValue}</div>}
    </div>
  );
};

// 武器表示用のカードコンポーネント
const WeaponCard = ({ name, count, color }: { name: string, count: number, color: string }) => {
  const displayName = getWeaponDisplayName(name);
  const isHighRarity = ['U', 'G', 'S'].includes(name.charAt(0));
  const image = weaponImages[name];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-3 md:p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${isHighRarity ? 'bg-gradient-to-br from-white to-gray-50' : 'bg-white'}`}
      style={{ borderColor: `${color}30` }}
    >
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: color }}
      />

      {image && (
        <img
          src={image.src}
          alt={displayName}
          className="w-12 h-12 md:w-16 md:h-16 object-contain mb-2 drop-shadow-sm mx-auto"
        />
      )}

      <div className="font-bold text-gray-800 mb-1 truncate w-full text-xs md:text-sm px-1">
        {displayName}
      </div>
      <div className="text-lg md:text-xl font-extrabold" style={{ color }}>
        {count.toLocaleString()}
        <span className="text-[10px] md:text-xs font-normal ml-1 text-gray-500">本</span>
      </div>
    </div>
  );
};

export default function GachaAnalyzer() {
  const [gachaLevel, setGachaLevel] = useState<GachaLevel>(14);
  const [totalPulls, setTotalPulls] = useState<number | ''>(2000);
  const [result, setResult] = useState<ExpectationAnalysisResult | null>(null);
  const [isRateTableOpen, setIsRateTableOpen] = useState(false);

  useEffect(() => {
    const pulls = typeof totalPulls === 'number' ? totalPulls : 0;
    if (pulls > 0) {
      const analysisResult = analyzeExpectation(gachaLevel, pulls, false);
      setResult(analysisResult);
    } else {
      setResult(null);
    }
  }, [gachaLevel, totalPulls]);

  // L1換算の合計を計算
  const calculateTotalL1Value = (): number => {
    if (!result) return 0;
    let total = 0;
    for (const item of result.synthesizedResults) {
      const name = getRarityShorthand(item.rarity);
      const l1Value = requiredL1Map[name] || 0;
      total += l1Value * item.count;
    }
    return total;
  };

  // 合成結果を整数で取得（余りも含む）
  const getIntegerResults = (): { name: string; count: number }[] => {
    if (!result) return [];
    return result.synthesizedResults
      .map(item => ({
        name: getRarityShorthand(item.rarity),
        count: Math.floor(item.count)
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => {
        // L1換算値で降順ソート
        const valA = requiredL1Map[a.name] || 0;
        const valB = requiredL1Map[b.name] || 0;
        return valB - valA;
      });
  };

  const totalL1Value = calculateTotalL1Value();
  const integerResults = getIntegerResults();

  // 最高レアリティの取得
  const bestWeapon = integerResults.length > 0 ? integerResults[0] : null;
  const bestWeaponTier = bestWeapon ? getTierFromName(bestWeapon.name) : 'Legend';
  const bestWeaponColor = bestWeapon ? rarityColors[bestWeaponTier] : undefined;

  // 現在のガチャ確率設定を取得
  const currentRate = getGachaRate(gachaLevel);

  // 必要ルビー計算 (100ルビー/回)
  const numericPulls = typeof totalPulls === 'number' ? totalPulls : 0;
  const totalRubies = numericPulls * 100;

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto">
      {/* 設定エリア */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 md:h-6 bg-blue-600 rounded-full"></span>
            シミュレーション設定
          </h2>
        </div>

        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* ガチャレベル */}
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

          {/* ガチャ回数 */}
          <div>
            <label className="block mb-2 md:mb-3 text-sm font-bold text-gray-700">
              ガチャ回数
            </label>
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

      {/* 結果表示エリア */}
      {result && numericPulls > 0 && (
        <div className="space-y-4 md:space-y-6">

          {/* サマリー */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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
            <SummaryCard
              title="最高レアリティ"
              value={bestWeapon ? getWeaponDisplayName(bestWeapon.name) : '-'}
              subValue={bestWeapon ? `${bestWeapon.count}本` : undefined}
              customColor={bestWeaponColor}
            />
          </div>

          {/* 合成結果詳細 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-base md:text-lg font-bold text-gray-800">
                最終獲得武器
                <span className="ml-2 text-xs md:text-sm font-normal text-gray-500">※全て合成した場合の期待値</span>
              </h3>
            </div>

            <div className="p-4 md:p-6">
              {integerResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                  {integerResults.map((item) => {
                    const tier = getTierFromName(item.name);
                    const color = rarityColors[tier];
                    return (
                      <WeaponCard
                        key={item.name}
                        name={item.name}
                        count={item.count}
                        color={color}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  獲得できる武器はありません
                </div>
              )}
            </div>
          </div>

          {/* 確率テーブル（折りたたみ） */}
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

                {/* Legend Table */}
                <div>
                  <div className="flex justify-between items-end mb-2 pb-2 border-b border-gray-100">
                    <span className="font-bold text-gray-700" style={{ color: rarityColors.Legend }}>Legend</span>
                    <span className="font-bold text-gray-800">{(currentRate.legendRate * 100).toFixed(0)}%</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                    {Object.entries(currentRate.legendDistribution).map(([name, ratio]) => {
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

                {/* Star Table */}
                {(currentRate.starRate || 0) > 0 && currentRate.starDistribution && (
                  <div>
                    <div className="flex justify-between items-end mb-2 pb-2 border-b border-gray-100 mt-4">
                      <span className="font-bold text-gray-700" style={{ color: rarityColors.Star }}>Star</span>
                      <span className="font-bold text-gray-800">{(currentRate.starRate! * 100).toFixed(2)}%</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                      {Object.entries(currentRate.starDistribution).map(([name, ratio]) => {
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
