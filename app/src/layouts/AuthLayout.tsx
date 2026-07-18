import { Outlet } from 'react-router-dom'
import logoUrl from '@/assets/images/logo-sannorberto.png'
import { COMUNA } from '@/app/config/constants'

export function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col lg:flex-row">
      <div className="flex flex-col justify-between gap-10 bg-primary-dark px-10 py-12 text-white lg:w-[42%]">
        <div className="flex items-center gap-2.5">
          <img src={logoUrl} alt="" className="size-8 shrink-0 rounded-[9px] object-cover" />
          <span className="font-heading text-[15px] font-bold">
            San Norberto <span className="text-secondary">Salud</span>
          </span>
        </div>
        <div>
          <h1 className="mb-3.5 font-heading text-2xl leading-tight font-bold">Estadística sanitaria, sin fricción.</h1>
          <ul className="flex flex-col gap-2.5 text-[13.5px] leading-snug text-[#CFE3EC]">
            <li>✓ Solo información agregada — nunca datos personales</li>
            <li>✓ Acceso exclusivo del equipo y las clínicas</li>
            <li>✓ Trazabilidad de fuentes en cada cifra</li>
          </ul>
        </div>
        <div className="text-xs text-[#9FC6D6]">Comuna de {COMUNA} · Región Metropolitana</div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12">
        <Outlet />
      </div>
    </div>
  )
}
