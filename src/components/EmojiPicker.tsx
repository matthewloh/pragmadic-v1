"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const emojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
    "🤗",
    "🤔",
    "🤭",
    "🤫",
    "🤥",
    "😶",
    "😐",
    "😑",
    "😬",
    "🙄",
    "😯",
    "😦",
    "😧",
    "😮",
    "😲",
    "🥱",
    "😴",
    "🤤",
    "😪",
    "😵",
    "🤐",
    "🥴",
    "🤢",
    "🤮",
    "🤧",
    "😷",
    "🤒",
    "🤕",
    "🤑",
    "🤠",
    "😈",
    "👿",
    "👹",
    "👺",
    "🤡",
    "💩",
    "👻",
    "💀",
    "☠️",
    "👽",
    "👾",
]

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredEmojis = emojis.filter((emoji) =>
        emoji.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg border bg-background p-2 shadow-lg">
            <input
                type="text"
                placeholder="Search emojis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-2 w-full rounded-md border px-2 py-1 text-sm"
            />
            <ScrollArea className="h-40">
                <div className="grid grid-cols-8 gap-1">
                    {filteredEmojis.map((emoji, index) => (
                        <Button
                            key={index}
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => onEmojiSelect(emoji)}
                        >
                            {emoji}
                        </Button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
