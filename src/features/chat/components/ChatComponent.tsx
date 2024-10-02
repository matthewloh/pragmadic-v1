import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useChat } from "ai/react"
import { Message } from "ai"
import { nanoid } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    BotIcon,
    CornerDownLeft,
    Mic,
    Paperclip,
    UserIcon,
    ChevronDown,
} from "lucide-react"
import Markdown from "react-markdown"
import { Textarea } from "@/components/ui/textarea"
import { useScrollAnchor } from "../hooks/use-scroll-anchor"

type ReferencedDocument = {
    id: string
    title: string
    content: string
    relevance: number
}

interface ChatComponentProps {
    chatId: string
    onDocumentsReferenced: (docs: ReferencedDocument[]) => void
    isDocPanelOpen: boolean
    initialMessages: Array<Message> | undefined
}

export function ChatComponent({
    chatId,
    onDocumentsReferenced,
    isDocPanelOpen,
    initialMessages,
}: ChatComponentProps) {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        body: { chatId },
        initialMessages,
        maxSteps: 2,
    })

    const {
        messagesRef,
        scrollRef,
        visibilityRef,
        scrollToBottom,
        isAtBottom,
        isVisible,
    } = useScrollAnchor()

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        handleSubmit(e)
        setTimeout(() => {
            onDocumentsReferenced([
                {
                    id: nanoid(),
                    title: "Sample Document",
                    content: "This is a sample referenced document.",
                    relevance: 0.95,
                },
            ])
        }, 1000)
    }

    useEffect(() => {
        if (isAtBottom) {
            scrollToBottom()
        }
    }, [messages, isAtBottom, scrollToBottom])

    return (
        <div className="flex h-full flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <ScrollArea className="p-4 pb-0" ref={scrollRef}>
                <AnimatePresence initial={false}>
                    {messages.map((m, index) => (
                        <motion.div
                            key={`${chatId}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className={`mb-4 flex ${
                                m.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg p-3 ${
                                    m.role === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-700 text-gray-100"
                                }`}
                            >
                                <div className="mb-1 flex items-center gap-2">
                                    {m.role === "user" ? (
                                        <UserIcon className="h-4 w-4" />
                                    ) : (
                                        <BotIcon className="h-4 w-4" />
                                    )}
                                    <span className="text-xs font-semibold">
                                        {m.role === "user"
                                            ? "You"
                                            : "AI Assistant"}
                                    </span>
                                </div>
                                {m.content.length > 0 ? (
                                    <Markdown className="prose prose-sm prose-invert max-w-none">
                                        {m.content}
                                    </Markdown>
                                ) : (
                                    <span className="text-sm font-light italic">
                                        {"Calling tool: " +
                                            m?.toolInvocations?.[0].toolName}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div
                    ref={messagesRef}
                    className="min-h-[4px] min-w-[4px] flex-shrink-0"
                />
                <div ref={visibilityRef} className="h-4 w-full" />
            </ScrollArea>
            <motion.form
                onSubmit={handleFormSubmit}
                className="mx-2 my-2 items-center gap-3 rounded-lg bg-background shadow-md"
                initial={false}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div className="relative flex flex-1 items-center rounded-md">
                    <Textarea
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleFormSubmit(e as any)
                            }
                        }}
                        placeholder="Type your message here..."
                        className="bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-0"
                    />
                    <div className="absolute right-4 flex items-center space-x-3">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-white"
                                >
                                    <Paperclip className="h-5 w-5" />
                                    <span className="sr-only">Attach file</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                Attach File
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-white"
                                >
                                    <Mic className="h-5 w-5" />
                                    <span className="sr-only">
                                        Use Microphone
                                    </span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                Use Microphone
                            </TooltipContent>
                        </Tooltip>
                        <Button
                            type="submit"
                            size="icon"
                            className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700"
                        >
                            <CornerDownLeft className="h-5 w-5" />
                            <span className="sr-only">Send Message</span>
                        </Button>
                    </div>
                </div>
            </motion.form>
            {!!isAtBottom && (
                <Button
                    onClick={scrollToBottom}
                    className="absolute bottom-20 right-8 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 z-10"
                >
                    <ChevronDown className="h-5 w-5" />
                </Button>
            )}
        </div>
    )
}
