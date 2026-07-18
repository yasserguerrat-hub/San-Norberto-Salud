import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NoResultsStateProps {
  title?: string
  description?: string
  onClearFilters?: () => void
  className?: string
}

export function NoResultsState({
  title = 'Sin resultados para estos filtros',
  description = 'Ajusta o limpia los filtros aplicados para ver más registros.',
  onClearFilters,
  className,
}: NoResultsStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center',
        className,
      )}
    >
      <SearchX className="mb-1 size-8 text-muted-foreground" aria-hidden="true" />
      <p className="font-heading text-sm font-semibold text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {onClearFilters ? (
        <Button variant="ghost" size="sm" className="mt-3" onClick={onClearFilters}>
          Limpiar filtros
        </Button>
      ) : null}
    </div>
  )
}
