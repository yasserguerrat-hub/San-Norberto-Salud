import { ChartLegend } from '@/components/shared/charts/ChartLegend'
import { DoughnutChart } from '@/components/shared/charts/DoughnutChart'
import type { DashboardGenderDatum } from '../types/dashboard.types'

export function GenderDoughnutChart({ data }: { data: DashboardGenderDatum[] }) {
  return (
    <div className="rounded-[10px] border border-border bg-card p-5">
      <div className="mb-3.5 text-[13px] font-bold text-foreground">Distribución por sexo o género</div>
      <DoughnutChart data={data.map((d) => ({ label: d.label, value: d.value, color: d.color }))} />
      <div className="mt-4">
        <ChartLegend items={data.map((d) => ({ label: d.label, value: `${d.pct}%`, color: d.color }))} />
      </div>
    </div>
  )
}
