import { useMutation } from '@tanstack/react-query'
import { profilesRepository } from '@/data/repositories/profiles.repository'
import type { LoginFormValues } from '../schemas/login.schema'
import { useSessionStore } from '../store/session.store'

// Autenticación demo: valida que el correo exista en el catálogo de perfiles (creados por el
// administrador, RF-01) y que la cuenta esté activa. No hay verificación real de contraseña
// hasta que exista Supabase Auth — el formulario ya exige el campo para no rediseñar la UI.
export function useLogin() {
  const login = useSessionStore((state) => state.login)

  return useMutation({
    mutationFn: async ({ correo }: LoginFormValues) => {
      const profile = await profilesRepository.findByEmail(correo)
      if (!profile) {
        throw new Error('No existe una cuenta institucional con ese correo.')
      }
      if (profile.estado === 'inactivo') {
        throw new Error('Esta cuenta está inactiva. Contacta al administrador de San Norberto Salud.')
      }
      return profile
    },
    onSuccess: (profile) => login(profile),
  })
}
