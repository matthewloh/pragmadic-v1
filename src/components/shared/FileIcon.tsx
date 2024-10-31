import {
    FileText,
    FileImage,
    FileVideo,
    FileAudio,
    FileCode,
    File,
} from "lucide-react"

interface FileIconProps {
    mimeType: string | null
    className?: string
    size?: number
}

export function FileIcon({
    mimeType,
    className = "",
    size = 16,
}: FileIconProps) {
    if (!mimeType) return <File className={className} size={size} />

    // Handle main mime type categories
    if (mimeType.startsWith("image/")) {
        return <FileImage className={className} size={size} />
    }
    if (mimeType.startsWith("video/")) {
        return <FileVideo className={className} size={size} />
    }
    if (mimeType.startsWith("audio/")) {
        return <FileAudio className={className} size={size} />
    }

    // Handle specific file types
    switch (mimeType) {
        case "application/pdf":
            return <FileText className={className} size={size} />
        case "text/plain":
            return <FileText className={className} size={size} />
        case "text/html":
        case "application/json":
        case "application/xml":
            return <FileCode className={className} size={size} />
        default:
            return <File className={className} size={size} />
    }
}
