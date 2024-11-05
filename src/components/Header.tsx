"use client"

import georgetown from "@/assets/georgetown.jpg"
import muralwall from "@/assets/muralwall.jpg"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import UserButton from "@/features/auth/components/UserButton"
import { useUserRole } from "@/features/auth/hooks/use-user-role"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
    Building2,
    Info,
    Contact,
    Wrench,
    Image as ImageIcon,
    CheckCircle2,
    Menu,
    X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "./ui/button"

const listVariant = {
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03,
        },
    },
    hidden: {
        opacity: 0,
    },
}

const itemVariant = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
}

export function LandingHeader() {
    const pathname = usePathname()
    const [isOpen, setOpen] = useState(false)
    const [showBlur, setShowBlur] = useState(false)
    const [hidden, setHidden] = useState(false)
    const { data: { user } = {}, isPending } = useUserRole()

    const lastPath = `/${pathname.split("/").pop()}`

    const handleToggleMenu = () => {
        setOpen((prev) => {
            document.body.style.overflow = prev ? "" : "hidden"
            return !prev
        })
    }
    const handleOnClick = () => {
        setShowBlur(false)
        setHidden(true)

        setTimeout(() => {
            setHidden(false)
        }, 100)
    }

    const links = [
        {
            title: "Pragmadic",
            cover: (
                <Link
                    href="/"
                    onClick={handleOnClick}
                    className="block h-full w-full overflow-hidden"
                >
                    <Image
                        alt="Georgetown"
                        src={georgetown}
                        quality={75}
                        placeholder="blur"
                        className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                        width={423}
                        height={252}
                    />
                </Link>
            ),
            children: [
                {
                    path: "/about",
                    title: "About",
                    icon: <Info size={20} className="text-primary" />,
                },
                {
                    path: "/contact",
                    title: "Contact",
                    icon: <Contact size={20} className="text-primary" />,
                },
                {
                    path: "/services",
                    title: "Services",
                    icon: <Wrench size={20} className="text-primary" />,
                },
                {
                    path: "/portfolio",
                    title: "Portfolio",
                    icon: <ImageIcon size={20} className="text-primary" />,
                },
            ],
        },
        { title: "Dashboard", path: "/dashboard" },
        { title: "Chat", path: "/chat" },
        { title: "Hubs", path: "/hubs" },
        {
            title: "DE Rantau",
            cover: (
                <Link
                    href="/de-rantau"
                    onClick={handleOnClick}
                    className="block h-full w-full overflow-hidden"
                >
                    <Image
                        alt="Mural Wall"
                        src={muralwall}
                        quality={75}
                        placeholder="blur"
                        className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                        width={423}
                        height={252}
                    />
                </Link>
            ),
            children: [
                {
                    path: "https://mdec.my/derantau",
                    title: "DE Rantau",
                    icon: <CheckCircle2 size={20} className="text-primary" />,
                },
                {
                    path: "https://mdec.my/derantau/foreign",
                    title: "Foreign Applicants",
                    icon: <CheckCircle2 size={20} className="text-primary" />,
                },
                {
                    path: "https://mdec.my/derantau/hub",
                    title: "DE Rantau Hubs",
                    icon: <Building2 size={20} className="text-primary" />,
                },
            ],
        },
    ]

    return (
        <header
            className={cn(
                "fixed left-0 right-0 top-0 z-50 my-2 justify-center bg-transparent px-2 md:my-4 md:flex md:px-4",
                pathname === "/" &&
                    "duration-1s animate-header-slide-down-fade transition ease-in-out",
            )}
        >
            <nav className="z-20 flex h-12 items-center justify-between rounded-lg border border-border bg-background/70 px-3 backdrop-blur-xl backdrop-filter dark:bg-background/70 md:rounded-tl-lg md:rounded-tr-lg md:px-4">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                        <div className="relative mr-2 size-6 flex-shrink-0 md:size-8">
                            <Image
                                src="/pragmadic.svg"
                                fill
                                sizes="(max-width: 768px) 24px, 32px"
                                alt="PRAGmadic Logo"
                                className="rounded-full object-contain object-center"
                                priority
                            />
                        </div>
                    </Link>

                    <ul className="mx-3 hidden space-x-2 text-sm font-medium md:flex">
                        {links.map(({ path, title, children, cover }) => {
                            if (path) {
                                return (
                                    <li key={path}>
                                        <Link
                                            onClick={handleOnClick}
                                            href={path}
                                            className="inline-flex h-8 items-center justify-center px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-foreground/70"
                                        >
                                            {title}
                                        </Link>
                                    </li>
                                )
                            }

                            return (
                                <li
                                    key={title}
                                    className="group"
                                    onMouseEnter={() => setShowBlur(true)}
                                    onMouseLeave={() => setShowBlur(false)}
                                >
                                    <span className="inline-flex h-8 cursor-pointer items-center justify-center px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-foreground/70">
                                        {title}
                                    </span>

                                    {children && (
                                        <div
                                            className={cn(
                                                "absolute -left-[1px] top-[48px] flex h-0 w-[556px] overflow-hidden border-l border-r border-border bg-background transition-all duration-300 ease-in-out group-hover:h-[250px]",
                                                hidden && "hidden",
                                            )}
                                        >
                                            <ul className="flex-0 mt-2 w-[200px] space-y-5 p-4">
                                                {children.map((child) => (
                                                    <li key={child.title}>
                                                        <Link
                                                            onClick={
                                                                handleOnClick
                                                            }
                                                            href={child.path}
                                                            className="flex items-center space-x-2 text-foreground transition-colors hover:text-foreground/70"
                                                        >
                                                            <span className="text-foreground">
                                                                {child.icon}
                                                            </span>
                                                            <span className="text-sm font-medium">
                                                                {child.title}
                                                            </span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="flex-1">
                                                {cover}
                                            </div>
                                            <div className="absolute bottom-0 w-full border-b border-border" />
                                        </div>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="rounded-md p-2 text-foreground hover:bg-accent md:hidden"
                        onClick={handleToggleMenu}
                    >
                        <Menu size={24} />
                    </button>

                    {user ? (
                        <UserButton />
                    ) : (
                        <Link
                            className="text-sm font-medium text-foreground transition-colors hover:text-foreground/70"
                            href="/login"
                        >
                            Sign in
                        </Link>
                    )}
                </div>
            </nav>

            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 bg-background"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    <div className="flex h-12 items-center justify-between border-b border-border px-3">
                        <Link
                            href="/"
                            className="flex items-center"
                            onClick={handleToggleMenu}
                        >
                            <div className="relative size-6 md:size-8">
                                <Image
                                    src="/pragmadic.svg"
                                    fill
                                    sizes="(max-width: 768px) 24px, 32px"
                                    alt="PRAGmadic Logo"
                                    className="rounded-full object-contain object-center"
                                    priority
                                />
                            </div>
                        </Link>

                        <button
                            type="button"
                            className="rounded-md p-2 text-foreground hover:bg-accent"
                            onClick={handleToggleMenu}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="pb-safe-area-inset-bottom h-[calc(100vh-48px)] overflow-y-auto px-4">
                        <motion.ul
                            initial="hidden"
                            animate="show"
                            className="space-y-6 py-6"
                            variants={listVariant}
                        >
                            {links.map(({ path, title, children }) => {
                                if (path) {
                                    return (
                                        <motion.li
                                            variants={itemVariant}
                                            key={path}
                                        >
                                            <Link
                                                href={path}
                                                className="block text-lg font-medium text-primary"
                                                onClick={handleToggleMenu}
                                            >
                                                {title}
                                            </Link>
                                        </motion.li>
                                    )
                                }

                                return (
                                    <motion.li
                                        variants={itemVariant}
                                        key={title}
                                    >
                                        <Accordion type="single" collapsible>
                                            <AccordionItem
                                                value="item-1"
                                                className="border-none"
                                            >
                                                <AccordionTrigger className="p-0 text-lg font-medium">
                                                    {title}
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <ul className="mt-2 space-y-4 pl-4">
                                                        {children?.map(
                                                            (child) => (
                                                                <li
                                                                    key={
                                                                        child.path
                                                                    }
                                                                >
                                                                    <Link
                                                                        href={
                                                                            child.path
                                                                        }
                                                                        className="flex items-center gap-2 text-primary/80"
                                                                        onClick={
                                                                            handleToggleMenu
                                                                        }
                                                                    >
                                                                        {
                                                                            child.icon
                                                                        }
                                                                        <span>
                                                                            {
                                                                                child.title
                                                                            }
                                                                        </span>
                                                                    </Link>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </motion.li>
                                )
                            })}
                        </motion.ul>
                    </div>
                </motion.div>
            )}
        </header>
    )
}
