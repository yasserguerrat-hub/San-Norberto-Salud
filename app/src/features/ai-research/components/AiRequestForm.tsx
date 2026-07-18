import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'

const schema = z.object({
  pregunta: z.string().min(10, 'Describe la pregunta de investigación (mínimo 10 caracteres)'),
  contexto: z.string().optional(),
})
export type AiRequestFormValues = z.infer<typeof schema>

interface AiRequestFormProps {
  onSubmit: (values: AiRequestFormValues) => Promise<void> | void
  onCancel: () => void
  isSubmitting?: boolean
}

export function AiRequestForm({ onSubmit, onCancel, isSubmitting }: AiRequestFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AiRequestFormValues>({ resolver: zodResolver(schema) })

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} noValidate className="flex flex-col gap-3.5">
      <Field data-invalid={!!errors.pregunta}>
        <FieldLabel htmlFor="pregunta">Pregunta de investigación</FieldLabel>
        <Textarea id="pregunta" rows={3} placeholder="p. ej. ¿Qué factores explican el aumento de IRA en invierno?" aria-invalid={!!errors.pregunta} {...register('pregunta')} />
        <FieldError errors={errors.pregunta ? [errors.pregunta] : undefined} />
      </Field>
      <Field>
        <FieldLabel htmlFor="contexto">Contexto adicional (opcional)</FieldLabel>
        <Textarea id="contexto" rows={2} {...register('contexto')} />
      </Field>
      <p className="rounded-md bg-accent px-3 py-2 text-xs text-primary-dark">
        La solicitud se procesa mediante el proveedor de IA configurado en el servidor (agnóstico de proveedor, RF-26). Cualquier
        dato propuesto quedará como "propuesta" y requerirá aprobación explícita antes de guardarse (RF-22).
      </p>
      <div className="flex justify-end gap-2 border-t border-border pt-3.5">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando…' : 'Solicitar investigación'}
        </Button>
      </div>
    </form>
  )
}
