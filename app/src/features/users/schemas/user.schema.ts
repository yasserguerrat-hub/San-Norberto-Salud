import { z } from 'zod'

const baseUserFields = {
  nombre: z.string().min(2, 'Ingresa el nombre'),
  apellido: z.string().min(2, 'Ingresa el apellido'),
  correo: z.email('Ingresa un correo institucional válido'),
  rol: z.enum(['admin_general', 'usuario_clinica']),
  clinic_id: z.string().optional(),
  puede_ver_comparaciones: z.boolean(),
  estado: z.enum(['activo', 'inactivo']),
}

export const userSchema = z.object(baseUserFields).refine((data) => data.rol === 'admin_general' || !!data.clinic_id, {
  message: 'Selecciona la clínica del usuario',
  path: ['clinic_id'],
})

export type UserFormValues = z.infer<typeof userSchema>

// El administrador define la contraseña directamente al crear la cuenta (no se envía invitación
// por correo, ya que el envío de correos de Supabase no está configurado en este proyecto).
export const createUserSchema = z
  .object({
    ...baseUserFields,
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string().min(1, 'Repite la contraseña'),
  })
  .refine((data) => data.rol === 'admin_general' || !!data.clinic_id, {
    message: 'Selecciona la clínica del usuario',
    path: ['clinic_id'],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type CreateUserFormValues = z.infer<typeof createUserSchema>
