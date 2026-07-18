import { z } from 'zod'

export const ageRangeSchema = z
  .object({
    nombre: z.string().min(2, 'Ingresa un nombre para el rango'),
    edad_min: z.coerce.number().int().min(0, 'La edad mínima no puede ser negativa'),
    edad_max: z.preprocess(
      (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
      z.number().int().min(0).optional(),
    ),
    orden: z.coerce.number().int().min(1, 'Indica el orden de despliegue'),
    estado: z.enum(['activo', 'inactivo']),
  })
  .refine((data) => data.edad_max === undefined || data.edad_max >= data.edad_min, {
    message: 'La edad máxima debe ser mayor o igual a la edad mínima',
    path: ['edad_max'],
  })

export type AgeRangeFormValues = z.infer<typeof ageRangeSchema>
