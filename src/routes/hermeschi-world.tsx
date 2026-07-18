import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { GAME_BUILD_ENABLED, isGameRuntimeEnabled } from '@/lib/game-flag'
import { t } from '@/lib/i18n'

const HermesChiWorldLanding = GAME_BUILD_ENABLED
  ? lazy(() => import('@/modules/hermeschiworld/screens/playground/hermeschi-world-landing').then((m) => ({ default: m.HermesChiWorldLanding })))
  : null

export const Route = createFileRoute('/hermeschi-world')({
  ssr: false,
  component: HermesChiWorldRoute,
})

function HermesChiWorldRoute() {
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
      <HermesChiWorldLanding />
    </Suspense>
  )
}
