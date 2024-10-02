import { getUserAuth } from "@/lib/auth/utils"
import { db } from "@/lib/db"
import { users, userRoles, rolePermissions } from "@/lib/db/schema/users"
import { eq } from "drizzle-orm"

export const getUsers = async () => {
    const { session } = await getUserAuth()
    const rows = await db.query.users.findMany()
    const u = rows
    return { users: u }
}

export const getUserRoles = async () => {
    const { session } = await getUserAuth()
    // TODO: Add admin check here
    const rows = await db.query.userRoles.findMany({
        with: {
            user: true,
            role: true,
        },
    })
    return { userRoles: rows }
}

export const getRolePermissions = async () => {
    const { session } = await getUserAuth()
    // TODO: Add admin check here
    const rows = await db.query.rolePermissions.findMany({
        with: {
            role: true,
        },
    })
    return { rolePermissions: rows }
}

export const getUserRole = async (userId: string) => {
    const { session } = await getUserAuth()
    const userRole = await db.query.userRoles.findFirst({
        where: eq(userRoles.userId, userId),
        with: {
            role: true,
        },
    })
    return { userRole }
}
