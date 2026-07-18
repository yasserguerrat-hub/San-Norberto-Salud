import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { QueryStateBoundary } from '@/components/shared/states/QueryStateBoundary'
import { diseasesRepository } from '@/data/repositories/diseases.repository'
import { sectorsRepository } from '@/data/repositories/sectors.repository'
import { formatMonthYear } from '@/lib/formatters/date'
import { queryKeys } from '@/lib/query/queryKeys'
import type { SelectOption } from '@/types/common.types'
import { DashboardFilters } from '../components/DashboardFilters'
import { DashboardHeroBanner } from '../components/DashboardHeroBanner'
import { DiseaseBarChart } from '../components/DiseaseBarChart'
import { GenderDoughnutChart } from '../components/GenderDoughnutChart'
import { KpiGrid } from '../components/KpiGrid'
import { SectorRiskRankingTable } from '../components/SectorRiskRankingTable'
import { useDashboardData } from '../hooks/useDashboardData'
import type { DashboardFilters as DashboardFiltersState } from '../types/dashboard.types'

const PERIODO_OPTIONS: SelectOption[] = [6, 5, 4, 3, 2, 1].map((mes) => ({
  value: `2026-${mes}`,
  label: formatMonthYear(mes, 2026),
}))

export function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFiltersState>({ mes: 6, anio: 2026, sectorId: 'todos', diseaseId: 'todas' })

  const diseasesQuery = useQuery({ queryKey: queryKeys.diseases.list(), queryFn: () => diseasesRepository.list() })
  const sectorsQuery = useQuery({ queryKey: queryKeys.sectors.list(), queryFn: () => sectorsRepository.list() })
  const dashboardQuery = useDashboardData(filters)

  const sectorOptions: SelectOption[] = useMemo(
    () => [
      { value: 'todos', label: 'Todos los sectores' },
      ...(sectorsQuery.data ?? []).map((s) => ({ value: s.id, label: s.nombre })),
    ],
    [sectorsQuery.data],
  )
  const diseaseOptions: SelectOption[] = useMemo(
    () => [
      { value: 'todas', label: 'Todas las enfermedades' },
      ...(diseasesQuery.data ?? []).map((d) => ({ value: d.id, label: d.nombre })),
    ],
    [diseasesQuery.data],
  )

  return (
    <div>
      <DashboardHeroBanner />
      <DashboardFilters
        periodoOptions={PERIODO_OPTIONS}
        sectorOptions={sectorOptions}
        diseaseOptions={diseaseOptions}
        periodoValue={`${filters.anio}-${filters.mes}`}
        sectorValue={filters.sectorId}
        diseaseValue={filters.diseaseId}
        onChangePeriodo={(value) => {
          const [anio, mes] = value.split('-').map(Number)
          setFilters((f) => ({ ...f, anio, mes }))
        }}
        onChangeSector={(value) => setFilters((f) => ({ ...f, sectorId: value }))}
        onChangeDisease={(value) => setFilters((f) => ({ ...f, diseaseId: value }))}
      />

      <QueryStateBoundary
        query={dashboardQuery}
        isEmpty={(data) => data.diseaseChart.length === 0}
        loadingLabel="Calculando indicadores del período…"
        emptyTitle="Sin registros aprobados para este período"
        emptyDescription="Cuando existan registros aprobados para el período seleccionado, aquí se mostrarán los indicadores."
      >
        {(data) => (
          <>
            <KpiGrid kpis={data.kpis} />
            <div className="mb-4 grid grid-cols-1 gap-3.5 lg:grid-cols-[1.4fr_1fr]">
              <DiseaseBarChart data={data.diseaseChart} periodoLabel={data.periodoLabel} enfermedadInfo={data.enfermedadInfo} />
              <GenderDoughnutChart data={data.genderChart} />
            </div>
            <SectorRiskRankingTable data={data.sectorRanking} sectorFiltroInfo={data.sectorFiltroInfo} />
          </>
        )}
      </QueryStateBoundary>
    </div>
  )
}
