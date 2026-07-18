import { useQuery } from '@tanstack/react-query'
import { clinicsRepository } from '@/data/repositories/clinics.repository'
import { useCurrentProfile } from '@/features/auth/store/session.store'
import { queryKeys } from '@/lib/query/queryKeys'

export function ClinicScopeBadge() {
  const profile = useCurrentProfile()
  const isAdmin = profile?.rol === 'admin_general'

  const clinicQuery = useQuery({
    queryKey: queryKeys.clinics.detail(profile?.clinic_id ?? ''),
    queryFn: () => clinicsRepository.getById(profile!.clinic_id!),
    enabled: !isAdmin && !!profile?.clinic_id,
  })

  const label = isAdmin ? 'Todas las clínicas' : (clinicQuery.data?.nombre_corto ?? '—')

  return (
    <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-primary">
      {label}
    </span>
  )
}
