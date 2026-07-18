import { z } from 'zod'

export const demographicPopulationEditSchema = z.object({
  poblacion: z.coerce.number().int().min(0, 'La población no puede ser negativa'),
})

export type DemographicPopulationEditValues = z.infer<typeof demographicPopulationEditSchema>
