import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  label?: string
  className?: string
}

export function LoadingState({ label = 'Cargando información…', className }: LoadingStateProps) {
  return (
    <div
      role="status"
      className={cn('flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center', className)}
    >
      <LoaderCircle className="size-6 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
