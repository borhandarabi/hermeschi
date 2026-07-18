import { useEffect, useMemo, useState } from 'react'

export const HERMESCHIWORLD_SETTINGS_KEY = 'hermeschiworld:settings'

export type HermesChiWorldSettings = {
  graphics: {
    renderDistance: 'low' | 'med' | 'high' | 'ultra'
    shadowQuality: 'low' | 'med' | 'high' | 'ultra'
    textureQuality: 'low' | 'med' | 'high' | 'ultra'
    antiAliasing: boolean
  }
  performance: {
    fpsCounter: boolean
    targetFps: '30' | '60' | '120' | 'uncapped'
    reducedMotion: boolean
  }
  controls: {
    mouseSensitivity: number
    invertY: boolean
    bindings: Record<string, string>
  }
  audio: {
    master: number
    music: number
    sfx: number
    ambient: number
  }
  display: {
    uiScale: number
    hudOpacity: number
    fullscreen: boolean
  }
  accessibility: {
    photosensitiveMode: boolean
  }
}

export const DEFAULT_HERMESCHIWORLD_SETTINGS: HermesChiWorldSettings = {
  graphics: {
    renderDistance: 'high',
    shadowQuality: 'high',
    textureQuality: 'high',
    antiAliasing: true,
  },
  performance: {
    fpsCounter: false,
    targetFps: '60',
    reducedMotion: false,
  },
  controls: {
    mouseSensitivity: 50,
    invertY: false,
    bindings: {
      Move: 'WASD / arrows',
      Run: 'Shift',
      Jump: 'Space',
      Crouch: 'Ctrl',
      Interact: 'E',
      Party: 'Tab',
      Inventory: 'I',
      Map: 'M',
      Skills: 'K',
      Quests: 'N',
      Character: 'C',
      Settings: 'Esc',
      Chat: 'Enter',
      Commands: '/',
      Help: '?',
    },
  },
  audio: {
    master: 100,
    music: 75,
    sfx: 80,
    ambient: 65,
  },
  display: {
    uiScale: 100,
    hudOpacity: 88,
    fullscreen: false,
  },
  accessibility: {
    photosensitiveMode: false,
  },
}

function mergeSettings(value: Partial<HermesChiWorldSettings> | null): HermesChiWorldSettings {
  return {
    ...DEFAULT_HERMESCHIWORLD_SETTINGS,
    ...value,
    graphics: { ...DEFAULT_HERMESCHIWORLD_SETTINGS.graphics, ...value?.graphics },
    performance: { ...DEFAULT_HERMESCHIWORLD_SETTINGS.performance, ...value?.performance },
    controls: {
      ...DEFAULT_HERMESCHIWORLD_SETTINGS.controls,
      ...value?.controls,
      bindings: { ...DEFAULT_HERMESCHIWORLD_SETTINGS.controls.bindings, ...value?.controls?.bindings },
    },
    audio: { ...DEFAULT_HERMESCHIWORLD_SETTINGS.audio, ...value?.audio },
    display: { ...DEFAULT_HERMESCHIWORLD_SETTINGS.display, ...value?.display },
    accessibility: { ...DEFAULT_HERMESCHIWORLD_SETTINGS.accessibility, ...value?.accessibility },
  }
}

function prefersReducedMotion() {
  try { return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches } catch { return false }
}

function withReducedMotionDefaults(settings: HermesChiWorldSettings, hasStoredSettings: boolean): HermesChiWorldSettings {
  if (!prefersReducedMotion()) return settings
  if (hasStoredSettings) return settings
  return {
    ...settings,
    performance: { ...settings.performance, reducedMotion: true },
    accessibility: { ...settings.accessibility, photosensitiveMode: true },
  }
}

export function loadHermesChiWorldSettings(): HermesChiWorldSettings {
  if (typeof window === 'undefined') return DEFAULT_HERMESCHIWORLD_SETTINGS
  try {
    const raw = window.localStorage.getItem(HERMESCHIWORLD_SETTINGS_KEY)
    return withReducedMotionDefaults(mergeSettings(raw ? JSON.parse(raw) : null), !!raw)
  } catch {
    return withReducedMotionDefaults(DEFAULT_HERMESCHIWORLD_SETTINGS, false)
  }
}

export function applyHermesChiWorldSettings(settings: HermesChiWorldSettings) {
  if (typeof document === 'undefined') return
  document.documentElement.style.setProperty('--hermeschiworld-ui-scale', String(settings.display.uiScale / 100))
  document.documentElement.style.setProperty('--hermeschiworld-hud-opacity', String(settings.display.hudOpacity / 100))
  document.documentElement.style.setProperty('--hermeschiworld-master-volume', String(settings.audio.master / 100))
  document.documentElement.style.setProperty('--hw-flash-rate', settings.accessibility.photosensitiveMode ? '0s' : '1.5s')
  document.documentElement.classList.toggle('hermeschiworld-photosensitive', settings.accessibility.photosensitiveMode)
  document.documentElement.classList.toggle('hermeschiworld-reduced-motion', settings.performance.reducedMotion)
}

export function saveHermesChiWorldSettings(settings: HermesChiWorldSettings) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(HERMESCHIWORLD_SETTINGS_KEY, JSON.stringify(settings))
  applyHermesChiWorldSettings(settings)
  window.dispatchEvent(new CustomEvent('hermeschiworld-settings-changed', { detail: settings }))
}

export function useHermesChiWorldSettings() {
  const [settings, setSettings] = useState<HermesChiWorldSettings>(() => loadHermesChiWorldSettings())

  useEffect(() => {
    applyHermesChiWorldSettings(settings)
    const onStorage = () => setSettings(loadHermesChiWorldSettings())
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<HermesChiWorldSettings>).detail
      if (detail) setSettings(detail)
    }
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const onMedia = () => {
      if (!media?.matches) return
      update((current) => ({
        ...current,
        performance: { ...current.performance, reducedMotion: true },
        accessibility: { ...current.accessibility, photosensitiveMode: true },
      }))
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('hermeschiworld-settings-changed', onChange)
    media?.addEventListener?.('change', onMedia)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('hermeschiworld-settings-changed', onChange)
      media?.removeEventListener?.('change', onMedia)
    }
  }, [settings])

  const update = useMemo(
    () => (patch: (current: HermesChiWorldSettings) => HermesChiWorldSettings) => {
      setSettings((current) => {
        const next = patch(current)
        saveHermesChiWorldSettings(next)
        return next
      })
    },
    [],
  )

  return [settings, update] as const
}
