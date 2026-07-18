/**
 * Lightweight i18n — UI string translations for the workspace.
 *
 * Supported locales:
 *   - en  (English)        — source of truth, LTR
 *   - fa  (Persian / فارسی) — RTL
 *
 * Translation tables live in separate files:
 *   - ./en.ts  — English source keys (defines TranslationKey)
 *   - ./fa.ts  — Persian translations
 *
 * Adding a new locale:
 *   1. Add its id to `LocaleId`.
 *   2. Add it to `RTL_LOCALES` if it renders right-to-left.
 *   3. Author a translation table that satisfies `LocaleTranslations`
 *      (every key in `EN` must be present).
 *   4. Register it in `LOCALES` and `LOCALE_LABELS`.
 */

import { EN, type TranslationKey } from './en'
import { FA } from './fa'

export type LocaleId = 'en' | 'fa'

export type { TranslationKey }
export type LocaleTranslations = Record<TranslationKey, string>

const LOCALES: Record<LocaleId, LocaleTranslations> = {
  en: EN,
  fa: FA,
}

export const LOCALE_LABELS: Record<LocaleId, string> = {
  en: 'English',
  fa: 'فارسی',
}

const STORAGE_KEY = 'hermeschi-locale'

/**
 * Set of locale IDs that render right-to-left.
 * Currently only Persian (fa) is RTL in this app.
 */
const RTL_LOCALES: ReadonlySet<LocaleId> = new Set<LocaleId>(['fa'])

/**
 * Returns the text direction ('rtl' or 'ltr') for a given locale.
 */
export function getDir(locale: LocaleId): 'rtl' | 'ltr' {
  return RTL_LOCALES.has(locale) ? 'rtl' : 'ltr'
}

/**
 * Returns the BCP-47 language tag to use on <html lang="...">.
 */
export function getHtmlLang(locale: LocaleId): string {
  return locale
}

export function getLocale(): LocaleId {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && stored in LOCALES) return stored as LocaleId
  const full = navigator.language
  if (full in LOCALES) return full as LocaleId
  const lang = full.split('-')[0]
  if (lang in LOCALES) return lang as LocaleId
  return 'en'
}

/**
 * Apply the locale's text direction and BCP-47 language tag to the
 * document root. Safe to call during the inline bootstrap script.
 */
export function applyDocumentDir(locale: LocaleId): void {
  if (typeof document === 'undefined') return
  const dir = getDir(locale)
  const lang = getHtmlLang(locale)
  const html = document.documentElement
  html.dir = dir
  html.lang = lang
  html.dataset.dir = dir
}

export function setLocale(id: LocaleId): void {
  localStorage.setItem(STORAGE_KEY, id)
  applyDocumentDir(id)
  window.dispatchEvent(new CustomEvent('locale-change', { detail: id }))
}

/**
 * Returns true when the active locale renders right-to-left.
 */
export function isRtl(): boolean {
  return getDir(getLocale()) === 'rtl'
}

export type TranslationParams = Record<string, string | number>

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = params[key]
    return value === undefined || value === null ? match : String(value)
  })
}

export function t(key: TranslationKey, params?: TranslationParams): string {
  const locale = getLocale()
  const raw = LOCALES[locale]?.[key] ?? LOCALES.en[key] ?? key
  return interpolate(raw, params)
}

// Re-export EN and FA for consumers that need direct access
export { EN, FA }
