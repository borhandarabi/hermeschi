'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import type { JobProfileOption } from '@/lib/jobs-api'
import { t } from '@/lib/i18n'

const SCHEDULE_PRESETS = [
  { label: t('jobs.schedulePreset.every15m'), value: 'every 15m' },
  { label: t('jobs.schedulePreset.every30m'), value: 'every 30m' },
  { label: t('jobs.schedulePreset.every1h'), value: 'every 1h' },
  { label: t('jobs.schedulePreset.every6Hours'), value: 'every 6h' },
  { label: t('jobs.schedulePreset.daily'), value: '0 9 * * *' },
  { label: t('jobs.schedulePreset.weekly'), value: '0 9 * * 1' },
] as const

const DELIVERY_OPTIONS = ['local', 'telegram', 'discord'] as const

type CreateJobDialogProps = {
  open: boolean
  isSubmitting?: boolean
  profiles: Array<JobProfileOption>
  onOpenChange: (open: boolean) => void
  onSubmit: (input: {
    profile: string
    name: string
    schedule: string
    prompt: string
    deliver?: Array<string>
    skills?: Array<string>
    repeat?: number
  }) => void | Promise<void>
}

function getInitialState(profile = 'default') {
  return {
    profile,
    name: '',
    schedule: 'every 30m',
    prompt: '',
    skillsInput: '',
    deliver: ['local'] as Array<string>,
    repeatMode: 'unlimited' as 'unlimited' | 'limited',
    repeatCount: '1',
  }
}

