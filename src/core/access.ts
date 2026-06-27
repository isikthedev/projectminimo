import type { Access, AccessArgs } from 'payload'
import type { User } from '../payload-types'

// ---------------------------------------------------------------------------
// Type helpers
// ---------------------------------------------------------------------------

/** Resolve the tenant ID whether the field is populated (Tenant) or a raw id. */
function resolveTenantId(tenant: User['tenant']): number | null {
  if (!tenant) return null
  if (typeof tenant === 'object' && 'id' in tenant) return tenant.id
  return tenant as number
}

// ---------------------------------------------------------------------------
// isSuperAdmin
// Returns true when the logged-in user carries the `super-admin` role.
// ---------------------------------------------------------------------------
export function isSuperAdmin({ req: { user } }: AccessArgs<User>): boolean {
  return user?.roles === 'super-admin'
}

// ---------------------------------------------------------------------------
// isTenantOrSuperAdmin
//
// Access function for collection-level operations.
//
//  • super-admin  → always true (unrestricted access to all tenants)
//  • tenant-admin / user → scoped read/write to their own tenant only
//
// When used as a `read` constraint this returns a Payload `Where` clause so
// the database query is automatically filtered to the caller's tenant.
// ---------------------------------------------------------------------------
export const isTenantOrSuperAdmin: Access<User> = ({ req: { user } }) => {
  if (!user) return false

  // Super-admins have full, unrestricted access.
  if (user.roles === 'super-admin') return true

  // Tenant-scoped users: only records whose `tenant` field matches theirs.
  const tenantId = resolveTenantId(user.tenant)

  if (!tenantId) {
    // User has no tenant assigned → deny all access.
    return false
  }

  return {
    tenant: {
      equals: tenantId,
    },
  }
}

// ---------------------------------------------------------------------------
// isAdminOrSelf
//
// Useful for the Users collection `update` / `delete` operations:
//  • super-admin  → unrestricted
//  • tenant-admin / user → can only touch documents inside their tenant
// ---------------------------------------------------------------------------
export const isAdminOrSelf: Access<User> = ({ req: { user } }) => {
  if (!user) return false
  if (user.roles === 'super-admin') return true

  const tenantId = resolveTenantId(user.tenant)
  if (!tenantId) return false

  return {
    tenant: {
      equals: tenantId,
    },
  }
}

// ---------------------------------------------------------------------------
// canReadTenants
//
// Read access function for Tenants collection.
//  • super-admin  → always true (can read all tenants)
//  • tenant-admin / user → can only read their own tenant document
// ---------------------------------------------------------------------------
export const canReadTenants: Access<User> = ({ req: { user } }) => {
  if (!user) return false

  if (user.roles === 'super-admin') return true

  const tenantId = resolveTenantId(user.tenant)
  if (!tenantId) return false

  return {
    id: {
      equals: tenantId,
    },
  }
}

