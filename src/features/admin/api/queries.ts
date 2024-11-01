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

export async function getFileStoreActivityQuery(client: Client) {
    return client
        .from("documents")
        .select("id, name, metadata, path_tokens,created_at")
        .limit(20)
        .not("name", "ilike", "%.folderPlaceholder")
        .order("created_at", { ascending: false })
}
