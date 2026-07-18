-- San Norberto Salud — esquema inicial
-- Espejo 1:1 de app/src/types/database.types.ts y app/src/types/enums.ts (PRD sección 9).
-- No romper nombres de campo: el frontend consume estos tipos directamente vía `supabase gen types`.

create extension if not exists pgcrypto;

-- =========================================================================
-- 1. Enumeraciones (app/src/types/enums.ts)
-- =========================================================================

create type rol as enum ('admin_general', 'usuario_clinica');
create type estado_activo as enum ('activo', 'inactivo');
create type tipo_sector as enum ('urbano', 'rural');
create type estado_registro as enum ('pendiente', 'aprobado', 'rechazado', 'requiere_correccion');
create type origen_registro as enum ('manual', 'importado', 'ia');
create type alcance_registro as enum ('clinica', 'sector');
create type nivel_riesgo as enum ('bajo', 'medio', 'alto', 'extremo');
create type estado_validacion_poblacion as enum ('validado', 'pendiente', 'estimado');
create type tipo_fuente_dato as enum ('oficial', 'estudio', 'prensa', 'otro');
create type nivel_confianza_fuente as enum ('alto', 'medio', 'bajo');
create type estado_importacion as enum ('pendiente', 'validando', 'validado', 'con_errores', 'confirmado', 'cancelado');
create type estado_fila_importacion as enum ('valida', 'advertencia', 'error', 'excluida');
create type estado_solicitud_ia as enum ('pendiente', 'en_proceso', 'completada', 'error');
create type estado_propuesta_ia as enum ('propuesta', 'aprobada', 'rechazada');
create type ambito_umbral as enum ('global', 'enfermedad', 'sector');
create type tipo_enfermedad as enum ('enfermedad_cronica', 'enfermedad_aguda', 'padecimiento', 'otro');

-- =========================================================================
-- 2. Catálogos base
-- =========================================================================

create table sectors (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  tipo tipo_sector not null,
  descripcion text,
  coordenadas jsonb,
  geojson jsonb,
  estado estado_activo not null default 'activo'
);

create table clinics (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  nombre_corto text not null,
  direccion text not null,
  telefono text not null,
  correo text not null,
  sector_id uuid not null references sectors (id), -- obligatorio (PRD §5, decisión B)
  coordenadas jsonb,
  responsable text not null,
  estado estado_activo not null default 'activo',
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users (id) on delete cascade,
  nombre text not null,
  apellido text not null,
  correo text not null unique,
  rol rol not null,
  clinic_id uuid references clinics (id), -- opcional para admin_general
  puede_ver_comparaciones boolean not null default false,
  estado estado_activo not null default 'activo',
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint clinic_id_requerido_para_usuario_clinica
    check (rol = 'admin_general' or clinic_id is not null)
);

create table diseases (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  tipo tipo_enfermedad not null,
  descripcion text,
  codigo_referencia text,
  estado estado_activo not null default 'activo'
);

create table age_ranges (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  edad_min integer not null check (edad_min >= 0),
  edad_max integer check (edad_max is null or edad_max > edad_min),
  orden integer not null,
  estado estado_activo not null default 'activo'
);

create table gender_categories (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  orden integer not null,
  estado estado_activo not null default 'activo'
);

-- =========================================================================
-- 3. Población (denominadores para tasas — PRD §9.1)
-- =========================================================================

create table commune_population (
  id uuid primary key default gen_random_uuid(),
  anio integer not null unique check (anio between 1900 and 2999),
  poblacion integer not null check (poblacion > 0),
  fuente text not null,
  estado_validacion estado_validacion_poblacion not null default 'pendiente'
);

create table sector_population (
  id uuid primary key default gen_random_uuid(),
  sector_id uuid not null references sectors (id),
  anio integer not null check (anio between 1900 and 2999),
  poblacion integer not null check (poblacion > 0),
  fuente text not null,
  estado_validacion estado_validacion_poblacion not null default 'pendiente',
  unique (sector_id, anio)
);

