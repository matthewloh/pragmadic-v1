"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/utils/supabase/server"

export async function login(formData: FormData) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect("/error")
    }

    revalidatePath("/", "layout")
    redirect("/")
}

export async function signup(formData: FormData) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        first_name: formData.get("first_name") as string,
        last_name: formData.get("last_name") as string,
    }
    const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                name: `${data.first_name} ${data.last_name}`,
                full_name: `${data.first_name} ${data.last_name}`,
                user_name: null,
                avatar_url: `https://avatar.vercel.sh/${data.first_name}${data.last_name}`,
            },
        },
    })
    if (error) {
        console.log(error)
        redirect("/error")
    }
    revalidatePath("/", "layout")
    redirect("/")
}
