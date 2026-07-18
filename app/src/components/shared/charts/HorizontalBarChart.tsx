import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts'
import { CHART_AXIS_TEXT_COLOR, CHART_GRID_COLOR, CHART_NEUTRAL_COLOR, CHART_PRIMARY_COLOR } from '@/lib/chart-colors'
import { formatNumber } from '@/lib/formatters/number'
import { ChartTooltip } from './ChartTooltip'

export interface HorizontalBarChartDatum {
  label: string
  value: number
  /** false atenúa la barra (p. ej. cuando el filtro de enfermedad excluye esta categoría). */
  active?: boolean
}

interface HorizontalBarChartProps {
  data: HorizontalBarChartDatum[]
  height?: number
  valueFormatter?: (value: number) => string
}

export function HorizontalBarChart({ data, height = 220, valueFormatter = formatNumber }: HorizontalBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 36, bottom: 4, left: 4 }} barCategoryGap={12}>
        <CartesianGrid horizontal={false} stroke={CHART_GRID_COLOR} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: CHART_AXIS_TEXT_COLOR }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={150}
          tick={{ fontSize: 12, fill: '#173042' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={<ChartTooltip valueFormatter={valueFormatter} hideSeriesName />}
          cursor={{ fill: 'rgba(23, 107, 135, 0.06)' }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22} isAnimationActive={false}>
          {data.map((entry) => (
            <Cell key={entry.label} fill={entry.active === false ? CHART_NEUTRAL_COLOR : CHART_PRIMARY_COLOR} />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            formatter={(value: string | number | boolean | null | undefined) =>
              typeof value === 'number' ? valueFormatter(value) : (value ?? '')
            }
            style={{ fill: '#173042', fontSize: 11, fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
