import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { IS_DEMO_DATA } from '@/app/config/constants'
import { supabase } from '@/lib/supabaseClient'
import type { Profile } from '@/types/database.types'

interface SessionState {
  profile: Profile | null
  login: (profile: Profile) => void
  logout: () => void
}

// Sesión demo persistida en sessionStorage (se cierra al cerrar la pestaña). En modo Supabase
// (VITE_USE_SUPABASE=true) este mismo store sigue siendo la fuente que leen los componentes,
// pero se mantiene sincronizado con `supabase.auth.onAuthStateChange` vía useAuthBootstrap.
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      profile: null,
      login: (profile) => set({ profile }),
      logout: () => {
        if (!IS_DEMO_DATA) void supabase.auth.signOut()
        set({ profile: null })
      },
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
