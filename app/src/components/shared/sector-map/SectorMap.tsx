import type { NivelRiesgo } from '@/types/enums'
import { SectorMapLegend } from './SectorMapLegend'
import { SectorMapTile } from './SectorMapTile'

export interface SectorMapDatum {
  id: string
  name: string
  poblacion: number
  riskLevel: NivelRiesgo
}

interface SectorMapProps {
  sectors: SectorMapDatum[]
  selectedId?: string | null
  onSelect?: (id: string) => void
}

// Mapa esquemático por tamaño de tile (RF-25): soporte inicial sin coordenadas precisas,
// preparado para evolucionar a capas GeoJSON reales (RNF-17) sin rediseñar este componente.
function scaleTileSize(poblacion: number): number {
  if (poblacion > 20000) return 150
  if (poblacion > 8000) return 120
  return 90
}

export function SectorMap({ sectors, selectedId, onSelect }: SectorMapProps) {
  return (
    <div>
      <div className="flex min-h-[340px] flex-wrap content-start gap-3.5">
        {sectors.map((sector) => (
          <SectorMapTile
            key={sector.id}
            name={sector.name}
            riskLevel={sector.riskLevel}
            sizePx={scaleTileSize(sector.poblacion)}
            selected={selectedId === sector.id}
            onClick={() => onSelect?.(sector.id)}
          />
        ))}
      </div>
      <SectorMapLegend />
    </div>
  )
}
