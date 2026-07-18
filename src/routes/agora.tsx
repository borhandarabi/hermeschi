import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { GAME_BUILD_ENABLED, isGameRuntimeEnabled } from '@/lib/game-flag'
import { t } from '@/lib/i18n'

const AgoraScreen = GAME_BUILD_ENABLED
  ? lazy(() => import('@/modules/hermeschiworld/screens/agora/agora-screen').then((m) => ({ default: m.AgoraScreen })))
  : null

export const Route = createFileRoute('/agora')({
  ssr: false,
  component: AgoraRoute,
})

function AgoraRoute() {
  if (!GAME_BUILD_ENABLED || !isGameRuntimeEnabled()) {
    return (
      <main className="flex h-full items-center justify-center p-8 text-center">
        <div>
          <h1 className="text-xl font-semibold">{t('common.unavailable')}</h1>
        </div>
      </main>
    )
  }
  return (
    <Suspense fallback={null}>
      <AgoraScreen />
    </Suspense>
  )
}
