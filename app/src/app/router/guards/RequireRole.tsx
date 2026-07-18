import { Outlet } from 'react-router-dom'
import { NoPermissionState } from '@/components/shared/states/NoPermissionState'
import { useCurrentProfile } from '@/features/auth/store/session.store'
import type { Rol } from '@/types/enums'

interface RequireRoleProps {
  roles: Rol[]
}

// Guardia declarativa: bloquea en vez de redirigir, para poder mostrar el estado "sin
// permisos" en su propio lugar (RNF-15) en vez de sacar al usuario de la navegación.
export function RequireRole({ roles }: RequireRoleProps) {
  const profile = useCurrentProfile()

  if (!profile || !roles.includes(profile.rol)) {
    return <NoPermissionState fullPage />
  }

  return <Outlet />
}
