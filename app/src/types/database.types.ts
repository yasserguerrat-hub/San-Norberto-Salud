// Tipos "espejo" de las tablas Postgres descritas en el PRD (sección 9 — Arquitectura de Datos).
// Mientras no exista el schema real de Supabase, estas interfaces son el contrato único que
// consumen fixtures, repositorios, hooks y componentes. Migrar a Supabase implica reemplazar
// estos tipos por los generados por `supabase gen types`, idealmente sin romper los nombres de campo.

import type {
  AlcanceRegistro,
  AmbitoUmbral,
  EstadoActivo,
  EstadoFilaImportacion,
  EstadoImportacion,
  EstadoPropuestaIA,
  EstadoRegistro,
  EstadoSolicitudIA,
  EstadoValidacionPoblacion,
  NivelConfianzaFuente,
  NivelRiesgo,
  OrigenRegistro,
  Rol,
  TipoEnfermedad,
  TipoFuenteDato,
  TipoSector,
} from './enums'

interface Trazabilidad {
  creado_por: string | null
  creado_en: string
  actualizado_en: string
}

export interface Profile {
  id: string
  auth_user_id: string
  nombre: string
  apellido: string
  correo: string
  rol: Rol
  clinic_id: string | null
  puede_ver_comparaciones: boolean
  estado: EstadoActivo
  creado_en: string
  actualizado_en: string
}

export interface Sector {
  id: string
  nombre: string
  tipo: TipoSector
  descripcion: string | null
  coordenadas: { lat: number; lng: number } | null
  /** Reservado para la integración futura con MapLibre + GeoJSON (RNF-17). No usado en esta etapa. */
  geojson: unknown | null
  estado: EstadoActivo
}

export interface Clinic {
  id: string
  nombre: string
  nombre_corto: string
  direccion: string
  telefono: string
  correo: string
  sector_id: string
  coordenadas: { lat: number; lng: number } | null
  responsable: string
  estado: EstadoActivo
  creado_en: string
  actualizado_en: string
}

export interface Disease {
  id: string
  nombre: string
  tipo: TipoEnfermedad
  descripcion: string | null
  codigo_referencia: string | null
  estado: EstadoActivo
}

export interface AgeRange {
  id: string
  nombre: string
  edad_min: number
  edad_max: number | null
  orden: number
  estado: EstadoActivo
}

export interface GenderCategory {
  id: string
  nombre: string
  orden: number
  estado: EstadoActivo
}

export interface CommunePopulation {
  id: string
  anio: number
  poblacion: number
  /** Desglose opcional por sexo (el INE lo reporta a nivel comunal); puede no sumar el total
   * exacto si existen categorías no binarias o no informadas en la fuente. */
  poblacion_mujeres: number | null
  poblacion_hombres: number | null
  fuente: string
  estado_validacion: EstadoValidacionPoblacion
}

export interface SectorPopulation {
  id: string
  sector_id: string
  anio: number
  poblacion: number
  fuente: string
  estado_validacion: EstadoValidacionPoblacion
}

export interface DemographicPopulation {
  id: string
  /** null = toda la comuna (no un sector específico). */
  sector_id: string | null
  anio: number
  /** Texto libre, independiente del catálogo age_ranges (evita conflicto de superposición con
   * los rangos amplios usados en registros de salud — ver migración 20260720000000). */
  rango_edad: string
  gender_id: string
  poblacion: number
}

export interface HealthRecord {
  id: string
  alcance: AlcanceRegistro
  clinic_id: string | null
  sector_id: string
  disease_id: string
  age_range_id: string
  gender_id: string
  mes: number
  anio: number
  cantidad_casos: number
  estado: EstadoRegistro
  origen: OrigenRegistro
  fuente: string | null
  observacion_revision: string | null
  creado_por: string
  aprobado_por: string | null
  fecha_aprobacion: string | null
  creado_en: string
  actualizado_en: string
}

export interface RiskThreshold {
  id: string
  nombre: string
  ambito: AmbitoUmbral
  disease_id: string | null
  sector_id: string | null
  umbral_bajo_max: number
  umbral_medio_max: number
  umbral_alto_max: number
  estado: EstadoActivo
}

export interface PercentageThreshold {
  id: string
  nombre: string
  ambito: AmbitoUmbral
  disease_id: string | null
  umbral_atencion: number
  umbral_critico: number
  estado: EstadoActivo
}

export interface DataSource {
  id: string
  institucion: string
  titulo: string
  url: string
  fecha: string
  tipo: TipoFuenteDato
  nivel_confianza: NivelConfianzaFuente
  creado_por: string
  creado_en: string
}

export interface ImportBatch {
  id: string
  nombre_archivo: string
  clinic_id: string | null
  estado: EstadoImportacion
  total_filas: number
  filas_validas: number
  filas_con_error: number
  creado_por: string
  creado_en: string
}

export interface ImportRow {
  id: string
  import_batch_id: string
  numero_fila: number
  datos_originales: Record<string, string>
  estado: EstadoFilaImportacion
  errores: string[]
  es_posible_duplicado: boolean
  health_record_id: string | null
}

export interface AiResearchRequest {
  id: string
  pregunta: string
  contexto: string | null
  estado: EstadoSolicitudIA
  proveedor: string
  solicitado_por: string
  creado_en: string
}

export interface AiDataProposal {
  id: string
  ai_research_request_id: string
  resumen: string
  disease_id: string | null
  sector_id: string | null
  anio: number | null
  variables_utilizadas: string[]
  nivel_confianza: NivelConfianzaFuente
  data_source_ids: string[]
  estado: EstadoPropuestaIA
  revisado_por: string | null
  fecha_revision: string | null
  creado_en: string
}

export type { Trazabilidad }
export type { NivelRiesgo }
