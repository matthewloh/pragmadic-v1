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

    // const {
    //     data: { session },
    // } = await supabase.auth.getSession()
    // const user = session?.user

    // const url = new URL(request.url)
    // if (session?.user.id) {
    //     if (url.pathname === "/login") {
    //         return NextResponse.redirect(new URL("/dashboard", request.url))
    //     }
    //     return supabaseResponse
    // } else {
    //     if (protectedPaths.includes(url.pathname)) {
    //         return NextResponse.redirect(
    //             new URL("/login?next=" + url.pathname, request.url),
    //         )
    //     }
    //     return supabaseResponse
    // }

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Get the user's role using the custom getUserRole function
    const { role } = await getUserRole()
    console.log(role)
    const url = new URL(request.url)

    if (session?.user.id) {
        if (url.pathname === "/login") {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }
        if (request.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
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

    // if (
    //     !user &&
    //     !request.nextUrl.pathname.startsWith("/login") &&
    //     !request.nextUrl.pathname.startsWith("/auth")
    // ) {
    //     // no user, potentially respond by redirecting the user to the login page
    //     const url = request.nextUrl.clone()
    //     url.pathname = "/login"
    //     return NextResponse.redirect(url)
    // }

    // If user is already logged in and tries to access the login page, redirect
    // them to the home page. Exclude /error from this check to avoid circular
    // redirects.
    // if (
    //   user &&
    //   request.nextUrl.pathname.startsWith("/login") &&
    //   !request.nextUrl.pathname.startsWith("/error")
    // ) {
    //   const url = request.nextUrl.clone();
    //   url.pathname = "/";
    //   return NextResponse.redirect(url);
    // }

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return supabaseResponse
}
