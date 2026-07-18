import { CircleAlert, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'No se pudo cargar la información',
  description = 'Ocurrió un problema de conexión. Puedes intentarlo nuevamente.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-destructive/40 bg-destructive/5 py-16 text-center',
        className,
      )}
    >
      <CircleAlert className="mb-1 size-8 text-destructive" aria-hidden="true" />
      <p className="font-heading text-sm font-semibold text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
          <RefreshCw className="size-3.5" aria-hidden="true" />
          Reintentar
        </Button>
      ) : null}
    </div>
  )
}
