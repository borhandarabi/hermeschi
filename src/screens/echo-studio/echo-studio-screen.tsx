import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { t, type TranslationKey } from '@/lib/i18n'

type Tab = 'create' | 'manage' | 'theme'

const QUICK_TEMPLATES: ReadonlyArray<{
  id: string
  labelKey: TranslationKey
  icon: string
}> = [
  { id: 'analytics', labelKey: 'echoStudio.templateAnalytics', icon: '</>' },
  { id: 'system', labelKey: 'echoStudio.templateSystem', icon: '☰' },
  { id: 'chat', labelKey: 'echoStudio.templateChat', icon: '💬' },
]

const TAB_LABEL_KEYS: Record<Tab, TranslationKey> = {
  create: 'echoStudio.tabCreate',
  manage: 'echoStudio.tabManage',
  theme: 'echoStudio.tabTheme',
}

const TEMPLATE_META: Record<
  string,
  { id: string; titleKey: TranslationKey; promptKey: TranslationKey }
> = {
  analytics: {
    id: 'tool-analytics',
    titleKey: 'echoStudio.templateTitleAnalytics',
    promptKey: 'echoStudio.templatePromptAnalytics',
  },
  system: {
    id: 'system-monitor',
    titleKey: 'echoStudio.templateTitleSystem',
    promptKey: 'echoStudio.templatePromptSystem',
  },
  chat: {
    id: 'chat-analytics',
    titleKey: 'echoStudio.templateTitleChat',
    promptKey: 'echoStudio.templatePromptChat',
  },
}

export function EchoStudioScreen() {
  const [tab, setTab] = useState<Tab>('create')
  const [pageId, setPageId] = useState('')
  const [pageTitle, setPageTitle] = useState('')
  const [prompt, setPrompt] = useState('')
  const [creating, setCreating] = useState(false)
  const [screensCreated, setScreensCreated] = useState(0)
  const [widgetsActive, setWidgetsActive] = useState(0)
  const [apiEndpoints, setApiEndpoints] = useState(0)

  const handleCreate = async () => {
    if (!pageId.trim() || !pageTitle.trim() || !prompt.trim()) return
    setCreating(true)
    // Simulate creation — in production this would call the backend
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setScreensCreated((c) => c + 1)
    setApiEndpoints((c) => c + 1)
    setPageId('')
    setPageTitle('')
    setPrompt('')
    setCreating(false)
  }

  const handleTemplate = (id: string) => {
    const meta = TEMPLATE_META[id]
    if (meta) {
      setPageId(meta.id)
      setPageTitle(t(meta.titleKey))
      setPrompt(t(meta.promptKey))
    }
  }

  return (
    <div className="min-h-full overflow-y-auto bg-surface text-ink">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">{t('echoStudio.headerTitle')}</h1>
          <p className="mt-1 text-sm text-primary-500">
            {t('echoStudio.headerDesc')}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg border border-primary-200 bg-primary-50/85 p-1 backdrop-blur-xl">
          {(['create', 'manage', 'theme'] as Tab[]).map((tabId) => (
            <button
              key={tabId}
              onClick={() => setTab(tabId)}
              className={cn(
                'flex-1 rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors',
                tab === tabId
                  ? 'bg-primary-100 text-ink shadow-sm dark:bg-neutral-800'
                  : 'text-primary-500 hover:text-ink',
              )}
            >
              {t(TAB_LABEL_KEYS[tabId])}
            </button>
          ))}
        </div>

        {/* Create Tab */}
        {tab === 'create' && (
          <div className="space-y-6">
            {/* Form */}
            <div className="rounded-2xl border border-primary-200 bg-primary-50/50 p-6">
              <div className="space-y-5">
                {/* Page ID */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-500">
                    {t('echoStudio.pageIdLabel')}
                  </label>
                  <input
                    type="text"
                    value={pageId}
                    onChange={(e) => setPageId(e.target.value)}
                    placeholder={t('echoStudio.pageIdPlaceholder')}
                    className="w-full rounded-xl border border-primary-200 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-primary-400 focus:border-accent-500 dark:bg-neutral-900"
                  />
                </div>

                {/* Page Title */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-500">
                    {t('echoStudio.pageTitleLabel')}
                  </label>
                  <input
                    type="text"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    placeholder={t('echoStudio.pageTitlePlaceholder')}
                    className="w-full rounded-xl border border-primary-200 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-primary-400 focus:border-accent-500 dark:bg-neutral-900"
                  />
                </div>

                {/* Prompt */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-500">
                    {t('echoStudio.promptLabel')}
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('echoStudio.promptPlaceholder')}
                    rows={5}
                    className="w-full resize-y rounded-xl border border-primary-200 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-primary-400 focus:border-accent-500 dark:bg-neutral-900"
                  />
                </div>

                {/* Create Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={!pageId.trim() || !pageTitle.trim() || !prompt.trim() || creating}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all',
                      creating || !pageId.trim() || !pageTitle.trim() || !prompt.trim()
                        ? 'cursor-not-allowed bg-primary-300 opacity-60'
                        : 'bg-accent-500 hover:bg-accent-600 active:scale-[0.98]',
                    )}
                  >
                    {creating ? (
                      <>
                        <span className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        {t('echoStudio.creating')}
                      </>
                    ) : (
                      <>
                        <span>✨</span>
                        {t('echoStudio.createBtn')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-500">
                {t('echoStudio.quickTemplates')}
              </h2>
              <div className="flex flex-wrap gap-3">
                {QUICK_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleTemplate(tmpl.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50/50 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent-500 hover:bg-accent-50/50 dark:hover:bg-accent-900/20"
                  >
                    <span className="text-base">{tmpl.icon}</span>
                    {t(tmpl.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard label={t('echoStudio.screensCreated')} value={screensCreated} />
              <StatCard label={t('echoStudio.widgetsActive')} value={widgetsActive} />
              <StatCard label={t('echoStudio.apiEndpoints')} value={apiEndpoints} />
            </div>
          </div>
        )}

        {/* Manage Tab */}
        {tab === 'manage' && (
          <div className="rounded-2xl border border-primary-200 bg-primary-50/50 p-8 text-center">
            <p className="text-lg text-primary-500">{t('echoStudio.noScreens')}</p>
            <p className="mt-1 text-sm text-primary-400">
              {t('echoStudio.useCreateTab')}
            </p>
          </div>
        )}

        {/* Theme Tab */}
        {tab === 'theme' && (
          <div className="rounded-2xl border border-primary-200 bg-primary-50/50 p-8 text-center">
            <p className="text-lg text-primary-500">{t('echoStudio.themeComingSoon')}</p>
            <p className="mt-1 text-sm text-primary-400">
              {t('echoStudio.themeDesc')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">{value}</p>
    </div>
  )
}
