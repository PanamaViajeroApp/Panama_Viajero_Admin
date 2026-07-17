import { LuArrowUpRight, LuClock3, LuPenLine } from 'react-icons/lu'
import { Link } from 'react-router-dom'

function SiteCard({ site, basePath, showSignature = false }) {
  return (
    <Link
      to={`${basePath}/${site.id}`}
      className="group flex min-h-full flex-col overflow-hidden rounded-[1.4rem] border border-app bg-[var(--surface)] shadow-[0_20px_45px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-1 hover:border-brand-blue/55 hover:shadow-[0_28px_60px_rgba(0,0,0,0.24)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-soft)]">
        <img
          src={site.image || '/favicon.svg'}
          alt={site.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md transition group-hover:bg-brand-red">
          <LuArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">
          {site.province}
          {site.zone ? ` / ${site.zone}` : ''}
          {site.isPacificRiviera ? ' / Riviera Pacifica' : ''}
        </p>
        <h3 className="mt-2 font-display text-2xl text-main sm:text-3xl">{site.name}</h3>
        <p className="mt-4 flex-1 text-sm leading-6 text-muted">{site.description}</p>
        <p className="mt-5 text-sm font-bold italic text-brand-blue">{site.location}</p>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-app pt-4">
          {showSignature ? (
            <span className="inline-flex items-center gap-2 text-xs font-bold text-main">
              <LuPenLine className="h-4 w-4 text-brand-red" />
              Editado por {site.author}
            </span>
          ) : (
            <span className="text-xs font-bold text-main">Sitio publicado</span>
          )}
          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
            <LuClock3 className="h-3.5 w-3.5" />
            {site.updated}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default SiteCard
