import { z } from 'zod'

export const sectorPopulationSchema = z.object({
  sector_id: z.string().min(1, 'Selecciona un sector'),
  anio: z.coerce.number().int().min(2000).max(2100),
  poblacion: z.coerce.number().int().positive('La población debe ser mayor a 0'),
  fuente: z.string().min(3, 'Indica la fuente del dato'),
  estado_validacion: z.enum(['validado', 'pendiente', 'estimado']),
})

export type SectorPopulationFormValues = z.infer<typeof sectorPopulationSchema>
