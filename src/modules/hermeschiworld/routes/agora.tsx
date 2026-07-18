import { createFileRoute } from '@tanstack/react-router'
import { usePageTitle } from '@/hooks/use-page-title'
import { t } from '@/lib/i18n'
import { AgoraScreen } from '@/modules/hermeschiworld/screens/agora/agora-screen'

export const Route = createFileRoute('/agora')({
  ssr: false,
  component: AgoraRoute,
})

function AgoraRoute() {
  usePageTitle(t('agora.title'))
  return <AgoraScreen />
}
