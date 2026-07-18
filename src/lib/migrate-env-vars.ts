/**
 * Env var migration shim — maps old HERMES_WORKSPACE_* env vars to
 * the new HERMESCHI_* names.
 *
 * This module runs on the SERVER side at startup. It checks if the
 * new env var is missing but the old one is set, and copies the value.
 * This allows existing deployments to work without updating their .env
 * files immediately.
 *
 * Workspace-owned env vars migrated:
 *   HERMES_WORKSPACE_DIR          → HERMESCHI_WORKSPACE_DIR
 *   HERMES_WEBUI_DEFAULT_WORKSPACE → HERMESCHI_WEBUI_DEFAULT_WORKSPACE
 *   HERMES_PASSWORD               → HERMESCHI_PASSWORD
 *   HERMES_DASHBOARD_TOKEN        → HERMESCHI_DASHBOARD_TOKEN
 *   HERMES_DASHBOARD_URL          → HERMESCHI_DASHBOARD_URL
 *   HERMES_WORKSPACE_DESKTOP      → HERMESCHI_DESKTOP
 *
 * NOT migrated (external hermes-agent gateway vars — kept as-is):
 *   HERMES_API_URL, HERMES_API_TOKEN, HERMES_HOME,
 *   HERMES_AGENT_PATH, HERMES_CLI_BIN, HERMES_TMUX_BIN,
 *   HERMES_SKILLS_DIR, HERMES_SWARM_MEMORY_ROOT,
 *   HERMES_DEFAULT_MODEL, HERMES_USE_RESPONSES
 *
 * Safe to remove after a few release cycles.
 */

const ENV_MIGRATIONS: Record<string, string> = {
  HERMES_WORKSPACE_DIR: 'HERMESCHI_WORKSPACE_DIR',
  HERMES_WEBUI_DEFAULT_WORKSPACE: 'HERMESCHI_WEBUI_DEFAULT_WORKSPACE',
  HERMES_PASSWORD: 'HERMESCHI_PASSWORD',
  HERMES_DASHBOARD_TOKEN: 'HERMESCHI_DASHBOARD_TOKEN',
  HERMES_DASHBOARD_URL: 'HERMESCHI_DASHBOARD_URL',
  HERMES_WORKSPACE_DESKTOP: 'HERMESCHI_DESKTOP',
  HERMES_WORKSPACE_METRICS_DISK_PATH: 'HERMESCHI_METRICS_DISK_PATH',
  HERMES_WORKSPACE_STATE_DIR: 'HERMESCHI_STATE_DIR',
  HERMES_WORKSPACE_STICKY_PROFILE: 'HERMESCHI_STICKY_PROFILE',
  HERMES_WORKSPACE_DOCKER: 'HERMESCHI_DOCKER',
  HERMES_WORKSPACE_AUTO_START_AGENT: 'HERMESCHI_AUTO_START_AGENT',
}

export function migrateEnvVars(): void {
  if (typeof process === 'undefined' || !process.env) return

  for (const [oldName, newName] of Object.entries(ENV_MIGRATIONS)) {
    // Only migrate if the new var is NOT already set
    if (process.env[newName] === undefined) {
      const oldValue = process.env[oldName]
      if (oldValue !== undefined) {
        process.env[newName] = oldValue
        if (typeof console !== 'undefined') {
          console.warn(
            `[HermesChi] Env var '${oldName}' is deprecated. ` +
              `Use '${newName}' instead. The value has been auto-migrated for this session.`,
          )
        }
      }
    }
  }
}
