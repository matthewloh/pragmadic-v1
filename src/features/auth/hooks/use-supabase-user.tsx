"use client"
import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

const initialUser = {
    created_at: "",
    display_name: "",
    email: "",
    id: "",
    image_url: "",
}

export function useSupabaseUser() {
    return useQuery({
        queryKey: ["current-supabase-user"],
        queryFn: async () => {
            const supabase = createClient()
            const {
                data: { user },
            } = await supabase.auth.getUser()
            return user
        },
    })
}
