import {
  Building2,
  ClipboardList,
  CircleCheckBig,
  FileBarChart,
  GitCompareArrows,
  LayoutDashboard,
  MapPinned,
  type LucideIcon,
  SlidersHorizontal,
  Sparkles,
  Stethoscope,
  UserCog,
  Users2,
} from 'lucide-react'
import type { Rol } from '@/types/enums'
import { ROUTES } from './routes'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  /** Si se define, solo estos roles ven el ítem. Comparaciones usa además puede_ver_comparaciones. */
  roles?: Rol[]
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.app.dashboard, icon: LayoutDashboard },
  { label: 'Clínicas', path: ROUTES.app.clinics, icon: Building2 },
  { label: 'Sectores', path: ROUTES.app.sectors, icon: MapPinned },
  { label: 'Población', path: ROUTES.app.population, icon: Users2 },
  { label: 'Enfermedades', path: ROUTES.app.diseases, icon: Stethoscope },
  { label: 'Registros', path: ROUTES.app.healthRecords, icon: ClipboardList },
  { label: 'Comparaciones', path: ROUTES.app.comparisons, icon: GitCompareArrows },
  { label: 'Reportes', path: ROUTES.app.reports, icon: FileBarChart },
  { label: 'Investigación IA', path: ROUTES.app.aiResearch, icon: Sparkles },
  { label: 'Aprobaciones', path: ROUTES.app.approvals, icon: CircleCheckBig },
  { label: 'Usuarios', path: ROUTES.app.users, icon: UserCog, roles: ['admin_general'] },
  { label: 'Configuración', path: ROUTES.app.settings, icon: SlidersHorizontal, roles: ['admin_general'] },
]
