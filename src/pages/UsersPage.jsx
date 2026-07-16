import { useState } from 'react'
import {
  LuEllipsisVertical,
  LuKeyRound,
  LuTrash2,
  LuUserPlus,
  LuX,
} from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import UserFormModal from '../components/UserFormModal.jsx'
import { useAdminData } from '../context/adminDataContext.js'

function UserActions({ user, isOpen, onToggle, onPermissions, onDelete }) {
  const protectedUser = user.type === 'Administrador'

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-muted transition hover:bg-[var(--surface-soft)] hover:text-main"
        aria-label={`Opciones de ${user.username}`}
        aria-expanded={isOpen}
      >
        <LuEllipsisVertical className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 z-20 w-56 overflow-hidden rounded-xl border border-app bg-[var(--surface)] p-1.5 shadow-2xl">
          <button
            type="button"
            onClick={onPermissions}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold text-main transition hover:bg-[var(--surface-raised)]"
          >
            <LuKeyRound className="h-4 w-4 text-brand-blue" />
            Administrar permisos
          </button>
          <button
            type="button"
            disabled={protectedUser}
            onClick={onDelete}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold text-brand-red transition enabled:cursor-pointer enabled:hover:bg-brand-red/10 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <LuTrash2 className="h-4 w-4" />
            {protectedUser ? 'Usuario protegido' : 'Eliminar usuario'}
          </button>
        </div>
      )}
    </div>
  )
}

function UsersPage() {
  const navigate = useNavigate()
  const { userItems, addUser, deleteUser } = useAdminData()
  const [openMenu, setOpenMenu] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const goToPermissions = (username) => {
    setOpenMenu(null)
    navigate(`/permisos?usuario=${encodeURIComponent(username)}`)
  }

  const confirmDelete = () => {
    deleteUser(pendingDelete.username)
    setPendingDelete(null)
    setOpenMenu(null)
  }

  return (
    <div className="stagger-in mx-auto max-w-[1500px] space-y-6">
      <section className="glass-panel relative overflow-hidden rounded-[1.75rem] px-6 py-7 sm:px-8 sm:py-9">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand-blue/18 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-red">Equipo interno</p>
            <h2 className="mt-3 font-display text-4xl text-main sm:text-5xl">Usuarios</h2>
          </div>
          <button type="button" onClick={() => setShowForm(true)} className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-red px-5 text-sm font-bold text-white shadow-[0_15px_35px_rgba(205,46,76,0.24)] transition hover:-translate-y-0.5 hover:bg-[#df3858]">
            <LuUserPlus className="h-4 w-4" />
            Crear usuario
          </button>
        </div>
      </section>

      <section className="surface-panel overflow-visible rounded-[1.5rem]">
        <div className="hidden overflow-visible md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-app bg-[var(--surface-raised)]">
                <th className="rounded-tl-[1.5rem] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.17em] text-muted">Usuario</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.17em] text-muted">Tipo</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.17em] text-muted">Ultimo acceso</th>
                <th className="w-20 rounded-tr-[1.5rem] px-6 py-4"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {userItems.map((user) => (
                <tr key={user.username} className="transition hover:bg-[var(--surface-raised)]">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-red text-xs font-bold text-white">
                        {user.username.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="font-bold text-main">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-muted">{user.type}</td>
                  <td className="px-6 py-5 text-sm text-muted">{user.lastAccess}</td>
                  <td className="px-6 py-5 text-right">
                    <UserActions
                      user={user}
                      isOpen={openMenu === user.username}
                      onToggle={() => setOpenMenu((current) => current === user.username ? null : user.username)}
                      onPermissions={() => goToPermissions(user.username)}
                      onDelete={() => setPendingDelete(user)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-[var(--line)] md:hidden">
          {userItems.map((user) => (
            <article key={user.username} className="flex items-start gap-3 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-red text-xs font-bold text-white">
                {user.username.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-main">{user.username}</p>
                <p className="mt-1 text-xs text-muted">{user.type}</p>
                <p className="mt-3 text-[11px] text-muted">Ultimo acceso: {user.lastAccess}</p>
              </div>
              <UserActions
                user={user}
                isOpen={openMenu === user.username}
                onToggle={() => setOpenMenu((current) => current === user.username ? null : user.username)}
                onPermissions={() => goToPermissions(user.username)}
                onDelete={() => setPendingDelete(user)}
              />
            </article>
          ))}
        </div>
      </section>

      {pendingDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="surface-panel w-full max-w-md rounded-[1.5rem] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">Confirmacion</p>
                <h3 className="mt-2 font-display text-2xl text-main">Eliminar usuario</h3>
              </div>
              <button type="button" onClick={() => setPendingDelete(null)} className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-muted hover:bg-[var(--surface-soft)]">
                <LuX className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-5 text-sm leading-6 text-muted">
              Se eliminara a <strong className="text-main">{pendingDelete.username}</strong> de esta vista.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setPendingDelete(null)} className="h-11 cursor-pointer rounded-xl border border-app px-4 text-sm font-bold text-main">
                Cancelar
              </button>
              <button type="button" onClick={confirmDelete} className="h-11 cursor-pointer rounded-xl bg-brand-red px-4 text-sm font-bold text-white">
                Eliminar usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <UserFormModal
          existingUsers={userItems}
          onClose={() => setShowForm(false)}
          onSubmit={addUser}
        />
      )}
    </div>
  )
}

export default UsersPage
