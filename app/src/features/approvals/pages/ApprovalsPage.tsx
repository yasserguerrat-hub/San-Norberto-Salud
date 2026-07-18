import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { DemoDataBadge } from '@/components/shared/badges/DemoDataBadge'
import { toastError, toastSuccess } from '@/components/shared/feedback/ToastHelpers'
import { QueryStateBoundary } from '@/components/shared/states/QueryStateBoundary'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { ageRangesRepository } from '@/data/repositories/ageRanges.repository'
import { clinicsRepository } from '@/data/repositories/clinics.repository'
import { diseasesRepository } from '@/data/repositories/diseases.repository'
import { genderCategoriesRepository } from '@/data/repositories/genderCategories.repository'
import { sectorsRepository } from '@/data/repositories/sectors.repository'
import { useCurrentProfile } from '@/features/auth/store/session.store'
import { useConfirm } from '@/hooks/useConfirm'
import { formatDate } from '@/lib/formatters/date'
import { queryKeys } from '@/lib/query/queryKeys'
import type { AiDataProposal, HealthRecord } from '@/types/database.types'
import { ApprovalQueueTable } from '../components/ApprovalQueueTable'
import {
  usePendingAiProposals,
  usePendingHealthRecords,
  useReviewAiProposal,
  useReviewHealthRecord,
} from '../hooks/useApprovals'

