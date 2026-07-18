import { riskSolidColorClassName } from '@/components/shared/badges/RiskBadge'
import { RISK_LABELS } from '@/lib/chart-colors'
import { cn } from '@/lib/utils'
import type { NivelRiesgo } from '@/types/enums'

const LEVELS: NivelRiesgo[] = ['bajo', 'medio', 'alto', 'extremo']

export function SectorMapLegend() {
  return (
    <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-3.5 text-xs text-foreground">
      {LEVELS.map((level) => (
        <div key={level} className="flex items-center gap-1.5">
          <span className={cn('size-2.5 rounded-[3px]', riskSolidColorClassName(level))} aria-hidden="true" />
          {RISK_LABELS[level]}
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-[3px] bg-[#9AA5AC]" aria-hidden="true" />
        Sin datos
      </div>
    </div>
  )
}
