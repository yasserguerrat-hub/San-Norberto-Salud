import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { dataSourcesRepository } from '@/data/repositories/dataSources.repository'
import { percentageThresholdsRepository } from '@/data/repositories/percentageThresholds.repository'
import { riskThresholdsRepository } from '@/data/repositories/riskThresholds.repository'
import { queryKeys } from '@/lib/query/queryKeys'
import type { DataSourceFormValues } from '../schemas/dataSource.schema'
import type { PercentageThresholdFormValues } from '../schemas/percentageThreshold.schema'
import type { RiskThresholdFormValues } from '../schemas/riskThreshold.schema'

// --- Umbrales de riesgo ---
export function useRiskThresholds() {
  return useQuery({ queryKey: queryKeys.riskThresholds.list(), queryFn: () => riskThresholdsRepository.list() })
}
export function useCreateRiskThreshold() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: RiskThresholdFormValues) =>
      riskThresholdsRepository.create({
        ...input,
        disease_id: input.ambito === 'enfermedad' ? (input.disease_id ?? null) : null,
        sector_id: input.ambito === 'sector' ? (input.sector_id ?? null) : null,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.riskThresholds.all }),
  })
}
export function useUpdateRiskThreshold() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: RiskThresholdFormValues }) =>
      riskThresholdsRepository.update(id, {
        ...input,
        disease_id: input.ambito === 'enfermedad' ? (input.disease_id ?? null) : null,
        sector_id: input.ambito === 'sector' ? (input.sector_id ?? null) : null,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.riskThresholds.all }),
  })
}
export function useDeleteRiskThreshold() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => riskThresholdsRepository.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.riskThresholds.all }),
  })
}

// --- Umbrales porcentuales ---
export function usePercentageThresholds() {
  return useQuery({ queryKey: queryKeys.percentageThresholds.list(), queryFn: () => percentageThresholdsRepository.list() })
}
export function useCreatePercentageThreshold() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: PercentageThresholdFormValues) =>
      percentageThresholdsRepository.create({ ...input, disease_id: input.ambito === 'enfermedad' ? (input.disease_id ?? null) : null }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.percentageThresholds.all }),
  })
}
export function useUpdatePercentageThreshold() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: PercentageThresholdFormValues }) =>
      percentageThresholdsRepository.update(id, { ...input, disease_id: input.ambito === 'enfermedad' ? (input.disease_id ?? null) : null }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.percentageThresholds.all }),
  })
}
export function useDeletePercentageThreshold() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => percentageThresholdsRepository.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.percentageThresholds.all }),
  })
}

// --- Fuentes de datos ---
export function useDataSources() {
  return useQuery({ queryKey: queryKeys.dataSources.list(), queryFn: () => dataSourcesRepository.list() })
}
export function useCreateDataSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: DataSourceFormValues & { creado_por: string }) =>
      dataSourcesRepository.create({ ...input, creado_en: new Date().toISOString() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.dataSources.all }),
  })
}
export function useDeleteDataSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => dataSourcesRepository.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.dataSources.all }),
  })
}
