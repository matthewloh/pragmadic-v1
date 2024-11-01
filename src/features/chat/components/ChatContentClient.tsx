"use client"

import { Button } from "@/components/ui/button"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { cn } from "@/lib/utils"
import { Message } from "ai"
import { Maximize2 } from "lucide-react"
import { useEffect, useState } from "react"
import { ChatComponent } from "./ChatComponent"
import { ChatSettingsSidebar } from "./ChatSettingsSidebar"
import { ReferencedDocumentsPanel } from "./ReferencedDocumentsPanel"
import { ModelOption, options } from "./ModelSelector"
import { ReferencedDocument } from "@/types/documents"

type ChatContentProps = {
    chatId: string
    initialMessages: Array<Message>
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
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
    const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([])
    const [selectedModel, setSelectedModel] = useState<ModelOption>(
        options.find((opt) => opt.model === "gemini-1.5-pro-002") || options[0],
    )

    useEffect(() => {
        setIsTransitioning(true)
        const timer = setTimeout(() => setIsTransitioning(false), 300)
        return () => clearTimeout(timer)
    }, [isDocPanelOpen])

    const updateReferencedDocs = (newDocs: ReferencedDocument[]) => {
        setReferencedDocs(newDocs)
        if (newDocs.length > 0 && !isDocPanelOpen) {
            setIsDocPanelOpen(true)
        }
    }

    const handleDocumentsSelected = (documentIds: string[]) => {
        setSelectedDocumentIds(documentIds)
    }

    return (
        <>
            <div className="flex h-full flex-col">
                <ResizablePanelGroup
                    direction="horizontal"
                    className="h-full flex-1"
                >
                    <ChatSettingsSidebar
                        isExpanded={isSidebarExpanded}
                        selectedModel={selectedModel}
                        onModelSelect={setSelectedModel}
                        onExpandChange={setIsSidebarExpanded}
                    />
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
                                selectedModel={selectedModel}
                                selectedDocumentIds={selectedDocumentIds}
                            />
                        </div>
                    </ResizablePanel>
                    <ReferencedDocumentsPanel
                        isOpen={isDocPanelOpen}
                        isTransitioning={isTransitioning}
                        documents={referencedDocs}
                        onClose={() => setIsDocPanelOpen(false)}
                        onDocumentsSelected={handleDocumentsSelected}
                        selectedDocuments={selectedDocumentIds}
                    />
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
