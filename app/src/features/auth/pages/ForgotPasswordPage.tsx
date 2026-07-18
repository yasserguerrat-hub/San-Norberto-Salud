import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { IS_DEMO_DATA } from '@/app/config/constants'
import { ROUTES } from '@/app/router/routes'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabaseClient'

const schema = z.object({ correo: z.email('Ingresa un correo institucional válido') })
type FormValues = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async ({ correo }) => {
    // RF-02: recuperación de contraseña vía correo electrónico. Por seguridad, la respuesta
    // nunca revela si la cuenta existe: se muestra el mismo mensaje con o sin coincidencia.
    if (IS_DEMO_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400))
    } else {
      await supabase.auth.resetPasswordForEmail(correo, {
        redirectTo: `${window.location.origin}${ROUTES.resetPassword}`,
      })
    }
    setSent(true)
  })

  if (sent) {
    return (
      <div className="flex w-full max-w-[340px] flex-col gap-4 text-center">
        <h2 className="font-heading text-xl font-bold text-primary-dark">Revisa tu correo</h2>
        <p className="text-sm text-muted-foreground">
          Si el correo corresponde a una cuenta institucional activa, recibirás un enlace para restablecer tu
          contraseña en los próximos minutos.
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link to={ROUTES.login}>Volver a iniciar sesión</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex w-full max-w-[340px] flex-col gap-4">
      <div>
        <h2 className="mb-1.5 font-heading text-[22px] font-bold text-primary-dark">Recuperar contraseña</h2>
        <p className="text-sm text-muted-foreground">
          Ingresa tu correo institucional y te enviaremos un enlace para restablecer tu contraseña.
        </p>
      </div>

      <Field data-invalid={!!errors.correo}>
        <FieldLabel htmlFor="correo">Correo institucional</FieldLabel>
        <Input
          id="correo"
          type="email"
          placeholder="nombre@sannorbertosalud.cl"
          autoComplete="username"
          aria-invalid={!!errors.correo}
          {...register('correo')}
        />
        <FieldError errors={errors.correo ? [errors.correo] : undefined} />
      </Field>

      <Button type="submit" disabled={isSubmitting} className="mt-1 h-10">
        Enviar enlace de recuperación
      </Button>

      <Link to={ROUTES.login} className="text-center text-xs font-medium text-primary hover:underline">
        Volver a iniciar sesión
      </Link>
    </form>
  )
}
