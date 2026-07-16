import { useDeferredValue, useState } from 'react'
import {
  LuClock3,
  LuRotateCcw,
  LuTrash2,
  LuUserRound,
  LuX,
} from 'react-icons/lu'
import ProvinceFilter from '../components/ProvinceFilter.jsx'
import { useAdminData } from '../context/adminDataContext.js'

const dayInMilliseconds = 24 * 60 * 60 * 1000

function getRemainingDays(expiresAt) {
  return Math.max(
    0,
    Math.ceil((new Date(expiresAt).getTime() - Date.now()) / dayInMilliseconds),
  )
}

function formatDate(value) {
  return new Intl.DateTimeFormat('es-PA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function TrashPage() {
  const { trashItems, restoreSite, deleteSiteForever } = useAdminData()
  const [selectedProvince, setSelectedProvince] = useState('Todas')
  const [pendingDelete, setPendingDelete] = useState(null)
  const deferredProvince = useDeferredValue(selectedProvince)
  const filteredItems = deferredProvince === 'Todas'
    ? trashItems
    : trashItems.filter((site) => (
      deferredProvince === 'Riviera Pacifica'
        ? site.isPacificRiviera
        : site.province === deferredProvince
    ))

  return (
    <div className="stagger-in mx-auto max-w-[1500px] space-y-6">
      <section className="glass-panel relative overflow-hidden rounded-[1.75rem] px-6 py-7 sm:px-8 sm:py-9">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand-red/16 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-red">Eliminacion</p>
          <h2 className="mt-3 font-display text-4xl text-main sm:text-5xl">Basurero</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Los sitios eliminados permanecen disponibles durante 50 dias. Despues de ese plazo se eliminan automaticamente.
          </p>
        </div>
      </section>

      <ProvinceFilter
        value={selectedProvince}
        onChange={setSelectedProvince}
        resultCount={filteredItems.length}
      />

      {filteredItems.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {filteredItems.map((site) => {
            const remainingDays = getRemainingDays(site.expiresAt)

            return (
              <article key={site.id} className="surface-panel flex min-h-full flex-col overflow-hidden rounded-[1.4rem]">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={site.image} alt={site.name} className="h-full w-full object-cover opacity-65 grayscale-[35%]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute right-4 top-4 rounded-full bg-brand-red px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                    {remainingDays} dias restantes
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">
                      {site.province}
                      {site.isPacificRiviera ? ' / Riviera Pacifica' : ''}
                    </p>
                    <h3 className="mt-1 font-display text-2xl text-white">{site.name}</h3>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm leading-6 text-muted">{site.description}</p>

                  <div className="mt-5 space-y-2 rounded-xl bg-[var(--surface-raised)] p-4 text-xs text-muted">
                    <p className="flex items-center gap-2">
                      <LuUserRound className="h-4 w-4 text-brand-blue" />
                      Eliminado por <strong className="text-main">{site.deletedBy}</strong>
                    </p>
                    <p className="flex items-center gap-2">
                      <LuTrash2 className="h-4 w-4 text-brand-red" />
                      Eliminado el {formatDate(site.deletedAt)}
                    </p>
                    <p className="flex items-center gap-2">
                      <LuClock3 className="h-4 w-4 text-muted" />
                      Eliminacion automatica: {formatDate(site.expiresAt)}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => restoreSite(site.id)}
                      className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-blue px-4 text-xs font-bold text-white"
                    >
                      <LuRotateCcw className="h-4 w-4" />
                      Restaurar
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(site)}
                      className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand-red/35 bg-brand-red/10 px-4 text-xs font-bold text-brand-red"
                    >
                      <LuTrash2 className="h-4 w-4" />
                      Eliminar ahora
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="surface-panel rounded-[1.5rem] px-6 py-16 text-center">
          <p className="font-display text-2xl text-main">El basurero esta vacio</p>
          <p className="mt-3 text-sm text-muted">No hay sitios eliminados para este filtro.</p>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="surface-panel w-full max-w-md rounded-[1.5rem] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">Accion irreversible</p>
                <h3 className="mt-2 font-display text-2xl text-main">Eliminar definitivamente</h3>
              </div>
              <button type="button" onClick={() => setPendingDelete(null)} className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-muted hover:bg-[var(--surface-soft)]">
                <LuX className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-5 text-sm leading-6 text-muted">
              <strong className="text-main">{pendingDelete.name}</strong> se eliminara inmediatamente y no podra restaurarse.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setPendingDelete(null)} className="h-11 cursor-pointer rounded-xl border border-app px-4 text-sm font-bold text-main">
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteSiteForever(pendingDelete.id)
                  setPendingDelete(null)
                }}
                className="h-11 cursor-pointer rounded-xl bg-brand-red px-4 text-sm font-bold text-white"
              >
                Eliminar definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrashPage
