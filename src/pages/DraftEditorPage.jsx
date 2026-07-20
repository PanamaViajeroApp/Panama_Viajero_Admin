import { Navigate, useNavigate, useParams } from 'react-router-dom'
import SiteDetailView from '../components/SiteDetailView.jsx'
import { useAdminData } from '../context/adminDataContext.js'

function DraftEditorPage() {
  const { draftId } = useParams()
  const navigate = useNavigate()
  const {
    draftItems,
    updateDraft,
    publishDraft,
    provinceItems,
    uploadSiteImage,
    deleteSiteImage,
    contentLoading,
  } = useAdminData()
  const draft = draftItems.find((item) => item.id === draftId)

  if (contentLoading) {
    return <div className="surface-panel h-72 animate-pulse rounded-[1.5rem]" />
  }

  if (!draft) {
    return <Navigate to="/borradores" replace />
  }

  return (
    <SiteDetailView
      site={draft}
      editable
      provinceOptions={provinceItems}
      onSave={(updates) => updateDraft(draft.id, updates)}
      onUploadImage={(file, imageType, sortOrder) => (
        uploadSiteImage(draft.id, file, imageType, sortOrder)
      )}
      onDeleteImage={(imageId) => deleteSiteImage(draft.id, imageId)}
      onPublish={async (updates) => {
        const publishedSite = await publishDraft(draft.id, updates)
        if (publishedSite) navigate(`/sitios/${publishedSite.id}`)
        return publishedSite
      }}
    />
  )
}

export default DraftEditorPage
