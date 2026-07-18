import { zodResolver } from '@hookform/resolvers/zod'
import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { z } from 'zod'
import { DataTable } from '@/components/shared/data-table/DataTable'
import { toastError, toastSuccess } from '@/components/shared/feedback/ToastHelpers'
import { QueryStateBoundary } from '@/components/shared/states/QueryStateBoundary'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useConfirm } from '@/hooks/useConfirm'
import { formatNumber } from '@/lib/formatters/number'
import type { CommunePopulation } from '@/types/database.types'
import { useForm } from 'react-hook-form'
import {
  useCommunePopulation,
  useCreateCommunePopulation,
  useDeleteCommunePopulation,
  useUpdateCommunePopulation,
} from '../hooks/usePopulation'
import { communePopulationSchema, type CommunePopulationFormValues } from '../schemas/communePopulation.schema'
import { EstadoValidacionSelect, estadoValidacionLabel } from './EstadoValidacionSelect'

type FormInput = z.input<typeof communePopulationSchema>

function CommunePopulationForm({
  row,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  row?: CommunePopulation
  onSubmit: (values: CommunePopulationFormValues) => Promise<void> | void
  onCancel: () => void
  isSubmitting?: boolean
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInput, unknown, CommunePopulationFormValues>({
    resolver: zodResolver(communePopulationSchema),
    defaultValues: row
      ? { anio: row.anio, poblacion: row.poblacion, fuente: row.fuente, estado_validacion: row.estado_validacion }
      : { estado_validacion: 'validado' },
  })
  const estado = watch('estado_validacion')

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} noValidate className="flex flex-col gap-3.5">
      <div className="grid grid-cols-2 gap-3.5">
        <Field data-invalid={!!errors.anio}>
          <FieldLabel htmlFor="cp_anio">Año</FieldLabel>
          <Input id="cp_anio" type="number" aria-invalid={!!errors.anio} {...register('anio')} />
          <FieldError errors={errors.anio ? [errors.anio] : undefined} />
        </Field>
        <Field data-invalid={!!errors.poblacion}>
          <FieldLabel htmlFor="cp_poblacion">Población total</FieldLabel>
          <Input id="cp_poblacion" type="number" aria-invalid={!!errors.poblacion} {...register('poblacion')} />
          <FieldError errors={errors.poblacion ? [errors.poblacion] : undefined} />
        </Field>
      </div>
      <Field data-invalid={!!errors.fuente}>
        <FieldLabel htmlFor="cp_fuente">Fuente</FieldLabel>
        <Input id="cp_fuente" aria-invalid={!!errors.fuente} {...register('fuente')} />
        <FieldError errors={errors.fuente ? [errors.fuente] : undefined} />
      </Field>
      <Field>
        <FieldLabel htmlFor="cp_estado">Estado de validación</FieldLabel>
        <EstadoValidacionSelect id="cp_estado" value={estado} onChange={(v) => setValue('estado_validacion', v)} />
      </Field>
      <div className="flex justify-end gap-2 border-t border-border pt-3.5">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : row ? 'Guardar cambios' : 'Crear'}
        </Button>
      </div>
    </form>
  )
}

export function CommunePopulationTab({ canManage }: { canManage: boolean }) {
  const query = useCommunePopulation()
  const createMutation = useCreateCommunePopulation()
  const updateMutation = useUpdateCommunePopulation()
  const deleteMutation = useDeleteCommunePopulation()
  const confirm = useConfirm()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<CommunePopulation | undefined>(undefined)

  const columns: ColumnDef<CommunePopulation>[] = [
    { accessorKey: 'anio', header: 'Año' },
    { accessorKey: 'poblacion', header: 'Población', cell: ({ row }) => formatNumber(row.original.poblacion) },
    { accessorKey: 'fuente', header: 'Fuente' },
    { accessorKey: 'estado_validacion', header: 'Estado', cell: ({ row }) => estadoValidacionLabel(row.original.estado_validacion) },
    ...(canManage
      ? [
          {
            id: 'actions',
            header: '',
            cell: ({ row }: { row: { original: CommunePopulation } }) => (
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setEditing(row.original)
                    setDialogOpen(true)
                  }}
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">Editar</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={async () => {
                    const confirmed = await confirm({
                      title: `¿Eliminar población de ${row.original.anio}?`,
                      variant: 'destructive',
                      confirmLabel: 'Eliminar',
                    })
                    if (!confirmed) return
                    try {
                      await deleteMutation.mutateAsync(row.original.id)
                      toastSuccess('Registro eliminado')
                    } catch (error) {
                      toastError('No se pudo eliminar', error instanceof Error ? error.message : undefined)
                    }
                  }}
                >
                  <Trash2 className="size-3.5 text-destructive" aria-hidden="true" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </div>
            ),
          } satisfies ColumnDef<CommunePopulation>,
        ]
      : []),
  ]

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
            Nuevo año
          </Button>
        </div>
      ) : null}

      <QueryStateBoundary query={query} emptyTitle="Todavía no hay población comunal registrada">
        {(rows) => <DataTable columns={columns} data={[...rows].sort((a, b) => b.anio - a.anio)} />}
      </QueryStateBoundary>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar población comunal' : 'Nueva población comunal'}</DialogTitle>
          </DialogHeader>
          <CommunePopulationForm
            row={editing}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
            onCancel={() => setDialogOpen(false)}
            onSubmit={async (values) => {
              try {
                if (editing) {
                  await updateMutation.mutateAsync({ id: editing.id, input: values })
                  toastSuccess('Población actualizada')
                } else {
                  await createMutation.mutateAsync(values)
                  toastSuccess('Población creada')
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
