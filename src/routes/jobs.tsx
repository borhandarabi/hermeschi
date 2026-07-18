import { createFileRoute } from '@tanstack/react-router'
import BackendUnavailableState from '@/components/backend-unavailable-state'
import { usePageTitle } from '@/hooks/use-page-title'
import { getUnavailableReason } from '@/lib/feature-gates'
import { useFeatureAvailable } from '@/hooks/use-feature-available'
import { t } from '@/lib/i18n'
import { JobsScreen } from '@/screens/jobs/jobs-screen'

export const Route = createFileRoute('/jobs')({
  ssr: false,
  component: function JobsRoute() {
    usePageTitle(t('jobs.title'))
    if (!useFeatureAvailable('jobs')) {
      return (
        <BackendUnavailableState
          feature={t('jobs.title')}
          description={getUnavailableReason('Jobs')}
        />
      )
    }
    return <JobsScreen />
  },
})
