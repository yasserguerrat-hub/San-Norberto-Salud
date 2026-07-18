import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/router/routes'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-background px-6 text-center">
      <p className="font-heading text-5xl font-extrabold text-primary-dark">404</p>
      <h1 className="font-heading text-lg font-bold text-foreground">Página no encontrada</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        La página que buscas no existe o fue movida. Verifica el enlace o vuelve al inicio.
      </p>
      <Button asChild className="mt-2">
        <Link to={ROUTES.home}>Volver al inicio</Link>
      </Button>
    </div>
  )
}
