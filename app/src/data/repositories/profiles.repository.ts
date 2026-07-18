import { IS_DEMO_DATA } from '@/app/config/constants'
import { profilesFixture } from '@/data/fixtures/profiles.fixtures'
import { supabase } from '@/lib/supabaseClient'
import type { Profile } from '@/types/database.types'
import type { Rol } from '@/types/enums'
import { createInMemoryRepository } from './createInMemoryRepository'
import { createSupabaseRepository } from './createSupabaseRepository'

export interface ProfileFilters {
  search?: string
  rol?: Rol
  clinicId?: string
  estado?: Profile['estado']
}

export const profilesRepository = IS_DEMO_DATA
  ? (() => {
      const base = createInMemoryRepository<Profile>([...profilesFixture])
      return {
        ...base,
        list(filters?: ProfileFilters) {
          return base.list((profile) => {
            if (filters?.rol && profile.rol !== filters.rol) return false
            if (filters?.clinicId && profile.clinic_id !== filters.clinicId) return false
            if (filters?.estado && profile.estado !== filters.estado) return false
            if (filters?.search) {
              const q = filters.search.toLowerCase()
              const nombreCompleto = `${profile.nombre} ${profile.apellido}`.toLowerCase()
              if (!nombreCompleto.includes(q) && !profile.correo.toLowerCase().includes(q)) return false
            }
            return true
          })
        },
        async findByEmail(correo: string): Promise<Profile | null> {
          const items = await base.list()
          return items.find((profile) => profile.correo.toLowerCase() === correo.toLowerCase()) ?? null
        },
        // Sin Supabase Auth en modo demo no hay auth_user_id real que buscar.
        async findByAuthUserId(): Promise<Profile | null> {
          return null
        },
      }
    })()
  : (() => {
      const base = createSupabaseRepository<Profile>('profiles')
      return {
        ...base,
        list(filters?: ProfileFilters) {
          return base.list((query) => {
            if (filters?.rol) query = query.eq('rol', filters.rol)
            if (filters?.clinicId) query = query.eq('clinic_id', filters.clinicId)
            if (filters?.estado) query = query.eq('estado', filters.estado)
            if (filters?.search) {
              query = query.or(`nombre.ilike.%${filters.search}%,apellido.ilike.%${filters.search}%,correo.ilike.%${filters.search}%`)
            }
            return query
          })
        },
        async findByEmail(correo: string): Promise<Profile | null> {
          const { data, error } = await supabase.from('profiles').select('*').eq('correo', correo).maybeSingle()
          if (error) throw new Error(error.message)
          return data as Profile | null
        },
        async findByAuthUserId(authUserId: string): Promise<Profile | null> {
          const { data, error } = await supabase.from('profiles').select('*').eq('auth_user_id', authUserId).maybeSingle()
          if (error) throw new Error(error.message)
          return data as Profile | null
        },
      }
    })()
