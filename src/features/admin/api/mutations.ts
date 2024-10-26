import { RoleType } from "@/lib/auth/get-user-role"
import { Client } from "@/utils/supabase/types"

export async function updateUserRolesTable(
    client: Client,
    userId: string,
    roles: RoleType[],
) {
    const { data, error } = await client
        .from("user_roles")
        .update({ role: roles[0] })
        .eq("user_id", userId)
    if (error) throw error
    return data
}

export async function updateUserRoles(
    client: Client,
    userId: string,
    roles: RoleType[],
) {
    // First delete all existing roles for this user
    const { error: deleteError } = await client
        .from("user_roles")
        .delete()
        .eq("user_id", userId)

    if (deleteError) throw deleteError

    // Then insert the new roles
    if (roles.length > 0) {
        const rolesToInsert = roles.map((role) => ({
            user_id: userId,
            role: role,
        }))

        const { data, error: insertError } = await client
            .from("user_roles")
            .insert(rolesToInsert)
            .select()

        if (insertError) throw insertError
        return data
    }

    return null
}

export async function deleteUser(client: Client, userId: string) {
    const { data, error } = await client.auth.admin.deleteUser(userId)
    if (error) throw error
    return data
}

export async function inviteUser(
    client: Client,
    email: string,
    role: RoleType,
    redirectTo?: string,
) {
    const { data, error } = await client.auth.admin.inviteUserByEmail(email, {
        data: { role },
        redirectTo,
    })
    if (error) throw error
    return data
}

export async function createUser(
    client: Client,
    email: string,
    password: string,
    role: RoleType,
) {
    const { data, error } = await client.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role },
    })
    client.auth.refreshSession()
    if (error) throw error
    return data
}
