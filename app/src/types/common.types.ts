export interface SelectOption<T extends string = string> {
  value: T
  label: string
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface DateRange {
  from: Date | null
  to: Date | null
}

export interface PeriodoFiltro {
  mes: number | null
  anio: number
}
