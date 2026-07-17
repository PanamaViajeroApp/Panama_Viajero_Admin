import { useState } from 'react'
import {
  LuCloudUpload,
  LuMapPinned,
  LuX,
} from 'react-icons/lu'

const defaultMapUrl = ''

function SiteFormModal({ provinceOptions, onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [provinceId, setProvinceId] = useState(provinceOptions[0]?.id || '')
  const [zone, setZone] = useState('')
  const [isPacificRiviera, setIsPacificRiviera] = useState(false)
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [activities, setActivities] = useState('')
  const [mapUrl, setMapUrl] = useState(defaultMapUrl)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const selectedProvince = provinceOptions.find(
    (province) => province.id === provinceId,
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setSubmitError('')

    const createdDraft = await onSubmit({
      name: name.trim(),
      province: provinceId,
      zone: selectedProvince?.zoneMode === 'colon_coast' ? zone : null,
      isPacificRiviera: selectedProvince?.supportsPacificRiviera
        ? isPacificRiviera
        : false,
      location: location.trim(),
      description: description.trim(),
      activities: activities
        .split(',')
        .map((activity) => activity.trim())
        .filter(Boolean),
      mapUrl: mapUrl.trim(),
    })

    setSubmitting(false)

    if (createdDraft) {
      onClose()
    } else {
      setSubmitError('No se pudo crear el borrador. Revisa el mensaje mostrado en el panel.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 px-4 py-8 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="surface-panel mx-auto w-full max-w-4xl overflow-hidden rounded-[1.75rem] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-app p-6 sm:p-7">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">
              Flujo editorial
            </p>
            <h2 className="mt-2 font-display text-3xl text-main">
              Nuevo borrador
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-app text-muted transition hover:bg-[var(--surface-raised)] hover:text-main"
            aria-label="Cerrar formulario"
          >
            <LuX className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 p-6 sm:p-7 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-bold text-main">Nombre del sitio</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="surface-raised h-12 w-full rounded-xl border border-app px-4 text-sm text-main outline-none focus:border-brand-blue"
              placeholder="Ejemplo: Isla Escudo de Veraguas"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-bold text-main">Provincia</span>
            <select
              value={provinceId}
              onChange={(event) => {
                const nextProvince = provinceOptions.find(
                  (province) => province.id === event.target.value,
                )
                setProvinceId(event.target.value)
                if (nextProvince?.zoneMode !== 'colon_coast') setZone('')
                if (!nextProvince?.supportsPacificRiviera) {
                  setIsPacificRiviera(false)
                }
              }}
              className="surface-raised h-12 w-full cursor-pointer rounded-xl border border-app px-4 text-sm text-main outline-none focus:border-brand-blue"
            >
              {provinceOptions.map((province) => (
                <option key={province.id} value={province.id}>{province.name}</option>
              ))}
            </select>
          </label>

          {selectedProvince?.zoneMode === 'colon_coast' && (
            <label className="space-y-2 lg:col-span-2">
              <span className="text-xs font-bold text-main">Zona de Colon</span>
              <select
                required
                value={zone}
                onChange={(event) => setZone(event.target.value)}
                className="surface-raised h-12 w-full cursor-pointer rounded-xl border border-app px-4 text-sm text-main outline-none focus:border-brand-blue"
              >
                <option value="" disabled>Selecciona una zona</option>
                <option value="costa_arriba">Costa Arriba</option>
                <option value="costa_abajo">Costa Abajo</option>
              </select>
            </label>
          )}

          {selectedProvince?.supportsPacificRiviera && (
            <fieldset className="space-y-3 rounded-xl border border-app bg-[var(--surface-raised)] p-4 lg:col-span-2">
              <legend className="px-2 text-xs font-bold text-main">
                Pertenece a Riviera Pacifica
              </legend>
              <div className="flex flex-wrap gap-3">
                <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${isPacificRiviera ? 'border-brand-blue bg-brand-blue/15 text-main' : 'border-app text-muted'}`}>
                  <input
                    type="radio"
                    name="pacific-riviera"
                    checked={isPacificRiviera}
                    onChange={() => setIsPacificRiviera(true)}
                    className="accent-[#4956a2]"
                  />
                  Si
                </label>
                <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${!isPacificRiviera ? 'border-brand-blue bg-brand-blue/15 text-main' : 'border-app text-muted'}`}>
                  <input
                    type="radio"
                    name="pacific-riviera"
                    checked={!isPacificRiviera}
                    onChange={() => setIsPacificRiviera(false)}
                    className="accent-[#4956a2]"
                  />
                  No
                </label>
              </div>
            </fieldset>
          )}

          <label className="space-y-2 lg:col-span-2">
            <span className="text-xs font-bold text-main">Ubicacion</span>
            <input
              required
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="surface-raised h-12 w-full rounded-xl border border-app px-4 text-sm text-main outline-none focus:border-brand-blue"
              placeholder="Distrito, provincia"
            />
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-xs font-bold text-main">Descripcion</span>
            <textarea
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows="5"
              className="surface-raised w-full resize-none rounded-xl border border-app p-4 text-sm leading-6 text-main outline-none focus:border-brand-blue"
              placeholder="Describe la experiencia y sus principales atractivos."
            />
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-xs font-bold text-main">Actividades</span>
            <input
              value={activities}
              onChange={(event) => setActivities(event.target.value)}
              className="surface-raised h-12 w-full rounded-xl border border-app px-4 text-sm text-main outline-none focus:border-brand-blue"
              placeholder="Senderismo, fotografia, naturaleza"
            />
            <span className="block text-[11px] text-muted">Separa cada actividad con una coma.</span>
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="flex items-center gap-2 text-xs font-bold text-main">
              <LuMapPinned className="h-4 w-4 text-brand-blue" />
              URL del mapa
            </span>
            <textarea
              required
              value={mapUrl}
              onChange={(event) => setMapUrl(event.target.value)}
              rows="4"
              className="surface-raised w-full resize-none rounded-xl border border-app p-4 text-xs leading-5 text-main outline-none focus:border-brand-blue"
            />
          </label>

          <div className="space-y-2">
            <span className="text-xs font-bold text-main">Foto de fondo</span>
            <div className="grid min-h-40 place-items-center rounded-xl border border-dashed border-brand-blue/30 bg-brand-blue/6 text-center opacity-70">
              <span className="flex flex-col items-center gap-2 p-5 text-xs font-bold text-brand-blue">
                <LuCloudUpload className="h-6 w-6" />
                Disponible al conectar R2
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-main">Galeria</span>
            <div className="grid min-h-40 place-items-center rounded-xl border border-dashed border-brand-red/30 bg-brand-red/6 text-center opacity-70">
              <span className="flex flex-col items-center gap-2 p-5 text-xs font-bold text-brand-red">
                <LuCloudUpload className="h-6 w-6" />
                Disponible al conectar R2
              </span>
            </div>
          </div>

          {submitError && (
            <p className="rounded-xl border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-sm font-bold text-brand-red lg:col-span-2">
              {submitError}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-app p-6 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="h-11 cursor-pointer rounded-xl border border-app px-5 text-sm font-bold text-main">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting || !provinceId}
            className="h-11 cursor-pointer rounded-xl bg-brand-red px-5 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-65"
          >
            {submitting ? 'Creando borrador' : 'Crear borrador'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SiteFormModal
