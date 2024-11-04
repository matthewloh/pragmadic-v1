"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import useSupabaseBrowser from "@/utils/supabase/client"
import { Camera, User } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface ProfileUploadProps {
    value?: string | null
    onChange(url: string): void
    userId: string
}

export function ProfileUpload({ value, onChange, userId }: ProfileUploadProps) {
    const supabase = useSupabaseBrowser()
    const [isUploading, setIsUploading] = useState(false)

    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file")
            return
        }

        try {
            setIsUploading(true)

            // Create a clean filename with timestamp
            const timestamp = Date.now()
            const fileExt = file.name.split(".").pop()
            const cleanFileName = `avatar-${timestamp}.${fileExt}`

            // Create user-specific directory path
            const filePath = `users/${userId}/${cleanFileName}`

            // First, try to delete any existing avatar
            if (value) {
                try {
                    const existingPath = new URL(value).pathname
                        .split("/")
                        .slice(-3)
                        .join("/")
                    await supabase.storage
                        .from("avatars")
                        .remove([existingPath])
                } catch (error) {
                    console.warn("Failed to delete existing avatar:", error)
                }
            }

            // Upload new avatar
            const { error: uploadError, data } = await supabase.storage
                .from("avatars")
                .upload(filePath, file, {
                    upsert: false,
                    contentType: file.type,
                })

            if (uploadError) {
                throw uploadError
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from("avatars").getPublicUrl(data.path)

            onChange(publicUrl)
            toast.success("Profile picture updated!")
        } catch (error) {
            console.error("Error uploading avatar:", error)
            toast.error("Error uploading profile picture")
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
                <AvatarImage
                    src={value || ""}
                    className="object-cover"
                    alt="Profile picture"
                />
                <AvatarFallback>
                    <User className="h-16 w-16" />
                </AvatarFallback>
            </Avatar>
            <Button
                variant="outline"
                size="sm"
                className="relative"
                disabled={isUploading}
            >
                <input
                    type="file"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={handleUpload}
                    accept="image/*"
                    disabled={isUploading}
                />
                <Camera className="mr-2 h-4 w-4" />
                {isUploading ? (
                    <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Uploading...
                    </span>
                ) : (
                    "Change Picture"
                )}
            </Button>
        </div>
    )
}
