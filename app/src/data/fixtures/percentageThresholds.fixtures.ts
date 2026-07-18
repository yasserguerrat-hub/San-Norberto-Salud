import type { PercentageThreshold } from '@/types/database.types'

export const percentageThresholdsFixture: PercentageThreshold[] = [
  {
    id: 'pct-threshold-global',
    nombre: 'Umbral porcentual por defecto',
    ambito: 'global',
    disease_id: null,
    umbral_atencion: 10,
    umbral_critico: 25,
    estado: 'activo',
  },
  {
    id: 'pct-threshold-depresion',
    nombre: 'Depresión',
    ambito: 'enfermedad',
    disease_id: 'disease-depresion',
    umbral_atencion: 5,
    umbral_critico: 15,
    estado: 'activo',
  },
]
