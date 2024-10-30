export const PERMISSIONS = {
    // Hub Management
    HUBS_CREATE: "hubs.create",
    HUBS_VIEW: "hubs.view",
    HUBS_UPDATE: "hubs.update",
    HUBS_DELETE: "hubs.delete",
    HUBS_APPROVE: "hubs.approve",

    // Hub Posts
    HUBS_POSTS_CREATE: "hubs.posts.create",
    HUBS_POSTS_VIEW: "hubs.posts.view",
    HUBS_POSTS_UPDATE: "hubs.posts.update",
    HUBS_POSTS_DELETE: "hubs.posts.delete",

    // Community Management
    COMMUNITIES_CREATE: "communities.create",
    COMMUNITIES_VIEW: "communities.view",
    COMMUNITIES_UPDATE: "communities.update",
    COMMUNITIES_DELETE: "communities.delete",
    COMMUNITIES_MODERATE: "communities.moderate",

    // Community Posts
    COMMUNITIES_POSTS_CREATE: "communities.posts.create",
    COMMUNITIES_POSTS_VIEW: "communities.posts.view",
    COMMUNITIES_POSTS_UPDATE: "communities.posts.update",
    COMMUNITIES_POSTS_DELETE: "communities.posts.delete",

    // Region Management
    REGIONS_CREATE: "regions.create",
    REGIONS_VIEW: "regions.view",
    REGIONS_UPDATE: "regions.update",
    REGIONS_DELETE: "regions.delete",

    // User Management
    USERS_VIEW: "users.view",
    USERS_UPDATE: "users.update",
    USERS_DELETE: "users.delete",
    USERS_ROLES_MANAGE: "users.roles.manage",

    // Reviews
    REVIEWS_CREATE: "reviews.create",
    REVIEWS_VIEW: "reviews.view",
    REVIEWS_UPDATE: "reviews.update",
    REVIEWS_DELETE: "reviews.delete",
    REVIEWS_MODERATE: "reviews.moderate",
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const ROLES = {
    REGULAR: "regular",
    NOMAD: "nomad",
    OWNER: "owner",
    ADMIN: "admin",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    [ROLES.REGULAR]: [
        PERMISSIONS.COMMUNITIES_POSTS_CREATE,
        PERMISSIONS.HUBS_VIEW,
        PERMISSIONS.REVIEWS_CREATE,
        PERMISSIONS.REVIEWS_VIEW,
    ],

    [ROLES.NOMAD]: [
        PERMISSIONS.COMMUNITIES_POSTS_CREATE,
        PERMISSIONS.COMMUNITIES_POSTS_UPDATE,
        PERMISSIONS.HUBS_VIEW,
        PERMISSIONS.REVIEWS_CREATE,
        PERMISSIONS.REVIEWS_UPDATE,
        PERMISSIONS.REVIEWS_VIEW,
    ],

    [ROLES.OWNER]: [
        PERMISSIONS.HUBS_CREATE,
        PERMISSIONS.HUBS_UPDATE,
        PERMISSIONS.HUBS_POSTS_CREATE,
        PERMISSIONS.HUBS_POSTS_UPDATE,
        PERMISSIONS.HUBS_POSTS_DELETE,
        PERMISSIONS.COMMUNITIES_POSTS_CREATE,
        PERMISSIONS.COMMUNITIES_POSTS_UPDATE,
    ],

    [ROLES.ADMIN]: [
        // Region Management
        PERMISSIONS.REGIONS_CREATE,
        PERMISSIONS.REGIONS_UPDATE,
        PERMISSIONS.REGIONS_DELETE,
        // Community Management
        PERMISSIONS.COMMUNITIES_CREATE,
        PERMISSIONS.COMMUNITIES_UPDATE,
        PERMISSIONS.COMMUNITIES_DELETE,
        PERMISSIONS.COMMUNITIES_MODERATE,
        PERMISSIONS.COMMUNITIES_POSTS_DELETE,
        // Hub Management
        PERMISSIONS.HUBS_APPROVE,
        PERMISSIONS.HUBS_DELETE,
        // User Management
        PERMISSIONS.USERS_VIEW,
        PERMISSIONS.USERS_UPDATE,
        PERMISSIONS.USERS_DELETE,
        PERMISSIONS.USERS_ROLES_MANAGE,
        // Reviews Management
        PERMISSIONS.REVIEWS_MODERATE,
        PERMISSIONS.REVIEWS_DELETE,
    ],
}

// Helper function to check if a role has a specific permission
export const hasPermission = (role: Role, permission: Permission): boolean => {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

// Helper function to get all permissions for a role
export const getRolePermissions = (role: Role): Permission[] => {
    return ROLE_PERMISSIONS[role] || []
}
