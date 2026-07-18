import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Clinic } from '@/types/database.types'
import type { SelectOption } from '@/types/common.types'
import { clinicSchema, type ClinicFormValues } from '../schemas/clinic.schema'

interface ClinicFormProps {
  clinic?: Clinic
  sectorOptions: SelectOption[]
  onSubmit: (values: ClinicFormValues) => Promise<void> | void
  onCancel: () => void
  isSubmitting?: boolean
}

export function ClinicForm({ clinic, sectorOptions, onSubmit, onCancel, isSubmitting }: ClinicFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicSchema),
    defaultValues: clinic
      ? {
          nombre: clinic.nombre,
          nombre_corto: clinic.nombre_corto,
          direccion: clinic.direccion,
          telefono: clinic.telefono,
          correo: clinic.correo,
          sector_id: clinic.sector_id,
          responsable: clinic.responsable,
          estado: clinic.estado,
        }
      : { estado: 'activo' },
  })

  const sectorId = watch('sector_id')
  const estado = watch('estado')

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
  })

  return (
    <form onSubmit={submit} noValidate className="flex max-h-[70vh] flex-col gap-3.5 overflow-y-auto pr-1">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <Field data-invalid={!!errors.nombre} className="sm:col-span-2">
          <FieldLabel htmlFor="nombre">Nombre completo</FieldLabel>
          <Input id="nombre" aria-invalid={!!errors.nombre} {...register('nombre')} />
          <FieldError errors={errors.nombre ? [errors.nombre] : undefined} />
        </Field>

        <Field data-invalid={!!errors.nombre_corto}>
          <FieldLabel htmlFor="nombre_corto">Nombre corto</FieldLabel>
          <Input id="nombre_corto" aria-invalid={!!errors.nombre_corto} {...register('nombre_corto')} />
          <FieldError errors={errors.nombre_corto ? [errors.nombre_corto] : undefined} />
        </Field>

        <Field data-invalid={!!errors.sector_id}>
          <FieldLabel htmlFor="sector_id">Sector (obligatorio)</FieldLabel>
          <Select value={sectorId} onValueChange={(value) => setValue('sector_id', value, { shouldValidate: true })}>
            <SelectTrigger id="sector_id" className="w-full">
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

        <Field data-invalid={!!errors.direccion} className="sm:col-span-2">
          <FieldLabel htmlFor="direccion">Dirección</FieldLabel>
          <Input id="direccion" aria-invalid={!!errors.direccion} {...register('direccion')} />
          <FieldError errors={errors.direccion ? [errors.direccion] : undefined} />
        </Field>

        <Field data-invalid={!!errors.telefono}>
          <FieldLabel htmlFor="telefono">Teléfono</FieldLabel>
          <Input id="telefono" aria-invalid={!!errors.telefono} {...register('telefono')} />
          <FieldError errors={errors.telefono ? [errors.telefono] : undefined} />
        </Field>

        <Field data-invalid={!!errors.correo}>
          <FieldLabel htmlFor="correo">Correo</FieldLabel>
          <Input id="correo" type="email" aria-invalid={!!errors.correo} {...register('correo')} />
          <FieldError errors={errors.correo ? [errors.correo] : undefined} />
        </Field>

        <Field data-invalid={!!errors.responsable}>
          <FieldLabel htmlFor="responsable">Responsable</FieldLabel>
          <Input id="responsable" aria-invalid={!!errors.responsable} {...register('responsable')} />
          <FieldError errors={errors.responsable ? [errors.responsable] : undefined} />
        </Field>

        <Field>
          <FieldLabel htmlFor="estado">Estado</FieldLabel>
          <Select value={estado} onValueChange={(value) => setValue('estado', value as 'activo' | 'inactivo')}>
            <SelectTrigger id="estado" className="w-full">
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
          {isSubmitting ? 'Guardando…' : clinic ? 'Guardar cambios' : 'Crear clínica'}
        </Button>
      </div>
    </form>
  )
}
