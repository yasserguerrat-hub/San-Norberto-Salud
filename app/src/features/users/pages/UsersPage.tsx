import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { DemoDataBadge } from '@/components/shared/badges/DemoDataBadge'
import { DataTableToolbar } from '@/components/shared/data-table/DataTableToolbar'
import { toastError, toastSuccess } from '@/components/shared/feedback/ToastHelpers'
import { QueryStateBoundary } from '@/components/shared/states/QueryStateBoundary'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { clinicsRepository } from '@/data/repositories/clinics.repository'
import { useCurrentProfile } from '@/features/auth/store/session.store'
import { useConfirm } from '@/hooks/useConfirm'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { queryKeys } from '@/lib/query/queryKeys'
import type { Profile } from '@/types/database.types'
import { UserForm } from '../components/UserForm'
import { UserTable } from '../components/UserTable'
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from '../hooks/useUsers'
import type { UserFormValues } from '../schemas/user.schema'

export function UsersPage() {
  const currentProfile = useCurrentProfile()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 250)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Profile | undefined>(undefined)

  const usersQuery = useUsers({ search: debouncedSearch || undefined })
  const clinicsQuery = useQuery({ queryKey: queryKeys.clinics.list(), queryFn: () => clinicsRepository.list() })

  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const confirm = useConfirm()

  const clinicOptions = (clinicsQuery.data ?? []).map((c) => ({ value: c.id, label: c.nombre_corto }))

  const handleSubmit = async (values: UserFormValues) => {
    try {
      if (editing) {
        await updateUser.mutateAsync({ id: editing.id, input: values })
        toastSuccess('Usuario actualizado')
      } else {
        const confirmed = await confirm({
          title: '¿Crear esta cuenta institucional?',
          description: `Se creará el acceso para ${values.nombre} ${values.apellido} (${values.correo}).`,
          confirmLabel: 'Crear usuario',
        })
        if (!confirmed) return
        await createUser.mutateAsync(values)
        toastSuccess('Usuario creado')
      }
      setDialogOpen(false)
    } catch (error) {
      toastError('No se pudo guardar el usuario', error instanceof Error ? error.message : undefined)
    }
  }

  const handleDelete = async (user: Profile) => {
    if (user.id === currentProfile?.id) {
      toastError('No puedes eliminar tu propia cuenta')
      return
    }
    const confirmed = await confirm({
      title: `¿Eliminar a ${user.nombre} ${user.apellido}?`,
      description: 'Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      variant: 'destructive',
    })
    if (!confirmed) return
    try {
      await deleteUser.mutateAsync(user.id)
      toastSuccess('Usuario eliminado')
    } catch (error) {
      toastError('No se pudo eliminar', error instanceof Error ? error.message : undefined)
    }
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <DataTableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar usuario…"
          actions={
            <Button
              size="sm"
              onClick={() => {
                setEditing(undefined)
                setDialogOpen(true)
              }}
            >
              <Plus className="size-3.5" aria-hidden="true" />
              Nuevo usuario
            </Button>
          }
        />
        <DemoDataBadge className="ml-2" />
      </div>

      <QueryStateBoundary
        query={usersQuery}
        hasActiveFilters={!!debouncedSearch}
        onClearFilters={() => setSearch('')}
        emptyTitle="Todavía no hay usuarios registrados"
      >
        {(users) => (
          <UserTable
            users={users}
            clinics={clinicsQuery.data ?? []}
            onEdit={(user) => {
              setEditing(user)
              setDialogOpen(true)
            }}
            onDelete={handleDelete}
          />
        )}
      </QueryStateBoundary>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar usuario' : 'Nuevo usuario'}</DialogTitle>
          </DialogHeader>
          <UserForm
            user={editing}
            clinicOptions={clinicOptions}
            isSubmitting={createUser.isPending || updateUser.isPending}
            onCancel={() => setDialogOpen(false)}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
