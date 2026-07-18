const numberFormatter = new Intl.NumberFormat('es-CL')
const decimalFormatter = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

export function formatRate(value: number): string {
  return decimalFormatter.format(value)
}

export function formatPercent(value: number, options?: { withSign?: boolean }): string {
  const formatted = decimalFormatter.format(Math.abs(value))
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  return options?.withSign === false ? `${formatted}%` : `${sign}${formatted}%`
}
