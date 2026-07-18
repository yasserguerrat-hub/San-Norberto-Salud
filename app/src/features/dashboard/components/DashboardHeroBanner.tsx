import logoUrl from '@/assets/images/logo-sannorberto.png'
import melipillaPlazaUrl from '@/assets/images/melipilla-plaza.png'

export function DashboardHeroBanner() {
  return (
    <div
      className="relative mb-4 h-[150px] overflow-hidden rounded-xl bg-cover bg-center"
      style={{ backgroundImage: `url(${melipillaPlazaUrl})` }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, rgba(18,59,82,.90) 0%, rgba(18,59,82,.55) 50%, rgba(18,59,82,.08) 100%)',
        }}
      />
      <div className="relative flex h-full items-center justify-between px-6">
        <div>
          <div className="mb-1 font-heading text-lg font-bold text-white sm:text-[19px]">Comuna de Melipilla</div>
          <div className="text-[12.5px] text-[#CFE3EC]">
            Sociedad de Servicios Sociales y de Salud San Norberto Ltda. · Región Metropolitana
          </div>
        </div>
        <div className="hidden size-11 shrink-0 rounded-[11px] bg-white p-1 sm:block">
          <img src={logoUrl} alt="" className="size-full rounded-[7px] object-cover" />
        </div>
      </div>
    </div>
  )
}
