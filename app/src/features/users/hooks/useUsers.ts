import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ProfileFilters, profilesRepository } from '@/data/repositories/profiles.repository'
import { queryKeys } from '@/lib/query/queryKeys'
import type { UserFormValues } from '../schemas/user.schema'

export function useUsers(filters?: ProfileFilters) {
  return useQuery({ queryKey: queryKeys.profiles.list(filters), queryFn: () => profilesRepository.list(filters) })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UserFormValues) =>
      profilesRepository.create({
        ...input,
        clinic_id: input.rol === 'admin_general' ? null : (input.clinic_id ?? null),
        auth_user_id: `auth-${crypto.randomUUID()}`,
        creado_en: new Date().toISOString(),
        actualizado_en: new Date().toISOString(),
      }),
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
    mutationFn: (id: string) => profilesRepository.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all }),
  })
}
