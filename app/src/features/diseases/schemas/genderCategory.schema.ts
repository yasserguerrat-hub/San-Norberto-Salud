import { z } from 'zod'

export const genderCategorySchema = z.object({
  nombre: z.string().min(2, 'Ingresa un nombre'),
  orden: z.coerce.number().int().min(1),
  estado: z.enum(['activo', 'inactivo']),
})

export type GenderCategoryFormValues = z.infer<typeof genderCategorySchema>
