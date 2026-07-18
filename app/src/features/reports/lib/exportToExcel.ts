import ExcelJS from 'exceljs'
import { formatMonthYear } from '@/lib/formatters/date'
import type { ReportData, ReportFilters } from '../types/report.types'

const RISK_HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF176B87' } } as const

export async function exportReportToExcel(data: ReportData, filters: ReportFilters, periodoLabel: string): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'San Norberto Salud'
  workbook.created = new Date()

  // --- Hoja Resumen ---
  const resumen = workbook.addWorksheet('Resumen')
  resumen.columns = [{ width: 32 }, { width: 20 }]
  resumen.addRow(['San Norberto Salud — Reporte estadístico', ''])
  resumen.addRow(['Período', periodoLabel])
  resumen.addRow(['Total de casos aprobados', data.totalCasos])
  resumen.addRow(['Total de registros', data.totalRegistros])
  resumen.addRow([])
  resumen.addRow(['Casos por enfermedad', 'Casos']).font = { bold: true }
  for (const row of data.porEnfermedad) {
    resumen.addRow([row.nombre, row.casos])
  }
  resumen.getRow(1).font = { bold: true, size: 14, color: { argb: 'FF123B52' } }
  resumen.getRow(6).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = RISK_HEADER_FILL
  })

  // --- Hoja Registros ---
  const registrosSheet = workbook.addWorksheet('Registros')
  registrosSheet.columns = [
    { header: 'Enfermedad', key: 'enfermedad', width: 28 },
    { header: 'Clínica / Sector', key: 'clinicaOSector', width: 24 },
    { header: 'Rango de edad', key: 'rangoEdad', width: 22 },
    { header: 'Género', key: 'genero', width: 16 },
    { header: 'Casos', key: 'casos', width: 10 },
    { header: 'Estado', key: 'estado', width: 14 },
  ]
  registrosSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  registrosSheet.getRow(1).eachCell((cell) => (cell.fill = RISK_HEADER_FILL))
  for (const row of data.registros) {
    registrosSheet.addRow(row)
  }

  // --- Hoja Indicadores ---
  const indicadores = workbook.addWorksheet('Indicadores')
  indicadores.columns = [
    { header: 'Enfermedad', key: 'nombre', width: 28 },
    { header: 'Casos', key: 'casos', width: 12 },
    { header: '% del total', key: 'pct', width: 14 },
  ]
  indicadores.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  indicadores.getRow(1).eachCell((cell) => (cell.fill = RISK_HEADER_FILL))
  for (const row of data.porEnfermedad) {
    indicadores.addRow({ nombre: row.nombre, casos: row.casos, pct: data.totalCasos > 0 ? `${((row.casos / data.totalCasos) * 100).toFixed(1)}%` : '0%' })
  }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `reporte_san_norberto_salud_${formatMonthYear(filters.mes, filters.anio).replace(' ', '_').toLowerCase()}.xlsx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
