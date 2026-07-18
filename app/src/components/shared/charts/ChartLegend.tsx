interface ChartLegendItem {
  label: string
  value: string
  color: string
}

interface ChartLegendProps {
  items: ChartLegendItem[]
}

// Leyenda directa siempre visible (nunca solo el color) — items.value ya viene formateado
// como texto ("54%", "1.204 casos", etc.), cumpliendo el requisito de etiquetado directo
// del skill dataviz para paletas categóricas de marca con croma bajo.
export function ChartLegend({ items }: ChartLegendProps) {
  return (
    <ul className="flex flex-col gap-1.5 text-xs text-foreground">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
          <span>
            {item.label} — {item.value}
          </span>
        </li>
      ))}
    </ul>
  )
}
