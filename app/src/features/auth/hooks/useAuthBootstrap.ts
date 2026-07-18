import { useEffect } from 'react'
import { IS_DEMO_DATA } from '@/app/config/constants'
import { profilesRepository } from '@/data/repositories/profiles.repository'
import { supabase } from '@/lib/supabaseClient'
import { useSessionStore } from '../store/session.store'

// Sincroniza el store de sesión con la sesión real de Supabase Auth al cargar la app y ante
// cambios (login/logout/refresh de token en otra pestaña). No-op en modo demo, donde la sesión
// ya vive persistida directamente en el store (ver session.store.ts).
export function useAuthBootstrap() {
  useEffect(() => {
    if (IS_DEMO_DATA) return

    let active = true

    const syncProfile = async (authUserId: string | undefined) => {
      const profile = authUserId ? await profilesRepository.findByAuthUserId(authUserId) : null
      if (active) useSessionStore.setState({ profile })
    }

    supabase.auth.getSession().then(({ data }) => syncProfile(data.session?.user.id))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncProfile(session?.user.id)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])
}
