import { DemoDataBadge } from '@/components/shared/badges/DemoDataBadge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCurrentProfile } from '@/features/auth/store/session.store'
import type { SelectOption } from '@/types/common.types'

interface DashboardFiltersProps {
  periodoOptions: SelectOption[]
  sectorOptions: SelectOption[]
  diseaseOptions: SelectOption[]
  periodoValue: string
  sectorValue: string
  diseaseValue: string
  onChangePeriodo: (value: string) => void
  onChangeSector: (value: string) => void
  onChangeDisease: (value: string) => void
}

export function DashboardFilters({
  periodoOptions,
  sectorOptions,
  diseaseOptions,
  periodoValue,
  sectorValue,
  diseaseValue,
  onChangePeriodo,
  onChangeSector,
  onChangeDisease,
}: DashboardFiltersProps) {
  const profile = useCurrentProfile()
  const clinicaChip = profile?.rol === 'admin_general' ? 'Clínica: Todas' : 'Clínica: la mía'

  return (
    <div className="mb-2 flex flex-wrap items-center gap-2">
      <Select value={periodoValue} onValueChange={onChangePeriodo}>
        <SelectTrigger className="bg-card text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {periodoOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sectorValue} onValueChange={onChangeSector}>
        <SelectTrigger className="bg-card text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sectorOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={diseaseValue} onValueChange={onChangeDisease}>
        <SelectTrigger className="bg-card text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {diseaseOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[11.5px] text-muted-foreground">
        {clinicaChip}
      </span>
      <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[11.5px] text-muted-foreground">
        Sexo: Todos
      </span>
      <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[11.5px] text-muted-foreground">
        Estado: Aprobados
      </span>

      <div className="ml-auto">
        <DemoDataBadge />
      </div>
    </div>
  )
}
