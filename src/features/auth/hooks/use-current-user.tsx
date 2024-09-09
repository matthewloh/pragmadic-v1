"use client"
import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

export function useUser() {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: async () => {
            const supabase = createClient()
            const {
                data: { user },
            } = await supabase.auth.getUser()
            return user
        },
    })
}
