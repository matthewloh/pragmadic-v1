"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Home, LucideIcon, Settings, Pin } from "lucide-react"
import Link from "next/link"
import { AiFillOpenAI } from "react-icons/ai"
import { IconType } from "react-icons/lib"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ChatHistoryPopover from "@/features/chat/components/ChatHistoryPopover"

type ChatSettingsSidebarIconComponentProps = {
    icon: LucideIcon | IconType
    label: string
    href: string
    isExpanded: boolean
    onClick?: () => void
}

export default function ChatSettingsSidebar() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isPinned, setIsPinned] = useState(false)
    const [expandTimeout, setExpandTimeout] = useState<NodeJS.Timeout | null>(
        null,
    )

    const handleMouseEnter = () => {
        const timeout = setTimeout(() => {
            if (!isPinned) setIsExpanded(true)
        }, 200)
        setExpandTimeout(timeout)
    }

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            if (!isPinned) setIsExpanded(false)
        }, 400)
        setExpandTimeout(timeout)
    }

    const togglePin = () => {
        setIsPinned((prev) => !prev)
    }

    useEffect(() => {
        return () => {
            if (expandTimeout) {
                clearTimeout(expandTimeout)
            }
        }
    }, [expandTimeout])

    return (
        <motion.aside
            className="flex h-full flex-col rounded-br-lg rounded-tr-lg border border-border bg-background shadow-lg dark:border-gray-700 dark:bg-gray-800"
            initial={{ width: "60px" }}
            animate={{ width: isExpanded ? "240px" : "60px" }}
            transition={{ duration: 0.3 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <nav className="flex flex-col items-center justify-center gap-2 transition-transform">
                <div
                    className={cn("flex items-center", {
                        "w-full": isExpanded,
                        "w-[60px]": !isExpanded,
                    })}
                >
                    <SidebarTrigger className="flex-1" />
                    {isExpanded && (
                        <PinSidebarButton
                            isPinned={isPinned}
                            isExpanded={isExpanded}
                            onClick={togglePin}
                        />
                    )}
                </div>
                <ChatSettingsSidebarIconComponent
                    icon={Home}
                    label="Home"
                    href="/dashboard"
                    isExpanded={isExpanded}
                />
                <ChatSettingsSidebarIconComponent
                    icon={AiFillOpenAI}
                    label="Models"
                    href="/models"
                    isExpanded={isExpanded}
                />
                <ChatHistoryPopover isExpanded={isExpanded} />
                <ChatSettingsSidebarIconComponent
                    icon={Settings}
                    label="Settings"
                    href="/chat/settings"
                    isExpanded={isExpanded}
                />
            </nav>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-auto px-4 py-4"
                    >
                        <h2 className="text-lg font-semibold text-foreground">
                            Chat Settings
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Manage your chat preferences and history.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.aside>
    )
}

function PinSidebarButton({
    isPinned,
    isExpanded,
    onClick,
}: {
    isPinned: boolean
    isExpanded: boolean
    onClick: () => void
}) {
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className={cn("h-[60px] transition-transform duration-300", {
                "text-blue-500": isPinned,
                "text-gray-500": !isPinned,
                "bg-gray-200 dark:bg-gray-700": isExpanded,
            })}
        >
            <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: isPinned ? 45 : 0 }}
                transition={{ duration: 0.3 }}
            >
                <Pin className="h-5 w-5" />
            </motion.div>
        </Button>
    )
}

function ChatSettingsSidebarIconComponent({
    icon: Icon,
    label,
    href,
    isExpanded,
    onClick,
}: ChatSettingsSidebarIconComponentProps) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                `flex w-full items-center justify-start ${isExpanded ? "px-4" : "px-0"}`,
                {
                    "py-2": isExpanded,
                },
            )}
            asChild
        >
            <Link
                href={href}
                onClick={onClick}
                className={cn("flex w-full items-center", {
                    "justify-start": isExpanded,
                    "justify-center": !isExpanded,
                })}
            >
                <Icon className="h-5 w-5" />
                <AnimatePresence>
                    {isExpanded && (
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 overflow-hidden whitespace-nowrap"
                        >
                            {label}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>
        </Button>
    )
}
