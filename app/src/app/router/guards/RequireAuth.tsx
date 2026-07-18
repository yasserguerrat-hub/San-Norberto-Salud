import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useIsAuthenticated } from '@/features/auth/store/session.store'
import { ROUTES } from '../routes'

export function RequireAuth() {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />
  }

  return <Outlet />
}
