import { LuLockKeyhole } from 'react-icons/lu'
import { useAuth } from '../context/authContext.js'

function PermissionGate({ permission, children }) {
  const { user } = useAuth()

  if (user.permissions[permission]) return children

  return (
    <div className="relative min-h-[68vh] overflow-hidden rounded-[1.75rem]">
      <div className="pointer-events-none grid gap-5 blur-[4px] opacity-35 md:grid-cols-3" aria-hidden="true">
        <div className="surface-panel h-44 rounded-[1.75rem] md:col-span-3" />
        <div className="surface-panel h-72 rounded-[1.5rem]" />
        <div className="surface-panel h-72 rounded-[1.5rem]" />
        <div className="surface-panel h-72 rounded-[1.5rem]" />
      </div>

      <div className="absolute inset-0 grid place-items-center bg-[color-mix(in_srgb,var(--app-bg)_52%,transparent)] px-5 backdrop-blur-[2px]">
        <div className="surface-panel max-w-md rounded-[1.75rem] p-8 text-center shadow-2xl">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-red/12 text-brand-red">
            <LuLockKeyhole className="h-6 w-6" />
          </span>
          <h2 className="mt-5 font-display text-3xl text-main">Acceso restringido</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            No tienes permiso para acceder a esta seccion. Un administrador puede habilitarlo desde la gestion de permisos.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PermissionGate
