"use client"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useRemoveFiles } from "@supabase-cache-helpers/storage-react-query"
import { useDirectory } from "@supabase-cache-helpers/storage-react-query"
import { FileIcon } from "@/components/shared/FileIcon"
import { FolderOpen, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

interface FileListProps {
    folder: string
}

export function FileList({ folder }: FileListProps) {
    const supabase = useSupabaseBrowser()
    const [deletingFile, setDeletingFile] = useState<string | null>(null)

    const { data: files_data, isLoading } = useDirectory(
        supabase.storage.from("knowledge_base"),
        folder,
        {
            refetchOnWindowFocus: false,
        },
    )

    const { mutateAsync: remove, isPending: isDeleting } = useRemoveFiles(
        supabase.storage.from("knowledge_base"),
    )

    const handleDelete = async (fileName: string) => {
        const filePath = `${folder}/${fileName}`
        setDeletingFile(fileName)
        try {
            await remove([filePath], {
                onSuccess: () => {
                    toast.success("File deleted successfully")
                },
                onError: (error) => {
                    console.error("Delete error:", error)
                    toast.error(error.message || "Failed to delete file")
                },
                onSettled: () => {
                    setDeletingFile(null)
                },
            })
        } catch (error) {
            console.error("Unexpected error:", error)
            toast.error("An unexpected error occurred")
            setDeletingFile(null)
        }
    }

    const getMimeType = (fileName: string) => {
        const extension = fileName.split(".").pop()?.toLowerCase()
        const mimeTypes: Record<string, string> = {
            pdf: "application/pdf",
            doc: "application/msword",
            docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            txt: "text/plain",
            md: "text/markdown",
            // Add more mime types as needed
        }
        return mimeTypes[extension || ""] || "application/octet-stream"
    }

    const formatFileSize = (bytes: number) => {
        const units = ["B", "KB", "MB", "GB"]
        let size = bytes
        let unitIndex = 0

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024
            unitIndex++
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getFileExtension = (fileName: string) => {
        return fileName.split(".").pop()?.toUpperCase() || ""
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p>Loading files...</p>
                </div>
            </div>
        )
    }

    // Empty state
    if (!files_data || files_data.length === 0) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                    <FolderOpen className="h-8 w-8" />
                    <p>No files found in this folder</p>
                    <p className="text-sm">Upload files to get started</p>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40%]">Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Last Modified</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {files_data.map((file) => (
                        <TableRow key={file.id}>
                            <TableCell className="flex items-center space-x-2">
                                <FileIcon
                                    mimeType={getMimeType(file.name)}
                                    className="text-muted-foreground"
                                    size={16}
                                />
                                <span className="truncate" title={file.name}>
                                    {file.name}
                                </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {getFileExtension(file.name)}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {formatFileSize(file.metadata?.size || 0)}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {formatDate(file.created_at)}
                            </TableCell>
                            <TableCell>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={
                                                isDeleting &&
                                                deletingFile === file.name
                                            }
                                        >
                                            {isDeleting &&
                                            deletingFile === file.name ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Delete File
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete
                                                &quot;{file.name}?&quot; This
                                                action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => {
                                                    handleDelete(file.name)
                                                }}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
