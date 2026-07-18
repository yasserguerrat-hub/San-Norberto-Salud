// Crea usuarios de Supabase Auth + su fila en profiles para probar login real en local.
// Usa la service_role key (bypassa RLS a propósito) — por eso se niega a correr contra
// cualquier URL que no sea localhost/127.0.0.1. Ejecutar con: npm run seed:auth (desde app/).
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL ?? 'http://127.0.0.1:54321'
// Service role key por defecto de cualquier instancia local de Supabase (no es un secreto real).
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

if (!/^https?:\/\/(127\.0\.0\.1|localhost)([:/]|$)/.test(SUPABASE_URL)) {
  console.error('Este script usa la service_role key: solo corre contra una instancia LOCAL (127.0.0.1/localhost). Abortado.')
  process.exit(1)
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Hospital San José de Melipilla, sembrado en supabase/seed.sql.
const HOSPITAL_CLINIC_ID = '00000000-0000-0000-0000-0000000000c1'
const DEMO_PASSWORD = 'SanNorberto2026!'

const USERS = [
  {
    email: 'admin@sannorbertosalud.cl',
    nombre: 'Admin',
    apellido: 'General',
    rol: 'admin_general',
    clinic_id: null,
    puede_ver_comparaciones: true,
  },
  {
    email: 'hospital@sannorbertosalud.cl',
    nombre: 'Usuario',
    apellido: 'Hospital San José',
    rol: 'usuario_clinica',
    clinic_id: HOSPITAL_CLINIC_ID,
    puede_ver_comparaciones: false,
  },
]

for (const user of USERS) {
  const { data: existingProfile } = await admin.from('profiles').select('id').eq('correo', user.email).maybeSingle()
  if (existingProfile) {
    console.log(`Ya existe perfil para ${user.email}, se omite.`)
    continue
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: user.email,
    password: DEMO_PASSWORD,
    email_confirm: true,
  })
  if (createError) {
    console.error(`No se pudo crear el usuario de auth ${user.email}:`, createError.message)
    continue
  }

  const { error: profileError } = await admin.from('profiles').insert({
    auth_user_id: created.user.id,
    nombre: user.nombre,
    apellido: user.apellido,
    correo: user.email,
    rol: user.rol,
    clinic_id: user.clinic_id,
    puede_ver_comparaciones: user.puede_ver_comparaciones,
    estado: 'activo',
  })
  if (profileError) {
    console.error(`No se pudo crear el perfil de ${user.email}:`, profileError.message)
    continue
  }

  console.log(`Creado: ${user.email} / ${DEMO_PASSWORD} (${user.rol})`)
}
