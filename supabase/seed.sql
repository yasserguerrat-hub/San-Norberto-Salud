-- Datos de catálogo para desarrollo local (mismos valores que app/src/data/fixtures,
-- para que el dashboard se vea igual conectado a Supabase local que en modo demo).
-- No incluye profiles/health_records: requieren usuarios reales creados vía Supabase Auth
-- (ver README.md "Desarrollo local" para crear el primer admin).

insert into sectors (id, nombre, tipo, descripcion, coordenadas, estado) values
  ('00000000-0000-0000-0000-000000000001', 'Centro Melipilla', 'urbano', 'Casco histórico y comercial de la comuna.', '{"lat": -33.6833, "lng": -71.2167}', 'activo'),
  ('00000000-0000-0000-0000-000000000002', 'Sector Hospital', 'urbano', 'Entorno del Hospital San José de Melipilla.', '{"lat": -33.6879, "lng": -71.2211}', 'activo'),
  ('00000000-0000-0000-0000-000000000003', 'El Prado', 'urbano', 'Sector residencial al norte del centro.', '{"lat": -33.6741, "lng": -71.2145}', 'activo'),
  ('00000000-0000-0000-0000-000000000004', 'Las Mercedes', 'urbano', 'Sector residencial al oriente de la comuna.', '{"lat": -33.6798, "lng": -71.2043}', 'activo'),
  ('00000000-0000-0000-0000-000000000005', 'San Manuel', 'rural', 'Localidad rural al sur de la comuna.', '{"lat": -33.7231, "lng": -71.2298}', 'activo'),
  ('00000000-0000-0000-0000-000000000006', 'Rural Norte', 'rural', 'Zona rural dispersa al norte de la comuna.', '{"lat": -33.6321, "lng": -71.2201}', 'activo'),
  ('00000000-0000-0000-0000-000000000007', 'Rural Sur', 'rural', 'Zona rural dispersa al sur de la comuna.', '{"lat": -33.7412, "lng": -71.1987}', 'activo'),
  ('00000000-0000-0000-0000-000000000008', 'Pomaire', 'rural', 'Localidad rural conocida por su tradición alfarera.', '{"lat": -33.6667, "lng": -71.2872}', 'activo');

insert into clinics (id, nombre, nombre_corto, direccion, telefono, correo, sector_id, coordenadas, responsable, estado) values
  ('00000000-0000-0000-0000-0000000000c1', 'Hospital San José de Melipilla', 'Hospital San José', 'Av. Alberto Hurtado 705, Melipilla', '+56 2 2378 0000', 'contacto@hospitalmelipilla.cl', '00000000-0000-0000-0000-000000000002', '{"lat": -33.6879, "lng": -71.2211}', 'Dra. Marcela Ibáñez', 'activo'),
  ('00000000-0000-0000-0000-0000000000c2', 'CESFAM Dr. Alberto Allende', 'CESFAM Centro', 'Ortiz de Rozas 450, Melipilla', '+56 2 2831 2200', 'cesfamcentro@sansnorbertosalud.cl', '00000000-0000-0000-0000-000000000001', '{"lat": -33.6833, "lng": -71.2167}', 'Enf. Patricio Vera', 'activo'),
  ('00000000-0000-0000-0000-0000000000c3', 'CESFAM El Prado', 'CESFAM El Prado', 'Los Aromos 1230, Melipilla', '+56 2 2831 5510', 'cesfamelprado@sansnorbertosalud.cl', '00000000-0000-0000-0000-000000000003', '{"lat": -33.6741, "lng": -71.2145}', 'Mat. Javiera Rojas', 'activo'),
  ('00000000-0000-0000-0000-0000000000c4', 'Posta de Salud Rural Las Mercedes', 'Posta Las Mercedes', 'Camino Las Mercedes s/n, Melipilla', '+56 2 2831 6620', 'postalasmercedes@sansnorbertosalud.cl', '00000000-0000-0000-0000-000000000004', '{"lat": -33.6798, "lng": -71.2043}', 'Téc. Enf. Rodrigo Salas', 'activo'),
  ('00000000-0000-0000-0000-0000000000c5', 'Posta de Salud Rural San Manuel', 'Posta San Manuel', 'Ruta G-60-CH km 8, San Manuel', '+56 2 2831 7710', 'postasanmanuel@sansnorbertosalud.cl', '00000000-0000-0000-0000-000000000005', '{"lat": -33.7231, "lng": -71.2298}', 'Mat. Carolina Muñoz', 'activo'),
  ('00000000-0000-0000-0000-0000000000c6', 'Posta de Salud Rural Pomaire', 'Posta Pomaire', 'Camino a Pomaire s/n, Pomaire', '+56 2 2831 8830', 'postapomaire@sansnorbertosalud.cl', '00000000-0000-0000-0000-000000000008', '{"lat": -33.6667, "lng": -71.2872}', 'Enf. Daniela Contreras', 'activo');

