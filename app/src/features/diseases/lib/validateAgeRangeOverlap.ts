import type { AgeRange } from '@/types/database.types'

// RF-06: advertir superposición de rangos de edad antes de guardar.
export function findAgeRangeOverlap(
  candidate: { id?: string; edad_min: number; edad_max?: number },
  existing: AgeRange[],
): AgeRange | null {
  const candidateMax = candidate.edad_max ?? Infinity

  for (const range of existing) {
    if (range.id === candidate.id) continue
    if (range.estado !== 'activo') continue
    const rangeMax = range.edad_max ?? Infinity
    const overlaps = candidate.edad_min <= rangeMax && candidateMax >= range.edad_min
    if (overlaps) return range
  }

  return null
}
