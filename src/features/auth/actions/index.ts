"use server"

import { createClient } from "@/utils/supabase/server"
import { z } from "zod"

export async function signInWithMagicLink(token: string, email: string) {
    const supabase = await createClient()
    const getURL = () => {
        let url =
            process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
            process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
            "http://localhost:3000/"
        // Make sure to include `https://` when not localhost.
        url = url.startsWith("http") ? url : `https://${url}`
        // Make sure to include a trailing `/`.
        url = url.endsWith("/") ? url : `${url}/`
        return url
    }
    const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
            shouldCreateUser: true,
        },
    })
}
