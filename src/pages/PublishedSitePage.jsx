import { Navigate, useNavigate, useParams } from 'react-router-dom'
import SiteDetailView from '../components/SiteDetailView.jsx'
import { useAdminData } from '../context/adminDataContext.js'

function PublishedSitePage() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const { publishedItems, updatePublishedSite, moveSiteToTrash } = useAdminData()
  const site = publishedItems.find((item) => item.id === siteId)

  if (!site) {
    return <Navigate to="/sitios" replace />
  }

  return (
    <SiteDetailView
      site={site}
      onSave={(updates) => updatePublishedSite(site.id, updates)}
      onDelete={() => {
        const deletedSite = moveSiteToTrash(site.id)
        if (deletedSite) navigate('/basurero')
      }}
    />
  )
}

export default PublishedSitePage
