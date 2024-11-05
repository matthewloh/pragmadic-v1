import { SupabaseClient } from "@supabase/supabase-js"
import { Database } from "@/utils/supabase/types"

export type HubsWithUsersAndEvents =
    Database["public"]["Tables"]["hubs"]["Row"] & {
        users_to_hubs: Database["public"]["Tables"]["users_to_hubs"]["Row"][]
        hub_events: Database["public"]["Tables"]["hub_events"]["Row"][]
        hub_reviews: Database["public"]["Tables"]["reviews"]["Row"][]
        state: Database["public"]["Tables"]["states"]["Row"]
    }

export const hubsWithUsersAndEvents = (
    supabase: SupabaseClient<Database>,
    userId: string,
) => {
    return supabase
        .from("hubs")
        .select(
            `
            *,
            users_to_hubs (*),
            hub_events (*),
            reviews (*),
            state:states (*)
        `,
        )
        .eq("user_id", userId)
        .single()
}
