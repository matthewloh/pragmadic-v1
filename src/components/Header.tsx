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
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Building2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
    FcAbout,
    FcAdvertising,
    FcApprove,
    FcContacts,
    FcServices,
} from "react-icons/fc"
import PragmadicLogo from "./branding/pragmadic-logo"
import SidebarTooltipWrapper from "./TooltipWrapper"
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

    const { data } = useCurrentUser()

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
                <Link href="/" onClick={handleOnClick}>
                    <Image
                        alt="Cool Gama"
                        src={georgetown}
                        quality={60}
                        className="object-cover"
                    />
                </Link>
            ),
            children: [
                { path: "/about", title: "About", icon: <FcAbout size={20} /> },
                {
                    path: "/contact",
                    title: "Contact",
                    icon: <FcContacts size={20} />,
                },
                {
                    path: "/services",
                    title: "Services",
                    icon: <FcServices size={20} />,
                },
                {
                    path: "/portfolio",
                    title: "Portfolio",
                    icon: <FcAdvertising size={20} />,
                },
            ],
        },
        { title: "Pricing", path: "/pricing" },
        { title: "For Nomads", path: "/nomads" },
        { title: "For Businesses", path: "/partners" },
        {
            title: "DE Rantau",
            cover: (
                <Link href="/de-rantau" onClick={handleOnClick}>
                    <Image alt="Mural Wall" src={muralwall} quality={60} />
                </Link>
            ),
            children: [
                {
                    path: "https://mdec.my/derantau",
                    title: "DE Rantau",
                    icon: <FcApprove size={20} />,
                },
                {
                    path: "https://mdec.my/derantau/foreign",
                    title: "Foreign Applicants",
                    icon: <FcApprove size={20} />,
                },
                {
                    path: "https://mdec.my/derantau/hub",
                    title: "DE Rantau Hubs",
                    icon: <Building2 size={20} />,
                },
            ],
        },
    ]

    if (pathname.includes("chat")) {
        return null
    }
    return (
        <header
            className={cn(
                "sticky top-4 z-50 my-4 justify-center bg-transparent px-2 md:flex md:px-4",
                pathname === "/" &&
                    "duration-1s animate-header-slide-down-fade transition ease-in-out",
            )}
        >
            <nav className="z-20 flex h-12 items-center rounded-2xl border border-border bg-primary bg-opacity-70 px-4 backdrop-blur-xl backdrop-filter">
                {/* <PragmadicLogo /> */}
                <ul className="mx-3 hidden space-x-2 text-sm font-medium md:flex">
                    {links.map(({ path, title, children, cover }) => {
                        if (path) {
                            return (
                                <li key={path}>
                                    <Link
                                        onClick={handleOnClick}
                                        href={path}
                                        className="inline-flex h-8 items-center justify-center px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity duration-200 hover:opacity-70"
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
                                <span className="inline-flex h-8 cursor-pointer items-center justify-center px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity duration-200 hover:opacity-70">
                                    {title}
                                </span>

                                {children && (
                                    <div
                                        className={cn(
                                            "absolute -left-[1px] top-[48px] flex h-0 w-[676px] overflow-hidden border-l-[1px] border-r-[1px] bg-primary transition-all duration-300 ease-in-out group-hover:h-[250px]",
                                            hidden && "hidden",
                                        )}
                                    >
                                        <ul className="flex-0 mt-2 w-[200px] space-y-5 p-4">
                                            {children.map((child) => {
                                                return (
                                                    <li key={child.title}>
                                                        <Link
                                                            onClick={
                                                                handleOnClick
                                                            }
                                                            href={child.path}
                                                            className="flex items-center space-x-2 text-primary-foreground transition-opacity duration-200 hover:opacity-70"
                                                        >
                                                            <span>
                                                                {child.icon}
                                                            </span>
                                                            <span className="text-sm font-medium text-primary-foreground">
                                                                {child.title}
                                                            </span>
                                                        </Link>
                                                    </li>
                                                )
                                            })}
                                        </ul>

                                        <div className="flex-1 p-4">
                                            {cover}
                                        </div>
                                        <div className="absolute bottom-0 w-full border-b-[1px]" />
                                    </div>
                                )}
                            </li>
                        )
                    })}
                </ul>
                <button
                    type="button"
                    className="ml-auto bg-primary-foreground p-2 md:hidden"
                    onClick={() => handleToggleMenu()}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={18}
                        height={13}
                        fill="none"
                    >
                        <path
                            fill="currentColor"
                            d="M0 12.195v-2.007h18v2.007H0Zm0-5.017V5.172h18v2.006H0Zm0-5.016V.155h18v2.007H0Z"
                        />
                    </svg>
                </button>
                {data ? (
                    <div className="ml-auto hidden md:flex">
                        <SidebarTooltipWrapper description={"Go to Dashboard"}>
                            <UserButton />
                        </SidebarTooltipWrapper>
                    </div>
                ) : (
                    <Link
                        className="hidden border-l-[1px] border-border pl-4 pr-2 text-sm font-medium text-primary-foreground md:block"
                        href="/login"
                    >
                        Sign in
                    </Link>
                )}
            </nav>
            {isOpen && (
                <motion.div
                    className="fixed -top-[2px] bottom-0 left-0 right-0 z-10 h-screen bg-primary px-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="relative ml-[1px] mt-4 flex justify-between p-3 px-4">
                        <button type="button" onClick={handleToggleMenu}>
                            <span className="sr-only">Pragmadic Logo</span>
                            <PragmadicLogo />
                        </button>

                        <Button
                            type="button"
                            className="absolute right-[10px] top-2 ml-auto p-2 md:hidden"
                            onClick={handleToggleMenu}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                className="fill-primary-foreground"
                            >
                                <path fill="none" d="M0 0h24v24H0V0z" />
                                <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                            </svg>
                        </Button>
                    </div>

                    <div className="h-screen overflow-auto bg-primary pb-[150px]">
                        <motion.ul
                            initial="hidden"
                            animate="show"
                            className="mb-8 space-y-8 overflow-auto bg-primary px-3 pt-8 text-xl text-primary-foreground"
                            variants={listVariant}
                        >
                            {links.map(({ path, title, children }) => {
                                const isActive =
                                    path === "/updates"
                                        ? pathname.includes("updates")
                                        : path === lastPath
                                if (path) {
                                    return (
                                        <motion.li
                                            variants={itemVariant}
                                            key={path}
                                        >
                                            <Link
                                                href={path}
                                                className={cn(
                                                    isActive &&
                                                        "text-primary-foreground",
                                                )}
                                                onClick={handleToggleMenu}
                                            >
                                                {title}
                                            </Link>
                                        </motion.li>
                                    )
                                }

                                return (
                                    <li key={path}>
                                        <Accordion collapsible type="single">
                                            <AccordionItem
                                                value="item-1"
                                                className="border-none"
                                            >
                                                <AccordionTrigger className="flex w-full items-center justify-between p-0 font-normal hover:no-underline">
                                                    <span className="text-primary-foreground">
                                                        {title}
                                                    </span>
                                                </AccordionTrigger>

                                                {children && (
                                                    <AccordionContent className="text-xl">
                                                        <ul
                                                            className="ml-4 mt-6 space-y-8"
                                                            key={path}
                                                        >
                                                            {children.map(
                                                                (child) => {
                                                                    return (
                                                                        <li
                                                                            key={
                                                                                child.path
                                                                            }
                                                                        >
                                                                            <Link
                                                                                onClick={
                                                                                    handleToggleMenu
                                                                                }
                                                                                href={
                                                                                    child.path
                                                                                }
                                                                                className="text-primary-foreground"
                                                                            >
                                                                                {
                                                                                    child.title
                                                                                }
                                                                            </Link>
                                                                        </li>
                                                                    )
                                                                },
                                                            )}
                                                        </ul>
                                                    </AccordionContent>
                                                )}
                                            </AccordionItem>
                                        </Accordion>
                                    </li>
                                )
                            })}

                            <motion.li
                                className="mt-auto border-t-[1px] pt-8"
                                variants={itemVariant}
                            >
                                {data ? (
                                    <SidebarTooltipWrapper
                                        description={"Go to Dashboard"}
                                    >
                                        <UserButton />
                                    </SidebarTooltipWrapper>
                                ) : (
                                    <Link
                                        className="text-xl text-primary-foreground"
                                        href="/login"
                                    >
                                        Sign in
                                    </Link>
                                )}
                            </motion.li>
                        </motion.ul>
                    </div>
                </motion.div>
            )}

            <div
                className={cn(
                    "invisible fixed left-0 top-0 z-10 h-screen w-screen opacity-0 backdrop-blur-md transition-all duration-300",
                    showBlur && "opacity-100 md:visible",
                )}
            />
        </header>
    )
}
