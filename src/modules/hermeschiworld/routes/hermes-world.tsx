import { createFileRoute } from '@tanstack/react-router'
import { usePageTitle } from '@/hooks/use-page-title'
import { t } from '@/lib/i18n'
import { HermesChiWorldLanding } from '@/modules/hermeschiworld/screens/playground/hermeschi-world-landing'

export const Route = createFileRoute('/hermeschi-world')({
  ssr: false,
  component: HermesChiWorldRoute,
})

function HermesChiWorldRoute() {
  usePageTitle(t('hermesChiWorld.title'))
  return <HermesChiWorldLanding />
}
