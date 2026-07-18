import { z } from 'zod'

export const riskThresholdSchema = z
  .object({
    nombre: z.string().min(3, 'Ingresa un nombre descriptivo'),
    ambito: z.enum(['global', 'enfermedad', 'sector']),
    disease_id: z.string().optional(),
    sector_id: z.string().optional(),
    umbral_bajo_max: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
    umbral_medio_max: z.coerce.number().min(0),
    umbral_alto_max: z.coerce.number().min(0),
    estado: z.enum(['activo', 'inactivo']),
  })
  .refine((data) => data.ambito !== 'enfermedad' || !!data.disease_id, {
    message: 'Selecciona la enfermedad para este umbral',
    path: ['disease_id'],
  })
  .refine((data) => data.ambito !== 'sector' || !!data.sector_id, {
    message: 'Selecciona el sector para este umbral',
    path: ['sector_id'],
  })
  .refine((data) => data.umbral_medio_max > data.umbral_bajo_max, {
    message: 'El umbral medio debe ser mayor que el umbral bajo',
    path: ['umbral_medio_max'],
  })
  .refine((data) => data.umbral_alto_max > data.umbral_medio_max, {
    message: 'El umbral alto debe ser mayor que el umbral medio',
    path: ['umbral_alto_max'],
  })

export type RiskThresholdFormValues = z.infer<typeof riskThresholdSchema>
