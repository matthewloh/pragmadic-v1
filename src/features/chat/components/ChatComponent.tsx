"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { CreateChatAction } from "@/lib/actions/chats"
import { cn } from "@/lib/utils"
import { useChat } from "ai/react"
import { AnimatePresence, motion } from "framer-motion"
import { CornerDownLeft, Mic, Paperclip } from "lucide-react"
import { useEffect, useRef } from "react"
import Markdown from "react-markdown"

type ReferencedDocument = {
    id: string
    title: string
    content: string
    relevance: number
}

interface ChatComponentProps {
    onDocumentsReferenced: (docs: ReferencedDocument[]) => void
    isDocPanelOpen: boolean
    createChatAction: CreateChatAction
}

export function ChatComponent({
    onDocumentsReferenced,
    isDocPanelOpen,
    createChatAction,
}: ChatComponentProps) {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: "/api/chat/1234",
        maxToolRoundtrips: 2,
        body: { message: "Hello" },
    })
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
    }, [messages])

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // const newChat = await createChatAction({
        //     name: "Sample Chat",
        //     description: "This is a sample chat.",
        // })
        // console.log("New chat created:", newChat)
        handleSubmit(e)
        // Simulate document referencing (replace with actual logic)
        setTimeout(() => {
            onDocumentsReferenced([
                {
                    id: "1",
                    title: "Sample Document",
                    content: "This is a sample referenced document.",
                    relevance: 0.95,
                },
            ])
        }, 1000)
    }

    return (
        <div className="flex h-full flex-col">
            <div className="relative flex-1 overflow-hidden">
                <Badge
                    variant="outline"
                    className="absolute right-4 top-2 z-10"
                >
                    Output
                </Badge>
                <ScrollArea className="mt-10 h-full pr-4" ref={scrollAreaRef}>
                    <AnimatePresence initial={false}>
                        {messages.map((m) => (
                            <motion.div
                                key={m.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                    "mb-4 rounded-lg p-3",
                                    m.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted",
                                )}
                            >
                                <div className="mb-1 font-bold">
                                    {m.role === "user" ? "You" : "Assistant"}
                                </div>
                                {m.content.length > 0 ? (
                                    <Markdown className="prose dark:prose-invert">
                                        {m.content}
                                    </Markdown>
                                ) : (
                                    <span className="font-light italic">
                                        {"Calling tool: " +
                                            m?.toolInvocations?.[0].toolName}
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </ScrollArea>
            </div>
            <motion.form
                onSubmit={handleFormSubmit}
                className="relative mt-4 overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
                initial={false}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <Label htmlFor="message" className="sr-only">
                    Message
                </Label>
                <Input
                    id="message"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message here..."
                    className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                />
                <div className="flex items-center p-3 pt-0">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Paperclip className="size-4" />
                                <span className="sr-only">Attach file</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Attach File</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Mic className="size-4" />
                                <span className="sr-only">Use Microphone</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            Use Microphone
                        </TooltipContent>
                    </Tooltip>
                    <Button type="submit" size="sm" className="ml-auto gap-1.5">
                        Send Message
                        <CornerDownLeft className="size-3.5" />
                    </Button>
                </div>
            </motion.form>
        </div>
    )
}
