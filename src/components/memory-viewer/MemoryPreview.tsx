import { HugeiconsIcon } from '@hugeicons/react'
import { EyeIcon } from '@hugeicons/core-free-icons'
import { Markdown } from '@/components/prompt-kit/markdown'
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from '@/components/ui/scroll-area'
import { t } from '@/lib/i18n'

type MemoryPreviewProps = {
  path: string | null
  content: string
}

function MemoryPreview({ path, content }: MemoryPreviewProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col bg-primary-100/30">
      <header className="border-b border-primary-200 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={EyeIcon} size={20} strokeWidth={1.5} />
          <h2 className="text-sm font-medium text-balance text-primary-900">
            {t('memoryPreview.preview')}
          </h2>
        </div>
        <p className="text-xs text-primary-600 text-pretty tabular-nums">
          {path || t('memoryPreview.selectPrompt')}
        </p>
      </header>
      <ScrollAreaRoot className="min-h-0 flex-1">
        <ScrollAreaViewport className="h-full">
          <div className="p-4">
            <Markdown className="text-sm">{content || t('memoryPreview.noContent')}</Markdown>
          </div>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar orientation="vertical">
          <ScrollAreaThumb />
        </ScrollAreaScrollbar>
        <ScrollAreaCorner />
      </ScrollAreaRoot>
    </section>
  )
}

export { MemoryPreview }
