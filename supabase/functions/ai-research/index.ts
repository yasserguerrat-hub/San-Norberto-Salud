// Edge Function ai-research — RF-21/RF-22/RF-23/RF-26.
// Capa adaptadora agnóstica de proveedor (RNF-19/RNF-20): el proveedor se resuelve por variable
// de entorno (AI_PROVIDER), nunca hardcodeado en el modelo de datos ni en el frontend. Sin
// importar el proveedor, esta función SIEMPRE escribe la propuesta con estado "propuesta"
// (RF-22) — jamás en tablas definitivas — así que la regla de aprobación explícita no depende
// de qué proveedor esté configurado.
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

interface Fuente {
  institucion: string
  titulo: string
  url: string
  fecha: string
  tipo: 'oficial' | 'estudio' | 'prensa' | 'otro'
  nivel_confianza: 'alto' | 'medio' | 'bajo'
}

interface ResearchResult {
  resumen: string
  variables_utilizadas: string[]
  nivel_confianza: 'alto' | 'medio' | 'bajo'
  fuentes: Fuente[]
}

interface AiProvider {
  name: string
  research(pregunta: string, contexto: string | null): Promise<ResearchResult>
}

// Proveedor por defecto: sin dependencias externas, determinístico, útil para probar el flujo
// completo (solicitud -> propuesta -> aprobación) sin necesitar ninguna API key. Sus "fuentes"
// se marcan explícitamente como simuladas para no hacerlas pasar por evidencia real.
const mockProvider: AiProvider = {
  name: 'mock',
  research(pregunta, contexto) {
    const hoy = new Date().toISOString().slice(0, 10)
    return Promise.resolve({
      resumen: `[Demostración — sin proveedor de IA configurado] Pregunta recibida: "${pregunta}".${contexto ? ` Contexto: ${contexto}.` : ''} Este resumen es de prueba y no debe usarse como evidencia real; configura AI_PROVIDER en el servidor para obtener investigación real.`,
      variables_utilizadas: ['casos_reportados', 'poblacion_sector', 'periodo'],
      nivel_confianza: 'bajo',
      fuentes: [
        {
          institucion: 'Proveedor de IA simulado (AI_PROVIDER=mock)',
          titulo: 'Respuesta de demostración, no es una fuente real',
          url: 'https://example.com/ai-provider-not-configured',
          fecha: hoy,
          tipo: 'otro',
          nivel_confianza: 'bajo',
        },
      ],
    })
  },
}

// Proveedor real de referencia — se activa con AI_PROVIDER=anthropic + ANTHROPIC_API_KEY.
// Reemplazar o agregar otro proveedor implica un objeto AiProvider más en resolveProvider(),
// sin tocar el resto de la función ni el modelo de datos (RNF-19).
function createAnthropicProvider(apiKey: string): AiProvider {
  return {
    name: 'anthropic',
    async research(pregunta, contexto) {
      const prompt = `Eres un asistente de investigación epidemiológica para San Norberto Salud, comuna de Melipilla, Chile. Responde ÚNICAMENTE con JSON válido (sin texto adicional, sin markdown) con esta forma exacta:
{"resumen": string, "variables_utilizadas": string[], "nivel_confianza": "alto"|"medio"|"bajo", "fuentes": [{"institucion": string, "titulo": string, "url": string, "fecha": "YYYY-MM-DD", "tipo": "oficial"|"estudio"|"prensa"|"otro", "nivel_confianza": "alto"|"medio"|"bajo"}]}
No inventes URLs, cifras ni instituciones si no tienes certeza; en ese caso usa nivel_confianza "bajo" y dilo explícitamente en el resumen. No incluyas datos personales ni identificables de pacientes.

Pregunta: ${pregunta}
${contexto ? `Contexto adicional: ${contexto}` : ''}`

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-5',
          max_tokens: 1536,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      if (!res.ok) throw new Error(`Anthropic API error ${res.status}: ${await res.text()}`)
      const data = await res.json()
      const text = data.content?.[0]?.text
      if (typeof text !== 'string') throw new Error('Respuesta de Anthropic sin contenido de texto')
      return JSON.parse(text) as ResearchResult
    },
  }
}

function resolveProvider(): AiProvider {
  const providerName = Deno.env.get('AI_PROVIDER') ?? 'mock'
  if (providerName === 'anthropic') {
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) throw new Error('AI_PROVIDER=anthropic requiere ANTHROPIC_API_KEY configurada en el servidor')
    return createAnthropicProvider(apiKey)
  }
  return mockProvider
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

  const jwt = authHeader.replace('Bearer ', '')
  const {
    data: { user: caller },
    error: callerError,
  } = await admin.auth.getUser(jwt)
  if (callerError || !caller) return json(401, { error: 'Sesión no válida' })

  const { data: callerProfile } = await admin
    .from('profiles')
    .select('id, rol, estado')
    .eq('auth_user_id', caller.id)
    .maybeSingle()
  if (!callerProfile || callerProfile.rol !== 'admin_general' || callerProfile.estado !== 'activo') {
    return json(403, { error: 'Solo un administrador activo puede solicitar investigación asistida (RF-21)' })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json(400, { error: 'Cuerpo JSON inválido' })
  }

  const pregunta = body.pregunta
  const contexto = typeof body.contexto === 'string' ? body.contexto : null
  if (typeof pregunta !== 'string' || pregunta.trim().length < 10) {
    return json(400, { error: 'Falta una pregunta de investigación (mínimo 10 caracteres)' })
  }

  let provider: AiProvider
  try {
    provider = resolveProvider()
  } catch (err) {
    return json(500, { error: err instanceof Error ? err.message : 'No se pudo resolver el proveedor de IA' })
  }

  const { data: request, error: requestError } = await admin
    .from('ai_research_requests')
    .insert({
      pregunta,
      contexto,
      estado: 'en_proceso',
      proveedor: provider.name,
      solicitado_por: callerProfile.id,
    })
    .select()
    .single()
  if (requestError) return json(400, { error: requestError.message })

  try {
    const result = await provider.research(pregunta, contexto)

    const { data: sources, error: sourcesError } = await admin
      .from('data_sources')
      .insert(result.fuentes.map((f) => ({ ...f, creado_por: callerProfile.id })))
      .select()
    if (sourcesError) throw new Error(sourcesError.message)

    const { data: proposal, error: proposalError } = await admin
      .from('ai_data_proposals')
      .insert({
        ai_research_request_id: request.id,
        resumen: result.resumen,
        disease_id: null,
        sector_id: null,
        anio: null,
        variables_utilizadas: result.variables_utilizadas,
        nivel_confianza: result.nivel_confianza,
        data_source_ids: (sources ?? []).map((s) => s.id),
        estado: 'propuesta',
      })
      .select()
      .single()
    if (proposalError) throw new Error(proposalError.message)

    const { data: updatedRequest } = await admin
      .from('ai_research_requests')
      .update({ estado: 'completada' })
      .eq('id', request.id)
      .select()
      .single()

    return json(200, { request: updatedRequest, proposal })
  } catch (err) {
    await admin.from('ai_research_requests').update({ estado: 'error' }).eq('id', request.id)
    return json(500, { error: err instanceof Error ? err.message : 'Error desconocido procesando la investigación' })
  }
})
