import { Suspense, lazy } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { usePageTitle } from '@/hooks/use-page-title'
import { t } from '@/lib/i18n'

const TerminalWorkspace = lazy(() =>
  import('@/components/terminal/terminal-workspace').then((m) => ({
    default: m.TerminalWorkspace,
  })),
)

export const Route = createFileRoute('/terminal')({
  ssr: false,
  component: TerminalRoute,
  errorComponent: function TerminalError({ error }) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-primary-50">
        <h2 className="text-xl font-semibold text-primary-900 mb-3">
          {t('terminal.errorTitle')}
        </h2>
        <p className="text-sm text-primary-600 mb-4 max-w-md">
          {error instanceof Error
            ? error.message
            : t('terminal.initFailed')}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
        >
          {t('terminal.reload')}
        </button>
      </div>
    )
  },
})

function TerminalRoute() {
  usePageTitle(t('terminal.title'))
  // Terminal is rendered persistently in WorkspaceShell — return null here to avoid double mount
  return null
}
