import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IS_DEMO_DATA } from '@/app/config/constants'
import { aiDataProposalsRepository, aiResearchRequestsRepository } from '@/data/repositories/aiResearch.repository'
import { supabase } from '@/lib/supabaseClient'
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

export function useCreateAiResearchRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateRequestInput) => {
      // RF-21/RF-26: en modo demo se simula la solicitud "pendiente" localmente. Contra Supabase
      // real, la Edge Function ai-research hace todo el trabajo del lado del servidor (resolver
      // el proveedor configurado, investigar, y crear la propuesta ya en estado "propuesta" —
      // RF-22 se aplica ahí, no en el frontend).
      if (IS_DEMO_DATA) {
        return aiResearchRequestsRepository.create({
          pregunta: input.pregunta,
          contexto: input.contexto ?? null,
          estado: 'pendiente',
          proveedor: 'proveedor-ia-demo',
          solicitado_por: input.solicitado_por,
          creado_en: new Date().toISOString(),
        })
      }

      const { data, error } = await supabase.functions.invoke('ai-research', {
        body: { pregunta: input.pregunta, contexto: input.contexto },
      })
      if (error) {
        let message = error.message
        if ('context' in error && error.context instanceof Response) {
          const detail = await error.context.json().catch(() => null)
          if (detail?.error) message = detail.error
        }
        throw new Error(message)
      }
      return data.request
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.aiResearchRequests.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.aiDataProposals.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dataSources.all })
    },
  })
}
