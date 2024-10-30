import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MailOpen } from "lucide-react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

type SearchParams = Promise<{ email: string }>

export default async function VerifyEmailPage(props: {
    searchParams: Promise<SearchParams>
}) {
    const headersList = await headers()
    const { email } = await props.searchParams
    if (email) {
        const sanitizedEmail = decodeURIComponent(email)
        const currentPath =
            headersList.get("x-pathname") || "/auth/verify-email"
        redirect(currentPath)
    }
    return (
        <div className="container relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <Card className="p-6">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                            <MailOpen className="h-6 w-6 text-blue-500" />
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Check your email
                        </h1>
                        {email ? (
                            <p className="text-sm text-muted-foreground">
                                We&apos;ve sent a verification link to{" "}
                                <span className="font-semibold">{email}</span>
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Please check your email for a verification link.
                            </p>
                        )}
                    </div>

                    <div className="mt-6 grid gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    What&apos;s next?
                                </span>
                            </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                            <ul className="list-disc space-y-2 pl-4">
                                <li>Check your email inbox</li>
                                <li>
                                    Click the verification link in the email
                                </li>
                                <li>
                                    You&apos;ll be redirected back to sign in
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-2 text-center text-sm">
                            <p className="text-muted-foreground">
                                Didn&apos;t receive the email?
                            </p>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/auth/resend-verification">
                                    Resend verification email
                                </Link>
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or
                                </span>
                            </div>
                        </div>

                        <Button variant="ghost" asChild>
                            <Link href="/login">Return to login</Link>
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
