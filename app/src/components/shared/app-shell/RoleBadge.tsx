import { useCurrentProfile } from '@/features/auth/store/session.store'
import type { Rol } from '@/types/enums'

const ROLE_LABELS: Record<Rol, string> = {
  admin_general: 'Administrador general',
  usuario_clinica: 'Usuario de clínica',
}

export function RoleBadge() {
  const profile = useCurrentProfile()
  if (!profile) return null

  return (
    <span className="hidden items-center rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground sm:inline-flex">
      {ROLE_LABELS[profile.rol]}
    </span>
  )
}
