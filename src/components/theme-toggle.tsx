import { ComputerIcon, Moon01Icon, Sun01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { SettingsThemeMode } from '@/hooks/use-settings'
import { applyTheme, useSettingsStore } from '@/hooks/use-settings'
import { cn } from '@/lib/utils'
import { t, type TranslationKey } from '@/lib/i18n'

function resolvedIsDark(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

const MODES: Array<{
  value: SettingsThemeMode
  icon: typeof ComputerIcon
  labelKey: TranslationKey
}> = [
  { value: 'system', icon: ComputerIcon, labelKey: 'themeToggle.system' },
  { value: 'light', icon: Sun01Icon, labelKey: 'themeToggle.light' },
  { value: 'dark', icon: Moon01Icon, labelKey: 'themeToggle.dark' },
]

type ThemeToggleProps = {
  /** "icon" = small icon button, "pill" = 3-way pill toggle (default) */
  variant?: 'icon' | 'pill'
}

export function ThemeToggle({ variant = 'pill' }: ThemeToggleProps) {
  const settings = useSettingsStore((state) => state.settings)
  const updateSettings = useSettingsStore((state) => state.updateSettings)
  const isDark =
    settings.theme === 'dark' ||
    (settings.theme === 'system' && resolvedIsDark())
  const currentMode = MODES.find((mode) => mode.value === settings.theme)
  const currentThemeLabel = currentMode ? t(currentMode.labelKey) : t('themeToggle.system')

  function setTheme(theme: SettingsThemeMode) {
    applyTheme(theme)
    updateSettings({ theme })
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="inline-flex size-7 items-center justify-center rounded-md text-primary-400 transition-colors hover:text-primary-700 dark:hover:text-primary-300"
        aria-label={t('themeToggle.iconAria', {
          current: currentThemeLabel,
          next: isDark ? t('themeToggle.light') : t('themeToggle.dark'),
        })}
        title={isDark ? t('themeToggle.lightMode') : t('themeToggle.darkMode')}
      >
        <HugeiconsIcon
          icon={isDark ? Sun01Icon : Moon01Icon}
          size={16}
          strokeWidth={1.5}
        />
      </button>
    )
  }

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full border border-primary-200 bg-primary-100/70 p-0.5 dark:border-primary-700 dark:bg-primary-800/80"
      role="group"
      aria-label={t('themeToggle.groupAria', { current: currentThemeLabel })}
    >
      {MODES.map((mode) => {
        const active = settings.theme === mode.value
        const modeLabel = t(mode.labelKey)
        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => setTheme(mode.value)}
            className={cn(
              'inline-flex size-7 items-center justify-center rounded-full transition-all duration-200',
              active
                ? 'bg-accent-500 text-white shadow-sm'
                : 'text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200',
            )}
            aria-label={
              active
                ? t('themeToggle.modeCurrent', { label: modeLabel })
                : t('themeToggle.mode', { label: modeLabel })
            }
            title={modeLabel}
          >
            <HugeiconsIcon icon={mode.icon} size={14} strokeWidth={1.8} />
          </button>
        )
      })}
    </div>
  )
}
