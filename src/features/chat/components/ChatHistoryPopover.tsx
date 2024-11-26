"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Chat } from "@/lib/db/schema/chats"
import { format, formatDistanceToNow } from "date-fns"
import { History as HistoryIcon, Search } from "lucide-react"
import Link from "next/link"
import { useChatHistory } from "../hooks/use-chat-history"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useQueryClient } from "@tanstack/react-query"

type ChatHistoryPopoverProps = {
    isExpanded: boolean
}

export default function ChatHistoryPopover({
    isExpanded,
}: ChatHistoryPopoverProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const queryClient = useQueryClient()
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
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
        <Popover open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(`w-full px-4`, {
                        "justify-start": isExpanded,
                        "justify-center": !isExpanded,
                    })}
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                >
                    <div
                        className={`flex items-center ${isExpanded ? "justify-start" : "justify-center"}`}
                    >
                        <HistoryIcon className="h-5 w-5" />
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="ml-4 overflow-hidden whitespace-nowrap"
                                >
                                    History
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="right"
                align="start"
                className="flex h-[80vh] w-80 flex-col p-0"
            >
                <div className="flex shrink-0 items-center space-x-2 p-3">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search history..."
                        className="flex-1 border-none bg-transparent p-0 focus-visible:ring-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Separator className="shrink-0" />
                <div className="flex-1 overflow-y-auto">
                    {isPending ? (
                        <div className="p-3 text-center text-sm text-muted-foreground">
                            Loading...
                        </div>
                    ) : chats && chats.length > 0 ? (
                        Object.entries(filteredAndGroupedHistory).map(
                            ([date, items]) => (
                                <div key={date}>
                                    <div className="sticky top-0 bg-background p-2 text-xs font-semibold text-muted-foreground">
                                        {format(new Date(date), "MMMM d, yyyy")}
                                    </div>
                                    {items.map((chat) => (
                                        <Link
                                            key={chat.id}
                                            href={`/chat/${chat.id}`}
                                            className="block p-3 hover:bg-muted"
                                            onClick={() =>
                                                setIsHistoryOpen(false)
                                            }
                                        >
                                            <div className="text-sm font-medium">
                                                {chat.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(
                                                    new Date(chat.createdAt),
                                                    { addSuffix: true },
                                                )}
                                            </div>
                                            <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                                {chat.messages[0]?.content ||
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
    )
}
