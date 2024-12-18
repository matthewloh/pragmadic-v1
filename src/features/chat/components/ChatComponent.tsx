"use client"

import { FileInfo } from "@/components/aceternity/file-upload"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { nanoid } from "@/lib/utils"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { Attachment, Message } from "ai"
import { useChat } from "ai/react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, FileIcon, MessageSquare } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAutoScroll } from "@/hooks/use-auto-scroll"
import { ChatMessage } from "./ChatMessage"
import { DocumentRow } from "./DocumentSelector"
import { ModelOption } from "./ModelSelector"
import MultimodalInput from "./MultimodalInput"

type ReferencedDocument = {
    id: string
    title: string
    content: string
    relevance: number
}

interface ChatComponentProps {
    chatId: string
    initialMessages: Array<Message>
    onDocumentsReferenced(docs: ReferencedDocument[]): void
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

    const { containerRef, scrollToBottom, handleScroll, shouldAutoScroll } =
        useAutoScroll([messages, uploadedFiles])

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
        <div className="relative flex h-full flex-col bg-background text-foreground">
            <ScrollArea
                className="flex h-full flex-1 flex-col p-6 pb-0"
                ref={containerRef}
                onScrollCapture={handleScroll}
            >
                <div className="flex flex-col">
                    <AnimatePresence initial={false} mode="wait">
                        {messages.length === 0 && (
                            <EmptyChat key="empty-chat" />
                        )}

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
                    </AnimatePresence>
                </div>
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
            {!shouldAutoScroll && (
                <Button
                    onClick={scrollToBottom}
                    className="fixed bottom-28 right-8 z-50 h-10 w-10 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700"
                    size="icon"
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
