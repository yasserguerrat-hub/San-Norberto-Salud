import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { OrigenBadge, StatusBadge } from '@/components/shared/badges/StatusBadge'
import { DataTable } from '@/components/shared/data-table/DataTable'
import { Button } from '@/components/ui/button'
import { formatMonthYear } from '@/lib/formatters/date'
import { formatNumber } from '@/lib/formatters/number'
import type { AgeRange, Clinic, Disease, GenderCategory, HealthRecord, Sector } from '@/types/database.types'

interface RecordsTableProps {
  records: HealthRecord[]
  diseases: Disease[]
  ageRanges: AgeRange[]
  genders: GenderCategory[]
  sectors: Sector[]
  clinics: Clinic[]
  canEdit: (record: HealthRecord) => boolean
  onEdit: (record: HealthRecord) => void
  onDelete: (record: HealthRecord) => void
}

export function RecordsTable({ records, diseases, ageRanges, genders, sectors, clinics, canEdit, onEdit, onDelete }: RecordsTableProps) {
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
    { accessorKey: 'age_range_id', header: 'Edad', cell: ({ row }) => ageById.get(row.original.age_range_id) ?? '—' },
    { accessorKey: 'gender_id', header: 'Género', cell: ({ row }) => genderById.get(row.original.gender_id) ?? '—' },
    { id: 'periodo', header: 'Período', cell: ({ row }) => formatMonthYear(row.original.mes, row.original.anio) },
    { accessorKey: 'cantidad_casos', header: 'Casos', cell: ({ row }) => formatNumber(row.original.cantidad_casos) },
    { accessorKey: 'origen', header: 'Origen', cell: ({ row }) => <OrigenBadge origen={row.original.origen} /> },
    { accessorKey: 'estado', header: 'Estado', cell: ({ row }) => <StatusBadge status={row.original.estado} /> },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) =>
        canEdit(row.original) ? (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => onEdit(row.original)}>
              <Pencil className="size-3.5" aria-hidden="true" />
              <span className="sr-only">Editar registro</span>
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => onDelete(row.original)}>
              <Trash2 className="size-3.5 text-destructive" aria-hidden="true" />
              <span className="sr-only">Eliminar registro</span>
            </Button>
          </div>
        ) : null,
    },
  ]

  return <DataTable columns={columns} data={records} />
}
