import { useState } from 'react'
import { DemoDataBadge } from '@/components/shared/badges/DemoDataBadge'
import { SectorMap } from '@/components/shared/sector-map/SectorMap'
import { QueryStateBoundary } from '@/components/shared/states/QueryStateBoundary'
import { SectorDetailCard } from '../components/SectorDetailCard'
import { SectorListPanel } from '../components/SectorListPanel'
import { useSectorsWithStats } from '../hooks/useSectors'

export function SectorsPage() {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const sectorsQuery = useSectorsWithStats()

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-[560px] text-[12.5px] leading-relaxed text-muted-foreground">
          Mapa esquemático por sector (no georreferenciado con precisión) — preparado para integrar polígonos GeoJSON.
        </p>
        <DemoDataBadge />
      </div>

      <QueryStateBoundary query={sectorsQuery} loadingLabel="Calculando riesgo por sector…">
        {(sectors) => {
          const selected = sectors.find((s) => s.id === selectedId) ?? null

          return (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[300px_1fr]">
                <SectorListPanel
                  sectors={sectors}
                  search={search}
                  onSearchChange={setSearch}
                  selectedId={selectedId}
                  onSelect={(id) => setSelectedId((current) => (current === id ? null : id))}
                />
                <div className="rounded-[10px] border border-border bg-card p-5">
                  <SectorMap
                    sectors={sectors.map((s) => ({ id: s.id, name: s.name, poblacion: s.poblacion, riskLevel: s.riesgo ?? 'bajo' }))}
                    selectedId={selectedId}
                    onSelect={(id) => setSelectedId((current) => (current === id ? null : id))}
                  />
                </div>
              </div>
              {selected ? <SectorDetailCard sector={selected} /> : null}
            </div>
          )
        }}
      </QueryStateBoundary>
    </div>
  )
}
