"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { ChevronDown, ChevronRight, FileText, Folder } from "lucide-react"
import { useState } from "react"

type DocumentMetadata = {
    folder: string
    fullPath: string
    pageCount: number
    originalName: string
}

export type DocumentRow = {
    id: string
    title: string | null
    created_at: string
    updated_at: string
    metadata: DocumentMetadata
    name: string
}

interface DocumentSelectorProps {
    selectedDocuments: string[]
    onSelectionChange(documentIds: string[]): void
}

export function DocumentSelector({
    selectedDocuments,
    onSelectionChange,
}: DocumentSelectorProps) {
    const supabase = useSupabaseBrowser()
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
        new Set(),
    )

    const { data: documents = [], isLoading } = useQuery(
        supabase
            .from("documents")
            .select("id, title, metadata, name, created_at, updated_at")
            .order("created_at", { ascending: true }),
    )

    // Group documents by folder using metadata
    const groupedDocuments = documents?.reduce(
        (acc, doc) => {
            const folder =
                (doc.metadata as DocumentMetadata)?.folder || "uncategorized"
            if (!acc[folder]) {
                acc[folder] = []
            }
            acc[folder].push(doc as DocumentRow)
            return acc
        },
        {} as Record<string, DocumentRow[]>,
    )

    const toggleFolder = (folder: string) => {
        const newExpanded = new Set(expandedFolders)
        if (newExpanded.has(folder)) {
            newExpanded.delete(folder)
        } else {
            newExpanded.add(folder)
        }
        setExpandedFolders(newExpanded)
    }

    const toggleDocument = (documentId: string) => {
        const newSelection = new Set(selectedDocuments)
        if (newSelection.has(documentId)) {
            newSelection.delete(documentId)
        } else {
            newSelection.add(documentId)
        }
        onSelectionChange(Array.from(newSelection))
    }

    const renderFolder = (folderName: string, docs: DocumentRow[]) => {
        const isExpanded = expandedFolders.has(folderName)
        const formattedFolderName = folderName.split("_").join(" ")

        return (
            <div key={folderName} className="space-y-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => toggleFolder(folderName)}
                >
                    <span className="flex items-center">
                        {isExpanded ? (
                            <ChevronDown className="mr-2 h-4 w-4" />
                        ) : (
                            <ChevronRight className="mr-2 h-4 w-4" />
                        )}
                        <Folder className="mr-2 h-4 w-4 text-blue-500" />
                        <span className="capitalize">
                            {formattedFolderName}
                        </span>
                    </span>
                </Button>
                {isExpanded && (
                    <div className="ml-6 space-y-1 border-l pl-4">
                        {docs.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center gap-2 py-1"
                            >
                                <Checkbox
                                    checked={selectedDocuments.includes(doc.id)}
                                    onCheckedChange={() =>
                                        toggleDocument(doc.id)
                                    }
                                />
                                <FileText className="h-4 w-4 text-gray-500" />
                                <div className="flex flex-col">
                                    <span className="text-sm">
                                        {doc.title ||
                                            doc.metadata?.originalName ||
                                            doc.name}
                                    </span>
                                    {doc.metadata?.pageCount && (
                                        <span className="text-xs text-muted-foreground">
                                            {doc.metadata.pageCount} pages
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                Loading documents...
            </div>
        )
    }

    return (
        <ScrollArea className="h-full w-full rounded-md border p-4">
            {groupedDocuments && Object.keys(groupedDocuments).length > 0 ? (
                <div className="space-y-2">
                    {Object.entries(groupedDocuments).map(([folder, docs]) =>
                        renderFolder(folder, docs),
                    )}
                </div>
            ) : (
                <div className="text-center text-muted-foreground">
                    No documents found
                </div>
            )}
        </ScrollArea>
    )
}
