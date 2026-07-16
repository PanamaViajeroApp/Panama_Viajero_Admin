import { useState } from 'react'
import { LuKeyRound, LuUserPlus, LuX } from 'react-icons/lu'

function UserFormModal({ existingUsers, onClose, onSubmit }) {
  const [username, setUsername] = useState('')
  const [temporaryPassword, setTemporaryPassword] = useState('')
  const [type, setType] = useState('Usuario')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const normalizedUsername = username.trim()

    if (existingUsers.some((user) => user.username.toLowerCase() === normalizedUsername.toLowerCase())) {
      setError('Ese nombre de usuario ya existe.')
      return
    }

    onSubmit({
      username: normalizedUsername,
      temporaryPassword,
      type,
      lastAccess: 'Nunca',
      mustChangePassword: true,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/75 px-4 py-8 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="surface-panel w-full max-w-lg overflow-hidden rounded-[1.75rem] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-app p-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">Equipo interno</p>
            <h2 className="mt-2 font-display text-3xl text-main">Crear usuario</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-app text-muted" aria-label="Cerrar formulario">
            <LuX className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <label className="space-y-2">
            <span className="flex items-center gap-2 text-xs font-bold text-main">
              <LuUserPlus className="h-4 w-4 text-brand-blue" />
              Nombre de usuario
            </span>
            <input
              required
              value={username}
              onChange={(event) => {
                setUsername(event.target.value)
                setError('')
              }}
              className="surface-raised h-12 w-full rounded-xl border border-app px-4 text-sm text-main outline-none focus:border-brand-blue"
              placeholder="ejemplo.usuario"
            />
          </label>

          <label className="space-y-2">
            <span className="flex items-center gap-2 text-xs font-bold text-main">
              <LuKeyRound className="h-4 w-4 text-brand-blue" />
              Contrasena temporal
            </span>
            <input
              required
              minLength="8"
              type="password"
              value={temporaryPassword}
              onChange={(event) => setTemporaryPassword(event.target.value)}
              className="surface-raised h-12 w-full rounded-xl border border-app px-4 text-sm text-main outline-none focus:border-brand-blue"
              placeholder="Minimo 8 caracteres"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-bold text-main">Tipo de cuenta</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="surface-raised h-12 w-full cursor-pointer rounded-xl border border-app px-4 text-sm text-main outline-none focus:border-brand-blue"
            >
              <option value="Usuario">Usuario</option>
              <option value="Co-administrador">Co-administrador</option>
            </select>
          </label>

          <div className="rounded-xl border border-brand-blue/25 bg-brand-blue/10 p-4">
            <p className="text-xs leading-5 text-muted">
              El usuario debera cambiar la contrasena temporal durante su primer inicio de sesion.
            </p>
          </div>

          {error && <p className="text-sm font-bold text-brand-red">{error}</p>}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-app p-6 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="h-11 cursor-pointer rounded-xl border border-app px-5 text-sm font-bold text-main">
            Cancelar
          </button>
          <button type="submit" className="h-11 cursor-pointer rounded-xl bg-brand-red px-5 text-sm font-bold text-white">
            Crear usuario
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserFormModal
