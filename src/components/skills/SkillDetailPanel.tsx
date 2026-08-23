/**
 * スキル図鑑の行を展開したときに出す詳細パネル。
 *
 * 出典が日本語wikiのみのため、効果テキストは英語ロケールでも日本語のまま表示し、
 * その旨を注記する。
 */
import type { Skill, SkillDetail } from '../../lib/skills';
import { getTranslations } from '../../i18n';
import type { Locale } from '../../i18n/types';

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-bold text-gray-500 mb-1.5">
        {title}
        {note && <span className="ml-2 font-normal text-gray-400">{note}</span>}
      </h4>
      {children}
    </div>
  );
}

export default function SkillDetailPanel({
  skill,
  detail,
  locale = 'ja',
}: {
  skill: Skill;
  detail: SkillDetail;
  locale?: Locale;
}) {
  const t = getTranslations(locale);

  return (
    <div className="px-4 py-4 md:px-6 bg-blue-50/30 space-y-4 text-sm">
      {/* 発動効果 */}
      <Section title={t.skillCatalog.effect}>
        <dl className="space-y-1.5">
          <div className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="shrink-0 w-24 font-bold text-gray-600 tabular-nums">Lv.1</dt>
            <dd className="text-gray-700 leading-relaxed">{detail.effectLv1}</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="shrink-0 w-24 font-bold text-gray-600 tabular-nums">
              Lv.{detail.maxLevel}
            </dt>
            <dd className="text-gray-700 leading-relaxed">{detail.effectMax}</dd>
          </div>
        </dl>
      </Section>

      {/* 所持効果（覚醒段階で変動） */}
      <Section title={t.skillCatalog.ownEffect} note={detail.ownEffect ? t.skillCatalog.ownEffectNote : undefined}>
        {detail.ownEffect ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-medium text-gray-700">{detail.ownEffect.label}</span>
            <div className="flex flex-wrap gap-1">
              {detail.ownEffect.values.map((v, i) => (
                <span
                  key={i}
                  className="inline-flex items-baseline gap-0.5 rounded bg-white border border-gray-200 px-1.5 py-0.5 text-xs tabular-nums"
                  title={`${i + 1}`}
                >
                  <span className="text-[10px] text-gray-400">{i + 1}</span>
                  <span className="font-bold text-gray-700">
                    {v}
                    {detail.ownEffect!.unit}
                  </span>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-xs">{t.skillCatalog.noOwnEffect}</p>
        )}
      </Section>

      {/* 覚醒効果 */}
      <Section title={t.skillCatalog.awakeningEffect}>
        <ul className="space-y-1">
          {detail.awakening.map(a => (
            <li key={a.level} className="flex flex-col sm:flex-row sm:gap-3">
              <span className="shrink-0 w-24 font-bold text-gray-600">
                {t.skillCatalog.awakeningLevel.replace('{n}', String(a.level))}
              </span>
              <span className="text-gray-700 leading-relaxed">{a.text}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 継承元（スタースキルのみ） */}
      {detail.inheritsFrom && (
        <Section title={t.skillCatalog.inheritsFrom} note={t.skillCatalog.inheritsNote}>
          <div className="flex flex-wrap gap-1.5">
            {detail.inheritsFrom.map(name => (
              <span
                key={name}
                className="rounded-lg bg-white border border-gray-200 px-2 py-1 text-xs font-medium text-gray-700"
              >
                {name}
              </span>
            ))}
          </div>
        </Section>
      )}

      <p className="sr-only">{skill.id}</p>
    </div>
  );
}
