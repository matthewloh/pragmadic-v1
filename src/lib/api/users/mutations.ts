import { getUserAuth } from "@/lib/auth/utils"
import { db } from "@/lib/db"
import { users, userRoles, rolePermissions, userRoleEnum } from "@/lib/db/schema/users"
import { eq } from "drizzle-orm"

export const assignUserRole = async (userId: string, roleId: string) => {
    const { session } = await getUserAuth()
    // TODO: Add admin check here

    // Check if the user already has a role
    const existingUserRole = await db.query.userRoles.findFirst({
        where: eq(userRoles.userId, userId),
    })

    if (existingUserRole) {
        // Update existing role
        const updatedUserRole = await db
            .update(userRoles)
            .set({ roleId })
            .where(eq(userRoles.userId, userId))
            .returning()
        return { userRole: updatedUserRole[0] }
    } else {
        // Create new user role
        const newUserRole = await db
            .insert(userRoles)
            .values({ userId, roleId })
            .returning()
        return { userRole: newUserRole[0] }
    }
}

export const removeUserRole = async (userId: string) => {
    const { session } = await getUserAuth()
    // TODO: Add admin check here

    const deletedUserRole = await db
        .delete(userRoles)
        .where(eq(userRoles.userId, userId))
        .returning()
    return { userRole: deletedUserRole[0] }
}

export const updateRolePermissions = async (
    roleId: string,
    permissions: string[],
) => {
    const { session } = await getUserAuth()
    // TODO: Add admin check here

    // Delete existing permissions for the role
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId))

    // Insert new permissions
    const newPermissions = await db
        .insert(rolePermissions)
        .values(permissions.map((permission) => ({ roleId, permission })))
        .returning()

    return { rolePermissions: newPermissions }
}

export const createRole = async (name: string, permissions: string[]) => {
    const { session } = await getUserAuth()
    // TODO: Add admin check here

    const newRole = await db.insert(roles).values({ name }).returning()
    const roleId = newRole[0].id

    const newPermissions = await db
        .insert(rolePermissions)
        .values(permissions.map((permission) => ({ roleId, permission })))
        .returning()

    return { role: newRole[0], rolePermissions: newPermissions }
}

export const deleteRole = async (roleId: string) => {
    const { session } = await getUserAuth()
    // TODO: Add admin check here

    // Delete associated user roles and role permissions
    await db.delete(userRoles).where(eq(userRoles.roleId, roleId))
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId))

    // Delete the role
    const deletedRole = await db
        .delete(roles)
        .where(eq(roles.id, roleId))
        .returning()

    return { role: deletedRole[0] }
}
