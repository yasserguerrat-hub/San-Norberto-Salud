export interface ReportFilters {
  mes: number
  anio: number
  sectorId: string | 'todos'
  diseaseId: string | 'todas'
}

export interface ReportDiseaseRow {
  nombre: string
  casos: number
}

export interface ReportRecordRow {
  enfermedad: string
  clinicaOSector: string
  rangoEdad: string
  genero: string
  casos: number
  estado: string
}

export interface ReportData {
  totalCasos: number
  totalRegistros: number
  porEnfermedad: ReportDiseaseRow[]
  registros: ReportRecordRow[]
}
