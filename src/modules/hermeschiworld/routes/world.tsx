import { createFileRoute } from '@tanstack/react-router'
import { usePageTitle } from '@/hooks/use-page-title'
import { t } from '@/lib/i18n'
import { HermesChiWorldLanding } from '@/modules/hermeschiworld/screens/playground/hermeschi-world-landing'

export const Route = createFileRoute('/world')({
  ssr: false,
  component: WorldRoute,
})

function WorldRoute() {
  usePageTitle(t('hermesChiWorld.title'))
  return <HermesChiWorldLanding />
}
