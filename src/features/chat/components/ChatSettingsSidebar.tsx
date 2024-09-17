"use client"

import { useState, useMemo } from "react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Home,
    LucideIcon,
    Settings,
    Search,
    History as HistoryIcon,
} from "lucide-react"
import Link from "next/link"
import { AiFillOpenAI } from "react-icons/ai"
import { IconType } from "react-icons/lib"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { format, formatDistanceToNow } from "date-fns"
import { SidebarTrigger } from "@/components/ui/sidebar"

type ChatSettingsSidebarIconComponentProps = {
    icon: LucideIcon | IconType
    label: string
    href: string
}

type ChatHistoryItem = {
    id: string
    title: string
    date: Date
    preview: string
}

const chatHistoryItems: ChatHistoryItem[] = [
    {
        id: "1",
        title: "AI Ethics Discussion",
        date: new Date(2023, 4, 15),
        preview: "We discussed the implications of AI in society...",
    },
    {
        id: "2",
        title: "Machine Learning Basics",
        date: new Date(2023, 4, 14),
        preview: "Covered fundamental concepts of machine learning...",
    },
    {
        id: "3",
        title: "Natural Language Processing",
        date: new Date(2023, 4, 13),
        preview: "Explored various NLP techniques and applications...",
    },
    {
        id: "4",
        title: "Computer Vision Projects",
        date: new Date(2023, 4, 12),
        preview: "Brainstormed ideas for computer vision projects...",
    },
    {
        id: "5",
        title: "Reinforcement Learning",
        date: new Date(2023, 4, 11),
        preview: "Discussed the basics of reinforcement learning...",
    },
    {
        id: "6",
        title: "Deep Learning Architectures",
        date: new Date(2023, 3, 30),
        preview: "Compared different deep learning architectures...",
    },
    {
        id: "7",
        title: "AI in Healthcare",
        date: new Date(2023, 3, 25),
        preview: "Explored potential applications of AI in healthcare...",
    },
]

export default function ChatSettingsSidebar() {
    const [searchTerm, setSearchTerm] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const filteredAndGroupedHistory = useMemo(() => {
        const filtered = chatHistoryItems.filter(
            (item) =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.preview.toLowerCase().includes(searchTerm.toLowerCase()),
        )

        return filtered.reduce(
            (acc, item) => {
                const dateKey = format(item.date, "yyyy-MM-dd")
                if (!acc[dateKey]) {
                    acc[dateKey] = []
                }
                acc[dateKey].push(item)
                return acc
            },
            {} as Record<string, ChatHistoryItem[]>,
        )
    }, [searchTerm])

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
                            {Object.entries(filteredAndGroupedHistory).map(
                                ([date, items]) => (
                                    <div key={date}>
                                        <div className="sticky top-0 bg-background p-2 text-xs font-semibold text-muted-foreground">
                                            {format(
                                                new Date(date),
                                                "MMMM d, yyyy",
                                            )}
                                        </div>
                                        {items.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={`/chat/${item.id}`}
                                                className="block p-3 hover:bg-muted"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <div className="text-sm font-medium">
                                                    {item.title}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(
                                                        item.date,
                                                        { addSuffix: true },
                                                    )}
                                                </div>
                                                <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                                    {item.preview}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ),
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
