import { HorizontalBarChart } from '@/components/shared/charts/HorizontalBarChart'
import type { DashboardDiseaseDatum } from '../types/dashboard.types'

interface DiseaseBarChartProps {
  data: DashboardDiseaseDatum[]
  periodoLabel: string
  enfermedadInfo: string | null
}

export function DiseaseBarChart({ data, periodoLabel, enfermedadInfo }: DiseaseBarChartProps) {
  return (
    <div className="rounded-[10px] border border-border bg-card p-5">
      <div className="mb-3.5 text-[13px] font-bold text-foreground">Casos por enfermedad — {periodoLabel}</div>
      <HorizontalBarChart
        data={data.map((d) => ({ label: d.label, value: d.value, active: d.active }))}
        height={Math.max(180, data.length * 30)}
      />
      {enfermedadInfo ? (
        <div className="mt-2.5 rounded-md bg-accent px-3 py-2 text-xs text-primary-dark">{enfermedadInfo}</div>
      ) : null}
    </div>
  )
}
