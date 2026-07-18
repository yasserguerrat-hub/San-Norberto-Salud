import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatNumber } from '@/lib/formatters/number'
import { ChartTooltip } from './ChartTooltip'

export interface DoughnutChartDatum {
  label: string
  value: number
  color: string
}

interface DoughnutChartProps {
  data: DoughnutChartDatum[]
  height?: number
  valueFormatter?: (value: number) => string
}

export function DoughnutChart({ data, height = 140, valueFormatter = formatNumber }: DoughnutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius="68%"
          outerRadius="100%"
          paddingAngle={2}
          cornerRadius={3}
          stroke="none"
          isAnimationActive={false}
        >
          {data.map((entry) => (
            <Cell key={entry.label} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} />
      </PieChart>
    </ResponsiveContainer>
  )
}
