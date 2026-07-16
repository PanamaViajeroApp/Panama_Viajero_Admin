import { useDeferredValue, useState } from 'react'
import ProvinceFilter from '../components/ProvinceFilter.jsx'
import SiteCard from '../components/SiteCard.jsx'
import { useAdminData } from '../context/adminDataContext.js'

function PublishedSitesPage() {
  const { publishedItems } = useAdminData()
  const [selectedProvince, setSelectedProvince] = useState('Todas')
  const deferredProvince = useDeferredValue(selectedProvince)
  const filteredSites = deferredProvince === 'Todas'
    ? publishedItems
    : publishedItems.filter((site) => (
      deferredProvince === 'Riviera Pacifica'
        ? site.isPacificRiviera
        : site.province === deferredProvince
    ))

  return (
    <div className="stagger-in mx-auto max-w-[1500px] space-y-6">
      <section className="glass-panel relative overflow-hidden rounded-[1.75rem] px-6 py-7 sm:px-8 sm:py-9">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand-blue/18 blur-3xl" />
        <div className="relative">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-red">Catalogo nacional</p>
            <h2 className="mt-3 font-display text-4xl text-main sm:text-5xl">Sitios publicados</h2>
          </div>
        </div>
      </section>

      <ProvinceFilter
        value={selectedProvince}
        onChange={setSelectedProvince}
        resultCount={filteredSites.length}
      />

      {filteredSites.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {filteredSites.map((site) => (
            <SiteCard key={site.id} site={site} basePath="/sitios" />
          ))}
        </div>
      ) : (
        <div className="surface-panel rounded-[1.5rem] px-6 py-16 text-center">
          <p className="font-display text-2xl text-main">No hay sitios publicados en {selectedProvince}</p>
          <p className="mt-3 text-sm text-muted">Selecciona otra provincia o publica un borrador.</p>
        </div>
      )}
    </div>
  )
}

export default PublishedSitesPage
