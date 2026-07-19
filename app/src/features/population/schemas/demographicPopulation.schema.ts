import { z } from 'zod'

/** Grupos quinquenales estándar del INE — sugerencias, no una lista cerrada (rango_edad es
 * texto libre para admitir otras fuentes con agrupaciones distintas). */
export const RANGOS_EDAD_QUINQUENALES_INE = [
  '0 a 4 años',
  '5 a 9 años',
  '10 a 14 años',
  '15 a 19 años',
  '20 a 24 años',
  '25 a 29 años',
  '30 a 34 años',
  '35 a 39 años',
  '40 a 44 años',
  '45 a 49 años',
  '50 a 54 años',
  '55 a 59 años',
  '60 a 64 años',
  '65 a 69 años',
  '70 a 74 años',
  '75 a 79 años',
  '80 años o más',
]

export const demographicPopulationSchema = z.object({
  sector_id: z.string().nullable(),
  anio: z.coerce.number().int().min(2000).max(2100),
  rango_edad: z.string().min(1, 'Indica el rango de edad'),
  gender_id: z.string().min(1, 'Selecciona una categoría de género'),
  poblacion: z.coerce.number().int().positive('La población debe ser mayor a 0'),
})

export type DemographicPopulationFormValues = z.infer<typeof demographicPopulationSchema>

// Se conserva para no romper el punto de edición rápida de un solo valor si se necesita en otro
// lugar; el formulario completo ahora usa demographicPopulationSchema.
export const demographicPopulationEditSchema = z.object({
  poblacion: z.coerce.number().int().min(0, 'La población no puede ser negativa'),
})

export type DemographicPopulationEditValues = z.infer<typeof demographicPopulationEditSchema>
