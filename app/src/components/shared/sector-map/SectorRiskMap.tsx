import type { FeatureCollection } from 'geojson'
import maplibregl, { type StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useRef } from 'react'
import { RISK_COLORS, RISK_LABELS } from '@/lib/chart-colors'
import type { NivelRiesgo } from '@/types/enums'
import { SectorMapLegend } from './SectorMapLegend'

export interface SectorMapDatum {
  id: string
  name: string
  tipo: string
  poblacionFmt: string
  tasaLabel: string
  riskLevel: NivelRiesgo | null
  coordenadas: { lat: number; lng: number } | null
}

interface SectorRiskMapProps {
  sectors: SectorMapDatum[]
  selectedId?: string | null
  onSelect?: (id: string) => void
}

// Sin costo por uso ni API key (RF-25/11.1: MapLibre "agnóstico de proveedor, open source"):
// teselas raster de OpenStreetMap. En producción puede apuntarse a cualquier otro proveedor de
// teselas cambiando solo esta URL, sin tocar el resto del componente.
const OSM_STYLE: StyleSpecification = {
  version: 8,
  glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 19,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
}

const SIN_DATOS_COLOR = '#9AA5AC'
const MELIPILLA_CENTER: [number, number] = [-71.2167, -33.6833]

// El popup arma HTML por string (API de MapLibre); nombre/tipo de sector vienen del catálogo
// editable por administradores (RF-05), no de entrada pública, pero se escapan igual.
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

function toFeatureCollection(sectors: SectorMapDatum[], selectedId?: string | null): FeatureCollection {
  return {
    type: 'FeatureCollection',
    // Puntos hoy; el día que sectors.geojson tenga polígonos reales, esta misma fuente GeoJSON
    // pasa a alimentarse de esas geometrías sin rediseñar el componente (RNF-17).
    features: sectors
      .filter((s): s is SectorMapDatum & { coordenadas: { lat: number; lng: number } } => s.coordenadas !== null)
      .map((s) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [s.coordenadas.lng, s.coordenadas.lat] },
        properties: {
          id: s.id,
          name: s.name,
          tipo: s.tipo,
          poblacionFmt: s.poblacionFmt,
          tasaLabel: s.tasaLabel,
          riskLabel: s.riskLevel ? RISK_LABELS[s.riskLevel] : 'Sin datos',
          color: s.riskLevel ? RISK_COLORS[s.riskLevel] : SIN_DATOS_COLOR,
          selected: s.id === selectedId,
        },
      })),
  }
}

// RF-25: mapa real por coordenadas de sector, coloreado por nivel de riesgo (RNF-13: siempre
// con etiqueta visible además de color, vía el popup). Preparado para capas GeoJSON futuras.
export function SectorRiskMap({ sectors, selectedId, onSelect }: SectorRiskMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const popupRef = useRef<maplibregl.Popup | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_STYLE,
      center: MELIPILLA_CENTER,
      zoom: 11.5,
      attributionControl: { compact: true },
    })
    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

    const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 14 })
    popupRef.current = popup

    map.on('load', () => {
      map.addSource('sectores', { type: 'geojson', data: toFeatureCollection(sectors, selectedId) })

      map.addLayer({
        id: 'sectores-circulo',
        type: 'circle',
        source: 'sectores',
        paint: {
          'circle-radius': ['case', ['get', 'selected'], 20, 14],
          'circle-color': ['get', 'color'],
          'circle-stroke-width': ['case', ['get', 'selected'], 3, 1.5],
          'circle-stroke-color': ['case', ['get', 'selected'], '#123B52', '#FFFFFF'],
        },
      })

      map.addLayer({
        id: 'sectores-etiqueta',
        type: 'symbol',
        source: 'sectores',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-offset': [0, 1.6],
          'text-anchor': 'top',
          'text-font': ['Noto Sans Bold'],
        },
        paint: {
          'text-color': '#123B52',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 1.4,
        },
      })

      map.on('mouseenter', 'sectores-circulo', (e) => {
        map.getCanvas().style.cursor = 'pointer'
        const feature = e.features?.[0]
        if (!feature || feature.geometry.type !== 'Point') return
        const { name, tipo, poblacionFmt, tasaLabel, riskLabel } = feature.properties as Record<string, string>
        popup
          .setLngLat(feature.geometry.coordinates as [number, number])
          .setHTML(
            `<div style="font:600 12.5px Inter,sans-serif;color:#123B52;margin-bottom:2px">${escapeHtml(name)}</div>` +
              `<div style="font:12px Inter,sans-serif;color:#647784">${escapeHtml(tipo)} · ${escapeHtml(poblacionFmt)} hab.</div>` +
              `<div style="font:12px Inter,sans-serif;color:#647784">Tasa /100k: ${escapeHtml(tasaLabel)} · Riesgo ${escapeHtml(riskLabel)}</div>`,
          )
          .addTo(map)
      })
      map.on('mouseleave', 'sectores-circulo', () => {
        map.getCanvas().style.cursor = ''
        popup.remove()
      })
      map.on('click', 'sectores-circulo', (e) => {
        const id = e.features?.[0]?.properties?.id
        if (id) onSelect?.(id)
      })
    })

    return () => {
      popup.remove()
      map.remove()
      mapRef.current = null
    }
    // Solo se instancia una vez; las actualizaciones de datos se aplican en el efecto de abajo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const source = map.getSource('sectores') as maplibregl.GeoJSONSource | undefined
    source?.setData(toFeatureCollection(sectors, selectedId))
  }, [sectors, selectedId])

  return (
    <div>
      <div ref={containerRef} className="h-[400px] w-full overflow-hidden rounded-lg border border-border" />
      <SectorMapLegend />
    </div>
  )
}
