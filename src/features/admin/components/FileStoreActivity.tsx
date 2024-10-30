import { FileType } from "@/lib/utils"
import { createClient } from "@/utils/supabase/server"
import { Folder } from "lucide-react"
import Link from "next/link"
import { getFileStoreActivityQuery } from "../api/queries"

type FileMetadata = {
    size: number
    mimetype: FileType
    cacheControl?: string
    lastModified?: string
    contentLength?: number
}

// Update the StorageFile type
type StorageFile = {
    id: string
    name: string | null
    path_tokens: string[] | null
    metadata: FileMetadata
    created_at: string | null // Add this line
}

const defaultFolders = [
    { id: "de_rantau_visa", name: "DE Rantau Visa" },
    { id: "de_rantau_hubs", name: "DE Rantau Hubs" },
    { id: "onboarding", name: "Onboarding" },
    { id: "networking_and_events", name: "Networking And Events" },
] as const

type ProcessedFile = {
    id: string
    name: string
    path: string[]
    size: number
    mimetype: string
    createdAt: string
}

export async function FileStoreActivity() {
    const supabase = await createClient()
    const { data: storage_data } = await getFileStoreActivityQuery(supabase)
    console.log(storage_data)
    // const files: ProcessedFile[] =
    //     (storage_data
    //         ?.map((file) => {
    //             const pathTokens = [...(file.path_tokens ?? [])]
    //             const isPlaceholder =
    //                 pathTokens.at(-1) === ".emptyFolderPlaceholder"
    //             if (isPlaceholder) return null

    //             const filename = file.name?.split("/").pop() ?? file.name
    //             return {
    //                 id: file.id,
    //                 name: file.name,
    //                 path: [...pathTokens, filename].filter(Boolean) as string[],
    //                 size: (file.metadata as FileMetadata)?.size ?? 0,
    //                 mimetype:
    //                     (file.metadata as FileMetadata)?.mimetype ??
    //                     "application/octet-stream",
    //                 createdAt: file.created_at ?? new Date().toISOString(), // Add fallback for missing created_at
    //             }
    //         })
    //         .filter(Boolean) as ProcessedFile[]) ?? []
    const files = storage_data
        ?.filter(
            (file) => file.path_tokens?.pop() !== ".emptyFolderPlaceholder",
        )
        .map((file) => {
            const filename = file.name?.split("/").at(-1) ?? file.name
            return {
                id: file.id,
                name: file.name,
                path: [...(file.path_tokens ?? []), filename].filter(
                    Boolean,
                ) as string[],
                size: (file.metadata as FileMetadata)?.size ?? 0,
                mimetype:
                    (file.metadata as FileMetadata)?.mimetype ??
                    "application/octet-stream",
                createdAt: file.created_at,
            }
        })
    return (
        <div>
            <div className="flex flex-row gap-4">
                {defaultFolders.map((folder) => {
                    return (
                        <div className="w-[80px]" key={folder.id}>
                            <Link href={`/admin/chat/${folder.id}`} prefetch>
                                <div className="flex flex-col items-center text-center">
                                    <Folder className="mb-0 size-16 text-[#878787] dark:text-[#2C2C2C]" />
                                    <span className="w-[70px] text-sm">
                                        {folder.name}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