create table demographic_population (
  id uuid primary key default gen_random_uuid(),
  sector_id uuid not null references sectors (id),
  anio integer not null check (anio between 1900 and 2999),
  age_range_id uuid not null references age_ranges (id),
  gender_id uuid not null references gender_categories (id),
  poblacion integer not null check (poblacion > 0),
  unique (sector_id, anio, age_range_id, gender_id) -- PRD §9: restricción única anti-duplicados
);

-- =========================================================================
-- 4. Umbrales de riesgo y porcentuales (RF-07)
-- =========================================================================

create table risk_thresholds (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  ambito ambito_umbral not null,
  disease_id uuid references diseases (id),
  sector_id uuid references sectors (id),
  umbral_bajo_max numeric not null,
  umbral_medio_max numeric not null,
  umbral_alto_max numeric not null,
  estado estado_activo not null default 'activo',
  check (umbral_bajo_max < umbral_medio_max and umbral_medio_max < umbral_alto_max),
  check (ambito <> 'enfermedad' or disease_id is not null),
  check (ambito <> 'sector' or sector_id is not null)
);

create table percentage_thresholds (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  ambito ambito_umbral not null,
  disease_id uuid references diseases (id),
  umbral_atencion numeric not null,
  umbral_critico numeric not null,
  estado estado_activo not null default 'activo',
  check (umbral_atencion < umbral_critico),
  check (ambito <> 'enfermedad' or disease_id is not null)
);

-- =========================================================================
-- 5. Registros estadísticos (núcleo del sistema — RF-08 a RF-16)
-- =========================================================================

create table health_records (
  id uuid primary key default gen_random_uuid(),
  alcance alcance_registro not null,
  clinic_id uuid references clinics (id),
  sector_id uuid not null references sectors (id),
  disease_id uuid not null references diseases (id),
  age_range_id uuid not null references age_ranges (id),
  gender_id uuid not null references gender_categories (id),
  mes integer not null check (mes between 1 and 12),
  anio integer not null check (anio between 1900 and 2999),
  cantidad_casos integer not null check (cantidad_casos >= 0),
  estado estado_registro not null default 'pendiente',
  origen origen_registro not null default 'manual',
  fuente text,
  observacion_revision text,
  creado_por uuid not null references profiles (id),
  aprobado_por uuid references profiles (id),
  fecha_aprobacion timestamptz,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  check (alcance <> 'clinica' or clinic_id is not null)
);

-- RF-10: prevención de duplicados por combinación clínica/sector, enfermedad, edad, género, mes, año.
-- NULLs no son comparables en un unique constraint plano, por eso se usan índices parciales por alcance.
create unique index health_records_unico_clinica
  on health_records (clinic_id, sector_id, disease_id, age_range_id, gender_id, mes, anio)
  where alcance = 'clinica';

create unique index health_records_unico_sector
  on health_records (sector_id, disease_id, age_range_id, gender_id, mes, anio)
  where alcance = 'sector';

-- =========================================================================
-- 6. Fuentes de datos e investigación asistida por IA (RF-21 a RF-23)
-- =========================================================================

create table data_sources (
  id uuid primary key default gen_random_uuid(),
  institucion text not null,
  titulo text not null,
  url text not null,
  fecha date not null,
  tipo tipo_fuente_dato not null,
  nivel_confianza nivel_confianza_fuente not null,
  creado_por uuid not null references profiles (id),
  creado_en timestamptz not null default now()
);

create table ai_research_requests (
  id uuid primary key default gen_random_uuid(),
  pregunta text not null,
  contexto text,
  estado estado_solicitud_ia not null default 'pendiente',
  proveedor text not null, -- valor de configuración, nunca hardcodeado en lógica de negocio (RNF-20)
  solicitado_por uuid not null references profiles (id),
  creado_en timestamptz not null default now()
);

create table ai_data_proposals (
  id uuid primary key default gen_random_uuid(),
  ai_research_request_id uuid not null references ai_research_requests (id) on delete cascade,
  resumen text not null,
  disease_id uuid references diseases (id),
  sector_id uuid references sectors (id),
  anio integer check (anio between 1900 and 2999),
  variables_utilizadas text[] not null default '{}',
  nivel_confianza nivel_confianza_fuente not null,
  data_source_ids uuid[] not null default '{}',
  estado estado_propuesta_ia not null default 'propuesta',
  revisado_por uuid references profiles (id),
  fecha_revision timestamptz,
  creado_en timestamptz not null default now()
);

