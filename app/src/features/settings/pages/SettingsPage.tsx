import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { DemoDataBadge } from '@/components/shared/badges/DemoDataBadge'
import { DataTable } from '@/components/shared/data-table/DataTable'
import { toastError, toastSuccess } from '@/components/shared/feedback/ToastHelpers'
import { QueryStateBoundary } from '@/components/shared/states/QueryStateBoundary'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { diseasesRepository } from '@/data/repositories/diseases.repository'
import { sectorsRepository } from '@/data/repositories/sectors.repository'
import { useCurrentProfile } from '@/features/auth/store/session.store'
import { useConfirm } from '@/hooks/useConfirm'
import { formatDateShort } from '@/lib/formatters/date'
import { queryKeys } from '@/lib/query/queryKeys'
import type { DataSource, PercentageThreshold, RiskThreshold } from '@/types/database.types'
import {
  CONFIDENCE_LABELS,
  DATA_SOURCE_TYPE_LABELS,
  dataSourceSchema,
  type DataSourceFormValues,
} from '../schemas/dataSource.schema'
import { percentageThresholdSchema, type PercentageThresholdFormValues } from '../schemas/percentageThreshold.schema'
import { riskThresholdSchema, type RiskThresholdFormValues } from '../schemas/riskThreshold.schema'
import {
  useCreateDataSource,
  useCreatePercentageThreshold,
  useCreateRiskThreshold,
  useDataSources,
  useDeleteDataSource,
  useDeletePercentageThreshold,
  useDeleteRiskThreshold,
  usePercentageThresholds,
  useRiskThresholds,
  useUpdatePercentageThreshold,
  useUpdateRiskThreshold,
} from '../hooks/useSettings'

const AMBITO_LABELS = { global: 'Global', enfermedad: 'Por enfermedad', sector: 'Por sector' } as const

