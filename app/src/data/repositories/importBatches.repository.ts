import { importBatchesFixture, importRowsFixture } from '@/data/fixtures/importBatches.fixtures'
import type { ImportBatch, ImportRow } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'

const store = [...importBatchesFixture]
const base = createInMemoryRepository<ImportBatch>(store)

export interface ImportBatchFilters {
  clinicId?: string
}

export const importBatchesRepository = {
  ...base,
  list(filters?: ImportBatchFilters) {
    return base.list((row) => (filters?.clinicId ? row.clinic_id === filters.clinicId : true))
  },
}

const rowsStore = [...importRowsFixture]
const rowsBase = createInMemoryRepository<ImportRow>(rowsStore)

export const importRowsRepository = {
  ...rowsBase,
  list(filters?: { importBatchId?: string }) {
    return rowsBase.list((row) => (filters?.importBatchId ? row.import_batch_id === filters.importBatchId : true))
  },
}
