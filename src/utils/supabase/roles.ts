import {
    PERMISSIONS,
    ROLES,
    Permission,
    Role,
    ROLE_PERMISSIONS,
} from "./permissions"

// Define a type for a user's role and permissions
export type UserRolePermissions = {
    role: Role
    permissions: Permission[]
}

// Function to get permissions for a given role
export function getPermissionsForRole(role: Role): Permission[] {
    return ROLE_PERMISSIONS[role] || []
}

// Function to check if a role has a specific permission
export function hasPermission(role: Role, permission: Permission): boolean {
    return getPermissionsForRole(role).includes(permission)
}

// Function to get all roles
export function getAllRoles(): Role[] {
    return Object.values(ROLES)
}

// Function to get all permissions
export function getAllPermissions(): Permission[] {
    return Object.values(PERMISSIONS)
}

// Function to get user's role and permissions
export function getUserRolePermissions(userRole: Role): UserRolePermissions {
    return {
        role: userRole,
        permissions: getPermissionsForRole(userRole),
    }
}

// Higher-order function to create a permission check
export function createPermissionCheck(requiredPermission: Permission) {
    return (userRole: Role): boolean => {
        return hasPermission(userRole, requiredPermission)
    }
}

// Example usage:
export const canCreateHub = createPermissionCheck(PERMISSIONS.HUBS_CREATE)
export const canDeleteHub = createPermissionCheck(PERMISSIONS.HUBS_DELETE)