insert into age_ranges (id, nombre, edad_min, edad_max, orden, estado) values
  ('00000000-0000-0000-0000-0000000000a1', 'Infancia (0-11)', 0, 11, 1, 'activo'),
  ('00000000-0000-0000-0000-0000000000a2', 'Adolescencia (12-17)', 12, 17, 2, 'activo'),
  ('00000000-0000-0000-0000-0000000000a3', 'Juventud (18-25)', 18, 25, 3, 'activo'),
  ('00000000-0000-0000-0000-0000000000a4', 'Adultez media (26-59)', 26, 59, 4, 'activo'),
  ('00000000-0000-0000-0000-0000000000a5', 'Tercera edad (60-79)', 60, 79, 5, 'activo'),
  ('00000000-0000-0000-0000-0000000000a6', 'Cuarta edad (80+)', 80, null, 6, 'activo');

insert into gender_categories (id, nombre, orden, estado) values
  ('00000000-0000-0000-0000-0000000000g1', 'Femenino', 1, 'activo'),
  ('00000000-0000-0000-0000-0000000000g2', 'Masculino', 2, 'activo'),
  ('00000000-0000-0000-0000-0000000000g3', 'Otro', 3, 'activo'),
  ('00000000-0000-0000-0000-0000000000g4', 'No informado', 4, 'activo');

insert into diseases (id, nombre, tipo, descripcion, codigo_referencia, estado) values
  ('00000000-0000-0000-0000-0000000000d1', 'Hipertensión arterial', 'enfermedad_cronica', 'Presión arterial sostenidamente elevada.', 'CIE-10 I10', 'activo'),
  ('00000000-0000-0000-0000-0000000000d2', 'Diabetes tipo 2', 'enfermedad_cronica', 'Trastorno metabólico caracterizado por hiperglicemia crónica.', 'CIE-10 E11', 'activo'),
  ('00000000-0000-0000-0000-0000000000d3', 'Infecciones respiratorias agudas', 'enfermedad_aguda', 'Cuadros respiratorios agudos, principalmente estacionales.', 'CIE-10 J06', 'activo'),
  ('00000000-0000-0000-0000-0000000000d4', 'Obesidad', 'padecimiento', 'Exceso de peso corporal con riesgo para la salud.', 'CIE-10 E66', 'activo'),
  ('00000000-0000-0000-0000-0000000000d5', 'Depresión', 'enfermedad_cronica', 'Trastorno del ánimo diagnosticado por profesional de salud mental.', 'CIE-10 F32', 'activo'),
  ('00000000-0000-0000-0000-0000000000d6', 'Enfermedad renal crónica', 'enfermedad_cronica', 'Pérdida progresiva de la función renal.', 'CIE-10 N18', 'activo'),
  ('00000000-0000-0000-0000-0000000000d7', 'Enfermedad cardiovascular', 'enfermedad_cronica', 'Afecciones del corazón y vasos sanguíneos.', 'CIE-10 I25', 'activo'),
  ('00000000-0000-0000-0000-0000000000d8', 'Artrosis', 'padecimiento', 'Desgaste degenerativo articular.', 'CIE-10 M19', 'activo');

insert into commune_population (anio, poblacion, fuente, estado_validacion) values
  (2024, 122000, 'INE — proyección de población comunal', 'validado'),
  (2025, 123500, 'INE — proyección de población comunal', 'estimado');

insert into risk_thresholds (nombre, ambito, umbral_bajo_max, umbral_medio_max, umbral_alto_max, estado) values
  ('Umbral global por defecto', 'global', 100, 300, 600, 'activo');

insert into percentage_thresholds (nombre, ambito, umbral_atencion, umbral_critico, estado) values
  ('Umbral global por defecto', 'global', 10, 25, 'activo');
