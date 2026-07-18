import { ageRangesFixture } from '@/data/fixtures/ageRanges.fixtures'
import type { AgeRange } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'

const store = [...ageRangesFixture]
const base = createInMemoryRepository<AgeRange>(store)

export const ageRangesRepository = {
  ...base,
  list() {
    return base.list().then((items) => [...items].sort((a, b) => a.orden - b.orden))
  },
}
