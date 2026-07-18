import { useMutation } from '@tanstack/react-query'
import { IS_DEMO_DATA } from '@/app/config/constants'
import { profilesRepository } from '@/data/repositories/profiles.repository'
import { supabase } from '@/lib/supabaseClient'
import type { LoginFormValues } from '../schemas/login.schema'
import { useSessionStore } from '../store/session.store'

// Modo demo: valida que el correo exista en el catálogo de perfiles (creados por el
// administrador, RF-01) y que la cuenta esté activa, sin verificar contraseña.
// Modo Supabase (VITE_USE_SUPABASE=true): autentica de verdad contra Supabase Auth y
// resuelve el perfil complementario por auth_user_id.
export function useLogin() {
  const login = useSessionStore((state) => state.login)

  return useMutation({
    mutationFn: async ({ correo, password }: LoginFormValues) => {
      if (IS_DEMO_DATA) {
        const profile = await profilesRepository.findByEmail(correo)
        if (!profile) {
          throw new Error('No existe una cuenta institucional con ese correo.')
        }
        if (profile.estado === 'inactivo') {
          throw new Error('Esta cuenta está inactiva. Contacta al administrador de San Norberto Salud.')
        }
        return profile
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email: correo, password })
      if (error) throw new Error(error.message)

      const profile = await profilesRepository.findByAuthUserId(data.user.id)
      if (!profile) {
        throw new Error('Tu cuenta no tiene un perfil institucional asociado. Contacta al administrador.')
      }
      if (profile.estado === 'inactivo') {
        await supabase.auth.signOut()
        throw new Error('Esta cuenta está inactiva. Contacta al administrador de San Norberto Salud.')
      }
      return profile
    },
    onSuccess: (profile) => login(profile),
  })
}
