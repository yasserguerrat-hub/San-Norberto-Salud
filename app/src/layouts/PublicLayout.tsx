import { Outlet, Link } from 'react-router-dom'
import { ROUTES } from '@/app/router/routes'
import logoUrl from '@/assets/images/logo-sannorberto.png'
import { Button } from '@/components/ui/button'

export function PublicLayout() {
  return (
    <div className="min-h-svh bg-background">
      <div className="sticky top-0 z-50 border-b border-border bg-card px-5 lg:px-10">
        <div className="mx-auto flex h-[60px] max-w-[1240px] items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img src={logoUrl} alt="San Norberto Salud" className="size-7 shrink-0 rounded-lg border border-border object-cover" />
            <span className="font-heading text-sm font-bold text-primary-dark">
              San Norberto <span className="text-secondary">Salud</span>
            </span>
          </div>
          <nav className="flex items-center gap-5 overflow-x-auto text-[13px] font-medium text-muted-foreground">
            <a href="#mision" className="whitespace-nowrap hover:text-foreground">
              Objetivo
            </a>
            <a href="#como-funciona" className="whitespace-nowrap hover:text-foreground">
              Cómo funciona
            </a>
            <a href="#que-incluye" className="whitespace-nowrap hover:text-foreground">
              Qué incluye
            </a>
            <Button asChild size="sm">
              <Link to={ROUTES.login}>Iniciar sesión</Link>
            </Button>
          </nav>
        </div>
      </div>

      <Outlet />

      <footer className="border-t border-border px-5 py-8 text-center text-xs text-muted-foreground lg:px-10">
        Sociedad de Servicios Sociales y de Salud San Norberto Ltda. · Comuna de Melipilla, Región Metropolitana ·
        Plataforma de uso interno.
      </footer>
    </div>
  )
}
