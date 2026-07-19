-- Permite población demográfica a nivel comunal completo (sector_id = null significa
-- "toda la comuna", no un sector específico) y desacopla el rango de edad del catálogo
-- age_ranges compartido con los registros de salud: los grupos quinquenales estándar del INE
-- (0-4, 5-9, ..., 80+) se solapan con los rangos amplios usados para clasificar casos
-- (Infancia 0-11, Adolescencia 12-17, etc.), lo que activaría el bloqueo de superposición de
-- RF-06 si convivieran en el mismo catálogo. rango_edad queda como texto libre, sin FK.
-- Tabla vacía en este momento — sin datos que migrar.

alter table demographic_population
  drop constraint demographic_population_sector_id_anio_age_range_id_gender_i_key,
  drop constraint demographic_population_age_range_id_fkey,
  drop column age_range_id,
  add column rango_edad text not null,
  alter column sector_id drop not null;

-- NULLs no son comparables en un unique constraint plano (igual que en health_records):
-- se usan índices parciales según si el registro es de un sector o de toda la comuna.
create unique index demographic_population_unico_sector
  on demographic_population (sector_id, anio, rango_edad, gender_id)
  where sector_id is not null;
create unique index demographic_population_unico_comuna
  on demographic_population (anio, rango_edad, gender_id)
  where sector_id is null;
