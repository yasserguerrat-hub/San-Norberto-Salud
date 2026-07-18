import { percentageThresholdsFixture } from '@/data/fixtures/percentageThresholds.fixtures'
import type { PercentageThreshold } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'

const store = [...percentageThresholdsFixture]
const base = createInMemoryRepository<PercentageThreshold>(store)

export const percentageThresholdsRepository = base
