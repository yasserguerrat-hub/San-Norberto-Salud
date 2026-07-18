import { z } from 'zod'

export const diseaseSchema = z.object({
  nombre: z.string().min(3, 'Ingresa el nombre de la enfermedad o padecimiento'),
  tipo: z.enum(['enfermedad_cronica', 'enfermedad_aguda', 'padecimiento', 'otro']),
  descripcion: z.string().optional(),
  codigo_referencia: z.string().optional(),
  estado: z.enum(['activo', 'inactivo']),
})

export type DiseaseFormValues = z.infer<typeof diseaseSchema>

export const DISEASE_TYPE_LABELS: Record<DiseaseFormValues['tipo'], string> = {
  enfermedad_cronica: 'Enfermedad crónica',
  enfermedad_aguda: 'Enfermedad aguda',
  padecimiento: 'Padecimiento',
  otro: 'Otro',
}
