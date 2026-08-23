/**
 * スキル図鑑
 *
 * リンの全スキルを等級ごとにまとめて表示する。
 * - 名前で検索、等級・属性・種類で絞り込み
 * - 等級の中は属性（光→闇→火→水）でまとめ、その中の並び順を切り替え
 * - 行をクリックすると詳細（発動効果・所持効果・覚醒効果・継承元）を展開
 * - 等級をまたいで列がずれないよう、テーブルは1つにまとめて colgroup で幅を固定
 * - スキルレベルを指定するとMP消費量が再計算される（推定式・utils 参照）
 */
import { Fragment, useMemo, useState } from 'react';
import {
  skills,
  skillTiers,
  skillElements,
  skillKinds,
  skillTierNames,
  skillElementNames,
  skillKindNames,
  skillTargetNames,
  skillTierColors,
  skillElementColors,
  skillImages,
  skillDetails,
  getSkillDisplayName,
  getMpAtLevel,
  getMpPerSecond,
  getEffectiveLevel,
  defaultSkillLevel,
  type Skill,
  type SkillTier,
  type SkillElement,
  type SkillKind,
} from '../../lib/skills';
import { getTranslations, getLocalePath } from '../../i18n';
import type { Locale } from '../../i18n/types';
import SkillDetailPanel from './SkillDetailPanel';

type SortKey = 'name' | 'cooldown' | 'mp' | 'mpPerSec';

