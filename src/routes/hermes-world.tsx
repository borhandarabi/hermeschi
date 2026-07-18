import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { GAME_BUILD_ENABLED, isGameRuntimeEnabled } from '@/lib/game-flag'
import { t } from '@/lib/i18n'

const HermesWorldLanding = GAME_BUILD_ENABLED
  ? lazy(() => import('@/modules/hermesworld/screens/playground/hermes-world-landing').then((m) => ({ default: m.HermesWorldLanding })))
  : null

export const Route = createFileRoute('/hermes-world')({
  ssr: false,
  component: HermesWorldRoute,
})

function HermesWorldRoute() {
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
      <HermesWorldLanding! />
    </Suspense>
  )
}
