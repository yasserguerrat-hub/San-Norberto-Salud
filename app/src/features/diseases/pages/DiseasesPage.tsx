import { Plus } from 'lucide-react'
import { useState } from 'react'
import { DemoDataBadge } from '@/components/shared/badges/DemoDataBadge'
import { SimpleCatalogTable } from '@/components/shared/data-table/SimpleCatalogTable'
import { toastError, toastSuccess } from '@/components/shared/feedback/ToastHelpers'
import { QueryStateBoundary } from '@/components/shared/states/QueryStateBoundary'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCurrentProfile } from '@/features/auth/store/session.store'
import { useConfirm } from '@/hooks/useConfirm'
import type { AgeRange, Disease, GenderCategory } from '@/types/database.types'
import { AgeRangeForm } from '../components/AgeRangeForm'
import { DiseaseForm } from '../components/DiseaseForm'
import { DiseaseTable } from '../components/DiseaseTable'
import { GenderCategoryForm } from '../components/GenderCategoryForm'
import { useAgeRanges, useCreateAgeRange, useDeleteAgeRange, useUpdateAgeRange } from '../hooks/useAgeRanges'
import { useCreateDisease, useDeleteDisease, useDiseases, useUpdateDisease } from '../hooks/useDiseases'
import {
  useCreateGenderCategory,
  useDeleteGenderCategory,
  useGenderCategories,
  useUpdateGenderCategory,
} from '../hooks/useGenderCategories'
import { findAgeRangeOverlap } from '../lib/validateAgeRangeOverlap'
import { DISEASE_TYPE_LABELS } from '../schemas/disease.schema'

