import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/router/routes'
import kioscoUrl from '@/assets/images/melipilla-kiosco.png'
import monumentoUrl from '@/assets/images/melipilla-monumento.png'
import { Button } from '@/components/ui/button'

const PASOS = [
  { n: 1, titulo: 'Recopila', desc: 'Clínicas y sectores registran casos agregados, sin datos personales.' },
  { n: 2, titulo: 'Centraliza', desc: 'Toda la información queda en un mismo lugar, validada y sin duplicados.' },
  { n: 3, titulo: 'Analiza', desc: 'Calcula tasas por 100.000 habitantes y niveles de riesgo por sector.' },
  { n: 4, titulo: 'Decide', desc: 'Dashboards y mapas apoyan la planificación de servicios y recursos.' },
]

const INCLUYE = [
  { titulo: 'Dashboard con indicadores', desc: 'Casos, incidencia y variación mensual en un solo vistazo.', color: 'bg-primary-dark' },
  { titulo: 'Mapa de riesgo por sector', desc: 'Visualiza qué sectores concentran mayor riesgo sanitario.', color: 'bg-primary' },
  { titulo: 'Comparaciones', desc: 'Entre clínicas y entre sectores, por enfermedad y período.', color: 'bg-secondary' },
  { titulo: 'Reportes exportables', desc: 'PDF y Excel con filtros, gráficos y fuentes incluidas.', color: 'bg-risk-medium' },
]

export function LandingPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(560px_320px_at_88%_-10%,rgba(47,174,130,.12),transparent_65%),radial-gradient(520px_340px_at_8%_0%,rgba(23,107,135,.12),transparent_60%)]">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-11 px-5 py-14 lg:px-10 lg:py-16">
          <div className="min-w-[320px] flex-1">
            <div className="mb-4 text-xs font-bold tracking-[0.09em] text-secondary uppercase">
              Plataforma privada de análisis sanitario
            </div>
            <h1 className="mb-5 max-w-[760px] font-heading text-[34px] leading-[1.16] font-extrabold text-primary-dark sm:text-[44px]">
              Entendamos la salud de Melipilla, con datos.
            </h1>
            <p className="mb-7 max-w-[640px] text-[17px] leading-relaxed text-muted-foreground">
              San Norberto Salud reúne en un solo lugar las cifras de enfermedades, edades, sexo, clínicas y sectores
              de la comuna — para que cada decisión de salud se apoye en evidencia, no en suposiciones. Sin datos
              personales de pacientes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-11 px-5">
                <Link to={ROUTES.login}>Iniciar sesión →</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-5">
                <a href="#mision">Conocer el objetivo</a>
              </Button>
            </div>
          </div>
          <div className="w-full max-w-[420px] flex-none overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(18,59,82,.18)]">
            <img src={monumentoUrl} alt="Melipilla" className="h-[300px] w-full object-cover lg:h-[360px]" />
          </div>
        </div>
      </section>

      <section id="mision" className="mx-auto max-w-[1240px] px-5 py-10 lg:px-10">
        <div className="mb-2 text-[11px] font-bold tracking-[0.08em] text-secondary uppercase">Objetivo del sitio</div>
        <h2 className="mb-6 font-heading text-2xl font-bold text-primary-dark">Objetivo, misión y visión</h2>
        <div className="mb-4 rounded-xl border border-border bg-card p-6">
          <p className="max-w-[900px] text-[14.5px] leading-relaxed text-foreground">
            Plataforma web privada que centraliza, organiza y analiza la información estadística sobre enfermedades,
            padecimientos, rangos de edad, sexo o género, clínicas y sectores de la comuna de Melipilla, permitiendo
            generar indicadores, comparaciones y reportes que faciliten la planificación de servicios de salud, la
            identificación de oportunidades y la definición de acciones estratégicas por parte de San Norberto Salud.
          </p>
        </div>
        <div className="grid items-stretch gap-5 lg:grid-cols-[1fr_1.3fr]">
          <div className="min-h-[220px] overflow-hidden rounded-xl">
            <img src={kioscoUrl} alt="Melipilla" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex-1 rounded-xl border border-border bg-card p-6">
              <div className="mb-2.5 text-[13px] font-bold tracking-[0.05em] text-secondary uppercase">Misión</div>
              <p className="text-[14.5px] leading-relaxed text-foreground">
                Transformar datos sanitarios agregados de clínicas y sectores de la comuna de Melipilla en información
                confiable, clara y útil para apoyar la toma de decisiones de San Norberto Salud, optimizar la
                asignación de recursos y orientar servicios médicos que respondan de mejor manera a las necesidades
                de la población.
              </p>
            </div>
            <div className="flex-1 rounded-xl bg-primary-dark p-6">
              <div className="mb-2.5 text-[13px] font-bold tracking-[0.05em] text-secondary uppercase">Visión</div>
              <p className="text-[14.5px] leading-relaxed text-[#E8F0F3]">
                Ser una plataforma referente en análisis e inteligencia sanitaria para la comuna de Melipilla, capaz
                de identificar tendencias, riesgos y necesidades de salud mediante información segura y basada en
                evidencia, contribuyendo a mejores estrategias, servicios médicos más oportunos y una mayor calidad
                de vida para la comunidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-[1240px] px-5 py-10 lg:px-10">
        <div className="mb-2 text-[11px] font-bold tracking-[0.08em] text-secondary uppercase">Cómo funciona</div>
        <h2 className="mb-7 font-heading text-2xl font-bold text-primary-dark">De datos sueltos a decisiones informadas</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map((paso) => (
            <div
              key={paso.n}
              className="rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-elevate"
            >
              <div className="mb-3.5 flex size-[34px] items-center justify-center rounded-full bg-accent font-heading text-[15px] font-bold text-secondary">
                {paso.n}
              </div>
              <div className="mb-1.5 text-sm font-bold text-foreground">{paso.titulo}</div>
              <div className="text-[13px] leading-relaxed text-muted-foreground">{paso.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="que-incluye" className="mx-auto max-w-[1240px] px-5 py-10 pb-16 lg:px-10">
        <div className="mb-2 text-[11px] font-bold tracking-[0.08em] text-secondary uppercase">Qué incluye</div>
        <h2 className="mb-7 font-heading text-2xl font-bold text-primary-dark">Todo lo que necesita el equipo de San Norberto</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INCLUYE.map((item) => (
            <div
              key={item.titulo}
              className="rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-elevate"
            >
              <div className={`mb-3.5 size-9 rounded-[9px] ${item.color}`} aria-hidden="true" />
              <div className="mb-1.5 text-sm font-bold text-foreground">{item.titulo}</div>
              <div className="text-[13px] leading-relaxed text-muted-foreground">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
