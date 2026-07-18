import { IS_DEMO_DATA } from '@/app/config/constants'
import { importBatchesFixture, importRowsFixture } from '@/data/fixtures/importBatches.fixtures'
import type { ImportBatch, ImportRow } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'
import { createSupabaseRepository } from './createSupabaseRepository'

export interface ImportBatchFilters {
  clinicId?: string
}

export const importBatchesRepository = IS_DEMO_DATA
  ? (() => {
      const base = createInMemoryRepository<ImportBatch>([...importBatchesFixture])
      return {
        ...base,
        list(filters?: ImportBatchFilters) {
          return base.list((row) => (filters?.clinicId ? row.clinic_id === filters.clinicId : true))
        },
      }
    })()
  : (() => {
      const base = createSupabaseRepository<ImportBatch>('import_batches')
      return {
        ...base,
        list(filters?: ImportBatchFilters) {
          return base.list((query) => (filters?.clinicId ? query.eq('clinic_id', filters.clinicId) : query))
        },
      }
    })()

export interface ImportRowFilters {
  importBatchId?: string
}

export const importRowsRepository = IS_DEMO_DATA
  ? (() => {
      const base = createInMemoryRepository<ImportRow>([...importRowsFixture])
      return {
        ...base,
        list(filters?: ImportRowFilters) {
          return base.list((row) => (filters?.importBatchId ? row.import_batch_id === filters.importBatchId : true))
        },
      }
    })()
  : (() => {
      const base = createSupabaseRepository<ImportRow>('import_rows')
      return {
        ...base,
        list(filters?: ImportRowFilters) {
          return base.list((query) => (filters?.importBatchId ? query.eq('import_batch_id', filters.importBatchId) : query))
        },
      }
    })()
