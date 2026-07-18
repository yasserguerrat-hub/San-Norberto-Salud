import type { AiDataProposal } from '@/types/database.types'

// RF-22: toda propuesta de IA queda en estado "propuesta" hasta aprobación explícita del
// administrador; nunca se escribe directamente en tablas definitivas.
export const aiDataProposalsFixture: AiDataProposal[] = [
  {
    id: 'ai-proposal-ira-invierno',
    ai_research_request_id: 'ai-request-ira-invierno',
    resumen:
      'Los reportes oficiales de la SEREMI de Salud RM confirman un aumento estacional del 18% en consultas por IRA durante junio, consistente con lo observado en los registros de Melipilla.',
    disease_id: 'disease-ira',
    sector_id: null,
    anio: 2026,
    variables_utilizadas: ['casos_mensuales', 'estacionalidad', 'boletin_epidemiologico'],
    nivel_confianza: 'alto',
    data_source_ids: ['source-minsal-ira', 'source-seremi-rm'],
    estado: 'propuesta',
    revisado_por: null,
    fecha_revision: null,
    creado_en: '2026-06-10T16:00:00.000Z',
  },
  {
    id: 'ai-proposal-erc-rural',
    ai_research_request_id: 'ai-request-erc-rural',
    resumen:
      'La evidencia disponible asocia la mayor prevalencia de ERC en sectores rurales con menor acceso a control preventivo de hipertensión y diabetes.',
    disease_id: 'disease-erc',
    sector_id: 'sector-sanmanuel',
    anio: 2026,
    variables_utilizadas: ['acceso_control_preventivo', 'comorbilidad_hta_dm2'],
    nivel_confianza: 'medio',
    data_source_ids: ['source-seremi-rm'],
    estado: 'propuesta',
    revisado_por: null,
    fecha_revision: null,
    creado_en: '2026-06-14T11:00:00.000Z',
  },
  {
    id: 'ai-proposal-poblacion-2026',
    ai_research_request_id: 'ai-request-erc-rural',
    resumen:
      'Proyección de población comunal 2026 del INE, sugerida como fuente de contraste para validar los denominadores poblacionales cargados manualmente.',
    disease_id: null,
    sector_id: null,
    anio: 2026,
    variables_utilizadas: ['proyeccion_poblacional'],
    nivel_confianza: 'alto',
    data_source_ids: ['source-ine-poblacion'],
    estado: 'aprobada',
    revisado_por: 'profile-admin',
    fecha_revision: '2026-06-15T09:00:00.000Z',
    creado_en: '2026-06-14T18:00:00.000Z',
  },
]
