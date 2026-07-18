import { useQuery } from '@tanstack/react-query'
import { Download, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { diseasesRepository } from '@/data/repositories/diseases.repository'
import { sectorsRepository } from '@/data/repositories/sectors.repository'
import { formatMonthYear } from '@/lib/formatters/date'
import { queryKeys } from '@/lib/query/queryKeys'
import type { ReportFilters } from '../types/report.types'

const PERIODOS = [6, 5, 4, 3, 2, 1].map((mes) => ({ value: `2026-${mes}`, label: formatMonthYear(mes, 2026) }))

interface ReportBuilderFormProps {
  filters: ReportFilters
  onChange: (filters: ReportFilters) => void
  onExportExcel: () => void
  onExportPdf: () => void
  isExporting?: boolean
}

export function ReportBuilderForm({ filters, onChange, onExportExcel, onExportPdf, isExporting }: ReportBuilderFormProps) {
  const diseasesQuery = useQuery({ queryKey: queryKeys.diseases.list(), queryFn: () => diseasesRepository.list() })
  const sectorsQuery = useQuery({ queryKey: queryKeys.sectors.list(), queryFn: () => sectorsRepository.list() })

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={`${filters.anio}-${filters.mes}`}
          onValueChange={(v) => {
            const [anio, mes] = v.split('-').map(Number)
            onChange({ ...filters, anio, mes })
          }}
        >
          <SelectTrigger>
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

        <Select value={filters.sectorId} onValueChange={(v) => onChange({ ...filters, sectorId: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los sectores</SelectItem>
            {(sectorsQuery.data ?? []).map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.diseaseId} onValueChange={(v) => onChange({ ...filters, diseaseId: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las enfermedades</SelectItem>
            {(diseasesQuery.data ?? []).map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onExportPdf}>
          <Printer className="size-3.5" aria-hidden="true" />
          Exportar PDF
        </Button>
        <Button size="sm" onClick={onExportExcel} disabled={isExporting}>
          <Download className="size-3.5" aria-hidden="true" />
          {isExporting ? 'Generando…' : 'Exportar Excel'}
        </Button>
      </div>
    </div>
  )
}
