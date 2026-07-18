import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/toast'
import { steerAgent } from '@/lib/gateway-api'
import { t } from '@/lib/i18n'

type SteerModalProps = {
  open: boolean
  agentName: string
  sessionKey?: string
  onOpenChange: (open: boolean) => void
}

export function SteerModal({
  open,
  agentName,
  sessionKey,
  onOpenChange,
}: SteerModalProps) {
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!open) {
      setMessage('')
      setPending(false)
    }
  }, [open])

  async function handleSend() {
    const trimmedMessage = message.trim()
    const normalizedSessionKey = sessionKey?.trim() ?? ''
    if (!trimmedMessage || !normalizedSessionKey || pending) return

    setPending(true)
    try {
      await steerAgent(normalizedSessionKey, trimmedMessage)
      toast(t('steer.sentToast', { name: agentName }), { type: 'success' })
      setMessage('')
      onOpenChange(false)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t('steer.failedToast')
      toast(message, { type: 'error' })
    } finally {
      setPending(false)
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(560px,92vw)]">
        <div className="space-y-4 p-5">
          <div className="space-y-1">
            <DialogTitle className="text-base">{t('steer.title', { name: agentName })}</DialogTitle>
            <DialogDescription>
              {t('steer.description')}
            </DialogDescription>
          </div>

          <textarea
            value={message}
            rows={5}
            placeholder={t('steer.placeholder')}
            disabled={pending}
            onChange={function onChangeMessage(event) {
              setMessage(event.target.value)
            }}
            className="w-full resize-y rounded-lg border border-primary-200 bg-primary-100/70 px-3 py-2 text-sm text-primary-900 outline-none transition-colors focus:border-accent-400 disabled:cursor-not-allowed disabled:opacity-70"
          />

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={function onClickCancel() {
                onOpenChange(false)
              }}
            >
              {t('steer.cancel')}
            </Button>
            <Button
              size="sm"
              disabled={pending || message.trim().length === 0 || !sessionKey}
              onClick={function onClickSend() {
                void handleSend()
              }}
              className="bg-accent-500 text-white hover:bg-accent-600"
            >
              {pending ? t('steer.sending') : t('steer.send')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  )
}
