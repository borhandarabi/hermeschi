import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { GAME_BUILD_ENABLED, isGameRuntimeEnabled } from '@/lib/game-flag'

const HermesWorldLanding = GAME_BUILD_ENABLED
  ? lazy(() => import('@/modules/hermesworld/screens/playground/hermes-world-landing').then((m) => ({ default: m.HermesWorldLanding })))
  : null

export const Route = createFileRoute('/world')({
  ssr: false,
  component: WorldRoute,
})

function WorldRoute() {
  if (!GAME_BUILD_ENABLED || !isGameRuntimeEnabled()) {
    return <main className="flex h-full items-center justify-center p-8" />
  }
  return (
    <Suspense fallback={null}>
      <HermesWorldLanding! />
    </Suspense>
  )
}
