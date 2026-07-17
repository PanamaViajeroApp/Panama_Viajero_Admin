import { LuArrowUpRight, LuChevronRight, LuEye, LuPencil } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import SiteCard from '../components/SiteCard.jsx'
import StatCard from '../components/StatCard.jsx'
import { useAdminData } from '../context/adminDataContext.js'
import { metrics, provinceCoverage } from '../data/dashboardData.js'

function DashboardPage() {
  const { draftItems, publishedItems, userItems } = useAdminData()
  const currentMetrics = metrics.map((metric) => {
    if (metric.label === 'Sitios publicados') return { ...metric, value: String(publishedItems.length) }
    if (metric.label === 'Borradores activos') return { ...metric, value: String(draftItems.length) }
    if (metric.label === 'Usuarios activos') return { ...metric, value: String(userItems.length) }
    return metric
  })

  return (
    <div className="stagger-in mx-auto max-w-[1500px] space-y-6">
      <section className="glass-panel relative overflow-hidden rounded-[1.75rem] px-6 py-7 sm:px-8 sm:py-9 xl:px-10">
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-brand-blue/20 blur-3xl" />
        <div className="absolute bottom-[-7rem] right-[18%] h-52 w-52 rounded-full bg-brand-red/12 blur-3xl" />
        <div className="relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-red">Panel administrativo</p>
          <h2 className="mt-3 font-display text-4xl leading-[0.95] text-main sm:text-5xl xl:text-6xl">
            Bienvenido
          </h2>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {currentMetrics.map((metric) => <StatCard key={metric.label} metric={metric} />)}
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">En edicion</p>
            <h3 className="mt-1 font-display text-2xl text-main sm:text-3xl">Borradores recientes</h3>
          </div>
          <Link to="/borradores" className="inline-flex items-center gap-2 text-xs font-bold text-muted transition hover:text-main">
            Ver todos
            <LuArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {draftItems.slice(0, 3).map((draft) => (
            <SiteCard
              key={draft.id}
              site={draft}
              basePath="/borradores"
              showSignature
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="surface-panel rounded-[1.5rem] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">Catalogo</p>
              <h3 className="mt-1 font-display text-2xl text-main">Provincias principales</h3>
            </div>
            <span className="rounded-full bg-brand-blue/15 px-3 py-1 text-xs font-bold text-[#98a1f0]">13 regiones</span>
          </div>

          <div className="mt-6 divide-y divide-[var(--line)]">
            {provinceCoverage.map((province) => (
              <div key={province.name} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <span className="font-bold text-main">{province.name}</span>
                <span className="rounded-full bg-[var(--surface-raised)] px-3 py-1 text-xs text-muted">{province.sites} sitios</span>
              </div>
            ))}
          </div>

          <Link to="/sitios" className="mt-7 flex items-center justify-between rounded-xl border border-app bg-[var(--surface-raised)] px-4 py-3 text-sm font-bold text-main transition hover:border-brand-blue/50">
            Explorar catalogo completo
            <LuChevronRight className="h-4 w-4" />
          </Link>
        </article>

        <article className="relative overflow-hidden rounded-[1.5rem] border border-brand-blue/35 bg-brand-blue px-6 py-7 text-white sm:px-8">
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border-[28px] border-white/5" />
          <div className="absolute -bottom-16 right-24 h-36 w-36 rounded-full bg-brand-red/35 blur-2xl" />
          <div className="relative flex h-full flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">Contenido centralizado</p>
              <h3 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">Gestiona textos e imagenes desde un solo lugar.</h3>
              <p className="mt-4 max-w-lg text-sm leading-6 text-white/75">El panel sincroniza sitios, usuarios y permisos con D1, y administra fondos y galerias WebP mediante R2.</p>
            </div>
            <div className="flex gap-2">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10"><LuEye className="h-5 w-5" /></span>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-red"><LuPencil className="h-5 w-5" /></span>
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}

export default DashboardPage
