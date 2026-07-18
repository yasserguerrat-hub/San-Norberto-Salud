import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatMonthYear } from '@/lib/formatters/date'
import type { SelectOption } from '@/types/common.types'
import type { ComparisonFilters } from '../types/comparison.types'

interface ComparisonSelectorProps {
  filters: ComparisonFilters
  diseaseOptions: SelectOption[]
  onChange: (filters: ComparisonFilters) => void
}

const PERIODOS = [6, 5, 4, 3, 2, 1].map((mes) => ({ value: `2026-${mes}`, label: formatMonthYear(mes, 2026) }))

export function ComparisonSelector({ filters, diseaseOptions, onChange }: ComparisonSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={filters.modo} onValueChange={(v) => onChange({ ...filters, modo: v as ComparisonFilters['modo'] })}>
        <SelectTrigger className="bg-card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="clinicas">Comparar clínicas</SelectItem>
          <SelectItem value="sectores">Comparar sectores</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.diseaseId} onValueChange={(v) => onChange({ ...filters, diseaseId: v })}>
        <SelectTrigger className="bg-card">
          <SelectValue placeholder="Selecciona una enfermedad" />
        </SelectTrigger>
        <SelectContent>
          {diseaseOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={`${filters.anio}-${filters.mes}`}
        onValueChange={(v) => {
          const [anio, mes] = v.split('-').map(Number)
          onChange({ ...filters, anio, mes })
        }}
      >
        <SelectTrigger className="bg-card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PERIODOS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
