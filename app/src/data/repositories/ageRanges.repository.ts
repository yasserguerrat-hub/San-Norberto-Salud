import { IS_DEMO_DATA } from '@/app/config/constants'
import { ageRangesFixture } from '@/data/fixtures/ageRanges.fixtures'
import type { AgeRange } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'
import { createSupabaseRepository } from './createSupabaseRepository'

const base = IS_DEMO_DATA
  ? createInMemoryRepository<AgeRange>([...ageRangesFixture])
  : createSupabaseRepository<AgeRange>('age_ranges')

export const ageRangesRepository = {
  ...base,
  list() {
    return base.list().then((items) => [...items].sort((a, b) => a.orden - b.orden))
  },
}
