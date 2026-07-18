import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { t, type TranslationKey } from '@/lib/i18n'
import { GAME_BUILD_ENABLED } from '@/lib/game-flag'

export type SettingsNavId =
  | 'connection'
  | 'claude'
  | 'agent'
  | 'voice'
  | 'display'
  | 'appearance'
  | 'chat'
  | 'notifications'
  | 'language'
  | 'game'

type NavItem = { id: SettingsNavId; labelKey: TranslationKey }

export const SETTINGS_NAV_ITEMS: Array<NavItem> = [
  { id: 'connection', labelKey: 'settingsSidebar.connection' },
  { id: 'claude', labelKey: 'settingsSidebar.claude' },
  { id: 'agent', labelKey: 'settingsSidebar.agent' },
  { id: 'voice', labelKey: 'settingsSidebar.voice' },
  { id: 'display', labelKey: 'settingsSidebar.display' },
  { id: 'appearance', labelKey: 'settingsSidebar.appearance' },
  { id: 'chat', labelKey: 'settingsSidebar.chat' },
  { id: 'notifications', labelKey: 'settingsSidebar.notifications' },
  { id: 'language', labelKey: 'settingsSidebar.language' },
  // Game section only shows when build-time flag is enabled
  ...(GAME_BUILD_ENABLED ? [{ id: 'game' as const, labelKey: 'settingsSidebar.game' as TranslationKey }] : []),
]

type ItemRendererArgs = {
  item: NavItem
  isActive: boolean
  activeClass: string
  inactiveClass: string
  indicator: React.ReactNode
}

function renderItem({
  item,
  isActive,
  activeClass,
  inactiveClass,
  indicator,
}: ItemRendererArgs) {
  const className = cn(
    'relative rounded-lg px-3 py-2 text-left text-sm transition-colors',
    isActive ? activeClass : inactiveClass,
  )
  const content = (
    <>
      {isActive ? indicator : null}
      {t(item.labelKey)}
    </>
  )
  return (
    <Link
      key={item.id}
      to="/settings"
      search={{ section: item.id }}
      className={className}
    >
      {content}
    </Link>
  )
}

export function SettingsSidebar({ activeId }: { activeId: SettingsNavId }) {
  const activeClass =
    'bg-[var(--theme-accent-subtle)] text-[var(--theme-accent)] font-semibold'
  const inactiveClass =
    'text-primary-600 hover:bg-primary-100 hover:text-primary-900'
  const indicator = (
    <span
      aria-hidden
      className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--theme-accent)]"
    />
  )

  return (
    <nav className="hidden w-48 shrink-0 md:block">
      <div className="sticky top-8">
        <h1 className="mb-4 px-3 text-lg font-semibold text-primary-900">
          {t('settingsSidebar.title')}
        </h1>
        <div className="flex flex-col gap-0.5">
          {SETTINGS_NAV_ITEMS.map((item) =>
            renderItem({
              item,
              isActive: activeId === item.id,
              activeClass,
              inactiveClass,
              indicator,
            }),
          )}
        </div>
      </div>
    </nav>
  )
}

export function SettingsMobilePills({ activeId }: { activeId: SettingsNavId }) {
  const activeClass =
    'bg-[var(--theme-accent)] text-[var(--theme-bg)] font-semibold'
  const inactiveClass =
    'bg-primary-100 text-primary-600 hover:bg-primary-200'
  return (
    <div className="scrollbar-none flex gap-1.5 overflow-x-auto pb-2 md:hidden">
      {SETTINGS_NAV_ITEMS.map((item) => {
        const isActive = activeId === item.id
        const className = cn(
          'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
          isActive ? activeClass : inactiveClass,
        )
        return (
          <Link
            key={item.id}
            to="/settings"
            search={{ section: item.id }}
            className={className}
          >
            {t(item.labelKey)}
          </Link>
        )
      })}
    </div>
  )
}
