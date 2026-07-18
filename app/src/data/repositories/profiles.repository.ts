import { profilesFixture } from '@/data/fixtures/profiles.fixtures'
import type { Profile } from '@/types/database.types'
import type { Rol } from '@/types/enums'
import { createInMemoryRepository } from './createInMemoryRepository'

const store = [...profilesFixture]
const base = createInMemoryRepository<Profile>(store)

export interface ProfileFilters {
  search?: string
  rol?: Rol
  clinicId?: string
  estado?: Profile['estado']
}

export const profilesRepository = {
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
}
