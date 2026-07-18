// Enumeraciones alineadas con la arquitectura de datos del PRD (sección 9).
// Estos union types reflejan los valores esperados en las columnas equivalentes
// de Postgres/Supabase el día que se reemplacen las fixtures por datos reales.

export type Rol = 'admin_general' | 'usuario_clinica'

export type EstadoActivo = 'activo' | 'inactivo'

export type TipoSector = 'urbano' | 'rural'

export type EstadoRegistro = 'pendiente' | 'aprobado' | 'rechazado' | 'requiere_correccion'

export type OrigenRegistro = 'manual' | 'importado' | 'ia'

export type AlcanceRegistro = 'clinica' | 'sector'

export type NivelRiesgo = 'bajo' | 'medio' | 'alto' | 'extremo'

export type EstadoValidacionPoblacion = 'validado' | 'pendiente' | 'estimado'

export type TipoFuenteDato = 'oficial' | 'estudio' | 'prensa' | 'otro'

export type NivelConfianzaFuente = 'alto' | 'medio' | 'bajo'

export type EstadoImportacion =
  | 'pendiente'
  | 'validando'
  | 'validado'
  | 'con_errores'
  | 'confirmado'
  | 'cancelado'

export type EstadoFilaImportacion = 'valida' | 'advertencia' | 'error' | 'excluida'

export type EstadoSolicitudIA = 'pendiente' | 'en_proceso' | 'completada' | 'error'

export type EstadoPropuestaIA = 'propuesta' | 'aprobada' | 'rechazada'

export type AmbitoUmbral = 'global' | 'enfermedad' | 'sector'

export type TipoEnfermedad = 'enfermedad_cronica' | 'enfermedad_aguda' | 'padecimiento' | 'otro'
