import { IS_DEMO_DATA } from '@/app/config/constants'
import { genderCategoriesFixture } from '@/data/fixtures/genderCategories.fixtures'
import type { GenderCategory } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'
import { createSupabaseRepository } from './createSupabaseRepository'

const base = IS_DEMO_DATA
  ? createInMemoryRepository<GenderCategory>([...genderCategoriesFixture])
  : createSupabaseRepository<GenderCategory>('gender_categories')

export const genderCategoriesRepository = {
  ...base,
  list() {
    return base.list().then((items) => [...items].sort((a, b) => a.orden - b.orden))
  },
}
