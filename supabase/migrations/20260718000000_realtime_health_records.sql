-- RF-16: actualización en tiempo real de indicadores tras la aprobación de un registro.
-- Sin agregar la tabla a la publicación de Realtime, ningún cliente recibe eventos aunque
-- se suscriba (postgres_changes se basa en logical replication vía esta publicación).
alter publication supabase_realtime add table health_records;

-- REPLICA IDENTITY FULL para que los eventos UPDATE/DELETE incluyan la fila completa anterior
-- (necesario para distinguir, p. ej., una aprobación de un rechazo en el payload del cliente).
alter table health_records replica identity full;
