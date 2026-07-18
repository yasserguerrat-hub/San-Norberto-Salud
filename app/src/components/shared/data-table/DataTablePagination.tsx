import type { Table } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const pageCount = table.getPageCount()
  if (pageCount <= 1) return null

  return (
    <div className="flex items-center justify-between gap-4 px-1">
      <p className="text-xs text-muted-foreground">
        Página {table.getState().pagination.pageIndex + 1} de {pageCount} · {table.getFilteredRowModel().rows.length}{' '}
        registros
      </p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon-sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
          <ChevronsLeft className="size-4" aria-hidden="true" />
          <span className="sr-only">Primera página</span>
        </Button>
        <Button variant="outline" size="icon-sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          <ChevronLeft className="size-4" aria-hidden="true" />
          <span className="sr-only">Página anterior</span>
        </Button>
        <Button variant="outline" size="icon-sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          <ChevronRight className="size-4" aria-hidden="true" />
          <span className="sr-only">Página siguiente</span>
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="size-4" aria-hidden="true" />
          <span className="sr-only">Última página</span>
        </Button>
      </div>
    </div>
  )
}
