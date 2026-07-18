'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Add01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckListIcon,
  ComputerTerminal01Icon,
  Settings01Icon,
} from '@hugeicons/core-free-icons'
import { AgentProgress } from '@/components/agent-view/agent-progress'
import { PixelAvatar } from '@/components/agent-swarm/pixel-avatar'
import { useQuery } from '@tanstack/react-query'
import { Swarm2Artifacts, type Swarm2Artifact, type Swarm2Preview } from './swarm2-artifacts'
import { Swarm2LiveChat } from './swarm2-live-chat'
import { Swarm2TaskQueue } from './swarm2-task-queue'
import type { CrewMember } from '@/hooks/use-crew-status'
import { getOnlineStatus } from '@/hooks/use-crew-status'
import { cn } from '@/lib/utils'
import { t } from '@/lib/i18n'

type WorkerState =
  | 'active'
  | 'idle'
  | 'error'
  | 'offline'
  | 'thinking'
  | 'writing'
  | 'reviewing'
  | 'waiting'

const WORKER_COLORS = [
  '#34d399',
  '#60a5fa',
  '#a78bfa',
  '#f59e0b',
  '#fb7185',
  '#22d3ee',
  '#84cc16',
  '#f472b6',
]

function roleFromId(id: string): string {
  const m = id.match(/(\d+)/)
  const n = m ? m[1] : ''
  switch (n) {
    case '1':
      return t('swarm.worker.rolePrIssues')
    case '2':
      return t('swarm.worker.roleQwenPc1')
    case '3':
      return t('swarm.worker.roleBenchLoop')
    case '4':
      return t('swarm.worker.roleResearch')
    case '5':
    case '10':
      return t('swarm.worker.roleBuilder')
    case '6':
    case '11':
      return t('swarm.worker.roleReviewer')
    case '7':
      return t('swarm.worker.roleDocs')
    case '8':
      return t('swarm.worker.roleOps')
    case '9':
      return t('swarm.worker.roleHackathon')
    case '12':
      return t('swarm.worker.rolePrIssues')
    default:
      return t('swarm.worker.roleWorker')
  }
}

function deriveWorkerState(
  member: CrewMember,
  currentTask: string | null,
  checkpointStatus?: string | null,
  runtimeState?: string | null,
): WorkerState {
  const status = getOnlineStatus(member)
  if (status === 'offline') return 'offline'

  // Authoritative runtime state takes precedence over the title heuristic.
  // SwarmCheckpointStatus: 'none' | 'in_progress' | 'done' | 'blocked' | 'handoff' | 'needs_input'
  // SwarmWorkerState: 'idle' | 'executing' | 'thinking' | 'writing' | 'waiting' | 'blocked' | 'syncing' | 'reviewing' | 'offline'
  const cs = checkpointStatus ?? null
  const rs = runtimeState ?? null

  // Terminal-done: a finished worker renders as Idle (there is no 'done' WorkerState).
  if (cs === 'done' || cs === 'handoff' || rs === 'idle') return 'idle'
  // Blocked from either authoritative source.
  if (cs === 'blocked' || rs === 'blocked') return 'error'
  // Needs human input / waiting.
  if (cs === 'needs_input' || rs === 'waiting') return 'waiting'

  if (!currentTask) return 'idle'

  // Safety: a set, non-in-progress checkpoint must never render as active.
  if (cs && cs !== 'none' && cs !== 'in_progress') return 'idle'

  const lc = currentTask.toLowerCase()
  if (lc.includes('review')) return 'reviewing'
  if (lc.includes('writ') || lc.includes('doc') || lc.includes('spec')) return 'writing'
  if (lc.includes('research') || lc.includes('plan') || lc.includes('think')) return 'thinking'
  if (lc.includes('wait') || lc.includes('approval')) return 'waiting'
  if (lc.includes('block') || lc.includes('error') || lc.includes('fail')) return 'error'
  return 'active'
}

