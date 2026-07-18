import { createFileRoute } from '@tanstack/react-router'
import { usePageTitle } from '@/hooks/use-page-title'
import { t } from '@/lib/i18n'
import { VtCapitalScreen } from '@/screens/vt-capital/vt-capital-screen'

export const Route = createFileRoute('/vt-capital')({
  ssr: false,
  component: function VtCapitalRoute() {
    usePageTitle(t('vtCapital.title'))
    return <VtCapitalScreen />
  },
})