function DiseasesTab({ canManage }: { canManage: boolean }) {
  const diseasesQuery = useDiseases()
  const createDisease = useCreateDisease()
  const updateDisease = useUpdateDisease()
  const deleteDisease = useDeleteDisease()
  const confirm = useConfirm()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Disease | undefined>(undefined)

  return (
    <div className="flex flex-col gap-3">
      {canManage ? (
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={() => {
              setEditing(undefined)
              setDialogOpen(true)
            }}
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Nueva enfermedad
          </Button>
        </div>
      ) : null}

      <QueryStateBoundary query={diseasesQuery} emptyTitle="Todavía no hay enfermedades registradas">
        {(diseases) => (
          <DiseaseTable
            diseases={diseases}
            onEdit={(d) => {
              setEditing(d)
              setDialogOpen(true)
            }}
            onDelete={async (d) => {
              const confirmed = await confirm({
                title: `¿Eliminar "${d.nombre}"?`,
                description: 'Los registros existentes que la referencien no se eliminarán, pero no podrás usarla en nuevos registros.',
                confirmLabel: 'Eliminar',
                variant: 'destructive',
              })
              if (!confirmed) return
              try {
                await deleteDisease.mutateAsync(d.id)
                toastSuccess('Enfermedad eliminada')
              } catch (error) {
                toastError('No se pudo eliminar', error instanceof Error ? error.message : undefined)
              }
            }}
          />
        )}
      </QueryStateBoundary>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar enfermedad' : 'Nueva enfermedad o padecimiento'}</DialogTitle>
          </DialogHeader>
          <DiseaseForm
            disease={editing}
            isSubmitting={createDisease.isPending || updateDisease.isPending}
            onCancel={() => setDialogOpen(false)}
            onSubmit={async (values) => {
              try {
                if (editing) {
                  await updateDisease.mutateAsync({ id: editing.id, input: values })
                  toastSuccess('Enfermedad actualizada')
                } else {
                  await createDisease.mutateAsync(values)
                  toastSuccess('Enfermedad creada')
                }
                setDialogOpen(false)
              } catch (error) {
                toastError('No se pudo guardar', error instanceof Error ? error.message : undefined)
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AgeRangesTab({ canManage }: { canManage: boolean }) {
  const ageRangesQuery = useAgeRanges()
  const createAgeRange = useCreateAgeRange()
  const updateAgeRange = useUpdateAgeRange()
  const deleteAgeRange = useDeleteAgeRange()
  const confirm = useConfirm()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AgeRange | undefined>(undefined)

  return (
    <div className="flex flex-col gap-3">
      {canManage ? (
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={() => {
              setEditing(undefined)
              setDialogOpen(true)
            }}
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Nuevo rango
          </Button>
        </div>
      ) : null}

      <QueryStateBoundary query={ageRangesQuery} emptyTitle="Todavía no hay rangos de edad">
        {(ageRanges) => (
          <SimpleCatalogTable
            data={ageRanges}
            itemLabel={(item) => item.nombre}
            extraColumns={[
              { accessorKey: 'nombre', header: 'Rango' },
              {
                id: 'rango',
                header: 'Edades',
                cell: ({ row }) => `${row.original.edad_min} – ${row.original.edad_max ?? '+'}`,
              },
              { accessorKey: 'orden', header: 'Orden' },
            ]}
            onEdit={(item) => {
              setEditing(item)
              setDialogOpen(true)
            }}
            onDelete={async (item) => {
              const confirmed = await confirm({
                title: `¿Eliminar "${item.nombre}"?`,
                confirmLabel: 'Eliminar',
                variant: 'destructive',
              })
              if (!confirmed) return
              try {
                await deleteAgeRange.mutateAsync(item.id)
                toastSuccess('Rango eliminado')
              } catch (error) {
                toastError('No se pudo eliminar', error instanceof Error ? error.message : undefined)
              }
            }}
          />
        )}
      </QueryStateBoundary>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar rango de edad' : 'Nuevo rango de edad'}</DialogTitle>
          </DialogHeader>
          <AgeRangeForm
            ageRange={editing}
            isSubmitting={createAgeRange.isPending || updateAgeRange.isPending}
            onCancel={() => setDialogOpen(false)}
            onSubmit={async (values) => {
              const overlap = findAgeRangeOverlap({ id: editing?.id, edad_min: values.edad_min, edad_max: values.edad_max }, ageRangesQuery.data ?? [])
              if (overlap) {
                toastError('Los rangos de edad se superponen', `Se superpone con "${overlap.nombre}" (${overlap.edad_min}–${overlap.edad_max ?? '+'}).`)
                return
              }
              try {
                if (editing) {
                  await updateAgeRange.mutateAsync({ id: editing.id, input: values })
                  toastSuccess('Rango actualizado')
                } else {
                  await createAgeRange.mutateAsync(values)
                  toastSuccess('Rango creado')
                }
                setDialogOpen(false)
              } catch (error) {
                toastError('No se pudo guardar', error instanceof Error ? error.message : undefined)
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function GenderCategoriesTab({ canManage }: { canManage: boolean }) {
  const gendersQuery = useGenderCategories()
  const createGender = useCreateGenderCategory()
  const updateGender = useUpdateGenderCategory()
  const deleteGender = useDeleteGenderCategory()
  const confirm = useConfirm()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<GenderCategory | undefined>(undefined)

  return (
    <div className="flex flex-col gap-3">
      {canManage ? (
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={() => {
              setEditing(undefined)
              setDialogOpen(true)
            }}
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Nueva categoría
          </Button>
        </div>
      ) : null}

      <QueryStateBoundary query={gendersQuery} emptyTitle="Todavía no hay categorías de género">
        {(genders) => (
          <SimpleCatalogTable
            data={genders}
            itemLabel={(item) => item.nombre}
            extraColumns={[
              { accessorKey: 'nombre', header: 'Categoría' },
              { accessorKey: 'orden', header: 'Orden' },
            ]}
            onEdit={(item) => {
              setEditing(item)
              setDialogOpen(true)
            }}
            onDelete={async (item) => {
              const confirmed = await confirm({
                title: `¿Eliminar "${item.nombre}"?`,
                confirmLabel: 'Eliminar',
                variant: 'destructive',
              })
              if (!confirmed) return
              try {
                await deleteGender.mutateAsync(item.id)
                toastSuccess('Categoría eliminada')
              } catch (error) {
                toastError('No se pudo eliminar', error instanceof Error ? error.message : undefined)
              }
            }}
          />
        )}
      </QueryStateBoundary>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar categoría' : 'Nueva categoría de género'}</DialogTitle>
          </DialogHeader>
          <GenderCategoryForm
            genderCategory={editing}
            isSubmitting={createGender.isPending || updateGender.isPending}
            onCancel={() => setDialogOpen(false)}
            onSubmit={async (values) => {
              try {
                if (editing) {
                  await updateGender.mutateAsync({ id: editing.id, input: values })
                  toastSuccess('Categoría actualizada')
                } else {
                  await createGender.mutateAsync(values)
                  toastSuccess('Categoría creada')
                }
                setDialogOpen(false)
              } catch (error) {
                toastError('No se pudo guardar', error instanceof Error ? error.message : undefined)
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function DiseasesPage() {
  const profile = useCurrentProfile()
  const canManage = profile?.rol === 'admin_general'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Catálogos base para el registro de casos: {Object.values(DISEASE_TYPE_LABELS).join(', ').toLowerCase()}.
        </p>
        <DemoDataBadge />
      </div>

      <Tabs defaultValue="enfermedades">
        <TabsList>
          <TabsTrigger value="enfermedades">Enfermedades y padecimientos</TabsTrigger>
          <TabsTrigger value="edad">Rangos de edad</TabsTrigger>
          <TabsTrigger value="genero">Género</TabsTrigger>
        </TabsList>
        <TabsContent value="enfermedades">
          <DiseasesTab canManage={canManage} />
        </TabsContent>
        <TabsContent value="edad">
          <AgeRangesTab canManage={canManage} />
        </TabsContent>
        <TabsContent value="genero">
          <GenderCategoriesTab canManage={canManage} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
