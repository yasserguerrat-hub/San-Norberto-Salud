import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { EstadoValidacionPoblacion } from '@/types/enums'

const LABELS: Record<EstadoValidacionPoblacion, string> = {
  validado: 'Validado',
  pendiente: 'Pendiente',
  estimado: 'Estimado',
}

interface EstadoValidacionSelectProps {
  id?: string
  value: EstadoValidacionPoblacion
  onChange: (value: EstadoValidacionPoblacion) => void
}

export function EstadoValidacionSelect({ id, value, onChange }: EstadoValidacionSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as EstadoValidacionPoblacion)}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(LABELS).map(([v, label]) => (
          <SelectItem key={v} value={v}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function estadoValidacionLabel(value: EstadoValidacionPoblacion): string {
  return LABELS[value]
}
