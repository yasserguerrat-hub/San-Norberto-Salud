import { riskSolidColorClassName } from '@/components/shared/badges/RiskBadge'
import { cn } from '@/lib/utils'
import type { NivelRiesgo } from '@/types/enums'

interface SectorMapTileProps {
  name: string
  riskLevel: NivelRiesgo
  sizePx: number
  selected?: boolean
  onClick?: () => void
}

export function SectorMapTile({ name, riskLevel, sizePx, selected, onClick }: SectorMapTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={`${name} — riesgo ${riskLevel}`}
      style={{ width: sizePx, height: sizePx }}
      className={cn(
        'flex cursor-pointer items-center justify-center rounded-2xl border-0 p-2 text-center transition-transform duration-200 outline-offset-2 hover:scale-[1.06] hover:shadow-elevate-sm',
        riskSolidColorClassName(riskLevel),
        selected && 'outline outline-[3px] outline-primary-dark',
      )}
    >
      <span className="text-xs font-bold text-white [text-shadow:0_1px_2px_rgba(0,0,0,.25)]">{name}</span>
    </button>
  )
}
