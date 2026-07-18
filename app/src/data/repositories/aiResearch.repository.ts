import { aiDataProposalsFixture } from '@/data/fixtures/aiDataProposals.fixtures'
import { aiResearchRequestsFixture } from '@/data/fixtures/aiResearchRequests.fixtures'
import type { AiDataProposal, AiResearchRequest } from '@/types/database.types'
import type { EstadoPropuestaIA, EstadoSolicitudIA } from '@/types/enums'
import { createInMemoryRepository } from './createInMemoryRepository'

const requestsStore = [...aiResearchRequestsFixture]
const requestsBase = createInMemoryRepository<AiResearchRequest>(requestsStore)

export const aiResearchRequestsRepository = {
  ...requestsBase,
  list(filters?: { estado?: EstadoSolicitudIA }) {
    return requestsBase.list((row) => (filters?.estado ? row.estado === filters.estado : true))
  },
}

const proposalsStore = [...aiDataProposalsFixture]
const proposalsBase = createInMemoryRepository<AiDataProposal>(proposalsStore)

export const aiDataProposalsRepository = {
  ...proposalsBase,
  list(filters?: { estado?: EstadoPropuestaIA; aiResearchRequestId?: string }) {
    return proposalsBase.list((row) => {
      if (filters?.estado && row.estado !== filters.estado) return false
      if (filters?.aiResearchRequestId && row.ai_research_request_id !== filters.aiResearchRequestId) return false
      return true
    })
  },
}
