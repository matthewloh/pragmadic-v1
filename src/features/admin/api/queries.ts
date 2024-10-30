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
        .select("id, name, metadata, path_tokens, tag, created_at")
        .limit(20)
        .not("name", "ilike", "%.folderPlaceholder")
        .order("created_at", { ascending: false })
}

export type GetVaultParams = {
    parentId?: string
    limit?: number
    searchQuery?: string
    filter?: {
        start?: string
        end?: string
        owners?: string[]
        tags?: string[]
    }
}

export async function getVaultQuery(supabase: Client, params: GetVaultParams) {
    const { parentId, limit = 10000, searchQuery, filter } = params

    const { start, end, owners, tags } = filter || {}

    const isSearch =
        (filter !== undefined &&
            Object.values(filter).some(
                (value) => value !== undefined && value !== null,
            )) ||
        Boolean(searchQuery)

    const query = supabase
        .from("documents")
        .select(
            "id, name, path_tokens, created_at, metadata, tag, owner:owner_id(*)",
        )
        .limit(limit)
        .order("created_at", { ascending: true })

    if (owners?.length) {
        query.in("owner_id", owners)
    }

    if (tags?.length) {
        query.in("tag", tags)
    }

    if (start && end) {
        query.gte("created_at", start)
        query.lte("created_at", end)
    }

    if (!isSearch) {
        // if no search query, we want to get the default folders
        if (parentId === "inbox") {
            query
                .or(`parent_id.eq.${parentId},parent_id.eq.uploaded`)
                .not("path_tokens", "cs", '{"uploaded",".folderPlaceholder"}')
        } else {
            query.or(`parent_id.eq.${parentId},parent_id.eq.uploaded`)
        }
    }

    if (searchQuery) {
        query.textSearch("fts", `'${searchQuery}'`)
    }

    const { data } = await query

    const defaultFolders =
        parentId || isSearch
            ? []
            : [
                  { name: "exports", isFolder: true },
                  { name: "inbox", isFolder: true },
                  { name: "imports", isFolder: true },
                  { name: "transactions", isFolder: true },
              ]

    const filteredData = (data ?? []).map((item) => ({
        ...item,
        name:
            item.path_tokens?.at(-1) === ".folderPlaceholder"
                ? item.path_tokens?.at(-2)
                : item.path_tokens?.at(-1),
        isFolder: item.path_tokens?.at(-1) === ".folderPlaceholder",
    }))

    const mergedMap = new Map(
        [...defaultFolders, ...filteredData].map((obj) => [obj.name, obj]),
    )

    const mergedArray = Array.from(mergedMap.values())

    return {
        data: mergedArray,
    }
}
