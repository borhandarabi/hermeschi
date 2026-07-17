/**
 * useLocaleDirection — reactive hook for locale + document direction.
 *
 * Why this hook exists:
 * ---------------------
 * The i18n module (src/lib/i18n.ts) reads the locale synchronously via
 * `getLocale()` on every `t()` call. That works for one-shot lookups,
 * but components that need to re-render when the user switches locale
 * (e.g. to swap a flag icon, or to recalculate a layout that depends
 * on direction) need a reactive signal.
 *
 * `setLocale()` dispatches a `locale-change` CustomEvent on `window`
 * after updating localStorage and `document.dir`. This hook subscribes
 * to that event and exposes the current locale + direction as state.
 *
 * What it does NOT do:
 * - It does not call setLocale() — that's the settings dialog's job.
 * - It does not set document.dir itself — that's done by setLocale()
 *   via applyDocumentDir() and by the pre-hydration themeScript.
 *
 * Usage:
 *   const { locale, dir, isRtl } = useLocaleDirection()
 *   if (isRtl) { ... render a mirrored layout ... }
 */

import { useEffect, useState } from 'react'
import {
  getDir,
  getLocale,
  type LocaleId,
} from '@/lib/i18n'

export interface LocaleDirection {
  /** The currently active locale id ('en' | 'fa'). */
  locale: LocaleId
  /** The text direction for the active locale ('rtl' | 'ltr'). */
  dir: 'rtl' | 'ltr'
  /** Convenience boolean: true when dir === 'rtl'. */
  isRtl: boolean
}

export function useLocaleDirection(): LocaleDirection {
  const [locale, setLocaleState] = useState<LocaleId>(() => getLocale())

  useEffect(() => {
    // Re-sync on mount in case the locale changed between the initial
    // useState() read and this effect running (rare, but possible during
    // fast-refresh or HMR).
    setLocaleState(getLocale())

    const handleLocaleChange = (event: Event) => {
      const detail = (event as CustomEvent<LocaleId>).detail
      if (detail) {
        setLocaleState(detail)
      } else {
        // Fallback for events without a detail payload — re-read from
        // localStorage so we're never stale.
        setLocaleState(getLocale())
      }
    }

    // Also listen for `storage` events so locale changes in other tabs
    // propagate to this one. The pre-hydration themeScript does NOT
    // dispatch a locale-change event, so cross-tab sync requires this.
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'hermes-workspace-locale') {
        setLocaleState(getLocale())
      }
    }

    window.addEventListener('locale-change', handleLocaleChange)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('locale-change', handleLocaleChange)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const dir = getDir(locale)
  return { locale, dir, isRtl: dir === 'rtl' }
}
