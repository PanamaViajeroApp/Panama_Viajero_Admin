import { LuMapPinned } from 'react-icons/lu'
import { destinationFilters } from '../data/dashboardData.js'

function ProvinceFilter({ value, onChange, resultCount }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="surface-panel flex h-12 w-full max-w-sm items-center gap-3 rounded-xl px-4">
        <LuMapPinned className="h-5 w-5 shrink-0 text-brand-red" />
        <span className="sr-only">Filtrar por provincia</span>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full cursor-pointer bg-transparent text-sm font-bold text-main outline-none"
        >
          <option value="Todas">Todos los destinos</option>
          {destinationFilters.map((province) => (
            <option key={province} value={province}>{province}</option>
          ))}
        </select>
      </label>

      <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
        {resultCount} {resultCount === 1 ? 'sitio' : 'sitios'}
      </span>
    </div>
  )
}

export default ProvinceFilter
