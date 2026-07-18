/**
 * Feature flag for HermesChiWorld game module.
 *
 * Build-time flag:
 *   VITE_ENABLE_HERMESCHIWORLD=1  → game code is bundled (but still gated
 *                                 by a runtime settings toggle that
 *                                 defaults to OFF)
 *   VITE_ENABLE_HERMESCHIWORLD=0  → game code is completely excluded
 *                                 from the bundle (tree-shaken)
 *
 * Runtime flag (only meaningful when build-time flag is '1'):
 *   localStorage 'hermeschi-game-enabled' = '1'  → game routes are
 *   accessible
 *
 * The settings dialog exposes a toggle that writes the runtime flag.
 */
export const GAME_BUILD_ENABLED: boolean =
  (import.meta as any).env?.VITE_ENABLE_HERMESCHIWORLD === '1' ||
  (import.meta as any).env?.VITE_ENABLE_HERMESCHIWORLD === true

const RUNTIME_KEY = 'hermeschi-game-enabled'

export function isGameRuntimeEnabled(): boolean {
  if (!GAME_BUILD_ENABLED) return false
  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem(RUNTIME_KEY) === '1'
}

export function setGameRuntimeEnabled(enabled: boolean): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(RUNTIME_KEY, enabled ? '1' : '0')
  // Force a reload so route guards re-evaluate
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}
