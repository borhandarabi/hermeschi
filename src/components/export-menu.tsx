'use client'

import { useCallback, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Download01Icon } from '@hugeicons/core-free-icons'

import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@/components/ui/menu'
import {
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { t, type TranslationKey } from '@/lib/i18n'

type ExportFormat = 'markdown' | 'json' | 'text'

type ExportMenuProps = {
  onExport: (format: ExportFormat) => void
  disabled?: boolean
}

const formats: Array<{ format: ExportFormat; labelKey: TranslationKey; ext: string }> = [
  { format: 'markdown', labelKey: 'exportMenu.markdown', ext: '.md' },
  { format: 'json', labelKey: 'exportMenu.json', ext: '.json' },
  { format: 'text', labelKey: 'exportMenu.plainText', ext: '.txt' },
]

export function ExportMenu({ onExport, disabled }: ExportMenuProps) {
  const [open, setOpen] = useState(false)
  const handleOpenChange = useCallback(
    function handleOpenChange(nextOpen: boolean) {
      if (disabled) return
      setOpen(nextOpen)
    },
    [disabled],
  )

  return (
    <MenuRoot open={disabled ? false : open} onOpenChange={handleOpenChange}>
      <TooltipProvider>
        <TooltipRoot>
          <TooltipTrigger
            render={
              <MenuTrigger
                type="button"
                className={cn(
                  buttonVariants({ size: 'icon-sm', variant: 'ghost' }),
                )}
                aria-label={t('exportMenu.downloadConversation')}
                aria-disabled={disabled ? true : undefined}
              >
                <HugeiconsIcon
                  icon={Download01Icon}
                  size={20}
                  strokeWidth={1.5}
                />
              </MenuTrigger>
            }
          />
          <TooltipContent side="top">{t('exportMenu.download')}</TooltipContent>
        </TooltipRoot>
      </TooltipProvider>
      <MenuContent side="bottom" align="end">
        {formats.map(function renderFormat({ format, labelKey, ext }) {
          return (
            <MenuItem
              key={format}
              onClick={function onClick() {
                onExport(format)
              }}
              className="justify-between"
            >
              <span>{t(labelKey)}</span>
              <span className="text-xs text-primary-600 tabular-nums">
                {ext}
              </span>
            </MenuItem>
          )
        })}
      </MenuContent>
    </MenuRoot>
  )
}
