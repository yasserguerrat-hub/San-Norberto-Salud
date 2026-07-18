import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { DemoDataBadge } from '@/components/shared/badges/DemoDataBadge'
import { DataTableToolbar } from '@/components/shared/data-table/DataTableToolbar'
import { toastError, toastSuccess } from '@/components/shared/feedback/ToastHelpers'
import { QueryStateBoundary } from '@/components/shared/states/QueryStateBoundary'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { healthRecordsRepository } from '@/data/repositories/healthRecords.repository'
import { sectorsRepository } from '@/data/repositories/sectors.repository'
import { useCurrentProfile } from '@/features/auth/store/session.store'
import { useConfirm } from '@/hooks/useConfirm'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { queryKeys } from '@/lib/query/queryKeys'
import type { Clinic } from '@/types/database.types'
import { ClinicForm } from '../components/ClinicForm'
import { ClinicTable } from '../components/ClinicTable'
import { useClinics, useCreateClinic, useDeleteClinic, useUpdateClinic } from '../hooks/useClinics'
import type { ClinicFormValues } from '../schemas/clinic.schema'

export function ClinicsListPage() {
  const profile = useCurrentProfile()
  const canManage = profile?.rol === 'admin_general'

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 250)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingClinic, setEditingClinic] = useState<Clinic | undefined>(undefined)

  const clinicsQuery = useClinics({ search: debouncedSearch || undefined })
  const sectorsQuery = useQuery({ queryKey: queryKeys.sectors.list(), queryFn: () => sectorsRepository.list() })

  const createClinic = useCreateClinic()
  const updateClinic = useUpdateClinic()
  const deleteClinic = useDeleteClinic()
  const confirm = useConfirm()

  const openCreate = () => {
    setEditingClinic(undefined)
    setDialogOpen(true)
  }
  const openEdit = (clinic: Clinic) => {
    setEditingClinic(clinic)
    setDialogOpen(true)
  }

  const handleSubmit = async (values: ClinicFormValues) => {
    try {
      if (editingClinic) {
        await updateClinic.mutateAsync({ id: editingClinic.id, input: values })
        toastSuccess('Clínica actualizada')
      } else {
        const confirmed = await confirm({
          title: '¿Crear esta clínica?',
          description: `Se creará "${values.nombre_corto}" y quedará disponible de inmediato para registrar casos.`,
          confirmLabel: 'Crear clínica',
        })
        if (!confirmed) return
        await createClinic.mutateAsync(values)
        toastSuccess('Clínica creada')
      }
      setDialogOpen(false)
    } catch (error) {
      toastError('No se pudo guardar la clínica', error instanceof Error ? error.message : undefined)
    }
  }

  const handleDelete = async (clinic: Clinic) => {
    const dependientes = await healthRecordsRepository.list({ clinicId: clinic.id })
    if (dependientes.length > 0) {
      toastError(
        'No se puede eliminar esta clínica',
        `Tiene ${dependientes.length} registro(s) estadístico(s) asociados. Desactívala en vez de eliminarla.`,
      )
      return
    }

    const confirmed = await confirm({
      title: `¿Eliminar "${clinic.nombre_corto}"?`,
      description: 'Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      variant: 'destructive',
    })
    if (!confirmed) return

    try {
      await deleteClinic.mutateAsync(clinic.id)
      toastSuccess('Clínica eliminada')
    } catch (error) {
      toastError('No se pudo eliminar la clínica', error instanceof Error ? error.message : undefined)
    }
  }

  const sectorOptions = (sectorsQuery.data ?? []).map((s) => ({ value: s.id, label: s.nombre }))

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <DataTableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar clínica…"
          actions={
            canManage ? (
              <Button size="sm" onClick={openCreate}>
                <Plus className="size-3.5" aria-hidden="true" />
                Nueva clínica
              </Button>
            ) : undefined
          }
        />
        <DemoDataBadge className="ml-2" />
      </div>

      <QueryStateBoundary
        query={clinicsQuery}
        hasActiveFilters={!!debouncedSearch}
        onClearFilters={() => setSearch('')}
        emptyTitle="Todavía no hay clínicas registradas"
        emptyDescription={canManage ? 'Crea la primera clínica para comenzar a registrar casos.' : undefined}
      >
        {(clinics) => (
          <ClinicTable
            clinics={clinics}
            sectors={sectorsQuery.data ?? []}
            canManage={canManage}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </QueryStateBoundary>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingClinic ? 'Editar clínica' : 'Nueva clínica'}</DialogTitle>
          </DialogHeader>
          <ClinicForm
            clinic={editingClinic}
            sectorOptions={sectorOptions}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            isSubmitting={createClinic.isPending || updateClinic.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
