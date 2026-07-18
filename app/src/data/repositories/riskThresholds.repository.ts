import { IS_DEMO_DATA } from '@/app/config/constants'
import { riskThresholdsFixture } from '@/data/fixtures/riskThresholds.fixtures'
import type { RiskThreshold } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'
import { createSupabaseRepository } from './createSupabaseRepository'

export interface RiskThresholdFilters {
  ambito?: RiskThreshold['ambito']
  diseaseId?: string
  sectorId?: string
}

/** Resuelve el umbral más específico disponible para una enfermedad, con fallback al global. */
function resolveForDiseaseFrom(all: RiskThreshold[], diseaseId: string | null): RiskThreshold {
  const specific = diseaseId
    ? all.find((row) => row.ambito === 'enfermedad' && row.disease_id === diseaseId)
    : undefined
  const global = all.find((row) => row.ambito === 'global')
  if (!global) throw new Error('No existe un umbral de riesgo global configurado')
  return specific ?? global
}

export const riskThresholdsRepository = IS_DEMO_DATA
  ? (() => {
      const base = createInMemoryRepository<RiskThreshold>([...riskThresholdsFixture])
      return {
        ...base,
        list(filters?: RiskThresholdFilters) {
          return base.list((row) => {
            if (filters?.ambito && row.ambito !== filters.ambito) return false
            if (filters?.diseaseId && row.disease_id !== filters.diseaseId) return false
            if (filters?.sectorId && row.sector_id !== filters.sectorId) return false
            return true
          })
        },
        async resolveForDisease(diseaseId: string | null): Promise<RiskThreshold> {
          return resolveForDiseaseFrom(await base.list(), diseaseId)
        },
      }
    })()
  : (() => {
      const base = createSupabaseRepository<RiskThreshold>('risk_thresholds')
      return {
        ...base,
        list(filters?: RiskThresholdFilters) {
          return base.list((query) => {
            if (filters?.ambito) query = query.eq('ambito', filters.ambito)
            if (filters?.diseaseId) query = query.eq('disease_id', filters.diseaseId)
            if (filters?.sectorId) query = query.eq('sector_id', filters.sectorId)
            return query
          })
        },
        async resolveForDisease(diseaseId: string | null): Promise<RiskThreshold> {
          return resolveForDiseaseFrom(await base.list(), diseaseId)
        },
      }
    })()
