import { Navigate, Route, Routes } from 'react-router-dom'
import AdminShell from './components/AdminShell.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import DraftEditorPage from './pages/DraftEditorPage.jsx'
import DraftsPage from './pages/DraftsPage.jsx'
import PermissionsPage from './pages/PermissionsPage.jsx'
import PublishedSitePage from './pages/PublishedSitePage.jsx'
import PublishedSitesPage from './pages/PublishedSitesPage.jsx'
import TrashPage from './pages/TrashPage.jsx'
import UsersPage from './pages/UsersPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<AdminShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/borradores" element={<DraftsPage />} />
        <Route path="/borradores/:draftId" element={<DraftEditorPage />} />
        <Route path="/sitios" element={<PublishedSitesPage />} />
        <Route path="/sitios/:siteId" element={<PublishedSitePage />} />
        <Route path="/basurero" element={<TrashPage />} />
        <Route path="/usuarios" element={<UsersPage />} />
        <Route path="/permisos" element={<PermissionsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
