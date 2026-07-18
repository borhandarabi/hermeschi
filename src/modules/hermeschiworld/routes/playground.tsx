import { createFileRoute } from '@tanstack/react-router'
import { usePageTitle } from '@/hooks/use-page-title'
import { t } from '@/lib/i18n'
import { HermesChiWorldEmbed } from '@/modules/hermeschiworld/screens/playground/hermeschi-world-embed'

export const Route = createFileRoute('/playground')({
  ssr: false,
  component: PlaygroundRoute,
})

function PlaygroundRoute() {
  usePageTitle(t('playground.title'))
  return <HermesChiWorldEmbed />
}
