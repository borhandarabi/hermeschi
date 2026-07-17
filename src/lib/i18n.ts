/**
 * Lightweight i18n — UI string translations for Hermes Workspace.
 *
 * Supported locales:
 *   - en  (English)        — source of truth, LTR
 *   - fa  (Persian / فارسی) — RTL
 *
 * Adding a new locale:
 *   1. Add its id to `LocaleId`.
 *   2. Add it to `RTL_LOCALES` if it renders right-to-left.
 *   3. Author a translation table that satisfies `LocaleTranslations`
 *      (every key in `EN` must be present).
 *   4. Register it in `LOCALES` and `LOCALE_LABELS`.
 */

export type LocaleId = 'en' | 'fa'

const EN = {
  // ── Nav ──────────────────────────────────────────────────────────────
  'nav.dashboard': 'Dashboard',
  'nav.chat': 'Chat',
  'nav.files': 'Files',
  'nav.terminal': 'Terminal',
  'nav.jobs': 'Jobs',
  'nav.tasks': 'Tasks',
  'nav.memory': 'Memory',
  'nav.skills': 'Skills',
  'nav.profiles': 'Profiles',
  'nav.settings': 'Settings',
  'nav.agents': 'Agents',
  'nav.swarm': 'Swarm',
  'nav.gateway': 'Gateway',
  'nav.playground': 'Playground',
  'nav.agora': 'Agora',
  'nav.echoStudio': 'Echo Studio',
  'nav.mcp': 'MCP',
  'nav.crew': 'Crew',
  // ── Skills ───────────────────────────────────────────────────────────
  'skills.installed': 'Installed',
  'skills.marketplace': 'Marketplace',
  'skills.search': 'Search by name, tags, or description',
  'skills.noResults': 'No skills found',
  // ── Profiles ─────────────────────────────────────────────────────────
  'profiles.profiles': 'Profiles',
  'profiles.monitoring': 'Monitoring',
  // ── Tasks ────────────────────────────────────────────────────────────
  'tasks.title': 'Tasks',
  'tasks.newTask': 'New Task',
  'tasks.backlog': 'Backlog',
  'tasks.todo': 'Todo',
  'tasks.inProgress': 'In Progress',
  'tasks.review': 'Review',
  'tasks.done': 'Done',
  // ── Jobs ─────────────────────────────────────────────────────────────
  'jobs.title': 'Jobs',
  'jobs.newJob': 'New Job',
  // ── Settings ─────────────────────────────────────────────────────────
  'settings.title': 'Settings',
  'settings.language': 'Language',
  'settings.languageDesc': 'Choose the display language for the workspace UI.',
  // ── Common ───────────────────────────────────────────────────────────
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.search': 'Search',
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.noData': 'No data',
  'common.close': 'Close',
  'common.retry': 'Retry',
  'common.refresh': 'Refresh',
  'common.copy': 'Copy',
  'common.copied': 'Copied',
  'common.reset': 'Reset',
  'common.confirm': 'Confirm',
  'common.apply': 'Apply',
  'common.ok': 'OK',
  'common.yes': 'Yes',
  'common.no': 'No',
  'common.back': 'Back',
  'common.next': 'Next',
  'common.previous': 'Previous',
  'common.done': 'Done',
  'common.edit': 'Edit',
  'common.rename': 'Rename',
  'common.share': 'Share',
  'common.export': 'Export',
  'common.import': 'Import',
  'common.download': 'Download',
  'common.upload': 'Upload',
  'common.add': 'Add',
  'common.remove': 'Remove',
  'common.clear': 'Clear',
  'common.selectAll': 'Select all',
  'common.deselectAll': 'Deselect all',
  'common.more': 'More',
  'common.less': 'Less',
  'common.expand': 'Expand',
  'common.collapse': 'Collapse',
  'common.enable': 'Enable',
  'common.disable': 'Disable',
  'common.required': 'Required',
  'common.optional': 'Optional',
  'common.unknown': 'Unknown',
  'common.continue': 'Continue',
  'common.skip': 'Skip',
  'common.finish': 'Finish',
  'common.disconnected': 'Disconnected',
  'common.reconnecting': 'Reconnecting...',
  'common.online': 'Online',
  'common.offline': 'Offline',
  'common.unsavedChanges': 'Unsaved changes',
  'common.saving': 'Saving...',
  'common.saved': 'Saved',
} as const

