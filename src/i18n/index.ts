import type { Locale, Translations } from './types';
import { ja } from './ja';
import { en } from './en';

export type { Locale, Translations };

/** デフォルトロケール */
export const defaultLocale: Locale = 'ja';

/** 対応ロケール一覧 */
export const locales: Locale[] = ['ja', 'en'];

const translations: Record<Locale, Translations> = { ja, en };

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations.ja;
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (locales.includes(lang as Locale) && lang !== defaultLocale) return lang as Locale;
  return defaultLocale;
}

export function getLocalePath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path}`;
}

export function getAlternatePath(currentPath: string, targetLocale: Locale): string {
  // Remove any locale prefix (e.g. /en/weapons/ → /weapons/)
  const nonDefault = locales.filter(l => l !== defaultLocale);
  const strippedPath = currentPath.replace(new RegExp(`^/(${nonDefault.join('|')})(\\/|$)`), '/');
  const basePath = strippedPath || '/';
  if (targetLocale === defaultLocale) return basePath;
  return `/${targetLocale}${basePath === '/' ? '' : basePath}`;
}
