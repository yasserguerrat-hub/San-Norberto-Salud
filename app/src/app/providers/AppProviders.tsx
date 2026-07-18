import type { ReactNode } from 'react'
import { ConfirmDialogHost } from '@/components/shared/feedback/ConfirmDialog'
import { Toaster } from '@/components/ui/sonner'
import { QueryProvider } from './QueryProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toaster position="top-right" richColors />
      <ConfirmDialogHost />
    </QueryProvider>
  )
}
