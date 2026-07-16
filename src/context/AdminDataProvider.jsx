import { useEffect, useState } from 'react'
import {
  deletedSites,
  drafts,
  publishedSites,
  userPermissions,
  users,
} from '../data/dashboardData.js'
import { AdminDataContext } from './adminDataContext.js'

function AdminDataProvider({ children }) {
  const [draftItems, setDraftItems] = useState(drafts)
  const [publishedItems, setPublishedItems] = useState(publishedSites)
  const [userItems, setUserItems] = useState(users)
  const [permissionItems, setPermissionItems] = useState(userPermissions)
  const [trashItems, setTrashItems] = useState(
    deletedSites.filter((site) => new Date(site.expiresAt).getTime() > Date.now()),
  )

  useEffect(() => {
    const purgeExpiredItems = () => {
      const now = Date.now()
      setTrashItems((current) => current.filter(
        (site) => new Date(site.expiresAt).getTime() > now,
      ))
    }

    purgeExpiredItems()
    const interval = setInterval(purgeExpiredItems, 60_000)

    return () => clearInterval(interval)
  }, [])

  const addDraft = (draft) => {
    setDraftItems((current) => [draft, ...current])
  }

  const updateDraft = (id, updates) => {
    setDraftItems((current) => current.map((draft) => (
      draft.id === id ? { ...draft, ...updates, updated: 'Ahora' } : draft
    )))
  }

  const updatePublishedSite = (id, updates) => {
    setPublishedItems((current) => current.map((site) => (
      site.id === id ? { ...site, ...updates, updated: 'Ahora' } : site
    )))
  }

  const publishDraft = (id, updates) => {
    const draft = draftItems.find((item) => item.id === id)

    if (!draft) return null

    const publishedSite = {
      ...draft,
      ...updates,
      updated: 'Ahora',
    }

    setDraftItems((current) => current.filter((item) => item.id !== id))
    setPublishedItems((current) => [publishedSite, ...current])

    return publishedSite
  }

  const moveSiteToTrash = (id) => {
    const site = publishedItems.find((item) => item.id === id)

    if (!site) return null

    const deletedAt = new Date()
    const expiresAt = new Date(deletedAt)
    expiresAt.setDate(expiresAt.getDate() + 45)

    const trashRecord = {
      ...site,
      deletedBy: 'Administrador',
      deletedAt: deletedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    }

    setPublishedItems((current) => current.filter((item) => item.id !== id))
    setTrashItems((current) => [trashRecord, ...current])

    return trashRecord
  }

  const restoreSite = (id) => {
    const site = trashItems.find((item) => item.id === id)

    if (!site) return

    const restoredSite = { ...site }
    delete restoredSite.deletedAt
    delete restoredSite.deletedBy
    delete restoredSite.expiresAt

    setTrashItems((current) => current.filter((item) => item.id !== id))
    setPublishedItems((current) => [
      { ...restoredSite, updated: 'Restaurado ahora' },
      ...current,
    ])
  }

  const deleteSiteForever = (id) => {
    setTrashItems((current) => current.filter((item) => item.id !== id))
  }

  const addUser = (user) => {
    setUserItems((current) => [...current, user])
    setPermissionItems((current) => [
      ...current,
      {
        username: user.username,
        createSite: user.type === 'Co-administrador',
        editPublished: user.type === 'Co-administrador',
        editDraft: true,
        deleteSite: user.type === 'Co-administrador',
        publish: user.type === 'Co-administrador',
      },
    ])
  }

  const deleteUser = (username) => {
    setUserItems((current) => current.filter((user) => user.username !== username))
    setPermissionItems((current) => current.filter((permission) => permission.username !== username))
  }

  const updatePermissions = (username, nextPermissions) => {
    setPermissionItems((current) => current.map((permission) => (
      permission.username === username
        ? { ...permission, ...nextPermissions }
        : permission
    )))
  }

  return (
    <AdminDataContext.Provider
      value={{
        draftItems,
        publishedItems,
        userItems,
        permissionItems,
        trashItems,
        addDraft,
        updateDraft,
        updatePublishedSite,
        publishDraft,
        moveSiteToTrash,
        restoreSite,
        deleteSiteForever,
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
