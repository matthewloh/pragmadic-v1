"use client"

import { FileInfo } from "@/components/aceternity/file-upload"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { nanoid } from "@/lib/utils"
import { Attachment, Message } from "ai"
import { useChat } from "ai/react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, FileIcon, MessageSquare } from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useScrollAnchor } from "../hooks/use-scroll-anchor"
import { ChatMessage } from "./ChatMessage"
import MultimodalInput from "./MultimodalInput"
import { Badge } from "@/components/ui/badge"
import { options, ModelOption } from "./ModelSelector"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { DocumentRow } from "./DocumentSelector"

type ReferencedDocument = {
    id: string
    title: string
    content: string
    relevance: number
}

interface ChatComponentProps {
    chatId: string
    initialMessages: Array<Message>
    onDocumentsReferenced: (docs: ReferencedDocument[]) => void
    isDocPanelOpen: boolean
    selectedModel: ModelOption
    selectedDocumentIds: string[]
}

export function ChatComponent({
    chatId,
    initialMessages,
    onDocumentsReferenced,
    isDocPanelOpen,
    selectedModel,
    selectedDocumentIds,
}: ChatComponentProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [selectedFilePathnames, setSelectedFilePathnames] = useState<
        string[]
    >([])

    const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([])

    const {
        messages,
        handleSubmit,
        input,
        setInput,
        append,
        handleInputChange,
        isLoading,
        stop,
    } = useChat({
        body: {
            chatId,
            selectedDocumentIds,
            model: selectedModel.model,
        },
        initialMessages,
        onFinish: () => {
            router.push(`/chat/${chatId}`)
            window.history.replaceState(null, "", `/chat/${chatId}`)
        },
        async onToolCall({ toolCall }) {
            console.log("toolCall", toolCall.toolName)
            console.log("toolCall", toolCall.toolCallId)
        },
    })

    const {
        messagesRef,
        scrollRef,
        visibilityRef,
        scrollToBottom,
        isAtBottom,
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

    const [attachments, setAttachments] = useState<Array<Attachment>>([])

    const supabase = useSupabaseBrowser()

    // Query to get the full document data for selected IDs
    const { data: selectedDocuments = [] } = useQuery(
        supabase.from("documents").select("*").in("id", selectedDocumentIds),
        {
            enabled: selectedDocumentIds.length > 0,
        },
    )

    return (
        <div className="flex h-full flex-col bg-background text-foreground">
            <ScrollArea
                className="flex h-full flex-1 flex-col p-6 pb-0"
                ref={scrollRef}
            >
                <AnimatePresence initial={false}>
                    {messages.length === 0 && <EmptyChat key="empty-chat" />}

                    {messages.map((message, index) => (
                        <ChatMessage
                            key={`message-${chatId}-${index}`}
                            message={message}
                        />
                    ))}
                    {uploadedFiles.map((file, index) => (
                        <FilePreview
                            key={`file-${chatId}-${index}`}
                            file={file}
                        />
                    ))}
                    <div
                        key="messages-anchor"
                        ref={messagesRef}
                        className="min-h-[4px] min-w-[4px] flex-shrink-0"
                    />
                    <div
                        key="visibility-anchor"
                        ref={visibilityRef}
                        className="h-4 w-full"
                    />
                </AnimatePresence>
            </ScrollArea>

            <MultimodalInput
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                stop={stop}
                attachments={attachments}
                setAttachments={setAttachments}
                messages={messages}
                append={append}
                selectedModel={selectedModel}
                selectedDocumentIds={selectedDocumentIds}
                selectedDocuments={selectedDocuments as DocumentRow[] | null}
            />
            {!isAtBottom && (
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

const EmptyChat = () => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
            <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold text-foreground">
                Start a New Conversation
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Your journey of discovery begins with a single message.
            </p>
        </div>
    </div>
)

const FilePreview = ({ file }: { file: FileInfo }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-4 flex items-center space-x-4 rounded-md bg-white p-4 shadow-sm dark:bg-neutral-900"
    >
        {file.file.type.startsWith("image/") ? (
            <Image
                src={file.preview}
                alt={file.file.name}
                width={48}
                height={48}
                className="rounded object-cover"
            />
        ) : (
            <FileIcon className="h-12 w-12 text-gray-500" />
        )}
        <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {file.file.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                {(file.file.size / 1024).toFixed(2)} KB
            </p>
        </div>
    </motion.div>
)
