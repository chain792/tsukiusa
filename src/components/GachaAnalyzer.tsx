import { useState, useEffect } from 'react';
import { analyzeExpectation } from '../utils/expectationCalculator';
import { calculateActualProbabilities, gachaRates } from '../data/gacha';
import { getRarityShorthand, requiredL1Map } from '../data/synthesis';
import { rarityColors } from '../data/weapons';
import type { GachaLevel, ExpectationAnalysisResult } from '../types';

export default function GachaAnalyzer() {
  const [gachaLevel, setGachaLevel] = useState<GachaLevel>(13);
  const [totalPulls, setTotalPulls] = useState<number>(10000);
  const [result, setResult] = useState<ExpectationAnalysisResult | null>(null);

  // 自動計算
  useEffect(() => {
    const analysisResult = analyzeExpectation(gachaLevel, totalPulls, false);
    setResult(analysisResult);
  }, [gachaLevel, totalPulls]);

  // 確率テーブル
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

  // 最高レア度の武器を取得
  const getHighestRarity = (): { name: string; count: number } | null => {
    if (!result || result.synthesizedResults.length === 0) return null;
    // synthesizedResultsは高レア度順にソートされている
    const highest = result.synthesizedResults[0];
    return {
      name: getRarityShorthand(highest.rarity),
      count: Math.floor(highest.count)
    };
  };

  // 特定の武器が何本作れるか計算
  const calculateCraftable = (targetName: string): number => {
    const totalL1 = calculateTotalL1Value();
    const required = requiredL1Map[targetName] || 1;
    return Math.floor(totalL1 / required);
  };

  const totalL1Value = calculateTotalL1Value();
  const highestRarity = getHighestRarity();

  return (
    <div className="space-y-6">
      {/* 設定エリア */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">ガチャ設定</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ガチャレベル */}
          <div>
            <label className="block mb-3 text-sm font-medium text-gray-700">
              ガチャレベル
            </label>
            <div className="flex flex-wrap gap-2">
              {gachaRates.map((rate) => (
                <button
                  key={rate.level}
                  onClick={() => setGachaLevel(rate.level)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    gachaLevel === rate.level
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Lv.{rate.level}
                </button>
              ))}
            </div>
          </div>

          {/* 試行回数 */}
          <div>
            <label className="block mb-3 text-sm font-medium text-gray-700">
              ガチャ回数
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="カスタム回数"
            />
          </div>
        </div>
      </div>

      {/* メイン結果 - 作れる武器 */}
      {result && (
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2 opacity-90">
            ガチャ {totalPulls.toLocaleString()}回 の結果
          </h3>
          <p className="text-sm opacity-75 mb-6">レベル{gachaLevel}のガチャを{totalPulls.toLocaleString()}回引いて全て合成した場合</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 最高レア度の武器 */}
            <div className="bg-white/10 rounded-xl p-6">
              <p className="text-sm opacity-80 mb-2">作れる最高レア武器</p>
              {highestRarity && highestRarity.count > 0 ? (
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-5xl font-bold"
                    style={{ color: rarityColors[result.synthesizedResults[0]?.rarity.tier || 'Legend'] }}
                  >
                    {highestRarity.name}
                  </span>
                  <span className="text-3xl font-bold">
                    × {highestRarity.count}本
                  </span>
                </div>
              ) : (
                <p className="text-2xl">高レア武器は作れません</p>
              )}
            </div>

            {/* L1換算合計 */}
            <div className="bg-white/10 rounded-xl p-6">
              <p className="text-sm opacity-80 mb-2">合計ドラバス価値（L1換算）</p>
              <p className="text-4xl font-bold">
                {Math.floor(totalL1Value).toLocaleString()}
                <span className="text-xl ml-1">本</span>
              </p>
            </div>
          </div>

          {/* 各武器の作成可能数 */}
          <div className="mt-6">
            <p className="text-sm opacity-80 mb-3">L1換算で作れる武器の目安</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['U4', 'G1', 'G2', 'S1'].map((name) => {
                const craftable = calculateCraftable(name);
                const color = rarityColors[
                  name.startsWith('U') ? 'Universe' :
                  name.startsWith('G') ? 'Galaxy' :
                  name.startsWith('S') ? 'Star' : 'Legend'
                ];
                return (
                  <div key={name} className="bg-white/10 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold" style={{ color }}>
                      {name}
                    </p>
                    <p className="text-lg">
                      {craftable}本
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 排出期待値テーブル */}
      {result && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">排出期待値</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ガチャ排出 */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">ガチャからの排出</h4>
              <div className="space-y-2">
                {result.rawResults.results.map((item, index) => {
                  const name = getRarityShorthand(item.rarity);
                  const color = rarityColors[item.rarity.tier];
                  const percentage = (item.count / totalPulls) * 100;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <span
                        className="w-12 text-center font-mono font-bold py-1 rounded text-white text-sm"
                        style={{ backgroundColor: color }}
                      >
                        {name}
                      </span>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, percentage * 10)}%`,
                              backgroundColor: color
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium w-20 text-right">
                        {item.count.toFixed(1)}本
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 合成後 */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">全て合成した後</h4>
              <div className="space-y-2">
                {result.synthesizedResults.map((item, index) => {
                  const name = getRarityShorthand(item.rarity);
                  const color = rarityColors[item.rarity.tier];
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <span
                        className="w-12 text-center font-mono font-bold py-1 rounded text-white text-sm"
                        style={{ backgroundColor: color }}
                      >
                        {name}
                      </span>
                      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, item.count * 20)}%`,
                            backgroundColor: color
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-20 text-right">
                        {item.count.toFixed(2)}本
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 確率テーブル */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">レベル{gachaLevel}の排出確率</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">レア度</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">確率</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">1000回あたり</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {Object.entries(probabilities).map(([rarity, prob]) => {
                const color = rarityColors[
                  rarity.startsWith('L') ? 'Legend' :
                  rarity.startsWith('S') ? 'Star' :
                  rarity.startsWith('G') ? 'Galaxy' : 'Universe'
                ];
                return (
                  <tr key={rarity} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span
                        className="inline-block px-2 py-0.5 rounded font-mono font-medium text-white text-sm"
                        style={{ backgroundColor: color }}
                      >
                        {rarity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {(prob * 100).toFixed(4)}%
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      約{(prob * 1000).toFixed(1)}本
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
