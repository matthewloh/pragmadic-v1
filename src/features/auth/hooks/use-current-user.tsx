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

export function useCurrentUser() {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: async () => {
            const supabase = createClient()
            const {
                data: { user },
            } = await supabase.auth.getUser()
            return user
            // if (data.user) {
            //     const { data: user } = await supabase
            //         .from("user")
            //         .select("*")
            //         .eq("id", data.user.id)
            //         .single()
            //         .throwOnError()
            // }
        },
    })
}
