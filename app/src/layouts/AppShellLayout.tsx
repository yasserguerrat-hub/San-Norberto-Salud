import { Outlet, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '@/app/router/navItems'
import { Header } from '@/components/shared/app-shell/Header'
import { Sidebar } from '@/components/shared/app-shell/Sidebar'

export function AppShellLayout() {
  const location = useLocation()
  const activeItem = NAV_ITEMS.find((item) => location.pathname.startsWith(item.path))

  return (
    <div className="flex min-h-svh bg-background">
      <aside className="hidden lg:flex lg:w-[232px] lg:shrink-0">
        <Sidebar />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={activeItem?.label ?? 'San Norberto Salud'} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-5 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
