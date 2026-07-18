import { NAV_ITEMS } from '@/app/router/navItems'
import logoUrl from '@/assets/images/logo-sannorberto.png'
import { useCurrentProfile } from '@/features/auth/store/session.store'
import { SidebarNavItem } from './SidebarNavItem'

interface SidebarProps {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const profile = useCurrentProfile()

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.roles && (!profile || !item.roles.includes(profile.rol))) return false
    if (item.label === 'Comparaciones' && profile?.rol !== 'admin_general' && !profile?.puede_ver_comparaciones) {
      return false
    }
    return true
  })

  return (
    <div className="flex h-full w-full flex-col gap-1 bg-primary-dark p-3.5">
      <div className="flex items-center gap-2.5 px-2 pt-1 pb-5">
        <img src={logoUrl} alt="" className="size-6 shrink-0 rounded-[7px] object-cover" />
        <span className="font-heading text-[13px] font-bold text-white">San Norberto Salud</span>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {visibleItems.map((item) => (
          <SidebarNavItem key={item.path} item={item} onNavigate={onNavigate} />
        ))}
      </nav>
    </div>
  )
}
