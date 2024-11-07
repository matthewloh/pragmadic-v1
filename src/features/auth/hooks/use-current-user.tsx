"use client"
import { createClient } from "@/utils/supabase/client"
import { UserRow } from "@/utils/supabase/types"
import { useQuery } from "@tanstack/react-query"

const emptyUser = {
    created_at: null,
    display_name: null,
    email: null,
    id: null,
    image_url: null,
    roles: [],
}

export function useCurrentUser() {
    return useQuery<UserRow | null>({
        queryKey: ["current-user"],
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase.auth.getSession()
            if (error) {
                console.error("Error fetching session:", error)
                return null
            }
            if (data.session?.user) {
                const { data: user, error: userError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", data.session.user.id)
                    .single()
                    .throwOnError()

                if (userError) {
                    console.error("Error fetching user data:", userError)
                    return null
                }

                return user
            }
            return null
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchInterval: 1000 * 60 * 5, // 5 minutes
    })
}
