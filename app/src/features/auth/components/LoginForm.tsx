import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/router/routes'
import { toastError, toastSuccess } from '@/components/shared/feedback/ToastHelpers'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useLogin } from '../hooks/useLogin'
import { loginSchema, type LoginFormValues } from '../schemas/login.schema'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })
  const login = useLogin()

  const onSubmit = handleSubmit(async (values) => {
    try {
      const profile = await login.mutateAsync(values)
      toastSuccess(`Bienvenido/a, ${profile.nombre}`)
    } catch (error) {
      toastError('No se pudo iniciar sesión', error instanceof Error ? error.message : undefined)
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex w-full max-w-[340px] flex-col gap-4">
      <div>
        <h2 className="mb-1.5 font-heading text-[22px] font-bold text-primary-dark">Iniciar sesión</h2>
        <p className="text-sm text-muted-foreground">Cuenta institucional. Sin registro público.</p>
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

      <Field data-invalid={!!errors.password}>
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor="password">Contraseña</FieldLabel>
          <Link to={ROUTES.forgotPassword} className="text-xs font-medium text-primary hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        <FieldError errors={errors.password ? [errors.password] : undefined} />
      </Field>

      <Button type="submit" disabled={isSubmitting || login.isPending} className="mt-1 h-10">
        {login.isPending ? 'Ingresando…' : 'Iniciar sesión'}
      </Button>

      <p className="mt-1 text-center text-[11.5px] leading-normal text-muted-foreground">
        Acceso exclusivo — las cuentas son creadas por el administrador.
      </p>
    </form>
  )
}
