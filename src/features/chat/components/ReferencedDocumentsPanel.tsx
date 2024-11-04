"use client"

import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { ReferencedDocument } from "@/types/documents"
import { X } from "lucide-react"
import { DocumentSelector } from "./DocumentSelector"

interface ReferencedDocumentsPanelProps {
    isOpen: boolean
    isTransitioning: boolean
    documents: ReferencedDocument[]
    onClose(): void
    onDocumentsSelected(documentIds: string[]): void
    selectedDocuments: string[]
}

export function ReferencedDocumentsPanel({
    isOpen,
    isTransitioning,
    documents,
    onClose,
    onDocumentsSelected,
    selectedDocuments,
}: ReferencedDocumentsPanelProps) {
    return (
        <>
            <ResizableHandle
                withHandle
                className={cn(
                    "transition-opacity duration-300 ease-in-out",
                    !isOpen && "pointer-events-none opacity-0",
                )}
            />
            <ResizablePanel
                defaultSize={30}
                minSize={0}
                maxSize={50}
                className={cn(
                    "transition-all duration-300 ease-in-out",
                    !isOpen && "w-0 min-w-0 max-w-0 opacity-0",
                    isTransitioning && "resize-none",
                )}
            >
                <div
                    className={cn(
                        "relative h-full overflow-hidden transition-all duration-300 ease-in-out",
                        !isOpen && "pointer-events-none opacity-0",
                    )}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 z-10"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    <div className="flex h-full flex-1 flex-col p-4">
                        <h2 className="mb-4 text-lg font-semibold underline">
                            Document Selection
                        </h2>
                        <DocumentSelector
                            selectedDocuments={selectedDocuments}
                            onSelectionChange={onDocumentsSelected}
                        />
                    </div>
                </div>
            </ResizablePanel>
        </>
    )
}
