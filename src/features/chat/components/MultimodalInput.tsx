"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai"
import { motion } from "framer-motion"
import { CornerDownLeft, Mic, Paperclip, StopCircle } from "lucide-react"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { PreviewAttachment } from "./PreviewAttachment"
import { Badge } from "@/components/ui/badge"
import { ModelOption } from "./ModelSelector"
import { DocumentRow } from "@/features/chat/components/DocumentSelector"

const suggestedActions = [
    {
        title: "What is",
        label: "the benefits of being a DE Rantau Nomad?",
        action: "what are the benefits of being a DE Rantau Nomad?",
    },
    {
        title: "Where can I",
        label: "find nomad-certified locations?",
        action: "where can I find nomad-certified locations in Penang?",
    },
]

type ChatTextAreaProps = {
    input: string
    setInput(value: string): void
    isLoading: boolean
    stop(): void
    attachments: Array<Attachment>
    setAttachments: React.Dispatch<React.SetStateAction<Array<Attachment>>>
    messages: Array<Message>
    append(
        message: Message | CreateMessage,
        chatRequestOptions?: ChatRequestOptions,
    ): Promise<string | null | undefined>
    handleSubmit(
        event?: {
            preventDefault?: () => void
        },
        chatRequestOptions?: ChatRequestOptions,
    ): void
    selectedModel: ModelOption
    selectedDocumentIds: string[]
    selectedDocuments?: DocumentRow[] | null
}

export default function MultimodalInput({
    input,
    setInput,
    isLoading,
    stop,
    attachments,
    setAttachments,
    messages,
    append,
    handleSubmit,
    selectedModel,
    selectedDocumentIds,
    selectedDocuments = [],
}: ChatTextAreaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadQueue, setUploadQueue] = useState<Array<string>>([])

    useEffect(() => {
        if (textareaRef.current) {
            adjustHeight()
        }
    }, [input])

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value)
        adjustHeight()
    }

    const submitForm = useCallback(() => {
        handleSubmit(undefined, {
            experimental_attachments: attachments,
        })
        setAttachments([])
    }, [attachments, handleSubmit, setAttachments])

    const uploadFile = async (file: File) => {
        const formData = new FormData()
        formData.append("file", file)

        try {
            const response = await fetch(`/api/files/upload`, {
                method: "POST",
                body: formData,
            })

            if (response.ok) {
                const { data } = await response.json()
                const { path } = data

                return {
                    url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/attachments/${path}`,
                    name: file.name,
                    contentType: file.type,
                }
            } else {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
        } catch (error) {
            console.error("Error uploading file:", error)
            throw error
        }
    }

    const handleFileChange = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(event.target.files || [])

            setUploadQueue(files.map((file) => file.name))

            try {
                const uploadPromises = files.map((file) => uploadFile(file))
                const uploadedAttachments = await Promise.all(uploadPromises)

                setAttachments((currentAttachments) => [
                    ...currentAttachments,
                    ...uploadedAttachments,
                ])
            } catch (error) {
                console.error("Error uploading files:", error)
            } finally {
                setUploadQueue([])
            }
        },
        [setAttachments],
    )

    return (
        <motion.form
            onSubmit={(e) => {
                e.preventDefault()
                submitForm()
            }}
            className="mx-6 my-4 items-center gap-3 rounded-lg bg-card shadow-lg"
            initial={false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            {messages.length === 0 &&
                attachments.length === 0 &&
                uploadQueue.length === 0 && (
                    <div className="mx-auto mb-4 grid w-full gap-2 sm:grid-cols-2 md:max-w-[500px] md:px-0">
                        {suggestedActions.map((suggestedAction, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ delay: 0.05 * index }}
                                key={index}
                            >
                                <Button
                                    variant={"ghost"}
                                    onClick={async () => {
                                        await append({
                                            role: "user",
                                            content: suggestedAction.action,
                                        })
                                    }}
                                    className="flex h-full w-full flex-col whitespace-normal break-words rounded-lg border border-border p-2 text-left text-sm text-foreground transition-colors"
                                >
                                    <span className="font-medium">
                                        {suggestedAction.title}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {suggestedAction.label}
                                    </span>
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                )}
            <div className="mb-2 flex flex-wrap items-center gap-2 px-2">
                <Badge variant="secondary" className="text-xs">
                    {selectedModel.provider} - {selectedModel.name}
                </Badge>
                {selectedDocuments && selectedDocuments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {selectedDocuments.map((doc) => (
                            <Badge
                                key={doc.id}
                                variant="outline"
                                className="text-xs"
                            >
                                {doc.metadata?.originalName || doc.name}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
            <Input
                type="file"
                className="pointer-events-none fixed -left-4 -top-4 size-0.5 opacity-0"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                tabIndex={-1}
            />

            {(attachments.length > 0 || uploadQueue.length > 0) && (
                <div className="flex flex-row gap-2 overflow-x-auto p-2">
                    {attachments.map((attachment) => (
                        <PreviewAttachment
                            key={attachment.url}
                            attachment={attachment}
                        />
                    ))}

                    {uploadQueue.map((filename) => (
                        <PreviewAttachment
                            key={filename}
                            attachment={{
                                url: "",
                                name: filename,
                                contentType: "",
                            }}
                            isUploading={true}
                        />
                    ))}
                </div>
            )}

            <div className="relative flex flex-1 items-center rounded-md p-2">
                <Textarea
                    ref={textareaRef}
                    placeholder="Enter a message..."
                    value={input}
                    onChange={handleInput}
                    className="min-h-[60px] w-full bg-transparent text-foreground placeholder-muted-foreground focus:outline-none focus:ring-0"
                    rows={3}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            submitForm()
                        }
                    }}
                />
                <div className="absolute right-4 flex items-center space-x-3">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="text-muted-foreground hover:text-foreground"
                                onClick={(e) => {
                                    e.preventDefault()
                                    fileInputRef.current?.click()
                                }}
                                disabled={isLoading}
                            >
                                <Paperclip className="h-5 w-5" />
                                <span className="sr-only">Attach file</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Attach file</TooltipContent>
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
                    {isLoading ? (
                        <Button
                            type="button"
                            size="icon"
                            onClick={(e) => {
                                e.preventDefault()
                                stop()
                            }}
                            className="rounded-full bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
                        >
                            <StopCircle className="h-5 w-5" />
                            <span className="sr-only">Stop generating</span>
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            size="icon"
                            disabled={
                                input.length === 0 || uploadQueue.length > 0
                            }
                            className="rounded-full bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
                        >
                            <CornerDownLeft className="h-5 w-5" />
                            <span className="sr-only">Send Message</span>
                        </Button>
                    )}
                </div>
            </div>
        </motion.form>
    )
}
