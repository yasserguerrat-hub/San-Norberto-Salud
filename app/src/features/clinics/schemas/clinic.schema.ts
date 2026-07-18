import { z } from 'zod'

export const clinicSchema = z.object({
  nombre: z.string().min(3, 'Ingresa el nombre completo de la clínica'),
  nombre_corto: z.string().min(2, 'Ingresa un nombre corto'),
  direccion: z.string().min(3, 'Ingresa la dirección'),
  telefono: z.string().min(6, 'Ingresa un teléfono válido'),
  correo: z.email('Ingresa un correo válido'),
  sector_id: z.string().min(1, 'Selecciona un sector'),
  responsable: z.string().min(3, 'Ingresa el nombre del responsable'),
  estado: z.enum(['activo', 'inactivo']),
})

export type ClinicFormValues = z.infer<typeof clinicSchema>
