"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ChatComponent } from "@/features/chat/components/ChatComponent"
import ChatSettingsSidebar from "@/features/chat/components/ChatSettingsSidebar"
import { Message } from "ai"
import { Maximize2, X } from "lucide-react"

type ReferencedDocument = {
    id: string
    title: string
    content: string
    relevance: number
}

type ChatContentProps = {
    chatId: string
    initialMessages: Array<Message> | undefined
}

export default function ChatContentClient({
    chatId,
    initialMessages,
}: ChatContentProps) {
    const [referencedDocs, setReferencedDocs] = useState<ReferencedDocument[]>(
        [],
    )
    const [isDocPanelOpen, setIsDocPanelOpen] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)

    useEffect(() => {
        setIsTransitioning(true)
        const timer = setTimeout(() => setIsTransitioning(false), 300) // Match this with the CSS transition duration
        return () => clearTimeout(timer)
    }, [isDocPanelOpen])

    const updateReferencedDocs = (newDocs: ReferencedDocument[]) => {
        setReferencedDocs(newDocs)
        if (newDocs.length > 0 && !isDocPanelOpen) {
            setIsDocPanelOpen(true)
        }
    }

    return (
        <>
            <div className="flex h-full flex-col">
                <ResizablePanelGroup
                    direction="horizontal"
                    className="h-full flex-1"
                >
                    <ChatSettingsSidebar />
                    <ResizablePanel
                        defaultSize={70}
                        minSize={50}
                        maxSize={100}
                        className={cn(
                            "transition-all duration-300 ease-in-out",
                            isTransitioning && "resize-none",
                        )}
                    >
                        <div className="container mx-auto h-full bg-background p-0 animate-in">
                            <ChatComponent
                                chatId={chatId}
                                initialMessages={initialMessages}
                                onDocumentsReferenced={updateReferencedDocs}
                                isDocPanelOpen={isDocPanelOpen}
                            />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle
                        withHandle
                        className={cn(
                            "transition-opacity duration-300 ease-in-out",
                            !isDocPanelOpen && "pointer-events-none opacity-0",
                        )}
                    />
                    <ResizablePanel
                        defaultSize={30}
                        minSize={0}
                        maxSize={50}
                        className={cn(
                            "transition-all duration-300 ease-in-out",
                            !isDocPanelOpen && "w-0 min-w-0 max-w-0 opacity-0",
                            isTransitioning && "resize-none",
                        )}
                    >
                        <div
                            className={cn(
                                "relative h-full overflow-hidden transition-all duration-300 ease-in-out",
                                !isDocPanelOpen &&
                                    "pointer-events-none opacity-0",
                            )}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-2 z-10"
                                onClick={() => setIsDocPanelOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            <ScrollArea className="h-full p-4">
                                <h2 className="mb-4 text-lg font-semibold">
                                    Referenced Documents
                                </h2>
                                {referencedDocs.length > 0 ? (
                                    <ul className="space-y-4">
                                        {referencedDocs.map((doc) => (
                                            <li
                                                key={doc.id}
                                                className="rounded-lg border p-4"
                                            >
                                                <h3 className="mb-2 font-medium">
                                                    {doc.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {doc.content.substring(
                                                        0,
                                                        150,
                                                    )}
                                                    ...
                                                </p>
                                                <span className="mt-2 inline-block text-xs text-muted-foreground">
                                                    Relevance:{" "}
                                                    {doc.relevance.toFixed(2)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted-foreground">
                                        No documents referenced yet.
                                    </p>
                                )}
                            </ScrollArea>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
            <Button
                className={cn(
                    "fixed bottom-36 right-8 rounded-full p-2 transition-all duration-300 ease-in-out",
                    isDocPanelOpen && "pointer-events-none opacity-0",
                )}
                onClick={() => setIsDocPanelOpen(true)}
            >
                <Maximize2 className="h-5 w-5" />
            </Button>
        </>
    )
}
