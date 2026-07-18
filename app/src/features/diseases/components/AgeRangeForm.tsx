import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AgeRange } from '@/types/database.types'
import { ageRangeSchema, type AgeRangeFormValues } from '../schemas/ageRange.schema'

type AgeRangeFormInput = z.input<typeof ageRangeSchema>

interface AgeRangeFormProps {
  ageRange?: AgeRange
  onSubmit: (values: AgeRangeFormValues) => Promise<void> | void
  onCancel: () => void
  isSubmitting?: boolean
}

export function AgeRangeForm({ ageRange, onSubmit, onCancel, isSubmitting }: AgeRangeFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AgeRangeFormInput, unknown, AgeRangeFormValues>({
    resolver: zodResolver(ageRangeSchema),
    defaultValues: ageRange
      ? {
          nombre: ageRange.nombre,
          edad_min: ageRange.edad_min,
          edad_max: ageRange.edad_max ?? undefined,
          orden: ageRange.orden,
          estado: ageRange.estado,
        }
      : { orden: 1, estado: 'activo' },
  })

  const estado = watch('estado')
  const submit = handleSubmit(async (values) => onSubmit(values))

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3.5">
      <Field data-invalid={!!errors.nombre}>
        <FieldLabel htmlFor="ar_nombre">Nombre</FieldLabel>
        <Input id="ar_nombre" aria-invalid={!!errors.nombre} {...register('nombre')} />
        <FieldError errors={errors.nombre ? [errors.nombre] : undefined} />
      </Field>

      <div className="grid grid-cols-2 gap-3.5">
        <Field data-invalid={!!errors.edad_min}>
          <FieldLabel htmlFor="edad_min">Edad mínima</FieldLabel>
          <Input id="edad_min" type="number" min={0} aria-invalid={!!errors.edad_min} {...register('edad_min')} />
          <FieldError errors={errors.edad_min ? [errors.edad_min] : undefined} />
        </Field>
        <Field data-invalid={!!errors.edad_max}>
          <FieldLabel htmlFor="edad_max">Edad máxima (vacío = sin límite)</FieldLabel>
          <Input id="edad_max" type="number" min={0} aria-invalid={!!errors.edad_max} {...register('edad_max')} />
          <FieldError errors={errors.edad_max ? [errors.edad_max] : undefined} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <Field data-invalid={!!errors.orden}>
          <FieldLabel htmlFor="orden">Orden de despliegue</FieldLabel>
          <Input id="orden" type="number" min={1} aria-invalid={!!errors.orden} {...register('orden')} />
          <FieldError errors={errors.orden ? [errors.orden] : undefined} />
        </Field>
        <Field>
          <FieldLabel htmlFor="ar_estado">Estado</FieldLabel>
          <Select value={estado} onValueChange={(value) => setValue('estado', value as 'activo' | 'inactivo')}>
            <SelectTrigger id="ar_estado" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-3.5">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : ageRange ? 'Guardar cambios' : 'Crear'}
        </Button>
      </div>
    </form>
  )
}
