import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { GAME_BUILD_ENABLED, isGameRuntimeEnabled } from '@/lib/game-flag'

const EarlyAccessComponent = GAME_BUILD_ENABLED
  ? lazy(() => import('@/modules/hermesworld/routes/early-access').then((m) => ({ default: m.default })))
  : null

export const Route = createFileRoute('/early-access')({
  ssr: false,
  component: EarlyAccessRoute,
})

function EarlyAccessRoute() {
  if (!GAME_BUILD_ENABLED || !isGameRuntimeEnabled()) {
    return <main className="flex h-full items-center justify-center p-8" />
  }
  return (
    <Suspense fallback={null}>
      <EarlyAccessComponent! />
    </Suspense>
  )
}
