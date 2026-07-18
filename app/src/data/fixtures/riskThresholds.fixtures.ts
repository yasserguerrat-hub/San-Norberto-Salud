import type { RiskThreshold } from '@/types/database.types'

// RF-07: umbrales de riesgo (tasa por 100.000 hab.) configurables por enfermedad, sector o global.
export const riskThresholdsFixture: RiskThreshold[] = [
  {
    id: 'risk-threshold-global',
    nombre: 'Umbral global por defecto',
    ambito: 'global',
    disease_id: null,
    sector_id: null,
    umbral_bajo_max: 25,
    umbral_medio_max: 50,
    umbral_alto_max: 150,
    estado: 'activo',
  },
  {
    id: 'risk-threshold-erc',
    nombre: 'Enfermedad renal crónica',
    ambito: 'enfermedad',
    disease_id: 'disease-erc',
    sector_id: null,
    umbral_bajo_max: 10,
    umbral_medio_max: 20,
    umbral_alto_max: 40,
    estado: 'activo',
  },
  {
    id: 'risk-threshold-ira',
    nombre: 'Infecciones respiratorias agudas (estacional)',
    ambito: 'enfermedad',
    disease_id: 'disease-ira',
    sector_id: null,
    umbral_bajo_max: 50,
    umbral_medio_max: 100,
    umbral_alto_max: 250,
    estado: 'activo',
  },
]
