import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { DemoDataBadge } from '@/components/shared/badges/DemoDataBadge'
import { QueryStateBoundary } from '@/components/shared/states/QueryStateBoundary'
import { diseasesRepository } from '@/data/repositories/diseases.repository'
import { queryKeys } from '@/lib/query/queryKeys'
import type { SelectOption } from '@/types/common.types'
import { ComparisonChart } from '../components/ComparisonChart'
import { ComparisonSelector } from '../components/ComparisonSelector'
import { ComparisonTable } from '../components/ComparisonTable'
import { useComparisonData } from '../hooks/useComparisonData'
import type { ComparisonFilters } from '../types/comparison.types'

export function ComparisonsPage() {
  const diseasesQuery = useQuery({ queryKey: queryKeys.diseases.list(), queryFn: () => diseasesRepository.list() })
  const [filters, setFilters] = useState<ComparisonFilters>({ modo: 'sectores', diseaseId: '', mes: 6, anio: 2026 })

  // El id de la primera enfermedad solo se conoce tras cargar el catálogo real (Supabase asigna
  // uuids), por eso no puede fijarse en el useState inicial.
  useEffect(() => {
    if (filters.diseaseId === '' && diseasesQuery.data && diseasesQuery.data.length > 0) {
      setFilters((prev) => ({ ...prev, diseaseId: diseasesQuery.data[0].id }))
    }
  }, [diseasesQuery.data, filters.diseaseId])

  const comparisonQuery = useComparisonData(filters)

  const diseaseOptions: SelectOption[] = (diseasesQuery.data ?? []).map((d) => ({ value: d.id, label: d.nombre }))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">Compara la tasa por 100.000 habitantes de una enfermedad entre clínicas o sectores.</p>
        <DemoDataBadge />
      </div>

      <ComparisonSelector filters={filters} diseaseOptions={diseaseOptions} onChange={setFilters} />

      <QueryStateBoundary query={comparisonQuery} emptyTitle="Sin datos para esta combinación de filtros">
        {(rows) => (
          <div className="flex flex-col gap-4">
            <ComparisonChart rows={rows} />
            <ComparisonTable rows={rows} />
          </div>
        )}
      </QueryStateBoundary>
    </div>
  )
}
