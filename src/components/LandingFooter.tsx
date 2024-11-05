import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"
import { Separator } from "./ui/separator"
import { cn } from "@/lib/utils"

function FooterLogo() {
    return (
        <div className="flex items-center gap-2">
            <div className="relative size-8 flex-shrink-0 rounded-full bg-gradient-to-r from-slate-50 to-amber-100 p-1.5">
                <Image
                    src="/pragmadic.svg"
                    fill
                    alt="PRAGmadic Logo"
                    className="rounded-full object-contain object-center"
                    priority
                />
            </div>
            <span className="font-solway text-lg font-semibold tracking-tight text-foreground">
                pragmadic
            </span>
        </div>
    )
}

export function LandingFooter() {
    const footerLinks = {
        pages: [
            { label: "Dashboard", href: "/dashboard" },
            { label: "Chat", href: "/chat" },
            { label: "Profile", href: "/profile" },
            { label: "Map", href: "/onboarding/map" },
        ],
        socials: [
            {
                label: "Twitter",
                href: "https://x.com/MatthewLoh1",
                icon: <Twitter className="h-4 w-4" />,
            },
            {
                label: "Instagram",
                href: "https://www.instagram.com/mewatth",
                icon: <Instagram className="h-4 w-4" />,
            },
            {
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/matthew-loh-85957632a/",
                icon: <Linkedin className="h-4 w-4" />,
            },
            {
                label: "Github",
                href: "https://github.com/matthewloh/",
                icon: <Github className="h-4 w-4" />,
            },
        ],
        legal: [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Cookie Policy", href: "/cookies" },
        ],
        register: [
            { label: "Sign Up", href: "/signup" },
            { label: "Login", href: "/login" },
            { label: "Forgot Password", href: "/forgot-password" },
        ],
    }

    return (
        <footer className="border-t border-border bg-background">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:px-8">
                {/* Mobile View */}
                <div className="block space-y-8 md:hidden">
                    <div className="space-y-4">
                        <Link href="/">
                            <FooterLogo />
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Empowering digital nomads with AI-driven solutions
                            for seamless integration into Penang&apos;s vibrant
                            community.
                        </p>
                    </div>

                    {/* Accordion-style sections for mobile */}
                    {Object.entries(footerLinks).map(([key, links]) => (
                        <div key={key} className="space-y-3">
                            <h3 className="text-sm font-semibold capitalize text-foreground">
                                {key}
                            </h3>
                            <ul className="grid grid-cols-2 gap-2">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {"icon" in link && link.icon}
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Desktop View */}
                <div className="hidden md:flex md:flex-row md:justify-between md:gap-8">
                    <div className="max-w-xs space-y-4">
                        <Link href="/">
                            <FooterLogo />
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Empowering digital nomads with AI-driven solutions
                            for seamless integration into Penang&apos;s vibrant
                            community.
                        </p>
                    </div>

                    {Object.entries(footerLinks).map(([key, links]) => (
                        <div key={key} className="space-y-3">
                            <h3 className="text-sm font-semibold capitalize text-foreground">
                                {key}
                            </h3>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {"icon" in link && link.icon}
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <Separator className="my-8" />

                {/* Copyright and Social Icons */}
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="relative size-5 flex-shrink-0">
                            <Image
                                src="/pragmadic.svg"
                                fill
                                alt="PRAGmadic Logo"
                                className="rounded-full object-contain object-center"
                                priority
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} Pragmadic. All
                            rights reserved.
                        </p>
                    </div>

                    <div className="flex space-x-4">
                        {footerLinks.socials.map((social) => (
                            <Link
                                key={social.label}
                                href={social.href}
                                className="text-muted-foreground transition-colors hover:text-foreground"
                                aria-label={social.label}
                            >
                                {social.icon}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
