import type { CollectionConfig } from 'payload'
import { isTenantOrSuperAdmin, isAdminOrSelf } from '../core/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    // Anyone can create (e.g. registration). Restrict via field defaults / hooks.
    create: () => true,
    // Read: super-admin sees all; others see only their tenant's users.
    read: isTenantOrSuperAdmin,
    // Update / Delete: same tenant isolation.
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
      name: 'roles',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        {
          label: 'Super Admin',
          value: 'super-admin',
        },
        {
          label: 'Tenant Admin',
          value: 'tenant-admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      hasMany: false,
      required: false,
      admin: {
        condition: (data, siblingData, { user }) => user?.roles === 'super-admin',
      },
    },
  ],
}
