import { es } from 'date-fns/locale'
import { format } from 'date-fns'

export const MESES_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
] as const

export function formatMonthYear(mes: number, anio: number): string {
  return `${MESES_ES[mes - 1]} ${anio}`
}

export function formatDate(date: Date | string): string {
  const value = typeof date === 'string' ? new Date(date) : date
  return format(value, "d 'de' MMMM 'de' yyyy", { locale: es })
}

export function formatDateShort(date: Date | string): string {
  const value = typeof date === 'string' ? new Date(date) : date
  return format(value, 'dd-MM-yyyy')
}
