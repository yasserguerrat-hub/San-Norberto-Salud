import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { aiDataProposalsRepository, aiResearchRequestsRepository } from '@/data/repositories/aiResearch.repository'
import { queryKeys } from '@/lib/query/queryKeys'

export function useAiResearchRequests() {
  return useQuery({ queryKey: queryKeys.aiResearchRequests.list(), queryFn: () => aiResearchRequestsRepository.list() })
}

export function useAiDataProposals() {
  return useQuery({ queryKey: queryKeys.aiDataProposals.list(), queryFn: () => aiDataProposalsRepository.list() })
}

interface CreateRequestInput {
  pregunta: string
  contexto?: string
  solicitado_por: string
}

// RF-21/RF-26: la solicitud queda "pendiente" — el procesamiento real ocurre en el adaptador de
// IA del servidor (agnóstico de proveedor), fuera del alcance de esta etapa solo-frontend.
export function useCreateAiResearchRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateRequestInput) =>
      aiResearchRequestsRepository.create({
        pregunta: input.pregunta,
        contexto: input.contexto ?? null,
        estado: 'pendiente',
        proveedor: 'proveedor-ia-demo',
        solicitado_por: input.solicitado_por,
        creado_en: new Date().toISOString(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.aiResearchRequests.all }),
  })
}
