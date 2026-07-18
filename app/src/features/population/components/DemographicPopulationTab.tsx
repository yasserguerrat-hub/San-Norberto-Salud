import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { DataTable } from '@/components/shared/data-table/DataTable'
import { toastError, toastSuccess } from '@/components/shared/feedback/ToastHelpers'
import { QueryStateBoundary } from '@/components/shared/states/QueryStateBoundary'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ageRangesRepository } from '@/data/repositories/ageRanges.repository'
import { genderCategoriesRepository } from '@/data/repositories/genderCategories.repository'
import { sectorsRepository } from '@/data/repositories/sectors.repository'
import { useConfirm } from '@/hooks/useConfirm'
import { formatNumber } from '@/lib/formatters/number'
import { queryKeys } from '@/lib/query/queryKeys'
import type { DemographicPopulation } from '@/types/database.types'
import { useDemographicPopulation, useUpdateDemographicPopulation } from '../hooks/usePopulation'
import { demographicPopulationEditSchema, type DemographicPopulationEditValues } from '../schemas/demographicPopulation.schema'

type FormInput = z.input<typeof demographicPopulationEditSchema>

export function DemographicPopulationTab({ canManage }: { canManage: boolean }) {
  const [anio] = useState('2026')
  const sectorsQuery = useQuery({ queryKey: queryKeys.sectors.list(), queryFn: () => sectorsRepository.list() })
  const ageRangesQuery = useQuery({ queryKey: queryKeys.ageRanges.list(), queryFn: () => ageRangesRepository.list() })
  const gendersQuery = useQuery({ queryKey: queryKeys.genderCategories.list(), queryFn: () => genderCategoriesRepository.list() })
  const [sectorId, setSectorId] = useState<string>('')

  const effectiveSectorId = sectorId || sectorsQuery.data?.[0]?.id || ''
  const query = useDemographicPopulation({ sectorId: effectiveSectorId || undefined, anio: Number(anio) })

  const [editing, setEditing] = useState<DemographicPopulation | undefined>(undefined)
  const [dialogOpen, setDialogOpen] = useState(false)
  const updateMutation = useUpdateDemographicPopulation()
  const confirm = useConfirm()

  const ageById = new Map((ageRangesQuery.data ?? []).map((a) => [a.id, a.nombre]))
  const genderById = new Map((gendersQuery.data ?? []).map((g) => [g.id, g.nombre]))

  const columns: ColumnDef<DemographicPopulation>[] = [
    { accessorKey: 'age_range_id', header: 'Rango de edad', cell: ({ row }) => ageById.get(row.original.age_range_id) ?? '—' },
    { accessorKey: 'gender_id', header: 'Género', cell: ({ row }) => genderById.get(row.original.gender_id) ?? '—' },
    { accessorKey: 'poblacion', header: 'Población', cell: ({ row }) => formatNumber(row.original.poblacion) },
    ...(canManage
      ? [
          {
            id: 'actions',
            header: '',
            cell: ({ row }: { row: { original: DemographicPopulation } }) => (
              <div className="flex justify-end">
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
              </div>
            ),
          } satisfies ColumnDef<DemographicPopulation>,
        ]
      : []),
  ]

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, DemographicPopulationEditValues>({
    resolver: zodResolver(demographicPopulationEditSchema),
    values: editing ? { poblacion: editing.poblacion } : undefined,
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Select value={effectiveSectorId} onValueChange={setSectorId}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Selecciona un sector" />
          </SelectTrigger>
          <SelectContent>
            {(sectorsQuery.data ?? []).map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">Año {anio} · población base para el cálculo de tasas</span>
      </div>

      <QueryStateBoundary query={query} emptyTitle="Sin datos demográficos para este sector">
        {(rows) => <DataTable columns={columns} data={rows} pageSize={rows.length || 1} />}
      </QueryStateBoundary>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) reset()
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Editar población</DialogTitle>
          </DialogHeader>
          <form
            noValidate
            onSubmit={handleSubmit(async (values) => {
              if (!editing) return
              const confirmed = await confirm({
                title: '¿Actualizar esta población?',
                description: 'Este valor se usa como denominador para calcular tasas por 100.000 habitantes.',
              })
              if (!confirmed) return
              try {
                await updateMutation.mutateAsync({ id: editing.id, input: values })
                toastSuccess('Población actualizada')
                setDialogOpen(false)
              } catch (error) {
                toastError('No se pudo guardar', error instanceof Error ? error.message : undefined)
              }
            })}
            className="flex flex-col gap-3.5"
          >
            <Field data-invalid={!!errors.poblacion}>
              <FieldLabel htmlFor="dp_poblacion">Población</FieldLabel>
              <Input id="dp_poblacion" type="number" aria-invalid={!!errors.poblacion} {...register('poblacion')} />
              <FieldError errors={errors.poblacion ? [errors.poblacion] : undefined} />
            </Field>
            <div className="flex justify-end gap-2 border-t border-border pt-3.5">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Guardando…' : 'Guardar cambios'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
