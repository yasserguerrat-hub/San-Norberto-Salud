import type { CommunePopulation } from '@/types/database.types'
import { sectorPopulationFixture } from './sectorPopulation.fixtures'

function sumSectorsByYear(anio: number): number {
  return sectorPopulationFixture
    .filter((row) => row.anio === anio)
    .reduce((total, row) => total + row.poblacion, 0)
}

export const communePopulationFixture: CommunePopulation[] = [
  {
    id: 'commune-pop-2025',
    anio: 2025,
    poblacion: sumSectorsByYear(2025),
    poblacion_mujeres: null,
    poblacion_hombres: null,
    fuente: 'Censo INE 2017 (proyección comunal)',
    estado_validacion: 'validado',
  },
  {
    id: 'commune-pop-2026',
    anio: 2026,
    poblacion: sumSectorsByYear(2026),
    poblacion_mujeres: null,
    poblacion_hombres: null,
    fuente: 'Censo INE 2017 (proyección comunal)',
    estado_validacion: 'validado',
  },
]
