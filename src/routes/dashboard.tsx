import { createFileRoute } from '@tanstack/react-router'
import { usePageTitle } from '@/hooks/use-page-title'
import { t } from '@/lib/i18n'
import { DashboardScreen } from '@/screens/dashboard/dashboard-screen'

export const Route = createFileRoute('/dashboard')({
  ssr: false,
  component: DashboardRoute,
})

function DashboardRoute() {
  usePageTitle(t('nav.dashboard'))
  return <DashboardScreen />
}
