import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IS_DEMO_DATA } from '@/app/config/constants'
import { type ProfileFilters, profilesRepository } from '@/data/repositories/profiles.repository'
import { queryKeys } from '@/lib/query/queryKeys'
import { supabase } from '@/lib/supabaseClient'
import type { CreateUserFormValues, UserFormValues } from '../schemas/user.schema'

export function useUsers(filters?: ProfileFilters) {
  return useQuery({ queryKey: queryKeys.profiles.list(filters), queryFn: () => profilesRepository.list(filters) })
}

// Crear/eliminar usuarios reales requiere privilegios de administrador de Auth, que solo viven
// en el servidor: se delega en la Edge Function admin-users (RF-01). El invitado recibe un
// correo y define su contraseña en /restablecer-contrasena (mismo flujo que RF-02).
async function invokeAdminUsers(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke('admin-users', { body })
  if (error) {
    let message = error.message
    if ('context' in error && error.context instanceof Response) {
      const detail = await error.context.json().catch(() => null)
      if (detail?.error) message = detail.error
    }
    throw new Error(message)
  }
  return data
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateUserFormValues) => {
      const { password: _password, confirmPassword: _confirmPassword, ...profileFields } = input
      if (IS_DEMO_DATA) {
        return profilesRepository.create({
          ...profileFields,
          clinic_id: input.rol === 'admin_general' ? null : (input.clinic_id ?? null),
          auth_user_id: `auth-${crypto.randomUUID()}`,
          creado_en: new Date().toISOString(),
          actualizado_en: new Date().toISOString(),
        })
      }
      const data = await invokeAdminUsers({
        action: 'create',
        correo: input.correo,
        nombre: input.nombre,
        apellido: input.apellido,
        rol: input.rol,
        clinic_id: input.rol === 'admin_general' ? null : (input.clinic_id ?? null),
        puede_ver_comparaciones: input.puede_ver_comparaciones,
        password: input.password,
      })
      return data.profile
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all }),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UserFormValues }) =>
      profilesRepository.update(id, {
        ...input,
        clinic_id: input.rol === 'admin_general' ? null : (input.clinic_id ?? null),
        actualizado_en: new Date().toISOString(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all }),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      if (IS_DEMO_DATA) return profilesRepository.remove(id)
      await invokeAdminUsers({ action: 'delete', profile_id: id })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all }),
  })
}
