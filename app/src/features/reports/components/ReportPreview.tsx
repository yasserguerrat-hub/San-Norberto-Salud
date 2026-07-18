import { HorizontalBarChart } from '@/components/shared/charts/HorizontalBarChart'
import logoUrl from '@/assets/images/logo-sannorberto.png'
import { formatMonthYear } from '@/lib/formatters/date'
import { formatNumber } from '@/lib/formatters/number'
import type { ReportData, ReportFilters } from '../types/report.types'

interface ReportPreviewProps {
  data: ReportData
  filters: ReportFilters
  sectorLabel: string
  diseaseLabel: string
}

export function ReportPreview({ data, filters, sectorLabel, diseaseLabel }: ReportPreviewProps) {
  return (
    <div id="report-print-area" className="rounded-[10px] border border-border bg-card p-6">
      <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <img src={logoUrl} alt="" className="size-9 rounded-lg object-cover" />
          <div>
            <div className="font-heading text-sm font-bold text-primary-dark">San Norberto Salud</div>
            <div className="text-xs text-muted-foreground">Reporte estadístico — {formatMonthYear(filters.mes, filters.anio)}</div>
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div>Sector: {sectorLabel}</div>
          <div>Enfermedad: {diseaseLabel}</div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-border p-3">
          <div className="text-[11px] text-muted-foreground">Total de casos</div>
          <div className="font-heading text-lg font-bold text-primary-dark">{formatNumber(data.totalCasos)}</div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <div className="text-[11px] text-muted-foreground">Registros aprobados</div>
          <div className="font-heading text-lg font-bold text-primary-dark">{formatNumber(data.totalRegistros)}</div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <div className="text-[11px] text-muted-foreground">Enfermedades con casos</div>
          <div className="font-heading text-lg font-bold text-primary-dark">{formatNumber(data.porEnfermedad.length)}</div>
        </div>
      </div>

      <div className="mb-2 text-[13px] font-bold text-foreground">Casos por enfermedad</div>
      {data.porEnfermedad.length > 0 ? (
        <HorizontalBarChart
          data={data.porEnfermedad.map((d) => ({ label: d.nombre, value: d.casos }))}
          height={Math.max(160, data.porEnfermedad.length * 30)}
        />
      ) : (
        <p className="text-sm text-muted-foreground">Sin registros aprobados para este filtro.</p>
      )}
    </div>
  )
}
