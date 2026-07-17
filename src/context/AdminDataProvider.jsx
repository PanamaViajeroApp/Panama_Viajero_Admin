import { useEffect, useState } from 'react'
import { apiRequest } from '../lib/api.js'
import { mapApiSite, mapApiSites } from '../lib/siteMapper.js'
import {
  mapApiPermission,
  mapApiUser,
  mapPermissionPayload,
} from '../lib/userMapper.js'
import { AdminDataContext } from './adminDataContext.js'
import { useAuth } from './authContext.js'

function AdminDataProvider({ children }) {
  const { user, refreshUser } = useAuth()
  const [draftItems, setDraftItems] = useState([])
  const [publishedItems, setPublishedItems] = useState([])
  const [userItems, setUserItems] = useState([])
  const [permissionItems, setPermissionItems] = useState([])
  const [trashItems, setTrashItems] = useState([])
  const [provinceItems, setProvinceItems] = useState([])
  const [activityItems, setActivityItems] = useState([])
  const [contentLoading, setContentLoading] = useState(true)
  const [contentError, setContentError] = useState('')

  useEffect(() => {
    let active = true

    if (!user || user.mustChangePassword) {
      setDraftItems([])
      setPublishedItems([])
      setTrashItems([])
      setProvinceItems([])
      setActivityItems([])
      setUserItems([])
      setPermissionItems([])
      setContentError('')
      setContentLoading(false)

      return () => {
        active = false
      }
    }

    const loadContent = async () => {
      setContentLoading(true)

      try {
        const [
          draftsResponse,
          publishedResponse,
          trashResponse,
          provincesResponse,
          activitiesResponse,
          usersResponse,
        ] = await Promise.all([
          apiRequest('/api/v1/admin/sites?status=draft'),
          apiRequest('/api/v1/admin/sites?status=published'),
          apiRequest('/api/v1/admin/sites/trash/items'),
          apiRequest('/api/v1/admin/catalog/provinces'),
          apiRequest('/api/v1/admin/catalog/activities'),
          user.permissions.manage_users || user.permissions.manage_permissions
            ? apiRequest('/api/v1/admin/users')
            : Promise.resolve({ users: [] }),
        ])

        if (!active) return

        setDraftItems(mapApiSites(draftsResponse.sites))
        setPublishedItems(mapApiSites(publishedResponse.sites))
        setTrashItems(mapApiSites(trashResponse.sites))
        setProvinceItems(provincesResponse.provinces)
        setActivityItems(activitiesResponse.activities)
        setUserItems(usersResponse.users.map(mapApiUser))
        setPermissionItems(usersResponse.users.map(mapApiPermission))
        setContentError('')
      } catch (error) {
        if (!active) return
        setContentError(getContentErrorMessage(error))
      } finally {
        if (active) setContentLoading(false)
      }
    }

    loadContent()

    return () => {
      active = false
    }
  }, [user])

  const mergeActivityCatalog = (site) => {
    setActivityItems((current) => {
      const byName = new Map(
        current.map((activity) => [activity.name.toLowerCase(), activity]),
      )

      site.activities.forEach((activityName) => {
        if (!byName.has(activityName.toLowerCase())) {
          byName.set(activityName.toLowerCase(), {
            id: activityName,
            name: activityName,
            iconKey: 'compass',
          })
        }
      })

      return Array.from(byName.values()).sort((first, second) => (
        first.name.localeCompare(second.name, 'es')
      ))
    })
  }

  const runContentAction = async (action) => {
    try {
      const result = await action()
      setContentError('')
      return result
    } catch (error) {
      setContentError(getContentErrorMessage(error))
      return null
    }
  }

  const addDraft = (draft) => runContentAction(async () => {
    const response = await apiRequest('/api/v1/admin/sites', {
      method: 'POST',
      body: JSON.stringify(draft),
    })
    const createdDraft = mapApiSite(response.site)

    setDraftItems((current) => [createdDraft, ...current])
    mergeActivityCatalog(createdDraft)
    return createdDraft
  })

  const updateDraft = (id, updates) => runContentAction(async () => {
    const response = await apiRequest(`/api/v1/admin/sites/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
    const updatedDraft = mapApiSite(response.site)

    setDraftItems((current) => current.map((draft) => (
      draft.id === id ? updatedDraft : draft
    )))
    mergeActivityCatalog(updatedDraft)
    return updatedDraft
  })

  const updatePublishedSite = (id, updates) => runContentAction(async () => {
    const response = await apiRequest(`/api/v1/admin/sites/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
    const updatedSite = mapApiSite(response.site)

    setPublishedItems((current) => current.map((site) => (
      site.id === id ? updatedSite : site
    )))
    mergeActivityCatalog(updatedSite)
    return updatedSite
  })

  const publishDraft = (id, updates) => runContentAction(async () => {
    await apiRequest(`/api/v1/admin/sites/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
    const response = await apiRequest(`/api/v1/admin/sites/${id}/publish`, {
      method: 'POST',
    })
    const publishedSite = mapApiSite(response.site)

    setDraftItems((current) => current.filter((item) => item.id !== id))
    setPublishedItems((current) => [publishedSite, ...current])
    mergeActivityCatalog(publishedSite)
    return publishedSite
  })

  const moveSiteToTrash = (id) => runContentAction(async () => {
    const response = await apiRequest(`/api/v1/admin/sites/${id}`, {
      method: 'DELETE',
    })
    const deletedSite = mapApiSite(response.site)

    setDraftItems((current) => current.filter((item) => item.id !== id))
    setPublishedItems((current) => current.filter((item) => item.id !== id))
    setTrashItems((current) => [deletedSite, ...current])
    return deletedSite
  })

  const restoreSite = (id) => runContentAction(async () => {
    const response = await apiRequest(
      `/api/v1/admin/sites/trash/${id}/restore`,
      { method: 'POST' },
    )
    const restoredSite = mapApiSite(response.site)

    setTrashItems((current) => current.filter((item) => item.id !== id))

    if (restoredSite.status === 'draft') {
      setDraftItems((current) => [restoredSite, ...current])
    } else {
      setPublishedItems((current) => [restoredSite, ...current])
    }

    return restoredSite
  })

  const deleteSiteForever = (id) => runContentAction(async () => {
    await apiRequest(`/api/v1/admin/sites/trash/${id}`, {
      method: 'DELETE',
    })
    setTrashItems((current) => current.filter((item) => item.id !== id))
    return true
  })

  const clearContentError = () => {
    setContentError('')
  }

  const addUser = (newUser) => runContentAction(async () => {
    const response = await apiRequest('/api/v1/admin/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    })
    const createdUser = mapApiUser(response.user)
    const createdPermissions = mapApiPermission(response.user)

    setUserItems((current) => [...current, createdUser])
    setPermissionItems((current) => [...current, createdPermissions])
    return createdUser
  })

  const deleteUser = (userId) => runContentAction(async () => {
    await apiRequest(`/api/v1/admin/users/${userId}`, {
      method: 'DELETE',
    })
    setUserItems((current) => current.filter((item) => item.id !== userId))
    setPermissionItems((current) => (
      current.filter((permission) => permission.id !== userId)
    ))
    return true
  })

  const updatePermissions = (userId, nextPermissions) => (
    runContentAction(async () => {
      const response = await apiRequest(
        `/api/v1/admin/users/${userId}/permissions`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            permissions: mapPermissionPayload(nextPermissions),
          }),
        },
      )
      const updatedPermissions = mapApiPermission(response.user)

      setPermissionItems((current) => current.map((permission) => (
        permission.id === userId ? updatedPermissions : permission
      )))

      if (response.user.id === user.id) {
        await refreshUser()
      }

      return updatedPermissions
    })
  )

  return (
    <AdminDataContext.Provider
      value={{
        draftItems,
        publishedItems,
        userItems,
        permissionItems,
        trashItems,
        provinceItems,
        activityItems,
        destinationFilters: [
          ...provinceItems.map((province) => province.name),
          'Riviera Pacifica',
        ],
        contentLoading,
        contentError,
        addDraft,
        updateDraft,
        updatePublishedSite,
        publishDraft,
        moveSiteToTrash,
        restoreSite,
        deleteSiteForever,
        clearContentError,
        addUser,
        deleteUser,
        updatePermissions,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  )
}

export default AdminDataProvider

function getContentErrorMessage(error) {
  if (error.status === 401) {
    return 'Tu sesión expiró. Cierra sesión e ingresa nuevamente.'
  }

  if (error.status === 403) {
    return 'No tienes permiso para completar esta acción.'
  }

  if (error.status === 409) {
    return 'La operación no puede completarse por el estado actual del sitio.'
  }

  if (error.status === 400) {
    return 'Verifica los datos del formulario e inténtalo nuevamente.'
  }

  return 'No se pudo sincronizar el contenido con la base de datos.'
}
