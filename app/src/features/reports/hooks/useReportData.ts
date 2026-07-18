import { useQuery } from '@tanstack/react-query'
import { ageRangesRepository } from '@/data/repositories/ageRanges.repository'
import { clinicsRepository } from '@/data/repositories/clinics.repository'
import { diseasesRepository } from '@/data/repositories/diseases.repository'
import { genderCategoriesRepository } from '@/data/repositories/genderCategories.repository'
import { healthRecordsRepository } from '@/data/repositories/healthRecords.repository'
import { sectorsRepository } from '@/data/repositories/sectors.repository'
import type { ReportData, ReportFilters } from '../types/report.types'

export function useReportData(filters: ReportFilters) {
  return useQuery({
    queryKey: ['report-data', filters],
    queryFn: async (): Promise<ReportData> => {
      const [records, diseases, ageRanges, genders, sectors, clinics] = await Promise.all([
        healthRecordsRepository.list({
          anio: filters.anio,
          mes: filters.mes,
          estado: 'aprobado',
          sectorId: filters.sectorId === 'todos' ? undefined : filters.sectorId,
          diseaseId: filters.diseaseId === 'todas' ? undefined : filters.diseaseId,
        }),
        diseasesRepository.list(),
        ageRangesRepository.list(),
        genderCategoriesRepository.list(),
        sectorsRepository.list(),
        clinicsRepository.list(),
      ])

      const diseaseById = new Map(diseases.map((d) => [d.id, d.nombre]))
      const ageById = new Map(ageRanges.map((a) => [a.id, a.nombre]))
      const genderById = new Map(genders.map((g) => [g.id, g.nombre]))
      const sectorById = new Map(sectors.map((s) => [s.id, s.nombre]))
      const clinicById = new Map(clinics.map((c) => [c.id, c.nombre_corto]))

      const casosPorEnfermedad = new Map<string, number>()
      for (const record of records) {
        casosPorEnfermedad.set(record.disease_id, (casosPorEnfermedad.get(record.disease_id) ?? 0) + record.cantidad_casos)
      }

      const porEnfermedad = [...casosPorEnfermedad.entries()]
        .map(([diseaseId, casos]) => ({ nombre: diseaseById.get(diseaseId) ?? '—', casos }))
        .sort((a, b) => b.casos - a.casos)

      const registros = records.map((record) => ({
        enfermedad: diseaseById.get(record.disease_id) ?? '—',
        clinicaOSector: record.clinic_id ? (clinicById.get(record.clinic_id) ?? '—') : `${sectorById.get(record.sector_id) ?? '—'} (sector)`,
        rangoEdad: ageById.get(record.age_range_id) ?? '—',
        genero: genderById.get(record.gender_id) ?? '—',
        casos: record.cantidad_casos,
        estado: record.estado,
      }))

      return {
        totalCasos: records.reduce((total, r) => total + r.cantidad_casos, 0),
        totalRegistros: records.length,
        porEnfermedad,
        registros,
      }
    },
  })
}
