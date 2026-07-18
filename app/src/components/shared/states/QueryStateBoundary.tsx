import type { ReactNode } from 'react'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { LoadingState } from './LoadingState'
import { NoResultsState } from './NoResultsState'

interface MinimalQueryResult<T> {
  data: T | undefined
  isLoading: boolean
  isError: boolean
  refetch: () => unknown
}

interface QueryStateBoundaryProps<T> {
  query: MinimalQueryResult<T>
  children: (data: T) => ReactNode
  isEmpty?: (data: T) => boolean
  hasActiveFilters?: boolean
  loadingLabel?: string
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
  onClearFilters?: () => void
}

/**
 * Traduce el estado de una query de TanStack Query a los "estados obligatorios" del RNF-15
 * (carga, error con reintento, vacío, sin resultados) sin reimplementarlos en cada página.
 */
export function QueryStateBoundary<T>({
  query,
  children,
  isEmpty,
  hasActiveFilters = false,
  loadingLabel,
  emptyTitle,
  emptyDescription,
  emptyAction,
  onClearFilters,
}: QueryStateBoundaryProps<T>) {
  if (query.isLoading) {
    return <LoadingState label={loadingLabel} />
  }

  if (query.isError) {
    return <ErrorState onRetry={() => query.refetch()} />
  }

  if (query.data === undefined) {
    return null
  }

  const dataIsEmpty = isEmpty
    ? isEmpty(query.data)
    : Array.isArray(query.data)
      ? query.data.length === 0
      : false

  if (dataIsEmpty) {
    if (hasActiveFilters) {
      return <NoResultsState onClearFilters={onClearFilters} />
    }
    return (
      <EmptyState
        title={emptyTitle ?? 'Todavía no hay información registrada'}
        description={emptyDescription}
        action={emptyAction}
      />
    )
  }

  return <>{children(query.data)}</>
}
