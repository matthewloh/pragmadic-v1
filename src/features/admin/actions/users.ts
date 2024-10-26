"use server"

import { RoleType } from "@/lib/auth/get-user-role"
import { updateUserRoles } from "../api/mutations"
import { createAdminClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateUserRolesAction(userId: string, roles: RoleType[]) {
    try {
        const client = await createAdminClient()
        await updateUserRoles(client, userId, roles)
        revalidatePath("/admin/users")
        return { success: true }
    } catch (error) {
        console.error("Error updating user roles:", error)
        throw error
    }
}