/** 選択トグル用の小さなボタン */
function FilterChip({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 border ${
        active ? 'text-white border-transparent' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
      }`}
      style={active ? { backgroundColor: color ?? '#2563EB' } : undefined}
    >
      {label}
    </button>
  );
}

export default function SkillCatalog({ locale = 'ja' }: { locale?: Locale }) {
  const t = getTranslations(locale);

  const [query, setQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<Set<SkillTier>>(new Set());
  const [elementFilter, setElementFilter] = useState<Set<SkillElement>>(new Set());
  const [kindFilter, setKindFilter] = useState<Set<SkillKind>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>('name');
  // 空入力を許可するため number | '' 型
  const [skillLevel, setSkillLevel] = useState<number | ''>(defaultSkillLevel);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const level = typeof skillLevel === 'number' && skillLevel > 0 ? skillLevel : 1;

  function toggle<T>(set: Set<T>, value: T, update: (next: Set<T>) => void) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    update(next);
  }

  const hasFilter =
    query !== '' || tierFilter.size > 0 || elementFilter.size > 0 || kindFilter.size > 0;

  const resetFilters = () => {
    setQuery('');
    setTierFilter(new Set());
    setElementFilter(new Set());
    setKindFilter(new Set());
  };

  /** 等級ごとにまとめ、各グループ内を sortKey で並べ替える */
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = skills.filter(skill => {
      if (tierFilter.size > 0 && !tierFilter.has(skill.tier)) return false;
      if (elementFilter.size > 0 && !elementFilter.has(skill.element)) return false;
      if (kindFilter.size > 0 && !skill.kinds.some(k => kindFilter.has(k))) return false;
      if (q === '') return true;
      return skill.ja.toLowerCase().includes(q) || skill.en.toLowerCase().includes(q);
    });

    const collator = new Intl.Collator(locale);
    /** 選択中の並べ替えキーでの比較（属性でまとめた中に効かせる） */
    const compareWithin = (a: Skill, b: Skill) => {
      switch (sortKey) {
        case 'cooldown':
          return a.cooldown - b.cooldown;
        case 'mp':
          return getMpAtLevel(a, level) - getMpAtLevel(b, level);
        case 'mpPerSec':
          return getMpPerSecond(a, level) - getMpPerSecond(b, level);
        default:
          return collator.compare(getSkillDisplayName(a, locale), getSkillDisplayName(b, locale));
      }
    };
    // 属性は 光 → 闇 → 火 → 水 の固定順（skillElements の並び）でまとめる
    const elementOrder = (s: Skill) => skillElements.indexOf(s.element);
    const compare = (a: Skill, b: Skill) =>
      elementOrder(a) - elementOrder(b) || compareWithin(a, b);

    return skillTiers
      .map(tier => ({ tier, items: matches.filter(s => s.tier === tier).sort(compare) }))
      .filter(group => group.items.length > 0);
  }, [query, tierFilter, elementFilter, kindFilter, sortKey, locale, level]);

  const totalCount = groups.reduce((sum, group) => sum + group.items.length, 0);

  const sortOptions: { value: SortKey; label: string }[] = [
    { value: 'name', label: t.skillCatalog.sortName },
    { value: 'cooldown', label: t.skillCatalog.sortCooldown },
    { value: 'mp', label: t.skillCatalog.sortMp },
    { value: 'mpPerSec', label: t.skillCatalog.sortMpPerSec },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ===== 絞り込み ===== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor="skill-search" className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5">
              {t.skillCatalog.search}
            </label>
            <input
              id="skill-search"
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t.skillCatalog.searchPlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
            />
          </div>
          <div className="sm:w-56">
            <label htmlFor="skill-sort" className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5">
              {t.skillCatalog.sortBy}
            </label>
            <div className="relative">
              <select
                id="skill-sort"
                value={sortKey}
                onChange={e => setSortKey(e.target.value as SortKey)}
                className="appearance-none w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none font-medium bg-white text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="sm:w-32">
            <label htmlFor="skill-level" className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5">
              {t.skillCatalog.skillLevel}
            </label>
            <input
              id="skill-level"
              type="number"
              min={1}
              value={skillLevel}
              onChange={e => setSkillLevel(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm tabular-nums"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs md:text-sm font-bold text-gray-700 sm:w-16 shrink-0">{t.skillCatalog.tier}</span>
            <div className="flex flex-wrap gap-2">
              {skillTiers.map(tier => (
                <FilterChip
                  key={tier}
                  label={skillTierNames[locale][tier]}
                  active={tierFilter.has(tier)}
                  color={skillTierColors[tier]}
                  onClick={() => toggle(tierFilter, tier, setTierFilter)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs md:text-sm font-bold text-gray-700 sm:w-16 shrink-0">{t.skillCatalog.element}</span>
            <div className="flex flex-wrap gap-2">
              {skillElements.map(element => (
                <FilterChip
                  key={element}
                  label={skillElementNames[locale][element]}
                  active={elementFilter.has(element)}
                  color={skillElementColors[element]}
                  onClick={() => toggle(elementFilter, element, setElementFilter)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs md:text-sm font-bold text-gray-700 sm:w-16 shrink-0">{t.skillCatalog.kind}</span>
            <div className="flex flex-wrap gap-2">
              {skillKinds.map(kind => (
                <FilterChip
                  key={kind}
                  label={skillKindNames[locale][kind]}
                  active={kindFilter.has(kind)}
                  onClick={() => toggle(kindFilter, kind, setKindFilter)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs md:text-sm text-gray-500 font-medium">
            {t.skillCatalog.resultCount.replace('{count}', String(totalCount))}
          </span>
          {hasFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs md:text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {t.skillCatalog.reset}
            </button>
          )}
        </div>
      </div>

      {/* ===== 等級別一覧 =====
          等級ごとに table を分けると列幅が揃わないため、1つの table に
          colgroup で幅を固定し、等級は見出し行として差し込む */}
      {groups.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500 text-sm">
          {t.skillCatalog.noResults}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-fixed min-w-[900px]">
              <colgroup>
                <col className="w-[30%]" />
                <col className="w-[8%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
                <col className="w-[10%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
              </colgroup>
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs">
                  <th className="text-left font-bold px-4 py-3">{t.skillCatalog.colName}</th>
                  <th className="text-left font-bold px-3 py-3">{t.skillCatalog.colElement}</th>
                  <th className="text-left font-bold px-3 py-3">{t.skillCatalog.colKind}</th>
                  <th className="text-left font-bold px-3 py-3">{t.skillCatalog.colTarget}</th>
                  <th className="text-right font-bold px-3 py-3">{t.skillCatalog.colCooldown}</th>
                  <th className="text-right font-bold px-3 py-3">{t.skillCatalog.colMp}</th>
                  <th className="text-right font-bold px-4 py-3">{t.skillCatalog.colMpPerSec}</th>
                </tr>
              </thead>
              {groups.map(({ tier, items }) => (
                <tbody key={tier}>
                  <tr>
                    <th
                      colSpan={7}
                      scope="colgroup"
                      className="text-left border-t border-gray-200 border-l-4 bg-gray-50/70 px-4 py-2.5"
                      style={{ borderLeftColor: skillTierColors[tier] }}
                    >
                      <span className="font-bold text-sm md:text-base" style={{ color: skillTierColors[tier] }}>
                        {skillTierNames[locale][tier]}
                      </span>
                      <span className="ml-3 text-xs font-normal text-gray-500">
                        {t.skillCatalog.resultCount.replace('{count}', String(items.length))}
                      </span>
                    </th>
                  </tr>
                  {items.map(skill => {
                    const isOpen = expanded.has(skill.id);
                    return (
                    <Fragment key={skill.id}>
                    <tr
                      className="border-t border-gray-100 hover:bg-gray-50/70 cursor-pointer"
                      onClick={() => toggleExpanded(skill.id)}
                    >
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-label={t.skillCatalog.details}
                            onClick={e => {
                              e.stopPropagation();
                              toggleExpanded(skill.id);
                            }}
                            className="shrink-0 text-gray-400 hover:text-gray-700"
                          >
                            <svg
                              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <img
                            src={skillImages[skill.id].src}
                            alt=""
                            width={32}
                            height={32}
                            loading="lazy"
                            className="w-8 h-8 shrink-0"
                          />
                          <span className="font-bold text-gray-800 leading-tight">
                            {getSkillDisplayName(skill, locale)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-3 py-2 font-medium"
                        style={{ color: skillElementColors[skill.element] }}
                      >
                        {skillElementNames[locale][skill.element]}
                      </td>
                      <td className="px-3 py-2 text-gray-600">
                        {skill.kinds.map(k => skillKindNames[locale][k]).join(' / ')}
                      </td>
                      <td className="px-3 py-2 text-gray-600">
                        {skill.targets.map(target => skillTargetNames[locale][target]).join(' / ')}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-700 tabular-nums">{skill.cooldown}s</td>
                      <td className="px-3 py-2 text-right text-gray-700 tabular-nums">
                        {getMpAtLevel(skill, level).toLocaleString()}
                        {getEffectiveLevel(skill, level) !== level && (
                          <span className="block text-[10px] text-gray-400 font-normal">
                            {t.skillCatalog.maxLevelLabel.replace(
                              '{n}',
                              String(getEffectiveLevel(skill, level)),
                            )}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right font-bold text-gray-800 tabular-nums">
                        {getMpPerSecond(skill, level).toFixed(1)}
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={7} className="p-0 border-t border-gray-100">
                          <SkillDetailPanel skill={skill} detail={skillDetails[skill.id]} locale={locale} />
                          <div className="px-4 pb-4 md:px-6 bg-blue-50/30">
                            <a
                              href={getLocalePath(`/skills/${skill.id}`, locale)}
                              className="inline-flex items-center gap-1 text-xs md:text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              {t.skillCatalog.runeTitle}
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </a>
                          </div>
                        </td>
                      </tr>
                    )}
                    </Fragment>
                    );
                  })}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      )}

      <div className="text-[10px] md:text-xs text-gray-500 space-y-1">
        <p>{t.skillCatalog.levelNote}</p>
        <p>{t.skillCatalog.mpNote}</p>
        {t.skillCatalog.jaOnlyNote && <p>{t.skillCatalog.jaOnlyNote}</p>}
        {t.skillCatalog.nameNote && <p>{t.skillCatalog.nameNote}</p>}
      </div>
    </div>
  );
}
