import { supabase } from '@/lib/supabaseClient'

interface WithId {
  id: string
}

// El query builder de Postgrest no está tipado con `Database` (ver nota en supabaseClient.ts),
// así que `applyFilters` opera sobre `any`; el tipado real de cada fila lo sigue dando `T`.
type QueryModifier = (query: any) => any

/**
 * Hermano de createInMemoryRepository.ts sobre Postgres real vía supabase-js. Mismo contrato
 * Repository<T> — los hooks de cada feature no distinguen cuál de los dos están usando.
 */
export function createSupabaseRepository<T extends WithId>(table: string) {
  return {
    async list(applyFilters?: QueryModifier): Promise<T[]> {
      let query = supabase.from(table).select('*')
      if (applyFilters) query = applyFilters(query)
      const { data, error } = await query
      if (error) throw new Error(error.message)
      return (data ?? []) as T[]
    },

    async getById(id: string): Promise<T | null> {
      const { data, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle()
      if (error) throw new Error(error.message)
      return data as T | null
    },

    async create(input: Partial<T> & Record<string, unknown>): Promise<T> {
      const { data, error } = await supabase
        .from(table)
        .insert(input as any)
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data as T
    },

    async update(id: string, patch: Partial<T>): Promise<T> {
      const { data, error } = await supabase
        .from(table)
        .update(patch as any)
        .eq('id', id)
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data as T
    },

    async remove(id: string): Promise<void> {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) {
        // 23503 = foreign_key_violation: RF-05 exige poder eliminar catálogos "sin dependencias";
        // el mensaje crudo de Postgres es técnico, se traduce a algo accionable para el usuario.
        if (error.code === '23503') {
          throw new Error('No se puede eliminar: hay otros registros que todavía dependen de este elemento.')
        }
        throw new Error(error.message)
      }
    },
  }
}
