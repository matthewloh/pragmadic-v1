"use client"
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/7FvfPMn2y4F
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button"
import { TriangleAlertIcon } from "lucide-react"
import Link from "next/link"
export default function AuthComponent() {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
            <div className="mx-auto w-full max-w-md space-y-6">
                <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900">
                    <div className="space-y-4">
                        <div className="flex items-center justify-center">
                            <TriangleAlertIcon className="h-8 w-8 text-red-500" />
                        </div>
                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-bold">
                                Authentication Error
                            </h1>
                            <p className="mb-4 text-gray-500 dark:text-gray-400">
                                Oops, it looks like there was a problem with
                                your login credentials. Please try again.
                            </p>
                        </div>
                        <Link href={"/login"} className="mt-4 space-y-4">
                            <Button className="mt-4 w-full">Try Again</Button>
                        </Link>
                    </div>
                </div>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    If you continue to have issues, please contact support.
                </p>
            </div>
        </div>
    )
}
