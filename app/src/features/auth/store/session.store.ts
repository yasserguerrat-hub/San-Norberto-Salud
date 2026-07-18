import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Profile } from '@/types/database.types'

interface SessionState {
  profile: Profile | null
  login: (profile: Profile) => void
  logout: () => void
}

// Sesión demo persistida en sessionStorage (se cierra al cerrar la pestaña). El día que exista
// Supabase Auth, este store pasa a reflejar `supabase.auth.onAuthStateChange` en vez de
// guardar el perfil directamente, sin cambiar la forma que consumen los componentes.
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      profile: null,
      login: (profile) => set({ profile }),
      logout: () => set({ profile: null }),
    }),
    {
      name: 'sn-session',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export function useCurrentProfile(): Profile | null {
  return useSessionStore((state) => state.profile)
}

export function useIsAuthenticated(): boolean {
  return useSessionStore((state) => state.profile !== null)
}
