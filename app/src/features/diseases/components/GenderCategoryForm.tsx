import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { GenderCategory } from '@/types/database.types'
import { genderCategorySchema, type GenderCategoryFormValues } from '../schemas/genderCategory.schema'

type GenderCategoryFormInput = z.input<typeof genderCategorySchema>

interface GenderCategoryFormProps {
  genderCategory?: GenderCategory
  onSubmit: (values: GenderCategoryFormValues) => Promise<void> | void
  onCancel: () => void
  isSubmitting?: boolean
}

export function GenderCategoryForm({ genderCategory, onSubmit, onCancel, isSubmitting }: GenderCategoryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GenderCategoryFormInput, unknown, GenderCategoryFormValues>({
    resolver: zodResolver(genderCategorySchema),
    defaultValues: genderCategory
      ? { nombre: genderCategory.nombre, orden: genderCategory.orden, estado: genderCategory.estado }
      : { orden: 1, estado: 'activo' },
  })

  const estado = watch('estado')
  const submit = handleSubmit(async (values) => onSubmit(values))

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3.5">
      <Field data-invalid={!!errors.nombre}>
        <FieldLabel htmlFor="gc_nombre">Nombre</FieldLabel>
        <Input id="gc_nombre" aria-invalid={!!errors.nombre} {...register('nombre')} />
        <FieldError errors={errors.nombre ? [errors.nombre] : undefined} />
      </Field>

      <div className="grid grid-cols-2 gap-3.5">
        <Field data-invalid={!!errors.orden}>
          <FieldLabel htmlFor="gc_orden">Orden</FieldLabel>
          <Input id="gc_orden" type="number" min={1} aria-invalid={!!errors.orden} {...register('orden')} />
          <FieldError errors={errors.orden ? [errors.orden] : undefined} />
        </Field>
        <Field>
          <FieldLabel htmlFor="gc_estado">Estado</FieldLabel>
          <Select value={estado} onValueChange={(value) => setValue('estado', value as 'activo' | 'inactivo')}>
            <SelectTrigger id="gc_estado" className="w-full">
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
          {isSubmitting ? 'Guardando…' : genderCategory ? 'Guardar cambios' : 'Crear'}
        </Button>
      </div>
    </form>
  )
}
