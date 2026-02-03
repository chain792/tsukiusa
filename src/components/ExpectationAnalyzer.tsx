import { useState } from 'react';
import { analyzeExpectation } from '../utils/expectationCalculator';
import { gachaRates } from '../data/gacha';
import { getRarityShorthand } from '../data/synthesis';
import type { GachaLevel, ExpectationAnalysisResult } from '../types';

export default function ExpectationAnalyzer() {
  const [gachaLevel, setGachaLevel] = useState<GachaLevel>(13);
  const [totalPulls, setTotalPulls] = useState<number>(10000);
  const [showSteps, setShowSteps] = useState<boolean>(false);
  const [result, setResult] = useState<ExpectationAnalysisResult | null>(null);

  // 分析実行
  const handleAnalyze = () => {
    const analysisResult = analyzeExpectation(gachaLevel, totalPulls, showSteps);
    setResult(analysisResult);
  };

  return (
    <div className="space-y-6">
      {/* 入力セクション */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">分析設定</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              ガチャレベル
            </label>
            <select
              value={gachaLevel}
              onChange={(e) => setGachaLevel(Number(e.target.value) as GachaLevel)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {gachaRates.map((rate) => (
                <option key={rate.level} value={rate.level}>
                  レベル {rate.level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              試行回数
            </label>
            <input
              type="number"
              value={totalPulls}
              onChange={(e) => setTotalPulls(Number(e.target.value))}
              min="1"
              step="1000"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showSteps}
              onChange={(e) => setShowSteps(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">合成過程の詳細を表示</span>
          </label>
        </div>

        <button
          onClick={handleAnalyze}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          期待値を計算
        </button>
      </div>

      {/* 結果表示 */}
      {result && (
        <>
          {/* 排出期待値 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              ガチャ {result.totalPulls.toLocaleString()}回の排出期待値
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">レア度</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-700">排出数</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {result.rawResults.results.map((item, index) => {
                    const name = getRarityShorthand(item.rarity);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-mono">{name}</td>
                        <td className="px-4 py-2 text-right font-medium">
                          {item.count.toFixed(2)}本
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 合成後の最終構成 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">全て合成した場合の最終構成</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">レア度</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-700">本数</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {result.synthesizedResults.map((item, index) => {
                    const name = getRarityShorthand(item.rarity);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-mono font-bold">{name}</td>
                        <td className="px-4 py-2 text-right font-semibold text-blue-600 text-lg">
                          {item.count.toFixed(2)}本
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 計算過程 */}
          {result.synthesisSteps && result.synthesisSteps.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">合成過程の詳細</h3>

              <div className="space-y-2">
                {result.synthesisSteps.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
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
  );
}
