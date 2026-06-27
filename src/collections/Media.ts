import type { CollectionConfig } from 'payload'
import { isTenantOrSuperAdmin, isAdminOrSelf } from '../core/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: isTenantOrSuperAdmin,
    create: isTenantOrSuperAdmin,
    update: isAdminOrSelf,
    delete: isAdminOrSelf,
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create' && req.user) {
          if (req.user.roles !== 'super-admin') {
            const tenant = req.user.tenant
            if (tenant) {
              const tenantId = typeof tenant === 'object' && 'id' in tenant ? tenant.id : tenant
              data.tenant = tenantId
            }
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      hasMany: false,
      required: true,
      admin: {
        condition: (data, siblingData, { user }) => user?.roles === 'super-admin',
      },
    },
  ],
  upload: true,
}
