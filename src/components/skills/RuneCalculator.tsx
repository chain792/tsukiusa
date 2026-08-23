/**
 * スキルルーンの効果一覧と、狙いの効果を引くまでに必要な変換回数の計算。
 *
 * - ルーンの等級は確率に影響せず、オプションの枠数だけが変わる（中級3 / 上級4）
 * - 変換の巻物1回で全枠が振り直される
 */
import { useMemo, useState } from 'react';
import {
  skillRunes,
  runeSlotCounts,
  runeTierNames,
  runeTierColors,
  calcRuneOdds,
  effectChancePerSlot,
  type RuneGrade,
} from '../../lib/skills';
import { getTranslations } from '../../i18n';
import type { Locale } from '../../i18n/types';

const percent = (v: number, digits = 2) => `${(v * 100).toFixed(digits)}%`;

export default function RuneCalculator({
  skillId,
  locale = 'ja',
}: {
  skillId: string;
  locale?: Locale;
}) {
  const t = getTranslations(locale);
  const tiers = skillRunes[skillId] ?? [];

  const [grade, setGrade] = useState<RuneGrade>('advanced');
  const [target, setTarget] = useState(() => {
    const legend = tiers.find(x => x.tier === 'Legend');
    return legend ? `Legend::0` : `${tiers[0]?.tier}::0`;
  });

  const [tierName, effectIndex] = target.split('::');
  const odds = useMemo(() => calcRuneOdds(skillId, tierName, grade), [skillId, tierName, grade]);
  const targetTier = tiers.find(x => x.tier === tierName);
  const targetEffect = targetTier?.effects[Number(effectIndex)] ?? '';

  if (tiers.length === 0) return null;

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 md:px-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="w-1 h-5 md:h-6 bg-indigo-600 rounded-full" />
          {t.skillCatalog.runeTitle}
        </h2>
      </div>

      <div className="p-4 md:p-6 space-y-5">
        <p className="text-xs md:text-sm text-gray-600">{t.skillCatalog.runeIntro}</p>

        {/* 設定 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div>
            <span className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5">
              {t.skillCatalog.runeGrade}
            </span>
            <div className="flex gap-2">
              {(['intermediate', 'advanced'] as const).map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  aria-pressed={grade === g}
                  className={`px-3 py-2 rounded-lg text-xs md:text-sm font-bold border transition-colors ${
                    grade === g
                      ? 'bg-indigo-600 text-white border-transparent'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {g === 'intermediate' ? t.skillCatalog.runeIntermediate : t.skillCatalog.runeAdvanced}
                  <span className="ml-1.5 font-normal opacity-80">
                    {t.skillCatalog.runeSlots.replace('{n}', String(runeSlotCounts[g]))}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <label htmlFor="rune-target" className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5">
              {t.skillCatalog.runeTarget}
            </label>
            <select
              id="rune-target"
              value={target}
              onChange={e => setTarget(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm"
            >
              {tiers.map(tier => (
                <optgroup key={tier.tier} label={runeTierNames[locale][tier.tier]}>
                  {tier.effects.map((eff, i) => (
                    <option key={i} value={`${tier.tier}::${i}`}>
                      {eff}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* 結果 */}
        {odds && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-3">
            <p className="text-sm font-bold text-gray-800">{targetEffect}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <div className="text-[10px] md:text-xs text-gray-500">{t.skillCatalog.runePerSlot}</div>
                <div className="text-lg font-bold text-gray-800 tabular-nums">{percent(odds.perSlot)}</div>
              </div>
              <div>
                <div className="text-[10px] md:text-xs text-gray-500">{t.skillCatalog.runePerConversion}</div>
                <div className="text-lg font-bold text-indigo-700 tabular-nums">{percent(odds.perConversion)}</div>
              </div>
              <div>
                <div className="text-[10px] md:text-xs text-gray-500">{t.skillCatalog.runeExpected}</div>
                <div className="text-lg font-bold text-gray-800 tabular-nums">
                  {odds.expected ? t.skillCatalog.runeConversions.replace('{n}', odds.expected.toFixed(1)) : '-'}
                </div>
              </div>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-indigo-100">
              {odds.milestones.map(m => (
                <div key={m.target} className="flex items-baseline justify-between sm:block">
                  <dt className="text-[10px] md:text-xs text-gray-500">
                    {t.skillCatalog.runeMilestone.replace('{p}', String(m.target * 100))}
                  </dt>
                  <dd className="text-sm font-bold text-gray-800 tabular-nums">
                    {m.conversions !== null
                      ? t.skillCatalog.runeConversions.replace('{n}', String(m.conversions))
                      : '-'}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* 効果一覧 */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 mb-2">{t.skillCatalog.runeEffectList}</h3>
          <div className="space-y-2">
            {tiers.map(tier => (
              <div key={tier.tier} className="flex flex-col sm:flex-row sm:gap-3">
                <div className="shrink-0 sm:w-40 flex items-baseline gap-2 mb-1 sm:mb-0">
                  <span
                    className="inline-block px-2 py-0.5 rounded text-white text-[11px] font-bold"
                    style={{ backgroundColor: runeTierColors[tier.tier] }}
                  >
                    {runeTierNames[locale][tier.tier]}
                  </span>
                  <span className="text-[11px] text-gray-500 tabular-nums">
                    {percent(tier.probability, 0)} / {percent(effectChancePerSlot(tier))}
                  </span>
                </div>
                <ul className="flex-1 text-xs md:text-sm text-gray-700 space-y-0.5">
                  {tier.effects.map((eff, i) => (
                    <li key={i}>{eff}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[10px] md:text-xs text-gray-500 space-y-1">
          <p>{t.skillCatalog.runeRuleNote}</p>
          <p>{t.skillCatalog.runeIndependenceNote}</p>
        </div>
      </div>
    </section>
  );
}
