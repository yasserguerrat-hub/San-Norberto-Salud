import type { ReactNode } from 'react'
import { ConfirmDialogHost } from '@/components/shared/feedback/ConfirmDialog'
import { Toaster } from '@/components/ui/sonner'
import { useAuthBootstrap } from '@/features/auth/hooks/useAuthBootstrap'
import { useHealthRecordsRealtime } from '@/hooks/useHealthRecordsRealtime'
import { QueryProvider } from './QueryProvider'

function AuthBootstrap() {
  useAuthBootstrap()
  return null
}

function RealtimeBootstrap() {
  useHealthRecordsRealtime()
  return null
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthBootstrap />
      <RealtimeBootstrap />
      {children}
      <Toaster position="top-right" richColors />
      <ConfirmDialogHost />
    </QueryProvider>
  )
}
