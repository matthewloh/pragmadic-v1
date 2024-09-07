"use client"
import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { User } from "@supabase/supabase-js"

export function useUser() {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: async () => {
            const supabase = createClient()
            const { data } = await supabase.auth.getUser()
            if (data.user) {
                return data.user
            }
            return {} as User
        },
    })
}
