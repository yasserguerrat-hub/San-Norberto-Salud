import type { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  className?: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn('text-xs font-semibold tracking-wide text-muted-foreground uppercase', className)}>
        {title}
      </div>
    )
  }

  const sorted = column.getIsSorted()

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        '-ml-2 h-7 gap-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase hover:text-foreground',
        className,
      )}
      onClick={() => column.toggleSorting(sorted === 'asc')}
    >
      {title}
      {sorted === 'asc' ? (
        <ArrowUp className="size-3.5" aria-hidden="true" />
      ) : sorted === 'desc' ? (
        <ArrowDown className="size-3.5" aria-hidden="true" />
      ) : (
        <ChevronsUpDown className="size-3.5 opacity-50" aria-hidden="true" />
      )}
    </Button>
  )
}
