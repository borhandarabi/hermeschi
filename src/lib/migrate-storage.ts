/**
 * Migration shim — migrates old `hermes-workspace-*` and `hermes-*`
 * identifiers to the new `hermeschi-*` naming.
 *
 * This module runs ONCE at app startup (before React hydrates) to
 * transparently migrate:
 *   1. localStorage keys from `hermes-workspace-*` → `hermeschi-*`
 *   2. localStorage keys from `hermes-session-model` → `hermeschi-session-model`
 *   3. localStorage keys from `hermes-update-v2-*` → `hermeschi-update-v2-*`
 *   4. localStorage keys from `hermes-react-dom-recovery-at` → `hermeschi-react-dom-recovery-at`
 *
 * After migration, the old keys are removed so the shim doesn't run again.
 *
 * Env var migration is handled separately in `migrate-env-vars.ts`
 * because env vars need to be migrated on the server side too.
 *
 * This shim is safe to remove after a few release cycles once all
 * users have migrated.
 */

const MIGRATION_FLAG = 'hermeschi-migration-done-v1'

// Map of old → new localStorage key patterns.
// We use prefix matching so all `hermes-update-v2-*` keys are caught.
const KEY_MIGRATIONS: Array<{ oldPrefix: string; newPrefix: string; exact: boolean }> = [
  // Exact key renames
  { oldPrefix: 'hermes-workspace-locale', newPrefix: 'hermeschi-locale', exact: true },
  { oldPrefix: 'hermes-workspace-agent-name', newPrefix: 'hermeschi-agent-name', exact: true },
  { oldPrefix: 'hermes-workspace-preferred-provider', newPrefix: 'hermeschi-preferred-provider', exact: true },
  { oldPrefix: 'hermes-workspace-orchestrator-avatar', newPrefix: 'hermeschi-orchestrator-avatar', exact: true },
  { oldPrefix: 'hermes-session-model', newPrefix: 'hermeschi-session-model', exact: true },
  { oldPrefix: 'hermes-workspace-v1', newPrefix: 'hermeschi-v1', exact: true },
  { oldPrefix: 'hermes-react-dom-recovery-at', newPrefix: 'hermeschi-react-dom-recovery-at', exact: true },
  // Prefix-based renames (for keys with dynamic suffixes)
  { oldPrefix: 'hermes-update-v2-', newPrefix: 'hermeschi-update-v2-', exact: false },
  { oldPrefix: 'hermes-workspace-', newPrefix: 'hermeschi-', exact: false },
]

export function migrateLocalStorage(): void {
  if (typeof localStorage === 'undefined') return

  // Skip if already migrated
  if (localStorage.getItem(MIGRATION_FLAG) === '1') return

  try {
    const keysToMigrate: Array<{ oldKey: string; newKey: string; value: string }> = []

    // Collect all keys that need migration
    for (let i = 0; i < localStorage.length; i++) {
      const oldKey = localStorage.key(i)
      if (!oldKey) continue

      // Skip the migration flag itself
      if (oldKey === MIGRATION_FLAG) continue

      // Skip already-migrated keys
      if (oldKey.startsWith('hermeschi-')) continue

      // Check if this key matches any migration pattern
      for (const migration of KEY_MIGRATIONS) {
        const matches = migration.exact
          ? oldKey === migration.oldPrefix
          : oldKey.startsWith(migration.oldPrefix)

        if (matches) {
          const newKey = migration.exact
            ? migration.newPrefix
            : migration.newPrefix + oldKey.slice(migration.oldPrefix.length)

          // Only migrate if the new key doesn't already exist
          // (user may have already started using the new key)
          if (localStorage.getItem(newKey) === null) {
            const value = localStorage.getItem(oldKey)
            if (value !== null) {
              keysToMigrate.push({ oldKey, newKey, value })
            }
          }
          break
        }
      }
    }

    // Execute migrations
    for (const { oldKey, newKey, value } of keysToMigrate) {
      localStorage.setItem(newKey, value)
      localStorage.removeItem(oldKey)
    }

    // Mark migration as done
    localStorage.setItem(MIGRATION_FLAG, '1')

    if (keysToMigrate.length > 0 && typeof console !== 'undefined') {
      console.log(
        `[HermesChi] Migrated ${keysToMigrate.length} localStorage keys from hermes-* to hermeschi-*`,
      )
    }
  } catch (error) {
    // Migration failed — don't block app startup, just log
    if (typeof console !== 'undefined') {
      console.warn('[HermesChi] localStorage migration failed:', error)
    }
  }
}
