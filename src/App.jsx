import { Navigate, Route, Routes } from 'react-router-dom'
import AdminShell from './components/AdminShell.jsx'
import { useAuth } from './context/authContext.js'
import ChangePasswordPage from './pages/ChangePasswordPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import DraftEditorPage from './pages/DraftEditorPage.jsx'
import DraftsPage from './pages/DraftsPage.jsx'
import PermissionsPage from './pages/PermissionsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PublishedSitePage from './pages/PublishedSitePage.jsx'
import PublishedSitesPage from './pages/PublishedSitesPage.jsx'
import TrashPage from './pages/TrashPage.jsx'
import UsersPage from './pages/UsersPage.jsx'

function App() {
  const { user, checkingSession } = useAuth()

  if (checkingSession) {
    return (
      <main className="admin-grid grid min-h-screen place-items-center text-main">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-blue/20 border-t-brand-blue" />
          <p className="mt-4 text-sm font-semibold text-muted">Verificando sesión</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  if (user.mustChangePassword) {
    return (
      <Routes>
        <Route path="/cambiar-contrasena" element={<ChangePasswordPage />} />
        <Route path="*" element={<Navigate to="/cambiar-contrasena" replace />} />
      </Routes>
    )
  }

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
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
