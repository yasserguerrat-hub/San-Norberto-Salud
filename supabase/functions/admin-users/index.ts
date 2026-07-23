// Edge Function admin-users — RF-01: las cuentas solo las crea el administrador.
// La creación/eliminación de usuarios de Auth exige la service_role key, que nunca puede
// viajar al frontend; esta función la usa del lado del servidor y solo tras verificar que
// quien llama tiene un perfil admin_general activo (el JWT llega en Authorization).
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json(405, { error: 'Método no permitido' })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json(401, { error: 'Sesión requerida' })

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Identificar al llamante a partir de su JWT y confirmar que es admin activo.
  const jwt = authHeader.replace('Bearer ', '')
  const {
    data: { user: caller },
    error: callerError,
  } = await admin.auth.getUser(jwt)
  if (callerError || !caller) return json(401, { error: 'Sesión no válida' })

  const { data: callerProfile } = await admin
    .from('profiles')
    .select('rol, estado')
    .eq('auth_user_id', caller.id)
    .maybeSingle()
  if (!callerProfile || callerProfile.rol !== 'admin_general' || callerProfile.estado !== 'activo') {
    return json(403, { error: 'Solo un administrador activo puede gestionar usuarios' })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json(400, { error: 'Cuerpo JSON inválido' })
  }

  if (body.action === 'create') {
    const { correo, nombre, apellido, rol, clinic_id, puede_ver_comparaciones, password } = body as {
      correo?: string
      nombre?: string
      apellido?: string
      rol?: string
      clinic_id?: string | null
      puede_ver_comparaciones?: boolean
      password?: string
    }
    if (!correo || !nombre || !apellido || !rol || !password) return json(400, { error: 'Faltan campos obligatorios' })
    if (rol !== 'admin_general' && rol !== 'usuario_clinica') return json(400, { error: 'Rol no válido' })
    if (rol === 'usuario_clinica' && !clinic_id) return json(400, { error: 'Selecciona la clínica del usuario' })
    if (password.length < 8) return json(400, { error: 'La contraseña debe tener al menos 8 caracteres' })

    // El administrador define la contraseña directamente (no hay envío de correo configurado).
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: correo,
      password,
      email_confirm: true,
    })
    if (createError) return json(400, { error: createError.message })

    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .insert({
        auth_user_id: created.user.id,
        nombre,
        apellido,
        correo,
        rol,
        clinic_id: rol === 'admin_general' ? null : clinic_id,
        puede_ver_comparaciones: puede_ver_comparaciones ?? false,
        estado: 'activo',
      })
      .select()
      .single()
    if (profileError) {
      // Sin perfil la cuenta de Auth queda huérfana: se revierte para no dejar estado a medias.
      await admin.auth.admin.deleteUser(created.user.id)
      return json(400, { error: profileError.message })
    }

    return json(200, { profile })
  }

  if (body.action === 'delete') {
    const { profile_id } = body as { profile_id?: string }
    if (!profile_id) return json(400, { error: 'Falta profile_id' })

    const { data: target } = await admin
      .from('profiles')
      .select('id, auth_user_id')
      .eq('id', profile_id)
      .maybeSingle()
    if (!target) return json(404, { error: 'Perfil no encontrado' })
    if (target.auth_user_id === caller.id) return json(400, { error: 'No puedes eliminar tu propia cuenta' })

    const { error: deleteProfileError } = await admin.from('profiles').delete().eq('id', profile_id)
    if (deleteProfileError) return json(400, { error: deleteProfileError.message })
    // Borrar la cuenta de Auth elimina también la sesión activa de ese usuario.
    const { error: deleteAuthError } = await admin.auth.admin.deleteUser(target.auth_user_id)
    if (deleteAuthError) return json(400, { error: deleteAuthError.message })

    return json(200, { ok: true })
  }

  return json(400, { error: 'Acción no soportada' })
})
