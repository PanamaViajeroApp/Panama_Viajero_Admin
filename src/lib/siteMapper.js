const fallbackImage = '/favicon.svg'

const zoneLabels = {
  costa_arriba: 'Costa Arriba',
  costa_abajo: 'Costa Abajo',
}

function formatUpdatedAt(value) {
  if (!value) return 'Sin fecha'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('es-PA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function mapApiSite(site) {
  const banner = site.images?.find((image) => image.imageType === 'banner')
  const galleryImages = site.images
    ?.filter((image) => image.imageType === 'gallery')
    .map((image) => image.url)
    .filter(Boolean) || []
  const image = banner?.url || galleryImages[0] || fallbackImage

  return {
    id: site.id,
    slug: site.slug,
    name: site.name,
    province: site.province.name,
    provinceId: site.province.id,
    provinceSlug: site.province.slug,
    location: site.location,
    previewDescription: site.previewDescription,
    description: site.description,
    author: site.author,
    updated: formatUpdatedAt(site.updatedAt),
    updatedAt: site.updatedAt,
    image,
    bannerImage: banner || null,
    galleryItems: site.images
      ?.filter((imageRecord) => imageRecord.imageType === 'gallery') || [],
    imageRecords: site.images || [],
    gallery: galleryImages.length > 0 ? galleryImages : [image],
    activities: site.activities?.map((activity) => ({
      id: activity.id,
      name: activity.name,
      description: activity.description || '',
      iconKey: activity.iconKey,
    })) || [],
    mapUrl: site.mapUrl,
    zone: site.zone ? zoneLabels[site.zone] : '',
    zoneKey: site.zone,
    isPacificRiviera: site.isPacificRiviera,
    status: site.status,
    deletedBy: site.deletedBy,
    deletedAt: site.deletedAt,
    expiresAt: site.purgeAt,
  }
}

export function mapApiSites(sites) {
  return sites.map(mapApiSite)
}
