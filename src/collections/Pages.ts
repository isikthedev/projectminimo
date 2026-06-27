import type { CollectionConfig } from 'payload'
import { isTenantOrSuperAdmin } from '../core/access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'tenant'],
  },
  access: {
    create: ({ req: { user } }) => !!user,
    read: isTenantOrSuperAdmin,
    update: isTenantOrSuperAdmin,
    delete: isTenantOrSuperAdmin,
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'json',
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
}
