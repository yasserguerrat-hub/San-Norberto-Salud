import { genderCategoriesFixture } from '@/data/fixtures/genderCategories.fixtures'
import type { GenderCategory } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'

const store = [...genderCategoriesFixture]
const base = createInMemoryRepository<GenderCategory>(store)

export const genderCategoriesRepository = {
  ...base,
  list() {
    return base.list().then((items) => [...items].sort((a, b) => a.orden - b.orden))
  },
}
