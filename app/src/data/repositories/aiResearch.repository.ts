import { IS_DEMO_DATA } from '@/app/config/constants'
import { aiDataProposalsFixture } from '@/data/fixtures/aiDataProposals.fixtures'
import { aiResearchRequestsFixture } from '@/data/fixtures/aiResearchRequests.fixtures'
import type { AiDataProposal, AiResearchRequest } from '@/types/database.types'
import type { EstadoPropuestaIA, EstadoSolicitudIA } from '@/types/enums'
import { createInMemoryRepository } from './createInMemoryRepository'
import { createSupabaseRepository } from './createSupabaseRepository'

export interface AiResearchRequestFilters {
  estado?: EstadoSolicitudIA
}

export const aiResearchRequestsRepository = IS_DEMO_DATA
  ? (() => {
      const base = createInMemoryRepository<AiResearchRequest>([...aiResearchRequestsFixture])
      return {
        ...base,
        list(filters?: AiResearchRequestFilters) {
          return base.list((row) => (filters?.estado ? row.estado === filters.estado : true))
        },
      }
    })()
  : (() => {
      const base = createSupabaseRepository<AiResearchRequest>('ai_research_requests')
      return {
        ...base,
        list(filters?: AiResearchRequestFilters) {
          return base.list((query) => (filters?.estado ? query.eq('estado', filters.estado) : query))
        },
      }
    })()

export interface AiDataProposalFilters {
  estado?: EstadoPropuestaIA
  aiResearchRequestId?: string
}

export const aiDataProposalsRepository = IS_DEMO_DATA
  ? (() => {
      const base = createInMemoryRepository<AiDataProposal>([...aiDataProposalsFixture])
      return {
        ...base,
        list(filters?: AiDataProposalFilters) {
          return base.list((row) => {
            if (filters?.estado && row.estado !== filters.estado) return false
            if (filters?.aiResearchRequestId && row.ai_research_request_id !== filters.aiResearchRequestId) return false
            return true
          })
        },
      }
    })()
  : (() => {
      const base = createSupabaseRepository<AiDataProposal>('ai_data_proposals')
      return {
        ...base,
        list(filters?: AiDataProposalFilters) {
          return base.list((query) => {
            if (filters?.estado) query = query.eq('estado', filters.estado)
            if (filters?.aiResearchRequestId) query = query.eq('ai_research_request_id', filters.aiResearchRequestId)
            return query
          })
        },
      }
    })()
