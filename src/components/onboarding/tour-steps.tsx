import type { Step } from 'react-joyride'
import { t } from '@/lib/i18n'

export const tourSteps: Array<Step> = [
  // Step 1: Welcome
  {
    target: 'body',
    placement: 'center',
    title: t('tour.welcomeTitle'),
    content: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <img
          src="/claude-avatar.webp"
          alt={t('tour.hermesAgent')}
          style={{ width: 48, height: 48, borderRadius: 12 }}
        />
        <p style={{ textAlign: 'center', margin: 0 }}>
          {t('tour.welcomeBody')}
        </p>
      </div>
    ),
    disableBeacon: true,
  },
  // Step 2: Sidebar
  {
    target: '[data-tour="sidebar-container"]',
    placement: 'right',
    title: t('tour.sidebarTitle'),
    content: t('tour.sidebarBody'),
  },
  // Step 3: New Session
  {
    target: '[data-tour="new-session"]',
    placement: 'right',
    title: t('tour.newChatTitle'),
    content: t('tour.newChatBody'),
  },
  // Step 4: Dashboard
  {
    target: '[data-tour="dashboard"]',
    placement: 'right',
    title: t('tour.dashboardTitle'),
    content: t('tour.dashboardBody'),
  },
  // Step 5: Agent Hub
  {
    target: '[data-tour="agent-hub"]',
    placement: 'right',
    title: t('tour.agentHubTitle'),
    content: t('tour.agentHubBody'),
  },
  // Step 7: Skills
  {
    target: '[data-tour="skills"]',
    placement: 'right',
    title: t('tour.skillsTitle'),
    content: t('tour.skillsBody'),
  },
  // Step 8: Terminal
  {
    target: '[data-tour="terminal"]',
    placement: 'right',
    title: t('tour.terminalTitle'),
    content: t('tour.terminalBody'),
  },
  // Step 9: Usage Meter (in header)
  {
    target: '[data-tour="usage-meter"]',
    placement: 'bottom',
    title: t('tour.usageTitle'),
    content: t('tour.usageBody'),
  },
  // Step 10: Settings
  {
    target: '[data-tour="settings"]',
    placement: 'right',
    title: t('tour.settingsTitle'),
    content: t('tour.settingsBody'),
  },
  // Step 11: Finish
  {
    target: 'body',
    placement: 'center',
    title: t('tour.finishTitle'),
    content: t('tour.finishBody'),
  },
]
