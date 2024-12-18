"use client"

import LoadingButton from "@/components/LoadingButton"
import { PasswordInput } from "./PasswordInput"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signUpSchema, SignUpValues } from "../zod/schemas/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { signup } from "../auth-actions"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { Separator } from "@/components/ui/separator"
import { SignInMagicLink } from "./SignInMagicLink"

export default function SignUpForm() {
    const [error, setError] = useState<string>()
    const [isPending, startTransition] = useTransition()

    const params = useSearchParams()
    const next = params.get("next") ?? ""

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

    const handleLoginWithOAuth = async (provider: "github" | "google") => {
        const supabase = createClient()
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: getURL() + "auth/callback?next=" + next,
                // redirectTo: "/auth/callback",
                // ?next=" + next, // equal to localhost:3000 in dev or your domain in prod
            },
        })
    }

    const form = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
        },
        mode: "onBlur",
    })

    async function onSubmit(values: SignUpValues) {
        setError(undefined)
        startTransition(async () => {
            const { error } = await signup({
                credentials: values,
                formData: new FormData(),
            })
            if (error) setError(error)
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                {error && (
                    <p className="text-center text-destructive">{error}</p>
                )}
                <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="First Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Last Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="Password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="Confirm Password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Hidden input value for next */}
                {next && <Input type="hidden" name="next" value={next} />}

                <LoadingButton
                    loading={isPending}
                    type="submit"
                    className="w-full"
                >
                    Create account
                </LoadingButton>
            </form>
            <Separator />
            <div className="flex flex-col gap-y-2.5">
                <Button
                    disabled={false}
                    onClick={() => {
                        handleLoginWithOAuth("google")
                    }}
                    variant={"outline"}
                    size={"lg"}
                    className="relative w-full"
                >
                    <FcGoogle className="absolute left-2.5 top-3 size-5" />
                    Continue with Google
                </Button>
                <Button
                    disabled={false}
                    onClick={() => {
                        handleLoginWithOAuth("github")
                    }}
                    variant={"outline"}
                    size={"lg"}
                    className="relative w-full"
                >
                    <FaGithub className="absolute left-2.5 top-3 size-5" />
                    Continue with GitHub
                </Button>
                <Separator />
                <SignInMagicLink />
            </div>
        </Form>
    )
}
