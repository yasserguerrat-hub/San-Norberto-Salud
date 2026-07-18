import { Plus } from 'lucide-react'
import { useState } from 'react'
import { DemoDataBadge } from '@/components/shared/badges/DemoDataBadge'
import { toastError, toastSuccess } from '@/components/shared/feedback/ToastHelpers'
import { SectorRiskMap } from '@/components/shared/sector-map/SectorRiskMap'
import { QueryStateBoundary } from '@/components/shared/states/QueryStateBoundary'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCurrentProfile } from '@/features/auth/store/session.store'
import { useConfirm } from '@/hooks/useConfirm'
import type { Sector } from '@/types/database.types'
import { SectorDetailCard } from '../components/SectorDetailCard'
import { SectorForm } from '../components/SectorForm'
import { SectorListPanel } from '../components/SectorListPanel'
import { useCreateSector, useDeleteSector, useSectorsCatalog, useSectorsWithStats, useUpdateSector } from '../hooks/useSectors'

export function SectorsPage() {
  const profile = useCurrentProfile()
  const canManage = profile?.rol === 'admin_general'

  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Sector | undefined>(undefined)

  const sectorsQuery = useSectorsWithStats()
  const rawSectorsQuery = useSectorsCatalog()
  const createSector = useCreateSector()
  const updateSector = useUpdateSector()
  const deleteSector = useDeleteSector()
  const confirm = useConfirm()

  const handleDelete = async (sectorId: string, name: string) => {
    const confirmed = await confirm({
      title: `¿Eliminar "${name}"?`,
      description: 'Solo se puede eliminar si el sector no tiene clínicas, población ni registros estadísticos asociados.',
      confirmLabel: 'Eliminar',
      variant: 'destructive',
    })
    if (!confirmed) return
    try {
      await deleteSector.mutateAsync(sectorId)
      toastSuccess('Sector eliminado')
      setSelectedId((current) => (current === sectorId ? null : current))
    } catch (error) {
      toastError('No se pudo eliminar', error instanceof Error ? error.message : undefined)
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-[560px] text-[12.5px] leading-relaxed text-muted-foreground">
          Mapa por coordenadas de sector, coloreado según nivel de riesgo — preparado para evolucionar a polígonos GeoJSON.
        </p>
        <div className="flex items-center gap-2">
          {canManage ? (
            <Button
              size="sm"
              onClick={() => {
                setEditing(undefined)
                setDialogOpen(true)
              }}
            >
              <Plus className="size-3.5" aria-hidden="true" />
              Nuevo sector
            </Button>
          ) : null}
          <DemoDataBadge />
        </div>
      </div>

      <QueryStateBoundary query={sectorsQuery} loadingLabel="Calculando riesgo por sector…">
        {(sectors) => {
          const selected = sectors.find((s) => s.id === selectedId) ?? null
          const selectedRaw = rawSectorsQuery.data?.find((s) => s.id === selectedId)

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
                  <SectorRiskMap
                    sectors={sectors.map((s) => ({
                      id: s.id,
                      name: s.name,
                      tipo: s.tipo,
                      poblacionFmt: s.poblacionFmt,
                      tasaLabel: s.tasaLabel,
                      riskLevel: s.riesgo,
                      coordenadas: s.coordenadas,
                    }))}
                    selectedId={selectedId}
                    onSelect={(id) => setSelectedId((current) => (current === id ? null : id))}
                  />
                </div>
              </div>
              {selected ? (
                <SectorDetailCard
                  sector={selected}
                  canManage={canManage}
                  onEdit={
                    selectedRaw
                      ? () => {
                          setEditing(selectedRaw)
                          setDialogOpen(true)
                        }
                      : undefined
                  }
                  onDelete={() => handleDelete(selected.id, selected.name)}
                />
              ) : null}
            </div>
          )
        }}
      </QueryStateBoundary>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar sector' : 'Nuevo sector'}</DialogTitle>
          </DialogHeader>
          <SectorForm
            sector={editing}
            isSubmitting={createSector.isPending || updateSector.isPending}
            onCancel={() => setDialogOpen(false)}
            onSubmit={async (values) => {
              try {
                if (editing) {
                  await updateSector.mutateAsync({ id: editing.id, input: values })
                  toastSuccess('Sector actualizado')
                } else {
                  await createSector.mutateAsync(values)
                  toastSuccess('Sector creado')
                }
                setDialogOpen(false)
              } catch (error) {
                toastError('No se pudo guardar', error instanceof Error ? error.message : undefined)
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
