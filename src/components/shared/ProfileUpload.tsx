"use client"

import { useCallback, useState, useEffect } from "react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ImageIcon, UploadCloud, X } from "lucide-react"
import useSupabaseBrowser from "@/utils/supabase/client"
import { resumableUpload } from "@/utils/supabase/resumable-storage"

interface ProfileUploadProps {
    value?: string | null
    onChange: (url: string) => void
    className?: string
    userId: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const BUCKET_NAME = "avatars"

export function ProfileUpload({
    value,
    onChange,
    className,
    userId,
}: ProfileUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const supabase = useSupabaseBrowser()

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0]

            if (!file) return

            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                toast.error(
                    "Invalid file type. Please upload a JPEG, PNG or WebP image.",
                )
                return
            }

            if (file.size > MAX_FILE_SIZE) {
                toast.error("File too large. Maximum size is 5MB.")
                return
            }

            try {
                setUploading(true)
                setUploadProgress(0)

                // Create consistent file paths
                const fileExt = file.type.split("/")[1]
                const fileName = `profile.${fileExt}`
                const folderPath = `profiles/${userId}`
                const fullPath = `${folderPath}/${fileName}`

                // Delete existing profile picture if it exists
                if (value) {
                    try {
                        const existingPath = value.split(`${BUCKET_NAME}/`)[1]
                        if (existingPath) {
                            await supabase.storage
                                .from(BUCKET_NAME)
                                .remove([existingPath])
                        }
                    } catch (error) {
                        console.error("Error removing existing file:", error)
                    }
                }

                // Use resumable upload with correct path structure
                await resumableUpload(supabase, {
                    file: new File([file], fileName, { type: file.type }), // Use simple filename
                    bucket: BUCKET_NAME,
                    path: ["profiles", userId], // Correct path structure
                    onProgress: (bytesUploaded, bytesTotal) => {
                        const percent = (bytesUploaded / bytesTotal) * 100
                        setUploadProgress(percent)
                    },
                })

                // Wait briefly for the file to be processed
                await new Promise((resolve) => setTimeout(resolve, 1500))

                // List files to verify upload
                const { data: files } = await supabase.storage
                    .from(BUCKET_NAME)
                    .list(folderPath)

                console.log("Files in folder:", files)

                // Get the public URL using the correct path
                const {
                    data: { publicUrl },
                } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fullPath)

                console.log("Generated public URL:", publicUrl)

                // Update the form with the new URL
                onChange(publicUrl)
                toast.success("Profile picture uploaded successfully!")
            } catch (error) {
                console.error("Upload error:", error)
                toast.error("Failed to upload image. Please try again.")
            } finally {
                setUploading(false)
                setUploadProgress(0)
            }
        },
        [supabase, onChange, userId, value],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": ALLOWED_FILE_TYPES,
        },
        maxFiles: 1,
        multiple: false,
    })

    const removeImage = useCallback(async () => {
        try {
            if (value) {
                const fileExt = value.split(".").pop()
                const filePath = `profiles/${userId}/profile.${fileExt}`

                const { error } = await supabase.storage
                    .from(BUCKET_NAME)
                    .remove([filePath])

                if (error) throw error
            }
            onChange("")
            toast.success("Profile picture removed")
        } catch (error) {
            console.error("Remove error:", error)
            toast.error("Failed to remove image. Please try again.")
        }
    }, [onChange, supabase, userId, value])

    // Add debug logging for current value
    useEffect(() => {
        console.log("Current image value:", value)
    }, [value])

    console.log(value)
    return (
        <div className={cn("space-y-4", className)}>
            {value ? (
                <div className="relative mx-auto h-32 w-32">
                    <div className="relative h-full w-full rounded-full border-2 border-gray-200">
                        <Image
                            src={value}
                            alt="Profile"
                            fill
                            className="rounded-full object-cover"
                            sizes="128px"
                            onError={(e) => {
                                console.error("Image load error:", e)
                                const imgElement = e.target as HTMLImageElement
                                imgElement.src = `https://api.dicebear.com/7.x/initials/svg?seed=${userId}`
                                imgElement.style.padding = "0.5rem"
                            }}
                            unoptimized
                        />
                    </div>
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                        onClick={removeImage}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={cn(
                        "relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-50/50",
                        isDragActive && "border-primary bg-primary/10",
                        uploading && "pointer-events-none opacity-60",
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
                        {uploading ? (
                            <>
                                <UploadCloud className="h-8 w-8 animate-bounce" />
                                <p>
                                    Uploading... {Math.round(uploadProgress)}%
                                </p>
                                <Progress
                                    value={uploadProgress}
                                    className="w-24"
                                />
                            </>
                        ) : (
                            <>
                                <ImageIcon className="h-8 w-8" />
                                <p>Drag & drop or click to upload</p>
                                <p className="text-[10px]">
                                    JPEG, PNG or WebP (max. 5MB)
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
