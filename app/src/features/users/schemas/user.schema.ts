import { z } from 'zod'

export const userSchema = z
  .object({
    nombre: z.string().min(2, 'Ingresa el nombre'),
    apellido: z.string().min(2, 'Ingresa el apellido'),
    correo: z.email('Ingresa un correo institucional válido'),
    rol: z.enum(['admin_general', 'usuario_clinica']),
    clinic_id: z.string().optional(),
    puede_ver_comparaciones: z.boolean(),
    estado: z.enum(['activo', 'inactivo']),
  })
  .refine((data) => data.rol === 'admin_general' || !!data.clinic_id, {
    message: 'Selecciona la clínica del usuario',
    path: ['clinic_id'],
  })

export type UserFormValues = z.infer<typeof userSchema>