-- =========================================================================
-- 7. Importación masiva (RF-17 a RF-19)
-- =========================================================================

create table import_batches (
  id uuid primary key default gen_random_uuid(),
  nombre_archivo text not null,
  clinic_id uuid references clinics (id),
  estado estado_importacion not null default 'pendiente',
  total_filas integer not null default 0 check (total_filas >= 0),
  filas_validas integer not null default 0 check (filas_validas >= 0),
  filas_con_error integer not null default 0 check (filas_con_error >= 0),
  creado_por uuid not null references profiles (id),
  creado_en timestamptz not null default now()
);

create table import_rows (
  id uuid primary key default gen_random_uuid(),
  import_batch_id uuid not null references import_batches (id) on delete cascade,
  numero_fila integer not null check (numero_fila > 0),
  datos_originales jsonb not null default '{}',
  estado estado_fila_importacion not null default 'valida',
  errores text[] not null default '{}',
  es_posible_duplicado boolean not null default false,
  health_record_id uuid references health_records (id),
  unique (import_batch_id, numero_fila)
);

-- =========================================================================
-- 8. Mantenimiento de `actualizado_en`
-- =========================================================================

create or replace function set_actualizado_en()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

create trigger trg_profiles_actualizado_en
  before update on profiles
  for each row execute function set_actualizado_en();

create trigger trg_clinics_actualizado_en
  before update on clinics
  for each row execute function set_actualizado_en();

create trigger trg_health_records_actualizado_en
  before update on health_records
  for each row execute function set_actualizado_en();

-- =========================================================================
-- 9. Helpers de autorización (RF-03, RNF-01)
-- =========================================================================

create or replace function current_profile_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select id from profiles where auth_user_id = auth.uid();
$$;

create or replace function current_role_es_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce((select rol from profiles where auth_user_id = auth.uid()) = 'admin_general', false);
$$;

create or replace function current_clinic_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select clinic_id from profiles where auth_user_id = auth.uid();
$$;

-- =========================================================================
-- 10. Row Level Security (RNF-01: activo en todas las tablas privadas)
-- =========================================================================

alter table profiles enable row level security;
alter table clinics enable row level security;
alter table diseases enable row level security;
alter table age_ranges enable row level security;
alter table gender_categories enable row level security;
alter table sectors enable row level security;
alter table commune_population enable row level security;
alter table sector_population enable row level security;
alter table demographic_population enable row level security;
alter table health_records enable row level security;
alter table risk_thresholds enable row level security;
alter table percentage_thresholds enable row level security;
alter table data_sources enable row level security;
alter table import_batches enable row level security;
alter table import_rows enable row level security;
alter table ai_research_requests enable row level security;
alter table ai_data_proposals enable row level security;

-- profiles: cada usuario ve su propia fila; el admin gestiona todas (RF-01, permisos §8).
create policy profiles_select on profiles for select to authenticated
  using (current_role_es_admin() or auth_user_id = auth.uid());
create policy profiles_insert on profiles for insert to authenticated
  with check (current_role_es_admin());
create policy profiles_update on profiles for update to authenticated
  using (current_role_es_admin() or auth_user_id = auth.uid())
  with check (current_role_es_admin() or auth_user_id = auth.uid());
create policy profiles_delete on profiles for delete to authenticated
  using (current_role_es_admin());

-- clinics: el admin gestiona todas; el usuario de clínica solo lee la propia.
create policy clinics_select on clinics for select to authenticated
  using (current_role_es_admin() or id = current_clinic_id());
create policy clinics_write on clinics for all to authenticated
  using (current_role_es_admin())
  with check (current_role_es_admin());

-- catálogos: lectura para cualquier usuario autenticado, escritura solo admin (RF-05).
create policy diseases_select on diseases for select to authenticated using (true);
create policy diseases_write on diseases for all to authenticated
  using (current_role_es_admin()) with check (current_role_es_admin());

create policy age_ranges_select on age_ranges for select to authenticated using (true);
create policy age_ranges_write on age_ranges for all to authenticated
  using (current_role_es_admin()) with check (current_role_es_admin());

