import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldCheck } from 'lucide-react'
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
    <div className="w-full max-w-[380px] rounded-md border border-border bg-card p-8 shadow-elevate-sm">
      <div className="mb-6 border-b border-border pb-5">
        <h2 className="mb-1.5 font-heading text-xl font-bold text-primary-dark">Iniciar sesión</h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Ingresa con tu cuenta institucional autorizada. El acceso a esta plataforma es exclusivo para personal
          designado por la administración.
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <Field data-invalid={!!errors.correo}>
          <FieldLabel htmlFor="correo">Correo institucional</FieldLabel>
          <Input
            id="correo"
            type="email"
            placeholder="nombre@sannorbertosalud.cl"
            autoComplete="username"
            aria-invalid={!!errors.correo}
            className="rounded-md"
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
            className="rounded-md"
            {...register('password')}
          />
          <FieldError errors={errors.password ? [errors.password] : undefined} />
        </Field>

        <Button type="submit" disabled={isSubmitting || login.isPending} className="mt-1 h-10 rounded-md">
          {login.isPending ? 'Ingresando…' : 'Iniciar sesión'}
        </Button>

        <div className="mt-1 flex items-start gap-2 rounded-md bg-muted px-3 py-2.5 text-[11.5px] leading-relaxed text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-secondary" aria-hidden="true" />
          <span>Conexión cifrada. Las cuentas son creadas y administradas exclusivamente por San Norberto Salud.</span>
        </div>
      </form>
    </div>
  )
}
