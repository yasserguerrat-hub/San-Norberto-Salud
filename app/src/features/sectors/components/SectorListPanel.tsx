import { riskSolidColorClassName } from '@/components/shared/badges/RiskBadge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { SectorWithStats } from '../types/sector.types'

interface SectorListPanelProps {
  sectors: SectorWithStats[]
  search: string
  onSearchChange: (value: string) => void
  selectedId: string | null
  onSelect: (id: string) => void
}

export function SectorListPanel({ sectors, search, onSearchChange, selectedId, onSelect }: SectorListPanelProps) {
  const filtered = sectors.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="rounded-[10px] border border-border bg-card p-4">
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar sector…"
        aria-label="Buscar sector"
        className="mb-3"
      />
      <div className="flex max-h-[480px] flex-col gap-1.5 overflow-y-auto">
        {filtered.map((sector) => {
          const isSelected = selectedId === sector.id
          return (
            <button
              key={sector.id}
              type="button"
              onClick={() => onSelect(sector.id)}
              className={cn(
                'cursor-pointer rounded-lg border p-2.5 text-left transition-transform hover:translate-x-[3px]',
                isSelected ? 'border-secondary bg-accent' : 'border-border bg-card',
              )}
            >
              <div className="mb-0.5 flex items-center justify-between gap-2">
                <span className="text-[13px] font-semibold text-foreground">{sector.name}</span>
                {sector.riesgo ? (
                  <span className={cn('size-2 shrink-0 rounded-full', riskSolidColorClassName(sector.riesgo))} aria-hidden="true" />
                ) : null}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {sector.tipo} · {sector.poblacionFmt} hab. · riesgo {sector.riesgo ?? 'sin datos'}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
