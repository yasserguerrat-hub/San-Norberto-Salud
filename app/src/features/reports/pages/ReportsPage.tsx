import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { DemoDataBadge } from '@/components/shared/badges/DemoDataBadge'
import { toastError, toastSuccess } from '@/components/shared/feedback/ToastHelpers'
import { QueryStateBoundary } from '@/components/shared/states/QueryStateBoundary'
import { diseasesRepository } from '@/data/repositories/diseases.repository'
import { sectorsRepository } from '@/data/repositories/sectors.repository'
import { queryKeys } from '@/lib/query/queryKeys'
import { ReportBuilderForm } from '../components/ReportBuilderForm'
import { ReportPreview } from '../components/ReportPreview'
import { useReportData } from '../hooks/useReportData'
import { exportReportToExcel } from '../lib/exportToExcel'
import type { ReportFilters } from '../types/report.types'

export function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({ mes: 6, anio: 2026, sectorId: 'todos', diseaseId: 'todas' })
  const [isExporting, setIsExporting] = useState(false)
  const reportQuery = useReportData(filters)
  const diseasesQuery = useQuery({ queryKey: queryKeys.diseases.list(), queryFn: () => diseasesRepository.list() })
  const sectorsQuery = useQuery({ queryKey: queryKeys.sectors.list(), queryFn: () => sectorsRepository.list() })

  const sectorLabel = filters.sectorId === 'todos' ? 'Todos' : ((sectorsQuery.data ?? []).find((s) => s.id === filters.sectorId)?.nombre ?? '—')
  const diseaseLabel = filters.diseaseId === 'todas' ? 'Todas' : ((diseasesQuery.data ?? []).find((d) => d.id === filters.diseaseId)?.nombre ?? '—')

  const handleExportExcel = async () => {
    if (!reportQuery.data) return
    setIsExporting(true)
    try {
      await exportReportToExcel(reportQuery.data, filters, `${sectorLabel} · ${diseaseLabel}`)
      toastSuccess('Reporte Excel generado')
    } catch (error) {
      toastError('No se pudo generar el archivo', error instanceof Error ? error.message : undefined)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPdf = () => {
    window.print()
  }

  return (
    <div className="flex flex-col gap-4">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #report-print-area, #report-print-area * { visibility: visible; }
          #report-print-area { position: absolute; inset: 0; border: none; }
        }
      `}</style>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Reportes con filtros, período y gráficos, exportables en PDF (impresión) y Excel con hojas de resumen, registros e
          indicadores (RF-20).
        </p>
        <DemoDataBadge />
      </div>

      <ReportBuilderForm
        filters={filters}
        onChange={setFilters}
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
      />

      <QueryStateBoundary query={reportQuery} emptyTitle="Sin datos para este período">
        {(data) => <ReportPreview data={data} filters={filters} sectorLabel={sectorLabel} diseaseLabel={diseaseLabel} />}
      </QueryStateBoundary>
    </div>
  )
}
