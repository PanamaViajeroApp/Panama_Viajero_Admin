import { useDeferredValue, useState } from 'react'
import { LuFilePlus2 } from 'react-icons/lu'
import ProvinceFilter from '../components/ProvinceFilter.jsx'
import SiteCard from '../components/SiteCard.jsx'
import SiteFormModal from '../components/SiteFormModal.jsx'
import { useAdminData } from '../context/adminDataContext.js'

function DraftsPage() {
  const { draftItems, addDraft } = useAdminData()
  const [selectedProvince, setSelectedProvince] = useState('Todas')
  const [showForm, setShowForm] = useState(false)
  const deferredProvince = useDeferredValue(selectedProvince)
  const filteredDrafts = deferredProvince === 'Todas'
    ? draftItems
    : draftItems.filter((draft) => (
      deferredProvince === 'Riviera Pacifica'
        ? draft.isPacificRiviera
        : draft.province === deferredProvince
    ))

  return (
    <div className="stagger-in mx-auto max-w-[1500px] space-y-6">
      <section className="glass-panel relative overflow-hidden rounded-[1.75rem] px-6 py-7 sm:px-8 sm:py-9">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand-blue/18 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-red">Editorial</p>
            <h2 className="mt-3 font-display text-4xl text-main sm:text-5xl">Borradores</h2>
          </div>
          <button type="button" onClick={() => setShowForm(true)} className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-red px-5 text-sm font-bold text-white shadow-[0_15px_35px_rgba(205,46,76,0.24)] transition hover:-translate-y-0.5 hover:bg-[#df3858]">
            <LuFilePlus2 className="h-4 w-4" />
            Nuevo borrador
          </button>
        </div>
      </section>

      <ProvinceFilter
        value={selectedProvince}
        onChange={setSelectedProvince}
        resultCount={filteredDrafts.length}
      />

      {filteredDrafts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {filteredDrafts.map((draft) => (
            <SiteCard
              key={draft.id}
              site={draft}
              basePath="/borradores"
              showSignature
            />
          ))}
        </div>
      ) : (
        <div className="surface-panel rounded-[1.5rem] px-6 py-16 text-center">
          <p className="font-display text-2xl text-main">No hay borradores en {selectedProvince}</p>
          <p className="mt-3 text-sm text-muted">Selecciona otra provincia o crea un nuevo borrador.</p>
        </div>
      )}

      {showForm && (
        <SiteFormModal
          fallbackImage={draftItems[0]?.image || '/favicon.svg'}
          onClose={() => setShowForm(false)}
          onSubmit={addDraft}
        />
      )}
    </div>
  )
}

export default DraftsPage
