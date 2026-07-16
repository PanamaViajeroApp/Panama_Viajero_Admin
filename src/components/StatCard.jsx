import { LuArrowUpRight } from 'react-icons/lu'

const toneStyles = {
  blue: {
    wash: 'from-brand-blue/18',
    text: 'text-[#8490eb]',
  },
  red: {
    wash: 'from-brand-red/16',
    text: 'text-[#ef6b84]',
  },
  neutral: {
    wash: 'from-brand-soft/8',
    text: 'text-muted',
  },
}

function StatCard({ metric }) {
  const tone = toneStyles[metric.tone]

  return (
    <article className={`surface-panel group relative overflow-hidden rounded-2xl bg-gradient-to-br ${tone.wash} to-transparent p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-blue/40`}>
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-white/5 transition-transform duration-500 group-hover:scale-125" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{metric.label}</p>
          <p className="mt-3 text-4xl font-bold text-main">{metric.value}</p>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-xl border border-app bg-[var(--surface-raised)] text-muted transition group-hover:text-main">
          <LuArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </article>
  )
}

export default StatCard
