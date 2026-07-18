import type { GenderCategory } from '@/types/database.types'

export const genderCategoriesFixture: GenderCategory[] = [
  { id: 'gender-femenino', nombre: 'Femenino', orden: 1, estado: 'activo' },
  { id: 'gender-masculino', nombre: 'Masculino', orden: 2, estado: 'activo' },
  { id: 'gender-otro', nombre: 'Otro', orden: 3, estado: 'activo' },
  { id: 'gender-no-informado', nombre: 'No informado', orden: 4, estado: 'activo' },
]

// Distribución usada para generar datos demo coherentes (coincide con el prototipo: 54/44/1/1).
export const GENDER_DEMO_WEIGHTS: Record<string, number> = {
  'gender-femenino': 0.54,
  'gender-masculino': 0.44,
  'gender-otro': 0.01,
  'gender-no-informado': 0.01,
}
