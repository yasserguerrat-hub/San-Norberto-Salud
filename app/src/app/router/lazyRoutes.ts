import { lazy } from 'react'

export const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
export const ClinicsListPage = lazy(() =>
  import('@/features/clinics/pages/ClinicsListPage').then((m) => ({ default: m.ClinicsListPage })),
)
export const SectorsPage = lazy(() =>
  import('@/features/sectors/pages/SectorsPage').then((m) => ({ default: m.SectorsPage })),
)
export const PopulationPage = lazy(() =>
  import('@/features/population/pages/PopulationPage').then((m) => ({ default: m.PopulationPage })),
)
export const DiseasesPage = lazy(() =>
  import('@/features/diseases/pages/DiseasesPage').then((m) => ({ default: m.DiseasesPage })),
)
export const HealthRecordsPage = lazy(() =>
  import('@/features/health-records/pages/HealthRecordsPage').then((m) => ({ default: m.HealthRecordsPage })),
)
export const ComparisonsPage = lazy(() =>
  import('@/features/comparisons/pages/ComparisonsPage').then((m) => ({ default: m.ComparisonsPage })),
)
export const ReportsPage = lazy(() =>
  import('@/features/reports/pages/ReportsPage').then((m) => ({ default: m.ReportsPage })),
)
export const AiResearchPage = lazy(() =>
  import('@/features/ai-research/pages/AiResearchPage').then((m) => ({ default: m.AiResearchPage })),
)
export const ApprovalsPage = lazy(() =>
  import('@/features/approvals/pages/ApprovalsPage').then((m) => ({ default: m.ApprovalsPage })),
)
export const UsersPage = lazy(() => import('@/features/users/pages/UsersPage').then((m) => ({ default: m.UsersPage })))
export const SettingsPage = lazy(() =>
  import('@/features/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)
