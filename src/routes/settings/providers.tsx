import { createFileRoute } from '@tanstack/react-router'
import { usePageTitle } from '@/hooks/use-page-title'
import { t } from '@/lib/i18n'
import { ProvidersScreen } from '@/screens/settings/providers-screen'

export const Route = createFileRoute('/settings/providers')({
  ssr: false,
  component: function SettingsProvidersRoute() {
    usePageTitle(t('settings.providerSetup.title'))
    return <ProvidersScreen />
  },
})
