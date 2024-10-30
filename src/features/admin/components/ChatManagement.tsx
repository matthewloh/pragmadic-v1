"use client"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"
import { FolderGrid } from "./FolderGrid"
import { useParams } from "next/navigation"
import { FileList } from "./FileList"
import React from "react"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useUpload } from "@supabase-cache-helpers/storage-react-query"
import { Loader2 } from "lucide-react"
import { ChevronDown, Slash } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { FileUpload } from "./FileUpload"

const ALLOWED_FOLDERS = [
    "de_rantau_visa",
    "de_rantau_hubs",
    "onboarding",
    "networking_and_events",
] as const

function formatFolderName(folder: string): string {
    const upperCaseWords = ["de"]
    return folder
        .split("_")
        .map((word) =>
            upperCaseWords.includes(word)
                ? word.toUpperCase()
                : word.charAt(0).toUpperCase() + word.slice(1),
        )
        .join(" ")
}

export function ChatManagement() {
    const supabase = useSupabaseBrowser()
    const [file, setFile] = useState<File | null>(null)
    const params = useParams()

    const folders = Array.isArray(params.folders) ? params.folders : []
    const currentFolder = folders[0]

    const { mutateAsync: upload, isPending } = useUpload(
        supabase.storage.from("knowledge_base"),
        {
            buildFileName: ({ fileName }) => `${currentFolder}/${fileName}`,
        },
    )

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (!file || !currentFolder) return

        try {
            await upload(
                { files: [file] },
                {
                    onSuccess: (data) => {
                        // Check if all files uploaded successfully
                        const hasError = data.some(
                            (result) => result.error !== null,
                        )
                        if (!hasError) {
                            toast.success("File uploaded successfully")
                            setFile(null)
                        }
                    },
                    onError: (error) => {
                        console.error("Upload error:", error)
                        toast.error(error.message || "Failed to upload file")
                    },
                    onSettled: (data, error) => {
                        // Reset file input regardless of success/failure
                        if (
                            error ||
                            data?.some((result) => result.error !== null)
                        ) {
                            toast.error("Upload failed")
                        }
                        setFile(null)
                    },
                },
            )
        } catch (error) {
            console.error("Unexpected error:", error)
            toast.error("An unexpected error occurred")
        }
    }

    return (
        <div className="flex h-full flex-col">
            <div className="border-b bg-background px-6 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="my-2 text-2xl font-semibold">
                        Knowledge Base Management
                    </h1>
                </div>
                <div className="mt-2">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/admin/chat">
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {currentFolder && (
                                <>
                                    <BreadcrumbSeparator>
                                        <Slash className="h-4 w-4" />
                                    </BreadcrumbSeparator>
                                    <BreadcrumbItem>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="flex items-center gap-1">
                                                {formatFolderName(
                                                    currentFolder,
                                                )}
                                                <ChevronDown className="h-4 w-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                                {ALLOWED_FOLDERS.map(
                                                    (folder) => (
                                                        <DropdownMenuItem
                                                            key={folder}
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/admin/chat/${folder}`}
                                                            >
                                                                {formatFolderName(
                                                                    folder,
                                                                )}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    ),
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </BreadcrumbItem>
                                </>
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
                {currentFolder ? (
                    <div className="space-y-6">
                        <div className="rounded-lg border bg-background p-6">
                            <FileUpload folder={currentFolder} />
                        </div>
                        <div className="rounded-lg border bg-background">
                            <FileList folder={currentFolder} />
                        </div>
                    </div>
                ) : (
                    <FolderGrid />
                )}
            </div>
        </div>
    )
}
