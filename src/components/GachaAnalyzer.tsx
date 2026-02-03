import { useState, useEffect } from 'react';
import { analyzeExpectation } from '../utils/expectationCalculator';
import { calculateActualProbabilities, gachaRates } from '../data/gacha';
import { getRarityShorthand, requiredL1Map } from '../data/synthesis';
import { rarityColors } from '../data/weapons';
import type { GachaLevel, ExpectationAnalysisResult } from '../types';

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

export default function GachaAnalyzer() {
  const [gachaLevel, setGachaLevel] = useState<GachaLevel>(13);
  const [totalPulls, setTotalPulls] = useState<number>(10000);
  const [result, setResult] = useState<ExpectationAnalysisResult | null>(null);

  useEffect(() => {
    const analysisResult = analyzeExpectation(gachaLevel, totalPulls, false);
    setResult(analysisResult);
  }, [gachaLevel, totalPulls]);

  const probabilities = calculateActualProbabilities(gachaLevel);

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
      .filter(item => item.count > 0);
  };

  const totalL1Value = calculateTotalL1Value();
  const integerResults = getIntegerResults();

  return (
    <div className="space-y-4">
      {/* 設定エリア */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ガチャレベル */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              ガチャレベル
            </label>
            <div className="flex flex-wrap gap-2">
              {gachaRates.map((rate) => (
                <button
                  key={rate.level}
                  onClick={() => setGachaLevel(rate.level)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    gachaLevel === rate.level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Lv.{rate.level}
                </button>
              ))}
            </div>
          </div>

          {/* ガチャ回数 */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              ガチャ回数
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {[1000, 5000, 10000, 50000, 100000].map((n) => (
                <button
                  key={n}
                  onClick={() => setTotalPulls(n)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    totalPulls === n
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {n.toLocaleString()}回
                </button>
              ))}
            </div>
            <input
              type="number"
              value={totalPulls}
              onChange={(e) => setTotalPulls(Math.max(1, Number(e.target.value)))}
              min="1"
              step="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="カスタム回数"
            />
          </div>
        </div>
      </div>

      {/* メイン結果 */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 最終的に手に入る武器 */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">最終的に手に入る武器</h3>
              <span className="text-xs text-gray-500">
                {totalPulls.toLocaleString()}回 × Lv.{gachaLevel}
              </span>
            </div>

            {integerResults.length > 0 ? (
              <div className="space-y-2">
                {integerResults.map((item) => {
                  const tier = getTierFromName(item.name);
                  const color = rarityColors[tier];
                  return (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-2 rounded-lg"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <span className="font-medium" style={{ color }}>
                        {getWeaponDisplayName(item.name)}
                      </span>
                      <span className="text-lg font-bold" style={{ color }}>
                        {item.count}本
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">武器は手に入りません</p>
            )}

            <div className="mt-3 pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">レジェンド最上級換算</span>
                <span className="font-bold text-gray-800">
                  {Math.floor(totalL1Value).toLocaleString()}本
                </span>
              </div>
            </div>
          </div>

          {/* ガチャからの排出期待値 */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">ガチャからの排出（期待値）</h3>

            <div className="space-y-1.5">
              {result.rawResults.results.map((item, index) => {
                const name = getRarityShorthand(item.rarity);
                const color = rarityColors[item.rarity.tier];
                return (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span
                      className="w-24 font-medium truncate"
                      style={{ color }}
                    >
                      {getWeaponDisplayName(name)}
                    </span>
                    <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${Math.min(100, (item.count / totalPulls) * 1000)}%`,
                          backgroundColor: color
                        }}
                      />
                    </div>
                    <span className="w-16 text-right text-gray-600">
                      {item.count >= 10 ? Math.round(item.count) : item.count.toFixed(1)}本
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 確率テーブル */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Lv.{gachaLevel} の排出確率
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-600">武器</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">確率</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">1000回あたり</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {Object.entries(probabilities).map(([rarity, prob]) => {
                const tier = getTierFromName(rarity);
                const color = rarityColors[tier];
                return (
                  <tr key={rarity} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <span style={{ color }} className="font-medium">
                        {getWeaponDisplayName(rarity)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      {(prob * 100).toFixed(4)}%
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">
                      {(prob * 1000).toFixed(1)}本
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
