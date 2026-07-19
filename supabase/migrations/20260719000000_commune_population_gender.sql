-- Desglose por sexo en la población comunal (el INE reporta mujeres/hombres a nivel comunal,
-- además del total). Columnas opcionales para no romper los registros existentes
-- (RNF-16: "la estructura debe permitir agregar nuevos campos sin romper registros existentes").
alter table commune_population
  add column poblacion_mujeres integer check (poblacion_mujeres is null or poblacion_mujeres >= 0),
  add column poblacion_hombres integer check (poblacion_hombres is null or poblacion_hombres >= 0);
