import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Sector } from '@/types/database.types'
import { SECTOR_TYPE_LABELS, sectorSchema, type SectorFormValues } from '../schemas/sector.schema'

type SectorFormInput = z.input<typeof sectorSchema>

interface SectorFormProps {
  sector?: Sector
  onSubmit: (values: SectorFormValues) => Promise<void> | void
  onCancel: () => void
  isSubmitting?: boolean
}

export function SectorForm({ sector, onSubmit, onCancel, isSubmitting }: SectorFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SectorFormInput, unknown, SectorFormValues>({
    resolver: zodResolver(sectorSchema),
    defaultValues: sector
      ? {
          nombre: sector.nombre,
          tipo: sector.tipo,
          descripcion: sector.descripcion ?? '',
          lat: sector.coordenadas?.lat,
          lng: sector.coordenadas?.lng,
          estado: sector.estado,
        }
      : { tipo: 'urbano', estado: 'activo' },
  })

  const tipo = watch('tipo')
  const estado = watch('estado')
  const submit = handleSubmit(async (values) => onSubmit(values))

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3.5">
      <Field data-invalid={!!errors.nombre}>
        <FieldLabel htmlFor="s_nombre">Nombre</FieldLabel>
        <Input id="s_nombre" placeholder="p. ej. Villa Los Aromos" aria-invalid={!!errors.nombre} {...register('nombre')} />
        <FieldError errors={errors.nombre ? [errors.nombre] : undefined} />
      </Field>

      <div className="grid grid-cols-2 gap-3.5">
        <Field>
          <FieldLabel htmlFor="s_tipo">Tipo</FieldLabel>
          <Select value={tipo} onValueChange={(value) => setValue('tipo', value as SectorFormValues['tipo'])}>
            <SelectTrigger id="s_tipo" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SECTOR_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="s_estado">Estado</FieldLabel>
          <Select value={estado} onValueChange={(value) => setValue('estado', value as 'activo' | 'inactivo')}>
            <SelectTrigger id="s_estado" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="s_descripcion">Descripción (opcional)</FieldLabel>
        <Textarea id="s_descripcion" rows={2} {...register('descripcion')} />
      </Field>

      <div className="grid grid-cols-2 gap-3.5">
        <Field data-invalid={!!errors.lat}>
          <FieldLabel htmlFor="s_lat">Latitud (opcional)</FieldLabel>
          <Input id="s_lat" type="number" step="any" placeholder="-33.6833" aria-invalid={!!errors.lat} {...register('lat')} />
          <FieldError errors={errors.lat ? [errors.lat] : undefined} />
        </Field>
        <Field data-invalid={!!errors.lng}>
          <FieldLabel htmlFor="s_lng">Longitud (opcional)</FieldLabel>
          <Input id="s_lng" type="number" step="any" placeholder="-71.2167" aria-invalid={!!errors.lng} {...register('lng')} />
          <FieldError errors={errors.lng ? [errors.lng] : undefined} />
        </Field>
      </div>
      <p className="-mt-1.5 text-xs text-muted-foreground">
        Sin latitud/longitud el sector no aparece en el mapa, pero sigue disponible en catálogos y registros.
      </p>

      <div className="flex justify-end gap-2 border-t border-border pt-3.5">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : sector ? 'Guardar cambios' : 'Crear'}
        </Button>
      </div>
    </form>
  )
}
