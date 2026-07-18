import { createFileRoute } from '@tanstack/react-router'
import { GAME_BUILD_ENABLED, isGameRuntimeEnabled } from '@/lib/game-flag'

export const Route = createFileRoute('/reserve')({
  ssr: false,
  component: ReserveRoute,
})

function ReserveRoute() {
  if (!GAME_BUILD_ENABLED || !isGameRuntimeEnabled()) {
    return <main className="flex h-full items-center justify-center p-8" />
  }
  // Lazy-load the game reserve component only when game is enabled
  const ReserveComponent = lazy(() =>
    import('@/modules/hermesworld/routes/reserve').then((m) => ({ default: m.default })),
  )
  return (
    <Suspense fallback={null}>
      <ReserveComponent />
    </Suspense>
  )
}

import { lazy, Suspense } from 'react'
