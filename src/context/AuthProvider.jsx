import { useEffect, useState } from 'react'
import { apiRequest } from '../lib/api.js'
import { AuthContext } from './authContext.js'

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    let active = true

    apiRequest('/api/v1/auth/me')
      .then((payload) => {
        if (active) setUser(payload.user)
      })
      .catch(() => {
        if (active) setUser(null)
      })
      .finally(() => {
        if (active) setCheckingSession(false)
      })

    return () => {
      active = false
    }
  }, [])

  const login = async (credentials) => {
    const payload = await apiRequest('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    setUser(payload.user)
    return payload.user
  }

  const changePassword = async (passwords) => {
    await apiRequest('/api/v1/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwords),
    })

    setUser((current) => (
      current ? { ...current, mustChangePassword: false } : current
    ))
  }

  const logout = async () => {
    try {
      await apiRequest('/api/v1/auth/logout', { method: 'POST' })
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        checkingSession,
        login,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
