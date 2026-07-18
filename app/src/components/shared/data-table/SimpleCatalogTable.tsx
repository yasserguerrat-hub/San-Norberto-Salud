import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from './DataTable'

interface CatalogRow {
  id: string
  estado: 'activo' | 'inactivo'
}

interface SimpleCatalogTableProps<T extends CatalogRow> {
  data: T[]
  extraColumns: ColumnDef<T>[]
  itemLabel: (item: T) => string
  onEdit: (item: T) => void
  onDelete: (item: T) => void
}

/** Tabla compacta reutilizada por catálogos pequeños (rangos de edad, género): nombre-like
 * columnas propias del caller + Estado + acciones, siempre con el mismo patrón de edición. */
export function SimpleCatalogTable<T extends CatalogRow>({
  data,
  extraColumns,
  itemLabel,
  onEdit,
  onDelete,
}: SimpleCatalogTableProps<T>) {
  const columns: ColumnDef<T>[] = [
    ...extraColumns,
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
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(row.original)}>
            <Pencil className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Editar {itemLabel(row.original)}</span>
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(row.original)}>
            <Trash2 className="size-3.5 text-destructive" aria-hidden="true" />
            <span className="sr-only">Eliminar {itemLabel(row.original)}</span>
          </Button>
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} data={data} />
}
