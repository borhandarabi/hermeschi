import { createFileRoute } from '@tanstack/react-router'
import { usePageTitle } from '@/hooks/use-page-title'
import { t } from '@/lib/i18n'
import { HermesWorldLanding } from '@/screens/playground/hermes-world-landing'

export const Route = createFileRoute('/hermes-world')({
  ssr: false,
  component: HermesWorldRoute,
})

function HermesWorldRoute() {
  usePageTitle(t('hermesWorld.title'))
  return <HermesWorldLanding />
}
