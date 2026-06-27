import type { CollectionConfig } from 'payload'
import { isTenantOrSuperAdmin } from '../core/access'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'tenant'],
  },
  access: {
    read: isTenantOrSuperAdmin,
    update: isTenantOrSuperAdmin,
    delete: isTenantOrSuperAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
    beforeChange: [
      ({ req, data }) => {
        if (req.user && req.user.roles !== 'super-admin') {
          // Auto-assign tenant for non-super-admins
          const tenantId = req.user.tenant
          if (typeof tenantId === 'object' && tenantId !== null) {
            data.tenant = tenantId.id
          } else {
            data.tenant = tenantId
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
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
      editor: 'lexical',
    },
    {
      name: 'coverImage',
      type: 'relationship',
      relationTo: 'media',
      hasMany: false,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      hasMany: false,
      admin: {
        position: 'sidebar',
        condition: ({ user }) => user?.roles === 'super-admin',
      },
    },
  ],
}
