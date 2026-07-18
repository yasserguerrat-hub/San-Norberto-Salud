import type { AgeRange } from '@/types/database.types'

// Rangos de edad estándar (RF-06 valida superposición/vacíos antes de guardar cambios de admin).
export const ageRangesFixture: AgeRange[] = [
  { id: 'age-infancia', nombre: 'Infancia (0-11)', edad_min: 0, edad_max: 11, orden: 1, estado: 'activo' },
  { id: 'age-adolescencia', nombre: 'Adolescencia (12-17)', edad_min: 12, edad_max: 17, orden: 2, estado: 'activo' },
  { id: 'age-juventud', nombre: 'Juventud (18-25)', edad_min: 18, edad_max: 25, orden: 3, estado: 'activo' },
  { id: 'age-adultez-media', nombre: 'Adultez media (26-59)', edad_min: 26, edad_max: 59, orden: 4, estado: 'activo' },
  { id: 'age-tercera-edad', nombre: 'Tercera edad (60-79)', edad_min: 60, edad_max: 79, orden: 5, estado: 'activo' },
  { id: 'age-cuarta-edad', nombre: 'Cuarta edad (80+)', edad_min: 80, edad_max: null, orden: 6, estado: 'activo' },
]
