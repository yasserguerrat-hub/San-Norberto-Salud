import { CircleCheck, OctagonAlert, Siren, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NivelRiesgo } from '@/types/enums'

// RNF-13: ningún estado de riesgo depende solo del color — siempre va acompañado de ícono y etiqueta.
const RISK_CONFIG: Record<
  NivelRiesgo,
  { label: string; icon: typeof CircleCheck; className: string }
> = {
  bajo: {
    label: 'Bajo',
    icon: CircleCheck,
    className: 'bg-risk-low/12 text-risk-low border-risk-low/25',
  },
  medio: {
    label: 'Medio',
    icon: TriangleAlert,
    className: 'bg-risk-medium/15 text-[#8a6a12] border-risk-medium/30',
  },
  alto: {
    label: 'Alto',
    icon: OctagonAlert,
    className: 'bg-risk-high/12 text-risk-high border-risk-high/25',
  },
  extremo: {
    label: 'Extremo',
    icon: Siren,
    className: 'bg-risk-extreme/12 text-risk-extreme border-risk-extreme/25',
  },
}

interface RiskBadgeProps {
  level: NivelRiesgo
  className?: string
  size?: 'sm' | 'md'
}

export function RiskBadge({ level, className, size = 'md' }: RiskBadgeProps) {
  const config = RISK_CONFIG[level]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        config.className,
        className,
      )}
    >
      <Icon className={size === 'sm' ? 'size-3' : 'size-3.5'} aria-hidden="true" />
      Riesgo {config.label}
    </span>
  )
}

export function riskSolidColorClassName(level: NivelRiesgo): string {
  return (
    {
      bajo: 'bg-risk-low text-risk-low-foreground',
      medio: 'bg-risk-medium text-risk-medium-foreground',
      alto: 'bg-risk-high text-risk-high-foreground',
      extremo: 'bg-risk-extreme text-risk-extreme-foreground',
    } satisfies Record<NivelRiesgo, string>
  )[level]
}
