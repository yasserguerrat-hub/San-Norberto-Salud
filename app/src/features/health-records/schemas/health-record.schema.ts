import { z } from 'zod'

export const healthRecordSchema = z
  .object({
    alcance: z.enum(['clinica', 'sector']),
    clinic_id: z.string().optional(),
    sector_id: z.string().min(1, 'Selecciona un sector'),
    disease_id: z.string().min(1, 'Selecciona una enfermedad'),
    age_range_id: z.string().min(1, 'Selecciona un rango de edad'),
    gender_id: z.string().min(1, 'Selecciona una categoría de género'),
    mes: z.coerce.number().int().min(1, 'Selecciona un mes').max(12, 'Mes inválido'),
    anio: z.coerce.number().int().min(2020, 'Año inválido').max(2100, 'Año inválido'),
    cantidad_casos: z.coerce.number().int().min(0, 'La cantidad de casos no puede ser negativa'),
  })
  .refine((data) => data.alcance === 'sector' || !!data.clinic_id, {
    message: 'Selecciona una clínica',
    path: ['clinic_id'],
  })

export type HealthRecordFormValues = z.infer<typeof healthRecordSchema>
