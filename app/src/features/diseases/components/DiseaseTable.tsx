import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/shared/data-table/DataTable'
import { Button } from '@/components/ui/button'
import type { Disease } from '@/types/database.types'
import { DISEASE_TYPE_LABELS } from '../schemas/disease.schema'

interface DiseaseTableProps {
  diseases: Disease[]
  onEdit: (disease: Disease) => void
  onDelete: (disease: Disease) => void
}

export function DiseaseTable({ diseases, onEdit, onDelete }: DiseaseTableProps) {
  const columns: ColumnDef<Disease>[] = [
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-foreground">{row.original.nombre}</div>
          {row.original.codigo_referencia ? (
            <div className="text-xs text-muted-foreground">{row.original.codigo_referencia}</div>
          ) : null}
        </div>
      ),
    },
    { accessorKey: 'tipo', header: 'Tipo', cell: ({ row }) => DISEASE_TYPE_LABELS[row.original.tipo] },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => (
        <span className={row.original.estado === 'activo' ? 'text-xs font-semibold text-secondary' : 'text-xs font-semibold text-muted-foreground'}>
          {row.original.estado === 'activo' ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(row.original)}>
            <Pencil className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Editar {row.original.nombre}</span>
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(row.original)}>
            <Trash2 className="size-3.5 text-destructive" aria-hidden="true" />
            <span className="sr-only">Eliminar {row.original.nombre}</span>
          </Button>
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} data={diseases} />
}
