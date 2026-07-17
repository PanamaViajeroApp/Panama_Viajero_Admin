import { useEffect, useState } from 'react'
import {
  LuCheck,
  LuEllipsisVertical,
  LuPencil,
  LuSave,
  LuShieldCheck,
  LuX,
} from 'react-icons/lu'
import { useSearchParams } from 'react-router-dom'
import { useAdminData } from '../context/adminDataContext.js'
import { permissionLabels } from '../data/dashboardData.js'

function PermissionValue({ allowed, editing, disabled, onToggle }) {
  const styles = `inline-flex min-w-[92px] items-center justify-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
    allowed
      ? 'bg-brand-blue/15 text-[#98a1f0]'
      : 'bg-brand-red/10 text-[#ef6b84]'
  }`

  if (editing) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={`${styles} cursor-pointer transition hover:ring-2 hover:ring-current/20 disabled:cursor-wait disabled:opacity-60`}
      >
        {allowed ? <LuCheck className="h-3 w-3" /> : <LuX className="h-3 w-3" />}
        {allowed ? 'Permitido' : 'Sin acceso'}
      </button>
    )
  }

  return (
    <span className={styles}>
      <span className={`h-1.5 w-1.5 rounded-full ${allowed ? 'bg-brand-blue' : 'bg-brand-red'}`} />
      {allowed ? 'Permitido' : 'Sin acceso'}
    </span>
  )
}

