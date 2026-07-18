import type { ColumnDef } from '@tanstack/react-table'
import { RiskBadge } from '@/components/shared/badges/RiskBadge'
import { DataTable } from '@/components/shared/data-table/DataTable'
import { formatNumber } from '@/lib/formatters/number'
import type { ComparisonRow } from '../types/comparison.types'

const columns: ColumnDef<ComparisonRow>[] = [
  { accessorKey: 'nombre', header: 'Nombre', cell: ({ row }) => <span className="font-semibold text-foreground">{row.original.nombre}</span> },
  { accessorKey: 'casos', header: 'Casos', cell: ({ row }) => formatNumber(row.original.casos) },
  {
    accessorKey: 'poblacion',
    header: 'Población',
    cell: ({ row }) => (row.original.poblacion != null ? formatNumber(row.original.poblacion) : '—'),
  },
  { accessorKey: 'tasaLabel', header: 'Tasa /100k' },
  {
    accessorKey: 'riesgo',
    header: 'Riesgo',
    cell: ({ row }) => (row.original.riesgo ? <RiskBadge level={row.original.riesgo} size="sm" /> : <span className="text-xs text-muted-foreground">Sin datos</span>),
  },
]

export function ComparisonTable({ rows }: { rows: ComparisonRow[] }) {
  return <DataTable columns={columns} data={[...rows].sort((a, b) => (b.tasaValor ?? -1) - (a.tasaValor ?? -1))} pageSize={rows.length || 1} />
}
