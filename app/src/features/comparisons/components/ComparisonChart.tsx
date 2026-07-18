import { HorizontalBarChart } from '@/components/shared/charts/HorizontalBarChart'
import { formatRate } from '@/lib/formatters/number'
import type { ComparisonRow } from '../types/comparison.types'

export function ComparisonChart({ rows }: { rows: ComparisonRow[] }) {
  const data = [...rows]
    .filter((r) => r.tasaValor != null)
    .sort((a, b) => (b.tasaValor ?? 0) - (a.tasaValor ?? 0))
    .map((r) => ({ label: r.nombre, value: r.tasaValor ?? 0 }))

  return (
    <div className="rounded-[10px] border border-border bg-card p-5">
      <div className="mb-3.5 text-[13px] font-bold text-foreground">Tasa por 100.000 habitantes</div>
      <HorizontalBarChart data={data} height={Math.max(180, data.length * 32)} valueFormatter={formatRate} />
    </div>
  )
}
