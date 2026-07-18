import type { SectorPopulation } from '@/types/database.types'

// Población 2026 idéntica al prototipo de referencia; 2025 estimada con -2% para permitir
// ver evolución interanual en Población y Comparaciones.
const POBLACION_2026: Record<string, number> = {
  'sector-centro': 31200,
  'sector-hospital': 18700,
  'sector-elprado': 12400,
  'sector-lasmercedes': 9600,
  'sector-sanmanuel': 6100,
  'sector-ruralnorte': 5200,
  'sector-ruralsur': 4800,
  'sector-pomaire': 4300,
}

function buildSectorPopulationFixture(): SectorPopulation[] {
  const rows: SectorPopulation[] = []

  for (const [sectorId, poblacion2026] of Object.entries(POBLACION_2026)) {
    const poblacion2025 = Math.round(poblacion2026 * 0.98)

    rows.push({
      id: `sector-pop-${sectorId}-2025`,
      sector_id: sectorId,
      anio: 2025,
      poblacion: poblacion2025,
      fuente: 'Censo INE 2017 (proyección comunal)',
      estado_validacion: 'validado',
    })
    rows.push({
      id: `sector-pop-${sectorId}-2026`,
      sector_id: sectorId,
      anio: 2026,
      poblacion: poblacion2026,
      fuente: 'Censo INE 2017 (proyección comunal)',
      estado_validacion: 'validado',
    })
  }

  return rows
}

export const sectorPopulationFixture = buildSectorPopulationFixture()

export function getSectorPopulation(sectorId: string, anio: number): number | undefined {
  return sectorPopulationFixture.find((row) => row.sector_id === sectorId && row.anio === anio)?.poblacion
}
