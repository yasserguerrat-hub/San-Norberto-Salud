import { LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useSessionStore } from '@/features/auth/store/session.store'
import { useUIStore } from '@/stores/ui.store'
import { ClinicScopeBadge } from './ClinicScopeBadge'
import { RoleBadge } from './RoleBadge'
import { Sidebar } from './Sidebar'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const mobileNavOpen = useUIStore((state) => state.mobileNavOpen)
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen)
  const logout = useSessionStore((state) => state.logout)

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:px-7">
      <div className="flex items-center gap-2.5">
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="left" className="w-[232px] border-0 bg-primary-dark p-0 sm:max-w-[232px]" showCloseButton={false}>
            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
            <Sidebar onNavigate={() => setMobileNavOpen(false)} />
          </SheetContent>
        </Sheet>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileNavOpen(true)}>
          <Menu className="size-5" aria-hidden="true" />
          <span className="sr-only">Abrir menú</span>
        </Button>
        <h1 className="font-heading text-base font-bold text-primary-dark">{title}</h1>
      </div>
      <div className="flex items-center gap-2.5">
        <ClinicScopeBadge />
        <RoleBadge />
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="size-3.5" aria-hidden="true" />
          Cerrar sesión
        </Button>
      </div>
    </header>
  )
}
