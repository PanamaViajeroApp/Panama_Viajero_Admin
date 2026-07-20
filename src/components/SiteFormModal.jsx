import { useEffect, useState } from 'react'
import {
  LuCloudUpload,
  LuMapPinned,
  LuPlus,
  LuTrash2,
  LuX,
} from 'react-icons/lu'

const defaultMapUrl = ''
const maxImageBytes = 10 * 1024 * 1024
const maxGalleryImages = 30

function SiteFormModal({ provinceOptions, onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [provinceId, setProvinceId] = useState('')
  const [zone, setZone] = useState('')
  const [isPacificRiviera, setIsPacificRiviera] = useState(false)
  const [location, setLocation] = useState('')
  const [previewDescription, setPreviewDescription] = useState('')
  const [description, setDescription] = useState('')
  const [activities, setActivities] = useState([])
  const [mapUrl, setMapUrl] = useState(defaultMapUrl)
  const [bannerFile, setBannerFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [bannerPreview, setBannerPreview] = useState('')
  const [galleryPreviews, setGalleryPreviews] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const selectedProvince = provinceOptions.find(
    (province) => province.id === provinceId,
  )

  useEffect(() => {
    if (!bannerFile) {
      setBannerPreview('')
      return undefined
    }

    const previewUrl = URL.createObjectURL(bannerFile)
    setBannerPreview(previewUrl)
    return () => URL.revokeObjectURL(previewUrl)
  }, [bannerFile])

  useEffect(() => {
    const previewUrls = galleryFiles.map((file) => URL.createObjectURL(file))
    setGalleryPreviews(previewUrls)
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url))
  }, [galleryFiles])

  const validateFiles = (files, maximum) => {
    if (files.length > maximum) {
      return `Puedes seleccionar un maximo de ${maximum} imagenes.`
    }

    const invalidFormat = files.find((file) => (
      file.type !== 'image/webp'
      || !file.name.toLowerCase().endsWith('.webp')
    ))
    if (invalidFormat) return 'Solo se permiten imagenes en formato WebP.'

    const oversized = files.find((file) => file.size > maxImageBytes)
    if (oversized) return 'Cada imagen debe pesar 10 MB o menos.'

    return ''
  }

  const handleBannerChange = (event) => {
    const file = event.target.files?.[0] || null
    const error = file ? validateFiles([file], 1) : ''
    setSubmitError(error)
    setBannerFile(error ? null : file)
    if (error) event.target.value = ''
  }

  const handleGalleryChange = (event) => {
    const files = Array.from(event.target.files || [])
    const error = validateFiles(files, maxGalleryImages)
    setSubmitError(error)
    setGalleryFiles(error ? [] : files)
    if (error) event.target.value = ''
  }

  const addActivity = () => {
    setActivities((current) => [
      ...current,
      {
        localId: crypto.randomUUID(),
        name: '',
        description: '',
      },
    ])
  }

  const updateActivity = (localId, field, value) => {
    setActivities((current) => current.map((activity) => (
      activity.localId === localId
        ? { ...activity, [field]: value }
        : activity
    )))
  }

  const removeActivity = (localId) => {
    setActivities((current) => (
      current.filter((activity) => activity.localId !== localId)
    ))
  }

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
      previewDescription: previewDescription.trim(),
      description: description.trim(),
      activities: activities.map((activity) => ({
        name: activity.name.trim(),
        description: activity.description.trim(),
      })),
      mapUrl: mapUrl.trim(),
      bannerFile,
      galleryFiles,
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
              required
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
              <option value="" disabled>Selecciona una provincia</option>
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
            <span className="text-xs font-bold text-main">Descripcion inicial</span>
            <textarea
              required
              minLength="10"
              maxLength="500"
              value={previewDescription}
              onChange={(event) => setPreviewDescription(event.target.value)}
              rows="3"
              className="surface-raised w-full resize-none rounded-xl border border-app p-4 text-sm leading-6 text-main outline-none focus:border-brand-blue"
              placeholder="Texto breve que aparecera en la tarjeta del sitio."
            />
            <span className="block text-[11px] text-muted">
              Se muestra en las tarjetas. Maximo 500 caracteres.
            </span>
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-xs font-bold text-main">Descripcion completa</span>
            <textarea
              required
              minLength="10"
              maxLength="5000"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows="5"
              className="surface-raised w-full resize-none rounded-xl border border-app p-4 text-sm leading-6 text-main outline-none focus:border-brand-blue"
              placeholder="Describe ampliamente la experiencia y sus principales atractivos."
            />
          </label>

          <fieldset className="space-y-3 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <legend className="text-xs font-bold text-main">Actividades</legend>
                <p className="mt-1 text-[11px] text-muted">
                  Cada actividad tendrá su propia descripción en el sitio.
                </p>
              </div>
              <button
                type="button"
                onClick={addActivity}
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-brand-blue/35 bg-brand-blue/10 px-4 text-xs font-bold text-main transition hover:border-brand-blue"
              >
                <LuPlus className="h-4 w-4 text-brand-blue" />
                Añadir actividad
              </button>
            </div>

            {activities.length === 0 ? (
              <div className="rounded-xl border border-dashed border-app bg-[var(--surface-raised)] px-4 py-6 text-center text-xs text-muted">
                No se han añadido actividades.
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div
                    key={activity.localId}
                    className="grid gap-3 rounded-xl border border-app bg-[var(--surface-raised)] p-4 sm:grid-cols-[0.7fr_1.3fr_auto]"
                  >
                    <label className="space-y-2">
                      <span className="text-[11px] font-bold text-main">
                        Actividad {index + 1}
                      </span>
                      <input
                        required
                        maxLength="80"
                        value={activity.name}
                        onChange={(event) => updateActivity(
                          activity.localId,
                          'name',
                          event.target.value,
                        )}
                        className="h-11 w-full rounded-lg border border-app bg-[var(--surface)] px-3 text-sm text-main outline-none focus:border-brand-blue"
                        placeholder="Ejemplo: Senderismo"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-[11px] font-bold text-main">Descripción</span>
                      <textarea
                        required
                        minLength="10"
                        maxLength="1000"
                        rows="3"
                        value={activity.description}
                        onChange={(event) => updateActivity(
                          activity.localId,
                          'description',
                          event.target.value,
                        )}
                        className="w-full resize-none rounded-lg border border-app bg-[var(--surface)] p-3 text-sm leading-5 text-main outline-none focus:border-brand-blue"
                        placeholder="Describe lo que vivirá el visitante."
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => removeActivity(activity.localId)}
                      className="grid h-10 w-10 cursor-pointer place-items-center self-end rounded-lg border border-brand-red/30 text-brand-red transition hover:bg-brand-red/10 sm:mb-0.5"
                      aria-label={`Eliminar actividad ${index + 1}`}
                    >
                      <LuTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </fieldset>

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
            <label className="relative grid min-h-40 cursor-pointer place-items-center overflow-hidden rounded-xl border border-dashed border-brand-blue/40 bg-brand-blue/6 text-center transition hover:border-brand-blue">
              {bannerPreview && (
                <img
                  src={bannerPreview}
                  alt="Vista previa de foto de fondo"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              {bannerPreview && <span className="absolute inset-0 bg-black/45" />}
              <span className="relative flex flex-col items-center gap-2 p-5 text-xs font-bold text-brand-blue">
                <LuCloudUpload className="h-6 w-6" />
                {bannerFile ? 'Cambiar foto de fondo' : 'Seleccionar foto WebP'}
                <small className={bannerPreview ? 'text-white/80' : 'text-muted'}>
                  Maximo 10 MB
                </small>
              </span>
              <input
                type="file"
                accept="image/webp,.webp"
                onChange={handleBannerChange}
                className="sr-only"
              />
            </label>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-main">Galeria</span>
            <label className="grid min-h-40 cursor-pointer place-items-center rounded-xl border border-dashed border-brand-red/40 bg-brand-red/6 text-center transition hover:border-brand-red">
              <span className="flex flex-col items-center gap-2 p-5 text-xs font-bold text-brand-red">
                <LuCloudUpload className="h-6 w-6" />
                {galleryFiles.length > 0
                  ? `${galleryFiles.length} imagenes seleccionadas`
                  : 'Seleccionar galeria WebP'}
                <small className="text-muted">Hasta 30 imagenes, 10 MB cada una</small>
              </span>
              <input
                type="file"
                accept="image/webp,.webp"
                multiple
                onChange={handleGalleryChange}
                className="sr-only"
              />
            </label>
            {galleryPreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {galleryPreviews.slice(0, 8).map((preview, index) => (
                  <img
                    key={preview}
                    src={preview}
                    alt={`Vista previa ${index + 1}`}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
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
