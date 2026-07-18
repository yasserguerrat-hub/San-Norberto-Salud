import { createClient } from '@supabase/supabase-js'

// Nota: aún no tipado con `Database` (supabase gen types) — las tablas de
// app/src/types/database.types.ts son manuscritas y sirven a los fixtures/repositorios en
// memoria. Cuando se reemplace createInMemoryRepository por consultas reales, correr
// `npx supabase gen types typescript --local` y usar createClient<Database>(...).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copia app/.env.example a app/.env.local y completa los valores (ver README "Desarrollo local").',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
