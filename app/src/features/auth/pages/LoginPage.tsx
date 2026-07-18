import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/app/router/routes'
import { useIsDemoMode } from '@/hooks/useIsDemoMode'
import { LoginForm } from '../components/LoginForm'
import { useIsAuthenticated } from '../store/session.store'

export function LoginPage() {
  const isAuthenticated = useIsAuthenticated()
  const isDemoMode = useIsDemoMode()

  if (isAuthenticated) {
    return <Navigate to={ROUTES.app.dashboard} replace />
  }

  return (
    <div className="flex w-full max-w-[340px] flex-col gap-6">
      <LoginForm />
      {isDemoMode && (
        <div className="rounded-lg border border-dashed border-secondary/40 bg-secondary/5 p-3 text-[11.5px] leading-relaxed text-muted-foreground">
          <p className="mb-1 font-semibold text-foreground">Modo demo</p>
          <p>
            Usa <span className="font-medium text-foreground">admin@sannorbertosalud.cl</span> (administrador) o{' '}
            <span className="font-medium text-foreground">marcela.ibanez@hospitalmelipilla.cl</span> (usuario de
            clínica) con cualquier contraseña.
          </p>
        </div>
      )}
    </div>
  )
}
