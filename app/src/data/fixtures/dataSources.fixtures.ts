import type { DataSource } from '@/types/database.types'

export const dataSourcesFixture: DataSource[] = [
  {
    id: 'source-minsal-ira',
    institucion: 'Ministerio de Salud de Chile (MINSAL)',
    titulo: 'Informe de vigilancia de enfermedades respiratorias — Región Metropolitana',
    url: 'https://www.minsal.cl/vigilancia-respiratoria',
    fecha: '2026-06-02',
    tipo: 'oficial',
    nivel_confianza: 'alto',
    creado_por: 'profile-admin',
    creado_en: '2026-06-03T12:00:00.000Z',
  },
  {
    id: 'source-ine-poblacion',
    institucion: 'Instituto Nacional de Estadísticas (INE)',
    titulo: 'Proyecciones de población comunal 2017-2035',
    url: 'https://www.ine.gob.cl/estadisticas/sociales/demografia-y-vitales',
    fecha: '2025-11-15',
    tipo: 'oficial',
    nivel_confianza: 'alto',
    creado_por: 'profile-admin',
    creado_en: '2025-11-20T12:00:00.000Z',
  },
  {
    id: 'source-seremi-rm',
    institucion: 'SEREMI de Salud Región Metropolitana',
    titulo: 'Boletín epidemiológico comunal — enfermedades crónicas no transmisibles',
    url: 'https://www.seremidesaludrm.cl/boletin-ecnt',
    fecha: '2026-05-20',
    tipo: 'oficial',
    nivel_confianza: 'medio',
    creado_por: 'profile-admin',
    creado_en: '2026-05-22T12:00:00.000Z',
  },
]
