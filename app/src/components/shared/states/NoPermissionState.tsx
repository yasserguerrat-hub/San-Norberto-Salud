import { ShieldOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NoPermissionStateProps {
  title?: string
  description?: string
  className?: string
  fullPage?: boolean
}

export function NoPermissionState({
  title = 'No tienes permisos para ver esta sección',
  description = 'Si crees que esto es un error, contacta al administrador de San Norberto Salud.',
  className,
  fullPage = false,
}: NoPermissionStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center',
        fullPage && 'min-h-[60svh] rounded-none border-none',
        className,
      )}
    >
      <ShieldOff className="mb-1 size-8 text-muted-foreground" aria-hidden="true" />
      <p className="font-heading text-sm font-semibold text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
