import { Client } from "@/utils/supabase/types"

export async function getUserQuery(supabase: Client, userId: string) {
    return supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single()
        .throwOnError()
}

// export async function getUserQuery(supabase: Client, userId: string) {
//     return supabase
//         .from("user")
//         .select("*")
//         .eq("id", userId)
//         .single()
//         .throwOnError()
// }
