import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { SelectOption } from '@/types/common.types'
import type { Profile } from '@/types/database.types'
import { createUserSchema, userSchema, type CreateUserFormValues } from '../schemas/user.schema'

type FormInput = z.input<typeof createUserSchema>

interface UserFormProps {
  user?: Profile
  clinicOptions: SelectOption[]
  onSubmit: (values: CreateUserFormValues) => Promise<void> | void
  onCancel: () => void
  isSubmitting?: boolean
}

export function UserForm({ user, clinicOptions, onSubmit, onCancel, isSubmitting }: UserFormProps) {
  const isCreating = !user
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInput, unknown, CreateUserFormValues>({
    resolver: zodResolver(isCreating ? createUserSchema : userSchema) as unknown as Resolver<FormInput, unknown, CreateUserFormValues>,
    defaultValues: user
      ? {
          nombre: user.nombre,
          apellido: user.apellido,
          correo: user.correo,
          rol: user.rol,
          clinic_id: user.clinic_id ?? undefined,
          puede_ver_comparaciones: user.puede_ver_comparaciones,
          estado: user.estado,
        }
      : {
          rol: 'usuario_clinica',
          puede_ver_comparaciones: false,
          estado: 'activo',
          password: '',
          confirmPassword: '',
        },
  })

  const rol = watch('rol')
  const clinicId = watch('clinic_id')
  const estado = watch('estado')
  const puedeVerComparaciones = watch('puede_ver_comparaciones')

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} noValidate className="flex flex-col gap-3.5">
      <div className="grid grid-cols-2 gap-3.5">
        <Field data-invalid={!!errors.nombre}>
          <FieldLabel htmlFor="u_nombre">Nombre</FieldLabel>
          <Input id="u_nombre" aria-invalid={!!errors.nombre} {...register('nombre')} />
          <FieldError errors={errors.nombre ? [errors.nombre] : undefined} />
        </Field>
        <Field data-invalid={!!errors.apellido}>
          <FieldLabel htmlFor="u_apellido">Apellido</FieldLabel>
          <Input id="u_apellido" aria-invalid={!!errors.apellido} {...register('apellido')} />
          <FieldError errors={errors.apellido ? [errors.apellido] : undefined} />
        </Field>
      </div>

      <Field data-invalid={!!errors.correo}>
        <FieldLabel htmlFor="u_correo">Correo institucional</FieldLabel>
        <Input id="u_correo" type="email" aria-invalid={!!errors.correo} {...register('correo')} />
        <FieldError errors={errors.correo ? [errors.correo] : undefined} />
      </Field>

      {isCreating ? (
        <div className="grid grid-cols-2 gap-3.5">
          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="u_password">Nueva contraseña</FieldLabel>
            <Input id="u_password" type="password" aria-invalid={!!errors.password} {...register('password')} />
            <FieldError errors={errors.password ? [errors.password] : undefined} />
          </Field>
          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel htmlFor="u_confirm_password">Repetir contraseña</FieldLabel>
            <Input
              id="u_confirm_password"
              type="password"
              aria-invalid={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            <FieldError errors={errors.confirmPassword ? [errors.confirmPassword] : undefined} />
          </Field>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3.5">
        <Field>
          <FieldLabel htmlFor="u_rol">Rol</FieldLabel>
          <Select value={rol} onValueChange={(v) => setValue('rol', v as CreateUserFormValues['rol'])}>
            <SelectTrigger id="u_rol" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin_general">Administrador general</SelectItem>
              <SelectItem value="usuario_clinica">Usuario de clínica</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {rol === 'usuario_clinica' ? (
          <Field data-invalid={!!errors.clinic_id}>
            <FieldLabel htmlFor="u_clinic">Clínica</FieldLabel>
            <Select value={clinicId} onValueChange={(v) => setValue('clinic_id', v, { shouldValidate: true })}>
              <SelectTrigger id="u_clinic" className="w-full">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                {clinicOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={errors.clinic_id ? [errors.clinic_id] : undefined} />
          </Field>
        ) : (
          <Field>
            <FieldLabel htmlFor="u_estado">Estado</FieldLabel>
            <Select value={estado} onValueChange={(v) => setValue('estado', v as 'activo' | 'inactivo')}>
              <SelectTrigger id="u_estado" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        )}
      </div>

      {rol === 'usuario_clinica' ? (
        <Field>
          <FieldLabel htmlFor="u_estado2">Estado</FieldLabel>
          <Select value={estado} onValueChange={(v) => setValue('estado', v as 'activo' | 'inactivo')}>
            <SelectTrigger id="u_estado2" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      ) : null}

      <Field orientation="horizontal">
        <FieldLabel htmlFor="u_comparaciones" className="flex-1">
          Puede ver comparaciones
          <FieldDescription>Habilita el acceso al módulo de Comparaciones entre clínicas o sectores.</FieldDescription>
        </FieldLabel>
        <Switch
          id="u_comparaciones"
          checked={puedeVerComparaciones}
          onCheckedChange={(checked) => setValue('puede_ver_comparaciones', checked)}
        />
      </Field>

      <div className="flex justify-end gap-2 border-t border-border pt-3.5">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : user ? 'Guardar cambios' : 'Crear usuario'}
        </Button>
      </div>
    </form>
  )
}
