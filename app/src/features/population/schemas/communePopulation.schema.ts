import { z } from 'zod'

export const communePopulationSchema = z.object({
  anio: z.coerce.number().int().min(2000).max(2100),
  poblacion: z.coerce.number().int().positive('La población debe ser mayor a 0'),
  fuente: z.string().min(3, 'Indica la fuente del dato'),
  estado_validacion: z.enum(['validado', 'pendiente', 'estimado']),
})

export type CommunePopulationFormValues = z.infer<typeof communePopulationSchema>
