import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/shared/data-table/DataTable'
import { Button } from '@/components/ui/button'
import type { Clinic, Profile } from '@/types/database.types'

const ROLE_LABELS: Record<Profile['rol'], string> = {
  admin_general: 'Administrador general',
  usuario_clinica: 'Usuario de clínica',
}

interface UserTableProps {
  users: Profile[]
  clinics: Clinic[]
  onEdit: (user: Profile) => void
  onDelete: (user: Profile) => void
}

export function UserTable({ users, clinics, onEdit, onDelete }: UserTableProps) {
  const clinicById = new Map(clinics.map((c) => [c.id, c.nombre_corto]))

  const columns: ColumnDef<Profile>[] = [
    {
      id: 'nombre',
      header: 'Usuario',
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-foreground">
            {row.original.nombre} {row.original.apellido}
          </div>
          <div className="text-xs text-muted-foreground">{row.original.correo}</div>
        </div>
      ),
    },
    { accessorKey: 'rol', header: 'Rol', cell: ({ row }) => ROLE_LABELS[row.original.rol] },
    {
      id: 'clinica',
      header: 'Clínica',
      cell: ({ row }) => (row.original.clinic_id ? (clinicById.get(row.original.clinic_id) ?? '—') : 'Todas'),
    },
    {
      accessorKey: 'puede_ver_comparaciones',
      header: 'Comparaciones',
      cell: ({ row }) => (row.original.puede_ver_comparaciones ? 'Sí' : 'No'),
    },
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
            <span className="sr-only">Editar usuario</span>
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(row.original)}>
            <Trash2 className="size-3.5 text-destructive" aria-hidden="true" />
            <span className="sr-only">Eliminar usuario</span>
          </Button>
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} data={users} />
}
