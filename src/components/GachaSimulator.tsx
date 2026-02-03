import { useState } from 'react';
import { simulateGachaExpectation } from '../utils/gachaSimulator';
import { calculateActualProbabilities, gachaRates } from '../data/gacha';
import { getRarityShorthand } from '../data/synthesis';
import type { GachaLevel, GachaSimulationResult } from '../types';

export default function GachaSimulator() {
  const [gachaLevel, setGachaLevel] = useState<GachaLevel>(13);
  const [totalPulls, setTotalPulls] = useState<number>(10000);
  const [result, setResult] = useState<GachaSimulationResult | null>(null);

  // シミュレーション実行
  const handleSimulate = () => {
    const simulationResult = simulateGachaExpectation(gachaLevel, totalPulls);
    setResult(simulationResult);
  };

  // 確率テーブルを取得
  const probabilities = calculateActualProbabilities(gachaLevel);

  return (
    <div className="space-y-6">
      {/* 設定エリア */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">シミュレーション設定</h3>

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

        <button
          onClick={handleSimulate}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          シミュレート実行
        </button>
      </div>

      {/* 確率表示 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">レベル {gachaLevel} の確率テーブル</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">レア度</th>
                <th className="px-4 py-2 text-right font-medium text-gray-700">確率</th>
                <th className="px-4 py-2 text-right font-medium text-gray-700">パーセント</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {Object.entries(probabilities).map(([rarity, prob]) => (
                <tr key={rarity} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono">{rarity}</td>
                  <td className="px-4 py-2 text-right text-gray-600">{prob.toFixed(6)}</td>
                  <td className="px-4 py-2 text-right font-medium">{(prob * 100).toFixed(4)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 結果表示 */}
      {result && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            シミュレーション結果（{result.totalPulls.toLocaleString()}回）
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">レア度</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-700">排出数</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-700">確率</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {result.results.map((item, index) => {
                  const name = getRarityShorthand(item.rarity);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono font-medium">{name}</td>
                      <td className="px-4 py-2 text-right font-semibold text-blue-600">
                        {item.count.toFixed(2)}本
                      </td>
                      <td className="px-4 py-2 text-right text-gray-600">
                        {(item.probability * 100).toFixed(4)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
