import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Disease } from '@/types/database.types'
import { DISEASE_TYPE_LABELS, diseaseSchema, type DiseaseFormValues } from '../schemas/disease.schema'

interface DiseaseFormProps {
  disease?: Disease
  onSubmit: (values: DiseaseFormValues) => Promise<void> | void
  onCancel: () => void
  isSubmitting?: boolean
}

export function DiseaseForm({ disease, onSubmit, onCancel, isSubmitting }: DiseaseFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DiseaseFormValues>({
    resolver: zodResolver(diseaseSchema),
    defaultValues: disease
      ? {
          nombre: disease.nombre,
          tipo: disease.tipo,
          descripcion: disease.descripcion ?? '',
          codigo_referencia: disease.codigo_referencia ?? '',
          estado: disease.estado,
        }
      : { tipo: 'enfermedad_cronica', estado: 'activo' },
  })

  const tipo = watch('tipo')
  const estado = watch('estado')

  const submit = handleSubmit(async (values) => onSubmit(values))

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3.5">
      <Field data-invalid={!!errors.nombre}>
        <FieldLabel htmlFor="nombre">Nombre</FieldLabel>
        <Input id="nombre" aria-invalid={!!errors.nombre} {...register('nombre')} />
        <FieldError errors={errors.nombre ? [errors.nombre] : undefined} />
      </Field>

      <div className="grid grid-cols-2 gap-3.5">
        <Field>
          <FieldLabel htmlFor="tipo">Tipo</FieldLabel>
          <Select value={tipo} onValueChange={(value) => setValue('tipo', value as DiseaseFormValues['tipo'])}>
            <SelectTrigger id="tipo" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DISEASE_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

      <Field>
        <FieldLabel htmlFor="codigo_referencia">Código de referencia (opcional)</FieldLabel>
        <Input id="codigo_referencia" placeholder="p. ej. CIE-10 I10" {...register('codigo_referencia')} />
      </Field>

      <Field>
        <FieldLabel htmlFor="descripcion">Descripción (opcional)</FieldLabel>
        <Textarea id="descripcion" rows={3} {...register('descripcion')} />
      </Field>

      <div className="flex justify-end gap-2 border-t border-border pt-3.5">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : disease ? 'Guardar cambios' : 'Crear'}
        </Button>
      </div>
    </form>
  )
}
