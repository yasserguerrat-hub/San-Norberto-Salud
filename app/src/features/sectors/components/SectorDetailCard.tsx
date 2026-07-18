import { Pencil, Trash2 } from 'lucide-react'
import { RiskBadge } from '@/components/shared/badges/RiskBadge'
import { Button } from '@/components/ui/button'
import type { SectorWithStats } from '../types/sector.types'

interface SectorDetailCardProps {
  sector: SectorWithStats
  canManage?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function SectorDetailCard({ sector, canManage, onEdit, onDelete }: SectorDetailCardProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-5 rounded-[10px] border border-border bg-card p-5">
      <div>
        <div className="mb-1.5 flex items-center gap-1.5">
          <span className="font-heading text-[15px] font-bold text-primary-dark">{sector.name}</span>
          {canManage ? (
            <div className="flex items-center gap-0.5">
              <Button size="icon-sm" variant="ghost" disabled={!onEdit} onClick={onEdit} aria-label={`Editar ${sector.name}`}>
                <Pencil className="size-3.5" aria-hidden="true" />
              </Button>
              <Button size="icon-sm" variant="ghost" disabled={!onDelete} onClick={onDelete} aria-label={`Eliminar ${sector.name}`}>
                <Trash2 className="size-3.5 text-destructive" aria-hidden="true" />
              </Button>
            </div>
          ) : null}
        </div>
        <div className="mb-0.5 text-[13px] text-muted-foreground">
          {sector.tipo} · {sector.poblacionFmt} habitantes
        </div>
        <div className="text-[13px] text-muted-foreground">
          Enfermedad principal: {sector.enfermedadPrincipal ?? 'sin registros'} ({sector.casos} casos)
        </div>
      </div>
      <div className="text-right">
        <div className="mb-1 text-[11px] text-muted-foreground">Tasa por 100.000 hab.</div>
        <div className="mb-2 font-heading text-[22px] font-bold text-primary-dark">{sector.tasaLabel}</div>
        {sector.riesgo ? <RiskBadge level={sector.riesgo} /> : null}
      </div>
    </div>
  )
}
