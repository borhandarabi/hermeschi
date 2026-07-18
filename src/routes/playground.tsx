import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { GAME_BUILD_ENABLED, isGameRuntimeEnabled } from '@/lib/game-flag'
import { t } from '@/lib/i18n'

const PlaygroundScreen = GAME_BUILD_ENABLED
  ? lazy(() => import('@/modules/hermesworld/screens/playground/hermes-world-embed').then((m) => ({ default: m.HermesWorldEmbed })))
  : null

export const Route = createFileRoute('/playground')({
  ssr: false,
  component: PlaygroundRoute,
})

function PlaygroundRoute() {
  if (!GAME_BUILD_ENABLED || !isGameRuntimeEnabled()) {
    return <GameNotAvailable />
  }
  return (
    <Suspense fallback={null}>
      <PlaygroundScreen! />
    </Suspense>
  )
}

function GameNotAvailable() {
  return (
    <main className="flex h-full items-center justify-center p-8 text-center">
      <div>
        <h1 className="text-xl font-semibold">{t('common.unavailable')}</h1>
        <p className="mt-2 text-sm text-muted">
          {t('common.featureNotEnabled')}
        </p>
      </div>
    </main>
  )
}