function RiskThresholdsTab({ canManage }: { canManage: boolean }) {
  const query = useRiskThresholds()
  const diseasesQuery = useQuery({ queryKey: queryKeys.diseases.list(), queryFn: () => diseasesRepository.list() })
  const sectorsQuery = useQuery({ queryKey: queryKeys.sectors.list(), queryFn: () => sectorsRepository.list() })
  const createMutation = useCreateRiskThreshold()
  const updateMutation = useUpdateRiskThreshold()
  const deleteMutation = useDeleteRiskThreshold()
  const confirm = useConfirm()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<RiskThreshold | undefined>(undefined)

  const diseaseById = new Map((diseasesQuery.data ?? []).map((d) => [d.id, d.nombre]))
  const sectorById = new Map((sectorsQuery.data ?? []).map((s) => [s.id, s.nombre]))

  type FormInput = z.input<typeof riskThresholdSchema>
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInput, unknown, RiskThresholdFormValues>({
    resolver: zodResolver(riskThresholdSchema),
    values: editing
      ? {
          nombre: editing.nombre,
          ambito: editing.ambito,
          disease_id: editing.disease_id ?? undefined,
          sector_id: editing.sector_id ?? undefined,
          umbral_bajo_max: editing.umbral_bajo_max,
          umbral_medio_max: editing.umbral_medio_max,
          umbral_alto_max: editing.umbral_alto_max,
          estado: editing.estado,
        }
      : { nombre: '', ambito: 'global', umbral_bajo_max: 0, umbral_medio_max: 0, umbral_alto_max: 0, estado: 'activo' },
  })
  const ambito = watch('ambito')
  const diseaseId = watch('disease_id')
  const sectorId = watch('sector_id')

  const columns: ColumnDef<RiskThreshold>[] = [
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'ambito', header: 'Ámbito', cell: ({ row }) => AMBITO_LABELS[row.original.ambito] },
    {
      id: 'referencia',
      header: 'Referencia',
      cell: ({ row }) =>
        row.original.disease_id
          ? (diseaseById.get(row.original.disease_id) ?? '—')
          : row.original.sector_id
            ? (sectorById.get(row.original.sector_id) ?? '—')
            : '—',
    },
    {
      id: 'umbrales',
      header: 'Bajo / Medio / Alto',
      cell: ({ row }) => `< ${row.original.umbral_bajo_max} · ≤ ${row.original.umbral_medio_max} · ≤ ${row.original.umbral_alto_max}`,
    },
    ...(canManage
      ? [
          {
            id: 'actions',
            header: '',
            cell: ({ row }: { row: { original: RiskThreshold } }) => (
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
                    const confirmed = await confirm({ title: `¿Eliminar "${row.original.nombre}"?`, variant: 'destructive', confirmLabel: 'Eliminar' })
                    if (!confirmed) return
                    try {
                      await deleteMutation.mutateAsync(row.original.id)
                      toastSuccess('Umbral eliminado')
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
          } satisfies ColumnDef<RiskThreshold>,
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
            Nuevo umbral
          </Button>
        </div>
      ) : null}

      <QueryStateBoundary query={query} emptyTitle="Todavía no hay umbrales de riesgo configurados">
        {(rows) => <DataTable columns={columns} data={rows} />}
      </QueryStateBoundary>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar umbral de riesgo' : 'Nuevo umbral de riesgo'}</DialogTitle>
          </DialogHeader>
          <form
            noValidate
            className="flex flex-col gap-3.5"
            onSubmit={handleSubmit(async (values) => {
              try {
                if (editing) {
                  await updateMutation.mutateAsync({ id: editing.id, input: values })
                  toastSuccess('Umbral actualizado')
                } else {
                  await createMutation.mutateAsync(values)
                  toastSuccess('Umbral creado')
                }
                setDialogOpen(false)
              } catch (error) {
                toastError('No se pudo guardar', error instanceof Error ? error.message : undefined)
              }
            })}
          >
            <Field data-invalid={!!errors.nombre}>
              <FieldLabel htmlFor="rt_nombre">Nombre</FieldLabel>
              <Input id="rt_nombre" aria-invalid={!!errors.nombre} {...register('nombre')} />
              <FieldError errors={errors.nombre ? [errors.nombre] : undefined} />
            </Field>

            <div className="grid grid-cols-2 gap-3.5">
              <Field>
                <FieldLabel htmlFor="rt_ambito">Ámbito</FieldLabel>
                <Select value={ambito} onValueChange={(v) => setValue('ambito', v as RiskThresholdFormValues['ambito'])}>
                  <SelectTrigger id="rt_ambito" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="enfermedad">Por enfermedad</SelectItem>
                    <SelectItem value="sector">Por sector</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {ambito === 'enfermedad' ? (
                <Field data-invalid={!!errors.disease_id}>
                  <FieldLabel htmlFor="rt_disease">Enfermedad</FieldLabel>
                  <Select value={diseaseId} onValueChange={(v) => setValue('disease_id', v, { shouldValidate: true })}>
                    <SelectTrigger id="rt_disease" className="w-full">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {(diseasesQuery.data ?? []).map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={errors.disease_id ? [errors.disease_id] : undefined} />
                </Field>
              ) : ambito === 'sector' ? (
                <Field data-invalid={!!errors.sector_id}>
                  <FieldLabel htmlFor="rt_sector">Sector</FieldLabel>
                  <Select value={sectorId} onValueChange={(v) => setValue('sector_id', v, { shouldValidate: true })}>
                    <SelectTrigger id="rt_sector" className="w-full">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {(sectorsQuery.data ?? []).map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={errors.sector_id ? [errors.sector_id] : undefined} />
                </Field>
              ) : (
                <div />
              )}
            </div>

            <div className="grid grid-cols-3 gap-3.5">
              <Field data-invalid={!!errors.umbral_bajo_max}>
                <FieldLabel htmlFor="rt_bajo">Bajo hasta &lt;</FieldLabel>
                <Input id="rt_bajo" type="number" aria-invalid={!!errors.umbral_bajo_max} {...register('umbral_bajo_max')} />
                <FieldError errors={errors.umbral_bajo_max ? [errors.umbral_bajo_max] : undefined} />
              </Field>
              <Field data-invalid={!!errors.umbral_medio_max}>
                <FieldLabel htmlFor="rt_medio">Medio hasta ≤</FieldLabel>
                <Input id="rt_medio" type="number" aria-invalid={!!errors.umbral_medio_max} {...register('umbral_medio_max')} />
                <FieldError errors={errors.umbral_medio_max ? [errors.umbral_medio_max] : undefined} />
              </Field>
              <Field data-invalid={!!errors.umbral_alto_max}>
                <FieldLabel htmlFor="rt_alto">Alto hasta ≤</FieldLabel>
                <Input id="rt_alto" type="number" aria-invalid={!!errors.umbral_alto_max} {...register('umbral_alto_max')} />
                <FieldError errors={errors.umbral_alto_max ? [errors.umbral_alto_max] : undefined} />
              </Field>
            </div>
            <p className="text-xs text-muted-foreground">Sobre el umbral alto, el riesgo se clasifica como extremo.</p>

            <div className="flex justify-end gap-2 border-t border-border pt-3.5">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editing ? 'Guardar cambios' : 'Crear'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PercentageThresholdsTab({ canManage }: { canManage: boolean }) {
  const query = usePercentageThresholds()
  const diseasesQuery = useQuery({ queryKey: queryKeys.diseases.list(), queryFn: () => diseasesRepository.list() })
  const createMutation = useCreatePercentageThreshold()
  const updateMutation = useUpdatePercentageThreshold()
  const deleteMutation = useDeletePercentageThreshold()
  const confirm = useConfirm()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<PercentageThreshold | undefined>(undefined)
  const diseaseById = new Map((diseasesQuery.data ?? []).map((d) => [d.id, d.nombre]))

  type FormInput = z.input<typeof percentageThresholdSchema>
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInput, unknown, PercentageThresholdFormValues>({
    resolver: zodResolver(percentageThresholdSchema),
    values: editing
      ? {
          nombre: editing.nombre,
          ambito: editing.ambito as 'global' | 'enfermedad',
          disease_id: editing.disease_id ?? undefined,
          umbral_atencion: editing.umbral_atencion,
          umbral_critico: editing.umbral_critico,
          estado: editing.estado,
        }
      : { nombre: '', ambito: 'global', umbral_atencion: 0, umbral_critico: 0, estado: 'activo' },
  })
  const ambito = watch('ambito')
  const diseaseId = watch('disease_id')

  const columns: ColumnDef<PercentageThreshold>[] = [
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'ambito', header: 'Ámbito', cell: ({ row }) => (row.original.ambito === 'global' ? 'Global' : 'Por enfermedad') },
    { id: 'referencia', header: 'Enfermedad', cell: ({ row }) => (row.original.disease_id ? (diseaseById.get(row.original.disease_id) ?? '—') : '—') },
    { id: 'umbrales', header: 'Atención / Crítico', cell: ({ row }) => `${row.original.umbral_atencion}% / ${row.original.umbral_critico}%` },
    ...(canManage
      ? [
          {
            id: 'actions',
            header: '',
            cell: ({ row }: { row: { original: PercentageThreshold } }) => (
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
                    const confirmed = await confirm({ title: `¿Eliminar "${row.original.nombre}"?`, variant: 'destructive', confirmLabel: 'Eliminar' })
                    if (!confirmed) return
                    try {
                      await deleteMutation.mutateAsync(row.original.id)
                      toastSuccess('Umbral eliminado')
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
          } satisfies ColumnDef<PercentageThreshold>,
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
            Nuevo umbral
          </Button>
        </div>
      ) : null}

      <QueryStateBoundary query={query} emptyTitle="Todavía no hay umbrales porcentuales configurados">
        {(rows) => <DataTable columns={columns} data={rows} />}
      </QueryStateBoundary>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar umbral porcentual' : 'Nuevo umbral porcentual'}</DialogTitle>
          </DialogHeader>
          <form
            noValidate
            className="flex flex-col gap-3.5"
            onSubmit={handleSubmit(async (values) => {
              try {
                if (editing) {
                  await updateMutation.mutateAsync({ id: editing.id, input: values })
                  toastSuccess('Umbral actualizado')
                } else {
                  await createMutation.mutateAsync(values)
                  toastSuccess('Umbral creado')
                }
                setDialogOpen(false)
              } catch (error) {
                toastError('No se pudo guardar', error instanceof Error ? error.message : undefined)
              }
            })}
          >
            <Field data-invalid={!!errors.nombre}>
              <FieldLabel htmlFor="pt_nombre">Nombre</FieldLabel>
              <Input id="pt_nombre" aria-invalid={!!errors.nombre} {...register('nombre')} />
              <FieldError errors={errors.nombre ? [errors.nombre] : undefined} />
            </Field>

            <div className="grid grid-cols-2 gap-3.5">
              <Field>
                <FieldLabel htmlFor="pt_ambito">Ámbito</FieldLabel>
                <Select value={ambito} onValueChange={(v) => setValue('ambito', v as PercentageThresholdFormValues['ambito'])}>
                  <SelectTrigger id="pt_ambito" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="enfermedad">Por enfermedad</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              {ambito === 'enfermedad' ? (
                <Field data-invalid={!!errors.disease_id}>
                  <FieldLabel htmlFor="pt_disease">Enfermedad</FieldLabel>
                  <Select value={diseaseId} onValueChange={(v) => setValue('disease_id', v, { shouldValidate: true })}>
                    <SelectTrigger id="pt_disease" className="w-full">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {(diseasesQuery.data ?? []).map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={errors.disease_id ? [errors.disease_id] : undefined} />
                </Field>
              ) : (
                <div />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <Field data-invalid={!!errors.umbral_atencion}>
                <FieldLabel htmlFor="pt_atencion">Umbral de atención (%)</FieldLabel>
                <Input id="pt_atencion" type="number" aria-invalid={!!errors.umbral_atencion} {...register('umbral_atencion')} />
                <FieldError errors={errors.umbral_atencion ? [errors.umbral_atencion] : undefined} />
              </Field>
              <Field data-invalid={!!errors.umbral_critico}>
                <FieldLabel htmlFor="pt_critico">Umbral crítico (%)</FieldLabel>
                <Input id="pt_critico" type="number" aria-invalid={!!errors.umbral_critico} {...register('umbral_critico')} />
                <FieldError errors={errors.umbral_critico ? [errors.umbral_critico] : undefined} />
              </Field>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-3.5">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editing ? 'Guardar cambios' : 'Crear'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DataSourcesTab({ canManage }: { canManage: boolean }) {
  const profile = useCurrentProfile()
  const query = useDataSources()
  const createMutation = useCreateDataSource()
  const deleteMutation = useDeleteDataSource()
  const confirm = useConfirm()
  const [dialogOpen, setDialogOpen] = useState(false)

  type FormInput = z.input<typeof dataSourceSchema>
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, DataSourceFormValues>({
    resolver: zodResolver(dataSourceSchema),
    defaultValues: { tipo: 'oficial', nivel_confianza: 'medio' },
  })
  const tipo = watch('tipo')
  const confianza = watch('nivel_confianza')

  const columns: ColumnDef<DataSource>[] = [
    {
      id: 'titulo',
      header: 'Fuente',
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-foreground">{row.original.titulo}</div>
          <div className="text-xs text-muted-foreground">{row.original.institucion}</div>
        </div>
      ),
    },
    { accessorKey: 'tipo', header: 'Tipo', cell: ({ row }) => DATA_SOURCE_TYPE_LABELS[row.original.tipo] },
    { accessorKey: 'nivel_confianza', header: 'Confianza', cell: ({ row }) => CONFIDENCE_LABELS[row.original.nivel_confianza] },
    { accessorKey: 'fecha', header: 'Fecha', cell: ({ row }) => formatDateShort(row.original.fecha) },
    {
      id: 'url',
      header: '',
      cell: ({ row }) => (
        <a href={row.original.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
          Ver fuente <ExternalLink className="size-3" aria-hidden="true" />
        </a>
      ),
    },
    ...(canManage
      ? [
          {
            id: 'actions',
            header: '',
            cell: ({ row }: { row: { original: DataSource } }) => (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={async () => {
                    const confirmed = await confirm({ title: `¿Eliminar "${row.original.titulo}"?`, variant: 'destructive', confirmLabel: 'Eliminar' })
                    if (!confirmed) return
                    try {
                      await deleteMutation.mutateAsync(row.original.id)
                      toastSuccess('Fuente eliminada')
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
          } satisfies ColumnDef<DataSource>,
        ]
      : []),
  ]

  return (
    <div className="flex flex-col gap-3">
      {canManage ? (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="size-3.5" aria-hidden="true" />
            Nueva fuente
          </Button>
        </div>
      ) : null}

      <QueryStateBoundary query={query} emptyTitle="Todavía no hay fuentes de datos registradas">
        {(rows) => <DataTable columns={columns} data={rows} />}
      </QueryStateBoundary>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) reset()
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nueva fuente de datos</DialogTitle>
          </DialogHeader>
          <form
            noValidate
            className="flex flex-col gap-3.5"
            onSubmit={handleSubmit(async (values) => {
              if (!profile) return
              try {
                await createMutation.mutateAsync({ ...values, creado_por: profile.id })
                toastSuccess('Fuente creada')
                setDialogOpen(false)
                reset()
              } catch (error) {
                toastError('No se pudo guardar', error instanceof Error ? error.message : undefined)
              }
            })}
          >
            <Field data-invalid={!!errors.institucion}>
              <FieldLabel htmlFor="ds_institucion">Institución</FieldLabel>
              <Input id="ds_institucion" aria-invalid={!!errors.institucion} {...register('institucion')} />
              <FieldError errors={errors.institucion ? [errors.institucion] : undefined} />
            </Field>
            <Field data-invalid={!!errors.titulo}>
              <FieldLabel htmlFor="ds_titulo">Título</FieldLabel>
              <Input id="ds_titulo" aria-invalid={!!errors.titulo} {...register('titulo')} />
              <FieldError errors={errors.titulo ? [errors.titulo] : undefined} />
            </Field>
            <Field data-invalid={!!errors.url}>
              <FieldLabel htmlFor="ds_url">URL</FieldLabel>
              <Input id="ds_url" type="url" placeholder="https://" aria-invalid={!!errors.url} {...register('url')} />
              <FieldError errors={errors.url ? [errors.url] : undefined} />
            </Field>
            <div className="grid grid-cols-3 gap-3.5">
              <Field data-invalid={!!errors.fecha}>
                <FieldLabel htmlFor="ds_fecha">Fecha</FieldLabel>
                <Input id="ds_fecha" type="date" aria-invalid={!!errors.fecha} {...register('fecha')} />
                <FieldError errors={errors.fecha ? [errors.fecha] : undefined} />
              </Field>
              <Field>
                <FieldLabel htmlFor="ds_tipo">Tipo</FieldLabel>
                <Select value={tipo} onValueChange={(v) => setValue('tipo', v as DataSourceFormValues['tipo'])}>
                  <SelectTrigger id="ds_tipo" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DATA_SOURCE_TYPE_LABELS).map(([v, label]) => (
                      <SelectItem key={v} value={v}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="ds_confianza">Confianza</FieldLabel>
                <Select value={confianza} onValueChange={(v) => setValue('nivel_confianza', v as DataSourceFormValues['nivel_confianza'])}>
                  <SelectTrigger id="ds_confianza" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CONFIDENCE_LABELS).map(([v, label]) => (
                      <SelectItem key={v} value={v}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="flex justify-end gap-2 border-t border-border pt-3.5">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                Crear fuente
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function SettingsPage() {
  const profile = useCurrentProfile()
  const canManage = profile?.rol === 'admin_general'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Umbrales y fuentes usados para clasificar riesgo y contextualizar la investigación asistida por IA (RF-07, RF-21).
        </p>
        <DemoDataBadge />
      </div>

      <Tabs defaultValue="riesgo">
        <TabsList>
          <TabsTrigger value="riesgo">Umbrales de riesgo</TabsTrigger>
          <TabsTrigger value="porcentual">Umbrales porcentuales</TabsTrigger>
          <TabsTrigger value="fuentes">Fuentes de datos</TabsTrigger>
        </TabsList>
        <TabsContent value="riesgo">
          <RiskThresholdsTab canManage={canManage} />
        </TabsContent>
        <TabsContent value="porcentual">
          <PercentageThresholdsTab canManage={canManage} />
        </TabsContent>
        <TabsContent value="fuentes">
          <DataSourcesTab canManage={canManage} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
