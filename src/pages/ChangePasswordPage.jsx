import { useState } from 'react'
import { LuKeyRound, LuLoaderCircle, LuShieldCheck } from 'react-icons/lu'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/authContext.js'

function ChangePasswordPage() {
  const { changePassword, logout } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (newPassword !== confirmation) {
      setErrorMessage('La confirmación no coincide con la nueva contraseña.')
      return
    }

    setSubmitting(true)

    try {
      await changePassword({ currentPassword, newPassword })
    } catch (error) {
      setErrorMessage(
        error.status === 400
          ? 'Verifica la contraseña actual y utiliza una nueva de al menos 12 caracteres.'
          : 'No se pudo actualizar la contraseña. Inténtalo nuevamente.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Primer acceso"
      title="Protege tu cuenta"
      description="La contraseña temporal debe reemplazarse antes de utilizar las funciones administrativas."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {[
          {
            label: 'Contraseña temporal',
            value: currentPassword,
            onChange: setCurrentPassword,
            autoComplete: 'current-password',
          },
          {
            label: 'Nueva contraseña',
            value: newPassword,
            onChange: setNewPassword,
            autoComplete: 'new-password',
          },
          {
            label: 'Confirmar contraseña',
            value: confirmation,
            onChange: setConfirmation,
            autoComplete: 'new-password',
          },
        ].map((field) => (
          <label className="block" key={field.label}>
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-muted">
              {field.label}
            </span>
            <span className="surface-panel flex h-13 items-center gap-3 rounded-xl px-4 transition focus-within:border-brand-blue">
              <LuKeyRound className="h-5 w-5 shrink-0 text-brand-blue" />
              <input
                type="password"
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-main outline-none"
                autoComplete={field.autoComplete}
                minLength={12}
                maxLength={128}
                required
              />
            </span>
          </label>
        ))}

        <p className="flex gap-2 text-xs leading-5 text-muted">
          <LuShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
          Utiliza entre 12 y 128 caracteres y evita reutilizar la contraseña temporal.
        </p>

        {errorMessage && (
          <p className="rounded-xl border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-sm font-semibold text-brand-red" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 text-sm font-bold text-white transition hover:bg-[#5663b7] disabled:cursor-wait disabled:opacity-70"
        >
          {submitting && <LuLoaderCircle className="h-5 w-5 animate-spin" />}
          {submitting ? 'Guardando contraseña' : 'Guardar nueva contraseña'}
        </button>

        <button
          type="button"
          onClick={logout}
          className="w-full cursor-pointer text-sm font-semibold text-muted transition hover:text-brand-red"
        >
          Cerrar sesión
        </button>
      </form>
    </AuthLayout>
  )
}

export default ChangePasswordPage
