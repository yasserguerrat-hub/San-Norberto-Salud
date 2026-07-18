import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { aiDataProposalsRepository } from '@/data/repositories/aiResearch.repository'
import { healthRecordsRepository } from '@/data/repositories/healthRecords.repository'
import { queryKeys } from '@/lib/query/queryKeys'
import type { AiDataProposal, HealthRecord } from '@/types/database.types'

export function usePendingHealthRecords() {
  return useQuery({
    queryKey: queryKeys.healthRecords.list({ estado: 'pendiente' }),
    queryFn: () => healthRecordsRepository.list({ estado: 'pendiente' }),
  })
}

export function usePendingAiProposals() {
  return useQuery({
    queryKey: queryKeys.aiDataProposals.list({ estado: 'propuesta' }),
    queryFn: () => aiDataProposalsRepository.list({ estado: 'propuesta' }),
  })
}

interface ReviewRecordInput {
  id: string
  decision: 'aprobado' | 'rechazado' | 'requiere_correccion'
  aprobado_por: string
  observacion_revision?: string
}

export function useReviewHealthRecord() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, decision, aprobado_por, observacion_revision }: ReviewRecordInput) =>
      healthRecordsRepository.update(id, {
        estado: decision,
        aprobado_por,
        fecha_aprobacion: decision === 'aprobado' ? new Date().toISOString() : null,
        observacion_revision: observacion_revision ?? null,
        actualizado_en: new Date().toISOString(),
      } as Partial<HealthRecord>),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.healthRecords.all }),
  })
}

interface ReviewProposalInput {
  id: string
  decision: 'aprobada' | 'rechazada'
  revisado_por: string
}

export function useReviewAiProposal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, decision, revisado_por }: ReviewProposalInput) =>
      aiDataProposalsRepository.update(id, {
        estado: decision,
        revisado_por,
        fecha_revision: new Date().toISOString(),
      } as Partial<AiDataProposal>),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.aiDataProposals.all }),
  })
}
