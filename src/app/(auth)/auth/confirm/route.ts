import { type EmailOtpType } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server"

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get("token_hash")
    const type = searchParams.get("type") as EmailOtpType | null
    const next = searchParams.get("next") ?? "/"

    if (token_hash && type) {
        const supabase = await createClient()

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (!error) {
            // Create a clean URL without query parameters
            const cleanRedirectUrl = new URL(request.url)
            cleanRedirectUrl.pathname = next
            cleanRedirectUrl.search = "" // Remove all query parameters

            return NextResponse.redirect(cleanRedirectUrl)
        }
    }

    // For error cases, redirect to error page
    const errorRedirect = new URL(request.url)
    errorRedirect.pathname = "/auth/auth-code-error"
    errorRedirect.search = "" // Remove query parameters

    return NextResponse.redirect(errorRedirect)
}
