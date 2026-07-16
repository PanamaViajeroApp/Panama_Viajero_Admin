import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LuBell,
  LuFileText,
  LuLayoutDashboard,
  LuLogOut,
  LuMapPinned,
  LuMenu,
  LuMoon,
  LuSearch,
  LuShieldCheck,
  LuSun,
  LuTrash2,
  LuUsers,
  LuX,
} from 'react-icons/lu'
import logoHorizontal from '../assets/brand/logo-horizontal.svg'
import { useAdminData } from '../context/adminDataContext.js'

const navigation = [
  {
    label: 'Principal',
    items: [{ label: 'Vista general', to: '/dashboard', icon: LuLayoutDashboard }],
  },
  {
    label: 'Contenido',
    items: [
      { label: 'Borradores', to: '/borradores', icon: LuFileText, badge: 'drafts' },
      { label: 'Sitios publicados', to: '/sitios', icon: LuMapPinned },
      { label: 'Basurero', to: '/basurero', icon: LuTrash2, badge: 'trash' },
    ],
  },
  {
    label: 'Administracion',
    items: [
      { label: 'Usuarios', to: '/usuarios', icon: LuUsers },
      { label: 'Permisos', to: '/permisos', icon: LuShieldCheck },
    ],
  },
]

const pageNames = {
  '/dashboard': 'Vista general',
  '/borradores': 'Borradores',
  '/sitios': 'Sitios publicados',
  '/basurero': 'Basurero',
  '/usuarios': 'Usuarios',
  '/permisos': 'Permisos',
}

function Sidebar({ onNavigate, draftCount, trashCount }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-24 items-center border-b border-app px-6 justify-center">
        <img className="h-15 w-auto" src={logoHorizontal} alt="Panama Viajero" />
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Navegacion principal">
        {navigation.map((group) => (
          <div key={group.label} className="mb-7">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.24em] text-muted">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const badgeValue = item.badge === 'drafts'
                  ? draftCount
                  : item.badge === 'trash'
                    ? trashCount
                    : item.badge

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-sm transition-all duration-300 ${
                        isActive
                          ? 'bg-brand-blue text-white shadow-[0_12px_28px_rgba(73,86,162,0.28)]'
                          : 'text-muted hover:bg-[var(--surface-soft)] hover:text-main'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-brand-red" />}
                        <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                        <span className="flex-1 font-bold">{item.label}</span>
                        {badgeValue !== undefined && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isActive ? 'bg-white/15 text-white' : 'bg-[var(--red-soft)] text-brand-red'
                            }`}
                          >
                            {badgeValue}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-app p-4">
        <div className="surface-raised flex items-center gap-3 rounded-2xl border border-app p-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-red text-sm font-bold text-white">
            <img src="/favicon.svg" alt="" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-main">Administrador</p>
          </div>
          <button type="button" className="rounded-lg p-2 text-muted transition hover:bg-[var(--surface-soft)] hover:text-brand-red" aria-label="Cerrar sesion">
            <LuLogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function AdminShell() {
  const location = useLocation()
  const { draftItems, trashItems } = useAdminData()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('pv-admin-theme') || 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('pv-admin-theme', theme)
  }, [theme])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="admin-grid min-h-screen text-main">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-app bg-[var(--sidebar-bg)] backdrop-blur-xl lg:block">
        <Sidebar draftCount={draftItems.length} trashCount={trashItems.length} />
      </aside>

      <div
        className={`fixed inset-0 z-50 transition lg:hidden ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          aria-label="Cerrar menu"
        />
        <aside
          className={`absolute inset-y-0 left-0 w-[min(88vw,19rem)] border-r border-app bg-[var(--sidebar-bg)] shadow-2xl transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute right-3 top-3 z-10 rounded-xl border border-app bg-[var(--surface)] p-2 text-muted"
            aria-label="Cerrar menu"
          >
            <LuX className="h-5 w-5" />
          </button>
          <Sidebar
            draftCount={draftItems.length}
            trashCount={trashItems.length}
            onNavigate={() => setMobileOpen(false)}
          />
        </aside>
      </div>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center border-b border-app bg-[color-mix(in_srgb,var(--app-bg)_84%,transparent)] px-4 backdrop-blur-xl sm:px-6 xl:px-10">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="mr-3 rounded-xl border border-app bg-[var(--surface)] p-2.5 text-main lg:hidden"
            aria-label="Abrir menu"
          >
            <LuMenu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.23em] text-brand-red">Panama Viajero</p>
            <h1 className="truncate font-display text-lg text-main sm:text-xl">
              {pageNames[location.pathname]
                || (location.pathname.startsWith('/borradores/')
                  ? 'Editar borrador'
                  : location.pathname.startsWith('/sitios/')
                    ? 'Detalle del sitio'
                    : 'Administracion')}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <label className="surface-panel hidden h-11 items-center gap-2 rounded-xl px-3 md:flex">
              <LuSearch className="h-4 w-4 text-muted" />
              <input
                type="search"
                className="w-44 bg-transparent text-sm text-main outline-none placeholder:text-muted xl:w-64"
                placeholder="Buscar en el panel"
                aria-label="Buscar en el panel"
              />
            </label>

            <button
              type="button"
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
              className="cursor-pointer surface-panel grid h-11 w-11 place-items-center rounded-xl text-muted transition hover:border-brand-blue/60 hover:text-main"
              aria-label={theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'}
            >
              {theme === 'dark' ? <LuSun className="h-5 w-5" /> : <LuMoon className="h-5 w-5" />}
            </button>

            <button type="button" className="cursor-pointer surface-panel relative grid h-11 w-11 place-items-center rounded-xl text-muted transition hover:border-brand-red/60 hover:text-main" aria-label="Notificaciones">
              <LuBell className="h-5 w-5" />
              <span className=" absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-red ring-2 ring-[var(--surface)]" />
            </button>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8 xl:px-10 xl:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminShell
