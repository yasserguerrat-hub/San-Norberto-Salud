import { RiskBadge } from '@/components/shared/badges/RiskBadge'
import type { SectorWithStats } from '../types/sector.types'

export function SectorDetailCard({ sector }: { sector: SectorWithStats }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-5 rounded-[10px] border border-border bg-card p-5">
      <div>
        <div className="mb-1.5 font-heading text-[15px] font-bold text-primary-dark">{sector.name}</div>
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
