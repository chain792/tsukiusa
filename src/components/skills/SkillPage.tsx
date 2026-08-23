/**
 * スキル個別ページの本体。
 * 一覧の展開パネルと同じ内容に、スキルルーンの一覧・期待値計算を加えたもの。
 */
import {
  skills,
  skillDetails,
  skillImages,
  skillTierNames,
  skillElementNames,
  skillKindNames,
  skillTargetNames,
  skillTierColors,
  skillElementColors,
  getSkillDisplayName,
  getMpAtLevel,
} from '../../lib/skills';
import { getTranslations, getLocalePath } from '../../i18n';
import type { Locale } from '../../i18n/types';
import SkillDetailPanel from './SkillDetailPanel';
import RuneCalculator from './RuneCalculator';

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] md:text-xs text-gray-500">{label}</dt>
      <dd className="text-sm font-bold text-gray-800">{value}</dd>
    </div>
  );
}

export default function SkillPage({ skillId, locale = 'ja' }: { skillId: string; locale?: Locale }) {
  const t = getTranslations(locale);
  const skill = skills.find(s => s.id === skillId);
  if (!skill) return null;
  const detail = skillDetails[skill.id];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <a
        href={getLocalePath('/skills', locale)}
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        {t.skillCatalog.backToList}
      </a>

      {/* 見出し */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="flex items-start gap-4">
          <img
            src={skillImages[skill.id].src}
            alt=""
            width={64}
            height={64}
            className="w-14 h-14 md:w-16 md:h-16 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className="inline-block px-2 py-0.5 rounded text-white text-[11px] font-bold"
                style={{ backgroundColor: skillTierColors[skill.tier] }}
              >
                {skillTierNames[locale][skill.tier]}
              </span>
              <span className="text-sm font-bold" style={{ color: skillElementColors[skill.element] }}>
                {skillElementNames[locale][skill.element]}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {getSkillDisplayName(skill, locale)}
            </h1>
          </div>
        </div>

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
          <Stat label={t.skillCatalog.colKind} value={skill.kinds.map(k => skillKindNames[locale][k]).join(' / ')} />
          <Stat
            label={t.skillCatalog.colTarget}
            value={skill.targets.map(x => skillTargetNames[locale][x]).join(' / ')}
          />
          <Stat label={t.skillCatalog.colCooldown} value={`${skill.cooldown}s`} />
          <Stat
            label={`${t.skillCatalog.colMp} (Lv.${detail.maxLevel})`}
            value={getMpAtLevel(skill, detail.maxLevel).toLocaleString()}
          />
        </dl>
      </div>

      {/* 詳細（一覧の展開パネルを再利用） */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SkillDetailPanel skill={skill} detail={detail} locale={locale} />
      </div>

      {/* スキルルーン */}
      <RuneCalculator skillId={skill.id} locale={locale} />

      <div className="text-[10px] md:text-xs text-gray-500 space-y-1">
        {t.skillCatalog.jaOnlyNote && <p>{t.skillCatalog.jaOnlyNote}</p>}
        {t.skillCatalog.nameNote && <p>{t.skillCatalog.nameNote}</p>}
      </div>
    </div>
  );
}
