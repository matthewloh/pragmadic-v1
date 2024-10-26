import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Database } from "./types"
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient"

type CreateClientOptions = {
    admin?: boolean
    schema?: "public" | "storage"
}

export async function createClient(options?: CreateClientOptions) {
    const { admin = false } = options ?? {}

    const cookieStore = await cookies()

    const key = admin
        ? process.env.SUPABASE_SERVICE_KEY!
        : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const auth = admin
        ? {
              persistSession: false,
              autoRefreshToken: false,
              detectSessionInUrl: false,
          }
        : {}

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        key,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options),
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
            auth,
        },
    )
}

export async function createAdminClient() {
    return createClient({ admin: true })
}
