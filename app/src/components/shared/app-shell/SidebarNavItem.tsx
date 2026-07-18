import { NavLink } from 'react-router-dom'
import type { NavItem } from '@/app/router/navItems'
import { cn } from '@/lib/utils'

interface SidebarNavItemProps {
  item: NavItem
  onNavigate?: () => void
}

export function SidebarNavItem({ item, onNavigate }: SidebarNavItemProps) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-[#CFE3EC] transition-[background-color,padding-left] duration-150 hover:bg-white/8 hover:pl-4',
          isActive && 'bg-white/12 text-white hover:bg-white/12',
        )
      }
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {item.label}
    </NavLink>
  )
}
