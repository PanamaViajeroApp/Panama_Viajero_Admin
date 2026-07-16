import { Navigate, useNavigate, useParams } from 'react-router-dom'
import SiteDetailView from '../components/SiteDetailView.jsx'
import { useAdminData } from '../context/adminDataContext.js'

function DraftEditorPage() {
  const { draftId } = useParams()
  const navigate = useNavigate()
  const { draftItems, updateDraft, publishDraft } = useAdminData()
  const draft = draftItems.find((item) => item.id === draftId)

  if (!draft) {
    return <Navigate to="/borradores" replace />
  }

  return (
    <SiteDetailView
      site={draft}
      editable
      onSave={(updates) => updateDraft(draft.id, updates)}
      onPublish={(updates) => {
        const publishedSite = publishDraft(draft.id, updates)
        if (publishedSite) navigate(`/sitios/${publishedSite.id}`)
      }}
    />
  )
}

export default DraftEditorPage
