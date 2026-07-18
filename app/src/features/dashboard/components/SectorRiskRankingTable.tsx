import type { ColumnDef } from '@tanstack/react-table'
import { RiskBadge } from '@/components/shared/badges/RiskBadge'
import { DataTable } from '@/components/shared/data-table/DataTable'
import { formatNumber } from '@/lib/formatters/number'
import { cn } from '@/lib/utils'
import type { DashboardSectorRankingRow } from '../types/dashboard.types'

const columns: ColumnDef<DashboardSectorRankingRow>[] = [
  {
    accessorKey: 'name',
    header: 'Sector',
    cell: ({ row }) => <span className="font-semibold text-foreground">{row.original.name}</span>,
  },
  { accessorKey: 'tipo', header: 'Tipo', cell: ({ row }) => <span className="text-muted-foreground">{row.original.tipo}</span> },
  {
    accessorKey: 'poblacionFmt',
    header: 'Población',
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.poblacionFmt}</span>,
  },
  { accessorKey: 'casos', header: 'Casos', cell: ({ row }) => formatNumber(row.original.casos) },
  { accessorKey: 'tasaLabel', header: 'Tasa /100k' },
  {
    accessorKey: 'riesgo',
    header: 'Riesgo',
    cell: ({ row }) => (row.original.riesgo ? <RiskBadge level={row.original.riesgo} size="sm" /> : <span className="text-xs text-muted-foreground">Sin datos</span>),
  },
]

interface SectorRiskRankingTableProps {
  data: DashboardSectorRankingRow[]
  sectorFiltroInfo: string | null
}

export function SectorRiskRankingTable({ data, sectorFiltroInfo }: SectorRiskRankingTableProps) {
  return (
    <div className="rounded-[10px] border border-border bg-card p-5">
      <div className="mb-1 text-[13px] font-bold text-foreground">Ranking de sectores por tasa de riesgo</div>
      {sectorFiltroInfo ? <div className="mb-2.5 text-xs text-primary-dark">{sectorFiltroInfo}</div> : null}
      <DataTable
        columns={columns}
        data={data}
        pageSize={data.length || 1}
        getRowClassName={(row) => (row.isFilterActive ? 'bg-accent' : undefined)}
        className={cn('[&_tr]:transition-colors')}
      />
    </div>
  )
}
