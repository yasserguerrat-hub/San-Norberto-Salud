import type { AiResearchRequest } from '@/types/database.types'

// RF-21: investigación asistida por un proveedor de IA configurable (agnóstico de proveedor).
export const aiResearchRequestsFixture: AiResearchRequest[] = [
  {
    id: 'ai-request-ira-invierno',
    pregunta: '¿Cuál ha sido la tendencia de infecciones respiratorias agudas en la Región Metropolitana durante el último trimestre?',
    contexto: 'Se busca contexto oficial para explicar el aumento de casos de IRA en junio 2026.',
    estado: 'completada',
    proveedor: 'proveedor-ia-demo',
    solicitado_por: 'profile-admin',
    creado_en: '2026-06-10T15:30:00.000Z',
  },
  {
    id: 'ai-request-erc-rural',
    pregunta: '¿Existen factores de riesgo documentados para enfermedad renal crónica en población rural de la Región Metropolitana?',
    contexto: 'Contexto para priorizar recursos en sectores rurales con tasas elevadas de ERC.',
    estado: 'completada',
    proveedor: 'proveedor-ia-demo',
    solicitado_por: 'profile-admin',
    creado_en: '2026-06-14T10:00:00.000Z',
  },
  {
    id: 'ai-request-obesidad-escolar',
    pregunta: '¿Qué programas de prevención de obesidad infantil se han implementado en comunas similares a Melipilla?',
    contexto: null,
    estado: 'pendiente',
    proveedor: 'proveedor-ia-demo',
    solicitado_por: 'profile-admin',
    creado_en: '2026-06-16T09:15:00.000Z',
  },
]
