import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/shared/data-table/DataTable'
import { Button } from '@/components/ui/button'
import type { Clinic, Sector } from '@/types/database.types'

interface ClinicRow extends Clinic {
  sectorNombre: string
}

interface ClinicTableProps {
  clinics: Clinic[]
  sectors: Sector[]
  canManage: boolean
  onEdit: (clinic: Clinic) => void
  onDelete: (clinic: Clinic) => void
}

export function ClinicTable({ clinics, sectors, canManage, onEdit, onDelete }: ClinicTableProps) {
  const sectorById = new Map(sectors.map((s) => [s.id, s.nombre]))
  const rows: ClinicRow[] = clinics.map((clinic) => ({ ...clinic, sectorNombre: sectorById.get(clinic.sector_id) ?? '—' }))

  const columns: ColumnDef<ClinicRow>[] = [
    {
      accessorKey: 'nombre',
      header: 'Clínica',
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-foreground">{row.original.nombre_corto}</div>
          <div className="text-xs text-muted-foreground">{row.original.nombre}</div>
        </div>
      ),
    },
    { accessorKey: 'sectorNombre', header: 'Sector' },
    { accessorKey: 'responsable', header: 'Responsable' },
    { accessorKey: 'correo', header: 'Correo' },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => (
        <span
          className={
            row.original.estado === 'activo'
              ? 'text-xs font-semibold text-secondary'
              : 'text-xs font-semibold text-muted-foreground'
          }
        >
          {row.original.estado === 'activo' ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    ...(canManage
      ? [
          {
            id: 'actions',
            header: '',
            cell: ({ row }: { row: { original: ClinicRow } }) => (
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => onEdit(row.original)}>
                  <Pencil className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">Editar {row.original.nombre_corto}</span>
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => onDelete(row.original)}>
                  <Trash2 className="size-3.5 text-destructive" aria-hidden="true" />
                  <span className="sr-only">Eliminar {row.original.nombre_corto}</span>
                </Button>
              </div>
            ),
          } satisfies ColumnDef<ClinicRow>,
        ]
      : []),
  ]

  return <DataTable columns={columns} data={rows} />
}
