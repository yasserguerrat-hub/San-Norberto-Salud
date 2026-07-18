export const IMPORT_CSV_HEADERS = ['enfermedad', 'rango_edad', 'genero', 'clinica', 'sector', 'mes', 'anio', 'casos'] as const

const EXAMPLE_ROW = [
  'Hipertensión arterial',
  'Adultez media (26-59)',
  'Femenino',
  'CESFAM Centro',
  '',
  '6',
  '2026',
  '5',
]

export function downloadImportTemplate(): void {
  const csv = [IMPORT_CSV_HEADERS.join(','), EXAMPLE_ROW.join(',')].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'plantilla_registros_san_norberto_salud.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
