import { getUserAuth } from "@/lib/auth/utils"
import { db } from "@/lib/db"
import { users, userRoles, rolePermissions } from "@/lib/db/schema/users"
import { createClient } from "@/utils/supabase/server"
import { eq } from "drizzle-orm"
import { unstable_cache } from "next/cache"
import { Database } from "@/utils/supabase/types"
import { Client } from "@/utils/supabase/types"

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
type roleEnums = Database["public"]["Enums"]["user_role"]

export const getUserRolesSupa = async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from("user_roles").select(
        `
            id,
            role,
            user (
                display_name
            )
            `,
    )
    // .eq("role", "admin")
    if (error) {
        console.error(error)
        return
    }
    return data
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
