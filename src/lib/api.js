export class ApiError extends Error {
  constructor(message, status, payload = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
  })
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(
      payload?.error || 'No se pudo completar la solicitud',
      response.status,
      payload,
    )
  }

  return payload
}
