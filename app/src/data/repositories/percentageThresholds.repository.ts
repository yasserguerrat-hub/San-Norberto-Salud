import { IS_DEMO_DATA } from '@/app/config/constants'
import { percentageThresholdsFixture } from '@/data/fixtures/percentageThresholds.fixtures'
import type { PercentageThreshold } from '@/types/database.types'
import { createInMemoryRepository } from './createInMemoryRepository'
import { createSupabaseRepository } from './createSupabaseRepository'

export const percentageThresholdsRepository = IS_DEMO_DATA
  ? createInMemoryRepository<PercentageThreshold>([...percentageThresholdsFixture])
  : createSupabaseRepository<PercentageThreshold>('percentage_thresholds')
