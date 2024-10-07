import "client-only"

import { createBrowserClient } from "@supabase/ssr"
import { Client, Database } from "./types"
import { useMemo } from "react"

let client: Client | undefined

function supabaseBrowserClient() {
    if (client) {
        return client
    }
    client = createClient()
    return client
}

export function createClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
}

function useSupabaseBrowser() {
    return useMemo(supabaseBrowserClient, [])
}

export default useSupabaseBrowser
