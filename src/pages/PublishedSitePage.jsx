import { Navigate, useNavigate, useParams } from 'react-router-dom'
import SiteDetailView from '../components/SiteDetailView.jsx'
import { useAdminData } from '../context/adminDataContext.js'

function PublishedSitePage() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const {
    publishedItems,
    updatePublishedSite,
    moveSiteToTrash,
    uploadSiteImage,
    deleteSiteImage,
    contentLoading,
  } = useAdminData()
  const site = publishedItems.find((item) => item.id === siteId)

  if (contentLoading) {
    return <div className="surface-panel h-72 animate-pulse rounded-[1.5rem]" />
  }

  if (!site) {
    return <Navigate to="/sitios" replace />
  }

  return (
    <SiteDetailView
      site={site}
      onSave={(updates) => updatePublishedSite(site.id, updates)}
      onUploadImage={(file, imageType, sortOrder) => (
        uploadSiteImage(site.id, file, imageType, sortOrder)
      )}
      onDeleteImage={(imageId) => deleteSiteImage(site.id, imageId)}
      onDelete={async () => {
        const deletedSite = await moveSiteToTrash(site.id)
        if (deletedSite) navigate('/basurero')
        return deletedSite
      }}
    />
  )
}

export default PublishedSitePage
