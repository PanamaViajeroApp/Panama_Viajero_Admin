const accountTypeLabels = {
  administrator: 'Administrador',
  co_administrator: 'Co-administrador',
  user: 'Usuario',
}

function formatLastAccess(value) {
  if (!value) return 'Nunca'

  return new Intl.DateTimeFormat('es-PA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function mapApiUser(user) {
  return {
    id: user.id,
    username: user.username,
    accountType: user.accountType,
    type: accountTypeLabels[user.accountType] || 'Usuario',
    lastAccess: formatLastAccess(user.lastLoginAt),
    mustChangePassword: user.mustChangePassword,
  }
}

export function mapApiPermission(user) {
  return {
    id: user.id,
    username: user.username,
    accountType: user.accountType,
    type: accountTypeLabels[user.accountType] || 'Usuario',
    createSite: user.permissions.create_draft,
    editPublished: user.permissions.edit_published,
    editDraft: user.permissions.edit_draft,
    deleteSite: user.permissions.delete_site,
    publish: user.permissions.publish,
  }
}

export function mapPermissionPayload(permission) {
  return {
    create_draft: permission.createSite,
    edit_published: permission.editPublished,
    edit_draft: permission.editDraft,
    delete_site: permission.deleteSite,
    publish: permission.publish,
  }
}
