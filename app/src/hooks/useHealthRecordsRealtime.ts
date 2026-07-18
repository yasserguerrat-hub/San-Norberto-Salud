import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { IS_DEMO_DATA } from '@/app/config/constants'
import { queryKeys } from '@/lib/query/queryKeys'
import { supabase } from '@/lib/supabaseClient'

// RF-16: recalcula los indicadores (dashboard, listas de registros, cola de aprobaciones) en
// cuanto cambia cualquier fila de health_records — típicamente al aprobar/rechazar en el Centro
// de Aprobaciones — sin esperar a que el usuario recargue la página (objetivo RNF-10: <5s).
export function useHealthRecordsRealtime() {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (IS_DEMO_DATA) return

    const channel = supabase
      .channel('health_records_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'health_records' }, () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.healthRecords.all })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}
