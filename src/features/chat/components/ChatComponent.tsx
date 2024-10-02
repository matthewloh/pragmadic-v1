import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { nanoid } from "@/lib/utils"
import { Message } from "ai"
import { useChat } from "ai/react"
import { AnimatePresence, motion } from "framer-motion"
import {
	BotIcon,
	ChevronDown,
	CornerDownLeft,
	MessageSquare,
	Mic,
	Paperclip,
	UserIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Markdown from "react-markdown"
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
    const router = useRouter()
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        body: { chatId },
        initialMessages,
        maxSteps: 2,
        onFinish: () => {
            router.push(`/chat/${chatId}`)
            window.history.replaceState(null, "", `/chat/${chatId}`)
        },
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
            <ScrollArea
                className="flex h-full flex-1 flex-col p-4 pb-0"
                ref={scrollRef}
            >
                <AnimatePresence initial={false}>
                    {messages.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center justify-center">
                                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-lg font-semibold text-gray-200">
                                    No messages yet
                                </h3>
                                <p className="mt-1 text-sm text-gray-400">
                                    Start a conversation to see messages here.
                                </p>
                            </div>
                        </div>
                    ) : (
                        messages.map((m, index) => (
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
                                                m?.toolInvocations?.[0]
                                                    .toolName}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                    <div
                        ref={messagesRef}
                        className="min-h-[4px] min-w-[4px] flex-shrink-0"
                    />
                    <div ref={visibilityRef} className="h-4 w-full" />
                </AnimatePresence>
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
                    className="absolute bottom-20 right-8 z-10 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700"
                >
                    <ChevronDown className="h-5 w-5" />
                </Button>
            )}
        </div>
    )
}
