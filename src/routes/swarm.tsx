import { createFileRoute } from '@tanstack/react-router'
import { usePageTitle } from '@/hooks/use-page-title'
import { t } from '@/lib/i18n'
import { Swarm2Screen } from '@/screens/swarm2/swarm2-screen'

export const Route = createFileRoute('/swarm')({
  ssr: false,
  component: function SwarmRoute() {
    usePageTitle(t('swarm.title'))
    return <Swarm2Screen />
  },
  errorComponent: function SwarmError({ error }) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-primary-50">
        <h2 className="text-xl font-semibold text-primary-900 mb-3">
          {t('swarm.errorTitle')}
        </h2>
        <p className="text-sm text-primary-600 mb-4 max-w-md">
          {error instanceof Error
            ? error.message
            : t('common.unexpectedError')}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
        >
          {t('common.reloadPage')}
        </button>
      </div>
    )
  },
  pendingComponent: function SwarmPending() {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-accent-500 border-r-transparent mb-3" />
          <p className="text-sm text-primary-500">{t('swarm.loadingExplorer')}</p>
        </div>
      </div>
    )
  },
})