export type TranslationKey = keyof typeof EN
type LocaleTranslations = Record<TranslationKey, string>

/**
 * Persian (Farsi) translation table.
 *
 * Covers all keys defined in `EN`. Strings are written in the standard
 * Iranian Persian register, with Persian digits used only where a
 * locale-aware number formatter would render the same way (we keep
 * ASCII digits inside technical/code-style strings to avoid breaking
 * copy-paste of identifiers).
 *
 * Note: Persian is right-to-left; the layout engine relies on
 * `getDir('fa') === 'rtl'` to flip the document direction.
 */
const FA: LocaleTranslations = {
  // ── Nav ──────────────────────────────────────────────────────────────
  'nav.dashboard': 'داشبورد',
  'nav.chat': 'گفتگو',
  'nav.files': 'پرونده‌ها',
  'nav.terminal': 'ترمینال',
  'nav.jobs': 'کارها',
  'nav.tasks': 'وظایف',
  'nav.memory': 'حافظه',
  'nav.skills': 'مهارت‌ها',
  'nav.profiles': 'نمایه‌ها',
  'nav.settings': 'تنظیمات',
  'nav.agents': 'عامل‌ها',
  'nav.swarm': 'گردان',
  'nav.gateway': 'دروازه',
  'nav.playground': 'زمین بازی',
  'nav.agora': 'آگورا',
  'nav.echoStudio': 'استودیو اکو',
  'nav.mcp': 'MCP',
  'nav.crew': 'تیم',
  // ── Skills ───────────────────────────────────────────────────────────
  'skills.installed': 'نصب‌شده',
  'skills.marketplace': 'بازار',
  'skills.search': 'جستجو بر اساس نام، برچسب یا توضیح',
  'skills.noResults': 'مهارتی یافت نشد',
  // ── Profiles ─────────────────────────────────────────────────────────
  'profiles.profiles': 'نمایه‌ها',
  'profiles.monitoring':'پایش',
  // ── Tasks ────────────────────────────────────────────────────────────
  'tasks.title': 'وظایف',
  'tasks.newTask': 'وظیفهٔ تازه',
  'tasks.backlog': 'انباشته',
  'tasks.todo': 'در انتظار',
  'tasks.inProgress': 'در حال انجام',
  'tasks.review': 'بازبینی',
  'tasks.done': 'انجام‌شده',
  // ── Jobs ─────────────────────────────────────────────────────────────
  'jobs.title': 'کارها',
  'jobs.newJob': 'کارِ تازه',
  // ── Settings ─────────────────────────────────────────────────────────
  'settings.title': 'تنظیمات',
  'settings.language': 'زبان',
  'settings.languageDesc': 'زبان نمایش رابط کاربری فضای کار را انتخاب کنید.',
  // ── Common ───────────────────────────────────────────────────────────
  'common.save': 'ذخیره',
  'common.cancel': 'لغو',
  'common.delete': 'حذف',
  'common.search': 'جستجو',
  'common.loading': 'در حال بارگذاری…',
  'common.error': 'خطا',
  'common.noData': 'داده‌ای موجود نیست',
  'common.close': 'بستن',
  'common.retry': 'تلاش دوباره',
  'common.refresh': 'بازه‌گذاری',
  'common.copy': 'رونوشت',
  'common.copied': 'رونوشت شد',
  'common.reset': 'بازنشانی',
  'common.confirm': 'تأیید',
  'common.apply': 'اعمال',
  'common.ok': 'تأیید',
  'common.yes': 'بله',
  'common.no': 'خیر',
  'common.back': 'بازگشت',
  'common.next': 'بعدی',
  'common.previous': 'قبلی',
  'common.done': 'انجام شد',
  'common.edit': 'ویرایش',
  'common.rename': 'تغییر نام',
  'common.share': 'هم‌رسانی',
  'common.export': 'برون‌ریزی',
  'common.import': 'درون‌ریزی',
  'common.download': 'دانلود',
  'common.upload': 'بارگذاری',
  'common.add': 'افزودن',
  'common.remove': 'حذف',
  'common.clear': 'پاک‌سازی',
  'common.selectAll': 'گزینش همه',
  'common.deselectAll': 'لغو گزینش همه',
  'common.more': 'بیشتر',
  'common.less': 'کمتر',
  'common.expand': 'گسترش',
  'common.collapse': 'جمع‌کردن',
  'common.enable': 'فعال‌سازی',
  'common.disable': 'غیرفعال‌سازی',
  'common.required': 'الزامی',
  'common.optional': 'اختیاری',
  'common.unknown': 'نامشخص',
  'common.continue': 'ادامه',
  'common.skip': 'رد شدن',
  'common.finish': 'پایان',
  'common.disconnected': 'قطع ارتباط',
  'common.reconnecting': 'در حال اتصال مجدد…',
  'common.online': 'برخط',
  'common.offline': 'برون‌خط',
  'common.unsavedChanges': 'تغییرات ذخیره‌نشده',
  'common.saving': 'در حال ذخیره…',
  'common.saved': 'ذخیره شد',
}

