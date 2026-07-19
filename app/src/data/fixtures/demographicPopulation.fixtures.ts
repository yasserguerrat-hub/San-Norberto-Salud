import type { DemographicPopulation } from '@/types/database.types'
import { ageRangesFixture } from './ageRanges.fixtures'
import { GENDER_DEMO_WEIGHTS, genderCategoriesFixture } from './genderCategories.fixtures'
import { sectorPopulationFixture } from './sectorPopulation.fixtures'
import { sectorsFixture } from './sectors.fixtures'

// Pirámide etaria aproximada, distinta para sectores urbanos y rurales (estos últimos con
// mayor proporción de tercera/cuarta edad), usada solo para poblar datos demo coherentes.
const AGE_WEIGHTS_BY_SECTOR_TYPE: Record<'urbano' | 'rural', Record<string, number>> = {
  urbano: {
    'age-infancia': 0.14,
    'age-adolescencia': 0.1,
    'age-juventud': 0.14,
    'age-adultez-media': 0.4,
    'age-tercera-edad': 0.15,
    'age-cuarta-edad': 0.07,
  },
  rural: {
    'age-infancia': 0.13,
    'age-adolescencia': 0.09,
    'age-juventud': 0.1,
    'age-adultez-media': 0.35,
    'age-tercera-edad': 0.21,
    'age-cuarta-edad': 0.12,
  },
}

function buildDemographicPopulationFixture(): DemographicPopulation[] {
  const rows: DemographicPopulation[] = []
  const sectorById = new Map(sectorsFixture.map((sector) => [sector.id, sector]))

  for (const sectorPop of sectorPopulationFixture) {
    const sector = sectorById.get(sectorPop.sector_id)
    if (!sector) continue

    const ageWeights = AGE_WEIGHTS_BY_SECTOR_TYPE[sector.tipo]

    for (const ageRange of ageRangesFixture) {
      const ageWeight = ageWeights[ageRange.id] ?? 0
      const poblacionEdad = sectorPop.poblacion * ageWeight

      for (const gender of genderCategoriesFixture) {
        const genderWeight = GENDER_DEMO_WEIGHTS[gender.id] ?? 0
        const poblacion = Math.round(poblacionEdad * genderWeight)

        rows.push({
          id: `demo-pop-${sectorPop.sector_id}-${sectorPop.anio}-${ageRange.id}-${gender.id}`,
          sector_id: sectorPop.sector_id,
          anio: sectorPop.anio,
          rango_edad: ageRange.nombre,
          gender_id: gender.id,
          poblacion,
        })
      }
    }
  }

  return rows
}

export const demographicPopulationFixture = buildDemographicPopulationFixture()
