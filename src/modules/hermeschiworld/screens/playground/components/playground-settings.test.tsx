/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SHORTCUTS, shouldToggleKeyboardHelp } from './keyboard-shortcuts-overlay'
import { DEFAULT_HERMESCHIWORLD_SETTINGS, loadHermesChiWorldSettings, saveHermesChiWorldSettings } from './hermeschiworld-settings'

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.style.removeProperty('--hermeschiworld-ui-scale')
  document.documentElement.style.removeProperty('--hermeschiworld-hud-opacity')
  document.documentElement.style.removeProperty('--hw-flash-rate')
  document.documentElement.className = ''
})

describe('HermesChiWorld keyboard shortcut handling', () => {
  it('maps help, jump, crouch, and settings shortcuts', () => {
    const entries = new Map(SHORTCUTS)
    expect(entries.get('?')).toBe('playground.shortcuts.actionHelp')
    expect(entries.get('Space')).toBe('playground.shortcuts.actionJump')
    expect(entries.get('Ctrl')).toBe('playground.shortcuts.actionCrouch')
    expect(entries.get('Esc')).toBe('playground.shortcuts.actionSettings')
  })

  it('toggles help on ? but ignores form fields', () => {
    expect(shouldToggleKeyboardHelp({ key: '?', shiftKey: false, target: window })).toBe(true)
    const input = document.createElement('input')
    expect(shouldToggleKeyboardHelp({ key: '?', shiftKey: false, target: input })).toBe(false)
  })
})

describe('HermesChiWorld settings persistence', () => {
  it('persists settings to localStorage and applies runtime variables', () => {
    saveHermesChiWorldSettings({
      ...DEFAULT_HERMESCHIWORLD_SETTINGS,
      performance: { ...DEFAULT_HERMESCHIWORLD_SETTINGS.performance, fpsCounter: true },
      display: { ...DEFAULT_HERMESCHIWORLD_SETTINGS.display, uiScale: 125, hudOpacity: 72 },
      accessibility: { photosensitiveMode: true },
    })

    const stored = JSON.parse(window.localStorage.getItem('hermeschiworld:settings') || '{}')
    expect(stored.display.uiScale).toBe(125)
    expect(stored.display.hudOpacity).toBe(72)
    expect(stored.performance.fpsCounter).toBe(true)
    expect(stored.accessibility.photosensitiveMode).toBe(true)
    expect(document.documentElement.style.getPropertyValue('--hermeschiworld-ui-scale')).toBe('1.25')
    expect(document.documentElement.style.getPropertyValue('--hermeschiworld-hud-opacity')).toBe('0.72')
    expect(document.documentElement.style.getPropertyValue('--hw-flash-rate')).toBe('0s')
    expect(document.documentElement.classList.contains('hermeschiworld-photosensitive')).toBe(true)
  })

  it('defaults photosensitive mode and reduced motion from prefers-reduced-motion on first load', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
    })

    const settings = loadHermesChiWorldSettings()
    expect(settings.performance.reducedMotion).toBe(true)
    expect(settings.accessibility.photosensitiveMode).toBe(true)
  })
})
