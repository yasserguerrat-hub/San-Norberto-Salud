import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoadingState } from '@/components/shared/states/LoadingState'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'
import { AppShellLayout } from '@/layouts/AppShellLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { ForbiddenPage } from '@/pages/ForbiddenPage'
import { LandingPage } from '@/pages/LandingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RequireAuth } from './guards/RequireAuth'
import { RequireFeatureFlag } from './guards/RequireFeatureFlag'
import { RequireRole } from './guards/RequireRole'
import * as Lazy from './lazyRoutes'
import { ROUTES } from './routes'

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<LoadingState />}>{element}</Suspense>
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [{ path: ROUTES.home, element: <LandingPage /> }],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.forgotPassword, element: <ForgotPasswordPage /> },
      { path: ROUTES.resetPassword, element: <ResetPasswordPage /> },
    ],
  },
  { path: ROUTES.forbidden, element: <ForbiddenPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        path: ROUTES.app.root,
        element: <AppShellLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.app.dashboard} replace /> },
          { path: 'dashboard', element: withSuspense(<Lazy.DashboardPage />) },
          { path: 'clinicas', element: withSuspense(<Lazy.ClinicsListPage />) },
          { path: 'sectores', element: withSuspense(<Lazy.SectorsPage />) },
          { path: 'poblacion', element: withSuspense(<Lazy.PopulationPage />) },
          { path: 'enfermedades', element: withSuspense(<Lazy.DiseasesPage />) },
          { path: 'registros', element: withSuspense(<Lazy.HealthRecordsPage />) },
          {
            element: (
              <RequireFeatureFlag
                isAllowed={(profile) => profile.rol === 'admin_general' || profile.puede_ver_comparaciones}
                title="No tienes acceso a comparaciones"
                description="El administrador puede habilitar esta función para tu cuenta desde Usuarios."
              />
            ),
            children: [{ path: 'comparaciones', element: withSuspense(<Lazy.ComparisonsPage />) }],
          },
          { path: 'reportes', element: withSuspense(<Lazy.ReportsPage />) },
          { path: 'investigacion-ia', element: withSuspense(<Lazy.AiResearchPage />) },
          { path: 'aprobaciones', element: withSuspense(<Lazy.ApprovalsPage />) },
          {
            element: <RequireRole roles={['admin_general']} />,
            children: [
              { path: 'usuarios', element: withSuspense(<Lazy.UsersPage />) },
              { path: 'configuracion', element: withSuspense(<Lazy.SettingsPage />) },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