function statusStyles(state: WorkerState) {
  if (state === 'error') {
    return { dot: 'bg-red-500', ring: 'text-red-500', label: t('swarm.worker.stateError'), progress: 'failed' as const, avatar: 'failed' as const }
  }
  if (state === 'offline') {
    return { dot: 'bg-primary-300', ring: 'text-primary-300', label: t('swarm.worker.stateOffline'), progress: 'queued' as const, avatar: 'idle' as const }
  }
  if (state === 'idle') {
    return { dot: 'bg-primary-300', ring: 'text-primary-300', label: t('swarm.worker.stateIdle'), progress: 'queued' as const, avatar: 'idle' as const }
  }
  if (state === 'waiting') {
    return { dot: 'bg-amber-500', ring: 'text-amber-500', label: t('swarm.worker.stateWaiting'), progress: 'queued' as const, avatar: 'idle' as const }
  }
  if (state === 'thinking') {
    return { dot: 'bg-emerald-500', ring: 'text-emerald-500', label: t('swarm.worker.stateThinking'), progress: 'thinking' as const, avatar: 'thinking' as const }
  }
  return { dot: 'bg-emerald-500', ring: 'text-emerald-500', label: t('swarm.worker.stateActive'), progress: 'running' as const, avatar: 'running' as const }
}

function relativeOutputTime(ts: number | null | undefined): string {
  if (!ts) return t('swarm.worker.noRuntimeOutput')
  const diff = Date.now() - ts
  if (diff < 60_000) return t('swarm.worker.outputJustNow')
  if (diff < 3_600_000) return t('swarm.worker.outputMinutesAgo', { count: Math.floor(diff / 60_000) })
  if (diff < 86_400_000) return t('swarm.worker.outputHoursAgo', { count: Math.floor(diff / 3_600_000) })
  return t('swarm.worker.outputDaysAgo', { count: Math.floor(diff / 86_400_000) })
}

function isLivePulse(ts: number | null | undefined): boolean {
  if (!ts) return false
  return Date.now() - ts < 90_000
}

type WorkerProjectSnapshot = {
  projectName?: string | null
  branch?: string | null
  changedFiles?: Array<string>
  previewUrls?: Array<string>
  previewSource?: 'runtime' | 'script-port' | 'none'
}

async function fetchWorkerProject(workerId: string): Promise<WorkerProjectSnapshot> {
  const res = await fetch(`/api/swarm-project?workerId=${encodeURIComponent(workerId)}`)
  if (!res.ok) return {}
  return (await res.json()) as WorkerProjectSnapshot
}

function colorForWorker(workerId: string) {
  const number = parseInt(workerId.replace(/\D/g, ''), 10)
  if (Number.isFinite(number) && number > 0) {
    return WORKER_COLORS[(number - 1) % WORKER_COLORS.length]
  }
  return WORKER_COLORS[0]
}

function formatAssignedModel(model?: string | null, provider?: string | null): string {
  const value = `${model || ''} ${provider || ''}`.toLowerCase()
  if (value.includes('claude-opus-4-7') || value.includes('opus-4-7')) return 'Opus 4.7'
  if (value.includes('claude-opus-4-6') || value.includes('opus-4-6')) return 'Opus 4.6'
  if (value.includes('gpt-5.5')) return 'GPT-5.5'
  if (value.includes('gpt-5.4')) return 'GPT-5.4'
  if (value.includes('gpt-5.3')) return 'GPT-5.3'
  if (model && model !== 'unknown') return model
  if (provider && provider !== 'unknown') return provider.replace(/^custom:/, '').replace(/[-_]/g, ' ')
  return t('swarm.worker.roleWorker')
}

type WorkerCardSettings = {
  displayName?: string
  role?: string
  modelLabel?: string
  avatarGlyph?: string
}

const SETTINGS_STORAGE_PREFIX = 'claude-swarm2-card-settings:'
const ROLE_OPTIONS = [
  t('swarm.worker.roleProfile'),
  t('swarm.worker.rolePrIssues'),
  t('swarm.worker.roleBuilder'),
  t('swarm.worker.roleReviewer'),
  t('swarm.worker.roleBenchLoop'),
  t('swarm.worker.roleResearch'),
  t('swarm.worker.roleDocs'),
  t('swarm.worker.roleOps'),
  t('swarm.worker.roleQwenPc1'),
  t('swarm.worker.roleHackathon'),
  t('swarm.worker.roleWorker'),
]
const MODEL_OPTIONS = [
  'GPT-5.5',
  'GPT-5.4',
  'GPT-5.3',
  'Opus 4.7',
  'Opus 4.6',
  'Opus 4.5',
  'MiniMax',
  'Qwen3 8B',
  'Qwen3 14B',
  t('swarm.worker.roleWorker'),
]
const AVATAR_OPTIONS = ['','🤖','🧠','🛠️','📊','🧪','📝','⚙️','🔬','🚀']

