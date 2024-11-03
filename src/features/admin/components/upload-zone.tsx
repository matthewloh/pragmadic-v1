"use client"

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useFileStoreContext } from "@/features/admin/storage/use-file-store"
import { getUser } from "@/lib/api/users/queries"
import { getUserAuth } from "@/lib/auth/utils"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"
import { resumableUpload } from "@/utils/supabase/resumable-storage"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

type Props = {
    children: React.ReactNode
}

export function UploadZone({ children }: Props) {
    const supabase = createClient()
    const [progress, setProgress] = useState(0)
    const [showProgress, setShowProgress] = useState(false)
    const uploadProgress = useRef<number[]>([])
    const params = useParams()
    const folders = params?.folders ?? []
    const { createFolder } = useFileStoreContext((s) => s)

    const isDefaultFolder = [
        "exports",
        "inbox",
        "import",
        "transactions",
    ].includes(folders?.at(0) ?? "")

    useEffect(() => {
        let toastId: string | number | null = null

        if (showProgress) {
            toastId = toast.loading(
                `Uploading ${uploadProgress.current.length} files`,
                {
                    description: "Please do not close browser until completed",
                },
            )
        }

        return () => {
            if (toastId) {
                toast.dismiss(toastId)
            }
        }
    }, [showProgress])

    useEffect(() => {
        if (showProgress) {
            toast.loading(`Uploading ${uploadProgress.current.length} files`, {
                description: `Progress: ${progress}%`,
            })
        }
    }, [progress, showProgress])

    const onDrop = async (files: File[]) => {
        if (!files.length) return

        uploadProgress.current = files.map(() => 0)
        setShowProgress(true)

        const { session } = await getUserAuth()
        if (!session) return
        const { user } = await getUser()
        const filePath = [user?.id, ...folders]

        try {
            await Promise.all(
                files.map(async (file, idx) => {
                    await resumableUpload(supabase, {
                        bucket: "vault",
                        path: filePath as string[],
                        file,
                        onProgress: (bytesUploaded, bytesTotal) => {
                            uploadProgress.current[idx] =
                                (bytesUploaded / bytesTotal) * 100
                            const _progress = uploadProgress.current.reduce(
                                (acc, curr) => acc + curr,
                                0,
                            )
                            setProgress(Math.round(_progress / files.length))
                        },
                    })
                }),
            )

            uploadProgress.current = []
            setProgress(0)
            setShowProgress(false)
            toast.success("Upload successful")
        } catch {
            toast.error("Something went wrong. Please try again.")
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected: ([reject]) => {
            if (reject?.errors.find(({ code }) => code === "file-too-large")) {
                toast.error("File size too large")
            }
            if (
                reject?.errors.find(({ code }) => code === "file-invalid-type")
            ) {
                toast.error("File type not supported")
            }
        },
        maxSize: 8000000, // 8MB
        accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpg", ".jpeg"],
            "application/pdf": [".pdf"],
            "application/zip": [".zip"],
            "text/csv": [".csv"],
        },
    })

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div
                    {...getRootProps({
                        onClick: (evt) => evt.stopPropagation(),
                    })}
                    className="relative h-full"
                >
                    <div className="pointer-events-none absolute inset-0 z-50">
                        <div
                            className={cn(
                                "invisible flex h-full items-center justify-center bg-background text-center dark:bg-[#1A1A1A]",
                                isDragActive && "visible",
                            )}
                        >
                            <input {...getInputProps()} id="upload-files" />
                            <p className="text-xs">
                                Drop your files here, to
                                <br /> upload to this folder.
                            </p>
                        </div>
                    </div>
                    <div className="h-full overflow-scroll">{children}</div>
                </div>
            </ContextMenuTrigger>
            {!isDefaultFolder && (
                <ContextMenuContent>
                    <ContextMenuItem
                        onClick={() => createFolder({ name: "New Folder" })}
                    >
                        Create folder
                    </ContextMenuItem>
                </ContextMenuContent>
            )}
        </ContextMenu>
    )
}
