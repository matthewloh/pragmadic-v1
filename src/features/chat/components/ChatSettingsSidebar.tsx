"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { deleteChatAction } from "@/features/chat/actions" // Import the delete action
import ChatHistoryPopover from "@/features/chat/components/ChatHistoryPopover"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import {
    Home,
    Info,
    LucideIcon,
    MessageSquarePlus,
    Pin,
    Settings,
    Trash2,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { IconType } from "react-icons/lib"
import ModelSelector, { ModelOption } from "./ModelSelector"
import { toast } from "sonner"
import { redirect, useRouter } from "next/navigation"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { ChatRow } from "@/utils/supabase/types"
import { useQueryClient } from "@tanstack/react-query"

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
    onModelSelect(model: ModelOption): void
    onExpandChange(expanded: boolean): void
    chatId: string // Add chatId prop
}

export function ChatSettingsSidebar({
    isExpanded,
    selectedModel,
    onModelSelect,
    onExpandChange,
    chatId, // Accept chatId
}: ChatSettingsSidebarProps) {
    const supabase = useSupabaseBrowser()
    const queryClient = useQueryClient()
    const { data: chat, refetch } = useQuery<ChatRow>(
        supabase.from("chats").select("*").eq("id", chatId).single(),
    )

    const [isPinned, setIsPinned] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const router = useRouter()
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

    const handleDeleteChat = async () => {
        try {
            await deleteChatAction(chatId)
            router.push("/chat")
            toast.success("Chat deleted successfully")
        } catch (error) {
            console.error("Error deleting chat:", error)
            toast.error("Error deleting chat")
        } finally {
            setIsDeleteDialogOpen(false)
            queryClient.invalidateQueries({ queryKey: ["chat-history"] })
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
                        className="mt-auto space-y-4 border-t border-border/50 p-4"
                    >
                        {chat?.description && (
                            <div className="space-y-2 rounded-lg bg-primary p-4">
                                <div className="flex items-center gap-2 rounded-lg text-primary-foreground">
                                    <Info className="h-4 w-4" />
                                    <p className="text-sm font-medium">
                                        About this chat
                                    </p>
                                </div>
                                <p className="text-sm text-primary-foreground/60">
                                    {chat.description}
                                </p>
                            </div>
                        )}
                        <div className="flex flex-col items-start justify-start gap-2">
                            <div className="flex items-center gap-2">
                                <Settings className="h-5 w-5 text-muted-foreground" />
                                <h2 className="text-lg font-semibold text-foreground">
                                    Chat Settings
                                </h2>
                            </div>
                            {!!chat && (
                                <AlertDialog
                                    open={isDeleteDialogOpen}
                                    onOpenChange={setIsDeleteDialogOpen}
                                >
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Chat
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Delete Chat
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete
                                                this chat? This action cannot be
                                                undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel
                                                onClick={() =>
                                                    setIsDeleteDialogOpen(false)
                                                }
                                            >
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleDeleteChat}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
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
