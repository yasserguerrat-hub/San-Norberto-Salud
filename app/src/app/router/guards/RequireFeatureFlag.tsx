import { Outlet } from 'react-router-dom'
import { NoPermissionState } from '@/components/shared/states/NoPermissionState'
import { useCurrentProfile } from '@/features/auth/store/session.store'
import type { Profile } from '@/types/database.types'

interface RequireFeatureFlagProps {
  isAllowed: (profile: Profile) => boolean
  title?: string
  description?: string
}

export function RequireFeatureFlag({ isAllowed, title, description }: RequireFeatureFlagProps) {
  const profile = useCurrentProfile()

  if (!profile || !isAllowed(profile)) {
    return <NoPermissionState fullPage title={title} description={description} />
  }

  return <Outlet />
}
