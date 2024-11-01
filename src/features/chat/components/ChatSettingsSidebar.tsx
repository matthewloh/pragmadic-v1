"use client"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import ChatHistoryPopover from "@/features/chat/components/ChatHistoryPopover"
import ModelSelector, { ModelOption } from "./ModelSelector"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { Home, LucideIcon, MessageSquarePlus, Pin } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { IconType } from "react-icons/lib"

type ChatSettingsSidebarIconComponentProps = {
    icon: LucideIcon | IconType
    label: string
    href: string
    isExpanded: boolean
    onClick?: () => void
}

interface ChatSettingsSidebarProps {
    isExpanded: boolean
    selectedModel: ModelOption
    onModelSelect: (model: ModelOption) => void
    onExpandChange: (expanded: boolean) => void
}

export function ChatSettingsSidebar({
    isExpanded,
    selectedModel,
    onModelSelect,
    onExpandChange,
}: ChatSettingsSidebarProps) {
    const [isPinned, setIsPinned] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseEnter = () => {
        setIsHovered(true)
        if (!isPinned) {
            onExpandChange(true)
        }
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        if (!isPinned) {
            onExpandChange(false)
        }
    }

    const togglePin = () => {
        const newPinned = !isPinned
        setIsPinned(newPinned)
        if (!newPinned) {
            onExpandChange(false)
        }
    }

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
                    icon={MessageSquarePlus}
                    label="New Chat"
                    href="/chat"
                    isExpanded={isExpanded}
                />
                <ChatSettingsSidebarIconComponent
                    icon={Home}
                    label="Home"
                    href="/dashboard"
                    isExpanded={isExpanded}
                />
                <ModelSelector
                    isExpanded={isExpanded}
                    selectedModel={selectedModel}
                    onSelect={onModelSelect}
                />
                <ChatHistoryPopover isExpanded={isExpanded} />
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
                "flex w-full items-center",
                isExpanded ? "justify-start px-4" : "justify-center px-0",
                {
                    "py-2": isExpanded,
                },
            )}
            asChild
        >
            <Link
                href={href}
                onClick={onClick}
                className="flex w-full items-center"
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
