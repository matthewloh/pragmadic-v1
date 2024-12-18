import sign_in_penang_bg from "@/assets/sign-in-penang-bg.jpg"
import Image from "next/image"
import Link from "next/link"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SignInForm } from "@/features/auth/components/SignInForm"
import { Suspense } from "react"

export default function SignInPage() {
    return (
        <div className="h-full w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[540px] gap-6">
                    <Card className="h-full w-full p-8 shadow-2xl">
                        <CardHeader className="px-0 pt-0 text-center">
                            <CardTitle className="text-3xl font-bold">
                                Sign In to Continue
                            </CardTitle>
                            <CardDescription>
                                Use your email or another service to continue
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5 px-0 pb-0">
                            <Suspense fallback={<div>Loading...</div>}>
                                <SignInForm />
                            </Suspense>
                            <Separator />
                        </CardContent>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/signup"
                                className="cursor-pointer text-sky-700 underline"
                            >
                                Sign up.
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
            <div className="hidden max-h-full overflow-y-auto bg-muted lg:block">
                <Image
                    src={sign_in_penang_bg}
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.7] dark:grayscale"
                />
            </div>
        </div>
    )
}
