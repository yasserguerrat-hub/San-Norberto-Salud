import { z } from 'zod'

const optionalNonNegative = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
  z.number().int().min(0, 'No puede ser negativo').optional(),
)

export const communePopulationSchema = z.object({
  anio: z.coerce.number().int().min(2000).max(2100),
  poblacion: z.coerce.number().int().positive('La población debe ser mayor a 0'),
  poblacion_mujeres: optionalNonNegative,
  poblacion_hombres: optionalNonNegative,
  fuente: z.string().min(3, 'Indica la fuente del dato'),
  estado_validacion: z.enum(['validado', 'pendiente', 'estimado']),
})

export type CommunePopulationFormValues = z.infer<typeof communePopulationSchema>
