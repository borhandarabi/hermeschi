import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { GAME_BUILD_ENABLED, isGameRuntimeEnabled } from '@/lib/game-flag'

const ReserveComponent = GAME_BUILD_ENABLED
  ? lazy(() => import('@/modules/hermesworld/routes/reserve').then((m) => ({ default: m.default })))
  : null

export const Route = createFileRoute('/reserve')({
  ssr: false,
  component: ReserveRoute,
})

function ReserveRoute() {
  if (!GAME_BUILD_ENABLED || !isGameRuntimeEnabled()) {
    return <main className="flex h-full items-center justify-center p-8" />
  }
  return (
    <Suspense fallback={null}>
      <ReserveComponent! />
    </Suspense>
  )
}
