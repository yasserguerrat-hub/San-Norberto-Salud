import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ageRangesRepository } from '@/data/repositories/ageRanges.repository'
import { clinicsRepository } from '@/data/repositories/clinics.repository'
import { diseasesRepository } from '@/data/repositories/diseases.repository'
import { genderCategoriesRepository } from '@/data/repositories/genderCategories.repository'
import { sectorsRepository } from '@/data/repositories/sectors.repository'
import { useCurrentProfile } from '@/features/auth/store/session.store'
import { formatMonthYear } from '@/lib/formatters/date'
import { queryKeys } from '@/lib/query/queryKeys'
import { healthRecordSchema, type HealthRecordFormValues } from '../schemas/health-record.schema'

type FormInput = z.input<typeof healthRecordSchema>

interface RecordFormProps {
  defaultValues?: Partial<HealthRecordFormValues>
  onSubmit: (values: HealthRecordFormValues) => Promise<void> | void
  onCancel: () => void
  isSubmitting?: boolean
}

const MESES = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: formatMonthYear(i + 1, 2000).split(' ')[0] }))

export function RecordForm({ defaultValues, onSubmit, onCancel, isSubmitting }: RecordFormProps) {
  const profile = useCurrentProfile()
  const isAdmin = profile?.rol === 'admin_general'

  const diseasesQuery = useQuery({ queryKey: queryKeys.diseases.list(), queryFn: () => diseasesRepository.list() })
  const ageRangesQuery = useQuery({ queryKey: queryKeys.ageRanges.list(), queryFn: () => ageRangesRepository.list() })
  const gendersQuery = useQuery({ queryKey: queryKeys.genderCategories.list(), queryFn: () => genderCategoriesRepository.list() })
  const sectorsQuery = useQuery({ queryKey: queryKeys.sectors.list(), queryFn: () => sectorsRepository.list() })
  const clinicsQuery = useQuery({ queryKey: queryKeys.clinics.list(), queryFn: () => clinicsRepository.list() })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInput, unknown, HealthRecordFormValues>({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: {
      alcance: isAdmin ? 'clinica' : 'clinica',
      clinic_id: isAdmin ? undefined : (profile?.clinic_id ?? undefined),
      anio: 2026,
      mes: 6,
      cantidad_casos: 0,
      ...defaultValues,
    },
  })

  const alcance = watch('alcance')
  const clinicId = watch('clinic_id')
  const sectorId = watch('sector_id')
  const diseaseId = watch('disease_id')
  const ageRangeId = watch('age_range_id')
  const genderId = watch('gender_id')
  const mes = watch('mes')
  const anio = watch('anio')

  // Para usuario de clínica, el sector se deriva automáticamente de su clínica.
  useEffect(() => {
    if (!isAdmin && profile?.clinic_id && clinicsQuery.data) {
      const clinic = clinicsQuery.data.find((c) => c.id === profile.clinic_id)
      if (clinic) setValue('sector_id', clinic.sector_id, { shouldValidate: true })
    }
  }, [isAdmin, profile?.clinic_id, clinicsQuery.data, setValue])

  useEffect(() => {
    if (isAdmin && alcance === 'clinica' && clinicId && clinicsQuery.data) {
      const clinic = clinicsQuery.data.find((c) => c.id === clinicId)
      if (clinic) setValue('sector_id', clinic.sector_id, { shouldValidate: true })
    }
  }, [isAdmin, alcance, clinicId, clinicsQuery.data, setValue])

  const clinicOptions = clinicsQuery.data ?? []
  const sectorOptions = sectorsQuery.data ?? []

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} noValidate className="flex max-h-[70vh] flex-col gap-3.5 overflow-y-auto pr-1">
      {isAdmin ? (
        <div className="grid grid-cols-2 gap-3.5">
          <Field>
            <FieldLabel htmlFor="alcance">Alcance del registro</FieldLabel>
            <Select value={alcance} onValueChange={(v) => setValue('alcance', v as 'clinica' | 'sector')}>
              <SelectTrigger id="alcance" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clinica">Clínica</SelectItem>
                <SelectItem value="sector">Sector (consolidado)</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {alcance === 'clinica' ? (
            <Field data-invalid={!!errors.clinic_id}>
              <FieldLabel htmlFor="clinic_id">Clínica</FieldLabel>
              <Select value={clinicId} onValueChange={(v) => setValue('clinic_id', v, { shouldValidate: true })}>
                <SelectTrigger id="clinic_id" className="w-full">
                  <SelectValue placeholder="Selecciona una clínica" />
                </SelectTrigger>
                <SelectContent>
                  {clinicOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nombre_corto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={errors.clinic_id ? [errors.clinic_id] : undefined} />
            </Field>
          ) : (
            <Field data-invalid={!!errors.sector_id}>
              <FieldLabel htmlFor="sector_id">Sector</FieldLabel>
              <Select value={sectorId} onValueChange={(v) => setValue('sector_id', v, { shouldValidate: true })}>
                <SelectTrigger id="sector_id" className="w-full">
                  <SelectValue placeholder="Selecciona un sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectorOptions.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={errors.sector_id ? [errors.sector_id] : undefined} />
            </Field>
          )}
        </div>
      ) : (
        <div className="rounded-md bg-accent px-3 py-2 text-xs text-primary-dark">
          Registrando para tu clínica: {clinicOptions.find((c) => c.id === profile?.clinic_id)?.nombre_corto ?? '—'}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <Field data-invalid={!!errors.disease_id}>
          <FieldLabel htmlFor="disease_id">Enfermedad</FieldLabel>
          <Select value={diseaseId} onValueChange={(v) => setValue('disease_id', v, { shouldValidate: true })}>
            <SelectTrigger id="disease_id" className="w-full">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {(diseasesQuery.data ?? []).map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={errors.disease_id ? [errors.disease_id] : undefined} />
        </Field>

        <Field data-invalid={!!errors.age_range_id}>
          <FieldLabel htmlFor="age_range_id">Rango de edad</FieldLabel>
          <Select value={ageRangeId} onValueChange={(v) => setValue('age_range_id', v, { shouldValidate: true })}>
            <SelectTrigger id="age_range_id" className="w-full">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {(ageRangesQuery.data ?? []).map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={errors.age_range_id ? [errors.age_range_id] : undefined} />
        </Field>

        <Field data-invalid={!!errors.gender_id}>
          <FieldLabel htmlFor="gender_id">Sexo o género</FieldLabel>
          <Select value={genderId} onValueChange={(v) => setValue('gender_id', v, { shouldValidate: true })}>
            <SelectTrigger id="gender_id" className="w-full">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {(gendersQuery.data ?? []).map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={errors.gender_id ? [errors.gender_id] : undefined} />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-3.5">
        <Field data-invalid={!!errors.mes}>
          <FieldLabel htmlFor="mes">Mes</FieldLabel>
          <Select value={String(mes)} onValueChange={(v) => setValue('mes', Number(v) as never, { shouldValidate: true })}>
            <SelectTrigger id="mes" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MESES.map((m) => (
                <SelectItem key={m.value} value={String(m.value)}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={errors.mes ? [errors.mes] : undefined} />
        </Field>

        <Field data-invalid={!!errors.anio}>
          <FieldLabel htmlFor="anio">Año</FieldLabel>
          <Input
            id="anio"
            type="number"
            value={anio as number | string}
            onChange={(e) => setValue('anio', Number(e.target.value) as never, { shouldValidate: true })}
          />
          <FieldError errors={errors.anio ? [errors.anio] : undefined} />
        </Field>

        <Field data-invalid={!!errors.cantidad_casos}>
          <FieldLabel htmlFor="cantidad_casos">Cantidad de casos</FieldLabel>
          <Input id="cantidad_casos" type="number" min={0} aria-invalid={!!errors.cantidad_casos} {...register('cantidad_casos')} />
          <FieldError errors={errors.cantidad_casos ? [errors.cantidad_casos] : undefined} />
        </Field>
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-3.5">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Guardar y enviar a revisión'}
        </Button>
      </div>
    </form>
  )
}
