import { riskThresholdsFixture } from '@/data/fixtures/riskThresholds.fixtures'
import type { RiskThreshold } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'

const store = [...riskThresholdsFixture]
const base = createInMemoryRepository<RiskThreshold>(store)

export interface RiskThresholdFilters {
  ambito?: RiskThreshold['ambito']
  diseaseId?: string
  sectorId?: string
}

export const riskThresholdsRepository = {
  ...base,
  list(filters?: RiskThresholdFilters) {
    return base.list((row) => {
      if (filters?.ambito && row.ambito !== filters.ambito) return false
      if (filters?.diseaseId && row.disease_id !== filters.diseaseId) return false
      if (filters?.sectorId && row.sector_id !== filters.sectorId) return false
      return true
    })
  },

  /** Resuelve el umbral más específico disponible para una enfermedad, con fallback al global. */
  async resolveForDisease(diseaseId: string | null): Promise<RiskThreshold> {
    const all = await base.list()
    const specific = diseaseId ? all.find((row) => row.ambito === 'enfermedad' && row.disease_id === diseaseId) : undefined
    const global = all.find((row) => row.ambito === 'global')
    if (!global) throw new Error('No existe un umbral de riesgo global configurado')
    return specific ?? global
  },
}
