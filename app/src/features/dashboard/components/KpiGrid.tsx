import { KpiCard } from '@/components/shared/kpi/KpiCard'
import type { DashboardKpi } from '../types/dashboard.types'

export function KpiGrid({ kpis }: { kpis: DashboardKpi[] }) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} sub={kpi.sub} />
      ))}
    </div>
  )
}
