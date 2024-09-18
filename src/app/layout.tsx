import type { Metadata } from "next"
import { Inter as FontSans, Solway } from "next/font/google"
import "./globals.css"
import NextTopLoader from "nextjs-toploader"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/components/providers"
import { TailwindIndicator } from "@/components/tailwind-indicator"
const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

const solway = Solway({
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "700"],
    variable: "--font-solway",
})

export const metadata: Metadata = {
    title: {
        template: "%s | Pragmadic",
        default: "Pragmadic",
    },
    description: "Digital nomadism, remote work, and location independence.",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased",
                    fontSans.variable + " " + solway.variable,
                )}
            >
                <Providers>
                    <NextTopLoader />
                    <TailwindIndicator />
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html>
    )
}
