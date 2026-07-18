import { z } from 'zod'

export const dataSourceSchema = z.object({
  institucion: z.string().min(3, 'Ingresa la institución'),
  titulo: z.string().min(3, 'Ingresa el título del documento o publicación'),
  url: z.url('Ingresa una URL válida'),
  fecha: z.string().min(1, 'Selecciona una fecha'),
  tipo: z.enum(['oficial', 'estudio', 'prensa', 'otro']),
  nivel_confianza: z.enum(['alto', 'medio', 'bajo']),
})

export type DataSourceFormValues = z.infer<typeof dataSourceSchema>

export const DATA_SOURCE_TYPE_LABELS: Record<DataSourceFormValues['tipo'], string> = {
  oficial: 'Oficial',
  estudio: 'Estudio',
  prensa: 'Prensa',
  otro: 'Otro',
}

export const CONFIDENCE_LABELS: Record<DataSourceFormValues['nivel_confianza'], string> = {
  alto: 'Alto',
  medio: 'Medio',
  bajo: 'Bajo',
}
