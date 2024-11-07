import { getUserRole } from "@/lib/auth/get-user-role"
import { protectedPaths } from "@/lib/constants"
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value),
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options),
                    )
                },
            },
        },
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Get the user's role using the custom getUserRole function
    const { user_roles } = await getUserRole()
    console.log(user_roles)
    const url = new URL(request.url)

    await supabase.auth.getUser()

    if (session?.user.id) {
        if (url.pathname === "/login") {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }
        if (
            request.nextUrl.pathname.startsWith("/admin") &&
            !user_roles.includes("admin")
        ) {
            const url = request.nextUrl.clone()
            url.pathname = "/"
            return NextResponse.redirect(url)
        }
        return supabaseResponse
    } else {
        if (protectedPaths.includes(url.pathname)) {
            return NextResponse.redirect(
                new URL("/login?next=" + url.pathname, request.url),
            )
        }
        return supabaseResponse
    }

    return supabaseResponse
}
