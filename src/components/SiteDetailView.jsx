import { useState } from 'react'
import {
  LuArrowLeft,
  LuCloudUpload,
  LuImage,
  LuLink,
  LuMapPin,
  LuMapPinned,
  LuPencil,
  LuPlus,
  LuRefreshCw,
  LuSave,
  LuSend,
  LuTrash2,
  LuX,
} from 'react-icons/lu'
import { Link } from 'react-router-dom'

function SiteDetailView({
  site,
  editable = false,
  provinceOptions = [],
  onSave,
  onPublish,
  onDelete,
  onUploadImage,
  onDeleteImage,
}) {
  const backPath = editable ? '/borradores' : '/sitios'
  const [isEditing, setIsEditing] = useState(editable)
  const [name, setName] = useState(site.name)
  const [provinceId, setProvinceId] = useState(site.provinceId || '')
  const [zone, setZone] = useState(site.zoneKey || '')
  const [isPacificRiviera, setIsPacificRiviera] = useState(
    Boolean(site.isPacificRiviera),
  )
  const [location, setLocation] = useState(site.location)
  const [previewDescription, setPreviewDescription] = useState(
    site.previewDescription || site.description,
  )
  const [description, setDescription] = useState(site.description)
  const [activities, setActivities] = useState(site.activities)
  const [newActivity, setNewActivity] = useState('')
  const [newActivityDescription, setNewActivityDescription] = useState('')
  const [showActivityInput, setShowActivityInput] = useState(false)
  const [mapUrl, setMapUrl] = useState(site.mapUrl)
  const [mapPreviewUrl, setMapPreviewUrl] = useState(site.mapUrl)
  const [showPublishConfirm, setShowPublishConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [actionPending, setActionPending] = useState(false)
  const [imagePending, setImagePending] = useState(false)
  const [imageError, setImageError] = useState('')
  const selectedProvince = provinceOptions.find(
    (province) => province.id === provinceId,
  )
  const destinationSelectionInvalid = editable && (
    !provinceId
    || (selectedProvince?.zoneMode === 'colon_coast' && !zone)
  )

  const getUpdates = () => ({
    name: name.trim(),
    province: provinceId,
    zone: selectedProvince?.zoneMode === 'colon_coast' ? zone : null,
    isPacificRiviera: selectedProvince?.supportsPacificRiviera
      ? isPacificRiviera
      : false,
    location: location.trim(),
    previewDescription: previewDescription.trim(),
    description: description.trim(),
    activities,
    mapUrl: mapUrl.trim(),
  })

  const handlePrimaryAction = async () => {
    if (!isEditing) {
      setIsEditing(true)
      return
    }

    setActionPending(true)
    setMapPreviewUrl(mapUrl)
    const savedSite = await onSave?.(getUpdates())
    setActionPending(false)

    if (!editable && savedSite) {
      setIsEditing(false)
    }
  }

  const handlePublish = async () => {
    setActionPending(true)
    const publishedSite = await onPublish?.(getUpdates())
    setActionPending(false)

    if (publishedSite) {
      setShowPublishConfirm(false)
    }
  }

  const handleDelete = async () => {
    setActionPending(true)
    const deletedSite = await onDelete?.()
    setActionPending(false)

    if (deletedSite) {
      setShowDeleteConfirm(false)
    }
  }

  const addActivity = () => {
    const name = newActivity.trim()
    const activityDescription = newActivityDescription.trim()

    if (
      !name
      || activityDescription.length < 10
      || activities.some((activity) => (
        activity.name.toLowerCase() === name.toLowerCase()
      ))
    ) return

    setActivities((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name,
        description: activityDescription,
      },
    ])
    setNewActivity('')
    setNewActivityDescription('')
    setShowActivityInput(false)
  }

  const updateActivity = (activityId, field, value) => {
    setActivities((current) => current.map((activity) => (
      activity.id === activityId
        ? { ...activity, [field]: value }
        : activity
    )))
  }

  const removeActivity = (activityId) => {
    setActivities((current) => (
      current.filter((activity) => activity.id !== activityId)
    ))
  }

  const validateImageFiles = (files, maximum = 30) => {
    if (files.length > maximum) {
      return `Puedes seleccionar un maximo de ${maximum} imagenes.`
    }
    if (files.some((file) => (
      file.type !== 'image/webp'
      || !file.name.toLowerCase().endsWith('.webp')
    ))) {
      return 'Solo se permiten imagenes WebP.'
    }
    if (files.some((file) => file.size > 10 * 1024 * 1024)) {
      return 'Cada imagen debe pesar 10 MB o menos.'
    }
    return ''
  }

  const uploadImages = async (event, imageType) => {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (files.length === 0) return

    const error = validateImageFiles(files, imageType === 'banner' ? 1 : 30)
    if (error) {
      setImageError(error)
      return
    }

    setImagePending(true)
    setImageError('')

    for (let index = 0; index < files.length; index += 1) {
      const result = await onUploadImage?.(
        files[index],
        imageType,
        site.galleryItems.length + index,
      )
      if (!result) {
        setImageError('No se pudieron subir todas las imagenes.')
        break
      }
    }

    setImagePending(false)
  }

  const deleteGalleryImage = async (imageId) => {
    setImagePending(true)
    setImageError('')
    const result = await onDeleteImage?.(imageId)
    if (!result) setImageError('No se pudo eliminar la imagen.')
    setImagePending(false)
  }

  return (
    <div className="stagger-in mx-auto max-w-[1250px] space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link to={backPath} className="inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-main">
          <LuArrowLeft className="h-4 w-4" />
          Volver a {editable ? 'borradores' : 'sitios publicados'}
        </Link>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={actionPending || destinationSelectionInvalid}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-brand-red px-5 text-sm font-bold text-white transition hover:bg-[#df3858] disabled:cursor-wait disabled:opacity-65"
          >
            {isEditing ? <LuSave className="h-4 w-4" /> : <LuPencil className="h-4 w-4" />}
            {isEditing ? 'Guardar cambios' : 'Editar sitio'}
          </button>

          {editable && (
            <button
              type="button"
              onClick={() => setShowPublishConfirm(true)}
              disabled={actionPending || destinationSelectionInvalid}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-brand-blue px-5 text-sm font-bold text-white transition hover:bg-brand-blue/85"
            >
              <LuSend className="h-4 w-4" />
              Publicar borrador
            </button>
          )}

          {!editable && onDelete && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={actionPending}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-brand-red/35 bg-brand-red/10 px-5 text-sm font-bold text-brand-red transition hover:bg-brand-red/15"
            >
              <LuTrash2 className="h-4 w-4" />
              Eliminar sitio
            </button>
          )}
        </div>
      </div>

      <section className="surface-panel overflow-hidden rounded-[1.75rem]">
        <div className="relative aspect-[21/8] min-h-72 overflow-hidden">
          <img src={site.image || '/favicon.svg'} alt={name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
          {isEditing && onUploadImage && (
            <label className="absolute right-5 top-5 z-10 inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-black/55 px-4 text-xs font-bold text-white backdrop-blur-md transition hover:bg-black/70">
              <LuCloudUpload className="h-4 w-4" />
              {imagePending ? 'Subiendo' : 'Cambiar fondo'}
              <input
                type="file"
                accept="image/webp,.webp"
                disabled={imagePending}
                onChange={(event) => uploadImages(event, 'banner')}
                className="sr-only"
              />
            </label>
          )}
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              {editable ? 'Borrador de sitio' : 'Sitio publicado'}
            </p>
            {site.zone && (
              <span className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                Colon / {site.zone}
              </span>
            )}
            {site.isPacificRiviera && (
              <span className="mt-3 ml-2 inline-flex rounded-full bg-brand-blue/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                Riviera Pacifica
              </span>
            )}

            {isEditing ? (
              <label className="mt-2 flex max-w-3xl items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md">
                  <LuPencil className="h-4 w-4" />
                </span>
                <span className="sr-only">Nombre del sitio</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="min-w-0 flex-1 border-b border-white/35 bg-transparent py-1 font-display text-4xl text-white outline-none focus:border-brand-red sm:text-5xl"
                />
              </label>
            ) : (
              <div className="mt-2 flex items-center gap-3">
                <h2 className="font-display text-4xl text-white sm:text-5xl">{name}</h2>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/12 text-white/70" title="Presiona Editar sitio para modificar el titulo">
                  <LuPencil className="h-4 w-4" />
                </span>
              </div>
            )}

            {isEditing ? (
              <label className="mt-4 flex max-w-2xl items-center gap-2 text-white/85">
                <LuMapPin className="h-4 w-4 shrink-0" />
                <span className="sr-only">Ubicacion del sitio</span>
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="min-w-0 flex-1 border-b border-white/30 bg-transparent py-1 text-sm font-bold outline-none focus:border-brand-red"
                />
                <LuPencil className="h-3.5 w-3.5 shrink-0" />
              </label>
            ) : (
              <p className="mt-3 flex items-center gap-2 text-sm font-bold text-white/80">
                <LuMapPin className="h-4 w-4" />
                {location}
                <LuPencil className="h-3.5 w-3.5 text-white/55" />
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-7">
            {editable && (
              <section className="rounded-2xl border border-app bg-[var(--surface-raised)] p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">
                  Provincia
                </p>
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
                  className="mt-4 h-12 w-full cursor-pointer rounded-xl border border-app bg-[var(--surface)] px-4 text-sm font-bold text-main outline-none focus:border-brand-blue"
                >
                  <option value="" disabled>Selecciona una provincia</option>
                  {provinceOptions.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>

                {selectedProvince?.zoneMode === 'colon_coast' && (
                  <label className="mt-4 block space-y-2">
                    <span className="text-xs font-bold text-main">
                      Zona de Colon
                    </span>
                    <select
                      required
                      value={zone}
                      onChange={(event) => setZone(event.target.value)}
                      className="h-12 w-full cursor-pointer rounded-xl border border-app bg-[var(--surface)] px-4 text-sm text-main outline-none focus:border-brand-blue"
                    >
                      <option value="" disabled>Selecciona una zona</option>
                      <option value="costa_arriba">Costa Arriba</option>
                      <option value="costa_abajo">Costa Abajo</option>
                    </select>
                  </label>
                )}

                {selectedProvince?.supportsPacificRiviera && (
                  <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-app bg-[var(--surface)] p-4 text-sm font-bold text-main">
                    <input
                      type="checkbox"
                      checked={isPacificRiviera}
                      onChange={(event) => setIsPacificRiviera(event.target.checked)}
                      className="h-4 w-4 accent-[#4956a2]"
                    />
                    Pertenece a Riviera Pacifica
                  </label>
                )}
              </section>
            )}

            <section className="rounded-2xl border border-app bg-[var(--surface-raised)] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-blue">Descripcion inicial</p>
              {isEditing ? (
                <textarea
                  value={previewDescription}
                  onChange={(event) => setPreviewDescription(event.target.value)}
                  minLength="10"
                  maxLength="500"
                  rows="3"
                  className="mt-4 w-full resize-none bg-transparent text-sm leading-7 text-main outline-none"
                />
              ) : (
                <p className="mt-4 text-sm leading-7 text-muted">{previewDescription}</p>
              )}
            </section>

            <section className="rounded-2xl border border-app bg-[var(--surface-raised)] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">Descripcion completa</p>
              {isEditing ? (
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows="6"
                  className="mt-4 w-full resize-none bg-transparent text-sm leading-7 text-main outline-none"
                />
              ) : (
                <p className="mt-4 text-sm leading-7 text-muted">{description}</p>
              )}
            </section>

            <section>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">Actividades</p>
                <button
                  type="button"
                  disabled={!isEditing}
                  onClick={() => setShowActivityInput(true)}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-brand-blue/35 bg-brand-blue/10 px-3 text-xs font-bold text-main transition enabled:cursor-pointer enabled:hover:border-brand-blue disabled:cursor-not-allowed disabled:opacity-45"
                  title={!isEditing ? 'Presiona Editar sitio para anadir actividades' : undefined}
                >
                  <LuPlus className="h-4 w-4 text-brand-blue" />
                  Anadir actividad
                </button>
              </div>

              {showActivityInput && isEditing && (
                <div className="mt-4 grid gap-3 rounded-xl border border-app bg-[var(--surface-raised)] p-4 sm:grid-cols-[0.7fr_1.3fr_auto]">
                  <input
                    value={newActivity}
                    onChange={(event) => setNewActivity(event.target.value)}
                    className="h-10 min-w-0 flex-1 rounded-lg border border-app bg-[var(--surface)] px-3 text-sm text-main outline-none focus:border-brand-blue"
                    placeholder="Nombre de la actividad"
                    autoFocus
                  />
                  <textarea
                    value={newActivityDescription}
                    onChange={(event) => setNewActivityDescription(event.target.value)}
                    rows="3"
                    maxLength="1000"
                    className="min-w-0 resize-none rounded-lg border border-app bg-[var(--surface)] p-3 text-sm leading-5 text-main outline-none focus:border-brand-blue"
                    placeholder="Descripción de la actividad"
                  />
                  <div className="flex gap-2 sm:flex-col">
                    <button
                      type="button"
                      onClick={addActivity}
                      disabled={!newActivity.trim() || newActivityDescription.trim().length < 10}
                      className="h-10 cursor-pointer rounded-lg bg-brand-blue px-4 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
                    >
                    Agregar
                    </button>
                    <button type="button" onClick={() => setShowActivityInput(false)} className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg border border-app text-muted">
                      <LuX className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {activities.map((activity) => (
                  <article
                    key={activity.id}
                    className="rounded-xl border border-brand-blue/25 bg-brand-blue/8 p-4"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          value={activity.name}
                          maxLength="80"
                          onChange={(event) => updateActivity(
                            activity.id,
                            'name',
                            event.target.value,
                          )}
                          className="h-10 w-full rounded-lg border border-app bg-[var(--surface)] px-3 text-sm font-bold text-main outline-none focus:border-brand-blue"
                        />
                        <textarea
                          value={activity.description}
                          maxLength="1000"
                          rows="4"
                          onChange={(event) => updateActivity(
                            activity.id,
                            'description',
                            event.target.value,
                          )}
                          className="w-full resize-none rounded-lg border border-app bg-[var(--surface)] p-3 text-xs leading-5 text-main outline-none focus:border-brand-blue"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-sm font-bold text-main">{activity.name}</h3>
                        <p className="mt-2 text-xs leading-5 text-muted">
                          {activity.description || 'Sin descripción.'}
                        </p>
                      </>
                    )}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeActivity(activity.id)}
                        className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-brand-red"
                        aria-label={`Eliminar ${activity.name}`}
                      >
                        <LuX className="h-3.5 w-3.5" />
                        Eliminar
                      </button>
                    )}
                  </article>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">Galeria</p>
                <span className="text-xs text-muted">
                  {site.galleryItems.length} {site.galleryItems.length === 1 ? 'imagen' : 'imagenes'}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {site.galleryItems.map((image, index) => (
                  <div key={image.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--surface-soft)]">
                    <img src={image.url} alt={`${name} ${index + 1}`} className="h-full w-full object-cover" />
                    {isEditing && onDeleteImage && (
                      <button
                        type="button"
                        disabled={imagePending}
                        onClick={() => deleteGalleryImage(image.id)}
                        className="absolute right-2 top-2 grid h-9 w-9 cursor-pointer place-items-center rounded-lg bg-black/60 text-white opacity-0 backdrop-blur-sm transition hover:bg-brand-red group-hover:opacity-100 focus:opacity-100 disabled:cursor-wait"
                        aria-label={`Eliminar imagen ${index + 1}`}
                      >
                        <LuTrash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && onUploadImage && (
                  <label className="grid aspect-[4/3] cursor-pointer place-items-center rounded-xl border border-dashed border-brand-blue/50 bg-brand-blue/8 text-brand-blue transition hover:border-brand-blue">
                    <span className="flex flex-col items-center gap-2 text-xs font-bold">
                      <LuImage className="h-5 w-5" />
                      {imagePending ? 'Subiendo imagenes' : 'Subir imagen'}
                    </span>
                    <input
                      type="file"
                      accept="image/webp,.webp"
                      multiple
                      disabled={imagePending}
                      onChange={(event) => uploadImages(event, 'gallery')}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
              {imageError && (
                <p className="mt-3 rounded-xl border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-xs font-bold text-brand-red">
                  {imageError}
                </p>
              )}
            </section>
          </div>

          <aside className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-app bg-[var(--surface-raised)]">
              <div className="flex items-center gap-3 border-b border-app p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-blue text-white">
                  <LuMapPinned className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-main">Mapa del sitio</p>
                  <p className="mt-1 text-xs text-muted">{location}</p>
                </div>
              </div>

              <iframe
                src={mapPreviewUrl}
                title={`Mapa de ${name}`}
                className="h-80 w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />

              {isEditing && (
                <div className="border-t border-app p-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                    URL del mapa
                  </label>
                  <div className="mt-2 flex items-start gap-2">
                    <span className="mt-2.5 text-brand-blue"><LuLink className="h-4 w-4" /></span>
                    <textarea
                      value={mapUrl}
                      onChange={(event) => setMapUrl(event.target.value)}
                      rows="4"
                      className="min-w-0 flex-1 resize-none rounded-lg border border-app bg-[var(--surface)] p-3 text-xs leading-5 text-main outline-none focus:border-brand-blue"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setMapPreviewUrl(mapUrl)}
                    className="mt-3 inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-brand-blue px-3 text-xs font-bold text-white"
                  >
                    <LuRefreshCw className="h-3.5 w-3.5" />
                    Actualizar mapa
                  </button>
                </div>
              )}
            </div>

            {editable && (
              <div className="rounded-2xl border border-brand-blue/25 bg-brand-blue/10 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-blue">Firma editorial</p>
                <p className="mt-3 text-sm text-main">Creado y editado por <strong>{site.author}</strong></p>
                <p className="mt-1 text-xs text-muted">Ultima actualizacion: {site.updated}</p>
              </div>
            )}
          </aside>
        </div>
      </section>

      {showPublishConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="surface-panel w-full max-w-md rounded-[1.5rem] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-blue">Confirmacion</p>
                <h3 className="mt-2 font-display text-2xl text-main">Publicar borrador</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPublishConfirm(false)}
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-muted hover:bg-[var(--surface-soft)]"
                aria-label="Cerrar confirmacion"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-5 text-sm leading-6 text-muted">
              <strong className="text-main">{name}</strong> dejara de aparecer en Borradores y se mostrara en Sitios publicados.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowPublishConfirm(false)}
                className="h-11 cursor-pointer rounded-xl border border-app px-4 text-sm font-bold text-main"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={actionPending}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-blue px-4 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-65"
              >
                <LuSend className="h-4 w-4" />
                Confirmar publicacion
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="surface-panel w-full max-w-md rounded-[1.5rem] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">Confirmacion</p>
                <h3 className="mt-2 font-display text-2xl text-main">Enviar al basurero</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-muted hover:bg-[var(--surface-soft)]"
                aria-label="Cerrar confirmacion"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-5 text-sm leading-6 text-muted">
              <strong className="text-main">{name}</strong> se movera al Basurero y se eliminara automaticamente despues de 50 dias.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setShowDeleteConfirm(false)} className="h-11 cursor-pointer rounded-xl border border-app px-4 text-sm font-bold text-main">
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={actionPending}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-red px-4 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-65"
              >
                <LuTrash2 className="h-4 w-4" />
                Enviar al basurero
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SiteDetailView
