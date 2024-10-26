import { Client } from "@/utils/supabase/types"

export const getUsersWithRoles = async (client: Client) => {
    const { data, error } = await client
        .from("users")
        .select("id, email, display_name, created_at, user_roles(role)")
        .order("created_at", { ascending: false })

    if (error) {
        throw error
    }

    return data
}
