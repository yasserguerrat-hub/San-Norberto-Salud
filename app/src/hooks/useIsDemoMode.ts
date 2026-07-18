import { IS_DEMO_DATA } from '@/app/config/constants'

export function useIsDemoMode(): boolean {
  return IS_DEMO_DATA
}
