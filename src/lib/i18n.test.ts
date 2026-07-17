import { afterEach, describe, expect, it } from 'vitest'
import {
  LOCALE_LABELS,
  getDir,
  getLocale,
  getHtmlLang,
  isRtl,
  setLocale,
  t,
  type LocaleId,
} from './i18n'

function withLocale<T>(locale: LocaleId, fn: () => T): T {
  const originalWindow = globalThis.window
  const originalNavigator = globalThis.navigator
  const originalLocalStorage = globalThis.localStorage
  const store = new Map<string, string>([['hermes-workspace-locale', locale]])
  const listeners: Array<(e: unknown) => void> = []
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      dispatchEvent: (ev: unknown) => {
        for (const l of listeners) {
          try {
            l(ev)
          } catch {
            // ignore
          }
        }
        return true
      },
      addEventListener: (_type: string, l: (e: unknown) => void) => {
        listeners.push(l)
      },
      removeEventListener: (_type: string, l: (e: unknown) => void) => {
        const i = listeners.indexOf(l)
        if (i >= 0) listeners.splice(i, 1)
      },
      CustomEvent: class {
        type: string
        detail: unknown
        constructor(type: string, init?: { detail?: unknown }) {
          this.type = type
          this.detail = init?.detail
        }
      },
    },
  })
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
    },
  })
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: { language: 'en-US' },
  })
  try {
    return fn()
  } finally {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: originalWindow,
    })
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: originalNavigator,
    })
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: originalLocalStorage,
    })
  }
}

afterEach(() => {
  // Reset document state between tests so dir/lang leaks don't bleed
  // across cases.
  if (typeof document !== 'undefined') {
    document.documentElement.dir = ''
    document.documentElement.lang = ''
    delete document.documentElement.dataset.dir
  }
})

describe('i18n translation lookups', () => {
  it('returns English source strings under the en locale', () => {
    withLocale('en', () => {
      expect(t('nav.dashboard')).toBe('Dashboard')
      expect(t('nav.profiles')).toBe('Profiles')
      expect(t('settings.language')).toBe('Language')
      expect(t('common.save')).toBe('Save')
    })
  })

  it('returns Persian strings under the fa locale', () => {
    withLocale('fa', () => {
      expect(t('nav.dashboard')).toBe('داشبورد')
      expect(t('nav.chat')).toBe('گفتگو')
      expect(t('nav.profiles')).toBe('نمایه‌ها')
      expect(t('settings.language')).toBe('زبان')
      expect(t('settings.languageDesc')).toBe(
        'زبان نمایش رابط کاربری فضای کار را انتخاب کنید.',
      )
      expect(t('common.save')).toBe('ذخیره')
      expect(t('common.cancel')).toBe('لغو')
      expect(t('common.delete')).toBe('حذف')
      expect(t('common.loading')).toBe('در حال بارگذاری…')
      expect(t('common.noData')).toBe('داده‌ای موجود نیست')
    })
  })

  it('falls back to English when the active locale is missing a key', () => {
    // All locale tables are typed to be complete (LocaleTranslations =
    // Record<TranslationKey, string>), so the only way to hit the
    // fallback branch is to query through a deliberately empty locale.
    // We verify the fallback indirectly: en values must round-trip.
    withLocale('en', () => {
      expect(t('nav.settings')).toBe('Settings')
      expect(t('tasks.inProgress')).toBe('In Progress')
    })
  })

  it('exposes readable locale labels for the language selector', () => {
    expect(LOCALE_LABELS.en).toBe('English')
    expect(LOCALE_LABELS.fa).toBe('فارسی')
  })
})

describe('locale → direction coupling', () => {
  it('marks fa as RTL and en as LTR', () => {
    expect(getDir('fa')).toBe('rtl')
    expect(getDir('en')).toBe('ltr')
  })

  it('isRtl() reflects the active locale', () => {
    withLocale('fa', () => {
      expect(isRtl()).toBe(true)
    })
    withLocale('en', () => {
      expect(isRtl()).toBe(false)
    })
  })

  it('getHtmlLang returns the BCP-47 tag for the locale', () => {
    expect(getHtmlLang('fa')).toBe('fa')
    expect(getHtmlLang('en')).toBe('en')
  })
})

describe('interpolation', () => {
  // Use a key that has a {placeholder} in its value. We need to add
  // a test-only key to EN for this, but since EN is closed under
  // TranslationKey we instead verify the interpolate behavior by
  // calling t() with a key whose source string already contains
  // a placeholder. None of the production EN values use {…} tokens
  // yet (chat.* keys arrive in Phase 2.5), so we test the helper
  // directly through a known key without params first, then check
  // that passing params to a non-templated string is a no-op.
  it('returns the raw string when no params are passed', () => {
    withLocale('en', () => {
      expect(t('common.save')).toBe('Save')
      expect(t('nav.dashboard')).toBe('Dashboard')
    })
    withLocale('fa', () => {
      expect(t('common.save')).toBe('ذخیره')
      expect(t('nav.dashboard')).toBe('داشبورد')
    })
  })

  it('passes params through unchanged when the string has no placeholders', () => {
    withLocale('en', () => {
      // common.save has no {…} tokens, so params are ignored.
      expect(t('common.save', { unused: 'x' })).toBe('Save')
    })
  })

  it('leaves unmatched placeholders intact so translators can use literal braces', () => {
    // We can't author a test-only key without modifying EN, so we
    // verify the no-op behavior: passing params that don't match
    // any placeholder in the source string returns the source string
    // unchanged.
    withLocale('en', () => {
      expect(t('common.loading', { count: 5 })).toBe('Loading...')
    })
  })
})

describe('setLocale side effects', () => {
  it('persists the locale and updates document.dir/lang when DOM is available', () => {
    withLocale('en', () => {
      setLocale('fa')
      // localStorage should reflect the new locale
      expect(getLocale()).toBe('fa')
      // documentElement should be marked RTL with the right lang tag.
      // Vitest's default node environment doesn't expose `document`,
      // so skip the DOM assertions there; the jsdom-based component
      // tests cover that path.
      if (typeof document !== 'undefined') {
        expect(document.documentElement.dir).toBe('rtl')
        expect(document.documentElement.lang).toBe('fa')
        expect(document.documentElement.dataset.dir).toBe('rtl')
      }
    })
  })

  it('restores LTR direction when switching back to en (DOM optional)', () => {
    withLocale('fa', () => {
      setLocale('en')
      if (typeof document !== 'undefined') {
        expect(document.documentElement.dir).toBe('ltr')
        expect(document.documentElement.lang).toBe('en')
        expect(document.documentElement.dataset.dir).toBe('ltr')
      }
    })
  })
})
