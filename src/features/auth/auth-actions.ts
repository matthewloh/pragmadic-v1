"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import {
    loginSchema,
    LoginValues,
    signUpSchema,
    SignUpValues,
} from "./zod/schemas/validation"
import { isAuthApiError } from "@supabase/supabase-js"

export async function login({
    credentials,
    formData,
}: {
    credentials: LoginValues
    formData: FormData
}): Promise<{ error: string }> {
    const supabase = createClient()
    const { email, password } = loginSchema.parse(credentials)
    // try {
    // } catch (error) {}
    // type-casting here for convenience
    // in practice, you should validate your inputs
    const next = formData.get("next") as string
    const data = {
        email: email,
        password: password,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        if (isAuthApiError(error)) {
            return { error: "Invalid credentials entered." }
        }
        console.log(error)
    }

    revalidatePath("/", "layout")
    if (next) {
        redirect(`${next}`)
    } else {
        redirect("/")
    }
}

export async function signout({ next }: { next?: string }) {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.log(error)
        redirect("/error")
    }
    revalidatePath("/", "layout")
    console.log(next)

    if (next === "/") {
        revalidatePath("/", "layout")
        redirect("/")
    } else if (next) {
        revalidatePath(`${next}`, "layout")
        redirect(`login?next=${next}`)
    } else {
        revalidatePath("/", "layout")
        redirect("/")
    }

    // if (next) {
    //   redirect(`login?next=${next}`);
    // } else {
    //   redirect("/");
    // }
}

export async function signInWithGoogle() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            queryParams: {
                access_type: "offline",
                prompt: "consent",
            },
        },
    })

    if (error) {
        console.log(error)
        redirect("/error")
    }

    redirect(data.url)
}

export async function signup({
    credentials,
    formData,
}: {
    credentials: SignUpValues
    formData: FormData
}): Promise<{ error: string }> {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    // TODO: validate inputs
    // TODO: handle errors in a try/catch block and add isRedirectError(error)
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
        },
    })
    if (error) {
        if (isAuthApiError(error) && error.code === "user_already_exists") {
            return { error: "User already exists" }
        }
        redirect("/error")
    }
    revalidatePath("/", "layout")
    redirect("/")
}
