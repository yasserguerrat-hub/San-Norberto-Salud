import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string
  sub?: string
  icon?: LucideIcon
  className?: string
}

export function KpiCard({ label, value, sub, icon: Icon, className }: KpiCardProps) {
  return (
    <div
      className={cn(
        'rounded-[10px] border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevate-sm',
        className,
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-muted-foreground">{label}</span>
        {Icon ? <Icon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" /> : null}
      </div>
      <div className="mb-1 truncate font-heading text-[19px] font-bold text-primary-dark">{value}</div>
      {sub ? <div className="text-[11px] text-muted-foreground">{sub}</div> : null}
    </div>
  )
}
