import logoHorizontal from '../assets/brand/logo-horizontal.svg'

function AuthLayout({ eyebrow, title, description, children }) {
  return (
    <main className="admin-grid relative grid min-h-screen place-items-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-brand-red/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-brand-blue/20 blur-3xl" />

      <section className="glass-panel relative z-10 w-full max-w-md overflow-hidden rounded-[2rem]">
        <div className="h-1.5 bg-gradient-to-r from-brand-red via-[#8f426f] to-brand-blue" />
        <div className="p-7 sm:p-9">
          <img className="mb-10 h-14 w-auto" src={logoHorizontal} alt="Panama Viajero" />

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-brand-red">
            {eyebrow}
          </p>
          <h1 className="font-display text-3xl leading-tight text-main sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            {description}
          </p>

          <div className="mt-8">{children}</div>
        </div>
      </section>
    </main>
  )
}

export default AuthLayout