const LOCALES: Record<LocaleId, LocaleTranslations> = {
  en: EN,
  fa: FA,
}

export const LOCALE_LABELS: Record<LocaleId, string> = {
  en: 'English',
  fa: 'فارسی',
}

const STORAGE_KEY = 'hermes-workspace-locale'

/**
 * Set of locale IDs that render right-to-left.
 * Currently only Persian (fa) is RTL in this app.
 */
const RTL_LOCALES: ReadonlySet<LocaleId> = new Set<LocaleId>(['fa'])

/**
 * Returns the text direction ('rtl' or 'ltr') for a given locale.
 * Used by `applyDocumentDir` and any component that needs to know the
 * active direction without touching the DOM.
 */
export function getDir(locale: LocaleId): 'rtl' | 'ltr' {
  return RTL_LOCALES.has(locale) ? 'rtl' : 'ltr'
}

/**
 * Returns the BCP-47 language tag to use on <html lang="..."> for a
 * given locale ID. Persian maps to 'fa' (covers both Iran and Dari);
 * all other locales map to their own ID directly.
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
 * document root. Safe to call during the inline bootstrap script that
 * runs before React hydrates — `typeof document !== 'undefined'`
 * guards against SSR.
 *
 * This is the single source of truth for `dir` and `lang` on <html>.
 * Components should NOT set `dir` themselves; they should rely on the
 * value propagated from here.
 */
export function applyDocumentDir(locale: LocaleId): void {
  if (typeof document === 'undefined') return
  const dir = getDir(locale)
  const lang = getHtmlLang(locale)
  const html = document.documentElement
  html.dir = dir
  html.lang = lang
  // Tag the root with a data attribute so CSS can target RTL/LTR
  // contexts even when Tailwind's rtl:/ltr: variants are not enough
  // (e.g. for @keyframes animations that need to flip).
  html.dataset.dir = dir
}

export function setLocale(id: LocaleId): void {
  localStorage.setItem(STORAGE_KEY, id)
  applyDocumentDir(id)
  window.dispatchEvent(new CustomEvent('locale-change', { detail: id }))
}

/**
 * Returns true when the active locale renders right-to-left.
 * Convenience wrapper for components that need a boolean.
 */
export function isRtl(): boolean {
  return getDir(getLocale()) === 'rtl'
}

/**
 * Parameters that can be substituted into a translation string.
 *
 * Values may be strings or numbers. Numbers are stringified via
 * `String(value)` (NOT `Intl.NumberFormat`) so callers control locale-
 * aware digit rendering — most call sites want ASCII digits even under
 * Persian, since mixed Latin/Persian numerals look inconsistent.
 *
 * Example:
 *   t('chat.unreadCount', { count: 5 })
 *   // EN: '{count} unread messages' → '5 unread messages'
 *   // FA: '{count} پیام خوانده‌نشده' → '5 پیام خوانده‌نشده'
 */
export type TranslationParams = Record<string, string | number>

/**
 * Replace {placeholder} tokens in a translation string with the
 * corresponding values from `params`. Tokens that have no matching
 * key in `params` are left untouched so translators can include
 * literal curly braces in copy if needed.
 *
 * This is intentionally a minimal interpolation engine — no conditionals,
 * no pluralization, no ICU MessageFormat. Plurals are handled at the
 * call site by choosing a different key based on the count (e.g.
 * 'chat.unreadCount.one' vs 'chat.unreadCount.many'); this keeps the
 * i18n module small and avoids pulling in a runtime dependency.
 */
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
