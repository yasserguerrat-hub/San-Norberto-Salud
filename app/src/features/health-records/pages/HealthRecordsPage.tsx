import { useQuery } from '@tanstack/react-query'
import { Plus, Upload } from 'lucide-react'
import { useState } from 'react'
import { DemoDataBadge } from '@/components/shared/badges/DemoDataBadge'
import { toastError, toastSuccess } from '@/components/shared/feedback/ToastHelpers'
import { QueryStateBoundary } from '@/components/shared/states/QueryStateBoundary'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ageRangesRepository } from '@/data/repositories/ageRanges.repository'
import { clinicsRepository } from '@/data/repositories/clinics.repository'
import { diseasesRepository } from '@/data/repositories/diseases.repository'
import { genderCategoriesRepository } from '@/data/repositories/genderCategories.repository'
import { sectorsRepository } from '@/data/repositories/sectors.repository'
import { useCurrentProfile } from '@/features/auth/store/session.store'
import { useConfirm } from '@/hooks/useConfirm'
import { queryKeys } from '@/lib/query/queryKeys'
import type { HealthRecord } from '@/types/database.types'
import { ImportRecordsDialog } from '../components/ImportRecordsDialog'
import { RecordForm } from '../components/RecordForm'
import { RecordsTable } from '../components/RecordsTable'
import { findDuplicateRecord } from '../lib/findDuplicateRecord'
import { useCreateHealthRecord, useDeleteHealthRecord, useHealthRecords, useUpdateHealthRecord } from '../hooks/useHealthRecords'
import type { HealthRecordFormValues } from '../schemas/health-record.schema'

export function HealthRecordsPage() {
  const profile = useCurrentProfile()
  const isAdmin = profile?.rol === 'admin_general'

  const [formOpen, setFormOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editing, setEditing] = useState<HealthRecord | undefined>(undefined)

  const recordsQuery = useHealthRecords({ scopedClinicId: isAdmin ? undefined : (profile?.clinic_id ?? undefined) })
  const diseasesQuery = useQuery({ queryKey: queryKeys.diseases.list(), queryFn: () => diseasesRepository.list() })
  const ageRangesQuery = useQuery({ queryKey: queryKeys.ageRanges.list(), queryFn: () => ageRangesRepository.list() })
  const gendersQuery = useQuery({ queryKey: queryKeys.genderCategories.list(), queryFn: () => genderCategoriesRepository.list() })
  const sectorsQuery = useQuery({ queryKey: queryKeys.sectors.list(), queryFn: () => sectorsRepository.list() })
  const clinicsQuery = useQuery({ queryKey: queryKeys.clinics.list(), queryFn: () => clinicsRepository.list() })

  const createRecord = useCreateHealthRecord()
  const updateRecord = useUpdateHealthRecord()
  const deleteRecord = useDeleteHealthRecord()
  const confirm = useConfirm()

  const openCreate = () => {
    setEditing(undefined)
    setFormOpen(true)
  }

  const handleSubmit = async (values: HealthRecordFormValues) => {
    if (!profile) return

    // RF-10: verificar duplicados por combinación clínica/sector, enfermedad, edad, género,
    // mes y año antes de guardar, mostrando el registro existente si hay coincidencia.
    const duplicado = findDuplicateRecord(
      { clinic_id: values.alcance === 'clinica' ? values.clinic_id : null, sector_id: values.sector_id, disease_id: values.disease_id, age_range_id: values.age_range_id, gender_id: values.gender_id, mes: values.mes, anio: values.anio },
      recordsQuery.data ?? [],
      editing?.id,
    )
    if (duplicado) {
      const confirmadoDuplicado = await confirm({
        title: 'Ya existe un registro con esta combinación',
        description: `Encontramos un registro de ${duplicado.cantidad_casos} caso(s) para el mismo período, enfermedad, edad y género (estado: ${duplicado.estado}). ¿Deseas guardar de todas formas?`,
        confirmLabel: 'Guardar de todas formas',
        variant: 'destructive',
      })
      if (!confirmadoDuplicado) return
    }

    try {
      if (editing) {
        await updateRecord.mutateAsync({
          id: editing.id,
          input: {
            ...values,
            clinic_id: values.alcance === 'clinica' ? (values.clinic_id ?? null) : null,
            estado: 'pendiente',
            aprobado_por: null,
            fecha_aprobacion: null,
            actualizado_en: new Date().toISOString(),
          },
        })
        toastSuccess('Registro actualizado', 'Vuelve a quedar pendiente de aprobación.')
      } else {
        if (!duplicado) {
          const confirmed = await confirm({
            title: '¿Guardar este registro?',
            description: 'Quedará en estado "pendiente" hasta que un administrador lo revise y apruebe.',
            confirmLabel: 'Guardar',
          })
          if (!confirmed) return
        }
        await createRecord.mutateAsync({ ...values, creado_por: profile.id })
        toastSuccess('Registro creado', 'Enviado a revisión.')
      }
      setFormOpen(false)
    } catch (error) {
      toastError('No se pudo guardar el registro', error instanceof Error ? error.message : undefined)
    }
  }

  const handleDelete = async (record: HealthRecord) => {
    const confirmed = await confirm({
      title: '¿Eliminar este registro?',
      description: 'Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      variant: 'destructive',
    })
    if (!confirmed) return
    try {
      await deleteRecord.mutateAsync(record.id)
      toastSuccess('Registro eliminado')
    } catch (error) {
      toastError('No se pudo eliminar', error instanceof Error ? error.message : undefined)
    }
  }

  const canEdit = (record: HealthRecord) => {
    if (record.estado !== 'pendiente') return false
    if (isAdmin) return true
    return record.clinic_id === profile?.clinic_id
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Todo registro nuevo o modificado queda en estado "pendiente" hasta la aprobación del administrador (RF-11).
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
            <Upload className="size-3.5" aria-hidden="true" />
            Importar
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Plus className="size-3.5" aria-hidden="true" />
            Nuevo registro
          </Button>
          <DemoDataBadge />
        </div>
      </div>

      <QueryStateBoundary query={recordsQuery} emptyTitle="Todavía no hay registros" emptyDescription="Crea el primer registro o impórtalos desde Excel/CSV.">
        {(records) => (
          <RecordsTable
            records={[...records].sort((a, b) => b.anio - a.anio || b.mes - a.mes)}
            diseases={diseasesQuery.data ?? []}
            ageRanges={ageRangesQuery.data ?? []}
            genders={gendersQuery.data ?? []}
            sectors={sectorsQuery.data ?? []}
            clinics={clinicsQuery.data ?? []}
            canEdit={canEdit}
            onEdit={(record) => {
              setEditing(record)
              setFormOpen(true)
            }}
            onDelete={handleDelete}
          />
        )}
      </QueryStateBoundary>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar registro' : 'Nuevo registro estadístico'}</DialogTitle>
          </DialogHeader>
          <RecordForm
            defaultValues={
              editing
                ? {
                    alcance: editing.alcance,
                    clinic_id: editing.clinic_id ?? undefined,
                    sector_id: editing.sector_id,
                    disease_id: editing.disease_id,
                    age_range_id: editing.age_range_id,
                    gender_id: editing.gender_id,
                    mes: editing.mes,
                    anio: editing.anio,
                    cantidad_casos: editing.cantidad_casos,
                  }
                : undefined
            }
            isSubmitting={createRecord.isPending || updateRecord.isPending}
            onCancel={() => setFormOpen(false)}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>

      <ImportRecordsDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  )
}
