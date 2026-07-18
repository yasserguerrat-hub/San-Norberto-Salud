import { FlaskConical } from 'lucide-react'
import { cn } from '@/lib/utils'

// Principio rector del PRD: todo dato de prueba debe estar claramente identificado como demo.
export function DemoDataBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-dashed border-secondary/50 bg-secondary/10 px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground',
        'text-[#1f7a58]',
        className,
      )}
      title="Estos datos son de demostración y no representan información real de pacientes ni clínicas."
    >
      <FlaskConical className="size-3.5" aria-hidden="true" />
      Datos demo
    </span>
  )
}
