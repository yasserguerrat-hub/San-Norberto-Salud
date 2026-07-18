import { z } from 'zod'

const optionalCoordinate = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
  z.number().optional(),
)

export const sectorSchema = z
  .object({
    nombre: z.string().min(2, 'Ingresa el nombre del sector'),
    tipo: z.enum(['urbano', 'rural']),
    descripcion: z.string().optional(),
    lat: optionalCoordinate,
    lng: optionalCoordinate,
    estado: z.enum(['activo', 'inactivo']),
  })
  .refine((data) => (data.lat === undefined) === (data.lng === undefined), {
    message: 'Completa latitud y longitud, o deja ambas vacías',
    path: ['lng'],
  })

export type SectorFormValues = z.infer<typeof sectorSchema>

export const SECTOR_TYPE_LABELS: Record<SectorFormValues['tipo'], string> = {
  urbano: 'Urbano',
  rural: 'Rural',
}