create policy gender_categories_select on gender_categories for select to authenticated using (true);
create policy gender_categories_write on gender_categories for all to authenticated
  using (current_role_es_admin()) with check (current_role_es_admin());

create policy sectors_select on sectors for select to authenticated using (true);
create policy sectors_write on sectors for all to authenticated
  using (current_role_es_admin()) with check (current_role_es_admin());

-- población: lectura para autenticados (necesaria para calcular tasas), escritura solo admin.
create policy commune_population_select on commune_population for select to authenticated using (true);
create policy commune_population_write on commune_population for all to authenticated
  using (current_role_es_admin()) with check (current_role_es_admin());

create policy sector_population_select on sector_population for select to authenticated using (true);
create policy sector_population_write on sector_population for all to authenticated
  using (current_role_es_admin()) with check (current_role_es_admin());

create policy demographic_population_select on demographic_population for select to authenticated using (true);
create policy demographic_population_write on demographic_population for all to authenticated
  using (current_role_es_admin()) with check (current_role_es_admin());

-- umbrales: lectura para autenticados, escritura solo admin (RF-07).
create policy risk_thresholds_select on risk_thresholds for select to authenticated using (true);
create policy risk_thresholds_write on risk_thresholds for all to authenticated
  using (current_role_es_admin()) with check (current_role_es_admin());

create policy percentage_thresholds_select on percentage_thresholds for select to authenticated using (true);
create policy percentage_thresholds_write on percentage_thresholds for all to authenticated
  using (current_role_es_admin()) with check (current_role_es_admin());

-- health_records: RF-03 — un usuario de clínica solo ve/opera los datos de su propia clínica.
create policy health_records_select on health_records for select to authenticated
  using (current_role_es_admin() or clinic_id = current_clinic_id());
create policy health_records_insert on health_records for insert to authenticated
  with check (current_role_es_admin() or clinic_id = current_clinic_id());
-- RF-12: solo el admin aprueba/rechaza; el usuario de clínica solo corrige registros propios no aprobados.
create policy health_records_update on health_records for update to authenticated
  using (
    current_role_es_admin()
    or (clinic_id = current_clinic_id() and estado in ('pendiente', 'requiere_correccion'))
  )
  with check (
    current_role_es_admin()
    or (clinic_id = current_clinic_id() and estado in ('pendiente', 'requiere_correccion'))
  );
create policy health_records_delete on health_records for delete to authenticated
  using (current_role_es_admin());

-- data_sources / IA: funcionalidad exclusiva de administrador (RF-21, RF-22).
create policy data_sources_all on data_sources for all to authenticated
  using (current_role_es_admin()) with check (current_role_es_admin());
create policy ai_research_requests_all on ai_research_requests for all to authenticated
  using (current_role_es_admin()) with check (current_role_es_admin());
create policy ai_data_proposals_all on ai_data_proposals for all to authenticated
  using (current_role_es_admin()) with check (current_role_es_admin());

-- import_batches / import_rows: cada clínica gestiona sus propias importaciones; admin ve todas.
create policy import_batches_select on import_batches for select to authenticated
  using (current_role_es_admin() or clinic_id = current_clinic_id());
create policy import_batches_insert on import_batches for insert to authenticated
  with check (current_role_es_admin() or clinic_id = current_clinic_id());
create policy import_batches_update on import_batches for update to authenticated
  using (current_role_es_admin() or clinic_id = current_clinic_id())
  with check (current_role_es_admin() or clinic_id = current_clinic_id());

create policy import_rows_select on import_rows for select to authenticated
  using (
    exists (
      select 1 from import_batches b
      where b.id = import_rows.import_batch_id
        and (current_role_es_admin() or b.clinic_id = current_clinic_id())
    )
  );
create policy import_rows_write on import_rows for all to authenticated
  using (
    exists (
      select 1 from import_batches b
      where b.id = import_rows.import_batch_id
        and (current_role_es_admin() or b.clinic_id = current_clinic_id())
    )
  )
  with check (
    exists (
      select 1 from import_batches b
      where b.id = import_rows.import_batch_id
        and (current_role_es_admin() or b.clinic_id = current_clinic_id())
    )
  );
