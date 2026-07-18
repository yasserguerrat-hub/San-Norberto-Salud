import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type HealthRecordFilters, healthRecordsRepository } from '@/data/repositories/healthRecords.repository'
import { queryKeys } from '@/lib/query/queryKeys'
import type { HealthRecord } from '@/types/database.types'
import type { HealthRecordFormValues } from '../schemas/health-record.schema'

export function useHealthRecords(filters?: HealthRecordFilters) {
  return useQuery({
    queryKey: queryKeys.healthRecords.list(filters),
    queryFn: () => healthRecordsRepository.list(filters),
  })
}

interface CreateRecordInput extends HealthRecordFormValues {
  creado_por: string
}

export function useCreateHealthRecord() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateRecordInput) =>
      healthRecordsRepository.create({
        alcance: input.alcance,
        clinic_id: input.alcance === 'clinica' ? (input.clinic_id ?? null) : null,
        sector_id: input.sector_id,
        disease_id: input.disease_id,
        age_range_id: input.age_range_id,
        gender_id: input.gender_id,
        mes: input.mes,
        anio: input.anio,
        cantidad_casos: input.cantidad_casos,
        estado: 'pendiente',
        origen: 'manual',
        fuente: null,
        observacion_revision: null,
        creado_por: input.creado_por,
        aprobado_por: null,
        fecha_aprobacion: null,
        creado_en: new Date().toISOString(),
        actualizado_en: new Date().toISOString(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.healthRecords.all }),
  })
}

export function useUpdateHealthRecord() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<HealthRecord> }) => healthRecordsRepository.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.healthRecords.all }),
  })
}

export function useDeleteHealthRecord() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => healthRecordsRepository.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.healthRecords.all }),
  })
}