export function CreateJobDialog({
  open,
  isSubmitting = false,
  profiles,
  onOpenChange,
  onSubmit,
}: CreateJobDialogProps) {
  const activeProfile =
    profiles.find((profile) => profile.active)?.name ?? profiles[0].name
  const [form, setForm] = useState(() => getInitialState(activeProfile))

  useEffect(() => {
    if (!open) {
      setForm(getInitialState(activeProfile))
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onOpenChange, activeProfile])

  useEffect(() => {
    if (open) {
      setForm((current) => {
        if (profiles.some((profile) => profile.name === current.profile))
          return current
        return { ...current, profile: activeProfile }
      })
    }
  }, [activeProfile, open, profiles])

  function toggleDelivery(target: string) {
    setForm((current) => {
      const nextDeliver = current.deliver.includes(target)
        ? current.deliver.filter((item) => item !== target)
        : [...current.deliver, target]

      return {
        ...current,
        deliver: nextDeliver,
      }
    })
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const skills = form.skillsInput
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean)

    void onSubmit({
      profile: form.profile,
      name: form.name.trim(),
      schedule: form.schedule.trim(),
      prompt: form.prompt.trim(),
      deliver: form.deliver.length > 0 ? form.deliver : undefined,
      skills: skills.length > 0 ? Array.from(new Set(skills)) : undefined,
      repeat:
        form.repeatMode === 'limited'
          ? Math.max(1, Number.parseInt(form.repeatCount, 10) || 1)
          : undefined,
    })
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="create-job-dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              onOpenChange(false)
            }
          }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0, 0, 0, 0.68)' }}
            onClick={() => onOpenChange(false)}
          />
          <motion.form
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onSubmit={handleFormSubmit}
            className="relative z-10 flex max-h-[85vh] w-[min(720px,96vw)] flex-col overflow-hidden rounded-2xl border shadow-2xl"
            style={{
              background: 'var(--theme-card)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text)',
            }}
          >
            <div
              className="flex items-start justify-between gap-4 border-b px-5 py-4"
              style={{ borderColor: 'var(--theme-border)' }}
            >
              <div>
                <h2 className="text-lg font-semibold">{t('jobs.dialog.create')}</h2>
                <p
                  className="mt-1 text-sm"
                  style={{ color: 'var(--theme-muted)' }}
                >
                  {t('jobs.dialog.createDesc')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-lg p-2 transition-colors"
                style={{ color: 'var(--theme-muted)' }}
                aria-label={t('jobs.dialog.closeCreate')}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
              <section className="space-y-2">
                <label className="text-sm font-medium">{t('jobs.dialog.profile')}</label>
                <select
                  value={form.profile}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      profile: event.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1"
                  style={{
                    background: 'var(--theme-input)',
                    borderColor: 'var(--theme-border)',
                    color: 'var(--theme-text)',
                  }}
                >
                  {profiles.map((profile) => (
                    <option key={profile.name} value={profile.name}>
                      {profile.name}
                      {profile.active ? ` ${t('jobs.dialog.profileActiveSuffix')}` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs" style={{ color: 'var(--theme-muted)' }}>
                  {t('jobs.dialog.profileHint')}
                </p>
              </section>

              <section className="space-y-2">
                <label className="text-sm font-medium">{t('jobs.dialog.nameLabel')}</label>
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder={t('jobs.dialog.namePlaceholder')}
                  required
                  className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1"
                  style={{
                    background: 'var(--theme-input)',
                    borderColor: 'var(--theme-border)',
                    color: 'var(--theme-text)',
                    boxShadow: '0 0 0 0 transparent',
                  }}
                />
              </section>

              <section className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium">{t('jobs.dialog.scheduleTitle')}</h3>
                  <p
                    className="mt-1 text-xs"
                    style={{ color: 'var(--theme-muted)' }}
                  >
                    {t('jobs.dialog.scheduleDesc')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SCHEDULE_PRESETS.map((preset) => {
                    const isActive = form.schedule === preset.value
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            schedule: preset.value,
                          }))
                        }
                        className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                        style={{
                          background: isActive
                            ? 'var(--theme-accent)'
                            : 'var(--theme-card)',
                          borderColor: isActive
                            ? 'var(--theme-accent)'
                            : 'var(--theme-border)',
                          color: isActive ? '#fff' : 'var(--theme-text)',
                        }}
                      >
                        {preset.label}
                      </button>
                    )
                  })}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('jobs.dialog.customSchedule')}</label>
                  <input
                    value={form.schedule}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        schedule: event.target.value,
                      }))
                    }
                    placeholder={t('jobs.dialog.customSchedulePlaceholder')}
                    required
                    className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1"
                    style={{
                      background: 'var(--theme-input)',
                      borderColor: 'var(--theme-border)',
                      color: 'var(--theme-text)',
                    }}
                  />
                  <p
                    className="text-xs"
                    style={{ color: 'var(--theme-muted)' }}
                  >
                    {t('jobs.dialog.cronAdvanced')}
                  </p>
                </div>
              </section>

              <section className="space-y-2">
                <label className="text-sm font-medium">{t('jobs.dialog.prompt')}</label>
                <textarea
                  value={form.prompt}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      prompt: event.target.value,
                    }))
                  }
                  placeholder={t('jobs.dialog.promptPlaceholder')}
                  required
                  rows={5}
                  className="w-full resize-none rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1"
                  style={{
                    background: 'var(--theme-input)',
                    borderColor: 'var(--theme-border)',
                    color: 'var(--theme-text)',
                  }}
                />
              </section>

              <section className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">{t('jobs.dialog.options')}</h3>
                  <p
                    className="mt-1 text-xs"
                    style={{ color: 'var(--theme-muted)' }}
                  >
                    {t('jobs.dialog.optionsDesc')}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('jobs.dialog.skills')}</label>
                  <input
                    value={form.skillsInput}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        skillsInput: event.target.value,
                      }))
                    }
                    placeholder={t('jobs.dialog.skillsPlaceholder')}
                    className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1"
                    style={{
                      background: 'var(--theme-input)',
                      borderColor: 'var(--theme-border)',
                      color: 'var(--theme-text)',
                    }}
                  />
                  <p
                    className="text-xs"
                    style={{ color: 'var(--theme-muted)' }}
                  >
                    {t('jobs.dialog.skillsHint')}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('jobs.dialog.deliverTo')}</label>
                  <div className="flex flex-wrap gap-2">
                    {DELIVERY_OPTIONS.map((option) => {
                      const isActive = form.deliver.includes(option)
                      const needsGateway =
                        option === 'telegram' || option === 'discord'
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleDelivery(option)}
                          title={
                            needsGateway
                              ? t('jobs.dialog.requiresGateway', { option })
                              : undefined
                          }
                          className="rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors"
                          style={{
                            background: isActive
                              ? 'var(--theme-accent)'
                              : 'var(--theme-card)',
                            borderColor: isActive
                              ? 'var(--theme-accent)'
                              : 'var(--theme-border)',
                            color: isActive
                              ? '#fff'
                              : needsGateway
                                ? 'var(--theme-muted)'
                                : 'var(--theme-text)',
                          }}
                        >
                          {option}
                          {needsGateway ? ' ⚡' : ''}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('jobs.dialog.repeat')}</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          repeatMode: 'unlimited',
                        }))
                      }
                      className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                      style={{
                        background:
                          form.repeatMode === 'unlimited'
                            ? 'var(--theme-accent)'
                            : 'var(--theme-card)',
                        borderColor:
                          form.repeatMode === 'unlimited'
                            ? 'var(--theme-accent)'
                            : 'var(--theme-border)',
                        color:
                          form.repeatMode === 'unlimited'
                            ? '#fff'
                            : 'var(--theme-text)',
                      }}
                    >
                      {t('jobs.dialog.repeatUnlimited')}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          repeatMode: 'limited',
                        }))
                      }
                      className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                      style={{
                        background:
                          form.repeatMode === 'limited'
                            ? 'var(--theme-accent)'
                            : 'var(--theme-card)',
                        borderColor:
                          form.repeatMode === 'limited'
                            ? 'var(--theme-accent)'
                            : 'var(--theme-border)',
                        color:
                          form.repeatMode === 'limited'
                            ? '#fff'
                            : 'var(--theme-text)',
                      }}
                    >
                      {t('jobs.dialog.repeatLimited')}
                    </button>
                  </div>
                  {form.repeatMode === 'limited' ? (
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={form.repeatCount}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          repeatCount: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1"
                      style={{
                        background: 'var(--theme-input)',
                        borderColor: 'var(--theme-border)',
                        color: 'var(--theme-text)',
                      }}
                    />
                  ) : null}
                </div>
              </section>
            </div>

            <div
              className="flex items-center justify-end gap-2 border-t px-5 py-4"
              style={{ borderColor: 'var(--theme-border)' }}
            >
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-xl px-4 py-2 text-sm transition-colors"
                style={{
                  background: 'var(--theme-card)',
                  color: 'var(--theme-muted)',
                }}
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !form.name.trim() ||
                  !form.schedule.trim() ||
                  !form.prompt.trim()
                }
                className="rounded-xl px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50"
                style={{ background: 'var(--theme-accent)' }}
              >
                {isSubmitting ? t('jobs.dialog.creating') : t('jobs.dialog.createBtn')}
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
