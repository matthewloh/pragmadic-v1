// Define all permissions as const
export const PERMISSIONS = {
    HUBS_CREATE: "hubs.create",
    HUBS_UPDATE: "hubs.update",
    HUBS_DELETE: "hubs.delete",
    HUBS_POSTS_CREATE: "hubs.posts.create",
    HUBS_POSTS_UPDATE: "hubs.posts.update",
    HUBS_POSTS_DELETE: "hubs.posts.delete",
    COMMUNITIES_POSTS_CREATE: "communities.posts.create",
    COMMUNITIES_POSTS_UPDATE: "communities.posts.update",
    COMMUNITIES_POSTS_DELETE: "communities.posts.delete",
} as const

// Create a type from the permissions object
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

// Define roles and their associated permissions
export const ROLES = {
    REGULAR: "regular",
    OWNER: "owner",
    ADMIN: "admin",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

// Define role-permission mappings
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    [ROLES.REGULAR]: [PERMISSIONS.COMMUNITIES_POSTS_CREATE],
    [ROLES.OWNER]: [PERMISSIONS.HUBS_CREATE, PERMISSIONS.HUBS_POSTS_CREATE],
    [ROLES.ADMIN]: Object.values(PERMISSIONS),
}
