import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { BackButton } from "@/components/shared/BackButton"

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <main className="flex flex-grow items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 text-center">
                    <Image
                        src="/placeholder.svg"
                        alt="404 Not Found"
                        width={200}
                        height={200}
                        className="mx-auto"
                    />
                    <h1 className="mt-6 text-3xl font-extrabold text-primary">
                        Oops! Page Not Found
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        The page you&apos;re looking for doesn&apos;t exist or
                        has been moved.
                    </p>
                    <div className="mt-6">
                        <BackButton currentResource="" />
                    </div>
                    <p className="mt-6 text-xs text-muted-foreground">
                        Lost? Check out our{" "}
                        <Link
                            href="/faq"
                            className="text-primary hover:underline"
                        >
                            FAQ
                        </Link>{" "}
                        or{" "}
                        <Link
                            href="/contact"
                            className="text-primary hover:underline"
                        >
                            contact us
                        </Link>{" "}
                        for assistance.
                    </p>
                </div>
            </main>
            <footer className="py-4 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} DE Rantau Platform. All rights
                reserved.
            </footer>
        </div>
    )
}
