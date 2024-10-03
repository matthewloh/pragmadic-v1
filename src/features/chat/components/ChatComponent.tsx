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
        <div className="flex h-full flex-col bg-background text-foreground">
            <ScrollArea
                className="flex h-full flex-1 flex-col p-6 pb-0"
                ref={scrollRef}
            >
                <AnimatePresence initial={false}>
                    {messages.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center justify-center">
                                <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground" />
                                <h3 className="mt-4 text-xl font-semibold text-foreground">
                                    Start a New Conversation
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Your journey of discovery begins with a
                                    single message.
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
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className={`mb-6 flex ${
                                    m.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-4 shadow-md ${
                                        m.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-secondary-foreground"
                                    }`}
                                >
                                    <div className="mb-2 flex items-center gap-2">
                                        {m.role === "user" ? (
                                            <UserIcon className="h-5 w-5" />
                                        ) : (
                                            <BotIcon className="h-5 w-5" />
                                        )}
                                        <span className="text-sm font-medium">
                                            {m.role === "user"
                                                ? "You"
                                                : "AI Assistant"}
                                        </span>
                                    </div>
                                    {m.content.length > 0 ? (
                                        <Markdown className="prose prose-sm dark:prose-invert max-w-none">
                                            {m.content}
                                        </Markdown>
                                    ) : (
                                        <span className="text-sm font-light italic">
                                            {"Initiating: " +
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
                className="mx-6 my-4 items-center gap-3 rounded-lg bg-card shadow-lg"
                initial={false}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div className="relative flex flex-1 items-center rounded-md p-2">
                    <Textarea
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleFormSubmit(e as any)
                            }
                        }}
                        placeholder="Embark on your intellectual journey..."
                        className="min-h-[60px] w-full bg-transparent text-foreground placeholder-muted-foreground focus:outline-none focus:ring-0"
                    />
                    <div className="absolute right-4 flex items-center space-x-3">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <Paperclip className="h-5 w-5" />
                                    <span className="sr-only">Attach file</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                Enrich your query
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <Mic className="h-5 w-5" />
                                    <span className="sr-only">Voice input</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                Vocalize your thoughts
                            </TooltipContent>
                        </Tooltip>
                        <Button
                            type="submit"
                            size="icon"
                            className="rounded-full bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
                        >
                            <CornerDownLeft className="h-5 w-5" />
                            <span className="sr-only">Send Message</span>
                        </Button>
                    </div>
                </div>
            </motion.form>
            {isAtBottom && (
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
