import { useState } from 'react'
import { LuEye, LuEyeOff, LuKeyRound, LuLoaderCircle, LuUserRound } from 'react-icons/lu'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/authContext.js'

function getLoginError(error) {
  if (error.status === 401) return 'El usuario o la contraseña no son correctos.'
  if (error.status === 429) return 'Demasiados intentos. Espera unos minutos antes de volver a intentarlo.'
  if (error.status === 503) return 'El panel todavía no está conectado con la API.'
  return 'No se pudo iniciar sesión. Verifica tu conexión e inténtalo nuevamente.'
}

function LoginPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setErrorMessage('')

    try {
      await login({ username, password })
    } catch (error) {
      setErrorMessage(getLoginError(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Acceso privado"
      title="Panel administrativo"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-muted">
            Usuario
          </span>
          <span className="surface-panel flex h-13 items-center gap-3 rounded-xl px-4 transition focus-within:border-brand-blue">
            <LuUserRound className="h-5 w-5 shrink-0 text-brand-blue" />
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-main outline-none placeholder:text-muted"
              placeholder="Nombre de usuario"
              autoComplete="username"
              required
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-muted">
            Contraseña
          </span>
          <span className="surface-panel flex h-13 items-center gap-3 rounded-xl px-4 transition focus-within:border-brand-blue">
            <LuKeyRound className="h-5 w-5 shrink-0 text-brand-blue" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-main outline-none placeholder:text-muted"
              placeholder="Tu contraseña"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="cursor-pointer rounded-lg p-1.5 text-muted transition hover:bg-[var(--surface-soft)] hover:text-main"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
            </button>
          </span>
        </label>

        {errorMessage && (
          <p className="rounded-xl border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-sm font-semibold text-brand-red" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 text-sm font-bold text-white shadow-[0_16px_35px_rgba(73,86,162,0.3)] transition hover:-translate-y-0.5 hover:bg-[#5663b7] disabled:cursor-wait disabled:opacity-70"
        >
          {submitting && <LuLoaderCircle className="h-5 w-5 animate-spin" />}
          {submitting ? 'Verificando acceso' : 'Iniciar sesión'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
