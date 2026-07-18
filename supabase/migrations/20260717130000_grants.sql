-- Las políticas RLS solo se evalúan si el rol ya tiene el privilegio base sobre la tabla;
-- sin este GRANT, Postgres devuelve "permission denied for table X" antes de llegar a RLS.
-- (No se otorga nada a `anon`: toda ruta privada exige sesión autenticada — RNF-03.)

grant usage on schema public to authenticated, service_role;

grant all on all tables in schema public to service_role;
grant select, insert, update, delete on all tables in schema public to authenticated;

alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
