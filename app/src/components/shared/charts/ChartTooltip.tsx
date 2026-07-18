import { formatNumber } from '@/lib/formatters/number'

interface ChartTooltipPayloadItem {
  name?: string
  value?: number | string
  color?: string
  payload?: Record<string, unknown>
}

interface ChartTooltipProps {
  active?: boolean
  label?: string
  payload?: ChartTooltipPayloadItem[]
  valueFormatter?: (value: number) => string
  valueSuffix?: string
  /** Oculta el nombre de la serie (p. ej. el dataKey "value") cuando el gráfico es de una sola
   * serie y la categoría ya se identifica por `label` — evita mostrar un nombre redundante. */
  hideSeriesName?: boolean
}

// Tooltip propio (no el de Chart.js del prototipo) pero mismo lenguaje visual: fondo azul
// oscuro, esquinas redondeadas, valor en primer plano y etiqueta secundaria (interaction.md:
// "los valores lideran, las etiquetas siguen").
export function ChartTooltip({ active, label, payload, valueFormatter = formatNumber, valueSuffix, hideSeriesName }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg bg-primary-dark px-3 py-2 text-xs shadow-elevate">
      {label ? <p className="mb-1 font-medium text-white/70">{label}</p> : null}
      <div className="flex flex-col gap-1">
        {payload.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {item.color ? (
              <span className="h-[2px] w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
            ) : null}
            <span className="font-semibold text-white">
              {typeof item.value === 'number' ? valueFormatter(item.value) : item.value}
              {valueSuffix ?? ''}
            </span>
            {item.name && !hideSeriesName ? <span className="text-white/70">{item.name}</span> : null}
          </div>
        ))}
      </div>
    </div>
  )
}
