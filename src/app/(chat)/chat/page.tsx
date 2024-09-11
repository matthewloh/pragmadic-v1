"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChatComponent } from "@/features/chat/components/ChatComponent"
import ChatHeader from "@/features/chat/components/ChatHeader"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

type ChatPageSearchParams = {
    model?: string
    chatId?: string
}

type ReferencedDocument = {
    id: string
    title: string
    content: string
    relevance: number
}

export default function ChatPage({
    searchParams,
}: {
    searchParams: ChatPageSearchParams
}) {
    const modelString = searchParams.model ? `- ${searchParams.model}` : ""
    const chatId = searchParams.chatId ? searchParams.chatId : ""

    const [referencedDocs, setReferencedDocs] = useState<ReferencedDocument[]>(
        [],
    )
    const [isDocPanelOpen, setIsDocPanelOpen] = useState(true)
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
        <div className="flex h-screen w-full flex-col">
            <ChatHeader modelString={modelString} />
            <div className="flex-1 overflow-hidden">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                    <ResizablePanel
                        defaultSize={70}
                        minSize={50}
                        maxSize={100}
                        className={cn(
                            "transition-all duration-300 ease-in-out",
                            isTransitioning && "resize-none",
                        )}
                    >
                        <div className="container mx-auto h-full overflow-auto p-4 animate-in">
                            <ChatComponent
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
                variant="outline"
                size="sm"
                className={cn(
                    "absolute bottom-4 right-4 transition-all duration-300 ease-in-out",
                    isDocPanelOpen && "pointer-events-none opacity-0",
                )}
                onClick={() => setIsDocPanelOpen(true)}
            >
                <Maximize2 className="mr-2 h-4 w-4" />
                Show References
            </Button>
        </div>
    )
}