export function ApprovalsPage() {
  const profile = useCurrentProfile()
  const recordsQuery = usePendingHealthRecords()
  const proposalsQuery = usePendingAiProposals()
  const diseasesQuery = useQuery({ queryKey: queryKeys.diseases.list(), queryFn: () => diseasesRepository.list() })
  const ageRangesQuery = useQuery({ queryKey: queryKeys.ageRanges.list(), queryFn: () => ageRangesRepository.list() })
  const gendersQuery = useQuery({ queryKey: queryKeys.genderCategories.list(), queryFn: () => genderCategoriesRepository.list() })
  const sectorsQuery = useQuery({ queryKey: queryKeys.sectors.list(), queryFn: () => sectorsRepository.list() })
  const clinicsQuery = useQuery({ queryKey: queryKeys.clinics.list(), queryFn: () => clinicsRepository.list() })

  const reviewRecord = useReviewHealthRecord()
  const reviewProposal = useReviewAiProposal()
  const confirm = useConfirm()

  const [reasonDialog, setReasonDialog] = useState<{ record: HealthRecord; decision: 'rechazado' | 'requiere_correccion' } | null>(null)
  const [reason, setReason] = useState('')

  const diseaseById = new Map((diseasesQuery.data ?? []).map((d) => [d.id, d.nombre]))
  const sectorById = new Map((sectorsQuery.data ?? []).map((s) => [s.id, s.nombre]))

  const handleApprove = async (record: HealthRecord) => {
    if (!profile) return
    const confirmed = await confirm({
      title: '¿Aprobar este registro?',
      description: 'Pasará a alimentar los indicadores oficiales y el dashboard de inmediato.',
      confirmLabel: 'Aprobar',
    })
    if (!confirmed) return
    try {
      await reviewRecord.mutateAsync({ id: record.id, decision: 'aprobado', aprobado_por: profile.id })
      toastSuccess('Registro aprobado')
    } catch (error) {
      toastError('No se pudo aprobar', error instanceof Error ? error.message : undefined)
    }
  }

  const submitReason = async () => {
    if (!reasonDialog || !profile) return
    if (!reason.trim()) {
      toastError('Indica un motivo antes de continuar')
      return
    }
    try {
      await reviewRecord.mutateAsync({
        id: reasonDialog.record.id,
        decision: reasonDialog.decision,
        aprobado_por: profile.id,
        observacion_revision: reason.trim(),
      })
      toastSuccess(reasonDialog.decision === 'rechazado' ? 'Registro rechazado' : 'Se solicitó corrección')
      setReasonDialog(null)
      setReason('')
    } catch (error) {
      toastError('No se pudo guardar la revisión', error instanceof Error ? error.message : undefined)
    }
  }

  const handleApproveProposal = async (proposal: AiDataProposal) => {
    if (!profile) return
    const confirmed = await confirm({
      title: '¿Aprobar esta propuesta de IA?',
      description: 'Ninguna propuesta de IA se guarda en tablas definitivas sin esta aprobación explícita (RF-22).',
      confirmLabel: 'Aprobar propuesta',
    })
    if (!confirmed) return
    try {
      await reviewProposal.mutateAsync({ id: proposal.id, decision: 'aprobada', revisado_por: profile.id })
      toastSuccess('Propuesta aprobada')
    } catch (error) {
      toastError('No se pudo aprobar', error instanceof Error ? error.message : undefined)
    }
  }

  const handleRejectProposal = async (proposal: AiDataProposal) => {
    if (!profile) return
    const confirmed = await confirm({
      title: '¿Rechazar esta propuesta de IA?',
      variant: 'destructive',
      confirmLabel: 'Rechazar',
    })
    if (!confirmed) return
    try {
      await reviewProposal.mutateAsync({ id: proposal.id, decision: 'rechazada', revisado_por: profile.id })
      toastSuccess('Propuesta rechazada')
    } catch (error) {
      toastError('No se pudo rechazar', error instanceof Error ? error.message : undefined)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Centro de Aprobaciones — ningún registro ni propuesta de IA impacta reportes oficiales sin revisión (RF-12, RF-22).
        </p>
        <DemoDataBadge />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-sm font-bold text-foreground">Registros pendientes</h2>
        <QueryStateBoundary query={recordsQuery} emptyTitle="No hay registros pendientes de revisión">
          {(records) => (
            <ApprovalQueueTable
              records={records}
              diseases={diseasesQuery.data ?? []}
              ageRanges={ageRangesQuery.data ?? []}
              genders={gendersQuery.data ?? []}
              sectors={sectorsQuery.data ?? []}
              clinics={clinicsQuery.data ?? []}
              onApprove={handleApprove}
              onReject={(record) => setReasonDialog({ record, decision: 'rechazado' })}
              onRequestCorrection={(record) => setReasonDialog({ record, decision: 'requiere_correccion' })}
            />
          )}
        </QueryStateBoundary>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-sm font-bold text-foreground">Propuestas de investigación asistida por IA</h2>
        <QueryStateBoundary query={proposalsQuery} emptyTitle="No hay propuestas de IA pendientes">
          {(proposals) => (
            <div className="flex flex-col gap-3">
              {proposals.map((proposal) => (
                <div key={proposal.id} className="rounded-[10px] border border-border bg-card p-4">
                  <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        {proposal.disease_id ? (diseaseById.get(proposal.disease_id) ?? 'General') : 'General'}
                        {proposal.sector_id ? ` · ${sectorById.get(proposal.sector_id) ?? ''}` : ''}
                      </div>
                      <div className="text-xs text-muted-foreground">{formatDate(proposal.creado_en)}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleRejectProposal(proposal)}>
                        Rechazar
                      </Button>
                      <Button size="sm" onClick={() => handleApproveProposal(proposal)}>
                        Aprobar
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-foreground">{proposal.resumen}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Nivel de confianza: {proposal.nivel_confianza}</p>
                </div>
              ))}
            </div>
          )}
        </QueryStateBoundary>
      </section>

      <Dialog open={!!reasonDialog} onOpenChange={(open) => !open && setReasonDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{reasonDialog?.decision === 'rechazado' ? 'Rechazar registro' : 'Solicitar corrección'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3.5">
            <Field>
              <FieldLabel htmlFor="motivo">Motivo</FieldLabel>
              <Textarea id="motivo" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
            </Field>
            <div className="flex justify-end gap-2 border-t border-border pt-3.5">
              <Button variant="outline" onClick={() => setReasonDialog(null)}>
                Cancelar
              </Button>
              <Button variant={reasonDialog?.decision === 'rechazado' ? 'destructive' : 'default'} onClick={submitReason}>
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
