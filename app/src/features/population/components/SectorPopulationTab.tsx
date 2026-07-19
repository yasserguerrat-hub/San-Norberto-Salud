import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { DataTable } from '@/components/shared/data-table/DataTable'
import { DataTableToolbar } from '@/components/shared/data-table/DataTableToolbar'
import { toastError, toastSuccess } from '@/components/shared/feedback/ToastHelpers'
import { QueryStateBoundary } from '@/components/shared/states/QueryStateBoundary'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { sectorsRepository } from '@/data/repositories/sectors.repository'
import { useConfirm } from '@/hooks/useConfirm'
import { formatNumber } from '@/lib/formatters/number'
import { queryKeys } from '@/lib/query/queryKeys'
import type { SectorPopulation } from '@/types/database.types'
import {
  useCreateSectorPopulation,
  useDeleteSectorPopulation,
  useSectorPopulation,
  useUpdateSectorPopulation,
} from '../hooks/usePopulation'
import { sectorPopulationSchema, type SectorPopulationFormValues } from '../schemas/sectorPopulation.schema'
import { EstadoValidacionSelect, estadoValidacionLabel } from './EstadoValidacionSelect'

type FormInput = z.input<typeof sectorPopulationSchema>

function SectorPopulationForm({
  row,
  sectorOptions,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  row?: SectorPopulation
  sectorOptions: { value: string; label: string }[]
  onSubmit: (values: SectorPopulationFormValues) => Promise<void> | void
  onCancel: () => void
  isSubmitting?: boolean
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInput, unknown, SectorPopulationFormValues>({
    resolver: zodResolver(sectorPopulationSchema),
    defaultValues: row
      ? { sector_id: row.sector_id, anio: row.anio, poblacion: row.poblacion, fuente: row.fuente, estado_validacion: row.estado_validacion }
      : { estado_validacion: 'validado' },
  })
  const estado = watch('estado_validacion')
  const sectorId = watch('sector_id')

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} noValidate className="flex flex-col gap-3.5">
      <Field data-invalid={!!errors.sector_id}>
        <FieldLabel htmlFor="sp_sector">Sector</FieldLabel>
        <Select value={sectorId} onValueChange={(v) => setValue('sector_id', v, { shouldValidate: true })}>
          <SelectTrigger id="sp_sector" className="w-full">
            <SelectValue placeholder="Selecciona un sector" />
          </SelectTrigger>
          <SelectContent>
            {sectorOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError errors={errors.sector_id ? [errors.sector_id] : undefined} />
      </Field>
      <div className="grid grid-cols-2 gap-3.5">
        <Field data-invalid={!!errors.anio}>
          <FieldLabel htmlFor="sp_anio">Año</FieldLabel>
          <Input id="sp_anio" type="number" aria-invalid={!!errors.anio} {...register('anio')} />
          <FieldError errors={errors.anio ? [errors.anio] : undefined} />
        </Field>
        <Field data-invalid={!!errors.poblacion}>
          <FieldLabel htmlFor="sp_poblacion">Población</FieldLabel>
          <Input id="sp_poblacion" type="number" aria-invalid={!!errors.poblacion} {...register('poblacion')} />
          <FieldError errors={errors.poblacion ? [errors.poblacion] : undefined} />
        </Field>
      </div>
      <Field data-invalid={!!errors.fuente}>
        <FieldLabel htmlFor="sp_fuente">Fuente</FieldLabel>
        <Input id="sp_fuente" aria-invalid={!!errors.fuente} {...register('fuente')} />
        <FieldError errors={errors.fuente ? [errors.fuente] : undefined} />
      </Field>
      <Field>
        <FieldLabel htmlFor="sp_estado">Estado de validación</FieldLabel>
        <EstadoValidacionSelect id="sp_estado" value={estado} onChange={(v) => setValue('estado_validacion', v)} />
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

export function SectorPopulationTab({ canManage }: { canManage: boolean }) {
  const [anio, setAnio] = useState('2026')
  const query = useSectorPopulation({ anio: Number(anio) })
  const sectorsQuery = useQuery({ queryKey: queryKeys.sectors.list(), queryFn: () => sectorsRepository.list() })
  const createMutation = useCreateSectorPopulation()
  const updateMutation = useUpdateSectorPopulation()
  const deleteMutation = useDeleteSectorPopulation()
  const confirm = useConfirm()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<SectorPopulation | undefined>(undefined)
  const [search, setSearch] = useState('')

  const sectorById = new Map((sectorsQuery.data ?? []).map((s) => [s.id, s.nombre]))
  const sectorOptions = (sectorsQuery.data ?? []).map((s) => ({ value: s.id, label: s.nombre }))

  const columns: ColumnDef<SectorPopulation>[] = [
    { accessorKey: 'sector_id', header: 'Sector', cell: ({ row }) => sectorById.get(row.original.sector_id) ?? '—' },
    { accessorKey: 'poblacion', header: 'Población', cell: ({ row }) => formatNumber(row.original.poblacion) },
    { accessorKey: 'fuente', header: 'Fuente' },
    { accessorKey: 'estado_validacion', header: 'Estado', cell: ({ row }) => estadoValidacionLabel(row.original.estado_validacion) },
    ...(canManage
      ? [
          {
            id: 'actions',
            header: '',
            cell: ({ row }: { row: { original: SectorPopulation } }) => (
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
                      title: '¿Eliminar este registro de población?',
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
          } satisfies ColumnDef<SectorPopulation>,
        ]
      : []),
  ]

  const normalizedSearch = search.trim().toLowerCase()
  const filterRows = (rows: SectorPopulation[]) =>
    normalizedSearch
      ? rows.filter((r) =>
          [sectorById.get(r.sector_id) ?? '', r.fuente, estadoValidacionLabel(r.estado_validacion)].some((v) =>
            v.toLowerCase().includes(normalizedSearch),
          ),
        )
      : rows

  return (
    <div className="flex flex-col gap-3">
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por sector o fuente…"
        filters={
          <Select value={anio} onValueChange={setAnio}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        }
        actions={
          canManage ? (
            <Button
              size="sm"
              onClick={() => {
                setEditing(undefined)
                setDialogOpen(true)
              }}
            >
              <Plus className="size-3.5" aria-hidden="true" />
              Nuevo registro
            </Button>
          ) : undefined
        }
      />

      <QueryStateBoundary
        query={query}
        emptyTitle="Sin población registrada para este año"
        hasActiveFilters={normalizedSearch !== ''}
        isEmpty={(rows) => filterRows(rows).length === 0}
        onClearFilters={() => setSearch('')}
      >
        {(rows) => <DataTable columns={columns} data={filterRows(rows)} />}
      </QueryStateBoundary>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar población de sector' : 'Nueva población de sector'}</DialogTitle>
          </DialogHeader>
          <SectorPopulationForm
            row={editing}
            sectorOptions={sectorOptions}
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
