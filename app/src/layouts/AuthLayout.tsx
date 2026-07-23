import { ArrowLeft } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import logoUrl from '@/assets/images/logo-sannorberto.png'
import { COMUNA } from '@/app/config/constants'
import { ROUTES } from '@/app/router/routes'

const PRINCIPIOS = [
  'La plataforma trabaja exclusivamente con información estadística agregada; no almacena identificadores personales de pacientes.',
  'El acceso está restringido al equipo de San Norberto Salud y al personal autorizado de cada clínica asociada.',
  'Toda cifra publicada mantiene trazabilidad de su fuente y su fecha de aprobación.',
]

export function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col lg:flex-row">
      <div className="flex flex-col justify-between gap-10 bg-primary-dark px-10 py-12 text-white lg:w-[44%]">
        <div className="flex items-center gap-2.5">
          <img src={logoUrl} alt="" className="size-8 shrink-0 rounded-[9px] object-cover" />
          <span className="font-heading text-[15px] font-bold">
            San Norberto <span className="text-secondary">Salud</span>
          </span>
        </div>

        <div>
          <div className="mb-3 text-[11px] font-bold tracking-[0.09em] text-secondary uppercase">
            Plataforma privada de análisis estadístico sanitario
          </div>
          <h1 className="mb-6 font-heading text-[26px] leading-tight font-bold text-balance">
            Acceso exclusivo para personal autorizado de San Norberto Salud.
          </h1>
          <ul className="flex flex-col gap-4">
            {PRINCIPIOS.map((texto) => (
              <li key={texto} className="border-l-2 border-secondary/50 pl-3.5 text-[13px] leading-relaxed text-[#CFE3EC]">
                {texto}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-white/10 pt-5 text-xs leading-relaxed text-[#9FC6D6]">
          <div className="font-semibold text-[#CFE3EC]">
            Sociedad de Servicios Sociales y de Salud San Norberto Ltda.
          </div>
          <div>Comuna de {COMUNA} · Región Metropolitana · Uso interno</div>
        </div>
      </div>
      <div className="relative flex flex-1 items-center justify-center bg-muted px-6 py-12">
        <Link
          to={ROUTES.home}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Volver al inicio
        </Link>
        <Outlet />
      </div>
    </div>
  )
}
