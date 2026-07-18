import { t } from '@/lib/i18n'

type InventoryRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

type InventoryItem = {
  id: string
  name: string
  icon: string
  rarity: InventoryRarity
  slot?: string
  quantity?: number
  description: string
}

type InventoryPanelProps = {
  items?: InventoryItem[]
  onEquip?: (item: InventoryItem) => void
}

const RARITY_STYLES: Record<InventoryRarity, { label: string; border: string; glow: string; text: string }> = {
  common: { label: t('playground.rarity.common'), border: '#8b7355', glow: 'rgba(139,115,85,.28)', text: '#d7c7a4' },
  uncommon: { label: t('playground.rarity.uncommon'), border: '#5eead4', glow: 'rgba(94,234,212,.22)', text: '#99f6e4' },
  rare: { label: t('playground.rarity.rare'), border: '#60a5fa', glow: 'rgba(96,165,250,.28)', text: '#bfdbfe' },
  epic: { label: t('playground.rarity.epic'), border: '#c084fc', glow: 'rgba(192,132,252,.28)', text: '#e9d5ff' },
  legendary: { label: t('playground.rarity.legendary'), border: '#fbbf24', glow: 'rgba(251,191,36,.35)', text: '#fde68a' },
}

const DEFAULT_ITEMS: InventoryItem[] = [
  { id: 'training-blade', name: t('playground.item.trainingBlade.name'), icon: '🗡️', rarity: 'rare', slot: t('playground.itemSlot.weapon'), description: t('playground.item.trainingBlade.desc') },
  { id: 'novice-cloak', name: t('playground.item.noviceCloak.name'), icon: '🧥', rarity: 'uncommon', slot: t('playground.itemSlot.armor'), description: t('playground.item.noviceCloak.desc') },
  { id: 'hermes-sigil', name: t('playground.item.hermesSigil.name'), icon: '✦', rarity: 'epic', slot: t('playground.itemSlot.relic'), description: t('playground.item.hermesSigil.desc') },
  { id: 'aether-vial', name: t('playground.item.aetherVial.name'), icon: '🧪', rarity: 'legendary', quantity: 3, description: t('playground.item.aetherVial.desc') },
  { id: 'bronze-coins', name: t('playground.item.bronzeCoins.name'), icon: '🪙', rarity: 'common', quantity: 128, description: t('playground.item.bronzeCoins.desc') },
  { id: 'map-fragment', name: t('playground.item.mapFragment.name'), icon: '🗺️', rarity: 'uncommon', description: t('playground.item.mapFragment.desc') },
]

function inventorySlots(items: InventoryItem[]): Array<InventoryItem | null> {
  return Array.from({ length: 24 }, (_, index) => items[index] ?? null)
}

export function InventoryPanel({ items = DEFAULT_ITEMS, onEquip }: InventoryPanelProps) {
  return (
    <section
      aria-label={t('playground.inventoryPanel.ariaLabel')}
      className="w-[min(94vw,520px)] rounded-[28px] border border-[#d9b35f]/45 bg-[linear-gradient(180deg,rgba(23,18,12,.96),rgba(5,5,10,.94))] p-4 text-[#f9e7b5] shadow-[0_28px_90px_rgba(0,0,0,.62),inset_0_1px_0_rgba(255,255,255,.10)] backdrop-blur-xl"
    >
      <header className="mb-3 flex items-center justify-between gap-3 border-b border-[#d9b35f]/25 pb-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d9b35f]/70">{t('playground.inventoryPanel.satchel')}</p>
          <h2 className="font-serif text-2xl font-black tracking-tight text-[#ffe7a3]">{t('playground.inventoryPanel.title')}</h2>
        </div>
        <div className="rounded-full border border-[#d9b35f]/35 bg-black/35 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#d9b35f]">
          {t('playground.inventoryPanel.gridLabel')}
        </div>
      </header>

      <div role="grid" aria-label={t('playground.inventoryPanel.slotsAria')} className="grid grid-cols-6 gap-2">
        {inventorySlots(items).map((item, index) => {
          const rarity = item ? RARITY_STYLES[item.rarity] : null
          return (
            <button
              key={item?.id ?? `empty-${index}`}
              role="gridcell"
              aria-label={item ? t('playground.inventoryPanel.equipAria', { name: item.name, rarity: item.rarity }) : t('playground.inventoryPanel.emptyAria', { index: index + 1 })}
              data-rarity={item?.rarity ?? 'empty'}
              draggable={Boolean(item)}
              onDragStart={(event) => {
                if (!item) return
                event.dataTransfer.setData('application/x-hermes-inventory-item', item.id)
                event.dataTransfer.effectAllowed = 'move'
              }}
              onDoubleClick={() => item && onEquip?.(item)}
              className="group relative aspect-square rounded-2xl border bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,.13),transparent_42%),linear-gradient(180deg,rgba(41,31,18,.86),rgba(5,5,10,.92))] p-1.5 text-center transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/60"
              style={{
                borderColor: rarity?.border ?? 'rgba(217,179,95,.18)',
                boxShadow: item ? `0 0 18px ${rarity?.glow}, inset 0 0 0 1px rgba(255,255,255,.06)` : 'inset 0 0 0 1px rgba(255,255,255,.03)',
              }}
            >
              {item ? (
                <>
                  <span className="flex h-full items-center justify-center rounded-xl bg-black/20 text-2xl sm:text-3xl" aria-hidden>
                    {item.icon}
                  </span>
                  {item.quantity ? <span className="absolute bottom-1 right-1 rounded-full bg-black/70 px-1.5 text-[10px] font-black text-white">{item.quantity}</span> : null}
                  <span className="pointer-events-none absolute left-1/2 top-[calc(100%+.45rem)] z-20 hidden w-52 -translate-x-1/2 rounded-xl border border-[#d9b35f]/35 bg-[#07050b]/95 p-2 text-left shadow-2xl group-hover:block group-focus:block">
                    <span className="block text-xs font-black text-[#ffe7a3]">{item.name}</span>
                    <span className="block text-[10px] uppercase tracking-[0.18em]" style={{ color: rarity?.text }}>{rarity?.label}</span>
                    {item.slot ? <span className="block text-[11px] text-white/62">{t('playground.inventoryPanel.slotLabel', { slot: item.slot })}</span> : null}
                    <span className="mt-1 block text-[11px] leading-snug text-[#f9e7b5]/78">{item.description}</span>
                  </span>
                </>
              ) : (
                <span className="flex h-full items-center justify-center rounded-xl border border-dashed border-[#d9b35f]/10 text-lg text-[#d9b35f]/18">＋</span>
              )}
            </button>
          )
        })}
      </div>

      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#f9e7b5]/58">
        <span>{t('playground.inventoryPanel.footerHint')}</span>
        <span className="text-[#d9b35f]/80">{t('playground.inventoryPanel.slotsCount')}</span>
      </footer>
    </section>
  )
}
