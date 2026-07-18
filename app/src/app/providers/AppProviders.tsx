import type { ReactNode } from 'react'
import { ConfirmDialogHost } from '@/components/shared/feedback/ConfirmDialog'
import { Toaster } from '@/components/ui/sonner'
import { useAuthBootstrap } from '@/features/auth/hooks/useAuthBootstrap'
import { QueryProvider } from './QueryProvider'

function AuthBootstrap() {
  useAuthBootstrap()
  return null
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthBootstrap />
      {children}
      <Toaster position="top-right" richColors />
      <ConfirmDialogHost />
    </QueryProvider>
  )
}
