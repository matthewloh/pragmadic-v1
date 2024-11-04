"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
})

export function SignInMagicLink() {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

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

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithOtp({
                email: values.email,
                options: {
                    emailRedirectTo: `${getURL()}/auth/confirm`,
                },
            })

            if (error) {
                throw error
            }

            toast.success("Check your email for the magic link!")
            form.reset()
        } catch (error) {
            toast.error("Failed to send magic link. Please try again.")
            console.error("Magic link error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="you@example.com"
                                    {...field}
                                    type="email"
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Magic Link"}
                </Button>
            </form>
        </Form>
    )
}