function PermissionsPage() {
  const [searchParams] = useSearchParams()
  const targetUsername = searchParams.get('usuario')
  const { permissionItems, updatePermissions } = useAdminData()
  const [openMenu, setOpenMenu] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [permissionDraft, setPermissionDraft] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!targetUsername) return

    const frame = requestAnimationFrame(() => {
      const targets = Array.from(document.querySelectorAll('[data-permission-user]'))
      const matchingTargets = targets.filter(
        (element) => element.dataset.permissionUser === targetUsername,
      )
      const visibleTarget = matchingTargets.find((element) => element.offsetParent !== null)

      visibleTarget?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })

    return () => cancelAnimationFrame(frame)
  }, [targetUsername])

  const togglePermission = (permissionKey) => {
    setPermissionDraft((current) => ({
      ...current,
      [permissionKey]: !current[permissionKey],
    }))
  }

  const startEditing = (permission) => {
    setEditingUser(permission.id)
    setPermissionDraft(permission)
    setOpenMenu(null)
  }

  const savePermissions = async () => {
    setSaving(true)
    const updated = await updatePermissions(editingUser, permissionDraft)
    setSaving(false)

    if (updated) {
      setEditingUser(null)
      setPermissionDraft(null)
    }
  }

  return (
    <div className="stagger-in mx-auto max-w-[1600px] space-y-6">
      <section className="glass-panel relative overflow-hidden rounded-[1.75rem] px-6 py-7 sm:px-8 sm:py-9">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand-blue/18 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-red">Control de acceso</p>
          <h2 className="mt-3 font-display text-4xl text-main sm:text-5xl">Permisos individuales</h2>
        </div>
      </section>

      {targetUsername && (
        <div className="flex items-center gap-3 rounded-2xl border border-brand-blue/30 bg-brand-blue/10 px-5 py-4">
          <LuShieldCheck className="h-5 w-5 shrink-0 text-brand-blue" />
          <p className="text-sm text-main">
            Mostrando los permisos de <strong>{targetUsername}</strong>.
          </p>
        </div>
      )}

      <section className="surface-panel overflow-visible rounded-[1.5rem]">
        <div className="hidden overflow-visible xl:block">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[25%]" />
              {permissionLabels.map(({ key }) => <col key={key} className="w-[13.5%]" />)}
              <col className="w-[7.5%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-app bg-[var(--surface-raised)]">
                <th className="rounded-tl-[1.5rem] px-4 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-muted">Usuario</th>
                {permissionLabels.map((permission) => (
                  <th key={permission.key} className="px-2 py-4 text-center text-[9px] font-bold uppercase leading-4 tracking-[0.1em] text-muted">
                    {permission.label}
                  </th>
                ))}
                <th className="rounded-tr-[1.5rem] px-2 py-4"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {permissionItems.map((permission) => {
                const isEditing = editingUser === permission.id
                const isTarget = targetUsername === permission.username
                const displayedPermission = isEditing
                  ? permissionDraft
                  : permission
                const protectedUser = permission.accountType === 'administrator'

                return (
                  <tr
                    key={permission.username}
                    data-permission-user={permission.username}
                    className={`transition ${isTarget ? 'bg-brand-blue/12' : 'hover:bg-[var(--surface-raised)]'}`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-red text-[11px] font-bold text-white">
                          {permission.username.slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-main">{permission.username}</p>
                          {isEditing && <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.13em] text-brand-red">Editando</p>}
                        </div>
                      </div>
                    </td>
                    {permissionLabels.map(({ key }) => (
                      <td key={key} className="px-1 py-4 text-center">
                        <PermissionValue
                          allowed={displayedPermission[key]}
                          editing={isEditing}
                          disabled={saving}
                          onToggle={() => togglePermission(key)}
                        />
                      </td>
                    ))}
                    <td className="relative px-2 py-4 text-center">
                      {isEditing ? (
                        <button
                          type="button"
                          disabled={saving}
                          onClick={savePermissions}
                          className="mx-auto grid h-9 w-9 cursor-pointer place-items-center rounded-lg bg-brand-blue text-white transition hover:bg-brand-blue/85 disabled:cursor-wait disabled:opacity-60"
                          aria-label={`Guardar permisos de ${permission.username}`}
                        >
                          <LuSave className="h-4 w-4" />
                        </button>
                      ) : (
                        protectedUser ? (
                          <span
                            className="mx-auto grid h-9 w-9 place-items-center text-brand-blue"
                            aria-label="Permisos protegidos"
                          >
                            <LuShieldCheck className="h-5 w-5" />
                          </span>
                        ) : (
                          <>
                          <button
                            type="button"
                            onClick={() => setOpenMenu((current) => current === permission.id ? null : permission.id)}
                            className="mx-auto grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-muted transition hover:bg-[var(--surface-soft)] hover:text-main"
                            aria-label={`Opciones de permisos de ${permission.username}`}
                            aria-expanded={openMenu === permission.id}
                          >
                            <LuEllipsisVertical className="h-5 w-5" />
                          </button>
                          {openMenu === permission.id && (
                            <div className="absolute right-2 top-14 z-20 w-48 rounded-xl border border-app bg-[var(--surface)] p-1.5 shadow-2xl">
                              <button
                                type="button"
                                onClick={() => startEditing(permission)}
                                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold text-main transition hover:bg-[var(--surface-raised)]"
                              >
                                <LuPencil className="h-4 w-4 text-brand-blue" />
                                Editar permisos
                              </button>
                            </div>
                          )}
                          </>
                        )
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-[var(--line)] xl:hidden">
          {permissionItems.map((permission) => {
            const isEditing = editingUser === permission.id
            const isTarget = targetUsername === permission.username
            const displayedPermission = isEditing
              ? permissionDraft
              : permission
            const protectedUser = permission.accountType === 'administrator'

            return (
              <article
                key={permission.username}
                data-permission-user={permission.username}
                className={`p-5 ${isTarget ? 'bg-brand-blue/12' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-red text-xs font-bold text-white">
                    {permission.username.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-main">{permission.username}</p>
                    <p className="mt-1 text-xs text-muted">{isEditing ? 'Editando permisos' : 'Permisos asignados'}</p>
                  </div>
                  <div className="relative">
                    {isEditing ? (
                      <button type="button" disabled={saving} onClick={savePermissions} className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg bg-brand-blue text-white disabled:cursor-wait disabled:opacity-60" aria-label="Guardar permisos">
                        <LuSave className="h-4 w-4" />
                      </button>
                    ) : protectedUser ? (
                      <span className="grid h-9 w-9 place-items-center text-brand-blue" aria-label="Permisos protegidos">
                        <LuShieldCheck className="h-5 w-5" />
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setOpenMenu((current) => current === permission.id ? null : permission.id)}
                          className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-muted hover:bg-[var(--surface-soft)]"
                          aria-label={`Opciones de permisos de ${permission.username}`}
                        >
                          <LuEllipsisVertical className="h-5 w-5" />
                        </button>
                        {openMenu === permission.id && (
                          <div className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-app bg-[var(--surface)] p-1.5 shadow-2xl">
                            <button type="button" onClick={() => startEditing(permission)} className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold text-main hover:bg-[var(--surface-raised)]">
                              <LuPencil className="h-4 w-4 text-brand-blue" />
                              Editar permisos
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {permissionLabels.map(({ key, label }) => (
                    <div key={key} className="rounded-xl bg-[var(--surface-raised)] p-3">
                      <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">{label}</p>
                      <PermissionValue
                        allowed={displayedPermission[key]}
                        editing={isEditing}
                        disabled={saving}
                        onToggle={() => togglePermission(key)}
                      />
                    </div>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default PermissionsPage
