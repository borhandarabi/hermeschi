import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { GAME_BUILD_ENABLED, isGameRuntimeEnabled } from '@/lib/game-flag'

const ReserveConfirmComponent = GAME_BUILD_ENABLED
  ? lazy(() => import('@/modules/hermesworld/routes/reserve/confirm').then((m) => ({ default: m.default })))
  : null

export const Route = createFileRoute('/reserve/confirm')({
  ssr: false,
  component: ReserveConfirmRoute,
})

function ReserveConfirmRoute() {
  if (!GAME_BUILD_ENABLED || !isGameRuntimeEnabled()) {
    return <main className="flex h-full items-center justify-center p-8" />
  }
  return (
    <Suspense fallback={null}>
      <ReserveConfirmComponent! />
    </Suspense>
  )
}
