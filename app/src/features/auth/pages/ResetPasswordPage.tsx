import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { IS_DEMO_DATA } from '@/app/config/constants'
import { ROUTES } from '@/app/router/routes'
import { toastError, toastSuccess } from '@/components/shared/feedback/ToastHelpers'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabaseClient'
import { useSessionStore } from '../store/session.store'

const schema = z
  .object({
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmar: z.string().min(1, 'Repite la nueva contraseña'),
  })
  .refine((values) => values.password === values.confirmar, {
    path: ['confirmar'],
    message: 'Las contraseñas no coinciden',
  })

type FormValues = z.infer<typeof schema>

type LinkStatus = 'verificando' | 'valido' | 'invalido'

// RF-02: destino del enlace de recuperación enviado por correo. Supabase adjunta el token en la
// URL y supabase-js lo canjea automáticamente por una sesión temporal; con esa sesión se puede
// llamar updateUser({ password }). Si no aparece sesión, el enlace expiró o ya fue usado.
export function ResetPasswordPage() {
  const navigate = useNavigate()
  const logout = useSessionStore((state) => state.logout)
  const [linkStatus, setLinkStatus] = useState<LinkStatus>('verificando')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (IS_DEMO_DATA) {
      setLinkStatus('invalido')
      return
    }
    // El canje del token de la URL es asíncrono; se consulta la sesión y también se escucha el
    // evento PASSWORD_RECOVERY por si el canje termina después del primer render.
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (active) setLinkStatus(data.session ? 'valido' : 'invalido')
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (active && (event === 'PASSWORD_RECOVERY' || session)) setLinkStatus('valido')
    })
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const onSubmit = handleSubmit(async ({ password }) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      toastError('No se pudo actualizar la contraseña', error.message)
      return
    }
    // Se cierra la sesión temporal de recuperación para que el usuario entre con su nueva clave.
    logout()
    toastSuccess('Contraseña actualizada', 'Ya puedes iniciar sesión con tu nueva contraseña.')
    navigate(ROUTES.login, { replace: true })
  })

  if (linkStatus === 'verificando') {
    return (
      <div className="flex w-full max-w-[340px] flex-col gap-3 text-center">
        <h2 className="font-heading text-xl font-bold text-primary-dark">Verificando enlace…</h2>
        <p className="text-sm text-muted-foreground">Un momento, estamos validando tu enlace de recuperación.</p>
      </div>
    )
  }

  if (linkStatus === 'invalido') {
    return (
      <div className="flex w-full max-w-[340px] flex-col gap-4 text-center">
        <h2 className="font-heading text-xl font-bold text-primary-dark">Enlace no válido</h2>
        <p className="text-sm text-muted-foreground">
          El enlace de recuperación expiró o ya fue utilizado. Solicita uno nuevo para continuar.
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link to={ROUTES.forgotPassword}>Solicitar nuevo enlace</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex w-full max-w-[340px] flex-col gap-4">
      <div>
        <h2 className="mb-1.5 font-heading text-[22px] font-bold text-primary-dark">Nueva contraseña</h2>
        <p className="text-sm text-muted-foreground">Define la nueva contraseña de tu cuenta institucional.</p>
      </div>

      <Field data-invalid={!!errors.password}>
        <FieldLabel htmlFor="password">Nueva contraseña</FieldLabel>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        <FieldError errors={errors.password ? [errors.password] : undefined} />
      </Field>

      <Field data-invalid={!!errors.confirmar}>
        <FieldLabel htmlFor="confirmar">Repetir contraseña</FieldLabel>
        <Input
          id="confirmar"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmar}
          {...register('confirmar')}
        />
        <FieldError errors={errors.confirmar ? [errors.confirmar] : undefined} />
      </Field>

      <Button type="submit" disabled={isSubmitting} className="mt-1 h-10">
        {isSubmitting ? 'Guardando…' : 'Guardar nueva contraseña'}
      </Button>
    </form>
  )
}
