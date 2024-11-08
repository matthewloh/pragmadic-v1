"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import {
    loginSchema,
    LoginValues,
    signUpSchema,
    SignUpValues,
} from "./zod/schemas/validation"
import { isAuthApiError } from "@supabase/supabase-js"

import { Ratelimit } from "@upstash/ratelimit"
import { kv } from "@vercel/kv"
import { headers } from "next/headers"

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, "3600s"), // 5 attempts per hour
})

export async function login({
    credentials,
    next,
}: {
    credentials: LoginValues
    next: string
}): Promise<{ error: string }> {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") ?? "ip"
    const { success, remaining } = await ratelimit.limit(ip)

    if (!success) {
        return { error: "Too many requests. Please try again later." }
    }

    const supabase = await createClient()
    const { email, password } = loginSchema.parse(credentials)
    // try {
    // } catch (error) {}
    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: email,
        password: password,
    }
    console.log(next)
    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        if (isAuthApiError(error)) {
            return {
                error: `Invalid credentials entered. ${remaining} attempts remaining.`,
            }
        }
        console.log(error)
    }

    revalidatePath("/")
    if (next) {
        redirect(`${next}`)
    } else {
        redirect("/")
    }
}

export async function signout({ next }: { next?: string }) {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.log(error)
        redirect("/error")
    }
    revalidatePath("/")

    console.log(next)

    if (next === "/") {
        revalidateTag("current_user")
        console.log("redirecting to /")
        redirect("/")
    } else if (next) {
        revalidatePath(`${next}`, "layout")
        console.log("redirecting to huh")
        redirect(`/login?next=${next}`)
    } else {
        revalidatePath("/", "layout")
        console.log("redirecting to what")
        redirect("/")
    }

    // if (next) {
    //   redirect(`login?next=${next}`);
    // } else {
    //   redirect("/");
    // }
}

export async function signup({
    credentials,
    formData,
}: {
    credentials: SignUpValues
    formData: FormData
}): Promise<{ error: string }> {
    const supabase = await createClient()

    const { first_name, last_name, email, password } =
        signUpSchema.parse(credentials)

    const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                name: `${first_name} ${last_name}`,
                full_name: `${first_name} ${last_name}`,
                user_name: null,
                avatar_url: `https://avatar.vercel.sh/${first_name}${last_name}`,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
        },
    })
    if (error) {
        if (isAuthApiError(error) && error.code === "user_already_exists") {
            return { error: "User already exists" }
        }
        console.log(error)
        redirect("/error")
    }

    redirect(`/auth/verify-email?email=${encodeURIComponent(email)}`)
}
