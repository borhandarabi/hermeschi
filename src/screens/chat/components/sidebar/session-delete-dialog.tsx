'use client'

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogRoot,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { t } from '@/lib/i18n'

type SessionDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionTitle: string
  onConfirm: () => void
  onCancel: () => void
}

export function SessionDeleteDialog({
  open,
  onOpenChange,
  sessionTitle,
  onConfirm,
  onCancel,
}: SessionDeleteDialogProps) {
  return (
    <AlertDialogRoot open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <div className="p-4">
          <AlertDialogTitle className="mb-1">{t('chat.session.deleteTitle')}</AlertDialogTitle>
          <AlertDialogDescription className="mb-4">
            {t('chat.session.deleteConfirmDesc', { title: sessionTitle })}
          </AlertDialogDescription>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel onClick={onCancel}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>{t('chat.session.deleteCta')}</AlertDialogAction>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialogRoot>
  )
}
