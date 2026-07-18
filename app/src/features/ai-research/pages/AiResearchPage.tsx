import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { DemoDataBadge } from '@/components/shared/badges/DemoDataBadge'
import { toastError, toastSuccess } from '@/components/shared/feedback/ToastHelpers'
import { QueryStateBoundary } from '@/components/shared/states/QueryStateBoundary'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { diseasesRepository } from '@/data/repositories/diseases.repository'
import { sectorsRepository } from '@/data/repositories/sectors.repository'
import { useCurrentProfile } from '@/features/auth/store/session.store'
import { formatDate } from '@/lib/formatters/date'
import { queryKeys } from '@/lib/query/queryKeys'
import { AiProposalCard } from '../components/AiProposalCard'
import { AiRequestForm } from '../components/AiRequestForm'
import { useAiDataProposals, useAiResearchRequests, useCreateAiResearchRequest } from '../hooks/useAiResearch'

const ESTADO_SOLICITUD_LABELS = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  completada: 'Completada',
  error: 'Error',
} as const

export function AiResearchPage() {
  const profile = useCurrentProfile()
  const requestsQuery = useAiResearchRequests()
  const proposalsQuery = useAiDataProposals()
  const diseasesQuery = useQuery({ queryKey: queryKeys.diseases.list(), queryFn: () => diseasesRepository.list() })
  const sectorsQuery = useQuery({ queryKey: queryKeys.sectors.list(), queryFn: () => sectorsRepository.list() })
  const createRequest = useCreateAiResearchRequest()
  const [dialogOpen, setDialogOpen] = useState(false)

  const diseaseById = new Map((diseasesQuery.data ?? []).map((d) => [d.id, d.nombre]))
  const sectorById = new Map((sectorsQuery.data ?? []).map((s) => [s.id, s.nombre]))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Investigación asistida por un proveedor de IA configurable (agnóstico de proveedor). Toda propuesta requiere
          aprobación explícita en el Centro de Aprobaciones antes de convertirse en dato oficial.
        </p>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="size-3.5" aria-hidden="true" />
            Nueva investigación
          </Button>
          <DemoDataBadge />
        </div>
      </div>

      <QueryStateBoundary query={requestsQuery} emptyTitle="Todavía no se han solicitado investigaciones">
        {(requests) => (
          <div className="flex flex-col gap-4">
            {[...requests]
              .sort((a, b) => b.creado_en.localeCompare(a.creado_en))
              .map((request) => {
                const proposals = (proposalsQuery.data ?? []).filter((p) => p.ai_research_request_id === request.id)
                return (
                  <div key={request.id} className="rounded-[10px] border border-border bg-card p-4">
                    <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{request.pregunta}</p>
                        {request.contexto ? <p className="mt-1 text-xs text-muted-foreground">{request.contexto}</p> : null}
                      </div>
                      <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                        {ESTADO_SOLICITUD_LABELS[request.estado]}
                      </span>
                    </div>
                    <p className="mb-3 text-[11px] text-muted-foreground">
                      Solicitado el {formatDate(request.creado_en)} · proveedor configurado en el servidor
                    </p>
                    {proposals.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {proposals.map((proposal) => (
                          <AiProposalCard
                            key={proposal.id}
                            proposal={proposal}
                            diseaseName={proposal.disease_id ? diseaseById.get(proposal.disease_id) : undefined}
                            sectorName={proposal.sector_id ? sectorById.get(proposal.sector_id) : undefined}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Sin propuestas generadas todavía.</p>
                    )}
                  </div>
                )
              })}
          </div>
        )}
      </QueryStateBoundary>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nueva investigación asistida</DialogTitle>
          </DialogHeader>
          <AiRequestForm
            isSubmitting={createRequest.isPending}
            onCancel={() => setDialogOpen(false)}
            onSubmit={async (values) => {
              if (!profile) return
              try {
                await createRequest.mutateAsync({ ...values, solicitado_por: profile.id })
                toastSuccess('Solicitud enviada', 'El proveedor de IA la procesará y generará propuestas para revisión.')
                setDialogOpen(false)
              } catch (error) {
                toastError('No se pudo enviar la solicitud', error instanceof Error ? error.message : undefined)
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
