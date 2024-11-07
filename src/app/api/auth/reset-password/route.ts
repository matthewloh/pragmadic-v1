import { kv } from "@vercel/kv"
import { Ratelimit } from "@upstash/ratelimit"
import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.fixedWindow(3, "60s"), // 3 attempts per minute
})

export async function POST(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for") ?? "ip"
    const { success } = await ratelimit.limit(ip)

    if (!success) {
        return new Response("Too many requests. Please try again later.", {
            status: 429,
        })
    }

    const { email } = await req.json()

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

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${getURL()}auth/update-password`,
        })

        if (error) throw error

        return new Response("Password reset email sent", { status: 200 })
    } catch (error) {
        return new Response("Failed to send reset email", { status: 500 })
    }
}
