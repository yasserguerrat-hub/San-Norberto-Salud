import type { ImportBatch, ImportRow } from '@/types/database.types'

export const importBatchesFixture: ImportBatch[] = [
  {
    id: 'import-batch-hospital-junio',
    nombre_archivo: 'registros_hospital_junio2026.xlsx',
    clinic_id: 'clinic-hospital',
    estado: 'confirmado',
    total_filas: 24,
    filas_validas: 22,
    filas_con_error: 2,
    creado_por: 'profile-hospital',
    creado_en: '2026-06-05T14:20:00.000Z',
  },
  {
    id: 'import-batch-cesfam-centro-mayo',
    nombre_archivo: 'cesfam_centro_mayo2026.csv',
    clinic_id: 'clinic-cesfam-centro',
    estado: 'con_errores',
    total_filas: 15,
    filas_validas: 11,
    filas_con_error: 4,
    creado_por: 'profile-cesfam-centro',
    creado_en: '2026-06-01T10:05:00.000Z',
  },
]

export const importRowsFixture: ImportRow[] = [
  {
    id: 'import-row-1',
    import_batch_id: 'import-batch-cesfam-centro-mayo',
    numero_fila: 6,
    datos_originales: {
      enfermedad: 'Hipertension arterial',
      rango_edad: '26-59',
      genero: 'F',
      mes: '5',
      anio: '2026',
      casos: '-3',
    },
    estado: 'error',
    errores: ['La cantidad de casos no puede ser negativa'],
    es_posible_duplicado: false,
    health_record_id: null,
  },
  {
    id: 'import-row-2',
    import_batch_id: 'import-batch-cesfam-centro-mayo',
    numero_fila: 9,
    datos_originales: {
      enfermedad: 'Diabetes tipo 2',
      rango_edad: '26-59',
      genero: 'M',
      mes: '5',
      anio: '2026',
      casos: '7',
    },
    estado: 'advertencia',
    errores: ['Posible duplicado de un registro existente para la misma combinación'],
    es_posible_duplicado: true,
    health_record_id: null,
  },
]
