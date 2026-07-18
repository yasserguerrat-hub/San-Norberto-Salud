import { z } from 'zod'

export const percentageThresholdSchema = z
  .object({
    nombre: z.string().min(3, 'Ingresa un nombre descriptivo'),
    ambito: z.enum(['global', 'enfermedad']),
    disease_id: z.string().optional(),
    umbral_atencion: z.coerce.number().min(0),
    umbral_critico: z.coerce.number().min(0),
    estado: z.enum(['activo', 'inactivo']),
  })
  .refine((data) => data.ambito !== 'enfermedad' || !!data.disease_id, {
    message: 'Selecciona la enfermedad para este umbral',
    path: ['disease_id'],
  })
  .refine((data) => data.umbral_critico > data.umbral_atencion, {
    message: 'El umbral crítico debe ser mayor que el umbral de atención',
    path: ['umbral_critico'],
  })

export type PercentageThresholdFormValues = z.infer<typeof percentageThresholdSchema>
