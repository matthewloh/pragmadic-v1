"use client"

import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Chat } from "@/lib/db/schema/chats"
import { format, formatDistanceToNow } from "date-fns"
import {
    History as HistoryIcon,
    Home,
    LucideIcon,
    Search,
    Settings,
} from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { AiFillOpenAI } from "react-icons/ai"
import { IconType } from "react-icons/lib"
import { useChatHistory } from "../hooks/use-chat-history"

type ChatSettingsSidebarIconComponentProps = {
    icon: LucideIcon | IconType
    label: string
    href: string
}

export default function ChatSettingsSidebar() {
    const [searchTerm, setSearchTerm] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const { data: chats, isPending } = useChatHistory()

    const filteredAndGroupedHistory = useMemo(() => {
        if (!chats) return {}

        const filtered = chats.filter(
            (chat) =>
                chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                chat.messages[0]?.content
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
        )

        return filtered.reduce(
            (acc, chat) => {
                const dateKey = format(new Date(chat.createdAt), "yyyy-MM-dd")
                if (!acc[dateKey]) {
                    acc[dateKey] = []
                }
                acc[dateKey].push(chat)
                return acc
            },
            {} as Record<string, Chat[]>,
        )
    }, [chats, searchTerm])

    return (
        <aside className="hidden w-[60px] flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4">
                <SidebarTrigger />
                <ChatSettingsSidebarIconComponent
                    icon={Home}
                    label="Home"
                    href="/dashboard"
                />
                <ChatSettingsSidebarIconComponent
                    icon={AiFillOpenAI}
                    label="Models"
                    href={`/models`}
                />
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <button
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            aria-label="Chat History"
                        >
                            <HistoryIcon className="h-5 w-5" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent
                        side="right"
                        align="start"
                        className="ml-2 w-96 p-0"
                    >
                        <div className="flex items-center space-x-2 p-3">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search history..."
                                className="flex-1 border-none bg-transparent p-0 focus-visible:ring-0"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Separator />
                        <div className="max-h-[calc(100vh-900px)] overflow-y-auto">
                            {isPending ? (
                                <div className="p-3 text-center text-sm text-muted-foreground">
                                    Loading...
                                </div>
                            ) : chats && chats.length > 0 ? (
                                Object.entries(filteredAndGroupedHistory).map(
                                    ([date, items]) => (
                                        <div key={date}>
                                            <div className="sticky top-0 bg-background p-2 text-xs font-semibold text-muted-foreground">
                                                {format(
                                                    new Date(date),
                                                    "MMMM d, yyyy",
                                                )}
                                            </div>
                                            {items.map((chat) => (
                                                <Link
                                                    key={chat.id}
                                                    href={`/chat/${chat.id}`}
                                                    className="block p-3 hover:bg-muted"
                                                    onClick={() =>
                                                        setIsOpen(false)
                                                    }
                                                >
                                                    <div className="text-sm font-medium">
                                                        {chat.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(
                                                            new Date(
                                                                chat.createdAt,
                                                            ),
                                                            { addSuffix: true },
                                                        )}
                                                    </div>
                                                    <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                                        {chat.messages[0]
                                                            ?.content ||
                                                            "No messages"}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ),
                                )
                            ) : (
                                <div className="p-3 text-center text-sm text-muted-foreground">
                                    No chat history found.
                                </div>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                <ChatSettingsSidebarIconComponent
                    icon={Settings}
                    label="Settings"
                    href="/chat/settings"
                />
            </nav>
        </aside>
    )
}

function ChatSettingsSidebarIconComponent({
    icon: Icon,
    label,
    href,
}: ChatSettingsSidebarIconComponentProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href={`${href}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{label}</span>
                </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
    )
}
