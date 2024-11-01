"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
import { X } from "lucide-react"
import { Document, DocumentFolder, ReferencedDocument } from "@/types/documents"
import { DocumentSelector } from "./DocumentSelector"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { useState } from "react"

interface ReferencedDocumentsPanelProps {
    isOpen: boolean
    isTransitioning: boolean
    documents: ReferencedDocument[]
    onClose: () => void
    onDocumentsSelected: (documentIds: string[]) => void
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
                    !isOpen && "pointer-events-none opacity-0"
                )}
            />
            <ResizablePanel
                defaultSize={30}
                minSize={0}
                maxSize={50}
                className={cn(
                    "transition-all duration-300 ease-in-out",
                    !isOpen && "w-0 min-w-0 max-w-0 opacity-0",
                    isTransitioning && "resize-none"
                )}
            >
                <div
                    className={cn(
                        "relative h-full overflow-hidden transition-all duration-300 ease-in-out",
                        !isOpen && "pointer-events-none opacity-0"
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
                    <div className="flex h-full flex-col">
                        <div className="p-4">
                            <h2 className="mb-4 text-lg font-semibold">Document Selection</h2>
                            <DocumentSelector
                                selectedDocuments={selectedDocuments}
                                onSelectionChange={onDocumentsSelected}
                            />
                        </div>
                        <div className="flex-1 p-4">
                            <h2 className="mb-4 text-lg font-semibold">Referenced Documents</h2>
                            <ScrollArea className="h-full">
                                {documents.length > 0 ? (
                                    <ul className="space-y-4">
                                        {documents.map((doc) => (
                                            <li
                                                key={doc.id}
                                                className="rounded-lg border p-4"
                                            >
                                                <h3 className="mb-2 font-medium">
                                                    {doc.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {doc.content.substring(0, 150)}...
                                                </p>
                                                <span className="mt-2 inline-block text-xs text-muted-foreground">
                                                    Relevance: {doc.relevance.toFixed(2)}
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
                    </div>
                </div>
            </ResizablePanel>
        </>
    )
} 