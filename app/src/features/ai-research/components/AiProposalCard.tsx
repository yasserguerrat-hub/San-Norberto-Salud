import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AiDataProposal } from '@/types/database.types'

const ESTADO_LABELS: Record<AiDataProposal['estado'], string> = {
  propuesta: 'Propuesta (pendiente de revisión)',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
}

const ESTADO_CLASSNAME: Record<AiDataProposal['estado'], string> = {
  propuesta: 'border-risk-medium/40 bg-risk-medium/10 text-[#8a6a12]',
  aprobada: 'border-secondary/40 bg-secondary/10 text-secondary',
  rechazada: 'border-destructive/40 bg-destructive/10 text-destructive',
}

// RF-23: toda predicción/propuesta de IA se distingue visualmente de los datos reales — borde
// punteado + ícono + rótulo, nunca con el mismo estilo que una tarjeta de dato aprobado.
export function AiProposalCard({ proposal, diseaseName, sectorName }: { proposal: AiDataProposal; diseaseName?: string; sectorName?: string }) {
  return (
    <div className="rounded-[10px] border-2 border-dashed border-secondary/40 bg-secondary/5 p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-secondary uppercase">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Propuesta generada por IA
        </span>
        <span className={cn('rounded-full border px-2 py-0.5 text-[11px] font-semibold', ESTADO_CLASSNAME[proposal.estado])}>
          {ESTADO_LABELS[proposal.estado]}
        </span>
      </div>
      <p className="mb-2 text-sm text-foreground">{proposal.resumen}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {diseaseName ? <span>Enfermedad: {diseaseName}</span> : null}
        {sectorName ? <span>Sector: {sectorName}</span> : null}
        {proposal.anio ? <span>Año: {proposal.anio}</span> : null}
        <span>Confianza: {proposal.nivel_confianza}</span>
        <span>Variables: {proposal.variables_utilizadas.join(', ')}</span>
      </div>
    </div>
  )
}
