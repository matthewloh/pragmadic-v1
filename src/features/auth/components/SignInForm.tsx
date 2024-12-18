"use client"

import LoadingButton from "@/components/LoadingButton"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { login } from "@/features/auth/auth-actions"
import { createClient } from "@/utils/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { toast } from "sonner"
import { loginSchema, LoginValues } from "../zod/schemas/validation"
import { PasswordInput } from "./PasswordInput"
import { SignInMagicLink } from "./SignInMagicLink"
import Link from "next/link"
import { Alert, AlertDescription, AlertClose } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import { useCallback, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export function SignInForm() {
    const [error, setError] = useState<string>()
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()
    const [showMessage, setShowMessage] = useState(false)

    const next = params.get("next") ?? ""
    const message = params.get("message")

    useEffect(() => {
        if (message) {
            setShowMessage(true)
        }
    }, [message])

    const handleDismiss = useCallback(() => {
        setShowMessage(false)
        const newParams = new URLSearchParams(params)
        newParams.delete("message")
        router.replace(`${pathname}?${newParams.toString()}`)
    }, [params, pathname, router])

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
        toast.info("Signing in...", {
            description: `Signing you in into Pragmadic`,
            duration: 3000,
            icon: provider === "google" ? <FcGoogle /> : <FaGithub />,
        })
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: getURL() + "auth/callback?next=" + next,
            },
        })
        if (error) {
            toast.error("Error signing in with " + provider, {
                description: error.message,
            })
        }
    }

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: LoginValues) {
        setError(undefined)
        startTransition(async () => {
            const { error } = await login({
                credentials: values,
                next: next,
            })
            if (error) setError(error)
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                {message && showMessage && (
                    <Alert className="border-green-500 text-green-500">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>{message}</AlertDescription>
                        <AlertClose onClick={handleDismiss} />
                    </Alert>
                )}

                {error && (
                    <p className="text-center text-destructive">{error}</p>
                )}

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
                            <div className="flex items-center justify-between">
                                <FormLabel>Password</FormLabel>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-muted-foreground hover:text-primary"
                                >
                                    Forgot password?
                                </Link>
                            </div>
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

                {/* Hidden input value for next */}
                {next && <Input type="hidden" name="next" value={next} />}
                <LoadingButton
                    loading={isPending}
                    type="submit"
                    className="w-full"
                    size={"lg"}
                >
                    Sign In
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
            </div>
            <Separator />
            <SignInMagicLink />
        </Form>
    )
}
