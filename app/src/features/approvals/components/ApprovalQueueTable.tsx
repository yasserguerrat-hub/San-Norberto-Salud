import type { ColumnDef } from '@tanstack/react-table'
import { CircleCheck, MessageSquareWarning, XCircle } from 'lucide-react'
import { OrigenBadge } from '@/components/shared/badges/StatusBadge'
import { DataTable } from '@/components/shared/data-table/DataTable'
import { Button } from '@/components/ui/button'
import { formatMonthYear } from '@/lib/formatters/date'
import { formatNumber } from '@/lib/formatters/number'
import type { AgeRange, Clinic, Disease, GenderCategory, HealthRecord, Sector } from '@/types/database.types'

interface ApprovalQueueTableProps {
  records: HealthRecord[]
  diseases: Disease[]
  ageRanges: AgeRange[]
  genders: GenderCategory[]
  sectors: Sector[]
  clinics: Clinic[]
  onApprove: (record: HealthRecord) => void
  onReject: (record: HealthRecord) => void
  onRequestCorrection: (record: HealthRecord) => void
}

export function ApprovalQueueTable({
  records,
  diseases,
  ageRanges,
  genders,
  sectors,
  clinics,
  onApprove,
  onReject,
  onRequestCorrection,
}: ApprovalQueueTableProps) {
  const diseaseById = new Map(diseases.map((d) => [d.id, d.nombre]))
  const ageById = new Map(ageRanges.map((a) => [a.id, a.nombre]))
  const genderById = new Map(genders.map((g) => [g.id, g.nombre]))
  const sectorById = new Map(sectors.map((s) => [s.id, s.nombre]))
  const clinicById = new Map(clinics.map((c) => [c.id, c.nombre_corto]))

  const columns: ColumnDef<HealthRecord>[] = [
    { accessorKey: 'disease_id', header: 'Enfermedad', cell: ({ row }) => diseaseById.get(row.original.disease_id) ?? '—' },
    {
      id: 'alcance',
      header: 'Clínica / Sector',
      cell: ({ row }) =>
        row.original.clinic_id ? (clinicById.get(row.original.clinic_id) ?? '—') : `${sectorById.get(row.original.sector_id) ?? '—'} (sector)`,
    },
    {
      id: 'detalle',
      header: 'Edad / Género',
      cell: ({ row }) => `${ageById.get(row.original.age_range_id) ?? '—'} · ${genderById.get(row.original.gender_id) ?? '—'}`,
    },
    { id: 'periodo', header: 'Período', cell: ({ row }) => formatMonthYear(row.original.mes, row.original.anio) },
    { accessorKey: 'cantidad_casos', header: 'Casos', cell: ({ row }) => formatNumber(row.original.cantidad_casos) },
    { accessorKey: 'origen', header: 'Origen', cell: ({ row }) => <OrigenBadge origen={row.original.origen} /> },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" title="Aprobar" onClick={() => onApprove(row.original)}>
            <CircleCheck className="size-4 text-secondary" aria-hidden="true" />
            <span className="sr-only">Aprobar</span>
          </Button>
          <Button variant="ghost" size="icon-sm" title="Solicitar corrección" onClick={() => onRequestCorrection(row.original)}>
            <MessageSquareWarning className="size-4 text-risk-high" aria-hidden="true" />
            <span className="sr-only">Solicitar corrección</span>
          </Button>
          <Button variant="ghost" size="icon-sm" title="Rechazar" onClick={() => onReject(row.original)}>
            <XCircle className="size-4 text-destructive" aria-hidden="true" />
            <span className="sr-only">Rechazar</span>
          </Button>
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} data={records} />
}
