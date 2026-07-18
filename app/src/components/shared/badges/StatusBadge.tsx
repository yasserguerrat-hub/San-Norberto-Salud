import { CheckCircle, CircleDashed, Clock, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EstadoRegistro, OrigenRegistro } from '@/types/enums'

const ESTADO_CONFIG: Record<EstadoRegistro, { label: string; icon: typeof Clock; className: string }> = {
  pendiente: { label: 'Pendiente', icon: Clock, className: 'bg-status-pending/15 text-[#8a6a12] border-status-pending/30' },
  aprobado: { label: 'Aprobado', icon: CheckCircle, className: 'bg-status-approved/12 text-status-approved border-status-approved/25' },
  rechazado: { label: 'Rechazado', icon: XCircle, className: 'bg-status-rejected/12 text-status-rejected border-status-rejected/25' },
  requiere_correccion: {
    label: 'Requiere corrección',
    icon: CircleDashed,
    className: 'bg-risk-high/12 text-risk-high border-risk-high/25',
  },
}

interface StatusBadgeProps {
  status: EstadoRegistro
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = ESTADO_CONFIG[status]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
        config.className,
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {config.label}
    </span>
  )
}

const ORIGEN_LABELS: Record<OrigenRegistro, string> = {
  manual: 'Manual',
  importado: 'Importado',
  ia: 'Investigación IA',
}

export function OrigenBadge({ origen, className }: { origen: OrigenRegistro; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground',
        className,
      )}
    >
      {ORIGEN_LABELS[origen]}
    </span>
  )
}
