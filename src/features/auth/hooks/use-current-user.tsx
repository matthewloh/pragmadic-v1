"use client"
import useSupabaseBrowser, { createClient } from "@/utils/supabase/client"
import { UserRow } from "@/utils/supabase/types"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

export function useUser() {
    const supabase = useSupabaseBrowser()
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [supabase.auth])

    return useQuery<UserRow>(
        supabase
            .from("users")
            .select("*")
            .eq("id", user?.id ?? "")
            .maybeSingle(),
        {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchInterval: 1000 * 60 * 5, // 5 minutes
        },
    )
}