export type OperationalWorkerCardProps = {
  member: CrewMember
  currentTask?: string | null
  checkpointStatus?: string | null
  runtimeState?: string | null
  recentLines?: Array<string>
  recentOutputAt?: number | null
  recentSummary?: string | null
  artifacts?: Array<Swarm2Artifact>
  previews?: Array<Swarm2Preview>
  inRoom: boolean
  selected: boolean
  onSelect: () => void
  onToggleRoom: () => void
  onOpenTui: () => void
  onOpenTasks: () => void
  cardRef?: (node: HTMLElement | null) => void
}

export function OperationalWorkerCard({
  member,
  currentTask = null,
  checkpointStatus = null,
  runtimeState = null,
  recentOutputAt = null,
  recentSummary = null,
  artifacts = [],
  previews = [],
  inRoom,
  selected,
  onSelect,
  onToggleRoom,
  onOpenTui,
  onOpenTasks,
  cardRef,
}: OperationalWorkerCardProps) {
  const chatAnchorRef = useRef<HTMLDivElement | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState<WorkerCardSettings>({})
  const [draftName, setDraftName] = useState('')
  const [draftRole, setDraftRole] = useState('')
  const [draftModel, setDraftModel] = useState('')
  const [draftAvatar, setDraftAvatar] = useState('')
  const [taskComposerOpen, setTaskComposerOpen] = useState(false)
  const state = deriveWorkerState(member, currentTask, checkpointStatus, runtimeState)
  const status = statusStyles(state)
  const role = settings.role || member.role || roleFromId(member.id)
  const displayName = settings.displayName || member.displayName || member.id

  // Reuse the project endpoint so artifacts can fall back to git-changed files
  // and so the inline preview gets a verified URL.
  const projectQuery = useQuery({
    queryKey: ['swarm2', 'card-project', member.id],
    queryFn: () => fetchWorkerProject(member.id),
    enabled: Boolean(member.id),
    refetchInterval: 60_000,
    staleTime: 30_000,
  })
  const projectName = projectQuery.data?.projectName ?? null
  const projectBranch = projectQuery.data?.branch ?? null
  const cardChangedFiles = projectQuery.data?.changedFiles ?? []
  const previewUrl = projectQuery.data?.previewUrls?.[0] ?? null
  const livePulse = isLivePulse(recentOutputAt)
  const activeCount = member.assignedTaskCount + member.cronJobCount
  const hasPreview = Boolean(previewUrl)
  const progressValue =
    state === 'idle' || state === 'offline' ? 8 : state === 'waiting' ? 38 : 68
  const baseModelLabel = formatAssignedModel(member.model, member.provider)
  const modelLabel = settings.modelLabel || baseModelLabel
  const avatarGlyph = settings.avatarGlyph || ''
  const outputFreshness = relativeOutputTime(recentOutputAt)
  const focusPanels = useMemo(() => {
    const panels: Array<{
      key: 'tasks' | 'output' | 'files'
      label: string
      meta: string
      helper: string
    }> = [
      {
        key: 'tasks',
        label: t('swarm.worker.tasks'),
        meta: t('swarm.worker.tasksActiveLanes', { count: activeCount }),
        helper: t('swarm.worker.tasksHelper'),
      },
      {
        key: 'output',
        label: t('swarm.worker.output'),
        meta: t('swarm.worker.outputMeta', { artifacts: artifacts.length, previews: previews.length }),
        helper: t('swarm.worker.outputHelper'),
      },
    ]
    if (cardChangedFiles.length > 0) {
      panels.push({
        key: 'files',
        label: t('swarm.worker.files'),
        meta: t('swarm.worker.filesChanged', { count: cardChangedFiles.length }),
        helper: t('swarm.worker.filesHelper'),
      })
    }
    return panels
  }, [activeCount, artifacts.length, previews.length, cardChangedFiles.length])
  const [focusPanel, setFocusPanel] = useState<'tasks' | 'output' | 'files'>('tasks')
  const panelCollapsedLimit = selected ? 6 : 4
  const panelExpandedLimit = selected ? 8 : 5
  useEffect(() => {
    if (!focusPanels.some((panel) => panel.key === focusPanel)) {
      setFocusPanel('tasks')
    }
  }, [focusPanels, focusPanel])
  const activeFocusPanel = focusPanels.find((panel) => panel.key === focusPanel) ?? focusPanels[0]

  function cycleFocusPanel(direction: -1 | 1) {
    const currentIndex = focusPanels.findIndex((panel) => panel.key === focusPanel)
    const safeIndex = currentIndex >= 0 ? currentIndex : 0
    const nextIndex = (safeIndex + direction + focusPanels.length) % focusPanels.length
    setFocusPanel(focusPanels[nextIndex]?.key ?? 'tasks')
  }

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`${SETTINGS_STORAGE_PREFIX}${member.id}`)
      if (!raw) return
      const parsed = JSON.parse(raw) as WorkerCardSettings
      setSettings(parsed)
    } catch {
      /* noop */
    }
  }, [member.id])

  useEffect(() => {
    if (!settingsOpen) return
    setDraftName(settings.displayName || member.displayName || '')
    setDraftRole(settings.role || member.role || roleFromId(member.id))
    setDraftModel(settings.modelLabel || baseModelLabel)
    setDraftAvatar(settings.avatarGlyph || '')
  }, [settingsOpen, settings, member.displayName, member.role, member.id, baseModelLabel])

  useEffect(() => {
    if (!selected) return
    const id = setTimeout(() => {
      chatAnchorRef.current?.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'smooth',
      })
    }, 40)
    return () => clearTimeout(id)
  }, [selected])

  return (
    <article
      ref={cardRef}
      data-swarm2-worker-id={member.id}
      onClick={onSelect}
      className={cn(
        'relative overflow-hidden flex min-h-[30rem] flex-col rounded-[1.35rem] border bg-[var(--theme-card)] p-3 text-[var(--theme-text)] shadow-[0_18px_44px_color-mix(in_srgb,var(--theme-shadow)_13%,transparent)] transition-all',
        'hover:-translate-y-[1px] hover:shadow-[0_22px_58px_color-mix(in_srgb,var(--theme-shadow)_18%,transparent)]',
        selected
          ? 'border-[var(--theme-accent)] ring-1 ring-[var(--theme-accent-soft-strong)]'
          : inRoom
            ? 'border-[var(--theme-border2)]'
            : 'border-[var(--theme-border)]',
      )}
    >
      {!settingsOpen ? (
      <>
      {/* Below md the three header groups wrap into two rows (name on top, pills +
          role below) instead of the absolute-positioned single-row layout, which
          physically overlaps the centered name on narrow cards (left+right groups
          can claim 19rem). */}
      <div className="relative flex min-h-8 flex-wrap items-center gap-y-1 md:flex-nowrap">
        <div className="order-2 flex max-w-[10rem] flex-wrap items-center gap-1 text-[10px] text-[var(--theme-muted)]/85 md:absolute md:left-0 md:order-none">
          <span className="rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] px-1.5 py-0.5">
            {modelLabel}
          </span>
          <span className="rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] px-1.5 py-0.5">
            {projectBranch || projectName || (hasPreview ? t('swarm.worker.preview') : t('swarm.worker.main'))}
          </span>
        </div>
        <div className="order-1 flex w-full justify-center px-2 md:order-none md:px-28">
          <h3 className="min-w-0 text-center text-sm font-semibold text-[var(--theme-text)]">
            <span className="inline-flex max-w-full items-center justify-center gap-2">
              {avatarGlyph ? <span>{avatarGlyph}</span> : null}
              <span className="truncate">{displayName}</span>
              <span
                className={cn(
                  'h-2 w-2 shrink-0 rounded-full',
                  state !== 'idle' && state !== 'offline' && state !== 'waiting' && 'animate-pulse',
                  status.dot,
                )}
                aria-label={status.label}
                title={status.label}
              />
              {livePulse ? (
                <span
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-1.5 py-[1px] text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-200"
                  title={t('swarm.worker.outputFreshnessTitle')}
                >
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                  {t('swarm.worker.live')}
                </span>
              ) : null}
            </span>
          </h3>
        </div>

        <div className="order-3 ml-auto flex min-w-0 max-w-[9rem] items-center gap-1 md:absolute md:right-0 md:order-none md:ml-0">
          <span
            className="min-w-0 truncate rounded-full border border-[var(--theme-accent)]/30 bg-[var(--theme-accent-soft)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--theme-muted)]"
            title={role}
          >
            {role}
          </span>
          <button
            type="button"
            aria-label={t('swarm.worker.settingsFor', { name: displayName })}
            title={t('swarm.worker.settingsFor', { name: displayName })}
            onClick={(event) => {
              event.stopPropagation()
              setSettingsOpen(true)
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--theme-muted)] transition-colors hover:bg-[var(--theme-bg)] hover:text-[var(--theme-text)]"
          >
            <HugeiconsIcon icon={Settings01Icon} size={16} strokeWidth={1.8} />
          </button>

        </div>
      </div>

      <div className="flex flex-col items-center gap-1 px-2 py-1.5 text-center">
        <div className="relative flex size-11 shrink-0 items-center justify-center">
          <AgentProgress
            value={progressValue}
            status={status.progress}
            size={44}
            strokeWidth={2.5}
            className={status.ring}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <PixelAvatar
              size={36}
              color={colorForWorker(member.id)}
              accentColor="#ffffff"
              status={status.avatar}
            />
          </div>
        </div>


      </div>

      {!member.profileFound ? (
        <div className="mb-2 rounded-xl border border-amber-400/35 bg-amber-500/10 px-3 py-2 text-center text-[11px] text-amber-200">
          {t('swarm.worker.rosterOnly')}
        </div>
      ) : null}

      <div
        ref={chatAnchorRef}
        onClick={(event) => event.stopPropagation()}
        className={cn('flex-1', selected ? 'mt-5 min-h-[18rem]' : 'mt-4 min-h-[16rem]')}
      >
        <Swarm2LiveChat
          workerId={member.id}
          preview={false}
          previewLimit={6}
          nativeStyle
          className="h-full min-h-[16rem] bg-[var(--theme-bg)] text-[var(--theme-text)]"
        />
      </div>

      <section
        className={cn(
          'mt-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] px-2.5 py-2',
          selected ? 'min-h-[5.75rem]' : 'min-h-[5rem]',
        )}
        onClick={(event) => event.stopPropagation()}
      >
          <div className="mb-2 flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-muted)]">
            <button
              type="button"
              aria-label={t('swarm.worker.previousPanel')}
              title={t('swarm.worker.previousPanel')}
              onClick={() => cycleFocusPanel(-1)}
              className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[var(--theme-border)] bg-[var(--theme-bg)] text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={11} />
            </button>
            <div className="min-w-0 flex-1 text-center">
              <div className="truncate">{activeFocusPanel?.label ?? t('swarm.worker.panel')}</div>
              <div className="truncate text-[10px] font-medium normal-case tracking-normal text-[var(--theme-muted)]/80">
                {activeFocusPanel?.meta ?? outputFreshness}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {focusPanel === 'tasks' ? (
                <button
                  type="button"
                  aria-label={taskComposerOpen ? t('swarm.tasks.closeAddTask') : t('swarm.tasks.addTask')}
                  title={taskComposerOpen ? t('swarm.tasks.closeAddTask') : t('swarm.tasks.addTask')}
                  onClick={() => setTaskComposerOpen((value) => !value)}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[var(--theme-border)] bg-[var(--theme-bg)] text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
                >
                  <HugeiconsIcon icon={Add01Icon} size={11} />
                </button>
              ) : null}
              <button
                type="button"
                aria-label={t('swarm.worker.nextPanel')}
                title={t('swarm.worker.nextPanel')}
                onClick={() => cycleFocusPanel(1)}
                className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[var(--theme-border)] bg-[var(--theme-bg)] text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={11} />
              </button>
            </div>
          </div>

          <p className="mb-2 mx-auto max-w-2xl text-center text-[11px] leading-relaxed text-[var(--theme-muted)]">
            {activeFocusPanel?.helper ?? t('swarm.worker.workerDetails')}
          </p>

          {focusPanel === 'tasks' ? (
            <Swarm2TaskQueue
              workerId={member.id}
              limit={selected ? 5 : 3}
              doneLimit={selected ? 3 : 2}
              showHeader={false}
              composerOpen={taskComposerOpen}
              onComposerOpenChange={setTaskComposerOpen}
              centered
              className={cn(selected ? 'min-h-[5.75rem]' : 'min-h-[5rem]')}
            />
          ) : focusPanel === 'files' ? (
            <Swarm2Artifacts
              workerId={member.id}
              artifacts={artifacts}
              previews={[]}
              changedFiles={cardChangedFiles}
              expanded={selected}
              collapsedLimit={panelCollapsedLimit}
              expandedLimit={panelExpandedLimit}
              mode="files"
              showHeader={false}
              centered
              className={cn(selected ? 'min-h-[5.75rem]' : 'min-h-[5rem]', 'border-0 bg-transparent px-0 py-0')}
            />
          ) : (
            <Swarm2Artifacts
              workerId={member.id}
              artifacts={artifacts}
              previews={previews}
              changedFiles={cardChangedFiles}
              expanded={selected}
              collapsedLimit={panelCollapsedLimit}
              expandedLimit={panelExpandedLimit}
              mode="artifacts"
              showHeader={false}
              centered
              className={cn(selected ? 'min-h-[5.75rem]' : 'min-h-[5rem]', 'border-0 bg-transparent px-0 py-0')}
            />
          )}
      </section>

      <div
        className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-[var(--theme-border)] text-[11px]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onOpenTasks}
          title={t('swarm.worker.routeWorkTo', { name: member.displayName || member.id })}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] px-2.5 py-1 text-[var(--theme-muted)] transition-colors hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]"
        >
          <HugeiconsIcon icon={CheckListIcon} size={11} />
          {t('swarm.worker.routeToAgent')}
        </button>
        <button
          type="button"
          onClick={onOpenTui}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] px-2.5 py-1 text-[var(--theme-muted)] transition-colors hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]"
        >
          <HugeiconsIcon icon={ComputerTerminal01Icon} size={11} />
          {t('swarm.worker.openTerminal')}
        </button>
      </div>
      </>
      ) : null}
      {settingsOpen ? (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center rounded-[1.35rem] bg-[color:rgba(5,10,15,0.9)] backdrop-blur-sm p-3"
          onClick={(event) => {
            event.stopPropagation()
            setSettingsOpen(false)
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[var(--theme-text)]">{t('swarm.worker.agentSettings')}</h4>
                <p className="text-[11px] text-[var(--theme-muted)]">{t('swarm.worker.agentSettingsDesc')}</p>
              </div>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-[var(--theme-muted)] hover:bg-[var(--theme-bg)] hover:text-[var(--theme-text)]"
                onClick={() => setSettingsOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-[12px]">
              <label className="block">
                <span className="mb-1 block text-[var(--theme-muted)]">{t('swarm.worker.name')}</span>
                <input
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  className="w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-[var(--theme-text)] outline-none"
                  placeholder={member.displayName || member.id}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[var(--theme-muted)]">{t('swarm.worker.avatarGlyph')}</span>
                <select
                  value={draftAvatar}
                  onChange={(event) => setDraftAvatar(event.target.value)}
                  className="w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-[var(--theme-text)] outline-none"
                >
                  <option value="">{t('swarm.worker.none')}</option>
                  {AVATAR_OPTIONS.filter(Boolean).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[var(--theme-muted)]">{t('swarm.worker.role')}</span>
                <select
                  value={draftRole}
                  onChange={(event) => setDraftRole(event.target.value)}
                  className="w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-[var(--theme-text)] outline-none"
                >
                  {Array.from(new Set([draftRole || member.role || roleFromId(member.id), ...ROLE_OPTIONS].filter(Boolean))).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[var(--theme-muted)]">{t('swarm.worker.modelLabel')}</span>
                <select
                  value={draftModel}
                  onChange={(event) => setDraftModel(event.target.value)}
                  className="w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-[var(--theme-text)] outline-none"
                >
                  {Array.from(new Set([draftModel || baseModelLabel, ...MODEL_OPTIONS].filter(Boolean))).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                type="button"
                className="rounded-xl border border-[var(--theme-border)] px-3 py-2 text-[11px] text-[var(--theme-muted)] hover:bg-[var(--theme-bg)] hover:text-[var(--theme-text)]"
                onClick={() => {
                  const next = {}
                  setSettings(next)
                  try {
                    window.localStorage.removeItem(`${SETTINGS_STORAGE_PREFIX}${member.id}`)
                  } catch {
                    /* noop */
                  }
                  setSettingsOpen(false)
                }}
              >
                {t('common.reset')}
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-[var(--theme-border)] px-3 py-2 text-[11px] text-[var(--theme-muted)] hover:bg-[var(--theme-bg)] hover:text-[var(--theme-text)]"
                  onClick={() => setSettingsOpen(false)}
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-[var(--theme-accent)] px-3 py-2 text-[11px] font-semibold text-primary-950 hover:bg-[var(--theme-accent-strong)]"
                  onClick={() => {
                    const next: WorkerCardSettings = {
                      displayName: draftName.trim() || undefined,
                      avatarGlyph: draftAvatar.trim() || undefined,
                      role: draftRole.trim() || undefined,
                      modelLabel: draftModel.trim() || undefined,
                    }
                    setSettings(next)
                    try {
                      window.localStorage.setItem(`${SETTINGS_STORAGE_PREFIX}${member.id}`, JSON.stringify(next))
                    } catch {
                      /* noop */
                    }
                    setSettingsOpen(false)
                  }}
                >
                  {t('common.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  )
}
