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
import { genderCategoriesRepository } from '@/data/repositories/genderCategories.repository'
import { sectorsRepository } from '@/data/repositories/sectors.repository'
import { useConfirm } from '@/hooks/useConfirm'
import { formatNumber } from '@/lib/formatters/number'
import { queryKeys } from '@/lib/query/queryKeys'
import type { DemographicPopulation, GenderCategory } from '@/types/database.types'
import {
  useCreateDemographicPopulation,
  useDeleteDemographicPopulation,
  useDemographicPopulation,
  useUpdateDemographicPopulation,
} from '../hooks/usePopulation'
import {
  RANGOS_EDAD_QUINQUENALES_INE,
  demographicPopulationSchema,
  type DemographicPopulationFormValues,
} from '../schemas/demographicPopulation.schema'

const COMUNA_VALUE = '__comuna__'
const RANGO_EDAD_ORDEN = new Map(RANGOS_EDAD_QUINQUENALES_INE.map((r, i) => [r, i]))

type FormInput = z.input<typeof demographicPopulationSchema>

interface PivotRow {
  rango_edad: string
  porGenero: Record<string, DemographicPopulation | undefined>
}

function DemographicPopulationForm({
  row,
  defaultSectorId,
  defaultAnio,
  defaultRangoEdad,
  defaultGenderId,
  sectorOptions,
  genderOptions,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  row?: DemographicPopulation
  defaultSectorId: string
  defaultAnio: number
  defaultRangoEdad?: string
  defaultGenderId?: string
  sectorOptions: { value: string; label: string }[]
  genderOptions: { value: string; label: string }[]
  onSubmit: (values: DemographicPopulationFormValues) => Promise<void> | void
  onCancel: () => void
  isSubmitting?: boolean
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInput, unknown, DemographicPopulationFormValues>({
    resolver: zodResolver(demographicPopulationSchema),
    defaultValues: row
      ? {
          sector_id: row.sector_id,
          anio: row.anio,
          rango_edad: row.rango_edad,
          gender_id: row.gender_id,
          poblacion: row.poblacion,
        }
      : {
          sector_id: defaultSectorId === COMUNA_VALUE ? null : defaultSectorId,
          anio: defaultAnio,
          rango_edad: defaultRangoEdad,
          gender_id: defaultGenderId,
        },
  })

  const sectorValue = watch('sector_id') ?? COMUNA_VALUE
  const genderId = watch('gender_id')

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} noValidate className="flex flex-col gap-3.5">
      <Field>
        <FieldLabel htmlFor="dp_sector">Sector</FieldLabel>
        <Select value={sectorValue} onValueChange={(value) => setValue('sector_id', value === COMUNA_VALUE ? null : value)}>
          <SelectTrigger id="dp_sector" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={COMUNA_VALUE}>Toda la comuna</SelectItem>
            {sectorOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-3.5">
        <Field data-invalid={!!errors.anio}>
          <FieldLabel htmlFor="dp_anio">Año</FieldLabel>
          <Input id="dp_anio" type="number" aria-invalid={!!errors.anio} {...register('anio')} />
          <FieldError errors={errors.anio ? [errors.anio] : undefined} />
        </Field>
        <Field data-invalid={!!errors.poblacion}>
          <FieldLabel htmlFor="dp_poblacion">Población</FieldLabel>
          <Input id="dp_poblacion" type="number" aria-invalid={!!errors.poblacion} {...register('poblacion')} />
          <FieldError errors={errors.poblacion ? [errors.poblacion] : undefined} />
        </Field>
      </div>

      <Field data-invalid={!!errors.rango_edad}>
        <FieldLabel htmlFor="dp_rango_edad">Rango de edad</FieldLabel>
        <Input
          id="dp_rango_edad"
          list="rangos-edad-ine"
          placeholder="p. ej. 0 a 4 años"
          aria-invalid={!!errors.rango_edad}
          {...register('rango_edad')}
        />
        <datalist id="rangos-edad-ine">
          {RANGOS_EDAD_QUINQUENALES_INE.map((r) => (
            <option key={r} value={r} />
          ))}
        </datalist>
        <FieldError errors={errors.rango_edad ? [errors.rango_edad] : undefined} />
      </Field>

      <Field data-invalid={!!errors.gender_id}>
        <FieldLabel htmlFor="dp_gender">Género</FieldLabel>
        <Select value={genderId} onValueChange={(value) => setValue('gender_id', value, { shouldValidate: true })}>
          <SelectTrigger id="dp_gender" className="w-full">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {genderOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError errors={errors.gender_id ? [errors.gender_id] : undefined} />
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

export function DemographicPopulationTab({ canManage }: { canManage: boolean }) {
  const [anio, setAnio] = useState(2025)
  const [sectorFilter, setSectorFilter] = useState<string>(COMUNA_VALUE)
  const [search, setSearch] = useState('')

  const sectorsQuery = useQuery({ queryKey: queryKeys.sectors.list(), queryFn: () => sectorsRepository.list() })
  const gendersQuery = useQuery({ queryKey: queryKeys.genderCategories.list(), queryFn: () => genderCategoriesRepository.list() })

  const effectiveSectorId = sectorFilter === COMUNA_VALUE ? null : sectorFilter
  const query = useDemographicPopulation({ sectorId: effectiveSectorId, anio })

  const [editing, setEditing] = useState<DemographicPopulation | undefined>(undefined)
  const [createDefaults, setCreateDefaults] = useState<{ rango_edad?: string; gender_id?: string }>({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const createMutation = useCreateDemographicPopulation()
  const updateMutation = useUpdateDemographicPopulation()
  const deleteMutation = useDeleteDemographicPopulation()
  const confirm = useConfirm()

  const sectorOptions = (sectorsQuery.data ?? []).map((s) => ({ value: s.id, label: s.nombre }))
  const genderOptions = (gendersQuery.data ?? []).map((g) => ({ value: g.id, label: g.nombre }))
  const genderById = new Map<string, GenderCategory>((gendersQuery.data ?? []).map((g) => [g.id, g]))

  const openCreate = (defaults: { rango_edad?: string; gender_id?: string } = {}) => {
    setEditing(undefined)
    setCreateDefaults(defaults)
    setDialogOpen(true)
  }

  const openEdit = (record: DemographicPopulation) => {
    setEditing(record)
    setCreateDefaults({})
    setDialogOpen(true)
  }

  const handleDelete = async (record: DemographicPopulation) => {
    const confirmed = await confirm({
      title: `¿Eliminar "${record.rango_edad}"?`,
      variant: 'destructive',
      confirmLabel: 'Eliminar',
    })
    if (!confirmed) return
    try {
      await deleteMutation.mutateAsync(record.id)
      toastSuccess('Registro eliminado')
    } catch (error) {
      toastError('No se pudo eliminar', error instanceof Error ? error.message : undefined)
    }
  }

  const normalizedSearch = search.trim().toLowerCase()

  const buildPivot = (rows: DemographicPopulation[]) => {
    const filtered = normalizedSearch ? rows.filter((r) => r.rango_edad.toLowerCase().includes(normalizedSearch)) : rows

    const generosPresentes = Array.from(new Set(filtered.map((r) => r.gender_id)))
      .map((id) => genderById.get(id))
      .filter((g): g is GenderCategory => !!g)
      .sort((a, b) => a.orden - b.orden)

    const pivotMap = new Map<string, PivotRow>()
    for (const r of filtered) {
      if (!pivotMap.has(r.rango_edad)) pivotMap.set(r.rango_edad, { rango_edad: r.rango_edad, porGenero: {} })
      pivotMap.get(r.rango_edad)!.porGenero[r.gender_id] = r
    }

    const pivotRows = Array.from(pivotMap.values()).sort((a, b) => {
      const ai = RANGO_EDAD_ORDEN.get(a.rango_edad) ?? Number.MAX_SAFE_INTEGER
      const bi = RANGO_EDAD_ORDEN.get(b.rango_edad) ?? Number.MAX_SAFE_INTEGER
      return ai !== bi ? ai - bi : a.rango_edad.localeCompare(b.rango_edad)
    })

    return { pivotRows, generosPresentes }
  }

  const buildColumns = (generosPresentes: GenderCategory[]): ColumnDef<PivotRow>[] => [
    { accessorKey: 'rango_edad', header: 'Rango de edad' },
    ...generosPresentes.map(
      (genero): ColumnDef<PivotRow> => ({
        id: `genero-${genero.id}`,
        header: genero.nombre,
        cell: ({ row }) => {
          const record = row.original.porGenero[genero.id]
          if (!record) {
            return canManage ? (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => openCreate({ rango_edad: row.original.rango_edad, gender_id: genero.id })}
              >
                <Plus className="size-3.5" aria-hidden="true" />
                <span className="sr-only">Agregar {genero.nombre}</span>
              </Button>
            ) : (
              <span className="text-muted-foreground">—</span>
            )
          }
          return (
            <div className="flex items-center justify-between gap-1">
              <span>{formatNumber(record.poblacion)}</span>
              {canManage ? (
                <div className="flex gap-0.5">
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(record)}>
                    <Pencil className="size-3.5" aria-hidden="true" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(record)}>
                    <Trash2 className="size-3.5 text-destructive" aria-hidden="true" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </div>
              ) : null}
            </div>
          )
        },
      }),
    ),
    {
      id: 'total',
      header: 'Total',
      cell: ({ row }) =>
        formatNumber(Object.values(row.original.porGenero).reduce((suma, r) => suma + (r?.poblacion ?? 0), 0)),
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por rango de edad…"
        filters={
          <>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={COMUNA_VALUE}>Toda la comuna</SelectItem>
                {sectorOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value))}
              className="w-24"
              aria-label="Año"
            />
          </>
        }
        actions={
          canManage ? (
            <Button size="sm" onClick={() => openCreate()}>
              <Plus className="size-3.5" aria-hidden="true" />
              Nuevo registro
            </Button>
          ) : undefined
        }
      />
      <p className="text-xs text-muted-foreground">
        Población base para calcular tasas por edad y género (RF-13). El rango de edad es texto libre — puede usar los
        grupos quinquenales del INE u otra agrupación de su fuente.
      </p>

      <QueryStateBoundary
        query={query}
        emptyTitle="Sin datos demográficos para este filtro"
        hasActiveFilters={normalizedSearch !== ''}
        isEmpty={(rows) => buildPivot(rows).pivotRows.length === 0}
        onClearFilters={() => setSearch('')}
      >
        {(rows) => {
          const { pivotRows, generosPresentes } = buildPivot(rows)
          return <DataTable columns={buildColumns(generosPresentes)} data={pivotRows} pageSize={pivotRows.length || 1} />
        }}
      </QueryStateBoundary>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar población demográfica' : 'Nuevo registro demográfico'}</DialogTitle>
          </DialogHeader>
          <DemographicPopulationForm
            row={editing}
            defaultSectorId={sectorFilter}
            defaultAnio={anio}
            defaultRangoEdad={createDefaults.rango_edad}
            defaultGenderId={createDefaults.gender_id}
            sectorOptions={sectorOptions}
            genderOptions={genderOptions}
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
